import React from 'react';
import { SCH, FONT, clamp, easeOut, backOut } from '../../engine';

// Chapter D props, part 6: the flow chart (skill on X, challenge on Y). Pure functions of t, 1920 x 1080 units.
//
//   cx(u), cy(v)                              chart coordinates 0..1 -> world
//   <FlowChart draw? band? tense? bored? />        axes (KỸ NĂNG, THỬ THÁCH), the diagonal "DÒNG CHẢY" channel, zones "CĂNG THẲNG" / "NHÀM CHÁN"
//                                             draw 0..1 draws the axes on; band 0..1 the channel; zones.tense / zones.bored 0..1 pop the zone labels
//   <PipDot x y mood r? />                    Pip as a dot: round head with eyes and a mouth; mood +1 smile .. 0 flat .. -1 frown
//   <PsycheIcon x y s? t? />                  head in profile with a swirl inside (psychology)
//   <FlowWaves t y /> + FlowTitle             the "trạng thái dòng chảy" title over rippling stream lines

const INK = '#16101A';
const X0 = 420;
const Y0 = 900;
const W = 1240;
const H = 700;
export const cx = (u: number) => X0 + u * W;
export const cy = (v: number) => Y0 - v * H;
const HW = 0.13; // channel half-width in v

export const FlowChart: React.FC<{ draw?: number; band?: number; tense?: number; bored?: number }> = ({ draw = 1, band = 1, tense = 0, bored = 0 }) => {
  const a = easeOut(clamp(draw));
  const ang = (Math.atan2(H, W) * 180) / Math.PI;
  const bandPts = `${cx(0)},${cy(0)} ${cx(0)},${cy(HW)} ${cx(1 - HW)},${cy(1)} ${cx(1)},${cy(1)} ${cx(1)},${cy(1 - HW)} ${cx(HW)},${cy(0)}`;
  return (
    <g>
      {/* zones */}
      <polygon points={`${cx(0)},${cy(HW)} ${cx(0)},${cy(1)} ${cx(1 - HW)},${cy(1)}`} fill="#FF5A4A" opacity={0.16 * clamp(tense * 2)} />
      <polygon points={`${cx(HW)},${cy(0)} ${cx(1)},${cy(0)} ${cx(1)},${cy(1 - HW)}`} fill="#7E8DA6" opacity={0.2 * clamp(bored * 2)} />
      <polygon points={bandPts} fill="#3DDC97" opacity={0.22 * band} />
      <path d={`M ${cx(0)} ${cy(HW)} L ${cx(1 - HW)} ${cy(1)} M ${cx(HW)} ${cy(0)} L ${cx(1)} ${cy(1 - HW)}`} stroke="#3DDC97" strokeWidth={5} strokeDasharray="22 14" opacity={band} />
      {/* axes */}
      <path d={`M ${X0} ${Y0} L ${X0 + W * a} ${Y0}`} stroke={SCH.line} strokeWidth={8} strokeLinecap="round" />
      <path d={`M ${X0} ${Y0} L ${X0} ${Y0 - H * a}`} stroke={SCH.line} strokeWidth={8} strokeLinecap="round" />
      {a > 0.95 ? (
        <g>
          <path d={`M ${X0 + W - 6} ${Y0 - 22} L ${X0 + W + 24} ${Y0} L ${X0 + W - 6} ${Y0 + 22}`} stroke={SCH.line} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M ${X0 - 22} ${Y0 - H + 6} L ${X0} ${Y0 - H - 24} L ${X0 + 22} ${Y0 - H + 6}`} stroke={SCH.line} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x={X0 + W / 2} y={Y0 + 84} textAnchor="middle" fontFamily={FONT.ui} fontSize={52} fill={SCH.line} letterSpacing={6}>KỸ NĂNG</text>
          <g transform={`translate(${X0 - 70} ${Y0 - H / 2}) rotate(-90)`}>
            <text textAnchor="middle" fontFamily={FONT.ui} fontSize={52} fill={SCH.line} letterSpacing={6}>THỬ THÁCH</text>
          </g>
        </g>
      ) : null}
      {band > 0.8 ? (
        <g transform={`translate(${cx(0.27)} ${cy(0.27)}) rotate(${-ang})`} opacity={clamp((band - 0.8) * 5)}>
          <text textAnchor="middle" y={14} fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#7BFFC3" letterSpacing={8}>DÒNG CHẢY</text>
        </g>
      ) : null}
      {tense > 0 ? (
        <g transform={`translate(${cx(0.2)} ${cy(0.8)}) scale(${backOut(clamp(tense))})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#FF8A7A" letterSpacing={4}>CĂNG THẲNG</text>
        </g>
      ) : null}
      {bored > 0 ? (
        <g transform={`translate(${cx(0.74)} ${cy(0.34)}) scale(${backOut(clamp(bored))})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#B8C4DA" letterSpacing={4}>NHÀM CHÁN</text>
        </g>
      ) : null}
    </g>
  );
};

/** Pip as a dot: mood +1 grin, 0 flat line, -1 frown; r = radius. */
export const PipDot: React.FC<{ x: number; y: number; mood: number; r?: number; glow?: number }> = ({ x, y, mood, r = 40, glow = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    {glow > 0 ? <circle r={r * 2.4} fill="#FFE27A" opacity={0.28 * glow} /> : null}
    <circle r={r} fill="#F6EFE3" stroke={INK} strokeWidth={r * 0.14} />
    <circle cx={-r * 0.34} cy={-r * 0.14} r={r * 0.1} fill={INK} />
    <circle cx={r * 0.34} cy={-r * 0.14} r={r * 0.1} fill={INK} />
    {mood < 0.15 ? <path d={`M ${-r * 0.4} ${r * 0.4} H ${r * 0.4}`} stroke={INK} strokeWidth={r * 0.1} strokeLinecap="round" /> : <path d={`M ${-r * 0.4} ${r * 0.28} Q 0 ${r * (0.28 + 0.5 * mood)} ${r * 0.4} ${r * 0.28}`} stroke={INK} strokeWidth={r * 0.1} fill="none" strokeLinecap="round" />}
    {mood < 0.15 ? <path d={`M ${-r * 0.5} ${-r * 0.3} H ${-r * 0.2} M ${r * 0.2} ${-r * 0.3} H ${r * 0.5}`} stroke={INK} strokeWidth={r * 0.09} strokeLinecap="round" /> : null}
  </g>
);

/** A head in profile (facing right) with a swirl in it: a plain "psychology" icon, about 520 tall at s 1. */
export const PsycheIcon: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={SCH.line} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M -150 230 Q -170 120 -190 40 Q -230 -120 -90 -220 Q 80 -290 190 -170 Q 230 -110 200 -40 L 240 30 Q 246 50 220 54 L 196 56 Q 200 96 176 120 Q 150 140 120 130 L 110 230 Z" fill="#14233A" />
    <g stroke={SCH.live} strokeWidth={8} style={{ filter: `drop-shadow(0 0 10px ${SCH.glow})` }}>
      <path d={`M 20 -70 m -70 0 a 70 70 0 1 1 70 70 a 44 44 0 1 1 -44 -44 a 20 20 0 1 1 20 20`} transform={`rotate(${t * 3} 20 -70)`} />
    </g>
  </g>
);

/** The stream: rippling lines drawn across the frame at height y. */
export const FlowWaves: React.FC<{ t: number; y: number; n?: number }> = ({ t, y, n = 5 }) => (
  <g fill="none" strokeLinecap="round">
    {Array.from({ length: n }).map((_, i) => {
      const yy = y + i * 44;
      const d = Array.from({ length: 41 }).map((_, k) => `${k ? 'L' : 'M'} ${-20 + k * 49} ${yy + Math.sin(k * 0.5 + t * 0.2 + i) * (22 - i * 2.5)}`).join(' ');
      return <path key={i} d={d} stroke={i % 2 ? '#3DDC97' : '#7FD4FF'} strokeWidth={9 - i} opacity={0.85 - i * 0.1} />;
    })}
  </g>
);
