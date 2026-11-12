import React from 'react';
import { FONT } from '../../engine';
import { Camera, CameraKey, cameraAt } from '../../countryball/geo-camera';
import { GeoMap } from '../../countryball/map-geo-map';
import { DateChip } from '../../countryball/hud-date-chip';
import { ClockChip, ClockKey } from '../../countryball/hud-clock-chip';
import { SourceLine } from '../../countryball/hud-chips';
import { MiniMap } from '../../countryball/hud-minimap';
import { PhotoCard, KenBurns } from '../../countryball/photo-card';
import { SAIGON_ATTRIBUTION } from '../../countryball/sai-gon-map-labels';
import { clamp, easeOut, prog } from '../../countryball/fx-math';

// Chapter D (3:58-5:13, 28-29.4.1975) shared helpers: stage backdrops, outlined captions, tags, name cards, a Sài Gòn / region map scene and
// the photo table (file, aspect, Vietnamese caption, credit line). Time: `t` = frames of the shot, camera keys + HUD = seconds (t / 30).

export const INK = '#111';
export const NEUTRAL_LAND = { VNM: '#B9A88A' };
export const CREDIT_OSM = `${SAIGON_ATTRIBUTION}; Natural Earth (public domain)`;
export const CREDIT_NE = 'Bản đồ: Natural Earth (public domain)';
export const USA_BLUE = '#4F7FC4';
export { clamp, easeOut, prog };

/** Photos of this chapter: aspect = width / height of the jpg, caption/credit follow manifest.json (taken after 1975 = says so). */
export const PHOTOS = {
  minh: { file: 'duong-van-minh-nguyen-khanh-1964.jpg', ratio: 1433 / 1118, cap: 'Tướng Dương Văn Minh và Nguyễn Khánh, năm 1964', credit: 'Ảnh: SP5 Gilbert L. Meyers, U.S. Army / Public domain (US Army)' },
  ford: { file: 'ford-kissinger-rockefeller-28-4-1975.jpg', ratio: 1920 / 1222, cap: 'Tổng thống Ford bàn việc di tản Sài Gòn, 28.04.1975', credit: 'Ảnh: David Hume Kennerly, White House (NARA) / Public domain' },
  airfield: { file: 'san-bay-tan-son-nhat-29-4-1975.jpg', ratio: 1519 / 1362, cap: 'Sân bay Tân Sơn Nhất, 29.04.1975', credit: 'Ảnh: GySgt D.L. Shearer, U.S. Marine Corps / Public domain (USMC)' },
  c130: { file: 'c130-chay-tren-duong-bang-tan-son-nhat.jpg', ratio: 1920 / 1481, cap: 'C-130 cháy trên đường băng, 29.04.1975', credit: 'Ảnh: U.S. Marine Corps / Public domain (USMC)' },
  dao: { file: 'khu-dao-tan-son-nhat-30-4-1975.jpg', ratio: 1515 / 1208, cap: 'Khu DAO ở Tân Sơn Nhất, nhìn từ trên không, 30.04.1975', credit: 'Ảnh: U.S. Navy / Public domain (US Navy)' },
  hancockMarines: { file: 'thuy-quan-luc-chien-tren-uss-hancock.jpg', ratio: 1920 / 1294, cap: 'TQLC Mỹ trên USS Hancock, 29.04.1975', credit: 'Ảnh: PH3 J. E. Kline, U.S. Navy / Public domain (US Navy)' },
  hancockCh53: { file: 'nguoi-di-tan-xuong-ch53-uss-hancock.jpg', ratio: 1920 / 1270, cap: 'Người di tản rời trực thăng CH-53, USS Hancock', credit: 'Ảnh: CPL M.A. Abraham, U.S. Marine Corps / Public domain (USMC)' },
  roofNow: { file: 'san-thuong-22-gia-long-ngay-nay.jpg', ratio: 1920 / 1346, cap: 'Nhìn từ sân thượng 22 Gia Long, ảnh năm 2016', credit: 'Ảnh: Prince Roy / CC BY 2.0' },
  blueRidgeLand: { file: 'truc-thang-uh1-ha-canh-blue-ridge.jpg', ratio: 1920 / 1366, cap: 'Trực thăng UH-1 tiếp cận USS Blue Ridge, 1975', credit: 'Ảnh: PH3 M. Musser, U.S. Navy / Public domain (US Navy)' },
  blueRidgePush: { file: 'truc-thang-uh1-bi-day-xuong-bien-blue-ridge.jpg', ratio: 1920 / 1358, cap: 'UH-1 bị đẩy xuống biển, USS Blue Ridge', credit: 'Ảnh: PH3 M. Musser, U.S. Navy / Public domain (US Navy)' },
  okinawaPush: { file: 'truc-thang-bi-day-xuong-bien-uss-okinawa.jpg', ratio: 1280 / 1717, cap: 'Trực thăng bị đẩy khỏi boong USS Okinawa', credit: 'Ảnh: U.S. Marine Corps / Public domain (USMC)' },
  boats: { file: 'thuyen-nguoi-di-tan-tiep-can-ham-doi-my.jpg', ratio: 1920 / 1350, cap: 'Thuyền chở người di tản tiến về hạm đội Mỹ', credit: 'Ảnh: PH3 Harold Brown, U.S. Navy / Public domain (US Navy)' },
} as const;
export type PhotoKey = keyof typeof PHOTOS;

/** One framed print (picture width `w`, height from the real aspect). from/to in SECONDS of the shot; `t` in frames. */
export const Photo: React.FC<{ k: PhotoKey; t: number; x: number; y: number; w: number; rot?: number; from?: number; to?: number; kb?: KenBurns; sepia?: number; fromSide?: 'left' | 'right' | 'bottom'; id?: string; cap?: string }> = ({
  k, t, x, y, w, rot = -2, from = 0, to, kb, sepia = 0, fromSide = 'bottom', id, cap,
}) => {
  const p = PHOTOS[k];
  return <PhotoCard id={id ?? `chd-${k}`} src={`dinh-doc-lap-30-4/img/${p.file}`} caption={cap ?? p.cap} credit={p.credit} x={x} y={y} w={w} h={w / p.ratio} rot={rot} from={from} to={to} t={t / 30} kb={kb} sepia={sepia} fromSide={fromSide} />;
};

type Tone = 'navy' | 'dusk' | 'night' | 'dawn' | 'noon';
const TONES: Record<Tone, [string, string]> = { navy: ['#0E1D2E', '#1B3350'], dusk: ['#3A2A47', '#E0875A'], night: ['#050B15', '#14233A'], dawn: ['#1C2C4A', '#E7A874'], noon: ['#2C5A85', '#BFD9EE'] };
/** Full-screen gradient stage (sky for dusk/dawn/noon). */
export const Stage: React.FC<{ id: string; tone?: Tone; dim?: number }> = ({ id, tone = 'navy', dim = 0 }) => (
  <g>
    <defs><linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={TONES[tone][0]} /><stop offset="1" stopColor={TONES[tone][1]} /></linearGradient></defs>
    <rect width={1920} height={1080} fill={`url(#${id}-bg)`} />
    {dim > 0 && <rect width={1920} height={1080} fill="#02060C" opacity={dim} />}
  </g>
);

/** Big outlined caption that pops in at frame `at`. */
export const Cap: React.FC<{ t: number; x: number; y: number; text: string; size?: number; color?: string; at?: number; anchor?: 'start' | 'middle' | 'end'; font?: 'title' | 'ui' | 'hand'; o?: number }> = ({
  t, x, y, text, size = 64, color = '#FFFFFF', at = 0, anchor = 'middle', font = 'title', o = 1,
}) => {
  const k = easeOut((t - at) / 8);
  if (k <= 0.01) return null;
  return (
    <text x={x} y={y + (1 - k) * 24} textAnchor={anchor} fontFamily={FONT[font]} fontWeight={800} fontSize={size} fill={color} stroke="#0A121C" strokeWidth={size * 0.16}
      paintOrder="stroke" strokeLinejoin="round" opacity={k * o}>{text}</text>
  );
};

/** Rounded tag chip centred on (x, y), optional sub line. */
export const Tag: React.FC<{ t: number; at?: number; x: number; y: number; text: string; fill?: string; color?: string; size?: number; sub?: string; subColor?: string }> = ({
  t, at = 0, x, y, text, fill = '#C9343A', color = '#FFF', size = 40, sub, subColor,
}) => {
  const k = easeOut((t - at) / 9);
  if (k <= 0.01) return null;
  const w = Math.max(text.length * size * 0.6, (sub ?? '').length * size * 0.34) + size * 1.3, h = size * 1.7 + (sub ? size * 0.65 : 0);
  return (
    <g transform={`translate(${x},${y}) scale(${0.85 + 0.15 * k})`} opacity={k}>
      <rect x={-w / 2 + 5} y={-h / 2 + 7} width={w} height={h} rx={h / 2.6} fill="#000" opacity={0.35} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2.6} fill={fill} stroke={INK} strokeWidth={5} />
      <text y={sub ? -size * 0.08 : size * 0.35} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color}>{text}</text>
      {sub && <text y={size * 0.85} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={size * 0.46} fill={subColor ?? color} opacity={0.95}>{sub}</text>}
    </g>
  );
};

/** Plain name card with a faceless silhouette (real people: no caricature). */
export const NameCard: React.FC<{ t: number; at?: number; x: number; y: number; name: string; sub?: string; w?: number; accent?: string }> = ({ t, at = 0, x, y, name, sub, w = 700, accent = '#8EA8E8' }) => {
  const k = easeOut((t - at) / 12);
  if (k <= 0.01) return null;
  return (
    <g transform={`translate(${x},${y + (1 - k) * 40})`} opacity={k}>
      <rect x={-w / 2 + 8} y={-100 + 12} width={w} height={220} rx={18} fill="#000" opacity={0.4} />
      <rect x={-w / 2} y={-100} width={w} height={220} rx={18} fill="#F2EBD8" stroke={INK} strokeWidth={5} />
      <rect x={-w / 2} y={-100} width={14} height={220} rx={7} fill={accent} />
      <rect x={-w / 2 + 34} y={-78} width={150} height={176} rx={10} fill="#4A5A6E" stroke={INK} strokeWidth={4} />
      <circle cx={-w / 2 + 109} cy={-20} r={38} fill="#8E9CAE" /><path d={`M${-w / 2 + 42},98 Q${-w / 2 + 109},12 ${-w / 2 + 176},98 Z`} fill="#8E9CAE" />
      <text x={-w / 2 + 208} y={-10} fontFamily={FONT.title} fontWeight={800} fontSize={Math.min(50, ((w - 240) / name.length) * 1.5)} fill="#1C2733">{name}</text>
      {sub && <text x={-w / 2 + 208} y={40} fontFamily={FONT.ui} fontWeight={700} fontSize={Math.min(25, ((w - 240) / sub.length) * 1.45)} fill="#5A4A2A">{sub}</text>}
    </g>
  );
};

type Hud = { date?: string; dates?: { t: number; label: string }[]; clock?: { date: string; keys: ClockKey[] }; mini?: boolean };
/** Map scene (GeoMap, neutral land). `osm` true = the Sài Gòn OSM level is on screen (credit line); false = the coarse region level. */
export const MapScene: React.FC<Hud & { t: number; id: string; keys: CameraKey[]; night?: number; osm?: boolean; map?: React.ReactNode; over?: (cam: Camera) => React.ReactNode; under?: (cam: Camera) => React.ReactNode }> = ({
  t, id, keys, night = 0, osm = true, map, over, under, date, dates, clock, mini = true,
}) => {
  const s = t / 30, cam = cameraAt(keys, s);
  return (
    <g>
      <rect width={1920} height={1080} fill="#0E1D2E" />
      <GeoMap camera={cam} night={night} colors={NEUTRAL_LAND} rivers id={id}>{map}</GeoMap>
      {under?.(cam)}
      {over?.(cam)}
      {(date || dates) && <DateChip label={date} dates={dates} t={s} id={`${id}-date`} />}
      {clock && <ClockChip date={clock.date} clock={clock.keys} t={s} id={`${id}-clock`} />}
      {mini && <MiniMap camera={cam} id={`${id}-mini`} />}
      <SourceLine text={osm ? CREDIT_OSM : CREDIT_NE} t={s} />
    </g>
  );
};

/** Slow linear drift between two cameras over `dur` seconds. */
export const drift = (a: Camera, b: Camera, dur: number): CameraKey[] => [{ t: 0, ...a, ease: 'linear' }, { t: dur, ...b, ease: 'linear' }];

/** "1.373": Vietnamese thousands separator. */
export const vn = (n: number): string => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
