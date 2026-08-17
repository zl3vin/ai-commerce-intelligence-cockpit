"use client";

import { Search } from "lucide-react";

export function SelectFilter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-ink-300/30 bg-surface-card px-2.5 py-1.5 text-sm text-ink-800 shadow-sm outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">Suche</span>
      <div className="relative">
        <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-ink-300/30 bg-surface-card py-1.5 pl-8 pr-2.5 text-sm text-ink-800 shadow-sm outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal sm:w-64"
        />
      </div>
    </label>
  );
}
