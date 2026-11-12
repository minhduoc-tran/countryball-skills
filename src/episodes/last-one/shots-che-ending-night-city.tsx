import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, LEG_LEN, Glow, Cat, Dust, Schematic, SCH, SchLabel, WallTexture, rnd, FONT, ShotProps,
} from '../../engine';
import { InsertArm, PersonIcon } from './insert-arm-and-icons';
import { Candle, NightRoof, WindStreaks } from './che-night-props';
import { CROWD, KEEP } from './shots-che-button-choice';

// Chapter E, "ending": night after night with the cat. The roof wide (E16), the tally on the wall (E24), Pip and the
// cat on the parapet (E25, E26), the last count on the schematic (E27), his torch finding nothing (E28-E30).

const PIP = LOOKS.pipHood;
const PARAPET = 790;

/** The cat on the roof, scaled about its feet; `mood` and the clock as the engine's Cat takes them. */
export const RoofCat: React.FC<{ x: number; y: number; s?: number; mood: 'sleep' | 'alert' | 'peek'; f: number }> = ({ x, y, s = 1, mood, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Cat x={0} y={0} mood={mood} f={f} />
  </g>
);

/** Pip sitting on the parapet in profile facing left (toward the cat), hips on its top edge. */
export const parapetSit = (x: number, sc: number, extra: Partial<Pose> = {}): Pose => ({
  ...basePose, x, y: PARAPET - 6, scale: sc, yaw: -0.95, facing: -1, tilt: 3,
  legL: { a: 86, b: -84 }, legR: { a: 90, b: -80 }, armL: { a: 18, b: 24 }, armR: { a: 12, b: 20 }, handL: 'open', ...extra,
});

// ---------- E16: wide, night: Pip alone on the dark roof, the city black round him, the cat at his feet ----------
export const E16: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 800, y: 842 - LEG_LEN * 0.9, scale: 0.9, yaw: 0.4, look: 0.7, armL: { a: 10, b: 6 }, armR: { a: 10, b: 6 }, sway: 5 } },
    { f: 28, p: { yaw: -0.3, look: -0.8 }, ease: easeOut },
    { f: 60, p: { yaw: 0.2, look: 0.3 } },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <NightRoof t={t + 100} low={30} />
      <RoofCat x={1010} y={856} s={0.8} mood="sleep" f={t} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [30, 'worried']]) }} rimId="rimBlue" shadow={0.5} />
      <WindStreaks t={t} n={10} o={0.18} />
    </g>
  );
};

// ---------- E24: "Đêm thứ một trăm": the tally on the wall: gates of five, 99 scratched, the hundredth drawn, 100 ----------
const TALLY = Array.from({ length: 20 }).map((_, k) => ({ x: 300 + (k % 5) * 200, y: 250 + Math.floor(k / 5) * 170 }));
export const E24: React.FC<ShotProps> = ({ t, len }) => {
  const stroke = (d: string, p: number, key: string, w = 9) => (
    <path key={key} d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(p)} stroke="#E8DFC8" strokeWidth={w} strokeLinecap="round" fill="none" opacity={0.92} />
  );
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.1]])}) translate(-960 -540)`}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#2A2742" />
      <WallTexture rect={[-200, -200, 2400, 1500]} />
      <rect x={-200} y={980} width={2400} height={200} fill="#1E1A2C" />
      {TALLY.map((g, k) => {
        const last = k === 19;
        const base = last ? 15 : k * 0.7;
        return (
          <g key={k} transform={`translate(${g.x} ${g.y}) rotate(${(rnd(5, k) - 0.5) * 3})`}>
            {[0, 1, 2, 3].map((i) => stroke(`M ${i * 30} 0 L ${i * 30 + (rnd(6, k * 5 + i) - 0.5) * 6} 110`, (t - base - (last ? i * 2 : 0)) / (last ? 3 : 3), `v${i}`))}
            {stroke('M -14 88 L 112 20', (t - base - (last ? 8 : 0)) / (last ? 6 : 3), 'd')}
          </g>
        );
      })}
      {t >= 22 ? (
        <g transform={`translate(1500 880) scale(${1 + 0.18 * Math.max(0, 1 - (t - 22) / 5)})`}>
          <text textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={200} fill="#F2B8A0" stroke="#3A1218" strokeWidth={10} paintOrder="stroke">100</text>
          <path d="M -190 -170 Q -20 -240 180 -170 Q 230 -60 150 30 Q -20 70 -180 20 Q -240 -70 -190 -170 Z" stroke="#E0463E" strokeWidth={10} fill="none" strokeLinecap="round" opacity={clamp((t - 24) / 3)} />
        </g>
      ) : null}
      <Candle x={170} y={1000} s={1.7} t={t + 12} />
      <Dust t={t} seed={12} x0={100} y0={400} w={900} h={600} n={20} o={0.5} />
    </g>
  );
};

// ---------- E25: medium: Pip sits on the parapet in profile, the cat asleep beside him, the dark city behind ----------
export const E25: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...parapetSit(1030, 1.35), look: -0.4, headTilt: -2 } },
    { f: 34, p: { headTilt: 2, look: -0.7 } },
    { f: 64, p: { headTilt: -1 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 920]]), kf(t, [[0, 600], [len, 590]]), kf(t, [[0, 1.5], [len, 1.66]]))}>
      <NightRoof t={t + 160} low={0} />
      <RoofCat x={720} y={PARAPET + 2} s={1.1} mood="sleep" f={t} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired']]) }} rimId="rimBlue" shadow={0} />
      <WindStreaks t={t} n={6} o={0.15} />
    </g>
  );
};

// ---------- E26: wide: the whole city is black; Pip and the cat tiny on the parapet; the last windows die ----------
export const E26: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 500], [len, 520]]), kf(t, [[0, 0.96], [len, 0.86]]))}>
    <NightRoof t={t + 200} low={-20} black={kf(t, [[0, 0.5], [18, 1]])} />
    <RoofCat x={870} y={PARAPET + 2} s={0.5} mood="sleep" f={t} />
    <Hero look={PIP} pose={{ ...parapetSit(950, 0.7), look: -0.4, ...faceAt(t, [[0, 'tired']]) }} rimId="rimBlue" shadow={0} />
  </g>
);

// ---------- E27: schematic: 8.200.000.000 people dim on the grid, then they go out one by one; 1 is left, lit ----------
const dotted = (v: number) => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const E27: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp((t - 30) / 32);
  const left = p >= 1 ? 1 : Math.max(1, 8.2e9 * (1 - p * p * p));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
      <Schematic t={t + 70} id="e27sch" />
      <SchLabel x={960} y={190} t={t - 2} text="DÂN SỐ THẾ GIỚI" size={50} />
      {CROWD.map((c, i) => {
        if (i === KEEP) return <PersonIcon key={i} x={c.x} y={c.y} s={1 + 0.3 * easeOut(clamp((t - 58) / 8))} on={t > 58} glow={t > 58} />;
        const out = 30 + ((c.at - 12) / 44) * 22;
        const k = t - out;
        if (k > 4) return null;
        return <PersonIcon key={i} x={c.x} y={c.y} s={k > 0 ? 1 + k * 0.1 : 1} o={k > 0 ? 1 - k / 4 : 1} />;
      })}
      <text x={960} y={920} textAnchor="middle" fontFamily={FONT.ui} fontSize={100} fill={left <= 1 ? SCH.live : SCH.line} style={{ filter: `drop-shadow(0 0 14px ${SCH.glow}66)` }}>
        {dotted(left)}
      </text>
      <SchLabel x={960} y={1000} t={t - 4} text="NGƯỜI" size={36} color={SCH.dim} />
    </g>
  );
};

/** His torch seen from his side: a mitten at the bottom holding a torch that points up-right; `aim` is where the beam lands. */
const TorchPov: React.FC<{ t: number; aim: { x: number; y: number }; on?: number }> = ({ t, aim, on = 1 }) => {
  const o = { x: 1010, y: 1010 };
  const a = (Math.atan2(aim.y - o.y, aim.x - o.x) * 180) / Math.PI;
  const head = { x: o.x + 186 * Math.cos((a * Math.PI) / 180), y: o.y + 186 * Math.sin((a * Math.PI) / 180) };
  return (
    <g>
      <path d={`M ${head.x - 20} ${head.y + 10} L ${aim.x - 360} ${aim.y - 220} L ${aim.x + 380} ${aim.y + 240} L ${head.x + 20} ${head.y - 10} Z`} fill="url(#g3cone)" opacity={0.65 * on} style={{ mixBlendMode: 'screen' }} />
      <Glow x={aim.x} y={aim.y} r={320} o={0.35 * on} />
      <g transform={`translate(${o.x} ${o.y}) rotate(${a + 90})`}>
        <rect x={-34} y={-150} width={68} height={190} rx={14} fill="#2A2C3A" stroke="#14121C" strokeWidth={6} />
        <rect x={-42} y={-186} width={84} height={44} rx={10} fill="#3A3C4C" stroke="#14121C" strokeWidth={6} />
        <ellipse cx={0} cy={-186} rx={34} ry={9} fill={on > 0 ? '#FFF0C8' : '#6A6A70'} />
      </g>
      <InsertArm x={o.x - 6} y={o.y + 30} fx={o.x + 160} fy={1260} rot={4} s={3.6} width={110} fist />
    </g>
  );
};

// ---------- E28: POV: a slow pan across the dark city, his torch beam sweeping over rooftops: no lit window ----------
export const E28: React.FC<ShotProps> = ({ t, len }) => {
  const aim = { x: kf(t, [[0, 640], [len, 1360]]), y: kf(t, [[0, 600], [len / 2, 540], [len, 590]]) };
  return (
    <g>
      <g transform={camT(kf(t, [[0, 700], [len, 1220]]), 520, 1.3)}>
        <NightRoof t={t + 260} low={20} />
      </g>
      <TorchPov t={t} aim={aim} />
      <Dust t={t} seed={14} x0={aim.x - 400} y0={aim.y - 300} w={800} h={600} n={30} o={0.4} />
    </g>
  );
};

// ---------- E29: an ember far off flickers, then dies; later a glint that is only the moon on glass ----------
export const E29: React.FC<ShotProps> = ({ t, len }) => {
  const spot = { x: 1180, y: 600 };
  const ember = t >= 5 && t < 28 ? (0.55 + 0.45 * Math.sin(t * 1.9)) * (t > 22 ? 1 - (t - 22) / 6 : 1) * clamp((t - 5) / 4) : 0;
  const glint = t >= 32 && t < 44 ? Math.sin(((t - 32) / 12) * Math.PI) : 0;
  return (
    <g transform={camT(kf(t, [[0, 1060], [len, 1200]]), kf(t, [[0, 540], [len, 590]]), kf(t, [[0, 1.5], [len, 2.1]]))}>
      <NightRoof t={t + 300} low={20} />
      {ember > 0 ? (
        <g>
          <Glow x={spot.x} y={spot.y} r={130 + 50 * ember} o={ember} />
          <circle cx={spot.x} cy={spot.y} r={6 + 4 * ember} fill="#FFE0A0" opacity={ember} />
        </g>
      ) : null}
      {glint > 0 ? (
        <g transform={`translate(1450 560) scale(${glint})`}>
          <path d="M 0 -26 L 5 -5 L 26 0 L 5 5 L 0 26 L -5 5 L -26 0 L -5 -5 Z" fill="#E6F0FF" />
        </g>
      ) : null}
    </g>
  );
};

// ---------- E30: "chỉ có bóng tối, và tiếng gió": Pip and the cat tiny under the moon, wind in the hood, the dark closing ----------
export const E30: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, kf(t, [[0, 560], [len, 500]]), kf(t, [[0, 1.2], [len, 0.9]]))}>
      <NightRoof t={t + 360} low={0} dim={0.78} />
      <RoofCat x={890} y={PARAPET + 2} s={0.7} mood="sleep" f={t} />
      <Hero look={PIP} pose={{ ...parapetSit(980, 1.0), sway: 14 + Math.sin(t / 5) * 6, look: -0.5, ...faceAt(t, [[0, 'tired']]) }} rimId="rimBlue" shadow={0} />
    </g>
    <WindStreaks t={t} n={22} o={0.3} />
    <rect x={0} y={0} width={1920} height={1080} fill="#02030A" opacity={0.25 * clamp(t / len)} />
  </g>
);
