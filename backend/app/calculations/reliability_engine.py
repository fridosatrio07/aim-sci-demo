from __future__ import annotations

from typing import Any


def run_reliability(asset: dict[str, Any], failures: list[dict[str, Any]], maintenance: list[dict[str, Any]]) -> dict[str, Any]:
    operating_hours = max(float(asset.get("operating_hours", 42000)), 1)
    failure_count = max(len(failures), 1)
    mtbf = round(operating_hours / failure_count, 2)
    mttr = round(sum(float(item.get("downtime_hours", 4)) for item in failures) / failure_count, 2)
    availability = round(mtbf / (mtbf + max(mttr, 1)) * 100, 2)

    return {
        "engine": "ISO 14224-aligned demo reliability summary",
        "asset_id": asset["id"],
        "tag_number": asset["tag_number"],
        "failure_count": len(failures),
        "maintenance_event_count": len(maintenance),
        "mtbf_hours": mtbf,
        "mttr_hours": mttr,
        "availability_percent": availability,
        "data_readiness_percent": asset.get("reliability_data_readiness", 76),
    }
