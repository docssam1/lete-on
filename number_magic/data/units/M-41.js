/* Numbers of Magic — 유닛 M-41: 등비수열 (고등 W13 · 대수 삼각함수와 수열) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-41'] = {
  id:'M-41', tier:'algebra', level:'41', order:3,
  generator:'md41_geometricSeq',
  title:{ ko:'등비수열', en:'Geometric Sequences', zh:'等比数列' },
  subtitle:{ ko:'같은 수를 계속 곱해가는 수열이에요', en:'A sequence made by multiplying by the same number again and again', zh:'不断乘以同一个数得到的数列' },
  icon:'🌀',

  practice:{
    generator:'md41_geometricSeq', level:'practice', count:5,
    params:{mode:'nthTerm'},
    intro:{
      ko:'2,6,18,54,… 처럼 3배씩 커지는 수열이에요. aₙ=a₁×r^(n-1)에 대입해봐요.',
      en:'A sequence like 2,6,18,54,… tripling each time. Substitute into aₙ=a₁×r^(n-1).',
      zh:'像2,6,18,54,…这样每次乘以3的数列。代入aₙ=a₁×r^(n-1)。'
    }
  },

  discover:{
    story:{
      hook:{ ko:'체스판 첫 칸에 쌀 1알, 다음 칸에 2알, 그다음 4알… 64칸이면 몇 알일까요?',
        en:'One grain of rice on the first chess square, two on the next, then four… how many by the 64th?',
        zh:'棋盘第一格放1粒米，下一格2粒，再下一格4粒……到第64格是多少粒？' },
      history:{ ko:'전해지는 이야기 속 답은 18,446,744,073,709,551,615알이에요. 한 칸씩 두 배씩만 늘렸는데 나라의 곳간으로도 감당할 수 없는 수가 되죠. 두 배는 처음엔 느리게, 나중엔 무섭게 빨라져요.',
        en:'In the legend the answer is 18,446,744,073,709,551,615 grains. Only doubling each square, yet no kingdom could pay it. Doubling starts slow and then turns terrifyingly fast.',
        zh:'传说中的答案是18,446,744,073,709,551,615粒。每格只翻一倍，却是整个王国也付不起的数目。翻倍一开始很慢，随后快得吓人。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 일반항 aₙ=a₁×r^(n-1)',en:'1) The general term aₙ=a₁×r^(n-1)',zh:'① 通项公式aₙ=a₁×r^(n-1)'},
        head:{ko:'a_1=2,\\;r=3 \\;\\Rightarrow\\; a_4 = 54',en:'a_1=2,\\;r=3 \\;\\Rightarrow\\; a_4 = 54',zh:'a_1=2,\\;r=3 \\;\\Rightarrow\\; a_4 = 54'},
        desc:{ko:'첫째항 2에서 4번째 항까지 가려면 3을 <b>3번</b> 곱해야 해요(항번호-1번). 2×3×3×3=2×27=54. 등차수열이 "더하기"를 반복했다면, 등비수열은 <b>같은 수를 곱하기</b>를 반복해요 — aₙ=a₁×r^(n-1).',
              en:'Going from the 1st term (2) to the 4th requires multiplying by 3 a total of <b>3 times</b> (one less than the term number). 2×3×3×3=2×27=54. Where an arithmetic sequence repeats "adding," a geometric sequence repeats <b>multiplying by the same number</b> — aₙ=a₁×r^(n-1).',
              zh:'从第1项(2)到第4项，需要乘3共<b>3次</b>(项数减1)。2×3×3×3=2×27=54。等差数列重复的是"加"，等比数列重复的是<b>乘同一个数</b>——aₙ=a₁×r^(n-1)。'},
        mathSteps:['4-1=3', '2\\times3^3', '=2\\times27=54'],
        result:{ko:'공비 r을 (항번호-1)번 곱해요!',en:'Multiply by the common ratio r (term number − 1) times!',zh:'把公比r乘(项数-1)次！'},
        book:{ko:'공비 r은 이웃한 두 항의 비예요: r=a₂÷a₁=a₃÷a₂=…',
              en:'The common ratio r is the ratio between neighboring terms: r=a₂÷a₁=a₃÷a₂=…',
              zh:'公比r是相邻两项的比：r=a₂÷a₁=a₃÷a₂=…'} },

      { tag:{ko:'② 항을 나열해 더하면 합',en:'2) Add the terms one by one for the sum',zh:'② 依次相加就是求和'},
        head:{ko:'a_1=1,\\;r=2 \\;\\Rightarrow\\; S_4 = 1+2+4+8=15',en:'a_1=1,\\;r=2 \\;\\Rightarrow\\; S_4 = 1+2+4+8=15',zh:'a_1=1,\\;r=2 \\;\\Rightarrow\\; S_4 = 1+2+4+8=15'},
        desc:{ko:'등비수열의 합은 공식을 외우기 전에 <b>그냥 다 나열해서 더해도</b> 돼요: 1,2,4,8을 더하면 15. r이 정수면 각 항이 항상 정수이기 때문에, 나열해서 더하는 방법이 나눗셈 공식보다 오히려 더 안전해요(나눗셈 없이 답이 딱 나와요).',
              en:'Before memorizing the sum formula, you can simply <b>list all the terms and add</b>: 1+2+4+8=15. Since r is an integer, every term stays an integer — so listing and adding is actually safer than the division-based formula (no division needed at all).',
              zh:'在背求和公式之前，其实可以<b>直接把各项列出来相加</b>：1+2+4+8=15。因为r是整数，每一项也都是整数，所以逐项相加反而比除法公式更保险(完全不用除法)。'},
        mathSteps:['1,\\,2,\\,4,\\,8', '1+2+4+8', '=15'],
        result:{ko:'항을 하나씩 나열해서 더해도 등비수열의 합이 나와요!',en:'Listing and adding the terms one by one gives the geometric sum too!',zh:'把各项一一列出相加，也能得到等比数列的和！'},
        book:{ko:'등비수열의 합 공식 Sₙ=a₁(rⁿ-1)÷(r-1)은 정수 r에서 항상 정수가 나와요 — 나열해서 더한 값과 완전히 같아요.',
              en:'The formula Sₙ=a₁(rⁿ-1)÷(r-1) always gives an integer for integer r — it exactly matches the value you get by listing and adding.',
              zh:'求和公式Sₙ=a₁(rⁿ-1)÷(r-1)在r为整数时总能得到整数——和逐项相加的结果完全一致。'} }
    ],
    rule:{ ko:'aₙ=a₁×r^(n-1) — 공비 r을 (항번호-1)번 곱해요. 합은 항을 하나씩 나열해서 더해도 똑같아요.',
      en:'aₙ=a₁×r^(n-1) — multiply by the common ratio (term number − 1) times. The sum is the same whether you use the formula or just list and add.',
      zh:'aₙ=a₁×r^(n-1)——把公比乘(项数-1)次。求和无论用公式还是逐项相加，结果都一样。' }
  },

  check:{
    fills:[
      { tex:'a_1=3,\\;r=2 \\;\\Rightarrow\\; a_{5} = \\square', answer:48,
        hint:{ ko:'3×2⁴=3×16=48', en:'3×2⁴=3×16=48', zh:'3×2⁴=3×16=48' } },
      { tex:'a_1=1,\\;r=3 \\;\\Rightarrow\\; S_{3} = \\square', answer:13,
        hint:{ ko:'1+3+9=13', en:'1+3+9=13', zh:'1+3+9=13' } }
    ],
    open:{ ko:'a₂=6, a₄=24인 등비수열의 a₁과 r을 구하는 과정을 설명해봐요(r>0).',
      en:'Explain how to find a₁ and r for a geometric sequence with a₂=6, a₄=24 (r>0).',
      zh:'说说怎么求a₂=6、a₄=24的等比数列的a₁和r(r>0)。' },
    openHint:{ ko:'24÷6=4=r², r=2(양수). a₁=6÷2=3',
      en:'24÷6=4=r², so r=2 (positive). a₁=6÷2=3',
      zh:'24÷6=4=r²，r=2(取正)。a₁=6÷2=3' }
  },

  lab:{
    generator:'md41_geometricSeq', level:'main', count:4,
    params:{mode:'findRule'},
    intro:{
      ko:'이번엔 거꾸로! 두 항의 값만 보고 a₁과 r을 찾아봐.',
      en:'Backward this time! Find a₁ and r from just two given terms.',
      zh:'这次反过来！只看两项的值找出a₁和r。'
    }
  },

  arena:{
    generator:'md41_geometricSeq', level:'main', count:8, timeLimit:300,
    params:{mode:'sum',wide:true},
    rule:{ ko:'5분 안에 등비수열의 합을 모두 구해요!', en:'Find all the geometric series sums in 5 minutes!', zh:'5分钟内求出所有等比数列的和！' }
  },

  stamp:{ label:{ ko:'등비수열 곱셈술사', en:'Geometric-Sequence Multiplier', zh:'等比数列乘法师' }, coins:54 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'같은 수를 계속 곱하는 걸 정확히 알아냈구나! 🌀',en:'You nailed multiplying by the same number over and over!',zh:'你准确掌握了反复乘以同一个数！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'aₙ=a₁×r^(n-1), 공비를 몇 번 곱했는지(n-1) 세어봐!',en:'aₙ=a₁×r^(n-1) — count how many times you multiplied by r (n-1)!',zh:'aₙ=a₁×r^(n-1)，数一数乘了几次公比(n-1)！'}, {ko:'합이 헷갈리면 항을 하나씩 나열해서 더해봐!',en:'If the sum confuses you, just list the terms and add them one by one!',zh:'求和搞不清时，就把各项列出来逐一相加！'} ],
    finish:{ ko:'완벽해! 등비수열 곱셈술사! 🌀✨', en:'Perfect! Geometric-Sequence Multiplier!', zh:'完美！等比数列乘法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
