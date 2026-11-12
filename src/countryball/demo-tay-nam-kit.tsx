import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KitDefs } from '../engine/kit';
import { SetDefs } from '../engine/light';
import { clamp, prog } from './fx-math';
import { MAP_SECTION_FRAMES, MapSection } from './tay-nam-demo-section-map';
import { BALLS_SECTION_FRAMES, BallsSection } from './tay-nam-demo-section-balls';
import { FarewellSection, CountrySection, MemorialsSection, MonumentsSection, PROPS_PAGE_FRAMES, STREET_FRAMES, StreetSection } from './tay-nam-demo-section-props';
import { HUD_SECTION_FRAMES, HudSection } from './tay-nam-demo-section-hud';

// Demo of the Tây Nam / Cambodia kit (TayNamKitDemo, 1080x1920 portrait, 30 fps): sections cross-fade over 6 frames; each gets its local t.
// Section starts: TN_SECTION_STARTS (map | flags & balls | monuments | memorials | street | countryside | farewell | HUD safe zone).
type Sec = { len: number; C: React.FC<{ t: number }> };
const SECS: Sec[] = [
  { len: MAP_SECTION_FRAMES, C: MapSection },
  { len: BALLS_SECTION_FRAMES, C: BallsSection },
  { len: PROPS_PAGE_FRAMES, C: MonumentsSection },
  { len: PROPS_PAGE_FRAMES, C: MemorialsSection },
  { len: STREET_FRAMES, C: StreetSection },
  { len: PROPS_PAGE_FRAMES, C: CountrySection },
  { len: PROPS_PAGE_FRAMES, C: FarewellSection },
  { len: HUD_SECTION_FRAMES, C: HudSection },
];
export const TN_SECTION_STARTS = SECS.map((_, i) => SECS.slice(0, i).reduce((a, b) => a + b.len, 0));
export const TN_DEMO_FRAMES = SECS.reduce((a, b) => a + b.len, 0);

export const TayNamKitDemo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#0E1D2E' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <KitDefs />
        <SetDefs />
        {SECS.map(({ len, C }, i) => {
          const from = TN_SECTION_STARTS[i], to = from + len;
          if (frame < from || frame >= to) return null;
          const o = Math.min(i === 0 ? 1 : prog(frame, from, from + 6), i === SECS.length - 1 ? 1 : 1 - prog(frame, to - 6, to));
          return <g key={i} opacity={clamp(o)}><C t={frame - from} /></g>;
        })}
      </svg>
    </AbsoluteFill>
  );
};
