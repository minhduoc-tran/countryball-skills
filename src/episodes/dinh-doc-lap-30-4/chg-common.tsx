import React from 'react';
import { FONT } from '../../engine';
import { INK } from './chd-common';
import { PhotoCard, KenBurns } from '../../countryball/photo-card';
import { FlagKind, MapFlag } from '../../countryball/flag-cloth';
import { useGeo } from '../../countryball/map-context';
import { backOut, easeOut, prog } from '../../countryball/fx-math';

// Chapter G (7:56-9:33, 30.04.1975 afternoon -> 1976 -> healing) shared bits. Reuses chapter D's stage / caption / tag / name card / map scene.
// Time: `t` = frames of the shot, camera keys + HUD = seconds. Quiet chapter: no gore, no gloating, both sides treated with equal respect.
export { INK, Stage, Cap, Tag, NameCard, MapScene, drift, NEUTRAL_LAND, CREDIT_OSM, CREDIT_NE, easeOut, prog } from './chd-common';
export const VNM_RED = '#C8573F';

/** Photos of chapter G (manifest.json). Photos taken after 1975 say so in the caption. */
export const GPHOTOS = {
  cabinet: { file: 'phong-hop-noi-cac.jpg', ratio: 1920 / 1440, cap: 'Phòng họp Nội các, Dinh Độc Lập (ảnh năm 2008)', credit: 'Ảnh: Vinhtantran / CC BY 3.0' },
  jeep: { file: 'xe-jeep-duong-van-minh.jpg', ratio: 1920 / 1440, cap: 'Xe jeep phục chế, trưng bày trong Dinh (ảnh 2013)', credit: 'Ảnh: RG72 / CC BY-SA 4.0' },
  skyline: { file: 'thanh-pho-ho-chi-minh-toan-canh-2024.jpg', ratio: 1920 / 859, cap: 'Thành phố Hồ Chí Minh ngày nay (ảnh 2024)', credit: 'Ảnh: Pimnl / CC0' },
} as const;
export type GPhotoKey = keyof typeof GPHOTOS;

/** One framed print; from/to in SECONDS, t in frames. */
export const GPhoto: React.FC<{ k: GPhotoKey; t: number; x: number; y: number; w: number; rot?: number; from?: number; kb?: KenBurns; fromSide?: 'left' | 'right' | 'bottom' }> = ({
  k, t, x, y, w, rot = -2, from = 0, kb, fromSide = 'bottom',
}) => {
  const p = GPHOTOS[k];
  return <PhotoCard id={`chg-${k}`} src={`dinh-doc-lap-30-4/img/${p.file}`} caption={p.cap} credit={p.credit} x={x} y={y} w={w} h={w / p.ratio} rot={rot} from={from} t={t / 30} kb={kb} fromSide={fromSide} />;
};

/** Map flag inside <GeoMap> that pops (back-ease) at frame `at`: `before` kind shown until then (or nothing). */
export const PopFlag: React.FC<{ lon: number; lat: number; kind: FlagKind; t: number; at: number; id: string; size?: number; before?: FlagKind }> = ({ lon, lat, kind, t, at, id, size = 76, before }) => {
  const { project } = useGeo(), [x, y] = project(lon, lat), k = backOut(prog(t, at, at + 12));
  if (t < at) return before ? <MapFlag lon={lon} lat={lat} kind={before} size={size} t={t} id={`${id}b`} /> : null;
  return <g transform={`translate(${x},${y}) scale(${k}) translate(${-x},${-y})`}><MapFlag lon={lon} lat={lat} kind={kind} size={size} t={t} id={id} /></g>;
};

/** Soft heart (warm, small). */
export const Heart: React.FC<{ x: number; y: number; s?: number; o?: number; color?: string }> = ({ x, y, s = 1, o = 1, color = '#E8695A' }) => (
  <path transform={`translate(${x},${y}) scale(${s})`} opacity={o} d="M0,12 C-30,-8 -22,-30 -8,-30 C-2,-30 0,-24 0,-22 C0,-24 2,-30 8,-30 C22,-30 30,-8 0,12 Z" fill={color} stroke="#111" strokeWidth={3} strokeLinejoin="round" />
);


/** Paraphrase card for the disputed surrender exchange: cream paper, small "TÓM Ý" tab, the gist in short lines, no quote marks. */
export const ParaCard: React.FC<{ t: number; at?: number; x: number; y: number; w?: number; lines: string[]; size?: number; accent?: string; tab?: string }> = ({
  t, at = 0, x, y, w = 900, lines, size = 62, accent = '#C9343A', tab = 'TÓM Ý, KHÔNG PHẢI NGUYÊN VĂN',
}) => {
  const k = easeOut((t - at) / 12);
  if (k <= 0.01) return null;
  const h = 120 + lines.length * size * 1.2;
  return (
    <g transform={`translate(${x},${y + (1 - k) * 40}) rotate(${-1.2})`} opacity={k}>
      <rect x={-w / 2 + 10} y={-h / 2 + 14} width={w} height={h} rx={14} fill="#000" opacity={0.4} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill="#F2EBD8" stroke={INK} strokeWidth={6} />
      <rect x={-w / 2} y={-h / 2} width={16} height={h} rx={8} fill={accent} />
      <text x={-w / 2 + 44} y={-h / 2 + 50} fontFamily={FONT.ui} fontWeight={800} fontSize={26} fill="#6A5A3A" letterSpacing={2}>{tab}</text>
      {lines.map((l, i) => <text key={i} x={0} y={-h / 2 + 104 + (i + 0.62) * size * 1.2} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill="#1C2733">{l}</text>)}
    </g>
  );
};
