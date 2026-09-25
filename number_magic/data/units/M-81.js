/* Numbers of Magic — 유닛 M-81: 이차함수의 식 구하기 (중등 교과 연산 4차 2026-09-21)
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-81'] = {
  id:'M-81', tier:'middle3', level:'37', order:13,
  generator:'md81_quadFind',
  title:{ ko:'이차함수의 식 구하기', en:'Building the Formula of a Parabola', zh:'求二次函数的解析式' },
  subtitle:{ ko:'그래프를 보고 식을 거꾸로 세웁니다', en:'Read the graph backwards into a formula', zh:'看图反过来求式子' },
  icon:'🔧',

  practice:{
    generator:'md81_quadFind', level:'practice', count:5,
    params:{mode:'vertexPoint'},
    intro:{ ko:'꼭짓점을 알면 y=a(x−p)²+q까지 쓸 수 있습니다 — 남은 a는 점 하나로!', en:'The vertex gets you to y=a(x-p)2+q - one more point fixes a!', zh:'知道顶点就能写到y=a(x−p)²+q——剩下的a用一个点确定！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'지금까지는 식을 보고 그래프를 그렸습니다. 이제 반대로 갑니다. 열쇠는 <b>주어진 것에 맞는 꼴로 시작하는 것</b>입니다 — 꼭짓점을 알면 y=a(x−p)²+q로, x축과의 두 교점을 알면 y=a(x−p)(x−q)로 시작합니다. 아무 꼴로나 시작하면 미지수가 셋(a, b, c)이라 점이 셋 필요하지만, 맞는 꼴로 시작하면 미지수가 a 하나뿐이라 점 하나면 끝납니다.', en:'Until now you drew graphs from formulas; now you go the other way. The key is to <b>start from the form that matches what you are given</b>: a vertex means y=a(x-p)2+q, two x-intercepts mean y=a(x-p)(x-q). Start from the wrong form and you have three unknowns and need three points; start from the right one and a is the only unknown, so a single point finishes it.', zh:'之前是看式子画图象，现在反过来。关键是<b>从与已知条件相配的形式入手</b>——知道顶点就用y=a(x−p)²+q，知道与x轴的两个交点就用y=a(x−p)(x−q)。随便选形式会有三个未知数(a、b、c)，要三个点；选对了就只剩a一个未知数，一个点就够。' },
      history:{ ko:'이것은 수학을 넘어 쓰이는 생각입니다. 관측한 점 몇 개로 그 뒤에 숨은 식을 찾아내는 일을 "회귀"라고 하고, 오늘날 데이터로 예측을 하는 일의 바탕이 됩니다. 우리가 하는 일은 그 가장 단순한 형태 — 점 몇 개로 포물선 하나를 되찾는 일입니다.', en:'The idea reaches well beyond mathematics. Recovering the hidden formula from a handful of observed points is called regression, and it underlies how predictions are made from data today. What you are doing here is its simplest form: getting one parabola back from a few points.', zh:'这个想法远超数学本身。从观测到的几个点找出背后隐藏的式子叫"回归"，是今天用数据做预测的基础。我们做的正是它最简单的形式——用几个点把一条抛物线找回来。' }
    },
    stages:[
      { tag:{ ko:'① 꼭짓점을 알 때', en:'1) When you know the vertex', zh:'① 已知顶点时' },
        head:{ ko:'\\text{꼭짓점} \\left(2,\\, 3\\right), \\; \\left(4,\\, 11\\right) \\text{를 지남} \\quad\\Rightarrow\\quad a = 2', en:'\\text{vertex} \\left(2,\\, 3\\right), \\; \\text{through } \\left(4,\\, 11\\right) \\quad\\Rightarrow\\quad a = 2', zh:'\\text{顶点} \\left(2,\\, 3\\right), \\; \\text{过} \\left(4,\\, 11\\right) \\quad\\Rightarrow\\quad a = 2' },
        desc:{ ko:'꼭짓점이 (2, 3)이니 y=a(x−2)²+3까지는 바로 씁니다. 남은 a는 지나는 점 (4, 11)을 넣어 11=a×4+3, 4a=8, <b>a=2</b>로 구합니다.', en:'A vertex at (2, 3) gets you straight to y=a(x-2)2+3. For a, substitute the point (4, 11): 11 = 4a+3, so 4a = 8 and <b>a = 2</b>.', zh:'顶点是(2, 3)，所以直接写到y=a(x−2)²+3。剩下的a代入点(4, 11)：11=a×4+3，4a=8，<b>a=2</b>。' },
        mathSteps:['y = a(x-2)^2 + 3', '11 = a \\times 4 + 3', 'a = 2'],
        result:{ ko:'맞는 꼴로 시작하면 점 하나로 끝납니다!', en:'Start from the right form and one point finishes it!', zh:'从对的形式入手，一个点就够了！' },
        book:{ ko:'점을 넣을 때 <b>x부터 넣어 괄호 안을 먼저 계산</b>하세요. (4−2)²=4를 먼저 구해 두면 남는 것은 간단한 일차방정식 하나뿐입니다.', en:'When substituting, <b>put x in and work out the bracket first</b>. Once (4-2)2 = 4 is done, all that remains is a simple linear equation.', zh:'代入时<b>先代x，先算括号</b>。先求出(4−2)²=4，剩下的就只是一个简单的一元一次方程。' } },

      { tag:{ ko:'② x축과의 두 교점을 알 때', en:'2) When you know both x-intercepts', zh:'② 已知与x轴的两个交点时' },
        head:{ ko:'\\text{x축과 } \\left(1,\\, 0\\right), \\left(3,\\, 0\\right) \\quad\\Rightarrow\\quad y = a(x-1)(x-3)', en:'\\text{x-axis at } \\left(1,\\, 0\\right), \\left(3,\\, 0\\right) \\quad\\Rightarrow\\quad y = a(x-1)(x-3)', zh:'\\text{与x轴交于} \\left(1,\\, 0\\right), \\left(3,\\, 0\\right) \\quad\\Rightarrow\\quad y = a(x-1)(x-3)' },
        desc:{ ko:'두 교점이 1과 3이면 <b>인수분해된 꼴</b>로 바로 쓸 수 있습니다. 이 꼴은 x=1과 x=3에서 y가 0이 되는 것이 한눈에 보입니다. 남은 a는 역시 다른 점 하나로 정합니다.', en:'Intercepts at 1 and 3 let you write the <b>already-factored</b> form, where it is plain to see that y is zero at x=1 and x=3. One further point then fixes a.', zh:'两个交点是1和3，就能直接写成<b>因式分解好的形式</b>，一眼就能看出x=1和x=3时y为0。剩下的a同样用另一个点确定。' },
        mathSteps:['y = a(x-1)(x-3)', {ko:'\\text{다른 점으로 } a \\text{ 결정}',en:'\\text{another point fixes } a',zh:'\\text{用另一个点确定 } a'}],
        result:{ ko:'주어진 것에 맞는 꼴을 고르는 것이 절반입니다!', en:'Choosing the form that fits is half the work!', zh:'选对形式就完成了一半！' },
        book:{ ko:'표준형과 일반형은 같은 식의 두 얼굴입니다. y=(x−2)²+3을 전개하면 y=x²−4x+7이고, 거꾸로 완전제곱을 하면 되돌아옵니다 — 필요한 쪽으로 <b>오갈 수 있어야</b> 합니다.', en:'Vertex form and general form are two faces of one formula: expanding y=(x-2)2+3 gives y=x2-4x+7, and completing the square brings it back. You need to be able to <b>travel both ways</b>.', zh:'顶点式和一般式是同一个式子的两副面孔：展开y=(x−2)²+3得y=x²−4x+7，配方又能回去——要能<b>来回自如</b>。' } }
    ],
    rule:{ ko:'주어진 것에 맞는 꼴로 시작하고, 남은 a는 지나는 점 하나로 — 꼭짓점이면 표준형, 두 교점이면 인수분해형!', en:'Start from the form that fits what you are given and let one more point fix a - vertex form for a vertex, factored form for two intercepts!', zh:'从与已知相配的形式入手，剩下的a用一个点确定——已知顶点用顶点式，已知两交点用因式分解形式！' }
  },

  check:{
    fills:[
      { tex:{ko:'\\text{꼭짓점} \\left(1,\\, 2\\right), \\; \\left(2,\\, 5\\right) \\text{를 지남} \\quad\\Rightarrow\\quad a = \\square',en:'\\text{vertex} \\left(1,\\, 2\\right), \\text{ through } \\left(2,\\, 5\\right) \\quad\\Rightarrow\\quad a = \\square',zh:'\\text{顶点} \\left(1,\\, 2\\right), \\; \\text{过} \\left(2,\\, 5\\right) \\quad\\Rightarrow\\quad a = \\square'}, answer:3,
        hint:{ ko:'5=a×1+2', en:'5 = a x 1 + 2', zh:'5=a×1+2' } },
      { tex:{ko:'\\text{꼭짓점} \\left(3,\\, 1\\right), \\; x^2 \\text{계수 } 1 \\quad\\Rightarrow\\quad y = x^2 + \\square x + 10',en:'\\text{vertex} \\left(3,\\, 1\\right), \\; x^2 \\text{ coefficient } 1 \\quad\\Rightarrow\\quad y = x^2 + \\square x + 10',zh:'\\text{顶点} \\left(3,\\, 1\\right), \\; x^2 \\text{的系数} 1 \\quad\\Rightarrow\\quad y = x^2 + \\square x + 10'}, answer:-6,
        hint:{ ko:'−2×3', en:'-2 x 3', zh:'−2×3' } }
    ],
    open:{ ko:'꼭짓점을 알 때와 두 교점을 알 때 시작하는 꼴이 왜 다른지 말해봅니다.', en:'Explain why the starting form differs for a vertex and for two intercepts.', zh:'说说已知顶点和已知两交点时，为什么起始形式不同。' },
    openHint:{ ko:'주어진 정보가 그대로 들어가는 꼴이라야 미지수가 a 하나만 남아서', en:'Because the form that absorbs the given information leaves a as the only unknown', zh:'因为能把已知直接装进去的形式，才只剩a一个未知数' }
  },

  lab:{
    generator:'md81_quadFind', level:'main', count:4,
    params:{mode:'twoRoots'},
    intro:{ ko:'두 교점을 알면 y=a(x−p)(x−q)로 바로 시작하세요!', en:'With two intercepts, start straight from y=a(x-p)(x-q)!', zh:'知道两个交点就直接从y=a(x−p)(x−q)开始！' }
  },

  arena:{
    generator:'md81_quadFind', level:'main', count:8, timeLimit:360,
    params:{mode:'general'},
    rule:{ ko:'6분 안에 표준형을 전개해 일반형의 b와 c를 구합니다!', en:'Within 6 minutes, expand the vertex form and get b and c!', zh:'6分钟内展开顶点式，求出一般式的b和c！' }
  },

  stamp:{ label:{ ko:'식을 되찾는 이', en:'Recoverer of Formulas', zh:'式子找回者' }, coins:58 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, { ko:'주어진 것에 맞는 꼴을 잘 골랐구나! 🔧', en:'You chose the form that fits what you were given!', zh:'你选对了与已知相配的形式！' }, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ { ko:'꼭짓점을 알면 y=a(x−p)²+q부터 써 봐!', en:'With a vertex, start from y=a(x-p)2+q!', zh:'知道顶点就先写y=a(x−p)²+q！' }, { ko:'점을 넣을 때 괄호 안을 먼저 계산해!', en:'Work out the bracket first when you substitute!', zh:'代入时先算括号里！' } ],
    finish:{ ko:'완벽해! 식을 되찾는 이! 🔧✨', en:'Perfect! Recoverer of Formulas!', zh:'完美！式子找回者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
