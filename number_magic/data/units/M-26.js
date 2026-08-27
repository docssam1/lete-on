/* Numbers of Magic — 유닛 M-26: 이차방정식의 판별식 (고등 W11 · 공통수학1 방정식과 부등식) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-26'] = {
  id:'M-26', tier:'highmath1', level:'37', order:26,
  generator:'md26_discriminant',
  title:{ ko:'이차방정식의 판별식', en:'The Discriminant', zh:'二次方程的判别式' },
  subtitle:{ ko:'근을 구하기 전에 몇 개인지 미리 아는 정찰병', en:'The scout that tells you the root count before you find them', zh:'求根之前先知道有几个根的侦察兵' },
  icon:'🔭',

  practice:{
    generator:'md26_discriminant', level:'practice', count:5,
    params:{mode:'value'},
    intro:{
      ko:'x²-5x+6=0의 근을 구하기 전에, D=b²-4ac=25-24=1부터 계산해봐요. D>0이니 서로 다른 두 실근이 있다는 걸 미리 알 수 있어요.',
      en:'Before solving x²-5x+6=0, compute D=b²-4ac=25-24=1 first. Since D>0, you already know there are two distinct real roots.',
      zh:'求解x²-5x+6=0之前，先算D=b²-4ac=25-24=1。D>0，就已经知道有两个不同的实根。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'이차방정식은 근이 2개, 1개, 또는 0개일 수 있어요. 근의 공식으로 직접 풀어보지 않고도 몇 개인지 미리 알 방법이 있을까요?',
        en:'A quadratic equation can have 2, 1, or 0 roots. Is there a way to know the count in advance, without solving with the quadratic formula first?',
        zh:'二次方程可能有2个、1个或0个根。不用先套求根公式，有没有办法提前知道有几个？' },
      history:{ ko:'근의 공식 x=(-b±√(b²-4ac))/(2a) 안을 자세히 보면, 근호 안의 b²-4ac라는 값이 근의 운명을 결정해요. 이 값이 양수·0·음수 중 무엇이냐에 따라 √ 안이 실수가 되는지, 근이 겹치는지가 갈려요 — 그래서 "판별식"이라는 이름이 붙었어요.',
        en:'Look closely inside the quadratic formula x=(-b±√(b²-4ac))/(2a) — the value b²-4ac under the root decides the roots\' fate. Whether it\'s positive, zero, or negative determines whether the square root is real and whether the roots coincide — hence the name "discriminant."',
        zh:'仔细看求根公式x=(-b±√(b²-4ac))/(2a)——根号内的b²-4ac决定了根的命运。它是正、是零还是负，决定了根号内是否为实数、根是否重合——因此得名"判别式"。' }
    },
    stages:[
      { tag:{ko:'① D=b²-4ac를 계산',en:'1) Compute D=b²-4ac',zh:'① 计算D=b²-4ac'},
        head:{ko:'x^2-5x+6=0 \\;\\Rightarrow\\; D=1',en:'x^2-5x+6=0 \\;\\Rightarrow\\; D=1',zh:'x^2-5x+6=0 \\;\\Rightarrow\\; D=1'},
        desc:{ko:'a=1, b=-5, c=6이니 D=(-5)²-4×1×6=25-24=<b>1</b>. D>0이므로 서로 다른 두 실근이 있어요(실제로는 x=2,3).',
              en:'With a=1, b=-5, c=6: D=(-5)²-4×1×6=25-24=<b>1</b>. Since D>0, there are two distinct real roots (in fact x=2,3).',
              zh:'a=1，b=-5，c=6：D=(-5)²-4×1×6=25-24=<b>1</b>。D>0，说明有两个不同实根(实际上x=2,3)。'},
        mathSteps:['D=(-5)^2-4\\times1\\times6', '=25-24', '=1'],
        result:{ko:'D>0이면 서로 다른 두 실근!',en:'D>0 means two distinct real roots!',zh:'D>0是两个不同实根！'},
        book:{ko:'D>0: 서로 다른 두 실근, D=0: 중근(1개), D<0: 실근 없음 — 근을 구하지 않고도 미리 알 수 있어요.',
              en:'D>0: two distinct real roots, D=0: a repeated root, D<0: no real roots — knowable in advance, without solving.',
              zh:'D>0：两个不同实根，D=0：重根，D<0：没有实根——不用求根就能提前知道。'} },

      { tag:{ko:'② D=0이면 근이 겹친다',en:'2) D=0 means the roots coincide',zh:'② D=0说明根重合'},
        head:{ko:'x^2-4x+4=0 \\;\\Rightarrow\\; D=0',en:'x^2-4x+4=0 \\;\\Rightarrow\\; D=0',zh:'x^2-4x+4=0 \\;\\Rightarrow\\; D=0'},
        desc:{ko:'D=(-4)²-4×1×4=16-16=<b>0</b>. 근의 공식에서 √D=0이 되어 x=(-b)/(2a)=2 하나로 합쳐져요. 실제로 x²-4x+4=(x-2)²이라 근이 정확히 2에서 겹쳐요.',
              en:'D=(-4)²-4×1×4=16-16=<b>0</b>. With √D=0 in the formula, the two solutions collapse into one: x=(-b)/(2a)=2. Indeed, x²-4x+4=(x-2)², so the root doubles up exactly at 2.',
              zh:'D=(-4)²-4×1×4=16-16=<b>0</b>。求根公式中√D=0，两个解合并成一个：x=(-b)/(2a)=2。事实上x²-4x+4=(x-2)²，根恰好在2重合。'},
        mathSteps:['D=(-4)^2-4\\times1\\times4', '=16-16=0', 'x=\\frac{-(-4)}{2}=2'],
        result:{ko:'D=0이면 중근 하나로 합쳐져요!',en:'D=0 collapses the roots into one repeated root!',zh:'D=0时根合并成一个重根！'},
        book:{ko:'중근 조건 D=0은 완전제곱식(x-p)²=0과 같은 뜻이에요 — 인수분해로도 확인할 수 있어요.',
              en:'The condition D=0 is the same as a perfect square (x-p)²=0 — you can also confirm it by factoring.',
              zh:'重根条件D=0和完全平方式(x-p)²=0是一回事——也可以用因式分解验证。'} }
    ],
    rule:{ ko:'① D=b²-4ac를 먼저 계산  ② D>0 두 실근, D=0 중근, D<0 실근 없음',
      en:'① Compute D=b²-4ac first  ② D>0 two roots, D=0 a repeated root, D<0 no real roots',
      zh:'① 先算D=b²-4ac  ② D>0两实根，D=0重根，D<0无实根' }
  },

  check:{
    fills:[
      { tex:'x^2 + 2x - 8 = 0 \\;\\Rightarrow\\; D = \\square', answer:36,
        hint:{ ko:'4-4×1×(-8)=4+32=36', en:'4-4×1×(-8)=4+32=36', zh:'4-4×1×(-8)=4+32=36' } },
      { tex:'x^2 - 6x + 9 = 0 \\;\\Rightarrow\\; \\square', answer:1,
        hint:{ ko:'D=36-36=0 → 중근(1개)', en:'D=36-36=0 → repeated root (1)', zh:'D=36-36=0 → 重根(1个)' } }
    ],
    open:{ ko:'x²+kx+9=0이 중근을 갖도록 하는 양수 k를 구하는 과정을 설명해봐요.',
      en:'Explain how to find the positive k for which x²+kx+9=0 has a repeated root.',
      zh:'说说求使x²+kx+9=0有重根的正数k的过程。' },
    openHint:{ ko:'D=k²-36=0 → k²=36 → k=6(양수)',
      en:'D=k²-36=0 → k²=36 → k=6 (positive)',
      zh:'D=k²-36=0 → k²=36 → k=6(取正数)' }
  },

  lab:{
    generator:'md26_discriminant', level:'main', count:4,
    params:{mode:'count'},
    intro:{
      ko:'이번엔 D의 부호만 보고 근이 몇 개인지 판정해봐.',
      en:'This time, judge the number of roots from the sign of D alone.',
      zh:'这次只看D的符号来判断有几个根。'
    }
  },

  arena:{
    generator:'md26_discriminant', level:'main', count:8, timeLimit:300,
    params:{mode:'unknownK'},
    rule:{ ko:'5분 안에 중근 조건으로 계수를 역산하는 문제를 모두 풀어요!', en:'Solve all the repeated-root coefficient problems in 5 minutes!', zh:'5分钟内解答所有由重根条件反求系数的题！' }
  },

  stamp:{ label:{ ko:'판별식 정찰병', en:'Discriminant Scout', zh:'判别式侦察兵' }, coins:47 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'근을 구하지 않고도 미리 알아냈구나! 🔭',en:'You knew it in advance, without even solving!',zh:'不用求根就提前知道了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'D=b²-4ac부터 계산해봐!',en:'Compute D=b²-4ac first!',zh:'先算D=b²-4ac！'}, {ko:'D>0 두 근, D=0 중근, D<0 근 없음이야!',en:'D>0 two roots, D=0 a repeated root, D<0 no roots!',zh:'D>0两根，D=0重根，D<0无根！'} ],
    finish:{ ko:'완벽해! 판별식 정찰병! 🔭✨', en:'Perfect! Discriminant Scout!', zh:'完美！判别式侦察兵！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
