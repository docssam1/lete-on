/* M-46 — S를 길게 늘여 만든 ∫ */
'use strict';
module.exports=function(H){
  const {C,svg,arrow,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<path d="M 20 110 Q 100 20 190 70" fill="none" stroke="'+C.blue+'" stroke-width="3"/>'
        +'<rect x="26" y="98" width="18" height="10" fill="'+C.sky+'" stroke="'+C.ink+'" stroke-width="1"/>'
        +'<rect x="48" y="70" width="18" height="38" fill="'+C.sky+'" stroke="'+C.ink+'" stroke-width="1"/>'
        +'<rect x="70" y="48" width="18" height="60" fill="'+C.sky+'" stroke="'+C.ink+'" stroke-width="1"/>'
        +'<rect x="92" y="36" width="18" height="72" fill="'+C.sky+'" stroke="'+C.ink+'" stroke-width="1"/>'
        +'<rect x="114" y="42" width="18" height="66" fill="'+C.sky+'" stroke="'+C.ink+'" stroke-width="1"/>'
        +ground(108)),
      text: { ko:'울퉁불퉁한 곡선 아래 넓이를 구하려면, 아주 가는 직사각형 조각들을 잘게 쪼개 다 더해야 해요.',
              en:'To find the area under a bumpy curve, you have to slice it into many very thin rectangles and add them all up.',
              zh:'要求凹凸曲线下方的面积，得把它切成许多极窄的矩形，再全部加起来。' } },
    { art: svg(
        txt(100,70,20,C.grey,'summa')
        +txt(100,116,50,C.blue,'S')),
      text: { ko:"1675년, 라이프니츠는 '합'을 뜻하는 라틴어 summa의 첫 글자 S를 가져왔어요.",
              en:"In 1675, Leibniz took the letter S — the first letter of the Latin word summa, meaning 'sum'.",
              zh:'1675年，莱布尼茨取来了拉丁语summa(意为"总和")的首字母S。' } },
    { art: svg(
        txt(46,86,44,C.grey,'S')
        +arrow(80,70,120,70,C.gold,3)
        +txt(158,88,64,C.blue,'∫')),
      text: { ko:'그 S를 위아래로 길게 늘여서, 오늘날의 ∫ 모양을 만들었어요.',
              en:"He stretched that S tall, up and down, into the shape of today's ∫.",
              zh:'他把那个S上下拉长，做出了今天的∫形状。' } },
    { art: svg(
        txt(38,84,44,C.blue,'∫')
        +'<rect x="86" y="80" width="14" height="28" fill="'+C.sky+'" stroke="'+C.ink+'" stroke-width="1"/>'
        +'<rect x="102" y="60" width="14" height="48" fill="'+C.sky+'" stroke="'+C.ink+'" stroke-width="1"/>'
        +'<rect x="118" y="46" width="14" height="62" fill="'+C.sky+'" stroke="'+C.ink+'" stroke-width="1"/>'
        +'<rect x="134" y="58" width="14" height="50" fill="'+C.sky+'" stroke="'+C.ink+'" stroke-width="1"/>'
        +ground(108)),
      text: { ko:"그래서 ∫는 글자 모양 그대로 '잘게 쪼갠 조각들을 다 더한다'는 뜻을 담고 있어요.",
              en:'So the shape of ∫ itself carries the meaning: add up all the tiny sliced pieces.',
              zh:'所以∫这个形状本身，就承载着"把细分的碎片全部加起来"的含义。' } },
  ]};
};
