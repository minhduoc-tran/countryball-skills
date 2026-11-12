import React from 'react';
import { FONT } from '../../engine/fonts';
import { Camera } from '../../countryball/geo-camera';
import { GeoMap } from '../../countryball/map-geo-map';
import { CitadelPlan, PlanLabel } from '../../countryball/citadel-plan';
import { DateChip } from '../../countryball/hud-date-chip';
import { MiniMap } from '../../countryball/hud-minimap';
import { SourceLine } from '../../countryball/hud-chips';
import { OSM_ATTRIBUTION } from '../../countryball/quang-tri-map-labels';
import { clamp } from '../../countryball/fx-math';

// Chapter D (the firepower, 5:01-6:40) shared helpers. Re-exports the finished DBP episode's text/pop/backdrop helpers
// (same look as the Điện Biên Phủ documentary) and adds: pill chips (source labels, time-of-day), credit lines, a
// Quảng Trị map wrapper (neutral 1972 land colour) and a CitadelPlan wrapper that always carries the OSM credit.
export { sec, ramp, Txt, Pop, Backdrop, Dim, Badge, Cell, cellSlots, drift } from '../dien-bien-phu-tren-khong/chb-common';

export const LAND = '#B9A88A';                       // 1972 maps: neutral warm land (lead's rule), never all-red Vietnam
export const CREDIT = {
  usaf: 'Ảnh: USAF / Public domain',
  usmc: 'Ảnh: U.S. Marine Corps History Division / Public domain',
};
export const SRC_VN = 'Theo phía Việt Nam';
export const SRC_US = 'Theo tài liệu phía Mỹ';

/** Damage of the citadel through the chapter: 0.3 at the start of D, 0.7 at the end of D. */
export const dmgAt = (s: number, a = 0.3, b = 0.7, dur = 100) => a + (b - a) * clamp(s / dur);

/** Rounded label pill (source labels, "BAN NGÀY"...). Anchor 'middle' by default; width estimated from the text. */
export const Chip: React.FC<{
  x: number; y: number; text: string; size?: number; fill?: string; color?: string; stroke?: string; o?: number; anchor?: 'start' | 'middle'; icon?: React.ReactNode;
}> = ({ x, y, text, size = 40, fill = '#15181F', color = '#F4F4F4', stroke = '#E2B95A', o = 1, anchor = 'middle', icon }) => {
  const w = text.length * size * 0.6 + size * 1.4 + (icon ? size * 1.1 : 0), h = size * 1.6, x0 = anchor === 'middle' ? x - w / 2 : x;
  return (
    <g opacity={o}>
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={fill} fillOpacity={0.9} stroke={stroke} strokeWidth={3.5} />
      {icon && <g transform={`translate(${x0 + size * 1.05},${y})`}>{icon}</g>}
      <text x={x0 + (icon ? size * 1.7 : size * 0.65)} y={y + size * 0.36} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color}>{text}</text>
    </g>
  );
};

/** Whole-screen Quảng Trị map: neutral land, provinces + rivers; children draw on top (screen px). */
export const QtMap: React.FC<{ id: string; camera: Camera; night?: number; children?: React.ReactNode }> = ({ id, camera, night = 0, children }) => (
  <GeoMap camera={camera} id={id} colors={{ VNM: LAND }} provinces rivers night={night}>{children}</GeoMap>
);

/** Standard HUD for map scenes: date chip (top-left), minimap (bottom-right), OSM credit (bottom-left). s = shot seconds. */
export const MapHud: React.FC<{ s: number; cam: Camera; dates?: { t: number; label: string }[]; mini?: boolean }> = ({ s, cam, dates, mini = true }) => (
  <>
    {dates && <DateChip dates={dates} t={s} id="hud-date" />}
    {mini && <MiniMap camera={cam} />}
    <SourceLine text={`${OSM_ATTRIBUTION}; Natural Earth (public domain)`} t={s} />
  </>
);

/** CitadelPlan wrapper (standalone) + OSM credit line. t = frames. */
export const Plan: React.FC<{
  id: string; cam: Camera; t: number; damage: number; night?: number; fires?: number; flood?: number; craters?: number; labels?: boolean | PlanLabel[]; credit?: boolean;
}> = ({ id, cam, t, damage, night = 0, fires = 0, flood = 0, craters = 1, labels = false, credit = true }) => (
  <g>
    <CitadelPlan id={id} camera={cam} t={t} damage={damage} night={night} fires={fires} flood={flood} craters={craters} labels={labels} />
    {credit && <SourceLine text={OSM_ATTRIBUTION} t={t / 30} />}
  </g>
);

/** Soft vignette for dramatic / quiet shots. */
export const Vignette: React.FC<{ o?: number; id: string }> = ({ o = 0.55, id }) => (
  <g pointerEvents="none">
    <defs><radialGradient id={`${id}-vg`} cx="0.5" cy="0.5" r="0.75"><stop offset="0.5" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={o} /></radialGradient></defs>
    <rect width={1920} height={1080} fill={`url(#${id}-vg)`} />
  </g>
);
