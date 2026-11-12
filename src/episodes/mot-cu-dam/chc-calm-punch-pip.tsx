import React from 'react';
import { Hero, LOOKS, Look, joints, toWorld, faceAt } from '../../engine';
import { StreakLines } from './punch-fx-kit';
import { punchPose, punchFist, PunchOpts } from './punch-pip-and-fist';

// CHAPTER C: Pip throwing a punch with a calm, blank face (he is unbothered). Same motion and fx as the kit's PunchPip
// (smear arm, streaks, clenched fist) but the face stays neutral on the hit instead of the kit's "shock".
export const CalmPunchPip: React.FC<PunchOpts & { t: number; hitT: number; rimId?: string; look?: Look; shadow?: number }> = ({ t, hitT, rimId = 'rimR', look = LOOKS.pipHood, shadow = 1, ...o }) => {
  const side = o.side ?? 1;
  const sc = o.scale ?? 1;
  const pose = { ...punchPose(t, hitT, o), ...faceAt(t - hitT, [[-100, 'neutral'], [-(o.windLen ?? 22), 'cool'], [-2, 'neutral']]) };
  const fist = punchFist(t, hitT, o);
  const j = joints(pose)[side > 0 ? 'armR' : 'armL'];
  const ang = (Math.atan2(j.end.x - j.mid.x, j.end.y - j.mid.y) * 180) / Math.PI;
  const h = t - hitT;
  const smear = h >= -3 && h <= 2 ? [3, 2, 1, 0].map((k) => punchFist(t - k, hitT, o)) : null;
  const sh = toWorld(pose, j.root);
  const fr = 19 * sc;
  return (
    <g>
      <Hero look={look} pose={pose} rimId={rimId} shadow={shadow} />
      {smear ? (
        <g>
          <polygon points={[sh, ...smear].map((p) => `${p.x},${p.y}`).join(' ')} fill="#F6EFE3" opacity={0.5} />
          <polyline points={smear.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#FFFFFF" strokeWidth={30 * sc} strokeLinecap="round" strokeLinejoin="round" opacity={0.55} />
        </g>
      ) : null}
      {h >= -2 && h <= 4 ? <StreakLines t={t} x={fist.x - side * 10 * sc} y={fist.y} dir={side > 0 ? 0 : 180} n={10} len={420 * sc} spread={90 * sc} thick={7 * sc} o={h > 2 ? 0.5 : 0.9} seed={5} /> : null}
      <g transform={`translate(${fist.x} ${fist.y}) rotate(${-ang})`}>
        <ellipse cx={0} cy={fr * 0.4} rx={fr * (h >= -1 && h < 4 ? 1.12 : 0.95)} ry={fr * 0.95} fill={look.hand} stroke={look.line} strokeWidth={4.5 * Math.max(0.6, sc)} />
        <path d={`M ${-fr * 0.5} ${fr * 1.05} L ${-fr * 0.5} ${fr * 1.5} M 0 ${fr * 1.1} L 0 ${fr * 1.55} M ${fr * 0.5} ${fr * 1.05} L ${fr * 0.5} ${fr * 1.5}`} stroke={look.line} strokeWidth={2.4 * Math.max(0.6, sc)} opacity={0.5} strokeLinecap="round" />
      </g>
      {h >= 0 && h < 6 ? <circle cx={fist.x + side * 8 * sc} cy={fist.y} r={(40 + 26 * h) * sc} fill="none" stroke="#FFFFFF" strokeWidth={8 * sc} opacity={1 - h / 6} /> : null}
    </g>
  );
};
