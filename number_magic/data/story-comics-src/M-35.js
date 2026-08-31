/* M-35 — 원의 방정식: 완전제곱으로 묶으면 중심·반지름이 보여요 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        paper(30,25,140,55)
        +txt(100,58,15,C.sub,'x²+y²-4x-6y+9=0')
        +'<ellipse cx="100" cy="105" rx="35" ry="24" fill="none" stroke="'+C.grey+'" stroke-width="2.5" stroke-dasharray="4 3"/>'
        +txt(100,110,16,C.gold,'?')),
      text:{ ko:'x²+y²-4x-6y+9=0 같은 식이 원이라는 건 어떻게 알까요? 중심과 반지름은 어디에 있을까요?',
             en:'How do you know an equation like x²+y²-4x-6y+9=0 is a circle? Where are its center and radius?',
             zh:'像x²+y²-4x-6y+9=0这样的式子，怎么知道是个圆？中心和半径又在哪？' } },
    { art: svg(
        '<circle cx="100" cy="75" r="35" fill="none" stroke="'+C.blue+'" stroke-width="2.5"/>'
        +'<circle cx="100" cy="75" r="4" fill="'+C.gold+'"/>'
        +arrow(100,75,135,75,C.red,2)
        +arrow(100,75,65,45,C.red,2)
        +arrow(100,75,125,105,C.red,2)
        +txt(100,55,12,C.gold,'a,b')),
      text:{ ko:'원은 원래, 중심에서 거리가 늘 r로 똑같은 점들의 모임이에요 — 거리 공식 그대로예요.',
             en:'A circle is simply the set of points always at the same distance r from a center — exactly the distance formula.',
             zh:'圆本来就是到中心距离恒为r的点的集合——正是距离公式。' } },
    { art: svg(
        txt(100,45,13,C.sub,'x²+y²-4x-6y+9=0')
        +arrow(100,60,100,90,C.gold,2.5)
        +txt(100,112,17,C.ink,'(x-2)²+(y-3)²=4')),
      text:{ ko:'전개하면 지저분해지지만, 거꾸로 x항·y항을 완전제곱으로 묶으면 다시 깔끔해져요.',
             en:'Expanding it looks messy, but working backward — completing the square on x and y — cleans it right up.',
             zh:'展开后很乱，但反过来把x、y项配成完全平方，又变得干净了。' } },
    { art: svg(
        '<circle cx="100" cy="75" r="32" fill="none" stroke="'+C.ok+'" stroke-width="3"/>'
        +'<circle cx="100" cy="75" r="4" fill="'+C.gold+'"/>'
        +'<line x1="100" y1="75" x2="132" y2="75" stroke="'+C.red+'" stroke-width="2"/>'
        +txt(116,68,11,C.red,'2')
        +txt(100,55,13,C.sub,'(2,3)')),
      text:{ ko:'완전제곱으로 묶는 순간, 중심(2,3)과 반지름 2가 식 안에서 바로 튀어나와요!',
             en:'The instant you complete the square, the center (2,3) and radius 2 jump right out of the equation!',
             zh:'一配方，中心(2,3)和半径2立刻从式子里跳出来！' } },
  ]};
};
