import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { UsafCap } from '../../countryball/ball-accessories';
import { breathe, hopOnce, mixMotion } from '../../countryball/ball-motion';
import { DocumentProp } from '../../countryball/ball-speech-and-props';
import { BCell, BWave } from '../../countryball/fx-flight-path';
import { Flames } from '../../countryball/fx-bomb-carpet';
import { SamLaunch } from '../../countryball/fx-sam-and-flak';
import { B52Shootdown } from '../../countryball/fx-b52-hit';
import { Glow } from '../../countryball/fx-glow';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { Counter } from '../../countryball/hud-counter';
import { DateChip } from '../../countryball/hud-date-chip';
import { LowerThird, NightChip } from '../../countryball/hud-chips';
import { Pt, backOut, clamp, prog } from '../../countryball/fx-math';
import { Chip, DimMap, Headline, MapStage, drift, ll } from './chd-common';
import { Donut, StatCard } from './chd-props';

// Chapter D, night three (20/12/1972): the worst night for the B-52 force (US figure 6 of 99), the pause for
// thought at Guam, and the new routes. D29-D36.

const px = (cam: Parameters<typeof ll>[0], pts: [number, number][]): Pt[] => pts.map(([lo, la]) => ll(cam, lo, la));

/** D29: "đêm 20 tháng 12": the date rolls from 19 to 20 and a big stamp slams in over the arriving wave. */
export const D29: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, n = s < 0.5 ? 2 : 3;
  return (
    <MapStage id="D29" t={t} keys={drift(104.8, 20.7, 330, 0.3, 0.1, 15, 1.9)} date={[{ t: 0, label: '19.12.1972' }, { t: 0.5, label: '20.12.1972' }]}
      nightChip={`ĐÊM ${n}/12`} nightSince={n === 2 ? -5 : 0.5} cities={['hanoi']}>
      {(cam) => (
        <g>
          <BWave id="D29-w" t={t} size={60} trailLen={300} cells={[
            { points: px(cam, [[101.5, 19.8], [103.6, 20.4], [105.85, 21.0]]), t0: 0, t1: 62 },
            { points: px(cam, [[101.7, 21.0], [103.8, 21.2], [105.85, 21.06]]), t0: 10, t1: 72 },
          ]} />
          <Headline x={960} y={620} text="20/12" t={t} at={16} size={260} until={52} />
        </g>
      )}
    </MapStage>
  );
};

/** D30: the worst night: cells over Hà Nội, SAMs climbing, B-52s burning and falling (US figures come on screen next). */
export const D30: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <MapStage id="D30" t={t} keys={drift(105.8, 21.0, 560, 0.02, 0.0, 30, 2.8)} night={0.85} date="20.12.1972" nightChip="ĐÊM 3/12" nightSince={-5} pulse={0.3} cities={['hanoi']}
      hud={<LowerThird title="Đêm 20/12/1972" sub="Đêm tồi tệ nhất trong lịch sử của B-52" from={0.2} to={2.8} t={s} />}>
      {(cam) => (
        <g>
          <BWave id="D30-w" t={t} size={96} trailLen={360} cells={[
            { points: px(cam, [[104.6, 20.5], [105.3, 20.7], [106.6, 20.9]]).map((p) => [p[0], p[1] - 260] as Pt), t0: 0, t1: 84 },
            { points: px(cam, [[104.6, 21.6], [105.4, 21.5], [106.6, 21.3]]), t0: 4, t1: 88 },
          ]} />
          <SamLaunch id="D30-a" t={t} t0={6} from={[600, 960]} to={[904, 396]} dur={28} bend={0.2} size={70} />
          <B52Shootdown id="D30-s1" t={t} t0={34} at={[900, 420]} heading={10} speed={6} fallDur={40} size={110} />
          <SamLaunch id="D30-b" t={t} t0={28} from={[1560, 960]} to={[1254, 566]} dur={32} bend={-0.2} size={70} />
          <B52Shootdown id="D30-s2" t={t} t0={60} at={[1250, 590]} heading={10} speed={6} fallDur={40} size={110} />
        </g>
      )}
    </MapStage>
  );
};

const LOST = [8, 24, 37, 52, 68, 85];

/** D31: 99 B-52 pop up one by one, then six of them burn out: the US Air Force figure for 20/12. */
export const D31: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <g>
      <defs><radialGradient id="D31-bg" cx="0.5" cy="0.45" r="0.8"><stop offset="0" stopColor="#1A2538" /><stop offset="1" stopColor="#080C14" /></radialGradient></defs>
      <rect width={1920} height={1080} fill="url(#D31-bg)" />
      {Array.from({ length: 99 }, (_, i) => {
        const x = 370 + (i % 11) * 118, y = 250 + Math.floor(i / 11) * 70, born = 2 + i * 0.5, k = backOut(clamp((t - born) / 8));
        const lostIdx = LOST.indexOf(i), tl = lostIdx >= 0 ? 54 + lostIdx * 3 : Infinity, a = t - tl;
        if (k <= 0) return null;
        const alive = a < 0 ? 1 : 1 - 0.82 * prog(a, 14, 34);
        return (
          <g key={i} transform={`translate(${x},${y}) scale(${k})`}>
            <AircraftTop id={`D31-${i}`} kind="b52" size={66} x={0} y={0} heading={-90} shadow={false} opacity={alive} />
            {a >= 0 && a < 60 && <circle r={36 + (a % 20)} fill="none" stroke="#FF4B3A" strokeWidth={5} opacity={0.9 * (1 - (a % 20) / 20)} />}
            {a >= 0 && <Glow x={0} y={0} r={46 * (1 - prog(a, 18, 50))} color="#FF6A1A" o={0.9} />}
            {a >= 0 && a < 50 && <Flames t={t} x={0} y={8} s={26 * (1 - prog(a, 20, 50))} n={3} seed={i} />}
          </g>
        );
      })}
      <DateChip label="20.12.1972" t={s} id="D31-date" />
      <NightChip label="ĐÊM 3/12" t={s} />
      <Counter label="B-52 BAY TỚI" steps={[{ t: 0.1, value: 0 }, { t: 1.7, value: 99 }]} t={s} />
      <LowerThird title="Đêm 20/12: 6 / 99 B-52 không trở về" sub="Theo Không quân Mỹ" from={1.9} t={s} />
    </g>
  );
};

/** D32: the figure as a plain card, attributed to the US Air Force. */
export const D32: React.FC<ShotProps> = ({ t }) => (
  <g>
    <DimMap id="D32" t={t} lon={105.6} lat={20.8} zoom={230} dim={0.74} />
    <Ball id="D32-us" x={420} y={680} r={140} flag="USA" eyes="worried" hat={<UsafCap />} motion={breathe(t, 82, 0.035)} />
    <DocumentProp x={610} y={820} s={2.1} rot={-8} title="SỐ LIỆU" />
    <StatCard x={1220} y={540} w={960} h={540} kicker="SỐ LIỆU CỦA KHÔNG QUÂN MỸ" big="6 / 99" l1="B-52 không trở về" l2="Đêm 20/12/1972" t={t} at={4} />
  </g>
);

/** D33: six per cent of the force in one night, as a donut. */
export const D33: React.FC<ShotProps> = ({ t }) => (
  <g>
    <defs><radialGradient id="D33-bg" cx="0.35" cy="0.5" r="0.9"><stop offset="0" stopColor="#1A2538" /><stop offset="1" stopColor="#080C14" /></radialGradient></defs>
    <rect width={1920} height={1080} fill="url(#D33-bg)" />
    <Donut t={t} cx={620} cy={540} r={230} pct={6} at={6} dur={40} label="6%" />
    <Headline x={1330} y={450} text="MẤT 6% SỐ MÁY BAY" t={t} at={8} size={62} />
    <Headline x={1330} y={540} text="CHỈ TRONG MỘT ĐÊM" t={t} at={22} size={62} color="#F4F4F4" />
    <Chip x={1330} y={680} text="THEO KHÔNG QUÂN MỸ" t={t} at={36} size={40} />
  </g>
);

/** D34: a force that cannot take losses like that for long: worried USA ball and the plain statement. */
export const D34: React.FC<ShotProps> = ({ t }) => (
  <g>
    <DimMap id="D34" t={t} lon={105.6} lat={20.8} zoom={230} dim={0.74} />
    <Ball id="D34-us" x={520} y={620} r={170} flag="USA" eyes="worried" sweat hat={<UsafCap />} motion={mixMotion(breathe(t, 60, 0.04), hopOnce(t, 70, 14, 10))} />
    <Headline x={1330} y={500} text="KHÔNG LỰC NÀO" t={t} at={22} size={84} color="#F4F4F4" />
    <Headline x={1330} y={600} text="CHỊU NỔI LÂU DÀI" t={t} at={38} size={84} />
  </g>
);

/** D35: the camera crosses the Pacific to Guam, where the commanders have to change the plan. */
export const D35: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  const keys = [{ t: 0, lon: 127, lat: 16, zoom: 24 }, { t: 2.4, lon: 143.6, lat: 14.0, zoom: 170 }];
  return (
    <MapStage id="D35" t={t} keys={keys} night={0.35} date="12.1972" cities={['guam', 'hanoi']} cityMin={0} highlight={['VNM', 'GUM']}
      hud={<LowerThird title="Guam (Andersen)" sub="Các chỉ huy buộc phải đổi cách đánh" from={0.2} to={2.4} t={s} />}>
      {(cam) => {
        const [gx, gy] = ll(cam, 144.93, 13.58), k = backOut(clamp((t - 22) / 12));
        return (
          <g opacity={k}>
            <Ball id="D35-us" x={gx - 20} y={gy - 150} r={64} flag="USA" eyes="determined" hat={<UsafCap />} motion={breathe(t, 66)} />
            <DocumentProp x={gx + 80} y={gy - 120} s={1.0} rot={8} title="KẾ HOẠCH" />
          </g>
        );
      }}
    </MapStage>
  );
};

const OLD_ROUTE: [number, number][] = [[101.3, 19.7], [103.4, 20.4], [105.5, 21.0], [105.95, 21.06]];
const NEW_ROUTES: { pts: [number, number][]; t0: number }[] = [
  { pts: [[105.9, 23.2], [105.85, 22.0], [105.85, 21.1]], t0: 6 },
  { pts: [[108.3, 19.5], [107.0, 20.3], [106.0, 20.95]], t0: 36 },
  { pts: [[102.6, 22.2], [104.4, 21.6], [105.7, 21.1]], t0: 66 },
];

/** D36: the old route is struck out; new routes, new heights and new attack directions appear one by one. */
export const D36: React.FC<ShotProps> = ({ t }) => (
  <MapStage id="D36" t={t} keys={drift(105.7, 20.9, 330, 0.1, 0.0, 15, 4.2)} night={0.85} date="12.1972" cities={['hanoi', 'haiphong']} cityMin={200}>
    {(cam) => {
      const old = px(cam, OLD_ROUTE), mid = old[1], gone = 1 - prog(t, 14, 30);
      return (
        <g>
          <polyline points={old.map((p) => p.join(',')).join(' ')} fill="none" stroke="#9AA5B1" strokeWidth={5} strokeDasharray="12 10" opacity={0.7 * gone} />
          <g opacity={gone}>
            <line x1={mid[0] - 40} y1={mid[1] - 40} x2={mid[0] + 40} y2={mid[1] + 40} stroke="#FF5A4A" strokeWidth={12} strokeLinecap="round" />
            <line x1={mid[0] + 40} y1={mid[1] - 40} x2={mid[0] - 40} y2={mid[1] + 40} stroke="#FF5A4A" strokeWidth={12} strokeLinecap="round" />
          </g>
          {NEW_ROUTES.map((r, i) => (
            <BCell key={i} id={`D36-r${i}`} t={t} size={60} t0={r.t0} t1={r.t0 + 62} trailLen={300} route points={px(cam, r.pts)} />
          ))}
          <Chip x={400} y={640} text="ĐƯỜNG BAY MỚI" t={t} at={2} size={44} />
          <Chip x={400} y={740} text="ĐỘ CAO MỚI" t={t} at={32} size={44} />
          <Chip x={400} y={840} text="HƯỚNG TẤN CÔNG MỚI" t={t} at={62} size={44} />
        </g>
      );
    }}
  </MapStage>
);
