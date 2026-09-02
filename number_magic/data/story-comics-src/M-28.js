/* M-28 — 근의 공식: 완전제곱식이 만든 만능 열쇠 */
'use strict';
module.exports=function(H){
  const {C,svg,txt}=H;
  return { panels:[
    { art: svg(
        '<rect x="30" y="40" width="45" height="45" rx="6" fill="'+C.paper+'" stroke="'+C.blue+'" stroke-width="2.5"/>'
        +txt(52,68,16,C.blue,'p')
        +'<rect x="80" y="40" width="45" height="45" rx="6" fill="'+C.paper+'" stroke="'+C.blue+'" stroke-width="2.5"/>'
        +txt(102,68,16,C.blue,'q')
        +txt(150,60,18,C.ok,'✓')
        +txt(100,105,13,C.sub,'integers')),
      text: { ko:'x²+bx+c=(x+p)(x+q) 인수분해는 p,q가 딱 맞아떨어질 때만 통해요.',
              en:'Factoring x²+bx+c=(x+p)(x+q) only works when p and q come out as nice numbers.',
              zh:'因式分解x²+bx+c=(x+p)(x+q)只在p、q刚好凑整数时才行。' } },
    { art: svg(
        txt(60,55,16,C.ink,'x²-3x+1=0')
        +'<rect x="40" y="70" width="35" height="35" rx="6" fill="'+C.paper+'" stroke="'+C.red+'" stroke-width="2.5"/>'
        +'<rect x="90" y="70" width="35" height="35" rx="6" fill="'+C.paper+'" stroke="'+C.red+'" stroke-width="2.5"/>'
        +txt(57,92,20,C.red,'?')
        +txt(107,92,20,C.red,'?')
        +txt(160,88,22,C.red,'✕')),
      text: { ko:'그럼 x²-3x+1=0처럼 정수로 안 떨어지는 방정식은 어떻게 풀까요?',
              en:"So how do you solve something like x²-3x+1=0, where they don't come out as integers?",
              zh:'那x²-3x+1=0这种凑不出整数的方程该怎么解？' } },
    { art: svg(
        txt(100,30,13,C.ink,'x=(-b±√(b²-4ac))/(2a)')
        +'<rect x="70" y="40" width="60" height="20" rx="4" fill="none" stroke="'+C.gold+'" stroke-width="2.5"/>'
        +'<line x1="100" y1="60" x2="100" y2="85" stroke="'+C.gold+'" stroke-width="2"/>'
        +'<polygon points="100,88 96,80 104,80" fill="'+C.gold+'"/>'
        +'<rect x="70" y="90" width="60" height="35" fill="none" stroke="'+C.blue+'" stroke-width="2"/>'
        +'<line x1="70" y1="107" x2="130" y2="107" stroke="'+C.blue+'" stroke-width="1.5" stroke-dasharray="3 2"/>'
        +'<line x1="107" y1="90" x2="107" y2="125" stroke="'+C.blue+'" stroke-width="1.5" stroke-dasharray="3 2"/>'
        +txt(88,105,10,C.blue,'x²')),
      text: { ko:'판별식에서 본 b²-4ac가 사실 근의 공식 안에 그대로 들어 있어요.',
              en:'The b²-4ac you saw in the discriminant is sitting right inside the quadratic formula.',
              zh:'在判别式里见过的b²-4ac，其实就藏在求根公式里面。' } },
    { art: svg(
        '<circle cx="40" cy="70" r="16" fill="none" stroke="'+C.gold+'" stroke-width="3.5"/>'
        +'<line x1="56" y1="70" x2="110" y2="70" stroke="'+C.gold+'" stroke-width="3.5"/>'
        +'<line x1="95" y1="70" x2="95" y2="82" stroke="'+C.gold+'" stroke-width="3.5"/>'
        +'<line x1="108" y1="70" x2="108" y2="80" stroke="'+C.gold+'" stroke-width="3.5"/>'
        +txt(40,75,13,C.ink,'x')
        +txt(150,45,14,C.blue,'x²-3x+1')
        +txt(150,75,14,C.blue,'2x²+4x-1')
        +txt(150,105,14,C.blue,'x²+2x-4')
        +txt(180,30,16,C.ok,'✓')),
      text: { ko:'완전제곱식으로 바꾸는 과정을 한 번만 해 두면, 어떤 이차방정식이든 대입만으로 풀리는 만능 열쇠가 돼요.',
              en:"Do the 'complete the square' work once, and you get a master key that solves any quadratic by substitution alone.",
              zh:'把配方的过程一次性做好，就得到一把万能钥匙——任何二次方程只需代入就能解开。' } },
  ]};
};
