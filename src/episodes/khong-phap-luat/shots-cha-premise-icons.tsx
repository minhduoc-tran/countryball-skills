import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, Street, streetStand, TitleCard, Foreground, Glow, Dust, ShotProps,
} from '../../engine';
import { IconBackdrop, PoliceBooth, Courthouse, GavelBlock, ContractSheet, RoadSign, PopRing, SignKind } from './cha-law-icons-props';

// Chapter A premise: the title over the street (A10), then the four "no ..." pictures, one per phrase: no police (an
// empty booth, A11), no courts (shut doors, no gavel, A12), no contracts (the text fades, A13), no prohibitions (the
// forbidden signs pop away, A14).

// ---------- A10: wide, the street at dusk, Pip and Mo small in the road; the title pops over it ----------
export const A10: React.FC<ShotProps> = ({ t, len }) => {
  const pip = streetStand(0.35, 8.5);
  const mo = streetStand(-0.55, 9.2);
  const pp = poseAt(t, [
    { f: 0, p: { ...pip, yaw: 0.3, look: 0.4, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 } } },
    { f: 40, p: { yaw: -0.3, look: -0.7, headTilt: 3 }, ease: easeOut },
    { f: 70, p: { yaw: 0.2, look: 0.6, headTilt: -3 } },
  ]);
  const pm = poseAt(t, [
    { f: 0, p: { ...mo, yaw: 0.5, look: 0.5, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 } } },
    { f: 50, p: { yaw: 0.1, look: -0.4, headTilt: -3 }, ease: easeOut },
    { f: 80, p: { yaw: 0.5, look: 0.6, armR: { a: 30, b: 50 } } },
  ]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Street t={t + 10} id="sa10" />
      <Hero look={LOOKS.mo} pose={{ ...pm, ...faceAt(t, [[0, 'neutral'], [50, 'worried']]) }} rimId="rimL" shadow={0} />
      <Hero look={LOOKS.pipHood} pose={{ ...pp, ...faceAt(t, [[0, 'neutral'], [44, 'worried']]) }} rimId="rimR" shadow={0} />
      <TitleCard t={t} lines={['SẼ RA SAO NẾU XÃ HỘI', 'KHÔNG CÓ PHÁP LUẬT?']} accent="PHÁP" accentT={54} size={112} y={165} />
    </g>
  );
};

// ---------- A11: an empty police booth: the chair pushed back, the cap on the desk, a dry leaf blowing by ----------
export const A11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <IconBackdrop t={t} id="sa11" />
    <PoliceBooth x={960} y={930} s={1.35} t={t} />
    <Dust t={t} seed={5} x0={400} y0={300} w={1100} h={600} n={26} o={0.45} />
  </g>
);

// ---------- A12: the courthouse with its doors shut; in front, a bare gavel block ----------
export const A12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <IconBackdrop t={t} id="sa12" />
    <Courthouse x={960} y={850} s={1.05} />
    <Foreground blur={3}>
      <GavelBlock x={330} y={1010} s={1.5} t={t} />
    </Foreground>
    <Dust t={t} seed={8} x0={300} y0={400} w={1300} h={500} n={22} o={0.4} />
  </g>
);

// ---------- A13: a contract: its lines blank out one by one, then the signature and the stamp ----------
export const A13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <IconBackdrop t={t} id="sa13" />
    <ContractSheet x={960} y={540} s={1.05} fade={clamp((t - 4) / (len - 8))} rot={kf(t, [[0, -2], [len, 1.5]])} />
    <Glow x={960} y={540} r={500} kind="warm" o={0.2} />
  </g>
);

// ---------- A14: five forbidden signs; each pops away in turn until the board is empty ----------
const KINDS: SignKind[] = ['noPark', 'speed', 'noEntry', 'noLeft', 'noHorn'];
export const A14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <IconBackdrop t={t} id="sa14" />
    {KINDS.map((k, i) => {
      const x = 300 + i * 330;
      const y = 540 + (i % 2 ? 90 : -60);
      const pop = t - (5 + i * 5);
      const sc = pop < 0 ? 1 + 0.03 * Math.sin(t / 4 + i) : Math.max(0, 1 - easeOut(clamp(pop / 6)));
      return (
        <g key={k}>
          {sc > 0.01 ? <RoadSign kind={k} x={x} y={y} r={118} s={sc} rot={pop > 0 ? pop * 8 : 0} /> : null}
          <PopRing x={x} y={y} k={pop} />
        </g>
      );
    })}
  </g>
);
