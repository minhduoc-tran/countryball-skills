import React from 'react';
import { LOOKS, Look, Pose, FONT, rnd, Glow, LightVeil, Dust, DuskSky, Sun, PaperBall, PizzaBox, BEDROOM, makeRoom, RoomShell, Pendant, pendantLight, WallFrame, FloorShadow, Box } from '../../engine';
import { HeadOverlay } from './kit-cast-figures';
import { PAL } from './kit-palette';

// Chapter A props (2/2): places and body extras. Pure functions of t. World units unless said.
//   PIP_SUIT / PIP_SUIT_BLUE  Pip in a charcoal suit (combed hair dark / dyed blue): the pool gag.
//   <Belly pose k />           a round belly bulging out of Pip's hoodie (k 0..1), drawn after the Hero.
//   <PartyHat pose />          a striped cone hat with a pom-pom on the rig's head.
//   <BedroomMess o />          night-before mess on Pip's floor (clothes, pizza box, paper balls); o fades it out.
//   <Balcony t id />           the neighbour's balcony from below (low angle): a shophouse front, the ledge at y 470
//                              (x 520-1500), railing, shutters, a hanging plant, the morning sky. Put the cat and
//                              FlowerPot on BALCONY_LEDGE.
//   <PoolSide t id />          a hotel pool at dusk: sky, sun, palms, the tiled edge at y 690, water below it.
//   <Restaurant t id />        a warm restaurant room (room kit): menu board, pendants, a long table across at y 760.
//   <Dish x y s kind />        one dish (0 phở bowl, 1 rice plate, 2 spring rolls, 3 cake, 4 empty plate).
//   <CalPage x y w day rot? /> a single tear-off calendar page (paper only), x y top centre.

export const PIP_SUIT: Look = { ...LOOKS.suit, skin: LOOKS.pipHood.skin, skinShade: LOOKS.pipHood.skinShade, hand: LOOKS.pipHood.hand, accent: '#D9A43A', hair: '#1E1A22' };
export const PIP_SUIT_BLUE: Look = { ...PIP_SUIT, hair: '#2F9BFF' };

export const Belly: React.FC<{ pose: Pose; k: number }> = ({ pose, k }) => {
  if (k <= 0.01) return null;
  const L = LOOKS.pipHood;
  const s = pose.scale;
  const r = 20 + 46 * k;
  const dx = (pose.yaw >= 0 ? 1 : -1) * (14 + 26 * k) * Math.min(1, Math.abs(pose.yaw) + 0.3);
  return (
    <g transform={`translate(${pose.x} ${pose.y}) scale(${s}) rotate(${pose.tilt})`} filter="url(#rimR)">
      <ellipse cx={dx} cy={-44} rx={r} ry={r * 0.95} fill={L.jacket} stroke={L.line} strokeWidth={4} />
      <path d={`M ${dx - r * 0.5} ${-44 - r * 0.6} Q ${dx + r * 0.2} ${-44 - r * 0.9} ${dx + r * 0.8} ${-44 - r * 0.3}`} stroke="#FFC98A" strokeWidth={3} fill="none" opacity={0.5} />
    </g>
  );
};

export const PartyHat: React.FC<{ pose: Pose }> = ({ pose }) => (
  <HeadOverlay pose={pose}>
    <g transform="translate(6 -236) rotate(12)">
      <path d="M -40 10 L 0 -96 L 40 10 Z" fill="#E8553E" stroke="#14121C" strokeWidth={4} strokeLinejoin="round" />
      <path d="M -26 -26 L 22 -14 M -14 -58 L 12 -50" stroke="#FFD04D" strokeWidth={9} />
      <circle cx={0} cy={-100} r={13} fill="#5FB4FF" stroke="#14121C" strokeWidth={3} />
    </g>
  </HeadOverlay>
);

export const BedroomMess: React.FC<{ o?: number }> = ({ o = 1 }) => {
  if (o <= 0) return null;
  const { P } = BEDROOM;
  const shirt = P(0.5, 1, 0.6);
  const sock = P(0.66, 1, 0.72);
  const box = P(0.73, 1, 0.5);
  return (
    <g opacity={o}>
      <g transform={`translate(${box.x} ${box.y})`}><PizzaBox x={0} y={0} w={170} lid={false} /></g>
      <path d={`M ${shirt.x - 90} ${shirt.y} q 20 -40 70 -30 q 30 -30 70 -6 q 40 6 40 36 Z`} fill="#B8483E" stroke="#14121C" strokeWidth={4} />
      <path d={`M ${sock.x - 40} ${sock.y} q 10 -20 40 -18 l 30 -10 q 12 14 -6 26 Z`} fill="#E9E2D2" stroke="#14121C" strokeWidth={3} />
      {[[0.44, 0.68], [0.58, 0.8], [0.8, 0.66], [0.62, 0.52]].map(([u, w], i) => {
        const p = P(u, 1, w);
        return <PaperBall key={i} x={p.x} y={p.y - 14} r={18 + 4 * (i % 2)} rot={i * 50} />;
      })}
      {/* a toppled chair cushion and a mug on the floor */}
      <ellipse cx={P(0.36, 1, 0.66).x} cy={P(0.36, 1, 0.66).y - 10} rx={60} ry={20} fill="#2F6E69" />
    </g>
  );
};

export const BALCONY_LEDGE = { x0: 520, x1: 1500, y: 470 };

export const Balcony: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const B = BALCONY_LEDGE;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7FA8D8" />
          <stop offset="1" stopColor="#FFD9A0" />
        </linearGradient>
      </defs>
      <rect x={-200} y={-200} width={2320} height={1480} fill={`url(#${id}sky)`} />
      <Sun x={1640} y={170} r={70} t={t} rays />
      {/* the shophouse front, seen from below: it leans in toward the top (low angle) */}
      <polygon points="300,1180 1720,1180 1600,-60 420,-60" fill="#C9A15E" />
      <polygon points="1720,1180 1600,-60 1660,-60 1800,1180" fill="#9A7442" />
      {/* the window and door behind the balcony, shutters green */}
      <rect x={700} y={60} width={520} height={400} fill="#2A2028" />
      {[0, 1].map((k) => <rect key={k} x={700 + k * 262} y={60} width={258} height={400} fill="#3F7A5A" stroke="#24402F" strokeWidth={6} />)}
      {Array.from({ length: 12 }).map((_, k) => <path key={k} d={`M 710 ${80 + k * 32} L 1210 ${80 + k * 32}`} stroke="#2E5C42" strokeWidth={5} />)}
      {/* the ledge slab, the railing, a hanging plant */}
      <polygon points={`${B.x0 - 40},${B.y} ${B.x1 + 40},${B.y} ${B.x1 + 70},${B.y + 70} ${B.x0 - 70},${B.y + 70}`} fill="#8A8478" />
      <polygon points={`${B.x0 - 70},${B.y + 70} ${B.x1 + 70},${B.y + 70} ${B.x1 + 60},${B.y + 96} ${B.x0 - 60},${B.y + 96}`} fill="#5E584E" />
      <path d={`M ${B.x0 - 40} ${B.y} L ${B.x1 + 40} ${B.y}`} stroke="#FFE2B0" strokeWidth={4} opacity={0.7} />
      <path d={`M ${B.x0 - 30} ${B.y - 210} L ${B.x0 + 160} ${B.y - 210} M ${B.x1 - 160} ${B.y - 210} L ${B.x1 + 30} ${B.y - 210}`} stroke="#2A2630" strokeWidth={10} />
      {Array.from({ length: 7 }).map((_, k) => <path key={k} d={`M ${B.x0 - 30 + k * 32} ${B.y} L ${B.x0 - 30 + k * 32} ${B.y - 210} M ${B.x1 + 30 - k * 32} ${B.y} L ${B.x1 + 30 - k * 32} ${B.y - 210}`} stroke="#2A2630" strokeWidth={6} />)}
      <g transform={`translate(1380 ${B.y + 96}) rotate(${Math.sin(t / 16) * 4})`}>
        <path d="M 0 0 L 0 60" stroke="#3A3036" strokeWidth={3} />
        <path d="M -30 60 L 30 60 L 22 100 L -22 100 Z" fill="#B8604A" />
        {[-24, -8, 8, 24].map((dx, k) => <path key={k} d={`M ${dx} 96 q ${dx * 0.4} 50 ${dx * 0.2} ${90 + k * 14}`} stroke="#4E7350" strokeWidth={8} fill="none" strokeLinecap="round" />)}
      </g>
      {/* a power cable across the sky, and a second balcony edge lower down */}
      <path d="M -100 120 Q 500 200 2000 90" stroke="#1E1A22" strokeWidth={5} fill="none" />
      <rect x={300} y={1000} width={1420} height={30} fill="#7A7468" />
      <Glow x={1640} y={170} r={600} o={0.45} />
      <LightVeil id={`${id}v`} lights={[[1500, 220, 700], [960, 470, 600]]} o={0.3} />
    </g>
  );
};

export const PoolSide: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <DuskSky id={`${id}sky`} horizonY={560} />
    <Sun x={1420} y={470} r={110} t={t} rays />
    {/* the hotel block and palms behind the pool */}
    <rect x={160} y={250} width={620} height={330} fill="#3A2E4E" />
    {Array.from({ length: 24 }).map((_, i) => <rect key={i} x={190 + (i % 8) * 74} y={280 + Math.floor(i / 8) * 90} width={44} height={50} fill={rnd(3, i) > 0.4 ? '#FFC27A' : '#2A2240'} opacity={0.85} />)}
    {[[880, 1], [1680, -1]].map(([x, f], k) => (
      <g key={k}>
        <path d={`M ${x} 600 Q ${x + 20 * f} 450 ${x - 10 * f} 300`} stroke="#4A3428" strokeWidth={24} fill="none" />
        {[-150, -110, -60, -20, 20, 60, 110, 150].map((deg, j) => {
          // a fronds fan: each leaf a long curved blade, dark green with a lighter rim, swaying
          const a = ((deg - 90 + Math.sin(t / 14 + j) * 4) * Math.PI) / 180;
          const L = 190 - Math.abs(deg) * 0.3;
          const tx = Math.cos(a) * L;
          const ty = Math.sin(a) * L + Math.abs(deg) * 0.9;
          return <path key={j} d={`M ${x - 10 * f} 300 Q ${x - 10 * f + tx * 0.5} ${300 + ty * 0.5 - 40} ${x - 10 * f + tx} ${300 + ty} Q ${x - 10 * f + tx * 0.5} ${300 + ty * 0.5 - 4} ${x - 10 * f} 306 Z`} fill={j % 2 ? '#2E5A3C' : '#3E7048'} stroke="#1E3626" strokeWidth={3} />;
        })}
      </g>
    ))}
    {/* the deck, the tiled pool edge, the water */}
    <rect x={-200} y={560} width={2320} height={130} fill="#B89A82" />
    {Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M ${-200 + i * 80} 560 L ${-260 + i * 90} 690`} stroke="#9A7E6A" strokeWidth={3} />)}
    <rect x={-200} y={686} width={2320} height={22} fill="#E9E2D2" />
    <defs>
      <linearGradient id={`${id}wat`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4FC3D9" />
        <stop offset="1" stopColor="#1E6A8A" />
      </linearGradient>
    </defs>
    <rect x={-200} y={708} width={2320} height={600} fill={`url(#${id}wat)`} />
    {Array.from({ length: 12 }).map((_, i) => {
      const y = 740 + i * 34;
      return <path key={i} d={`M ${-100 + ((i * 173 + t * 3) % 300)} ${y} q 60 -10 120 0 q 60 10 120 0`} stroke="#BDF3FF" strokeWidth={4} fill="none" opacity={0.5} />;
    })}
    {/* a sun lounger with a towel */}
    <path d="M 1100 640 L 1400 640 L 1460 590" stroke="#F6EFE3" strokeWidth={14} fill="none" strokeLinejoin="round" />
    <path d="M 1120 640 L 1110 680 M 1380 640 L 1390 680" stroke="#7A6A5A" strokeWidth={8} />
    <rect x={1180} y={626} width={120} height={16} fill="#E8553E" />
    <Glow x={1420} y={470} r={700} o={0.5} />
    <Glow x={1400} y={760} r={500} o={0.25} />
  </g>
);

export const REST = makeRoom({ x: 960, y: 480 }, { x0: 380, x1: 1540, y0: 220, y1: 720 }, 3.2);
export const Restaurant: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const R = REST;
  return (
    <g>
      <RoomShell r={R} id={id} floor="tiles" wall="#5A3A34" side="#46302C" floorC="#3A2A26" />
      {/* the menu board on the back wall: chalk lines under a header */}
      <rect x={760} y={270} width={400} height={300} rx={10} fill="#1E2420" stroke="#5A3A24" strokeWidth={12} />
      <text x={960} y={330} textAnchor="middle" fontFamily={FONT.hand} fontSize={48} fill="#F6EFE3">THỰC ĐƠN</text>
      {Array.from({ length: 6 }).map((_, k) => <path key={k} d={`M 800 ${370 + k * 32} L ${1000 + rnd(9, k) * 100} ${370 + k * 32} M 1080 ${370 + k * 32} L 1120 ${370 + k * 32}`} stroke="#E9E2D2" strokeWidth={6} opacity={0.7} strokeLinecap="round" />)}
      <WallFrame x={480} y={300} w={150} h={190} art={1} />
      <WallFrame x={1300} y={300} w={150} h={190} art={2} />
      {/* lanterns along the top */}
      {[0.2, 0.4, 0.6, 0.8].map((u, k) => {
        const p = R.P(u, 0.08, 0.2);
        return <g key={k} transform={`translate(${p.x} ${p.y + Math.sin(t / 12 + k) * 3})`}><path d="M 0 -40 L 0 0" stroke="#2A1E1C" strokeWidth={3} /><ellipse cx={0} cy={26} rx={30} ry={36} fill="#E8553E" /><rect x={-14} y={-6} width={28} height={8} fill="#C9A44A" /></g>;
      })}
      <Pendant r={R} u={0.5} w={0.45} t={t} />
      <FloorShadow r={R} u={[0.1, 0.25]} w={[0.1, 0.3]} />
      <Box r={R} u={[0.1, 0.25]} v={[0.72, 1]} w={[0.1, 0.3]} front="#6A4232" top="#7E5040" side="#4A2E24" />
      <LightVeil id={`${id}v`} lights={[pendantLight(R, 0.5, 0.45), [960, 420, 380], ...[0.2, 0.4, 0.6, 0.8].map((u): [number, number, number] => [R.P(u, 0.08, 0.2).x, R.P(u, 0.08, 0.2).y + 26, 120])]} o={0.42} />
      {[0.2, 0.4, 0.6, 0.8].map((u, k) => <Glow key={k} x={R.P(u, 0.08, 0.2).x} y={R.P(u, 0.08, 0.2).y + 26} r={120} o={0.5} />)}
      <Dust t={t} seed={17} x0={700} y0={400} w={520} h={400} n={16} o={0.4} />
    </g>
  );
};

export const Dish: React.FC<{ x: number; y: number; s?: number; kind: number }> = ({ x, y, s = 1, kind }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={4} cy={6} rx={70} ry={14} fill="#000" opacity={0.35} />
    {kind === 0 ? (
      <g>
        <path d="M -60 -30 Q -56 20 0 22 Q 56 20 60 -30 Z" fill="#F4F1EA" stroke="#14121C" strokeWidth={4} />
        <ellipse cx={0} cy={-30} rx={60} ry={14} fill="#D9A45A" stroke="#14121C" strokeWidth={4} />
        <path d="M -30 -32 q 10 -6 20 0 q 10 6 20 0" stroke="#F6EFE3" strokeWidth={5} fill="none" />
        <circle cx={22} cy={-34} r={7} fill="#4E7350" />
        {[0, 1].map((k) => <path key={k} d={`M ${-10 + k * 16} -46 q 6 -20 -2 -40`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.35} />)}
      </g>
    ) : (
      <g>
        <ellipse cx={0} cy={0} rx={68} ry={18} fill="#F4F1EA" stroke="#14121C" strokeWidth={4} />
        {kind === 1 ? <ellipse cx={0} cy={-8} rx={40} ry={16} fill="#F6EFE3" stroke="#D9D1BE" strokeWidth={3} /> : null}
        {kind === 2 ? [-24, 0, 24].map((dx) => <rect key={dx} x={dx - 10} y={-24} width={20} height={26} rx={8} fill="#D98A3A" stroke="#8A4E1E" strokeWidth={3} />) : null}
        {kind === 3 ? <g><path d="M -34 -6 L -34 -40 L 34 -40 L 34 -6 Z" fill="#F7C8D8" stroke="#14121C" strokeWidth={4} /><circle cx={0} cy={-46} r={9} fill="#E8553E" /></g> : null}
      </g>
    )}
  </g>
);

export const CalPage: React.FC<{ x: number; y: number; w: number; day?: string; rot?: number; o?: number }> = ({ x, y, w, day = 'THỨ TƯ', rot = 0, o = 1 }) => {
  const h = w * 1.3;
  const [a, b] = day.split(' ');
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
      <rect x={-w / 2} y={0} width={w} height={h} fill={PAL.paper} stroke="#B9B0A0" strokeWidth={2} />
      <rect x={-w / 2} y={0} width={w} height={h * 0.16} fill="#C8382E" />
      <text x={0} y={h * 0.36} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={w * 0.2} fill="#C8382E" letterSpacing={2}>{a}</text>
      <text x={0} y={h * 0.36 + w * 0.36 * 1.02} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={w * 0.36} fill="#C8382E">{b}</text>
      <path d={`M ${-w * 0.3} ${h * 0.9} L ${w * 0.3} ${h * 0.9}`} stroke="#B9B0A0" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

/** A spoon held at a hand point (x, y), pointing up-right; `full` puts rice/porridge in the bowl of it. */
export const Spoon: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = -40 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-6} y={-70} width={12} height={80} rx={6} fill="#D9D6E0" stroke="#14121C" strokeWidth={3} />
    <ellipse cx={0} cy={-88} rx={20} ry={26} fill="#E6E4EC" stroke="#14121C" strokeWidth={3} />
    <ellipse cx={0} cy={-92} rx={13} ry={14} fill="#F4EEDF" />
  </g>
);

