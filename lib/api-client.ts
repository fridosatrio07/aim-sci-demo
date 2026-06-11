import type {
  ApiHealth,
  ApiListResponse,
  AssetApiRecord,
  CalculationRunResponse,
  CalculationStatusApiRecord,
  DashboardSummaryApiRecord,
  ReportHistoryApiRecord,
  RecalculationResponse
} from "@/lib/api-types";

const DEFAULT_API_BASE_URL = "http://localhost:8000";
const REQUEST_TIMEOUT_MS = 2500;

function apiBaseUrl() {
  return (process.env.NEXT_PUBLIC_AIM_API_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");
}

export class AimApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "AimApiError";
    this.status = status;
  }
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${apiBaseUrl()}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new AimApiError(`AIM API request failed with ${response.status}`, response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof AimApiError) throw error;
    throw new AimApiError(error instanceof Error ? error.message : "AIM API is unavailable");
  } finally {
    clearTimeout(timeout);
  }
}

export const aimApi = {
  health() {
    return requestJson<ApiHealth>("/health");
  },
  seedDemoFacility() {
    return requestJson<Record<string, unknown>>("/seed/demo-facility", { method: "POST", body: "{}" });
  },
  listAssets(params?: { search?: string; site?: string; unit?: string; equipmentType?: string; riskLevel?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.site) query.set("site", params.site);
    if (params?.unit) query.set("unit", params.unit);
    if (params?.equipmentType) query.set("equipment_type", params.equipmentType);
    if (params?.riskLevel) query.set("risk_level", params.riskLevel);
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return requestJson<ApiListResponse<AssetApiRecord>>(`/assets${suffix}`);
  },
  getAsset(assetId: string) {
    return requestJson<AssetApiRecord>(`/assets/${encodeURIComponent(assetId)}`);
  },
  updateAsset(assetId: string, patch: Partial<AssetApiRecord>) {
    return requestJson<AssetApiRecord>(`/assets/${encodeURIComponent(assetId)}`, {
      method: "PUT",
      body: JSON.stringify(patch)
    });
  },
  runRbi(assetId: string) {
    return requestJson<CalculationRunResponse>(`/calculations/rbi/${encodeURIComponent(assetId)}`, {
      method: "POST",
      body: "{}"
    });
  },
  runReliability(assetId: string) {
    return requestJson<CalculationRunResponse>(`/calculations/reliability/${encodeURIComponent(assetId)}`, {
      method: "POST",
      body: "{}"
    });
  },
  runWeibull(assetId: string) {
    return requestJson<CalculationRunResponse>(`/calculations/weibull/${encodeURIComponent(assetId)}`, { method: "POST", body: "{}" });
  },
  runMonteCarlo(assetId: string) {
    return requestJson<CalculationRunResponse>(`/calculations/monte-carlo/${encodeURIComponent(assetId)}`, { method: "POST", body: "{}" });
  },
  runDegradation(assetId: string) {
    return requestJson<CalculationRunResponse>(`/calculations/degradation/${encodeURIComponent(assetId)}`, { method: "POST", body: "{}" });
  },
  runAnomalyDetection(assetId: string) {
    return requestJson<CalculationRunResponse>(`/calculations/anomaly-detection/${encodeURIComponent(assetId)}`, { method: "POST", body: "{}" });
  },
  calculationStatus(assetId: string) {
    return requestJson<CalculationStatusApiRecord>(`/assets/${encodeURIComponent(assetId)}/calculation-status`);
  },
  recalculateAsset(assetId: string) {
    return requestJson<RecalculationResponse>(`/calculations/recalculate/${encodeURIComponent(assetId)}`, {
      method: "POST",
      body: "{}"
    });
  },
  listCalculationRuns(params?: { assetId?: string; stale?: boolean }) {
    const query = new URLSearchParams();
    if (params?.assetId) query.set("asset_id", params.assetId);
    if (typeof params?.stale === "boolean") query.set("stale", String(params.stale));
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return requestJson<ApiListResponse<Record<string, unknown>>>(`/calculations/runs${suffix}`);
  },
  approveFieldMapping(documentId: string, payload: { approved_fields: Record<string, unknown>; reviewer?: string; comment?: string }) {
    return requestJson<Record<string, unknown>>(`/documents/${encodeURIComponent(documentId)}/approve-field-mapping`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  listDocuments() {
    return requestJson<ApiListResponse<Record<string, unknown>>>("/documents");
  },
  getDocument(documentId: string) {
    return requestJson<Record<string, unknown>>(`/documents/${encodeURIComponent(documentId)}`);
  },
  extractDocument(documentId: string) {
    return requestJson<Record<string, unknown>>(`/documents/${encodeURIComponent(documentId)}/extract`, { method: "POST", body: "{}" });
  },
  listInspectionHistory(assetId: string) {
    return requestJson<ApiListResponse<Record<string, unknown>>>(`/assets/${encodeURIComponent(assetId)}/inspection-history`);
  },
  createInspectionRecord(assetId: string, payload: Record<string, unknown>) {
    return requestJson<Record<string, unknown>>(`/assets/${encodeURIComponent(assetId)}/inspection-records`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  listThicknessMeasurements(assetId: string) {
    return requestJson<ApiListResponse<Record<string, unknown>>>(`/assets/${encodeURIComponent(assetId)}/thickness-measurements`);
  },
  createThicknessMeasurement(assetId: string, payload: Record<string, unknown>) {
    return requestJson<Record<string, unknown>>(`/assets/${encodeURIComponent(assetId)}/thickness-measurements`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  listFailureEvents(assetId: string) {
    return requestJson<ApiListResponse<Record<string, unknown>>>(`/assets/${encodeURIComponent(assetId)}/failure-events`);
  },
  createFailureEvent(assetId: string, payload: Record<string, unknown>) {
    return requestJson<Record<string, unknown>>(`/assets/${encodeURIComponent(assetId)}/failure-events`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  riskRegister() {
    return requestJson<ApiListResponse<Record<string, unknown>>>("/risk-register");
  },
  inspectionPlan() {
    return requestJson<ApiListResponse<Record<string, unknown>>>("/inspection-plan");
  },
  reportHistory() {
    return requestJson<ApiListResponse<ReportHistoryApiRecord>>("/reports/history");
  },
  assetSummaryReport(assetId: string) {
    return requestJson<Record<string, unknown>>(`/reports/asset-summary/${encodeURIComponent(assetId)}`);
  },
  portfolioSummaryReport() {
    return requestJson<Record<string, unknown>>("/reports/portfolio-summary");
  },
  dashboardSummary() {
    return requestJson<DashboardSummaryApiRecord>("/dashboard/summary");
  }
};
