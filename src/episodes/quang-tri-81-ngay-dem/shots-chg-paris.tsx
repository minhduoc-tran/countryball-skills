import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe, mixMotion, shake } from '../../countryball/ball-motion';
import { Camera, cameraAt } from '../../countryball/geo-camera';
import { GeoMap } from '../../countryball/map-geo-map';
import { City, CITIES } from '../../countryball/map-labels';
import { DateChip } from '../../countryball/hud-date-chip';
import { MiniMap } from '../../countryball/hud-minimap';
import { BCell } from '../../countryball/fx-flight-path';
import { BombCarpet } from '../../countryball/fx-bomb-carpet';
import { FrontArrow, SIDE_COLORS } from '../../countryball/ground-front-arrows';
import { PhotoCard } from '../../countryball/photo-card';
import { backOut, clamp, easeOut } from '../../countryball/fx-math';
import { Backdrop, Chip, GOLD, Head, IMG, LAND, Pop, proj, ramp, sec, Txt, Vignette } from './chg-common';
import { ParisTable } from './chb-table-and-icons';

// Chapter G, beat "29 paris" (G16-G22, 562.4-584.5 s): the weight of 81 days at the table, the October 1972 draft, the
// breakdown, 12 days of B-52 over Hà Nội (a quick callback map), the Accords of 27.01.1973 (photo) and the US leaving.

// ---------- G16: "Trên bàn đàm phán, 81 ngày đêm ấy cũng có sức nặng riêng." ----------
export const G16: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), k = backOut(ramp(s, 2.3, 2.9)), land = ramp(s, 2.7, 3.3);
  return (
    <g>
      <ParisTable s={s} t={t} id="g16" />
      <g opacity={ramp(s, 2.3, 2.5)} transform={`translate(960,${330 - (1 - k) * 360}) scale(${0.7 + 0.3 * k})`}>
        <rect x={-320} y={-80} width={640} height={150} rx={26} fill="#15181F" stroke={GOLD} strokeWidth={7} />
        <text y={-6} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={92} fill="#FFF">81 NGÀY ĐÊM</text>
        <text y={50} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={32} fill={GOLD}>SỨC NẶNG RIÊNG</text>
      </g>
      {land > 0 && <circle cx={960} cy={330} r={60 + land * 260} fill="none" stroke={GOLD} strokeWidth={6} opacity={(1 - land) * 0.7} />}
    </g>
  );
};

// ---------- G17: "Tháng mười năm đó, ở Pa ri," ----------
export const G17: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam: Camera = cameraAt([{ t: 0, lon: 2.35, lat: 47.8, zoom: 40, ease: 'linear' }, { t: 2.2, lon: 2.35, lat: 48.2, zoom: 62, ease: 'inout' }], s);
  const [x, y] = proj(cam)(CITIES.paris.lon, CITIES.paris.lat), p = (s * 1.1) % 1;
  return (
    <g>
      <GeoMap camera={cam} id="g17m" labels={false}><City {...CITIES.paris} name="Paris" size={46} /></GeoMap>
      <circle cx={x} cy={y} r={16 + p * 90} fill="none" stroke="#FFD166" strokeWidth={6} opacity={1 - p} />
      <Head s={s} at={0.1} y={190} text="PARIS" size={150} />
      <DateChip label="10.1972" t={s} id="g17-date" />
    </g>
  );
};

// ---------- G18: "hai bên đã gần đi tới một bản dự thảo hiệp định. Rồi đàm phán đổ vỡ," the draft fills up, then tears ----------
export const G18: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), bust = clamp((s - 2.75) / 0.4), fill = easeOut(ramp(s, 0.4, 2.6)) * 0.92 * (1 - bust);
  const half = (side: -1 | 1) => (
    <g transform={`translate(${side * bust * 90},${bust * bust * 150}) rotate(${side * bust * 14},960,${440})`} opacity={1 - clamp((s - 3.2) / 0.8)}>
      <clipPath id={`g18-c${side}`}><polygon points={side < 0 ? '740,150 980,150 940,330 990,450 950,560 950,730 740,730' : '980,150 1180,150 1180,730 950,730 950,560 990,450 940,330'} /></clipPath>
      <g clipPath={`url(#g18-c${side})`}>
        <rect x={740} y={150} width={440} height={580} fill="#F4EFE0" stroke="#15151A" strokeWidth={5} />
        <text x={960} y={225} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#1A2433">DỰ THẢO HIỆP ĐỊNH</text>
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x={780} y={270 + i * 36} width={(300 + (i % 3) * 30) * clamp(fill * 1.6 - i * 0.07)} height={10} rx={5} fill="#8B8472" opacity={0.7} />)}
        <rect x={780} y={640} width={360} height={26} rx={13} fill="#D7CFB8" /><rect x={780} y={640} width={360 * fill} height={26} rx={13} fill="#4C9F70" />
      </g>
    </g>
  );
  return (
    <g>
      <Backdrop s={s} id="g18" />
      <Txt x={960} y={110} text="GẦN ĐI TỚI MỘT BẢN DỰ THẢO" size={60} o={ramp(s, 0.1, 0.4)} color="#CFE3D4" />
      <Ball id="g18v" x={440} y={640} r={150} flag="VNM" eyes={bust > 0.3 ? 'worried' : 'determined'} t={t} hat={<MuCoi camo />} motion={mixMotion(breathe(t, 70, 0.03), shake(t, 83, 10, 14))} />
      <Ball id="g18u" x={1480} y={640} r={150} flag="USA" eyes={bust > 0.3 ? 'worried' : 'normal'} t={t} motion={mixMotion(breathe(t, 74, 0.03, 9), shake(t, 83, 10, 14))} />
      {bust < 1 && <g>{half(-1)}{half(1)}</g>}
      {bust > 0.05 && <g transform={`translate(960,${520 + (1 - easeOut(bust)) * -60}) rotate(-8)`} opacity={clamp(bust * 2)}>
        <rect x={-290} y={-80} width={580} height={150} rx={22} fill="#15181F" fillOpacity={0.9} stroke="#FF5A5F" strokeWidth={8} />
        <text y={34} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={104} fill="#FF7B72">ĐỔ VỠ</text>
      </g>}
      <Vignette id="g18" o={0.4} />
    </g>
  );
};

// ---------- G19: "và Mỹ đưa B-52 ra đánh Hà Nội suốt mười hai ngày đêm." callback map ----------
export const G19: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam: Camera = cameraAt([{ t: 0, lon: 106.05, lat: 20.85, zoom: 520, ease: 'linear' }, { t: 4, lon: 105.95, lat: 20.95, zoom: 680, ease: 'linear' }], s);
  const P = proj(cam), H = P(CITIES.hanoi.lon, CITIES.hanoi.lat), [hx, hy] = H;
  const pts: [number, number][] = [[hx + 520, hy + 470], [hx + 260, hy + 200], [hx + 60, hy + 20], [hx - 240, hy - 200]];
  return (
    <g>
      <GeoMap camera={cam} id="g19m" colors={LAND} night={0.7} labels={false}>
        <City {...CITIES.hanoi} lights={1} /><City {...CITIES.haiphong} />
      </GeoMap>
      <BCell id="g19b" t={t} t0={5} t1={92} points={pts} size={96} trailLen={300} />
      <BombCarpet id="g19c" t={t} t0={58} from={[hx + 40, hy + 120]} to={[hx + 190, hy + 20]} dur={30} n={10} width={50} r={24} linger={60} seed={3} />
      <DateChip dates={[{ t: 0, label: '18.12.1972' }, { t: 1.6, label: '24.12.1972' }, { t: 2.7, label: '29.12.1972' }]} t={s} id="g19-date" />
      <Pop s={s} at={2.0} x={960} y={900}><Chip x={960} y={900} text="12 NGÀY ĐÊM" size={58} stroke="#FF5A5F" /></Pop>
      <MiniMap camera={cam} id="g19-mini" />
    </g>
  );
};

// ---------- G20: "ngày 27 tháng 1 năm 1973," calendar page ----------
export const G20: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), flip = Math.abs(Math.cos(Math.PI * easeOut(ramp(s, 0.2, 0.8)))), up = ramp(s, 0.2, 0.8) > 0.5, d = up ? '27' : '26';
  return (
    <g>
      <Backdrop s={s} id="g20" />
      <g transform={`translate(960,540) scale(1,${flip + 0.02})`}>
        <rect x={-300 + 10} y={-330 + 14} width={600} height={660} rx={30} fill="#000" opacity={0.4} />
        <rect x={-300} y={-330} width={600} height={660} rx={30} fill="#F6F0E0" stroke="#15151A" strokeWidth={7} />
        <path d="M-300,-190 V-300 Q-300,-330 -270,-330 H270 Q300,-330 300,-300 V-190 Z" fill="#B3262B" stroke="#15151A" strokeWidth={7} />
        <text y={-230} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#FFF">THÁNG 1 · 1973</text>
        <text y={110} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={340} fill="#1A2433">{d}</text>
        <text y={250} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={50} fill="#B3262B">HIỆP ĐỊNH PARIS</text>
        {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={-220 + i * 88} cy={-330} r={13} fill="#15151A" />)}
      </g>
      <Txt x={960} y={1000} text="27.01.1973" size={84} color={GOLD} o={ramp(s, 1.0, 1.4)} />
    </g>
  );
};

// ---------- G21: "Hiệp định Pa ri được ký kết." the signing photo ----------
export const G21: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="g21" top="#1B2A3E" bottom="#080F18" />
      <PhotoCard id="g21p" src={`${IMG}vietnam-peace-agreement-signing.jpg`} caption="Lễ ký Hiệp định Paris, 27.01.1973" credit="Ảnh: Robert L. Knudsen / White House / Public domain" x={960} y={520} w={1000} h={678} rot={-1.2} from={0.05} t={s}
        kb={{ z0: 1.0, z1: 1.14, px0: 0.02, py0: 0.01, px1: -0.02, py1: -0.01 }} fromSide="bottom" />
      <Pop s={s} at={0.7} x={960} y={62}><Chip x={960} y={62} text="HIỆP ĐỊNH PARIS" size={46} /></Pop>
    </g>
  );
};

// ---------- G22: "Mỹ rút hết quân khỏi Việt Nam." the USA ball and a blue arrow leave east across the sea ----------
export const G22: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam: Camera = cameraAt([{ t: 0, lon: 109.6, lat: 15.6, zoom: 125, ease: 'linear' }, { t: 2.3, lon: 110.2, lat: 15.6, zoom: 135, ease: 'linear' }], s);
  const P = proj(cam), [x0, y0] = P(108.2, 15.9), [x1, y1] = P(113.2, 16.4), u = easeOut(ramp(s, 0.3, 2.2));
  return (
    <g>
      <GeoMap camera={cam} id="g22m" colors={LAND} labels={false} />
      <FrontArrow id="g22a" t={t} t0={8} points={[[x0 - 80, y0], [x0 + 120, y0 + 10], [x1, y1]]} dur={52} width={56} color={SIDE_COLORS.usa} label="RÚT HẾT QUÂN" labelSize={32} />
      <Ball id="g22u" x={x0 - 40 + (x1 - x0 + 40) * u} y={y0 - 10 + (y1 - y0) * u - 112} r={64} flag="USA" eyes="normal" t={t} motion={breathe(t, 56, 0.04)} />
      <DateChip label="1973" t={s} id="g22-date" />
      <Txt x={960} y={170} text="MỸ RÚT HẾT QUÂN" size={96} o={ramp(s, 0.3, 0.7)} />
      <MiniMap camera={cam} id="g22-mini" />
    </g>
  );
};
