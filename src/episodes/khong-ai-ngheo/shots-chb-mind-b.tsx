import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, camT, walkPose, joints, toWorld, rnd, AlarmClock, NightSky, Stars, Moon, Glow, Sparkle, Bokeh, Foreground, ShotProps,
} from '../../engine';
import { Note } from '../tien-vo-han/chc-props-money-and-prices';
import { GROUND_Y } from './chb-village-scenes';
import { BulbLine } from './chb-props-world';
import { CaneField, FARMER, FarmerHat, HeadProfile, TagPill, CoinDisc, ZzzNo } from './chb-props-mind';
import { TestPanel } from './chb-test-panel';
import { TickStamp, LookArm } from './chb-cards-and-marks';

// Chapter B, "Rồi đến cái đầu" (2/2): AFTER harvest (the same farmer, cash in hand, a higher score), the split of the two
// panels, worry crowding a head, the night clock, the tired face, and the tick "Đó là thật".

// ---------- B27: AFTER harvest: the same farmer strides through the golden field, a bundle of cut cane on his shoulder ----------
export const B27: React.FC<ShotProps> = ({ t, len }) => {
  const w = walkPose(640 + t * 4, t * 0.55, GROUND_Y + 70, 1.05, { look: 0.3, armL: { a: 30, b: 20 } });
  const sh = toWorld(w, joints(w).armR.root);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1060]]), 640, kf(t, [[0, 1.25], [len, 1.4]]))}>
      <CaneField id="b27" t={t} mood="gold" />
      <rect x={-400} y={-300} width={2720} height={1500} fill="#FFC070" opacity={0.12} style={{ mixBlendMode: 'screen' }} />
      {/* cut cane stacked on the ground */}
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${380 + (i % 2) * 24} ${870 + i * 20} L ${760 - (i % 3) * 20} ${846 + i * 20}`} stroke={i % 2 ? '#98AE3E' : '#8AA036'} strokeWidth={15} strokeLinecap="round" />)}
      <Hero look={FARMER} pose={{ ...w, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={1} />
      <FarmerHat pose={w} />
      {/* the bundle over his shoulder, in front of the torso and clear of the head: stalks, leaves at the top end */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <path d={`M ${sh.x - 70 + i * 11} ${sh.y + 120 - i * 6} L ${sh.x + 200 + i * 13} ${sh.y - 250 + i * 8}`} stroke={i % 2 ? '#98AE3E' : '#86A032'} strokeWidth={15} strokeLinecap="round" />
          <path d={`M ${sh.x + 200 + i * 13} ${sh.y - 250 + i * 8} q 36 -8 58 26 M ${sh.x + 200 + i * 13} ${sh.y - 250 + i * 8} q -34 -12 -52 14`} stroke="#B4C04C" strokeWidth={8} fill="none" strokeLinecap="round" />
        </g>
      ))}
      <TagPill x={460} y={330} text="SAU THU HOẠCH" color="#FFD36A" />
      {t > 8 ? <Sparkle x={sh.x + 300} y={sh.y - 300} t={t - 8} s={1.1} /> : null}
    </g>
  );
};

// ---------- B28: insert, the farmer's hand fans out cash ----------
export const B28: React.FC<ShotProps> = ({ t, len }) => {
  const open = easeOut(clamp(t / 10));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.1]])}) translate(-960 -540)`}>
      <defs>
        <linearGradient id="b28bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E89A4A" />
          <stop offset="100%" stopColor="#7A4A2A" />
        </linearGradient>
      </defs>
      <rect x={-300} y={-300} width={2520} height={1500} fill="url(#b28bg)" />
      <Bokeh seed={28} n={12} x0={0} y0={40} w={1920} h={800} t={t} o={0.6} />
      <Glow x={960} y={460} r={700} o={0.7} />
      {[-40, -14, 12, 38].map((r, i) => (
        <g key={i} transform={`translate(1000 760) rotate(${r * open + Math.sin(t / 9 + i) * 1.2})`}>
          <Note x={0} y={-190} s={2.4} c={['#6FB38A', '#7FA6D6', '#D9A05A', '#6FB38A'][i]} />
        </g>
      ))}
      <LookArm look={FARMER} x={1000} y={790} fx={1320} fy={1400} rot={180} s={5.4} width={130} fist />
      <Sparkle x={760} y={420} t={t - 8} s={1.3} />
      <Sparkle x={1280} y={380} t={t - 14} s={1.1} />
      <Foreground blur={14}><rect x={-100} y={1050} width={2200} height={200} fill="#2A1608" /></Foreground>
    </g>
  );
};

// ---------- B29: split screen: BEFORE (low score) | AFTER (the same man, a higher score climbing) ----------
export const B29: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 0.28 + 0.52 * easeOut(clamp((t - 22) / 18));
  const z = kf(t, [[0, 1.0], [len, 1.04]]);
  return (
    <g transform={`translate(960 540) scale(${z}) translate(-960 -540)`}>
      <clipPath id="b29l"><rect x={0} y={0} width={950} height={1080} /></clipPath>
      <clipPath id="b29r"><rect x={970} y={0} width={950} height={1080} /></clipPath>
      <g clipPath="url(#b29l)"><TestPanel id="b29a" t={t + 30} mood="before" score={0.28} tag="TRƯỚC" /></g>
      <g clipPath="url(#b29r)"><g transform="translate(970 0)"><TestPanel id="b29b" t={t} mood="after" score={sc} tag="SAU" /></g></g>
      <rect x={950} y={0} width={20} height={1080} fill="#F6EFE3" />
    </g>
  );
};

// ---------- B30: close, the worried face; coins and notes orbit his head ----------
export const B30: React.FC<ShotProps> = ({ t, len }) => {
  const p = poseAt(t, [{ f: 0, p: { x: 960, y: 720, scale: 1.1, yaw: 0.2, look: 0.3, headTilt: -4, armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 } } }, { f: len, p: { headTilt: -8 } }]);
  const items = Array.from({ length: 9 });
  return (
    <g transform={camT(960, 520, kf(t, [[0, 2.5], [len, 3.0]]))}>
      <rect x={-400} y={-300} width={2720} height={1500} fill="#1B2438" />
      <Bokeh seed={30} n={10} x0={400} y0={100} w={1100} h={600} t={t} o={0.35} />
      <Hero look={FARMER} pose={{ ...p, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0} />
      <FarmerHat pose={p} />
      {items.map((_, i) => {
        const ang = t / 20 + (i / items.length) * Math.PI * 2;
        const r = 215 + rnd(2, i) * 50;
        const k = easeOut(clamp((t - i * 2) / 8));
        const x = 960 + Math.cos(ang) * r * 1.15;
        const y = 500 + Math.sin(ang) * r * 0.55;
        return i % 2 ? <CoinDisc key={i} x={x} y={y} s={0.55 * k} rot={t * 5 + i * 40} /> : <Note key={i} x={x} y={y} s={0.52 * k} rot={Math.sin(ang) * 20} c={['#6FB38A', '#7FA6D6', '#D9A05A'][i % 3]} />;
      })}
    </g>
  );
};

// ---------- B31: a head silhouette fills with coins and bills; the bulb is squeezed to a corner and dims ----------
export const B31: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.min(34, 3 + Math.floor(t * 1.35));
  const bulb = clamp(1 - t / 22);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), 540, kf(t, [[0, 1.05], [len, 1.15]]))}>
      <rect x={-400} y={-300} width={2720} height={1500} fill="#141A2E" />
      <HeadProfile x={960} y={560} s={1.6} fill="#27304C" stroke="#9FB4E0" clipId="b31c">
        <g transform={`translate(${-10 - (1 - bulb) * 70} ${-90 - (1 - bulb) * 70}) scale(${0.4 + 0.6 * bulb})`}>
          <Glow x={0} y={0} r={300} o={0.9 * bulb} />
          <BulbLine x={0} y={0} s={1.35} on={bulb} t={t} />
        </g>
        {Array.from({ length: n }).map((_, i) => {
          const x = -170 + rnd(5, i) * 340;
          const y = -240 + rnd(6, i) * 460;
          const k = easeOut(clamp((t - (i - 3) / 1.35) / 5));
          if (k <= 0) return null;
          return i % 3 ? <CoinDisc key={i} x={x} y={y} s={0.95 * k} rot={rnd(7, i) * 90} /> : <Note key={i} x={x} y={y} s={0.9 * k} rot={(rnd(8, i) - 0.5) * 60} c={['#6FB38A', '#7FA6D6', '#D9A05A'][i % 3]} />;
        })}
      </HeadProfile>
    </g>
  );
};

// ---------- B32: the night clock: a big moon, stars, a bedside clock reading 03:00 ----------
export const B32: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 900]]), 560, kf(t, [[0, 1.0], [len, 1.16]]))}>
    <NightSky id="b32" horizonY={900} />
    <Stars seed={32} x0={-200} y0={-100} w={2300} h={700} t={t} n={46} o={0.9} />
    <Moon x={1380} y={330} r={150} />
    <rect x={-400} y={880} width={2720} height={400} fill="#0C1022" />
    <AlarmClock x={760} y={900} s={2.5} text="03:00" on={0.6 + 0.4 * Math.abs(Math.sin(t / 10))} />
    <Sparkle x={1180} y={240} t={t - 10} s={1.2} />
  </g>
);

// ---------- B33: the tired farmer, awake in bed under the moon, "Zzz" crossed out ----------
export const B33: React.FC<ShotProps> = ({ t, len }) => {
  const p = poseAt(t, [
    { f: 0, p: { x: 860, y: 760, scale: 1.15, yaw: 0.25, look: -0.3, headTilt: 5, armL: { a: 20, b: 0 }, armR: { a: 20, b: 0 } } },
    { f: len, p: { headTilt: 9 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 960]]), 560, kf(t, [[0, 1.5], [len, 1.7]]))}>
      <NightSky id="b33" horizonY={900} />
      <Stars seed={33} x0={-200} y0={-100} w={2300} h={700} t={t} n={30} o={0.8} />
      <Moon x={1380} y={250} r={120} />
      <rect x={480} y={470} width={760} height={700} rx={40} fill="#3A2E44" stroke="#1F1828" strokeWidth={6} />
      <ellipse cx={860} cy={760} rx={200} ry={70} fill="#B9C4DC" stroke="#6A7A98" strokeWidth={6} />
      <Hero look={FARMER} pose={{ ...p, ...faceAt(t, [[0, 'tired']]) }} rimId="rimBlue" shadow={0} />
      <path d="M 380 840 Q 860 740 1340 840 L 1400 1200 L 320 1200 Z" fill="#46546E" stroke="#1F2840" strokeWidth={6} />
      <path d="M 460 900 Q 860 810 1260 900" stroke="#6A7A98" strokeWidth={8} fill="none" />
      <ZzzNo x={1130} y={480} s={0.85} t={t} />
    </g>
  );
};

// ---------- B34: the green tick "Đó là thật." ----------
export const B34: React.FC<ShotProps> = ({ t }) => <TickStamp t={t} id="b34" sub="NGHIÊN CỨU KHOA HỌC" />;
