"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";

import {
  calculatePortfolioRiskDistribution,
  calculateRegisterSummary,
  calculateRbiInformationSummary,
  calculateRiskAnalytics,
  recalculateAssessment
} from "@/lib/rbi/rbi-calculations";
import { DEFAULT_RBI_STORE_STATE } from "@/lib/rbi/rbi-dummy-data";
import type {
  RbiApprovalStatus,
  RbiAssessment,
  RbiAssessmentStatus,
  RbiAsset,
  RbiStoreAction,
  RbiStoreState,
  SharedRbiAssessment
} from "@/lib/rbi/rbi-types";

export const RBI_STORE_KEY = "aim-rbi-store-v1";
const LEGACY_RBI_STORE_KEY = "assetIntegrityRbiState";

export type {
  ApprovalStep,
  CertificationRecord,
  DamageMechanism,
  DataQualityProfile,
  FailureRecord,
  InspectionPlanItem,
  InspectionRecord,
  MitigationAction,
  PofEvaluation,
  CofEvaluation,
  RbiApprovalStatus,
  RbiAssessment,
  RbiAssessmentStatus,
  RbiActionStatus,
  RbiAsset,
  RbiComponent,
  RbiCriticality,
  RbiProject,
  RbiRecommendation,
  RbiRiskLevel,
  RbiRiskTargetStatus,
  RbiStoreState,
  SafetyFunctionLink,
  SharedRbiAssessment,
  SupportingDocument
} from "@/lib/rbi/rbi-types";

function canUseStorage() {
  if (typeof window === "undefined") return false;
  try {
    return Boolean(window.localStorage);
  } catch {
    return false;
  }
}

function cloneDefaultState(): RbiStoreState {
  return structuredClone(DEFAULT_RBI_STORE_STATE);
}

function findActiveAssessment(store: RbiStoreState) {
  return store.assessments.find((assessment) => assessment.assessmentId === store.activeAssessmentId) ?? store.assessments[0];
}

function findAsset(store: RbiStoreState, assessment?: RbiAssessment) {
  return store.assets.find((asset) => asset.id === assessment?.assetId) ?? store.assets[0];
}

function toSharedAssessment(store: RbiStoreState): SharedRbiAssessment {
  const assessment = findActiveAssessment(store);
  const asset = findAsset(store, assessment);

  return {
    activeAssessmentId: assessment.assessmentId,
    tagNumber: asset.tagNumber,
    assetName: asset.assetName,
    equipmentType: asset.equipmentType,
    unit: asset.unit,
    service: asset.service,
    assessmentDate: assessment.assessmentDate,
    selectedDamageMechanisms: assessment.selectedDamageMechanisms.map((mechanism) => mechanism.name),
    pof: {
      category: assessment.pof.category,
      numeric: assessment.pof.numeric,
      damageFactor: assessment.pof.damageFactor
    },
    cof: {
      category: assessment.cof.category,
      areaConsequence: assessment.cof.areaConsequence,
      financialConsequence: assessment.cof.financialConsequence,
      confidenceLevel: assessment.cof.confidenceLevel
    },
    risk: {
      level: assessment.riskDetermination.level,
      ranking: assessment.riskDetermination.ranking,
      numericRiskValue: assessment.riskDetermination.numericRiskValue,
      residualRisk: assessment.riskDetermination.residualRisk,
      targetStatus: assessment.riskDetermination.targetStatus
    },
    recommendedInspectionDate: assessment.recommendation.inspectionDate,
    revalidationDueDate: assessment.revalidationDueDate,
    dataConfidence: assessment.dataConfidence,
    dataCompleteness: assessment.dataCompleteness,
    assessmentStatus: assessment.assessmentStatus,
    supportingDocuments: assessment.documents.map((document) => document.title),
    technicalNotes: assessment.technicalNotes
  };
}

export const DEFAULT_RBI_ASSESSMENT = toSharedAssessment(DEFAULT_RBI_STORE_STATE);

function mergeLegacySharedState(store: RbiStoreState, legacy: Partial<SharedRbiAssessment>) {
  return reduceRbiStore(store, { type: "update-active-shared", patch: legacy });
}

function readStoredState() {
  if (!canUseStorage()) return cloneDefaultState();

  try {
    const stored = window.localStorage.getItem(RBI_STORE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as RbiStoreState;
      if (parsed?.version === 1 && Array.isArray(parsed.assessments) && Array.isArray(parsed.assets)) {
        return {
          ...cloneDefaultState(),
          ...parsed
        };
      }
    }

    const legacyStored = window.localStorage.getItem(LEGACY_RBI_STORE_KEY);
    if (legacyStored) {
      return mergeLegacySharedState(cloneDefaultState(), JSON.parse(legacyStored) as Partial<SharedRbiAssessment>);
    }

    return cloneDefaultState();
  } catch {
    return cloneDefaultState();
  }
}

function updateActive(store: RbiStoreState, updater: (assessment: RbiAssessment, asset: RbiAsset) => { assessment?: RbiAssessment; asset?: RbiAsset; activeAssessmentId?: string }) {
  const active = findActiveAssessment(store);
  const activeAsset = findAsset(store, active);
  const result = updater(active, activeAsset);
  const nextAssessment = result.assessment ?? active;
  const nextAsset = result.asset ?? activeAsset;

  return {
    ...store,
    activeAssessmentId: result.activeAssessmentId ?? nextAssessment.assessmentId,
    assessments: store.assessments.map((assessment) => (assessment.assessmentId === active.assessmentId ? nextAssessment : assessment)),
    assets: store.assets.map((asset) => (asset.id === activeAsset.id ? nextAsset : asset)),
    lastUpdated: "12 May 2025 10:30 WIB"
  };
}

function reduceRbiStore(store: RbiStoreState, action: RbiStoreAction): RbiStoreState {
  switch (action.type) {
    case "load":
      return action.state;
    case "reset":
      return cloneDefaultState();
    case "set-active-assessment":
      return store.assessments.some((assessment) => assessment.assessmentId === action.assessmentId)
        ? { ...store, activeAssessmentId: action.assessmentId }
        : store;
    case "update-assessment":
      return {
        ...store,
        assessments: store.assessments.map((assessment) => (assessment.assessmentId === action.assessmentId ? { ...assessment, ...action.patch } : assessment))
      };
    case "update-asset":
      return {
        ...store,
        assets: store.assets.map((asset) => (asset.id === action.assetId ? { ...asset, ...action.patch } : asset))
      };
    case "set-assessment-status":
      return updateActive(store, (assessment) => ({ assessment: { ...assessment, assessmentStatus: action.status } }));
    case "set-approval-status":
      return updateActive(store, (assessment) => {
        const statusMap: Record<RbiApprovalStatus, RbiAssessmentStatus> = {
          Draft: "Draft",
          "Ready for Approval": "Under Review",
          "In Review": "Under Review",
          Approved: "Approved",
          "Revision Requested": "Under Review",
          Rejected: "Under Review"
        };
        return {
          assessment: {
            ...assessment,
            approvalStatus: action.status,
            assessmentStatus: statusMap[action.status],
            approvalWorkflow: assessment.approvalWorkflow.map((step) => {
              if (action.status === "Approved") return { ...step, status: "Approved" };
              if (step.id === "owner") return { ...step, status: action.status === "Rejected" ? "Rejected" : "In Review" };
              return step;
            })
          }
        };
      });
    case "generate-inspection-plan":
      return updateActive(store, (assessment) => ({
        assessment: {
          ...assessment,
          inspectionPlan: assessment.inspectionPlan.length > 0
            ? assessment.inspectionPlan
            : [
                {
                  id: `${assessment.assessmentId}-generated-ip`,
                  assessmentId: assessment.assessmentId,
                  activity: `Generated inspection for ${assessment.selectedDamageMechanisms[0]?.name ?? "governing damage mechanism"}`,
                  component: "Governing component",
                  method: assessment.recommendation.inspectionMethod,
                  effectiveness: "Highly Effective",
                  targetDate: assessment.recommendation.inspectionDate,
                  responsibleParty: "Integrity Team",
                  status: "Planned"
                }
              ]
        }
      }));
    case "recalculate-risk":
      return updateActive(store, (assessment, asset) => ({ assessment: recalculateAssessment(assessment, asset) }));
    case "update-active-shared":
      return updateActive(store, (assessment, asset) => {
        const patch = action.patch;
        const nextAssessmentId = patch.activeAssessmentId ?? assessment.assessmentId;
        const nextAssessment: RbiAssessment = {
          ...assessment,
          assessmentId: nextAssessmentId,
          assessmentDate: patch.assessmentDate ?? assessment.assessmentDate,
          assessmentStatus: patch.assessmentStatus ?? assessment.assessmentStatus,
          dataCompleteness: patch.dataCompleteness ?? assessment.dataCompleteness,
          dataConfidence: patch.dataConfidence ?? assessment.dataConfidence,
          technicalNotes: patch.technicalNotes ?? assessment.technicalNotes,
          pof: patch.pof ? { ...assessment.pof, ...patch.pof } : assessment.pof,
          cof: patch.cof ? { ...assessment.cof, ...patch.cof } : assessment.cof,
          riskDetermination: patch.risk ? { ...assessment.riskDetermination, ...patch.risk } : assessment.riskDetermination,
          recommendation: patch.recommendedInspectionDate ? { ...assessment.recommendation, inspectionDate: patch.recommendedInspectionDate } : assessment.recommendation,
          revalidationDueDate: patch.revalidationDueDate ?? assessment.revalidationDueDate
        };
        const nextAsset: RbiAsset = {
          ...asset,
          tagNumber: patch.tagNumber ?? asset.tagNumber,
          assetName: patch.assetName ?? asset.assetName,
          equipmentType: patch.equipmentType ?? asset.equipmentType,
          unit: patch.unit ?? asset.unit,
          service: patch.service ?? asset.service,
          currentRiskLevel: patch.risk?.level ?? asset.currentRiskLevel,
          reliabilityDataReadiness: patch.dataCompleteness ?? asset.reliabilityDataReadiness
        };

        return { assessment: nextAssessment, asset: nextAsset, activeAssessmentId: nextAssessmentId };
      });
    default:
      return store;
  }
}

interface RbiDataContextValue {
  state: SharedRbiAssessment;
  store: RbiStoreState;
  activeAssessment: RbiAssessment;
  activeAsset: RbiAsset;
  assessments: RbiAssessment[];
  assets: RbiAsset[];
  riskDistribution: ReturnType<typeof calculatePortfolioRiskDistribution>;
  registerSummary: ReturnType<typeof calculateRegisterSummary>;
  analyticsSummary: ReturnType<typeof calculateRiskAnalytics>;
  informationSummary: ReturnType<typeof calculateRbiInformationSummary>;
  updateAssessment: (patch: Partial<SharedRbiAssessment>) => void;
  updateActiveAssessment: (patch: Partial<RbiAssessment>) => void;
  updateActiveAsset: (patch: Partial<RbiAsset>) => void;
  setActiveAssessment: (assessmentId: string) => void;
  setAssessmentStatus: (status: RbiAssessmentStatus) => void;
  setApprovalStatus: (status: RbiApprovalStatus) => void;
  recalculateRisk: () => void;
  generateInspectionPlan: () => void;
  resetPrototypeData: () => void;
}

const RbiDataContext = createContext<RbiDataContextValue | null>(null);

export function RbiDataProvider({ children }: { children: ReactNode }) {
  const [store, dispatch] = useReducer(reduceRbiStore, DEFAULT_RBI_STORE_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    dispatch({ type: "load", state: readStoredState() });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !canUseStorage()) return;
    window.localStorage.setItem(RBI_STORE_KEY, JSON.stringify(store));
  }, [hydrated, store]);

  const activeAssessment = findActiveAssessment(store);
  const activeAsset = findAsset(store, activeAssessment);
  const state = toSharedAssessment(store);

  const value = useMemo<RbiDataContextValue>(
    () => ({
      state,
      store,
      activeAssessment,
      activeAsset,
      assessments: store.assessments,
      assets: store.assets,
      riskDistribution: calculatePortfolioRiskDistribution(store.assessments),
      registerSummary: calculateRegisterSummary(store.assessments),
      analyticsSummary: calculateRiskAnalytics(store.assessments),
      informationSummary: calculateRbiInformationSummary(store.assessments, store.assets),
      updateAssessment: (patch) => dispatch({ type: "update-active-shared", patch }),
      updateActiveAssessment: (patch) => dispatch({ type: "update-assessment", assessmentId: activeAssessment.assessmentId, patch }),
      updateActiveAsset: (patch) => dispatch({ type: "update-asset", assetId: activeAsset.id, patch }),
      setActiveAssessment: (assessmentId) => dispatch({ type: "set-active-assessment", assessmentId }),
      setAssessmentStatus: (status) => dispatch({ type: "set-assessment-status", status }),
      setApprovalStatus: (status) => dispatch({ type: "set-approval-status", status }),
      recalculateRisk: () => dispatch({ type: "recalculate-risk" }),
      generateInspectionPlan: () => dispatch({ type: "generate-inspection-plan" }),
      resetPrototypeData: () => dispatch({ type: "reset" })
    }),
    [activeAssessment, activeAsset, state, store]
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
