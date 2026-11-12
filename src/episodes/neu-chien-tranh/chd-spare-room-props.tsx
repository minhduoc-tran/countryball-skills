import React from 'react';
import { Glow, WallTexture, LOOKS, Look, rnd, clamp } from '../../engine';

// Chapter D, "stranger": the spare room of a host family in another city, drawn flat and side-on like the sister's room
// in last-one (floor at y 880). Not their home: sage wallpaper, someone else's family photo, a borrowed lamp, and the
// family's few things (two mattresses, a suitcase, three bags) in a corner. `night` 0 = dusk, 1 = dark outside.

export const FLOOR = 880;
export const WIN = { x0: 1340, y0: 200, w: 320, h: 380 };
export const LAMP = { x: 1190, y: 540 };

/** The host: a kind woman with a bob in soft green (not Pip's mum, not the old neighbour). */
export const HOST: Look = { ...LOOKS.mom, jacket: '#6A8A5E', jacketShade: '#55724A', hair: '#7A6A5A', accent: '#E8D49A', shoe: '#4A5A4A' };
/** Two classmates for the new school (recoloured cast bodies). */
export const CLASSMATE_A: Look = { ...LOOKS.mo, jacket: '#B0463A', jacketShade: '#8E352B', accent: '#F2C14E', extra: undefined, hair: '#2A1C18', skin: '#EBD6BE', hand: '#EBD6BE', skinShade: '#D6BDA2' };
export const CLASSMATE_B: Look = { ...LOOKS.sis, jacket: '#5A6EB0', jacketShade: '#465892', accent: '#F2C14E', hair: '#2A1C18', extra: 'bunches' };

const Skyline: React.FC<{ id: string; night: number; t: number }> = ({ id, night, t }) => {
  const blocks = [[0, 150, 70], [70, 90, 90], [160, 210, 60], [220, 120, 80], [300, 170, 50], [250, 260, 22]];
  return (
    <g>
      {blocks.map(([x, h, w], i) => (
        <g key={i}>
          <rect x={x} y={WIN.h - h} width={w} height={h} fill={i % 2 ? '#2A2440' : '#322A4A'} />
          {Array.from({ length: Math.floor(h / 26) }).map((_, j) => (rnd(7 + i, j) > 0.45 - 0.2 * night ? <rect key={j} x={x + 10 + (j % 2) * 26} y={WIN.h - h + 12 + j * 22} width={12} height={10} fill="#FFD58A" opacity={0.55 + 0.4 * night} /> : null))}
        </g>
      ))}
      <path d={`M 261 ${WIN.h - 260} V ${WIN.h - 300}`} stroke="#2A2440" strokeWidth={4} />
      <circle cx={261} cy={WIN.h - 304} r={5} fill="#FF5A48" opacity={Math.floor(t / 20) % 2 ? 0.9 : 0.25} />
      <defs><linearGradient id={`${id}wsky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={night > 0.5 ? '#0E1230' : '#3A3070'} /><stop offset="1" stopColor={night > 0.5 ? '#2A2650' : '#C9785A'} /></linearGradient></defs>
    </g>
  );
};

/** The whole room: wall, wallpaper, window onto a skyline that isn't theirs, a stranger's photo, shelf, wardrobe, floor, lamp. */
export const SpareRoom: React.FC<{ t: number; id: string; night?: number }> = ({ t, id, night = 0 }) => (
  <g>
    <rect x={-400} y={-400} width={2720} height={FLOOR + 400} fill="#44524F" />
    {Array.from({ length: 48 }).map((_, i) => <rect key={i} x={-400 + i * 60} y={-400} width={26} height={FLOOR + 400} fill="#4C5C58" opacity={0.7} />)}
    <WallTexture rect={[-400, -400, 2720, FLOOR + 400]} />
    <rect x={-400} y={FLOOR - 32} width={2720} height={32} fill="#6A5A4C" />
    <rect x={-400} y={FLOOR - 32} width={2720} height={4} fill="#FFE2B8" opacity={0.25} />
    <rect x={-400} y={FLOOR} width={2720} height={700} fill="#5A4636" />
    {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M ${-400 + i * 200} ${FLOOR} L ${-520 + i * 200} 1500`} stroke="#3C2E24" strokeWidth={3} opacity={0.6} />)}
    {/* the window onto an unfamiliar skyline, with curtains */}
    <rect x={WIN.x0 - 22} y={WIN.y0 - 22} width={WIN.w + 44} height={WIN.h + 44} fill="#2A2230" />
    <g transform={`translate(${WIN.x0} ${WIN.y0})`}>
      <defs><clipPath id={`${id}wclip`}><rect width={WIN.w} height={WIN.h} /></clipPath></defs>
      <rect width={WIN.w} height={WIN.h} fill={`url(#${id}wsky)`} />
      <g clipPath={`url(#${id}wclip)`}><Skyline id={id} night={night} t={t} /></g>
    </g>
    <rect x={WIN.x0 + WIN.w / 2 - 3} y={WIN.y0} width={6} height={WIN.h} fill="#2A2230" />
    <path d={`M ${WIN.x0 - 40} ${WIN.y0 - 30} Q ${WIN.x0 + 40} ${WIN.y0 + 200} ${WIN.x0 - 30} ${WIN.y0 + WIN.h + 40} L ${WIN.x0 - 90} ${WIN.y0 + WIN.h + 40} L ${WIN.x0 - 90} ${WIN.y0 - 30} Z M ${WIN.x0 + WIN.w + 40} ${WIN.y0 - 30} Q ${WIN.x0 + WIN.w - 40} ${WIN.y0 + 200} ${WIN.x0 + WIN.w + 30} ${WIN.y0 + WIN.h + 40} L ${WIN.x0 + WIN.w + 90} ${WIN.y0 + WIN.h + 40} L ${WIN.x0 + WIN.w + 90} ${WIN.y0 - 30} Z`} fill="#8A5A52" />
    <rect x={WIN.x0 - 40} y={WIN.y0 + WIN.h + 22} width={WIN.w + 80} height={20} rx={6} fill="#6A5A4C" />
    {/* a stranger's family photo and a shelf: not ours */}
    <rect x={520} y={160} width={210} height={150} fill="#7A5A3A" />
    <rect x={534} y={174} width={182} height={122} fill="#D9C6A0" />
    {[580, 625, 670].map((x, i) => <g key={x}><circle cx={x} cy={222 + (i === 1 ? 14 : 0)} r={i === 1 ? 14 : 18} fill="#8A6A4A" /><path d={`M ${x - 22} 296 Q ${x} ${240 + (i === 1 ? 14 : 0)} ${x + 22} 296 Z`} fill={['#6A8A5E', '#C9784A', '#5A6EB0'][i]} /></g>)}
    <rect x={940} y={420} width={290} height={14} fill="#6A4A32" />
    <rect x={1010} y={434} width={14} height={34} fill="#4A3220" />
    <path d="M 960 420 V 350 H 990 V 420 M 1000 420 V 366 H 1026 V 420" fill="#9A5A4A" stroke="#6A3A2E" strokeWidth={3} />
    <path d="M 1150 420 L 1140 372 M 1150 420 L 1166 366 M 1150 420 L 1186 380" stroke="#4E8A3A" strokeWidth={8} strokeLinecap="round" />
    <path d="M 1120 420 H 1180 L 1172 452 H 1128 Z" fill="#B9703A" />
    <rect x={1760} y={330} width={320} height={FLOOR - 330} fill="#4A3A32" />
    <rect x={1760} y={330} width={320} height={8} fill="#FFC98A" opacity={0.25} />
    <path d="M 1920 340 V 870" stroke="#2E2420" strokeWidth={5} />
    <circle cx={1900} cy={620} r={7} fill="#C9A46A" />
    <circle cx={1940} cy={620} r={7} fill="#C9A46A" />
    {/* the floor lamp: the only warm thing here */}
    <ellipse cx={LAMP.x} cy={FLOOR + 8} rx={52} ry={9} fill="#000" opacity={0.35} />
    <path d={`M ${LAMP.x} ${FLOOR} V ${LAMP.y + 60}`} stroke="#2A2230" strokeWidth={9} />
    <path d={`M ${LAMP.x - 56} ${LAMP.y + 70} L ${LAMP.x - 34} ${LAMP.y} H ${LAMP.x + 34} L ${LAMP.x + 56} ${LAMP.y + 70} Z`} fill="#F2C98A" />
    <Glow x={LAMP.x} y={LAMP.y + 40} r={620} o={0.6 - 0.1 * night} />
  </g>
);

/** The family's two mattresses on the floor (x0..x1), blankets and pillows; `bump` draws sleepers as lumps under the blanket. */
export const Mattresses: React.FC<{ x0: number; x1: number; bump?: boolean }> = ({ x0, x1, bump = false }) => (
  <g>
    <ellipse cx={(x0 + x1) / 2} cy={FLOOR + 6} rx={(x1 - x0) / 2 + 20} ry={16} fill="#000" opacity={0.35} />
    <rect x={x0} y={FLOOR - 66} width={x1 - x0} height={66} rx={14} fill="#8E9BAE" />
    <rect x={x0} y={FLOOR - 66} width={x1 - x0} height={5} rx={3} fill="#FFE2B8" opacity={0.4} />
    <path d={`M ${x0 + 120} ${FLOOR - 62} Q ${(x0 + x1) / 2} ${FLOOR - 98} ${x1 - 10} ${FLOOR - 70} L ${x1 - 10} ${FLOOR - 20} L ${x0 + 120} ${FLOOR - 24} Z`} fill="#3E8C86" />
    {[0.25, 0.5, 0.75].map((k) => <path key={k} d={`M ${x0 + 120 + (x1 - x0 - 130) * k} ${FLOOR - 84} l -6 60`} stroke="#2F6E69" strokeWidth={5} opacity={0.7} />)}
    <rect x={x0 + 14} y={FLOOR - 98} width={96} height={38} rx={16} fill="#E6DCD0" />
    {bump ? (
      <g>
        <path d={`M ${x0 + 170} ${FLOOR - 64} Q ${x0 + 250} ${FLOOR - 150} ${x0 + 360} ${FLOOR - 70} Z`} fill="#4AA39B" stroke="#2F6E69" strokeWidth={4} />
        <path d={`M ${x0 + 390} ${FLOOR - 64} Q ${x0 + 440} ${FLOOR - 118} ${x0 + 520} ${FLOOR - 66} Z`} fill="#4AA39B" stroke="#2F6E69" strokeWidth={4} />
        <circle cx={x0 + 150} cy={FLOOR - 98} r={24} fill="#5A3226" />
        <circle cx={x0 + 62} cy={FLOOR - 104} r={18} fill="#3A2620" />
      </g>
    ) : null}
  </g>
);

/** A suitcase standing on the floor, its strap and wheels; `s` scales it about its base centre. */
export const Suitcase: React.FC<{ x: number; s?: number }> = ({ x, s = 1 }) => (
  <g transform={`translate(${x} ${FLOOR}) scale(${s})`}>
    <ellipse cx={4} cy={4} rx={86} ry={11} fill="#000" opacity={0.35} />
    <rect x={-70} y={-150} width={140} height={146} rx={16} fill="#7A3A3A" stroke="#3A1A1A" strokeWidth={5} />
    <rect x={-70} y={-100} width={140} height={16} fill="#5A2A2A" />
    <path d="M -20 -150 V -176 H 20 V -150" stroke="#2A1A1A" strokeWidth={8} fill="none" strokeLinejoin="round" />
    <rect x={-70} y={-150} width={34} height={146} rx={14} fill="#FFE2B8" opacity={0.14} />
    <circle cx={-48} cy={0} r={8} fill="#2A1A1A" />
    <circle cx={48} cy={0} r={8} fill="#2A1A1A" />
  </g>
);

/** A schoolbag: x its centre, y its base; hanging bags pass `hang` to draw a loop and a strap up. */
export const Bag: React.FC<{ x: number; y: number; s?: number; color?: string; star?: boolean; sway?: number }> = ({ x, y, s = 1, color = '#F28C6A', star = false, sway = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${sway}) scale(${s})`}>
    <ellipse cx={4} cy={4} rx={70} ry={9} fill="#000" opacity={0.3} />
    <path d="M -62 0 L -66 -120 Q 0 -168 66 -120 L 62 0 Z" fill={color} stroke="#3A1E18" strokeWidth={5} strokeLinejoin="round" />
    <path d="M -62 0 L -66 -120 Q -30 -150 -20 -140 L -20 0 Z" fill="#000" opacity={0.14} />
    <rect x={-46} y={-62} width={92} height={50} rx={10} fill="#000" opacity={0.16} />
    <path d="M -22 -144 Q 0 -190 22 -144" stroke="#3A1E18" strokeWidth={9} fill="none" strokeLinecap="round" />
    {star ? <path d="M 0 -108 l 8 18 l 20 2 l -15 13 l 5 19 l -18 -10 l -18 10 l 5 -19 l -15 -13 l 20 -2 Z" fill="#FFE27A" stroke="#C99A2A" strokeWidth={3} transform="scale(0.8) translate(0 -8)" /> : null}
  </g>
);

/** A wavy "speech" squiggle (an accent you can't read): `amp`/`wave` shape it, `zig` makes it jagged. Draws on with `p` 0..1. */
export const Squiggle: React.FC<{ x: number; y: number; w: number; amp: number; waves: number; p: number; color: string; zig?: boolean; sw?: number }> = ({ x, y, w, amp, waves, p, color, zig = false, sw = 9 }) => {
  const n = waves * 2;
  let d = `M ${x} ${y}`;
  for (let i = 1; i <= n; i++) {
    const px = x + (w * i) / n;
    d += zig ? ` L ${px} ${y + (i % 2 ? -amp : amp)}` : ` Q ${x + (w * (i - 0.5)) / n} ${y + (i % 2 ? -amp * 2 : amp * 2)} ${px} ${y}`;
  }
  return <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(p)} stroke={color} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
};

/** A rounded speech bubble (white-cream) with a tail pointing down-left or down-right; children are drawn inside in local coordinates (0,0 = top-left). */
export const Bubble: React.FC<{ x: number; y: number; w: number; h: number; tail?: 1 | -1; pop: number; children?: React.ReactNode }> = ({ x, y, w, h, tail = 1, pop, children }) => (
  <g transform={`translate(${x} ${y}) scale(${pop})`} opacity={clamp(pop * 3)}>
    <path d={`M 30 0 H ${w - 30} Q ${w} 0 ${w} 30 V ${h - 30} Q ${w} ${h} ${w - 30} ${h} H ${tail > 0 ? w * 0.4 : w * 0.8} L ${tail > 0 ? w * 0.28 : w * 0.9} ${h + 46} L ${tail > 0 ? w * 0.26 : w * 0.7} ${h} H 30 Q 0 ${h} 0 ${h - 30} V 30 Q 0 0 30 0 Z`} fill="#F6EFE3" stroke="#1D2033" strokeWidth={6} strokeLinejoin="round" />
    {children}
  </g>
);
