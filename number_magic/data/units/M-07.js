/* Numbers of Magic — 유닛 M-07: 유리수의 곱셈과 나눗셈 (중등 W8 · 중1 정수와 유리수) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-07'] = {
  id:'M-07', tier:'middle1', level:'31', order:7,
  generator:'md7_ratMulDiv',
  title:{ ko:'유리수의 곱셈과 나눗셈', en:'Multiplying & Dividing Rational Numbers', zh:'有理数的乘除法' },
  subtitle:{ ko:'나눗셈은 역수를 곱하는 것 — 뒤집으면 곱셈이 돼요', en:'Division = multiply by the reciprocal — flip it and it becomes multiplication', zh:'除法＝乘以倒数——翻过来就变成乘法' },
  icon:'🔄',

  practice:{
    generator:'md7_ratMulDiv', level:'practice', count:5,
    params:{mode:'mul'},
    intro:{
      ko:'유리수 곱셈도 부호 먼저! 그다음 분자는 분자끼리, 분모는 분모끼리.',
      en:'Rational multiplication: sign first, then numerators together and denominators together.',
      zh:'有理数乘法也先看符号！然后分子乘分子，分母乘分母。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 분자는 분자끼리, 분모는 분모끼리',en:'1) Numerators together, denominators together',zh:'① 分子乘分子，分母乘分母'},
        head:{ko:'\\dfrac{-2}{3} \\times \\dfrac{4}{5} = \\dfrac{-8}{15}',en:'\\dfrac{-2}{3} \\times \\dfrac{4}{5} = \\dfrac{-8}{15}',zh:'\\dfrac{-2}{3} \\times \\dfrac{4}{5} = \\dfrac{-8}{15}'},
        desc:{ko:'음수가 1개(홀수)니까 부호는 −. 분자끼리 2×4=8, 분모끼리 3×5=15 → <b>−8/15</b>. 정수 곱셈의 부호 규칙이 유리수에도 그대로 통해요.',
              en:'One negative (odd) means the sign is −. Numerators: 2×4=8; denominators: 3×5=15 → <b>−8/15</b>. The integer sign rule carries straight over to rationals.',
              zh:'1个负数(奇数)，符号是−。分子2×4=8，分母3×5=15→<b>−8/15</b>。整数乘法的符号规则在有理数里同样适用。'},
        mathSteps:['\\dfrac{-2}{3}\\times\\dfrac{4}{5}', '2\\times4=8,\\;\\;3\\times5=15', '\\dfrac{-8}{15}'],
        result:{ko:'부호는 먼저, 곱셈은 분자·분모 각각!',en:'Sign first, then multiply numerators and denominators separately!',zh:'先定符号，再分子分母各自相乘！'},
        book:null },

      { tag:{ko:'② 나눗셈은 역수를 곱해요',en:'2) Division multiplies by the reciprocal',zh:'② 除法要乘以倒数'},
        head:{ko:'\\dfrac{3}{4} \\div \\dfrac{-2}{5} = \\dfrac{-15}{8}',en:'\\dfrac{3}{4} \\div \\dfrac{-2}{5} = \\dfrac{-15}{8}',zh:'\\dfrac{3}{4} \\div \\dfrac{-2}{5} = \\dfrac{-15}{8}'},
        desc:{ko:'두 수의 곱이 1이 되게 하는 수를 <b>역수</b>라고 해요 — \\dfrac{-2}{5}의 역수는 \\dfrac{5}{-2}. 나눗셈은 나누는 수의 역수를 <b>곱셈</b>으로 바꿔서 계산해요: \\dfrac{3}{4}\\times\\dfrac{5}{-2}=\\dfrac{15}{-8}=<b>−15/8</b>.',
              en:'A <b>reciprocal</b> is the number that makes the product 1 — the reciprocal of −2/5 is 5/−2. Division turns into <b>multiplication</b> by the reciprocal of the divisor: 3/4 × 5/(−2) = 15/(−8) = <b>−15/8</b>.',
              zh:'两数相乘等于1，这两个数互为<b>倒数</b>——−2/5的倒数是5/(−2)。除法要换成乘以除数的<b>倒数</b>：3/4×5/(−2)=15/(−8)=<b>−15/8</b>。'},
        mathSteps:['\\dfrac{3}{4}\\div\\dfrac{-2}{5}', '\\dfrac{3}{4}\\times\\dfrac{5}{-2}', '\\dfrac{-15}{8}'],
        result:{ko:'나눗셈이 보이면 곧바로 "역수 곱셈"으로 바꿔 생각해요!',en:'See division? Instantly rethink it as "multiply by the reciprocal"!',zh:'看到除法，立刻想成"乘以倒数"！'},
        book:{ko:'곱셈·나눗셈이 섞여 있으면 음수 개수로 부호를 먼저 정하고, 나눗셈은 전부 역수의 곱셈으로 바꾼 뒤 계산해요.',
              en:'When × and ÷ mix, decide the sign from the negative count first, turn every ÷ into ×-by-reciprocal, then compute.',
              zh:'乘除混合时，先用负数个数定符号，把所有除法都换成乘以倒数，再计算。'} }
    ],
    rule:{ ko:'① 부호를 먼저 정하기(음수 개수)  ② 분자는 분자끼리, 분모는 분모끼리 곱하기  ③ 나눗셈은 역수의 곱셈으로',
      en:'① Decide the sign first (count negatives)  ② Multiply numerators together, denominators together  ③ Division = multiplication by the reciprocal',
      zh:'① 先定符号(数负数个数)  ② 分子乘分子，分母乘分母  ③ 除法＝乘以倒数' }
  },

  check:{
    fills:[
      { tex:'\\dfrac{-1}{2} \\times \\dfrac{-3}{5} = \\dfrac{\\square}{10}', answer:3,
        hint:{ ko:'음수 2개(짝수)→+, 1×3=3', en:'2 negatives (even)→+, 1×3=3', zh:'2个负数(偶数)→+，1×3=3' } },
      { tex:'\\text{역수: } \\dfrac{2}{-7} \\rightarrow \\dfrac{-7}{\\square}', answer:2,
        hint:{ ko:'분자·분모를 뒤집어요', en:'Flip numerator and denominator', zh:'分子分母互换' } }
    ],
    open:{ ko:'\\dfrac{-2}{3} \\div \\dfrac{4}{-9}를 역수를 이용해 계산해봐요.',
      en:'Compute (−2/3) ÷ (4/−9) using the reciprocal.',
      zh:'用倒数计算(−2/3) ÷ (4/−9)。' },
    openHint:{ ko:'역수는 -9/4. \\dfrac{-2}{3}\\times\\dfrac{-9}{4}=\\dfrac{18}{12} (음수 2개→+).',
      en:'Reciprocal is −9/4. (−2/3)×(−9/4)=18/12 (2 negatives→+).',
      zh:'倒数是−9/4。(−2/3)×(−9/4)=18/12(2个负数→+)。' }
  },

  lab:{
    generator:'md7_ratMulDiv', level:'main', count:4,
    params:{mode:'div'},
    intro:{
      ko:'나눗셈이 보이면 바로 역수 곱셈으로 바꿔봐!',
      en:'See a division? Flip it to a reciprocal multiplication right away!',
      zh:'看到除法就立刻换成倒数乘法！'
    }
  },

  arena:{
    generator:'md7_ratMulDiv', level:'main', count:8, timeLimit:300,
    params:{mode:'mixedChain'},
    rule:{ ko:'5분 안에 세 유리수 곱나눗 혼합을 모두 풀어요!', en:'Solve all three-rational × ÷ mixes in 5 minutes!', zh:'5分钟内解答所有三数有理数乘除混合题！' }
  },

  stamp:{ label:{ ko:'역수의 달인', en:'Reciprocal Master', zh:'倒数达人' }, coins:36 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'역수를 완벽하게 뒤집었어! 🔄',en:'Perfectly flipped!',zh:'倒数翻得很准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'나눗셈을 역수 곱셈으로 바꿨는지 확인해봐!',en:'Check that you turned ÷ into × by reciprocal!',zh:'检查一下除法有没有换成倒数乘法！'}, {ko:'분자·분모를 각각 곱했는지 확인해봐!',en:'Check that you multiplied numerators and denominators separately!',zh:'检查分子分母是不是分别相乘了！'} ],
    finish:{ ko:'완벽해! 역수의 달인! 🔄✨', en:'Perfect! Reciprocal Master!', zh:'完美！倒数达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
