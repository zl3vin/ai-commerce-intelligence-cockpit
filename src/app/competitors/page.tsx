"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import { SortableTable, type Column } from "@/components/ui/SortableTable";
import { BarComparisonChart } from "@/components/charts/BarComparisonChart";
import { getDashboardAggregates } from "@/lib/data/load";
import { pct } from "@/lib/metrics/format";
import type { CompetitorRow } from "@/types";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import clsx from "clsx";

export default function CompetitorsPage() {
  const agg = getDashboardAggregates();
  const competitors = [...agg.competitors].sort((a, b) => b.overall_sov - a.overall_sov);
  const nwIndex = competitors.findIndex((c) => c.brand === "NORTHWEAR");
  const rank = nwIndex + 1;

  const chartData = competitors.map((c) => ({
    brand: c.brand,
    "ChatGPT SOV": Number((c.chatgpt_sov * 100).toFixed(1)),
    "Gemini SOV": Number((c.gemini_sov * 100).toFixed(1)),
    "Perplexity SOV": Number((c.perplexity_sov * 100).toFixed(1)),
  }));

  const columns: Column<CompetitorRow>[] = [
    {
      key: "rank",
      header: "#",
      accessor: (r) => competitors.indexOf(r) + 1,
      align: "center",
      width: "40px",
      sortable: false,
      hideOnCard: true,
    },
    {
      key: "brand",
      header: "Marke",
      accessor: (r) => r.brand,
      cardPrimary: true,
      render: (r) => (
        <span className={clsx("font-semibold", r.brand === "NORTHWEAR" ? "text-accent-teal" : "text-ink-800")}>
          {r.brand}
        </span>
      ),
    },
    { key: "mentions", header: "Erwähnungen", accessor: (r) => r.mentions, align: "right" },
    { key: "overall_sov", header: "Gesamt-SOV", accessor: (r) => r.overall_sov, align: "right", render: (r) => pct(r.overall_sov) },
    { key: "chatgpt_sov", header: "ChatGPT SOV", accessor: (r) => r.chatgpt_sov, align: "right", render: (r) => pct(r.chatgpt_sov) },
    { key: "gemini_sov", header: "Gemini SOV", accessor: (r) => r.gemini_sov, align: "right", render: (r) => pct(r.gemini_sov) },
    { key: "perplexity_sov", header: "Perplexity SOV", accessor: (r) => r.perplexity_sov, align: "right", render: (r) => pct(r.perplexity_sov) },
    {
      key: "vs_nw",
      header: "vs. NORTHWEAR",
      accessor: (r) => r.overall_sov - competitors[nwIndex].overall_sov,
      align: "right",
      render: (r) => {
        if (r.brand === "NORTHWEAR") return <span className="text-ink-400">—</span>;
        const diff = (r.overall_sov - competitors[nwIndex].overall_sov) * 100;
        const ahead = diff > 0;
        return (
          <span className={clsx("inline-flex items-center gap-0.5 font-mono text-xs font-semibold", ahead ? "text-status-bad" : "text-status-good")}>
            {ahead ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(diff).toFixed(1)} pp {ahead ? "voraus" : "dahinter"}
          </span>
        );
      },
    },
  ];

  return (
    <div className="animate-in flex flex-col gap-6">
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-ink-500">NORTHWEAR-Ranking</div>
          <div className="mt-1 font-display text-2xl font-semibold text-ink-900">
            Platz {rank} von {competitors.length}
          </div>
          <p className="mt-1 text-sm text-ink-500">
            Nach Gesamt-Share-of-Voice über ChatGPT, Gemini und Perplexity kombiniert.
          </p>
        </div>
        <div className="flex gap-6">
          <MiniStat label="Gesamt-SOV" value={pct(competitors[nwIndex].overall_sov)} />
          <MiniStat label="ChatGPT SOV" value={pct(competitors[nwIndex].chatgpt_sov)} />
          <MiniStat label="Gemini SOV" value={pct(competitors[nwIndex].gemini_sov)} />
          <MiniStat label="Perplexity SOV" value={pct(competitors[nwIndex].perplexity_sov)} />
        </div>
      </Card>

      <Card>
        <CardHeader
          title="KI Share of Voice je Plattform"
          subtitle="Plattformunterschiede bewusst getrennt dargestellt — keine reine Gesamtzahl"
        />
        <BarComparisonChart
          data={chartData}
          xKey="brand"
          bars={[
            { key: "ChatGPT SOV", label: "ChatGPT", color: "#0E8388" },
            { key: "Gemini SOV", label: "Gemini", color: "#3E5C9A" },
            { key: "Perplexity SOV", label: "Perplexity", color: "#B4791F" },
          ]}
          layout="horizontal"
          height={340}
          yFormat={(v) => `${v}%`}
        />
      </Card>

      <Card>
        <CardHeader title="Wettbewerber-Ranking" subtitle="Sortierbar nach jeder Spalte" />
        <SortableTable columns={columns} rows={competitors} rowKey={(r) => r.brand} initialSortKey="overall_sov" />
      </Card>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <div className="text-[10.5px] font-medium uppercase tracking-wide text-ink-500">{label}</div>
      <div className="font-mono text-lg font-semibold text-ink-900">{value}</div>
    </div>
  );
}
