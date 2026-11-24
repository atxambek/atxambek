import React from 'react';

export type Season = 'winter' | 'lateWinter' | 'spring';

/** Night or morning window with tree branches. World px. */
export const WindowView: React.FC<{
  x: number; y: number; w: number; h: number; frame: string; sky: [string, string]; branch: string;
  season?: Season; blossom?: string; moon?: boolean; id: string;
}> = ({x, y, w, h, frame, sky, branch, season = 'winter', blossom = '#f2d6df', moon = true, id}) => {
  const b = (d: string, sw: number) => <path d={d} stroke={branch} strokeWidth={sw} fill="none" strokeLinecap="round" />;
  const buds = season === 'spring' ? 46 : season === 'lateWinter' ? 14 : 0;
  // deterministic pseudo-random positions along branches
  const pts: [number, number][] = [];
  for (let i = 0; i < buds; i++) {
    const t = (i * 0.6180339) % 1;
    const u = (i * 0.7548776) % 1;
    pts.push([w * (0.35 + 0.65 * t), h * (0.05 + 0.6 * u * (1 - t * 0.4))]);
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
        <clipPath id={`clip${id}`}>
          <rect width={w} height={h} />
        </clipPath>
      </defs>
      <rect x={-16} y={-16} width={w + 32} height={h + 32} rx={6} fill={frame} />
      <rect width={w} height={h} fill={`url(#sky${id})`} />
      <g clipPath={`url(#clip${id})`}>
        {moon && <circle cx={w * 0.22} cy={h * 0.2} r={h * 0.06} fill="#e9eef5" opacity={0.85} />}
        {b(`M${w * 1.05},${h * 0.95} C${w * 0.8},${h * 0.7} ${w * 0.75},${h * 0.45} ${w * 0.55},${h * 0.25}`, 14)}
        {b(`M${w * 0.78},${h * 0.62} C${w * 0.62},${h * 0.58} ${w * 0.5},${h * 0.62} ${w * 0.36},${h * 0.55}`, 8)}
        {b(`M${w * 0.68},${h * 0.4} C${w * 0.7},${h * 0.25} ${w * 0.82},${h * 0.12} ${w * 0.9},${h * 0.02}`, 7)}
        {b(`M${w * 0.55},${h * 0.25} C${w * 0.48},${h * 0.18} ${w * 0.42},${h * 0.14} ${w * 0.38},${h * 0.06}`, 5)}
        {b(`M${w * 0.5},${h * 0.6} C${w * 0.45},${h * 0.7} ${w * 0.4},${h * 0.72} ${w * 0.33},${h * 0.8}`, 4)}
        {pts.map(([px, py], i) => (
          <circle key={i} cx={px} cy={py} r={season === 'spring' ? 9 + (i % 3) * 3 : 4} fill={season === 'spring' ? blossom : '#7f9a6e'} opacity={0.9} />
        ))}
      </g>
      <rect x={w / 2 - 6} y={0} width={12} height={h} fill={frame} />
      <rect x={0} y={h * 0.45 - 6} width={w} height={12} fill={frame} />
      <rect x={-30} y={h + 10} width={w + 60} height={18} rx={4} fill={frame} />
    </g>
  );
};
