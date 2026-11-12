import React from 'react';
import { rnd, clamp, backOut, Glow, UI, FONT } from '../../engine';
import { mix } from './kit-palette';

// Chapter E props for the Mars beat (all pure functions of t; draw under a camera group, they fill 0..1920 x 1080).
//   <Space t />                      deep-space backdrop with twinkling stars (a sun glow at the top right).
//   <MarsLand id t river lake sea air dust />  side view of Mars, horizon y 520. river/lake/sea/air 0..1: 1 = the ancient
//        wet, blue-skied Mars; 0 = the dead red desert (dry riverbed + cracked lake bed remain). dust 0..1 = blowing grit.
//   <Rover x y s t />                small original wheeled probe, half buried when `buried`.
//   <Pill x y text at? t size? />    mono label on a dark pill, centred at (x, y), pops at frame `at`.
//   <MiniBar x y label p />          a labelled level bar (p 0..1), 480 x 70, top-left at (x, y).

export const Space: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-100} y={-100} width={2120} height={1280} fill="#080718" />
    <Glow x={1700} y={80} r={900} o={0.28} />
    {Array.from({ length: 110 }).map((_, i) => (
      <circle key={i} cx={rnd(1, i) * 1920} cy={rnd(2, i) * 1080} r={1 + rnd(3, i) * 2.2} fill="#FFFFFF" opacity={0.25 + 0.55 * Math.abs(Math.sin(t / (14 + rnd(4, i) * 20) + i))} />
    ))}
  </g>
);

const H = 520;
/** River centreline at depth p (0 horizon .. 1 bottom): x and the bed width. */
const riv = (p: number) => ({ y: H + 600 * p, x: 900 - 520 * p + Math.sin(p * 4.2) * 130 * p, w: 8 + 200 * Math.pow(p, 1.1) });

export const MarsLand: React.FC<{ id: string; t: number; river?: number; lake?: number; sea?: number; air?: number; dust?: number }> = ({ id, t, river = 1, lake = 1, sea = 0, air = 1, dust = 0 }) => {
  const steps = Array.from({ length: 30 }).map((_, i) => riv(i / 29));
  const bed = 'M ' + steps.map((s) => `${(s.x - s.w / 2).toFixed(0)} ${s.y.toFixed(0)}`).join(' L ') + ' L ' + [...steps].reverse().map((s) => `${(s.x + s.w / 2).toFixed(0)} ${s.y.toFixed(0)}`).join(' L ') + ' Z';
  const wat = 'M ' + steps.map((s) => `${(s.x - (s.w * river) / 2.2).toFixed(0)} ${s.y.toFixed(0)}`).join(' L ') + ' L ' + [...steps].reverse().map((s) => `${(s.x + (s.w * river) / 2.2).toFixed(0)} ${s.y.toFixed(0)}`).join(' L ') + ' Z';
  const ridge = (y0: number, amp: number, seed: number, step: number) => {
    let d = `M -60 ${H + 4} L -60 ${y0}`;
    for (let x = -60; x <= 1980; x += step) d += ` L ${x} ${y0 - Math.abs(Math.sin(x * 0.007 + seed)) * amp - rnd(seed, x / step) * amp * 0.5}`;
    return d + ` L 1980 ${H + 4} Z`;
  };
  const LCX = 1420;
  const LCY = 700;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mix('#5A2A20', '#3F8FCB', air)} /><stop offset="1" stopColor={mix('#E3A272', '#D6ECEE', air)} /></linearGradient>
        <linearGradient id={`${id}gnd`} gradientUnits="userSpaceOnUse" x1="0" y1={H} x2="0" y2="1080"><stop offset="0" stopColor="#D2774A" /><stop offset="0.5" stopColor="#B45733" /><stop offset="1" stopColor="#7D3820" /></linearGradient>
      </defs>
      <rect x={-100} y={-100} width={2120} height={H + 100} fill={`url(#${id}sky)`} />
      <Glow x={1500} y={170} r={420} o={0.25 + 0.3 * air} />
      <circle cx={1500} cy={170} r={34 + 16 * air} fill={mix('#F6DDBC', '#FFFBE0', air)} />
      {air > 0.35 ? [0, 1, 2, 3].map((i) => {
        const x = ((i * 560 + t * 0.35) % 2400) - 240;
        return <g key={i} opacity={clamp((air - 0.35) / 0.4) * 0.92}><ellipse cx={x} cy={170 + (i % 2) * 90} rx={120} ry={26} fill="#FFFFFF" /><ellipse cx={x + 50} cy={150 + (i % 2) * 90} rx={72} ry={26} fill="#FFFFFF" /></g>;
      }) : null}
      <path d={ridge(H - 50, 90, 3, 70)} fill={mix('#A9583A', '#8FA4AE', air * 0.5)} />
      <path d={ridge(H - 18, 46, 7, 50)} fill="#9A4B30" />
      {sea > 0.01 ? (
        <g opacity={sea}>
          <rect x={-100} y={H - 16} width={2120} height={22} fill="#3E9BD0" />
          {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={rnd(9, i) * 1900} y={H - 12 + rnd(10, i) * 12} width={50} height={3} fill="#FFFFFF" opacity={0.6 * Math.max(0, Math.sin(t / 6 + i * 2))} />)}
        </g>
      ) : null}
      <rect x={-100} y={H} width={2120} height={600} fill={`url(#${id}gnd)`} />
      <rect x={-100} y={H - 70} width={2120} height={80} fill="#FFF3DC" opacity={0.18 * air} />
      {/* dry riverbed (always there) and the water in it */}
      <path d={bed} fill="#7A3419" opacity={0.85} />
      {river < 0.6 ? Array.from({ length: 12 }).map((_, i) => { const s = riv(0.2 + i * 0.07); return <path key={i} d={`M ${s.x - s.w * 0.4} ${s.y} l ${s.w * 0.8} ${6 + i}`} stroke="#4A1E0E" strokeWidth={2 + i * 0.3} opacity={0.6 * (1 - river)} />; }) : null}
      {river > 0.01 ? (
        <g>
          <path d={wat} fill="#3E9BD0" />
          {Array.from({ length: 14 }).map((_, i) => {
            const p = ((t * 0.012 + i / 14) % 1);
            const s = riv(p);
            return <path key={i} d={`M ${s.x - s.w * river * 0.25} ${s.y} q ${s.w * river * 0.15} -4 ${s.w * river * 0.4} 0`} stroke="#FFFFFF" strokeWidth={2 + p * 4} fill="none" opacity={0.75 * Math.sin(p * Math.PI)} />;
          })}
        </g>
      ) : null}
      {/* lake bed and lake */}
      <ellipse cx={LCX} cy={LCY} rx={350} ry={66} fill="#7A3419" opacity={0.85} />
      <ellipse cx={LCX} cy={LCY} rx={350} ry={66} fill="none" stroke="#E0A070" strokeWidth={5} opacity={0.5 * (1 - lake)} />
      {lake < 0.6 ? Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M ${LCX - 280 + i * 70} ${LCY - 30} l 18 40 l -10 20`} stroke="#4A1E0E" strokeWidth={3} fill="none" opacity={0.6 * (1 - lake)} />) : null}
      {lake > 0.01 ? (
        <g>
          <ellipse cx={LCX} cy={LCY} rx={340 * lake} ry={60 * lake} fill="#3E9BD0" />
          <ellipse cx={LCX - 40} cy={LCY - 12 * lake} rx={200 * lake} ry={18 * lake} fill="#8FD0F0" opacity={0.5} />
          {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={LCX - 250 * lake + rnd(5, i) * 480 * lake} y={LCY - 30 * lake + rnd(6, i) * 56 * lake} width={40} height={3} fill="#FFFFFF" opacity={0.7 * Math.max(0, Math.sin(t / 5 + i * 2.4))} />)}
        </g>
      ) : null}
      {Array.from({ length: 26 }).map((_, i) => {
        const p = 0.1 + rnd(11, i) * 0.9;
        const y = H + 600 * p;
        const sz = 5 + 50 * p * (0.4 + rnd(12, i));
        return <ellipse key={i} cx={rnd(13, i) * 1920} cy={y} rx={sz * 1.5} ry={sz * 0.7} fill={i % 3 ? '#8B4026' : '#A25030'} stroke="#4A1E0E" strokeWidth={2} />;
      })}
      {dust > 0 ? Array.from({ length: 16 }).map((_, i) => {
        const x = ((t * (14 + rnd(21, i) * 14) + rnd(22, i) * 2400) % 2500) - 300;
        return <path key={i} d={`M ${x} ${H + 30 + rnd(23, i) * 520} l ${-90 - rnd(24, i) * 120} ${rnd(25, i) * 8}`} stroke="#F0C79A" strokeWidth={3 + rnd(26, i) * 5} strokeLinecap="round" opacity={0.5 * dust} />;
      }) : null}
      {dust > 0 ? <rect x={-100} y={H - 30} width={2120} height={640} fill="#E8A76E" opacity={0.18 * dust} /> : null}
    </g>
  );
};

/** A little original wheeled probe: box body, solar flap, mast with a camera eye. */
export const Rover: React.FC<{ x: number; y: number; s?: number; t: number; buried?: boolean }> = ({ x, y, s = 1, t, buried = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${buried ? -9 : 0})`}>
    <ellipse cx={0} cy={6} rx={150} ry={16} fill="#000" opacity={0.3} />
    <path d="M -40 -110 L -40 -170 M -40 -170 L 10 -178" stroke="#C9C2B4" strokeWidth={9} strokeLinecap="round" fill="none" />
    <rect x={-8} y={-196} width={44} height={30} rx={8} fill="#E9E3D6" stroke="#1A1622" strokeWidth={4} />
    <circle cx={22} cy={-181} r={8} fill={buried ? '#3A3446' : '#2EC8E6'} opacity={buried ? 1 : 0.5 + 0.5 * Math.sin(t / 5)} />
    <rect x={-110} y={-110} width={220} height={80} rx={14} fill="#D8D2C4" stroke="#1A1622" strokeWidth={5} />
    <path d="M -90 -108 L 100 -108 L 100 -96 L -90 -96 Z" fill="#B5543A" />
    <path d="M -110 -112 L -170 -150 L -110 -150 Z" fill="#5C7CA6" stroke="#1A1622" strokeWidth={4} />
    {[-80, 0, 80].map((wx) => <g key={wx}><circle cx={wx} cy={-8} r={30} fill="#2A2630" stroke="#1A1622" strokeWidth={4} /><circle cx={wx} cy={-8} r={11} fill="#8C8698" /></g>)}
    {buried ? <path d="M -190 8 Q -90 -60 20 -20 Q 120 -50 200 8 Z" fill="#A9552F" stroke="#5A2412" strokeWidth={4} /> : null}
  </g>
);

export const Pill: React.FC<{ x: number; y: number; text: string; t: number; at?: number; size?: number; col?: string }> = ({ x, y, text, t, at = 0, size = 44, col = UI.text }) => {
  const k = backOut(clamp((t - at) / 8));
  if (t < at) return null;
  const w = text.length * size * 0.63 + 64;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.9} rx={size * 0.95} fill={UI.pill} opacity={0.82} />
      <text y={size * 0.36} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={size} fill={col} letterSpacing={2}>{text}</text>
    </g>
  );
};

export const MiniBar: React.FC<{ x: number; y: number; label: string; p: number; col?: string }> = ({ x, y, label, p, col = '#3E9BD0' }) => {
  const q = clamp(p);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={480} height={78} rx={39} fill={UI.pill} opacity={0.82} />
      <text x={34} y={34} fontFamily={FONT.ui} fontWeight={700} fontSize={26} fill={UI.text} letterSpacing={3}>{label}</text>
      <rect x={34} y={46} width={412} height={18} rx={9} fill="#FFFFFF" opacity={0.16} />
      <rect x={34} y={46} width={Math.max(0, 412 * q)} height={18} rx={9} fill={q > 0.3 ? col : UI.bad} />
    </g>
  );
};
