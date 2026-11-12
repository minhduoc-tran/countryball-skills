import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, walkPose, kf, clamp, easeOut, rnd, camT, LOOKS, HEAD, Glow, Dust, Street, streetStand, Bus,
  CrossroadsTop, ShotProps,
} from '../../engine';

// Chapter A, the market and the bus: Pip walks toward the market (A37), the stalls still piled with greens and fish
// (A38), the bus No. 09 at its stop with the door open (A39, A40: the door and the cold engine gauge), he shouts
// "có ai không?" (A41) and only an echo comes back (A42, from very high).

const PIP = LOOKS.pipHood;

// ---------- A37: Pip walks down the road toward the market, the stalls already set out along the sidewalk ----------
export const A37: React.FC<ShotProps> = ({ t, len }) => {
  const s = streetStand(kf(t, [[0, -0.8], [len, 1.7]], (v) => v), 6.6);
  const pose = walkPose(s.x, t * 0.55, s.y + 140 * s.scale, s.scale, { yaw: 0.7, tilt: 4 }, 1);
  return (
    <g transform={camT(kf(t, [[0, 950], [len, 1100]]), 600, 1.45)}>
      <Street t={t + 60} id="st37" market={1} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- A38: the stall, close: greens, tomatoes, carrots, then a tray of fish on ice; the camera slides across ----------
const GREENS = Array.from({ length: 18 }).map((_, i) => ({ x: 60 + (i % 6) * 62 + rnd(1, i) * 14, y: -rnd(2, i) * 46 - Math.floor(i / 6) * 26, r: 52 + rnd(3, i) * 20, c: ['#3E7A44', '#4E8A4A', '#2F6A3E', '#5E9A50'][i % 4], a: rnd(4, i) * 60 - 30 }));
const FISH = [[0, 0, -8], [1, 0, 6], [2, 0, -4], [0.5, 1, 5], [1.5, 1, -7]];
export const A38: React.FC<ShotProps> = ({ t, len }) => {
  const sway = Math.sin(t / 12) * 1.4;
  const pan = easeOut(clamp((t - 38) / 22));
  const cx = 700 + 620 * pan;
  return (
    <g transform={camT(cx, 560, kf(t, [[0, 1.55], [len, 1.8]]))}>
      <g filter="url(#blur6)">
        <g transform="translate(960 470) scale(1.6) translate(-960 -470)">
          <Street t={t + 90} id="st38" market={1} />
        </g>
      </g>
      <rect x={-600} y={-300} width={3200} height={1700} fill="#120A18" opacity={0.3} />
      {/* the awning: red and cream stripes with a scalloped edge, swaying a little */}
      <g transform={`rotate(${sway} 960 200)`}>
        {Array.from({ length: 14 }).map((_, i) => (
          <g key={i}>
            <path d={`M ${i * 150 - 100} 100 L ${i * 150 + 50} 100 L ${i * 150 + 50} 330 Q ${i * 150 - 25} 372 ${i * 150 - 100} 330 Z`} fill={i % 2 ? '#EADFC8' : '#C8483E'} />
            <path d={`M ${i * 150 + 20} 100 L ${i * 150 + 50} 100 L ${i * 150 + 50} 330 Q ${i * 150 + 30} 345 ${i * 150 + 20} 342 Z`} fill="#000" opacity={0.15} />
          </g>
        ))}
        <rect x={-100} y={96} width={2100} height={8} fill="#FFB46A" opacity={0.55} />
      </g>
      {/* hanging scale */}
      <g transform={`translate(1120 372) rotate(${Math.sin(t / 9) * 3})`}>
        <path d="M 0 0 V 120" stroke="#2A2630" strokeWidth={5} />
        <circle cx={0} cy={150} r={32} fill="#E9E2D2" stroke="#2A2630" strokeWidth={5} />
        <path d="M 0 150 L 14 132" stroke="#C8483E" strokeWidth={4} />
      </g>
      {/* the table front, the board on top */}
      <rect x={-100} y={760} width={2100} height={420} fill="#4A3A36" />
      <rect x={-100} y={760} width={2100} height={14} fill="#FFB46A" opacity={0.5} />
      <path d="M -100 880 H 2000 M -100 1000 H 2000" stroke="#3A2C2A" strokeWidth={6} />
      <rect x={-100} y={730} width={2100} height={34} fill="#8A6A4E" />
      {/* the greens: a crate of heaped leaves, then tomatoes, then carrots */}
      <rect x={160} y={620} width={460} height={120} rx={8} fill="#8A6038" />
      <rect x={160} y={620} width={460} height={10} fill="#FFB46A" opacity={0.5} />
      <g transform="translate(200 730)">
        {GREENS.map((g, i) => <ellipse key={i} cx={g.x} cy={g.y - 20} rx={g.r} ry={g.r * 0.55} fill={g.c} transform={`rotate(${g.a} ${g.x} ${g.y - 20})`} />)}
        {GREENS.slice(0, 8).map((g, i) => <path key={`v${i}`} d={`M ${g.x - g.r * 0.6} ${g.y - 20} L ${g.x + g.r * 0.6} ${g.y - 22}`} stroke="#9ACB7A" strokeWidth={3} opacity={0.5} />)}
      </g>
      <rect x={700} y={650} width={340} height={90} rx={8} fill="#8A6038" />
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={`t${i}`}>
          <circle cx={730 + (i % 6) * 55} cy={650 - Math.floor(i / 6) * 40} r={32} fill="#D9482E" />
          <circle cx={722 + (i % 6) * 55} cy={640 - Math.floor(i / 6) * 40} r={9} fill="#FF9A82" opacity={0.7} />
        </g>
      ))}
      {[0, 1, 2, 3, 4].map((i) => <path key={`c${i}`} d={`M ${1080 + i * 18} 640 L ${1100 + i * 18} 740 L ${1112 + i * 18} 640 Z`} fill="#E8892E" transform={`rotate(${i * 7 - 14} ${1100 + i * 18} 740)`} />)}
      {/* the fish tray: steel, crushed ice, silver fish with an eye, a gill and a tail */}
      <rect x={1240} y={640} width={560} height={110} rx={10} fill="#8E96A4" />
      <rect x={1240} y={640} width={560} height={10} fill="#FFD9A0" opacity={0.6} />
      <rect x={1252} y={650} width={536} height={90} rx={6} fill="#DDE6F0" />
      {Array.from({ length: 30 }).map((_, i) => <circle key={`ic${i}`} cx={1270 + rnd(7, i) * 500} cy={662 + rnd(8, i) * 70} r={5 + rnd(9, i) * 6} fill="#FFFFFF" opacity={0.8} />)}
      {FISH.map(([fx, fy, r], i) => (
        <g key={i} transform={`translate(${1330 + fx * 160} ${690 + fy * 36}) rotate(${r})`}>
          <path d="M -70 0 Q -20 -34 50 -6 Q 20 28 -70 0 Z" fill="#A7B6C8" />
          <path d="M 50 -6 L 90 -28 L 86 24 Z" fill="#8296AE" />
          <path d="M -60 -2 Q -10 -22 40 -8" stroke="#E8F0FA" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.8} />
          <circle cx={-48} cy={-6} r={7} fill="#14121A" />
          <circle cx={-50} cy={-8} r={2.2} fill="#fff" />
          <path d="M -34 -10 Q -28 0 -34 10" stroke="#6A7C92" strokeWidth={3} fill="none" />
        </g>
      ))}
      <Glow x={900} y={520} r={700} o={0.3} />
      <Dust t={t} seed={44} x0={100} y0={300} w={1700} h={500} n={26} o={0.4} />
    </g>
  );
};

// ---------- A39: the bus at the stop, its door open and nobody in the street; Pip, small, looks at it ----------
export const A39: React.FC<ShotProps> = ({ t, len }) => {
  const s = streetStand(0.6, 9.8);
  const pose = poseAt(t, [
    { f: 0, p: { x: s.x, y: s.y, scale: s.scale, yaw: 0.4, look: 0.8, armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 } } },
    { f: 22, p: { yaw: 0.6, headTilt: 3, armR: { a: 22, b: 0 } }, ease: easeOut },
    { f: 44, p: { yaw: 0.3, headTilt: -2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1120]]), 590, kf(t, [[0, 1.5], [len, 1.8]]))}>
      <Street t={t + 120} id="st39" bus />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [26, 'worried']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- A40: the bus up close: the doors open onto an empty cabin, then the tail pipe, silent, and the engine gauge on cold ----------
export const A40: React.FC<ShotProps> = ({ t, len }) => {
  const pan = easeOut(clamp((t - 18) / 26));
  const BX = 960;
  const BY = 880;
  const S = 1.9;
  const gauge = easeOut(clamp((t - 36) / 8));
  const needle = -62 + Math.sin(t / 9) * 0.8; // resting in the blue, a degree of tremor
  return (
    <g>
      <g transform={camT(500 + pan * 960, 640, 1.7 + 0.12 * pan)}>
        <g filter="url(#blur6)">
          <g transform="translate(960 470) scale(1.7) translate(-960 -470)">
            <Street t={t + 130} id="st40" bus />
          </g>
        </g>
        <rect x={-600} y={-300} width={3200} height={1700} fill="#120A18" opacity={0.45} />
        <Bus x={BX} y={BY} s={S} facing={-1} number="09" open={1} lit={0.7} t={t} />
        {/* the tail pipe under the rear bumper (screen right): nothing comes out of it */}
        <g transform={`translate(${BX} ${BY}) scale(${-S} ${S})`}>
          <rect x={-452} y={-46} width={46} height={16} rx={4} fill="#4A4858" />
          <ellipse cx={-452} cy={-38} rx={5} ry={9} fill="#0E0C14" />
          <path d="M -450 -48 L -410 -48" stroke="#FFB46A" strokeWidth={2} opacity={0.55} />
        </g>
        <Glow x={BX + 700} y={BY - 200} r={320} o={0.25} kind="red" />
        <Dust t={t} seed={52} x0={300} y0={300} w={1500} h={600} n={20} o={0.35} />
      </g>
      {/* the engine gauge, popped in over the picture: needle resting on C */}
      <g transform={`translate(1560 800) scale(${0.6 + 0.4 * gauge})`} opacity={gauge}>
        <circle r={138} fill="#0E0C14" stroke="#4A4858" strokeWidth={8} />
        <path d="M -100 0 A 100 100 0 0 1 -50 -86" stroke="#4A9BE8" strokeWidth={14} fill="none" />
        <path d="M -50 -86 A 100 100 0 0 1 50 -86" stroke="#6A6878" strokeWidth={14} fill="none" />
        <path d="M 50 -86 A 100 100 0 0 1 100 0" stroke="#D9482E" strokeWidth={14} fill="none" />
        <text x={-86} y={40} fontSize={30} fontFamily="'Space Mono', monospace" fill="#4A9BE8" textAnchor="middle">C</text>
        <text x={86} y={40} fontSize={30} fontFamily="'Space Mono', monospace" fill="#D9482E" textAnchor="middle">H</text>
        <g transform={`rotate(${needle})`}>
          <path d="M -6 0 L 0 -100 L 6 0 Z" fill="#F6EFE3" />
        </g>
        <circle r={11} fill="#F6EFE3" />
      </g>
    </g>
  );
};

// ---------- A41: close-up, Pip cups his hands round his mouth and shouts down the empty street ----------
export const A41: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.4 * (1 + 0.05 * clamp(t / len));
  const head = { x: 960, y: 560 };
  const shout = easeOut(clamp((t - 14) / 6));
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.12, look: 0.1,
    headTilt: kf(t, [[0, 0], [12, 4], [20, -9], [len, -7]]), armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 },
    expr: t < 14 ? 'worried' : 'shock',
  };
  const r = 62 * sc;
  const mouth = { x: head.x, y: head.y + r * 0.42 };
  const lift = 1 - shout;
  // a cupped mitten at each cheek with a sleeve rising to it from below, drawn after the head so it can't hide
  const cup = (sd: 1 | -1) => {
    const hx = mouth.x + sd * r * 0.82;
    const hy = mouth.y + 20 + lift * 220;
    const d = `M ${mouth.x + sd * r * 1.5} 1240 Q ${mouth.x + sd * r * 1.45} ${hy + 220} ${hx} ${hy + 40}`;
    return (
      <g key={sd} filter="url(#rimR)">
        <path d={d} stroke={PIP.line} strokeWidth={130} fill="none" strokeLinecap="round" />
        <path d={d} stroke={PIP.limb} strokeWidth={112} fill="none" strokeLinecap="round" />
        <g transform={`translate(${hx} ${hy}) rotate(${sd * -18}) scale(${sd * 4.4} 4.4)`}>
          <path d="M -11 -4 Q -14 14 -6 18 L 7 18 Q 14 14 11 -4 Z" fill={PIP.hand} stroke={PIP.line} strokeWidth={2.6} strokeLinejoin="round" />
          <ellipse cx={-10} cy={4} rx={4.5} ry={7} fill={PIP.hand} stroke={PIP.line} strokeWidth={2.4} />
        </g>
      </g>
    );
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-500 -330) scale(1.5)">
          <Street t={t + 20} id="st41" />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0814" opacity={0.2} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      {cup(-1)}
      {cup(1)}
      {/* the shout: three arcs leaving the mouth, repeating */}
      {[0, 1, 2].map((k) => {
        const p = ((t - 16 + k * 8) % 24) / 24;
        return t > 14 ? <path key={k} d={`M ${mouth.x + 300 + 300 * p} ${mouth.y - 90 - 80 * p} Q ${mouth.x + 360 + 340 * p} ${mouth.y} ${mouth.x + 300 + 300 * p} ${mouth.y + 90 + 80 * p}`} stroke="#FFE7B8" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.9 * (1 - p)} /> : null;
      })}
    </g>
  );
};

// ---------- A42: from very high: the crossing, Pip a tiny dark dot; rings of his voice go out and a fainter set comes back ----------
export const A42: React.FC<ShotProps> = ({ t, len }) => {
  const X = 960;
  const Y = 560;
  const ring = (p0: number, back: boolean) => {
    const p = clamp(p0);
    const rad = back ? 620 - 560 * p : 40 + 620 * p;
    return p > 0 && p < 1 ? <circle cx={X} cy={Y} r={rad} fill="none" stroke="#FFF0D0" strokeWidth={back ? 5 : 7} opacity={(back ? 0.35 : 0.6) * Math.sin(Math.PI * p)} /> : null;
  };
  const ang = kf(t, [[0, -20], [len, 40]]);
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.12], [len, 1.0]])}) translate(-960 -540)`}>
      <CrossroadsTop t={t + 90} id="xr42" />
      {[0, 1, 2].map((k) => <React.Fragment key={k}>{ring((t - k * 7) / 26, false)}</React.Fragment>)}
      {[0, 1].map((k) => <React.Fragment key={`b${k}`}>{ring((t - 24 - k * 9) / 26, true)}</React.Fragment>)}
      {/* Pip from straight above: long shadow, shoulders, a dark hood, two mustard strings */}
      <Glow x={X} y={Y} r={120 + 12 * Math.sin(t / 5)} o={0.45} />
      <ellipse cx={X + 26} cy={Y + 18} rx={36} ry={13} fill="#000" opacity={0.38} transform={`rotate(28 ${X + 26} ${Y + 18})`} />
      <g transform={`translate(${X} ${Y}) rotate(${ang})`}>
        <ellipse cx={0} cy={0} rx={34} ry={17} fill="#3A3660" stroke="#FFB46A" strokeWidth={3} />
        <ellipse cx={0} cy={-1} rx={13} ry={11} fill="#3A3654" stroke="#14121A" strokeWidth={2.5} />
        <circle cx={-5} cy={9} r={2.4} fill="#E8B64A" />
        <circle cx={5} cy={9} r={2.4} fill="#E8B64A" />
        <path d="M -33 -4 Q -36 0 -33 4" stroke="#FFB46A" strokeWidth={2} fill="none" opacity={0.6} />
      </g>
    </g>
  );
};
