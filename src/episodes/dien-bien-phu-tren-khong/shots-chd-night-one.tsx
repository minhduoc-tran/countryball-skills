import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { Headset, UsafCap } from '../../countryball/ball-accessories';
import { breathe } from '../../countryball/ball-motion';
import { BCell } from '../../countryball/fx-flight-path';
import { SamLaunch, FlakBurst, SamSite } from '../../countryball/fx-sam-and-flak';
import { B52Shootdown } from '../../countryball/fx-b52-hit';
import { AaGun, AaTracers, Flare, Searchlights } from '../../countryball/fx-tracers-and-lights';
import { AircraftSide } from '../../countryball/aircraft-side-view';
import { Counter } from '../../countryball/hud-counter';
import { DateChip } from '../../countryball/hud-date-chip';
import { LowerThird, NightChip } from '../../countryball/hud-chips';
import { Pt, prog } from '../../countryball/fx-math';
import { Chip, DimMap, MapStage, drift, ll } from './chd-common';
import { SkyBackdrop, StatCard } from './chd-props';
import { Contrail, DoomedPlane, WingLane } from './chd-flight-bits';

// Chapter D, night one (18/12/1972, đêm 1): sirens over Hà Nội, 129 B-52 in three waves, flares + flak + searchlights,
// SAM-2 trails, the first B-52 hit, and the US figure "3" (labelled as the US side's count).

const HN: [number, number] = [105.85, 21.03];

/** D1: dusk map pushes in on Hà Nội, the lights go out as the sirens start (frame 56 = "còi báo động"). */
export const D1: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  const keys = [{ t: 0, lon: 105.3, lat: 20.5, zoom: 110 }, { t: 3.9, lon: 105.85, lat: 21.0, zoom: 430 }];
  const night = 0.15 + 0.65 * prog(t, 0, 48);
  const lights = 1 - 0.85 * prog(t, 78, 100);
  return (
    <MapStage id="D1" t={t} keys={keys} night={night} lights={lights} pulse={0.5 * prog(t, 56, 72)} date="18.12.1972" nightChip="ĐÊM 1/12" nightSince={0.2}
      cities={['hanoi', 'haiphong']} cityMin={200}
      hud={<LowerThird title="Còi báo động khắp Hà Nội" from={2.0} to={3.9} t={s} />}>
      {(cam) => {
        const [x, y] = ll(cam, HN[0], HN[1]);
        return (
          <g>
            {[0, 1, 2].map((k) => {
              const age = t - 56 - k * 18;
              if (age < 0) return null;
              const a = age % 54;
              return <circle key={k} cx={x} cy={y} r={30 + a * 9} fill="none" stroke="#FF4B4B" strokeWidth={8 * (1 - a / 54) + 2} opacity={0.9 * (1 - a / 54)} />;
            })}
          </g>
        );
      }}
    </MapStage>
  );
};

const WAVES: { pts: [number, number][]; t0: number; t1: number }[] = [
  { pts: [[101.1, 19.5], [103.3, 20.3], [105.85, 21.0]], t0: 4, t1: 78 },
  { pts: [[101.3, 20.7], [103.5, 21.1], [105.85, 21.06]], t0: 38, t1: 112 },
  { pts: [[101.1, 18.8], [103.5, 19.8], [105.8, 20.98]], t0: 66, t1: 134 },
];

/** D2: 129 B-52 counting up while three waves (two cells each) stream in from the south-west. */
export const D2: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <MapStage id="D2" t={t} keys={drift(104.5, 20.5, 215, 0.6, 0.3, 25, 4.6)} date="18.12.1972" nightChip="ĐÊM 1/12" nightSince={0}
      hud={<Counter label="B-52 ĐÊM 1" steps={[{ t: 0.25, value: 0 }, { t: 1.9, value: 129 }]} t={s} />}>
      {(cam) => (
        <g>
          {WAVES.map((w, i) => [0, 1].map((k) => (
            <BCell key={`${i}${k}`} id={`D2-${i}${k}`} t={t} size={68} t0={w.t0 + k * 6} t1={w.t1 + k * 6} trailLen={380}
              points={w.pts.map(([lo, la]) => ll(cam, lo, la + k * 0.28) as Pt)} />
          )))}
          {['ĐỢT 1', 'ĐỢT 2', 'ĐỢT 3'].map((txt, i) => <Chip key={txt} x={640 + i * 300} y={960} text={txt} t={t} at={100 + i * 10} size={44} />)}
        </g>
      )}
    </MapStage>
  );
};

/** D3: night sky over the roofs: parachute flares, flak bursts round a passing B-52, tracers and searchlights. */
export const D3: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  const px = 140 + t * 17, py = 330 + Math.sin(t / 30) * 10;
  const guns: [number, number, number][] = [[240, 892, -78], [620, 896, -96], [1000, 890, -84], [1420, 896, -100], [1780, 892, -88]];
  return (
    <g>
      <SkyBackdrop id="D3" glow={0.45 * prog(t, 20, 90)} />
      <Searchlights t={t} length={1100} lock={{ at: [px + 60, py + 20], from: 40 }}
        sources={[{ x: 300, y: 900, base: -70, swing: 25, period: 120 }, { x: 960, y: 900, base: -90, swing: 30, period: 150, phase: 0.4 }, { x: 1620, y: 900, base: -110, swing: 22, period: 130 }]} />
      <Flare t={t} t0={0} x={360} y={150} r={150} />
      <Flare t={t} t0={7} x={1150} y={110} r={150} />
      <Flare t={t} t0={20} x={1620} y={170} r={140} />
      <AircraftSide kind="b52" x={px} y={py} size={420} pitch={-2} />
      {[[1140, 250, 58], [1290, 350, 62], [1020, 400, 66], [1450, 290, 72]].map(([x, y, t0], i) => <FlakBurst key={i} id={`D3-f${i}`} t={t} t0={t0} x={x} y={y} r={44} />)}
      {guns.map(([x, y, a], i) => <AaTracers key={i} id={`D3-aa${i}`} t={t} x={x} y={y - 16} aim={a} reach={i % 2 ? 620 : 760} seed={i + 2} cyc={26 + i * 5} />)}
      {guns.map(([x, y, a], i) => <AaGun key={i} x={x} y={y} aim={a} s={1.25} />)}
      <DateChip label="18.12.1972" t={s} id="D3-date" />
      <NightChip label="ĐÊM 1/12" t={s} />
    </g>
  );
};

const SAM_SITES: { p: [number, number]; to: Pt; t0: number }[] = [
  { p: [105.35, 21.15], to: [330, 120], t0: 0 }, { p: [105.55, 20.65], to: [250, 640], t0: 8 }, { p: [106.3, 20.7], to: [1700, 760], t0: 14 },
  { p: [106.35, 21.2], to: [1720, 180], t0: 20 }, { p: [105.6, 21.45], to: [700, 60], t0: 25 }, { p: [106.0, 20.5], to: [1200, 960], t0: 29 },
  { p: [105.75, 21.3], to: [1080, 70], t0: 34 }, { p: [105.4, 20.9], to: [120, 400], t0: 38 }, { p: [106.1, 21.35], to: [1400, 90], t0: 43 },
];

/** D4: a ring of SAM sites round Hà Nội, a dozen launches leaving long smoke trails. */
export const D4: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <MapStage id="D4" t={t} keys={drift(105.85, 21.0, 560, 0.02, 0.01, 40, 2.1)} date="18.12.1972" nightChip="ĐÊM 1/12" nightSince={-5} cities={['hanoi']}
      hud={<LowerThird title="Tên lửa SAM-2" sub="Hàng chục quả được phóng lên trong đêm" from={0.1} to={2.1} t={s} />}>
      {(cam) => (
        <g>
          {SAM_SITES.map((q, i) => <SamSite key={`s${i}`} x={ll(cam, q.p[0], q.p[1])[0]} y={ll(cam, q.p[0], q.p[1])[1]} r={30} />)}
          {SAM_SITES.map((q, i) => {
            const from = ll(cam, q.p[0], q.p[1]);
            return <SamLaunch key={`l${i}`} id={`D4-l${i}`} t={t} t0={q.t0} from={from} to={q.to} dur={34} bend={i % 2 ? 0.2 : -0.2} size={70} />;
          })}
          {SAM_SITES.slice(0, 4).map((q, i) => <FlakBurst key={`b${i}`} id={`D4-b${i}`} t={t} t0={q.t0 + 34} x={q.to[0]} y={q.to[1]} r={34} />)}
        </g>
      )}
    </MapStage>
  );
};

// D5 + D6 share one scene (same camera, same px positions): the doomed B-52 flies in D5 and is hit at D5 frame 92.
const HIT_AT: Pt = [1040, 470], HEADING = 8, SPEED = 7, SAM_FROM: Pt = [690, 930];
const SHOOT = { at: HIT_AT, heading: HEADING, speed: SPEED, fallDur: 46 };

const SceneBase: React.FC<{ t: number; hit: number; children?: React.ReactNode; id: string; shift: number }> = ({ t, hit, children, id, shift }) => {
  return (
    <MapStage id={id} t={t + shift} keys={drift(105.9, 21.05, 700, 0.03, 0.01, 10, 4.9)} date="18.12.1972" nightChip="ĐÊM 1/12" nightSince={-5} cities={['hanoi']} mini>
      {() => (
        <g>
          <SamSite x={SAM_FROM[0]} y={SAM_FROM[1]} r={40} />
          <SamSite x={1330} y={930} r={34} />
          <Contrail t={t} hit={hit} at={HIT_AT} heading={HEADING} speed={SPEED} />
          <WingLane id={`${id}-L`} t={t} hit={hit} at={HIT_AT} off={[150, -165]} heading={HEADING} speed={SPEED} />
          <WingLane id={`${id}-R`} t={t} hit={hit} at={HIT_AT} off={[20, -330]} heading={HEADING} speed={SPEED} />
          {t < hit && <DoomedPlane id={`${id}-doom`} t={t} hit={hit} at={HIT_AT} heading={HEADING} speed={SPEED} />}
          {children}
          <Ball id={`${id}-vn`} x={230} y={860} r={66} flag="VNM" eyes="determined" hat={<Headset />} motion={breathe(t + shift, 66)} />
        </g>
      )}
    </MapStage>
  );
};

/** D5: a B-52 cell crosses the sky; a SAM site tracks the left wingman, the missile arrives on the last frame. */
export const D5: React.FC<ShotProps> = ({ t }) => (
  <SceneBase id="D5" t={t} hit={92} shift={0}>
    <SamLaunch id="D5-dec" t={t} t0={6} from={[1330, 930]} to={[1750, 330]} dur={48} bend={-0.2} size={70} />
    <FlakBurst id="D5-fa" t={t} t0={54} x={1750} y={330} r={40} />
    <FlakBurst id="D5-fb" t={t} t0={22} x={860} y={330} r={36} />
    <FlakBurst id="D5-fc" t={t} t0={40} x={1300} y={250} r={36} />
    <SamLaunch id="D5-hit" t={t} t0={50} from={SAM_FROM} to={[HIT_AT[0] + 4, HIT_AT[1] - 24]} dur={42} bend={0.22} size={78} />
  </SceneBase>
);

/** D6: the hit. The B-52 burns and spirals down; the missile trail from D5 is still in the air. */
export const D6: React.FC<ShotProps> = ({ t }) => (
  <SceneBase id="D6" t={t} hit={3} shift={92}>
    <SamLaunch id="D6-hit" t={t} t0={-42} from={SAM_FROM} to={[HIT_AT[0] + 4, HIT_AT[1] - 24]} dur={42} bend={0.22} size={78} />
    <B52Shootdown id="D6-sd" t={t} t0={3} {...SHOOT} size={120} />
  </SceneBase>
);

/** D7: the US count as a plain card: 3 B-52 shot down on the first night (US figure). */
export const D7: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <g>
      <DimMap id="D7" t={t} lon={105.6} lat={20.8} zoom={230} dim={0.72} />
      <Ball id="D7-us" x={420} y={660} r={150} flag="USA" eyes="worried" sweat hat={<UsafCap />} motion={breathe(t, 80, 0.035)} />
      <StatCard x={1160} y={520} w={900} h={560} kicker="THEO PHÍA MỸ" big="3" l1="B-52 bị bắn rơi" l2="Đêm 18/12/1972, trong 129 B-52" t={t} at={4} />
      <DateChip label="18.12.1972" t={s} id="D7-date" />
      <NightChip label="ĐÊM 1/12" t={s} />
    </g>
  );
};
