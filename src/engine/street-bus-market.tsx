import React from 'react';
import { rnd } from './anim';
import { mixHex } from './street-geom';
import { FONT } from './fonts';
import { Glow } from './light';

// The big street props, side-on at 100 px per metre (s = 1), origin on the ground in the middle: a city Bus and a
// MarketStall. Placed in <Street> with propScale(Z) like the other street props.

const INK = '#14121A';
const RIM = '#FFB46A';

/**
 * A city bus in side view, 8.2 m long, front to the right (facing 1). Both doors are open (`open` 0..1 folds them
 * away), the cabin lit warm through its windows, the route number `number` on the side, the roof and the destination board.
 * No operator marks: a plain cream body, a green band and an orange stripe.
 */
export const Bus: React.FC<{ x: number; y: number; s?: number; facing?: 1 | -1; number?: string; open?: number; lit?: number; shadow?: number; t?: number }> = ({
  x, y, s = 1, facing = 1, number = '09', open = 1, lit = 1, shadow = 1, t = 0,
}) => {
  const body = '#D8D0BA';
  const green = '#2F7A66';
  // text must not mirror when the bus faces left: flip it back about its own x
  const unflip = (tx: number) => (facing === -1 ? `translate(${tx} 0) scale(-1 1) translate(${-tx} 0)` : undefined);
  const doors: [number, number][] = [[-120, -20], [250, 350]]; // x0, x1 of the two door openings
  const win = (x0: number, x1: number) => (
    <g key={x0}>
      <rect x={x0} y={-262} width={x1 - x0} height={92} rx={8} fill={mixHex('#2A3350', '#FFD890', 0.8 * lit)} stroke={INK} strokeWidth={3} />
      {/* seat backs against the lit window, and a hanging strap or two */}
      {Array.from({ length: Math.max(1, Math.floor((x1 - x0) / 46)) }).map((_, i) => (
        <rect key={i} x={x0 + 14 + i * 46} y={-232} width={22} height={62} rx={7} fill="#4A3A44" opacity={0.75} />
      ))}
      <path d={`M ${x0 + 8} ${-258} L ${x1 - 8} ${-258}`} stroke="#FFFFFF" strokeWidth={2} opacity={0.2} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s * facing} ${s})`}>
      <ellipse cx={0} cy={4} rx={440} ry={14} fill="#000" opacity={0.45 * shadow} />
      {/* roof pod and destination board */}
      <rect x={-130} y={-322} width={220} height={26} rx={9} fill="#9A98A6" stroke={INK} strokeWidth={3} />
      <path d="M -126 -320 L 86 -320" stroke={RIM} strokeWidth={2.5} opacity={0.55} />
      {/* the body */}
      <path d="M -410 -60 L -410 -280 Q -410 -304 -386 -304 L 340 -304 Q 396 -300 408 -250 L 412 -60 Z" fill={body} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M -410 -60 L -410 -150 L 412 -150 L 412 -60 Z" fill={green} />
      <path d="M -410 -150 L 412 -150" stroke="#F0A040" strokeWidth={10} />
      <path d="M -388 -302 L 336 -302" stroke={RIM} strokeWidth={3} opacity={0.6} />
      <path d="M -410 -60 L 412 -60" stroke={INK} strokeWidth={6} />
      {/* windows between the doors, a narrow one by the nose */}
      {win(-398, -132)}
      {win(-8, 238)}
      {win(362, 398)}
      {/* the open doors: a lit, dark cabin with a handrail and steps, the folded leaves at the edge */}
      {doors.map(([d0, d1], i) => {
        const w = d1 - d0;
        return (
          <g key={i}>
            <rect x={d0} y={-272} width={w} height={216} fill="#1A1420" stroke={INK} strokeWidth={4} />
            <rect x={d0 + 6} y={-266} width={w - 12} height={204} fill={mixHex('#241A28', '#F5D58A', 0.8 * lit)} />
            <path d={`M ${d0 + w / 2} -266 L ${d0 + w / 2} -66`} stroke="#E8C050" strokeWidth={6} />
            <path d={`M ${d0 + 6} -96 L ${d1 - 6} -96 M ${d0 + 6} -78 L ${d1 - 6} -78`} stroke="#5A4A56" strokeWidth={5} />
            <rect x={d0} y={-272} width={Math.max(6, w * 0.5 * (1 - open))} height={216} fill={mixHex('#2A3350', '#FFD890', 0.5 * lit)} stroke={INK} strokeWidth={3} />
          </g>
        );
      })}
      {/* route number: on the side, and lit on the destination board over the front door */}
      <rect x={90} y={-296} width={150} height={26} rx={4} fill="#1A1008" stroke={INK} strokeWidth={2} />
      <text x={166} y={-276} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={22} fill="#FFB02E" transform={unflip(166)}>{number}</text>
      <text x={110} y={-76} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={74} fill="#F5EFE0" stroke={INK} strokeWidth={2.5} paintOrder="stroke" transform={unflip(110)}>{number}</text>
      {/* lamps */}
      <rect x={-414} y={-118} width={8} height={30} rx={3} fill="#FF4A3A" />
      <Glow x={-414} y={-104} r={50} kind="red" o={0.6 * lit} />
      <rect x={406} y={-120} width={8} height={26} rx={3} fill="#FFF1C0" />
      <Glow x={420} y={-106} r={90} o={0.7 * lit} />
      {/* wheels with deep arches */}
      {[-250, 250].map((wx) => (
        <g key={wx}>
          <path d={`M ${wx - 62} -50 A 62 62 0 0 1 ${wx + 62} -50 L ${wx + 62} -40 L ${wx - 62} -40 Z`} fill={INK} />
          <circle cx={wx} cy={-48} r={48} fill={INK} />
          <circle cx={wx} cy={-48} r={30} fill="#8C8A98" />
          <circle cx={wx} cy={-48} r={20} fill="#3A3846" />
          {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={wx} cy={-48 - 12} r={3} fill="#B8B6C4" transform={`rotate(${a + t * 0} ${wx} -48)`} />)}
        </g>
      ))}
      <path d="M -410 -296 L -410 -64" stroke={INK} strokeWidth={4} opacity={0.5} />
    </g>
  );
};

// ---------- market stall ----------
const GREENS = ['#4F8A4C', '#6FA654', '#3D6E44'];
/**
 * A pavement market stall: a striped parasol, a table with produce (greens, tomatoes, oranges, chillies), a fish
 * basin or two on the ground, woven baskets, crates, a hanging scale and a bare bulb that lights it. No people.
 * `variant` 0 vegetables, 1 fish, 2 fruit, 3 baskets and herbs; `pop` 0..1 scales it up from the ground (a stall
 * setting up); `lit` 0..1 is the bulb.
 */
export const MarketStall: React.FC<{ x: number; y: number; s?: number; variant?: number; seed?: number; pop?: number; lit?: number; glow?: boolean; t?: number }> = ({
  x, y, s = 1, variant = 0, seed = 1, pop = 1, lit = 1, glow = true, t = 0,
}) => {
  const cols = [['#D8483C', '#F2E6D0'], ['#2F8F8A', '#F2E6D0'], ['#E9A83A', '#F2E6D0'], ['#4A6EB0', '#F2E6D0']][Math.floor(rnd(seed, 3) * 4)];
  const wob = Math.sin(t / 30 + seed) * 0.6;
  const piles: React.ReactNode[] = [];
  const pile = (cx: number, kind: number, k: number) => {
    const n = 7;
    for (let i = 0; i < n; i++) {
      const px = cx + (rnd(seed + k, i) - 0.5) * 46;
      const py = -86 - rnd(seed + k + 1, i) * 20;
      if (kind === 0) piles.push(<path key={`g${k}${i}`} d={`M ${px} ${py + 8} q ${(rnd(seed, i + k) - 0.5) * 24} -22 ${(rnd(seed, i) - 0.5) * 34} -30`} stroke={GREENS[i % 3]} strokeWidth={9} strokeLinecap="round" fill="none" />);
      else if (kind === 1) piles.push(<circle key={`t${k}${i}`} cx={px} cy={py + 2} r={9} fill={i % 3 ? '#D8483C' : '#E56B3A'} stroke="#8A2A22" strokeWidth={1.2} />);
      else if (kind === 2) piles.push(<circle key={`o${k}${i}`} cx={px} cy={py + 2} r={10} fill={i % 2 ? '#F0A030' : '#E8C23A'} />);
      else piles.push(<path key={`c${k}${i}`} d={`M ${px} ${py + 4} q 8 -4 14 -14`} stroke="#E0382E" strokeWidth={5} strokeLinecap="round" fill="none" />);
    }
  };
  const mix = [[0, 1, 2], [1, 0, 3], [2, 2, 1], [0, 3, 1]][variant % 4];
  pile(-52, mix[0], 1);
  pile(0, mix[1], 5);
  pile(52, mix[2], 9);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * pop} ${s * pop})`} opacity={Math.min(1, pop * 2)}>
      <ellipse cx={0} cy={4} rx={118} ry={11} fill="#000" opacity={0.4} />
      {/* parasol pole and canopy, in segments */}
      <path d="M -4 0 L -4 -246" stroke="#4A4858" strokeWidth={7} />
      <g transform={`rotate(${wob} 0 -240)`}>
        <path d="M -138 -224 Q -100 -300 0 -304 Q 100 -300 138 -224 Z" fill={cols[0]} stroke={INK} strokeWidth={3} />
        {[-100, -56, -12, 32, 76].map((px0, i) => (
          i % 2 ? <path key={i} d={`M ${px0} -224 Q ${px0 + 8} -290 0 -304 Q ${px0 + 58} -284 ${px0 + 44} -224 Z`} fill={cols[1]} opacity={0.9} /> : null
        ))}
        <path d="M -138 -224 Q -120 -212 -100 -224 Q -80 -212 -60 -224 Q -40 -212 -20 -224 Q 0 -212 20 -224 Q 40 -212 60 -224 Q 80 -212 100 -224 Q 120 -212 138 -224" fill={cols[0]} stroke={INK} strokeWidth={2.5} />
        <path d="M -126 -240 Q -80 -296 0 -300" stroke={RIM} strokeWidth={3} fill="none" opacity={0.55} />
      </g>
      {/* hanging scale and the bare bulb */}
      <path d="M 60 -226 L 60 -196" stroke="#6E6C7C" strokeWidth={2.5} />
      <path d="M 44 -184 L 76 -184 L 70 -164 L 50 -164 Z" fill="#B8B6C4" stroke={INK} strokeWidth={1.5} />
      <path d="M -70 -226 L -70 -204" stroke={INK} strokeWidth={2} />
      <circle cx={-70} cy={-198} r={7} fill={mixHex('#6A5A40', '#FFE7B0', lit)} stroke={INK} strokeWidth={1.2} />
      {glow && lit > 0.05 ? <Glow x={-70} y={-196} r={150} o={0.75 * lit} /> : null}
      {/* the table: legs, cloth, produce piles */}
      <path d="M -112 -74 L -108 0 M 112 -74 L 108 0" stroke="#4A4858" strokeWidth={7} />
      <rect x={-118} y={-80} width={236} height={9} rx={2} fill="#7A5A44" stroke={INK} strokeWidth={2} />
      <path d="M -118 -71 L -118 -50 L -90 -58 L -60 -48 L -30 -58 L 0 -48 L 30 -58 L 60 -48 L 90 -58 L 118 -50 L 118 -71 Z" fill={cols[1]} opacity={0.85} />
      {piles}
      {/* ground: a basin of fish on ice (variant 1), baskets, crates */}
      {variant === 1 ? (
        <g>
          <ellipse cx={-64} cy={-16} rx={52} ry={16} fill="#2F6EA8" stroke={INK} strokeWidth={2} />
          <ellipse cx={-64} cy={-20} rx={44} ry={11} fill="#BFD6E6" />
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M ${-92 + i * 14} ${-22 + (i % 2) * 4} q 8 -7 16 0 q -8 6 -16 0 M ${-76 + i * 14} ${-22 + (i % 2) * 4} l 5 -4 l 0 8 z`} fill="#A9B8C8" stroke="#5A6878" strokeWidth={0.8} />
          ))}
          <ellipse cx={-80} cy={-24} rx={14} ry={3} fill="#FFFFFF" opacity={0.5} />
        </g>
      ) : null}
      <g transform="translate(70 0)">
        <ellipse cx={0} cy={-18} rx={40} ry={13} fill="#8A6A42" stroke={INK} strokeWidth={2} />
        <path d="M -40 -18 L -34 -2 Q 0 6 34 -2 L 40 -18" fill="#9A7A4E" stroke={INK} strokeWidth={2} />
        {[-24, -8, 8, 24].map((wx) => <path key={wx} d={`M ${wx} -16 L ${wx * 0.9} -2`} stroke="#6A4A2E" strokeWidth={1.5} />)}
        {variant % 2 === 0 ? [-18, 0, 18].map((wx, i) => <circle key={wx} cx={wx} cy={-26 - (i === 1 ? 4 : 0)} r={11} fill={variant === 2 ? '#E8C23A' : '#6FA654'} />) : null}
      </g>
      <rect x={-130} y={-32} width={46} height={30} rx={3} fill="#C84A3E" stroke={INK} strokeWidth={2} transform={variant === 1 ? 'translate(-40 0)' : undefined} />
    </g>
  );
};
