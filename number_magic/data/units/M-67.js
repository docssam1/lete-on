/* Numbers of Magic — 유닛 M-67: 이차함수의 꼭짓점 (중3 W10 · 중등 교과 연산 3차 2026-09-20)
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-67'] = {
  id:'M-67', tier:'middle3', level:'37', order:11,
  generator:'md67_quadVertex',
  title:{ ko:'이차함수의 꼭짓점', en:'The Vertex of a Quadratic', zh:'二次函数的顶点' },
  subtitle:{ ko:'제곱은 음수가 될 수 없어서 꺾이는 자리가 생겨요', en:'A square can never be negative — that is where the curve turns', zh:'平方不可能为负，所以才有转折的地方' },
  icon:'⛰️',

  /* practice 를 그래프 모드로 연 이유(2026-09-21) — 꼭짓점은 "포물선이 꺾이는 한 점"이다.
     식에서 부호를 뒤집어 읽는 요령보다 그림이 먼저다(M-65 와 같은 좌표평면 위젯). */
  practice:{
    generator:'md67_quadVertex', level:'practice', count:5,
    params:{mode:'readVertex'},
    intro:{
      ko:'포물선이 방향을 바꾸는 단 한 점을 찾아, 그 자리의 가로·세로 좌표를 읽어 보세요!',
      en:'Find the one point where the parabola turns around, and read its x and y off the grid!',
      zh:'找出抛物线改变方向的那唯一一点，读出它的横纵坐标！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'공을 위로 던지면 올라가다가 어느 순간 멈추고 내려와요. 그 "멈추는 한 점"이 꼭짓점이에요. 높이를 식으로 쓰면 언제나 이차식이고, (x−p)²이 0이 되는 자리 — 즉 x=p에서 가장 높아요. 제곱은 절대 음수가 될 수 없기 때문이에요.',
        en:'Throw a ball up and it rises, pauses for an instant, then falls. That pause is the vertex. Write the height as a formula and it is always a quadratic, highest exactly where the squared bracket becomes zero. The reason is simply that a square can never be negative.',
        zh:'把球往上抛，它上升、在某一瞬停住、再落下。那个"停住的点"就是顶点。把高度写成式子总是二次式，在(x−p)²等于0的地方——也就是x=p处——最高。原因很简单：平方不可能是负数。' },
      history:{ ko:'포물선은 기원전 3세기 아폴로니오스가 원뿔을 비스듬히 자른 단면으로 연구했어요. 그로부터 1900년 뒤 갈릴레이가 던진 물체의 길이 정확히 그 포물선임을 밝혔고, 다시 포물면 거울이 빛을 한 점에 모은다는 성질이 오늘날 위성 안테나와 자동차 전조등에 쓰여요.',
        en:'The parabola was studied by Apollonius in the third century BCE as a slanted slice through a cone. Nineteen centuries later Galileo showed that a thrown object traces exactly that curve, and the parabolic mirror’s habit of gathering light to a single point is what satellite dishes and car headlights use today.',
        zh:'抛物线早在公元前3世纪就被阿波罗尼奥斯当作斜切圆锥的截面来研究。1900年后伽利略证明抛出物体的轨迹正是这条曲线，而抛物面镜把光聚到一点的性质，今天用在卫星天线和汽车前灯上。' }
    },
    stages:[
      { tag:{ko:'① 표준형에서 그대로 읽기 — 부호는 반대로',en:'1) Read it off the vertex form — flip the inner sign',zh:'① 从标准式直接读出——符号反过来'},
        head:{ko:'y = (x - 3)^2 + 2 \\quad\\Rightarrow\\quad (3,\\, 2)',en:'y = (x - 3)^2 + 2 \\quad\\Rightarrow\\quad (3,\\, 2)',zh:'y = (x - 3)^2 + 2 \\quad\\Rightarrow\\quad (3,\\, 2)'},
        desc:{ko:'(x−3)²은 절대 음수가 못 되고, x=3일 때 딱 0으로 가장 작아져요. 그때 y는 남은 2예요. 괄호 안이 <b>−3인데 꼭짓점의 x는 +3</b>이라는 점을 꼭 기억해요.',
              en:'The squared bracket can never be negative, and it hits its smallest value, zero, exactly at x=3. There y is just the leftover 2. Note carefully: the bracket shows <b>minus three but the vertex x is plus three</b>.',
              zh:'(x−3)²不可能为负，在x=3时正好取到最小值0，这时y就是剩下的2。要记牢：括号里是<b>−3，而顶点的x是+3</b>。'},
        mathSteps:['(x - 3)^2 \\ge 0', 'x = 3 \\quad\\Rightarrow\\quad (x-3)^2 = 0', 'y = 0 + 2 = 2'],
        result:{ko:'꼭짓점은 (3, 2), 최솟값은 2예요!',en:'The vertex is (3, 2) and the minimum value is 2!',zh:'顶点是(3, 2)，最小值是2！'},
        book:{ko:'x²의 계수가 양수면 아래로 볼록해서 꼭짓점이 <b>최솟값</b>, 음수면 위로 볼록해서 <b>최댓값</b>이에요. 계수의 크기는 폭을 정해요 — 클수록 좁아져요.',
              en:'A positive coefficient on the squared term opens upward, so the vertex is the <b>minimum</b>; a negative one opens downward, so it is the <b>maximum</b>. The size of the coefficient sets the width — bigger means narrower.',
              zh:'x²的系数为正时开口向上，顶点是<b>最小值</b>；为负时开口向下，顶点是<b>最大值</b>。系数的大小决定宽窄——越大越窄。'} },

      { tag:{ko:'② 일반형은 완전제곱으로 고쳐서',en:'2) Complete the square to convert the general form',zh:'② 一般式要先配方'},
        head:{ko:'y = x^2 - 6x + 11 \\quad\\Rightarrow\\quad (3,\\, 2)',en:'y = x^2 - 6x + 11 \\quad\\Rightarrow\\quad (3,\\, 2)',zh:'y = x^2 - 6x + 11 \\quad\\Rightarrow\\quad (3,\\, 2)'},
        desc:{ko:'x의 계수 −6의 절반은 −3, 제곱하면 9예요. 9를 더하고 다시 빼면 (x−3)²+2가 돼요. 결국 ①과 <b>똑같은 그래프</b>였던 거예요 — 모양만 다르게 적혀 있었을 뿐이에요.',
              en:'Half of the coefficient is minus three, and squaring gives nine. Add nine and subtract it again and you reach the same vertex form as before. It was <b>the same graph all along</b>, just written another way.',
              zh:'x的系数−6的一半是−3，平方得9。加上9再减去9，就变成(x−3)²+2。原来它和①<b>是同一条图象</b>，只是写法不同而已。'},
        mathSteps:['x^2 - 6x + 9 - 9 + 11', '(x - 3)^2 + 2',
                   {ko:'\\text{꼭짓점} (3,\\, 2)',en:'\\text{vertex} (3,\\, 2)',zh:'\\text{顶点} (3,\\, 2)'}],
        result:{ko:'일반형과 표준형은 같은 그래프의 두 가지 표기예요!',en:'General form and vertex form are two ways of writing the same graph!',zh:'一般式和标准式是同一条图象的两种写法！'},
        book:{ko:'x²의 계수가 1이 아니면 <b>먼저 묶어내요</b>. y=2x²−12x+20은 2(x²−6x)+20 → 2(x−3)²+2예요. 괄호 밖으로 나갈 때 9가 아니라 2×9=18이 빠져나간다는 데 주의해요.',
              en:'When the coefficient of the squared term is not one, <b>factor it out first</b>. Watch out for one thing: what leaves the bracket is not the nine itself but the nine times that coefficient.',
              zh:'x²的系数不是1时要<b>先提出来</b>：y=2x²−12x+20变成2(x²−6x)+20 → 2(x−3)²+2。注意，从括号里出来的不是9，而是2×9=18。'} }
    ],
    rule:{ ko:'y=a(x−p)²+q의 꼭짓점은 (p, q) — 괄호 안의 부호는 반대로 읽고, 일반형은 완전제곱으로 고쳐요!',
      en:'For y=a(x−p)²+q the vertex is (p, q) — flip the sign inside the bracket, and complete the square to convert the general form!',
      zh:'y=a(x−p)²+q的顶点是(p, q)——括号里的符号反过来读，一般式先配方！' }
  },

  check:{
    fills:[
      { tex:{ko:'y = (x - 5)^2 + 1 \\quad\\Rightarrow\\quad \\text{꼭짓점의 } x = \\square',
             en:'y = (x - 5)^2 + 1 \\quad\\Rightarrow\\quad \\text{vertex } x = \\square',
             zh:'y = (x - 5)^2 + 1 \\quad\\Rightarrow\\quad \\text{顶点的 } x = \\square'}, answer:5,
        hint:{ ko:'괄호 안이 −5면 x는 +5', en:'A bracket of −5 means x is +5', zh:'括号里是−5，x就是+5' } },
      { tex:{ko:'y = x^2 - 4x + 7 \\quad\\Rightarrow\\quad \\text{꼭짓점의 } y = \\square',
             en:'y = x^2 - 4x + 7 \\quad\\Rightarrow\\quad \\text{vertex } y = \\square',
             zh:'y = x^2 - 4x + 7 \\quad\\Rightarrow\\quad \\text{顶点的 } y = \\square'}, answer:3,
        hint:{ ko:'(x−2)²+3으로 고쳐요', en:'Rewrite it as (x−2)²+3', zh:'改写成(x−2)²+3' } }
    ],
    open:{ ko:'y=x²+8x+19의 꼭짓점을 구하는 과정을 말해봐요.',
      en:'Explain how to find the vertex of y=x²+8x+19.',
      zh:'说说怎样求y=x²+8x+19的顶点。' },
    openHint:{ ko:'(x+4)²+3 → (−4, 3)',
      en:'(x+4)²+3 → (−4, 3)',
      zh:'(x+4)²+3 → (−4, 3)' }
  },

  lab:{
    generator:'md67_quadVertex', level:'main', count:4,
    params:{mode:'complete',wide:true},
    intro:{
      ko:'x의 계수의 절반이 p예요 — 부호는 반대라는 걸 잊지 마세요!',
      en:'Half the coefficient of x gives p — remember the sign is flipped!',
      zh:'x的系数的一半就是p——别忘了符号是相反的！'
    }
  },

  arena:{
    generator:'md67_quadVertex', level:'main', count:8, timeLimit:360,
    params:{mode:'withCoef',wide:true},
    rule:{ ko:'6분 안에 x²의 계수를 묶어내고 꼭짓점을 찾아요!', en:'Within 6 minutes, factor out the leading coefficient and find the vertex!', zh:'6分钟内提取x²的系数并找出顶点！' }
  },

  stamp:{ label:{ ko:'포물선의 등반가', en:'Climber of Parabolas', zh:'抛物线登山者' }, coins:54 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'꼭짓점을 정확히 짚었구나! ⛰️',en:'You pinpointed the vertex exactly!',zh:'你把顶点找得分毫不差！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'괄호 안의 부호는 반대로 읽어야 해!',en:'The sign inside the bracket reads the opposite way!',zh:'括号里的符号要反过来读！'}, {ko:'x²의 계수가 1이 아니면 먼저 묶어내!',en:'If the leading coefficient is not 1, factor it out first!',zh:'x²的系数不是1时，先把它提出来！'} ],
    finish:{ ko:'완벽해! 포물선의 등반가! ⛰️✨', en:'Perfect! Climber of Parabolas!', zh:'完美！抛物线登山者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
