/* M-36 — 거듭제곱근과 유리수 지수: 16세기의 계산 고통에서 태어난 사다리 */
'use strict';
module.exports=function(H){
  const {C,svg,astronomer,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<circle cx="35" cy="25" r="2.5" fill="'+C.gold+'"/><circle cx="55" cy="18" r="2" fill="'+C.gold+'"/><circle cx="75" cy="28" r="2.5" fill="'+C.gold+'"/>'
        +'<polygon points="150,95 175,95 168,60 157,60" fill="'+C.paper+'" stroke="'+C.brown+'" stroke-width="2"/>'
        +'<line x1="163" y1="60" x2="163" y2="35" stroke="'+C.brown+'" stroke-width="2"/>'
        +'<polygon points="163,35 163,55 180,50" fill="'+C.blue+'"/>'
        +paper(15,55,90,55)
        +txt(60,88,13,C.sub,'48293×57061')),
      text:{ ko:'16세기 후반, 항해술과 천문학은 자릿수가 어마어마한 수를 곱하고 나누어야 했어요.',
             en:'In the late 1500s, navigation and astronomy demanded multiplying and dividing numbers with huge numbers of digits.',
             zh:'16世纪后期，航海和天文学需要对位数极多的数做乘除。' } },
    { art: svg(
        astronomer(85,80,1.3)
        +paper(105,35,85,60)
        +txt(147,60,12,C.ink,'48293')
        +txt(147,78,12,C.ink,'×57061')
        +txt(50,45,20,C.red,'😓')),
      text:{ ko:'계산은 전부 손으로 했으니, 그 일은 계산이라기보다 차라리 고통에 가까웠죠.',
             en:'All the computing was done by hand — it was closer to suffering than to arithmetic.',
             zh:'计算全靠手算，那与其说是计算，不如说是折磨。' } },
    { art: svg(
        [0,1,2,3].map(i=>'<line x1="60" y1="'+(115-i*25)+'" x2="140" y2="'+(115-i*25)+'" stroke="'+C.gold+'" stroke-width="3"/>').join('')
        +'<line x1="60" y1="20" x2="60" y2="115" stroke="'+C.gold+'" stroke-width="3"/>'
        +'<line x1="140" y1="20" x2="140" y2="115" stroke="'+C.gold+'" stroke-width="3"/>'
        +arrow(30,90,60,90,C.red,2.5)+txt(15,90,15,C.red,'×')
        +arrow(140,45,170,45,C.ok,2.5)+txt(183,45,15,C.ok,'+')),
      text:{ ko:'지수와 로그라는 새 사다리는 바로 그 고통을 덜어보려는, 아주 현실적인 이유에서 태어났어요.',
             en:'Exponents and logarithms — a new kind of ladder — were born from the very practical wish to ease that pain.',
             zh:'指数和对数这架新梯子，正是为减轻这种痛苦而诞生的，非常实际的发明。' } },
    { art: svg(
        [0,1,2].map(i=>'<line x1="60" y1="'+(110-i*35)+'" x2="140" y2="'+(110-i*35)+'" stroke="'+C.gold+'" stroke-width="3"/>').join('')
        +'<line x1="60" y1="20" x2="60" y2="110" stroke="'+C.gold+'" stroke-width="3"/>'
        +'<line x1="140" y1="20" x2="140" y2="110" stroke="'+C.gold+'" stroke-width="3"/>'
        +'<circle cx="100" cy="92" r="5" fill="'+C.red+'"/>'
        +txt(100,113,11,C.sub,'1/2')
        +txt(100,60,15,C.ink,'2^(1/2)=√2')),
      text:{ ko:'분수 지수는 이 사다리를 딱 반 칸만 오르는 것 — 그래서 2의 1/2제곱이 바로 √2가 돼요.',
             en:'A fraction exponent means climbing this ladder only halfway — so 2 to the 1/2 is exactly √2.',
             zh:'分数指数就是只爬半格梯子——所以2的1/2次方正好是√2。' } },
  ]};
};
