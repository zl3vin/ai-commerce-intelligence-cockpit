import type { ReactNode } from "react";
import InfoTooltip from "./InfoTooltip";
import clsx from "clsx";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function KpiCard({
  label,
  value,
  sub,
  info,
  delta,
  deltaGood = "up",
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  info?: ReactNode;
  delta?: string;
  deltaGood?: "up" | "down";
  icon?: ReactNode;
}) {
  const deltaPositive = delta?.trim().startsWith("+");
  const deltaNegative = delta?.trim().startsWith("-");
  const isGood =
    (deltaGood === "up" && deltaPositive) || (deltaGood === "down" && deltaNegative);
  const isBad =
    (deltaGood === "up" && deltaNegative) || (deltaGood === "down" && deltaPositive);

  return (
    <div className="rounded-card border border-ink-300/15 bg-surface-card p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11.5px] font-medium uppercase tracking-wide text-ink-500">
          {label}
          {info && <InfoTooltip>{info}</InfoTooltip>}
        </div>
        {icon && <div className="text-ink-300">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-mono tabular-nums text-[26px] font-semibold leading-none text-ink-900">
          {value}
        </span>
        {delta && (
          <span
            className={clsx(
              "flex items-center gap-0.5 text-xs font-semibold",
              isGood && "text-status-good",
              isBad && "text-status-bad",
              !isGood && !isBad && "text-ink-400"
            )}
          >
            {deltaPositive ? <ArrowUpRight size={13} /> : deltaNegative ? <ArrowDownRight size={13} /> : null}
            {delta}
          </span>
        )}
      </div>
      {sub && <p className="mt-1 text-xs text-ink-500">{sub}</p>}
    </div>
  );
}
