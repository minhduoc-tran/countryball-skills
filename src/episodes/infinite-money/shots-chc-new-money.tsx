import React from 'react';
import { Schematic, SchLabel, DrawOn, SCH, clamp, kf, rnd, ShotProps } from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { Note, NotePile, BlackCard, PosTerminal, NOTE_COLS } from './chc-props-money-and-prices';

// Chapter C, beat "new money": the swipe (C1), the money pouring into the economy's jar (C2) and the shelf of goods
// that stays the same size while the money piles up and the scale tips (C3).

// ---------- C1: macro insert. Pip's hand taps the black card on the terminal: ripple, green tick ----------
export const C1: React.FC<ShotProps> = ({ t }) => {
  const cx = kf(t, [[0, 330], [12, 760], [22, 1010], [26, 1010], [38, 820]], (v) => v);
  const cy = kf(t, [[0, 900], [12, 640], [22, 360], [26, 360], [38, 520]], (v) => v);
  const rot = kf(t, [[0, -24], [22, -6], [38, -16]]);
  const press = 1 - 0.06 * Math.sin(clamp((t - 20) / 8) * Math.PI);
  const ok = clamp((t - 23) / 4);
  const ring = (k: number) => clamp((t - 22 - k * 4) / 14);
  return (
    <g>
      <rect x={-100} y={-100} width={2200} height={1300} fill="#1B1422" />
      <g filter="url(#blur16)">
        {[[300, 260, 150, '#FFB46A'], [620, 820, 110, '#E9794A'], [1620, 200, 130, '#FFD9A0'], [1760, 760, 170, '#C8483E'], [140, 640, 90, '#FFD9A0']].map(([x, y, r, c], i) => (
          <circle key={i} cx={x as number} cy={y as number} r={r as number} fill={c as string} opacity={0.35} />
        ))}
      </g>
      <PosTerminal x={1250} y={640} s={1.2} ok={ok} t={t} rot={-3} />
      {[0, 1, 2].map((k) => (
        <circle key={k} cx={1190} cy={300} r={60 + ring(k) * 220} fill="none" stroke="#7FE0A8" strokeWidth={8 * (1 - ring(k))} opacity={ring(k) > 0 ? 0.9 * (1 - ring(k)) : 0} />
      ))}
      <g transform={`translate(${cx} ${cy}) scale(${press}) translate(${-cx} ${-cy})`}>
        <BlackCard x={cx} y={cy} rot={rot} s={1.25} />
        <InsertArm x={cx - 150} y={cy + 70} fx={-200} fy={1180} fist rot={-30} s={4.6} />
      </g>
    </g>
  );
};

// ---------- C2: the economy as a glass jar; the card icon feeds it through a pipe, notes pouring in ----------
const JAR = 'M 1190 330 H 1470 V 372 Q 1570 400 1570 470 V 840 Q 1570 900 1510 900 H 1150 Q 1090 900 1090 840 V 470 Q 1090 400 1190 372 Z';
export const C2: React.FC<ShotProps> = ({ t, len }) => {
  const level = kf(t, [[0, 0.1], [len, 0.86]], (v) => v);
  const top = 880 - level * 460;
  const sc = kf(t, [[0, 1], [len, 1.06]]);
  const draw = clamp(t / 12);
  const pulse = (t % 20) / 20;
  return (
    <g transform={`translate(960 540) scale(${sc}) translate(-960 -540)`}>
      <Schematic t={t} id="c2s" />
      {/* the card icon, pulsing on every swipe */}
      <g transform={`translate(300 560) scale(${1.25 * (1 + 0.08 * Math.max(0, 1 - pulse * 4))})`} stroke={SCH.live} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 12px ${SCH.glow})` }}>
        <rect x={-100} y={-64} width={200} height={128} rx={16} />
        <rect x={-76} y={-30} width={42} height={32} rx={6} />
        <path d="M -76 30 H 40 M -76 46 H 0" />
      </g>
      <SchLabel x={300} y={720} t={t - 2} text="TAP" size={34} color={SCH.live} anchor="middle" />
      {/* the pipe: a thick line over a thinner ground-coloured one reads as an outlined tube */}
      <path d="M 440 560 H 700 V 250 H 1330 V 335" stroke={SCH.line} strokeWidth={66} fill="none" strokeLinejoin="round" strokeDasharray={`${draw * 2000} 2000`} />
      <path d="M 440 560 H 700 V 250 H 1330 V 335" stroke={SCH.ground} strokeWidth={52} fill="none" strokeLinejoin="round" strokeDasharray={`${draw * 2000} 2000`} />
      <SchLabel x={870} y={190} t={t - 6} text="NEW MONEY" size={40} color={SCH.live} anchor="middle" />
      {/* the jar, its fill clipped to its outline */}
      <defs><clipPath id="c2jar"><path d={JAR} /></clipPath></defs>
      <g clipPath="url(#c2jar)">
        <rect x={1080} y={top - 14} width={500} height={600} fill="#2E7A57" opacity={0.75} />
        {Array.from({ length: 22 }).map((_, i) => {
          const r = Math.floor(i / 5);
          const y = top + 26 + r * 30;
          return y < 900 ? <Note key={i} x={1140 + (i % 5) * 86 + (r % 2) * 40} y={y} rot={(rnd(4, i) - 0.5) * 24} s={0.5} c={NOTE_COLS[i % 3]} /> : null;
        })}
      </g>
      <DrawOn d={JAR} t={t} dur={14} width={6} />
      <rect x={1170} y={298} width={320} height={34} rx={10} fill={SCH.ground} stroke={SCH.line} strokeWidth={6} />
      <SchLabel x={1330} y={975} t={t - 8} text="ECONOMY" size={44} anchor="middle" />
      {/* notes ride the pipe, then fall into the jar */}
      {Array.from({ length: 12 }).map((_, i) => {
        const ph = (t * 0.03 + i / 12) % 1;
        const along = ph < 0.55;
        const d = (ph / 0.55) * 1140; // distance along the pipe: 260 right, 310 up, 630 right
        const fall = Math.pow((ph - 0.55) / 0.45, 1.5);
        const x = !along ? 1330 + Math.sin(i * 3 + t / 4) * 36 : d < 260 ? 440 + d : d < 570 ? 700 : 700 + (d - 570);
        const y = !along ? 335 + (top - 335) * fall : d < 260 ? 560 : d < 570 ? 560 - (d - 260) : 250;
        return <Note key={i} x={x} y={y} rot={along ? 0 : Math.sin(t / 5 + i) * 30} s={along ? 0.34 : 0.5} c={NOTE_COLS[i % 3]} o={ph > 0.97 ? 0 : 1} />;
      })}
    </g>
  );
};

// ---------- C3: goods (the shelf) stay the same size; the money piles up and the scale tips toward it ----------
const Goods: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => {
  const c = SCH.line;
  return (
    <g stroke={c} strokeWidth={4} fill={`${c}18`} strokeLinejoin="round" strokeLinecap="round">
      {k === 0 ? <rect x={x - 70} y={y - 62} width={64} height={62} rx={4} /> : null}
      {k === 1 ? <path d={`M ${x - 28} ${y} v -52 q 0 -14 8 -22 v -22 h 28 v 22 q 8 8 8 22 v 52 z`} /> : null}
      {k === 2 ? <path d={`M ${x - 30} ${y} v -50 h 60 v 50 z M ${x - 30} ${y - 30} h 60`} /> : null}
      {k === 3 ? <path d={`M ${x - 40} ${y} q 0 -52 40 -52 q 40 0 40 52 z`} /> : null}
    </g>
  );
};
const Shelf: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <path d={`M ${x} ${y} V ${y + 480} M ${x + 450} ${y} V ${y + 480}`} stroke={SCH.line} strokeWidth={6} strokeLinecap="round" />
    {[0, 1, 2].map((r) => (
      <g key={r}>
        <path d={`M ${x - 14} ${y + 160 * (r + 1)} H ${x + 464}`} stroke={SCH.line} strokeWidth={6} strokeLinecap="round" />
        {[0, 1, 2, 3].map((c) => <Goods key={c} x={x + 70 + c * 105} y={y + 160 * (r + 1) - 4} k={(r + c) % 4} />)}
      </g>
    ))}
  </g>
);

export const C3: React.FC<ShotProps> = ({ t, len }) => {
  const th = kf(t, [[0, -2], [24, 3], [len, 15]]);
  const L = 330;
  const rad = (th * Math.PI) / 180;
  const lx = 1330 - L * Math.cos(rad), ly = 380 - L * Math.sin(rad);
  const rx = 1330 + L * Math.cos(rad), ry = 380 + L * Math.sin(rad);
  const hang = 190;
  const n = kf(t, [[0, 2], [len, 34]], (v) => v);
  const Pan: React.FC<{ x: number; y: number }> = ({ x, y }) => (
    <g>
      <path d={`M ${x} ${y} L ${x - 130} ${y + hang} M ${x} ${y} L ${x + 130} ${y + hang}`} stroke={SCH.line} strokeWidth={4} />
      <path d={`M ${x - 150} ${y + hang} Q ${x} ${y + hang + 56} ${x + 150} ${y + hang} Z`} fill={SCH.ground} stroke={SCH.line} strokeWidth={6} strokeLinejoin="round" />
    </g>
  );
  return (
    <g>
      <Schematic t={t} id="c3s" />
      <Shelf x={110} y={410} />
      <SchLabel x={335} y={300} t={t - 2} text="GOODS" size={42} anchor="middle" />
      <SchLabel x={335} y={375} t={t - 8} text="NEW: +0" size={46} color="#FF6A5A" anchor="middle" />
      <path d="M 1330 380 V 900 M 1200 900 H 1460" stroke={SCH.line} strokeWidth={8} strokeLinecap="round" />
      <path d={`M ${lx} ${ly} L ${rx} ${ry}`} stroke={SCH.line} strokeWidth={10} strokeLinecap="round" />
      <circle cx={1330} cy={380} r={16} fill={SCH.ground} stroke={SCH.line} strokeWidth={6} />
      <Pan x={lx} y={ly} />
      <Pan x={rx} y={ry} />
      <g transform={`translate(${lx} ${ly + hang + 30})`}>
        {[0, 1, 2].map((k) => <Goods key={k} x={-60 + k * 60} y={0} k={k + 1} />)}
      </g>
      <NotePile x={rx} y={ry + hang + 30} n={n} s={0.8} />
      <SchLabel x={1330} y={975} t={t - 14} text="MONEY ↑" size={50} color={SCH.live} anchor="middle" />
    </g>
  );
};
