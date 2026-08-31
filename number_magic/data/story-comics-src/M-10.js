/* M-10 — 데카르트, 곱한 횟수를 어깨 위로 올리다 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        [0,1,2,3,4,5,6,7].map(function(i){return txt(18+i*23,26,13,C.sub,'×2');}).join('')
        +stick(100,92,1.2,C.blue)
        +txt(140,58,20,C.ink,'😩')),
      text: { ko:'옛날엔 2를 열 번 곱한 수도 2×2×2×2×2×2×2×2×2×2라고 전부 다 써야 했어요.',
              en:'Long ago, even 2 multiplied ten times had to be spelled out in full: 2×2×2×2×2×2×2×2×2×2.',
              zh:'很久以前，就算2连乘十次，也得完整写成2×2×2×2×2×2×2×2×2×2。' } },
    { art: svg(
        paper(12,25,50,85)
        +'<line x1="22" y1="40" x2="52" y2="90" stroke="'+C.blue+'" stroke-width="3"/>'
        +paper(75,25,50,85)
        +'<polygon points="90,50 110,50 100,80" fill="none" stroke="'+C.gold+'" stroke-width="3"/>'
        +paper(138,25,50,85)
        +'<circle cx="153" cy="55" r="6" fill="'+C.purple+'"/>'
        +'<circle cx="173" cy="80" r="6" fill="'+C.purple+'"/>'),
      text: { ko:'그전엔 학자마다 곱한 횟수를 표시하는 방법이 제각각이었어요.',
              en:'Before that, every scholar had a different way to mark how many times something was multiplied.',
              zh:'在那之前，每位学者标记乘了几次的方法都各不相同。' } },
    { art: svg(
        stick(45,92,1.2,C.blue)
        +paper(75,28,100,72)
        +txt(112,82,42,C.ink,'a','font-style="italic" font-family="Georgia,serif"')
        +arrow(122,64,148,48,C.gold,2)
        +txt(155,44,17,C.gold,'n','font-style="italic" font-family="Georgia,serif"')),
      text: { ko:'17세기, 데카르트는 "곱한 횟수를 위에 작게 적자"고 했어요 — aⁿ이라는 표기가 이렇게 태어났죠.',
              en:'In the 17th century, Descartes said, "write how many times, small, up top." That is how the notation aⁿ was born.',
              zh:'17世纪，笛卡尔提议"把乘的次数写成右上角的小数字"——记号aⁿ就这样诞生了。' } },
    { art: svg(
        txt(100,55,26,C.ink,'a³×a⁴=a⁷','font-family="Georgia,serif" font-style="italic"')
        +stick(35,105,1.05,C.blue)
        +txt(165,105,20,C.gold,'✨')),
      text: { ko:'이제 2를 100번 곱한 수도 2¹⁰⁰이라고 짧게 쓸 수 있어요 — 곱한 횟수만 세면 끝!',
              en:'Now even 2 multiplied 100 times can be written simply as 2¹⁰⁰ — just count how many times you multiplied!',
              zh:'现在就算2连乘100次，也能简单写成2¹⁰⁰——只需数一数乘了几次！' } },
  ]};
};
