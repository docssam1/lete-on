/* M-20 — 인수분해 기초: factor의 어원 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,arrow,paper,txt}=H;
  return { panels:[
    { art: svg(
        paper(15,15,130,90)
        +txt(80,55,26,C.ink,'FACTOR')
        +txt(80,88,14,C.brown,'(maker)')
        +stick(175,95,0.9,C.blue)
        +'<line x1="166" y1="88" x2="146" y2="78" stroke="'+C.brown+'" stroke-width="2" stroke-linecap="round"/>'),
      text: { ko:"'인수분해'를 뜻하는 영어 factor는 원래 라틴어로 '만드는 사람'이라는 뜻이었대요.",
              en:"The English word 'factor' comes from Latin for 'one who makes.'",
              zh:'英语单词factor源自拉丁语，本意是"制造者"。' } },
    { art: svg(
        txt(50,55,16,C.blue,'(x+3)(x+4)')
        +arrow(75,75,125,75,C.gold,3)
        +txt(150,55,16,C.ink,'x²+7x+12')
        +txt(100,68,14,C.gold,'×')),
      text: { ko:'우리는 이미 (x+3)(x+4)를 곱하면 x²+7x+12가 된다는 걸 알고 있어요.',
              en:'We already know that multiplying (x+3)(x+4) gives x²+7x+12.',
              zh:'我们已经知道(x+3)(x+4)相乘会得到x²+7x+12。' } },
    { art: svg(
        txt(150,55,16,C.ink,'x²+7x+12')
        +arrow(150,75,70,75,C.red,3)
        +txt(55,55,16,C.blue,'(x+3)(x+4)')
        +'<circle cx="110" cy="95" r="10" fill="none" stroke="'+C.gold+'" stroke-width="2"/>'
        +'<line x1="117" y1="102" x2="127" y2="112" stroke="'+C.gold+'" stroke-width="3" stroke-linecap="round"/>'),
      text: { ko:'인수분해는 그 곱셈을 거꾸로 읽어, 곱을 만든 재료(인수)를 찾아내는 일이에요.',
              en:'Factoring reads that multiplication backward, hunting for the pieces (factors) that made the product.',
              zh:'因式分解就是把这个乘法反过来读，找出构成乘积的材料(因数)。' } },
    { art: svg(
        paper(20,25,160,75)
        +txt(60,60,15,C.blue,'x²+bx+c')
        +txt(140,60,15,C.ink,'(x+p)(x+q)')
        +arrow(90,45,120,45,C.gold,2)
        +stick(100,120,0.7,C.sub)
        +txt(170,30,16,C.ok,'✨')),
      text: { ko:'그래서 곱셈공식을 정확히 알수록 인수분해가 쉬워져요 — 외운 공식을 거꾸로 읽는 연습이거든요.',
              en:"So the better you know the multiplication formulas, the easier factoring gets — it's really reading a memorized formula backward.",
              zh:'所以乘法公式记得越熟，因式分解就越容易——因为这其实是在反着读记住的公式。' } },
  ]};
};
