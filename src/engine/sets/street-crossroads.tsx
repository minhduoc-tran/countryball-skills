import React from 'react';
import { rnd } from '../anim';
import { LOOKS } from '../rig';
import { Foreground } from '../kit';

// A straight top-down view of an empty crossroads (1920 x 1080 frame, the intersection's centre at 960, 540): asphalt
// with grit, patches, skid marks and a manhole, zebra crossings and lane dashes on all four arms, tiled sidewalk
// corners, leaf litter, a dropped flip-flop, soft cloud shadows drifting with t, and blurred tree crowns in the
// corners for depth. The hero lies in the middle: <LyingPipTop x={960} y={578} scale={0.95} t={t} />, head up the frame.

const A = { road: '#5A5868', patch: '#4C4A5A', walk: '#8A8294', walkLine: '#6E6878', kerb: '#B4ABB8', mark: '#E4DFCF' };
const ROAD = { x0: 690, x1: 1230, y0: 270, y1: 810 }; // the intersection square
const LEAF = ['#B8683A', '#D9A441', '#8A4A2E', '#6A8A3E', '#C8803A'];

export const CrossroadsTop: React.FC<{ t: number; id?: string }> = ({ t, id = 'xr' }) => {
  const R = ROAD;
  const grit = Array.from({ length: 260 }).map((_, i) => <circle key={`g${i}`} cx={rnd(3, i) * 1920} cy={rnd(4, i) * 1080} r={1 + rnd(5, i) * 2.2} fill={i % 3 ? '#3E3C4A' : '#7A7888'} opacity={0.35} />);
  const tiles: React.ReactNode[] = [];
  const corners: [number, number, number, number][] = [[-20, -20, R.x0 + 20 - 20, R.y0 + 20 - 20], [R.x1, -20, 1940, R.y0], [-20, R.y1, R.x0, 1100], [R.x1, R.y1, 1940, 1100]];
  corners.forEach(([x0, y0, x1, y1], ci) => {
    tiles.push(<rect key={`c${ci}`} x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={A.walk} />);
    for (let x = x0 - ((x0 + 2000) % 70); x < x1; x += 70) tiles.push(<path key={`tx${ci}${x}`} d={`M ${x} ${y0} L ${x} ${y1}`} stroke={A.walkLine} strokeWidth={2} opacity={0.6} />);
    for (let y = y0 - ((y0 + 2000) % 70); y < y1; y += 70) tiles.push(<path key={`ty${ci}${y}`} d={`M ${x0} ${y} L ${x1} ${y}`} stroke={A.walkLine} strokeWidth={2} opacity={0.6} />);
    for (let k = 0; k < 8; k++) tiles.push(<rect key={`ts${ci}${k}`} x={x0 + Math.floor(rnd(7 + ci, k) * ((x1 - x0) / 70)) * 70 + 2} y={y0 + Math.floor(rnd(8 + ci, k) * ((y1 - y0) / 70)) * 70 + 2} width={66} height={66} fill="#000" opacity={0.08 + rnd(9, k) * 0.08} />);
  });
  const kerb = (
    <g stroke={A.kerb} strokeWidth={10} fill="none" strokeLinejoin="round">
      <path d={`M -20 ${R.y0} L ${R.x0} ${R.y0} L ${R.x0} -20`} />
      <path d={`M ${R.x1} -20 L ${R.x1} ${R.y0} L 1940 ${R.y0}`} />
      <path d={`M -20 ${R.y1} L ${R.x0} ${R.y1} L ${R.x0} 1100`} />
      <path d={`M ${R.x1} 1100 L ${R.x1} ${R.y1} L 1940 ${R.y1}`} />
    </g>
  );
  const stripes: React.ReactNode[] = [];
  for (let i = 0; i < 7; i++) {
    const a = R.x0 + 26 + i * 76;
    const b = R.y0 + 26 + i * 76;
    stripes.push(<rect key={`zt${i}`} x={a} y={130} width={44} height={120} fill={A.mark} opacity={0.92} />, <rect key={`zb${i}`} x={a} y={R.y1 + 20} width={44} height={120} fill={A.mark} opacity={0.92} />,
      <rect key={`zl${i}`} x={R.x0 - 140} y={b} width={120} height={44} fill={A.mark} opacity={0.92} />, <rect key={`zr${i}`} x={R.x1 + 20} y={b} width={120} height={44} fill={A.mark} opacity={0.92} />);
  }
  const dashes: React.ReactNode[] = [];
  for (let k = 0; k < 14; k++) {
    dashes.push(<rect key={`dv${k}`} x={955} y={-30 + k * 66} width={9} height={0} fill={A.mark} />);
    if (-30 + k * 66 + 40 < 110) dashes.push(<rect key={`dt${k}`} x={955} y={-30 + k * 66} width={9} height={40} fill={A.mark} opacity={0.85} />);
    if (R.y1 + 160 + k * 66 < 1100) dashes.push(<rect key={`db${k}`} x={955} y={R.y1 + 160 + k * 66} width={9} height={40} fill={A.mark} opacity={0.85} />);
    if (-30 + k * 66 + 40 < R.x0 - 160) dashes.push(<rect key={`dl${k}`} x={-30 + k * 66} y={535} width={40} height={9} fill={A.mark} opacity={0.85} />);
    if (R.x1 + 160 + k * 66 < 1940) dashes.push(<rect key={`dr${k}`} x={R.x1 + 160 + k * 66} y={535} width={40} height={9} fill={A.mark} opacity={0.85} />);
  }
  const skid = [[-120, 40, 60], [-60, 180, 90]].map(([dx, dy, w], i) => <path key={`sk${i}`} d={`M ${760 + dx} ${300 + dy} Q 900 ${430 + dy} ${1180 + dx / 2} ${820}`} stroke="#2E2C3A" strokeWidth={w / 4} fill="none" opacity={0.22} strokeLinecap="round" />);
  const leaves = Array.from({ length: 46 }).map((_, i) => {
    const x = 120 + rnd(21, i) * 1680 + Math.sin(t / 40 + i) * 3;
    const y = 80 + rnd(22, i) * 920 + Math.cos(t / 50 + i * 2) * 2;
    return <path key={`lf${i}`} d="M 0 -9 Q 8 -2 0 10 Q -8 -2 0 -9 Z" fill={LEAF[i % 5]} opacity={0.85} transform={`translate(${x} ${y}) rotate(${rnd(23, i) * 360}) scale(${0.8 + rnd(24, i) * 0.9})`} />;
  });
  return (
    <g>
      <rect x={-20} y={-20} width={1960} height={1120} fill={A.road} />
      {grit}
      {[[760, 360, 130, 90], [1090, 640, 150, 110], [820, 700, 90, 70], [1020, 330, 110, 70]].map(([x, y, w, h], i) => <rect key={`p${i}`} x={x} y={y} width={w} height={h} fill={A.patch} opacity={0.7} transform={`rotate(${i * 7 - 8} ${x} ${y})`} />)}
      {tiles}
      {kerb}
      {skid}
      {stripes}
      {dashes}
      <path d={`M ${R.x0 + 20} 120 L ${R.x0 + 20} 138 M 960 120 L 1220 120`} stroke="none" />
      <rect x={965} y={96} width={255} height={16} fill={A.mark} opacity={0.9} />
      <rect x={700} y={968} width={255} height={16} fill={A.mark} opacity={0.9} />
      <rect x={516} y={548} width={16} height={252} fill={A.mark} opacity={0.9} />
      <rect x={1388} y={280} width={16} height={252} fill={A.mark} opacity={0.9} />
      {/* a manhole cover, a drain grate at the kerb, hairline cracks */}
      <g transform="translate(1118 706)">
        <circle r={46} fill="#2C2A38" /><circle r={40} fill="#4A4858" /><circle r={32} fill="none" stroke="#2C2A38" strokeWidth={3} />
        {[-18, -6, 6, 18].map((o) => <path key={o} d={`M ${-30} ${o} L 30 ${o} M ${o} -30 L ${o} 30`} stroke="#2C2A38" strokeWidth={3} opacity={0.8} />)}
        <path d="M -38 -14 A 40 40 0 0 1 14 -38" stroke="#FFB46A" strokeWidth={2.5} fill="none" opacity={0.45} />
      </g>
      <rect x={R.x0 - 70} y={R.y1 + 190} width={60} height={22} fill="#2C2A38" /><path d={`M ${R.x0 - 62} ${R.y1 + 192} l 0 18 M ${R.x0 - 48} ${R.y1 + 192} l 0 18 M ${R.x0 - 34} ${R.y1 + 192} l 0 18 M ${R.x0 - 20} ${R.y1 + 192} l 0 18`} stroke="#4A4858" strokeWidth={3} />
      <path d="M 740 420 l 60 40 l 20 60 l 70 30 M 1180 380 l -40 50 l 10 70 l -50 40" stroke="#2E2C3A" strokeWidth={2.5} fill="none" opacity={0.6} />
      {leaves}
      {/* a dropped flip-flop: sole, strap, the thong */}
      <g transform="translate(790 676) rotate(28) scale(0.85)">
        <ellipse cx={5} cy={7} rx={32} ry={62} fill="#000" opacity={0.3} />
        <path d="M 0 -60 Q 31 -58 31 -22 Q 29 10 20 30 Q 16 58 0 60 Q -16 58 -20 30 Q -29 10 -31 -22 Q -31 -58 0 -60 Z" fill="#2FA595" stroke="#14101C" strokeWidth={3.5} />
        <path d="M -27 -6 L 0 -36 L 27 -6" stroke="#E9C46A" strokeWidth={9} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M -27 -6 L 0 -36 L 27 -6" stroke="#14101C" strokeWidth={2} fill="none" opacity={0.4} />
        <circle cx={0} cy={-36} r={5} fill="#14101C" /><path d="M 0 -36 L 0 -8" stroke="#E9C46A" strokeWidth={7} strokeLinecap="round" />
        <path d="M -14 50 Q 0 56 14 50" stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.3} />
      </g>
      {/* soft cloud shadows drifting across */}
      <g filter="url(#blur16)" style={{ mixBlendMode: 'multiply' }} opacity={0.5}>
        {[[220, 300, 520, 200], [900, 800, 640, 240], [1500, 160, 460, 170]].map(([cx, cy, rx, ry], i) => (
          <ellipse key={i} cx={((cx + t * (1.1 + i * 0.4) + 600) % 2900) - 500} cy={cy + Math.sin(t / 90 + i) * 14} rx={rx} ry={ry} fill="#2A2438" />
        ))}
      </g>
      <rect x={-20} y={-20} width={1960} height={1120} fill={`url(#${id}sun)`} style={{ mixBlendMode: 'screen' }} />
      <defs>
        <linearGradient id={`${id}sun`} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor="#FFB46A" stopOpacity={0.3} /><stop offset="60%" stopColor="#FFB46A" stopOpacity={0.05} /><stop offset="100%" stopColor="#6A4A8A" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* blurred tree crowns at two corners, swaying a little */}
      <Foreground blur={16}>
        {[[40, 40, 1], [1880, 1050, -1]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            {Array.from({ length: 9 }).map((_, k) => <circle key={k} cx={rnd(31 + i, k) * 300 - 20 + Math.sin(t / 40 + k) * 6} cy={rnd(32 + i, k) * 220 - 20} r={70 + rnd(33 + i, k) * 70} fill={k % 2 ? '#14281C' : '#0E1C14'} />)}
          </g>
        ))}
      </Foreground>
    </g>
  );
};

/**
 * Pip seen from straight above, lying on his back, head toward the top of the frame, arms out, happy, eyes up at the
 * camera. (x, y) is the hip; scale 1 makes him about 424 px from crown to toes. `t` breathes and sways the arms.
 */
export const LyingPipTop: React.FC<{ x: number; y: number; scale?: number; rot?: number; t?: number; blink?: number }> = ({ x, y, scale = 1, rot = 0, t = 0, blink = 0 }) => {
  const L = LOOKS.pipHood;
  const br = 1 + Math.sin(t / 14) * 0.012;
  const sw = Math.sin(t / 26) * 3;
  const limb = (d: string, w: number) => (
    <g>
      <path d={d} stroke={L.line} strokeWidth={w + 7} fill="none" strokeLinecap="round" />
      <path d={d} stroke={L.limb} strokeWidth={w} fill="none" strokeLinecap="round" />
    </g>
  );
  const hand = (hx: number, hy: number, a: number) => (
    <g transform={`translate(${hx} ${hy}) rotate(${a})`}>
      <ellipse cx={0} cy={0} rx={17} ry={14} fill={L.hand} stroke={L.line} strokeWidth={4} />
      <ellipse cx={-4} cy={-15} rx={6} ry={9} fill={L.hand} stroke={L.line} strokeWidth={3.5} />
    </g>
  );
  const eyeY = -194;
  const eye = (cx: number) => (
    <g>
      <ellipse cx={cx} cy={eyeY} rx={9} ry={Math.max(1.5, 12 * (1 - blink))} fill={L.face} />
      <circle cx={cx + 3} cy={eyeY - 4} r={3.2} fill="#fff" opacity={1 - blink} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      {/* shadow thrown down-right by the low sun */}
      <g filter="url(#blur10)" opacity={0.45} transform="translate(26 22)">
        <rect x={-48} y={-150} width={96} height={170} rx={30} fill="#000" /><circle cx={0} cy={-190} r={62} fill="#000" />
        <path d="M -150 -108 L 150 -108" stroke="#000" strokeWidth={34} strokeLinecap="round" /><path d="M -18 10 L -26 150 M 18 10 L 26 150" stroke="#000" strokeWidth={34} strokeLinecap="round" />
      </g>
      {/* legs, with the shoes pointing up at the sky */}
      {limb('M -17 8 L -28 140', 30)}
      {limb('M 17 8 L 28 140', 30)}
      {[-30, 30].map((sx) => <ellipse key={sx} cx={sx} cy={158} rx={21} ry={30} fill={L.shoe} stroke={L.line} strokeWidth={4} />)}
      {[-30, 30].map((sx) => <path key={`sl${sx}`} d={`M ${sx - 10} 140 Q ${sx} 134 ${sx + 10} 140`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.5} />)}
      {/* arms flung out */}
      {limb(`M -42 -118 L -150 ${-104 + sw}`, 28)}
      {limb(`M 42 -118 L 150 ${-104 - sw}`, 28)}
      {hand(-166, -104 + sw, -90)}
      {hand(166, -104 - sw, 90)}
      {/* the hood he is lying on, then the hoodie */}
      <ellipse cx={0} cy={-150} rx={66} ry={34} fill={L.jacketShade} stroke={L.line} strokeWidth={4} />
      <g transform={`scale(1 ${br})`}>
        <rect x={-50} y={-146} width={100} height={170} rx={34} fill={L.jacket} stroke={L.line} strokeWidth={4} />
        <path d="M 14 -140 L 46 -140 Q 54 -60 40 20 L 14 20 Z" fill={L.jacketShade} opacity={0.55} />
        <path d="M -34 -34 Q 0 -18 34 -34 L 38 6 Q 0 22 -38 6 Z" fill={L.jacketShade} stroke={L.line} strokeWidth={3} opacity={0.9} />
        <path d="M -14 -134 Q -18 -108 -14 -84 M 14 -134 Q 18 -108 14 -84" stroke={L.accent} strokeWidth={6} fill="none" strokeLinecap="round" />
        <circle cx={-14} cy={-82} r={6} fill={L.accent} /><circle cx={14} cy={-82} r={6} fill={L.accent} />
      </g>
      {/* the head: face up, happy, eyes up at us */}
      <circle cx={0} cy={-190} r={62} fill={L.skin} stroke={L.line} strokeWidth={4} />
      <path d="M 14 -132 A 62 62 0 0 0 60 -176 A 70 70 0 0 1 14 -132 Z" fill={L.skinShade} />
      <path d="M -6 -250 q 10 -26 30 -18 q -16 2 -14 16 q -8 -10 -16 2 Z" fill={L.hair} />
      <path d="M -46 -206 Q -34 -222 -20 -214 M 20 -214 Q 34 -222 46 -206" stroke={L.face} strokeWidth={5} fill="none" strokeLinecap="round" />
      {eye(-21)}
      {eye(21)}
      <ellipse cx={-38} cy={-168} rx={11} ry={7} fill="#F28C8C" opacity={0.45} /><ellipse cx={38} cy={-168} rx={11} ry={7} fill="#F28C8C" opacity={0.45} />
      <path d="M -20 -166 Q 0 -140 20 -166 Z" fill={L.face} />
      <path d="M -10 -158 Q 0 -150 10 -158" stroke="#E86A6A" strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  );
};
