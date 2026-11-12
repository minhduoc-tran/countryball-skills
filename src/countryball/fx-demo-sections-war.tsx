import React from 'react';
import { Ball } from './countryball';
import { Headset } from './ball-accessories';
import { breathe, hopOnce, mixMotion, talk } from './ball-motion';
import { SpeechBubble } from './ball-speech-and-props';
import { BCell, BWave, FlightPath } from './fx-flight-path';
import { FlakBurst, SamLaunch, SamSite } from './fx-sam-and-flak';
import { B52Shootdown, shootdownPose } from './fx-b52-hit';
import { BombCarpet } from './fx-bomb-carpet';
import { BurningBlocks } from './fx-burning-city';
import { AaGun, AaTracers, Flare, Searchlights } from './fx-tracers-and-lights';
import { RadarScope } from './radar-scope';
import { AScope, ManualNotebook } from './radar-ascope-and-notebook';
import { clamp, prog } from './fx-math';
import { Label } from './fx-demo-sections-balls';

// FxKitDemo sections 3-7 (t = local frame): B-52 wave with contrails, SAM + flak + shootdown, bomb carpet + burning
// city, tracers + searchlights + flares, radar scope with jamming and the found blip.

export const WaveSection: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <Label x={60} y={70} text="ĐỘI BAY B-52: 3 CHIẾC/TỐP, NHIỀU ĐỢT, VỆT KHÓI" size={28} color="#FFD166" anchor="start" />
    <BWave id="w" t={t} size={96} cells={[
      { points: [[-200, 400], [500, 450], [1200, 420], [2150, 520]], t0: 0, t1: 78 },
      { points: [[-300, 660], [500, 690], [1300, 740], [2150, 800]], t0: 8, t1: 90 },
      { points: [[-200, 940], [600, 920], [1400, 960], [2150, 1020]], t0: 16, t1: 96 },
    ]} />
    <FlightPath id="solo" t={t} t0={0} t1={78} points={[[-200, 140], [900, 190], [2150, 140]]} kind="kc135" size={120} />
  </g>
);

export const ShootdownSection: React.FC<{ t: number }> = ({ t }) => {
  const hitAt = 40, at: [number, number] = [1180, 400], cfg = { at, heading: 8, speed: 7, fallDur: 55 };
  const pose = shootdownPose(hitAt, hitAt, cfg);
  return (
    <g>
      <Label x={60} y={70} text="SAM-2 + MẢNH PHÁO + B-52 TRÚNG ĐẠN RƠI XOÁY" size={28} color="#FFD166" anchor="start" />
      <SamSite x={520} y={900} r={46} /><SamSite x={1500} y={880} r={40} />
      <SamLaunch id="s1" t={t} t0={4} from={[1500, 880]} to={[1620, 240]} dur={40} bend={-0.2} />
      <FlakBurst id="m" t={t} t0={44} x={1620} y={240} r={50} />
      <SamLaunch id="s2" t={t} t0={hitAt - 34} from={[520, 900]} to={[pose.x + 4, pose.y - 24]} dur={34} bend={0.22} />
      <FlightPath id="e" t={t} t0={0} t1={115} points={[[-100, 190], [900, 150], [2100, 170]]} size={90} />
      <B52Shootdown id="sd" t={t} t0={hitAt} {...cfg} size={150} />
      <Ball id="sh" x={260} y={780} r={80} flag="VNM" eyes={t < 45 ? 'determined' : 'happy'} hat={<Headset />} motion={mixMotion(breathe(t), hopOnce(t, 50, 24, 40))} />
      <SpeechBubble x={420} y={640} tipX={290} tipY={740} text="Bắn!" size={44} t={t} at={3} />
    </g>
  );
};

export const CarpetSection: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <Label x={60} y={70} text="RẢI THẢM + KHU PHỐ CHÁY ĐÊM" size={28} color="#FFD166" anchor="start" />
    <BurningBlocks id="c" t={t} x={660} y={300} w={980} h={560} cols={8} rows={5} fireAt={10} spread={40} />
    <BombCarpet id="bc" t={t} t0={4} from={[260, 880]} to={[1760, 280]} dur={46} n={26} width={90} r={34} />
    <BCell id="cell" t={t} t0={0} t1={58} size={96} points={[[100, 960], [1000, 580], [2100, 120]]} trailLen={300} />
  </g>
);

const GUNS: [number, number, number][] = [[260, 960, -78], [620, 990, -96], [1000, 970, -84], [1400, 990, -100], [1760, 960, -88]];

export const TracerSection: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <Label x={60} y={70} text="ĐẠN TRÊN MẶT ĐẤT, ĐÈN PHA, PHÁO SÁNG" size={28} color="#FFD166" anchor="start" />
    <Searchlights t={t} length={1000} lock={{ at: [1000 + t * 6, 300], from: 28 }}
      sources={[{ x: 140, y: 1030, base: -70, swing: 25, period: 120 }, { x: 960, y: 1040, base: -90, swing: 30, period: 150, phase: 0.4 }, { x: 1800, y: 1030, base: -110, swing: 22, period: 130 }]} />
    <Flare t={t} t0={0} x={420} y={240} r={130} /><Flare t={t} t0={14} x={1600} y={330} r={110} />
    <FlightPath id="tp" t={t} t0={0} t1={62} points={[[-100, 360], [700, 300], [1500, 290], [2100, 320]]} size={120} />
    {GUNS.map(([x, y, a], i) => <AaTracers key={i} id={`aa${i}`} t={t} x={x} y={y - 20} aim={a} reach={i % 2 ? 560 : 700} seed={i + 1} cyc={26 + i * 6} />)}
    {GUNS.map(([x, y, a], i) => <AaGun key={i} x={x} y={y} aim={a} s={1.2} />)}
  </g>
);

export const RadarSection: React.FC<{ t: number }> = ({ t }) => {
  const reveal = prog(t, 50, 76), found = clamp(t - 70);
  return (
    <g>
      <Label x={60} y={70} text="MÀN RADA: NHIỄU, RỒI TÌM RA B-52 TRONG NHIỄU" size={28} color="#FFD166" anchor="start" />
      <RadarScope id="r" t={t} cx={560} cy={570} r={420} period={70} foundAt={70}
        jam={{ center: 58, width: 70, strength: Math.min(1, t / 20) }}
        blips={[{ bearing: 215, range: 0.5, vB: 0.02 }, { bearing: 300, range: 0.8, vR: -0.0006 }, { bearing: 160, range: 0.35 }, { bearing: 60, range: 0.68, vR: -0.0004, target: true }]} />
      <AScope id="a" t={t} x={1130} y={190} w={720} h={300} noise={0.9} reveal={reveal} peakAt={0.64} />
      <Label x={1490} y={540} text="A-scope: đỉnh cao đều trong nhiễu = B-52" size={22} />
      <ManualNotebook x={1700} y={810} s={1.25} rot={-8} />
      <Ball id="op" x={1260} y={820} r={96} flag="VNM" eyes={found > 0 ? 'happy' : 'determined'} hat={<Headset />} motion={mixMotion(breathe(t), found > 0 ? talk(t, true, 1.4) : undefined)} />
      <SpeechBubble x={1230} y={650} tipX={1260} tipY={745} text={found > 0 ? 'Thấy rồi: B-52!' : 'Nhiễu quá...'} size={36} t={t} at={found > 0 ? 70 : 6} />
    </g>
  );
};
