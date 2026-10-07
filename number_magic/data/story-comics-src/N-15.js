/* N-15 — 문장제와 논리(2026-10-06 새로 그림, 첫 만화). 유닛 rule "더 받으면 더하고, 나눠주면 빼요" + "섞인 걸 나눠 세어요".
   사탕·쿠키는 실사 소품. 그림 속 글자는 숫자뿐. */
'use strict';
module.exports=function(H){
  const {C,svg,real,girl,boy,numi,txt,arrow,ring}=H;
  const table='<rect x="0" y="110" width="200" height="30" fill="'+C.soil+'"/><rect x="0" y="110" width="200" height="5" fill="'+C.soil2+'" opacity=".6"/>';
  const candies=(xs,y,h)=>xs.map(x=>real('candy',x,y,h||20)).join('');
  return { panels:[
    { art: svg(table+girl(34,92,0.72)+candies([70,88,106],110)+boy(170,92,0.72)+candies([132,148],84)+arrow(150,70,116,92,C.gold,3)
        +txt(88,70,18,C.ink,'3')+txt(140,52,16,C.ok,'+2')),
      text:{ ko:'소녀에게 사탕이 3개 있었어요. 친구가 2개를 더 주었어요. 더 받으면 더해요!',
             en:'The girl had 3 candies. Her friend gave her 2 more. When you get more, you add!',
             zh:'小女孩有3颗糖。朋友又给了她2颗。得到更多就用加法！' } },
    { art: svg(table+girl(34,92,0.72)+candies([70,90,110,130,150],110)+txt(110,62,22,C.ink,'5')),
      text:{ ko:'3개에 2개를 더하면 5개. 이제 사탕이 모두 5개예요.',
             en:'Three plus two is five. Now she has 5 candies in all.',
             zh:'3颗加2颗是5颗。现在一共有5颗糖。' } },
    { art: svg(table+girl(34,92,0.72)+candies([70,90,110],110)+numi(170,94,0.8)+candies([142,160],76)+arrow(118,92,144,82,C.gold,3)
        +txt(90,70,18,C.ink,'3')+txt(150,50,16,C.red,'−2')),
      text:{ ko:'누미에게 2개를 나눠 주었어요. 나눠 주면 빼요. 5개에서 2개를 빼면 3개가 남아요.',
             en:'She shared 2 with Numi. Sharing away means taking away: 5 take away 2 leaves 3.',
             zh:'她分给努米2颗。分出去就用减法：5颗减2颗还剩3颗。' } },
    { art: svg(table+candies([24,44,64],80,18)+real('cookie',34,104,18)+real('cookie',54,104,18)+candies([74],104,18)
        +arrow(92,84,112,84,C.gold,3)
        +candies([128,146,164,182],78,16)+real('cookie',140,104,18)+real('cookie',160,104,18)+txt(155,52,15,C.ink,'4')+txt(184,100,15,C.ink,'2')),
      text:{ ko:'사탕과 쿠키가 섞여 있으면 먼저 종류대로 나눠요. 그러면 사탕 4개, 쿠키 2개가 바로 보여요.',
             en:'When candies and cookies are mixed, sort them by kind first. Then you see 4 candies and 2 cookies right away.',
             zh:'糖和饼干混在一起时，先按种类分开。这样马上就能看出糖4颗、饼干2块。' } },
  ]};
};
