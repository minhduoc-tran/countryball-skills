import React from 'react';
import { FONT } from '../../engine/fonts';
import { PhotoCard, KenBurns } from '../../countryball/photo-card';
import { easeOut, prog } from '../../countryball/fx-math';

// Chapter F (6:43-7:56, the palace's story + 10:45 / 11:30 on 30.04.1975) shared helpers: photo table, faceless silhouettes, name plate,
// tag chip, camera + film icons. Time: `t` = frames of the shot (30 fps); PhotoCard from/to = seconds.

export const INK = '#111418';
export const sec = (t: number) => t / 30;

/** Photos of this chapter (aspect = jpg w / h; caption + credit follow manifest.json; post-1975 photos would say so). */
export const PH = {
  norodom: { file: 'dinh-norodom-1961.jpg', ratio: 1920 / 1272, cap: 'Dinh Norodom thời Pháp, ảnh năm 1961', credit: 'Ảnh: U.S. Navy (Navy Medicine) / No known copyright restrictions' },
  y1969: { file: 'dinh-doc-lap-thang-3-1969.jpg', ratio: 1281 / 1028, cap: 'Dinh Độc Lập, tháng 3.1969', credit: 'Ảnh: SP5 Dennis D. Connell, U.S. Army / Public domain (US Army)' },
} as const;
export type PhKey = keyof typeof PH;

/** One framed print (picture width `w`); from/to in SECONDS of the shot. */
export const PhotoF: React.FC<{ k: PhKey; t: number; x: number; y: number; w: number; rot?: number; from?: number; to?: number; kb?: KenBurns; sepia?: number; id: string }> = ({
  k, t, x, y, w, rot = -2, from = 0, to, kb, sepia = 0, id,
}) => {
  const p = PH[k];
  return <PhotoCard id={id} src={`dinh-doc-lap-30-4/img/${p.file}`} caption={p.cap} credit={p.credit} x={x} y={y} w={w} h={w / p.ratio} rot={rot} from={from} to={to} t={t / 30} kb={kb} sepia={sepia} fromSide="bottom" />;
};

/** Faceless person, feet at (x, y). pose 'run' = stride with arms swinging, `carry` = rolled flag in the hands (red top / blue bottom). */
export const Sil: React.FC<{ x: number; y: number; s?: number; color?: string; flip?: boolean; pose?: 'stand' | 'run'; t?: number; carry?: boolean; helmet?: boolean }> = ({
  x, y, s = 1, color = '#1A2430', flip = false, pose = 'stand', t = 0, carry = false, helmet = false,
}) => {
  const sw = pose === 'run' ? Math.sin(t * 0.55) : 0;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <ellipse cy={3} rx={26} ry={6} fill="#000" opacity={0.22} />
      <path d={`M-9,-52 L${-12 - 16 * sw},0 L${-2 - 16 * sw},0 L2,-52 Z`} fill={color} />
      <path d={`M-3,-52 L${10 + 16 * sw},0 L${20 + 16 * sw},0 L12,-52 Z`} fill={color} />
      <path d="M-16,-52 Q-17,-104 0,-106 Q17,-104 16,-52 Z" fill={color} />
      <path d={`M10,-98 L${carry ? 34 : 26 + 12 * sw},${carry ? -78 : -64 - 8 * sw}`} stroke={color} strokeWidth={9} strokeLinecap="round" />
      <path d={`M-10,-98 L${-24 - 12 * sw},${-62 + 8 * sw}`} stroke={color} strokeWidth={9} strokeLinecap="round" />
      <circle cy={-124} r={17} fill={color} />
      {helmet && <path d="M-19,-126 Q-19,-148 0,-148 Q19,-148 19,-126 Z" fill="#5E7440" stroke={INK} strokeWidth={2.4} />}
      {carry && (
        <g transform="translate(32,-80) rotate(-28)">
          <rect x={-8} y={-48} width={16} height={48} rx={6} fill="#C9343A" stroke={INK} strokeWidth={2.4} />
          <rect x={-8} y={-26} width={16} height={26} rx={6} fill="#2F5FB4" stroke={INK} strokeWidth={2.4} />
          <rect x={-3} y={-56} width={6} height={64} rx={3} fill="#C8B58A" stroke={INK} strokeWidth={2} />
        </g>
      )}
    </g>
  );
};

/** Plain name plate with a faceless silhouette (real people: never a ball or a caricature). */
export const Who: React.FC<{ t: number; at?: number; x: number; y: number; name: string; sub: string; w?: number; accent?: string }> = ({ t, at = 0, x, y, name, sub, w = 860, accent = '#C9343A' }) => {
  const k = easeOut((t - at) / 12);
  if (k <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y + (1 - k) * 40})`} opacity={k}>
      <rect x={-w / 2 + 8} y={-110 + 12} width={w} height={240} rx={20} fill="#000" opacity={0.4} />
      <rect x={-w / 2} y={-110} width={w} height={240} rx={20} fill="#F2EBD8" stroke={INK} strokeWidth={5} />
      <rect x={-w / 2} y={-110} width={16} height={240} rx={8} fill={accent} />
      <rect x={-w / 2 + 38} y={-86} width={168} height={192} rx={12} fill="#4A5A6E" stroke={INK} strokeWidth={4} />
      <circle cx={-w / 2 + 122} cy={-24} r={42} fill="#8E9CAE" /><path d={`M${-w / 2 + 48},106 Q${-w / 2 + 122},16 ${-w / 2 + 196},106 Z`} fill="#8E9CAE" />
      <text x={-w / 2 + 236} y={-8} fontFamily={FONT.title} fontWeight={800} fontSize={Math.min(60, ((w - 270) / name.length) * 1.5)} fill="#1C2733">{name}</text>
      <text x={-w / 2 + 236} y={52} fontFamily={FONT.title} fontWeight={700} fontSize={Math.min(34, ((w - 270) / sub.length) * 1.7)} fill="#6B4A22">{sub}</text>
    </g>
  );
};

/** Rounded tag chip centred on (x, y). */
export const Pill: React.FC<{ t: number; at?: number; x: number; y: number; text: string; fill?: string; color?: string; size?: number; o?: number }> = ({ t, at = 0, x, y, text, fill = '#C9343A', color = '#FFFFFF', size = 46, o = 1 }) => {
  const k = easeOut((t - at) / 9);
  if (k <= 0.01) return null;
  const w = text.length * size * 0.6 + size * 1.4, h = size * 1.7;
  return (
    <g transform={`translate(${x},${y}) scale(${0.85 + 0.15 * k})`} opacity={k * o}>
      <rect x={-w / 2 + 5} y={-h / 2 + 7} width={w} height={h} rx={h / 2.6} fill="#000" opacity={0.35} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2.6} fill={fill} stroke={INK} strokeWidth={5} />
      <text y={size * 0.35} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color}>{text}</text>
    </g>
  );
};

/** Press camera (flash burst when `flash` 0..1). */
export const CameraIcon: React.FC<{ x: number; y: number; s?: number; flash?: number }> = ({ x, y, s = 1, flash = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} strokeLinejoin="round">
    {flash > 0 && <g opacity={flash}><circle cx={60} cy={-70} r={60 + 80 * (1 - flash)} fill="#FFF6C8" opacity={0.55} />{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <line key={a} x1={60} y1={-70} x2={60 + Math.cos((a * Math.PI) / 180) * (90 + 40 * (1 - flash))} y2={-70 + Math.sin((a * Math.PI) / 180) * (90 + 40 * (1 - flash))} stroke="#FFF1A8" strokeWidth={8} strokeLinecap="round" />)}</g>}
    <rect x={-150} y={-70} width={300} height={190} rx={26} fill="#2B3038" stroke={INK} strokeWidth={6} />
    <rect x={-150} y={-70} width={300} height={56} rx={26} fill="#D8D2C0" stroke={INK} strokeWidth={6} />
    <rect x={-92} y={-96} width={66} height={32} rx={8} fill="#D8D2C0" stroke={INK} strokeWidth={6} />
    <circle cx={0} cy={36} r={74} fill="#1A1E24" stroke={INK} strokeWidth={6} /><circle cx={0} cy={36} r={52} fill="#3A5E84" stroke={INK} strokeWidth={5} />
    <circle cx={-18} cy={18} r={14} fill="#CFE4F5" opacity={0.8} />
    <circle cx={100} cy={-40} r={11} fill="#C9343A" stroke={INK} strokeWidth={4} />
  </g>
);

/** Film strip (sprocket holes) running horizontally; `frames` = how many picture cells, `shift` slides it (px). */
export const FilmStrip: React.FC<{ x: number; y: number; w: number; h?: number; shift?: number; rot?: number; draw?: (i: number, cx: number, cy: number, cw: number, ch: number) => React.ReactNode; frames?: number }> = ({
  x, y, w, h = 230, shift = 0, rot = 0, draw, frames = 5,
}) => {
  const cw = w / frames, hole = 26, step = 52;
  const off = ((shift % cw) + cw) % cw;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill="#16181D" stroke={INK} strokeWidth={5} />
      {Array.from({ length: Math.ceil(w / step) + 1 }, (_, i) => {
        const hx = -w / 2 + ((i * step + shift) % (w + step)) + 8;
        return hx < w / 2 - hole && <g key={i}><rect x={hx} y={-h / 2 + 12} width={hole} height={hole * 0.7} rx={5} fill="#E8E2D0" /><rect x={hx} y={h / 2 - 12 - hole * 0.7} width={hole} height={hole * 0.7} rx={5} fill="#E8E2D0" /></g>;
      })}
      <clipPath id={`fs-${Math.round(x)}-${Math.round(y)}`}><rect x={-w / 2} y={-h / 2} width={w} height={h} /></clipPath>
      <g clipPath={`url(#fs-${Math.round(x)}-${Math.round(y)})`}>
        {Array.from({ length: frames + 1 }, (_, i) => {
          const cx = -w / 2 + cw * (i + 0.5) - off + cw * 0.0;
          return <g key={i}><rect x={cx - cw / 2 + 12} y={-h / 2 + 50} width={cw - 24} height={h - 100} rx={6} fill="#9FB4C4" stroke="#0B0D10" strokeWidth={3} />{draw?.(i, cx, 0, cw - 24, h - 100)}</g>;
        })}
      </g>
    </g>
  );
};

/** Dark navy radial backdrop (cards without a map). */
export const Back: React.FC<{ id: string; a?: string; b?: string }> = ({ id, a = '#1C2A44', b = '#0A101C' }) => (
  <g>
    <defs><radialGradient id={`${id}-bg`} cx="0.5" cy="0.45" r="0.85"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></radialGradient></defs>
    <rect width={1920} height={1080} fill={`url(#${id}-bg)`} />
  </g>
);

export { prog, easeOut };

/** Warm ground strip under a side-view scene (horizon at y). */
export const Ground: React.FC<{ id: string; y?: number }> = ({ id, y = 900 }) => (
  <g>
    <defs><linearGradient id={`${id}-gr`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5B5A44" /><stop offset="1" stopColor="#2E2D22" /></linearGradient></defs>
    <rect x={0} y={y} width={1920} height={1080 - y} fill={`url(#${id}-gr)`} />
    <rect x={0} y={y} width={1920} height={6} fill="#1B1B14" opacity={0.7} />
  </g>
);

/** Wrought-iron gate icon: two stone pillars and bars; (x, y) = bottom centre, `lit` outlines it gold. */
export const GateIcon: React.FC<{ x: number; y: number; w?: number; h?: number; lit?: boolean; open?: boolean }> = ({ x, y, w = 300, h = 220, lit = false, open = false }) => (
  <g transform={`translate(${x},${y})`} strokeLinejoin="round">
    {lit && <rect x={-w / 2 - 18} y={-h - 18} width={w + 36} height={h + 22} rx={14} fill="none" stroke="#FFE600" strokeWidth={7} opacity={0.9} />}
    {!open && Array.from({ length: 9 }, (_, i) => <rect key={i} x={-w / 2 + 34 + (i * (w - 68)) / 8 - 4} y={-h * 0.82} width={8} height={h * 0.8} fill="#2B2B30" />)}
    {!open && <><rect x={-w / 2 + 30} y={-h * 0.82} width={w - 60} height={9} fill="#2B2B30" /><rect x={-w / 2 + 30} y={-h * 0.16} width={w - 60} height={9} fill="#2B2B30" /></>}
    {[-1, 1].map((sd) => <g key={sd}><rect x={sd * (w / 2 - 20) - 22} y={-h} width={44} height={h} fill="#E9E4D3" stroke={INK} strokeWidth={4} /><rect x={sd * (w / 2 - 20) - 30} y={-h - 16} width={60} height={18} fill="#DAD3BC" stroke={INK} strokeWidth={4} /></g>)}
  </g>
);

/** A-1 Skyraider side view (propeller attack plane the two pilots flew on 27.02.1962), nose towards +x; (x, y) = centre. */
export const SkyraiderSide: React.FC<{ x: number; y: number; size?: number; t?: number }> = ({ x, y, size = 280, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${size / 100})`} strokeLinejoin="round" stroke="#151515">
    <path d="M-40,-6 L-50,-34 L-58,-34 L-56,-4 Z" fill="#7F8A70" strokeWidth={1.6} />
    <path d="M44,-6 Q50,0 44,7 L20,9 L-30,5 L-56,2 L-56,-4 L-30,-8 L20,-10 Z" fill="#8F9A7E" strokeWidth={1.8} />
    <path d="M14,-10 Q8,-20 -6,-19 L-12,-10 Z" fill="#A9D2EA" strokeWidth={1.4} />
    <rect x={-8} y={4} width={34} height={5} rx={2.5} fill="#6E7A63" strokeWidth={1.4} />
    <path d="M10,9 L8,20 M30,8 L32,18" strokeWidth={1.6} />
    <circle cx={8} cy={21} r={3} fill="#2A2A2A" strokeWidth={1} /><circle cx={-52} cy={4} r={2} fill="#2A2A2A" strokeWidth={0.8} />
    <rect x={44} y={-3} width={8} height={6} rx={2} fill="#555" strokeWidth={1.2} />
    <ellipse cx={53} cy={0} rx={2.2} ry={18 * (0.75 + 0.25 * Math.abs(Math.sin(t * 1.3)))} fill="#C9CED3" opacity={0.55} strokeWidth={0.8} />
  </g>
);
