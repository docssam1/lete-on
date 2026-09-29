/* Numbers of Magic — 유닛 M-138: 로그함수의 그래프 (고등 대수 · 과정 62 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD138. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-138'] = {
  id:'M-138', tier:'algebra', level:'62', order:138,
  generator:'md138_logGraph',
  title:{ ko:'로그함수의 그래프', en:'Graphs of Logarithmic Functions', zh:'对数函数的图像' },
  subtitle:{ ko:'지수함수를 y=x 에 비춘 곡선', en:'The exponential curve reflected in y=x', zh:'指数曲线关于y=x的镜像' },
  icon:'🪵',

  practice:{
    generator:'md138_logGraph', level:'practice', count:6,
    params:{mode:'point'},
    intro:{
      ko:'진수가 밑의 거듭제곱이 되는 x 를 넣으면 로그의 값이 정수가 됩니다. 진수 x−p 가 0 보다 커야 하므로 점근선은 x=p 입니다.',
      en:'Substitute an x that makes the argument a power of the base, and the logarithm becomes an integer. The argument x−p must be positive, so the asymptote is x=p.',
      zh:'代入使真数成为底数的幂的x，对数值就是整数。真数x−p必须大于0，所以渐近线是x=p。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'y=2ˣ 의 그래프를 직선 y=x 에 대하여 뒤집으면 y=log₂x 의 그래프가 됩니다. 이번에는 곡선이 y축에 다가가며 끝내 닿지 않습니다.',
        en:'Reflect the graph of y=2ˣ in the line y=x and you get y=log₂x. This time the curve approaches the y-axis without ever touching it.',
        zh:'把y=2ˣ的图像关于直线y=x翻转，就得到y=log₂x的图像。这次曲线无限接近y轴却永远碰不到。' }
    },
    stages:[
      { tag:{ko:'① 점과 점근선',en:'1) Points and asymptote',zh:'① 点与渐近线'},
        head:{ko:'y=\\log_{2}(x-1)+3:\\ (5,\\ 5),\\ x=1',en:'y=\\log_{2}(x-1)+3:\\ (5,\\ 5),\\ x=1',zh:'y=\\log_{2}(x-1)+3:\\ (5,\\ 5),\\ x=1'},
        desc:{ko:'x=5 이면 y=log₂4+3=<b>5</b> 입니다. 진수 x−1>0 에서 x>1 이므로 점근선은 <b>x=1</b> 입니다.',
              en:'At x=5, y=log₂4+3=<b>5</b>. The argument needs x−1>0, i.e. x>1, so the asymptote is <b>x=1</b>.',
              zh:'x=5时y=log₂4+3=<b>5</b>。真数x−1>0即x>1，所以渐近线是<b>x=1</b>。'},
        mathSteps:['\\log_{2}4+3=5','x-1>0\\ \\Rightarrow\\ x>1'],
        result:{ko:'진수를 밑의 거듭제곱으로!',en:'Make the argument a power of the base!',zh:'让真数成为底数的幂！'},
        book:{ko:'밑과 관계없이 x=2 이면 진수가 1 이라 로그가 0 이므로, y=logₐ(x−1)+3 은 언제나 (2, 3) 을 지납니다.',
              en:'Whatever the base, at x=2 the argument is 1 and the logarithm is 0, so y=logₐ(x−1)+3 always passes through (2, 3).',
              zh:'无论底数是多少，x=2时真数为1、对数为0，所以y=logₐ(x−1)+3总经过(2, 3)。'} },

      { tag:{ko:'② y=x 에 대한 대칭',en:'2) Reflection in y=x',zh:'② 关于y=x对称'},
        head:{ko:'y=\\log_{3}x\\ \\xrightarrow{(x,\\,y)\\to(y,\\,x)}\\ y=3^{x}',en:'y=\\log_{3}x\\ \\xrightarrow{(x,\\,y)\\to(y,\\,x)}\\ y=3^{x}',zh:'y=\\log_{3}x\\ \\xrightarrow{(x,\\,y)\\to(y,\\,x)}\\ y=3^{x}'},
        desc:{ko:'x 와 y 를 바꾸면 x=log₃y, 곧 y=3ˣ 입니다. 그래서 f(2)=3²=<b>9</b> 입니다.',
              en:'Swapping x and y gives x=log₃y, that is y=3ˣ. So f(2)=3²=<b>9</b>.',
              zh:'交换x与y得x=log₃y，即y=3ˣ。所以f(2)=3²=<b>9</b>。'},
        mathSteps:['x=\\log_{3}y\\ \\Leftrightarrow\\ y=3^{x}','f(2)=9'],
        result:{ko:'로그와 지수는 서로 역함수!',en:'Logarithms and exponentials are inverses!',zh:'对数与指数互为反函数！'},
        book:{ko:'평행이동 (x, y)→(x+m, y+n) 은 지수함수에서처럼 x 대신 x−m, y 대신 y−n 을 넣습니다.',
              en:'For a translation (x, y)→(x+m, y+n), replace x by x−m and y by y−n, just as for exponential functions.',
              zh:'平移(x, y)→(x+m, y+n)与指数函数一样，把x换成x−m，y换成y−n。'} },

      { tag:{ko:'③ 크기 비교',en:'3) Comparing sizes',zh:'③ 比较大小'},
        head:{ko:'A=\\log_{4}9,\\ B=\\frac{1}{2}\\log_{2}36,\\ C=-\\log_{\\frac{1}{2}}12',en:'A=\\log_{4}9,\\ B=\\frac{1}{2}\\log_{2}36,\\ C=-\\log_{\\frac{1}{2}}12',zh:'A=\\log_{4}9,\\ B=\\frac{1}{2}\\log_{2}36,\\ C=-\\log_{\\frac{1}{2}}12'},
        desc:{ko:'A=log₂3, B=log₂6, C=log₂12 이므로 A<B<C 입니다. M−m=log₂12−log₂3=log₂4=<b>2</b> 입니다.',
              en:'A=log₂3, B=log₂6, C=log₂12, so A<B<C and M−m=log₂12−log₂3=log₂4=<b>2</b>.',
              zh:'A=log₂3，B=log₂6，C=log₂12，所以A<B<C，M−m=log₂12−log₂3=log₂4=<b>2</b>。'},
        mathSteps:['\\log_{2}3<\\log_{2}6<\\log_{2}12','M-m=\\log_{2}\\frac{12}{3}=2'],
        result:{ko:'밑을 맞추면 진수만 비교!',en:'Same base, compare arguments only!',zh:'底数相同只比真数！'},
        book:{ko:'log₄9=log₂9÷log₂4=log₂9÷2=log₂3 처럼 밑을 바꿉니다.',
              en:'Change the base like log₄9=log₂9÷log₂4=log₂9÷2=log₂3.',
              zh:'像log₄9=log₂9÷log₂4=log₂9÷2=log₂3这样换底。'} }
    ],
    rule:{ ko:'① 점근선 x=p, 진수를 밑의 거듭제곱으로 만들어 점 구하기  ② (x, y)→(y, x) 는 역함수 aˣ  ③ 밑을 같게 해서 진수 비교',
      en:'① Asymptote x=p; make the argument a power of the base to get points  ② (x, y)→(y, x) gives the inverse aˣ  ③ Use a common base and compare arguments',
      zh:'① 渐近线x=p，让真数成为底数的幂求点  ② (x, y)→(y, x)得反函数aˣ  ③ 化成同底比较真数' }
  },

  check:{
    fills:[
      { tex:{ko:'y=\\log_{3}(x+2)-1:\\ x=7\\ \\Rightarrow\\ y=\\square',en:'y=\\log_{3}(x+2)-1:\\ x=7\\ \\Rightarrow\\ y=\\square',zh:'y=\\log_{3}(x+2)-1:\\ x=7\\ \\Rightarrow\\ y=\\square'}, answer:1,
        hint:{ ko:'log₃9−1', en:'log₃9−1', zh:'log₃9−1' } },
      { tex:{ko:'y=\\log_{2}(x-4)+1\\ \\Rightarrow\\ x=\\square',en:'y=\\log_{2}(x-4)+1\\ \\Rightarrow\\ x=\\square',zh:'y=\\log_{2}(x-4)+1\\ \\Rightarrow\\ x=\\square'}, answer:4,
        hint:{ ko:'점근선: x−4>0', en:'asymptote: x−4>0', zh:'渐近线：x−4>0' } }
    ],
    open:{ ko:'y=log₂x 의 그래프가 y=2ˣ 의 그래프와 직선 y=x 에 대하여 대칭인 까닭을 설명해 봅니다.',
      en:'Explain why the graph of y=log₂x is the reflection of y=2ˣ in the line y=x.',
      zh:'说说为什么y=log₂x的图像与y=2ˣ的图像关于直线y=x对称。' },
    openHint:{ ko:'점 (a, b) 가 y=2ˣ 위에 있으면 b=2ᵃ, 곧 a=log₂b 이므로 점 (b, a) 가 y=log₂x 위에 있습니다. 좌표를 바꾼 점은 y=x 에 대하여 대칭입니다.',
      en:'If (a, b) is on y=2ˣ, then b=2ᵃ, i.e. a=log₂b, so (b, a) is on y=log₂x. Swapping the coordinates is reflecting in y=x.',
      zh:'点(a, b)在y=2ˣ上时b=2ᵃ，即a=log₂b，所以点(b, a)在y=log₂x上。交换坐标的点关于y=x对称。' }
  },

  lab:{
    generator:'md138_logGraph', level:'main', count:6,
    params:{mode:'move'},
    intro:{
      ko:'옮긴 점을 (X, Y) 로 놓고 x, y 를 X, Y 로 나타내 원래 식에 넣습니다. f(c) 의 진수가 밑의 거듭제곱이 되는지 확인합니다.',
      en:'Call the moved point (X, Y), write x and y in terms of X and Y, and substitute. Check that the argument of f(c) is a power of the base.',
      zh:'设移动后的点为(X, Y)，用X、Y表示x、y后代入原式。检查f(c)的真数是否为底数的幂。'
    }
  },

  arena:{
    generator:'md138_logGraph', level:'main', count:6, timeLimit:420,
    params:{mode:'order'},
    rule:{ ko:'7분 안에 밑을 맞추어 가장 큰 로그와 가장 작은 로그의 차를 모두 구합니다!', en:'Match the bases and find every difference between the largest and smallest logarithm within 7 minutes!', zh:'7分钟内统一底数，求出所有最大与最小对数的差！' }
  },

  stamp:{ label:{ ko:'거울 나무꾼', en:'Mirror Woodcutter', zh:'镜面樵夫' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'진수를 딱 맞췄어! 🪵',en:'Argument matched exactly!',zh:'真数对得正好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'진수가 0 보다 커야 해!',en:'The argument must be positive!',zh:'真数必须大于0！'}, {ko:'밑을 같게 바꿔 봐!',en:'Change to the same base!',zh:'换成相同的底数试试！'} ],
    finish:{ ko:'완벽해! 거울 나무꾼! 🪵✨', en:'Perfect! Mirror Woodcutter!', zh:'完美！镜面樵夫！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
