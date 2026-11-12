import React from 'react';
import { ShotProps, Hero, LOOKS, poseAt, camT, kf, clamp, easeIn, rnd } from '../../engine';
import { SpeedLines, ImpactFlash, Shockwave, Debris, DustCloud, BoomWord, shakeAt } from './punch-fx-kit';
import { PunchPip, FistInsert } from './punch-pip-and-fist';
import { ArcadeBg, ArcadeFront, BoxingMachine, LedDisplay, SideWall } from './chb-arcade-props';
import { FLOOR, BaseStub, HW, PIP_OPTS, WALL_X0, WALL_X1, flight, machineFor } from './chb-arcade-scene';

// Chapter B, arcade part 2: B8-B13 (49.84-56.20 s). The fist, the hit (Bùm on frame 3 of B9), the machine through the wall, 9999, silence.

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const B9_HIT = 3;

// ---------- B8: insert, the fist clenches and thrusts at the lens (cut right before the hit) ----------
export const B8: React.FC<ShotProps> = ({ t }) => (
  <g>
    <FistInsert t={t} id="b8" clenchAt={0} thrustAt={27} />
    <SpeedLines t={t} cx={960} cy={560} o={clamp((t - 6) / 20) * 0.7} rIn={520} n={44} color="#FFF3C4" />
  </g>
);

// ---------- B9: THE HIT. The machine tears off its base and rockets to the wall ----------
export const B9: React.FC<ShotProps> = ({ t }) => {
  const m = machineFor(PIP_OPTS, B9_HIT);
  const h = t - B9_HIT;
  const f = flight(h, m.x, m.s);
  const sk = shakeAt(t, B9_HIT, 26, 14);
  const wallHit = B9_HIT + HW;
  const sk2 = shakeAt(t, wallHit, 22, 8);
  const cx = kf(t, [[0, 1000], [B9_HIT + 8, 1060], [23, 1260]]);
  const hole = clamp((h - HW) / 6);
  return (
    <g transform={`translate(${sk.x + sk2.x} ${sk.y + sk2.y})`}>
      <g transform={camT(cx, 560, kf(t, [[0, 1.12], [B9_HIT, 1.2], [23, 1.1]]))}>
        <ArcadeBg t={t + 190} id="b9" />
        <SideWall x0={WALL_X0} x1={WALL_X1} hole={hole} id="b9w" />
        <BaseStub x={m.x} y={FLOOR} s={m.s} t={t} hitT={B9_HIT} />
        <BoxingMachine x={m.x + f.dx} y={FLOOR + f.dy} s={m.s} rot={f.rot} t={t} text={h >= 0 ? '9999' : '000'} padPush={h < 0 ? 0 : 1} shadow={h < 0} />
        <Shockwave t={t} hitT={B9_HIT} x={m.fist.x + 20} y={m.fist.y} kind="air" r={700} />
        <Shockwave t={t} hitT={B9_HIT} x={m.x} y={FLOOR} kind="ground" r={800} />
        <DustCloud t={t} hitT={B9_HIT} x={m.x} y={FLOOR} r={110} color="#6E5A96" />
        <PunchPip t={t} hitT={B9_HIT} {...PIP_OPTS} rimId="rimL" />
        <Debris t={t} hitT={B9_HIT} x={m.x - 140 * m.s} y={m.fist.y} n={28} power={1.2} dir={-60} cone={220} groundY={FLOOR - 4} colors={['#273B8A', '#E5322D', '#8A91B8', '#FFD23F']} />
        <SpeedLines t={t} cx={m.fist.x} cy={m.fist.y} o={t >= B9_HIT && t < B9_HIT + 8 ? 0.75 : 0} rIn={260} />
        <ImpactFlash t={t} hitT={B9_HIT} x={m.fist.x + 30} y={m.fist.y} r={760} />
        <BoomWord t={t} at={B9_HIT + 3} x={m.fist.x - 40} y={m.fist.y - 330} size={170} />
        <ImpactFlash t={t} hitT={wallHit} x={WALL_X0} y={540} r={560} />
        <Debris t={t} hitT={wallHit} x={WALL_X0} y={540} n={26} power={1.1} dir={-150} cone={160} groundY={FLOOR - 4} colors={['#B2685A', '#7A3E34', '#D9A08F', '#9C9283']} />
      </g>
    </g>
  );
};

// ---------- B10: the wall bursts, the machine goes through (continues B9 at h = 20 + t) ----------
export const B10: React.FC<ShotProps> = ({ t }) => {
  const m = machineFor(PIP_OPTS, B9_HIT);
  const h = t + 20;
  const f = flight(h, m.x, m.s);
  const hole = clamp((h - HW) / 6);
  const hitT = HW - 20; // the wall hit, in this shot's clock (negative: already underway)
  const sk = shakeAt(t, 0, 16, 10);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(kf(t, [[0, 1680], [26, 1860]]), 540, kf(t, [[0, 1.45], [26, 1.3]]))}>
        <ArcadeBg t={t + 215} id="b10" />
        <SideWall x0={WALL_X0} x1={WALL_X1} hole={hole} id="b10w" />
        <BoxingMachine x={m.x + f.dx} y={FLOOR + f.dy} s={m.s} rot={f.rot} t={t} text="9999" padPush={1} shadow={false} />
        <DustCloud t={t} hitT={hitT} x={WALL_X0 + 40} y={FLOOR} r={170} len={60} color="#CDB9A0" seed={9} />
        <Debris t={t} hitT={hitT} x={WALL_X0 + 60} y={520} n={34} power={1.3} dir={-20} cone={300} groundY={FLOOR - 4} colors={['#B2685A', '#7A3E34', '#D9A08F', '#9C9283']} seed={21} />
        <SpeedLines t={t} cx={WALL_X0 + 80} cy={520} o={t < 6 ? 0.5 : 0} rIn={380} n={30} />
        <Shockwave t={t} hitT={hitT + 4} x={WALL_X0 + 80} y={520} kind="air" r={520} />
      </g>
    </g>
  );
};

// ---------- B11: outside: the machine bursts out of the wall towards camera, dust pours from the hole ----------
export const B11: React.FC<ShotProps> = ({ t }) => {
  const u = clamp(t / 24);
  const sc = 0.1 + 1.5 * easeIn(u);
  const px = 1560 - 1100 * easeIn(u) - 40 * u;
  const py = 470 - 360 * easeIn(u);
  const sk = shakeAt(t, 0, 20, 12);
  const hole = clamp(kf(t, [[0, 0.5], [6, 1]]));
  const ped = (x: number, look: typeof PIP) => (
    <Hero look={look} pose={poseAt(t, [{ f: 0, p: { x, y: 800, scale: 0.85, yaw: 0.2, facing: 1, expr: 'shock', armL: { a: 150, b: 20 }, armR: { a: 150, b: 20 } } }])} rimId="rimL" />
  );
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(1100, 520, 1.0)}>
        <ArcadeFront t={t} id="b11" hole={hole} doorGlow={0.6} />
        <DustCloud t={t} hitT={0} x={1560} y={600} r={190} len={60} color="#D9C8AE" seed={14} n={22} />
        <Debris t={t} hitT={0} x={1560} y={470} n={30} power={1.2} dir={-120} cone={320} groundY={880} colors={['#F0DDB8', '#B89A6A', '#9C9283', '#7A3E34']} seed={31} />
        {ped(720, LOOKS.mom)}
        {ped(1000, LOOKS.suit)}
        <BoxingMachine x={px} y={py + 390 * sc} s={sc} rot={-30 + 200 * u} t={t} text="9999" shadow={false} />
        <SpeedLines t={t} cx={1560} cy={470} o={0.55} rIn={140} rOut={900} n={32} />
      </g>
    </g>
  );
};

// ---------- B12: the display on the rubble: 9999, flickers, dies ----------
export const B12: React.FC<ShotProps> = ({ t }) => {
  const dieAt = 58;
  const flick = t > 40 && t < dieAt ? (Math.floor(t / 2) % 2 ? 0.25 : 1) : 1;
  const on = t >= dieAt ? 0 : t < 12 ? 0 : flick;
  const txt = t < 12 ? '' : t > 44 && t < dieAt && Math.floor(t / 3) % 3 === 1 ? '9 9 9' : '9999';
  const glitch = t > 40 && t < dieAt ? (rnd(4, t) - 0.5) * 14 : 0;
  return (
    <g transform={camT(960 + glitch, 540, kf(t, [[0, 1.0], [61, 1.12]]))}>
      <rect x={-300} y={-300} width={2600} height={1700} fill="#1A1228" />
      <rect x={-300} y={760} width={2600} height={500} fill="#2B2236" />
      <path d="M -300 760 H 2300" stroke="#0C0814" strokeWidth={8} />
      <g transform="rotate(-4 960 500)">
        <rect x={250} y={150} width={1420} height={600} rx={60} fill="#35439B" stroke="#150E1F" strokeWidth={14} />
        <path d="M 300 160 L 520 150 L 380 300 Z" fill="#FFFFFF" opacity={0.08} />
        <LedDisplay x={960} y={450} w={1180} h={400} text={txt} color="#FF4A3D" on={on} label="ĐIỂM" />
        <path d="M 1420 150 l 40 70 l -30 40 l 50 90" stroke="#150E1F" strokeWidth={9} fill="none" strokeLinejoin="round" />
        {on > 0 && t % 4 < 2 ? <circle cx={900} cy={450} r={460} fill="#FF4A3D" opacity={0.1} style={{ mixBlendMode: 'screen' }} /> : null}
      </g>
      {Array.from({ length: 5 }).map((_, i) => {
        const p = (t * 0.02 + i / 5) % 1;
        return <circle key={i} cx={420 + i * 280 + Math.sin(p * 6 + i) * 30} cy={420 - p * 420} r={30 + p * 50} fill="#8A82A0" opacity={0.35 * (1 - p)} />;
      })}
      {t > 30 && t < dieAt ? <polygon points={`1500,200 ${1530 + (t % 5) * 6},160 1520,200 1560,150`} fill="#FFE27A" opacity={t % 3 ? 0.9 : 0} /> : null}
    </g>
  );
};

// ---------- B13: Mo's face, jaw down, the hole's daylight behind; Pip behind him, sheepish ----------
export const B13: React.FC<ShotProps> = ({ t }) => {
  const mo = poseAt(t, [{ f: 0, p: { x: 700, y: 830, scale: 2.3, yaw: 0.35, facing: 1, expr: 'shock', look: 0.4, headTilt: 0 } }, { f: 22, p: { headTilt: -5, y: 840 } }]);
  const pip = poseAt(t, [{ f: 0, p: { x: 1250, y: 650, scale: 1.0, yaw: -0.5, facing: -1, expr: 'oops', armR: { a: 150, b: 40 }, armL: { a: 10, b: 10 } } }]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [22, 1.06]]))}>
      <ArcadeBg t={t + 230} id="b13" />
      <SideWall x0={1420} x1={1570} hole={1} id="b13w" cy={470} />
      <Hero look={PIP} pose={pip} rimId="rimL" />
      <Hero look={MO} pose={mo} rimId="rimL" shadow={0} />
    </g>
  );
};
