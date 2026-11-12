import React from 'react';
import { FONT, ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe, hop } from '../../countryball/ball-motion';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { PhotoCard } from '../../countryball/photo-card';
import { CITIES, City } from '../../countryball/map-labels';
import { Cap, Dark, GOLD, INK, MapScene, Pin, Tag, clamp, drift, easeOut, ramp } from './chc-helpers';

// Chapter C, part 1 (3:16-3:30): Hồ Chí Minh's prediction. C1 Hà Nội waits, C2 the documents, C3-C4 the 1946 portrait and
// the air-defence generals, C5 a B-52 cell heading for Hà Nội, C6 the quote card.

const HCM = 'dien-bien-phu-tren-khong/img/ho-chi-minh-1946.jpg';
const HCM_CREDIT = 'Ảnh: Gift to Raymond Aubrac / Public domain (Vietnam)';
const HN: [number, number] = [105.85, 21.03];

/** C1 "Nhưng ở Hà Nội, người ta đã chờ ngày này từ lâu." Map of Hà Nội, years rolling, a VNM ball waiting. */
export const C1: React.FC<ShotProps> = ({ t }) => (
  <MapScene id="c1" t={t} keys={drift([105.9, 20.6, 120], [105.86, 21.0, 230], 4)} night={0} parallel={false}
    dates={[{ t: 0, label: '1965' }, { t: 1.1, label: '1968' }, { t: 2.1, label: '1970' }, { t: 3.0, label: '1972' }]}
    map={<Pin lon={HN[0]} lat={HN[1]}>{(x, y) => (
      <g>
        <City {...CITIES.hanoi} minZoom={0} />
        <Ball id="c1-v" x={x + 80} y={y - 70} r={46} flag="VNM" eyes="determined" look={-0.4} hat={<MuCoi />} motion={breathe(t, 60, 0.04)} />
        <Cap t={t} x={x + 80} y={y - 150} text="CHỜ" size={46} color={GOLD} at={10} />
      </g>)}</Pin>}
    over={() => <Cap t={t} x={960} y={930} text="HÀ NỘI ĐÃ CHỜ NGÀY NÀY TỪ LÂU" size={62} at={6} />} />
);

const Sheet: React.FC<{ x: number; y: number; rot: number; k: number; head: string }> = ({ x, y, rot, k, head }) => (
  <g transform={`translate(${x},${y + (1 - k) * 500}) rotate(${rot + (1 - k) * 18})`} opacity={clamp(k * 1.5)}>
    <rect x={-200} y={-270} width={400} height={540} rx={8} fill="#EFE6CE" stroke={INK} strokeWidth={5} />
    <rect x={-170} y={-236} width={340} height={44} fill="#B3281F" opacity={0.9} />
    <text x={0} y={-203} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#FFF">{head}</text>
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-170} y={-160 + i * 36} width={i % 4 === 3 ? 220 : 340} height={10} rx={5} fill="#7A6F55" opacity={0.7} />)}
  </g>
);

/** C2 "Nhiều tài liệu ghi lại rằng, từ những năm sáu mươi" Three archive sheets land, stamp 1960s. */
export const C2: React.FC<ShotProps> = ({ t }) => {
  const k = (a: number) => easeOut((t - a) / 12);
  const stamp = easeOut((t - 36) / 6);
  return (
    <g>
      <Dark id="c2" tone="warm" />
      <Sheet x={620} y={520} rot={-8} k={k(0)} head="TÀI LIỆU" />
      <Sheet x={960} y={490} rot={3} k={k(8)} head="HỒI KÝ" />
      <Sheet x={1300} y={530} rot={9} k={k(16)} head="GHI CHÉP" />
      <g transform={`translate(1560,110) rotate(-8) scale(0.8) scale(${1.6 - 0.6 * stamp})`} opacity={stamp}>
        <rect x={-270} y={-50} width={540} height={100} rx={14} fill="none" stroke="#E3584A" strokeWidth={8} />
        <text y={20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#E3584A">NHỮNG NĂM 1960</text>
      </g>
      <Cap t={t} x={960} y={960} text="NHIỀU TÀI LIỆU GHI LẠI" size={64} at={22} />
    </g>
  );
};

const Dim: React.FC<{ o?: number }> = ({ o = 0.6 }) => <rect width={1920} height={1080} fill="#050B15" opacity={o} />;

/** C3 Portrait card of Chủ tịch Hồ Chí Minh over a dimmed map of Hà Nội. */
export const C3: React.FC<ShotProps> = ({ t }) => (
  <g>
    <MapScene id="c3" t={t} keys={drift([105.85, 21.0, 200], [105.85, 21.02, 260], 3)} date="1960s" mini={false} />
    <Dim />
    <PhotoCard id="c3p" src={HCM} caption="Chủ tịch Hồ Chí Minh, 1946" credit={HCM_CREDIT} x={960} y={470} w={440} h={580} rot={-2} from={0.05} t={t / 30} sepia={0.2}
      kb={{ z0: 1.0, z1: 1.14, py0: 0.03, py1: -0.02 }} fromSide="bottom" />
    <Tag t={t} at={14} x={960} y={1005} text="CHỦ TỊCH HỒ CHÍ MINH" fill="#9E1F26" size={42} />
  </g>
);

/** C4 "đã dặn các tướng lĩnh phòng không": the portrait slides left, three air-defence officers (VNM balls, pith helmets) listen. */
export const C4: React.FC<ShotProps> = ({ t }) => {
  const xs = [1110, 1370, 1630];
  return (
    <g>
      <MapScene id="c4" t={t} keys={drift([105.85, 21.02, 260], [105.85, 21.0, 300], 3)} date="1960s" mini={false} />
      <Dim />
      <PhotoCard id="c4p" src={HCM} caption="Chủ tịch Hồ Chí Minh, 1946" credit={HCM_CREDIT} x={520} y={470} w={440} h={580} rot={-2} from={-3} t={t / 30} sepia={0.2}
        kb={{ z0: 1.0, z1: 1.14, py0: 0.03, py1: -0.02 }} />
      {xs.map((x, i) => (
        <g key={i} opacity={easeOut((t - 4 - i * 5) / 8)}>
          <Ball id={`c4-b${i}`} x={x} y={600 - (i === 1 ? 20 : 0)} r={92} flag="VNM" eyes="determined" look={-0.6} hat={<MuCoi />}
            motion={hop(t, 46, 10, i * 13)} />
        </g>
      ))}
      <Tag t={t} at={12} x={1370} y={300} text="TƯỚNG LĨNH PHÒNG KHÔNG" fill="#2F4A2A" size={40} />
    </g>
  );
};

/** C5 "Sớm muộn gì đế quốc Mỹ cũng sẽ đưa B-52 ra đánh Hà Nội" A cell of three B-52 closing on Hà Nội. */
export const C5: React.FC<ShotProps> = ({ t, len }) => {
  const u = ramp(t, 0, len), from: [number, number] = [108.6, 18.4];
  const lon = from[0] + (HN[0] - from[0]) * u * 0.92, lat = from[1] + (HN[1] - from[1]) * u * 0.92;
  const heading = (Math.atan2(-(HN[1] - from[1]), HN[0] - from[0]) * 180) / Math.PI;
  const hr = (heading * Math.PI) / 180, rot = (ox: number, oy: number): [number, number] => [ox * Math.cos(hr) - oy * Math.sin(hr), ox * Math.sin(hr) + oy * Math.cos(hr)];
  const off: [number, number][] = [rot(0, 0), rot(-95, 80), rot(-95, -80)];
  return (
    <MapScene id="c5" t={t} keys={drift([107.0, 19.6, 85], [106.4, 20.4, 120], 4)} date="1960s" night={0.15}
      map={<><City {...CITIES.hanoi} /><Pin lon={lon} lat={lat}>{(x, y) => (
        <g>{off.map((o, i) => <AircraftTop key={i} id={`c5-${i}`} kind="b52" x={x + o[0]} y={y + o[1]} size={104} heading={heading} />)}</g>)}</Pin></>}
      over={() => (
        <g>
          <Cap t={t} x={960} y={900} text="SỚM MUỘN GÌ MỸ CŨNG SẼ ĐƯA B-52" size={50} at={6} />
          <Cap t={t} x={960} y={985} text="RA ĐÁNH HÀ NỘI" size={50} color={GOLD} at={16} />
        </g>)} />
  );
};

/** C6 "rồi có thua nó mới chịu thua." Quote card with the small portrait. */
export const C6: React.FC<ShotProps> = ({ t }) => {
  const a = 'Sớm muộn gì đế quốc Mỹ cũng sẽ đưa B-52', b = 'ra đánh Hà Nội, rồi có thua nó mới chịu thua.';
  const show = (s: string, from: number) => s.slice(0, Math.floor(clamp((t - from) / 22) * s.length));
  const hi = clamp((t - 30) / 8);
  return (
    <g>
      <Dark id="c6" tone="warm" />
      <PhotoCard id="c6p" src={HCM} caption="Hồ Chí Minh, 1946" credit={HCM_CREDIT} x={380} y={500} w={330} h={430} rot={-3} from={-3} t={t / 30} sepia={0.25}
        kb={{ z0: 1.0, z1: 1.1 }} />
      <g transform="translate(1000,420)">
        <text x={-300} y={-120} fontFamily={FONT.title} fontWeight={800} fontSize={190} fill={GOLD} opacity={0.5}>“</text>
        <text x={-300} y={30} fontFamily={FONT.title} fontWeight={700} fontSize={50} fill="#F4ECD3">{show(a, 2)}</text>
        <text x={-300} y={100} fontFamily={FONT.title} fontWeight={800} fontSize={50} fill={hi > 0.5 ? GOLD : '#F4ECD3'}>{show(b, 14)}</text>
        <text x={-300} y={230} fontFamily={FONT.ui} fontSize={26} fill="#C9C2AE" opacity={clamp((t - 30) / 10)}>Lời dặn của Chủ tịch Hồ Chí Minh,</text>
        <text x={-300} y={266} fontFamily={FONT.ui} fontSize={26} fill="#C9C2AE" opacity={clamp((t - 30) / 10)}>theo nhiều tài liệu Việt Nam ghi lại</text>
      </g>
    </g>
  );
};
