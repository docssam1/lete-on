/* M-31 — 두 점 사이의 거리: 자 대신 피타고라스 정리 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,numi,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<line x1="20" y1="115" x2="20" y2="20" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<line x1="20" y1="115" x2="185" y2="115" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<circle cx="45" cy="95" r="5" fill="'+C.red+'"/>'
        +'<circle cx="140" cy="35" r="5" fill="'+C.blue+'"/>'
        +'<line x1="45" y1="95" x2="140" y2="35" stroke="'+C.sub+'" stroke-width="2" stroke-dasharray="4 3"/>'
        +'<rect x="150" y="60" width="26" height="14" fill="#fff" stroke="'+C.red+'" stroke-width="2"/>'
        +'<line x1="152" y1="68" x2="174" y2="66" stroke="'+C.red+'" stroke-width="2"/>'
        +txt(163,50,16,C.sub,'?')),
      text:{ ko:'좌표평면 위 두 점 사이의 거리를 자 없이, 좌표만 보고 정확히 구할 방법이 있을까요?',
             en:'Is there a way to find the distance between two points on a coordinate plane exactly, without a ruler?',
             zh:'不用尺子，只凭坐标能精确算出坐标平面上两点间的距离吗？' } },
    { art: svg(
        '<line x1="20" y1="115" x2="20" y2="20" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<line x1="20" y1="115" x2="185" y2="115" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<circle cx="45" cy="95" r="5" fill="'+C.red+'"/>'
        +'<circle cx="140" cy="35" r="5" fill="'+C.blue+'"/>'
        +'<line x1="45" y1="95" x2="140" y2="95" stroke="'+C.gold+'" stroke-width="2.5" stroke-dasharray="3 2"/>'
        +'<line x1="140" y1="95" x2="140" y2="35" stroke="'+C.gold+'" stroke-width="2.5" stroke-dasharray="3 2"/>'
        +'<rect x="132" y="87" width="8" height="8" fill="none" stroke="'+C.ink+'" stroke-width="1.5"/>'),
      text:{ ko:'두 점을 잇는 선분은 언제나, 가로 변화량과 세로 변화량이 만든 직각삼각형의 빗변이에요.',
             en:'The segment joining two points is always the hypotenuse of a right triangle formed by the horizontal and vertical changes.',
             zh:'连接两点的线段，永远是横向变化量和纵向变化量构成的直角三角形的斜边。' } },
    { art: svg(
        numi(50,84,1.1)
        +'<path d="M 90 105 L 155 105 L 155 45 Z" fill="none" stroke="'+C.blue+'" stroke-width="2.5"/>'
        +txt(122,118,13,C.gold,'a')
        +txt(162,75,13,C.gold,'b')
        +txt(112,68,13,C.red,'c')
        +txt(122,25,15,C.ink,'a²+b²=c²')),
      text:{ ko:'2500년 전부터 알려진 피타고라스 정리(빗변²=밑변²+높이²)를 좌표에 그대로 적용하면 돼요.',
             en:'Just apply the Pythagorean theorem, known for 2,500 years — hypotenuse²=leg²+leg² — directly to the coordinates.',
             zh:'把2500年前就已知的勾股定理(斜边²=直角边²+直角边²)直接套用到坐标上即可。' } },
    { art: svg(
        '<line x1="20" y1="115" x2="20" y2="20" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<line x1="20" y1="115" x2="185" y2="115" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<circle cx="45" cy="95" r="5" fill="'+C.red+'"/>'
        +'<circle cx="140" cy="35" r="5" fill="'+C.blue+'"/>'
        +'<line x1="45" y1="95" x2="140" y2="35" stroke="'+C.ok+'" stroke-width="3"/>'
        +txt(150,60,14,C.ok,'5')
        +txt(90,25,14,C.ink,'√(Δx²+Δy²)')),
      text:{ ko:'좌표만 알면 자 없이도 정확한 거리가 나와요 — 이게 바로 이 시간에 배울 거리 공식이에요!',
             en:'Just from the coordinates, you get the exact distance without any ruler — that\'s the distance formula for today!',
             zh:'只凭坐标就能精确算出距离，不用尺子——这正是这节课要学的距离公式！' } },
  ]};
};
