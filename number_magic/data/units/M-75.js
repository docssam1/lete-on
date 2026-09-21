/* Numbers of Magic — 유닛 M-75: 일차함수와 일차방정식 (중등 교과 연산 4차 2026-09-21)
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-75'] = {
  id:'M-75', tier:'middle2', level:'34', order:13,
  generator:'md75_lineEquation',
  title:{ ko:'일차함수와 일차방정식', en:'Linear Functions & Linear Equations', zh:'一次函数与一次方程' },
  subtitle:{ ko:'두 직선이 만나는 점이 곧 연립방정식의 해예요', en:'Where two lines meet is the solution of the system', zh:'两直线的交点就是方程组的解' },
  icon:'✖️',

  practice:{
    generator:'md75_lineEquation', level:'practice', count:5,
    params:{mode:'toSlope'},
    intro:{ ko:'y의 항만 남기고 나머지를 옮긴 뒤, y의 계수로 나누세요!', en:'Keep only the y term, move the rest across, then divide by the coefficient of y!', zh:'只留下y的项，其余移过去，再除以y的系数！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'연립방정식을 배울 때는 식만 두 줄 썼어요. 그런데 그 두 식은 각각 <b>직선 하나</b>예요. 두 식을 동시에 만족하는 (x, y)란 두 직선이 <b>함께 지나는 점</b>, 곧 교점이에요. 그래서 해가 하나면 두 직선이 한 점에서 만나고, 해가 없으면 평행하고, 해가 무수히 많으면 아예 같은 직선이에요 — 대수와 기하가 여기서 만나요.', en:'When you learned systems you just wrote two lines of algebra. But each of those equations is <b>a line</b>, and an (x, y) satisfying both is the point the two lines <b>share</b> - their intersection. One solution means they cross at a point, no solution means they are parallel, and infinitely many means they are the same line. Algebra and geometry meet right here.', zh:'学方程组时只是写了两行式子。但那两个式子各自就是<b>一条直线</b>，同时满足两式的(x, y)就是两直线<b>共有的点</b>，即交点。所以有唯一解就是相交于一点，无解就是平行，有无数解就是同一条直线——代数和几何在这里相遇。' },
      history:{ ko:'이 발상을 밀고 나가면 "식을 푸는 것"과 "그림에서 만나는 곳을 찾는 것"이 같은 일이 돼요. 데카르트가 좌표를 만든 뒤 수학이 크게 달라진 이유가 이것이에요. 오늘날 컴퓨터 그래픽에서 두 선이 부딪히는지 검사하는 것도 결국 이 연립방정식을 푸는 일이에요.', en:'Follow the idea through and solving equations becomes the same task as finding where two drawings meet. That is why mathematics changed so much once Descartes introduced coordinates. Even today, checking whether two lines collide in computer graphics comes down to solving this same system.', zh:'把这个想法推下去，"解式子"和"找图形相交的地方"就成了同一件事。这正是笛卡儿引入坐标后数学大变样的原因。今天计算机图形学里检测两条线是否相撞，归根到底也是解这个方程组。' }
    },
    stages:[
      { tag:{ ko:'① 일반형은 사실 일차함수', en:'1) The general form really is a linear function', zh:'① 一般式其实就是一次函数' },
        head:{ ko:'2x - y - 3 = 0 \\quad\\Rightarrow\\quad y = 2x - 3', en:'2x - y - 3 = 0 \\quad\\Rightarrow\\quad y = 2x - 3', zh:'2x - y - 3 = 0 \\quad\\Rightarrow\\quad y = 2x - 3' },
        desc:{ ko:'y에 대해 풀면 기울기와 y절편이 바로 보여요. 모양만 다를 뿐 <b>같은 직선</b>이에요 — 일반형은 x와 y를 대등하게 쓴 표기이고, y=ax+b는 y를 주인공으로 세운 표기예요.', en:'Solve for y and the slope and intercept appear. It is <b>the same line</b>, written differently: the general form treats x and y evenly, while y=ax+b puts y in the leading role.', zh:'解出y后斜率和y截距一目了然。只是写法不同，<b>是同一条直线</b>——一般式把x和y平等对待，y=ax+b则以y为主角。' },
        mathSteps:['-y = -2x + 3', 'y = 2x - 3'],
        result:{ ko:'식의 모양이 달라도 그리면 같은 직선!', en:'Different forms, same line when you draw it!', zh:'写法不同，画出来是同一条直线！' },
        book:{ ko:'by=... 에서 y의 계수 b로 나눌 때, b가 <b>음수면 모든 항의 부호가 바뀌어요</b>. 여기서 실수가 가장 많이 나와요 — 나눈 뒤 한 번 더 확인하세요.', en:'When you divide by the coefficient of y, a <b>negative</b> coefficient flips the sign of every term. This is where most slips happen - check once more after dividing.', zh:'除以y的系数时，系数为<b>负数</b>会让每一项都变号。这里最容易出错——除完后再核对一遍。' } },

      { tag:{ ko:'② 교점 = 연립방정식의 해', en:'2) The intersection is the solution', zh:'② 交点 = 方程组的解' },
        head:{ ko:'y = 2x - 3, \\; y = -x + 3 \\quad\\Rightarrow\\quad \\left(2,\\, 1\\right)', en:'y = 2x - 3, \\; y = -x + 3 \\quad\\Rightarrow\\quad \\left(2,\\, 1\\right)', zh:'y = 2x - 3, \\; y = -x + 3 \\quad\\Rightarrow\\quad \\left(2,\\, 1\\right)' },
        desc:{ ko:'교점에서는 x도 y도 두 식에서 같아요. y끼리 같다고 놓으면 2x−3=−x+3이라 x=2, 그 x를 아무 식에나 넣으면 y=1이에요. 그림으로 보면 두 직선이 (2, 1)에서 <b>실제로 만나요</b>.', en:'At the intersection both x and y agree in the two equations. Setting the y expressions equal gives 2x-3 = -x+3, so x = 2, and either equation then gives y = 1. On the graph the two lines <b>really do cross</b> at (2, 1).', zh:'在交点处x和y在两个式子里都相同。令两个y相等得2x−3=−x+3，x=2，代入任一式得y=1。画出来两条直线<b>确实相交</b>于(2, 1)。' },
        mathSteps:['2x - 3 = -x + 3', '3x = 6, \\; x = 2', 'y = 1'],
        result:{ ko:'식을 푸는 것과 만나는 곳을 찾는 것이 같은 일!', en:'Solving the equations and finding the crossing are one and the same!', zh:'解式子和找交点是同一件事！' },
        book:{ ko:'기울기가 같고 y절편이 다르면 <b>평행</b>이라 해가 없어요. 기울기도 y절편도 같으면 같은 직선이라 해가 무수히 많아요 — 연립방정식의 세 경우가 그림으로 전부 설명돼요.', en:'Equal slopes with different intercepts means <b>parallel</b>, so there is no solution; equal slopes and equal intercepts means one line, so there are infinitely many. All three cases for a system are explained by the picture.', zh:'斜率相同而y截距不同就<b>平行</b>，无解；斜率和y截距都相同就是同一条直线，有无数解——方程组的三种情况全都能用图说明。' } }
    ],
    rule:{ ko:'일반형도 직선이고, 두 직선의 교점이 연립방정식의 해예요 — 식과 그림이 같은 것을 말해요!', en:'The general form is a line too, and where two lines meet is the solution of the system - the algebra and the picture say the same thing!', zh:'一般式也是直线，两直线的交点就是方程组的解——式子和图说的是同一件事！' }
  },

  check:{
    fills:[
      { tex:'3x - y + 2 = 0 \\quad\\Rightarrow\\quad y = \\square x + 2', answer:3,
        hint:{ ko:'y=3x+2', en:'y = 3x + 2', zh:'y=3x+2' } },
      { tex:'y = x + 1, \\; y = -x + 5 \\quad\\Rightarrow\\quad x = \\square', answer:2,
        hint:{ ko:'x+1=−x+5', en:'x+1 = -x+5', zh:'x+1=−x+5' } }
    ],
    open:{ ko:'두 직선이 평행하면 연립방정식의 해가 왜 없는지 말해봐요.', en:'Explain why parallel lines mean the system has no solution.', zh:'说说两直线平行时方程组为什么无解。' },
    openHint:{ ko:'만나는 점이 없으니 두 식을 동시에 만족하는 (x, y)가 없어서', en:'Because they never meet, no (x, y) satisfies both equations', zh:'因为没有交点，就没有同时满足两式的(x, y)' }
  },

  lab:{
    generator:'md75_lineEquation', level:'main', count:4,
    params:{mode:'intersect'},
    intro:{ ko:'두 y를 같다고 놓고 x를 먼저 구하세요!', en:'Set the two y expressions equal and find x first!', zh:'令两个y相等，先求出x！' }
  },

  arena:{
    generator:'md75_lineEquation', level:'main', count:8, timeLimit:360,
    params:{mode:'parallel'},
    rule:{ ko:'6분 안에 일반형을 고쳐 기울기를 맞춰요!', en:'Within 6 minutes, rewrite the general form and match the slopes!', zh:'6分钟内改写一般式并配平斜率！' }
  },

  stamp:{ label:{ ko:'교점의 발견자', en:'Finder of Crossings', zh:'交点发现者' }, coins:54 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, { ko:'식과 그림을 하나로 이었구나! ✖️', en:'You tied the algebra and the picture together!', zh:'你把式子和图连成了一体！' }, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ { ko:'y의 계수가 음수면 부호가 전부 바뀌어!', en:'A negative y coefficient flips every sign!', zh:'y的系数是负数时，所有项都要变号！' }, { ko:'x를 구했으면 아무 식에나 넣어 y도 구해!', en:'Once you have x, put it into either equation for y!', zh:'求出x后，代入任一式求y！' } ],
    finish:{ ko:'완벽해! 교점의 발견자! ✖️✨', en:'Perfect! Finder of Crossings!', zh:'完美！交点发现者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
