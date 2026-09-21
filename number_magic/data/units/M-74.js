/* Numbers of Magic — 유닛 M-74: 일차함수의 그래프와 절편 (중등 교과 연산 4차 2026-09-21)
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-74'] = {
  id:'M-74', tier:'middle2', level:'34', order:11,
  generator:'md74_lineGraph',
  title:{ ko:'일차함수의 그래프와 절편', en:'Graphs & Intercepts of Linear Functions', zh:'一次函数的图象与截距' },
  subtitle:{ ko:'y=ax를 위아래로 옮기면 y=ax+b가 돼요', en:'Slide y=ax up or down and it becomes y=ax+b', zh:'把y=ax上下平移就成了y=ax+b' },
  icon:'📐',

  practice:{
    generator:'md74_lineGraph', level:'practice', count:5,
    params:{mode:'translate'},
    intro:{ ko:'위아래로 옮겨도 기울기는 그대로 — y절편만 그만큼 움직여요!', en:'Sliding up or down leaves the slope alone - only the y-intercept moves!', zh:'上下平移斜率不变——只有y截距移动！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'y=2x의 그래프를 통째로 3칸 위로 밀면 어떻게 될까요? 모든 점이 3만큼 올라가니 y=2x+3이 돼요. 기울기는 <b>하나도 변하지 않아요</b> — 직선을 평행하게 밀었을 뿐이니까요. 그래서 y=2x, y=2x+3, y=2x−5는 모두 서로 평행한 직선이에요. b는 "얼마나 위에서 출발하느냐"만 정해요.', en:'What happens if you push the graph of y=2x three squares up? Every point rises by 3, so it becomes y=2x+3. The slope <b>does not change at all</b> - the line was only slid, not tilted. That is why y=2x, y=2x+3 and y=2x-5 are all parallel: b only decides how high the line starts.', zh:'把y=2x的图象整体向上推3格会怎样？所有点都上升3，于是变成y=2x+3。斜率<b>一点也没变</b>——只是把直线平移了。所以y=2x、y=2x+3、y=2x−5都互相平行：b只决定从多高出发。' },
      history:{ ko:'절편(intercept)은 "가로채다"라는 뜻의 라틴어에서 왔어요. 직선이 축을 가로채는 자리라는 뜻이죠. x절편과 y절편, 이 두 점만 찍으면 자를 대고 직선을 그릴 수 있어서, 그래프를 손으로 그릴 때 가장 빠른 방법으로 쓰여요 — 점을 여러 개 찍어 이을 필요가 없어요.', en:'The word intercept comes from Latin for "to catch between" - the place where the line catches an axis. Mark just the x-intercept and the y-intercept and a ruler finishes the job, which is why it is the quickest way to draw a line by hand: no need to plot point after point.', zh:'截距(intercept)来自拉丁语"截取"的意思，就是直线截住坐标轴的地方。只要标出x截距和y截距两点，用尺子就能画出直线——这是手画图象最快的办法，不必一个个描点。' }
    },
    stages:[
      { tag:{ ko:'① 평행이동 — 기울기는 그대로', en:'1) Translation - the slope stays', zh:'① 平移——斜率不变' },
        head:{ ko:'y = 2x \\quad\\Rightarrow\\quad y = 2x + 3', en:'y = 2x \\quad\\Rightarrow\\quad y = 2x + 3', zh:'y = 2x \\quad\\Rightarrow\\quad y = 2x + 3' },
        desc:{ ko:'3만큼 위로 옮기면 모든 y값이 3씩 커져요. 기울기 2는 <b>그대로</b>고 y절편만 0에서 3으로 바뀌어요. 아래로 옮기면 b가 음수가 돼요.', en:'Slide it 3 up and every y grows by 3. The slope of 2 is <b>unchanged</b>; only the y-intercept moves from 0 to 3. Slide it down and b turns negative.', zh:'向上平移3，所有y值都增加3。斜率2<b>不变</b>，只有y截距从0变成3。向下平移则b为负。' },
        mathSteps:['y = 2x + 3', {ko:'\\text{기울기} = 2',en:'\\text{slope} = 2',zh:'\\text{斜率} = 2'}, {ko:'\\text{y절편} = 3',en:'\\text{y-intercept} = 3',zh:'\\text{y截距} = 3'}],
        result:{ ko:'평행하게 밀 뿐이라 기울기는 안 변해요!', en:'A parallel slide never changes the slope!', zh:'只是平行推移，斜率不会变！' },
        book:{ ko:'기울기가 같은 두 직선은 <b>평행</b>해요(y절편이 다르면 만나지 않아요). 기울기도 y절편도 같으면 아예 같은 직선이에요.', en:'Two lines with the same slope are <b>parallel</b> - with different y-intercepts they never meet. With the same slope and the same intercept they are one and the same line.', zh:'斜率相同的两条直线<b>平行</b>(y截距不同就永不相交)。斜率和y截距都相同，那就是同一条直线。' } },

      { tag:{ ko:'② 두 절편 — 축을 뚫는 자리', en:'2) The two intercepts - where it pierces the axes', zh:'② 两个截距——穿过轴的地方' },
        head:{ ko:'y = 2x - 6 \\quad\\Rightarrow\\quad \\text{x절편} 3, \\; \\text{y절편} -6', en:'y = 2x - 6 \\quad\\Rightarrow\\quad \\text{x-int } 3, \\; \\text{y-int } -6', zh:'y = 2x - 6 \\quad\\Rightarrow\\quad \\text{x截距} 3, \\; \\text{y截距} -6' },
        desc:{ ko:'y절편은 <b>상수항 그대로</b> −6이에요(x=0을 넣으면 바로 나와요). x절편은 y=0을 넣어 2x−6=0을 풀어 x=3. y절편은 눈에 보이고 x절편은 한 번 풀어야 나와요.', en:'The y-intercept is <b>just the constant</b>, -6, which you get by putting x=0. For the x-intercept put y=0 and solve 2x-6=0 to get 3. One is visible at a glance; the other takes a step.', zh:'y截距<b>就是常数项</b>−6(代入x=0立刻得到)。x截距要令y=0解2x−6=0得x=3。一个一眼可见，另一个要解一步。' },
        mathSteps:['y = 0 \\quad\\Rightarrow\\quad 2x - 6 = 0', 'x = 3', 'x = 0 \\quad\\Rightarrow\\quad y = -6'],
        result:{ ko:'두 점만 찍으면 직선을 그릴 수 있어요!', en:'Two points are all you need to draw the line!', zh:'只要两点就能画出直线！' },
        book:{ ko:'기울기가 양수면 x절편과 y절편의 부호가 <b>서로 반대</b>예요(원점을 지나지 않는 한). 그래프를 그려 보면 왜 그런지 바로 보여요.', en:'With a positive slope the two intercepts have <b>opposite signs</b>, unless the line goes through the origin. Sketch it once and you can see why.', zh:'斜率为正时两个截距<b>符号相反</b>(除非直线过原点)。画一次图就明白为什么了。' } }
    ],
    rule:{ ko:'평행이동은 기울기를 바꾸지 않아요 — y절편은 상수항 그대로, x절편은 y=0으로 놓아 구해요!', en:'A translation never changes the slope - the y-intercept is the constant term, and the x-intercept comes from setting y=0!', zh:'平移不改变斜率——y截距就是常数项，x截距令y=0求出！' }
  },

  check:{
    fills:[
      { tex:{ko:'y = 3x - 12 \\quad\\Rightarrow\\quad \\text{x절편} = \\square',en:'y = 3x - 12 \\quad\\Rightarrow\\quad \\text{x-intercept} = \\square',zh:'y = 3x - 12 \\quad\\Rightarrow\\quad \\text{x截距} = \\square'}, answer:4,
        hint:{ ko:'3x=12', en:'3x = 12', zh:'3x=12' } },
      { tex:{ko:'y = -2x + 7 \\quad\\Rightarrow\\quad \\text{y절편} = \\square',en:'y = -2x + 7 \\quad\\Rightarrow\\quad \\text{y-intercept} = \\square',zh:'y = -2x + 7 \\quad\\Rightarrow\\quad \\text{y截距} = \\square'}, answer:7,
        hint:{ ko:'상수항 그대로', en:'Just the constant term', zh:'就是常数项' } }
    ],
    open:{ ko:'y=2x와 y=2x+5가 왜 평행한지 말해봐요.', en:'Explain why y=2x and y=2x+5 are parallel.', zh:'说说y=2x和y=2x+5为什么平行。' },
    openHint:{ ko:'기울기가 같아 방향이 같고, y절편만 달라 만나지 않아서', en:'Same slope means same direction, and different intercepts mean they never meet', zh:'斜率相同方向就相同，只有y截距不同所以不相交' }
  },

  lab:{
    generator:'md74_lineGraph', level:'main', count:4,
    params:{mode:'intercepts'},
    intro:{ ko:'y=0을 넣어 x절편을, x=0을 넣어 y절편을 구해 보세요!', en:'Put y=0 for the x-intercept and x=0 for the y-intercept!', zh:'令y=0求x截距，令x=0求y截距！' }
  },

  arena:{
    generator:'md74_lineGraph', level:'main', count:8, timeLimit:360,
    params:{mode:'readIntercepts'},
    rule:{ ko:'6분 안에 그래프가 두 축을 뚫는 자리를 읽어요!', en:'Within 6 minutes, read where the line pierces both axes!', zh:'6分钟内读出直线穿过两轴的位置！' }
  },

  stamp:{ label:{ ko:'절편의 측량사', en:'Surveyor of Intercepts', zh:'截距测量师' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, { ko:'두 절편을 정확히 찾았구나! 📐', en:'You found both intercepts exactly!', zh:'你准确找到了两个截距！' }, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ { ko:'x절편은 y에 0을 넣어 구해!', en:'For the x-intercept, put y=0!', zh:'x截距要令y=0来求！' }, { ko:'평행이동해도 기울기는 그대로야!', en:'A translation leaves the slope alone!', zh:'平移之后斜率不变！' } ],
    finish:{ ko:'완벽해! 절편의 측량사! 📐✨', en:'Perfect! Surveyor of Intercepts!', zh:'完美！截距测量师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
