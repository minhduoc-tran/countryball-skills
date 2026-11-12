import React from 'react';
import { FONT } from '../../engine';
import { PhotoCard, KenBurns } from '../../countryball/photo-card';
import { PalaceFacade } from '../../countryball/palace-facade';
import { GateCrash } from '../../countryball/palace-gate-crash';
import { FlagCloth } from '../../countryball/flag-cloth';
import { clamp, easeOut, hash, prog } from '../../countryball/fx-math';

// Chapter H (9:33-10:39, "ngày nay" -> CTA) shared helpers: the photo table (today's photos say so), a today's-palace facade with the national
// flag, confetti + fireworks, a museum icon, a gold plaque. Time: `t` = frames of the shot; HUD times = seconds (t / 30).
// Stage / Cap / Tag / MapScene / drift come from chd-common (re-exported here).
export { Stage, Cap, Tag, MapScene, drift, INK, CREDIT_OSM, prog, easeOut, clamp } from './chd-common';

/** Photos of this chapter (aspect = jpg width / height, caption + credit follow manifest.json; photos taken after 1975 say so). */
export const PHOTOS = {
  front: { file: 'dinh-doc-lap-mat-tien-2019.jpg', ratio: 1920 / 1280, cap: 'Dinh Độc Lập ngày nay, ảnh năm 2019', credit: 'Ảnh: Balon Greyjoy / CC0' },
  night: { file: 'dinh-doc-lap-ve-dem-2013.jpg', ratio: 1920 / 1080, cap: 'Dinh Độc Lập về đêm, ảnh năm 2013', credit: 'Ảnh: trungydang / CC BY 3.0' },
  roof: { file: 'san-thuong-dau-bom-8-4-1975.jpg', ratio: 1920 / 1277, cap: 'Sân thượng Dinh: vòng đỏ đánh dấu chỗ bom 08.04.1975 (ảnh 2007)', credit: 'Ảnh: Kenohori / CC0' },
  t843hn: { file: 'xe-tang-843-bao-tang-moi-2025.jpg', ratio: 1920 / 947, cap: 'Xe 843 nguyên bản, Hà Nội, ảnh 2025', credit: 'Ảnh: kitmasterbloke / CC BY 2.0' },
  museum: { file: 'bao-tang-lich-su-quan-su-viet-nam-2025.jpg', ratio: 1920 / 631, cap: 'Bảo tàng Lịch sử Quân sự Việt Nam, Hà Nội, 2025', credit: 'Ảnh: kitmasterbloke / CC BY 2.0' },
  t390: { file: 'xe-tang-390-dinh-doc-lap-2013.jpg', ratio: 1920 / 1280, cap: 'Xe cùng loại 390, trưng bày tại Dinh (2013)', credit: 'Ảnh: Gary Todd / CC0' },
  t390close: { file: 'xe-tang-390-can-canh-2023.jpg', ratio: 1920 / 1440, cap: 'Xe cùng loại 390 trưng bày tại Dinh, ảnh 2023', credit: 'Ảnh: 源義信 / CC BY 4.0' },
  t843: { file: 'xe-tang-843-dinh-doc-lap-2023.jpg', ratio: 1920 / 1440, cap: 'Xe cùng loại 843, trưng bày tại Dinh (2023)', credit: 'Ảnh: 源義信 / CC BY 4.0' },
  avenue: { file: 'duong-le-duan-2014.jpg', ratio: 1920 / 1175, cap: 'Đường Lê Duẩn, Quận 1, ảnh năm 2014', credit: 'Ảnh: trungydang / CC BY 3.0' },
} as const;
export type PhotoKey = keyof typeof PHOTOS;

/** One framed print; width `w` of the picture, height from the real aspect. from/to in SECONDS of the shot; `t` in frames. */
export const Photo: React.FC<{ k: PhotoKey; t: number; x: number; y: number; w: number; rot?: number; from?: number; to?: number; kb?: KenBurns; fromSide?: 'left' | 'right' | 'bottom'; cap?: string }> = ({
  k, t, x, y, w, rot = -1.5, from = 0, to, kb, fromSide = 'bottom', cap,
}) => {
  const p = PHOTOS[k];
  return <PhotoCard id={`chh-${k}`} src={`dinh-doc-lap-30-4/img/${p.file}`} caption={cap ?? p.cap} credit={p.credit} x={x} y={y} w={w} h={w / p.ratio} rot={rot} from={from} to={to} t={t / 30} kb={kb} fromSide={fromSide} />;
};

/** Today's palace front (same look as chapter A) with the national flag (VNM) on the roof pole instead of RVN / PRG. */
export const TodayFacade: React.FC<{ id: string; x: number; y: number; w?: number; tone?: 'day' | 'dusk' | 'night'; t: number; backdrop?: boolean; windows?: number }> = ({ id, x, y, w = 1700, tone = 'day', t, backdrop = true, windows = 0.5 }) => {
  const s = w / 1500;
  return (
    <g>
      <PalaceFacade id={id} x={x} y={y} w={w} tone={tone} flag="none" t={t} backdrop={backdrop} windows={windows} />
      <g transform={`translate(${x},${y}) scale(${s})`}><FlagCloth id={`${id}-vn`} x={72} y={-774} w={150} h={100} kind="VNM" wave={0.8} t={t} /></g>
    </g>
  );
};

/** The intact main gate at dusk without the 1975 tank (gate at x = 620) and the national flag on the Dinh. */
export const GateToday: React.FC<{ id: string; t: number }> = ({ id, t }) => (
  <g>
    <GateCrash id={id} x={770} y={880} crash={0} t={t} tone="dusk" flag={false} tank={false} />
    <g transform={`translate(${770 + 400},${880 - 90}) scale(${980 / 1500})`}><FlagCloth id={`${id}-vn`} x={72} y={-774} w={150} h={100} kind="VNM" wave={0.8} t={t} /></g>
  </g>
);

const CONF = ['#E0483C', '#FFD43B', '#FFFFFF', '#F2A33A', '#6FB6E8'];
/** Falling confetti (deterministic): n pieces over the full screen, `o` overall opacity. */
export const Confetti: React.FC<{ t: number; n?: number; o?: number; seed?: number; speed?: number }> = ({ t, n = 70, o = 1, seed = 3, speed = 2.6 }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const x0 = hash(i, seed) * 1920, sp = speed * (0.7 + 0.6 * hash(i, seed + 1)), y = ((t * sp + hash(i, seed + 2) * 1300) % 1300) - 120;
      const x = x0 + Math.sin(t * 0.07 + i) * 36, rot = t * (3 + 5 * hash(i, 9)) + i * 40, sx = Math.cos(t * 0.15 + i);
      return <rect key={i} x={-7} y={-4} width={14} height={8} rx={1.5} fill={CONF[i % CONF.length]} transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(0)}) scale(${sx.toFixed(2)},1)`} />;
    })}
  </g>
);

/** Firework burst starting at frame `at`: sparks fly out, droop and fade over ~64 frames. */
export const Firework: React.FC<{ t: number; at: number; x: number; y: number; color?: string; r?: number; n?: number }> = ({ t, at, x, y, color = '#FFD43B', r = 190, n = 26 }) => {
  const a = t - at;
  if (a < 0 || a > 66) return null;
  const k = easeOut(a / 34), fade = 1 - prog(a, 26, 66);
  return (
    <g opacity={fade}>
      <circle cx={x} cy={y} r={30 * (1 - prog(a, 0, 10))} fill="#FFFFFF" opacity={0.9 * (1 - prog(a, 0, 10))} />
      {Array.from({ length: n }, (_, i) => {
        const ang = ((i * 360) / n + (i % 2) * 6) * (Math.PI / 180), d = r * k * (0.8 + 0.25 * hash(i, 5)), g = a * a * 0.05;
        const px = x + Math.cos(ang) * d, py = y + Math.sin(ang) * d + g, tx = x + Math.cos(ang) * d * 0.82, ty = y + Math.sin(ang) * d * 0.82 + g * 0.7;
        return (
          <g key={i}>
            <line x1={tx} y1={ty} x2={px} y2={py} stroke={i % 3 === 0 ? '#FFFFFF' : color} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
            <circle cx={px} cy={py} r={5} fill={i % 3 === 0 ? '#FFFFFF' : color} />
          </g>
        );
      })}
    </g>
  );
};

/** Little museum building (pediment + columns), centre-bottom (x, y), width w. */
export const MuseumIcon: React.FC<{ x: number; y: number; w?: number; color?: string }> = ({ x, y, w = 360, color = '#E9E0C6' }) => {
  const h = w * 0.55, cols = 6, cw = w / (cols * 2);
  return (
    <g transform={`translate(${x},${y})`} stroke="#1B1B1E" strokeWidth={5} strokeLinejoin="round">
      <ellipse cy={4} rx={w * 0.56} ry={12} fill="#000" opacity={0.25} stroke="none" />
      <rect x={-w / 2 - 14} y={-16} width={w + 28} height={16} fill="#BDB49A" />
      <rect x={-w / 2} y={-h * 0.8} width={w} height={h * 0.8 - 16} fill={color} />
      {Array.from({ length: cols }, (_, i) => <rect key={i} x={-w / 2 + cw * 0.9 + i * (w - cw * 1.8 - cw) / (cols - 1)} y={-h * 0.8 + 14} width={cw} height={h * 0.8 - 44} fill="#F7F1DD" />)}
      <polygon points={`${-w / 2 - 18},${-h * 0.8} ${w / 2 + 18},${-h * 0.8} 0,${-h * 1.12}`} fill="#D6C9A4" />
    </g>
  );
};

/** Gold-rimmed dark plaque with centred lines; pops in at frame `a`. */
export const GoldPlaque: React.FC<{ t: number; a: number; x: number; y: number; w: number; lines: { text: string; size: number; fill?: string }[]; gap?: number }> = ({ t, a, x, y, w, lines, gap = 14 }) => {
  const u = easeOut((t - a) / 12);
  if (u <= 0.01) return null;
  const h = lines.reduce((s, l) => s + l.size * 1.15 + gap, gap * 2);
  let cy = -h / 2 + gap;
  return (
    <g transform={`translate(${x},${y + (1 - u) * 50})`} opacity={clamp(u * 1.4)}>
      <rect x={-w / 2 + 10} y={-h / 2 + 14} width={w} height={h} rx={26} fill="#000" opacity={0.4} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={26} fill="#1A2233" fillOpacity={0.96} stroke="#E2B95A" strokeWidth={8} />
      <rect x={-w / 2 + 16} y={-h / 2 + 16} width={w - 32} height={h - 32} rx={16} fill="none" stroke="#E2B95A" strokeWidth={2.5} opacity={0.7} />
      {lines.map((l, i) => { cy += l.size * 1.15; const yy = cy - l.size * 0.2; cy += gap; return <text key={i} y={yy} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={l.size} fill={l.fill ?? '#F6F2E4'}>{l.text}</text>; })}
    </g>
  );
};
