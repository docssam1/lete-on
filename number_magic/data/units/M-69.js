/* Numbers of Magic — 유닛 M-69: 정비례·반비례의 그래프 (중등 교과 연산 4차 2026-09-21)
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-69'] = {
  id:'M-69', tier:'middle1', level:'31', order:18,
  generator:'md69_proportionGraph',
  title:{ ko:'정비례·반비례의 그래프', en:'Graphs of Direct & Inverse Proportion', zh:'正比例·反比例的图象' },
  subtitle:{ ko:'곧은 직선과 갈라진 곡선, 모양이 관계를 말해줍니다', en:'A straight line or a split curve - the shape tells you the relation', zh:'一条直线、一条分支曲线——形状就说明了关系' },
  icon:'📉',

  practice:{
    generator:'md69_proportionGraph', level:'practice', count:5,
    params:{mode:'directGraph'},
    intro:{ ko:'원점을 지나는 직선입니다 — 지나는 점에서 y를 x로 나누면 a가 나옵니다!', en:'It is a straight line through the origin - divide y by x at any point on it to get a!', zh:'这是过原点的直线——在图象上任取一点，y除以x就得到a！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'자전거를 일정한 빠르기로 달리면 시간이 2배가 될 때 거리도 2배가 됩니다(정비례). 그런데 같은 거리를 달릴 때는 빠르기가 2배면 시간이 절반이 됩니다(반비례). 두 관계를 그림으로 그리면 하나는 곧은 직선, 하나는 갈라진 곡선입니다.', en:'Ride at a steady speed and doubling the time doubles the distance - direct proportion. But over a fixed distance, doubling the speed halves the time - inverse proportion. Draw the two and one is a straight line, the other a curve in two branches.', zh:'以固定速度骑车，时间翻倍路程也翻倍(正比例)。但走同样的路程时，速度翻倍时间就减半(反比例)。把两种关系画出来，一个是直线，一个是分成两支的曲线。' },
      history:{ ko:'반비례 그래프는 쌍곡선이라고 부릅니다. 아무리 가도 축에 닿지 않고 점점 가까워지기만 하는데, 그 축을 "점근선"이라고 합니다. x가 0이면 y를 구할 수 없어서(0으로 나눌 수 없어서) 그래프가 가운데에서 끊어져 두 가지로 갈라지는 거입니다.', en:'The inverse-proportion graph is called a hyperbola. It creeps closer and closer to the axes without ever touching them, and those axes are its asymptotes. Since x cannot be zero - nothing can be divided by zero - the graph breaks in the middle into two branches.', zh:'反比例图象叫双曲线。它越来越靠近坐标轴却永远碰不到，那两条轴叫"渐近线"。因为x不能为0(不能除以0)，所以图象在中间断开，分成两支。' }
    },
    stages:[
      { tag:{ ko:'① 정비례 — 원점을 지나는 직선', en:'1) Direct proportion - a line through the origin', zh:'① 正比例——过原点的直线' },
        head:{ ko:'\\left(2,\\, 6\\right) \\text{를 지남} \\quad\\Rightarrow\\quad y = 3x', en:'\\text{through } \\left(2,\\, 6\\right) \\quad\\Rightarrow\\quad y = 3x', zh:'\\text{过} \\left(2,\\, 6\\right) \\quad\\Rightarrow\\quad y = 3x' },
        desc:{ ko:'정비례는 x가 0일 때 y도 0이라 <b>반드시 원점을 지납니다</b>. 지나는 점 하나에서 y를 x로 나누면 비례상수 a가 나옵니다 — 어느 점을 골라도 같은 값입니다.', en:'In a direct proportion y is zero when x is, so the line <b>always passes through the origin</b>. Divide y by x at any point on it and you get the constant a - every point gives the same value.', zh:'正比例中x为0时y也为0，所以图象<b>一定过原点</b>。在图象上任取一点，y除以x就得到比例常数a——取哪个点都一样。' },
        mathSteps:['6 \\div 2 = 3', 'y = 3x'],
        result:{ ko:'나누면 늘 같은 수 — 그게 비례상수입니다!', en:'Dividing always gives the same number - that is the constant!', zh:'相除总得到同一个数——那就是比例常数！' },
        book:{ ko:'a가 양수면 오른쪽 위로, 음수면 오른쪽 아래로 가는 직선입니다. a의 절댓값이 클수록 가파릅니다 — 기울기와 같은 뜻입니다.', en:'A positive a slopes up to the right and a negative a slopes down; the larger the size of a, the steeper it is. It is the same thing as the slope.', zh:'a为正时向右上，为负时向右下；|a|越大越陡——这和斜率是一回事。' } },

      { tag:{ ko:'② 반비례 — 곱이 늘 같다', en:'2) Inverse proportion - the product stays the same', zh:'② 反比例——乘积总相同' },
        head:{ ko:'\\left(2,\\, 3\\right) \\text{를 지남} \\quad\\Rightarrow\\quad y = \\dfrac{6}{x}', en:'\\text{through } \\left(2,\\, 3\\right) \\quad\\Rightarrow\\quad y = \\dfrac{6}{x}', zh:'\\text{过} \\left(2,\\, 3\\right) \\quad\\Rightarrow\\quad y = \\dfrac{6}{x}' },
        desc:{ ko:'반비례에서는 x와 y를 <b>곱하면</b> 늘 같은 수가 나옵니다. 2×3=6이니 a는 6이고 식은 y=6/x입니다. 정비례가 나누기였던 것과 정반대입니다.', en:'In an inverse proportion, <b>multiplying</b> x by y always gives the same number: 2x3 = 6, so a is 6 and the formula is y = 6/x. Direct proportion divided; this one multiplies.', zh:'反比例中x与y<b>相乘</b>总得到同一个数：2×3=6，所以a是6，式子是y=6/x。正比例是除，这里正好相反。' },
        mathSteps:['2 \\times 3 = 6', 'y = \\dfrac{6}{x}'],
        result:{ ko:'정비례는 나누기, 반비례는 곱하기!', en:'Divide for direct, multiply for inverse!', zh:'正比例用除，反比例用乘！' },
        book:{ ko:'a가 양수면 그래프가 제1·3사분면에, 음수면 제2·4사분면에 있습니다. x=0에서는 값이 없어 그래프가 두 가지로 갈라집니다 — 이어 그리면 안 됩니다.', en:'A positive a puts the curve in quadrants 1 and 3, a negative one in quadrants 2 and 4. There is no value at x=0, so the curve comes in two separate branches - never join them up.', zh:'a为正时图象在第1、3象限，为负时在第2、4象限。x=0处没有值，所以图象分成两支——不能连起来画。' } }
    ],
    rule:{ ko:'정비례는 나누고 반비례는 곱합니다 — 지나는 점 하나면 두 그래프 모두 식을 세울 수 있습니다!', en:'Divide for direct proportion and multiply for inverse - one point on the graph gives you the formula either way!', zh:'正比例用除、反比例用乘——只要图象上的一个点，两种图象都能写出式子！' }
  },

  check:{
    fills:[
      { tex:{ko:'y = ax \\text{가} \\left(3,\\, 12\\right) \\text{를 지남} \\quad\\Rightarrow\\quad a = \\square',en:'y = ax \\text{ through } \\left(3,\\, 12\\right) \\quad\\Rightarrow\\quad a = \\square',zh:'y = ax \\text{过} \\left(3,\\, 12\\right) \\quad\\Rightarrow\\quad a = \\square'}, answer:4,
        hint:{ ko:'12 ÷ 3', en:'12 divided by 3', zh:'12÷3' } },
      { tex:{ko:'y = \\dfrac{a}{x} \\text{가} \\left(4,\\, 3\\right) \\text{를 지남} \\quad\\Rightarrow\\quad a = \\square',en:'y = \\dfrac{a}{x} \\text{ through } \\left(4,\\, 3\\right) \\quad\\Rightarrow\\quad a = \\square',zh:'y = \\dfrac{a}{x} \\text{过} \\left(4,\\, 3\\right) \\quad\\Rightarrow\\quad a = \\square'}, answer:12,
        hint:{ ko:'4 × 3', en:'4 times 3', zh:'4×3' } }
    ],
    open:{ ko:'정비례와 반비례 그래프의 모양이 왜 다른지 말해봅니다.', en:'Explain why the two graphs look so different.', zh:'说说正比例和反比例的图象为什么形状不同。' },
    openHint:{ ko:'정비례는 늘 같은 비율로 늘어 직선, 반비례는 한쪽이 커지면 다른 쪽이 작아져 곡선', en:'Direct grows at a steady rate so it is straight; inverse shrinks as the other grows, so it curves', zh:'正比例按固定比例增长所以是直线；反比例一个变大另一个变小，所以是曲线' }
  },

  lab:{
    generator:'md69_proportionGraph', level:'main', count:4,
    params:{mode:'inverseGraph'},
    intro:{ ko:'갈라진 곡선입니다 — 지나는 점에서 x와 y를 곱해 보세요!', en:'It is a curve in two branches - multiply x by y at a point on it!', zh:'这是分成两支的曲线——把图象上一点的x和y相乘！' }
  },

  arena:{
    generator:'md69_proportionGraph', level:'main', count:8, timeLimit:360,
    params:{mode:'readValue'},
    rule:{ ko:'6분 안에 그래프의 모양을 보고 식을 세운 뒤 값을 읽습니다!', en:'Within 6 minutes, read the shape, build the formula, and find the value!', zh:'6分钟内看图象形状写出式子并读出值！' }
  },

  stamp:{ label:{ ko:'두 그래프의 독해가', en:'Reader of Two Graphs', zh:'双图象解读者' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, { ko:'모양만 보고 관계를 알아냈구나! 📉', en:'You read the relation straight off the shape!', zh:'你只看形状就看出了关系！' }, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ { ko:'정비례면 나누고, 반비례면 곱해 봐!', en:'Divide for direct, multiply for inverse!', zh:'正比例就除，反比例就乘！' }, { ko:'그래프가 원점을 지나는지 먼저 봐!', en:'First check whether it goes through the origin!', zh:'先看看图象是不是过原点！' } ],
    finish:{ ko:'완벽해! 두 그래프의 독해가! 📉✨', en:'Perfect! Reader of Two Graphs!', zh:'完美！双图象解读者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
