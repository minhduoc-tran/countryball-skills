import React from 'react';
import { Schematic, SCH, FONT, UI, clamp, easeOut, backOut, kf, Look, Sparkle } from '../../engine';

// Chapter B props (2/5): the real-number card, the green "Đó là thật" tick stamp, and an arm that enters an insert in any
// character's sleeve colour. Pure functions of the frame counters they are given.

/** "4,9" style number: a Vietnamese decimal comma, thousands dots. */
export const fmtVN = (v: number, dec = 0) => {
  const [i, d] = v.toFixed(dec).split('.');
  const ip = i.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return d ? `${ip},${d}` : ip;
};

/**
 * The number card on the blueprint: a huge orange number that counts up from 0, its unit below, a short caption.
 * `statik` shows `to` at once (a year). Decorations (icons, people) go in `children`, drawn over the grid.
 */
export const NumCard: React.FC<{
  t: number; len: number; id: string; to: number; dec?: number; unit?: string; caption?: string; statik?: boolean; cx?: number; dur?: number; children?: React.ReactNode;
}> = ({ t, len, id, to, dec = 0, unit, caption, statik = false, cx = 960, dur = 34, children }) => {
  const v = statik ? to : to * easeOut(clamp(t / dur));
  const text = statik ? String(to) : fmtVN(v, dec);
  const pop = 0.9 + 0.1 * backOut(clamp((t + 2) / 8));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
      <Schematic t={t} id={id} />
      {children}
      <g transform={`translate(${cx} ${statik ? 560 : 470}) scale(${pop})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={statik ? 330 : 300} fill={SCH.live} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>
          {text}
        </text>
      </g>
      {unit ? (
        <text x={cx} y={640} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={128} fill={SCH.line} letterSpacing={6} opacity={easeOut(clamp((t - 4) / 7))}>
          {unit}
        </text>
      ) : null}
      {caption ? (
        <text x={cx} y={statik ? 690 : 740} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill={SCH.dim} letterSpacing={2} opacity={easeOut(clamp((t - 10) / 8))}>
          {caption}
        </text>
      ) : null}
    </g>
  );
};

/** The "Đó là thật." stamp: a green disc pops, the tick draws on, a ring pulses out, a short caption underneath. */
export const TickStamp: React.FC<{ t: number; id: string; text?: string; sub?: string }> = ({ t, id, text = 'ĐÓ LÀ THẬT', sub }) => {
  const disc = 0.5 + 0.5 * backOut(clamp((t + 2) / 7));
  const tick = easeOut(clamp((t - 3) / 8));
  const ring = clamp((t - 3) / 16);
  return (
    <g>
      <Schematic t={t} id={id} />
      <g transform={`translate(960 450) scale(${disc})`}>
        <circle r={ring > 0 && ring < 1 ? 150 + ring * 130 : 0} fill="none" stroke="#2FBF71" strokeWidth={8 * (1 - ring)} opacity={1 - ring} />
        <circle r={150} fill="#2FBF71" style={{ filter: 'drop-shadow(0 0 30px #2FBF71AA)' }} />
        <path d="M -68 6 L -22 52 L 74 -52" stroke="#E9FFF2" strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - tick} />
      </g>
      <text x={960} y={735} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={92} fill={UI.text} letterSpacing={5} opacity={easeOut(clamp((t - 6) / 7))}>
        {text}
      </text>
      {sub ? (
        <text x={960} y={810} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fill={SCH.dim} letterSpacing={2} opacity={easeOut(clamp((t - 10) / 8))}>
          {sub}
        </text>
      ) : null}
      <Sparkle x={760} y={330} t={t - 8} s={1.1} />
      <Sparkle x={1170} y={380} t={t - 11} s={0.9} />
    </g>
  );
};

/** A sleeve from (fx, fy) off frame to a mitten at (x, y), in `look`'s colours (InsertArm only does Pip). */
export const LookArm: React.FC<{ look: Look; x: number; y: number; fx: number; fy: number; rot?: number; s?: number; width?: number; fist?: boolean }> = ({ look, x, y, fx, fy, rot = 0, s = 4.8, width = 112, fist = false }) => {
  const d = `M ${x + (fx - x) * 0.08} ${y + (fy - y) * 0.08} Q ${x + (fx - x) * 0.45 + 40} ${y + (fy - y) * 0.45} ${fx} ${fy}`;
  return (
    <g filter="url(#rimR)">
      <path d={d} stroke={look.line} strokeWidth={width + 18} fill="none" strokeLinecap="round" />
      <path d={d} stroke={look.limb} strokeWidth={width} fill="none" strokeLinecap="round" />
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
        {fist ? (
          <ellipse cx={0} cy={6} rx={14} ry={13} fill={look.hand} stroke={look.line} strokeWidth={2.6} />
        ) : (
          <path d="M -11 -2 Q -14 14 -6 18 L 7 18 Q 14 14 11 -2 Z" fill={look.hand} stroke={look.line} strokeWidth={2.6} strokeLinejoin="round" />
        )}
        <ellipse cx={-10} cy={6} rx={4.5} ry={7} fill={look.hand} stroke={look.line} strokeWidth={2.4} />
      </g>
    </g>
  );
};
