import React from 'react';
import { Puff } from './fx-glow';
import { clamp, hash, lerp } from './fx-math';
import { mix } from './map-context';
import { TankKind, TankSide } from './ground-tanks';

// <SaigonBridgeSide>: SIDE VIEW of cầu Sài Gòn (the 1961 pre-stressed-concrete girder bridge over the Sài Gòn river on the Xa lộ, taken on the
// morning of 30.4.1975 by the 203rd Tank Brigade after a short fight at its east end), with a column of tanks crossing left -> right.
// Drawn as a long low girder deck on slim tapering piers, parapets with lamp posts, river with ripples and a far bank.
//   <SaigonBridgeSide id x? y? w? progress? n? t? smoke? tone? backdrop? flag? kind? />
//   y = deck (road surface) line, x = centre, w = bridge length shown (default 2100, it runs off both sides of the screen)
//   progress 0..1: the column of `n` tanks (default 3, spacing ~ 360 px) crosses from off-screen left to off-screen right
//   smoke 0..1: black smoke columns from the far (east) bank (a burning post: no detail)     tone 'day' | 'dusk'     flag: PRG flag on each antenna
//   t frames: river ripples, smoke drift, flag ripple.   Pure function of its props.

const INK = '#1B1B1E';
const SPAN = 300;                       // distance between piers (px, deck length of one girder)

export const SaigonBridgeSide: React.FC<{
  id: string; x?: number; y?: number; w?: number; progress?: number; n?: number; t?: number; smoke?: number; tone?: 'day' | 'dusk'; backdrop?: boolean; flag?: boolean; kind?: TankKind; size?: number;
}> = ({ id, x = 960, y = 600, w = 2100, progress = 0, n = 3, t = 0, smoke = 0, tone = 'day', backdrop = true, flag = true, kind = 't54', size = 250 }) => {
  const dusk = tone === 'dusk', T = (c: string) => (dusk ? mix(c, '#8A5A5A', 0.28) : c);
  const x0 = x - w / 2, piers = Array.from({ length: Math.ceil(w / SPAN) + 1 }, (_, i) => x0 + i * SPAN);
  const water = y + 190, gap = 360, run = 1920 + size * 2 + gap * (n - 1), u = clamp(progress);
  return (
    <g>
      {backdrop && (
        <g>
          <defs><linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={dusk ? '#6A78AE' : '#8EC3E8'} /><stop offset="1" stopColor={dusk ? '#F6BE80' : '#E2F1F8'} /></linearGradient>
            <linearGradient id={`${id}-water`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={T('#5F9CC4')} /><stop offset="1" stopColor={T('#2F5F86')} /></linearGradient></defs>
          <rect width={1920} height={water} fill={`url(#${id}-sky)`} />
          <path d={`M0,${water} L0,${y + 40} Q300,${y - 40} 620,${y + 10} T1300,${y - 20} T1920,${y + 10} L1920,${water}Z`} fill={T('#5E8A4A')} opacity={0.75} />
          {[120, 380, 760, 1200, 1620].map((tx, i) => <g key={i} opacity={0.8}><rect x={tx - 3} y={y - 20 - hash(i, 1) * 40} width={6} height={50} fill="#5B4630" /><circle cx={tx} cy={y - 40 - hash(i, 1) * 40} r={34 + hash(i, 2) * 14} fill={T('#4A7A3A')} /></g>)}
          <rect y={water} width={1920} height={1080 - water} fill={`url(#${id}-water)`} />
          {Array.from({ length: 16 }, (_, i) => { const rx = ((hash(i, 1) * 2400 + t * (0.6 + hash(i, 5))) % 2200) - 140, ry = water + 22 + hash(i, 2) * (1080 - water - 40); return <path key={i} d={`M${rx},${ry} q22,-7 44,0 t44,0`} fill="none" stroke="#E8F4FF" strokeWidth={3} opacity={0.35 + 0.3 * hash(i, 3)} />; })}
        </g>
      )}
      {/* piers (tapering, concrete) and their reflection */}
      {piers.map((px, i) => (
        <g key={i}>
          <polygon points={`${px - 26},${y + 44} ${px + 26},${y + 44} ${px + 16},${water + 70} ${px - 16},${water + 70}`} fill={T('#C9C4B2')} stroke={INK} strokeWidth={3} />
          <polygon points={`${px + 10},${y + 44} ${px + 26},${y + 44} ${px + 16},${water + 70} ${px + 4},${water + 70}`} fill={T('#A39E8C')} />
          <ellipse cx={px} cy={water + 70} rx={46} ry={9} fill="#F4FAFF" opacity={0.55} />
        </g>
      ))}
      {/* girders: a deep concrete beam (haunched at the piers) under a deck, kerbs and a parapet with lamp posts */}
      {piers.slice(0, -1).map((px, i) => (
        <path key={i} d={`M${px},${y + 14} L${px},${y + 62} Q${px + SPAN / 2},${y + 36} ${px + SPAN},${y + 62} L${px + SPAN},${y + 14}Z`} fill={T('#D6D1BF')} stroke={INK} strokeWidth={3} />
      ))}
      <rect x={x0} y={y} width={w} height={16} fill={T('#BDB8A6')} stroke={INK} strokeWidth={3} />
      <rect x={x0} y={y - 6} width={w} height={8} fill={T('#8D897B')} />
      <rect x={x0} y={y - 58} width={w} height={8} fill={T('#E9E4D3')} stroke={INK} strokeWidth={2.4} />
      {Array.from({ length: Math.ceil(w / 52) + 1 }, (_, i) => <rect key={i} x={x0 + i * 52 - 4} y={y - 52} width={8} height={46} fill={T('#E9E4D3')} stroke={INK} strokeWidth={1.8} />)}
      {piers.filter((_, i) => i % 2 === 0).map((px, i) => (
        <g key={i}><line x1={px} y1={y - 56} x2={px} y2={y - 170} stroke={INK} strokeWidth={6} /><path d={`M${px},${y - 170} q40,-10 56,22`} fill="none" stroke={INK} strokeWidth={5} /><ellipse cx={px + 56} cy={y - 144} rx={16} ry={7} fill={dusk ? '#FFE3A0' : '#F6F3E2'} stroke={INK} strokeWidth={2.4} /></g>
      ))}
      {/* tanks: each rides the deck, first one leads */}
      {Array.from({ length: n }, (_, i) => {
        const tx = lerp(-size * 1.2, 1920 + size * 1.2, clamp((u * run - i * gap) / (1920 + size * 2.4))) , on = u * run - i * gap > 0 && tx < 1920 + size * 1.2;
        return on ? <g key={i}>
          {[0, 1].map((j) => <Puff key={j} x={tx - size * 0.55 - j * 40} y={y - 10 - j * 6} r={16 + j * 9} color="#CFC3A2" o={0.3 - j * 0.1} seed={i + j} />)}
          <TankSide x={tx} y={y - 18 * (size / 200)} size={size} kind={kind} num={i === 0 ? '843' : undefined} flag={flag ? 'PRG' : undefined} t={t + i * 11} id={`${id}-t${i}`} />
        </g> : null;
      })}
      {smoke > 0.02 && [0, 1, 2, 3, 4, 5].map((i) => <Puff key={`sm${i}`} x={1640 + Math.sin(t * 0.04 + i) * 18 + i * 10} y={y - 90 - i * 70 * smoke} r={(34 + i * 14) * (0.4 + smoke)} color="#2E2E32" o={0.78 * smoke * (1 - i * 0.1)} seed={i} />)}
    </g>
  );
};
