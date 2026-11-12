import React from 'react';
import { ShotProps } from '../../engine';
import { Camera, project } from '../../countryball/geo-camera';
import { CarrierDeck } from '../../countryball/carrier-deck';
import { HeliSide } from '../../countryball/ground-helicopters';
import { WaterSplash } from '../../countryball/ground-water-splash';
import { Warship } from '../../countryball/ground-naval-gunfire';
import { City } from '../../countryball/map-labels';
import { lerp } from '../../countryball/fx-math';
import { Cap, MapScene, NameCard, PhotoE, Plate, SeaBackdrop, Stage, Tag, USA_BLUE, drift, easeOut, prog } from './che-common';
import { O1Side, PaperNote } from './che-props';
import { Person } from './chd-icons';

// Chapter E, part 1 (5:13-6:12, beat "7c2 ly bung"): E1 a story few people know, E2 Thiếu tá Lý Bửng + family, E3 out to sea to the fleet, E4 the note dropped on
// the deck of USS Midway, E5 helicopters pushed overboard, E6 print of the landed O-1. The landing date is NOT narrated: none shown. Faceless silhouettes only.
// Frame offsets = (word start - shot start) * 30 from words-e.txt.

const SEA: Camera = { lon: 107.0, lat: 10.25, zoom: 1100 }, SEA2: Camera = { ...SEA, zoom: 1180 };

/** E1 313.47 "Có một câu chuyện ít người biết. Một phi công Việt Nam," title line, a tiny plane over the dawn sea. */
export const E1: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 40, 100));
  return (
    <g>
      <SeaBackdrop id="e1" tone="dawn" y={650} t={t} />
      <Cap t={t} at={0} x={960} y={210} text="MỘT CÂU CHUYỆN" size={96} />
      <Cap t={t} at={8} x={960} y={320} text="ÍT NGƯỜI BIẾT" size={96} color="#FFE08A" />
      <O1Side x={lerp(-200, 1500, k)} y={560 + Math.sin(t / 9) * 6 - k * 40} size={260} t={t} rot={-2} />
      <Tag t={t} at={48} x={960} y={850} text="MỘT PHI CÔNG VIỆT NAM" fill="#2F3E58" size={50} />
    </g>
  );
};

/** E2 316.80 "thiếu tá Lý Bửng, chở vợ và năm người con trên một chiếc máy bay trinh sát nhỏ," name card (no photo: plain card), family silhouettes, the O-1. */
export const E2: React.FC<ShotProps> = ({ t }) => (
  <g>
    <SeaBackdrop id="e2" tone="dawn" y={690} t={t} />
    <NameCard t={t} at={0} x={560} y={230} name="LÝ BỬNG" sub="Thiếu tá, phi công Việt Nam" w={800} accent="#E8B422" />
    <g opacity={easeOut(prog(t, 20, 34))}>
      {[0, 1, 2, 3, 4, 5].map((i) => <Person key={i} x={1180 + i * 92} y={330} s={i === 0 ? 2.1 : 1.45 - i * 0.07} color="#1B2740" lean={Math.sin(t / 14 + i) * 2} />)}
    </g>
    <Tag t={t} at={20} x={1400} y={420} text="VỢ VÀ 5 NGƯỜI CON" fill="#8E4A3A" size={44} />
    <O1Side x={960 + Math.sin(t / 22) * 20} y={650 + Math.sin(t / 10) * 8} size={620} t={t} heads={6} rot={-1.5} />
    <Plate t={t} at={77} x={960} y={900} text="MÁY BAY TRINH SÁT NHỎ" size={54} />
  </g>
);

/** E3 320.94 "bay ra biển tìm hạm đội Mỹ." the O-1 crosses the sea to the American fleet (region map, dashed route). */
export const E3: React.FC<ShotProps> = ({ t }) => (
  <MapScene t={t} id="e3" keys={drift(SEA, SEA2, 1.8)} osm={false} night={0}
    map={<City lon={107.0753} lat={10.3482} name="Vũng Tàu" anchor="r" minZoom={0} maxZoom={2000} size={24} />}
    over={(cam) => {
      const a = project(cam, 106.85, 10.42), b = project(cam, 107.28, 9.92), k = easeOut(prog(t, 0, 50));
      const fleet = project(cam, 107.3, 9.9);
      return (
        <g>
          <line x1={a[0]} y1={a[1]} x2={lerp(a[0], b[0], k)} y2={lerp(a[1], b[1], k)} stroke="#FFFFFF" strokeWidth={5} strokeDasharray="16 14" opacity={0.85} />
          {[[-90, 20], [30, -30], [110, 50]].map(([dx, dy], i) => <Warship key={i} x={fleet[0] + dx} y={fleet[1] + dy} heading={200 + i * 8} size={120} kind={i === 1 ? 'cruiser' : 'destroyer'} t={t} aim={0} wake={false} />)}
          <circle cx={fleet[0]} cy={fleet[1]} r={140} fill="none" stroke={USA_BLUE} strokeWidth={5} strokeDasharray="14 12" opacity={0.85} />
          <O1Side x={lerp(a[0], b[0], k)} y={lerp(a[1], b[1], k) - 10} size={120} t={t} rot={24} />
          <Tag t={t} at={14} x={fleet[0] - 40} y={fleet[1] - 220} text="HẠM ĐỘI MỸ" fill="#2F5E9A" size={46} />
        </g>
      );
    }} />
);

/** E4 322.69 "Ông thả một mẩu giấy xuống boong tàu sân bay Midway, xin được hạ cánh." the O-1 passes over the deck, a note falls. */
export const E4: React.FC<ShotProps> = ({ t }) => {
  const k = prog(t, 0, 96), px = lerp(-250, 1500, k), py = 250 + Math.sin(t / 12) * 8;
  const nk = prog(t, 14, 66), nx = lerp(lerp(-250, 1500, prog(14, 0, 96)), 1010, nk) + Math.sin(nk * 9) * 24, ny = lerp(250 + 10, 520, nk * nk);
  return (
    <g>
      <CarrierDeck id="e4" land={0} push={0} t={t} tone="dusk" />
      <O1Side x={px} y={py} size={260} t={t} rot={-3} />
      {nk > 0 && nk < 1 && <PaperNote x={nx} y={ny} s={1.5} rot={nk * 340} />}
      <Tag t={t} at={20} x={1280} y={150} text="TÀU SÂN BAY MIDWAY" fill="#2F5E9A" size={50} />
      <Plate t={t} at={80} x={960} y={930} text="XIN ĐƯỢC HẠ CÁNH" size={64} color="#FFE08A" />
    </g>
  );
};

/** E5 326.62 "Thủy thủ trên tàu đẩy nhiều chiếc trực thăng xuống biển để dọn đường băng," two helicopters go over the side (calm, no crew close-ups). */
export const E5: React.FC<ShotProps> = ({ t }) => {
  const sea = 750, slide = easeOut(prog(t, 44, 92)), fall = prog(t, 92, 112);
  const sx = lerp(870, 1690, slide) + fall * 40, sy = 527 + fall * fall * (sea - 527 + 30);
  return (
    <g>
      <CarrierDeck id="e5" land={1} push={prog(t, 4, 60)} t={t} tone="dusk" />
      {fall < 1 && <g transform={`rotate(${-70 * fall} ${sx} ${sy})`}><HeliSide x={sx} y={sy} size={300} kind="uh1" t={0} /></g>}
      {fall >= 1 && <WaterSplash t={t} t0={112} x={sx} y={sea + 10} r={46} />}
      <Cap t={t} at={6} x={960} y={140} text="ĐẨY TRỰC THĂNG XUỐNG BIỂN" size={68} />
      <Plate t={t} at={62} x={960} y={950} text="ĐỂ DỌN ĐƯỜNG BĂNG" size={58} color="#FFE08A" />
    </g>
  );
};

/** E6 330.49 "và chiếc máy bay nhỏ đã hạ cánh an toàn." the print of the O-1 on the deck. */
export const E6: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="e6" tone="navy" />
    <PhotoE k="midway" id="e6p" t={t} x={960} y={470} w={920} rot={-1.5} from={0.05} fromSide="bottom" kb={{ z0: 1.0, z1: 1.12, px0: 0.01, py0: 0.01, px1: -0.015, py1: -0.01 }} />
    <Tag t={t} at={30} x={960} y={992} text="HẠ CÁNH AN TOÀN" fill="#2F7A4E" size={48} />
  </g>
);
