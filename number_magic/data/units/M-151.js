/* Numbers of Magic — 유닛 M-151: 수열의 귀납적 정의 (고등 대수 · 과정 71 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD151. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-151'] = {
  id:'M-151', tier:'algebra', level:'71', order:151,
  generator:'md151_recDef',
  title:{ ko:'수열의 귀납적 정의', en:'Recursive Definitions of Sequences', zh:'数列的递推定义' },
  subtitle:{ ko:'첫 계단과 오르는 규칙만 있으면 됩니다', en:'A first step and a rule for climbing are enough', zh:'有第一级台阶和上楼的规则就够了' },
  icon:'🪜',

  practice:{
    generator:'md151_recDef', level:'practice', count:6,
    params:{mode:'arith'},
    intro:{
      ko:'aₙ₊₁=aₙ+d, aₙ₊₁−aₙ=d, 2aₙ₊₁=aₙ+aₙ₊₂ 는 등차수열입니다. 첫째항과 공차로 항을 구하거나, 값이 주어지면 k 를 거꾸로 구합니다.',
      en:'aₙ₊₁=aₙ+d, aₙ₊₁−aₙ=d and 2aₙ₊₁=aₙ+aₙ₊₂ are arithmetic. Find terms from the first term and difference, or work back to k from a value.',
      zh:'aₙ₊₁=aₙ+d、aₙ₊₁−aₙ=d、2aₙ₊₁=aₙ+aₙ₊₂是等差数列。用首项和公差求项，给出值时反求k。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'계단의 첫 칸 높이와 "한 칸 오를 때마다 얼마나 올라가는지"만 알면 몇 번째 칸이든 높이를 알 수 있습니다. 수열도 첫째항과 이웃한 항 사이의 규칙만으로 정할 수 있습니다.',
        en:'Knowing the first step’s height and how much each step rises tells you the height of any step. A sequence, too, can be fixed by its first term and a rule between neighbouring terms.',
        zh:'只要知道第一级台阶的高度和"每上一级升高多少"，就能知道任何一级的高度。数列也可以只用首项和相邻项之间的规则来确定。' }
    },
    stages:[
      { tag:{ko:'① 등차수열',en:'1) Arithmetic',zh:'① 等差数列'},
        head:{ko:'a_1=3,\\ a_{n+1}=a_n+4\\ \\Rightarrow\\ a_{10}=3+9\\times4=39',en:'a_1=3,\\ a_{n+1}=a_n+4\\ \\Rightarrow\\ a_{10}=3+9\\times4=39',zh:'a_1=3,\\ a_{n+1}=a_n+4\\ \\Rightarrow\\ a_{10}=3+9\\times4=39'},
        desc:{ko:'다음 항이 언제나 4 크므로 공차 4 인 등차수열이고 a₁₀=<b>39</b> 입니다.',en:'Each term is 4 more than the one before, so it is arithmetic with difference 4, and a₁₀=<b>39</b>.',zh:'每一项都比前一项大4，是公差为4的等差数列，a₁₀=<b>39</b>。'},
        mathSteps:['a_{n+1}-a_n=4','a_n=4n-1'],
        result:{ko:'차이가 일정하면 등차!',en:'Constant difference: arithmetic!',zh:'差一定就是等差！'},
        book:{ko:'2aₙ₊₁=aₙ+aₙ₊₂ 는 가운데 항이 양옆의 평균이라는 뜻이라 역시 등차수열입니다.',en:'2aₙ₊₁=aₙ+aₙ₊₂ says each middle term is the average of its neighbours, so it is arithmetic too.',zh:'2aₙ₊₁=aₙ+aₙ₊₂表示中间项是两边的平均，所以也是等差数列。'} },

      { tag:{ko:'② 등비수열',en:'2) Geometric',zh:'② 等比数列'},
        head:{ko:'a_1=2,\\ a_{n+1}=3a_n\\ \\Rightarrow\\ a_{5}=2\\times3^{4}=162',en:'a_1=2,\\ a_{n+1}=3a_n\\ \\Rightarrow\\ a_{5}=2\\times3^{4}=162',zh:'a_1=2,\\ a_{n+1}=3a_n\\ \\Rightarrow\\ a_{5}=2\\times3^{4}=162'},
        desc:{ko:'다음 항이 언제나 3 배이므로 공비 3 인 등비수열이고 a₅=<b>162</b> 입니다.',en:'Each term is 3 times the one before, so it is geometric with ratio 3, and a₅=<b>162</b>.',zh:'每一项都是前一项的3倍，是公比为3的等比数列，a₅=<b>162</b>。'},
        mathSteps:['\\frac{a_{n+1}}{a_n}=3','a_n=2\\times3^{n-1}'],
        result:{ko:'비가 일정하면 등비!',en:'Constant ratio: geometric!',zh:'比一定就是等比！'},
        book:{ko:'aₙ₊₁²=aₙaₙ₊₂ 는 가운데 항이 양옆의 등비중항이라는 뜻이라 등비수열입니다.',en:'aₙ₊₁²=aₙaₙ₊₂ says each middle term is the geometric mean of its neighbours, so it is geometric.',zh:'aₙ₊₁²=aₙaₙ₊₂表示中间项是两边的等比中项，所以是等比数列。'} },

      { tag:{ko:'③ 되풀이되는 수열',en:'3) Repeating sequences',zh:'③ 循环数列'},
        head:{ko:'a_1=1,\\ a_2=3,\\ a_{n+2}=a_{n+1}-a_n:\\ 1,\\ 3,\\ 2,\\ -1,\\ -3,\\ -2,\\ 1,\\ 3,\\ \\cdots',en:'a_1=1,\\ a_2=3,\\ a_{n+2}=a_{n+1}-a_n:\\ 1,\\ 3,\\ 2,\\ -1,\\ -3,\\ -2,\\ 1,\\ 3,\\ \\cdots',zh:'a_1=1,\\ a_2=3,\\ a_{n+2}=a_{n+1}-a_n:\\ 1,\\ 3,\\ 2,\\ -1,\\ -3,\\ -2,\\ 1,\\ 3,\\ \\cdots'},
        desc:{ko:'차례로 계산하면 a₇=1, a₈=3 으로 처음과 같아집니다. 6 개마다 되풀이되므로 a₁₀₀=a₄=<b>−1</b> 입니다.',en:'Computing in order, a₇=1 and a₈=3 match the start. It repeats every 6 terms, so a₁₀₀=a₄=<b>−1</b>.',zh:'依次计算得a₇=1、a₈=3，与开头相同。每6项循环，所以a₁₀₀=a₄=<b>−1</b>。'},
        mathSteps:['100=6\\times16+4','a_{100}=a_4=-1'],
        result:{ko:'주기를 찾으면 먼 항도 금방!',en:'Find the period and far terms come fast!',zh:'找到周期，远处的项也很快！'},
        book:{ko:'aₙ₊₁+aₙ=c 나 aₙaₙ₊₁=c 는 두 값이 번갈아 나오므로 2 개마다 되풀이됩니다.',en:'aₙ₊₁+aₙ=c and aₙaₙ₊₁=c alternate between two values, repeating every 2 terms.',zh:'aₙ₊₁+aₙ=c或aₙaₙ₊₁=c两个值交替出现，每2项循环。'} }
    ],
    rule:{ ko:'① 차이가 일정하면 등차, aₖ=a₁+(k−1)d  ② 비가 일정하면 등비, aₖ=a₁rᵏ⁻¹  ③ 차례로 계산해 주기를 찾는다',
      en:'① Constant difference: arithmetic, aₖ=a₁+(k−1)d  ② Constant ratio: geometric, aₖ=a₁rᵏ⁻¹  ③ Compute in order and find the period',
      zh:'① 差一定为等差，aₖ=a₁+(k−1)d  ② 比一定为等比，aₖ=a₁rᵏ⁻¹  ③ 依次计算找周期' }
  },

  check:{
    fills:[
      { tex:{ko:'a_1=5,\\ a_2=8,\\ 2a_{n+1}=a_n+a_{n+2}\\ \\Rightarrow\\ a_{6}=\\square',en:'a_1=5,\\ a_2=8,\\ 2a_{n+1}=a_n+a_{n+2}\\ \\Rightarrow\\ a_{6}=\\square',zh:'a_1=5,\\ a_2=8,\\ 2a_{n+1}=a_n+a_{n+2}\\ \\Rightarrow\\ a_{6}=\\square'}, answer:20,
        hint:{ko:'d=3',en:'d=3',zh:'d=3'} },
      { tex:{ko:'a_1=4,\\ a_na_{n+1}=12\\ \\Rightarrow\\ a_{9}=\\square',en:'a_1=4,\\ a_na_{n+1}=12\\ \\Rightarrow\\ a_{9}=\\square',zh:'a_1=4,\\ a_na_{n+1}=12\\ \\Rightarrow\\ a_{9}=\\square'}, answer:4,
        hint:{ko:'4, 3, 4, 3, …',en:'4, 3, 4, 3, …',zh:'4, 3, 4, 3, …'} }
    ],
    open:{ ko:'aₙ₊₂=aₙ₊₁−aₙ 로 정한 수열이 6 개마다 되풀이되는 까닭을 설명해 봅니다.',
      en:'Explain why a sequence defined by aₙ₊₂=aₙ₊₁−aₙ repeats every 6 terms.',
      zh:'说说为什么由aₙ₊₂=aₙ₊₁−aₙ确定的数列每6项循环。' },
    openHint:{ ko:'a₁=p, a₂=q 로 놓으면 a₃=q−p, a₄=−p, a₅=−q, a₆=p−q, a₇=p, a₈=q 입니다. 처음 두 항이 다시 나오면 그 뒤도 똑같이 되풀이됩니다.',
      en:'With a₁=p and a₂=q: a₃=q−p, a₄=−p, a₅=−q, a₆=p−q, a₇=p, a₈=q. Once the first two terms return, everything after repeats.',
      zh:'设a₁=p、a₂=q，则a₃=q−p，a₄=−p，a₅=−q，a₆=p−q，a₇=p，a₈=q。前两项再次出现后，后面完全重复。' }
  },

  lab:{
    generator:'md151_recDef', level:'main', count:6,
    params:{mode:'geo'},
    intro:{
      ko:'aₙ₊₁=raₙ, aₙ₊₁÷aₙ=r, aₙ₊₁²=aₙaₙ₊₂ 에서 첫째항과 공비를 찾아 aₖ=a₁rᵏ⁻¹ 을 계산합니다.',
      en:'From aₙ₊₁=raₙ, aₙ₊₁÷aₙ=r or aₙ₊₁²=aₙaₙ₊₂, find the first term and ratio and compute aₖ=a₁rᵏ⁻¹.',
      zh:'由aₙ₊₁=raₙ、aₙ₊₁÷aₙ=r、aₙ₊₁²=aₙaₙ₊₂求出首项与公比，计算aₖ=a₁rᵏ⁻¹。'
    }
  },

  arena:{
    generator:'md151_recDef', level:'main', count:6, timeLimit:420,
    params:{mode:'two'},
    rule:{ ko:'7분 안에 여러 항 사이의 관계로 정한 수열을 모두 풉니다!', en:'Solve every sequence defined by relations among terms within 7 minutes!', zh:'7分钟内解出所有由多项关系确定的数列！' }
  },

  stamp:{ label:{ ko:'계단 설계사', en:'Stair Designer', zh:'台阶设计师' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'규칙대로 딱 올라갔어! 🪜',en:'Climbed exactly by the rule!',zh:'按规则准确上去了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'등차인지 등비인지 먼저 봐!',en:'First see whether it is arithmetic or geometric!',zh:'先看是等差还是等比！'}, {ko:'aₖ 의 지수는 k−1 이야!',en:'The exponent in aₖ is k−1!',zh:'aₖ的指数是k−1！'} ],
    finish:{ ko:'완벽해! 계단 설계사! 🪜✨', en:'Perfect! Stair Designer!', zh:'完美！台阶设计师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
