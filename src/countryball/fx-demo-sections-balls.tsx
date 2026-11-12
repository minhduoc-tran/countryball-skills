import React from 'react';
import { FONT } from '../engine/fonts';
import { Ball, Eyes } from './countryball';
import { Aviators, Headset, MuCoi, NonLa, PilotHelmet, UsafCap } from './ball-accessories';
import { breathe, hop, mixMotion, REST, shake, talk } from './ball-motion';
import { BinocularsProp, DocumentProp, PenProp, SpeechBubble } from './ball-speech-and-props';
import { AircraftTop } from './aircraft-top-view';
import { AircraftSide } from './aircraft-side-view';
import { AIRCRAFT_LENGTH_M, AIRCRAFT_NAME, AircraftKind } from './aircraft-kinds';

// FxKitDemo sections 1-2 (t = local frame): ball expressions / accessories / props, then the aircraft gallery.

export const Label: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end' }> = ({ x, y, text, size = 24, color = '#9DB4CC', anchor = 'middle' }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT.ui} fontSize={size} fill={color}>{text}</text>
);

const EXPR: Eyes[] = ['normal', 'happy', 'smug', 'shock', 'angry', 'determined', 'worried', 'sad', 'dizzy'];

export const BallsSection: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <Label x={60} y={70} text="BÓNG: BIỂU CẢM, PHỤ KIỆN, CỬ ĐỘNG, BONG BÓNG THOẠI" size={28} color="#FFD166" anchor="start" />
    {EXPR.map((e, i) => (
      <g key={e}>
        <Ball id={`e${i}`} x={150 + i * 202} y={200} r={66} flag={i % 2 ? 'USA' : 'VNM'} eyes={e} t={t} tear={e === 'sad'} sweat={e === 'worried'}
          motion={mixMotion(breathe(t, 60, 0.035, i * 9), e === 'happy' ? hop(t, 24, 22, i) : REST, e === 'shock' ? shake(t, 30, 10, 22) : REST)} />
        <Label x={150 + i * 202} y={310} text={e} size={22} />
      </g>
    ))}
    <Ball id="a1" x={190} y={520} r={90} flag="VNM" eyes="happy" hat={<MuCoi />} motion={breathe(t, 66)} />
    <Ball id="a2" x={450} y={520} r={90} flag="USA" eyes="normal" hat={<PilotHelmet />} motion={breathe(t, 74, 0.03, 20)} />
    <Ball id="a3" x={710} y={520} r={90} flag="USA" eyes="smug" hat={<UsafCap />} motion={breathe(t, 70, 0.03, 40)} />
    <Ball id="a4" x={970} y={520} r={90} flag="USA" eyes="smug" hat={<Aviators />} motion={breathe(t, 64, 0.03, 10)} />
    <Ball id="a5" x={1230} y={520} r={90} flag="VNM" eyes="determined" hat={<Headset />} motion={breathe(t, 68, 0.03, 30)} />
    <Ball id="a6" x={1490} y={520} r={90} flag="VNM" eyes="normal" hat={<NonLa />} motion={breathe(t, 72)} />
    <Ball id="a7" x={1750} y={520} r={90} flag="FRA" eyes="worried" sweat motion={breathe(t, 60)} />
    {['mũ cối', 'mũ phi công', 'mũ sĩ quan', 'kính phi công', 'tai nghe radar', 'nón lá', 'FRA'].map((s, i) => <Label key={s} x={190 + i * 260} y={650} text={s} size={22} />)}
    {/* talking ball + speech bubble + held props */}
    <Ball id="t1" x={300} y={900} r={84} flag="VNM" eyes="determined" hat={<MuCoi />} motion={mixMotion(talk(t), breathe(t))} />
    <SpeechBubble x={620} y={800} tipX={370} tipY={860} text={'Điện Biên Phủ\ntrên không!'} size={36} t={t} at={8} />
    <DocumentProp x={560} y={935} s={0.95} rot={-8} />
    <PenProp x={690} y={985} s={1.1} rot={-20} />
    <Ball id="t2" x={1050} y={900} r={84} flag="USA" eyes="shock" hat={<PilotHelmet />} motion={mixMotion(shake(t, 40, 16, 22), breathe(t))} />
    <BinocularsProp x={1220} y={920} s={1.2} rot={20} />
    <Ball id="t3" x={1520} y={900} r={84} flag="VNM" eyes="sad" tear motion={breathe(t, 90, 0.04)} tilt={-6} />
    <Ball id="t4" x={1730} y={900} r={84} flag="USA" eyes="angry" motion={hop(t, 26, 40)} />
  </g>
);

const KINDS: AircraftKind[] = ['b52', 'kc135', 'eb66', 'f111', 'f4', 'mig21'];
const PX_PER_M = 3.3;

export const AircraftSection: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <Label x={60} y={70} text="MÁY BAY: TRÊN XUỐNG (xoay theo hướng bay) VÀ NHÌN NGANG" size={28} color="#FFD166" anchor="start" />
    {KINDS.map((k, i) => {
      const x = 190 + i * 308, sz = AIRCRAFT_LENGTH_M[k] * PX_PER_M;
      return (
        <g key={k}>
          <AircraftTop id={`g${i}`} kind={k} x={x} y={220} size={sz} heading={-10 + t * 0.5 + i * 8} />
          <AircraftSide kind={k} x={x} y={500 + Math.sin((t + i * 11) / 12) * 6} size={k === 'b52' ? 290 : 250} pitch={Math.sin((t + i * 7) / 20) * 3} />
          <Label x={x} y={310} text={AIRCRAFT_NAME[k]} size={24} />
        </g>
      );
    })}
    <AircraftSide kind="b52" x={470} y={860} size={640} pitch={-3} />
    <AircraftTop id="gbig" kind="b52" x={1330} y={820} size={360} heading={-12 + Math.sin(t / 18) * 6} />
    <AircraftTop id="gbigG" kind="b52" variant="G" x={1740} y={850} size={190} heading={200} />
    <Label x={470} y={1010} text="B-52D: lưng ngụy trang, bụng đen" size={22} />
    <Label x={1330} y={1010} text="B-52D / B-52G trên xuống" size={22} />
  </g>
);
