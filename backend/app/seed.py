from __future__ import annotations

from datetime import date, timedelta
from typing import Any

from app.repository import AimRepository, REQUIRED_COLLECTIONS, utc_now

CANONICAL_FACILITY_NAME = "SPM-01 Instalasi Stasiun Pengumpul Minyak Demo Facility"
CANONICAL_FACILITY_ID = "spm-01-demo-facility"


BASE_ASSETS: list[dict[str, Any]] = [
    ("V-101", "Production Separator", "Pressure Vessel", "Pressure Vessel", "Process Unit", "Separator System", "Oil, gas, and produced water separation", "Extreme", "A", 92),
    ("P-201A", "Condensate Pump", "Pump", "Pump", "Process Unit", "Condensate System", "Condensate", "High", "A", 88),
    ("T-501", "Storage Tank", "Atmospheric Storage Tank", "Storage Tank", "Fuel System", "Fuel System", "Fuel Oil", "High", "A", 90),
    ("E-301", "Heat Exchanger", "Heat Exchanger", "Heat Exchanger", "Process Unit", "Steam System", "Steam", "High", "B", 85),
    ("PSV-101", "Pressure Safety Valve", "Safety Valve", "Safety Valve", "V-101 Protection System", "Protection System", "Steam / Gas Relief", "High", "A", 94),
    ("BDV-101", "Blowdown Valve", "Valve", "Valve", "V-101 Protection System", "Protection System", "Steam / Condensate", "Medium", "A", 76),
    ("LT-101", "Level Transmitter", "Level Instrument", "Instrument", "Measurement & Control System", "Measurement & Control System", "Condensate Level", "Medium", "B", 65),
    ("PT-101", "Pressure Transmitter", "Pressure Instrument", "Instrument", "Measurement & Control System", "Measurement & Control System", "Pressure Measurement", "Medium", "B", 63),
    ("E-205", "Air Cooler", "Heat Exchanger", "Heat Exchanger", "Utility System", "Utility System", "Cooling Air", "Low", "C", 70),
    ("C-101", "Chemical Dosing Pump", "Pump", "Pump", "Chemical Injection System", "Chemical Injection System", "MEG / Corrosion Inhibitor", "Low", "C", 68),
]

EQUIPMENT_POOL = [
    ("V", "Test Separator", "Pressure Vessel", "Pressure Vessel", "Process Unit", "Separator System"),
    ("P", "Transfer Pump", "Pump", "Pump", "Injection Unit", "Produced Water System"),
    ("T", "Condensate Tank", "Atmospheric Storage Tank", "Storage Tank", "Storage Unit", "Tank Farm"),
    ("E", "Plate Heat Exchanger", "Heat Exchanger", "Heat Exchanger", "Utility System", "Cooling System"),
    ("PL", "Production Piping Circuit", "Piping Circuit", "Piping", "Process Unit", "Wet Gas Piping"),
    ("XV", "Shutdown Valve", "Valve", "Valve", "Protection System", "ESD System"),
]


def _asset_from_tuple(index: int, item: tuple[Any, ...]) -> dict[str, Any]:
    tag, name, equipment_class, equipment_type, unit, system, service, risk, criticality, readiness = item
    overdue = index < 4
    due_date = date.today() - timedelta(days=4 + index) if overdue else date.today() + timedelta(days=30 + index * 7)
    revalidation_date = due_date + timedelta(days=30)
    safety = criticality == "A" or tag.startswith(("PSV", "BDV", "XV"))
    return {
        "id": tag,
        "tag_number": tag,
        "asset_name": name,
        "equipment_class": equipment_class,
        "equipment_type": equipment_type,
        "taxonomy_level": "Component / Maintainable Item" if equipment_type == "Instrument" else "Equipment Unit",
        "site": CANONICAL_FACILITY_NAME,
        "area": "Protection System" if safety else "Process Area",
        "unit": unit,
        "system": system,
        "unit_system": f"{unit} / {system}" if unit != system else system,
        "service": service,
        "current_risk_level": risk,
        "asset_criticality": criticality,
        "boundary_status": "Safety-Critical" if tag.startswith("PSV") else "Defined",
        "reliability_data_readiness": readiness,
        "linked_safety_functions": "1 safety function" if safety else "-",
        "safety_critical": safety,
        "next_due_date": due_date.isoformat(),
        "next_inspection_due": due_date.strftime("%d %b %Y"),
        "inspection_due_note": "Overdue" if overdue else f"{max((due_date - date.today()).days, 0)} days left",
        "inspection_status": "Overdue" if overdue else "Scheduled",
        "certification_status": "Expiring Soon" if tag in {"P-201A", "BDV-101"} else "Valid",
        "document_keywords": ["inspection report", "datasheet", "RBI assessment", tag],
        "failure_record_keywords": ["corrosion", "leak", "vibration"] if risk in {"Extreme", "High"} else ["preventive maintenance"],
        "operating_hours": 42000 + index * 280,
        "assessment_status": "Approved" if index % 4 == 0 else "Under Review" if index % 3 == 0 else "In Progress",
        "risk_target_status": "Exceeded" if risk in {"Extreme", "High"} else "Acceptable",
        "recommended_inspection_date": due_date.isoformat(),
        "revalidation_due_date": revalidation_date.isoformat(),
        "updated_at": utc_now(),
    }


def build_demo_assets(total: int = 64) -> list[dict[str, Any]]:
    assets = [_asset_from_tuple(index, item) for index, item in enumerate(BASE_ASSETS)]
    risk_cycle = ["High", "Medium", "Low", "Medium", "High", "Low"]
    criticality_cycle = ["A", "B", "C", "B"]

    while len(assets) < total:
        idx = len(assets) + 1
        prefix, base_name, equipment_class, equipment_type, unit, system = EQUIPMENT_POOL[idx % len(EQUIPMENT_POOL)]
        tag = f"{prefix}-{100 + idx}"
        risk = risk_cycle[idx % len(risk_cycle)]
        criticality = criticality_cycle[idx % len(criticality_cycle)]
        readiness = 58 + (idx * 7) % 40
        assets.append(
            _asset_from_tuple(
                idx,
                (
                    tag,
                    f"{base_name} {idx:02d}",
                    equipment_class,
                    equipment_type,
                    unit,
                    system,
                    "Wet gas / produced fluid service" if unit == "Process Unit" else "Utility / support service",
                    risk,
                    criticality,
                    readiness,
                ),
            )
        )

    return assets


def _components_for(asset: dict[str, Any]) -> list[dict[str, Any]]:
    tag = asset["tag_number"]
    return [
        {
            "id": f"{tag}-shell",
            "asset_id": asset["id"],
            "asset_tag": tag,
            "component": "Shell / casing",
            "material": "SA-516 Gr.70" if asset["equipment_type"] == "Pressure Vessel" else "Carbon Steel",
            "nominal_thickness_mm": 22.4,
            "latest_thickness_mm": 19.8,
            "minimum_required_thickness_mm": 16.2,
        },
        {
            "id": f"{tag}-nozzle",
            "asset_id": asset["id"],
            "asset_tag": tag,
            "component": "Inlet / discharge connection",
            "material": "Carbon Steel",
            "nominal_thickness_mm": 17.5,
            "latest_thickness_mm": 15.6,
            "minimum_required_thickness_mm": 12.1,
        },
    ]


def _inspection_for(asset: dict[str, Any], index: int) -> dict[str, Any]:
    return {
        "id": f"IR-{asset['tag_number']}-2025",
        "asset_id": asset["id"],
        "asset_tag": asset["tag_number"],
        "inspection_date": "15 Mar 2025",
        "inspection_type": "Internal" if index % 2 == 0 else "External",
        "nde_method": "UT Thickness Mapping",
        "coverage_percent": 82 - (index % 5),
        "finding_summary": "Minor pitting and localized wall loss monitored.",
        "effectiveness": "Usually Effective",
    }


def _thickness_for(asset: dict[str, Any], index: int) -> list[dict[str, Any]]:
    rate = 0.08 + (index % 6) * 0.035
    return [
        {
            "id": f"TM-{asset['tag_number']}-{point}",
            "asset_id": asset["id"],
            "asset_tag": asset["tag_number"],
            "component": "Shell" if point == 1 else "Inlet Nozzle" if point == 2 else "Outlet Nozzle",
            "measurement_date": "15 Mar 2025",
            "nominal_thickness_mm": 22.4,
            "latest_thickness_mm": round(20.2 - point * 0.45 - index % 3 * 0.2, 2),
            "minimum_required_thickness_mm": 16.2,
            "corrosion_rate_mm_per_year": round(rate + point * 0.015, 3),
        }
        for point in range(1, 4)
    ]


def _failure_for(asset: dict[str, Any], index: int) -> list[dict[str, Any]]:
    if asset["current_risk_level"] not in {"Extreme", "High"} or index % 3 == 1:
        return []
    return [
        {
            "id": f"FE-{asset['tag_number']}-2025",
            "asset_id": asset["id"],
            "asset_tag": asset["tag_number"],
            "event_date": "03 Feb 2025",
            "failure_mode": "Localized corrosion / leak precursor",
            "description": "Abnormal wall-loss indication captured during integrity review.",
            "downtime_hours": 8 + index % 6,
            "repair_cost_usd": 12000 + index * 350,
        }
    ]


async def seed_demo_facility(repo: AimRepository) -> dict[str, Any]:
    await repo.ensure_collections(REQUIRED_COLLECTIONS)

    assets = build_demo_assets()
    components = [component for asset in assets for component in _components_for(asset)]
    inspections = [_inspection_for(asset, index) for index, asset in enumerate(assets)]
    thickness = [item for index, asset in enumerate(assets) for item in _thickness_for(asset, index)]
    failures = [item for index, asset in enumerate(assets) for item in _failure_for(asset, index)]
    documents = [
        {
            "id": f"DOC-{asset['tag_number']}",
            "asset_id": asset["id"],
            "asset_tag": asset["tag_number"],
            "title": f"RBI Assessment - {asset['tag_number']} - 2025.pdf",
            "document_type": "RBI Assessment",
            "revision": "1.0",
            "source": "Document Center",
            "status": "approved",
            "last_updated": date.today().isoformat(),
        }
        for asset in assets
    ]
    assessments = [
        {
            "id": f"RBI-2025-{index + 101:04d}",
            "assessment_id": f"RBI-2025-{index + 101:04d}",
            "asset_id": asset["id"],
            "asset_tag": asset["tag_number"],
            "risk_level": asset["current_risk_level"],
            "risk_target_status": asset["risk_target_status"],
            "assessment_status": asset["assessment_status"],
            "recommended_inspection_date": asset["recommended_inspection_date"],
            "revalidation_due_date": asset["revalidation_due_date"],
            "data_confidence": "Good" if asset["reliability_data_readiness"] >= 80 else "Medium",
            "data_completeness": asset["reliability_data_readiness"],
            "selected_damage_mechanisms": ["General Thinning", "Localized Corrosion", "CO2 Corrosion"],
        }
        for index, asset in enumerate(assets)
    ]

    payloads = {
        "users": [{"id": "superadmin", "name": "Budi Santoso", "role": "Superadmin"}],
        "sites": [{"id": CANONICAL_FACILITY_ID, "name": CANONICAL_FACILITY_NAME}],
        "areas": [{"id": "process-area", "site_id": CANONICAL_FACILITY_ID, "name": "Process Area"}],
        "systems": [{"id": "separator-system", "area_id": "process-area", "name": "Separator System"}],
        "assets": assets,
        "components": components,
        "documents": documents,
        "inspection_records": inspections,
        "thickness_measurements": thickness,
        "failure_events": failures,
        "rbi_assessments": assessments,
        "maintenance_events": [],
        "corrosion_circuits": [],
        "extracted_fields": [],
        "controlled_data": [],
        "reliability_results": [],
        "simulation_runs": [],
        "anomaly_results": [],
        "calculation_runs": [],
        "audit_logs": [],
    }

    counts: dict[str, int] = {}
    for collection, documents_for_collection in payloads.items():
        counts[collection] = await repo.upsert_many(collection, documents_for_collection)

    return {
        "message": "Demo facility seed completed.",
        "idempotent": True,
        "counts": counts,
    }
