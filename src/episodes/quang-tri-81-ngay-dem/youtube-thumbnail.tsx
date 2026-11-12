import React from 'react';
import { AbsoluteFill } from 'remotion';
import { HookText } from '../../channel/channel-branding';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { CitadelPlan } from '../../countryball/citadel-plan';
import { cameraOnCitadel, citadelScreen } from '../../countryball/citadel-geometry';
import { ShellArc } from '../../countryball/ground-artillery';
import { SmokeColumn } from '../../countryball/ground-weather-and-smoke';
import { Flare } from '../../countryball/fx-tracers-and-lights';
import { Flames } from '../../countryball/fx-bomb-carpet';

// Thumbnail: the Citadel from above at night, walls broken and burning, shells streaking in, a flare hanging over it,
// the Vietnam ball in a camouflaged pith helmet holding firm on the right, and one phrase: 81 NGÀY ĐÊM.
const CAM = cameraOnCitadel(-60, 40, 1.15);
const at = (u: number, v: number) => citadelScreen(CAM, u, v);
// burning points on the walls and gates (citadel frame, metres) with flame size in px
const FIRES: [number, number, number][] = [[240, 0, 70], [-240, 60, 60], [0, 240, 55], [-120, -240, 50], [60, 40, 45], [170, -160, 40]];

export const QuangTri81NgayDemThumbnail: React.FC = () => {
  const [ex, ey] = at(120, -40);
  const [wx, wy] = at(-150, 90);
  return (
    <AbsoluteFill style={{ background: '#0B1218' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <CitadelPlan id="qt-thumb" camera={CAM} t={40} damage={0.82} fires={0.9} night={0.78} />
        <rect width={1920} height={1080} fill="#05080D" opacity={0.18} />
        <SmokeColumn t={60} t0={0} x={ex} y={ey} h={300} w={90} lean={-0.3} fire />
        <SmokeColumn t={45} t0={0} x={wx} y={wy} h={260} w={80} lean={-0.3} fire />
        {FIRES.map(([u, v, s], i) => { const [x, y] = at(u, v); return <Flames key={i} t={9 + i * 4} x={x} y={y} s={s} n={5} seed={i + 1} />; })}
        <ShellArc t={22} t0={0} from={[2100, -200]} to={at(30, 60)} dur={30} lift={160} />
        <ShellArc t={18} t0={0} from={[2050, -320]} to={at(-90, -60)} dur={30} lift={190} />
        <ShellArc t={26} t0={0} from={[1900, -380]} to={at(170, 120)} dur={32} lift={140} />
        <Flare t={50} t0={0} x={1060} y={120} r={170} life={400} />
        <Ball id="qt-th-vn" x={1570} y={790} r={250} flag="VNM" eyes="determined" look={-0.7} tilt={-5} hat={<MuCoi camo />} />
        <HookText lines={['81 NGÀY ĐÊM']} x={80} y={230} size={150} />
      </svg>
    </AbsoluteFill>
  );
};
