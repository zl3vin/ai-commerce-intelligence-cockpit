"use client";

import InfoTooltip from "./InfoTooltip";

// A cockpit-instrument-style radial gauge. Signature visual element of the
// Overview page: renders the custom NORTHWEAR Visibility Score as an
// arc from -130deg to +130deg, echoing an analog gauge without being literal.
export function ScoreGauge({
  value, // 0..1
  size = 168,
  label = "NORTHWEAR Cockpit Score",
  info,
}: {
  value: number;
  size?: number;
  label?: string;
  info?: React.ReactNode;
}) {
  const clamped = Math.max(0, Math.min(1, value));
  const startAngle = -130;
  const endAngle = 130;
  const angle = startAngle + clamped * (endAngle - startAngle);

  const radius = size / 2 - 14;
  const cx = size / 2;
  const cy = size / 2;

  const polar = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const arcPath = (a0: number, a1: number) => {
    const p0 = polar(a0);
    const p1 = polar(a1);
    const largeArc = a1 - a0 > 180 ? 1 : 0;
    return `M ${p0.x} ${p0.y} A ${radius} ${radius} 0 ${largeArc} 1 ${p1.x} ${p1.y}`;
  };

  const needle = polar(angle);
  const scorePct = Math.round(clamped * 100);

  const tone =
    clamped >= 0.6 ? "#1E8A5F" : clamped >= 0.4 ? "#B4791F" : "#C1443F";

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1.5 text-[11.5px] font-medium uppercase tracking-wide text-ink-500">
        {label}
        {info && <InfoTooltip>{info}</InfoTooltip>}
      </div>
      <svg width={size} height={size * 0.72} viewBox={`0 0 ${size} ${size * 0.72}`} className="mt-1">
        <path
          d={arcPath(startAngle, endAngle)}
          fill="none"
          stroke="#EEF1F5"
          strokeWidth={10}
          strokeLinecap="round"
        />
        <path
          d={arcPath(startAngle, angle)}
          fill="none"
          stroke={tone}
          strokeWidth={10}
          strokeLinecap="round"
        />
        <line
          x1={cx}
          y1={cy}
          x2={needle.x}
          y2={needle.y}
          stroke="#131A24"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={4} fill="#131A24" />
        <text
          x={cx}
          y={cy - 18}
          textAnchor="middle"
          className="font-mono"
          fontSize={30}
          fontWeight={700}
          fill="#131A24"
        >
          {scorePct}
        </text>
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          fontSize={10}
          fill="#8593A3"
          fontWeight={600}
        >
          / 100
        </text>
      </svg>
    </div>
  );
}
