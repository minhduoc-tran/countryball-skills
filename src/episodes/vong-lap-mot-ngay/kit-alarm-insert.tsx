import React from 'react';
import { camT, lerp, easeOut, clamp, Glow, LOOKS } from '../../engine';
import { MorningBedroom, MB } from './kit-morning-bedroom';
import { BedsideClock } from './kit-bedroom-parts';
import { PAL, mix } from './kit-palette';

// The alarm clock in close-up (a full-frame insert: draw it as the whole shot, NOT inside a camera group).
//   <AlarmInsert id t clock="06:00" ring={0..1} hand={0..1} dawn={1} />
//   The bedroom behind, blurred (same room, same window glow); the nightstand top fills the bottom; the clock big at
//   centre (base at (960, 900), 2.9x: display ~ 600 x 230, centre (960, 727), snooze bar top y ~ 505).
//   hand 0 = off frame, 1 = Pip's mitten slapping the snooze bar (the arm comes from screen-left: the bed's side).
//   Pressing: when hand > 0.9 the bar dips 10 px. AI.SNOOZE is the bar's centre.
export const AI = { CLOCK: { x: 960, y: 900, s: 2.9 }, SNOOZE: { x: 960, y: 512 } };

export const AlarmInsert: React.FC<{ id?: string; t: number; clock?: string; ring?: number; hand?: number; dawn?: number }> = ({ id = 'ai', t, clock = '06:00', ring = 0, hand = 0, dawn = 1 }) => {
  const h = easeOut(clamp(hand));
  const press = hand > 0.9 ? 10 : 0;
  const mx = lerp(-200, AI.SNOOZE.x - 60, h);
  const my = lerp(470, AI.SNOOZE.y - 40 + press, h);
  return (
    <g>
      {/* the room behind, out of focus, framed on the nightstand */}
      <g filter="url(#blur16)">
        <g transform={camT(MB.CLOCK.x + 30, MB.CLOCK.y - 70, 3.1)}>
          <MorningBedroom id={`${id}bg`} t={t} dawn={dawn} clock={clock} day="THỨ TƯ" veil={0.3} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#000" opacity={0.18} />
      {/* the nightstand top: wood seen from a little above, the front lip lit */}
      <path d="M -40 760 L 1960 760 L 1960 1120 L -40 1120 Z" fill="#6E5650" />
      {Array.from({ length: 9 }).map((_, k) => <path key={k} d={`M ${-60 + k * 260} 760 L ${-260 + k * 300} 1100`} stroke="#5A4440" strokeWidth={k % 3 ? 3 : 6} opacity={0.6} />)}
      <path d="M -40 760 L 1960 760" stroke={mix('#9FC0FF', PAL.dawnGold, dawn)} strokeWidth={4} opacity={0.55} />
      <rect x={-40} y={760} width={2000} height={60} fill="url(#g3aoDown)" opacity={0.6} />
      {/* a glass of water on the right (the left stays clear for the hand) */}
      <g>
        <ellipse cx={1530} cy={930} rx={86} ry={16} fill="#000" opacity={0.35} />
        <path d="M 1450 640 L 1610 640 L 1592 928 L 1468 928 Z" fill="#BFD6FF" opacity={0.35} stroke="#E6F0FF" strokeWidth={4} />
        <path d="M 1458 720 L 1602 720 L 1592 928 L 1468 928 Z" fill="#9FC0E6" opacity={0.3} />
        <path d="M 1478 660 L 1488 900" stroke="#FFFFFF" strokeWidth={8} opacity={0.4} strokeLinecap="round" />
      </g>
      {/* the clock, big */}
      <g transform={`translate(0 ${press * 0.3})`}>
        <BedsideClock x={AI.CLOCK.x} y={AI.CLOCK.y} s={AI.CLOCK.s} text={clock} ring={hand > 0.9 ? 0 : ring} t={t} />
      </g>
      <Glow x={AI.CLOCK.x} y={AI.CLOCK.y - 180} r={520} kind="red" o={0.35} />
      {/* Pip's hand from the bed side */}
      {hand > 0.01 ? <SlapArm x={mx} y={my} fx={-360} fy={lerp(560, 600, h)} /> : null}
    </g>
  );
};

/** Pip's arm reaching in palm-down from the left: the hoodie sleeve to the wrist, a cuff, the mitten seen from above. */
const SlapArm: React.FC<{ x: number; y: number; fx: number; fy: number }> = ({ x, y, fx, fy }) => {
  const L = LOOKS.pipHood;
  const ang = (Math.atan2(y - fy, x - fx) * 180) / Math.PI;
  const d = `M ${fx} ${fy} Q ${(fx + x) / 2} ${(fy + y) / 2 + 40} ${x} ${y}`;
  return (
    <g filter="url(#rimR)">
      <path d={d} stroke={L.line} strokeWidth={150} fill="none" strokeLinecap="round" />
      <path d={d} stroke={L.limb} strokeWidth={132} fill="none" strokeLinecap="round" />
      <g transform={`translate(${x} ${y}) rotate(${ang})`}>
        {/* the cuff, then the mitten: palm down, the thumb on the far side, two knuckle creases */}
        <rect x={-30} y={-70} width={40} height={140} rx={18} fill="#24212F" stroke={L.line} strokeWidth={7} />
        <ellipse cx={58} cy={-58} rx={40} ry={22} transform="rotate(-28 58 -58)" fill={L.hand} stroke={L.line} strokeWidth={7} />
        <ellipse cx={74} cy={4} rx={82} ry={60} fill={L.hand} stroke={L.line} strokeWidth={7} />
        <path d="M 116 -26 Q 126 4 116 34 M 96 -38 Q 108 4 96 44" stroke={L.line} strokeWidth={4} fill="none" opacity={0.35} strokeLinecap="round" />
        <path d="M 30 -50 Q 74 -64 120 -40" stroke="#FFC98A" strokeWidth={5} fill="none" opacity={0.5} strokeLinecap="round" />
      </g>
    </g>
  );
};
