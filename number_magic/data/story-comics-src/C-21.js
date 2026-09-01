/* C-21 — 타율로 만나는 분수: 2/3과 3/4은 어떻게 더할까 */
'use strict';
module.exports = function(H){
  const {C,svg,arrow,paper,bubble,txt,ground,boy}=H;
  return { panels:[
    { art: svg(
        ground(115)
        +'<polygon points="150,58 170,78 150,98 130,78" fill="none" stroke="'+C.gold+'" stroke-width="2"/>'
        +boy(50,85,1.15)
        +'<line x1="58" y1="80" x2="80" y2="60" stroke="'+C.brown+'" stroke-width="4" stroke-linecap="round"/>'
        +'<circle cx="94" cy="48" r="5" fill="'+C.gold+'" stroke="'+C.ink+'" stroke-width="1.5"/>'
        +txt(105,40,18,C.blue,'2/3')
        +txt(105,120,18,C.red,'3/4')),
      text: { ko:'어제는 3타수 중 2안타(2/3), 오늘은 4타수 중 3안타(3/4)를 쳤어요.',
              en:'Yesterday: 2 hits in 3 at-bats (2/3). Today: 3 hits in 4 at-bats (3/4).',
              zh:'昨天3打数2安打（2/3），今天4打数3安打（3/4）。' } },
    { art: svg(
        ground(115)
        +boy(50,90,1.15)
        +bubble(132,50,40,24,102,78)
        +txt(132,46,12,C.ink,'2/3+3/4')
        +txt(132,62,12,C.ink,'÷2=?')),
      text: { ko:'이틀 평균 타율은 2/3과 3/4을 더해서 반으로 나누면 되는 걸까요?',
              en:"Is the two-day average just adding 2/3 and 3/4, then halving?",
              zh:'两天的平均打击率，是把2/3和3/4相加再除以2吗？' } },
    { art: svg(
        paper(14,14,72,36)
        +txt(50,37,15,C.ink,'3+4=7')
        +paper(114,14,72,36)
        +txt(150,37,15,C.ink,'2+3=5')
        +arrow(50,54,92,92,C.gold,3)
        +arrow(150,54,118,92,C.gold,3)
        +txt(105,122,26,C.ok,'5/7')),
      text: { ko:'아니에요! 전체 타수 3+4=7, 전체 안타 2+3=5 — 진짜 평균은 5/7이에요.',
              en:'No! Total at-bats 3+4=7, total hits 2+3=5 — the real average is 5/7.',
              zh:'不对！总打数3+4=7，总安打2+3=5——真正的平均是5/7。' } },
    { art: svg(
        ground(115)
        +'<circle cx="55" cy="75" r="32" fill="'+C.gold+'" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<line x1="55" y1="75" x2="55" y2="43" stroke="'+C.ink+'" stroke-width="1.5"/>'
        +'<line x1="55" y1="75" x2="85" y2="92" stroke="'+C.ink+'" stroke-width="1.5"/>'
        +'<line x1="55" y1="75" x2="25" y2="92" stroke="'+C.ink+'" stroke-width="1.5"/>'
        +txt(148,70,24,C.ok,'5/7')
        +'<path d="M 128 100 L 138 110 L 156 88" fill="none" stroke="'+C.ok+'" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'),
      text: { ko:'분수를 다룰 땐 무엇을 몇 등분했는지부터 확인해요 — 이게 언제나 첫걸음이에요!',
              en:"With fractions, always check what's divided into how many parts first — that's always the first step!",
              zh:'处理分数时，先弄清楚是把什么分成了几份——这永远是第一步！' } },
  ]};
};
