import React from 'react';
import {BOOK_BLUE, COLD, INK} from '../theme';

/** Phone held in hand: local coords centred on the phone. Sizes in figure units. */
export const HandPhone: React.FC<{glow?: number; angle?: number}> = ({glow = 1, angle = -30}) => (
  <g transform={`rotate(${angle})`}>
    <rect x={-3.2} y={-5.6} width={6.4} height={11.2} rx={1.3} fill="#11151b" />
    <rect x={-2.6} y={-4.9} width={5.2} height={9.6} rx={0.8} fill={COLD.screen} opacity={0.35 + 0.65 * glow} />
  </g>
);

/** The Moon Rabbit: light-blue cover, white rabbit, crescent moon. Drawn around (0,0), w x h. */
export const BookCover: React.FC<{w: number; h: number; title?: boolean; dust?: number}> = ({w, h, title = false, dust = 0}) => {
  const s = h / 100;
  return (
    <g>
      <rect x={-w / 2 - 2 * s} y={-h / 2} width={w + 2 * s} height={h} rx={3 * s} fill="#6aa6c8" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={3 * s} fill={BOOK_BLUE} />
      <rect x={-w / 2} y={-h / 2} width={5 * s} height={h} fill="#7fbadc" />
      {/* crescent moon */}
      <g transform={`translate(${w * 0.2} ${-h * 0.28})`}>
        <circle r={13 * s} fill="#ffffff" />
        <circle cx={6 * s} cy={-4 * s} r={11 * s} fill={BOOK_BLUE} />
      </g>
      {/* rabbit sitting, white */}
      <g transform={`translate(${-w * 0.08} ${h * 0.14}) scale(${s})`} fill="#ffffff">
        <ellipse cx={0} cy={8} rx={13} ry={11} />
        <circle cx={9} cy={-6} r={7.5} />
        <ellipse cx={6} cy={-19} rx={2.6} ry={9} transform="rotate(-12 6 -19)" />
        <ellipse cx={12} cy={-19} rx={2.6} ry={9} transform="rotate(10 12 -19)" />
        <circle cx={-12} cy={12} r={3.5} />
      </g>
      {title && (
        <text x={0} y={h * 0.43} textAnchor="middle" fontFamily="Georgia, serif" fontSize={9 * s} fill="#ffffff" letterSpacing={0.5 * s}>
          The Moon Rabbit
        </text>
      )}
      {dust > 0 && <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={3 * s} fill="#b8b3a6" opacity={dust * 0.35} />}
    </g>
  );
};

/** Book held in a hand (figure units). */
export const HandBook: React.FC<{angle?: number; size?: number}> = ({angle = 0, size = 1}) => (
  <g transform={`rotate(${angle}) scale(${size})`}>
    <BookCover w={15} h={20} />
  </g>
);

/** Open book seen from the side/above, for reading and lying shots (figure units). */
export const OpenBook: React.FC<{angle?: number; size?: number}> = ({angle = 0, size = 1}) => (
  <g transform={`rotate(${angle}) scale(${size})`}>
    <path d="M-15,-2 L0,2 L15,-2 L15,1.5 L0,5 L-15,1.5 Z" fill={BOOK_BLUE} />
    <path d="M-14,-3 Q-7,-5 0,1 Q7,-5 14,-3 L14,-1 Q7,-3 0,3 Q-7,-3 -14,-1 Z" fill="#f5f1e6" />
  </g>
);

export const Mug: React.FC<{color?: string}> = ({color = INK}) => (
  <g>
    <rect x={-3.5} y={-5} width={7} height={8} rx={1.4} fill={color} />
    <path d="M3.4,-3 q3.2,0.5 0,4.4" stroke={color} strokeWidth={1.4} fill="none" />
  </g>
);

/** Wall clock in world px. minutes = minutes since 00:00 */
export const WallClock: React.FC<{x: number; y: number; r: number; minutes: number; face: string; rim: string; hand: string}> = ({x, y, r, minutes, face, rim, hand}) => {
  const ma = (minutes % 60) * 6;
  const ha = ((minutes / 60) % 12) * 30;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 7} fill={rim} />
      <circle r={r} fill={face} />
      {Array.from({length: 12}).map((_, i) => (
        <line key={i} x1={0} y1={-r * 0.82} x2={0} y2={-r * 0.92} stroke={hand} strokeWidth={3} transform={`rotate(${i * 30})`} strokeLinecap="round" />
      ))}
      <line x1={0} y1={0} x2={0} y2={-r * 0.5} stroke={hand} strokeWidth={6} strokeLinecap="round" transform={`rotate(${ha})`} />
      <line x1={0} y1={0} x2={0} y2={-r * 0.78} stroke={hand} strokeWidth={4} strokeLinecap="round" transform={`rotate(${ma})`} />
      <circle r={5} fill={hand} />
    </g>
  );
};
