import React from 'react';
import { clamp, easeOut, backOut, SCH, FONT, UI } from '../../engine';

// Chapter D, schematic card pieces shared by its shot files: the small source tag, the green "ĐÓ LÀ THẬT" tick line,
// a child as a line icon, a map pin with a ring. All pure functions of the frame counter they are given.

/** A small source tag (a document icon + the source's name) bottom-left of a number card; pops in at t = 0. */
export const SourceTag: React.FC<{ x: number; y: number; t: number; text: string }> = ({ x, y, t, text }) => {
  if (t < 0) return null;
  const s = backOut(clamp(t / 7));
  const w = 96 + text.length * 19;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={0} y={-30} width={w} height={60} rx={30} fill={UI.pill} opacity={0.78} />
      <rect x={0} y={-30} width={w} height={60} rx={30} fill="none" stroke={SCH.dim} strokeWidth={2.5} />
      <g transform="translate(30 0)" stroke={SCH.dim} strokeWidth={3} fill="none" strokeLinejoin="round" strokeLinecap="round">
        <path d="M -11 -15 H 6 L 12 -9 V 15 H -11 Z" />
        <path d="M -5 -3 H 6 M -5 4 H 6 M -5 11 H 2" />
      </g>
      <text x={58} y={10} fontFamily={FONT.ui} fontSize={30} fill={SCH.line} letterSpacing={1}>{text}</text>
    </g>
  );
};

/** The green tick disc and "ĐÓ LÀ THẬT" in one line, centred on x; the tick draws on after the disc pops. */
export const ThatReal: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 8));
  const p = easeOut(clamp((t - 4) / 8));
  const ring = clamp((t - 3) / 14);
  const txt = easeOut(clamp((t - 5) / 7));
  return (
    <g transform={`translate(${x - 200} ${y})`}>
      <g transform={`scale(${k})`} style={{ filter: 'drop-shadow(0 0 22px rgba(47,191,113,0.65))' }}>
        {ring > 0 && ring < 1 ? <circle r={58 + ring * 70} fill="none" stroke="#2FBF71" strokeWidth={7 * (1 - ring)} opacity={1 - ring} /> : null}
        <circle r={58} fill="#2FBF71" />
        <path d="M -26 3 L -8 22 L 29 -20" stroke="#E9FFF2" strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
      </g>
      <text x={96} y={26} fontFamily={FONT.ui} fontWeight={700} fontSize={74} fill={UI.text} letterSpacing={4} opacity={txt}>ĐÓ LÀ THẬT</text>
    </g>
  );
};

/** A child as a schematic line icon (round head, small body, a schoolbag strap), centred, about 100 tall at s 1. */
export const ChildIcon: React.FC<{ x: number; y: number; s?: number; on?: boolean; o?: number; glow?: boolean; bunch?: boolean }> = ({ x, y, s = 1, on = false, o = 1, glow = false, bunch = false }) => {
  const c = on ? SCH.live : SCH.line;
  const fill = on ? `${SCH.live}33` : 'none';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} stroke={c} strokeWidth={4.5} fill="none" strokeLinejoin="round" strokeLinecap="round" style={glow ? { filter: `drop-shadow(0 0 12px ${SCH.glow})` } : undefined}>
      <circle cx={0} cy={-30} r={15} fill={fill} />
      {bunch ? <path d="M -15 -34 q -12 -2 -12 10 M 15 -34 q 12 -2 12 10" /> : null}
      <path d="M -17 38 L -15 -6 Q 0 -12 15 -6 L 17 38 Z" fill={fill} />
      <path d="M -11 -6 L -8 38" opacity={0.7} />
      <path d="M -9 38 V 50 M 9 38 V 50" />
    </g>
  );
};

/** A map pin standing at (x, y) (its point), with a ring pulsing out of its foot. */
export const Pin: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 8));
  const r = ((t * 0.04) % 1 + 1) % 1;
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse rx={20 + r * 70} ry={8 + r * 28} fill="none" stroke={SCH.live} strokeWidth={4} opacity={1 - r} />
      <g transform={`scale(${s * k})`} style={{ filter: `drop-shadow(0 0 12px ${SCH.glow})` }}>
        <path d="M 0 0 C -30 -40 -42 -60 -42 -86 A 42 42 0 0 1 42 -86 C 42 -60 30 -40 0 0 Z" fill={SCH.live} />
        <circle cx={0} cy={-86} r={15} fill="#101A2A" />
      </g>
    </g>
  );
};
