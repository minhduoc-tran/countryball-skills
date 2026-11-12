import React from 'react';
import { rnd, clamp, easeOut, backOut, DuskSky, Sun, Glow, LightVeil, FONT } from '../../engine';

// Chapter B's own props, drawn in the engine's style (flat fills, a darker side away from the light, a warm rim on the
// lit edge, a contact shadow): the hallway with the front door, a boombox with pulsing rings, a shop-window bed,
// a high-rise facade for the neighbour's window, flying pillows, birds on a cable, chalk writing and a few particles.

const RIM = '#FFC98A';

// ---------- the front door: an interior wall, an open door onto the bright dusk, a coat hook, trainers, a mat ----------
export const HallDoor: React.FC<{ id: string; t: number }> = ({ id, t }) => (
  <g>
    <rect x={-200} y={-100} width={2320} height={1300} fill="#3A3048" />
    <rect x={-200} y={-100} width={2320} height={130} fill="#2C2438" />
    {/* the doorway onto the evening */}
    <clipPath id={`${id}clip`}><rect x={1010} y={150} width={420} height={640} /></clipPath>
    <g clipPath={`url(#${id}clip)`}>
      <g transform="translate(1010 150) scale(0.35 0.6)"><DuskSky id={`${id}sky`} horizonY={760} /></g>
      <Sun x={1180} y={560} r={70} t={t} />
      <path d="M 1010 640 L 1070 560 L 1120 600 L 1190 520 L 1250 590 L 1330 540 L 1430 620 L 1430 790 L 1010 790 Z" fill="#5A3A66" />
      <rect x={1010} y={700} width={420} height={90} fill="#2A2234" />
    </g>
    <rect x={1000} y={140} width={440} height={660} fill="none" stroke="#1E1828" strokeWidth={24} />
    <rect x={1000} y={140} width={440} height={660} fill="none" stroke="#FFC98A" strokeWidth={3} opacity={0.45} />
    {/* the door leaf swung open toward us */}
    <polygon points="1010,150 880,190 880,820 1010,790" fill="#6A4A56" />
    <polygon points="1010,150 1000,150 1000,790 1010,790" fill="#FFC98A" opacity={0.5} />
    <polygon points="880,190 905,196 905,812 880,820" fill="#000" opacity={0.25} />
    <circle cx={896} cy={520} r={9} fill="#D9B070" />
    {/* wall hooks with a jacket, a bag */}
    <rect x={460} y={330} width={220} height={14} rx={6} fill="#2A2234" />
    <path d="M 520 344 L 520 520 Q 520 560 550 560 L 610 560 Q 640 560 640 520 L 640 344 Z" fill="#B8483E" />
    <path d="M 520 344 L 520 520 Q 520 560 550 560 L 570 560 L 570 344 Z" fill="#000" opacity={0.18} />
    <path d="M 640 344 L 640 520" stroke={RIM} strokeWidth={3} opacity={0.4} />
    {/* floor, a mat and trainers */}
    <rect x={-200} y={800} width={2320} height={500} fill="#241D2E" />
    <rect x={-200} y={800} width={2320} height={5} fill="#FFC98A" opacity={0.3} />
    <polygon points="1010,800 1430,800 1700,1080 760,1080" fill="#FFC98A" opacity={0.12} style={{ mixBlendMode: 'screen' }} />
    <rect x={1060} y={846} width={320} height={64} rx={10} fill="#4A3A5A" />
    {[[560, 868, 1], [660, 884, -1]].map(([x, y, f], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${f} 1)`}>
        <ellipse cx={4} cy={14} rx={64} ry={9} fill="#000" opacity={0.4} />
        <path d="M -56 12 L -56 -14 Q -50 -34 -30 -34 L 4 -22 Q 30 -18 56 -2 L 58 12 Z" fill={i ? '#2F8F86' : '#D9A441'} />
        <rect x={-58} y={8} width={118} height={10} rx={4} fill="#EDE6D6" />
      </g>
    ))}
    <Glow x={1220} y={470} r={620} o={0.55} />
    <LightVeil id={`${id}veil`} lights={[[1220, 470, 560]]} o={0.4} />
  </g>
);

// ---------- a checkout lane seen from the side: belt, register, lane light, a stack of baskets, all empty ----------
export const CheckoutLane: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={470} ry={20} fill="#000" opacity={0.4} />
    <rect x={-440} y={-300} width={620} height={300} rx={10} fill="#3C6A92" />
    <rect x={-440} y={-300} width={190} height={300} rx={10} fill="#000" opacity={0.18} />
    <rect x={-440} y={-300} width={620} height={14} rx={6} fill="#FFC98A" opacity={0.5} />
    <rect x={-400} y={-250} width={540} height={14} fill="#F6D04D" opacity={0.85} />
    {/* the belt, with its rollers */}
    <rect x={-470} y={-330} width={690} height={40} rx={14} fill="#1E1E26" />
    <rect x={-470} y={-330} width={690} height={8} rx={4} fill="#4A4A58" />
    {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={-452 + ((i * 44 + t * 1.4) % 660)} y={-326} width={5} height={30} fill="#2E2E3A" />)}
    {/* the till, with its screen and the scanner's red line */}
    <rect x={20} y={-420} width={190} height={96} rx={8} fill="#2A2E3C" />
    <rect x={32} y={-408} width={166} height={46} rx={4} fill="#9FE6C8" opacity={0.9} />
    <text x={115} y={-374} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill="#1E5E4C">0 ₫</text>
    <rect x={-60} y={-338} width={70} height={10} rx={3} fill="#FF4A4A" opacity={0.55 + 0.3 * Math.sin(t / 3)} />
    {/* the lane light on its pole: green, a number */}
    <rect x={236} y={-640} width={14} height={340} fill="#1E1E26" />
    <rect x={190} y={-720} width={106} height={84} rx={12} fill="#1E1E26" />
    <rect x={200} y={-710} width={86} height={64} rx={8} fill="#2FB77A" />
    <text x={243} y={-662} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={52} fill="#E8FFF2">3</text>
    <Glow x={243} y={-678} r={130} kind="cool" o={0.5} />
    {/* a basket stack and a plastic-bag hook */}
    <g transform="translate(-380 -336)">
      {[0, 1, 2].map((i) => <path key={i} d={`M -50 ${-i * 22} L 50 ${-i * 22} L 42 ${-i * 22 + 28} L -42 ${-i * 22 + 28} Z`} fill={i % 2 ? '#D94452' : '#E8695A'} stroke="#8A2A32" strokeWidth={3} />)}
    </g>
    <path d="M 170 -290 q 20 10 10 40 q -20 6 -26 -10 Z" fill="#EDE6D6" opacity={0.9} />
  </g>
);

// ---------- a boombox: two woofers that kick, an antenna, a handle, with rings pulsing out of it ----------
export const Boombox: React.FC<{ x: number; y: number; s?: number; t: number; rings?: boolean }> = ({ x, y, s = 1, t, rings = true }) => {
  const kick = (off: number) => 1 + 0.07 * Math.max(0, Math.sin(t * 0.9 + off)) ** 2 * 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {rings
        ? [0, 1, 2, 3].map((i) => {
            const p = ((t * 0.045 + i / 4) % 1 + 1) % 1;
            return <circle key={i} cx={0} cy={-80} r={90 + p * 360} fill="none" stroke="#FFE27A" strokeWidth={10 * (1 - p) + 1} opacity={0.75 * (1 - p)} />;
          })
        : null}
      <ellipse cx={6} cy={4} rx={190} ry={16} fill="#000" opacity={0.4} />
      <path d="M -120 -172 Q 0 -230 120 -172" stroke="#1A1620" strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d="M 150 -150 L 190 -250" stroke="#8A8A98" strokeWidth={6} strokeLinecap="round" />
      <circle cx={190} cy={-252} r={8} fill="#D94452" />
      <rect x={-180} y={-170} width={360} height={170} rx={26} fill="#C84A58" />
      <rect x={-180} y={-170} width={110} height={170} rx={26} fill="#000" opacity={0.18} />
      <path d="M 178 -150 L 178 -22" stroke={RIM} strokeWidth={4} opacity={0.6} />
      <rect x={-52} y={-158} width={104} height={46} rx={8} fill="#2A2630" />
      <rect x={-44} y={-150} width={88} height={30} rx={5} fill="#9FE6C8" opacity={0.85} />
      {[-30, -10, 10, 30].map((bx, i) => <rect key={i} x={bx - 3} y={-150 + 28 - 6 - Math.abs(Math.sin(t * 0.7 + i * 1.7)) * 20} width={6} height={Math.abs(Math.sin(t * 0.7 + i * 1.7)) * 20 + 6} fill="#1E5E4C" />)}
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`translate(${sd * 106} -72) scale(${kick(sd)})`}>
          <circle r={56} fill="#1A1620" />
          <circle r={44} fill="#3A3644" />
          <circle r={20} fill="#1A1620" />
          <circle r={7} fill="#D9D0C0" />
          <path d="M -38 -22 Q -20 -40 0 -44" stroke="#fff" strokeWidth={4} opacity={0.25} fill="none" strokeLinecap="round" />
        </g>
      ))}
      <circle cx={-28} cy={-96} r={8} fill="#F6D04D" />
      <circle cx={28} cy={-96} r={8} fill="#2FA595" />
    </g>
  );
};

// ---------- a shop window at night: a display bed with a quilt and pillow, a price tag, glass glare, a warm spotlight ----------
export const ShopWindowBed: React.FC<{ id: string; t: number }> = ({ id, t }) => (
  <g>
    <rect x={-200} y={-100} width={2320} height={1300} fill="#1B1830" />
    {/* the shop's dark facade round a lit window */}
    <rect x={260} y={140} width={1400} height={700} fill="#E8D6B8" />
    <rect x={260} y={140} width={1400} height={700} fill="#2B2338" opacity={0.35} />
    <rect x={260} y={580} width={1400} height={260} fill="#8A6A52" />
    <rect x={260} y={580} width={1400} height={260} fill="#000" opacity={0.25} />
    {/* the display bed */}
    <rect x={430} y={540} width={1060} height={190} rx={22} fill="#4E5E92" />
    <rect x={430} y={540} width={1060} height={30} rx={14} fill="#6A7AB0" />
    <path d="M 430 600 Q 700 640 960 600 T 1490 600" stroke="#43527F" strokeWidth={4} fill="none" />
    <rect x={430} y={700} width={1060} height={40} fill="#2E3A66" />
    <rect x={480} y={730} width={26} height={90} fill="#3A2A22" />
    <rect x={1414} y={730} width={26} height={90} fill="#3A2A22" />
    <rect x={430} y={420} width={50} height={320} rx={16} fill="#6A4A56" />
    <ellipse cx={580} cy={520} rx={110} ry={46} fill="#F0E4D2" />
    <ellipse cx={560} cy={508} rx={80} ry={20} fill="#fff" opacity={0.3} />
    <rect x={1310} y={430} width={110} height={110} rx={20} fill="#E8A0B4" transform="rotate(8 1365 485)" />
    {/* a lamp over the bed, a price tag */}
    <path d="M 960 140 L 960 230" stroke="#1A1620" strokeWidth={6} />
    <path d="M 900 300 L 930 232 L 990 232 L 1020 300 Z" fill="#D9A441" />
    <polygon points="900,300 1020,300 1300,540 620,540" fill="#FFE2A8" opacity={0.18} style={{ mixBlendMode: 'screen' }} />
    <g transform="translate(1260 330) rotate(-6)">
      <rect x={-60} y={-34} width={120} height={64} rx={6} fill="#F6EFDC" />
      <text x={0} y={10} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#C84A58">GIẢM 50%</text>
    </g>
    {/* the glass: a diagonal glare, the dark frame, the sidewalk reflection */}
    <polygon points="360,140 520,140 340,840 260,840" fill="#fff" opacity={0.07} />
    <polygon points="700,140 780,140 600,840 520,840" fill="#fff" opacity={0.05} />
    <rect x={240} y={120} width={1440} height={740} fill="none" stroke="#0E0C16" strokeWidth={40} />
    <rect x={-200} y={860} width={2320} height={400} fill="#23202E" />
    <Glow x={960} y={420} r={720} o={0.5} />
    <LightVeil id={`${id}veil`} lights={[[960, 500, 700]]} o={0.35} />
    <g style={{ mixBlendMode: 'screen' }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <circle key={i} cx={300 + rnd(5, i) * 1300} cy={200 + ((rnd(6, i) * 600 + t * (0.3 + rnd(7, i) * 0.4)) % 600)} r={2 + rnd(8, i) * 2.5} fill="#FFE2A8" opacity={0.35} />
      ))}
    </g>
  </g>
);

// ---------- a high-rise facade at night, mostly dark windows: the neighbour's window is at (cx, cy) ----------
export const NeighbourFacade: React.FC<{ cx: number; cy: number; t: number; shake?: number }> = ({ cx, cy, t, shake = 0 }) => (
  <g>
    <rect x={-300} y={-300} width={2520} height={1700} fill="#1A1A30" />
    {Array.from({ length: 9 }).map((_, r) =>
      Array.from({ length: 12 }).map((__, c) => {
        const x = cx - 5 * 190 + c * 190;
        const y = cy - 3 * 220 + r * 220;
        const q = rnd(41, r * 12 + c);
        const mid = Math.abs(x - cx) < 5 && Math.abs(y - cy) < 5;
        return (
          <g key={`${r}-${c}`}>
            <rect x={x - 62} y={y - 78} width={124} height={156} fill="#0B0A16" stroke="#2E2E4A" strokeWidth={8} />
            <rect x={x - 62} y={y - 78} width={124} height={156} fill={mid ? '#1E2236' : '#12142A'} />
            {q > 0.8 && !mid ? <rect x={x - 54} y={y - 70} width={108} height={140} fill="#C8D4F0" opacity={0.07} /> : null}
            <path d={`M ${x - 62} ${y - 20} L ${x + 62} ${y - 20}`} stroke="#2E2E4A" strokeWidth={4} />
            {q < 0.35 && !mid ? <path d={`M ${x - 54} ${y - 70} Q ${x - 20} ${y - 10} ${x - 48} ${y + 60} L ${x - 54} ${y + 60} Z`} fill="#3A2A44" opacity={0.7} /> : null}
          </g>
        );
      }),
    )}
    {/* balconies' ledges */}
    {Array.from({ length: 9 }).map((_, r) => <rect key={r} x={-300} y={cy - 3 * 220 + r * 220 + 84} width={2520} height={10} fill="#2A2A44" />)}
    {/* the neighbour's curtain, drawn, and a plant: nobody home */}
    <path d={`M ${cx - 54} ${cy - 70} Q ${cx - 10} ${cy - 20} ${cx - 44} ${cy + 70} L ${cx - 54} ${cy + 70} Z`} fill="#4A3A5A" />
    <path d={`M ${cx + 54} ${cy - 70} Q ${cx + 20} ${cy} ${cx + 48} ${cy + 70} L ${cx + 54} ${cy + 70} Z`} fill="#4A3A5A" />
    <g transform={`translate(${cx + 20} ${cy + 70})`}>
      <path d="M -14 0 L -10 -26 L 10 -26 L 14 0 Z" fill="#8A5040" />
      <path d={`M 0 -26 Q -6 -52 ${-14 + Math.sin(t / 7)} -64 M 0 -26 Q 6 -56 ${16 + Math.sin(t / 8)} -60`} stroke="#4E8A58" strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
    <circle cx={cx + 2000 * 0} cy={cy} r={0} />
    <rect x={cx - 62} y={cy - 78} width={124} height={156} fill="#9FB8F0" opacity={0.09 + 0 * shake} />
    <polygon points={`${cx - 50},${cy - 70} ${cx - 8},${cy - 70} ${cx - 50},${cy + 10}`} fill="#fff" opacity={0.06} />
    <rect x={-300} y={-300} width={2520} height={1700} fill="#0A0814" opacity={0.18} />
  </g>
);

// ---------- a plump pillow flying through the air ----------
export const FlyPillow: React.FC<{ x: number; y: number; rot: number; c: string; s?: number }> = ({ x, y, rot, c, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-62} y={-40} width={124} height={80} rx={30} fill={c} />
    <rect x={-62} y={-40} width={40} height={80} rx={30} fill="#1B1030" opacity={0.2} />
    <path d="M -54 -34 Q -30 -4 -54 34 M 54 -34 Q 30 -4 54 34" stroke="#1B1030" strokeWidth={2.4} opacity={0.35} fill="none" strokeLinecap="round" />
    <ellipse cx={12} cy={-14} rx={26} ry={8} fill="#fff" opacity={0.25} />
  </g>
);

// ---------- a bird in flight (wings flap from f), and a bird perched on a wire ----------
export const Bird: React.FC<{ x: number; y: number; f: number; s?: number; color?: string; flip?: boolean }> = ({ x, y, f, s = 1, color = '#2A1A30', flip = false }) => {
  const w = Math.sin(f * 0.9) * 22;
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s} ${s})`}>
      <path d={`M -34 ${6 - w * 0.4} Q -16 ${-14 - w} 0 0 Q 16 ${-14 - w} 34 ${6 - w * 0.4}`} stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx={0} cy={4} rx={9} ry={6} fill={color} />
      <circle cx={9} cy={0} r={4.5} fill={color} />
    </g>
  );
};
export const PerchedBird: React.FC<{ x: number; y: number; s?: number; color?: string; flip?: boolean; peck?: number }> = ({ x, y, s = 1, color = '#2A1A30', flip = false, peck = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s} ${s})`}>
    <path d="M -14 -6 L -34 -2 L -26 -12 Z" fill={color} />
    <ellipse cx={0} cy={-12} rx={16} ry={11} fill={color} />
    <circle cx={13} cy={-22 + peck * 6} r={7} fill={color} />
    <path d="M 19 -22 L 26 -20 L 19 -18 Z" fill="#D9A441" />
    <path d="M -3 -2 L -3 6 M 5 -2 L 5 6" stroke={color} strokeWidth={2.4} />
  </g>
);

// ---------- chalk: text that writes on left to right, and a doodle path that draws on ----------
export const ChalkWrite: React.FC<{ id: string; x: number; y: number; text: string; size: number; p: number; color?: string; anchor?: 'start' | 'middle' }> = ({ id, x, y, text, size, p, color = '#EDE9DD', anchor = 'middle' }) => {
  const w = size * 0.62 * text.length;
  const x0 = anchor === 'middle' ? x - w / 2 : x;
  return (
    <g>
      <clipPath id={`${id}cw`}><rect x={x0 - 10} y={y - size * 1.1} width={(w + 20) * clamp(p)} height={size * 1.5} /></clipPath>
      <text x={x} y={y} textAnchor={anchor} fontFamily={FONT.hand} fontSize={size} fill={color} opacity={0.92} clipPath={`url(#${id}cw)`} style={{ letterSpacing: 2 }}>{text}</text>
    </g>
  );
};
export const ChalkPath: React.FC<{ d: string; p: number; w?: number; color?: string }> = ({ d, p, w = 7, color = '#EDE9DD' }) => (
  <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(p)} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.92} />
);

// ---------- particles: n bits thrown from (x, y) under gravity from frame k0, deterministic ----------
export const Burst: React.FC<{ x: number; y: number; k: number; n?: number; seed?: number; color?: string | string[]; speed?: number; up?: number; g?: number; r?: number; spread?: number; chip?: boolean }> = ({
  x, y, k, n = 18, seed = 3, color = '#F6B93B', speed = 16, up = 0.6, g = 0.9, r = 7, spread = 1, chip = false,
}) => {
  if (k < 0 || k > 30) return null;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const a = (-Math.PI / 2) + (rnd(seed, i) - 0.5) * Math.PI * spread;
        const v = speed * (0.4 + rnd(seed + 1, i) * 0.8);
        const px = x + Math.cos(a) * v * k * (1 - up * 0);
        const py = y + Math.sin(a) * v * k + 0.5 * g * k * k;
        const c = Array.isArray(color) ? color[i % color.length] : color;
        const rr = r * (0.5 + rnd(seed + 2, i) * 0.8) * (1 - k / 34);
        if (chip) return <path key={i} d="M -1 -0.8 Q 0.4 -1.2 1 -0.3 Q 0.6 0.4 0.1 1 Q -0.9 0.5 -1 -0.8 Z" transform={`translate(${px} ${py}) rotate(${rnd(seed + 3, i) * 360 + k * 18}) scale(${rr * 1.5})`} fill={c} stroke="#B9782F" strokeWidth={0.12} />;
        return <circle key={i} cx={px} cy={py} r={rr} fill={c} />;
      })}
    </g>
  );
};

/** A plain pop-in scale 0..1 with overshoot, for an item appearing at frame k. */
export const popScale = (k: number) => (k <= 0 ? 0 : backOut(clamp(k / 7)));

/** The wind streaks: n horizontal speed lines moving left at `speed` px a frame. */
export const SpeedLines: React.FC<{ t: number; n?: number; speed?: number; y0?: number; y1?: number; o?: number; seed?: number }> = ({ t, n = 14, speed = 70, y0 = 120, y1 = 980, o = 0.35, seed = 4 }) => (
  <g style={{ mixBlendMode: 'screen' }}>
    {Array.from({ length: n }).map((_, i) => {
      const len = 180 + rnd(seed, i) * 420;
      const x = 2300 - ((t * speed * (0.6 + rnd(seed + 1, i) * 0.8) + rnd(seed + 2, i) * 2600) % 2900);
      const y = y0 + rnd(seed + 3, i) * (y1 - y0);
      return <rect key={i} x={x} y={y} width={len} height={3 + rnd(seed + 4, i) * 4} rx={3} fill="#FFE2C8" opacity={o * (0.5 + rnd(seed + 5, i) * 0.5)} />;
    })}
  </g>
);

export { easeOut };
