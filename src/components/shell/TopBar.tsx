"use client";

import { usePathname } from "next/navigation";
import { AlertTriangle } from "lucide-react";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Übersicht",
    subtitle: "Executive-Zusammenfassung: Commerce-Performance + KI-Sichtbarkeit",
  },
  "/commerce": {
    title: "Commerce",
    subtitle: "Umsatz, Traffic, Conversion, ROAS, Funnel und Retouren",
  },
  "/ai-visibility": {
    title: "KI-Sichtbarkeit",
    subtitle: "Sichtbarkeit von NORTHWEAR in ChatGPT, Gemini und Perplexity",
  },
  "/prompts": {
    title: "Prompts",
    subtitle: "100 Buyer-Prompts — durchsuchbar, filterbar, mit Run-Details",
  },
  "/competitors": {
    title: "Wettbewerber",
    subtitle: "KI Share of Voice im Wettbewerbsvergleich, je Plattform",
  },
  "/sources": {
    title: "Quellen",
    subtitle: "Welche Quellen zitieren KI-Systeme — und wo liegen Chancen?",
  },
  "/ai-insights": {
    title: "KI-Insights",
    subtitle: "Regelbasierte Findings mit Evidenz und empfohlenen Maßnahmen",
  },
  "/methodology": {
    title: "Methodik",
    subtitle: "Scoring-Logik, methodische Leitplanken und ehrlicher Business-Impact-Status",
  },
};

export default function TopBar() {
  const pathname = usePathname();
  const meta = TITLES[pathname] ?? TITLES["/"];

  return (
    <header className="sticky top-0 z-20 mt-14 border-b border-ink-300/15 bg-surface/85 backdrop-blur lg:mt-0">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="font-display text-xl font-semibold tracking-tight text-ink-900 sm:text-2xl">
            {meta.title}
          </h1>
          <p className="mt-0.5 text-sm text-ink-500">{meta.subtitle}</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-accent-amberSoft px-3 py-1.5 text-xs font-medium text-accent-amber">
          <AlertTriangle size={13} strokeWidth={2.3} />
          Synthetische Demo-Daten
        </div>
      </div>
    </header>
  );
}
