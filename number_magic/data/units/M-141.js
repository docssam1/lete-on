/* Numbers of Magic — 유닛 M-141: 부채꼴의 호의 길이와 넓이 (고등 대수 · 과정 62, 2026-09-29)
   근거: docs/high-build-spec.md MD141. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-141'] = {
  id:'M-141', tier:'algebra', level:'62', order:141,
  generator:'md141_sector',
  title:{ ko:'부채꼴의 호의 길이와 넓이', en:'Arc Length & Area of a Sector', zh:'扇形的弧长与面积' },
  subtitle:{ ko:'라디안이면 공식이 곱셈 하나', en:'With radians, the formula is a single product', zh:'用弧度，公式就是一次乘法' },
  icon:'🍕',

  practice:{
    generator:'md141_sector', level:'practice', count:6,
    params:{mode:'arc'},
    intro:{
      ko:'중심각을 라디안으로 바꾸고 l=rθ 에 넣습니다. 거꾸로 호의 길이와 중심각이 주어지면 r=l÷θ 입니다.',
      en:'Change the central angle to radians and use l=rθ. Conversely, given the arc length and angle, r=l÷θ.',
      zh:'把圆心角化成弧度代入l=rθ。反过来已知弧长与圆心角时，r=l÷θ。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'도로 잴 때 호의 길이는 2πr×(각/360°) 처럼 길었습니다. 라디안으로 재면 l=rθ, S=½r²θ 로 짧아집니다. 둘레가 정해진 부채꼴 가운데 가장 넓은 것도 찾아봅니다.',
        en:'In degrees, the arc length was a long formula, 2πr×(angle/360°). In radians it shortens to l=rθ and S=½r²θ. We will also find the widest sector with a fixed perimeter.',
        zh:'用角度时弧长公式是2πr×(角/360°)这样很长。用弧度就缩短为l=rθ、S=½r²θ。我们还要找出周长一定的扇形中面积最大的。' }
    },
    stages:[
      { tag:{ko:'① 호의 길이',en:'1) Arc length',zh:'① 弧长'},
        head:{ko:'r=6,\\ \\theta=\\frac{\\pi}{3}\\ \\Rightarrow\\ l=2\\pi',en:'r=6,\\ \\theta=\\frac{\\pi}{3}\\ \\Rightarrow\\ l=2\\pi',zh:'r=6,\\ \\theta=\\frac{\\pi}{3}\\ \\Rightarrow\\ l=2\\pi'},
        desc:{ko:'l=rθ=6×π/3=<b>2π</b> 입니다. 중심각이 60° 로 주어지면 먼저 π/3 으로 바꿉니다.',
              en:'l=rθ=6×π/3=<b>2π</b>. If the angle is given as 60°, change it to π/3 first.',
              zh:'l=rθ=6×π/3=<b>2π</b>。圆心角给成60°时先化成π/3。'},
        mathSteps:['l=r\\theta','6\\times\\frac{\\pi}{3}=2\\pi'],
        result:{ko:'반지름 × 라디안 = 호!',en:'Radius × radians = arc!',zh:'半径×弧度=弧长！'},
        book:{ko:'θ=2π 이면 l=2πr 로 원의 둘레가 됩니다. 공식이 원의 둘레와 이어집니다.',
              en:'With θ=2π, l=2πr, the circumference — the formula connects to the whole circle.',
              zh:'θ=2π时l=2πr，就是圆的周长——公式与整圆相连。'} },

      { tag:{ko:'② 넓이',en:'2) Area',zh:'② 面积'},
        head:{ko:'S=\\frac{1}{2}\\times6^2\\times\\frac{\\pi}{3}=\\frac{1}{2}\\times6\\times2\\pi=6\\pi',en:'S=\\frac{1}{2}\\times6^2\\times\\frac{\\pi}{3}=\\frac{1}{2}\\times6\\times2\\pi=6\\pi',zh:'S=\\frac{1}{2}\\times6^2\\times\\frac{\\pi}{3}=\\frac{1}{2}\\times6\\times2\\pi=6\\pi'},
        desc:{ko:'S=½r²θ 로 구해도, 호의 길이를 써서 S=½rl 로 구해도 <b>6π</b> 입니다.',
              en:'Whether by S=½r²θ or, using the arc length, by S=½rl, the area is <b>6π</b>.',
              zh:'用S=½r²θ或者利用弧长用S=½rl，面积都是<b>6π</b>。'},
        mathSteps:['S=\\frac{1}{2}r^2\\theta','S=\\frac{1}{2}rl'],
        result:{ko:'삼각형 넓이처럼 ½ × 밑 × 높이!',en:'Like a triangle: ½ × base × height!',zh:'像三角形：½×底×高！'},
        book:{ko:'부채꼴을 잘게 잘라 늘어놓으면 밑이 l, 높이가 r 인 삼각형에 가까워져서 S=½rl 입니다.',
              en:'Cut the sector into thin slices and line them up: they approach a triangle with base l and height r, so S=½rl.',
              zh:'把扇形切成细条排开，就接近底为l、高为r的三角形，所以S=½rl。'} },

      { tag:{ko:'③ 둘레가 일정할 때',en:'3) With a fixed perimeter',zh:'③ 周长一定时'},
        head:{ko:'2r+l=20:\\ S=\\frac{1}{2}r(20-2r)=-(r-5)^2+25',en:'2r+l=20:\\ S=\\frac{1}{2}r(20-2r)=-(r-5)^2+25',zh:'2r+l=20:\\ S=\\frac{1}{2}r(20-2r)=-(r-5)^2+25'},
        desc:{ko:'l=20−2r 을 넣으면 S 는 r 에 대한 이차함수가 되고, r=5 일 때 가장 넓어 M=<b>25</b> 입니다. 이때 l=10 입니다.',
              en:'Substituting l=20−2r makes S a quadratic in r; it is widest at r=5, with M=<b>25</b>, and then l=10.',
              zh:'代入l=20−2r，S是关于r的二次函数，r=5时最大，M=<b>25</b>，此时l=10。'},
        mathSteps:['l=20-2r','r=5:\\ M=25'],
        result:{ko:'반지름은 둘레의 ¼!',en:'The radius is ¼ of the perimeter!',zh:'半径是周长的¼！'},
        book:{ko:'이때 θ=l÷r=10÷5=2 입니다. 둘레가 얼마이든 넓이가 최대일 때 중심각은 2 라디안입니다.',
              en:'Then θ=l÷r=10÷5=2. Whatever the perimeter, the central angle at the greatest area is 2 radians.',
              zh:'此时θ=l÷r=10÷5=2。无论周长是多少，面积最大时圆心角都是2弧度。'} }
    ],
    rule:{ ko:'① l=rθ(θ 는 라디안)  ② S=½r²θ=½rl  ③ 2r+l=P 이면 r=P/4 에서 넓이가 최대 M=P²/16',
      en:'① l=rθ (θ in radians)  ② S=½r²θ=½rl  ③ If 2r+l=P, the area is greatest at r=P/4, with M=P²/16',
      zh:'① l=rθ(θ为弧度)  ② S=½r²θ=½rl  ③ 若2r+l=P，r=P/4时面积最大M=P²/16' }
  },

  check:{
    fills:[
      { tex:{ko:'r=4,\\ \\theta=\\frac{3}{2}\\pi\\ \\Rightarrow\\ l=\\square\\pi',en:'r=4,\\ \\theta=\\frac{3}{2}\\pi\\ \\Rightarrow\\ l=\\square\\pi',zh:'r=4,\\ \\theta=\\frac{3}{2}\\pi\\ \\Rightarrow\\ l=\\square\\pi'}, answer:6,
        hint:{ ko:'4×3/2', en:'4×3/2', zh:'4×3/2' } },
      { tex:{ko:'r=5,\\ l=8\\ \\Rightarrow\\ S=\\square',en:'r=5,\\ l=8\\ \\Rightarrow\\ S=\\square',zh:'r=5,\\ l=8\\ \\Rightarrow\\ S=\\square'}, answer:20,
        hint:{ ko:'½×5×8', en:'½×5×8', zh:'½×5×8' } }
    ],
    open:{ ko:'둘레가 일정한 부채꼴의 넓이가 가장 클 때 중심각이 언제나 2 라디안인 까닭을 설명해 봅니다.',
      en:'Explain why the central angle is always 2 radians when a sector with a fixed perimeter has the greatest area.',
      zh:'说说为什么周长一定的扇形面积最大时，圆心角总是2弧度。' },
    openHint:{ ko:'넓이가 최대일 때 r=P/4 이므로 l=P−2r=P/2=2r 입니다. 그래서 θ=l÷r=2 입니다.',
      en:'At the greatest area r=P/4, so l=P−2r=P/2=2r, and θ=l÷r=2.',
      zh:'面积最大时r=P/4，所以l=P−2r=P/2=2r，于是θ=l÷r=2。' }
  },

  lab:{
    generator:'md141_sector', level:'main', count:6,
    params:{mode:'area'},
    intro:{
      ko:'반지름과 중심각이 주어지면 S=½r²θ, 반지름과 호의 길이가 주어지면 S=½rl 을 씁니다. 넓이에서 반지름이나 호의 길이를 거꾸로 구하기도 합니다.',
      en:'Use S=½r²θ with the radius and angle, and S=½rl with the radius and arc length. Sometimes you work back from the area to the radius or arc length.',
      zh:'已知半径与圆心角用S=½r²θ，已知半径与弧长用S=½rl。有时要由面积反求半径或弧长。'
    }
  },

  arena:{
    generator:'md141_sector', level:'main', count:6, timeLimit:420,
    params:{mode:'max'},
    rule:{ ko:'7분 안에 둘레가 일정한 부채꼴의 가장 넓은 모양을 모두 찾습니다!', en:'Find every widest sector with a fixed perimeter within 7 minutes!', zh:'7分钟内找出所有周长一定时面积最大的扇形！' }
  },

  stamp:{ label:{ ko:'부채 장인', en:'Fan Artisan', zh:'扇子工匠' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'부채꼴을 딱 맞게 잘랐어! 🍕',en:'Sector cut just right!',zh:'扇形切得正好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'중심각을 라디안으로 바꿨는지 봐!',en:'Did you change the angle to radians?',zh:'圆心角化成弧度了吗？'}, {ko:'넓이에는 ½ 이 붙어!',en:'The area has a ½!',zh:'面积公式里有½！'} ],
    finish:{ ko:'완벽해! 부채 장인! 🍕✨', en:'Perfect! Fan Artisan!', zh:'完美！扇子工匠！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
