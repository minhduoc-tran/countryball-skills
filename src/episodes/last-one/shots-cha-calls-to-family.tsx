import React from 'react';
import {
  Hero, Pose, basePose, kf, clamp, easeOut, camT, LOOKS, HEAD, Glow, LightVeil, Phone, Tabletop, Kitchen, FONT, ShotProps,
} from '../../engine';
import { InsertArm } from './insert-arm-and-icons';

// Chapter A, the calls: "Bạn gọi cho mẹ. Gọi cho bố. Gọi cho em gái." Three quick phone inserts (each from a different
// angle, so no two neighbours match), Pip with the phone at his ear, and the call ending: the screen goes dark.

const PIP = LOOKS.pipHood;

/** The engine's Phone draws a bob-haired caller; for dad and the little sister, repaint the avatar on top of it (same screen colour, same spot). */
const CallPhone: React.FC<{ x: number; y: number; w: number; rot: number; who: 'mum' | 'dad' | 'sis'; caller: string; buzz: number; f: number; on?: number }> = ({ x, y, w, rot, who, caller, buzz, f, on = 1 }) => {
  const jx = buzz > 0 ? Math.sin(f * 9.1) * w * 0.012 * buzz : 0;
  return (
    <g>
      <Phone x={x} y={y} w={w} rot={rot} on={on} caller={caller} buzz={buzz} f={f} />
      {who !== 'mum' && on > 0 ? (
        <g transform={`translate(${x + jx} ${y}) rotate(${rot})`}>
          <rect x={-0.3 * w} y={-0.72 * w} width={0.6 * w} height={0.57 * w} fill="#3E5784" />
          {who === 'dad' ? (
            <g>
              <path d={`M ${-0.3 * w} ${-0.16 * w} Q ${-0.3 * w} ${-0.3 * w} 0 ${-0.3 * w} Q ${0.3 * w} ${-0.3 * w} ${0.3 * w} ${-0.16 * w} Z`} fill="#F6EFE3" />
              <circle cx={0} cy={-0.42 * w} r={0.2 * w} fill="#F6EFE3" />
              <path d={`M ${-0.2 * w} ${-0.44 * w} Q ${-0.22 * w} ${-0.64 * w} 0 ${-0.63 * w} Q ${0.22 * w} ${-0.64 * w} ${0.2 * w} ${-0.44 * w} Q ${0.1 * w} ${-0.52 * w} 0 ${-0.52 * w} Q ${-0.1 * w} ${-0.52 * w} ${-0.2 * w} ${-0.44 * w} Z`} fill="#2E2420" />
            </g>
          ) : (
            <g>
              <circle cx={-0.2 * w} cy={-0.5 * w} r={0.075 * w} fill="#4A2A22" />
              <circle cx={0.2 * w} cy={-0.5 * w} r={0.075 * w} fill="#4A2A22" />
              <circle cx={-0.2 * w} cy={-0.44 * w} r={0.03 * w} fill="#F07A6A" />
              <circle cx={0.2 * w} cy={-0.44 * w} r={0.03 * w} fill="#F07A6A" />
              <path d={`M ${-0.24 * w} ${-0.16 * w} Q ${-0.24 * w} ${-0.27 * w} 0 ${-0.27 * w} Q ${0.24 * w} ${-0.27 * w} ${0.24 * w} ${-0.16 * w} Z`} fill="#F6EFE3" />
              <circle cx={0} cy={-0.41 * w} r={0.17 * w} fill="#F6EFE3" />
              <path d={`M ${-0.17 * w} ${-0.43 * w} Q ${-0.17 * w} ${-0.58 * w} 0 ${-0.58 * w} Q ${0.17 * w} ${-0.58 * w} ${0.17 * w} ${-0.43 * w} Q ${0.06 * w} ${-0.5 * w} ${-0.04 * w} ${-0.5 * w} Q ${-0.12 * w} ${-0.5 * w} ${-0.17 * w} ${-0.43 * w} Z`} fill="#4A2A22" />
            </g>
          )}
        </g>
      ) : null}
    </g>
  );
};
const dots = (t: number) => '.'.repeat(1 + (Math.floor(t / 6) % 3));
const Calling: React.FC<{ x: number; y: number; t: number; size?: number }> = ({ x, y, t, size = 42 }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT.ui} fontSize={size} fill="#CFE6FF" letterSpacing={6} opacity={0.9}>{`ĐANG GỌI${dots(t)}`}</text>
);

// ---------- A20: top-down on the island: the phone ringing for MẸ, ripples going out; nobody picks up ----------
export const A20: React.FC<ShotProps> = ({ t, len }) => {
  const ring = t % 18 < 11 ? 1 : 0;
  return (
    <g transform={`translate(960 540) rotate(${-4 + t * 0.07}) scale(${kf(t, [[0, 1.0], [len, 1.1]])}) translate(-960 -540)`}>
      <Tabletop edge={1400} wood="#A89C8A" grain="#968A78" lip="#8E8474" kind="stone" floor="#2C2A30" floorLines="#232127" />
      <LightVeil id="a20veil" lights={[[960, 520, 560]]} o={0.62} />
      <rect x={1380} y={140} width={300} height={16} rx={8} fill="#B89A5A" transform="rotate(30 1530 148)" opacity={0.5} />
      {[0, 1, 2].map((k) => {
        const p = ((t + k * 9) % 27) / 27;
        return <circle key={k} cx={960} cy={500} r={240 + 260 * p} fill="none" stroke="#CFE6FF" strokeWidth={6} opacity={0.5 * (1 - p)} />;
      })}
      <Phone x={960} y={500} w={320} rot={6} on={1} caller="MẸ" buzz={ring} f={t} />
      <Calling x={960} y={930} t={t} />
    </g>
  );
};

// ---------- A21: close, the phone held up in his mitten, BỐ on the screen, the kitchen soft behind ----------
export const A21: React.FC<ShotProps> = ({ t, len }) => {
  const ring = t % 14 < 9 ? 1 : 0;
  const bob = Math.sin(t / 3) * 4;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 990]]), 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -260) scale(1.5)">
          <Kitchen t={t + 200} id="cl21" />
        </g>
      </g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#0A0A12" opacity={0.35} />
      <CallPhone x={1000} y={500 + bob} w={470} rot={-8} who="dad" caller="BỐ" buzz={ring} f={t} />
      <InsertArm x={1090} y={800 + bob} fx={1500} fy={1400} rot={-20} s={5.6} width={130} />
    </g>
  );
};

// ---------- A22: low and tilted: the phone on the dark floor, EM GÁI ringing, his thumb coming in to press ----------
export const A22: React.FC<ShotProps> = ({ t, len }) => {
  const ring = t % 20 < 12 ? 1 : 0;
  const tap = { x: kf(t, [[0, 260], [12, 700], [16, 712], [26, 300]]), y: kf(t, [[0, 1200], [12, 740], [16, 730], [26, 1200]]) };
  return (
    <g transform={`translate(960 540) rotate(${8 - t * 0.08}) scale(${kf(t, [[0, 1.05], [len, 1.18]])}) translate(-960 -540)`}>
      <Tabletop edge={1500} wood="#4A3A44" grain="#3E3038" lip="#5A4652" floor="#1E1824" floorLines="#18121E" />
      <LightVeil id="a22veil" lights={[[1060, 520, 520]]} o={0.7} />
      <CallPhone x={1060} y={520} w={380} rot={14} who="sis" caller="EM GÁI" buzz={ring} f={t} />
      <Calling x={1060} y={960} t={t} size={36} />
      <InsertArm x={tap.x} y={tap.y} fx={tap.x - 380} fy={tap.y + 560} rot={30} s={5} width={116} point />
    </g>
  );
};

// ---------- A23: close-up, the phone at his ear, waiting, the ringing goes on and on; his face sinks ----------
export const A23: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.6 * (1 + 0.06 * clamp(t / len));
  const head = { x: 1060, y: 600 };
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.3, look: kf(t, [[0, 0.7], [20, 0.9], [36, -0.4]]),
    armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: kf(t, [[0, 2], [30, -6]]),
    expr: t < 16 ? 'neutral' : 'worried', blink: t > 10 && t < 13 ? 1 : 0,
  };
  const ear = { x: head.x - 62 * sc * 0.95, y: head.y + 10 };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-620 -420) scale(1.8)">
          <Kitchen t={t + 260} id="cl23" />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.34} />
      <Hero look={PIP} pose={pose} rimId="rimBlue" shadow={0} />
      <g filter="url(#rimBlueL)">
        <path d={`M ${ear.x - 40} ${ear.y + 120} Q ${ear.x - 220} ${ear.y + 380} ${ear.x - 160} 1240`} stroke={PIP.line} strokeWidth={200} fill="none" strokeLinecap="round" />
        <path d={`M ${ear.x - 40} ${ear.y + 120} Q ${ear.x - 220} ${ear.y + 380} ${ear.x - 160} 1240`} stroke={PIP.limb} strokeWidth={176} fill="none" strokeLinecap="round" />
        <rect x={ear.x - 70} y={ear.y - 190} width={90} height={330} rx={26} fill="#16151C" stroke="#3A3846" strokeWidth={6} transform={`rotate(-12 ${ear.x} ${ear.y})`} />
        <ellipse cx={ear.x - 40} cy={ear.y + 90} rx={92} ry={78} fill={PIP.hand} stroke={PIP.line} strokeWidth={10} />
      </g>
    </g>
  );
};

// ---------- A24: insert, the call ends: the screen buzzes, goes black, and the hand drops away with it ----------
export const A24: React.FC<ShotProps> = ({ t, len }) => {
  const off = easeOut(clamp((t - 10) / 14));
  const on = t < 9 ? 1 : 0;
  return (
    <g transform={camT(960, kf(t, [[0, 540], [len, 590]]), kf(t, [[0, 1.05], [len, 1.0]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -260) scale(1.5)">
          <Kitchen t={t + 230} id="cl24" />
        </g>
      </g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#0A0A12" opacity={0.4} />
      <g transform={`translate(0 ${off * 360})`}>
        <CallPhone x={960} y={520} w={450} rot={4 - off * 10} on={on} who="sis" caller="EM GÁI" buzz={t < 8 ? 1 : 0} f={t} />
        <InsertArm x={1040} y={820} fx={1500} fy={1400} rot={-16} s={5.4} width={128} />
      </g>
      {on ? null : <Glow x={960} y={520} r={500} o={0.12} />}
    </g>
  );
};
