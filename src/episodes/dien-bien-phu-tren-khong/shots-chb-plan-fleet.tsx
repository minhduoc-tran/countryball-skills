import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { UsafCap } from '../../countryball/ball-accessories';
import { breathe, mixMotion, talk } from '../../countryball/ball-motion';
import { AircraftSide } from '../../countryball/aircraft-side-view';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { AircraftKind } from '../../countryball/aircraft-kinds';
import { FlightPath } from '../../countryball/fx-flight-path';
import { GeoMap } from '../../countryball/map-geo-map';
import { CITIES, City, SeaLabel } from '../../countryball/map-labels';
import { LowerThird } from '../../countryball/hud-chips';
import { Counter, countAt } from '../../countryball/hud-counter';
import { PhotoCard } from '../../countryball/photo-card';
import { cameraAt, CameraKey } from '../../countryball/geo-camera';
import { clamp, easeOut, Pt } from '../../countryball/fx-math';
import { Backdrop, MapHud, PHOTO_CREDIT, Pop, proj, ramp, sec, Txt } from './chb-common';
import { NightSky } from './chb-night-sky';

// Chapter B, beat "6 the plan" (B20-B29): about 200 B-52s, nearly half the US fleet, Guam + U-Tapao, the escorts
// (F-111, F-4, EB-66 jammers, KC-135 tankers) and the name Linebacker II.

// ---------- B20: 200 small B-52 icons fill the screen while the counter runs ----------
const COUNT: { t: number; value: number }[] = [{ t: 0.3, value: 0 }, { t: 2.3, value: 200 }];
export const B20: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), n = Math.round(countAt(COUNT, s));
  return (
    <g>
      <Backdrop s={s} id="b20" />
      <Txt x={960} y={190} text="MỸ HUY ĐỘNG" size={64} o={ramp(s, 0, 0.3)} />
      <g style={{ filter: 'brightness(1.8) saturate(1.3)' }}>{Array.from({ length: n }, (_, i) => <AircraftTop key={i} id={`b20${i}`} kind="b52" x={143 + (i % 20) * 86} y={300 + Math.floor(i / 20) * 70} size={62} heading={-90} shadow={false} />)}</g>
      <Counter label="B-52 (KHOẢNG)" steps={COUNT} t={s} width={700} />
    </g>
  );
};

// ---------- B21: "gần một nửa số B-52 của cả nước Mỹ": a pie sweeps to just under half ----------
export const B21: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), a = 2 * Math.PI * 0.47 * easeOut(ramp(s, 0.25, 1.6)), cx = 560, cy = 540, r = 300;
  const x1 = cx + r * Math.sin(a), y1 = cy - r * Math.cos(a);
  return (
    <g>
      <Backdrop s={s} id="b21" />
      <circle cx={cx} cy={cy} r={r} fill="#3A4656" stroke="#111" strokeWidth={8} />
      <path d={`M${cx},${cy} L${cx},${cy - r} A${r},${r} 0 ${a > Math.PI ? 1 : 0} 1 ${x1},${y1} Z`} fill="#E2B95A" stroke="#111" strokeWidth={8} strokeLinejoin="round" />
      <Pop s={s} at={1.5} x={cx + 130} y={cy}><Txt x={cx + 150} y={cy + 30} text="≈ 200" size={90} color="#1E1E24" stroke="none" /></Pop>
      <Txt x={1360} y={400} text="GẦN MỘT NỬA" size={112} color="#E2B95A" o={ramp(s, 0.2, 0.5)} />
      <Txt x={1360} y={490} text="SỐ B-52 CỦA CẢ NƯỚC MỸ" size={50} o={ramp(s, 0.5, 0.8)} />
      <Ball id="b21u" x={1360} y={780} r={120} flag="USA" eyes="determined" hat={<UsafCap />} motion={mixMotion(breathe(t), talk(t, s > 0.6))} t={t} />
    </g>
  );
};

// ---------- B22: two bases: the Pacific map with both pins, then the camera drops onto Guam (photo of 150 B-52s) ----------
const K22: CameraKey[] = [{ t: 0, lon: 123, lat: 13.5, zoom: 22 }, { t: 1.5, lon: 123, lat: 13.5, zoom: 22 }, { t: 3.2, lon: 143.4, lat: 14.6, zoom: 75 }, { t: 4.65, lon: 144.4, lat: 14.1, zoom: 100, ease: 'linear' }];
export const B22: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = cameraAt(K22, s), P = proj(cam), [gx, gy] = P(144.93, 13.58), [ux, uy] = P(101, 12.68);
  const pulse = (s * 1.4) % 1, br = clamp(14 + cam.zoom * 0.42, 24, 52);
  return (
    <g>
      <GeoMap camera={cam} night={0.2} id="b22m" highlight={['USA']}>
        <City {...CITIES.guam} minZoom={14} maxZoom={400} size={30} /><City {...CITIES.utapao} minZoom={14} maxZoom={400} size={30} />
        <SeaLabel lon={140.5} lat={16.2} text="THÁI BÌNH DƯƠNG" minZoom={10} maxZoom={200} size={40} />
      </GeoMap>
      {[[gx, gy, 0.1], [ux, uy, 0.3]].map(([x, y, at], i) => s > at && <circle key={i} cx={x} cy={y} r={14 + pulse * 46} fill="none" stroke="#FF5A5F" strokeWidth={6} opacity={(1 - pulse) * ramp(s, at, at + 0.2)} />)}
      <Pop s={s} at={0.2} x={gx - br} y={gy - br * 1.6}><Ball id="b22u" x={gx - br * 1.1} y={gy - br * 1.5} r={br} flag="USA" eyes="determined" motion={breathe(t)} t={t} shadow={false} /></Pop>
      <Pop s={s} at={0.4} x={960} y={150}><Txt x={960} y={160} text="HAI CĂN CỨ" size={88} o={1 - ramp(s, 1.5, 1.8)} /></Pop>
      <LowerThird title="Căn cứ Andersen, đảo Guam" sub="Giữa Thái Bình Dương" t={s} from={2.0} />
      <PhotoCard t={s} src="dien-bien-phu-tren-khong/img/andersen-afb-150-b52s-1972.jpg" caption="150 chiếc B-52 tại Andersen, 1972" credit={PHOTO_CREDIT.usaf}
        x={1520} y={450} w={520} h={405} rot={3} from={2.3} to={len / 30 + 0.6} id="b22p" />
      <MapHud s={s} cam={cam} date="12.1972" />
    </g>
  );
};

// ---------- B23: U-Tapao in Thailand (host ball + a B-52 taking off) ----------
export const B23: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, lon: 101.6, lat: 13.2, zoom: 118 }, { t: 2.2, lon: 101.9, lat: 13.0, zoom: 138 }], s), P = proj(cam), [ux, uy] = P(101.0, 12.68);
  const route: Pt[] = [P(101.0, 12.68), P(101.7, 12.9), P(103.0, 13.5), P(105.0, 14.6)];
  return (
    <g>
      <GeoMap camera={cam} id="b23m"><City {...CITIES.utapao} size={34} anchor="b" /></GeoMap>
      <Pop s={s} at={0.1} x={ux - 210} y={uy - 150}><Ball id="b23t" x={ux - 230} y={uy - 170} r={74} flag="THA" eyes="normal" motion={breathe(t)} t={t} /><Txt x={ux - 230} y={uy - 60} text="THÁI LAN" size={40} /></Pop>
      <FlightPath id="b23f" points={route} t={t} t0={14} t1={64} size={92} trailLen={300} />
      <LowerThird title="Căn cứ U-Tapao, Thái Lan" t={s} from={0.2} />
      <MapHud s={s} cam={cam} date="12.1972" />
    </g>
  );
};

// ---------- B24: the whole package: cell + escorts + jammer + tanker fly across the night map ----------
const PKG: { kind: AircraftKind; y: number; size: number; dy: number; at: number }[] = [
  { kind: 'kc135', y: 250, size: 150, dy: -40, at: 0 }, { kind: 'f4', y: 390, size: 84, dy: 20, at: 6 }, { kind: 'f111', y: 690, size: 90, dy: -10, at: 4 },
  { kind: 'f4', y: 800, size: 84, dy: 30, at: 10 }, { kind: 'eb66', y: 920, size: 100, dy: -20, at: 2 },
];
export const B24: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, lon: 106.2, lat: 20.0, zoom: 130 }, { t: 1.9, lon: 106.5, lat: 20.2, zoom: 138 }], s);
  const cell: Pt[] = [[-300, 560], [2300, 540]];
  return (
    <g>
      <GeoMap camera={cam} night={0.6} id="b24m" highlight={['VNM']} />
      {PKG.map((p, i) => <FlightPath key={i} id={`b24k${i}`} points={[[-300 - p.at * 6, p.y], [2300, p.y + p.dy]]} t={t} t0={0} t1={100} kind={p.kind} size={p.size} trailLen={260} />)}
      <FlightPath id="b24b" points={cell} t={t} t0={0} t1={100} size={130} trailLen={380} />
      <FlightPath id="b24c" points={[[-460, 450], [2300, 440]]} t={t} t0={0} t1={100} size={130} trailLen={300} />
      <FlightPath id="b24d" points={[[-460, 650], [2300, 640]]} t={t} t0={0} t1={100} size={130} trailLen={300} />
      <Pop s={s} at={0.15} x={960} y={1010}><Txt x={960} y={1010} text="+ HÀNG TRĂM MÁY BAY KHÁC" size={64} /></Pop>
      <MapHud s={s} cam={cam} date="12.1972" />
    </g>
  );
};

// ---------- B25: F-111 low over night hills ----------
export const B25: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), off = s * 220, x = 760 + 260 * ramp(s, 0, 2.1), bob = Math.sin(s * 5) * 6;
  const ridge = (amp: number, base: number, sp: number, k: number) => {
    const pts: string[] = [];
    for (let X = -20; X <= 1940; X += 20) pts.push(`${X},${base + amp * Math.sin((X + off * sp) / (120 * k)) + amp * 0.5 * Math.sin((X + off * sp) / (47 * k) + 1.3)}`);
    return `M${pts.join(' L')} L1940,1100 L-20,1100 Z`;
  };
  return (
    <g>
      <NightSky s={s} id="b25" />
      <path d={ridge(40, 740, 0.4, 1.3)} fill="#0F1A28" />
      <path d={ridge(34, 840, 1, 1)} fill="#080F19" />
      <AircraftSide kind="f111" x={x} y={640 + bob} size={540} pitch={-1} />
      <line x1={x + 20} y1={700} x2={x + 20} y2={830} stroke="#E2B95A" strokeWidth={5} strokeDasharray="10 10" opacity={ramp(s, 0.5, 0.8)} />
      <Txt x={420} y={200} text="F-111" size={150} anchor="middle" o={ramp(s, 0.1, 0.4)} />
      <Txt x={640} y={290} text="BAY THẤP TRONG ĐÊM" size={60} color="#E2B95A" o={ramp(s, 0.45, 0.8)} />
    </g>
  );
};

// ---------- B26: F-4 Phantoms flank the B-52 ----------
export const B26: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), dx = s * 40, bob = Math.sin(s * 4) * 5;
  return (
    <g>
      <NightSky s={s} id="b26" />
      <AircraftSide kind="b52" x={1180 + dx} y={500 + bob} size={980} />
      <AircraftSide kind="f4" x={620 + dx * 1.6} y={720 - bob} size={440} />
      <AircraftSide kind="f4" x={1500 + dx * 1.2} y={300 + bob} size={330} opacity={0.95} />
      <Txt x={1380} y={870} text="F-4 PHANTOM" size={96} o={ramp(s, 0.05, 0.3)} />
      <Txt x={1380} y={990} text="HỘ TỐNG" size={110} color="#E2B95A" o={ramp(s, 0.2, 0.45)} />
    </g>
  );
};

// ---------- B27: EB-66 jammer photo with radar-jam waves ----------
export const B27: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="b27" />
      <PhotoCard t={s} src="dien-bien-phu-tren-khong/img/eb66e-destroyer-side-view.jpg" caption="EB-66 Destroyer, máy bay gây nhiễu" credit={PHOTO_CREDIT.usaf}
        x={620} y={520} w={760} h={520} rot={-2} from={-0.45} to={len / 30 + 0.6} id="b27p" />
      {[0, 1, 2, 3].map((i) => { const u = (s * 1.3 + i / 4) % 1; return <path key={i} d={`M${1150 + u * 150},${420 - u * 120} Q${1210 + u * 190},520 ${1150 + u * 150},${620 + u * 120}`} fill="none" stroke="#FF8A5F" strokeWidth={8} strokeLinecap="round" opacity={1 - u} />; })}
      <Txt x={1500} y={440} text="GÂY NHIỄU" size={92} />
      <Txt x={1500} y={550} text="RADA" size={92} color="#E2B95A" />
    </g>
  );
};

// ---------- B28: tanker refuelling photo ----------
export const B28: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="b28" />
      <PhotoCard t={s} src="dien-bien-phu-tren-khong/img/f105-f4-kc135-refuel.jpg" caption="F-105 và F-4 tiếp dầu từ KC-135, 1970" credit={PHOTO_CREDIT.usaf}
        x={620} y={520} w={860} h={578} rot={-2} from={-0.45} to={len / 30 + 0.6} id="b28p" />
      <Txt x={1500} y={450} text="TIẾP DẦU" size={100} o={ramp(s, 0.1, 0.35)} />
      <Txt x={1500} y={570} text="TRÊN KHÔNG" size={100} color="#E2B95A" o={ramp(s, 0.3, 0.55)} />
    </g>
  );
};

// ---------- B29: the operation name, typed out ----------
export const B29: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), word = 'LINEBACKER II', n = Math.floor(ramp(s, 0.3, 1.4) * (word.length + 0.99));
  return (
    <g>
      <Backdrop s={s} id="b29" />
      <Txt x={960} y={500} text={word.slice(0, n)} size={196} />
      <rect x={300} y={560} width={1320 * easeOut(ramp(s, 1.3, 1.9))} height={8} fill="#E2B95A" />
      <Txt x={960} y={660} text="TÊN CHIẾN DỊCH, THEO PHÍA MỸ" size={56} color="#E2B95A" o={ramp(s, 1.6, 1.95)} />
      <AircraftTop id="b29a" kind="b52" x={300 + s * 480} y={880} size={190} heading={0} />
      <Ball id="b29u" x={170} y={170} r={90} flag="USA" eyes="determined" hat={<UsafCap />} motion={mixMotion(breathe(t), talk(t, s < 1.5))} t={t} />
    </g>
  );
};
