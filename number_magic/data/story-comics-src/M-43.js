/* M-43 — lim, 다가가기만 하는 기호 */
'use strict';
module.exports=function(H){
  const {C,svg,arrow,txt,ground}=H;
  return { panels:[
    { art: svg(
        ground(90)
        +'<circle cx="42" cy="90" r="4" fill="'+C.blue+'"/>'
        +'<circle cx="66" cy="90" r="4" fill="'+C.blue+'"/>'
        +'<circle cx="86" cy="90" r="4" fill="'+C.blue+'"/>'
        +'<circle cx="112" cy="90" r="6" fill="#fff" stroke="'+C.red+'" stroke-width="3"/>'
        +arrow(88,60,108,84,C.gold,2.5)
        +txt(112,116,14,C.red,'a')),
      text: { ko:'x=2에 실제로 닿지 않고, 자꾸자꾸 가까워지기만 하는 상황을 나타낼 기호가 필요했어요.',
              en:'We needed a symbol for a value that keeps getting closer and closer to a point, without ever actually touching it.',
              zh:'我们需要一个符号，表示不断靠近某个点，却始终没有真正碰到它。' } },
    { art: svg(
        txt(56,74,26,C.grey,'limit')
        +arrow(96,72,140,72,C.gold,3)
        +txt(168,80,34,C.blue,'lim')),
      text: { ko:"영어 단어 'limit(한계)'을 줄여서 lim이라고 쓰기로 했어요.",
              en:"The English word 'limit' was shortened to lim.",
              zh:"英语单词'limit'(极限)被缩写成了lim。" } },
    { art: svg(
        '<line x1="20" y1="100" x2="55" y2="100" stroke="'+C.grey+'" stroke-width="1.5" stroke-dasharray="2 3"/>'
        +'<polygon points="55,100 46,95 46,105" fill="'+C.grey+'"/>'
        +'<line x1="80" y1="80" x2="120" y2="80" stroke="'+C.gold+'" stroke-width="2.5" stroke-dasharray="4 3"/>'
        +'<polygon points="120,80 110,74 110,86" fill="'+C.gold+'"/>'
        +arrow(150,54,190,54,C.blue,4)),
      text: { ko:"'가까워진다'는 뜻의 화살표(→) 표기는 여러 수학자가 조금씩 다듬어 20세기 초에야 지금 모습이 됐어요.",
              en:"The arrow (→) for 'approaches' was refined bit by bit by several mathematicians, settling into today's form in the early 20th century.",
              zh:'表示"趋近"的箭头(→)记法经过多位数学家一点点打磨，直到20世纪初才定型成今天的样子。' } },
    { art: svg(
        txt(70,84,40,C.blue,'lim')
        +'<rect x="118" y="66" width="58" height="24" rx="4" fill="none" stroke="'+C.red+'" stroke-width="2" stroke-dasharray="3 3"/>'
        +txt(147,86,20,C.red,'x→a')),
      text: { ko:'그렇게 완성된 lim(x→a)에서, 화살표 오른쪽 수(a)가 바로 x가 다가가는 값이에요.',
              en:'In the finished lim(x→a), the number to the right of the arrow — a — is exactly the value x is approaching.',
              zh:'在最终完成的lim(x→a)中，箭头右边的数(a)正是x所趋近的值。' } },
  ]};
};
