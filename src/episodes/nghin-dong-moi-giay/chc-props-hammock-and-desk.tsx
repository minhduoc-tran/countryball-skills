import React from 'react';
import { FONT, clamp } from '../../engine';

// Chapter C props: the rooftop hammock (back cloth and front lip around Pip), a briefcase seen from above, a five-day
// calendar strip that ticks off its days, and floating "z" letters for sleep. All pure functions of the shot clock.

const X0 = 610;
const X1 = 1340;
const TOP = 545;
const SAG = 215;
/** Hammock curve y at x (a parabola, hung from (X0, TOP) to (X1, TOP)). */
const cy = (x: number) => { const u = (x - X0) / (X1 - X0); return TOP + SAG * 4 * u * (1 - u); };
const curve = (off: number, a = 0, b = 1) => {
  const pts: string[] = [];
  for (let i = 0; i <= 24; i++) { const u = a + (b - a) * (i / 24); const x = X0 + (X1 - X0) * u; pts.push(`${x.toFixed(1)} ${(cy(x) + off).toFixed(1)}`); }
  return pts;
};

/** The hammock behind Pip: two wooden posts, ropes, the striped cloth. */
export const Hammock: React.FC<{ t: number }> = () => (
  <g>
    {[X0 - 34, X1 + 34].map((px, i) => (
      <g key={i}>
        <ellipse cx={px} cy={832} rx={64} ry={12} fill="#000" opacity={0.4} />
        <rect x={px - 17} y={470} width={34} height={366} rx={10} fill="#6B4A36" />
        <rect x={px - 17} y={470} width={12} height={366} rx={6} fill="#4A3224" opacity={0.7} />
        <rect x={px + 12} y={474} width={4} height={356} fill="#FFC27A" opacity={0.6} />
      </g>
    ))}
    <path d={`M ${X0 - 34} 500 L ${X0} ${TOP}`} stroke="#E8D7A8" strokeWidth={6} />
    <path d={`M ${X1 + 34} 500 L ${X1} ${TOP}`} stroke="#E8D7A8" strokeWidth={6} />
    <path d={`M ${curve(0).join(' L ')} L ${curve(44).reverse().join(' L ')} Z`} fill="#D9613F" />
    <path d={`M ${curve(0).join(' L ')} L ${curve(14).reverse().join(' L ')} Z`} fill="#F08A5E" />
    {[0.14, 0.3, 0.46, 0.62, 0.78].map((u, i) => <path key={i} d={`M ${curve(0, u, u + 0.03).join(' L ')} L ${curve(44, u, u + 0.03).reverse().join(' L ')} Z`} fill="#F6D9A0" opacity={0.55} />)}
  </g>
);

/** The cloth's front lip, drawn over Pip so he sits in the hammock rather than on it. */
export const HammockFront: React.FC<{ t: number }> = () => (
  <g>
    <path d={`M ${curve(24, 0.12, 0.88).join(' L ')}`} stroke="#C24E30" strokeWidth={46} fill="none" strokeLinecap="round" />
    <path d={`M ${curve(10, 0.12, 0.88).join(' L ')}`} stroke="#FFB88A" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.6} />
  </g>
);

/** A briefcase from above: x y the centre, about 330 wide at s 1. */
export const Briefcase: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={10} cy={14} rx={190} ry={120} fill="#000" opacity={0.35} />
    <rect x={-165} y={-105} width={330} height={210} rx={20} fill="#5A3A2A" />
    <rect x={-165} y={-105} width={80} height={210} rx={20} fill="#3E271C" opacity={0.6} />
    <rect x={-160} y={-100} width={320} height={200} rx={16} fill="none" stroke="#8A6248" strokeWidth={5} />
    <path d="M -50 -105 Q -50 -150 0 -150 Q 50 -150 50 -105" stroke="#2A1810" strokeWidth={18} fill="none" strokeLinecap="round" />
    <rect x={-118} y={-30} width={46} height={40} rx={6} fill="#E9C46A" />
    <rect x={72} y={-30} width={46} height={40} rx={6} fill="#E9C46A" />
    <path d="M -160 -10 L 160 -10" stroke="#2A1810" strokeWidth={4} />
  </g>
);

/** A strip of day boxes ticking on one after another (`days` of them), x y the centre of the strip, about 760 wide at s 1. */
export const DayCalendar: React.FC<{ x: number; y: number; t: number; days: number; s?: number; title?: string }> = ({ x, y, t, days, s = 1, title }) => {
  const w = 130;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-(days * w) / 2 - 24} y={-110} width={days * w + 48} height={220} rx={26} fill="#F6EFE3" />
      <rect x={-(days * w) / 2 - 24} y={-110} width={days * w + 48} height={64} rx={26} fill="#D6333E" />
      <rect x={-(days * w) / 2 - 24} y={-76} width={days * w + 48} height={30} fill="#D6333E" />
      {title ? <text y={-52} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={44} fill="#FFF3E6" letterSpacing={2}>{title}</text> : null}
      {Array.from({ length: days }).map((_, i) => {
        const on = clamp((t - 8 - i * 5) / 5);
        const cx = -(days * w) / 2 + w / 2 + i * w;
        return (
          <g key={i} transform={`translate(${cx} 36)`}>
            <rect x={-52} y={-44} width={104} height={92} rx={12} fill="#E4DCCB" />
            <text y={14} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={44} fill="#3A3446">{i + 1}</text>
            <path d="M -40 -34 L 40 38 M 40 -34 L -40 38" stroke="#D6333E" strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - on} />
          </g>
        );
      })}
    </g>
  );
};

/** Three "z"s drifting up and fading, over a sleeper's head. */
export const ZzzFloat: React.FC<{ x: number; y: number; t: number; o?: number }> = ({ x, y, t, o = 1 }) => (
  <g opacity={o} fontFamily={FONT.hand} fill="#CFE6FF">
    {[0, 1, 2].map((i) => {
      const p = ((t * 0.02 + i / 3) % 1);
      return <text key={i} x={x + 40 + p * 70 + i * 6} y={y - p * 130} fontSize={44 + i * 14} opacity={Math.sin(Math.PI * p)}>z</text>;
    })}
  </g>
);
