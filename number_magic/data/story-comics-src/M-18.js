/* M-18 — 계산기 없던 시절, 분모를 청소하다 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,numi,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<rect x="65" y="18" width="46" height="32" rx="4" fill="none" stroke="'+C.grey+'" stroke-width="2"/>'
        +'<line x1="65" y1="18" x2="111" y2="50" stroke="'+C.red+'" stroke-width="2.5"/>'
        +'<line x1="111" y1="18" x2="65" y2="50" stroke="'+C.red+'" stroke-width="2.5"/>'
        +paper(45,62,110,58)
        +txt(100,98,26,C.ink,'1/√2','font-family="Georgia,serif"')
        +numi(168,106,0.9)),
      text: { ko:'계산기가 없던 시절, 1/√2 같은 값을 손으로 어림해야 했어요.',
              en:'Back before calculators existed, values like 1/√2 had to be estimated by hand.',
              zh:'在没有计算器的年代，像1/√2这样的值得靠手算估计。' } },
    { art: svg(
        txt(60,45,22,C.ink,'1/√2','font-family="Georgia,serif"')
        +'<path d="M 40 70 Q 60 55 55 85 T 90 68 T 65 95 T 120 75" stroke="'+C.sub+'" stroke-width="2.5" fill="none"/>'
        +numi(150,99,1.05)
        +txt(178,72,18,C.ink,'😖')),
      text: { ko:'분모에 근호가 있으면 나눗셈이 훨씬 번거로웠어요.',
              en:'When the denominator had a root, division became far more tedious.',
              zh:'分母有根号时，除法麻烦得多。' } },
    { art: svg(
        txt(46,64,20,C.ink,'1/√2','font-family="Georgia,serif"')
        +arrow(85,60,132,60,C.gold,3)
        +txt(165,64,20,C.blue,'√2/2','font-family="Georgia,serif"')),
      text: { ko:'분자·분모에 √2를 똑같이 곱하면, 근호가 분모에서 분자로 옮겨가요.',
              en:'Multiply top and bottom by the same √2, and the root moves from the denominator up to the numerator.',
              zh:'分子分母同乘√2，根号就从分母搬到了分子。' } },
    { art: svg(
        txt(90,66,28,C.blue,'√2/2','font-family="Georgia,serif"')
        +txt(160,60,22,C.ok,'✓')
        +numi(35,106,1)),
      text: { ko:'분모가 깨끗한 정수가 되니, 그 시절엔 계산이 한결 쉬워졌답니다 — 지금도 쓰는 그 기술, 유리화예요!',
              en:'With a clean integer denominator, calculation became much easier back then — that very technique is still called rationalizing today!',
              zh:'分母变成干净的整数后，那时候算起来轻松多了——这项技术如今依然叫做有理化！' } },
  ]};
};
