import React from 'react';
import { makeRoom } from '../room';
import { RoomShell, stand } from '../furnish';
import { Glow, LightVeil, Dust } from '../light';
import { FONT } from '../fonts';
import { lerp } from '../anim';
import { ShoppingCart, CanStack } from '../food-props';
import { makeGoods, ShelfSide, FloorDebris, SHELF } from './supermarket-goods';
import { EndWall, doorAt, exitAt } from './supermarket-end-wall';
import { Teddy } from './toy-sprites';

export { PillowFort } from './pillow-fort';
export { Teddy, Ball, ToyRobot, ToyCar, GiftBox } from './toy-sprites';
export { MacroRow, macroRow, FloorDebris } from './supermarket-goods';

// The supermarket: an aisle seen down its length in one-point perspective, built with the room kit. Tall shelf bays
// packed with generic goods run down both sides (u 0 to 0.18 and 0.82 to 1; their faces are the planes u 0.18 and 0.82
// from w 0.21 to the camera); at the far end the aisle opens onto a cross aisle (w 0 to 0.2): glass entrance doors
// onto the dusk with a green EXIT sign, an upright freezer bank and a chest freezer on the left, a checkout lane on the
// right. Fluorescent strips run along the ceiling (one flickers), aisle signs hang from it, price tags line the shelf
// edges and the tiled floor mirrors the shelves. `toys` turns the same building into a toy store.
//
// Placing characters: stand(SUPERMARKET, u, w) or aisleStand(u, w) (the same, at 0.55 of the ceiling height). The aisle
// is u 0.22 to 0.78, w 0.2 (the cross aisle) to 0.95. Good marks: the middle of the aisle (0.5, 0.55); by the cart
// (0.46, 0.55) with the cart at CART_AT (0.64, 0.5); at the chest freezer in front of the freezer bank (0.5, 0.13),
// the chest itself at u 0.14-0.4, w 0.03-0.13; in front of the doors (0.5, 0.1). Back wall: x 710-1210, y 330-600,
// the vanishing point (960, 457). Shelf faces: rows' bottoms at v 0.43 0.575 0.72 0.865 0.965 (SHELF).

export const SUPERMARKET = makeRoom({ x: 960, y: 457 }, { x0: 710, x1: 1210, y0: 330, y1: 600 }, 4.6);
/** Hip point and scale for someone standing in the aisle at (u, w): stand() with a person 0.55 of the ceiling height. */
export const aisleStand = (u: number, w: number, k = 0.55) => stand(SUPERMARKET, u, w, k);
/** Where the shopping cart is left (u, w), and the cart's screen position and scale there. */
export const CART_AT = { u: 0.64, w: 0.5 };
export const cartAt = (u = CART_AT.u, w = CART_AT.w) => {
  const p = SUPERMARKET.P(u, 1, w);
  return { x: p.x, y: p.y, s: 0.4 * SUPERMARKET.s(w) };
};

/** Flicker for one failing tube: pure in t (a few frames of dip each ~2 s). */
const flick = (t: number) => {
  const ph = ((Math.floor(t) % 64) + 64) % 64;
  return ph >= 40 && ph < 42 ? 0.15 : ph === 44 ? 0.55 : ph >= 46 && ph < 48 ? 0.3 : 1;
};

const SIGNS = {
  food: [['ĐỒ HỘP', '#243A66'], ['BÁNH KẸO', '#7A2E3A'], ['ĐỒ UỐNG', '#1F5E4C']] as [string, string][],
  toys: [['XE & ROBOT', '#1F5E7C'], ['GẤU BÔNG', '#6E3A8C'], ['ĐỒ CHƠI', '#8C4A1F']] as [string, string][],
};

/** Aisle signs hanging from the ceiling on two wires, facing the camera: far to near. */
const HangingSigns: React.FC<{ toys: boolean; dark: number }> = ({ toys, dark }) => {
  const R = SUPERMARKET;
  const list = toys ? SIGNS.toys : SIGNS.food;
  return (
    <g>
      {[0.3, 0.52, 0.74].map((w, i) => {
        const a = R.P(0.34, 0.06, w);
        const b = R.P(0.66, 0.15, w);
        const k = R.s(w);
        return (
          <g key={i}>
            {[0.37, 0.63].map((u) => (
              <path key={u} d={`M ${R.P(u, 0, w).x} ${R.P(u, 0, w).y} L ${R.P(u, 0.06, w).x} ${R.P(u, 0.06, w).y}`} stroke="#15171E" strokeWidth={2 * k * 0.6} />
            ))}
            <rect x={a.x - 3} y={a.y - 3} width={b.x - a.x + 6} height={b.y - a.y + 6} rx={5 * k * 0.5} fill="#15171E" />
            <rect x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} rx={3 * k * 0.5} fill={list[i][1]} />
            <rect x={a.x} y={a.y} width={b.x - a.x} height={(b.y - a.y) * 0.16} fill="#F6D04D" opacity={0.9 - 0.5 * dark} />
            <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 + (b.y - a.y) * 0.3} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={(b.y - a.y) * 0.56} fill="#F6EFDC" opacity={1 - 0.5 * dark}>{list[i][0]}</text>
          </g>
        );
      })}
    </g>
  );
};

/** Ceiling: tile grid, fluorescent strips (tube 3 flickers), their glow on the floor and the long streaks they leave on it. */
const CeilingLights: React.FC<{ t: number; dark: number }> = ({ t, dark }) => {
  const R = SUPERMARKET;
  const grid: React.ReactNode[] = [];
  for (let i = 1; i < 10; i++) grid.push(<path key={`cg${i}`} d={`M ${R.P(i / 10, 0, 0).x} ${R.P(i / 10, 0, 0).y} L ${R.P(i / 10, 0, 1).x} ${R.P(i / 10, 0, 1).y}`} stroke="#222631" strokeWidth={2} />);
  for (let j = 1; j < 16; j++) grid.push(<path key={`cw${j}`} d={`M ${R.P(0, 0, j / 16).x} ${R.P(0, 0, j / 16).y} L ${R.P(1, 0, j / 16).x} ${R.P(1, 0, j / 16).y}`} stroke="#222631" strokeWidth={2} />);
  const strips: React.ReactNode[] = [];
  const floor: React.ReactNode[] = [];
  let idx = 0;
  [0.34, 0.66].forEach((uc) => {
    for (let w = 0.1; w < 0.98; w += 0.15) {
      const on = (idx === 3 ? flick(t) : 1) * (1 - dark);
      const w1 = w + 0.1;
      strips.push(<polygon key={`st${idx}`} points={R.Q([[uc - 0.035, 0, w], [uc + 0.035, 0, w], [uc + 0.035, 0, w1], [uc - 0.035, 0, w1]])} fill="#2E3340" />);
      strips.push(<polygon key={`sl${idx}`} points={R.Q([[uc - 0.028, 0, w + 0.005], [uc + 0.028, 0, w + 0.005], [uc + 0.028, 0, w1 - 0.005], [uc - 0.028, 0, w1 - 0.005]])} fill="#F2FAFF" opacity={0.12 + 0.88 * on} />);
      if (on > 0.05) {
        const c = R.P(uc, 0, (w + w1) / 2);
        strips.push(<Glow key={`sg${idx}`} x={c.x} y={c.y + 14 * R.s((w + w1) / 2)} r={150 * R.s((w + w1) / 2)} kind="cool" o={0.4 * on} />);
        floor.push(<polygon key={`fs${idx}`} points={R.Q([[uc - 0.05, 1, w], [uc + 0.05, 1, w], [uc + 0.05, 1, w1], [uc - 0.05, 1, w1]])} fill="#DDEBFF" opacity={0.1 * on} />);
      }
      idx++;
    }
  });
  const streak = (uc: number) => R.Q([[uc - 0.012, 1, 0.12], [uc + 0.012, 1, 0.12], [uc + 0.03, 1, 1], [uc - 0.03, 1, 1]]);
  return (
    <g>
      {grid}
      {strips}
      <g style={{ mixBlendMode: 'screen' }}>{floor}</g>
      <g filter="url(#blur6)" style={{ mixBlendMode: 'screen' }} opacity={1 - dark}>
        {[0.34, 0.66].map((uc) => <polygon key={uc} points={streak(uc)} fill="#EAF4FF" opacity={0.13} />)}
      </g>
    </g>
  );
};

/** A yellow A-frame "wet floor" sign (no words, a slipping figure): contact shadow and all. */
const WetSign: React.FC<{ u: number; w: number }> = ({ u, w }) => {
  const p = SUPERMARKET.P(u, 1, w);
  const k = SUPERMARKET.s(w) * 0.42;
  return (
    <g transform={`translate(${p.x} ${p.y}) scale(${k})`}>
      <ellipse cx={4} cy={2} rx={46} ry={7} fill="#000" opacity={0.4} />
      <path d="M -34 0 L -18 -92 L 18 -92 L 34 0 Z" fill="#F6C23B" />
      <path d="M -34 0 L -18 -92 L -4 -92 L -10 0 Z" fill="#000" opacity={0.14} />
      <circle cx={0} cy={-68} r={6} fill="#1D1A26" />
      <path d="M 0 -62 L 6 -42 L 18 -30 M 6 -42 L -10 -26 M 0 -58 L -14 -50 M 0 -58 L 14 -52" stroke="#1D1A26" strokeWidth={4} strokeLinecap="round" fill="none" />
      <path d="M 18 -92 L 34 0" stroke="#FFD39A" strokeWidth={2.5} opacity={0.6} />
    </g>
  );
};

/**
 * The set. `t` the clock (flicker, sways), `id` unique per shot. `veil` the contrast pass (0.34; the more, the darker the
 * mid-tones). `toys` the same building as a toy store. `dark` 0..1: the power is gone (strips and freezers off, only the
 * daylight from the doors and the green EXIT glow). `night`: the doors look onto the night. `empty` 0..1: the shelves go
 * bare and things lie on the floor. `red` the turn's red. `cart` draws the abandoned cart (turn it off to draw your own
 * in front of a character). `chestOpen` 0..1 slides the freezer chest's lids and lets the mist out.
 */
export const Supermarket: React.FC<{ t: number; id?: string; veil?: number; toys?: boolean; dark?: number; night?: boolean; empty?: number; red?: number; cart?: boolean; chestOpen?: number }> = ({
  t, id = 'mkt', veil = 0.34, toys = false, dark = 0, night = false, empty = 0, red = 0, cart = true, chestOpen = 0,
}) => {
  const R = SUPERMARKET;
  const L = React.useMemo(() => makeGoods(R, 0, toys), [toys]);
  const Rt = React.useMemo(() => makeGoods(R, 1, toys), [toys]);
  const door = doorAt(R);
  const exit = exitAt(R);
  const c = cartAt();
  const stackAt = R.P(0.72, 1, 0.42);
  const wall = toys ? '#58486E' : '#4C5262';
  const lights: [number, number, number][] = [
    [door.x, door.y, 250 + 130 * dark],
    [exit.x, exit.y, 150 + 60 * dark],
    ...[0.2, 0.45, 0.7, 0.95].map((w) => [R.P(0.5, 0.5, w).x, R.P(0.5, 0.5, w).y, 300 * R.s(w) * (1 - dark)] as [number, number, number]),
    [R.P(0.24, 0.7, 0).x, R.P(0.24, 0.7, 0).y, 150 * (1 - dark)],
    [R.P(0.76, 0.5, 0).x, R.P(0.76, 0.5, 0).y, 110 * (1 - dark)],
  ];
  return (
    <g>
      <RoomShell r={R} id={id} floor="tiles" wall={wall} side="#3A3E4C" floorC={toys ? '#3A3446' : '#363C48'} ceiling="#292D39" lines="#272B36" />
      {/* floor tint under the strips and the soft doorway pool, then the end wall */}
      <polygon points={R.Q([[0.38, 1, 0], [0.64, 1, 0], [0.86, 1, 0.9], [0.14, 1, 0.9]])} fill={night ? '#9FC0FF' : '#FFB46A'} opacity={(night ? 0.07 : 0.1) * (1 + 1.5 * dark)} style={{ mixBlendMode: 'screen' }} />
      <EndWall r={R} id={id} t={t} toys={toys} dark={dark} night={night} red={red} chestOpen={chestOpen} />
      <CeilingLights t={t} dark={dark} />
      {/* plush on top of the bays in the toy store, drawn behind the header bands */}
      {toys
        ? ([[0, 0.37, '#B9794A', '#D9534F'], [0, 0.72, '#E8A0B4', '#3E9BD6'], [1, 0.52, '#F2D58A', '#8E6AD8'], [1, 0.86, '#9FC6E8', '#E4572E']] as [0 | 1, number, string, string][]).map(([side, w, fur, bow], i) => {
            const p = R.P(SHELF.uIn[side] + (side ? 0.03 : -0.03), SHELF.top, w);
            return <Teddy key={i} x={p.x} y={p.y + 4} h={0.19 * (R.back.y1 - R.back.y0) * R.s(w)} fur={fur} belly="#F4E4C4" bow={bow} shadow={false} />;
          })
        : null}
      <ShelfSide r={R} id={`${id}L`} side={0} goods={L} empty={empty} header={toys ? ['#8E3F9C', '#E86AA6'] : ['#2F6FA8', '#D94452']} />
      <ShelfSide r={R} id={`${id}R`} side={1} goods={Rt} empty={empty} header={toys ? ['#2FB7A6', '#F28F3B'] : ['#E08A2E', '#3E8C58']} />
      {/* contact shadow where the bays meet the floor */}
      <polygon points={R.Q([[0.18, 1, 0.21], [0.25, 1, 0.21], [0.25, 1, 1], [0.18, 1, 1]])} fill="#000" opacity={0.3} />
      <polygon points={R.Q([[0.75, 1, 0.21], [0.82, 1, 0.21], [0.82, 1, 1], [0.75, 1, 1]])} fill="#000" opacity={0.3} />
      <HangingSigns toys={toys} dark={dark} />
      {/* floor dressing: a stack of tins on promotion (or a toy tower), a wet-floor sign, the abandoned cart */}
      {!toys ? <CanStack x={stackAt.x} y={stackAt.y} s={0.42 * R.s(0.42)} n={Math.round(10 * (1 - Math.min(1, empty * 1.2)))} /> : null}
      <WetSign u={0.33} w={0.3} />
      <FloorDebris r={R} n={empty * 26} toys={toys} />
      {cart ? <ShoppingCart x={c.x} y={c.y} s={c.s} /> : null}
      <LightVeil id={`${id}veil`} lights={lights} o={lerp(veil, 0.8, dark)} />
      <Glow x={door.x} y={door.y} r={300 + 120 * dark} kind={night ? 'cool' : 'warm'} o={(night ? 0.3 : 0.5) * (0.6 + 0.6 * dark) * (1 - red)} />
      <Dust t={t} seed={17} x0={850} y0={400} w={250} h={260} n={30} o={0.5} />
      {red > 0 ? <rect x={-1500} y={-1500} width={5000} height={4500} fill="#3A0010" opacity={0.35 * red} style={{ mixBlendMode: 'multiply' }} /> : null}
    </g>
  );
};
