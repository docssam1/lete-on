/* Numbers of Magic — 유닛 M-128: 합성함수 (고등 공통수학2 · 과정 57 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD128. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-128'] = {
  id:'M-128', tier:'highmath2', level:'57', order:128,
  generator:'md128_compose',
  title:{ ko:'합성함수', en:'Composite Functions', zh:'复合函数' },
  subtitle:{ ko:'함수의 출력을 다시 입력으로 넣습니다', en:'Feed one function’s output into another', zh:'把一个函数的输出再作为输入' },
  icon:'🔗',

  practice:{
    generator:'md128_compose', level:'practice', count:6,
    params:{mode:'value'},
    intro:{
      ko:'(f∘g)(a) 는 g(a) 를 먼저 구하고, 그 값을 f 에 넣습니다. 오른쪽 함수부터 적용합니다.',
      en:'For (f∘g)(a), find g(a) first and then put it into f: apply the right-hand function first.',
      zh:'求(f∘g)(a)时先求g(a)，再把它代入f：先用右边的函数。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'과일을 씻는 기계와 자르는 기계를 이어 붙이면 씻고 자르는 기계 하나가 됩니다. 순서를 바꾸어 자른 뒤 씻으면 결과가 달라지듯, 합성함수도 순서가 중요합니다.',
        en:'Join a machine that washes fruit to one that slices it and you get a single wash-and-slice machine. Slicing first and washing afterwards gives a different result — composite functions depend on order too.',
        zh:'把洗水果的机器和切水果的机器连起来，就成了一台先洗后切的机器。先切后洗结果就不同——复合函数也讲究顺序。' }
    },
    stages:[
      { tag:{ko:'① 합성함수의 값',en:'1) Values of a composite',zh:'① 复合函数的值'},
        head:{ko:'(f\\circ g)(3)=f(9)=19',en:'(f\\circ g)(3)=f(9)=19',zh:'(f\\circ g)(3)=f(9)=19'},
        desc:{ko:'f(x)=2x+1, g(x)=x² 이면 (f∘g)(3)=f(g(3))=f(9)=<b>19</b>, (g∘f)(3)=g(7)=<b>49</b> 입니다. 순서를 바꾸면 값이 달라집니다.',
              en:'With f(x)=2x+1 and g(x)=x²: (f∘g)(3)=f(g(3))=f(9)=<b>19</b>, but (g∘f)(3)=g(7)=<b>49</b>. Changing the order changes the value.',
              zh:'f(x)=2x+1、g(x)=x²时，(f∘g)(3)=f(g(3))=f(9)=<b>19</b>，而(g∘f)(3)=g(7)=<b>49</b>。顺序不同，值就不同。'},
        mathSteps:['g(3)=9','f(9)=19'],
        result:{ko:'안쪽부터 차례로!',en:'Inside first!',zh:'从内向外！'},
        book:{ko:'합성함수에서는 결합법칙 (f∘g)∘h=f∘(g∘h) 가 성립하지만 교환법칙은 일반적으로 성립하지 않습니다.',
              en:'Composition is associative, (f∘g)∘h=f∘(g∘h), but in general it is not commutative.',
              zh:'复合函数满足结合律(f∘g)∘h=f∘(g∘h)，但一般不满足交换律。'} },

      { tag:{ko:'② 미정계수',en:'2) Unknown coefficients',zh:'② 待定系数'},
        head:{ko:'2(ax+b)+1=6x-3',en:'2(ax+b)+1=6x-3',zh:'2(ax+b)+1=6x-3'},
        desc:{ko:'f(x)=2x+1, g(x)=ax+b 이고 (f∘g)(x)=6x−3 이면 2a=6, 2b+1=−3 이므로 a=<b>3</b>, b=<b>−2</b> 입니다.',
              en:'With f(x)=2x+1, g(x)=ax+b and (f∘g)(x)=6x−3: 2a=6 and 2b+1=−3, so a=<b>3</b> and b=<b>−2</b>.',
              zh:'f(x)=2x+1、g(x)=ax+b且(f∘g)(x)=6x−3时，2a=6、2b+1=−3，所以a=<b>3</b>，b=<b>−2</b>。'},
        mathSteps:['2a=6','2b+1=-3'],
        result:{ko:'계수끼리 비교!',en:'Compare coefficients!',zh:'比较系数！'},
        book:{ko:'모든 x 에 대하여 같아야 하는 식(항등식)이므로 x 의 계수와 상수항이 각각 같습니다.',
              en:'The equation must hold for every x (an identity), so the x-coefficients and constants match separately.',
              zh:'这是对所有x都成立的等式(恒等式)，所以x的系数与常数项分别相等。'} },

      { tag:{ko:'③ 거듭 합성',en:'3) Repeated composition',zh:'③ 多次复合'},
        head:{ko:'f^{10}(1)=1+10\\times3=31',en:'f^{10}(1)=1+10\\times3=31',zh:'f^{10}(1)=1+10\\times3=31'},
        desc:{ko:'f(x)=x+3 이면 한 번 합성할 때마다 3 씩 커지므로 f¹⁰(x)=x+30, f¹⁰(1)=<b>31</b> 입니다.',
              en:'For f(x)=x+3, each composition adds 3, so f¹⁰(x)=x+30 and f¹⁰(1)=<b>31</b>.',
              zh:'f(x)=x+3时每复合一次加3，所以f¹⁰(x)=x+30，f¹⁰(1)=<b>31</b>。'},
        mathSteps:['f^{2}(x)=x+6','f^{10}(x)=x+30'],
        result:{ko:'규칙을 찾으면 한 번에!',en:'Find the pattern, jump straight there!',zh:'找到规律，一步到位！'},
        book:{ko:'f(1)=3, f(3)=1 처럼 값이 되풀이되면 주기로 나눈 나머지만 보면 됩니다.',
              en:'When values repeat, as with f(1)=3 and f(3)=1, only the remainder on division by the period matters.',
              zh:'像f(1)=3、f(3)=1这样值循环时，只需看除以周期的余数。'} }
    ],
    rule:{ ko:'① (f∘g)(x)=f(g(x)), 안쪽부터  ② 항등식이면 계수 비교  ③ fⁿ 은 규칙이나 주기를 찾기',
      en:'① (f∘g)(x)=f(g(x)), inside first  ② For an identity, compare coefficients  ③ For fⁿ, find a pattern or a period',
      zh:'① (f∘g)(x)=f(g(x))，从内向外  ② 恒等式比较系数  ③ fⁿ找规律或周期' }
  },

  check:{
    fills:[
      { tex:{ko:'f(x)=x+2,\\ g(x)=3x\\ \\Rightarrow\\ (f\\circ g)(1)=\\square',en:'f(x)=x+2,\\ g(x)=3x\\ \\Rightarrow\\ (f\\circ g)(1)=\\square',zh:'f(x)=x+2,\\ g(x)=3x\\ \\Rightarrow\\ (f\\circ g)(1)=\\square'}, answer:5,
        hint:{ ko:'g(1)=3, f(3)', en:'g(1)=3, then f(3)', zh:'g(1)=3，再求f(3)' } },
      { tex:{ko:'f(x)=-x+4\\ \\Rightarrow\\ f^{2}(1)=\\square',en:'f(x)=-x+4\\ \\Rightarrow\\ f^{2}(1)=\\square',zh:'f(x)=-x+4\\ \\Rightarrow\\ f^{2}(1)=\\square'}, answer:1,
        hint:{ ko:'f(1)=3, f(3)=1', en:'f(1)=3, f(3)=1', zh:'f(1)=3，f(3)=1' } }
    ],
    open:{ ko:'f(x)=x+1, g(x)=2x 에서 f∘g 와 g∘f 가 서로 다른 함수임을 식으로 보여 봅니다.',
      en:'For f(x)=x+1 and g(x)=2x, show with formulas that f∘g and g∘f are different functions.',
      zh:'对f(x)=x+1、g(x)=2x，用式子说明f∘g与g∘f是不同的函数。' },
    openHint:{ ko:'(f∘g)(x)=2x+1, (g∘f)(x)=2(x+1)=2x+2 이므로 상수항이 다릅니다.',
      en:'(f∘g)(x)=2x+1 while (g∘f)(x)=2(x+1)=2x+2, so the constants differ.',
      zh:'(f∘g)(x)=2x+1，(g∘f)(x)=2(x+1)=2x+2，常数项不同。' }
  },

  lab:{
    generator:'md128_compose', level:'main', count:6,
    params:{mode:'coef'},
    intro:{
      ko:'합성한 식을 x 에 대하여 정리하고 주어진 식과 계수를 비교해 a, b 를 구합니다.',
      en:'Expand the composite in x and compare coefficients with the given expression to find a and b.',
      zh:'把复合后的式子按x整理，与已知式比较系数求a、b。'
    }
  },

  arena:{
    generator:'md128_compose', level:'main', count:6, timeLimit:420,
    params:{mode:'iter'},
    rule:{ ko:'7분 안에 fⁿ 의 값을 규칙과 주기로 모두 구합니다!', en:'Find every value of fⁿ with patterns and periods within 7 minutes!', zh:'7分钟内用规律和周期求出所有fⁿ的值！' }
  },

  stamp:{ label:{ ko:'함수 연결공', en:'Function Linker', zh:'函数连接师' }, coins:51 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'순서까지 정확해! 🔗',en:'Order and all — exact!',zh:'顺序也完全正确！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'안쪽 함수부터 계산해!',en:'Start with the inner function!',zh:'先算内层函数！'}, {ko:'몇 번 합성해서 규칙을 찾아봐!',en:'Compose a few times to find the pattern!',zh:'多复合几次找规律！'} ],
    finish:{ ko:'완벽해! 함수 연결공! 🔗✨', en:'Perfect! Function Linker!', zh:'完美！函数连接师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
