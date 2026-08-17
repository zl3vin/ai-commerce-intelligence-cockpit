import { getCommercePerformance, getDashboardAggregates } from "@/lib/data/load";
import { toNumber } from "./format";
import type { CommercePerformanceRow } from "@/types";

export interface ChannelMonthRow {
  month: string;
  channel: string;
  sessions: number;
  product_views: number;
  add_to_cart: number;
  checkout_started: number;
  orders: number;
  revenue: number;
  spend: number;
  returns: number;
  returned_revenue: number;
  conversion_rate: number;
  aov: number;
  roas: number;
  return_rate: number;
}

let _cache: ChannelMonthRow[] | null = null;

export function getChannelMonthly(): ChannelMonthRow[] {
  if (_cache) return _cache;
  _cache = getCommercePerformance().map((r: CommercePerformanceRow) => ({
    month: r.date_month,
    channel: r.channel,
    sessions: toNumber(r.sessions),
    product_views: toNumber(r.product_views),
    add_to_cart: toNumber(r.add_to_cart),
    checkout_started: toNumber(r.checkout_started),
    orders: toNumber(r.orders),
    revenue: toNumber(r.revenue_eur),
    spend: toNumber(r.marketing_spend_eur),
    returns: toNumber(r.returns),
    returned_revenue: toNumber(r.returned_revenue_eur),
    conversion_rate: toNumber(r.conversion_rate_pct),
    aov: toNumber(r.aov_eur),
    roas: toNumber(r.roas),
    return_rate: toNumber(r.return_rate_pct),
  }));
  return _cache;
}

export function getChannels(): string[] {
  return Array.from(new Set(getChannelMonthly().map((r) => r.channel))).sort();
}

export function getMonths(): string[] {
  return Array.from(new Set(getChannelMonthly().map((r) => r.month))).sort();
}

export interface CommerceSummary {
  revenue: number;
  netRevenue: number;
  orders: number;
  sessions: number;
  conversionRate: number;
  aov: number;
  roas: number;
  returnRate: number;
  spend: number;
}

export function summarizeChannelRows(rows: ChannelMonthRow[]): CommerceSummary {
  const revenue = rows.reduce((s, r) => s + r.revenue, 0);
  const orders = rows.reduce((s, r) => s + r.orders, 0);
  const sessions = rows.reduce((s, r) => s + r.sessions, 0);
  const spend = rows.reduce((s, r) => s + r.spend, 0);
  const returnedRevenue = rows.reduce((s, r) => s + r.returned_revenue, 0);
  return {
    revenue,
    netRevenue: revenue - returnedRevenue,
    orders,
    sessions,
    conversionRate: sessions > 0 ? (orders / sessions) * 100 : 0,
    aov: orders > 0 ? revenue / orders : 0,
    roas: spend > 0 ? revenue / spend : 0,
    returnRate: rows.reduce((s, r) => s + r.returns, 0) > 0
      ? (rows.reduce((s, r) => s + r.returns, 0) / orders) * 100
      : 0,
    spend,
  };
}

export function getOverviewCommerceSummary() {
  const agg = getDashboardAggregates();
  const monthly = agg.commerce_monthly;
  const latest = monthly[monthly.length - 1];
  const prior = monthly[monthly.length - 2];

  const totalRevenue = monthly.reduce((s, m) => s + m.revenue, 0);
  const totalSpend = monthly.reduce((s, m) => s + m.spend, 0);
  const totalOrders = monthly.reduce((s, m) => s + m.orders, 0);
  const totalSessions = monthly.reduce((s, m) => s + m.sessions, 0);

  const revenueDelta = prior ? ((latest.revenue - prior.revenue) / prior.revenue) * 100 : 0;
  const roasDelta = prior ? ((latest.roas - prior.roas) / prior.roas) * 100 : 0;
  const convDelta = prior ? ((latest.conversion - prior.conversion) / prior.conversion) * 100 : 0;

  return {
    latest,
    prior,
    totalRevenue,
    totalSpend,
    totalOrders,
    totalSessions,
    avgRoas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
    avgConversion: totalSessions > 0 ? (totalOrders / totalSessions) * 100 : 0,
    revenueDelta,
    roasDelta,
    convDelta,
  };
}
