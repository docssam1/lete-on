/* Numbers of Magic — 유닛 M-98: 두 수를 근으로 하는 이차방정식 (고등 공통수학1 · 과정 41 이차방정식, 2026-09-29)
   근거: docs/high-build-spec.md MD98. 예시는 새로 만들었다. 역사 문단은 널리 알려진 사실만. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-98'] = {
  id:'M-98', tier:'highmath1', level:'41', order:98,
  generator:'md98_buildQuadratic',
  title:{ ko:'두 수를 근으로 하는 이차방정식', en:'Building a Quadratic from Its Roots', zh:'以两数为根的二次方程' },
  subtitle:{ ko:'근의 합과 곱만 알면 방정식을 세웁니다', en:'The sum and product of the roots build the equation', zh:'知道两根之和与积就能列方程' },
  icon:'🏗️',

  practice:{
    generator:'md98_buildQuadratic', level:'practice', count:6,
    params:{mode:'intRoots'},
    intro:{
      ko:'두 근이 α, β이면 x²−(α+β)x+αβ=0입니다. a와 b를 두 칸에 씁니다.',
      en:'If the roots are α and β, the equation is x²−(α+β)x+αβ=0. Enter a and b in the two boxes.',
      zh:'两根为α、β时方程为x²−(α+β)x+αβ=0。把a和b填入两格。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'지금까지는 방정식을 받아 근을 구했습니다. 이번에는 거꾸로 근 2와 3을 받아 방정식을 만듭니다. (x−2)(x−3)=0을 펼치면 x²−5x+6=0 — 5는 두 근의 합, 6은 두 근의 곱입니다.',
        en:'So far we took an equation and found its roots. Now go backwards: from the roots 2 and 3, build the equation. Expanding (x−2)(x−3)=0 gives x²−5x+6=0 — 5 is the sum of the roots and 6 is their product.',
        zh:'之前都是给方程求根。这次反过来：由根2和3列方程。展开(x−2)(x−3)=0得x²−5x+6=0——5是两根之和，6是两根之积。' },
      history:{ ko:'근과 계수 사이의 관계는 16세기 프랑스의 수학자 비에트의 이름을 따서 비에트의 정리라고도 부릅니다. 비에트는 미지수와 계수를 문자로 나타내는 방법을 널리 쓴 사람으로도 알려져 있습니다.',
        en:'The relation between roots and coefficients is also called Vieta\'s formulas, after the 16th-century French mathematician François Viète, who is also known for writing unknowns and coefficients with letters.',
        zh:'根与系数的关系也称韦达定理，以16世纪法国数学家韦达命名。韦达也以用字母表示未知数和系数而闻名。' }
    },
    stages:[
      { tag:{ko:'① 합과 곱으로 방정식 세우기',en:'1) Build it from the sum and product',zh:'① 用和与积列方程'},
        head:{ko:'x^2-(\\alpha+\\beta)x+\\alpha\\beta=0',en:'x^2-(\\alpha+\\beta)x+\\alpha\\beta=0',zh:'x^2-(\\alpha+\\beta)x+\\alpha\\beta=0'},
        desc:{ko:'(x−α)(x−β)를 펼친 모양입니다. 두 근이 4, −1이면 합 3, 곱 −4이므로 <b>x²−3x−4=0</b>입니다.',
              en:'This is (x−α)(x−β) expanded. For roots 4 and −1 the sum is 3 and the product −4, so <b>x²−3x−4=0</b>.',
              zh:'这是(x−α)(x−β)的展开形式。两根为4、−1时和为3、积为−4，所以<b>x²−3x−4=0</b>。'},
        mathSteps:['\\alpha+\\beta=3,\\quad \\alpha\\beta=-4', 'x^2-3x-4=0'],
        result:{ko:'x의 계수는 합의 부호를 바꾼 것, 상수항은 곱입니다!',en:'The x-coefficient is minus the sum; the constant is the product!',zh:'x的系数是和的相反数，常数项是积！'},
        book:{ko:'x²의 계수가 1이 아니라 k라면 k(x²−(α+β)x+αβ)=0으로 씁니다.',
              en:'If the leading coefficient is k rather than 1, write k(x²−(α+β)x+αβ)=0.',
              zh:'若x²的系数是k而不是1，就写成k(x²−(α+β)x+αβ)=0。'} },

      { tag:{ko:'② 새 두 근의 합과 곱',en:'2) Sum and product of new roots',zh:'② 新两根的和与积'},
        head:{ko:'x^2-3x+1=0 \\;\\Rightarrow\\; 2\\alpha,\\ 2\\beta',en:'x^2-3x+1=0 \\;\\Rightarrow\\; 2\\alpha,\\ 2\\beta',zh:'x^2-3x+1=0 \\;\\Rightarrow\\; 2\\alpha,\\ 2\\beta'},
        desc:{ko:'α+β=3, αβ=1입니다. 새 두 근 2α, 2β의 합은 2(α+β)=6, 곱은 4αβ=4이므로 <b>x²−6x+4=0</b>입니다.',
              en:'Here α+β=3 and αβ=1. The new roots 2α and 2β have sum 2(α+β)=6 and product 4αβ=4, so <b>x²−6x+4=0</b>.',
              zh:'α+β=3、αβ=1。新两根2α、2β之和为2(α+β)=6，积为4αβ=4，所以<b>x²−6x+4=0</b>。'},
        mathSteps:['2\\alpha+2\\beta=6', '4\\alpha\\beta=4', 'x^2-6x+4=0'],
        result:{ko:'α, β를 직접 구하지 않아도 새 방정식이 나옵니다!',en:'The new equation comes out without finding α and β!',zh:'不求出α、β也能得到新方程！'},
        book:{ko:'근이 α², β²이면 합은 (α+β)²−2αβ, 곱은 (αβ)²입니다.',
              en:'For roots α² and β², the sum is (α+β)²−2αβ and the product is (αβ)².',
              zh:'根为α²、β²时，和为(α+β)²−2αβ，积为(αβ)²。'} },

      { tag:{ko:'③ 켤레근은 짝으로 온다',en:'3) Conjugate roots come in pairs',zh:'③ 共轭根成对出现'},
        head:{ko:'\\alpha=1+\\sqrt{2} \\;\\Rightarrow\\; \\beta=1-\\sqrt{2}',en:'\\alpha=1+\\sqrt{2} \\;\\Rightarrow\\; \\beta=1-\\sqrt{2}',zh:'\\alpha=1+\\sqrt{2} \\;\\Rightarrow\\; \\beta=1-\\sqrt{2}'},
        desc:{ko:'계수가 유리수이면 1+√2가 근일 때 1−√2도 근입니다. 합 2, 곱 1−2=−1이므로 <b>x²−2x−1=0</b>입니다. 계수가 실수일 때 허근도 m±ni로 짝을 이룹니다.',
              en:'With rational coefficients, if 1+√2 is a root then so is 1−√2. The sum is 2 and the product is 1−2=−1, so <b>x²−2x−1=0</b>. With real coefficients, complex roots also pair up as m±ni.',
              zh:'系数为有理数时，若1+√2是根则1−√2也是根。和为2，积为1−2=−1，所以<b>x²−2x−1=0</b>。系数为实数时，虚根也成对出现为m±ni。'},
        mathSteps:['\\alpha+\\beta=2', '\\alpha\\beta=1-2=-1', 'x^2-2x-1=0'],
        result:{ko:'근 하나만 주어져도 짝을 찾아 방정식을 세웁니다!',en:'Given just one root, find its partner and build the equation!',zh:'只给一个根，也能找到它的伙伴列出方程！'},
        book:{ko:'허근 2+3i의 짝은 2−3i이고, 합 4, 곱 4+9=13이라 x²−4x+13=0입니다.',
              en:'The partner of 2+3i is 2−3i; the sum is 4 and the product 4+9=13, giving x²−4x+13=0.',
              zh:'虚根2+3i的伙伴是2−3i，和为4，积为4+9=13，得x²−4x+13=0。'} }
    ],
    rule:{ ko:'① 두 근 α, β → x²−(α+β)x+αβ=0  ② 새 근은 합과 곱부터  ③ 유리수 계수면 m±√n, 실수 계수면 m±ni가 짝입니다',
      en:'① Roots α, β → x²−(α+β)x+αβ=0  ② For new roots, start from the sum and product  ③ Rational coefficients pair m±√n; real coefficients pair m±ni',
      zh:'① 两根α、β → x²−(α+β)x+αβ=0  ② 新根先求和与积  ③ 有理系数m±√n成对，实系数m±ni成对' }
  },

  check:{
    fills:[
      { tex:'\\alpha=2,\\ \\beta=5 \\;\\Rightarrow\\; x^2-7x+\\square=0', answer:10,
        hint:{ ko:'곱 2×5', en:'product 2×5', zh:'积2×5' } },
      { tex:'\\alpha=3+i \\;\\Rightarrow\\; x^2-6x+\\square=0', answer:10,
        hint:{ ko:'(3+i)(3−i)=9+1', en:'(3+i)(3−i)=9+1', zh:'(3+i)(3−i)=9+1' } }
    ],
    open:{ ko:'x²−4x+2=0의 두 근이 α, β일 때 α+1, β+1을 근으로 하는 방정식을 만드는 과정을 설명해 봅니다.',
      en:'If α and β are the roots of x²−4x+2=0, explain how to build the equation with roots α+1 and β+1.',
      zh:'设x²−4x+2=0的两根为α、β，说说如何列出以α+1、β+1为根的方程。' },
    openHint:{ ko:'합 4+2=6, 곱 αβ+(α+β)+1=2+4+1=7이므로 x²−6x+7=0입니다.',
      en:'Sum 4+2=6, product αβ+(α+β)+1=2+4+1=7, so x²−6x+7=0.',
      zh:'和4+2=6，积αβ+(α+β)+1=2+4+1=7，所以x²−6x+7=0。' }
  },

  lab:{
    generator:'md98_buildQuadratic', level:'main', count:6,
    params:{mode:'shifted'},
    intro:{
      ko:'원래 방정식에서 α+β, αβ를 읽고 새 두 근의 합과 곱을 계산합니다.',
      en:'Read α+β and αβ from the original equation, then compute the sum and product of the new roots.',
      zh:'从原方程读出α+β、αβ，再算新两根的和与积。'
    }
  },

  arena:{
    generator:'md98_buildQuadratic', level:'main', count:6, timeLimit:420,
    params:{mode:'conjugate'},
    rule:{ ko:'7분 안에 켤레근을 짝지어 a, b를 모두 구합니다!', en:'Pair up conjugate roots and find every a and b within 7 minutes!', zh:'7分钟内配对共轭根，求出所有a和b！' }
  },

  stamp:{ label:{ ko:'방정식 건축가', en:'Equation Architect', zh:'方程建筑师' }, coins:51 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'근으로 방정식을 척척 지었구나! 🏗️',en:'You built the equation from its roots!',zh:'用根把方程搭好了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'x의 계수는 두 근의 합에 −를 붙인 거야!',en:'The x-coefficient is minus the sum of the roots!',zh:'x的系数是两根之和的相反数！'}, {ko:'근 하나만 보이면 켤레 짝을 떠올려 봐!',en:'Only one root given? Think of its conjugate partner!',zh:'只看到一个根？想想它的共轭伙伴！'} ],
    finish:{ ko:'완벽해! 방정식 건축가! 🏗️✨', en:'Perfect! Equation Architect!', zh:'完美！方程建筑师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
