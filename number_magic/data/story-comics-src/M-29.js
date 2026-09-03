/* M-29 — 이차부등식: 등호는 점 하나, 부등호는 구간 하나 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        arrow(15,95,185,95,C.ink,2)
        +[0,1,2,3,4].map(i=>{const x=40+i*30;return '<line x1="'+x+'" y1="90" x2="'+x+'" y2="100" stroke="'+C.ink+'" stroke-width="2"/>';}).join('')
        +'<circle cx="100" cy="95" r="6" fill="'+C.blue+'"/>'
        +txt(100,55,26,C.blue,'=')
        +txt(168,80,12,C.sub,'x')),
      text:{ ko:'이차방정식은 등호(=)를 써서, 조건을 만족하는 x를 딱 한 점만 콕 집어 찾았어요.',
             en:'A quadratic equation uses an equals sign to pin down exactly one point on the x-axis.',
             zh:'二次方程用等号(=)来精确锁定x轴上的一个点。' } },
    { art: svg(
        arrow(15,95,185,95,C.ink,2)
        +'<rect x="70" y="86" width="60" height="18" fill="'+C.goldbright+'" opacity="0.6"/>'
        +[0,1,2,3,4].map(i=>{const x=40+i*30;return '<line x1="'+x+'" y1="90" x2="'+x+'" y2="100" stroke="'+C.ink+'" stroke-width="2"/>';}).join('')
        +txt(100,55,26,C.gold,'&lt;')
        +txt(100,120,20,C.sub,'?')),
      text:{ ko:'그런데 부등호(<)가 나오면 답은 점 하나가 아니에요 — 통째로 이어진 구간이 답이 돼요.',
             en:'But once an inequality sign (<) appears, the answer is no longer one point — it becomes a whole connected interval.',
             zh:'但一旦出现不等号(<)，答案就不再是一个点，而是一整段连续的区间。' } },
    { art: svg(
        txt(100,38,17,C.ok,'(+)×(+)=+')
        +txt(100,72,17,C.ok,'(−)×(−)=+')
        +txt(100,106,17,C.red,'(+)×(−)=−')),
      text:{ ko:'열쇠는 아주 단순한 부호 규칙이에요: 같은 부호끼리 곱하면 +, 서로 다른 부호면 −가 돼요.',
             en:'The key is a simple sign rule: multiplying two numbers with the same sign gives +, with opposite signs gives −.',
             zh:'关键是一个简单的符号法则：同号相乘得+，异号相乘得−。' } },
    { art: svg(
        arrow(15,95,185,95,C.ink,2)
        +'<rect x="70" y="86" width="60" height="18" fill="'+C.gold+'" opacity="0.55"/>'
        +'<circle cx="70" cy="95" r="6" fill="'+C.red+'"/>'
        +'<circle cx="130" cy="95" r="6" fill="'+C.red+'"/>'
        +txt(70,120,13,C.sub,'p')
        +txt(130,120,13,C.sub,'q')
        +txt(100,55,20,C.blue,'p&lt;x&lt;q')),
      text:{ ko:'그래서 두 인수의 부호가 다를 때만 곱이 음수 — 그 구간은 언제나 두 근 p와 q 사이예요!',
             en:'So the product is negative only when the two factors disagree in sign — and that interval always sits between the two roots p and q!',
             zh:'所以只有两个因式符号相反时乘积才为负——这个区间总在两根p和q之间！' } },
  ]};
};
