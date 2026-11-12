import React from 'react';
import { rnd } from '../../engine';
import { Art, Atmosphere, CaptionLabel, Debris, DustHit, PathArrow, Soldier, cream, gold, ink, mix, monoStyle, step, titleStyle } from './art-kit';

const Receiver:React.FC<{x:number;y:number;s:number;t:number;on:boolean}>=({x,y,s,t,on})=>(
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-247-110l47-54h403l43 54v246h-493Z" fill="#4f5948" stroke="#171920" strokeWidth="13"/>
    <rect x="-244" y="-108" width="490" height="248" rx="14" fill="#737862" stroke="#1c2125" strokeWidth="12"/>
    <rect x="-211" y="-78" width="264" height="94" rx="8" fill="#1d2b28" stroke="#353931" strokeWidth="8"/>
    {on&&<path d={`M-190 -34h30l25 ${-13*Math.sin(t*.4)} 32 ${15*Math.sin(t*.4)} 30 -10 28 14 29 -11h46`} fill="none" stroke="#b8e6a0" strokeWidth="6"/>}
    <circle cx="132" cy="-34" r="45" fill="#343c37" stroke="#242a2b" strokeWidth="9"/>
    <path d={`M132 -35l${26*Math.sin(t*.025)} ${-27*Math.cos(t*.025)}`} stroke="#c8bd92" strokeWidth="6"/>
    <circle cx="194" cy="67" r="11" fill={on?'#eabd6b':'#323b3b'}/>
    <path d="M-201 60h132m-132 19h132m-132 18h132" stroke="#3e483d" strokeWidth="7"/>
    <path d="M-111-166v-34h188v34m-31 309q6 116 130 129" stroke="#242525" strokeWidth="11" fill="none"/>
  </g>
);

export const RadioArt:React.FC<Art>=({stage,t,u,angle})=>{
  const out=stage==='antenna', signal=stage==='signal', power=stage==='power', dry=stage==='dry', off=stage==='off';
  const z=angle===2?1.35:angle===1?1.13:1;
  const dead=off&&u>.56;
  return <>
    <Atmosphere tone={out?'fire':'room'} t={t}/>
    {signal?<g>
      <path d="M109 764Q498 648 968 896v411q-384-185-860-41Z" fill="#273f49"/>
      <PathArrow d="M269 946Q542 632 816 946" color={gold} u={u} dash/>
      <Receiver x={260} y={939} s={.67} t={t} on/>
      <Receiver x={823} y={939} s={.67} t={t+6} on/>
      <CaptionLabel x={260} y={1144} size={33}>TRONG THÀNH</CaptionLabel>
      <CaptionLabel x={823} y={1144} size={33}>CHỈ HUY B5</CaptionLabel>
    </g>:out?<g>
      <path d="M0 1115l203-106 186 47 105-137 113 69 124-112 349 167v671H0Z" fill="url(#qlEarth)"/>
      <path d="M0 1062l141-29 87-89 138 81 66-81 164 101-36 107H0Z" fill="url(#qlBrick)" stroke="#312932" strokeWidth="10"/>
      <g transform={`rotate(${Math.sin(t*.1)*3} 641 1130)`}>
        <path d="M632 1180l22-596m-103 50 208 15m-140 52 75 6" stroke="#c7b4a2" strokeWidth="10"/>
        {[0,1,2].map(i=><circle key={i} cx="651" cy="585" r={50+(u*78+i*77)%225} fill="none" stroke={gold} opacity={.32-i*.064} strokeWidth="5"/>)}
      </g>
      <Soldier id="qlAntenna" x={630} y={1135} r={132} t={t} mood="worried" shadow={false}/>
      <path d="M685 1160q41 40 61 84t119 32" stroke="#23242a" strokeWidth="8" fill="none"/>
      <DustHit x={892} y={1088} age={t-30} scale={.9}/>
      <Debris y={1181}/>
    </g>:<g transform={`translate(540 937) scale(${z+u*.07}) translate(-540 -937)`}>
      <path d="M0 582Q527 332 1080 596V1500H0Z" fill="#27232b" stroke="#735143" strokeWidth="14"/>
      <path d="M0 644l246-192m782 187L816 448m-401-3h252" stroke="#6e584d" strokeWidth="26"/>
      {!dead&&<ellipse cx="506" cy="786" rx="455" ry="465" fill="url(#qlLamp)"/>}
      <path d="M0 1179H1080v477H0Z" fill="#352d31"/>
      {power&&<g transform="translate(777 1138)">
        <rect x="-105" y="-85" width="220" height="133" rx="9" fill="#8a7450" stroke="#242229" strokeWidth="10"/>
        <path d="M-60-85v-18m134 18v-18m-140 67h36m82 0h40m-19-20v37" stroke="#e1c994" strokeWidth="8"/>
        <path d="M-58-103q-96-90-161 7" fill="none" stroke="#22252a" strokeWidth="9"/>
      </g>}
      {angle!==2&&!power&&<Soldier id="qlRadio" x={232} y={1066} r={111} t={t} mood={off?'sad':'determined'}/>}
      {dry&&<g transform="translate(800 1128)">
        <ellipse rx="84" ry="55" fill="url(#qlLamp)" transform="scale(2)"/>
        <path d={`M-51 21Q-76 -12 -28 -57L-13 -17Q23 ${-81-18*Math.sin(t*.3)} 41 -18Q61 0 40 21Z`} fill="#ffa958"/>
      </g>}
      <Receiver x={angle===2?540:584} y={1029} s={angle===2?1.20:1.04} t={t} on={!dead}/>
    </g>}
  </>;
};

export const SupplyArt:React.FC<Art>=({stage,t,u,angle})=>{
  const rice=stage==='rice', well=stage==='well';
  const z=angle===2?1.27:1+u*.12;
  return <>
    <Atmosphere tone={well?'night':'room'} t={t}/>
    <ellipse cx="552" cy="965" rx="550" ry="570" fill="url(#qlLamp)"/>
    <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
      {rice?<g>
        <ellipse cx="545" cy="1020" rx="393" ry="234" fill="#4e4334" stroke="#26202b" strokeWidth="14"/>
        <path d="M264 1046q74-235 268-283t299 255q-218 190-567 28Z" fill="#e9d4ae" stroke="#8c7156" strokeWidth="12"/>
        {Array.from({length:47},(_,i)=><ellipse key={i} cx={360+rnd(91,i)*388} cy={863+rnd(92,i)*183} rx="14" ry="6" transform={`rotate(${-45+rnd(93,i)*90} ${360+rnd(91,i)*388} ${863+rnd(92,i)*183})`} fill={i%3===0?'#b49976':'#f5dfba'}/>)}
      </g>:well?<g>
        <ellipse cx="539" cy="995" rx="344" ry="208" fill="#645246" stroke="#2b262f" strokeWidth="20"/>
        <ellipse cx="539" cy="921" rx="311" ry="161" fill="url(#qlBrick)" stroke="#a68064" strokeWidth="15"/>
        <ellipse cx="539" cy="917" rx="253" ry="114" fill="#142a36"/>
        <path d={`M532 561v${278+96*u}`} stroke="#ccb38b" strokeWidth="9"/>
        <g transform={`translate(532 ${855+96*u})`}><path d="M-73 0l20 96h106L74 0Z" fill="#827661" stroke="#24242a" strokeWidth="9"/><ellipse rx="73" ry="16" fill="#475956"/></g>
      </g>:<g>
        <ellipse cx="537" cy="1181" rx="395" ry="171" fill="#38596b" opacity=".92"/>
        <ellipse cx="537" cy="1181" rx={88+u*232} ry={28+u*57} stroke="#b6c0b1" strokeWidth="7" opacity=".35" fill="none"/>
        <g transform={`translate(540 ${815+165*u})`}>
          <path d="M-184 0l31 231q161 41 313 0l27-231Z" fill="#8c7956" stroke="#25252b" strokeWidth="13"/>
          <ellipse rx="185" ry="48" fill="#aca17c" stroke="#312e33" strokeWidth="12"/>
          <ellipse rx="148" ry="31" fill={u>.49?'#577e87':'#393a36'}/>
          <path d="M-147 86h301m-287 97h269" stroke="#6c5f49" strokeWidth="13"/>
          {[-81,-21,47,112].map((x,i)=><circle key={i} cx={x} cy={222+Math.sin(i)*7} r="8" fill="#403a37"/>)}
        </g>
      </g>}
    </g>
  </>;
};

export const LetterArt:React.FC<Art>=({stage,t,u,angle})=>{
  const route=stage==='route',home=stage==='home',x=angle===2?665:540;
  return <>
    <Atmosphere tone={home?'fire':'room'} t={t}/>
    <ellipse cx="524" cy="845" rx="630" ry="595" fill="url(#qlLamp)"/>
    <g transform={`translate(${x} 897) rotate(${-7+u*2}) scale(${angle===2?1.24:1})`}>
      <path d="M-343-360l702-8 24 739-725 8Z" fill="#31282a" opacity=".8" transform="translate(20 28)"/>
      <path d="M-343-360l702-8 24 739-725 8Z" fill="#d6bd92" stroke="#8d7254" strokeWidth="9"/>
      <path d="M-259-359v733" stroke="#b47e68" strokeWidth="3" opacity=".55"/>
      {Array.from({length:15},(_,i)=><path key={i} d={`M-327 ${-288+i*43}h672`} stroke="#a29174" strokeWidth="2" opacity=".42"/>)}
      <text x="-222" y="-269" fill="#493331" fontSize="36" {...titleStyle}>11 THÁNG 9, 1972</text>
      {route?<g>
        <path d="M-320 100q162-108 320-32t367-49v113q-165 88-343 38t-344 34Z" fill="#7c9fa3" opacity=".65"/>
        <PathArrow d="M215 253Q102 102-111 -115" u={u} color="#97493f"/>
        <CaptionLabel x={206} y={276} size={26}>THỊ XÃ</CaptionLabel>
        <CaptionLabel x={-105} y={-126} size={26}>BÊN KIA SÔNG</CaptionLabel>
      </g>:<g stroke="#624b45" strokeWidth="5" strokeLinecap="round" fill="none">
        {Array.from({length:9},(_,i)=><path key={i} opacity={.39+.6*step(u,0,.12+i*.08)} d={`M-209 ${-179+i*49}q16-19 39-7t45 2 49 1 49 5 39 0 55 1 54-4 ${65+(i%4)*23} -2`}/>)}
      </g>}
      {!route&&!home&&<path d={`M${-170+u*390} ${-82+u*120}l145-257 18 8-129 267-39 36Z`} fill="#302e36" stroke="#1c1a25" strokeWidth="8"/>}
    </g>
    <CaptionLabel y={1331} size={26}>{route?'SƠ ĐỒ MINH HỌA LỜI DẶN':'MINH HỌA LÁ THƯ · LÊ VĂN HUỲNH'}</CaptionLabel>
  </>;
};

export const PersonArt:React.FC<Art>=({stage,t,u,angle})=>{
  const two=stage==='thao'&&angle===2;
  return <>
    <Atmosphere tone="room" t={t}/>
    <ellipse cx="588" cy="862" rx="490" ry="600" fill="url(#qlLamp)"/>
    <g transform={`translate(0 ${-u*29})`}>
      <Soldier id="qlPortrait" x={two?325:540} y={991} r={two?144:angle===1?274:220} t={t} mood={stage==='thao'?'sad':'determined'} look={.22} />
      {two&&<Soldier id="qlPortrait2" x={753} y={991} r={144} t={t+20} look={-.25}/>}
    </g>
    <CaptionLabel y={1290} size={53}>{stage==='chien'?'HOÀNG CHIẾN':two?'HOÀNG CHIẾN · HOÀNG VĂN THAO':'HOÀNG VĂN THAO'}</CaptionLabel>
    <CaptionLabel y={1350} size={29}>ĐẠI ĐỘI 6 · TRUNG ĐOÀN 95</CaptionLabel>
  </>;
};
