/* Numbers of Magic — 유닛 M-143: 삼각함수의 그래프와 각의 변환 (고등 대수 · 과정 64 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD143. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-143'] = {
  id:'M-143', tier:'algebra', level:'64', order:143,
  generator:'md143_trigGraph',
  title:{ ko:'삼각함수의 그래프와 각의 변환', en:'Trig Graphs & Angle Transformations', zh:'三角函数的图像与角的变换' },
  subtitle:{ ko:'되풀이되는 물결을 읽는 법', en:'Reading a repeating wave', zh:'读懂反复的波浪' },
  icon:'🌊',

  practice:{
    generator:'md143_trigGraph', level:'practice', count:6,
    params:{mode:'coef'},
    intro:{
      ko:'y=a sin bx+c 에서 a 는 물결의 높이, c 는 가운데 줄, b 는 주기 p=2π/b 를 정합니다. M=a+c, m=−a+c 를 씁니다.',
      en:'In y=a sin bx+c, a sets the height of the wave, c the centre line and b the period p=2π/b. Use M=a+c and m=−a+c.',
      zh:'在y=a sin bx+c中，a决定波的高度，c决定中线，b决定周期p=2π/b。用M=a+c，m=−a+c。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'바닷가의 물결, 시계추, 관람차의 높이는 모두 같은 모양을 되풀이합니다. 삼각함수의 그래프에서 가장 높은 곳·가장 낮은 곳·한 번 되풀이되는 길이를 읽으면 식의 계수가 보입니다.',
        en:'Ocean waves, a pendulum and the height of a Ferris wheel seat all repeat the same shape. Read the highest point, the lowest point and the length of one repeat on a trig graph, and the coefficients appear.',
        zh:'海浪、钟摆、摩天轮座舱的高度都在重复同样的形状。从三角函数的图像读出最高点、最低点和重复一次的长度，系数就显现出来。' }
    },
    stages:[
      { tag:{ko:'① 그래프로 계수 읽기',en:'1) Reading coefficients',zh:'① 读系数'},
        head:{ko:'y=a\\sin bx+1:\\ M=4,\\ p=\\pi\\ \\Rightarrow\\ a=3,\\ b=2',en:'y=a\\sin bx+1:\\ M=4,\\ p=\\pi\\ \\Rightarrow\\ a=3,\\ b=2',zh:'y=a\\sin bx+1:\\ M=4,\\ p=\\pi\\ \\Rightarrow\\ a=3,\\ b=2'},
        desc:{ko:'M=a+1=4 에서 a=<b>3</b>, 주기 2π/b=π 에서 b=<b>2</b> 입니다(a>0, b>0).',
              en:'M=a+1=4 gives a=<b>3</b>, and the period 2π/b=π gives b=<b>2</b> (a>0, b>0).',
              zh:'由M=a+1=4得a=<b>3</b>，由周期2π/b=π得b=<b>2</b>(a>0，b>0)。'},
        mathSteps:['a+1=4','\\frac{2\\pi}{b}=\\pi'],
        result:{ko:'높이는 a, 주기는 b!',en:'Height from a, period from b!',zh:'高度看a，周期看b！'},
        book:{ko:'M 과 m 이 모두 주어지면 a=(M−m)/2, c=(M+m)/2 입니다.',
              en:'If both M and m are given, a=(M−m)/2 and c=(M+m)/2.',
              zh:'M与m都给出时，a=(M−m)/2，c=(M+m)/2。'} },

      { tag:{ko:'② 각의 변환',en:'2) Changing the angle',zh:'② 角的变换'},
        head:{ko:'\\sin\\frac{7}{6}\\pi=\\sin\\bigl(\\pi+\\frac{\\pi}{6}\\bigr)=-\\sin\\frac{\\pi}{6}=-\\frac{1}{2}',en:'\\sin\\frac{7}{6}\\pi=\\sin\\bigl(\\pi+\\frac{\\pi}{6}\\bigr)=-\\sin\\frac{\\pi}{6}=-\\frac{1}{2}',zh:'\\sin\\frac{7}{6}\\pi=\\sin\\bigl(\\pi+\\frac{\\pi}{6}\\bigr)=-\\sin\\frac{\\pi}{6}=-\\frac{1}{2}'},
        desc:{ko:'7π/6 은 제3사분면의 각이라 사인이 음수이고, 기준각은 π/6 입니다. 그래서 2sin(7π/6)=<b>−1</b> 입니다.',
              en:'7π/6 is in quadrant 3, where sine is negative, and its reference angle is π/6. So 2sin(7π/6)=<b>−1</b>.',
              zh:'7π/6在第三象限，正弦为负，基准角是π/6。所以2sin(7π/6)=<b>−1</b>。'},
        mathSteps:['\\frac{7}{6}\\pi=\\pi+\\frac{\\pi}{6}','2\\sin\\frac{7}{6}\\pi=-1'],
        result:{ko:'기준각의 값에 사분면의 부호!',en:'Reference-angle value with the quadrant sign!',zh:'基准角的值加上象限的符号！'},
        book:{ko:'tan(3π/4)=tan(π−π/4)=−tan(π/4)=−1 처럼 탄젠트도 같은 방법으로 바꿉니다.',
              en:'Tangent works the same way: tan(3π/4)=tan(π−π/4)=−tan(π/4)=−1.',
              zh:'正切也一样：tan(3π/4)=tan(π−π/4)=−tan(π/4)=−1。'} },

      { tag:{ko:'③ 식 간단히 하기',en:'3) Simplifying',zh:'③ 化简'},
        head:{ko:'\\sin\\bigl(\\frac{\\pi}{2}-\\theta\\bigr)\\cos(-\\theta)+\\sin(\\pi-\\theta)\\cos\\bigl(\\frac{\\pi}{2}-\\theta\\bigr)=1',en:'\\sin\\bigl(\\frac{\\pi}{2}-\\theta\\bigr)\\cos(-\\theta)+\\sin(\\pi-\\theta)\\cos\\bigl(\\frac{\\pi}{2}-\\theta\\bigr)=1',zh:'\\sin\\bigl(\\frac{\\pi}{2}-\\theta\\bigr)\\cos(-\\theta)+\\sin(\\pi-\\theta)\\cos\\bigl(\\frac{\\pi}{2}-\\theta\\bigr)=1'},
        desc:{ko:'앞의 곱은 cosθ×cosθ, 뒤의 곱은 sinθ×sinθ 이므로 cos²θ+sin²θ=<b>1</b> 입니다. θ 에 관계없이 값이 같습니다.',
              en:'The first product is cosθ×cosθ and the second sinθ×sinθ, so the sum is cos²θ+sin²θ=<b>1</b>, whatever θ is.',
              zh:'前一个积是cosθ×cosθ，后一个积是sinθ×sinθ，所以和为cos²θ+sin²θ=<b>1</b>，与θ无关。'},
        mathSteps:['\\cos\\theta\\cos\\theta+\\sin\\theta\\sin\\theta','\\cos^2\\theta+\\sin^2\\theta=1'],
        result:{ko:'π/2 가 끼면 sin↔cos!',en:'With π/2, swap sin↔cos!',zh:'有π/2就sin↔cos互换！'},
        book:{ko:'cos(−θ)=cosθ 이고 sin(−θ)=−sinθ 입니다. 코사인은 y축 대칭, 사인은 원점 대칭인 그래프이기 때문입니다.',
              en:'cos(−θ)=cosθ and sin(−θ)=−sinθ, because the cosine graph is symmetric about the y-axis and the sine graph about the origin.',
              zh:'cos(−θ)=cosθ，sin(−θ)=−sinθ，因为余弦图像关于y轴对称，正弦图像关于原点对称。'} }
    ],
    rule:{ ko:'① M=a+c, m=−a+c, p=2π/b  ② 기준각의 값에 사분면의 부호를 붙이기  ③ π/2±θ, 3π/2±θ 는 sin↔cos, tan↔1/tan',
      en:'① M=a+c, m=−a+c, p=2π/b  ② Take the reference-angle value with the sign of the quadrant  ③ For π/2±θ and 3π/2±θ swap sin↔cos, tan↔1/tan',
      zh:'① M=a+c，m=−a+c，p=2π/b  ② 基准角的值加上象限的符号  ③ π/2±θ、3π/2±θ时sin↔cos、tan↔1/tan' }
  },

  check:{
    fills:[
      { tex:{ko:'\\tan\\frac{3}{4}\\pi=\\square',en:'\\tan\\frac{3}{4}\\pi=\\square',zh:'\\tan\\frac{3}{4}\\pi=\\square'}, answer:-1,
        hint:{ ko:'π−π/4, 제2사분면', en:'π−π/4, quadrant 2', zh:'π−π/4，第二象限' } },
      { tex:{ko:'\\sin^2\\bigl(\\frac{\\pi}{2}+\\theta\\bigr)+\\sin^2(\\pi+\\theta)=\\square',en:'\\sin^2\\bigl(\\frac{\\pi}{2}+\\theta\\bigr)+\\sin^2(\\pi+\\theta)=\\square',zh:'\\sin^2\\bigl(\\frac{\\pi}{2}+\\theta\\bigr)+\\sin^2(\\pi+\\theta)=\\square'}, answer:1,
        hint:{ ko:'cos²θ+sin²θ', en:'cos²θ+sin²θ', zh:'cos²θ+sin²θ' } }
    ],
    open:{ ko:'sin(π/2−θ)=cosθ 가 성립하는 까닭을 직각삼각형으로 설명해 봅니다.',
      en:'Use a right triangle to explain why sin(π/2−θ)=cosθ.',
      zh:'用直角三角形说说为什么sin(π/2−θ)=cosθ。' },
    openHint:{ ko:'직각삼각형의 두 예각은 θ 와 π/2−θ 입니다. θ 의 이웃변은 다른 각 π/2−θ 의 대변이므로, θ 의 코사인과 π/2−θ 의 사인은 같은 변의 비입니다.',
      en:'The two acute angles of a right triangle are θ and π/2−θ. The side adjacent to θ is opposite π/2−θ, so the cosine of θ and the sine of π/2−θ are the same ratio.',
      zh:'直角三角形的两个锐角是θ与π/2−θ。θ的邻边正是π/2−θ的对边，所以θ的余弦与π/2−θ的正弦是同一个比。' }
  },

  lab:{
    generator:'md143_trigGraph', level:'main', count:6,
    params:{mode:'value'},
    intro:{
      ko:'각을 기준각 π/6, π/4, π/3 과 사분면으로 나누어 값과 부호를 정한 뒤 식을 계산합니다.',
      en:'Split each angle into its reference angle π/6, π/4 or π/3 and its quadrant, fix the value and sign, then compute.',
      zh:'把每个角分成基准角π/6、π/4、π/3与象限，确定值与符号后计算。'
    }
  },

  arena:{
    generator:'md143_trigGraph', level:'main', count:6, timeLimit:420,
    params:{mode:'simplify'},
    rule:{ ko:'7분 안에 각의 변환으로 식을 모두 간단히 합니다!', en:'Simplify every expression with angle changes within 7 minutes!', zh:'7分钟内用角的变换化简所有式子！' }
  },

  stamp:{ label:{ ko:'물결 해독가', en:'Wave Decoder', zh:'波浪解读者' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'물결을 정확히 읽었어! 🌊',en:'Wave read exactly!',zh:'波浪读得很准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'사분면의 부호를 확인해 봐!',en:'Check the sign of the quadrant!',zh:'确认一下象限的符号！'}, {ko:'π/2 가 있으면 sin 과 cos 가 바뀌어!',en:'π/2 swaps sin and cos!',zh:'有π/2时sin与cos互换！'} ],
    finish:{ ko:'완벽해! 물결 해독가! 🌊✨', en:'Perfect! Wave Decoder!', zh:'完美！波浪解读者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
