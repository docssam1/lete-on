/* Numbers of Magic — 유닛 M-142: 삼각함수의 정의와 관계 (고등 대수 · 과정 63 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD142. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-142'] = {
  id:'M-142', tier:'algebra', level:'63', order:142,
  generator:'md142_trigDef',
  title:{ ko:'삼각함수의 정의와 관계', en:'Definitions & Relations of Trig Functions', zh:'三角函数的定义与关系' },
  subtitle:{ ko:'원 위의 한 점이 알려 주는 세 값', en:'Three values told by one point on a circle', zh:'圆上一点告诉我们的三个值' },
  icon:'📐',

  practice:{
    generator:'md142_trigDef', level:'practice', count:6,
    params:{mode:'point'},
    intro:{
      ko:'OP=r=√(x²+y²) 를 먼저 구합니다. sinθ=y/r, cosθ=x/r, tanθ=y/x 이고, 부호는 x, y 의 부호를 그대로 따릅니다.',
      en:'First find OP=r=√(x²+y²). Then sinθ=y/r, cosθ=x/r and tanθ=y/x, with signs following the signs of x and y.',
      zh:'先求OP=r=√(x²+y²)。于是sinθ=y/r，cosθ=x/r，tanθ=y/x，符号跟随x、y的符号。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'직각삼각형에서 배운 사인·코사인은 예각에서만 쓸 수 있었습니다. 원점에서 뻗은 동경 위의 점으로 정의를 바꾸면 둔각, 음의 각, 360° 를 넘는 각에서도 값이 생깁니다.',
        en:'The sine and cosine from right triangles only worked for acute angles. Redefining them with a point on a terminal side from the origin gives values for obtuse angles, negative angles and angles beyond 360°.',
        zh:'在直角三角形中学的正弦、余弦只适用于锐角。改用从原点出发的终边上的点来定义，钝角、负角、超过360°的角也有了值。' }
    },
    stages:[
      { tag:{ko:'① 점으로 정의',en:'1) Defined by a point',zh:'① 用点定义'},
        head:{ko:'P(-3,\\,4):\\ r=5,\\ \\sin\\theta=\\frac{4}{5},\\ \\cos\\theta=-\\frac{3}{5}',en:'P(-3,\\,4):\\ r=5,\\ \\sin\\theta=\\frac{4}{5},\\ \\cos\\theta=-\\frac{3}{5}',zh:'P(-3,\\,4):\\ r=5,\\ \\sin\\theta=\\frac{4}{5},\\ \\cos\\theta=-\\frac{3}{5}'},
        desc:{ko:'r=√(9+16)=5 입니다. sinθ=4/5, cosθ=−3/5, tanθ=−4/3 이므로 5(sinθ+cosθ)=4−3=<b>1</b> 입니다.',
              en:'r=√(9+16)=5. sinθ=4/5, cosθ=−3/5, tanθ=−4/3, so 5(sinθ+cosθ)=4−3=<b>1</b>.',
              zh:'r=√(9+16)=5。sinθ=4/5，cosθ=−3/5，tanθ=−4/3，所以5(sinθ+cosθ)=4−3=<b>1</b>。'},
        mathSteps:['r=\\sqrt{(-3)^2+4^2}=5','5(\\sin\\theta+\\cos\\theta)=1'],
        result:{ko:'y 는 사인, x 는 코사인!',en:'y for sine, x for cosine!',zh:'y对应正弦，x对应余弦！'},
        book:{ko:'P 가 제2사분면에 있으므로 sinθ 는 양수, cosθ 와 tanθ 는 음수입니다.',
              en:'P is in quadrant 2, so sinθ is positive while cosθ and tanθ are negative.',
              zh:'P在第二象限，所以sinθ为正，cosθ与tanθ为负。'} },

      { tag:{ko:'② sin²θ+cos²θ=1',en:'2) sin²θ+cos²θ=1',zh:'② sin²θ+cos²θ=1'},
        head:{ko:'\\sin\\theta=\\frac{3}{5}\\ (\\frac{\\pi}{2}<\\theta<\\pi)\\ \\Rightarrow\\ \\cos\\theta=-\\frac{4}{5}',en:'\\sin\\theta=\\frac{3}{5}\\ (\\frac{\\pi}{2}<\\theta<\\pi)\\ \\Rightarrow\\ \\cos\\theta=-\\frac{4}{5}',zh:'\\sin\\theta=\\frac{3}{5}\\ (\\frac{\\pi}{2}<\\theta<\\pi)\\ \\Rightarrow\\ \\cos\\theta=-\\frac{4}{5}'},
        desc:{ko:'cos²θ=1−9/25=16/25 이고 θ 가 제2사분면의 각이므로 cosθ=−4/5 입니다. 그래서 4tanθ=4×(3/5)÷(−4/5)=<b>−3</b> 입니다.',
              en:'cos²θ=1−9/25=16/25, and θ is in quadrant 2, so cosθ=−4/5. Hence 4tanθ=4×(3/5)÷(−4/5)=<b>−3</b>.',
              zh:'cos²θ=1−9/25=16/25，θ在第二象限，所以cosθ=−4/5。于是4tanθ=4×(3/5)÷(−4/5)=<b>−3</b>。'},
        mathSteps:['\\cos^2\\theta=1-\\frac{9}{25}=\\frac{16}{25}','4\\tan\\theta=-3'],
        result:{ko:'제곱근의 부호는 사분면이 정한다!',en:'The quadrant decides the sign of the root!',zh:'平方根的符号由象限决定！'},
        book:{ko:'x²+y²=r² 의 양변을 r² 으로 나누면 (x/r)²+(y/r)²=1, 곧 cos²θ+sin²θ=1 입니다.',
              en:'Divide x²+y²=r² by r² to get (x/r)²+(y/r)²=1, that is cos²θ+sin²θ=1.',
              zh:'把x²+y²=r²两边除以r²，得(x/r)²+(y/r)²=1，即cos²θ+sin²θ=1。'} },

      { tag:{ko:'③ 합과 곱',en:'3) Sum and product',zh:'③ 和与积'},
        head:{ko:'\\sin\\theta+\\cos\\theta=\\frac{1}{2}\\ \\Rightarrow\\ \\sin\\theta\\cos\\theta=-\\frac{3}{8}',en:'\\sin\\theta+\\cos\\theta=\\frac{1}{2}\\ \\Rightarrow\\ \\sin\\theta\\cos\\theta=-\\frac{3}{8}',zh:'\\sin\\theta+\\cos\\theta=\\frac{1}{2}\\ \\Rightarrow\\ \\sin\\theta\\cos\\theta=-\\frac{3}{8}'},
        desc:{ko:'양변을 제곱하면 1+2sinθcosθ=1/4 이므로 sinθcosθ=−3/8, 곧 8sinθcosθ=<b>−3</b> 입니다.',
              en:'Squaring gives 1+2sinθcosθ=1/4, so sinθcosθ=−3/8, i.e. 8sinθcosθ=<b>−3</b>.',
              zh:'两边平方得1+2sinθcosθ=1/4，所以sinθcosθ=−3/8，即8sinθcosθ=<b>−3</b>。'},
        mathSteps:['1+2\\sin\\theta\\cos\\theta=\\frac{1}{4}','8\\sin\\theta\\cos\\theta=-3'],
        result:{ko:'제곱하면 곱이 나온다!',en:'Square it and the product appears!',zh:'一平方，积就出来了！'},
        book:{ko:'차 sinθ−cosθ 를 제곱하면 1−2sinθcosθ 가 되어 부호만 달라집니다.',
              en:'Squaring the difference sinθ−cosθ gives 1−2sinθcosθ — only the sign changes.',
              zh:'把差sinθ−cosθ平方得1−2sinθcosθ，只是符号不同。'} }
    ],
    rule:{ ko:'① sinθ=y/r, cosθ=x/r, tanθ=y/x  ② sin²θ+cos²θ=1, 부호는 사분면으로  ③ (sinθ±cosθ)²=1±2sinθcosθ',
      en:'① sinθ=y/r, cosθ=x/r, tanθ=y/x  ② sin²θ+cos²θ=1, sign from the quadrant  ③ (sinθ±cosθ)²=1±2sinθcosθ',
      zh:'① sinθ=y/r，cosθ=x/r，tanθ=y/x  ② sin²θ+cos²θ=1，符号看象限  ③ (sinθ±cosθ)²=1±2sinθcosθ' }
  },

  check:{
    fills:[
      { tex:{ko:'P(5,\\,-12)\\ \\Rightarrow\\ 13\\sin\\theta=\\square',en:'P(5,\\,-12)\\ \\Rightarrow\\ 13\\sin\\theta=\\square',zh:'P(5,\\,-12)\\ \\Rightarrow\\ 13\\sin\\theta=\\square'}, answer:-12,
        hint:{ ko:'r=13, sinθ=y/r', en:'r=13, sinθ=y/r', zh:'r=13，sinθ=y/r' } },
      { tex:{ko:'\\tan\\theta=2\\ \\Rightarrow\\ \\frac{1}{\\cos^2\\theta}=\\square',en:'\\tan\\theta=2\\ \\Rightarrow\\ \\frac{1}{\\cos^2\\theta}=\\square',zh:'\\tan\\theta=2\\ \\Rightarrow\\ \\frac{1}{\\cos^2\\theta}=\\square'}, answer:5,
        hint:{ ko:'1+tan²θ', en:'1+tan²θ', zh:'1+tan²θ' } }
    ],
    open:{ ko:'sinθ 의 값만 알 때 cosθ 가 두 가지로 나올 수 있는 까닭과, 하나로 정하는 방법을 설명해 봅니다.',
      en:'Explain why knowing only sinθ can give two values of cosθ, and how to decide which one.',
      zh:'说说只知道sinθ时cosθ为什么可能有两个值，以及如何确定是哪一个。' },
    openHint:{ ko:'cos²θ=1−sin²θ 에서 제곱근은 양수와 음수 두 개입니다. 같은 sinθ 를 갖는 각이 제1·제2사분면(또는 제3·제4사분면)에 하나씩 있으므로 θ 의 범위가 주어져야 부호가 정해집니다.',
      en:'cos²θ=1−sin²θ has a positive and a negative square root. Angles with the same sinθ lie one in each of quadrants 1 and 2 (or 3 and 4), so the range of θ is needed to fix the sign.',
      zh:'cos²θ=1−sin²θ的平方根有正负两个。sinθ相同的角在第一、二象限(或第三、四象限)各有一个，所以需要θ的范围才能确定符号。' }
  },

  lab:{
    generator:'md142_trigDef', level:'main', count:6,
    params:{mode:'pyth'},
    intro:{
      ko:'sin²θ+cos²θ=1 로 다른 값을 구하고 θ 의 범위로 부호를 정합니다. tanθ 만 주어지면 분자·분모를 cosθ 로 나누어 tanθ 로 바꿉니다.',
      en:'Use sin²θ+cos²θ=1 to find the other value and the range of θ for the sign. If only tanθ is given, divide the numerator and denominator by cosθ.',
      zh:'用sin²θ+cos²θ=1求另一个值，由θ的范围定符号。只给出tanθ时，把分子分母同除以cosθ。'
    }
  },

  arena:{
    generator:'md142_trigDef', level:'main', count:6, timeLimit:420,
    params:{mode:'sumprod'},
    rule:{ ko:'7분 안에 sinθ±cosθ 와 sinθcosθ 사이를 오가며 모두 풉니다!', en:'Go between sinθ±cosθ and sinθcosθ and solve them all within 7 minutes!', zh:'7分钟内在sinθ±cosθ与sinθcosθ之间转换，全部解出！' }
  },

  stamp:{ label:{ ko:'동경 항해사', en:'Terminal-Side Navigator', zh:'终边领航员' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'부호까지 정확해! 📐',en:'Right down to the sign!',zh:'连符号都对了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'사분면으로 부호를 정해 봐!',en:'Use the quadrant for the sign!',zh:'用象限确定符号！'}, {ko:'제곱해서 1±2sinθcosθ 를 만들어 봐!',en:'Square to get 1±2sinθcosθ!',zh:'平方得到1±2sinθcosθ！'} ],
    finish:{ ko:'완벽해! 동경 항해사! 📐✨', en:'Perfect! Terminal-Side Navigator!', zh:'完美！终边领航员！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
