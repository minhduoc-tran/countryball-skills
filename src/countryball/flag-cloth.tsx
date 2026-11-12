import React from 'react';
import { star, PRG_COLORS } from './ball-flags';
import { useGeo } from './map-context';
import { cambodiaFlagFace, CambodiaPoleFlag } from './ball-flags-cambodia';

// Rectangular flags with an optional wind wave (the ball flags live in ball-flags.tsx; these are the flags on poles):
//   <FlagCloth id x y w h kind wave? t? />   flag with its pole edge at (x, y) (top-left), w x h px, 2:3 flags use h = 2/3 w
//   kind 'PRG' = Mặt trận Dân tộc Giải phóng miền Nam / Chính phủ Cách mạng lâm thời: top half red, bottom half blue, yellow star on the split
//        (the flag raised on the Dinh Độc Lập roof on 30.4.1975); 'RVN' = VNCH yellow with three red stripes; 'VNM' = red, yellow star;
//        'USA' = stripes + canton (simplified)
//   <MapFlag lon lat kind size? minZoom? t? />   a flag planted at a lon/lat of the GeoMap (child of <GeoMap>)
//   wave 0..1 = amplitude (0 = flat), t = frame (the ripple travels away from the pole); the cloth is cut into vertical columns, each
//   shifted and sheared, so the SAME flag art waves without any filter. `id` must be unique per flag in a frame (clipPaths).
// Pure function of its props.

/** + Cambodian / Thai kinds (ball-flags-cambodia.tsx): 'DK' 1975-79, 'PRK' 1979-89, 'SOC' 1989-93, 'KHM' today, 'THA'. */
export type FlagKind = 'PRG' | 'RVN' | 'VNM' | 'USA' | CambodiaPoleFlag;
const INK = '#1B1B1B';

/** The flag art in the box [0,w] x [0,h]. */
export const flagFace = (kind: FlagKind, w: number, h: number): React.ReactNode => {
  switch (kind) {
    case 'PRG':
      return <><rect width={w} height={h / 2 + 0.5} fill={PRG_COLORS.red} /><rect y={h / 2} width={w} height={h / 2} fill={PRG_COLORS.blue} /><polygon points={star(w / 2, h / 2, h * 0.3)} fill={PRG_COLORS.star} /></>;
    case 'RVN':
      return <><rect width={w} height={h} fill="#F5CE4B" />{[0, 1, 2].map((i) => <rect key={i} y={h * (0.3 + (2 * i) / 15)} width={w} height={h / 15} fill="#C62528" />)}</>;
    case 'VNM':
      return <><rect width={w} height={h} fill="#DA251D" /><polygon points={star(w / 2, h / 2, h * 0.3)} fill="#FFCD00" /></>;
    case 'DK': case 'PRK': case 'SOC': case 'KHM': case 'THA':
      return cambodiaFlagFace(kind, w, h);
    default:
      return <><rect width={w} height={h} fill="#F4F5F8" />{Array.from({ length: 7 }, (_, i) => <rect key={i} y={(i * 2 * h) / 13} width={w} height={h / 13} fill="#B22234" />)}<rect width={w * 0.42} height={(h * 7) / 13} fill="#3C3B6E" /></>;
  }
};

const COLS = 14;
export const FlagCloth: React.FC<{ id: string; x: number; y: number; w: number; h: number; kind: FlagKind; wave?: number; t?: number; outline?: boolean }> = ({ id, x, y, w, h, kind, wave = 0, t = 0, outline = true }) => {
  const cw = w / COLS, amp = wave * h * 0.12;
  const col = (i: number) => {
    const u = (i + 0.5) / COLS, ph = t * 0.22 - u * 5.2, env = Math.min(1, u * 2.2), dy = amp * Math.sin(ph) * env, slope = Math.max(-1, Math.min(1, wave * Math.cos(ph) * env));
    return { dy, slope };
  };
  const cols = Array.from({ length: COLS }, (_, i) => ({ i, ...col(i) }));
  return (
    <g transform={`translate(${x},${y})`}>
      <defs>{cols.map(({ i }) => <clipPath key={i} id={`${id}-fc${i}`}><rect x={i * cw - 0.3} y={-h} width={cw + 0.6} height={3 * h} /></clipPath>)}</defs>
      {cols.map(({ i, dy, slope }) => (
        <g key={i} transform={`translate(0,${dy.toFixed(2)})`}>
          <g clipPath={`url(#${id}-fc${i})`}>
            {flagFace(kind, w, h)}
            {slope > 0.02 && <rect x={i * cw} y={0} width={cw} height={h} fill="#000" opacity={0.28 * slope} />}
            {slope < -0.02 && <rect x={i * cw} y={0} width={cw} height={h} fill="#fff" opacity={0.22 * -slope} />}
          </g>
        </g>
      ))}
      {outline && <path d={`M0,0 ${cols.map(({ i, dy }) => `L${((i + 0.5) * cw).toFixed(1)},${dy.toFixed(1)}`).join(' ')} L${w},${cols[COLS - 1].dy.toFixed(1)}`} fill="none" stroke={INK} strokeWidth={Math.max(1.2, h * 0.03)} strokeLinecap="round" />}
      {outline && <path d={`M0,${h} ${cols.map(({ i, dy }) => `L${((i + 0.5) * cw).toFixed(1)},${(h + dy).toFixed(1)}`).join(' ')} L${w},${(h + cols[COLS - 1].dy).toFixed(1)}`} fill="none" stroke={INK} strokeWidth={Math.max(1.2, h * 0.03)} strokeLinecap="round" />}
      {outline && <line x1={0} y1={0} x2={0} y2={h} stroke={INK} strokeWidth={Math.max(1.2, h * 0.03)} />}
    </g>
  );
};

/** Flag on a pole planted at a lon/lat of the map (child of <GeoMap>): pole + waving cloth, scaled by `size` px (cloth width), fades in above `minZoom`
 *  (px/deg). `kind` 'PRG' marks the places taken by the Quân Giải phóng, 'RVN' the Sài Gòn side. `t` frames. */
export const MapFlag: React.FC<{ lon: number; lat: number; kind: FlagKind; size?: number; minZoom?: number; t?: number; id?: string }> = ({ lon, lat, kind, size = 84, minZoom = 0, t = 0, id = 'mflag' }) => {
  const { project, camera, screen } = useGeo(), [x, y] = project(lon, lat);
  const o = Math.min(1, Math.max(0, (camera.zoom - minZoom * 0.8) / Math.max(1, minZoom * 0.2)));
  if (o <= 0.01 || x < -200 || x > screen.W + 200 || y < -200 || y > screen.H + 200) return null;
  const h = size * 0.66;
  return (
    <g opacity={o}>
      <ellipse cx={x} cy={y} rx={9} ry={3.4} fill="#000" opacity={0.3} />
      <line x1={x} y1={y} x2={x} y2={y - h * 1.7} stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <FlagCloth id={`${id}-${Math.round(x)}-${Math.round(y)}`} x={x + 1} y={y - h * 1.7} w={size} h={h} kind={kind} wave={0.7} t={t} />
    </g>
  );
};
