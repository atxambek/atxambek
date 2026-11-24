import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {useF} from '../time';
import {useFrameWindow} from './frameCtx';
import {HAND} from '../fonts';
import {COLD, EXCUSE, H, W} from '../theme';

/** Full-frame SVG layer in world coordinates with optional depth-of-field blur. */
export const Layer: React.FC<{blur?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({blur = 0, children, style}) => (
  <AbsoluteFill style={{filter: blur ? `blur(${blur}px)` : undefined, ...style}}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
      {children}
    </svg>
  </AbsoluteFill>
);

/**
 * Virtual camera. zoom 1 = full frame; push-ins interpolate zoom over the shot.
 * (ox, oy) is the world point the camera zooms towards.
 */
export const Camera: React.FC<{zoom: number; ox?: number; oy?: number; dx?: number; dy?: number; children: React.ReactNode}> = ({
  zoom, ox = W / 2, oy = H / 2, dx = 0, dy = 0, children,
}) => (
  <AbsoluteFill style={{transformOrigin: `${ox}px ${oy}px`, transform: `translate(${dx}px, ${dy}px) scale(${zoom})`}}>{children}</AbsoluteFill>
);

/** Slow push-in helper: returns zoom for the current frame. */
export const usePush = (dur: number, from = 1, to = 1.05) => {
  const f = useF();
  return interpolate(f, [0, dur], [from, to], {extrapolateRight: 'clamp'});
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.35}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,${strength}) 85%, rgba(0,0,0,${Math.min(1, strength * 1.6)}) 100%)`,
    }}
  />
);

export type SubKind = 'spoken' | 'excuse' | 'thought';

/**
 * Dialogue subtitle. (x, y) = bottom-centre anchor in frame px (usually just above the speaker's head).
 * Fades in over 6 frames, out over 8. `from`/`to` are frames relative to the enclosing Sequence.
 */
export const Subtitle: React.FC<{text: string; kind?: SubKind; x: number; y: number; from?: number; to?: number; size?: number}> = ({
  text, kind = 'spoken', x: x0, y: y0, from = 0, to = 99999, size = 46,
}) => {
  let x = x0;
  let y = y0;
  const f = useF();
  const win = useFrameWindow();
  if (f < from || f > to) return null;
  if (win) {
    // vertical cut: keep the line inside the visible window and out of the right-hand safe zone
    const w = text.length * size * 0.5 + 70;
    const lo = win.x0 + 30 / win.s + w / 2;
    const hi = win.x1 - win.safeRight - w / 2;
    x = lo > hi ? (win.x0 + win.x1 - win.safeRight) / 2 : Math.min(hi, Math.max(lo, x));
    if (win.subY !== undefined) y = win.subY;
  }
  const op = Math.min(interpolate(f, [from, from + 6], [0, 1], {extrapolateRight: 'clamp'}), interpolate(f, [to - 8, to], [1, 0], {extrapolateLeft: 'clamp'}));
  const thought = kind === 'thought';
  const color = kind === 'excuse' ? EXCUSE : thought ? '#d4d9e2' : '#ffffff';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -100%) translateY(${(1 - op) * 6}px)`,
        opacity: op,
        fontFamily: HAND,
        fontSize: thought ? size - 6 : size,
        fontStyle: thought ? 'italic' : 'normal',
        color,
        whiteSpace: 'pre',
        textAlign: 'center',
        lineHeight: 1.15,
        padding: thought ? '4px 10px' : '10px 30px 12px',
        borderRadius: 999,
        background: thought ? 'none' : 'rgba(0,0,0,0.45)',
        backdropFilter: thought ? undefined : 'blur(24px)',
        boxShadow: thought ? undefined : '0 0 24px 8px rgba(0,0,0,0.25)',
        textShadow: thought ? '0 0 10px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.9)' : undefined,
        letterSpacing: 0.5,
      }}
    >
      {thought ? `( ${text} )` : text}
    </div>
  );
};

const fmt = (m: number) => `${Math.floor(m / 60)}h ${String(Math.round(m % 60)).padStart(2, '0')}m`;

/** SCREEN TIME widget: vertical pill, fill rises with minutes (full = 5h). */
export const ScreenTimeMeter: React.FC<{x: number; y: number; minutes: number; opacity?: number; dim?: number; scale?: number; compact?: boolean}> = ({
  x, y, minutes, opacity = 1, dim = 0, scale = 1, compact = false,
}) => {
  // NB: keep scale >= 1 so the label never drops under 32 px; use `compact` for a shorter pill.
  const win = useFrameWindow();
  if (win) {
    // vertical cut: small meter in the top-right of the visible window; label stays >= 32 px on output
    scale = Math.max(0.6, 1 / win.s);
    compact = true;
    x = win.x1 - win.safeRight - 130 * scale;
    y = 40;
  }
  const pillW = 62;
  const pillH = compact ? 160 : 240;
  const fill = Math.min(1, minutes / 300);
  const hot = interpolate(minutes, [90, 250], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * (1 - dim);
  const fillColor = dim > 0.5 ? '#7b8494' : COLD.screen;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 260, transform: `translate(-50%, 0) scale(${scale})`, transformOrigin: 'top center', opacity, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, filter: `saturate(${1 - dim * 0.8})`}}>
      <div style={{fontFamily: HAND, fontSize: 32, color: '#cfd6e2', letterSpacing: 3, whiteSpace: 'nowrap', textShadow: '0 0 8px rgba(0,0,0,0.9)'}}>SCREEN TIME</div>
      <svg width={pillW + 40} height={pillH + 40} viewBox={`-20 -20 ${pillW + 40} ${pillH + 40}`} style={{overflow: 'visible'}}>
        <defs>
          <filter id="meterGlow" x="-80%" y="-30%" width="260%" height="160%">
            <feGaussianBlur stdDeviation={10} />
          </filter>
          <clipPath id="meterClip">
            <rect x={6} y={6} width={pillW - 12} height={pillH - 12} rx={(pillW - 12) / 2} />
          </clipPath>
        </defs>
        <rect x={0} y={0} width={pillW} height={pillH} rx={pillW / 2} fill={COLD.screen} opacity={0.55 * hot} filter="url(#meterGlow)" />
        <rect x={0} y={0} width={pillW} height={pillH} rx={pillW / 2} fill="rgba(10,12,16,0.78)" stroke="#5a6372" strokeWidth={3} />
        <g clipPath="url(#meterClip)">
          <rect x={6} y={6 + (pillH - 12) * (1 - fill)} width={pillW - 12} height={(pillH - 12) * fill} fill={fillColor} opacity={0.6 + 0.4 * hot} />
        </g>
      </svg>
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <svg width={24} height={38} viewBox="0 0 24 38">
          <rect x={2} y={2} width={20} height={34} rx={4} fill="none" stroke="#cfd6e2" strokeWidth={3} />
          <line x1={9} y1={31} x2={15} y2={31} stroke="#cfd6e2" strokeWidth={3} strokeLinecap="round" />
        </svg>
        <div style={{whiteSpace: 'nowrap', fontFamily: HAND, fontSize: 44, color: hot > 0.5 ? '#bdefff' : '#ffffff', textShadow: `0 0 ${6 + 14 * hot}px rgba(95,211,255,${0.3 + 0.6 * hot}), 0 0 4px rgba(0,0,0,0.9)`}}>{fmt(minutes)}</div>
      </div>
    </div>
  );
};

/** A soft coloured light pool (screen glow, lamp light). World px. */
export const LightPool: React.FC<{x: number; y: number; rx: number; ry: number; color: string; opacity: number; id: string}> = ({x, y, rx, ry, color, opacity, id}) => (
  <g style={{mixBlendMode: 'screen'}}>
    <defs>
      <radialGradient id={id}>
        <stop offset="0%" stopColor={color} stopOpacity={opacity} />
        <stop offset="45%" stopColor={color} stopOpacity={opacity * 0.4} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </radialGradient>
    </defs>
    <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={`url(#${id})`} />
  </g>
);
