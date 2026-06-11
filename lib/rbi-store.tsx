"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const RBI_STORE_KEY = "assetIntegrityRbiState";

export type RbiRiskLevel = "Low" | "Medium" | "High" | "Very High" | "Extreme";
export type RbiRiskTargetStatus = "Acceptable" | "Approaching" | "Exceeded";
export type RbiAssessmentStatus = "Draft" | "Under Review" | "In Progress" | "Approved";
export type RbiActionStatus = "Mitigation Planned" | "Inspection Planned" | "Monitoring Planned" | "Immediate Action";

export interface SharedRbiAssessment {
  activeAssessmentId: string;
  tagNumber: string;
  assetName: string;
  equipmentType: string;
  unit: string;
  service: string;
  assessmentDate: string;
  selectedDamageMechanisms: string[];
  pof: {
    category: 1 | 2 | 3 | 4 | 5;
    numeric: string;
    damageFactor: string;
  };
  cof: {
    category: 1 | 2 | 3 | 4 | 5;
    areaConsequence: string;
    financialConsequence: string;
    confidenceLevel: string;
  };
  risk: {
    level: RbiRiskLevel;
    ranking: string;
    numericRiskValue: string;
    residualRisk: string;
    targetStatus: RbiRiskTargetStatus;
  };
  recommendedInspectionDate: string;
  revalidationDueDate: string;
  dataConfidence: RbiActionStatus;
  dataCompleteness: number;
  assessmentStatus: RbiAssessmentStatus;
  supportingDocuments: string[];
  technicalNotes: string;
}

interface RbiDataContextValue {
  state: SharedRbiAssessment;
  updateAssessment: (patch: Partial<SharedRbiAssessment>) => void;
  resetPrototypeData: () => void;
}

export const DEFAULT_RBI_ASSESSMENT: SharedRbiAssessment = {
  activeAssessmentId: "RBI-2025-0156",
  tagNumber: "V-101",
  assetName: "Production Separator",
  equipmentType: "Pressure Vessel",
  unit: "Production Unit",
  service: "Wet Gas Separation",
  assessmentDate: "12 May 2025",
  selectedDamageMechanisms: [
    "Localized Corrosion (CO2 Corrosion)",
    "General Thinning",
    "External Corrosion (CUI)",
    "SCC (Chloride SCC)"
  ],
  pof: {
    category: 3,
    numeric: "3.06E-04",
    damageFactor: "7.20"
  },
  cof: {
    category: 4,
    areaConsequence: "12,500 ft2",
    financialConsequence: "USD 1.20 M",
    confidenceLevel: "78%"
  },
  risk: {
    level: "High",
    ranking: "A2",
    numericRiskValue: "2.20E-03",
    residualRisk: "1.21E-03",
    targetStatus: "Exceeded"
  },
  recommendedInspectionDate: "15 May 2026",
  revalidationDueDate: "12 May 2026",
  dataConfidence: "Mitigation Planned",
  dataCompleteness: 88,
  assessmentStatus: "Approved",
  supportingDocuments: [
    "RBI Assessment - V-101 (2024)",
    "IR - V-101 - Internal Inspection",
    "Risk Criteria & Acceptability"
  ],
  technicalNotes:
    "Risk exceeds targets primarily due to localized corrosion, high consequence footprint, and limited inspection coverage."
};

const RbiDataContext = createContext<RbiDataContextValue | null>(null);

function canUseStorage() {
  if (typeof window === "undefined") return false;
  try {
    return Boolean(window.localStorage);
  } catch {
    return false;
  }
}

function readStoredState() {
  if (!canUseStorage()) return DEFAULT_RBI_ASSESSMENT;

  try {
    const stored = window.localStorage.getItem(RBI_STORE_KEY);
    if (!stored) return DEFAULT_RBI_ASSESSMENT;

    return {
      ...DEFAULT_RBI_ASSESSMENT,
      ...JSON.parse(stored)
    } as SharedRbiAssessment;
  } catch {
    return DEFAULT_RBI_ASSESSMENT;
  }
}

export function RbiDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SharedRbiAssessment>(DEFAULT_RBI_ASSESSMENT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readStoredState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!canUseStorage()) return;
    window.localStorage.setItem(RBI_STORE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const value = useMemo<RbiDataContextValue>(
    () => ({
      state,
      updateAssessment: (patch) => setState((current) => ({ ...current, ...patch })),
      resetPrototypeData: () => setState(DEFAULT_RBI_ASSESSMENT)
    }),
    [state]
  );

  return <RbiDataContext.Provider value={value}>{children}</RbiDataContext.Provider>;
}

export function useRbiData() {
  const value = useContext(RbiDataContext);
  if (!value) {
    throw new Error("useRbiData must be used inside RbiDataProvider");
  }
  return value;
}
