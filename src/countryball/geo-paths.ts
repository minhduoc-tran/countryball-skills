import { Box, Ring } from './geo-data';
import { Camera, SCREEN, scaleX } from './geo-camera';

// Turns lon/lat rings into SVG path strings in screen px for one camera. Off-screen rings are culled by their
// bounding box, rings smaller than a pixel are dropped, and points closer than minStep px to the last kept one are
// skipped (cheap level-of-detail on top of the three data levels).

const f = (n: number) => n.toFixed(1);

export interface PathOpts { closed: boolean; minStep?: number; smooth?: boolean }

export function ringsPath(rings: Ring[], cam: Camera, view: Box, o: PathOpts): string {
  const kx = scaleX(cam), ky = cam.zoom, cx = (cam.w ?? SCREEN.W) / 2 - cam.lon * kx, cy = (cam.h ?? SCREEN.H) / 2 + cam.lat * ky;
  const minStep = o.minStep ?? 0.8;
  let d = '';
  for (const r of rings) {
    const bb = r.bb;
    if (bb[2] < view[0] || bb[0] > view[2] || bb[3] < view[1] || bb[1] > view[3]) continue;
    if (o.closed && (bb[2] - bb[0]) * kx < 1 && (bb[3] - bb[1]) * ky < 1) continue;
    const p = r.pts, xs: number[] = [], ys: number[] = [];
    for (let i = 0; i < p.length; i += 2) {
      const x = cx + p[i] * kx, y = cy - p[i + 1] * ky, n = xs.length;
      if (n && Math.abs(x - xs[n - 1]) < minStep && Math.abs(y - ys[n - 1]) < minStep && i < p.length - 2) continue;
      xs.push(x); ys.push(y);
    }
    const n = xs.length;
    if (n < 2) continue;
    if (o.smooth && n > 2) {
      // Quadratic curve through the mid-points: takes the polygon corners off river lines at high zoom.
      d += `M${f(xs[0])},${f(ys[0])}`;
      for (let i = 1; i < n - 1; i++) d += `Q${f(xs[i])},${f(ys[i])} ${f((xs[i] + xs[i + 1]) / 2)},${f((ys[i] + ys[i + 1]) / 2)}`;
      d += `L${f(xs[n - 1])},${f(ys[n - 1])}`;
    } else {
      d += `M${f(xs[0])},${f(ys[0])}`;
      for (let i = 1; i < n; i++) d += `L${f(xs[i])},${f(ys[i])}`;
      if (o.closed) d += 'Z';
    }
  }
  return d;
}
