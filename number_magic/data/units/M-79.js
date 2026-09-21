/* Numbers of Magic — 유닛 M-79: 이차함수의 평행이동 (중등 교과 연산 4차 2026-09-21)
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-79'] = {
  id:'M-79', tier:'middle3', level:'37', order:10,
  generator:'md79_quadShift',
  title:{ ko:'이차함수의 평행이동', en:'Translating a Parabola', zh:'二次函数的平移' },
  subtitle:{ ko:'위아래는 보이는 대로, 좌우는 부호가 반대입니다', en:'Up and down as you expect, sideways with the sign reversed', zh:'上下是所见即所得，左右要反号' },
  icon:'↔️',

  practice:{
    generator:'md79_quadShift', level:'practice', count:5,
    params:{mode:'upDown'},
    intro:{ ko:'위아래로 옮기면 뒤에 더해집니다 — 위로 q만큼이면 +q입니다!', en:'An up-down slide is added at the end - q upward gives +q!', zh:'上下平移加在后面——向上q就是+q！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'y=x²를 오른쪽으로 3칸 옮기면 y=(x−3)²입니다. "오른쪽인데 왜 빼지?"가 이 단원 최대의 고비입니다. 이유는 간단합니다 — 새 그래프의 꼭짓점은 x=3에 있어야 하고, 괄호 안이 <b>0이 되는 자리</b>가 꼭짓점이니까 (x−3)이어야 x=3에서 0이 되기 때문입니다. 옮긴 방향이 아니라 "어디서 0이 되느냐"를 보면 헷갈리지 않습니다.', en:'Slide y=x2 three to the right and it becomes y=(x-3)2. "Why a minus for a move to the right?" is the big stumbling block here. The reason is simple: the new vertex must sit at x=3, and the vertex is where the bracket is <b>zero</b> - and (x-3) is zero exactly at x=3. Think about where it vanishes, not which way you moved, and the confusion goes.', zh:'把y=x²向右平移3就得到y=(x−3)²。"向右为什么用减？"是本单元最大的坎。理由很简单——新图象的顶点要在x=3处，而顶点就是括号里<b>为0</b>的地方，(x−3)恰好在x=3时为0。不看平移方向，只看"在哪里变成0"，就不会糊涂了。' },
      history:{ ko:'평행이동은 그래프를 새로 그리지 않고 <b>옮기기만</b> 하는 기술입니다. 모양(a)은 그대로 두고 위치만 바꾸니, a가 같은 포물선들은 전부 서로 포개집니다. 이 생각은 나중에 함수의 그래프 전체를 다룰 때 다시 나옵니다 — 삼각함수도, 지수함수도 같은 방식으로 옮깁니다.', en:'A translation redraws nothing; it only <b>moves</b> the graph. The shape - the a - stays the same and only the position changes, so all parabolas with the same a are copies of one another. The idea returns whenever graphs are studied: trigonometric and exponential functions slide in exactly the same way.', zh:'平移不重画图象，只是把它<b>搬走</b>。形状(a)不变，只改变位置，所以a相同的抛物线彼此都能重合。这个想法以后研究函数图象时还会出现——三角函数、指数函数也是这样平移的。' }
    },
    stages:[
      { tag:{ ko:'① 위아래 — 뒤에 더한다', en:'1) Up and down - added at the end', zh:'① 上下——加在后面' },
        head:{ ko:'y = 2x^2 \\quad\\Rightarrow\\quad y = 2x^2 + 5', en:'y = 2x^2 \\quad\\Rightarrow\\quad y = 2x^2 + 5', zh:'y = 2x^2 \\quad\\Rightarrow\\quad y = 2x^2 + 5' },
        desc:{ ko:'위로 5만큼 옮기면 모든 y값이 5씩 커지니 그냥 <b>+5</b>를 붙입니다. 꼭짓점은 (0, 0)에서 (0, 5)로 올라갑니다. 이쪽은 보이는 대로라 헷갈릴 일이 없습니다.', en:'Sliding 5 up raises every y by 5, so you simply add <b>+5</b>. The vertex moves from (0, 0) to (0, 5). This direction reads as you would expect, so nothing here trips people up.', zh:'向上平移5，所有y值都增加5，所以直接加<b>+5</b>。顶点从(0, 0)升到(0, 5)。这个方向是所见即所得，不会让人糊涂。' },
        mathSteps:['y = 2x^2 + 5', {ko:'\\text{꼭짓점} \\left(0,\\, 5\\right)',en:'\\text{vertex} \\left(0,\\, 5\\right)',zh:'\\text{顶点} \\left(0,\\, 5\\right)'}],
        result:{ ko:'위아래는 보이는 그대로 더하고 뺍니다!', en:'Up and down go in just as you read them!', zh:'上下就照着看到的加减！' },
        book:{ ko:'아래로 옮기면 −q가 붙습니다. 이때도 <b>모양은 하나도 안 변합니다</b> — 폭도 볼록한 방향도 그대로고 높이만 달라집니다.', en:'A downward slide gives -q, and again <b>the shape does not change at all</b>: the width and the direction it opens stay put, only the height differs.', zh:'向下平移就加−q。这时<b>形状一点也不变</b>——宽窄和开口方向都不变，只是高度不同。' } },

      { tag:{ ko:'② 좌우 — 괄호 안에 반대 부호로', en:'2) Sideways - inside the bracket, sign reversed', zh:'② 左右——进括号并反号' },
        head:{ ko:'y = 2x^2 \\quad\\Rightarrow\\quad y = 2(x - 3)^2', en:'y = 2x^2 \\quad\\Rightarrow\\quad y = 2(x - 3)^2', zh:'y = 2x^2 \\quad\\Rightarrow\\quad y = 2(x - 3)^2' },
        desc:{ ko:'오른쪽으로 3만큼 옮기면 (x<b>−</b>3)²입니다. 확인하는 방법은 하나 — x=3을 넣어 보세요. 괄호 안이 0이 되어 y도 0, 즉 그 자리가 <b>꼭짓점</b>입니다. 방향이 아니라 "어디서 0이 되나"를 보면 됩니다.', en:'Sliding 3 to the right gives (x<b>-</b>3)2. There is one way to check: put x=3 in. The bracket is zero, so y is zero - that is the <b>vertex</b>. Look at where it vanishes, not which way you moved.', zh:'向右平移3就是(x<b>−</b>3)²。检验办法只有一个——代入x=3。括号里变成0，y也是0，那里就是<b>顶点</b>。不看方向，看"在哪里变成0"。' },
        mathSteps:['x = 3 \\quad\\Rightarrow\\quad (x-3)^2 = 0', {ko:'\\text{꼭짓점} \\left(3,\\, 0\\right)',en:'\\text{vertex} \\left(3,\\, 0\\right)',zh:'\\text{顶点} \\left(3,\\, 0\\right)'}],
        result:{ ko:'괄호 안이 0이 되는 자리가 꼭짓점입니다!', en:'The vertex is where the bracket goes to zero!', zh:'括号里变成0的地方就是顶点！' },
        book:{ ko:'두 방향을 함께 옮기면 y=a(x−p)²+q가 되고 꼭짓점은 (p, q)입니다. <b>옮긴 만큼이 그대로 꼭짓점의 좌표</b>가 되는 셈이라, 외울 것이 아니라 읽으면 되는 식입니다.', en:'Move both ways and you get y=a(x-p)2+q with vertex (p, q) - <b>the amounts you moved are the vertex coordinates</b>. It is a formula to read, not to memorise.', zh:'两个方向一起平移就得到y=a(x−p)²+q，顶点是(p, q)——<b>平移了多少，顶点坐标就是多少</b>。这是用来读的式子，不是用来背的。' } }
    ],
    rule:{ ko:'위아래는 뒤에 그대로, 좌우는 괄호 안에 반대 부호로 — 꼭짓점은 옮긴 만큼 그대로입니다!', en:'Up and down go at the end as they read; sideways goes inside the bracket with the sign flipped - and the vertex is wherever you moved it to!', zh:'上下照原样加在后面，左右进括号并反号——顶点就是平移到的位置！' }
  },

  check:{
    fills:[
      { tex:{ko:'y = x^2 \\text{을 아래로 } 4 \\quad\\Rightarrow\\quad \\text{꼭짓점의 } y = \\square',en:'y = x^2 \\text{ shifted down } 4 \\quad\\Rightarrow\\quad \\text{vertex } y = \\square',zh:'y = x^2 \\text{向下平移} 4 \\quad\\Rightarrow\\quad \\text{顶点的 } y = \\square'}, answer:-4,
        hint:{ ko:'아래로면 음수', en:'Downward means negative', zh:'向下就是负数' } },
      { tex:{ko:'y = (x + 2)^2 \\quad\\Rightarrow\\quad \\text{꼭짓점의 } x = \\square',en:'y = (x + 2)^2 \\quad\\Rightarrow\\quad \\text{vertex } x = \\square',zh:'y = (x + 2)^2 \\quad\\Rightarrow\\quad \\text{顶点的 } x = \\square'}, answer:-2,
        hint:{ ko:'괄호 안이 0이 되는 x', en:'The x that makes the bracket zero', zh:'使括号为0的x' } }
    ],
    open:{ ko:'오른쪽으로 옮겼는데 왜 괄호 안이 −가 되는지 말해봅니다.', en:'Explain why a move to the right puts a minus inside the bracket.', zh:'说说向右平移为什么括号里是减号。' },
    openHint:{ ko:'꼭짓점이 될 자리에서 괄호 안이 0이 되어야 해서', en:'Because the bracket has to vanish at the new vertex', zh:'因为在新顶点处括号里必须变成0' }
  },

  lab:{
    generator:'md79_quadShift', level:'main', count:4,
    params:{mode:'leftRight'},
    intro:{ ko:'x에 얼마를 넣으면 괄호 안이 0이 되는지 생각해 보세요!', en:'Ask what x makes the bracket zero!', zh:'想想x取多少时括号里变成0！' }
  },

  arena:{
    generator:'md79_quadShift', level:'main', count:8, timeLimit:360,
    params:{mode:'both'},
    rule:{ ko:'6분 안에 두 방향으로 옮긴 꼭짓점을 찾습니다!', en:'Within 6 minutes, find the vertex after moving both ways!', zh:'6分钟内找出两个方向平移后的顶点！' }
  },

  stamp:{ label:{ ko:'그래프를 옮기는 이', en:'Mover of Graphs', zh:'图象搬运者' }, coins:54 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, { ko:'옮긴 자리를 정확히 짚었구나! ↔️', en:'You pinpointed where it moved to!', zh:'你准确指出了平移后的位置！' }, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ { ko:'괄호 안이 0이 되는 x를 찾아봐!', en:'Find the x that makes the bracket zero!', zh:'找出使括号为0的x！' }, { ko:'위아래는 뒤에, 좌우는 괄호 안에!', en:'Up and down at the end, sideways inside the bracket!', zh:'上下在后面，左右在括号里！' } ],
    finish:{ ko:'완벽해! 그래프를 옮기는 이! ↔️✨', en:'Perfect! Mover of Graphs!', zh:'完美！图象搬运者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
