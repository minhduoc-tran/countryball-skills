import React from 'react';
import { ShotProps } from '../../engine';
import { project } from '../../countryball/geo-camera';
import { Ball } from '../../countryball/countryball';
import { breathe } from '../../countryball/ball-motion';
import { M1Helmet } from '../../countryball/ball-accessories-military';
import { Candle } from '../../countryball/ground-memorial-props';
import { TankSide } from '../../countryball/ground-tanks';
import { SaigonBridgeSide } from '../../countryball/saigon-bridge-side';
import { FrontArrow, SIDE_COLORS } from '../../countryball/ground-front-arrows';
import { SmokeColumn } from '../../countryball/ground-weather-and-smoke';
import { FlagCloth } from '../../countryball/flag-cloth';
import { SaigonSites } from '../../countryball/sai-gon-map-labels';
import { MuCoi } from '../../countryball/ball-accessories';
import { Pt, lerp } from '../../countryball/fx-math';
import { Cap, MapScene, PhotoE, Plate, Stage, Tag, VNM_RED, easeOut, prog } from './che-common';
import { Hourglass } from './che-props';

// Chapter E, part 4 (6:01-6:17, beat "8b bridge", 30.04.1975 morning): E17 print of cầu Sài Gòn, E18 one of the last battles (map), E19 defenders on the far side,
// with a tank, E20 the fight (smoke only, no fire shown on people), E21 quiet card "thương vong ở cả hai bên", E22 only hours before the end.
// Tanks here carry NO hull number (the numbers 843 / 390 belong to the palace gate, chapter F). Nothing gory: smoke, a soft dim, candles.

const DECK = 600;
/** Tank on the bridge deck (centre x, tank tracks sit on the deck line). */
const BridgeTank: React.FC<{ x: number; size: number; flip?: boolean; kind?: 't54' | 'm48'; fire?: number; flag?: boolean; t: number; id: string }> = ({ x, size, flip, kind = 't54', fire = 0, flag, t, id }) => (
  <TankSide x={x} y={DECK - 18 * (size / 200)} size={size} kind={kind} flip={flip} fire={fire} flag={flag ? 'PRG' : undefined} t={t} id={id} />
);

/** E17 361.62 "Chắn trước mặt họ là cầu Sài Gòn." print of the bridge (1961). */
export const E17: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="e17" tone="noon" dim={0.1} />
    <PhotoE k="bridge" id="e17p" t={t} x={960} y={470} w={880} rot={-1.5} from={0.05} fromSide="left" sepia={0.2} kb={{ z0: 1.0, z1: 1.1, px0: 0.01, py0: 0.01, px1: -0.015, py1: -0.01 }} />
    <Tag t={t} at={12} x={960} y={985} text="CẦU SÀI GÒN" fill="#2F3E58" size={52} />
  </g>
);

/** E18 363.60 "Đây là một trong những trận đánh cuối cùng của cuộc chiến." map at the bridge: the arrow stops at the river, a burst flashes. */
export const E18: React.FC<ShotProps> = ({ t }) => (
  <MapScene t={t} id="e18" date="30.04.1975" keys={[{ t: 0, lon: 106.745, lat: 10.815, zoom: 12000, ease: 'linear' }, { t: 2.7, lon: 106.738, lat: 10.808, zoom: 15000, ease: 'linear' }]}
    map={<SaigonSites only={['cauSaiGon', 'hangXanh']} size={26} />}
    over={(cam) => {
      const a = project(cam, 106.79, 10.848) as Pt, b = project(cam, 106.7285, 10.8, ) as Pt, c = project(cam, 106.7272, 10.7988);
      const pulse = 1 + 0.12 * Math.sin(t / 3), k = easeOut(prog(t, 36, 50));
      return (
        <g>
          <FrontArrow id="e18" t={t} t0={4} points={[a, b]} dur={38} width={44} color={SIDE_COLORS.vnm} />
          <g transform={`translate(${c[0] - 46},${c[1] - 34}) scale(${k * pulse * 0.7})`} opacity={k}>
            <polygon points={Array.from({ length: 16 }, (_, i) => { const r = i % 2 ? 40 : 82, an = (i * Math.PI) / 8; return `${Math.cos(an) * r},${Math.sin(an) * r}`; }).join(' ')} fill="#FFE08A" stroke="#E0632A" strokeWidth={7} strokeLinejoin="round" />
          </g>
          <Plate t={t} at={10} x={960} y={950} text="MỘT TRONG NHỮNG TRẬN ĐÁNH CUỐI CÙNG" size={50} />
        </g>
      );
    }} />
);

/** E19 366.30 "Phía bên kia vẫn còn lực lượng phòng thủ, có cả xe tăng." RVN defenders on the far side of the bridge; a tank rolls in at "có cả xe tăng". */
export const E19: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 64, 96)), a = easeOut(prog(t, 0, 90));
  return (
    <g>
      <SaigonBridgeSide id="e19" y={DECK} n={0} t={t} tone="day" />
      <BridgeTank x={lerp(-220, 380, a)} size={260} flag t={t} id="e19a" />
      <BridgeTank x={lerp(-560, 110, a)} size={260} flag t={t + 7} id="e19b" />
      <g transform={`translate(1600,${DECK - 6})`}>
        <line x1={0} y1={0} x2={0} y2={-250} stroke="#151515" strokeWidth={6} />
        <FlagCloth id="e19f" x={0} y={-250} w={130} h={86} kind="RVN" wave={0.9} t={t} />
      </g>
      <Ball id="e19b2" x={1790} y={DECK - 6 - 70} r={70} flag="RVN" eyes="determined" hat={<M1Helmet />} tilt={4} motion={breathe(t, 70, 0.02)} t={t} />
      <BridgeTank x={lerp(2300, 1330, k)} size={300} flip kind="m48" t={t} id="e19m" />
      <Plate t={t} at={t < 66 ? 0 : 66} x={960} y={170} text={t < 66 ? 'PHÍA BÊN KIA: LỰC LƯỢNG PHÒNG THỦ' : 'CÓ CẢ XE TĂNG'} size={62} />
    </g>
  );
};

/** E20 369.64 "Trận chiến trên cầu diễn ra quyết liệt, có xe tăng bị bắn cháy," both sides fire; smoke rises from a hit tank (no flames on people, nothing graphic). */
export const E20: React.FC<ShotProps> = ({ t }) => {
  const f1 = [4, 24, 46, 70].some((s) => t >= s && t < s + 5) ? 1 : 0, f2 = [14, 36, 58].some((s) => t >= s && t < s + 5) ? 1 : 0;
  return (
    <g>
      <SaigonBridgeSide id="e20" y={DECK} n={0} t={t} tone="dusk" />
      <BridgeTank x={640} size={320} fire={f1} flag t={t} id="e20a" />
      <BridgeTank x={1330} size={340} flip kind="m48" fire={f2} t={t} id="e20b" />
      {f1 > 0 && <circle cx={940} cy={DECK - 60} r={40} fill="#FFF1C0" opacity={0.5} />}
      <SmokeColumn t={t} t0={50} x={1360} y={DECK - 70} h={420} w={56} lean={0.2} />
      <SmokeColumn t={t} t0={76} x={560} y={DECK - 70} h={300} w={46} lean={0.2} />
      <Plate t={t} at={t < 52 ? 0 : 52} x={960} y={170} text={t < 52 ? 'TRẬN CHIẾN QUYẾT LIỆT' : 'XE TĂNG BỊ BẮN CHÁY'} size={66} />
    </g>
  );
};

/** E21 372.81 "có những người lính ngã xuống ở cả hai bên," quiet card: two sad balls side by side, two candles, a soft dim. */
export const E21: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="e21" tone="night" dim={0.15} />
    <Cap t={t} at={2} x={960} y={230} text="THƯƠNG VONG" size={96} />
    <Cap t={t} at={12} x={960} y={340} text="Ở CẢ HAI BÊN" size={96} color="#E2B95A" />
    <Ball id="e21a" x={600} y={720} r={130} flag="VNM" eyes="sad" hat={<MuCoi />} tilt={-5} motion={breathe(t, 100, 0.02)} t={t} />
    <Ball id="e21b" x={1320} y={720} r={130} flag="RVN" eyes="sad" hat={<M1Helmet />} tilt={5} motion={breathe(t, 100, 0.02, 0.4)} t={t} />
    <Candle x={900} y={850} s={200} t={t} seed={1} /><Candle x={1020} y={850} s={200} t={t + 9} seed={2} />
  </g>
);

/** E22 375.16 "chỉ vài giờ trước khi chiến tranh kết thúc." an hourglass runs down. */
export const E22: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="e22" tone="night" />
    <Hourglass id="e22h" x={560} y={560} h={520} u={prog(t, 0, 66) * 0.9} />
    <Cap t={t} at={2} x={1280} y={420} text="CHỈ VÀI GIỜ" size={92} />
    <Cap t={t} at={10} x={1280} y={530} text="TRƯỚC KHI" size={78} color="#E2B95A" />
    <Cap t={t} at={22} x={1280} y={640} text="CHIẾN TRANH KẾT THÚC" size={64} />
  </g>
);
