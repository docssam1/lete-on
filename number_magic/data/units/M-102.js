/* Numbers of Magic — 유닛 M-102: 삼차방정식의 근과 계수의 관계 (고등 공통수학1 · 과정 43, 2026-09-29)
   근거: docs/high-build-spec.md MD102. 예시는 새로 만들었다. 역사 문단은 널리 알려진 사실만. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-102'] = {
  id:'M-102', tier:'highmath1', level:'43', order:102,
  generator:'md102_cubicVieta',
  title:{ ko:'삼차방정식의 근과 계수의 관계', en:'Roots and Coefficients of a Cubic', zh:'三次方程的根与系数的关系' },
  subtitle:{ ko:'근을 구하지 않고 계수만으로 계산합니다', en:'Compute from the coefficients, no roots needed', zh:'不求根，只用系数计算' },
  icon:'🔗',

  practice:{
    generator:'md102_cubicVieta', level:'practice', count:6,
    params:{mode:'sum'},
    intro:{
      ko:'ax³+bx²+cx+d=0 의 세 근의 합은 −b/a 입니다. x² 의 계수를 x³ 의 계수로 나누고 부호를 바꿉니다.',
      en:'The sum of the three roots of ax³+bx²+cx+d=0 is −b/a: divide the x² coefficient by the x³ coefficient and change the sign.',
      zh:'ax³+bx²+cx+d=0三根之和为−b/a：用x²的系数除以x³的系数再变号。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'세 근이 α, β, γ 이면 삼차식은 (x−α)(x−β)(x−γ) 로 쓸 수 있습니다. 이것을 펼쳐 계수와 비교하면, 근을 하나도 몰라도 근들의 합과 곱을 알 수 있습니다.',
        en:'If the roots are α, β, γ, the cubic can be written (x−α)(x−β)(x−γ). Expand it and compare coefficients: you learn the sum and product of the roots without knowing any of them.',
        zh:'三个根为α、β、γ时，三次式可写成(x−α)(x−β)(x−γ)。展开后与系数比较，不知道任何一个根也能知道它们的和与积。' },
      history:{ ko:'16세기 프랑스의 비에트는 방정식의 계수를 문자로 나타내어 방정식을 일반적으로 다루었습니다. 그래서 근과 계수의 관계를 "비에트의 정리"라고도 부릅니다.',
        en:'In 16th-century France, Viète wrote the coefficients of equations as letters and treated equations in general. That is why the relations between roots and coefficients are also called Vieta\'s formulas.',
        zh:'16世纪法国的韦达用字母表示方程的系数，一般地研究方程。所以根与系数的关系也叫"韦达定理"。' }
    },
    stages:[
      { tag:{ko:'① 펼쳐서 비교하기',en:'1) Expand and compare',zh:'① 展开并比较'},
        head:{ko:'(x-\\alpha)(x-\\beta)(x-\\gamma)',en:'(x-\\alpha)(x-\\beta)(x-\\gamma)',zh:'(x-\\alpha)(x-\\beta)(x-\\gamma)'},
        desc:{ko:'펼치면 x³−(α+β+γ)x²+(αβ+βγ+γα)x−αβγ 입니다. 최고차항의 계수가 a 이면 전체를 a 로 나누어 비교하므로 <b>합=−b/a, 두 근씩 곱의 합=c/a, 곱=−d/a</b> 입니다.',
              en:'Expanded, it is x³−(α+β+γ)x²+(αβ+βγ+γα)x−αβγ. If the leading coefficient is a, divide everything by a before comparing: <b>sum=−b/a, pairwise products=c/a, product=−d/a</b>.',
              zh:'展开得x³−(α+β+γ)x²+(αβ+βγ+γα)x−αβγ。首项系数为a时全体除以a再比较：<b>和=−b/a，两两之积的和=c/a，积=−d/a</b>。'},
        mathSteps:['=x^3-(\\alpha+\\beta+\\gamma)x^2+(\\alpha\\beta+\\beta\\gamma+\\gamma\\alpha)x-\\alpha\\beta\\gamma'],
        result:{ko:'부호가 −, +, − 로 번갈아 붙습니다!',en:'The signs alternate −, +, −!',zh:'符号按−、+、−交替！'},
        book:{ko:'이차방정식의 α+β=−b/a, αβ=c/a 를 한 단계 넓힌 것입니다.',
              en:'It extends α+β=−b/a and αβ=c/a for quadratics by one step.',
              zh:'这是二次方程α+β=−b/a、αβ=c/a的推广。'} },

      { tag:{ko:'② 계수로 바로 읽기',en:'2) Read straight from the coefficients',zh:'② 直接从系数读出'},
        head:{ko:'x^3-6x^2+11x-6=0',en:'x^3-6x^2+11x-6=0',zh:'x^3-6x^2+11x-6=0'},
        desc:{ko:'a=1 이므로 합은 <b>6</b>, 두 근씩 곱의 합은 <b>11</b>, 곱은 <b>6</b> 입니다. 실제로 근은 1, 2, 3 이라 1+2+3=6, 1×2×3=6 입니다.',
              en:'Here a=1, so the sum is <b>6</b>, the pairwise sum is <b>11</b> and the product is <b>6</b>. Indeed the roots are 1, 2, 3: 1+2+3=6 and 1×2×3=6.',
              zh:'a=1，所以和为<b>6</b>，两两之积的和为<b>11</b>，积为<b>6</b>。实际上根是1、2、3：1+2+3=6，1×2×3=6。'},
        mathSteps:['\\alpha+\\beta+\\gamma=6', '\\alpha\\beta+\\beta\\gamma+\\gamma\\alpha=11', '\\alpha\\beta\\gamma=6'],
        result:{ko:'근을 몰라도 합과 곱은 바로 보입니다!',en:'The sum and product show up without the roots!',zh:'不求根也能直接看出和与积！'},
        book:{ko:'1×2+2×3+3×1=11 로 두 근씩 곱의 합도 맞습니다.',
              en:'1×2+2×3+3×1=11 confirms the pairwise sum too.',
              zh:'1×2+2×3+3×1=11，两两之积的和也对。'} },

      { tag:{ko:'③ 합과 곱으로 식의 값 만들기',en:'3) Build other values from sum and product',zh:'③ 用和与积求式子的值'},
        head:{ko:'\\alpha^2+\\beta^2+\\gamma^2=6^2-2\\times11',en:'\\alpha^2+\\beta^2+\\gamma^2=6^2-2\\times11',zh:'\\alpha^2+\\beta^2+\\gamma^2=6^2-2\\times11'},
        desc:{ko:'(α+β+γ)² 을 펼치면 제곱의 합에 두 근씩 곱의 합이 두 번 더해져 있습니다. 그래서 α²+β²+γ²=36−22=<b>14</b> 입니다.',
              en:'Expanding (α+β+γ)² gives the sum of squares plus twice the pairwise sum, so α²+β²+γ²=36−22=<b>14</b>.',
              zh:'展开(α+β+γ)²得平方和加两倍的两两之积的和，所以α²+β²+γ²=36−22=<b>14</b>。'},
        mathSteps:['=36-22', '=14'],
        result:{ko:'곱셈공식의 변형과 같은 요령입니다!',en:'The same trick as rearranging multiplication formulas!',zh:'和乘法公式的变形是同样的方法！'},
        book:{ko:'1/α+1/β+1/γ 는 통분하면 (αβ+βγ+γα)/αβγ 입니다.',
              en:'Over a common denominator, 1/α+1/β+1/γ=(αβ+βγ+γα)/αβγ.',
              zh:'通分得1/α+1/β+1/γ=(αβ+βγ+γα)/αβγ。'} }
    ],
    rule:{ ko:'① 합=−b/a  ② 두 근씩 곱의 합=c/a  ③ 곱=−d/a — 부호는 −, +, − 입니다',
      en:'① Sum=−b/a  ② Pairwise sum=c/a  ③ Product=−d/a — signs go −, +, −',
      zh:'① 和=−b/a  ② 两两之积的和=c/a  ③ 积=−d/a——符号为−、+、−' }
  },

  check:{
    fills:[
      { tex:'2x^3-4x^2+6x-8=0 \\;\\Rightarrow\\; \\alpha+\\beta+\\gamma=\\square', answer:2,
        hint:{ ko:'−(−4)÷2', en:'−(−4)÷2', zh:'−(−4)÷2' } },
      { tex:'2x^3-4x^2+6x-8=0 \\;\\Rightarrow\\; \\alpha\\beta\\gamma=\\square', answer:4,
        hint:{ ko:'−(−8)÷2', en:'−(−8)÷2', zh:'−(−8)÷2' } }
    ],
    open:{ ko:'x³−3x²+5x−2=0 의 세 근 α, β, γ 에 대해 1/α+1/β+1/γ 를 구하는 과정을 설명해 봅니다.',
      en:'For the roots α, β, γ of x³−3x²+5x−2=0, explain how to find 1/α+1/β+1/γ.',
      zh:'对x³−3x²+5x−2=0的三个根α、β、γ，说说求1/α+1/β+1/γ的过程。' },
    openHint:{ ko:'αβ+βγ+γα=5, αβγ=2 이므로 5/2 입니다.',
      en:'αβ+βγ+γα=5 and αβγ=2, so it is 5/2.',
      zh:'αβ+βγ+γα=5，αβγ=2，所以是5/2。' }
  },

  lab:{
    generator:'md102_cubicVieta', level:'main', count:6,
    params:{mode:'product'},
    intro:{
      ko:'세 근의 곱은 −d/a 입니다. 상수항의 부호를 바꾸어 x³ 의 계수로 나눕니다.',
      en:'The product of the roots is −d/a: change the sign of the constant and divide by the x³ coefficient.',
      zh:'三根之积为−d/a：把常数项变号再除以x³的系数。'
    }
  },

  arena:{
    generator:'md102_cubicVieta', level:'main', count:6, timeLimit:420,
    params:{mode:'pair'},
    rule:{ ko:'7분 안에 두 근씩 곱의 합과 식의 값을 모두 구합니다!', en:'Find every pairwise sum and value within 7 minutes!', zh:'7分钟内求出所有两两之积的和与式子的值！' }
  },

  stamp:{ label:{ ko:'계수 해독가', en:'Coefficient Decoder', zh:'系数解读者' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'근을 몰라도 척척 구하는구나! 🔗',en:'You found it without any roots!',zh:'不求根也算得这么快！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'부호는 −, +, − 순서야!',en:'The signs go −, +, −!',zh:'符号是−、+、−的顺序！'}, {ko:'x³ 의 계수로 나누는 걸 잊지 마!',en:'Do not forget to divide by the x³ coefficient!',zh:'别忘了除以x³的系数！'} ],
    finish:{ ko:'완벽해! 계수 해독가! 🔗✨', en:'Perfect! Coefficient Decoder!', zh:'完美！系数解读者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
