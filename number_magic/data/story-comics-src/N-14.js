/* N-14 — 산가지의 색깔 비밀 (산가지와 규칙) */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        stick(60,92,1.1)
        +paper(110,30,60,50)
        +'<line x1="112" y1="32" x2="168" y2="78" stroke="'+C.red+'" stroke-width="3"/>'
        +'<line x1="168" y1="32" x2="112" y2="78" stroke="'+C.red+'" stroke-width="3"/>'
        +txt(140,105,16,C.ink,'?')),
      text:{ ko:'연필도 종이도 없던 시절, 사람들은 무엇으로 수를 셌을까요?',
             en:'Before pencils and paper existed, what did people count with?',
             zh:'还没有铅笔和纸的时候，人们用什么数数呢？' } },
    { art: svg(
        ground(100)
        +[0,1,2].map(i=>'<line x1="'+(30+i*14)+'" y1="90" x2="'+(30+i*14)+'" y2="50" stroke="'+C.ink+'" stroke-width="4" stroke-linecap="round"/>').join('')
        +txt(120,66,20,C.ink,'Ⅰ')+txt(150,66,20,C.ink,'Ⅱ')+txt(180,66,20,C.ink,'Ⅲ')),
      text:{ ko:'다들 처음엔 막대를 늘어놓아 세었어요. 중국은 산가지, 로마는 Ⅰ Ⅱ Ⅲ를 썼대요.',
             en:'Everywhere, counting began by laying out sticks — counting rods in China, Ⅰ Ⅱ Ⅲ in Rome.',
             zh:'各地最早都是摆小棍来数数——中国用算筹，罗马写Ⅰ Ⅱ Ⅲ。' } },
    { art: svg(
        '<line x1="55" y1="90" x2="55" y2="40" stroke="'+C.red+'" stroke-width="5" stroke-linecap="round"/>'
        +txt(55,108,22,C.red,'+')
        +'<line x1="150" y1="90" x2="150" y2="40" stroke="'+C.ink+'" stroke-width="5" stroke-linecap="round"/>'
        +txt(150,108,22,C.ink,'−')),
      text:{ ko:'재미있게도 중국은 붉은 산가지는 더하는 수, 검은 산가지는 빼는 수로 나눠 썼대요.',
             en:'Interestingly, China used red rods for adding numbers and black rods for subtracting numbers.',
             zh:'有趣的是，中国用红色算筹表示加的数，用黑色算筹表示减的数。' } },
    { art: svg(
        [0,1,2,3].map(i=>'<line x1="'+(30+i*12)+'" y1="90" x2="'+(30+i*12)+'" y2="55" stroke="'+C.blue+'" stroke-width="4" stroke-linecap="round"/>').join('')
        +'<line x1="26" y1="82" x2="78" y2="60" stroke="'+C.red+'" stroke-width="4" stroke-linecap="round"/>'
        +txt(100,75,22,C.gold,'5')
        +arrow(120,75,150,75,C.gold,3)
        +txt(172,80,18,C.ink,'6')),
      text:{ ko:'색과 표시에 뜻을 담는 건 오늘 우리 탤리 묶음과 화살표 규칙도 똑같아요!',
             en:'Giving colors and marks their own meaning is just like our tally bundles and arrow rule today!',
             zh:'给颜色和记号赋予意义，这跟我们今天的计数捆和箭头规律一样！' } },
  ]};
};
