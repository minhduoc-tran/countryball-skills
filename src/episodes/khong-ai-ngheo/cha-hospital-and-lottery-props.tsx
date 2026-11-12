import React from 'react';
import { clamp, rnd, Glow, Motorbike, FONT } from '../../engine';

// Chapter A props (2/4): the hospital lobby with its fee window (and the shutter that comes down in the new world), the
// motorbike keys, the medicine bag, an arm + hand for macros, and the lottery seller's tray. Pure functions of t.

/** The hospital lobby, face-on: left window onto the street (the man's motorbike waits outside), benches, the fee window on the right.
 *  `behind` is drawn behind the window glass (the clerk). `shutter` 0..1 rolls the window shut, `struck` 0..1 slashes the sign. */
export const HospitalLobby: React.FC<{ t: number; id: string; behind?: React.ReactNode; shutter?: number; struck?: number }> = ({ t, id, behind, shutter = 0, struck = 0 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}wall`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#DCEAE6" /><stop offset="1" stopColor="#B9D3CC" /></linearGradient>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6E5A9A" /><stop offset="1" stopColor="#F2A56E" /></linearGradient>
      <clipPath id={`${id}win`}><rect x={90} y={250} width={400} height={400} rx={8} /></clipPath>
    </defs>
    <rect x={-300} y={-200} width={2520} height={1000} fill={`url(#${id}wall)`} />
    <rect x={-300} y={640} width={2520} height={180} fill="#6FA79F" />
    <rect x={-300} y={636} width={2520} height={10} fill="#4E857D" />
    <rect x={-300} y={820} width={2520} height={500} fill="#D8D2C4" />
    {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M ${-300 + i * 190} 820 L ${-700 + i * 330} 1300`} stroke="#B9B2A2" strokeWidth={3} />)}
    {[0, 1, 2].map((i) => <rect key={i} x={260 + i * 620} y={-10} width={300} height={26} rx={10} fill="#FFFFFF" />)}
    {[0, 1, 2].map((i) => <Glow key={i} x={410 + i * 620} y={40} r={380} o={0.3} />)}
    {/* the window onto the street: dusk sky, a motorbike with its helmet */}
    <rect x={76} y={236} width={428} height={428} rx={14} fill="#F4F1E8" stroke="#8AA8A2" strokeWidth={6} />
    <g clipPath={`url(#${id}win)`}>
      <rect x={90} y={250} width={400} height={400} fill={`url(#${id}sky)`} />
      <rect x={90} y={560} width={400} height={100} fill="#4A4558" />
      <path d="M 90 560 H 490" stroke="#E8C690" strokeWidth={4} />
      <Motorbike x={300} y={640} s={1.15} facing={1} color="#B8483E" helmet t={t} shadow={0.6} />
    </g>
    <path d="M 290 250 V 650 M 90 450 H 490" stroke="#F4F1E8" strokeWidth={8} />
    <rect x={600} y={290} width={120} height={120} rx={14} fill="#FFFFFF" stroke="#8AA8A2" strokeWidth={5} />
    <path d="M 650 322 h 20 v 28 h 28 v 20 h -28 v 28 h -20 v -28 h -28 v -20 h 28 z" fill="#D9453A" />
    {/* benches */}
    {[760, 1000].map((x) => (
      <g key={x} transform={`translate(${x} 820)`}>
        <ellipse cx={0} cy={6} rx={110} ry={9} fill="#000" opacity={0.2} />
        <rect x={-100} y={-70} width={200} height={20} rx={8} fill="#3E7DB0" />
        <rect x={-100} y={-120} width={200} height={40} rx={10} fill="#4A8EC4" />
        {[-88, 80].map((lx) => <rect key={lx} x={lx} y={-50} width={8} height={52} fill="#51606E" />)}
      </g>
    ))}
    {/* the fee window: sign, clerk behind glass, counter */}
    <rect x={1160} y={250} width={620} height={500} fill="#8FB8B0" stroke="#4E857D" strokeWidth={6} />
    <rect x={1210} y={360} width={520} height={360} fill="#A9C6BE" />
    <rect x={1210} y={600} width={520} height={120} fill="#7FA39B" />
    {behind}
    <rect x={1210} y={360} width={520} height={360} fill="#BFE0F0" opacity={0.16} />
    <path d="M 1250 400 L 1330 400 L 1250 480 Z" fill="#fff" opacity={0.18} />
    <rect x={1210} y={360} width={520} height={360 * clamp(shutter)} fill="#7C8794" />
    {shutter > 0 ? Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M 1210 ${360 + i * 40} H 1730`} stroke="#5E6874" strokeWidth={3} opacity={i * 40 < 360 * shutter ? 1 : 0} />) : null}
    <rect x={1210} y={360} width={520} height={360} fill="none" stroke="#4E857D" strokeWidth={8} />
    <rect x={1300} y={278} width={340} height={64} rx={10} fill="#1F4466" />
    <text x={1470} y={324} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={38} fill="#FFFFFF" letterSpacing={3}>VIỆN PHÍ</text>
    {struck > 0 ? <path d={`M 1290 ${350} L ${1290 + 360 * clamp(struck)} ${270 - 0 * struck}`} stroke="#E8414E" strokeWidth={14} strokeLinecap="round" /> : null}
    <rect x={1170} y={720} width={600} height={200} fill="#9A7A52" stroke="#5E4630" strokeWidth={5} />
    <rect x={1150} y={706} width={640} height={26} rx={6} fill="#C9A672" stroke="#5E4630" strokeWidth={4} />
    <rect x={1330} y={716} width={280} height={9} rx={4} fill="#2A1E14" />
    <path d="M -300 820 H 2220" stroke="#FFFFFF" strokeWidth={3} opacity={0.4} />
  </g>
);

// ---------- keys, medicine, an arm ----------
/** A motorbike key ring: two keys and a tag with a little scooter on it. About 200 tall at s = 1, hanging from (x, y) (the ring). */
export const KeyRing: React.FC<{ x: number; y: number; s?: number; rot?: number; t?: number }> = ({ x, y, s = 1, rot = 0, t = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot + Math.sin(t / 5) * 3}) scale(${s})`}>
    <circle cx={0} cy={0} r={16} fill="none" stroke="#C9CDD6" strokeWidth={6} />
    {[-14, 18].map((a, i) => (
      <g key={i} transform={`rotate(${a} 0 0)`}>
        <rect x={-7} y={14} width={14} height={86} rx={5} fill="#D9DCE4" stroke="#6E7280" strokeWidth={3} />
        <rect x={-7} y={74} width={14} height={8} fill="#A6AAB6" />
        <rect x={-7} y={88} width={14} height={8} fill="#A6AAB6" />
      </g>
    ))}
    <g transform="translate(34 12) rotate(-12)">
      <rect x={-6} y={0} width={64} height={86} rx={12} fill="#B8483E" stroke="#5A1E1A" strokeWidth={3} />
      <circle cx={14} cy={66} r={9} fill="#1D1B24" /><circle cx={44} cy={66} r={9} fill="#1D1B24" />
      <path d="M 12 66 L 22 40 L 40 40 L 46 66 M 22 40 L 18 28 H 30" stroke="#FFF3DC" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </g>
);

/** A white paper medicine bag with a green cross and a pill strip sticking out. About 130 wide at s = 1, centred on its middle. */
export const MedBag: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-48} y={-12} width={26} height={40} rx={4} fill="#F4C84E" stroke="#8A6A1E" strokeWidth={3} transform="rotate(-14 -35 8)" />
    <path d="M -64 -44 L 64 -44 L 56 66 L -56 66 Z" fill="#FAF6EC" stroke="#8E8A7E" strokeWidth={4} strokeLinejoin="round" />
    <path d="M -64 -44 L 64 -44 L 60 -20 L -60 -20 Z" fill="#E9E2D0" />
    <path d="M -12 -2 h 24 v 20 h 20 v 24 h -20 v 0 h -24 v -20 h -20 v -24 h 20 z" transform="translate(0 -6) scale(0.9)" fill="#2FA86A" />
  </g>
);

/** An arm coming in from (fx, fy) to a mitten at (x, y): `sleeve` and `skin` colours, `rot` turns the hand, `s` scales it. */
export const SleeveHand: React.FC<{ x: number; y: number; fx: number; fy: number; sleeve: string; skin?: string; rot?: number; s?: number; width?: number; line?: string }> = ({
  x, y, fx, fy, sleeve, skin = '#F2C9A0', rot = 0, s = 4.2, width = 100, line = '#2A1E14',
}) => {
  const d = `M ${x + (fx - x) * 0.08} ${y + (fy - y) * 0.08} Q ${x + (fx - x) * 0.45 + 30} ${y + (fy - y) * 0.45} ${fx} ${fy}`;
  return (
    <g>
      <path d={d} stroke={line} strokeWidth={width + 14} fill="none" strokeLinecap="round" />
      <path d={d} stroke={sleeve} strokeWidth={width} fill="none" strokeLinecap="round" />
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
        <path d="M -11 -2 Q -14 14 -6 18 L 7 18 Q 14 14 11 -2 Z" fill={skin} stroke={line} strokeWidth={2.4} strokeLinejoin="round" />
        <ellipse cx={-10} cy={6} rx={4.5} ry={7} fill={skin} stroke={line} strokeWidth={2.2} />
      </g>
    </g>
  );
};

// ---------- the lottery seller's tray ----------
const TICKET_COLS = ['#E8414E', '#F2C14E', '#4EA8E0', '#7BC96F', '#E88AB0'];

/** The tray: a board with rows of tickets standing on it and strings of tickets hanging off the front. `fold` 0..1 closes it
 *  (tickets gone, the board turns edge-on). Anchored at its centre (x, y); `w` is the board width; `neck` (optional) is where the strap hangs from. */
export const LotteryTray: React.FC<{ x: number; y: number; w?: number; fold?: number; t: number; neck?: { x: number; y: number } }> = ({ x, y, w = 150, fold = 0, t, neck }) => {
  const f = clamp(fold);
  const ww = w * (1 - 0.82 * f);
  const rot = -78 * f;
  const tk = 1 - clamp(f * 2.2);
  const z = w / 150; // every part is drawn for a 150-wide board
  const wz = ww / z;
  return (
    <g>
      {neck ? <path d={`M ${neck.x} ${neck.y} L ${x - ww / 2} ${y} M ${neck.x} ${neck.y} L ${x + ww / 2} ${y}`} stroke="#6A4A36" strokeWidth={5} fill="none" opacity={1 - f * 0.6} /> : null}
      <g transform={`translate(${x} ${y}) rotate(${rot} 0 0) scale(${z})`}>
        <rect x={-ww / 2 / z} y={-8} width={ww / z} height={16} rx={4} fill="#9A6B3E" stroke="#4E3320" strokeWidth={3} />
        <g opacity={tk}>
          {Array.from({ length: 9 }).map((_, i) => (
            <rect key={i} x={-wz / 2 + 8 + i * (wz - 24) / 9} y={-66 + (i % 2) * 6 + Math.sin(t / 14 + i) * 1.5} width={wz / 12} height={58} rx={2} fill={TICKET_COLS[i % 5]} stroke="#4E3320" strokeWidth={1.5} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x={-wz / 2 + 10 + i * (wz - 20) / 8} y={8} width={wz / 14} height={46 + rnd(5, i) * 24 + Math.sin(t / 9 + i * 1.7) * 3} rx={2} fill={TICKET_COLS[(i + 2) % 5]} stroke="#4E3320" strokeWidth={1.5} />
          ))}
        </g>
      </g>
    </g>
  );
};
