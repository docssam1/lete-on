/* Numbers of Magic — 유닛 M-51: 정비례·반비례 값 (중1 W8 · 문자와 식, 심화 유형 2차 2026-08-27) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-51'] = {
  id:'M-51', tier:'middle1', level:'31', order:14,
  generator:'md51_proportion',
  title:{ ko:'정비례와 반비례 값', en:'Direct & Inverse Proportion', zh:'正比例与反比例的值' },
  subtitle:{ ko:'비율이 일정한가, 곱이 일정한가', en:'Is the ratio constant, or is the product constant?', zh:'是比值恒定，还是乘积恒定？' },
  icon:'🔄',

  practice:{
    generator:'md51_proportion', level:'practice', count:5,
    params:{mode:'direct'},
    intro:{
      ko:'정비례 y=ax는 x가 늘어나면 y도 같은 비율로 늘어나요 — 비율 a를 먼저 구하고 시작해요!',
      en:'In direct proportion y=ax, y grows at the same rate as x — find the ratio a first!',
      zh:'正比例y=ax中，x增大，y也按相同比例增大——先求出比值a！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'한 자루에 500원인 연필을 x자루 사면 값은 y=500x원이에요 — 자루 수가 2배면 값도 2배! 반대로, 일정한 거리를 갈 때 속력을 2배로 하면 걸리는 시간은 절반이 돼요 — 이건 반비례예요.',
        en:'Pencils cost 500 won each, so buying x pencils costs y=500x won — double the count, double the cost! Conversely, traveling a fixed distance at double the speed takes half the time — that\'s inverse proportion.',
        zh:'一支铅笔500元，买x支就要y=500x元——数量翻倍，价钱也翻倍！反过来，走相同的距离，速度翻倍所需时间就减半——这就是反比例。' },
      history:{ ko:'정비례·반비례는 고대 그리스의 "비례론"에서 나왔어요. 유클리드의 『원론』 5권 전체가 비(比)와 비례를 다루는데, 이는 오늘날의 함수 개념의 뿌리가 됐어요.',
        en:'Direct and inverse proportion trace back to the ancient Greek "theory of proportions". All of Book V of Euclid\'s "Elements" deals with ratios and proportions, which became the root of today\'s concept of a function.',
        zh:'正比例和反比例源自古希腊的"比例论"。欧几里得《几何原本》第五卷整卷都在讲比和比例，这成为今天函数概念的根源。' }
    },
    stages:[
      { tag:{ko:'① 정비례 — 비율(a)이 항상 일정해요',en:'1) Direct proportion — the ratio(a) is always constant',zh:'① 正比例——比值(a)恒定'},
        head:{ko:'y=ax,\\;(2,6)\\text{을 지남} \\;\\Rightarrow\\; x=5\\text{일 때 } y=15',en:'y=ax,\\;(2,6)\\text{을 지남} \\;\\Rightarrow\\; x=5\\text{일 때 } y=15',zh:'y=ax,\\;(2,6)\\text{을 지남} \\;\\Rightarrow\\; x=5\\text{일 때 } y=15'},
        desc:{ko:'점(2,6)을 지나니 y÷x=6÷2=3, 그래서 a=3(비율은 항상 y÷x). x=5일 때 y=ax=3×5=<b>15</b>가 돼요.',
              en:'Since the graph passes through (2,6), y÷x=6÷2=3, so a=3 (the ratio is always y÷x). When x=5, y=ax=3×5=<b>15</b>.',
              zh:'图像过点(2,6)，y÷x=6÷2=3，所以a=3(比值永远是y÷x)。x=5时，y=ax=3×5=<b>15</b>。'},
        mathSteps:['6\\div 2=3', '3\\times 5', '=15'],
        result:{ko:'정비례는 y÷x(비율)가 항상 같아요!',en:'In direct proportion, y÷x (the ratio) is always the same!',zh:'正比例中y÷x(比值)始终相同！'},
        book:{ko:'정비례 그래프는 원점(0,0)을 지나는 직선이에요 — x가 0이면 y도 항상 0.',
              en:'A direct-proportion graph is a straight line through the origin (0,0) — when x is 0, y is always 0 too.',
              zh:'正比例的图像是过原点(0,0)的直线——x为0时，y也总是0。'} },

      { tag:{ko:'② 반비례 — 곱(a)이 항상 일정해요',en:'2) Inverse proportion — the product(a) is always constant',zh:'② 反比例——乘积(a)恒定'},
        head:{ko:'y=\\dfrac{a}{x},\\;(2,6)\\text{을 지남} \\;\\Rightarrow\\; x=4\\text{일 때 } y=3',en:'y=\\dfrac{a}{x},\\;(2,6)\\text{을 지남} \\;\\Rightarrow\\; x=4\\text{일 때 } y=3',zh:'y=\\dfrac{a}{x},\\;(2,6)\\text{을 지남} \\;\\Rightarrow\\; x=4\\text{일 때 } y=3'},
        desc:{ko:'점(2,6)을 지나니 x×y=2×6=12, 그래서 a=12(곱은 항상 x×y). x=4일 때 y=a÷x=12÷4=<b>3</b>이 돼요.',
              en:'Since the graph passes through (2,6), x×y=2×6=12, so a=12 (the product is always x×y). When x=4, y=a÷x=12÷4=<b>3</b>.',
              zh:'图像过点(2,6)，x×y=2×6=12，所以a=12(乘积永远是x×y)。x=4时，y=a÷x=12÷4=<b>3</b>。'},
        mathSteps:['2\\times 6=12', '12\\div 4', '=3'],
        result:{ko:'반비례는 x×y(곱)가 항상 같아요!',en:'In inverse proportion, x×y (the product) is always the same!',zh:'反比例中x×y(乘积)始终相同！'},
        book:{ko:'반비례 그래프는 직선이 아니라 곡선(쌍곡선)이에요 — x가 커질수록 y는 점점 작아져요(0에는 닿지 않아요).',
              en:'An inverse-proportion graph isn\'t a line but a curve (a hyperbola) — as x grows, y shrinks (but never touches 0).',
              zh:'反比例的图像不是直线而是曲线(双曲线)——x越大，y越小(但永远不会碰到0)。'} }
    ],
    rule:{ ko:'정비례 y=ax는 비율(y÷x)이 일정, 반비례 y=a/x는 곱(x×y)이 일정 — 한 점을 알면 a를 구하고, 새 x로 y를 찾아요!',
      en:'Direct proportion y=ax keeps the ratio(y÷x) constant; inverse proportion y=a/x keeps the product(x×y) constant — find a from one point, then find y for a new x!',
      zh:'正比例y=ax比值(y÷x)恒定，反比例y=a/x乘积(x×y)恒定——由一个点求出a，再求新x对应的y！' }
  },

  check:{
    fills:[
      { tex:'y=ax,\\;a=4 \\;\\Rightarrow\\; x=3\\text{일 때 } y=\\square', answer:12,
        hint:{ ko:'4×3', en:'4×3', zh:'4×3' } },
      { tex:'y=\\dfrac{a}{x},\\;(3,\\,4)\\text{를 지남} \\;\\Rightarrow\\; x=6\\text{일 때 } y=\\square', answer:2,
        hint:{ ko:'a=3×4=12, y=12÷6', en:'a=3×4=12, y=12÷6', zh:'a=3×4=12, y=12÷6' } }
    ],
    open:{ ko:'반비례 y=a/x가 점(4,3)을 지날 때 x=2일 때의 y를 구하는 과정을 설명해봐요.',
      en:'Explain how to find y when x=2, given that y=a/x passes through (4,3).',
      zh:'说说反比例y=a/x过点(4,3)时，求x=2对应y的过程。' },
    openHint:{ ko:'a=4×3=12, x=2일 때 y=12÷2=6',
      en:'a=4×3=12, so when x=2, y=12÷2=6',
      zh:'a=4×3=12，x=2时y=12÷2=6' }
  },

  lab:{
    generator:'md51_proportion', level:'main', count:4,
    params:{mode:'inverse'},
    intro:{
      ko:'반비례는 곱(x×y)이 항상 같아요 — 그 값의 약수 중에서 새 x를 골라 나눗셈이 딱 떨어지게 해요!',
      en:'In inverse proportion, the product(x×y) is always the same — pick a new x from its divisors so the division comes out even!',
      zh:'反比例中乘积(x×y)始终相同——从它的约数中选新的x，让除法刚好整除！'
    }
  },

  arena:{
    generator:'md51_proportion', level:'main', count:8, timeLimit:300,
    params:{mode:'mixed',wide:true},
    rule:{ ko:'5분 안에 정비례·반비례를 섞어서 빠르게 구해요!', en:'Solve a mix of direct and inverse proportion, all within 5 minutes!', zh:'5分钟内快速求出正比例·反比例混合题！' }
  },

  stamp:{ label:{ ko:'비례 관측사', en:'Proportion Observer', zh:'比例观测师' }, coins:48 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'비율과 곱을 정확히 구분해서 찾았구나! 🔄',en:'You correctly told apart the ratio and the product!',zh:'你准确分清了比值和乘积！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'정비례는 y÷x(비율)가 일정해!',en:'In direct proportion, y÷x (the ratio) is constant!',zh:'正比例中y÷x(比值)是恒定的！'}, {ko:'반비례는 x×y(곱)가 일정해!',en:'In inverse proportion, x×y (the product) is constant!',zh:'反比例中x×y(乘积)是恒定的！'} ],
    finish:{ ko:'완벽해! 비례 관측사! 🔄✨', en:'Perfect! Proportion Observer!', zh:'完美！比例观测师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
