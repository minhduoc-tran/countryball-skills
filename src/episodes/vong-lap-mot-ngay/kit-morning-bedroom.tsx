import React from 'react';
import { rnd, Glow, Cone, LightVeil, Dust, RoomShell, WallFrame, FloorShadow, Box, Shaft, BEDROOM, BedDuvet, bedSit, bedTop, stand } from '../../engine';
import { PAL, mix } from './kit-palette';
import { DawnSky, BedsideClock, TearCalendar, sunAt } from './kit-bedroom-parts';
import { Notebook } from './kit-props';

export { bedSit, bedTop, BedDuvet, BEDROOM };
export { AlarmInsert } from './kit-alarm-insert';

// Pip's bedroom at 06:00 (the loop's start), built with the room kit on the engine Bedroom's geometry (same BEDROOM
// room, same bed), but in morning light: the window is the light. Draw it under the camera group.
//   <MorningBedroom id t dawn={0..1} clock="06:00" ring={0..1} day="THỨ TƯ" duvet lamp={0..1} veil? notebook? />
//   dawn 0 = pre-dawn blue (clock + door crack are the light; use it for midnight in Pip's room too, + the midnight
//   look), 1 = full peach morning (sun over the rooftops, shaft on the floor). ring > 0 shakes the clock (ring lines).
//   lamp 0..1 = the desk lamp (night study). notebook 0..1 = the desk notebook's writing dissolving (fade).
// In bed: <MorningBedroom duvet={false} />, Pip at bedSit(u) (u 0.08-0.35; hips, scale ~0.6), then <BedDuvet /> over
// his legs. bedTop(u, w) = a point on the mattress. Standing: stand(BEDROOM, u, w) (e.g. u 0.55 w 0.45: by the rug).
// KEY COORDINATES (world units):
export const MB = {
  CLOCK: { x: 924, y: 658, s: 0.33 }, // BedsideClock base centre on the nightstand (display centre ~ (924, 638))
  CAL: { x: 952, y: 396, w: 120 }, // TearCalendar top centre over the nightstand (page 120 x 156: y 396-552)
  WINDOW: { x0: 1070, x1: 1330, y0: 374, y1: 600 }, // the window box (sun: SUN(dawn))
  DESK: { x0: 1072, x1: 1355, top: 648 }, // desk top front edge (x span, y), under the window
  NOTE: { x: 1168, y: 641, s: 0.34 }, // the open notebook lying on the desk (Notebook centre, drawn `flat`)
  PILLOW: bedTop(0.12, 0.06), // Pip's head on the pillow when lying (u 0.12)
};
export const SUN = (dawn: number) => sunAt(MB.WINDOW, dawn);

const WALL = { pre: { wall: '#262C4A', side: '#1E2340', floor: '#221E30', ceil: '#11142A' }, day: { wall: '#5E4C58', side: '#4A3C48', floor: '#4E3A3A', ceil: '#2A2230' } };

export const MorningBedroom: React.FC<{ t: number; id?: string; dawn?: number; clock?: string; ring?: number; day?: string; duvet?: boolean; lamp?: number; veil?: number; notebook?: number }> = ({
  t, id = 'mb', dawn = 1, clock = '06:00', ring = 0, day = 'THỨ TƯ', duvet = true, lamp = 0, veil = 0.4, notebook = 0,
}) => {
  const r = BEDROOM;
  const { P, Q } = r;
  const d = dawn;
  const c = (k: 'wall' | 'side' | 'floor' | 'ceil') => mix(WALL.pre[k], WALL.day[k], d);
  const W = MB.WINDOW;
  const sun = SUN(d);
  const warm = mix('#9FC0FF', PAL.dawnGold, d);
  const ns = { u0: 0.43, u1: 0.53, v0: 0.78, w0: 0.01, w1: 0.11 };
  const BED = { u0: 0.03, u1: 0.4, top: 0.79, w1: 0.47 };
  const desk = { u0: 0.6, u1: 0.86, v0: 0.735, w0: 0.0, w1: 0.17 };
  const lampP = P(0.615, desk.v0, 0.05);
  const door = P(0, 0.6, 0.64);
  return (
    <g>
      <RoomShell r={r} id={id} wall={c('wall')} side={c('side')} floorC={c('floor')} ceiling={c('ceil')} lines={mix('#1A1626', '#3A2A2C', d)} />
      {/* the left wall: the door ajar, mum's landing light in the crack */}
      <polygon points={Q([[0, 0.2, 0.5], [0, 0.2, 0.78], [0, 1, 0.78], [0, 1, 0.5]])} fill="#1A1624" />
      <polygon points={Q([[0, 0.23, 0.52], [0, 0.23, 0.555], [0, 1, 0.555], [0, 1, 0.52]])} fill="#FFC27A" opacity={0.85} />
      <polygon points={Q([[0, 0.23, 0.555], [0, 0.23, 0.76], [0, 1, 0.76], [0, 1, 0.555]])} fill={mix('#3A3552', '#6A4E52', d)} />
      <polygon points={Q([[0, 0.3, 0.58], [0, 0.3, 0.73], [0, 0.55, 0.73], [0, 0.55, 0.58]])} fill="none" stroke="#2C2432" strokeWidth={4} />
      <polygon points={Q([[0, 1, 0.52], [0.16, 1, 0.6], [0.2, 1, 0.66], [0, 1, 0.555]])} fill="#FFB46A" opacity={0.14} style={{ mixBlendMode: 'screen' }} />
      {/* posters over the bed, a shelf with books and a little trophy */}
      <WallFrame x={528} y={404} w={108} h={140} art={1} />
      <WallFrame x={668} y={420} w={92} h={112} art={2} />
      <rect x={790} y={410} width={70} height={92} fill="#1E1824" />
      <rect x={796} y={416} width={58} height={80} fill="#C96A5A" />
      <path d="M 806 480 L 826 430 L 846 480 Z" fill="#F6EFE3" opacity={0.8} />
      <rect x={1352} y={420} width={78} height={8} fill="#3A2A2C" />
      {[0, 1, 2, 3].map((k) => <rect key={k} x={1358 + k * 13} y={420 - (36 + (k % 2) * 8)} width={11} height={36 + (k % 2) * 8} fill={['#3E6A8A', '#B8483E', '#D9A441', '#3F5E44'][k]} />)}
      <path d="M 1416 420 l -6 -10 l 12 0 Z M 1416 410 l 0 -14" stroke="#C9A44A" strokeWidth={5} />
      {/* the tear-off calendar over the nightstand */}
      <TearCalendar x={MB.CAL.x} y={MB.CAL.y} w={MB.CAL.w} day={day} />
      {/* before the sun is up the page sinks into the dark (still readable, never brighter than a face) */}
      <rect x={MB.CAL.x - MB.CAL.w / 2 - 8} y={MB.CAL.y - 8} width={MB.CAL.w + 16} height={MB.CAL.w * 1.3 + 18} fill="#0A0C1E" opacity={0.42 * (1 - d)} />
      {/* the window onto the dawn: sky, roofs, frame, sill, a plant on the sill, light curtains tied back */}
      <DawnSky id={`${id}sky`} t={t} x0={W.x0} x1={W.x1} y0={W.y0} y1={W.y1} dawn={d} />
      <g fill="#2A2028">
        <rect x={W.x0 - 12} y={W.y0 - 12} width={W.x1 - W.x0 + 24} height={14} />
        <rect x={W.x0 - 12} y={W.y1 - 2} width={W.x1 - W.x0 + 24} height={12} />
        <rect x={W.x0 - 12} y={W.y0 - 12} width={14} height={W.y1 - W.y0 + 20} />
        <rect x={W.x1 - 2} y={W.y0 - 12} width={14} height={W.y1 - W.y0 + 20} />
        <rect x={(W.x0 + W.x1) / 2 - 5} y={W.y0} width={10} height={W.y1 - W.y0} />
        <rect x={W.x0} y={W.y0 + 72} width={W.x1 - W.x0} height={7} />
      </g>
      <path d={`M ${W.x0 - 10} ${W.y1 + 9} L ${W.x1 + 10} ${W.y1 + 9}`} stroke={warm} strokeWidth={2.5} opacity={0.7} />
      {[{ x: W.x0 - 24, f: 1 }, { x: W.x1 + 24, f: -1 }].map((cu, k) => (
        <g key={`cu${k}`}>
          {/* linen curtains tied back at the sides of the window, a lit edge facing it */}
          <path d={`M ${cu.x - 18 * cu.f} ${W.y0 - 22} L ${cu.x + 48 * cu.f} ${W.y0 - 22} Q ${cu.x + 20 * cu.f} ${W.y0 + 110} ${cu.x + 8 * cu.f} ${W.y1 - 30} Q ${cu.x + 18 * cu.f} ${W.y1 + 60} ${cu.x + 12 * cu.f} ${W.y1 + 130} L ${cu.x - 18 * cu.f} ${W.y1 + 130} Z`} fill={mix('#3A3A5A', '#C9A48A', d)} opacity={0.95} />
          <path d={`M ${cu.x + 48 * cu.f} ${W.y0 - 22} Q ${cu.x + 20 * cu.f} ${W.y0 + 110} ${cu.x + 8 * cu.f} ${W.y1 - 30}`} stroke={warm} strokeWidth={4} fill="none" opacity={0.6} />
          <path d={`M ${cu.x - 6 * cu.f} ${W.y0 - 10} L ${cu.x - 4 * cu.f} ${W.y1 + 120} M ${cu.x + 14 * cu.f} ${W.y0 - 10} L ${cu.x + 6 * cu.f} ${W.y1 - 40}`} stroke="#000" strokeWidth={5} opacity={0.12} />
          <rect x={cu.x - 4} y={W.y1 - 36} width={26} height={9} rx={4} fill={mix('#2A2A44', '#8A5A4A', d)} transform={`rotate(${-12 * cu.f} ${cu.x} ${W.y1 - 30})`} />
        </g>
      ))}
      <rect x={W.x0 - 60} y={W.y0 - 28} width={W.x1 - W.x0 + 120} height={8} rx={4} fill="#1A1420" />
      {/* the floor patch of sunlight, and the shaft through the air */}
      <polygon points={Q([[0.64, 1, 0.03], [0.86, 1, 0.03], [0.98, 1, 0.62], [0.5, 1, 0.62]])} fill={PAL.dawnGold} opacity={0.2 * d} style={{ mixBlendMode: 'screen' }} />
      <Shaft d={`M ${W.x0 + 10} ${W.y0 + 10} L ${W.x1 - 10} ${W.y0 + 10} L ${P(1, 1, 0.62).x} ${P(1, 1, 0.62).y} L ${P(0.48, 1, 0.62).x} ${P(0.48, 1, 0.62).y} Z`} o={0.75 * d} />
      {/* the wardrobe against the right wall */}
      <FloorShadow r={r} u={[0.86, 1]} w={[0.1, 0.42]} o={0.4} />
      <Box r={r} u={[0.87, 1]} v={[0.1, 1]} w={[0.1, 0.42]} front="#4A3A3E" side={mix('#2E242C', '#3E3036', d)} top="#56444A" />
      <polygon points={Q([[0.87, 0.14, 0.26], [0.87, 0.14, 0.262], [0.87, 0.97, 0.262], [0.87, 0.97, 0.26]])} fill="#1E181E" />
      {[0.22, 0.3].map((w, k) => <rect key={`wk${k}`} x={P(0.87, 0.55, w).x - 4} y={P(0.87, 0.55, w).y - 16} width={8} height={32} rx={3} fill="#C9A46A" />)}
      {/* the desk under the window: top, legs, drawer unit; lamp, notebook, pencil cup, books; the chair in front */}
      <FloorShadow r={r} u={[desk.u0, desk.u1]} w={[desk.w0, desk.w1]} o={0.3} />
      {[[desk.u0 + 0.008, desk.w1 - 0.012], [desk.u0 + 0.008, 0.01]].map(([u, w], k) => <Box key={`lg${k}`} r={r} u={[u, u + 0.012]} v={[desk.v0 + 0.02, 1]} w={[w, w + 0.012]} front="#3A2A26" side="#2A1E1C" />)}
      <Box r={r} u={[0.76, desk.u1 - 0.006]} v={[desk.v0 + 0.02, 1]} w={[0.01, desk.w1 - 0.006]} front="#5A4038" side="#3E2C28" top="#6A4C42" />
      {[0.82, 0.9].map((v, k) => <circle key={`dk${k}`} cx={P(0.81, v, desk.w1 - 0.006).x} cy={P(0.81, v, desk.w1 - 0.006).y} r={4} fill="#C9A46A" />)}
      <Box r={r} u={[desk.u0, desk.u1]} v={[desk.v0, desk.v0 + 0.022]} w={[desk.w0, desk.w1]} front="#6A4C42" top="#7E5C4E" side="#4A342E" rim />
      {(() => {
        const b = P(0.81, desk.v0, 0.045);
        const pc = P(0.845, desk.v0, 0.05);
        return (
          <g>
            {[0, 1, 2].map((k) => <rect key={k} x={b.x - 40 + k * 3} y={b.y - 14 - k * 13} width={78 - k * 6} height={13} rx={2} fill={['#3E6A8A', '#B8483E', '#D9A441'][k]} stroke="#1E1824" strokeWidth={2} />)}
            <rect x={pc.x - 12} y={pc.y - 30} width={24} height={30} rx={4} fill="#2F6E69" />
            {[-6, 1, 7].map((dx, k) => <path key={k} d={`M ${pc.x + dx} ${pc.y - 28} L ${pc.x + dx + (k - 1) * 4} ${pc.y - 56}`} stroke={['#F2B33D', '#E8553E', '#F6EFE3'][k]} strokeWidth={4} strokeLinecap="round" />)}
          </g>
        );
      })()}
      <Notebook x={MB.NOTE.x} y={MB.NOTE.y} s={MB.NOTE.s} t={t} fade={notebook} id={`${id}nb`} flat />
      {/* the desk lamp: arm, shade, its light when on */}
      <g>
        <ellipse cx={lampP.x} cy={lampP.y - 3} rx={20} ry={6} fill="#1E1A22" />
        <path d={`M ${lampP.x} ${lampP.y - 4} L ${lampP.x + 18} ${lampP.y - 74} L ${lampP.x + 54} ${lampP.y - 96}`} stroke="#1E1A22" strokeWidth={6} fill="none" strokeLinejoin="round" />
        <path d={`M ${lampP.x + 40} ${lampP.y - 112} L ${lampP.x + 78} ${lampP.y - 96} L ${lampP.x + 64} ${lampP.y - 70} L ${lampP.x + 30} ${lampP.y - 88} Z`} fill={lamp > 0.3 ? '#F2D2A0' : '#3E3440'} stroke="#1E1A22" strokeWidth={3} />
        {lamp > 0 ? <Cone d={`M ${lampP.x + 30} ${lampP.y - 86} L ${lampP.x + 66} ${lampP.y - 70} L ${lampP.x + 220} ${lampP.y + 10} L ${lampP.x - 30} ${lampP.y + 10} Z`} o={0.7 * lamp} /> : null}
      </g>
      {/* the chair at the desk, seen from behind */}
      {(() => {
        const a = P(0.82, 1, 0.25);
        const s = r.s(0.26);
        return (
          <g>
            <ellipse cx={a.x + 10} cy={a.y + 4} rx={70 * s} ry={12 * s} fill="#000" opacity={0.35} />
            <path d={`M ${a.x - 48 * s} ${a.y} L ${a.x - 44 * s} ${a.y - 90 * s} M ${a.x + 48 * s} ${a.y} L ${a.x + 44 * s} ${a.y - 90 * s}`} stroke="#2A1E1C" strokeWidth={7 * s} />
            <rect x={a.x - 56 * s} y={a.y - 104 * s} width={112 * s} height={16 * s} rx={4 * s} fill="#5A4038" />
            <path d={`M ${a.x - 50 * s} ${a.y - 100 * s} L ${a.x - 54 * s} ${a.y - 226 * s} M ${a.x + 50 * s} ${a.y - 100 * s} L ${a.x + 54 * s} ${a.y - 226 * s}`} stroke="#3A2A26" strokeWidth={9 * s} />
            <rect x={a.x - 60 * s} y={a.y - 232 * s} width={120 * s} height={50 * s} rx={8 * s} fill="#6A4C42" stroke="#2A1E1C" strokeWidth={3} />
            <path d={`M ${a.x - 56 * s} ${a.y - 230 * s} L ${a.x + 56 * s} ${a.y - 230 * s}`} stroke={warm} strokeWidth={3} opacity={0.6} />
          </g>
        );
      })()}
      {/* the rug, the beanbag, a backpack and trainers */}
      <polygon points={Q([[0.42, 1, 0.42], [0.84, 1, 0.42], [0.84, 1, 0.82], [0.42, 1, 0.82]])} fill={mix('#3A2E4E', '#7A5A6A', d)} />
      <polygon points={Q([[0.45, 1, 0.45], [0.81, 1, 0.45], [0.81, 1, 0.79], [0.45, 1, 0.79]])} fill="none" stroke={mix('#4E3E66', '#9A7484', d)} strokeWidth={5} />
      {(() => {
        const b = P(0.585, 1, 0.16);
        const s = r.s(0.16);
        return (
          <g>
            <ellipse cx={b.x + 6} cy={b.y + 2} rx={40 * s} ry={8 * s} fill="#000" opacity={0.35} />
            <path d={`M ${b.x - 34 * s} ${b.y} L ${b.x - 30 * s} ${b.y - 70 * s} Q ${b.x} ${b.y - 86 * s} ${b.x + 30 * s} ${b.y - 70 * s} L ${b.x + 34 * s} ${b.y} Z`} fill="#2F6E69" />
            <rect x={b.x - 22 * s} y={b.y - 44 * s} width={44 * s} height={30 * s} rx={6 * s} fill="#265A56" />
          </g>
        );
      })()}
      {[[0.5, 0.5, 1, -6], [0.56, 0.53, -1, 8]].map(([u, w, fl, rot], k) => {
        const p = P(u, 1, w);
        const s = r.s(w) * 0.8;
        return (
          <g key={`sn${k}`} transform={`translate(${p.x} ${p.y}) rotate(${rot}) scale(${fl * s} ${s})`}>
            <ellipse cx={4} cy={2} rx={44} ry={7} fill="#000" opacity={0.35} />
            <path d="M -40 -2 L 40 -2 Q 46 -8 40 -16 Q 22 -18 12 -30 L -16 -34 Q -30 -30 -38 -18 Z" fill="#2FB7A6" />
            <rect x={-42} y={-6} width={86} height={8} rx={4} fill="#E9E2D2" />
          </g>
        );
      })}
      {/* the bed: headboard, frame, sheet, pillows, duvet */}
      <polygon points={Q([[BED.u0, 1, 0.03], [BED.u1 + 0.03, 1, 0.03], [BED.u1 + 0.03, 1, BED.w1 + 0.03], [BED.u0, 1, BED.w1 + 0.03]])} fill="#000" opacity={0.4} />
      <Box r={r} u={[BED.u0, BED.u1]} v={[0.52, 1]} w={[0, 0.03]} front="#5A4652" side="#3A2E36" top="#6A5460" rim />
      <Box r={r} u={[BED.u0, BED.u1]} v={[0.85, 1]} w={[0.03, BED.w1]} front="#4A3A44" side="#2E242A" top="#4A3A44" />
      <Box r={r} u={[BED.u0 + 0.005, BED.u1 - 0.005]} v={[BED.top, 0.86]} w={[0.03, BED.w1 - 0.005]} front="#D8D2C4" side="#B8B2A6" top="#E6E0D2" />
      {[0.12, 0.3].map((u, k) => {
        const a = P(u - 0.085, BED.top, 0.04);
        const b = P(u + 0.085, BED.top, 0.04);
        const cc = P(u, BED.top, 0.09);
        return <path key={`pw${k}`} d={`M ${a.x} ${a.y} Q ${a.x - 8} ${a.y - 34} ${(a.x + b.x) / 2} ${a.y - 40} Q ${b.x + 8} ${b.y - 34} ${b.x} ${b.y} Q ${cc.x} ${cc.y + 8} ${a.x} ${a.y} Z`} fill={k ? '#E9E2D2' : '#DCD4C4'} />;
      })}
      {duvet ? <BedDuvet /> : null}
      {/* the nightstand: drawer, the alarm clock, a glass of water */}
      <FloorShadow r={r} u={[ns.u0, ns.u1]} w={[ns.w0, ns.w1]} />
      <Box r={r} u={[ns.u0, ns.u1]} v={[ns.v0, 1]} w={[ns.w0, ns.w1]} front="#5A4440" top="#6E5650" side="#3A2C29" rim />
      <polygon points={Q([[ns.u0 + 0.01, 0.82, ns.w1], [ns.u1 - 0.01, 0.82, ns.w1], [ns.u1 - 0.01, 0.9, ns.w1], [ns.u0 + 0.01, 0.9, ns.w1]])} fill="none" stroke="#2E2220" strokeWidth={3} />
      <circle cx={P(0.48, 0.86, ns.w1).x} cy={P(0.48, 0.86, ns.w1).y} r={4} fill="#C9A46A" />
      {(() => {
        const g = P(0.52, ns.v0, 0.07);
        return <path d={`M ${g.x - 9} ${g.y - 30} L ${g.x + 9} ${g.y - 30} L ${g.x + 7} ${g.y} L ${g.x - 7} ${g.y} Z`} fill="#BFD6FF" opacity={0.5} />;
      })()}
      <BedsideClock x={MB.CLOCK.x} y={MB.CLOCK.y} s={MB.CLOCK.s} text={clock} ring={ring} t={t} />
      {/* the contrast pass, then the lights again on top */}
      <LightVeil
        id={`${id}veil`}
        lights={[
          [(W.x0 + W.x1) / 2, 520, 300 + 120 * d],
          [P(0.75, 1, 0.35).x, P(0.75, 1, 0.35).y, 320 * d],
          [MB.CLOCK.x, MB.CLOCK.y - 20, 150],
          [MB.CAL.x, MB.CAL.y + 80, 40 + 170 * d],
          [door.x, door.y, 230],
          [lampP.x + 80, lampP.y, 300 * lamp],
          [560, 690, 260 * d],
        ]}
        o={veil + 0.18 * (1 - d)}
      />
      <Glow x={sun.x} y={sun.y} r={360} o={0.55 * d} />
      <Glow x={(W.x0 + W.x1) / 2} y={W.y1} r={260} o={0.35 * d} />
      <Glow x={MB.CLOCK.x} y={MB.CLOCK.y - 22} r={90} kind="red" o={0.35 + 0.25 * (1 - d)} />
      <Glow x={door.x} y={door.y} r={150} o={0.28} />
      {lamp > 0 ? <Glow x={lampP.x + 60} y={lampP.y - 70} r={240} o={0.6 * lamp} /> : null}
      <Dust t={t} seed={23} x0={W.x0 - 40} y0={W.y0 + 60} w={W.x1 - W.x0 + 120} h={360} n={22} o={0.5 * d} />
      {Array.from({ length: 6 }).map((_, k) => <circle key={`gl${k}`} cx={520 + rnd(5, k) * 880} cy={720 + rnd(6, k) * 200} r={1.5} fill="#FFE2B0" opacity={0.2} />)}
    </g>
  );
};

/** Hip point + scale for Pip standing at floor point (u, w) of the bedroom (shortcut for stand(BEDROOM, u, w)). */
export const roomStand = (u: number, w: number) => stand(BEDROOM, u, w);
