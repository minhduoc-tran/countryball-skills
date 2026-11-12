import React from 'react';
import { clamp, backOut, FONT, Glow, Hero, Pose, Bedroom, Look, LOOKS } from '../../engine';
import { Sticky, Spinner, Battery } from './chb-notes-and-icons';

// Chapter B props (2/4): Pip's desk (drawn OVER Pip so it hides his legs), the laptop seen from the side, the laptop
// screen as a full-frame insert (slide editor, loading wheel, typed text), and the generic chat phone with Mo.

export const DESK = { x0: 860, x1: 1580, y: 742 };

/** The desk front: top slab with a lit edge, a drawer unit, legs, a contact shadow. Draw after Pip. */
export const DeskFront: React.FC<{ x0?: number; x1?: number; y?: number }> = ({ x0 = DESK.x0, x1 = DESK.x1, y = DESK.y }) => {
  const floor = y + 230;
  return (
    <g>
      <ellipse cx={(x0 + x1) / 2} cy={floor + 6} rx={(x1 - x0) * 0.56} ry={18} fill="#000" opacity={0.4} />
      <rect x={x0} y={y} width={x1 - x0} height={22} fill="#7A5747" />
      <rect x={x0} y={y} width={x1 - x0} height={4} fill="#FFD9A0" opacity={0.55} />
      <rect x={x0 + 14} y={y + 22} width={x1 - x0 - 28} height={46} fill="#4A3430" />
      <rect x={x0 + 14} y={y + 68} width={26} height={floor - y - 68} fill="#3E2B28" />
      <rect x={x1 - 40} y={y + 68} width={26} height={floor - y - 68} fill="#3E2B28" />
      <rect x={x0 + 40} y={y + 68} width={x1 - x0 - 290} height={floor - y - 68} fill="#2A1D1A" />
      <rect x={x0 + 40} y={y + 68} width={x1 - x0 - 290} height={floor - y - 68} fill="url(#g3fadeDown)" />
      <rect x={x1 - 250} y={y + 68} width={210} height={150} fill="#43302B" />
      <rect x={x1 - 238} y={y + 80} width={186} height={58} rx={4} fill="#4E3832" />
      <rect x={x1 - 176} y={y + 102} width={62} height={8} rx={4} fill="#B89A6A" />
      <rect x={x0 + 14} y={y + 22} width={x1 - x0 - 28} height={floor - y - 22} fill="#120A0C" opacity={0.28} />
    </g>
  );
};

/** The laptop from the side, on the desk at (x, y = desk top): base slab, the lid's back with the sticky on it, the
 *  screen's light spilling toward Pip (left). `glow` 0..1; `note` shows the MAI LÀM note (t = frames since it landed). */
export const SideLaptop: React.FC<{ x: number; y?: number; glow?: number; note?: number; open?: number }> = ({ x, y = DESK.y, glow = 1, note = 99, open = 1 }) => {
  const top = 150 * open;
  return (
    <g>
      <Glow x={x - 60} y={y - top * 0.55} r={260} kind="cool" o={0.55 * glow} />
      <ellipse cx={x + 40} cy={y + 4} rx={150} ry={9} fill="#000" opacity={0.35} />
      <path d={`M ${x - 80} ${y} L ${x + 150} ${y} L ${x + 138} ${y - 14} L ${x - 66} ${y - 14} Z`} fill="#8A8EA6" />
      <path d={`M ${x - 80} ${y} L ${x + 150} ${y} L ${x + 150} ${y + 4} L ${x - 80} ${y + 4} Z`} fill="#5A5E78" />
      <path d={`M ${x + 52} ${y - 14} L ${x + 150} ${y - 16} L ${x + 170} ${y - top - 10} L ${x + 70} ${y - top - 8} Z`} fill="#3A3C4C" />
      <path d={`M ${x + 52} ${y - 14} L ${x + 70} ${y - top - 8}`} stroke="#BFD6FF" strokeWidth={5} opacity={0.9 * glow} />
      {open > 0.5 ? <Sticky x={x + 112} y={y - top * 0.5 - 4} t={note} rot={-6} s={0.62} /> : null}
    </g>
  );
};

/** The laptop screen as a full-frame insert: a bezel and a base, `children` drawn inside the screen rect (SCREEN). */
export const SCREEN = { x: 330, y: 120, w: 1260, h: 720 };
export const ScreenFrame: React.FC<{ id: string; children: React.ReactNode; glow?: number }> = ({ id, children, glow = 1 }) => (
  <g>
    <defs><clipPath id={`${id}scr`}><rect x={SCREEN.x} y={SCREEN.y} width={SCREEN.w} height={SCREEN.h} rx={8} /></clipPath></defs>
    <rect x={-400} y={-400} width={2720} height={1880} fill="#0A0814" />
    <Glow x={960} y={480} r={900} kind="cool" o={0.5 * glow} />
    <rect x={SCREEN.x - 36} y={SCREEN.y - 34} width={SCREEN.w + 72} height={SCREEN.h + 68} rx={28} fill="#24222E" stroke="#3A3C4C" strokeWidth={6} />
    <g clipPath={`url(#${id}scr)`}>{children}</g>
    <path d={`M ${SCREEN.x - 120} ${SCREEN.y + SCREEN.h + 50} L ${SCREEN.x + SCREEN.w + 120} ${SCREEN.y + SCREEN.h + 50} L ${SCREEN.x + SCREEN.w + 80} ${SCREEN.y + SCREEN.h + 110} L ${SCREEN.x - 80} ${SCREEN.y + SCREEN.h + 110} Z`} fill="#8A8EA6" />
    <rect x={900} y={SCREEN.y + SCREEN.h + 50} width={120} height={14} rx={7} fill="#5A5E78" />
  </g>
);

/** A slide editor: thumbnail strip on the left, the slide on the right. `children` go on the slide (slide space 0..800 x 0..450). */
export const SlideEditor: React.FC<{ t: number; title?: string; children?: React.ReactNode; menu?: React.ReactNode }> = ({ t, title = 'HỆ MẶT TRỜI', children, menu }) => (
  <g>
    <rect x={SCREEN.x} y={SCREEN.y} width={SCREEN.w} height={SCREEN.h} fill="#E9E6F0" />
    <rect x={SCREEN.x} y={SCREEN.y} width={SCREEN.w} height={54} fill="#CFCAE0" />
    <circle cx={SCREEN.x + 28} cy={SCREEN.y + 27} r={8} fill="#E0604E" />
    <circle cx={SCREEN.x + 56} cy={SCREEN.y + 27} r={8} fill="#E8B84A" />
    <circle cx={SCREEN.x + 84} cy={SCREEN.y + 27} r={8} fill="#5FBF6A" />
    <text x={SCREEN.x + 130} y={SCREEN.y + 36} fontFamily={FONT.ui} fontSize={24} fill="#4A4660">{title}.pptx</text>
    {menu}
    <rect x={SCREEN.x} y={SCREEN.y + 54} width={210} height={SCREEN.h - 54} fill="#D8D3E8" />
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${SCREEN.x + 24} ${SCREEN.y + 84 + i * 150})`}>
        <rect width={162} height={110} rx={6} fill="#FFFFFF" stroke={i === 0 ? '#E8742E' : '#B8B2CC'} strokeWidth={i === 0 ? 5 : 2} />
        <rect x={16} y={18} width={90} height={12} fill="#8A84A6" />
        <rect x={16} y={44} width={130} height={8} fill="#C4BEDA" />
        {i === 0 ? null : <rect x={16} y={62} width={110} height={8} fill="#C4BEDA" />}
      </g>
    ))}
    <g transform={`translate(${SCREEN.x + 290} ${SCREEN.y + 120}) scale(1.4)`}>
      <rect width={800} height={450} fill="#FFFFFF" stroke="#B8B2CC" strokeWidth={2} />
      <rect x={0} y={0} width={800} height={14} fill="#1F2A55" />
      <text x={400} y={90} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={64} fill="#1F2A55">{title}</text>
      {children}
    </g>
  </g>
);

/** A loading wheel on a blank page, with a one-bar wifi mark and the battery in the corner. `pct` the battery level. */
export const SlowNetworkScreen: React.FC<{ t: number; pct: number }> = ({ t, pct }) => (
  <g>
    <rect x={SCREEN.x} y={SCREEN.y} width={SCREEN.w} height={SCREEN.h} fill="#F2F0F8" />
    <rect x={SCREEN.x} y={SCREEN.y} width={SCREEN.w} height={54} fill="#CFCAE0" />
    <g transform={`translate(${SCREEN.x + SCREEN.w - 250} ${SCREEN.y + 27})`}>
      {[0, 1, 2, 3].map((i) => <rect key={i} x={i * 16} y={14 - i * 8} width={10} height={6 + i * 8} fill={i === 0 ? '#2E2B3D' : '#B8B2CC'} />)}
      <Battery x={130} y={0} pct={pct} s={0.5} t={t} />
    </g>
    <Spinner x={960} y={470} r={110} t={t} color="#6F6AA0" />
    <text x={960} y={650} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#8A84A6" opacity={0.5 + 0.5 * Math.sin(t / 5) ** 2}>...</text>
  </g>
);

/** The generic chat phone, portrait. Mo's message (grey, left) lands at `moAt`, Pip's reply (orange, right) at `replyAt`. */
export const ChatPhone: React.FC<{ x: number; y: number; t: number; moAt?: number; replyAt?: number; buzz?: number; s?: number }> = ({ x, y, t, moAt = 8, replyAt = 999, buzz = 0, s = 1 }) => {
  const W = 440;
  const H = 880;
  const jx = buzz > 0 ? Math.sin(t * 9.1) * 4 * buzz : 0;
  const bubble = (at: number, mine: boolean, text: string, yy: number, w: number) => {
    const k = backOut(clamp((t - at) / 6));
    if (t < at) return null;
    return (
      <g transform={`translate(${mine ? W / 2 - 34 - w : -W / 2 + 34} ${yy}) scale(${k})`} style={{ transformOrigin: mine ? 'right' : 'left' }}>
        <rect width={w} height={96} rx={44} fill={mine ? '#FF8A3D' : '#E6E3EE'} />
        <text x={w / 2} y={64} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill={mine ? '#2A1608' : '#2E2B3D'}>{text}</text>
      </g>
    );
  };
  const typing = t >= moAt - 12 && t < moAt;
  return (
    <g transform={`translate(${x + jx} ${y}) scale(${s})`}>
      <rect x={-W / 2 + 14} y={-H / 2 + 20} width={W} height={H} rx={64} fill="#000" opacity={0.4} />
      <rect x={-W / 2 - 12} y={-H / 2 - 12} width={W + 24} height={H + 24} rx={72} fill="#1A1824" stroke="#3A3C4C" strokeWidth={4} />
      <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={60} fill="#F6F4FA" />
      <rect x={-W / 2} y={-H / 2} width={W} height={150} rx={60} fill="#DAD6EA" />
      <rect x={-W / 2} y={-H / 2 + 90} width={W} height={60} fill="#DAD6EA" />
      {/* Mo's avatar: olive jacket, curls */}
      <g transform={`translate(${-W / 2 + 80} ${-H / 2 + 92})`}>
        <circle r={38} fill="#5E6E46" />
        <circle r={28} cy={-4} fill="#C98E68" />
        {[-150, -120, -90, -60, -30].map((d, i) => <circle key={i} cx={Math.cos((d * Math.PI) / 180) * 26} cy={-4 + Math.sin((d * Math.PI) / 180) * 26} r={11} fill="#2A1C18" />)}
      </g>
      <text x={-W / 2 + 140} y={-H / 2 + 108} fontFamily={FONT.title} fontWeight={800} fontSize={46} fill="#2E2B3D">Mo</text>
      {typing ? (
        <g transform={`translate(${-W / 2 + 34} ${-H / 2 + 200})`}>
          <rect width={140} height={80} rx={40} fill="#E6E3EE" />
          {[0, 1, 2].map((i) => <circle key={i} cx={40 + i * 30} cy={40 - Math.max(0, Math.sin(t / 3 - i)) * 9} r={8} fill="#8A84A6" />)}
        </g>
      ) : null}
      {bubble(moAt, false, 'Xong chưa mày?', -H / 2 + 200, 372)}
      {bubble(replyAt, true, 'Sắp', -H / 2 + 330, 150)}
    </g>
  );
};

/** Lamp-lit desk props for wide shots: a mug and a pen cup next to the laptop (kept tiny so they never fight the face). */
export const DeskClutter: React.FC<{ y?: number }> = ({ y = DESK.y }) => (
  <g>
    <rect x={930} y={y - 40} width={44} height={40} rx={6} fill="#C9B79A" />
    <path d={`M 974 ${y - 30} q 20 4 0 22`} stroke="#C9B79A" strokeWidth={6} fill="none" />
    <rect x={1010} y={y - 20} width={80} height={14} rx={2} fill="#4A5A7A" />
    <rect x={1014} y={y - 32} width={74} height={14} rx={2} fill="#8A7A4A" />
  </g>
);

/** Pip's seat behind the desk (profile, facing the laptop on his right): hips just under the desk top so the desk hides his legs. */
export const SEAT: Partial<Pose> = { x: 1120, y: 764, scale: 1.05, yaw: 0.7, facing: 1, armL: { a: 52, b: -10 }, armR: { a: 70, b: -16 } };

/**
 * The whole desk shot's world: the night bedroom, Pip (drawn with `pose`), the desk over his legs, the laptop and clutter.
 * `over` draws on top (labels, effects). `rim` is the rim-light id. Everything is a pure function of t.
 */
export const DeskScene: React.FC<{ t: number; id: string; pose: Pose; look?: Look; clock?: string; glow?: number; note?: number; lidOpen?: number; clutter?: boolean; over?: React.ReactNode; behind?: React.ReactNode; crossed?: number }> = ({
  t, id, pose, look = LOOKS.pipHood, clock = '21:40', glow = 1, note = 99, lidOpen = 1, clutter = true, over, behind, crossed = 0,
}) => (
  <g>
    <Bedroom t={t + 30} id={id} crossed={crossed} clock={clock} />
    {behind}
    <Hero look={look} pose={pose} rimId="rimR" shadow={0} />
    <DeskFront />
    {clutter ? <DeskClutter /> : null}
    <SideLaptop x={1318} glow={glow} note={note} open={lidOpen} />
    {over}
  </g>
);
