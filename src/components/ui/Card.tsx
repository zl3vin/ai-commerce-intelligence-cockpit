import clsx from "clsx";
import type { ReactNode } from "react";

export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={clsx(
        "rounded-card border border-ink-300/15 bg-surface-card shadow-card",
        padded && "p-5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  info,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  info?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-1.5">
          <h3 className="font-display text-[15px] font-semibold text-ink-900">{title}</h3>
          {info}
        </div>
        {subtitle && <p className="mt-0.5 text-xs text-ink-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
