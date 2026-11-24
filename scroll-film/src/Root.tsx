import React from 'react';
import {Composition} from 'remotion';
import './fonts';
import {Film} from './Film';
import {VerticalFilm} from './vertical';
import {FPS, H, W} from './theme';
import {shotFrames, TIMELINE} from './timeline';
import {toFrames} from './time';

type FilmProps = {fps: number};

const total = (fps: number) => TIMELINE.reduce((a, s) => a + toFrames(shotFrames(s), fps), 0);

export const RemotionRoot: React.FC = () => (
  <>
    {/* Full film. Pass --props='{"fps":10}' for the animatic. */}
    <Composition
      id="Film"
      component={Film}
      fps={FPS}
      width={W}
      height={H}
      durationInFrames={total(FPS)}
      defaultProps={{fps: FPS} as FilmProps}
      calculateMetadata={({props}) => {
        const fps = Number((props as FilmProps).fps) || FPS;
        return {fps, durationInFrames: total(fps)};
      }}
    />
    {/* 1080x1920 re-framed cut for Shorts / Reels */}
    <Composition
      id="FilmVertical"
      component={VerticalFilm}
      fps={FPS}
      width={1080}
      height={1920}
      durationInFrames={total(FPS)}
      defaultProps={{fps: FPS} as FilmProps}
      calculateMetadata={({props}) => {
        const fps = Number((props as FilmProps).fps) || FPS;
        return {fps, durationInFrames: total(fps)};
      }}
    />
    {/* Each shot on its own, for scrubbing and style frames */}
    {TIMELINE.map((s) => (
      <Composition key={s.id} id={`shot-${s.id}`} component={() => <>{s.render(shotFrames(s))}</>} fps={FPS} width={W} height={H} durationInFrames={shotFrames(s)} />
    ))}
  </>
);
