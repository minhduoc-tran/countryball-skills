import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe, hop, mixMotion, talk } from '../../countryball/ball-motion';
import { DocumentProp, PenProp } from '../../countryball/ball-speech-and-props';
import { CameraKey, cameraAt, project } from '../../countryball/geo-camera';
import { DateChip } from '../../countryball/hud-date-chip';
import { MiniMap } from '../../countryball/hud-minimap';
import { LowerThird } from '../../countryball/hud-chips';
import { GeoMap } from '../../countryball/map-geo-map';
import { CITIES, City } from '../../countryball/map-labels';
import { Glow } from '../../countryball/fx-glow';
import { BigText, Dawn, Stage, Stars, Veil, eio, eout, ramp } from './chh-common';
import { FONT } from '../../engine/fonts';

// Chapter H, beats "the name": 12 nights -> the title "Điện Biên Phủ trên không" -> 1954 callback -> peace.

/** H1 (2.5 s): Hà Nội at night, 12 moons fill up, date rolls 18 -> 29.12.1972. */
export const H1: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30;
  const cam = cameraAt([{ t: 0, lon: 105.86, lat: 21.03, zoom: 650 }, { t: 3, lon: 105.86, lat: 21.03, zoom: 760, ease: 'linear' }], ts);
  return (
    <Stage>
      <GeoMap camera={cam} night={0.85} provinces highlight={['Hà Nội']} id="h1">
        <City {...CITIES.hanoi} lights={1} showLabel />
      </GeoMap>
      <Veil o={0.18} />
      {Array.from({ length: 12 }, (_, i) => {
        const on = ts > 0.15 + i * 0.17;
        return <g key={i} transform={`translate(${690 + i * 49},96)`} opacity={on ? 1 : 0.25}>
          <circle r={19} fill={on ? '#C9D6FF' : '#3A4560'} stroke="#0A0F18" strokeWidth={3} />
          <circle cx={7} cy={-4} r={16} fill="#101828" opacity={on ? 0.85 : 0} />
        </g>;
      })}
      <BigText ts={ts} lines={['12 NGÀY ĐÊM']} y={290} size={118} from={0.3} />
      <Ball id="h1v" x={250} y={850} r={100} flag="VNM" eyes="determined" hat={<MuCoi />} motion={breathe(t, 60, 0.03)} t={t} />
      <DateChip dates={[{ t: 0, label: '18.12.1972' }, { t: 1.2, label: '29.12.1972' }]} t={ts} id="h1d" />
      <MiniMap camera={cam} id="h1m" />
    </Stage>
  );
};

/** H2 (1.4 s): the title card. */
export const H2: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30, k = eout(ts / 0.4), pulse = 1 + 0.015 * Math.sin(ts * 6);
  return (
    <Stage bg="#0B1320">
      <Stars ts={ts} />
      <Glow x={960} y={500} r={620} color="#E2B040" o={0.35 * k} />
      <g transform={`translate(960,470) scale(${pulse * (0.9 + 0.1 * k)}) translate(-960,-470)`} opacity={k}>
        <BigText ts={ts} lines={['ĐIỆN BIÊN PHỦ']} y={420} size={176} fill="#FFD84A" stroke={20} />
        <BigText ts={ts} lines={['TRÊN KHÔNG']} y={620} size={176} fill="#FF6A4A" stroke={20} from={0.15} />
      </g>
      <Ball id="h2v" x={960} y={860} r={96} flag="VNM" eyes="determined" hat={<MuCoi />} motion={breathe(t, 50, 0.04)} t={t} />
    </Stage>
  );
};

/** H3 (3.7 s): map callback, pan from Hà Nội west to Điện Biên Phủ, year 1954. */
const K3: CameraKey[] = [{ t: 0, lon: 105.0, lat: 21.2, zoom: 210 }, { t: 2.6, lon: 103.3, lat: 21.35, zoom: 330 }, { t: 3.7, lon: 103.2, lat: 21.37, zoom: 360, ease: 'linear' }];
export const H3: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30, cam = cameraAt(K3, ts), [px, py] = project(cam, 103.02, 21.39);
  const k = ramp(ts, 1.8, 2.5);
  return (
    <Stage>
      <GeoMap camera={cam} night={0} provinces id="h3">
        <City {...CITIES.hanoi} showLabel />
      </GeoMap>
      <Glow x={px} y={py} r={170 * k} color="#FFD84A" o={0.45 * k} />
      <circle cx={px} cy={py} r={14} fill="#FFD84A" stroke="#0A0F18" strokeWidth={5} opacity={k} />
      <g opacity={k}><rect x={px - 230} y={py - 130} width={460} height={76} rx={18} fill="#15181F" fillOpacity={0.92} stroke="#FFD84A" strokeWidth={4} />
        <text x={px} y={py - 78} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#F4F4F4">Điện Biên Phủ</text></g>
      <Ball id="h3v" x={px + 140} y={py + 120} r={70} flag="VNM" eyes="determined" hat={<MuCoi />} motion={mixMotion(breathe(t, 60, 0.03), hop(t, 40, 14))} t={t} />
      <DateChip label="1954" id="h3d" t={ts} />
      <MiniMap camera={cam} id="h3m" />
    </Stage>
  );
};

/** H4 (3.3 s): the table: France and Việt Nam, a document between them. */
export const H4: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30, cam = { lon: 103.5, lat: 20.5, zoom: 160 + ts * 4 };
  const k = eout(ts / 0.6);
  return (
    <Stage>
      <GeoMap camera={cam} night={0} id="h4" />
      <Veil o={0.62} />
      <BigText ts={ts} lines={['BUỘC PHẢI NGỒI VÀO', 'BÀN KÝ KẾT']} y={250} size={100} from={0.2} />
      <rect x={430} y={800} width={1060} height={44} rx={14} fill="#7A5638" stroke="#1F140B" strokeWidth={5} />
      <rect x={490} y={844} width={34} height={200} fill="#5E4129" /><rect x={1396} y={844} width={34} height={200} fill="#5E4129" />
      <Ball id="h4f" x={640 - (1 - k) * 300} y={690} r={100} flag="FRA" eyes="worried" sweat motion={breathe(t, 64, 0.03)} t={t} />
      <Ball id="h4v" x={1280 + (1 - k) * 300} y={690} r={100} flag="VNM" eyes="determined" hat={<MuCoi />} motion={mixMotion(breathe(t, 60, 0.03), talk(t, ts > 1.6))} t={t} />
      <DocumentProp x={960} y={775} s={1.15} rot={-4} />
      <PenProp x={1060} y={790} s={1.2} rot={-25} />
      <DateChip label="1954" id="h4d" t={ts} />
    </Stage>
  );
};

/** H5 (2.8 s): two agreements side by side: 1954 and 1973, both after a decisive battle. */
export const H5: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30;
  const card = (x: number, year: string, a: string, b: string, from: number, col: string) => {
    const k = eout((ts - from) / 0.55);
    return (
      <g transform={`translate(${x + (x < 960 ? -1 : 1) * (1 - k) * 500},520)`} opacity={k}>
        <rect x={-340} y={-250} width={680} height={500} rx={30} fill="#141C2A" stroke={col} strokeWidth={8} />
        <text y={-110} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={128} fill={col} stroke="#0A0F18" strokeWidth={10} paintOrder="stroke">{year}</text>
        <text y={20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#F4F4F4">{a}</text>
        <text y={110} textAnchor="middle" fontFamily={FONT.title} fontWeight={600} fontSize={48} fill="#E2B95A">{b}</text>
      </g>
    );
  };
  return (
    <Stage bg="#0F1826">
      <Stars ts={ts} />
      {card(500, '1954', 'Điện Biên Phủ', 'Hiệp định Genève', 0.1, '#FFD84A')}
      {card(1420, '1972', 'Hà Nội, 12 ngày đêm', 'Hiệp định Paris', 0.9, '#FF8A5A')}
      <text x={960} y={560} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#F4F4F4" opacity={eout((ts - 1.5) / 0.4)}>→</text>
    </Stage>
  );
};

/** H6 (1.7 s): sunrise, the agreement opens the road to peace. */
export const H6: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30;
  return (
    <Stage>
      <Dawn id="h6" k={ramp(ts, 0, 1.6)} />
      <DocumentProp x={600} y={700} s={2.0} rot={-6 + ts * 2} title="HIỆP ĐỊNH" />
      <BigText ts={ts} lines={['MỞ ĐƯỜNG CHO', 'HÒA BÌNH']} y={300} size={110} from={0.1} />
    </Stage>
  );
};

/** H7 (2.7 s): a lone Việt Nam ball on the road at dawn, long wait. */
export const H7: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30, walk = eio(ts / 2.7);
  return (
    <Stage>
      <Dawn id="h7" k={0.7 + 0.3 * ramp(ts, 0, 2.7)} />
      <path d="M0,1010 L1920,930 L1920,1080 L0,1080 Z" fill="#3A3A44" />
      <path d="M0,1010 L1920,930" stroke="#E8D9A6" strokeWidth={6} strokeDasharray="60 40" />
      <Ball id="h7v" x={520 + walk * 560} y={800 - walk * 40} r={110 - walk * 18} flag="VNM" eyes="normal" look={0.6} hat={<MuCoi />} motion={mixMotion(breathe(t, 56, 0.03), hop(t, 22, 12))} t={t} />
      <BigText ts={ts} lines={['ĐÃ CHỜ ĐỢI RẤT LÂU']} y={250} size={100} from={0.2} />
      <LowerThird title="Hòa bình mà Việt Nam mong chờ" from={0.6} t={ts} />
    </Stage>
  );
};
