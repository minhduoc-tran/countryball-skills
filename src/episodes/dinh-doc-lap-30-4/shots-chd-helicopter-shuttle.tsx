import React from 'react';
import { FONT, ShotProps } from '../../engine';
import { Camera, project } from '../../countryball/geo-camera';
import { Ball } from '../../countryball/countryball';
import { breathe } from '../../countryball/ball-motion';
import { NavyCap } from '../../countryball/ball-accessories-military';
import { City, CITIES } from '../../countryball/map-labels';
import { HeliFlight, HeliSide } from '../../countryball/ground-helicopters';
import { Warship } from '../../countryball/ground-naval-gunfire';
import { RooftopEvacuation } from '../../countryball/rooftop-evacuation';
import { lerp, Pt } from '../../countryball/fx-math';
import { Cap, INK, MapScene, Photo, Stage, Tag, USA_BLUE, drift, easeOut, prog, vn } from './chd-common';
import { Crowd } from './chd-icons';

// Chapter D, part 4 (4:42-5:02, beat "7b helicopters"): D17 Marines on the Hancock (print), D18 helicopters shuttle between Sài Gòn and the fleet
// (map, evening -> night), D19 rooftops + embassy compound, D20 crowds waiting (faceless), D21-D23 the numbers "Theo tài liệu phía Mỹ".
// Numbers are exactly those of the narration: 1.373 and 5.595 (US sources).

const SEA: Camera = { lon: 106.95, lat: 10.35, zoom: 900 }, SEA2: Camera = { ...SEA, zoom: 975 };

/** D17 "Suốt chiều và đêm hôm ấy," Marines on the deck of USS Hancock, about to fly into Sài Gòn. */
export const D17: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="d17" tone="dusk" dim={0.2} />
    <Photo k="hancockMarines" t={t} id="d17p" x={960} y={470} w={960} rot={-1.5} from={0.05} fromSide="right" kb={{ z0: 1.0, z1: 1.14, px0: 0.01, py0: 0.01, px1: -0.02, py1: -0.01 }} />
    <Tag t={t} at={14} x={960} y={950} text="SUỐT CHIỀU VÀ ĐÊM HÔM ẤY" fill="#2F3E58" size={44} />
  </g>
);

/** D18 "từng đoàn trực thăng bay qua lại giữa Sài Gòn và hạm đội Mỹ ngoài khơi." flights both ways on the region map, evening turns to night. */
export const D18: React.FC<ShotProps> = ({ t }) => (
  <MapScene t={t} id="d18" keys={drift(SEA, SEA2, 4.4)} osm={false} night={0.1 + 0.55 * prog(t, 0, 130)} date="29.04.1975"
    map={<><City {...CITIES.saigon} maxZoom={2000} /><City lon={107.0753} lat={10.3482} name="Vũng Tàu" anchor="r" minZoom={0} maxZoom={2000} size={24} /></>}
    over={(cam) => {
      const city = project(cam, 106.69, 10.78), fleet = project(cam, 107.2, 9.97);
      const mid = (a: Pt, b: Pt, o: number): Pt => [lerp(a[0], b[0], 0.5) + o, lerp(a[1], b[1], 0.5)];
      const flights = [0, 1, 2, 3, 4, 5, 6].map((i) => ({ i, out: i % 2 === 0, t0: 4 + i * 13 }));
      return (
        <g>
          {[[-90, 20], [30, -30], [110, 50]].map(([dx, dy], i) => <Warship key={i} x={fleet[0] + dx} y={fleet[1] + dy} heading={200 + i * 8} size={130} kind={i === 1 ? 'cruiser' : 'destroyer'} t={t} aim={0} wake={false} />)}
          <circle cx={fleet[0]} cy={fleet[1]} r={150} fill="none" stroke={USA_BLUE} strokeWidth={5} strokeDasharray="14 12" opacity={0.8} />
          {flights.map(({ i, out, t0 }) => {
            const a = out ? city : fleet, b = out ? fleet : city, o = out ? -40 : 40;
            return t <= t0 + 78 ? <HeliFlight key={i} id={`d18h${i}`} t={t} t0={t0} t1={t0 + 72} points={[a, mid(a, b, o), b]} kind={i % 3 === 1 ? 'ch53' : 'uh1'} size={74} /> : null;
          })}
          <Tag t={t} at={20} x={fleet[0] - 60} y={fleet[1] - 230} text="HẠM ĐỘI MỸ NGOÀI KHƠI" fill="#2F5E9A" size={36} />
        </g>
      );
    }} />
);

/** D19 "Trên các sân thượng, trong khuôn viên tòa đại sứ," first a print of Sài Gòn roofs seen from a rooftop (2016), then the rooftop pad. */
export const D19: React.FC<ShotProps> = ({ t }) => {
  const tt = t - 34;
  return (
    <g>
      <Stage id="d19" tone="dusk" />
      {tt >= 0 && <g opacity={easeOut(tt / 6)}><RooftopEvacuation id="d19r" land={prog(tt, 0, 28)} queue={prog(tt, 24, 42)} t={t} tone="dusk" /></g>}
      <Photo k="roofNow" t={t} id="d19p" x={960} y={480} w={900} rot={-1.5} from={0.05} to={1.3} fromSide="left" kb={{ z0: 1.0, z1: 1.1, px0: 0.01, py0: 0, px1: -0.015, py1: 0 }} />
      {t < 40 && <Tag t={t} at={4} x={960} y={950} text="TRÊN CÁC SÂN THƯỢNG" fill="#B5573B" size={44} />}
      <Tag t={t} at={44} x={960} y={190} text="CHỜ TRỰC THĂNG" fill="#B5573B" size={44} />
    </g>
  );
};

/** D20 "hàng nghìn người chờ đợi đến lượt mình." crowd silhouettes waiting, no faces; a Huey passes far above. */
export const D20: React.FC<ShotProps> = ({ t }) => {
  const z = 1 + t * 0.0014;
  return (
    <g>
      <Stage id="d20" tone="dusk" dim={0.3} />
      <HeliSide x={-200 + t * 20} y={360 + Math.sin(t / 10) * 8} size={170} kind="uh1" t={t} />
      <g transform={`translate(960,760) scale(${z}) translate(-960,-760)`}>
        <rect x={0} y={800} width={1920} height={300} fill="#1B1626" />
        <Crowd x={960} y={790} w={1900} rows={4} per={30} s={1.5} t={t} color="#120E1C" seed={5} />
      </g>
      <Cap t={t} at={4} x={960} y={150} text="HÀNG NGHÌN NGƯỜI CHỜ ĐẾN LƯỢT MÌNH" size={62} />
    </g>
  );
};

/** D21 "Theo tài liệu phía Mỹ, chỉ bằng trực thăng," the source card. */
export const D21: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 0, 12));
  return (
    <g>
      <Stage id="d21" tone="navy" />
      <HeliSide x={960 + Math.sin(t / 16) * 40} y={250 + Math.sin(t / 9) * 8} size={300} kind="ch53" t={t} />
      <g transform={`translate(960,${600 + (1 - k) * 60})`} opacity={k}>
        <rect x={-610} y={-130} width={1220} height={330} rx={24} fill="#000" opacity={0.35} transform="translate(8,12)" />
        <rect x={-610} y={-130} width={1220} height={330} rx={24} fill="#F2EBD8" stroke={INK} strokeWidth={6} />
        <rect x={-610} y={-130} width={20} height={330} rx={10} fill={USA_BLUE} />
        <text y={-20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={88} fill="#1C2733">THEO TÀI LIỆU PHÍA MỸ</text>
        <text y={110} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={56} fill="#5A4A2A">chỉ bằng trực thăng</text>
      </g>
    </g>
  );
};

/** D22 "khoảng một nghìn ba trăm bảy mươi ba người Mỹ" counter to 1.373 beside the US ball. */
export const D22: React.FC<ShotProps> = ({ t }) => {
  const v = 1373 * easeOut(prog(t, 2, 46));
  return (
    <g>
      <Stage id="d22" tone="navy" />
      <Ball id="d22b" x={470} y={620} r={190} flag="USA" eyes="normal" hat={<NavyCap />} motion={breathe(t, 90, 0.025)} t={t} />
      <Cap t={t} at={0} x={1260} y={520} text={vn(v)} size={250} font="ui" color="#FFFFFF" />
      <Cap t={t} at={6} x={1260} y={650} text="NGƯỜI MỸ" size={84} color="#9CC4F5" />
      <Tag t={t} at={20} x={1260} y={790} text="Theo tài liệu phía Mỹ" fill="#2F3E58" size={34} />
    </g>
  );
};

/** D23 "và hơn năm nghìn năm trăm người Việt Nam cùng người nước khác đã được đưa đi." counter to 5.595, a print lands on "đã được đưa đi". */
export const D23: React.FC<ShotProps> = ({ t }) => {
  const v = 5595 * easeOut(prog(t, 4, 38));
  return (
    <g>
      <Stage id="d23" tone="navy" />
      <Cap t={t} at={0} x={620} y={500} text={vn(v)} size={230} font="ui" color="#FFFFFF" />
      <Cap t={t} at={50} x={620} y={640} text="NGƯỜI VIỆT NAM" size={62} color="#F4D58A" />
      <Cap t={t} at={60} x={620} y={716} text="VÀ NGƯỜI NƯỚC KHÁC" size={56} color="#F4D58A" />
      <Crowd x={620} y={860} w={640} rows={1} per={11} s={0.95} t={t} color="#E9E4D3" seed={2} />
      <Tag t={t} at={30} x={620} y={960} text="Theo tài liệu phía Mỹ" fill="#2F3E58" size={32} />
      <Photo k="hancockCh53" t={t} id="d23p" x={1450} y={450} w={700} rot={2.5} from={3.25} fromSide="right" kb={{ z0: 1.0, z1: 1.1, px0: 0.01, py0: 0, px1: -0.015, py1: 0 }} />
      <Cap t={t} at={104} x={1450} y={900} text="ĐÃ ĐƯỢC ĐƯA ĐI" size={64} color="#FFE08A" />
    </g>
  );
};
