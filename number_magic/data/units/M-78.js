/* Numbers of Magic — 유닛 M-78: 이차함수 y=ax²의 그래프 (중등 교과 연산 4차 2026-09-21)
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-78'] = {
  id:'M-78', tier:'middle3', level:'37', order:9,
  generator:'md78_quadBasic',
  title:{ ko:'이차함수 y=ax²의 그래프', en:'The Graph of y=ax²', zh:'二次函数y=ax²的图象' },
  subtitle:{ ko:'가장 단순한 포물선, 꼭짓점이 원점이에요', en:'The simplest parabola, with its vertex at the origin', zh:'最简单的抛物线，顶点在原点' },
  icon:'🥣',

  practice:{
    generator:'md78_quadBasic', level:'practice', count:5,
    params:{mode:'value'},
    intro:{ ko:'x를 먼저 제곱한 다음 a를 곱해 보세요 — 제곱하면 음수도 양수가 돼요!', en:'Square x first, then multiply by a - squaring turns a negative positive!', zh:'先把x平方，再乘以a——平方后负数也变正！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'y=x²의 표를 만들어 보면 x가 −3, −2, −1, 0, 1, 2, 3일 때 y는 9, 4, 1, 0, 1, 4, 9예요. <b>−3과 3이 같은 y를 줘요</b> — 제곱하면 부호가 사라지니까요. 그래서 그래프가 y축을 거울 삼아 좌우가 똑같고, 가장 낮은 곳이 원점 하나예요. 일차함수가 곧은 직선이었던 것과 달리, 제곱 하나가 들어오자 그림이 휘어요.', en:'Tabulate y=x2 and for x = -3, -2, -1, 0, 1, 2, 3 you get y = 9, 4, 1, 0, 1, 4, 9. <b>-3 and 3 give the same y</b>, because squaring throws the sign away. So the graph mirrors itself across the y-axis and has a single lowest point at the origin. Where a linear function drew a straight line, one square bends the picture.', zh:'列出y=x²的表：x为−3、−2、−1、0、1、2、3时，y是9、4、1、0、1、4、9。<b>−3和3给出相同的y</b>，因为平方把符号丢掉了。所以图象以y轴为镜左右相同，最低点只有原点一个。一次函数画的是直线，加了一个平方，图就弯了。' },
      history:{ ko:'포물선(parabola)이라는 이름은 기원전 3세기 아폴로니오스가 붙였어요. 원뿔을 비스듬히 자른 단면 가운데 하나였죠. 순수한 기하학 놀이처럼 보였던 이 곡선이, 1900년 뒤 갈릴레이가 던진 물체의 길이 바로 그 곡선임을 밝히면서 세상을 설명하는 도구가 됐어요.', en:'The name parabola was given by Apollonius in the third century BCE, for one of the curves you get by slicing a cone at a slant. What looked like pure geometry became a tool for describing the world nineteen centuries later, when Galileo showed that a thrown object traces exactly that curve.', zh:'抛物线(parabola)这个名字是公元前3世纪阿波罗尼奥斯起的，是斜切圆锥得到的曲线之一。这条看似纯几何游戏的曲线，1900年后被伽利略证明正是抛出物体的轨迹，从此成了解释世界的工具。' }
    },
    stages:[
      { tag:{ ko:'① 제곱하고 a를 곱한다', en:'1) Square it, then multiply by a', zh:'① 先平方，再乘以a' },
        head:{ ko:'y = 2x^2 \\quad\\Rightarrow\\quad x = -3 \\text{일 때 } y = 18', en:'y = 2x^2 \\quad\\Rightarrow\\quad y = 18 \\text{ at } x = -3', zh:'y = 2x^2 \\quad\\Rightarrow\\quad x = -3 \\text{时 } y = 18' },
        desc:{ ko:'순서가 중요해요 — <b>제곱이 먼저</b>고 a를 곱하는 것이 나중이에요. (−3)²=9, 그다음 2×9=18이에요. 2×(−3)을 먼저 하면 −6, 제곱해서 36이 되어 틀려요.', en:'Order matters: <b>square first</b>, multiply by a second. (-3)2 = 9, then 2x9 = 18. Doing 2x(-3) first gives -6, and squaring that gives 36 - wrong.', zh:'顺序很重要——<b>先平方</b>，再乘以a。(−3)²=9，然后2×9=18。若先算2×(−3)得−6，再平方就成了36，错了。' },
        mathSteps:['(-3)^2 = 9', '2 \\times 9 = 18'],
        result:{ ko:'−3과 3이 같은 값을 줘요 — 그래서 좌우가 똑같아요!', en:'-3 and 3 give the same value - hence the mirror symmetry!', zh:'−3和3给出相同的值——所以左右对称！' },
        book:{ ko:'a가 양수면 <b>아래로 볼록</b>(위로 열림)하고 원점이 가장 낮은 점, 음수면 <b>위로 볼록</b>하고 원점이 가장 높은 점이에요. a의 절댓값이 클수록 폭이 좁아져 가팔라요.', en:'A positive a opens <b>upward</b> with the origin as the lowest point; a negative a opens <b>downward</b> with the origin highest. The bigger the size of a, the narrower and steeper the curve.', zh:'a为正时<b>开口向上</b>，原点是最低点；a为负时<b>开口向下</b>，原点是最高点。|a|越大开口越窄、越陡。' } },

      { tag:{ ko:'② 지나는 점 하나로 a를 구한다', en:'2) One point gives a', zh:'② 用一个点求出a' },
        head:{ ko:'\\left(2,\\, 8\\right) \\text{를 지남} \\quad\\Rightarrow\\quad a = 2', en:'\\text{through } \\left(2,\\, 8\\right) \\quad\\Rightarrow\\quad a = 2', zh:'\\text{过} \\left(2,\\, 8\\right) \\quad\\Rightarrow\\quad a = 2' },
        desc:{ ko:'그래프가 그 점을 지난다는 것은 좌표를 넣으면 <b>등식이 성립한다</b>는 뜻이에요. 8=a×2²이니 8=4a, a=2. y를 x의 제곱으로 나누면 되는 셈이에요.', en:'A graph passing through a point means its coordinates <b>satisfy the formula</b>: 8 = a x 22 gives 8 = 4a and a = 2. In short, divide y by x squared.', zh:'图象经过某点，就是说坐标代入后<b>等式成立</b>：8=a×2²得8=4a，a=2。也就是用y除以x的平方。' },
        mathSteps:['8 = a \\times 2^2', '8 = 4a', 'a = 2'],
        result:{ ko:'꼭짓점을 알고 점 하나를 더 알면 식이 정해져요!', en:'The vertex plus one more point fixes the formula!', zh:'知道顶点再加一个点，式子就定了！' },
        book:{ ko:'y=ax²는 <b>꼭짓점이 원점이라는 것이 이미 정해져</b> 있어서 모르는 것이 a 하나뿐이에요. 그래서 점 하나면 충분해요 — 꼭짓점이 원점이 아니면 점이 더 필요해요.', en:'In y=ax2 the vertex is <b>already known to be the origin</b>, so a is the only unknown and one point suffices. Move the vertex elsewhere and you need more points.', zh:'y=ax²中<b>顶点已经确定在原点</b>，未知的只有a，所以一个点就够了。顶点不在原点时就需要更多的点。' } }
    ],
    rule:{ ko:'제곱이 먼저, a를 곱하는 것이 나중 — a의 부호가 볼록한 방향을, 크기가 폭을 정해요!', en:'Square first and multiply by a second - the sign of a decides which way it opens and the size decides how narrow it is!', zh:'先平方再乘a——a的符号决定开口方向，大小决定宽窄！' }
  },

  check:{
    fills:[
      { tex:{ko:'y = 3x^2 \\quad\\Rightarrow\\quad x = -2 \\text{일 때 } y = \\square',en:'y = 3x^2 \\quad\\Rightarrow\\quad y = \\square \\text{ at } x = -2',zh:'y = 3x^2 \\quad\\Rightarrow\\quad x = -2 \\text{时 } y = \\square'}, answer:12,
        hint:{ ko:'(−2)²=4, 3×4', en:'(-2)2 = 4, then 3 x 4', zh:'(−2)²=4，3×4' } },
      { tex:{ko:'y = ax^2 \\text{가} \\left(3,\\, 18\\right) \\text{를 지남} \\quad\\Rightarrow\\quad a = \\square',en:'y = ax^2 \\text{ through } \\left(3,\\, 18\\right) \\quad\\Rightarrow\\quad a = \\square',zh:'y = ax^2 \\text{过} \\left(3,\\, 18\\right) \\quad\\Rightarrow\\quad a = \\square'}, answer:2,
        hint:{ ko:'18÷9', en:'18 / 9', zh:'18÷9' } }
    ],
    open:{ ko:'y=x²의 그래프가 왜 y축에 대해 좌우가 똑같은지 말해봐요.', en:'Explain why the graph of y=x2 is symmetric about the y-axis.', zh:'说说y=x²的图象为什么关于y轴对称。' },
    openHint:{ ko:'x와 −x를 제곱하면 값이 같아서', en:'Because x and -x square to the same value', zh:'因为x和−x的平方相同' }
  },

  lab:{
    generator:'md78_quadBasic', level:'main', count:4,
    params:{mode:'findA'},
    intro:{ ko:'y를 x의 제곱으로 나누면 a가 나와요!', en:'Divide y by x squared to get a!', zh:'用y除以x的平方就得到a！' }
  },

  arena:{
    generator:'md78_quadBasic', level:'main', count:8, timeLimit:360,
    params:{mode:'readA'},
    rule:{ ko:'6분 안에 그래프에서 지나는 점을 읽어 a를 구해요!', en:'Within 6 minutes, read a point off the graph and work out a!', zh:'6分钟内从图象上读出一个点并求出a！' }
  },

  stamp:{ label:{ ko:'포물선의 첫걸음', en:'First Step on the Parabola', zh:'抛物线的第一步' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, { ko:'제곱 먼저, 곱하기 나중 — 순서를 지켰구나! 🥣', en:'Square first, multiply second - you kept the order!', zh:'先平方后相乘——顺序你守住了！' }, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ { ko:'제곱을 먼저 해야 해! a를 먼저 곱하면 안 돼.', en:'Square first - do not multiply by a before squaring!', zh:'要先平方！不能先乘a。' }, { ko:'a는 y를 x의 제곱으로 나눈 값이야!', en:'a is y divided by x squared!', zh:'a是y除以x的平方！' } ],
    finish:{ ko:'완벽해! 포물선의 첫걸음! 🥣✨', en:'Perfect! First Step on the Parabola!', zh:'完美！抛物线的第一步！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
