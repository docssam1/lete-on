/* Numbers of Magic — 유닛 M-127: 함수의 개수와 일대일대응 (고등 공통수학2 · 과정 56 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD127. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-127'] = {
  id:'M-127', tier:'highmath2', level:'56', order:127,
  generator:'md127_funcCount',
  title:{ ko:'함수의 개수와 일대일대응', en:'Counting Functions', zh:'函数的个数与一一对应' },
  subtitle:{ ko:'원소마다 짝을 고르는 방법을 셉니다', en:'Count the ways to choose a partner for each element', zh:'数一数为每个元素选配对象的方法' },
  icon:'🎯',

  practice:{
    generator:'md127_funcCount', level:'practice', count:6,
    params:{mode:'count'},
    intro:{
      ko:'X 의 원소마다 Y 의 원소를 하나씩 고릅니다. 고르는 방법을 곱의 법칙으로 곱해 함수의 개수를 셉니다.',
      en:'Choose one element of Y for each element of X, and multiply the numbers of choices (the multiplication rule) to count the functions.',
      zh:'为X的每个元素各选一个Y的元素，用乘法原理把选法相乘，数出函数的个数。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'학생 3 명이 각자 좋아하는 과일을 사과·배 가운데 하나씩 적어 내는 방법은 몇 가지일까요? 학생마다 2 가지씩이니 2×2×2=8 가지입니다. 이것이 바로 함수의 개수입니다.',
        en:'In how many ways can 3 students each write down a favourite fruit, apple or pear? Each student has 2 choices, so 2×2×2=8 — exactly the number of functions.',
        zh:'3名学生各从苹果、梨中写下一种喜欢的水果，有多少种方法？每人2种，所以2×2×2=8种，这正是函数的个数。' }
    },
    stages:[
      { tag:{ko:'① 함수의 개수',en:'1) Number of functions',zh:'① 函数的个数'},
        head:{ko:'2\\times2\\times2=2^{3}=8',en:'2\\times2\\times2=2^{3}=8',zh:'2\\times2\\times2=2^{3}=8'},
        desc:{ko:'X={1, 2, 3}, Y={a, b} 이면 1, 2, 3 이 각각 a, b 가운데 하나를 고르므로 함수는 <b>8</b> 개입니다.',
              en:'For X={1, 2, 3} and Y={a, b}, each of 1, 2, 3 chooses a or b, so there are <b>8</b> functions.',
              zh:'X={1, 2, 3}、Y={a, b}时，1、2、3各从a、b中选一个，所以函数有<b>8</b>个。'},
        mathSteps:['2^{3}=8'],
        result:{ko:'원소마다 고르고 곱하기!',en:'Choose for each, then multiply!',zh:'逐个选，再相乘！'},
        book:{ko:'n(X)=m, n(Y)=n 이면 함수의 개수는 nᵐ 입니다. 지수는 X 의 원소의 개수입니다.',
              en:'If n(X)=m and n(Y)=n there are nᵐ functions; the exponent is the size of X.',
              zh:'n(X)=m、n(Y)=n时函数有nᵐ个，指数是X的元素个数。'} },

      { tag:{ko:'② 일대일함수',en:'2) One-to-one functions',zh:'② 单射'},
        head:{ko:'3\\times2=6',en:'3\\times2=6',zh:'3\\times2=6'},
        desc:{ko:'X={1, 2}, Y={a, b, c} 에서 일대일함수는 1 이 3 가지, 2 는 1 이 고른 것을 뺀 2 가지이므로 <b>6</b> 개입니다.',
              en:'For X={1, 2} and Y={a, b, c}, a one-to-one function lets 1 choose among 3 and 2 among the remaining 2: <b>6</b> functions.',
              zh:'X={1, 2}、Y={a, b, c}时，单射中1有3种选法，2只能选剩下的2种，共<b>6</b>个。'},
        mathSteps:['{}_{3}\\mathrm{P}_{2}=6'],
        result:{ko:'고른 것은 다시 고르지 않습니다!',en:'No repeats allowed!',zh:'选过的不能再选！'},
        book:{ko:'n(X)=n(Y)=n 인 일대일대응은 n! 개입니다. X={1, 2, 3}, Y={a, b, c} 이면 3!=6 개입니다.',
              en:'With n(X)=n(Y)=n there are n! one-to-one correspondences; for X={1, 2, 3}, Y={a, b, c}, 3!=6.',
              zh:'n(X)=n(Y)=n时一一对应有n!个；X={1, 2, 3}、Y={a, b, c}时有3!=6个。'} },

      { tag:{ko:'③ 일대일대응의 조건',en:'3) Conditions for a correspondence',zh:'③ 一一对应的条件'},
        head:{ko:'f(1)=2,\\ f(3)=8\\ \\Rightarrow\\ a=3,\\ b=-1',en:'f(1)=2,\\ f(3)=8\\ \\Rightarrow\\ a=3,\\ b=-1',zh:'f(1)=2,\\ f(3)=8\\ \\Rightarrow\\ a=3,\\ b=-1'},
        desc:{ko:'X={x | 1≤x≤3} 에서 Y={y | 2≤y≤8} 로의 f(x)=ax+b(a>0) 가 일대일대응이면 f(1)=2, f(3)=8 입니다. 2a=6 에서 a=<b>3</b>, b=<b>−1</b> 입니다.',
              en:'If f(x)=ax+b (a>0) is a one-to-one correspondence from X={x | 1≤x≤3} to Y={y | 2≤y≤8}, then f(1)=2 and f(3)=8. From 2a=6, a=<b>3</b> and b=<b>−1</b>.',
              zh:'若f(x)=ax+b(a>0)是从X={x | 1≤x≤3}到Y={y | 2≤y≤8}的一一对应，则f(1)=2、f(3)=8。由2a=6得a=<b>3</b>，b=<b>−1</b>。'},
        mathSteps:['a+b=2','3a+b=8'],
        result:{ko:'끝은 끝으로!',en:'Ends go to ends!',zh:'端点对端点！'},
        book:{ko:'a<0 이면 그래프가 내려가므로 f(1)=8, f(3)=2 로 엇갈려 대응합니다.',
              en:'If a<0 the graph goes down, so the ends cross over: f(1)=8 and f(3)=2.',
              zh:'a<0时图像下降，端点交叉对应：f(1)=8，f(3)=2。'} }
    ],
    rule:{ ko:'① 함수의 개수 nᵐ  ② 일대일함수 ₙPₘ, 일대일대응 n!  ③ 일차함수의 일대일대응은 끝점끼리 대응',
      en:'① Functions: nᵐ  ② One-to-one functions ₙPₘ, correspondences n!  ③ A linear correspondence maps ends to ends',
      zh:'① 函数个数nᵐ  ② 单射ₙPₘ，一一对应n!  ③ 一次函数的一一对应是端点对端点' }
  },

  check:{
    fills:[
      { tex:{ko:'X=\\{1,2\\},\\ Y=\\{a,b,c,d\\}\\ \\Rightarrow\\ 4^{2}=\\square',en:'X=\\{1,2\\},\\ Y=\\{a,b,c,d\\}\\ \\Rightarrow\\ 4^{2}=\\square',zh:'X=\\{1,2\\},\\ Y=\\{a,b,c,d\\}\\ \\Rightarrow\\ 4^{2}=\\square'}, answer:16,
        hint:{ ko:'1 과 2 가 각각 4 가지', en:'1 and 2 have 4 choices each', zh:'1和2各有4种' } },
      { tex:{ko:'X=\\{1,2,3\\},\\ Y=\\{a,b,c\\}\\ \\Rightarrow\\ 3!=\\square',en:'X=\\{1,2,3\\},\\ Y=\\{a,b,c\\}\\ \\Rightarrow\\ 3!=\\square',zh:'X=\\{1,2,3\\},\\ Y=\\{a,b,c\\}\\ \\Rightarrow\\ 3!=\\square'}, answer:6,
        hint:{ ko:'일대일대응의 개수 3×2×1', en:'One-to-one correspondences: 3×2×1', zh:'一一对应的个数3×2×1' } }
    ],
    open:{ ko:'n(X)=3, n(Y)=2 일 때 X 에서 Y 로의 일대일함수가 하나도 없는 까닭을 설명해 봅니다.',
      en:'Explain why there is no one-to-one function from X to Y when n(X)=3 and n(Y)=2.',
      zh:'说说n(X)=3、n(Y)=2时为什么不存在从X到Y的单射。' },
    openHint:{ ko:'서로 다른 원소 3 개에 서로 다른 값 3 개가 필요한데 Y 에는 2 개뿐이므로 두 원소는 같은 값을 가질 수밖에 없습니다.',
      en:'Three different elements need three different values, but Y has only 2, so two elements must share a value.',
      zh:'3个不同元素需要3个不同的值，而Y只有2个，所以必有两个元素取同一个值。' }
  },

  lab:{
    generator:'md127_funcCount', level:'main', count:6,
    params:{mode:'bij'},
    intro:{
      ko:'일대일함수는 고른 값을 다시 고를 수 없으므로 하나씩 줄여 가며 곱합니다. 조건이 붙으면 그 원소부터 먼저 정합니다.',
      en:'A one-to-one function cannot reuse a value, so multiply decreasing numbers. If there is a condition, fix that element first.',
      zh:'单射不能重复取值，所以依次递减相乘。若有条件，先确定那个元素。'
    }
  },

  arena:{
    generator:'md127_funcCount', level:'main', count:6, timeLimit:420,
    params:{mode:'coef'},
    rule:{ ko:'7분 안에 일대일대응이 되는 a, b 를 모두 찾습니다!', en:'Find every a and b that make a one-to-one correspondence within 7 minutes!', zh:'7分钟内求出使函数成为一一对应的所有a、b！' }
  },

  stamp:{ label:{ ko:'짝꿍 배정관', en:'Pairing Officer', zh:'配对分配官' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'짝을 빠짐없이 셌어! 🎯',en:'You counted every pairing!',zh:'配对一个不漏！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'원소마다 고를 수 있는 개수를 곱해 봐!',en:'Multiply the choices for each element!',zh:'把每个元素的选法相乘！'}, {ko:'일대일이면 하나씩 줄여 가!',en:'For one-to-one, decrease one at a time!',zh:'单射要逐个递减！'} ],
    finish:{ ko:'완벽해! 짝꿍 배정관! 🎯✨', en:'Perfect! Pairing Officer!', zh:'完美！配对分配官！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
