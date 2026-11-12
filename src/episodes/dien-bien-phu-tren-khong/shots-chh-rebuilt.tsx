import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { NonLa } from '../../countryball/ball-accessories';
import { UsafCap } from '../../countryball/ball-accessories';
import { breathe, hop, mixMotion } from '../../countryball/ball-motion';
import { CameraKey, cameraAt, project } from '../../countryball/geo-camera';
import { LowerThird } from '../../countryball/hud-chips';
import { GeoMap } from '../../countryball/map-geo-map';
import { CITIES, City, HANOI_SITES } from '../../countryball/map-labels';
import { Glow } from '../../countryball/fx-glow';
import { bez2 } from '../../countryball/fx-math';
import { DateChip } from '../../countryball/hud-date-chip';
import { BigText, Hospital, Stage, Town, Veil, eio, eout, ramp } from './chh-common';
import { FONT } from '../../engine/fonts';

// Chapter H, beat "Bạch Mai rebuilt": the hospital rises, American donors help, Khâm Thiên street rebuilt and lively.

/** H13 (2.1 s): Bạch Mai hospital rebuilt on the map. */
export const H13: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30, cam = { lon: 105.85, lat: 21.0, zoom: 900 + ts * 40 };
  return (
    <Stage>
      <GeoMap camera={cam} night={0} id="h13">
        <City {...HANOI_SITES.bachMai} showLabel={false} />
      </GeoMap>
      <Veil o={0.3} />
      <Hospital x={960} y={760} build={ramp(ts, 0.1, 1.6)} />
      <LowerThird title="Bệnh viện Bạch Mai" sub="Được xây dựng lại sau chiến tranh" from={0.2} t={ts} />
    </Stage>
  );
};

/** H14 (2.9 s): donations from American people towards the hospital (coins fly in an arc). */
export const H14: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30;
  return (
    <Stage bg="#13202F">
      <Glow x={1420} y={700} r={420} color="#FFE6A8" o={0.25} />
      <Hospital x={1430} y={860} w={420} h={270} build={1} />
      <Ball id="h14u" x={420} y={760} r={120} flag="USA" eyes="happy" hat={<UsafCap />} motion={mixMotion(breathe(t, 60, 0.03), hop(t, 40, 10))} t={t} />
      {Array.from({ length: 7 }, (_, i) => {
        const u = ((ts - 0.5 - i * 0.28) / 1.3);
        if (u < 0 || u > 1) return null;
        const [x, y] = bez2([520, 640], [980, 180], [1340, 560], eio(u));
        return <g key={i} transform={`translate(${x},${y})`}><circle r={26} fill="#FFD84A" stroke="#0A0F18" strokeWidth={4} /><text y={11} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#7A4A00">$</text></g>;
      })}
      <BigText ts={ts} lines={['NGƯỜI DÂN MỸ QUYÊN GÓP']} y={190} size={84} from={0.15} />
    </Stage>
  );
};

/** H15 (3.2 s): hearts cross the ocean from Washington to Hà Nội. */
const K15: CameraKey[] = [{ t: 0, lon: 16, lat: 36, zoom: 6.3 }, { t: 3.3, lon: 20, lat: 36, zoom: 6.7, ease: 'linear' }];
export const H15: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30, cam = cameraAt(K15, ts);
  const a = project(cam, -77.04, 38.9), b = project(cam, 105.85, 21.03);
  return (
    <Stage>
      <GeoMap camera={cam} night={0} highlight={['USA', 'VNM']} id="h15">
        <City {...CITIES.washington} showLabel /><City {...CITIES.hanoi} showLabel />
      </GeoMap>
      {Array.from({ length: 8 }, (_, i) => {
        const u = (ts - 0.4 - i * 0.3) / 1.6;
        if (u < 0 || u > 1) return null;
        const mid: [number, number] = [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 260];
        const [x, y] = bez2([a[0], a[1]], mid, [b[0], b[1]], eio(u));
        return <path key={i} transform={`translate(${x},${y}) scale(1.4)`} d="M0,10 C-22,-6 -14,-22 0,-10 C14,-22 22,-6 0,10 Z" fill="#E8505B" stroke="#0A0F18" strokeWidth={3.5} />;
      })}
      <Ball id="h15u" x={a[0] + 10} y={a[1] - 90} r={56} flag="USA" eyes="happy" motion={breathe(t, 56, 0.04)} t={t} />
      <LowerThird title="Quyên góp giúp bệnh viện" sub="Từ người dân Mỹ, sau chiến tranh" from={0.3} t={ts} />
    </Stage>
  );
};

/** H16 (1.7 s): Khâm Thiên street rebuilt house by house. */
export const H16: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30;
  return (
    <Stage bg="#9CC8E6">
      <rect width={1920} height={560} fill="#BFE0F2" />
      <Town ts={ts} x={30} y={900} n={12} w={155} step={0.09} />
      <BigText ts={ts} lines={['PHỐ KHÂM THIÊN']} y={190} size={104} from={0.1} fill="#FFF3C4" />
      <BigText ts={ts} lines={['ĐƯỢC DỰNG LẠI']} y={300} size={70} from={0.4} fill="#FFFFFF" />
    </Stage>
  );
};

/** H17 (3.4 s): the street full of life: lanterns and little balls strolling. */
export const H17: React.FC<ShotProps> = ({ t }) => {
  const ts = t / 30;
  const folks = [0, 1, 2, 3, 4, 5].map((i) => ({ x: ((i * 410 + ts * (i % 2 ? 60 : -45) + 2000) % 2100) - 90, flag: i % 3 === 2 ? 'USA' : 'VNM', r: 46 + (i % 2) * 8 }));
  return (
    <Stage bg="#9CC8E6">
      <rect width={1920} height={560} fill="#BFE0F2" />
      <Town ts={9} x={30} y={900} n={12} w={155} seed={2} />
      {Array.from({ length: 14 }, (_, i) => (
        <g key={i}><circle cx={60 + i * 140} cy={78 + 30 * Math.sin(i * 0.9) + 14 * Math.sin(ts * 2 + i)} r={22} fill={i % 2 ? '#E8505B' : '#FFD84A'} stroke="#0A0F18" strokeWidth={3} /></g>
      ))}
      <path d={`M0,78 Q480,140 960,78 T1920,78`} fill="none" stroke="#2B2620" strokeWidth={3} opacity={0.6} />
      {folks.map((f, i) => (
        <Ball key={i} id={`h17b${i}`} x={f.x} y={975} r={f.r + 10} flag={f.flag} eyes="happy" hat={i % 2 ? undefined : <NonLa />} motion={mixMotion(breathe(t, 40 + i * 5, 0.03, i * 7), hop(t, 16 + i * 2, 10, i * 3))} t={t} />
      ))}
      <BigText ts={ts} lines={['ĐÔNG VUI NHƯ CHƯA TỪNG', 'CÓ MƯA BOM']} y={270} size={84} from={0.3} fill="#FFF3C4" />
    </Stage>
  );
};
