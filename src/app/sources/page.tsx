"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import { SortableTable, type Column } from "@/components/ui/SortableTable";
import { BarComparisonChart } from "@/components/charts/BarComparisonChart";
import { SourceTypeBadge } from "@/components/ui/Badges";
import { getDashboardAggregates, getIntelligenceEngine } from "@/lib/data/load";
import { pct } from "@/lib/metrics/format";
import type { SourceRow } from "@/types";

export default function SourcesPage() {
  const agg = getDashboardAggregates();
  const engine = getIntelligenceEngine();
  const sources = [...agg.sources].sort((a, b) => b.citation_share - a.citation_share);
  const opportunities = engine.top_source_opportunities;

  const chartData = sources.map((s) => ({
    domain: s.domain,
    "Citation Share": Number((s.citation_share * 100).toFixed(1)),
  }));

  const typeShare = Object.entries(
    sources.reduce<Record<string, number>>((acc, s) => {
      acc[s.source_type] = (acc[s.source_type] ?? 0) + s.citation_share;
      return acc;
    }, {})
  ).map(([type, share]) => ({ type, "Citation Share": Number((share * 100).toFixed(1)) }));

  const platformShare = sources.map((s) => ({
    domain: s.domain,
    ChatGPT: s.chatgpt,
    Gemini: s.gemini,
    Perplexity: s.perplexity,
  }));

  const columns: Column<SourceRow>[] = [
    { key: "domain", header: "Domain", accessor: (r) => r.domain, cardPrimary: true },
    { key: "source_type", header: "Typ", accessor: (r) => r.source_type, render: (r) => <SourceTypeBadge type={r.source_type} /> },
    { key: "citations", header: "Zitationen", accessor: (r) => r.citations, align: "right" },
    { key: "citation_share", header: "Zitationsanteil", accessor: (r) => r.citation_share, align: "right", render: (r) => pct(r.citation_share) },
    { key: "chatgpt", header: "ChatGPT", accessor: (r) => r.chatgpt, align: "right" },
    { key: "gemini", header: "Gemini", accessor: (r) => r.gemini, align: "right" },
    { key: "perplexity", header: "Perplexity", accessor: (r) => r.perplexity, align: "right" },
    {
      key: "northwear_mention_association",
      header: "NW Erwähnungs-Assoz.",
      accessor: (r) => r.northwear_mention_association,
      align: "right",
    },
    {
      key: "northwear_recommendation_association",
      header: "NW Empfehlungs-Assoz.",
      accessor: (r) => r.northwear_recommendation_association,
      align: "right",
    },
  ];

  return (
    <div className="animate-in flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Häufigste zitierte Domains" subtitle="Zitationsanteil über alle KI-Plattformen kombiniert" />
          <BarComparisonChart
            data={chartData}
            xKey="domain"
            bars={[{ key: "Citation Share", label: "Zitationsanteil", color: "#0E8388" }]}
            layout="horizontal"
            height={320}
            showLegend={false}
            yFormat={(v) => `${v}%`}
          />
        </Card>
        <Card>
          <CardHeader title="Plattformverteilung je Quelle" subtitle="Zitationen pro Domain, getrennt nach KI-Plattform" />
          <BarComparisonChart
            data={platformShare}
            xKey="domain"
            bars={[
              { key: "ChatGPT", label: "ChatGPT", color: "#0E8388" },
              { key: "Gemini", label: "Gemini", color: "#3E5C9A" },
              { key: "Perplexity", label: "Perplexity", color: "#B4791F" },
            ]}
            layout="horizontal"
            height={320}
          />
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Owned / Community / Drittanbieter / Video"
          subtitle="Anteil des Zitationsanteils nach Quellentyp"
        />
        <BarComparisonChart
          data={typeShare}
          xKey="type"
          bars={[{ key: "Citation Share", label: "Zitationsanteil", color: "#3E5C9A" }]}
          showLegend={false}
          yFormat={(v) => `${v}%`}
        />
      </Card>

      <Card>
        <CardHeader title="Source Intelligence" subtitle="Alle zitierten Domains — sortierbar" />
        <SortableTable columns={columns} rows={sources} rowKey={(r) => r.domain} initialSortKey="citation_share" />
      </Card>

      <Card>
        <CardHeader
          title="Source Opportunities"
          subtitle="Wo KI-Systeme zitieren und wo NORTHWEAR ansetzen kann"
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {opportunities.map((o) => (
            <div key={o.domain as string} className="rounded-lg border border-ink-300/15 p-3.5">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-ink-900">{o.domain as string}</span>
                <SourceTypeBadge type={o.source_type as string} />
              </div>
              <div className="mb-2 flex items-center gap-3 text-xs text-ink-500">
                <span>Zitationsanteil: <span className="font-mono text-ink-700">{((o.citation_share as number) * 100).toFixed(1)}%</span></span>
                <span>Potenzial: <span className="font-mono text-ink-700">{(o.opportunity_score as number).toFixed(1)}</span></span>
              </div>
              <p className="text-xs leading-relaxed text-ink-500">{o.recommended_action as string}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
