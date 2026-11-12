import React from 'react';
import { FONT, UI, LOOKS, clamp, lerp, easeInOut, Glow } from '../../engine';

// Chapter E props, part 1: the house gate, the black quadcopter drone, a tablet frame, Pip's silhouette (the weapon
// blueprint morph), the contract paper. All pure functions of the shot clock; drawn in world units.

const INK = '#121019';

/** Pip's house gate in the alley: plaster wall wings, two brick pillars, iron bars, a number plate, a lamp. (x, y) = ground centre. */
export const Gate: React.FC<{ x: number; y: number; s?: number; lampOn?: number }> = ({ x, y, s = 1, lampOn = 0.4 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-420} y={-330} width={840} height={330} fill="#C9B8A2" stroke={INK} strokeWidth={6} />
    <path d="M -420 -330 H 420 M -420 -250 H 420" stroke="#A8957C" strokeWidth={4} />
    <rect x={-420} y={-60} width={840} height={60} fill="#8C7B68" />
    <ellipse cx={0} cy={6} rx={470} ry={16} fill="#000" opacity={0.2} />
    {/* the house roof behind the wall */}
    <path d="M -430 -330 L -330 -470 L 330 -470 L 430 -330 Z" fill="#9A4B3C" stroke={INK} strokeWidth={6} />
    <path d="M -380 -400 H 380 M -350 -440 H 350" stroke="#7C3A2E" strokeWidth={5} />
    {/* iron gate: two leaves of bars */}
    <rect x={-200} y={-300} width={400} height={300} fill="#1E2A2E" opacity={0.55} />
    {Array.from({ length: 13 }).map((_, i) => (
      <path key={i} d={`M ${-180 + i * 30} -295 V -4`} stroke="#2B3A3F" strokeWidth={9} strokeLinecap="round" />
    ))}
    <path d="M -200 -230 H 200 M -200 -70 H 200 M 0 -300 V 0" stroke="#3B4D53" strokeWidth={10} />
    {/* brick pillars */}
    {[-250, 250].map((px) => (
      <g key={px}>
        <rect x={px - 46} y={-360} width={92} height={360} fill="#B5543E" stroke={INK} strokeWidth={6} />
        <path d={`M ${px - 46} -300 H ${px + 46} M ${px - 46} -240 H ${px + 46} M ${px - 46} -180 H ${px + 46} M ${px - 46} -120 H ${px + 46} M ${px - 46} -60 H ${px + 46}`} stroke="#8E3E2E" strokeWidth={3} />
        <rect x={px - 58} y={-380} width={116} height={28} fill="#D9C8B0" stroke={INK} strokeWidth={5} />
      </g>
    ))}
    {/* number plate and lamp */}
    <rect x={296} y={-250} width={100} height={70} rx={8} fill="#2F5F8A" stroke="#F1EEE6" strokeWidth={5} />
    <text x={345} y={-198} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={44} fill="#F1EEE6">12</text>
    <Glow x={-250} y={-420} r={220 * lampOn + 1} o={0.5} />
    <circle cx={-250} cy={-410} r={20} fill="#FFE2A0" stroke={INK} strokeWidth={4} />
  </g>
);

/** The black quadcopter, seen from the front and slightly below: body, camera eye with a red light, four spinning rotors. */
export const Drone: React.FC<{ x: number; y: number; s?: number; t: number; tilt?: number; eye?: number }> = ({ x, y, s = 1, t, tilt = 0, eye = 1 }) => {
  const bob = Math.sin(t / 7) * 6 * s;
  const rotor = (rx: number, ry: number, k: number) => (
    <g transform={`translate(${rx} ${ry})`}>
      <rect x={-6} y={-4} width={12} height={34} fill="#2A2D38" />
      <ellipse cx={0} cy={0} rx={92} ry={16} fill="#8A93A8" opacity={0.28} />
      <g transform={`scale(1 0.18) rotate(${(t * 75 * k) % 360})`}>
        <path d="M -92 0 L 92 0" stroke="#0B0C12" strokeWidth={14} strokeLinecap="round" />
      </g>
      <ellipse cx={0} cy={0} rx={10} ry={6} fill="#4B5060" />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y + bob}) rotate(${tilt}) scale(${s})`}>
      <ellipse cx={0} cy={260} rx={150} ry={22} fill="#000" opacity={0.18} />
      <path d="M -50 0 L -190 -50 M 50 0 L 190 -50 M -50 20 L -170 70 M 50 20 L 170 70" stroke="#1C1E27" strokeWidth={18} strokeLinecap="round" />
      {rotor(-190, -62, 1)}{rotor(190, -62, -1)}
      <g transform="translate(0 0)">
        <path d="M -90 -30 Q -96 -70 -40 -76 L 40 -76 Q 96 -70 90 -30 L 76 50 Q 0 90 -76 50 Z" fill="#23262F" stroke={INK} strokeWidth={6} />
        <path d="M -70 -50 Q -50 -68 0 -68 L 0 -40 Z" fill="#454A5C" opacity={0.7} />
        <path d="M 64 -30 L 76 50 Q 40 72 10 78 Q 50 20 40 -40 Z" fill="#14161D" opacity={0.6} />
        <rect x={-14} y={-92} width={28} height={22} rx={6} fill="#1C1E27" />
      </g>
      {/* camera gimbal */}
      <circle cx={0} cy={66} r={46} fill="#1B1D26" stroke={INK} strokeWidth={6} />
      <circle cx={0} cy={66} r={31} fill="#07080D" stroke="#4B5060" strokeWidth={5} />
      <circle cx={0} cy={66} r={14} fill="#1B2C55" />
      <circle cx={-8} cy={58} r={5} fill="#BFD6FF" opacity={0.9} />
      <circle cx={-52} cy={-6} r={8} fill="#FF3B3B" opacity={eye * (t % 30 < 20 ? 1 : 0.25)} />
      <circle cx={52} cy={-6} r={8} fill="#38D26A" opacity={eye * (t % 24 < 14 ? 1 : 0.3)} />
      {rotor(-170, 62, -1)}{rotor(170, 62, 1)}
    </g>
  );
};

/** A tablet in landscape, centred at (0,0) of its group; draw the screen content as children in screen coordinates (w x h). */
export const Tablet: React.FC<{ x: number; y: number; w: number; h: number; rot?: number; id: string; children: React.ReactNode }> = ({ x, y, w, h, rot = 0, id, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-w / 2 + 14} y={-h / 2 + 18} width={w + 36} height={h + 36} rx={36} fill="#000" opacity={0.35} />
    <rect x={-w / 2 - 24} y={-h / 2 - 24} width={w + 48} height={h + 48} rx={34} fill="#20222B" stroke="#4A4E60" strokeWidth={5} />
    <clipPath id={`${id}scr`}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} /></clipPath>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill="#0C1626" />
    <g clipPath={`url(#${id}scr)`}>{children}</g>
    <path d={`M ${-w / 2 + 30} ${-h / 2} L ${w * 0.1} ${-h / 2} L ${-w * 0.2} ${h / 2} L ${-w / 2} ${h / 2} Z`} fill="#fff" opacity={0.04} />
  </g>
);

/**
 * Pip's silhouette (feet at 0,0, about 380 tall) that turns into a weapon blueprint: m 0 = a solid dark-blue
 * silhouette, m 1 = a wireframe with joint nodes, target rings and a red crosshair on the chest.
 */
export const PipSilhouette: React.FC<{ m: number; t: number }> = ({ m, t }) => {
  const k = easeInOut(clamp(m));
  const fill = `rgba(120,170,230,${1 - k})`;
  const sk = { fill, stroke: k > 0.02 ? '#9FE8FF' : '#1B2B44', strokeWidth: lerp(4, 4, k), strokeDasharray: k > 0.02 ? `${lerp(0, 14, k)} ${lerp(0, 8, k)}` : undefined } as const;
  const nodes = [[0, -320], [-60, -250], [60, -250], [-96, -150], [96, -150], [-30, -110], [30, -110], [-38, -4], [38, -4]];
  return (
    <g>
      <circle cx={0} cy={-310} r={50} {...sk} />
      <path d="M -50 -250 Q 0 -270 50 -250 L 66 -120 L -66 -120 Z" {...sk} />
      <path d="M -50 -250 L -104 -150 L -84 -140 L -42 -214 M 50 -250 L 104 -150 L 84 -140 L 42 -214" {...sk} />
      <path d="M -62 -120 L -44 -4 L -12 -4 L -6 -120 Z M 62 -120 L 44 -4 L 12 -4 L 6 -120 Z" {...sk} />
      <g opacity={k}>
        {nodes.map(([nx, ny], i) => <circle key={i} cx={nx} cy={ny} r={7} fill="#FFB347" />)}
        {[70, 130, 190].map((r, i) => <circle key={r} cx={0} cy={-200} r={r + Math.sin(t / 6 + i) * 4} fill="none" stroke="#FF5A4A" strokeWidth={3} opacity={0.85 - i * 0.2} />)}
        <path d="M -240 -200 H 240 M 0 -400 V 40" stroke="#FF5A4A" strokeWidth={3} />
        <path d="M 150 -392 H 260 M 150 -352 H 230" stroke="#9FE8FF" strokeWidth={4} opacity={0.8} />
        <path d="M 190 -380 V 0 M 178 -380 H 202 M 178 0 H 202" stroke="#9FE8FF" strokeWidth={3} />
        <text x={0} y={0} transform="translate(214 -190) rotate(90)" textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#9FE8FF">1,62 m</text>
      </g>
    </g>
  );
};

/** A contract page (cream paper, HỢP ĐỒNG header, text bars, a signature line with an X), centred at (0,0), 560 x 760. */
export const Contract: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-262} y={-350} width={560} height={760} rx={10} fill="#000" opacity={0.3} />
    <rect x={-280} y={-380} width={560} height={760} rx={10} fill="#F4EEDD" stroke="#8E8A7C" strokeWidth={5} />
    <text x={0} y={-290} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={54} fill={UI.pill} letterSpacing={3}>HỢP ĐỒNG</text>
    <path d="M -200 -250 H 200" stroke="#3A3A46" strokeWidth={5} />
    {Array.from({ length: 11 }).map((_, i) => <rect key={i} x={-210} y={-210 + i * 36} width={i % 4 === 3 ? 260 : 420} height={14} rx={7} fill="#9A9AA6" />)}
    <path d="M -210 250 H 60" stroke="#3A3A46" strokeWidth={4} />
    <text x={-210} y={238} fontFamily={FONT.hand} fontSize={50} fill="#3A3A46">X</text>
    <circle cx={170} cy={250} r={56} fill="none" stroke="#B3202E" strokeWidth={6} opacity={0.75} />
    <path d="M 140 250 L 164 274 L 204 224" stroke="#B3202E" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.75} />
  </g>
);

export const SUIT = LOOKS.suit;
export const PIP = LOOKS.pipHood;
