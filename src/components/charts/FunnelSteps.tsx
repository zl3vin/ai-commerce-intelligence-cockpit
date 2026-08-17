"use client";

import { num, pctFromRaw } from "@/lib/metrics/format";

export function FunnelSteps({
  steps,
}: {
  steps: { label: string; value: number }[];
}) {
  const max = steps[0]?.value || 1;
  return (
    <div className="flex flex-col gap-2.5">
      {steps.map((s, i) => {
        const widthPct = Math.max(6, (s.value / max) * 100);
        const dropOff = i > 0 ? (steps[i - 1].value > 0 ? (s.value / steps[i - 1].value) * 100 : 0) : 100;
        return (
          <div key={s.label}>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="font-medium text-ink-700">{s.label}</span>
              <span className="font-mono tabular-nums text-ink-500">
                {num(s.value)}
                {i > 0 && (
                  <span className="ml-2 text-ink-400">({pctFromRaw(dropOff, 1)} weiter)</span>
                )}
              </span>
            </div>
            <div className="h-6 w-full rounded-md bg-surface-muted">
              <div
                className="h-6 rounded-md bg-gradient-to-r from-accent-teal to-accent-teal/70 transition-all"
                style={{ width: `${widthPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
