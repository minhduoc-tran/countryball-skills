import React from 'react';
import { FONT } from '../../engine';
import { PAL } from './kit-palette';
import { DrySeabed } from './kit-dry-seabed';

// Chapter B (4/4): things lying on the dry seabed. Pure functions of t. All (x, y) = ground contact point.
//   <TitanicWreck x y sc? t />   rusty broken bow (~800*sc wide, ~330*sc tall) half in the mud, "TITANIC" on the hull.
//   <OldWreck x y sc? rot? />    wooden ship ribs + a mast stump (~360*sc wide).
//   <TicketBooth x y sc? />      striped kiosk with a "VÉ" sign and a small queue post line.
//   <SeabedCable t p0.. />       fat undersea cable lying across the ground in perspective with data pulses (see CableRun).
const INK = PAL.ink;

export const TitanicWreck: React.FC<{ x: number; y: number; sc?: number; t: number; rot?: number }> = ({ x, y, sc = 1, t, rot = -6 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sc})`}>
    <ellipse cx={0} cy={10} rx={470} ry={24} fill="#000" opacity={0.3} />
    <path d="M -380 0 L -392 -150 L -356 -176 L -330 -160 L -300 -184 L 250 -196 Q 340 -206 420 -270 Q 408 -120 340 -40 Q 300 0 240 0 Z" fill="#7B4630" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -392 -150 L -356 -176 L -330 -160 L -300 -184 L 250 -196 Q 340 -206 420 -270 L 410 -240 Q 330 -170 250 -168 L -380 -128 Z" fill="#A5694A" opacity={0.85} />
    {/* rust drips */}
    {[-320, -230, -120, -20, 70, 160, 260].map((px, i) => <path key={i} d={`M ${px} ${-150 + (i % 2) * 10} q 4 ${40 + (i % 3) * 18} -2 ${70 + (i % 2) * 20}`} stroke="#4E2A1A" strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.55} />)}
    {/* portholes */}
    {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={-330 + i * 44} cy={-86 + (i % 2) * 2} r={6.5} fill="#2A1B14" stroke="#C48A5E" strokeWidth={2.5} />)}
    <path d="M -380 -60 L 330 -60" stroke="#4E2A1A" strokeWidth={4} opacity={0.5} />
    {/* bridge, a stub of a funnel and a bent crane */}
    <path d="M -150 -194 L -150 -250 L -40 -250 L -40 -194 Z" fill="#8B563D" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {[-130, -98, -66].map((px, i) => <rect key={i} x={px} y={-236} width={20} height={16} fill="#2A1B14" />)}
    <path d="M 40 -194 L 52 -266 L 128 -266 L 138 -192 Z" fill="#6E3C28" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 52 -266 L 128 -266" stroke="#C48A5E" strokeWidth={7} />
    <path d="M 190 -196 L 214 -300 L 276 -330" stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 190 -196 L 214 -300 L 276 -330" stroke="#8B563D" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {/* name plate */}
    <text x={330} y={-132} textAnchor="middle" transform="rotate(-20 330 -132)" fontFamily={FONT.title} fontWeight={900} fontSize={44} fill="#F2E7CF" stroke={INK} strokeWidth={2} paintOrder="stroke" letterSpacing={2}>TITANIC</text>
    {/* mud mound with a salt-white flecks */}
    <path d="M -460 22 Q -330 -50 -120 -26 Q 100 -30 250 -22 Q 420 -40 480 24 Q 0 90 -460 22 Z" fill="#4E3F31" stroke={INK} strokeWidth={4} />
    {[-340, -140, 120, 330].map((px, i) => <ellipse key={i} cx={px} cy={-6 + (i % 2) * 8} rx={34} ry={7} fill="#6B5A44" opacity={0.7} />)}
    {/* a drifting dust wisp */}
    <ellipse cx={-200 + Math.sin(t / 40) * 30} cy={-30} rx={160} ry={10} fill="#FBF8F0" opacity={0.14} />
  </g>
);

export const OldWreck: React.FC<{ x: number; y: number; sc?: number; rot?: number; tone?: string }> = ({ x, y, sc = 1, rot = 0, tone = '#6B4A2A' }) => {
  // a wooden hull seen side-on: raised bow (right) and stern (left), ribs standing up from the keel, a few planks left on the keel
  const top = (u: number) => -96 - 60 * Math.pow(Math.abs(u), 2.2) - (u > 0 ? 18 * u : 0); // gunwale height at u in -1..1
  const bot = (u: number) => -8 - 70 * Math.max(0, Math.abs(u) - 0.55) * 2;
  const ribs = Array.from({ length: 11 }).map((_, i) => -0.9 + i * 0.18);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sc})`}>
      <ellipse cx={0} cy={8} rx={230} ry={16} fill="#000" opacity={0.28} />
      <path d={`M -200 ${top(-1)} Q -190 -30 -120 ${bot(-0.6)} L 130 ${bot(0.6)} Q 200 -30 210 ${top(1)}`} fill="none" stroke={tone} strokeWidth={11} strokeLinejoin="round" strokeLinecap="round" />
      <path d={`M -200 ${top(-1)} Q 0 -70 210 ${top(1)}`} fill="none" stroke={tone} strokeWidth={9} strokeLinecap="round" />
      {ribs.map((u, i) => <path key={i} d={`M ${u * 200} ${bot(u) - 2} L ${u * 205} ${top(u) + 8}`} stroke={tone} strokeWidth={9} strokeLinecap="round" />)}
      {[-60, -30, 0].map((d, i) => <path key={i} d={`M ${-110 + i * 10} ${-12 + d * 0.4} L ${120 - i * 10} ${-12 + d * 0.4}`} stroke={tone} strokeWidth={7} opacity={0.75} />)}
      <path d="M 10 -50 L 14 -300" stroke={tone} strokeWidth={14} strokeLinecap="round" />
      <path d="M 14 -290 Q 74 -262 64 -204 Q 34 -224 14 -200 Z" fill="#CFC7B0" stroke={INK} strokeWidth={3} opacity={0.8} />
      <path d="M -240 12 Q -100 -26 0 -14 Q 120 -24 250 14 Q 0 50 -240 12 Z" fill="#4E3F31" stroke={INK} strokeWidth={3.5} />
    </g>
  );
};

export const TicketBooth: React.FC<{ x: number; y: number; sc?: number; t: number }> = ({ x, y, sc = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${sc})`}>
    <ellipse cx={0} cy={6} rx={130} ry={14} fill="#000" opacity={0.28} />
    <rect x={-100} y={-190} width={200} height={190} rx={8} fill="#F1ECE2" stroke={INK} strokeWidth={5} />
    <rect x={-70} y={-150} width={110} height={70} rx={6} fill="#2A2838" stroke={INK} strokeWidth={4} />
    <rect x={-70} y={-86} width={110} height={10} fill="#C9A66B" stroke={INK} strokeWidth={3} />
    <path d="M -120 -190 L -90 -240 L 90 -240 L 120 -190 Z" fill="#E04B3A" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {[-90, -50, -10, 30, 70].map((px, i) => <path key={i} d={`M ${px} -240 L ${px - 6} -190 L ${px + 34} -190 L ${px + 40} -240 Z`} fill="#F6EFE3" opacity={i % 2 ? 0 : 0.95} />)}
    <rect x={-60} y={-300} width={120} height={50} rx={10} fill="#FFE27A" stroke={INK} strokeWidth={4} />
    <text y={-262} x={0} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={40} fill={INK} letterSpacing={2}>VÉ</text>
    {/* ticket fluttering out of the window */}
    <g transform={`translate(54 ${-120 + Math.sin(t / 6) * 3}) rotate(${-8 + Math.sin(t / 9) * 4})`}>
      <rect x={-22} y={-14} width={44} height={28} rx={4} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
      <path d="M -6 -14 L -6 14" stroke={INK} strokeWidth={2} strokeDasharray="4 4" />
    </g>
  </g>
);

/** Rope posts with a sagging rope between two points (a queue line). */
export const RopeLine: React.FC<{ x0: number; x1: number; y: number; s?: number }> = ({ x0, x1, y, s = 1 }) => (
  <g>
    <path d={`M ${x0} ${y - 62 * s} Q ${(x0 + x1) / 2} ${y - 30 * s} ${x1} ${y - 62 * s}`} stroke="#B3362E" strokeWidth={5 * s} fill="none" />
    {[x0, x1].map((px, i) => (
      <g key={i}>
        <ellipse cx={px} cy={y + 2} rx={12 * s} ry={4 * s} fill="#000" opacity={0.25} />
        <path d={`M ${px} ${y} L ${px} ${y - 66 * s}`} stroke="#3A3A44" strokeWidth={6 * s} strokeLinecap="round" />
        <circle cx={px} cy={y - 68 * s} r={7 * s} fill="#F2B632" stroke={INK} strokeWidth={2} />
      </g>
    ))}
  </g>
);

/**
 * A fat cable lying across the seabed in perspective: a quadratic curve from (x0, y0) (near, wide) over (cx, cy) to (x1, y1)
 * (far, thin). Width tapers with depth; `pulses` bright dots run along it (speed in curve-lengths per frame).
 */
export const CableRun: React.FC<{ t: number; x0: number; y0: number; cx: number; cy: number; x1: number; y1: number; w0?: number; w1?: number; pulses?: number; speed?: number; glow?: number }> = ({
  t, x0, y0, cx, cy, x1, y1, w0 = 64, w1 = 8, pulses = 5, speed = 0.011, glow = 1,
}) => {
  const at = (u: number): [number, number, number] => [(1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * cx + u * u * x1, (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * cy + u * u * y1, w0 + (w1 - w0) * Math.pow(u, 0.8)];
  const N = 40;
  const segs = Array.from({ length: N }).map((_, i) => ({ a: at(i / N), b: at((i + 1) / N) }));
  return (
    <g>
      {/* shadow */}
      {segs.map(({ a, b }, i) => <path key={`s${i}`} d={`M ${a[0] + a[2] * 0.2} ${a[1] + a[2] * 0.45} L ${b[0] + b[2] * 0.2} ${b[1] + b[2] * 0.45}`} stroke="#000" strokeWidth={a[2] * 1.05} strokeLinecap="round" opacity={0.18} />)}
      {segs.map(({ a, b }, i) => <path key={`d${i}`} d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} stroke={INK} strokeWidth={a[2] + 8} strokeLinecap="round" />)}
      {segs.map(({ a, b }, i) => <path key={`b${i}`} d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} stroke="#2F3E55" strokeWidth={a[2]} strokeLinecap="round" />)}
      {segs.map(({ a, b }, i) => <path key={`h${i}`} d={`M ${a[0]} ${a[1] - a[2] * 0.22} L ${b[0]} ${b[1] - b[2] * 0.22}`} stroke="#6E86A8" strokeWidth={Math.max(1.5, a[2] * 0.16)} strokeLinecap="round" opacity={0.8} />)}
      {segs.filter((_, i) => i % 5 === 2).map(({ a }, i) => <ellipse key={`r${i}`} cx={a[0]} cy={a[1]} rx={Math.max(2, a[2] * 0.09)} ry={a[2] * 0.52} fill="#C9A66B" opacity={0.85} />)}
      {Array.from({ length: pulses }).map((_, i) => {
        const u = (((t * speed + i / pulses) % 1) + 1) % 1;
        const [px, py, pw] = at(u);
        const o = Math.sin(u * Math.PI) * glow;
        return (
          <g key={i}>
            <circle cx={px} cy={py - pw * 0.1} r={pw * 0.9} fill="#7FE3FF" opacity={0.28 * o} />
            <circle cx={px} cy={py - pw * 0.1} r={Math.max(3, pw * 0.34)} fill="#E8FBFF" opacity={o} />
          </g>
        );
      })}
    </g>
  );
};

/** The kit's dry seabed plus mud filling below y 1080, so a camera that tilts down never shows the empty edge. */
export const Seabed: React.FC<{ id: string; t: number; salt?: number; haze?: number; dust?: number }> = (p) => (
  <g>
    <rect x={-600} y={1070} width={3200} height={700} fill="#4E3F31" />
    <DrySeabed {...p} />
  </g>
);
