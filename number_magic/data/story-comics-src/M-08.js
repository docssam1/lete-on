/* M-08 — ∞ 기호와 유한소수 판별 */
'use strict';
module.exports=function(H){
  const {C,svg,sheep,pouch,arrow,paper,bubble,txt,ground,wig}=H;
  return { panels:[
    { art: svg(
        '<line x1="100" y1="30" x2="100" y2="110" stroke="'+C.grey+'" stroke-width="2"/>'
        + txt(55,55,20,C.ok,'0.375')
        + txt(55,90,20,C.ok,'✓')
        + txt(145,55,18,C.red,'0.333…')
        + txt(145,90,22,C.red,'∞')),
      text: { ko:'0.375는 소수점 몇 자리에서 끝나는데, 1/3=0.333…은 왜 영원히 끝나지 않을까요?',
              en:'0.375 stops after a few decimal places, but why does 1/3=0.333… never end?',
              zh:'0.375几位小数就结束了，为什么1/3=0.333…却永远停不下来？' } },
    { art: svg(
        paper(30,20,140,90)
        + txt(100,60,50,C.blue,'∞')
        + txt(100,98,16,C.sub,'1655')
        + wig(160,105,0.7)),
      text: { ko:'1655년, 수학자 월리스는 "끝이 없다"는 뜻을 담아 무한대 기호 ∞를 처음 썼어요.',
              en:'In 1655, the mathematician Wallis first used the symbol ∞ to mean "without end".',
              zh:'1655年，数学家沃利斯首次用∞符号表示"没有尽头"。' } },
    { art: svg(
        txt(100,50,26,C.ink,'1')
        + '<line x1="80" y1="60" x2="120" y2="60" stroke="'+C.ink+'" stroke-width="3"/>'
        + txt(100,85,26,C.gold,'3')
        + '<circle cx="100" cy="85" r="22" fill="none" stroke="'+C.blue+'" stroke-width="3"/>'
        + '<line x1="116" y1="101" x2="135" y2="120" stroke="'+C.blue+'" stroke-width="4" stroke-linecap="round"/>'),
      text: { ko:'소수가 끝날지 영원히 반복될지도 같은 질문이에요 — 답은 바로 분모 속에 숨어 있어요.',
              en:'Whether a decimal ends or repeats forever is the very same question — and the answer is hiding right in the denominator.',
              zh:'小数是会结束还是会永远循环，其实是同一个问题——答案就藏在分母里。' } },
    { art: svg(
        txt(50,55,20,C.ok,'2,5')
        + arrow(75,55,115,55,C.ok,3)
        + txt(148,55,20,C.ok,'0.375')
        + txt(50,100,20,C.red,'3,7…')
        + arrow(85,100,115,100,C.red,3)
        + txt(150,100,26,C.red,'∞')),
      text: { ko:'분모의 소인수가 2와 5뿐이면 끝나고, 다른 소인수가 있으면 ∞처럼 영원히 반복돼요.',
              en:'If the denominator\'s only prime factors are 2 and 5, it ends — any other factor, and it repeats forever, like ∞.',
              zh:'分母的质因数只有2和5就会结束；有别的质因数，就会像∞一样永远循环。' } },
  ]};
};
