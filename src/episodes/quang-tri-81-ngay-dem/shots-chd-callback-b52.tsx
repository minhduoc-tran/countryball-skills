import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { AircraftSide } from '../../countryball/aircraft-side-view';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { BombCarpet } from '../../countryball/fx-bomb-carpet';
import { CraterField } from '../../countryball/ground-weather-and-smoke';
import { PhotoCard } from '../../countryball/photo-card';
import { cameraOnCitadel, citadelScreen, M_PER_DEG } from '../../countryball/citadel-geometry';
import { DmzBand, QuangTriLabels, QuangTriSites } from '../../countryball/quang-tri-map-labels';
import { easeOut, hash, backOut } from '../../countryball/fx-math';
import { Backdrop, Cell, Chip, CREDIT, dmgAt, drift, MapHud, Plan, Pop, QtMap, ramp, sec, Txt, Dim } from './chd-common';
import { BombIcon } from './chd-icons';

// Chapter D, beat "16b callback" (D19-D24, 5:47-6:00): nod to the channel's Điện Biên Phủ episode, B-52 close-ups, tonnes of bombs,
// a cell of three, the carpet footprint (a few km) and the field of craters (Arc Light photo).

// ---------- D19: "Xem tập: Điện Biên Phủ trên không" ----------
export const D19: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), k = backOut(ramp(s, 0.1, 0.55)), bob = Math.sin(s * 1.6) * 6;
  return (
    <g>
      <Backdrop s={s} id="d19" />
      <g transform={`translate(960,470) scale(${k}) rotate(${-1.5 + Math.sin(s) })`}>
        <defs><clipPath id="d19-clip"><rect x={-450} y={-253} width={900} height={506} rx={22} /></clipPath><linearGradient id="d19-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0A1222" /><stop offset="1" stopColor="#35496B" /></linearGradient></defs>
        <rect x={-462} y={-265} width={924} height={530} rx={30} fill="#0A121C" stroke="#E2B95A" strokeWidth={6} />
        <g clipPath="url(#d19-clip)">
          <rect x={-450} y={-253} width={900} height={506} fill="url(#d19-sky)" />
          {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={-430 + hash(i, 1) * 860} cy={-240 + hash(i, 2) * 300} r={1.5 + 2 * hash(i, 3)} fill="#fff" opacity={0.7} />)}
          <AircraftSide kind="b52" x={-40 + 30 * Math.sin(s * 0.8)} y={-30 + bob} size={640} pitch={2} variant="D" />
          <rect x={-450} y={120} width={900} height={133} fill="#0A121C" opacity={0.78} />
          <text y={205} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill="#fff">ĐIỆN BIÊN PHỦ TRÊN KHÔNG</text>
        </g>
        <circle cx={0} cy={-40} r={64} fill="#15181F" fillOpacity={0.72} stroke="#fff" strokeWidth={6} /><path d="M-18,-72 L40,-40 L-18,-8 Z" fill="#fff" />
      </g>
      <Pop s={s} at={0.8} x={960} y={880}><Chip x={960} y={880} text="Xem tập: Điện Biên Phủ trên không" size={42} /></Pop>
    </g>
  );
};

// ---------- D20: the B-52 ----------
export const D20: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), x = 780 + 230 * easeOut(ramp(s, 0, 3)), bob = Math.sin(s * 2.1) * 8;
  return (
    <g>
      <Backdrop s={s * 3} id="d20" top="#070E1B" bottom="#22344F" grid={false} />
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={((hash(i, 1) * 2100 - s * (10 + hash(i, 2) * 40) + 2100) % 2000) - 40} cy={hash(i, 3) * 700} r={1.5 + hash(i, 4) * 2.2} fill="#FFF" opacity={0.3 + 0.5 * hash(i, 5)} />)}
      {[0, 1, 2].map((i) => <rect key={i} x={((i * 700 - s * (500 + i * 220)) % 2400 + 2400) % 2400 - 400} y={430 + i * 150} width={420 + i * 120} height={4} rx={2} fill="#9DB6D6" opacity={0.18} />)}
      <AircraftSide kind="b52" x={x} y={640 + bob} size={1400} pitch={1.5 + Math.sin(s * 1.3)} variant="D" />
      <Txt x={960} y={250} text="B-52" size={200} o={ramp(s, 0.2, 0.5)} />
      <Txt x={960} y={940} text="PHÁO ĐÀI BAY" size={96} color="#E2B95A" o={ramp(s, 1.4, 1.7)} />
    </g>
  );
};

// ---------- D21: tens of tonnes of bombs ----------
export const D21: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="d21" top="#16233A" bottom="#080E18" />
      {Array.from({ length: 34 }, (_, i) => {
        const t0 = 0.05 + i * 0.045, a = s - t0, y = 340 + a * 520 * (1 + 0.15 * hash(i, 3));
        return a < 0 || y > 1120 ? null : <BombIcon key={i} x={600 + (i % 10) * 76 + 30 * hash(i, 1)} y={y} s={1.15} />;
      })}
      <AircraftTop id="d21p" kind="b52" x={960} y={290} size={860} heading={0} />
      <Txt x={960} y={980} text="HÀNG CHỤC TẤN BOM" size={118} color="#FFE3A0" o={ramp(s, 0.2, 0.5)} />
    </g>
  );
};

// ---------- D22: a cell of three ----------
export const D22: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, { lon: 107.0, lat: 16.9, zoom: 2800 }, { lon: 107.06, lat: 16.88, zoom: 3300 }, len / 30);
  return (
    <g>
      <QtMap id="d22" camera={cam} night={0.55}><DmzBand /><QuangTriLabels /><QuangTriSites only={['quangTri', 'dongHa']} /></QtMap>
      <Cell id="d22c" t={t} t0={0} t1={len - 4} size={150} points={[[-250, 800], [800, 560], [2200, 330]]} trailLen={520} />
      <Txt x={960} y={170} text="MỖI TỐP 3 CHIẾC" size={120} o={ramp(s, 0.1, 0.4)} />
      <MapHud s={s} cam={cam} dates={[{ t: 0, label: '1972' }]} />
    </g>
  );
};

// ---------- D23: the carpet footprint, a few km ----------
export const D23: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(20, 0, 0.22), cameraOnCitadel(0, 0, 0.26), len / 30), c = citadelScreen(cam, 0, 0);
  const k = cam.zoom / M_PER_DEG, L = 3000 * k;                       // 3 km in px
  const a: [number, number] = [c[0] - L / 2, c[1] + 90], b: [number, number] = [c[0] + L / 2, c[1] - 70];
  const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  return (
    <g>
      <Plan id="d23" cam={cam} t={t} damage={0.62} night={0.6} fires={0.5} />
      <g transform={`translate(${(a[0] + b[0]) / 2},${(a[1] + b[1]) / 2}) rotate(${ang})`} opacity={ramp(s, 0.1, 0.4)}>
        <rect x={-L / 2 - 30} y={-110} width={L + 60} height={220} fill="#FFB45A" fillOpacity={0.12} stroke="#FFD166" strokeWidth={5} strokeDasharray="22 14" rx={12} />
      </g>
      <Cell id="d23c" t={t} t0={0} t1={52} size={90} points={[[a[0] - 500, a[1] + 40], [b[0] + 900, b[1] - 90]]} />
      <BombCarpet id="d23b" t={t} t0={8} from={a} to={b} dur={34} n={30} width={170} r={26} seed={6} linger={160} />
      <g opacity={ramp(s, 0.5, 0.9)} stroke="#fff" strokeWidth={6} strokeLinecap="round" fill="none"><path d={`M${c[0] - L / 2},920 v-22 M${c[0] + L / 2},920 v-22 M${c[0] - L / 2},909 H${c[0] + L / 2}`} /></g>
      <Txt x={c[0]} y={860} text="VÀI CÂY SỐ ≈ 3 km" size={64} o={ramp(s, 0.6, 0.9)} />
    </g>
  );
};

// ---------- D24: a field of craters + Arc Light photo ----------
export const D24: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = cameraOnCitadel(-40, 40, 0.5);
  return (
    <g>
      <Plan id="d24" cam={cam} t={t} damage={dmgAt(0, 0.64, 0.66, 1)} credit />
      <Dim o={0.35} />
      <CraterField id="d24c" t={t} t0={0} t1={40} x={600} y={620} w={900} h={560} n={70} />
      <PhotoCard t={s} src="quang-tri-81-ngay-dem/img/bombs-from-b-52-arc-light-strike-exploding.jpg" caption="Bom B-52 (Arc Light) phát nổ, 1972" credit={CREDIT.usaf}
        x={1380} y={470} w={640} h={394} rot={2.5} from={-0.4} to={len / 30 + 0.5} id="d24p" kb={{ z0: 1.03, z1: 1.14, px0: 0.01, px1: -0.02 }} />
      <Txt x={620} y={960} text="CÁNH ĐỒNG HỐ BOM" size={104} color="#FFE3A0" o={ramp(s, 0.2, 0.5)} />
    </g>
  );
};
