import React from 'react';
import { star } from './ball-flags';
import { AircraftKind, B52Variant, INK, pts } from './aircraft-kinds';

// SIDE-VIEW aircraft sprites for close-ups, facing +x (right); `flip` mirrors them. 100 units long, centred on the
// fuselage axis (y = 0, up is negative). `sw` = outline width in sprite units.

type P = [number, number][];
type SpriteProps = { sw: number; variant?: B52Variant };
const SW = (sw: number) => ({ stroke: INK, strokeWidth: sw, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const });
const Poly: React.FC<{ p: P; fill: string; sw: number }> = ({ p, fill, sw }) => <polygon points={pts(p)} fill={fill} {...SW(sw)} />;
const Roundel: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g><circle cx={x} cy={y} r={r} fill="#DA251D" stroke="#FFCD00" strokeWidth={r * 0.18} /><polygon points={star(x, y, r * 0.72)} fill="#FFCD00" /></g>
);
const Pod: React.FC<{ x: number; y: number; w: number; fill: string; sw: number; far?: boolean }> = ({ x, y, w, fill, sw, far }) => (
  <g opacity={far ? 0.85 : 1}>
    <rect x={x - 1.6} y={y - 5} width={3.2} height={6} fill="#555B62" {...SW(sw * 0.8)} />
    <rect x={x - w / 2} y={y} width={w} height={7} rx={3.4} fill={fill} {...SW(sw)} />
    <rect x={x + w / 2 - 3} y={y + 0.8} width={2.6} height={5.4} rx={1} fill="#0E0E10" />
  </g>
);

const B52: React.FC<SpriteProps> = ({ sw, variant = 'D' }) => {
  const d = variant === 'D', top = d ? '#66744A' : '#C9CED2', belly = d ? '#17181B' : '#AEB4BA', pod = d ? '#3C4249' : '#8E959B';
  return (
    <>
      <Poly p={[[-30, -4], [-47, -31], [-57, -31], [-55, -3]]} fill={top} sw={sw} />
      {d && <polygon points={pts([[-34, -8], [-44, -26], [-50, -26], [-48, -8]])} fill="#A09468" />}
      <Poly p={[[-40, 1], [-62, 4], [-62, 7], [-40, 5]]} fill={top} sw={sw} />
      <path d="M52,2 C50,-1 46,-3.2 41,-4.6 L35,-6.6 L28,-5 L-30,-4 L-56,-3 L-56,3 L-30,4.4 L34,4.8 C44,4.8 50,4.6 52,2 Z" fill={top} {...SW(sw)} />
      <path d="M52,2 C50,4.8 44,4.8 34,4.8 L-30,4.4 L-56,3 L-56,0.4 L-30,0.6 L34,0.8 C46,0.8 50,1 52,2 Z" fill={belly} {...SW(sw * 0.5)} />
      <Pod x={-1} y={5} w={18} fill={pod} sw={sw} far /><Pod x={-8} y={5} w={18} fill={pod} sw={sw} />
      <Poly p={[[12, 1.5], [-18, 1.5], [-22, 5.5], [10, 4.5]]} fill={d ? '#4B5538' : '#B3B9BF'} sw={sw} />
      <Pod x={9} y={5} w={18} fill={pod} sw={sw} /><Pod x={2} y={6} w={18} fill={pod} sw={sw} far />
      <polygon points="43,-3.8 36,-5.8 36,-1.6 44,-1" fill="#27323F" />
      <line x1={10} y1={-4} x2={10} y2={0} stroke="#2E3322" strokeWidth={sw * 0.5} />
    </>
  );
};

const F111: React.FC<SpriteProps> = ({ sw }) => (
  <>
    <Poly p={[[-28, -6], [-43, -26], [-53, -26], [-51, -5]]} fill="#7B7F54" sw={sw} />
    <Poly p={[[-42, 2], [-58, 6], [-58, 9], [-42, 5]]} fill="#6C7049" sw={sw} />
    <Poly p={[[10, 1], [-26, 1], [-22, 4], [12, 3.4]]} fill="#6C7049" sw={sw} />
    <path d="M52,3 L42,-1.4 L32,-5 L24,-8 L10,-6.4 L-30,-6.2 L-52,-5 L-52,4 L-30,6 L12,6.4 L40,5.4 Z" fill="#8A8F5E" {...SW(sw)} />
    <path d="M32,-5 L26,-9.4 L14,-8.4 L10,-6.4 Z" fill="#27323F" stroke={INK} strokeWidth={sw * 0.7} />
    <rect x={8} y={-1} width={12} height={6} fill="#2A2C22" /><circle cx={-52} cy={0} r={3.4} fill="#1A1A1C" />
    <path d="M52,3 L46,-0.2 L46,5.4 Z" fill="#6A6F4A" />
  </>
);

const F4: React.FC<SpriteProps> = ({ sw }) => (
  <>
    <Poly p={[[-32, -6], [-45, -23], [-55, -23], [-52, -4]]} fill="#6E7A4E" sw={sw} />
    <Poly p={[[-44, 3], [-60, 11], [-60, 14], [-44, 6]]} fill="#7C8858" sw={sw} />
    <Poly p={[[12, 3], [-24, 3], [-22, 6], [12, 6]]} fill="#8E8A62" sw={sw} />
    <path d="M52,3 L44,-0.4 L34,-3.4 L28,-8.6 L12,-8.8 L6,-5.4 L-30,-5 L-53,-4.2 L-53,4.2 L-30,5.6 L8,6.6 L30,6.4 L44,5.4 Z" fill="#7C8858" {...SW(sw)} />
    <path d="M30,-4 L25,-9.4 L10,-9.6 L8,-5 Z" fill="#27323F" stroke={INK} strokeWidth={sw * 0.7} />
    <polygon points="24,-2 10,-3 10,5 24,5" fill="#2B2E22" /><line x1={14} y1={-2.5} x2={14} y2={5} stroke="#555B50" strokeWidth={0.8} />
    <circle cx={-53} cy={0} r={3.6} fill="#1A1A1C" />
    <circle cx={-26} cy={-1} r={3.2} fill="#A8A27A" stroke={INK} strokeWidth={0.6} />
  </>
);

const KC135: React.FC<SpriteProps> = ({ sw }) => (
  <>
    <Poly p={[[-30, -6], [-46, -27], [-56, -27], [-54, -5]]} fill="#D9DDE1" sw={sw} />
    <Poly p={[[-42, 3], [-60, 4], [-60, 6.4], [-42, 6]]} fill="#C8CDD2" sw={sw} />
    <Poly p={[[-40, 6], [-64, 13], [-66, 12], [-48, 5]]} fill="#6B7178" sw={sw} />
    <Poly p={[[16, 3.6], [-18, 3.6], [-22, 7], [14, 6.6]]} fill="#B9BFC5" sw={sw} />
    <Pod x={8} y={7} w={15} fill="#8D939A" sw={sw} /><Pod x={-3} y={7.5} w={15} fill="#8D939A" sw={sw} />
    <path d="M52,0 C50,-4.6 44,-6.6 34,-6.8 L-40,-6.4 L-56,-3 L-56,3 L-40,6.4 L34,6.8 C44,6.6 50,4.6 52,0 Z" fill="#E6E9EC" {...SW(sw)} />
    <path d="M52,0 C50,-4.6 47,-6 44,-6.4 L44,6.4 C47,6 50,4.6 52,0 Z" fill="#6B7178" />
    <path d="M42,-4.6 L34,-5.8 L34,-1.6 L42,-1.6 Z" fill="#27323F" />
    <line x1={-34} y1={-0.2} x2={30} y2={-0.2} stroke="#2E4D8F" strokeWidth={1.8} />
    {[24, 16, 8, 0, -8, -16, -24].map((x) => <circle key={x} cx={x} cy={-3} r={0.9} fill="#27323F" />)}
  </>
);

const EB66: React.FC<SpriteProps> = ({ sw }) => (
  <>
    <Poly p={[[-30, -4], [-45, -22], [-54, -22], [-52, -3]]} fill="#B7BCC2" sw={sw} />
    <Poly p={[[-42, 1.5], [-56, 4], [-56, 6.4], [-42, 5]]} fill="#B7BCC2" sw={sw} />
    <Poly p={[[10, 2], [-20, 2], [-22, 5], [8, 4.6]]} fill="#9AA0A7" sw={sw} />
    <rect x={-8} y={4} width={22} height={8} rx={4} fill="#8D939A" {...SW(sw)} />
    <path d="M52,2.4 C50,-1.4 44,-4.4 34,-5 L-34,-4.6 L-55,-2.4 L-55,2.8 L-34,4.6 L30,4.8 C44,4.8 50,4.6 52,2.4 Z" fill="#C6CACF" {...SW(sw)} />
    <ellipse cx={14} cy={-5.2} rx={9} ry={2.4} fill="#4A5058" {...SW(sw * 0.6)} />
    <path d="M36,-4.8 L30,-8.4 L22,-8.6 L20,-4.8 Z" fill="#27323F" stroke={INK} strokeWidth={sw * 0.7} />
    <rect x={-30} y={4.6} width={16} height={4} rx={2} fill="#4A5058" {...SW(sw * 0.7)} />
  </>
);

const MIG21: React.FC<SpriteProps> = ({ sw }) => (
  <>
    <Poly p={[[-30, -5], [-44, -19], [-53, -19], [-51, -4]]} fill="#B3B9C0" sw={sw} />
    <Poly p={[[-42, 1.4], [-56, 4], [-56, 6], [-42, 4]]} fill="#B3B9C0" sw={sw} />
    <Poly p={[[10, 2], [-30, 2], [-28, 4.2], [10, 3.6]]} fill="#B3B9C0" sw={sw} />
    <path d="M52,1 C48,-2.4 42,-4.4 34,-4.8 L28,-8 L18,-8 L12,-5.6 L-30,-5.4 L-52,-4.2 L-52,4.6 L-30,5.6 L30,5.6 C42,5.6 48,3 52,1 Z" fill="#CBD0D5" {...SW(sw)} />
    <path d="M52,1 C48,-2.4 46,-3.6 44,-4.2 L44,5.6 C48,3 50,2 52,1 Z" fill="#3A3F46" /><ellipse cx={45} cy={0.6} rx={3} ry={3.4} fill="#C3C8CE" stroke={INK} strokeWidth={sw * 0.6} />
    <path d="M28,-4.6 L24,-8.2 L17,-8.2 L14,-5 Z" fill="#27323F" stroke={INK} strokeWidth={sw * 0.7} />
    <Roundel x={-30} y={0} r={4.2} /><circle cx={-52} cy={0.2} r={3.2} fill="#2A2D32" />
  </>
);

export const SIDE_SPRITES: Record<AircraftKind, React.FC<SpriteProps>> = { b52: B52, f111: F111, f4: F4, kc135: KC135, eb66: EB66, mig21: MIG21 };

/** Side-view aircraft at (x, y), `size` = length in px, `flip` faces left, `pitch` degrees nose-up (negative = nose down). */
export const AircraftSide: React.FC<{
  kind: AircraftKind; x: number; y: number; size?: number; flip?: boolean; pitch?: number; variant?: B52Variant; opacity?: number;
}> = ({ kind, x, y, size = 300, flip = false, pitch = 0, variant = 'D', opacity = 1 }) => {
  const S = SIDE_SPRITES[kind], k = size / 100, sw = Math.max(1.6, size * 0.012) / k;
  return (
    <g opacity={opacity} transform={`translate(${x},${y}) rotate(${flip ? pitch : -pitch}) scale(${flip ? -k : k},${k})`}>
      <S sw={sw} variant={variant} />
    </g>
  );
};
