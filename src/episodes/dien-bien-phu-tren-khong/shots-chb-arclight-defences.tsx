import React from 'react';
import { ShotProps } from '../../engine';
import { BombCarpet } from '../../countryball/fx-bomb-carpet';
import { FlakBurst, SamLaunch, SamSite } from '../../countryball/fx-sam-and-flak';
import { AaGun, Searchlights } from '../../countryball/fx-tracers-and-lights';
import { GeoMap } from '../../countryball/map-geo-map';
import { CITIES, City } from '../../countryball/map-labels';
import { LowerThird } from '../../countryball/hud-chips';
import { cameraAt, CameraKey } from '../../countryball/geo-camera';
import { samplePath } from '../../countryball/fx-flight-path';
import { Pt } from '../../countryball/fx-math';
import { Cell, MapHud, Pop, proj, ramp, sec, Txt } from './chb-common';

// Chapter B, beat "5b arc light" (B15-B19): since 1965 B-52s carpet-bombed the South where there were almost no SAMs;
// but Hà Nội is different: a dense ring of SAM sites, flak and searchlights; this time the B-52s must fly straight in.

type LL = [number, number];
const toPx = (P: (lo: number, la: number) => Pt, pts: LL[]): Pt[] => pts.map(([lo, la]) => P(lo, la));

// ---------- B15: 1965, Arc Light in the South: cells cross Nam Bộ / Tây Nguyên, carpets walk across the ground ----------
const K15: CameraKey[] = [{ t: 0, lon: 107.4, lat: 14.2, zoom: 40 }, { t: 4.8, lon: 107.0, lat: 12.0, zoom: 50 }];
export const B15: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt(K15, s), P = proj(cam);
  const c1 = toPx(P, [[111.2, 13.9], [108.7, 12.5], [106.4, 11.2], [103.8, 10.0]]);
  const c2 = toPx(P, [[110.6, 16.6], [108.6, 15.2], [106.9, 13.8], [105.0, 12.6]]);
  return (
    <g>
      <GeoMap camera={cam} highlight={['VNM']} id="b15m"><City {...CITIES.saigon} size={30} /></GeoMap>
      <BombCarpet id="b15a" t={t} t0={62} from={P(108.5, 12.4)} to={P(107.0, 11.6)} dur={38} n={22} width={50} r={24} linger={200} seed={2} />
      <BombCarpet id="b15b" t={t} t0={96} from={P(108.0, 15.0)} to={P(106.9, 13.9)} dur={36} n={20} width={46} r={22} linger={200} seed={5} />
      <BombCarpet id="b15c" t={t} t0={122} from={P(108.2, 13.6)} to={P(107.2, 12.9)} dur={30} n={16} width={44} r={20} linger={200} seed={8} />
      <Cell id="b15x" t={t} points={c1} t0={20} t1={132} size={64} trailLen={260} />
      <Cell id="b15y" t={t} points={c2} t0={54} t1={150} size={64} trailLen={260} />
      <LowerThird title="Miền Nam, từ năm 1965" sub="B-52 rải thảm (Arc Light)" t={s} from={0.2} />
      <MapHud s={s} cam={cam} date="1965" />
    </g>
  );
};

// ---------- B16: the same sky: almost no SAMs (SAM icon struck through) ----------
const K16: CameraKey[] = [{ t: 0, lon: 107.0, lat: 12.0, zoom: 50 }, { t: 2.9, lon: 107.5, lat: 12.9, zoom: 54 }];
export const B16: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt(K16, s), P = proj(cam);
  const c = toPx(P, [[110.4, 15.6], [108.4, 14.2], [106.6, 12.6], [104.2, 10.8]]);
  return (
    <g>
      <GeoMap camera={cam} highlight={['VNM']} id="b16m"><City {...CITIES.saigon} size={30} /></GeoMap>
      <Cell id="b16c" t={t} points={c} t0={0} t1={100} size={64} trailLen={280} />
      <Pop s={s} at={0.3} x={1500} y={320}>
        <g transform="translate(1500,320)">
          <circle r={140} fill="#0E1D2E" fillOpacity={0.92} stroke="#E2B95A" strokeWidth={6} />
          <g transform="scale(1.5)"><SamSite x={0} y={0} r={52} /></g>
          <path d="M-108,108 L108,-108" stroke="#D83A3A" strokeWidth={22} strokeLinecap="round" />
          <circle r={140} fill="none" stroke="#D83A3A" strokeWidth={14} />
        </g>
      </Pop>
      <Pop s={s} at={0.7} x={1500} y={560}><Txt x={1500} y={560} text="GẦN NHƯ KHÔNG CÓ" size={50} /><Txt x={1500} y={620} text="TÊN LỬA PHÒNG KHÔNG" size={50} color="#E2B95A" /></Pop>
      <MapHud s={s} cam={cam} date="1965" />
    </g>
  );
};

// ---------- B17: "Nhưng Hà Nội thì khác": the camera sweeps north to Hà Nội, alarm ring ----------
const K17: CameraKey[] = [{ t: 0, lon: 107.5, lat: 12.9, zoom: 54 }, { t: 1.5, lon: 105.85, lat: 20.7, zoom: 120, ease: 'inout' }];
export const B17: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt(K17, s), [hx, hy] = proj(cam)(105.85, 21.03), p = (s * 1.8) % 1, on = ramp(s, 0.9, 1.1);
  return (
    <g>
      <GeoMap camera={cam} highlight={['VNM']} id="b17m"><City {...CITIES.haiphong} size={26} minZoom={90} /><City {...CITIES.hanoi} size={36} /></GeoMap>
      {on > 0 && <circle cx={hx} cy={hy} r={30 + p * 130} fill="none" stroke="#FF5A5F" strokeWidth={8} opacity={on * (1 - p)} />}
      <Txt x={960} y={940} text="NHƯNG HÀ NỘI THÌ KHÁC" size={84} o={ramp(s, 0.1, 0.4)} />
      <MapHud s={s} cam={cam} date="1972" />
    </g>
  );
};

// ---------- B18 / B19: the Hà Nội defence ring ----------
const RING_IN: LL[] = Array.from({ length: 6 }, (_, i) => [105.85 + 0.55 * Math.cos((i * 60 + 20) * Math.PI / 180), 21.03 + 0.45 * Math.sin((i * 60 + 20) * Math.PI / 180)]);
const RING_OUT: LL[] = Array.from({ length: 8 }, (_, i) => [105.85 + 1.0 * Math.cos((i * 45 + 5) * Math.PI / 180), 21.03 + 0.8 * Math.sin((i * 45 + 5) * Math.PI / 180)]);
const GUNS: LL[] = Array.from({ length: 12 }, (_, i) => [105.85 + (0.3 + 0.7 * ((i * 7) % 5) / 5) * Math.cos((i * 30 + 11) * Math.PI / 180), 21.03 + (0.25 + 0.55 * ((i * 3) % 5) / 5) * Math.sin((i * 30 + 11) * Math.PI / 180)]);

const Defences: React.FC<{ t: number; P: (lo: number, la: number) => Pt; showRanges?: boolean }> = ({ t, P, showRanges = true }) => (
  <g>
    {showRanges && RING_IN.map(([lo, la], i) => { const [x, y] = P(lo, la); return <circle key={i} cx={x} cy={y} r={120} fill="#D83A3A" fillOpacity={0.05} stroke="#FF8A5F" strokeWidth={3} strokeDasharray="12 10" opacity={0.55} />; })}
    {GUNS.map(([lo, la], i) => { const [x, y] = P(lo, la); return <AaGun key={i} x={x} y={y} aim={-80 + (i % 3) * 18} s={0.8} />; })}
    {RING_OUT.map(([lo, la], i) => { const [x, y] = P(lo, la); return <SamSite key={i} x={x} y={y} r={22} />; })}
    {RING_IN.map(([lo, la], i) => { const [x, y] = P(lo, la); return <SamSite key={i} x={x} y={y} r={28} />; })}
  </g>
);

const K18: CameraKey[] = [{ t: 0, lon: 105.85, lat: 21.0, zoom: 215 }, { t: 4.4, lon: 105.9, lat: 21.06, zoom: 245 }];
export const B18: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt(K18, s), P = proj(cam);
  const up = (ll: LL, dx: number, dy: number): Pt => { const [x, y] = P(ll[0], ll[1]); return [x + dx, y + dy]; };
  const flak: [number, number, number][] = [[18, -260, -170], [36, 230, -210], [52, -330, -60], [70, 300, -90], [88, 150, -300], [104, -190, -290]];
  return (
    <g>
      <GeoMap camera={cam} night={0.55} highlight={['VNM']} provinces id="b18m"><City {...CITIES.hanoi} size={34} lights={0.9} /></GeoMap>
      <Searchlights t={t} length={760} sources={[{ x: 300, y: 1060, base: -62, swing: 22, period: 150 }, { x: 960, y: 1070, base: -90, swing: 26, period: 170, phase: 0.4 }, { x: 1620, y: 1060, base: -118, swing: 22, period: 140 }]} />
      <Defences t={t} P={P} />
      {RING_IN.slice(0, 3).map((ll, i) => { const from = up(ll, 0, 0), to = up(ll, (i % 2 ? 90 : -90), -330); return <SamLaunch key={i} id={`b18s${i}`} t={t} t0={14 + i * 24} from={from} to={to} dur={36} bend={i % 2 ? 0.2 : -0.2} size={58} />; })}
      {flak.map(([t0, dx, dy], i) => { const [x, y] = P(105.85, 21.03); return <FlakBurst key={i} id={`b18f${i}`} t={t} t0={t0} x={x + dx} y={y + dy} r={40} />; })}
      <LowerThird title="Hà Nội, cuối năm 1972" sub="Một trong những bầu trời phòng thủ dày đặc nhất thế giới" t={s} from={0.3} />
      <MapHud s={s} cam={cam} date="12.1972" />
    </g>
  );
};

const K19: CameraKey[] = [{ t: 0, lon: 105.0, lat: 20.35, zoom: 138 }, { t: 3.0, lon: 105.5, lat: 20.8, zoom: 150 }];
export const B19: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), cam = cameraAt(K19, s), P = proj(cam);
  const route = toPx(P, [[102.8, 18.9], [104.4, 20.0], [105.85, 21.03], [107.3, 21.9]]);
  const sp = samplePath(route);
  const [hx, hy] = P(105.85, 21.03);
  return (
    <g>
      <GeoMap camera={cam} night={0.6} highlight={['VNM']} id="b19m"><City {...CITIES.hanoi} size={34} lights={0.9} /></GeoMap>
      <Defences t={t} P={P} showRanges={false} />
      <polyline points={sp.p.map((q) => q.join(',')).join(' ')} fill="none" stroke="#FFD166" strokeWidth={4} strokeDasharray="14 12" opacity={0.6} />
      <Cell id="b19c" t={t} points={route} t0={0} t1={95} size={92} spread={90} step={84} trailLen={320} />
      {[0, 1].map((i) => { const from = P(RING_IN[i * 3][0], RING_IN[i * 3][1]); return <SamLaunch key={i} id={`b19s${i}`} t={t} t0={50 + i * 18} from={from} to={[hx - 60 + i * 120, hy - 120]} dur={34} bend={0.15} size={52} />; })}
      <Pop s={s} at={0.25} x={960} y={150}><Txt x={960} y={160} text="BAY THẲNG VÀO HÀ NỘI" size={80} /></Pop>
      <MapHud s={s} cam={cam} date="12.1972" />
    </g>
  );
};
