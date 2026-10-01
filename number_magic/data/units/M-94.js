/* Numbers of Magic — 유닛 M-94: 인수분해를 이용한 수의 계산 (고등 공통수학1 · 과정 39, 2026-09-29)
   근거: docs/high-build-spec.md MD94. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-94'] = {
  id:'M-94', tier:'highmath1', level:'39', order:94,
  generator:'md94_factorArith',
  title:{ ko:'인수분해를 이용한 수의 계산', en:'Arithmetic by Factoring', zh:'利用因式分解计算' },
  subtitle:{ ko:'큰 수도 공식 모양으로 바꾸면 암산이 됩니다', en:'Reshape big numbers into a formula and they become mental math', zh:'把大数变成公式的样子就能心算' },
  icon:'⚡',

  practice:{
    generator:'md94_factorArith', level:'practice', count:6,
    params:{mode:'diffSq'},
    intro:{
      ko:'a²−b²=(a+b)(a−b)입니다. a+b가 딱 떨어지는 수가 되는지 먼저 봅니다.',
      en:'a²−b²=(a+b)(a−b). First check whether a+b is a round number.',
      zh:'a²−b²=(a+b)(a−b)。先看a+b是不是整十整百的数。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'57²−43²을 그대로 계산하면 3249−1849입니다. 그런데 57+43=100이라는 것을 알아차리면 100×14=1400으로 바로 끝납니다.',
        en:'Computing 57²−43² directly means 3249−1849. But notice that 57+43=100, and it is simply 100×14=1400.',
        zh:'直接算57²−43²就是3249−1849。可一旦注意到57+43=100，马上就是100×14=1400。' },
      history:{ ko:'인수분해 공식은 문자식을 정리하는 도구이면서 계산을 줄이는 도구이기도 합니다. 문자에 수를 넣어도 등식은 그대로 성립하기 때문입니다.',
        en:'Factoring formulas tidy up algebraic expressions, and they also cut down arithmetic — because the identities stay true when numbers replace the letters.',
        zh:'因式分解公式既能整理代数式，也能简化计算——因为把字母换成数，恒等式照样成立。' }
    },
    stages:[
      { tag:{ko:'① 제곱의 차는 합과 차의 곱',en:'1) A difference of squares is sum times difference',zh:'① 平方差是和乘差'},
        head:{ko:'57^2-43^2=(57+43)(57-43)',en:'57^2-43^2=(57+43)(57-43)',zh:'57^2-43^2=(57+43)(57-43)'},
        desc:{ko:'a=57, b=43으로 보면 a+b=100, a−b=14입니다. 곱하면 <b>1400</b>입니다.',
              en:'With a=57 and b=43, a+b=100 and a−b=14. Their product is <b>1400</b>.',
              zh:'看作a=57、b=43，a+b=100、a−b=14，相乘得<b>1400</b>。'},
        mathSteps:['=100\\times14', '=1400'],
        result:{ko:'제곱 두 번 대신 곱셈 한 번입니다!',en:'One multiplication instead of two squares!',zh:'用一次乘法代替两次平方！'},
        book:{ko:'101×99도 (100+1)(100−1)=100²−1=9999로 같은 공식을 거꾸로 씁니다.',
              en:'101×99 uses the same formula in reverse: (100+1)(100−1)=100²−1=9999.',
              zh:'101×99反过来用同一公式：(100+1)(100−1)=100²−1=9999。'} },

      { tag:{ko:'② 가까운 깔끔한 수로 제곱하기',en:'2) Square via a nearby round number',zh:'② 借助相近的整数平方'},
        head:{ko:'103^2=(100+3)^2',en:'103^2=(100+3)^2',zh:'103^2=(100+3)^2'},
        desc:{ko:'(a+b)²=a²+2ab+b²에 a=100, b=3을 넣으면 10000+600+9=<b>10609</b>입니다.',
              en:'Put a=100 and b=3 into (a+b)²=a²+2ab+b²: 10000+600+9=<b>10609</b>.',
              zh:'把a=100、b=3代入(a+b)²=a²+2ab+b²：10000+600+9=<b>10609</b>。'},
        mathSteps:['=10000+600+9', '=10609'],
        result:{ko:'깔끔한 수에 가까우면 완전제곱식으로 펼칩니다!',en:'Near a round number? Expand as a perfect square!',zh:'接近整数就用完全平方式展开！'},
        book:{ko:'98²은 (100−2)²=10000−400+4=9604입니다. 가운데 항의 부호만 바뀝니다.',
              en:'98²=(100−2)²=10000−400+4=9604 — only the sign of the middle term changes.',
              zh:'98²=(100−2)²=10000−400+4=9604——只有中间项的符号变了。'} },

      { tag:{ko:'③ 세제곱도 같은 방법',en:'3) Cubes work the same way',zh:'③ 立方也是同样的方法'},
        head:{ko:'11^3=(10+1)^3',en:'11^3=(10+1)^3',zh:'11^3=(10+1)^3'},
        desc:{ko:'(a+b)³=a³+3a²b+3ab²+b³에 a=10, b=1을 넣으면 1000+300+30+1=<b>1331</b>입니다.',
              en:'Put a=10 and b=1 into (a+b)³=a³+3a²b+3ab²+b³: 1000+300+30+1=<b>1331</b>.',
              zh:'把a=10、b=1代入(a+b)³=a³+3a²b+3ab²+b³：1000+300+30+1=<b>1331</b>。'},
        mathSteps:['=1000+300+30+1', '=1331'],
        result:{ko:'네 항으로 펼치면 세제곱도 암산이 됩니다!',en:'Four terms, and even a cube is mental math!',zh:'展开成四项，立方也能心算！'},
        book:{ko:'거꾸로 7³+3×7²×3+3×7×3²+3³처럼 네 항이 보이면 (7+3)³=1000으로 묶습니다.',
              en:'In reverse, four terms like 7³+3×7²×3+3×7×3²+3³ group into (7+3)³=1000.',
              zh:'反过来，看到7³+3×7²×3+3×7×3²+3³这样的四项，就合成(7+3)³=1000。'} }
    ],
    rule:{ ko:'① a²−b²=(a+b)(a−b)  ② (a±b)²=a²±2ab+b²  ③ (a±b)³=a³±3a²b+3ab²±b³ — 깔끔한 수를 만들도록 묶습니다',
      en:'① a²−b²=(a+b)(a−b)  ② (a±b)²=a²±2ab+b²  ③ (a±b)³=a³±3a²b+3ab²±b³ — group to make round numbers',
      zh:'① a²−b²=(a+b)(a−b)  ② (a±b)²=a²±2ab+b²  ③ (a±b)³=a³±3a²b+3ab²±b³——凑成整数来组合' }
  },

  check:{
    fills:[
      { tex:'65^2-35^2=\\square', answer:3000,
        hint:{ ko:'100×30', en:'100×30', zh:'100×30' } },
      { tex:'99^2=\\square', answer:9801,
        hint:{ ko:'10000−200+1', en:'10000−200+1', zh:'10000−200+1' } }
    ],
    open:{ ko:'38²+2×38×12+12²을 쉽게 계산하는 방법을 설명해 봅니다.',
      en:'Explain an easy way to compute 38²+2×38×12+12².',
      zh:'说说38²+2×38×12+12²的简便算法。' },
    openHint:{ ko:'(38+12)²=50²=2500입니다.',
      en:'(38+12)²=50²=2500.',
      zh:'(38+12)²=50²=2500。' }
  },

  lab:{
    generator:'md94_factorArith', level:'main', count:6,
    params:{mode:'perfectSq'},
    intro:{
      ko:'깔끔한 수에 가까운 수의 제곱과 완전제곱식 묶기를 연습합니다.',
      en:'Practise squaring numbers near round ones and grouping perfect squares.',
      zh:'练习接近整数的数的平方和完全平方式的组合。'
    }
  },

  arena:{
    generator:'md94_factorArith', level:'main', count:6, timeLimit:420,
    params:{mode:'cube'},
    rule:{ ko:'7분 안에 세제곱 공식으로 큰 수의 세제곱을 모두 계산합니다!', en:'Compute every big cube with the cube formulas within 7 minutes!', zh:'7分钟内用立方公式算出所有大数的立方！' }
  },

  stamp:{ label:{ ko:'번개 계산사', en:'Lightning Calculator', zh:'闪电计算师' }, coins:48 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'공식으로 번개처럼 계산했구나! ⚡',en:'Lightning-fast with the formula!',zh:'用公式算得像闪电一样快！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'a+b가 딱 떨어지는 수인지 먼저 봐!',en:'First check whether a+b is a round number!',zh:'先看a+b是不是整数！'}, {ko:'가운데 항 2ab를 빠뜨리지 않았는지 확인해 봐!',en:'Check you did not drop the middle term 2ab!',zh:'看看有没有漏掉中间项2ab！'} ],
    finish:{ ko:'완벽해! 번개 계산사! ⚡✨', en:'Perfect! Lightning Calculator!', zh:'完美！闪电计算师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
