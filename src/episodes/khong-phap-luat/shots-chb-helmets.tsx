import React from 'react';
import { Schematic, SCH, FONT, UI, Glow, Sparkle, FloatLabel, Motorbike, kf, clamp, easeOut, backOut, easeInOut, camT, ShotProps } from '../../engine';
import { NumCard, TickStamp } from '../khong-ai-ngheo/chb-cards-and-marks';
import { PersonIcon } from '../last-one/insert-arm-and-icons';
import { HelmetIcon, RoadSide, RiderStream, HelmetSign, LawDoc, RiskBar, helmetCount } from './chb-helmet-props';

// Chapter B, "hour one: helmets" (B1-B10): the WHO numbers on schematic cards, then Vietnam 2007 on a dusk road where
// helmets pop on one by one, the law document, and the green "ĐÓ LÀ THẬT" tick.

// ---------- B1: "1,19 TRIỆU" counts up; a row of person icons lights up behind it ----------
export const B1: React.FC<ShotProps> = ({ t, len }) => (
  <NumCard t={t} len={len} id="sb1" to={1.19} dec={2} unit="TRIỆU" caption="NGƯỜI CHẾT VÌ GIAO THÔNG MỖI NĂM" dur={40}>
    {Array.from({ length: 13 }).map((_, i) => (
      <PersonIcon key={i} x={260 + i * 115} y={880} s={1.5} on={t > 6 + i * 2.5} o={clamp((t - i) / 6)} glow={t > 6 + i * 2.5} />
    ))}
    <text x={960} y={1010} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.dim} letterSpacing={3} opacity={easeOut(clamp((t - 16) / 8))}>WHO</text>
  </NumCard>
);

// ---------- B2: a scooter tips over on the road, the siren lights sweep, a warning triangle pulses ----------
export const B2: React.FC<ShotProps> = ({ t, len }) => {
  const fall = easeOut(clamp((t - 6) / 14));
  const flash = Math.floor(t / 5) % 2;
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Schematic t={t} id="sb2" />
      <path d="M -200 780 H 2120" stroke={SCH.line} strokeWidth={6} />
      <path d="M -200 990 H 2120" stroke={SCH.dim} strokeWidth={4} />
      {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M ${((i * 260 - t * 9) % 2600) - 200} 885 h 120`} stroke={SCH.dim} strokeWidth={6} strokeLinecap="round" />)}
      <g transform={`translate(${kf(t, [[0, 420], [6, 760], [26, 1050]], easeOut)} ${-90 * Math.sin(Math.PI * fall)}) rotate(${180 * fall} 0 700)`}>
        <Motorbike x={0} y={780} s={2.2} facing={1} color="#B8483E" spin={t * 30 * (1 - 0.7 * fall)} shadow={1 - fall} />
      </g>
      <path d="M 1010 790 H 1330" stroke={SCH.live} strokeWidth={5} strokeDasharray="14 12" opacity={fall} />
      <g transform="translate(1500 330)">
        <Glow x={0} y={0} r={300} kind="red" o={flash ? 0.55 : 0.2} />
        <path d="M -62 40 A 62 62 0 0 1 62 40 Z" fill={flash ? '#E8453C' : '#4A6AE8'} stroke="#101A2A" strokeWidth={5} strokeLinejoin="round" />
        <rect x={-84} y={40} width={168} height={26} rx={8} fill={SCH.dim} stroke="#101A2A" strokeWidth={4} />
        {[-1, 1].map((d) => <path key={d} d={`M ${d * 100} ${-10 - flash * 8} L ${d * 160} ${-30 - flash * 8} M ${d * 100} 20 L ${d * 170} 20`} stroke={flash ? '#E8453C' : '#4A6AE8'} strokeWidth={8} strokeLinecap="round" opacity={0.8} />)}
      </g>
      <g transform={`translate(330 380) scale(${1 + 0.08 * Math.sin(t / 3)})`} opacity={easeOut(clamp((t - 12) / 8))} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow})` }}>
        <path d="M 0 -110 L 112 80 H -112 Z" fill="none" stroke={SCH.live} strokeWidth={14} strokeLinejoin="round" />
        <path d="M 0 -48 V 20" stroke={SCH.live} strokeWidth={16} strokeLinecap="round" />
        <circle cx={0} cy={54} r={9} fill={SCH.live} />
      </g>
    </g>
  );
};

// ---------- B3: a helmet pops in huge with a glint sweeping over it ----------
export const B3: React.FC<ShotProps> = ({ t, len }) => {
  const k = backOut(clamp((t + 1) / 9));
  const ring = clamp((t - 3) / 18);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Schematic t={t} id="sb3" />
      <Glow x={960} y={520} r={600} o={0.35} />
      {ring > 0 && ring < 1 ? <circle cx={960} cy={520} r={260 + 260 * ring} fill="none" stroke={SCH.live} strokeWidth={10 * (1 - ring)} opacity={1 - ring} /> : null}
      <g transform={`translate(960 520) scale(${3.2 * k}) rotate(${-4 + Math.sin(t / 8) * 2})`} style={{ filter: `drop-shadow(0 0 20px ${SCH.glow}88)` }}>
        <HelmetIcon x={0} y={0} s={1} color="#E9C46A" />
      </g>
      <Sparkle x={760} y={330} t={t - 10} s={1.4} />
      <Sparkle x={1210} y={400} t={t - 15} s={1.1} />
      <Sparkle x={1000} y={260} t={t - 20} s={0.9} />
    </g>
  );
};

// ---------- B4: "−42%": the risk bar loses 42% as the number counts ----------
export const B4: React.FC<ShotProps> = ({ t, len }) => {
  const p = easeOut(clamp((t - 6) / 34));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t} id="sb4" />
      <g transform={`translate(960 400) scale(${0.9 + 0.1 * backOut(clamp((t + 2) / 8))})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={330} fill="#4CE08A" style={{ filter: 'drop-shadow(0 0 24px #2FBF7188)' }}>{`−${Math.round(42 * p)}%`}</text>
      </g>
      <RiskBar x={360} y={560} w={1200} h={92} cut={p} />
      <text x={960} y={730} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={50} fill={SCH.line} letterSpacing={4} opacity={easeOut(clamp((t - 10) / 8))}>NGUY CƠ TỬ VONG</text>
      <HelmetIcon x={360} y={850} s={0.9} />
      <text x={960} y={880} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.dim} letterSpacing={3} opacity={easeOut(clamp((t - 16) / 8))}>WHO · ĐỘI MŨ ĐÚNG CÁCH</text>
    </g>
  );
};

// ---------- B5: "2007" ----------
export const B5: React.FC<ShotProps> = ({ t, len }) => (
  <NumCard t={t} len={len} id="sb5" to={2007} statik caption="VIỆT NAM BẮT BUỘC ĐỘI MŨ BẢO HIỂM">
    <HelmetIcon x={300} y={780} s={1.1} rot={-8 + Math.sin(t / 6) * 3} />
    <HelmetIcon x={1620} y={780} s={1.1} color="#EDE6D6" rot={8 - Math.sin(t / 6) * 3} />
  </NumCard>
);

// ---------- B6: the law arrives: a round blue helmet sign pops up beside the road, bare heads still riding by ----------
export const B6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 700], [len, 800]]), 560, kf(t, [[0, 1.2], [len, 1.3]]))}>
    <RoadSide t={t + 40} id="sb6" />
    <RiderStream t={t + 40} have={0} />
    <HelmetSign x={560} y={790} s={1.15} t={t - 6} />
    <Sparkle x={680} y={300} t={t - 12} s={1.3} />
  </g>
);

// ---------- B7: wide: ~30% of the riders put a helmet on, one by one ----------
export const B7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 640, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <RoadSide t={t + 90} id="sb7" />
    <RiderStream t={t + 90} have={0} popAt={134} gap={9} until={4} />
    <g transform={`translate(960 330) scale(${backOut(clamp((t - 36) / 8))})`}>
      <rect x={-210} y={-92} width={420} height={150} rx={40} fill={UI.pill} opacity={0.78} />
      <text textAnchor="middle" y={26} fontFamily={FONT.ui} fontWeight={700} fontSize={112} fill={SCH.live}>~30%</text>
    </g>
  </g>
);

// ---------- B8: the rest follow in a rush; the counter turns to 90%+ ----------
export const B8: React.FC<ShotProps> = ({ t, len }) => {
  const worn = helmetCount(t, 4, 2, 4, 13);
  const shown = worn >= 12 ? '90%+' : worn <= 4 ? '~30%' : `${Math.round((worn / 14) * 100)}%`;
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 900]]), 700, kf(t, [[0, 1.25], [len, 1.4]]))}>
      <RoadSide t={t + 140} id="sb8" />
      <RiderStream t={t + 140} have={4} popAt={142} gap={4} until={13} />
      <g transform={`translate(1000 520) scale(${1 + 0.22 * Math.max(0, 1 - Math.abs(t - 40) / 6)})`}>
        <rect x={-250} y={-96} width={500} height={152} rx={42} fill={UI.pill} opacity={0.82} />
        <text textAnchor="middle" y={30} fontFamily={FONT.ui} fontWeight={700} fontSize={116} fill={worn >= 12 ? '#4CE08A' : SCH.live}>{shown}</text>
      </g>
      <FloatLabel x={1000} y={400} t={t - 42} text="90%+" color="#4CE08A" size={60} />
    </g>
  );
};

// ---------- B9: "chỉ nhờ một điều luật": one small law document glowing in the dark ----------
export const B9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.12]], easeInOut))}>
    <Schematic t={t} id="sb9" />
    <LawDoc x={960} y={540} t={t} s={1.15} />
    <Sparkle x={620} y={300} t={t - 8} s={1.2} />
    <Sparkle x={1330} y={380} t={t - 13} s={1.0} />
  </g>
);

// ---------- B10: ĐÓ LÀ THẬT ----------
export const B10: React.FC<ShotProps> = ({ t }) => <TickStamp t={t} id="sb10" sub="WHO · PASSMORE 2010" />;
