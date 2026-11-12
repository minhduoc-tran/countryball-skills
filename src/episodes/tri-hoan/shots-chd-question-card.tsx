import React from 'react';
import {
  Hero, Pose, faceAt, kf, clamp, easeOut, backOut, camT, Glow, Sparkle, rnd, FONT, ShotProps,
} from '../../engine';
import { PIP, Sticky } from './chd-desk-props';
import { INK, CREAM, MonoPill } from './chd-card-props';
import { Porch, Bench, Guitar, Notes, benchPose, SIT_SEAT_Y } from './chd-country-props';
import { GRANDMA } from '../khong-ai-ngheo/cast-looks';

// Chapter D, "7 question" (232.00-242.22 s): the end card over the porch at dusk. Pip and grandma sit at the LEFT; the title is at
// the top; the bottom-right third stays empty for YouTube's end-screen elements.
//   D37 "Còn bạn," Pip turns to us, D38 the question pops, D39 "Viết ở phần bình luận nhé", D40 MAI LÀM is crossed out,
//   D41 it becomes NGAY BÂY GIỜ and the picture fades out.

const L38 = 64; // frames of D38 (233.10 -> 235.24)
const L39 = 45; // D39 (235.24 -> 236.74)
const L40 = 52; // D40 (236.74 -> 238.46)
const SHIFT = -470; // the whole porch scene slides left so the right third is clear

/** The dusk porch with the two on the bench (slid left), Pip optionally turned to the viewer. */
const EndWorld: React.FC<{ t: number; id: string; toCamera?: number }> = ({ t, id, toCamera = 0 }) => {
  const wob = Math.sin(t * 0.8);
  const px = 850;
  const pip: Pose = benchPose(px, { yaw: 0.6 * (1 - toCamera), look: 0.6 * (1 - toCamera), headTilt: 3 + wob * 2 * (1 - toCamera), armR: { a: 36 + 10 * wob * (1 - toCamera), b: 44 }, armL: { a: -62, b: -6 }, ...faceAt(t, [[0, 'happy'], [10, toCamera > 0 ? 'neutral' : 'happy']]) });
  const gm: Pose = benchPose(1215, { yaw: -0.6, facing: -1, look: -0.6, headTilt: -3 + Math.sin(t / 9) * 2, armL: { a: 20, b: 10 }, ...faceAt(t, [[0, 'happy']]) });
  return (
    <g transform={`translate(${SHIFT} 110)`}>
      <Porch id={id} t={t + 120} dusk={1} />
      <Bench x0={620} x1={1400} y={SIT_SEAT_Y} />
      <Hero look={GRANDMA} pose={gm} rimId="rimR" shadow={0} />
      <Hero look={PIP} pose={pip} rimId="rimR" shadow={0} />
      <Guitar x={px + 62} y={800 - 68 * 1.4 - 66} rot={76} s={0.6} t={t} strum={0.5} shine={0.4} />
      <Notes x={px + 180} y={700} t={t} n={4} s={1} />
      <Glow x={960} y={270} r={420} o={0.5} />
    </g>
  );
};

/** The dusk grade over the whole card (a violet veil, kept light so the characters stay bright). */
const DuskVeil: React.FC = () => (
  <g>
    <rect x={-400} y={-400} width={2720} height={1900} fill="#2A1450" opacity={0.28} />
    <rect x={-400} y={-400} width={2720} height={1900} fill="#FF8A5A" opacity={0.1} style={{ mixBlendMode: 'overlay' }} />
  </g>
);

/** The two-line question at the top; pops at t1 (null = hidden). T is the continuous clock across D38-D41. */
const Title: React.FC<{ T: number; t1: number | null; small?: boolean }> = ({ T, t1, small = false }) => {
  if (t1 === null) return null;
  const k = backOut(clamp((T - t1) / 9));
  if (k <= 0) return null;
  const sz = small ? 88 : 104;
  return (
    <g transform={`translate(960 ${small ? 110 : 150}) scale(${k})`}>
      {['BẠN ĐÃ ĐỂ MAI VIỆC GÌ', 'QUÁ LÂU RỒI?'].map((line, i) => (
        <text key={i} y={i * (sz * 1.02)} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={sz} letterSpacing={2} fill="#FFE27A" stroke="#241236" strokeWidth={sz / 5.5} paintOrder="stroke" style={{ filter: 'drop-shadow(0 0 22px rgba(255,200,90,0.45))' }}>{line}</text>
      ))}
    </g>
  );
};

/** A little comment bubble with three bouncing dots. */
const CommentBubble: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  const k = backOut(clamp(t / 9));
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} opacity={t < 0 ? 0 : 1}>
      <path d="M -120 -60 Q -120 -90 -90 -90 L 90 -90 Q 120 -90 120 -60 L 120 40 Q 120 70 90 70 L -30 70 L -80 112 L -70 70 L -90 70 Q -120 70 -120 40 Z" fill={CREAM} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      {[-48, 0, 48].map((dx, i) => <circle key={i} cx={dx} cy={-10 - 14 * Math.max(0, Math.sin(t / 4 - i * 0.9))} r={14} fill={INK} />)}
    </g>
  );
};

// ---------- D37: "Còn bạn,": Pip turns and looks straight at us, a MAI LÀM note drifts into view ----------
export const D37: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <EndWorld t={t} id="d37p" toCamera={easeOut(clamp((t - 4) / 8))} />
    <DuskVeil />
    <Sticky x={kf(t, [[6, 1000], [len, 1110]])} y={kf(t, [[6, 470], [len, 430]])} s={1.6 * backOut(clamp((t - 6) / 8))} rot={-6 + Math.sin(t / 7) * 3} />
  </g>
);

// ---------- D38: the question pops on top; MAI LÀM notes pile up near Pip ("để mai quá lâu") ----------
export const D38: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.05], [len, 1.0]]))}>
    <EndWorld t={t + 33} id="d38p" toCamera={1} />
    <DuskVeil />
    {[[960, 750, -8], [1090, 680, 6], [1160, 780, -4], [1030, 590, 9]].map(([x, y, r], i) => {
      const k = backOut(clamp((t - 14 - i * 5) / 8));
      return k > 0 ? <Sticky key={i} x={x} y={y} s={0.9 * k} rot={r} /> : null;
    })}
    <Title T={t} t1={4} />
  </g>
);

// ---------- D39: "Viết ở phần bình luận nhé" joins the card, a comment bubble types ----------
export const D39: React.FC<ShotProps> = ({ t, len }) => {
  const T = t + L38;
  return (
    <g transform={camT(960, 540, 1.0)}>
      <EndWorld t={t + 33 + L38} id="d39p" toCamera={1} />
      <DuskVeil />
      {[[960, 750, -8], [1090, 680, 6], [1160, 780, -4], [1030, 590, 9]].map(([x, y, r], i) => <Sticky key={i} x={x} y={y} s={0.9} rot={r} />)}
      <Title T={T} t1={4} />
      <MonoPill x={960} y={350} t={t - 2} text="Viết ở phần bình luận nhé" size={44} />
      <CommentBubble x={1160} y={470} t={t - 8} />
    </g>
  );
};

// ---------- D40: "đừng để mai": a big MAI LÀM note, struck out with a red X ----------
export const D40: React.FC<ShotProps> = ({ t, len }) => {
  const T = t + L38 + L39;
  const s = 2.3 * backOut(clamp(t / 8));
  return (
    <g transform={camT(960, 540, 1.0)}>
      <EndWorld t={t + 33 + L38 + L39} id="d40p" toCamera={1} />
      <DuskVeil />
      <Title T={T} t1={4} small />
      <g transform={`translate(1120 ${650 + Math.sin(t / 10) * 4})`}>
        <Sticky x={0} y={0} s={s} rot={-5} cross={easeOut(clamp((t - 18) / 10)) + easeOut(clamp((t - 27) / 10))} />
      </g>
      <Sparkle x={1180} y={520} t={t - 36} s={1.2} />
    </g>
  );
};

// ---------- D41: NGAY BÂY GIỜ is written on a fresh note; hold, then fade out ----------
export const D41: React.FC<ShotProps> = ({ t, len }) => {
  const T = t + L38 + L39 + L40;
  const reveal = easeOut(clamp((t - 8) / 22));
  const old = clamp((t - 6) / 10);
  const fade = easeOut(clamp((t - (len - 26)) / 24));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.04]]))}>
      <EndWorld t={t + 33 + L38 + L39 + L40} id="d41p" toCamera={1} />
      <DuskVeil />
      <Title T={T} t1={4} small />
      <g transform={`translate(${1120 - 130 * old} ${650 - 60 * old})`} opacity={1 - old}>
        <Sticky x={0} y={0} s={2.3 * (1 - 0.6 * old)} rot={-5} cross={2} />
      </g>
      <g transform={`translate(1110 650) rotate(3) scale(${backOut(clamp((t - 6) / 8))})`} opacity={t > 6 ? 1 : 0}>
        <defs><clipPath id="d41clip"><rect x={-200} y={-200} width={400 * reveal} height={420} /></clipPath></defs>
        <rect x={-170} y={-150} width={340} height={340} fill="#000" opacity={0.25} transform="translate(14 16)" />
        <rect x={-170} y={-170} width={340} height={340} fill="#7BE0A0" />
        <rect x={-170} y={-170} width={340} height={40} fill="#000" opacity={0.07} />
        <g clipPath="url(#d41clip)">
          <text y={-10} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={84} fill="#134A2A">NGAY</text>
          <text y={102} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={84} fill="#134A2A">BÂY GIỜ</text>
        </g>
      </g>
      <Sparkle x={1260} y={450} t={t - 30} s={1.6} />
      <Sparkle x={850} y={820} t={t - 36} s={1.2} />
      <rect x={-400} y={-400} width={2720} height={1900} fill="#000" opacity={fade} />
    </g>
  );
};
