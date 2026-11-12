import { LOOKS, Look, Pose, basePose } from '../../engine';

// The episode's extra cast: derived Looks on the one rig (pattern of neu-chien-tranh/chc-neighbours-props.tsx).
// Main cast: Pip LOOKS.pipHood, Mo LOOKS.mo, mum LOOKS.mom. Ours, plain shapes, nobody famous.
//   GRANNY     the old lady at the crossroads: plum áo bà ba, dark plum sleeves/trousers, grey hair (cap + bun drawn
//              by <Granny> in kit-cast-figures.tsx: ALWAYS draw her with <Granny>, not <Hero>, or the bun is missing).
//   BOSS       Pip's boss: navy suit, mustard tie, grey temples (+ thin glasses and a moustache via <Boss>).
//   NEIGHBOUR  the neighbour with the cat and the flower pot balcony: green polo, light trousers, short dark hair.
//   grannyPose(x, y, scale, o?)  her stooped standing pose (hips x y, scale): slip 0..1 = the fall (feet go, body
//              tips back, arms fly up); facing 1 / -1 = which way she walks; walk = phase for a small shuffle.
//              Returns a full Pose: spread it, override with poseAt/faceAt keys as usual.

export const GRANNY: Look = {
  ...LOOKS.mom,
  skin: '#F2E6D6',
  skinShade: '#DCCBB4',
  hand: '#F2E6D6',
  jacket: '#7E5A8C',
  jacketShade: '#664872',
  accent: '#B79AC4',
  limb: '#6A5276',
  shoe: '#3A2A26',
  hair: '#C9C6CF',
  extra: undefined,
};

export const BOSS: Look = {
  ...LOOKS.suit,
  skin: '#E6CDB0',
  skinShade: '#CFB394',
  hand: '#E6CDB0',
  jacket: '#2C3654',
  jacketShade: '#222A42',
  accent: '#D9A43A',
  limb: '#2C3654',
  hair: '#3A3A44',
  extra: 'suit',
};

export const NEIGHBOUR: Look = {
  ...LOOKS.mo,
  skin: '#D9B08A',
  skinShade: '#C29A76',
  hand: '#D9B08A',
  jacket: '#4E8A5A',
  jacketShade: '#3E7048',
  accent: '#E8D49A',
  limb: '#B9A88E',
  shoe: '#5A4A3A',
  hair: '#1E1618',
  extra: undefined,
};

/** The granny's stooped pose; `slip` 0..1 is the fall on the wet zebra. */
export const grannyPose = (x: number, y: number, scale: number, o: { slip?: number; facing?: 1 | -1; walk?: number } = {}): Pose => {
  const { slip = 0, facing = 1, walk } = o;
  const f = facing;
  const sw = walk === undefined ? 0 : Math.sin(walk);
  const s = Math.min(1, Math.max(0, slip));
  return {
    ...basePose,
    x,
    y: y + 6 * scale + s * 40 * scale,
    scale,
    facing: f,
    yaw: 0.55 * f,
    // stooped forward, then tipping back as her feet go
    tilt: f * (10 - 48 * s),
    headTilt: f * (8 - 14 * s),
    armL: { a: 22 + 8 * sw + 120 * s, b: -26 + 10 * s },
    armR: { a: 30 - 8 * sw + 130 * s, b: -34 + 20 * s },
    legL: { a: 8 + 10 * sw + 50 * s, b: -14 + 4 * s },
    legR: { a: -6 - 10 * sw - 6 * s, b: -12 - 10 * s },
    expr: s > 0.2 ? 'shock' : 'neutral',
    sway: 0,
  };
};
