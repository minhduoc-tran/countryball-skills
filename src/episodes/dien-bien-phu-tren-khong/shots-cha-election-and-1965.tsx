import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { Ball } from '../../countryball/countryball';
import { UsafCap } from '../../countryball/ball-accessories';
import { breathe, hop, hopOnce, mixMotion, shake } from '../../countryball/ball-motion';
import { LowerThird } from '../../countryball/hud-chips';
import { CITIES, City } from '../../countryball/map-labels';
import { backOut, easeOut, lerp, prog } from '../../countryball/fx-math';
import { At, GeoArrow, MapShot, Out, Tag, sec } from './cha-map-scene';

// Chapter A, election and 1965: A14 the planned 1956 election (country re-joins), A15 it never happens (split returns),
// A16 the USA gets deeper into the South, A17 "1965" stamp, A18 US forces land.

const WIDE = [{ t: 0, lon: 106.0, lat: 16.3, zoom: 70 }, { t: 3.4, lon: 106.3, lat: 16.6, zoom: 76 }];

/** Ballot box with a paper dropping into the slot (loops). gray 0..1 = washed out. */
const BallotBox: React.FC<{ x: number; y: number; s: number; t: number; gray?: number; shakeX?: number }> = ({ x, y, s, t, gray = 0, shakeX = 0 }) => {
  const u = (t % 36) / 36;
  return (
    <g transform={`translate(${x + shakeX},${y}) scale(${s})`} style={{ filter: gray > 0 ? `grayscale(${gray}) brightness(${1 - gray * 0.25})` : undefined }}>
      <rect x={-34} y={-190 + u * 140} width={68} height={92} rx={4} fill="#F6F0DC" stroke="#111" strokeWidth={5} />
      <rect x={-120} y={-34} width={240} height={190} rx={14} fill="#3C5A92" stroke="#111" strokeWidth={6} />
      <rect x={-132} y={-62} width={264} height={36} rx={10} fill="#2D4573" stroke="#111" strokeWidth={6} />
      <rect x={-50} y={-52} width={100} height={11} rx={5} fill="#0B0F16" />
      <text y={92} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={46} fill="#FFFFFF">PHIẾU</text>
    </g>
  );
};

export const A14: React.FC<ShotProps> = ({ t }) => (
  <MapShot t={t} id="a14" keys={WIDE} date={[{ t: 0, label: '1954' }, { t: 0.7, label: '1956' }]} south={{ lat: 17, k: 1 - easeOut(prog(t, 26, 78)) }}
    over={() => (
      <g>
        <Out x={1500} y={230} size={84} opacity={prog(t, 8, 20)}>TỔNG TUYỂN CỬ</Out>
        <BallotBox x={1500} y={560} s={1.9} t={t} />
        <Tag x={1250} y={900} text="THỐNG NHẤT ĐẤT NƯỚC" size={30} opacity={prog(t, 60, 74)} />
        <Ball id="a14" x={420} y={700} r={115} flag="VNM" eyes="happy" motion={mixMotion(breathe(t, 60), hop(t, 40, 24, 5))} />
      </g>
    )} />
);

export const A15: React.FC<ShotProps> = ({ t }) => {
  const x1 = prog(t, 12, 24), x2 = prog(t, 20, 32), gray = prog(t, 10, 30) * 0.85;
  return (
    <MapShot t={t} id="a15" keys={WIDE} date="1956" south={{ lat: 17, k: easeOut(prog(t, 24, 54)) }}
      over={() => (
        <g>
          <BallotBox x={1500} y={560} s={1.9} t={8} gray={gray} shakeX={t > 12 && t < 30 ? Math.sin(t * 2.4) * 8 * (1 - prog(t, 12, 30)) : 0} />
          <g stroke="#E0342F" strokeWidth={34} strokeLinecap="round">
            <line x1={1360} y1={410} x2={1360 + 280 * x1} y2={410 + 300 * x1} />
            <line x1={1640} y1={410} x2={1640 - 280 * x2} y2={410 + 300 * x2} />
          </g>
          <Out x={1500} y={230} size={66} fill="#FF6A4D" opacity={prog(t, 28, 40)}>KHÔNG BAO GIỜ DIỄN RA</Out>
          <Ball id="a15" x={420} y={700} r={115} flag="VNM" eyes="sad" motion={mixMotion(breathe(t, 70, 0.04), shake(t, 14, 10, 16))} />
        </g>
      )} />
  );
};

export const A16: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 0, 36)), arrow = prog(t, 22, 56);
  return (
    <MapShot t={t} id="a16" date="1954 - 1965" keys={[{ t: 0, lon: 108.6, lat: 13.8, zoom: 62 }, { t: 2.6, lon: 108.2, lat: 13.2, zoom: 74 }]}>
      <City {...CITIES.saigon} />
      <City {...CITIES.danang} />
      <GeoArrow from={[112.4, 12.2]} to={[107.4, 11.2]} k={arrow} w={14} dash t={t} />
      <GeoArrow from={[111.8, 15.4]} to={[108.7, 14.0]} k={prog(t, 30, 60)} w={14} dash t={t} />
      <At lon={lerp(115.2, 112.8, k)} lat={13.4}><Ball id="a16" x={0} y={0} r={74} flag="USA" eyes="determined" hat={<UsafCap />} motion={mixMotion(breathe(t, 52), hopOnce(t, 40, 20, 24))} /></At>
      <LowerThird title="Mỹ can thiệp sâu vào miền Nam" from={0.5} t={sec(t)} />
    </MapShot>
  );
};

export const A17: React.FC<ShotProps> = ({ t }) => (
  <MapShot t={t} id="a17" dim={0.45} date={[{ t: 0, label: '1956' }, { t: 0.2, label: '1965' }]} keys={[{ t: 0, lon: 108.2, lat: 13.2, zoom: 74 }, { t: 2.1, lon: 108.0, lat: 14.2, zoom: 82 }]}
    over={() => <Out x={960} y={650} size={440} fill="#FFD43B" rot={-3} scale={Math.max(0.01, backOut((t - 4) / 12))}>1965</Out>}>
    <City {...CITIES.saigon} />
    <GeoArrow from={[112.4, 12.2]} to={[107.4, 11.2]} k={1} w={14} dash t={t} />
    <GeoArrow from={[111.8, 15.4]} to={[108.7, 14.0]} k={1} w={14} dash t={t} />
  </MapShot>
);

export const A18: React.FC<ShotProps> = ({ t }) => (
  <MapShot t={t} id="a18" date="1965" keys={[{ t: 0, lon: 109.0, lat: 15.8, zoom: 110 }, { t: 1.7, lon: 108.7, lat: 15.9, zoom: 125 }]}>
    <City {...CITIES.danang} anchor="l" minZoom={0} />
    {Array.from({ length: 8 }, (_, i) => {
      const k = easeOut(prog(t, 2 + i * 3, 24 + i * 3)), row = i % 4, col = Math.floor(i / 4);
      return (
        <At key={i} lon={lerp(110.6, 109.3 + col * 0.4, k)} lat={lerp(16.9 - row * 0.3, 16.5 - row * 0.45, k)} dy={-Math.abs(Math.sin(k * Math.PI * 3)) * 14}>
          <Ball id={`a18t${i}`} x={0} y={0} r={23} flag="USA" eyes="determined" shadow={false} />
        </At>
      );
    })}
    <At lon={111.4} lat={17.5}><Ball id="a18" x={0} y={0} r={78} flag="USA" eyes="determined" hat={<UsafCap />} motion={breathe(t, 50)} /></At>
    <GeoArrow from={[111.0, 17.2]} to={[109.3, 16.4]} k={prog(t, 4, 30)} w={12} dash t={t} />
    <LowerThird title="Quân đội Mỹ trực tiếp tham chiến" sub="1965" from={0.1} t={sec(t)} />
  </MapShot>
);
