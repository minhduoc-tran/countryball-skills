import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi, NonLa } from '../../countryball/ball-accessories';
import { breathe, mixMotion } from '../../countryball/ball-motion';
import { DateChip } from '../../countryball/hud-date-chip';
import { GeoMap } from '../../countryball/map-geo-map';
import { CITIES, City } from '../../countryball/map-labels';
import { PhotoCard } from '../../countryball/photo-card';
import { Glow } from '../../countryball/fx-glow';
import { BigText, Candle, Dawn, Stage, Stars, Veil, eout, ramp } from './chh-common';
import { LakeScene } from './chh-lake-scene';
import { FONT } from '../../engine/fonts';

// Chapter H, beat "ending": Hà Nội stood for 12 nights; numbers differ; one thing nobody disputes; the price of peace;
// worth cherishing; closing question card (the last shot runs to the end of the episode, calm).

/** H26 (3.9 s): Hà Nội at night keeps its lights, 12 moons fill one by one. */
export const H26: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30, cam = { lon: 105.86, lat: 21.03, zoom: 560 + ts * 18 };
  return (
    <Stage>
      <GeoMap camera={cam} night={0.85} provinces highlight={['Hà Nội']} id="h26">
        <City {...CITIES.hanoi} lights={1} showLabel />
      </GeoMap>
      <Veil o={0.2} />
      <Glow x={960} y={540} r={300 + 20 * Math.sin(ts * 2)} color="#FFC76B" o={0.22} />
      <BigText ts={ts} lines={['HÀ NỘI ĐỨNG VỮNG']} y={250} size={110} from={0.3} />
      {Array.from({ length: 12 }, (_, i) => {
        const on = ts > 1.7 + i * 0.19;
        return <g key={i} transform={`translate(${690 + i * 49},880)`} opacity={on ? 1 : 0.25}>
          <circle r={19} fill={on ? '#C9D6FF' : '#3A4560'} stroke="#0A0F18" strokeWidth={3} />
          <circle cx={7} cy={-4} r={16} fill="#101828" opacity={on ? 0.85 : 0} />
        </g>;
      })}
      <Ball id="h26v" x={250} y={850} r={100} flag="VNM" eyes="determined" hat={<MuCoi />} motion={breathe(t, 60, 0.03)} t={t} />
      <DateChip label="12.1972" id="h26d" t={ts} />
    </Stage>
  );
};

/** H27 (2.9 s): two sources, two columns, no numbers: the figures differ. */
export const H27: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30;
  const col = (x: number, title: string, flag: string, from: number, side: number) => {
    const k = eout((ts - from) / 0.55);
    return (
      <g transform={`translate(${x + side * (1 - k) * 600},500)`} opacity={k}>
        <rect x={-380} y={-250} width={760} height={500} rx={30} fill="#141C2A" stroke={flag === 'VNM' ? '#E0674F' : '#8FA7C2'} strokeWidth={8} />
        <text y={-120} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={66} fill="#F4F4F4">{title}</text>
        <text y={90} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={220} fill="#E2B95A" stroke="#0A0F18" strokeWidth={10} paintOrder="stroke">?</text>
        <Ball id={`h27${flag}`} x={0} y={170} r={52} flag={flag} eyes="normal" motion={breathe(t, 60, 0.04, side * 8)} t={t} shadow={false} />
      </g>
    );
  };
  return (
    <Stage bg="#0F1826">
      <Stars ts={ts} />
      {col(500, 'Theo phía Việt Nam', 'VNM', 0.1, -1)}
      {col(1420, 'Theo phía Mỹ', 'USA', 0.5, 1)}
      <BigText ts={ts} lines={['Số liệu có thể khác nhau']} y={930} size={72} from={1.3} fill="#FFF3C4" />
    </Stage>
  );
};

/** H28 (2.1 s): one thing nobody disputes. */
export const H28: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30;
  return (
    <Stage>
      <GeoMap camera={{ lon: 105.85, lat: 21.03, zoom: 420 }} night={0.9} id="h28"><City {...CITIES.hanoi} showLabel={false} /></GeoMap>
      <Veil o={0.45} />
      <BigText ts={ts} lines={['MỘT ĐIỀU', 'KHÔNG AI TRANH CÃI']} y={420} size={118} from={0.2} />
      <Ball id="h28v" x={300} y={900} r={84} flag="VNM" eyes="determined" hat={<NonLa />} motion={breathe(t, 60, 0.03)} t={t} />
      <Ball id="h28u" x={1620} y={900} r={84} flag="USA" eyes="determined" motion={breathe(t, 64, 0.03, 10)} t={t} />
    </Stage>
  );
};

/** H29 (2.9 s): the price of peace: candles, quiet. */
export const H29: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30;
  return (
    <Stage bg="#0A0F1A">
      <Stars ts={ts} />
      <BigText ts={ts} lines={['HÒA BÌNH HÔM NAY']} y={230} size={96} from={0.1} fill="#FFF3C4" />
      <BigText ts={ts} lines={['MỘT CÁI GIÁ RẤT ĐẮT']} y={400} size={110} from={1.0} fill="#FFD84A" />
      {Array.from({ length: 9 }, (_, i) => <Candle key={i} x={400 + i * 140} y={820 + (i % 2) * 30} ts={ts} s={1.1} lit={ramp(ts, 0.3 + i * 0.2, 0.7 + i * 0.2)} seed={i} />)}
      <Ball id="h29v" x={170} y={880} r={78} flag="VNM" eyes="sad" tilt={-5} motion={breathe(t, 80, 0.03)} t={t} />
      <Ball id="h29u" x={1750} y={880} r={78} flag="USA" eyes="sad" tilt={5} motion={breathe(t, 84, 0.03, 12)} t={t} />
    </Stage>
  );
};

/** H30 (2.8 s): worth cherishing: dawn, both balls look at the sun. */
export const H30: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30;
  return (
    <Stage>
      <Dawn id="h30" k={ramp(ts, 0, 2.6)} />
      <Ball id="h30v" x={560} y={850} r={110} flag="VNM" eyes="happy" look={0.6} hat={<NonLa />} motion={mixMotion(breathe(t, 64, 0.03))} t={t} />
      <Ball id="h30u" x={820} y={870} r={110} flag="USA" eyes="happy" look={0.6} motion={breathe(t, 70, 0.03, 14)} t={t} />
      <BigText ts={ts} lines={['ĐÁNG ĐỂ', 'TRÂN TRỌNG']} y={250} x={620} size={110} from={0.2} fill="#FFF3C4" />
    </Stage>
  );
};

const QUESTION = ['Bạn đã bao giờ đến', 'hồ Hữu Tiệp chưa?'];

/** H31 (2.5 s): the lake photo and the question. */
export const H31: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30;
  return (
    <Stage bg="#16223A">
      <Stars ts={ts} />
      <Glow x={1350} y={520} r={560} color="#FFD84A" o={0.12} />
      <PhotoCard id="h31p" src="dien-bien-phu-tren-khong/img/b52-wreck-huu-tiep-lake.jpg" caption="Hồ Hữu Tiệp, Hà Nội" credit="Ảnh: calflier001 / CC BY-SA 2.0" x={520} y={500} w={700} h={526} rot={-2.5} from={0} t={ts} fromSide="left" />
      <BigText ts={ts} lines={QUESTION} x={1370} y={440} size={86} from={0.5} fill="#FFF3C4" />
    </Stage>
  );
};

/** H32 (to the end, ~5.7 s): calm closing card: the question and the comment prompt over the quiet lake. */
export const H32: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30, k = eout((ts - 1.2) / 0.6);
  return (
    <Stage>
      <LakeScene id="h32" t={t} dark={0.5} candles={7} />
      <Veil o={0.12} />
      <BigText ts={ts} lines={QUESTION} y={190} size={100} from={0} fill="#FFF3C4" />
      <g opacity={k} transform={`translate(960,${450 - (1 - k) * 20})`}>
        <rect x={-470} y={-48} width={940} height={96} rx={48} fill="#15181F" fillOpacity={0.9} stroke="#E2B95A" strokeWidth={5} />
        <path d="M-420,-22 h46 a8,8 0 0 1 8,8 v22 a8,8 0 0 1 -8,8 h-22 l-14,14 v-14 h-10 a8,8 0 0 1 -8,-8 v-22 a8,8 0 0 1 8,-8 z" transform="translate(-6,-4)" fill="#E2B95A" />
        <text x={30} y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={40} fill="#F4F4F4">Kể cho mình nghe ở phần bình luận nhé</text>
      </g>
    </Stage>
  );
};
