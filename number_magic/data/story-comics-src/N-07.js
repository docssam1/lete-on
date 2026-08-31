/* N-07 — 여덟, 아홉이라는 이름의 비밀 (수 이웃과 10 짝꿍) */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  const frame=(x0,y0,filled)=>{ let s=''; for(let i=0;i<10;i++){
      const cx=x0+(i%5)*18, cy=y0+Math.floor(i/5)*22;
      s+='<rect x="'+(cx-8)+'" y="'+(cy-8)+'" width="16" height="16" rx="3" fill="'+(i<filled?C.blue:'#fff')+'" stroke="'+C.ink+'" stroke-width="2"/>';
    } return s; };
  return { panels:[
    { art: svg(
        frame(28,34,8)
        +txt(190,45,20,C.ink,'8')),
      text:{ ko:'우리말 "여덟"이라는 이름은 어디서 왔을까요? 열 칸 중 여덟 칸을 채워 보아요.',
             en:'Where does the Korean word for eight come from? Fill eight of the ten boxes.',
             zh:'韩语"八"这个名字是从哪儿来的呢？先填满十格中的八格。' } },
    { art: svg(
        frame(28,34,8)
        +'<rect x="118" y="26" width="16" height="16" rx="3" fill="none" stroke="'+C.red+'" stroke-width="2.5" stroke-dasharray="3 3"/>'
        +txt(126,60,13,C.red,'2')),
      text:{ ko:'여덟은 열에서 딱 둘이 모자란다는 뜻이래요. 빈 칸 두 개가 바로 그 모자란 수예요.',
             en:'Eight is said to mean "two short of ten" — the two empty boxes are exactly that gap.',
             zh:'据说"八"就是"离十差二"的意思。空着的两格正好就是那个差数。' } },
    { art: svg(
        frame(28,34,9)
        +'<rect x="136" y="26" width="16" height="16" rx="3" fill="none" stroke="'+C.red+'" stroke-width="2.5" stroke-dasharray="3 3"/>'
        +frame(28,80,10)),
      text:{ ko:'아홉은 하나가 모자라고, 열은 손가락을 접었다 다시 다 폈다는 뜻이에요.',
             en:'Nine is one short, and ten means every folded finger has opened again.',
             zh:'"九"是差一，"十"是弯着的手指全都又张开了。' } },
    { art: svg(
        frame(28,44,7)
        +arrow(160,52,182,52,C.gold,3)
        +txt(190,58,16,C.ink,'3')),
      text:{ ko:'조상님도 늘 10을 기준으로 셌대요. 지금 우리가 10 짝꿍을 찾는 것과 똑같지요!',
             en:'Our ancestors always measured by ten too — just like us finding partners of 10 today!',
             zh:'祖先们数数也总以10为准——和我们现在找凑十朋友一模一样！' } },
  ]};
};
