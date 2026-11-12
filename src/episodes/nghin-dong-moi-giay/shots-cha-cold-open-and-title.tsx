import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, backOut, rnd, camT, LOOKS, Glow, Dust, Street, streetStand, proj, ST, Motorbike,
  Rooftop, Bedroom, BedDuvet, bedSit, Tag, Sparkle, TitleCard, joints, toWorld, FONT, ShotProps,
} from '../../engine';
import { BanhMi, BanhMiCart, RedBow, HeldPhone } from './cha-street-props';
import { InsertArm } from '../last-one/insert-arm-and-icons';

// Chapter A, shots A1-A7: the cold open (three prices in the power's currency: a bánh mì, a night's sleep, a month)
// and the title card over the street at dusk. Fast: 0.9-1.7 s a shot, then the title holds.

const PIP = LOOKS.pipHood;

/** Cart size so it is ~1.7 m wide at depth Z. */
const cartScale = (Z: number) => (1.7 * ST.f) / Z / 300;

// ---------- A1: wide, the bánh mì cart on the street; Pip walks up and takes a loaf; tag "25.000 đ = 25 GIÂY" ----------
export const A1: React.FC<ShotProps> = ({ t, len }) => {
  const s = streetStand(-2.4, 5.6);
  const cart = proj(-3.7, 0, 6.0);
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: s.x + 70, y: s.y, scale: s.scale, yaw: -0.6, look: -0.8, armL: { a: 6, b: -4 }, armR: { a: 6, b: -4 } } },
    { f: 12, p: { x: s.x, armL: { a: 12, b: -4 } }, ease: easeOut },
    { f: 16, p: { armL: { a: 78, b: 14 } }, ease: easeOut },
    { f: 24, p: { armL: { a: 52, b: 40 } }, ease: easeOut },
  ]);
  const hand = toWorld(pose, joints(pose).armL.end);
  const loaf = t >= 20;
  return (
    <g>
      <g transform={camT(kf(t, [[0, 720], [len, 700]]), 600, kf(t, [[0, 2.2], [len, 2.45]]))}>
        <Street t={t + 30} id="sa1" market={0} />
        <BanhMiCart x={cart.x} y={cart.y} s={cartScale(6.0)} t={t} />
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
        {loaf ? <BanhMi x={hand.x + 6} y={hand.y - 6} s={0.2} rot={-70} /> : null}
      </g>
      <Tag x={960} y={230} t={t - 8} text="25.000 đ = 25 GIÂY" w={760} />
    </g>
  );
};

// ---------- A2: insert, the loaf huge in a hand; it is bitten, crumbs fly, the crunch ----------
export const A2: React.FC<ShotProps> = ({ t, len }) => {
  const bite = clamp((t - 22) / 3);
  const jolt = t >= 22 && t < 27 ? Math.sin(t * 3.3) * 7 * (1 - (t - 22) / 5) : 0;
  const push = kf(t, [[0, 1.0], [len, 1.12]]);
  return (
    <g transform={camT(960, 540, push)}>
      <g filter="url(#blur16)">
        <g transform="translate(960 470) scale(2.0) translate(-960 -470)">
          <Street t={t + 80} id="sa2" market={0} />
        </g>
      </g>
      <rect x={-300} y={-300} width={2520} height={1680} fill="#120A18" opacity={0.4} />
      <Glow x={1100} y={420} r={800} o={0.45} />
      <g transform={`translate(${940 + jolt} 560) rotate(-6)`}>
        <defs>
          <mask id="sa2mask" maskUnits="userSpaceOnUse" x={-700} y={-300} width={1400} height={600}>
            <rect x={-700} y={-300} width={1400} height={600} fill="#fff" />
            {[-70, 0, 70].map((k, i) => <circle key={i} cx={330 + (i === 1 ? -40 : 0)} cy={k} r={bite * (70 + (i === 1 ? 20 : 0))} fill="#000" />)}
          </mask>
        </defs>
        <g mask="url(#sa2mask)">
          <BanhMi x={0} y={0} s={3.0} />
        </g>
        {/* paper wrap under the hand */}
        <path d="M -150 40 L 150 40 L 170 150 L -170 150 Z" fill="#F2E6D0" stroke="#B8A888" strokeWidth={4} opacity={0.95} />
        {Array.from({ length: 14 }).map((_, i) => {
          const p = clamp((t - 23 - (i % 3)) / 14);
          return p > 0 && p < 1 ? <circle key={i} cx={320 + (rnd(7, i) - 0.3) * 260 * p} cy={(rnd(9, i) - 0.5) * 360 * p + 120 * p * p} r={7 + rnd(3, i) * 7} fill="#E8B45E" opacity={1 - p} /> : null;
        })}
      </g>
      <InsertArm x={880} y={700} fx={420} fy={1250} s={4.6} rot={-6} />
      <Dust t={t} seed={5} x0={300} y0={200} w={1300} h={700} n={18} o={0.4} />
    </g>
  );
};

// ---------- A3: medium, Pip asleep, propped up in bed, a Z drifting; the tag turns the night into money ----------
export const A3: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.2);
  const breathe = Math.sin(t / 7) * 1.4;
  const pose: Pose = { ...basePose, x: b.x, y: b.y + breathe, scale: b.scale, yaw: -0.4, look: 0, blink: 1, headTilt: 9, armL: { a: 8, b: -6 }, armR: { a: 14, b: -6 } };
  return (
    <g>
      <g transform={camT(kf(t, [[0, 780], [len, 750]]), kf(t, [[0, 520], [len, 505]]), kf(t, [[0, 1.8], [len, 2.1]]))}>
        <Bedroom t={t + 40} id="sa3" duvet={false} clock="23:00" lamp={0.5} crossed={0} />
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired']]), blink: 1 }} rimId="rimR" shadow={0} />
        <BedDuvet knees={1} />
        {[0, 1, 2].map((i) => {
          const p = ((t / 40 + i / 3) % 1);
          return <text key={i} x={b.x + 30 + p * 110 + i * 10} y={b.y - 215 - p * 40} fontFamily={FONT.hand} fontSize={34 + i * 12} fill="#CFE6FF" opacity={Math.sin(p * Math.PI) * 0.9}>Z</text>;
        })}
      </g>
      <Tag x={960} y={230} t={t - 22} text="8 TIẾNG = 28,8 TRIỆU" w={800} />
    </g>
  );
};

// ---------- A4: medium, the new motorbike with a red bow on its front: Pip beside it, arms up, a sparkle ----------
export const A4: React.FC<ShotProps> = ({ t, len }) => {
  const Z = 3.6;
  const g = proj(1.0, 0, Z);
  const sc = (ST.f / Z / 100) * 0.9;
  const s = streetStand(-0.55, Z);
  const pose = poseAt(t, [
    { f: 0, p: { x: s.x, y: s.y, scale: s.scale, yaw: 0.5, look: 0.7, armL: { a: 10, b: -4 }, armR: { a: 12, b: -4 } } },
    { f: 8, p: { armL: { a: 150, b: 10 }, armR: { a: 150, b: 10 } }, ease: easeOut },
    { f: 18, p: { armL: { a: 140, b: 0 }, armR: { a: 140, b: 0 } } },
  ]);
  const pop = backOut(clamp((t + 1) / 8));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 990]]), 640, kf(t, [[0, 1.75], [len, 1.95]]))}>
      <Street t={t + 90} id="sa4" />
      <Motorbike x={g.x} y={g.y} s={sc} facing={-1} color="#2FA595" lamp={1} t={t} />
      <RedBow x={g.x - 52 * sc} y={g.y - 118 * sc} s={sc * 0.9} pop={pop} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [8, 'happy']]) }} rimId="rimR" shadow={0} />
      <Sparkle x={g.x + 70 * sc} y={g.y - 150 * sc} t={t - 6} s={0.7} />
    </g>
  );
};

// ---------- A5: insert, a door with a number; a key turns in the lock and the door swings open on the lit flat ----------
export const A5: React.FC<ShotProps> = ({ t, len }) => {
  const turn = easeOut(clamp((t - 5) / 8));
  const open = easeOut(clamp((t - 14) / 12));
  const leaf = 1 - 0.8 * open;
  const lockX = 620 + 530 * leaf;
  return (
    <g>
      <rect width={1920} height={1080} fill="#14101E" />
      <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
        <rect x={-200} y={-200} width={2320} height={1480} fill="#1C1830" />
        {/* the lit flat behind the opening door: back wall, window light, floor, ceiling */}
        <rect x={620} y={80} width={680} height={940} fill="#E8B982" />
        <rect x={720} y={240} width={480} height={520} fill="#FFE9BC" />
        <rect x={800} y={290} width={320} height={300} fill="#FFF6DC" />
        <path d="M 620 1020 L 720 760 L 1200 760 L 1300 1020 Z" fill="#9A6E48" />
        <path d="M 620 80 L 720 240 L 1200 240 L 1300 80 Z" fill="#B88F62" />
        <path d="M 620 80 L 720 240 L 720 760 L 620 1020 Z" fill="#C99A68" />
        <Glow x={960} y={560} r={700} o={0.7 * open} />
        {/* the door leaf, hinged on the left, narrowing as it opens */}
        <g transform={`translate(620 0) scale(${leaf} 1)`}>
          <rect x={0} y={80} width={680} height={940} fill="#7A4A32" stroke="#2A1810" strokeWidth={8} />
          <rect x={50} y={130} width={580} height={360} fill="#8A5A40" stroke="#4A2A1C" strokeWidth={5} />
          <rect x={50} y={540} width={580} height={420} fill="#8A5A40" stroke="#4A2A1C" strokeWidth={5} />
          <rect x={500} y={430} width={60} height={120} rx={12} fill="#D9C58A" />
          <rect x={522} y={470} width={16} height={34} rx={8} fill="#2A1810" />
          <rect x={250} y={160} width={180} height={70} rx={10} fill="#E8D9A8" />
          <text x={340} y={212} textAnchor="middle" fontFamily={FONT.ui} fontSize={52} fontWeight={700} fill="#3A2A1C">1204</text>
        </g>
        {/* the key in the lock, turning with the hand */}
        <g transform={`translate(${lockX} 490) rotate(${turn * 90})`}>
          <rect x={-10} y={-14} width={150} height={28} rx={8} fill="#E4C25A" stroke="#6A5418" strokeWidth={4} />
          <circle cx={150} cy={0} r={34} fill="#E4C25A" stroke="#6A5418" strokeWidth={5} />
          <circle cx={150} cy={0} r={14} fill="#1C1830" />
        </g>
        <InsertArm x={lockX + 190} y={490} fx={1750} fy={900} s={4.0} rot={-80 + turn * 80} />
      </g>
      <Tag x={960} y={900} t={t - 4} text="1 THÁNG ≈ 2,6 TỶ" w={760} />
    </g>
  );
};

// ---------- A6: wide, the empty new flat: Pip at a big window over the dusk city ----------
export const A6: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: 920, y: 690, scale: 1.2, yaw: 0.8, look: 0.8, armL: { a: 8, b: -4 }, armR: { a: 10, b: -4 } } },
    { f: 30, p: { armR: { a: 60, b: 80 }, yaw: 0.7 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 960]]), kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.22]]))}>
      <Rooftop t={t + 20} sunX={1180} sunY={560} cityLit={1.6} />
      {/* the flat: walls, lintel, floor, window bars */}
      <rect x={-400} y={-300} width={780} height={1700} fill="#1E1A2C" />
      <rect x={1540} y={-300} width={780} height={1700} fill="#1E1A2C" />
      <rect x={-400} y={-300} width={2720} height={400} fill="#171424" />
      <path d="M -400 770 L 2320 770 L 2320 1400 L -400 1400 Z" fill="#3A2A30" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M ${-400 + i * 480} 770 L ${-1100 + i * 880} 1400`} stroke="#2A1C22" strokeWidth={4} />)}
      <rect x={380} y={100} width={1160} height={10} fill="#0E0C18" />
      <rect x={374} y={100} width={14} height={680} fill="#0E0C18" />
      <rect x={1534} y={100} width={14} height={680} fill="#0E0C18" />
      <rect x={950} y={100} width={12} height={680} fill="#0E0C18" opacity={0.85} />
      <path d="M 380 770 L 1540 770 L 1700 900 L 220 900 Z" fill="#FFB27A" opacity={0.14} />
      {/* two moving boxes and a lamp on the floor */}
      <g>
        <rect x={470} y={800} width={190} height={130} fill="#B98A5A" stroke="#6A4A2E" strokeWidth={4} />
        <rect x={470} y={800} width={190} height={26} fill="#D2A878" />
        <rect x={640} y={860} width={150} height={96} fill="#A97A4A" stroke="#6A4A2E" strokeWidth={4} />
        <ellipse cx={1470} cy={950} rx={80} ry={10} fill="#000" opacity={0.35} />
      </g>
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [26, 'happy']]) }} rimId="rimR" shadow={0.4} />
      <Dust t={t} seed={61} x0={500} y0={300} w={900} h={500} n={22} o={0.5} />
      <Glow x={1180} y={560} r={600} o={0.4} />
    </g>
  );
};

// ---------- A7: the title over the street at dusk: Pip with his phone glowing; it holds through the pause ----------
export const A7: React.FC<ShotProps> = ({ t, len }) => {
  const s = streetStand(0.3, 3.3);
  const pose = poseAt(t, [
    { f: 0, p: { x: s.x, y: s.y, scale: s.scale, yaw: 0.35, look: 0.3, armL: { a: 8, b: -4 }, armR: { a: 66, b: 120 }, headTilt: 6 } },
    { f: 60, p: { headTilt: 3 } },
    { f: 84, p: { headTilt: -3, look: 0, yaw: 0.15 }, ease: easeOut },
  ]);
  const h = toWorld(pose, joints(pose).armR.end);
  const pulse = 0.75 + 0.25 * Math.sin(t / 5);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 975]]), kf(t, [[0, 560], [len, 548]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
      <defs><linearGradient id="sa7band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#120A18" stopOpacity="0.8" /><stop offset="0.7" stopColor="#120A18" stopOpacity="0.45" /><stop offset="1" stopColor="#120A18" stopOpacity="0" /></linearGradient></defs>
      <Street t={t + 10} id="sa7" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [70, 'worried']]) }} rimId="rimR" shadow={0} />
      <HeldPhone x={h.x + 4} y={h.y - 10} s={0.9} rot={8} glow={pulse} />
      <rect x={-200} y={-200} width={2320} height={520} fill="url(#sa7band)" />
      <TitleCard t={t} lines={['SẼ RA SAO NẾU BẠN KIẾM ĐƯỢC', '1.000 ĐỒNG MỖI GIÂY?']} accent="1.000" accentT={66} size={90} y={165} />
    </g>
  );
};
