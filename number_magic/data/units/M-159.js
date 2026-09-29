/* Numbers of Magic — 유닛 M-159: 정적분의 성질과 정적분으로 정의된 함수 (고등 미적분Ⅰ · 과정 75 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD159. 교과서 없이 예시를 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-159'] = {
  id:'M-159', tier:'calculus1', level:'73', order:159,
  generator:'md159_defInt',
  title:{ ko:'정적분의 성질과 정적분으로 정의된 함수', en:'Properties of Definite Integrals', zh:'定积分的性质与由定积分定义的函数' },
  subtitle:{ ko:'구간을 자르고 잇고, 적분한 것을 다시 미분합니다', en:'Split and join intervals, and differentiate what you integrated', zh:'拆开、合并区间，再对积分求导' },
  icon:'🧵',

  practice:{
    generator:'md159_defInt', level:'practice', count:6,
    params:{mode:'prop'},
    intro:{
      ko:'이어지는 두 구간의 정적분은 하나로 합치고, 절댓값은 안의 식이 0 이 되는 x 에서 나눕니다. −t 부터 t 까지는 홀수 차수 항이 지워집니다.',
      en:'Join integrals over neighbouring intervals into one, and split an absolute value where the inside is 0. From −t to t the odd-degree terms cancel.',
      zh:'相邻两个区间上的定积分合并为一个，绝对值在里面为0的x处分开。从−t到t奇次项消去。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'실을 여러 토막으로 잘라 재도 길이를 모두 더하면 처음 실의 길이와 같습니다. 정적분도 구간을 나누어 계산한 값을 더하면 한 번에 계산한 값과 같습니다.',
        en:'Cut a thread into pieces and measure them: the lengths add up to the whole thread. Likewise, definite integrals over the pieces of an interval add up to the integral over the whole.',
        zh:'把一根线剪成几段分别量，长度加起来等于原来的线长。定积分也一样，把区间分开计算再相加，等于一次算出的值。' }
    },
    stages:[
      { tag:{ko:'① 절댓값과 구간 나누기',en:'1) Absolute values and splitting',zh:'① 绝对值与拆分区间'},
        head:{ko:"\\int_{-1}^{3}|x-1|\\,dx=\\int_{-1}^{1}(1-x)\\,dx+\\int_{1}^{3}(x-1)\\,dx",en:"\\int_{-1}^{3}|x-1|\\,dx=\\int_{-1}^{1}(1-x)\\,dx+\\int_{1}^{3}(x-1)\\,dx",zh:"\\int_{-1}^{3}|x-1|\\,dx=\\int_{-1}^{1}(1-x)\\,dx+\\int_{1}^{3}(x-1)\\,dx"},
        desc:{ko:'x−1 이 0 이 되는 x=1 에서 나누면 두 부분이 각각 2 이므로 값은 <b>4</b> 입니다. 두 삼각형의 넓이의 합과 같습니다.',en:'Splitting at x=1, where x−1=0, each part is 2, so the value is <b>4</b> — the total area of two triangles.',zh:'在x−1=0的x=1处分开，两部分各为2，所以值为<b>4</b>，等于两个三角形面积之和。'},
        mathSteps:["2+2=4"],
        result:{ko:'0 이 되는 곳에서 자르기!',en:'Cut where it becomes 0!',zh:'在等于0的地方切开！'},
        book:{ko:'∫ᵇₐ f(x)dx=−∫ₐᵇ f(x)dx 이므로 위끝과 아래끝을 바꾸면 부호가 바뀝니다.',en:'Since ∫ᵇₐ f(x)dx=−∫ₐᵇ f(x)dx, swapping the limits changes the sign.',zh:'因为∫ᵇₐ f(x)dx=−∫ₐᵇ f(x)dx，交换上下限则变号。'} },

      { tag:{ko:'② 적분한 뒤 미분',en:'2) Integrate, then differentiate',zh:'② 先积分再求导'},
        head:{ko:"\\frac{d}{dx}\\int_{2}^{x}(t^2+2t)\\,dt=x^2+2x",en:"\\frac{d}{dx}\\int_{2}^{x}(t^2+2t)\\,dt=x^2+2x",zh:"\\frac{d}{dx}\\int_{2}^{x}(t^2+2t)\\,dt=x^2+2x"},
        desc:{ko:'아래끝이 상수이고 위끝이 x 이면 적분한 뒤 미분한 결과는 적분 안의 식에 x 를 넣은 것입니다. x=2 이면 <b>8</b> 입니다.',en:'With a constant lower limit and upper limit x, integrating and then differentiating gives the integrand with x in place of t. At x=2 this is <b>8</b>.',zh:'下限为常数、上限为x时，先积分再求导的结果就是把x代入被积式。x=2时为<b>8</b>。'},
        mathSteps:["\\frac{d}{dx}\\int_{a}^{x}f(t)\\,dt=f(x)","2^2+2\\times2=8"],
        result:{ko:'미분과 적분은 서로 되돌린다!',en:'Differentiation undoes integration!',zh:'求导与积分互相还原！'},
        book:{ko:'아래끝의 상수는 결과에 영향을 주지 않습니다. 상수가 바뀌면 적분값이 상수만큼 달라질 뿐이고, 상수의 미분은 0 이기 때문입니다.',en:'The constant lower limit does not affect the result: changing it shifts the integral by a constant, and a constant differentiates to 0.',zh:'下限的常数不影响结果：改变它只让积分值差一个常数，而常数的导数为0。'} },

      { tag:{ko:'③ 정적분을 포함한 등식',en:'3) Equations with integrals',zh:'③ 含定积分的等式'},
        head:{ko:"\\int_{1}^{x}f(t)\\,dt=x^3+ax-2",en:"\\int_{1}^{x}f(t)\\,dt=x^3+ax-2",zh:"\\int_{1}^{x}f(t)\\,dt=x^3+ax-2"},
        desc:{ko:'x=1 을 넣으면 좌변은 0 이므로 1+a−2=0, a=1 입니다. 양변을 미분하면 f(x)=3x²+1 이고 f(2)=<b>13</b> 입니다.',en:'Put x=1: the left side is 0, so 1+a−2=0 and a=1. Differentiating both sides gives f(x)=3x²+1, so f(2)=<b>13</b>.',zh:'代入x=1，左边为0，所以1+a−2=0，a=1。两边求导得f(x)=3x²+1，f(2)=<b>13</b>。'},
        mathSteps:["x=1:\\ 0=1+a-2,\\ a=1","f(x)=3x^2+1,\\ f(2)=13"],
        result:{ko:'넣고, 미분하고!',en:'Substitute, then differentiate!',zh:'代入，再求导！'},
        book:{ko:'f(x)=3x²+∫₀² f(t)dt 처럼 식 안에 정적분이 있으면, 그 정적분은 수이므로 k 로 놓고 k 에 대한 방정식을 풉니다.',en:'When an integral sits inside the formula, as in f(x)=3x²+∫₀² f(t)dt, that integral is a number: call it k and solve an equation in k.',zh:'像f(x)=3x²+∫₀² f(t)dt那样式中含定积分时，这个定积分是一个数，设为k解关于k的方程。'} }
    ],
    rule:{ ko:'① ∫ₐᶜ+∫꜀ᵇ=∫ₐᵇ, 절댓값은 0 인 곳에서 나누기  ② d/dx∫ₐˣ f(t)dt=f(x)  ③ x=a 를 넣으면 0, 미분하면 f(x)',
      en:'① ∫ₐᶜ+∫꜀ᵇ=∫ₐᵇ; split absolute values where they are 0  ② d/dx∫ₐˣ f(t)dt=f(x)  ③ x=a gives 0; differentiating gives f(x)',
      zh:'① ∫ₐᶜ+∫꜀ᵇ=∫ₐᵇ，绝对值在为0处分开  ② d/dx∫ₐˣ f(t)dt=f(x)  ③ 代入x=a得0，求导得f(x)' }
  },

  check:{
    fills:[
      { tex:{ko:"\\int_{-2}^{2}(x^3+3x^2+1)\\,dx=\\square",en:"\\int_{-2}^{2}(x^3+3x^2+1)\\,dx=\\square",zh:"\\int_{-2}^{2}(x^3+3x^2+1)\\,dx=\\square"}, answer:20,
        hint:{ko:'2\\int_{0}^{2}(3x^2+1)\\,dx',en:'2\\int_{0}^{2}(3x^2+1)\\,dx',zh:'2\\int_{0}^{2}(3x^2+1)\\,dx'} },
      { tex:{ko:"F(x)=\\int_{0}^{x}(t^2-4t+3)\\,dt\\ \\Rightarrow\\ F'(2)=\\square",en:"F(x)=\\int_{0}^{x}(t^2-4t+3)\\,dt\\ \\Rightarrow\\ F'(2)=\\square",zh:"F(x)=\\int_{0}^{x}(t^2-4t+3)\\,dt\\ \\Rightarrow\\ F'(2)=\\square"}, answer:-1,
        hint:{ko:"F'(x)=x^2-4x+3",en:"F'(x)=x^2-4x+3",zh:"F'(x)=x^2-4x+3"} }
    ],
    open:{ ko:'∫ₐˣ f(t)dt=g(x) 이면 왜 g(a)=0 이어야 하는지 설명해 봅니다.',
      en:'Explain why ∫ₐˣ f(t)dt=g(x) forces g(a)=0.',
      zh:'说说为什么由∫ₐˣ f(t)dt=g(x)一定有g(a)=0。' },
    openHint:{ ko:'x=a 를 넣으면 좌변은 ∫ₐᵃ f(t)dt 로 위끝과 아래끝이 같습니다. 폭이 0 인 구간의 정적분은 0 이므로 g(a)=0 입니다.',
      en:'Putting x=a makes the left side ∫ₐᵃ f(t)dt, with equal limits. An integral over an interval of width 0 is 0, so g(a)=0.',
      zh:'代入x=a，左边为∫ₐᵃ f(t)dt，上下限相同。宽度为0的区间上的定积分为0，所以g(a)=0。' }
  },

  lab:{
    generator:'md159_defInt', level:'main', count:6,
    params:{mode:'deriv'},
    intro:{
      ko:'d/dx∫ₐˣ f(t)dt=f(x) 를 씁니다. 위끝과 아래끝이 바뀌면 부호를 바꾸고, 극한 꼴은 F(x)=∫f(t)dt 의 미분계수로 봅니다.',
      en:'Use d/dx∫ₐˣ f(t)dt=f(x). Change the sign when the limits are swapped, and read a limit form as a derivative of F(x)=∫f(t)dt.',
      zh:'用d/dx∫ₐˣ f(t)dt=f(x)。上下限交换时变号，极限形式看作F(x)=∫f(t)dt的导数。'
    }
  },

  arena:{
    generator:'md159_defInt', level:'main', count:6, timeLimit:420,
    params:{mode:'fn'},
    rule:{ ko:'7분 안에 정적분을 포함한 등식 문제를 모두 풉니다!', en:'Solve every equation-with-an-integral problem within 7 minutes!', zh:'7分钟内解出所有含定积分的等式题！' }
  },

  stamp:{ label:{ ko:'적분 재단사', en:'Integral Tailor', zh:'积分裁缝' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'구간을 딱 맞게 잘랐어! 🧵',en:'Cut the interval exactly right!',zh:'区间切得正好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'절댓값은 0 이 되는 곳에서 나눠 봐!',en:'Split the absolute value where it is 0!',zh:'绝对值在为0处分开！'}, {ko:'x=a 를 넣으면 좌변은 0 이야!',en:'Putting x=a makes the left side 0!',zh:'代入x=a左边为0！'} ],
    finish:{ ko:'완벽해! 적분 재단사! 🧵✨', en:'Perfect! Integral Tailor!', zh:'完美！积分裁缝！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
