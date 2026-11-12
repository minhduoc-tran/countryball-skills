import React from 'react';
import { prog } from './fx-math';
import { GateCrash } from './palace-gate-crash';
import { Label } from './fx-demo-sections-balls';
import { ClockChip } from './hud-clock-chip';

// SaigonKitDemo sections 3-4 (t = local frame): GateCrash main (tank 390 breaks the main gate) and side (tank 843 hits a side pillar and stalls).
export const GATE_FRAMES = 180;
export const Gate390Section: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <GateCrash id="g390" crash={prog(t, 8, 172)} variant="main" t={t} />
    <Label x={60} y={170} text={`GateCrash main · crash ${prog(t, 8, 172).toFixed(2)}: đến, uốn, đổ vào trong, xe cán qua`} size={26} color="#14202C" anchor="start" />
    <ClockChip date="30.04.1975" clock={[{ t: 0, time: '11:30' }, { t: 6, time: '11:31' }]} t={t / 30} id="ck3" />
  </g>
);
export const Gate843Section: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <GateCrash id="g843" crash={prog(t, 8, 172)} variant="side" t={t} tone="dusk" />
    <Label x={60} y={170} text={`GateCrash side · crash ${prog(t, 8, 172).toFixed(2)}: xe 843 đâm trụ cổng phụ, kẹt lại`} size={26} color="#F6F0E0" anchor="start" />
    <ClockChip date="30.04.1975" clock={[{ t: 0, time: '11:29' }, { t: 6, time: '11:30' }]} t={t / 30} id="ck4" />
  </g>
);
