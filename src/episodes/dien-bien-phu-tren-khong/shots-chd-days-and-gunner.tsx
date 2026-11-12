import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi, PilotHelmet, UsafCap } from '../../countryball/ball-accessories';
import { breathe, hopOnce, mixMotion } from '../../countryball/ball-motion';
import { DocumentProp, SpeechBubble } from '../../countryball/ball-speech-and-props';
import { BCell, BWave, FlightPath } from '../../countryball/fx-flight-path';
import { GroundBlast } from '../../countryball/fx-bomb-carpet';
import { FlakBurst } from '../../countryball/fx-sam-and-flak';
import { shootdownPose } from '../../countryball/fx-b52-hit';
import { Flames } from '../../countryball/fx-bomb-carpet';
import { Flare, AaTracers } from '../../countryball/fx-tracers-and-lights';
import { Puff } from '../../countryball/fx-glow';
import { AircraftSide } from '../../countryball/aircraft-side-view';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { LowerThird } from '../../countryball/hud-chips';
import { Pt, polar, prog } from '../../countryball/fx-math';
import { Chip, DimMap, Headline, MapStage, drift, ll } from './chd-common';
import { ClockRing, SkyBackdrop, StatCard, TailTurret } from './chd-props';

// Chapter D, day raids + the tail gunner: D18-D28.

/** D18: not only Hà Nội: the map pulls back and Hải Phòng, Thái Nguyên and other places in the north flare up. */
export const D18: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  const keys = [{ t: 0, lon: 105.85, lat: 21.0, zoom: 700 }, { t: 5.3, lon: 106.0, lat: 21.2, zoom: 235 }];
  const spots: { p: [number, number]; at: number }[] = [
    { p: [106.68, 20.86], at: 34 }, { p: [105.84, 21.59], at: 56 }, { p: [106.28, 21.39], at: 78 }, { p: [104.87, 21.7], at: 92 }, { p: [107.0, 21.0], at: 118 },
  ];
  return (
    <MapStage id="D18" t={t} keys={keys} date="12.1972" cities={['hanoi', 'haiphong', 'thainguyen']} cityMin={110}
      hud={<LowerThird title="Không chỉ Hà Nội" sub="Hải Phòng, Thái Nguyên và nhiều nơi khác ở miền Bắc" from={0.1} to={5.3} t={s} />}>
      {(cam) => (
        <g>
          <GroundBlast t={t} t0={-60} x={ll(cam, 105.85, 21.03)[0] + 34} y={ll(cam, 105.85, 21.03)[1] + 8} r={cam.zoom > 400 ? 30 : 14} linger={200} />
          {spots.map((q, i) => {
            const [x0, y0] = ll(cam, q.p[0], q.p[1]), r = Math.min(26, 10 + cam.zoom / 40), x = x0 - 52, y = y0 + 30;
            return (
              <g key={i}>
                <GroundBlast t={t} t0={q.at} x={x} y={y} r={r} linger={160} />
                <GroundBlast t={t} t0={q.at + 7} x={x + r * 1.4} y={y + r * 0.6} r={r * 0.7} linger={160} />
              </g>
            );
          })}
        </g>
      )}
    </MapStage>
  );
};

const SUN: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 30 }) => (
  <g>
    {Array.from({ length: 8 }, (_, i) => { const a = polar(x, y, i * 45, r * 1.35), b = polar(x, y, i * 45, r * 1.85); return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#FFD166" strokeWidth={6} strokeLinecap="round" />; })}
    <circle cx={x} cy={y} r={r} fill="#FFD166" stroke="#7A5A10" strokeWidth={4} />
  </g>
);
/** Crescent moon: a disc with an offset disc masked out of it. */
const MOON: React.FC<{ id: string; x: number; y: number; r?: number }> = ({ id, x, y, r = 30 }) => (
  <g>
    <mask id={`${id}-mask`}><rect x={x - 2 * r} y={y - 2 * r} width={4 * r} height={4 * r} fill="#fff" /><circle cx={x + r * 0.5} cy={y - r * 0.25} r={r * 0.88} fill="#000" /></mask>
    <circle cx={x} cy={y} r={r} fill="#C9D6FF" mask={`url(#${id}-mask)`} />
  </g>
);

const DAY_LANES: { pts: [number, number][]; t0: number }[] = [
  { pts: [[103.0, 20.2], [105.0, 20.9], [105.85, 21.03]], t0: 4 }, { pts: [[108.6, 19.9], [107.1, 20.45], [106.68, 20.86]], t0: 26 },
  { pts: [[104.0, 22.6], [105.0, 22.0], [105.84, 21.59]], t0: 48 },
];

/** D19: daylight map: F-4 / A-7 tactical aircraft in pairs hit Hà Nội, Hải Phòng and Thái Nguyên. */
export const D19: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30;
  return (
    <MapStage id="D19" t={t} keys={drift(105.7, 21.0, 260, 0.15, 0.05, 20, 4.8)} night={0} date="12.1972" cities={['hanoi', 'haiphong', 'thainguyen']} cityMin={100}
      hud={<LowerThird title="Ban ngày: máy bay chiến thuật" sub="F-4, A-7 tiếp tục tấn công" from={0.1} to={4.8} t={s} />}>
      {(cam) => (
        <g>
          {DAY_LANES.map((l, i) => [0, 1].map((k) => (
            <FlightPath key={`${i}${k}`} id={`D19-${i}${k}`} t={t} t0={l.t0 + k * 5} t1={l.t0 + 70 + k * 5} kind="f4" size={66} trailLen={280} trailW={4}
              points={l.pts.map(([lo, la]) => ll(cam, lo, la + k * 0.12) as Pt)} />
          )))}
          <SUN x={960} y={120} />
          <Chip x={1180} y={120} text="BAN NGÀY" t={t} at={2} size={40} />
        </g>
      )}
    </MapStage>
  );
};

/** D20: day turns to night: the sun becomes a moon and B-52 cells cross the dark map again. */
export const D20: React.FC<ShotProps> = ({ t }) => {
  const k = prog(t, 4, 34);
  return (
    <MapStage id="D20" t={t} keys={drift(105.85, 21.05, 280, 0.1, 0.0, 15, 2.4)} night={0.85 * k} date="12.1972" cities={['hanoi', 'haiphong']} cityMin={100}>
      {(cam) => (
        <g>
          <BWave id="D20-w" t={t} size={62} trailLen={320} cells={[
            { points: [[101.8, 20.2], [104.0, 20.8], [105.85, 21.03]].map(([lo, la]) => ll(cam, lo, la) as Pt), t0: 6, t1: 70 },
            { points: [[102.0, 21.6], [104.2, 21.5], [105.85, 21.06]].map(([lo, la]) => ll(cam, lo, la) as Pt), t0: 18, t1: 82 },
          ]} />
          <g opacity={1 - k}><SUN x={960} y={120} /></g>
          <g opacity={k}><MOON id="D20-moon" x={960} y={120} r={34} /></g>
          <Chip x={1190} y={120} text={k < 0.5 ? 'BAN NGÀY' : 'BAN ĐÊM: B-52'} t={t} at={0} size={40} />
        </g>
      )}
    </MapStage>
  );
};

/** D21: a 24 h clock whose every hour lights up: F-4 by day, B-52 by night, no quiet hour. */
export const D21: React.FC<ShotProps> = ({ t }) => {
  const cx = 960, cy = 470, r = 290;
  const hourPos = (h: number, rr: number): Pt => polar(cx, cy, -90 + h * 15, rr);
  return (
    <g>
      <defs><radialGradient id="D21-bg" cx="0.5" cy="0.45" r="0.8"><stop offset="0" stopColor="#1A2538" /><stop offset="1" stopColor="#080C14" /></radialGradient></defs>
      <rect width={1920} height={1080} fill="url(#D21-bg)" />
      <ClockRing t={t} cx={cx} cy={cy} r={r} at={4} dur={62} />
      {[9, 12, 15].map((h) => { const p = hourPos(h, r + 105), on = prog(t, 4 + (62 * h) / 24, 4 + (62 * h) / 24 + 5); return <AircraftTop key={h} id={`D21-f${h}`} kind="f4" size={86} x={p[0]} y={p[1]} heading={-90 + h * 15 + 90} opacity={on} />; })}
      {[22, 1, 4].map((h) => { const p = hourPos(h, r + 115), on = prog(t, 4 + (62 * h) / 24, 4 + (62 * h) / 24 + 5); return <AircraftTop key={h} id={`D21-b${h}`} kind="b52" size={120} x={p[0]} y={p[1]} heading={-90 + h * 15 + 90} opacity={on} />; })}
      <Chip x={960} y={995} text="KHÔNG CÓ GIỜ NÀO YÊN TĨNH" t={t} at={48} size={52} />
    </g>
  );
};

/** D22: the B-52 fires back from its tail at the night sky behind it. */
export const D22: React.FC<ShotProps> = ({ t }) => {
  const x = 1050, y = 500 + Math.sin(t / 22) * 8;
  return (
    <g>
      <SkyBackdrop id="D22" skyline={false} />
      <Flare t={t} t0={0} x={1500} y={150} r={120} />
      <AaTracers id="D22-tr" t={t} x={x - 425} y={y + 24} aim={188} reach={820} cyc={22} seed={3} spread={5} />
      <AircraftSide kind="b52" x={x} y={y} size={700} pitch={-1} />
      <Chip x={960} y={900} text="B-52 CŨNG BẮN TRẢ" t={t} at={10} size={52} />
    </g>
  );
};

/** D23: close on the tail: one gunner alone behind four machine guns. */
export const D23: React.FC<ShotProps> = ({ t }) => {
  const bx = 1500 + Math.sin(t / 30) * 6, by = 560;
  return (
    <g>
      <SkyBackdrop id="D23" skyline={false} />
      <AircraftSide kind="b52" x={bx} y={by} size={1800} pitch={0} />
      <TailTurret x={bx - 840} y={by + 70} s={1.5} t={t} fire={t > 78} />
      {t > 78 && <AaTracers id="D23-tr" t={t} x={bx - 1060} y={by + 70} aim={186} reach={700} cyc={18} seed={5} spread={3} />}
 <line x1={1380} y1={300} x2={720} y2={600} stroke="#E2B95A" strokeWidth={5} strokeDasharray="14 10" />
      <circle cx={1500} cy={250} r={140} fill="#10151E" stroke="#E2B95A" strokeWidth={8} />
      <clipPath id="D23-clip"><circle cx={1500} cy={250} r={132} /></clipPath>
      <g clipPath="url(#D23-clip)"><Ball id="D23-us" x={1500} y={290} r={95} flag="USA" eyes="worried" hat={<PilotHelmet />} motion={breathe(t, 70)} shadow={false} /></g>
      <Chip x={620} y={300} text="XẠ THỦ ĐUÔI" t={t} at={6} size={52} />
      <Chip x={1500} y={450} text="MỘT NGƯỜI" t={t} at={55} size={40} />
      <Chip x={620} y={880} text="BỐN KHẨU SÚNG MÁY" t={t} at={78} size={46} />
    </g>
  );
};

/** D24: "the US Air Force records": a US document card, labelled as the US account. */
export const D24: React.FC<ShotProps> = ({ t }) => (
  <g>
    <DimMap id="D24" t={t} lon={105.6} lat={20.8} zoom={230} dim={0.72} />
    <Ball id="D24-us" x={420} y={680} r={140} flag="USA" eyes="normal" hat={<UsafCap />} motion={breathe(t, 80, 0.035)} />
    <DocumentProp x={600} y={820} s={2.1} rot={-8} title="HỒ SƠ" />
    <StatCard x={1220} y={540} w={960} h={540} kicker="KHÔNG QUÂN MỸ GHI NHẬN" big="1 MiG" l1="bị xạ thủ đuôi B-52 bắn rơi" l2="Đêm 18/12/1972, theo phía Mỹ" t={t} at={8} />
  </g>
);

/** D25: tracers from the tail turret; a MiG-21 behind the bomber is hit and tumbles away (the US claim, shown as such). */
export const D25: React.FC<ShotProps> = ({ t }) => {
  const hit = 22, cfg = { at: [900, 540] as Pt, heading: 0, speed: 5, fallDur: 30, spin: -1.5 };
  // before the hit the MiG closes in from the left at 20 px/frame; after it, it pitches up and away (shootdownPose)
  const pose = t < hit ? { x: cfg.at[0] - (hit - t) * 20, y: cfg.at[1], heading: 0, alt: 1, roll: 1, fallen: false } : shootdownPose(t, hit, cfg);
  const puffs: React.ReactNode[] = [];
  for (let tau = hit; tau <= Math.min(t, hit + 30); tau += 2) {
    const p = shootdownPose(tau, hit, cfg), age = t - tau;
    puffs.push(<Puff key={tau} x={p.x} y={p.y - age * 0.2} r={(9 + Math.min(age, 70) * 0.35) * p.alt} color="#2A2A2E" o={0.85 * (1 - prog(age, 0, 90))} seed={tau} />);
  }
  return (
    <g>
      <SkyBackdrop id="D25" skyline={false} />
      <AaTracers id="D25-tr" t={t} x={1085} y={540} aim={180} reach={760} cyc={30} seed={4} spread={2} />
      <AircraftTop id="D25-b52" kind="b52" size={360} x={1260} y={540} heading={0} />
      {puffs}
      {!pose.fallen && <AircraftTop id="D25-mig" kind="mig21" size={150 * pose.alt} x={pose.x} y={pose.y} heading={pose.heading} roll={pose.roll} />}
      {t >= hit && !pose.fallen && <Flames t={t} x={pose.x} y={pose.y} s={36} n={4} seed={2} dir={pose.heading + 180} />}
      <FlakBurst id="D25-hit" t={t} t0={hit} x={cfg.at[0]} y={cfg.at[1]} r={44} life={60} />
      <Chip x={960} y={170} text="THEO PHÍA MỸ" t={t} at={0} size={52} />
    </g>
  );
};

/** D26: the two accounts side by side: the US claim and Việt Nam's "not confirmed". */
export const D26: React.FC<ShotProps> = ({ t }) => (
  <g>
    <DimMap id="D26" t={t} lon={105.6} lat={20.8} zoom={230} dim={0.74} />
    <Ball id="D26-us" x={480} y={250} r={105} flag="USA" eyes="normal" hat={<UsafCap />} motion={breathe(t, 76, 0.035)} />
    <Ball id="D26-vn" x={1440} y={250} r={105} flag="VNM" eyes="normal" hat={<MuCoi />} look={Math.sin(t / 8)} motion={breathe(t, 70, 0.035, 20)} />
    <StatCard x={480} y={650} w={800} h={470} kicker="THEO PHÍA MỸ" big="1 MiG" l1="bị bắn rơi" t={t} at={0} />
    <StatCard x={1440} y={650} w={800} h={470} kicker="THEO PHÍA VIỆT NAM" big="KHÔNG" l1="xác nhận điều này" t={t} at={10} accent="#E2B95A" />
  </g>
);

/** D27: two balls, two points of view: "common in war". */
export const D27: React.FC<ShotProps> = ({ t }) => (
  <g>
    <DimMap id="D27" t={t} lon={105.6} lat={20.8} zoom={230} dim={0.74} />
    <Headline x={960} y={230} text="CHUYỆN THƯỜNG THẤY" t={t} at={2} size={76} />
    <Headline x={960} y={320} text="TRONG CHIẾN TRANH" t={t} at={10} size={76} />
    <Ball id="D27-us" x={600} y={680} r={130} flag="USA" eyes="normal" hat={<UsafCap />} look={1} motion={mixMotion(breathe(t, 74), hopOnce(t, 6, 20, 24))} />
    <Ball id="D27-vn" x={1320} y={680} r={130} flag="VNM" eyes="normal" hat={<MuCoi />} look={-1} motion={mixMotion(breathe(t, 70, 0.03, 18), hopOnce(t, 14, 20, 24))} />
  </g>
);

/** D28: the same night, two stories: each ball holds its own document. */
export const D28: React.FC<ShotProps> = ({ t }) => (
  <g>
    <DimMap id="D28" t={t} lon={105.6} lat={20.8} zoom={230} dim={0.74} />
    <Chip x={960} y={210} text="CÙNG MỘT ĐÊM: 18/12/1972" t={t} at={0} size={56} />
    <Ball id="D28-us" x={440} y={700} r={130} flag="USA" eyes="normal" hat={<UsafCap />} motion={breathe(t, 74)} />
    <Ball id="D28-vn" x={1480} y={700} r={130} flag="VNM" eyes="normal" hat={<MuCoi />} motion={breathe(t, 70, 0.03, 18)} />
    <DocumentProp x={690} y={820} s={1.9} rot={-6} title="PHÍA MỸ" />
    <DocumentProp x={1230} y={820} s={1.9} rot={6} title="VIỆT NAM" />
    <SpeechBubble x={560} y={440} tipX={450} tipY={580} text={'Câu chuyện\ncủa phía Mỹ'} size={40} t={t} at={22} />
    <SpeechBubble x={1360} y={440} tipX={1470} tipY={580} text={'Câu chuyện của\nphía Việt Nam'} size={40} t={t} at={48} />
  </g>
);
