/* Numbers of Magic — 유닛 M-134: aˣ+a⁻ˣ 꼴 식의 값 (고등 대수 · 과정 58, 2026-09-29)
   근거: docs/high-build-spec.md MD134. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-134'] = {
  id:'M-134', tier:'algebra', level:'58', order:134,
  generator:'md134_expSym',
  title:{ ko:'aˣ+a⁻ˣ 꼴 식의 값', en:'Values of aˣ+a⁻ˣ', zh:'aˣ+a⁻ˣ型式子的值' },
  subtitle:{ ko:'곱이 1 인 두 수의 짝', en:'Pairs of numbers whose product is 1', zh:'积为1的一对数' },
  icon:'🪞',

  practice:{
    generator:'md134_expSym', level:'practice', count:6,
    params:{mode:'sq'},
    intro:{
      ko:'aˣ 와 a⁻ˣ 는 곱하면 1 입니다. 합이나 차를 제곱하면 가운데 항이 ±2 가 되어 a²ˣ+a⁻²ˣ 가 바로 나옵니다.',
      en:'aˣ times a⁻ˣ is 1. Squaring their sum or difference makes the middle term ±2, which gives a²ˣ+a⁻²ˣ at once.',
      zh:'aˣ与a⁻ˣ相乘等于1。把它们的和或差平方，中间项是±2，立刻得到a²ˣ+a⁻²ˣ。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'2ˣ 와 2⁻ˣ 는 곱하면 언제나 1 입니다. x 가 얼마인지 몰라도 두 수의 합 하나만 알면 제곱·세제곱으로 만든 식의 값이 모두 정해집니다.',
        en:'2ˣ times 2⁻ˣ is always 1. Even without knowing x, the single value of their sum fixes every expression built by squaring or cubing.',
        zh:'2ˣ与2⁻ˣ相乘总是1。即使不知道x，只要知道两数之和，用平方、立方构成的式子的值就全部确定了。' }
    },
    stages:[
      { tag:{ko:'① 제곱',en:'1) Squaring',zh:'① 平方'},
        head:{ko:'2^{x}+2^{-x}=3\\ \\Rightarrow\\ 4^{x}+4^{-x}=7',en:'2^{x}+2^{-x}=3\\ \\Rightarrow\\ 4^{x}+4^{-x}=7',zh:'2^{x}+2^{-x}=3\\ \\Rightarrow\\ 4^{x}+4^{-x}=7'},
        desc:{ko:'(2ˣ+2⁻ˣ)²=4ˣ+2+4⁻ˣ 이므로 4ˣ+4⁻ˣ=3²−2=<b>7</b> 입니다.',
              en:'(2ˣ+2⁻ˣ)²=4ˣ+2+4⁻ˣ, so 4ˣ+4⁻ˣ=3²−2=<b>7</b>.',
              zh:'(2ˣ+2⁻ˣ)²=4ˣ+2+4⁻ˣ，所以4ˣ+4⁻ˣ=3²−2=<b>7</b>。'},
        mathSteps:['(2^{x}+2^{-x})^2=4^{x}+2+4^{-x}','9-2=7'],
        result:{ko:'가운데 항은 언제나 2!',en:'The middle term is always 2!',zh:'中间项总是2！'},
        book:{ko:'2ˣ×2⁻ˣ=2⁰=1 이라서 가운데 항 2×2ˣ×2⁻ˣ 가 2 가 됩니다.',
              en:'Because 2ˣ×2⁻ˣ=2⁰=1, the middle term 2×2ˣ×2⁻ˣ equals 2.',
              zh:'因为2ˣ×2⁻ˣ=2⁰=1，中间项2×2ˣ×2⁻ˣ等于2。'} },

      { tag:{ko:'② 세제곱',en:'2) Cubing',zh:'② 立方'},
        head:{ko:'2^{x}+2^{-x}=3\\ \\Rightarrow\\ 8^{x}+8^{-x}=18',en:'2^{x}+2^{-x}=3\\ \\Rightarrow\\ 8^{x}+8^{-x}=18',zh:'2^{x}+2^{-x}=3\\ \\Rightarrow\\ 8^{x}+8^{-x}=18'},
        desc:{ko:'a³+b³=(a+b)³−3ab(a+b) 에서 ab=1 이므로 8ˣ+8⁻ˣ=3³−3×3=<b>18</b> 입니다.',
              en:'From a³+b³=(a+b)³−3ab(a+b) with ab=1, 8ˣ+8⁻ˣ=3³−3×3=<b>18</b>.',
              zh:'由a³+b³=(a+b)³−3ab(a+b)且ab=1，得8ˣ+8⁻ˣ=3³−3×3=<b>18</b>。'},
        mathSteps:['8^{x}+8^{-x}=(2^{x}+2^{-x})^3-3(2^{x}+2^{-x})','27-9=18'],
        result:{ko:'곱이 1 이면 공식이 짧아진다!',en:'Product 1 shortens the formula!',zh:'积为1，公式就变短了！'},
        book:{ko:'차일 때는 a³−b³=(a−b)³+3ab(a−b) 이므로 부호가 + 가 됩니다.',
              en:'For a difference, a³−b³=(a−b)³+3ab(a−b), so the sign becomes +.',
              zh:'差的情形a³−b³=(a−b)³+3ab(a−b)，符号变成+。'} },

      { tag:{ko:'③ 거꾸로 — 차 구하기',en:'3) Backwards — the difference',zh:'③ 反过来——求差'},
        head:{ko:'4^{x}+4^{-x}=11\\ (x>0)\\ \\Rightarrow\\ 2^{x}-2^{-x}=3',en:'4^{x}+4^{-x}=11\\ (x>0)\\ \\Rightarrow\\ 2^{x}-2^{-x}=3',zh:'4^{x}+4^{-x}=11\\ (x>0)\\ \\Rightarrow\\ 2^{x}-2^{-x}=3'},
        desc:{ko:'(2ˣ−2⁻ˣ)²=4ˣ+4⁻ˣ−2=9 이고, x>0 이면 2ˣ>2⁻ˣ 이므로 2ˣ−2⁻ˣ=<b>3</b> 입니다.',
              en:'(2ˣ−2⁻ˣ)²=4ˣ+4⁻ˣ−2=9, and x>0 gives 2ˣ>2⁻ˣ, so 2ˣ−2⁻ˣ=<b>3</b>.',
              zh:'(2ˣ−2⁻ˣ)²=4ˣ+4⁻ˣ−2=9，x>0时2ˣ>2⁻ˣ，所以2ˣ−2⁻ˣ=<b>3</b>。'},
        mathSteps:['(2^{x}-2^{-x})^2=11-2=9','2^{x}-2^{-x}=3'],
        result:{ko:'제곱근을 고를 때는 부호 확인!',en:'Check the sign when taking the square root!',zh:'开平方时要确认符号！'},
        book:{ko:'x 의 범위가 없으면 차는 3 또는 −3 이 되어 하나로 정해지지 않습니다.',
              en:'Without the range of x, the difference could be 3 or −3, so it would not be determined.',
              zh:'如果没有x的范围，差可能是3或−3，无法确定。'} }
    ],
    rule:{ ko:'① (aˣ±a⁻ˣ)²=a²ˣ+a⁻²ˣ±2  ② 세제곱은 (합)³−3(합), (차)³+3(차)  ③ 제곱근을 고를 때는 x 의 범위로 부호를 정하기',
      en:'① (aˣ±a⁻ˣ)²=a²ˣ+a⁻²ˣ±2  ② Cubes: (sum)³−3(sum), (difference)³+3(difference)  ③ Use the range of x to choose the sign of a square root',
      zh:'① (aˣ±a⁻ˣ)²=a²ˣ+a⁻²ˣ±2  ② 立方：(和)³−3(和)，(差)³+3(差)  ③ 开平方时由x的范围定符号' }
  },

  check:{
    fills:[
      { tex:{ko:'3^{x}+3^{-x}=4\\ \\Rightarrow\\ 9^{x}+9^{-x}=\\square',en:'3^{x}+3^{-x}=4\\ \\Rightarrow\\ 9^{x}+9^{-x}=\\square',zh:'3^{x}+3^{-x}=4\\ \\Rightarrow\\ 9^{x}+9^{-x}=\\square'}, answer:14,
        hint:{ ko:'4²−2', en:'4²−2', zh:'4²−2' } },
      { tex:{ko:'x^{\\frac{1}{2}}-x^{-\\frac{1}{2}}=2\\ \\Rightarrow\\ x+x^{-1}=\\square',en:'x^{\\frac{1}{2}}-x^{-\\frac{1}{2}}=2\\ \\Rightarrow\\ x+x^{-1}=\\square',zh:'x^{\\frac{1}{2}}-x^{-\\frac{1}{2}}=2\\ \\Rightarrow\\ x+x^{-1}=\\square'}, answer:6,
        hint:{ ko:'2²+2', en:'2²+2', zh:'2²+2' } }
    ],
    open:{ ko:'aˣ+a⁻ˣ 의 값이 언제나 2 이상인 까닭을 설명해 봅니다.',
      en:'Explain why aˣ+a⁻ˣ is always at least 2.',
      zh:'说说为什么aˣ+a⁻ˣ的值总是不小于2。' },
    openHint:{ ko:'두 양수 aˣ, a⁻ˣ 의 곱이 1 이므로 산술평균과 기하평균의 관계에서 aˣ+a⁻ˣ≥2√1=2 입니다. 등호는 x=0 일 때 성립합니다.',
      en:'The two positive numbers aˣ and a⁻ˣ have product 1, so by AM–GM aˣ+a⁻ˣ≥2√1=2, with equality when x=0.',
      zh:'两个正数aˣ与a⁻ˣ的积为1，由算术平均与几何平均的关系得aˣ+a⁻ˣ≥2√1=2，x=0时取等号。' }
  },

  lab:{
    generator:'md134_expSym', level:'main', count:6,
    params:{mode:'cube'},
    intro:{
      ko:'곱이 1 인 두 수의 합(또는 차)을 세제곱한 뒤 3×(합)을 빼거나 3×(차)를 더합니다.',
      en:'Cube the sum (or difference) of two numbers whose product is 1, then subtract 3×(sum) or add 3×(difference).',
      zh:'把积为1的两个数的和(或差)立方，再减去3×(和)或加上3×(差)。'
    }
  },

  arena:{
    generator:'md134_expSym', level:'main', count:6, timeLimit:420,
    params:{mode:'diff'},
    rule:{ ko:'7분 안에 합·차·몫으로 만든 식의 값을 모두 구합니다!', en:'Find every value built from sums, differences and quotients within 7 minutes!', zh:'7分钟内求出所有由和、差、商构成的式子的值！' }
  },

  stamp:{ label:{ ko:'거울 짝꿍', en:'Mirror Pair', zh:'镜像伙伴' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'곱이 1 인 짝을 잘 썼어! 🪞',en:'Great use of the product-1 pair!',zh:'积为1的一对用得好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'가운데 항이 2 인지 −2 인지 봐!',en:'Is the middle term 2 or −2?',zh:'看看中间项是2还是−2！'}, {ko:'x 의 범위로 부호를 정해 봐!',en:'Use the range of x to fix the sign!',zh:'用x的范围确定符号！'} ],
    finish:{ ko:'완벽해! 거울 짝꿍! 🪞✨', en:'Perfect! Mirror Pair!', zh:'完美！镜像伙伴！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
