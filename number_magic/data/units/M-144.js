/* Numbers of Magic — 유닛 M-144: 삼각방정식과 삼각부등식 (고등 대수 · 과정 66 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD144. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-144'] = {
  id:'M-144', tier:'algebra', level:'66', order:144,
  generator:'md144_trigEq',
  title:{ ko:'삼각방정식과 삼각부등식', en:'Trig Equations & Inequalities', zh:'三角方程与三角不等式' },
  subtitle:{ ko:'단위원 위에서 같은 높이의 점을 모두 찾기', en:'Find every point at the same height on the unit circle', zh:'在单位圆上找出所有同样高度的点' },
  icon:'🎡',

  practice:{
    generator:'md144_trigEq', level:'practice', count:6,
    params:{mode:'count'},
    intro:{
      ko:'삼각함수 하나를 한 값으로 정리하고, 주어진 범위에서 그 값을 갖는 x 를 모두 셉니다. sin 2x 처럼 각이 bx 이면 t=bx 의 범위를 먼저 구합니다.',
      en:'Rearrange so one trig function equals one value, then count every x in the range with that value. When the angle is bx, as in sin 2x, first find the range of t=bx.',
      zh:'把一个三角函数整理成等于一个值，再数出给定范围内所有取这个值的x。像sin 2x那样角为bx时，先求t=bx的范围。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'sin x=½ 인 x 는 하나가 아닙니다. 단위원에서 높이가 ½ 인 점은 두 개이고, 한 바퀴를 더 돌 때마다 다시 나타납니다. 범위를 정해 두고 해를 빠짐없이 찾는 법을 익힙니다.',
        en:'There is more than one x with sin x=½. On the unit circle, two points have height ½, and they come back with every extra turn. We learn to fix a range and find every solution without missing any.',
        zh:'满足sin x=½的x不止一个。单位圆上高度为½的点有两个，每多转一圈又会出现。我们来学习在给定范围内不遗漏地找出所有解。' }
    },
    stages:[
      { tag:{ko:'① 해의 개수',en:'1) Number of solutions',zh:'① 解的个数'},
        head:{ko:'2\\sin x=1\\ (0\\le x<2\\pi)\\ \\Rightarrow\\ x=\\frac{\\pi}{6},\\ \\frac{5}{6}\\pi',en:'2\\sin x=1\\ (0\\le x<2\\pi)\\ \\Rightarrow\\ x=\\frac{\\pi}{6},\\ \\frac{5}{6}\\pi',zh:'2\\sin x=1\\ (0\\le x<2\\pi)\\ \\Rightarrow\\ x=\\frac{\\pi}{6},\\ \\frac{5}{6}\\pi'},
        desc:{ko:'sin x=½ 이므로 단위원에서 높이가 ½ 인 두 점, 곧 x=π/6 과 5π/6 입니다. 해는 <b>2</b> 개입니다.',en:'sin x=½, so the two points of height ½ on the unit circle: x=π/6 and 5π/6. There are <b>2</b> solutions.',zh:'sin x=½，即单位圆上高度为½的两点：x=π/6与5π/6。解有<b>2</b>个。'},
        mathSteps:['\\sin x=\\frac{1}{2}','x=\\frac{\\pi}{6},\\ \\frac{5}{6}\\pi'],
        result:{ko:'높이가 같은 점은 한 바퀴에 두 개!',en:'Two points of equal height per turn!',zh:'同样高度的点每圈两个！'},
        book:{ko:'sin 2x=½ 이면 t=2x 가 0≤t<4π 로 두 바퀴를 돌아 해가 4 개가 됩니다.',en:'For sin 2x=½, t=2x runs over 0≤t<4π, two full turns, so there are 4 solutions.',zh:'sin 2x=½时，t=2x在0≤t<4π内转两圈，解有4个。'} },

      { tag:{ko:'② 부등식',en:'2) Inequalities',zh:'② 不等式'},
        head:{ko:'2\\sin x>1\\ (0^\\circ\\le x<360^\\circ)\\ \\Rightarrow\\ 30^\\circ<x<150^\\circ',en:'2\\sin x>1\\ (0^\\circ\\le x<360^\\circ)\\ \\Rightarrow\\ 30^\\circ<x<150^\\circ',zh:'2\\sin x>1\\ (0^\\circ\\le x<360^\\circ)\\ \\Rightarrow\\ 30^\\circ<x<150^\\circ'},
        desc:{ko:'y=sin x 의 그래프가 직선 y=½ 보다 위에 있는 부분입니다. 두 교점 30°, 150° 사이이므로 <b>30°<x<150°</b> 입니다.',en:'This is where the graph of y=sin x lies above y=½: between the crossings at 30° and 150°, so <b>30°<x<150°</b>.',zh:'这是y=sin x的图像在直线y=½上方的部分，在两个交点30°与150°之间，所以<b>30°<x<150°</b>。'},
        mathSteps:['\\sin x>\\frac{1}{2}','30^\\circ<x<150^\\circ'],
        result:{ko:'방정식의 해가 부등식의 경계!',en:'The equation’s solutions are the boundaries!',zh:'方程的解就是不等式的边界！'},
        book:{ko:'cos x<½ 이면 그래프가 y=½ 보다 아래인 60°<x<300° 입니다. ≤, ≥ 이면 끝값도 넣습니다.',en:'For cos x<½, the graph is below y=½ on 60°<x<300°. With ≤ or ≥, include the end values.',zh:'cos x<½时，图像在y=½下方，为60°<x<300°。带≤、≥时端点也包括。'} },

      { tag:{ko:'③ 이차식 꼴',en:'3) Quadratic form',zh:'③ 二次式形式'},
        head:{ko:'2\\sin^2x-3\\sin x+1=0\\ \\Rightarrow\\ (2\\sin x-1)(\\sin x-1)=0',en:'2\\sin^2x-3\\sin x+1=0\\ \\Rightarrow\\ (2\\sin x-1)(\\sin x-1)=0',zh:'2\\sin^2x-3\\sin x+1=0\\ \\Rightarrow\\ (2\\sin x-1)(\\sin x-1)=0'},
        desc:{ko:'sin x=½ 또는 sin x=1 입니다. 0°≤x<360° 에서 x=30°, 150°, 90° 이고 해의 합은 <b>270°</b> 입니다.',en:'So sin x=½ or sin x=1. On 0°≤x<360°, x=30°, 150°, 90°, and the sum of the solutions is <b>270°</b>.',zh:'所以sin x=½或sin x=1。在0°≤x<360°内x=30°、150°、90°，解之和为<b>270°</b>。'},
        mathSteps:['\\sin x=\\frac{1}{2},\\ 1','x=30^\\circ,\\ 90^\\circ,\\ 150^\\circ'],
        result:{ko:'sin x 를 한 글자로 보면 이차방정식!',en:'Treat sin x as one letter: a quadratic!',zh:'把sin x看成一个字母就是二次方程！'},
        book:{ko:'cos²x 가 섞여 있으면 cos²x=1−sin²x 로 바꿉니다. 근이 2 처럼 −1≤sin x≤1 을 벗어나면 버립니다.',en:'If cos²x appears, replace it with 1−sin²x. Discard a root such as 2 that lies outside −1≤sin x≤1.',zh:'出现cos²x时换成1−sin²x。像2这样超出−1≤sin x≤1的根要舍去。'} }
    ],
    rule:{ ko:'① 한 값으로 정리한 뒤 범위 안의 각을 모두  ② 부등식은 그래프가 직선보다 위·아래인 범위  ③ 이차식 꼴은 sin x=t 로 놓고 −1≤t≤1',
      en:'① Rearrange to one value, then take every angle in the range  ② An inequality is where the graph is above or below the line  ③ For quadratic form, put sin x=t with −1≤t≤1',
      zh:'① 整理成一个值后取范围内的所有角  ② 不等式是图像在直线上方或下方的范围  ③ 二次式形式令sin x=t，−1≤t≤1' }
  },

  check:{
    fills:[
      { tex:{ko:'2\\cos x=1\\ (0\\le x<2\\pi)\\ \\Rightarrow\\ N=\\square',en:'2\\cos x=1\\ (0\\le x<2\\pi)\\ \\Rightarrow\\ N=\\square',zh:'2\\cos x=1\\ (0\\le x<2\\pi)\\ \\Rightarrow\\ N=\\square'}, answer:2,
        hint:{ko:'x=π/3, 5π/3',en:'x=π/3, 5π/3',zh:'x=π/3, 5π/3'} },
      { tex:{ko:'\\tan x=1\\ (0^\\circ\\le x<360^\\circ)\\ \\Rightarrow\\ S=\\square^\\circ',en:'\\tan x=1\\ (0^\\circ\\le x<360^\\circ)\\ \\Rightarrow\\ S=\\square^\\circ',zh:'\\tan x=1\\ (0^\\circ\\le x<360^\\circ)\\ \\Rightarrow\\ S=\\square^\\circ'}, answer:270,
        hint:{ko:'45°+225°',en:'45°+225°',zh:'45°+225°'} }
    ],
    open:{ ko:'0≤x<2π 에서 sin 2x=½ 의 해가 4 개인 까닭을 설명해 봅니다.',
      en:'Explain why sin 2x=½ has 4 solutions on 0≤x<2π.',
      zh:'说说为什么在0≤x<2π内sin 2x=½有4个解。' },
    openHint:{ ko:'t=2x 로 놓으면 0≤t<4π 로 단위원을 두 바퀴 돕니다. 한 바퀴마다 sin t=½ 인 t 가 2 개이므로 모두 4 개입니다.',
      en:'With t=2x, 0≤t<4π, two turns of the unit circle. Each turn has 2 values of t with sin t=½, so 4 in all.',
      zh:'令t=2x，则0≤t<4π，绕单位圆两圈。每圈有2个t满足sin t=½，共4个。' }
  },

  lab:{
    generator:'md144_trigEq', level:'main', count:6,
    params:{mode:'sum'},
    intro:{
      ko:'방정식은 해를 모두 찾아 더하고, 부등식은 그래프가 직선보다 위(또는 아래)에 있는 범위의 끝값 α, β 를 찾습니다. 답은 도(°)로 씁니다.',
      en:'For an equation, find and add every solution; for an inequality, find the end values α, β of the range where the graph is above (or below) the line. Answer in degrees.',
      zh:'方程要找出所有解相加；不等式要找出图像在直线上方(或下方)的范围端点α、β。答案用度表示。'
    }
  },

  arena:{
    generator:'md144_trigEq', level:'main', count:6, timeLimit:420,
    params:{mode:'quad'},
    rule:{ ko:'7분 안에 이차식 꼴 삼각방정식을 모두 풉니다!', en:'Solve every quadratic-form trig equation within 7 minutes!', zh:'7分钟内解出所有二次式形式的三角方程！' }
  },

  stamp:{ label:{ ko:'각도 사냥꾼', en:'Angle Hunter', zh:'角度猎人' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'해를 하나도 빠뜨리지 않았어! 🎡',en:'Not a single solution missed!',zh:'一个解都没漏！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'범위 안에서 한 바퀴 더 돌았는지 봐!',en:'Check whether the range makes another turn!',zh:'看看范围内是否又转了一圈！'}, {ko:'sin x 가 1 보다 큰 근은 버려!',en:'Drop any root with sin x greater than 1!',zh:'sin x大于1的根要舍去！'} ],
    finish:{ ko:'완벽해! 각도 사냥꾼! 🎡✨', en:'Perfect! Angle Hunter!', zh:'完美！角度猎人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
