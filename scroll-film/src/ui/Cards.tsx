import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {SERIF} from '../fonts';
import {useF} from '../time';

const fade = (f: number, start: number, len = 18) => interpolate(f, [start, start + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** Full black narration card. Lines fade in one by one. dur in base frames. */
export const NarrationCard: React.FC<{lines: string[]; dur: number; gap?: number}> = ({lines, dur, gap = 45}) => {
  const f = useF();
  const out = interpolate(f, [dur - 24, dur - 4], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 18, opacity: out}}>
      {lines.map((l, i) => (
        <div key={i} style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 68, color: '#ece6da', opacity: fade(f, 12 + i * gap, 24), letterSpacing: 0.5, textAlign: 'center', maxWidth: 1400}}>
          {l}
        </div>
      ))}
    </AbsoluteFill>
  );
};

/** Quote card: quote in regular serif, author in small caps preceded by an em dash. */
export const QuoteCard: React.FC<{quote: string[]; author: string; dur: number}> = ({quote, author, dur}) => {
  const f = useF();
  const out = interpolate(f, [dur - 24, dur - 4], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', opacity: out}}>
      {quote.map((l, i) => (
        <div key={i} style={{fontFamily: SERIF, fontSize: 64, lineHeight: 1.3, color: '#f1ece2', opacity: fade(f, 10 + i * 30, 24), textAlign: 'center'}}>
          {l}
        </div>
      ))}
      <div style={{marginTop: 40, fontFamily: SERIF, fontVariant: 'small-caps', fontSize: 44, letterSpacing: 4, color: '#c9b38f', opacity: fade(f, 10 + quote.length * 30 + 20, 24)}}>
        — {author}
      </div>
    </AbsoluteFill>
  );
};

export const TitleCard: React.FC<{dur: number}> = ({dur}) => {
  const f = useF();
  const out = interpolate(f, [dur - 40, dur - 2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const track = interpolate(f, [0, dur], [34, 42]);
  return (
    <AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', opacity: out}}>
      <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 150, letterSpacing: track, color: '#f3ead8', opacity: fade(f, 6, 30), paddingLeft: track}}>SCROLL</div>
      <div style={{marginTop: 26, fontFamily: SERIF, fontStyle: 'italic', fontSize: 50, color: '#ffb35c', opacity: fade(f, 50, 30)}}>Look up. They're growing.</div>
    </AbsoluteFill>
  );
};

export const BlackCard: React.FC = () => <AbsoluteFill style={{background: '#000'}} />;

/** Hard white flash for `len` base frames starting at `at`. Callers keep >= 30 frames between flashes. */
export const WhiteFlash: React.FC<{at: number; len?: number}> = ({at, len = 3}) => {
  const f = useF();
  if (f < at || f >= at + len) return null;
  return <AbsoluteFill style={{background: '#fff', opacity: 0.92}} />;
};
