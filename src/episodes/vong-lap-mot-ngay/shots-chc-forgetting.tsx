import React from 'react';
import { kf, clamp, easeOut, easeInOut, camT, faceAt, poseAt, reachAngle, toWorld, joints, ShotProps, Glow, Schematic, FONT, rnd, Foreground } from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { Notebook } from './kit-props';
import { RewindWave, MemoryGlow } from './kit-rewind-fx';
import { bedTop } from './kit-morning-bedroom';
import { PAL } from './kit-palette';
import { PipInBed, PIP, sitPose, SIT, BED_U } from './chc-pip-in-bed';
import { toScreen, NOTE_LINES, DuvetTop, Pencil, HeadSieve, YearRoll } from './chc-forgetting-props';

// Chapter C, beat "4 forgetting" part 1 (119.77-130.61 s): C1 Pip writes his loop notes in bed at 23:59, C2 the pencil
// writes the last line, C3 06:00: the reset wipes the notebook in his hands, C4 the notes fly into his head (the only
// storage), C5 a head leaks its memories, C6 the year runs back to 1885.

// ---------- C1: wide-ish, night: Pip sits up in bed under the desk lamp, writing in a notebook on his knees; 23:59 ----------
export const C1: React.FC<ShotProps> = ({ t, len }) => {
  const nb = bedTop(BED_U + 0.02, 0.24);
  const base = sitPose({ yaw: 0.35, headTilt: 12, look: 0.4, tilt: 4 });
  const pen = { x: nb.x - 8 + Math.sin(t * 0.55) * 16, y: nb.y - 44 + Math.cos(t * 1.1) * 3 };
  const pose = { ...base, armR: { a: reachAngle(base, pen), b: 0 }, armL: { a: 18, b: -10 } };
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 790], [len, 775]]), kf(t, [[0, 545], [len, 555]]), kf(t, [[0, 1.6], [len, 1.72]]))}>
      <PipInBed t={t + 300} id="c1b" dawn={0} clock="23:59" lamp={1} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" />
      <g transform={`translate(${nb.x} ${nb.y - 40}) rotate(-8) skewX(-6)`}>
        <Notebook x={0} y={0} s={0.2} t={t} id="c1nb" flat={false} />
      </g>
      <Pencil x={hand.x - 6} y={hand.y + 4} rot={-60} s={0.32} />
      <circle cx={hand.x} cy={hand.y} r={10 * pose.scale * 1.4} fill={PIP.hand} stroke={PIP.line} strokeWidth={3} />
      <Glow x={nb.x + 40} y={nb.y - 60} r={200} o={0.3} />
      <Foreground blur={16}>
        <ellipse cx={1330} cy={930} rx={230} ry={130} fill="#0C0A14" />
        <path d="M 150 1000 L 170 700 Q 200 660 240 700 L 260 1000 Z" fill="#0C0A14" />
      </Foreground>
    </g>
  );
};

// ---------- C2: top-down insert on the duvet: the pencil writes the notebook's last line, "bà cụ, ngã tư" ----------
export const C2: React.FC<ShotProps> = ({ t, len }) => {
  const s = 2.5;
  const last = NOTE_LINES[5];
  const n = Math.min(last.length, Math.max(0, Math.floor((t + 6) / 2)));
  const lines = [...NOTE_LINES.slice(0, 5), last.slice(0, n)];
  const nx = 960;
  const ny = 560;
  const tip = { x: nx + (22 + n * 15.2) * s, y: ny + 44 * s + Math.sin(t * 1.7) * 4 };
  const along = { x: tip.x + Math.cos((42 * Math.PI) / 180) * 170, y: tip.y + Math.sin((42 * Math.PI) / 180) * 170 };
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 1040]]), kf(t, [[0, 560], [len, 600]]), kf(t, [[0, 1.0], [len, 1.08]]))}>
      <DuvetTop t={t} id="c2d" />
      <Notebook x={nx} y={ny} s={s} t={t} id="c2nb" lines={lines} />
      <Pencil x={tip.x} y={tip.y} rot={42} s={1.4} />
      <InsertArm x={along.x + 20} y={along.y + 10} fx={along.x + 520} fy={1500} rot={-28} s={5} width={124} fist />
    </g>
  );
};

// ---------- C3: 06:00, the reset flash: Pip holds the notebook up and its writing dissolves into cyan motes ----------
export const C3: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: sitPose({ yaw: 0.2, headTilt: -4, look: 0.1 }) },
    { f: 14, p: { headTilt: 6, tilt: -3 } },
    { f: 22, p: { headTilt: 3, tilt: -2 } },
  ]);
  const fade = easeInOut(clamp((t - 6) / 30));
  return (
    <g>
      <g transform={camT(kf(t, [[0, 850], [len, 840]]), kf(t, [[0, 545], [len, 540]]), kf(t, [[0, 2.0], [len, 2.2]]))}>
        <PipInBed t={t + 40} id="c3b" dawn={1} clock="06:00" ring={t < 34 ? 1 : 0} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [14, 'shock']]) }} held notebook={fade} />
      </g>
      <RewindWave t={t} t0={0} id="c3rw" cx={900} cy={420} />
    </g>
  );
};

// ---------- C4: close-up: the notes fly out of the empty page into his head; a cyan glow takes them in ----------
export const C4: React.FC<ShotProps> = ({ t, len }) => {
  const z = kf(t, [[0, 3.4], [len, 3.7]]);
  const pose = poseAt(t, [{ f: 0, p: sitPose({ yaw: 0.3, headTilt: -5, look: -0.3 }) }, { f: 30, p: { headTilt: 2 } }]);
  const head = toWorld(pose, { x: 0, y: -176 });
  const cx = head.x + 40;
  const cy = head.y + 30;
  const hs = toScreen(cx, cy, z, head);
  return (
    <g>
      <g transform={camT(cx, cy, z)}>
        <PipInBed t={t + 90} id="c4b" pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [36, 'cool']]) }} />
      </g>
      <MemoryGlow x={hs.x} y={hs.y} r={62 * pose.scale * z * 1.7} t={t} id="c4mg" o={clamp((t - 4) / 12)} />
      {NOTE_LINES.map((ln, i) => {
        const t0 = 2 + i * 5;
        const k = easeInOut(clamp((t - t0) / 16));
        if (t < t0 || k >= 1) return null;
        const sx = 1500 + (i % 2) * 220;
        const sy = 1000 - i * 40;
        const x = sx + (hs.x - sx) * k;
        const y = sy + (hs.y - sy) * k - Math.sin(k * Math.PI) * 160;
        return (
          <text key={i} x={x} y={y} textAnchor="middle" fontFamily={FONT.hand} fontSize={84 * (1 - 0.55 * k)} fill={PAL.cyanSoft} opacity={1 - k * 0.6} style={{ filter: `drop-shadow(0 0 10px ${PAL.cyan})` }}>
            {ln}
          </text>
        );
      })}
    </g>
  );
};

// ---------- C5: schematic: a head in profile full of glowing memories that leak out of cracks at the back ----------
export const C5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Schematic t={t} id="c5s" />
    <Glow x={940} y={520} r={420} kind="cool" o={0.35} />
    <HeadSieve x={1000} y={520} s={2.3} t={t} leak={easeOut(clamp((t - 4) / 38))} />
    {/* a "full" bar draining under the head */}
    <g transform="translate(700 930)">
      <rect x={0} y={0} width={600} height={30} rx={15} fill="#FFFFFF" opacity={0.12} />
      <rect x={0} y={0} width={600 * (1 - 0.66 * easeOut(clamp((t - 4) / 38)))} height={30} rx={15} fill={PAL.cyan} opacity={0.85} />
    </g>
  </g>
);

// ---------- C6: "hơn một trăm năm trước": the year runs back on a calendar page, 2026 -> 1885 ----------
export const C6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.08], [len, 1.0]]))}>
    <rect x={-300} y={-300} width={2520} height={1680} fill="#1A120E" />
    <Glow x={960} y={420} r={760} o={0.5} />
    {Array.from({ length: 10 }).map((_, k) => {
      const ph = (t * 0.06 + rnd(31, k)) % 1;
      return <rect key={k} x={200 + rnd(32, k) * 1500} y={1100 - ph * 1300} width={120} height={150} rx={6} fill="#E6DCC2" opacity={0.12 * Math.sin(ph * Math.PI)} transform={`rotate(${(rnd(33, k) - 0.5) * 60} ${260 + rnd(32, k) * 1500} ${1170 - ph * 1300})`} />;
    })}
    <YearRoll x={960} y={560} t={t} s={1.15} />
  </g>
);
