/* Numbers of Magic — 유닛 M-74: 일차함수의 그래프와 절편 (중등 교과 연산 4차 2026-09-21)
   2026-09-21 다시 씀 — 원장 "개념도 없이 그리고 이동한다고 어떻게 풀이를 해. 일차함수 그래프
   그리려면 두 점을 찾는 것부터 하고 대입하거나 기울기를 구하고 대입하기 이렇게 해야지".
   전 판은 ①평행이동 ②절편 이었다 — 그래프를 어떻게 그리는지가 없었다. 단원테스트 해설의
   절차대로 ①두 점 대입 ②두 절편 ③기울기로 둘째 점, 평행이동은 규칙 끝에 성질로만.
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-74'] = {
  id:'M-74', tier:'middle2', level:'34', order:11,
  generator:'md74_lineGraph',
  title:{ ko:'일차함수의 그래프와 절편', en:'Graphs & Intercepts of Linear Functions', zh:'一次函数的图象与截距' },
  subtitle:{ ko:'두 점만 찾으면 직선은 그려집니다 — x에 대입하거나, 절편을 구하거나', en:'Two points draw the line - substitute for x, or find the intercepts', zh:'找到两个点就能画出直线——代入x，或者求截距' },
  icon:'📐',

  practice:{
    generator:'md74_lineGraph', level:'practice', count:5,
    params:{mode:'twoPoints'},
    intro:{ ko:'x에 수를 넣어 y를 구하면 점 하나 — 두 번 하면 두 점입니다!', en:'Put a number in for x and work out y - one point. Do it twice and you have two!', zh:'把一个数代入x求出y就是一个点——做两次就有两个点！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'y=2x+1의 그래프를 그려 볼까요? 직선은 두 점만 있으면 하나로 정해집니다. x=1을 넣으면 y=3, x=2를 넣으면 y=5 — 점 (1,3)과 (2,5)가 나왔습니다. 이 둘을 찍고 자를 대고 이으면 끝입니다. 점을 몇 개 더 찍어 봐도 전부 그 직선 위에 있습니다.', en:'Shall we draw y=2x+1? A straight line is fixed by just two points. Put x=1 and y=3; put x=2 and y=5 - the points (1,3) and (2,5). Plot them, lay a ruler across, done. Plot a few more if you like: every one lands on that same line.', zh:'来画y=2x+1的图象吧？直线只要两个点就能确定。代入x=1得y=3，代入x=2得y=5——得到点(1,3)和(2,5)。描出这两点，用尺子连起来就完成了。再多描几个点，全都落在这条直线上。' },
      history:{ ko:'절편(intercept)은 "가로채다"라는 뜻의 라틴어에서 왔습니다. 직선이 축을 가로채는 자리라는 뜻이죠. x절편과 y절편도 두 점이라, 이 둘을 찍으면 자로 직선을 그릴 수 있습니다 — 그래서 손으로 그릴 때 가장 빠른 방법으로 쓰입니다.', en:'The word intercept comes from Latin for "to catch between" - the place where the line catches an axis. The x-intercept and y-intercept are two points too, so plotting them and using a ruler is the quickest way to draw a line by hand.', zh:'截距(intercept)来自拉丁语"截取"的意思，就是直线截住坐标轴的地方。x截距和y截距也是两个点，标出它们用尺子就能画出直线——所以这是手画图象最快的办法。' }
    },
    stages:[
      { tag:{ ko:'① 두 점 찾기 — x에 대입', en:'1) Two points - substitute for x', zh:'① 找两个点——代入x' },
        head:{ ko:'y = 2x + 1 \\quad\\Rightarrow\\quad (1,\\, 3), \\quad (2,\\, 5)', en:'y = 2x + 1 \\quad\\Rightarrow\\quad (1,\\, 3), \\quad (2,\\, 5)', zh:'y = 2x + 1 \\quad\\Rightarrow\\quad (1,\\, 3), \\quad (2,\\, 5)' },
        desc:{ ko:'x=1을 넣으면 y=2×1+1=3, x=2를 넣으면 y=2×2+1=5입니다. 점 (1,3)과 (2,5)를 찍고 <b>자로 이으면</b> 그래프입니다. x에 어떤 수를 넣어도 되지만 계산이 쉬운 작은 정수가 좋습니다.', en:'Put x=1 and y=2×1+1=3; put x=2 and y=2×2+1=5. Plot (1,3) and (2,5) and <b>join them with a ruler</b>. Any x will do, but small integers keep the arithmetic easy.', zh:'代入x=1得y=2×1+1=3，代入x=2得y=2×2+1=5。描出(1,3)和(2,5)，<b>用尺子连起来</b>就是图象。x代什么都行，但小整数算起来最方便。' },
        mathSteps:['x = 1 \\quad\\Rightarrow\\quad y = 2 \\times 1 + 1 = 3', 'x = 2 \\quad\\Rightarrow\\quad y = 2 \\times 2 + 1 = 5', '(1,\\, 3), \\quad (2,\\, 5)'],
        result:{ ko:'두 점을 찍고 이으면 직선 완성!', en:'Plot the two points, join them - line done!', zh:'描两点、连一线，直线完成！' },
        book:{ ko:'직선은 두 점으로 하나가 정해집니다. 세 번째 점을 넣어 보면 <b>검산</b>이 됩니다 — 그 점이 직선 위에 없으면 앞의 계산이 틀린 거입니다.', en:'Two points fix one straight line. A third point is a <b>check</b>: if it misses the line, an earlier calculation was wrong.', zh:'两点确定一条直线。再代第三个点就是<b>检验</b>——如果它不在直线上，说明前面算错了。' } },

      { tag:{ ko:'② 두 절편 — 축을 뚫는 두 점', en:'2) The two intercepts - two points on the axes', zh:'② 两个截距——在坐标轴上的两个点' },
        head:{ ko:'y = 2x - 6 \\quad\\Rightarrow\\quad (3,\\, 0), \\quad (0,\\, -6)', en:'y = 2x - 6 \\quad\\Rightarrow\\quad (3,\\, 0), \\quad (0,\\, -6)', zh:'y = 2x - 6 \\quad\\Rightarrow\\quad (3,\\, 0), \\quad (0,\\, -6)' },
        desc:{ ko:'y=0을 넣으면 2x−6=0에서 x=3 — x절편입니다. x=0을 넣으면 y=−6 — y절편입니다. 이 둘도 <b>두 점</b>이라 (3,0)과 (0,−6)을 찍고 이으면 같은 직선이 나옵니다. y절편은 상수항 그대로라 바로 보이고, x절편은 한 번 풀어야 나옵니다.', en:'Put y=0: 2x−6=0 gives x=3, the x-intercept. Put x=0: y=−6, the y-intercept. These are <b>two points</b> as well - plot (3,0) and (0,−6) and the same line appears. The y-intercept is just the constant; the x-intercept takes one step of solving.', zh:'令y=0，由2x−6=0得x=3——这是x截距。令x=0得y=−6——这是y截距。它们也是<b>两个点</b>，描出(3,0)和(0,−6)连起来就是同一条直线。y截距就是常数项，一眼可见；x截距要解一步。' },
        mathSteps:['y = 0 \\quad\\Rightarrow\\quad 2x - 6 = 0, \\quad x = 3', 'x = 0 \\quad\\Rightarrow\\quad y = -6', '(3,\\, 0), \\quad (0,\\, -6)'],
        result:{ ko:'절편 두 개도 두 점이라 그래프가 그려집니다!', en:'Two intercepts are two points - the graph is drawn!', zh:'两个截距也是两个点，图象就画出来了！' },
        book:{ ko:'기울기가 양수면 x절편과 y절편의 부호가 <b>서로 반대</b>입니다(원점을 지나지 않는 한). 그래프를 그려 보면 왜 그런지 바로 보입니다.', en:'With a positive slope the two intercepts have <b>opposite signs</b>, unless the line goes through the origin. Sketch it once and you can see why.', zh:'斜率为正时两个截距<b>符号相反</b>(除非直线过原点)。画一次图就明白为什么了。' } },

      { tag:{ ko:'③ 기울기로 두 번째 점', en:'3) The slope gives the second point', zh:'③ 用斜率找第二个点' },
        head:{ ko:'y = 3x - 2 \\quad\\Rightarrow\\quad (0,\\, -2), \\quad (1,\\, 1)', en:'y = 3x - 2 \\quad\\Rightarrow\\quad (0,\\, -2), \\quad (1,\\, 1)', zh:'y = 3x - 2 \\quad\\Rightarrow\\quad (0,\\, -2), \\quad (1,\\, 1)' },
        desc:{ ko:'y절편 (0,−2)를 먼저 찍습니다. 기울기 3은 "오른쪽으로 1칸 갈 때 위로 3칸"이니 (0,−2)에서 오른쪽 1, 위 3 간 곳 (1,1)이 두 번째 점입니다. 기울기가 음수면 아래로 내려갑니다.', en:'Plot the y-intercept (0,−2) first. A slope of 3 means "up 3 for every 1 to the right", so from (0,−2) go right 1 and up 3 to (1,1) - the second point. A negative slope goes down instead.', zh:'先描出y截距(0,−2)。斜率3的意思是"向右1格向上3格"，所以从(0,−2)向右1、向上3到(1,1)，就是第二个点。斜率为负就向下走。' },
        mathSteps:['x = 0 \\quad\\Rightarrow\\quad y = -2', {ko:'\\text{오른쪽 1, 위로 3} \\quad\\Rightarrow\\quad (1,\\, -2 + 3) = (1,\\, 1)',en:'\\text{right 1, up 3} \\quad\\Rightarrow\\quad (1,\\, -2 + 3) = (1,\\, 1)',zh:'\\text{右1，上3} \\quad\\Rightarrow\\quad (1,\\, -2 + 3) = (1,\\, 1)'}, '(0,\\, -2), \\quad (1,\\, 1)'],
        result:{ ko:'y절편에서 기울기만큼 한 걸음 — 두 번째 점!', en:'One slope-step from the y-intercept - the second point!', zh:'从y截距按斜率走一步——第二个点！' },
        book:{ ko:'y=ax+b의 그래프는 y=ax의 그래프를 y축의 방향으로 b만큼 <b>평행이동</b>한 거입니다. 기울기가 같으니 평행하고, b는 얼마나 위에서 출발하느냐만 정합니다 — 그리는 방법이 아니라 그린 뒤에 보이는 성질입니다.', en:'The graph of y=ax+b is the graph of y=ax <b>translated</b> b along the y-axis. Same slope means parallel; b only sets how high the line starts - a property you notice after drawing, not a way to draw.', zh:'y=ax+b的图象是把y=ax的图象沿y轴方向<b>平移</b>b得到的。斜率相同所以平行，b只决定从多高出发——这是画完之后看到的性质，不是画法。' } }
    ],
    rule:{ ko:'직선은 두 점이면 그려집니다 — x에 대입해서 두 점, 또는 y=0·x=0으로 두 절편, 또는 y절편에서 기울기만큼 한 걸음!', en:'Two points draw the line - substitute two values of x, or take the two intercepts (y=0, x=0), or step from the y-intercept by the slope!', zh:'两个点就能画直线——代入两个x值，或者用y=0、x=0求两个截距，或者从y截距按斜率走一步！' }
  },

  check:{
    fills:[
      { tex:{ko:'y = 3x - 1, \\quad x = 2 \\quad\\Rightarrow\\quad y = \\square',en:'y = 3x - 1, \\quad x = 2 \\quad\\Rightarrow\\quad y = \\square',zh:'y = 3x - 1, \\quad x = 2 \\quad\\Rightarrow\\quad y = \\square'}, answer:5,
        hint:{ ko:'3×2−1', en:'3×2−1', zh:'3×2−1' } },
      { tex:{ko:'y = 3x - 12 \\quad\\Rightarrow\\quad \\text{x절편} = \\square',en:'y = 3x - 12 \\quad\\Rightarrow\\quad \\text{x-intercept} = \\square',zh:'y = 3x - 12 \\quad\\Rightarrow\\quad \\text{x截距} = \\square'}, answer:4,
        hint:{ ko:'y=0을 넣어 3x=12', en:'Put y=0: 3x = 12', zh:'令y=0得3x=12' } }
    ],
    open:{ ko:'y=2x+3의 그래프를 그리려면 어떤 두 점을 찾으면 되는지 말해봅니다.', en:'Which two points would you find to draw y=2x+3?', zh:'说说画y=2x+3的图象要找哪两个点。' },
    openHint:{ ko:'x=0이면 (0,3), x=1이면 (1,5) — 아무 x 두 개면 됩니다. 절편 (0,3)과 (−1.5,0)도 좋습니다', en:'x=0 gives (0,3), x=1 gives (1,5) - any two x values work. The intercepts (0,3) and (-1.5,0) do too', zh:'x=0得(0,3)，x=1得(1,5)——任意两个x都行。截距(0,3)和(−1.5,0)也可以' }
  },

  lab:{
    generator:'md74_lineGraph', level:'main', count:4,
    params:{mode:'intercepts'},
    intro:{ ko:'y=0을 넣어 x절편을, x=0을 넣어 y절편을 구해 보세요 — 이 둘이 두 점입니다!', en:'Put y=0 for the x-intercept and x=0 for the y-intercept - those are your two points!', zh:'令y=0求x截距，令x=0求y截距——这就是两个点！' }
  },

  arena:{
    generator:'md74_lineGraph', level:'main', count:8, timeLimit:360,
    params:{mode:'readIntercepts'},
    rule:{ ko:'6분 안에 그래프가 두 축을 뚫는 자리를 읽습니다!', en:'Within 6 minutes, read where the line pierces both axes!', zh:'6分钟内读出直线穿过两轴的位置！' }
  },

  stamp:{ label:{ ko:'두 점의 제도사', en:'Draftsman of Two Points', zh:'两点绘图师' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, { ko:'두 점을 정확히 찾았구나! 📐', en:'You found both points exactly!', zh:'你准确找到了两个点！' }, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ { ko:'x에 수를 넣어 y를 구해 봐 — 그게 점 하나야!', en:'Put the number in for x and work out y - that is one point!', zh:'把数代入x求出y——那就是一个点！' }, { ko:'x절편은 y에 0을 넣어 구해!', en:'For the x-intercept, put y=0!', zh:'x截距要令y=0来求！' } ],
    finish:{ ko:'완벽해! 두 점의 제도사! 📐✨', en:'Perfect! Draftsman of Two Points!', zh:'完美！两点绘图师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
