import React from 'react';
import { FONT, ShotProps } from '../../engine';
import { PhotoCard } from '../../countryball/photo-card';
import { Art, Atmosphere, CaptionLabel, cream, gold, ink, monoStyle, step, titleStyle } from './art-kit';
import { BreachArt, GateArt, SchoolArt, TrenchArt } from './field-art';
import { AirArt, CrossingArt, FortArt, MemorialArt, RegionArt } from './operations-art';
import { LetterArt, PersonArt, RadioArt, SupplyArt } from './objects-art';
import archive from './archive.json';
import captions from './captions.json';

const art: Record<string, React.FC<Art>> = {
  gate:GateArt, trench:TrenchArt, school:SchoolArt, breach:BreachArt, armor:BreachArt,
  map:RegionArt, fort:FortArt, cross:CrossingArt, air:AirArt, memorial:MemorialArt,
  letter:LetterArt, portrait:PersonArt, radio:RadioArt, insert:SupplyArt,
};
const images=archive as Record<string,{src:string;caption:string;credit:string;w:number;h:number}>;
type ShotSpec={mode:string;stage:string;tag:string;label?:string;angle:number;first:number;until:number};

const tagText:Record<string,string>={
  A:'QUẢNG TRỊ · MÙA HÈ 1972',
  B:'ĐẠI ĐỘI 6 · THẠCH HÃN',
  C:'NHAN BIỀU · THÀNH CỔ',
  D:'THỊ XÃ QUẢNG TRỊ',
  E:'THÁNG 9 · 1972',
  F:'NHỮNG NGÀY CUỐI',
};

const dates:Record<string,[string,string,string]>={
  cold:['THÀNH CỔ','QUẢNG TRỊ','MÙA HÈ 1972'],
  july:['09','THÁNG BẢY','K3 TAM ĐẢO TẬP KẾT'],
  september:['11','THÁNG CHÍN','TƯỜNG THÀNH BỊ CHỌC THỦNG'],
  end:['16','THÁNG CHÍN','KHÉP LẠI 81 NGÀY ĐÊM'],
};

const DateArt:React.FC<Art>=({stage,t,u})=>{
  const [one,two,sub]=dates[stage]??dates.cold;
  const day=stage!=='cold';
  return <>
    <GateArt stage="slab" angle={0} t={t} u={u*.7} beat={0}/>
    <rect width="1080" height="1920" fill="#17151d" opacity=".55"/>
    <path d="M111 487H969M111 1185H969" stroke="#dda476" strokeWidth="2" opacity=".6"/>
    <text x="540" y={day?810:810} textAnchor="middle" fontSize={day?313:127} fill={gold} {...titleStyle}>{one}</text>
    <text x="540" y="990" textAnchor="middle" fontSize={day?91:138} fill={cream} {...titleStyle}>{two}</text>
    <text x="540" y="1113" textAnchor="middle" fontSize="30" letterSpacing="4" fill="#e0bc9e" {...monoStyle}>{sub}</text>
  </>;
};

const ArchiveArt:React.FC<Art>=({stage,angle,u,t})=>{
  const a=images[stage];
  const s=Math.min(914/a.w,1045/a.h);
  return <>
    <Atmosphere tone="room" t={t}/>
    <ellipse cx="540" cy="826" rx="590" ry="689" fill="url(#qlLamp)" opacity=".43"/>
    <path d="M60 447h960m-960 859h960" stroke="#ac8466" strokeWidth="2" opacity=".44"/>
    <PhotoCard id={`qlPhoto${stage}`} src={a.src} caption={a.caption} credit={a.credit}
      x={540} y={858} w={a.w*s} h={a.h*s} from={-4} t={u*5} rot={angle===1?-1.5:0}
      kb={{z0:1,z1:1.055,px0:0,py0:0,px1:0,py1:0}}/>
  </>;
};

const TitleArt:React.FC<Art>=({t,u})=>(
  <>
    <GateArt stage="dig" angle={1} t={t} u={u} beat={t}/>
    <rect width="1080" height="1920" fill="#17131d" opacity=".57"/>
    <path d="M255 567h570" stroke={gold} strokeWidth="4"/>
    <text x="540" y="681" fill={cream} textAnchor="middle" fontSize="71" {...titleStyle}>THÀNH CỔ QUẢNG TRỊ</text>
    <text x="540" y="938" fill={gold} textAnchor="middle" fontSize="226" {...titleStyle}>81</text>
    <text x="540" y="1044" fill={cream} textAnchor="middle" fontSize="95" {...titleStyle}>NGÀY ĐÊM</text>
    <text x="540" y="1155" fill="#eed0aa" textAnchor="middle" fontSize="28" letterSpacing="4" {...monoStyle}>28/06 — 16/09/1972</text>
  </>
);

export const makeShot=(s:ShotSpec):React.FC<ShotProps>=>({t,len,f})=>{
  const component=s.mode==='photo'?ArchiveArt:s.mode==='title'?TitleArt:s.mode==='date'?DateArt:art[s.mode];
  const Scene=component;
  const caption=captions.find(c=>f>=c.a&&f<c.b);
  const isArchive=s.mode==='photo';
  const big=s.mode==='title'||s.mode==='date';
  const tag=isArchive?'ẢNH TƯ LIỆU':tagText[s.tag];
  const progress = s.mode === 'cross' && s.stage !== 'bank'
    ? step(f, s.first, s.until - 1)
    : Math.min(1,t/Math.max(1,len-1));
  return <g>
    <Scene stage={s.stage} t={t} u={progress} angle={s.angle} beat={Math.max(0,f-s.first)}/>
    <defs>
      <linearGradient id="qlTop" x1="0" x2="0" y1="0" y2="1"><stop stopColor={ink} stopOpacity=".95"/><stop offset="1" stopColor={ink} stopOpacity="0"/></linearGradient>
      <linearGradient id="qlBottom" x1="0" x2="0" y1="0" y2="1"><stop stopColor={ink} stopOpacity="0"/><stop offset=".43" stopColor={ink} stopOpacity=".91"/><stop offset="1" stopColor={ink}/></linearGradient>
    </defs>
    <rect width="1080" height="391" fill="url(#qlTop)"/>
    <rect y="1338" width="1080" height="582" fill="url(#qlBottom)"/>
    {!big&&<>
      <rect x="65" y="103" width={Math.min(826,53+tag.length*15.2)} height="51" rx="6" fill="#171b26" stroke="#b38364" strokeWidth="2" opacity=".91"/>
      <text x="84" y="136" fill="#ebc5a1" fontSize="24" letterSpacing="1.6" {...monoStyle}>{tag}</text>
      {s.label&&<CaptionLabel x={65} y={221} size={s.label.length>35?42:52} align="start">{s.label}</CaptionLabel>}
    </>}
    {caption?.lines.map((line,i)=><text key={i} x="522" y={1546+i*62} textAnchor="middle" fill="#fff4e6"
      stroke="#10131c" strokeWidth="10" strokeLinejoin="round" paintOrder="stroke" fontSize="49" fontWeight="760"
      fontFamily={FONT.title}>{line}</text>)}
  </g>;
};
