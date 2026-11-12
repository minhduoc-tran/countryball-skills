import React from 'react';
import { Hero, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, LOOKS, Schematic, SCH, FONT, Sparkle, ShotProps } from '../../engine';
import { PeopleGrid } from '../khong-ai-ngheo/cha-number-card-props';
import { TickStamp } from '../khong-ai-ngheo/chb-cards-and-marks';
import { SourceTag } from './chb-notes-and-icons';
import { LectureHall } from './chb-science-props';

// Chapter B, science 1/2 (the crowd, shots B6-B9): "you are not alone": a crowd behind Pip, the 80-95% card with its
// source, the lecture hall where most seats light up, the green "ĐÓ LÀ THẬT" stamp.

const PIP = LOOKS.pipHood;

// ---------- B6: medium: Pip alone in front, then rows of people pop in behind him ----------
export const B6: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 770, scale: 1.45, yaw: 0.15, look: -0.4, armL: { a: 10, b: -8 }, armR: { a: 12, b: -8 }, headTilt: 3 } },
    { f: 14, p: { look: 0.5, headTilt: -4 } },
    { f: 30, p: { look: 0, headTilt: 0, armR: { a: 28, b: -10 } } },
  ]);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Schematic t={t} id="b6" />
      <g opacity={0.85}>
        <PeopleGrid t={t - 8} x0={140} y0={190} dx={150} dy={118} cols={12} rows={3} s={1.5} dimOf={() => 0.15} popStep={0.7} />
        <PeopleGrid t={t - 10} x0={140} y0={940} dx={150} dy={-110} cols={12} rows={2} s={1.5} dimOf={() => 0.15} popStep={0.7} />
      </g>
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [16, 'happy']]) }} rimId="rimR" shadow={1} />
      <Sparkle x={1130} y={470} t={t - 30} s={0.9} />
    </g>
  );
};

// ---------- B7: the card: "80–95%" with its source tag ----------
export const B7: React.FC<ShotProps> = ({ t, len }) => {
  const pop = 0.85 + 0.15 * backOut(clamp((t + 2) / 9));
  const cap = easeOut(clamp((t - 8) / 8));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
      <Schematic t={t} id="b7" />
      <g transform={`translate(960 520) scale(${pop})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={310} fill={SCH.live} style={{ filter: `drop-shadow(0 0 24px ${SCH.glow}88)` }}>80–95%</text>
      </g>
      <text x={960} y={650} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={70} fill={SCH.line} letterSpacing={4} opacity={cap}>SINH VIÊN ĐẠI HỌC</text>
      <SourceTag x={960} y={850} t={t - 16} text="STEEL, 2007" size={44} />
    </g>
  );
};

// ---------- B8: the lecture hall: seat after seat lights up (about 86% end lit) ----------
export const B8: React.FC<ShotProps> = ({ t, len }) => {
  const b = backOut(clamp((t + 2) / 8));
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 520]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <LectureHall t={t} startAt={2} spread={Math.min(52, len - 14)} />
      <g transform={`translate(960 145) scale(${b})`}>
        <text textAnchor="middle" y={26} fontFamily={FONT.ui} fontWeight={700} fontSize={84} fill={SCH.live} style={{ filter: `drop-shadow(0 0 14px ${SCH.glow}99)` }}>80–95%</text>
      </g>
    </g>
  );
};

// ---------- B9: the stamp: "ĐÓ LÀ THẬT" ----------
export const B9: React.FC<ShotProps> = ({ t }) => <TickStamp t={t} id="b9" />;
