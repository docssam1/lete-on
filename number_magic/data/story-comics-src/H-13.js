/* H-13 — 로그표: 곱셈을 덧셈으로 바꾸는 오래된 요령 */
'use strict';
module.exports = function(H){
  const {C,svg,arrow,paper,bubble,txt,ground,astronomer}=H;
  return { panels:[
    { art: svg(
        astronomer(60,85,1.2)
        +paper(95,45,85,55)
        +txt(137,68,15,C.ink,'123456789012')
        +txt(137,88,15,C.ink,'×987654321098')
        +bubble(45,45,26,16,58,66)
        +txt(45,50,16,C.red,'!')),
      text: { ko:'계산기가 없던 시절, 천문학자들은 열두 자리 수끼리 손으로 곱해야 했어요.',
              en:'Before calculators, astronomers had to multiply twelve-digit numbers by hand.',
              zh:'没有计算器的年代，天文学家要手算十二位数相乘。' } },
    { art: svg(
        paper(20,20,160,80)
        +txt(50,45,15,C.sub,'log')
        +'<line x1="20" y1="55" x2="180" y2="55" stroke="'+C.gold+'" stroke-width="1.5"/>'
        +[0,1,2,3].map(i=>'<line x1="'+(45+i*40)+'" y1="55" x2="'+(45+i*40)+'" y2="95" stroke="'+C.gold+'" stroke-width="1"/>').join('')
        +txt(100,78,17,C.blue,'× → +')),
      text: { ko:'로그표를 쓰면 곱셈이 덧셈으로 바뀌었어요 — 값을 찾아 더하기만 하면 됐죠.',
              en:'Log tables turned multiplication into addition — just look up values and add them.',
              zh:'用对数表能把乘法变成加法——只要查出数值再相加就行。' } },
    { art: svg(
        paper(15,20,75,45)
        +txt(52,45,17,C.blue,'1000')
        +txt(52,60,13,C.sub,'0×3')
        +paper(110,20,75,45)
        +txt(147,45,17,C.blue,'10⁷')
        +txt(147,60,13,C.sub,'0×7')
        +arrow(100,85,100,105,C.gold,3)
        +txt(100,120,20,C.ok,'0×10')),
      text: { ko:'1000은 0이 3개, 1000만은 0이 7개 — 합치면 0이 10개예요.',
              en:'1,000 has 3 zeros, 10,000,000 has 7 — together, 10 zeros.',
              zh:'1000有3个0，1000万有7个——合起来是10个0。' } },
    { art: svg(
        txt(50,60,20,C.blue,'1000')
        +txt(85,60,26,C.ink,'×')
        +txt(140,60,20,C.blue,'10⁷')
        +arrow(100,85,100,105,C.gold,3)
        +txt(100,125,26,C.ok,'10¹⁰')),
      text: { ko:'0을 세는 것도 로그표와 같은 마법 — 1000×1000만은 곧바로 100억이에요!',
              en:'Counting zeros is the same magic as a log table — 1,000×10,000,000 is instantly 10 billion!',
              zh:'数0和对数表是同一种魔法——1000×1000万立刻就是100亿！' } },
  ]};
};
