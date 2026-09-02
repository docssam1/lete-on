/* M-09 — 순환소수는 반드시 분수로 돌아간다 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        txt(100,45,26,C.red,'0.333…')
        + arrow(100,55,100,80,C.gold,3)
        + txt(90,110,22,C.ink,'?')
        + '<line x1="80" y1="95" x2="120" y2="95" stroke="'+C.ink+'" stroke-width="3"/>'
        + txt(110,110,22,C.ink,'?')),
      text: { ko:'0.333…처럼 끝나지 않는 소수도 다시 분수로 되돌릴 수 있을까요?',
              en:'Can a decimal that never ends, like 0.333…, be turned back into a fraction?',
              zh:'像0.333…这样写不完的小数，能变回分数吗？' } },
    { art: svg(
        txt(100,30,20,C.ink,'a/b')
        + arrow(85,40,50,75,C.ok,2.5)
        + arrow(115,40,150,75,C.red,2.5)
        + txt(50,95,16,C.ok,'0.375')
        + txt(150,95,18,C.red,'0.333…')),
      text: { ko:'분수를 소수로 바꾸면 결과는 딱 두 가지뿐이에요 — 끝나거나(0.375), 반복되거나(0.333…).',
              en:'Turn a fraction into a decimal and there are only two outcomes — it ends (0.375) or it repeats (0.333…).',
              zh:'分数化成小数只有两种结果——终止(0.375)或循环(0.333…)。' } },
    { art: svg(
        txt(100,40,20,C.red,'0.333…')
        + arrow(100,55,100,90,C.blue,3)
        + txt(100,110,20,C.ink,'1/3')
        + txt(165,30,22,C.ok,'✓')),
      text: { ko:'거꾸로도 참이에요! 끝나지 않고 반복되는 소수는 반드시 어떤 분수로 되돌아가요.',
              en:'The reverse holds too! Any decimal that repeats forever must come back to some fraction.',
              zh:'反过来也成立！任何永远循环的小数，都一定能还原成某个分数。' } },
    { art: svg(
        txt(90,45,16,C.purple,'0.101001…')
        + arrow(90,58,90,85,C.grey,3)
        + '<line x1="72" y1="70" x2="108" y2="100" stroke="'+C.red+'" stroke-width="3.5" stroke-linecap="round"/>'
        + '<line x1="108" y1="70" x2="72" y2="100" stroke="'+C.red+'" stroke-width="3.5" stroke-linecap="round"/>'
        + txt(90,122,15,C.sub,'irrational')),
      text: { ko:'하지만 반복도 안 되고 끝나지도 않는 소수는 분수로 못 돌아가요 — 그런 수를 무리수라고 불러요.',
              en:'But a decimal that neither repeats nor ends can never return to a fraction — those numbers are called irrational.',
              zh:'但既不循环也不终止的小数无法还原成分数——这样的数叫做无理数。' } },
  ]};
};
