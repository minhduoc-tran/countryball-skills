import React from 'react';
import { FONT } from '../../engine/fonts';
import { Camera, cameraAt, CameraKey } from '../../countryball/geo-camera';
import { GeoMap } from '../../countryball/map-geo-map';
import { useGeo } from '../../countryball/map-context';
import { CAMPAIGN_ARROWS, DirectionKey } from '../../countryball/sai-gon-campaign-arrows';
import { FrontArrow, SIDE_COLORS } from '../../countryball/ground-front-arrows';
import { SAIGON_SITES } from '../../countryball/geo-sai-gon-sites';
import { SAIGON_ATTRIBUTION, SaigonLabels, SaigonSites } from '../../countryball/sai-gon-map-labels';
import { SAIGON_CAMERAS as CAM } from '../../countryball/sai-gon-camera-keys';
import { DateChip } from '../../countryball/hud-date-chip';
import { MiniMap } from '../../countryball/hud-minimap';
import { SourceLine } from '../../countryball/hud-chips';
import { backOut, clamp, Pt } from '../../countryball/fx-math';
import { pathAtDist, samplePath } from '../../countryball/fx-flight-path';
import { GOLD, LAND, ramp, Txt } from './chc-common';

// Chapter C: the Sài Gòn map of Chiến dịch Hồ Chí Minh. ABSOLUTE voice seconds (`s`) drive everything, so every shot of the beat sees the same
// state (arrows already grown, targets already lit) and the camera path is continuous across cuts. Narration order: Bắc QĐ1 -> Tây Bắc QĐ3 ->
// Đông QĐ4 -> Đông Nam QĐ2 -> Tây Nam Đoàn 232; each arrow starts at the word "hướng", its target lights at the narrated site name.

export const DIRS: DirectionKey[] = ['bac', 'tayBac', 'dong', 'dongNam', 'tayNam'];
export const DIR_NO: Record<DirectionKey, number> = { bac: 1, tayBac: 2, dong: 3, dongNam: 4, tayNam: 5 };
export const DIR_UNIT: Record<DirectionKey, string> = { bac: 'QUÂN ĐOÀN 1', tayBac: 'QUÂN ĐOÀN 3', dong: 'QUÂN ĐOÀN 4', dongNam: 'QUÂN ĐOÀN 2', tayNam: 'ĐOÀN 232' };
/** voice second at which each arrow starts to grow ("hướng") */
export const ARROW_START: Record<DirectionKey, number> = { bac: 208.1, tayBac: 211.32, dong: 214.7, dongNam: 217.74, tayNam: 221.55 };
export const ARROW_FRAMES = 50;

export interface Target { key: string; site: string; name: string; dir: DirectionKey; lit: number; dx: number; dy: number; anchor: 'start' | 'end' }
/** the 6 sites named in the narration (lit = voice second of the site name); pill offsets are tuned so neighbours never overlap */
export const TARGETS: Target[] = [
  { key: 'bttm', site: 'boTongThamMuu', name: 'Bộ Tổng tham mưu', dir: 'bac', lit: 209.89, dx: 40, dy: -50, anchor: 'start' },
  { key: 'tsn', site: 'tanSonNhat', name: 'Sân bay Tân Sơn Nhất', dir: 'tayBac', lit: 213.15, dx: -40, dy: -44, anchor: 'end' },
  { key: 'bqp', site: 'boQuocPhong', name: 'Bộ Quốc phòng', dir: 'dong', lit: 216.42, dx: 44, dy: 56, anchor: 'start' },
  { key: 'dinh', site: 'dinhDocLap', name: 'Dinh Độc Lập', dir: 'dongNam', lit: 220.41, dx: 44, dy: -46, anchor: 'start' },
  { key: 'biet', site: 'bietKhuThuDo', name: 'Biệt khu Thủ đô', dir: 'tayNam', lit: 224.27, dx: -44, dy: 50, anchor: 'end' },
  { key: 'tongnha', site: 'tongNhaCanhSat', name: 'Tổng nha Cảnh sát', dir: 'tayNam', lit: 225.48, dx: -44, dy: -30, anchor: 'end' },
];
export const targetOf = (key: string) => TARGETS.find((x) => x.key === key)!;

/** The wide view of the whole battle area (all five tails in view), slowly drifting. */
// zoom >= ~1700 keeps the whole view (+40 px pad) inside the OSM box (lon 106.2..107.55, lat 10.2..11.25), so the Sài Gòn level is drawn
export const wideCam = (s: number): Camera => ({ lon: 106.84 - 0.0008 * (s - 205), lat: 10.885 - 0.0003 * (s - 205), zoom: 1720 + 3 * (s - 205) });
/** arrow routes: the first point of Bắc and Tây Nam (far off the 1720-zoom frame) is dropped so every tail sits inside the screen */
const ROUTE = (k: DirectionKey): Pt[] => (k === 'bac' || k === 'tayNam' ? CAMPAIGN_ARROWS[k].points.slice(1) : CAMPAIGN_ARROWS[k].points);
const siteLL = (key: string): Pt => { const d = SAIGON_SITES[targetOf(key).site]; return [d.lon, d.lat]; };
/** wide on the arrow, then a push-in centred on `focus` between seconds p0..p1, then a slow drift until `end`. */
export function pushCam(s: number, start: number, p0: number, p1: number, end: number, lon: number, lat: number, zoom: number): Camera {
  const keys: CameraKey[] = [{ t: start, ...wideCam(start) }, { t: p0, ...wideCam(p0), ease: 'linear' }, { t: p1, lon, lat, zoom, ease: 'inout' }, { t: end, lon: lon + 0.0004, lat: lat - 0.0003, zoom: zoom * 1.04, ease: 'linear' }];
  return cameraAt(keys, s);
}
export const focusOn = (key: string): Pt => siteLL(key);


/** the five arrows (FrontArrow, 40 px wide at every zoom), growing from the narrated second; label = unit tag inside the arrow */
const Arrows: React.FC<{ s: number; opacity: number }> = ({ s, opacity }) => {
  const { project } = useGeo();
  return <g>{DIRS.map((k) => <FrontArrow key={k} id={`camp-${k}`} t={s * 30} t0={ARROW_START[k] * 30} dur={ARROW_FRAMES} points={ROUTE(k).map(([lo, la]) => project(lo, la) as Pt)}
    width={40} color={SIDE_COLORS.vnm} label={CAMPAIGN_ARROWS[k].label} labelSize={24} opacity={opacity} />)}</g>;
};

/** numbered start pins at the tail of every arrow (pop in order) */
const Pins: React.FC<{ s: number; at: number; step: number }> = ({ s, at, step }) => {
  const { project } = useGeo();
  return <g>{DIRS.map((k, i) => {
    const [x, y] = project(...(ROUTE(k)[0] as [number, number])), u = backOut(ramp(s, at + i * step, at + i * step + 0.3));
    if (u <= 0.01) return null;
    return <g key={k} transform={`translate(${x},${y}) scale(${u})`}>
      <circle r={25} fill="#15181F" stroke={GOLD} strokeWidth={5} /><text y={13} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#F4F4F4">{DIR_NO[k]}</text>
    </g>;
  })}</g>;
};

/** white chevrons marching along each arrow toward the city ("đánh thật nhanh") */
const FlowChevrons: React.FC<{ s: number; o: number }> = ({ s, o }) => {
  const { project } = useGeo();
  return <g opacity={o}>{DIRS.map((k) => {
    const sp = samplePath(ROUTE(k).map(([lo, la]) => project(lo, la) as Pt), 10), gap = 110;
    return <g key={k}>{Array.from({ length: Math.ceil(sp.total / gap) }, (_, i) => {
      const d = ((i * gap + s * 520) % sp.total), p = pathAtDist(sp, d);
      return <polygon key={i} points="-14,-16 12,0 -14,16 -6,0" fill="#FFF" stroke="#15151A" strokeWidth={3} opacity={0.9 * Math.min(1, d / 120, (sp.total - d) / 80)} transform={`translate(${p.x},${p.y}) rotate(${p.heading})`} />;
    })}</g>;
  })}</g>;
};

/** gold ring + dot for every target already named; a name pill when the zoom is high enough to separate them (`pills`) */
export const TargetMarks: React.FC<{ s: number; only?: string[]; pillFrom?: number; badges?: boolean; litAt?: Record<string, number>; allPills?: boolean }> = ({ s, only, pillFrom = 3000, badges = true, litAt, allPills = false }) => {
  const { project, camera } = useGeo();
  const pillO = ramp(camera.zoom, pillFrom * 0.85, pillFrom * 1.15);
  return <g>{TARGETS.filter((x) => !only || only.includes(x.key)).map((tg) => {
    const x = litAt && litAt[tg.key] !== undefined ? { ...tg, lit: litAt[tg.key] } : tg;
    if (s < x.lit) return null;
    const [px, py] = project(...siteLL(x.key)), u = backOut(ramp(s, x.lit, x.lit + 0.35)), ring = Math.min(1, (s - x.lit) / 1.4);
    const age = s - x.lit, show = allPills ? 1 : clamp((3.0 - age) / 0.5), w = 56 + x.name.length * 17.5 + (badges ? 46 : 0), ox = px + x.dx, oy = py + x.dy, left = x.anchor === 'end' ? ox - w : ox;
    return <g key={x.key}>
      <circle cx={px} cy={py} r={20 + ring * 54 * u} fill="none" stroke={GOLD} strokeWidth={5} opacity={(1 - ring) * 0.9 * u} />
      <circle cx={px} cy={py} r={(9 + 9 * pillO) * u} fill={GOLD} stroke="#15151A" strokeWidth={4} />
      {pillO > 0.5 && <text x={px} y={py + 8} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={22} fill="#15151A" opacity={pillO}>{DIR_NO[x.dir]}</text>}
      {pillO > 0.02 && show > 0.02 && <g opacity={pillO * clamp(u) * show} transform={`translate(${left},${oy - 30}) scale(${0.85 + 0.15 * u})`}>
        <line x1={x.anchor === 'end' ? w : 0} y1={30} x2={px - left} y2={py - oy + 30} stroke={GOLD} strokeWidth={3} />
        <rect width={w} height={60} rx={14} fill="#15181F" fillOpacity={0.94} stroke={GOLD} strokeWidth={4} />
        {badges && <g transform="translate(32,30)"><circle r={19} fill={GOLD} /><text y={11} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={28} fill="#15151A">{DIR_NO[x.dir]}</text></g>}
        <text x={badges ? 64 : 24} y={41} fontFamily={FONT.title} fontWeight={800} fontSize={31} fill="#F4F4F4">{x.name}</text>
      </g>}
    </g>;
  })}</g>;
};

/** top-right banner: "1  HƯỚNG BẮC · QUÂN ĐOÀN 1" + gold target line(s) that appear when named */
export const DirBanner: React.FC<{ dir: DirectionKey; s: number; lines?: { text: string; at: number }[] }> = ({ dir, s, lines = [] }) => {
  const a = CAMPAIGN_ARROWS[dir], on = lines.filter((l) => s >= l.at), h = 84 + on.length * 54, k = backOut(ramp(s, ARROW_START[dir] - 0.1, ARROW_START[dir] + 0.3));
  return <g transform={`translate(1000,36) scale(1)`} opacity={clamp(k)}>
    <rect width={880} height={h} rx={18} fill="#15181F" fillOpacity={0.93} stroke={GOLD} strokeWidth={5} />
    <circle cx={46} cy={44} r={26} fill={GOLD} /><text x={46} y={57} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={38} fill="#15151A">{DIR_NO[dir]}</text>
    <text x={90} y={58} fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#F4F4F4">{a.name.toUpperCase()} · {DIR_UNIT[dir]}</text>
    {on.map((l, i) => <text key={i} x={90} y={112 + i * 54} fontFamily={FONT.title} fontWeight={800} fontSize={38} fill={GOLD} opacity={ramp(s, l.at, l.at + 0.25)}>{l.text}</text>)}
  </g>;
};

export const CampaignMap: React.FC<{
  id: string; cam: Camera; s: number; arrows?: boolean; arrowOpacity?: number; pins?: { at: number; step: number }; flow?: number;
  targets?: string[] | false; allPills?: boolean; litAt?: Record<string, number>; sites?: string[]; date?: string; children?: React.ReactNode; hud?: boolean;
}> = ({ id, cam, s, arrows = true, arrowOpacity = 0.92, pins, flow = 0, targets = [], allPills, litAt, sites = ['cuChi', 'benLuc', 'longThanh', 'bienHoa'], date = '26.04.1975', children, hud = true }) => (
  <g>
    <GeoMap camera={cam} id={id} colors={LAND}>
      <SaigonLabels roads={false} />
      <SaigonSites only={sites} />
      {pins && <Pins s={s} at={pins.at} step={pins.step} />}
      {arrows && <Arrows s={s} opacity={arrowOpacity} />}
      {flow > 0 && <FlowChevrons s={s} o={flow} />}
      {targets !== false && <TargetMarks s={s} only={targets.length ? targets : undefined} litAt={litAt} allPills={allPills} />}
      {children}
    </GeoMap>
    {hud && <><DateChip label={date} t={s} id={`${id}-d`} /><MiniMap camera={cam} id={`${id}-mini`} /><SourceLine text={`${SAIGON_ATTRIBUTION}; Natural Earth (public domain)`} t={s} /></>}
  </g>
);
export { CAM, Txt };
