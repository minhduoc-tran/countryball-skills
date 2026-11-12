import React from 'react';
import { Schematic, SchLabel, SCH, FONT, ShotProps, kf, camT, clamp, easeInOut, backOut, Hero, basePose, faceAt, LOOKS, Rooftop, Sparkle, Tag } from '../../engine';
import { FlowChart, PipDot, PsycheIcon, FlowWaves, cx, cy } from './chd-flow-chart-props';

// Chapter D, flow science and the rooftop (D37-D45, 185.70-202.05 s): psychologists' idea, the title, the chart (skill vs
// challenge, the flow channel), Pip's dot sliding into "NHÀM CHÁN", then "Mạnh nhất / chán nhất" alone on a rooftop at dusk.

const PIP = LOOKS.pipHood;
const INK = '#16101A';
const lin = (t: number, a: number, len: number) => clamp((t - a) / len);

// D37 (52 f): "Các nhà tâm lý học có một khái niệm": a head with a swirl in it
export const D37: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="d37" />
    <PsycheIcon x={960} y={500} s={1.45} t={t} />
    <SchLabel x={960} y={950} t={t - 6} text="TÂM LÝ HỌC" size={64} color={SCH.line} />
    <SchLabel x={960} y={1010} t={t - 14} text="Csikszentmihalyi, 1990" size={30} color={SCH.dim} />
  </g>
);

// D38 (51 f): "gọi là trạng thái dòng chảy.": title over a rippling stream
export const D38: React.FC<ShotProps> = ({ t }) => {
  const s = backOut(lin(t, 4, 9));
  return (
    <g>
      <Schematic t={t} id="d38" />
      <FlowWaves t={t} y={680} />
      <g transform={`translate(960 330) scale(${s})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={100} fill={SCH.line} letterSpacing={4}>TRẠNG THÁI</text>
      </g>
      <g transform={`translate(960 520) scale(${backOut(lin(t, 14, 9))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={190} fill="#7BFFC3" stroke={INK} strokeWidth={14} paintOrder="stroke" strokeLinejoin="round">DÒNG CHẢY</text>
      </g>
    </g>
  );
};

// D39 (79 f): the chart draws on; a smiling dot rides the channel
export const D39: React.FC<ShotProps> = ({ t }) => {
  const u = kf(t, [[34, 0.22], [78, 0.68]]);
  const dot = t >= 30 ? <PipDot x={cx(u)} y={cy(u + Math.sin(t * 0.3) * 0.02)} mood={1} r={42} glow={lin(t, 40, 20)} /> : null;
  return (
    <g>
      <Schematic t={t} id="d39" />
      <FlowChart draw={lin(t, 0, 20)} band={lin(t, 18, 14)} />
      {dot}
      {t >= 58 ? <Sparkle x={cx(0.68) + 50} y={cy(0.68) - 50} t={t - 58} s={1.2} /> : null}
    </g>
  );
};

// D40 (58 f): "Khó một chút, nhưng vẫn làm được.": camera in on the channel, the dot steps up (harder) and stays in it
export const D40: React.FC<ShotProps> = ({ t }) => {
  const u = kf(t, [[0, 0.5], [18, 0.5], [26, 0.5], [46, 0.62]], easeInOut);
  const v = kf(t, [[0, 0.5], [18, 0.5], [26, 0.64], [46, 0.64]], easeInOut);
  return (
    <g transform={camT(cx(0.55), cy(0.55), kf(t, [[0, 1.5], [58, 1.75]]))}>
      <Schematic t={t} id="d40" />
      <FlowChart band={1} />
      {t > 18 && t < 40 ? <path d={`M ${cx(0.5) + 50} ${cy(0.5) - 8} V ${cy(0.64) + 4}`} stroke="#FFE27A" strokeWidth={8} strokeDasharray="10 10" strokeLinecap="round" /> : null}
      <PipDot x={cx(u)} y={cy(v)} mood={1} r={40} glow={0.6} />
      {t >= 28 ? <g transform={`translate(${cx(0.5) + 130} ${cy(0.58)}) scale(${backOut(lin(t, 28, 8))})`}><text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#FFE27A" stroke={INK} strokeWidth={8} paintOrder="stroke">+1</text></g> : null}
    </g>
  );
};

// D41 (39 f): "Khi mọi thứ quá dễ,": the challenge drops away, the dot slides down and right, its smile fading
export const D41: React.FC<ShotProps> = ({ t }) => {
  const q = easeInOut(lin(t, 0, 38));
  const u = 0.62 + 0.3 * q;
  const v = 0.64 - 0.52 * q;
  return (
    <g>
      <Schematic t={t} id="d41" />
      <FlowChart band={1} bored={lin(t, 20, 12)} />
      <path d={`M ${cx(0.62)} ${cy(0.64)} L ${cx(u)} ${cy(v)}`} stroke="#FFE27A" strokeWidth={6} strokeDasharray="4 12" strokeLinecap="round" />
      <PipDot x={cx(u)} y={cy(v)} mood={1 - 1.2 * q} r={42} />
    </g>
  );
};

// D42 (52 f): "niềm vui biến thành nhàm chán.": zoomed in at the bottom right: the flat dot in NHÀM CHÁN
export const D42: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(cx(0.84), cy(0.2), kf(t, [[0, 1.4], [52, 1.8]]))}>
    <Schematic t={t} id="d42" />
    <FlowChart band={1} bored={lin(t, 8, 14)} />
    <PipDot x={cx(0.9)} y={cy(0.12) + 3 * Math.sin(t * 0.15)} mood={0} r={42} />
    {t >= 20 ? <text x={cx(0.9) + 50} y={cy(0.12) - 62} fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#B8C4DA" opacity={clamp((t - 20) / 8)}>z z z</text> : null}
  </g>
);

// D43 (29 f): "Đó là thật.": the whole chart again, ticked
export const D43: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="d43" />
    <g opacity={0.55}>
      <FlowChart band={1} tense={1} bored={1} />
      <PipDot x={cx(0.9)} y={cy(0.12)} mood={0} r={42} />
    </g>
    <Tag x={960} y={540} t={t} text="ĐÓ LÀ THẬT" mark="check" markT={6} w={740} />
  </g>
);

const RoofPip: React.FC<{ pose: Partial<typeof basePose>; t: number; face: 'tired' | 'cool' | 'neutral' | 'smug' }> = ({ pose, t, face }) => (
  <Hero look={PIP} pose={{ ...basePose, ...pose, ...faceAt(t, [[0, face]]) }} rimId="rimR" shadow={1} />
);

// D44 (51 f): "Bạn là người mạnh nhất thế giới.": low angle on the roof, Pip tall against the setting sun
export const D44: React.FC<ShotProps> = ({ t }) => {
  const z = kf(t, [[0, 1.05], [51, 1.18]]);
  return (
    <g transform={camT(960, 560, z)}>
      <Rooftop t={t + 200} sunX={1010} sunY={600} low={120} />
      <RoofPip t={t} face="cool" pose={{ x: 960, y: 745, scale: 1.25, yaw: 0.25, armL: { a: 6, b: -2 }, armR: { a: 6, b: -2 } }} />
    </g>
  );
};

// D45 (79 f): "Và cũng là người chán nhất thế giới.": sitting on the parapet, chin on hand, slow push in
export const D45: React.FC<ShotProps> = ({ t }) => {
  const z = kf(t, [[0, 1.0], [79, 1.35]]);
  const bob = Math.sin(t * 0.08) * 2;
  return (
    <g transform={camT(kf(t, [[0, 960], [79, 1010]]), kf(t, [[0, 620], [79, 560]]), z)}>
      <Rooftop t={t + 300} sunX={1250} sunY={700 + kf(t, [[0, 0], [79, 40]])} />
      <rect x={560} y={790} width={760} height={260} fill="#4A3A56" stroke={INK} strokeWidth={6} />
      <rect x={560} y={790} width={760} height={18} fill="#7A6684" />
      <RoofPip t={t} face="tired" pose={{ x: 900, y: 772 + bob, scale: 1.0, yaw: 0.9, facing: 1, tilt: 6, headTilt: 12, legL: { a: 90, b: -90 }, legR: { a: 82, b: -82 }, armR: { a: 40, b: 110 }, armL: { a: 8, b: 14 }, look: 0.8 }} />
    </g>
  );
};
