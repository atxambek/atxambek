import React from 'react';
import {AbsoluteFill, interpolate, Series, useCurrentFrame, useVideoConfig} from 'remotion';
import {Shot, shotFrames, TIMELINE} from './timeline';
import {toFrames} from './time';

const FADE = 15; // base frames of fade to/from black at act boundaries

const ShotWrap: React.FC<{shot: Shot}> = ({shot}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dur = toFrames(shotFrames(shot), fps);
  const fd = toFrames(FADE, fps);
  const op = Math.min(
    shot.fadeIn ? interpolate(f, [0, fd], [0, 1], {extrapolateRight: 'clamp'}) : 1,
    shot.fadeOut ? interpolate(f, [dur - fd, dur], [1, 0], {extrapolateLeft: 'clamp'}) : 1,
  );
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{opacity: op}}>{shot.render(shotFrames(shot))}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Film: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Series>
        {TIMELINE.map((s) => (
          <Series.Sequence key={s.id} durationInFrames={toFrames(shotFrames(s), fps)} name={s.id}>
            <ShotWrap shot={s} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
