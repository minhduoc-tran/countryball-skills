import React from 'react';
import { rnd } from '../../engine';
import { Art, Atmosphere, CaptionLabel, DustHit, PathArrow, Soldier, Waves, cream, gold, ink, mix, monoStyle, step, titleStyle } from './art-kit';

const river='M-94 561C164 535 128 980 302 1060S546 792 680 701 833 670 1152 362';
const coast='M617-90C641 207 799 404 894 601S944 1017 1180 1376V1940H-45V-90Z';

export const RegionArt:React.FC<Art>=({stage,t,u,angle})=>{
  const spring=stage==='spring', counter=stage==='counter';
  const z=1+angle*.11+u*.055;
  return <>
    <rect width="1080" height="1920" fill="#142735"/>
    <defs>
      <pattern id="qlMapGrid" width="49" height="49" patternUnits="userSpaceOnUse"><path d="M49 0H0V49" stroke="#d2d2b4" strokeOpacity=".11" fill="none"/></pattern>
    </defs>
    <g transform={`translate(540 830) scale(${z}) translate(-540 -830)`}>
      <path d={coast} fill="#455346" stroke="#7e9e9b" strokeWidth="6"/>
      <path d="M-30 375 186 325 327 397 303 530 219 586 311 696 195 846 255 946 144 1052 287 1169 176 1472H-50Z" fill="#313e36"/>
      <rect width="1080" height="1920" fill="url(#qlMapGrid)"/>
      <path d={river} fill="none" stroke="#759ca7" strokeWidth="19"/>
      <path d="M127 1263q192-114 399-63t367-149" fill="none" stroke="#73929c" strokeWidth="9"/>
      <path d="M310 342 422 642 526 858 631 1107 813 1352M137 664l285-22" stroke="#e6d2a5" strokeWidth="5" strokeDasharray="14 11" fill="none"/>
      <CaptionLabel x={113} y={864} size={27} align="start">THẠCH HÃN</CaptionLabel>
      <CaptionLabel x={790} y={535} size={27} align="start">BIỂN ĐÔNG</CaptionLabel>
      {[[422,642,'Đông Hà'],[526,858,'Thành cổ'],[631,1107,'Mỹ Chánh'],[813,1352,'Huế']].map(([x,y,s],i)=><g key={s}>
        {i===1&&<circle cx={x} cy={y} r={25+10*Math.sin(t*.064)} fill="#ffcb7e" opacity=".24"/>}
        <circle cx={x} cy={y} r={i===1?12:7} fill={i===1?gold:cream} stroke={ink} strokeWidth="4"/>
        <CaptionLabel x={Number(x)+22} y={Number(y)+11} size={i===1?38:28} align="start">{s}</CaptionLabel>
      </g>)}
      {spring&&<>
        <PathArrow d="M274 396Q333 544 415 619T490 816" u={u} color="#ef8268"/>
        <PathArrow d="M98 634Q244 654 388 648" u={u} color="#ef8268"/>
        <Soldier id="qlSpring" x={309+73*u} y={578} r={52} t={t}/>
      </>}
      {counter&&<>
        <PathArrow d="M610 1125Q535 1077 475 911" u={u} />
        <PathArrow d="M744 1160Q775 1004 635 886" u={u}/>
        <Soldier id="qlCounter" x={693-67*u} y={1024} r={53} t={t} side="rvn"/>
      </>}
    </g>
    <text x={75} y={1420} fill="#b8c6bd" fontSize="24" {...monoStyle}>SƠ ĐỒ KHÁI LƯỢC</text>
  </>;
};

const forts:Record<string,readonly [number,number,string][]>={
  posts:[[535,574,'BẮC'],[809,859,'ĐÔNG'],[536,1130,'NAM'],[254,860,'TÂY']],
  sectors:[[192,1025,'BỒ ĐỀ'],[800,587,'ĐÔNG BẮC'],[760,1126,'ĐÔNG NAM']],
  northeast:[[798,585,'CHỐT ĐÔNG BẮC'],[761,1126,'ĐÔNG NAM']],
};

export const FortArt:React.FC<Art>=({stage,t,u,angle})=>{
  const markers=forts[stage]??forts.sectors;
  if(stage==='counts')return <>
    <Atmosphere tone="room" t={t}/>
    <text x="540" y="655" fill={gold} textAnchor="middle" fontSize="222" {...titleStyle}>~20</text>
    <CaptionLabel y={755} size={45}>TAY SÚNG CỦA TIỂU ĐOÀN BA</CaptionLabel>
    <CaptionLabel y={810} size={28}>THEO HỒI ỨC ĐƠN VỊ · 14/09</CaptionLabel>
    {Array.from({length:20},(_,i)=><Soldier key={i} id={`qlCount${i}`} x={218+i%5*161} y={935+Math.floor(i/5)*110} r={35} t={t+i*4} mood="determined" shadow={false}/>)}
  </>;
  const z=angle===1?1.22:angle===2?1.38:1+u*.045;
  const cx=stage==='northeast'?666:540;
  return <>
    <rect width="1080" height="1920" fill="#192832"/>
    <g transform={`translate(540 835) scale(${z}) translate(${-cx} -835)`}>
      <path d="M-130 343Q243 431 164 739T137 1285Q254 1516 221 1690H-130Z" fill="#3e6570"/>
      <path d="M177 859h70m548 0h204M534 493v83m0 546v201" stroke="#a58d6f" strokeWidth="16" opacity=".62"/>
      <path d="M300 543H776L838 610V1108L775 1166H296L225 1106V615Z" fill="#405059" stroke="#537c88" strokeWidth="44"/>
      <path d="M313 591H760L793 626V1090L756 1120H318L272 1090V628Z" fill="#4d4940" stroke="#b38360" strokeWidth="28"/>
      <path d="M319 706h425m-420 122h419m-419 141h419M419 609v502m109-502v502m124-502v502" stroke="#88735a" strokeWidth="3" strokeDasharray="12 14" opacity=".68"/>
      <CaptionLabel y={869} size={48}>THÀNH CỔ</CaptionLabel>
      <CaptionLabel x={123} y={526} size={27}>THẠCH HÃN</CaptionLabel>
      {markers.map(([x,y,label],i)=><g key={label} opacity={.45+.55*step(u,0,.25+i*.08)}>
        <circle cx={x} cy={y} r={18+8*Math.sin(t*.09+i)} fill={gold} opacity=".45"/>
        <circle cx={x} cy={y} r="9" fill={gold}/>
        <CaptionLabel x={x} y={y-34} size={29}>{label}</CaptionLabel>
      </g>)}
      {stage==='northeast'&&<PathArrow d="M932 431Q886 471 811 578" u={u} color="#e48261"/>}
      {stage==='sectors'&&<PathArrow d="M48 1264Q101 1130 193 1035" u={u} color="#e48261"/>}
    </g>
    <text x={76} y={1420} fill="#b8c6bd" fontSize="23" {...monoStyle}>SƠ ĐỒ VỊ TRÍ TƯƠNG ĐỐI</text>
  </>;
};

export const CrossingArt:React.FC<Art>=({stage,t,u,angle})=>{
  const night=!['day','bank'].includes(stage);
  const drift=stage==='drift', back=stage==='withdraw', bank=stage==='bank';
  const overhead=angle!==1;
  const east=back?1-u:u;
  const x=bank?mix(696,884,u):mix(255,805,east);
  const flow=drift?u*250:0;
  return <>
    <Atmosphere tone={night?'night':'day'} t={t}/>
    {overhead?<>
      <path d="M0 0H1080V1740H0Z" fill={night?'#26383c':'#726d4f'}/>
      <path d="M330 0H888Q975 447 800 840T763 1620l87 300H221Q156 1550 242 1160T330 0Z" fill="url(#qlWater)" stroke={night?'#4c6372':'#86937b'} strokeWidth="8"/>
      <g opacity=".74"><Waves t={t} y={376} h={1070} night={night}/></g>
      <CaptionLabel x={157} y={611} size={30}>BỜ BẮC</CaptionLabel>
      <CaptionLabel x={909} y={1030} size={30}>BỜ NAM</CaptionLabel>
      <PathArrow d={back?'M794 910Q602 780 293 754':'M295 776Q515 811 796 904'} u={u} color="#c3d9d6" dash/>
    </>:<>
      <path d="M0 895 196 767 459 843 610 753 1080 799V1550H0Z" fill={night?'#243340':'#5d6654'}/>
      <path d="M0 934Q526 872 1080 1023V1900H0Z" fill="url(#qlWater)"/>
      <Waves t={t} y={961} h={459} night={night}/>
      <path d="M0 1375q182-103 421 3v260H0Z M1080 1244q-149-42-315 138v162h315Z" fill={night?'#262d35':'#6b624e'}/>
    </>}
    {Array.from({length:drift?1:4},(_,i)=>{
      const xx=x+(back?1:-1)*i*(overhead?66:87), yy=(overhead?817:1045)+flow+i*(overhead?43:25)+Math.sin(t*.15+i)*8;
      return <g key={i}>
        <ellipse cx={xx} cy={yy+46} rx={overhead?62:76} ry={19} fill="none" stroke="#acc5c4" strokeWidth="5" opacity=".42"/>
        {night&&<path d={`M${xx-34} ${yy+20}q34-25 68 0v40h-68Z`} fill="#82775f" stroke="#282e36" strokeWidth="6"/>}
        <Soldier id={`qlSwim${i}`} x={xx} y={yy} r={overhead?29:44} t={t+i*3} mood="worried" look={back?-.8:.8} shadow={false} tilt={drift?12:0}/>
      </g>;
    })}
    {bank&&<DustHit x={475} y={overhead?793:1080} age={t-27} scale={1.2}/>}
  </>;
};

const Chopper:React.FC<{x:number;y:number;s:number;t:number;tilt?:number;scout?:boolean}>=({x,y,s,t,tilt=0,scout=false})=>(
  <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`} stroke="#171b23" strokeLinejoin="round">
    {scout?<g strokeWidth="6">
      <path d="M-212 10l68-31 204 6 49-16 70 18 41 26-29 13-365 0Z" fill="#81836a"/>
      <path d="M-76-12l70-46 60 1 51 51m-256 26-45-79 23 2 50 53" fill="#666f60"/>
      <path d="M94-16l43-10 43 16h-76Z" fill="#93b2b7"/>
      <path d={`M182 ${-46-Math.abs(Math.sin(t))*22}v${78+Math.abs(Math.sin(t))*44}`} stroke="#eee0b1" opacity=".51"/>
    </g>:<g strokeWidth="7">
      <path d="M-170 13l-71-54 1-47 28 1 53 70 181-20h95l75 52-19 40h-295Z" fill="#69736a"/>
      <path d="M95-25h29l51 40H94Z" fill="#98b4b5"/>
      <path d="M-104 54v27m208-26v26m-247 2h287" fill="none" stroke="#292d33" strokeWidth="12"/>
      <path d="M-41-41v-33" strokeWidth="13"/>
      <path d={`M${-41-193*Math.abs(Math.cos(t*1.8))} -76H${-41+193*Math.abs(Math.cos(t*1.8))}`} stroke="#d8c8ad" strokeWidth="7" opacity=".76"/>
    </g>}
  </g>
);

export const AirArt:React.FC<Art>=({stage,t,u,angle})=>{
  const scout=stage==='scout', loss=stage==='loss', down=loss?step(t,13,72):0;
  return <>
    <Atmosphere tone={loss?'fire':'day'} t={t}/>
    <path d="M0 1142 160 985 403 1094 623 948 1080 1068V1880H0Z" fill="#4b5347"/>
    <path d="M0 1269Q447 1090 1080 1223V1850H0Z" fill="url(#qlEarth)"/>
    {loss&&<PathArrow d="M132 1290Q260 1085 602 780" u={step(t,0,33)} color="#f3b16d"/>}
    {Array.from({length:scout||loss||angle===2?1:3},(_,i)=>
      <Chopper key={i} x={mix(340,693,u)+i*177} y={scout?615:710+i*125+down*230} s={angle===2?1.83:scout?1.12:1.22-i*.22} t={t+i*10} scout={scout} tilt={-down*21}/>)}
    {loss&&<DustHit x={573} y={786} age={t-22} scale={1.12}/>}
    <CaptionLabel y={scout?928:1307} size={43}>{scout?'OV-10 BRONCO':loss?'TRỰC THĂNG TRÚNG ĐẠN':'ĐỔ QUÂN ĐÔNG BẮC THỊ XÃ'}</CaptionLabel>
  </>;
};

export const MemorialArt:React.FC<Art>=({t,u})=>(
  <>
    <Atmosphere tone="fire" t={t}/>
    <circle cx="685" cy="673" r="148" fill="#efb27e" opacity=".73"/>
    <path d="M0 834 240 729 466 803 726 730 1080 815V1620H0Z" fill="#54404c"/>
    <path d="M0 898Q401 819 1080 948V1920H0Z" fill="url(#qlWater)"/>
    <Waves t={t} y={902} h={615}/>
    {[0,1,2,3,4,5,6,7].map((i)=>{
      const x=155+rnd(180,i)*630+u*96,y=1050+rnd(181,i)*350;
      return <g key={i} transform={`translate(${x} ${y})`}>
        <ellipse rx="33" ry="9" fill="#dfa68d" opacity=".6"/>
        <path d="M0 6Q-37 -4-25 -19Q-12 -15-6 -7Q-8-27 4-31Q19-23 12-9Q33-22 35-8Q29 5 0 6Z" fill="#f5d8bd"/>
      </g>;
    })}
  </>
);
