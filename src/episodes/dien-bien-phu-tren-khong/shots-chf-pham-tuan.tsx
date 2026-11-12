import React from 'react';
import { ShotProps } from '../../engine';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { Ball } from '../../countryball/countryball';
import { MuCoi, PilotHelmet } from '../../countryball/ball-accessories';
import { breathe } from '../../countryball/ball-motion';
import { B52Shootdown } from '../../countryball/fx-b52-hit';
import { FlightPath, pathAtDist, samplePath } from '../../countryball/fx-flight-path';
import { backOut, easeOut, hash, prog } from '../../countryball/fx-math';
import { Glow, Puff } from '../../countryball/fx-glow';
import { SamLaunch } from '../../countryball/fx-sam-and-flak';
import { DateChip } from '../../countryball/hud-date-chip';
import { LowerThird } from '../../countryball/hud-chips';
import { PhotoCard } from '../../countryball/photo-card';
import { Banner, Bg, FMap, OutText, Place, ramp } from './chf-map-scene';
import { Chase, ChaseCfg, chaseAt } from './chf-chase';
import { NameCard, RadioIcon, Soyuz, StarField } from './chf-icons';
import { FONT } from '../../engine/fonts';

// Chapter F, F6-F15: 27.12.1972, Phạm Tuân's MiG-21 from Yên Bái, VN vs US accounts, then 1980 in space.
// t = frames (30 fps) since the shot started; seconds only where the kit wants them.

const YEN_BAI: [number, number] = [104.95, 21.7];
const MIG_GEO: [number, number][] = [[104.95, 21.7], [105.12, 21.6], [105.4, 21.48], [105.68, 21.32], [105.9, 21.18]];
const DATE = '27.12.1972', NIGHT = 'ĐÊM 10/12';

// F6: the night of 27/12 on the whole of Bắc Bộ, Yên Bái airfield marked
export const F6: React.FC<ShotProps> = ({ t }) => (
  <FMap t={t} id="f6" night={0.8} date={DATE} nightLabel={NIGHT} keys={[{ t: 0, lon: 105.3, lat: 21.35, zoom: 230 }, { t: 2, lon: 105.3, lat: 21.4, zoom: 260, ease: 'linear' }]}>
    {({ P, s }) => {
      const [x, y] = P(...YEN_BAI);
      return (
        <g>
          <circle cx={x} cy={y} r={30 + 18 * ((t % 24) / 24)} fill="none" stroke="#9BD3FF" strokeWidth={4} opacity={1 - (t % 24) / 24} />
          <Place x={x} y={y} name="Yên Bái" size={34} o={ramp(s, 0.2, 0.6)} />
          <Banner s={s} from={0.1} to={1.75} text="ĐÊM 27 THÁNG 12" sub="đêm thứ 10" y={880} />
        </g>
      );
    }}
  </FMap>
);

// F7: the MiG-21 takes off from Yên Bái and heads for Hà Nội (path geo-locked, camera follows)
export const F7: React.FC<ShotProps> = ({ t }) => (
  <FMap t={t} id="f7" night={0.85} date={DATE} nightLabel={NIGHT} keys={[{ t: 0, lon: 105.15, lat: 21.58, zoom: 400 }, { t: 3.9, lon: 105.5, lat: 21.4, zoom: 440, ease: 'linear' }]}>
    {({ P, s }) => {
      const pts = MIG_GEO.map(([a, b]) => P(a, b)), sp = samplePath(pts), start = pathAtDist(sp, 0);
      const [x, y] = P(...YEN_BAI);
      return (
        <g>
          <Place x={x} y={y} name="Sân bay Yên Bái" size={36} o={ramp(s, 2.4, 2.9)} side="l" />
          {t < 20 && <AircraftTop id="f7s" kind="mig21" x={start.x} y={start.y} size={76} heading={start.heading} />}
          <FlightPath id="f7m" t={t} t0={20} t1={118} kind="mig21" size={76} points={pts} sp={sp} route trailLen={380} routeColor="#9BD3FF" />
        </g>
      );
    }}
  </FMap>
);

// F8: name card + the museum MiG-21 no. 5121 (photo)
export const F8: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <FMap t={t} id="f8" night={0.85} veil={0.55} date={DATE} nightLabel={NIGHT} keys={[{ t: 0, lon: 105.4, lat: 21.4, zoom: 330 }, { t: 2.2, lon: 105.5, lat: 21.35, zoom: 350, ease: 'linear' }]}
      top={() => (
        <g>
          <NameCard t={t} at={2} x={590} y={540} name="PHẠM TUÂN" sub="phi công MiG-21" />
          <PhotoCard id="f8p" src="dien-bien-phu-tren-khong/img/mig21-5121-museum.jpg" caption="MiG-21 số hiệu 5121 (bảo tàng)" credit="Ảnh: Gary Todd / CC0"
            x={1430} y={520} w={620} h={414} rot={2.5} from={0.5} to={2.2} t={s} kb={{ z0: 1.0, z1: 1.14, px0: 0.04, py0: 0, px1: -0.03, py1: 0 }} />
        </g>
      )} />
  );
};

// F9: flying silent at night: radio crossed out, MiG moves with no lights
export const F9: React.FC<ShotProps> = ({ t }) => (
  <FMap t={t} id="f9" night={1} veil={0.25} date={DATE} nightLabel={NIGHT} lights={0.5} keys={[{ t: 0, lon: 105.2, lat: 21.5, zoom: 380 }, { t: 1.8, lon: 105.35, lat: 21.42, zoom: 400, ease: 'linear' }]}>
    {({ P, s }) => {
      const sp = samplePath(MIG_GEO.map(([a, b]) => P(a, b))), u = prog(t, 0, 52), p = pathAtDist(sp, (0.15 + 0.7 * u) * sp.total);
      return (
        <g>
          <Glow x={p.x} y={p.y} r={70} color="#9BD3FF" o={0.16} />
          <AircraftTop id="f9m" kind="mig21" x={p.x} y={p.y} size={76} heading={p.heading} opacity={0.9} />
          <rect x={1170} y={190} width={500} height={360} rx={34} fill="#10151D" fillOpacity={0.88} stroke="#9BD3FF" strokeWidth={5} />
          <RadioIcon x={1400} y={420} s={1.25} t={t} slash={easeOut(prog(t, 14, 30))} />
          <Banner s={s} from={0.2} to={1.7} text="GIỮ IM LẶNG" sub="bay trong đêm" y={890} />
        </g>
      );
    }}
  </FMap>
);

const C10: ChaseCfg = { shift: 0, g0: 340, g1: 160, gd: 77 };
const C11: ChaseCfg = { shift: 77, g0: 160, g1: 150, gd: 50 };
const C12: ChaseCfg = { shift: 127, g0: 150, g1: 150, gd: 1 };

// F10: the MiG closes on the cell from behind
export const F10: React.FC<ShotProps> = ({ t }) => (
  <FMap t={t} id="f10" night={0.85} date={DATE} nightLabel={NIGHT} keys={[{ t: 0, lon: 104.6, lat: 21.75, zoom: 450 }, { t: 2.6, lon: 104.95, lat: 21.6, zoom: 450, ease: 'linear' }]}>
    {({ P, s }) => (
      <g>
        <Chase id="f10" P={P} t={t} cfg={C10} reticle={50} />
        <Banner s={s} from={0.5} to={2.5} text="TIẾP CẬN TỪ PHÍA SAU" y={900} size={54} />
      </g>
    )}
  </FMap>
);

// F11: two missiles leave the MiG
export const F11: React.FC<ShotProps> = ({ t }) => (
  <FMap t={t} id="f11" night={0.85} date={DATE} nightLabel={NIGHT} keys={[{ t: 0, lon: 104.95, lat: 21.6, zoom: 450 }, { t: 1.7, lon: 105.1, lat: 21.5, zoom: 480, ease: 'linear' }]}>
    {({ P }) => {
      const m = (tt: number) => chaseAt(P, tt, C11);
      return (
        <g>
          <Chase id="f11" P={P} t={t} cfg={C11} reticle={0} />
          <SamLaunch id="f11a" t={t} t0={6} from={[m(6).mig.x, m(6).mig.y]} to={[m(46).lead.x, m(46).lead.y]} dur={40} bend={0.03} size={56} life={90} />
          <SamLaunch id="f11b" t={t} t0={14} from={[m(14).mig.x, m(14).mig.y]} to={[m(54).lead.x, m(54).lead.y]} dur={40} bend={-0.03} size={56} life={90} />
        </g>
      );
    }}
  </FMap>
);

// F12: Vietnamese account: the first B-52 downed by the air force; the MiG breaks away
export const F12: React.FC<ShotProps> = ({ t }) => (
  <FMap t={t} id="f12" night={0.85} date={DATE} nightLabel={NIGHT} keys={[{ t: 0, lon: 105.1, lat: 21.5, zoom: 480 }, { t: 5.1, lon: 105.3, lat: 21.38, zoom: 540, ease: 'linear' }]}
    top={({ s }) => <LowerThird title="Theo phía Việt Nam" sub="B-52 đầu tiên bị không quân Việt Nam bắn rơi" accent="#C8573F" from={0.4} t={s} />}>
    {({ P }) => {
      const hitT = 8, h = chaseAt(P, hitT, C12), m = (tt: number) => chaseAt(P, tt, C11);
      return (
        <g>
          <SamLaunch id="f12a" t={t} t0={-44} from={[m(6).mig.x, m(6).mig.y]} to={[m(46).lead.x, m(46).lead.y]} dur={40} bend={0.03} size={56} life={90} />
          <SamLaunch id="f12b" t={t} t0={-36} from={[m(14).mig.x, m(14).mig.y]} to={[m(54).lead.x, m(54).lead.y]} dur={40} bend={-0.03} size={56} life={90} />
          <Chase id="f12" P={P} t={t} cfg={C12} wingsOnly peel={hitT + 8} />
          <B52Shootdown id="f12" t={t} t0={hitT} at={[h.lead.x, h.lead.y]} heading={h.lead.heading} size={104} speed={h.speed} fallDur={80} spin={0.8} />
        </g>
      );
    }}
  </FMap>
);

// F13: two accounts, two cards side by side
const Card: React.FC<{ t: number; at: number; x: number; color: string; title: string; lines: string[]; flag: string; hat: React.ReactNode; eyes: 'determined' | 'worried'; children: React.ReactNode }> = ({
  t, at, x, color, title, lines, flag, hat, eyes, children,
}) => {
  const k = backOut(prog(t, at, at + 12));
  if (k <= 0.01) return null;
  return (
    <g transform={`translate(${x},560) scale(${k}) translate(${-x},-560)`}>
      <rect x={x - 405} y={330} width={810} height={560} rx={36} fill="#F6F2E7" stroke="#CFC8B6" strokeWidth={5} />
      <rect x={x - 405} y={330} width={810} height={22} rx={11} fill={color} />
      <Ball id={`f13-${flag}`} x={x} y={300} r={105} flag={flag} eyes={eyes} hat={hat} motion={breathe(t, 60, 0.03)} />
      <text x={x} y={472} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill={color}>{title}</text>
      {children}
      {lines.map((l, i) => <text key={i} x={x} y={800 + i * 52} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={44} fill="#1B1A17">{l}</text>)}
    </g>
  );
};
export const F13: React.FC<ShotProps> = ({ t }) => {
  const nope = easeOut(prog(t, 66, 84));
  return (
    <FMap t={t} id="f13" night={0.85} veil={0.7} hanoi={false} mini={false} date={DATE} nightLabel={NIGHT} keys={[{ t: 0, lon: 105.3, lat: 21.4, zoom: 300 }, { t: 5.2, lon: 105.5, lat: 21.35, zoom: 330, ease: 'linear' }]}
      top={() => (
        <g>
          <Card t={t} at={8} x={495} color="#C8573F" title="THEO PHÍA VIỆT NAM" flag="VNM" hat={<MuCoi />} eyes="determined" lines={['B-52 đầu tiên bị', 'không quân bắn rơi']}>
            <AircraftTop id="f13a" kind="mig21" x={400} y={640} size={150} heading={0} />
            <AircraftTop id="f13b" kind="b52" x={640} y={640} size={150} heading={20} roll={0.9} />
          </Card>
          <Card t={t} at={0} x={1425} color="#4C6A8C" title="THEO PHÍA MỸ" flag="USA" hat={<PilotHelmet />} eyes="worried" lines={['Không có B-52 nào', 'bị MiG bắn rơi']}>
            <AircraftTop id="f13c" kind="mig21" x={1330} y={640} size={150} heading={0} />
            <AircraftTop id="f13d" kind="b52" x={1570} y={640} size={150} heading={20} roll={0.9} />
            <g opacity={nope} transform={`translate(1570,640) scale(${0.6 + 0.4 * nope})`}>
              <circle r={88} fill="none" stroke="#E8353B" strokeWidth={14} />
              <line x1={-62} y1={-62} x2={62} y2={62} stroke="#E8353B" strokeWidth={14} strokeLinecap="round" />
            </g>
          </Card>
        </g>
      )} />
  );
};

// F14: "eight years later": 1972 rolls to 1980 in space
const Space: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <Bg id="sp" inner="#14355A" outer="#05080F" cy={1} />
    <g>
      <StarField t={t} />
      <circle cx={960} cy={1650} r={780} fill="#1D4F7A" stroke="#7CC4FF" strokeWidth={8} />
      <circle cx={960} cy={1650} r={800} fill="none" stroke="#7CC4FF" strokeWidth={26} opacity={0.18} />
    </g>
  </g>
);
export const F14: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 14, 30));
  return (
    <g>
      <Space t={t} />
        <OutText x={960} y={470 - 140 * k} text="1972" size={260} opacity={1 - k} />
        <OutText x={960} y={610 - 140 * k} text="1980" size={260} color="#FFD166" opacity={k} />
        <OutText x={960} y={760} text="TÁM NĂM SAU" size={84} color="#CFE6FF" opacity={easeOut(prog(t, 4, 16))} />
    </g>
  );
};

// F15: Soyuz lifts off; the first Vietnamese in space
export const F15: React.FC<ShotProps> = ({ t }) => {
  const up = easeOut(prog(t, 8, 72)) * 620, fl = 150 * prog(t, 6, 18);
  return (
    <g>
      <Space t={t} />
        {Array.from({ length: 8 }, (_, i) => (
          <Puff key={i} x={1400 + (hash(i, 1) - 0.5) * 90 * (1 + i * 0.3)} y={1010 - up * 0.1 + i * 12} r={30 + i * 9} color="#E8E8EC" o={0.7 * prog(t, 8, 20) * (1 - prog(t, 40, 72))} seed={i} />
        ))}
        <Soyuz x={1400} y={1000 - up} s={1.2} fl={fl} t={t} />
        <OutText x={110} y={400} text="NGƯỜI VIỆT NAM" size={84} anchor="start" opacity={easeOut(prog(t, 4, 16))} />
        <OutText x={110} y={500} text="ĐẦU TIÊN" size={84} anchor="start" color="#FFD166" opacity={easeOut(prog(t, 10, 22))} />
        <OutText x={110} y={600} text="BAY VÀO VŨ TRỤ" size={84} anchor="start" opacity={easeOut(prog(t, 16, 28))} />
        <OutText x={112} y={680} text="Phạm Tuân · Soyuz 37" size={46} anchor="start" font="hand" weight={400} color="#CFE6FF" opacity={easeOut(prog(t, 30, 44))} />
        <DateChip label="1980" t={t / 30} id="f15-date" />
    </g>
  );
};
