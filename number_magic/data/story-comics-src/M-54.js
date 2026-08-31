/* M-54 — 지수·로그 부등식 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        ground(115)
        +'<rect x="35" y="105" width="20" height="10" fill="'+C.blue+'"/>'
        +'<rect x="85" y="85" width="20" height="30" fill="'+C.blue+'"/>'
        +'<rect x="135" y="55" width="20" height="60" fill="'+C.blue+'"/>'
        +txt(45,130,11,C.ink,'1')+txt(95,130,11,C.ink,'2')+txt(145,130,11,C.ink,'3')),
      text: { ko:'2ˣ은 x가 커질수록 값도 커져요. 2¹=2, 2²=4, 2³=8처럼요.',
              en:'2ˣ grows as x grows: 2¹=2, 2²=4, 2³=8, and so on.',
              zh:'2ˣ随x增大而增大：2¹=2、2²=4、2³=8……' } },
    { art: svg(
        '<line x1="20" y1="80" x2="180" y2="80" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<circle cx="100" cy="80" r="4" fill="'+C.red+'"/>'
        +arrow(100,80,170,80,C.gold,3)
        +txt(100,100,14,C.ink,'3')
        +txt(150,60,16,C.ok,'x>3')),
      text: { ko:'그래서 2ˣ>2³이면, x도 3보다 커야 해요 — x>3이 되는 거죠.',
              en:'So if 2ˣ>2³, then x must be greater than 3 too — that gives x>3.',
              zh:'所以2ˣ>2³时，x也必须大于3——也就是x>3。' } },
    { art: svg(
        '<path d="M 20 110 Q 50 90 80 50" fill="none" stroke="'+C.ok+'" stroke-width="3"/>'
        +txt(50,125,13,C.ok,'>1')
        +'<path d="M 120 50 Q 150 90 180 110" fill="none" stroke="'+C.red+'" stroke-width="3"/>'
        +txt(150,125,13,C.red,'<1')),
      text: { ko:"이렇게 부등호 방향이 유지되는 성질은 함수의 '단조성'에서 나와요. 밑이 1보다 작으면 반대로 뒤집혀요.",
              en:"Keeping the inequality direction comes from a function's monotonicity. Under a base below 1, it flips.",
              zh:'不等号方向保持不变，这来自函数的单调性。底数小于1时则会反过来翻转。' } },
    { art: svg(
        '<line x1="20" y1="80" x2="180" y2="80" stroke="'+C.grey+'" stroke-width="2"/>'
        +'<line x1="100" y1="80" x2="175" y2="80" stroke="'+C.gold+'" stroke-width="5"/>'
        +'<circle cx="100" cy="80" r="5" fill="'+C.ink+'"/>'
        +txt(100,100,14,C.ink,'x≥…')),
      text: { ko:'이 유닛에서는 밑이 늘 1보다 큰 경우만 다뤄요 — 경계값을 찾으면 방향은 그대로예요.',
              en:'This unit only covers bases greater than 1 — find the boundary, and the direction stays put.',
              zh:'本单元只处理底数大于1的情形——找到边界值，方向就保持不变。' } },
  ]};
};
