"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

export function BarComparisonChart({
  data,
  xKey,
  bars,
  height = 260,
  yFormat,
  layout = "vertical",
  showLegend = true,
}: {
  data: Record<string, unknown>[];
  xKey: string;
  bars: { key: string; label: string; color: string }[];
  height?: number;
  yFormat?: (v: number) => string;
  layout?: "vertical" | "horizontal";
  showLegend?: boolean;
}) {
  const isHorizontal = layout === "horizontal";
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={isHorizontal ? "vertical" : "horizontal"}
        margin={{ top: 8, right: 16, left: isHorizontal ? 8 : 0, bottom: 0 }}
        barCategoryGap={isHorizontal ? 10 : 18}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F5" horizontal={!isHorizontal} vertical={isHorizontal} />
        {isHorizontal ? (
          <>
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#8593A3" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={yFormat}
            />
            <YAxis
              type="category"
              dataKey={xKey}
              tick={{ fontSize: 11, fill: "#33404F" }}
              axisLine={false}
              tickLine={false}
              width={110}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 11, fill: "#8593A3" }}
              axisLine={{ stroke: "#EEF1F5" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#8593A3" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={yFormat}
              width={44}
            />
          </>
        )}
        <Tooltip
          formatter={(v: number, name) => [yFormat ? yFormat(v) : v, name]}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #EEF1F5",
            fontSize: 12,
            boxShadow: "0 8px 24px rgba(19,26,36,0.12)",
          }}
        />
        {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {bars.map((b) => (
          <Bar key={b.key} dataKey={b.key} name={b.label} fill={b.color} radius={isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]} maxBarSize={28} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SingleSeriesBarChart({
  data,
  xKey,
  yKey,
  color = "#0E8388",
  height = 220,
  yFormat,
  highlightKey,
  highlightValue,
  highlightColor = "#0E8388",
  baseColor = "#B7C0CB",
}: {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
  yFormat?: (v: number) => string;
  highlightKey?: string;
  highlightValue?: string;
  highlightColor?: string;
  baseColor?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F5" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#8593A3" }} axisLine={false} tickLine={false} tickFormatter={yFormat} />
        <YAxis type="category" dataKey={xKey} tick={{ fontSize: 11.5, fill: "#33404F" }} axisLine={false} tickLine={false} width={120} />
        <Tooltip
          formatter={(v: number) => [yFormat ? yFormat(v) : v, ""]}
          contentStyle={{ borderRadius: 8, border: "1px solid #EEF1F5", fontSize: 12, boxShadow: "0 8px 24px rgba(19,26,36,0.12)" }}
        />
        <Bar dataKey={yKey} radius={[0, 4, 4, 0]} maxBarSize={22}>
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={highlightKey && d[highlightKey] === highlightValue ? highlightColor : baseColor}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
