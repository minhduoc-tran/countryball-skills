import React from 'react';
import { Hero, Street, ShotProps, LOOKS, basePose, Pose, faceAt, kf, clamp, easeOut, backOut, camT, SCH, SchLabel, PlantIcon, FONT, DrawOn, rnd } from '../../engine';
import { UkraineOutline, SourceTag, TickBadge, OffIcon, PlantHorizon, CardBase } from './chc-cards-and-icons';
import { hipFor } from './chc-neighbours-props';

// Chapter C, month one, the power (looks "m1", "blackout"): C9 a far power plant goes dark; C10-C13 the number card
// (Ukraine, winter 2022, about half of the energy system damaged, source: the Ukrainian government, "ĐÓ LÀ THẬT");
// C14 a street blacks out; C15-C16 four icons go dark one by one (fridge, water pump, phone signal, hospital lift).

const PIP = LOOKS.pipHood;

// ---------- C9: dusk, a power plant far on the horizon; its lights go out (no smoke, nothing shown happening) ----------
export const C9: React.FC<ShotProps> = ({ t, len }) => {
  const out = kf(t, [[0, 0], [58, 0], [82, 1]], (v) => v);
  const pose: Pose = { ...basePose, x: 330, y: hipFor(1030, 1.15), scale: 1.15, yaw: 0.85, facing: 1, tilt: 1, look: 0.8, armL: { a: 6, b: 14 }, armR: { a: 8, b: 16 }, ...faceAt(t, [[0, 'neutral'], [60, 'worried']]) };
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 1010]]), 590, kf(t, [[0, 1.0], [len, 1.18]]))}>
      <PlantHorizon t={t} id="c9" out={out} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0.6} />
    </g>
  );
};

// ---------- C10: card: UKRAINE, MÙA ĐÔNG 2022: the plain outline, snow ----------
export const C10: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <CardBase t={t} len={len} id="c10">
      <UkraineOutline x={600} y={560} s={1.4} t={t} dur={18} />
      <SchLabel x={600} y={905} t={t - 12} text="UKRAINE" size={64} color={SCH.line} />
      {/* a few flakes drifting down: it is winter */}
      {Array.from({ length: 26 }).map((_, i) => {
        const ph = ((t * (0.5 + rnd(2, i) * 0.6) + rnd(3, i) * 300) % 300) / 300;
        return <circle key={i} cx={(rnd(4, i) * 1100 + 60 + Math.sin(t / 20 + i) * 18) % 1920} cy={-20 + ph * 1120} r={3 + rnd(5, i) * 4} fill="#EAF2FF" opacity={0.5} />;
      })}
      <g opacity={easeOut(clamp((t - 8) / 8))} transform={`translate(${(1 - easeOut(clamp((t - 8) / 10))) * 80} 0)`}>
        <text x={1160} y={470} fontFamily={FONT.ui} fontWeight={700} fontSize={110} fill={SCH.line} letterSpacing={4}>MÙA ĐÔNG</text>
        <text x={1150} y={690} fontFamily={FONT.ui} fontWeight={700} fontSize={250} fill={SCH.live} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>2022</text>
      </g>
    </CardBase>
  );
};

// ---------- C11: the source speaks: "CHÍNH PHỦ UKRAINE" (a plain government-building icon, a speech mark) ----------
export const C11: React.FC<ShotProps> = ({ t, len }) => {
  const pop = backOut(clamp((t + 2) / 8));
  const lines = [0, 1, 2];
  return (
    <CardBase t={t} len={len} id="c11">
      <g transform={`translate(640 470) scale(${2.3 * pop})`} stroke={SCH.line} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M -90 -40 L 0 -96 L 90 -40 Z" />
        <path d="M -76 -40 L 76 -40 M -80 70 L 80 70 M -96 90 L 96 90" />
        {[-56, -19, 19, 56].map((x) => <path key={x} d={`M ${x} -28 L ${x} 70`} />)}
        <circle cx={0} cy={-58} r={9} />
      </g>
      <g transform={`translate(1130 340) scale(${backOut(clamp((t - 6) / 8))})`}>
        <path d="M 0 0 L 640 0 Q 680 0 680 40 L 680 240 Q 680 280 640 280 L 200 280 L 100 360 L 120 280 L 40 280 Q 0 280 0 240 L 0 40 Q 0 0 40 0 Z" fill="#16233A" stroke={SCH.line} strokeWidth={5} strokeLinejoin="round" />
        {lines.map((i) => (
          <g key={i}>
            <DrawOn d={`M 50 ${70 + i * 62} L ${i === 2 ? 360 : 620} ${70 + i * 62}`} t={t - 12 - i * 5} dur={10} color={SCH.dim} width={12} />
          </g>
        ))}
      </g>
      <SchLabel x={640} y={780} t={t - 4} text="CHÍNH PHỦ UKRAINE" size={62} color={SCH.line} />
      <SourceTag t={t - 14} text="CHÍNH PHỦ UKRAINE" />
    </CardBase>
  );
};

// ---------- C12 / C13: "≈ 1/2" and the grid of ten plants: half of them go dark ----------
const KINDS = ['tower', 'wind', 'solar', 'dam', 'factory'] as const;
const PlantGrid: React.FC<{ t: number; darkAt: number[] | null }> = ({ t, darkAt }) => (
  <g>
    {Array.from({ length: 10 }).map((_, i) => {
      const x = 1030 + (i % 5) * 170;
      const y = 390 + Math.floor(i / 5) * 210;
      const dark = darkAt ? darkAt[i] >= 0 && t >= darkAt[i] : false;
      const flick = darkAt && darkAt[i] >= 0 && t >= darkAt[i] && t < darkAt[i] + 5 ? Math.floor((t - darkAt[i]) / 2) % 2 === 0 : false;
      const pop = backOut(clamp((t - 2 - i * 1.5) / 6));
      return (
        <g key={i} transform={`translate(${x} ${y}) scale(${0.95 * pop})`}>
          {dark && !flick ? <path d="M -34 -34 L 34 34 M 34 -34 L -34 34" stroke="#FF5A48" strokeWidth={7} strokeLinecap="round" opacity={0.85} /> : null}
          <PlantIcon x={0} y={0} kind={KINDS[i % 5]} on={dark && !flick ? 0 : 1} t={t + i * 3} s={0.9} />
        </g>
      );
    })}
  </g>
);

const HalfNumber: React.FC<{ t: number }> = ({ t }) => {
  const pop = 0.88 + 0.12 * backOut(clamp((t + 2) / 8));
  return (
    <g transform={`translate(470 520) scale(${pop})`}>
      <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={200} fill={SCH.live} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>≈ 1/2</text>
    </g>
  );
};

export const C12: React.FC<ShotProps> = ({ t, len }) => (
  <CardBase t={t} len={len} id="c12" z1={1.08}>
    <HalfNumber t={t} />
    <PlantGrid t={t} darkAt={null} />
    <SchLabel x={1300} y={850} t={t - 10} text="HỆ THỐNG NĂNG LƯỢNG" size={44} color={SCH.line} />
    <SourceTag t={t - 6} text="CHÍNH PHỦ UKRAINE" />
  </CardBase>
);

export const C13: React.FC<ShotProps> = ({ t, len }) => {
  const darkAt = [2, -1, 7, -1, 12, -1, 17, -1, 22, -1];
  return (
    <CardBase t={t} len={len} id="c13" z1={1.08}>
      <HalfNumber t={t + 8} />
      <PlantGrid t={t + 8} darkAt={darkAt.map((d) => (d < 0 ? d : d + 8))} />
      <SchLabel x={1300} y={850} t={t} text="BỊ HƯ HẠI" size={52} color="#FF8A6A" />
      <SourceTag t={0} text="CHÍNH PHỦ UKRAINE" />
      <TickBadge t={t - 29} x={430} y={760} s={0.9} />
    </CardBase>
  );
};

// ---------- C14: the street goes dark: lamps, windows and signs die in a sweep ----------
export const C14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 600], [len, 570]]), kf(t, [[0, 1.0], [len, 1.28]]))}>
    <Street t={t + 220} id="c14" night blackout={kf(t, [[0, 0.02], [28, 1]], (v) => v)} moon={false} />
  </g>
);

// ---------- C15 / C16: icons going dark one by one on their words ----------
export const C15: React.FC<ShotProps> = ({ t, len }) => (
  <CardBase t={t} len={len} id="c15" z1={1.05}>
    <OffIcon kind="fridge" x={560} y={470} s={2} offT={t - 6} pop={(t + 2) / 7} label="TỦ LẠNH" />
    <OffIcon kind="pump" x={1340} y={470} s={2} offT={t - 25} pop={(t - 12) / 7} label="MÁY BƠM NƯỚC" />
  </CardBase>
);

export const C16: React.FC<ShotProps> = ({ t, len }) => (
  <CardBase t={t} len={len} id="c16" z1={1.07}>
    <OffIcon kind="signal" x={520} y={470} s={2} offT={t - 5} pop={(t + 2) / 7} label="SÓNG ĐIỆN THOẠI" />
    <OffIcon kind="lift" x={1400} y={470} s={2} offT={t - 38} pop={(t - 22) / 7} label="THANG MÁY BỆNH VIỆN" />
  </CardBase>
);

