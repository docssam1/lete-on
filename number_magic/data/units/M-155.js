/* Numbers of Magic — 유닛 M-155: 평균값 정리와 롤의 정리 (고등 미적분Ⅰ · 과정 74 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD155. 교과서 없이 예시를 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-155'] = {
  id:'M-155', tier:'calculus1', level:'74', order:155,
  generator:'md155_mvt',
  title:{ ko:'평균값 정리와 롤의 정리', en:'Mean Value & Rolle’s Theorems', zh:'中值定理与罗尔定理' },
  subtitle:{ ko:'평균 속력과 같은 순간 속력은 반드시 있습니다', en:'Somewhere the instant speed equals the average speed', zh:'一定有某一瞬间的速度等于平均速度' },
  icon:'🚗',

  practice:{
    generator:'md155_mvt', level:'practice', count:6,
    params:{mode:'rolle'},
    intro:{
      ko:'f(a)=f(b) 인 닫힌구간에서 f′(c)=0 인 c 를 열린구간 (a, b) 안에서 찾습니다. 끝점과 같은 근은 넣지 않습니다.',
      en:'On a closed interval with f(a)=f(b), find c in the open interval (a, b) with f′(c)=0. A root equal to an endpoint does not count.',
      zh:'在f(a)=f(b)的闭区间上，在开区间(a, b)内找使f′(c)=0的c。等于端点的根不算。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'고속도로 두 요금소 사이 120 km 를 1 시간 30 분에 달린 차의 평균 속력은 시속 80 km 입니다. 속력이 매끄럽게 변했다면 속도계가 정확히 80 을 가리킨 순간이 적어도 한 번은 있습니다. 이것이 평균값 정리입니다.',
        en:'A car covering the 120 km between two toll gates in 1 hour 30 minutes averages 80 km/h. If its speed changed smoothly, the speedometer read exactly 80 at least once. That is the mean value theorem.',
        zh:'一辆车用1小时30分钟跑完两个收费站之间的120 km，平均速度是每小时80 km。若速度连续平稳地变化，速度表至少有一瞬间正好指向80。这就是中值定理。' }
    },
    stages:[
      { tag:{ko:'① 롤의 정리',en:'1) Rolle’s theorem',zh:'① 罗尔定理'},
        head:{ko:"f(x)=x^2-4x\\ \\ (0\\le x\\le4):\\ f(0)=f(4)=0",en:"f(x)=x^2-4x\\ \\ (0\\le x\\le4):\\ f(0)=f(4)=0",zh:"f(x)=x^2-4x\\ \\ (0\\le x\\le4):\\ f(0)=f(4)=0"},
        desc:{ko:'양 끝의 높이가 같으므로 사이에 접선이 수평인 점이 있습니다. f′(c)=2c−4=0 에서 c=<b>2</b> 입니다.',en:'Both ends are at the same height, so somewhere between the tangent is horizontal. From f′(c)=2c−4=0, c=<b>2</b>.',zh:'两端高度相同，中间一定有切线水平的点。由f′(c)=2c−4=0得c=<b>2</b>。'},
        mathSteps:["f'(c)=2c-4=0","c=2"],
        result:{ko:'올라갔다 내려오면 꼭대기가 있다!',en:'Up and back down means a top!',zh:'上去又下来就有顶点！'},
        book:{ko:'롤의 정리는 연속·미분가능·f(a)=f(b) 세 조건이 모두 필요합니다. 하나라도 빠지면 그런 c 가 없을 수 있습니다.',en:'Rolle’s theorem needs all three conditions: continuity, differentiability and f(a)=f(b). Without any one, such a c may not exist.',zh:'罗尔定理需要连续、可导、f(a)=f(b)三个条件。缺少任何一个都可能不存在这样的c。'} },

      { tag:{ko:'② 평균값 정리',en:'2) Mean value theorem',zh:'② 中值定理'},
        head:{ko:"f(x)=x^2\\ \\ (1\\le x\\le5):\\ \\frac{25-1}{5-1}=6=f'(c)",en:"f(x)=x^2\\ \\ (1\\le x\\le5):\\ \\frac{25-1}{5-1}=6=f'(c)",zh:"f(x)=x^2\\ \\ (1\\le x\\le5):\\ \\frac{25-1}{5-1}=6=f'(c)"},
        desc:{ko:'두 끝점을 잇는 직선의 기울기가 6 이므로 2c=6 에서 c=<b>3</b> 입니다. 이차함수는 언제나 구간의 가운데가 c 입니다.',en:'The chord joining the ends has slope 6, so 2c=6 and c=<b>3</b>. For a quadratic, c is always the midpoint of the interval.',zh:'连接两端点的直线斜率为6，由2c=6得c=<b>3</b>。二次函数的c总是区间的中点。'},
        mathSteps:["\\frac{f(5)-f(1)}{5-1}=6","2c=6,\\ c=3"],
        result:{ko:'평균 기울기 = 어느 순간의 기울기!',en:'Average slope = some instant slope!',zh:'平均斜率 = 某一瞬间的斜率！'},
        book:{ko:'롤의 정리는 f(a)=f(b) 인 평균값 정리입니다. 평균변화율이 0 이면 f′(c)=0 이 되기 때문입니다.',en:'Rolle’s theorem is the mean value theorem with f(a)=f(b): an average rate of change of 0 gives f′(c)=0.',zh:'罗尔定理就是f(a)=f(b)时的中值定理：平均变化率为0就有f′(c)=0。'} },

      { tag:{ko:'③ 끝점은 빼기',en:'3) Leave out the ends',zh:'③ 去掉端点'},
        head:{ko:"f(x)=x^3-3x^2\\ \\ (0\\le x\\le3):\\ f'(c)=3c(c-2)=0",en:"f(x)=x^3-3x^2\\ \\ (0\\le x\\le3):\\ f'(c)=3c(c-2)=0",zh:"f(x)=x^3-3x^2\\ \\ (0\\le x\\le3):\\ f'(c)=3c(c-2)=0"},
        desc:{ko:'f(0)=f(3)=0 이고 f′(c)=0 의 근은 0 과 2 입니다. c 는 열린구간 (0, 3) 에 있어야 하므로 0 은 빼고 c=<b>2</b> 입니다.',en:'f(0)=f(3)=0 and f′(c)=0 has roots 0 and 2. Since c must be in the open interval (0, 3), leave out 0: c=<b>2</b>.',zh:'f(0)=f(3)=0，f′(c)=0的根为0和2。c必须在开区间(0, 3)内，去掉0，c=<b>2</b>。'},
        mathSteps:["c=0,\\ 2","0<c<3\\ \\Rightarrow\\ c=2"],
        result:{ko:'열린구간 안의 것만!',en:'Only inside the open interval!',zh:'只要开区间内的！'},
        book:{ko:'삼차함수에서는 조건을 만족하는 c 가 두 개일 수도 있습니다. 방정식의 근을 모두 구한 뒤 (a, b) 안에 있는 것만 셉니다.',en:'For a cubic there may be two such values of c. Find every root, then count only those inside (a, b).',zh:'三次函数满足条件的c可能有两个。求出所有根后只数在(a, b)内的。'} }
    ],
    rule:{ ko:'① f(a)=f(b) ⇒ f′(c)=0  ② {f(b)−f(a)}/(b−a)=f′(c)  ③ c 는 열린구간 (a, b) 안에서만',
      en:'① f(a)=f(b) ⇒ f′(c)=0  ② {f(b)−f(a)}/(b−a)=f′(c)  ③ c only in the open interval (a, b)',
      zh:'① f(a)=f(b) ⇒ f′(c)=0  ② {f(b)−f(a)}/(b−a)=f′(c)  ③ c只在开区间(a, b)内' }
  },

  check:{
    fills:[
      { tex:{ko:"f(x)=x^2+2x\\ \\ (-1\\le x\\le3),\\ \\frac{f(3)-f(-1)}{3-(-1)}=f'(c)\\ \\Rightarrow\\ c=\\square",en:"f(x)=x^2+2x\\ \\ (-1\\le x\\le3),\\ \\frac{f(3)-f(-1)}{3-(-1)}=f'(c)\\ \\Rightarrow\\ c=\\square",zh:"f(x)=x^2+2x\\ \\ (-1\\le x\\le3),\\ \\frac{f(3)-f(-1)}{3-(-1)}=f'(c)\\ \\Rightarrow\\ c=\\square"}, answer:1,
        hint:{ko:"\\frac{15-(-1)}{4}=4=2c+2",en:"\\frac{15-(-1)}{4}=4=2c+2",zh:"\\frac{15-(-1)}{4}=4=2c+2"} },
      { tex:{ko:"f(x)=x^2-6x+1\\ \\ (1\\le x\\le5),\\ f'(c)=0\\ \\Rightarrow\\ c=\\square",en:"f(x)=x^2-6x+1\\ \\ (1\\le x\\le5),\\ f'(c)=0\\ \\Rightarrow\\ c=\\square",zh:"f(x)=x^2-6x+1\\ \\ (1\\le x\\le5),\\ f'(c)=0\\ \\Rightarrow\\ c=\\square"}, answer:3,
        hint:{ko:'f(1)=f(5)=-4',en:'f(1)=f(5)=-4',zh:'f(1)=f(5)=-4'} }
    ],
    open:{ ko:'이차함수 f(x)=px²+qx+r 에서 평균값 정리를 만족시키는 c 가 언제나 구간의 가운데 (a+b)/2 인 까닭을 설명해 봅니다.',
      en:'Explain why, for a quadratic f(x)=px²+qx+r, the mean-value c is always the midpoint (a+b)/2 of the interval.',
      zh:'说说为什么对二次函数f(x)=px²+qx+r，满足中值定理的c总是区间的中点(a+b)/2。' },
    openHint:{ ko:'{f(b)−f(a)}/(b−a)={p(b²−a²)+q(b−a)}/(b−a)=p(a+b)+q 입니다. f′(c)=2pc+q 와 같으려면 2c=a+b, 곧 c=(a+b)/2 입니다.',
      en:'{f(b)−f(a)}/(b−a)={p(b²−a²)+q(b−a)}/(b−a)=p(a+b)+q. For this to equal f′(c)=2pc+q we need 2c=a+b, that is c=(a+b)/2.',
      zh:'{f(b)−f(a)}/(b−a)={p(b²−a²)+q(b−a)}/(b−a)=p(a+b)+q。要等于f′(c)=2pc+q，需2c=a+b，即c=(a+b)/2。' }
  },

  lab:{
    generator:'md155_mvt', level:'main', count:6,
    params:{mode:'mvt'},
    intro:{
      ko:'두 끝점을 잇는 직선의 기울기 {f(b)−f(a)}/(b−a) 를 먼저 구하고, f′(c) 가 그 값이 되는 c 를 열린구간 안에서 찾습니다.',
      en:'First find the slope {f(b)−f(a)}/(b−a) of the chord joining the ends, then find c inside the open interval where f′(c) equals it.',
      zh:'先求连接两端点的直线的斜率{f(b)−f(a)}/(b−a)，再在开区间内找使f′(c)等于它的c。'
    }
  },

  arena:{
    generator:'md155_mvt', level:'main', count:6, timeLimit:420,
    params:{mode:'more'},
    rule:{ ko:'7분 안에 c 의 개수·합과 미정계수 문제를 모두 풉니다!', en:'Solve every problem on the number and sum of c and on unknowns within 7 minutes!', zh:'7分钟内解出所有关于c的个数、和与待定系数的题！' }
  },

  stamp:{ label:{ ko:'순간 속력 탐지기', en:'Instant Speed Finder', zh:'瞬时速度探测器' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'딱 그 순간을 찾았어! 🚗',en:'Found exactly that instant!',zh:'正好找到那一瞬间！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'끝점을 잇는 기울기부터 구해 봐!',en:'Start with the slope joining the ends!',zh:'先求连接两端点的斜率！'}, {ko:'c 는 열린구간 안에 있어야 해!',en:'c must be inside the open interval!',zh:'c要在开区间内！'} ],
    finish:{ ko:'완벽해! 순간 속력 탐지기! 🚗✨', en:'Perfect! Instant Speed Finder!', zh:'完美！瞬时速度探测器！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
