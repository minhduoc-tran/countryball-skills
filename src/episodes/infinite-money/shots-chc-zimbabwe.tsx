import React from 'react';
import { Schematic, SchLabel, DrawOn, SCH, FONT, clamp, easeOut, backOut, kf, ShotProps } from '../../engine';
import { PriceTag, Note, INK } from './chc-props-money-and-prices';

// Chapter C, Zimbabwe: the country pinned on a globe, prices doubling (C22), the ~24 hour clock with x2 (C23), the 2009
// printing press (C24) and the drawn generic 100,000,000,000,000 note in "ZIMBABWE DOLLARS" (C25).

// ---------- C22: ZIMBABWE with a pin, then it slides to the corner while a price curve doubles 1, 2, 4, 8, 16 ----------
const VALS = ['1', '2', '4', '8', '16'];
const TAG_X = [430, 720, 1010, 1300, 1590];
const TAG_Y = [800, 740, 650, 510, 330];
export const C22: React.FC<ShotProps> = ({ t, len }) => {
  const mv = easeOut(clamp((t - 24) / 14));
  const title = kf(mv, [[0, 1], [1, 0.34]], (v) => v);
  const tx = 960 + (330 - 960) * mv, ty = 470 + (170 - 470) * mv;
  const pinK = backOut(clamp((t - 6) / 8));
  const curve = 'M ' + TAG_X.map((x, i) => `${x} ${TAG_Y[i] + 40}`).join(' L ');
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
      <Schematic t={t} id="c22s" />
      <g transform={`translate(${tx} ${ty}) scale(${title})`}>
        <g opacity={1 - mv}>
          <circle cx={0} cy={-190} r={120} fill="none" stroke={SCH.dim} strokeWidth={5} />
          <ellipse cx={0} cy={-190} rx={50} ry={120} fill="none" stroke={SCH.dim} strokeWidth={4} />
          <path d="M -120 -190 H 120 M -104 -250 H 104 M -104 -130 H 104" stroke={SCH.dim} strokeWidth={4} />
        </g>
        <g transform={`translate(0 ${-250 - (1 - pinK) * 60}) scale(${pinK})`}>
          <path d="M 0 90 C -60 20 -52 -50 0 -52 C 52 -50 60 20 0 90 Z" fill={SCH.live} stroke={INK} strokeWidth={4} style={{ filter: `drop-shadow(0 0 14px ${SCH.glow})` }} />
          <circle cx={0} cy={-6} r={16} fill="#FFF3DC" />
        </g>
        <text x={0} y={110} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={170} fill={SCH.line} letterSpacing={4}>ZIMBABWE</text>
      </g>
      <DrawOn d={curve} t={t - 34} dur={36} color="#FF6A5A" width={8} />
      {VALS.map((v, i) => {
        const k = backOut(clamp((t - 34 - i * 8) / 7));
        return (
          <g key={i}>
            {k > 0 ? <g transform={`translate(${TAG_X[i]} ${TAG_Y[i]}) scale(${k}) translate(${-TAG_X[i]} ${-TAG_Y[i]})`}><PriceTag x={TAG_X[i]} y={TAG_Y[i]} s={0.62} text={v} c={i === 4 ? '#F7C8B8' : '#F2E6D0'} ink={i === 4 ? '#C23A2E' : INK} /></g> : null}
            {i > 0 ? <SchLabel x={(TAG_X[i] + TAG_X[i - 1]) / 2} y={(TAG_Y[i] + TAG_Y[i - 1]) / 2 + 130} t={t - 38 - i * 8} text="×2" size={54} color={SCH.live} anchor="middle" /> : null}
          </g>
        );
      })}
    </g>
  );
};

// ---------- C23: a clock makes one full turn (~24 GIỜ) and the price doubles ----------
export const C23: React.FC<ShotProps> = ({ t, len }) => {
  const ang = 360 * easeOut(clamp((t - 2) / 34));
  const pop = backOut(clamp((t - 30) / 8));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
      <Schematic t={t} id="c23s" />
      <g transform="translate(560 520)" style={{ filter: `drop-shadow(0 0 12px ${SCH.glow}55)` }}>
        <circle r={250} fill={SCH.ground} stroke={SCH.line} strokeWidth={9} />
        {Array.from({ length: 24 }).map((_, i) => <path key={i} d={`M 0 ${-232} V ${i % 6 === 0 ? -196 : -214}`} stroke={SCH.line} strokeWidth={i % 6 === 0 ? 8 : 4} transform={`rotate(${i * 15})`} />)}
        <path d={`M 0 0 V -200`} stroke={SCH.live} strokeWidth={14} strokeLinecap="round" transform={`rotate(${ang})`} />
        <circle r={20} fill={SCH.live} />
        {ang > 1 ? <path d={`M 0 -120 A 120 120 0 ${ang > 180 ? 1 : 0} 1 ${120 * Math.sin((ang * Math.PI) / 180)} ${-120 * Math.cos((ang * Math.PI) / 180)}`} stroke={SCH.live} strokeWidth={8} fill="none" opacity={0.5} /> : null}
      </g>
      <SchLabel x={560} y={880} t={t - 4} text="~24 HOURS" size={72} color={SCH.line} anchor="middle" />
      <g transform={`translate(1380 480) scale(${pop})`}>
        <PriceTag x={0} y={0} s={1.3} text="×2" sub="PRICE" c="#F7C8B8" ink="#C23A2E" rot={-4} />
      </g>
      <path d="M 840 520 H 1130" stroke={SCH.live} strokeWidth={8} strokeLinecap="round" strokeDasharray="16 12" opacity={clamp((t - 24) / 6)} />
    </g>
  );
};

// ---------- C24: 2009, and the press that prints notes: gears turn, a ribbon of notes slides out ----------
const Gear: React.FC<{ x: number; y: number; r: number; rot: number }> = ({ x, y, r, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} stroke={SCH.line} strokeWidth={6} strokeLinejoin="round" fill={SCH.ground}>
    <path d={Array.from({ length: 12 }).map((_, i) => { const a = (i / 12) * Math.PI * 2, b = a + Math.PI / 12; const p = (aa: number, rr: number) => `${(Math.cos(aa) * rr).toFixed(1)} ${(Math.sin(aa) * rr).toFixed(1)}`; return `${i ? 'L' : 'M'} ${p(a, r)} L ${p(a + 0.07, r * 1.18)} L ${p(b - 0.03, r * 1.18)} L ${p(b, r)}`; }).join(' ') + ' Z'} />
    <circle r={r * 0.35} />
    <path d={`M ${-r * 0.35} 0 H ${r * 0.35} M 0 ${-r * 0.35} V ${r * 0.35}`} />
  </g>
);
export const C24: React.FC<ShotProps> = ({ t, len }) => {
  const yr = backOut(clamp((t - 1) / 9));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
      <Schematic t={t} id="c24s" />
      <g transform={`translate(560 540) scale(${yr})`}>
        <text x={0} y={110} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={290} fill={SCH.live} style={{ filter: `drop-shadow(0 0 20px ${SCH.glow}88)` }}>2009</text>
      </g>
      <rect x={1000} y={330} width={380} height={420} rx={26} fill={SCH.ground} stroke={SCH.line} strokeWidth={8} />
      <Gear x={1120} y={460} r={62} rot={t * 6} />
      <Gear x={1255} y={460} r={62} rot={-t * 6 + 15} />
      <Gear x={1190} y={610} r={46} rot={t * 8} />
      <path d="M 1380 600 H 1900" stroke={SCH.line} strokeWidth={8} strokeLinecap="round" />
      {Array.from({ length: 5 }).map((_, i) => {
        const x = 1440 + ((i * 190 + t * 17) % 950) - 150;
        return x > 1400 ? <Note key={i} x={x} y={570} s={0.9} c={['#6FB38A', '#7FA6D6', '#D9A05A'][i % 3]} /> : null;
      })}
      <SchLabel x={1190} y={820} t={t - 8} text="PRINTING MONEY" size={42} color={SCH.dim} anchor="middle" />
    </g>
  );
};

// ---------- C25: the drawn generic note, printed left to right, its number filling in group by group ----------
const GROUPS = ['100', ',000', ',000', ',000', ',000'];
export const C25: React.FC<ShotProps> = ({ t }) => {
  const reveal = easeOut(clamp(t / 30));
  const x0 = 310, w = 1300;
  const shown = [t >= 56, t >= 62, t >= 68, t >= 74, t >= 80];
  const text = GROUPS.filter((_, i) => shown[i]).join('');
  const pulse = t > 80 ? 1 + 0.025 * Math.sin((t - 80) / 4) : 1;
  const push = kf(t, [[0, 0.92], [124, 1.08]]);
  return (
    <g transform={`translate(960 540) scale(${push * pulse}) rotate(${Math.sin(t / 20) * 0.8}) translate(-960 -540)`}>
      <Schematic t={t} id="c25s" />
      <defs>
        <clipPath id="c25clip"><rect x={x0} y={200} width={w * reveal} height={680} /></clipPath>
        <linearGradient id="c25g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2E6A5E" /><stop offset="1" stopColor="#1F4A58" /></linearGradient>
      </defs>
      <ellipse cx={960} cy={900} rx={640} ry={30} fill="#000" opacity={0.4} />
      <g clipPath="url(#c25clip)">
        <rect x={x0} y={230} width={w} height={620} rx={26} fill="url(#c25g)" stroke="#F0D79A" strokeWidth={8} />
        <rect x={x0 + 26} y={256} width={w - 52} height={568} rx={14} fill="none" stroke="#F0D79A" strokeOpacity={0.6} strokeWidth={4} />
        {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={960} cy={540} r={60 + i * 36} fill="none" stroke="#F0D79A" strokeOpacity={0.12} strokeWidth={3} />)}
        <circle cx={440} cy={730} r={64} fill="#F0D79A" fillOpacity={0.14} stroke="#F0D79A" strokeOpacity={0.6} strokeWidth={4} />
        <circle cx={1480} cy={730} r={64} fill="#F0D79A" fillOpacity={0.14} stroke="#F0D79A" strokeOpacity={0.6} strokeWidth={4} />
        <text x={960} y={352} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={64} fill="#F0D79A" letterSpacing={6}>ZIMBABWE DOLLARS</text>
        <text x={412} y={590} textAnchor="start" fontFamily={FONT.ui} fontWeight={700} fontSize={92} fill="#FFF3DC" style={{ filter: 'drop-shadow(0 0 10px #F0D79A88)' }}>{text}</text>
        <text x={960} y={730} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#F0D79A" opacity={clamp((t - 82) / 8)} letterSpacing={4}>ONE HUNDRED TRILLION</text>
      </g>
      <rect x={x0 + w * reveal - 6} y={210} width={12} height={660} fill="#FFF3DC" opacity={reveal < 1 ? 0.8 : 0} />
    </g>
  );
};
