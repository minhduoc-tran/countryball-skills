import React from 'react';
import { Hero, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, LOOKS, Schematic, SCH, FONT, Glow, Bedroom, Sparkle, ShotProps } from '../../engine';
import { SourceTag, NameTag } from './chb-notes-and-icons';
import { DeskScene, SEAT, DeskFront } from './chb-desk-laptop-and-chat';
import { BrainScan, ScanBlob, STRANGER, ELDER, ElderMarks, QMark, TaskBox } from './chb-science-props';

// Chapter B, science 2/2 (the future self, shots B10-B16): a brain scan (generic fMRI look), thinking about future-you
// lights up like thinking about a stranger, "để mai tính" = pushing the work to a stranger, the name tag.

const PIP = LOOKS.pipHood;
const BLOBS: ScanBlob[] = [{ cx: 0, cy: -96, r: 92, at: 14 }, { cx: -96, cy: 40, r: 56, at: 24, hot: false }, { cx: 100, cy: 56, r: 50, at: 30, hot: false }];

// ---------- B10: close-up: "one stranger thing" - Pip, a question mark ----------
export const B10: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 700, yaw: 0.2, look: 0.6, headTilt: 0, armL: { a: 10, b: -8 }, armR: { a: 12, b: -8 } } },
    { f: 10, p: { headTilt: 9, look: -0.5, handR: 'point' } },
    { f: 30, p: { headTilt: 6 } },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 500]]), kf(t, [[0, 2.0], [len, 2.3]]))}>
      <Schematic t={t} id="b10" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [10, 'worried']]) }} rimId="rimR" shadow={0} />
      <QMark x={1130} y={430} t={t - 10} s={0.9} />
    </g>
  );
};

// ---------- B11: the scanner: a head slice pops up and the scan bar sweeps it ----------
export const B11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.15]]))}>
    <Schematic t={t} id="b11" />
    <g transform={`translate(960 540) scale(${backOut(clamp((t + 2) / 9))}) translate(-960 -540)`}>
      <BrainScan id="b11s" x={960} y={540} s={1.35} t={t} blobs={[]} />
    </g>
  </g>
);

// ---------- B12: the scan lights up while Pip thinks of the older him ----------
export const B12: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 1430, y: 800, scale: 1.2, yaw: -0.4, look: -0.3, armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 }, headTilt: -3 } }]);
  const cloud = backOut(clamp((t - 6) / 9));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <Schematic t={t} id="b12" />
      <BrainScan id="b12s" x={560} y={470} s={1.12} t={t} blobs={BLOBS} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimL" shadow={0.6} />
      <g transform={`translate(1370 250) scale(${cloud})`}>
        <circle cx={40} cy={190} r={14} fill="#F6EFE3" /><circle cx={70} cy={150} r={22} fill="#F6EFE3" />
        <ellipse rx={170} ry={130} fill="#F6EFE3" stroke="#121019" strokeWidth={6} />
        <Hero look={STRANGER} pose={{ ...poseAt(0, [{ f: 0, p: { x: 0, y: 28, scale: 0.5, yaw: 0, armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 } } }]) }} rimId="rimL" shadow={0} />
      </g>
      <SourceTag x={960} y={985} t={t - 24} text="HERSHFIELD et al., 2009" size={40} />
    </g>
  );
};

// ---------- B13: Pip now vs the older him drawn as a stranger: two scans light up the same ----------
export const B13: React.FC<ShotProps> = ({ t, len }) => {
  const eq = backOut(clamp((t - 58) / 9));
  const stand = (x: number, yaw: number) => ({ x, y: 800, scale: 1.1, yaw, armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 } });
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t} id="b13" />
      <BrainScan id="b13a" x={470} y={270} s={0.52} t={t} blobs={BLOBS.map((b) => ({ ...b, at: b.at - 6 }))} />
      <BrainScan id="b13b" x={1450} y={270} s={0.52} t={t} blobs={BLOBS.map((b) => ({ ...b, at: b.at + 36 }))} />
      <Hero look={PIP} pose={{ ...poseAt(t, [{ f: 0, p: stand(470, 0.4) }]), ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.6} />
      <Hero look={STRANGER} pose={{ ...poseAt(t, [{ f: 0, p: stand(1450, -0.4) }]) }} rimId="rimL" shadow={0.6} />
      <QMark x={1450} y={512} t={t - 14} s={0.8} />
      <g transform={`translate(960 290) scale(${eq})`}>
        <text textAnchor="middle" y={60} fontFamily={FONT.ui} fontWeight={700} fontSize={220} fill={SCH.live} style={{ filter: `drop-shadow(0 0 20px ${SCH.glow}AA)` }}>≈</text>
      </g>
    </g>
  );
};

// ---------- B14: the green tick, then "to-morrow I'll think": the MAI LÀM note slaps on the laptop ----------
export const B14: React.FC<ShotProps> = ({ t, len }) => {
  const tick = backOut(clamp((t - 2) / 8)) * (1 - clamp((t - 24) / 8));
  const pose = poseAt(t, [
    { f: 0, p: { ...SEAT, armR: { a: 60, b: -14 }, headTilt: -2 } },
    { f: 30, p: { armR: { a: 60, b: -14 }, headTilt: 2 } },
    { f: 40, p: { armR: { a: 125, b: -18 }, headTilt: 6 }, ease: easeOut },
    { f: 45, p: { armR: { a: 84, b: -10 }, headTilt: 0 } },
    { f: 52, p: { armR: { a: 70, b: -14 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1250], [len, 1290]]), 560, kf(t, [[0, 1.55], [len, 1.7]]))}>
      <DeskScene
        t={t}
        id="b14"
        clock="22:15"
        note={t - 45}
        pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [30, 'smug']]) }}
        over={
          <g>
            <g transform={`translate(1000 430) scale(${tick})`}>
              <circle r={62} fill="#2FBF71" stroke="#121019" strokeWidth={6} /><path d="M -28 4 L -8 26 L 32 -22" stroke="#E9FFF2" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <Sparkle x={1500} y={560} t={t - 47} s={1.0} />
          </g>
        }
      />
    </g>
  );
};

// ---------- B15: across the table: Pip slides a heavy box of tasks to a tired older Pip ----------
export const B15: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 8) / 40));
  const bx = 840 + 330 * k;
  const young = poseAt(t, [
    { f: 0, p: { x: 540, y: 764, scale: 1.1, yaw: 0.7, facing: 1, armL: { a: 40, b: -8 }, armR: { a: 40, b: -8 }, tilt: 0 } },
    { f: 8, p: { tilt: 6, armL: { a: 78, b: -6 }, armR: { a: 80, b: -6 } } },
    { f: 44, p: { tilt: 12, armL: { a: 86, b: -4 }, armR: { a: 88, b: -4 } } },
    { f: 56, p: { tilt: 3, armL: { a: 40, b: -8 }, armR: { a: 40, b: -8 } } },
  ]);
  const old = poseAt(t, [
    { f: 0, p: { x: 1500, y: 764, scale: 1.1, yaw: -0.7, facing: -1, armL: { a: 30, b: -8 }, armR: { a: 30, b: -8 }, tilt: 2 } },
    { f: 46, p: { tilt: 2 } },
    { f: 56, p: { tilt: -9, headTilt: -8, armL: { a: 70, b: -6 }, armR: { a: 70, b: -6 } } },
  ]);
  return (
    <g transform={camT(960, 590, 1.08)}>
      <Bedroom t={t + 60} id="b15" crossed={0} veil={0.52} />
      <Hero look={PIP} pose={{ ...young, ...faceAt(t, [[0, 'smug'], [50, 'happy']]) }} rimId="rimR" shadow={0} />
      <Hero look={ELDER} pose={{ ...old, ...faceAt(t, [[0, 'tired'], [50, 'shock']]) }} rimId="rimL" shadow={0} />
      <ElderMarks pose={{ ...old }} />
      <DeskFront x0={300} x1={1640} />
      {k > 0 && k < 1 ? [0, 1, 2].map((i) => <path key={i} d={`M ${bx - 230 - i * 38} ${690 + i * 22} l -70 0`} stroke="#F6EFE3" strokeWidth={7} strokeLinecap="round" opacity={0.5 - i * 0.12} />) : null}
      <TaskBox x={bx} y={744} s={0.95} sag={0} />
    </g>
  );
};

// ---------- B16: the stranger in silhouette gets a name: "BẠN CỦA NGÀY MAI" ----------
export const B16: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 960, y: 800, scale: 1.5, yaw: 0, armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 }, headTilt: 3 } }]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Schematic t={t} id="b16" />
      <Glow x={960} y={500} r={520} kind="cool" o={0.45} />
      <Hero look={STRANGER} pose={{ ...pose, y: pose.y + Math.sin(t / 12) * 3 }} rimId="rimR" shadow={0.8} />
      <QMark x={960} y={270} t={t + 4} s={1.1} />
      <NameTag x={960} y={730} t={t - 26} text="BẠN CỦA NGÀY MAI" w={720} />
    </g>
  );
};
