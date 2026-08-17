"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { SelectFilter } from "@/components/ui/Filters";
import { BarComparisonChart } from "@/components/charts/BarComparisonChart";
import {
  computeVisibilityMetrics,
  getFilteredVisibilityRows,
  getMeasurementDates,
  getRunNumbers,
  getPromptGroups,
  getPlatforms,
} from "@/lib/metrics/visibility";
import { getPromptVolatility } from "@/lib/data/load";
import { pct, pctFromRaw, num } from "@/lib/metrics/format";
import { PlatformBadge, VolatilityBadge } from "@/components/ui/Badges";
import InfoTooltip from "@/components/ui/InfoTooltip";
import type { Platform } from "@/types";
import { RotateCcw } from "lucide-react";

export default function AiVisibilityPage() {
  const platforms = useMemo(() => getPlatforms(), []);
  const dates = useMemo(() => getMeasurementDates(), []);
  const runs = useMemo(() => getRunNumbers(), []);
  const groups = useMemo(() => getPromptGroups(), []);

  const [platform, setPlatform] = useState("all");
  const [promptGroup, setPromptGroup] = useState("all");
  const [date, setDate] = useState("all");
  const [run, setRun] = useState("all");

  const filtersActive = platform !== "all" || promptGroup !== "all" || date !== "all" || run !== "all";
  function resetFilters() {
    setPlatform("all");
    setPromptGroup("all");
    setDate("all");
    setRun("all");
  }

  const filteredRows = getFilteredVisibilityRows({
    platform: platform as Platform | "all",
    promptGroup,
    measurementDate: date,
    runNumber: run,
  });
  const metrics = computeVisibilityMetrics(filteredRows);

  // Per-platform comparison always shows all 3 platforms (using the other active filters)
  const perPlatform = platforms.map((p) => {
    const rows = getFilteredVisibilityRows({
      platform: p,
      promptGroup,
      measurementDate: date,
      runNumber: run,
    });
    const m = computeVisibilityMetrics(rows);
    return {
      platform: p,
      "Mention Rate": Number((m.mentionRate * 100).toFixed(1)),
      "Recommendation Rate": Number((m.recommendationRate * 100).toFixed(1)),
      "Citation Rate": Number((m.citationRate * 100).toFixed(1)),
    };
  });

  const perPlatformScore = platforms.map((p) => {
    const rows = getFilteredVisibilityRows({ platform: p, promptGroup, measurementDate: date, runNumber: run });
    const m = computeVisibilityMetrics(rows);
    return { platform: p, "Visibility Score": Number((m.visibilityScore * 100).toFixed(1)) };
  });

  // Prompt group breakdown
  const perGroup = groups.map((g) => {
    const rows = getFilteredVisibilityRows({
      platform: platform as Platform | "all",
      promptGroup: g,
      measurementDate: date,
      runNumber: run,
    });
    const m = computeVisibilityMetrics(rows);
    return { group: g, "Visibility Score": Number((m.visibilityScore * 100).toFixed(1)) };
  });

  // Volatility / stability summary per platform
  const volatility = getPromptVolatility();
  const volByPlatform = platforms.map((p) => {
    const rows = volatility.filter(
      (v) => v.platform === p && (promptGroup === "all" || v.prompt_group === promptGroup)
    );
    const avgStability =
      rows.length > 0 ? rows.reduce((s, r) => s + parseFloat(r.stability_score), 0) / rows.length : 0;
    const highCount = rows.filter((r) => r.volatility_class === "High").length;
    return { platform: p, avgStability, total: rows.length, highCount };
  });

  return (
    <div className="animate-in flex flex-col gap-6">
      <Card padded={false}>
        <div className="flex flex-wrap items-end gap-4 p-4">
          <SelectFilter
            label="Plattform"
            value={platform}
            onChange={setPlatform}
            options={[{ value: "all", label: "Alle Plattformen" }, ...platforms.map((p) => ({ value: p, label: p }))]}
          />
          <SelectFilter
            label="Prompt-Gruppe"
            value={promptGroup}
            onChange={setPromptGroup}
            options={[{ value: "all", label: "Alle Gruppen" }, ...groups.map((g) => ({ value: g, label: g }))]}
          />
          <SelectFilter
            label="Messdatum"
            value={date}
            onChange={setDate}
            options={[{ value: "all", label: "Alle Termine" }, ...dates.map((d) => ({ value: d, label: d }))]}
          />
          <SelectFilter
            label="Run"
            value={run}
            onChange={setRun}
            options={[{ value: "all", label: "Alle Runs" }, ...runs.map((r) => ({ value: r, label: `Run ${r}` }))]}
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          label="KI-Sichtbarkeits-Score"
          value={Math.round(metrics.visibilityScore * 100).toString()}
          sub={`${num(metrics.measurements)} Messungen`}
          info="Custom NORTHWEAR Cockpit Score: 30% Erwähnungsrate, 25% Empfehlungsrate, 20% Share of Voice, 15% Zitationsrate, 10% Positions-Score."
        />
        <KpiCard label="Erwähnungsrate" value={pct(metrics.mentionRate)} info="Anteil Antworten mit NORTHWEAR-Nennung." />
        <KpiCard
          label="Empfehlungsrate"
          value={pct(metrics.recommendationRate)}
          info="Anteil Antworten, in denen NORTHWEAR aktiv empfohlen wird."
        />
        <KpiCard
          label="Zitationsrate"
          value={pct(metrics.citationRate)}
          info="Anteil Antworten mit Zitation einer NORTHWEAR-URL. Nicht gleichzusetzen mit der Erwähnungsrate."
        />
        <KpiCard
          label="Durchschnittsposition"
          value={metrics.avgPosition > 0 ? metrics.avgPosition.toFixed(2) : "—"}
          info="Durchschnittliche Rangposition von NORTHWEAR in Antworten, in denen die Marke genannt wird."
        />
        <KpiCard
          label="KI Share of Voice"
          value={pct(metrics.shareOfVoice)}
          info="Anteil der NORTHWEAR-Nennungen an allen Markennennungen in den betrachteten Antworten."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="ChatGPT vs Gemini vs Perplexity"
            subtitle="Erwähnungs-/Empfehlungs-/Zitationsrate je Plattform — getrennt dargestellt"
          />
          <BarComparisonChart
            data={perPlatform}
            xKey="platform"
            bars={[
              { key: "Mention Rate", label: "Erwähnungsrate", color: "#3E5C9A" },
              { key: "Recommendation Rate", label: "Empfehlungsrate", color: "#0E8388" },
              { key: "Citation Rate", label: "Zitationsrate", color: "#B4791F" },
            ]}
            yFormat={(v) => `${v}%`}
          />
        </Card>
        <Card>
          <CardHeader title="Sichtbarkeits-Score je Plattform" subtitle="Custom Cockpit Score, keine Branchen-Benchmark" />
          <BarComparisonChart
            data={perPlatformScore}
            xKey="platform"
            bars={[{ key: "Visibility Score", label: "Sichtbarkeits-Score", color: "#0E8388" }]}
            yFormat={(v) => `${v}%`}
            showLegend={false}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Sichtbarkeits-Score je Prompt-Gruppe" subtitle="Unter aktueller Plattform-/Datumsfilterung" />
          <BarComparisonChart
            data={perGroup}
            xKey="group"
            bars={[{ key: "Visibility Score", label: "Sichtbarkeits-Score", color: "#3E5C9A" }]}
            yFormat={(v) => `${v}%`}
            showLegend={false}
          />
        </Card>

        <Card>
          <CardHeader
            title="Run-Volatilität & Stabilität"
            subtitle="Wiederholte Messungen (3 Runs) als Reliability-Signal je Plattform"
            info={
              <InfoTooltip>
                Volatilität misst, wie stark sich Antworten über wiederholte Messungen desselben Prompts
                unterscheiden. Hohe Stabilität bedeutet konsistente KI-Antworten.
              </InfoTooltip>
            }
          />
          <div className="flex flex-col gap-3">
            {volByPlatform.map((v) => (
              <div key={v.platform} className="flex items-center justify-between rounded-lg border border-ink-300/15 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <PlatformBadge platform={v.platform} />
                  <span className="text-xs text-ink-500">{v.total} Prompt-Plattform-Paare</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono tabular-nums text-sm text-ink-700">
                    Ø Stabilität {v.avgStability.toFixed(1)}%
                  </span>
                  {v.highCount > 0 && (
                    <span className="flex items-center gap-1 text-xs text-ink-500">
                      {v.highCount}× <VolatilityBadge level="High" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-400">
            Wiederholte Runs dienen als Reliability-Signal, nicht als Trendaussage. Einzelne KI-Antworten sind keine
            stabilen Rankings.
          </p>
        </Card>
      </div>
    </div>
  );
}
