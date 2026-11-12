import React from 'react';
import {
  Hero, faceAt, kf, clamp, easeOut, camT, walkPose, Glow, Dust, Bedroom, DuskSky, Skyline, Stars, TitleCard, ShotProps, rnd,
} from '../../engine';
import { StickyNote, noteSpots } from './cha-note-and-chip-props';
import { PipDesk, PIP, LID_SPOTS } from './cha-pip-desk-scene';

// Chapter A, the premise (11:30-16:40): the title over Pip's bedroom papered in "MAI LÀM" notes, then "not just homework,
// but a whole life": a school bag wearing notes, a road to the horizon covered in them.

// ---------- A7: TitleCard over the bedroom: dozens of notes on the walls, the bed, the window, the desk and Pip's forehead ----------
const WALL = noteSpots(30, [500, 400, 1400, 700], 3);
const FLOOR = noteSpots(12, [520, 790, 1400, 1010], 7);
const DESK_FRONT = noteSpots(12, [600, 735, 1320, 920], 11);
const ALL = [...WALL, ...FLOOR, ...DESK_FRONT].map((n, i) => ({ ...n, w: 52 + rnd(5, i) * 34 }));

export const A7: React.FC<ShotProps> = ({ t, len }) => {
  const face = faceAt(t, [[0, 'neutral'], [22, 'worried']]);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
      <PipDesk t={t + 90} id="ca7" lamp={0.85} face={face} pose={{ yaw: 0.2, tilt: 2 }}
        notes={LID_SPOTS.map((n, i) => ({ ...n, pop: clamp((t - 2 - i * 3) / 6) }))}
        front={(
          <g>
            {ALL.map((n, i) => <StickyNote key={i} x={n.x} y={n.y} w={n.w} rot={n.rot} pop={i < 14 ? 1 : clamp((t - 4 - (i - 14) * 1.25) / 6)} />)}
            <StickyNote x={950} y={508} w={46} rot={-8} pop={clamp((t - 30) / 6)} />
          </g>
        )} />
      <TitleCard t={t} lines={['SẼ RA SAO NẾU BẠN', 'TRÌ HOÃN MỌI THỨ?']} accent="TRÌ" accentT={22} size={112} y={165} />
    </g>
  );
};

// ---------- A8: "not just homework": a school bag, a pile of books, notes stuck on each ----------
export const A8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 940]]), kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
    <g filter="url(#blur16)">
      <g transform="translate(-520 -520) scale(1.9)"><Bedroom t={t + 20} id="ca8" lamp={0.8} crossed={0} /></g>
    </g>
    <rect x={-200} y={-200} width={2320} height={1480} fill="#0A0814" opacity={0.3} />
    <rect x={-200} y={840} width={2320} height={400} fill="#3A2C30" />
    <rect x={-200} y={836} width={2320} height={6} fill="#FFC98A" opacity={0.5} />
    {/* the textbooks, spines out */}
    {[['TOÁN', '#4A5A8A', 250, 0], ['VĂN', '#8A4A52', 230, 1], ['ANH', '#4A8A6A', 270, 2]].map(([n, c, h, i]) => (
      <g key={n as string} transform={`translate(${430 + (i as number) * 92} ${840 - (h as number)})`}>
        <rect x={6} y={6} width={86} height={h as number} fill="#000" opacity={0.3} />
        <rect width={86} height={h as number} rx={5} fill={c as string} />
        <rect x={6} y={26} width={74} height={8} fill="#F6EFE3" opacity={0.7} />
        <text x={43} y={(h as number) * 0.55} textAnchor="middle" fontFamily="Space Mono" fontSize={26} fill="#F6EFE3" transform={`rotate(-90 43 ${(h as number) * 0.55})`}>{n as string}</text>
      </g>
    ))}
    <StickyNote x={520} y={640} w={90} rot={9} pop={clamp((t - 3) / 6)} />
    {/* the bag */}
    <g transform="translate(1010 840)">
      <ellipse cx={0} cy={6} rx={330} ry={24} fill="#000" opacity={0.4} />
      <path d="M -270 0 Q -290 -420 -150 -560 Q 0 -620 150 -560 Q 290 -420 270 0 Z" fill="#2F7F78" />
      <path d="M -270 0 Q -290 -420 -150 -560 Q -230 -380 -210 0 Z" fill="#256660" />
      <path d="M -170 -500 Q 0 -560 170 -500 L 190 -340 Q 0 -300 -190 -340 Z" fill="#276E68" />
      <rect x={-34} y={-360} width={68} height={52} rx={10} fill="#E9C46A" />
      <rect x={-210} y={-260} width={420} height={230} rx={34} fill="#3A918A" />
      <path d="M -190 -170 L 190 -170" stroke="#256660" strokeWidth={6} />
      <path d="M -150 -540 Q 0 -590 150 -540" stroke="#FFC98A" strokeWidth={6} fill="none" opacity={0.5} />
      <StickyNote x={-30} y={-110} w={150} rot={-7} pop={clamp((t - 8) / 6)} />
      <StickyNote x={150} y={-420} w={110} rot={12} pop={clamp((t - 13) / 6)} />
    </g>
    <Glow x={1010} y={420} r={620} o={0.3} />
    <Dust t={t} seed={9} x0={300} y0={250} w={1300} h={600} n={20} o={0.4} />
  </g>
);

// ---------- A9: "a whole life": a road to the horizon papered in notes, more of them rolling out ahead of Pip as he walks ----------
const ROAD: { x: number; y: number; rot: number; w: number }[] = [];
for (let r = 0; r < 4; r++) {
  for (let c = 0; c < 36; c++) {
    ROAD.push({ x: -200 + c * 104 + (r % 2) * 50 + rnd(2, c + r * 40) * 30, y: 790 + r * 70 + rnd(3, c + r * 40) * 14, rot: (rnd(4, c + r * 40) - 0.5) * 36, w: 96 + r * 12 });
  }
}
export const A9: React.FC<ShotProps> = ({ t, len }) => {
  const px = kf(t, [[0, 560], [len, 1060]], (v) => v);
  const front = px + 120 + t * 38;
  const pose = walkPose(px, t * 0.42, 905, 0.9, { expr: 'worried' } as never);
  return (
    <g transform={camT(px + 140, 600, kf(t, [[0, 1.0], [len, 0.92]]))}>
      <DuskSky id="ca9sky" horizonY={640} />
      <Stars seed={3} x0={-400} y0={-300} w={2800} h={560} t={t} n={40} o={0.5} />
      <Skyline y={700} seed={4} color="#3A2A5A" h={220} />
      <Skyline y={720} seed={9} color="#2A1B45" h={140} />
      <Glow x={px + 300} y={680} r={700} o={0.35} />
      {/* the road */}
      <rect x={-400} y={720} width={3200} height={500} fill="#2E2838" />
      <rect x={-400} y={720} width={3200} height={8} fill="#FFC98A" opacity={0.4} />
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-300 + i * 150} y={868} width={80} height={9} fill="#F2D9A8" opacity={0.35} />)}
      {/* flat notes covering the road: squashed to lie on the ground, popping in ahead of Pip */}
      {ROAD.map((n, i) => {
        const pop = clamp((front - n.x) / 90);
        return pop <= 0 ? null : (
          <g key={i} transform={`translate(${n.x} ${n.y}) scale(1 0.42)`}>
            <StickyNote x={0} y={0} w={n.w} rot={n.rot} pop={pop} />
          </g>
        );
      })}
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      {/* notes on the lamp posts and a sign ahead */}
      {[1200, 1560, 1900].map((x, i) => (
        <g key={x}>
          <rect x={x} y={420} width={12} height={310} fill="#1E1A2E" />
          <StickyNote x={x + 6} y={470} w={70} rot={i * 9 - 8} pop={clamp((front - x) / 90)} />
        </g>
      ))}
      <Dust t={t} seed={5} x0={px - 400} y0={520} w={1100} h={300} n={16} o={0.35} />
    </g>
  );
};
