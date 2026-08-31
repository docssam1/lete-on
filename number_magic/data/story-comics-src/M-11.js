/* M-11 — 문자는 숫자를 담는 상자 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<rect x="28" y="42" width="52" height="52" rx="6" fill="'+C.wool+'" stroke="'+C.ink+'" stroke-width="2.5"/>'
        +txt(54,76,26,C.blue,'a','font-style="italic" font-family="Georgia,serif"')
        +'<rect x="120" y="42" width="52" height="52" rx="6" fill="'+C.wool+'" stroke="'+C.ink+'" stroke-width="2.5"/>'
        +txt(146,76,22,C.red,'−a','font-style="italic" font-family="Georgia,serif"')
        +txt(100,26,20,C.gold,'?')),
      text: { ko:'a와 −a 중에 어느 쪽이 더 큰 수일까요?',
              en:'Which is larger, a or −a?',
              zh:'a和−a，哪个更大？' } },
    { art: svg(
        '<rect x="28" y="50" width="52" height="44" rx="6" fill="'+C.wool+'" stroke="'+C.ok+'" stroke-width="3"/>'
        +txt(54,80,24,C.ok,'3','font-family="Georgia,serif"')
        +'<rect x="120" y="60" width="52" height="34" rx="6" fill="'+C.wool+'" stroke="'+C.grey+'" stroke-width="2"/>'
        +txt(146,84,20,C.sub,'−3','font-family="Georgia,serif"')
        +txt(100,30,18,C.ok,'a>−a')),
      text: { ko:'a가 3이면 얼핏 a가 더 커 보여요.',
              en:'If a is 3, at first glance a looks bigger.',
              zh:'如果a是3，看起来好像a更大。' } },
    { art: svg(
        '<rect x="28" y="60" width="52" height="34" rx="6" fill="'+C.wool+'" stroke="'+C.grey+'" stroke-width="2"/>'
        +txt(54,84,20,C.sub,'−3','font-family="Georgia,serif"')
        +'<rect x="120" y="50" width="52" height="44" rx="6" fill="'+C.wool+'" stroke="'+C.red+'" stroke-width="3"/>'
        +txt(146,80,24,C.red,'3','font-family="Georgia,serif"')
        +txt(100,30,18,C.red,'−a>a')),
      text: { ko:'그런데 a가 −3이면? −a는 3이 되어 오히려 더 커요!',
              en:'But if a is −3? Then −a becomes 3 — and it ends up bigger instead!',
              zh:'可如果a是−3呢？−a就变成3，反而更大！' } },
    { art: svg(
        txt(100,22,15,C.ink,'3x²×4x³')
        +arrow(68,32,42,58,C.gold,2)
        +arrow(132,32,158,58,C.gold,2)
        +'<rect x="18" y="60" width="55" height="45" rx="6" fill="'+C.wool+'" stroke="'+C.blue+'" stroke-width="2.5"/>'
        +txt(45,90,22,C.blue,'12')
        +'<rect x="125" y="60" width="55" height="45" rx="6" fill="'+C.wool+'" stroke="'+C.purple+'" stroke-width="2.5"/>'
        +txt(152,90,20,C.purple,'x⁵','font-style="italic"')),
      text: { ko:'그래서 계산할 때도 상자(문자)는 상자끼리, 숫자는 숫자끼리 따로 묶어요 — 3x²×4x³=12x⁵!',
              en:'That is why we group boxes (letters) with boxes and numbers with numbers when calculating — 3x²×4x³=12x⁵!',
              zh:'所以计算时也要把盒子(字母)归盒子，数字归数字——3x²×4x³=12x⁵！' } },
  ]};
};
