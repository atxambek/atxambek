import React from 'react';
import {AbsoluteFill, interpolate, Series, useCurrentFrame, useVideoConfig} from 'remotion';
import {Shot, shotFrames, TIMELINE} from './timeline';
import {BASE_FPS, toFrames} from './time';
import {FrameCtx, PortraitCardCtx} from './ui/frameCtx';

/**
 * 1080x1920 cut. Each 16:9 shot is re-framed: a scale `s` (1.778 = fills the height) and a
 * horizontal focus `cx` (in 1920x1080 frame px), keyframed over the shot so the camera follows
 * whoever is speaking or acting. Cards (narration, quotes, title) are laid out natively.
 */
const VW = 1080;
const VH = 1920;
const FULL = VH / 1080; // 1.778
const SAFE_RIGHT = 0.15 * VW; // px on the output
const SAFE_BOTTOM = 0.2 * VH;

type Key = [t: number, cx: number, s?: number];
// book inserts: keep the bookmark and the page number (bottom-right) in view, clear of the right safe zone
const BOOK: Key[] = [[0, 1400, 1.3], [6, 1450, 1.3]];

/** Keyframes per shot id: [seconds into the shot, focus x, scale]. */
const FRAMING: Record<string, Key[]> = {
  S1: [[0, 1330], [3.9, 1330], [4.6, 880]],
  S2: [[0, 960]],
  S3: [[0, 980]],
  S4: [[0, 1300], [1.1, 1300], [1.8, 860], [4.5, 860], [5.1, 1240], [7.6, 1240], [9.0, 700], [9.7, 700], [10.4, 1330]],
  S5: BOOK,
  'A2-Mon-lock': [[0, 960]],
  'A2-Mon': [[0, 1330], [2.6, 1330], [3.4, 860]],
  'A2-Tue-lock': [[0, 960]],
  'A2-Tue': [[0, 1330], [3.9, 1330], [4.5, 880]],
  'A2-Tue-bookmark': BOOK,
  'A2-Thu-lock': [[0, 960]],
  'A2-Thu': [[0, 1330], [5.4, 1330], [5.9, 880], [8.3, 880], [8.9, 1330]],
  'A2-Fri-lock': [[0, 960]],
  'A2-Fri': [[0, 1250], [2.5, 1000], [3.5, 860]],
  'A2-dust': BOOK,
  S6: [[0, 450, 1.3], [5, 950, 1.3], [6.5, 1200, 1.3]],
  S7: [[0, 960]],
  S8: [[0, 1080]],
  S9: [[0, 960], [1.19, 960], [1.2, 1300], [2.39, 1300], [2.4, 480]],
  S10: [[0, 980, 1.25]],
  S11: [[0, 1000, 1.3], [5.3, 1000, 1.3], [5.4, 760, 1.6]],
  S12: [[0, 960]],
  S13: [[0, 960]],
  S14: [[0, 560, 1.5], [3, 1250, 1.5], [6.5, 1320, 1.5]],
  S15: [[0, 800]],
  'S15-bookmark': BOOK,
  S16: [[0, 940, 1.3]],
  S17: [
    [0, 800], [2.19, 800], [2.2, 1420, 1.3], [3.99, 1420, 1.3],
    [4.0, 800, FULL], [6.19, 800], [6.2, 1420, 1.3], [7.99, 1420, 1.3],
    [8.0, 800, FULL], [10.19, 800], [10.2, 1420, 1.3],
  ],
  S18: [[0, 640], [1.6, 640], [2.4, 1360]],
  S19: [[0, 1250, 1.5], [3.7, 950, 1.5], [6.5, 950, 1.5], [8, 760, 1.5]],
  'S20-end': [[0, 1360, 1.1], [4, 1380, 1.1]],
  'S20-again': [[0, 800]],
  S21: [[0, 1076]],
};
/** Per-shot subtitle height (frame px, bottom anchor) where the landscape position would sit on the action. */
const SUB_Y: Record<string, number> = {S10: 1050};
const CARDS = new Set(['C0', 'black-1', 'Q1', 'Q2', 'C-END', 'TITLE']);

const ease = (t: number) => t * t * (3 - 2 * t);
const sample = (keys: Key[], t: number): {cx: number; s: number} => {
  // fill in scale: carry forward, default FULL
  let last = FULL;
  const ks = keys.map(([kt, cx, s]) => {
    last = s ?? (kt === keys[0][0] ? FULL : last);
    return {t: kt, cx, s: last};
  });
  if (t <= ks[0].t) return ks[0];
  for (let i = 0; i < ks.length - 1; i++) {
    const a = ks[i];
    const b = ks[i + 1];
    if (t <= b.t) {
      const u = ease((t - a.t) / Math.max(1e-6, b.t - a.t));
      return {cx: a.cx + (b.cx - a.cx) * u, s: a.s + (b.s - a.s) * u};
    }
  }
  return ks[ks.length - 1];
};

type Cut = {framing: Record<string, Key[]>; subY: Record<string, number>; cards: Set<string>};

const Reframe: React.FC<{shot: Shot; cut: Cut}> = ({shot, cut}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const {cx: rawCx, s} = sample(cut.framing[shot.id] ?? [[0, 960]], t);
  const half = VW / 2 / s;
  const cx = Math.min(1920 - half, Math.max(half, rawCx)); // never show past the frame edge
  const contentH = 1080 * s;
  // content sits a little above centre so the bottom UI zone stays clear
  const top = (VH - contentH) / 2 - Math.max(0, (VH - contentH) * 0.25);
  const win = {x0: cx - half, x1: cx + half, s, safeRight: SAFE_RIGHT / s, subY: cut.subY[shot.id]};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${VW / 2 - cx * s}px, ${top}px) scale(${s})`, overflow: 'hidden'}}>
        <FrameCtx.Provider value={win}>{shot.render(shotFrames(shot))}</FrameCtx.Provider>
      </div>
      {/* soft edges where the 16:9 picture meets the bars */}
      {contentH < VH && (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: top - 2, height: 80, background: 'linear-gradient(#000, rgba(0,0,0,0))'}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: top + contentH - 78, height: 80, background: 'linear-gradient(rgba(0,0,0,0), #000)'}} />
        </>
      )}
    </AbsoluteFill>
  );
};

/** Cards rendered natively in portrait: the 16:9 card is drawn in a 1080-wide box with wrapping. */
const VerticalCard: React.FC<{shot: Shot}> = ({shot}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <div style={{position: 'absolute', left: 0, top: (VH - SAFE_BOTTOM) / 2 - 540, width: VW, height: 1080}}>
      <div style={{width: VW, height: 1080, position: 'relative'}}>
        <PortraitCardCtx.Provider value>{shot.render(shotFrames(shot))}</PortraitCardCtx.Provider>
      </div>
    </div>
  </AbsoluteFill>
);

const VShot: React.FC<{shot: Shot; cut: Cut}> = ({shot, cut}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dur = toFrames(shotFrames(shot), fps);
  const fd = toFrames(15, fps);
  const op = Math.min(
    shot.fadeIn ? interpolate(f, [0, fd], [0, 1], {extrapolateRight: 'clamp'}) : 1,
    shot.fadeOut ? interpolate(f, [dur - fd, dur], [1, 0], {extrapolateLeft: 'clamp'}) : 1,
  );
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{opacity: op}}>{cut.cards.has(shot.id) ? <VerticalCard shot={shot} /> : <Reframe shot={shot} cut={cut} />}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Vertical cut of any film timeline with its own framing table. */
export const VerticalTimelineFilm: React.FC<{timeline: Shot[]; cut: Cut}> = ({timeline, cut}) => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Series>
        {timeline.map((s) => (
          <Series.Sequence key={s.id} durationInFrames={toFrames(shotFrames(s), fps)} name={s.id}>
            <VShot shot={s} cut={cut} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};

export const VerticalFilm: React.FC = () => <VerticalTimelineFilm timeline={TIMELINE} cut={{framing: FRAMING, subY: SUB_Y, cards: CARDS}} />;

export type {Key as FrameKey, Cut as VerticalCut};
export {FULL as V_FULL};

export const VERTICAL = {width: VW, height: VH, baseFps: BASE_FPS};
