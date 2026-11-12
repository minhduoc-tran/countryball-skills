import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { Ball } from '../../countryball/countryball';
import { UsafCap } from '../../countryball/ball-accessories';
import { DocumentProp } from '../../countryball/ball-speech-and-props';
import { breathe, mixMotion, shake } from '../../countryball/ball-motion';
import { PhotoCard } from '../../countryball/photo-card';
import { ShellBarrage } from '../../countryball/ground-artillery';
import { FlightPath } from '../../countryball/fx-flight-path';
import { BombCarpet } from '../../countryball/fx-bomb-carpet';
import { fmtVi } from '../../countryball/hud-counter';
import { cameraOnCitadel, M_PER_DEG, citadelScreen } from '../../countryball/citadel-geometry';
import { project } from '../../countryball/geo-camera';
import { CAMERAS } from '../../countryball/quang-tri-camera-keys';
import { clamp, easeInOut, easeOut, hash, prog } from '../../countryball/fx-math';
import { Backdrop, Chip, CREDIT, dmgAt, drift, MapHud, Plan, Pop, QtMap, ramp, sec, SRC_US, SRC_VN, Txt, Cell, Vignette } from './chd-common';
import { BombIcon, ShellIcon } from './chd-icons';

// Chapter D, beat "14 tonnage" (D1-D8, 5:01-5:21): one small citadel, the density of fire, 81 days, 328.000 tấn (Theo phía
// Việt Nam), the US gives no separate figure, July: 2.000+ B-52 sorties (Theo tài liệu phía Mỹ).

// ---------- D1: the small citadel with a 480 m scale bar ----------
export const D1: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(0, 0, 1.4), cameraOnCitadel(0, 0, 1.0), len / 30), ppm = cam.zoom / M_PER_DEG, w = 480 * ppm;
  return (
    <g>
      <Plan id="d1" cam={cam} t={t} damage={dmgAt(0)} labels={['citadel']} />
      <Vignette id="d1" o={0.5} />
      <Txt x={960} y={170} text="MỘT TÒA THÀNH NHỎ" size={116} o={ramp(s, 0.1, 0.4)} />
      <g opacity={ramp(s, 0.4, 0.8)} transform="translate(0,-4)">
        <path d={`M${1760 - w},960 v-18 M${1760},960 v-18 M${1760 - w},951 H1760`} stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" />
        <Txt x={1760 - w / 2} y={930} text="≈ 480 m" size={44} />
      </g>
    </g>
  );
};

// ---------- D2: shells and aircraft converge on the square ----------
export const D2: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraOnCitadel(0, 0, 0.5), c = citadelScreen(cam, 0, 0);
  const dirs: [number, number][] = [[-250, 80], [2150, 140], [-250, 1000], [2150, 980], [960, -250], [960, 1330]];
  return (
    <g>
      <Plan id="d2" cam={cam} t={t} damage={dmgAt(0, 0.3, 0.34, 4)} />
      {dirs.map((d, i) => <ShellBarrage key={i} id={`d2s${i}`} t={t} t0={4 + i * 6} from={d} to={c} n={9} span={60} spread={[120, 90]} dur={30} lift={150} r={30} seed={i + 2} />)}
      <FlightPath id="d2f" t={t} t0={8} t1={70} kind="f4" size={110} points={[[-120, 880], [700, 640], [1300, 420], [2100, 250]]} />
      <FlightPath id="d2g" t={t} t0={26} t1={86} kind="f4" size={110} points={[[2100, 880], [1300, 650], [800, 470], [-120, 220]]} />
      <Vignette id="d2" o={0.45} />
      <Txt x={960} y={150} text="HỎA LỰC DỒN XUỐNG" size={112} o={ramp(s, 0.1, 0.4)} />
      <Txt x={960} y={980} text="MẬT ĐỘ HIẾM THẤY" size={112} color="#E2B95A" o={ramp(s, 1.2, 1.5)} />
    </g>
  );
};

// ---------- D3: 81 day-and-night cells ----------
export const D3: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), size = 58, gap = 8;
  return (
    <g>
      <Backdrop s={s} id="d3" />
      {Array.from({ length: 81 }, (_, i) => {
        const a = 0.05 + i * 0.016, k = easeOut(ramp(s, a, a + 0.18)), x = 150 + (i % 9) * (size + gap), y = 230 + Math.floor(i / 9) * (size + gap);
        if (k <= 0) return null;
        return (
          <g key={i} transform={`translate(${x + size / 2},${y + size / 2}) scale(${k})`}>
            <path d={`M${-size / 2},${-size / 2} H${size / 2} V${size / 2} Z`} fill="#FFD166" /><path d={`M${-size / 2},${-size / 2} V${size / 2} H${size / 2} Z`} fill="#2C3F66" />
            <rect x={-size / 2} y={-size / 2} width={size} height={size} rx={6} fill="none" stroke="#0A121C" strokeWidth={4} />
          </g>
        );
      })}
      <Txt x={1300} y={560} text="81" size={400} color="#E2B95A" o={ramp(s, 0.5, 0.8)} />
      <Txt x={1300} y={700} text="NGÀY ĐÊM" size={120} o={ramp(s, 0.9, 1.2)} />
      <Pop s={s} at={1.5} x={1300} y={810}><Chip x={1300} y={810} text={SRC_VN} size={46} /></Pop>
    </g>
  );
};

// ---------- D4: the town and the citadel under the barrage ----------
export const D4: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(120, 60, 0.2), cameraOnCitadel(40, 20, 0.3), len / 30), c = citadelScreen(cam, 0, 0);
  return (
    <g>
      <Plan id="d4" cam={cam} t={t} damage={dmgAt(0, 0.34, 0.38, 3)} night={0} />
      <ShellBarrage id="d4a" t={t} t0={2} from={[2100, 200]} to={[c[0] + 230, c[1] + 120]} n={9} span={40} spread={[260, 160]} dur={30} lift={140} r={22} />
      <ShellBarrage id="d4b" t={t} t0={8} from={[-200, 300]} to={c} n={8} span={36} spread={[110, 90]} dur={30} lift={140} r={22} seed={5} />
      <Txt x={c[0] + 330} y={c[1] + 240} text="THỊ XÃ" size={74} o={ramp(s, 0.1, 0.35)} />
      <Txt x={c[0] - 40} y={c[1] - 150} text="THÀNH CỔ" size={74} color="#E2B95A" o={ramp(s, 0.3, 0.55)} />
    </g>
  );
};

// ---------- D5: 328.000 tấn ----------
export const D5: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), v = 328000 * easeInOut(ramp(s, 0.1, 1.9)), fall = (i: number, sp: number) => ((hash(i, 2) * 1300 + s * sp) % 1300) - 110;
  return (
    <g>
      <Backdrop s={s} id="d5" top="#2A1712" bottom="#0A0A0E" grid={false} />
      {Array.from({ length: 34 }, (_, i) => {
        const x = hash(i, 1) * 1920, y = fall(i, 420 + hash(i, 3) * 380);
        return i % 3 ? <BombIcon key={i} x={x} y={y} s={0.9 + hash(i, 4)} o={0.5} /> : <ShellIcon key={i} x={x} y={y} s={0.9 + hash(i, 4)} rot={180} o={0.5} />;
      })}
      <Txt x={960} y={520} text={fmtVi(v)} size={290} color="#FFE3A0" />
      <Txt x={960} y={680} text="TẤN BOM ĐẠN" size={130} />
      <Pop s={s} at={1.4} x={960} y={830}><Chip x={960} y={830} text={SRC_VN} size={50} /></Pop>
    </g>
  );
};

// ---------- D6: the US gives no separate figure ----------
export const D6: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), stamp = ramp(s, 1.0, 1.15);
  return (
    <g>
      <Backdrop s={s} id="d6" top="#18283E" bottom="#080F1A" />
      <Txt x={960} y={150} text="PHÍA MỸ" size={104} color="#8FB4E8" o={ramp(s, 0.05, 0.3)} />
      <Ball id="d6b" x={560} y={640} r={170} flag="USA" eyes="worried" hat={<UsafCap />} t={t} motion={mixMotion(breathe(t, 70, 0.03), shake(t, 30, 5, 20))} />
      <g transform={`translate(1230,600) rotate(${-4 + Math.sin(s * 1.5) * 1.2})`}>
        <DocumentProp x={0} y={0} s={4.4} title="SỐ LIỆU" />
        <text x={0} y={20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={190} fill="#C9343A" opacity={ramp(s, 0.5, 0.8)}>?</text>
      </g>
      {stamp > 0 && <g transform={`translate(1230,760) rotate(-8) scale(${1.5 - 0.5 * easeOut(stamp)})`} opacity={stamp}>
        <rect x={-330} y={-62} width={660} height={124} rx={12} fill="#0D1520" fillOpacity={0.55} stroke="#E0483C" strokeWidth={10} />
        <text y={26} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#E0483C">KHÔNG CÔNG BỐ RIÊNG</text>
      </g>}
      <Txt x={1230} y={990} text="con số cho Thành cổ" size={64} o={ramp(s, 1.3, 1.6)} />
    </g>
  );
};

// ---------- D7: US documents, July (B-52 photo + calendar page) ----------
export const D7: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="d7" />
      <PhotoCard t={s} src="quang-tri-81-ngay-dem/img/boeing-b-52-dropping-bombs.jpg" caption="B-52 thả bom" credit={CREDIT.usaf}
        x={560} y={540} w={700} h={525} rot={-2.5} from={-0.4} to={len / 30 + 0.5} id="d7p" kb={{ z0: 1.04, z1: 1.16, px0: 0.01, px1: -0.02 }} />
      <g transform="translate(1440,520)" opacity={ramp(s, 0.2, 0.5)}>
        <rect x={-250} y={-300} width={500} height={580} rx={18} fill="#F6F0DC" stroke="#0A121C" strokeWidth={6} />
        <rect x={-250} y={-300} width={500} height={120} rx={18} fill="#C9343A" stroke="#0A121C" strokeWidth={6} />
        <text y={-210} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={66} fill="#fff">THÁNG 7 / 1972</text>
        {Array.from({ length: 31 }, (_, i) => {
          const k = ramp(s, 0.5 + i * 0.025, 0.65 + i * 0.025);
          return <g key={i} transform={`translate(${-220 + (i % 7) * 64},${-130 + Math.floor(i / 7) * 74})`}>
            <rect width={56} height={60} rx={8} fill="#E8E0C8" /><rect width={56} height={60} rx={8} fill="#3F5C8C" opacity={k} />
            <text x={28} y={40} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill={k > 0.5 ? '#fff' : '#555'}>{i + 1}</text>
          </g>;
        })}
      </g>
      <Pop s={s} at={0.9} x={1440} y={900}><Chip x={1440} y={900} text={SRC_US} size={44} /></Pop>
    </g>
  );
};

// ---------- D8: 2.000+ B-52 sorties over the front (night map) ----------
export const D8: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, { lon: 107.17, lat: 16.79, zoom: 5200 }, { lon: 107.19, lat: 16.77, zoom: 6600 }, len / 30);
  const c = project(cam, 107.1896, 16.7539), lanes = [-140, 0, 140];
  const n = Math.round(2000 * easeOut(ramp(s, 0.2, 2.6)));
  return (
    <g>
      <QtMap id="d8" camera={cam} night={0.5} />
      {lanes.map((l, i) => (
        <g key={i}>
          <Cell id={`d8c${i}`} t={t} t0={i * 22} t1={i * 22 + 130} size={70} points={[[c[0] + 1300, c[1] - 360 + l], [c[0] + 20, c[1] + l * 0.3], [c[0] - 1200, c[1] + 400 + l]]} />
          <BombCarpet id={`d8b${i}`} t={t} t0={i * 22 + 56} from={[c[0] + 160, c[1] - 40 + l * 0.5]} to={[c[0] - 160, c[1] + 60 + l * 0.5]} dur={26} n={9} width={90} r={26} seed={i + 1} />
        </g>
      ))}
      <Vignette id="d8" o={0.4} />
      <Txt x={960} y={170} text={`${fmtVi(n)}+`} size={210} color="#FFE3A0" />
      <Txt x={960} y={260} text="LƯỢT B-52 XUẤT KÍCH" size={72} />
      <Pop s={s} at={1.2} x={960} y={350}><Chip x={960} y={350} text={`${SRC_US} · tháng 7`} size={40} /></Pop>
      <MapHud s={s} cam={cam} dates={[{ t: 0, label: '07.1972' }]} />
    </g>
  );
};
