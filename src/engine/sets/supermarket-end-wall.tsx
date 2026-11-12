import React from 'react';
import { rnd } from '../anim';
import { Room } from '../room';
import { Glow, SkyView } from '../light';
import { FONT } from '../fonts';
import { Art, PAL, flatMapper, Kind } from './supermarket-goods';
import { Ball } from './toy-sprites';

// The far end of the aisle, where it opens onto the cross aisle: glass entrance doors onto the dusk (the daylight
// when the power is gone), a green EXIT sign above them, an upright freezer bank on the left (a toy wall in the toy
// store) with a chest freezer (a ball pit) in front of it, and a checkout lane on the right with its lit lane sign.
// All of it sits on or near the back wall, so it is drawn flat in back-wall coordinates, plus a few boxes in perspective.

const X = (r: Room, u: number) => r.back.x0 + (r.back.x1 - r.back.x0) * u;
const Y = (r: Room, v: number) => r.back.y0 + (r.back.y1 - r.back.y0) * v;

export const END = {
  door: { u0: 0.38, u1: 0.64, v0: 0.17 },
  freezer: { u0: 0.08, u1: 0.37 },
  chest: { u: [0.14, 0.4] as [number, number], w: [0.03, 0.13] as [number, number], v0: 0.8 },
};
/** Where the green EXIT sign is on screen. */
export const exitAt = (r: Room) => ({ x: X(r, 0.51), y: Y(r, 0.1) });
/** Where the entrance doors' opening is (centre), for the veil holes and the spill of light. */
export const doorAt = (r: Room) => ({ x: X(r, 0.51), y: Y(r, 0.6) });

const GREEN = '#46E08A';

/** The sign over the doors: a green box, a running arrow and "LỐI THOÁT". Lit always; its glow is the veil's last hole. */
const ExitSign: React.FC<{ r: Room; id: string; dark: number }> = ({ r, id, dark }) => {
  const { x, y } = exitAt(r);
  return (
    <g>
      <defs>
        <radialGradient id={`${id}grn`}>
          <stop offset="0%" stopColor={GREEN} stopOpacity={0.9} />
          <stop offset="35%" stopColor={GREEN} stopOpacity={0.3} />
          <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
        </radialGradient>
      </defs>
      <path d={`M ${x - 40} ${y - 16} L ${x - 40} ${Y(r, 0)} M ${x + 40} ${y - 16} L ${x + 40} ${Y(r, 0)}`} stroke="#15171E" strokeWidth={2} />
      <rect x={x - 54} y={y - 14} width={108} height={28} rx={4} fill="#103A26" stroke="#15171E" strokeWidth={3} />
      <rect x={x - 51} y={y - 11} width={102} height={22} rx={2} fill={GREEN} />
      <path d={`M ${x - 43} ${y} L ${x - 31} ${y} M ${x - 36} ${y - 5} L ${x - 31} ${y} L ${x - 36} ${y + 5}`} stroke="#0A2A1A" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <text x={x + 8} y={y + 5} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={13} fill="#0A2A1A">LỐI THOÁT</text>
      <circle cx={x} cy={y} r={90 + dark * 90} fill={`url(#${id}grn)`} opacity={0.25 + 0.55 * dark} style={{ mixBlendMode: 'screen' }} />
    </g>
  );
};

/** Glass entrance doors onto the sky: two leaves, a push bar, the sensor box, a mat, decals and a stripe of reflection. */
const Doors: React.FC<{ r: Room; id: string; t: number; night: boolean; red: number }> = ({ r, id, t, night, red }) => {
  const x0 = X(r, END.door.u0);
  const x1 = X(r, END.door.u1);
  const y0 = Y(r, END.door.v0) + 20;
  const y1 = Y(r, 1);
  const w = x1 - x0;
  return (
    <g>
      <rect x={x0 - 8} y={y0 - 26} width={w + 16} height={y1 - y0 + 26} fill="#1A1D26" />
      <SkyView id={`${id}door`} clip={`M ${x0} ${y0} L ${x1} ${y0} L ${x1} ${y1} L ${x0} ${y1} Z`} box={{ x: x0, y: y0, w, h: y1 - y0 }} t={t} sun={{ x: x0 + w * 0.3, y: y1 - 52 }} sunR={30} red={red} night={night} />
      <rect x={x0} y={y1 - 36} width={w} height={36} fill={night ? '#12141F' : '#2A2736'} />
      <path d={`M ${x0} ${y1 - 36} L ${x1} ${y1 - 36}`} stroke={night ? '#3A4A7A' : '#FFB46A'} strokeWidth={2} opacity={0.6} />
      {/* the leaves, the push bars, a safety decal band, a soft diagonal reflection */}
      <rect x={x0 + w / 2 - 2} y={y0} width={4} height={y1 - y0} fill="#15171E" />
      <rect x={x0} y={y0 + 14} width={w} height={4} fill="#15171E" />
      {[0.38, 0.62].map((k) => (
        <rect key={k} x={x0 + w * k - 2} y={y0 + (y1 - y0) * 0.5} width={4} height={34} rx={2} fill="#9AA3B2" />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={i} cx={x0 + 6 + i * ((w - 12) / 11)} cy={y0 + (y1 - y0) * 0.44} r={2.4} fill="#fff" opacity={0.4} />
      ))}
      <polygon points={`${x0 + 10},${y1 - 36} ${x0 + 40},${y1 - 36} ${x0 + 90},${y0} ${x0 + 60},${y0}`} fill="#fff" opacity={0.07} />
      <rect x={x0 - 8} y={y0 - 26} width={w + 16} height={14} fill="#2A2F3C" />
      <rect x={x0 + w / 2 - 14} y={y0 - 24} width={28} height={9} rx={2} fill="#0F1118" />
      <circle cx={x0 + w / 2} cy={y0 - 20} r={2} fill="#D94452" />
    </g>
  );
};

/** The upright freezer bank: three glass doors, frost, shelves of tubs and cartons, a light box over it. Off when dark. */
const FreezerBank: React.FC<{ r: Room; id: string; dark: number }> = ({ r, id, dark }) => {
  const x0 = X(r, END.freezer.u0);
  const x1 = X(r, END.freezer.u1);
  const y0 = Y(r, 0.2);
  const y1 = Y(r, 1);
  const n = 3;
  const dw = (x1 - x0) / n;
  const on = 1 - dark;
  const kinds: Kind[] = ['jar', 'box', 'carton', 'jar'];
  const items: React.ReactNode[] = [];
  for (let d = 0; d < n; d++) {
    for (let s = 0; s < 4; s++) {
      const by = y0 + 12 + (s + 1) * ((y1 - y0 - 18) / 4) - 4;
      let x = x0 + d * dw + 4;
      let i = 0;
      while (x < x0 + (d + 1) * dw - 14) {
        const w = 11 + rnd(d * 9 + s, i) * 6;
        items.push(<Art key={`${d}-${s}-${i}`} kind={kinds[Math.floor(rnd(d * 3 + s * 7, i + 40) * 4)]} m={flatMapper(x, by, w, 22 + rnd(s, i + 9) * 8)} c1={PAL[Math.floor(rnd(d + s * 5, i) * PAL.length)]} c2={PAL[Math.floor(rnd(d + s * 3, i + 20) * PAL.length)]} c3="#F4EBD2" />);
        x += w + 2;
        i++;
      }
    }
  }
  return (
    <g>
      <rect x={x0 - 4} y={y0 - 4} width={x1 - x0 + 8} height={y1 - y0 + 4} fill="#1E2330" />
      <rect x={x0 + 2} y={y0 + 4} width={x1 - x0 - 4} height={y1 - y0 - 4} fill={dark > 0.5 ? '#161B27' : '#CFEFFF'} opacity={dark > 0.5 ? 1 : 0.85} />
      <g opacity={0.35 + 0.65 * on}>{items}</g>
      {Array.from({ length: n + 1 }).map((_, d) => (
        <rect key={d} x={x0 + d * dw - 2} y={y0} width={4} height={y1 - y0} fill="#1E2330" />
      ))}
      {Array.from({ length: 4 }).map((_, s) => (
        <rect key={s} x={x0} y={y0 + 12 + (s + 1) * ((y1 - y0 - 18) / 4) - 2} width={x1 - x0} height={3} fill="#9AA3B2" opacity={0.7} />
      ))}
      {/* frost on the glass and door handles */}
      {Array.from({ length: n }).map((_, d) => (
        <g key={d}>
          <polygon points={`${x0 + d * dw + 6},${y1 - 6} ${x0 + d * dw + 16},${y1 - 6} ${x0 + d * dw + 36},${y0 + 10} ${x0 + d * dw + 26},${y0 + 10}`} fill="#fff" opacity={0.12} />
          <rect x={x0 + (d + 1) * dw - 9} y={y0 + (y1 - y0) * 0.35} width={4} height={50} rx={2} fill="#C9D1DD" />
        </g>
      ))}
      <rect x={x0 - 4} y={y0 - 24} width={x1 - x0 + 8} height={22} rx={3} fill={dark > 0.5 ? '#1F3944' : '#7FD8F0'} />
      <rect x={x0 - 4} y={y0 - 24} width={x1 - x0 + 8} height={22} rx={3} fill="#fff" opacity={0.25 * on} />
      <text x={(x0 + x1) / 2} y={y0 - 8} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={15} fill={dark > 0.5 ? '#3A6A7A' : '#0E4A66'}>KEM</text>
      <Glow x={(x0 + x1) / 2} y={(y0 + y1) / 2} r={150} kind="cool" o={0.5 * on} />
    </g>
  );
};

/** The toy wall that replaces the freezer bank in the toy store: shelves of boxed toys and a lit header. */
const ToyWall: React.FC<{ r: Room; dark: number }> = ({ r, dark }) => {
  const x0 = X(r, END.freezer.u0);
  const x1 = X(r, END.freezer.u1);
  const y0 = Y(r, 0.2);
  const y1 = Y(r, 1);
  const rows = 4;
  const items: React.ReactNode[] = [];
  for (let s = 0; s < rows; s++) {
    const by = y0 + 8 + (s + 1) * ((y1 - y0 - 14) / rows) - 4;
    let x = x0 + 2;
    let i = 0;
    while (x < x1 - 14) {
      const w = 16 + rnd(s, i) * 8;
      items.push(<Art key={`${s}-${i}`} kind="toybox" m={flatMapper(x, by, w, 30 + rnd(s + 3, i) * 6)} c1={PAL[Math.floor(rnd(s * 3, i) * PAL.length)]} c2={PAL[Math.floor(rnd(s * 5, i + 7) * PAL.length)]} c3="#F4EBD2" />);
      x += w + 2;
      i++;
    }
  }
  return (
    <g>
      <rect x={x0 - 4} y={y0 - 4} width={x1 - x0 + 8} height={y1 - y0 + 4} fill="#2B2F3F" />
      {items}
      {Array.from({ length: rows }).map((_, s) => (
        <rect key={s} x={x0} y={y0 + 8 + (s + 1) * ((y1 - y0 - 14) / rows) - 2} width={x1 - x0} height={4} fill="#8D96A8" />
      ))}
      <rect x={x0 - 4} y={y0 - 24} width={x1 - x0 + 8} height={22} rx={3} fill={dark > 0.5 ? '#4A2A44' : '#E86AA6'} />
      <text x={(x0 + x1) / 2} y={y0 - 8} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={14} fill={dark > 0.5 ? '#7A5A74' : '#FFF4E0'}>ĐỒ CHƠI</text>
    </g>
  );
};

/** The chest freezer in the cross aisle: a white body, glass lids that slide open (`open` 0..1), tubs inside and cold mist. */
const Chest: React.FC<{ r: Room; t: number; open: number; dark: number }> = ({ r, t, open, dark }) => {
  const { Q, P } = r;
  const [u0, u1] = END.chest.u;
  const [w0, w1] = END.chest.w;
  const v0 = END.chest.v0;
  const on = 1 - dark;
  const tubs: React.ReactNode[] = [];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 3; j++) {
      const uc = u0 + 0.025 + (i + 0.5) * ((u1 - u0 - 0.05) / 6);
      const wc = w0 + 0.012 + (j + 0.5) * ((w1 - w0 - 0.024) / 3);
      const ring = Array.from({ length: 10 }).map((_, k) => [uc + Math.cos((k / 10) * 6.283) * 0.017, v0 + 0.01, wc + Math.sin((k / 10) * 6.283) * 0.012] as [number, number, number]);
      tubs.push(<polygon key={`${i}${j}`} points={Q(ring)} fill={PAL[(i * 3 + j * 5) % PAL.length]} />);
    }
  }
  const lidW = (u1 - u0) / 2;
  const slide = open * lidW * 0.9;
  const c = P((u0 + u1) / 2, v0, (w0 + w1) / 2);
  return (
    <g>
      <polygon points={Q([[u0 - 0.01, 1, w0], [u1 + 0.03, 1, w0], [u1 + 0.03, 1, w1 + 0.03], [u0 - 0.01, 1, w1 + 0.03]])} fill="#000" opacity={0.35} />
      <polygon points={Q([[u0, v0, w0], [u1, v0, w0], [u1, v0, w1], [u0, v0, w1]])} fill="#0F1A26" />
      <polygon points={Q([[u0 + 0.01, v0 + 0.004, w0 + 0.008], [u1 - 0.01, v0 + 0.004, w0 + 0.008], [u1 - 0.01, v0 + 0.004, w1 - 0.008], [u0 + 0.01, v0 + 0.004, w1 - 0.008]])} fill={dark > 0.5 ? '#233042' : '#BDEBFF'} />
      <g opacity={0.45 + 0.55 * on}>{tubs}</g>
      {/* the glass lids, one sliding over the other */}
      {[0, 1].map((k) => {
        const a = u0 + k * lidW + (k === 1 ? -slide : 0);
        const b = a + lidW;
        return <polygon key={k} points={Q([[a, v0 - 0.006, w0], [b, v0 - 0.006, w0], [b, v0 - 0.006, w1], [a, v0 - 0.006, w1]])} fill="#DDF4FF" opacity={0.28 + (k ? 0.1 : 0)} stroke="#F4FBFF" strokeWidth={1.5} />;
      })}
      {/* body: front and the side that shows */}
      <polygon points={Q([[u0, v0, w1], [u1, v0, w1], [u1, 1, w1], [u0, 1, w1]])} fill="#C3CEDB" />
      <polygon points={Q([[u0, v0 + 0.03, w1], [u1, v0 + 0.03, w1], [u1, v0 + 0.05, w1], [u0, v0 + 0.05, w1]])} fill="#3E9BD6" />
      <polygon points={Q([[u1, v0, w0], [u1, v0, w1], [u1, 1, w1], [u1, 1, w0]])} fill="#8E9BAC" />
      <path d={`M ${P(u0, v0, w1).x} ${P(u0, v0, w1).y} L ${P(u1, v0, w1).x} ${P(u1, v0, w1).y}`} stroke="#FFD39A" strokeWidth={2.5} opacity={0.6} />
      {open > 0 ? (
        <g filter="url(#blur6)" style={{ mixBlendMode: 'screen' }}>
          {Array.from({ length: 7 }).map((_, i) => {
            const ph = ((t * 0.012 + i / 7) % 1 + 1) % 1;
            return <ellipse key={i} cx={c.x + (rnd(5, i) - 0.5) * 120 + Math.sin(t / 22 + i) * 12} cy={c.y - 8 - ph * 46} rx={26 + ph * 20} ry={8 + ph * 8} fill="#E8F6FF" opacity={0.3 * (1 - ph) * open} />;
          })}
        </g>
      ) : null}
      <Glow x={c.x} y={c.y - 10} r={150} kind="cool" o={0.55 * on} />
    </g>
  );
};

/** The ball pit that replaces the chest in the toy store: a blue bin heaped with balls. */
const BallPit: React.FC<{ r: Room }> = ({ r }) => {
  const { Q, P } = r;
  const [u0, u1] = END.chest.u;
  const [w0, w1] = END.chest.w;
  const v0 = END.chest.v0 + 0.02;
  const k = r.s((w0 + w1) / 2);
  return (
    <g>
      <polygon points={Q([[u0 - 0.01, 1, w0], [u1 + 0.03, 1, w0], [u1 + 0.03, 1, w1 + 0.03], [u0 - 0.01, 1, w1 + 0.03]])} fill="#000" opacity={0.35} />
      <polygon points={Q([[u0, v0, w0], [u1, v0, w0], [u1, v0, w1], [u0, v0, w1]])} fill="#2A4A78" />
      {Array.from({ length: 22 }).map((_, i) => {
        const p = P(u0 + 0.02 + rnd(8, i) * (u1 - u0 - 0.04), v0, w0 + 0.01 + rnd(9, i) * (w1 - w0 - 0.02));
        return <Ball key={i} x={p.x} y={p.y - 4 * k - rnd(10, i) * 6} r={9 * k} c1={PAL[i % PAL.length]} c2={PAL[(i + 3) % PAL.length]} c3={PAL[(i + 7) % PAL.length]} />;
      })}
      <polygon points={Q([[u0, v0, w1], [u1, v0, w1], [u1, 1, w1], [u0, 1, w1]])} fill="#3E7BC0" />
      <polygon points={Q([[u1, v0, w0], [u1, v0, w1], [u1, 1, w1], [u1, 1, w0]])} fill="#2E5E98" />
      <path d={`M ${P(u0, v0, w1).x} ${P(u0, v0, w1).y} L ${P(u1, v0, w1).x} ${P(u1, v0, w1).y}`} stroke="#FFD39A" strokeWidth={2.5} opacity={0.6} />
    </g>
  );
};

/** The checkout lane on the right: counter and belt in perspective, a till with its screen, items on the belt, the lane sign. */
const Checkout: React.FC<{ r: Room; dark: number }> = ({ r, dark }) => {
  const { Q, P } = r;
  const on = 1 - dark;
  const sx = X(r, 0.76);
  const sy = Y(r, 0.1);
  return (
    <g>
      <polygon points={Q([[0.64, 1, 0], [0.9, 1, 0], [0.9, 1, 0.15], [0.64, 1, 0.15]])} fill="#000" opacity={0.3} />
      <polygon points={Q([[0.66, 0.8, 0], [0.88, 0.8, 0], [0.88, 0.8, 0.13], [0.66, 0.8, 0.13]])} fill="#20232C" />
      <polygon points={Q([[0.665, 0.8, 0.015], [0.875, 0.8, 0.015], [0.875, 0.8, 0.045], [0.665, 0.8, 0.045]])} fill="#3A3F4C" />
      <polygon points={Q([[0.66, 0.8, 0.13], [0.88, 0.8, 0.13], [0.88, 1, 0.13], [0.66, 1, 0.13]])} fill="#3F6F78" />
      <polygon points={Q([[0.66, 0.84, 0.13], [0.88, 0.84, 0.13], [0.88, 0.86, 0.13], [0.66, 0.86, 0.13]])} fill="#F6B93B" />
      {/* items on the belt */}
      {[0.69, 0.73, 0.775].map((u, i) => {
        const p = P(u, 0.8, 0.09);
        const kk = r.s(0.09);
        return <Art key={i} kind={(['box', 'bottle', 'carton'] as Kind[])[i]} m={flatMapper(p.x - 7 * kk, p.y, 14 * kk, 22 * kk)} c1={PAL[(i * 4 + 2) % PAL.length]} c2={PAL[(i * 3 + 7) % PAL.length]} c3="#F4EBD2" />;
      })}
      {/* the till and its screen */}
      {(() => {
        const p = P(0.835, 0.8, 0.04);
        const kk = r.s(0.04);
        return (
          <g>
            <rect x={p.x - 15 * kk} y={p.y - 24 * kk} width={30 * kk} height={24 * kk} rx={3} fill="#2C303C" />
            <rect x={p.x - 11 * kk} y={p.y - 44 * kk} width={22 * kk} height={16 * kk} rx={2} fill={dark > 0.5 ? '#1A1E27' : '#7FE0C8'} />
            <path d={`M ${p.x} ${p.y - 28 * kk} L ${p.x} ${p.y - 24 * kk}`} stroke="#2C303C" strokeWidth={4} />
          </g>
        );
      })()}
      {/* the lane sign, hanging from the ceiling */}
      <path d={`M ${sx - 22} ${Y(r, 0)} L ${sx - 22} ${sy - 12} M ${sx + 22} ${Y(r, 0)} L ${sx + 22} ${sy - 12}`} stroke="#15171E" strokeWidth={2} />
      <rect x={sx - 28} y={sy - 12} width={56} height={26} rx={4} fill={dark > 0.5 ? '#1F2A33' : '#2FB7A6'} stroke="#15171E" strokeWidth={3} />
      <text x={sx} y={sy + 8} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={20} fill={dark > 0.5 ? '#3A5560' : '#06302B'}>3</text>
      <Glow x={sx} y={sy} r={70} kind="cool" o={0.5 * on} />
    </g>
  );
};

/** A string of pennant flags across the back wall, swaying a touch. Cheap colour and a count of objects. */
const Bunting: React.FC<{ r: Room; t: number; dark: number }> = ({ r, t, dark }) => {
  const x0 = X(r, 0.1);
  const x1 = X(r, 0.9);
  const n = 16;
  return (
    <g opacity={1 - 0.6 * dark}>
      {Array.from({ length: n }).map((_, i) => {
        const x = x0 + (i / (n - 1)) * (x1 - x0);
        const y = Y(r, 0.03) + 14 * Math.sin((i / (n - 1)) * Math.PI) + Math.sin(t / 30 + i) * 0.8;
        return <path key={i} d={`M ${x - 7} ${y} L ${x + 7} ${y} L ${x} ${y + 17} Z`} fill={PAL[(i * 5) % PAL.length]} />;
      })}
      <path d={`M ${x0} ${Y(r, 0.03)} Q ${(x0 + x1) / 2} ${Y(r, 0.03) + 28} ${x1} ${Y(r, 0.03)}`} stroke="#15171E" strokeWidth={1.5} fill="none" />
    </g>
  );
};

export const EndWall: React.FC<{ r: Room; id: string; t: number; toys: boolean; dark: number; night: boolean; red: number; chestOpen: number }> = ({ r, id, t, toys, dark, night, red, chestOpen }) => (
  <g>
    <Bunting r={r} t={t} dark={dark} />
    {toys ? <ToyWall r={r} dark={dark} /> : <FreezerBank r={r} id={id} dark={dark} />}
    <Doors r={r} id={id} t={t} night={night} red={red} />
    <ExitSign r={r} id={id} dark={dark} />
    <Checkout r={r} dark={dark} />
    {toys ? <BallPit r={r} /> : <Chest r={r} t={t} open={chestOpen} dark={dark} />}
  </g>
);
