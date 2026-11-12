import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, Glow, Dust, Kitchen, Bedroom, BedDuvet, bedSit,
  LEG_LEN, FONT, backOut, ShotProps,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { Bystander, Note, Pan, DoorPost, ShopGood, GlassStreaks, rndSway } from './che-people-and-shop-props';

// Chapter E, "nobody can do it for you": three quick inserts of hired help (a queue, a cook, a driver), then the
// things only you can do: sleep (E10), be ill (E11), and the little sister growing up (E12); then the shop window
// of everything with one clock marked KHÔNG BÁN (E13). The ping look is OFF here.

const PIP = LOOKS.pipHood;
const SIS = LOOKS.sis;

// ---------- E7: a waiting hall: a hired stand-in at the back of the queue takes the note from Pip's mitten ----------
export const E7: React.FC<ShotProps> = ({ t, len }) => {
  const shuffle = easeOut(clamp((t - 30) / 16)) * 70;
  const take = backOut(clamp((t - 10) / 10));
  const hand = { x: kf(t, [[0, 200], [14, 470], [34, 470], [48, 220]]), y: 760 };
  const folks: { x: number; body: string; hair: string }[] = [
    { x: 1200, body: '#5A6AA0', hair: '#2A1E1C' },
    { x: 1000, body: '#8A5A6A', hair: '#6A4A2A' },
    { x: 800, body: '#4E7E6A', hair: '#1E1A1C' },
  ];
  return (
    <g transform={camT(kf(t, [[0, 860], [len, 820]]), 640, kf(t, [[0, 1.25], [len, 1.4]]))}>
      <rect x={-300} y={-200} width={2520} height={1100} fill="#2F2838" />
      <rect x={-300} y={880} width={2520} height={500} fill="#241C28" />
      <rect x={-300} y={860} width={2520} height={26} fill="#3A3040" />
      {/* the counter window at the right, warm, with a ticket number lit above it */}
      <rect x={1440} y={300} width={400} height={580} fill="#3A2E3A" />
      <rect x={1480} y={420} width={320} height={220} fill="#FFD9A0" />
      <rect x={1480} y={420} width={320} height={220} fill="#FFB46A" opacity={0.35} />
      <rect x={1520} y={340} width={240} height={56} rx={8} fill="#14121C" />
      <text x={1640} y={384} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fill="#FF8A3D">{t > 40 ? '046' : '047'}</text>
      <Glow x={1640} y={520} r={560} o={0.45} />
      {/* rope posts */}
      {[560, 1340].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={886} rx={36} ry={8} fill="#000" opacity={0.4} />
          <rect x={x - 6} y={730} width={12} height={150} fill="#B8A06A" />
          <circle cx={x} cy={726} r={14} fill="#E9C46A" />
        </g>
      ))}
      <path d="M 560 740 Q 950 800 1340 740" stroke="#B93A3A" strokeWidth={9} fill="none" />
      {folks.map((f, i) => (
        <Bystander key={i} x={f.x + shuffle} y={880} s={1.05} body={f.body} hair={f.hair} dir={1} bob={Math.sin(t / 7 + i) * 2} />
      ))}
      {/* the hired stand-in, in an orange vest, takes the note and nods */}
      <Bystander x={580 + shuffle} y={880} s={1.1} body="#E08A3A" hair="#3A2A22" dir={1} arm={-30 * take} bob={Math.sin(t / 5) * 3 + (t > 24 && t < 34 ? 5 : 0)} />
      <Note x={hand.x + 20} y={hand.y - 70} w={170} rot={-14} />
      <InsertArm x={hand.x} y={hand.y} fx={hand.x - 520} fy={hand.y + 460} rot={-20} s={4.6} width={118} />
      <Dust t={t} seed={61} x0={400} y0={200} w={1300} h={600} n={18} o={0.3} />
    </g>
  );
};

// ---------- E8: insert, a hired cook at the hob tosses the pan: flame, steam, a note floating in ----------
export const E8: React.FC<ShotProps> = ({ t, len }) => {
  const toss = kf(t, [[0, 0], [8, -14], [13, 10], [len, 0]]);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 980]]), 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-720 -520) scale(2.1)">
          <Kitchen t={t + 40} id="e8kit" />
        </g>
      </g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#0C0A12" opacity={0.28} />
      <Glow x={1100} y={820} r={520} kind="warm" o={0.5} />
      <Bystander x={620} y={1220} s={2.2} body="#E9E2D2" hat="chef" dir={1} arm={-50} bob={Math.sin(t / 4) * 3} />
      <Pan x={1150} y={760} t={t} flip={toss} />
      <Note x={kf(t, [[0, 260], [len, 380]])} y={kf(t, [[0, 330], [len, 250]])} w={170} rot={-10} />
    </g>
  );
};

// ---------- E9: insert, a driver from behind through the windscreen, hands on the wheel, the road streaming ----------
export const E9: React.FC<ShotProps> = ({ t, len }) => {
  const road = (i: number) => ((t * 0.045 + i / 6) % 1);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <rect x={-300} y={-200} width={2520} height={1500} fill="#14121C" />
      <defs>
        <linearGradient id="e9sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A2E5A" /><stop offset="1" stopColor="#E88A5A" />
        </linearGradient>
        <clipPath id="e9wind"><path d="M 260 130 L 1660 130 L 1760 640 L 160 640 Z" /></clipPath>
      </defs>
      <g clipPath="url(#e9wind)">
        <rect x={100} y={100} width={1720} height={400} fill="url(#e9sky)" />
        <path d="M 100 400 L 340 330 L 520 400 L 760 310 L 980 400 L 1240 320 L 1480 400 L 1820 340 L 1820 440 L 100 440 Z" fill="#241C38" />
        <path d="M 100 640 L 880 400 L 1040 400 L 1820 640 Z" fill="#3A3646" />
        {Array.from({ length: 6 }).map((_, i) => {
          const p = road(i);
          const y = 410 + 230 * p * p;
          const w = 6 + 26 * p * p;
          return <rect key={i} x={960 - w / 2} y={y} width={w} height={8 + 40 * p * p} fill="#F6EFE3" opacity={0.85} />;
        })}
      </g>
      <path d="M 260 130 L 1660 130 L 1760 640 L 160 640 Z" fill="none" stroke="#2A2830" strokeWidth={26} />
      {/* the rear-view mirror, the dashboard and the wheel */}
      <rect x={820} y={150} width={280} height={74} rx={16} fill="#1E1D26" stroke="#5A586A" strokeWidth={5} />
      <rect x={-300} y={760} width={2520} height={400} fill="#1E1B24" />
      <ellipse cx={960} cy={900} rx={330} ry={120} fill="none" stroke="#3A3846" strokeWidth={36} />
      <ellipse cx={960} cy={900} rx={330} ry={120} fill="none" stroke="#5A586A" strokeWidth={6} transform="translate(0 -14)" />
      {/* the driver's seat back, his shoulders and his head with a cap, seen from the back seat */}
      <path d="M 700 1100 Q 690 760 760 700 L 1160 700 Q 1230 760 1220 1100 Z" fill="#3E3A4E" stroke="#14121C" strokeWidth={6} />
      <path d="M 1000 700 L 1160 700 Q 1230 760 1220 1100 L 1060 1100 Q 1100 800 1000 700 Z" fill="#000" opacity={0.2} />
      <rect x={900} y={640} width={120} height={60} fill="#D9A47A" />
      <path d="M 872 570 Q 868 650 900 662 L 1020 662 Q 1052 650 1048 570 Q 960 604 872 570 Z" fill="#2A1E1C" />
      <circle cx={960} cy={580} r={86} fill="#E8B98F" stroke="#14121C" strokeWidth={6} transform={`rotate(${Math.sin(t / 12) * 2} 960 640)`} />
      <path d="M 874 566 Q 880 484 960 482 Q 1040 484 1046 566 Q 960 540 874 566 Z" fill="#3E5C8A" stroke="#14121C" strokeWidth={5} />
      <path d="M 790 880 Q 700 900 690 970 M 1130 880 Q 1220 900 1230 970" stroke="#3E3A4E" strokeWidth={38} fill="none" strokeLinecap="round" />
      <circle cx={805} cy={870} r={26} fill="#E8B98F" stroke="#14121C" strokeWidth={5} />
      <circle cx={1115} cy={870} r={26} fill="#E8B98F" stroke="#14121C" strokeWidth={5} />
      <Glow x={960} y={300} r={700} kind="warm" o={0.22} />
    </g>
  );
};

// ---------- E10: close-up, Pip yawns behind his mitten, eyes squeezed shut: nobody can sleep for him ----------
export const E10: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.4 * (1 + 0.05 * clamp(t / len));
  const head = { x: 900, y: 500 };
  const yawn = easeOut(clamp((t - 4) / 12));
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y + 176 * sc, scale: sc, yaw: 0.1, facing: 1, headTilt: -5 * yawn + 2 * clamp((t - 36) / 10), look: 0,
    armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 }, sway: 2, ...faceAt(t, [[0, 'tired']]), blink: t > 8 && t < 38 ? 1 : 0,
  };
  const m = { x: head.x + 10, y: head.y + 66 - 10 * yawn };
  const rise = easeOut(clamp((t - 2) / 12));
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-360 -240) scale(1.45)">
          <Bedroom t={t + 200} id="e10bed" lamp={0.8} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.3} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      {/* the mitten over the mouth: drawn by hand, after the head */}
      <g filter="url(#rimR)" opacity={rise}>
        <path d={`M 1500 1240 Q 1300 ${900 - 60 * rise} ${m.x + 40} ${m.y + 50}`} stroke={PIP.line} strokeWidth={196} fill="none" strokeLinecap="round" />
        <path d={`M 1500 1240 Q 1300 ${900 - 60 * rise} ${m.x + 40} ${m.y + 50}`} stroke={PIP.limb} strokeWidth={176} fill="none" strokeLinecap="round" />
        <ellipse cx={m.x} cy={m.y} rx={92} ry={76} fill={PIP.hand} stroke={PIP.line} strokeWidth={10} />
        <ellipse cx={m.x - 40} cy={m.y - 10} rx={30} ry={46} fill={PIP.hand} stroke={PIP.line} strokeWidth={8} />
      </g>
      {[0, 1, 2].map((i) => {
        const p = clamp((t - 18 - i * 8) / 30);
        return (
          <text key={i} x={1180 + i * 70 + p * 40} y={330 - i * 70 - p * 80} fontFamily={FONT.title} fontWeight={800} fontSize={70 + i * 24} fill="#BFD0FF" opacity={Math.sin(Math.PI * p)} stroke="#1A1230" strokeWidth={8} paintOrder="stroke">z</text>
        );
      })}
    </g>
  );
};

// ---------- E11: medium, Pip in bed with a cold: tissue at the nose, shivering under the duvet ----------
export const E11: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.2);
  const shiver = Math.sin(t * 1.7) * 1.2;
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: b.x, y: b.y, scale: b.scale, yaw: -0.35, look: 0.2, armL: { a: 8, b: -6 }, armR: { a: 14, b: -6 }, headTilt: 3 } },
    { f: 26, p: { headTilt: -6 }, ease: easeOut },
    { f: 34, p: { headTilt: 4 } },
    { f: 60, p: { headTilt: 1 } },
  ]);
  const hx = b.x - 14;
  const hy = b.y - 176 * b.scale;
  const sneeze = t > 24 && t < 34;
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 690]]), kf(t, [[0, 545], [len, 535]]), kf(t, [[0, 2.4], [len, 2.7]]))}>
      <Bedroom t={t + 120} id="e11bed" duvet={false} lamp={0.7} />
      <g transform={`translate(${shiver} 0)`}>
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired'], [24, 'oops'], [38, 'tired']]) }} rimId="rimR" shadow={0} />
        {/* a tissue and a mitten at the nose, drawn after the head */}
        <g transform={`translate(${hx - 12} ${hy + 30 * b.scale + (sneeze ? 4 : 0)}) rotate(${sneeze ? -8 : 0})`}>
          <path d="M -26 -10 Q -10 -34 18 -14 Q 34 6 20 28 Q -4 38 -24 20 Z" fill="#F6F2EA" stroke="#B8B0A0" strokeWidth={3} />
          <ellipse cx={22} cy={22} rx={20} ry={17} fill={PIP.hand} stroke={PIP.line} strokeWidth={4} />
        </g>
        <ellipse cx={hx - 4} cy={hy + 8 * b.scale} rx={34} ry={18} fill="#E8605A" opacity={0.28} />
      </g>
      <BedDuvet knees={1} />
      {/* crumpled tissues on the duvet */}
      {[[0, 0], [1, 0.4]].map(([i, d]) => (
        <circle key={i} cx={b.x + 120 + i * 46} cy={b.y + 78 + d * 14} r={15} fill="#F6F2EA" stroke="#B8B0A0" strokeWidth={2.5} />
      ))}
      {sneeze
        ? [0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={hx - 50 - (t - 24) * (5 + i * 2)} cy={hy + 30 + i * 8 + (t - 24) * 1.5} r={3 + (i % 2)} fill="#CFE6FF" opacity={0.7} />
          ))
        : null}
    </g>
  );
};

// ---------- E12: the door frame: the little sister against it, a book on her head, her height marks and dates in pen ----------
export const E12: React.FC<ShotProps> = ({ t, len }) => {
  const floor = 900;
  const ss = 1.15;
  const H = (LEG_LEN + 238) * ss;
  const sisX = 1010;
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: sisX, y: floor - LEG_LEN * ss, scale: ss, yaw: 0.55, facing: 1, headTilt: 0, look: 0.4, armL: { a: 8, b: -6 }, armR: { a: 40, b: -20 } } },
    { f: 14, p: { headTilt: 2, armR: { a: 150, b: -10 } }, ease: easeOut },
    { f: len, p: { headTilt: 3 } },
  ]);
  const marks = [
    { y: 0.6 * H, label: '2022', on: 1 },
    { y: 0.7 * H, label: '2023', on: 1 },
    { y: 0.8 * H, label: '2024', on: 1 },
    { y: 0.9 * H, label: '2025', on: 1 },
    { y: H + 8, label: 'NAY', on: clamp((t - 34) / 10) },
  ];
  const post = 1190;
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1110]]), kf(t, [[0, 640], [len, 560]]), kf(t, [[0, 1.35], [len, 1.7]]))}>
      <rect x={-300} y={-200} width={2520} height={1100} fill="#4A3A42" />
      <rect x={-300} y={floor} width={2520} height={500} fill="#2E2228" />
      <rect x={-300} y={floor - 28} width={2520} height={28} fill="#3A2C34" />
      <Glow x={sisX} y={420} r={800} kind="warm" o={0.4} />
      <DoorPost x={post} floor={floor} top={60} marks={marks} />
      <ellipse cx={sisX} cy={floor + 6} rx={90} ry={14} fill="#000" opacity={0.4} />
      <Hero look={SIS} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [16, 'happy']]) }} rimId="rimR" shadow={0} />
      {/* the book flat on her head, touching the frame */}
      <rect x={sisX - 60} y={floor - H - 6} width={post - sisX + 40} height={14} rx={3} fill="#C9744A" stroke="#14121C" strokeWidth={3} />
      <Dust t={t} seed={77} x0={500} y0={200} w={1100} h={600} n={20} o={0.35} />
    </g>
  );
};

// ---------- E13: the shop window: everything with a price tag, and in the middle a clock tagged KHÔNG BÁN ----------
export const E13: React.FC<ShotProps> = ({ t, len }) => {
  const goods: React.ComponentProps<typeof ShopGood>['g'][] = [
    { x: 420, y: 640, kind: 'phone', price: '9.990.000' },
    { x: 360, y: 420, kind: 'gift', price: '350.000' },
    { x: 600, y: 420, kind: 'bag', price: '3.400.000' },
    { x: 1300, y: 420, kind: 'shoe', price: '1.290.000' },
    { x: 1560, y: 420, kind: 'phone', price: '9.990.000' },
    { x: 620, y: 640, kind: 'shoe', price: '1.290.000' },
    { x: 1300, y: 640, kind: 'tv', price: '12.500.000' },
    { x: 1520, y: 640, kind: 'laptop', price: '24.900.000' },
    { x: 380, y: 860, kind: 'bag', price: '3.400.000' },
    { x: 600, y: 860, kind: 'gift', price: '350.000' },
    { x: 820, y: 860, kind: 'bike', price: '6.800.000' },
    { x: 1180, y: 860, kind: 'gift', price: '350.000' },
    { x: 1420, y: 860, kind: 'bag', price: '3.400.000' },
    { x: 1640, y: 860, kind: 'phone', price: '9.990.000' },
  ];
  const focus = easeOut(clamp((t - 36) / 30));
  const tagP = backOut(clamp((t - 44) / 10));
  const hand = (t * 1.2) % 360;
  return (
    <g transform={camT(960, kf(t, [[0, 540], [len, 480]]), kf(t, [[0, 1.0], [len, 1.5]]))}>
      <rect x={-300} y={-200} width={2520} height={1500} fill="#0E0B14" />
      <rect x={200} y={110} width={1520} height={860} fill="#2A2230" />
      <rect x={200} y={110} width={1520} height={860} fill="#FFB46A" opacity={0.1} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={260 + i * 400} y={110} width={20} height={860} fill="#FFD9A0" opacity={0.06} />)}
      {[424, 644, 864].map((y) => <rect key={y} x={200} y={y} width={1520} height={12} fill="#7A5747" />)}
      {goods.map((g, i) => <ShopGood key={i} g={g} sway={rndSway(t, i)} />)}
      {/* the clock on its pedestal, in the middle, lit */}
      <rect x={900} y={604} width={120} height={40} fill="#6B4B42" />
      <rect x={940} y={644} width={40} height={216} fill="#6B4B42" />
      <ellipse cx={960} cy={866} rx={80} ry={10} fill="#000" opacity={0.35} />
      <Glow x={960} y={460} r={380} kind="warm" o={0.35 + 0.35 * focus} />
      <circle cx={960} cy={470} r={134} fill="#F4EEE2" stroke="#14121C" strokeWidth={8} />
      <circle cx={960} cy={470} r={134} fill="none" stroke="#E9C46A" strokeWidth={6} opacity={0.7} />
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d="M 0 -118 L 0 -102" transform={`translate(960 470) rotate(${i * 30})`} stroke="#14121C" strokeWidth={i % 3 ? 4 : 8} />)}
      <path d="M 0 8 L 0 -92" transform={`translate(960 470) rotate(${hand})`} stroke="#14121C" strokeWidth={7} strokeLinecap="round" />
      <path d="M 0 8 L 0 -62" transform={`translate(960 470) rotate(${hand / 12})`} stroke="#14121C" strokeWidth={10} strokeLinecap="round" />
      <circle cx={960} cy={470} r={9} fill="#D9482E" />
      {/* the tag */}
      <g transform={`translate(1090 560) scale(${tagP}) rotate(${10 + Math.sin(t / 6) * 3 * (1 - focus * 0.4)})`}>
        <path d="M -10 -80 L 0 -30" stroke="#CFC8B8" strokeWidth={3} />
        <rect x={-100} y={-30} width={200} height={70} rx={8} fill="#C93A3A" stroke="#14121C" strokeWidth={4} />
        <text x={0} y={16} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill="#FFF4E8">KHÔNG BÁN</text>
      </g>
      <GlassStreaks x={200} y={110} w={1520} h={860} t={t} />
      <rect x={200} y={110} width={1520} height={860} fill="none" stroke="#3A3040" strokeWidth={22} />
    </g>
  );
};
