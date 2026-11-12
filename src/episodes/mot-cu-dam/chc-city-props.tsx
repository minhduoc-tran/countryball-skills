import React from 'react';
import { clamp, rnd, FONT } from '../../engine';

// CHAPTER C props, part 2: the rainy-season city. Pure functions of the shot clock t (30 fps), world units 1920 x 1080.
//   <RainWindow t id />            macro of a rain-streaked window, blurred city lights behind, lightning flashes
//   <RoofSlab y />                  dark rooftop slab (stand Pip at ground y - 6) with parapet, tank and antenna
//   <BalconyBuilding t id />        sunny apartment facade, 3 x 2 balconies, neighbours clapping
//   <Rainbow p cx cy r />           rainbow arcs that grow in (p 0..1)

const INK = '#16101A';

export const RainWindow: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const flash = t % 61 < 2 || (t + 23) % 97 < 1;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B2236" />
          <stop offset="1" stopColor="#2B3550" />
        </linearGradient>
        <filter id={`${id}bl`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="22" /></filter>
        <clipPath id={`${id}clip`}><rect x={0} y={0} width={1920} height={1080} /></clipPath>
      </defs>
      <rect x={-100} y={-100} width={2120} height={1280} fill={`url(#${id}bg)`} />
      <g filter={`url(#${id}bl)`}>
        {Array.from({ length: 22 }).map((_, i) => (
          <circle key={i} cx={rnd(41, i) * 1920} cy={420 + rnd(42, i) * 600} r={40 + rnd(43, i) * 70} fill={['#FFC864', '#FF6B5A', '#7FD4FF', '#FFE9A8', '#9BE08A'][i % 5]} opacity={0.5 + 0.3 * Math.sin(t * 0.09 + i)} />
        ))}
      </g>
      {Array.from({ length: 150 }).map((_, i) => {
        const d = rnd(51, i);
        const y = (rnd(52, i) * 1300 + t * (34 + d * 30)) % 1300 - 110;
        const x = rnd(53, i) * 2100 - 90 - y * 0.22;
        return <line key={i} x1={x} y1={y} x2={x + 0.26 * 90} y2={y - 90} stroke="#CFE0FF" strokeWidth={1.5 + d * 3} opacity={0.1 + d * 0.3} />;
      })}
      {Array.from({ length: 16 }).map((_, i) => {
        const x = 90 + rnd(61, i) * 1740;
        const p = ((rnd(62, i) * 400 + t * (1.6 + rnd(63, i) * 2.4)) % 1200);
        const y = 20 + p;
        const r = 20 + rnd(64, i) * 26;
        return (
          <g key={i}>
            <path d={`M ${x} ${y - 90 * rnd(65, i)} L ${x} ${y}`} stroke="#DCE8FF" strokeWidth={r * 0.25} opacity={0.12} strokeLinecap="round" />
            <ellipse cx={x} cy={y} rx={r * 0.8} ry={r} fill="#E8F1FF" opacity={0.3} stroke="#F6FAFF" strokeWidth={3} />
            <ellipse cx={x - r * 0.25} cy={y - r * 0.3} rx={r * 0.22} ry={r * 0.32} fill="#FFFFFF" opacity={0.8} />
          </g>
        );
      })}
      {flash ? <rect x={-100} y={-100} width={2120} height={1280} fill="#D8E6FF" opacity={0.3} /> : null}
    </g>
  );
};

export const RoofSlab: React.FC<{ y: number }> = ({ y }) => (
  <g>
    <rect x={-600} y={y} width={2600} height={400} fill="#0F0D1A" stroke="#241E3C" strokeWidth={6} />
    <rect x={-600} y={y} width={2600} height={14} fill="#2A2448" />
    <rect x={1300} y={y - 190} width={170} height={190} fill="#1A1630" stroke="#2A2448" strokeWidth={5} />
    <rect x={1290} y={y - 206} width={190} height={22} fill="#241E3C" />
    <path d="M 1700 1010 L 1700 640 M 1650 700 L 1750 700 M 1665 760 L 1735 760" stroke="#2A2448" strokeWidth={8} fill="none" />
    <ellipse cx={560} cy={y + 24} rx={260} ry={10} fill="#3A4A7A" opacity={0.5} />
  </g>
);

// ---------------------------------------------------------------- neighbours on balconies
const SKINS = ['#F2D3B3', '#E8B890', '#C98E64', '#F6DFC6'];
const HAIRS = ['#2A1C18', '#5A3A28', '#C9925A', '#1E1418', '#7A7A8A'];
const SHIRTS = ['#E8584E', '#4FA3D9', '#F2B53A', '#5FBF7A', '#B56FD6', '#F08A5D'];

/** One neighbour behind a railing, feet at (x, y); clapping at `rate`, or cheering with raised arms (cheer 1). s = scale (1 = 190 tall). */
const Neighbour: React.FC<{ x: number; y: number; s: number; t: number; n: number; cheer?: boolean }> = ({ x, y, s, t, n, cheer = false }) => {
  const skin = SKINS[n % 4];
  const shirt = SHIRTS[n % 6];
  const ph = n * 1.7;
  const clap = 0.5 + 0.5 * Math.sin(t * 0.75 + ph); // 1 = hands apart, 0 = together
  const hands = cheer
    ? [{ x: -62, y: -178 + 14 * Math.sin(t * 0.5 + ph) }, { x: 62, y: -178 + 14 * Math.cos(t * 0.5 + ph) }]
    : [{ x: -10 - 40 * clap, y: -122 - 10 * clap }, { x: 10 + 40 * clap, y: -122 - 10 * clap }];
  const bob = Math.abs(Math.sin(t * 0.4 + ph)) * 5;
  const joy = !cheer && clap < 0.12;
  return (
    <g transform={`translate(${x} ${y - bob}) scale(${s})`}>
      <path d="M -40 0 Q -44 -100 -20 -112 L 20 -112 Q 44 -100 40 0 Z" fill={shirt} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {[-1, 1].map((sd, i) => (
        <path key={i} d={`M ${sd * 30} -104 Q ${sd * 52} ${(-104 + hands[i].y) / 2 + 20} ${hands[i].x} ${hands[i].y}`} fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" />
      ))}
      {[-1, 1].map((sd, i) => (
        <path key={`s${i}`} d={`M ${sd * 30} -104 Q ${sd * 52} ${(-104 + hands[i].y) / 2 + 20} ${hands[i].x} ${hands[i].y}`} fill="none" stroke={shirt} strokeWidth={14} strokeLinecap="round" />
      ))}
      {hands.map((h, i) => <circle key={`h${i}`} cx={h.x} cy={h.y} r={14} fill={skin} stroke={INK} strokeWidth={4} />)}
      <circle cy={-148} r={36} fill={skin} stroke={INK} strokeWidth={5} />
      <path d={`M -37 -150 Q -34 -190 0 -188 Q 36 -190 37 -150 Q 24 -170 0 -168 Q -24 -170 -37 -150 Z`} fill={HAIRS[n % 5]} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M -14 -150 Q -9 -156 -4 -150 M 4 -150 Q 9 -156 14 -150" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M -13 -136 Q 0 -122 13 -136 Z" fill="#7A2430" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      {joy ? <path d={`M -58 -118 L -74 -128 M -58 -100 L -78 -100 M 58 -118 L 74 -128 M 58 -100 L 78 -100`} stroke="#FFD23F" strokeWidth={5} strokeLinecap="round" /> : null}
    </g>
  );
};

export const BalconyBuilding: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const cols = [330, 960, 1590];
  const rows = [470, 880];
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5EB6F0" /><stop offset="1" stopColor="#CFEBFA" /></linearGradient>
        <linearGradient id={`${id}wall`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#F4D9B0" /><stop offset="1" stopColor="#F9E7C8" /></linearGradient>
      </defs>
      <rect x={-200} y={-200} width={2320} height={1500} fill={`url(#${id}sky)`} />
      <circle cx={1760} cy={60} r={120} fill="#FFF3C0" />
      <circle cx={1760} cy={60} r={300} fill="#FFF3C0" opacity={0.3} />
      <rect x={60} y={-100} width={1800} height={1300} fill={`url(#${id}wall)`} stroke={INK} strokeWidth={8} />
      <rect x={60} y={-100} width={90} height={1300} fill="#E4C79C" opacity={0.6} />
      {rows.map((ry, r) => cols.map((cx, c) => {
        const n = r * 3 + c;
        return (
          <g key={`${r}${c}`}>
            <rect x={cx - 215} y={ry - 330} width={430} height={330} fill="#31496B" stroke={INK} strokeWidth={6} />
            <rect x={cx - 215} y={ry - 330} width={430} height={150} fill="#7FB4DA" opacity={0.55} />
            <Neighbour x={cx - 80} y={ry - 20} s={1.35} t={t} n={n} cheer={n % 3 === 1} />
            <Neighbour x={cx + 100} y={ry - 20} s={0.85} t={t + 4} n={n + 2} />
            <rect x={cx - 250} y={ry - 150} width={500} height={14} fill="#E8E0D2" stroke={INK} strokeWidth={4} />
            {Array.from({ length: 11 }).map((_, i) => <rect key={i} x={cx - 238 + i * 47.5} y={ry - 136} width={8} height={136} fill="#D8CFC0" stroke={INK} strokeWidth={3} />)}
            <rect x={cx - 270} y={ry} width={540} height={40} fill="#B9AE9E" stroke={INK} strokeWidth={6} />
            {c !== 1 ? <ellipse cx={cx + (c ? 190 : -190)} cy={ry - 170} rx={28} ry={22} fill="#4FA35A" stroke={INK} strokeWidth={4} /> : null}
          </g>
        );
      }))}
      <rect x={60} y={1000} width={1800} height={200} fill="#D6C7AC" />
    </g>
  );
};

export const Rainbow: React.FC<{ p: number; cx: number; cy: number; r: number }> = ({ p, cx, cy, r }) => {
  const q = clamp(p);
  if (q <= 0) return null;
  return (
    <g fill="none" strokeLinecap="round" opacity={0.85 * clamp(q * 3)}>
      {['#FF5A5A', '#FFA24A', '#FFE15A', '#6BD97A', '#5AB8FF', '#9A7BFF'].map((c, i) => {
        const rr = r - i * 26;
        const a0 = Math.PI;
        const a1 = Math.PI + Math.PI * q;
        const [x0, y0, x1, y1] = [cx + Math.cos(a0) * rr, cy + Math.sin(a0) * rr, cx + Math.cos(a1) * rr, cy + Math.sin(a1) * rr];
        return <path key={c} d={`M ${x0} ${y0} A ${rr} ${rr} 0 0 1 ${x1} ${y1}`} stroke={c} strokeWidth={26} />;
      })}
    </g>
  );
};

/** A small pill label in the mono face (UI style) that pops in: used for "3 NGÀY". */
export const PopPill: React.FC<{ x: number; y: number; t: number; text: string; size?: number }> = ({ x, y, t, text, size = 64 }) => {
  if (t < 0) return null;
  const s = 1 + 0.2 * Math.sin(clamp(t / 8) * Math.PI) * (t < 8 ? 1 : 0);
  const w = text.length * size * 0.62 + 70;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2} y={-size * 0.8} width={w} height={size * 1.4} rx={size * 0.7} fill="#0B0816" opacity={0.82} />
      <text textAnchor="middle" y={size * 0.2} fontFamily={FONT.ui} fontSize={size} fill="#FF8A3D" letterSpacing={3}>{text}</text>
    </g>
  );
};
