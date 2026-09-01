/* C-06 — 구거법과 ×9 전략 마법 */
'use strict';
module.exports=function(H){
  const {C,svg,merchant,sheep,pouch,numi,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        txt(70,60,20,C.blue,'37×9')
        +arrow(70,72,70,92,C.gold,3)
        +txt(70,116,20,C.ink,'333')
        +txt(150,90,16,C.sub,'?')
        +numi(160,50,0.75)),
      text: { ko:'어떤 수든 자릿수를 다 더하고, 또 더해서 한 자리로 만들어 보세요. 9의 배수는 항상 무엇이 나올까요?',
              en:'Add up all the digits of any number, then add again until one digit is left. What always comes out for multiples of 9?',
              zh:'把任意数的各位数字相加，再相加直到剩一位。9的倍数总会得到什么？' } },
    { art: svg(
        txt(70,50,17,C.ink,'3+3+3')
        +arrow(70,60,70,84,C.gold,3)
        +'<circle cx="130" cy="72" r="22" fill="none" stroke="'+C.ok+'" stroke-width="3"/>'
        +txt(130,80,26,C.ok,'9')),
      text: { ko:'3+3+3=9. 언제나 9예요! 9로 나눈 나머지가 자릿수 합에 그대로 남기 때문이에요.',
              en:'3+3+3=9. Always 9! The remainder when divided by 9 survives in the digit sum.',
              zh:'3+3+3=9。总是9！因为除以9的余数会原样留在数位和里。' } },
    { art: svg(
        merchant(46,86,1.15)
        +paper(84,40,80,66)
        +txt(124,66,16,C.blue,'37×9')
        +txt(124,88,16,C.gold,'333')
        +'<path d="M 92 106 L 156 106" stroke="'+C.ink+'" stroke-width="1.6"/>'),
      text: { ko:'계산기가 없던 시절, 상인들은 이 방법(구거법)으로 장부를 검산했대요.',
              en:'Before calculators, merchants used this trick — casting out nines — to check their ledgers.',
              zh:'没有计算器的年代，商人用这个方法（弃九法）核对账本。' } },
    { art: svg(
        '<rect x="40" y="46" width="120" height="50" rx="6" fill="#fff" stroke="'+C.ink+'" stroke-width="2.5"/>'
        +'<line x1="40" y1="66" x2="160" y2="66" stroke="'+C.mist+'" stroke-width="10"/>'
        +'<circle cx="140" cy="78" r="8" fill="none" stroke="'+C.red+'" stroke-width="2.5"/>'
        +txt(140,82,10,C.red,'9')
        +txt(60,58,14,C.blue,'×9')
        +txt(60,90,10,C.gold,'×10−1')),
      text: { ko:'지금도 카드 번호·바코드의 맨 끝 자리가 같은 아이디어로 잘못 입력된 숫자를 걸러낸답니다.',
              en:'Card numbers and barcodes still use the same idea — a last digit that catches mistyped numbers.',
              zh:'如今卡号和条形码的最后一位，仍用同样的想法挡住输错的号码。' } },
  ]};
};
