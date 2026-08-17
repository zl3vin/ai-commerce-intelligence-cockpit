// Core data models for the AI Commerce Intelligence Cockpit
// All data originates from the supplied synthetic demo dataset.

export type Platform = "ChatGPT" | "Gemini" | "Perplexity";
export type FunnelStage = "Awareness" | "Consideration" | "Decision" | string;
export type Priority = "High" | "Medium" | "Low" | string;
export type VolatilityClass = "High" | "Medium" | "Low" | string;
export type SourceType = "Owned" | "Community" | "Third-party" | "Video" | string;

export interface Product {
  product_id: string;
  sku: string;
  product_name: string;
  category: string;
  subcategory: string;
  gender: string;
  price_eur: string;
  cost_eur: string;
  sustainable_material_pct: string;
  avg_rating: string;
  review_count: string;
  stock_units: string;
  launch_date: string;
  status: string;
  product_url: string;
}

export interface CommercePerformanceRow {
  date_month: string;
  channel: string;
  sessions: string;
  product_views: string;
  add_to_cart: string;
  checkout_started: string;
  orders: string;
  revenue_eur: string;
  marketing_spend_eur: string;
  returns: string;
  returned_revenue_eur: string;
  conversion_rate_pct: string;
  aov_eur: string;
  roas: string;
  return_rate_pct: string;
  data_type: string;
}

export interface AiPrompt {
  prompt_id: string;
  prompt_group: string;
  funnel_stage: string;
  intent_type: string;
  prompt_text: string;
  target_category: string;
  country: string;
  language: string;
  priority: Priority;
  active: string;
  data_type: string;
}

export interface AiVisibilityResult {
  measurement_id: string;
  prompt_id: string;
  platform: Platform;
  measurement_date: string;
  run_number: string;
  northwear_mentioned: string;
  northwear_position: string;
  northwear_recommended: string;
  northwear_website_cited: string;
  northwear_cited_url: string;
  citation_count: string;
  cited_domains: string;
  ranked_brands: string;
  competitor_mentions: string;
  competitor_mentions_count: string;
  brand_mentions_total: string;
  top_brand: string;
  response_summary: string;
  model_variant: string;
  data_type: string;
}

export interface AiInsight {
  insight_id: string;
  insight_type: string;
  priority: Priority;
  title: string;
  finding: string;
  evidence: string;
  recommended_action: string;
  platform: string;
  prompt_group: string;
  related_metric: string;
  metric_value: string;
  benchmark_value: string;
  opportunity_score: string;
  data_status: string;
}

export interface PromptVolatility {
  prompt_id: string;
  platform: Platform;
  prompt_group: string;
  priority: Priority;
  prompt_text: string;
  mention_runs: string;
  recommendation_runs: string;
  citation_runs: string;
  position_runs: string;
  position_std: string;
  position_range: string;
  volatility_score: string;
  stability_score: string;
  volatility_class: VolatilityClass;
}

export interface PromptOpportunity {
  prompt_id: string;
  prompt_group: string;
  priority: Priority;
  target_category: string;
  prompt_text: string;
  mention_rate: string;
  recommendation_rate: string;
  citation_rate: string;
  avg_position: string;
  share_of_voice: string;
  visibility_score: string;
  weakest_platform: string;
  opportunity_score: string;
  opportunity_class: string;
}

// ---- Aggregate JSON (precomputed, authoritative) ----

export interface VisibilityMetrics {
  measurements?: number;
  mention_rate: number;
  recommendation_rate: number;
  citation_rate: number;
  avg_position?: number;
  average_position?: number;
  position_score?: number;
  share_of_voice: number;
  visibility_score: number;
}

export interface CompetitorRow {
  brand: string;
  mentions: number;
  overall_sov: number;
  chatgpt_sov: number;
  gemini_sov: number;
  perplexity_sov: number;
}

export interface SourceRow {
  domain: string;
  citations: number;
  citation_share: number;
  chatgpt: number;
  gemini: number;
  perplexity: number;
  northwear_mention_association: number;
  northwear_recommendation_association: number;
  source_type: SourceType;
}

export interface CommerceMonthlyRow {
  month: string;
  sessions: number;
  orders: number;
  revenue: number;
  spend: number;
  conversion: number;
  aov: number;
  roas: number;
  returns: number;
  return_rate: number;
  net_revenue: number;
}

export interface DashboardAggregates {
  project: string;
  brand: string;
  data_status: string;
  methodology: {
    visibility_score: {
      type: string;
      weights: {
        mention_rate: number;
        recommendation_rate: number;
        share_of_voice: number;
        citation_rate: number;
        position_score: number;
      };
    };
    repeat_measurements: number;
    platforms: Platform[];
  };
  overview: VisibilityMetrics;
  platforms: Record<Platform, VisibilityMetrics>;
  prompt_groups: Record<string, VisibilityMetrics>;
  competitors: CompetitorRow[];
  sources: SourceRow[];
  commerce_monthly: CommerceMonthlyRow[];
  business_impact_status: {
    causal_claim_ready: boolean;
    missing: string[];
  };
}

export interface IntelligenceEngineInsight {
  insight_id: string;
  insight_type: string;
  priority: Priority;
  title: string;
  finding: string;
  evidence: string;
  recommended_action: string;
  platform: string;
  prompt_group: string;
  related_metric: string;
  metric_value: number;
  benchmark_value: number;
  opportunity_score: number;
  data_status: string;
}

export interface TopPromptOpportunity {
  prompt_id: string;
  prompt_group?: string;
  priority?: string;
  target_category?: string;
  prompt_text?: string;
  opportunity_score: number;
  weakest_platform?: string;
  [key: string]: unknown;
}

export interface TopSourceOpportunity {
  domain: string;
  [key: string]: unknown;
}

export interface VolatilityPair {
  prompt_id: string;
  platform: Platform;
  volatility_score: number;
  [key: string]: unknown;
}

export interface CompetitorGap {
  brand?: string;
  [key: string]: unknown;
}

export interface IntelligenceEngine {
  project: string;
  brand: string;
  data_status: string;
  engine_type: string;
  method_note: string;
  summary: {
    insights_total: number;
    high_priority: number;
    medium_priority: number;
    high_volatility_pairs: number;
    top_prompt_opportunity: string;
    weakest_platform: string;
    strongest_platform: string;
    weakest_prompt_group: string;
    strongest_prompt_group: string;
  };
  insights: IntelligenceEngineInsight[];
  top_prompt_opportunities: TopPromptOpportunity[];
  top_source_opportunities: TopSourceOpportunity[];
  highest_volatility_pairs: VolatilityPair[];
  competitor_gaps: CompetitorGap[];
}
