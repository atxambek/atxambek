import {createContext, useContext} from 'react';

/**
 * When a 16:9 shot is reframed for the vertical cut, this tells overlays (subtitles, the meter)
 * which part of the 1920x1080 frame is visible, so they can move into it and stay inside the safe zone.
 */
export type MeterPlace = {side?: 'left' | 'right'; y?: number; card?: boolean};
export type FrameWindow = {x0: number; x1: number; s: number; safeRight: number; subY?: number; meter?: MeterPlace};
export const FrameCtx = createContext<FrameWindow | null>(null);
export const useFrameWindow = () => useContext(FrameCtx);

/** True while a full-screen card (narration, quote, title) is laid out for the portrait cut. */
export const PortraitCardCtx = createContext(false);
export const usePortraitCard = () => useContext(PortraitCardCtx);
