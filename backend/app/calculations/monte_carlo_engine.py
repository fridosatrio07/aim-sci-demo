from __future__ import annotations

from typing import Any


def run_monte_carlo(asset: dict[str, Any]) -> dict[str, Any]:
    readiness = float(asset.get("reliability_data_readiness", 76))
    base = {"Extreme": 0.82, "High": 0.62, "Medium": 0.36, "Low": 0.18}.get(asset.get("current_risk_level"), 0.3)
    uncertainty = round((100 - readiness) / 100, 2)
    return {
        "engine": "Demo Monte Carlo uncertainty envelope",
        "asset_id": asset["id"],
        "tag_number": asset["tag_number"],
        "iterations": 5000,
        "p50_risk_index": round(base, 3),
        "p90_risk_index": round(min(base + uncertainty * 0.35, 1), 3),
        "confidence": "High" if readiness >= 85 else "Medium" if readiness >= 70 else "Low",
    }
