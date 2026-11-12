import React from 'react';
import {
  Hero, basePose, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, LOOKS, LEG_LEN, Schematic, SchLabel, SCH, FONT, FloatLabel, Sparkle, ShotProps,
} from '../../engine';
import { IncomeCard, Standee, barX, barTop, lineY, BASE } from './chd-income-bars-card';
import { Stamp } from './chd-earth-and-icons-props';

// Chapter D, "5 relative" explanation (D22-D29): nine people on bars of income sorted low to high; the middle one is
// "MỨC GIỮA"; a red line at 60% of it; everyone under it is flagged. Then every bar grows x10 and the line rises with
// them: the same people are still under it, and Pip, on his bar, looks up at the line.

const U0 = 2.4; // bar height scale before the growth
const U1 = 3.5; // after (x10 richer, drawn as 1.45x taller so the row still fits the frame)
const RED = '#FF5A48';
const Card: React.FC<{ t: number; id: string; children: React.ReactNode }> = ({ t, id, children }) => (
  <g>
    <Schematic t={t} id={id} />
    {children}
  </g>
);

// ---------- D22: "Vì ở đó, người ta tính nghèo bằng cách so sánh": the bars and people grow in; a compare arrow ----------
export const D22: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.07]]))}>
    <Card t={t} id="d22s">
      <IncomeCard t={t} id="d22c" u={U0} pop={t / 40} cmp={(t - 50) / 20} />
      <SchLabel x={960} y={985} t={t - 4} text="THU NHẬP" size={44} color={SCH.dim} />
    </Card>
  </g>
);

// ---------- D23: "...dưới sáu mươi phần trăm": close: the red line draws across, the 60% pill pops ----------
export const D23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 620], [26, 1350]]), lineY(U0) - 40, kf(t, [[0, 1.7], [len, 1.5]]))}>
    <Card t={t + 20} id="d23s">
      <IncomeCard t={t} id="d23c" u={U0} line={(t - 2) / 24} />
    </Card>
  </g>
);

// ---------- D24: "mức giữa của cả nước": the middle person is marked, a bracket spans the whole country ----------
export const D24: React.FC<ShotProps> = ({ t, len }) => {
  const br = backOut(clamp((t - 14) / 8));
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Card t={t + 40} id="d24s">
        <IncomeCard t={t} id="d24c" u={U0} line={1} mid={(t - 2) / 10} />
        <g opacity={clamp((t - 14) / 6)}>
          <path d="M 170 250 V 210 H 1750 V 250" stroke={SCH.line} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <g transform={`translate(960 160) scale(${br})`}>
            <rect x={-130} y={-34} width={260} height={62} rx={31} fill="#0B1226" stroke={SCH.line} strokeWidth={4} />
            <text y={10} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill={SCH.line} letterSpacing={2}>CẢ NƯỚC</text>
          </g>
        </g>
      </Card>
    </g>
  );
};

// ---------- D25: "là có nguy cơ nghèo": the three under the line flash red ----------
export const D25: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 640], [len, 560]]), 640, kf(t, [[0, 1.5], [len, 1.7]]))}>
    <Card t={t + 60} id="d25s">
      <IncomeCard t={t} id="d25c" u={U0} line={1} mid={1} flag={(t - 2) / 10} />
    </Card>
  </g>
);

// ---------- D26: "Đó là cách tính thật": the card dims, a stamp slams on it ----------
export const D26: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Card t={t + 80} id="d26s">
      <g opacity={0.45}><IncomeCard t={t} id="d26c" u={U0} line={1} mid={1} flag={1} /></g>
    </Card>
    <Stamp x={960} y={500} t={t - 4} text="THẬT" sub="EUROSTAT" rot={-6} s={1.6} />
  </g>
);

// ---------- D27: "dù cả thế giới giàu lên gấp mười": every bar grows, the 60% line rises with them ----------
export const D27: React.FC<ShotProps> = ({ t, len }) => {
  const g = easeOut(clamp((t - 10) / 30));
  const u = U0 + (U1 - U0) * g + (t > 40 ? Math.sin((t - 40) * 0.8) * 0.08 * Math.exp(-(t - 40) / 8) : 0);
  const n = Math.round(1 + 9 * g);
  const lab = backOut(clamp((t - 4) / 8));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.04]]))}>
      <Card t={t + 100} id="d27s">
        <IncomeCard t={t} id="d27c" u={u} line={1} mid={1} flag={1} ghostU={t > 8 ? U0 : undefined} />
        <g transform={`translate(960 128) scale(${lab})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={96} fill="#FFE27A" stroke="#1A1230" strokeWidth={10} paintOrder="stroke" letterSpacing={2}>GIÀU LÊN GẤP MƯỜI</text>
        </g>
        <text x={300} y={290} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={130} fill={SCH.live} style={{ filter: `drop-shadow(0 0 14px ${SCH.glow}88)` }}>×{n}</text>
        <FloatLabel x={960} y={420} t={t - 12} text="×10" size={120} />
        <Sparkle x={1500} y={230} t={t - 30} s={1.3} />
      </Card>
    </g>
  );
};

// ---------- D28: "chỉ cần bạn kém xa hàng xóm": the camera runs from the three under the line to the tallest ----------
export const D28: React.FC<ShotProps> = ({ t, len }) => {
  const a = { x: barX(2) + 70, y: barTop(2, U1) - 90 };
  const b = { x: barX(8), y: barTop(8, U1) - 150 };
  const p = easeOut(clamp((t - 6) / 26));
  const tag = backOut(clamp((t - 30) / 8));
  return (
    <g transform={camT(kf(t, [[0, 560], [len, 1380]]), 560, kf(t, [[0, 1.35], [len, 1.25]]))}>
      <Card t={t + 140} id="d28s">
        <IncomeCard t={t} id="d28c" u={U1} line={1} flag={1} />
        <path d={`M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${a.y - 150} ${b.x} ${b.y}`} stroke={SCH.live} strokeWidth={7} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
        <g transform={`translate(${b.x} ${b.y - 80}) scale(${tag})`}>
          <rect x={-130} y={-32} width={260} height={60} rx={30} fill="#0B1226" stroke={SCH.live} strokeWidth={4} />
          <text y={10} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={32} fill={SCH.live} letterSpacing={2}>HÀNG XÓM</text>
        </g>
      </Card>
    </g>
  );
};

// ---------- D29: "bạn vẫn có thể thấy mình nghèo": Pip on his small bar, looking up at the red line ----------
export const D29: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.15;
  const top = 840;
  const lineAt = 290;
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 640, y: top - LEG_LEN * sc, scale: sc, yaw: 0.35, look: 0.2, armL: { a: 8, b: 6 }, armR: { a: 10, b: 6 } } },
    { f: 14, p: { headTilt: -7, look: 0.6, yaw: 0.5 } },
  ]);
  const pulse = 0.6 + 0.4 * Math.sin(t / 3.2);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 860]]), 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Card t={t + 160} id="d29s">
        <rect x={540} y={top} width={200} height={BASE - top + 120} rx={10} fill="#8A2E36" stroke={RED} strokeWidth={4} />
        {[0, 1, 2, 3, 4].map((i) => {
          const h = 530 + i * 90;
          return (
            <g key={i}>
              <rect x={960 + i * 175} y={BASE + 120 - h} width={118} height={h} rx={8} fill="#2F4F86" stroke="#6F93D6" strokeWidth={4} />
              <Standee x={1019 + i * 175} y={BASE + 118 - h} s={1.25} />
            </g>
          );
        })}
        <line x1={120} y1={lineAt} x2={1800} y2={lineAt} stroke={RED} strokeWidth={8} strokeDasharray="22 12" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${RED}99)` }} />
        <g transform={`translate(150 ${lineAt - 56})`}>
          <rect x={-10} y={-30} width={124} height={60} rx={30} fill={RED} stroke="#1D2033" strokeWidth={5} />
          <text x={52} y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#fff">60%</text>
        </g>
        <Hero look={LOOKS.pipHood} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [30, 'tired']]) }} rimId="rimR" shadow={0.3} />
        <g transform={`translate(640 ${lineAt + 56})`} opacity={0.5 + pulse * 0.5}>
          <rect x={-170} y={-24} width={340} height={46} rx={23} fill={RED} stroke="#1D2033" strokeWidth={4} />
          <text y={9} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={26} fill="#fff" letterSpacing={2}>NGUY CƠ NGHÈO</text>
        </g>
      </Card>
    </g>
  );
};
