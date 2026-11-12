import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { NonLa, PilotHelmet } from '../../countryball/ball-accessories';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { breathe, hop, mixMotion } from '../../countryball/ball-motion';
import { DocumentProp } from '../../countryball/ball-speech-and-props';
import { CameraKey, cameraAt, project } from '../../countryball/geo-camera';
import { DateChip } from '../../countryball/hud-date-chip';
import { MiniMap } from '../../countryball/hud-minimap';
import { LowerThird } from '../../countryball/hud-chips';
import { GeoMap } from '../../countryball/map-geo-map';
import { CITIES, City } from '../../countryball/map-labels';
import { Glow } from '../../countryball/fx-glow';
import { BigText, Pin, Stage, Stars, Veil, eio, eout, ramp } from './chh-common';
import { LakeScene } from './chh-lake-scene';
import { FONT } from '../../engine/fonts';

// Chapter H, beat "partners": 1975 unification, 1995 normalisation, 2023 comprehensive strategic partnership,
// former pilots returning to the lake, a quiet candle moment.

/** H18 (3.0 s): 1975, the whole country on the map, camera drifts north to south. */
const K18: CameraKey[] = [{ t: 0, lon: 106.2, lat: 20.5, zoom: 78 }, { t: 3.1, lon: 107.6, lat: 13.2, zoom: 78, ease: 'inout' }];
export const H18: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30, cam = cameraAt(K18, ts);
  return (
    <Stage>
      <GeoMap camera={cam} night={0} highlight={['VNM']} id="h18">
        <City {...CITIES.hanoi} showLabel /><City {...CITIES.danang} showLabel /><City {...CITIES.saigon} showLabel />
      </GeoMap>
      <Veil o={0.12} />
      <BigText ts={ts} lines={['ĐẤT NƯỚC', 'THỐNG NHẤT']} y={400} x={400} size={96} from={0.3} />
      <Ball id="h18v" x={1560} y={300} r={96} flag="VNM" eyes="happy" motion={mixMotion(breathe(t, 50, 0.03), hop(t, 30, 18))} t={t} />
      <DateChip dates={[{ t: 0, label: '1973' }, { t: 0.5, label: '1975' }]} t={ts} id="h18d" />
      <MiniMap camera={cam} id="h18m" />
    </Stage>
  );
};

const Dusk: React.FC<{ ts: number }> = ({ ts }) => (
  <g>
    <defs><linearGradient id="chh-dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#14203A" /><stop offset="1" stopColor="#3B4E78" /></linearGradient></defs>
    <rect width={1920} height={1080} fill="url(#chh-dusk)" /><Stars ts={ts} />
    <path d="M0,900 Q480,860 960,890 T1920,880 L1920,1080 L0,1080 Z" fill="#1B2742" />
  </g>
);

/** H19 (2.8 s): 1995, the two balls meet. */
export const H19: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30, k = eout(ts / 0.7);
  return (
    <Stage>
      <Dusk ts={ts} />
      <BigText ts={ts} lines={['1995']} y={430} size={250} fill="#FFD84A" stroke={22} />
      <Ball id="h19v" x={420 - (1 - k) * 400} y={800} r={120} flag="VNM" eyes="normal" look={0.5} hat={<NonLa />} motion={breathe(t, 62, 0.03)} t={t} />
      <Ball id="h19u" x={1500 + (1 - k) * 400} y={800} r={120} flag="USA" eyes="normal" look={-0.5} motion={breathe(t, 66, 0.03, 15)} t={t} />
      <text x={420} y={970} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#F4F4F4" opacity={k}>VIỆT NAM</text>
      <text x={1500} y={970} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#F4F4F4" opacity={k}>MỸ</text>
    </Stage>
  );
};

/** H20 (1.7 s): normalising relations, balls move together over a document. */
export const H20: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30, k = eio(ts / 1.4);
  return (
    <Stage>
      <Dusk ts={ts} />
      <BigText ts={ts} lines={['BÌNH THƯỜNG HÓA', 'QUAN HỆ']} y={290} size={110} from={0.1} />
      <Ball id="h20v" x={480 + k * 260} y={800} r={120} flag="VNM" eyes="happy" hat={<NonLa />} motion={mixMotion(breathe(t, 56, 0.03), hop(t, 20, 10))} t={t} />
      <Ball id="h20u" x={1440 - k * 260} y={800} r={120} flag="USA" eyes="happy" motion={mixMotion(breathe(t, 60, 0.03), hop(t, 20, 10, 5))} t={t} />
      <DocumentProp x={960} y={860} s={1.1} rot={-3} title="1995" />
    </Stage>
  );
};

/** H21 (3.1 s): 2023, side by side, calm. */
export const H21: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30;
  return (
    <Stage>
      <Dusk ts={ts} />
      <Glow x={960} y={520} r={560} color="#FFD84A" o={0.18 + 0.05 * Math.sin(ts * 2)} />
      <BigText ts={ts} lines={['2023']} y={440} size={250} fill="#FFD84A" stroke={22} />
      <Ball id="h21v" x={700} y={800} r={120} flag="VNM" eyes="happy" hat={<NonLa />} motion={breathe(t, 62, 0.035)} t={t} look={0.3} />
      <Ball id="h21u" x={1220} y={800} r={120} flag="USA" eyes="happy" motion={breathe(t, 66, 0.035, 12)} t={t} look={-0.3} />
    </Stage>
  );
};

/** H22 (1.5 s): the partnership card. */
export const H22: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30, k = eout(ts / 0.45);
  return (
    <Stage>
      <Dusk ts={ts} />
      <g transform={`translate(960,520) scale(${0.85 + 0.15 * k})`} opacity={k}>
        <rect x={-780} y={-190} width={1560} height={380} rx={40} fill="#141C2A" stroke="#FFD84A" strokeWidth={9} />
        <text y={-30} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={92} fill="#FFD84A" stroke="#0A0F18" strokeWidth={8} paintOrder="stroke">ĐỐI TÁC CHIẾN LƯỢC</text>
        <text y={90} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={92} fill="#FFD84A" stroke="#0A0F18" strokeWidth={8} paintOrder="stroke">TOÀN DIỆN</text>
      </g>
      <Ball id="h22v" x={240} y={850} r={90} flag="VNM" eyes="happy" motion={breathe(t, 56, 0.03)} t={t} />
      <Ball id="h22u" x={1680} y={850} r={90} flag="USA" eyes="happy" motion={breathe(t, 60, 0.03, 9)} t={t} />
    </Stage>
  );
};

/** H23 (3.2 s): pilots who once flew over Hà Nội: a plane crosses, then a pilot ball walks back to the lake. */
export const H23: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30, cam = { lon: 105.83, lat: 21.04, zoom: 700 + ts * 20 };
  const [lx, ly] = project(cam, 105.8268, 21.0405);
  const planeX = -200 + ts * 900, walk = eio(ramp(ts, 1.7, 3.1));
  return (
    <Stage>
      <GeoMap camera={cam} night={0.15} id="h23"><City {...CITIES.hanoi} showLabel={false} /></GeoMap>
      <Veil o={0.2} />
      {ts < 2.3 && <AircraftTop id="h23p" kind="f4" x={planeX} y={300 + ts * 40} size={150} heading={8} opacity={1 - ramp(ts, 1.6, 2.3)} />}
      <Pin ts={ts} from={1.4} px={lx} py={ly} lx={lx + 60} ly={ly - 150} label="Hồ Hữu Tiệp" />
      <Ball id="h23u" x={-100 + walk * (lx - 160)} y={ly + 150} r={80} flag="USA" eyes="normal" hat={<PilotHelmet />} motion={mixMotion(breathe(t, 50, 0.03), walk < 1 && walk > 0 ? hop(t, 22, 12) : breathe(t, 60))} t={t} />
      <DateChip label="NGÀY NAY" id="h23d" t={ts} />
      <LowerThird title="Có người đã quay lại" from={1.9} t={ts} />
    </Stage>
  );
};

/** H24 (2.5 s): both stand by the lake: not to bomb. */
export const H24: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30;
  return (
    <Stage>
      <LakeScene id="h24" t={t} dark={0.25 + 0.1 * ramp(ts, 0, 2.5)} />
      <BigText ts={ts} lines={['KHÔNG PHẢI', 'ĐỂ NÉM BOM']} y={210} size={104} from={1.2} fill="#FFF3C4" />
    </Stage>
  );
};

/** H25 (2.2 s): ... but to remember: candles are lit along the shore, the light dims. */
export const H25: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30;
  return (
    <Stage>
      <LakeScene id="h25" t={t} dark={0.5 + 0.3 * ramp(ts, 0, 1.6)} candles={7} eyes="sad" />
      <BigText ts={ts} lines={['MÀ ĐỂ TƯỞNG NHỚ']} y={190} size={100} from={0.2} fill="#FFF3C4" />
    </Stage>
  );
};
