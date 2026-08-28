/* Numbers of Magic — 유닛 C-31: 분수의 곱셈과 나눗셈 (중급 창의전략 8단계) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-31'] = {
  id:'C-31', tier:'intermediate', level:'C', order:31,
  generator:'ml_frac_muldiv',
  title:{ ko:'분수의 곱셈과 나눗셈', en:'Fraction × and ÷', zh:'分数乘除法' },
  subtitle:{ ko:'곱셈은 분자·분모끼리, 나눗셈은 뒤집어서 곱해요', en:'Multiply straight across; for division, flip and multiply', zh:'乘法直接对乘，除法翻转再乘' },
  icon:'🔀',

  practice:{
    generator:'ml_frac_muldiv', level:'practice', count:5,
    params:{ level:'practice', op:'mul' },
    intro:{
      ko:'분수를 곱할 때는 분자는 분자끼리, 분모는 분모끼리 곱하면 돼. 통분도 필요 없어! 준비됐지?',
      en:"To multiply fractions, multiply the numerators together and the denominators together — no common denominator needed! Ready?",
      zh:'分数相乘时，分子乘分子，分母乘分母就行——不用通分！准备好了吗？'
    }
  },

  discover:{
    story:{
      hook:{ ko:'낙타 17마리를 첫째 1/2, 둘째 1/3, 막내 1/9로 나누라는 유언. 이웃이 자기 낙타 한 마리를 보태 18마리로 만들자 9+6+2=17마리, 남은 한 마리는 돌려받았대요. 유언대로 나눈 게 맞을까요?',
        en:'A will says: split 17 camels — half to the eldest, a third to the second, a ninth to the youngest. A neighbor lends one to make 18, giving 9+6+2=17, and takes their camel back. Was the will actually followed?',
        zh:'遗嘱说：17头骆驼，老大1/2、老二1/3、老幺1/9。邻居借出一头凑成18头，分成9+6+2=17头，再把自己的牵回去。这真的照遗嘱分了吗？' },
      history:{ ko:'아니에요. 1/2+1/3+1/9 = 17/18이라 애초에 1이 안 돼요. 처음부터 다 나눠지지 않는 유언이었고, 18로 계산하면 세 사람 모두 원래 몫보다 조금씩 더 받아요. 분수로 무언가를 나눠 가질 때는 먼저 다 더해서 1이 되는지 확인하세요.',
        en:'No. 1/2+1/3+1/9 = 17/18, which never reaches 1 — the will could not be carried out as written. Computing with 18 quietly gives all three a little more than their true share. Whenever fractions divide something up, add them first and check they make 1.',
        zh:'不是。1/2+1/3+1/9 = 17/18，本来就凑不满1——这份遗嘱从一开始就分不完。用18来算，三个人都悄悄多拿了一点。用分数分东西时，先把它们加起来看看是不是1。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 분자는 분자끼리, 분모는 분모끼리',en:'1) Straight across',zh:'① 分子乘分子，分母乘分母'},
        head:{ko:'2/3 × 4/5 = 8/15!',en:'2/3 × 4/5 = 8/15!',zh:'2/3 × 4/5 = 8/15！'},
        desc:{ko:'분수 곱셈은 덧셈과 달라요 — <b>통분이 필요 없어요</b>! 그냥 <b>분자는 분자끼리, 분모는 분모끼리</b> 곱하면 끝: 2/3 × 4/5 = (2×4)/(3×5) = <b>8/15</b>. "2/3의 4/5만큼"이라고 생각하면, 전체를 3등분해서 2조각을 가진 것의 5등분 중 4조각을 갖는 셈이에요.',
              en:'Multiplying fractions is different from adding — <b>no common denominator needed</b>! Just multiply <b>numerator × numerator, denominator × denominator</b>: 2/3 × 4/5 = (2×4)/(3×5) = <b>8/15</b>. Think of it as "4/5 of 2/3" — you\'re taking 4 out of 5 equal slices of an amount that\'s already 2 out of 3.',
              zh:'分数乘法和加法不同——<b>不用通分</b>！直接<b>分子乘分子，分母乘分母</b>：2/3 × 4/5 = (2×4)/(3×5) = <b>8/15</b>。可以理解成"2/3的4/5"——从已经是3份中2份的量里，再取5份中的4份。'},
        mathSteps:['2 \\times 4 = 8','3 \\times 5 = 15','\\dfrac{2}{3} \\times \\dfrac{4}{5} = \\dfrac{8}{15}'],
        result:{ko:'2/3×4/5=8/15! 분자끼리, 분모끼리 — 통분은 필요 없어요.',en:'2/3×4/5=8/15! Straight across — no common denominator.',zh:'2/3×4/5=8/15！直接对乘——不用通分。'},
        book:{ko:'곱셈은 "부분의 부분"을 구하는 것이라 분모가 작아질 필요 없이 오히려 커져요(더 잘게 쪼개지니까). 덧셈·뺄셈과 정반대의 감각이에요.',
              en:'Multiplying finds "a part of a part," so the denominator grows bigger (the pieces get smaller), unlike addition and subtraction — a completely different feel.',
              zh:'乘法求的是"部分的部分"，所以分母会变大(切得更细)，感觉和加减法正好相反。'} },

      { tag:{ko:'② 나눗셈은 뒤집어서 곱하기',en:'2) Division: flip and multiply',zh:'② 除法：翻转再乘'},
        head:{ko:'2/3 ÷ 3/4 = 2/3 × 4/3 = 8/9!',en:'2/3 ÷ 3/4 = 2/3 × 4/3 = 8/9!',zh:'2/3 ÷ 3/4 = 2/3 × 4/3 = 8/9！'},
        desc:{ko:'분수 나눗셈은 <b>뒤의 분수를 뒤집어서 곱하기</b>로 바뀌어요. 2/3 ÷ 3/4에서 3/4를 뒤집으면 4/3, 그다음 곱셈처럼: 2/3 × 4/3 = (2×4)/(3×3) = <b>8/9</b>. "나누기"가 갑자기 "곱하기"로 변신하는 게 신기하지만, 뒤집은 분수(역수)를 곱하는 것과 나누는 것은 항상 똑같은 결과를 줘요.',
              en:'Fraction division turns into <b>multiplication by the flipped second fraction</b>. For 2/3 ÷ 3/4, flip 3/4 to 4/3, then multiply as usual: 2/3 × 4/3 = (2×4)/(3×3) = <b>8/9</b>. It feels magical that "division" suddenly becomes "multiplication," but multiplying by the flipped fraction (reciprocal) always gives the same result as dividing.',
              zh:'分数除法要把后一个分数<b>翻转再相乘</b>。2/3 ÷ 3/4中，把3/4翻转成4/3，再照乘法做：2/3 × 4/3 = (2×4)/(3×3) = <b>8/9</b>。"除法"忽然变成"乘法"很神奇，但乘以翻转后的分数(倒数)和除法结果永远相同。'},
        mathSteps:['\\dfrac{3}{4} \\;\\text{를 뒤집으면}\\; \\dfrac{4}{3}','\\dfrac{2}{3} \\times \\dfrac{4}{3}','= \\dfrac{8}{9}'],
        result:{ko:'2/3÷3/4=8/9! 뒤집어서 곱하면 끝.',en:'2/3÷3/4=8/9! Flip and multiply, done.',zh:'2/3÷3/4=8/9！翻转再乘就完成。'},
        book:{ko:'왜 뒤집을까요? 3/4로 나누는 건 "3/4가 몇 번 들어가나"를 묻는 거예요. 3/4 × 4/3 = 1이니까, 4/3을 곱하면 나눈 것을 정확히 되돌릴 수 있어요.',
              en:'Why flip? Dividing by 3/4 asks "how many 3/4s fit?" Since 3/4 × 4/3 = 1, multiplying by 4/3 exactly undoes the division.',
              zh:'为什么翻转？除以3/4是在问"能装几个3/4"。因为3/4 × 4/3 = 1，乘以4/3正好抵消了除法。'} },

      { tag:{ko:'③ 왜 뒤집으면 나누기가 될까',en:'3) Why flipping equals dividing',zh:'③ 为什么翻转就是除法'},
        head:{ko:'1 ÷ 1/2 = 2: 절반이 몇 번 들어가나?',en:'1 ÷ 1/2 = 2: how many halves fit in 1?',zh:'1 ÷ 1/2 = 2：1里有几个二分之一？'},
        desc:{ko:'쉬운 예로 확인해요: 1 ÷ 1/2은 "1 안에 1/2이 몇 번 들어가나"를 묻는 거고, 답은 <b>2</b>예요(절반이 두 개면 1). 이걸 뒤집어 곱하기로 풀면: 1 ÷ 1/2 = 1 × 2/1 = <b>2</b>. 똑같죠! 나누는 수가 1보다 작은 분수면, 나눈 결과는 원래 수보다 <b>커진다</b>는 것도 함께 기억해요.',
              en:'Check with an easy example: 1 ÷ 1/2 asks "how many halves fit in 1?" — the answer is <b>2</b> (two halves make a whole). Solve it by flip-and-multiply: 1 ÷ 1/2 = 1 × 2/1 = <b>2</b>. Same answer! Also remember: dividing by a fraction less than 1 makes the result <b>bigger</b> than the original number.',
              zh:'用简单例子验证：1 ÷ 1/2问"1里有几个1/2"，答案是<b>2</b>(两个半是1个整)。用翻转乘法解：1 ÷ 1/2 = 1 × 2/1 = <b>2</b>。一样！也记住：除以小于1的分数，结果会比原数<b>更大</b>。'},
        mathSteps:['1 \\div \\dfrac{1}{2}','= 1 \\times \\dfrac{2}{1}','= 2'],
        result:{ko:'1÷1/2=2! 나누는 분수가 1보다 작으면 답이 더 커져요.',en:'1÷1/2=2! Dividing by a fraction under 1 makes it bigger.',zh:'1÷1/2=2！除以小于1的分数会变大。'},
        book:null }
    ],
    rule:{ ko:'① 곱셈: 분자는 분자끼리, 분모는 분모끼리  ② 나눗셈: 뒤의 분수를 뒤집어서 곱하기  ③ 뒤집은 분수(역수)를 곱하면 나눈 것과 똑같아요',
      en:'① Multiplication: numerator×numerator, denominator×denominator  ② Division: flip the second fraction, then multiply  ③ Multiplying by the reciprocal equals dividing',
      zh:'① 乘法：分子乘分子，分母乘分母  ② 除法：把第二个分数翻转再乘  ③ 乘以倒数等于除法' }
  },

  check:{
    fills:[
      { tex:'\\dfrac{2}{5} \\times \\dfrac{3}{4} = \\dfrac{\\square}{20}', answer:6,
        hint:{ ko:'분자끼리: 2×3=?', en:'Numerators: 2×3=?', zh:'分子相乘：2×3=？' } },
      { tex:'\\dfrac{3}{4} \\div \\dfrac{2}{5} = \\dfrac{\\square}{8}', answer:15,
        hint:{ ko:'2/5를 뒤집으면 5/2, 3×5=?', en:'Flip 2/5 to 5/2, then 3×5=?', zh:'2/5翻转成5/2，3×5=？' } }
    ],
    open:{ ko:'분수 나눗셈에서 뒤집어 곱하면 왜 원래 나눗셈과 같은 답이 나오는지 설명해 봐요.',
      en:'Explain why flipping and multiplying gives the same answer as the original fraction division.',
      zh:'解释为什么翻转再乘的结果和原来的分数除法答案相同。' },
    openHint:{ ko:'예) 어떤 분수와 그 역수를 곱하면 항상 1이 돼요(3/4×4/3=1). 그래서 나누는 분수의 역수를 곱하면, 나눈 효과를 정확히 만들어내요.',
      en:'e.g. A fraction times its reciprocal always equals 1 (3/4×4/3=1). So multiplying by the reciprocal of the divisor exactly recreates the effect of dividing.',
      zh:'例）一个分数乘它的倒数永远等于1(3/4×4/3=1)。所以乘以除数的倒数正好复现了除法的效果。' }
  },

  lab:{
    generator:'ml_frac_muldiv', level:'main', count:4,
    params:{ level:'main', op:'div' },
    intro:{
      ko:'이번엔 분수 나눗셈! 뒤의 분수를 뒤집고 곱해봐.',
      en:'Now fraction division! Flip the second fraction and multiply.',
      zh:'现在是分数除法！把第二个分数翻转再乘。'
    }
  },

  arena:{
    generator:'ml_frac_muldiv', level:'main', count:8, timeLimit:300,
    params:{ level:'main', op:'mul' },
    rule:{ ko:'5분 안에 분수 곱셈·나눗셈 문제를 모두 풀어요!', en:'Solve all fraction × ÷ problems in 5 minutes!', zh:'5分钟内解答所有分数乘除题！' }
  },

  stamp:{ label:{ ko:'분수 변신술사', en:'Fraction Flipper', zh:'分数翻转师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'멋진 변신! 🔀',en:'Nice flip!',zh:'翻得漂亮！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'분자는 분자끼리, 분모는 분모끼리!',en:'Numerator×numerator, denominator×denominator!',zh:'分子乘分子，分母乘分母！'}, {ko:'나눗셈은 뒤집어서 곱해봐!',en:'For division, flip and multiply!',zh:'除法要翻转再乘！'} ],
    finish:{ ko:'완벽해! 분수 변신술사! 🔀✨', en:'Perfect! Fraction Flipper!', zh:'完美！分数翻转师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
