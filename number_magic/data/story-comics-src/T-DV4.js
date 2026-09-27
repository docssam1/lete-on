/* T-DV4 — 공약수·공배수 · 십간 10과 십이지 12가 맞물려 60년 */
'use strict';
module.exports=function(H){
  const {C,svg,arrow,txt,sage,numi}=H;
  /* 톱니바퀴 — (cx,cy) 중심, r 반지름, n 칸. 칸 수가 곧 10간·12지다 */
  /* 톱니바퀴 — 칸 수가 곧 10간·12지다. 톱니를 선으로 하나씩 그리면 한 컷에 30개가 넘어
     뭉개지므로, 둘레를 정확히 n 등분하는 점선 한 줄로 그린다(요소 2개). */
  const gear=(cx,cy,r,n,col,mark)=>{
    const step=2*Math.PI*r/n, dash=3.4;
    let s='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+col
      +'" stroke-width="9" stroke-dasharray="'+dash.toFixed(2)+' '+(step-dash).toFixed(2)+'"/>'
      +'<circle cx="'+cx+'" cy="'+cy+'" r="'+(r-4.5)+'" fill="#fff" stroke="'+col+'" stroke-width="3"/>'
      +'<circle cx="'+cx+'" cy="'+cy+'" r="'+(r-13)+'" fill="none" stroke="'+col+'" stroke-width="2.5"/>'
      +'<circle cx="'+cx+'" cy="'+cy+'" r="3.5" fill="'+col+'"/>';
    if(mark) s+='<circle cx="'+cx+'" cy="'+(cy-r)+'" r="5" fill="'+C.red+'"/>';
    return s;
  };
  return { panels:[
    { art: svg(
        gear(62,58,26,10,C.blue,true)+txt(62,106,19,C.blue,'10')
        +gear(140,58,30,12,C.gold,true)+txt(140,106,19,C.gold,'12')
        +sage(100,126,0.75)),
      text:{ ko:'해의 이름은 톱니 열 개짜리 바퀴와 열두 개짜리 바퀴가 맞물려 만들어져요.',
             en:'The name of a year is made by two wheels meshing: one with ten teeth, one with twelve.',
             zh:'年份的名字，是由一个十齿轮和一个十二齿轮咬合着转出来的。' } },
    { art: svg(
        gear(62,66,28,10,C.blue)+gear(140,66,32,12,C.gold)
        +'<circle cx="62" cy="38" r="4.5" fill="'+C.grey+'"/><circle cx="140" cy="34" r="4.5" fill="'+C.grey+'"/>'
        +'<circle cx="78.3" cy="43.6" r="4.5" fill="'+C.red+'"/><circle cx="156" cy="39.6" r="4.5" fill="'+C.red+'"/>'
        +arrow(40,104,86,104,C.blue,3)+arrow(118,104,166,104,C.gold,3)
        +txt(100,128,15,C.sub,'+1')),
      text:{ ko:'해가 바뀔 때마다 두 바퀴가 나란히 한 칸씩 돌아요. 그러면 짝이 계속 달라집니다.',
             en:'Every new year both wheels step forward one notch together, so the pairing keeps changing.',
             zh:'每过一年，两个轮子一起前进一格，于是配对不断变化。' } },
    { art: svg(
        txt(52,44,19,C.blue,'10')+txt(148,44,19,C.gold,'12')
        +arrow(64,58,92,80,C.blue,3)+arrow(136,58,108,80,C.gold,3)
        +'<rect x="62" y="86" width="76" height="34" rx="6" fill="'+C.paper+'" stroke="'+C.gold+'" stroke-width="2.5"/>'
        +txt(100,112,24,C.red,'60')),
      text:{ ko:'두 바퀴의 빨간 칸이 다시 만나는 때는 10과 12의 최소공배수, 60번째예요.',
             en:'The two red notches meet again at the least common multiple of ten and twelve — the sixtieth step.',
             zh:'两个红格再次相遇，正是10和12的最小公倍数——第60步。' } },
    { art: svg(
        gear(62,58,26,10,C.blue,true)+gear(140,58,30,12,C.gold,true)
        +txt(100,106,22,C.red,'60')
        +numi(40,120,0.75)+numi(160,120,0.75)),
      text:{ ko:'그래서 태어난 해의 이름은 예순 살에 딱 한 번 돌아와요. 그 예순 살을 환갑이라고 부른답니다.',
             en:'So the name of your birth year comes back exactly once, at sixty. That sixtieth birthday has its own name.',
             zh:'所以出生那年的名字，到六十岁才刚好回来一次。这个六十岁另有专门的叫法。' } },
  ]};
};
