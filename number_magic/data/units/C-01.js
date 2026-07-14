/* Numbers of Magic — 유닛 C-01: 거듭제곱 마법 (중급 A 챕터1) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-01'] = {
  id:'C-01', tier:'intermediate', level:'C', order:1,
  generator:'ml11_squares',
  title:{ ko:'거듭제곱 마법', en:'The Power Magic', zh:'幂运算魔法' },
  subtitle:{ ko:'2³=2×2×2=8: 같은 수를 여러 번 곱해요!', en:'2³=2×2×2=8: multiply the same number repeatedly!', zh:'2³=2×2×2=8：把同一个数连乘多次！' },
  icon:'🔺',

  practice:{
    generator:'ml11_squares', level:'practice', count:5,
    params:{ powers:true },
    intro:{
      ko:'거듭제곱을 연습할 거야. 2³처럼 같은 수를 여러 번 곱하는 거야. 준비됐지?',
      en:"Let's practise powers. Like 2³ — multiply the same number several times. Ready?",
      zh:'我们来练习幂运算。像2³一样把同一个数连乘多次。准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 거듭제곱이란?',en:'1) What are powers?',zh:'① 什么是幂？'},
        head:{ko:'같은 수를 n번 곱하는 마법 기호!',en:'A magic symbol for multiplying the same number n times!',zh:'把同一个数乘n次的魔法符号！'},
        desc:{ko:'<b>2³</b>은 2를 3번 곱하는 것이에요. 위의 작은 숫자(3)가 <b>지수</b>이고 몇 번 곱하는지 알려줘요. 2¹=2, 2²=4, 2³=8, 2⁴=16 — 2를 곱할수록 2배씩 커져요!',
              en:'<b>2³</b> means multiply 2 three times. The small top number (3) is the <b>exponent</b> — it tells you how many times to multiply. 2¹=2, 2²=4, 2³=8, 2⁴=16 — doubling each time!',
              zh:'<b>2³</b>表示2乘3次。右上方的小数字(3)是<b>指数</b>，告诉你乘几次。2¹=2，2²=4，2³=8，2⁴=16——每次翻倍！'},
        mathSteps:['2³','= 2×2×2','= 4×2','= 8'],
        result:{ko:'2³=8! 지수가 하나 올라가면 답이 두 배가 돼요.',en:'2³=8! Each step up in exponent doubles the answer.',zh:'2³=8！指数每增加1，结果就翻一倍。'},
        book:{ko:'거듭제곱: aⁿ = a를 n번 곱한 값. 2³=8, 3²=9, 5²=25. 지수가 0이면 a⁰=1(어떤 수든!), 지수가 1이면 a¹=a.',
              en:'Powers: aⁿ = a multiplied n times. 2³=8, 3²=9, 5²=25. a⁰=1 for any a, a¹=a.',
              zh:'幂运算：aⁿ = a乘n次。2³=8，3²=9，5²=25。任何数的0次方=1，1次方=本身。'} },

      { tag:{ko:'② 10의 거듭제곱',en:'2) Powers of 10',zh:'② 10的幂'},
        head:{ko:'10¹=10, 10²=100, 10³=1000',en:'10¹=10, 10²=100, 10³=1000',zh:'10¹=10，10²=100，10³=1000'},
        desc:{ko:'10의 거듭제곱은 특별히 쉬워요! <b>10ⁿ</b>은 1 뒤에 0이 n개 붙은 수예요. 10¹=10, 10²=100, 10³=1000, 10⁴=10000. 자릿값과 연결되는 아주 중요한 패턴이에요.',
              en:'Powers of 10 are especially easy! <b>10ⁿ</b> is 1 followed by n zeros. 10¹=10, 10²=100, 10³=1000, 10⁴=10000. This pattern connects directly to place value.',
              zh:'10的幂特别简单！<b>10ⁿ</b>就是1后面跟n个0。10¹=10，10²=100，10³=1000，10⁴=10000。这个规律直接与位值相关。'},
        mathSteps:['10¹ = 10','10² = 10×10 = 100','10³ = 10×10×10 = 1000'],
        result:{ko:'10의 거듭제곱: 지수 = 0의 개수! 아주 쉬운 패턴!',en:'Powers of 10: exponent = number of zeros! Super easy pattern!',zh:'10的幂：指数=0的个数！超简单的规律！'},
        book:{ko:'10ⁿ = 1 뒤에 0이 n개. 이 원리가 자릿값 체계의 기반이에요. 수 체계는 10을 기준으로 이루어져 있어요.',
              en:'10ⁿ = 1 followed by n zeros. This is the basis of our place-value system built around base 10.',
              zh:'10ⁿ = 1后面跟n个0。这是以10为基础的位值体系的基础。'} },

      { tag:{ko:'③ 제곱수의 패턴',en:'3) Patterns in square numbers',zh:'③ 平方数的规律'},
        head:{ko:'1,4,9,16,25… 제곱수 수열!',en:'1,4,9,16,25… the square number sequence!',zh:'1,4,9,16,25……平方数数列！'},
        desc:{ko:'같은 수를 두 번 곱한 것을 <b>제곱수</b>라고 해요. 1²=1, 2²=4, 3²=9, 4²=16, 5²=25… 이웃한 두 제곱수의 차이는 홀수예요: 4-1=3, 9-4=5, 16-9=7, 25-16=9!',
              en:'A number multiplied by itself is called a <b>perfect square</b>. 1²=1, 2²=4, 3²=9, 4²=16, 5²=25… The difference between consecutive squares is always odd: 4-1=3, 9-4=5, 16-9=7, 25-16=9!',
              zh:'一个数乘以自身叫做<b>完全平方数</b>。1²=1，2²=4，3²=9，4²=16，5²=25……相邻平方数的差总是奇数：4-1=3，9-4=5，16-9=7，25-16=9！'},
        mathSteps:['1²=1, 2²=4, 3²=9','차이: 3, 5, 7, 9…','연속 홀수!'],
        result:{ko:'제곱수의 차이가 연속 홀수! 수학의 아름다운 패턴이에요.',en:'Differences between squares are consecutive odd numbers — a beautiful pattern in maths!',zh:'平方数之差是连续奇数——数学中的美丽规律！'},
        book:null }
    ],
    rule:{ ko:'① aⁿ = a를 n번 곱함  ② 10ⁿ = 1 뒤에 0이 n개  ③ 제곱수 차이 = 연속 홀수',
      en:'① aⁿ = a multiplied n times  ② 10ⁿ = 1 with n zeros  ③ Differences between squares = consecutive odd numbers',
      zh:'① aⁿ = a乘n次  ② 10ⁿ = 1后n个0  ③ 平方数差=连续奇数' }
  },

  check:{
    fills:[
      { tex:'3^4 = \\square', answer:81,
        hint:{ ko:'3×3=9, 9×3=27, 27×3=?', en:'3×3=9, 9×3=27, 27×3=?', zh:'3×3=9，9×3=27，27×3=？' } },
      { tex:'2^5 = \\square', answer:32,
        hint:{ ko:'2→4→8→16→?', en:'2→4→8→16→?', zh:'2→4→8→16→？' } }
    ],
    open:{ ko:'10³=1000이 되는 이유를 자릿값으로 설명해 봐요. 거듭제곱과 자릿값은 어떻게 연결될까요?',
      en:'Explain why 10³=1000 using place value. How do powers connect to the number system?',
      zh:'用位值解释为什么10³=1000。幂运算与数位体系有什么联系？' },
    openHint:{ ko:'예) 10³은 10을 3번 곱한 것. 10¹=10(십의 자리), 10²=100(백의 자리), 10³=1000(천의 자리). 자릿값은 10의 거듭제곱이에요.',
      en:'e.g. 10³ = 10 × 10 × 10. 10¹=10 (tens), 10²=100 (hundreds), 10³=1000 (thousands). Place values are powers of 10.',
      zh:'例）10³=10×10×10。10¹=10（十位），10²=100（百位），10³=1000（千位）。位值就是10的幂。' }
  },

  lab:{
    generator:'ml11_squares', level:'main', count:4,
    params:{ powers:true },
    intro:{
      ko:'이제 거듭제곱 마법을 써볼 시간! 단계별로 곱해가며 답을 구해봐.',
      en:'Time to cast the power spell! Multiply step by step to find the answer.',
      zh:'是时候施展幂运算魔法了！一步步连乘找到答案。'
    }
  },

  arena:{
    generator:'ml11_squares', level:'main', count:8, timeLimit:300,
    params:{ powers:true },
    rule:{ ko:'5분 안에 거듭제곱 문제를 모두 풀어요!', en:'Solve all power problems in 5 minutes!', zh:'5分钟内解答所有幂运算题！' }
  },

  stamp:{ label:{ ko:'거듭제곱 마법사', en:'Power Wizard', zh:'幂运算魔法师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'마법 완성! 🔺',en:'Magic complete!',zh:'魔法完成！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'한 단계씩 곱해봐!',en:'Multiply step by step!',zh:'一步步乘！'} ],
    finish:{ ko:'완벽해! 거듭제곱 마법사야! 🔺✨', en:'Perfect! Power Wizard!', zh:'完美！幂运算魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
