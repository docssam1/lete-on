/* M-21 — 다항식의 곱셈과 나눗셈: 네 부분과 조립제법 */
'use strict';
module.exports=function(H){
  const {C,svg,arrow,numi,txt}=H;
  return { panels:[
    { art: svg(
        txt(45,45,13,C.sub,'m·(x+a)')
        +txt(45,70,20,C.ok,'✓')
        +txt(150,45,15,C.ink,'(x+a)(x+b)')
        +txt(150,70,20,C.gold,'?')
        +arrow(70,105,130,105,C.grey,2)),
      text: { ko:'단항식 하나를 다항식에 곱하는 건 이미 할 줄 알아요. 그럼 괄호 두 개를 곱하면 어떻게 될까요?',
              en:'You already know how to multiply a monomial into a polynomial. But what happens when you multiply two brackets together?',
              zh:'把一个单项式乘进多项式，你已经会了。但两个括号相乘会怎样呢？' } },
    { art: svg(
        txt(45,45,15,C.blue,'2x')+txt(45,95,15,C.blue,'3')
        +txt(155,45,15,C.ink,'4x')+txt(155,95,15,C.ink,'1')
        +'<line x1="50" y1="48" x2="150" y2="48" stroke="'+C.gold+'" stroke-width="1.6"/>'
        +'<line x1="50" y1="48" x2="150" y2="90" stroke="'+C.gold+'" stroke-width="1.6"/>'
        +'<line x1="50" y1="90" x2="150" y2="48" stroke="'+C.gold+'" stroke-width="1.6"/>'
        +'<line x1="50" y1="90" x2="150" y2="90" stroke="'+C.gold+'" stroke-width="1.6"/>'),
      text: { ko:"괄호 곱셈은 예로부터 '네 부분을 빠짐없이 곱한다'는 원칙 하나로 정리돼 왔어요.",
              en:'Multiplying two brackets has long come down to one rule: multiply all four parts, missing none.',
              zh:'两个括号相乘，自古以来都归结为一条原则：四个部分都要乘到，一个不漏。' } },
    { art: svg(
        '<circle cx="20" cy="35" r="12" fill="'+C.paper+'" stroke="'+C.gold+'" stroke-width="2"/>'
        +txt(20,40,13,C.ink,'1')
        +txt(60,25,15,C.blue,'2')+txt(100,25,15,C.blue,'5')+txt(140,25,15,C.blue,'-3')
        +'<line x1="60" y1="30" x2="60" y2="105" stroke="'+C.sub+'" stroke-width="1.6"/>'
        +txt(60,118,15,C.ok,'2')
        +arrow(60,112,98,32,C.gold,2)
        +txt(100,118,15,C.ok,'7')
        +arrow(100,112,138,32,C.gold,2)
        +txt(140,118,15,C.ok,'4')),
      text: { ko:'나눗셈은 그 반대 방향이에요 — 몫을 하나씩 맞춰가며 나머지를 줄여가는 조립제법으로 다듬어졌죠.',
              en:'Division runs the opposite way — synthetic division builds the quotient piece by piece, shrinking the remainder each time.',
              zh:'除法则反过来——综合除法一点点拼出商，同时把余数逐步缩小。' } },
    { art: svg(
        txt(45,30,18,C.blue,'×')
        +arrow(20,50,45,68,C.gold,2)
        +arrow(70,50,45,68,C.gold,2)
        +arrow(20,90,45,68,C.gold,2)
        +arrow(70,90,45,68,C.gold,2)
        +'<line x1="100" y1="20" x2="100" y2="120" stroke="'+C.grey+'" stroke-width="1.5"/>'
        +txt(150,30,18,C.ink,'÷')
        +arrow(180,45,155,65,C.red,2)
        +arrow(155,65,175,85,C.red,2)
        +arrow(175,85,150,105,C.red,2)),
      text: { ko:'곱셈은 네 부분을 모으고, 나눗셈은 거꾸로 하나씩 줄여가요 — 이 유닛에서 둘 다 배워요.',
              en:'Multiplication gathers four parts together; division peels them away one by one — this unit covers both.',
              zh:'乘法把四部分聚在一起，除法则反过来一点点剥离——这一课两者都会学到。' } },
  ]};
};
