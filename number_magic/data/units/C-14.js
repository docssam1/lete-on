/* Numbers of Magic — 유닛 C-14: 창살 곱셈법 (중급 창의전략 6단계) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-14'] = {
  id:'C-14', tier:'intermediate', level:'C', order:14,
  generator:'ml9_mul3d2d',
  title:{ ko:'창살 곱셈법', en:'Bar Multiplication', zh:'交叉线乘法' },
  subtitle:{ ko:'칸마다 빗금을 긋고 대각선 띠로 모아 더하는 옛 마법사의 방법!', en:'Slash each cell and gather the diagonal bands — the old wizards\' method!', zh:'每格画斜线，沿对角带汇总相加——古代魔法师的方法！' },
  icon:'🏛️',

  practice:{
    generator:'ml9_mul3d2d', level:'practice', count:4,
    params:{},
    intro:{
      ko:'큰 수 곱셈을 칸칸이 나눠 담고 대각선 띠로 모아 더하는 창살 곱셈법이야. 종이에 칸을 그리며 풀어봐! 준비됐지?',
      en:"Bar multiplication stores each little product in its own cell, then gathers them along diagonal bands. Draw the cells on paper as you solve! Ready?",
      zh:'交叉线乘法把每个小积分别放进格子，再沿对角带汇总相加。在纸上画格子来解题！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 칸을 나누고 빗금 긋기',en:'1) Divide into cells, slash a bar',zh:'① 分格，画斜线'},
        head:{ko:'342×67: 가로 3칸 × 세로 2칸!',en:'342×67: 3 columns, 2 rows!',zh:'342×67：3列×2行！'},
        desc:{ko:'수백 년 전 수학자들이 쓰던 방법이에요! 342×67이면 <b>가로 3칸(3,4,2), 세로 2칸(6,7)</b>으로 나눠요. 각 칸에 <b>빗금(대각선 창살)</b>을 하나씩 긋고, 행×열의 곱을 써 넣어요: 십의 자리는 빗금 위, 일의 자리는 아래. 예: 6×2=12면 위에 1, 아래에 2.',
              en:'Mathematicians used this centuries ago! For 342×67, divide into <b>3 columns (3,4,2) and 2 rows (6,7)</b>. Slash each cell with a <b>bar (diagonal line)</b>, then fill in each row×column product: tens above the bar, ones below. E.g. 6×2=12 → 1 above, 2 below.',
              zh:'数百年前的数学家就用这个方法！342×67要分成<b>3列(3,4,2)×2行(6,7)</b>。每格画一条<b>斜线</b>，填入行×列的积：十位写在线上方，个位写在下方。例：6×2=12→上面1，下面2。'},
        mathSteps:['가로: 3 | 4 | 2','세로: 6, 7','각 칸: 곱을 십/일로 나눠 적기'],
        result:{ko:'칸 6개에 곱 6개가 차곡차곡! 한 칸 = 한 곱셈.',en:'Six little products stored in six cells! One cell = one product.',zh:'6个格子装6个积！一格=一个乘法。'},
        book:{ko:'각 칸은 자리값 조각이에요. 3(백)×6(십)의 칸은 사실 300×60=18000의 조각. 빗금이 같은 자리값끼리 모아줘요.',
              en:'Each cell is a place-value piece: the 3(hundreds)×6(tens) cell really holds 300×60=18000. The bars collect pieces of equal place value.',
              zh:'每个格子是一个位值块：3(百)×6(十)的格子其实装着300×60=18000。斜线把相同位值的块聚在一起。'} },

      { tag:{ko:'② 대각선 띠로 모아 더하기',en:'2) Gathering the diagonal bands',zh:'② 沿对角带汇总相加'},
        head:{ko:'오른쪽 아래부터 띠를 따라!',en:'From the bottom-right, follow each band!',zh:'从右下角开始，沿每条带！'},
        desc:{ko:'모든 칸을 채웠으면 <b>오른쪽 아래 대각선 띠부터</b> 따라 더해요. 각 띠가 하나의 자리(일→십→백→…)예요. 띠의 합이 10을 넘으면 <b>다음 띠로 올림</b>! 마지막에 왼쪽 위부터 숫자를 읽으면 그게 답이에요.',
              en:'Once all cells are filled, add along the diagonal bands <b>starting from the bottom-right</b>. Each band is one place (ones→tens→hundreds→…). If a band\'s sum exceeds 10, <b>carry into the next band</b>! Finally read the digits from the top-left — that\'s your answer.',
              zh:'格子填满后，<b>从右下角的对角带开始</b>相加。每条带是一个数位(个→十→百→…)。带内和超过10就<b>向下一条带进位</b>！最后从左上角读数字，就是答案。'},
        mathSteps:['일 자리 띠부터 합산','10 넘으면 다음 띠로 올림','왼쪽 위부터 읽기 = 답'],
        result:{ko:'띠 = 자리! 띠마다 더하고 올리면 답이 저절로.',en:'Band = place! Add each band, carry, and the answer appears.',zh:'带=数位！逐带相加进位，答案自然出现。'},
        book:{ko:'이 방법의 좋은 점: 곱하기 단계와 더하기 단계가 완전히 분리돼요. 곱할 때는 곱셈만, 더할 때는 덧셈만 — 머릿속이 한 번에 한 가지 일만 해요.',
              en:'This method\'s gift: multiplying and adding are fully separated. While multiplying you only multiply; while adding you only add — the brain does one job at a time.',
              zh:'这个方法的好处：乘和加完全分开。乘的时候只乘，加的时候只加——大脑一次只做一件事。'} },

      { tag:{ko:'③ 342×67 완주하기',en:'3) Completing 342×67',zh:'③ 完成342×67'},
        head:{ko:'창살로 342×67 = 22914',en:'By bars: 342×67 = 22914',zh:'用交叉线：342×67 = 22914'},
        desc:{ko:'전체를 함께 풀어요! 윗줄(×6): 3×6=18, 4×6=24, 2×6=12. 아랫줄(×7): 3×7=21, 4×7=28, 2×7=14. 대각선 띠 합(일부터) + 올림을 처리하며 모으면 <b>22914</b>. 검산: 342×67 = 342×60+342×7 = 20520+2394 = 22914 ✓.',
              en:'Let\'s do the whole thing! Top row (×6): 3×6=18, 4×6=24, 2×6=12. Bottom row (×7): 3×7=21, 4×7=28, 2×7=14. Summing bands from the ones side and carrying gives <b>22914</b>. Check: 342×67 = 342×60+342×7 = 20520+2394 = 22914 ✓.',
              zh:'一起完整算一遍！上排(×6)：3×6=18，4×6=24，2×6=12。下排(×7)：3×7=21，4×7=28，2×7=14。从个位侧沿对角带求和并进位，得<b>22914</b>。验证：342×67 = 342×60+342×7 = 20520+2394 = 22914 ✓。'},
        mathSteps:['×6줄: 18, 24, 12','×7줄: 21, 28, 14','대각선 띠 합+올림 → 22914'],
        result:{ko:'342×67=22914! 칸이 여섯 곱을 정리해 줬어요.',en:'342×67=22914! The cells organised all six products.',zh:'342×67=22914！格子整理好了六个积。'},
        book:null }
    ],
    rule:{ ko:'① 자릿수만큼 칸 나누고 빗금 긋기  ② 칸마다 곱을 십/일로 나눠 적기  ③ 오른쪽 아래 띠부터 더하고 올림',
      en:'① Divide into cells by digit and slash a bar in each  ② Fill each cell\'s product as tens/ones  ③ Add bands from the bottom-right, carrying',
      zh:'① 按位数分格并画斜线  ② 每格的积分十位/个位填写  ③ 从右下带开始相加进位' }
  },

  check:{
    fills:[
      { tex:'213 \\times 34 = \\square', answer:7242,
        hint:{ ko:'213×30=6390, 213×4=852, 합은?', en:'213×30=6390, 213×4=852, sum?', zh:'213×30=6390，213×4=852，和是？' } },
      { tex:'456 \\times 23 = \\square', answer:10488,
        hint:{ ko:'456×20=9120, 456×3=1368, 합은?', en:'456×20=9120, 456×3=1368, sum?', zh:'456×20=9120，456×3=1368，和是？' } }
    ],
    open:{ ko:'창살 곱셈법에서 대각선 띠가 왜 같은 자리끼리 모이는지 설명해 봐요.',
      en:'Explain why each diagonal band in bar multiplication collects digits of the same place value.',
      zh:'解释交叉线乘法中为什么每条对角带聚集的是相同数位。' },
    openHint:{ ko:'예) 한 칸의 자리값 = 가로 자리 × 세로 자리. 왼쪽으로 한 칸(×10)이나 아래로 한 칸(×10) 모두 자리값이 10배씩 커져서, 대각선 방향으로는 자리값이 같아요.',
      en:'e.g. A cell\'s value = column place × row place. Moving one cell left (×10) or one cell down (×10) both raise the value tenfold, so along a diagonal the place value stays equal.',
      zh:'例）格子的位值=列位×行位。向左一格(×10)或向下一格(×10)位值都扩大10倍，所以沿对角线方向位值相同。' }
  },

  lab:{
    generator:'ml9_mul3d2d', level:'main', count:4,
    params:{},
    intro:{
      ko:'창살 마법! 종이에 칸을 그리고 대각선 띠로 더해봐.',
      en:'Bar magic! Draw the cells on paper and add the diagonal bands.',
      zh:'交叉线魔法！在纸上画格子，沿对角带相加。'
    }
  },

  arena:{
    generator:'ml9_mul3d2d', level:'main', count:6, timeLimit:420,
    params:{},
    rule:{ ko:'7분 안에 창살 곱셈 문제를 모두 풀어요!', en:'Solve all bar-multiplication problems in 7 minutes!', zh:'7分钟内解答所有交叉线乘法题！' }
  },

  stamp:{ label:{ ko:'창살 마법사', en:'Bar Wizard', zh:'交叉线魔法师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'창살 완성! 🏛️',en:'Bars complete!',zh:'交叉线完成！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'대각선 띠를 따라 더해봐!',en:'Add along the diagonal bands!',zh:'沿对角带相加！'}, {ko:'올림을 다음 띠로 보냈어?',en:'Did you carry to the next band?',zh:'进位送到下一带了吗？'} ],
    finish:{ ko:'완벽해! 창살 마법사! 🏛️✨', en:'Perfect! Bar Wizard!', zh:'完美！交叉线魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
