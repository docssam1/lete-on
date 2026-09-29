/* Numbers of Magic — 유닛 M-152: 점화식 (고등 대수 · 과정 69, 2026-09-29)
   근거: docs/high-build-spec.md MD152. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-152'] = {
  id:'M-152', tier:'algebra', level:'69', order:152,
  generator:'md152_recurrence',
  title:{ ko:'점화식', en:'Recurrence Relations', zh:'递推公式' },
  subtitle:{ ko:'식을 모두 더하거나 모두 곱하기', en:'Add all the equations, or multiply them all', zh:'把各式全部相加或全部相乘' },
  icon:'🔗',

  practice:{
    generator:'md152_recurrence', level:'practice', count:6,
    params:{mode:'add'},
    intro:{
      ko:'aₙ₊₁=aₙ+f(n) 이면 aₖ=a₁+f(1)+…+f(k−1) 입니다. 계차의 합은 Σ 공식이나 등비수열의 합으로 구합니다.',
      en:'If aₙ₊₁=aₙ+f(n), then aₖ=a₁+f(1)+…+f(k−1). Add up the differences with the Σ formulas or a geometric sum.',
      zh:'若aₙ₊₁=aₙ+f(n)，则aₖ=a₁+f(1)+…+f(k−1)。阶差之和用Σ公式或等比数列求和。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'aₙ₊₁ 과 aₙ 의 관계식을 n=1, 2, 3, … 에 대해 모두 써서 더하거나 곱하면 가운데 항이 지워지고 첫째항과 구하는 항만 남습니다. 꼴에 따라 등비·등차수열로 바꾸는 방법도 익힙니다.',
        en:'Write the relation between aₙ₊₁ and aₙ for n=1, 2, 3, … and add or multiply them all: the middle terms cancel, leaving the first term and the one you want. We also learn to turn some forms into geometric or arithmetic sequences.',
        zh:'把aₙ₊₁与aₙ的关系式对n=1, 2, 3, …全部写出再相加或相乘，中间的项消去，只剩首项与所求的项。还要学习按形式化成等比、等差数列的方法。' }
    },
    stages:[
      { tag:{ko:'① 모두 더하기',en:'1) Add them all',zh:'① 全部相加'},
        head:{ko:'a_1=1,\\ a_{n+1}=a_n+2n\\ \\Rightarrow\\ a_{5}=1+2(1+2+3+4)=21',en:'a_1=1,\\ a_{n+1}=a_n+2n\\ \\Rightarrow\\ a_{5}=1+2(1+2+3+4)=21',zh:'a_1=1,\\ a_{n+1}=a_n+2n\\ \\Rightarrow\\ a_{5}=1+2(1+2+3+4)=21'},
        desc:{ko:'a₂−a₁=2, a₃−a₂=4, a₄−a₃=6, a₅−a₄=8 을 모두 더하면 a₅−a₁=20 이므로 a₅=<b>21</b> 입니다.',en:'Adding a₂−a₁=2, a₃−a₂=4, a₄−a₃=6 and a₅−a₄=8 gives a₅−a₁=20, so a₅=<b>21</b>.',zh:'把a₂−a₁=2、a₃−a₂=4、a₄−a₃=6、a₅−a₄=8相加得a₅−a₁=20，所以a₅=<b>21</b>。'},
        mathSteps:['a_k=a_1+\\sum_{i=1}^{k-1}f(i)','1+2\\times10=21'],
        result:{ko:'차이를 모으면 항!',en:'Collect the differences to get the term!',zh:'把差累加起来就是项！'},
        book:{ko:'f(n)=2ⁿ 처럼 등비수열이면 계차의 합을 등비수열의 합으로 구합니다.',en:'If f(n) is geometric, like 2ⁿ, add the differences as a geometric sum.',zh:'若f(n)像2ⁿ那样是等比数列，用等比数列求和求阶差之和。'} },

      { tag:{ko:'② 모두 곱하기',en:'2) Multiply them all',zh:'② 全部相乘'},
        head:{ko:'a_1=2,\\ a_{n+1}=\\frac{n+1}{n}a_n\\ \\Rightarrow\\ a_{5}=2\\times\\frac{2}{1}\\times\\frac{3}{2}\\times\\frac{4}{3}\\times\\frac{5}{4}=10',en:'a_1=2,\\ a_{n+1}=\\frac{n+1}{n}a_n\\ \\Rightarrow\\ a_{5}=2\\times\\frac{2}{1}\\times\\frac{3}{2}\\times\\frac{4}{3}\\times\\frac{5}{4}=10',zh:'a_1=2,\\ a_{n+1}=\\frac{n+1}{n}a_n\\ \\Rightarrow\\ a_{5}=2\\times\\frac{2}{1}\\times\\frac{3}{2}\\times\\frac{4}{3}\\times\\frac{5}{4}=10'},
        desc:{ko:'분자와 분모가 엇갈려 지워지고 5/1 만 남으므로 a₅=2×5=<b>10</b> 입니다.',en:'Numerators and denominators cancel crosswise, leaving 5/1, so a₅=2×5=<b>10</b>.',zh:'分子分母交错约去，只剩5/1，所以a₅=2×5=<b>10</b>。'},
        mathSteps:['a_k=a_1\\times f(1)\\times\\cdots\\times f(k-1)','2\\times5=10'],
        result:{ko:'곱하면 엇갈려 지워진다!',en:'Multiply and they cancel crosswise!',zh:'相乘就交错约去！'},
        book:{ko:'aₙ₊₁=2ⁿaₙ 이면 곱이 2¹⁺²⁺…⁺⁽ᵏ⁻¹⁾ 이 되어 지수끼리 더합니다.',en:'If aₙ₊₁=2ⁿaₙ, the product is 2¹⁺²⁺…⁺⁽ᵏ⁻¹⁾, so the exponents add.',zh:'若aₙ₊₁=2ⁿaₙ，乘积为2¹⁺²⁺…⁺⁽ᵏ⁻¹⁾，指数相加。'} },

      { tag:{ko:'③ aₙ₊₁=paₙ+q',en:'3) aₙ₊₁=paₙ+q',zh:'③ aₙ₊₁=paₙ+q'},
        head:{ko:'a_1=3,\\ a_{n+1}=2a_n-1\\ \\Rightarrow\\ a_{n+1}-1=2(a_n-1),\\ a_n=2^{n}+1',en:'a_1=3,\\ a_{n+1}=2a_n-1\\ \\Rightarrow\\ a_{n+1}-1=2(a_n-1),\\ a_n=2^{n}+1',zh:'a_1=3,\\ a_{n+1}=2a_n-1\\ \\Rightarrow\\ a_{n+1}-1=2(a_n-1),\\ a_n=2^{n}+1'},
        desc:{ko:'α=2α−1 에서 α=1 입니다. {aₙ−1} 은 첫째항 2, 공비 2 인 등비수열이므로 aₙ=2ⁿ+1, a₅=<b>33</b> 입니다.',en:'α=2α−1 gives α=1. {aₙ−1} is geometric with first term 2 and ratio 2, so aₙ=2ⁿ+1 and a₅=<b>33</b>.',zh:'由α=2α−1得α=1。{aₙ−1}是首项为2、公比为2的等比数列，所以aₙ=2ⁿ+1，a₅=<b>33</b>。'},
        mathSteps:['\\alpha=2\\alpha-1,\\ \\alpha=1','a_n-1=2\\times2^{n-1}'],
        result:{ko:'α 를 빼면 등비수열!',en:'Subtract α: geometric!',zh:'减去α就是等比数列！'},
        book:{ko:'aₙ₊₁=aₙ/(caₙ+1) 은 역수를 취하면 1/aₙ₊₁=1/aₙ+c 로 등차수열이 됩니다.',en:'aₙ₊₁=aₙ/(caₙ+1) becomes the arithmetic 1/aₙ₊₁=1/aₙ+c after taking reciprocals.',zh:'aₙ₊₁=aₙ/(caₙ+1)取倒数得1/aₙ₊₁=1/aₙ+c，成等差数列。'} }
    ],
    rule:{ ko:'① aₙ₊₁=aₙ+f(n) → 더하기  ② aₙ₊₁=aₙf(n) → 곱하기  ③ aₙ₊₁=paₙ+q → aₙ₊₁−α=p(aₙ−α)',
      en:'① aₙ₊₁=aₙ+f(n) → add  ② aₙ₊₁=aₙf(n) → multiply  ③ aₙ₊₁=paₙ+q → aₙ₊₁−α=p(aₙ−α)',
      zh:'① aₙ₊₁=aₙ+f(n) → 相加  ② aₙ₊₁=aₙf(n) → 相乘  ③ aₙ₊₁=paₙ+q → aₙ₊₁−α=p(aₙ−α)' }
  },

  check:{
    fills:[
      { tex:{ko:'a_1=2,\\ a_{n+1}=a_n+2^{n}\\ \\Rightarrow\\ a_{4}=\\square',en:'a_1=2,\\ a_{n+1}=a_n+2^{n}\\ \\Rightarrow\\ a_{4}=\\square',zh:'a_1=2,\\ a_{n+1}=a_n+2^{n}\\ \\Rightarrow\\ a_{4}=\\square'}, answer:16,
        hint:{ko:'2+2+4+8',en:'2+2+4+8',zh:'2+2+4+8'} },
      { tex:{ko:'a_1=1,\\ a_{n+1}=2a_n+1\\ \\Rightarrow\\ a_{5}=\\square',en:'a_1=1,\\ a_{n+1}=2a_n+1\\ \\Rightarrow\\ a_{5}=\\square',zh:'a_1=1,\\ a_{n+1}=2a_n+1\\ \\Rightarrow\\ a_{5}=\\square'}, answer:31,
        hint:{ko:'1, 3, 7, 15, …',en:'1, 3, 7, 15, …',zh:'1, 3, 7, 15, …'} }
    ],
    open:{ ko:'aₙ₊₁=paₙ+q 에서 α=pα+q 인 α 를 빼면 등비수열이 되는 까닭을 설명해 봅니다.',
      en:'Explain why subtracting the α with α=pα+q turns aₙ₊₁=paₙ+q into a geometric sequence.',
      zh:'说说为什么在aₙ₊₁=paₙ+q中减去满足α=pα+q的α就成等比数列。' },
    openHint:{ ko:'aₙ₊₁=paₙ+q 에서 α=pα+q 를 변끼리 빼면 aₙ₊₁−α=p(aₙ−α) 입니다. aₙ−α 가 매번 p 배가 됩니다.',
      en:'Subtracting α=pα+q from aₙ₊₁=paₙ+q side by side gives aₙ₊₁−α=p(aₙ−α): aₙ−α is multiplied by p each time.',
      zh:'把aₙ₊₁=paₙ+q与α=pα+q两边相减得aₙ₊₁−α=p(aₙ−α)，aₙ−α每次变为p倍。' }
  },

  lab:{
    generator:'md152_recurrence', level:'main', count:6,
    params:{mode:'mul'},
    intro:{
      ko:'aₙ₊₁=aₙ·f(n) 이면 n 에 1 부터 k−1 까지 넣은 식을 모두 곱합니다. 분수는 엇갈려 지워지고, 거듭제곱은 지수끼리 더합니다.',
      en:'If aₙ₊₁=aₙ·f(n), multiply the equations for n=1 to k−1. Fractions cancel crosswise, and powers add their exponents.',
      zh:'若aₙ₊₁=aₙ·f(n)，把n=1到k−1代入的各式相乘。分数交错约去，幂的指数相加。'
    }
  },

  arena:{
    generator:'md152_recurrence', level:'main', count:6, timeLimit:420,
    params:{mode:'term'},
    rule:{ ko:'7분 안에 여러 가지 점화식의 항을 모두 구합니다!', en:'Find the terms of every recurrence within 7 minutes!', zh:'7分钟内求出各种递推公式的项！' }
  },

  stamp:{ label:{ ko:'사슬 해독가', en:'Chain Decoder', zh:'链条解码师' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'사슬을 끝까지 풀었어! 🔗',en:'Unravelled the whole chain!',zh:'把链条解到底了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'n 에 1 부터 k−1 까지 넣었는지 봐!',en:'Did you use n=1 to k−1?',zh:'代入n=1到k−1了吗？'}, {ko:'α 를 먼저 구해!',en:'Find α first!',zh:'先求α！'} ],
    finish:{ ko:'완벽해! 사슬 해독가! 🔗✨', en:'Perfect! Chain Decoder!', zh:'完美！链条解码师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
