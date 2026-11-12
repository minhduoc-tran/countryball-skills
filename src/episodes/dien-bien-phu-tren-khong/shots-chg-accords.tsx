import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { cameraAt, project } from '../../countryball/geo-camera';
import { GeoMap } from '../../countryball/map-geo-map';
import { CITIES, City, HANOI_SITES } from '../../countryball/map-labels';
import { Counter, countAt, fmtVi } from '../../countryball/hud-counter';
import { DateChip } from '../../countryball/hud-date-chip';
import { LowerThird } from '../../countryball/hud-chips';
import { MiniMap } from '../../countryball/hud-minimap';
import { PhotoCard } from '../../countryball/photo-card';
import { Ball } from '../../countryball/countryball';
import { MuCoi, UsafCap } from '../../countryball/ball-accessories';
import { breathe, hop, mixMotion } from '../../countryball/ball-motion';
import { DocumentProp } from '../../countryball/ball-speech-and-props';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { DimMap, Person, Txt, drift, fade, pop, ramp, sec, GOLD, INK, USA_BLUE, VNM_RED } from './chg-common';

// Chapter G, part 3 (G25-G32, 668.24-695.66 s): the Paris Accords signed, 60 days, POWs, Homecoming from Gia Lâm.

const IMG = 'dien-bien-phu-tren-khong/img/';
const PARIS = drift(2.35, 48.86, 180, 0, 0, 1.1, 5);
const GIA_LAM = drift(105.89, 21.04, 900, 0, 0, 1.05, 8);

export const G25: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <DimMap s={s} id="g25" keys={PARIS} dim={0.7} />
      <DateChip label="27.01.1973" t={s} />
      <PhotoCard src={`${IMG}vietnam-peace-agreement-signing.jpg`} caption="Lễ ký Hiệp định Paris, 27.1.1973" credit="Ảnh: Robert L. Knudsen / White House / Public domain"
        x={960} y={520} w={900} h={610} rot={-2} from={0.05} t={s} id="g25p" fromSide="bottom" />
    </g>
  );
};

export const G26: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  const k = pop(s, 0.2, 0.5), st = pop(s, 0.9, 0.3);
  return (
    <g>
      <DimMap s={s} id="g26" keys={PARIS} dim={0.74} />
      <DateChip label="27.01.1973" t={s} />
      <Txt x={960} y={170} size={78} o={fade(s, 0.1)}>HIỆP ĐỊNH PARIS</Txt>
      <g transform={`translate(960,590) scale(${Math.max(0.001, 3.6 * k)})`}><DocumentProp x={0} y={0} title="HIỆP ĐỊNH" /></g>
      <g transform={`translate(1130,640) rotate(-14) scale(${Math.max(0, st)})`} opacity={Math.min(1, st * 2)}>
        <rect x={-150} y={-52} width={300} height={104} rx={14} fill="#15181F" fillOpacity={0.85} stroke="#3E9B5B" strokeWidth={10} />
        <text y={24} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={66} fill="#58C47A">ĐÃ KÝ</text>
      </g>
    </g>
  );
};

export const G27: React.FC<ShotProps> = ({ t, f }) => {
  const s = sec(t);
  const cam = cameraAt([{ t: 0, lon: 109.5, lat: 14.5, zoom: 62, ease: 'linear' }, { t: 4.1, lon: 110.2, lat: 14.5, zoom: 56, ease: 'linear' }], s);
  const starts: [number, number][] = [[108.22, 16.05], [106.7, 10.78], [108.9, 13.8], [107.5, 12.0]];
  const steps = [{ t: 2.2, value: 0 }, { t: 2.9, value: 60 }];
  return (
    <g>
      <GeoMap camera={cam} highlight={['VNM']} id="g27"><City {...CITIES.hanoi} /><City {...CITIES.danang} /><City {...CITIES.saigon} /></GeoMap>
      <rect width={1920} height={1080} fill="#07101B" opacity={0.22} />
      {starts.map(([lon, lat], i) => {
        const [x0, y0] = project(cam, lon, lat), u = ramp(s, 0.4 + i * 0.25, 3.6);
        const dx = 300 + i * 40, x = x0 + dx * u, y = y0 - 10 * Math.sin(u * 3);
        return <Ball key={i} id={`g27b${i}`} x={x} y={y} r={36} flag="USA" eyes="normal" hat={<UsafCap />} t={f} motion={hop(f, 20, 10, i * 5)} shadow={false} look={1} />;
      })}
      <path d="M1180,600 Q1450,540 1760,600" fill="none" stroke={GOLD} strokeWidth={8} strokeDasharray="4 18" strokeLinecap="round" opacity={fade(s, 0.6)} />
      <polygon points="1760,570 1830,605 1752,640" fill={GOLD} opacity={fade(s, 0.6)} />
      <DateChip label="27.01.1973" t={s} />
      <Counter label="RÚT QUÂN TRONG" unit="ngày" value={fmtVi(countAt(steps, s))} steps={steps} t={s} />
      <LowerThird title="Mỹ rút toàn bộ quân đội" sub="Cam kết trong Hiệp định Paris" from={0.2} to={3.9} t={s} />
      <MiniMap camera={cam} />
    </g>
  );
};

export const G28: React.FC<ShotProps> = ({ t, f }) => {
  const s = sec(t);
  const steps = [{ t: 1.6, value: 0 }, { t: 2.6, value: 591 }];
  const lane = (y: number, dir: 1 | -1, color: string, n: number, off: number) => Array.from({ length: n }, (_, i) => {
    const p = ((s * 150 + i * 150 + off) % 900) / 900, x = dir === 1 ? 510 + p * 900 : 1410 - p * 900;
    return <Person key={`${y}${i}`} x={x} y={y} s={1.1} color={color} bob={Math.sin(s * 9 + i * 1.7) * 5} />;
  });
  return (
    <g>
      <DimMap s={s} id="g28" keys={drift(105.9, 21, 120, 0, 0, 1.1, 5)} dim={0.8} cities={false} />
      <Txt x={960} y={170} size={74} o={fade(s, 0.1)}>TÙ BINH HAI BÊN</Txt>
      <Txt x={960} y={250} size={54} fill={GOLD} o={fade(s, 0.35)}>ĐƯỢC TRAO TRẢ</Txt>
      <Ball id="g28a" x={250} y={600} r={110} flag="VNM" eyes="normal" hat={<MuCoi />} t={f} motion={breathe(f, 70, 0.03)} look={1} />
      <Ball id="g28b" x={1670} y={600} r={110} flag="USA" eyes="normal" hat={<UsafCap />} t={f} motion={breathe(f, 70, 0.03, 30)} look={-1} />
      <line x1={960} y1={330} x2={960} y2={880} stroke="#C9D6FF" strokeWidth={5} strokeDasharray="14 14" opacity={0.6} />
      <g opacity={fade(s, 0.4)}>{lane(660, 1, USA_BLUE, 6, 0)}{lane(790, -1, VNM_RED, 6, 90)}</g>
      <Counter label="TÙ BINH MỸ" value={fmtVi(countAt(steps, s))} steps={steps} t={s} accent="#3F6FA8" />
    </g>
  );
};

export const G29: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  const u = ramp(s, 2.6, 4.0);
  return (
    <g>
      <DimMap s={s} id="g29" keys={drift(105.85, 21.03, 230, 0.02, 0, 1.15, 5)} dim={0.66} night={0.3} />
      <PhotoCard src={`${IMG}hoa-lo-1973.jpg`} caption="Nhà tù Hỏa Lò, Hà Nội (ảnh trinh sát 1970)" credit="Ảnh: U.S. Air Force / Public domain"
        x={600} y={520} w={700} h={556} rot={-2.5} from={0.05} t={s} id="g29p" fromSide="left" />
      <Txt x={1400} y={250} size={78} o={fade(s, 0.15)}>NHIỀU PHI CÔNG</Txt>
      <Txt x={1400} y={340} size={78} fill={GOLD} o={fade(s, 0.45)}>B-52 BỊ BẮN RƠI</Txt>
      <Txt x={1400} y={430} size={52} fill="#C9D6FF" o={fade(s, 2.4)}>trên bầu trời Hà Nội</Txt>
      <AircraftTop id="g29p52" kind="b52" x={1160 + 460 * u} y={620 + 230 * u * u} size={150} heading={-15 + 75 * u} opacity={fade(s, 0.6)} />
    </g>
  );
};

export const G30: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  const cam = cameraAt([{ t: 0, lon: 105.86, lat: 21.03, zoom: 260 }, { t: 2.8, lon: 105.89, lat: 21.04, zoom: 900 }], s);
  return (
    <g>
      <GeoMap camera={cam} highlight={['Hà Nội']} provinces id="g30">
        <City {...CITIES.hanoi} maxZoom={500} />
        <City {...HANOI_SITES.giaLam} minZoom={500} size={30} />
      </GeoMap>
      <rect width={1920} height={1080} fill="#07101B" opacity={0.28} />
      <DateChip label="12.02.1973" t={s} />
      <LowerThird title="Sân bay Gia Lâm, Hà Nội" sub="Nơi những chuyến trao trả khởi hành" from={0.7} to={3.4} t={s} />
      <MiniMap camera={cam} />
    </g>
  );
};

export const G31: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <DimMap s={s} id="g31" keys={GIA_LAM} dim={0.62} cities={false} />
      <DateChip label="12.02.1973" t={s} />
      <PhotoCard src={`${IMG}pows-await-gia-lam.jpg`} caption="Tù binh Mỹ chờ trao trả ở sân bay Gia Lâm" credit="Ảnh: U.S. Air Force / Public domain"
        x={600} y={540} w={760} h={609} rot={2} from={0.05} t={s} id="g31p" fromSide="left" />
      <Txt x={1420} y={330} size={66} o={fade(s, 0.4)}>NHỮNG TÙ BINH MỸ</Txt>
      <Txt x={1420} y={410} size={66} o={fade(s, 0.6)}>ĐẦU TIÊN</Txt>
      <Txt x={1420} y={520} size={86} fill={GOLD} o={fade(s, 1.3)} dy={(1 - fade(s, 1.3)) * 30}>RỜI HÀ NỘI</Txt>
    </g>
  );
};

export const G32: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  const k = pop(s, 2.52, 0.5);
  return (
    <g>
      <DimMap s={s} id="g32" keys={GIA_LAM} dim={0.62} cities={false} />
      <PhotoCard src={`${IMG}pows-gia-lam-1973.jpg`} caption="Tù binh Mỹ được trao trả ở Gia Lâm" credit="Ảnh: U.S. Air Force / Public domain"
        x={600} y={540} w={700} h={603} rot={-2} from={0.05} t={s} id="g32p" fromSide="right" />
      <Txt x={1420} y={330} size={56} fill="#C9D6FF" o={fade(s, 1.4)}>NGƯỜI MỸ GỌI LÀ</Txt>
      <g transform={`translate(1420,480) scale(${Math.max(0.001, k)})`}><Txt x={0} y={0} size={112} fill={GOLD}>HOMECOMING</Txt></g>
      <Txt x={1420} y={620} size={72} o={fade(s, 4.0, 0.4)} dy={(1 - fade(s, 4.0, 0.4)) * 24}>trở về nhà</Txt>
      <rect x={1140} y={650} width={560 * ramp(s, 4.0, 4.3)} height={8} rx={4} fill="#C9343A" opacity={0.9} />
      <text x={56} y={1046} fontSize={21} fontFamily={FONT.ui} fill="#CBD5DF" stroke={INK} strokeWidth={5} paintOrder="stroke" opacity={0.9}>Nguồn: Wikipedia, Operation Homecoming; DVIDS</text>
    </g>
  );
};
