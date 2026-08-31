/* M-34 — 두 직선의 평행과 수직: 계수 안에 숨은 방향 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<line x1="30" y1="100" x2="120" y2="30" stroke="'+C.sub+'" stroke-width="2.5"/>'
        +'<line x1="90" y1="110" x2="180" y2="40" stroke="'+C.sub+'" stroke-width="2.5"/>'
        +txt(100,60,20,C.gold,'?')
        +txt(100,90,20,C.ink,'🧭')),
      text:{ ko:'두 직선이 평행한지 수직인지, 그림 없이 식만 보고도 알 수 있을까요?',
             en:'Can you tell whether two lines are parallel or perpendicular just from their equations, without drawing?',
             zh:'不画图，只看方程能判断两直线是平行还是垂直吗？' } },
    { art: svg(
        '<line x1="20" y1="105" x2="110" y2="25" stroke="'+C.blue+'" stroke-width="3"/>'
        +'<line x1="90" y1="115" x2="180" y2="35" stroke="'+C.blue+'" stroke-width="3"/>'
        +'<polygon points="112,23 106,26 110,30" fill="'+C.blue+'"/>'
        +'<polygon points="182,33 176,36 180,40" fill="'+C.blue+'"/>'),
      text:{ ko:'평행한 두 직선은 방향이 완전히 같아요 — 기울기가 똑같다는 뜻이에요.',
             en:'Two parallel lines point in exactly the same direction — meaning their slopes are identical.',
             zh:'两条平行线方向完全一致——意味着斜率相同。' } },
    { art: svg(
        '<line x1="30" y1="105" x2="120" y2="35" stroke="'+C.red+'" stroke-width="3"/>'
        +'<line x1="60" y1="35" x2="150" y2="105" stroke="'+C.purple+'" stroke-width="3"/>'
        +'<rect x="83" y="62" width="10" height="10" fill="none" stroke="'+C.ink+'" stroke-width="1.8" transform="rotate(-38 88 67)"/>'
        +txt(88,25,14,C.ink,'90°')),
      text:{ ko:'수직인 두 직선은 90도로 꺾여 있어요 — 이때는 두 기울기를 곱하면 언제나 -1이 돼요.',
             en:'Two perpendicular lines meet at 90 degrees — and then the two slopes always multiply to -1.',
             zh:'两条垂直线相差90度——此时两斜率之积总是-1。' } },
    { art: svg(
        paper(30,30,140,70)
        +txt(100,58,15,C.ink,'A:B=A′:B′')
        +txt(100,82,15,C.red,'AA′+BB′=0')
        +'<circle cx="150" cy="40" r="9" fill="'+C.goldbright+'"/>'+txt(150,44,11,C.ink,'✓')),
      text:{ ko:'계수의 비율(평행)이나 엇갈려 곱한 합(수직)만 보면, 그림 없이도 방향을 알 수 있어요.',
             en:'Just look at the coefficient ratio (parallel) or the cross-multiplied sum (perpendicular) — no drawing needed.',
             zh:'只看系数比(平行)或交叉相乘之和(垂直)，不画图也能判断方向。' } },
  ]};
};
