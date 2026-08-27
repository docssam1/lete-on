/* Numbers of Magic — 유닛 M-52: 지수방정식 (대수 W13 심화, 2026-08-27) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-52'] = {
  id:'M-52', tier:'algebra', level:'44', order:1,
  generator:'md52_expEquation',
  title:{ ko:'지수방정식', en:'Exponential Equations', zh:'指数方程' },
  subtitle:{ ko:'밑을 통일하면 지수끼리 등식이 돼요', en:'Unify the base, and the exponents form an equation', zh:'统一底数，指数就构成等式' },
  icon:'🪜',

  practice:{
    generator:'md52_expEquation', level:'practice', count:5,
    params:{mode:'sameBaseSimple'},
    intro:{
      ko:'밑이 같은 지수식이 등호로 이어져 있으면, 지수끼리도 똑같이 등호로 이어져요!',
      en:'When two powers with the same base are set equal, their exponents are equal too!',
      zh:'底数相同的两个幂相等时，指数也必然相等！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'2ˣ=8이라는 식을 봤어요. 8을 2의 거듭제곱으로 바꿔보면 8=2³이니 2ˣ=2³이 돼요. 밑이 똑같이 2라면, 남은 건 지수뿐이에요 — x=3이라는 게 바로 보여요!',
        en:'Look at the equation 2ˣ=8. Rewriting 8 as a power of 2 gives 8=2³, so 2ˣ=2³. With the same base of 2 on both sides, only the exponents are left to compare — you can see x=3 right away!',
        zh:'看这个方程2ˣ=8。把8改写成2的幂，8=2³，于是2ˣ=2³。两边底数同为2，剩下要比的只有指数——一眼就能看出x=3！' },
      history:{ ko:'지수함수 aˣ가 x값 하나마다 결과가 딱 하나씩 대응(일대일 대응)한다는 성질은 17세기 로그의 발명과 함께 명확해졌어요. 이 성질 덕분에 밑만 같으면 지수방정식은 복잡한 계산 없이 눈으로 풀 수 있어요.',
        en:'The property that the exponential function aˣ gives exactly one output per input (one-to-one) became clear alongside the 17th-century invention of logarithms. Thanks to this, when the bases match, an exponential equation can be solved just by comparing exponents.',
        zh:'指数函数aˣ对每个x值都对应唯一结果(一一对应)这一性质，随着17世纪对数的发明而变得明确。正因如此，底数相同时，指数方程不用复杂计算，比较指数就能解出。' }
    },
    stages:[
      { tag:{ko:'① 밑이 이미 같으면 지수끼리 비교',en:'1) When the bases already match, compare exponents',zh:'① 底数已经相同就比较指数'},
        head:{ko:'3^{x+1}=3^4 \\;\\Rightarrow\\; x=3',en:'3^{x+1}=3^4 \\;\\Rightarrow\\; x=3',zh:'3^{x+1}=3^4 \\;\\Rightarrow\\; x=3'},
        desc:{ko:'양변의 밑이 똑같이 3이에요. 지수함수는 <b>일대일 대응</b>이라, 밑이 같으면 지수도 같아야 해요: x+1=4. 이건 그냥 일차방정식이니 x=3.',
              en:'Both sides have the same base of 3. Since an exponential function is <b>one-to-one</b>, matching bases mean matching exponents: x+1=4. That\'s just a linear equation, so x=3.',
              zh:'两边的底数都是3。指数函数是<b>一一对应</b>的，底数相同指数也必须相同：x+1=4。这就是普通的一次方程，x=3。'},
        mathSteps:['x+1=4', 'x=4-1', '=3'],
        result:{ko:'밑이 같으면 지수끼리 그대로 등식이 돼요!',en:'With equal bases, the exponents themselves form the equation!',zh:'底数相同，指数本身就构成等式！'},
        book:{ko:'밑이 음수이거나 0, 1이면 이 성질이 성립하지 않아요 — 지수방정식은 밑이 1이 아닌 양수일 때만 다뤄요.',
              en:'This property fails if the base is negative, 0, or 1 — exponential equations are only handled for a positive base other than 1.',
              zh:'底数是负数、0或1时这个性质不成立——指数方程只处理不为1的正数底数。'} },

      { tag:{ko:'② 우변이 아직 수라면, 먼저 밑을 통일',en:'2) If the right side is still a plain number, unify the base first',zh:'② 右边还是个数就先统一底数'},
        head:{ko:'2^{x}=16 \\;\\Rightarrow\\; 2^x=2^4 \\;\\Rightarrow\\; x=4',en:'2^{x}=16 \\;\\Rightarrow\\; 2^x=2^4 \\;\\Rightarrow\\; x=4',zh:'2^{x}=16 \\;\\Rightarrow\\; 2^x=2^4 \\;\\Rightarrow\\; x=4'},
        desc:{ko:'16은 2의 거듭제곱(2⁴)으로 바꿀 수 있어요. 그러면 2ˣ=2⁴가 되고, 밑이 같아졌으니 <b>지수끼리 비교</b>해서 x=4.',
              en:'16 can be rewritten as a power of 2 (2⁴). Then 2ˣ=2⁴, and with the bases matching, <b>compare the exponents</b> to get x=4.',
              zh:'16可以改写成2的幂(2⁴)。于是2ˣ=2⁴，底数相同了，<b>比较指数</b>得x=4。'},
        mathSteps:['16=2^4', '2^x=2^4', 'x=4'],
        result:{ko:'수로 남아 있으면 먼저 같은 밑의 거듭제곱으로 바꿔요(밑 통일)!',en:'If a side is still a plain number, first rewrite it as a power of the same base (unify the base)!',zh:'还是个数就先改写成同底的幂(统一底数)！'},
        book:{ko:'32=2⁵, 27=3³처럼 밑 통일에 필요한 거듭제곱 표를 눈에 익혀두면 훨씬 빨라져요.',
              en:'Memorizing powers like 32=2⁵ or 27=3³ makes unifying the base much faster.',
              zh:'熟记32=2⁵、27=3³这样的幂表，统一底数会快得多。'} }
    ],
    rule:{ ko:'지수방정식: 밑이 같으면 지수끼리 등식 — 우변이 수로 남아 있으면 먼저 같은 밑의 거듭제곱으로 바꿔요(밑 통일)!',
      en:'Exponential equations: with equal bases, the exponents form the equation — if a side is still a number, first rewrite it as a power of the same base!',
      zh:'指数方程：底数相同，指数就构成等式——还是个数就先改写成同底的幂(统一底数)！' }
  },

  check:{
    fills:[
      { tex:'5^{x} = 5^3 \\;\\Rightarrow\\; x = \\square', answer:3,
        hint:{ ko:'밑이 같으니 지수도 같아요', en:'Same base, so same exponent', zh:'底数相同，指数也相同' } },
      { tex:'2^{x} = 32 \\;\\Rightarrow\\; x = \\square', answer:5,
        hint:{ ko:'32=2^5', en:'32=2^5', zh:'32=2^5' } }
    ],
    open:{ ko:'3^(2x-1)=81을 밑 통일부터 시작해 설명해봐요.',
      en:'Explain 3^(2x-1)=81, starting from unifying the base.',
      zh:'从统一底数开始说说3^(2x-1)=81。' },
    openHint:{ ko:'81=3^4, 2x-1=4, x=2.5는 정수가 아니니 문제를 다시 확인 — 실제로는 정수해가 되도록 값을 골라요',
      en:'81=3^4, 2x-1=4 — this example is for illustration; actual problems are chosen to give an integer x',
      zh:'81=3^4，2x-1=4——此例仅为示意；实际题目会保证x是整数' }
  },

  lab:{
    generator:'md52_expEquation', level:'main', count:4,
    params:{mode:'sameBaseGeneral',wide:true},
    intro:{
      ko:'지수에 계수가 붙어도 방법은 같아요 — 지수끼리 등식을 세우고 풀어요!',
      en:'Even with a coefficient on the exponent, the method is the same — set the exponents equal and solve!',
      zh:'指数上有系数也一样——让指数相等列方程求解！'
    }
  },

  arena:{
    generator:'md52_expEquation', level:'main', count:8, timeLimit:300,
    params:{mode:'unifyBase',wide:true},
    rule:{ ko:'5분 안에 밑 통일부터 시작하는 지수방정식을 모두 풀어요!', en:'Solve every exponential equation, starting from unifying the base, within 5 minutes!', zh:'5分钟内解出所有需先统一底数的指数方程！' }
  },

  stamp:{ label:{ ko:'밑 통일사', en:'Base-Unifier', zh:'统一底数师' }, coins:58 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'밑을 통일하고 지수끼리 완벽하게 풀었구나! 🪜',en:'You unified the base and solved the exponents perfectly!',zh:'你统一底数并完美解出了指数！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'밑이 같으면 지수끼리 등식이 돼!',en:'With equal bases, the exponents themselves form the equation!',zh:'底数相同，指数就构成等式！'}, {ko:'우변이 아직 수라면 먼저 같은 밑의 거듭제곱으로 바꿔봐!',en:'If the right side is still a number, rewrite it as a power of the same base first!',zh:'右边还是个数就先改写成同底的幂！'} ],
    finish:{ ko:'완벽해! 밑 통일사! 🪜✨', en:'Perfect! Base-Unifier!', zh:'完美！统一底数师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
