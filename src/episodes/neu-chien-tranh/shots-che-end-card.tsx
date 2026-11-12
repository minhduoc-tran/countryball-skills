import React from 'react';
import { kf, clamp, easeOut, camT, backOut, FONT, Glow, Dust, ShotProps } from '../../engine';
import { DawnAlley, DawnMotes } from '../tien-vo-han/che-dawn-alley-backdrop';
import { Backpack } from './che-props-cafe-coffee-and-backpack';

// Chapter E, the end card (280.3 s to the end): the question over the alley at first light, with a schoolbag standing open
// on the left. E29 asks the question (two lines), E30 adds "Viết ở phần bình luận nhé" and holds to the end. The bottom-right
// third of the frame is left clear (no text, no props) for YouTube's end-screen elements.

const OUTLINE = { stroke: '#120B24', paintOrder: 'stroke' as const };

/** The two question lines; each pops at its own frame (null = not yet). */
const Question: React.FC<{ t: number; t1: number; t2: number | null }> = ({ t, t1, t2 }) => {
  const p1 = backOut(clamp((t - t1) / 9));
  const p2 = t2 === null ? 0 : backOut(clamp((t - t2) / 9));
  return (
    <g>
      <rect x={0} y={60} width={1920} height={340} fill="#120B24" opacity={0.42 * easeOut(clamp((t - t1) / 8))} />
      <g transform={`translate(960 190) scale(${p1})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={74} letterSpacing={2} fill="#F6EFE3" strokeWidth={11} {...OUTLINE}>NẾU CHỈ ĐƯỢC MANG MỘT CHIẾC BA LÔ,</text>
      </g>
      {p2 > 0 ? (
        <g transform={`translate(960 330) scale(${p2})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={128} fill="#FFE27A" strokeWidth={16} {...OUTLINE} style={{ filter: 'drop-shadow(0 0 24px rgba(255,170,70,0.5))' }}>BẠN SẼ BỎ GÌ VÀO?</text>
        </g>
      ) : null}
    </g>
  );
};

/** The world: the alley at dawn (soft), a bag on the left that sways a little, a question mark floating above it. */
const World: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const sway = Math.sin(t / 26) * 2;
  const bob = Math.sin(t / 17) * 10;
  return (
    <g>
      <DawnAlley t={t + 700} id={id} blur={6} />
      <rect x={-100} y={-100} width={2120} height={1280} fill="#2A1830" opacity={0.18} />
      <Glow x={680} y={760} r={520} o={0.4} />
      <Backpack x={620} y={1010} s={2.3} rot={sway} col="#D9733A" />
      <g transform={`translate(620 ${470 + bob})`}>
        <ellipse rx={70} ry={60} fill="#F6EFE3" stroke="#1A1230" strokeWidth={4} />
        <text y={22} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={88} fill="#FF8A3D">?</text>
      </g>
      <DawnMotes t={t} seed={29} />
      <Dust t={t} seed={291} x0={200} y0={450} w={700} h={500} n={16} o={0.45} />
    </g>
  );
};

// ---------- E29: the question appears over the alley and the bag ----------
export const E29: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 960], [len, 990]]), kf(t, [[0, 540], [len, 520]]), kf(t, [[0, 1.0], [len, 1.05]]))}>
      <World t={t} id="e29st" />
    </g>
    <Question t={t} t1={4} t2={56} />
  </g>
);

// ---------- E30: the same card; "Viết ở phần bình luận nhé" joins it, and it holds through the end of the voice and the tail ----------
export const E30: React.FC<ShotProps> = ({ t, len }) => {
  const p = backOut(clamp((t - 4) / 9));
  return (
    <g>
      <g transform={camT(kf(t, [[0, 990], [len, 1010]]), kf(t, [[0, 520], [len, 510]]), kf(t, [[0, 1.05], [len, 1.1]]))}>
        <World t={t + 101} id="e30st" />
      </g>
      <Question t={t + 101} t1={4} t2={56} />
      <g transform={`translate(1100 565) scale(${p})`}>
        <text textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={80} fill="#F6EFE3" strokeWidth={12} {...OUTLINE}>Viết ở phần bình luận nhé</text>
      </g>
    </g>
  );
};
