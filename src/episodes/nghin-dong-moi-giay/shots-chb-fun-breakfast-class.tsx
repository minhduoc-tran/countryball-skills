import React from 'react';
import {
  Hero, poseAt, faceAt, walkPose, kf, clamp, easeOut, backOut, camT, LOOKS, Street, streetStand, propScale, proj, joints, toWorld,
  KIDS, Tag, Sparkle, FocusRings, Foreground, Glow, UI, FONT, SCH, ShotProps, rnd,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { ShoutArcs } from '../last-one/shots-chb-local-props-rooftop-and-night';
import { Backdrop, PaperCrown } from './chb-park-and-face-props';
import { ClockIcon } from './chb-math-icons';
import { Loaf, BanhMiCart, QR_AT, BankPhone, Crumbs, Bowl, Stool, LowTable, Cheerer, Steam } from './chb-street-food-props';

// Chapter B, the fun part (1/2): breakfast at the bánh mì cart (the ping look is ON), then the class treat at a pavement
// quán: bowls, 30 x 50.000 đ, the receipt, and the whole class calling Pip a tycoon. Pure functions of the shot clock t.

const PIP = LOOKS.pipHood;

/** A warm morning wash over the dusk street (the sun is low and gold). */
const MorningWash: React.FC<{ o?: number }> = ({ o = 0.16 }) => (
  <rect x={-400} y={-400} width={2720} height={1880} fill="#FFD9A0" opacity={o} style={{ mixBlendMode: 'screen' }} />
);

// ---------- B16: wide, the morning street: Pip walks toward the bánh mì cart on the sidewalk ----------
export const B16: React.FC<ShotProps> = ({ t, len }) => {
  const Z = 5.6;
  const s = streetStand(kf(t, [[0, -1.6], [len, 3.1]], (v) => v), Z);
  const pose = walkPose(s.x, t * 0.6, s.y + 140 * s.scale, s.scale, { yaw: 0.7, tilt: 3 }, 1);
  const c = proj(4.9, 0, Z);
  const cs = propScale(Z) * 0.5;
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1200]]), 700, 2.0)}>
      <Street t={t + 60} id="b16" market={0.5} />
      <MorningWash o={0.3} />
      <BanhMiCart x={c.x} y={c.y} s={cs} t={t} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- B17: macro: the loaf gets its filling, item by item, under the price on the board ----------
const FILL_AT = [4, 12, 20, 28];
export const B17: React.FC<ShotProps> = ({ t, len }) => {
  const fill = clamp((t - 2) / 26);
  const sway = Math.sin(t / 9) * 2;
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 980]]), 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Backdrop id="b17" t={t} top="#3A2A2A" bottom="#8A5A3A" />
      <rect x={-200} y={700} width={2400} height={500} fill="#6A4630" />
      <rect x={-200} y={700} width={2400} height={12} fill="#9A6A44" />
      <Loaf x={880} y={720} s={2.1} fill={fill} rot={-3} />
      {FILL_AT.map((a, i) => (t >= a ? (
        <g key={i} transform={`translate(${620 + i * 150} ${560 - clamp((t - a) / 5) * 0}) scale(${backOut(clamp((t - a) / 6))})`}>
          <circle r={26 + (i % 2) * 6} fill={['#5AA05A', '#F0C8C0', '#F6F1E3', '#D94452'][i]} stroke="#3A2A20" strokeWidth={3} opacity={clamp(1 - (t - a - 8) / 6)} />
        </g>
      ) : null))}
      <g transform={`translate(1500 ${330 + sway}) rotate(${sway})`}>
        <rect x={-190} y={-100} width={380} height={190} rx={14} fill="#1C2A26" stroke="#E9DFC6" strokeWidth={8} />
        <text y={34} textAnchor="middle" fontFamily={FONT.hand} fontSize={88} fill="#FFF2C4">25.000 đ</text>
      </g>
      <Steam x={560} y={560} t={t} s={1.6} />
      <Sparkle x={1100} y={470} t={t - 30} s={1.2} />
      <Foreground blur={10}><path d="M -50 1080 L -50 920 Q 400 880 700 1000 L 760 1080 Z" fill="#1A0E08" /></Foreground>
    </g>
  );
};

// ---------- B18: medium: Pip holds the phone to the QR standee: a scan line, then the tick; the price tag in seconds ----------
export const B18: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 1280, y: 700, scale: 1.3, facing: -1, yaw: -0.55, look: -0.6, armL: { a: 20, b: 10 }, armR: { a: 14, b: -6 } } },
    { f: 7, p: { armL: { a: 78, b: 18 }, headTilt: -3 }, ease: easeOut },
  ]);
  const hand = toWorld(pose, joints(pose).armL.end);
  const qr = { x: hand.x - 95, y: hand.y - 14 };
  const cs = 0.95;
  const cart = { x: qr.x - QR_AT.x * cs, y: qr.y - QR_AT.y * cs };
  const scan = clamp((t - 6) / 10);
  const paid = t >= 18;
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 940]]), 600, kf(t, [[0, 1.45], [len, 1.55]]))}>
      <g filter="url(#blur6)">
        <g transform="translate(-300 -100) scale(1.4)"><Street t={t + 60} id="b18" market={0.5} /></g>
      </g>
      <MorningWash o={0.2} />
      <BanhMiCart x={cart.x} y={cart.y} s={cs} t={t} scan={scan < 1 ? scan : 0} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [18, 'happy']]) }} rimId="rimL" shadow={0} />
      <g transform={`translate(${hand.x - 8} ${hand.y - 40}) rotate(-12)`}><BankPhone x={0} y={0} w={92} mode="scan" t={t} paidAt={18} /></g>
      {paid ? <circle cx={qr.x} cy={qr.y} r={20 + (t - 18) * 6} fill="none" stroke="#4CE08A" strokeWidth={5} opacity={clamp(1 - (t - 18) / 10)} /> : null}
      <Tag x={800} y={320} t={t - 4} text="25.000 đ = 25 GIÂY" w={900} />
      <Sparkle x={qr.x} y={qr.y - 60} t={t - 18} s={0.9} />
    </g>
  );
};

// ---------- B19: medium: Pip chews, bánh mì in hand, crumbs flying ----------
export const B19: React.FC<ShotProps> = ({ t, len }) => {
  const chew = Math.sin(t * 1.25);
  const pose = poseAt(t, [
    { f: 0, p: { x: 930, y: 700, scale: 1.4, yaw: 0.45, look: 0.4, armR: { a: 62, b: 108 }, armL: { a: 10, b: -6 }, headTilt: 0 } },
  ]);
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), 560, kf(t, [[0, 1.5], [len, 1.7]]))}>
      <g filter="url(#blur6)">
        <g transform="translate(-300 -100) scale(1.4)"><Street t={t + 90} id="b19" market={0.5} /></g>
      </g>
      <MorningWash o={0.2} />
      <Hero look={PIP} pose={{ ...pose, headTilt: chew * 3.5, y: pose.y + Math.abs(chew) * 2, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Loaf x={hand.x + 14} y={hand.y - 24} s={0.5} rot={-72} bite={0.35} fill={1} />
      <Crumbs x={hand.x - 30} y={hand.y - 100} t={t} n={9} s={0.9} />
    </g>
  );
};

// ---------- B20: insert: the balance on the phone refills (+1.000 đ ticks) while the bread sits half eaten ----------
export const B20: React.FC<ShotProps> = ({ t, len }) => {
  const bob = Math.sin(t * 1.25) * 3;
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Backdrop id="b20" t={t} top="#2A2A44" bottom="#4A3A30" />
      <rect x={-200} y={840} width={2400} height={400} fill="#5A3E2C" />
      <Loaf x={420} y={900} s={1.1} rot={-6} bite={0.4} fill={1} />
      <Crumbs x={470} y={860} t={t} n={8} s={1.2} />
      <BankPhone x={1020} y={560 + bob * 0.3} w={400} rot={-4} mode="balance" t={t} />
      <InsertArm x={1100} y={900} fx={1500} fy={1200} rot={-8} s={4.4} width={110} />
      {Array.from({ length: 5 }).map((_, i) => {
        const p = ((t - i * 6) % 30) / 30;
        return t - i * 6 > 0 ? <text key={i} x={1380 + (i % 2) * 90} y={520 - p * 330} fontFamily={FONT.ui} fontWeight={700} fontSize={50} fill="#7CF0A8" opacity={Math.sin(clamp(p) * Math.PI)} textAnchor="middle">+1.000 đ</text> : null;
      })}
    </g>
  );
};

// ---------- the quán: stools, a low table, bowls and cheering kids ----------
type KidSpec = { dx: number; flip: boolean; k: number; row?: number };
const Table: React.FC<{ x: number; y: number; s: number; t: number; kids: KidSpec[]; up: number; seed?: number; c?: number; tag?: boolean }> = ({ x, y, s, t, kids, up, seed = 0, c = 0 }) => (
  <g>
    {kids.map((kd, i) => (
      <Stool key={`s${i}`} x={x + kd.dx * s} y={y - (kd.row ?? 0) * 30 * s} s={s} c={c + i} />
    ))}
    {kids.map((kd, i) => (
      <Cheerer key={`k${i}`} x={x + kd.dx * s} y={y - (kd.row ?? 0) * 30 * s - 62 * s} s={s * 0.72} look={KIDS[kd.k % 5]} t={t} up={up} flip={kd.flip} seed={seed + i} />
    ))}
    <LowTable x={x} y={y + 10 * s} s={s}>
      <Bowl x={-120} y={2} s={0.9} t={t} />
      <Bowl x={0} y={4} s={0.9} t={t + 8} />
      <Bowl x={125} y={2} s={0.9} t={t + 16} />
    </LowTable>
  </g>
);

// ---------- B21: wide: a pavement quán, the class on plastic stools, Pip arrives with his arms wide ----------
export const B21: React.FC<ShotProps> = ({ t, len }) => {
  const s = streetStand(0.15, 4.6);
  const pose = poseAt(t, [
    { f: 0, p: { x: s.x, y: s.y, scale: s.scale, yaw: 0.15, look: 0, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 } } },
    { f: 8, p: { armL: { a: 100, b: 10 }, armR: { a: 100, b: 10 }, squash: -0.04 }, ease: easeOut },
    { f: 16, p: { squash: 0 } },
  ]);
  return (
    <g transform={camT(960, 640, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Street t={t + 120} id="b21" market={0.7} />
      <Table x={430} y={960} s={1.25} t={t} up={clamp((t - 6) / 6)} kids={[{ dx: -250, flip: false, k: 0 }, { dx: 250, flip: true, k: 1 }, { dx: -140, flip: false, k: 2, row: 1.6 }]} />
      <Table x={1500} y={960} s={1.25} t={t + 30} up={clamp((t - 8) / 6)} seed={5} c={1} kids={[{ dx: -250, flip: false, k: 3 }, { dx: 250, flip: true, k: 4 }, { dx: 140, flip: true, k: 1, row: 1.6 }]} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <ShoutArcs x={640} y={640} t={t} s={0.7} />
      <ShoutArcs x={1280} y={640} t={t} face={-1} s={0.7} />
    </g>
  );
};

// ---------- B22: medium: the long table of bowls; the price tag "30 × 50.000 đ" pops ----------
export const B22: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1020]]), 700, kf(t, [[0, 1.2], [len, 1.35]]))}>
    <g filter="url(#blur6)"><Street t={t + 150} id="b22" market={0.7} /></g>
    <g filter="url(#blur6)">
      <Table x={420} y={800} s={0.8} t={t} up={1} seed={2} kids={[{ dx: -230, flip: false, k: 2 }, { dx: 230, flip: true, k: 3 }]} />
      <Table x={1560} y={800} s={0.8} t={t + 12} up={1} seed={9} kids={[{ dx: -230, flip: false, k: 4 }, { dx: 230, flip: true, k: 0 }]} />
    </g>
    <Table x={980} y={960} s={1.6} t={t} up={1} seed={3} c={2}
      kids={[{ dx: -250, flip: false, k: 0 }, { dx: 250, flip: true, k: 1 }, { dx: -140, flip: false, k: 3, row: 1.5 }, { dx: 140, flip: true, k: 4, row: 1.5 }]} />
    <Tag x={980} y={380} t={t - 30} text="30 × 50.000 đ" w={820} />
  </g>
);

// ---------- B23: insert: the receipt on the table, the total, then a stamp "= 25 PHÚT" slams on ----------
export const B23: React.FC<ShotProps> = ({ t, len }) => {
  const st = clamp((t - 14) / 5);
  const jolt = t > 14 && t < 22 ? Math.sin(t * 3) * 6 * (1 - (t - 14) / 8) : 0;
  return (
    <g transform={camT(960 + jolt, 540 + jolt * 0.6, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Backdrop id="b23" t={t} top="#3A2A2A" bottom="#6A4A38" />
      <rect x={-200} y={-200} width={2400} height={1500} fill="#7A5A44" />
      <g transform="translate(900 560) rotate(-4)">
        <rect x={-270} y={-400} width={540} height={800} rx={10} fill="#F4EEDD" stroke="#B9AE92" strokeWidth={4} />
        <path d="M -270 400 q 22 24 45 0 q 22 24 45 0 q 22 24 45 0 q 22 24 45 0 q 22 24 45 0 q 22 24 45 0 q 22 24 45 0 q 22 24 45 0 q 22 24 45 0 q 22 24 45 0 q 22 24 45 0 q 22 24 45 0 Z" fill="#F4EEDD" />
        <text y={-330} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={44} fill="#2A2A30" letterSpacing={4}>HOÁ ĐƠN</text>
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={i} opacity={clamp((t - i * 2) / 4)}>
            <rect x={-220} y={-250 + i * 54} width={190 + rnd(3, i) * 80} height={14} rx={7} fill="#B7B0A0" />
            <text x={220} y={-238 + i * 54} textAnchor="end" fontFamily={FONT.ui} fontSize={30} fill="#3A3A44">50.000</text>
          </g>
        ))}
        <path d="M -220 120 L 220 120" stroke="#8A8472" strokeWidth={3} strokeDasharray="10 8" />
        <text x={-220} y={190} fontFamily={FONT.ui} fontSize={34} fill="#2A2A30">30 × 50.000 đ</text>
        <text x={220} y={260} textAnchor="end" fontFamily={FONT.ui} fontWeight={700} fontSize={56} fill="#1C1C22">1.500.000 đ</text>
      </g>
      {st > 0 ? (
        <g transform={`translate(1360 300) rotate(-9) scale(${1.7 - 0.7 * easeOut(st)})`} opacity={clamp(st * 3)}>
          <rect x={-270} y={-92} width={540} height={184} rx={22} fill="#7A1F1A" opacity={0.85} stroke="#FF6A4A" strokeWidth={8} />
          <g transform="translate(-170 0)"><ClockIcon x={0} y={0} r={58} t={t - 14} turns={1} dur={12} color="#FFE9D0" /></g>
          <text x={40} y={22} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={64} fill="#FFE9D0">25 PHÚT</text>
        </g>
      ) : null}
      <Sparkle x={1500} y={560} t={t - 20} s={1.2} />
    </g>
  );
};

// ---------- B24: medium: "đại gia!": a paper crown drops on Pip, the shades slide on, the class cheers around him ----------
export const B24: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 700, scale: 1.35, yaw: 0.1, look: 0, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, squash: 0 } },
    { f: 22, p: { armL: { a: 140, b: 12 }, armR: { a: 140, b: 12 }, squash: -0.05, headTilt: -4 }, ease: easeOut },
    { f: 34, p: { squash: 0, headTilt: 0 } },
  ]);
  const gl = easeOut(clamp((t - 24) / 9));
  return (
    <g transform={camT(960, 600, kf(t, [[0, 1.3], [len, 1.45]]))}>
      <g filter="url(#blur6)"><Street t={t + 180} id="b24" market={0.7} /></g>
      <Table x={390} y={940} s={1.6} t={t} up={1} seed={4} kids={[{ dx: -150, flip: false, k: 1 }, { dx: 250, flip: true, k: 2 }]} />
      <Table x={1540} y={940} s={1.6} t={t + 10} up={1} seed={8} c={1} kids={[{ dx: -250, flip: false, k: 3 }, { dx: 150, flip: true, k: 0 }]} />
      <Hero look={PIP} pose={{ ...pose, glasses: gl, ...faceAt(t, [[0, 'happy'], [26, 'smug']]) }} rimId="rimR" shadow={0} />
      <PaperCrown pose={pose} drop={(t - 4) / 8} />
      <ShoutArcs x={560} y={560} t={t} s={0.9} />
      <ShoutArcs x={1360} y={560} t={t} face={-1} s={0.9} />
      <Sparkle x={1010} y={300} t={t - 14} s={1.1} />
    </g>
  );
};
