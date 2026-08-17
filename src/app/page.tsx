"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { TrendChart } from "@/components/charts/TrendChart";
import { BarComparisonChart, SingleSeriesBarChart } from "@/components/charts/BarComparisonChart";
import { PriorityBadge } from "@/components/ui/Badges";
import { getDashboardAggregates, getIntelligenceEngine } from "@/lib/data/load";
import { getOverviewCommerceSummary } from "@/lib/metrics/commerce";
import { eur, monthLabel, pct, pctFromRaw } from "@/lib/metrics/format";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function OverviewPage() {
  const agg = getDashboardAggregates();
  const commerce = getOverviewCommerceSummary();

  const revenueTrend = agg.commerce_monthly.map((m) => ({
    month: monthLabel(m.month),
    Umsatz: Math.round(m.revenue),
    ROAS: Number(m.roas.toFixed(2)),
  }));

  const platformData = (Object.keys(agg.platforms) as (keyof typeof agg.platforms)[]).map((p) => ({
    platform: p,
    "Visibility Score": Number((agg.platforms[p].visibility_score * 100).toFixed(1)),
    "Mention Rate": Number((agg.platforms[p].mention_rate * 100).toFixed(1)),
    "Citation Rate": Number((agg.platforms[p].citation_rate * 100).toFixed(1)),
  }));

  const groupData = Object.entries(agg.prompt_groups).map(([group, m]) => ({
    group,
    "Visibility Score": Number((m.visibility_score * 100).toFixed(1)),
  }));

  const topCompetitors = [...agg.competitors]
    .sort((a, b) => b.overall_sov - a.overall_sov)
    .slice(0, 6)
    .map((c) => ({ name: c.brand, sov: Number((c.overall_sov * 100).toFixed(1)) }));

  const engine = getIntelligenceEngine();
  const strongestGroup = engine.summary.strongest_prompt_group;

  return (
    <div className="animate-in flex flex-col gap-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          label="Umsatz (12 Monate)"
          value={eur(commerce.totalRevenue)}
          sub={`Letzter Monat: ${eur(commerce.latest.revenue)}`}
          delta={`${commerce.revenueDelta >= 0 ? "+" : ""}${commerce.revenueDelta.toFixed(1)}%`}
        />
        <KpiCard
          label="ROAS"
          value={`${commerce.avgRoas.toFixed(2)}×`}
          sub={`Letzter Monat: ${commerce.latest.roas.toFixed(2)}×`}
          delta={`${commerce.roasDelta >= 0 ? "+" : ""}${commerce.roasDelta.toFixed(1)}%`}
          info="Return on Ad Spend: Umsatz je ausgegebenem Marketing-Euro."
        />
        <KpiCard
          label="Konversionsrate"
          value={pctFromRaw(commerce.avgConversion, 2)}
          sub={`Letzter Monat: ${(commerce.latest.conversion * 100).toFixed(2)}%`}
          delta={`${commerce.convDelta >= 0 ? "+" : ""}${commerce.convDelta.toFixed(1)}%`}
        />
        <KpiCard
          label="KI-Sichtbarkeits-Score"
          value={Math.round(agg.overview.visibility_score * 100).toString()}
          sub="NORTHWEAR Cockpit Score (0–100)"
          info="Custom Score: 30% Erwähnungsrate, 25% Empfehlungsrate, 20% Share of Voice, 15% Zitationsrate, 10% Positions-Score. Kein Branchenstandard."
        />
        <KpiCard
          label="Erwähnungsrate"
          value={pct(agg.overview.mention_rate)}
          sub="Über alle Plattformen"
          info="Anteil der KI-Antworten, in denen NORTHWEAR überhaupt genannt wird."
        />
        <KpiCard
          label="Zitationsrate"
          value={pct(agg.overview.citation_rate)}
          sub="Über alle Plattformen"
          info="Anteil der KI-Antworten mit einer Quellenangabe/Zitation, die zu NORTHWEAR führt. Nicht gleichzusetzen mit der Erwähnungsrate."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Revenue trend */}
        <Card className="xl:col-span-2">
          <CardHeader title="Umsatzentwicklung" subtitle="Monatlicher Umsatz und ROAS, letzte 12 Monate" />
          <TrendChart
            data={revenueTrend}
            xKey="month"
            areaKey="Umsatz"
            areaLabel="Umsatz (€)"
            lineKey="ROAS"
            lineLabel="ROAS (×)"
            yFormat={(v) => (v > 100 ? `${Math.round(v / 1000)}k` : v.toString())}
          />
        </Card>

        {/* Cockpit score gauge */}
        <Card className="flex flex-col items-center justify-center">
          <CardHeader
            title="NORTHWEAR Cockpit Score"
            subtitle="Custom AI-Visibility-Kennzahl"
          />
          <ScoreGauge
            value={agg.overview.visibility_score}
            info="Gewichteter Custom Score, kein Branchenstandard: 30% Mention Rate, 25% Recommendation Rate, 20% Share of Voice, 15% Citation Rate, 10% Position Score."
          />
          <Link
            href="/methodology"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent-teal hover:underline"
          >
            Details zur Methodik <ArrowRight size={13} />
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Platform comparison */}
        <Card>
          <CardHeader
            title="Plattformvergleich"
            subtitle="Sichtbarkeits-Score, Erwähnungsrate & Zitationsrate je KI-Plattform"
          />
          <BarComparisonChart
            data={platformData}
            xKey="platform"
            bars={[
              { key: "Visibility Score", label: "Sichtbarkeits-Score", color: "#0E8388" },
              { key: "Mention Rate", label: "Erwähnungsrate", color: "#3E5C9A" },
              { key: "Citation Rate", label: "Zitationsrate", color: "#B4791F" },
            ]}
            yFormat={(v) => `${v}%`}
          />
        </Card>

        {/* Prompt group comparison */}
        <Card>
          <CardHeader
            title="Prompt-Gruppenvergleich"
            subtitle="Sichtbarkeits-Score je Prompt-Gruppe (Discovery, Product, Problem, Comparison, Purchase Intent)"
          />
          <SingleSeriesBarChart
            data={groupData}
            xKey="group"
            yKey="Visibility Score"
            yFormat={(v) => `${v}%`}
            highlightKey="group"
            highlightValue={strongestGroup}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top competitor SOV */}
        <Card>
          <CardHeader
            title="Top-Wettbewerber Share of Voice"
            subtitle="Anteil an allen Markennennungen über ChatGPT, Gemini & Perplexity"
          />
          <SingleSeriesBarChart
            data={topCompetitors}
            xKey="name"
            yKey="sov"
            yFormat={(v) => `${v}%`}
            highlightKey="name"
            highlightValue="NORTHWEAR"
          />
        </Card>

        {/* Top AI insights */}
        <TopInsightsCard />
      </div>
    </div>
  );
}

function TopInsightsCard() {
  const engine = getIntelligenceEngine();
  const top = [...engine.insights]
    .sort((a, b) => b.opportunity_score - a.opportunity_score)
    .slice(0, 4);

  return (
    <Card>
      <CardHeader
        title="Top KI-Insights"
        subtitle="Höchste Potenzial-Scores aus der regelbasierten Intelligence Engine"
        action={
          <Link href="/ai-insights" className="inline-flex items-center gap-1 text-xs font-semibold text-accent-teal hover:underline">
            Alle Insights <ArrowRight size={13} />
          </Link>
        }
      />
      <ul className="flex flex-col gap-3">
        {top.map((insight) => (
          <li key={insight.insight_id} className="rounded-lg border border-ink-300/15 p-3">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-ink-900">{insight.title}</span>
              <PriorityBadge priority={insight.priority} />
            </div>
            <p className="text-xs leading-relaxed text-ink-500">{insight.finding}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
