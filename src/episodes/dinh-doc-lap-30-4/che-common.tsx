import React from 'react';
import { FONT } from '../../engine';
import { PhotoCard, KenBurns } from '../../countryball/photo-card';
import { Cap, Tag, NameCard, Stage, MapScene, INK, NEUTRAL_LAND, USA_BLUE, CREDIT_OSM, CREDIT_NE, clamp, easeOut, prog, drift, vn } from './chd-common';

// Chapter E (5:13-6:43, 29-30.4.1975 morning): shared helpers. Re-uses chapter D's stage/caption/tag/name-card/map helpers by import and adds the
// photo table of chapter E and a few small stage pieces. `t` = frames of the shot; HUD and camera keys = seconds (t / 30).

export { Cap, Tag, NameCard, Stage, MapScene, INK, NEUTRAL_LAND, USA_BLUE, CREDIT_OSM, CREDIT_NE, clamp, easeOut, prog, drift, vn };
export const VNM_RED = '#C9343A', RVN_YELLOW = '#E8B422';

/** Photos of chapter E (aspect = jpg width / height; captions + credits follow manifest.json; no date on the Midway print: it is not narrated). */
export const PHOTOS_E = {
  midway: { file: 'cessna-o1-ly-bung-ha-canh-uss-midway.jpg', ratio: 1879 / 1478, cap: 'Máy bay O-1 của thiếu tá Lý Bửng sau khi hạ cánh trên USS Midway', credit: 'Ảnh: U.S. Navy / Public domain (US Navy)' },
  martin: { file: 'ford-gap-graham-martin-25-3-1975.jpg', ratio: 1920 / 1270, cap: 'Tổng thống Ford họp với Kissinger, tướng Weyand và Đại sứ Graham Martin, 25.03.1975', credit: 'Ảnh: David Hume Kennerly, White House (Gerald R. Ford Library) / Public domain' },
  bridge: { file: 'cau-sai-gon-1961.jpg', ratio: 800 / 597, cap: 'Cầu Sài Gòn vừa hoàn thành, tháng 5.1961', credit: 'Ảnh: Arthur Z. Gardiner, U.S. Dept. of State (USOM) / Public domain' },
  leDuan: { file: 'nhin-tu-dinh-ra-duong-le-duan-1996.jpg', ratio: 1456 / 980, cap: 'Từ ban công Dinh nhìn ra cổng chính và đường Lê Duẩn, ảnh năm 1996', credit: 'Ảnh: Ik T from Kanagawa, Japan / CC BY 2.0' },
} as const;
export type PhotoKeyE = keyof typeof PHOTOS_E;

/** One framed print of chapter E. from/to in SECONDS of the shot, `t` in frames. */
export const PhotoE: React.FC<{ k: PhotoKeyE; id: string; t: number; x: number; y: number; w: number; rot?: number; from?: number; to?: number; kb?: KenBurns; sepia?: number; fromSide?: 'left' | 'right' | 'bottom' }> = ({
  k, id, t, x, y, w, rot = -2, from = 0, to, kb, sepia = 0, fromSide = 'bottom',
}) => {
  const p = PHOTOS_E[k];
  return <PhotoCard id={id} src={`dinh-doc-lap-30-4/img/${p.file}`} caption={p.cap} credit={p.credit} x={x} y={y} w={w} h={w / p.ratio} rot={rot} from={from} to={to} t={t / 30} kb={kb} sepia={sepia} fromSide={fromSide} />;
};

/** Sea horizon backdrop (sky gradient + sea + a few wave dashes), `y` = horizon line. */
export const SeaBackdrop: React.FC<{ id: string; y?: number; tone?: 'dawn' | 'day' | 'dusk'; t?: number }> = ({ id, y = 640, tone = 'dawn', t = 0 }) => {
  const sky: Record<string, [string, string]> = { dawn: ['#2A3C66', '#F2B77E'], day: ['#7DB6E0', '#E2F1F8'], dusk: ['#4B4F80', '#F0A872'] };
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[tone][0]} /><stop offset="1" stopColor={sky[tone][1]} /></linearGradient>
        <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3C6F96" /><stop offset="1" stopColor="#12304F" /></linearGradient>
      </defs>
      <rect width={1920} height={y} fill={`url(#${id}-sky)`} />
      <circle cx={1500} cy={y - 10} r={90} fill="#FFE3AE" opacity={0.8} />
      <rect y={y - 2} width={1920} height={1082 - y} fill={`url(#${id}-sea)`} />
      {Array.from({ length: 18 }, (_, i) => {
        const wx = (((i * 337) % 2000) + t * (0.8 + (i % 5) * 0.25)) % 2100 - 100, wy = y + 24 + ((i * 131) % (1060 - y - 40));
        return <path key={i} d={`M${wx},${wy} q22,-7 44,0 t44,0`} fill="none" stroke="#E8F4FF" strokeWidth={3} opacity={0.3} />;
      })}
    </g>
  );
};

/** Big readable line with a rounded dark plate (labels on busy backgrounds). */
export const Plate: React.FC<{ t: number; at?: number; x: number; y: number; text: string; size?: number; color?: string; sub?: string }> = ({ t, at = 0, x, y, text, size = 56, color = '#FFFFFF', sub }) => {
  const k = easeOut((t - at) / 9);
  if (k <= 0.01) return null;
  const w = Math.max(text.length * size * 0.66, (sub ?? '').length * size * 0.36) + size, h = size * 1.5 + (sub ? size * 0.7 : 0);
  return (
    <g transform={`translate(${x},${y + (1 - k) * 20})`} opacity={k}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={16} fill="#0C1320" opacity={0.82} stroke="#2E3F5C" strokeWidth={3} />
      <text y={sub ? -size * 0.05 : size * 0.35} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color}>{text}</text>
      {sub && <text y={size * 0.78} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={size * 0.4} fill="#E2B95A">{sub}</text>}
    </g>
  );
};
