from __future__ import annotations

from typing import Any


def run_rbi(asset: dict[str, Any], thickness: list[dict[str, Any]], failures: list[dict[str, Any]]) -> dict[str, Any]:
    readiness = float(asset.get("reliability_data_readiness", 75))
    corrosion_rate = max([float(item.get("corrosion_rate_mm_per_year", 0.08)) for item in thickness] or [0.08])
    failure_pressure = 1 + min(len(failures), 5) * 0.25
    pof_numeric = round((corrosion_rate / 1000) * failure_pressure * (1 + (100 - readiness) / 150), 8)
    pof_category = 4 if pof_numeric >= 0.0003 else 3 if pof_numeric >= 0.0001 else 2
    cof_category = {"Extreme": 5, "Very High": 5, "High": 4, "Medium": 3, "Low": 2}.get(asset.get("current_risk_level"), 3)
    score = pof_category * cof_category
    level = "Extreme" if score >= 20 else "High" if score >= 12 else "Medium" if score >= 6 else "Low"
    numeric_risk = round(pof_numeric * (2500 * cof_category), 8)

    return {
        "engine": "API 580/581-aligned demo RBI workflow",
        "certified_api_581": False,
        "asset_id": asset["id"],
        "tag_number": asset["tag_number"],
        "pof_numeric": pof_numeric,
        "pof_category": pof_category,
        "cof_category": cof_category,
        "risk_score": score,
        "risk_level": level,
        "numeric_risk_value": numeric_risk,
        "risk_target_status": "Exceeded" if score >= 12 else "Acceptable",
        "recommended_inspection_date": asset.get("next_inspection_due", "15 May 2026"),
        "stale_inputs": [],
    }
