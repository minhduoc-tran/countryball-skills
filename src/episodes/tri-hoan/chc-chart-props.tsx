import React from 'react';
import { clamp, easeOut, camT, kf, FONT, SCH, Schematic } from '../../engine';

// Chapter C props (3/3): the two charts. StressChart = Tice & Baumeister's semester (procrastinators low early, high late;
// the others steady). GrowthChart = 1 triệu/tháng at 6%/năm compounded monthly, from age 22 vs from age 32, to 60.

export const ORANGE = '#FF8A3D';
export const TEAL = '#4FD1C5';

// ---------------------------------------------------------------- stress over a semester
export const SC = { x0: 380, x1: 1560, yTop: 250, yBase: 780 };
const steady = (u: number) => 0.4 + 0.035 * Math.sin(u * 7);
const procrast = (u: number) => 0.15 + 0.1 * u + 0.68 * Math.pow(u, 4);
export const stressXY = (u: number, who: 'p' | 'o') => ({ x: SC.x0 + u * (SC.x1 - SC.x0), y: SC.yBase - (who === 'p' ? procrast(u) : steady(u)) * (SC.yBase - SC.yTop) });

const line = (f: (u: number) => { x: number; y: number }, from: number, to: number) => {
  const n = 64;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const u = from + (to - from) * (i / n);
    const p = f(u);
    pts.push(`${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
  }
  return pts.join(' ');
};

/** The stress chart. pa = how far the procrastinators' line has drawn (0..1 across the semester), pb the steady line's. */
export const StressChart: React.FC<{ t: number; pa: number; pb: number; legend?: boolean }> = ({ t, pa, pb, legend = true }) => {
  const endA = stressXY(pa, 'p');
  const endB = stressXY(pb, 'o');
  const pulse = 1 + 0.12 * Math.sin(t / 2.5);
  return (
    <g>
      <path d={`M ${SC.x0} ${SC.yTop - 30} V ${SC.yBase} H ${SC.x1 + 30}`} stroke={SCH.line} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {[0.25, 0.5, 0.75].map((g) => <path key={g} d={`M ${SC.x0} ${SC.yBase - g * (SC.yBase - SC.yTop)} H ${SC.x1}`} stroke={SCH.dim} strokeWidth={2} strokeDasharray="6 14" opacity={0.5} />)}
      <text x={SC.x0} y={SC.yBase + 52} fontFamily={FONT.ui} fontWeight={700} fontSize={32} fill={SCH.dim} letterSpacing={3}>ĐẦU KỲ</text>
      <text x={SC.x1} y={SC.yBase + 52} textAnchor="end" fontFamily={FONT.ui} fontWeight={700} fontSize={32} fill={SCH.dim} letterSpacing={3}>CUỐI KỲ</text>
      <text x={SC.x0 + 14} y={SC.yTop - 44} fontFamily={FONT.ui} fontWeight={700} fontSize={32} fill={SCH.line} letterSpacing={3}>CĂNG THẲNG</text>
      {pb > 0 ? <path d={line((u) => stressXY(u, 'o'), 0, pb)} stroke={TEAL} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
      {pa > 0 ? <path d={line((u) => stressXY(u, 'p'), 0, pa)} stroke={ORANGE} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 12px ${SCH.glow})` }} /> : null}
      {pb > 0 ? <circle cx={endB.x} cy={endB.y} r={13} fill={TEAL} /> : null}
      {pa > 0 ? <circle cx={endA.x} cy={endA.y} r={18 * pulse} fill={ORANGE} stroke="#FFF3DC" strokeWidth={4} /> : null}
      {legend ? (
        <g transform="translate(1000 110)">
          <rect x={-20} y={-44} width={560} height={150} rx={26} fill="#0B0816" opacity={0.6} />
          <circle cx={14} cy={-8} r={14} fill={ORANGE} /><text x={44} y={4} fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill={SCH.line} letterSpacing={2}>HAY TRÌ HOÃN</text>
          <circle cx={14} cy={52} r={14} fill={TEAL} /><text x={44} y={64} fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill={SCH.line} letterSpacing={2}>NHỮNG NGƯỜI KHÁC</text>
        </g>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------- savings growth, 22 vs 32 to 60
export const GC = { x0: 300, x1: 1620, yBase: 800, yTop: 250, ageFrom: 22, ageTo: 60 };
/** Future value in millions of dong: 1 triệu/tháng from `start` to `age`, 0.5%/month. */
export const fv = (start: number, age: number) => (age <= start ? 0 : (Math.pow(1.005, (age - start) * 12) - 1) / 0.005);
const MAXV = fv(22, 60); // about 1,744
export const growthXY = (age: number, start: number) => ({
  x: GC.x0 + ((age - GC.ageFrom) / (GC.ageTo - GC.ageFrom)) * (GC.x1 - GC.x0),
  y: GC.yBase - (fv(start, age) / MAXV) * (GC.yBase - GC.yTop),
});
const curve = (start: number, upto: number) => {
  const n = 70;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const a = start + (upto - start) * (i / n);
    const p = growthXY(a, start);
    pts.push(`${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
  }
  return pts.join(' ');
};

/** Two growth curves. pa/pb (0..1) = how far each has drawn along its own span (22..60, 32..60). */
export const GrowthChart: React.FC<{ t: number; pa: number; pb: number; ticks?: boolean; id: string }> = ({ t, pa, pb, ticks = true, id }) => {
  const ea = 22 + 38 * easeOut(clamp(pa));
  const eb = 32 + 28 * easeOut(clamp(pb));
  const pulse = 1 + 0.1 * Math.sin(t / 3);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}fillA`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={TEAL} stopOpacity={0.4} /><stop offset="1" stopColor={TEAL} stopOpacity={0} /></linearGradient>
      </defs>
      <path d={`M ${GC.x0} ${GC.yTop - 30} V ${GC.yBase} H ${GC.x1 + 30}`} stroke={SCH.line} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {ticks
        ? [22, 32, 60].map((a) => (
            <g key={a}>
              <path d={`M ${growthXY(a, 22).x} ${GC.yBase} v 14`} stroke={SCH.line} strokeWidth={4} />
              <text x={growthXY(a, 22).x} y={GC.yBase + 58} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={38} fill={a === 32 ? ORANGE : SCH.line}>{a}</text>
            </g>
          ))
        : null}
      <text x={GC.x1 + 70} y={GC.yBase + 58} textAnchor="start" fontFamily={FONT.ui} fontSize={28} fill={SCH.dim} letterSpacing={3}>TUỔI</text>
      {pa > 0 ? (
        <g>
          <path d={`${curve(22, ea)} L ${growthXY(ea, 22).x} ${GC.yBase} L ${GC.x0} ${GC.yBase} Z`} fill={`url(#${id}fillA)`} />
          <path d={curve(22, ea)} stroke={TEAL} strokeWidth={12} fill="none" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${TEAL}99)` }} />
          <circle cx={growthXY(ea, 22).x} cy={growthXY(ea, 22).y} r={16 * pulse} fill={TEAL} stroke="#FFFFFF" strokeWidth={4} />
        </g>
      ) : null}
      {pb > 0 ? (
        <g>
          <path d={curve(32, eb)} stroke={ORANGE} strokeWidth={12} fill="none" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${SCH.glow})` }} />
          <circle cx={growthXY(eb, 32).x} cy={growthXY(eb, 32).y} r={16 * pulse} fill={ORANGE} stroke="#FFF3DC" strokeWidth={4} />
        </g>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------- a card's frame: dark blueprint ground + a slow push-in
export const CardFrame: React.FC<{ t: number; len: number; id: string; cx?: number; cy?: number; z0?: number; z1?: number; children: React.ReactNode }> = ({ t, len, id, cx = 960, cy = 540, z0 = 1, z1 = 1.06, children }) => (
  <g transform={camT(cx, cy, kf(t, [[0, z0], [len, z1]]))}>
    <Schematic t={t + 30} id={id} />
    {children}
  </g>
);
