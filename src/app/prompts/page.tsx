"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { SelectFilter, SearchInput } from "@/components/ui/Filters";
import { SortableTable, type Column } from "@/components/ui/SortableTable";
import { PriorityBadge, PlatformBadge, VolatilityBadge } from "@/components/ui/Badges";
import { getJoinedPrompts, getRunsForPrompt, getVolatilityForPrompt, type PromptRow } from "@/lib/metrics/prompts";
import { pct } from "@/lib/metrics/format";
import { ChevronDown, ChevronRight, RotateCcw } from "lucide-react";

export default function PromptsPage() {
  const allPrompts = useMemo(() => getJoinedPrompts(), []);
  const groups = useMemo(() => Array.from(new Set(allPrompts.map((p) => p.prompt_group))).sort(), [allPrompts]);
  const stages = useMemo(() => Array.from(new Set(allPrompts.map((p) => p.funnel_stage))).sort(), [allPrompts]);
  const categories = useMemo(
    () => Array.from(new Set(allPrompts.map((p) => p.target_category))).sort(),
    [allPrompts]
  );

  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("all");
  const [stage, setStage] = useState("all");
  const [priority, setPriority] = useState("all");
  const [category, setCategory] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtersActive =
    search.trim() !== "" || group !== "all" || stage !== "all" || priority !== "all" || category !== "all";

  function resetFilters() {
    setSearch("");
    setGroup("all");
    setStage("all");
    setPriority("all");
    setCategory("all");
  }

  const filtered = allPrompts.filter((p) => {
    if (group !== "all" && p.prompt_group !== group) return false;
    if (stage !== "all" && p.funnel_stage !== stage) return false;
    if (priority !== "all" && p.priority !== priority) return false;
    if (category !== "all" && p.target_category !== category) return false;
    if (search.trim() && !p.prompt_text.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  const columns: Column<PromptRow>[] = [
    {
      key: "expand",
      header: "",
      accessor: () => "",
      sortable: false,
      width: "32px",
      hideOnCard: true,
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(expanded === row.prompt_id ? null : row.prompt_id);
          }}
          className="text-ink-400 hover:text-accent-teal"
          aria-label="Details anzeigen"
        >
          {expanded === row.prompt_id ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </button>
      ),
    },
    {
      key: "prompt_text",
      header: "Prompt",
      accessor: (r) => r.prompt_text,
      width: "300px",
      cardPrimary: true,
      render: (r) => (
        <div>
          <div className="max-w-[280px] text-sm text-ink-900">{r.prompt_text}</div>
          <div className="mt-0.5 text-[11px] text-ink-400">{r.prompt_id} · {r.target_category}</div>
        </div>
      ),
    },
    { key: "prompt_group", header: "Gruppe", accessor: (r) => r.prompt_group },
    { key: "funnel_stage", header: "Funnel-Stufe", accessor: (r) => r.funnel_stage },
    { key: "priority", header: "Priorität", accessor: (r) => r.priority, render: (r) => <PriorityBadge priority={r.priority} /> },
    { key: "mention_rate", header: "Erwähnung", accessor: (r) => r.mention_rate, align: "right", render: (r) => pct(r.mention_rate) },
    { key: "recommendation_rate", header: "Empfehlung", accessor: (r) => r.recommendation_rate, align: "right", render: (r) => pct(r.recommendation_rate) },
    { key: "citation_rate", header: "Zitation", accessor: (r) => r.citation_rate, align: "right", render: (r) => pct(r.citation_rate) },
    { key: "avg_position", header: "Ø Position", accessor: (r) => r.avg_position, align: "right", render: (r) => (r.avg_position > 0 ? r.avg_position.toFixed(2) : "—") },
    { key: "visibility_score", header: "Score", accessor: (r) => r.visibility_score, align: "right", render: (r) => pct(r.visibility_score) },
    { key: "weakest_platform", header: "Schwächste Plattform", accessor: (r) => r.weakest_platform, render: (r) => <PlatformBadge platform={r.weakest_platform} /> },
    { key: "opportunity_score", header: "Potenzial", accessor: (r) => r.opportunity_score, align: "right", render: (r) => r.opportunity_score.toFixed(1) },
    { key: "volatility_class", header: "Volatilität", accessor: (r) => r.volatility_class, render: (r) => <VolatilityBadge level={r.volatility_class} /> },
  ];

  const expandedPrompt = expanded ? allPrompts.find((p) => p.prompt_id === expanded) : null;

  return (
    <div className="animate-in flex flex-col gap-6">
      <Card padded={false}>
        <div className="flex flex-wrap items-end gap-4 p-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Prompt-Text durchsuchen…" />
          <SelectFilter label="Prompt-Gruppe" value={group} onChange={setGroup} options={[{ value: "all", label: "Alle" }, ...groups.map((g) => ({ value: g, label: g }))]} />
          <SelectFilter label="Funnel-Stufe" value={stage} onChange={setStage} options={[{ value: "all", label: "Alle" }, ...stages.map((s) => ({ value: s, label: s }))]} />
          <SelectFilter label="Priorität" value={priority} onChange={setPriority} options={[{ value: "all", label: "Alle" }, { value: "High", label: "Hoch" }, { value: "Medium", label: "Mittel" }, { value: "Low", label: "Niedrig" }]} />
          <SelectFilter label="Zielkategorie" value={category} onChange={setCategory} options={[{ value: "all", label: "Alle" }, ...categories.map((c) => ({ value: c, label: c }))]} />
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

      <Card>
        <CardHeader
          title={`Buyer Prompts (${filtered.length} von ${allPrompts.length})`}
          subtitle="Zeile anklicken für Detailansicht mit einzelnen Mess-Runs je Plattform"
        />
        <SortableTable
          columns={columns}
          rows={filtered}
          rowKey={(r) => r.prompt_id}
          initialSortKey="opportunity_score"
          dense
          onRowClick={(row) => setExpanded(expanded === row.prompt_id ? null : row.prompt_id)}
          activeRowKey={expanded}
        />
      </Card>

      {expandedPrompt && <PromptDetail prompt={expandedPrompt} />}
    </div>
  );
}

function PromptDetail({ prompt }: { prompt: PromptRow }) {
  const runs = getRunsForPrompt(prompt.prompt_id);
  const volatility = getVolatilityForPrompt(prompt.prompt_id);

  return (
    <Card>
      <CardHeader title={`Mess-Runs — ${prompt.prompt_id}`} subtitle={prompt.prompt_text} />
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {volatility.map((v) => (
          <div key={v.platform} className="rounded-lg border border-ink-300/15 p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <PlatformBadge platform={v.platform} />
              <VolatilityBadge level={v.volatility_class} />
            </div>
            <div className="text-xs text-ink-500">
              Stabilität: <span className="font-mono text-ink-800">{v.stability_score}%</span>
            </div>
            <div className="text-xs text-ink-500">
              Erwähnungs-Runs: <span className="font-mono text-ink-800">{v.mention_runs}</span>
            </div>
            <div className="text-xs text-ink-500">
              Positions-Runs: <span className="font-mono text-ink-800">{v.position_runs}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-ink-300/20 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-500">
              <th className="px-3 py-2">Plattform</th>
              <th className="px-3 py-2">Datum</th>
              <th className="px-3 py-2">Run</th>
              <th className="px-3 py-2 text-center">Erwähnt</th>
              <th className="px-3 py-2 text-right">Position</th>
              <th className="px-3 py-2 text-center">Empfohlen</th>
              <th className="px-3 py-2 text-center">Zitiert</th>
              <th className="px-3 py-2">Top-Marke</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r) => (
              <tr key={r.measurement_id} className="border-b border-ink-300/10 last:border-0">
                <td className="px-3 py-2"><PlatformBadge platform={r.platform} /></td>
                <td className="px-3 py-2 font-mono text-xs text-ink-600">{r.measurement_date}</td>
                <td className="px-3 py-2 font-mono text-xs text-ink-600">{r.run_number}</td>
                <td className="px-3 py-2 text-center">{r.northwear_mentioned === "1" ? "✅" : "—"}</td>
                <td className="px-3 py-2 text-right font-mono text-xs text-ink-700">{r.northwear_position || "—"}</td>
                <td className="px-3 py-2 text-center">{r.northwear_recommended === "1" ? "✅" : "—"}</td>
                <td className="px-3 py-2 text-center">{r.northwear_website_cited === "1" ? "✅" : "—"}</td>
                <td className="px-3 py-2 text-xs text-ink-600">{r.top_brand}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
