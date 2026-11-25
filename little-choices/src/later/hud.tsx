import React from 'react';
import {HAND} from '../fonts';
import {Month, NOTE_YELLOW} from './props';
import {useFrameWindow} from '../ui/frameCtx';

/** Centre of a day's square on a WallCalendar drawn at (0,0) with width w (same maths as WallCalendar). */
export const calCell = (month: Month, w: number, day: number) => {
  const h = w * 1.12;
  const head = h * 0.15;
  const wk = h * 0.075;
  const cw = w / 7;
  const ch = (h - head - wk) / 6;
  const idx = month.firstDow + day - 1;
  return {cx: (idx % 7) * cw + cw / 2, cy: head + wk + Math.floor(idx / 7) * ch + ch / 2, cw, ch};
};

/** Date chip in the top-left corner (frame px). */
export const DateChip: React.FC<{text: string; opacity?: number; right?: boolean}> = ({text, opacity = 1, right = false}) => {
  const win = useFrameWindow();
  // vertical cut: always top-left of the visible window
  const left = win ? win.x0 + 24 / win.s : right ? undefined : 70;
  return (
  <div style={{position: 'absolute', left, right: !win && right ? 70 : undefined, top: win ? 40 : 64, opacity, display: 'flex', alignItems: 'center', gap: 16, padding: '10px 26px 12px', borderRadius: 999, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(20px)'}}>
    <svg width={34} height={34} viewBox="0 0 34 34">
      <rect x={3} y={6} width={28} height={25} rx={4} fill="none" stroke="#cfd6e2" strokeWidth={3} />
      <rect x={3} y={6} width={28} height={8} fill="#c9433a" />
      <line x1={10} y1={2} x2={10} y2={9} stroke="#cfd6e2" strokeWidth={3} strokeLinecap="round" />
      <line x1={24} y1={2} x2={24} y2={9} stroke="#cfd6e2" strokeWidth={3} strokeLinecap="round" />
    </svg>
    <span style={{fontFamily: HAND, fontSize: 42, color: '#ffffff', letterSpacing: 2, whiteSpace: 'nowrap'}}>{text}</span>
  </div>
  );
};

/** Chat bubble drawn in world px (used for texts on a phone that is too small to read). */
export const ChatBubble: React.FC<{x: number; y: number; text: string; mine?: boolean; opacity?: number; size?: number}> = ({x, y, text, mine = false, opacity = 1, size = 40}) => {
  const w = text.length * size * 0.5 + 56;
  const h = size * 1.7;
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <rect x={-w / 2 + 4} y={-h + 6} width={w} height={h} rx={h / 2} fill="#000" opacity={0.3} />
      <rect x={-w / 2} y={-h} width={w} height={h} rx={h / 2} fill={mine ? '#3c8dd6' : '#2b3642'} />
      <path d={mine ? `M${w / 2 - 28},-6 L${w / 2 - 6},10 L${w / 2 - 46},-6 Z` : `M${-w / 2 + 28},-6 L${-w / 2 + 6},10 L${-w / 2 + 46},-6 Z`} fill={mine ? '#3c8dd6' : '#2b3642'} />
      <text x={0} y={-h * 0.34} textAnchor="middle" fontFamily={HAND} fontSize={size} fill="#fff">{text}</text>
    </g>
  );
};

/** Paper train ticket (world px). */
export const Ticket: React.FC<{x: number; y: number; rotate?: number; opacity?: number}> = ({x, y, rotate = -4, opacity = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity={opacity}>
    <rect x={-310} y={-150} width={620} height={300} rx={18} fill="#000" opacity={0.3} transform="translate(10 12)" />
    <rect x={-310} y={-150} width={620} height={300} rx={18} fill="#f3ede0" />
    <rect x={-310} y={-150} width={620} height={70} rx={18} fill="#c9433a" />
    <rect x={-310} y={-100} width={620} height={20} fill="#c9433a" />
    <text x={-280} y={-102} fontFamily={HAND} fontSize={40} fill="#fff" letterSpacing={3}>TRAIN TICKET</text>
    <text x={-280} y={-20} fontFamily={HAND} fontSize={54} fill="#2b2b2b">City → Home</text>
    <text x={-280} y={50} fontFamily={HAND} fontSize={44} fill="#2b2b2b">Sat, Jan 9</text>
    <text x={-280} y={110} fontFamily={HAND} fontSize={34} fill="#6b6457">Seat 14A · Window</text>
    <line x1={170} y1={-80} x2={170} y2={150} stroke="#c9b99a" strokeWidth={4} strokeDasharray="10 10" />
    <path d="M210,20 l40,-30 l40,30 l-40,30 z" fill="#c9433a" opacity={0.85} />
  </g>
);

/**
 * Big sticky note close-up with handwriting that appears as it is written.
 * lines: text per line; prog: 0..1 written amount per line. Returns the note; use penAt() for the hand position.
 */
export const NOTE_CLOSE = {x: 960, y: 520, size: 640};
const lineY = (i: number, n: number, fs: number) => NOTE_CLOSE.y - NOTE_CLOSE.size * 0.08 - ((n - 1) * fs * 1.3) / 2 + i * fs * 1.3;
const lineW = (text: string, fs: number) => text.length * fs * 0.62 + fs * 0.4;

export const penAt = (lines: string[], prog: number[], fontSize: number) => {
  let i = prog.findIndex((p) => p > 0 && p < 1);
  if (i < 0) i = prog.reduce((a, p, k) => (p >= 1 ? k : a), 0);
  const w = lineW(lines[i], fontSize);
  return {x: NOTE_CLOSE.x - w / 2 + w * Math.min(1, prog[i]), y: lineY(i, lines.length, fontSize)};
};

export const NoteClose: React.FC<{lines: string[]; prog: number[]; fontSize?: number; circle?: number; big?: {text: string; prog: number}}> = ({lines, prog, fontSize = 92, circle = 0, big}) => {
  const {x, y, size} = NOTE_CLOSE;
  return (
    <g>
      <rect x={x - size / 2 + 18} y={y - size / 2 + 24} width={size} height={size} fill="#000" opacity={0.3} />
      <rect x={x - size / 2} y={y - size / 2} width={size} height={size} fill={NOTE_YELLOW} />
      <rect x={x - size / 2} y={y - size / 2} width={size} height={size * 0.14} fill="#e8c94a" opacity={0.55} />
      <path d={`M${x + size / 2},${y + size / 2 - size * 0.12} L${x + size / 2},${y + size / 2} L${x + size / 2 - size * 0.12},${y + size / 2} Z`} fill="#d9b93c" />
      {lines.map((t, i) => {
        const w = lineW(t, fontSize);
        const ly = lineY(i, lines.length, fontSize);
        return (
          <g key={i}>
            <defs>
              <clipPath id={`nc${i}`}>
                <rect x={x - w / 2 - 10} y={ly - fontSize} width={(w + 20) * Math.max(0, Math.min(1, prog[i] ?? 0))} height={fontSize * 1.4} />
              </clipPath>
            </defs>
            <text x={x} y={ly + fontSize * 0.3} textAnchor="middle" fontFamily={HAND} fontSize={fontSize} fill="#26221a" clipPath={`url(#nc${i})`}>{t}</text>
          </g>
        );
      })}
      {big && (
        <g>
          <defs>
            <clipPath id="ncBig">
              <rect x={x + size * 0.12} y={y + size * 0.02} width={size * 0.3 * big.prog} height={size * 0.4} />
            </clipPath>
          </defs>
          <text x={x + size * 0.27} y={y + size * 0.36} textAnchor="middle" fontFamily={HAND} fontSize={fontSize * 1.6} fill="#c9433a" clipPath="url(#ncBig)">{big.text}</text>
          {circle > 0 && (
            <ellipse cx={x + size * 0.27} cy={y + size * 0.25} rx={size * 0.14} ry={size * 0.13} fill="none" stroke="#c9433a" strokeWidth={9}
              strokeDasharray={2 * Math.PI * size * 0.135} strokeDashoffset={2 * Math.PI * size * 0.135 * (1 - circle)} transform={`rotate(-80 ${x + size * 0.27} ${y + size * 0.25})`} />
          )}
        </g>
      )}
    </g>
  );
};

/** Marker in a hand, tip at (x, y) world px. */
export const MarkerHand: React.FC<{x: number; y: number; Hand: React.FC<{x: number; y: number; s?: number; rotate?: number; curl?: number}>}> = ({x, y, Hand}) => (
  <g>
    <g transform={`translate(${x} ${y}) rotate(28)`}>
      <rect x={-14} y={0} width={28} height={150} rx={10} fill="#e8e8e8" />
      <rect x={-14} y={0} width={28} height={36} rx={8} fill="#2b2b2b" />
      <path d="M-8,0 L0,-20 L8,0 Z" fill="#2b2b2b" />
    </g>
    <Hand x={x + 70} y={y + 250} s={1.2} rotate={24} curl={0.8} />
  </g>
);
