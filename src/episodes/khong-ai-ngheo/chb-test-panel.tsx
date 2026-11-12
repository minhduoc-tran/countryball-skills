import React from 'react';
import { Hero, poseAt, faceAt, clamp, FONT, Sparkle, Glow, Dust } from '../../engine';
import { Note } from '../tien-vo-han/chc-props-money-and-prices';
import { CaneField, FARMER, FarmerHat, CoinDisc } from './chb-props-mind';

// Chapter B (mind): the two panels of the sugarcane experiment, drawn in a 960 x 1080 box (0..960) so the same drawing
// serves a full-frame shot (scaled up) and the split screen. SAME farmer, same face, same hat, same sheet; only the mood,
// the field and the score bar differ. Also the empty-pocket insert.

const TABLE_Y = 740;

/** A 3 x 3 pattern sheet (the intelligence test) leaning on the table: shapes in eight cells, a "?" in the last. */
const Sheet: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-8} y={4} width={266} height={330} rx={8} fill="#000" opacity={0.25} />
    <rect x={-10} y={-4} width={266} height={330} rx={8} fill="#F8F2E2" stroke="#8A7A58" strokeWidth={4} />
    <path d="M 20 28 H 150" stroke="#8A7A58" strokeWidth={6} strokeLinecap="round" />
    {Array.from({ length: 9 }).map((_, i) => {
      const cx = 36 + (i % 3) * 78;
      const cy = 100 + Math.floor(i / 3) * 78;
      const k = i % 3;
      return (
        <g key={i} transform={`translate(${cx} ${cy})`}>
          <rect x={-32} y={-32} width={64} height={64} rx={6} fill="#fff" stroke="#B9AA88" strokeWidth={2.5} />
          {i === 8 ? (
            <text y={15} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={46} fill="#B5523B">?</text>
          ) : k === 0 ? (
            <circle r={17} fill="#3E7AB8" />
          ) : k === 1 ? (
            <rect x={-16} y={-16} width={32} height={32} fill="#E2574C" />
          ) : (
            <path d="M 0 -19 L 19 15 L -19 15 Z" fill="#3E8C5A" />
          )}
        </g>
      );
    })}
  </g>
);

/** `score` 0..1 fills the bar; red low, green high. */
const ScoreBar: React.FC<{ x: number; y: number; h: number; score: number }> = ({ x, y, h, score }) => {
  const col = score < 0.45 ? '#FF5A4A' : score < 0.65 ? '#F2C14E' : '#5BE08A';
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-8} y={-8} width={96} height={h + 16} rx={22} fill="#0B0816" opacity={0.7} />
      <rect x={0} y={0} width={80} height={h} rx={16} fill="#2A2638" />
      <rect x={0} y={h * (1 - score)} width={80} height={h * score} rx={16} fill={col} style={{ filter: `drop-shadow(0 0 12px ${col}99)` }} />
      <text x={40} y={-26} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill="#F6EFE3" letterSpacing={2}>ĐIỂM</text>
    </g>
  );
};

export const TestPanel: React.FC<{ id: string; t: number; mood: 'before' | 'after'; score: number; tag: string }> = ({ id, t, mood, score, tag }) => {
  const sad = mood === 'before';
  const pose = poseAt(t, [
    { f: 0, p: { x: 250, y: 690, scale: 1.1, yaw: 0.4, look: 0.5, headTilt: sad ? -6 : 3, tilt: sad ? 5 : -2, armL: { a: 20, b: 10 }, armR: { a: 58, b: 52 } } },
    { f: 20, p: { headTilt: sad ? -9 : 6, armR: { a: sad ? 54 : 150, b: sad ? 56 : 14 }, tilt: sad ? 7 : -4 } },
    { f: 40, p: { headTilt: sad ? -6 : 3 } },
  ]);
  const face = faceAt(t, sad ? [[0, 'worried']] : [[0, 'neutral'], [16, 'happy']]);
  const bob = sad ? Math.sin(t / 9) * 2 : Math.abs(Math.sin(t / 6)) * 5;
  return (
    <g>
      <g transform="translate(-480 0)"><CaneField id={`${id}f`} t={t} mood={sad ? 'dry' : 'gold'} /></g>
      <rect x={-900} y={-300} width={2800} height={1500} fill={sad ? '#1A2230' : '#FFE9B0'} opacity={sad ? 0.28 : 0.1} />
      <Hero look={FARMER} pose={{ ...pose, y: pose.y - bob, ...face }} rimId="rimR" shadow={0} />
      <FarmerHat pose={{ ...pose, y: pose.y - bob }} />
      {/* the table, the test sheet, the pencil */}
      <rect x={60} y={TABLE_Y} width={660} height={300} fill="#8A5E3E" stroke="#4E3322" strokeWidth={4} />
      <rect x={40} y={TABLE_Y - 14} width={700} height={34} rx={10} fill="#B07A4E" stroke="#4E3322" strokeWidth={4} />
      <Sheet x={400} y={TABLE_Y - 330} rot={sad ? -3 : 3} />
      {!sad ? (
        <g>
          <Note x={150} y={TABLE_Y - 40} rot={-12} s={0.8} c="#6FB38A" />
          <Note x={190} y={TABLE_Y - 54} rot={8} s={0.8} c="#7FA6D6" />
          <CoinDisc x={290} y={TABLE_Y - 30} s={0.55} />
          <Glow x={200} y={TABLE_Y - 60} r={200} o={0.5} />
          {t > 14 ? <Sparkle x={620} y={420} t={t - 14} s={1.2} /> : null}
        </g>
      ) : (
        <path d={`M 300 ${380 + Math.sin(t / 5) * 4} q 10 22 0 30 q -10 -8 0 -30`} fill="#9FD6F2" stroke="#4A7A96" strokeWidth={2.5} transform="translate(0 0)" />
      )}
      <ScoreBar x={800} y={300} h={470} score={score} />
      <Dust t={t} seed={sad ? 3 : 4} x0={40} y0={200} w={860} h={500} n={12} o={0.4} />
      {/* tag */}
      <g transform="translate(480 150)">
        <rect x={-250} y={-44} width={500} height={80} rx={40} fill="#0B0816" opacity={0.7} />
        <text y={14} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={42} fill={sad ? '#BFD0E6' : '#FFD36A'} letterSpacing={3}>{tag}</text>
      </g>
    </g>
  );
};

/** The empty pocket: dark trouser cloth with a waistband and a slanted pocket slit, the pale lining pulled out and empty,
 * one coin that falls out and rolls off. */
export const Pocket: React.FC<{ t: number }> = ({ t }) => {
  const fall = clamp((t - 10) / 14);
  const sway = Math.sin(t / 14) * 1.2;
  const coinX = fall < 1 ? 960 : 960 + (t - 24) * 14;
  const coinY = fall < 1 ? 640 + 360 * fall * fall : 1000 - Math.abs(Math.sin((t - 24) / 3)) * 30 * clamp(1 - (t - 24) / 14);
  return (
    <g>
      <rect x={-400} y={-300} width={2720} height={1500} fill="#3E4A5E" />
      {Array.from({ length: 22 }).map((_, i) => <path key={i} d={`M ${-300 + i * 110} -300 V 1200`} stroke="#34405A" strokeWidth={6} opacity={0.55} />)}
      <rect x={-400} y={-300} width={2720} height={400} fill="#2E3850" />
      <path d="M -400 100 H 2320" stroke="#7E8DA6" strokeWidth={5} strokeDasharray="22 14" opacity={0.6} />
      <circle cx={1500} cy={-20} r={40} fill="#7E8DA6" stroke="#1D2033" strokeWidth={6} />
      <path d="M 1240 180 L 760 470" stroke="#1D2033" strokeWidth={14} strokeLinecap="round" />
      <path d="M 1240 192 L 760 482" stroke="#7E8DA6" strokeWidth={4} strokeDasharray="16 12" opacity={0.7} />
      <g transform={`translate(1000 480) rotate(${sway} 0 -40)`}>
        <path d="M -190 -40 L 190 -40 L 190 150 Q 190 280 0 310 Q -190 280 -190 150 Z" fill="#E7DFC8" stroke="#8A7A58" strokeWidth={7} />
        <path d="M -190 -40 L 190 -40" stroke="#B9AA88" strokeWidth={14} />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${-80 + i * 40} 290 q ${6 - i * 3} 20 ${-6 + i * 4} 40`} stroke="#E7DFC8" strokeWidth={6} fill="none" strokeLinecap="round" />)}
        <path d="M -120 120 H 120 M -100 190 H 100" stroke="#C9BC9A" strokeWidth={5} strokeDasharray="14 12" opacity={0.7} />
      </g>
      {t >= 10 ? <CoinDisc x={coinX} y={coinY} s={1.1} rot={fall >= 1 ? (t - 24) * 24 : fall * 140} /> : <CoinDisc x={1000} y={690} s={1.1} />}
    </g>
  );
};
