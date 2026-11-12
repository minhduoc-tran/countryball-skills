import React from 'react';
import { FONT, rnd, clamp, easeOut } from '../../engine';

// Chapter B local props: the neon arcade. All pure functions of the shot clock t (frames).
//   <ArcadeBg t id />                         back wall with neon tubes, a row of game cabinets, carpet floor at y 800
//   <BoxingMachine x y s t digits? dim? ... /> coin-op boxing machine, punching pad sticking out to the LEFT, floor at y
//   <LedDisplay x y w h text color? on? />    a dark scoreboard window with glowing digits
//   <RecordBoard x y w t />                   "KỶ LỤC: 900" board
//   <SideWall x0 x1 hole t id />              brick wall slab (right of the room) with a ragged hole onto afternoon daylight

const INK = '#150E1F';
export const ARC_FLOOR = 800;

export const ArcadeBg: React.FC<{ t: number; id: string; dim?: number }> = ({ t, id, dim = 0 }) => {
  const k = Math.floor(t / 7);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B1038" />
          <stop offset="1" stopColor="#3B2166" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A1850" />
          <stop offset="1" stopColor="#110A22" />
        </linearGradient>
      </defs>
      <rect x={-400} y={-300} width={2800} height={ARC_FLOOR + 300} fill={`url(#${id}w)`} />
      {/* neon tubes */}
      {Array.from({ length: 11 }).map((_, i) => {
        const c = i % 2 ? '#33E0FF' : '#FF3DA8';
        const x = -300 + i * 250;
        const fl = 0.8 + 0.2 * Math.sin(t * 0.3 + i * 2);
        return (
          <g key={i} opacity={fl}>
            <rect x={x - 14} y={-200} width={28} height={ARC_FLOOR + 120} fill={c} opacity={0.14} />
            <rect x={x - 5} y={-200} width={10} height={ARC_FLOOR + 120} fill={c} opacity={0.9} />
          </g>
        );
      })}
      {/* neon sign */}
      <g transform="translate(560 190)">
        <rect x={-250} y={-62} width={500} height={112} rx={24} fill="#0B0618" stroke="#FF3DA8" strokeWidth={8} />
        <text x={0} y={22} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={78} fill="#FF7BC8" stroke="#FF3DA8" strokeWidth={3} opacity={0.75 + 0.25 * Math.sin(t * 0.9)}>TRÒ CHƠI</text>
      </g>
      {/* back row of game cabinets */}
      {Array.from({ length: 12 }).map((_, i) => {
        const x = -280 + i * 230;
        const hue = ['#33E0FF', '#FFD23F', '#FF3DA8', '#7CFF8A'][Math.floor(rnd(5 + k * 0.0 + i, 1) * 4)];
        const scr = rnd(k + i * 3, 2) > 0.2 ? hue : '#2B2150';
        return (
          <g key={i}>
            <path d={`M ${x} ${ARC_FLOOR} V 470 L ${x + 30} 430 H ${x + 150} L ${x + 180} 470 V ${ARC_FLOOR} Z`} fill="#1A1030" stroke={INK} strokeWidth={6} />
            <rect x={x + 26} y={490} width={128} height={110} rx={10} fill={scr} stroke={INK} strokeWidth={5} opacity={0.9} />
            <rect x={x + 22} y={625} width={136} height={40} fill="#2B2150" stroke={INK} strokeWidth={4} />
            <circle cx={x + 50} cy={645} r={9} fill="#FF3B3B" />
            <circle cx={x + 82} cy={645} r={9} fill="#FFD23F" />
            <circle cx={x + 114} cy={645} r={9} fill="#33E0FF" />
          </g>
        );
      })}
      {/* carpet floor */}
      <rect x={-400} y={ARC_FLOOR} width={2800} height={600} fill={`url(#${id}f)`} />
      <rect x={-400} y={ARC_FLOOR} width={2800} height={8} fill="#FF3DA8" opacity={0.7} />
      {Array.from({ length: 26 }).map((_, i) => (
        <circle key={i} cx={-300 + rnd(8, i) * 2600} cy={ARC_FLOOR + 30 + rnd(9, i) * 280} r={4 + rnd(10, i) * 5} fill={['#33E0FF', '#FF3DA8', '#FFD23F'][i % 3]} opacity={0.55} />
      ))}
      {dim > 0 ? <rect x={-400} y={-300} width={2800} height={1800} fill="#05020C" opacity={dim} /> : null}
    </g>
  );
};

export const LedDisplay: React.FC<{ x: number; y: number; w: number; h: number; text: string; color?: string; on?: number; label?: string }> = ({
  x, y, w, h, text, color = '#FF4A3D', on = 1, label,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h * 0.14} fill="#07040C" stroke={INK} strokeWidth={Math.max(4, h * 0.05)} />
    <rect x={-w / 2 + 6} y={-h / 2 + 6} width={w - 12} height={h - 12} rx={h * 0.1} fill="none" stroke="#2D2442" strokeWidth={3} />
    {on > 0 ? (
      <g opacity={on}>
        <text x={0} y={h * 0.26} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={h * (label ? 0.62 : 0.72)} fill={color} stroke={color} strokeWidth={h * 0.04} opacity={0.35}>{text}</text>
        <text x={0} y={h * 0.26} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={h * (label ? 0.62 : 0.72)} fill={color}>{text}</text>
      </g>
    ) : null}
    {label ? <text x={-w / 2 + 16} y={-h / 2 + h * 0.2} fontFamily={FONT.ui} fontSize={h * 0.17} fill="#B9A9E0" opacity={on > 0 ? 0.9 : 0.2}>{label}</text> : null}
  </g>
);

/** The coin-op boxing machine. x = centre, y = floor line, s = scale (1 = 780 tall); the pad centre is at (x - 215 s, y - 420 s). */
export const BoxingMachine: React.FC<{ x: number; y: number; s?: number; t?: number; rot?: number; padPush?: number; text?: string; textColor?: string; displayOn?: number; flash?: number; label?: string; shadow?: boolean }> = ({
  x, y, s = 1, rot = 0, padPush = 0, text = '000', textColor = '#FF4A3D', displayOn = 1, flash = 0, label = 'ĐIỂM', shadow = true,
}) => (
  <g>
    {shadow ? <ellipse cx={x} cy={y + 8} rx={190 * s} ry={20 * s} fill="#000" opacity={0.4} /> : null}
    <g transform={`translate(${x} ${y}) rotate(${rot} 0 0) scale(${s})`}>
      {/* base cabinet */}
      <path d="M -160 0 V -300 H 160 V 0 Z" fill="#273B8A" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      <rect x={-160} y={-300} width={320} height={26} fill="#3E57C2" stroke={INK} strokeWidth={6} />
      <rect x={90} y={-220} width={56} height={92} rx={8} fill="#0B0618" stroke={INK} strokeWidth={5} />
      <rect x={106} y={-200} width={24} height={8} fill="#FFD23F" />
      <rect x={-140} y={-240} width={150} height={150} rx={14} fill="#1B2766" stroke={INK} strokeWidth={5} />
      <text x={-65} y={-150} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#FFD23F">ĐẤM</text>
      <text x={-65} y={-108} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#FF3DA8">BỐC</text>
      <rect x={-160} y={-40} width={320} height={40} fill="#14204F" stroke={INK} strokeWidth={6} />
      {/* neck */}
      <rect x={-92} y={-540} width={184} height={250} fill="#2F46A8" stroke={INK} strokeWidth={9} />
      {/* arm + pad (sticks out left) */}
      <rect x={-250} y={-444 - 0} width={170} height={48} rx={18} fill="#8A91B8" stroke={INK} strokeWidth={7} />
      <g transform={`translate(${-215 + padPush * 40} -420)`}>
        <ellipse cx={0} cy={0} rx={62 - padPush * 12} ry={112} fill="#E5322D" stroke={INK} strokeWidth={9} />
        <ellipse cx={-6} cy={0} rx={36} ry={72} fill="#FF6A55" opacity={0.85} />
        <ellipse cx={-14} cy={-40} rx={12} ry={30} fill="#FFFFFF" opacity={0.35} />
      </g>
      {/* head with display */}
      <path d="M -190 -540 H 190 V -720 Q 190 -780 130 -780 H -130 Q -190 -780 -190 -720 Z" fill="#35439B" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      <LedDisplay x={0} y={-648} w={290} h={118} text={text} color={textColor} on={displayOn} label={label} />
      {Array.from({ length: 7 }).map((_, i) => (
        <circle key={i} cx={-150 + i * 50} cy={-748} r={9} fill={i % 2 ? '#FFD23F' : '#FF3DA8'} stroke={INK} strokeWidth={3} opacity={0.5 + 0.5 * Math.round(flash * 0 + ((i + (flash > 0 ? 1 : 0)) % 2))} />
      ))}
    </g>
  </g>
);

/** The record board: a wall plaque "KỶ LỤC: 900" with a gold frame and a blinking trophy lamp. */
export const RecordBoard: React.FC<{ x: number; y: number; w?: number; t: number; pop?: number }> = ({ x, y, w = 560, t, pop = 1 }) => {
  const s = w / 560;
  const p = pop >= 1 ? 1 : easeOut(clamp(pop));
  return (
    <g transform={`translate(${x} ${y}) scale(${s * p})`}>
      <rect x={-290} y={-120} width={580} height={240} rx={26} fill="#0B0618" stroke="#FFD23F" strokeWidth={12} />
      <rect x={-270} y={-100} width={540} height={200} rx={16} fill="none" stroke="#FF3DA8" strokeWidth={4} opacity={0.8} />
      <text x={0} y={-34} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={74} fill="#FFD23F" stroke={INK} strokeWidth={6} paintOrder="stroke">KỶ LỤC:</text>
      <text x={0} y={72} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={118} fill="#FF4A3D" stroke="#FF4A3D" strokeWidth={4} opacity={0.9}>900</text>
      <g transform="translate(-232 -46)" opacity={0.6 + 0.4 * Math.sin(t * 0.6)}>
        <path d="M -20 -22 H 20 V 0 Q 20 20 0 24 Q -20 20 -20 0 Z M 0 24 V 40 M -14 40 H 14" fill="#FFD23F" stroke={INK} strokeWidth={4} />
      </g>
    </g>
  );
};

/** Hole outline (ragged polygon points) in the side wall at open amount `hole` 0..1. */
export const wallHolePts = (x0: number, x1: number, hole: number, cy = 520) => {
  const R = 40 + 230 * easeOut(clamp(hole));
  return Array.from({ length: 16 }).map((_, i) => {
    const a = (i / 16) * Math.PI * 2;
    const r = R * (i % 2 ? 0.74 : 1) * (0.85 + 0.3 * rnd(41, i));
    return [(x0 + x1) / 2 + Math.cos(a) * r * 0.6, cy + Math.sin(a) * r * 1.2] as [number, number];
  });
};

/** Brick side wall slab x0..x1 (right of the room): intact at hole 0, a ragged hole onto afternoon daylight at hole 1. */
export const SideWall: React.FC<{ x0: number; x1: number; hole: number; id: string; cy?: number }> = ({ x0, x1, hole, id, cy = 520 }) => {
  const pts = wallHolePts(x0, x1, hole, cy).map((p) => p.join(',')).join(' ');
  const d = `M ${x0} -300 H ${x1} V 1100 H ${x0} Z` + (hole > 0 ? ' M ' + pts.split(' ').join(' L ') + ' Z' : '');
  return (
    <g>
      <defs>
        <clipPath id={`${id}wc`}><polygon points={pts} /></clipPath>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8EDBFF" /><stop offset="1" stopColor="#FFE9B0" /></linearGradient>
      </defs>
      {hole > 0 ? (
        <g clipPath={`url(#${id}wc)`}>
          <rect x={x0 - 40} y={-200} width={x1 - x0 + 900} height={1400} fill={`url(#${id}sky)`} />
          <circle cx={x1 + 140} cy={cy - 140} r={90} fill="#FFF6C8" />
          <rect x={x0 - 40} y={cy + 190} width={x1 - x0 + 900} height={500} fill="#CDBFA6" />
          <polygon points={`${x1 + 20},${cy + 190} ${x1 + 160},${cy + 40} ${x1 + 300},${cy + 190}`} fill="#E8C9A0" />
        </g>
      ) : null}
      <path d={d} fillRule="evenodd" fill="#B2685A" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      {Array.from({ length: 9 }).map((_, i) => (
        <path key={i} d={`M ${x0} ${-200 + i * 140} H ${x1}`} stroke="#7A3E34" strokeWidth={4} opacity={0.6} />
      ))}
      {hole > 0 ? <polygon points={pts} fill="none" stroke="#FFF3C4" strokeWidth={5} opacity={0.6} /> : null}
    </g>
  );
};

/** The arcade seen from the street (daylight): sign band, big window, open door at x 1000-1300, a wall on the right where a hole (0..1) can open at (1560, 470). Pavement from y 800. */
export const ArcadeFront: React.FC<{ t: number; id: string; hole?: number; doorGlow?: number }> = ({ t, id, hole = 0, doorGlow = 1 }) => {
  const cx = 1560;
  const cy = 470;
  const R = 50 + 250 * easeOut(clamp(hole));
  const pts = Array.from({ length: 16 }).map((_, i) => {
    const a = (i / 16) * Math.PI * 2;
    const r = R * (i % 2 ? 0.74 : 1) * (0.85 + 0.3 * rnd(52, i));
    return `${cx + Math.cos(a) * r * 0.8},${cy + Math.sin(a) * r}`;
  });
  const wall = 'M -100 140 H 2020 V 800 H -100 Z' + (hole > 0 ? ' M ' + pts.join(' L ') + ' Z' : '');
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sk`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7FD0FF" /><stop offset="1" stopColor="#FFEBC2" /></linearGradient>
        <clipPath id={`${id}hc`}><polygon points={pts.join(' ')} /></clipPath>
      </defs>
      <rect x={-100} y={-100} width={2200} height={920} fill={`url(#${id}sk)`} />
      <circle cx={260} cy={90} r={70} fill="#FFF6C8" opacity={0.9} />
      {/* interior seen through the hole */}
      {hole > 0 ? (
        <g clipPath={`url(#${id}hc)`}>
          <rect x={cx - 400} y={cy - 400} width={800} height={800} fill="#2A1850" />
          <rect x={cx - 400} y={cy + 200} width={800} height={300} fill="#150C2A" />
          {[-240, -60, 130].map((dx, i) => <rect key={i} x={cx + dx} y={cy - 60} width={110} height={300} fill={i % 2 ? '#33E0FF' : '#FF3DA8'} opacity={0.5} />)}
        </g>
      ) : null}
      <path d={wall} fillRule="evenodd" fill="#F0DDB8" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      {hole > 0 ? <polygon points={pts.join(' ')} fill="none" stroke="#B89A6A" strokeWidth={10} strokeLinejoin="round" /> : null}
      {/* sign band */}
      <rect x={-100} y={140} width={2220} height={150} fill="#2A1850" stroke={INK} strokeWidth={8} />
      <text x={960} y={252} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={118} fill="#FF7BC8" stroke="#FF3DA8" strokeWidth={4} opacity={0.8 + 0.2 * Math.sin(t * 0.7)}>TRÒ CHƠI</text>
      {/* window */}
      <rect x={120} y={360} width={600} height={360} rx={14} fill="#2A1850" stroke={INK} strokeWidth={9} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={160 + i * 140} y={440 + (i % 2) * 20} width={100} height={280 - (i % 2) * 20} fill={['#33E0FF', '#FF3DA8', '#FFD23F', '#7CFF8A'][i]} opacity={0.55} />)}
      <path d="M 120 360 L 330 360 L 140 720 L 120 720 Z" fill="#FFFFFF" opacity={0.14} />
      {/* door */}
      <rect x={1000} y={380} width={300} height={420} fill="#1B1038" stroke={INK} strokeWidth={9} />
      <rect x={1020} y={400} width={260} height={400} fill="#4A2A86" opacity={doorGlow} />
      <circle cx={1150} cy={640} r={240} fill="#FF3DA8" opacity={0.16 * doorGlow} style={{ mixBlendMode: 'screen' }} />
      {/* pavement */}
      <rect x={-100} y={800} width={2200} height={400} fill="#BDB2A2" />
      <rect x={-100} y={800} width={2200} height={12} fill="#7C7266" />
      {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M ${-100 + i * 180} 812 L ${-160 + i * 220} 1100`} stroke="#9C9283" strokeWidth={4} />)}
    </g>
  );
};
