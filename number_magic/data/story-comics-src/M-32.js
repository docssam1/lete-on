/* M-32 — 중점과 내분점: 반씩 나누기의 일반화 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<line x1="20" y1="90" x2="180" y2="90" stroke="'+C.ink+'" stroke-width="2.5"/>'
        +'<circle cx="30" cy="90" r="6" fill="'+C.red+'"/>'
        +'<circle cx="170" cy="90" r="6" fill="'+C.blue+'"/>'
        +'<circle cx="100" cy="90" r="6" fill="'+C.gold+'"/>'
        +txt(30,112,12,C.red,'A')+txt(170,112,12,C.blue,'B')+txt(100,112,12,C.gold,'M')
        +txt(65,70,12,C.sub,'1')+txt(135,70,12,C.sub,'1')),
      text:{ ko:'두 점을 정확히 반씩 나누는 점, 중점(M)은 이미 알고 있어요 — 늘 딱 가운데예요.',
             en:'You already know the midpoint M, which splits two points exactly in half — always right in the middle.',
             zh:'把两点正好一分为二的中点M，你已经知道了——总是正中间。' } },
    { art: svg(
        '<line x1="20" y1="90" x2="180" y2="90" stroke="'+C.ink+'" stroke-width="2.5"/>'
        +'<circle cx="30" cy="90" r="6" fill="'+C.red+'"/>'
        +'<circle cx="170" cy="90" r="6" fill="'+C.blue+'"/>'
        +'<circle cx="123" cy="90" r="6" fill="'+C.grey+'"/>'
        +txt(30,112,12,C.red,'A')+txt(170,112,12,C.blue,'B')+txt(123,112,14,C.sub,'?')
        +txt(76,70,13,C.sub,'2')+txt(146,70,13,C.sub,'1')),
      text:{ ko:'그런데 절반이 아니라 "2:1"처럼 정해진 비율로 나누는 점은 어떻게 찾을까요?',
             en:'But how do you find a point that divides them in a specific ratio, like 2:1, instead of half-and-half?',
             zh:'但要按"2:1"这样的比例来分呢？' } },
    { art: svg(
        '<line x1="20" y1="90" x2="180" y2="90" stroke="'+C.ink+'" stroke-width="2.5"/>'
        +'<circle cx="30" cy="90" r="6" fill="'+C.red+'"/>'
        +'<circle cx="170" cy="90" r="6" fill="'+C.blue+'"/>'
        +'<circle cx="123" cy="90" r="6" fill="'+C.gold+'"/>'
        +arrow(30,55,123,55,C.blue,2.5)+txt(76,42,13,C.blue,'m')
        +arrow(170,25,123,25,C.red,2.5)+txt(146,15,13,C.red,'n')),
      text:{ ko:'아이디어는 이래요 — 먼 쪽 점일수록 가까운 쪽의 비율을 곱해서 가중치를 크게 줘요.',
             en:'The idea: weight each point by the ratio on its far side — the farther point gets more pull.',
             zh:'思路是：给每个点按对侧的比例加权——越远的点权重越大。' } },
    { art: svg(
        '<line x1="20" y1="90" x2="180" y2="90" stroke="'+C.ink+'" stroke-width="2.5"/>'
        +'<circle cx="30" cy="90" r="6" fill="'+C.red+'"/>'
        +'<circle cx="170" cy="90" r="6" fill="'+C.blue+'"/>'
        +'<circle cx="100" cy="90" r="7" fill="'+C.gold+'"/>'
        +txt(100,112,13,C.gold,'m=n')
        +txt(100,55,15,C.ink,'M')
        +'<circle cx="145" cy="45" r="10" fill="'+C.goldbright+'"/>'+txt(145,50,13,C.ink,'✓')),
      text:{ ko:'m과 n이 같아지면 이 공식은 정확히 중점 공식으로 돌아가요 — 중점은 1:1인 특수한 경우였던 거죠!',
             en:'When m equals n, this formula returns exactly to the midpoint formula — the midpoint was just the special 1:1 case!',
             zh:'当m等于n时，这个公式正好回到中点公式——中点原来就是1:1的特殊情况！' } },
  ]};
};
