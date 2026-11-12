import React from 'react';
import { clamp, easeOut, backOut, rnd, FONT, Look, LOOKS, Pose, HEAD } from '../../engine';
import { BrainIcon, Smiley } from './chb-notes-and-icons';

// Chapter B props (3/4): the science beats. The scary presentation file, the running brain, a phone with a smiley, the
// generic fMRI-style scan, the stranger silhouette and the elder Pip, the box of tasks, the lecture hall.

// ---------- characters: the stranger (a flat blue-grey silhouette, no face) and Pip as an older man ----------
export const STRANGER: Look = { ...LOOKS.pipHood, skin: '#7C89A6', skinShade: '#66728E', hand: '#7C89A6', jacket: '#6A7794', jacketShade: '#58637E', accent: '#7C89A6', limb: '#6A7794', shoe: '#58637E', face: '#7C89A6', hair: '#7C89A6', extra: undefined };
export const ELDER: Look = { ...LOOKS.pipHood, jacket: '#6A5A7A', jacketShade: '#54476A', accent: '#C9B8D8', limb: '#4A4258', extra: undefined };

/** Grey hair tufts, forehead lines and eye bags on top of an ELDER Hero (draw after it). `yaw`/`scale` from its pose. */
export const ElderMarks: React.FC<{ pose: Pose }> = ({ pose }) => {
  const k = pose.scale;
  const cx = pose.x + pose.yaw * 14 * k;
  const cy = pose.y + HEAD.y * k;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${pose.headTilt}) scale(${k})`} stroke="#E3E0EA" strokeLinecap="round" fill="none">
      <path d="M -60 -6 Q -76 -22 -62 -40 M -58 -28 Q -78 -40 -66 -58 M 60 -6 Q 76 -22 62 -40 M 58 -28 Q 78 -40 66 -58" strokeWidth={6} />
      <path d="M -26 -56 Q 0 -66 26 -56 M -18 -64 Q 0 -72 18 -64" strokeWidth={5} opacity={0.85} />
      <path d="M -28 -40 Q 0 -46 28 -40" stroke="#8A7A8A" strokeWidth={3} opacity={0.7} />
    </g>
  );
};

/** A big "?" that floats over a head. */
export const QMark: React.FC<{ x: number; y: number; t: number; s?: number; color?: string }> = ({ x, y, t, s = 1, color = '#FFE27A' }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 8));
  return (
    <text x={x} y={y + Math.sin(t / 6) * 6} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={150 * s * k} fill={color} stroke="#1A1230" strokeWidth={8 * s} paintOrder="stroke">?</text>
  );
};

// ---------- the presentation file with a scary face ----------
/** "HỆ MẶT TRỜI.pptx" as a slide icon on a base card. `scary` 0..1 grows an angry face, the file swells and shakes. */
export const ProgramFile: React.FC<{ x: number; y: number; s?: number; scary?: number; t?: number; label?: boolean }> = ({ x, y, s = 1, scary = 0, t = 0, label = true }) => {
  const grow = 1 + 0.45 * scary;
  const shake = scary > 0.5 ? Math.sin(t * 2.3) * 4 * scary : 0;
  return (
    <g transform={`translate(${x + shake} ${y}) scale(${s * grow})`}>
      {scary > 0 ? <ellipse cy={10} rx={230 * scary + 120} ry={170 * scary + 90} fill="#5A1620" opacity={0.5 * scary} style={{ filter: 'blur(26px)' }} /> : null}
      <rect x={-142} y={-96} width={300} height={220} rx={16} fill="#000" opacity={0.3} />
      <rect x={-150} y={-110} width={300} height={220} rx={16} fill="#F4F1FA" stroke="#121019" strokeWidth={6} />
      <rect x={-150} y={-110} width={300} height={44} rx={16} fill="#E8742E" />
      <rect x={-150} y={-84} width={300} height={18} fill="#E8742E" />
      <circle cx={-118} cy={-88} r={9} fill="#FFE9D2" />
      {scary < 0.35 ? (
        <g>
          <circle cx={-36} cy={10} r={36} fill="#F6B93B" stroke="#121019" strokeWidth={5} />
          <ellipse cx={-36} cy={10} rx={64} ry={14} fill="none" stroke="#8A84A6" strokeWidth={4} transform="rotate(-20 -36 10)" />
          <circle cx={74} cy={-20} r={12} fill="#5A9BD8" />
          <circle cx={92} cy={40} r={8} fill="#D94452" />
          <rect x={-120} y={72} width={150} height={10} fill="#C4BEDA" />
        </g>
      ) : (
        <g opacity={clamp((scary - 0.25) * 3)}>
          {/* angry eyes, brows and a jagged mouth */}
          <ellipse cx={-52} cy={-14} rx={28} ry={32} fill="#FFFFFF" stroke="#121019" strokeWidth={5} />
          <ellipse cx={52} cy={-14} rx={28} ry={32} fill="#FFFFFF" stroke="#121019" strokeWidth={5} />
          <circle cx={-46} cy={-8} r={13} fill="#C8202F" />
          <circle cx={46} cy={-8} r={13} fill="#C8202F" />
          <path d="M -88 -58 L -26 -34 M 88 -58 L 26 -34" stroke="#121019" strokeWidth={13} strokeLinecap="round" />
          <path d="M -86 50 L -62 22 L -40 52 L -18 22 L 4 52 L 26 22 L 48 52 L 70 22 L 90 50 Q 0 96 -86 50 Z" fill="#2A0A10" stroke="#121019" strokeWidth={5} strokeLinejoin="round" />
        </g>
      )}
      {label && scary < 0.3 ? <text y={176} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill="#F6EFE3" letterSpacing={1}>HỆ MẶT TRỜI.pptx</text> : null}
    </g>
  );
};

// ---------- the brain that runs away ----------
/** The brain as a character: scared eyes, arms and legs pumping. `phase` advances the run, facing 1 = right. */
export const BrainChar: React.FC<{ x: number; y: number; s?: number; phase: number; facing?: 1 | -1; scared?: number }> = ({ x, y, s = 1, phase, facing = 1, scared = 1 }) => {
  const sw = Math.sin(phase);
  const leg = (a: number) => <path d={`M 0 60 L ${Math.sin(a) * 52} ${60 + Math.cos(a) * 52} L ${Math.sin(a) * 52 + 26} ${60 + Math.cos(a) * 52}`} stroke="#121019" strokeWidth={13} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
  const arm = (a: number) => <path d={`M ${facing * 70} 10 L ${facing * 70 + Math.sin(a) * 50} ${10 + Math.cos(a) * 36}`} stroke="#121019" strokeWidth={11} fill="none" strokeLinecap="round" />;
  return (
    <g transform={`translate(${x} ${y + Math.abs(Math.cos(phase)) * -10}) scale(${s * facing} ${s})`}>
      <ellipse cy={176 + Math.abs(Math.cos(phase)) * 10} rx={90} ry={12} fill="#000" opacity={0.25} />
      <g transform="translate(-16 0)">{leg(sw)}{leg(-sw)}</g>
      {arm(-sw * 1.2)}
      <g transform={`rotate(${sw * 5} 0 40)`}>
        <BrainIcon x={0} y={0} s={1.05} />
        {/* wide scared eyes, looking back */}
        <ellipse cx={-34} cy={4} rx={19} ry={22 + 4 * scared} fill="#FFFFFF" stroke="#121019" strokeWidth={5} />
        <ellipse cx={30} cy={4} rx={19} ry={22 + 4 * scared} fill="#FFFFFF" stroke="#121019" strokeWidth={5} />
        <circle cx={-40} cy={6} r={8} fill="#121019" />
        <circle cx={24} cy={6} r={8} fill="#121019" />
        <ellipse cx={-4} cy={44} rx={13} ry={9 + 6 * scared} fill="#7A2238" stroke="#121019" strokeWidth={4} />
      </g>
    </g>
  );
};

/** A phone seen face-on and slightly tilted, its screen a warm smiley. Used as the thing the brain runs towards. */
export const SmileyPhone: React.FC<{ x: number; y: number; s?: number; t: number; rot?: number }> = ({ x, y, s = 1, t, rot = 6 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={236} rx={150} ry={16} fill="#000" opacity={0.3} />
    <circle cy={20} r={250} fill="url(#chbPhoneGlow)" opacity={0.55} style={{ mixBlendMode: 'screen' }} />
    <defs>
      <radialGradient id="chbPhoneGlow"><stop offset="0" stopColor="#FFD97A" stopOpacity={0.9} /><stop offset="1" stopColor="#FFD97A" stopOpacity={0} /></radialGradient>
    </defs>
    <rect x={-100} y={-190} width={200} height={410} rx={34} fill="#1A1824" stroke="#3A3C4C" strokeWidth={6} />
    <rect x={-84} y={-168} width={168} height={366} rx={22} fill="#FFEFC2" />
    <Smiley x={0} y={4} r={62} t={t} />
    {[0, 1, 2].map((i) => <path key={i} transform={`translate(${-50 + i * 50} -112) scale(${0.7 + 0.3 * Math.sin(t / 4 + i)})`} d="M 0 -14 C -20 -34 -34 -4 0 16 C 34 -4 20 -34 0 -14 Z" fill="#FF6A7E" />)}
  </g>
);

// ---------- the fMRI-style scan ----------
export type ScanBlob = { cx: number; cy: number; r: number; at: number; hot?: boolean };
/** A generic axial brain-scan monitor (not a real dataset): skull ring, brain with folds, glowing regions that fade in at
 *  each blob's `at`, a scan bar sweeping top to bottom. Centre (x, y); `s` scales (panel 640 x 520 at s = 1). */
export const BrainScan: React.FC<{ id: string; x: number; y: number; s?: number; t: number; blobs: ScanBlob[]; sweep?: boolean; dim?: number }> = ({ id, x, y, s = 1, t, blobs, sweep = true, dim = 1 }) => {
  const bar = ((t * 7) % 440) - 220;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <radialGradient id={`${id}hot`}><stop offset="0" stopColor="#FFF27A" stopOpacity={1} /><stop offset="0.5" stopColor="#FF8A3D" stopOpacity={0.85} /><stop offset="1" stopColor="#E0302F" stopOpacity={0} /></radialGradient>
        <radialGradient id={`${id}cool`}><stop offset="0" stopColor="#9FE8FF" stopOpacity={0.95} /><stop offset="0.55" stopColor="#4A9BE8" stopOpacity={0.7} /><stop offset="1" stopColor="#3A5BD8" stopOpacity={0} /></radialGradient>
        <clipPath id={`${id}clip`}><ellipse rx={196} ry={236} /></clipPath>
      </defs>
      <rect x={-320} y={-260} width={640} height={520} rx={26} fill="#070B16" stroke="#3A4A68" strokeWidth={6} />
      {[-1, 1].map((d) => <path key={d} d={`M ${d * 300} -240 l ${-d * 30} 0 M ${d * 300} -240 l 0 30`} stroke="#5A6A88" strokeWidth={4} />)}
      <ellipse rx={232} ry={256} fill="#10192E" stroke="#8A9AB8" strokeWidth={9} />
      <ellipse rx={196} ry={236} fill="#2A3556" />
      <g clipPath={`url(#${id}clip)`}>
        <path d="M 0 -236 L 0 236" stroke="#161E38" strokeWidth={7} />
        <path d="M -150 -120 Q -100 -150 -70 -100 Q -40 -60 -90 -30 Q -140 0 -110 60 Q -80 110 -130 150 M 150 -120 Q 100 -150 70 -100 Q 40 -60 90 -30 Q 140 0 110 60 Q 80 110 130 150 M -60 -190 Q -30 -160 -50 -130 M 60 -190 Q 30 -160 50 -130 M -50 150 Q -20 190 -60 210 M 50 150 Q 20 190 60 210" stroke="#3A4870" strokeWidth={9} fill="none" strokeLinecap="round" />
        {blobs.map((b, i) => {
          const k = easeOut(clamp((t - b.at) / 10));
          const pulse = 1 + 0.07 * Math.sin(t / 4 + i * 2);
          return <circle key={i} cx={b.cx} cy={b.cy} r={b.r * pulse * (0.4 + 0.6 * k)} fill={`url(#${id}${b.hot === false ? 'cool' : 'hot'})`} opacity={k * dim} />;
        })}
      </g>
      {sweep ? <rect x={-232} y={bar - 6} width={464} height={12} fill="#7CF0FF" opacity={0.35} /> : null}
    </g>
  );
};

// ---------- the box of tasks ----------
/** A cardboard box brimming with papers, a heavy-looking drop shadow, the MAI LÀM note on its side. Origin at its bottom centre. */
export const TaskBox: React.FC<{ x: number; y: number; s?: number; sag?: number }> = ({ x, y, s = 1, sag = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cy={6} rx={200} ry={16} fill="#000" opacity={0.4} />
    {[-90, -30, 30, 85].map((px, i) => <rect key={i} x={px - 40} y={-212 - (i % 2) * 22} width={80} height={110} fill="#F6F1E3" stroke="#B8B0A0" strokeWidth={3} transform={`rotate(${(i - 1.5) * 7} ${px} -110)`} />)}
    <path d="M -170 -140 L 170 -140 L 156 0 L -156 0 Z" fill="#B98A55" stroke="#5A3D1E" strokeWidth={6} strokeLinejoin="round" />
    <path d="M -170 -140 L 170 -140 L 166 -116 L -166 -116 Z" fill="#CFA06A" />
    <rect x={-44} y={-100 + sag} width={88} height={22} rx={11} fill="#5A3D1E" />
    <rect x={-140} y={-30} width={280} height={8} fill="#5A3D1E" opacity={0.25} />
    <g transform="translate(96 -54) rotate(6)"><rect x={-34} y={-30} width={68} height={62} fill="#F7D94C" /><text y={8} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={18} fill="#5A3A12">MAI LÀM</text></g>
  </g>
);

// ---------- the lecture hall ----------
const ROWS = 5;
const COLS = 11;
const rank = (i: number) => rnd(3, i); // each seat's random draw: the lowest ~14% stay unlit
/** Tiers of students seen from the front, back rows smaller and higher. A seat lights up (orange, a glow) from `startAt`, the
 *  order shuffled by a seed; about 86% end lit. `lit` 0..1 limits how far the lighting has got. */
export const LectureHall: React.FC<{ t: number; startAt?: number; spread?: number }> = ({ t, startAt = 2, spread = 40 }) => (
  <g>
    <rect x={-400} y={-400} width={2720} height={1880} fill="#0E1426" />
    <rect x={560} y={70} width={800} height={150} rx={10} fill="#1C2742" stroke="#3A4A68" strokeWidth={5} />
    <rect x={590} y={92} width={740} height={106} fill="#26365A" />
    {Array.from({ length: ROWS }).map((_, r) => {
      const sc = 0.58 + 0.17 * r;
      const y = 290 + r * 150;
      return (
        <g key={r}>
          <rect x={80 - r * 8} y={y + 52 * sc} width={1760 + r * 16} height={22 * sc + 8} fill="#1D2744" />
          {Array.from({ length: COLS }).map((__, c) => {
            const i = r * COLS + c;
            const x = 960 + (c - (COLS - 1) / 2) * 150 * sc * 1.28;
            const on = rank(i) > 0.14;
            const at = startAt + (rank(i) * spread) | 0;
            const k = on ? easeOut(clamp((t - at) / 6)) : 0;
            const body = k > 0 ? '#F5A33E' : '#38486E';
            return (
              <g key={c} transform={`translate(${x} ${y}) scale(${sc})`}>
                {k > 0 ? <circle cy={-6} r={84} fill="#FF9A3D" opacity={0.16 * k} /> : null}
                <circle cx={0} cy={-34} r={26} fill={body} stroke="#0B1020" strokeWidth={5} />
                <path d="M -42 60 Q -44 4 0 4 Q 44 4 42 60 Z" fill={k > 0 ? '#E8872E' : '#2C3A5C'} stroke="#0B1020" strokeWidth={5} strokeLinejoin="round" />
              </g>
            );
          })}
        </g>
      );
    })}
  </g>
);
