/* M-16 — 숨은 짝을 찾는 습관, 근호까지 이어지다 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<circle cx="46" cy="66" r="24" fill="'+C.blue+'"/>'
        +txt(46,74,24,'#fff','2')
        +txt(84,72,20,C.ink,'×')
        +'<circle cx="120" cy="66" r="24" fill="'+C.gold+'"/>'
        +txt(120,74,24,'#fff','5')
        +arrow(150,66,168,66,C.ink,2)
        +txt(186,72,18,C.ink,'10')),
      text: { ko:'2와 5가 만나면 10이 되는 이야기, 기억하나요? 소인수분해에서 "숨은 짝"을 찾는 건 그때부터 이어진 습관이에요.',
              en:'Remember how 2 and 5 meet to make 10? Hunting for a "hidden pair" in prime factorization is a habit that began right there.',
              zh:'还记得2和5相遇变成10的故事吗？在质因数分解中寻找"隐藏配对"，这个习惯就是从那时延续下来的。' } },
    { art: svg(
        txt(45,55,30,C.ink,'√48','font-family="Georgia,serif"')
        +'<rect x="20" y="90" width="26" height="26" rx="4" fill="'+C.wool+'" stroke="'+C.ink+'" stroke-width="2"/>'
        +txt(33,109,15,C.ink,'2')
        +'<rect x="54" y="90" width="26" height="26" rx="4" fill="'+C.wool+'" stroke="'+C.ink+'" stroke-width="2"/>'
        +txt(67,109,15,C.ink,'2')
        +'<rect x="88" y="90" width="26" height="26" rx="4" fill="'+C.wool+'" stroke="'+C.ink+'" stroke-width="2"/>'
        +txt(101,109,15,C.ink,'2')
        +'<rect x="122" y="90" width="26" height="26" rx="4" fill="'+C.wool+'" stroke="'+C.ink+'" stroke-width="2"/>'
        +txt(135,109,15,C.ink,'2')
        +'<rect x="156" y="90" width="26" height="26" rx="4" fill="'+C.wool+'" stroke="'+C.ink+'" stroke-width="2"/>'
        +txt(169,109,15,C.ink,'3')
        +'<rect x="17" y="86" width="66" height="34" rx="6" fill="none" stroke="'+C.gold+'" stroke-width="2.5" stroke-dasharray="4 3"/>'),
      text: { ko:'48을 소인수분해하면 2,2,2,2,3 — 2가 두 번씩 짝지어 나와요.',
              en:'Factor 48 into primes and you get 2,2,2,2,3 — the 2s pair up twice.',
              zh:'把48做质因数分解得到2,2,2,2,3——2两两配对出现。' } },
    { art: svg(
        '<circle cx="55" cy="92" r="9" fill="'+C.wool+'" stroke="'+C.blue+'" stroke-width="2"/>'
        +txt(55,97,12,C.blue,'2')
        +'<circle cx="72" cy="92" r="9" fill="'+C.wool+'" stroke="'+C.blue+'" stroke-width="2"/>'
        +txt(72,97,12,C.blue,'2')
        +arrow(65,78,50,52,C.gold,2)
        +txt(28,50,34,C.gold,'4')
        +txt(140,55,30,C.ink,'√3','font-family="Georgia,serif"')),
      text: { ko:'짝지은 2×2=4가 근호 밖으로 걸어 나오고, 남은 3은 그대로 근호 안에 있어요.',
              en:'The paired 2×2=4 steps outside the root, while the leftover 3 stays inside.',
              zh:'配对的2×2=4走出根号，剩下的3还留在根号里。' } },
    { art: svg(
        txt(100,68,30,C.ink,'√48=4√3','font-family="Georgia,serif"')
        +stick(30,105,1,C.blue)
        +txt(172,105,20,C.gold,'✨')),
      text: { ko:'그래서 √48은 가장 간단한 꼴로 4√3이 돼요 — 숨은 짝을 찾아내는 감각은 여전히 통해요!',
              en:'So √48 simplifies to 4√3 — the instinct for spotting hidden pairs still works!',
              zh:'所以√48化简后就是4√3——寻找隐藏配对的直觉依然管用！' } },
  ]};
};
