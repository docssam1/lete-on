/* C-22 — 옛 수학자의 묘비: 분모가 다른 네 조각을 하나로 맞추기 */
'use strict';
module.exports = function(H){
  const {C,svg,stick,numi,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        ground(120)
        +'<path d="M 60 118 L 60 55 Q 60 35 100 35 Q 140 35 140 55 L 140 118 Z" fill="'+C.mist+'" stroke="'+C.ink+'" stroke-width="2.5"/>'
        +txt(100,58,13,C.sub,'1/6')
        +txt(100,76,13,C.sub,'1/12')
        +txt(100,94,13,C.sub,'1/7')
        +txt(100,112,13,C.sub,'1/2')
        +numi(168,90,0.9)),
      text: { ko:'옛 수학자의 묘비엔 나이 대신 이 분수들만 적혀 있었어요: 1/6, 1/12, 1/7, 1/2.',
              en:"An old mathematician's tomb had no age, only these fractions: 1/6, 1/12, 1/7, 1/2.",
              zh:'一位古代数学家的墓碑上没有年龄，只有这些分数：1/6、1/12、1/7、1/2。' } },
    { art: svg(
        paper(20,20,38,30)+txt(39,40,13,C.sub,'1/6')
        +paper(66,20,38,30)+txt(85,40,13,C.sub,'1/12')
        +paper(112,20,38,30)+txt(131,40,13,C.sub,'1/7')
        +paper(158,20,30,30)+txt(173,40,13,C.sub,'1/2')
        +bubble(100,92,44,26,100,120)
        +txt(100,88,15,C.red,'6,12,7,2')
        +txt(100,104,20,C.ink,'≠')),
      text: { ko:'분모가 6, 12, 7, 2로 다 달라서 조각 크기가 제각각 — 그냥은 더할 수 없어요.',
              en:'The denominators 6, 12, 7, 2 are all different sizes — you can\'t add them directly.',
              zh:'分母6、12、7、2各不相同——没法直接相加。' } },
    { art: svg(
        paper(20,50,160,50)
        +txt(52,80,17,C.blue,'14/84')
        +txt(90,80,17,C.blue,'7/84')
        +txt(125,80,17,C.blue,'12/84')
        +txt(163,80,17,C.blue,'42/84')
        +arrow(100,20,100,48,C.gold,3)
        +txt(100,14,15,C.sub,'/84')),
      text: { ko:'네 분수를 전부 분모 84로 맞추면: 14+7+12+42 = 75, 즉 75/84예요.',
              en:'Convert all four to a common denominator of 84: 14+7+12+42 = 75, or 75/84.',
              zh:'把四个分数都统一成分母84：14+7+12+42=75，即75/84。' } },
    { art: svg(
        ground(120)
        +'<path d="M 60 118 L 60 55 Q 60 35 100 35 Q 140 35 140 55 L 140 118 Z" fill="'+C.mist+'" stroke="'+C.ink+'" stroke-width="2.5"/>'
        +txt(100,90,34,C.gold,'84')
        +numi(168,90,0.9)
        +'<path d="M 178 78 L 186 86 L 198 66" fill="none" stroke="'+C.ok+'" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'),
      text: { ko:'남은 9/84는 5년+4년, 그러니 84가 전체 나이! 분모만 맞추면 묘비도 풀려요.',
              en:'The leftover 9/84 is 5+4 years, so 84 is the full age! Match the denominators and even a tombstone gives up its answer.',
              zh:'剩下的9/84正是5年加4年，一生就是84岁！只要对齐分母，连墓碑也能解开。' } },
  ]};
};
