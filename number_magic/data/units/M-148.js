/* Numbers of Magic — 유닛 M-148: 원리합계 (고등 대수 · 과정 67, 2026-09-29)
   근거: docs/high-build-spec.md MD148. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-148'] = {
  id:'M-148', tier:'algebra', level:'67', order:148,
  generator:'md148_annuity',
  title:{ ko:'원리합계', en:'Compound Savings', zh:'本利和' },
  subtitle:{ ko:'매년 넣은 돈이 등비수열로 자랍니다', en:'Money saved each year grows as a geometric sequence', zh:'每年存的钱按等比数列增长' },
  icon:'🏦',

  practice:{
    generator:'md148_annuity', level:'practice', count:6,
    params:{mode:'save'},
    intro:{
      ko:'목돈은 a(1+r)ⁿ, 같은 금액을 여러 번 적립하면 등비수열의 합으로 원리합계를 구합니다. 거듭제곱은 문제에 주어진 값으로 계산합니다.',
      en:'A lump sum grows to a(1+r)ⁿ; repeated equal deposits add up as a geometric series. Use the power value given in the problem.',
      zh:'整笔存款为a(1+r)ⁿ，多次存入同样金额时用等比数列求和求本利和。幂用题中给出的值计算。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'복리로 맡긴 돈은 해마다 (1+r) 배가 됩니다. 매년 같은 돈을 넣으면 먼저 넣은 돈일수록 더 여러 번 불어나서, 모인 금액은 등비수열을 이룹니다. 등비수열의 합 공식이 곧 저축 계산기입니다.',
        en:'Money left at compound interest is multiplied by (1+r) each year. Saving the same amount every year, the earlier deposits grow more times, so the amounts form a geometric sequence. The geometric-series formula is a savings calculator.',
        zh:'按复利存的钱每年变为(1+r)倍。每年存同样的钱，越早存的增长次数越多，各笔金额成等比数列。等比数列求和公式就是储蓄计算器。' }
    },
    stages:[
      { tag:{ko:'① 목돈의 원리합계',en:'1) A lump sum',zh:'① 整笔存款'},
        head:{ko:'100\\times1.05^{10}=100\\times1.63=163',en:'100\\times1.05^{10}=100\\times1.63=163',zh:'100\\times1.05^{10}=100\\times1.63=163'},
        desc:{ko:'100 만 원을 연이율 5% 로 10년 동안 복리 예금하면 1.05¹⁰=1.63 으로 <b>163</b> 만 원입니다.',en:'100 ten-thousand won at 5% a year compounded for 10 years, with 1.05¹⁰=1.63, becomes <b>163</b> ten-thousand won.',zh:'100万韩元按年利率5%复利存10年，用1.05¹⁰=1.63，得<b>163</b>万韩元。'},
        mathSteps:['a(1+r)^n','100\\times1.63=163'],
        result:{ko:'해마다 1.05 배!',en:'×1.05 every year!',zh:'每年×1.05！'},
        book:{ko:'거듭제곱의 값은 문제에 주어진 값(소수 둘째 자리)을 그대로 씁니다.',en:'Use the power value given in the problem (two decimal places) as it is.',zh:'幂的值直接用题中给出的值(保留两位小数)。'} },

      { tag:{ko:'② 적립',en:'2) Regular deposits',zh:'② 零存整取'},
        head:{ko:'10+10\\times1.05+\\cdots+10\\times1.05^{9}=\\frac{10(1.05^{10}-1)}{0.05}=126',en:'10+10\\times1.05+\\cdots+10\\times1.05^{9}=\\frac{10(1.05^{10}-1)}{0.05}=126',zh:'10+10\\times1.05+\\cdots+10\\times1.05^{9}=\\frac{10(1.05^{10}-1)}{0.05}=126'},
        desc:{ko:'매년 말에 10 만 원씩 10번 넣으면 마지막 돈은 이자가 없고 첫 돈은 9번 불어납니다. 등비수열의 합으로 <b>126</b> 만 원입니다.',en:'Depositing 10 at the end of each year 10 times, the last deposit earns nothing and the first grows 9 times. The geometric sum gives <b>126</b>.',zh:'每年年末存10万韩元共10次，最后一笔没有利息，第一笔增长9次。用等比数列求和得<b>126</b>万韩元。'},
        mathSteps:['\\frac{a\\{(1+r)^n-1\\}}{r}','\\frac{10\\times0.63}{0.05}=126'],
        result:{ko:'적금은 등비수열의 합!',en:'A savings plan is a geometric series!',zh:'零存整取就是等比数列的和！'},
        book:{ko:'매년 초에 넣으면 모든 돈이 한 해씩 더 불어나므로 여기에 1.05 를 곱합니다.',en:'Depositing at the start of each year, every deposit grows one more year, so multiply this by 1.05.',zh:'每年年初存入时，每笔都多增长一年，所以再乘1.05。'} },

      { tag:{ko:'③ 단리와 복리',en:'3) Simple vs compound',zh:'③ 单利与复利'},
        head:{ko:'100\\times1.63-100\\times(1+0.05\\times10)=163-150=13',en:'100\\times1.63-100\\times(1+0.05\\times10)=163-150=13',zh:'100\\times1.63-100\\times(1+0.05\\times10)=163-150=13'},
        desc:{ko:'단리는 원금에만 이자가 붙어 150 만 원, 복리는 163 만 원입니다. 차이는 <b>13</b> 만 원입니다.',en:'Simple interest earns on the principal only: 150; compound gives 163. The difference is <b>13</b>.',zh:'单利只对本金计息为150万韩元，复利为163万韩元，相差<b>13</b>万韩元。'},
        mathSteps:['a(1+rn)','a(1+r)^n'],
        result:{ko:'이자에도 이자가 붙는다!',en:'Interest earns interest!',zh:'利息也生利息！'},
        book:{ko:'두 방법을 비교할 때는 같은 시점(마지막 해의 말)의 금액으로 맞춘 뒤 뺍니다.',en:'To compare two plans, bring both to the same moment (the end of the last year) before subtracting.',zh:'比较两种方式时，先换算成同一时刻(最后一年年末)的金额再相减。'} }
    ],
    rule:{ ko:'① 목돈 a(1+r)ⁿ  ② 기말 적립 a{(1+r)ⁿ−1}/r, 기초 적립은 ×(1+r)  ③ 비교는 같은 시점의 원리합계로',
      en:'① Lump sum a(1+r)ⁿ  ② End-of-period deposits a{(1+r)ⁿ−1}/r; start-of-period ×(1+r)  ③ Compare at the same moment',
      zh:'① 整笔a(1+r)ⁿ  ② 期末存入a{(1+r)ⁿ−1}/r，期初存入×(1+r)  ③ 在同一时刻比较' }
  },

  check:{
    fills:[
      { tex:{ko:'200\\times1.02^{10}=200\\times1.22=\\square',en:'200\\times1.02^{10}=200\\times1.22=\\square',zh:'200\\times1.02^{10}=200\\times1.22=\\square'}, answer:244,
        hint:{ko:'200×1.22',en:'200×1.22',zh:'200×1.22'} },
      { tex:{ko:'\\frac{20(1.22-1)}{0.02}=\\square',en:'\\frac{20(1.22-1)}{0.02}=\\square',zh:'\\frac{20(1.22-1)}{0.02}=\\square'}, answer:220,
        hint:{ko:'20×11',en:'20×11',zh:'20×11'} }
    ],
    open:{ ko:'매년 초에 적립한 원리합계가 매년 말에 적립한 것의 (1+r) 배인 까닭을 설명해 봅니다.',
      en:'Explain why saving at the start of each year gives (1+r) times the total of saving at the end of each year.',
      zh:'说说为什么每年年初存入的本利和是每年年末存入的(1+r)倍。' },
    openHint:{ ko:'매년 초에 넣은 돈은 같은 해 말에 넣은 돈보다 한 해 더 이자를 받습니다. 모든 금액이 (1+r) 배이므로 합도 (1+r) 배입니다.',
      en:'Each start-of-year deposit earns one more year of interest than the matching end-of-year one. Every amount is (1+r) times as large, so the total is too.',
      zh:'年初存的钱比同年年末存的钱多计一年利息。每一笔都是(1+r)倍，所以总和也是(1+r)倍。' }
  },

  lab:{
    generator:'md148_annuity', level:'main', count:6,
    params:{mode:'pay'},
    intro:{
      ko:'목표 금액이나 빌린 금액이 주어지면 원리합계의 식을 세워 매번 넣거나 갚을 금액을 구합니다.',
      en:'Given a target or a loan, set up the compound-total equation and solve for each deposit or repayment.',
      zh:'给出目标金额或借款时，列出本利和的式子，求出每次存入或偿还的金额。'
    }
  },

  arena:{
    generator:'md148_annuity', level:'main', count:6, timeLimit:420,
    params:{mode:'compare'},
    rule:{ ko:'7분 안에 두 저축 방법을 모두 비교합니다!', en:'Compare every pair of savings plans within 7 minutes!', zh:'7分钟内比较完所有储蓄方式！' }
  },

  stamp:{ label:{ ko:'복리 설계사', en:'Interest Planner', zh:'复利规划师' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'원리합계를 딱 맞혔어! 🏦',en:'Exact total!',zh:'本利和算得正好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'주어진 거듭제곱 값을 썼는지 봐!',en:'Did you use the given power value?',zh:'用了题中给的幂的值吗？'}, {ko:'초에 넣었는지 말에 넣었는지 봐!',en:'Start or end of the period?',zh:'看清是期初还是期末！'} ],
    finish:{ ko:'완벽해! 복리 설계사! 🏦✨', en:'Perfect! Interest Planner!', zh:'完美！复利规划师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
