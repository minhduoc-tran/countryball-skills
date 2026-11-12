import React from 'react';
import { ShotProps } from '../../engine';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe } from '../../countryball/ball-motion';
import { BCell, FlightPath, pathAtDist, samplePath } from '../../countryball/fx-flight-path';
import { backOut, easeOut, prog } from '../../countryball/fx-math';
import { Glow } from '../../countryball/fx-glow';
import { FlakBurst, SamLaunch } from '../../countryball/fx-sam-and-flak';
import { Flare, Searchlights } from '../../countryball/fx-tracers-and-lights';
import { FONT } from '../../engine/fonts';
import { Banner, Bg, FMap, OutText, Place, ramp } from './chf-map-scene';
import { Candle, Medal, NameCard } from './chf-icons';

// Chapter F, F21-F29: Vũ Xuân Thiều over Sơn La (28.12), the last night (29.12), Nixon halts the bombing north of the
// 20th parallel (30.12), twelve days and nights over. No scene shows the pilot's death: a candle and a medal instead.

const SON_LA: [number, number] = [103.91, 21.33];
const GEO_CELL: [number, number][] = [[102.9, 21.9], [103.9, 21.55], [104.9, 21.3], [105.6, 21.1]];

// F21: Sơn La, a B-52 cell crossing the north-west
export const F21: React.FC<ShotProps> = ({ t }) => (
  <FMap t={t} id="f21" night={0.85} date="28.12.1972" nightLabel="ĐÊM 11/12" keys={[{ t: 0, lon: 104.4, lat: 21.35, zoom: 290 }, { t: 2.4, lon: 104.3, lat: 21.35, zoom: 320, ease: 'linear' }]}>
    {({ P, s }) => {
      const [x, y] = P(...SON_LA);
      return (
        <g>
          <BCell id="f21c" t={t} t0={-20} t1={130} size={84} points={GEO_CELL.map(([a, b]) => P(a, b))} />
          <Place x={x} y={y} name="Sơn La" size={44} o={ramp(s, 0.5, 1)} side="b" />
        </g>
      );
    }}
  </FMap>
);

// F22: pilot name card, then the MiG-21 sets off over the hills
export const F22: React.FC<ShotProps> = ({ t }) => (
  <FMap t={t} id="f22" night={0.85} veil={0.35} date="28.12.1972" nightLabel="ĐÊM 11/12" keys={[{ t: 0, lon: 104.3, lat: 21.35, zoom: 340 }, { t: 3.3, lon: 104.5, lat: 21.4, zoom: 360, ease: 'linear' }]}
    top={() => <NameCard t={t} at={0} x={640} y={400} name="VŨ XUÂN THIỀU" sub="phi công MiG-21" />}>
    {({ P }) => (
      <g>
        <FlightPath id="f22m" t={t} t0={36} t1={110} kind="mig21" size={80} trailLen={380}
          points={[[103.5, 21.0], [104.0, 21.15], [104.6, 21.28], [105.2, 21.3]].map(([a, b]) => P(a, b))} />
      </g>
    )}
  </FMap>
);

// F23: the MiG dives on the cell, fires, and a bright flash at the contact point (no outcome shown)
export const F23: React.FC<ShotProps> = ({ t }) => (
  <FMap t={t} id="f23" night={0.85} date="28.12.1972" nightLabel="ĐÊM 11/12" keys={[{ t: 0, lon: 104.5, lat: 21.4, zoom: 420 }, { t: 2.7, lon: 104.65, lat: 21.35, zoom: 470, ease: 'linear' }]}>
    {({ P }) => {
      const cellPts = [[103.7, 21.75], [104.5, 21.5], [105.4, 21.2], [106.0, 21.0]].map(([a, b]) => P(a, b)), sp = samplePath(cellPts);
      const lead = (tt: number) => pathAtDist(sp, prog(tt, -30, 150) * sp.total);
      const L = lead(68), mig: [number, number][] = [P(103.65, 22.1), P(104.1, 21.9), [L.x - 70, L.y - 55]];
      const msp = samplePath(mig), mp = (tt: number) => pathAtDist(msp, prog(tt, 0, 68) * msp.total);
      const flash = prog(t, 68, 72) * (1 - prog(t, 72, 86));
      return (
        <g>
          <BCell id="f23c" t={t} t0={-30} t1={150} size={88} points={cellPts} />
          <FlightPath id="f23m" t={t} t0={0} t1={68} kind="mig21" size={80} points={mig} sp={msp} trailLen={400} />
          <SamLaunch id="f23a" t={t} t0={40} from={[mp(40).x, mp(40).y]} to={[lead(70).x, lead(70).y]} dur={30} bend={0.04} size={50} life={80} />
          <Glow x={lead(t).x} y={lead(t).y} r={260 * flash} color="#FFFFFF" o={0.9 * flash} />
          <FlakBurst id="f23f" t={t} t0={72} x={lead(72).x + 40} y={lead(72).y + 30} r={50} />
        </g>
      );
    }}
  </FMap>
);

// F24: quiet: a candle, the name, the years, "27 tuổi"
export const F24: React.FC<ShotProps> = ({ t }) => {
  const k = ramp(t, 54, 70), dim = ramp(t, 0, 20);
  return (
    <g>
      <Bg id="f24" inner="#2A1D14" outer="#07090E" cy={0.78} />
        <OutText x={960} y={250} text="VŨ XUÂN THIỀU" size={92} opacity={dim} />
        <OutText x={960} y={340} text="1945 – 1972" size={62} font="hand" weight={400} color="#D9CBB4" opacity={dim} />
        <OutText x={960} y={520} text="27 TUỔI" size={150} color="#FFD98A" opacity={k} />
        <Candle t={t} x={960} y={950} s={1.7} />
    </g>
  );
};

// F25: posthumous title of Hero of the People's Armed Forces
export const F25: React.FC<ShotProps> = ({ t }) => {
  const k = backOut(prog(t, 4, 24));
  return (
    <g>
      <Bg id="f25" inner="#4A1D1B" outer="#0A0A10" cy={0.36} />
        {Array.from({ length: 14 }, (_, i) => (
          <polygon key={i} points="0,0 -40,-520 40,-520" fill="#FFD166" opacity={0.07} transform={`translate(960,400) rotate(${i * (360 / 14) + t * 0.15})`} />
        ))}
        <g transform={`translate(960,400) scale(${k}) translate(-960,-400)`}><Medal x={960} y={400} r={140} t={t} /></g>
        <OutText x={960} y={690} text="TRUY TẶNG" size={58} font="hand" weight={400} color="#FFD98A" opacity={ramp(t, 24, 40)} />
        <OutText x={960} y={790} text="ANH HÙNG LỰC LƯỢNG" size={84} opacity={ramp(t, 30, 46)} />
        <OutText x={960} y={890} text="VŨ TRANG NHÂN DÂN" size={84} opacity={ramp(t, 38, 54)} />
        <Ball id="f25b" x={300} y={820} r={110} flag="VNM" eyes="sad" hat={<MuCoi />} motion={breathe(t, 70, 0.025)} />
    </g>
  );
};

// F26: the last night over Hà Nội
export const F26: React.FC<ShotProps> = ({ t }) => (
  <FMap t={t} id="f26" night={0.9} date="29.12.1972" nightLabel="ĐÊM 12/12" keys={[{ t: 0, lon: 105.8, lat: 21.02, zoom: 480 }, { t: 3.3, lon: 105.86, lat: 21.04, zoom: 540, ease: 'linear' }]}>
    {({ P, s }) => {
      const [ax, ay] = P(105.84, 21.03);
      return (
        <g>
          <Searchlights t={t} length={700} sources={[{ x: ax - 520, y: ay + 330, base: -50, swing: 25, period: 150 }, { x: ax + 20, y: ay + 360, base: -90, swing: 30, period: 130, phase: 0.4 }, { x: ax + 560, y: ay + 330, base: -125, swing: 22, period: 140 }]} />
          <Flare t={t} t0={6} x={ax - 300} y={ay - 220} r={150} /><Flare t={t} t0={50} x={ax + 330} y={ay - 180} r={130} />
          <BCell id="f26c" t={t} t0={-15} t1={130} size={96} points={[[ax - 900, ay - 330], [ax - 300, ay - 120], [ax + 300, ay + 20], [ax + 900, ay + 160]]} />
          <SamLaunch id="f26s" t={t} t0={34} from={[ax - 470, ay + 280]} to={[ax - 90, ay - 60]} dur={30} bend={0.2} />
          <FlakBurst id="f26f" t={t} t0={64} x={ax - 80} y={ay - 70} r={52} />
          <Banner s={s} from={1.6} to={3.2} text="ĐÊM NÉM BOM CUỐI CÙNG" accent="#FFD166" size={58} y={910} />
        </g>
      );
    }}
  </FMap>
);

// F27: 30.12 morning: Nixon's order, "NGỪNG NÉM BOM MIỀN BẮC" stamped
export const F27: React.FC<ShotProps> = ({ t }) => {
  const st = prog(t, 64, 72), k = 1 + 1.4 * (1 - easeOut(st));
  return (
    <FMap t={t} id="f27" night={0.8 * (1 - ramp(t, 0, 70))} veil={0.5} hanoi={false} nightLabel={undefined}
      date={[{ t: 0, label: '29.12.1972' }, { t: 0.35, label: '30.12.1972' }]} keys={[{ t: 0, lon: 105.6, lat: 21.0, zoom: 260 }, { t: 3.8, lon: 105.7, lat: 20.9, zoom: 290, ease: 'linear' }]}
      top={() => (
        <g>
          <NameCard t={t} at={22} x={600} y={520} name="TỔNG THỐNG NIXON" sub="Hoa Kỳ" cap={false} accent="#4C6A8C" w={900} />
          <AircraftTop id="f27b" kind="b52" x={1450} y={760} size={190} heading={0} opacity={0.55} />
          {st > 0 && (
            <g transform={`translate(1440,450) rotate(-8) scale(${k})`} opacity={st}>
              <rect x={-330} y={-110} width={660} height={220} rx={18} fill="#10151D" fillOpacity={0.55} stroke="#E8353B" strokeWidth={14} />
              <text y={-6} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#FF6B6B">NGỪNG NÉM BOM</text>
              <text y={76} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={66} fill="#FF6B6B">MIỀN BẮC</text>
            </g>
          )}
        </g>
      )} />
  );
};

// F28: north of the 20th parallel
export const F28: React.FC<ShotProps> = ({ t }) => (
  <FMap t={t} id="f28" night={0} parallel={20} date="30.12.1972" keys={[{ t: 0, lon: 105.6, lat: 20.7, zoom: 165 }, { t: 2, lon: 105.6, lat: 20.65, zoom: 185, ease: 'linear' }]}>
    {({ P, s }) => {
      const y20 = P(105.6, 20)[1];
      return (
        <g>
          <rect x={0} y={0} width={1920} height={y20} fill="#6FCF6A" opacity={0.17 * ramp(t, 4, 24)} />
          <rect x={0} y={y20 - 6} width={1920 * ramp(t, 0, 20)} height={12} fill="#FFD166" opacity={0.95} />
          <OutText x={960} y={200} text="NGỪNG NÉM BOM" size={96} color="#B8F5B0" opacity={ramp(t, 10, 26)} />
          <Banner s={s} from={0.5} to={1.95} text="TỪ VĨ TUYẾN 20 TRỞ RA" accent="#6FCF6A" size={58} y={940} />
        </g>
      );
    }}
  </FMap>
);

// F29: twelve nights ticked off as the sky brightens; "12 ngày đêm đã kết thúc"
export const F29: React.FC<ShotProps> = ({ t }) => (
  <FMap t={t} id="f29" night={0.85 * (1 - ramp(t, 4, 60))} veil={0.5} hanoi={false} mini={false} date="12.1972" keys={[{ t: 0, lon: 105.8, lat: 21.0, zoom: 320 }, { t: 2.8, lon: 105.8, lat: 21.0, zoom: 360, ease: 'linear' }]}
    top={() => (
      <g>
        <OutText x={960} y={330} text="12 NGÀY ĐÊM" size={140} color="#FFD166" opacity={ramp(t, 44, 56)} />
        {Array.from({ length: 12 }, (_, i) => {
          const at = 4 + i * 3, lit = backOut(prog(t, at, at + 6)), cx = 235 + i * 131;
          return (
            <g key={i}>
              <circle cx={cx} cy={560} r={52} fill="#10151D" stroke="#46536A" strokeWidth={5} />
              <circle cx={cx} cy={560} r={52 * Math.min(1, lit)} fill="#FFD166" stroke="#15181F" strokeWidth={5} opacity={lit > 0 ? 1 : 0} />
              <text x={cx} y={575} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill={t >= at ? '#2A1D14' : '#8EA0B8'}>{18 + i}</text>
            </g>
          );
        })}
        <OutText x={960} y={690} text="THÁNG 12 · 1972" size={46} font="hand" weight={400} color="#CFE6FF" opacity={ramp(t, 30, 44)} />
        <OutText x={960} y={860} text="ĐÃ KẾT THÚC" size={110} opacity={ramp(t, 56, 68)} />
      </g>
    )} />
);
