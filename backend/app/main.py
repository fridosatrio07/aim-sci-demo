from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Any

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.calculations.anomaly_engine import run_anomaly_detection
from app.calculations.degradation_engine import run_degradation
from app.calculations.document_extraction_engine import extract_document_fields
from app.calculations.monte_carlo_engine import run_monte_carlo
from app.calculations.rbi_engine import run_rbi
from app.calculations.reliability_engine import run_reliability
from app.calculations.weibull_engine import run_weibull
from app.core.config import settings
from app.db import close_database, ping_database
from app.repository import AimRepository, utc_now
from app.schemas import (
    AssetIn,
    AssetPatch,
    CalculationRequest,
    FailureEventIn,
    FieldMappingApproval,
    InspectionRecordIn,
    ListResponse,
    ThicknessMeasurementIn,
)
from app.seed import seed_demo_facility

RISK_LEVELS = ["Low", "Medium", "High", "Very High", "Extreme"]


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Dynamic MVP backend for the Asset Integrity Management demo platform.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_origins) or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_event() -> None:
    await close_database()


def repo() -> AimRepository:
    return AimRepository()


async def _asset_or_404(asset_id: str) -> dict[str, Any]:
    asset = await repo().find_asset(asset_id)
    if asset is None:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


async def _record_calculation(kind: str, asset: dict[str, Any], result: dict[str, Any]) -> dict[str, Any]:
    run = await repo().insert_one(
        "calculation_runs",
        {
            "calculation_type": kind,
            "asset_id": asset["id"],
            "asset_tag": asset["tag_number"],
            "status": "completed",
            "started_at": utc_now(),
            "completed_at": utc_now(),
            "result": result,
            "stale": False,
        },
    )
    await repo().append_audit("calculation_run", "asset", asset["id"], {"calculation_type": kind})
    return run


async def _asset_calculation_status(asset_id: str) -> dict[str, Any]:
    runs = [run for run in await repo().list_all("calculation_runs") if run.get("asset_id") == asset_id]
    latest_by_type: dict[str, dict[str, Any]] = {}

    for run in runs:
        calculation_type = str(run.get("calculation_type", "unknown"))
        current = latest_by_type.get(calculation_type)
        run_time = str(run.get("completed_at") or run.get("updated_at") or run.get("created_at") or "")
        current_time = str(current.get("completed_at") or current.get("updated_at") or current.get("created_at") or "") if current else ""
        if current is None or run_time >= current_time:
            latest_by_type[calculation_type] = run

    stale_latest_runs = [run for run in latest_by_type.values() if run.get("stale")]
    latest_run = max(
        latest_by_type.values(),
        key=lambda run: str(run.get("completed_at") or run.get("updated_at") or run.get("created_at") or ""),
        default=None,
    )
    stale_reason = next((run.get("stale_reason") for run in stale_latest_runs if run.get("stale_reason")), None)

    return {
        "recalculation_required": len(stale_latest_runs) > 0,
        "stale_count": len(stale_latest_runs),
        "latest_run_id": latest_run.get("id") if latest_run else None,
        "latest_calculation_type": latest_run.get("calculation_type") if latest_run else None,
        "latest_completed_at": latest_run.get("completed_at") if latest_run else None,
        "stale_reason": stale_reason,
    }


async def _enrich_asset_with_trace(asset: dict[str, Any]) -> dict[str, Any]:
    return {**asset, "calculation_status": await _asset_calculation_status(asset["id"])}


def _parse_due_date(value: Any) -> date | None:
    if not value:
        return None
    text = str(value)
    for pattern in ("%Y-%m-%d", "%d %b %Y", "%d %B %Y"):
        try:
            return date.fromisoformat(text) if pattern == "%Y-%m-%d" else datetime.strptime(text, pattern).date()
        except ValueError:
            continue
    return None


def _inspection_status_for(due_date: date | None) -> tuple[str, str]:
    if due_date is None:
        return "Scheduled", "No due date"
    days = (due_date - date.today()).days
    if days < 0:
        return "Overdue", "Overdue"
    if days <= 30:
        return "Due Soon", f"{days} days left"
    return "Scheduled", f"{days} days left"


async def _upsert_rbi_assessment(asset: dict[str, Any], result: dict[str, Any]) -> dict[str, Any]:
    existing = await repo().find_one("rbi_assessments", {"asset_id": asset["id"]})
    assessment_id = existing.get("assessment_id") if existing else f"RBI-{asset['tag_number']}-LIVE"
    document = {
        "id": existing.get("id") if existing else assessment_id,
        "assessment_id": assessment_id,
        "asset_id": asset["id"],
        "asset_tag": asset["tag_number"],
        "risk_level": result["risk_level"],
        "risk_target_status": result["risk_target_status"],
        "assessment_status": asset.get("assessment_status", "In Progress"),
        "recommended_inspection_date": result["recommended_inspection_date"],
        "revalidation_due_date": asset.get("revalidation_due_date"),
        "data_confidence": "Good" if asset.get("reliability_data_readiness", 0) >= 80 else "Medium",
        "data_completeness": asset.get("reliability_data_readiness", 0),
        "selected_damage_mechanisms": existing.get("selected_damage_mechanisms", ["General Thinning", "Localized Corrosion", "CO2 Corrosion"]) if existing else ["General Thinning", "Localized Corrosion", "CO2 Corrosion"],
        "latest_calculation_result": result,
        "calculation_stale": False,
        "stale_reason": None,
        "updated_at": utc_now(),
    }
    await repo().upsert_many("rbi_assessments", [document])
    return document


async def _apply_rbi_result(asset: dict[str, Any], result: dict[str, Any]) -> dict[str, Any]:
    due = _parse_due_date(result.get("recommended_inspection_date"))
    inspection_status, inspection_due_note = _inspection_status_for(due)
    patch = {
        "current_risk_level": result["risk_level"],
        "risk_target_status": result["risk_target_status"],
        "recommended_inspection_date": result["recommended_inspection_date"],
        "next_due_date": due.isoformat() if due else asset.get("next_due_date"),
        "next_inspection_due": due.strftime("%d %b %Y") if due else asset.get("next_inspection_due"),
        "inspection_status": inspection_status,
        "inspection_due_note": inspection_due_note,
    }
    updated_asset = await repo().update_one("assets", asset["id"], patch) or asset
    await _upsert_rbi_assessment(updated_asset, result)
    return updated_asset


async def _apply_degradation_result(asset: dict[str, Any], result: dict[str, Any]) -> dict[str, Any]:
    remaining_years = float(result.get("estimated_remaining_life_years", 1))
    recommendation_days = max(30, min(365, int(remaining_years * 365 * 0.5)))
    due = date.today() + timedelta(days=recommendation_days)
    inspection_status, inspection_due_note = _inspection_status_for(due)
    patch = {
        "remaining_life_years": remaining_years,
        "limiting_component": result.get("limiting_component"),
        "recommended_inspection_date": due.isoformat(),
        "next_due_date": due.isoformat(),
        "next_inspection_due": due.strftime("%d %b %Y"),
        "inspection_status": inspection_status,
        "inspection_due_note": inspection_due_note,
    }
    updated_asset = await repo().update_one("assets", asset["id"], patch) or asset
    existing = await repo().find_one("rbi_assessments", {"asset_id": asset["id"]})
    if existing:
        await repo().update_one(
            "rbi_assessments",
            existing["id"],
            {
                "recommended_inspection_date": due.isoformat(),
                "degradation_result": result,
                "calculation_stale": False,
                "stale_reason": None,
            },
        )
    return updated_asset


async def _run_recalculation_suite(asset: dict[str, Any]) -> dict[str, Any]:
    inspections, thickness, failures, maintenance = await _calculation_inputs(asset)
    results = {
        "rbi": run_rbi(asset, thickness, failures),
        "reliability": run_reliability(asset, failures, maintenance),
        "degradation": run_degradation(asset, thickness),
        "anomaly_detection": run_anomaly_detection(asset, inspections, thickness),
    }
    runs = []
    for kind, result in results.items():
        runs.append(await _record_calculation(kind, asset, result))
        if kind == "rbi":
            asset = await _apply_rbi_result(asset, result)
        if kind == "degradation":
            asset = await _apply_degradation_result(asset, result)
    await repo().append_audit("asset_recalculated", "asset", asset["id"], {"calculation_types": list(results.keys())})
    return {"runs": runs, "results": results}


@app.get("/health")
async def health() -> dict[str, Any]:
    database_ok = await ping_database()
    return {
        "status": "ok",
        "database_mode": settings.database_mode,
        "database_connected": database_ok,
        "service": settings.app_name,
    }


@app.post("/seed/demo-facility")
async def seed_demo() -> dict[str, Any]:
    return await seed_demo_facility(repo())


@app.get("/assets", response_model=ListResponse)
async def list_assets(
    search: str = "",
    site: str = "",
    unit: str = "",
    equipment_type: str = "",
    risk_level: str = "",
) -> dict[str, Any]:
    items = await repo().list_all("assets")

    def matches(item: dict[str, Any]) -> bool:
        haystack = " ".join(
            str(value)
            for value in [
                item.get("tag_number"),
                item.get("asset_name"),
                item.get("equipment_class"),
                item.get("service"),
                " ".join(item.get("document_keywords", [])),
                " ".join(item.get("failure_record_keywords", [])),
            ]
        ).lower()
        return (
            (not search or search.lower() in haystack)
            and (not site or item.get("site") == site)
            and (not unit or item.get("unit") == unit)
            and (not equipment_type or item.get("equipment_type") == equipment_type)
            and (not risk_level or item.get("current_risk_level") == risk_level)
        )

    filtered = [item for item in items if matches(item)]
    enriched = []
    for item in filtered:
        enriched.append(await _enrich_asset_with_trace(item))
    return {"items": enriched, "total": len(enriched), "source": "backend"}


@app.get("/assets/{asset_id}")
async def get_asset(asset_id: str) -> dict[str, Any]:
    return await _enrich_asset_with_trace(await _asset_or_404(asset_id))


@app.post("/assets")
async def create_asset(asset: AssetIn) -> dict[str, Any]:
    due = date.today() + timedelta(days=365)
    inspection_status, inspection_due_note = _inspection_status_for(due)
    document = {
        "id": asset.tag_number,
        "tag_number": asset.tag_number,
        "asset_name": asset.asset_name,
        "equipment_class": asset.equipment_class,
        "equipment_type": asset.equipment_type,
        "taxonomy_level": "Equipment Unit",
        "site": asset.site,
        "area": asset.area,
        "unit": asset.unit,
        "system": asset.system,
        "unit_system": f"{asset.unit} / {asset.system}",
        "service": asset.service,
        "current_risk_level": "Medium",
        "asset_criticality": "B",
        "boundary_status": "Defined",
        "reliability_data_readiness": 60,
        "linked_safety_functions": "-",
        "safety_critical": False,
        "next_due_date": due.isoformat(),
        "next_inspection_due": due.strftime("%d %b %Y"),
        "inspection_due_note": inspection_due_note,
        "inspection_status": inspection_status,
        "certification_status": "Valid",
        "document_keywords": [],
        "failure_record_keywords": [],
        "assessment_status": "Draft",
        "risk_target_status": "Acceptable",
    }
    await repo().upsert_many("assets", [document])
    await repo().append_audit("asset_created", "asset", document["id"], document)
    return await _enrich_asset_with_trace(document)


@app.put("/assets/{asset_id}")
async def update_asset(asset_id: str, patch: AssetPatch) -> dict[str, Any]:
    asset = await _asset_or_404(asset_id)
    updated = await repo().update_one("assets", asset["id"], patch.model_dump(exclude_none=True))
    if updated is None:
        raise HTTPException(status_code=404, detail="Asset not found")
    await _mark_asset_calculations_stale(asset["id"], "asset master data updated")
    return await _enrich_asset_with_trace(updated)


@app.get("/assets/{asset_id}/inspection-history", response_model=ListResponse)
async def inspection_history(asset_id: str) -> dict[str, Any]:
    asset = await _asset_or_404(asset_id)
    items = await repo().filter_by_asset("inspection_records", asset["id"])
    return {"items": items, "total": len(items)}


@app.post("/assets/{asset_id}/inspection-records")
async def create_inspection_record(asset_id: str, record: InspectionRecordIn) -> dict[str, Any]:
    asset = await _asset_or_404(asset_id)
    document = {"asset_id": asset["id"], "asset_tag": asset["tag_number"], **record.model_dump()}
    created = await repo().insert_one("inspection_records", document)
    await _mark_asset_calculations_stale(asset["id"], "inspection record added")
    return created


@app.get("/assets/{asset_id}/thickness-measurements", response_model=ListResponse)
async def thickness_measurements(asset_id: str) -> dict[str, Any]:
    asset = await _asset_or_404(asset_id)
    items = await repo().filter_by_asset("thickness_measurements", asset["id"])
    return {"items": items, "total": len(items)}


@app.post("/assets/{asset_id}/thickness-measurements")
async def create_thickness_measurement(asset_id: str, measurement: ThicknessMeasurementIn) -> dict[str, Any]:
    asset = await _asset_or_404(asset_id)
    document = {"asset_id": asset["id"], "asset_tag": asset["tag_number"], **measurement.model_dump()}
    created = await repo().insert_one("thickness_measurements", document)
    await _mark_asset_calculations_stale(asset["id"], "thickness measurement added")
    return created


@app.get("/assets/{asset_id}/failure-events", response_model=ListResponse)
async def failure_events(asset_id: str) -> dict[str, Any]:
    asset = await _asset_or_404(asset_id)
    items = await repo().filter_by_asset("failure_events", asset["id"])
    return {"items": items, "total": len(items)}


@app.post("/assets/{asset_id}/failure-events")
async def create_failure_event(asset_id: str, event: FailureEventIn) -> dict[str, Any]:
    asset = await _asset_or_404(asset_id)
    document = {"asset_id": asset["id"], "asset_tag": asset["tag_number"], **event.model_dump()}
    created = await repo().insert_one("failure_events", document)
    await _mark_asset_calculations_stale(asset["id"], "failure event added")
    return created


@app.post("/documents/upload")
async def upload_document(file: UploadFile = File(...), asset_id: str = "") -> dict[str, Any]:
    asset = await repo().find_asset(asset_id) if asset_id else None
    document = await repo().insert_one(
        "documents",
        {
            "title": file.filename,
            "document_type": file.content_type or "application/octet-stream",
            "asset_id": asset.get("id") if asset else asset_id,
            "asset_tag": asset.get("tag_number") if asset else asset_id,
            "revision": "1.0",
            "source": "Upload",
            "status": "uploaded",
            "last_updated": utc_now(),
        },
    )
    return document


@app.get("/documents", response_model=ListResponse)
async def list_documents() -> dict[str, Any]:
    items = await repo().list_all("documents")
    return {"items": items, "total": len(items)}


@app.get("/documents/{document_id}")
async def get_document(document_id: str) -> dict[str, Any]:
    document = await repo().find_one("documents", {"id": document_id})
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@app.post("/documents/{document_id}/extract")
async def extract_document(document_id: str) -> dict[str, Any]:
    document = await get_document(document_id)
    extracted = extract_document_fields(document)
    await repo().upsert_many("extracted_fields", [{"id": f"EXT-{document_id}", **extracted}])
    await repo().append_audit("document_extracted", "document", document_id, extracted)
    return extracted


@app.post("/documents/{document_id}/approve-field-mapping")
async def approve_field_mapping(document_id: str, approval: FieldMappingApproval) -> dict[str, Any]:
    document = await get_document(document_id)
    approved_fields = approval.approved_fields
    controlled = await repo().insert_one(
        "controlled_data",
        {
            "document_id": document_id,
            "asset_id": document.get("asset_id"),
            "asset_tag": document.get("asset_tag"),
            "status": "approved",
            "reviewer": approval.reviewer,
            "comment": approval.comment,
            "approved_fields": approved_fields,
        },
    )
    if document.get("asset_id"):
        asset_patch = {
            key: approved_fields[key]
            for key in [
                "asset_name",
                "equipment_class",
                "equipment_type",
                "unit",
                "system",
                "service",
                "current_risk_level",
                "asset_criticality",
                "boundary_status",
                "reliability_data_readiness",
                "next_inspection_due",
                "inspection_due_note",
                "inspection_status",
                "certification_status",
                "assessment_status",
                "risk_target_status",
                "recommended_inspection_date",
                "revalidation_due_date",
            ]
            if key in approved_fields
        }
        if asset_patch:
            await repo().update_one("assets", document["asset_id"], asset_patch)
        await _mark_asset_calculations_stale(document["asset_id"], "document field mapping approved")
    return controlled


async def _calculation_inputs(asset: dict[str, Any]) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]]]:
    inspections = await repo().filter_by_asset("inspection_records", asset["id"])
    thickness = await repo().filter_by_asset("thickness_measurements", asset["id"])
    failures = await repo().filter_by_asset("failure_events", asset["id"])
    maintenance = await repo().filter_by_asset("maintenance_events", asset["id"])
    return inspections, thickness, failures, maintenance


@app.post("/calculations/rbi/{asset_id}")
async def calculate_rbi(asset_id: str, request: CalculationRequest | None = None) -> dict[str, Any]:
    asset = await _asset_or_404(asset_id)
    _, thickness, failures, _ = await _calculation_inputs(asset)
    result = run_rbi(asset, thickness, failures)
    run = await _record_calculation("rbi", asset, result)
    updated_asset = await _apply_rbi_result(asset, result)
    return {"run": run, "result": result, "asset": await _enrich_asset_with_trace(updated_asset), "request": request.model_dump() if request else {}}


@app.post("/calculations/reliability/{asset_id}")
async def calculate_reliability(asset_id: str, request: CalculationRequest | None = None) -> dict[str, Any]:
    asset = await _asset_or_404(asset_id)
    _, _, failures, maintenance = await _calculation_inputs(asset)
    result = run_reliability(asset, failures, maintenance)
    run = await _record_calculation("reliability", asset, result)
    return {"run": run, "result": result, "request": request.model_dump() if request else {}}


@app.post("/calculations/weibull/{asset_id}")
async def calculate_weibull(asset_id: str) -> dict[str, Any]:
    asset = await _asset_or_404(asset_id)
    _, _, failures, _ = await _calculation_inputs(asset)
    result = run_weibull(asset, failures)
    return {"run": await _record_calculation("weibull", asset, result), "result": result}


@app.post("/calculations/monte-carlo/{asset_id}")
async def calculate_monte_carlo(asset_id: str) -> dict[str, Any]:
    asset = await _asset_or_404(asset_id)
    result = run_monte_carlo(asset)
    return {"run": await _record_calculation("monte_carlo", asset, result), "result": result}


@app.post("/calculations/degradation/{asset_id}")
async def calculate_degradation(asset_id: str) -> dict[str, Any]:
    asset = await _asset_or_404(asset_id)
    _, thickness, _, _ = await _calculation_inputs(asset)
    result = run_degradation(asset, thickness)
    run = await _record_calculation("degradation", asset, result)
    updated_asset = await _apply_degradation_result(asset, result)
    return {"run": run, "result": result, "asset": await _enrich_asset_with_trace(updated_asset)}


@app.post("/calculations/anomaly-detection/{asset_id}")
async def calculate_anomaly_detection(asset_id: str) -> dict[str, Any]:
    asset = await _asset_or_404(asset_id)
    inspections, thickness, _, _ = await _calculation_inputs(asset)
    result = run_anomaly_detection(asset, inspections, thickness)
    return {"run": await _record_calculation("anomaly_detection", asset, result), "result": result}


@app.get("/calculations/runs", response_model=ListResponse)
async def calculation_runs(asset_id: str = "", stale: bool | None = None) -> dict[str, Any]:
    items = await repo().list_all("calculation_runs")
    if asset_id:
        items = [item for item in items if item.get("asset_id") == asset_id or item.get("asset_tag") == asset_id]
    if stale is not None:
        items = [item for item in items if bool(item.get("stale")) is stale]
    return {"items": items, "total": len(items)}


@app.get("/calculations/runs/{run_id}")
async def calculation_run(run_id: str) -> dict[str, Any]:
    run = await repo().find_one("calculation_runs", {"id": run_id})
    if run is None:
        raise HTTPException(status_code=404, detail="Calculation run not found")
    return run


@app.get("/assets/{asset_id}/calculation-status")
async def asset_calculation_status(asset_id: str) -> dict[str, Any]:
    asset = await _asset_or_404(asset_id)
    return await _asset_calculation_status(asset["id"])


@app.post("/calculations/recalculate/{asset_id}")
async def recalculate_asset(asset_id: str) -> dict[str, Any]:
    asset = await _asset_or_404(asset_id)
    recalculation = await _run_recalculation_suite(asset)
    return {
        **recalculation,
        "asset": await _enrich_asset_with_trace(asset),
        "calculation_status": await _asset_calculation_status(asset["id"]),
    }


@app.get("/dashboard/summary")
async def dashboard_summary() -> dict[str, Any]:
    assets = await repo().list_all("assets")
    assessments = await repo().list_all("rbi_assessments")
    statuses = [await _asset_calculation_status(item["id"]) for item in assets]
    recalculation_required_assets = sum(1 for status in statuses if status["recalculation_required"])
    assessed_asset_ids = {item.get("asset_id") for item in assessments if item.get("asset_id")}
    risk_distribution = [
        {
            "label": level,
            "value": sum(1 for item in assessments if item.get("risk_level") == level),
        }
        for level in RISK_LEVELS
    ]
    overdue_count = sum(
        1
        for item in assets
        if (due := _parse_due_date(item.get("next_due_date") or item.get("recommended_inspection_date") or item.get("next_inspection_due"))) is not None
        and due < date.today()
    )
    return {
        "total_assets": len(assets),
        "assessed_assets": len(assessed_asset_ids),
        "high_risk_assets": sum(1 for item in assets if item.get("current_risk_level") in {"Extreme", "Very High", "High"}),
        "overdue_inspections": overdue_count,
        "average_data_readiness": round(sum(item.get("reliability_data_readiness", 0) for item in assets) / max(len(assets), 1), 1),
        "risk_distribution": risk_distribution,
        "recalculation_required_assets": recalculation_required_assets,
        "stale_calculations": sum(status["stale_count"] for status in statuses),
    }


@app.get("/risk-register", response_model=ListResponse)
async def risk_register() -> dict[str, Any]:
    assessments = await repo().list_all("rbi_assessments")
    assets = {}
    for asset in await repo().list_all("assets"):
        assets[asset["id"]] = await _enrich_asset_with_trace(asset)
    items = [{**item, "asset": assets[item.get("asset_id")]} for item in assessments if item.get("asset_id") in assets]
    return {"items": items, "total": len(items)}


@app.get("/inspection-plan", response_model=ListResponse)
async def inspection_plan() -> dict[str, Any]:
    assets = await repo().list_all("assets")
    items = [
        {
            "asset_id": item["id"],
            "tag_number": item["tag_number"],
            "asset_name": item["asset_name"],
            "next_due_date": item.get("next_due_date") or item.get("recommended_inspection_date"),
            "recommended_inspection_date": item.get("recommended_inspection_date"),
            "inspection_status": _inspection_status_for(_parse_due_date(item.get("next_due_date") or item.get("recommended_inspection_date")))[0],
            "risk_level": item.get("current_risk_level"),
            "calculation_status": await _asset_calculation_status(item["id"]),
        }
        for item in assets
    ]
    return {"items": items, "total": len(items)}


@app.get("/reports/asset-summary/{asset_id}")
async def asset_summary_report(asset_id: str) -> dict[str, Any]:
    asset = await _asset_or_404(asset_id)
    inspections, thickness, failures, _ = await _calculation_inputs(asset)
    return {
        "asset": asset,
        "inspection_history": inspections,
        "thickness_measurements": thickness,
        "failure_events": failures,
        "generated_at": utc_now(),
        "format": "json-prototype",
    }


@app.get("/reports/history", response_model=ListResponse)
async def report_history() -> dict[str, Any]:
    assets = await repo().list_all("assets")
    documents = await repo().list_all("documents")
    generated = []
    for index, document in enumerate(documents[:12]):
        asset = next((item for item in assets if item["id"] == document.get("asset_id")), None)
        generated.append(
            {
                "reportName": f"{document.get('asset_tag', 'AIM')}_Integrity_Report_{date.today().strftime('%Y%m%d')}.pdf",
                "reportType": document.get("document_type", "Asset Integrity Summary"),
                "generatedBy": "AIM Backend",
                "generatedDate": utc_now(),
                "format": "PDF",
                "dateRange": f"{(date.today() - timedelta(days=30)).isoformat()} - {date.today().isoformat()}",
                "status": "Completed",
                "fileSize": f"{1.2 + index * 0.08:.2f} MB",
                "assetTag": asset.get("tag_number") if asset else document.get("asset_tag"),
            }
        )
    return {"items": generated, "total": len(generated)}


@app.get("/reports/portfolio-summary")
async def portfolio_summary_report() -> dict[str, Any]:
    return {
        "dashboard": await dashboard_summary(),
        "risk_register": await risk_register(),
        "inspection_plan": await inspection_plan(),
        "generated_at": utc_now(),
    }


async def _mark_asset_calculations_stale(asset_id: str, reason: str) -> None:
    runs = await repo().list_all("calculation_runs")
    for run in runs:
        if run.get("asset_id") == asset_id:
            await repo().update_one("calculation_runs", run["id"], {"stale": True, "stale_reason": reason})
    assessment = await repo().find_one("rbi_assessments", {"asset_id": asset_id})
    if assessment:
        await repo().update_one("rbi_assessments", assessment["id"], {"calculation_stale": True, "stale_reason": reason})
    await repo().append_audit("calculations_marked_stale", "asset", asset_id, {"reason": reason})
