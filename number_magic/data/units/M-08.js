/* Numbers of Magic — 유닛 M-08: 유한소수 판별 (중등 W8 · 중1 정수와 유리수 · 계보1 '2와 5는 친구' 종착) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-08'] = {
  id:'M-08', tier:'middle1', level:'31', order:8,
  lineage:['ten-friends'],
  generator:'md8_terminating',
  title:{ ko:'유한소수 판별', en:'Terminating or Repeating?', zh:'判断有限小数' },
  subtitle:{ ko:'분모 속 2와 5만 있으면 끝나는 소수, 다른 수가 숨어 있으면 영원히 반복돼요', en:'Only 2s and 5s in the denominator? It ends. Any other prime hiding there? It repeats forever', zh:'分母只有2和5就会结束，藏着别的质因数就会永远循环' },
  icon:'♾️',

  practice:{
    generator:'md8_terminating', level:'practice', count:5,
    params:{level:'reduced'},
    intro:{
      ko:'분모를 소인수분해해봐 — 2와 5만 있으면 유한소수, 아니면 순환소수야!',
      en:'Factor the denominator — only 2s and 5s means terminating, anything else means repeating!',
      zh:'把分母做质因数分解——只有2和5就是有限小数，否则就是循环小数！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'유한은 "세다 보면 끝이 있다", 무한은 "끝이 없다"예요. 그럼 소수점 아래는요? 0.375는 끝나는데 1/3=0.333…은 왜 안 끝날까요?',
        en:'Finite means "counting eventually ends," infinite means "it never does." What about after the decimal point? 0.375 ends, so why does 1/3=0.333… never stop?',
        zh:'有限就是"数着数着会结束"，无限就是"永远数不完"。那小数点后面呢？0.375会结束，为什么1/3=0.333…却停不下来？' },
      history:{ ko:'무한대 기호 ∞는 1655년 월리스가 처음 썼어요. 소수의 유한·무한도 같은 질문이에요 — 분모를 뜯어보면 답이 미리 보여요.',
        en:'The infinity symbol ∞ was first used by Wallis in 1655. Whether a decimal is finite or infinite is the very same question — and the answer is hiding in the denominator all along.',
        zh:'无穷大符号∞是1655年沃利斯首次使用的。小数是有限还是无限，其实是同一个问题——答案早就藏在分母里了。' }
    },
    stages:[
      { tag:{ko:'① 분모가 2와 5뿐이면 유한소수',en:'1) Only 2s and 5s — it terminates',zh:'① 分母只有2和5——有限小数'},
        head:{ko:'\\dfrac{3}{8} = 0.375',en:'\\dfrac{3}{8} = 0.375',zh:'\\dfrac{3}{8} = 0.375'},
        desc:{ko:'8=2×2×2, 소인수가 <b>2뿐</b>이에요. 분모를 2와 5의 곱으로 부풀려 10의 거듭제곱으로 만들 수 있으면(8×125=1000) 소수는 반드시 어딘가에서 끝나요: 3/8=375/1000=<b>0.375</b>.',
              en:'8=2×2×2, so the only prime factor is <b>2</b>. Whenever the denominator can be inflated into a power of 10 (8×125=1000), the decimal is guaranteed to end somewhere: 3/8=375/1000=<b>0.375</b>.',
              zh:'8=2×2×2，质因数只有<b>2</b>。只要分母能扩大成10的幂(8×125=1000)，小数就一定会在某处结束：3/8=375/1000=<b>0.375</b>。'},
        mathSteps:['8 = 2\\times2\\times2', '8\\times125=1000', '\\dfrac{3}{8}=\\dfrac{375}{1000}=0.375'],
        result:{ko:'분모 속 소인수가 2와 5뿐이면 항상 유한소수예요!',en:'If the denominator\'s only prime factors are 2 and 5, it always terminates!',zh:'分母的质因数只有2和5，就一定是有限小数！'},
        book:null },

      { tag:{ko:'② 다른 소인수가 있으면 순환소수',en:'2) Any other prime factor — it repeats',zh:'② 有别的质因数——循环小数'},
        head:{ko:'\\dfrac{1}{3} = 0.333\\dots = 0.\\overline{3}',en:'\\dfrac{1}{3} = 0.333\\dots = 0.\\overline{3}',zh:'\\dfrac{1}{3} = 0.333\\dots = 0.\\overline{3}'},
        desc:{ko:'3은 2도 5도 아니에요. 아무리 10을 곱해도 3으로 딱 나누어떨어지지 않아서, 나눗셈이 <b>절대 끝나지 않고</b> 같은 나머지가 반복돼요 — 그래서 순환소수(무한소수)가 돼요. <b>먼저 기약분수로 만드는 것</b>이 중요해요: 6/8도 8이 아니라 약분한 3/4의 분모(=2²)를 봐야 해요.',
              en:'3 is neither 2 nor 5. No matter how many 10s you multiply in, it never divides 3 evenly, so the division <b>never ends</b> and the same remainder keeps repeating — that makes it a repeating (infinite) decimal. <b>Reducing to lowest terms first</b> matters: for 6/8, check the denominator of the simplified 3/4 (=2²), not the 8.',
              zh:'3既不是2也不是5。不管乘多少个10，都不能被3整除，所以除法<b>永远不会结束</b>，同样的余数不断重复——这就成了循环(无限)小数。<b>先化成最简分数</b>很关键：6/8要看约分后3/4的分母(=2²)，而不是8。'},
        mathSteps:['3 \\ne 2,\\,5', '10\\div3=3\\cdots1,\\;\\; 10\\div3=3\\cdots1,\\;\\dots', '0.\\overline{3}'],
        result:{ko:'2와 5가 아닌 소인수가 하나라도 남으면 영원히 반복돼요!',en:'Even one leftover prime factor other than 2 and 5 makes it repeat forever!',zh:'只要留下一个不是2或5的质因数，就会永远循环！'},
        book:{ko:'이건 "2와 5는 친구" 계보의 마지막 걸음이에요 — 보수 10을 만들던 2×5가 이제는 유한소수인지 아닌지를 판정하는 열쇠가 됐어요.',
              en:'This is the final step of the "2 and 5 are friends" lineage — the 2×5 pair that once built bonds of 10 is now the key that decides whether a decimal terminates.',
              zh:'这是"2和5是朋友"这条家族的最后一步——曾经用来凑成10的2×5，现在成了判断小数是否有限的钥匙。'} }
    ],
    rule:{ ko:'① 먼저 기약분수로 약분  ② 분모를 소인수분해  ③ 소인수가 2·5뿐이면 유한, 다른 소인수가 있으면 순환',
      en:'① Reduce to lowest terms first  ② Factor the denominator  ③ Only 2s and 5s: terminating; any other factor: repeating',
      zh:'① 先约分成最简分数  ② 把分母做质因数分解  ③ 只有2和5：有限；有别的质因数：循环' }
  },

  check:{
    fills:[
      { tex:'\\dfrac{7}{20} \\;\\Rightarrow\\; \\square\\,(1=\\text{유한},0=\\text{순환})', answer:1,
        hint:{ ko:'20=2×2×5, 소인수가 2와 5뿐!', en:'20=2×2×5, only 2s and 5s!', zh:'20=2×2×5，只有2和5！' } },
      { tex:'\\dfrac{5}{12} \\;\\Rightarrow\\; \\square\\,(1=\\text{유한},0=\\text{순환})', answer:0,
        hint:{ ko:'12=2×2×3, 3이 숨어 있어요', en:'12=2×2×3, a 3 is hiding', zh:'12=2×2×3，藏着一个3' } }
    ],
    open:{ ko:'6/15는 유한소수일까요? 먼저 약분부터 해봐요.',
      en:'Is 6/15 a terminating decimal? Simplify first.',
      zh:'6/15是有限小数吗？先约分看看。' },
    openHint:{ ko:'6/15=2/5(약분). 분모 5는 2와 5뿐 → 유한소수(0.4)!',
      en:'6/15=2/5 (simplified). Denominator 5 has only 2s and 5s → terminating (0.4)!',
      zh:'6/15=2/5(约分后)。分母5只有2和5→有限小数(0.4)！' }
  },

  lab:{
    generator:'md8_terminating', level:'main', count:4,
    params:{level:'unreduced'},
    intro:{
      ko:'약분이 안 된 분수도 있어 — 먼저 기약분수로 만들고 판단해봐!',
      en:'Some fractions are not yet reduced — simplify first, then decide!',
      zh:'有些分数还没约分——先化简再判断！'
    }
  },

  arena:{
    generator:'md8_terminating', level:'main', count:8, timeLimit:300,
    params:{level:'unreduced'},
    rule:{ ko:'5분 안에 유한소수인지 판별을 모두 마쳐요!', en:'Decide terminating or not for every problem in 5 minutes!', zh:'5分钟内判断完所有题目！' }
  },

  stamp:{ label:{ ko:'유한·무한 판별사', en:'Finite-Infinite Judge', zh:'有限无限判官' }, coins:38 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'2와 5만 찾아냈어! ♾️',en:'You spotted only 2s and 5s!',zh:'只挑出了2和5！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'먼저 기약분수로 약분했는지 확인해봐!',en:'Check whether you reduced it first!',zh:'先看看有没有约分！'}, {ko:'분모를 소인수분해해서 2와 5만 있는지 봐!',en:'Factor the denominator and check for only 2s and 5s!',zh:'把分母分解质因数，看是不是只有2和5！'} ],
    finish:{ ko:'완벽해! 유한·무한 판별사! ♾️✨', en:'Perfect! Finite-Infinite Judge!', zh:'完美！有限无限判官！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
