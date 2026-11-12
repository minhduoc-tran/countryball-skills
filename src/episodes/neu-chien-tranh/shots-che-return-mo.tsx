import React from 'react';
import {
  Hero, Pose, basePose, faceAt, joints, toWorld, kf, clamp, easeOut, camT, LOOKS, Glow, Sparkle, Bicycle, bikePose, ShotProps,
} from '../../engine';
import { DawnAlley, DawnMotes, CART } from '../tien-vo-han/che-dawn-alley-backdrop';
import { XoiCart } from '../tien-vo-han/che-xoi-cart-and-money-props';
import { Shopper } from '../tien-vo-han/che-world-icons-and-people';
import { Birds } from './che-props-field-and-deminers';
import { PlasticStool, LowTable, IcedCoffee } from './che-props-cafe-coffee-and-backpack';

// Chapter E, "return" part 2 (259.8-266.8 s, look "peace"): E17 Mo cycles into the alley, worn but here, E18 his smile,
// E19 Pip and Mo on plastic stools with iced milk coffee again (the cold open, mirrored), a clink, E20 "a normal day": the
// whole corner at once, the camera drifting back.

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const MOM = LOOKS.mom;
const { x: CX, y: CY, s: CS } = CART;

// ---------- E17: wide, tracking: Mo rides in along the sidewalk, thinner and tired, but pedalling hard ----------
export const E17: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, CX - 520], [len, CX + 520]], (v) => v);
  const pose: Pose = bikePose(t * 2.1, x, CY, CS, { facing: 1, hands: 'bars' });
  return (
    <g transform={camT(kf(t, [[0, CX - 200], [len, CX + 420]], (v) => v), CY - 120 * CS, 2.5)}>
      <DawnAlley t={t + 400} id="e17st" />
      <Bicycle x={x} y={CY} s={CS} t={t * 2.1} facing={1} color="#3E8C86" />
      <Hero look={MO} pose={{ ...pose, ...faceAt(t, [[0, 'tired'], [38, 'happy']]) }} rimId="rimR" shadow={0} />
      <DawnMotes t={t} seed={17} />
    </g>
  );
};

// ---------- E18: close-up: Mo's tired eyes and his smile arriving, the alley soft behind ----------
export const E18: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.4;
  const pose: Pose = {
    ...basePose, x: 1050, y: 480 + 176 * sc, scale: sc, yaw: -0.5, facing: -1, tilt: 2, headTilt: kf(t, [[0, -4], [len, 3]]), look: -0.6,
    armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 }, sway: 3,
  };
  return (
    <g>
      <g filter="url(#blur16)"><g transform="translate(-300 -260) scale(1.6)"><DawnAlley t={t + 460} id="e18st" /></g></g>
      <Glow x={700} y={520} r={760} o={0.4} />
      <g transform={`translate(0 ${kf(t, [[0, 6], [len, -14]])})`}>
        <Hero look={MO} pose={{ ...pose, ...faceAt(t, [[0, 'tired'], [8, 'happy']]) }} rimId="rimL" shadow={0} />
      </g>
      <Sparkle x={1380} y={380} t={t - 12} s={1.2} />
    </g>
  );
};

/** The corner: mum's cart, a customer, and Pip and Mo facing each other over iced coffee. `clink` 0..1 raises both glasses. */
const Corner: React.FC<{ t: number; id: string; clink: number; laugh?: boolean }> = ({ t, id, clink, laugh = false }) => {
  const xa = CX + 560 * CS; // Pip's stool (faces right)
  const xb = xa + 330 * CS; // Mo's stool (faces left)
  const hipY = CY - 70 * CS;
  const seat = (x: number, facing: 1 | -1, near: 'armL' | 'armR', up: number): Pose => ({
    ...basePose, x, y: hipY, scale: CS, yaw: 0.85 * facing, facing, tilt: 4 * facing, headTilt: (laugh ? 4 * Math.sin(t / 5) : 2 * Math.sin(t / 30)) * facing,
    legL: { a: 84, b: -84 }, legR: { a: 74, b: -80 }, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 },
    [near]: { a: 20 + 62 * up, b: 70 - 20 * up },
  });
  const pip = seat(xa, 1, 'armR', clink);
  const mo = seat(xb, -1, 'armL', clink);
  const hp = toWorld(pip, joints(pip).armR.end);
  const hm = toWorld(mo, joints(mo).armL.end);
  const topY = CY - 64 * CS * 1.15;
  const mom: Pose = { ...basePose, x: CX + 60 * CS, y: CY - 140 * CS, scale: CS, yaw: 0.45, facing: 1, headTilt: 3, armL: { a: 14, b: -6 }, armR: { a: 40 + 12 * Math.sin(t / 6), b: 36 } };
  return (
    <g>
      <DawnAlley t={t + 500} id={id} />
      <Hero look={MOM} pose={{ ...mom, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <XoiCart x={CX} y={CY} s={CS} t={t} />
      <Shopper x={CX + 300 * CS} y={CY + 24} s={CS * 1.35} color="#4A6A8A" bob={Math.sin(t / 12)} />
      <PlasticStool x={xa} y={CY} s={CS * 1.05} />
      <PlasticStool x={xb} y={CY} s={CS * 1.05} col="#3A7AC8" />
      <LowTable x={(xa + xb) / 2} y={CY} s={CS * 1.15} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
      {clink > 0.5 ? null : <IcedCoffee x={(xa + xb) / 2 - 18 * CS} y={topY} s={CS * 1.25} t={t} />}
      {clink > 0.5 ? null : <IcedCoffee x={(xa + xb) / 2 + 18 * CS} y={topY} s={CS * 1.25} t={t + 9} />}
      {clink > 0.5 ? (
        <g>
          <IcedCoffee x={hp.x + 8 * CS} y={hp.y + 40 * CS} s={CS * 1.25} t={t} />
          <IcedCoffee x={hm.x - 8 * CS} y={hm.y + 40 * CS} s={CS * 1.25} t={t + 9} />
        </g>
      ) : null}
      <DawnMotes t={t} seed={19} />
    </g>
  );
};

// ---------- E19: medium: Pip and Mo on the stools, a clink of iced coffee, both laughing ----------
export const E19: React.FC<ShotProps> = ({ t, len }) => {
  const cl = easeOut(clamp((t - 24) / 10)) * (1 - easeOut(clamp((t - 48) / 10)) * 0.3);
  const xm = CX + 725 * CS;
  return (
    <g transform={camT(kf(t, [[0, xm], [len, xm + 20 * CS]]), CY - 175 * CS, kf(t, [[0, 3.9], [len, 4.4]]))}>
      <Corner t={t} id="e19st" clink={cl} laugh={t > 30} />
      <Glow x={xm} y={CY - 260 * CS} r={360} o={0.3} />
      <Sparkle x={xm} y={CY - 300 * CS} t={t - 30} s={0.3} />
    </g>
  );
};

// ---------- E20: wide: "a normal day": the whole corner, the camera drifting back from the stools to the cart and the alley ----------
export const E20: React.FC<ShotProps> = ({ t, len }) => {
  const xm = CX + 725 * CS;
  return (
    <g transform={camT(kf(t, [[0, xm], [len, CX + 240 * CS]]), kf(t, [[0, CY - 170 * CS], [len, CY - 230 * CS]]), kf(t, [[0, 3.4], [len, 2.3]]))}>
      <Corner t={t + 60} id="e20st" clink={0} laugh />
      <Birds t={t} seed={20} x0={CX - 400} y0={CY - 900 * CS} w={1200} h={120} n={3} col="#4A2E3A" />
    </g>
  );
};
