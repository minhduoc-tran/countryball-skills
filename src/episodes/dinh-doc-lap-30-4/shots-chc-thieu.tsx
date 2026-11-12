import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { Beret, M1Helmet } from '../../countryball/ball-accessories-military';
import { breathe, hop, mixMotion, talk } from '../../countryball/ball-motion';
import { DocumentProp } from '../../countryball/ball-speech-and-props';
import { PhotoCard } from '../../countryball/photo-card';
import { DateChip } from '../../countryball/hud-date-chip';
import { MiniMap } from '../../countryball/hud-minimap';
import { GeoMap } from '../../countryball/map-geo-map';
import { City, CITIES } from '../../countryball/map-labels';
import { cameraAt, project } from '../../countryball/geo-camera';
import { backOut, easeInOut, easeOut } from '../../countryball/fx-math';
import { Backdrop, credit, GOLD, IMG, LAND, NameCard, Pop, ramp, sec, Silhouette, Txt } from './chc-common';
import { AirlinerTop, SpeechLines, TvSet } from './chc-icons';

// Chapter C, beat "4c thieu" (C1-C5, 167.7-179.8 s): 21.04.1975 Thiệu resigns (photo + stamp), the long TV speech, he blames the US for a broken
// promise to its ally, Trần Văn Hương takes over (name card, no face), Thiệu leaves Việt Nam (plane over the sea). No quotes on screen.

// ---------- C1: 21.04.1975 "TỪ CHỨC": the 1966 portrait + stamp ----------
export const C1: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), k = backOut(ramp(s, 1.0, 1.3));
  return (
    <g>
      <Backdrop s={s} id="c1" />
      <PhotoCard t={s} src={`${IMG}nguyen-van-thieu-1966.jpg`} caption="Nguyễn Văn Thiệu, 1966" credit={credit('Yoichi Okamoto, White House', 'Public domain')}
        x={640} y={570} w={430} h={626} rot={-2.5} from={0.1} to={s + 2} id="c1p" kb={{ z0: 1.0, z1: 1.1, px0: 0, py0: 0.02, px1: 0, py1: -0.02 }} fromSide="left" />
      <Pop s={s} at={0.5} x={1330} y={330}><Txt x={1330} y={300} text="TỔNG THỐNG" size={54} color={GOLD} /></Pop>
      <Pop s={s} at={0.65} x={1330} y={420}><Txt x={1330} y={410} text="NGUYỄN VĂN THIỆU" size={80} /></Pop>
      <g transform={`translate(1330,640) rotate(-7) scale(${0.4 + 0.6 * k})`} opacity={k > 0.02 ? 1 : 0}>
        <rect x={-300} y={-90} width={600} height={180} rx={18} fill="#B3262B" fillOpacity={0.9} stroke="#F4E6C8" strokeWidth={8} />
        <rect x={-282} y={-72} width={564} height={144} rx={10} fill="none" stroke="#F4E6C8" strokeWidth={4} />
        <Txt x={0} y={36} text="TỪ CHỨC" size={112} stroke="none" />
      </g>
      <DateChip label="21.04.1975" t={s} />
    </g>
  );
};

// ---------- C2: the long speech on television ----------
export const C2: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="c2" />
      <Txt x={1230} y={120} text="BÀI PHÁT BIỂU DÀI TRÊN TRUYỀN HÌNH" size={56} o={ramp(s, 0.05, 0.3)} />
      <g transform={`translate(0,${(1 - easeOut(ramp(s, 0, 0.4))) * 60})`} opacity={ramp(s, 0, 0.25)}><TvSet id="c2tv" x={620} y={590} w={800} s={s} /></g>
      <SpeechLines x={1130} y={260} s={s} at={0.2} n={10} w={680} />
      <DateChip label="21.04.1975" t={s} />
    </g>
  );
};

// ---------- C3: he blames the US: a promise to the ally, the USA ball turns away ----------
export const C3: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), away = easeInOut(ramp(s, 0.6, 2.4));
  return (
    <g>
      <Backdrop s={s} id="c3" />
      <Txt x={960} y={150} text="TRÁCH MỸ" size={104} o={ramp(s, 0.05, 0.3)} />
      <Txt x={960} y={236} text="không giữ lời hứa với đồng minh" size={56} color={GOLD} o={ramp(s, 0.25, 0.55)} />
      <Ball id="c3r" x={1420} y={640} r={150} flag="RVN" eyes="sad" hat={<Beret color="#4A5A34" badge="none" />} t={t} motion={breathe(t, 74, 0.03, 8)} />
      <Ball id="c3u" x={560 - away * 330} y={640} r={150} flag="USA" eyes="worried" look={away * 0.8} hat={<M1Helmet color="#58663C" />} t={t}
        motion={mixMotion(breathe(t, 66, 0.03), talk(t, s < 1.2))} />
      <g opacity={1 - 0.5 * away}><DocumentProp x={990} y={640} s={2.1} rot={-6 + 4 * Math.sin(t * 0.08)} title="LỜI HỨA" /></g>
      <Txt x={1420} y={870} text="VNCH · ĐỒNG MINH" size={42} color="#F2C230" o={ramp(s, 0.4, 0.7)} />
      <Txt x={560 - away * 330} y={870} text="HOA KỲ" size={42} color="#8EB4E8" o={ramp(s, 0.4, 0.7)} />
      <DateChip label="21.04.1975" t={s} />
    </g>
  );
};

// ---------- C4: Trần Văn Hương takes over ----------
export const C4: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), up = easeOut(ramp(s, 0.9, 1.5));
  return (
    <g>
      <Backdrop s={s} id="c4" />
      <NameCard id="c4n" x={960} y={450} rank="PHÓ TỔNG THỐNG" name="TRẦN VĂN HƯƠNG" sub="Phó Tổng thống VNCH" s={s} at={0.15} />
      <g transform={`translate(960,${790 + (1 - up) * 40})`} opacity={up}>
        <polygon points="-34,-4 0,-52 34,-4 14,-4 14,40 -14,40 -14,-4" fill={GOLD} stroke="#15151A" strokeWidth={5} strokeLinejoin="round" transform="translate(-300,-6)" />
        <Txt x={30} y={30} text="LÊN THAY" size={84} />
      </g>
      <DateChip label="21.04.1975" t={s} />
    </g>
  );
};

// ---------- C5: "vài ngày sau, ông Thiệu rời Việt Nam": a plane leaves Sài Gòn over the sea ----------
export const C5: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, lon: 107.5, lat: 11.1, zoom: 340 }, { t: 3, lon: 107.7, lat: 11.0, zoom: 360, ease: 'linear' }], s);
  const [sx, sy] = project(cam, 106.7, 10.8), u = easeInOut(ramp(s, 0.35, 2.2));
  const p0 = [sx, sy], p1 = [sx + 430, sy - 40], p2 = [1790, 250];
  const at = (k: number) => [(1 - k) * (1 - k) * p0[0] + 2 * (1 - k) * k * p1[0] + k * k * p2[0], (1 - k) * (1 - k) * p0[1] + 2 * (1 - k) * k * p1[1] + k * k * p2[1]];
  const [px, py] = at(u), [qx, qy] = at(Math.min(1, u + 0.02)), rot = (Math.atan2(qy - py, qx - px) * 180) / Math.PI;
  const trail = Array.from({ length: 24 }, (_, i) => at((u * i) / 23)).map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' ');
  return (
    <g>
      <GeoMap camera={cam} id="c5m" colors={LAND}><City {...CITIES.saigon} size={38} /></GeoMap>
      <polyline points={trail} fill="none" stroke="#F4F4F4" strokeWidth={7} strokeDasharray="4 18" strokeLinecap="round" opacity={0.9} />
      <AirlinerTop x={px} y={py} len={150 + 60 * u} rot={rot} />
      <Txt x={960} y={130} text="ÔNG THIỆU RỜI VIỆT NAM" size={72} o={ramp(s, 0.05, 0.35)} />
      <MiniMap camera={cam} id="c5mini" />
    </g>
  );
};
