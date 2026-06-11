from __future__ import annotations

from typing import Any


def run_weibull(asset: dict[str, Any], failures: list[dict[str, Any]]) -> dict[str, Any]:
    count = len(failures)
    beta = round(1.2 + min(count, 6) * 0.18, 2)
    eta = round(max(float(asset.get("operating_hours", 42000)) / max(count + 1, 1), 500), 2)
    return {
        "engine": "Demo Weibull fit",
        "asset_id": asset["id"],
        "tag_number": asset["tag_number"],
        "beta_shape": beta,
        "eta_scale_hours": eta,
        "failure_regime": "Wear-out" if beta > 1.5 else "Random / early life",
    }
