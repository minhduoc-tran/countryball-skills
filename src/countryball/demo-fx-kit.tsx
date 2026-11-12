import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { clamp, prog } from './fx-math';
import { AircraftSection, BallsSection } from './fx-demo-sections-balls';
import { CarpetSection, RadarSection, ShootdownSection, TracerSection, WaveSection } from './fx-demo-sections-war';

// Demo of the effects kit, 600 frames (20 s) on a plain dark navy background: balls, aircraft, B-52 wave, SAM + flak +
// shootdown, bomb carpet + burning city, tracers + searchlights, radar scope. Sections cross-fade over 6 frames.

type Sec = { from: number; to: number; C: React.FC<{ t: number }> };
const SECTIONS: Sec[] = [
  { from: 0, to: 90, C: BallsSection }, { from: 90, to: 170, C: AircraftSection }, { from: 170, to: 245, C: WaveSection },
  { from: 245, to: 360, C: ShootdownSection }, { from: 360, to: 430, C: CarpetSection }, { from: 430, to: 490, C: TracerSection },
  { from: 490, to: 600, C: RadarSection },
];

export const FxKitDemo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#0E1D2E' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {Array.from({ length: 17 }, (_, i) => <line key={`v${i}`} x1={i * 120} y1={0} x2={i * 120} y2={1080} stroke="#FFFFFF" strokeOpacity={0.05} strokeWidth={2} />)}
        {Array.from({ length: 10 }, (_, i) => <line key={`h${i}`} x1={0} y1={i * 120} x2={1920} y2={i * 120} stroke="#FFFFFF" strokeOpacity={0.05} strokeWidth={2} />)}
        {SECTIONS.map(({ from, to, C }, i) => {
          if (frame < from || frame >= to) return null;
          const o = Math.min(i === 0 ? 1 : prog(frame, from, from + 6), i === SECTIONS.length - 1 ? 1 : 1 - prog(frame, to - 6, to));
          return <g key={i} opacity={clamp(o)}><C t={frame - from} /></g>;
        })}
      </svg>
    </AbsoluteFill>
  );
};
