import {useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * All animation is authored in "base frames" at 30 fps. The film can be rendered at any fps
 * (e.g. 10 fps for the animatic) — useF() converts the real frame into base frames.
 */
export const BASE_FPS = 30;
export const useF = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (f * BASE_FPS) / fps;
};
export const toFrames = (baseFrames: number, fps: number) => Math.max(1, Math.round((baseFrames * fps) / BASE_FPS));
export const sec = (s: number) => Math.round(s * BASE_FPS);

/** Clamped linear ramp from `from` to `to` while f goes a → b. */
export const ramp = (f: number, a: number, b: number, from = 0, to = 1) => {
  if (b === a) return f < a ? from : to;
  const t = Math.max(0, Math.min(1, (f - a) / (b - a)));
  return from + (to - from) * t;
};
export const ease = (t: number) => t * t * (3 - 2 * t);
