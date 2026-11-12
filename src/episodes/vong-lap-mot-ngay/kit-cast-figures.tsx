import React from 'react';
import { Hero, Pose, HEAD, LEG_LEN } from '../../engine';
import { GRANNY, BOSS, NEIGHBOUR } from './kit-cast';

export { GRANNY, BOSS, NEIGHBOUR };

// The extra cast drawn with their own head pieces (the rig has no bun, specs or moustache).
//   <Granny pose rimId? shadow? />     Hero in GRANNY + grey hair pulled back (centre parting) into a top bun with a wooden hairpin.
//   <Boss pose rimId? shadow? glasses? />  Hero in BOSS + thin rectangular glasses and a moustache.
//   <Neighbour pose rimId? shadow? />  Hero in NEIGHBOUR + short dark hair with a cowlick.
//   <HeadOverlay pose rimId>{head-local svg}</HeadOverlay>  draws children in the rig's head space (head circle at
//       (0, -176) r 62, eyes at (+-21, -180), mouth (0, -148)), following x/y/scale/spin/squash/tilt/headTilt.

export const HeadOverlay: React.FC<{ pose: Pose; rimId?: string; children: React.ReactNode }> = ({ pose, rimId = 'rimR', children }) => (
  <g transform={`translate(${pose.x} ${pose.y}) scale(${pose.scale}) rotate(${pose.spin} 0 -90)`} filter={`url(#${rimId})`}>
    <g transform={`translate(0 ${LEG_LEN}) scale(${1 + 0.6 * pose.squash} ${1 - pose.squash}) translate(0 ${-LEG_LEN})`}>
      <g transform={`rotate(${pose.tilt}) rotate(${pose.headTilt} 0 ${HEAD.y + 40})`}>{children}</g>
    </g>
  </g>
);

export const Granny: React.FC<{ pose: Pose; rimId?: string; shadow?: number }> = ({ pose, rimId = 'rimR', shadow = 1 }) => {
  const yw = pose.yaw;
  const L = GRANNY;
  // the bun sits on top of the head, slid toward the back as she turns
  const bx = -yw * 24;
  const by = HEAD.y - 70;
  return (
    <g>
      <Hero look={L} pose={pose} rimId={rimId} shadow={shadow} />
      <HeadOverlay pose={pose} rimId={rimId}>
        {/* the bun on top (búi tó), a hairpin through it */}
        <circle cx={bx} cy={by} r={30} fill={L.hair} stroke={L.line} strokeWidth={4} />
        <path d={`M ${bx - 16} ${by - 6} Q ${bx} ${by - 18} ${bx + 16} ${by - 4} M ${bx - 14} ${by + 8} Q ${bx} ${by - 2} ${bx + 14} ${by + 10}`} stroke="#9A97A2" strokeWidth={3} fill="none" />
        <path d={`M ${bx - 26} ${by + 26} L ${bx + 30} ${by - 34}`} stroke="#6A4632" strokeWidth={6} strokeLinecap="round" />
        {/* the hair pulled back: a cap over the top of the head with a centre parting */}
        <g transform={`translate(${-yw * 12} 0)`}>
          <path d={`M -64 ${HEAD.y + 2} Q -70 ${HEAD.y - 66} 0 ${HEAD.y - 66} Q 70 ${HEAD.y - 66} 64 ${HEAD.y + 2} Q 56 ${HEAD.y - 34} 30 ${HEAD.y - 40} Q 12 ${HEAD.y - 42} 0 ${HEAD.y - 50} Q -12 ${HEAD.y - 42} -30 ${HEAD.y - 40} Q -56 ${HEAD.y - 34} -64 ${HEAD.y + 2} Z`} fill={L.hair} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
          <path d={`M 0 ${HEAD.y - 50} L 0 ${HEAD.y - 64}`} stroke="#9A97A2" strokeWidth={3} />
          <path d={`M -40 ${HEAD.y - 48} Q -20 ${HEAD.y - 60} -6 ${HEAD.y - 58} M 40 ${HEAD.y - 48} Q 20 ${HEAD.y - 60} 6 ${HEAD.y - 58}`} stroke="#A9A6B0" strokeWidth={2.5} fill="none" />
        </g>
        {/* soft wrinkles at the eye corners */}
        <g transform={`translate(${yw * 30} 0) scale(${1 - 0.28 * Math.min(1, Math.abs(yw))} 1)`} stroke="#B8A690" strokeWidth={2.5} strokeLinecap="round" opacity={0.5}>
          <path d={`M -40 ${HEAD.y - 6} l -7 -4 M -40 ${HEAD.y} l -8 2 M 40 ${HEAD.y - 6} l 7 -4 M 40 ${HEAD.y} l 8 2`} />
        </g>
      </HeadOverlay>
    </g>
  );
};

export const Boss: React.FC<{ pose: Pose; rimId?: string; shadow?: number; glasses?: boolean }> = ({ pose, rimId = 'rimR', shadow = 1, glasses = true }) => {
  const yw = pose.yaw;
  const ay = Math.min(1, Math.abs(yw));
  const far = ay > 0.72 ? (yw > 0 ? -1 : 1) : 0;
  const L = BOSS;
  return (
    <g>
      <Hero look={L} pose={pose} rimId={rimId} shadow={shadow} />
      <HeadOverlay pose={pose} rimId={rimId}>
        {/* grey temples */}
        <g transform={`translate(${-yw * 14} 0)`}>
          <path d={`M -60 ${HEAD.y - 18} Q -62 ${HEAD.y - 36} -54 ${HEAD.y - 42} L -50 ${HEAD.y - 22} Z M 60 ${HEAD.y - 18} Q 62 ${HEAD.y - 36} 54 ${HEAD.y - 42} L 50 ${HEAD.y - 22} Z`} fill="#A9A6B0" />
        </g>
        <g transform={`translate(${yw * 30} 0) scale(${1 - 0.28 * ay} 1)`}>
          {glasses
            ? [-21, 21].map((cx) =>
                far && Math.sign(cx) === far ? null : <rect key={cx} x={cx - 17} y={HEAD.y - 17} width={34} height={25} rx={6} fill="#FFFFFF" fillOpacity={0.08} stroke={L.line} strokeWidth={4} />,
              )
            : null}
          {glasses && !far ? <path d={`M -4 ${HEAD.y - 8} L 4 ${HEAD.y - 8}`} stroke={L.line} strokeWidth={4} /> : null}
          {/* the moustache */}
          <path d={`M -22 ${HEAD.y + 22} Q -12 ${HEAD.y + 12} 0 ${HEAD.y + 18} Q 12 ${HEAD.y + 12} 22 ${HEAD.y + 22} Q 10 ${HEAD.y + 24} 0 ${HEAD.y + 21} Q -10 ${HEAD.y + 24} -22 ${HEAD.y + 22} Z`} fill={L.hair} stroke={L.line} strokeWidth={2.5} strokeLinejoin="round" />
        </g>
      </HeadOverlay>
    </g>
  );
};

export const Neighbour: React.FC<{ pose: Pose; rimId?: string; shadow?: number }> = ({ pose, rimId = 'rimR', shadow = 1 }) => (
  <g>
    <Hero look={NEIGHBOUR} pose={pose} rimId={rimId} shadow={shadow} />
    <HeadOverlay pose={pose} rimId={rimId}>
      {/* a short crop with a cowlick */}
      <path transform={`translate(${-pose.yaw * 14} 0)`} d={`M -61 ${HEAD.y - 10} Q -66 ${HEAD.y - 70} 0 ${HEAD.y - 68} Q 66 ${HEAD.y - 70} 61 ${HEAD.y - 10} Q 54 ${HEAD.y - 42} 24 ${HEAD.y - 44} Q 0 ${HEAD.y - 38} -24 ${HEAD.y - 46} Q -54 ${HEAD.y - 42} -61 ${HEAD.y - 10} Z`} fill={NEIGHBOUR.hair} stroke={NEIGHBOUR.line} strokeWidth={3} strokeLinejoin="round" />
    </HeadOverlay>
  </g>
);
