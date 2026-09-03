/* M-27 — 근과 계수의 관계: 합·곱 여정의 마지막 걸음 */
'use strict';
module.exports=function(H){
  const {C,svg,arrow,txt}=H;
  return { panels:[
    { art: svg(
        '<line x1="15" y1="100" x2="185" y2="100" stroke="'+C.ink+'" stroke-width="2"/>'
        +[0,1,2,3,4,5].map(function(n,i){var x=25+i*30;
          return '<line x1="'+x+'" y1="95" x2="'+x+'" y2="105" stroke="'+C.ink+'" stroke-width="1.6"/>'
            +txt(x,120,10,C.sub,String(n));}).join('')
        +'<path d="M 25 100 Q 100 25 175 100" fill="none" stroke="'+C.gold+'" stroke-width="2.5"/>'
        +'<circle cx="25" cy="100" r="4" fill="'+C.blue+'"/>'
        +'<circle cx="175" cy="100" r="4" fill="'+C.blue+'"/>'
        +txt(100,40,16,C.gold,'+ ×')),
      text: { ko:'무지개 덧셈법에서, 두 수의 합과 곱만 알면 그 두 수를 다룰 수 있다는 걸 배웠어요.',
              en:'From rainbow addition, you learned that knowing just the sum and product lets you handle two numbers.',
              zh:'从彩虹加法法你学到：只要知道两数之和与积，就能对付这两个数。' } },
    { art: svg(
        [0,1,2,3].map(function(i){var x=30+i*50;
          return '<circle cx="'+x+'" cy="70" r="10" fill="'+C.paper+'" stroke="'+C.blue+'" stroke-width="2"/>'
            +txt(x,74,10,C.gold,'+×');}).join('')
        +arrow(42,70,68,70,C.grey,2)
        +arrow(92,70,118,70,C.grey,2)
        +arrow(142,70,168,70,C.grey,2)),
      text: { ko:"차가 2인 두 수의 곱, 평균값 곱셈, 합차공식까지 — 그 여정은 늘 '합과 곱으로 다루기'였죠.",
              en:'The product of numbers differing by 2, average-value multiplication, the difference of squares — that journey always came down to sum and product.',
              zh:'差为2的两数之积、平均值乘法、平方差公式——这段旅程一直都是靠和与积。' } },
    { art: svg(
        '<path d="M20,110 Q100,10 180,110" fill="none" stroke="'+C.blue+'" stroke-width="2.5"/>'
        +'<circle cx="55" cy="88" r="4" fill="'+C.red+'"/>'
        +'<circle cx="140" cy="88" r="4" fill="'+C.red+'"/>'
        +txt(55,105,12,C.red,'α')
        +txt(140,105,12,C.red,'β')
        +txt(100,130,20,C.gold,'+ × ?')),
      text: { ko:"이차방정식의 두 근도 '어떤 두 수'예요. 근을 구하지 않고 합과 곱만 바로 알 수 있을까요?",
              en:"The two roots of a quadratic are also 'some two numbers.' Can you find their sum and product without solving for them?",
              zh:"二次方程的两个根也是'某两个数'。能不能不求根，直接知道它们的和与积？" } },
    { art: svg(
        txt(50,50,15,C.red,'α+β=-b')
        +txt(50,85,15,C.red,'αβ=c')
        +arrow(90,65,130,65,C.gold,3)
        +'<circle cx="160" cy="65" r="12" fill="'+C.paper+'" stroke="'+C.blue+'" stroke-width="2.5"/>'
        +txt(160,70,12,C.gold,'+×')
        +txt(160,30,14,C.ok,'✓')),
      text: { ko:'근과 계수의 관계는 그 여정의 마지막 걸음이에요 — 이번엔 그 두 수가 방정식의 근일 뿐이죠.',
              en:'The relation between roots and coefficients is the final step of that journey — this time the two numbers just happen to be roots.',
              zh:'根与系数的关系是这段旅程的最后一步——这次那两个数恰好是方程的根。' } },
  ]};
};
