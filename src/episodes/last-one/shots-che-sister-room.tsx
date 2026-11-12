import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, LightVeil, Glow, Dust, joints, toWorld, HEAD, LEG_LEN, Foreground, FONT, ShotProps,
} from '../../engine';
import { InsertArm } from './insert-arm-and-icons';
import { Candle, flicker } from './che-night-props';
import { SisterWall, SisterBed, CrayonSheet, DoorSign } from './che-sister-room-and-crayons';

// Chapter E, "sister": the door of her room with a crayon sign (E6), her drawings taped to the wall (E7), a memory
// of the two of them fighting over a pillow (E8), then Pip on her bed with one drawing (E9, E10).

const PIP = LOOKS.pipHood;
const SIS = LOOKS.sis;

// ---------- E6: her door in the dark corridor: the crayon sign, his torch; the door swings open on a warm glow ----------
export const E6: React.FC<ShotProps> = ({ t, len }) => {
  const th = kf(t, [[0, 0], [9, 0], [len, 52]], easeOut);
  const c = Math.cos((th * Math.PI) / 180);
  const sn = Math.sin((th * Math.PI) / 180);
  const D = { x0: 700, w: 520, y0: 130, y1: 900 };
  const rx = D.x0 + D.w * c;
  const hand = { x: kf(t, [[0, 600], [8, 1110], [14, 1150], [24, 700]], easeOut), y: kf(t, [[0, 1100], [8, 560], [14, 540], [24, 1100]], easeOut) };
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 980]]), 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <rect x={-400} y={-400} width={2720} height={1900} fill="#1E1A30" />
      <rect x={-400} y={880} width={2720} height={700} fill="#17121F" />
      {/* the room behind the door, warm, with a candle's glow */}
      <rect x={D.x0 - 20} y={D.y0 - 20} width={D.w + 40} height={D.y1 - D.y0 + 20} fill="#2A1E36" />
      <rect x={D.x0 - 20} y={D.y0 - 20} width={D.w + 40} height={D.y1 - D.y0 + 20} fill="#FFB46A" opacity={0.28 * clamp(th / 30)} />
      {/* the frame */}
      <rect x={D.x0 - 34} y={D.y0 - 34} width={D.w + 68} height={D.y1 - D.y0 + 34} fill="#3A2C3A" />
      <rect x={D.x0 - 20} y={D.y0 - 20} width={D.w + 40} height={D.y1 - D.y0 + 20} fill="#17121F" opacity={0.0} />
      {th > 4 ? <rect x={D.x0 - 20} y={D.y0 - 20} width={D.w + 40} height={D.y1 - D.y0 + 20} fill="#2A1E36" /> : null}
      {th > 4 ? <Glow x={D.x0 + D.w * 0.55} y={700} r={420} o={0.9 * clamp(th / 26)} /> : null}
      {/* the door leaf, hinged on the left, swinging in */}
      <polygon points={`${D.x0},${D.y0} ${rx},${D.y0 + 42 * sn} ${rx},${D.y1 - 42 * sn} ${D.x0},${D.y1}`} fill="#7A5638" />
      <g transform={`translate(${D.x0} 0) matrix(${c} ${-0.075 * sn} 0 1 0 0) translate(${-D.x0} 0)`}>
        <rect x={D.x0} y={D.y0} width={D.w} height={D.y1 - D.y0} fill="#7A5638" />
        <rect x={D.x0 + D.w - 90} y={D.y0} width={90} height={D.y1 - D.y0} fill="#6A4A30" />
        {[[D.y0 + 40, 330], [D.y0 + 420, 330]].map(([y, h], i) => (
          <g key={i}>
            <rect x={D.x0 + 50} y={y} width={D.w - 100} height={h} fill="#6A4830" />
            <rect x={D.x0 + 50} y={y} width={D.w - 100} height={6} fill="#FFC98A" opacity={0.35} />
          </g>
        ))}
        <circle cx={D.x0 + D.w - 54} cy={560} r={20} fill="#C9A46A" />
        <rect x={D.x0 + D.w - 56} y={555} width={64} height={11} rx={5} fill="#C9A46A" />
        <DoorSign x={D.x0 + D.w / 2} y={D.y0 + 118} w={360} swing={Math.sin(t / 6) * 1.6} />
        {[[D.x0 + 90, 820, 0], [D.x0 + 170, 840, 1]].map(([x, y, k]) => (
          <path key={k} d={`M ${x} ${y} l 8 18 l 19 2 l -14 13 l 4 19 l -17 -10 l -17 10 l 4 -19 l -14 -13 l 19 -2 Z`} fill={k ? '#F08A32' : '#F2C230'} />
        ))}
      </g>
      {/* his torch, off to the left: a beam across the door */}
      <g filter="url(#blur10)">
        <path d="M 120 1020 L 600 600 L 1180 330 L 1240 860 Z" fill="url(#g3cone)" opacity={0.5} style={{ mixBlendMode: 'screen' }} />
      </g>
      <LightVeil id="e6veil" lights={[[950, 520, 560], [150, 1000, 240]]} o={0.62} />
      <Glow x={150} y={1010} r={200} o={0.7} />
      <Dust t={t} seed={6} x0={300} y0={300} w={900} h={700} n={34} o={0.6} />
      <InsertArm x={hand.x} y={hand.y} fx={hand.x - 500} fy={hand.y + 640} rot={34} s={4.2} width={118} />
    </g>
  );
};

// ---------- E7: her wall of crayon drawings under his sweeping torch: a family of four, a house, a cat, hearts ----------
const SHEETS = [
  { x: 330, y: 150, w: 300, h: 390, rot: -4, kind: 'house' as const, paper: '#F6F0DE' },
  { x: 720, y: 90, w: 380, h: 500, rot: 2, kind: 'family' as const, paper: '#F8F2E2' },
  { x: 1130, y: 190, w: 280, h: 360, rot: -3, kind: 'hearts' as const, paper: '#FBE8E8' },
  { x: 1500, y: 110, w: 320, h: 420, rot: 4, kind: 'cat' as const, paper: '#F3EBCF' },
  { x: 1860, y: 220, w: 270, h: 350, rot: -2, kind: 'sun' as const, paper: '#F8F2E2' },
  { x: 560, y: 600, w: 250, h: 220, rot: 5, kind: 'hearts' as const, paper: '#E8F0F4' },
];
export const E7: React.FC<ShotProps> = ({ t, len }) => {
  const bx = kf(t, [[0, 520], [len, 1500]]);
  return (
    <g transform={camT(kf(t, [[0, 760], [len, 1160]]), 480, kf(t, [[0, 1.2], [len, 1.28]]))}>
      <SisterWall />
      {SHEETS.map((s, i) => (
        <CrayonSheet key={i} {...s} seed={i + 2} />
      ))}
      {/* a shelf with a plush and a candle under the drawings */}
      <rect x={300} y={780} width={1500} height={16} fill="#4A3C52" />
      <rect x={300} y={796} width={1500} height={4} fill="#000" opacity={0.3} />
      <Candle x={1380} y={780} s={0.9} t={t + 20} />
      <path d="M 1530 780 Q 1500 700 1560 690 Q 1620 700 1590 780 Z" fill="#8A6A9A" />
      <circle cx={1560} cy={668} r={34} fill="#9A7AAA" />
      <path d="M 1534 650 L 1530 622 L 1552 640 M 1586 650 L 1590 622 L 1568 640" fill="#9A7AAA" stroke="#9A7AAA" strokeWidth={6} />
      {/* his torch beam sweeps the wall; everything outside it sinks */}
      <path d={`M 80 1100 L ${bx - 280} 120 L ${bx + 280} 120 L ${bx + 200} 1100 Z`} fill="url(#g3cone)" opacity={0.4} style={{ mixBlendMode: 'screen' }} />
      <LightVeil id="e7veil" lights={[[bx, 420, 620], [1380, 700, 260]]} o={0.7} />
      <Glow x={bx} y={420} r={440} o={0.35} />
      <Dust t={t} seed={7} x0={bx - 500} y0={100} w={1000} h={700} n={50} o={0.65} />
    </g>
  );
};

// ---------- E8: MEMORY, warm day: Pip and his little sister tug a pillow, both furious ----------
const Vein: React.FC<{ x: number; y: number; on: boolean; s?: number }> = ({ x, y, on, s = 1 }) =>
  on ? (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#E0463E" strokeWidth={7} strokeLinecap="round" fill="none">
      <path d="M -22 -6 Q -8 -6 -8 -22 M 22 -6 Q 8 -6 8 -22 M -22 6 Q -8 6 -8 22 M 22 6 Q 8 6 8 22" />
    </g>
  ) : null;
export const E8: React.FC<ShotProps> = ({ t, len }) => {
  const osc = Math.sin(t * 0.85) * 14;
  const ps = 1.5;
  const ss = 1.08;
  const pip: Pose = {
    ...basePose, x: 780 + osc, y: 880 - LEG_LEN * ps, scale: ps, yaw: 0.55, facing: 1, tilt: -9 + osc * 0.2,
    armR: { a: 84, b: 8 }, armL: { a: 60, b: 20 }, legL: { a: -18, b: 6 }, legR: { a: 22, b: 0 }, headTilt: -4,
    ...faceAt(t, [[0, 'oops']]),
  };
  const sis: Pose = {
    ...basePose, x: 1190 + osc, y: 880 - LEG_LEN * ss, scale: ss, yaw: -0.55, facing: -1, tilt: 9 + osc * 0.2,
    armL: { a: 84, b: 8 }, armR: { a: 60, b: 20 }, legL: { a: 20, b: 0 }, legR: { a: -20, b: 6 }, headTilt: 5,
    ...faceAt(t, [[0, 'oops']]),
  };
  const h1 = toWorld(pip, joints(pip).armR.end);
  const h2 = toWorld(sis, joints(sis).armL.end);
  const mx = (h1.x + h2.x) / 2;
  const my = (h1.y + h2.y) / 2;
  const ang = Math.atan2(h2.y - h1.y, h2.x - h1.x);
  const len2 = Math.hypot(h2.x - h1.x, h2.y - h1.y) + 90;
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 970]]), 600, kf(t, [[0, 1.2], [len, 1.32]]))}>
      <SisterWall day />
      <rect x={1380} y={330} width={300} height={380} fill="#E8D8C0" />
      <rect x={1396} y={346} width={268} height={348} fill="#BFE0F0" />
      <path d="M 1396 520 L 1664 520 M 1530 346 L 1530 694" stroke="#E8D8C0" strokeWidth={10} />
      <Glow x={1530} y={520} r={420} o={0.4} />
      <SisterBed x0={1180} x1={1900} top={800} day />
      <CrayonSheet x={300} y={200} w={260} h={340} rot={-3} kind="family" seed={4} />
      <Hero look={SIS} pose={sis} rimId="rimL" shadow={0.5} />
      <Hero look={PIP} pose={pip} rimId="rimR" shadow={0.5} />
      {/* the pillow between their mittens */}
      <g transform={`translate(${mx} ${my}) rotate(${(ang * 180) / Math.PI + 90})`}>
        <rect x={-62} y={-len2 / 2} width={124} height={len2} rx={50} fill="#F6EEE6" stroke="#B8A998" strokeWidth={5} />
        <rect x={-62} y={-len2 / 2} width={46} height={len2} rx={40} fill="#FFFFFF" opacity={0.35} />
        <path d={`M -34 ${-len2 / 2 + 22} Q -4 ${-len2 / 2 + 8} 28 ${-len2 / 2 + 24}`} stroke="#C9B8A6" strokeWidth={4} fill="none" />
      </g>
      <Vein x={pip.x + 20} y={pip.y - 330} on={t % 14 < 8} />
      <Vein x={sis.x - 14} y={sis.y - 240} on={(t + 6) % 14 < 8} s={0.8} />
    </g>
  );
};

// ---------- E9: medium, in her room: Pip sits on the edge of her bed holding one drawing, candle on a stool ----------
export const E9: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.8;
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 930, y: 700, scale: sc, yaw: -0.95, facing: -1, legL: { a: 84, b: -84 }, legR: { a: 88, b: -80 }, armL: { a: 62, b: 40 }, armR: { a: 26, b: 22 }, headTilt: -10, tilt: 3, look: -0.4 } },
    { f: 30, p: { headTilt: -14, look: -0.6 } },
    { f: 60, p: { headTilt: -9 } },
  ]);
  const hand = toWorld(pose, joints(pose).armL.end);
  const stool = { x: 540, top: 800 };
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1010]]), 560, kf(t, [[0, 1.3], [len, 1.5]]))}>
      <SisterWall />
      <CrayonSheet x={1200} y={150} w={300} h={390} rot={-3} kind="house" seed={8} />
      <CrayonSheet x={1560} y={200} w={260} h={340} rot={3} kind="cat" seed={9} />
      <SisterBed x0={800} x1={1750} top={740} />
      {/* the stool and the candle */}
      <rect x={stool.x - 90} y={stool.top} width={180} height={20} rx={6} fill="#5A4660" />
      <rect x={stool.x - 70} y={stool.top + 20} width={16} height={80} fill="#4A3850" />
      <rect x={stool.x + 54} y={stool.top + 20} width={16} height={80} fill="#4A3850" />
      <Candle x={stool.x} y={stool.top} s={0.95} t={t} seed={2} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [30, 'tired']]) }} rimId="rimL" shadow={0} />
      {/* the drawing in his mitten: a family of four */}
      <g transform={`translate(${hand.x + 6} ${hand.y - 10}) rotate(${-8 + Math.sin(t / 14) * 1.5})`}>
        <CrayonSheet x={0} y={-290} w={250} h={330} kind="family" seed={3} paper="#F8F2E2" />
        <circle cx={-40} cy={12} r={22} fill={PIP.hand} stroke={PIP.line} strokeWidth={4} />
      </g>
      <LightVeil id="e9veil" lights={[[stool.x + 40, 640, 560], [hand.x, hand.y - 80, 220]]} o={0.62} />
      <Glow x={stool.x} y={stool.top - 110} r={300 * flicker(t)} o={0.55} />
      <Dust t={t} seed={8} x0={stool.x - 100} y0={420} w={800} h={420} n={26} o={0.5} />
    </g>
  );
};

// ---------- E10: close-up: his face over the drawing, eyes wet, candle light, a slow push-in ----------
export const E10: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 4.1 * (1 + 0.05 * clamp(t / len));
  const head = { x: 930, y: 470 };
  const yaw = -0.4;
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw, facing: -1, headTilt: kf(t, [[0, -6], [len, -10]]),
    look: -0.5, armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 }, ...faceAt(t, [[0, 'worried']]),
    blink: t % 58 > 52 ? 0.9 : 0,
  };
  const ey = head.y - 4 * sc;
  const exs = [-21, 21].map((cx) => head.x + (cx + yaw * 30) * (1 - 0.28 * Math.abs(yaw)) * sc);
  const drip = clamp((t - 16) / 40);
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -200) scale(1.4)">
          <SisterWall />
          <SisterBed x0={700} x1={1500} top={740} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.52} />
      <Glow x={1500} y={700} r={760} o={0.55 * flicker(t)} />
      <Hero look={PIP} pose={pose} rimId="rimL" shadow={0} />
      {/* wet eyes: a bright rim under each, a tear running down the near cheek */}
      {exs.map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy={ey + 40} rx={46} ry={10} fill="#BFD8FF" opacity={0.55} />
          <ellipse cx={x + 12} cy={ey - 6} rx={9} ry={7} fill="#FFFFFF" opacity={0.85} />
        </g>
      ))}
      <path d={`M ${exs[1] + 6} ${ey + 46} Q ${exs[1] + 14} ${ey + 46 + 90 * drip} ${exs[1] + 4} ${ey + 46 + 190 * drip}`} stroke="#BFD8FF" strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.85 * Math.min(1, drip * 3)} />
      {/* the drawing, held up in front of his chest, both mittens on its corners */}
      <g>
        <CrayonSheet x={760} y={800} w={560} h={720} rot={-5} kind="family" seed={3} paper="#F8F2E2" />
        <circle cx={500} cy={820} r={58} fill={PIP.hand} stroke={PIP.line} strokeWidth={8} />
        <circle cx={1010} cy={790} r={58} fill={PIP.hand} stroke={PIP.line} strokeWidth={8} />
      </g>
      <Foreground blur={16}>
        <Candle x={1740} y={1120} s={3.2} t={t + 5} seed={4} glow={0} />
      </Foreground>
      <LightVeil id="e10veil" lights={[[1000, 560, 640]]} o={0.3} />
    </g>
  );
};
