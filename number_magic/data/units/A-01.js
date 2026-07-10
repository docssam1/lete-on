/* ============================================================
   Numbers of Magic — 유닛 데이터: A-01 (개정)
   창의수연 초급 A · 챕터1 "더해서 10이 되는 수를 찾아라"
   교재 실제 내용 기반. generator=pair10.
   - 개념(discover): 한자리→두자리→실전 3단, 짝 연결선 데이터(pair)
   - 수범위(range): 진입 시 선택 (oneDigit / twoDigit)
   - 핵심체크(check): 교재 실제 문제(C안) + 열린질문
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-01'] = {
  id:'A-01', tier:'beginner', level:'A', order:1,
  generator:'pair10',
  title:{ ko:'더해서 10을 찾아라', en:'Find the Ten', zh:'找出凑十' },
  subtitle:{ ko:'합이 10이 되는 짝을 찾아 먼저 묶기', en:'Group pairs that make 10', zh:'先把凑成10的组合圈起来' },
  icon:'🔟',

  /* 수범위 선택지 (유닛 진입 시) */
  ranges:[
    { key:'oneDigit', ko:'한 자리', en:'1-digit', zh:'一位数', desc_ko:'3 + 7 처럼 한 자리 수' },
    { key:'twoDigit', ko:'두 자리도', en:'+2-digit', zh:'加两位数', desc_ko:'23 + 17 처럼 두 자리까지' }
  ],

  /* ── STEP1 프랙티스: pair10(practice) ── */
  practice:{
    generator:'pair10', level:'practice', count:5,
    intro:{
      ko:'자, 더해서 10이 되는 수를 말할 거야. 내가 3 하면, 짝꿍 7을 눌러줘. 준비됐지?',
      en:"I'll call a number. Tap its partner that makes 10. Ready?",
      zh:'我说一个数，你按出凑成10的另一半。准备好了吗？'
    }
  },

  /* ── STEP2 디스커버: 개념 3단 (연결선 데이터 포함) ──
     terms: [{tens?, ones, pair?}]  pair 같은 번호끼리 짝(선+색) */
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 한 자리 묶기',en:'1) Single digits',zh:'① 一位数'}, kind:'one',
        head:{ko:'짝을 찾아 먼저 묶어요',en:'Group pairs first',zh:'先把配对圈起来'},
        desc:{ko:'그냥 순서대로 더하면 힘들어요. <b>더해서 10이 되는 짝</b>을 먼저 묶으면 훨씬 쉬워집니다.',
              en:'Find pairs that make 10 and add them first.',zh:'先找出凑成10的配对再相加。'},
        terms:[{ones:3,pair:1},{ones:6,pair:2},{ones:7,pair:1},{ones:4,pair:2}],
        result:{ko:'3과 7, 6과 4가 각각 짝!  10 + 10 = 20',en:'3+7 and 6+4 → 10+10 = 20',zh:'3+7、6+4 → 10+10 = 20'},
        book:{ko:'더해서 10이 되는 수를 찾아 먼저 더합니다. 10을 만들면 계산이 쉬워지고 실수가 줄어요.',
              en:'Make tens first — fewer mistakes.',zh:'先凑十，计算更简单、更少出错。'} },

      { tag:{ko:'② 두 자리도 똑같아요',en:'2) Two digits too',zh:'② 两位数也一样'}, kind:'two',
        head:{ko:'일의 자리끼리 짝을 찾아요',en:'Pair the ones place',zh:'个位互相配对'},
        desc:{ko:'두 자리 수도 원리는 같아요. <b>일의 자리</b>만 보고 짝(합 10)을 찾으면 돼요. 색칠된 부분만 보세요!',
              en:'For 2-digit numbers, just pair the ones digits.',zh:'两位数只看个位来配对。'},
        terms:[{tens:2,ones:3,pair:1},{tens:1,ones:7,pair:1}],
        result:{ko:'일의 자리 3과 7이 짝 → 올림  23 + 17 = 40',en:'ones 3+7 → carry → 23+17 = 40',zh:'个位3+7 → 进位 → 23+17 = 40'},
        book:{ko:'두 자리 수는 일의 자리끼리 더해 10이 되는 짝을 찾습니다. 3+7=10이면 십의 자리로 올림되어 40.',
              en:'Ones make 10 → carry to tens.',zh:'个位凑10 → 向十位进位。'} },

      { tag:{ko:'③ 실전 — 섞여 있어도',en:'3) Mixed',zh:'③ 实战'}, kind:'mix',
        head:{ko:'일의 자리 짝을 모두 찾아요',en:'Find all ones-pairs',zh:'找出所有个位配对'},
        desc:{ko:'한 자리·두 자리가 섞여 있어도 걱정 없어요. <b>일의 자리끼리 짝</b>을 찾아 묶으면 됩니다.',
              en:'Mixed digits? Just pair the ones.',zh:'混合也没关系，个位配对即可。'},
        terms:[{tens:3,ones:7,pair:1},{tens:2,ones:6,pair:2},{tens:1,ones:3,pair:1},{ones:4,pair:2}],
        result:{ko:'7·3 짝, 6·4 짝 → 각각 40  →  40 + 40 = 80',en:'7+3, 6+4 → 40+40 = 80',zh:'7+3、6+4 → 40+40 = 80'},
        book:null }
    ],
    rule:{ ko:'① 더해서 10 되는 짝을 찾는다  ② 짝을 먼저 더한다  ③ 두 자리는 일의 자리로 짝을 찾는다',
      en:'Find 10-pairs → add pairs first → for 2-digit, pair the ones.',
      zh:'找凑十的配对 → 先加配对 → 两位数看个位。' }
  },

  /* ── STEP3 핵심체크: 교재 실제 문제(C안) + 열린질문 ── */
  check:{
    fills:[
      { tex:'9 + 8 + 2 + 1 = \\square', answer:20,
        hint:{ ko:'8과 2로 10! 9와 1로 또 10!', en:'8+2=10, 9+1=10', zh:'8+2=10，9+1=10' } },
      { tex:'23 + 17 = \\square', answer:40, twoDigit:true,
        hint:{ ko:'일의 자리 3과 7이 짝!', en:'ones 3+7=10', zh:'个位 3+7=10' } }
    ],
    open:{
      ko:'만약 더해서 10이 되는 수가 아니라 다른 기준을 잡는다면, 어떤 수를 기준으로 잡고 싶나요?',
      en:'If not 10, what other target sum would you choose? Why?',
      zh:'如果不是凑10，你想以哪个数为标准？为什么？'
    },
    openHint:{
      ko:'예) 5를 기준으로! 5씩 뛰어 세는 건 쉬우니까. 하지만 5보다 큰 한 자리 수는 쪼개야 해요.',
      en:'e.g. Target 5 — easy to skip-count, but bigger numbers need splitting.',
      zh:'例）以5为标准！但比5大的数需要拆分。'
    }
  },

  /* ── STEP4 매직랩: 대화형 (선택 모드 = 짝 골라 묶기) ── */
  lab:{
    generator:'pair10', level:'main', count:4,
    intro:{
      ko:'이제 진짜 마법! 여러 수 중에서 짝꿍이 되는 두 수를 골라 묶어볼까?',
      en:'Now the real magic — pick two numbers that make 10!',
      zh:'现在是真正的魔法——选出凑成10的两个数！'
    }
  },

  /* ── STEP5 아레나: 짝 묶기 배틀 (암산 아님) ── */
  arena:{
    generator:'pair10', level:'main', count:8, timeLimit:300, mode:'pairing',
    rule:{ ko:'5분 안에 짝을 모두 찾아 묶어요!', en:'Find all pairs in 5 minutes!', zh:'5分钟内找出所有配对！' }
  },

  stamp:{ label:{ ko:'10 묶기 마법사', en:'Ten-Maker', zh:'凑十魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'짝꿍 발견! 🎉',en:'You found it!',zh:'找到啦！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'거의 다 왔어!',en:'Almost there!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 10 묶기 마법사야 🪄✨', en:"Perfect! You're a Ten-Maker now!", zh:'完美！你现在是凑十魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
