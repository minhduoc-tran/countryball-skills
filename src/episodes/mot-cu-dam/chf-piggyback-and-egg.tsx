import React from 'react';
import { Hero, Pose, basePose, joints, toWorld, LOOKS, LEG_LEN, rnd } from '../../engine';

// CHAPTER F local pieces: Pip carrying his little sister piggyback (drawn as two Heroes plus her arms over his
// shoulders), and the "egg in an open palm" insert (the metaphor for how gently he carries her).
//   <Piggyback t x ground scale facing sleepy? expr? rimId? bob? />   Pip with sis on his back, feet on `ground`
//   <EggPalm t id />                                                   close-up of a big open hand cradling an egg

const PIP = LOOKS.pipHood;
const SIS = LOOKS.sis;

export const piggybackPoses = (t: number, x: number, ground: number, scale: number, facing: 1 | -1, o: { step?: number; stride?: number; tilt?: number; crouch?: number; sisLift?: number; sisDx?: number } = {}) => {
  const { step = 0, stride = 10, tilt = 16, crouch = 0, sisLift = 0, sisDx = 0 } = o;
  const s = Math.sin(step);
  const f = facing;
  // soft, small steps: the legs barely swing, the body hardly bobs
  const bend = 18 * crouch;
  const pip: Pose = {
    ...basePose, x, scale, facing: f, yaw: f * 0.85, tilt: f * (tilt + 20 * crouch), headTilt: f * 3, look: f * 0.7,
    legL: { a: stride * s + bend, b: -Math.max(0, 14 * Math.sin(step + 1.2)) - 55 * crouch },
    legR: { a: -stride * s + bend, b: -Math.max(0, 14 * Math.sin(step + 1.2 + Math.PI)) - 55 * crouch },
    armL: { a: -f * 30 - 10, b: 10 }, armR: { a: -f * 30 - 10, b: 10 }, sway: 8 * Math.sin(step + 0.8),
    y: ground - LEG_LEN * scale * (1 - 0.2 * crouch) - Math.abs(Math.cos(step)) * 3 * scale,
  };
  // she sits on his back: hip behind and a little above his, legs hanging bent at his sides
  const ss = scale * 0.72;
  const sis: Pose = {
    ...basePose, scale: ss, facing: f, yaw: f * 0.85, tilt: f * (tilt * 0.3 + 4), headTilt: f * -5, look: f * 0.4,
    x: pip.x - f * (64 * scale + sisDx) , y: pip.y - 48 * scale - sisLift,
    legL: { a: 38, b: -48 }, legR: { a: 22, b: -60 }, armL: { a: 0, b: 0 }, armR: { a: 0, b: 0 }, sway: 10 * Math.sin(step + 1.4),
  };
  return { pip, sis };
};

export const Piggyback: React.FC<{ t: number; x: number; ground: number; scale?: number; facing?: 1 | -1; step?: number; stride?: number; tilt?: number; crouch?: number; sleepy?: number; pipExpr?: Pose['expr']; rimId?: string; shadow?: number; sisLift?: number; sisDx?: number; hideSis?: boolean }> = ({
  t, x, ground, scale = 1, facing = 1, step = 0, stride, tilt, crouch, sleepy = 0, pipExpr = 'worried', rimId = 'rimBlue', shadow = 0, sisLift, sisDx, hideSis = false,
}) => {
  const { pip, sis } = piggybackPoses(t, x, ground, scale, facing, { step, stride, tilt, crouch, sisLift, sisDx });
  const sisFull: Pose = { ...sis, expr: sleepy > 0.5 ? 'neutral' : 'worried', blink: sleepy > 0.5 ? 1 : 0 };
  // her arms: from her shoulder, over his shoulder, to his chest
  const sj = joints(sisFull).armR.root;
  const sh = toWorld(sisFull, sj);
  const pj = joints(pip);
  const pShoulder = toWorld(pip, pj.armR.root);
  const chest = { x: pShoulder.x + facing * 38 * scale, y: pShoulder.y + 58 * scale };
  const over = { x: pShoulder.x + facing * 6 * scale, y: pShoulder.y - 12 * scale };
  const d = (dx: number) => `M ${sh.x} ${sh.y} Q ${over.x + dx} ${over.y} ${chest.x + dx} ${chest.y}`;
  const w = 17 * scale;
  return (
    <g>
      {hideSis ? null : <Hero look={SIS} pose={sisFull} rimId={rimId} shadow={shadow} />}
      <Hero look={PIP} pose={{ ...pip, expr: pipExpr }} rimId={rimId} shadow={shadow} />
      <g strokeLinecap="round" fill="none" opacity={hideSis ? 0 : 1}>
        <path d={d(-6 * facing)} stroke={SIS.line} strokeWidth={w + 6} />
        <path d={d(-6 * facing)} stroke={SIS.jacket} strokeWidth={w} />
        <circle cx={chest.x - 6 * facing} cy={chest.y} r={w * 0.72} fill={SIS.hand} stroke={SIS.line} strokeWidth={3} />
      </g>
    </g>
  );
};

const SKIN = '#F6EFE3';
const SKIN_SHADE = '#E2D3BE';
const LINE = '#121019';
const SLEEVE = '#2E2B3D';

/**
 * Close-up (screen space, no camera): a big open palm, fingers softly curled, cradling an egg. The hand sways a hair
 * with his steps (`sway` period 22 f), and a few raindrops fall past; they thin out as `calm` goes 0 -> 1.
 */
export const EggPalm: React.FC<{ t: number; id: string; calm?: number }> = ({ t, id, calm = 0.5 }) => {
  const bob = Math.sin(t * 0.285) * 7;
  const rock = Math.sin(t * 0.285 + 0.6) * 1.6;
  return (
    <g transform={`translate(0 ${bob})`}>
      <defs>
        <radialGradient id={`${id}egg`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#FFFBEF" />
          <stop offset="70%" stopColor="#F2E3C4" />
          <stop offset="100%" stopColor="#D8C29A" />
        </radialGradient>
      </defs>
      {/* the sleeve rises from the lower right; wrist, then the palm */}
      <path d="M 1500 1180 L 1380 760 L 1700 700 L 1920 1180 Z" fill={SLEEVE} stroke={LINE} strokeWidth={8} strokeLinejoin="round" />
      <path d="M 1460 800 Q 1580 830 1640 790 L 1680 880 Q 1560 930 1470 880 Z" fill="#3A3650" opacity={0.7} />
      <rect x={1230} y={700} width={260} height={150} rx={60} fill={SKIN} stroke={LINE} strokeWidth={8} transform="rotate(-8 1350 780)" />
      {/* palm: a wide soft slab, fingers curled up at the left edge, thumb up at the front */}
      <path d="M 1300 690 Q 1000 800 560 760 Q 330 735 300 640 Q 296 590 360 592 Q 700 640 1300 560 Z" fill={SKIN_SHADE} stroke={LINE} strokeWidth={8} strokeLinejoin="round" />
      <path d="M 1300 830 Q 940 900 560 840 Q 340 800 300 650 Q 520 700 760 690 Q 1060 700 1300 640 Z" fill={SKIN} stroke={LINE} strokeWidth={8} strokeLinejoin="round" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${340 + i * 8} ${640 - i * 16}) rotate(${-34 + i * 4})`}>
          <rect x={-50} y={-310 + i * 14} width={104} height={330 - i * 14} rx={50} fill={SKIN} stroke={LINE} strokeWidth={8} />
          <path d={`M -10 ${-260 + i * 14} Q 6 ${-180} -8 ${-100}`} stroke={SKIN_SHADE} strokeWidth={8} fill="none" strokeLinecap="round" />
        </g>
      ))}
      <path d="M 520 760 Q 760 800 1020 770" stroke={LINE} strokeWidth={5} fill="none" opacity={0.35} strokeLinecap="round" />
      <path d="M 640 730 Q 880 700 1140 720" stroke={LINE} strokeWidth={5} fill="none" opacity={0.25} strokeLinecap="round" />
      {/* the egg, with its contact shadow in the dip of the palm */}
      <ellipse cx={850} cy={738} rx={170} ry={26} fill="#000" opacity={0.28} />
      <g transform={`translate(850 ${560}) rotate(${rock})`}>
        <ellipse rx={118} ry={160} fill={`url(#${id}egg)`} stroke={LINE} strokeWidth={8} />
        <path d="M -70 -90 Q -60 -128 -22 -138" stroke="#FFFFFF" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.75} />
        <path d="M 78 20 Q 74 90 20 128" stroke="#BFA77C" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.5} />
      </g>
      {/* thumb in front, relaxed */}
      <g transform="translate(1010 800) rotate(-22)">
        <rect x={-130} y={-44} width={260} height={88} rx={44} fill={SKIN} stroke={LINE} strokeWidth={8} />
        <path d="M -110 10 Q -20 36 80 30" stroke={SKIN_SHADE} strokeWidth={12} fill="none" strokeLinecap="round" />
      </g>
      {/* a few raindrops, thinning out */}
      {Array.from({ length: 16 }).map((_, i) => {
        if (rnd(4, i) < calm) return null;
        const y = ((rnd(5, i) * 1200 + t * (34 + rnd(6, i) * 20)) % 1300) - 100;
        const xx = 120 + rnd(7, i) * 1700;
        return <line key={i} x1={xx} y1={y} x2={xx - 18} y2={y - 70} stroke="#D4E4FF" strokeWidth={3 + rnd(8, i) * 3} strokeLinecap="round" opacity={0.35} />;
      })}
    </g>
  );
};
