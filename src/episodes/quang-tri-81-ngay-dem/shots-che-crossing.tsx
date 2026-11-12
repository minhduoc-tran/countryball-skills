import React from 'react';
import { ShotProps } from '../../engine';
import { Boat, RiverCrossing } from '../../countryball/ground-river-crossing';
import { ShellBarrage } from '../../countryball/ground-artillery';
import { WaterRipples, WaterSplash } from '../../countryball/ground-water-splash';
import { MonsoonRain } from '../../countryball/ground-weather-and-smoke';
import { Flare } from '../../countryball/fx-tracers-and-lights';
import { Glow } from '../../countryball/fx-glow';
import { localToScreen } from '../../countryball/citadel-geometry';
import { clamp, easeOut, lerp, hash } from '../../countryball/fx-math';
import { Dim, Pop, ramp, sec, Txt } from './chb-common';
import { BrokenBridge } from './che-bridge-side';
import { crossLine, NightPlan, planCam, SoldierIcon } from './che-common';

// Chapter E, beat "19 crossing" (E1-E7, 399.8-415.8 s): the iron bridge is gone, so everything crosses the Thạch Hãn at night:
// boats, rafts, swimmers (tiny heads only), flares, shell splashes. Nothing graphic, no drowning shown.

// ---------- E1: the destroyed iron bridge ----------
export const E1: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <BrokenBridge id="e1" t={t} />
      <Txt x={960} y={170} text="CẦU SẮT BỊ PHÁ SẬP" size={84} o={ramp(s, 0.2, 0.5)} />
      <Txt x={960} y={250} text="SÔNG THẠCH HÃN" size={46} color="#E2B95A" o={ramp(s, 0.5, 0.8)} />
      <Dim o={0.25 * (1 - ramp(s, 0, 0.5))} />
    </g>
  );
};

// ---------- E2: every soldier, shell and handful of rice must cross: three boats, three loads ----------
const Load: React.FC<{ kind: 'man' | 'ammo' | 'rice'; x: number; y: number }> = ({ kind, x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={30} fill="#15181F" fillOpacity={0.92} stroke="#E2B95A" strokeWidth={3.5} />
    {kind === 'man' && <SoldierIcon x={0} y={-2} s={0.95} />}
    {kind === 'ammo' && [-11, 0, 11].map((dx) => <g key={dx}><rect x={dx - 4.5} y={-4} width={9} height={22} rx={2} fill="#D8A93A" stroke="#141414" strokeWidth={2.4} /><path d={`M${dx - 4.5},-4 Q${dx},-20 ${dx + 4.5},-4 Z`} fill="#B5651D" stroke="#141414" strokeWidth={2.4} /></g>)}
    {kind === 'rice' && <g stroke="#141414" strokeWidth={2.6} strokeLinejoin="round"><path d="M-17,16 Q-22,-6 -9,-14 L9,-14 Q22,-6 17,16 Q0,22 -17,16 Z" fill="#E8DCC0" /><path d="M-9,-14 L-6,-20 L6,-20 L9,-14" fill="#C9B88C" /></g>}
  </g>
);

export const E2: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = planCam([-340, 10, 1.55], [-340, 10, 1.72], s, 4.3), { a, b } = crossLine(cam);
  const loads: { kind: 'man' | 'ammo' | 'rice'; word: string; at: number }[] = [
    { kind: 'man', word: 'NGƯỜI LÍNH', at: 0.2 }, { kind: 'ammo', word: 'VIÊN ĐẠN', at: 1.1 }, { kind: 'rice', word: 'NẮM GẠO', at: 2.0 },
  ];
  return (
    <g>
      <NightPlan id="e2" cam={cam} t={t} />
      {loads.map((l, i) => {
        const u = easeOut(ramp(s, l.at, l.at + 2.2)), off = (i - 1) * 118;
        const px = lerp(a[0], b[0], u), py = lerp(a[1], b[1], u) + off + Math.sin(u * Math.PI) * 24;
        return (
          <g key={i}>
            {u > 0 && u < 1 && <WaterRipples t={t} t0={t - 8} x={px} y={py} r={46} n={2} life={40} />}
            <Boat x={px} y={py} heading={0} size={78} t={t} crew={l.kind === 'man' ? 3 : 1} wake={u > 0 && u < 1} ph={i * 7} />
            {s >= l.at && <Load kind={l.kind} x={px} y={py - 58} />}
          </g>
        );
      })}
      {loads.map((l, i) => <Pop key={l.word} s={s} at={l.at} x={230} y={170 + i * 84}>
        <Load kind={l.kind} x={110} y={170 + i * 84} /><Txt x={160} y={184 + i * 84} text={l.word} size={46} anchor="start" />
      </Pop>)}
      <Flare t={t} t0={20} x={b[0] + 80} y={b[1] - 360} r={150} life={140} />
      <MonsoonRain t={t} intensity={0.45} angle={12} dim={0.1} />
    </g>
  );
};

// ---------- E3: "những bến như bến Vượt": a pin drops on the river bank while dusk turns to night ----------
export const E3: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = planCam([-420, -10, 1.0], [-420, -10, 1.15], s, 2.7), night = 0.25 + 0.65 * ramp(s, 0.4, 2.4);
  const [px, py] = localToScreen(cam, -425, -70), k = easeOut(ramp(s, 0.2, 0.6)), pulse = (s * 1.2) % 1;
  return (
    <g>
      <NightPlan id="e3" cam={cam} t={t} night={night} fires={0.2 + 0.3 * night} />
      <circle cx={px} cy={py} r={20 + pulse * 90} fill="none" stroke="#FF5A5F" strokeWidth={5} opacity={(1 - pulse) * k} />
      <g transform={`translate(${px},${py - (1 - k) * 160})`} opacity={k}>
        <path d="M0,0 C-40,-52 -34,-96 0,-96 C34,-96 40,-52 0,0 Z" fill="#E0483C" stroke="#141414" strokeWidth={5} transform="translate(0,-4)" />
        <circle cx={0} cy={-62} r={12} fill="#FFF3DC" />
      </g>
      <Txt x={px} y={py - 150} text="BẾN VƯỢT" size={74} o={ramp(s, 0.4, 0.7)} />
      <Dim o={0.25 * ramp(s, 1.4, 2.6)} />
    </g>
  );
};

// ---------- E4: "bằng thuyền nhỏ, bằng bè" ----------
export const E4: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = planCam([-340, 10, 1.7], [-340, 10, 1.85], s, 1.9), { a, b } = crossLine(cam);
  const a1: [number, number] = [a[0], a[1] - 130], b1: [number, number] = [b[0], b[1] - 130], a2: [number, number] = [a[0], a[1] + 140], b2: [number, number] = [b[0], b[1] + 140];
  return (
    <g>
      <NightPlan id="e4" cam={cam} t={t} />
      <RiverCrossing id="e4a" t={t} t0={0} t1={50} from={a1} to={b1} n={2} size={72} spacing={80} drift={30} splashes={0} />
      <RiverCrossing id="e4b" t={t} t0={14} t1={64} from={a2} to={b2} n={2} size={64} spacing={86} drift={30} raft splashes={0} />
      <Txt x={470} y={a1[1] - 70} text="THUYỀN NHỎ" size={60} o={ramp(s, 0.05, 0.3)} />
      <Txt x={470} y={a2[1] + 120} text="BÈ" size={60} o={ramp(s, 0.5, 0.75)} />
      <Flare t={t} t0={6} x={b[0] + 60} y={b[1] - 340} r={140} life={120} />
    </g>
  );
};

// ---------- E5: "có khi bơi qua dòng nước xiết": strong current, a few tiny heads with ripples (no detail) ----------
export const E5: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = planCam([-340, 10, 1.9], [-340, 10, 2.0], s, 1.5), { a, b } = crossLine(cam);
  return (
    <g>
      <NightPlan id="e5" cam={cam} t={t} />
      <g fill="none" stroke="#CFE6FA" strokeLinecap="round" opacity={0.55}>
        {Array.from({ length: 18 }, (_, i) => {
          const y = 120 + hash(i, 1) * 840, x = ((hash(i, 2) * 2400 + t * (16 + 12 * hash(i, 3))) % 2400) - 240, L = 120 + hash(i, 4) * 160;
          return <path key={i} d={`M${x},${y} q${L * 0.3},-14 ${L * 0.5},0 t${L * 0.5},0`} strokeWidth={3} opacity={0.4 + 0.5 * hash(i, 5)} />;
        })}
      </g>
      {[0, 1, 2].map((i) => {
        const u = clamp((s - i * 0.12) / 1.5), x = lerp(a[0], b[0], u) + Math.sin(s * 3 + i) * 5, y = lerp(a[1], b[1], u) + (i - 1) * 100 + u * 55;
        return <g key={i}><WaterRipples t={t} t0={t - 6} x={x} y={y} r={34} n={2} life={36} /><circle cx={x} cy={y} r={11} fill="#5C6A3A" stroke="#141414" strokeWidth={3} /><circle cx={x - 3} cy={y - 3} r={4} fill="#97A55C" /></g>;
      })}
      <Txt x={960} y={170} text="NƯỚC XIẾT" size={84} color="#CFE6FA" o={ramp(s, 0.05, 0.3)} />
    </g>
  );
};

// ---------- E6: "giữa ánh pháo sáng": flares light the crossing ----------
export const E6: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = planCam([-340, 10, 1.4], [-340, 10, 1.5], s, 1.6), { a, b } = crossLine(cam);
  return (
    <g>
      <NightPlan id="e6" cam={cam} t={t} night={0.92} />
      <RiverCrossing id="e6" t={t} t0={0} t1={46} from={a} to={b} n={4} size={62} spacing={90} drift={36} splashes={0}
        flares={[{ t0: 2, x: a[0] + 150, y: a[1] - 360 }, { t0: 14, x: b[0] - 80, y: b[1] - 420 }]} />
      <Glow x={(a[0] + b[0]) / 2} y={(a[1] + b[1]) / 2 - 100} r={520} color="#FFD98A" o={0.18 * ramp(s, 0.1, 0.5)} />
      <Txt x={960} y={130} text="ÁNH PHÁO SÁNG" size={78} color="#FFE7A8" o={ramp(s, 0.05, 0.3)} />
    </g>
  );
};

// ---------- E7: "những cột nước tung lên vì đạn pháo" ----------
export const E7: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = planCam([-340, 10, 1.45], [-340, 10, 1.55], s, 1.9), { a, b } = crossLine(cam);
  const m: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return (
    <g>
      <NightPlan id="e7" cam={cam} t={t} night={0.92} />
      <RiverCrossing id="e7" t={t - 10} t0={0} t1={70} from={a} to={b} n={3} size={62} spacing={96} drift={30} splashes={0} />
      <ShellBarrage id="e7s" t={t} t0={2} from={[2100, 60]} to={[m[0] - 20, m[1] - 40]} n={7} span={30} spread={[190, 120]} dur={26} lift={190} water r={38} />
      <WaterSplash t={t} t0={30} x={m[0] - 110} y={m[1] + 90} r={44} />
      <Txt x={960} y={140} text="CỘT NƯỚC TUNG LÊN" size={78} o={ramp(s, 0.05, 0.3)} />
    </g>
  );
};
