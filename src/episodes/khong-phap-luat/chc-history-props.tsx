import React from 'react';
import { FONT, rnd, clamp, backOut, easeOut } from '../../engine';
import { INK } from './chc-hobbes-props';

// Chapter C props, "week one: history" (look memory, sepia): a medieval village and castle sketch, the history scroll, the homicide-rate
// bar chart (medieval bar vs today's tiny bar), the source tag and the "ĐÓ LÀ THẬT" stamp. Pure functions of the clock.

/** A medieval castle on a hill, village huts with smoking chimneys, a windmill; sepia sketch; centre x, ground y. About 1800 wide. */
export const MedievalVillage: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  const hut = (hx: number, hs: number, k: number) => (
    <g key={k} transform={`translate(${hx} 0) scale(${hs})`}>
      <rect x={-60} y={-90} width={120} height={90} fill="#C8AE80" stroke={INK} strokeWidth={4} />
      <path d="M -80 -90 L 0 -160 L 80 -90 Z" fill="#7A4A32" stroke={INK} strokeWidth={4} />
      <path d="M -60 -50 H 60 M 0 -90 V 0 M -60 -90 L 0 -50 L 60 -90" stroke="#5A3A24" strokeWidth={3} fill="none" />
      <rect x={-14} y={-46} width={28} height={46} fill="#4A2E20" />
      <rect x={30} y={-150} width={18} height={44} fill="#8A6A4C" stroke={INK} strokeWidth={3} />
      {[0, 1, 2].map((i) => {
        const p = ((t * 0.7 + i * 26 + k * 11) % 78) / 78;
        return <circle key={i} cx={39 + Math.sin(p * 8 + i) * 12 + p * 24} cy={-160 - p * 90} r={9 + p * 16} fill="#E8E0D0" opacity={0.65 * (1 - p)} />;
      })}
    </g>
  );
  const tower = (tx: number, tw: number, th: number) => (
    <g transform={`translate(${tx} 0)`}>
      <rect x={-tw / 2} y={-th} width={tw} height={th} fill="#B6A58A" stroke={INK} strokeWidth={5} />
      {Array.from({ length: Math.round(tw / 34) }).map((_, i) => <rect key={i} x={-tw / 2 + 4 + i * 34} y={-th - 26} width={22} height={26} fill="#B6A58A" stroke={INK} strokeWidth={4} />)}
      <rect x={-12} y={-th + 50} width={24} height={52} rx={12} fill="#2A1E18" />
    </g>
  );
  const wind = t * 3.2;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -900 0 Q -600 -90 -300 -190 Q 0 -310 300 -190 Q 600 -80 900 0 Z" fill="#8E7A54" stroke={INK} strokeWidth={5} />
      <g transform="translate(0 -300)">
        <rect x={-210} y={-20} width={420} height={110} fill="#B6A58A" stroke={INK} strokeWidth={5} />
        {tower(-210, 96, 260)}{tower(210, 96, 260)}{tower(0, 120, 330)}
        <path d="M -60 -330 L 0 -420 L 60 -330 Z" fill="#7A4A32" stroke={INK} strokeWidth={4} />
        <path d="M 0 -420 V -500" stroke={INK} strokeWidth={5} />
        <path d={`M 0 -500 q 40 ${-10 + 6 * Math.sin(t / 5)} 80 6 q -40 10 -80 8 Z`} fill="#A8323E" stroke={INK} strokeWidth={3} />
      </g>
      <g transform="translate(-620 -20)">{hut(0, 1, 0)}{hut(220, 0.8, 1)}</g>
      <g transform="translate(560 -20)">{hut(0, 0.9, 2)}{hut(230, 1.05, 3)}</g>
      <g transform="translate(-860 -150)">
        <path d="M -34 150 L -22 0 L 22 0 L 34 150 Z" fill="#B6A58A" stroke={INK} strokeWidth={4} />
        <g transform={`rotate(${wind})`}>
          {[0, 90, 180, 270].map((a) => <g key={a} transform={`rotate(${a})`}><rect x={-6} y={-130} width={12} height={130} fill="#6A4A2C" stroke={INK} strokeWidth={3} /><rect x={6} y={-130} width={34} height={90} fill="#E8E0D0" stroke={INK} strokeWidth={3} /></g>)}
        </g>
      </g>
      <path d="M -1000 0 H 1000" stroke={INK} strokeWidth={5} />
    </g>
  );
};

/** The bar chart on parchment: a tall medieval bar and a tiny bar for today. `p` 0..1 grows them; frame 1200 x 760 centred at (x, y). */
export const HomicideChart: React.FC<{ x: number; y: number; p: number; x10?: number; tag?: number }> = ({ x, y, p, x10 = 0, tag = 0 }) => {
  const g = easeOut(clamp(p));
  const tall = 470 * g;
  const small = 470 * g * (1 / 28);
  const pop = backOut(clamp(x10));
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-600} y={-380} width={1200} height={760} rx={10} fill="#E8D8AC" stroke={INK} strokeWidth={6} />
      <rect x={-584} y={-364} width={1168} height={728} rx={6} fill="none" stroke="#8A6A3E" strokeWidth={2.5} />
      <path d="M -440 280 H 440" stroke={INK} strokeWidth={6} />
      <path d="M -440 280 V -300" stroke={INK} strokeWidth={4} opacity={0.6} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M -440 ${280 - 118 * (i + 1)} H 440`} stroke="#8A6A3E" strokeWidth={2} strokeDasharray="10 10" opacity={0.5} />)}
      <rect x={-300} y={280 - tall} width={170} height={tall} fill="#A8323E" stroke={INK} strokeWidth={5} />
      <rect x={130} y={280 - Math.max(small, 3)} width={170} height={Math.max(small, 3)} fill="#4A6A4A" stroke={INK} strokeWidth={4} />
      <text x={-215} y={332} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={32} fill={INK}>TRUNG CỔ</text>
      <text x={215} y={332} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={32} fill={INK}>NGÀY NAY</text>
      {x10 > 0 ? (
        <g transform={`translate(250 -130) rotate(-4) scale(${pop})`}>
          <rect x={-290} y={-58} width={580} height={116} rx={10} fill="#F6E6B4" stroke="#A8323E" strokeWidth={7} />
          <text x={0} y={20} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={62} fill="#A8323E" stroke="#A8323E" strokeWidth={1.5}>x HÀNG CHỤC LẦN</text>
        </g>
      ) : null}
      {tag > 0 ? (
        <g transform={`translate(430 -330) scale(${backOut(clamp(tag))})`}>
          <rect x={-170} y={-24} width={340} height={48} rx={24} fill="#2E2018" opacity={0.85} />
          <text x={0} y={9} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={28} fill="#F6EFE3" letterSpacing={2}>EISNER, 2003</text>
        </g>
      ) : null}
    </g>
  );
};

/** The ink stamp "ĐÓ LÀ THẬT": slams in (scale from big to 1), centre (x, y); `p` 0..1. */
export const TruthStamp: React.FC<{ x: number; y: number; p: number; rot?: number }> = ({ x, y, p, rot = -7 }) => {
  if (p <= 0) return null;
  const k = 1 + 1.6 * (1 - easeOut(clamp(p * 1.6)));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`} opacity={clamp(p * 5)}>
      <rect x={-330} y={-92} width={660} height={184} rx={14} fill="#F6E6B4" opacity={0.55} stroke="#9A1F2E" strokeWidth={14} />
      <rect x={-312} y={-74} width={624} height={148} rx={8} fill="none" stroke="#9A1F2E" strokeWidth={4} />
      <text x={0} y={34} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={112} fill="#9A1F2E" stroke="#9A1F2E" strokeWidth={2} letterSpacing={4}>ĐÓ LÀ THẬT</text>
    </g>
  );
};

/** A parchment scroll lying across the frame with little ink icons along a timeline, for "history shows". `unroll` 0..1. */
export const HistoryScroll: React.FC<{ x: number; y: number; unroll: number; t: number }> = ({ x, y, unroll, t }) => {
  const w = 1500 * easeOut(clamp(unroll));
  const icons = [-560, -280, 0, 280, 560];
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2 + 8} y={-250 + 14} width={w} height={500} fill="#000" opacity={0.25} />
      <rect x={-w / 2} y={-250} width={w} height={500} fill="#E8D8AC" stroke={INK} strokeWidth={5} />
      {[-1, 1].map((d) => <g key={d}><rect x={d * w / 2 - 22} y={-290} width={44} height={580} rx={22} fill="#B88A52" stroke={INK} strokeWidth={5} /></g>)}
      <path d={`M ${-w / 2 + 70} 120 H ${w / 2 - 70}`} stroke={INK} strokeWidth={6} />
      {icons.map((ix, i) => {
        if (Math.abs(ix) + 90 > w / 2 - 40) return null;
        const bob = Math.sin(t / 14 + i) * 4;
        return (
          <g key={i} transform={`translate(${ix} ${120 + bob})`}>
            <circle cx={0} cy={0} r={11} fill="#A8323E" stroke={INK} strokeWidth={3} />
            {i === 0 ? <g transform="translate(0 -30)"><rect x={-50} y={-110} width={100} height={110} fill="#B6A58A" stroke={INK} strokeWidth={4} /><path d="M -50 -110 V -136 H -30 V -118 H -10 V -136 H 10 V -118 H 30 V -136 H 50 V -110" fill="#B6A58A" stroke={INK} strokeWidth={4} /><rect x={-14} y={-60} width={28} height={60} rx={14} fill="#2A1E18" /></g> : null}
            {i === 1 || i === 3 ? <g transform="translate(0 -30)"><rect x={-44} y={-70} width={88} height={70} fill="#C8AE80" stroke={INK} strokeWidth={4} /><path d="M -62 -70 L 0 -128 L 62 -70 Z" fill="#7A4A32" stroke={INK} strokeWidth={4} /></g> : null}
            {i === 2 || i === 4 ? <g transform="translate(0 -30)"><path d="M -50 -2 L -40 -64 H 40 L 50 -2 Z" fill="#9A7A4A" stroke={INK} strokeWidth={4} /><circle cx={-28} cy={0} r={20} fill="#6A4A2C" stroke={INK} strokeWidth={4} /><circle cx={28} cy={0} r={20} fill="#6A4A2C" stroke={INK} strokeWidth={4} /></g> : null}
          </g>
        );
      })}
    </g>
  );
};

/** A sepia sky with drifting clouds, behind the village. */
export const SepiaSky: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-300} y={-300} width={2520} height={1500} fill="#E2D0A4" />
    <rect x={-300} y={-300} width={2520} height={600} fill="#CDB888" opacity={0.7} />
    {Array.from({ length: 5 }).map((_, i) => {
      const cx = ((rnd(4, i) * 2300 + t * (0.5 + rnd(5, i))) % 2500) - 300;
      return <g key={i} opacity={0.75}><ellipse cx={cx} cy={160 + i * 70} rx={170 + rnd(6, i) * 80} ry={34} fill="#F2E8CC" /><ellipse cx={cx + 70} cy={140 + i * 70} rx={110} ry={30} fill="#F2E8CC" /></g>;
    })}
  </g>
);
