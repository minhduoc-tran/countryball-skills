import React from 'react';
import { Hero, LOOKS, Pose, basePose, faceAt, kf, clamp, easeOut, camT, Foreground, Glow, Sparkle, rnd, FONT, ShotProps } from '../../engine';
import { Globe } from './kit-globe';
import { Pill } from './che-mars-props';
import { GoldenBeach, WaterOver, Badge, RainIcon, O2Icon, CoolIcon, FishIcon, ShipIcon, WaveIcon } from './che-sea-props';

// Chapter E, "8 ending" (258.67-271.19 s): the real sea is back.
//   E10 waves roll in   E11 Mo waves from the water   E12 Pip tastes the salt   E13 71% of the planet
//   E14 a thousand jobs the sea does for you   E15 Pip looks out at it (the question card follows in shots-che-question-card)

// ---------- E10 "Nhưng hôm nay, sóng vẫn vỗ.": a warm golden Đà Nẵng sea, waves rolling ----------
export const E10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 600], [len, 650]]), kf(t, [[0, 1.0], [len, 1.16]]))}>
    <GoldenBeach id="e10b" t={t * 1.6} sun={0.4} />
    <Sparkle x={1130} y={600} t={t - 24} s={1.1} />
    <Sparkle x={620} y={680} t={t - 40} s={0.9} />
  </g>
);

// ---------- E11 "Mo đang vẫy tay gọi bạn xuống tắm.": Mo in the surf waves at us; Pip's hood blurred in front ----------
export const E11: React.FC<ShotProps> = ({ t, len }) => {
  const wave = Math.sin(t / 3.2);
  const mo: Pose = {
    ...basePose, x: 1010, y: 650, scale: 1.0, yaw: 0, facing: 1, headTilt: 4 + wave * 3,
    armR: { a: 150 + wave * 16, b: 14 }, armL: { a: 14, b: -4 },
    legL: { a: 6, b: 0 }, legR: { a: -6, b: 0 },
    ...faceAt(t, [[0, 'happy']]),
  };
  const pip: Pose = { ...basePose, x: 440, y: 990, scale: 2.0, yaw: 0.75, facing: 1, headTilt: 5, armL: { a: 12, b: -4 }, armR: { a: 12, b: -4 }, ...faceAt(t, [[0, 'happy']]) };
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 940]]), 620, kf(t, [[0, 1.5], [len, 1.62]]))}>
      <GoldenBeach id="e11b" t={t * 1.6 + 60} sun={0.3} />
      <Hero look={LOOKS.mo} pose={mo} rimId="rimR" shadow={0} />
      <WaterOver x={1010} y={768 + Math.sin(t / 9) * 3} w={340} t={t} />
      <Foreground blur={16}><Hero look={LOOKS.pipHood} pose={pip} rimId="rimR" shadow={0} /></Foreground>
      <Sparkle x={1130} y={430} t={t - 20} s={0.9} />
    </g>
  );
};

// ---------- E12 "Nước mằn mặn trên môi.": Pip close, eyes shut, wet; a tongue touches the lip, MẶN pops ----------
export const E12: React.FC<ShotProps> = ({ t, len }) => {
  const sip = easeOut(clamp((t - 6) / 8)) * (1 - easeOut(clamp((t - 28) / 8)));
  const pose: Pose = {
    ...basePose, x: 960, y: 940, scale: 2.8, yaw: 0, headTilt: 3 + Math.sin(t / 9) * 2,
    ...faceAt(t, [[0, 'happy'], [8, 'happy']]), blink: t > 6 && t < 30 ? 1 : 0,
  };
  return (
    <g transform={camT(960, 470, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <g filter="url(#blur10)"><GoldenBeach id="e12b" t={t + 200} sun={0.35} /></g>
      <Hero look={LOOKS.pipHood} pose={pose} rimId="rimR" shadow={0} />
      <g opacity={sip}><ellipse cx={972} cy={529} rx={22} ry={12} fill="#E96A7A" stroke="#7A2230" strokeWidth={4} /></g>
      {Array.from({ length: 6 }).map((_, i) => {
        const x = 800 + rnd(3, i) * 330;
        const y = 330 + ((t * (4 + rnd(4, i) * 3) + rnd(5, i) * 300) % 280);
        return <path key={i} d={`M ${x} ${y - 14} q 9 14 0 22 q -9 -8 0 -22 Z`} fill="#BFE9F8" stroke="#2E86C1" strokeWidth={2} opacity={0.9} />;
      })}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${1130 + i * 34 - (i % 2) * 20} ${430 - Math.sin(t / 7 + i) * 6 - i * 18}) rotate(${i * 20 + t})`} opacity={clamp((t - 10) / 6)}>
          <rect x={-9} y={-9} width={18} height={18} fill="#FFFFFF" stroke="#8FA4B2" strokeWidth={2} />
        </g>
      ))}
      <Sparkle x={1190} y={410} t={t - 12} s={1.0} />
      <Pill x={1470} y={420} text="MẶN" t={t} at={10} size={84} />
    </g>
  );
};

const SeaBg: React.FC<{ id: string; t: number }> = ({ id, t }) => (
  <g>
    <defs>
      <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1B6FA8" /><stop offset="1" stopColor="#52C3DC" /></linearGradient>
    </defs>
    <rect x={-100} y={-100} width={2120} height={1280} fill={`url(#${id}g)`} />
    {Array.from({ length: 18 }).map((_, i) => (
      <path key={i} d={`M ${rnd(7, i) * 1900} ${rnd(8, i) * 1080} q 20 -16 40 0 t 40 0`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.3 * Math.max(0, Math.sin(t / 9 + i * 2))} />
    ))}
    <Glow x={1500} y={100} r={800} o={0.35} />
  </g>
);

// ---------- E13 "Bảy mươi mốt phần trăm hành tinh này là biển.": the blue planet, a 71% ring, the number ----------
export const E13: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.round(71 * easeOut(clamp(t / 30)));
  const C = 2 * Math.PI * 372;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <SeaBg id="e13" t={t} />
      <Globe id="e13g" t={t} r={320} cx={600} cy={540} water={1} rot={110} />
      <circle cx={600} cy={540} r={372} fill="none" stroke="#FFE27A" strokeWidth={22} strokeLinecap="round" strokeDasharray={`${C * 0.71 * easeOut(clamp(t / 30))} ${C}`} transform="rotate(-90 600 540)" opacity={0.95} />
      <text x={1330} y={640} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={330} fill="#FFE27A" stroke="#14264A" strokeWidth={34} paintOrder="stroke" style={{ filter: 'drop-shadow(0 0 26px rgba(255,226,122,0.5))' }}>{`${n}%`}</text>
      <Pill x={1330} y={810} text="HÀNH TINH LÀ BIỂN" t={t} at={30} size={44} />
    </g>
  );
};

// ---------- E14 "Và mỗi giây, nó đang làm hàng nghìn việc cho bạn,": the sea's jobs pop up around the planet ----------
export const E14: React.FC<ShotProps> = ({ t, len }) => {
  const icons: React.ReactNode[] = [<RainIcon key="r" />, <O2Icon key="o" />, <CoolIcon key="c" />, <FishIcon key="f" />, <ShipIcon key="s" />, <WaveIcon key="w" />];
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <SeaBg id="e14" t={t + 40} />
      <Globe id="e14g" t={t + 50} r={190} cx={960} cy={560} water={1} rot={30} />
      {icons.map((ic, i) => {
        const a = (-90 + i * 60) * (Math.PI / 180);
        return <Badge key={i} x={960 + Math.cos(a) * 590} y={560 + Math.sin(a) * 340} t={t} at={4 + i * 8}>{ic}</Badge>;
      })}
      <Pill x={960} y={96} text="MỖI GIÂY" t={t} at={2} size={44} />
    </g>
  );
};

// ---------- E15 "mà bạn chưa từng để ý.": Pip on the sand, looking out at the sea ----------
export const E15: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = { ...basePose, x: 300, y: 799, scale: 1.15, yaw: 0.6, facing: 1, look: 0.7, headTilt: 3 + Math.sin(t / 12) * 2, ...faceAt(t, [[0, 'happy']]) };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 960]]), 560, kf(t, [[0, 1.0], [len, 1.04]]))}>
      <GoldenBeach id="e15b" t={t * 1.6 + 300} sun={0.4} />
      <Hero look={LOOKS.pipHood} pose={pose} rimId="rimR" shadow={0} />
      <Sparkle x={1200} y={610} t={t - 14} s={1.2} />
      <Sparkle x={880} y={560} t={t - 28} s={0.9} />
    </g>
  );
};
