/* B-16 — 왕도 없는 지름길, 구구단 총정리 마라톤 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        ground(110)
        +'<path d="M 20 108 L 180 108" stroke="'+C.gold+'" stroke-width="5" stroke-dasharray="10 6"/>'
        +stick(50,86,1.25)
        +'<path d="M 38 60 L 44 50 L 50 58 L 56 48 L 62 58 L 68 50 L 72 60 Z" fill="'+C.goldbright+'" stroke="'+C.gold+'" stroke-width="2"/>'
        +bubble(140,60,36,22,120,84)
        +txt(140,64,11,C.ink,'?')),
      text: { ko:'왕이 스승에게 물었어요. "내가 왕이니, 기하학을 더 빨리 배울 방법은 없겠소?"',
              en:'A king asked his teacher: "I am the king — is there no faster way to learn geometry?"',
              zh:'国王问老师："我是国王，学几何就没有更快的路吗？"' } },
    { art: svg(
        stick(60,88,1.2)
        +stick(140,88,1.2,C.sub)
        +'<path d="M 20 112 L 90 112" stroke="'+C.gold+'" stroke-width="6" stroke-linecap="round"/>'
        +'<path d="M 110 112 L 180 112" stroke="'+C.sub+'" stroke-width="4" stroke-linecap="round"/>'
        +bubble(100,44,44,22,120,62)
        +txt(100,48,10,C.ink,'1?')),
      text: { ko:'스승이 답했어요. "나라엔 임금님만 다니는 길이 있을지 몰라도, 기하학에는 모든 사람에게 오직 한 길뿐입니다."',
              en:'The teacher answered: "Your kingdom may have roads only for kings, but in geometry there is only one road for everyone."',
              zh:'老师回答："您的国土也许有只供国王走的路，但几何学只有一条路，对所有人都一样。"' } },
    { art: svg(
        stick(70,90,1.2)
        +stick(130,90,1.15,C.sub)
        +ground(112)
        +txt(100,30,11,C.sub,'⚭')),
      text: { ko:'같은 이야기가 알렉산더 대왕과 스승 메네크무스, 또는 프톨레마이오스 왕과 유클리드로도 전해져요.',
              en:'The same tale is told of Alexander and his teacher Menaechmus, or of King Ptolemy and Euclid.',
              zh:'这个故事有人说是亚历山大和老师梅内克缪斯，也有人说是托勒密王和欧几里得。' } },
    { art: svg(
        ground(114)
        +[2,3,4,5,6,7,8,9].map((n,i)=>txt(24+i*20,100,11,i%2?C.blue:C.gold,n)).join('')
        +'<polyline points="10,114 190,114" stroke="'+C.gold+'" stroke-width="3"/>'
        +stick(184,90,0.95)),
      text: { ko:'구구단도 똑같아요. 지름길은 없지만, 한 번 지나간 길은 평생 내 것이 된답니다!',
              en:'Times tables are no different — no shortcut, but a road walked once is yours for life!',
              zh:'乘法口诀也一样。没有捷径——但走过一遍的路，一辈子都是你的！' } },
  ]};
};
