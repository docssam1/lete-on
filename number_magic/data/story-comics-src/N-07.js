/* N-07 — 주사위와 수직선 더하기·빼기(2026-10-06 새로 그림 — 옛 컷은 10 짝꿍이라 유닛과 어긋났다).
   유닛 story.history 그대로: 0에서 4칸, 3칸 더 → 7, 7에서 3칸 되돌아 → 4, 도미노 점도 같은 셈.
   2026-10-07 실사-2차의 개구리(frog.png)로 교체(그 전엔 토끼). 그림 속 글자는 수직선 숫자뿐. */
'use strict';
module.exports=function(H){
  const {C,svg,meadow,real,hop,txt,boy}=H;
  const X=n=>16+n*17;                       /* 수직선 0~10 */
  const line=(hi)=>{ let s='<line x1="10" y1="112" x2="192" y2="112" stroke="'+C.ink+'" stroke-width="2.4" stroke-linecap="round"/>';
    for(let n=0;n<=10;n++){ s+='<line x1="'+X(n)+'" y1="106" x2="'+X(n)+'" y2="118" stroke="'+C.ink+'" stroke-width="1.8"/>'
      +'<text x="'+X(n)+'" y="131" text-anchor="middle" font-size="10" font-weight="800" fill="'+((hi||[]).includes(n)?C.red:C.sub)+'">'+n+'</text>'; }
    return s; };
  const pip=(cx,cy)=>'<circle cx="'+cx+'" cy="'+cy+'" r="2.6" fill="'+C.red+'"/>';
  const PIPS={3:[[-6,-6],[0,0],[6,6]],4:[[-6,-6],[6,-6],[-6,6],[6,6]]};
  const die=(x,y,n)=>'<rect x="'+(x-12)+'" y="'+(y-12)+'" width="24" height="24" rx="5" fill="#fff" stroke="'+C.ink+'" stroke-width="2"/>'+PIPS[n].map(p=>pip(x+p[0],y+p[1])).join('');
  const ground='<path d="M 0 140 L 0 96 Q 100 90 200 96 L 200 140 Z" fill="'+C.grass+'" opacity=".55"/>';
  return { panels:[
    { art: svg(ground+line([0])+die(150,40,4)+boy(176,64,0.62)+real('frog',X(0)+4,108,26)),
      text:{ ko:'주사위를 굴렸더니 4가 나왔어요. 개구리는 수직선의 0에서 출발해요.',
             en:'We rolled a 4. The frog starts at 0 on the number line.',
             zh:'掷骰子掷出了4。小青蛙从数轴上的0出发。' } },
    { art: svg(ground+line([4,7])+hop(X(0),X(4),104,26)+hop(X(4),X(7),104,20)+die(50,34,4)+die(130,34,3)+real('frog',X(7),108,26)),
      text:{ ko:'0에서 4칸 폴짝, 또 3칸 폴짝! 앞으로 뛰면 더하기예요. 4 더하기 3은 7.',
             en:'Hop 4 from 0, then 3 more! Jumping forward is adding: 4 plus 3 is 7.',
             zh:'从0跳4格，再跳3格！往前跳就是加：4加3等于7。' } },
    { art: svg(ground+line([7,4])+hop(X(7),X(4),104,22,C.blue)+die(130,34,3)+real('frog',X(4),108,26,true)),
      text:{ ko:'이번엔 7에서 3칸 되돌아와요. 되돌아오면 빼기예요. 7 빼기 3은 4.',
             en:'Now hop back 3 from 7. Going back is subtracting: 7 minus 3 is 4.',
             zh:'这次从7往回跳3格。往回跳就是减：7减3等于4。' } },
    { art: svg(ground
        +'<rect x="52" y="26" width="96" height="48" rx="8" fill="#fff" stroke="'+C.ink+'" stroke-width="2.4"/><line x1="100" y1="30" x2="100" y2="70" stroke="'+C.ink+'" stroke-width="2"/>'
        +[[-14,-10],[14,-10],[-14,10],[14,10]].map(p=>pip(76+p[0]*0.8,50+p[1]*0.9)).join('')
        +[[-12,-12],[0,0],[12,12]].map(p=>pip(124+p[0]*0.9,50+p[1]*0.9)).join('')
        +txt(76,96,18,C.ink,'4')+txt(124,96,18,C.ink,'3')+txt(170,58,22,C.red,'7')),
      text:{ ko:'도미노의 점도 똑같이 셀 수 있어요. 왼쪽 4개와 오른쪽 3개를 모으면 7개예요.',
             en:'Domino dots work the same way. Four on the left and three on the right make 7.',
             zh:'多米诺骨牌上的点也一样。左边4个和右边3个合起来是7个。' } },
  ]};
};
