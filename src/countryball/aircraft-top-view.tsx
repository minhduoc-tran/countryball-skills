import React from 'react';
import { star } from './ball-flags';
import { AircraftKind, B52Variant, INK, mirror, pts } from './aircraft-kinds';

// TOP-DOWN aircraft sprites for flying over a map (heading 0 = east/right, 90 = down). Sprite space is 100 units long;
// `sw` is the outline width in sprite units (the wrapper keeps it ~2 px on screen at any size).

type P = [number, number][];
type SpriteProps = { sw: number; variant?: B52Variant };
const SW = (sw: number) => ({ stroke: INK, strokeWidth: sw, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const });
/** A polygon drawn twice, the second mirrored across the fuselage axis. */
const Sym: React.FC<{ p: P; fill: string; sw: number }> = ({ p, fill, sw }) => (
  <><polygon points={pts(p)} fill={fill} {...SW(sw)} /><polygon points={pts(mirror(p))} fill={fill} {...SW(sw)} /></>
);
/** DRV roundel: yellow star on a red disc with a yellow rim. */
const Roundel: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g><circle cx={x} cy={y} r={r} fill="#DA251D" stroke="#FFCD00" strokeWidth={r * 0.18} /><polygon points={star(x, y, r * 0.72)} fill="#FFCD00" /></g>
);
const Canopy: React.FC<{ x: number; rx: number; ry: number }> = ({ x, rx, ry }) => <ellipse cx={x} cy={0} rx={rx} ry={ry} fill="#27323F" stroke={INK} strokeWidth={0.8} />;

const B52: React.FC<SpriteProps> = ({ sw, variant = 'D' }) => {
  const g = variant === 'D', base = g ? '#66744A' : '#C9CED2', patch = g ? '#A09468' : '#AEB4BA', pod = g ? '#4B5538' : '#8E959B';
  const wing: P = [[10, -4], [-20, -58], [-28, -58], [-16, -4]];
  const stab: P = [[-38, -3], [-50, -19], [-56, -19], [-52, -3]];
  const leX = (y: number) => 10 - (30 / 54) * (y - 4); // wing leading edge x at span y
  return (
    <>
      <Sym p={wing} fill={base} sw={sw} />
      <Sym p={stab} fill={base} sw={sw} />
      {g && <><polygon points={pts([[2, -14], [-6, -30], [-16, -30], [-9, -14]])} fill={patch} /><polygon points={pts(mirror([[2, -14], [-6, -30], [-16, -30], [-9, -14]]))} fill={patch} />
        <polygon points={pts([[-8, -40], [-14, -52], [-22, -52], [-18, -40]])} fill={patch} /><polygon points={pts(mirror([[-8, -40], [-14, -52], [-22, -52], [-18, -40]]))} fill={patch} /></>}
      {[16, 32, -16, -32].map((y) => (
        <g key={y}>
          <rect x={leX(Math.abs(y)) - 9} y={y - 4.2} width={20} height={8.4} rx={3} fill={pod} {...SW(sw)} />
          <line x1={leX(Math.abs(y)) - 9} y1={y} x2={leX(Math.abs(y)) + 11} y2={y} stroke={INK} strokeWidth={sw * 0.6} />
          <rect x={leX(Math.abs(y)) + 9} y={y - 3.2} width={2.4} height={6.4} fill="#0E0E10" />
        </g>
      ))}
      <path d="M50,0 C47,-3.8 42,-4.4 36,-4.4 L-36,-3.6 L-53,-1.2 L-53,1.2 L-36,3.6 L36,4.4 C42,4.4 47,3.8 50,0 Z" fill={base} {...SW(sw)} />
      <polygon points="38,-2.2 44,-1.2 44,1.2 38,2.2" fill="#27323F" />
      <line x1={-30} y1={0} x2={-52} y2={0} stroke={INK} strokeWidth={sw * 1.6} />
    </>
  );
};

const F111: React.FC<SpriteProps> = ({ sw }) => (
  <>
    <Sym p={[[12, -6], [-30, -25], [-40, -25], [-34, -7]]} fill="#7B7F54" sw={sw} />
    <Sym p={[[-34, -6], [-52, -17], [-57, -17], [-51, -5]]} fill="#6C7049" sw={sw} />
    <path d="M50,0 C46,-3 38,-5.5 28,-6.5 L-30,-7 L-52,-4 L-52,4 L-30,7 L28,6.5 C38,5.5 46,3 50,0 Z" fill="#8A8F5E" {...SW(sw)} />
    <Canopy x={30} rx={8} ry={3} />
    <rect x={8} y={-8} width={10} height={3.5} fill="#2A2C22" /><rect x={8} y={4.5} width={10} height={3.5} fill="#2A2C22" />
    <circle cx={-52} cy={-2.8} r={2.4} fill="#1A1A1C" /><circle cx={-52} cy={2.8} r={2.4} fill="#1A1A1C" />
  </>
);

const F4: React.FC<SpriteProps> = ({ sw }) => (
  <>
    <Sym p={[[14, -6], [-12, -32], [-22, -32], [-30, -6]]} fill="#8E8A62" sw={sw} />
    <Sym p={[[-40, -4], [-52, -17], [-57, -17], [-52, -4]]} fill="#6E7A4E" sw={sw} />
    <path d="M50,0 C46,-2.6 40,-4.4 32,-5.2 L26,-8 L10,-8 L2,-6 L-30,-5.4 L-52,-3.6 L-52,3.6 L-30,5.4 L2,6 L10,8 L26,8 L32,5.2 C40,4.4 46,2.6 50,0 Z" fill="#7C8858" {...SW(sw)} />
    <polygon points="26,-8 10,-8 8,-5 24,-5" fill="#2B2E22" /><polygon points="26,8 10,8 8,5 24,5" fill="#2B2E22" />
    <Canopy x={30} rx={9} ry={2.8} />
    <polygon points={pts([[-14, -18], [-22, -26], [-26, -26], [-20, -18]])} fill="#A8A27A" opacity={0.9} />
    <circle cx={-52} cy={-2} r={2.2} fill="#1A1A1C" /><circle cx={-52} cy={2} r={2.2} fill="#1A1A1C" />
  </>
);

const KC135: React.FC<SpriteProps> = ({ sw }) => (
  <>
    <Sym p={[[12, -5], [-22, -47], [-30, -47], [-18, -5]]} fill="#D9DDE1" sw={sw} />
    <Sym p={[[-40, -4], [-52, -18], [-57, -18], [-52, -4]]} fill="#D9DDE1" sw={sw} />
    {[14, 28, -14, -28].map((y) => <rect key={y} x={12 - 0.81 * (Math.abs(y) - 5) - 9} y={y - 2.8} width={13} height={5.6} rx={2.5} fill="#9AA1A8" {...SW(sw)} />)}
    <path d="M50,0 C48,-4 42,-5.6 34,-5.6 L-40,-5.4 L-54,-2 L-54,2 L-40,5.4 L34,5.6 C42,5.6 48,4 50,0 Z" fill="#E6E9EC" {...SW(sw)} />
    <polygon points="40,-3.4 46,-1.8 46,1.8 40,3.4" fill="#27323F" />
    <path d="M50,0 C48,-4 45,-5 43,-5.5 L43,5.5 C45,5 48,4 50,0 Z" fill="#6B7178" />
    <line x1={-52} y1={0} x2={-62} y2={0} stroke={INK} strokeWidth={sw * 1.6} />
  </>
);

const EB66: React.FC<SpriteProps> = ({ sw }) => (
  <>
    <Sym p={[[10, -4], [-22, -44], [-30, -44], [-20, -5]]} fill="#B7BCC2" sw={sw} />
    <Sym p={[[-40, -3], [-50, -14], [-55, -14], [-52, -3]]} fill="#B7BCC2" sw={sw} />
    {[14, -14].map((y) => <rect key={y} x={-4 - 0.0} y={y - 3.8} width={22} height={7.6} rx={3.5} fill="#8D939A" {...SW(sw)} />)}
    {[44, -44].map((y) => <rect key={y} x={-27} y={y - 2.4} width={16} height={4.8} rx={2.2} fill="#4A5058" {...SW(sw)} />)}
    <path d="M50,0 C47,-3.6 42,-4.6 34,-4.8 L-40,-4.2 L-54,-1.5 L-54,1.5 L-40,4.2 L34,4.8 C42,4.6 47,3.6 50,0 Z" fill="#C6CACF" {...SW(sw)} />
    <ellipse cx={14} cy={0} rx={9} ry={2} fill="#4A5058" /><Canopy x={34} rx={6} ry={2.4} />
  </>
);

const MIG21: React.FC<SpriteProps> = ({ sw }) => (
  <>
    <Sym p={[[14, -5], [-22, -24], [-34, -24], [-32, -5]]} fill="#C3C8CE" sw={sw} />
    <Sym p={[[-38, -3.5], [-50, -12], [-55, -12], [-50, -3.5]]} fill="#B3B9C0" sw={sw} />
    <path d="M50,0 C48,-2.4 42,-4.6 34,-5.2 L-30,-5.6 L-50,-3.8 L-50,3.8 L-30,5.6 L34,5.2 C42,4.6 48,2.4 50,0 Z" fill="#CBD0D5" {...SW(sw)} />
    <ellipse cx={46} cy={0} rx={2.4} ry={3} fill="#3A3F46" /><ellipse cx={47.6} cy={0} rx={1.1} ry={1.4} fill="#C3C8CE" />
    <Canopy x={22} rx={8} ry={2.6} />
    <line x1={-6} y1={0} x2={-48} y2={0} stroke="#8D939A" strokeWidth={1.4} />
    <Roundel x={-12} y={-15} r={4.4} /><Roundel x={-12} y={15} r={4.4} />
  </>
);

export const TOP_SPRITES: Record<AircraftKind, React.FC<SpriteProps>> = { b52: B52, f111: F111, f4: F4, kc135: KC135, eb66: EB66, mig21: MIG21 };

/** Top-down aircraft at (x, y), `size` = length in px, `heading` degrees (0 = east, 90 = south). `id` makes the
 *  drop-shadow filter id unique. `roll` (-1..1, cos of a roll angle) squashes the span for tumbling planes. */
export const AircraftTop: React.FC<{
  id: string; kind: AircraftKind; x: number; y: number; size?: number; heading?: number; variant?: B52Variant; shadow?: boolean; roll?: number; opacity?: number;
}> = ({ id, kind, x, y, size = 100, heading = 0, variant = 'D', shadow = true, roll = 1, opacity = 1 }) => {
  const S = TOP_SPRITES[kind], k = size / 100, sw = Math.max(1.8, size * 0.022) / k;
  return (
    <g opacity={opacity} filter={shadow ? `url(#ac-sh-${id})` : undefined}>
      {shadow && <defs><filter id={`ac-sh-${id}`} x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx={size * 0.04} dy={size * 0.07} stdDeviation={size * 0.03} floodColor="#000" floodOpacity={0.4} /></filter></defs>}
      <g transform={`translate(${x},${y}) rotate(${heading}) scale(${k},${k * roll})`}><S sw={sw} variant={variant} /></g>
    </g>
  );
};
