import os
from datetime import date
from pathlib import Path

os.environ["AIM_DATABASE_MODE"] = "memory"

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)
CANONICAL_FACILITY = "SPM-01 Instalasi Stasiun Pengumpul Minyak Demo Facility"


def test_health_seed_assets_and_calculations():
    health = client.get("/health")
    assert health.status_code == 200
    assert health.json()["status"] == "ok"

    seed = client.post("/seed/demo-facility")
    assert seed.status_code == 200
    assert seed.json()["counts"]["assets"] >= 50

    assets = client.get("/assets")
    assert assets.status_code == 200
    assert assets.json()["total"] >= 50

    rbi = client.post("/calculations/rbi/V-101", json={"notes": "smoke"})
    assert rbi.status_code == 200
    assert rbi.json()["result"]["risk_level"] in {"Extreme", "High", "Medium", "Low"}

    reliability = client.post("/calculations/reliability/V-101", json={})
    assert reliability.status_code == 200
    assert reliability.json()["result"]["mtbf_hours"] > 0

    update = client.put("/assets/V-101", json={"reliability_data_readiness": 77})
    assert update.status_code == 200
    assert update.json()["calculation_status"]["recalculation_required"] is True

    status = client.get("/assets/V-101/calculation-status")
    assert status.status_code == 200
    assert status.json()["recalculation_required"] is True

    recalculation = client.post("/calculations/recalculate/V-101", json={})
    assert recalculation.status_code == 200
    assert recalculation.json()["calculation_status"]["recalculation_required"] is False


def test_cross_page_data_consistency_contracts():
    seed = client.post("/seed/demo-facility")
    assert seed.status_code == 200

    assets_response = client.get("/assets")
    assets_payload = assets_response.json()
    assets = assets_payload["items"]
    asset_tags = {asset["tag_number"] for asset in assets}
    asset_ids = {asset["id"] for asset in assets}

    assert assets_payload["total"] == 64
    assert {asset["site"] for asset in assets} == {CANONICAL_FACILITY}

    dashboard = client.get("/dashboard/summary").json()
    assert dashboard["total_assets"] == len(assets)
    assert sum(item["value"] for item in dashboard["risk_distribution"]) == dashboard["assessed_assets"]

    inspection_plan = client.get("/inspection-plan").json()["items"]
    computed_overdue = sum(1 for item in inspection_plan if date.fromisoformat(item["next_due_date"]) < date.today())
    assert dashboard["overdue_inspections"] == computed_overdue

    risk_register = client.get("/risk-register").json()["items"]
    assert all(item["asset_id"] in asset_ids for item in risk_register)
    assert all(item["asset_tag"] in asset_tags for item in risk_register)
    assert {item["risk_level"] for item in risk_register}.issubset({"Low", "Medium", "High", "Very High", "Extreme"})

    rbi = client.post("/calculations/rbi/V-101", json={})
    assert rbi.status_code == 200
    result = rbi.json()["result"]
    updated_register = client.get("/risk-register").json()["items"]
    v101_register = next(item for item in updated_register if item["asset_tag"] == "V-101")
    assert v101_register["risk_level"] == result["risk_level"]
    updated_plan = client.get("/inspection-plan").json()["items"]
    v101_plan = next(item for item in updated_plan if item["tag_number"] == "V-101")
    assert v101_plan["risk_level"] == result["risk_level"]


def test_app_pages_do_not_import_legacy_static_data_directly():
    repo_root = Path(__file__).resolve().parents[2]
    page_files = list((repo_root / "app").rglob("page.tsx"))
    offenders = []
    for page_file in page_files:
        text = page_file.read_text(encoding="utf-8")
        if "@/lib/" in text and "-data" in text and "@/lib/navigation-data" not in text:
            offenders.append(str(page_file.relative_to(repo_root)))
    assert offenders == []
