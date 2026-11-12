import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe, mixMotion, shake } from '../../countryball/ball-motion';
import { GroundBlast } from '../../countryball/fx-bomb-carpet';
import { Glow } from '../../countryball/fx-glow';
import { backOut, clamp, easeOut, hash } from '../../countryball/fx-math';
import { Backdrop, Chip, Pop, ramp, sec, Txt, Vignette } from './chd-common';
import { Cutaway, FLOOR_Y } from './chd-cutaway';
import { BombIcon, BookIcon, ShellIcon } from './chd-icons';

// Chapter D, beat "15 per soldier" (D9-D14, 5:21-5:35): a book did the sums, per fighter 100 bombs + 200 shells (icon grids),
// figures differ by source, the survivors remember one thing: the explosions almost never stopped.

// ---------- D9: "một cuốn sách về trận đánh đã tính" ----------
export const D9: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), k = backOut(ramp(s, 0.05, 0.5));
  return (
    <g>
      <Backdrop s={s} id="d9" />
      <g transform={`translate(640,560) rotate(${-6 + Math.sin(s * 2) * 1.5}) scale(${2.5 * k})`}><BookIcon x={0} y={0} /></g>
      <Txt x={1340} y={400} text="ĐÃ TÍNH" size={118} color="#E2B95A" o={ramp(s, 0.5, 0.8)} />
      <Txt x={1340} y={540} text="TRUNG BÌNH" size={118} o={ramp(s, 0.7, 1.0)} />
      {/* tally strokes drawn one after another */}
      <g stroke="#F4F4F4" strokeWidth={14} strokeLinecap="round" opacity={0.9}>
        {[0, 1, 2, 3].map((i) => <line key={i} x1={1090 + i * 56} y1={660} x2={1090 + i * 56} y2={660 + 120 * ramp(s, 1.0 + i * 0.15, 1.15 + i * 0.15)} />)}
        <line x1={1070} y1={790} x2={1070 + 240 * ramp(s, 1.6, 1.85)} y2={670} />
      </g>
    </g>
  );
};

// ---------- D10: one fighter under falling fire ----------
export const D10: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  const blasts: [number, number, number][] = [[430, 835, 14], [1480, 850, 28], [700, 870, 40], [1230, 830, 52], [250, 860, 62], [1700, 870, 72]];
  return (
    <g>
      <Backdrop s={s} id="d10" top="#32201A" bottom="#0B0907" grid={false} />
      {Array.from({ length: 16 }, (_, i) => {
        const y = ((hash(i, 2) * 1100 + s * (520 + 160 * hash(i, 3))) % 1100) - 80, x = 120 + hash(i, 1) * 1680;
        return Math.abs(x - 960) < 190 ? null : i % 2 ? <BombIcon key={i} x={x} y={y} s={1.1} o={0.55} /> : <ShellIcon key={i} x={x} y={y} s={1.1} rot={180} o={0.55} />;
      })}
      <path d="M0,900 Q480,860 960,890 T1920,880 V1080 H0 Z" fill="#2A1D14" />
      {blasts.map(([x, y, t0], i) => <GroundBlast key={i} t={t} t0={t0} x={x} y={y} r={46} linger={80} />)}
      <Ball id="d10b" x={960} y={730} r={160} flag="VNM" eyes="determined" hat={<MuCoi camo />} t={t} motion={mixMotion(breathe(t, 60, 0.03), shake(t, 40, 6, 14), shake(t, 12, 6, 14))} />
      <Txt x={960} y={140} text="MỖI CHIẾN SĨ" size={124} o={ramp(s, 0.1, 0.4)} />
      <Txt x={960} y={236} text="TRUNG BÌNH" size={72} color="#E2B95A" o={ramp(s, 0.5, 0.8)} />
      <Vignette id="d10" o={0.6} />
    </g>
  );
};

// ---------- D11: 100 bombs + 200 shells as icon grids ----------
export const D11: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), sx = 46, sy = 50;
  return (
    <g>
      <Backdrop s={s} id="d11" top="#1C2230" bottom="#0A0D14" />
      <Txt x={960} y={120} text="MỖI CHIẾN SĨ" size={80} o={ramp(s, 0, 0.2)} />
      {Array.from({ length: 100 }, (_, i) => {
        const k = backOut(ramp(s, 0.05 + i * 0.007, 0.25 + i * 0.007));
        return k > 0 ? <g key={i} transform={`translate(${150 + (i % 10) * sx},${230 + Math.floor(i / 10) * sy}) scale(${k})`}><BombIcon x={0} y={0} s={0.62} /></g> : null;
      })}
      {Array.from({ length: 200 }, (_, i) => {
        const k = backOut(ramp(s, 1.0 + i * 0.0045, 1.2 + i * 0.0045));
        return k > 0 ? <g key={i} transform={`translate(${790 + (i % 20) * sx},${230 + Math.floor(i / 20) * sy}) scale(${k})`}><ShellIcon x={0} y={0} s={0.62} /></g> : null;
      })}
      <Txt x={380} y={860} text="100" size={170} color="#E2B95A" o={ramp(s, 0.5, 0.8)} />
      <Txt x={380} y={950} text="QUẢ BOM" size={70} o={ramp(s, 0.5, 0.8)} />
      <Txt x={1240} y={860} text="200" size={170} color="#E2B95A" o={ramp(s, 1.6, 1.9)} />
      <Txt x={1240} y={950} text="QUẢ ĐẠN PHÁO" size={70} o={ramp(s, 1.6, 1.9)} />
    </g>
  );
};

// ---------- D12: figures differ by source ----------
export const D12: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), bars = [[0.7, 0.4, 0.55], [0.45, 0.8, 0.3], [0.6, 0.25, 0.75]];
  return (
    <g>
      <Backdrop s={s} id="d12" />
      <Txt x={960} y={150} text="CÓ THỂ KHÁC NHAU" size={100} o={ramp(s, 0.05, 0.3)} />
      {[0, 1, 2].map((i) => {
        const k = backOut(ramp(s, 0.2 + i * 0.18, 0.55 + i * 0.18)), x = 420 + i * 540, rot = (i - 1) * 5 + Math.sin(s * 2 + i) * 1.2;
        return (
          <g key={i} transform={`translate(${x},560) rotate(${rot}) scale(${k})`}>
            <rect x={-170} y={-230} width={340} height={460} rx={14} fill="#F6F0DC" stroke="#0A121C" strokeWidth={6} />
            <rect x={-170} y={-230} width={340} height={70} rx={14} fill={['#3F5C8C', '#8C5A3F', '#5A7A4A'][i]} stroke="#0A121C" strokeWidth={6} />
            <text y={-182} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#fff">NGUỒN {i + 1}</text>
            {bars[i].map((b, j) => <rect key={j} x={-130} y={-110 + j * 90} width={260 * b * ramp(s, 0.6 + i * 0.15, 1.0 + i * 0.15)} height={44} rx={8} fill="#4A4F5C" />)}
          </g>
        );
      })}
      <Txt x={960} y={940} text="TÙY NGUỒN" size={110} color="#E2B95A" o={ramp(s, 1.1, 1.4)} />
    </g>
  );
};

// ---------- D13: three survivors in the bunker, remembering ----------
export const D13: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  const eyes = ['worried', 'sad', 'determined'] as const;
  return (
    <g>
      <Cutaway id="d13" t={t} camX={0} />
      {[0, 1, 2].map((i) => (
        <Ball key={i} id={`d13b${i}`} x={700 + i * 190} y={FLOOR_Y - 84} r={84} flag="VNM" eyes={eyes[i]} hat={<MuCoi camo={i !== 1} />} t={t} motion={breathe(t, 66, 0.025, i * 11)} look={-0.3} />
      ))}
      <Txt x={960} y={130} text="NHỮNG NGƯỜI LÍNH SỐNG SÓT" size={76} o={ramp(s, 0.1, 0.4)} />
      <Txt x={960} y={225} text="ĐỀU NHỚ MỘT ĐIỀU" size={96} color="#E2B95A" o={ramp(s, 1.0, 1.3)} />
    </g>
  );
};

// ---------- D14: the noise never stops ----------
export const D14: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), P = 22;
  const pts: [number, number][] = [[300, 300], [1500, 250], [900, 520], [1700, 640], [520, 700]];
  return (
    <g>
      <Backdrop s={s} id="d14" top="#2B1410" bottom="#0A0808" grid={false} />
      {pts.map(([x, y], i) => {
        const k = ((t + i * 9) % P) / P, fl = ((t + i * 9) % P) < 3;
        return (
          <g key={i}>
            {[0, 0.33, 0.66].map((o, j) => { const q = (k + o) % 1; return <circle key={j} cx={x} cy={y} r={30 + 420 * easeOut(q)} fill="none" stroke="#FFB45A" strokeWidth={10 * (1 - q) + 1} opacity={0.55 * (1 - q)} />; })}
            {fl && <Glow x={x} y={y} r={190} color="#FFD79A" o={0.7} />}
          </g>
        );
      })}
      {/* sound-wave bars */}
      {Array.from({ length: 64 }, (_, i) => {
        const h = 30 + 150 * clamp(Math.abs(Math.sin(i * 0.7 + t * 0.55)) * (0.5 + hash(i + Math.floor(t / 3), 6)));
        return <rect key={i} x={40 + i * 29} y={1040 - h} width={17} height={h} rx={5} fill="#FFB45A" opacity={0.75} />;
      })}
      <Ball id="d14b" x={300} y={800} r={110} flag="VNM" eyes="shock" hat={<MuCoi camo />} t={t} motion={mixMotion(breathe(t, 40, 0.04), shake(t, 0, 5, 200))} />
      <Txt x={1100} y={400} text="TIẾNG NỔ" size={170} o={ramp(s, 0.05, 0.3)} />
      <Txt x={1100} y={560} text="KHÔNG BAO GIỜ DỨT" size={104} color="#E2B95A" o={ramp(s, 0.5, 0.8)} />
      <Vignette id="d14" o={0.5} />
    </g>
  );
};
