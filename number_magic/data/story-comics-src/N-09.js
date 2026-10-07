/* N-09 — 동전 던지기와 수나무(2026-10-06 새로 그림 — 옛 컷은 완전수 이야기라 유닛과 어긋났다).
   유닛 story.history 그대로: 6개를 던져 별 2·달 4 → 2+4=6, 수나무는 가르기를 가지로 그린 것(위 원 = 아래 두 원의 합).
   동전은 실사 소품(coin·coin-star·coin-moon). 그림 속 글자는 숫자뿐. */
'use strict';
module.exports=function(H){
  const {C,svg,real,boy,txt,star4,moonDisc,ring}=H;
  const table='<rect x="0" y="108" width="200" height="32" fill="'+C.soil+'"/><rect x="0" y="108" width="200" height="5" fill="'+C.soil2+'" opacity=".6"/>';
  /* 별·달 동전은 실사-2차(coin-star/coin-moon, 2026-10-07). 공중의 동전은 면이 안 보이므로 기본 동전. */
  const coin=(x,y,face)=>real(face==='star'?'coin-star':face==='moon'?'coin-moon':'coin',x,y+11,24);
  const node=(x,y,n,hi)=>'<circle cx="'+x+'" cy="'+y+'" r="15" fill="'+(hi?C.goldbright:'#fff')+'" stroke="'+C.blue+'" stroke-width="2.6"/>'
    +'<text x="'+x+'" y="'+(y+6)+'" text-anchor="middle" font-size="16" font-weight="800" fill="'+C.ink+'">'+n+'</text>';
  const tree=(top,l,r)=>'<line x1="100" y1="38" x2="62" y2="92" stroke="'+C.soil2+'" stroke-width="5" stroke-linecap="round"/>'
    +'<line x1="100" y1="38" x2="138" y2="92" stroke="'+C.soil2+'" stroke-width="5" stroke-linecap="round"/>'
    +node(100,34,top,true)+node(62,96,l)+node(138,96,r);
  return { panels:[
    { art: svg(table+boy(30,90,0.75)
        +coin(86,40)+coin(112,26)+coin(140,44)+coin(100,66)+coin(132,72)+coin(160,22)
        +'<path d="M 46 70 Q 60 52 74 46" fill="none" stroke="'+C.gold+'" stroke-width="2.4" stroke-dasharray="1 5" stroke-linecap="round"/>'),
      text:{ ko:'동전 여섯 개를 한꺼번에 던져요. 동전마다 한쪽은 별무늬, 다른 쪽은 달무늬예요.',
             en:'Toss six coins at once. Each coin has a star on one side and a moon on the other.',
             zh:'一次扔出六枚硬币。每枚硬币一面是星星，一面是月亮。' } },
    { art: svg(table
        +coin(30,92,'star')+coin(58,92,'star')+ring(44,92,24,C.gold)
        +coin(102,92,'moon')+coin(128,92,'moon')+coin(154,92,'moon')+coin(180,92,'moon')
        +txt(44,54,18,C.ink,'2')+txt(141,54,18,C.ink,'4')),
      text:{ ko:'별무늬가 2개, 달무늬가 4개 나왔어요. 2와 4를 모으면 다시 6이에요. 2 더하기 4는 6.',
             en:'Two stars and four moons. Put 2 and 4 together and you have 6 again: 2 plus 4 is 6.',
             zh:'出现了2个星星、4个月亮。2和4合起来又是6：2加4等于6。' } },
    { art: svg(tree('6','2','4')),
      text:{ ko:'이것을 수나무로 그려요. 위의 원은 아래 두 가지를 더한 수예요. 2와 4를 더하면 6!',
             en:'Draw it as a number tree. The top circle is the two branches added together: 2 and 4 make 6!',
             zh:'把它画成数字树。上面的圆是下面两根树枝相加的数：2和4合起来是6！' } },
    { art: svg(tree('6','5','?')),
      text:{ ko:'다시 던졌더니 별무늬가 5개! 그럼 달무늬는 몇 개일까요? 5와 무엇을 더하면 6이 될까요?',
             en:'Toss again — five stars! How many moons, then? What do you add to 5 to make 6?',
             zh:'再扔一次——五个星星！那月亮有几个？5加几等于6？' } },
  ]};
};
