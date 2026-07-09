/* ============================================================
   Numbers of Magic — 유닛 데이터: A-01
   창의수연 초급 A · 챕터1 "더해서 10이 되는 수를 찾아라"
   교재 실제 내용 기반. generator=pair10.
   대사·개념·핵심체크는 각 STEP에서 사용.
   window.NM_UNITS 에 누적 등록.
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

  /* ── STEP1 프랙티스: pair10(practice) 반복 (엔진이 생성) ── */
  practice:{
    generator:'pair10', level:'practice',
    count:5,                       // 통과 기준 문항 수
    intro:{
      ko:'자, 더해서 10이 되는 수를 말할 거야. 내가 3 하면, 짝꿍 7을 눌러줘. 준비됐지?',
      en:"I'll call a number. You tap its partner that makes 10. Ready?",
      zh:'我说一个数，你按出凑成10的另一半。准备好了吗？'
    }
  },

  /* ── STEP2 디스커버: 누미의 마법 노트 (교재 메모장 실제 내용) ── */
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    // 교재 p.2 수연이의 메모장 실제 예시
    examples:[
      { tex:'3 + 6 + 7 + 4', steps:['3 + 6 + 7 + 4','(3+7) + (6+4)','10 + 10','20'],
        note:{ ko:'3과 7, 6과 4 — 합이 10인 짝을 먼저 묶어요', en:'Group the pairs that make 10 first', zh:'先把凑成10的组合圈起来' } },
      { tex:'1 + 5 + 8 + 5', steps:['1 + 5 + 8 + 5','(5+5) + 1 + 8','10 + 9','19'],
        note:{ ko:'5와 5로 10! 남은 1과 8을 더해요', en:'5 and 5 make 10, then add the rest', zh:'5和5凑成10，再加上剩下的' } }
    ],
    rule:{
      ko:'① 더해서 10이 되는 수를 찾는다  ② 그 수들을 먼저 더한다',
      en:'1) Find numbers that add to 10  2) Add those first',
      zh:'① 找出凑成10的数  ② 先把它们相加'
    }
  },

  /* ── STEP3 핵심체크: 빈칸 + 열린 질문 (교재 p.11 실제) ── */
  check:{
    // 빈칸형 (자동 채점)
    fills:[
      { tex:'9 + 8 + 2 + 1 = \\square', answer:20,
        hint:{ ko:'8과 2로 10! 9와 1로 또 10!', en:'8+2=10, 9+1=10', zh:'8+2=10，9+1=10' } }
    ],
    // 열린 질문 (교재의 사고력 질문 — 정답 없음, 생각 유도)
    open:{
      ko:'만약 더해서 10이 되는 수가 아니라 다른 기준을 잡는다면, 어떤 수를 기준으로 잡고 싶나요?',
      en:'If not 10, what other target sum would you choose to group by? Why?',
      zh:'如果不是凑10，你想以哪个数为标准来分组？为什么？'
    },
    openHint:{
      ko:'예) 5를 기준으로! 5씩 뛰어 세는 건 쉬우니까. 하지만 5보다 큰 한 자리 수는 쪼개야 해요.',
      en:'e.g. Target 5 — easy to skip-count by 5, but numbers over 5 need splitting.',
      zh:'例）以5为标准！按5数很容易，但比5大的数需要拆分。'
    }
  },

  /* ── STEP4 매직랩: 대화형 (선택 모드 = 짝 골라 묶기) ── */
  lab:{
    generator:'pair10', level:'main',
    count:4,
    intro:{
      ko:'이제 진짜 마법! 여러 수 중에서 짝꿍이 되는 두 수를 골라 묶어볼까?',
      en:'Now the real magic — pick two numbers that make 10!',
      zh:'现在是真正的魔法——选出凑成10的两个数！'
    }
  },

  /* ── STEP5 아레나: 타임 배틀 (교재 p.12 TIME BATTLE 형식) ── */
  arena:{
    generator:'pair10', level:'main',
    count:10, timeLimit:300,       // 5분
    rule:{ ko:'5분 안에 풀어봅시다 · 풀이 과정을 생각하며!', en:'Solve within 5 minutes!', zh:'5分钟内完成！' }
  },

  /* ── STEP6 도장 ── */
  stamp:{
    label:{ ko:'10 묶기 마법사', en:'Ten-Maker', zh:'凑十魔法师' },
    coins:20
  },

  /* 다국어 격려/힌트 공통 대사 (누미) */
  voice:{
    correct:[
      { ko:'정답이야! ✨', en:'Correct!', zh:'答对了！' },
      { ko:'짝꿍 발견! 🎉', en:'You found it!', zh:'找到啦！' },
      { ko:'대단해! 🪄', en:'Amazing!', zh:'太棒了！' }
    ],
    wrong:[
      { ko:'음~ 다시 해볼까?', en:'Hmm, try again?', zh:'嗯，再试一次？' },
      { ko:'거의 다 왔어!', en:'Almost there!', zh:'就快了！' }
    ],
    finish:{ ko:'완벽해! 이제 넌 10 묶기 마법사야 🪄✨', en:"Perfect! You're a Ten-Maker now!", zh:'完美！你现在是凑十魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
