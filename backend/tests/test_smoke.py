import os

os.environ["AIM_DATABASE_MODE"] = "memory"

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


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
