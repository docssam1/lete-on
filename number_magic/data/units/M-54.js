/* Numbers of Magic — 유닛 M-54: 지수·로그 부등식 (대수 W13 심화, 2026-08-27) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-54'] = {
  id:'M-54', tier:'algebra', level:'44', order:3,
  generator:'md54_expLogInequality',
  title:{ ko:'지수·로그 부등식', en:'Exponential & Log Inequalities', zh:'指数·对数不等式' },
  subtitle:{ ko:'증가함수는 부등호 방향을 그대로 넘겨줘요', en:'An increasing function passes the inequality direction straight through', zh:'增函数会原样传递不等号方向' },
  icon:'📶',

  practice:{
    generator:'md54_expLogInequality', level:'practice', count:5,
    params:{mode:'expBasic'},
    intro:{
      ko:'밑이 1보다 크면 지수함수·로그함수 둘 다 커질수록 값도 커지는 증가함수예요 — 등호가 성립하는 경계값부터 찾아요!',
      en:'When the base exceeds 1, both exponential and log functions are increasing — start by finding the boundary value where equality holds!',
      zh:'底数大于1时，指数函数和对数函数都是增函数——先找出等号成立的边界值！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'2ˣ은 x가 커질수록 값도 커져요(2¹=2, 2²=4, 2³=8…) — 이런 함수를 "증가함수"라고 해요. 그래서 2ˣ>2³이면, x도 3보다 커야 해요: x>3.',
        en:'2ˣ grows as x grows (2¹=2, 2²=4, 2³=8…) — such a function is called "increasing". So if 2ˣ>2³, then x must be greater than 3 too: x>3.',
        zh:'2ˣ随x增大而增大(2¹=2, 2²=4, 2³=8…)——这样的函数叫"增函数"。所以2ˣ>2³时，x也必须大于3：x>3。' },
      history:{ ko:'"증가함수는 부등호 방향을 유지한다"는 원리는 함수의 단조성(單調性) 개념에서 나와요. 반대로 밑이 1보다 작으면(예: (1/2)ˣ) 감소함수가 되어 부등호 방향이 뒤집혀요 — 이 유닛에서는 밑이 항상 1보다 큰 경우만 다뤄요.',
        en:'The principle that "an increasing function keeps the inequality direction" comes from the idea of monotonicity. Conversely, if the base is less than 1 (like (1/2)ˣ), the function is decreasing and the inequality flips — this unit only covers bases greater than 1.',
        zh:'"增函数保持不等号方向"这一原理来自函数单调性的概念。反过来，如果底数小于1(如(1/2)ˣ)，函数就是减函数，不等号要翻转——本单元只处理底数大于1的情形。' }
    },
    stages:[
      { tag:{ko:'① 지수부등식 — 등호가 성립하는 경계부터',en:'1) Exponential inequality — start from where equality holds',zh:'① 指数不等式——从等号成立处开始'},
        head:{ko:'3^{x} \\ge 3^{4} \\;\\Rightarrow\\; x \\ge 4',en:'3^{x} \\ge 3^{4} \\;\\Rightarrow\\; x \\ge 4',zh:'3^{x} \\ge 3^{4} \\;\\Rightarrow\\; x \\ge 4'},
        desc:{ko:'밑 3은 1보다 크니 3ˣ은 증가함수예요. <b>등호가 성립하는 자리</b>(x=4)를 먼저 찾고, 부등호(≥)는 원래 방향 그대로 x≥4가 돼요.',
              en:'Since the base 3 exceeds 1, 3ˣ is increasing. First find <b>where equality holds</b> (x=4), then the inequality (≥) carries straight through to x≥4.',
              zh:'底数3大于1，所以3ˣ是增函数。先找出<b>等号成立的位置</b>(x=4)，不等号(≥)方向不变，得到x≥4。'},
        mathSteps:['x=4\\text{에서 등호}', '\\text{증가함수라 방향 유지}', 'x\\ge 4'],
        result:{ko:'증가함수는 지수(또는 진수)의 부등호 방향을 그대로 넘겨줘요!',en:'An increasing function passes the inequality direction of the exponent (or argument) straight through!',zh:'增函数会把指数(或真数)的不等号方向原样传递！'},
        book:{ko:'경계값 자체가 부등식의 답에 포함되는지(≥,≤)와 포함되지 않는지(>,<)를 꼭 확인해요.',
              en:'Always check whether the boundary value itself is included (≥,≤) or excluded (>,<) from the solution.',
              zh:'一定要确认边界值本身是否包含在解内(≥,≤)还是不包含(>,<)。'} },

      { tag:{ko:'② 로그부등식도 방향은 그대로',en:'2) The log inequality also keeps the direction',zh:'② 对数不等式方向也不变'},
        head:{ko:'\\log_2(x+1) \\le 3 \\;\\Rightarrow\\; x \\le 7',en:'\\log_2(x+1) \\le 3 \\;\\Rightarrow\\; x \\le 7',zh:'\\log_2(x+1) \\le 3 \\;\\Rightarrow\\; x \\le 7'},
        desc:{ko:'밑 2가 1보다 크니 log₂도 증가함수예요. <b>등호가 성립하는 경계</b>: x+1=2³=8, x=7. 부등호(≤)는 그대로 유지되어 x≤7이 돼요.',
              en:'The base 2 exceeds 1, so log₂ is also increasing. <b>Where equality holds</b>: x+1=2³=8, x=7. The inequality (≤) carries through, giving x≤7.',
              zh:'底数2大于1，所以log₂也是增函数。<b>等号成立处</b>：x+1=2³=8，x=7。不等号(≤)方向不变，得到x≤7。'},
        mathSteps:['x+1=2^3=8', 'x=7', 'x\\le 7'],
        result:{ko:'로그부등식도 log의 정의로 경계값을 찾고, 방향은 그대로 넘겨요!',en:'For log inequalities too, find the boundary with the definition of log, and the direction carries through!',zh:'对数不等式也是用log的定义找边界，方向原样传递！'},
        book:{ko:'로그부등식은 진수가 0보다 커야 한다는 조건도 잊지 않아야 해요(진수 조건).',
              en:'For log inequalities, don\'t forget the argument must stay positive (the argument condition).',
              zh:'对数不等式也别忘了真数必须大于0(真数条件)。'} }
    ],
    rule:{ ko:'밑이 1보다 크면 지수·로그 부등식 둘 다 증가함수 — 등호가 성립하는 경계값을 찾으면 부등호 방향은 그대로예요!',
      en:'When the base exceeds 1, both exponential and log inequalities are increasing — find the boundary where equality holds, and the inequality direction stays the same!',
      zh:'底数大于1时，指数·对数不等式都是增函数——找出等号成立的边界值，不等号方向不变！' }
  },

  check:{
    fills:[
      { tex:'2^{x} \\ge 2^{5} \\;\\Rightarrow\\; x \\ge \\square', answer:5,
        hint:{ ko:'지수끼리 그대로 비교', en:'Compare the exponents directly', zh:'直接比较指数' } },
      { tex:'\\log_3(x+2) \\le 2 \\;\\Rightarrow\\; x \\le \\square', answer:7,
        hint:{ ko:'x+2=3^2=9', en:'x+2=3^2=9', zh:'x+2=3^2=9' } }
    ],
    open:{ ko:'3^(x-1)≥27을 경계값 찾기부터 설명해봐요.',
      en:'Explain 3^(x-1)≥27, starting by finding the boundary value.',
      zh:'从找边界值开始说说3^(x-1)≥27。' },
    openHint:{ ko:'27=3^3, x-1=3, x≥4',
      en:'27=3^3, x-1=3, x≥4',
      zh:'27=3^3，x-1=3，x≥4' }
  },

  lab:{
    generator:'md54_expLogInequality', level:'main', count:4,
    params:{mode:'expWide',wide:true},
    intro:{
      ko:'지수에 계수가 붙어도 경계값 찾는 방법은 같아요!',
      en:'Even with a coefficient on the exponent, finding the boundary works the same way!',
      zh:'指数上有系数，找边界值的方法也一样！'
    }
  },

  arena:{
    generator:'md54_expLogInequality', level:'main', count:8, timeLimit:300,
    params:{mode:'logIneq',wide:true},
    rule:{ ko:'5분 안에 로그부등식의 경계값을 모두 찾아요!', en:'Find the boundary value of every log inequality within 5 minutes!', zh:'5分钟内找出所有对数不等式的边界值！' }
  },

  stamp:{ label:{ ko:'경계값 탐정', en:'Boundary-Value Detective', zh:'边界值侦探' }, coins:62 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'증가함수의 방향을 완벽하게 지켜서 풀었구나! 📶',en:'You solved it while keeping the increasing function\'s direction perfectly!',zh:'你完美保持了增函数的方向！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'등호가 성립하는 경계값부터 찾아봐!',en:'First find the boundary value where equality holds!',zh:'先找出等号成立的边界值！'}, {ko:'밑이 1보다 크면 부등호 방향은 그대로 유지돼!',en:'When the base exceeds 1, the inequality direction stays the same!',zh:'底数大于1，不等号方向不变！'} ],
    finish:{ ko:'완벽해! 경계값 탐정! 📶✨', en:'Perfect! Boundary-Value Detective!', zh:'完美！边界值侦探！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
