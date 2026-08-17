import { Card, CardHeader } from "@/components/ui/Card";
import { getDashboardAggregates } from "@/lib/data/load";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export const metadata = {
  title: "Methodik — AI Commerce Intelligence Cockpit",
};

export default function MethodologyPage() {
  const agg = getDashboardAggregates();
  const w = agg.methodology.visibility_score.weights;

  const rows = [
    { label: "Erwähnungsrate", weight: w.mention_rate, desc: "Anteil der KI-Antworten, in denen NORTHWEAR überhaupt genannt wird." },
    { label: "Empfehlungsrate", weight: w.recommendation_rate, desc: "Anteil der Antworten, in denen NORTHWEAR aktiv empfohlen wird (stärkeres Signal als reine Nennung)." },
    { label: "Share of Voice", weight: w.share_of_voice, desc: "Anteil der NORTHWEAR-Nennungen an allen Markennennungen in den betrachteten Antworten." },
    { label: "Zitationsrate", weight: w.citation_rate, desc: "Anteil der Antworten mit einer konkreten Quellenangabe zu NORTHWEAR." },
    { label: "Positions-Score", weight: w.position_score, desc: "Normalisierte durchschnittliche Rangposition, wenn NORTHWEAR genannt wird." },
  ];

  return (
    <div className="animate-in flex flex-col gap-6">
      <Card>
        <CardHeader
          title="NORTHWEAR Cockpit Score — Methodik"
          subtitle="Der KI-Sichtbarkeits-Score ist ein selbst definierter Custom Score dieses Portfolio-Projekts, kein Branchenstandard."
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {rows.map((r) => (
            <div key={r.label} className="rounded-lg border border-ink-300/15 p-3.5">
              <div className="font-mono text-2xl font-bold text-accent-teal">{Math.round(r.weight * 100)}%</div>
              <div className="mt-1 text-sm font-semibold text-ink-900">{r.label}</div>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">{r.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-lg bg-surface-muted p-3 text-xs leading-relaxed text-ink-600">
          Formel: <code className="font-mono">Sichtbarkeits-Score = 0,30 × Erwähnungsrate + 0,25 × Empfehlungsrate + 0,20 × Share of Voice + 0,15 × Zitationsrate + 0,10 × Positions-Score</code>.
          Alle Messungen basieren auf {agg.methodology.repeat_measurements} wiederholten Runs je Prompt und Plattform ({agg.methodology.platforms.join(", ")}),
          um einzelne KI-Antworten nicht als stabiles Ranking misszuverstehen.
        </p>
      </Card>

      <Card>
        <CardHeader title="Methodische Leitplanken" subtitle="Bewusste Einschränkungen dieses Cockpits" />
        <ul className="flex flex-col gap-2.5">
          <Rule text="Erwähnungsrate und Zitationsrate werden nie gleichgesetzt — Nennung ≠ Quellenangabe." />
          <Rule text="Plattformen (ChatGPT, Gemini, Perplexity) werden nie zu einem Gesamtwert vermischt, ohne die Einzelwerte weiterhin sichtbar zu halten." />
          <Rule text="Wiederholte Runs werden als Reliability-/Volatilitäts-Signal gezeigt, nicht als zusätzliche Stichprobe für punktgenaue Werte." />
          <Rule text="Es wird keine Aussage getroffen, dass KI-Sichtbarkeit bereits Umsatz verursacht." />
          <Rule text="KI-Sichtbarkeit → Umsatz wird aktuell nur als zukünftige Measurement-Roadmap dargestellt, nicht als belegter Zusammenhang." />
          <Rule text="Alle Daten sind synthetisch und klar als Demo-Daten gekennzeichnet." />
          <Rule text="Es werden keine erfundenen Branchen-Benchmarks verwendet." />
        </ul>
      </Card>

      <Card>
        <CardHeader
          title="Business-Impact-Status"
          subtitle="Ehrliche Einordnung: KI-Sichtbarkeit und Commerce-Performance werden aktuell nicht kausal verknüpft"
        />
        <div className="flex items-start gap-3 rounded-lg border border-amber-400/30 bg-accent-amberSoft p-4">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-accent-amber" />
          <div>
            <div className="text-sm font-semibold text-ink-900">
              Kausale Aussage aktuell nicht möglich
              {agg.business_impact_status.causal_claim_ready === false ? " (bestätigt)" : ""}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-ink-600">
              Es fehlen folgende Datenpunkte, um KI-Sichtbarkeit seriös mit der Umsatzentwicklung zu verknüpfen:
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {agg.business_impact_status.missing.map((m) => (
                <li key={m} className="flex items-center gap-2 text-sm text-ink-700">
                  <XCircle size={14} className="text-accent-rose" /> {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Roadmap für zukünftige Ausbaustufen" subtitle="Bewusst nicht simuliert oder als funktionierend dargestellt" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            "API-basierte KI-Messungen (statt manueller Prompt-Runs)",
            "Persistente Datenbank statt statischer CSV/JSON-Dateien",
            "Authentifizierung & Unternehmensaccounts",
            "Geplante, automatisierte Prompt-Runs",
            "GA4-Integration für echten Commerce-Kontext",
            "KI-Referral-Tracking (Sessions/Conversions aus KI-Traffic)",
            "Zeitliche Vergleiche über mehrere Quartale",
            "Belastbare Business-Impact-Auswertung (KI-Sichtbarkeit → Umsatz)",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-lg border border-ink-300/15 px-3 py-2.5 text-sm text-ink-700">
              <CheckCircle2 size={14} className="shrink-0 text-ink-300" />
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Rule({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-ink-700">
      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-accent-teal" />
      {text}
    </li>
  );
}
