export interface ApiListResponse<T> {
  items: T[];
  total: number;
  source?: string;
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
