import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { NonLa } from '../../countryball/ball-accessories';
import { breathe, hop, mixMotion } from '../../countryball/ball-motion';
import { CameraKey, cameraAt } from '../../countryball/geo-camera';
import { DateChip } from '../../countryball/hud-date-chip';
import { MiniMap } from '../../countryball/hud-minimap';
import { LowerThird } from '../../countryball/hud-chips';
import { GeoMap } from '../../countryball/map-geo-map';
import { CITIES, City, HANOI_SITES } from '../../countryball/map-labels';
import { PhotoCard } from '../../countryball/photo-card';
import { Candle, BigText, Pin, Stage, Veil, eio, eout, ramp } from './chh-common';
import { FONT } from '../../engine/fonts';

// Chapter H, beat "today": a stroll through today's Hà Nội, the three places that remember (photos with credits).

const IMG = 'dien-bien-phu-tren-khong/img/';
const K8: CameraKey[] = [{ t: 0, lon: 105.9, lat: 21.06, zoom: 300 }, { t: 2.2, lon: 105.85, lat: 21.03, zoom: 520, ease: 'linear' }];

/** H8 (2.1 s): daytime Hà Nội, a Việt Nam ball out for a stroll. */
export const H8: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30, cam = cameraAt(K8, ts);
  return (
    <Stage>
      <GeoMap camera={cam} night={0} provinces rivers={['Hong']} highlight={['Hà Nội']} id="h8">
        <City {...CITIES.hanoi} showLabel />
      </GeoMap>
      <Ball id="h8v" x={300 + ts * 330} y={880} r={92} flag="VNM" eyes="happy" hat={<NonLa />} motion={mixMotion(breathe(t, 50, 0.03), hop(t, 20, 18))} t={t} />
      <DateChip label="NGÀY NAY" id="h8d" t={ts} />
      <MiniMap camera={cam} id="h8m" />
    </Stage>
  );
};

/** H9 (2.3 s): three places that keep the memory, joined by a walking route. */
const STOPS = [{ x: 560, y: 690, l: 'Hồ Hữu Tiệp', ly: 590, from: 0.2 }, { x: 960, y: 450, l: 'Phố Đội Cấn', ly: 350, from: 0.8 }, { x: 1380, y: 650, l: 'Phố Khâm Thiên', ly: 550, from: 1.4 }];
export const H9: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30, cam = { lon: 105.84, lat: 21.03, zoom: 760 + ts * 20 };
  const walk = eio(ts / 2.2), seg = walk * 2, i = Math.min(1, Math.floor(seg)), u = seg - i;
  const bx = STOPS[i].x + (STOPS[i + 1].x - STOPS[i].x) * u, by = STOPS[i].y + (STOPS[i + 1].y - STOPS[i].y) * u;
  return (
    <Stage>
      <GeoMap camera={cam} night={0} provinces highlight={['Hà Nội']} id="h9" />
      <Veil o={0.25} />
      <polyline points={STOPS.map((s) => `${s.x},${s.y}`).join(' ')} fill="none" stroke="#FFD84A" strokeWidth={5} strokeDasharray="4 18" strokeLinecap="round" opacity={0.8} />
      {STOPS.map((s, k) => <Pin key={k} ts={ts} from={s.from} px={s.x} py={s.y} lx={s.x} ly={s.ly} label={s.l} />)}
      <Ball id="h9v" x={bx} y={by + 50} r={52} flag="VNM" eyes="normal" hat={<NonLa />} motion={mixMotion(breathe(t, 50, 0.04), hop(t, 18, 12))} t={t} />
      <DateChip label="NGÀY NAY" id="h9d" t={ts} />
      <LowerThird title="Dấu vết vẫn còn" sub="Vị trí chỉ mang tính minh họa" from={0.3} t={ts} />
    </Stage>
  );
};

const DimMap: React.FC<{ id: string; ts: number; lon: number; lat: number; o?: number }> = ({ id, ts, lon, lat, o = 0.6 }) => (
  <>
    <GeoMap camera={{ lon: lon + ts * 0.0004, lat, zoom: 900 }} night={0.2} id={id} />
    <Veil o={o} />
  </>
);

/** H10 (2.3 s): the wreck in Hữu Tiệp lake. */
export const H10: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30;
  return (
    <Stage>
      <DimMap id="h10" ts={ts} lon={105.827} lat={21.04} />
      <PhotoCard id="h10p" src={IMG + 'b52-wreck-huu-tiep-lake.jpg'} caption="Xác B-52 giữa hồ Hữu Tiệp" credit="Ảnh: calflier001 / CC BY-SA 2.0" x={960} y={500} w={860} h={646} rot={-2} from={0} t={ts} />
    </Stage>
  );
};

/** H11 (3.1 s): the B-52 Victory Museum: SAM-2 outside, then a piece of tail fin lands beside it (at 1.9 s). */
export const H11: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30;
  return (
    <Stage>
      <DimMap id="h11" ts={ts} lon={105.819} lat={21.035} />
      <PhotoCard id="h11a" src={IMG + 'b52-museum-sam2.jpg'} caption="Bảo tàng Chiến thắng B-52, phố Đội Cấn" credit="Ảnh: kitmasterbloke / CC BY 2.0" x={560} y={480} w={760} h={457} rot={-3} from={0} t={ts} fromSide="left" />
      <PhotoCard id="h11b" src={IMG + 'b52-tail-fin-wreck.jpg'} caption="Mảnh đuôi B-52 ở bảo tàng" credit="Ảnh: kitmasterbloke / CC BY 2.0" x={1390} y={620} w={640} h={367} rot={3} from={1.9} t={ts} fromSide="right" />
    </Stage>
  );
};

/** H12 (2.2 s): the mother statue on Khâm Thiên street: quiet, a candle beside the photo. */
export const H12: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30, k = eout(ts / 0.8);
  return (
    <Stage>
      <DimMap id="h12" ts={ts} lon={105.84} lat={21.018} o={0.7} />
      <PhotoCard id="h12p" src={IMG + 'kham-thien-memorial.jpg'} caption="Tượng đài ở phố Khâm Thiên" credit="Ảnh: Arjunullas / CC BY-SA 4.0" x={700} y={470} w={560} h={747} rot={-1.5} from={0} t={ts} fromSide="left" kb={{ z0: 1.02, z1: 1.12, py0: 0.04, py1: -0.03 }} />
      <g opacity={k}>
        <text x={1300} y={420} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#F4F4F4" stroke="#0A0F18" strokeWidth={10} paintOrder="stroke">Tượng đài</text>
        <text x={1300} y={500} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#F4F4F4" stroke="#0A0F18" strokeWidth={10} paintOrder="stroke">người mẹ</text>
        <Candle x={1300} y={760} ts={ts} s={1.5} seed={3} />
      </g>
    </Stage>
  );
};
