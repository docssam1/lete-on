/* Numbers of Magic — 유닛 M-76: 일차함수의 활용 (중등 교과 연산 4차 2026-09-21)
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-76'] = {
  id:'M-76', tier:'middle2', level:'34', order:14,
  generator:'md76_lineApply',
  title:{ ko:'일차함수의 활용', en:'Linear Functions in Use', zh:'一次函数的应用' },
  subtitle:{ ko:'처음 값이 절편, 한 칸마다 변하는 양이 기울기예요', en:'The starting value is the intercept, the change per step is the slope', zh:'起始值是截距，每一步的变化量是斜率' },
  icon:'💧',

  practice:{
    generator:'md76_lineApply', level:'practice', count:5,
    params:{mode:'water'},
    intro:{ ko:'처음에 있던 양에 "1분에 늘어나는 양 × 시간"을 더해 보세요!', en:'Take what was there to begin with and add the amount gained per minute times the time!', zh:'用最初的量加上"每分钟增加的量×时间"！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'물통에 물이 5L 들어 있고 1분에 3L씩 들어간다면, 10분 뒤에는 35L예요. 여기서 5는 <b>시작한 자리</b>, 3은 <b>1분마다 오르는 양</b>이에요. 그래프로 그리면 5에서 출발해 오른쪽으로 갈수록 3씩 올라가는 직선 — 바로 y절편과 기울기예요. 일차함수는 이런 상황을 통째로 담는 그릇이에요.', en:'A tank holding 5 L gaining 3 L a minute has 35 L after ten minutes. Here 5 is <b>where it started</b> and 3 is <b>how much it climbs each minute</b>. Drawn as a graph it is a line starting at 5 and rising 3 for every step right - the y-intercept and the slope. A linear function is the container for this whole situation.', zh:'水桶里有5L水，每分钟加3L，10分钟后就是35L。这里5是<b>出发的位置</b>，3是<b>每分钟上升的量</b>。画成图象，就是从5出发、向右每格上升3的直线——正是y截距和斜率。一次函数就是装下这整个情形的容器。' },
      history:{ ko:'기울기를 뜻하는 영어 낱말 slope는 원래 비탈이라는 뜻이고, 도로 표지판의 "경사 8%"가 바로 그 기울기예요 — 100m를 가는 동안 8m 오른다는 뜻이거든요. 수학에서 쓰는 기울기와 길에서 보는 경사는 같은 수예요. 기호 a나 m은 그 비탈이 얼마나 가파른지를 수 하나로 적은 것이에요.', en:'The word slope means a hillside, and a road sign reading "8% grade" is exactly that slope - eight metres up for every hundred travelled. The slope in mathematics and the incline on a road are the same number: a single figure for how steep the climb is.', zh:'英文的slope本来就是"坡"的意思，路牌上的"坡度8%"正是这个斜率——每走100米上升8米。数学里的斜率和路上的坡度是同一个数，用一个数字记下爬升有多陡。' }
    },
    stages:[
      { tag:{ ko:'① 늘어나는 상황 — 기울기가 양수', en:'1) Growing - a positive slope', zh:'① 增加的情形——斜率为正' },
        head:{ ko:'y = 3x + 5 \\quad\\Rightarrow\\quad x = 10 \\text{일 때 } y = 35', en:'y = 3x + 5 \\quad\\Rightarrow\\quad y = 35 \\text{ at } x = 10', zh:'y = 3x + 5 \\quad\\Rightarrow\\quad x = 10 \\text{时 } y = 35' },
        desc:{ ko:'처음 5L가 <b>y절편</b>, 1분에 3L가 <b>기울기</b>예요. x는 시간, y는 물의 양이에요. 말에 나온 두 수가 그대로 식의 두 자리로 들어가요.', en:'The 5 L at the start is the <b>y-intercept</b> and the 3 L a minute is the <b>slope</b>, with x the time and y the volume. The two numbers in the sentence drop straight into the two places in the formula.', zh:'最初的5L是<b>y截距</b>，每分钟3L是<b>斜率</b>，x是时间，y是水量。句子里的两个数直接进入式子里的两个位置。' },
        mathSteps:['y = 3x + 5', 'y = 3 \\times 10 + 5', 'y = 35'],
        result:{ ko:'처음 값과 변하는 양, 두 수면 식이 돼요!', en:'The starting value and the rate - two numbers make the formula!', zh:'起始值和变化量，两个数就能写出式子！' },
        book:{ ko:'x가 0일 때가 시작하는 순간이에요. 그래서 y절편이 "처음 값"이 되는 거예요 — 그래프에서 세로축을 뚫는 그 높이가 곧 출발점이에요.', en:'x = 0 is the moment things start, which is why the y-intercept is the starting value - the height at which the graph pierces the vertical axis is where it began.', zh:'x=0就是开始的时刻，所以y截距就是"起始值"——图象穿过纵轴的那个高度就是出发点。' } },

      { tag:{ ko:'② 줄어드는 상황 — 기울기가 음수', en:'2) Shrinking - a negative slope', zh:'② 减少的情形——斜率为负' },
        head:{ ko:'y = 24 - 3x \\quad\\Rightarrow\\quad x = 5 \\text{일 때 } y = 9', en:'y = 24 - 3x \\quad\\Rightarrow\\quad y = 9 \\text{ at } x = 5', zh:'y = 24 - 3x \\quad\\Rightarrow\\quad x = 5 \\text{时 } y = 9' },
        desc:{ ko:'24cm 양초가 1분에 3cm씩 짧아져요. 줄어드니 기울기가 <b>음수</b>예요. 5분 뒤 길이는 24−15=9cm. 다 타는 때는 y=0으로 놓아 8분이라고 구할 수 있어요.', en:'A 24 cm candle loses 3 cm a minute, so the slope is <b>negative</b>. After five minutes it is 24 - 15 = 9 cm, and setting y = 0 tells you it burns out after eight.', zh:'24cm的蜡烛每分钟短3cm，减少所以斜率为<b>负</b>。5分钟后是24−15=9cm。令y=0可求出8分钟烧完。' },
        mathSteps:['y = 24 - 3x', 'y = 24 - 15', 'y = 9'],
        result:{ ko:'줄어들면 기울기가 음수 — 부호가 상황을 말해요!', en:'Shrinking makes the slope negative - the sign tells the story!', zh:'减少时斜率为负——符号说明了情形！' },
        book:{ ko:'현실 문제에서는 x와 y의 <b>범위</b>도 생각해야 해요. 양초 문제에서 x는 0부터 8까지이고, 그 뒤에는 식이 −3을 내놓지만 길이가 음수일 수는 없어요.', en:'Real situations also have a <b>range</b>. Here x runs from 0 to 8; beyond that the formula would give -3, and a length cannot be negative.', zh:'实际问题还要考虑x和y的<b>范围</b>。蜡烛问题里x从0到8，再往后式子会给出−3，可长度不能为负。' } }
    ],
    rule:{ ko:'처음 값은 y절편, 한 단위마다 변하는 양은 기울기 — 늘면 양수, 줄면 음수예요!', en:'The starting value is the y-intercept and the change per unit is the slope - positive when it grows, negative when it shrinks!', zh:'起始值是y截距，每单位的变化量是斜率——增加为正，减少为负！' }
  },

  check:{
    fills:[
      { tex:{ko:'y = 2x + 10 \\quad\\Rightarrow\\quad x = 6 \\text{일 때 } y = \\square',en:'y = 2x + 10 \\quad\\Rightarrow\\quad y = \\square \\text{ at } x = 6',zh:'y = 2x + 10 \\quad\\Rightarrow\\quad x = 6 \\text{时 } y = \\square'}, answer:22,
        hint:{ ko:'2×6+10', en:'2 x 6 + 10', zh:'2×6+10' } },
      { tex:{ko:'y = 20 - 4x \\quad\\Rightarrow\\quad y = 0 \\text{일 때 } x = \\square',en:'y = 20 - 4x \\quad\\Rightarrow\\quad x = \\square \\text{ at } y = 0',zh:'y = 20 - 4x \\quad\\Rightarrow\\quad y = 0 \\text{时 } x = \\square'}, answer:5,
        hint:{ ko:'20÷4', en:'20 / 4', zh:'20÷4' } }
    ],
    open:{ ko:'양초 문제에서 기울기가 왜 음수인지 말해봐요.', en:'Explain why the slope is negative in the candle problem.', zh:'说说蜡烛问题里斜率为什么是负的。' },
    openHint:{ ko:'시간이 갈수록 길이가 줄어들기 때문', en:'Because the length gets smaller as time goes on', zh:'因为随着时间推移长度在减少' }
  },

  lab:{
    generator:'md76_lineApply', level:'main', count:4,
    params:{mode:'candle'},
    intro:{ ko:'줄어드는 상황이에요 — 처음 길이에서 빼 보세요!', en:'This one shrinks - subtract from the starting length!', zh:'这是减少的情形——从最初的长度里减！' }
  },

  arena:{
    generator:'md76_lineApply', level:'main', count:8, timeLimit:360,
    params:{mode:'fee'},
    rule:{ ko:'6분 안에 기본요금(y절편)과 단위요금(기울기)을 찾아 식을 세워요!', en:'Within 6 minutes, find the base fee and the rate, and build the formula!', zh:'6分钟内找出基本费(y截距)和单价(斜率)并列式！' }
  },

  stamp:{ label:{ ko:'변화를 식으로 담는 이', en:'Keeper of Changing Amounts', zh:'把变化写成式子的人' }, coins:54 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, { ko:'처음 값과 변화량을 정확히 짚었구나! 💧', en:'You picked out the start and the rate exactly!', zh:'你准确找出了起始值和变化量！' }, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ { ko:'줄어드는 상황이면 기울기가 음수야!', en:'If it shrinks, the slope is negative!', zh:'如果是减少，斜率就是负的！' }, { ko:'처음에 있던 양이 y절편이야!', en:'What was there at the start is the y-intercept!', zh:'最初就有的量是y截距！' } ],
    finish:{ ko:'완벽해! 변화를 식으로 담는 이! 💧✨', en:'Perfect! Keeper of Changing Amounts!', zh:'完美！把变化写成式子的人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
