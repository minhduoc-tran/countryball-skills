import React from 'react';
import {
  Hero, Pose, poseAt, kf, clamp, easeOut, LOOKS, Bedroom, BEDROOM, Desk, LaptopBack, Foreground, joints, toWorld,
} from '../../engine';
import { DawnBedroom } from '../last-one/shots-cha-morning-bedroom';
import { StickyNote, ScreenGlow } from './cha-note-and-chip-props';

// Pip's desk, the scene of chapter A: the bedroom (night with the lamp, or morning light), the desk across the middle
// of the frame, Pip behind it, the laptop's lid turned to the camera. The yellow notes live on that lid.

export const PIP = LOOKS.pipHood;
export const LID = { x: 960, y: 694, w: 200 }; // hinge middle of the laptop on the desk (lid height = 0.66 w)
export const LID_CENTER = { x: LID.x, y: LID.y - LID.w * 0.33 };

/** A note already on the lid: offsets from the lid's centre. */
export type LidNote = { dx: number; dy: number; rot?: number; pop?: number; curl?: number; w?: number };

export const LID_SPOTS: LidNote[] = [
  { dx: -4, dy: 6, rot: -5, w: 74 },
  { dx: -50, dy: -24, rot: 8, w: 66 },
  { dx: 44, dy: 18, rot: -11, w: 66 },
  { dx: 38, dy: -34, rot: 6, w: 62 },
  { dx: -42, dy: 30, rot: 14, w: 60 },
];

/** Pip's seated pose behind the desk (hips behind the laptop); `pose` overrides any field. */
export const deskPose = (pose: Partial<Pose> = {}): Pose =>
  poseAt(0, [{ f: 0, p: { x: 948, y: 718, yaw: 0.25, look: 0.1, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 }, ...pose } }]);

/** Pip seated behind his desk. `day` swaps the night room for morning light. `front` is drawn over the desk (mugs, notes). */
export const PipDesk: React.FC<{
  t: number; id: string; pose?: Partial<Pose>; day?: boolean; clock?: string; lamp?: number; lid?: number; glow?: number;
  notes?: LidNote[]; mess?: number; front?: React.ReactNode; face?: { expr: Pose['expr']; blink: number }; hidePip?: boolean;
}> = ({ t, id, pose = {}, day = false, clock = '23:59', lamp = 1, lid = 1, glow = 1, notes = [], mess = 0, front, face, hidePip = false }) => {
  const p = deskPose(pose);
  return (
    <g>
      {day ? <DawnBedroom t={t + 40} id={id} clock={clock} /> : <Bedroom t={t + 40} id={id} clock={clock} lamp={lamp} crossed={0} />}
      {hidePip ? null : <Hero look={PIP} pose={{ ...p, ...(face ?? {}) }} rimId={day ? 'rimR' : 'rimBlue'} shadow={0} />}
      <Desk x0={560} x1={1360} y={700} laptop={false} lamp={false} vp={BEDROOM.vp} />
      {/* clutter on the desk: grows with `mess` (0 tidy, 1 a landslide) */}
      <DeskClutter mess={mess} t={t} />
      <ScreenGlow x={LID.x} y={LID.y - 100} r={330} o={0.32 * glow * lid} />
      <g transform={`translate(${LID.x} ${LID.y}) scale(1 ${Math.max(0.05, lid)}) translate(${-LID.x} ${-LID.y})`}>
        <LaptopBack x={LID.x} y={LID.y} w={LID.w} glow={glow} />
        {notes.map((n, i) => <StickyNote key={i} x={LID_CENTER.x + n.dx} y={LID_CENTER.y + n.dy} w={n.w ?? 66} rot={n.rot ?? 0} pop={n.pop ?? 1} curl={n.curl ?? 0} />)}
      </g>
      {/* a pen cup and a mug at the edges, the desk lamp's pool */}
      <g>
        <rect x={1180} y={652} width={34} height={46} rx={5} fill="#3E4A62" />
        <path d="M 1188 652 l -6 -28 M 1198 652 l 2 -34 M 1207 652 l 8 -24" stroke="#D9C8A8" strokeWidth={3.5} strokeLinecap="round" />
        <g transform="translate(700 696)">
          <ellipse cx={4} cy={2} rx={34} ry={7} fill="#000" opacity={0.35} />
          <path d="M -26 -46 L 26 -46 L 22 0 L -22 0 Z" fill="#E9E2D2" />
          <path d="M 26 -36 q 22 4 0 24" stroke="#E9E2D2" strokeWidth={7} fill="none" />
          <ellipse cx={0} cy={-46} rx={26} ry={6} fill="#6A4A3A" />
        </g>
      </g>
      {front}
    </g>
  );
};

/** Papers, a cup noodle, socks and crisps across the desk, appearing as `mess` grows (positions are fixed). */
export const DeskClutter: React.FC<{ mess: number; t: number }> = ({ mess, t }) => {
  if (mess <= 0) return null;
  const items: { k: number; el: React.ReactNode }[] = [
    { k: 0.1, el: <path d="M 600 698 L 690 690 L 700 700 L 610 708 Z" fill="#F4EEE0" /> },
    { k: 0.25, el: <path d="M 1060 696 l 70 -6 l 8 12 l -72 8 Z" fill="#EFE6D2" /> },
    { k: 0.4, el: <g><path d="M 780 696 L 830 696 L 822 660 L 788 660 Z" fill="#D9534F" /><rect x={786} y={654} width={38} height={8} rx={3} fill="#F6EFE3" /><path d={`M 800 650 q ${Math.sin(t / 5) * 6} -18 0 -30`} stroke="#F6EFE3" strokeWidth={3} fill="none" opacity={0.5} /></g> },
    { k: 0.55, el: <path d="M 1130 694 l 34 -22 l 22 8 l -30 22 Z" fill="#4A8C86" /> },
    { k: 0.7, el: <g><circle cx={1250} cy={690} r={14} fill="#EFE6D2" stroke="#9E927C" strokeWidth={2} /><circle cx={640} cy={694} r={11} fill="#EFE6D2" stroke="#9E927C" strokeWidth={2} /></g> },
    { k: 0.85, el: <path d="M 880 698 q 60 -26 130 -4" stroke="#1D2033" strokeWidth={4} fill="none" strokeLinecap="round" /> },
  ];
  return <g>{items.filter((i) => mess >= i.k).map((i, n) => <g key={n}>{i.el}</g>)}</g>;
};

/** A two-segment arm drawn like the rig's (11 wide, outlined), reaching from `s` to `h` with the elbow bent downward. */
export const FrontArm: React.FC<{ s: { x: number; y: number }; h: { x: number; y: number }; rot?: number }> = ({ s, h, rot = 0 }) => {
  const L1 = 62;
  const L2 = 58;
  const dx = h.x - s.x;
  const dy = h.y - s.y;
  const d = Math.min(L1 + L2 - 0.5, Math.max(24, Math.hypot(dx, dy)));
  const ux = dx / (Math.hypot(dx, dy) || 1);
  const uy = dy / (Math.hypot(dx, dy) || 1);
  const a = (L1 * L1 - L2 * L2 + d * d) / (2 * d);
  const hh = Math.sqrt(Math.max(0, L1 * L1 - a * a));
  // two elbow candidates either side of the shoulder-hand line: take the lower, outer one
  const c1 = { x: s.x + ux * a - uy * hh, y: s.y + uy * a + ux * hh };
  const c2 = { x: s.x + ux * a + uy * hh, y: s.y + uy * a - ux * hh };
  const e = c1.x + 0.6 * c1.y > c2.x + 0.6 * c2.y ? c1 : c2;
  const end = { x: s.x + ux * d, y: s.y + uy * d };
  const ang = (Math.atan2(end.y - e.y, end.x - e.x) * 180) / Math.PI - 90;
  const path = `M ${s.x} ${s.y} L ${e.x} ${e.y} L ${end.x} ${end.y}`;
  return (
    <g filter="url(#rimR)">
      <path d={path} stroke={PIP.line} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={path} stroke={PIP.limb} strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <g transform={`translate(${end.x} ${end.y}) rotate(${ang + rot})`}>
        <path d="M -11 -2 Q -14 14 -6 18 L 7 18 Q 14 14 11 -2 Z" fill={PIP.hand} stroke={PIP.line} strokeWidth={4} strokeLinejoin="round" />
        <ellipse cx={-10} cy={6} rx={4.5} ry={7} fill={PIP.hand} stroke={PIP.line} strokeWidth={3.5} />
      </g>
    </g>
  );
};

/**
 * Pip's right arm coming over the laptop to stick a "MAI LÀM" note on the lid, in front of the lid. The note is in his
 * hand until `slapAt`; the caller draws it on the lid afterwards through `notes`. `pose` is the shot's desk pose.
 */
export const NoteSlapArm: React.FC<{ t: number; slapAt: number; pose?: Partial<Pose>; target?: LidNote }> = ({ t, slapAt, pose = {}, target = LID_SPOTS[0] }) => {
  const full = deskPose(pose);
  const sh = toWorld(full, joints(full).armR.root);
  const tx = LID_CENTER.x + target.dx;
  const ty = LID_CENTER.y + target.dy;
  const hx = kf(t, [[0, sh.x + 50], [slapAt - 12, sh.x + 60], [slapAt - 3, tx + 10], [slapAt, tx], [slapAt + 8, tx], [slapAt + 20, sh.x + 30]], (v) => easeOut(v));
  const hy = kf(t, [[0, sh.y + 70], [slapAt - 12, sh.y - 20], [slapAt - 3, ty - 24], [slapAt, ty - 4], [slapAt + 8, ty - 4], [slapAt + 20, sh.y + 90]], (v) => easeOut(v));
  const held = t < slapAt;
  return (
    <g>
      <FrontArm s={sh} h={{ x: hx, y: hy }} rot={held ? 10 : 0} />
      {held ? <StickyNote x={hx - 4} y={hy - 6} w={58} rot={-8} /> : null}
    </g>
  );
};

/** A foreground blur of a lamp edge, keeping a dark frame around a medium. */
export const DeskFrame: React.FC<{ o?: number }> = ({ o = 0.5 }) => (
  <Foreground blur={10}>
    <rect x={-300} y={930} width={2520} height={400} fill="#14101A" opacity={o} />
  </Foreground>
);

