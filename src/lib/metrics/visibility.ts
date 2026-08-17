import { getAiVisibilityResults, getAiPrompts, getDashboardAggregates } from "@/lib/data/load";
import { toNumber } from "./format";
import type { AiVisibilityResult, Platform } from "@/types";

// Reproduces the same methodology documented in dashboard_aggregates.json /
// methodology.visibility_score, verified against the precomputed totals so
// that filtered views (by platform, prompt group, date, run) stay
// consistent with the Overview KPIs when no filter is applied.
export interface ComputedVisibilityMetrics {
  measurements: number;
  mentionRate: number;
  recommendationRate: number;
  citationRate: number;
  avgPosition: number;
  positionScore: number;
  shareOfVoice: number;
  visibilityScore: number;
}

const WEIGHTS = { mention: 0.3, recommendation: 0.25, sov: 0.2, citation: 0.15, position: 0.1 };

export function computeVisibilityMetrics(rows: AiVisibilityResult[]): ComputedVisibilityMetrics {
  const n = rows.length;
  if (n === 0) {
    return {
      measurements: 0,
      mentionRate: 0,
      recommendationRate: 0,
      citationRate: 0,
      avgPosition: 0,
      positionScore: 0,
      shareOfVoice: 0,
      visibilityScore: 0,
    };
  }

  let mentioned = 0;
  let recommended = 0;
  let cited = 0;
  let positionSum = 0;
  let positionCount = 0;
  let brandMentionsTotal = 0;

  for (const r of rows) {
    const isMentioned = toNumber(r.northwear_mentioned) === 1;
    if (isMentioned) mentioned += 1;
    if (toNumber(r.northwear_recommended) === 1) recommended += 1;
    if (toNumber(r.northwear_website_cited) === 1) cited += 1;
    const pos = toNumber(r.northwear_position);
    if (isMentioned && !Number.isNaN(pos)) {
      positionSum += pos;
      positionCount += 1;
    }
    const total = toNumber(r.brand_mentions_total);
    brandMentionsTotal += Number.isNaN(total) ? 0 : total;
  }

  const mentionRate = mentioned / n;
  const recommendationRate = recommended / n;
  const citationRate = cited / n;
  const avgPosition = positionCount > 0 ? positionSum / positionCount : 0;
  const positionScore = positionCount > 0 ? Math.max(0, Math.min(1, (6 - avgPosition) / 5)) : 0;
  const shareOfVoice = brandMentionsTotal > 0 ? mentioned / brandMentionsTotal : 0;

  const visibilityScore =
    WEIGHTS.mention * mentionRate +
    WEIGHTS.recommendation * recommendationRate +
    WEIGHTS.sov * shareOfVoice +
    WEIGHTS.citation * citationRate +
    WEIGHTS.position * positionScore;

  return {
    measurements: n,
    mentionRate,
    recommendationRate,
    citationRate,
    avgPosition,
    positionScore,
    shareOfVoice,
    visibilityScore,
  };
}

export interface VisibilityFilters {
  platform?: Platform | "all";
  promptGroup?: string | "all";
  measurementDate?: string | "all";
  runNumber?: string | "all";
}

let _promptGroupById: Map<string, string> | null = null;
function promptGroupLookup() {
  if (!_promptGroupById) {
    _promptGroupById = new Map(getAiPrompts().map((p) => [p.prompt_id, p.prompt_group]));
  }
  return _promptGroupById;
}

export function getFilteredVisibilityRows(filters: VisibilityFilters): AiVisibilityResult[] {
  const groups = promptGroupLookup();
  return getAiVisibilityResults().filter((r) => {
    if (filters.platform && filters.platform !== "all" && r.platform !== filters.platform) return false;
    if (filters.measurementDate && filters.measurementDate !== "all" && r.measurement_date !== filters.measurementDate)
      return false;
    if (filters.runNumber && filters.runNumber !== "all" && r.run_number !== filters.runNumber) return false;
    if (filters.promptGroup && filters.promptGroup !== "all") {
      if (groups.get(r.prompt_id) !== filters.promptGroup) return false;
    }
    return true;
  });
}

export function getMeasurementDates(): string[] {
  return Array.from(new Set(getAiVisibilityResults().map((r) => r.measurement_date))).sort();
}

export function getRunNumbers(): string[] {
  return Array.from(new Set(getAiVisibilityResults().map((r) => r.run_number))).sort();
}

export function getPromptGroups(): string[] {
  return Array.from(new Set(getAiPrompts().map((p) => p.prompt_group))).sort();
}

export function getPlatforms(): Platform[] {
  return getDashboardAggregates().methodology.platforms;
}
