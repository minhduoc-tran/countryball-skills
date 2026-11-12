import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { clamp, prog } from './fx-math';
import { MAP_SECTION_FRAMES, MapSection } from './sai-gon-demo-section-map';
import { PLAN_SECTION_FRAMES, PlanSection } from './sai-gon-demo-section-plan';
import { GATE_FRAMES, Gate390Section, Gate843Section } from './sai-gon-demo-section-gate';
import { FACADE_FRAMES, FacadeSection } from './sai-gon-demo-section-facade';
import { BRIDGE_FRAMES, BridgeSection, CARRIER_FRAMES, CarrierSection, EVAC_FRAMES, RooftopSection } from './sai-gon-demo-section-bridge-evac';
import { PROPS_FRAMES, PropsSection } from './sai-gon-demo-section-props';

// Demo of the Sài Gòn / Dinh Độc Lập kit (SaigonKitDemo, 30 fps): sections cross-fade over 6 frames; each section gets its local frame t.
type Sec = { from: number; to: number; C: React.FC<{ t: number }> };
const lens = [MAP_SECTION_FRAMES, PLAN_SECTION_FRAMES, GATE_FRAMES, GATE_FRAMES, FACADE_FRAMES, BRIDGE_FRAMES, EVAC_FRAMES, CARRIER_FRAMES, PROPS_FRAMES];
const comps: React.FC<{ t: number }>[] = [MapSection, PlanSection, Gate390Section, Gate843Section, FacadeSection, BridgeSection, RooftopSection, CarrierSection, PropsSection];
/** Start frame of each section: 0 map | plan | gate 390 | gate 843 | facade | bridge | rooftop | carrier | props. */
export const SG_SECTION_STARTS = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0));
const SECTIONS: Sec[] = comps.map((C, i) => ({ from: SG_SECTION_STARTS[i], to: SG_SECTION_STARTS[i] + lens[i], C }));
export const SG_DEMO_FRAMES = SECTIONS[SECTIONS.length - 1].to;

export const SaigonKitDemo: React.FC = () => {
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
