import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { Headset, MuCoi } from '../../countryball/ball-accessories';
import { breathe } from '../../countryball/ball-motion';
import { SpeechBubble } from '../../countryball/ball-speech-and-props';
import { B52Shootdown } from '../../countryball/fx-b52-hit';
import { BCell } from '../../countryball/fx-flight-path';
import { clamp, easeOut, prog } from '../../countryball/fx-math';
import { FlakBurst, SamLaunch, SamMissile, SamSite } from '../../countryball/fx-sam-and-flak';
import { AaGun, AaTracers } from '../../countryball/fx-tracers-and-lights';
import { RadarScope } from '../../countryball/radar-scope';
import { Banner, Bg, FMap, OutText } from './chf-map-scene';

// Chapter F, F1-F5 (8:41-10:32 words): "the B-52s keep falling, Hà Nội's SAM stock runs low, crews fire only when sure".
// Pure functions of t (frames, 30 fps). Map FX use geo anchors via P() so they stay put while the camera drifts.

const HANOI: [number, number] = [105.84, 21.03];

// F1: a B-52 shot down over Hà Nội at night, SAM trail + flak around it
export const F1: React.FC<ShotProps> = ({ t }) => (
  <FMap t={t} id="f1" night={0.8} date="12.1972" keys={[{ t: 0, lon: 105.8, lat: 21.0, zoom: 430 }, { t: 3, lon: 105.82, lat: 21.02, zoom: 500, ease: 'linear' }]}>
    {({ P }) => {
      const [ax, ay] = P(...HANOI);
      const site: [number, number] = [ax - 400, ay + 200], hit: [number, number] = [ax - 50, ay - 40];
      return (
        <g>
          <SamSite x={site[0]} y={site[1]} r={42} />
          <AaGun x={ax - 150} y={ay + 250} aim={-60} s={1.3} />
          <AaTracers id="f1a" t={t} x={ax - 150} y={ay + 235} aim={-60} reach={520} seed={3} />
          <SamLaunch id="f1s" t={t} t0={4} from={site} to={hit} dur={22} bend={0.2} />
          <FlakBurst id="f1b0" t={t} t0={12} x={ax - 240} y={ay - 110} r={52} />
          <FlakBurst id="f1b1" t={t} t0={18} x={ax - 120} y={ay - 60} r={46} />
          <B52Shootdown id="f1" t={t} t0={26} at={hit} heading={22} size={120} speed={6} fallDur={52} />
          <FlakBurst id="f1b2" t={t} t0={40} x={ax + 120} y={ay - 150} r={50} />
        </g>
      );
    }}
  </FMap>
);

// F2: the SAM stock empties, one missile at a time (no numbers: the script gives none)
export const F2: React.FC<ShotProps> = ({ t }) => {
  const gone = [8, 16, 24, 32, 40, 48, 56];
  const left = 10 - gone.filter((g) => t >= g + 6).length;
  return (
    <FMap t={t} id="f2" night={0.8} veil={0.72} hanoi={false} mini={false} date="12.1972" keys={[{ t: 0, lon: 105.8, lat: 21.0, zoom: 300 }, { t: 3, lon: 105.9, lat: 21.0, zoom: 330, ease: 'linear' }]}>
      {() => (
        <g>
          <OutText x={1130} y={215} text="KHO TÊN LỬA SAM-2" size={74} />
          <rect x={560} y={270} width={1150} height={470} rx={30} fill="#10151D" fillOpacity={0.9} stroke="#E2B95A" strokeWidth={6} />
          {Array.from({ length: 10 }, (_, i) => {
            const cx = 700 + (i % 5) * 220, cy = 505 + (i < 5 ? -90 : 105);
            const tg = i < 7 ? gone[i] : Infinity;
            const u = clamp((t - tg) / 16);
            return (
              <g key={i}>
                <rect x={cx - 66} y={cy - 92} width={132} height={184} rx={16} fill="#1B2430" stroke="#46536A" strokeWidth={4} strokeDasharray="10 8" />
                {u < 1 && (
                  <g opacity={1 - u * u * u} transform={`translate(0,${-easeOut(u) * 230})`}>
                    <SamMissile x={cx} y={cy + 8} heading={-90} size={170} flame={u > 0.01} t={t} />
                  </g>
                )}
              </g>
            );
          })}
          <rect x={560} y={790} width={1150} height={46} rx={23} fill="#10151D" stroke="#E2B95A" strokeWidth={4} />
          <rect x={570} y={800} width={Math.max(24, 1130 * (left / 10))} height={26} rx={13} fill={left > 5 ? '#6FCF6A' : left > 3 ? '#F2B84B' : '#E8353B'} />
          <OutText x={1130} y={888} text="CÒN VƠI DẦN" size={52} color="#FFD98A" />
          <Ball id="f2b" x={310} y={640} r={140} flag="VNM" eyes="worried" hat={<MuCoi />} sweat motion={breathe(t, 60, 0.03)} />
        </g>
      )}
    </FMap>
  );
};

// F3: crews switch to saving rounds: ball with headset beside a radar scope
export const F3: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Bg id="f3" inner="#16304A" outer="#070D16" cx={0.6} />
      <RadarScope id="f3" t={t} cx={1330} cy={520} r={330} period={64} jam={{ center: 70, width: 70, strength: 0.7 }}
        blips={[{ bearing: 38, range: 0.74, vR: -0.0016, target: true }, { bearing: 52, range: 0.55, vR: -0.001 }]} foundAt={20} foundLabel="B-52" />
      <Ball id="f3b" x={470} y={640} r={180} flag="VNM" eyes="determined" hat={<><MuCoi /><Headset /></>} look={0.6} motion={breathe(t, 64, 0.03)} />
      <SpeechBubble x={560} y={250} tipX={500} tipY={470} text={'Tiết kiệm\ntừng quả!'} size={58} t={t} at={6} />
      <OutText x={1330} y={960} text="ĐÁNH TIẾT KIỆM" size={78} color="#FFD98A" opacity={easeOut(prog(t, 4, 14))} />
  </g>
);

// F4: waiting: the cell flies into the ring round a SAM site, nobody fires yet
export const F4: React.FC<ShotProps> = ({ t }) => (
  <FMap t={t} id="f4" night={0.8} date="12.1972" keys={[{ t: 0, lon: 105.7, lat: 21.0, zoom: 380 }, { t: 2, lon: 105.74, lat: 21.02, zoom: 420, ease: 'linear' }]}>
    {({ P }) => {
      const [ax, ay] = P(106.0, 20.93);
      const ring = 360 - 110 * easeOut(prog(t, 0, 50));
      return (
        <g>
          <circle cx={ax} cy={ay} r={360} fill="none" stroke="#FFD166" strokeWidth={3} strokeDasharray="14 12" opacity={0.35} />
          <circle cx={ax} cy={ay} r={ring} fill="#FFD166" fillOpacity={0.07} stroke="#FFD166" strokeWidth={5} strokeDasharray="22 12" />
          <SamSite x={ax} y={ay} r={46} />
          <Ball id="f4b" x={ax - 90} y={ay + 78} r={46} flag="VNM" eyes="determined" hat={<MuCoi />} look={0.8} motion={breathe(t, 50, 0.04)} />
          <BCell id="f4c" t={t} t0={0} t1={64} size={92} points={[[ax - 640, ay - 360], [ax - 330, ay - 190], [ax - 120, ay - 90], [ax + 40, ay - 40]]} />
          <OutText x={ax} y={ay + 190} text="CHỜ..." size={84} color="#FFD98A" opacity={0.6 + 0.4 * Math.sin(t * 0.3)} />
        </g>
      );
    }}
  </FMap>
);

// F5: fires only when sure: launch and hit
export const F5: React.FC<ShotProps> = ({ t }) => (
  <FMap t={t} id="f5" night={0.8} date="12.1972" keys={[{ t: 0, lon: 105.74, lat: 21.02, zoom: 420 }, { t: 2, lon: 105.76, lat: 21.03, zoom: 470, ease: 'linear' }]}>
    {({ P, s }) => {
      const [ax, ay] = P(106.0, 20.93);
      const hit: [number, number] = [ax - 40, ay - 330];
      return (
        <g>
          <SamSite x={ax} y={ay} r={46} />
          <SamLaunch id="f5s" t={t} t0={6} from={[ax, ay]} to={hit} dur={24} bend={0.12} />
          <B52Shootdown id="f5" t={t} t0={30} at={hit} heading={30} size={120} speed={4.5} fallDur={46} />
          <Banner s={s} from={0.15} to={1.7} text="CHỈ PHÓNG KHI CHẮC CHẮN" accent="#FFD166" size={58} y={900} />
        </g>
      );
    }}
  </FMap>
);
