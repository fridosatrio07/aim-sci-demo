from __future__ import annotations

from typing import Any


def run_degradation(asset: dict[str, Any], thickness: list[dict[str, Any]]) -> dict[str, Any]:
    limiting = min(thickness, key=lambda item: item.get("latest_thickness_mm", 999), default={})
    latest = float(limiting.get("latest_thickness_mm", 18.0))
    minimum = float(limiting.get("minimum_required_thickness_mm", 12.0))
    corrosion_rate = max(float(limiting.get("corrosion_rate_mm_per_year", 0.12)), 0.01)
    remaining_years = round(max((latest - minimum) / corrosion_rate, 0), 2)
    return {
        "engine": "Demo degradation / remaining life model",
        "asset_id": asset["id"],
        "tag_number": asset["tag_number"],
        "limiting_component": limiting.get("component", "Shell"),
        "latest_thickness_mm": latest,
        "minimum_required_thickness_mm": minimum,
        "corrosion_rate_mm_per_year": corrosion_rate,
        "estimated_remaining_life_years": remaining_years,
    }
