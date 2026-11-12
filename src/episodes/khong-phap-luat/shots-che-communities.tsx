import React from 'react';
import { kf, clamp, easeOut, easeInOut, camT, Glow, Sparkle, Dust, ShotProps } from '../../engine';
import { Tiny, SHIRTS, SKINS } from './che-tiny-people';
import { FishingVillage, IrrigationCanal } from './che-village-and-canal-scenes';

// Chapter E, "6 month one: ostrom" examples (225.7-234.2 s), look "peace": E4 ordinary people of a community gathered,
// E5 the fishing village taking turns, E6 the irrigation canal and its gates, E7 an equal share by a rule.

const LINE = '#2A1E24';

/** A village green in the afternoon: sky, hills, a big banyan, a few roofs, a grass floor. */
const Green: React.FC<{ id: string; t: number; ground?: number }> = ({ id, t, ground = 700 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9ED4EC" /><stop offset="1" stopColor="#FCEBC0" /></linearGradient>
      <linearGradient id={`${id}gr`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#A8CE72" /><stop offset="1" stopColor="#5F9645" /></linearGradient>
    </defs>
    <rect x={-200} y={-200} width={2320} height={ground + 200} fill={`url(#${id}sky)`} />
    <circle cx={1560} cy={200} r={90} fill="#FFF2BE" /><Glow x={1560} y={200} r={560} o={0.6} />
    <path d={`M -200 ${ground - 60} Q 300 ${ground - 230} 800 ${ground - 90} T 1700 ${ground - 120} T 2200 ${ground - 70} V ${ground} H -200 Z`} fill="#86B76A" opacity={0.85} />
    {[[1250, 1.0], [1520, 0.8], [1750, 1.1]].map(([x, k], i) => (
      <g key={i} transform={`translate(${x} ${ground - 30}) scale(${k})`}>
        <rect x={-70} y={-110} width={140} height={110} fill="#EBD6A6" stroke={LINE} strokeWidth={5} />
        <path d="M -90 -108 L 0 -190 L 90 -108 Z" fill="#B8603E" stroke={LINE} strokeWidth={5} strokeLinejoin="round" />
        <rect x={-20} y={-66} width={40} height={66} fill="#7A5230" stroke={LINE} strokeWidth={4} />
      </g>
    ))}
    <rect x={-200} y={ground} width={2320} height={600} fill={`url(#${id}gr)`} />
    <g transform={`translate(260 ${ground + 20})`}>
      <path d="M -26 0 L -20 -240 L 22 -240 L 30 0 Z" fill="#7A5230" stroke={LINE} strokeWidth={6} />
      {[[-120, -300, 160], [90, -330, 170], [-10, -400, 150], [-210, -240, 110], [200, -250, 120]].map(([x, y, r], i) => (
        <circle key={i} cx={x + Math.sin(t / 30 + i) * 3} cy={y} r={r} fill={['#4E8F4A', '#5FA356', '#3F7F40'][i % 3]} stroke={LINE} strokeWidth={5} />
      ))}
    </g>
  </g>
);

// ---------- E4: ordinary people of a community, a mix of ages, gathered on the green, waving ----------
export const E4: React.FC<ShotProps> = ({ t, len }) => {
  const rows = [
    { y: 800, s: 3.0, xs: [420, 700, 980, 1260, 1540, 1780] },
    { y: 900, s: 3.3, xs: [300, 560, 840, 1120, 1400, 1660] },
  ];
  let n = 0;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Green id="e4" t={t} />
      {rows.map((r, ri) => r.xs.map((x, i) => {
        const k = n++;
        const wave = Math.sin(t / 4 + k * 1.3);
        return (
          <Tiny key={`${ri}-${i}`} x={x} y={r.y} s={r.s} shirt={SHIRTS[k % 8]} skin={SKINS[k % 4]} hat={k % 3 === 0} old={k % 7 === 3} kid={k % 5 === 2}
            armR={k % 2 === 0 ? 110 + 30 * wave : 10} armL={k % 3 === 1 ? 100 + 30 * wave : 10} bob={Math.max(0, Math.sin(t / 5 + k)) * 5} />
        );
      }))}
      <Dust t={t} seed={4} x0={100} y0={200} w={1700} h={600} n={18} o={0.3} />
    </g>
  );
};

// ---------- E5: the fishing village: boats take turns, the board's arrow moves down ----------
export const E5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 790], [len, 840]]), 690, kf(t, [[0, 1.12], [len, 1.2]]))}>
    <FishingVillage t={t} id="e5" />
  </g>
);

// ---------- E6: the canal: the gate opens in turns, the water follows ----------
export const E6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 610, kf(t, [[0, 1.2], [len, 1.3]]))}>
    <IrrigationCanal t={t + 8} id="e6" />
  </g>
);

// ---------- E7: four villagers, a basket of fish, a rule scroll: the catch lands in four equal piles ----------
export const E7: React.FC<ShotProps> = ({ t, len }) => {
  const people = [{ x: 400, c: '#E07A5F' }, { x: 760, c: '#3D8BA8' }, { x: 1160, c: '#E9B93A' }, { x: 1520, c: '#7FB069' }];
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Green id="e7" t={t} ground={600} />
      {/* the rule scroll hanging from a bamboo pole, its lines writing in, a tick at the end */}
      <g transform="translate(960 150)">
        <path d="M -260 -40 H 260" stroke="#7A5230" strokeWidth={14} strokeLinecap="round" />
        <rect x={-230} y={-26} width={460} height={190} rx={14} fill="#FFF8E6" stroke={LINE} strokeWidth={6} />
        {[0, 1, 2].map((i) => <path key={i} d={`M -180 ${14 + i * 46} H ${-180 + 360 * easeOut(clamp((t - 2 - i * 5) / 8))}`} stroke="#6B4128" strokeWidth={9} strokeLinecap="round" />)}
        <path d="M 150 120 L 180 150 L 228 90" stroke="#2E9E5B" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="130" strokeDashoffset={130 * (1 - clamp((t - 22) / 8))} />
      </g>
      <g transform="translate(960 860)">
        <ellipse cx={0} cy={50} rx={170} ry={30} fill="#000" opacity={0.25} />
        <path d="M -150 -50 Q -140 56 0 62 Q 140 56 150 -50 Z" fill="#C99358" stroke={LINE} strokeWidth={6} />
        <path d="M -150 -50 H 150" stroke={LINE} strokeWidth={8} />
        {[-80, -30, 30, 80].map((x, i) => <ellipse key={i} cx={x} cy={-58 - (i % 2) * 8} rx={34} ry={13} fill="#C9D6E4" stroke={LINE} strokeWidth={4} transform={`rotate(${i % 2 ? 8 : -6} ${x} -58)`} />)}
      </g>
      {people.map((p, i) => {
        const fly = clamp((t - 4 - i * 6) / 9);
        const px = 960 + (p.x - 960) * easeInOut(fly);
        const py = 800 - 200 * Math.sin(Math.PI * fly) + 150 * easeInOut(fly) - 20;
        return (
          <g key={i}>
            <rect x={p.x - 110} y={940} width={220} height={22} rx={8} fill="#B8603E" stroke={LINE} strokeWidth={4} />
            <Tiny x={p.x} y={930} s={3.6} hat={i % 2 === 0} shirt={p.c} skin={SKINS[i]} armL={fly >= 1 ? 120 : 20} armR={fly >= 1 ? 120 : 20} bob={fly >= 1 ? Math.abs(Math.sin(t / 3 + i)) * 7 : 0} />
            {fly > 0 && fly < 1 ? <ellipse cx={px} cy={py} rx={26} ry={11} fill="#C9D6E4" stroke={LINE} strokeWidth={4} transform={`rotate(${-30 + 60 * fly} ${px} ${py})`} /> : null}
            {fly >= 1 ? <g>{[0, 1, 2].map((k) => <ellipse key={k} cx={p.x - 40 + k * 40} cy={954 - (k % 2) * 6} rx={24} ry={10} fill="#C9D6E4" stroke={LINE} strokeWidth={3.5} />)}</g> : null}
          </g>
        );
      })}
      <Sparkle x={960} y={320} t={t - 20} s={1.4} />
    </g>
  );
};
