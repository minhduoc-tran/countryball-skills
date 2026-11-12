import React from 'react';
import { Schematic, SCH, SchLabel, CountUp, Arrow, Sparkle, Glow, kf, clamp, easeOut, backOut, camT, ShotProps } from '../../engine';
import { SunIcon, EarthIcon, WarningIcon, CrossOut, LightPacket } from './cha-sun-props';
import { ClockIcon, BigNum } from '../nghin-dong-moi-giay/chb-math-icons';

// Chapter A schematics (blueprint ground): the rule (A10-A13), the light delay (A16-A18) and the gravity delay
// (A20-A23). One idea per shot; everything is a pure function of the shot clock t.

// ---------- A10: "No explosion": a Sun icon with a BOOM? burst, crossed out ----------
const Burst: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  const k = easeOut(clamp(t / 8));
  const pts = Array.from({ length: 24 }).map((_, i) => {
    const a = (i / 24) * Math.PI * 2;
    const r = (i % 2 ? 190 : 270) * k;
    return `${x + Math.cos(a) * r},${y + Math.sin(a) * r}`;
  });
  return <polygon points={pts.join(' ')} fill="none" stroke={SCH.dim} strokeWidth={5} strokeLinejoin="round" strokeDasharray="14 10" />;
};
export const A10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Schematic t={t} id="a10" />
    <Burst x={960} y={560} t={t} />
    <SunIcon x={960} y={560} r={105} t={t} />
    <SchLabel x={960} y={240} t={t - 3} text="BOOM?" size={130} color={SCH.live} />
    <CrossOut x={960} y={540} h={250} t={t - 22} dur={9} />
  </g>
);

// ---------- A11: "No warning": a warning sign, crossed out ----------
export const A11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Schematic t={t + 50} id="a11" />
    <WarningIcon x={960} y={560} s={1.5 * backOut(clamp(t / 7))} t={t} />
    <CrossOut x={960} y={540} h={250} t={t - 18} dur={9} />
  </g>
);

// ---------- A12: "One moment it's there": the Sun icon, steady and bright ----------
export const A12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.18]]))}>
    <Schematic t={t + 90} id="a12" />
    <Glow x={960} y={540} r={520} o={0.3} />
    <SunIcon x={960} y={540} r={125} t={t} on={backOut(clamp(t / 7))} />
    <SchLabel x={960} y={300} t={t - 8} text="NOW" size={84} color={SCH.line} />
  </g>
);

// ---------- A13: "and the next, it simply isn't": the Sun icon pops out, an empty dashed circle stays ----------
export const A13: React.FC<ShotProps> = ({ t, len }) => {
  const gone = t >= 30;
  const squash = t < 30 ? 1 + 0.06 * Math.sin(t / 3) : 0;
  const ring = clamp((t - 30) / 22);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.12], [len, 1.0]]))}>
      <Schematic t={t + 130} id="a13" />
      {!gone ? <SunIcon x={960} y={540} r={125} t={t} on={squash} /> : null}
      {gone ? <SunIcon x={960} y={540} r={125} t={t} dashed on={clamp((t - 30) / 6)} /> : null}
      {gone ? <circle cx={960} cy={540} r={125 + 100 * easeOut(ring)} fill="none" stroke={SCH.dim} strokeWidth={4} opacity={0.5 * (1 - ring)} /> : null}
      <SchLabel x={960} y={820} t={t - 38} text="GONE" size={84} color={SCH.dim} />
    </g>
  );
};

// ---------- A16-A18: light still on its way ----------
const SUN_X = 330;
const EARTH_X = 1590;
const ROW = 540;
const FRONT0 = 480;
const FRONT1 = 1500;
const packetX = (tt: number) => FRONT0 + ((FRONT1 - FRONT0) * clamp(tt / 113));
const Delay: React.FC<{ t: number; id: string; show?: number }> = ({ t, id, show = 0 }) => (
  <g>
    <Schematic t={t + 40} id={id} />
    <SunIcon x={SUN_X} y={ROW} r={105} t={t} dashed />
    <EarthIcon x={EARTH_X} y={ROW} r={85} />
    <Arrow x0={FRONT0 - 10} y0={ROW + 150} x1={EARTH_X - 120} y1={ROW + 150} t={show} dur={14} color={SCH.dim} bend={0} />
    <LightPacket x={packetX(t + show * 0)} y={ROW} t={t} />
  </g>
);
export const A16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 940]]), 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <Delay t={t} id="a16" show={t - 4} />
    <SchLabel x={960} y={250} t={t - 6} text="8 min 20 s" size={110} color={SCH.live} />
  </g>
);
export const A17: React.FC<ShotProps> = ({ t, len }) => {
  const tt = t + 57;
  const hit = clamp((t - 56) / 20);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 1000]]), 540, kf(t, [[0, 1.08], [len, 1.0]]))}>
      <Schematic t={tt + 40} id="a17" />
      <SunIcon x={SUN_X} y={ROW} r={105} t={tt} dashed />
      <EarthIcon x={EARTH_X} y={ROW} r={85} />
      <Arrow x0={FRONT0 - 10} y0={ROW + 150} x1={EARTH_X - 120} y1={ROW + 150} t={30} dur={2} color={SCH.dim} bend={0} />
      {t < 58 ? <LightPacket x={packetX(tt)} y={ROW} t={tt} /> : null}
      <Glow x={EARTH_X - 70} y={ROW} r={200 * easeOut(hit)} o={0.7 * (1 - hit)} />
      <Sparkle x={EARTH_X - 90} y={ROW} t={t - 56} s={2} />
      <CountUp x={960} y={ROW + 270} t={t - 4} to={150000000} dur={52} size={86} suffix=" km" />
      <SchLabel x={960} y={250} t={0} text="8 min 20 s" size={110} color={SCH.live} />
    </g>
  );
};
// ---------- A18: close on Earth, old sunlight still arriving ----------
export const A18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1560], [len, 1600]]), 540, kf(t, [[0, 2.0], [len, 2.3]]))}>
    <Schematic t={t + 90} id="a18" />
    {Array.from({ length: 14 }).map((_, i) => {
      const lane = (i % 7) - 3;
      const x = 1000 + ((t * 16 + i * 71) % 480);
      return <path key={i} d={`M ${x - 70} ${ROW + lane * 34} L ${x} ${ROW + lane * 34}`} stroke={i % 2 ? '#FFE9A8' : SCH.glow} strokeWidth={6} strokeLinecap="round" opacity={0.85} />;
    })}
    <EarthIcon x={EARTH_X} y={ROW} r={85} />
    <Glow x={EARTH_X - 80} y={ROW} r={220} o={0.35 + Math.sin(t / 5) * 0.05} />
    <SchLabel x={1500} y={ROW - 200} t={t - 6} text="STILL ARRIVING" size={44} color={SCH.line} />
  </g>
);

// ---------- A20-A23: gravity, the orbit ----------
const OC = { x: 960, y: 560, rx: 560, ry: 330 };
const earthAt = (deg: number) => ({ x: OC.x + Math.cos((deg * Math.PI) / 180) * OC.rx, y: OC.y + Math.sin((deg * Math.PI) / 180) * OC.ry });
const Orbit: React.FC<{ t: number; id: string; tt: number; deg: number; ripples?: boolean }> = ({ t, id, tt, deg, ripples = true }) => {
  const e = earthAt(deg);
  const front = (i: number) => Math.max(0, (tt - 14 - i * 16) * 4.2);
  const arrive = clamp((tt - 147) / 14);
  return (
    <g>
      <Schematic t={t + 70} id={id} />
      <ellipse cx={OC.x} cy={OC.y} rx={OC.rx} ry={OC.ry} fill="none" stroke={SCH.dim} strokeWidth={4} strokeDasharray="4 12" />
      <SunIcon x={OC.x} y={OC.y} r={70} t={t} dashed />
      {ripples
        ? [0, 1, 2].map((i) => {
            const r = front(i);
            return r > 0 ? <ellipse key={i} cx={OC.x} cy={OC.y} rx={r} ry={r * (OC.ry / OC.rx)} fill="none" stroke={SCH.live} strokeWidth={6} opacity={clamp(1 - r / 900) * (1 - 0.3 * i)} /> : null;
          })
        : null}
      <g transform={`translate(${e.x} ${e.y}) scale(${1 + 0.18 * Math.sin(arrive * Math.PI)}) translate(${-e.x} ${-e.y})`}>
        <EarthIcon x={e.x} y={e.y} r={58} lit={e.x > OC.x ? 180 : 0} />
      </g>
    </g>
  );
};
export const A20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Orbit t={t} id="a20" tt={t} deg={-28 + t * 0.2} />
    <SchLabel x={960} y={150} t={t - 4} text="GRAVITY" size={90} color={SCH.line} />
  </g>
);
export const A21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.1], [len, 1.0]]))}>
    <Orbit t={t + 66} id="a21" tt={t + 66} deg={-28 + (t + 66) * 0.2} />
    <SchLabel x={960} y={150} t={t - 40} text="SPEED OF LIGHT" size={70} color={SCH.live} />
  </g>
);
export const A22: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <Schematic t={t + 20} id="a22" />
    <ClockIcon x={620} y={540} r={170} t={t} turns={0.6} dur={len} glow />
    <BigNum x={1230} y={600} text="8 MIN" size={150} pop={t / 6} />
  </g>
);
export const A23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <Orbit t={t + 20} id="a23" tt={0} deg={-28 + t * 3.1} ripples={false} />
    <SchLabel x={960} y={OC.y + 130} t={t - 20} text="NO SUN" size={44} color={SCH.dim} />
  </g>
);
