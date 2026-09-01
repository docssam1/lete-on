/* M-02 — 상인의 장부, 재산은 +, 빚은 − */
'use strict';
module.exports=function(H){
  const {C,svg,sheep,pouch,arrow,paper,bubble,txt,ground,merchant,scholar}=H;
  return { panels:[
    { art: svg(
        ground(115)
        + merchant(50,90,1.05)
        + pouch(90,80,3)
        + txt(90,60,20,C.ok,'+')
        + paper(120,50,50,40)
        + txt(145,75,20,C.red,'−')),
      text: { ko:'상인은 판 물건에서 남은 이익은 +로, 빌린 돈은 −로 나누어 적어 두었어요.',
              en:'A merchant kept separate records: profit marked with +, borrowed money marked with −.',
              zh:'商人把卖货赚的利润记作+，把借来的钱记作−，分开登记。' } },
    { art: svg(
        paper(20,20,160,100)
        + txt(100,50,22,C.ink,'628')
        + txt(70,95,26,C.ok,'+')
        + txt(130,95,26,C.red,'−')
        + scholar(165,100,0.8)),
      text: { ko:'서기 628년 무렵 인도 수학자들도 재산은 +, 빚은 −로 적고 계산 규칙까지 정리했어요.',
              en:'Around 628 CE, Indian mathematicians wrote wealth as + and debt as −, and worked out the rules for combining them.',
              zh:'大约公元628年，印度数学家也把财产记作+、债务记作−，并整理出运算规则。' } },
    { art: svg(
        ground(110)
        + '<line x1="100" y1="30" x2="100" y2="70" stroke="'+C.ink+'" stroke-width="3"/>'
        + '<line x1="60" y1="45" x2="140" y2="45" stroke="'+C.ink+'" stroke-width="3"/>'
        + pouch(60,70,3)
        + pouch(140,70,3)
        + txt(60,40,18,C.ok,'+')
        + txt(140,40,18,C.red,'−')),
      text: { ko:'음수는 어려워서 늦게 나온 게 아니라, 장사와 이자 계산이라는 실용적 필요 때문에 일찍 태어났어요.',
              en:'Negative numbers did not arrive late because they were hard — they were born early, from the very practical need to handle trade and interest.',
              zh:'负数出现得并不晚——它是因为贸易和利息计算这种实际需要而很早诞生的。' } },
    { art: svg(
        paper(20,30,160,80)
        + txt(60,80,24,C.ok,'+')
        + txt(100,80,24,C.ink,'=')
        + txt(140,80,24,C.red,'−')
        + merchant(100,45,0.7)),
      text: { ko:'그래서 부호가 같으면 더하고 다른 부호는 큰 쪽을 따르는 규칙, 상인의 장부에서 시작됐어요.',
              en:'So the rule — add same signs, follow the bigger one when signs differ — began right there in the merchant\'s ledger.',
              zh:'所以"同号相加、异号跟大的符号"这条规则，正是从商人的账本开始的。' } },
  ]};
};
