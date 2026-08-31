/* M-22 — 곱셈공식의 확장: 세제곱 공식의 1,3,3,1 패턴 */
'use strict';
module.exports=function(H){
  const {C,svg,arrow,txt}=H;
  return { panels:[
    { art: svg(
        '<rect x="30" y="20" width="50" height="50" fill="none" stroke="'+C.blue+'" stroke-width="2"/>'
        +'<rect x="80" y="20" width="25" height="50" fill="none" stroke="'+C.gold+'" stroke-width="2"/>'
        +'<rect x="30" y="70" width="50" height="25" fill="none" stroke="'+C.gold+'" stroke-width="2"/>'
        +'<rect x="80" y="70" width="25" height="25" fill="none" stroke="'+C.red+'" stroke-width="2"/>'
        +txt(55,50,16,C.blue,'x²')
        +txt(92,50,13,C.gold,'ax')
        +txt(55,87,13,C.gold,'ax')
        +txt(92,87,11,C.red,'a²')
        +txt(150,60,20,C.ink,'(x+a)²')),
      text: { ko:'(x+a)² = x²+2ax+a²는 이미 알고 있는 이차식 곱셈공식이에요.',
              en:'(x+a)² = x²+2ax+a² is the quadratic multiplication formula you already know.',
              zh:'(x+a)² = x²+2ax+a²是你已经知道的二次乘法公式。' } },
    { art: svg(
        txt(60,50,20,C.blue,'(x+a)³')
        +txt(60,85,14,C.sub,'×3')
        +txt(150,60,30,C.gold,'?')
        +arrow(90,60,130,60,C.grey,2)),
      text: { ko:'그럼 한 번 더 곱한 (x+a)³은요? 매번 괄호 세 개를 펼치긴 너무 번거로워요.',
              en:'So what about multiplying once more, (x+a)³? Expanding three brackets every time is far too tedious.',
              zh:'那再乘一次的(x+a)³呢？每次都展开三个括号实在太麻烦。' } },
    { art: svg(
        txt(35,60,20,C.gold,'1')+txt(80,60,20,C.gold,'3')+txt(125,60,20,C.gold,'3')+txt(170,60,20,C.gold,'1')
        +txt(35,90,12,C.sub,'x³')+txt(80,90,12,C.sub,'x²')+txt(125,90,12,C.sub,'x')+txt(170,90,12,C.sub,'1')
        +'<line x1="20" y1="40" x2="185" y2="40" stroke="'+C.blue+'" stroke-width="2"/>'),
      text: { ko:"괄호를 분배해 곱하는 원리는 그대로인데, 계수는 '1, 3, 3, 1'이라는 규칙적인 패턴으로 나타나요.",
              en:'The principle of distributing each bracket never changes — but the coefficients settle into a neat pattern: 1, 3, 3, 1.',
              zh:"分配括号相乘的原理没有变，但系数呈现出'1、3、3、1'这样规律的模式。" } },
    { art: svg(
        txt(50,45,15,C.blue,'(x+a)²')
        +txt(50,70,13,C.sub,'x²+2ax+a²')
        +arrow(90,58,115,58,C.gold,3)
        +txt(155,45,15,C.ink,'(x+a)³')
        +txt(155,70,11,C.sub,'x³+3ax²+3a²x+a³')
        +txt(180,25,16,C.ok,'✓')),
      text: { ko:'세제곱 공식은 이차식 공식의 자연스러운 확장이에요 — 원리는 그대로, 계수만 패턴을 이뤄요.',
              en:'The cube formula is a natural extension of the quadratic one — same principle, just a patterned set of coefficients.',
              zh:'立方公式是二次公式的自然延伸——原理不变，只是系数排成了规律。' } },
  ]};
};
