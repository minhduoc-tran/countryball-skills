import React from 'react';
import { rnd } from '../../engine';
import { Art, Atmosphere, CaptionLabel, Debris, DustHit, Soldier, Waves, gold, ink, mix, step } from './art-kit';

const brokenArch='M-180 1118V711H50V633H162V551H301V482H411V402H575V474H644L700 579H814V610H955V702H1260V1120Z';

export const GateArt:React.FC<Art>=({t,u,stage,angle})=>{
  const z=angle===0?1:angle===1?1.30:1.64;
  const dig=stage==='dig'||stage==='rescue';
  const slab=stage==='slab'||angle===2;
  const x=slab?500:angle===1?397:540;
  const fall=stage==='pre'?0:stage==='impact'?step(t,5,42):1;
  return <>
    <Atmosphere tone="fire" t={t}/>
    <g transform={`translate(540 915) scale(${z+u*.07}) translate(${-x} -915)`}>
      <path d="M-300 730Q0 586 240 710T1340 657V1540H-300Z" fill="#493542"/>
      <path d={brokenArch} fill="url(#qlBrick)" stroke="#25202a" strokeWidth="11"/>
      <path d="M330 1152V870a211 211 0 0 1 422 0v282" fill="#211f29" stroke="#986d5a" strokeWidth="15"/>
      <path d="M-230 1072Q270 1026 600 1109T1300 1100V1780H-230Z" fill="url(#qlEarth)"/>
      <path d="M266 1131l104-99 73-9 56-71 95 53 59-48 101 104 98 77-38 91H290Z" fill="#45353a"/>
      <g transform={`translate(0 ${-(1-fall)*250}) rotate(${(1-fall)*-19} 547 1030)`}>
        <path d="m341 1006 82-93 265 21 93 112-37 58-361-20Z" fill="#82736b" stroke="#211e28" strokeWidth="10"/>
        <path d="m421 922 93 88 99-4 49 79m26-148-67 63" fill="none" stroke="#504345" strokeWidth="8"/>
      </g>
      {slab && <g>
        <path d="M370 1110q146 24 300-3l-16 190H384Z" fill="#191722" stroke="#7b5b52" strokeWidth="7"/>
        <ellipse cx="520" cy="1183" rx="126" ry="115" fill="url(#qlLamp)" opacity=".25"/>
        {[437,507,574].map((xx,i)=><g key={xx} opacity=".52">
          <ellipse cx={xx} cy={1220+i%2*13} rx="24" ry="27" fill="#564a49"/>
          <path d={`M${xx-26} ${1217+i%2*13}q26-38 52 0`} stroke="#8b7767" strokeWidth="7" fill="none"/>
        </g>)}
      </g>}
      <Debris y={1080}/>
      {dig && <>
        <Soldier id="qlDig1" x={289+u*64} y={1068} r={81} t={t} mood="worried" tilt={13}/>
        <Soldier id="qlDig2" x={806-u*65} y={1091} r={71} t={t+16} mood="worried" tilt={-8} look={-.8}/>
        <path d={`M390 1109l${76+Math.sin(t*.16)*28} -95 12 8-66 112Z`} fill="#ac8165" stroke={ink} strokeWidth="7"/>
      </>}
      <DustHit x={stage==='impact'?555:890} y={1059} age={stage==='impact'?t-10:t-29} scale={stage==='impact'?2.0:.8}/>
    </g>
  </>;
};

export const TrenchArt:React.FC<Art>=({t,u,stage,angle})=>{
  const flooded=stage==='flood';
  const scale=angle===2?1.37:1+u*.055;
  const water=1290-u*178;
  return <>
    <Atmosphere tone={flooded?'night':'fire'} t={t}/>
    <g transform={`translate(540 1010) scale(${scale}) translate(-540 -1010)`}>
      <path d="M-250 830H220L309 906 379 1258H702L784 894 859 835H1340V1690H-250Z" fill="url(#qlEarth)" stroke="#201d27" strokeWidth="12"/>
      <path d="M206 839l80 79 80 318m512-385-72 82-79 299" stroke="#9b6c51" strokeWidth="22" fill="none"/>
      {[937,1010,1093,1170].map(y=><path key={y} d={`M${302+(y-900)*.23} ${y}h36M${785-(y-900)*.22} ${y}h40`} stroke="#b68a5e" strokeWidth="13"/>)}
      {flooded?<>
        <path d={`M348 ${water}Q520 ${water-14} 740 ${water+4}l-31 150H378Z`} fill="#2d6479" opacity=".91"/>
        <Waves t={t} y={water} h={115} night/>
        <Soldier id="qlWet" x={506+42*u} y={water-42} r={85} t={t} mood="worried" shadow={false}/>
        {Array.from({length:41},(_,i)=>{
          const x=(rnd(400,i)*1230-t*5+12000)%1230,y=(rnd(401,i)*1630+t*17)%1630;
          return <path key={i} d={`M${x} ${y}l-14 51`} stroke="#c5dfec" strokeWidth="2" opacity=".28"/>;
        })}
      </>:<>
        <path d="M82 809q91 94 167 0m547 15q82 101 168 0" fill="none" stroke="#28212a" strokeWidth="20"/>
        <Soldier id="qlMove" x={mix(150,638,u)} y={850+101*Math.sin(Math.PI*u)} r={63} t={t} mood="determined" shadow={false} tilt={10}/>
        <DustHit x={846} y={820} age={t-11} scale={1.25}/>
      </>}
    </g>
  </>;
};

export const SchoolArt:React.FC<Art>=({t,u,stage,angle})=>{
  const war=stage!=='before';
  return <>
    <Atmosphere tone={war?'fire':'day'} t={t}/>
    {angle===2?<g transform={`translate(${-20*u} 0)`}>
      <path d="M0 390h1080v900H0Z" fill={war?'#3c2c30':'#a17d65'}/>
      <path d="M0 392h1080L715 690H400Z" fill="#403238"/>
      <path d="M0 1290h1080L713 927H385Z" fill={war?'#594447':'#7c5b48'}/>
      <path d="M94 540h242v533H94Z M772 538h215v537H772Z" fill="#17232c" stroke="#ad7f61" strokeWidth="15"/>
      <path d="M424 691h245v256H424Z" fill="#21242a"/>
      {war&&<Soldier id="qlSchoolPost" x={545} y={1019} r={142} t={t} mood="worried"/>}
    </g>:<g transform={`translate(540 920) scale(${angle===1?1.23:1+u*.06}) translate(-540 -920)`}>
      <path d="M-140 823 70 662H1011l210 163Z" fill="#754438" stroke="#27212a" strokeWidth="12"/>
      <rect x={-65} y={821} width="1210" height="401" fill={war?'#71524b':'#b39174'}/>
      {[78,276,666,862].map((x,i)=><g key={x}>
        <rect x={x} y={916} width="139" height="180" fill="#333c43" stroke="#513a39" strokeWidth="9"/>
        <path d={war&&i%2===0?`M${x} 922l139 113-139 30Z`:`M${x+69} 922v165m-63-83h124`} fill={war?'#211f26':'none'} stroke="#94775f" strokeWidth="9"/>
      </g>)}
      <rect x="454" y="915" width="173" height="307" fill="#2c282b"/>
      <rect x="363" y="753" width="351" height="69" rx="3" fill="#352d32" stroke="#b99870" strokeWidth="6"/>
      <CaptionLabel y={798} size={37}>TRƯỜNG BỒ ĐỀ</CaptionLabel>
      <path d="M-100 1210H1170V1650H-100Z" fill="url(#qlEarth)"/>
      {war?<><Debris y={1198}/><Soldier id="qlSchool" x={405+u*70} y={1192} r={92} t={t} mood="determined"/><DustHit x={882} y={1190} age={t-25} scale={.8}/></>:
        [280,455,674].map((x,i)=><Soldier key={x} id={`qlPupil${i}`} x={x+u*74} y={1237+i*14} r={41+i*4} t={t+i*10} side="civil"/>)}
    </g>}
  </>;
};

export const BreachArt:React.FC<Art>=({t,u,stage,angle})=>{
  const flame=stage==='fire';
  const push=step(t,10,66);
  return <>
    <Atmosphere tone="fire" t={t}/>
    <path d="M0 988Q436 846 1080 947V1810H0Z" fill="url(#qlEarth)"/>
    <g transform={`translate(540 980) scale(${angle===2?1.37:1.04+u*.08}) translate(-540 -980)`}>
      <path d="M-120 555 160 518 245 601 335 552 455 687 398 788 465 884 382 966 400 1108H-120Z M730 625l96-106 81 53 50-90 270 34V1110H687l59-111-69-56 96-112-49-75Z" fill="url(#qlBrick)" stroke="#2b222b" strokeWidth="13"/>
      <Debris y={1080} seed={88}/>
      {flame?<g transform={`translate(${mix(870,610,push)} 1015)`}>
        <rect x="-158" y="44" width="310" height="79" rx="37" fill="#25272d" stroke="#171922" strokeWidth="10"/>
        {[-100,-40,20,80].map(x=><circle key={x} cx={x} cy="86" r="24" fill="#66654d"/>)}
        <path d="M-162 55l42-81h244l37 78Z" fill="#7b7858" stroke="#211f27" strokeWidth="8"/>
        <path d="M-70-25l35-61h114l36 64Z M-58-65h-157v22h157Z" fill="#67684f" stroke="#211f27" strokeWidth="8"/>
        {t>17 && <path d={`M-218 -57Q-297 -83 ${-319-u*128} ${-111-20*Math.sin(t*.4)} Q${-384-u*102} -22 -218 -49Z`} fill="#fa9447" opacity=".88"/>}
      </g>:<Soldier id="qlAttack" x={mix(750,570,push)} y={1009} r={angle===2?100:85} t={t} side="rvn" mood="determined" look={-.8}/>}
      <Soldier id="qlBreach" x={angle===0?272:376} y={1148} r={angle===2?106:88} t={t+6} mood="determined"/>
      <DustHit x={510} y={1033} age={t-33} scale={.65}/>
    </g>
  </>;
};
