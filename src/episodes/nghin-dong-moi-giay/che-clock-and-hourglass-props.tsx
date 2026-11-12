import React from 'react';
import { SCH, FONT, clamp, rnd } from '../../engine';

// Chapter E, the time section's schematic props: a 24-hour dial, an hourglass whose sand only falls, a pile of
// banknotes, and the Vietnamese number format ("86.400", "2,3"). Line icons in the schematic's colours.

/** 86400 -> "86.400" (dots between thousands, as Vietnamese writes it). */
export const vnInt = (v: number) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
/** 2.3 -> "2,3" (comma as the decimal mark). */
export const vnDec = (v: number, d = 1) => v.toFixed(d).replace('.', ',');

/** A 24-hour dial centred on (x, y): ticks every hour, 0/6/12/18 numerals, one hand at `p` (0..1 of a day). */
export const Dial24: React.FC<{ x: number; y: number; r: number; p: number; numerals?: boolean; color?: string; hand?: string }> = ({
  x, y, r, p, numerals = true, color = SCH.line, hand = SCH.live,
}) => {
  const a = p * 360;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#0B1424" fillOpacity={0.7} stroke={color} strokeWidth={Math.max(3, r * 0.025)} />
      {Array.from({ length: 24 }).map((_, i) => {
        const big = i % 6 === 0;
        return (
          <path
            key={i}
            d={`M 0 ${-r * (big ? 0.82 : 0.9)} L 0 ${-r * 0.97}`}
            transform={`rotate(${i * 15})`}
            stroke={big ? color : SCH.dim}
            strokeWidth={Math.max(2, r * (big ? 0.03 : 0.018))}
            strokeLinecap="round"
          />
        );
      })}
      {numerals
        ? [0, 6, 12, 18].map((h) => {
            const ang = ((h * 15 - 90) * Math.PI) / 180;
            return (
              <text key={h} x={Math.cos(ang) * r * 0.66} y={Math.sin(ang) * r * 0.66 + r * 0.06} textAnchor="middle" fontFamily={FONT.ui} fontSize={r * 0.17} fill={SCH.dim}>
                {h}
              </text>
            );
          })
        : null}
      {/* the part of the day already gone, a pale wedge under the hand */}
      {p > 0.002 ? (
        <path
          d={`M 0 0 L 0 ${-r * 0.97} A ${r * 0.97} ${r * 0.97} 0 ${a > 180 ? 1 : 0} 1 ${Math.sin((a * Math.PI) / 180) * r * 0.97} ${-Math.cos((a * Math.PI) / 180) * r * 0.97} Z`}
          fill={hand}
          opacity={0.14}
        />
      ) : null}
      <path d={`M 0 ${r * 0.1} L 0 ${-r * 0.88}`} transform={`rotate(${a})`} stroke={hand} strokeWidth={Math.max(3, r * 0.04)} strokeLinecap="round" />
      <circle r={Math.max(4, r * 0.06)} fill={hand} />
    </g>
  );
};

const GLASS = 'M -100 -200 L 100 -200 Q 100 -90 12 -10 L 12 10 Q 100 90 100 200 L -100 200 Q -100 90 -12 10 L -12 -10 Q -100 -90 -100 -200 Z';

/**
 * An hourglass centred on (x, y), about 440 tall at s = 1. `top` (0..1) is how full the upper bulb is, the lower bulb
 * holds the rest: the sand only ever falls. `flow` shows the falling thread.
 */
export const Hourglass: React.FC<{ x: number; y: number; s?: number; top: number; flow?: boolean; t: number; id: string }> = ({ x, y, s = 1, top, flow = true, t, id }) => {
  const yTop = -200 + 190 * (1 - top); // surface of the upper sand
  const yBot = 200 - 190 * (1 - top); // peak of the lower pile
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <clipPath id={`${id}clip`}>
          <path d={GLASS} />
        </clipPath>
      </defs>
      <ellipse cx={0} cy={236} rx={170} ry={14} fill="#000" opacity={0.35} />
      <path d={GLASS} fill="#BFD8F0" fillOpacity={0.08} />
      <g clipPath={`url(#${id}clip)`}>
        <rect x={-110} y={yTop} width={220} height={Math.max(0, -10 - yTop)} fill="#E9B766" />
        <path d={`M -110 210 L -110 ${yBot + 46} Q -40 ${yBot + 30} 0 ${yBot} Q 40 ${yBot + 30} 110 ${yBot + 46} L 110 210 Z`} fill="#D9A04E" />
        {flow ? (
          <g>
            <path d={`M 0 -12 L 0 ${yBot + 4}`} stroke="#F2C77E" strokeWidth={5} strokeDasharray="6 8" strokeDashoffset={-t * 3} />
            {[0, 1, 2].map((i) => {
              const k = ((t * 0.07 + i / 3) % 1);
              return <circle key={i} cx={(rnd(i + 3, 1) - 0.5) * 6} cy={-10 + k * (yBot - -10)} r={3.4} fill="#F7D79A" />;
            })}
          </g>
        ) : null}
      </g>
      <path d={GLASS} fill="none" stroke={SCH.line} strokeWidth={6} strokeLinejoin="round" />
      <path d="M -78 -170 Q -84 -110 -40 -60" stroke="#FFFFFF" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.35} />
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <rect x={-130} y={sd < 0 ? -226 : 200} width={260} height={26} rx={8} fill="#6B4B42" stroke={SCH.line} strokeWidth={4} />
          <rect x={-130} y={sd < 0 ? -226 : 200} width={260} height={6} rx={3} fill="#FFB46A" opacity={0.55} />
        </g>
      ))}
    </g>
  );
};

/** A pile of banknotes (green, a coin-mark in the middle) whose height follows `n` (0..24), centred on its base (x, y). */
export const NotePile: React.FC<{ x: number; y: number; n: number; s?: number }> = ({ x, y, n, s = 1 }) => {
  const count = Math.floor(clamp(n, 0, 24));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={150} ry={14} fill="#000" opacity={0.35} />
      {Array.from({ length: count }).map((_, i) => {
        const jx = (rnd(7, i) - 0.5) * 30;
        const rot = (rnd(9, i) - 0.5) * 8;
        return (
          <g key={i} transform={`translate(${jx} ${-i * 16 - 18}) rotate(${rot})`}>
            <rect x={-110} y={-22} width={220} height={44} rx={5} fill="#5FAE72" stroke="#2F6E49" strokeWidth={3} />
            <rect x={-110} y={-22} width={220} height={7} rx={3} fill="#9ADCA8" opacity={0.6} />
            <circle r={13} fill="none" stroke="#2F6E49" strokeWidth={3} />
            <text x={-86} y={8} fontFamily={FONT.ui} fontSize={20} fill="#2F6E49">1.000</text>
          </g>
        );
      })}
    </g>
  );
};
