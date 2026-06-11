export interface ApiListResponse<T> {
  items: T[];
  total: number;
  source?: string;
}

export interface CalculationStatusApiRecord {
  recalculation_required: boolean;
  stale_count: number;
  latest_run_id?: string | null;
  latest_calculation_type?: string | null;
  latest_completed_at?: string | null;
  stale_reason?: string | null;
}

export interface AssetApiRecord {
  id: string;
  tag_number: string;
  asset_name: string;
  equipment_class: string;
  equipment_type: string;
  taxonomy_level: string;
  site: string;
  area: string;
  unit: string;
  system: string;
  unit_system: string;
  service: string;
  current_risk_level: string;
  asset_criticality: string;
  boundary_status: string;
  reliability_data_readiness: number;
  linked_safety_functions: string;
  safety_critical: boolean;
  next_due_date?: string;
  next_inspection_due: string;
  inspection_due_note: string;
  inspection_status: string;
  certification_status: string;
  document_keywords: string[];
  failure_record_keywords: string[];
  assessment_status?: string;
  risk_target_status?: string;
  recommended_inspection_date?: string;
  revalidation_due_date?: string;
  remaining_life_years?: number;
  limiting_component?: string;
  calculation_status?: CalculationStatusApiRecord;
}

export interface ReportHistoryApiRecord {
  reportName: string;
  reportType: string;
  generatedBy: string;
  generatedDate: string;
  format: "PDF" | "Excel" | "CSV";
  dateRange: string;
  status: "Completed" | "Failed";
  fileSize: string;
  assetTag?: string;
}

export interface DashboardSummaryApiRecord {
  total_assets: number;
  assessed_assets: number;
  high_risk_assets: number;
  overdue_inspections: number;
  average_data_readiness: number;
  risk_distribution: Array<{ label: string; value: number }>;
  recalculation_required_assets: number;
  stale_calculations: number;
}

export interface ApiHealth {
  status: string;
  database_mode: string;
  database_connected: boolean;
  service: string;
}

export interface CalculationRunResponse {
  run: Record<string, unknown>;
  result: Record<string, unknown>;
  request?: Record<string, unknown>;
}

export interface RecalculationResponse {
  runs: Record<string, unknown>[];
  results: Record<string, unknown>;
  asset: AssetApiRecord;
  calculation_status: CalculationStatusApiRecord;
}
