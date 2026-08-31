/* M-33 — 직선의 방정식: 기울기는 변화의 비율, 절편은 대입으로 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<line x1="20" y1="115" x2="20" y2="20" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<line x1="20" y1="115" x2="185" y2="115" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<circle cx="55" cy="90" r="5" fill="'+C.red+'"/>'
        +'<circle cx="140" cy="40" r="5" fill="'+C.blue+'"/>'
        +'<line x1="55" y1="90" x2="140" y2="40" stroke="'+C.sub+'" stroke-width="2" stroke-dasharray="4 3"/>'
        +txt(102,60,15,C.gold,'y=ax+b')
        +txt(102,75,13,C.sub,'?')),
      text:{ ko:'좌표평면 위 두 점을 지나는 직선을, y=ax+b라는 식으로 정확히 적고 싶어요.',
             en:'You want to write the line through two points on the plane exactly as y=ax+b.',
             zh:'想把过坐标平面上两点的直线，精确写成y=ax+b。' } },
    { art: svg(
        '<line x1="20" y1="115" x2="20" y2="20" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<line x1="20" y1="115" x2="185" y2="115" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<circle cx="55" cy="90" r="5" fill="'+C.red+'"/>'
        +'<circle cx="140" cy="40" r="5" fill="'+C.blue+'"/>'
        +'<line x1="55" y1="90" x2="140" y2="90" stroke="'+C.gold+'" stroke-width="2.5" stroke-dasharray="3 2"/>'
        +'<line x1="140" y1="90" x2="140" y2="40" stroke="'+C.gold+'" stroke-width="2.5" stroke-dasharray="3 2"/>'
        +txt(98,102,12,C.gold,'Δx')
        +txt(152,68,12,C.gold,'Δy')),
      text:{ ko:'기울기는 "x가 1만큼 늘 때 y가 얼마나 느는가"를 뜻해요 — 가로·세로 변화량으로 재요.',
             en:'Slope means "how much y increases when x increases by 1" — measured by the horizontal and vertical change.',
             zh:'斜率的意思是"x每增1，y增多少"——用横纵变化量来量。' } },
    { art: svg(
        txt(100,45,20,C.blue,'a=Δy÷Δx')
        +arrow(30,90,80,90,C.blue,2.5)
        +arrow(120,90,170,90,C.blue,2.5)
        +txt(100,90,15,C.ink,'=2')),
      text:{ ko:'y변화량을 x변화량으로 나누면 이 직선만의 기울기 비율이 그대로 나와요.',
             en:'Dividing the y-change by the x-change gives you this line\'s exact slope ratio.',
             zh:'把y的变化量除以x的变化量，就得到这条直线自己的斜率比例。' } },
    { art: svg(
        '<line x1="20" y1="115" x2="20" y2="20" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<line x1="20" y1="115" x2="185" y2="115" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<circle cx="55" cy="90" r="5" fill="'+C.red+'"/>'
        +'<line x1="20" y1="103" x2="185" y2="35" stroke="'+C.ok+'" stroke-width="3"/>'
        +'<circle cx="20" cy="103" r="5" fill="'+C.gold+'"/>'
        +txt(38,100,11,C.gold,'b')),
      text:{ ko:'그 직선 위 한 점을 식에 대입하면, 남은 하나 — y절편(b)까지 완성돼요!',
             en:'Substitute one point on that line into the equation, and the last piece — the y-intercept b — is complete!',
             zh:'把直线上一点代入方程，最后一块——y轴截距b——就完成了！' } },
  ]};
};
