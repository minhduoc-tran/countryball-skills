import React from 'react';
import { Hero, LOOKS, Pose, basePose, faceAt, kf, clamp, easeOut, camT, Foreground, Glow, Sparkle, rnd, FONT, ShotProps } from '../../engine';
import { MorningBedroom, BedDuvet, bedSit, roomStand, MB } from './kit-morning-bedroom';
import { DayCounter, MemoryGlow } from './kit-loop-clock';
import { PianoKeys } from './kit-props';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { fmtVN } from './kit-palette';
import { Pill, SpeechBubble, NoteGlyph } from './che-common-props';
import { CalendarGrid, MirrorFrame, LANGS } from './che-ten-years-props';

// Chapter E, "7 ten years" (237.54-253.38 s), part 1: the years pile up, the body stays, the mind grows.
//   E1 time-lapse of the same 06:00 room, DayCounter racing (year1)   E2 a wall of THỨ TƯ pages, "3.650" (year10)
//   E3 split screen NGÀY #1 = NGÀY #3.650: the same body   E4 the mirror: older eyes, MemoryGlow, "+10 TUỔI"
//   E5 five greetings in five scripts   E6 piano insert, virtuoso hands
const PIP = LOOKS.pipHood;
const SIT = bedSit(0.14);

/** Pip sitting up in bed (the loop's first pose); stretch 0..1 raises both arms. */
const sitPose = (t: number, stretch = 0, extra: Partial<Pose> = {}): Pose => ({
  ...basePose, x: SIT.x, y: SIT.y, scale: SIT.scale, yaw: 0.35, facing: 1, look: 0.4,
  headTilt: Math.sin(t / 10) * 2,
  armL: { a: 14 + 105 * stretch, b: -6 + 50 * stretch }, armR: { a: 14 + 105 * stretch, b: -6 + 50 * stretch },
  legL: { a: 80, b: 0 }, legR: { a: 80, b: 0 },
  ...extra,
});

// ---------- E1 "Một năm trôi qua. Rồi mười năm.": the same 06:00 room, Pip flickering through his routine, the counter races ----------
const SPOTS: [number, number, number][] = [[0, 0, 0], [0.6, 0.48, 0.5], [0.74, 0.3, -0.4], [0.5, 0.62, 0.2], [0.66, 0.2, 0.7]];
export const E1: React.FC<ShotProps> = ({ t, len }) => {
  const step = t < 40 ? 6 : 3; // the days blur faster after "Rồi mười năm"
  const k = Math.floor(t / step) % SPOTS.length;
  const n = t < 32 ? Math.round(kf(t, [[0, 1], [32, 365]], easeOut)) : t < 40 ? 365 : Math.round(kf(t, [[40, 365], [len, 3100]], (x) => x * x));
  const [u, w, yaw] = SPOTS[k];
  const st = roomStand(u, w);
  const pose: Pose = k === 0 ? sitPose(t, 0) : { ...basePose, ...st, yaw, facing: yaw < 0 ? -1 : 1, look: yaw, ...faceAt(t, [[0, 'neutral']]) };
  const flick = t % step < 1 ? 0.18 : 0;
  return (
    <g>
      <g transform={camT(kf(t, [[0, 900], [len, 930]]), 560, kf(t, [[0, 1.02], [len, 1.1]]))}>
        <MorningBedroom id="e1r" t={t + 30} ring={t % 18 < 9 ? 1 : 0} duvet={k !== 0} />
        {k === 0 ? (
          <g>
            <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
            <BedDuvet knees={0.3} />
          </g>
        ) : (
          <Hero look={PIP} pose={pose} rimId="rimR" />
        )}
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#A8F3F5" opacity={flick} style={{ mixBlendMode: 'screen' }} />
      <DayCounter x={1500} y={130} n={n} t={t} s={1.15} />
    </g>
  );
};

// ---------- E2 "Bạn đã sống ba nghìn sáu trăm năm mươi ngày thứ Tư.": a wall of THỨ TƯ pages, the number lands ----------
export const E2: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp((t - 16) / 8);
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#1C1A2E" />
      <g transform={`translate(960 540) scale(${kf(t, [[0, 1.08], [len, 1.0]])}) translate(-960 -540)`}>
        <CalendarGrid t={t * 1.5 + 14} cols={15} rows={8} x0={-20} y0={-20} cw={131} ch={140} />
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0C1A" opacity={0.35 * k} />
      <rect x={260} y={330} width={1400} height={420} rx={60} fill="#14121F" opacity={0.86 * k} />
      {t >= 16 ? (
        <g transform={`translate(960 590) scale(${kf(t, [[16, 2.2], [21, 0.94], [25, 1.03], [29, 1]], easeOut)})`}>
          <text textAnchor="middle" y={40} fontFamily={FONT.title} fontWeight={800} fontSize={300} fill="#FFE27A" stroke="#2A1408" strokeWidth={24} paintOrder="stroke" style={{ filter: 'drop-shadow(0 0 30px rgba(255,200,90,0.45))' }}>{fmtVN(3650)}</text>
        </g>
      ) : null}
      <Pill x={960} y={700} text="NGÀY THỨ TƯ" t={t} at={38} size={56} col="#FFFFFF" />
      <Glow x={960} y={560} r={700} o={0.18 * k} />
    </g>
  );
};

// ---------- E3 "Cơ thể bạn vẫn như sáng hôm đó,": split screen, day 1 and day 3.650, the same body, synced ----------
const Panel: React.FC<{ t: number; cx: number; id: string; label: string; col: string }> = ({ t, cx, id, label, col }) => {
  const stretch = easeOut(clamp((t - 8) / 14)) * (1 - easeOut(clamp((t - 34) / 14)));
  return (
    <g>
      <defs><clipPath id={`${id}c`}><rect x={cx - 475} y={0} width={950} height={1080} /></clipPath></defs>
      <g clipPath={`url(#${id}c)`}>
        <g transform={`translate(${cx - 960} 0)`}>
          <g transform={camT(SIT.x + 60, SIT.y - 70, kf(t, [[0, 2.3], [56, 2.42]]))}>
            <MorningBedroom id={id} t={t + 50} duvet={false} />
            <Hero look={PIP} pose={sitPose(t, stretch, { ...faceAt(t, [[0, 'neutral'], [24, 'happy']]) })} rimId="rimR" shadow={0} />
            <BedDuvet knees={0.3} />
          </g>
        </g>
      </g>
      <Pill x={cx} y={950} text={label} t={t} at={2} size={50} col={col} />
    </g>
  );
};
export const E3: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Panel t={t} cx={480} id="e3a" label="NGÀY #1" col="#FFFFFF" />
    <Panel t={t} cx={1440} id="e3b" label={`NGÀY #${fmtVN(3650)}`} col="#FFE27A" />
    <rect x={952} y={0} width={16} height={1080} fill="#0E0C16" />
    <g transform="translate(960 470)">
      <circle r={66} fill="#14121F" stroke="#A8F3F5" strokeWidth={6} />
      <text y={34} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={100} fill="#A8F3F5">=</text>
    </g>
  </g>
);

// ---------- E4 "nhưng đầu óc bạn đã già thêm mười tuổi.": over Pip's shoulder into the mirror: the same face, older eyes ----------
export const E4: React.FC<ShotProps> = ({ t, len }) => {
  const MX = 1180;
  const MY = 500;
  const refl: Pose = {
    ...basePose, x: MX + 10, y: MY + 470, scale: 2.5, yaw: -0.3, facing: -1, look: -0.1, headTilt: -3 + Math.sin(t / 14) * 1.5,
    ...faceAt(t, [[0, 'neutral'], [26, 'tired']]),
  };
  const back: Pose = { ...basePose, x: 380, y: 1290, scale: 4.6, yaw: 0.75, facing: 1, look: 0.8, headTilt: 2 };
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <g filter="url(#blur10)"><g transform={camT(1290, 470, 2.2)}><MorningBedroom id="e4r" t={t + 90} /></g></g>
      <rect x={-100} y={-100} width={2120} height={1280} fill="#0E0A14" opacity={0.25} />
      <MirrorFrame x={MX} y={MY} w={520} h={780} id="e4m">
        <g transform={`translate(${2 * MX} 0) scale(-1 1)`}>
          <g filter="url(#blur6)"><g transform={camT(700, 470, 2.0)}><MorningBedroom id="e4rr" t={t + 90} /></g></g>
        </g>
        <Hero look={PIP} pose={refl} rimId="rimL" shadow={0} />
        <MemoryGlow x={MX + 10 + 0.3 * 0} y={MY + 470 - 176 * 2.5} r={190} t={t} id="e4g" o={clamp((t - 22) / 10)} />
      </MirrorFrame>
      <Pill x={1640} y={300} text="+10 TUỔI" t={t} at={30} size={54} col="#A8F3F5" />
      <Foreground blur={16}><Hero look={PIP} pose={back} rimId="rimR" shadow={0} /></Foreground>
    </g>
  );
};

// ---------- E5 "Bạn nói được năm thứ tiếng,": five greetings in five scripts pop round him ----------
const BUB: [number, number][] = [[520, 300], [1400, 280], [400, 600], [1520, 600], [960, 160]];
export const E5: React.FC<ShotProps> = ({ t, len }) => {
  const talk = Math.floor(t / 4) % 2;
  const pose: Pose = {
    ...basePose, x: 960, y: 930, scale: 2.0, yaw: 0.15, facing: 1, look: 0.1, headTilt: Math.sin(t / 5) * 4,
    armR: { a: 40 + Math.sin(t / 4) * 10, b: 30 }, armL: { a: 12, b: -6 },
    ...faceAt(t, [[0, 'happy']]), ...(talk ? { expr: 'smug' as const } : {}),
  };
  return (
    <g>
      <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.05]]))}>
        <g filter="url(#blur10)"><g transform={camT(1100, 470, 1.9)}><MorningBedroom id="e5r" t={t + 120} /></g></g>
        <rect x={-100} y={-100} width={2120} height={1280} fill="#0E0A14" opacity={0.2} />
        <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      </g>
      {BUB.map(([x, y], i) => {
        const w = LANGS[i].length * 50 + 90;
        return (
          <SpeechBubble key={i} x={x} y={y} w={Math.max(300, w)} h={130} t={t} at={1 + i * 6} tail={{ x: (960 - x) * 0.25, y: 120 }}>
            <text y={20} textAnchor="middle" fontFamily={i === 0 || i === 3 ? FONT.hand : 'sans-serif'} fontWeight={700} fontSize={58} fill="#1D2033">{LANGS[i]}</text>
          </SpeechBubble>
        );
      })}
      <Pill x={960} y={1000} text="5 THỨ TIẾNG" t={t} at={4} size={52} col="#FFE27A" />
    </g>
  );
};

// ---------- E6 "chơi đàn như nghệ sĩ,": the keyboard huge, both hands flying over it, notes rising ----------
const KX0 = 960 - 780;
const KW = 1560 / 14;
const keyX = (i: number) => KX0 + (i + 0.5) * KW;
const LEFT = [1, 3, 5, 2, 4, 6, 3, 1];
const RIGHT = [9, 11, 13, 10, 12, 8, 11, 13];
export const E6: React.FC<ShotProps> = ({ t, len }) => {
  const i = Math.floor(t / 4);
  const l = LEFT[i % LEFT.length];
  const r = RIGHT[(i + 3) % RIGHT.length];
  const hop = (t % 4) / 4;
  const lift = Math.sin(hop * Math.PI) * 30;
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.06]]))}>
      <rect x={-100} y={-100} width={2120} height={1280} fill="#1A1424" />
      <Glow x={960} y={220} r={900} o={0.5} />
      <g filter="url(#blur10)">
        {Array.from({ length: 9 }).map((_, k) => <circle key={k} cx={200 + rnd(3, k) * 1500} cy={120 + rnd(4, k) * 220} r={30 + rnd(5, k) * 40} fill="#FFD9A0" opacity={0.25} />)}
      </g>
      <PianoKeys x={960} y={1010} w={1560} t={t} press={[l, r]} />
      {Array.from({ length: 7 }).map((_, k) => {
        const p = ((t + k * 9) % 40) / 40;
        return <NoteGlyph key={k} x={300 + rnd(7, k) * 1320 + Math.sin(t / 6 + k) * 30} y={420 - p * 360} s={0.9 + rnd(8, k) * 0.6} rot={(rnd(9, k) - 0.5) * 40} o={Math.sin(p * Math.PI)} />;
      })}
      <InsertArm x={keyX(l)} y={760 - lift} fx={keyX(l) - 260} fy={1260} s={5.2} width={120} rot={170} />
      <InsertArm x={keyX(r)} y={760 - lift * 0.8} fx={keyX(r) + 220} fy={1260} s={5.2} width={120} rot={190} />
      <Sparkle x={keyX(r)} y={640} t={(t % 20) - 2} s={1.1} />
      <Foreground blur={16}><rect x={-100} y={1040} width={2120} height={200} fill="#0C0A12" /></Foreground>
    </g>
  );
};
