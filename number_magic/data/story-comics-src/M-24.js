/* M-24 — 나머지정리: 대입 한 번이면 몫이 사라진다 */
'use strict';
module.exports=function(H){
  const {C,svg,arrow,txt}=H;
  return { panels:[
    { art: svg(
        txt(45,40,15,C.blue,'P(x)')
        +txt(45,65,13,C.sub,'÷(x-2)')
        +arrow(75,55,110,55,C.gold,2)
        +'<rect x="115" y="35" width="40" height="35" rx="4" fill="'+C.paper+'" stroke="'+C.gold+'" stroke-width="2"/>'
        +txt(135,58,18,C.red,'?')
        +txt(135,90,12,C.sub,'remainder')),
      text: { ko:'P(x)를 (x-2)로 나눈 나머지가 궁금해요. 조립제법으로 직접 나눌 수도 있겠죠.',
              en:'You want the remainder when P(x) is divided by (x-2). You could do synthetic division directly.',
              zh:'想知道P(x)除以(x-2)的余数。当然可以直接用综合除法。' } },
    { art: svg(
        txt(50,60,20,C.gold,'⚡')
        +txt(130,60,30,C.ink,'÷')
        +'<line x1="112" y1="40" x2="148" y2="80" stroke="'+C.red+'" stroke-width="3" stroke-linecap="round"/>'
        +txt(90,105,16,C.red,'?')),
      text: { ko:'그런데 더 빠른 지름길이 있대요 — 나눗셈을 아예 안 하고도 나머지를 구할 수 있을까요?',
              en:"But there's a faster shortcut, they say — can you find the remainder without dividing at all?",
              zh:'但据说有更快的捷径——能不做除法就求出余数吗？' } },
    { art: svg(
        txt(100,30,14,C.ink,'P(x)=(x-2)Q(x)+R')
        +txt(55,65,14,C.sub,'(2-2)Q(2)')
        +'<line x1="15" y1="58" x2="95" y2="72" stroke="'+C.red+'" stroke-width="2.2"/>'
        +'<line x1="15" y1="72" x2="95" y2="58" stroke="'+C.red+'" stroke-width="2.2"/>'
        +txt(150,65,16,C.blue,'+R')
        +txt(100,105,20,C.ok,'P(2)=R')),
      text: { ko:'P(x)=(x-2)×몫+나머지인데, x에 2를 넣으면 (x-2)가 0이 되어 몫이 통째로 사라져요.',
              en:'Since P(x)=(x-2)×quotient+remainder, plugging in x=2 makes (x-2) zero — the whole quotient vanishes.',
              zh:'因为P(x)=(x-2)×商+余数，代入x=2会让(x-2)变成0——整个商都消失。' } },
    { art: svg(
        txt(40,55,16,C.blue,'P(2)')
        +arrow(70,60,140,60,C.gold,3)
        +txt(170,55,16,C.red,'R')
        +txt(100,95,13,C.sub,'no ÷ needed')
        +txt(170,30,16,C.ok,'✓')),
      text: { ko:'그래서 P(2)를 계산하면, 남는 건 나머지뿐이에요 — 이게 바로 나머지정리예요.',
              en:'So computing P(2) leaves only the remainder — that\'s exactly the Remainder Theorem.',
              zh:'所以算出P(2)，剩下的就只有余数——这正是余数定理。' } },
  ]};
};
