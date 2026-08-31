/* M-55 — 사인법칙 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<polygon points="40,110 160,110 100,30" fill="none" stroke="'+C.blue+'" stroke-width="2.5"/>'
        +'<path d="M 90 42 Q 100 50 110 42" fill="none" stroke="'+C.gold+'" stroke-width="2"/>'
        +txt(100,125,14,C.ink,'a')
        +txt(100,22,14,C.gold,'A')),
      text: { ko:'어떤 삼각형이든 변을 그 대각의 사인값으로 나누면 항상 같은 값이 나와요.',
              en:'In any triangle, dividing a side by the sine of its opposite angle always gives the same value.',
              zh:'在任何三角形中，边除以对角的正弦值，结果总是相同的。' } },
    { art: svg(
        '<circle cx="100" cy="75" r="55" fill="none" stroke="'+C.gold+'" stroke-width="2.5"/>'
        +'<polygon points="100,20 45,110 155,110" fill="none" stroke="'+C.blue+'" stroke-width="2"/>'
        +'<line x1="45" y1="75" x2="155" y2="75" stroke="'+C.red+'" stroke-width="2" stroke-dasharray="4 3"/>'
        +txt(100,68,15,C.ink,'2R')),
      text: { ko:'놀랍게도 그 값은 삼각형을 둘러싼 원(외접원)의 지름과도 똑같대요.',
              en:'Astonishingly, that value equals the diameter of the circle surrounding the triangle.',
              zh:'令人惊讶的是，这个值正好等于围住三角形的外接圆的直径。' } },
    { art: svg(
        stick(60,100,1.1,C.sub)
        +'<circle cx="120" cy="25" r="3" fill="'+C.gold+'"/><circle cx="150" cy="40" r="3" fill="'+C.gold+'"/><circle cx="170" cy="20" r="3" fill="'+C.gold+'"/><circle cx="135" cy="55" r="3" fill="'+C.gold+'"/>'
        +'<path d="M 80 90 Q 100 70 120 90" fill="none" stroke="'+C.brown+'" stroke-width="2"/>'),
      text: { ko:'10~11세기 페르시아의 아부 알와파와 알비루니는 별의 위치를 계산하려고 이 성질을 연구했어요.',
              en:'10th-11th century Persian scholars Abu al-Wafa and al-Biruni studied this to calculate star positions.',
              zh:'10至11世纪的波斯学者阿布·瓦法和比鲁尼为计算星体位置研究了这一性质。' } },
    { art: svg(
        '<polygon points="100,20 45,110 155,110" fill="none" stroke="'+C.blue+'" stroke-width="2"/>'
        +'<circle cx="100" cy="75" r="55" fill="none" stroke="'+C.gold+'" stroke-width="2"/>'
        +txt(100,140-4,14,C.ink,'a/sinA=2R')),
      text: { ko:'삼각법은 원래 하늘의 별을 재려는 필요에서 태어난 학문이에요 — a/sinA=2R.',
              en:'Trigonometry was born from the need to measure the stars in the sky — a/sinA=2R.',
              zh:'三角学正是为了测量天空中的星星而诞生的学问——a/sinA=2R。' } },
  ]};
};
