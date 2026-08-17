"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import clsx from "clsx";

export interface Column<T> {
  key: string;
  header: string;
  accessor: (row: T) => string | number;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  width?: string;
  sortable?: boolean;
  /** Excluded from the mobile card fallback (e.g. a chevron/expand-icon column). */
  hideOnCard?: boolean;
  /** Rendered as the card's title on mobile instead of a label:value row. */
  cardPrimary?: boolean;
}

export function SortableTable<T>({
  columns,
  rows,
  initialSortKey,
  initialSortDir = "desc",
  rowKey,
  dense = false,
  onRowClick,
  activeRowKey,
}: {
  columns: Column<T>[];
  rows: T[];
  initialSortKey?: string;
  initialSortDir?: "asc" | "desc";
  rowKey: (row: T) => string;
  dense?: boolean;
  onRowClick?: (row: T) => void;
  activeRowKey?: string | null;
}) {
  const [sortKey, setSortKey] = useState<string | undefined>(initialSortKey);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(initialSortDir);

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = col.accessor(a);
      const bv = col.accessor(b);
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return copy;
  }, [rows, sortKey, sortDir, columns]);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const primaryCol = columns.find((c) => c.cardPrimary);
  const cardCols = columns.filter((c) => !c.hideOnCard && c !== primaryCol);

  return (
    <>
      {/* Desktop / tablet: standard table, horizontally scrollable if needed */}
      <div className="scrollbar-thin hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-ink-300/20">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={clsx(
                    "select-none whitespace-nowrap px-3 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-ink-500",
                    col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left",
                    col.sortable !== false && "cursor-pointer hover:text-ink-900"
                  )}
                  onClick={() => col.sortable !== false && toggleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable !== false &&
                      (sortKey === col.key ? (
                        sortDir === "asc" ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )
                      ) : (
                        <ChevronsUpDown size={12} className="text-ink-300" />
                      ))}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={clsx(
                  "border-b border-ink-300/10 last:border-0 hover:bg-surface-muted/60",
                  onRowClick && "cursor-pointer",
                  activeRowKey === rowKey(row) && "bg-accent-tealSoft/40"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={clsx(
                      dense ? "px-3 py-2" : "px-3 py-3",
                      "align-middle text-ink-700",
                      col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                    )}
                  >
                    {col.render ? col.render(row) : col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-10 text-center text-sm text-ink-400">
                  Keine Ergebnisse für die aktuelle Filterauswahl.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked card fallback, avoids illegible horizontal-scroll tables */}
      <div className="flex flex-col gap-2.5 sm:hidden">
        {sorted.map((row) => (
          <div
            key={rowKey(row)}
            onClick={() => onRowClick?.(row)}
            className={clsx(
              "rounded-lg border border-ink-300/15 p-3",
              onRowClick && "cursor-pointer active:bg-surface-muted/60",
              activeRowKey === rowKey(row) && "border-accent-teal/40 bg-accent-tealSoft/30"
            )}
          >
            {primaryCol && (
              <div className="mb-2 text-sm font-semibold text-ink-900">
                {primaryCol.render ? primaryCol.render(row) : primaryCol.accessor(row)}
              </div>
            )}
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {cardCols.map((col) => (
                <div key={col.key} className="flex flex-col">
                  <dt className="text-[10.5px] font-medium uppercase tracking-wide text-ink-400">{col.header}</dt>
                  <dd className="text-xs text-ink-700">{col.render ? col.render(row) : col.accessor(row)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
        {sorted.length === 0 && (
          <div className="rounded-lg border border-ink-300/15 px-3 py-10 text-center text-sm text-ink-400">
            Keine Ergebnisse für die aktuelle Filterauswahl.
          </div>
        )}
      </div>
    </>
  );
}
