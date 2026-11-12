import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe, hopOnce, mixMotion } from '../../countryball/ball-motion';
import { SpeechBubble } from '../../countryball/ball-speech-and-props';
import { LowerThird } from '../../countryball/hud-chips';
import { PhotoCard } from '../../countryball/photo-card';
import { CITIES, City } from '../../countryball/map-labels';
import { GroundBlast } from '../../countryball/fx-bomb-carpet';
import { pathAt } from '../../countryball/fx-flight-path';
import { prog } from '../../countryball/fx-math';
import { samplePath, At, GeoFlight, LL, MapShot, sec, useGeoPts } from './cha-map-scene';

// Chapter A, Rolling Thunder: A19 "why B-52 over Hà Nội?", A20 rewind to 1965, A21 US jets bomb the North,
// A22 photo card + Sấm Rền dates, A23 the supply route keeps running.

export const A19: React.FC<ShotProps> = ({ t }) => (
  <MapShot t={t} id="a19" night={0.8} date="12.1972" keys={[{ t: 0, lon: 105.7, lat: 21.0, zoom: 270 }, { t: 3.8, lon: 105.85, lat: 21.05, zoom: 340 }]}>
    <City {...CITIES.hanoi} lights={1} />
    <GeoFlight id="a19" t={t} t0={0} t1={112} kind="b52" size={200} route={[[105.0, 21.2], [105.85, 21.05], [106.8, 20.9]]} />
    <At lon={105.85} lat={21.03} dx={-260} dy={250}>
      <Ball id="a19" x={0} y={0} r={80} flag="VNM" eyes="worried" look={0.3} tilt={-8} motion={breathe(t, 56, 0.04)} />
      <SpeechBubble x={-30} y={-170} tipX={0} tipY={-80} text="?" size={80} t={t} at={18} />
    </At>
    <LowerThird title="Vì sao B-52 trên bầu trời Hà Nội?" from={0.5} t={sec(t)} />
  </MapShot>
);

const Clock: React.FC<{ x: number; y: number; r: number; t: number }> = ({ x, y, r, t }) => {
  const min = -t * 22, hr = -t * 22 / 12;
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={r} fill="#F6F0DC" stroke="#111" strokeWidth={10} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-r * 0.82} x2={0} y2={-r * 0.92} stroke="#222" strokeWidth={i % 3 ? 5 : 9} transform={`rotate(${i * 30})`} />)}
      <line x1={0} y1={0} x2={0} y2={-r * 0.78} stroke="#222" strokeWidth={9} strokeLinecap="round" transform={`rotate(${min})`} />
      <line x1={0} y1={0} x2={0} y2={-r * 0.5} stroke="#C9343A" strokeWidth={13} strokeLinecap="round" transform={`rotate(${hr})`} />
      <circle r={12} fill="#222" />
    </g>
  );
};

export const A20: React.FC<ShotProps> = ({ t }) => {
  const nt = 0.8 * (1 - prog(t, 8, 80)), pulse = 1 + 0.08 * Math.sin(t / 3);
  return (
    <MapShot t={t} id="a20" night={nt} keys={[{ t: 0, lon: 105.85, lat: 21.0, zoom: 330 }, { t: 3.7, lon: 106.0, lat: 16.4, zoom: 66 }]}
      date={[{ t: 0, label: '12.1972' }, { t: 0.5, label: '1971' }, { t: 1.0, label: '1969' }, { t: 1.5, label: '1967' }, { t: 2.0, label: '1965' }]}
      over={() => (
        <g>
          <Clock x={1280} y={470} r={200} t={t} />
          <g transform={`translate(1280,830) scale(${pulse})`} fill="#FFD43B" stroke="#0B0F16" strokeWidth={9} strokeLinejoin="round">
            <polygon points="-10,-50 -110,0 -10,50" /><polygon points="100,-50 0,0 100,50" />
          </g>
        </g>
      )} />
  );
};

const BOMBS: { f: [number, number]; route: LL[]; t0: number; t1: number }[] = [
  { f: [105.85, 21.03], route: [[109.6, 19.7], [107.6, 20.4], [105.85, 21.03]], t0: 0, t1: 56 },
  { f: [105.7, 18.7], route: [[109.4, 18.2], [107.4, 18.7], [105.7, 18.7]], t0: 10, t1: 64 },
  { f: [106.68, 20.86], route: [[109.7, 20.9], [108.2, 20.9], [106.68, 20.86]], t0: 16, t1: 60 },
];

export const A21: React.FC<ShotProps> = ({ t }) => (
  <MapShot t={t} id="a21" date="1965" keys={[{ t: 0, lon: 105.6, lat: 19.7, zoom: 100 }, { t: 3, lon: 105.8, lat: 20.1, zoom: 112 }]}>
    <City {...CITIES.hanoi} /><City {...CITIES.haiphong} /><City {...CITIES.vinh} />
    {BOMBS.map((b, i) => <GeoFlight key={i} id={`a21${i}`} t={t} t0={b.t0} t1={b.t1} kind="f4" size={74} route={b.route} />)}
    {BOMBS.map((b, i) => <At key={i} lon={b.f[0]} lat={b.f[1]}><GroundBlast t={t} t0={b.t1 - 2} x={0} y={0} r={26} linger={90} /></At>)}
  </MapShot>
);

export const A22: React.FC<ShotProps> = ({ t }) => (
  <MapShot t={t} id="a22" dim={0.5} date={[{ t: 0, label: '1965' }, { t: 1.2, label: '1968' }]} keys={[{ t: 0, lon: 105.8, lat: 20.1, zoom: 112 }, { t: 2.5, lon: 105.6, lat: 19.2, zoom: 100 }]}
    over={() => (
      <g>
        <PhotoCard id="a22p" src="dien-bien-phu-tren-khong/img/f4b-vf111-dropping-bombs.jpg" caption="F-4B Phantom thả bom trên Việt Nam" credit="Ảnh: U.S. Navy / Public domain"
          x={1290} y={470} w={700} h={518} rot={-3} from={0.1} t={sec(t)} />
        <LowerThird title="Sấm Rền (Rolling Thunder)" sub="24.02.1965 - 31.10.1968" from={0.3} t={sec(t)} />
      </g>
    )} />
);

/** Little trucks riding a lon/lat route (inside <GeoMap>), plus the dashed route line. */
const Convoy: React.FC<{ route: LL[]; t: number; n?: number }> = ({ route, t, n = 5 }) => {
  const pts = useGeoPts(route), sp = samplePath(pts);
  return (
    <g>
      <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke="#0B0F16" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke="#FFD166" strokeWidth={7} strokeDasharray="20 14" strokeDashoffset={-t * 1.2} strokeLinecap="round" strokeLinejoin="round" />
      {Array.from({ length: n }, (_, i) => {
        const p = pathAt(sp, ((t / 150) + i / n) % 1);
        return (
          <g key={i} transform={`translate(${p.x},${p.y}) rotate(${p.heading})`}>
            <rect x={-16} y={-8} width={32} height={16} rx={4} fill="#5A6B3A" stroke="#111" strokeWidth={3} />
            <rect x={6} y={-8} width={10} height={16} rx={3} fill="#3E4A2C" stroke="#111" strokeWidth={3} />
          </g>
        );
      })}
    </g>
  );
};

const ROUTE: LL[] = [[105.7, 19.0], [105.9, 17.6], [106.6, 16.2], [107.3, 14.7], [107.4, 13.2]];

export const A23: React.FC<ShotProps> = ({ t }) => (
  <MapShot t={t} id="a23" date="1965 - 1968" keys={[{ t: 0, lon: 106.3, lat: 17.0, zoom: 74 }, { t: 3.3, lon: 106.6, lat: 16.2, zoom: 82 }]}>
    <City {...CITIES.hanoi} /><City {...CITIES.vinh} /><City {...CITIES.danang} />
    <Convoy route={ROUTE} t={t} />
    {[[105.9, 17.6, 14], [106.6, 16.2, 38], [107.3, 14.7, 62], [105.8, 18.4, 80]].map(([lo, la, at], i) => (
      <At key={i} lon={lo} lat={la} dx={46}><GroundBlast t={t} t0={at} x={0} y={0} r={22} linger={60} /></At>
    ))}
    <At lon={105.85} lat={21.03} dx={130} dy={50}>
      <g opacity={prog(t, 56, 66)}><Ball id="a23" x={0} y={0} r={62} flag="VNM" eyes="determined" hat={<MuCoi />} motion={mixMotion(breathe(t, 54), hopOnce(t, 66, 20, 30))} /></g>
    </At>
    <LowerThird title="Đường tiếp tế vẫn chạy" from={0.4} t={sec(t)} />
  </MapShot>
);
