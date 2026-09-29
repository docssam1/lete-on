/* Numbers of Magic — 유닛 M-146: 수열의 합과 일반항의 관계 (고등 대수 · 과정 68 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD146. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-146'] = {
  id:'M-146', tier:'algebra', level:'68', order:146,
  generator:'md146_snAn',
  title:{ ko:'수열의 합과 일반항의 관계', en:'Sₙ and aₙ', zh:'数列的和与通项的关系' },
  subtitle:{ ko:'합에서 한 칸 빼면 항이 나옵니다', en:'Take one step back from the sum to get the term', zh:'和减去前一个和就是项' },
  icon:'🧮',

  practice:{
    generator:'md146_snAn', level:'practice', count:6,
    params:{mode:'an'},
    intro:{
      ko:'aₙ=Sₙ−Sₙ₋₁ 로 항을 구합니다. aₘ 부터 aₙ 까지의 합은 Sₙ−Sₘ₋₁ 로 한 번에 구합니다.',
      en:'Find terms with aₙ=Sₙ−Sₙ₋₁. The sum from aₘ to aₙ is Sₙ−Sₘ₋₁ in one step.',
      zh:'用aₙ=Sₙ−Sₙ₋₁求项。从aₘ到aₙ的和一次用Sₙ−Sₘ₋₁求出。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'첫째항부터 제n항까지의 합 Sₙ 만 알려 주고 항은 숨겨 두었습니다. 합에서 바로 앞까지의 합을 빼면 숨은 항이 드러납니다. 단, 첫째항은 앞의 합이 없어서 따로 봐야 합니다.',
        en:'Only Sₙ, the sum from the first term to the nth, is given; the terms are hidden. Subtract the sum up to the term before, and the hidden term appears. The first term has no earlier sum, so it needs a separate look.',
        zh:'只告诉从首项到第n项的和Sₙ，项被藏起来了。用和减去前一项为止的和，藏着的项就出现了。不过首项前面没有和，要单独看。' }
    },
    stages:[
      { tag:{ko:'① 합에서 항으로',en:'1) From the sum to the term',zh:'① 由和到项'},
        head:{ko:'S_n=n^2+2n\\ \\Rightarrow\\ a_n=S_n-S_{n-1}=2n+1',en:'S_n=n^2+2n\\ \\Rightarrow\\ a_n=S_n-S_{n-1}=2n+1',zh:'S_n=n^2+2n\\ \\Rightarrow\\ a_n=S_n-S_{n-1}=2n+1'},
        desc:{ko:'n≥2 일 때 aₙ=(n²+2n)−((n−1)²+2(n−1))=2n+1 입니다. a₁=S₁=3 도 이 식에 맞으므로 aₙ=<b>2n+1</b> 입니다.',en:'For n≥2, aₙ=(n²+2n)−((n−1)²+2(n−1))=2n+1. a₁=S₁=3 also fits, so aₙ=<b>2n+1</b>.',zh:'n≥2时aₙ=(n²+2n)−((n−1)²+2(n−1))=2n+1。a₁=S₁=3也符合，所以aₙ=<b>2n+1</b>。'},
        mathSteps:['a_n=S_n-S_{n-1}\\ (n\\ge2)','a_1=S_1=3'],
        result:{ko:'합의 차이가 곧 항!',en:'The difference of sums is the term!',zh:'和的差就是项！'},
        book:{ko:'Sₙ 이 pn²+qn 꼴이면 언제나 첫째항부터 등차수열이 되고 공차는 2p 입니다.',en:'Whenever Sₙ has the form pn²+qn, the sequence is arithmetic from the first term, with difference 2p.',zh:'Sₙ为pn²+qn形式时，数列总是从首项起成等差数列，公差为2p。'} },

      { tag:{ko:'② a₁ 은 따로',en:'2) a₁ on its own',zh:'② a₁单独求'},
        head:{ko:'S_n=n^2+2n+1\\ \\Rightarrow\\ a_1=4,\\ a_n=2n+1\\ (n\\ge2)',en:'S_n=n^2+2n+1\\ \\Rightarrow\\ a_1=4,\\ a_n=2n+1\\ (n\\ge2)',zh:'S_n=n^2+2n+1\\ \\Rightarrow\\ a_1=4,\\ a_n=2n+1\\ (n\\ge2)'},
        desc:{ko:'상수항 1 은 aₙ=Sₙ−Sₙ₋₁ 에서 지워지지만 a₁=S₁=<b>4</b> 에는 남습니다. 그래서 a₁ 만 식에서 떨어집니다.',en:'The constant 1 cancels in aₙ=Sₙ−Sₙ₋₁ but stays in a₁=S₁=<b>4</b>, so only a₁ breaks away from the formula.',zh:'常数1在aₙ=Sₙ−Sₙ₋₁中消去，但留在a₁=S₁=<b>4</b>里，所以只有a₁不符合式子。'},
        mathSteps:['a_1=S_1=4','a_n=2n+1\\ (n\\ge2)'],
        result:{ko:'첫째항은 언제나 S₁!',en:'The first term is always S₁!',zh:'首项总是S₁！'},
        book:{ko:'Sₙ=2ⁿ+3 이면 a₁=5 이고 n≥2 에서 aₙ=2ⁿ⁻¹ 입니다. 등비 꼴도 상수가 맞지 않으면 a₁ 이 떨어집니다.',en:'If Sₙ=2ⁿ+3, then a₁=5 and aₙ=2ⁿ⁻¹ for n≥2. A geometric form also loses a₁ when the constant does not fit.',zh:'若Sₙ=2ⁿ+3，则a₁=5，n≥2时aₙ=2ⁿ⁻¹。等比形式的常数不吻合时a₁也不符合。'} },

      { tag:{ko:'③ 첫째항부터 등비가 될 조건',en:'3) Geometric from the first term',zh:'③ 从首项起成等比的条件'},
        head:{ko:'S_n=3^{n}+k,\\ a_{n+1}=3a_n\\ (n\\ge1)\\ \\Rightarrow\\ k=-1',en:'S_n=3^{n}+k,\\ a_{n+1}=3a_n\\ (n\\ge1)\\ \\Rightarrow\\ k=-1',zh:'S_n=3^{n}+k,\\ a_{n+1}=3a_n\\ (n\\ge1)\\ \\Rightarrow\\ k=-1'},
        desc:{ko:'n≥2 에서 aₙ=2×3ⁿ⁻¹ 이므로 a₁ 도 2 여야 합니다. a₁=3+k=2 에서 k=<b>−1</b> 입니다.',en:'For n≥2, aₙ=2×3ⁿ⁻¹, so a₁ must be 2 as well. From a₁=3+k=2, k=<b>−1</b>.',zh:'n≥2时aₙ=2×3ⁿ⁻¹，所以a₁也应为2。由a₁=3+k=2得k=<b>−1</b>。'},
        mathSteps:['a_n=2\\times3^{n-1}\\ (n\\ge2)','3+k=2'],
        result:{ko:'a₁ 이 식에 들어맞게!',en:'Make a₁ fit the formula!',zh:'让a₁符合式子！'},
        book:{ko:'등차도 같습니다. Sₙ=pn²+qn+r 이 첫째항부터 등차수열이 되려면 r=0 이어야 합니다.',en:'The arithmetic case is the same: for Sₙ=pn²+qn+r to be arithmetic from the first term, r must be 0.',zh:'等差也一样：Sₙ=pn²+qn+r要从首项起成等差数列，必须r=0。'} }
    ],
    rule:{ ko:'① aₙ=Sₙ−Sₙ₋₁(n≥2)  ② a₁=S₁ 은 따로  ③ 첫째항부터 등차·등비이면 a₁ 도 n≥2 의 식에 맞는다',
      en:'① aₙ=Sₙ−Sₙ₋₁ (n≥2)  ② a₁=S₁ separately  ③ Arithmetic or geometric from the first term means a₁ fits the n≥2 formula',
      zh:'① aₙ=Sₙ−Sₙ₋₁(n≥2)  ② a₁=S₁单独求  ③ 从首项起成等差或等比，则a₁也符合n≥2的式子' }
  },

  check:{
    fills:[
      { tex:{ko:'S_n=2n^2-n\\ \\Rightarrow\\ a_{5}=\\square',en:'S_n=2n^2-n\\ \\Rightarrow\\ a_{5}=\\square',zh:'S_n=2n^2-n\\ \\Rightarrow\\ a_{5}=\\square'}, answer:17,
        hint:{ko:'45−28',en:'45−28',zh:'45−28'} },
      { tex:{ko:'S_n=n^2+3n+2\\ \\Rightarrow\\ a_1=\\square',en:'S_n=n^2+3n+2\\ \\Rightarrow\\ a_1=\\square',zh:'S_n=n^2+3n+2\\ \\Rightarrow\\ a_1=\\square'}, answer:6,
        hint:{ko:'S₁',en:'S₁',zh:'S₁'} }
    ],
    open:{ ko:'Sₙ 에 상수항이 있으면 첫째항만 일반항의 식에서 떨어지는 까닭을 설명해 봅니다.',
      en:'Explain why only the first term breaks away from the formula when Sₙ has a constant term.',
      zh:'说说为什么Sₙ有常数项时只有首项不符合通项公式。' },
    openHint:{ ko:'n≥2 에서 Sₙ−Sₙ₋₁ 을 계산하면 상수항끼리 지워집니다. 하지만 a₁=S₁ 은 빼는 것이 없어 상수항이 그대로 남습니다.',
      en:'For n≥2, the constants cancel in Sₙ−Sₙ₋₁. But a₁=S₁ has nothing subtracted, so the constant stays.',
      zh:'n≥2时Sₙ−Sₙ₋₁中常数项互相消去；而a₁=S₁没有减去任何东西，常数项留了下来。' }
  },

  lab:{
    generator:'md146_snAn', level:'main', count:6,
    params:{mode:'a1'},
    intro:{
      ko:'Sₙ 에 상수항이 있거나 등비 꼴의 상수가 맞지 않으면 a₁ 을 S₁ 로 따로 구하고, n≥2 의 항은 Sₙ−Sₙ₋₁ 로 구합니다.',
      en:'If Sₙ has a constant term or the constant of a geometric form does not fit, find a₁ separately as S₁ and the terms for n≥2 from Sₙ−Sₙ₋₁.',
      zh:'若Sₙ有常数项或等比形式的常数不吻合，单独用S₁求a₁，n≥2的项用Sₙ−Sₙ₋₁求。'
    }
  },

  arena:{
    generator:'md146_snAn', level:'main', count:6, timeLimit:420,
    params:{mode:'judge'},
    rule:{ ko:'7분 안에 첫째항부터 등차·등비가 되는 조건을 모두 찾습니다!', en:'Find every condition for arithmetic or geometric from the first term within 7 minutes!', zh:'7分钟内找出所有从首项起成等差、等比的条件！' }
  },

  stamp:{ label:{ ko:'합 분해사', en:'Sum Splitter', zh:'和的拆解师' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'합에서 항을 딱 꺼냈어! 🧮',en:'Pulled the term right out of the sum!',zh:'从和里准确取出了项！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'a₁ 은 S₁ 로 따로 구해!',en:'Find a₁ separately as S₁!',zh:'a₁要单独用S₁求！'}, {ko:'Sₙ₋₁ 은 n 대신 n−1 을 넣어!',en:'For Sₙ₋₁, put n−1 in place of n!',zh:'Sₙ₋₁要把n换成n−1！'} ],
    finish:{ ko:'완벽해! 합 분해사! 🧮✨', en:'Perfect! Sum Splitter!', zh:'完美！和的拆解师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
