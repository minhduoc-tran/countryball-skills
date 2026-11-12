import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { M1Helmet } from '../../countryball/ball-accessories-military';
import { breathe } from '../../countryball/ball-motion';
import { CitadelPlanInMap } from '../../countryball/citadel-plan';
import { citadelScreen } from '../../countryball/citadel-geometry';
import { CAMERAS } from '../../countryball/quang-tri-camera-keys';
import { QuangTriLabels, QuangTriSites } from '../../countryball/quang-tri-map-labels';
import { LowerThird } from '../../countryball/hud-chips';
import { GroundBlast } from '../../countryball/fx-bomb-carpet';
import { project } from '../../countryball/geo-camera';
import { backOut, prog } from '../../countryball/fx-math';
import { Out, Tag } from '../dien-bien-phu-tren-khong/cha-map-scene';
import { QtMap, SIDE, sec } from './cha-common';

// Chapter A, why the small citadel matters / early 1972: A11 pull out from the citadel, A12 back to early 1972 (date rolls back),
// A13 the long war: VNM north, RVN south, USA at sea, years tick 1965 -> 1972.

export const A11: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a11" night={0.35 * (1 - prog(t, 0, 60))} provinces={false}
    keys={[{ t: 0, lon: 107.1835, lat: 16.7545, zoom: 60000 }, { t: 3, ...CAMERAS.binhTriThien }]}
    over={(cam) => {
      const [x, y] = citadelScreen(cam, 0, 0), k = Math.max(0.01, backOut((t - 50) / 12));
      return (
        <g>
          <g transform={`translate(${x},${y - 100}) scale(${k})`}><Out x={0} y={0} size={190} fill="#FFE600">?</Out></g>
          <LowerThird title="Vì sao một tòa thành nhỏ lại quan trọng?" from={0.5} t={sec(t)} />
        </g>
      );
    }}>
    <QuangTriLabels provinces={false} />
    <QuangTriSites only={['quangTri', 'dongHa', 'hue']} />
    <CitadelPlanInMap fadeFrom={9000} fadeTo={40000} />
  </QtMap>
);

/** A circular "rewind" arrow, spinning counter-clockwise. */
const Rewind: React.FC<{ x: number; y: number; r: number; a: number }> = ({ x, y, r, a }) => (
  <g transform={`translate(${x},${y}) rotate(${-a})`}>
    <path d={`M0,${-r} A${r},${r} 0 1 0 ${r * 0.94},${r * 0.34}`} fill="none" stroke="#0B0F16" strokeWidth={34} strokeLinecap="round" />
    <path d={`M0,${-r} A${r},${r} 0 1 0 ${r * 0.94},${r * 0.34}`} fill="none" stroke="#FFD25A" strokeWidth={20} strokeLinecap="round" />
    <polygon points={`${-r * 0.35},${-r - 46} ${-r * 0.35},${-r + 46} ${-r * 0.35 - 70},${-r}`} fill="#FFD25A" stroke="#0B0F16" strokeWidth={8} strokeLinejoin="round" />
  </g>
);

export const A12: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a12" highlight={['VNM']} provinces={false} date={[{ t: 0, label: '7.1972' }, { t: 0.5, label: '1.1972' }]}
    keys={[{ t: 0, lon: 107.6, lat: 15.9, zoom: 64 }, { t: 3.2, lon: 107.4, lat: 16.3, zoom: 78 }]}
    over={() => (
      <g opacity={0.95 * (1 - prog(t, 66, 90))}>
        <Rewind x={1360} y={420} r={110} a={t * 9} />
        <Out x={760} y={930} size={100} opacity={prog(t, 10, 22)}>ĐẦU NĂM 1972</Out>
      </g>
    )} />
);

const YEARS = Array.from({ length: 8 }, (_, i) => ({ t: i * 0.3, label: String(1965 + i) }));

export const A13: React.FC<ShotProps> = ({ t }) => (
  <QtMap t={t} id="a13" highlight={['VNM']} provinces={false} parallel={17} date={YEARS}
    keys={[{ t: 0, lon: 107.5, lat: 15.6, zoom: 66 }, { t: 2.5, lon: 107.3, lat: 15.3, zoom: 73 }]}
    over={(cam) => {
      const hit = (lo: number, la: number, t0: number, r = 20) => { const [x, y] = project(cam, lo, la); return <GroundBlast key={t0 + lo} t={t} t0={t0} x={x} y={y} r={r} linger={60} />; };
      return (
        <g>
          {hit(107.1, 17.0, 6)}{hit(107.2, 16.6, 16)}{hit(108.1, 16.0, 26)}{hit(107.5, 14.2, 36, 22)}{hit(108.4, 13.4, 48)}{hit(107.0, 15.4, 58)}
          <Ball id="a13v" x={500} y={330} r={100} flag="VNM" eyes="determined" hat={<MuCoi camo />} motion={breathe(t, 62)} t={t} />
          <Tag x={500} y={190} text="BẮC" color={SIDE.vnm} />
          <Ball id="a13r" x={520} y={800} r={100} flag="RVN" eyes="determined" hat={<M1Helmet />} motion={breathe(t, 66, 0.03, 14)} t={t} />
          <Tag x={520} y={660} text="NAM" color={SIDE.rvn} />
          <Ball id="a13u" x={1480} y={560} r={100} flag="USA" eyes="determined" hat={<M1Helmet color="#58663C" />} motion={breathe(t, 70, 0.03, 30)} t={t} />
          <Tag x={1480} y={420} text="MỸ" color={SIDE.usa} />
        </g>
      );
    }} />
);
