/* C-01 — 지구 무게와 거듭제곱 마법 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,numi,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<circle cx="60" cy="70" r="40" fill="'+C.mist+'" stroke="'+C.blue+'" stroke-width="3"/>'
        +'<path d="M 40 50 Q 60 44 80 54" fill="none" stroke="'+C.ok+'" stroke-width="3"/>'
        +'<path d="M 32 80 Q 56 90 78 78" fill="none" stroke="'+C.ok+'" stroke-width="3"/>'
        +txt(150,50,10,C.sub,'5,980,000,000,')
        +txt(150,64,10,C.sub,'000,000,000,000,')
        +txt(150,78,10,C.sub,'000,000 kg')),
      text: { ko:'지구의 무게는 5,980,000,000,000,000,000,000,000 kg이에요. 0이 몇 개인지 세어 봤나요?',
              en:'Earth weighs 5,980,000,000,000,000,000,000,000 kg. Did you count all those zeros?',
              zh:'地球的质量是5,980,000,000,000,000,000,000,000公斤。数过有几个0吗？' } },
    { art: svg(
        txt(100,50,13,C.sub,'…000,000 kg')
        +'<circle cx="150" cy="42" r="8" fill="none" stroke="'+C.red+'" stroke-width="2.5"/>'
        +txt(150,46,11,C.red,'0')
        +arrow(150,58,120,86,C.red,2.6)
        +txt(70,110,16,C.red,'×10')
        +numi(40,94,0.95)),
      text: { ko:'0을 하나 더 쓰거나 빠뜨리면 열 배가 틀려요. 큰 수일수록 이렇게 쓰기는 위험하답니다.',
              en:'One extra or missing zero throws the number off by ten times — risky for such a huge number.',
              zh:'多写或漏写一个0，就会差十倍——数越大，这样写就越危险。' } },
    { art: svg(
        paper(40,36,120,56)
        +txt(70,72,20,C.blue,'5.98')
        +txt(112,58,14,C.gold,'×10')
        +txt(140,50,11,C.gold,'24')
        +txt(100,108,11,C.sub,'kg')),
      text: { ko:'그래서 5.98 × 10²⁴ kg — 한 줄이면 끝이에요! 거듭제곱으로 큰 수를 안전하게 적는 거죠.',
              en:'So it becomes 5.98 × 10²⁴ kg — one short line! A power of ten writes big numbers safely.',
              zh:'于是写成5.98×10²⁴公斤——一行就够了！用乘方安全地表示大数。' } },
    { art: svg(
        '<rect x="70" y="30" width="60" height="90" rx="10" fill="#fff" stroke="'+C.ink+'" stroke-width="2.5"/>'
        +'<rect x="80" y="40" width="40" height="60" fill="'+C.mist+'"/>'
        +'<circle cx="100" cy="110" r="6" fill="none" stroke="'+C.ink+'" stroke-width="2"/>'
        +txt(100,66,14,C.blue,'1TB')
        +txt(100,86,13,C.gold,'10¹²')),
      text: { ko:'휴대폰 저장 용량 1TB도 10¹² 바이트 — 이 유닛 2³=2×2×2=8과 같은 표기법이에요!',
              en:'A phone\'s 1 TB storage is 10¹² bytes too — the same notation as this unit\'s 2³=2×2×2=8!',
              zh:'手机的1TB也是10¹²字节——和本单元2³=2×2×2=8用的是同一套记法！' } },
  ]};
};
