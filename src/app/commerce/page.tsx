"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { TrendChart } from "@/components/charts/TrendChart";
import { BarComparisonChart } from "@/components/charts/BarComparisonChart";
import { FunnelSteps } from "@/components/charts/FunnelSteps";
import { SelectFilter } from "@/components/ui/Filters";
import { getChannelMonthly, getChannels, getMonths, summarizeChannelRows } from "@/lib/metrics/commerce";
import { eur, monthLabel, num, pctFromRaw } from "@/lib/metrics/format";
import { RotateCcw } from "lucide-react";

export default function CommercePage() {
  const allRows = useMemo(() => getChannelMonthly(), []);
  const channels = useMemo(() => getChannels(), []);
  const months = useMemo(() => getMonths(), []);

  const [channel, setChannel] = useState("all");
  const [month, setMonth] = useState("all");

  const filtersActive = channel !== "all" || month !== "all";
  function resetFilters() {
    setChannel("all");
    setMonth("all");
  }

  const filtered = allRows.filter(
    (r) => (channel === "all" || r.channel === channel) && (month === "all" || r.month === month)
  );

  const summary = summarizeChannelRows(filtered);

  // Revenue + orders trend (aggregated across channel filter, per month)
  const trendByMonth = months.map((m) => {
    const rows = filtered.filter((r) => r.month === m);
    const rev = rows.reduce((s, r) => s + r.revenue, 0);
    const orders = rows.reduce((s, r) => s + r.orders, 0);
    return { month: monthLabel(m), Umsatz: Math.round(rev), Bestellungen: orders };
  });

  // Channel performance (respecting month filter, ignoring channel filter for comparison)
  const channelRows = allRows.filter((r) => month === "all" || r.month === month);
  const channelPerf = channels.map((c) => {
    const rows = channelRows.filter((r) => r.channel === c);
    const s = summarizeChannelRows(rows);
    return { channel: c, Umsatz: Math.round(s.revenue), ROAS: Number(s.roas.toFixed(2)) };
  });

  // Return rate trend
  const returnTrend = months.map((m) => {
    const rows = filtered.filter((r) => r.month === m);
    const orders = rows.reduce((s, r) => s + r.orders, 0);
    const returns = rows.reduce((s, r) => s + r.returns, 0);
    return { month: monthLabel(m), "Retourenquote": orders > 0 ? Number(((returns / orders) * 100).toFixed(2)) : 0 };
  });

  // Funnel (sum across filtered rows)
  const funnel = [
    { label: "Sessions", value: filtered.reduce((s, r) => s + r.sessions, 0) },
    { label: "Produktansichten", value: filtered.reduce((s, r) => s + r.product_views, 0) },
    { label: "In den Warenkorb", value: filtered.reduce((s, r) => s + r.add_to_cart, 0) },
    { label: "Checkout gestartet", value: filtered.reduce((s, r) => s + r.checkout_started, 0) },
    { label: "Bestellungen", value: filtered.reduce((s, r) => s + r.orders, 0) },
  ];

  return (
    <div className="animate-in flex flex-col gap-6">
      <Card padded={false}>
        <div className="flex flex-wrap items-end gap-4 p-4">
          <SelectFilter
            label="Monat"
            value={month}
            onChange={setMonth}
            options={[{ value: "all", label: "Alle Monate" }, ...months.map((m) => ({ value: m, label: monthLabel(m) }))]}
          />
          <SelectFilter
            label="Channel"
            value={channel}
            onChange={setChannel}
            options={[{ value: "all", label: "Alle Channels" }, ...channels.map((c) => ({ value: c, label: c }))]}
          />
          {filtersActive && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-md border border-ink-300/30 px-2.5 py-1.5 text-xs font-medium text-ink-600 hover:border-accent-teal hover:text-accent-teal"
            >
              <RotateCcw size={13} /> Filter zurücksetzen
            </button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <KpiCard label="Umsatz" value={eur(summary.revenue)} />
        <KpiCard label="Netto-Umsatz" value={eur(summary.netRevenue)} info="Umsatz abzüglich Retourenwert." />
        <KpiCard label="Bestellungen" value={num(summary.orders)} />
        <KpiCard label="Sessions" value={num(summary.sessions)} />
        <KpiCard label="Konversionsrate" value={pctFromRaw(summary.conversionRate, 2)} />
        <KpiCard label="AOV" value={eur(summary.aov, 2)} info="Average Order Value: durchschnittlicher Bestellwert." />
        <KpiCard label="ROAS" value={`${summary.roas.toFixed(2)}×`} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Umsatzentwicklung" subtitle="Umsatz und Bestellungen pro Monat, gemäß aktueller Filterauswahl" />
          <TrendChart
            data={trendByMonth}
            xKey="month"
            areaKey="Umsatz"
            areaLabel="Umsatz (€)"
            lineKey="Bestellungen"
            lineLabel="Bestellungen"
            yFormat={(v) => (v > 100 ? `${Math.round(v / 1000)}k` : v.toString())}
          />
        </Card>
        <Card>
          <CardHeader title="Funnel" subtitle="Sessions bis Bestellung, aktuelle Filterauswahl" />
          <FunnelSteps steps={funnel} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Channel-Performance" subtitle="Umsatz & ROAS je Channel (Monatsfilter aktiv, Channel-Filter ignoriert)" />
          <BarComparisonChart
            data={channelPerf}
            xKey="channel"
            bars={[{ key: "Umsatz", label: "Umsatz (€)", color: "#0E8388" }]}
            yFormat={(v) => (v > 100 ? `${Math.round(v / 1000)}k` : v.toString())}
          />
        </Card>
        <Card>
          <CardHeader title="Retourenentwicklung" subtitle="Retourenquote pro Monat, aktuelle Filterauswahl" />
          <TrendChart
            data={returnTrend}
            xKey="month"
            areaKey="Retourenquote"
            areaLabel="Retourenquote (%)"
            areaColor="#B3455A"
            yFormat={(v) => `${v}%`}
          />
        </Card>
      </div>
    </div>
  );
}
