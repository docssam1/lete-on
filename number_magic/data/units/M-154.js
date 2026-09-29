/* Numbers of Magic — 유닛 M-154: 미분법 공식 (고등 미적분Ⅰ · 과정 73 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD154. 교과서 없이 예시를 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-154'] = {
  id:'M-154', tier:'calculus1', level:'73', order:154,
  generator:'md154_diffRules',
  title:{ ko:'미분법 공식', en:'Differentiation Rules', zh:'求导法则' },
  subtitle:{ ko:'항마다, 곱이면 번갈아, 괄호면 안까지', en:'Term by term, in turns for products, and inside for brackets', zh:'逐项求导，乘积轮流求导，括号还要乘内层' },
  icon:'✏️',

  practice:{
    generator:'md154_diffRules', level:'practice', count:6,
    params:{mode:'poly'},
    intro:{
      ko:'(xⁿ)′=nxⁿ⁻¹ 로 항마다 미분해 f′(x) 를 만든 뒤 x 에 값을 넣습니다. 계수 a 가 있으면 f′(x) 에 값을 넣은 식을 a 에 대한 방정식으로 풉니다.',
      en:'Differentiate term by term with (xⁿ)′=nxⁿ⁻¹ to get f′(x), then substitute. If there is a coefficient a, solve the resulting equation in a.',
      zh:'用(xⁿ)′=nxⁿ⁻¹逐项求导得到f′(x)后代值。若有系数a，把代值后的式子当作关于a的方程来解。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'도함수를 매번 극한의 정의로 구하면 시간이 오래 걸립니다. 몇 가지 공식만 기억하면 다항함수와 곱, 거듭제곱의 도함수를 바로 쓸 수 있습니다.',
        en:'Finding every derivative from the limit definition takes a long time. With a few rules you can write down derivatives of polynomials, products and powers at once.',
        zh:'每次都用极限的定义求导函数很费时间。只要记住几个公式，就能直接写出多项式、乘积和幂的导函数。' }
    },
    stages:[
      { tag:{ko:'① 다항함수',en:'1) Polynomials',zh:'① 多项式函数'},
        head:{ko:"f(x)=x^3-2x^2+5x\\ \\Rightarrow\\ f'(x)=3x^2-4x+5",en:"f(x)=x^3-2x^2+5x\\ \\Rightarrow\\ f'(x)=3x^2-4x+5",zh:"f(x)=x^3-2x^2+5x\\ \\Rightarrow\\ f'(x)=3x^2-4x+5"},
        desc:{ko:'항마다 지수를 앞으로 내리고 지수를 하나 줄입니다. f′(2)=12−8+5=<b>9</b> 입니다.',en:'For each term bring the exponent down and lower it by one. f′(2)=12−8+5=<b>9</b>.',zh:'每一项把指数移到前面，指数减一。f′(2)=12−8+5=<b>9</b>。'},
        mathSteps:["(x^n)'=nx^{n-1}","f'(2)=3\\times4-4\\times2+5=9"],
        result:{ko:'항마다 미분!',en:'Term by term!',zh:'逐项求导！'},
        book:{ko:'상수항은 미분하면 0 이 됩니다. 그래프를 위아래로 옮겨도 기울기는 그대로이기 때문입니다.',en:'A constant term differentiates to 0: shifting a graph up or down does not change its slopes.',zh:'常数项求导为0，因为把图像上下平移不改变斜率。'} },

      { tag:{ko:'② 곱의 미분법',en:'2) Product rule',zh:'② 乘积的求导'},
        head:{ko:"f(x)=(x^2+1)(2x-3)\\ \\Rightarrow\\ f'(x)=2x(2x-3)+2(x^2+1)",en:"f(x)=(x^2+1)(2x-3)\\ \\Rightarrow\\ f'(x)=2x(2x-3)+2(x^2+1)",zh:"f(x)=(x^2+1)(2x-3)\\ \\Rightarrow\\ f'(x)=2x(2x-3)+2(x^2+1)"},
        desc:{ko:'앞의 것만 미분한 항과 뒤의 것만 미분한 항을 더합니다. f′(1)=2×(−1)+2×2=<b>2</b> 입니다.',en:'Add the term where only the first factor is differentiated and the term where only the second is. f′(1)=2×(−1)+2×2=<b>2</b>.',zh:'把只对前一个因式求导的项与只对后一个因式求导的项相加。f′(1)=2×(−1)+2×2=<b>2</b>。'},
        mathSteps:["\\{f(x)g(x)\\}'=f'(x)g(x)+f(x)g'(x)","f'(1)=2\\times(-1)+2\\times2=2"],
        result:{ko:'번갈아 하나씩!',en:'One at a time, in turns!',zh:'轮流求导一个！'},
        book:{ko:'전개하면 2x³−3x²+2x−3 이고 f′(x)=6x²−6x+2 라서 f′(1)=2 로 같습니다. 곱의 꼴 그대로 넣는 쪽이 계산이 짧습니다.',en:'Expanded it is 2x³−3x²+2x−3 with f′(x)=6x²−6x+2, so f′(1)=2 as well. Substituting into the product form is shorter.',zh:'展开得2x³−3x²+2x−3，f′(x)=6x²−6x+2，f′(1)=2，结果相同。保持乘积形式代值计算更短。'} },

      { tag:{ko:'③ (ax+b)ⁿ 의 미분',en:'3) Derivative of (ax+b)ⁿ',zh:'③ (ax+b)ⁿ的导数'},
        head:{ko:"f(x)=(2x-1)^3\\ \\Rightarrow\\ f'(x)=3(2x-1)^2\\times2",en:"f(x)=(2x-1)^3\\ \\Rightarrow\\ f'(x)=3(2x-1)^2\\times2",zh:"f(x)=(2x-1)^3\\ \\Rightarrow\\ f'(x)=3(2x-1)^2\\times2"},
        desc:{ko:'지수를 내리고 하나 줄인 뒤, 괄호 안 2x−1 을 미분한 2 를 곱합니다. f′(2)=6×3²=<b>54</b> 입니다.',en:'Bring the exponent down, lower it by one, then multiply by 2, the derivative of the inside 2x−1. f′(2)=6×3²=<b>54</b>.',zh:'把指数移下来并减一，再乘上括号内2x−1求导得到的2。f′(2)=6×3²=<b>54</b>。'},
        mathSteps:["\\{(ax+b)^n\\}'=n(ax+b)^{n-1}\\times a","f'(2)=6\\times3^2=54"],
        result:{ko:'안쪽 미분도 곱하기!',en:'Multiply by the inside’s derivative too!',zh:'还要乘内层的导数！'},
        book:{ko:'(ax+b)ⁿ 은 (ax+b) 를 n 번 곱한 것이므로 곱의 미분법을 되풀이하면 이 공식이 나옵니다.',en:'(ax+b)ⁿ is (ax+b) multiplied n times, so repeating the product rule gives this formula.',zh:'(ax+b)ⁿ是n个(ax+b)相乘，反复使用乘积的求导法则就得到这个公式。'} }
    ],
    rule:{ ko:'① (xⁿ)′=nxⁿ⁻¹, 항마다  ② (fg)′=f′g+fg′  ③ {(ax+b)ⁿ}′=n(ax+b)ⁿ⁻¹×a',
      en:'① (xⁿ)′=nxⁿ⁻¹, term by term  ② (fg)′=f′g+fg′  ③ {(ax+b)ⁿ}′=n(ax+b)ⁿ⁻¹×a',
      zh:'① (xⁿ)′=nxⁿ⁻¹，逐项  ② (fg)′=f′g+fg′  ③ {(ax+b)ⁿ}′=n(ax+b)ⁿ⁻¹×a' }
  },

  check:{
    fills:[
      { tex:{ko:"f(x)=x^4-3x^2+2x\\ \\Rightarrow\\ f'(-1)=\\square",en:"f(x)=x^4-3x^2+2x\\ \\Rightarrow\\ f'(-1)=\\square",zh:"f(x)=x^4-3x^2+2x\\ \\Rightarrow\\ f'(-1)=\\square"}, answer:4,
        hint:{ko:"f'(x)=4x^3-6x+2",en:"f'(x)=4x^3-6x+2",zh:"f'(x)=4x^3-6x+2"} },
      { tex:{ko:"f(x)=(3x+1)^2\\ \\Rightarrow\\ f'(1)=\\square",en:"f(x)=(3x+1)^2\\ \\Rightarrow\\ f'(1)=\\square",zh:"f(x)=(3x+1)^2\\ \\Rightarrow\\ f'(1)=\\square"}, answer:24,
        hint:{ko:"f'(x)=2(3x+1)\\times3",en:"f'(x)=2(3x+1)\\times3",zh:"f'(x)=2(3x+1)\\times3"} }
    ],
    open:{ ko:'{(2x+1)²}′ 을 공식으로 구한 것과, 전개해서 미분한 것이 같은지 비교해 봅니다. 왜 2 를 곱해야 하는지 설명해 봅니다.',
      en:'Compare {(2x+1)²}′ found with the formula and found by expanding first. Explain why you must multiply by 2.',
      zh:'比较用公式求出的{(2x+1)²}′与先展开再求导的结果是否相同，并说明为什么要乘2。' },
    openHint:{ ko:'(2x+1)²=4x²+4x+1 을 미분하면 8x+4 입니다. 공식으로는 2(2x+1)×2=8x+4 로 같습니다. 2 를 빼면 4x+2 가 되어 절반밖에 안 됩니다.',
      en:'(2x+1)²=4x²+4x+1 differentiates to 8x+4. The formula gives 2(2x+1)×2=8x+4, the same. Without the 2 you get 4x+2, only half.',
      zh:'(2x+1)²=4x²+4x+1求导得8x+4。用公式得2(2x+1)×2=8x+4，相同。不乘2就是4x+2，只有一半。' }
  },

  lab:{
    generator:'md154_diffRules', level:'main', count:6,
    params:{mode:'product'},
    intro:{
      ko:'곱의 미분법 (fg)′=f′g+fg′ 로 미분계수를 구합니다. 전개하지 않고 x 에 값을 넣은 두 인수의 값과 미분계수로 계산합니다.',
      en:'Find derivative values with the product rule (fg)′=f′g+fg′, using the values of the two factors and their derivatives at the point without expanding.',
      zh:'用乘积的求导法则(fg)′=f′g+fg′求导数值，不展开，用两个因式及其导数在该点的值计算。'
    }
  },

  arena:{
    generator:'md154_diffRules', level:'main', count:6, timeLimit:420,
    params:{mode:'power'},
    rule:{ ko:'7분 안에 (ax+b)ⁿ 꼴의 미분 문제를 모두 풉니다!', en:'Solve every (ax+b)ⁿ derivative problem within 7 minutes!', zh:'7分钟内解出所有(ax+b)ⁿ型求导题！' }
  },

  stamp:{ label:{ ko:'미분 기술자', en:'Derivative Technician', zh:'求导技师' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'공식을 딱 맞게 썼어! ✏️',en:'Used the rule exactly right!',zh:'公式用得正好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'지수를 내리고 하나 줄였는지 봐!',en:'Did you bring the exponent down and lower it by one?',zh:'指数移下来并减一了吗？'}, {ko:'괄호 안을 미분한 수도 곱해야 해!',en:'Multiply by the inside’s derivative too!',zh:'还要乘括号内的导数！'} ],
    finish:{ ko:'완벽해! 미분 기술자! ✏️✨', en:'Perfect! Derivative Technician!', zh:'完美！求导技师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
