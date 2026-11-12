import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { Ball } from '../../countryball/countryball';
import { PilotHelmet } from '../../countryball/ball-accessories';
import { breathe, mixMotion, talk } from '../../countryball/ball-motion';
import { AircraftSide } from '../../countryball/aircraft-side-view';
import { FlightPath } from '../../countryball/fx-flight-path';
import { GeoMap } from '../../countryball/map-geo-map';
import { CITIES, City, HANOI_SITES, SeaLabel } from '../../countryball/map-labels';
import { LowerThird } from '../../countryball/hud-chips';
import { cameraAt, CameraKey } from '../../countryball/geo-camera';
import { easeIn, easeOut, Pt } from '../../countryball/fx-math';
import { Backdrop, Dim, MapHud, Pop, proj, ramp, Reticle, sec, Txt } from './chb-common';
import { AirfieldIcon, PowerPlantIcon, StationIcon, WarehouseIcon } from './chb-icons';
import { NightSky } from './chb-night-sky';

// Chapter B, beat "6b long flight" (B30-B37): crew take off from Guam, 10+ hours on the clock, thousands of km over the
// Pacific, mid-air refuelling, the northern sky, the target list (station, depot, airfield, power plant), then
// Yên Viên, Gia Lâm and Hải Phòng harbour on the map.

// ---------- B30: night takeoff at Guam, crew ball in the foreground ----------
export const B30: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), u = ramp(s, 0, 2.6), x = 520 + 1000 * easeIn(u) * 0.9 + 100 * u, lift = easeIn(ramp(s, 1.9, 2.7)), off = s * 600 * (0.4 + u);
  return (
    <g>
      <NightSky s={s} id="b30" />
      <rect y={800} width={1920} height={300} fill="#10161F" />
      <rect y={800} width={1920} height={6} fill="#2B3646" />
      {Array.from({ length: 24 }, (_, i) => { const X = ((i * 90 - off) % 2160 + 2160) % 2160 - 120; return <circle key={i} cx={X} cy={830} r={5} fill="#FFD166" opacity={0.9} />; })}
      <AircraftSide kind="b52" x={x} y={712 - lift * 160} size={900} pitch={lift * 9} />
      <Ball id="b30u" x={250} y={900} r={110} flag="USA" eyes="determined" look={0.7} hat={<PilotHelmet />} motion={mixMotion(breathe(t), talk(t, s < 1.2, 0.8))} t={t} />
      <Txt x={960} y={170} text="TỔ LÁI B-52 CẤT CÁNH TỪ GUAM" size={66} o={ramp(s, 0.1, 0.4)} />
    </g>
  );
};

// ---------- B31: the clock: the hour hand sweeps ten hours ----------
export const B31: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), u = easeOut(ramp(s, 0.1, 2.2)), hour = u * 300, minute = u * 3600, cx = 960, cy = 430, r = 250;
  return (
    <g>
      <Backdrop s={s} id="b31" />
      <circle cx={cx} cy={cy} r={r + 24} fill="#2A3442" stroke="#111" strokeWidth={8} />
      <circle cx={cx} cy={cy} r={r} fill="#F6F2E7" stroke="#111" strokeWidth={6} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={cx + (r - 14) * Math.sin(i * Math.PI / 6)} y1={cy - (r - 14) * Math.cos(i * Math.PI / 6)} x2={cx + (r - (i % 3 ? 36 : 56)) * Math.sin(i * Math.PI / 6)} y2={cy - (r - (i % 3 ? 36 : 56)) * Math.cos(i * Math.PI / 6)} stroke="#1E1E24" strokeWidth={i % 3 ? 6 : 12} strokeLinecap="round" />)}
      <line x1={cx} y1={cy} x2={cx + 150 * Math.sin(hour * Math.PI / 180)} y2={cy - 150 * Math.cos(hour * Math.PI / 180)} stroke="#C9343A" strokeWidth={18} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx + 210 * Math.sin(minute * Math.PI / 180)} y2={cy - 210 * Math.cos(minute * Math.PI / 180)} stroke="#1E1E24" strokeWidth={10} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={18} fill="#1E1E24" />
      <Txt x={960} y={850} text="HƠN 10 GIỜ" size={150} o={ramp(s, 0.2, 0.5)} />
      <Txt x={960} y={950} text="MỖI PHI VỤ" size={64} color="#E2B95A" o={ramp(s, 0.5, 0.8)} />
    </g>
  );
};

// ---------- B32: thousands of km: route from Guam to Hà Nội across the Pacific / Biển Đông ----------
export const B32: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, lon: 125, lat: 17, zoom: 21 }, { t: 2.4, lon: 122, lat: 18.4, zoom: 23 }], s), P = proj(cam);
  const route: Pt[] = [P(144.93, 13.58), P(131, 15.2), P(118, 18.6), P(105.85, 21.03)];
  return (
    <g>
      <GeoMap camera={cam} night={0.3} id="b32m" highlight={['VNM', 'USA']}>
        <City {...CITIES.guam} minZoom={10} maxZoom={400} size={30} /><City {...CITIES.hanoi} size={30} />
        <SeaLabel lon={134} lat={21.5} text="THÁI BÌNH DƯƠNG" minZoom={10} maxZoom={100} size={40} />
      </GeoMap>
      <FlightPath id="b32f" points={route} t={t} t0={0} t1={66} size={74} trailLen={500} route />
      <Pop s={s} at={0.3} x={960} y={190}><Txt x={960} y={200} text="HÀNG NGHÌN KM" size={96} /></Pop>
      <MapHud s={s} cam={cam} date="12.1972" />
    </g>
  );
};

// ---------- B33: mid-air refuelling, side view with a fuel line ----------
export const B33: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), dx = s * 30, bob = Math.sin(s * 6) * 4;
  const x1 = 1220 + dx, y1 = 300 + bob, x2 = 770 + dx, y2 = 640 - bob;
  return (
    <g>
      <NightSky s={s} id="b33" />
      <AircraftSide kind="kc135" x={x1} y={y1} size={640} />
      <AircraftSide kind="b52" x={x2} y={y2} size={820} />
      <path d={`M${x1 - 300},${y1 + 20} L${x2 + 250},${y2 - 60}`} stroke="#8D949B" strokeWidth={12} strokeLinecap="round" />
      {Array.from({ length: 5 }, (_, i) => { const u = (s * 2.2 + i / 5) % 1; return <circle key={i} cx={x1 - 300 + (x2 + 250 - x1 + 300) * u} cy={y1 + 20 + (y2 - 60 - y1 - 20) * u} r={8} fill="#FFD166" />; })}
      <Txt x={960} y={960} text="TIẾP DẦU TRÊN KHÔNG" size={92} o={ramp(s, 0.05, 0.3)} />
    </g>
  );
};

// ---------- B34: the northern sky: the cell arrives from the sea at night ----------
export const B34: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, lon: 106.9, lat: 20.3, zoom: 125 }, { t: 2.1, lon: 106.0, lat: 20.8, zoom: 138 }], s), P = proj(cam);
  const pts: Pt[] = [P(109.6, 19.0), P(108.0, 19.9), P(106.4, 20.7), P(104.8, 21.2)];
  return (
    <g>
      <GeoMap camera={cam} night={0.7} id="b34m" highlight={['VNM']}><City {...CITIES.haiphong} size={28} /><City {...CITIES.hanoi} size={30} /></GeoMap>
      <FlightPath id="b34f" points={pts} t={t} t0={0} t1={70} size={70} trailLen={320} />
      <FlightPath id="b34g" points={pts.map(([x, y]) => [x + 40, y + 110] as Pt)} t={t} t0={6} t1={76} size={70} trailLen={320} />
      <FlightPath id="b34h" points={pts.map(([x, y]) => [x - 40, y - 100] as Pt)} t={t} t0={9} t1={79} size={70} trailLen={320} />
      <LowerThird title="Bầu trời miền Bắc Việt Nam" t={s} from={0.2} />
      <MapHud s={s} cam={cam} date="12.1972" />
    </g>
  );
};

// ---------- B35: the target list: station, depot, airfield, power plant ----------
const TILES: { x: number; at: number; label: string; Icon: React.FC }[] = [
  { x: 300, at: 1.05, label: 'NHÀ GA', Icon: StationIcon }, { x: 740, at: 1.7, label: 'KHO TÀNG', Icon: WarehouseIcon },
  { x: 1180, at: 2.43, label: 'SÂN BAY', Icon: AirfieldIcon }, { x: 1620, at: 3.2, label: 'NHÀ MÁY ĐIỆN', Icon: PowerPlantIcon },
];
export const B35: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt([{ t: 0, lon: 105.9, lat: 21.0, zoom: 150 }, { t: 4.1, lon: 106.0, lat: 21.1, zoom: 175 }], s);
  return (
    <g>
      <GeoMap camera={cam} night={0.6} id="b35m" highlight={['VNM']} />
      <Dim o={0.7} />
      <Txt x={960} y={170} text="MỤC TIÊU CỦA HỌ" size={84} o={ramp(s, 0.2, 0.5)} />
      {TILES.map(({ x, at, label, Icon }) => (
        <Pop key={label} s={s} at={at} x={x} y={560}>
          <rect x={x - 195 + 10} y={330 + 14} width={390} height={470} rx={26} fill="#000" opacity={0.4} />
          <rect x={x - 195} y={330} width={390} height={470} rx={26} fill="#F6F2E7" stroke="#111" strokeWidth={6} />
          <g transform={`translate(${x},520) scale(1.25)`}><Icon /></g>
          <text x={x} y={760} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={label.length > 9 ? 40 : 50} fill="#1E1E24">{label}</text>
        </Pop>
      ))}
    </g>
  );
};

// ---------- B36: Yên Viên railway, then Gia Lâm airfield (camera glides between them, reticle follows) ----------
const K36: CameraKey[] = [{ t: 0, lon: 105.935, lat: 21.1, zoom: 650 }, { t: 1.0, lon: 105.93, lat: 21.095, zoom: 690 }, { t: 1.6, lon: 105.895, lat: 21.045, zoom: 720 }, { t: 2.2, lon: 105.893, lat: 21.043, zoom: 740 }];
export const B36: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt(K36, s), P = proj(cam);
  const a = P(HANOI_SITES.yenVien.lon, HANOI_SITES.yenVien.lat), b = P(HANOI_SITES.giaLam.lon, HANOI_SITES.giaLam.lat), k = easeOut(ramp(s, 1.08, 1.45));
  return (
    <g>
      <GeoMap camera={cam} night={0.8} id="b36m" highlight={['Hà Nội']} provinces>
        <City {...HANOI_SITES.yenVien} size={30} /><City {...HANOI_SITES.giaLam} size={30} />
      </GeoMap>
      <Reticle x={a[0] + (b[0] - a[0]) * k} y={a[1] + (b[1] - a[1]) * k} s={s} r={46} />
      <LowerThird title="Đường sắt Yên Viên" t={s} from={0.1} to={1.15} />
      <LowerThird title="Sân bay Gia Lâm" t={s} from={1.1} />
      <MapHud s={s} cam={cam} date="12.1972" />
    </g>
  );
};

// ---------- B37: Hải Phòng harbour: the camera pulls out and east, reticle on the port ----------
const K37: CameraKey[] = [{ t: 0, lon: 105.893, lat: 21.043, zoom: 740 }, { t: 0.85, lon: 106.5, lat: 20.92, zoom: 380, ease: 'out' }, { t: 3, lon: 106.62, lat: 20.88, zoom: 430, ease: 'linear' }];
export const B37: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt(K37, s), [hx, hy] = proj(cam)(106.68, 20.86);
  return (
    <g>
      <GeoMap camera={cam} night={0.8} id="b37m" highlight={['Hải Phòng']} provinces><City {...CITIES.haiphong} size={34} /></GeoMap>
      <Reticle x={hx} y={hy} s={s} r={50} />
      <LowerThird title="Cảng Hải Phòng" t={s} from={0.1} />
      <MapHud s={s} cam={cam} date="12.1972" />
    </g>
  );
};
