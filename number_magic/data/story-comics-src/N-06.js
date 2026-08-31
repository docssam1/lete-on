/* N-06 — 8을 나눠 본 이야기 (모으기와 가르기) */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  const dot=(x,y,col)=>'<circle cx="'+x+'" cy="'+y+'" r="4.5" fill="'+(col||C.sub)+'"/>';
  const hand=(cx,cy,n,col)=>{ let d=''; for(let i=0;i<n;i++){d+=dot(cx-9+(i%3)*9, cy-6+Math.floor(i/3)*11, col); }
    return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="22" ry="18" fill="#fff" stroke="'+C.ink+'" stroke-width="2.2"/>'+d; };
  return { panels:[
    { art: svg(
        txt(100,26,26,C.ink,'8')
        +hand(55,80,0,C.blue)
        +hand(145,80,0,C.blue)
        +txt(100,80,20,C.gold,'?')),
      text:{ ko:'8을 똑같이 두 손에 나누면 한 손에 몇 개씩일까요? 척 보고 답하면 자주 틀려요.',
             en:'Split 8 evenly between two hands — how many in each? A quick guess often gets this wrong.',
             zh:'把8平均分到两只手里，每只手有几个？一眼猜过去很容易猜错。' } },
    { art: svg(
        hand(55,80,4,C.blue)
        +hand(145,80,4,C.blue)
        +txt(55,116,16,C.ink,'4')
        +txt(145,116,16,C.ink,'4')),
      text:{ ko:'실제로 나눠 보면 4와 4예요. 두 손을 펼쳐 보니 눈으로 바로 보이죠.',
             en:'Actually splitting them shows 4 and 4 — open both hands and you can see it right away.',
             zh:'真的分一分，是4和4。两只手一摊开，一眼就看清楚了。' } },
    { art: svg(
        [0,1,2].map(i=>dot(45+i*11,50,C.blue)).join('')
        +[0,1,2].map(i=>dot(45+i*11,66,C.blue)).join('')
        +dot(45,82,C.red)+dot(56,82,C.red)
        +txt(150,60,15,C.ink,'3+3')
        +txt(150,84,15,C.red,'+2')),
      text:{ ko:'이번엔 3씩 나눠 볼까요? 3이 두 번 들어가고 2가 남아요. 나눠 봐야 정확히 알 수 있어요.',
             en:'Now try groups of 3 — 3 fits twice with 2 left over. Splitting it for real is the surest way.',
             zh:'那按3来分呢？3能装两次，还剩2个。真的分一分才最准确。' } },
    { art: svg(
        hand(55,70,4,C.blue)
        +hand(145,70,4,C.blue)
        +arrow(80,70,95,70,C.gold,3)
        +arrow(120,70,105,70,C.gold,3)
        +txt(100,116,24,C.ink,'8')),
      text:{ ko:'두 손을 다시 모으면 짠! 언제나 8이에요. 갈라도 모아도 전체 수는 그대로예요.',
             en:'Join the two hands back together — poof, 8 again! Split or joined, the total never changes.',
             zh:'把两只手合起来——又是8！不管分开还是合起来，总数都不会变。' } },
  ]};
};
