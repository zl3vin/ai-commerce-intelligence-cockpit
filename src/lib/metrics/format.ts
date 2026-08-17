export function pct(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function pctFromRaw(value: number, digits = 1): string {
  // value already in 0-100 range
  return `${value.toFixed(digits)}%`;
}

export function eur(value: number, digits = 0): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function num(value: number, digits = 0): string {
  return new Intl.NumberFormat("de-DE", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function roundTo(value: number, digits = 2): number {
  const f = Math.pow(10, digits);
  return Math.round(value * f) / f;
}

export function monthLabel(isoMonth: string): string {
  const d = new Date(isoMonth + (isoMonth.length === 7 ? "-01" : ""));
  return new Intl.DateTimeFormat("de-DE", { month: "short", year: "2-digit" }).format(d);
}

export function toNumber(v: string | number | undefined | null): number {
  if (v === undefined || v === null || v === "") return NaN;
  const n = typeof v === "number" ? v : parseFloat(v);
  return n;
}
