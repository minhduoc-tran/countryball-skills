import React from 'react';
import { FONT, backOut, clamp, easeOut, rnd } from '../../engine';

// Chapter B local props for "day one" (panic buying): instant-noodle packs, a shopping bag, a motorbike rider, a clock
// face racing through two hours, an ATM, a price tag that flips up. All pure functions of the shot clock.
//   <NoodlePack x y w h c rot />      x, y the bottom centre; c picks a colour
//   <ShopBag x y s full />            x, y the handle's top (the hand); the bag hangs below
//   <Rider x y s facing c />          a generic rider seated on a Motorbike drawn at the same x, y, s, facing
//   <ClockFace x y r hours />         analog + digital; `hours` 0..2 elapsed
//   <AtmMacro t err />                full-frame ATM close-up (1920 x 1080 world), `err` frames since "HẾT TIỀN" (-1: none)
//   <PriceTag x y t at from to s />   hangs from a string; at frame `at` it flips to the higher price

const INK = '#12101C';
const PACK_COL = ['#E4572E', '#F6B93B', '#D94452', '#F28F3B', '#E8A23A'];

export const NoodlePack: React.FC<{ x: number; y: number; w?: number; h?: number; c?: number; rot?: number }> = ({ x, y, w = 70, h = 96, c = 0, rot = 0 }) => {
  const col = PACK_COL[c % PACK_COL.length];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M ${-w / 2} 0 L ${-w / 2 + 3} ${-h} L ${w / 2 - 3} ${-h} L ${w / 2} 0 Z`} fill={col} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <path d={`M ${-w / 2 + 3} ${-h} L ${w / 2 - 3} ${-h}`} stroke="#FFF1CC" strokeWidth={5} strokeDasharray="3 3" />
      <path d={`M ${-w / 2} -4 L ${w / 2} -4`} stroke="#FFF1CC" strokeWidth={4} strokeDasharray="3 3" />
      <rect x={-w / 2 + 6} y={-h * 0.62} width={w - 12} height={h * 0.34} rx={6} fill="#FFF1CC" />
      <path d={`M ${-w / 2 + 10} ${-h * 0.45} q ${w * 0.1} -9 ${w * 0.2} 0 t ${w * 0.2} 0 t ${w * 0.2} 0`} stroke={col} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <path d={`M ${-w / 2 + 6} ${-h * 0.9} L ${-w / 2 + 8} ${-h * 0.3}`} stroke="#FFFFFF" strokeWidth={3} opacity={0.28} />
    </g>
  );
};

export const ShopBag: React.FC<{ x: number; y: number; s?: number; full?: boolean; c?: number }> = ({ x, y, s = 1, full = true, c = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {full ? (
      <g>
        <NoodlePack x={-22} y={42} w={50} h={70} c={c} rot={-14} />
        <NoodlePack x={20} y={40} w={50} h={74} c={c + 2} rot={12} />
      </g>
    ) : null}
    <path d="M -34 36 Q -50 80 -40 150 Q 0 164 40 150 Q 50 80 34 36 Z" fill="#E9E6EE" stroke={INK} strokeWidth={4} strokeLinejoin="round" opacity={0.92} />
    <path d="M -26 56 Q -34 100 -28 142" stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={0.5} />
    <path d="M -34 36 Q -22 -10 -8 6 M 34 36 Q 22 -10 8 6" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d="M -30 92 Q 0 100 30 92 M -34 120 Q 0 128 34 120" stroke={PACK_COL[c % 5]} strokeWidth={9} fill="none" opacity={0.5} />
  </g>
);

const RIDER_COL = ['#3E6A8A', '#B5523B', '#5E6E46', '#7A5A8A', '#D9A441'];
export const Rider: React.FC<{ x: number; y: number; s?: number; facing?: 1 | -1; c?: number; sway?: number }> = ({ x, y, s = 1, facing = 1, c = 0, sway = 0 }) => {
  const jacket = RIDER_COL[c % RIDER_COL.length];
  return (
    <g transform={`translate(${x} ${y}) scale(${s * facing} ${s})`}>
      <g transform={`rotate(${sway} -30 -90)`}>
        <path d="M -52 -92 Q -56 -150 -40 -176 Q -22 -184 -14 -168 Q -10 -128 -4 -100 Z" fill={jacket} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <path d="M -14 -150 Q 30 -146 62 -112" stroke={jacket} strokeWidth={17} fill="none" strokeLinecap="round" />
        <circle cx={64} cy={-110} r={8} fill="#F2C9A0" />
        <path d="M -8 -96 Q 14 -90 20 -64 L 30 -34" stroke="#3A3446" strokeWidth={18} fill="none" strokeLinecap="round" />
        <circle cx={-28} cy={-200} r={21} fill="#F2C9A0" stroke={INK} strokeWidth={3.5} />
        <path d="M -50 -204 A 23 23 0 0 1 -6 -208 L -8 -194 L -50 -194 Z" fill={jacket === '#D9A441' ? '#2E2B3D' : '#EDE6D6'} stroke={INK} strokeWidth={3} />
      </g>
    </g>
  );
};

/** An analog clock with a digital readout: `hours` 0..2 elapsed (the minute hand whirls twice). */
export const ClockFace: React.FC<{ x: number; y: number; r?: number; hours: number; accent?: string }> = ({ x, y, r = 150, hours, accent = '#FF8A3D' }) => {
  const mins = Math.floor((hours % 1) * 60);
  const hh = Math.floor(hours + 0.0001);
  const shown = hours >= 1.995 ? '2:00' : `${hh}:${String(mins).padStart(2, '0')}`;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 12} fill="#1A1922" stroke="#3E3C4C" strokeWidth={6} />
      <circle r={r} fill="#F6EFE3" />
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d={`M 0 ${-r + 8} L 0 ${-r + (i % 3 === 0 ? 30 : 20)}`} stroke={INK} strokeWidth={i % 3 === 0 ? 8 : 4} strokeLinecap="round" transform={`rotate(${i * 30})`} />
      ))}
      <path d={`M 0 0 L 0 ${-r * 0.5}`} stroke={INK} strokeWidth={11} strokeLinecap="round" transform={`rotate(${hours * 30})`} />
      <path d={`M 0 0 L 0 ${-r * 0.8}`} stroke={accent} strokeWidth={7} strokeLinecap="round" transform={`rotate(${hours * 360})`} />
      <circle r={10} fill={INK} />
      <rect x={-r * 0.5} y={r * 0.38} width={r} height={r * 0.42} rx={10} fill="#0B0A10" />
      <text x={0} y={r * 0.72} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={r * 0.36} fill={accent}>{shown}</text>
    </g>
  );
};

/** The ATM close-up filling the frame. `err` = frames since the screen says HẾT TIỀN (-1: still "..."). */
export const AtmMacro: React.FC<{ t: number; err: number }> = ({ t, err }) => {
  const blink = Math.floor(t / 6) % 2 ? 1 : 0.55;
  const pop = err >= 0 ? backOut(clamp(err / 6)) : 0;
  const shake = err >= 0 && err < 8 ? Math.sin(err * 3) * 5 : 0;
  return (
    <g>
      <defs>
        <linearGradient id="chbAtmBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3F4A66" /><stop offset="1" stopColor="#262C42" /></linearGradient>
        <radialGradient id="chbAtmWall" cx="0.5" cy="0.4" r="0.8"><stop offset="0" stopColor="#59506E" /><stop offset="1" stopColor="#1E1A2C" /></radialGradient>
      </defs>
      <rect x={-300} y={-300} width={2520} height={1680} fill="url(#chbAtmWall)" />
      <rect x={300} y={-100} width={1320} height={1300} rx={50} fill="url(#chbAtmBody)" stroke={INK} strokeWidth={8} />
      <rect x={300} y={-100} width={1320} height={26} fill="#E8453C" />
      <rect x={330} y={-60} width={1260} height={10} fill="#FFFFFF" opacity={0.08} />
      {/* screen */}
      <rect x={470} y={90} width={980} height={520} rx={28} fill="#0B0A10" stroke="#5A5870" strokeWidth={10} />
      <g transform={`translate(${shake} 0)`}>
        <rect x={494} y={114} width={932} height={472} rx={16} fill={err >= 0 ? '#8E1A22' : '#2C4A78'} />
        <rect x={494} y={114} width={932} height={90} rx={16} fill="#000" opacity={0.25} />
        <text x={960} y={176} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={44} fill="#FFF4E0" opacity={0.85} letterSpacing={4}>RÚT TIỀN</text>
        {err < 0 ? (
          <g>
            {[0, 1, 2].map((i) => <circle key={i} cx={880 + i * 80} cy={380} r={18} fill="#FFF4E0" opacity={0.35 + 0.65 * (Math.floor(t / 5) % 3 === i ? 1 : 0)} />)}
          </g>
        ) : (
          <g transform={`translate(960 390) scale(${pop})`}>
            <circle cx={0} cy={-100} r={46} fill="none" stroke="#FFF4E0" strokeWidth={9} />
            <path d="M -18 -118 L 18 -82 M 18 -118 L -18 -82" stroke="#FFF4E0" strokeWidth={9} strokeLinecap="round" />
            <text x={0} y={50} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={118} fill="#FFF4E0" opacity={blink} stroke={INK} strokeWidth={5} paintOrder="stroke">HẾT TIỀN</text>
          </g>
        )}
      </g>
      {/* keypad + slots */}
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={480 + (i % 4) * 100} y={680 + Math.floor(i / 4) * 86} width={84} height={68} rx={12} fill="#8C92A8" stroke={INK} strokeWidth={4} />
      ))}
      <rect x={1030} y={690} width={420} height={36} rx={14} fill="#0B0A10" stroke="#5A5870" strokeWidth={5} />
      <rect x={1050} y={702} width={380} height={8} rx={4} fill="#5AE08A" opacity={0.5 + 0.5 * Math.sin(t / 5)} />
      <rect x={1030} y={800} width={420} height={110} rx={14} fill="#0B0A10" stroke="#5A5870" strokeWidth={5} />
      <rect x={1060} y={846} width={360} height={16} rx={8} fill="#2A2A3A" />
    </g>
  );
};

/** A price tag on a string from (x, y); at frame `at` it flips (edge-on, then the higher number) with a red arrow. */
export const PriceTag: React.FC<{ x: number; y: number; t: number; at: number; from: string; to: string; s?: number }> = ({ x, y, t, at, from, to, s = 1 }) => {
  const k = (t - at) / 6;
  const flip = k < 0 ? 1 : k < 1 ? Math.abs(Math.cos(k * Math.PI)) : 1;
  const up = t - at >= 3;
  const arrow = easeOut(clamp((t - at - 4) / 6));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M 0 -200 L 0 0" stroke="#8A7C68" strokeWidth={4} />
      <g transform={`translate(0 75) scale(1 ${flip}) translate(0 -75)`}>
        <path d="M -90 0 L 90 0 L 90 150 L -90 150 L -90 0 Z" fill={up ? '#FFE7A8' : '#F6EFE3'} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <circle cx={0} cy={22} r={9} fill="#2A2330" />
        <text x={0} y={104} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={44} fill={up ? '#C8202F' : INK}>{up ? to : from}</text>
        <rect x={-62} y={124} width={124} height={8} rx={4} fill={INK} opacity={0.2} />
      </g>
      {arrow > 0 ? (
        <path d={`M 112 ${60 - 40 * arrow} L 112 ${100 - 40 * arrow} M 92 ${80 - 40 * arrow} L 112 ${56 - 40 * arrow} L 132 ${80 - 40 * arrow}`} stroke="#E8453C" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={arrow} />
      ) : null}
    </g>
  );
};

/** Deterministic order in which a shelf's slots empty: slot i's index among n, shuffled. */
export const emptyOrder = (n: number, seed: number) => {
  const keys = Array.from({ length: n }, (_, i) => ({ i, k: rnd(seed, i) }));
  keys.sort((a, b) => a.k - b.k);
  const rank: number[] = [];
  keys.forEach((e, r) => { rank[e.i] = r; });
  return rank;
};
