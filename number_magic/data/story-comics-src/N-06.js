/* N-06 — 모으기와 가르기: 쿠키 여덟 개(2026-10-06 새로 그림). 유닛 story.history 그대로 — 8은 4와 4, 8 안에 3은 두 번 들어가고 2가 남는다.
   그림 속 글자는 숫자뿐. 쿠키·접시 밖 물건은 실사 소품. */
'use strict';
module.exports=function(H){
  const {C,svg,real,girl,txt,arrow,ring}=H;
  const table='<rect x="0" y="104" width="200" height="36" fill="'+C.soil+'"/><rect x="0" y="104" width="200" height="6" fill="'+C.soil2+'" opacity=".6"/>';
  const plate=(x,y,w)=>'<ellipse cx="'+x+'" cy="'+(y+2)+'" rx="'+(w/2+2)+'" ry="9" fill="'+C.ink+'" opacity=".12"/><ellipse cx="'+x+'" cy="'+y+'" rx="'+(w/2)+'" ry="8" fill="#fff" stroke="'+C.ink+'" stroke-width="1.8"/><ellipse cx="'+x+'" cy="'+y+'" rx="'+(w/2-8)+'" ry="4.5" fill="none" stroke="'+C.grey+'" stroke-width="1.2"/>';
  const cookies=(xs,y,h)=>xs.map(x=>real('cookie',x,y,h||18)).join('');
  return { panels:[
    { art: svg(table+girl(28,86,0.7)+plate(128,106,96)+cookies([92,106,120,134,148,162],104)+cookies([106,148],92)+txt(128,44,22,C.ink,'8')),
      text:{ ko:'쿠키가 여덟 개 있어요. 두 접시에 똑같이 나눠 담으면 한 접시에 몇 개일까요?',
             en:'There are eight cookies. If we share them equally on two plates, how many go on each?',
             zh:'有八块饼干。平均放到两个盘子里，每盘几块？' } },
    { art: svg(table+plate(56,106,72)+plate(146,106,72)+cookies([36,50,64,78],104)+cookies([126,140,154,168],104)+txt(56,62,20,C.ink,'4')+txt(146,62,20,C.ink,'4')),
      text:{ ko:'한 접시에 4개, 다른 접시에도 4개! 8은 4와 4로 똑같이 가를 수 있어요.',
             en:'Four on one plate and four on the other! Eight splits evenly into 4 and 4.',
             zh:'一盘4块，另一盘也是4块！8可以平均分成4和4。' } },
    { art: svg(table
        +cookies([26,42,58],100)+ring(42,90,26,C.gold)+cookies([96,112,128],100)+ring(112,90,26,C.gold)+cookies([164,180],100)
        +txt(42,48,16,C.gold,'3')+txt(112,48,16,C.gold,'3')+txt(172,48,16,C.red,'2')),
      text:{ ko:'이번엔 3개씩 묶어 봐요. 3이 두 번 들어가고 2개가 남아요. 직접 나눠 보면 바로 보여요.',
             en:'Now group them in threes. Three fits twice, with 2 left over. Sharing them out shows it right away.',
             zh:'这次三块一组。3能分两组，还剩2块。动手分一分就一目了然。' } },
    { art: svg(table+plate(100,106,110)+cookies([62,76,90,104,118,132],104)+cookies([76,118],92)
        +arrow(22,64,56,86,C.gold,3)+arrow(178,64,144,86,C.gold,3)+txt(22,52,16,C.ink,'4')+txt(178,52,16,C.ink,'4')+txt(100,46,22,C.ink,'8')),
      text:{ ko:'가른 쿠키를 다시 한 접시에 모으면? 처음처럼 8개예요. 가르고 모아도 전체 수는 그대로예요!',
             en:'Put the split cookies back on one plate — eight again! Splitting and joining never change the total.',
             zh:'把分开的饼干再放回一个盘子——又是8块！分开再合起来，总数不变！' } },
  ]};
};
