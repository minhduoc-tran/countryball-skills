import React from 'react';
import { angkorPath } from './angkor-silhouette';
import { hash } from './fx-math';
import { mix } from './map-context';

// Cambodian landmarks as flat silhouettes (screen px; x = centre, y = ground line; `w` = width; tone 'day' | 'dusk' | 'night' sets the colours;
// pure functions of their props, `t` FRAMES only for the water shimmer). Composed for the 1080x1920 frame (w ~ 900 fills it).
//   <AngkorWat x y w? tone? reflect? />            5 lotus towers, galleries, causeway; `reflect` mirrors it in the moat (pool) below y
//   <IndependenceMonument x y h? tone? />          Vimean Ekareach (Phnôm Pênh, 1958): stepped lotus tower with naga-head corners
//   <RoyalPalaceRoof x y w? tone? />               Throne Hall roof line: stacked steep roofs, chofa horns, central spire
//   <WatPhnom x y w? tone? />                      the hill with trees and the white stupa on top
//   <PhnomPenhSkyline x y w? tone? t? />           river front: Royal Palace + Independence Monument + Wat Phnom + low houses + palms
//   <FriendshipMonument x y h? tone? />            the Campuchia - Việt Nam Friendship Monument (Phnôm Pênh), generic: a VN soldier (pith helmet,
//                                                   holding a flag) and a Cambodian soldier either side of a mother with her baby, on a stepped plinth,
//                                                   tiered pylon behind (no weapons; stylised, not a survey of the real statue)
//   <SugarPalm x y h? tone? lean? />               thốt nốt palm (also used by the countryside props)

export type Tone = 'day' | 'dusk' | 'night';
const TONES: Record<Tone, { stone: string; dark: string; gold: string; white: string; leaf: string; water: string }> = {
  day: { stone: '#A89A80', dark: '#6E6352', gold: '#D9A83A', white: '#ECE6D6', leaf: '#4E7A3A', water: '#5E8FB0' },
  dusk: { stone: '#4A3A44', dark: '#2E2430', gold: '#8E5A3A', white: '#7E6A70', leaf: '#2F2A30', water: '#C27A5A' },
  night: { stone: '#1F2433', dark: '#141824', gold: '#3A3A50', white: '#2E3446', leaf: '#141824', water: '#25324A' },
};
const INK = '#16141A';

export const AngkorWat: React.FC<{ x: number; y: number; w?: number; tone?: Tone; reflect?: boolean; t?: number }> = ({ x, y, w = 900, tone = 'dusk', reflect = true, t = 0 }) => {
  const c = TONES[tone], k = w / 900, d = angkorPath(w * 0.72);
  const body = (
    <g>
      <path d={d} transform={`translate(0,${-12 * k})`} fill={c.stone} stroke={INK} strokeWidth={2.5 * k} strokeLinejoin="round" />
      {/* outer enclosure wall and gate towers left/right */}
      <rect x={-w / 2} y={-34 * k} width={w} height={22 * k} fill={c.dark} />
      {[-1, 1].map((s) => <path key={s} d={angkorPath(w * 0.14, 3)} transform={`translate(${s * w * 0.43},${-30 * k})`} fill={c.dark} />)}
      {/* doorways in the gallery */}
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={(-0.24 + i * 0.06) * w - 5 * k} y={-74 * k} width={10 * k} height={18 * k} rx={5 * k} fill={c.dark} opacity={0.8} />)}
      {/* causeway */}
      <path d={`M${-40 * k},${-12 * k} L${40 * k},${-12 * k} L${70 * k},${4 * k} L${-70 * k},${4 * k} Z`} fill={c.white} opacity={0.6} />
    </g>
  );
  return (
    <g transform={`translate(${x},${y})`}>
      {body}
      {[-0.46, -0.36, 0.38, 0.47].map((p, i) => <SugarPalm key={i} x={p * w} y={-6 * k} h={(170 + 40 * hash(i, 3)) * k} tone={tone} lean={(hash(i, 5) - 0.5) * 10} />)}
      {reflect && (
        <g>
          <rect x={-w * 0.6} y={4 * k} width={w * 1.2} height={260 * k} fill={c.water} opacity={0.85} />
          <g transform={`translate(0,${8 * k}) scale(1,-0.8)`} opacity={0.38}>{body}</g>
          {Array.from({ length: 10 }, (_, i) => <line key={i} x1={(-0.4 + hash(i, 1) * 0.8) * w + Math.sin(t * 0.05 + i) * 12} y1={(30 + i * 22) * k} x2={(-0.4 + hash(i, 1) * 0.8) * w + 90 * k + Math.sin(t * 0.05 + i) * 12} y2={(30 + i * 22) * k} stroke="#FFFFFF" strokeWidth={2.5 * k} opacity={0.35} strokeLinecap="round" />)}
        </g>
      )}
    </g>
  );
};

export const SugarPalm: React.FC<{ x: number; y: number; h?: number; tone?: Tone; lean?: number }> = ({ x, y, h = 200, tone = 'day', lean = 0 }) => {
  const c = TONES[tone], fr = h * 0.24;
  return (
    <g transform={`translate(${x},${y}) rotate(${lean})`}>
      <path d={`M${-h * 0.025},0 L${-h * 0.018},${-h} L${h * 0.018},${-h} L${h * 0.025},0 Z`} fill={mix(c.dark, '#000000', 0.15)} />
      {/* round fan crown of the thốt nốt palm: a dense ball of fan leaves */}
      {Array.from({ length: 11 }, (_, i) => {
        const a = -180 + i * 18, r = fr * (0.85 + 0.2 * hash(i, 9));
        return <path key={i} d={`M0,${-h} L${Math.cos((a * Math.PI) / 180) * r},${-h + Math.sin((a * Math.PI) / 180) * r * 0.9} L${Math.cos(((a + 14) * Math.PI) / 180) * r},${-h + Math.sin(((a + 14) * Math.PI) / 180) * r * 0.9} Z`} fill={i % 2 ? c.leaf : mix(c.leaf, '#000000', 0.18)} />;
      })}
      <circle cx={0} cy={-h} r={fr * 0.55} fill={c.leaf} />
    </g>
  );
};

export const IndependenceMonument: React.FC<{ x: number; y: number; h?: number; tone?: Tone }> = ({ x, y, h = 520, tone = 'day' }) => {
  const c = TONES[tone], k = h / 520, tiers = 5;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} strokeLinejoin="round">
      <path d="M-170,0 H170 V-22 H-170 Z M-140,-22 H140 V-44 H-140 Z M-110,-44 H110 V-70 H-110 Z" fill={c.stone} stroke={INK} strokeWidth={3} />
      {Array.from({ length: tiers }, (_, i) => {
        const yb = -70 - i * 62, hw = 78 - i * 12, ht = 62;
        return (
          <g key={i}>
            <path d={`M${-hw},${yb} L${-hw + 8},${yb - ht} L${hw - 8},${yb - ht} L${hw},${yb} Z`} fill={i % 2 ? c.stone : mix(c.stone, '#FFFFFF', 0.12)} stroke={INK} strokeWidth={3} />
            {/* naga heads curling up at the corners of each tier */}
            {[-1, 1].map((s) => <path key={s} d={`M${s * (hw - 6)},${yb - ht + 6} q${s * 26},-6 ${s * 30},-34 q${s * -6},14 ${s * -16},18 Z`} fill={c.gold} stroke={INK} strokeWidth={2.5} />)}
            <rect x={-14} y={yb - ht + 16} width={28} height={34} rx={12} fill={c.dark} />
          </g>
        );
      })}
      <path d="M-26,-380 L0,-520 L26,-380 Z" fill={c.gold} stroke={INK} strokeWidth={3} />
    </g>
  );
};

export const RoyalPalaceRoof: React.FC<{ x: number; y: number; w?: number; tone?: Tone }> = ({ x, y, w = 520, tone = 'day' }) => {
  const c = TONES[tone], k = w / 520, roof = tone === 'day' ? '#C9562F' : c.dark, trim = tone === 'day' ? '#E9B93A' : c.gold;
  const tierRoof = (hw: number, yb: number, ht: number) => <path d={`M${-hw},${yb} L${-hw * 0.55},${yb - ht} L${hw * 0.55},${yb - ht} L${hw},${yb} Z`} fill={roof} stroke={trim} strokeWidth={4} />;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} strokeLinejoin="round">
      <rect x={-230} y={-90} width={460} height={90} fill={tone === 'day' ? '#F1E6C8' : c.stone} stroke={INK} strokeWidth={3} />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-210 + i * 50} y={-78} width={16} height={78} fill={c.gold} opacity={0.75} />)}
      {tierRoof(260, -90, 60)}{tierRoof(200, -150, 50)}{tierRoof(140, -200, 44)}
      {[[-260, -90], [260, -90], [-200, -150], [200, -150], [-140, -200], [140, -200]].map(([cx, cy], i) => <path key={i} d={`M${cx},${cy} q${cx > 0 ? 14 : -14},-10 ${cx > 0 ? 8 : -8},-34`} fill="none" stroke={trim} strokeWidth={6} strokeLinecap="round" />)}
      <path d="M-34,-244 L-20,-300 L20,-300 L34,-244 Z" fill={trim} stroke={INK} strokeWidth={3} />
      <path d="M-16,-300 L0,-420 L16,-300 Z" fill={trim} stroke={INK} strokeWidth={3} />
      <rect x={-24} y={-62} width={48} height={62} rx={20} fill={c.dark} />
    </g>
  );
};

export const WatPhnom: React.FC<{ x: number; y: number; w?: number; tone?: Tone }> = ({ x, y, w = 380, tone = 'day' }) => {
  const c = TONES[tone], k = w / 380;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} strokeLinejoin="round">
      <path d="M-190,0 Q-120,-70 -40,-92 Q0,-100 40,-92 Q120,-70 190,0 Z" fill={c.leaf} />
      {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={-160 + i * 29} cy={-30 - Math.sin((i / 11) * Math.PI) * 60 + hash(i, 2) * 10} r={22 + hash(i, 4) * 10} fill={mix(c.leaf, '#000000', 0.12 * (i % 2))} />)}
      <path d="M-60,-96 H60 V-112 H-60 Z" fill={c.white} stroke={INK} strokeWidth={3} />
      <path d="M-44,-112 Q-46,-176 0,-190 Q46,-176 44,-112 Z" fill={c.white} stroke={INK} strokeWidth={3} />
      <path d="M-12,-188 L0,-260 L12,-188 Z" fill={c.gold} stroke={INK} strokeWidth={2.5} />
    </g>
  );
};

export const PhnomPenhSkyline: React.FC<{ x: number; y: number; w?: number; tone?: Tone; t?: number }> = ({ x, y, w = 1080, tone = 'day', t = 0 }) => {
  const c = TONES[tone], k = w / 1080;
  return (
    <g transform={`translate(${x},${y})`}>
      {Array.from({ length: 14 }, (_, i) => { const bw = (60 + hash(i, 1) * 70) * k, bh = (60 + hash(i, 2) * 110) * k, bx = (-0.5 + i / 13) * w; return <rect key={i} x={bx - bw / 2} y={-bh} width={bw} height={bh} fill={mix(c.stone, '#000000', 0.2 + 0.1 * (i % 2))} />; })}
      <RoyalPalaceRoof x={-0.28 * w} y={0} w={420 * k} tone={tone} />
      <IndependenceMonument x={0.08 * w} y={0} h={430 * k} tone={tone} />
      <WatPhnom x={0.36 * w} y={0} w={300 * k} tone={tone} />
      {[-0.47, -0.08, 0.2, 0.48].map((p, i) => <SugarPalm key={i} x={p * w} y={0} h={(150 + 40 * hash(i, 7)) * k} tone={tone} lean={(hash(i, 8) - 0.5) * 8} />)}
      <rect x={-w / 2} y={0} width={w} height={120 * k} fill={c.water} />
      {Array.from({ length: 8 }, (_, i) => <line key={i} x1={(-0.45 + hash(i, 3) * 0.9) * w + Math.sin(t * 0.04 + i) * 10} y1={(20 + i * 12) * k} x2={(-0.45 + hash(i, 3) * 0.9) * w + 70 * k + Math.sin(t * 0.04 + i) * 10} y2={(20 + i * 12) * k} stroke="#FFFFFF" strokeWidth={2} opacity={0.3} />)}
    </g>
  );
};

export const FriendshipMonument: React.FC<{ x: number; y: number; h?: number; tone?: Tone }> = ({ x, y, h = 760, tone = 'day' }) => {
  const c = TONES[tone], k = h / 760, conc = tone === 'day' ? '#CFC8B8' : c.stone, statue = tone === 'day' ? '#8E8778' : c.dark, line = { stroke: INK, strokeWidth: 3 };
  // statue figures (base at y = -170, the top of the plinth): legs, torso, arms, head; helmet = VN pith helmet, cap = Cambodian soft cap
  const soldier = (fx: number, hat: 'helmet' | 'cap', flag: boolean, dir: 1 | -1) => (
    <g transform={`translate(${fx},-170)`}>
      <path d="M-20,0 L-16,-96 L-2,-96 L-4,0 Z M20,0 L16,-96 L2,-96 L4,0 Z" fill={statue} {...line} />
      <path d="M-30,-92 L-26,-200 Q0,-214 26,-200 L30,-92 Z" fill={statue} {...line} />
      <path d={`M${-dir * 26},-196 L${-dir * 34},-120 L${-dir * 22},-118 L${-dir * 16},-180 Z`} fill={statue} {...line} />
      {flag ? <><path d={`M${dir * 24},-196 L${dir * 46},-250 L${dir * 36},-258 L${dir * 14},-206 Z`} fill={statue} {...line} />
        <line x1={dir * 42} y1={-230} x2={dir * 42} y2={-420} stroke={INK} strokeWidth={6} />
        <path d={`M${dir * 42},-420 Q${dir * 100},-438 ${dir * 140},-404 L${dir * 140},-344 Q${dir * 100},-376 ${dir * 42},-358 Z`} fill={statue} {...line} /></>
        : <path d={`M${dir * 26},-196 L${dir * 40},-130 L${dir * 28},-126 L${dir * 16},-180 Z`} fill={statue} {...line} />}
      <circle cx={0} cy={-226} r={20} fill={statue} {...line} />
      {hat === 'helmet' ? <path d="M-30,-232 Q0,-268 30,-232 Z" fill={statue} {...line} /> : <path d="M-20,-238 Q0,-258 20,-238 L24,-232 L-12,-232 Z" fill={statue} {...line} />}
    </g>
  );
  const mother = (
    <g transform="translate(0,-170)">
      <path d="M-30,0 L-24,-120 Q0,-132 24,-120 L30,0 Z" fill={statue} {...line} />
      <path d="M-24,-118 L-22,-186 Q0,-198 22,-186 L24,-118 Z" fill={statue} {...line} />
      <ellipse cx={14} cy={-160} rx={22} ry={15} fill={statue} {...line} />
      <circle cx={30} cy={-170} r={11} fill={statue} {...line} />
      <circle cx={0} cy={-208} r={18} fill={statue} {...line} />
      <path d="M-20,-212 Q0,-238 20,-212 L22,-196 L-22,-196 Z" fill={statue} {...line} />
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} strokeLinejoin="round">
      {/* pylon behind: square shaft with relief bands, Khmer tiered lotus top and a pointed finial (never a plain rounded top) */}
      <path d="M-50,-170 L-36,-600 L36,-600 L50,-170 Z" fill={conc} {...line} />
      {[-520, -440, -360, -280].map((yy) => <line key={yy} x1={-40} y1={yy} x2={40} y2={yy} stroke={INK} strokeWidth={2} opacity={0.3} />)}
      {[[44, -600, 28], [34, -628, 26], [24, -654, 24]].map(([hw, yb, ht], i) => <path key={i} d={`M${-hw},${yb} L${-hw * 0.7},${yb - ht} L${hw * 0.7},${yb - ht} L${hw},${yb} Z`} fill={conc} {...line} />)}
      <path d="M-14,-678 L0,-760 L14,-678 Z" fill={conc} {...line} />
      <path d="M-230,0 H230 V-40 H-230 Z M-190,-40 H190 V-100 H-190 Z M-150,-100 H150 V-170 H-150 Z" fill={conc} {...line} />
      {soldier(-92, 'helmet', true, -1)}{soldier(92, 'cap', false, 1)}{mother}
      <rect x={-120} y={-150} width={240} height={34} rx={4} fill={mix(conc, '#000000', 0.15)} />
    </g>
  );
};
