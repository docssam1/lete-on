/* M-59 — 연필을 안 떼는 그림에서 엄밀한 식으로 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,txt,ground}=H;
  return { panels:[
    { art: svg(
        ground(120)
        +'<path d="M 60 108 Q 110 60 170 100" fill="none" stroke="'+C.blue+'" stroke-width="3"/>'
        +stick(40,86,0.9,C.ink)
        +'<circle cx="60" cy="108" r="3.5" fill="'+C.gold+'"/>'),
      text: { ko:"옛날에는 '연필을 떼지 않고 그릴 수 있으면 연속'이라는 직관적인 설명만 있었어요.",
              en:"Long ago, 'continuous' was explained only intuitively — if you could draw it without lifting your pen.",
              zh:"从前，'连续'只有一种直观的说法——只要笔不离开纸就能画完。" } },
    { art: svg(
        ground(108)
        +'<path d="M 20 96 Q 60 60 96 78" fill="none" stroke="'+C.blue+'" stroke-width="3"/>'
        +'<path d="M 104 78 Q 140 96 180 60" fill="none" stroke="'+C.blue+'" stroke-width="3"/>'
        +'<circle cx="100" cy="78" r="5" fill="#fff" stroke="'+C.red+'" stroke-width="3"/>'
        +'<circle cx="100" cy="102" r="4.5" fill="'+C.red+'"/>'),
      text: { ko:'그런데 딱 한 점만 값이 다른 이상한 그래프가 있다면, 그게 연속인지 아닌지 애매했어요.',
              en:'But for a strange graph where just one single point had a different value, whether it was continuous stayed unclear.',
              zh:'可如果图像上只有一个点的值不一样，这种情况到底算不算连续，说法很模糊。' } },
    { art: svg(
        stick(46,80,1.1,C.blue)
        +txt(140,66,17,C.ink,'lim')
        +txt(140,96,17,C.ok,'f(a)')
        +'<line x1="122" y1="80" x2="158" y2="80" stroke="'+C.ink+'" stroke-width="2"/>'),
      text: { ko:'19세기 독일 수학자 바이어슈트라스는 이걸 그 점의 극한값과 함숫값이 같다는 엄밀한 식으로 정리했어요.',
              en:'The 19th-century German mathematician Weierstrass formalized it rigorously: the limit at a point must equal the function value there.',
              zh:'19世纪德国数学家魏尔斯特拉斯把它严格整理成——该点的极限值等于函数值。' } },
    { art: svg(
        ground(108)
        +'<path d="M 20 96 Q 60 58 100 78 Q 140 98 180 58" fill="none" stroke="'+C.ok+'" stroke-width="3"/>'
        +'<circle cx="100" cy="78" r="5" fill="'+C.ok+'"/>'
        +'<path d="M 92 78 L 98 84 L 110 68" fill="none" stroke="'+C.ok+'" stroke-width="2.5" stroke-linecap="round"/>'
        +txt(140,30,15,C.red,'k=lim')),
      text: { ko:'그래서 오늘, 미정계수 k를 그 점의 극한값과 똑같이 맞추면 그래프가 끊어지지 않고 이어져요.',
              en:'So today, setting the unknown constant k exactly equal to the limit there keeps the graph connected without a break.',
              zh:'所以今天，把待定常数k设成和该点极限值相等，图像就能连续不断开。' } },
  ]};
};
