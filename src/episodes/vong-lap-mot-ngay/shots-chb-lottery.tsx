import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, backOut, rnd, camT, Street, proj, Glow, LOOKS, Look, FONT, UI, SCH, Schematic,
  ShotProps, Pose, basePose, Foreground, toWorld, joints,
} from '../../engine';
import { MorningBedroom, roomStand } from './kit-morning-bedroom';
import { MemoryGlow } from './kit-rewind-fx';
import { MegaTicket } from './kit-props';
import { HeadOverlay } from './kit-cast-figures';
import { fmtVN, PAL } from './kit-palette';
import { DrawScreen, TvFrame, ThoughtBubble, LotteryStall, LivingWall, Ball, NUMS } from './chb-lottery-props';

// Chapter B, the lottery set-up (B6-B10, 70.81-81.91 s): Pip gets the idea, the 18:00 Wednesday Mega 6/45 draw on TV,
// the odds card "1 / 8.145.060", the memory of last night's result glowing in his head, buying those six numbers.

const PIP = LOOKS.pipHood;

// ---------- B6: close-up by the window: an idea; a thought bubble with the ticket and bouncing balls ----------
export const B6: React.FC<ShotProps> = ({ t, len }) => {
  const st = roomStand(0.55, 0.45);
  const pose = poseAt(t, [
    { f: 0, p: { ...st, yaw: 0.45, look: 0.2, headTilt: 0 } },
    { f: 10, p: { look: 0.8, headTilt: -8 }, ease: easeOut },
    { f: len, p: { look: 0.9, headTilt: -10 } },
  ]);
  const face = faceAt(t, [[0, 'neutral'], [9, 'smug']]);
  return (
    <g>
      <g transform={camT(kf(t, [[0, 1130], [len, 1120]]), 520, kf(t, [[0, 2.5], [len, 2.7]]))}>
        <MorningBedroom t={t + 420} id="b6mb" dawn={1} />
        <Hero look={PIP} pose={{ ...pose, ...face, glint: 0.6 * clamp((t - 9) / 5) }} rimId="rimR" />
      </g>
      <ThoughtBubble x={1390} y={330} w={760} h={460} t={t - 6}>
        <MegaTicket x={1390} y={300} s={1.05} id="b6tk" rot={-4} nums={NUMS} />
        {[0, 1, 2].map((i) => <Ball key={i} x={1180 + i * 210} y={480 - Math.abs(Math.sin(t / 5 + i * 1.3)) * 40} r={36} n={NUMS[i * 2]} c={['#E8553E', '#F2B33D', '#5C7CFA'][i]} />)}
      </ThoughtBubble>
    </g>
  );
};

// ---------- B7: over the shoulder in the living room: 18:00, Wednesday's Mega 6/45 draw on TV, the drum spinning ----------
export const B7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.1]])}) translate(-960 -500)`}>
      <LivingWall t={t} id="b7lw" />
      {/* the TV cabinet */}
      <ellipse cx={1000} cy={868} rx={560} ry={20} fill="#000" opacity={0.4} />
      <rect x={480} y={760} width={1040} height={110} rx={8} fill="#5A3E2C" stroke="#1D1418" strokeWidth={5} />
      <path d="M 486 764 H 1514" stroke="#FFC98A" strokeWidth={3} opacity={0.5} />
      {[700, 1000, 1300].map((x) => <rect key={x} x={x - 120} y={784} width={240} height={66} rx={6} fill="none" stroke="#3A2618" strokeWidth={4} />)}
      <TvFrame x={1000} y={440} w={900} id="b7tv">
        <DrawScreen t={t + 30} id="b7ds" mode="drum" reveal={clamp((t - 30) / 20) * 2} />
      </TvFrame>
      <Glow x={1000} y={440} r={700} kind="cool" o={0.35} />
    </g>
    {/* Pip from behind, near the lens: the hood, dark and soft, the TV glow on its edge */}
    <Foreground blur={16}>
      <path d="M 40 1120 Q 60 820 300 760 Q 470 720 560 860 Q 640 980 620 1120 Z" fill="#15131C" />
      <path d="M 300 760 Q 470 720 560 860" stroke="#9FC0FF" strokeWidth={14} fill="none" opacity={0.5} />
    </Foreground>
  </g>
);

// ---------- B8: the odds card: "1 / 8.145.060" counts up; a field of tickets with one gold one ----------
export const B8: React.FC<ShotProps> = ({ t, len }) => {
  const v = Math.round(8145060 * easeOut(clamp((t - 4) / 34)));
  const pop = 0.9 + 0.1 * backOut(clamp((t + 2) / 8));
  const cap = easeOut(clamp((t - 55) / 8));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
      <Schematic t={t} id="b8sch" />
      <text x={960} y={230} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={54} fill={SCH.dim} letterSpacing={4} opacity={easeOut(clamp(t / 6))}>XÁC SUẤT TRÚNG JACKPOT</text>
      <g transform={`translate(960 520) scale(${pop})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={176} fill={SCH.live} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>{`1 / ${fmtVN(v)}`}</text>
      </g>
      <g transform={`translate(960 680) scale(${0.7 + 0.3 * backOut(cap)})`} opacity={cap}>
        <rect x={-250} y={-62} width={500} height={110} rx={55} fill={UI.pill} opacity={0.85} stroke={SCH.line} strokeWidth={3} />
        <text y={22} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={72} fill={SCH.line} letterSpacing={3}>{'> 8 TRIỆU'}</text>
      </g>
      {/* a sea of tickets: one lit */}
      {Array.from({ length: 34 * 4 }).map((_, i) => {
        const cx = 140 + (i % 34) * 49;
        const cy = 820 + Math.floor(i / 34) * 44;
        const on = i === 77;
        const o = clamp((t - 10 - (i % 34) * 0.5) / 6);
        return <rect key={i} x={cx - 18} y={cy - 12} width={36} height={24} rx={4} fill={on ? '#FFD34A' : 'none'} stroke={on ? '#FFD34A' : SCH.dim} strokeWidth={on ? 4 : 2.5} opacity={o * (on ? 0.6 + 0.4 * Math.abs(Math.sin(t / 5)) : 0.55)} />;
      })}
    </g>
  );
};

// ---------- B9: close-up, MemoryGlow: last night's result plays in a sepia memory frame beside his head ----------
export const B9: React.FC<ShotProps> = ({ t, len }) => {
  const st = roomStand(0.5, 0.5);
  const pose = poseAt(t, [
    { f: 0, p: { ...st, yaw: 0.55, look: 0.5, headTilt: -4 } },
    { f: len, p: { look: 0.8, headTilt: -8 } },
  ]);
  const face = faceAt(t, [[0, 'neutral'], [16, 'smug']]);
  const cx = 1030;
  const cy = 470;
  const z = kf(t, [[0, 3.0], [len, 3.2]]);
  const head = toWorld(pose, { x: 0, y: -176 });
  const hs = { x: 960 + (head.x - cx) * z, y: 540 + (head.y - cy) * z };
  const open = easeOut(clamp((t - 4) / 10));
  return (
    <g>
      <g transform={camT(cx, cy, z)}>
        <MorningBedroom t={t + 460} id="b9mb" dawn={1} />
        <Hero look={PIP} pose={{ ...pose, ...face }} rimId="rimR" />
      </g>
      <MemoryGlow x={hs.x} y={hs.y} r={62 * pose.scale * z * 1.6} t={t} id="b9mg" />
      {/* the memory: last night's TV, in sepia, held in a cyan-edged frame */}
      <g transform={`translate(1360 470) scale(${0.6 + 0.4 * open}) translate(-1360 -470)`} opacity={open}>
        <rect x={930} y={170} width={860} height={560} rx={36} fill="#2A2018" stroke={PAL.cyan} strokeWidth={6} />
        <g style={{ filter: 'sepia(0.85) brightness(0.95)' }}>
          <TvFrame x={1360} y={470} w={720} id="b9tv" stand={false}>
            <DrawScreen t={t} id="b9ds" mode="result" />
          </TvFrame>
        </g>
        <rect x={960} y={196} width={250} height={64} rx={32} fill={UI.pill} opacity={0.85} />
        <text x={1085} y={241} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={40} fill={UI.text} letterSpacing={2}>TỐI QUA</text>
      </g>
      {/* the thread from the glow to the memory */}
      {open > 0 ? <path d={`M ${hs.x + 150} ${hs.y - 60} Q 880 300 ${930} ${330}`} stroke={PAL.cyanSoft} strokeWidth={5} strokeDasharray="10 12" strokeDashoffset={-t * 2} fill="none" opacity={0.7 * open} /> : null}
    </g>
  );
};

// ---------- B10: medium at a street lottery cart: the seller in a nón lá hands Pip the ticket ----------
const SELLER: Look = { ...LOOKS.mo, skin: '#E3C4A0', skinShade: '#CDAA84', hand: '#E3C4A0', jacket: '#4F7FA0', jacketShade: '#3E6684', limb: '#3A3446', extra: undefined };
const NonLa: React.FC<{ pose: Pose }> = ({ pose }) => (
  <HeadOverlay pose={pose} rimId="rimL">
    <path d="M -128 -214 L 0 -320 L 128 -214 Q 0 -196 -128 -214 Z" fill="#E8D49A" stroke="#5A4420" strokeWidth={5} strokeLinejoin="round" />
    {[-90, -50, -10, 30, 70].map((x, i) => <path key={i} d={`M ${x} ${-216 + Math.abs(x) * 0.02} L ${x * 0.15} -306`} stroke="#B89A5A" strokeWidth={2.5} />)}
    <path d="M -128 -214 Q 0 -196 128 -214" stroke="#FFF2C8" strokeWidth={4} fill="none" opacity={0.7} />
  </HeadOverlay>
);
export const B10: React.FC<ShotProps> = ({ t, len }) => {
  const pass = easeOut(clamp((t - 6) / 14));
  const pip = poseAt(t, [
    { f: 0, p: { ...basePose, x: 600, y: 770, scale: 1.45, yaw: 0.7, look: 0.4, armR: { a: 40, b: -20 } } },
    { f: 8, p: { armR: { a: 82, b: -6 } }, ease: easeOut },
    { f: 22, p: { armR: { a: 80, b: -8 } } },
    { f: 32, p: { armR: { a: 140, b: -40 }, headTilt: -4 }, ease: easeOut },
    { f: len, p: { armR: { a: 136, b: -36 } } },
  ]);
  const seller = poseAt(t, [
    { f: 0, p: { ...basePose, x: 1320, y: 700, scale: 1.25, yaw: -0.6, look: -0.4, armL: { a: 70, b: -10 } } },
    { f: 22, p: { armL: { a: 40, b: -20 } } },
  ]);
  const ph = toWorld(pip, joints(pip).armR.end);
  const sh = toWorld(seller, joints(seller).armL.end);
  const tk = t < 22 ? { x: sh.x + (ph.x - sh.x) * pass, y: sh.y + (ph.y - sh.y) * pass } : ph;
  return (
    <g>
      <g filter="url(#blur6)">
        <g transform={camT(proj(-4.6, 1.4, 8).x, proj(-4.6, 1.4, 8).y, 2.1)}>
          <Street t={t + 160} id="b10st" veil={0.2} market={1} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#1A1020" opacity={0.25} />
      <Glow x={1700} y={200} r={600} o={0.45} />
      <ellipse cx={1000} cy={1000} rx={1100} ry={60} fill="#000" opacity={0.3} />
      <Hero look={SELLER} pose={{ ...seller, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
      <NonLa pose={seller} />
      <LotteryStall x={1280} y={1010} s={1.3} t={t} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'smug'], [30, 'happy']]) }} rimId="rimR" />
      <MegaTicket x={tk.x + 40} y={tk.y - 40} s={0.42} id="b10tk" rot={t < 22 ? -10 : -18} nums={NUMS} />
      {t > 30 ? <Glow x={ph.x + 40} y={ph.y - 40} r={160} o={0.5 * clamp((t - 30) / 6)} /> : null}
      {Array.from({ length: 5 }).map((_, i) => <circle key={i} cx={200 + rnd(81, i) * 1500} cy={150 + rnd(82, i) * 300} r={30 + rnd(83, i) * 40} fill="#FFD9A0" opacity={0.12} />)}
    </g>
  );
};
