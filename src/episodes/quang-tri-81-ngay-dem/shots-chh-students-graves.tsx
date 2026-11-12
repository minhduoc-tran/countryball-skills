import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { PhotoCard } from '../../countryball/photo-card';
import { cameraOnCitadel, citadelScreen } from '../../countryball/citadel-geometry';
import { Candle, IncenseBundle } from '../../countryball/ground-memorial-props';
import { Glow } from '../../countryball/fx-glow';
import { flicker, hash } from '../../countryball/fx-math';
import { IMG } from './chb-common';
import { Backpack, Desk, GrassField } from './chh-icons';
import { RiverScene } from './chh-river-night';
import { PlanToday, SoftT, driftCam, easeOut, prog } from './chh-text-and-plan';

// Chapter H part 2 (10:24-10:39, beats "31b students" + "32 no graves"): the student-soldier memorial photo, backpacks leaving the
// lecture hall, one empty desk with a candle, the grass of a "cemetery without graves", soft lights nobody can place.

/** H6 "Gần đó là đài chứng tích dành cho các sinh viên chiến sĩ Thành cổ," */
export const H6: React.FC<ShotProps> = ({ t }) => (
  <PlanToday t={t} id="h6" veil={0.6} keys={driftCam(cameraOnCitadel(40, 40, 0.8), cameraOnCitadel(-20, 10, 0.9), 4.4)}
    over={() => (
      <PhotoCard id="h6p" src={`${IMG}student-soldiers-memorial.jpg`} caption="Đài chứng tích sinh viên - chiến sĩ Thành cổ" credit="Ảnh: Prof MK / Public domain" x={960} y={520} w={1000} h={750} rot={1}
        from={0.05} t={t / 30} kb={{ z0: 1.0, z1: 1.13, px0: -0.02, py0: 0.01, px1: 0.02, py1: -0.01 }} fromSide="left" />
    )} />
);

/** H7 "những người đã rời giảng đường ra trận,": empty backpacks file out of a lecture hall into the evening light. */
export const H7: React.FC<ShotProps> = ({ t }) => {
  const FLOOR = 800;
  return (
    <g>
      <defs>
        <linearGradient id="h7-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1A2434" /><stop offset="1" stopColor="#2A2F3C" /></linearGradient>
        <linearGradient id="h7-door" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFB45E" stopOpacity={0.15} /><stop offset="1" stopColor="#FFD890" stopOpacity={0.95} /></linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#h7-wall)" />
      <rect y={FLOOR} width={1920} height={280} fill="#171B25" />
      {[260, 620, 980].map((x, i) => <g key={i}><rect x={x} y={150} width={240} height={420} rx={8} fill="#6F8FB8" opacity={0.55} stroke="#0B1018" strokeWidth={6} /><line x1={x + 120} y1={150} x2={x + 120} y2={570} stroke="#0B1018" strokeWidth={5} /><line x1={x} y1={360} x2={x + 240} y2={360} stroke="#0B1018" strokeWidth={5} /></g>)}
      <rect x={1620} y={250} width={300} height={FLOOR - 250} fill="url(#h7-door)" />
      <Glow x={1800} y={600} r={520} color="#FFC070" o={0.6 + 0.05 * flicker(t * 0.3, 1)} />
      {[200, 520, 840, 1160].map((x, i) => <Desk key={i} x={x} y={FLOOR + 40 + i * 4} s={0.78} />)}
      {Array.from({ length: 6 }, (_, i) => {
        const x0 = 330 + i * 190, u = Math.max(0, t - (4 + i * 3)), x = x0 + 28 * u, hop = u > 0 ? Math.abs(Math.sin(u * 0.45)) * 22 : 0;
        return <g key={i}><Backpack x={x} y={FLOOR + 90 - hop} s={1.05} rot={u > 0 ? Math.sin(u * 0.45) * 4 : 0} /></g>;
      })}
      <SoftT t={t} x={960} y={985} text="rời giảng đường, ra trận" size={60} at={10} font="hand" weight={700} color="#FFE9B8" />
    </g>
  );
};

/** H8 "và không bao giờ trở lại lớp học." One empty desk, a candle on it, a pale window light. */
export const H8: React.FC<ShotProps> = ({ t }) => {
  const dust = Array.from({ length: 40 }, (_, i) => ({ x: 300 + hash(i, 1) * 1300 + Math.sin(t / 50 + i) * 20, y: ((hash(i, 2) * 900 - t * (0.15 + 0.3 * hash(i, 3))) % 900 + 900) % 900 + 60, r: 1.2 + 2 * hash(i, 4) }));
  const sc = 2.3 + 0.0006 * t, cx = 900, fy = 880;
  return (
    <g>
      <defs>
        <linearGradient id="h8-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0E1624" /><stop offset="1" stopColor="#05080F" /></linearGradient>
        <linearGradient id="h8-beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9CB8E0" stopOpacity={0.4} /><stop offset="1" stopColor="#9CB8E0" stopOpacity={0} /></linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#h8-bg)" />
      <path d="M1100,0 L1560,0 L860,1000 L460,1000 Z" fill="url(#h8-beam)" opacity={0.55 + 0.05 * Math.sin(t / 30)} />
      <rect y={fy} width={1920} height={200} fill="#0A0E16" />
      <Desk x={cx} y={fy} s={sc} lit={0} />
      <Candle x={cx + 20 * sc} y={fy - 150 * sc} s={120} t={t} />
      <Glow x={cx} y={fy - 200 * sc} r={760} color="#FFB347" o={0.28 * flicker(t * 0.7, 4)} />
      {dust.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#CFE0FF" opacity={0.2 + 0.2 * hash(i, 5)} />)}
      <SoftT t={t} x={960} y={1000} text="không bao giờ trở lại lớp học" size={58} at={14} font="hand" weight={700} color="#FFE9B8" />
    </g>
  );
};

/** H9 "một nghĩa trang không có nấm mộ": grass at dusk, incense, no mounds. */
export const H9: React.FC<ShotProps> = ({ t }) => (
  <g>
    <g transform={`translate(${960},${540}) scale(${1 + 0.0007 * t}) translate(-960,-540)`}>
      <RiverScene id="h9" t={t} tone={0.35} H={560} pan={t * 0.2} />
      <GrassField t={t} y0={530} tone={0.35} />
      <rect y={500} width={1920} height={140} fill="#E8C9A0" opacity={0.08} />
      <IncenseBundle x={470} y={870} s={190} t={t} n={3} />
      <IncenseBundle x={1330} y={950} s={230} t={t} n={4} />
      <IncenseBundle x={900} y={780} s={130} t={t} n={3} />
    </g>
    <rect width={1920} height={1080} fill="#050B15" opacity={0.18} />
    <SoftT t={t} x={960} y={260} text="NGHĨA TRANG" size={110} at={47} color="#FFFFFF" ls={6} />
    <SoftT t={t} x={960} y={390} text="KHÔNG CÓ NẤM MỘ" size={110} at={52} color="#FFE9B8" ls={4} />
  </g>
);

/** H10 "Bởi rất nhiều người đã nằm lại nơi đây, mà không ai biết chính xác ở đâu." Soft lights across the park, then a "?". */
export const H10: React.FC<ShotProps> = ({ t }) => (
  <PlanToday t={t} id="h10" night={0.75} veil={0.12} keys={driftCam(cameraOnCitadel(0, 0, 0.95), cameraOnCitadel(0, 0, 1.12), 3.9)}
    over={(cam) => {
      const [cx, cy] = citadelScreen(cam, 0, 0);
      return (
        <g>
          {Array.from({ length: 48 }, (_, i) => {
            const u = (hash(i, 1) - 0.5) * 430, v = (hash(i, 2) - 0.5) * 430, [x, y] = citadelScreen(cam, u, v), k = easeOut(prog(t, 4 + i * 1.3, 18 + i * 1.3)), f = flicker(t * 0.5, i);
            return k > 0.01 ? <g key={i} opacity={k}><Glow x={x} y={y} r={30 * f} color="#FFB347" o={0.7} /><circle cx={x} cy={y} r={3.2} fill="#FFF0C0" /></g> : null;
          })}
          <g opacity={prog(t, 58, 72)}>
            <Glow x={cx} y={cy} r={340} color="#050B15" o={0.5} blend={false} />
            <text x={cx} y={cy + 100} textAnchor="middle" fontFamily={FONT.hand} fontSize={300} fontWeight={700} fill="#FFE9B8" stroke="#050B15" strokeWidth={26} paintOrder="stroke" strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 22px rgba(255,190,90,0.6))' }}>?</text>
          </g>
        </g>
      );
    }} />
);
