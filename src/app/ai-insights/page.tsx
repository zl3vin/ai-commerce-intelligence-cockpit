"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { SelectFilter } from "@/components/ui/Filters";
import { PriorityBadge, PlatformBadge } from "@/components/ui/Badges";
import { getIntelligenceEngine } from "@/lib/data/load";
import { Lightbulb, TrendingUp, RotateCcw } from "lucide-react";

const TYPE_ICON_COLOR: Record<string, string> = {
  High: "text-accent-rose",
  Medium: "text-accent-amber",
  Low: "text-ink-400",
};

export default function AiInsightsPage() {
  const engine = useMemo(() => getIntelligenceEngine(), []);

  const platforms = useMemo(
    () => Array.from(new Set(engine.insights.map((i) => i.platform).filter(Boolean))).sort(),
    [engine]
  );
  const groups = useMemo(
    () => Array.from(new Set(engine.insights.map((i) => i.prompt_group).filter(Boolean))).sort(),
    [engine]
  );
  const types = useMemo(() => Array.from(new Set(engine.insights.map((i) => i.insight_type))).sort(), [engine]);

  const [priority, setPriority] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [group, setGroup] = useState("all");
  const [type, setType] = useState("all");

  const filtersActive = priority !== "all" || platform !== "all" || group !== "all" || type !== "all";
  function resetFilters() {
    setPriority("all");
    setPlatform("all");
    setGroup("all");
    setType("all");
  }

  const filtered = engine.insights
    .filter((i) => priority === "all" || i.priority === priority)
    .filter((i) => platform === "all" || i.platform === platform)
    .filter((i) => group === "all" || i.prompt_group === group)
    .filter((i) => type === "all" || i.insight_type === type)
    .sort((a, b) => b.opportunity_score - a.opportunity_score);

  return (
    <div className="animate-in flex flex-col gap-6">
      <Card>
        <div className="flex flex-wrap items-center gap-6">
          <SummaryStat label="Insights gesamt" value={engine.summary.insights_total} />
          <SummaryStat label="Hohe Priorität" value={engine.summary.high_priority} tone="rose" />
          <SummaryStat label="Mittlere Priorität" value={engine.summary.medium_priority} tone="amber" />
          <SummaryStat label="Hoch-volatile Paare" value={engine.summary.high_volatility_pairs} />
          <div className="ml-auto max-w-md text-xs leading-relaxed text-ink-500">
            <span className="font-semibold text-ink-700">{engine.engine_type}: </span>
            {engine.method_note}
          </div>
        </div>
      </Card>

      <Card padded={false}>
        <div className="flex flex-wrap items-end gap-4 p-4">
          <SelectFilter
            label="Priorität"
            value={priority}
            onChange={setPriority}
            options={[{ value: "all", label: "Alle" }, { value: "High", label: "Hoch" }, { value: "Medium", label: "Mittel" }, { value: "Low", label: "Niedrig" }]}
          />
          <SelectFilter
            label="Plattform"
            value={platform}
            onChange={setPlatform}
            options={[{ value: "all", label: "Alle" }, ...platforms.map((p) => ({ value: p, label: p }))]}
          />
          <SelectFilter
            label="Prompt-Gruppe"
            value={group}
            onChange={setGroup}
            options={[{ value: "all", label: "Alle" }, ...groups.map((g) => ({ value: g, label: g }))]}
          />
          <SelectFilter
            label="Insight-Typ"
            value={type}
            onChange={setType}
            options={[{ value: "all", label: "Alle" }, ...types.map((t) => ({ value: t, label: t }))]}
          />
          {filtersActive && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-md border border-ink-300/30 px-2.5 py-1.5 text-xs font-medium text-ink-600 hover:border-accent-teal hover:text-accent-teal"
            >
              <RotateCcw size={13} /> Filter zurücksetzen
            </button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((insight) => (
          <Card key={insight.insight_id} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Lightbulb size={16} className={TYPE_ICON_COLOR[insight.priority] ?? "text-ink-400"} />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                  {insight.insight_type}
                </span>
              </div>
              <PriorityBadge priority={insight.priority} />
            </div>

            <h3 className="font-display text-[15px] font-semibold leading-snug text-ink-900">{insight.title}</h3>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Befund</div>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-700">{insight.finding}</p>
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Beleg</div>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-600">{insight.evidence}</p>
            </div>

            <div className="rounded-lg bg-accent-tealSoft/60 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-accent-teal">
                <TrendingUp size={13} /> Empfohlene Maßnahme
              </div>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-700">{insight.recommended_action}</p>
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-2 pt-1 text-xs text-ink-500">
              {insight.platform && <PlatformBadge platform={insight.platform} />}
              {insight.prompt_group && (
                <span className="rounded-full border border-ink-300/25 bg-ink-300/10 px-2 py-0.5 font-medium text-ink-600">
                  {insight.prompt_group}
                </span>
              )}
              <span className="ml-auto font-mono">
                {insight.related_metric}: {insight.metric_value} vs. Benchmark {insight.benchmark_value}
              </span>
              <span className="font-mono font-semibold text-ink-800">
                Potenzial {insight.opportunity_score.toFixed(1)}
              </span>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="lg:col-span-2 text-center text-sm text-ink-400">
            Keine Insights für die aktuelle Filterauswahl.
          </Card>
        )}
      </div>
    </div>
  );
}

function SummaryStat({ label, value, tone }: { label: string; value: number; tone?: "rose" | "amber" }) {
  const color = tone === "rose" ? "text-accent-rose" : tone === "amber" ? "text-accent-amber" : "text-ink-900";
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-wide text-ink-500">{label}</div>
      <div className={`font-mono text-xl font-semibold ${color}`}>{value}</div>
    </div>
  );
}
