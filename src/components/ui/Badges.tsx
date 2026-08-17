import clsx from "clsx";

// Die zugrunde liegenden Datenwerte (High/Medium/Low, Owned/Community/...)
// bleiben Englisch, da sie 1:1 aus dem CSV/JSON-Datensatz stammen und als
// Styling-Keys dienen. Angezeigt wird jeweils die deutsche Übersetzung.

const PLATFORM_STYLES: Record<string, string> = {
  ChatGPT: "bg-accent-tealSoft text-accent-teal border-accent-teal/25",
  Gemini: "bg-accent-indigoSoft text-accent-indigo border-accent-indigo/25",
  Perplexity: "bg-accent-amberSoft text-accent-amber border-accent-amber/25",
};

export function PlatformBadge({ platform }: { platform: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        PLATFORM_STYLES[platform] ?? "bg-ink-300/10 text-ink-700 border-ink-300/30"
      )}
    >
      {platform}
    </span>
  );
}

const PRIORITY_STYLES: Record<string, string> = {
  High: "bg-accent-roseSoft text-accent-rose border-accent-rose/25",
  Medium: "bg-accent-amberSoft text-accent-amber border-accent-amber/25",
  Low: "bg-ink-300/10 text-ink-500 border-ink-300/25",
};

const PRIORITY_LABELS: Record<string, string> = {
  High: "Hoch",
  Medium: "Mittel",
  Low: "Niedrig",
};

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        PRIORITY_STYLES[priority] ?? "bg-ink-300/10 text-ink-600 border-ink-300/25"
      )}
    >
      {PRIORITY_LABELS[priority] ?? priority}
    </span>
  );
}

const VOLATILITY_STYLES: Record<string, string> = {
  High: "bg-accent-roseSoft text-accent-rose border-accent-rose/25",
  Medium: "bg-accent-amberSoft text-accent-amber border-accent-amber/25",
  Low: "bg-accent-tealSoft text-accent-teal border-accent-teal/25",
};

const VOLATILITY_LABELS: Record<string, string> = {
  High: "Hoch",
  Medium: "Mittel",
  Low: "Niedrig",
};

export function VolatilityBadge({ level }: { level: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        VOLATILITY_STYLES[level] ?? "bg-ink-300/10 text-ink-600 border-ink-300/25"
      )}
    >
      {VOLATILITY_LABELS[level] ?? level}
    </span>
  );
}

const SOURCE_TYPE_LABELS: Record<string, string> = {
  Owned: "Owned",
  Community: "Community",
  "Third-party": "Drittanbieter",
  Video: "Video",
};

export function SourceTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    Owned: "bg-accent-tealSoft text-accent-teal border-accent-teal/25",
    Community: "bg-accent-indigoSoft text-accent-indigo border-accent-indigo/25",
    "Third-party": "bg-ink-300/10 text-ink-600 border-ink-300/25",
    Video: "bg-accent-roseSoft text-accent-rose border-accent-rose/25",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        styles[type] ?? "bg-ink-300/10 text-ink-600 border-ink-300/25"
      )}
    >
      {SOURCE_TYPE_LABELS[type] ?? type}
    </span>
  );
}
