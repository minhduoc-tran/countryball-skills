import React from 'react';
import { Hero, LOOKS, Pose, basePose, walkPose, faceAt, kf, clamp, easeOut, backOut, camT, Sparkle, FONT, ShotProps } from '../../engine';
import { DrySeabed } from './kit-dry-seabed';
import { Pill } from './che-mars-props';
import { GoldenBeach, ChoiceCard, TrenchIcon, TitanicIcon, IslandIcon } from './che-sea-props';

// Chapter E, "8 question" (271.19-282.99 s): the end card over the golden Đà Nẵng beach. Pip stands at the LEFT, the question
// is at the top, the three choices sit in a row at the middle, the comment line below them; the bottom-right third stays empty
// for YouTube's end-screen elements. The last shot (E19) holds to the end of the timeline through the 3 s tail.
//   E16 "Còn bạn, nếu được đi bộ một ngày dưới đáy biển khô," Pip turns to us, a thought bubble of the dry seabed
//   E17 "bạn muốn đến đâu đầu tiên?" the question pops   E18 the three choices pop on their words
//   E19 "Viết ở phần bình luận nhé." the comment line + bubble, everything holds
const OFF17 = 71; // frames since E16 began (273.57 - 271.19)
const OFF18 = 129; // 275.50
const OFF19 = 232; // 278.95

/** The beach at golden hour with Pip on the sand (left). toCam 0 = looking out to sea, 1 = looking at us; wave raises his arm. */
const CardWorld: React.FC<{ T: number; id: string; toCam: number; wave?: number }> = ({ T, id, toCam, wave = 0 }) => {
  const w = Math.sin(T / 4);
  const pip: Pose = {
    ...basePose, x: 250, y: 799, scale: 1.15, yaw: 0.6 * (1 - toCam), facing: 1, look: 0.7 * (1 - toCam),
    headTilt: 3 + Math.sin(T / 12) * 2 * (1 - toCam),
    armR: { a: 12 + 140 * wave + w * 12 * wave, b: -6 + 20 * wave }, armL: { a: 12, b: -4 },
    ...faceAt(T, [[0, 'happy']]),
  };
  return (
    <g>
      <GoldenBeach id={id} t={T * 1.6 + 300} sun={0.4} />
      <rect x={-100} y={-100} width={2120} height={1300} fill="#2A1450" opacity={0.12} />
      <Hero look={LOOKS.pipHood} pose={pip} rimId="rimR" shadow={0} />
    </g>
  );
};

/** The two-line question at the top; pops at frame `at` of the clock T. */
const Title: React.FC<{ T: number; at: number }> = ({ T, at }) => {
  if (T < at) return null;
  const k = backOut(clamp((T - at) / 9));
  const pulse = 0.4 + 0.25 * Math.sin(T / 10);
  return (
    <g transform={`translate(960 160) scale(${k})`}>
      {['BẠN MUỐN ĐẾN ĐÂU', 'ĐẦU TIÊN?'].map((line, i) => (
        <text key={i} y={i * 112} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={108} letterSpacing={2} fill="#FFE27A" stroke="#14264A" strokeWidth={20} paintOrder="stroke" style={{ filter: `drop-shadow(0 0 22px rgba(255,200,90,${pulse}))` }}>{line}</text>
      ))}
    </g>
  );
};

const CARD_Y = 535;
const Cards: React.FC<{ T: number }> = ({ T }) => (
  <g>
    <ChoiceCard x={520} y={CARD_Y} t={T} at={2} label="RÃNH MARIANA"><TrenchIcon /></ChoiceCard>
    <ChoiceCard x={870} y={CARD_Y} t={T} at={42} label="TITANIC"><TitanicIcon /></ChoiceCard>
    <ChoiceCard x={1220} y={CARD_Y} t={T} at={80} label="HOÀNG SA"><IslandIcon /></ChoiceCard>
  </g>
);

// ---------- E16: Pip turns to us; a thought bubble shows him walking the dry seabed ----------
export const E16: React.FC<ShotProps> = ({ t, len }) => {
  const k = backOut(clamp((t - 18) / 12));
  const s = 0.27;
  const walker = walkPose(kf(t, [[18, 700], [len, 1300]]), t * 0.6, 820, 1.4, {}, 1);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.03]]))}>
      <CardWorld T={t} id="e16w" toCam={easeOut(clamp((t - 4) / 10))} />
      {t >= 18 ? (
        <g transform={`translate(1000 400) scale(${k})`}>
          <defs><clipPath id="e16clip"><circle r={250} /></clipPath></defs>
          <circle cx={-250} cy={250} r={26} fill="#FFF6E4" stroke="#14121A" strokeWidth={5} />
          <circle cx={-190} cy={200} r={40} fill="#FFF6E4" stroke="#14121A" strokeWidth={5} />
          <g clipPath="url(#e16clip)">
            <g transform={`translate(${-960 * s} ${-540 * s}) scale(${s})`}>
              <DrySeabed id="e16s" t={t} salt={1} haze={0.4} dust={0.3} />
              <Hero look={LOOKS.pipHood} pose={walker} rimId="rimR" shadow={0} />
            </g>
          </g>
          <circle r={250} fill="none" stroke="#14121A" strokeWidth={8} />
        </g>
      ) : null}
    </g>
  );
};

// ---------- E17: the bubble pops away, the question lands ----------
export const E17: React.FC<ShotProps> = ({ t, len }) => {
  const T = t + OFF17;
  const gone = clamp((t - 0) / 8);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.03], [len, 1.0]]))}>
      <CardWorld T={T} id="e17w" toCam={1} />
      {gone < 1 ? <circle cx={1000} cy={400} r={250 * (1 - gone)} fill="#FFF6E4" opacity={1 - gone} stroke="#14121A" strokeWidth={8} /> : null}
      <Title T={t} at={13} />
      <Sparkle x={1240} y={200} t={t - 30} s={1.2} />
    </g>
  );
};

// ---------- E18: Rãnh Mariana / Titanic / Hoàng Sa pop in on their words ----------
export const E18: React.FC<ShotProps> = ({ t }) => {
  const T = t + OFF18;
  return (
    <g>
      <CardWorld T={T} id="e18w" toCam={1} />
      <Title T={t + 58} at={13} />
      <Cards T={t} />
    </g>
  );
};

// ---------- E19: "Viết ở phần bình luận nhé": the comment line + bubble; Pip waves; holds to the end ----------
export const E19: React.FC<ShotProps> = ({ t, len }) => {
  const T = t + OFF19;
  const k = backOut(clamp((t - 22) / 9));
  const push = 1 + 0.05 * easeOut(clamp(t / len)); // slow push-in over the long hold
  return (
    <g transform={`translate(960 540) scale(${push}) translate(-960 -540)`}>
      <CardWorld T={T} id="e19w" toCam={1} wave={easeOut(clamp((t - 6) / 10))} />
      <Title T={t + 58 + 103} at={13} />
      <Cards T={t + 103} />
      <Pill x={870} y={780} text="Viết ở phần bình luận nhé" t={t} at={2} size={44} />
      <g transform={`translate(1520 330) scale(${k})`} opacity={t < 22 ? 0 : 1}>
        <path d="M -90 -50 Q -90 -74 -66 -74 L 66 -74 Q 90 -74 90 -50 L 90 26 Q 90 50 66 50 L -20 50 L -60 84 L -52 50 L -66 50 Q -90 50 -90 26 Z" fill="#FFF6E4" stroke="#14121A" strokeWidth={6} strokeLinejoin="round" />
        {[-36, 0, 36].map((dx, i) => <circle key={i} cx={dx} cy={-12 - 12 * Math.max(0, Math.sin(t / 4 - i * 0.9))} r={11} fill="#14121A" />)}
      </g>
      <Sparkle x={150} y={420} t={(t % 70) - 4} s={1.1} />
      <Sparkle x={1330} y={300} t={((t + 30) % 80) - 4} s={1.0} />
    </g>
  );
};
