/* Numbers of Magic — 유닛 H-10: 제곱수의 합 (고급 E-1 · 경시의 탑 28 제곱의 산 · 고등 선행) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['H-10'] = {
  id:'H-10', tier:'advanced', level:'28', order:4,
  lineage:['rainbow-sum'],
  generator:'adv_sumSquares',
  title:{ ko:'제곱수의 합', en:'Sum of Consecutive Squares', zh:'连续平方数之和' },
  subtitle:{ ko:'1²+2²+…+n²도 공식 하나로 한 번에!', en:'1²+2²+…+n² — one formula does it all!', zh:'1²+2²+…+n²也能靠一个公式秒算！' },
  icon:'📐',

  practice:{
    generator:'adv_sumSquares', level:'practice', count:5,
    params:{level:'practice'},
    intro:{
      ko:'무지개 덧셈법이 제곱수에도 통할까? 공식을 알아보자!',
      en:'Does the rainbow-sum trick work for squares too? Let\'s find the formula!',
      zh:'彩虹加法对平方数也管用吗？来找找公式吧！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 제곱수를 다 더하는 공식',en:'1) One formula for all the squares',zh:'① 一个公式加完所有平方数'},
        head:{ko:'1²+2²+3²+4²+5² = 5×6×11÷6 = 55',en:'1²+2²+3²+4²+5² = 5×6×11÷6 = 55',zh:'1²+2²+3²+4²+5² = 5×6×11÷6 = 55'},
        desc:{ko:'1부터 n까지 <b>제곱을 다 더한 값</b>은 놀랍게도 공식이 있어요: <b>n×(n+1)×(2n+1)÷6</b>. n=5로 확인해봐요: 5×6×11=330, 330÷6=<b>55</b>. 진짜로 1+4+9+16+25=55! 무지개 덧셈법(1~n의 합)은 n(n+1)÷2였는데, 제곱수는 여기에 (2n+1)이 하나 더 붙고 6으로 나눠요.',
              en:'The <b>sum of all squares from 1 to n</b> has a formula too: <b>n×(n+1)×(2n+1)÷6</b>. Check with n=5: 5×6×11=330, 330÷6=<b>55</b>. Indeed, 1+4+9+16+25=55! The rainbow-sum for plain numbers was n(n+1)÷2 — squares add one more factor (2n+1) and divide by 6.',
              zh:'从1加到n的<b>所有平方数之和</b>竟然也有公式：<b>n×(n+1)×(2n+1)÷6</b>。用n=5验证：5×6×11=330，330÷6=<b>55</b>。真的，1+4+9+16+25=55！普通数的彩虹求和是n(n+1)÷2，平方数只是多了一个(2n+1)因子，再除以6。'},
        mathSteps:['5×6 = 30','30×11 = 330','330÷6 = 55'],
        result:{ko:'1²+…+5²=55! n(n+1)(2n+1)÷6 공식 하나면 끝나요.',en:'1²+…+5²=55! One formula: n(n+1)(2n+1)÷6.',zh:'1²+…+5²=55！一个公式n(n+1)(2n+1)÷6就搞定。'},
        book:{ko:'경시의 탑 다음 목표는 1³+2³+…+n³이에요 — 놀랍게도 이건 (1+2+…+n)²과 같아요! 세제곱의 합은 그냥 합의 제곱이랍니다.',
              en:'The next mystery in the Tower is 1³+2³+…+n³ — amazingly, it equals (1+2+…+n)²! The sum of cubes is just the square of the sum.',
              zh:'"竞赛之塔"的下一个谜题是1³+2³+…+n³——神奇的是它等于(1+2+…+n)²！立方数之和竟然就是求和结果的平方。'} },

      { tag:{ko:'② 1이 아닌 곳부터 시작할 땐',en:'2) When you don\'t start at 1',zh:'② 不从1开始时'},
        head:{ko:'4²+5²+6²+7²+8² = (1~8의 합)−(1~3의 합)',en:'4²+…+8² = (sum 1..8) − (sum 1..3)',zh:'4²+…+8² = (1~8之和) − (1~3之和)'},
        desc:{ko:'항상 1부터 시작하는 건 아니죠. 4²부터 8²까지 더하고 싶다면, <b>1~8까지의 제곱 합에서 1~3까지의 제곱 합을 빼면</b> 돼요! 1~8: 8×9×17÷6=204. 1~3: 3×4×7÷6=14. 204−14=<b>190</b>. 필요 없는 앞부분을 큰 구간에서 덜어내는 방식이에요 — 실제로 이런 문제가 훨씬 더 많이 나와요.',
              en:'You won\'t always start at 1. To add 4² through 8², compute the <b>sum 1 to 8, then subtract the sum 1 to 3</b>! Sum 1–8: 8×9×17÷6=204. Sum 1–3: 3×4×7÷6=14. 204−14=<b>190</b>. You trim the unneeded front part off a bigger range — and this is actually the more common case.',
              zh:'并不总是从1开始。要算4²到8²之和，就<b>用1到8的和，减去1到3的和</b>！1到8：8×9×17÷6=204。1到3：3×4×7÷6=14。204−14=<b>190</b>。从更大的区间里去掉不需要的前面部分——这其实是更常见的情况。'},
        mathSteps:['8×9×17÷6 = 204 (1~8)','3×4×7÷6 = 14 (1~3)','204−14 = 190'],
        result:{ko:'4²+…+8²=190! 큰 구간에서 필요 없는 앞부분을 빼요.',en:'4²+…+8²=190! Subtract the unneeded front from the bigger range.',zh:'4²+…+8²=190！从大区间里减去不需要的前面部分。'},
        book:{ko:'홀수·짝수만 더하는 것(고급C)과 달리, 이 공식은 <b>연속한 모든 자연수</b>의 제곱에만 통해요 — 등차가 다른 수열엔 못 써요.',
              en:'Unlike summing only odd or even numbers, this formula only works for squares of <b>every consecutive whole number</b> — not for sequences with a different common difference.',
              zh:'和只加奇数或偶数不同，这个公式只对<b>每一个连续自然数</b>的平方有效——公差不同的数列用不了。'} }
    ],
    rule:{ ko:'① 1~n 제곱의 합 = n(n+1)(2n+1)÷6  ② 1이 아닌 곳부터면 (끝까지의 합)−(시작 전까지의 합)  ③ 연속한 자연수에만 통해요',
      en:'① Sum of squares 1 to n = n(n+1)(2n+1)÷6  ② Not starting at 1? Subtract (sum before start) from (sum to end)  ③ Only works for consecutive whole numbers',
      zh:'① 1到n的平方和 = n(n+1)(2n+1)÷6  ② 不从1开始就用（到末尾的和）减（起点之前的和）  ③ 只对连续自然数有效' }
  },

  check:{
    fills:[
      { tex:'1^2+2^2+3^2+4^2 = \\square', answer:30,
        hint:{ ko:'4×5×9÷6', en:'4×5×9÷6', zh:'4×5×9÷6' } },
      { tex:'6^2+7^2+8^2 = \\square', answer:149,
        hint:{ ko:'(1~8의 합)−(1~5의 합) = 204−55', en:'(sum 1..8)−(sum 1..5) = 204−55', zh:'(1~8之和)−(1~5之和) = 204−55' } }
    ],
    open:{ ko:'10²부터 15²까지 더하는 방법을 설명하고 답을 구해 봐요.',
      en:'Explain how to add 10² through 15², and find the answer.',
      zh:'说说怎么算10²加到15²，并求出答案。' },
    openHint:{ ko:'예) 1~15 합(15×16×31÷6=1240)에서 1~9 합(9×10×19÷6=285)을 빼요: 1240−285=955.',
      en:'e.g. Sum 1–15 (15×16×31÷6=1240) minus sum 1–9 (9×10×19÷6=285): 1240−285=955.',
      zh:'例）1~15的和（15×16×31÷6=1240）减去1~9的和（9×10×19÷6=285）：1240−285=955。' }
  },

  lab:{
    generator:'adv_sumSquares', level:'practice', count:4,
    params:{level:'practice'},
    intro:{
      ko:'작은 구간으로 공식을 손에 익혀보자!',
      en:'Get comfortable with the formula on small ranges!',
      zh:'先在小区间上把公式练熟！'
    }
  },

  arena:{
    generator:'adv_sumSquares', level:'main', count:8, timeLimit:300,
    params:{level:'main'},
    rule:{ ko:'5분 안에 세 자리 구간 제곱수의 합을 모두 풀어요!', en:'Solve all 3-digit-range sums of squares in 5 minutes!', zh:'5分钟内解答所有三位数区间的平方和！' }
  },

  stamp:{ label:{ ko:'제곱수의 합 현자', en:'Sum-of-Squares Sage', zh:'平方和贤者' }, coins:38 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'공식을 완벽하게 썼어! 📐',en:'Formula used perfectly!',zh:'公式用得完美！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'1이 아닌 곳부터면 빼기를 잊지 마!',en:'Don\'t forget to subtract when not starting at 1!',zh:'不从1开始别忘了要减！'}, {ko:'n(n+1)(2n+1)÷6 순서대로 계산해봐!',en:'Work through n(n+1)(2n+1)÷6 step by step!',zh:'按n(n+1)(2n+1)÷6一步步算！'} ],
    finish:{ ko:'완벽해! 제곱수의 합 현자! 📐✨', en:'Perfect! Sum-of-Squares Sage!', zh:'完美！平方和贤者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
