/* Numbers of Magic — 유닛 M-116: 점과 직선 사이의 거리 (고등 공통수학2 · 과정 50 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD116. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-116'] = {
  id:'M-116', tier:'highmath2', level:'50', order:116,
  generator:'md116_pointLine',
  title:{ ko:'점과 직선 사이의 거리', en:'Distance from a Point to a Line', zh:'点到直线的距离' },
  subtitle:{ ko:'수선의 길이 |ax₁+by₁+c|/√(a²+b²)', en:'The perpendicular length |ax₁+by₁+c|/√(a²+b²)', zh:'垂线段的长|ax₁+by₁+c|/√(a²+b²)' },
  icon:'📐',

  practice:{
    generator:'md116_pointLine', level:'practice', count:6,
    params:{mode:'dist'},
    intro:{
      ko:'점의 좌표를 직선의 식 ax+by+c 에 넣고 절댓값을 취한 뒤 √(a²+b²) 로 나눕니다.',
      en:'Put the point into ax+by+c, take the absolute value, and divide by √(a²+b²).',
      zh:'把点的坐标代入ax+by+c，取绝对值，再除以√(a²+b²)。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'점에서 직선까지 가는 길은 많지만, 가장 짧은 길은 직선에 수직으로 내려가는 길 하나뿐입니다. 그 수선의 길이를 식 하나로 구할 수 있습니다.',
        en:'There are many paths from a point to a line, but the shortest one drops perpendicular to the line. Its length comes from a single formula.',
        zh:'从点到直线有许多路，但最短的只有垂直于直线的那一条。垂线段的长可以用一个公式求出。' }
    },
    stages:[
      { tag:{ko:'① 거리 공식',en:'1) The formula',zh:'① 距离公式'},
        head:{ko:'\\dfrac{|3\\times1+4\\times2-1|}{\\sqrt{3^2+4^2}}=\\dfrac{10}{5}=2',en:'\\dfrac{|3\\times1+4\\times2-1|}{\\sqrt{3^2+4^2}}=\\dfrac{10}{5}=2',zh:'\\dfrac{|3\\times1+4\\times2-1|}{\\sqrt{3^2+4^2}}=\\dfrac{10}{5}=2'},
        desc:{ko:'점 (1, 2) 와 직선 3x+4y−1=0 사이의 거리는 |3+8−1|÷5=<b>2</b> 입니다.',
              en:'The distance from (1, 2) to 3x+4y−1=0 is |3+8−1|÷5=<b>2</b>.',
              zh:'点(1, 2)到直线3x+4y−1=0的距离为|3+8−1|÷5=<b>2</b>。'},
        mathSteps:['10\\div5=2'],
        result:{ko:'넣고, 절댓값, 나누기!',en:'Substitute, absolute value, divide!',zh:'代入、绝对值、相除！'},
        book:{ko:'직선이 y=mx+n 꼴이면 먼저 mx−y+n=0 으로 바꿉니다.',
              en:'If the line is y=mx+n, rewrite it as mx−y+n=0 first.',
              zh:'直线是y=mx+n形式时，先化成mx−y+n=0。'} },

      { tag:{ko:'② 평행한 두 직선',en:'2) Parallel lines',zh:'② 两平行直线'},
        head:{ko:'6x+8y+6=0\\ \\Rightarrow\\ 3x+4y+3=0',en:'6x+8y+6=0\\ \\Rightarrow\\ 3x+4y+3=0',zh:'6x+8y+6=0\\ \\Rightarrow\\ 3x+4y+3=0'},
        desc:{ko:'3x+4y−2=0 과 6x+8y+6=0 은 평행합니다. 뒤의 식을 2 로 나누어 계수를 맞추면 거리는 |−2−3|÷5=<b>1</b> 입니다.',
              en:'3x+4y−2=0 and 6x+8y+6=0 are parallel. Halve the second to match coefficients: the distance is |−2−3|÷5=<b>1</b>.',
              zh:'3x+4y−2=0与6x+8y+6=0平行。把后者除以2使系数相同，距离为|−2−3|÷5=<b>1</b>。'},
        mathSteps:['|-2-3|\\div5=1'],
        result:{ko:'계수를 맞추고 상수항의 차!',en:'Match coefficients, then difference of constants!',zh:'系数相同后看常数项之差！'},
        book:{ko:'한 직선 위의 아무 점이나 골라 다른 직선까지의 거리를 구해도 같습니다.',
              en:'Picking any point on one line and measuring to the other gives the same answer.',
              zh:'在一条直线上任取一点，求它到另一条直线的距离，结果相同。'} },

      { tag:{ko:'③ 거리로 미정계수',en:'3) Unknowns from a distance',zh:'③ 由距离求待定系数'},
        head:{ko:'|7+k|=10\\ \\Rightarrow\\ k=3\\ \\text{or}\\ k=-17',en:'|7+k|=10\\ \\Rightarrow\\ k=3\\ \\text{or}\\ k=-17',zh:'|7+k|=10\\ \\Rightarrow\\ k=3\\ \\text{or}\\ k=-17'},
        desc:{ko:'점 (1, 1) 과 직선 3x+4y+k=0 사이의 거리가 2 이면 |7+k|=10 입니다. k 는 두 개이고, k>0 이면 <b>3</b> 입니다.',
              en:'If the distance from (1, 1) to 3x+4y+k=0 is 2, then |7+k|=10. There are two values; with k>0 it is <b>3</b>.',
              zh:'点(1, 1)到直线3x+4y+k=0的距离为2时，|7+k|=10。k有两个值，k>0时为<b>3</b>。'},
        mathSteps:['7+k=\\pm10'],
        result:{ko:'절댓값이면 답이 둘!',en:'Absolute value means two answers!',zh:'有绝对值就有两个解！'},
        book:{ko:'문제의 조건(양수, 음수 등)으로 둘 가운데 하나를 고릅니다.',
              en:'Use the condition in the problem (positive, negative, …) to pick one.',
              zh:'用题目的条件(正数、负数等)从两个中选一个。'} }
    ],
    rule:{ ko:'① d=|ax₁+by₁+c|/√(a²+b²)  ② 평행선은 계수를 맞춘 뒤 |c−c′|/√(a²+b²)  ③ 미정계수는 ± 두 경우에서 조건으로 고릅니다',
      en:'① d=|ax₁+by₁+c|/√(a²+b²)  ② Parallel lines: match coefficients, then |c−c′|/√(a²+b²)  ③ Unknowns: two ± cases, choose by the condition',
      zh:'① d=|ax₁+by₁+c|/√(a²+b²)  ② 平行线系数相同后|c−c′|/√(a²+b²)  ③ 待定系数在±两种情况中按条件选取' }
  },

  check:{
    fills:[
      { tex:{ko:'O(0,0),\\ 3x+4y-10=0\\ \\Rightarrow\\ d=\\square',en:'O(0,0),\\ 3x+4y-10=0\\ \\Rightarrow\\ d=\\square',zh:'O(0,0),\\ 3x+4y-10=0\\ \\Rightarrow\\ d=\\square'}, answer:2,
        hint:{ ko:'|−10|÷5', en:'|−10|÷5', zh:'|−10|÷5' } },
      { tex:{ko:'O(0,0),\\ 5x+12y+26=0\\ \\Rightarrow\\ d=\\square',en:'O(0,0),\\ 5x+12y+26=0\\ \\Rightarrow\\ d=\\square',zh:'O(0,0),\\ 5x+12y+26=0\\ \\Rightarrow\\ d=\\square'}, answer:2,
        hint:{ ko:'26÷13', en:'26÷13', zh:'26÷13' } }
    ],
    open:{ ko:'점에서 직선까지의 여러 선분 가운데 수선의 길이가 가장 짧은 까닭을 피타고라스 정리로 설명해 봅니다.',
      en:'Using the Pythagorean theorem, explain why the perpendicular is the shortest segment from a point to a line.',
      zh:'用勾股定理说说为什么从点到直线的线段中垂线段最短。' },
    openHint:{ ko:'다른 선분은 수선과 직각삼각형을 이루는 빗변이므로 수선보다 깁니다.',
      en:'Any other segment is the hypotenuse of a right triangle with the perpendicular, so it is longer.',
      zh:'其他线段是与垂线段构成的直角三角形的斜边，所以比垂线段长。' }
  },

  lab:{
    generator:'md116_pointLine', level:'main', count:6,
    params:{mode:'parallel'},
    intro:{
      ko:'평행한 두 직선은 x, y 의 계수를 같게 맞춘 뒤 상수항의 차로 거리를 구합니다.',
      en:'For parallel lines, match the x- and y-coefficients, then use the difference of the constants.',
      zh:'两平行直线先使x、y的系数相同，再用常数项之差求距离。'
    }
  },

  arena:{
    generator:'md116_pointLine', level:'main', count:6, timeLimit:420,
    params:{mode:'unknown'},
    rule:{ ko:'7분 안에 거리 조건에 맞는 미정계수를 모두 찾습니다!', en:'Find every unknown that fits the distance within 7 minutes!', zh:'7分钟内求出所有符合距离条件的待定系数！' }
  },

  stamp:{ label:{ ko:'수선 측량사', en:'Perpendicular Surveyor', zh:'垂线测量师' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'가장 짧은 길을 찾았어! 📐',en:'You found the shortest path!',zh:'找到最短的路了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'절댓값을 잊지 마!',en:'Do not forget the absolute value!',zh:'别忘了绝对值！'}, {ko:'√(a²+b²) 로 나눴는지 봐!',en:'Did you divide by √(a²+b²)?',zh:'看看有没有除以√(a²+b²)！'} ],
    finish:{ ko:'완벽해! 수선 측량사! 📐✨', en:'Perfect! Perpendicular Surveyor!', zh:'完美！垂线测量师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
