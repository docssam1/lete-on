/* Numbers of Magic — 유닛 B-19: 몇백 × 한 자리 마법 (중급 G 챕터2) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-19'] = {
  id:'B-19', tier:'intermediate', level:'B', order:19,
  generator:'ml5_tensMul',
  title:{ ko:'몇백 × 한 자리 마법', en:'Hundreds × 1-Digit Magic', zh:'几百 × 一位数魔法' },
  subtitle:{ ko:'200×3=600: 2×3=6에 00을 붙여요!', en:'200×3=600: put two 0s after 2×3=6!', zh:'200×3=600：2×3=6后面加两个0！' },
  icon:'💯',

  practice:{
    generator:'ml5_tensMul', level:'practice', count:5,
    params:{ mode:'h1' },
    intro:{
      ko:'몇백 곱하기 한 자리를 연습할 거야. 200×3처럼 구구단에 00을 붙이면 돼! 준비됐지?',
      en:"Let's practise hundreds times a 1-digit number. Just use your times tables and add two zeros — like 200×3! Ready?",
      zh:'我们来练习几百乘一位数。就像200×3一样，用乘法口诀再加两个0！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 몇백 × 1자리 = 구구 + 00',en:'1) Hundreds × 1-digit = times table + two zeros',zh:'① 几百 × 一位数 = 口诀 + 两个0'},
        head:{ko:'200×3: 2×3=6, 뒤에 00 → 600!',en:'200×3: do 2×3=6, then add two zeros → 600!',zh:'200×3：先算2×3=6，再加两个0→600！'},
        desc:{ko:'200×3을 계산할 때: 200은 <b>2의 100배</b>예요. 2×3=6의 100배는 600이에요. 그래서 구구단 결과에 <b>0을 두 개</b> 붙이면 돼요!',
              en:'For 200×3: since 200 is <b>100 times 2</b>, the answer is 100 times 2×3=6, giving 600. So just attach <b>two zeros</b> to the times-table result!',
              zh:'计算200×3时：因为200是<b>2的100倍</b>，所以答案是2×3=6的100倍，即600。只需在口诀结果后面加<b>两个0</b>！'},
        mathSteps:['200×3','= (2×100)×3','= 2×3×100','= 6×100 = 600'],
        result:{ko:'200×3=600! 2×3=6에 0이 두 개. 몇백 곱셈이 이렇게 쉬워요!',en:'200×3=600! 2×3=6 plus two zeros. Hundreds multiplication is this easy!',zh:'200×3=600！2×3=6加两个0。几百乘法就这么简单！'},
        book:{ko:'200×3 = (2×100)×3 = 2×3×100 = 6×100 = 600. 몇백에 한 자리를 곱할 때는 앞 숫자끼리 구구단을 하고 뒤에 0을 두 개 붙여요.',
              en:'200×3 = (2×100)×3 = 2×3×100 = 6×100 = 600. When multiplying hundreds by a 1-digit number, use the times table for the leading digits and append two zeros.',
              zh:'200×3=(2×100)×3=2×3×100=6×100=600。几百乘一位数时，用前面的数字相乘再在后面加两个0。'} },

      { tag:{ko:'② 자릿수 세기 — 0의 개수!',en:'2) Counting places — number of zeros!',zh:'② 数位计数——0的个数！'},
        head:{ko:'0의 개수 = 올라가는 자릿수!',en:'Number of zeros = places shifted!',zh:'0的个数=移动的位数！'},
        desc:{ko:'<b>20×3=60</b> (0 한 개), <b>200×3=600</b> (00 두 개), <b>2000×3=6000</b> (000 세 개). 곱하는 수에 0이 몇 개 있는지 세면 답의 0 개수를 알 수 있어요!',
              en:'<b>20×3=60</b> (one zero), <b>200×3=600</b> (two zeros), <b>2000×3=6000</b> (three zeros). Count the zeros in the big number to know how many zeros to write in the answer!',
              zh:'<b>20×3=60</b>（一个0），<b>200×3=600</b>（两个0），<b>2000×3=6000</b>（三个0）。数清大数字中0的个数，就知道答案中要写几个0！'},
        mathSteps:[{ko:'20×3=60 (0이 한 개)',en:'20×3=60 \\text{ (one zero)}',zh:'20×3=60（1个0）'},{ko:'200×3=600 (00이 두 개)',en:'200×3=600 \\text{ (two zeros)}',zh:'200×3=600（2个0）'},{ko:'2000×3=6000 (000이 세 개)',en:'2000×3=6000 \\text{ (three zeros)}',zh:'2000×3=6000（3个0）'}],
        result:{ko:'0의 개수 세기: 곱하는 수의 0 개수 = 답의 추가 0 개수!',en:'Zero count: zeros in the multiplier = extra zeros in the answer!',zh:'数0的个数：乘数中0的个数=答案中额外0的个数！'},
        book:{ko:'10을 한 번 곱하면 자릿값이 한 칸, 100을 곱하면 두 칸, 1000을 곱하면 세 칸 이동해요. 이동한 칸만큼 일의 자리부터 0으로 채워져요.',
              en:'Multiplying by 10 shifts one place, by 100 shifts two places, by 1000 shifts three places. Each shift fills the vacated ones place with a zero.',
              zh:'乘以10移动一位，乘以100移动两位，乘以1000移动三位。每移动一位，空出的个位用0填充。'} },

      { tag:{ko:'③ 혼합 응용 — 43×20',en:'3) Mixed application — 43×20',zh:'③ 混合应用——43×20'},
        head:{ko:'43×20: 43×2=86, 뒤에 0 → 860!',en:'43×20: do 43×2=86, then add a zero → 860!',zh:'43×20：先算43×2=86，再加个0→860！'},
        desc:{ko:'몇십이 뒤에 있어도 같은 방법이에요. 43×20: <b>43×2=86</b>을 먼저 계산하고, 20의 0이 한 개니까 뒤에 0을 하나 붙여서 <b>860</b>! 두 자리 × 몇십도 쉬워요.',
              en:'The multiplier can be at the end too. 43×20: <b>43×2=86</b> first, then since 20 has one zero, append one zero → <b>860</b>! Two-digit × tens is easy too.',
              zh:'乘数在后面也一样。43×20：先算<b>43×2=86</b>，因为20有一个0，所以加一个0→<b>860</b>！两位数×几十也很简单。'},
        mathSteps:['43×20','= 43×2×10','= 86×10','= 860'],
        result:{ko:'43×20=860! 두 자리 수 × 몇십도 0 개수만 세면 돼요.',en:'43×20=860! For 2-digit × tens, just count the zeros.',zh:'43×20=860！两位数×几十，只需数0的个数。'},
        book:null }
    ],
    rule:{ ko:'① 몇백×한자리: 앞 숫자 구구단 + 00  ② 0의 개수 = 자릿수 이동 횟수  ③ 자리바꿔도 같은 방법!',
      en:'① Hundreds×1-digit: times table of leading digits + two zeros  ② Number of zeros = place-value shifts  ③ Works when multiplier is flipped too!',
      zh:'① 几百×一位数：前面数字口诀+两个0  ② 0的个数=位值移动次数  ③ 乘数在后面也用同样的方法！' }
  },

  check:{
    fills:[
      { tex:'300 \\times 5 = \\square', answer:1500,
        hint:{ ko:'3×5=15, 뒤에 00을 붙이면?', en:'3×5=15, now add two zeros!', zh:'3×5=15，加两个0是多少？' } },
      { tex:'200 \\times 8 = \\square', answer:1600,
        hint:{ ko:'2×8=16, 뒤에 00을 붙이면?', en:'2×8=16, now add two zeros!', zh:'2×8=16，加两个0是多少？' } }
    ],
    open:{ ko:'200×3=600이 되는 이유를 자릿값 원리로 설명해 봐요. 왜 00을 붙이면 될까요?',
      en:'Explain why 200×3=600 using place value. Why do you attach two zeros?',
      zh:'用位值原理解释为什么200×3=600。为什么要加两个0？' },
    openHint:{ ko:'예) 200은 2가 백의 자리에 있는 수예요. 2×3=6보다 100배 큰 600이 돼요. 100배 하면 자릿값이 두 칸 올라가고 00이 채워져요.',
      en:'e.g. 200 has a 2 in the hundreds place, so the product is 100 times 2×3=6, giving 600. Multiplying by 100 shifts digits two places left and fills with two zeros.',
      zh:'例）200是2在百位上的数，所以积比2×3=6大100倍，得600。乘以100使数字向左移动两位，用两个0填充。' }
  },

  lab:{
    generator:'ml5_tensMul', level:'main', count:4,
    params:{ mode:'t1' },
    intro:{
      ko:'이제 몇백 곱셈 마법을 써볼 시간! 구구단을 떠올리고 0을 두 개 붙여봐.',
      en:'Time to cast the hundreds-multiplication spell! Think of your times table, then add those two zeros.',
      zh:'是时候施展几百乘法魔法了！想想乘法口诀，然后加两个0。'
    }
  },

  arena:{
    generator:'ml5_tensMul', level:'main', count:8, timeLimit:300,
    params:{ mode:'t1' },
    rule:{ ko:'5분 안에 몇백 곱하기 문제를 모두 풀어요!', en:'Solve all hundreds-multiplication problems in 5 minutes!', zh:'5分钟内解答所有几百乘法题！' }
  },

  stamp:{ label:{ ko:'몇백 계산 마법사', en:'Hundreds Calculation Wizard', zh:'几百计算魔法师' }, coins:25 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'구구단 달인! 🌟',en:'Times-table master!',zh:'口诀高手！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 몇백 곱셈 마스터야! 💯✨', en:'Perfect! Hundreds multiplication master!', zh:'完美！几百乘法达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
