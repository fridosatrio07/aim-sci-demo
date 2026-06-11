import type { ApiHealth, ApiListResponse, AssetApiRecord, CalculationRunResponse } from "@/lib/api-types";

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
  riskRegister() {
    return requestJson<ApiListResponse<Record<string, unknown>>>("/risk-register");
  },
  dashboardSummary() {
    return requestJson<Record<string, unknown>>("/dashboard/summary");
  }
};
