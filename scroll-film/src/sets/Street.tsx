import React from 'react';
import {COLD, INK, WARM} from '../theme';
import {StickFigure, POSES} from '../characters/StickFigure';
import {OpenBook} from '../props/Props';

/** Night street: row of houses. Our window glows amber, neighbours flicker cyan. World px. */
export const Street: React.FC<{frame: number}> = ({frame}) => {
  const houses = [
    {x: -40, w: 400, h: 520, roof: 160},
    {x: 380, w: 380, h: 470, roof: 150},
    {x: 780, w: 440, h: 560, roof: 180}, // ours
    {x: 1240, w: 380, h: 480, roof: 150},
    {x: 1640, w: 360, h: 520, roof: 160},
  ];
  const ground = 900;
  const flick = (i: number) => 0.55 + 0.45 * Math.abs(Math.sin(frame * (0.21 + i * 0.07) + i * 1.7) * Math.sin(frame * 0.05 + i));
  let wi = 0;
  return (
    <g>
      <defs>
        <linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1019" />
          <stop offset="1" stopColor="#1d2638" />
        </linearGradient>
        <filter id="winGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={18} />
        </filter>
      </defs>
      <rect width={1920} height={1080} fill="url(#nsky)" />
      {Array.from({length: 40}).map((_, i) => (
        <circle key={i} cx={(i * 487) % 1920} cy={(i * 173) % 380} r={i % 4 === 0 ? 2.4 : 1.4} fill="#dfe8f5" opacity={0.35 + 0.4 * Math.abs(Math.sin(frame * 0.03 + i))} />
      ))}
      <circle cx={1580} cy={150} r={46} fill="#eef2f7" opacity={0.9} />
      <circle cx={1580} cy={150} r={90} fill="#eef2f7" opacity={0.06} />
      {houses.map((h, i) => {
        const top = ground - h.h;
        const ours = i === 2;
        const wins: [number, number][] = [
          [h.x + h.w * 0.22, top + h.roof + 60],
          [h.x + h.w * 0.58, top + h.roof + 60],
          [h.x + h.w * 0.08, top + h.roof + 200],
          [h.x + h.w * 0.7, top + h.roof + 200],
        ];
        return (
          <g key={i}>
            <path d={`M${h.x - 10},${top + h.roof} L${h.x + h.w / 2},${top} L${h.x + h.w + 10},${top + h.roof} Z`} fill="#0c1016" />
            <rect x={h.x} y={top + h.roof} width={h.w} height={h.h - h.roof} fill={ours ? '#151a22' : '#11151c'} />
            <rect x={h.x + h.w * 0.7} y={top + 30} width={36} height={80} fill="#0c1016" />
            {wins.map(([wx, wy], k) => {
              const ww = h.w * 0.22;
              const wh = 110;
              const ourLit = ours && k === 1; // Mia's room
              const n = wi++;
              const lit = ourLit || (!ours && (n % 3 !== 1));
              if (!lit) return <rect key={k} x={wx} y={wy} width={ww} height={wh} fill="#0a0d12" stroke="#1a2029" strokeWidth={6} />;
              const color = ourLit ? WARM.lamp : COLD.screen;
              const op = ourLit ? 1 : flick(n) * 0.7;
              return (
                <g key={k}>
                  <rect x={wx - 10} y={wy - 10} width={ww + 20} height={wh + 20} fill={color} opacity={op * 0.55} filter="url(#winGlow)" />
                  <rect x={wx} y={wy} width={ww} height={wh} fill={ourLit ? '#ffcf8a' : '#1b3d52'} />
                  {!ourLit && <rect x={wx} y={wy} width={ww} height={wh} fill={COLD.screen} opacity={op * 0.55} />}
                  {ourLit && (
                    <g>
                      <rect x={wx} y={wy} width={ww} height={wh} fill="#ffb35c" opacity={0.5} />
                      {/* tiny Dad + Mia reading */}
                      <StickFigure x={wx + ww * 0.36} y={wy + wh - 18} scale={0.72} pose={POSES.sitRead} eyes="open" glow="none" itemF={<OpenBook angle={-25} size={1.2} />} />
                      <StickFigure x={wx + ww * 0.55} y={wy + wh - 16} scale={0.72} kid pose={POSES.cuddle} eyes="happy" glow="none" />
                    </g>
                  )}
                  {!ourLit && (
                    <g fill={INK} opacity={0.85}>
                      <circle cx={wx + ww * (0.3 + (n % 2) * 0.4)} cy={wy + wh - 52} r={14} />
                      <rect x={wx + ww * (0.3 + (n % 2) * 0.4) - 15} y={wy + wh - 40} width={30} height={40} rx={10} />
                    </g>
                  )}
                  <rect x={wx} y={wy} width={ww} height={wh} fill="none" stroke="#1a2029" strokeWidth={6} />
                  <line x1={wx + ww / 2} y1={wy} x2={wx + ww / 2} y2={wy + wh} stroke="#1a2029" strokeWidth={5} />
                </g>
              );
            })}
            <rect x={h.x + h.w * 0.42} y={ground - 130} width={h.w * 0.16} height={130} fill="#0a0d12" />
          </g>
        );
      })}
      <rect y={ground} width={1920} height={180} fill="#0a0d12" />
      <rect y={ground} width={1920} height={8} fill="#1a2029" />
    </g>
  );
};

/** Foreground blossoming branch (spring). */
export const BlossomBranch: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-60,0 C80,-40 200,-60 380,-150 M150,-60 C210,-120 260,-160 300,-240 M260,-110 C330,-90 380,-70 450,-60" stroke="#0a0c10" strokeWidth={18} fill="none" strokeLinecap="round" />
    {Array.from({length: 28}).map((_, i) => {
      const t = (i * 0.6180339) % 1;
      const u = (i * 0.7548776) % 1;
      return <circle key={i} cx={20 + t * 420} cy={-40 - u * 200 + t * 40} r={12 + (i % 3) * 5} fill={i % 4 === 0 ? '#ffffff' : '#f2c9d8'} opacity={0.85} />;
    })}
  </g>
);
