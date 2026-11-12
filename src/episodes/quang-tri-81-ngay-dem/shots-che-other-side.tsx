import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { Beret, M1Helmet } from '../../countryball/ball-accessories-military';
import { breathe, mixMotion } from '../../countryball/ball-motion';
import { Candle } from '../../countryball/ground-memorial-props';
import { WaterRipples } from '../../countryball/ground-water-splash';
import { MonsoonRain } from '../../countryball/ground-weather-and-smoke';
import { Glow, Puff } from '../../countryball/fx-glow';
import { easeInOut, hash, lerp } from '../../countryball/fx-math';
import { Backdrop, Dim, Pop, ramp, sec, Txt, YELLOW } from './chb-common';
import { Push, VnmSoldier } from './che-common';

// Chapter E, beat "23 other side" (E23-E27, 456.4-470.3 s): the other side of the front: the young Dù / TQLC soldiers of Sài Gòn lie in the same
// rain and mud under the same smoky sky. Same respect for both sides: sad, tired balls, no mockery, no gloating.

const RvnDu = () => <Beret color="#B3262B" badge="wings" />;
const RvnMar = () => <Beret color="#2F6B3A" badge="anchor" />;

// ---------- E23: "ở phía bên kia chiến tuyến": camera pans across the front line from the red side to the yellow side ----------
export const E23: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), pan = lerp(300, -300, easeInOut(ramp(s, 0, 1.5)));
  return (
    <g>
      <Backdrop s={s} id="e23" top="#1B2A3E" bottom="#0A121D" />
      <g transform={`translate(${pan},0)`}>
        <rect x={-300} y={0} width={1260} height={1080} fill="#C8573F" opacity={0.1} /><rect x={960} y={0} width={1260} height={1080} fill={YELLOW} opacity={0.1} />
        <line x1={960} y1={0} x2={960} y2={1080} stroke="#F4F4F4" strokeWidth={6} strokeDasharray="26 18" strokeDashoffset={-t * 2} opacity={0.7} />
        <VnmSoldier id="e23v" x={480} y={640} r={150} t={t} eyes="worried" />
        <Ball id="e23r" x={1440} y={640} r={150} flag="RVN" eyes="worried" hat={<M1Helmet />} t={t} look={-0.4} motion={breathe(t, 70, 0.03, 9)} />
      </g>
      <Txt x={960} y={170} text="BÊN KIA CHIẾN TUYẾN" size={92} o={ramp(s, 0.1, 0.4)} />
    </g>
  );
};

// ---------- E24: the young Dù (red beret) and TQLC (green beret) soldiers ----------
export const E24: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="e24" top="#22262F" bottom="#0D1119" />
      <Push s={s} dur={4.6} to={1.05} cy={600}>
        <Pop s={s} at={0.65} x={590} y={620}><Ball id="e24a" x={590} y={620} r={185} flag="RVN" eyes="worried" hat={<RvnDu />} t={t} motion={breathe(t, 72, 0.03, 4)} /></Pop>
        <Pop s={s} at={1.3} x={1330} y={620}><Ball id="e24b" x={1330} y={620} r={185} flag="RVN" eyes="worried" hat={<RvnMar />} t={t} motion={breathe(t, 72, 0.03, 14)} /></Pop>
      </Push>
      <Txt x={590} y={900} text="LÍNH DÙ" size={64} color={YELLOW} o={ramp(s, 0.8, 1.1)} />
      <Txt x={1330} y={900} text="THỦY QUÂN LỤC CHIẾN" size={56} color={YELLOW} o={ramp(s, 1.45, 1.75)} />
      <Txt x={960} y={150} text="QUÂN ĐỘI SÀI GÒN" size={58} color="#DCE4EC" o={ramp(s, 0.1, 0.4)} />
      <Txt x={960} y={250} text="PHẦN LỚN LÀ THANH NIÊN" size={86} o={ramp(s, 3.6, 3.95)} />
    </g>
  );
};

// ---------- E25: "cũng nằm trong mưa, trong bùn": two RVN balls in a flooded trench ----------
export const E25: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="e25" top="#2C3440" bottom="#14181F" />
      <rect x={0} y={700} width={1920} height={380} fill="#3A2D22" />
      {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={hash(i, 3) * 1920} cy={760 + hash(i, 4) * 280} rx={70 + 60 * hash(i, 5)} ry={14 + 10 * hash(i, 5)} fill="#2A2018" />)}
      <Push s={s} dur={2.1} to={1.05} cy={640}>
        <Ball id="e25a" x={700} y={620} r={170} flag="RVN" eyes="sad" hat={<M1Helmet net />} t={t} motion={breathe(t, 68, 0.03, 3)} />
        <Ball id="e25b" x={1160} y={650} r={170} flag="RVN" eyes="sad" hat={<RvnMar />} t={t} motion={breathe(t, 68, 0.03, 17)} />
        {/* trench front wall + sandbags hide the lower half of the balls */}
        <rect x={0} y={770} width={1920} height={310} fill="#2B2118" /><rect x={0} y={760} width={1920} height={18} fill="#4B3A2A" />
        {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={100 + i * 230} cy={766} rx={80} ry={26} fill="#8A7B5A" stroke="#141414" strokeWidth={4} />)}
        {[0, 1, 2, 3].map((i) => <WaterRipples key={i} t={t} t0={t - (i * 9) % 30} x={260 + i * 470} y={900} r={50} n={2} life={50} />)}
      </Push>
      <Txt x={960} y={170} text="TRONG MƯA" size={96} o={ramp(s, 0.7, 1.0)} />
      <Txt x={960} y={290} text="TRONG BÙN" size={96} color="#D9B88A" o={ramp(s, 1.55, 1.85)} />
      <MonsoonRain t={t} intensity={0.8} angle={12} dim={0.2} />
    </g>
  );
};

// ---------- E26: "dưới cùng một bầu trời đầy khói lửa": two sides, one smoky sky ----------
export const E26: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), smoke = 0.55 + 0.35 * ramp(s, 0.8, 1.9);
  return (
    <g>
      <defs><linearGradient id="e26-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#12161E" /><stop offset="0.6" stopColor="#3A2A28" /><stop offset="1" stopColor="#6A3A26" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#e26-sky)" />
      <Glow x={300} y={720} r={520} color="#FF6A2E" o={0.35 * ramp(s, 0.8, 1.6)} /><Glow x={1620} y={720} r={520} color="#FF9A2E" o={0.35 * ramp(s, 0.8, 1.6)} />
      {Array.from({ length: 9 }, (_, i) => <Puff key={i} x={((hash(i, 1) * 2600 + s * (18 + 10 * hash(i, 2))) % 2600) - 340} y={140 + hash(i, 3) * 420} r={230 + 120 * hash(i, 4)} color="#2A2A2E" o={smoke * (0.55 + 0.3 * hash(i, 5))} seed={i} />)}
      <rect x={0} y={800} width={1920} height={280} fill="#14120F" />
      <rect x={880} y={800} width={160} height={280} fill="#14293F" /><rect x={880} y={800} width={160} height={280} fill="#8FB4D6" opacity={0.08} />
      <VnmSoldier id="e26v" x={470} y={700} r={150} t={t} eyes="worried" />
      <Ball id="e26r" x={1450} y={700} r={150} flag="RVN" eyes="worried" hat={<M1Helmet />} t={t} look={-0.3} motion={breathe(t, 70, 0.03, 9)} />
      <Txt x={960} y={180} text="CÙNG MỘT BẦU TRỜI" size={100} o={ramp(s, 0.4, 0.8)} />
      <MonsoonRain t={t} intensity={0.3} angle={10} dim={0.05} />
    </g>
  );
};

// ---------- E27: "chiến tranh không chừa lại tuổi trẻ của bên nào": both balls, one candle between them ----------
export const E27: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="e27" top="#0F1824" bottom="#05090F" />
      <Glow x={960} y={700} r={720} color="#FFB347" o={0.2} />
      <Push s={s} dur={3.5} to={1.05} cy={640}>
        <VnmSoldier id="e27v" x={520} y={650} r={180} t={t} eyes="sad" />
        <Ball id="e27r" x={1400} y={650} r={180} flag="RVN" eyes="sad" hat={<M1Helmet />} t={t} look={-0.5} motion={breathe(t, 72, 0.03, 11)} />
        <Candle x={960} y={830} s={210} t={t} seed={3} />
      </Push>
      <Txt x={960} y={160} text="CHIẾN TRANH KHÔNG CHỪA" size={84} o={ramp(s, 0.1, 0.5)} />
      <Txt x={960} y={270} text="TUỔI TRẺ CỦA BÊN NÀO" size={84} color="#FFD166" o={ramp(s, 1.2, 1.6)} />
      <Dim o={0.12} />
      <MonsoonRain t={t} intensity={0.2} angle={10} dim={0.03} />
    </g>
  );
};
