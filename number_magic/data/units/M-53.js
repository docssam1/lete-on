/* Numbers of Magic — 유닛 M-53: 로그방정식 (대수 W13 심화, 2026-08-27) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-53'] = {
  id:'M-53', tier:'algebra', level:'44', order:2,
  generator:'md53_logEquation',
  title:{ ko:'로그방정식', en:'Logarithmic Equations', zh:'对数方程' },
  subtitle:{ ko:'log의 정의와 성질로 x를 찾아요', en:'Find x using the definition and properties of log', zh:'用log的定义和性质求x' },
  icon:'📜',

  practice:{
    generator:'md53_logEquation', level:'practice', count:5,
    params:{mode:'basic'},
    intro:{
      ko:'log_a N = k는 a^k = N이라는 뜻 — 이 정의만 기억하면 x가 들어 있는 진수(안쪽 값)도 찾을 수 있어요!',
      en:'log_a N = k means a^k = N — remembering just this definition lets you find x even when it\'s inside the argument!',
      zh:'log_a N = k就是a^k = N——只要记住这个定义，连藏在真数里的x也能求出！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'log₂(2x+1)=3이라는 식은 얼핏 복잡해 보이지만, log의 정의를 떠올리면 간단해요. "2를 3번 곱하면 (2x+1)이 된다"는 뜻이니, 2x+1=2³=8이 돼요.',
        en:'The equation log₂(2x+1)=3 looks complicated at first, but remembering the definition of log makes it simple. It means "2 multiplied 3 times gives (2x+1)", so 2x+1=2³=8.',
        zh:'log₂(2x+1)=3这个式子乍看很复杂，但想起log的定义就简单了。它的意思是"2乘3次得到(2x+1)"，所以2x+1=2³=8。' },
      history:{ ko:'로그방정식은 log가 "지수를 구하는 함수"라는 것만 알면 다 지수방정식으로 바꿔 풀 수 있어요. 실제로 log와 지수는 서로의 반대 방향(역함수) 관계예요.',
        en:'A log equation can always be turned into an exponential one once you remember that log is "the function that finds the exponent". In fact, log and exponentiation are inverse functions of each other.',
        zh:'只要记住log是"求指数的函数"，对数方程就都能转化成指数方程来解。事实上，log和指数互为反函数。' }
    },
    stages:[
      { tag:{ko:'① log의 정의로 x를 찾아요',en:'1) Use the definition of log to find x',zh:'① 用log的定义求x'},
        head:{ko:'\\log_2(2x+1)=3 \\;\\Rightarrow\\; x=\\dfrac{7}{2}',en:'\\log_2(2x+1)=3 \\;\\Rightarrow\\; x=\\dfrac{7}{2}',zh:'\\log_2(2x+1)=3 \\;\\Rightarrow\\; x=\\dfrac{7}{2}'},
        desc:{ko:'log₂(2x+1)=3은 정의에 따라 <b>2x+1=2³=8</b>이라는 뜻이에요. 이제 일차방정식 2x+1=8만 풀면 돼요. (실제 문항은 항상 정수 x가 나오도록 값이 골라져 있어요.)',
              en:'By definition, log₂(2x+1)=3 means <b>2x+1=2³=8</b>. Now just solve the linear equation 2x+1=8. (Actual problems are always set up so x comes out an integer.)',
              zh:'按定义log₂(2x+1)=3的意思就是<b>2x+1=2³=8</b>。现在只需解一次方程2x+1=8。(实际题目总会保证x是整数。)'},
        mathSteps:['2x+1=2^3', '2x+1=8', '2x=7'],
        result:{ko:'log_a N=k는 항상 a^k=N으로 바꿔서 풀어요!',en:'Always rewrite log_a N=k as a^k=N to solve!',zh:'log_a N=k总是改写成a^k=N来解！'},
        book:{ko:'log 안의 값(진수)은 항상 0보다 커야 해요 — 이걸 "진수 조건"이라고 불러요.',
              en:'The value inside log (the argument) must always be positive — this is called the "argument condition".',
              zh:'log里面的值(真数)必须永远大于0——这叫"真数条件"。'} },

      { tag:{ko:'② 로그의 덧셈 성질로 합쳐서 풀어요',en:'2) Combine with the addition property of logs',zh:'② 用对数的加法性质合并求解'},
        head:{ko:'\\log_2 x + \\log_2 3 = \\log_2 12 \\;\\Rightarrow\\; x=4',en:'\\log_2 x + \\log_2 3 = \\log_2 12 \\;\\Rightarrow\\; x=4',zh:'\\log_2 x + \\log_2 3 = \\log_2 12 \\;\\Rightarrow\\; x=4'},
        desc:{ko:'log_a X + log_a Y = log_a(XY) 성질을 쓰면 왼쪽이 log₂(3x)가 돼요. 그러면 log₂(3x)=log₂12 — <b>양쪽 진수가 같아야</b> 하니 3x=12, x=4.',
              en:'Using log_a X + log_a Y = log_a(XY), the left side becomes log₂(3x). Then log₂(3x)=log₂12 — since <b>the arguments must match</b>, 3x=12, so x=4.',
              zh:'用log_a X + log_a Y = log_a(XY)，左边变成log₂(3x)。于是log₂(3x)=log₂12——<b>两边真数必须相等</b>，3x=12，x=4。'},
        mathSteps:['\\log_2(3x)=\\log_2 12', '3x=12', 'x=4'],
        result:{ko:'같은 밑의 log끼리 값이 같으면, 진수끼리도 같아요!',en:'When logs with the same base are equal, their arguments are equal too!',zh:'同底的log值相等，真数也相等！'},
        book:{ko:'로그의 뺄셈 성질(log_a X - log_a Y = log_a(X÷Y))도 같은 방식으로 나눗셈으로 바꿔서 풀어요.',
              en:'The subtraction property of logs (log_a X - log_a Y = log_a(X÷Y)) is solved the same way, turning it into division.',
              zh:'对数的减法性质(log_a X - log_a Y = log_a(X÷Y))也用同样的方法化成除法求解。'} }
    ],
    rule:{ ko:'로그방정식: log_a N=k는 a^k=N으로, 로그끼리의 덧뺄셈은 곱나눗으로 바꿔서 x를 찾아요!',
      en:'Logarithmic equations: rewrite log_a N=k as a^k=N, and turn log addition/subtraction into multiplication/division to find x!',
      zh:'对数方程：把log_a N=k改写成a^k=N，把对数的加减化成乘除来求x！' }
  },

  check:{
    fills:[
      { tex:'\\log_3(x+1) = 2 \\;\\Rightarrow\\; x = \\square', answer:8,
        hint:{ ko:'x+1=3^2=9', en:'x+1=3^2=9', zh:'x+1=3^2=9' } },
      { tex:'\\log_2 x + \\log_2 5 = \\log_2 20 \\;\\Rightarrow\\; x = \\square', answer:4,
        hint:{ ko:'5x=20', en:'5x=20', zh:'5x=20' } }
    ],
    open:{ ko:'log₅(3x-1)=2를 log의 정의를 써서 설명해봐요.',
      en:'Explain log₅(3x-1)=2 using the definition of log.',
      zh:'用log的定义说说log₅(3x-1)=2。' },
    openHint:{ ko:'3x-1=5^2=25, x=26/3은 예시일 뿐 — 실제 문항은 정수해가 나오도록 값이 골라져 있어요',
      en:'3x-1=5^2=25 — this is just an illustration; actual problems are set up for an integer solution',
      zh:'3x-1=5^2=25——此为示意；实际题目会保证解是整数' }
  },

  lab:{
    generator:'md53_logEquation', level:'main', count:4,
    params:{mode:'sumEq',wide:true},
    intro:{
      ko:'로그의 덧셈 성질로 두 로그를 하나로 합친 뒤 진수끼리 비교해요!',
      en:'Combine two logs into one with the addition property, then compare the arguments!',
      zh:'用加法性质把两个对数合并成一个，再比较真数！'
    }
  },

  arena:{
    generator:'md53_logEquation', level:'main', count:8, timeLimit:300,
    params:{mode:'wide'},
    rule:{ ko:'5분 안에 로그의 뺄셈 성질까지 활용해서 모두 풀어요!', en:'Use the subtraction property too and solve them all within 5 minutes!', zh:'5分钟内连减法性质一起用上，全部解出！' }
  },

  stamp:{ label:{ ko:'로그방정식 해독가', en:'Log-Equation Decoder', zh:'对数方程解码员' }, coins:60 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'log의 정의로 완벽하게 x를 찾았구나! 📜',en:'You used the definition of log to find x perfectly!',zh:'你用log的定义完美求出了x！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'log_a N=k는 a^k=N으로 바꿔서 풀어봐!',en:'Rewrite log_a N=k as a^k=N and solve!',zh:'把log_a N=k改写成a^k=N来解！'}, {ko:'로그끼리 더하면 진수를 곱해서 하나로 합쳐!',en:'Adding logs multiplies the arguments together into one!',zh:'对数相加就是把真数相乘合并成一个！'} ],
    finish:{ ko:'완벽해! 로그방정식 해독가! 📜✨', en:'Perfect! Log-Equation Decoder!', zh:'完美！对数方程解码员！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
