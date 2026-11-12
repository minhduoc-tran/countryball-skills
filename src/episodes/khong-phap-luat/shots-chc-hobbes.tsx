import React from 'react';
import {
  Hero, ShotProps, LOOKS, basePose, Pose, faceAt, kf, clamp, easeOut, backOut, camT, Glow, Dust, walkPose, shake, Foreground, FONT,
} from '../../engine';
import { SleeveHand } from '../khong-ai-ngheo/cha-hospital-and-lottery-props';
import { Candle } from '../last-one/shots-chc-shared-props-and-cards';
import { Parchment, HobbesPortrait, Quill, LeviathanBook, NamePlate, InkWord, EmptyHill, INK } from './chc-hobbes-props';

// Chapter C, "week one: hobbes" (look memory): C16 a quill writing by candlelight, C17 the portrait of Thomas Hobbes with his book,
// C18 an empty hill with one lone figure, C19-C20 the five words stamped on the parchment on the voice: CÔ ĐỘC, NGHÈO KHỔ, TỒI TỆ, TÀN BẠO, NGẮN NGỦI.

// ---------- C16: a desk by candlelight; a quill writes line after line on parchment ----------
const LINES = [0, 1, 2, 3, 4];
export const C16: React.FC<ShotProps> = ({ t, len }) => {
  const sheet = { x: 700, y: 180, w: 880, h: 760 };
  const prog = (i: number) => clamp((t - 2 - i * 10) / 12);
  const cur = Math.min(4, Math.max(0, Math.floor((t - 2) / 10)));
  const p = prog(cur);
  const lineY = (i: number) => sheet.y + 150 + i * 105;
  const tipX = sheet.x + 90 + p * 560;
  const tipY = lineY(cur) + Math.sin(p * 30) * 10;
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 980]]), kf(t, [[0, 560], [len, 560]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
      <rect x={-300} y={-300} width={2520} height={1700} fill="#24150F" />
      <rect x={-300} y={640} width={2520} height={800} fill="#3A2416" opacity={0.6} />
      <g transform={`rotate(-3 ${sheet.x + sheet.w / 2} ${sheet.y + sheet.h / 2})`}>
        <rect x={sheet.x + 12} y={sheet.y + 16} width={sheet.w} height={sheet.h} fill="#000" opacity={0.4} />
        <rect x={sheet.x} y={sheet.y} width={sheet.w} height={sheet.h} fill="#E8D8AC" stroke={INK} strokeWidth={4} />
        {LINES.map((i) => {
          const q = prog(i);
          if (q <= 0) return null;
          const w = 560 * q;
          const n = Math.ceil(w / 30);
          const pts = Array.from({ length: n + 1 }).map((_, k) => `${k ? `q 8 ${k % 2 ? -26 : 16} 16 ${k % 3 ? -4 : 6} q 8 ${k % 2 ? 22 : -14} 14 ${k % 3 ? 2 : -3}` : `M ${sheet.x + 90} ${lineY(i)}`}`).join(' ');
          return <path key={i} d={pts} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
        })}
      </g>
      <Quill x={tipX} y={tipY} s={0.85} rot={-4} t={t} />
      <SleeveHand x={tipX + 100} y={tipY - 112} fx={tipX + 800} fy={tipY - 520} sleeve="#E6DED0" skin="#E0B48C" rot={-48} s={2.4} width={64} line={INK} />
      <Glow x={380} y={420} r={620} o={0.55} />
      <Candle x={360} y={900} t={t} s={1.7} glow={1} />
      <Dust t={t} seed={12} x0={200} y0={200} w={1200} h={700} n={26} o={0.5} />
    </g>
  );
};

// ---------- C17: the portrait sketch of Thomas Hobbes, his book LEVIATHAN beside it, the name plate pops in ----------
export const C17: React.FC<ShotProps> = ({ t, len }) => {
  const pop = easeOut(clamp(t / 10));
  const bookIn = easeOut(clamp((t - 6) / 12));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Parchment id="hb17" />
      <HobbesPortrait x={720} y={500} s={1.25 + 0.06 * (1 - pop)} o={0.4 + 0.6 * pop} />
      <LeviathanBook x={1330 + (1 - bookIn) * 160} y={850} s={1.35} rot={4 * bookIn} />
      <Quill x={1100} y={400 + 6 * Math.sin(t / 8)} s={0.6} rot={-26} t={t} />
      <NamePlate x={720} y={900} p={clamp((t - 7) / 9)} />
      <Dust t={t} seed={14} x0={200} y0={100} w={1500} h={800} n={24} o={0.4} />
    </g>
  );
};

// ---------- C18: an empty hill under heavy cloud; one small figure walks alone ----------
export const C18: React.FC<ShotProps> = ({ t, len }) => {
  const ph = t * 0.22;
  const x = kf(t, [[0, 620], [len, 1180]]);
  const gy = 744;
  const sc = 0.9;
  const pose = walkPose(x, ph, gy, sc, { yaw: 1, expr: 'tired', look: 0.3, headTilt: 4 }, 1);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1060]]), kf(t, [[0, 520], [len, 620]]), kf(t, [[0, 1.0], [len, 1.35]]))}>
      <EmptyHill t={t} />
      <ellipse cx={x} cy={gy + 4} rx={70} ry={10} fill="#000" opacity={0.3} />
      <Hero look={LOOKS.pip} pose={pose} rimId="rimR" shadow={0} />
      <rect x={-300} y={-300} width={2520} height={1700} fill="#2A1A10" opacity={0.22 + 0.06 * Math.sin(t / 12)} />
    </g>
  );
};

// ---------- C19: CÔ ĐỘC, NGHÈO KHỔ stamped on the parchment over a ghost of the portrait ----------
export const C19: React.FC<ShotProps> = ({ t }) => {
  const a = shake(t, 0, 7, 9);
  const b = shake(t, 20, 7, 9);
  return (
    <g transform={`translate(${a.x + b.x} ${a.y + b.y})`}>
      <g transform={camT(960, 540, kf(t, [[0, 1.0], [44, 1.06]]))}>
        <Parchment id="hb19" burn={0.7} />
        <HobbesPortrait x={1500} y={560} s={1.9} o={0.2} />
        <InkWord text="CÔ ĐỘC" x={900} y={400} t={t} t0={0} size={220} rot={-2} />
        <InkWord text="NGHÈO KHỔ" x={960} y={700} t={t} t0={20} size={210} rot={1.5} />
      </g>
    </g>
  );
};

// ---------- C20: TỒI TỆ, TÀN BẠO, NGẮN NGỦI follow; the parchment burns darker at the edges ----------
export const C20: React.FC<ShotProps> = ({ t }) => {
  const s1 = shake(t, 0, 7, 9);
  const s2 = shake(t, 20, 7, 10);
  const s3 = shake(t, 43, 8, 13);
  return (
    <g transform={`translate(${s1.x + s2.x + s3.x} ${s1.y + s2.y + s3.y})`}>
      <g transform={camT(960, 540, kf(t, [[0, 1.0], [66, 1.08]]))}>
        <Parchment id="hb20" burn={1} />
        <g opacity={0.55}><LeviathanBook x={190} y={1040} s={1.6} rot={-8} /></g>
        <rect x={-200} y={-200} width={2320} height={1480} fill="#1A0C08" opacity={0.18 + 0.2 * clamp(t / 66)} />
        <InkWord text="TỒI TỆ" x={1060} y={290} t={t} t0={0} size={190} rot={-2} />
        <InkWord text="TÀN BẠO" x={1050} y={560} t={t} t0={20} size={200} rot={1.5} />
        <InkWord text="NGẮN NGỦI" x={1090} y={830} t={t} t0={43} size={200} rot={-1} />
      </g>
    </g>
  );
};
