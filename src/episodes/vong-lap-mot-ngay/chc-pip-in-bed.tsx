import React from 'react';
import { Hero, Pose, basePose, LOOKS, toWorld, limbSpread, reachAngle } from '../../engine';
import { MorningBedroom, BedDuvet, bedSit } from './kit-morning-bedroom';
import { Notebook } from './kit-props';

// Chapter C helpers for Pip sitting up in bed (the loop's 06:00 framing and the night before).
//   PIP                    LOOKS.pipHood
//   BED_U                  where he sits (u on the mattress); sitPose(extra) his sitting pose there.
//   reachL(pose, target)   the LEFT arm's angle that points a straight arm at a world target (reachAngle is the right's).
//   <PipInBed t id dawn clock ring lamp pose notebook? held? />  the bedroom + Pip at BED_U + the duvet over his legs;
//       held: draws the kit Notebook standing up in his hands (facing camera) with its writing fading by `notebook`.
//       The desk's own notebook is always drawn blank (the one he writes in is in his hands).

export const PIP = LOOKS.pipHood;
export const BED_U = 0.27;
export const SIT = bedSit(BED_U);
export const sitPose = (extra: Partial<Pose> = {}): Pose => ({ ...basePose, x: SIT.x, y: SIT.y, scale: SIT.scale, yaw: 0.3, facing: 1, ...extra });

export const reachL = (pose: Pose, target: { x: number; y: number }) => {
  const r = (pose.tilt * Math.PI) / 180;
  const lx = -42 * limbSpread(pose.yaw) + pose.yaw * 6;
  const ly = -108;
  const sh = toWorld(pose, { x: lx * Math.cos(r) - ly * Math.sin(r), y: lx * Math.sin(r) + ly * Math.cos(r) });
  const world = (Math.atan2(target.x - sh.x, target.y - sh.y) * 180) / Math.PI;
  return -(world - pose.tilt);
};

/** Where the notebook sits when held up in front of his chest (its centre), and its scale. */
export const heldNote = (pose: Pose) => ({ x: pose.x + 34 * pose.scale, y: pose.y - 40 * pose.scale, s: 0.36 });

export const PipInBed: React.FC<{
  t: number; id: string; dawn?: number; clock?: string; ring?: number; lamp?: number; pose: Pose; notebook?: number; held?: boolean; lines?: string[]; rimId?: string;
}> = ({ t, id, dawn = 1, clock = '06:00', ring = 0, lamp = 0, pose, notebook = 0, held = false, lines, rimId = 'rimR' }) => {
  const n = heldNote(pose);
  const w = 230 * n.s;
  const h = 150 * n.s;
  let p = pose;
  if (held) {
    // both mittens at the notebook's lower corners
    const L = { x: n.x - w * 0.86, y: n.y + h * 0.7 };
    const R = { x: n.x + w * 0.86, y: n.y + h * 0.7 };
    p = { ...pose, armL: { a: reachL(pose, L), b: 0 }, armR: { a: reachAngle(pose, R), b: 0 } };
  }
  return (
    <g>
      <MorningBedroom t={t} id={id} dawn={dawn} clock={clock} ring={ring} lamp={lamp} duvet={false} notebook={1} />
      <Hero look={PIP} pose={p} rimId={rimId} shadow={0} />
      <BedDuvet knees={1} kneeU={BED_U} />
      {held ? (
        <g>
          <Notebook x={n.x} y={n.y} s={n.s} t={t} id={`${id}hn`} fade={notebook} lines={lines} />
          {[-1, 1].map((sd) => (
            <g key={sd} transform={`translate(${n.x + sd * w * 0.86} ${n.y + h * 0.7}) scale(${pose.scale * 1.05})`}>
              <ellipse cx={0} cy={0} rx={15} ry={17} fill={PIP.hand} stroke={PIP.line} strokeWidth={3.5} />
            </g>
          ))}
        </g>
      ) : null}
    </g>
  );
};
