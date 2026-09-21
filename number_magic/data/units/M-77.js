/* Numbers of Magic — 유닛 M-77: 이차방정식의 활용 (중등 교과 연산 4차 2026-09-21)
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-77'] = {
  id:'M-77', tier:'middle3', level:'36', order:8,
  generator:'md77_quadApply',
  title:{ ko:'이차방정식의 활용', en:'Quadratic Equations in Use', zh:'一元二次方程的应用' },
  subtitle:{ ko:'두 양을 곱하는 상황에서 이차방정식이 나와요', en:'Multiply two quantities and a quadratic appears', zh:'两个量相乘的情形就会出现二次方程' },
  icon:'🏹',

  practice:{
    generator:'md77_quadApply', level:'practice', count:5,
    params:{mode:'consecutive'},
    intro:{ ko:'작은 수를 x로 놓으면 다음 수는 x+1이에요 — 곱이 주어졌으니 이차방정식이 돼요!', en:'Let the smaller number be x and the next is x+1 - a given product makes it a quadratic!', zh:'设较小的数为x，下一个就是x+1——已知乘积就成了二次方程！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'넓이가 40cm²이고 가로가 세로보다 3cm 긴 직사각형이 있어요. 세로를 x로 놓으면 가로는 x+3이고, 넓이는 x(x+3)=40이에요. 이렇게 <b>두 양을 곱하는</b> 순간 x²이 생겨요. 풀면 x=5와 x=−8이 나오는데, 길이가 음수일 수는 없으니 답은 5cm 하나예요.', en:'A rectangle has an area of 40 cm2 and is 3 cm wider than it is tall. Call the height x and the width is x+3, so the area is x(x+3) = 40. The moment <b>two quantities multiply</b>, an x2 appears. Solving gives x = 5 and x = -8, and since a length cannot be negative, only 5 cm survives.', zh:'有一个面积40cm²、长比宽多3cm的长方形。设宽为x，长就是x+3，面积是x(x+3)=40。<b>两个量相乘</b>的瞬间就出现了x²。解得x=5和x=−8，长度不能为负，所以答案只有5cm。' },
      history:{ ko:'4000년 전 바빌로니아 점토판에도 이런 문제가 있어요 — "넓이와 변의 차가 주어졌을 때 변을 구하라". 그때는 음수를 수로 치지 않아 답이 늘 하나뿐이었고, 문제도 양수가 나오도록 만들어져 있었어요. 두 근을 모두 인정하게 된 것은 훨씬 나중이고, 우리가 "말이 되는 근만 고르는" 일은 그 옛 방식이 남긴 습관인 셈이에요.', en:'Clay tablets from four thousand years ago pose the same kind of question: given the area and the difference of the sides, find a side. Negatives were not counted as numbers then, so every problem had a single answer and was built to come out positive. Accepting both roots came much later, and our habit of keeping only the sensible root is what remains of that older way.', zh:'4000年前的巴比伦泥板上就有这类题："已知面积和边的差，求边长"。那时负数不算数，所以每题只有一个答案，题目也设计成得正数。承认两个根是很久以后的事，而我们"只取说得通的根"这个习惯，正是那种老办法留下的。' }
    },
    stages:[
      { tag:{ ko:'① 넓이 — 한 변을 x로', en:'1) Area - call one side x', zh:'① 面积——把一边设为x' },
        head:{ ko:'x(x + 3) = 40 \\quad\\Rightarrow\\quad x = 5', en:'x(x + 3) = 40 \\quad\\Rightarrow\\quad x = 5', zh:'x(x + 3) = 40 \\quad\\Rightarrow\\quad x = 5' },
        desc:{ ko:'세로를 x로 놓으면 가로는 x+3이에요. 전개해 x²+3x−40=0, 인수분해하면 (x−5)(x+8)=0이라 x=5 또는 −8인데 <b>길이는 음수가 될 수 없으니</b> 5cm예요.', en:'With the height as x the width is x+3. Expanding gives x2+3x-40 = 0, which factors to (x-5)(x+8) = 0, so x is 5 or -8 - and since <b>a length cannot be negative</b>, it is 5 cm.', zh:'设宽为x，长就是x+3。展开得x²+3x−40=0，因式分解为(x−5)(x+8)=0，x=5或−8——<b>长度不能为负</b>，所以是5cm。' },
        mathSteps:['x^2 + 3x - 40 = 0', '(x - 5)(x + 8) = 0', 'x = 5'],
        result:{ ko:'근이 둘 나와도 답이 둘은 아니에요!', en:'Two roots do not always mean two answers!', zh:'得出两个根，不代表有两个答案！' },
        book:{ ko:'일차방정식과 달라지는 자리가 바로 여기예요. 이차방정식은 근이 둘이므로 <b>어느 쪽이 상황에 맞는지</b> 반드시 따져야 해요 — 길이·개수·시간은 음수가 될 수 없어요.', en:'This is where quadratics differ from linear equations: two roots come out, so you must ask <b>which one fits the situation</b>. Lengths, counts and times cannot be negative.', zh:'这正是和一次方程不同的地方：二次方程有两个根，必须判断<b>哪一个符合情境</b>——长度、个数、时间都不能为负。' } },

      { tag:{ ko:'② 쏘아 올린 물체 — 높이가 0이 되는 때', en:'2) A thrown object - when the height is zero', zh:'② 抛出的物体——高度为0的时刻' },
        head:{ ko:'30t - 5t^2 = 0 \\quad\\Rightarrow\\quad t = 6', en:'30t - 5t^2 = 0 \\quad\\Rightarrow\\quad t = 6', zh:'30t - 5t^2 = 0 \\quad\\Rightarrow\\quad t = 6' },
        desc:{ ko:'높이가 0인 순간이 땅에 있는 때예요. t(30−5t)=0이니 t=0 또는 6인데, t=0은 <b>쏘아 올린 순간</b>이라 답이 아니에요. 다시 떨어지는 때는 6초 뒤예요.', en:'Height zero means it is on the ground. From t(30-5t) = 0 we get t = 0 or 6, but t = 0 is <b>the moment of launch</b>, so the landing is at 6 seconds.', zh:'高度为0就是在地面上。由t(30−5t)=0得t=0或6，而t=0是<b>抛出的瞬间</b>，所以落地是6秒后。' },
        mathSteps:['t(30 - 5t) = 0', 't = 0 \\;\\text{or}\\; t = 6', 't = 6'],
        result:{ ko:'버리는 근에도 뜻이 있어요 — 출발한 순간이에요!', en:'Even the discarded root means something - it is the launch!', zh:'被舍去的根也有含义——那是出发的瞬间！' },
        book:{ ko:'가장 높이 올라간 때는 두 시각의 <b>한가운데</b>예요(여기서는 3초). 포물선이 좌우로 똑같이 생겼기 때문인데, 이것이 이차함수의 대칭축이에요.', en:'The highest point comes <b>halfway</b> between the two times - three seconds here - because the parabola is symmetric. That halfway line is the axis of symmetry of the quadratic.', zh:'最高点在两个时刻的<b>正中间</b>(这里是3秒)，因为抛物线左右对称。这条中线就是二次函数的对称轴。' } }
    ],
    rule:{ ko:'두 양을 곱하면 이차방정식 — 근이 둘 나오면 상황에 맞는 쪽만 답이에요!', en:'Multiplying two quantities gives a quadratic - and of the two roots, only the one that fits the situation is the answer!', zh:'两个量相乘就是二次方程——得出两个根时，只有符合情境的那个才是答案！' }
  },

  check:{
    fills:[
      { tex:{ko:'x(x + 1) = 42 \\quad\\Rightarrow\\quad \\text{작은 수} = \\square',en:'x(x + 1) = 42 \\quad\\Rightarrow\\quad \\text{smaller number} = \\square',zh:'x(x + 1) = 42 \\quad\\Rightarrow\\quad \\text{较小的数} = \\square'}, answer:6,
        hint:{ ko:'6×7=42', en:'6 x 7 = 42', zh:'6×7=42' } },
      { tex:'20t - 5t^2 = 0 \\quad\\Rightarrow\\quad t = \\square \\;(t \\ne 0)', answer:4,
        hint:{ ko:'20÷5', en:'20 / 5', zh:'20÷5' } }
    ],
    open:{ ko:'이차방정식의 근이 둘인데 답이 하나인 까닭을 말해봐요.', en:'Explain why a quadratic has two roots but the problem has one answer.', zh:'说说二次方程有两个根，为什么答案只有一个。' },
    openHint:{ ko:'길이·시간은 음수가 될 수 없어 말이 되는 근만 고르기 때문', en:'Because lengths and times cannot be negative, so only the sensible root counts', zh:'因为长度、时间不能为负，只能取说得通的那个根' }
  },

  lab:{
    generator:'md77_quadApply', level:'main', count:4,
    params:{mode:'area'},
    intro:{ ko:'한 변을 x로 놓고 다른 변을 x로 나타내 보세요!', en:'Let one side be x and write the other in terms of x!', zh:'把一边设为x，另一边也用x表示！' }
  },

  arena:{
    generator:'md77_quadApply', level:'main', count:8, timeLimit:360,
    params:{mode:'projectile'},
    rule:{ ko:'6분 안에 높이가 0이 되는 때를 구하고, 버릴 근을 가려내요!', en:'Within 6 minutes, find when the height is zero and tell which root to discard!', zh:'6分钟内求出高度为0的时刻，并分辨要舍去哪个根！' }
  },

  stamp:{ label:{ ko:'두 근의 심판자', en:'Judge of Two Roots', zh:'双根裁决者' }, coins:58 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, { ko:'말이 되는 근만 정확히 골랐구나! 🏹', en:'You picked exactly the root that makes sense!', zh:'你准确地只选了说得通的那个根！' }, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ { ko:'길이나 시간이 음수일 수는 없어!', en:'A length or a time cannot be negative!', zh:'长度和时间不能是负数！' }, { ko:'두 양을 곱하는 자리를 찾아 식을 세워 봐!', en:'Find where two quantities multiply and build the equation there!', zh:'找出两个量相乘的地方再列式！' } ],
    finish:{ ko:'완벽해! 두 근의 심판자! 🏹✨', en:'Perfect! Judge of Two Roots!', zh:'完美！双根裁决者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
