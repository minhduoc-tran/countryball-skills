import React from 'react';
import { kf, camT, clamp, easeOut, backOut, rnd, FONT, SCH, FocusRings, ShotProps } from '../../engine';
import { StrandedShip } from './kit-dry-seabed';
import { BigNum } from './kit-hud';
import { Mini, GoldChest, Tool } from './chb-people-props';
import { Seabed, TitanicWreck, OldWreck, TicketBooth, RopeLine } from './chb-seabed-props';

// Chapter B, treasure rush (B12-B17, 90.49-102.88 s, looks days / none): the crowd streams down onto the seabed, detectors and
// shovels, "≈ 3 TRIỆU" wrecks, the wreck field, Titanic at "≈ 3.800 M", and Titanic as a tourist site with a ticket booth.

const SHIRTS = ['#E04B3A', '#F2B632', '#3E9C6B', '#6B7FD6', '#E87EA1', '#2E86C1', '#F4F1EA'];
const TOOLS: Tool[] = ['shovel', 'detector', 'bucket', 'shovel', 'none', 'detector'];

// ---------- B12: the whole world runs down the beach onto the seabed ----------
export const B12: React.FC<ShotProps> = ({ t, len }) => {
  const crowd = Array.from({ length: 34 }).map((_, i) => ({ i, y: 700 + rnd(31, i) * 320 })).sort((a, b) => a.y - b.y);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 700, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Seabed id="b12" t={t} haze={0.3} />
      {crowd.map(({ i, y }) => {
        const k = (y - 650) / 400;
        const x = ((rnd(32, i) * 2400 + t * (13 + rnd(33, i) * 6)) % 2500) - 300;
        return <Mini key={i} x={x} y={y} s={0.55 + k * 0.8} t={t} ph={i * 1.9} run tool={TOOLS[i % TOOLS.length]} c={SHIRTS[i % SHIRTS.length]} skin={i} />;
      })}
      {Array.from({ length: 18 }).map((_, i) => {
        const x = ((rnd(34, i) * 2400 + t * 14) % 2500) - 450;
        const p = (t * 0.07 + rnd(35, i)) % 1;
        return <ellipse key={i} cx={x} cy={760 + rnd(36, i) * 280 - p * 14} rx={30 + p * 40} ry={9 + p * 8} fill="#E9D3A3" opacity={0.5 * (1 - p)} />;
      })}
    </g>
  );
};

// ---------- B13: close on the diggers: metal detectors beep, a chest comes out of the mud ----------
export const B13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 860, kf(t, [[0, 1.35], [len, 1.55]]))}>
    <Seabed id="b13" t={t} haze={0.2} />
    <Mini x={560} y={930} s={1.3} t={t} tool="detector" c="#3E9C6B" ping={t > 36} dir={1} skin={1} />
    <Mini x={1500} y={900} s={1.15} t={t} ph={2} tool="detector" c="#6B7FD6" dir={-1} skin={2} hat="#F2B632" />
    <Mini x={820} y={1010} s={1.6} t={t} ph={4} tool="shovel" c="#E04B3A" skin={3} />
    <GoldChest x={1130} y={960} s={1.25} t={t} open={clamp((t - 48) / 6)} />
    <Mini x={1330} y={985} s={1.5} t={t} ph={1} tool="shovel" c="#F2B632" dir={-1} skin={0} />
    {t > 36 ? <FocusRings x={620} y={880} t={t - 36} r0={50} color="#FF4A3F" /> : null}
  </g>
);

// ---------- B14: "≈ 3 TRIỆU" wrecks pop onto the blueprint card ----------
const ShipIcon: React.FC<{ x: number; y: number; t: number; rot: number; s?: number }> = ({ x, y, t, rot, s = 1 }) => {
  const k = backOut(clamp(t / 7));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * k})`}>
      <path d="M -90 0 L 90 0 L 70 40 L -70 40 Z" fill="none" stroke={SCH.line} strokeWidth={6} strokeLinejoin="round" />
      <path d="M -40 0 L -40 -34 L 20 -34 L 20 0 M 50 0 L 50 -22 L 68 -22 L 68 0" fill="none" stroke={SCH.line} strokeWidth={6} strokeLinejoin="round" />
      <path d="M -120 56 Q -60 30 0 56 T 120 56" fill="none" stroke={SCH.dim} strokeWidth={4} />
    </g>
  );
};
export const B14: React.FC<ShotProps> = ({ t, len }) => (
  <BigNum t={t} len={len} id="b14" text="≈ 3" unit="TRIỆU" caption="XÁC TÀU ĐẮM" size={300}>
    {[[250, 170, -14], [720, 140, 8], [1210, 160, -6], [1690, 190, 12], [260, 910, 10], [760, 940, -9], [1250, 920, 14], [1700, 890, -8]].map(([x, y, r], i) => (
      <ShipIcon key={i} x={x} y={y} t={t - 6 - i * 3} rot={r + Math.sin(t / 14 + i) * 3} s={0.9 + (i % 3) * 0.12} />
    ))}
  </BigNum>
);

// ---------- B15: the wreck field: ships and old hulks scattered over the seabed, a slow pan ----------
export const B15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 700], [len, 1220]]), 760, kf(t, [[0, 1.05], [len, 1.1]]))}>
    <Seabed id="b15" t={t} haze={0.35} />
    <OldWreck x={380} y={780} sc={0.7} rot={-5} />
    <StrandedShip x={760} y={860} sc={0.6} rot={-11} t={t} />
    <OldWreck x={1160} y={740} sc={0.5} rot={6} tone="#5B4228" />
    <StrandedShip x={1520} y={920} sc={0.85} rot={9} t={t} />
    <OldWreck x={1950} y={820} sc={0.8} rot={-8} />
    <StrandedShip x={2220} y={780} sc={0.5} rot={-6} t={t} />
    <ellipse cx={900} cy={700} rx={1300} ry={22} fill="#FFF4D6" opacity={0.18} />
  </g>
);

// ---------- B16: Titanic, ~3.800 m down: the wreck with a depth ruler counting from the surface ----------
export const B16: React.FC<ShotProps> = ({ t, len }) => {
  const v = Math.round(3800 * easeOut(clamp((t - 4) / 34)));
  const txt = `≈ ${String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} M`;
  const pop = 0.92 + 0.08 * backOut(clamp(t / 8));
  return (
    <g>
      <g transform={camT(kf(t, [[0, 960], [len, 920]]), kf(t, [[0, 780], [len, 740]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
        <Seabed id="b16" t={t} haze={0.25} />
        <TitanicWreck x={980} y={900} sc={1.1} t={t} />
      </g>
      <g transform={`translate(960 118) scale(${pop})`}>
        <rect x={-290} y={-84} width={580} height={128} rx={64} fill="#0B1220" opacity={0.82} stroke={SCH.live} strokeWidth={4} />
        <text textAnchor="middle" y={26} fontFamily={FONT.ui} fontWeight={700} fontSize={92} fill={SCH.live}>{txt}</text>
      </g>
      <path d={`M 1700 190 L 1700 ${190 + 560 * easeOut(clamp((t - 4) / 34))}`} stroke="#FFE27A" strokeWidth={10} strokeDasharray="4 18" strokeLinecap="round" />
      <path d={`M 1670 ${160 + 560 * easeOut(clamp((t - 4) / 34))} L 1700 ${196 + 560 * easeOut(clamp((t - 4) / 34))} L 1730 ${160 + 560 * easeOut(clamp((t - 4) / 34))}`} stroke="#FFE27A" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

// ---------- B17: Titanic as a tourist site: ticket booth, a queue with cameras, rope lines, camera flashes ----------
export const B17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 940]]), 770, kf(t, [[0, 1.1], [len, 1.2]]))}>
    <Seabed id="b17" t={t} haze={0.25} />
    <TitanicWreck x={1500} y={790} sc={0.62} t={t} />
    <TicketBooth x={520} y={900} sc={1.25} t={t} />
    <RopeLine x0={700} x1={900} y={960} s={1.1} />
    <RopeLine x0={900} x1={1100} y={960} s={1.1} />
    <RopeLine x0={1100} x1={1300} y={960} s={1.1} />
    {[760, 850, 950, 1060, 1170, 1280].map((x, i) => <Mini key={i} x={x} y={920 + (i % 2) * 18} s={1.0 + (i % 3) * 0.06} t={t} ph={i * 1.3} dir={-1} tool={i % 2 ? 'camera' : 'none'} c={SHIRTS[i]} skin={i} hat={i % 3 === 0 ? '#F4F1EA' : undefined} />)}
    {[0, 1, 2].map((i) => {
      const on = Math.floor((t + i * 7) / 9) % 3 === i && (t + i * 7) % 9 < 2;
      return on ? <circle key={i} cx={[900, 1060, 1280][i]} cy={820 + i * 8} r={44} fill="#FFFFFF" opacity={0.8} /> : null;
    })}
  </g>
);
