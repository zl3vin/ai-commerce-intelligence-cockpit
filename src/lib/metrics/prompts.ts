import {
  getAiPrompts,
  getPromptOpportunities,
  getPromptVolatility,
  getAiVisibilityResults,
} from "@/lib/data/load";
import { toNumber } from "./format";
import type { AiPrompt, AiVisibilityResult, PromptVolatility } from "@/types";

export interface PromptRow {
  prompt_id: string;
  prompt_group: string;
  funnel_stage: string;
  priority: string;
  target_category: string;
  prompt_text: string;
  mention_rate: number;
  recommendation_rate: number;
  citation_rate: number;
  avg_position: number;
  visibility_score: number;
  weakest_platform: string;
  opportunity_score: number;
  volatility_class: string;
  stability_score: number;
}

let _cache: PromptRow[] | null = null;

export function getJoinedPrompts(): PromptRow[] {
  if (_cache) return _cache;

  const prompts = getAiPrompts();
  const opportunities = getPromptOpportunities();
  const volatility = getPromptVolatility();

  const oppById = new Map(opportunities.map((o) => [o.prompt_id, o]));

  // Average volatility/stability across the 3 platforms per prompt, and
  // pick the dominant (highest-frequency, else worst) volatility class.
  const volByPrompt = new Map<string, PromptVolatility[]>();
  for (const v of volatility) {
    const arr = volByPrompt.get(v.prompt_id) ?? [];
    arr.push(v);
    volByPrompt.set(v.prompt_id, arr);
  }

  const classRank: Record<string, number> = { High: 3, Medium: 2, Low: 1 };

  _cache = prompts.map((p: AiPrompt) => {
    const opp = oppById.get(p.prompt_id);
    const vRows = volByPrompt.get(p.prompt_id) ?? [];
    const avgStability =
      vRows.length > 0
        ? vRows.reduce((s, r) => s + toNumber(r.stability_score), 0) / vRows.length
        : 0;
    const dominantClass = vRows.reduce<string>((worst, r) => {
      return (classRank[r.volatility_class] ?? 0) > (classRank[worst] ?? 0)
        ? r.volatility_class
        : worst;
    }, "Low");

    return {
      prompt_id: p.prompt_id,
      prompt_group: p.prompt_group,
      funnel_stage: p.funnel_stage,
      priority: p.priority,
      target_category: p.target_category,
      prompt_text: p.prompt_text,
      mention_rate: toNumber(opp?.mention_rate) || 0,
      recommendation_rate: toNumber(opp?.recommendation_rate) || 0,
      citation_rate: toNumber(opp?.citation_rate) || 0,
      avg_position: toNumber(opp?.avg_position) || 0,
      visibility_score: toNumber(opp?.visibility_score) || 0,
      weakest_platform: opp?.weakest_platform ?? "—",
      opportunity_score: toNumber(opp?.opportunity_score) || 0,
      volatility_class: dominantClass,
      stability_score: avgStability,
    };
  });

  return _cache;
}

export function getVolatilityForPrompt(promptId: string): PromptVolatility[] {
  return getPromptVolatility().filter((v) => v.prompt_id === promptId);
}

export function getRunsForPrompt(promptId: string): AiVisibilityResult[] {
  return getAiVisibilityResults()
    .filter((r) => r.prompt_id === promptId)
    .sort((a, b) => {
      if (a.platform !== b.platform) return a.platform.localeCompare(b.platform);
      return toNumber(a.run_number) - toNumber(b.run_number);
    });
}
