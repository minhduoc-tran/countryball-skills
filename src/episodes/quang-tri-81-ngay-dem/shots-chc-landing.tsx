import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { Beret } from '../../countryball/ball-accessories-military';
import { breathe } from '../../countryball/ball-motion';
import { Camera } from '../../countryball/geo-camera';
import { localToScreen } from '../../countryball/citadel-geometry';
import { HeliFlight, HeliTop } from '../../countryball/ground-helicopters';
import { ShellBarrage } from '../../countryball/ground-artillery';
import { FrontArrow, SIDE_COLORS, TrenchLine, UnitBox } from '../../countryball/ground-front-arrows';
import { SmokeColumn } from '../../countryball/ground-weather-and-smoke';
import { AaTracers } from '../../countryball/fx-tracers-and-lights';
import { Puff } from '../../countryball/fx-glow';
import { Cap, INK, PlanScene, RVN_YELLOW, Tag, cameraOnLocal, driftKeys, easeOut, prog } from './chc-common';

// Chapter C, part 4 (4:18-4:32, beat "12 heliborne"): 11/7/1972 (ngày 14/81). C19 helicopters come in from the sea, C20 land NE of
// the town, C21 flank + cut the supply line, C22 one big helicopter is shot down (smoke trail, no crash shown), C23 days of
// fighting on the outskirts. Local metres (x east, y south of the citadel); screen positions recomputed from the camera each frame.

const LZ: [number, number] = [1500, -900];                 // landing zone NE of town
const wide = (a: [number, number], b: [number, number]) => driftKeys(cameraOnLocal(a[0], a[1], 0.3), cameraOnLocal(b[0], b[1], 0.33), 4);
const HUD = { date: '11.7.1972', day: 'NGÀY 14/81' };
type Pt = [number, number];
const S = (cam: Camera) => (x: number, y: number) => localToScreen(cam, x, y) as Pt;

/** C19 "Ngày mười một tháng bảy, trực thăng Mỹ chở lính Thủy quân lục chiến" */
export const C19: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="c19" keys={wide([500, -300], [550, -330])} {...HUD}
    over={(cam) => {
      const P = S(cam), end = P(LZ[0] - 120, LZ[1] + 50);
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <HeliFlight key={i} id={`c19-${i}`} t={t} t0={i * 10} t1={110 + i * 10} kind={i === 1 ? 'ch53' : 'uh1'} size={i === 1 ? 190 : 140}
              points={[[2100, 60 + i * 150], [1700, 150 + i * 120], [end[0] + i * 40, end[1] + i * 36]]} />
          ))}
          <Ball id="c19-b" x={260} y={880} r={76} flag="RVN" eyes="determined" hat={<Beret color="#2F6B3A" badge="anchor" />} motion={breathe(t, 56, 0.035)} />
          <Tag t={t} at={14} x={900} y={960} text="TRỰC THĂNG MỸ CHỞ TQLC" size={46} fill="#2F6B3A" />
        </g>
      );
    }} />
);

/** C20 "đổ bộ xuống phía đông bắc thị xã," the helicopters set down; small figures run out. */
export const C20: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="c20" keys={wide([700, -450], [760, -520])} {...HUD}
    over={(cam) => {
      const P = S(cam), lz = P(LZ[0], LZ[1]);
      return (
        <g>
          <circle cx={lz[0]} cy={lz[1]} r={150} fill="none" stroke="#FFE08A" strokeWidth={6} strokeDasharray="18 12" opacity={prog(t, 4, 14)} />
          {[0, 1, 2].map((i) => (
            <HeliFlight key={i} id={`c20-${i}`} t={t} t0={-40 + i * 6} t1={20 + i * 8} kind={i === 1 ? 'ch53' : 'uh1'} size={i === 1 ? 190 : 140} land
              points={[[lz[0] + 600, lz[1] - 160 + i * 60], [lz[0] + 200, lz[1] - 60 + i * 50], [lz[0] - 60 + i * 80, lz[1] - 40 + i * 70]]} troops={[lz[0] - 140 + i * 40, lz[1] + 160]} />
          ))}
          <Tag t={t} at={4} x={lz[0]} y={lz[1] - 230} text="ĐÔNG BẮC THỊ XÃ" size={54} fill="#2F6B3A" />
          <g transform="translate(1780,300)" opacity={0.95}><circle r={46} fill="#15181F" stroke="#E2B95A" strokeWidth={4} /><path d="M0,-30 L12,10 L0,2 L-12,10 Z" fill="#FFF" /><text y={-52} textAnchor="middle" fontSize={26} fontWeight={800} fill="#FFF" stroke={INK} strokeWidth={6} paintOrder="stroke">B</text></g>
        </g>
      );
    }} />
);

/** C21 "nhằm đánh vào sườn và cắt đường tiếp tế." a red supply line is cut by a yellow arrow. */
export const C21: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="c21" keys={wide([500, -450], [540, -420])} {...HUD}
    over={(cam) => {
      const P = S(cam), pts = [P(900, -2300), P(820, -1500), P(560, -800), P(250, -380), P(-60, -120)], cut = P(540, -760);
      const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join('');
      const k = easeOut(prog(t, 36, 48));
      return (
        <g>
          <path d={d} fill="none" stroke={INK} strokeWidth={16} strokeLinecap="round" />
          <path d={d} fill="none" stroke={SIDE_COLORS.vnm} strokeWidth={9} strokeLinecap="round" strokeDasharray="26 14" strokeDashoffset={-t * 1.2} />
          <FrontArrow id="c21-a" t={t} t0={6} dur={40} points={[P(LZ[0], LZ[1] + 100), P(1150, -950), P(760, -860), P(560, -770)]} width={44} color={RVN_YELLOW} label="TQLC" />
          {k > 0.01 && <g transform={`translate(${cut[0]},${cut[1]}) scale(${0.4 + 0.6 * k}) rotate(${(1 - k) * 40})`} opacity={k}>
            <path d="M-44,-44 L44,44 M44,-44 L-44,44" stroke={INK} strokeWidth={30} strokeLinecap="round" /><path d="M-44,-44 L44,44 M44,-44 L-44,44" stroke="#FFD43B" strokeWidth={16} strokeLinecap="round" /></g>}
          <Tag t={t} at={20} x={P(1050, -1700)[0]} y={P(1050, -1700)[1]} text="ĐƯỜNG TIẾP TẾ" size={44} fill="#B03029" />
          <Tag t={t} at={6} x={P(1900, -400)[0] - 100} y={P(1900, -400)[1]} text="ĐÁNH VÀO SƯỜN" size={46} fill="#8F6D0A" />
        </g>
      );
    }} />
);

/** C22 "Ngay lúc hạ cánh, một chiếc trực thăng lớn bị bắn rơi." tracer hit, smoke trail, the helicopter drops out of view. */
export const C22: React.FC<ShotProps> = ({ t }) => {
  const hit = 38, end = 80;
  const pos = (f: number): Pt => { const u = Math.min(1, f / 90); return [2050 - 900 * u, 240 + 230 * u * u + 120 * u]; };
  const p = pos(Math.min(t, end)), fall = prog(t, hit, end), gone = t >= end;
  const trail = Array.from({ length: 16 }, (_, i) => { const f = t - i * 3; return f > hit ? { p: pos(Math.min(f, end)), i } : null; }).filter(Boolean) as { p: Pt; i: number }[];
  return (
    <PlanScene t={t} id="c22" keys={wide([700, -450], [730, -420])} {...HUD}
      over={() => (
        <g>
          <AaTracers id="c22-aa" t={t} x={1000} y={780} aim={-26} reach={900} rate={2} cyc={60} spread={4} />
          {trail.map(({ p: q, i }) => <Puff key={i} x={q[0] - i * 3} y={q[1] - 6} r={16 + i * 2.4} color="#2A2A2E" o={0.7 * (1 - i / 17)} seed={i} />)}
          {!gone && <HeliTop x={p[0]} y={p[1]} heading={180 + fall * (t - hit) * 9 + (t < hit ? -10 : 0)} size={150 * (1 - 0.25 * fall)} kind="ch53" t={t} />}
          {gone && <SmokeColumn t={t} t0={end} x={p[0]} y={p[1]} h={300} w={46} fire lean={0.3} />}
          <Cap t={t} x={960} y={160} text="MỘT TRỰC THĂNG LỚN BỊ BẮN RƠI" size={58} at={hit + 4} color="#FFD43B" />
        </g>
      )} />
  );
};

/** C23 "Giao tranh ác liệt kéo dài nhiều ngày ở vùng ven thị xã." */
export const C23: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="c23" keys={driftKeys(cameraOnLocal(500, -350, 0.42), cameraOnLocal(560, -380, 0.47), 3.2)} date="7.1972" night={0.15}
    over={(cam) => {
      const P = S(cam), a = P(1100, -600), b = P(300, -300);
      return (
        <g>
          <TrenchLine id="c23-r" t={t} t0={2} points={[P(250, -700), P(380, -450), P(480, -200)]} style="zigzag" color="#7A1F18" />
          <TrenchLine id="c23-y" t={t} t0={10} points={[P(900, -900), P(820, -620), P(780, -340)]} style="triangles" color={RVN_YELLOW} side={-1} />
          <UnitBox x={b[0]} y={b[1]} kind="inf" color={SIDE_COLORS.vnm} size={50} />
          <UnitBox x={a[0]} y={a[1]} kind="mar" color={SIDE_COLORS.rvn} size={50} label="TQLC" />
          <ShellBarrage id="c23-s" t={t} t0={0} from={[-300, 100]} to={P(500, -450)} n={14} span={90} spread={[160, 120]} dur={46} lift={200} r={30} />
          <SmokeColumn t={t} t0={4} x={P(620, -560)[0]} y={P(620, -560)[1]} h={280} w={40} fire />
          <SmokeColumn t={t} t0={20} x={P(300, -150)[0]} y={P(300, -150)[1]} h={240} w={34} />
          <Tag t={t} at={6} x={960} y={150} text="NHIỀU NGÀY GIAO TRANH" size={58} fill="#7A1F18" sub="ở vùng ven thị xã" />
        </g>
      );
    }} />
);
