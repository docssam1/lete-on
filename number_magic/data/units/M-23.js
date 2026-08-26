/* Numbers of Magic — 유닛 M-23: 항등식과 미정계수법 (고등 W11 · 공통수학1 다항식) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-23'] = {
  id:'M-23', tier:'highmath1', level:'36', order:23,
  generator:'md23_identity',
  title:{ ko:'항등식과 미정계수법', en:'Identities & Undetermined Coefficients', zh:'恒等式与待定系数法' },
  subtitle:{ ko:'모든 x에서 성립하려면 양변의 계수가 같아야 해요', en:'To hold for every x, the coefficients on both sides must match', zh:'要对任意x都成立，两边的系数必须相等' },
  icon:'⚖️',

  practice:{
    generator:'md23_identity', level:'practice', count:5,
    params:{mode:'direct'},
    intro:{
      ko:'ax+b가 항상 5x-3과 같으려면? x가 어떤 값이든 성립해야 하니 a=5, b=-3일 수밖에 없어요.',
      en:'For ax+b to always equal 5x-3, it must hold no matter what x is — so a=5, b=-3, no other way.',
      zh:'要让ax+b恒等于5x-3？不管x是多少都要成立，所以只能a=5，b=-3。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'"어떤 x를 넣어도 항상 성립하는 식"이 있어요. 방정식은 특정 x에서만 참이지만, 항등식은 x가 뭐든 항상 참이에요 — 이걸 이용하면 모르는 계수를 어떻게 찾을 수 있을까요?',
        en:'There\'s a kind of equation that\'s true no matter what x you plug in. A regular equation is true only for specific x-values, but an identity is always true — how can this help find unknown coefficients?',
        zh:'有一种式子，不管代入什么x都成立。方程只在特定的x处成立，但恒等式永远成立——利用这一点怎么找出未知系数？' },
      history:{ ko:'"항상 같다(恒等)"는 말 그대로, 미지수의 값과 무관하게 성립하는 식을 뜻해요. 이 성질 덕분에 계수끼리 직접 비교하는 것만으로 방정식 없이도 미지수를 구할 수 있어요 — 이게 미정계수법이에요.',
        en:'The word "identity" (恒等, literally "always equal") means an equation true regardless of the variable\'s value. This property lets you find unknowns just by comparing coefficients directly — no equation-solving needed. That\'s the method of undetermined coefficients.',
        zh:'"恒等"字面意思就是不管未知数取什么值都成立的式子。正因如此，只需直接比较系数就能求出未知数，不用另外解方程——这就是待定系数法。' }
    },
    stages:[
      { tag:{ko:'① 계수를 그대로 비교',en:'1) Compare coefficients directly',zh:'① 直接比较系数'},
        head:{ko:'ax+b \\equiv 5x-3 \\;\\Rightarrow\\; a=5,\\,b=-3',en:'ax+b \\equiv 5x-3 \\;\\Rightarrow\\; a=5,\\,b=-3',zh:'ax+b \\equiv 5x-3 \\;\\Rightarrow\\; a=5,\\,b=-3'},
        desc:{ko:'≡(항등) 기호는 "모든 x에서 참"이라는 뜻이에요. x의 계수끼리 같아야 하니 a=5, 상수항끼리 같아야 하니 b=-3 — <b>계수를 그대로 맞춰 읽으면</b> 끝이에요.',
              en:'The ≡ (identity) symbol means "true for every x." The x-coefficients must match, so a=5; the constants must match, so b=-3 — <b>just read off the matching coefficients</b> and you\'re done.',
              zh:'≡(恒等)符号意味着"对任意x都成立"。x的系数必须相等，所以a=5；常数项必须相等，所以b=-3——<b>直接对应读出系数</b>就行了。'},
        mathSteps:['ax+b\\equiv5x-3', 'a=5', 'b=-3'],
        result:{ko:'항등식은 양변의 계수를 그대로 대응시켜요!',en:'An identity matches the coefficients on both sides directly!',zh:'恒等式让两边的系数直接对应！'},
        book:{ko:'ax+b≡cx+d가 항등식이면 a=c, b=d — x의 차수별로 계수가 각각 같아야 해요.',
              en:'If ax+b≡cx+d is an identity, then a=c and b=d — the coefficients must match for each power of x.',
              zh:'若ax+b≡cx+d是恒等式，则a=c，b=d——每个x次数的系数都必须分别相等。'} },

      { tag:{ko:'② 전개한 뒤 비교',en:'2) Expand, then compare',zh:'② 展开后再比较'},
        head:{ko:'a(x-1)+b(x-2) \\equiv 3x-7',en:'a(x-1)+b(x-2) \\equiv 3x-7',zh:'a(x-1)+b(x-2) \\equiv 3x-7'},
        desc:{ko:'좌변을 먼저 펼치면 (a+b)x + (-a-2b). x계수 a+b=3, 상수항 -a-2b=-7 — 두 식을 연립하면 <b>a=-1, b=4</b>.',
              en:'Expand the left side first: (a+b)x + (-a-2b). x-coefficient a+b=3, constant -a-2b=-7 — solving the system gives <b>a=-1, b=4</b>.',
              zh:'先展开左边：(a+b)x + (-a-2b)。x系数a+b=3，常数项-a-2b=-7——联立求解得<b>a=-1，b=4</b>。'},
        mathSteps:['a(x-1)+b(x-2)=(a+b)x+(-a-2b)', 'a+b=3,\\;\\;-a-2b=-7', 'a=-1,\\;b=4'],
        result:{ko:'괄호가 있으면 먼저 펼쳐서 x계수와 상수항으로 정리해요!',en:'With brackets, expand first and sort into the x-coefficient and the constant!',zh:'有括号就先展开，整理成x系数和常数项！'},
        book:{ko:'전개 후 x계수끼리, 상수항끼리 각각 방정식을 세우면 두 미지수를 모두 구할 수 있어요.',
              en:'After expanding, set up one equation for the x-coefficients and one for the constants to solve both unknowns.',
              zh:'展开后分别对x系数和常数项列方程，就能求出两个未知数。'} }
    ],
    rule:{ ko:'① 항등식은 모든 x에서 참 — 양변의 계수를 그대로 대응  ② 괄호가 있으면 먼저 전개해서 x계수·상수항으로 정리한 뒤 비교',
      en:'① An identity holds for every x — match the coefficients directly  ② With brackets, expand first, sort by x-coefficient and constant, then compare',
      zh:'① 恒等式对任意x都成立——两边系数直接对应  ② 有括号先展开，按x系数、常数项整理后再比较' }
  },

  check:{
    fills:[
      { tex:'ax+b \\equiv -2x+9', answer:[-2,9],
        hint:{ ko:'x계수끼리, 상수항끼리', en:'match x-coefficients and constants', zh:'x系数对应，常数项对应' } },
      { tex:'a(x-1) + b(x+1) \\equiv 4x + 2', answer:[1,3],
        hint:{ ko:'전개: (a+b)x + (-a+b) ≡ 4x+2', en:'expand: (a+b)x + (-a+b) ≡ 4x+2', zh:'展开：(a+b)x + (-a+b) ≡ 4x+2' } }
    ],
    open:{ ko:'a(x+2)+b(x-3)≡5x+5일 때 a,b를 구하는 과정을 설명해봐요.',
      en:'Explain how to find a,b when a(x+2)+b(x-3)≡5x+5.',
      zh:'说说求a(x+2)+b(x-3)≡5x+5中a,b的过程。' },
    openHint:{ ko:'전개하면 (a+b)x+(2a-3b)≡5x+5 → a+b=5, 2a-3b=5 → a=4, b=1',
      en:'Expand to (a+b)x+(2a-3b)≡5x+5 → a+b=5, 2a-3b=5 → a=4, b=1',
      zh:'展开为(a+b)x+(2a-3b)≡5x+5 → a+b=5，2a-3b=5 → a=4，b=1' }
  },

  lab:{
    generator:'md23_identity', level:'main', count:4,
    params:{mode:'expand'},
    intro:{
      ko:'이번엔 괄호가 있어! 먼저 펼쳐서 x계수와 상수항을 각각 맞춰봐.',
      en:'Brackets this time! Expand first, then match the x-coefficients and constants.',
      zh:'这次有括号！先展开，再分别对齐x系数和常数项。'
    }
  },

  arena:{
    generator:'md23_identity', level:'main', count:8, timeLimit:300,
    params:{mode:'expandWide'},
    rule:{ ko:'5분 안에 더 큰 범위의 항등식 문제를 모두 풀어요!', en:'Solve all the wider-range identity problems in 5 minutes!', zh:'5分钟内解答所有更大范围的恒等式题！' }
  },

  stamp:{ label:{ ko:'항등식 해결사', en:'Identity Solver', zh:'恒等式解题人' }, coins:47 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'계수를 정확히 맞춰 읽었구나! ⚖️',en:'You matched the coefficients perfectly!',zh:'系数对得很准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'항등식은 모든 x에서 참이니까 계수끼리 같아야 해!',en:'An identity is true for every x, so the coefficients must match!',zh:'恒等式对任意x都成立，所以系数必须相等！'}, {ko:'괄호가 있으면 먼저 전개부터 해야 해!',en:'With brackets, expand first!',zh:'有括号要先展开！'} ],
    finish:{ ko:'완벽해! 항등식 해결사! ⚖️✨', en:'Perfect! Identity Solver!', zh:'完美！恒等式解题人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
