import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, Glow, Dust, Sparkle, TitleCard, Street, streetStand,
  walkPose, joints, toWorld, Tabletop, ShotProps, shake,
} from '../../engine';
import { DawnAlley, DawnMotes } from '../tien-vo-han/che-dawn-alley-backdrop';
import { XoiCart } from '../tien-vo-han/che-xoi-cart-and-money-props';
import { PIP, MO, SmokeColumn } from './cha-cafe-and-alley-props';
import { AppIcon } from './cha-phone-screens';

// Chapter A, the premise A8-A12 (12.25-23.14 s): the title over the alley with a thin smoke column on the horizon, a
// modern street, a history book closing, then the phone in Pip's pocket and the apps that pop out of it.

// ---------- A8: wide, the alley at dawn with the title; far on the horizon one thin column of smoke ----------
export const A8: React.FC<ShotProps> = ({ t, len }) => {
  const s = streetStand(0.6, 9);
  const pose = poseAt(t, [
    { f: 0, p: { x: s.x, y: s.y, scale: s.scale, yaw: 0.2, look: 0.2, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 } } },
    { f: 30, p: { yaw: 0.55, look: 0.8, headTilt: 2 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 540]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
      <DawnAlley t={t + 200} id="a8st" cart />
      <SmokeColumn x={1040} y={468} h={330} t={t} o={0.95} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [40, 'worried']]) }} rimId="rimR" shadow={0} />
      <TitleCard t={t} lines={['SẼ RA SAO NẾU', 'CHIẾN TRANH ẬP ĐẾN?']} accent="CHIẾN" accentT={36} size={100} y={150} />
    </g>
  );
};

// ---------- A9: "giữa cuộc sống hiện đại này": Pip and Mo walk a busy market street, eyes on their phones ----------
export const A9: React.FC<ShotProps> = ({ t, len }) => {
  const X = kf(t, [[0, -3.4], [len, 3.0]], (v) => v);
  const mo = streetStand(X - 0.7, 10.4);
  const pip = streetStand(X + 0.5, 10.3);
  const ph = t * 0.5;
  const pipP: Pose = walkPose(pip.x, ph, pip.y + 140 * pip.scale, pip.scale, { armR: { a: 72, b: 78 }, headTilt: 7, look: 0.3 }, 1);
  const moP: Pose = walkPose(mo.x, ph + 0.7, mo.y + 140 * mo.scale, mo.scale, { armL: { a: 70, b: 80 }, armR: { a: 24 * Math.sin(ph), b: 20 } }, 1);
  const hand = toWorld(pipP, joints(pipP).armR.end);
  return (
    <g transform={camT(kf(t, [[0, pip.x - 60], [len, pip.x + 20]], (v) => v), 580, 3.0)}>
      <Street t={t + 30} id="a9st" market={1} veil={0.26} />
      <rect x={-400} y={-300} width={2720} height={1700} fill="#FFC890" opacity={0.14} style={{ mixBlendMode: 'screen' }} />
      <Hero look={MO} pose={{ ...moP, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Hero look={PIP} pose={{ ...pipP, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
      <rect x={hand.x - 6} y={hand.y - 14} width={12} height={20} rx={3} fill="#CFE6FF" transform={`rotate(-12 ${hand.x} ${hand.y})`} />
      <Glow x={hand.x} y={hand.y - 6} r={50} kind="cool" o={0.7} />
    </g>
  );
};

// ---------- A10: top-down on a desk: an open history book; its left page swings over and the book slams shut ----------
export const A10: React.FC<ShotProps> = ({ t, len }) => {
  const a = easeOut(clamp((t - 12) / 14)) * Math.PI;
  const k = Math.cos(a);
  const closed = a > 3.1;
  const sh = shake(t, 26, 8, 9);
  const W = 560;
  const H = 760;
  return (
    <g transform={`translate(${sh.x} ${sh.y})`}>
      <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.1]])}) translate(-960 -540)`}>
        <Tabletop edge={1400} wood="#7A5A3A" grain="#6A4A2E" />
        <rect x={960 - W * Math.max(0, k)} y={540 - H / 2 + 20} width={W * (1 + Math.max(0, k))} height={H} rx={20} fill="#000" opacity={0.35} />
        {/* the right half: a page of old print, or the back cover once closed */}
        <rect x={960} y={540 - H / 2} width={W} height={H} rx={14} fill={closed ? '#6E2B2B' : '#F2E6C8'} stroke="#3A2A1E" strokeWidth={6} />
        {!closed
          ? Array.from({ length: 14 }).map((_, i) => <rect key={i} x={1010} y={190 + i * 38} width={W - 100 - (i % 3) * 40} height={9} rx={4} fill="#8A7A5E" opacity={0.7} />)
          : null}
        {/* the left half swings about the spine: its width goes cos(a); past 90 degrees it shows the cover */}
        <g transform={`translate(960 540) scale(${k} 1) translate(-960 -540)`}>
          <rect x={960 - W} y={540 - H / 2} width={W} height={H} rx={14} fill={a < Math.PI / 2 ? '#EFE2C2' : '#8A3636'} stroke="#3A2A1E" strokeWidth={6} />
          {a < Math.PI / 2
            ? Array.from({ length: 14 }).map((_, i) => <rect key={i} x={1010 - W} y={190 + i * 38} width={W - 100 - ((i + 1) % 3) * 40} height={9} rx={4} fill="#8A7A5E" opacity={0.7} />)
            : <text x={960 - W / 2} y={560} textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={84} fill="#E8C86A" transform={`scale(-1 1) translate(${-(2 * (960 - W / 2))} 0)`}>SỬ</text>}
        </g>
        <rect x={960 - 5} y={540 - H / 2} width={10} height={H} fill="#3A2A1E" opacity={0.5} />
        {closed ? (
          <g>
            <rect x={960 - W} y={540 - H / 2} width={2 * W} height={H} rx={16} fill="#8A3636" stroke="#3A2A1E" strokeWidth={8} />
            <rect x={960 - W + 30} y={540 - H / 2 + 30} width={2 * W - 60} height={H - 60} rx={10} fill="none" stroke="#E8C86A" strokeWidth={5} opacity={0.8} />
            <text x={960} y={590} textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={150} fill="#E8C86A" letterSpacing={10}>LỊCH SỬ</text>
          </g>
        ) : null}
        {closed ? <Dust t={t} seed={5} x0={560} y0={200} w={800} h={500} n={24} o={0.9} /> : null}
      </g>
      <Glow x={960} y={420} r={800} o={0.2} />
    </g>
  );
};

// ---------- A11: medium: Pip draws his phone from his pocket; a call icon, then a heart, pop out of it ----------
export const A11: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 700, scale: 1.25, yaw: 0.25, look: 0.1, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 } } },
    { f: 10, p: { armR: { a: 40, b: 50 } }, ease: easeOut },
  ]);
  const hand = toWorld(pose, joints(pose).armR.end);
  const out = easeOut(clamp((t - 8) / 8));
  const ic = (at: number) => backOut(clamp((t - at) / 8));
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.2], [len, 1.35]]))}>
      <DawnAlley t={t + 260} id="a11st" blur={10} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [30, 'worried']]) }} rimId="rimR" shadow={0} />
      <g transform={`translate(${hand.x} ${hand.y - 30 * out}) rotate(-8)`} opacity={out}>
        <rect x={-18} y={-36} width={36} height={62} rx={7} fill="#16151C" stroke="#3A3846" strokeWidth={3} />
        <rect x={-14} y={-31} width={28} height={52} rx={5} fill="#CFE6FF" />
      </g>
      <Glow x={hand.x} y={hand.y - 20} r={170} kind="cool" o={0.7 * out} />
      <AppIcon kind="call" x={hand.x - 420 - 30 * Math.sin(t / 8)} y={hand.y - 200 - 8 * Math.sin(t / 6)} d={150} p={ic(31)} rot={-8} />
      <AppIcon kind="heart" x={hand.x + 190 + 30 * Math.sin(t / 7)} y={hand.y - 300 - 8 * Math.sin(t / 5)} d={150} p={ic(55)} rot={8} />
      <Sparkle x={hand.x - 420} y={hand.y - 270} t={t - 31} s={0.8} />
      <Sparkle x={hand.x + 190} y={hand.y - 370} t={t - 55} s={0.8} />
    </g>
  );
};

// ---------- A12: macro on the hoodie pocket: a wallet icon pops out beside the others, then all sink back "in your pocket" ----------
export const A12: React.FC<ShotProps> = ({ t, len }) => {
  const sink = easeOut(clamp((t - 40) / 14));
  const items: { kind: 'call' | 'chat' | 'heart' | 'wallet'; x: number; at: number }[] = [
    { kind: 'call', x: 560, at: -10 }, { kind: 'chat', x: 800, at: -4 }, { kind: 'heart', x: 1120, at: -2 }, { kind: 'wallet', x: 1360, at: 4 },
  ];
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <rect x={-300} y={-300} width={2520} height={1700} fill="#2E2B3D" />
      {Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M -300 ${i * 60 - 100} H 2200`} stroke="#25222F" strokeWidth={3} opacity={0.7} />)}
      {/* the pocket: a dark mouth with a stitched rim, the phone's light spilling out of it */}
      <path d="M 340 760 Q 960 700 1580 760 L 1620 1200 L 300 1200 Z" fill="#24212F" stroke="#121019" strokeWidth={10} />
      <path d="M 370 790 Q 960 735 1550 790" stroke="#C9A06A" strokeWidth={4} strokeDasharray="16 12" fill="none" opacity={0.7} />
      <path d="M 380 770 Q 960 715 1540 770" stroke="#0B0910" strokeWidth={46} fill="none" strokeLinecap="round" />
      <Glow x={960} y={740} r={640} kind="cool" o={0.55} />
      {items.map((it, i) => {
        const p = backOut(clamp((t - it.at) / 9)) * (1 - sink);
        const bob = Math.sin(t / 7 + i * 1.7) * 14 * (1 - sink);
        const rise = 380 - (i % 3) * 40;
        const y = 740 - rise * (1 - sink) + bob - 40 * (1 - sink);
        return <AppIcon key={it.kind} kind={it.kind} x={it.x + (960 - it.x) * sink} y={y} d={200} p={p} rot={(i - 1.5) * 6} />;
      })}
      <Sparkle x={1360} y={300} t={t - 4} s={1.1} />
      <rect x={-300} y={-300} width={2520} height={1700} fill="#0B0816" opacity={0.18} />
    </g>
  );
};
