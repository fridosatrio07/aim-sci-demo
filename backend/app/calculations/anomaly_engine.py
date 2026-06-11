from __future__ import annotations

from typing import Any


def run_anomaly_detection(asset: dict[str, Any], inspections: list[dict[str, Any]], thickness: list[dict[str, Any]]) -> dict[str, Any]:
    low_readiness = asset.get("reliability_data_readiness", 100) < 70
    high_corrosion = any(float(item.get("corrosion_rate_mm_per_year", 0)) > 0.25 for item in thickness)
    stale_inspection = len(inspections) == 0
    anomalies = [
        label
        for label, active in [
            ("Low reliability data readiness", low_readiness),
            ("High corrosion-rate outlier", high_corrosion),
            ("No inspection history linked", stale_inspection),
        ]
        if active
    ]
    return {
        "engine": "Demo rule-based anomaly detector",
        "asset_id": asset["id"],
        "tag_number": asset["tag_number"],
        "anomaly_count": len(anomalies),
        "anomalies": anomalies,
        "severity": "High" if high_corrosion else "Medium" if anomalies else "Low",
    }
