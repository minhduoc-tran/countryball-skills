import React from 'react';
import { Hero, ShotProps, LOOKS, basePose, Pose, walkPose, faceAt, kf, clamp, easeOut, backOut, camT, SCH, FONT, Glow, Dust } from '../../engine';
import { CardBase } from './chc-cards-and-icons';
import { BackpackWorn, BackpackFront, CatHead, CatHeld, PACK } from './chc-backpack-and-cat-props';
import { RoadBackdrop, RoadProcession, Walker, BusInterior } from './chc-road-and-bus-scenes';
import { armTo } from './chc-pose-utils';

// Chapter C, month one, the road (look "m1"): C27 the card ("6 GIỜ" crossed out, "2 NGÀY"); C28-C29 the road full of
// vehicles and people with backpacks like Pip's; C30-C31 the night bus: sis asleep on Pip's shoulder, hugging the cat.

const PIP = LOOKS.pipHood;
const SIS = LOOKS.sis;

/** A bus as a schematic line icon, centred, ~220 wide. */
const BusIcon: React.FC<{ x: number; y: number; s?: number; t: number; color?: string }> = ({ x, y, s = 1, t, color = SCH.line }) => (
  <g transform={`translate(${x} ${y + Math.sin(t / 3) * 1.5}) scale(${s})`} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x={-110} y={-62} width={220} height={96} rx={16} />
    <path d="M -110 -14 L 110 -14 M -64 -62 L -64 -14 M -6 -62 L -6 -14 M 52 -62 L 52 -14" />
    <circle cx={-62} cy={40} r={17} fill="#101A2A" />
    <circle cx={62} cy={40} r={17} fill="#101A2A" />
  </g>
);

// ---------- C27: "6 GIỜ" is crossed out; "2 NGÀY" ----------
export const C27: React.FC<ShotProps> = ({ t, len }) => {
  const cross = easeOut(clamp((t - 18) / 8));
  const two = backOut(clamp((t - 24) / 8));
  const ghost = 1 + 0.18 * Math.sin(clamp((t - 56) / 10) * Math.PI);
  const busX = kf(t, [[0, 260], [20, 520], [len, 1500]]);
  return (
    <CardBase t={t} len={len} id="c27" z1={1.07}>
      <g transform={`translate(960 330) scale(${ghost})`} opacity={kf(t, [[0, 1], [24, 1], [30, 0.55]], (v) => v)}>
        <text textAnchor="middle" y={0} fontFamily={FONT.ui} fontWeight={700} fontSize={150} fill={SCH.line} letterSpacing={4}>6 GIỜ</text>
        <path d="M -250 -50 L 250 -50" stroke="#FF5A48" strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - cross} />
      </g>
      <g transform={`translate(960 640) scale(${two})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={260} fill={SCH.live} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>2 NGÀY</text>
      </g>
      <path d="M 200 900 L 1720 900" stroke={SCH.dim} strokeWidth={5} strokeDasharray="4 22" strokeLinecap="round" />
      <circle cx={200} cy={900} r={12} fill={SCH.dim} />
      <circle cx={1720} cy={900} r={12} fill={SCH.live} />
      <BusIcon x={busX} y={850} s={0.9} t={t} />
    </CardBase>
  );
};

// ---------- C28: the road at dusk, full of vehicles and people with backpacks ----------
export const C28: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1020]]), kf(t, [[0, 660], [len, 700]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
    <RoadBackdrop id="c28" pan={t * 2.4} />
    <RoadProcession t={t + 40} />
    <Dust t={t} seed={8} x0={200} y0={400} w={1500} h={400} n={26} o={0.35} />
  </g>
);

// ---------- C29: tracking Pip and his sister in the stream; every backpack the same as his ----------
export const C29: React.FC<ShotProps> = ({ t, len }) => {
  const s = 0.86;
  const v = 6.2 * s * 1.05;
  const px = 700 + t * v;
  const phase = t * 0.3;
  const pipPose: Pose = walkPose(px, phase, 975, s, { yaw: 0.9, tilt: 6, expr: 'tired', look: 0.4, armL: { a: 10 * Math.sin(phase), b: 18 }, armR: { a: -10 * Math.sin(phase), b: 18 } }, 1);
  const ss = 0.62;
  const sx = px + 150;
  const sisPose: Pose = walkPose(sx, phase + 1, 978, ss, { yaw: 0.9, tilt: 6, expr: 'tired', look: 0.4, armL: { a: 14, b: 30 }, armR: { a: 8, b: 40 } }, 1);
  const ring = clamp((t - 36) / 18, 0, 1.2);
  const catY = sisPose.y - 128 * ss;
  return (
    <g transform={camT(px + 240, 760, 1.85)}>
      <RoadBackdrop id="c29" pan={px - 960} />
      <RoadProcession t={t + 90} rings skipNear />
      {/* a few near-row walkers behind and ahead of the pair */}
      {[-1, 1, 2].map((k) => (
        <Walker key={k} i={60 + k} t={t} y={975} s={0.86} speed={0.9 + 0.06 * k} x0={700 + 400 + k * 460} span={99999} pack={PACK.pip} ring={clamp((t - 20 - k * 6) / 16, 0, 1.2)} />
      ))}
      <BackpackWorn pose={sisPose} layer="back" color={PACK.sis} big={0.95} />
      <CatHead x={sx - 20 * ss} y={catY} s={ss * 0.8} look={0.6} rot={-6} blink={Math.floor(t / 30) % 3 === 1 ? 1 : 0} />
      <Hero look={SIS} pose={sisPose} rimId="rimR" shadow={0.8} />
      <BackpackWorn pose={sisPose} layer="strap" color={PACK.sis} />
      <BackpackWorn pose={pipPose} layer="back" color={PACK.pip} />
      <Hero look={PIP} pose={pipPose} rimId="rimR" shadow={0.8} />
      <BackpackWorn pose={pipPose} layer="strap" color={PACK.pip} />
      {ring > 0 && ring < 1 ? <circle cx={px - 42 * s} cy={pipPose.y - 66 * s} r={(40 + 70 * ring) * s} fill="none" stroke="#FFD27A" strokeWidth={8} opacity={1 - ring} /> : null}
    </g>
  );
};

// ---------- the night bus: Pip awake, sis asleep on his shoulder with the cat; used by C30 (medium) and C31 (close) ----------
const SEAT = { pipX: 1010, sisX: 880, hipY: 780 };
const SKIN = LOOKS.sis.hand;
const BusPair: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const sway = Math.sin(t / 11) * 1.2;
  const ps = 1.0;
  const ss = 0.72;
  const breathe = Math.sin(t / 16) * 0.8;
  const pipBase: Pose = { ...basePose, x: SEAT.pipX, y: SEAT.hipY, scale: ps, yaw: 0.12, tilt: -1 + sway * 0.3, look: 0.3 };
  const sisBase: Pose = { ...basePose, x: SEAT.sisX, y: SEAT.hipY + 4, scale: ss, yaw: -0.1, tilt: 8 + breathe, headTilt: 14 };
  const cat = { x: SEAT.sisX + 18, y: SEAT.hipY - 52 * ss };
  const handL = { x: cat.x - 44, y: cat.y + 12 };
  const handR = { x: cat.x + 44, y: cat.y + 14 };
  const pipPose: Pose = {
    ...pipBase, ...faceAt(t, [[0, 'tired']]),
    armL: armTo(pipBase, 'armL', SEAT.sisX + 36, SEAT.hipY - 96 * ss), headTilt: -6,
  };
  const sisPose: Pose = { ...sisBase, expr: 'tired', blink: 1, armL: armTo(sisBase, 'armL', handL.x, handL.y), armR: armTo(sisBase, 'armR', handR.x, handR.y) };
  return (
    <g transform={`translate(0 ${sway}) rotate(${sway * 0.1} 960 700)`}>
      <BusInterior id={id} t={t} />
      <Hero look={SIS} pose={sisPose} rimId="rimBlue" shadow={0} />
      <CatHeld x={cat.x} y={cat.y} s={ss * 1.0} t={t} sleep />
      {[handL, handR].map((h, i) => <ellipse key={i} cx={h.x} cy={h.y} rx={11} ry={9} fill={SKIN} stroke="#14121C" strokeWidth={3} />)}
      <Hero look={PIP} pose={pipPose} rimId="rimBlue" shadow={0} />
      <BackpackFront x={SEAT.pipX + 4} y={SEAT.hipY + 110} s={0.95} color={PACK.pip} />
      {/* the seat back in front hides their legs */}
      <rect x={-400} y={SEAT.hipY + 22} width={3000} height={700} fill="#14111C" />
      <path d={`M -400 ${SEAT.hipY + 22} L 2600 ${SEAT.hipY + 22}`} stroke="#4A3E66" strokeWidth={8} />
      <Glow x={SEAT.sisX + 80} y={SEAT.hipY - 220} r={420} kind="cool" o={0.18} />
    </g>
  );
};

export const C30: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 930]]), kf(t, [[0, 560], [len, 590]]), kf(t, [[0, 1.5], [len, 1.75]]))}>
    <BusPair t={t + 20} id="c30" />
  </g>
);

export const C31: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, SEAT.sisX + 70], [len, SEAT.sisX + 50]]), kf(t, [[0, 680], [len, 670]]), kf(t, [[0, 2.8], [len, 3.4]]))}>
    <BusPair t={t + 90} id="c31" />
  </g>
);
