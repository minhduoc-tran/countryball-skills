import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { clamp, prog } from './fx-math';
import { MapSection } from './quang-tri-demo-section-map';
import { CitadelStatesSection, CitadelZoomSection } from './quang-tri-demo-section-citadel';
import { FireSupportSection, MovementSection } from './quang-tri-demo-section-ground';
import { MemorialSection, RiverNightSection } from './quang-tri-demo-section-night';
import { SideViewSection } from './quang-tri-demo-section-sideviews';

// Demo of the Quảng Trị kit (QuangTriKitDemo, 30 fps): sections cross-fade over 6 frames; each section gets its local
// frame t. 1 map zoom Vietnam -> town, 2 CitadelPlan states, 3 artillery / naval / shells, 4 tanks / helicopters /
// arrows / trenches, 5 river crossing / rain / smoke, 6 ruined wall / memorial / balls.

type Sec = { from: number; to: number; C: React.FC<{ t: number }> };
const SECTIONS: Sec[] = [
  { from: 0, to: 390, C: MapSection },
  { from: 390, to: 600, C: CitadelZoomSection },
  { from: 600, to: 700, C: CitadelStatesSection },
  { from: 700, to: 850, C: FireSupportSection },
  { from: 850, to: 1000, C: MovementSection },
  { from: 1000, to: 1150, C: RiverNightSection },
  { from: 1150, to: 1250, C: SideViewSection },
  { from: 1250, to: 1400, C: MemorialSection },
];
export const QT_DEMO_FRAMES = SECTIONS[SECTIONS.length - 1].to;

export const QuangTriKitDemo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#0E1D2E' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {SECTIONS.map(({ from, to, C }, i) => {
          if (frame < from || frame >= to) return null;
          const o = Math.min(i === 0 ? 1 : prog(frame, from, from + 6), i === SECTIONS.length - 1 ? 1 : 1 - prog(frame, to - 6, to));
          return <g key={i} opacity={clamp(o)}><C t={frame - from} /></g>;
        })}
      </svg>
    </AbsoluteFill>
  );
};
