import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { Ball } from '../../countryball/countryball';
import { Headset } from '../../countryball/ball-accessories';
import { breathe, hopOnce, mixMotion, talk } from '../../countryball/ball-motion';
import { BinocularsProp, SpeechBubble } from '../../countryball/ball-speech-and-props';
import { BCell, pathAtDist, samplePath } from '../../countryball/fx-flight-path';
import { BombCarpet } from '../../countryball/fx-bomb-carpet';
import { FlakBurst, SamLaunch, SamSite } from '../../countryball/fx-sam-and-flak';
import { AircraftSide } from '../../countryball/aircraft-side-view';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { RadarScope } from '../../countryball/radar-scope';
import { AScope, ManualNotebook } from '../../countryball/radar-ascope-and-notebook';
import { LowerThird } from '../../countryball/hud-chips';
import { PhotoCard } from '../../countryball/photo-card';
import { DateChip } from '../../countryball/hud-date-chip';
import { Pt, easeInOut, polar, prog } from '../../countryball/fx-math';
import { Chip, Headline, MapStage, PHOTO_CREDIT_GRAU, RAID_MAP_PHOTO, drift, ll } from './chd-common';
import { JamCone, RouteSketch, SkyBackdrop } from './chd-props';
import { BankPlane } from './chd-flight-bits';

// Chapter D, "same routes" and the post-target turn weakness: D8-D17.

const ROUTE: [number, number][] = [[101.3, 19.7], [103.4, 20.4], [105.5, 21.0], [105.95, 21.06]];

/** D8: three nights, one route: cells fly the same dashed line; the US raid diagram (19/12) lands beside it. */
export const D8: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, nightNo = s < 0.9 ? 1 : s < 1.8 ? 2 : 3;
  return (
    <MapStage id="D8" t={t} keys={drift(104.2, 20.4, 215, 0.3, 0.1, 12, 2.7)} nightChip={`ĐÊM ${nightNo}/12`} nightSince={nightNo === 1 ? -5 : nightNo === 2 ? 0.9 : 1.8}
      date={[{ t: 0, label: '18.12.1972' }, { t: 0.9, label: '19.12.1972' }, { t: 1.8, label: '20.12.1972' }]}
      hud={<>
        <LowerThird title="Cùng một đường bay" sub="Đêm 1, đêm 2, đêm 3" from={0.5} to={2.7} t={s} />
        <PhotoCard id="D8-ph" src={RAID_MAP_PHOTO} caption="Sơ đồ đợt tập kích đêm 19/12/1972" credit={PHOTO_CREDIT_GRAU} x={1460} y={450} w={600} h={370} rot={2.5} from={0.35} to={2.7} t={s} />
      </>}>
      {(cam) => (
        <g>
          {[0, 28, 56].map((t0, i) => (
            <BCell key={i} id={`D8-c${i}`} t={t} size={62} t0={t0} t1={t0 + 46} trailLen={360} route={i === 0} points={ROUTE.map(([lo, la]) => ll(cam, lo, la) as Pt)} />
          ))}
        </g>
      )}
    </MapStage>
  );
};

/** D9: same altitude: three B-52 (one per night) strung along one dashed height line over the roofs. */
export const D9: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <g>
      <SkyBackdrop id="D9" />
      <line x1={140} y1={400} x2={1860} y2={400} stroke="#E2B95A" strokeWidth={5} strokeDasharray="26 16" opacity={0.9} />
      <line x1={110} y1={890} x2={110} y2={420} stroke="#9DB4CC" strokeWidth={5} />
      <polygon points="110,400 96,432 124,432" fill="#9DB4CC" />
      {[0, 1, 2].map((i) => {
        const x = 330 + i * 600 + t * 3.2, op = 1 - (2 - i) * 0.0;
        return (
          <g key={i}>
            <AircraftSide kind="b52" x={x} y={400 + Math.sin((t + i * 20) / 18) * 4} size={380} opacity={op} />
            <Chip x={x} y={290} text={`ĐÊM ${i + 1}`} t={t} at={6 + i * 8} size={36} />
          </g>
        );
      })}
      <Chip x={960} y={560} text="CÙNG MỘT ĐỘ CAO" t={t} at={22} size={54} />
      <DateChip label="19.12.1972" t={s} id="D9-date" />
    </g>
  );
};

const TURN_ROUTE: [number, number][] = [[105.45, 21.0], [105.95, 21.06], [106.2, 20.95], [106.15, 20.75], [105.8, 20.62]];

/** D10: the same turning spot: cells reach it and swing round inside a pulsing ring. */
export const D10: React.FC<ShotProps> = ({ t }) => (
  <MapStage id="D10" t={t} keys={drift(105.95, 20.9, 640, -0.04, 0.0, 40, 1.8)} date="19.12.1972" nightChip="ĐÊM 2/12" nightSince={-5} cities={['hanoi', 'haiphong']} cityMin={300}>
    {(cam) => {
      const [mx, my] = ll(cam, 106.2, 20.92), pulse = 1 + 0.12 * Math.sin(t * 0.5);
      return (
        <g>
          <circle cx={mx} cy={my} r={86 * pulse} fill="#E5483A" fillOpacity={0.14} stroke="#FF6A5A" strokeWidth={6} strokeDasharray="14 10" />
          {[-14, 0, 14].map((t0, i) => (
            <BCell key={i} id={`D10-c${i}`} t={t} size={58} t0={t0} t1={t0 + 64} trailLen={300} route={i === 0} points={TURN_ROUTE.map(([lo, la]) => ll(cam, lo, la) as Pt)} />
          ))}
          <Chip x={mx + 110} y={my - 230} text="CÙNG MỘT CHỖ QUAY ĐẦU" t={t} at={6} size={38} />
        </g>
      );
    }}
  </MapStage>
);

/** D11: a missile crew's lesson book: the sketched route gets less scattered every night. */
export const D11: React.FC<ShotProps> = ({ t }) => (
  <g>
    <defs>
      <radialGradient id="D11-lamp" cx="0.5" cy="0.45" r="0.7"><stop offset="0" stopColor="#3C4A32" /><stop offset="1" stopColor="#0E150F" /></radialGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#D11-lamp)" />
    <Headline x={960} y={170} text="MỖI ĐÊM LÀ MỘT BÀI HỌC" t={t} at={2} size={86} />
    <Ball id="D11-vn" x={270} y={640} r={130} flag="VNM" eyes="determined" hat={<Headset />} motion={mixMotion(breathe(t, 70), hopOnce(t, 70, 20, 24))} />
    <ManualNotebook x={430} y={880} s={1.15} rot={-8} />
    <RouteSketch id="D11-a" x={780} y={600} w={400} h={340} t={t} at={14} title="Đêm 1" wobble={34} ghosts={1} />
    <RouteSketch id="D11-b" x={1210} y={600} w={400} h={340} t={t} at={44} title="Đêm 2" wobble={16} ghosts={2} />
    <RouteSketch id="D11-c" x={1640} y={600} w={400} h={340} t={t} at={74} title="Đêm 3" wobble={0} ghosts={3} mark />
  </g>
);

/** D12: the crews start to predict: first where the bombers come from, then where they turn. */
export const D12: React.FC<ShotProps> = ({ t }) => {
  const entry: [number, number] = [103.75, 20.58], turn: [number, number] = [106.15, 20.9];
  const path: [number, number][] = [entry, [104.6, 20.78], [105.5, 21.0]];
  return (
    <MapStage id="D12" t={t} keys={drift(105.0, 20.9, 450, 0.1, 0.0, 30, 3.8)} date="19.12.1972" nightChip="ĐÊM 2/12" nightSince={-5} cities={['hanoi']}>
      {(cam) => {
        const pts = path.map(([lo, la]) => ll(cam, lo, la)), e = ll(cam, entry[0], entry[1]), u = ll(cam, turn[0], turn[1]);
        const grow = prog(t, 40, 70), n = Math.max(2, Math.ceil(pts.length * grow));
        return (
          <g>
            {t > 40 && <polyline points={pts.slice(0, n).map((p) => p.join(',')).join(' ')} fill="none" stroke="#FFD166" strokeWidth={6} strokeDasharray="16 12" strokeLinecap="round" />}
            {t > 42 && <circle cx={e[0]} cy={e[1]} r={60 + 6 * Math.sin(t * 0.5)} fill="none" stroke="#FFD166" strokeWidth={6} />}
            <Chip x={e[0] + 60} y={e[1] - 100} text="ĐẾN TỪ ĐÂU?" t={t} at={42} size={38} />
            {t > 72 && <circle cx={u[0]} cy={u[1]} r={70 + 6 * Math.sin(t * 0.5)} fill="#E5483A" fillOpacity={0.15} stroke="#FF6A5A" strokeWidth={6} strokeDasharray="14 10" />}
            <Chip x={u[0]} y={u[1] - 130} text="QUAY ĐẦU Ở ĐÂU?" t={t} at={72} size={38} />
            <SamSite x={640} y={820} r={36} />
            <Ball id="D12-vn" x={230} y={800} r={80} flag="VNM" eyes="determined" hat={<Headset />} look={t > 40 ? 1 : 0} motion={breathe(t, 66)} />
            <BinocularsProp x={350} y={740} s={1.3} rot={22} />
          </g>
        );
      }}
    </MapStage>
  );
};

/** D13: the weak spot found: a big B-52 in crosshair brackets, ECM rings, and the crew ball who spotted it. */
export const D13: React.FC<ShotProps> = ({ t }) => {
  const k = easeInOut(prog(t, 40, 64)), br = 330 - 70 * k;
  return (
    <g>
      <defs><radialGradient id="D13-bg" cx="0.6" cy="0.5" r="0.8"><stop offset="0" stopColor="#1B2A3F" /><stop offset="1" stopColor="#070B12" /></radialGradient></defs>
      <rect width={1920} height={1080} fill="url(#D13-bg)" />
      <Headline x={960} y={150} text="MỘT ĐIỂM YẾU" t={t} at={4} size={110} />
      {[0, 1, 2].map((i) => {
        const a = ((t * 1.6 + i * 40) % 120) / 120;
        return <circle key={i} cx={1200} cy={600} r={150 + a * 380} fill="none" stroke="#FFB347" strokeWidth={6} opacity={0.5 * (1 - a)} />;
      })}
      <AircraftTop id="D13-b52" kind="b52" size={640} x={1200} y={600} heading={0 + Math.sin(t / 25) * 2} />
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => (
        <path key={i} d={`M${1200 + sx * br},${600 + sy * (br - 40) - sy * 70} L${1200 + sx * br},${600 + sy * (br - 40)} L${1200 + sx * (br - 70)},${600 + sy * (br - 40)}`} fill="none" stroke="#FF5A4A" strokeWidth={9} strokeLinecap="round" opacity={prog(t, 36, 46)} />
      ))}
      <Chip x={1200} y={930} text="CÁC KÍP TÊN LỬA NHẬN RA" t={t} at={30} size={40} />
      <Ball id="D13-vn" x={330} y={700} r={125} flag="VNM" eyes={t > 44 ? 'shock' : 'determined'} hat={<Headset />} motion={mixMotion(breathe(t, 66), hopOnce(t, 44, 18, 30))} />
    </g>
  );
};

const TURN_PX: Pt[] = [[420, 400], [820, 430], [1180, 470], [1420, 620], [1260, 800], [900, 830]];

/** D14: bombs away over the target, then the wing drops and the B-52 swings round hard. */
export const D14: React.FC<ShotProps> = ({ t }) => (
  <MapStage id="D14" t={t} keys={drift(106.3, 21.05, 800, 0.02, 0.0, 20, 2.9)} date="18.12.1972" nightChip="ĐÊM 1/12" nightSince={-5} cities={['hanoi']} cityLabels={false}>
    {() => (
      <g>
        <BombCarpet id="D14-bc" t={t} t0={12} from={[760, 510]} to={[1180, 560]} dur={24} n={14} width={50} r={26} linger={140} />
        <BankPlane id="D14-p" t={t} points={TURN_PX} t0={0} t1={90} size={150} roll={(u) => 1 - 0.5 * easeInOut(prog(u, 0.4, 0.55)) * (1 - 0.6 * easeInOut(prog(u, 0.8, 1)))} />
        <Chip x={700} y={310} text="THẢ BOM" t={t} at={4} size={44} until={34} />
        <Chip x={1330} y={400} text="NGHIÊNG CÁNH, QUAY GẮT" t={t} at={32} size={40} />
      </g>
    )}
  </MapStage>
);

/** D15: while the B-52 banks, its jamming beam swings off the radar site and the radar can see it. */
export const D15: React.FC<ShotProps> = ({ t }) => {
  const turn = easeInOut(prog(t, 22, 72)), heading = 38 * turn, px: Pt = [1190, 400], site: Pt = [380, 880];
  const base = (Math.atan2(site[1] - px[1], site[0] - px[0]) * 180) / Math.PI;
  const aim = base + heading, clear = prog(t, 56, 68);
  return (
    <g>
      <defs><radialGradient id="D15-bg" cx="0.5" cy="0.4" r="0.9"><stop offset="0" stopColor="#14223A" /><stop offset="1" stopColor="#070B12" /></radialGradient></defs>
      <rect width={1920} height={1080} fill="url(#D15-bg)" />
      <JamCone x={px[0]} y={px[1]} aim={aim} len={760} t={t} o={0.95} />
      <line x1={site[0]} y1={site[1]} x2={px[0]} y2={px[1]} stroke="#46FF7A" strokeWidth={5} strokeDasharray="12 10" opacity={0.8 * clear} />
      <AircraftTop id="D15-b52" kind="b52" size={420} x={px[0]} y={px[1]} heading={heading} roll={1 - 0.42 * turn} />
      <SamSite x={site[0]} y={site[1]} r={62} />
      <text x={site[0]} y={site[1] + 110} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#CFE8D4" stroke="#070B12" strokeWidth={6} paintOrder="stroke">RADAR SAM-2</text>
      <Chip x={980} y={930} text="NHIỄU BỊ LỆCH HƯỚNG" t={t} at={50} size={46} />
      <Chip x={1190} y={170} text="SAU KHI THẢ BOM" t={t} at={2} size={40} until={60} />
    </g>
  );
};

/** D16: on the radar scope the jamming thins out and the B-52 blip shows up clearly. */
export const D16: React.FC<ShotProps> = ({ t }) => (
  <g>
    <defs><radialGradient id="D16-bg" cx="0.35" cy="0.5" r="0.9"><stop offset="0" stopColor="#12241A" /><stop offset="1" stopColor="#060B08" /></radialGradient></defs>
    <rect width={1920} height={1080} fill="url(#D16-bg)" />
    <RadarScope id="D16" t={t} cx={600} cy={560} r={410} period={56} foundAt={34}
      jam={{ center: 60, width: 90, strength: 1 - 0.85 * prog(t, 10, 40) }}
      blips={[{ bearing: 215, range: 0.5, vB: 0.02 }, { bearing: 300, range: 0.8 }, { bearing: 150, range: 0.35 }, { bearing: 60, range: 0.62, vR: -0.0006, target: true }]} />
    <AScope id="D16-a" t={t} x={1130} y={190} w={720} h={300} noise={0.9 * (1 - 0.5 * prog(t, 10, 40))} reveal={prog(t, 12, 44)} peakAt={0.64} />
    <Ball id="D16-vn" x={1360} y={780} r={110} flag="VNM" eyes="determined" hat={<Headset />} motion={mixMotion(breathe(t, 68), talk(t, t > 36 && t < 80, 1.3))} />
    <SpeechBubble x={1560} y={640} tipX={1400} tipY={730} text="Rõ hơn rồi!" size={40} t={t} at={38} />
  </g>
);

const CHASE_PX: Pt[] = [[300, 340], [760, 380], [1060, 520], [1000, 700], [640, 780]];

/** D17: only seconds in the turn: a timer ring runs while the SAM climbs to the banking B-52. */
export const D17: React.FC<ShotProps> = ({ t }) => {
  const sp = samplePath(CHASE_PX), at = (f: number) => pathAtDist(sp, prog(f, 0, 108) * sp.total), hit = at(102);
  const ring = prog(t, 0, 100), cx = 260, cy = 400, r = 84;
  const end = polar(cx, cy, -90 + ring * 360, r);
  return (
    <MapStage id="D17" t={t} keys={drift(105.9, 21.0, 800, 0.0, 0.0, 15, 3.6)} date="18.12.1972" nightChip="ĐÊM 1/12" nightSince={-5} cities={['hanoi']} cityLabels={false}>
      {() => (
        <g>
          <SamSite x={1300} y={930} r={40} />
          <BankPlane id="D17-p" t={t} points={CHASE_PX} t0={0} t1={108} size={140} roll={(u) => 0.58 + 0.2 * Math.sin(u * 3)} />
          <SamLaunch id="D17-s" t={t} t0={40} from={[1300, 930]} to={[hit.x, hit.y]} dur={62} bend={0.18} size={74} />
          <FlakBurst id="D17-f" t={t} t0={102} x={hit.x} y={hit.y} r={44} />
          <circle cx={cx} cy={cy} r={r} fill="#10151E" fillOpacity={0.9} stroke="#2C3A4C" strokeWidth={14} />
          {ring > 0.01 && <path d={`M${cx},${cy - r} A${r},${r} 0 ${ring > 0.5 ? 1 : 0} 1 ${end[0]},${end[1]}`} fill="none" stroke="#FF6A5A" strokeWidth={14} />}
          <circle cx={cx} cy={cy} r={10} fill="#F4F4F4" />
          <Chip x={cx} y={cy + 150} text="VÀI CHỤC GIÂY" t={t} at={4} size={40} />
        </g>
      )}
    </MapStage>
  );
};
