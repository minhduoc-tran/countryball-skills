import React from 'react';
import { clamp, lerp, easeOut, easeIn, SCH, DrawOn, FONT } from '../../engine';

// CHAPTER C props, part 3: the calm science set (Schematic): clean cream line icons with orange accents.
//   <FistIcon x y s t? col? />            line fist (draws on over `t` frames when t is given)
//   <BoxerFigure x y s t />               generic boxer stick figure with gloves, punching right on a 36-frame cycle
//   <PunchPhase t /> -> {p, e, hit}       the cycle: e = arm extension 0..1, hit = frames since contact (-1 before)
//   <DialGauge x y r v label? />          half-circle gauge, v 0..1
//   <WeightBlock x y s label? />          cast weight with a ring handle
const LINE = SCH.line;

export const FIST_BODY = 'M -110 90 L -120 -30 Q -122 -90 -80 -92 Q -52 -92 -50 -60 Q -48 -100 -18 -100 Q 12 -100 14 -62 Q 18 -100 46 -98 Q 76 -96 76 -60 Q 80 -90 104 -86 Q 126 -80 124 -40 L 116 90 Q 0 120 -110 90 Z';
export const FistIcon: React.FC<{ x: number; y: number; s?: number; t?: number; col?: string; w?: number; fill?: string }> = ({ x, y, s = 1, t, col = LINE, w = 7, fill = 'none' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {t === undefined ? (
      <g fill={fill} stroke={col} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
        <path d={FIST_BODY} />
        <path d="M -84 24 Q -20 46 56 14" fill="none" />
        <path d="M -118 70 H 120" fill="none" opacity={0.6} />
      </g>
    ) : (
      <g>
        <DrawOn d={FIST_BODY} t={t} dur={16} color={col} width={w} fill={fill} />
        <DrawOn d="M -84 24 Q -20 46 56 14" t={t - 8} dur={8} color={col} width={w} />
        <DrawOn d="M -118 70 H 120" t={t - 10} dur={6} color={col} width={w * 0.7} />
      </g>
    )}
  </g>
);

const CYCLE = 36;
/** The punch cycle of the boxer: wind (0-8), strike (8-11), contact at 11, recover (11-26), rest. */
export const punchPhase = (t: number) => {
  const p = ((t % CYCLE) + CYCLE) % CYCLE;
  const e = p < 8 ? -0.18 * easeOut(p / 8) : p < 11 ? lerp(-0.18, 1, easeIn((p - 8) / 3)) : p < 26 ? lerp(1, 0, easeOut((p - 11) / 15)) : 0;
  return { p, e, hit: p >= 11 ? p - 11 : -1 };
};

/** A boxer facing right, feet at (x, y), ~330 tall at s = 1; gloves orange, line-drawn. */
export const BoxerFigure: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const { e } = punchPhase(t);
  const sh = { x: 20, y: -222 };
  const hand = { x: lerp(40, 190, e), y: -218 + (1 - e) * 14 };
  const el = { x: lerp(78, 112, e), y: lerp(-150, -222, e) };
  const back = { x: 66, y: -196 }; // rear glove guarding the chin
  const lean = e * 10;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={LINE} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={`M -10 -110 L -62 0 M -10 -110 L ${50 + lean} 0`} />
      <path d={`M -14 -112 L ${sh.x - lean * 0.3} ${sh.y}`} />
      <path d="M -26 -128 H 6 V -96 H -26 Z" fill="#101A2A" stroke={SCH.dim} />
      <circle cx={sh.x + 14 + lean * 0.4} cy={-262} r={34} fill="#101A2A" />
      <path d={`M ${sh.x - 14 + lean * 0.4} -272 Q ${sh.x + 14 + lean * 0.4} -306 ${sh.x + 44 + lean * 0.4} -272`} stroke={SCH.dim} />
      <path d={`M ${sh.x} ${sh.y} L 48 -170 L ${back.x} ${back.y}`} />
      <path d={`M ${sh.x} ${sh.y} L ${el.x} ${el.y} L ${hand.x} ${hand.y}`} />
      <circle cx={back.x + 4} cy={back.y - 6} r={26} fill={SCH.live} stroke={LINE} />
      <circle cx={hand.x + 14} cy={hand.y} r={32} fill={SCH.live} stroke={LINE} />
    </g>
  );
};

/** Half-circle gauge: v 0..1 swings the needle across. */
export const DialGauge: React.FC<{ x: number; y: number; r: number; v: number }> = ({ x, y, r, v }) => {
  const a = Math.PI * (1 + clamp(v));
  return (
    <g transform={`translate(${x} ${y})`} fill="none" strokeLinecap="round">
      <path d={`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0`} stroke={LINE} strokeWidth={8} />
      <path d={`M ${-r * 0.72} 0 A ${r * 0.72} ${r * 0.72} 0 0 1 ${r * 0.72} 0`} stroke={SCH.dim} strokeWidth={3} />
      {Array.from({ length: 9 }).map((_, i) => {
        const q = Math.PI * (1 + i / 8);
        return <path key={i} d={`M ${Math.cos(q) * r * 0.8} ${Math.sin(q) * r * 0.8} L ${Math.cos(q) * r * 0.94} ${Math.sin(q) * r * 0.94}`} stroke={i > 5 ? SCH.live : LINE} strokeWidth={5} />;
      })}
      <path d={`M 0 0 L ${Math.cos(a) * r * 0.86} ${Math.sin(a) * r * 0.86}`} stroke={SCH.live} strokeWidth={9} style={{ filter: `drop-shadow(0 0 8px ${SCH.glow})` }} />
      <circle r={14} fill={SCH.live} stroke="none" />
      <path d={`M ${-r - 20} 26 H ${r + 20}`} stroke={SCH.dim} strokeWidth={4} />
    </g>
  );
};

/** A cast weight, base centre (x, y): trapezoid body, ring handle, optional label inside. */
export const WeightBlock: React.FC<{ x: number; y: number; s?: number; label?: string }> = ({ x, y, s = 1, label }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={LINE} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round">
    <path d="M -150 0 L -112 -190 L 112 -190 L 150 0 Z" fill="#1A2C47" />
    <path d="M -60 -190 Q -60 -270 0 -270 Q 60 -270 60 -190" fill="none" />
    <path d="M -150 0 H 150" strokeWidth={12} />
    {label ? <text y={-70} textAnchor="middle" fontFamily={FONT.ui} fontSize={62} fill={SCH.live} stroke="none">{label}</text> : null}
  </g>
);

/** Thousands with a dot, the Vietnamese way: 3400 -> "3.400". */
export const vnNum = (v: number) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
