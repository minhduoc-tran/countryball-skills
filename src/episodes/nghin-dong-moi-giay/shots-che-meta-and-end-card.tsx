import React from 'react';
import {
  kf, clamp, easeOut, easeInOut, camT, Glow, Dust, Schematic, SchLabel, SCH, FONT, backOut, ShotProps,
} from '../../engine';
import { Night, Sil } from './shots-che-choice';
import { vnInt } from './che-clock-and-hourglass-props';

// Chapter E, the wink and the end card: the time of this very video is worth about 300.000 đ (E26, a schematic with
// a play button and two counters), then the call to comments over the family window seen from the street at night
// (E27, E28), the second line landing on "tiền hay thời gian", a fade to black at the very end (episode end 304.77 s).

/** A play button (a round plate, a triangle) centred on (x, y); `p` 0..1 draws a progress ring round it. */
const PlayButton: React.FC<{ x: number; y: number; p: number; t: number }> = ({ x, y, p, t }) => {
  const R = 190;
  const C = 2 * Math.PI * R;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={R} fill="#0B1424" fillOpacity={0.7} stroke={SCH.dim} strokeWidth={8} />
      <circle r={R} fill="none" stroke={SCH.live} strokeWidth={12} strokeLinecap="round" strokeDasharray={`${C * p} ${C}`} transform="rotate(-90)" style={{ filter: `drop-shadow(0 0 12px ${SCH.glow})` }} />
      <path d="M -50 -76 L 84 0 L -50 76 Z" fill={SCH.line} stroke={SCH.line} strokeWidth={10} strokeLinejoin="round" transform={`scale(${1 + 0.03 * Math.sin(t / 5)})`} />
    </g>
  );
};

const mmss = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;

// ---------- E26: schematic: the play button, a timer racing to 05:00, the money counting up to 300.000 đ ----------
export const E26: React.FC<ShotProps> = ({ t, len }) => {
  const p = easeInOut(clamp((t - 20) / 100));
  const sec = 300 * p;
  const done = clamp((t - 120) / 8);
  const tick = t % 30 < 4 && t > 20 && p < 1;
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 980]]), 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <Schematic t={t} id="e26sch" />
      <PlayButton x={560} y={520} p={p} t={t} />
      <SchLabel x={560} y={820} t={8} text="VIDEO NÀY" size={34} color={SCH.dim} />
      <text x={1250} y={470} textAnchor="middle" fontFamily={FONT.ui} fontSize={150} fill={SCH.line}>{mmss(sec)}</text>
      <g transform={`translate(1250 545) scale(${backOut(done)})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontSize={52} fill={SCH.dim} letterSpacing={2}>≈ 5 PHÚT</text>
      </g>
      <text x={1250} y={730} textAnchor="middle" fontFamily={FONT.ui} fontSize={tick ? 128 : 120} fill={SCH.live} style={{ filter: `drop-shadow(0 0 16px ${SCH.glow}88)` }}>
        {(done > 0.5 ? '≈ ' : '') + vnInt(sec * 1000)} đ
      </text>
    </g>
  );
};

/** The family's house from the street at night: the big warm window, three silhouettes laughing, a street lamp, a fence. */
const HouseNight: React.FC<{ t: number }> = ({ t }) => {
  const flick = 0.94 + 0.06 * Math.sin(t / 6);
  return (
    <g>
      <Night id="e27sky" />
      <rect x={-300} y={860} width={2520} height={600} fill="#1A1220" />
      <Glow x={960} y={620} r={900} o={0.45 * flick} />
      <rect x={300} y={300} width={1320} height={580} fill="#2E2230" />
      <rect x={300} y={270} width={1320} height={44} fill="#3A2A30" />
      <rect x={560} y={400} width={800} height={380} rx={8} fill="#FFD9A0" />
      <rect x={560} y={400} width={800} height={380} rx={8} fill="#FF9A4A" opacity={0.3 * flick} />
      <Sil x={700} y={500} s={0.95} kind="sis" bob={Math.sin(t / 8) * 4} />
      <Sil x={890} y={480} s={1.15} kind="mum" bob={Math.sin(t / 10 + 1) * 3} />
      <Sil x={1190} y={510} s={1.0} kind="mo" bob={Math.sin(t / 7 + 2) * 4} />
      <rect x={560} y={716} width={800} height={64} fill="#8A5A3E" />
      <path d="M 960 400 L 960 780 M 560 590 L 1360 590" stroke="#2E2230" strokeWidth={12} />
      <rect x={536} y={388} width={848} height={18} rx={6} fill="#3A2A30" />
      <rect x={536} y={776} width={848} height={20} rx={6} fill="#3A2A30" />
      <rect x={-300} y={880} width={2520} height={20} fill="#2A2030" />
      {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={-120 + i * 110} y={820} width={14} height={80} fill="#241C2A" />)}
      <path d="M -120 840 L 2100 840 M -120 880 L 2100 880" stroke="#241C2A" strokeWidth={8} />
      <g transform="translate(1760 0)">
        <rect x={-6} y={420} width={12} height={480} fill="#2A2030" />
        <circle cx={0} cy={420} r={26} fill="#FFE7B3" />
        <Glow x={0} y={440} r={300} o={0.3} />
      </g>
      <Dust t={t} seed={27} x0={500} y0={400} w={900} h={460} n={30} o={0.45} />
    </g>
  );
};

/** The two end-card lines, on the screen (not the world): line 1 pops at `t1`, line 2 at `t2` (null: not yet); accent words pulse at `a1`, `a2`. */
const EndText: React.FC<{ t: number; t1: number; t2: number | null; a1?: number; a2?: number }> = ({ t, t1, t2, a1 = -99, a2 = -99 }) => {
  const p1 = backOut(clamp((t - t1) / 9));
  const p2 = t2 === null ? 0 : backOut(clamp((t - t2) / 9));
  const pulse = (a: number) => (t >= a && t < a + 12 ? 1 + 0.14 * Math.sin(((t - a) / 12) * Math.PI) : 1);
  return (
    <g>
      <g transform={`translate(960 150) scale(${p1})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={66} letterSpacing={3} fill="#F6EFE3" stroke="#120B24" strokeWidth={10} paintOrder="stroke">
          VIỆC ĐẦU TIÊN BẠN SẼ LÀM LÀ GÌ?
        </text>
      </g>
      {p2 > 0 ? (
        <g transform={`translate(960 262) scale(${p2})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={90} fill="#FF8A3D" stroke="#120B24" strokeWidth={12} paintOrder="stroke" style={{ filter: 'drop-shadow(0 0 22px rgba(255,138,61,0.5))' }}>
            <tspan fill="#7CF0A8" style={{ fontSize: 90 * pulse(a1) }}>TIỀN</tspan>
            <tspan> HAY </tspan>
            <tspan fill="#FFE27A" style={{ fontSize: 90 * pulse(a2) }}>THỜI GIAN?</tspan>
          </text>
        </g>
      ) : null}
    </g>
  );
};

// ---------- E27: end card, wide: the family window at night from the street, the first question ----------
export const E27: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), kf(t, [[0, 480], [len, 470]]), kf(t, [[0, 1.25], [len, 1.4]]))}>
      <HouseNight t={t} />
    </g>
    <EndText t={t} t1={4} t2={null} />
  </g>
);

// ---------- E28: end card, closer on the window: the second line, "tiền" then "thời gian" pulsing, a fade to black ----------
export const E28: React.FC<ShotProps> = ({ t, len }) => {
  const fade = easeOut(clamp((t - (len - 48)) / 44));
  const tt = t + 142; // the text clock continues from E27 so line 1 does not pop again
  return (
    <g>
      <g transform={camT(kf(t, [[0, 980], [len, 960]]), kf(t, [[0, 480], [len, 470]]), kf(t, [[0, 1.4], [len, 1.65]]))}>
        <HouseNight t={tt} />
      </g>
      <EndText t={tt} t1={4} t2={146} a1={142 + 49} a2={142 + 75} />
      <rect x={-10} y={-10} width={1940} height={1100} fill="#000" opacity={fade} />
    </g>
  );
};
