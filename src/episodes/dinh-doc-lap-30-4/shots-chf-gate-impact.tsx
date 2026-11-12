import React from 'react';
import { ShotProps } from '../../engine';
import { GateCrash } from '../../countryball/palace-gate-crash';
import { PalacePlan, palaceRoute, PlanTank } from '../../countryball/palace-plan';
import { localToScreen } from '../../countryball/palace-geometry';
import { SAIGON_CAMERAS as C } from '../../countryball/sai-gon-camera-keys';
import { SAIGON_ATTRIBUTION } from '../../countryball/sai-gon-map-labels';
import { cameraAt } from '../../countryball/geo-camera';
import { ClockChip } from '../../countryball/hud-clock-chip';
import { LowerThird, SourceLine } from '../../countryball/hud-chips';
import { easeOut, prog } from '../../countryball/fx-math';
import { Out } from '../dien-bien-phu-tren-khong/cha-map-scene';
import { Drift, Slam, Veil } from './cha-common';
import { Pill, sec } from './chf-common';

// Chapter F, THE moment (422.3-435.5 s): F9 "10:45" at the closed gate (same framing as A3/A6), F10 tank 843 hits the SIDE gate and stalls,
// F11 "ngay sau đó" tank 390 drives at the MAIN gate, F12 it breaks the gate (crash 0.30 -> 0.95, ~2 s of impact) and rolls into the courtyard,
// F13 PalacePlan top view: gate flat, 390 in the courtyard, 843 stalled at the side gate.

export const F9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Drift t={t} len={len} z0={1} z1={1.08} cx={1100} cy={720}>
      <GateCrash id="f9" variant="side" crash={0.02} t={t} />
    </Drift>
    <Veil id="f9" o={0.4} />
    <Slam t={t} a={6} x={960} y={330} size={230}>10:45</Slam>
    <ClockChip date="30.04.1975" clock="10:45" t={sec(t)} id="f9-ck" />
  </g>
);

// F10: 843 drives in (0 -> 0.40 until frame HIT), hits the pillar (0.40 -> 0.50), then sits stalled with growing smoke.
const HIT10 = 117;
export const F10: React.FC<ShotProps> = ({ t, len }) => {
  const crash = t < HIT10 ? 0.4 * (t / HIT10) : 0.4 + 0.1 * easeOut(prog(t, HIT10, HIT10 + 13)) + 0.08 * prog(t, HIT10 + 13, len);
  return (
    <g>
      <Drift t={t} len={len} z0={1} z1={1.1} cx={1100} cy={720}>
        <GateCrash id="f10" variant="side" crash={crash} t={t} />
      </Drift>
      <Veil id="f10" o={0.35} />
      <Pill t={t} at={30} x={520} y={250} text="XE 843 · T-54B" size={50} fill="#2F5FB4" />
      <Out x={1180} y={330} size={64} opacity={prog(t, HIT10 - 6, HIT10 + 6)}>CỔNG PHỤ</Out>
      <LowerThird title="10:45 · Xe 843 húc cổng phụ" sub="Theo Khu di tích Dinh Độc Lập" from={0.3} to={len / 30 - 0.1} t={sec(t)} y={925} />
      <ClockChip date="30.04.1975" clock="10:45" t={sec(t)} id="f10-ck" />
    </g>
  );
};

// F11: ngay sau đó, tank 390 drives at the main gate (crash 0 -> 0.30, the last frame is the first of F12).
export const F11: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Drift t={t} len={len} z0={1} z1={1.08} cx={1100} cy={720}>
      <GateCrash id="f11" variant="main" crash={0.3 * (t / len)} t={t} />
    </Drift>
    <Veil id="f11" o={0.35} />
    <Out x={960} y={170} size={92} opacity={prog(t, 4, 14)}>NGAY SAU ĐÓ</Out>
    <Pill t={t} at={26} x={430} y={290} text="XE 390 · TYPE 59" size={50} fill="#2F7F4F" />
  </g>
);

// F12: impact at crash 0.34 (frame ~8), the gate bends and falls inwards (0.46 -> 0.70, ~2 s), the tank rolls over it (0.70 -> 0.95).
export const F12: React.FC<ShotProps> = ({ t, len }) => {
  const crash = t < 62 ? 0.3 + 0.4 * prog(t, 0, 62) : Math.min(0.95, 0.7 + 0.25 * prog(t, 62, len));
  return (
    <g>
      <Drift t={t} len={len} z0={1.08} z1={1.14} cx={1100} cy={720}>
        <GateCrash id="f12" variant="main" crash={crash} t={t + 72} />
      </Drift>
      <Veil id="f12" o={0.3} />
      <Out x={960} y={170} size={84} opacity={prog(t, 44, 56)}>TIẾN THẲNG VÀO SÂN DINH</Out>
    </g>
  );
};

const KEYS = [{ t: 0, ...C.gate, zoom: 560000 }, { t: 1.6, ...C.gate, zoom: 640000 }];
const R390: [number, number][] = [[240, 0], [164, 0], [100, 0], [40, 0]];
const R843: [number, number][] = [[400, 60], [210, 52], [168, 49], [150, 49]];

export const F13: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt(KEYS, s);
  const a = palaceRoute(R390, 0.3 + 0.5 * prog(t, 0, 48)), b = palaceRoute(R843, 1);
  const tanks: PlanTank[] = [{ x: a.x, y: a.y, heading: a.heading, kind: 'type59', scale: 2.2 }, { x: b.x, y: b.y, heading: b.heading, kind: 't54', scale: 2.2 }];
  const [ax, ay] = localToScreen(cam, a.x, a.y), [bx, by] = localToScreen(cam, b.x, b.y);
  return (
    <g>
      <PalacePlan id="f13" camera={cam} t={t} gate={1} tanks={tanks} labels={['gate', 'palace']} />
      <Veil id="f13" o={0.25} />
      <Pill t={t} at={6} x={ax} y={ay - 90} text="390" size={44} fill="#2F7F4F" />
      <Pill t={t} at={12} x={bx + 150} y={by - 70} text="843" size={44} fill="#2F5FB4" />
      <LowerThird title="Hai xe tăng, hai cổng" sub="Theo Khu di tích Dinh Độc Lập" from={0.1} to={1.5} t={s} />
      <SourceLine text={`${SAIGON_ATTRIBUTION}; Natural Earth (public domain)`} t={s} />
    </g>
  );
};
