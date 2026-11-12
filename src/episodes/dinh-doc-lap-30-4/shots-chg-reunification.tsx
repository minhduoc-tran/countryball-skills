import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine';
import { Camera, cameraAt, CameraKey } from '../../countryball/geo-camera';
import { SAIGON_CAMERAS as C } from '../../countryball/sai-gon-camera-keys';
import { GeoMap } from '../../countryball/map-geo-map';
import { mix } from '../../countryball/map-context';
import { DateChip } from '../../countryball/hud-date-chip';
import { MiniMap } from '../../countryball/hud-minimap';
import { SourceLine } from '../../countryball/hud-chips';
import { Ball } from '../../countryball/countryball';
import { breathe } from '../../countryball/ball-motion';
import { FlagCloth } from '../../countryball/flag-cloth';
import { Cap, CREDIT_NE, CREDIT_OSM, GPhoto, INK, NEUTRAL_LAND, Stage, Tag, VNM_RED, easeOut, prog } from './chg-common';

// Chapter G, part 6 (8:57-9:10, beat "11 reunification"): 02.07.1976. The map of one country turns the normal VNM red (the 1973-75 maps were neutral),
// the Quốc hội names the state, Sài Gòn - Gia Định becomes Thành phố Hồ Chí Minh. Facts: 02.07.1976, tên nước CHXHCN Việt Nam, TP Hồ Chí Minh (science).
// Sound: a ding when the name appears; otherwise quiet.

/** Country map (no OSM): land colour from `red` 0..1 (neutral 1973-75 tone -> normal VNM red), HUD date chip. */
const CountryMap: React.FC<{ t: number; id: string; keys: CameraKey[]; red: number; dates: { t: number; label: string }[]; children?: React.ReactNode }> = ({ t, id, keys, red, dates, children }) => {
  const s = t / 30, cam: Camera = cameraAt(keys, s);
  return (
    <g>
      <GeoMap camera={cam} id={id} colors={{ VNM: mix(NEUTRAL_LAND.VNM, VNM_RED, red) }}>{children}</GeoMap>
      <DateChip dates={dates} t={s} id={`${id}-date`} />
      <MiniMap camera={cam} id={`${id}-mini`} />
      <SourceLine text={CREDIT_NE} t={s} />
    </g>
  );
};
const VN_KEYS: CameraKey[] = [{ t: 0, ...C.vietnam, ease: 'linear' }, { t: 3.6, lon: C.vietnam.lon, lat: C.vietnam.lat, zoom: C.vietnam.zoom * 1.05, ease: 'linear' }];

/** G20 "Một năm sau, ngày hai tháng Bảy năm 1976," the (still neutral) map of the country; the date chip rolls from 30.04.1975 to 02.07.1976. */
export const G20: React.FC<ShotProps> = ({ t }) => (
  <g>
    <CountryMap t={t} id="g20" keys={VN_KEYS} red={0} dates={[{ t: 0, label: '30.04.1975' }, { t: 0.9, label: '02.07.1976' }]} />
    <Tag t={t} at={0} x={960} y={960} text="MỘT NĂM SAU" fill="#2F3E58" size={68} />
  </g>
);

/** G21 "Quốc hội của nước Việt Nam thống nhất" the whole country turns the normal VNM red. */
export const G21: React.FC<ShotProps> = ({ t }) => (
  <g>
    <CountryMap t={t} id="g21" keys={VN_KEYS} red={easeOut(prog(t, 8, 44))} dates={[{ t: 0, label: '02.07.1976' }]} />
    <Tag t={t} at={30} x={960} y={950} text="QUỐC HỘI NƯỚC VIỆT NAM THỐNG NHẤT" fill="#2F3E58" size={50} />
  </g>
);

/** G22 "quyết định lấy tên nước là Cộng hòa Xã hội chủ nghĩa Việt Nam." the state name beside the flag, a calm VNM ball. */
export const G22: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="g22" tone="navy" />
    <line x1={240} y1={200} x2={240} y2={900} stroke={INK} strokeWidth={9} strokeLinecap="round" />
    <FlagCloth id="g22f" x={244} y={210} w={560} h={373} kind="VNM" wave={1} t={t} />
    <Ball id="g22b" x={560} y={800} r={110} flag="VNM" eyes="normal" tilt={2} motion={breathe(t, 96, 0.02)} t={t} />
    <Cap t={t} at={0} x={1260} y={250} text="TÊN NƯỚC" size={64} color="#CFD8E4" />
    <Cap t={t} at={14} x={1260} y={450} text="CỘNG HÒA XÃ HỘI" size={80} />
    <Cap t={t} at={26} x={1260} y={560} text="CHỦ NGHĨA" size={80} />
    <Cap t={t} at={38} x={1260} y={680} text="VIỆT NAM" size={112} color="#FFE08A" />
    <Tag t={t} at={58} x={1260} y={850} text="02.07.1976" fill="#9B4C3A" size={48} />
  </g>
);

/** G23 "Sài Gòn, Gia Định được đổi tên thành Thành phố Hồ Chí Minh." the old name is struck out, the new one lands; today's skyline print. */
export const G23: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, cam = cameraAt([{ t: 0, lon: 106.72, lat: 10.79, zoom: 3000, ease: 'linear' }, { t: 3.3, lon: 106.72, lat: 10.79, zoom: 3900, ease: 'linear' }], s);
  const sw = prog(t, 40, 52), nw = easeOut(prog(t, 50, 64));
  return (
    <g>
      <GeoMap camera={cam} id="g23" rivers>{null}</GeoMap>
      <rect width={1920} height={1080} fill="#050B15" opacity={0.18} />
      <g opacity={1 - 0.6 * sw} transform={`translate(0,${-40 * sw})`}>
        <rect x={470} y={650} width={980} height={110} rx={30} fill="#15202D" opacity={0.85} stroke={INK} strokeWidth={5} />
        <text x={960} y={725} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={66} fill="#F4F4F4">SÀI GÒN - GIA ĐỊNH</text>
        <line x1={500} y1={705} x2={500 + 920 * sw} y2={705} stroke="#E0483C" strokeWidth={10} strokeLinecap="round" />
      </g>
      <g opacity={nw} transform={`translate(960,${830 + (1 - nw) * 40}) scale(${0.9 + 0.1 * nw})`}>
        <rect x={-560} y={-70} width={1120} height={140} rx={36} fill="#9B4C3A" stroke={INK} strokeWidth={6} />
        <text y={26} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={76} fill="#FFE9B0">THÀNH PHỐ HỒ CHÍ MINH</text>
      </g>
      <GPhoto k="skyline" t={t} x={1470} y={250} w={640} rot={2} from={1.9} fromSide="right" kb={{ z0: 1.0, z1: 1.08, px0: 0.02, py0: 0, px1: -0.02, py1: 0 }} />
      <DateChip dates={[{ t: 0, label: '02.07.1976' }]} t={s} id="g23-date" />
      <MiniMap camera={cam} id="g23-mini" />
      <SourceLine text={CREDIT_OSM} t={s} />
    </g>
  );
};
