import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe } from '../../countryball/ball-motion';
import { cameraAt } from '../../countryball/geo-camera';
import { CAMERAS } from '../../countryball/quang-tri-camera-keys';
import { GeoMap } from '../../countryball/map-geo-map';
import { DmzBand, OSM_ATTRIBUTION, QuangTriLabels, QuangTriSites } from '../../countryball/quang-tri-map-labels';
import { DateChip } from '../../countryball/hud-date-chip';
import { SourceLine } from '../../countryball/hud-chips';
import { PhotoCard } from '../../countryball/photo-card';
import { Candle, IncenseBundle } from '../../countryball/ground-memorial-props';
import { Glow } from '../../countryball/fx-glow';
import { SmokeColumn } from '../../countryball/ground-weather-and-smoke';
import { cameraOnCitadel, citadelScreen } from '../../countryball/citadel-geometry';
import { easeOut } from '../../countryball/fx-math';
import { Cap, driftKeys, PlanScene, Tag, cameraOnLocal } from './chc-common';
import { CandleRow, GOLD, Head, IMG, proj, Quiet, ramp, sec, Txt, Vignette } from './chg-common';
import { star } from './chb-table-and-icons';
import { HomeIcon, RuinBuilding, TeamIcon } from './chg-ruin-icons';

// Chapter G, beats "27b search" + "28 ruins" (G8-G15, 542.2-562.4 s): the search for remains goes on today (quiet: a small
// team icon, incense, a lit candle), then the town wiped out, three buildings crumbling, the citadel's few walls, the gate photo.

// ---------- G8: "Hơn năm mươi năm sau, việc tìm kiếm hài cốt liệt sĩ" ----------
export const G8: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), k = easeOut(ramp(s, 0.5, 2.5));
  return (
    <g>
      <Quiet id="g8" s={s} />
      <Head s={s} at={0.05} y={300} text="HƠN 50 NĂM SAU" size={130} />
      <Txt x={960} y={410} text="vẫn tìm kiếm hài cốt liệt sĩ" size={62} color={GOLD} o={ramp(s, 0.6, 1.0)} stroke="none" />
      <line x1={300} y1={760} x2={1620} y2={760} stroke="#5B6675" strokeWidth={10} strokeLinecap="round" />
      <line x1={300} y1={760} x2={300 + 1320 * k} y2={760} stroke={GOLD} strokeWidth={10} strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={300 + i * 264} y1={740} x2={300 + i * 264} y2={780} stroke="#8EA3BA" strokeWidth={4} />)}
      <Txt x={300} y={850} text="1972" size={54} stroke="none" />
      <Txt x={1620} y={850} text="NGÀY NAY" size={54} stroke="none" color={GOLD} o={ramp(s, 1.6, 2.1)} />
      <circle cx={300 + 1320 * k} cy={760} r={20} fill={GOLD} stroke="#111" strokeWidth={4} />
      <Candle x={1700} y={770} s={110} t={t} seed={3} lit={k > 0.95} />
      <Vignette id="g8" o={0.5} />
    </g>
  );
};

// ---------- G9: "ở Quảng Trị vẫn chưa dừng lại": today's map, a small team and a search ripple ----------
export const G9: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, ...CAMERAS.quangTriProvince, lat: CAMERAS.quangTriProvince.lat + 0.06 }, { t: 2, ...CAMERAS.quangTriProvince, lon: 107.15, lat: 16.78, zoom: 1900, ease: 'inout' }], s);
  const [x, y] = proj(cam)(107.185, 16.754), r = (s * 0.9) % 1;
  return (
    <g>
      <GeoMap camera={cam} id="g9m" provinces rivers>
        <QuangTriLabels />
      </GeoMap>
      <rect width={1920} height={1080} fill="#050B15" opacity={0.25} />
      {[0, 0.5].map((o) => { const q = (r + o) % 1; return <circle key={o} cx={x} cy={y} r={30 + q * 170} fill="none" stroke="#FFD27A" strokeWidth={5} opacity={(1 - q) * 0.8} />; })}
      <Glow x={x} y={y} r={90} color="#FFB347" o={0.5} />
      <TeamIcon x={x} y={y + 46} s={0.8} t={t} />
      <Tag t={t} at={14} x={x} y={y - 120} text="QUẢNG TRỊ" fill="#1B1B1B" size={44} />
      <DateChip label="NGÀY NAY" t={s} id="g9-date" />
      <SourceLine text={`${OSM_ATTRIBUTION}; Natural Earth (public domain)`} t={s} />
    </g>
  );
};

// ---------- G10: "Mỗi năm, vẫn có những người lính được tìm thấy," candles light one by one, incense ----------
export const G10: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Quiet id="g10" s={s} cy={720} glow={0.9} />
      <Head s={s} at={0.05} y={190} text="MỖI NĂM, VẪN CÓ" size={96} />
      <Head s={s} at={0.5} y={300} text="NGƯỜI LÍNH ĐƯỢC TÌM THẤY" size={76} color={GOLD} />
      <CandleRow t={t} xs={[250, 470, 690, 1230, 1450, 1670]} y={880} at0={20} gap={11} s={130} seed={4} />
      <IncenseBundle x={960} y={900} s={190} t={t} n={5} />
      <TeamIcon x={960} y={640} s={0.9} t={t} />
      <Vignette id="g10" o={0.55} />
    </g>
  );
};

// ---------- G11: "được đưa về với gia đình, sau từng ấy năm chờ đợi." a star travels home to the lit house ----------
export const G11: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), u = easeOut(ramp(s, 0.3, 2.0)), x = 250 + 680 * u, y = 800 - 30 * Math.sin(u * Math.PI);
  return (
    <g>
      <Quiet id="g11" s={s} cx={1400} cy={760} glow={1} />
      <path d="M150,830 Q700,880 1180,830" fill="none" stroke="#5B6675" strokeWidth={10} strokeDasharray="4 22" strokeLinecap="round" />
      <HomeIcon x={1400} y={840} s={1.35} glow={ramp(s, 1.6, 2.0)} />
      <Glow x={1400} y={720} r={360} color="#FFB347" o={0.35 * ramp(s, 1.6, 2.3)} />
      <Glow x={x} y={y - 44} r={110} color="#FF8A6B" o={0.6} />
      <polygon points={star(x, y - 44, 46)} fill="#E0483C" stroke="#111" strokeWidth={5} strokeLinejoin="round" />
      <Ball id="g11v" x={1140} y={768} r={70} flag="VNM" eyes="sad" tear t={t} motion={breathe(t, 80, 0.03)} />
      <Candle x={1050} y={840} s={90} t={t} seed={5} />
      <Head s={s} at={0.1} y={200} text="VỀ VỚI GIA ĐÌNH" size={104} />
      <Txt x={960} y={310} text="sau từng ấy năm chờ đợi" size={62} color={GOLD} o={ramp(s, 1.2, 1.7)} stroke="none" />
      <Vignette id="g11" o={0.5} />
    </g>
  );
};

const Smokes: React.FC<{ t: number }> = ({ t }) => (
  <g opacity={0.55}>{[[460, 720, 240], [1000, 660, 280], [1560, 740, 250]].map(([x, y, h], i) => <SmokeColumn key={i} t={t} t0={-40 * i} x={x} y={y} h={h} w={46} color="#5A5A62" fire={i % 2 === 0} />)}</g>
);

// ---------- G12: "Thị xã Quảng Trị gần như bị xóa sổ." the town as a field of craters and rubble ----------
export const G12: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="g12" keys={driftKeys(cameraOnLocal(120, 330, 0.5), cameraOnLocal(60, 280, 0.58), 2.4)} date="9.1972" damage={1} night={0.35} fires={0.5} mini={false}
    over={() => <><Smokes t={t} /><Vignette id="g12" o={0.5} /><Cap t={t} x={960} y={190} text="GẦN NHƯ BỊ XÓA SỔ" size={100} at={6} color="#FFE3B0" /></>} />
);

// ---------- G13: "Nhà cửa, trường học, nhà thờ đều thành đống đổ nát." ----------
export const G13: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), items = [{ k: 'house' as const, x: 380, label: 'NHÀ CỬA', at: 0.2, sc: 1.8 }, { k: 'school' as const, x: 960, label: 'TRƯỜNG HỌC', at: 1.0, sc: 1.3 }, { k: 'church' as const, x: 1560, label: 'NHÀ THỜ', at: 1.8, sc: 1.3 }];
  return (
    <g>
      <Quiet id="g13" s={s} cy={760} glow={0.4} />
      {items.map((it, i) => (
        <g key={it.k}>
          <RuinBuilding id={`g13${it.k}`} kind={it.k} x={it.x} y={800} s={it.sc} d={easeOut(ramp(s, it.at + 0.5, it.at + 1.6))} seed={i + 2} />
          <Txt x={it.x} y={940} text={it.label} size={60} o={ramp(s, it.at, it.at + 0.3)} />
        </g>
      ))}
      <Head s={s} at={0.05} y={190} text="ĐỀU THÀNH ĐỐNG ĐỔ NÁT" size={88} color="#F2D8B0" />
      <Vignette id="g13" o={0.5} />
    </g>
  );
};

// ---------- G14: "Tòa thành cổ chỉ còn lại vài đoạn tường," ----------
export const G14: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="g14" keys={driftKeys(cameraOnCitadel(0, 0, 0.85), cameraOnCitadel(60, 0, 1.0), 2.2)} date="9.1972" damage={1} night={0.15} fires={0.15} mini={false}
    over={(cam) => {
      const [x, y] = citadelScreen(cam, 240, 0);
      return <><Vignette id="g14" o={0.4} /><Cap t={t} x={1010} y={190} text="CHỈ CÒN VÀI ĐOẠN TƯỜNG" size={80} at={6} color="#FFE3B0" /><Tag t={t} at={24} x={x + 210} y={y + 20} text="CỔNG ĐÔNG" fill="#7A5B2E" size={40} /></>;
    }} />
);

// ---------- G15: "và một cổng thành lỗ chỗ vết đạn." the gate photo ----------
export const G15: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="g15" keys={driftKeys(cameraOnCitadel(60, 0, 1.0), cameraOnCitadel(120, 0, 1.05), 2.2)} date="2012" damage={1} night={0.15} mini={false}
    under={() => <rect width={1920} height={1080} fill="#0A121C" opacity={0.6} />}
    over={() => <PhotoCard id="g15p" src={`${IMG}2012.jpg`} caption="Cổng Thành cổ Quảng Trị, 2012 (đã trùng tu)" credit="Ảnh: Cdvchelsea / CC BY-SA 3.0" x={960} y={520} w={900} h={675} rot={-1.5} from={0.05} t={t / 30}
      kb={{ z0: 1.0, z1: 1.14, px0: 0.01, py0: 0.01, px1: -0.01, py1: -0.015 }} fromSide="bottom" />} />
);
