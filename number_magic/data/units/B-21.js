/* Numbers of Magic — 유닛 B-21: 분배법칙이란? (두 자리 쪼개기) (중급 H 챕터1) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-21'] = {
  id:'B-21', tier:'intermediate', level:'B', order:21,
  generator:'ml6_mul2d1dMental',
  title:{ ko:'분배법칙 — 쪼개서 곱해요!', en:'Distributive Law — Split to Multiply!', zh:'分配律 — 拆开来乘！' },
  subtitle:{ ko:'13×4 = (10+3)×4 = 10×4 + 3×4', en:'13×4 = (10+3)×4 = 10×4 + 3×4', zh:'13×4 = (10+3)×4 = 10×4 + 3×4' },
  icon:'✂️',

  practice:{
    generator:'ml6_mul2d1dMental', level:'practice', count:5,
    params:{ easy:true },
    intro:{
      ko:'분배법칙 마법을 연습해 볼 거야. 두 자리 수를 십의 자리와 일의 자리로 쪼개서 각각 곱하면 돼! 준비됐지?',
      en:"Let's practise the distributive law! Split the 2-digit number into tens and ones, then multiply each part. Ready?",
      zh:'我们来练习分配律！把两位数拆成十位和个位，分别乘，再加起来。准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 분배법칙이란?', en:'1) What is the Distributive Law?', zh:'① 什么是分配律？' },
        head:{ ko:'쪼개서 곱한 다음 더해요!', en:'Split, multiply, then add!', zh:'拆开来乘，再加在一起！' },
        desc:{ ko:'13×4를 바로 계산하기 어렵다면? <b>13을 10과 3으로 쪼개서</b> 각각 4를 곱한 다음 더하면 돼요. 이게 바로 분배법칙이에요!',
               en:'Is 13×4 hard to compute directly? <b>Split 13 into 10 and 3</b>, multiply each by 4, and then add — that\'s the distributive law!',
               zh:'13×4直接算有点难？<b>把13拆成10和3</b>，分别乘以4再相加——这就是分配律！' },
        mathSteps:['13 × 4','= (10 + 3) × 4','= 10×4 + 3×4','= 40 + 12 = 52'],
        result:{ ko:'10×4=40, 3×4=12. 40+12=52! 쉽게 풀렸어요.', en:'10×4=40, 3×4=12. 40+12=52! Solved easily.', zh:'10×4=40，3×4=12。40+12=52！轻松解出。' },
        book:{ ko:'분배법칙: (a+b)×c = a×c + b×c. 두 자리 수는 항상 (십의 자리+일의 자리)로 쪼갤 수 있어요. 이 법칙을 이용하면 어려운 곱셈도 쉬운 두 부분으로 나눌 수 있어요.', en:'Distributive law: (a+b)×c = a×c + b×c. Any 2-digit number can be split into (tens + ones). This law breaks a hard multiplication into two easy ones.', zh:'分配律：(a+b)×c = a×c + b×c。任何两位数都能拆成（十位+个位）。利用这个规律，难的乘法也能变成两个简单的部分。' } },

      { tag:{ ko:'② 왜 이렇게 해도 될까?', en:'2) Why does this work?', zh:'② 为什么可以这样做？' },
        head:{ ko:'10개짜리 4묶음 + 3개짜리 4묶음!', en:'4 groups of 10 + 4 groups of 3!', zh:'4组10个 + 4组3个！' },
        desc:{ ko:'13개씩 4줄을 생각해봐요. <b>10개짜리 묶음 4줄</b>과 <b>3개짜리 묶음 4줄</b>로 나눠 세면 같은 결과가 나와요. 배열 모델로 직접 확인해 봐요!',
               en:'Picture 4 rows of 13. Split each row into <b>10 + 3</b>: 4 rows of 10 and 4 rows of 3. Counting them separately gives the same total!',
               zh:'想象4排，每排13个。把每排分成<b>10+3</b>：4排10个 + 4排3个，分开数和一起数结果一样！' },
        mathSteps:['[●●●●●●●●●●][●●●]','× 4줄','= 10×4=40 / 3×4=12','→ 40+12=52'],
        result:{ ko:'10개×4줄 = 40, 3개×4줄 = 12. 합치면 52! 어떻게 나눠도 답은 같아요.', en:'10×4=40, 3×4=12. Total = 52! The answer stays the same however you split it.', zh:'10×4=40，3×4=12，合在一起=52！不管怎么拆，结果都一样。' },
        book:{ ko:'배열(어레이) 모델: 전체 직사각형을 두 부분으로 나눠도 넓이(=곱셈의 값)는 그대로예요. 분배법칙은 곱셈에서 넓이를 쪼개는 것과 같아요.', en:'Array model: splitting a rectangle into two parts keeps the total area (= the product) unchanged. The distributive law is like splitting an area.', zh:'阵列模型：把长方形分成两部分，总面积（=乘积）不变。分配律就像把面积拆开来算。' } },

      { tag:{ ko:'③ 실전 응용', en:'3) Applying It', zh:'③ 实战应用' },
        head:{ ko:'24×3도 쪼개서 풀어요!', en:'Split 24×3 the same way!', zh:'24×3也拆开来算！' },
        desc:{ ko:'24×3을 해봐요. 24를 <b>20과 4로 쪼개서</b> 각각 3을 곱해요. 20×3=60, 4×3=12. 60+12=72! 어떤 두 자리 수든 같은 방법으로 풀려요.',
               en:'Try 24×3. <b>Split 24 into 20 and 4</b>, then multiply each by 3. 20×3=60, 4×3=12. 60+12=72! This works for any 2-digit number.',
               zh:'来试试24×3。<b>把24拆成20和4</b>，分别乘以3。20×3=60，4×3=12，60+12=72！任何两位数都能用这个方法。' },
        mathSteps:['24 × 3','= (20+4) × 3','= 20×3 + 4×3','= 60 + 12 = 72'],
        result:{ ko:'20×3=60, 4×3=12. 60+12=72! 분배법칙으로 빠르게 풀었어요.', en:'20×3=60, 4×3=12. 60+12=72! Solved quickly with the distributive law.', zh:'20×3=60，4×3=12。60+12=72！用分配律快速解出。' },
        book:null }
    ],
    rule:{ ko:'① 두 자리 수 = 십의 자리 + 일의 자리로 쪼개요  ② 각 부분에 한 자리 수를 곱해요  ③ 두 결과를 더하면 끝!', en:'① Split the 2-digit number into tens + ones  ② Multiply each part by the 1-digit number  ③ Add the two results together!', zh:'① 把两位数拆成十位+个位  ② 分别乘以一位数  ③ 两个结果相加就完成了！' }
  },

  check:{
    fills:[
      { tex:'13 \\times 4 = \\square', answer:52,
        hint:{ ko:'13=10+3으로 쪼개요. 10×4=40, 3×4=12', en:'Split 13 into 10+3. 10×4=40, 3×4=12', zh:'把13拆成10+3。10×4=40，3×4=12' } },
      { tex:'24 \\times 3 = \\square', answer:72,
        hint:{ ko:'24=20+4로 쪼개요. 20×3=60, 4×3=12', en:'Split 24 into 20+4. 20×3=60, 4×3=12', zh:'把24拆成20+4。20×3=60，4×3=12' } }
    ],
    open:{ ko:'분배법칙이 편리한 이유를 설명해봐요. 언제 특히 유용한가요?', en:'Explain why the distributive law is convenient. When is it especially useful?', zh:'说说为什么分配律很方便，什么时候特别有用？' },
    openHint:{ ko:'예) 32×4는 30×4=120, 2×4=8, 120+8=128! 큰 수도 쉽게 계산돼요.', en:'e.g. 32×4: 30×4=120, 2×4=8, 120+8=128! Even large numbers become easy.', zh:'例）32×4：30×4=120，2×4=8，120+8=128！大数也变得简单了。' }
  },

  lab:{
    generator:'ml6_mul2d1dMental', level:'main', count:4,
    params:{ easy:true },
    intro:{
      ko:'이제 분배법칙 마법을 써볼 차례야! 두 자리 수를 쪼개서 한 자리씩 곱하고 더해봐.',
      en:"Time to use the distributive law! Split the 2-digit number and multiply each part.",
      zh:'是时候运用分配律了！把两位数拆开，分别乘再相加。'
    }
  },

  arena:{
    generator:'ml6_mul2d1dMental', level:'main', count:8, timeLimit:300,
    params:{ easy:true },
    rule:{ ko:'5분 안에 분배법칙 문제를 모두 풀어요!', en:'Solve all distributive law problems in 5 minutes!', zh:'5分钟内解答所有分配律题目！' }
  },

  stamp:{ label:{ ko:'분배법칙 발견자', en:'Distributive Law Discoverer', zh:'分配律发现者' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'분배법칙 마스터! 🌟',en:'Distributive master!',zh:'分配律高手！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해봐 💡',en:'Hmm, try again 💡',zh:'嗯，再试一次 💡'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 분배법칙 마법을 배웠어! ✂️✨', en:'Perfect! You learned the distributive law!', zh:'完美！学会了分配律的魔法！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
