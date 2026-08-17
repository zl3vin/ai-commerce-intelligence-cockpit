# NORTHWEAR — AI Commerce Intelligence Cockpit

Ein Portfolio-Analytics-Dashboard, das klassische E-Commerce-KPIs mit AI/GEO-Visibility-Intelligence
kombiniert: Wie sichtbar ist eine Marke, wenn Kund:innen nicht mehr Google fragen, sondern ChatGPT,
Gemini oder Perplexity?

> ⚠️ **Synthetic Demo Data.** Alle Zahlen in diesem Projekt sind simuliert. NORTHWEAR ist keine reale
> Marke. Es werden keine echten Unternehmens-, Kunden- oder AI-Daten verwendet.

---

## Inhaltsverzeichnis

- [Problem](#problem)
- [Lösung](#lösung)
- [Features](#features)
- [Screenshots](#screenshots)
- [KPI-Definitionen](#kpi-definitionen)
- [Custom Score — Methodik](#custom-score--methodik)
- [Datenmodell](#datenmodell)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Deployment (Vercel)](#deployment-vercel)
- [Methodische Leitplanken](#methodische-leitplanken)
- [Future Roadmap](#future-roadmap)

---

## Problem

E-Commerce-Teams messen seit Jahren Google-Rankings, SEO-Traffic und Ads-Performance. Aber ein wachsender
Teil der Kaufentscheidungen entsteht heute in Konversationen mit AI-Assistenten — "Welche nachhaltige
Outdoor-Jacke passt zu mir?", "Northwear vs. Patagonia — was ist besser?". Klassische Analytics-Tools
(GA4, Shopify-Dashboards) machen diese neue Sichtbarkeitsebene nicht sichtbar. Marken wissen häufig nicht:

- Werden sie überhaupt von ChatGPT, Gemini oder Perplexity genannt?
- Werden sie aktiv **empfohlen**, oder nur beiläufig erwähnt?
- Welche Quellen zitieren die AI-Systeme, wenn sie über die Marke sprechen?
- Wie schneidet man im Vergleich zu direkten Wettbewerbern ab?

## Lösung

Das **AI Commerce Intelligence Cockpit** bringt klassische Commerce-KPIs und eine neue
AI-Visibility-Ebene in ein gemeinsames Dashboard:

1. **Commerce-Analytics** — Umsatz, Sessions, Conversion, ROAS, Funnel, Retouren, je Channel/Monat.
2. **AI-Visibility-Analytics** — 100 realistische Buyer-Prompts, gemessen über 3 Plattformen mit je
   3 Wiederholungs-Runs (900 Einzelmessungen), inkl. Mention/Recommendation/Citation Rate, Position,
   Share of Voice und einem transparent dokumentierten Custom Score.
3. **Intelligence Engine** — regelbasierte Insights, die konkrete Findings mit Evidenz und empfohlenen
   Maßnahmen verknüpfen (kein Blackbox-ML, jede Aussage ist nachvollziehbar aus den Rohdaten ableitbar).

Bewusst **keine** kausale Verknüpfung "AI Visibility → mehr Umsatz" — dafür fehlen echte Referral-Daten
(siehe [Methodische Leitplanken](#methodische-leitplanken)).

## Features

| View | Beschreibung |
|---|---|
| **Overview** | Executive-Zusammenfassung: Commerce-KPIs, Cockpit-Score-Gauge, Plattform- & Prompt-Gruppen-Vergleich, Top-Competitor-SOV, Top-AI-Insights |
| **Commerce** | Umsatz-/Order-Trend, Funnel (Sessions → Order), Channel-Performance, Retourenentwicklung — filterbar nach Monat & Channel |
| **AI Visibility** | KPIs (Score, Mention/Recommendation/Citation Rate, Ø Position, Share of Voice), Plattformvergleich, Prompt-Gruppen-Vergleich, Run-Volatility/Stability — filterbar nach Platform, Prompt Group, Measurement Date, Run |
| **Prompts** | Alle 100 Buyer-Prompts durchsuchbar & filterbar (Gruppe, Funnel Stage, Priority, Kategorie), sortierbare Tabelle, aufklappbare Detailansicht mit allen Einzel-Runs je Prompt |
| **Competitors** | AI Share of Voice im Wettbewerbsvergleich, je Plattform getrennt dargestellt, sortierbares Ranking |
| **Sources** | Welche Domains werden von AI-Systemen zitiert (Owned/Community/Third-party/Video), Plattformverteilung, konkrete Source-Opportunities |
| **AI Insights** | Regelbasierte Findings mit Finding → Evidence → Recommended Action, filterbar nach Priority/Platform/Prompt Group/Typ |
| **Methodology** | Vollständige Dokumentation der Scoring-Gewichtung, methodische Leitplanken, ehrlicher Business-Impact-Status |

Weitere Eigenschaften:
- Vollständig responsive (Mobile-Drawer-Navigation, kein horizontales Layout-Brechen)
- Sortierbare Tabellen, konsistente Such-/Filter-Komponenten
- "Synthetic Demo Data"-Badge durchgängig sichtbar
- Info-Tooltips an allen erklärungsbedürftigen KPIs

## Screenshots

> _Platzhalter — Screenshots nach Deployment ergänzen._

| Overview | AI Visibility | Prompts |
|---|---|---|
| `docs/screenshot-overview.png` | `docs/screenshot-ai-visibility.png` | `docs/screenshot-prompts.png` |

## KPI-Definitionen

**Commerce**
- **Revenue** — Bruttoumsatz im Betrachtungszeitraum.
- **Net Revenue** — Umsatz abzüglich Retourenwert.
- **Conversion Rate** — Orders ÷ Sessions.
- **AOV** — Average Order Value = Umsatz ÷ Orders.
- **ROAS** — Return on Ad Spend = Umsatz ÷ Marketing-Spend.
- **Return Rate** — Retouren ÷ Orders.

**AI Visibility**
- **Mention Rate** — Anteil AI-Antworten, in denen NORTHWEAR überhaupt genannt wird.
- **Recommendation Rate** — Anteil Antworten, in denen NORTHWEAR aktiv empfohlen wird (stärkeres Signal als reine Nennung).
- **Citation Rate** — Anteil Antworten mit Quellenangabe zu einer NORTHWEAR-URL. **Nicht gleichzusetzen mit Mention Rate** — eine Marke kann genannt, aber nicht zitiert werden, oder umgekehrt.
- **Average Position** — Ø Rangposition von NORTHWEAR in Antworten, in denen die Marke genannt wird.
- **AI Share of Voice (SOV)** — Anteil der NORTHWEAR-Nennungen an allen Markennennungen in den betrachteten Antworten.

## Custom Score — Methodik

Der **NORTHWEAR Cockpit Score** ist ein **selbst definierter Custom Score dieses Portfolio-Projekts —
kein Branchenstandard und keine Kennzahl eines realen Anbieters.**

```
Visibility Score = 0.30 × Mention Rate
                  + 0.25 × Recommendation Rate
                  + 0.20 × Share of Voice
                  + 0.15 × Citation Rate
                  + 0.10 × Position Score
```

`Position Score` normalisiert die Ø-Position auf eine 0–1-Skala (bessere Position → höherer Score).
Alle Messungen basieren auf 3 wiederholten Runs je Prompt und Plattform (ChatGPT, Gemini, Perplexity),
um einzelne AI-Antworten nicht als stabiles Ranking misszuverstehen — Volatility/Stability wird deshalb
als eigenes Signal ausgewiesen. Details: [`/methodology`](src/app/methodology/page.tsx) im Dashboard.

## Datenmodell

Alle Daten liegen als CSV/JSON im gelieferten Datenpaket vor und werden beim Build in `/data/*.json`
konvertiert (`src/lib/data/load.ts` ist die einzige Stelle, die die Rohdaten kennt):

| Datei | Inhalt |
|---|---|
| `products.csv` | 24 Produkte (Kategorie, Preis, Rating, Lagerbestand) |
| `commerce_performance.csv` | 60 Zeilen: 12 Monate × 5 Channels (Sessions, Orders, Revenue, ROAS, Retouren) |
| `ai_prompts.csv` | 100 Buyer-Prompts (Gruppe, Funnel Stage, Priority, Zielkategorie) |
| `ai_visibility_results.csv` | 900 Einzelmessungen (100 Prompts × 3 Plattformen × 3 Runs) |
| `ai_insights.csv` / `intelligence_engine.json` | Regelbasierte Insights inkl. Evidence & Recommended Action |
| `prompt_volatility.csv` | Stabilität je Prompt/Plattform über die 3 Runs |
| `prompt_opportunities.csv` | Aggregierte Opportunity-Scores je Prompt |
| `dashboard_aggregates.json` | Vorab berechnete Aggregate (Overview, Plattformen, Competitors, Sources, Commerce-Monatswerte) |

TypeScript-Typen für alle Modelle: [`src/types/index.ts`](src/types/index.ts).

## Tech Stack

- **Next.js 14** (App Router) + **TypeScript** (strict mode)
- **Tailwind CSS** — eigenes Design-System (Navy/Anthracite-Sidebar, restrained Akzentfarben)
- **Recharts** — Trend-, Bar- und Vergleichs-Charts
- **lucide-react** — Icons
- Statische JSON-Daten, kein Backend, keine Datenbank (siehe Roadmap)

## Installation

```bash
npm install
npm run dev
# → http://localhost:3000
```

Production-Build lokal testen:

```bash
npm run build
npm run start
```

## Deployment (Vercel)

Das Projekt ist ohne weitere Konfiguration auf Vercel deploybar (reines Next.js-Projekt, keine
Umgebungsvariablen, keine externen API-Keys nötig):

1. Repository zu GitHub pushen
2. In Vercel „Import Project" → Repository auswählen
3. Framework Preset: **Next.js** (wird automatisch erkannt)
4. Deploy — fertig.

## Methodische Leitplanken

- Mention Rate und Citation Rate werden **nie** gleichgesetzt.
- Plattformen werden nie zu einem Gesamtwert vermischt, ohne die Einzelwerte weiterhin zu zeigen.
- Wiederholte Runs sind ein Reliability-/Volatility-Signal, keine zusätzliche Stichprobe für punktgenaue Werte.
- **Es wird keine Aussage getroffen, dass AI Visibility bereits Umsatz verursacht** — dafür fehlen echte
  AI-Referral-Daten (siehe `business_impact_status` in `dashboard_aggregates.json` und die
  Methodology-Seite im Dashboard).
- Alle Daten sind synthetisch und durchgängig gekennzeichnet.
- Es werden keine erfundenen Branchen-Benchmarks verwendet.

## Future Roadmap

Bewusst **nicht** simuliert oder als bereits funktionierend dargestellt:

- API-basierte AI-Messungen statt manueller Prompt-Runs
- Persistente Datenbank statt statischer JSON-Dateien
- Authentifizierung & Multi-Tenant-Accounts
- Automatisierte, geplante Prompt-Runs
- GA4-Integration für echten Commerce-Kontext
- AI-Referral-Tracking (Sessions/Conversions aus AI-Traffic)
- Zeitliche Vergleiche über mehrere Quartale
- Belastbare Business-Impact-Auswertung (AI Visibility → Revenue), sobald echte Referral-Daten vorliegen

---

Portfolio-Projekt · synthetische Demo-Daten · kein reales Unternehmen.
