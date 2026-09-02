/* M-58 — 켤레, 부호만 반대인 짝 */
'use strict';
module.exports=function(H){
  const {C,svg,arrow,txt}=H;
  return { panels:[
    { art: svg(
        txt(70,80,44,C.red,'0/0')
        +'<line x1="30" y1="46" x2="112" y2="106" stroke="'+C.red+'" stroke-width="3"/>'
        +'<line x1="112" y1="46" x2="30" y2="106" stroke="'+C.red+'" stroke-width="3"/>'
        +txt(160,80,40,C.blue,'√')),
      text: { ko:'근호가 있는 0/0 꼴은 앞서 배운 인수분해만으로는 근호를 없앨 수가 없어요.',
              en:"For a 0/0 form with a root, the factoring trick you just learned can't clear the root by itself.",
              zh:'带根号的0/0型，只靠刚学的因式分解无法去掉根号。' } },
    { art: svg(
        '<circle cx="60" cy="70" r="30" fill="'+C.mist+'" stroke="'+C.blue+'" stroke-width="3"/>'
        +txt(60,80,36,C.blue,'−')
        +'<line x1="92" y1="70" x2="108" y2="70" stroke="'+C.gold+'" stroke-width="2" stroke-dasharray="3 3"/>'
        +'<circle cx="140" cy="70" r="30" fill="'+C.mist+'" stroke="'+C.blue+'" stroke-width="3"/>'
        +txt(140,80,36,C.blue,'+')),
      text: { ko:"그래서 필요한 게 '켤레'예요 — 똑같은 두 항에서 부호만 반대인 짝을 말해요.",
              en:"That's where the 'conjugate' comes in — the same two terms, but with the opposite sign.",
              zh:"这时就需要'共轭式'——同样的两项，只是符号相反的搭档。" } },
    { art: svg(
        txt(100,50,15,C.ink,'(√A−B)(√A+B)')
        +arrow(60,66,140,66,C.gold,2.5)
        +txt(100,112,26,C.ok,'A−B²')
        +txt(168,50,26,C.grey,'√')
        +'<line x1="158" y1="38" x2="178" y2="60" stroke="'+C.red+'" stroke-width="2.5"/>'),
      text: { ko:'(√A−B)와 (√A+B)를 곱하면 (√A)²−B²=A−B²가 되어 근호가 깔끔히 사라져요.',
              en:'Multiplying (√A−B) by (√A+B) gives (√A)²−B²=A−B², and the root disappears cleanly.',
              zh:'(√A−B)乘以(√A+B)得到(√A)²−B²=A−B²，根号干净地消失了。' } },
    { art: svg(
        txt(100,44,15,C.ink,'(x−y)(x+y)')
        +'<line x1="30" y1="66" x2="170" y2="66" stroke="'+C.grey+'" stroke-width="1.5" stroke-dasharray="2 4"/>'
        +txt(100,96,22,C.ok,'x²−y²')
        +txt(60,128,15,C.blue,'lim')
        +txt(110,128,20,C.gold,'√→')),
      text: { ko:'이건 곱셈공식 (x−y)(x+y)=x²−y²과 똑같은 원리라서, 극한식의 근호도 이렇게 없애요.',
              en:'It\'s the exact same principle as the formula (x−y)(x+y)=x²−y², and that\'s how we clear the root in a limit.',
              zh:'这和乘法公式(x−y)(x+y)=x²−y²原理完全相同，极限式里的根号也这样消去。' } },
  ]};
};
