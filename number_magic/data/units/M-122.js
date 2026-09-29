/* Numbers of Magic — 유닛 M-122: 원소의 개수와 부분집합의 개수 (고등 공통수학2 · 과정 53 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD122. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-122'] = {
  id:'M-122', tier:'highmath2', level:'53', order:122,
  generator:'md122_setCount',
  title:{ ko:'원소의 개수와 부분집합의 개수', en:'Counting Elements & Subsets', zh:'元素个数与子集个数' },
  subtitle:{ ko:'원소마다 넣거나 빼거나 — 2ⁿ', en:'Each element in or out — 2ⁿ', zh:'每个元素选或不选——2ⁿ' },
  icon:'🧺',

  practice:{
    generator:'md122_setCount', level:'practice', count:6,
    params:{mode:'nA'},
    intro:{
      ko:'조건에 맞는 원소를 빠짐없이, 겹치지 않게 나열한 뒤 개수 n(A) 를 셉니다.',
      en:'List the elements that satisfy the condition — none missing, none repeated — then count n(A).',
      zh:'把满足条件的元素不重不漏地列出来，再数个数n(A)。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'과일 세 가지로 도시락을 쌀 때 과일마다 "넣는다/안 넣는다" 두 가지를 고르면 2×2×2=8 가지가 됩니다. 아무것도 안 넣는 것과 다 넣는 것까지 포함한 이 8 가지가 부분집합입니다.',
        en:'Packing a lunch from three fruits, each fruit is "in" or "out": 2×2×2=8 ways, counting the empty box and the full one. Those 8 are the subsets.',
        zh:'用三种水果装便当，每种水果"放/不放"两种选择，共2×2×2=8种，包括什么都不放和全放。这8种就是子集。' }
    },
    stages:[
      { tag:{ko:'① 원소의 개수',en:'1) Number of elements',zh:'① 元素个数'},
        head:{ko:'A=\\{1,2,3,4,6,12\\},\\ n(A)=6',en:'A=\\{1,2,3,4,6,12\\},\\ n(A)=6',zh:'A=\\{1,2,3,4,6,12\\},\\ n(A)=6'},
        desc:{ko:'A={x | x는 12의 약수} 를 원소를 나열해 나타내면 {1, 2, 3, 4, 6, 12} 이므로 n(A)=<b>6</b> 입니다.',
              en:'A={x | x is a divisor of 12} is {1, 2, 3, 4, 6, 12} when listed, so n(A)=<b>6</b>.',
              zh:'A={x | x是12的约数}列举为{1, 2, 3, 4, 6, 12}，所以n(A)=<b>6</b>。'},
        mathSteps:['n(A)=6'],
        result:{ko:'빠짐없이, 겹치지 않게!',en:'None missing, none repeated!',zh:'不重不漏！'},
        book:{ko:'n(∅)=0 이고, 원소가 하나뿐인 집합은 n=1 입니다.',
              en:'n(∅)=0, and a one-element set has n=1.',
              zh:'n(∅)=0，只有一个元素的集合n=1。'} },

      { tag:{ko:'② 부분집합의 개수',en:'2) Number of subsets',zh:'② 子集的个数'},
        head:{ko:'2\\times2\\times2=2^3=8',en:'2\\times2\\times2=2^3=8',zh:'2\\times2\\times2=2^3=8'},
        desc:{ko:'{a, b, c} 의 부분집합은 ∅, {a}, {b}, {c}, {a, b}, {a, c}, {b, c}, {a, b, c} 의 <b>8</b> 개이고, 자기 자신을 뺀 진부분집합은 <b>7</b> 개입니다.',
              en:'{a, b, c} has <b>8</b> subsets: ∅, {a}, {b}, {c}, {a, b}, {a, c}, {b, c}, {a, b, c}; leaving out the set itself gives <b>7</b> proper subsets.',
              zh:'{a, b, c}的子集是∅、{a}、{b}、{c}、{a, b}、{a, c}、{b, c}、{a, b, c}共<b>8</b>个，去掉自身的真子集有<b>7</b>个。'},
        mathSteps:['2^3-1=7'],
        result:{ko:'원소 n 개 → 2ⁿ 개!',en:'n elements → 2ⁿ!',zh:'n个元素→2ⁿ个！'},
        book:{ko:'공집합 ∅ 과 자기 자신도 부분집합에 들어갑니다.',
              en:'The empty set ∅ and the set itself both count as subsets.',
              zh:'空集∅和集合本身都算子集。'} },

      { tag:{ko:'③ 특정 원소 조건',en:'3) Conditions on elements',zh:'③ 特定元素的条件'},
        head:{ko:'2^{5-1-1}=2^3=8',en:'2^{5-1-1}=2^3=8',zh:'2^{5-1-1}=2^3=8'},
        desc:{ko:'{1, 2, 3, 4, 5} 의 부분집합 가운데 1 은 반드시 넣고 5 는 넣지 않는 것은, 남은 2, 3, 4 만 고르면 되므로 <b>8</b> 개입니다.',
              en:'Subsets of {1, 2, 3, 4, 5} that must contain 1 and must not contain 5: only 2, 3, 4 are free, so there are <b>8</b>.',
              zh:'{1, 2, 3, 4, 5}的子集中必须含1且不含5的，只需在2、3、4中选，共<b>8</b>个。'},
        mathSteps:['2^3=8'],
        result:{ko:'정해진 원소는 빼고 셉니다!',en:'Fixed elements drop out of the count!',zh:'确定的元素不参与计数！'},
        book:{ko:'"짝수를 적어도 하나" 는 전체 2ⁿ 에서 짝수가 하나도 없는 경우(홀수만으로 된 부분집합)를 뺍니다.',
              en:'"At least one even number" is 2ⁿ minus the subsets with no even number (those made of odd numbers only).',
              zh:'"至少一个偶数"用2ⁿ减去一个偶数都没有的情况(只由奇数组成的子集)。'} }
    ],
    rule:{ ko:'① n(A) 는 원소를 나열해 셉니다  ② 부분집합 2ⁿ 개, 진부분집합 2ⁿ−1 개  ③ 반드시 넣고 빼는 원소 k 개를 빼면 2ⁿ⁻ᵏ 개',
      en:'① Count n(A) by listing  ② 2ⁿ subsets, 2ⁿ−1 proper subsets  ③ With k elements fixed in or out: 2ⁿ⁻ᵏ',
      zh:'① 列举元素数n(A)  ② 子集2ⁿ个，真子集2ⁿ−1个  ③ 有k个元素确定选或不选时为2ⁿ⁻ᵏ个' }
  },

  check:{
    fills:[
      { tex:{ko:'A=\\{x\\,|\\,x\\text{는 }10\\text{ 이하의 소수}\\}\\ \\Rightarrow\\ n(A)=\\square',en:'A=\\{x\\,|\\,x\\text{ is a prime at most }10\\}\\ \\Rightarrow\\ n(A)=\\square',zh:'A=\\{x\\,|\\,x\\text{是不大于}10\\text{的质数}\\}\\ \\Rightarrow\\ n(A)=\\square'}, answer:4,
        hint:{ ko:'2, 3, 5, 7', en:'2, 3, 5, 7', zh:'2, 3, 5, 7' } },
      { tex:{ko:'\\{1,2,3,4\\}\\text{의 부분집합의 개수}=\\square',en:'\\text{number of subsets of }\\{1,2,3,4\\}=\\square',zh:'\\{1,2,3,4\\}\\text{的子集个数}=\\square'}, answer:16,
        hint:{ ko:'2⁴', en:'2⁴', zh:'2⁴' } }
    ],
    open:{ ko:'원소가 하나 늘어날 때마다 부분집합의 개수가 두 배가 되는 까닭을 설명해 봅니다.',
      en:'Explain why adding one element doubles the number of subsets.',
      zh:'说说为什么每增加一个元素，子集个数就变为原来的两倍。' },
    openHint:{ ko:'원래의 부분집합 하나하나에 새 원소를 "넣은 것"과 "안 넣은 것"이 한 쌍씩 생깁니다.',
      en:'Each old subset gives a pair: one without the new element and one with it.',
      zh:'原来的每个子集都对应一对：不含新元素的和含新元素的。' }
  },

  lab:{
    generator:'md122_setCount', level:'main', count:6,
    params:{mode:'subsets'},
    intro:{
      ko:'원소의 개수 n 을 먼저 세고 2ⁿ 을 계산합니다. 진부분집합이면 1 을 뺍니다.',
      en:'Count the elements n first, then compute 2ⁿ; for proper subsets subtract 1.',
      zh:'先数元素个数n，再算2ⁿ；真子集则减1。'
    }
  },

  arena:{
    generator:'md122_setCount', level:'main', count:6, timeLimit:420,
    params:{mode:'special'},
    rule:{ ko:'7분 안에 조건이 붙은 부분집합을 모두 셉니다!', en:'Count every conditioned set of subsets within 7 minutes!', zh:'7分钟内数完所有带条件的子集！' }
  },

  stamp:{ label:{ ko:'꾸러미 셈꾼', en:'Bundle Counter', zh:'组合打包师' }, coins:49 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'넣고 빼기, 완벽해! 🧺',en:'In or out — perfect!',zh:'选与不选，完美！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'공집합도 부분집합이야!',en:'The empty set is a subset too!',zh:'空集也是子集！'}, {ko:'정해진 원소는 빼고 세 봐!',en:'Leave the fixed elements out of the count!',zh:'确定的元素不要算进去！'} ],
    finish:{ ko:'완벽해! 꾸러미 셈꾼! 🧺✨', en:'Perfect! Bundle Counter!', zh:'完美！组合打包师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
