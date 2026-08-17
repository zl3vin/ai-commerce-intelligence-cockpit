import productsRaw from "@data/products.json";
import commercePerformanceRaw from "@data/commerce_performance.json";
import aiPromptsRaw from "@data/ai_prompts.json";
import aiVisibilityResultsRaw from "@data/ai_visibility_results.json";
import aiInsightsRaw from "@data/ai_insights.json";
import promptVolatilityRaw from "@data/prompt_volatility.json";
import promptOpportunitiesRaw from "@data/prompt_opportunities.json";
import dashboardAggregatesRaw from "@data/dashboard_aggregates.json";
import intelligenceEngineRaw from "@data/intelligence_engine.json";

import type {
  Product,
  CommercePerformanceRow,
  AiPrompt,
  AiVisibilityResult,
  AiInsight,
  PromptVolatility,
  PromptOpportunity,
  DashboardAggregates,
  IntelligenceEngine,
} from "@/types";

// This is the single, explicit boundary between the shipped static dataset
// and the rest of the app. Every other module reads through these getters
// so that swapping in a real API / database later only requires editing
// this file.

export function getProducts(): Product[] {
  return productsRaw as Product[];
}

export function getCommercePerformance(): CommercePerformanceRow[] {
  return commercePerformanceRaw as CommercePerformanceRow[];
}

export function getAiPrompts(): AiPrompt[] {
  return aiPromptsRaw as AiPrompt[];
}

export function getAiVisibilityResults(): AiVisibilityResult[] {
  return aiVisibilityResultsRaw as AiVisibilityResult[];
}

export function getAiInsightsRows(): AiInsight[] {
  return aiInsightsRaw as AiInsight[];
}

export function getPromptVolatility(): PromptVolatility[] {
  return promptVolatilityRaw as PromptVolatility[];
}

export function getPromptOpportunities(): PromptOpportunity[] {
  return promptOpportunitiesRaw as PromptOpportunity[];
}

export function getDashboardAggregates(): DashboardAggregates {
  return dashboardAggregatesRaw as unknown as DashboardAggregates;
}

export function getIntelligenceEngine(): IntelligenceEngine {
  return intelligenceEngineRaw as unknown as IntelligenceEngine;
}
