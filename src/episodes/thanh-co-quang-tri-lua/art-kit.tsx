import React from 'react';
import { FONT, rnd } from '../../engine';
import { Ball, NonLa } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe } from '../../countryball/ball-motion';

export type Art = {stage: string; t: number; u: number; angle: number; beat: number};
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const step = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const mix = (a: number, b: number, u: number) => a + (b - a) * u;
export const titleStyle = {fontFamily: FONT.title, fontWeight: 800} as const;
export const monoStyle = {fontFamily: FONT.ui, fontWeight: 400} as const;
export const cream = '#f1e0c5';
export const gold = '#ffbb73';
export const ink = '#141621';

export const Atmosphere: React.FC<{tone?: 'fire' | 'night' | 'day' | 'room'; t?: number}> = ({tone='night', t=0}) => {
  const [a,b] = {fire:['#302038','#a5533f'],night:['#11192c','#31445c'],day:['#3e5060','#b8a07d'],room:['#161620','#513526']}[tone];
  return <>
    <defs>
      <linearGradient id="qlSky" x1="0" x2="0" y1="0" y2="1"><stop stopColor={a}/><stop offset=".65" stopColor={b}/><stop offset="1" stopColor={ink}/></linearGradient>
      <radialGradient id="qlLamp"><stop stopColor="#ffd298" stopOpacity=".53"/><stop offset="1" stopColor="#ffd298" stopOpacity="0"/></radialGradient>
      <linearGradient id="qlEarth" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#544038"/><stop offset="1" stopColor="#1c1a24"/></linearGradient>
      <linearGradient id="qlWater" x1="0" x2="1" y1="0" y2=".8"><stop stopColor="#40697a"/><stop offset="1" stopColor="#122537"/></linearGradient>
      <pattern id="qlBrick" width="92" height="46" patternUnits="userSpaceOnUse">
        <rect width="92" height="46" fill="#704c44"/><path d="M0 0H92M0 23H92M45 0V23M0 23V46" stroke="#443136" strokeWidth="4"/>
      </pattern>
    </defs>
    <rect width="1080" height="1920" fill="url(#qlSky)"/>
    {tone !== 'room' && Array.from({length:8},(_,i)=><ellipse key={i} cx={-70+i*178+18*Math.sin(t*.017+i)} cy={430+i%4*150} rx={147} ry={46+i%3*29} fill={a} opacity=".23"/>)}
  </>;
};

export const Soldier: React.FC<{id:string;x:number;y:number;r:number;t:number;side?:'vn'|'rvn'|'civil'; mood?:'normal'|'worried'|'determined'|'sad'; tilt?:number;look?:number;shadow?:boolean}> =
({id,x,y,r,t,side='vn',mood='normal',tilt=0,look=.6,shadow=true}) => (
  <Ball id={id} x={x} y={y} r={r} flag={side==='rvn'?'RVN':'VNM'} eyes={mood} look={look} tilt={tilt}
    hat={side==='vn'?<MuCoi/>:side==='civil'?<NonLa/>:undefined} shadow={shadow} motion={breathe(t,69,.022)}/>
);

export const CaptionLabel:React.FC<{x?:number;y:number;children:React.ReactNode;size?:number;align?:'start'|'middle'|'end'}>=({x=540,y,children,size=31,align='middle'})=>(
  <text x={x} y={y} textAnchor={align} fill={cream} fontSize={size} paintOrder="stroke" stroke={ink} strokeWidth={7} strokeLinejoin="round" {...titleStyle}>{children}</text>
);

export const PathArrow:React.FC<{d:string;color?:string;u:number;dash?:boolean}>=({d,color=gold,u,dash=false})=>(
  <g fill="none">
    <path d={d} stroke={ink} strokeWidth={20} strokeLinecap="round" opacity=".8"/>
    <path d={d} pathLength={100} stroke={color} strokeWidth={9} strokeLinecap="round" strokeDasharray={dash?'5 3':`${Math.max(2,u*100)} 100`} strokeDashoffset={dash?-u*27:0}/>
  </g>
);

export const DustHit:React.FC<{x:number;y:number;age:number;scale?:number;seed?:number}>=({x,y,age,scale=1,seed=11})=>{
  if(age<0||age>52)return null;
  const p=age/52;
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {age<8 && <ellipse rx={82+age*13} ry={44+age*7} fill="#ffe2a4" opacity={(1-age/8)*.75}/>}
    {Array.from({length:11},(_,i)=>{
      const dx=(rnd(seed,i)-.5)*295*Math.sqrt(p),dy=-p*(55+rnd(seed+1,i)*175);
      return <circle key={i} cx={dx} cy={dy} r={27+65*p+rnd(seed+2,i)*40} fill={i%3===0?'#b68766':'#5a4650'} opacity={(1-p)*.50}/>;
    })}
    {Array.from({length:9},(_,i)=><path key={i} d={`M${(rnd(seed,i)-.5)*450*p} ${-Math.sin(p*Math.PI)*(140+rnd(seed+7,i)*132)}l15 -6 8 13-19 5Z`} fill="#bd8a62" opacity={1-p}/>)}
  </g>;
};

export const Debris:React.FC<{y:number;n?:number;seed?:number}>=({y,n=28,seed=19})=>(
  <>{Array.from({length:n},(_,i)=>{
    const x=rnd(seed,i)*1130-25, yy=y+rnd(seed+1,i)*330, s=9+rnd(seed+2,i)*30;
    return <path key={i} d={`M${x} ${yy}l${s} ${-s*.4} ${s*.7} ${s*.6} -${s*.8} ${s*.5}Z`} fill={['#6d5149','#2c2631','#896355'][i%3]}/>;
  })}</>
);

export const Waves:React.FC<{t:number;y?:number;h?:number;night?:boolean}>=({t,y=450,h=1100,night=false})=>(
  <>{Array.from({length:28},(_,i)=>{
    const x=(rnd(56,i)*1290+t*(1+rnd(58,i)))%1290-115, yy=y+rnd(57,i)*h;
    return <path key={i} d={`M${x} ${yy}q34 -10 72 0t70 1`} fill="none" stroke={night?'#83a6b1':'#d2c2a0'} strokeWidth={3+rnd(59,i)*3} opacity={.1+rnd(60,i)*.26}/>;
  })}</>
);
