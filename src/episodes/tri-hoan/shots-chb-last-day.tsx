import React from 'react';
import { poseAt, faceAt, kf, clamp, easeOut, backOut, camT, Glow, FocusRings, Foreground, FONT, ShotProps } from '../../engine';
import { HeartIcon, Battery, SweatDrops } from './chb-notes-and-icons';
import { DeskScene, SEAT, ScreenFrame, SlideEditor, SlowNetworkScreen, ChatPhone, SCREEN } from './chb-desk-laptop-and-chat';

// Chapter B, last day (shots B17-B22, look c1): Pip opens the laptop, the slow network and 10% battery, the empty
// "SAO MỘC?" slide, 23:00 and the pounding heart, Mo's chat "Xong chưa mày?" and Pip's "Sắp".

// ---------- B17: wide: Pip at the desk lifts the laptop lid ----------
export const B17: React.FC<ShotProps> = ({ t, len }) => {
  const open = easeOut(clamp((t - 34) / 16));
  const pose = poseAt(t, [
    { f: 0, p: { ...SEAT, armR: { a: 40, b: -10 }, tilt: 3, headTilt: 4 } },
    { f: 32, p: { armR: { a: 86, b: -8 }, tilt: 5 } },
    { f: 50, p: { armR: { a: 74, b: -14 }, tilt: 1, headTilt: -2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1180], [len, 1230]]), 590, kf(t, [[0, 1.15], [len, 1.3]]))}>
      <DeskScene t={t} id="b17" clock="23:40" pose={{ ...pose, ...faceAt(t, [[0, 'tired'], [48, 'worried']]) }} lidOpen={open} glow={open} />
    </g>
  );
};

// ---------- B18: insert: the laptop screen: a loading wheel that never ends, then the battery drops to 10% ----------
export const B18: React.FC<ShotProps> = ({ t, len }) => {
  const pct = kf(t, [[0, 41], [22, 38], [30, 10]]);
  const toast = backOut(clamp((t - 28) / 8));
  return (
    <g transform={camT(960, 480, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <ScreenFrame id="b18">
        <SlowNetworkScreen t={t} pct={Math.round(pct)} />
        {t >= 28 ? (
          <g transform={`translate(960 690) scale(${toast})`}>
            <g transform={`translate(${Math.sin(t * 1.7) * 3 * Math.exp(-(t - 28) / 12)} 0)`}>
              <rect x={-230} y={-70} width={460} height={140} rx={34} fill="#2A2838" stroke="#FF4A3F" strokeWidth={6} />
              <Battery x={-110} y={0} pct={10} s={1.35} t={t} />
              <text x={90} y={30} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={84} fill="#FF4A3F">10%</text>
            </g>
          </g>
        ) : null}
      </ScreenFrame>
    </g>
  );
};

// ---------- B19: the slide editor: the picture box for Jupiter is empty ("SAO MỘC?"); Pip's dark hood blurs in the foreground ----------
export const B19: React.FC<ShotProps> = ({ t, len }) => {
  const pulse = clamp((t - 30) / 6);
  const red = pulse * (0.55 + 0.45 * Math.abs(Math.sin(t / 5)));
  return (
    <g transform={camT(960, 480, kf(t, [[0, 1.0], [len, 1.16]]))}>
      <ScreenFrame id="b19">
        <SlideEditor t={t}>
          <g transform="translate(400 255)">
            <rect x={-170} y={-120} width={340} height={240} rx={14} fill="#F6F4FA" stroke={red > 0 ? '#E0302F' : '#A8A2C0'} strokeWidth={5 + 3 * red} strokeDasharray="18 12" />
            <path d="M -70 50 L -22 -14 L 14 30 L 36 4 L 74 50 Z" fill="#CFCAE0" /><circle cx={42} cy={-46} r={16} fill="#CFCAE0" />
            <text y={104} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={42} fill="#4A4660">SAO MỘC?</text>
          </g>
        </SlideEditor>
      </ScreenFrame>
      <Foreground blur={16}>
        <ellipse cx={90} cy={1020} rx={420} ry={360} fill="#1A1826" />
        <ellipse cx={90} cy={1020} rx={420} ry={360} fill="none" stroke="#FFD9A0" strokeWidth={8} opacity={0.25} />
      </Foreground>
      <FocusRings x={SCREEN.x + 760} y={SCREEN.y + 430} t={t - 28} r0={70} color="#FF6A5A" />
    </g>
  );
};

// ---------- B20: close: 23:00 on the clock, then the heart pounds (heartbeat line, camera thumps) ----------
const ecg = (x: number, t: number) => {
  const u = (((x - t * 9) % 120) + 120) % 120;
  if (u < 14) return 0;
  if (u < 24) return -(u - 14) * 3.2;
  if (u < 32) return -32 + (u - 24) * 9;
  if (u < 40) return 40 - (u - 32) * 6;
  return 0;
};
export const B20: React.FC<ShotProps> = ({ t, len }) => {
  const beating = t >= 36;
  const thump = beating ? Math.max(0, Math.sin((t - 36) * 0.85)) ** 4 : 0;
  const pose = poseAt(t, [
    { f: 0, p: { ...SEAT, armR: { a: 60, b: -10 }, tilt: 2 } },
    { f: 36, p: { tilt: -4, headTilt: -5, armL: { a: 70, b: -30 } } },
    { f: 50, p: { tilt: -6, headTilt: -8 } },
  ]);
  let d = '';
  for (let x = 700; x <= 1560; x += 8) d += `${x === 700 ? 'M' : 'L'} ${x} ${900 + ecg(x, t)} `;
  return (
    <g transform={camT(1180, 600, 1.55 + 0.03 * thump)}>
      <DeskScene t={t} id="b20" clock="23:00" pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [36, 'shock']]) }} over={
        <g>
          <g transform="translate(800 440) scale(0.85)">
            <rect x={-150} y={-84} width={300} height={130} rx={20} fill="#120A0C" stroke="#3A3444" strokeWidth={6} />
            <text y={30} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={104} fill="#FF4A3F" style={{ filter: 'drop-shadow(0 0 14px rgba(255,74,63,0.8))' }}>23:00</text>
          </g>
          <SweatDrops x={1170} y={500} t={t - 10} />
          {beating ? (
            <g>
              <path d={d} stroke="#FF5A6E" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 10px rgba(255,90,110,0.8))' }} />
              <HeartIcon x={1150} y={690} s={0.36} t={t - 36} />
              {[0, 1].map((i) => <circle key={i} cx={1150} cy={690} r={40 + ((t - 36 + i * 7) % 14) * 7} fill="none" stroke="#FF5A6E" strokeWidth={5} opacity={0.5 - ((t - 36 + i * 7) % 14) / 30} />)}
            </g>
          ) : null}
        </g>
      } />
    </g>
  );
};

// ---------- B21: the phone buzzes: Mo: "Xong chưa mày?" ----------
export const B21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 330, kf(t, [[0, 1.45], [len, 1.6]]))}>
    <rect x={-400} y={-400} width={2720} height={1880} fill="#0A0814" />
    <Glow x={960} y={540} r={760} kind="cool" o={0.4} />
    <ChatPhone x={960} y={550} t={t} s={1.08} moAt={33} buzz={t >= 33 && t < 46 ? 1 : 0} />
  </g>
);

// ---------- B22: Pip's nervous smile; the reply "Sắp" lands in the chat ----------
export const B22: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...SEAT, armR: { a: 40, b: -10 }, headTilt: 3 } },
    { f: 26, p: { headTilt: -4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 1060]]), 580, kf(t, [[0, 1.4], [len, 1.5]]))}>
      <DeskScene t={t} id="b22" clock="23:48" pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [27, 'oops']]) }} over={
        <g>
          <ChatPhone x={690} y={600} t={t} s={0.62} moAt={-5} replyAt={27} />
          <SweatDrops x={1190} y={520} t={t - 27} />
        </g>
      } />
    </g>
  );
};
