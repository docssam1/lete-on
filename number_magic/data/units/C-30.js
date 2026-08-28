/* Numbers of Magic — 유닛 C-30: 격자 곱셈법 (중급 창의전략 6단계) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-30'] = {
  id:'C-30', tier:'intermediate', level:'C', order:30,
  generator:'ml9_mul3d2d',
  title:{ ko:'격자 곱셈법', en:'Grid Multiplication', zh:'格子乘法' },
  subtitle:{ ko:'격자를 그리고 대각선으로 더하는 옛 마법사의 방법!', en:'Draw a grid and add along the diagonals — the old wizards\' method!', zh:'画格子沿对角线相加——古代魔法师的方法！' },
  icon:'🏛️',

  practice:{
    generator:'ml9_mul3d2d', level:'practice', count:4,
    params:{ level:'practice' },
    intro:{
      ko:'큰 수 곱셈을 격자에 나눠 담고 대각선으로 더하는 격자 곱셈법이야. 종이에 격자를 그리며 풀어봐! 준비됐지?',
      en:"Grid multiplication stores each little product in a grid, then adds along diagonals. Draw the grid on paper as you solve! Ready?",
      zh:'格子乘法把每个小积放进格子里，再沿对角线相加。在纸上画格子来解题！准备好了吗？'
    }
  },

  discover:{
    story:{
      hook:{ ko:'알고리즘이라는 말은 원래 무엇이었을까요?',
        en:'The word algorithm — what was it originally?',
        zh:'algorithm（算法）这个词原本是什么？' },
      history:{ ko:'사람 이름이었어요. 1200년쯤 전 바그다드에서 일한 수학자 알콰리즈미의 이름을 라틴어로 옮긴 게 알고리즘이 됐죠. 그가 쓴 책 제목의 한 낱말 알자브르는 대수학(algebra)이 되었고요. 그가 인도에서 배워 전한 계산법 중에 격자를 그려 곱하는 방법도 있었어요 — 지금 우리가 쓰는 그 격자입니다.',
        en:'It was a person. Al-Khwarizmi, a mathematician working in Baghdad about 1,200 years ago, had his name rendered into Latin as Algoritmi. One word from the title of his book, al-jabr, became algebra. Among the methods he learned from India and passed on was multiplying inside a grid — the very grid we draw today.',
        zh:'它原本是一个人。大约1200年前在巴格达工作的数学家花拉子米，名字译成拉丁语就成了Algoritmi。他书名里的一个词al-jabr，变成了代数（algebra）。他从印度学来并传下去的算法里，就有在格子里做乘法的方法——正是我们今天画的那种格子。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 격자 그리기',en:'1) Drawing the grid',zh:'① 画格子'},
        head:{ko:'234×56: 가로 3칸 × 세로 2칸 격자!',en:'234×56: a 3-wide, 2-tall grid!',zh:'234×56：3列×2行的格子！'},
        desc:{ko:'수백 년 전 수학자들이 쓰던 방법이에요! 234×56이면 <b>가로 3칸(2,3,4), 세로 2칸(5,6)</b> 격자를 그려요. 각 칸에 <b>대각선</b>을 긋고, 행×열의 곱을 써 넣어요: 십의 자리는 대각선 위, 일의 자리는 아래. 예: 3×5=15면 위에 1, 아래에 5.',
              en:'Mathematicians used this centuries ago! For 234×56, draw a grid <b>3 columns wide (2,3,4) and 2 rows tall (5,6)</b>. Slash each cell with a <b>diagonal</b>, then fill in each row×column product: tens above the slash, ones below. E.g. 3×5=15 → 1 above, 5 below.',
              zh:'数百年前的数学家就用这个方法！234×56要画<b>3列(2,3,4)×2行(5,6)</b>的格子。每格画一条<b>对角线</b>，填入行×列的积：十位写在线上方，个位写在下方。例：3×5=15→上面1，下面5。'},
        mathSteps:['가로: 2 | 3 | 4','세로: 5, 6','각 칸: 곱을 십/일로 나눠 적기'],
        result:{ko:'격자 6칸에 곱 6개가 차곡차곡! 한 칸 = 한 곱셈.',en:'Six little products stored in six cells! One cell = one product.',zh:'6个格子装6个积！一格=一个乘法。'},
        book:{ko:'격자의 각 칸은 자리값 조각이에요. 2(백)×5(십)의 칸은 사실 200×50=10000의 조각. 대각선이 같은 자리값끼리 모아줘요.',
              en:'Each cell is a place-value piece: the 2(hundreds)×5(tens) cell really holds 200×50=10000. The diagonals collect pieces of equal place value.',
              zh:'每个格子是一个位值块：2(百)×5(十)的格子其实装着200×50=10000。对角线把相同位值的块聚在一起。'} },

      { tag:{ko:'② 대각선으로 더하기',en:'2) Adding along the diagonals',zh:'② 沿对角线相加'},
        head:{ko:'오른쪽 아래부터 대각선 줄을 따라!',en:'From the bottom-right, follow each diagonal band!',zh:'从右下角开始，沿每条对角带！'},
        desc:{ko:'모든 칸을 채웠으면 <b>오른쪽 아래 대각선부터</b> 줄을 따라 더해요. 각 대각선 줄이 하나의 자리(일→십→백→…)예요. 줄의 합이 10을 넘으면 <b>다음 대각선으로 올림</b>! 마지막에 왼쪽 위부터 숫자를 읽으면 그게 답이에요.',
              en:'Once all cells are filled, add along the diagonal bands <b>starting from the bottom-right</b>. Each band is one place (ones→tens→hundreds→…). If a band\'s sum exceeds 10, <b>carry into the next diagonal</b>! Finally read the digits from the top-left — that\'s your answer.',
              zh:'格子填满后，<b>从右下角的对角带开始</b>相加。每条对角带是一个数位(个→十→百→…)。带内和超过10就<b>向下一条对角线进位</b>！最后从左上角读数字，就是答案。'},
        mathSteps:['일 자리 대각선부터 합산','10 넘으면 다음 줄로 올림','왼쪽 위부터 읽기 = 답'],
        result:{ko:'대각선 = 자리! 줄마다 더하고 올리면 답이 저절로.',en:'Diagonal = place! Add each band, carry, and the answer appears.',zh:'对角线=数位！逐带相加进位，答案自然出现。'},
        book:{ko:'격자법의 좋은 점: 곱하기 단계와 더하기 단계가 완전히 분리돼요. 곱할 때는 곱셈만, 더할 때는 덧셈만 — 머릿속이 한 번에 한 가지 일만 해요.',
              en:'The grid\'s gift: multiplying and adding are fully separated. While multiplying you only multiply; while adding you only add — the brain does one job at a time.',
              zh:'格子法的好处：乘和加完全分开。乘的时候只乘，加的时候只加——大脑一次只做一件事。'} },

      { tag:{ko:'③ 234×56 완주하기',en:'3) Completing 234×56',zh:'③ 完成234×56'},
        head:{ko:'격자로 234×56 = 13104',en:'By grid: 234×56 = 13104',zh:'用格子：234×56 = 13104'},
        desc:{ko:'전체를 함께 풀어요! 윗줄(×5): 2×5=10, 3×5=15, 4×5=20. 아랫줄(×6): 2×6=12, 3×6=18, 4×6=24. 대각선 합(일부터): 4 | 0+1+2=3… 올림을 처리하며 모으면 <b>13104</b>. 검산: 234×56 = 234×50+234×6 = 11700+1404 = 13104 ✓.',
              en:'Let\'s do the whole thing! Top row (×5): 2×5=10, 3×5=15, 4×5=20. Bottom row (×6): 2×6=12, 3×6=18, 4×6=24. Summing diagonals from the ones side and carrying gives <b>13104</b>. Check: 234×56 = 234×50+234×6 = 11700+1404 = 13104 ✓.',
              zh:'一起完整算一遍！上排(×5)：2×5=10，3×5=15，4×5=20。下排(×6)：2×6=12，3×6=18，4×6=24。从个位侧沿对角线求和并进位，得<b>13104</b>。验证：234×56 = 234×50+234×6 = 11700+1404 = 13104 ✓。'},
        mathSteps:['×5줄: 10, 15, 20','×6줄: 12, 18, 24','대각선 합+올림 → 13104'],
        result:{ko:'234×56=13104! 격자가 여섯 곱을 정리해 줬어요.',en:'234×56=13104! The grid organised all six products.',zh:'234×56=13104！格子整理好了六个积。'},
        book:null }
    ],
    rule:{ ko:'① 자릿수만큼 격자 그리고 대각선 긋기  ② 칸마다 곱을 십/일로 나눠 적기  ③ 오른쪽 아래 대각선부터 더하고 올림',
      en:'① Draw the grid with a slash in each cell  ② Fill each cell\'s product as tens/ones  ③ Add diagonals from the bottom-right, carrying',
      zh:'① 按位数画格子并画对角线  ② 每格的积分十位/个位填写  ③ 从右下对角线开始相加进位' }
  },

  check:{
    fills:[
      { tex:'123 \\times 45 = \\square', answer:5535,
        hint:{ ko:'123×40=4920, 123×5=615, 합은?', en:'123×40=4920, 123×5=615, sum?', zh:'123×40=4920，123×5=615，和是？' } },
      { tex:'214 \\times 32 = \\square', answer:6848,
        hint:{ ko:'214×30=6420, 214×2=428, 합은?', en:'214×30=6420, 214×2=428, sum?', zh:'214×30=6420，214×2=428，和是？' } }
    ],
    open:{ ko:'격자 곱셈에서 대각선 줄이 왜 같은 자리끼리 모이는지 설명해 봐요.',
      en:'Explain why each diagonal band in grid multiplication collects digits of the same place value.',
      zh:'解释格子乘法中为什么每条对角带聚集的是相同数位。' },
    openHint:{ ko:'예) 한 칸의 자리값 = 가로 자리 × 세로 자리. 왼쪽으로 한 칸(×10)이나 아래로 한 칸(×10) 모두 자리값이 10배씩 커져서, 대각선 방향으로는 자리값이 같아요.',
      en:'e.g. A cell\'s value = column place × row place. Moving one cell left (×10) or one cell down (×10) both raise the value tenfold, so along a diagonal the place value stays equal.',
      zh:'例）格子的位值=列位×行位。向左一格(×10)或向下一格(×10)位值都扩大10倍，所以沿对角线方向位值相同。' }
  },

  lab:{
    generator:'ml9_mul3d2d', level:'main', count:4,
    params:{ level:'main' },
    intro:{
      ko:'격자 마법! 종이에 격자를 그리고 대각선으로 더해봐.',
      en:'Grid magic! Draw the grid on paper and add the diagonals.',
      zh:'格子魔法！在纸上画格子，沿对角线相加。'
    }
  },

  arena:{
    generator:'ml9_mul3d2d', level:'main', count:6, timeLimit:420,
    params:{ level:'main' },
    rule:{ ko:'7분 안에 격자 곱셈 문제를 모두 풀어요!', en:'Solve all grid problems in 7 minutes!', zh:'7分钟内解答所有格子乘法题！' }
  },

  stamp:{ label:{ ko:'격자 마법사', en:'Grid Wizard', zh:'格子魔法师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'격자 완성! 🏛️',en:'Grid complete!',zh:'格子完成！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'대각선 줄을 따라 더해봐!',en:'Add along the diagonal bands!',zh:'沿对角带相加！'}, {ko:'올림을 다음 줄로 보냈어?',en:'Did you carry to the next band?',zh:'进位送到下一带了吗？'} ],
    finish:{ ko:'완벽해! 격자 마법사! 🏛️✨', en:'Perfect! Grid Wizard!', zh:'完美！格子魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
