import React from 'react';
import { SCH, FONT, UI, backOut, clamp, easeOut } from '../../engine';

// Chapter B local props for the schematic number cards: a dot-matrix world map (a plain outline, labels only), small
// cut-cable icons, an oil barrel and a fuel pump line icon, the small source tag and the green "ĐÓ LÀ THẬT" stamp.
//   mapXY(lon, lat)                          screen point on the 1920 x 1080 card
//   <WorldDots id o />                       the dotted continents
//   <CutCable x y t at s />                  a severed cable with a spark, popping in at frame `at`
//   <BarrelIcon x y s on />   <PumpIcon x y s on />   line icons about 170 tall
//   <SourceTag x y t text />   <ThatStamp x y t />

const MAP = { x0: 150, y0: 250, w: 1620, h: 640, lon0: -170, lon1: 190, lat0: 80, lat1: -58 };
export const mapXY = (lon: number, lat: number) => ({
  x: MAP.x0 + ((lon - MAP.lon0) / (MAP.lon1 - MAP.lon0)) * MAP.w,
  y: MAP.y0 + ((MAP.lat0 - lat) / (MAP.lat0 - MAP.lat1)) * MAP.h,
});

// very coarse continent outlines (lon, lat): a dot map only needs the silhouettes
const LAND: [number, number][][] = [
  [[-168, 66], [-156, 71], [-125, 70], [-95, 72], [-80, 70], [-62, 58], [-56, 50], [-67, 44], [-75, 38], [-81, 31], [-80, 25], [-84, 30], [-90, 29], [-97, 26], [-97, 20], [-90, 21], [-87, 21], [-88, 16], [-83, 10], [-77, 8], [-86, 12], [-92, 15], [-105, 20], [-110, 24], [-115, 30], [-118, 34], [-124, 40], [-124, 48], [-135, 58], [-150, 60], [-165, 60]],
  [[-55, 60], [-45, 60], [-20, 70], [-20, 80], [-60, 82], [-72, 78], [-58, 68]],
  [[-77, 8], [-62, 10], [-50, 0], [-35, -6], [-39, -14], [-48, -26], [-58, -38], [-65, -42], [-68, -52], [-73, -52], [-74, -40], [-71, -20], [-81, -5], [-80, 2]],
  [[-10, 37], [-9, 43], [-2, 47], [2, 51], [8, 54], [8, 58], [5, 62], [12, 66], [18, 70], [30, 71], [45, 68], [60, 70], [75, 73], [100, 77], [115, 74], [140, 72], [160, 70], [180, 68], [180, 65], [170, 60], [160, 55], [155, 58], [142, 52], [135, 43], [128, 40], [125, 38], [121, 40], [122, 30], [120, 25], [110, 20], [108, 12], [105, 9], [100, 13], [100, 5], [103, 1], [98, 8], [98, 16], [92, 22], [88, 22], [80, 15], [77, 8], [72, 20], [67, 25], [58, 25], [56, 27], [50, 26], [56, 25], [58, 20], [52, 16], [44, 12], [39, 20], [35, 28], [34, 31], [36, 36], [30, 36], [27, 37], [23, 40], [22, 37], [19, 41], [13, 45], [16, 41], [18, 40], [15, 38], [12, 42], [8, 44], [3, 43], [-1, 38], [-6, 36]],
  [[-17, 21], [-10, 30], [-6, 36], [10, 37], [20, 33], [32, 31], [34, 28], [38, 18], [43, 12], [51, 12], [42, 0], [40, -10], [35, -25], [26, -34], [18, -34], [12, -18], [13, -5], [9, 3], [-8, 5], [-17, 14]],
  [[114, -22], [122, -18], [131, -12], [137, -12], [142, -11], [146, -19], [153, -26], [150, -37], [141, -38], [131, -31], [115, -34]],
  [[-5, 50], [1, 51], [2, 56], [-3, 59], [-6, 56]],
  [[130, 31], [135, 34], [141, 38], [142, 44], [140, 41], [137, 36], [131, 33]],
  [[95, 5], [106, -6], [104, -5], [98, 2]],
  [[109, 1], [117, 7], [119, 1], [116, -3], [110, -3]],
  [[44, -25], [49, -15], [50, -14], [47, -25]],
];

const inside = (px: number, py: number, poly: [number, number][]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

// the dots are worked out once, at module load (deterministic)
const DOTS: { x: number; y: number }[] = (() => {
  const out: { x: number; y: number }[] = [];
  const step = 3.4; // degrees between dots
  for (let lat = 80; lat > -58; lat -= step) {
    for (let lon = -170; lon < 190; lon += step) {
      if (LAND.some((p) => inside(lon, lat, p))) out.push(mapXY(lon, lat));
    }
  }
  return out;
})();

export const WorldDots: React.FC<{ o?: number; color?: string }> = ({ o = 1, color = '#3F6290' }) => (
  <g opacity={o} fill={color}>
    {DOTS.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={6.2} />)}
  </g>
);

/** A cable cut in two with a spark: pops in at frame `at`; `s` scales it. About 120 wide. */
export const CutCable: React.FC<{ x: number; y: number; t: number; at: number; s?: number }> = ({ x, y, t, at, s = 1 }) => {
  const k = t - at;
  if (k < 0) return null;
  const pop = backOut(clamp(k / 6));
  const spark = k < 14 ? 1 - k / 14 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * pop})`}>
      <circle r={44} fill="#FF4A3A" opacity={0.22} />
      <path d="M -60 8 Q -40 -8 -14 4 L -8 6" stroke={SCH.line} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M 60 -8 Q 40 8 14 -4 L 8 -6" stroke={SCH.line} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M -6 -22 L 6 -8 L -4 -2 L 8 14" stroke="#FF4A3A" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {spark > 0 ? <path d="M 0 0 L 30 -30 M 0 0 L -30 -26 M 0 0 L 4 34 M 0 0 L -32 24" stroke="#FFD27A" strokeWidth={5} strokeLinecap="round" opacity={spark} /> : null}
    </g>
  );
};

const glowStyle = (on: boolean) => (on ? { filter: `drop-shadow(0 0 12px ${SCH.glow})` } : undefined);

/** An oil barrel as a schematic line icon, centred, about 170 tall. */
export const BarrelIcon: React.FC<{ x: number; y: number; s?: number; on?: boolean }> = ({ x, y, s = 1, on = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={on ? SCH.live : SCH.line} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" style={glowStyle(on)}>
    <path d="M -60 -78 Q -68 0 -60 78 Q 0 98 60 78 Q 68 0 60 -78 Q 0 -98 -60 -78 Z" />
    <path d="M -64 -34 Q 0 -16 64 -34 M -64 34 Q 0 52 64 34" />
    <path d="M 0 -26 Q 22 4 18 20 A 18 18 0 0 1 -18 20 Q -22 4 0 -26 Z" fill={on ? `${SCH.live}55` : 'none'} />
  </g>
);

/** A fuel pump as a line icon, centred, about 170 tall. */
export const PumpIcon: React.FC<{ x: number; y: number; s?: number; on?: boolean }> = ({ x, y, s = 1, on = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={on ? SCH.live : SCH.line} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" style={glowStyle(on)}>
    <rect x={-48} y={-84} width={80} height={166} rx={8} />
    <rect x={-34} y={-68} width={52} height={38} rx={5} fill={on ? `${SCH.live}33` : 'none'} />
    <path d="M -58 82 H 42" />
    <path d="M 32 -40 H 58 Q 76 -40 76 -22 V 36 Q 76 54 92 54 Q 108 54 108 38 V -28 L 90 -52" />
  </g>
);

/** The small source tag: "NGUỒN  ACCESS NOW" in a dark pill; pops on from t = 0. */
export const SourceTag: React.FC<{ x: number; y: number; t: number; text: string; anchor?: 'start' | 'middle' }> = ({ x, y, t, text, anchor = 'start' }) => {
  if (t < 0) return null;
  const k = easeOut(clamp(t / 8));
  const w = text.length * 20 + 130;
  const x0 = anchor === 'middle' ? -w / 2 : 0;
  return (
    <g transform={`translate(${x} ${y})`} opacity={k}>
      <rect x={x0} y={-34} width={w} height={56} rx={28} fill={UI.pill} opacity={0.85} stroke={SCH.dim} strokeWidth={2} />
      <text x={x0 + 24} y={4} fontFamily={FONT.ui} fontSize={22} fill={SCH.dim} letterSpacing={3}>NGUỒN</text>
      <text x={x0 + 120} y={5} fontFamily={FONT.ui} fontWeight={700} fontSize={27} fill={UI.text} letterSpacing={2}>{text}</text>
    </g>
  );
};

/** The green "ĐÓ LÀ THẬT" pill with a tick, stamped on at frame 0. */
export const ThatStamp: React.FC<{ x: number; y: number; t: number; rot?: number }> = ({ x, y, t, rot = -3 }) => {
  const k = backOut(clamp(t / 6));
  const tick = easeOut(clamp((t - 2) / 7));
  if (t < 0) return null;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>
      <rect x={-380} y={-70} width={760} height={140} rx={70} fill="#2DBE6C" stroke="#0E5A32" strokeWidth={6} />
      <path d="M -330 0 l 28 30 l 52 -62" stroke="#E9FFF2" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - tick} />
      <text x={50} y={26} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={78} fill="#06301B" letterSpacing={3}>ĐÓ LÀ THẬT</text>
    </g>
  );
};
