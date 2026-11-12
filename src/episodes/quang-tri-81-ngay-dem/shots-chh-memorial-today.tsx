import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { PhotoCard } from '../../countryball/photo-card';
import { cameraOnCitadel, citadelScreen } from '../../countryball/citadel-geometry';
import { Glow } from '../../countryball/fx-glow';
import { flicker, hash } from '../../countryball/fx-math';
import { Backdrop, IMG, Txt } from './chb-common';
import { Tag } from './chc-common';
import { PlanToday, SoftT, cameraOnLocal, driftCam, easeOut, prog } from './chh-text-and-plan';

// Chapter H part 1 (10:09-10:24, beat "31 today"): the Citadel as a memorial park, calm and green. H1 plan flies in, H2 today's
// photo + relic plaque, H3 "2013" card, H4 the monument at the centre, H5 moat refilled + bomb craters under grass.

/** H1 "Hôm nay, Thành cổ Quảng Trị không còn là một pháo đài." */
export const H1: React.FC<ShotProps> = ({ t }) => (
  <PlanToday t={t} id="h1" date="NGÀY NAY" keys={driftCam(cameraOnLocal(60, 20, 0.4), cameraOnLocal(0, 0, 0.6), 3.4)}
    over={() => (
      <g>
        <rect y={780} width={1920} height={300} fill="#050B15" opacity={0.0} />
        <SoftT t={t} x={960} y={905} text="THÀNH CỔ QUẢNG TRỊ" size={92} at={14} color="#FFFFFF" ls={3} />
        <SoftT t={t} x={960} y={975} text="không còn là một pháo đài" size={46} at={34} color="#FFE9B8" font="hand" weight={700} />
      </g>
    )} />
);

/** Plaque: dark panel, gold rim, stacked lines. */
const Plaque: React.FC<{ t: number; at: number; x: number; y: number; lines: string[]; size?: number }> = ({ t, at, x, y, lines, size = 62 }) => {
  const k = easeOut((t - at) / 12);
  if (k <= 0.01) return null;
  const w = 560, h = lines.length * size * 1.2 + 70;
  return (
    <g transform={`translate(${x},${y + (1 - k) * 40}) scale(${0.9 + 0.1 * k})`} opacity={k}>
      <rect x={-w / 2 + 8} y={-h / 2 + 12} width={w} height={h} rx={22} fill="#000" opacity={0.4} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={22} fill="#13202E" stroke="#E2B95A" strokeWidth={6} />
      <rect x={-w / 2 + 14} y={-h / 2 + 14} width={w - 28} height={h - 28} rx={14} fill="none" stroke="#E2B95A" strokeWidth={2} opacity={0.6} />
      {lines.map((l, i) => <Txt key={i} x={0} y={-h / 2 + 35 + size * 0.95 + i * size * 1.2} text={l} size={size} color={i === lines.length - 1 ? '#F4C95A' : '#FFFFFF'} stroke="none" />)}
    </g>
  );
};

/** H2 "Nơi đây là một khu tưởng niệm, được xếp hạng Di tích quốc gia đặc biệt" photo + plaque. */
export const H2: React.FC<ShotProps> = ({ t }) => (
  <PlanToday t={t} id="h2" veil={0.55} credit keys={driftCam(cameraOnLocal(0, 0, 0.5), cameraOnLocal(30, 10, 0.56), 4)}
    over={() => (
      <g>
        <PhotoCard id="h2p" src={`${IMG}citadel-today-wide.jpg`} caption="Thành cổ Quảng Trị ngày nay" credit="Ảnh: Bùi Thụy Đào Nguyên / CC BY-SA 3.0" x={700} y={520} w={900} h={675} rot={-1.5}
          from={0.05} t={t / 30} kb={{ z0: 1.0, z1: 1.14, px0: 0.02, py0: 0.01, px1: -0.02, py1: -0.01 }} fromSide="bottom" />
        <Txt x={1500} y={330} text="KHU TƯỞNG NIỆM" size={54} color="#B8E0A8" stroke="#050B15" o={easeOut((t - 8) / 12)} />
        <Plaque t={t} at={46} x={1500} y={560} lines={['DI TÍCH', 'QUỐC GIA', 'ĐẶC BIỆT']} />
      </g>
    )} />
);

/** H3 "từ năm 2013": the year on a calm card, slow gold rays. */
export const H3: React.FC<ShotProps> = ({ t }) => {
  const s = t / 30, u = easeOut(prog(t, 4, 22));
  return (
    <g>
      <Backdrop s={s} id="h3" top="#10241F" bottom="#050E10" />
      <g transform="translate(960,560)" opacity={0.2}>
        {Array.from({ length: 14 }, (_, i) => <path key={i} d="M0,0 L-60,-900 L60,-900 Z" fill="#F4C95A" opacity={0.5} transform={`rotate(${i * (360 / 14) + s * 3})`} />)}
      </g>
      <Glow x={960} y={560} r={760} color="#F4C95A" o={0.28 + 0.03 * flicker(t * 0.4, 2)} />
      <g transform={`translate(960,${290 - (1 - u) * 30})`} opacity={u}>
        <rect x={-640} y={-70} width={1280} height={130} rx={20} fill="#9E2230" stroke="#E2B95A" strokeWidth={7} />
        <Txt x={0} y={26} text="DI TÍCH QUỐC GIA ĐẶC BIỆT" size={80} color="#FFE9B8" stroke="none" />
      </g>
      <g transform={`translate(960,${690 + (1 - u) * 50}) scale(${0.92 + 0.08 * u})`} opacity={u}>
        <text textAnchor="middle" fontFamily={FONT.title} fontSize={400} fontWeight={800} fill="#F4C95A" stroke="#1A1206" strokeWidth={36} paintOrder="stroke" strokeLinejoin="round">2013</text>
      </g>
      <SoftT t={t} x={960} y={880} text="Thành cổ Quảng Trị" size={64} at={26} color="#FFE9B8" />
      {Array.from({ length: 7 }, (_, i) => {
        const k = 0.5 + 0.5 * Math.sin(t / 9 + i * 2.1), x = 300 + hash(i, 4) * 1320, y = 420 + hash(i, 5) * 520;
        return <path key={i} d={`M${x},${y - 18 * k} L${x + 4},${y - 4} L${x + 18 * k},${y} L${x + 4},${y + 4} L${x},${y + 18 * k} L${x - 4},${y + 4} L${x - 18 * k},${y} L${x - 4},${y - 4} Z`} fill="#FFF3C8" opacity={0.6 * k} />;
      })}
    </g>
  );
};

/** H4 "Ở chính giữa là đài tưởng niệm." Close on the centre of the park. */
export const H4: React.FC<ShotProps> = ({ t }) => (
  <PlanToday t={t} id="h4" keys={driftCam(cameraOnCitadel(0, 0, 1.5), cameraOnCitadel(0, 0, 2.0), 2.4)}
    over={(cam) => {
      const [cx, cy] = citadelScreen(cam, 0, 0);
      return (
        <g>
          <circle cx={cx} cy={cy} r={60 + 8 * Math.sin(t / 8)} fill="none" stroke="#FFE9B8" strokeWidth={5} strokeDasharray="12 10" opacity={prog(t, 8, 20) * 0.9} />
          <line x1={cx + 60} y1={cy - 56} x2={cx + 250} y2={cy - 230} stroke="#050B15" strokeWidth={9} opacity={prog(t, 10, 22)} />
          <line x1={cx + 60} y1={cy - 56} x2={cx + 250} y2={cy - 230} stroke="#FFE9B8" strokeWidth={4} opacity={prog(t, 10, 22)} />
          <Tag t={t} at={14} x={cx + 380} y={cy - 270} text="ĐÀI TƯỞNG NIỆM" fill="#2F6B3A" size={52} />
        </g>
      );
    }} />
);

/** H5 "Hào nước được khơi lại, cỏ xanh đã phủ lên những nơi từng là hố bom." */
const CRATERS: [number, number, number][] = [[-130, -70, 26], [-55, 80, 22], [40, -105, 28], [95, 40, 24], [-150, 120, 20], [20, 150, 25], [150, -50, 21]];
export const H5: React.FC<ShotProps> = ({ t }) => {
  const greenU = easeOut(prog(t, 48, 84));
  return (
    <PlanToday t={t} id="h5" labels={['moat']} keys={driftCam(cameraOnCitadel(-110, -90, 1.05), cameraOnCitadel(-40, 60, 1.15), 4.2)}
      over={(cam) => {
        const ppm = cam.zoom / 110574, [mx, my] = citadelScreen(cam, -258, -40);
        return (
          <g>
            {CRATERS.map(([u, v, r], i) => {
              const [x, y] = citadelScreen(cam, u, v), R = r * ppm;
              return (
                <g key={i} opacity={easeOut(prog(t, 40 + i * 2, 54 + i * 2))}>
                  <circle cx={x} cy={y} r={R} fill="#5FAE5B" opacity={0.0 + 0.5 * greenU} />
                  <circle cx={x} cy={y} r={R} fill="none" stroke={greenU > 0.6 ? '#9BD48A' : '#3A2A1E'} strokeWidth={5} strokeDasharray="10 8" />
                  {greenU > 0.4 && Array.from({ length: 5 }, (_, j) => <path key={j} d={`M${x - R * 0.5 + j * R * 0.25},${y + 4} q2,-${12 * greenU} 6,-${18 * greenU}`} stroke="#B6E8A0" strokeWidth={3} fill="none" strokeLinecap="round" />)}
                </g>
              );
            })}
            <g opacity={1 - prog(t, 34, 42)}>
              <Tag t={t} at={4} x={mx - 40} y={my - 150} text="HÀO NƯỚC" fill="#1F6F9C" size={54} />
            </g>
            <Tag t={t} at={50} x={960} y={900} text="CỎ XANH PHỦ HỐ BOM" fill="#2F6B3A" size={56} />
          </g>
        );
      }} />
  );
};
