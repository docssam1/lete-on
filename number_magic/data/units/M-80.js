/* Numbers of Magic — 유닛 M-80: 이차함수의 최대·최소와 축과의 교점 (중등 교과 연산 4차 2026-09-21)
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-80'] = {
  id:'M-80', tier:'middle3', level:'37', order:12,
  generator:'md80_quadExtrema',
  title:{ ko:'이차함수의 최대·최소와 축과의 교점', en:'Extremes & Axis Crossings of a Parabola', zh:'二次函数的最值与轴交点' },
  subtitle:{ ko:'꼭짓점이 최댓값·최솟값, x축 교점이 이차방정식의 근이에요', en:'The vertex gives the extreme, and the x-axis crossings are the roots', zh:'顶点给出最值，x轴交点就是方程的根' },
  icon:'🎢',

  practice:{
    generator:'md80_quadExtrema', level:'practice', count:5,
    params:{mode:'maxMin'},
    intro:{ ko:'(x−p)²은 절대 음수가 못 돼요 — 0이 되는 순간의 y가 답이에요!', en:'(x-p)2 can never be negative - the y at the moment it is zero is the answer!', zh:'(x−p)²不可能为负——它等于0时的y就是答案！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'공을 위로 던지면 올라가다 멈추고 내려와요. 그 "멈추는 한 점"이 가장 높은 곳이고, 그것이 꼭짓점이에요. 왜 거기가 끝일까요? y=a(x−p)²+q에서 (x−p)²은 <b>절대 음수가 될 수 없어서</b> 가장 작은 값이 0이고, 그때 y는 q예요. a가 양수면 q보다 작아질 수 없고(최솟값), 음수면 q보다 커질 수 없어요(최댓값).', en:'Throw a ball up and it rises, pauses, and falls - that pause is the top, and it is the vertex. Why is that the end of the road? In y=a(x-p)2+q the square <b>can never be negative</b>, so its smallest value is zero and y is then q. With a positive, nothing can go below q (a minimum); with a negative, nothing can go above it (a maximum).', zh:'把球向上抛，它上升、停住、再落下。那个"停住的点"就是最高处，也就是顶点。为什么那里是尽头？因为y=a(x−p)²+q中的(x−p)²<b>不可能为负</b>，最小值是0，这时y就是q。a为正时不能小于q(最小值)，为负时不能大于q(最大值)。' },
      history:{ ko:'이차함수와 이차방정식은 사실 한 몸이에요. y=0으로 놓는 순간 이차방정식이 되고, 그 근이 그래프가 x축을 뚫는 자리예요. 근이 둘이면 두 점에서 만나고, 중근이면 한 점에서 닿기만 하고, 근이 없으면 x축에 닿지 않아요 — 판별식이 말하던 것이 그림으로는 이 이야기였어요.', en:'A quadratic function and a quadratic equation are one thing seen two ways. Set y=0 and you have the equation, and its roots are where the graph pierces the x-axis. Two roots means two crossings, a repeated root means it just touches, and no roots means it never reaches the axis - the discriminant was telling this story all along.', zh:'二次函数和二次方程其实是一体的。令y=0就成了方程，它的根就是图象穿过x轴的地方。有两个根就相交于两点，有重根就只相切于一点，没有根就碰不到x轴——判别式说的原来就是这个图。' }
    },
    stages:[
      { tag:{ ko:'① 꼭짓점의 y가 최댓값·최솟값', en:'1) The y at the vertex is the extreme', zh:'① 顶点的y就是最值' },
        head:{ ko:'y = 2(x - 3)^2 + 5 \\quad\\Rightarrow\\quad \\text{최솟값} = 5', en:'y = 2(x - 3)^2 + 5 \\quad\\Rightarrow\\quad \\text{minimum} = 5', zh:'y = 2(x - 3)^2 + 5 \\quad\\Rightarrow\\quad \\text{最小值} = 5' },
        desc:{ ko:'(x−3)²은 0 이상이고 a=2가 양수이니, y는 5보다 작아질 수 없어요. x=3일 때 딱 5 — 그때가 <b>최솟값</b>이에요. a가 음수면 정반대로 최댓값이 돼요.', en:'The square is at least zero and a=2 is positive, so y can never dip below 5. At x=3 it is exactly 5 - the <b>minimum</b>. With a negative a it becomes the maximum instead.', zh:'(x−3)²不小于0，且a=2为正，所以y不会小于5。x=3时正好是5——那就是<b>最小值</b>。a为负时正好相反，成为最大值。' },
        mathSteps:['(x - 3)^2 \\ge 0', 'x = 3 \\quad\\Rightarrow\\quad y = 5'],
        result:{ ko:'a의 부호가 최대냐 최소냐를 정해요!', en:'The sign of a decides maximum or minimum!', zh:'a的符号决定是最大值还是最小值！' },
        book:{ ko:'최댓값·최솟값은 <b>y값</b>이지 x값이 아니에요. "언제 최대인가"를 물으면 x=p, "최댓값은 얼마인가"를 물으면 q예요 — 두 물음을 구별하세요.', en:'The extreme is a <b>y value</b>, not an x value. Asked when it happens, answer x=p; asked what the extreme is, answer q. Keep the two questions apart.', zh:'最值是<b>y值</b>，不是x值。问"什么时候取到"答x=p，问"最值是多少"答q——要区分这两个问题。' } },

      { tag:{ ko:'② 축과의 교점 — y=0과 x=0', en:'2) Axis crossings - set y=0 and x=0', zh:'② 与轴的交点——令y=0和x=0' },
        head:{ ko:'y = x^2 - 5x + 6 \\quad\\Rightarrow\\quad \\text{x축과 } 2, \\; 3', en:'y = x^2 - 5x + 6 \\quad\\Rightarrow\\quad \\text{x-axis at } 2, \\; 3', zh:'y = x^2 - 5x + 6 \\quad\\Rightarrow\\quad \\text{与x轴交于} 2, \\; 3' },
        desc:{ ko:'x축 위에서는 y=0이에요. 그러면 x²−5x+6=0이라는 <b>이차방정식</b>이 되고, 인수분해하면 근은 2와 3 — 그 두 자리에서 그래프가 x축을 뚫어요. y축과의 교점은 x=0을 넣어 상수항 6이에요.', en:'On the x-axis y is zero, which turns the function into the <b>quadratic equation</b> x2-5x+6 = 0. Factoring gives roots 2 and 3, the two places the graph crosses. For the y-axis put x=0 and read the constant, 6.', zh:'在x轴上y=0，于是变成<b>二次方程</b>x²−5x+6=0，因式分解得根2和3——图象就在这两处穿过x轴。与y轴的交点令x=0，就是常数项6。' },
        mathSteps:['x^2 - 5x + 6 = 0', '(x - 2)(x - 3) = 0', 'x = 2, \\; 3'],
        result:{ ko:'이차함수와 이차방정식은 한 몸이에요!', en:'A quadratic function and a quadratic equation are one thing!', zh:'二次函数和二次方程本是一体！' },
        book:{ ko:'두 교점의 <b>한가운데</b>가 대칭축이에요 — 위 예에서는 (2+3)÷2=2.5. 포물선이 좌우로 똑같이 생겼기 때문이고, 꼭짓점의 x좌표도 바로 그 값이에요.', en:'The axis of symmetry is <b>halfway</b> between the two crossings - here (2+3)/2 = 2.5. The parabola is symmetric, so that is also the x-coordinate of the vertex.', zh:'两个交点的<b>正中间</b>就是对称轴——上例是(2+3)÷2=2.5。因为抛物线左右对称，顶点的横坐标也正是这个值。' } }
    ],
    rule:{ ko:'꼭짓점의 y가 최댓값·최솟값, x축 교점은 y=0인 근, y축 교점은 상수항 그대로예요!', en:'The y at the vertex is the extreme, the x-axis crossings are the roots of y=0, and the y-axis crossing is just the constant term!', zh:'顶点的y是最值，x轴交点是y=0的根，y轴交点就是常数项！' }
  },

  check:{
    fills:[
      { tex:{ko:'y = 3(x - 2)^2 - 7 \\quad\\Rightarrow\\quad \\text{최솟값} = \\square',en:'y = 3(x - 2)^2 - 7 \\quad\\Rightarrow\\quad \\text{minimum} = \\square',zh:'y = 3(x - 2)^2 - 7 \\quad\\Rightarrow\\quad \\text{最小值} = \\square'}, answer:-7,
        hint:{ ko:'꼭짓점의 y', en:'The y at the vertex', zh:'顶点的y' } },
      { tex:{ko:'y = x^2 - 4x + 3 \\quad\\Rightarrow\\quad \\text{y축과의 교점} = \\square',en:'y = x^2 - 4x + 3 \\quad\\Rightarrow\\quad \\text{y-axis crossing} = \\square',zh:'y = x^2 - 4x + 3 \\quad\\Rightarrow\\quad \\text{与y轴的交点} = \\square'}, answer:3,
        hint:{ ko:'x=0을 넣어요', en:'Put x=0', zh:'代入x=0' } }
    ],
    open:{ ko:'x축과의 교점이 왜 이차방정식의 근인지 말해봐요.', en:'Explain why the x-axis crossings are the roots of the quadratic equation.', zh:'说说与x轴的交点为什么就是二次方程的根。' },
    openHint:{ ko:'x축 위에서는 y=0이라 함수식이 그대로 방정식이 되기 때문', en:'Because y is zero on the x-axis, so the function becomes the equation', zh:'因为在x轴上y=0，函数式就直接变成了方程' }
  },

  lab:{
    generator:'md80_quadExtrema', level:'main', count:4,
    params:{mode:'xAxis'},
    intro:{ ko:'y=0으로 놓고 인수분해해 보세요 — 두 근이 곧 교점이에요!', en:'Set y=0 and factor - the two roots are the crossings!', zh:'令y=0再因式分解——两个根就是交点！' }
  },

  arena:{
    generator:'md80_quadExtrema', level:'main', count:8, timeLimit:360,
    params:{mode:'yAxis'},
    rule:{ ko:'6분 안에 x=0을 넣어 y축과의 교점을 찾아요!', en:'Within 6 minutes, put x=0 and find where it meets the y-axis!', zh:'6分钟内代入x=0找出与y轴的交点！' }
  },

  stamp:{ label:{ ko:'꼭대기와 바닥의 관찰자', en:'Watcher of Peaks and Floors', zh:'观峰察底者' }, coins:56 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, { ko:'꼭짓점과 교점을 정확히 구분했구나! 🎢', en:'You kept the vertex and the crossings exactly straight!', zh:'你把顶点和交点分得清清楚楚！' }, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ { ko:'최댓값·최솟값은 x가 아니라 y값이야!', en:'The extreme is a y value, not an x!', zh:'最值是y值，不是x！' }, { ko:'x축 위에서는 y=0이야!', en:'On the x-axis, y is zero!', zh:'在x轴上y=0！' } ],
    finish:{ ko:'완벽해! 꼭대기와 바닥의 관찰자! 🎢✨', en:'Perfect! Watcher of Peaks and Floors!', zh:'完美！观峰察底者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
