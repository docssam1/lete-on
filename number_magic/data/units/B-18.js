/* Numbers of Magic — 유닛 B-18: 몇십 × 한 자리 마법 (중급 G 챕터1) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-18'] = {
  id:'B-18', tier:'intermediate', level:'B', order:18,
  generator:'ml5_tensMul',
  title:{ ko:'몇십 × 한 자리 마법', en:'Tens × 1-Digit Magic', zh:'几十 × 一位数魔法' },
  subtitle:{ ko:'30×4=120: 3×4=12에 0만 붙여요!', en:'30×4=120: just put a 0 after 3×4=12!', zh:'30×4=120：3×4=12后面加个0！' },
  icon:'🔟',

  practice:{
    generator:'ml5_tensMul', level:'practice', count:5,
    params:{ mode:'t1' },
    intro:{
      ko:'몇십 곱하기 한 자리를 연습할 거야. 30×4처럼 구구단에 0만 붙이면 돼! 준비됐지?',
      en:"Let's practise tens times a 1-digit number. Just use your times tables and add a zero — like 30×4! Ready?",
      zh:'我们来练习几十乘一位数。就像30×4一样，用乘法口诀再加个0就行了！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 몇십 × 1자리 = 구구 + 0',en:'1) Tens × 1-digit = times table + zero',zh:'① 几十 × 一位数 = 口诀 + 0'},
        head:{ko:'30×4: 3×4=12, 뒤에 0 붙이면 120!',en:'30×4: do 3×4=12, then add a zero to get 120!',zh:'30×4：先算3×4=12，再加个0变成120！'},
        desc:{ko:'30×4를 계산할 때 처음부터 어렵게 생각하지 않아도 돼요. 30은 <b>3의 10배</b>니까, 3×4=12의 10배인 120이에요. 그냥 뒤에 0을 붙이면 돼요!',
              en:'Don\'t over-think 30×4. Since 30 is <b>3 times ten</b>, the answer is 10 times 3×4=12, which is 120. Just attach a zero!',
              zh:'计算30×4时不需要想得太复杂。因为30是<b>3的10倍</b>，所以答案是3×4=12的10倍，即120。只需在后面加个0！'},
        mathSteps:['30 × 4','= (3 × 10) × 4','= 3 × 4 × 10','= 12 × 10 = 120'],
        result:{ko:'30×4=120! 구구단 3×4=12를 알면 0만 붙이면 바로 나와요.',en:'30×4=120! Know 3×4=12, slap on a zero, done.',zh:'30×4=120！知道3×4=12，加个0，搞定。'},
        book:{ko:'30×4는 (3×10)×4 = 3×4×10 = 12×10 = 120이에요. 몇십에 한 자리를 곱할 때는 앞 숫자끼리 구구단을 하고 뒤에 0을 하나 붙여요.',
              en:'30×4 = (3×10)×4 = 3×4×10 = 12×10 = 120. When multiplying a multiple of ten by a 1-digit number, use the times table for the leading digits and append one zero.',
              zh:'30×4=(3×10)×4=3×4×10=12×10=120。几十乘一位数时，用前面的数字相乘再在后面加一个0。'} },

      { tag:{ko:'② 왜 0을 붙일까?',en:'2) Why do we add a zero?',zh:'② 为什么要加0？'},
        head:{ko:'30은 3의 10배 — 위치값의 원리!',en:'30 is 10 times 3 — the place value principle!',zh:'30是3的10倍——位值原理！'},
        desc:{ko:'30은 3이 10의 자리에 있는 것이에요. <b>자릿값</b> 원리 때문에 3×4=12보다 10배 더 큰 120이 나와요. 0을 붙이는 것은 이 10배 원리를 빠르게 계산하는 방법이에요.',
              en:'30 has the digit 3 in the tens place. Because of <b>place value</b>, the answer is 10 times bigger than 3×4=12, giving 120. Adding a zero is a quick way to apply this ×10 rule.',
              zh:'30中数字3在十位上。由于<b>位值</b>原理，答案比3×4=12大10倍，即120。加0是快速应用这个×10规则的方法。'},
        mathSteps:['30 = 3 × 10','30×4 = 3×10×4 = 3×4×10','= 12×10 = 120',{ko:'자릿값 원리!',en:'\\text{place value at work!}',zh:'位值原理！'}],
        result:{ko:'0을 붙이는 것은 10을 곱하는 것과 같아요. 자릿값이 한 칸 올라가요!',en:'Adding a zero is the same as multiplying by 10 — shifting the place value up one position!',zh:'加0等于乘以10——位值向左移动一位！'},
        book:{ko:'10을 곱하면 모든 자릿값이 한 칸 왼쪽으로 이동하고 일의 자리에 0이 채워져요. 그래서 ×10의 결과는 뒤에 0 하나를 붙인 것과 같아요.',
              en:'Multiplying by 10 shifts every digit one place to the left and fills the ones place with 0. That\'s why ×10 looks like appending a zero.',
              zh:'乘以10使每个数位向左移动一位，个位补0。这就是为什么×10的结果看起来像在后面加一个0。'} },

      { tag:{ko:'③ 응용 — 몇백도 같아요',en:'3) Extension — hundreds work the same way',zh:'③ 拓展——几百也一样'},
        head:{ko:'300×4=1200: 0이 두 개!',en:'300×4=1200: two zeros!',zh:'300×4=1200：两个0！'},
        desc:{ko:'몇백에 한 자리를 곱할 때도 같은 원리예요. 300×4: 3×4=12, 뒤에 <b>0을 두 개</b> 붙이면 1200! 0의 개수는 곱해지는 10의 횟수와 같아요.',
              en:'The same principle works for hundreds. 300×4: do 3×4=12, then attach <b>two zeros</b> → 1200! The number of zeros equals how many times you multiply by 10.',
              zh:'几百乘一位数的原理相同。300×4：3×4=12，再加<b>两个0</b>→1200！0的个数等于乘以10的次数。'},
        mathSteps:['300×4 = 3×4×100','= 12×100 = 1200',{ko:'→ 0의 개수만큼 자릿값 이동!',en:'→ \\text{shift one place per zero!}',zh:'→ 有几个0就移几位！'}],
        result:{ko:'300×4=1200! 0이 두 개. 몇천도 0이 세 개만 붙이면 돼요!',en:'300×4=1200! Two zeros. For thousands, just add three zeros!',zh:'300×4=1200！两个0。几千就加三个0！'},
        book:null }
    ],
    rule:{ ko:'① 몇십×한자리: 앞 숫자 구구단 + 0 하나  ② 0을 붙임 = 10을 곱함 = 자릿값 이동  ③ 몇백은 00(0 두 개)!',
      en:'① Tens×1-digit: times table of leading digits + one zero  ② Append zero = multiply by 10 = place value shift  ③ Hundreds: append two zeros!',
      zh:'① 几十×一位数：前面数字口诀+一个0  ② 加0=乘10=位值移动  ③ 几百：加两个0！' }
  },

  check:{
    fills:[
      { tex:'40 \\times 7 = \\square', answer:280,
        hint:{ ko:'4×7=28, 뒤에 0을 붙이면?', en:'4×7=28, now add a zero!', zh:'4×7=28，加个0是多少？' } },
      { tex:'60 \\times 5 = \\square', answer:300,
        hint:{ ko:'6×5=30, 뒤에 0을 붙이면?', en:'6×5=30, now add a zero!', zh:'6×5=30，加个0是多少？' } }
    ],
    open:{ ko:'30×4=120이 되는 이유를 자릿값 원리로 설명해 봐요. 왜 구구단 결과에 0 하나를 붙이면 될까요?',
      en:'Explain why 30×4=120 using place value. Why can you just attach one zero to the times-table result?',
      zh:'用位值原理解释为什么30×4=120。为什么只需在口诀结果后面加一个0就行了？' },
    openHint:{ ko:'예) 30은 3이 십의 자리에 있는 수예요. 그래서 3×4=12보다 10배 큰 120이 돼요. 10배 하면 자릿값이 한 칸 올라가고 0이 채워져요.',
      en:'e.g. 30 has a 3 in the tens place, so the product is 10 times 3×4=12, giving 120. Multiplying by 10 shifts each digit one place left and fills with a zero.',
      zh:'例）30是3在十位上的数，所以积比3×4=12大10倍，得120。乘以10使每位数字向左移动一位，用0填充。' }
  },

  lab:{
    generator:'ml5_tensMul', level:'main', count:4,
    params:{ mode:'t1' },
    intro:{
      ko:'이제 몇십 곱셈 마법을 써볼 시간! 구구단을 떠올리고 0을 붙여봐.',
      en:'Time to cast the tens-multiplication spell! Think of your times table, then add that zero.',
      zh:'是时候施展几十乘法魔法了！想想乘法口诀，然后加个0。'
    }
  },

  arena:{
    generator:'ml5_tensMul', level:'main', count:8, timeLimit:300,
    params:{ mode:'t1' },
    rule:{ ko:'5분 안에 몇십 곱하기 문제를 모두 풀어요!', en:'Solve all tens-multiplication problems in 5 minutes!', zh:'5分钟内解答所有几十乘法题！' }
  },

  stamp:{ label:{ ko:'몇십 계산 마법사', en:'Tens Calculation Wizard', zh:'几十计算魔法师' }, coins:25 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'구구단 달인! 🌟',en:'Times-table master!',zh:'口诀高手！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 몇십 곱셈 마스터야! 🔟✨', en:'Perfect! Tens multiplication master!', zh:'完美！几十乘法达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
