// Angkor Wat silhouettes as SVG path strings (pure functions), shared by the Cambodian flags and the AngkorWat prop.
//   ANGKOR_DK_PATH   Democratic Kampuchea 1975-79 flag emblem: 3 towers (Wikimedia Commons "Flag of Democratic Kampuchea.svg", 900x600 box)
//   ANGKOR_PRK_PATH  People's Republic of Kampuchea 1979-89 flag emblem: 5 blocky towers (Commons "Flag of the People's Republic of
//                    Kampuchea.svg", 900x600 box). Both flags are public-domain state symbols; colours red #DA121A, yellow #FCDD09.
//   angkorPath(o)    a drawn 5-tower temple (State of Cambodia / today's flag, and the prop): base at y = 0, x centred on 0, `w` wide,
//                    towers pointing up (negative y): tiered "lotus bud" towers (centre tallest, outer pair lowest), stepped terraces.

export const ANGKOR_DK_PATH = 'm616.4 391.3v24.1h-332.8v-24.1h23.3v-24.4h23.3v-63.1h11.2c6.2-29.2 17.1-57.5 29.5-57.5s23.3 28.3 29.5 57.5h2c9.3-59.9 26.8-119.2 47.6-119.2s39.5 59.2 48.8 119.2h2c6.2-29.2 17.1-57.5 29.5-57.5s23.3 28.3 29.5 57.5h10.2v63.1h23.3v24.4h23.1z';
export const ANGKOR_PRK_PATH = 'M450 150l-18.75 18.75V240H412.5v-41.25L393.75 180 375 198.75V300h-18.75v-41.25L337.5 240l-18.75 18.75V330H280v30h-40v30h420v-30h-40v-30h-38.75v-71.25L562.5 240l-18.75 18.75V300H525V198.75L506.25 180l-18.75 18.75V240h-18.75v-71.25z';

const f = (n: number) => n.toFixed(2);

/** One tiered lotus-bud tower: base centre (cx, y0), half-width hw, height h. 4 tiers that step in, then a pointed finial. */
const tower = (cx: number, y0: number, hw: number, h: number): string => {
  const tiers = 4, pts: [number, number][] = [];
  pts.push([cx - hw, y0]);
  for (let i = 0; i < tiers; i++) {
    const yb = y0 - h * (0.12 + i * 0.17), wo = hw * (1.08 - i * 0.2), wi = hw * (0.96 - i * 0.2);
    pts.push([cx - wo, yb], [cx - wi, yb - h * 0.035]);
  }
  pts.push([cx - hw * 0.16, y0 - h * 0.86], [cx, y0 - h]);
  const right = pts.slice(0, -1).reverse().map(([x, y]) => [2 * cx - x, y] as [number, number]);
  return 'M' + [...pts, ...right].map(([x, y]) => `${f(x)},${f(y)}`).join('L') + 'Z';
};

/** Five-tower Angkor Wat silhouette, `w` px wide, base at (0,0). `towers` 3 or 5. Returns one path (fill it). */
export function angkorPath(w = 200, towers: 3 | 5 = 5): string {
  const k = w / 200;
  const r = (x0: number, y0: number, x1: number, y1: number) => `M${f(x0 * k)},${f(y0 * k)}H${f(x1 * k)}V${f(y1 * k)}H${f(x0 * k)}Z`;
  let d = r(-100, -8, 100, 0) + r(-92, -16, 92, -8) + r(-84, -26, 84, -16) + r(-78, -40, 78, -26);
  // gallery roof line between the towers (low gables)
  d += `M${f(-78 * k)},${f(-40 * k)}L${f(-70 * k)},${f(-47 * k)}H${f(70 * k)}L${f(78 * k)},${f(-40 * k)}Z`;
  const T = towers === 5 ? [[-58, 12, 46], [-30, 14, 56], [0, 17, 70], [30, 14, 56], [58, 12, 46]] : [[-36, 15, 52], [0, 18, 70], [36, 15, 52]];
  for (const [cx, hw, h] of T) d += tower(cx * k, -40 * k, hw * k, h * k);
  return d;
}

/** Height of angkorPath(w) above its base (for layout). */
export const angkorHeight = (w = 200) => (w / 200) * 110;
