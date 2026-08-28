/* Numbers of Magic — 유닛 M-40: 등차수열 (고등 W13 · 대수 삼각함수와 수열) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-40'] = {
  id:'M-40', tier:'algebra', level:'41', order:2,
  lineage:['rainbow-sum'],
  generator:'md40_arithmeticSeq',
  title:{ ko:'등차수열', en:'Arithmetic Sequences', zh:'等差数列' },
  subtitle:{ ko:'같은 수를 계속 더해가는 수열이에요', en:'A sequence made by adding the same number again and again', zh:'不断加上同一个数得到的数列' },
  icon:'🪃',

  practice:{
    generator:'md40_arithmeticSeq', level:'practice', count:5,
    params:{mode:'nthTerm'},
    intro:{
      ko:'2,5,8,11,… 처럼 3씩 늘어나는 수열이에요. aₙ=a₁+(n-1)d에 대입만 하면 몇 번째 항인지 알 수 있어요.',
      en:'A sequence like 2,5,8,11,… growing by 3 each time. Just substitute into aₙ=a₁+(n-1)d to find any term.',
      zh:'像2,5,8,11,…这样每次增加3的数列。代入aₙ=a₁+(n-1)d就能求出任意一项。'
    }
  },

  discover:{
    story:{
      hook:{ ko:'수를 일정한 간격으로 늘어놓으면 100번째 수를 하나씩 세지 않고 바로 말할 수 있어요. 어떻게요?',
        en:'Line numbers up with a constant gap and you can name the 100th one without counting up to it. How?',
        zh:'把数按固定间隔排好，不用一个个数就能说出第100个数。怎么做到的？' },
      history:{ ko:'가장 오래된 수열 문제는 약 4,000년 전 이집트의 린드 파피루스에 있어요 — 곡물을 다섯 사람에게 일정한 차이로 나누는 문제였죠. 등차수열은 교과서보다 곡식 창고에서 먼저 쓰였어요.',
        en:'The oldest sequence problem we know sits in the Egyptian Rhind Papyrus, about 4,000 years old — dividing grain among five people with a constant difference. Arithmetic sequences were used in grain stores long before textbooks.',
        zh:'已知最古老的数列问题在约4000年前的埃及莱因德纸草书里——把谷物按固定差额分给五个人。等差数列在粮仓里的使用远早于教科书。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 일반항 aₙ=a₁+(n-1)d',en:'1) The general term aₙ=a₁+(n-1)d',zh:'① 通项公式aₙ=a₁+(n-1)d'},
        head:{ko:'a_1=2,\\;d=3 \\;\\Rightarrow\\; a_5 = 14',en:'a_1=2,\\;d=3 \\;\\Rightarrow\\; a_5 = 14',zh:'a_1=2,\\;d=3 \\;\\Rightarrow\\; a_5 = 14'},
        desc:{ko:'첫째항 2에서 5번째 항까지 가려면 3씩 <b>4번</b> 더해야 해요(항번호-1번). 2+3×4=14. 이걸 공식으로 쓰면 aₙ=a₁+(n-1)d — "몇 번 더했는지(n-1)"만큼 공차 d를 곱해서 첫째항에 더하는 거예요.',
              en:'Going from the 1st term (2) to the 5th term takes adding 3 a total of <b>4 times</b> (one less than the term number). 2+3×4=14. As a formula: aₙ=a₁+(n-1)d — multiply the common difference d by "how many times you added" (n-1) and add to the first term.',
              zh:'从第1项(2)到第5项，需要加3共<b>4次</b>(项数减1)。2+3×4=14。写成公式就是aₙ=a₁+(n-1)d——把公差d乘以"加了几次"(n-1)，再加到首项上。'},
        mathSteps:['5-1=4', '2+3\\times4', '=14'],
        result:{ko:'몇 번째 항인지 알면 (항번호-1)번만큼 공차를 더해요!',en:'For any term number, add the common difference (term number − 1) times!',zh:'知道项数，就把公差加(项数-1)次！'},
        book:{ko:'등차수열의 공차 d는 이웃한 두 항의 차예요: d=a₂-a₁=a₃-a₂=…',
              en:'The common difference d equals the gap between neighboring terms: d=a₂-a₁=a₃-a₂=…',
              zh:'等差数列的公差d等于相邻两项之差：d=a₂-a₁=a₃-a₂=…'} },

      { tag:{ko:'② 두 항으로 규칙 찾기, 그리고 합',en:'2) Finding the rule from two terms, and the sum',zh:'② 由两项求规律，以及求和'},
        head:{ko:'a_2=7,\\;a_5=16 \\;\\Rightarrow\\; d=3,\\;a_1=4',en:'a_2=7,\\;a_5=16 \\;\\Rightarrow\\; d=3,\\;a_1=4',zh:'a_2=7,\\;a_5=16 \\;\\Rightarrow\\; d=3,\\;a_1=4'},
        desc:{ko:'2번째 항에서 5번째 항까지는 3칸 차이(5-2=3). 그동안 7에서 16으로 9만큼 늘었으니 한 칸당 9÷3=<b>3</b>이 공차예요. a₁은 2번째 항 7에서 거꾸로 한 번 빼면 4. 합 Sₙ=n(2a₁+(n-1)d)÷2는 첫째항과 공차를 알면 그대로 대입해서 구해요.',
              en:'From the 2nd to the 5th term is a gap of 3 (5-2=3). The value rose from 7 to 16, a change of 9, so each step is 9÷3=<b>3</b> — that\'s the common difference. Working back one step from the 2nd term (7) gives a₁=4. Once you know a₁ and d, the sum Sₙ=n(2a₁+(n-1)d)÷2 is a direct substitution.',
              zh:'从第2项到第5项相差3步(5-2=3)。值从7变到16，增加了9，所以每步是9÷3=<b>3</b>，这就是公差。从第2项(7)往回退一步得到a₁=4。知道a₁和d后，求和Sₙ=n(2a₁+(n-1)d)÷2直接代入即可。'},
        mathSteps:['(16-7)\\div(5-2)=3', 'a_1=7-3=4', 'S_n=\\dfrac{n(2a_1+(n-1)d)}{2}'],
        result:{ko:'d=(뒤항-앞항)÷(항번호 차), 합은 공식에 그대로 대입!',en:'d = (later − earlier) ÷ (index gap); plug a1 and d straight into the sum formula!',zh:'d=(后项-前项)÷(项数差)，求和直接代入公式！'},
        book:{ko:'무지개 덧셈법(1~n의 합=n(n+1)÷2)도 사실 a₁=1, d=1인 등차수열의 합이었던 거예요 — 이미 알던 마법이 여기서 이름을 얻었어요.',
              en:'The rainbow-sum trick (1 to n = n(n+1)÷2) was secretly the sum of an arithmetic sequence with a1=1, d=1 all along — magic you already knew, now given its proper name.',
              zh:'彩虹加法法(1到n的和=n(n+1)÷2)其实一直是a1=1、d=1的等差数列求和——你早就会的魔法，在这里有了正式的名字。'} }
    ],
    rule:{ ko:'aₙ=a₁+(n-1)d, Sₙ=n(2a₁+(n-1)d)÷2 — d=(뒤 항-앞 항)÷(항번호 차)로 거꾸로도 구해요.',
      en:'aₙ=a₁+(n-1)d, Sₙ=n(2a₁+(n-1)d)÷2 — d can also be found backward as (later − earlier)÷(index gap).',
      zh:'aₙ=a₁+(n-1)d，Sₙ=n(2a₁+(n-1)d)÷2——也能反过来用d=(后项-前项)÷(项数差)求解。' }
  },

  check:{
    fills:[
      { tex:'a_1=5,\\;d=4 \\;\\Rightarrow\\; a_{6} = \\square', answer:25,
        hint:{ ko:'5+4×(6-1)=5+20=25', en:'5+4×(6-1)=5+20=25', zh:'5+4×(6-1)=5+20=25' } },
      { tex:'a_1=3,\\;d=2 \\;\\Rightarrow\\; S_{4} = \\square', answer:24,
        hint:{ ko:'4×(2×3+3×2)÷2=4×12÷2=24', en:'4×(2×3+3×2)÷2=4×12÷2=24', zh:'4×(2×3+3×2)÷2=4×12÷2=24' } }
    ],
    open:{ ko:'a₃=10, a₆=19인 등차수열의 a₁과 d를 구하는 과정을 설명해봐요.',
      en:'Explain how to find a₁ and d for an arithmetic sequence with a₃=10, a₆=19.',
      zh:'说说怎么求a₃=10、a₆=19的等差数列的a₁和d。' },
    openHint:{ ko:'(19-10)÷(6-3)=3=d, a₁=10-3×2=4',
      en:'(19-10)÷(6-3)=3=d, a₁=10-3×2=4',
      zh:'(19-10)÷(6-3)=3=d，a₁=10-3×2=4' }
  },

  lab:{
    generator:'md40_arithmeticSeq', level:'main', count:4,
    params:{mode:'findRule'},
    intro:{
      ko:'이번엔 거꾸로! 두 항의 값만 보고 a₁과 d를 찾아봐.',
      en:'Backward this time! Find a₁ and d from just two given terms.',
      zh:'这次反过来！只看两项的值找出a₁和d。'
    }
  },

  arena:{
    generator:'md40_arithmeticSeq', level:'main', count:8, timeLimit:300,
    params:{mode:'sum',wide:true},
    rule:{ ko:'5분 안에 등차수열의 합을 모두 구해요!', en:'Find all the arithmetic series sums in 5 minutes!', zh:'5分钟内求出所有等差数列的和！' }
  },

  stamp:{ label:{ ko:'등차수열 항해사', en:'Arithmetic-Sequence Navigator', zh:'等差数列航海家' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'무지개 덧셈법이 여기까지 이어졌구나! 🪃',en:'The rainbow-sum trick has grown all the way here!',zh:'彩虹加法法一路成长到了这里！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'aₙ=a₁+(n-1)d, 몇 번 더했는지(n-1)를 잘 세어봐!',en:'aₙ=a₁+(n-1)d — count carefully how many times you added (n-1)!',zh:'aₙ=a₁+(n-1)d，仔细数一数加了几次(n-1)！'}, {ko:'d는 (뒤 항-앞 항)÷(항번호 차)로 구해!',en:'Find d as (later term − earlier term) ÷ (index difference)!',zh:'d用(后项-前项)÷(项数差)来求！'} ],
    finish:{ ko:'완벽해! 등차수열 항해사! 🪃✨', en:'Perfect! Arithmetic-Sequence Navigator!', zh:'完美！等差数列航海家！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
