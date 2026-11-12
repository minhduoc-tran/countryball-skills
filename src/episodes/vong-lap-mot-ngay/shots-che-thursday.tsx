import React from 'react';
import { Hero, LOOKS, Pose, basePose, faceAt, kf, clamp, easeOut, easeInOut, backOut, camT, Glow, Sparkle, WallFrame, FONT, ShotProps } from '../../engine';
import { FlowerPot } from './kit-props';
import { MorningBedroom, BedDuvet, bedSit, MB, AlarmInsert } from './kit-morning-bedroom';
import { FlipClock } from './kit-loop-clock';
import { TearCalendar } from './kit-bedroom-parts';
import { PhoneFrame } from '../neu-chien-tranh/chb-phone-props';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { PAL } from './kit-palette';
import { QMark } from './che-common-props';
import { FizzleRing, NewSky, TornPage } from './che-thursday-props';

// Chapter E, "8 thursday" (274.27-285.23 s): midnight comes, the reset starts and fizzles; 06:00 rings on THỨ NĂM.
//   E19 the night room, 23:59 -> 00:00, a cyan ring swells, stalls and breaks, the clock rolls ON to 06:00, dawn rises
//   E20 the alarm insert ringing (the loop's own framing)   E21 the phone lock screen: 06:00, then THỨ NĂM
//   E22 the hand tears the THỨ TƯ page: THỨ NĂM underneath   E23 the window opens on a new sky; a slow wide-eyed smile
const PIP = LOOKS.pipHood;
const SIT = bedSit(0.14);

// ---------- E19 "Nửa đêm. Sáu giờ sáng.": midnight, the reset wave fizzles, the clock rolls forward to 06:00 ----------
export const E19: React.FC<ShotProps> = ({ t, len }) => {
  const dawn = easeInOut(clamp((t - 27) / 30)) * 0.85;
  const cy = clamp((t - 8) / 6) * (1 - clamp((t - 18) / 6)) * 0.7;
  const pose: Pose = {
    ...basePose, x: SIT.x, y: SIT.y, scale: SIT.scale, yaw: 0.45, facing: 1, look: 0.6, headTilt: t > 18 && t < 30 ? -6 : 0,
    armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, legL: { a: 80, b: 0 }, legR: { a: 80, b: 0 },
    ...faceAt(t, [[0, 'worried'], [20, 'shock']]),
  };
  return (
    <g>
      <g transform={camT(kf(t, [[0, 760], [len, 780]]), 600, kf(t, [[0, 1.75], [len, 1.82]]))}>
        <MorningBedroom id="e19r" t={t + 800} dawn={dawn} clock={t < 27 ? (t < 5 ? '23:59' : '00:00') : '06:00'} ring={t >= 30 ? 1 : 0} duvet={false} />
        <Hero look={PIP} pose={pose} rimId={dawn > 0.4 ? 'rimR' : 'rimBlue'} shadow={0} />
        <BedDuvet knees={0.3} />
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#060818" opacity={0.25 * (1 - dawn)} />
      <FizzleRing x={1160} y={250} t={t} t0={8} />
      <g transform={`translate(1160 250) scale(${t >= 27 ? kf(t, [[27, 0.66], [30, 0.74], [34, 0.7]], easeOut) : 0.7})`}>
        {t < 27 ? <FlipClock x={0} y={0} time="00:00" from="23:59" flipAt={4} t={t} cyan={cy} /> : <FlipClock x={0} y={0} time="06:00" from="00:00" flipAt={0} t={t - 27} />}
      </g>
    </g>
  );
};

// ---------- E20 "Chuông báo thức reo.": the loop's alarm insert, ringing 06:00 ----------
export const E20: React.FC<ShotProps> = ({ t }) => <AlarmInsert id="e20a" t={t + 40} clock="06:00" ring={1} hand={0} />;

// ---------- E21 "Trên màn hình điện thoại hiện lên hai chữ. Thứ Năm.": the lock screen; THỨ NĂM lands on its word ----------
export const E21: React.FC<ShotProps> = ({ t, len }) => {
  const rise = easeOut(clamp(t / 14));
  const py = 1300 - 760 * rise;
  const k = t >= 64 ? backOut(clamp((t - 64) / 9)) : 0;
  return (
    <g>
      <g filter="url(#blur16)"><g transform={camT(MB.CLOCK.x + 20, MB.CLOCK.y - 60, 2.6)}><MorningBedroom id="e21r" t={t + 900} dawn={0.9} ring={0} /></g></g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0814" opacity={0.3} />
      <g transform={`translate(0 ${Math.sin(t / 9) * 4})`}>
        <InsertArm x={1060} y={py + 300} fx={1500} fy={1400} rot={-30} s={5} width={124} />
        <PhoneFrame x={960} y={py} s={1.4} rot={-4} id="e21p" glow="warm" glowO={0.4 + 0.3 * k}>
          <rect x={-140} y={-300} width={280} height={600} fill="#2A2850" />
          <rect x={-140} y={-300} width={280} height={600} fill="url(#e21sky)" />
          <defs>
            <linearGradient id="e21sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3A4A8A" />
              <stop offset="1" stopColor="#F7A58A" />
            </linearGradient>
          </defs>
          <text y={-150} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={92} fill="#FFFFFF">06:00</text>
          <rect x={-110} y={-110} width={220} height={52} rx={26} fill="#000" opacity={0.3} />
          <text y={-75} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={24} fill="#FFFFFF" opacity={0.9}>BÁO THỨC</text>
          {k > 0 ? (
            <g transform={`translate(0 40) scale(${k})`}>
              <rect x={-128} y={-62} width={256} height={150} rx={22} fill="#14121F" opacity={0.75} />
              <text y={-8} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#5BE08A" letterSpacing={2}>THỨ</text>
              <text y={66} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={76} fill="#FFE27A" style={{ filter: 'drop-shadow(0 0 12px rgba(255,226,122,0.7))' }}>NĂM</text>
            </g>
          ) : (
            <g opacity={0.6}>{[-30, 0, 30].map((dx) => <circle key={dx} cx={dx} cy={30} r={8} fill="#FFFFFF" opacity={0.4 + 0.4 * Math.sin(t / 4 + dx)} />)}</g>
          )}
          <rect x={-60} y={250} width={120} height={8} rx={4} fill="#FFFFFF" opacity={0.6} />
        </PhoneFrame>
      </g>
      {k > 0 ? <Sparkle x={1170} y={520} t={t - 64} s={1.4} /> : null}
      {k > 0 ? <Sparkle x={760} y={420} t={t - 68} s={1.1} /> : null}
    </g>
  );
};

// ---------- E22 "Và lần đầu tiên sau mười năm,": the hand rips off the THỨ TƯ page; THỨ NĂM underneath ----------
export const E22: React.FC<ShotProps> = ({ t, len }) => {
  const tear = kf(t, [[4, 0], [30, 1]], (x) => x);
  const CW = 440;
  const grab = { x: 960 + CW / 2 - 30, y: 140 + CW * 1.3 - 40 };
  const hx = grab.x + (tear < 0.45 ? 0 : 0) + Math.sin(clamp(tear / 0.45) * 0.56) * 40;
  const hy = grab.y + Math.pow(clamp((tear - 0.4) / 0.6), 2) * 1100 + clamp(tear / 0.45) * 60;
  const reach = easeOut(clamp(t / 5));
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 540]]), kf(t, [[0, 1.0], [len, 1.05]]))}>
      <g filter="url(#blur10)"><g transform={camT(MB.CAL.x, MB.CAL.y + 80, 3.4)}><MorningBedroom id="e22r" t={t + 1000} day="THỨ NĂM" /></g></g>
      <rect x={-100} y={-100} width={2120} height={1280} fill="#1A1220" opacity={0.2} />
      <Glow x={1500} y={300} r={700} o={0.35} />
      <TearCalendar x={960} y={140} w={CW} day="THỨ NĂM" />
      {t >= 30 ? <Sparkle x={960} y={520} t={t - 30} s={1.6} /> : null}
      <TornPage x={960} y={140} w={CW} t={t} tear={tear} />
      {tear < 1 ? <InsertArm x={hx + 60 * (1 - reach)} y={hy + 200 * (1 - reach)} fx={1700} fy={1400} rot={-35} s={5.2} width={124} /> : null}
    </g>
  );
};

// ---------- E23 "bạn không biết hôm nay sẽ xảy ra chuyện gì.": the window swings open on a new sky; a slow wide-eyed smile ----------
export const E23: React.FC<ShotProps> = ({ t, len }) => {
  const open = easeInOut(clamp((t - 2) / 16));
  const W = { x0: 760, y0: 120, w: 1060, h: 760 };
  const pose: Pose = {
    ...basePose, x: 470, y: 1050, scale: 2.3, yaw: 0.7, facing: 1, look: 0.8, headTilt: -4 + Math.sin(t / 14) * 2,
    armR: { a: 70 - 30 * open, b: 40 }, armL: { a: 14, b: -6 },
    ...faceAt(t, [[0, 'shock'], [44, 'happy']]),
  };
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 940]]), 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#6A5460" />
      <NewSky id="e23s" t={t + 30} x0={W.x0} y0={W.y0} w={W.w} h={W.h} />
      {/* the two casements swinging open into the room */}
      {[0, 1].map((k) => {
        const hinge = k ? W.x0 + W.w : W.x0;
        const pw = (W.w / 2) * (1 - open * 0.82);
        const x = k ? hinge - pw : hinge;
        return (
          <g key={k}>
            <rect x={x} y={W.y0} width={pw} height={W.h} fill="#BFD6EA" opacity={0.25 * (1 - open * 0.5)} />
            <rect x={x} y={W.y0} width={pw} height={W.h} fill="none" stroke="#E9E2D2" strokeWidth={22} />
            <rect x={x} y={W.y0 + W.h * 0.32} width={pw} height={12} fill="#E9E2D2" />
          </g>
        );
      })}
      <rect x={W.x0 - 30} y={W.y0 - 30} width={W.w + 60} height={30} fill="#3A2A30" />
      <rect x={W.x0 - 40} y={W.y0 + W.h} width={W.w + 80} height={40} fill="#5A4048" />
      <path d={`M ${W.x0 - 40} ${W.y0 + W.h} L ${W.x0 + W.w + 40} ${W.y0 + W.h}`} stroke="#FFF2D0" strokeWidth={6} opacity={0.8} />
      {/* the curtain on the left lifting in the fresh air */}
      <path d={`M ${W.x0 - 70} ${W.y0 - 30} L ${W.x0 + 40} ${W.y0 - 30} Q ${W.x0 + 30 + 60 * open + Math.sin(t / 7) * 20} ${W.y0 + 300} ${W.x0 + 60 + 90 * open + Math.sin(t / 6) * 30} ${W.y0 + W.h + 60} L ${W.x0 - 70} ${W.y0 + W.h + 60} Z`} fill="#D8B49A" opacity={0.92} />
      <Glow x={W.x0 + W.w * 0.6} y={W.y0 + W.h * 0.4} r={900} o={0.35 + 0.25 * open} />
      <rect x={-200} y={W.y0 + W.h + 40} width={2320} height={600} fill="#3A2C34" />
      {/* the sill: a potted plant and a mug; on the wall a poster and the shelf edge */}
      <FlowerPot x={W.x0 + W.w * 0.8} y={W.y0 + W.h + 2} s={0.9} t={t} fall={0} ledge={false} />
      <rect x={W.x0 + W.w * 0.62} y={W.y0 + W.h - 70} width={60} height={70} rx={8} fill="#2F6E69" stroke="#14121A" strokeWidth={4} />
      <WallFrame x={140} y={130} w={240} h={300} art={1} />
      <rect x={60} y={500} width={420} height={18} fill="#2A1E22" />
      {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={80 + k * 34} y={500 - 70 - (k % 2) * 16} width={28} height={70 + (k % 2) * 16} fill={['#3E6A8A', '#B8483E', '#D9A441', '#3F5E44', '#7E5A8C'][k]} />)}
      <Glow x={pose.x + 120} y={pose.y - 420} r={420} o={0.3 * open} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <QMark x={1180} y={360} s={0.9} t={t} at={46} />
      <QMark x={1500} y={300} s={0.7} t={t} at={58} col={PAL.cyanSoft} />
      <QMark x={1360} y={560} s={0.6} t={t} at={70} />
    </g>
  );
};
