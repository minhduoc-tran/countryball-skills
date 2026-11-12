import React from 'react';
import { CameraKey, cameraAt } from './geo-camera';
import { SAIGON_CAMERAS as C } from './sai-gon-camera-keys';
import { clamp, prog } from './fx-math';
import { PalacePlan, palaceRoute, PlanTank } from './palace-plan';
import { localToPalace, palaceScreen } from './palace-geometry';
import { UnitBox, SIDE_COLORS } from './ground-front-arrows';
import { Label } from './fx-demo-sections-balls';
import { ClockChip } from './hud-clock-chip';
import { SAIGON_ATTRIBUTION } from './sai-gon-map-labels';
import { SourceLine } from './hud-chips';

// SaigonKitDemo section 2 (t = local frame, 30 fps): PalacePlan top-down. Two tanks roll along the avenue Lê Duẩn (the palace axis) to the
// gate: the first (Type 59) breaks the main gate (gate 0 -> 1 driven by its own position), the second (T-54B) goes to the right-hand side
// gate. Then the NLF flag appears on the roof. The camera moves palaceGrounds -> palace -> gate.
export const PLAN_SECTION_FRAMES = 300;
const KEYS: CameraKey[] = [{ t: 0, ...C.palaceGrounds }, { t: 1.5, ...C.palaceGrounds }, { t: 4, ...C.palace }, { t: 6.2, ...C.palace }, { t: 8.5, ...C.gate }, { t: 10, ...C.gate }];
const R1: [number, number][] = [[360, -6], [200, -2], [164, 0], [110, 0], [48, 0]];
const R2: [number, number][] = [[400, 60], [210, 52], [168, 49], [150, 49]];

export const PlanSection: React.FC<{ t: number }> = ({ t }) => {
  const sec = t / 30, cam = cameraAt(KEYS, sec);
  const p1 = palaceRoute(R1, prog(t, 20, 200)), p2 = palaceRoute(R2, prog(t, 60, 220));
  const front = localToPalace(p1.x, p1.y)[0], gate = 1 - clamp((front - 140) / 36);
  const tanks: PlanTank[] = [{ x: p1.x, y: p1.y, heading: p1.heading, kind: 'type59' }, { x: p2.x, y: p2.y, heading: p2.heading, kind: 't54' }];
  const [gx, gy] = palaceScreen(cam, 164, 0);
  return (
    <g>
      <PalacePlan id="pp" camera={cam} t={t} gate={gate} flag={t > 235 ? 'PRG' : 'none'} tanks={tanks} labels />
      <Label x={60} y={170} text="PALACE PLAN: xe 390 (Type 59) phá cổng chính, xe 843 (T-54B) vào cổng phụ" size={26} color="#14202C" anchor="start" />
      {sec > 5 && <UnitBox x={gx + 120} y={gy - 110} kind="arm" color={SIDE_COLORS.vnm} label="203" size={46} />}
      <ClockChip date="30.04.1975" clock={[{ t: 0, time: '11:00' }, { t: 10, time: '11:30' }]} t={sec} id="ck2" />
      <SourceLine text={SAIGON_ATTRIBUTION} t={sec} />
    </g>
  );
};
