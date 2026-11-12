import React from 'react';
import { clamp, easeInOut, hash, lerp } from './fx-math';
import { FlagCloth, FlagKind } from './flag-cloth';
import { mix } from './map-context';

// <PalaceFacade>: FRONT ELEVATION of Dinh Độc Lập as built in 1962-66 (architect Ngô Viết Thụ): a long horizontal modernist block of four floors
// with a roof deck, pale-cream concrete piers every ~8 m, the famous "bamboo" screens (rèm hoa đá: hourglass-shaped concrete cells in front of
// dark glass) on the middle floors, ribbon windows below and above, a stepped entrance portico with a wide canopy and two stacked balconies over
// it (brown doors), and on the roof a small pavilion with a wide flat canopy, the helipad (left wing) and the flagpole; palms along the roof edge.
// Compared with a 2019 photo of the real front: proportions (about 6 : 1.6 : 1 for width : body : pavilion), pier rhythm, screen floors and the
// off-centre pavilion are the same; windows are simplified (no wood/stone detail on the plinth).
//   <PalaceFacade id x y w? tone? flag? flagRaise? climb? t? backdrop? windows? />
//   x = centre, y = ground line (px), w = width of the building in px (default 1700: the body spans the screen; the roof pole then reaches ~ y - 0.58 w)
//   tone 'day' | 'dusk' | 'night' (sky, light, windows lit at night)     backdrop: paint the sky and a lawn (default true; false to compose your own)
//   flag 'none' | 'RVN' | 'PRG'    flagRaise 0..1 = the flag climbs the pole (0 at the roof, 1 at the top)     t = frame, flag ripple
//   climb 0..1 = a tiny figure (no face) runs up the front stairs, the central balconies and the roof to the pole, carrying a rolled flag
//   windows 0..1: how many bays are lit at night/dusk (default 0.5)
// Pure function of its props; `id` unique per facade in a frame.

type Tone = 'day' | 'dusk' | 'night';
const P: Record<Tone, { skyA: string; skyB: string; wall: string; shade: string; pier: string; glass: string; slab: string; roof: string; lawn: string; plinth: string; dark: number }> = {
  day: { skyA: '#8EC3E8', skyB: '#DDEFF8', wall: '#E8E0C6', shade: '#C9C0A2', pier: '#EEE7CF', glass: '#2B4F5A', slab: '#F4EFDC', roof: '#E9E3CE', lawn: '#7FA652', plinth: '#6F6A5C', dark: 0 },
  dusk: { skyA: '#5B6FA3', skyB: '#F4B873', wall: '#E6C9A0', shade: '#B9906C', pier: '#EBD2AA', glass: '#2A3A5A', slab: '#F0D9B2', roof: '#E0C79F', lawn: '#5F7D45', plinth: '#5A4F48', dark: 0.25 },
  night: { skyA: '#070D1C', skyB: '#1B2A4C', wall: '#6F7388', shade: '#4B4F66', pier: '#7C8096', glass: '#141C2C', slab: '#848699', roof: '#6A6D80', lawn: '#1F3322', plinth: '#2D2D36', dark: 0.55 },
};
const INK = '#2A2822';
const FLOORS: [number, number][] = [[-174, -258], [-266, -376]];   // [bottom, top] of the two screen floors

const BAYS = 12, BAY = 125, HALF = (BAYS * BAY) / 2, PIER = 32;          // design units: 1500 wide
const Y = { f1: -80, f2: -170, f3: -262, f4: -380, roof: -465, pav: -540, canopy: -552 } as const;
const POLE = { x: 70, base: -560, top: -770 };
const CLIMB: [number, number][] = [[0, 0], [0, -34], [78, -60], [78, -84], [78, -170], [-70, -170], [-70, -262], [70, -262], [70, -380], [150, -420], [150, -465], [90, -540], [POLE.x, -566]];

const lerpPath = (pts: [number, number][], u: number): [number, number] => {
  const L = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), tot = L.reduce((a, b) => a + b, 0);
  let d = clamp(u) * tot;
  for (let i = 0; i < L.length; i++) { if (d <= L[i]) return [lerp(pts[i][0], pts[i + 1][0], d / L[i]), lerp(pts[i][1], pts[i + 1][1], d / L[i])]; d -= L[i]; }
  return pts[pts.length - 1];
};

/** Hourglass-shaped screen cell (concave sides) at (x, y) top-left, w x h. */
const cell = (x: number, y: number, w: number, h: number) => `M${x},${y}H${x + w}Q${x + w - 5},${y + h / 2} ${x + w},${y + h}H${x}Q${x + 5},${y + h / 2} ${x},${y}Z`;

export const PalaceFacade: React.FC<{
  id: string; x: number; y: number; w?: number; tone?: Tone; flag?: FlagKind | 'none'; flagRaise?: number; climb?: number; t?: number; backdrop?: boolean; windows?: number;
}> = ({ id, x, y, w = 1700, tone = 'day', flag = 'none', flagRaise = 1, climb = 0, t = 0, backdrop = true, windows = 0.5 }) => {
  const c = P[tone], s = w / 1500, n = tone === 'night' ? 1 : tone === 'dusk' ? 0.55 : 0;
  const lit = (i: number) => n > 0 && hash(i, 7) < windows;
  const glassCol = (i: number) => (lit(i) ? mix('#FFD58A', '#F0B35A', hash(i, 8)) : c.glass);
  const px = (i: number) => -HALF + i * BAY;
  const bays = Array.from({ length: BAYS }, (_, i) => i), central = (i: number) => i === 5 || i === 6;
  const fr = easeInOut(clamp(flagRaise)), fy = lerp(POLE.base - 10, POLE.top - 4, fr);
  const fig = climb > 0 && climb < 1 ? lerpPath(CLIMB, climb) : null;
  return (
    <g>
      {backdrop && (
        <g>
          <defs><linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.skyA} /><stop offset="1" stopColor={c.skyB} /></linearGradient></defs>
          <rect width={1920} height={y + 4} fill={`url(#${id}-sky)`} />
          {tone === 'night' && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={hash(i, 1) * 1920} cy={hash(i, 2) * Math.max(10, y - 500)} r={1 + hash(i, 3) * 1.6} fill="#FFFFFF" opacity={0.4 + 0.5 * hash(i, 4)} />)}
          <rect y={y} width={1920} height={1080 - y} fill={c.lawn} />
          <rect y={y} width={1920} height={14} fill="#000" opacity={0.12} />
        </g>
      )}
      <g transform={`translate(${x},${y}) scale(${s})`} strokeLinejoin="round">
        {/* body */}
        <rect x={-HALF} y={Y.roof} width={2 * HALF} height={-Y.roof} fill={c.wall} />
        <rect x={-HALF} y={-80} width={2 * HALF} height={80} fill={c.plinth} />
        {/* ribbon windows: floor 1 (above the plinth) and the top floor */}
        {bays.map((i) => (
          <g key={`r${i}`}>
            <rect x={px(i) + PIER + 6} y={-150} width={BAY - PIER - 12} height={46} fill={glassCol(i)} stroke={INK} strokeWidth={2} />
            <rect x={px(i) + PIER + 4} y={-158} width={BAY - PIER - 8} height={9} fill={c.slab} stroke={INK} strokeWidth={1.4} />
            <rect x={px(i) + PIER + 6} y={-446} width={BAY - PIER - 12} height={50} fill={glassCol(i + 20)} stroke={INK} strokeWidth={2} />
            <rect x={px(i) + PIER + 4} y={-454} width={BAY - PIER - 8} height={9} fill={c.slab} stroke={INK} strokeWidth={1.4} />
          </g>
        ))}
        {/* bamboo screens on floors 2 and 3 (central bays get brown doors behind the balconies instead) */}
        {bays.map((i) => FLOORS.map(([bottom, top], fi) => {
          const bx = px(i) + PIER + 3, bw = BAY - PIER - 6, h = bottom - top;
          if (central(i)) return <rect key={`d${i}${fi}`} x={bx + 8} y={top + 22} width={bw - 16} height={h - 22} fill="#8A4F2E" stroke={INK} strokeWidth={2} />;
          const cols = 4, cw = (bw - 8) / cols, rows = 2, rh = (h - 10) / rows;
          return (
            <g key={`s${i}${fi}`}>
              <rect x={bx} y={top} width={bw} height={h} fill={glassCol(i * 3 + fi)} stroke={INK} strokeWidth={2} />
              <path d={Array.from({ length: cols * rows }, (_, k) => cell(bx + 5 + (k % cols) * cw + 1, top + 5 + Math.floor(k / cols) * rh, cw - 2, rh - 2)).join('')} fill={c.pier} stroke={INK} strokeWidth={1.5} />
            </g>
          );
        }))}
        {/* floor slabs */}
        {[Y.f2, Y.f3, Y.f4, Y.roof].map((yy, k) => <rect key={k} x={-HALF - (k === 3 ? 22 : 0)} y={yy - 7} width={2 * HALF + (k === 3 ? 44 : 0)} height={k === 3 ? 18 : 12} fill={c.slab} stroke={INK} strokeWidth={2} />)}
        {/* balconies over the entrance */}
        {[Y.f2 + 2, Y.f3 + 2].map((yy, k) => (
          <g key={k}>
            <rect x={-170} y={yy - 12} width={340} height={14} fill={c.slab} stroke={INK} strokeWidth={2} />
            <rect x={-170} y={yy - 40} width={340} height={30} fill="none" stroke={INK} strokeWidth={1.4} />
            {Array.from({ length: 18 }, (_, j) => <line key={j} x1={-163 + j * 19.5} y1={yy - 40} x2={-163 + j * 19.5} y2={yy - 12} stroke={INK} strokeWidth={1.2} />)}
          </g>
        ))}
        {/* piers (full height) with a shaded right edge */}
        {Array.from({ length: BAYS + 1 }, (_, i) => (
          <g key={`p${i}`}>
            <rect x={px(i) - PIER / 2} y={Y.roof - 5} width={PIER} height={-Y.roof + 5} fill={c.pier} stroke={INK} strokeWidth={2} />
            <rect x={px(i) + PIER / 2 - 7} y={Y.roof - 5} width={7} height={-Y.roof + 5} fill={c.shade} opacity={0.8} />
          </g>
        ))}
        {/* portico: dark recess, columns, wide canopy slab and the stairs */}
        <rect x={px(4)} y={-82} width={4 * BAY} height={82} fill={mix(c.plinth, '#000000', 0.45)} />
        {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={px(4) + k * BAY - 11} y={-82} width={22} height={82} fill={c.pier} stroke={INK} strokeWidth={2} />)}
        <rect x={px(4) - 40} y={Y.f1 - 16} width={4 * BAY + 80} height={20} fill={c.slab} stroke={INK} strokeWidth={2.2} />
        {tone !== 'day' && [-180, -60, 60, 180].map((lx) => <circle key={lx} cx={lx} cy={-50} r={7} fill="#FFD98A" opacity={0.9} />)}
        {Array.from({ length: 7 }, (_, k) => <rect key={k} x={px(4) - 56 + k * 7} y={-7 * (k + 1) * 0.62 + 4} width={4 * BAY + 112 - k * 14} height={6} fill={k % 2 ? c.slab : c.shade} stroke={INK} strokeWidth={1} />)}
        {/* roof: pavilion, canopy, palms, helipad */}
        <rect x={-210} y={Y.pav} width={420} height={Y.roof - Y.pav} fill={c.wall} stroke={INK} strokeWidth={2} />
        {[-190, -110, -30, 50, 130, 190].map((px2) => <rect key={px2} x={px2 - 7} y={Y.pav} width={14} height={Y.roof - Y.pav} fill={c.pier} stroke={INK} strokeWidth={1.6} />)}
        {[-150, -70, 10, 90, 160].map((gx, i) => <rect key={gx} x={gx - 20} y={Y.pav + 14} width={40} height={42} fill={glassCol(i + 40)} stroke={INK} strokeWidth={1.6} />)}
        <rect x={-280} y={Y.canopy - 6} width={560} height={16} fill={c.slab} stroke={INK} strokeWidth={2.2} />
        <rect x={-280} y={Y.canopy + 8} width={560} height={6} fill={c.shade} />
        <g transform={`translate(-560,${Y.roof - 4})`}>
          <ellipse rx={94} ry={11} fill={c.roof} stroke={INK} strokeWidth={2} />
          <ellipse rx={70} ry={7} fill="none" stroke="#F6F3E8" strokeWidth={3} />
          <path d="M-18,-4V4M18,-4V4M-18,0H18" stroke="#F6F3E8" strokeWidth={3} />
        </g>
        {Array.from({ length: 9 }, (_, i) => { const hx = -690 + i * 170 + (i > 4 ? 40 : 0), pal = tone === 'night' ? '#1D3A24' : '#3F7A32'; return (
          <g key={`pl${i}`} transform={`translate(${hx},${Y.roof - 12})`}><path d="M0,0 Q3,-20 0,-40" stroke="#5B4630" strokeWidth={4} fill="none" />{[-70, -35, 0, 35, 70].map((a) => <path key={a} d="M0,-40 Q16,-58 34,-44 Q16,-50 0,-40" transform={`rotate(${a} 0 -40)`} fill={pal} stroke={INK} strokeWidth={1.2} />)}</g>);
        })}
        {/* flagpole and flag */}
        <line x1={POLE.x} y1={POLE.base} x2={POLE.x} y2={POLE.top} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <circle cx={POLE.x} cy={POLE.top - 4} r={5} fill="#E2B95A" stroke={INK} strokeWidth={1.4} />
        {flag !== 'none' && <FlagCloth id={`${id}-fl`} x={POLE.x + 2} y={fy} w={150} h={100} kind={flag} wave={0.8} t={t} />}
        {/* the runner */}
        {fig && (
          <g transform={`translate(${fig[0]},${fig[1]}) scale(1.6)`}>
            <ellipse cx={0} cy={0} rx={16} ry={4} fill="#000" opacity={0.25} />
            <rect x={-8} y={-38} width={16} height={26} rx={6} fill="#3B4A2A" stroke={INK} strokeWidth={1.6} />
            <path d="M-7,-14 L-9,0 M7,-14 L9,0" stroke={INK} strokeWidth={5} strokeLinecap="round" />
            <circle cx={0} cy={-47} r={8.5} fill="#3B4A2A" stroke={INK} strokeWidth={1.6} />
            <path d="M8,-34 L16,-58" stroke={INK} strokeWidth={4} strokeLinecap="round" />
            <rect x={11} y={-84} width={6} height={30} rx={3} fill="#D6261F" stroke={INK} strokeWidth={1.4} transform="rotate(14 14 -70)" />
          </g>
        )}
        {/* front shrubs */}
        {[-760, -480, 520, 800].map((bx, i) => <ellipse key={i} cx={bx} cy={-12} rx={46 + (i % 2) * 14} ry={34} fill={tone === 'night' ? '#16301B' : '#4B7B3A'} stroke={INK} strokeWidth={2} />)}
      </g>
    </g>
  );
};
