from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


RiskLevel = Literal["Extreme", "Very High", "High", "Medium", "Low"]


class AssetIn(BaseModel):
    tag_number: str
    asset_name: str
    equipment_class: str
    equipment_type: str
    unit: str
    system: str
    service: str
    site: str = "SPM-01 Instalasi Stasiun Pengumpul Minyak Demo Facility"
    area: str = "Process Area"


class AssetPatch(BaseModel):
    asset_name: str | None = None
    equipment_class: str | None = None
    equipment_type: str | None = None
    unit: str | None = None
    system: str | None = None
    service: str | None = None
    current_risk_level: RiskLevel | None = None
    reliability_data_readiness: int | None = Field(default=None, ge=0, le=100)
    assessment_status: str | None = None
    asset_criticality: str | None = None
    boundary_status: str | None = None
    next_inspection_due: str | None = None
    inspection_due_note: str | None = None
    inspection_status: str | None = None
    certification_status: str | None = None
    risk_target_status: str | None = None
    recommended_inspection_date: str | None = None
    revalidation_due_date: str | None = None


class InspectionRecordIn(BaseModel):
    inspection_date: str
    inspection_type: str
    nde_method: str
    coverage_percent: int = Field(ge=0, le=100)
    finding_summary: str
    effectiveness: str = "Usually Effective"


class ThicknessMeasurementIn(BaseModel):
    component: str
    measurement_date: str
    nominal_thickness_mm: float
    latest_thickness_mm: float
    minimum_required_thickness_mm: float
    corrosion_rate_mm_per_year: float


class FailureEventIn(BaseModel):
    event_date: str
    failure_mode: str
    description: str
    downtime_hours: float = 0
    repair_cost_usd: float = 0


class CalculationRequest(BaseModel):
    notes: str | None = None
    parameters: dict[str, Any] = Field(default_factory=dict)


class FieldMappingApproval(BaseModel):
    approved_fields: dict[str, Any]
    reviewer: str = "Budi Santoso"
    comment: str | None = None


class ListResponse(BaseModel):
    items: list[dict[str, Any]]
    total: int
    source: str = "backend"
