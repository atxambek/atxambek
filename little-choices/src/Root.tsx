import React from 'react';
import {Composition} from 'remotion';
import './fonts';
import {Film} from './Film';
import {VerticalFilm} from './vertical';
import {CoverVertical, CoverVerticalLookUp, ThumbDrawing, ThumbFiveMinutes, ThumbLookUp} from './thumbnails';
import {ChannelBanner, ChannelLogo, ChannelPreview, ChannelWatermark} from './channel';
import {LaterS01, LaterS03, LaterS07, LaterS13, LaterS18, LaterStack} from './later/frames';
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
    {/* Thumbnails (1280x720) and the vertical cover (1080x1920) */}
    <Composition id="thumb-a-drawing" component={ThumbDrawing} fps={FPS} width={1280} height={720} durationInFrames={1} />
    <Composition id="thumb-b-5min" component={ThumbFiveMinutes} fps={FPS} width={1280} height={720} durationInFrames={1} />
    <Composition id="thumb-c-lookup" component={ThumbLookUp} fps={FPS} width={1280} height={720} durationInFrames={1} />
    <Composition id="cover-vertical" component={CoverVertical} fps={FPS} width={1080} height={1920} durationInFrames={1} />
    <Composition id="cover-vertical-lookup" component={CoverVerticalLookUp} fps={FPS} width={1080} height={1920} durationInFrames={1} />
    {/* Channel branding: logo 800x800, banner 2048x1152, watermark 150x150, and a preview sheet */}
    <Composition id="channel-logo" component={ChannelLogo} fps={FPS} width={800} height={800} durationInFrames={1} />
    <Composition id="channel-banner" component={ChannelBanner} fps={FPS} width={2048} height={1152} durationInFrames={1} />
    <Composition id="channel-watermark" component={ChannelWatermark} fps={FPS} width={150} height={150} durationInFrames={1} />
    <Composition id="channel-preview" component={ChannelPreview} fps={FPS} width={1600} height={900} durationInFrames={1} />
    {/* LATER (episode 4) — phase 1 style frames */}
    <Composition id="later-S01" component={LaterS01} fps={FPS} width={W} height={H} durationInFrames={300} />
    <Composition id="later-S03" component={LaterS03} fps={FPS} width={W} height={H} durationInFrames={240} />
    <Composition id="later-stack" component={LaterStack} fps={FPS} width={W} height={H} durationInFrames={240} />
    <Composition id="later-S07" component={LaterS07} fps={FPS} width={W} height={H} durationInFrames={300} />
    <Composition id="later-S13" component={LaterS13} fps={FPS} width={W} height={H} durationInFrames={300} />
    <Composition id="later-S18" component={LaterS18} fps={FPS} width={W} height={H} durationInFrames={360} />
    {/* Each shot on its own, for scrubbing and style frames */}
    {TIMELINE.map((s) => (
      <Composition key={s.id} id={`shot-${s.id}`} component={() => <>{s.render(shotFrames(s))}</>} fps={FPS} width={W} height={H} durationInFrames={shotFrames(s)} />
    ))}
  </>
);
