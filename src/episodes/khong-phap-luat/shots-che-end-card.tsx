import React from 'react';
import { kf, clamp, easeOut, backOut, camT, Glow, FONT, Sparkle, Dust, rnd, ShotProps } from '../../engine';
import { DawnAlley } from '../tien-vo-han/che-dawn-alley-backdrop';
import { NeighbourBoard } from './che-law-book-and-board-props';
import { Pencil } from './che-hands-and-sleeves';

// Chapter E, "7 question": the end card (258.5-266.6 s), look "peace". The neighbourhood's rule board (rules 1 and 2 are
// written, "ĐIỀU 3: ......" waits) under a blurred dawn alley. Everything sits in the top and left of the frame: the
// bottom-right third (x > 1280, y > 720) stays clear for YouTube's end-screen elements.

const ROWS = (t: number) => [
  { text: 'ĐIỀU 1: KHÔNG LẤY ĐỒ CỦA NGƯỜI KHÁC', reveal: easeOut(clamp((t - 4) / 14)) },
  { text: 'ĐIỀU 2: CHẠY CHẬM QUA CỔNG TRƯỜNG', reveal: easeOut(clamp((t - 12) / 14)) },
];
const BOARD = { x: 780, y: 590, s: 0.74 };

const World: React.FC<{ t: number; id: string; pencilBob: number; scribble?: number }> = ({ t, id, pencilBob, scribble = 0 }) => {
  // the blank line's baseline in world coordinates; the pencil tip hovers just after the dots
  const tipX = BOARD.x + BOARD.s * -215, tipY = BOARD.y + BOARD.s * (-24 + 2 * 112) - 2 + pencilBob;
  return (
    <g>
      <DawnAlley t={t + 60} id={id} blur={10} />
      <rect x={-200} y={-200} width={2320} height={1480} fill="#1A1020" opacity={0.28} />
      {Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={100 + i * 190 + rnd(3, i) * 60} cy={70 + Math.sin(t / 20 + i) * 8 + (i % 2) * 26} r={16} fill="#FFD27A" opacity={0.5} />)}
      <Glow x={BOARD.x} y={BOARD.y} r={760} o={0.35} />
      <NeighbourBoard x={BOARD.x} y={BOARD.y} s={BOARD.s} t={t} rows={ROWS(t)} blank={easeOut(clamp((t - 26) / 8))} />
      <Pencil x={tipX} y={tipY} rot={-17} s={0.95} />
      {scribble > 0 ? <path d={`M ${tipX - 90} ${tipY + 2} q 10 -14 20 0 t 20 0 t 20 0 t 20 0`} stroke="#FFE27A" strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="200" strokeDashoffset={200 * (1 - scribble)} /> : null}
      <Dust t={t} seed={11} x0={80} y0={250} w={1200} h={600} n={20} o={0.35} />
    </g>
  );
};

/** The headline over the board, on the screen: line 1 pops at t1, line 2 at t2. */
const Headline: React.FC<{ t: number; t1: number; t2: number }> = ({ t, t1, t2 }) => {
  const p1 = backOut(clamp((t - t1) / 9)), p2 = backOut(clamp((t - t2) / 9));
  return (
    <g>
      <g transform={`translate(960 96) scale(${p1})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={60} letterSpacing={2} fill="#F6EFE3" stroke="#120B24" strokeWidth={10} paintOrder="stroke">NẾU ĐƯỢC VIẾT ĐIỀU LUẬT ĐẦU TIÊN,</text>
      </g>
      <g transform={`translate(960 196) scale(${p2})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={100} letterSpacing={2} fill="#FFD84A" stroke="#120B24" strokeWidth={14} paintOrder="stroke" style={{ filter: 'drop-shadow(0 0 22px rgba(255,200,60,0.5))' }}>BẠN SẼ VIẾT GÌ?</text>
      </g>
    </g>
  );
};

// ---------- E24: the question lands on the board; rules 1 and 2 write themselves, rule 3 waits ----------
export const E24: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 940], [len, 900]]), 540, kf(t, [[0, 1.0], [len, 1.04]]))}>
      <World t={t} id="e24st" pencilBob={Math.sin(t / 8) * 10} />
    </g>
    <Headline t={t} t1={2} t2={Math.min(69, len - 12)} />
  </g>
);

// ---------- E25: the invitation: "Viết ở phần bình luận nhé" bottom left, the pencil scribbling a few strokes, fade out ----------
export const E25: React.FC<ShotProps> = ({ t, len }) => {
  const p = backOut(clamp((t - 3) / 9));
  const fade = clamp((t - (len - 16)) / 14);
  return (
    <g>
      <g transform={camT(kf(t, [[0, 900], [len, 860]]), 540, kf(t, [[0, 1.04], [len, 1.09]]))}>
        <World t={t + 100} id="e25st" pencilBob={Math.sin(t / 7) * 12 - 4} scribble={clamp((t - 20) / 20)} />
      </g>
      <Headline t={t + 200} t1={0} t2={0} />
      <g transform={`translate(640 930) scale(${p})`}>
        <rect x={-440} y={-62} width={880} height={110} rx={55} fill="#120B24" opacity={0.8} />
        <rect x={-440} y={-62} width={880} height={110} rx={55} fill="none" stroke="#FFD84A" strokeWidth={5} />
        <text y={20} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={62} fill="#F6EFE3">Viết ở phần bình luận nhé</text>
      </g>
      <Sparkle x={1100} y={930} t={t - 12} s={0.8} />
      <rect x={0} y={0} width={1920} height={1080} fill="#000" opacity={fade} />
    </g>
  );
};
