"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ComposedChart,
} from "recharts";

export function TrendChart({
  data,
  xKey,
  areaKey,
  areaLabel,
  lineKey,
  lineLabel,
  areaColor = "#0E8388",
  lineColor = "#B4791F",
  yFormat,
  height = 260,
}: {
  data: Record<string, unknown>[];
  xKey: string;
  areaKey: string;
  areaLabel: string;
  lineKey?: string;
  lineLabel?: string;
  areaColor?: string;
  lineColor?: string;
  yFormat?: (v: number) => string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={areaColor} stopOpacity={0.22} />
            <stop offset="100%" stopColor={areaColor} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F5" vertical={false} />
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
          width={56}
        />
        <Tooltip
          formatter={(v: number, name) => [yFormat ? yFormat(v) : v, name]}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #EEF1F5",
            fontSize: 12,
            boxShadow: "0 8px 24px rgba(19,26,36,0.12)",
          }}
        />
        <Area
          type="monotone"
          dataKey={areaKey}
          name={areaLabel}
          stroke={areaColor}
          strokeWidth={2}
          fill="url(#areaFill)"
        />
        {lineKey && (
          <Line
            type="monotone"
            dataKey={lineKey}
            name={lineLabel}
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
