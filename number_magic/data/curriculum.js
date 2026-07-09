/* ============================================================
   Numbers of Magic — 커리큘럼 카탈로그
   3층 구조: 0급 수의 나라 · 1급 초급 A~I · 2급 중급 · 3급 고급
   reading-world의 BOOK_CATALOG 패턴 미러링.
   유닛의 실제 데이터(generator·대사·개념)는 data/units/*.js 에.
   ============================================================ */
(function(){
'use strict';

// 급(tier) → 단계(level) → 유닛(unit) 3계층.
// available:true 인 것만 지금 학습 가능. 나머지는 카드로 예고.
window.NM_CURRICULUM = {

  tiers:[
    /* ===== 0급 · 수의 나라 (G1 "9까지의 수") ===== */
    {
      id:'numberland', grade:'0급', order:0,
      title:'수의 나라', subtitle:'9까지의 수',
      ageFrom:5, ageLabel:'5~6세',
      color:'#7a8aa0', accent:'#EAC996',
      desc:'수를 알고, 세고, 나누고, 비교하고 — 수와 처음 친해지는 곳',
      levels:[
        { id:'NL-1', title:'수 세기와 개수', units:['NL-1-1'], available:false },
        { id:'NL-2', title:'순서와 뛰어세기', units:['NL-2-1'], available:false },
        { id:'NL-3', title:'순서수와 크기 비교', units:['NL-3-1'], available:false },
        { id:'NL-4', title:'짝수·홀수와 논리', units:['NL-4-1'], available:false },
        { id:'NL-5', title:'양의 수·순서수 활용', units:['NL-5-1'], available:false }
      ]
    },

    /* ===== 1급 · 초급 (창의수연 A~I) ===== */
    {
      id:'beginner', grade:'1급', order:1,
      title:'초급 수연', subtitle:'창의수연 A~I',
      ageFrom:5, ageLabel:'만 5세+',
      color:'#16417C', accent:'#EAC996',
      desc:'수를 펼쳐 쉽게 만드는 첫 마법 — 더하기의 여러 전략',
      levels:[
        {
          id:'A', title:'A단계 · 덧셈의 전략', available:true,
          units:['A-01','A-02','A-03','A-04'],
          gates:['A-review','A-sona','A-battle']   // 관문
        },
        { id:'B', title:'B단계', units:[], available:false },
        { id:'C', title:'C단계', units:[], available:false },
        { id:'D', title:'D단계', units:[], available:false },
        { id:'E', title:'E단계', units:[], available:false },
        { id:'F', title:'F단계', units:[], available:false },
        { id:'G', title:'G단계', units:[], available:false },
        { id:'H', title:'H단계', units:[], available:false },
        { id:'I', title:'I단계', units:[], available:false }
      ]
    },

    /* ===== 2급 · 중급 ===== */
    {
      id:'intermediate', grade:'2급', order:2,
      title:'중급 수연', subtitle:'분배법칙·곱셈',
      ageFrom:7, ageLabel:'7세+',
      color:'#5a4a8a', accent:'#EAC996',
      desc:'수를 나누어 곱하는 힘 — 분배법칙과 곱셈 공식으로',
      levels:[{ id:'M-A', title:'준비 중', units:[], available:false }]
    },

    /* ===== 3급 · 고급 ===== */
    {
      id:'advanced', grade:'3급', order:3,
      title:'고급 수연', subtitle:'상관관계·경시',
      ageFrom:8, ageLabel:'초1 말+ (영재)',
      color:'#C9A063', accent:'#16417C',
      desc:'수들의 관계로 푸는 마법 — 등차수열과 경시로 가는 길',
      levels:[{ id:'H-A', title:'준비 중', units:[], available:false }]
    }
  ],

  /* 유닛 = 하나의 학습 흐름.
     flow: 프랙티스 → 디스커버 → 핵심체크 → 매직랩 → 아레나 → 도장
     (reading-world의 STEP flow 미러링, 연산용) */
  unitFlow:[
    { key:'practice', step:1, ko:'기본 연산', en:'Warm-up',   zh:'基础运算', icon:'🔢',
      desc_ko:'개념 연산을 작은 수로 미리 연습' },
    { key:'discover', step:2, ko:'마법 노트', en:'Discover',  zh:'魔法笔记', icon:'📓',
      desc_ko:'누미의 메모장에서 새 전략을 배워요' },
    { key:'check',    step:3, ko:'핵심 체크', en:'Key Check', zh:'核心检查', icon:'✅',
      desc_ko:'빈칸과 열린 질문으로 확인' },
    { key:'lab',      step:4, ko:'매직 랩',   en:'Magic Lab', zh:'魔法实验', icon:'🧪',
      desc_ko:'대화형 문제로 재미있게 연습' },
    { key:'arena',    step:5, ko:'아레나',    en:'Arena',     zh:'竞技场',   icon:'⚔️',
      desc_ko:'타임 배틀 — 5분 안에 풀어봐요' },
    { key:'stamp',    step:6, ko:'도장 쾅!',  en:'Stamp',     zh:'盖章',     icon:'🏅',
      desc_ko:'통과하면 마법 도장을 받아요' }
  ],

  /* 관문 유형 (A권 마무리 3종, 교재 기준) */
  gateTypes:{
    review:{ ko:'복습', en:'Review',  desc_ko:'배운 전략을 모두 복습' },
    sona:{   ko:'SONA', en:'SONA',    desc_ko:'한 문제를 여러 전략으로 + 나만의 풀이 (사고력 정점)' },
    battle:{ ko:'수연 배틀', en:'Battle', desc_ko:'지정된 전략으로 풀어내기' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_CURRICULUM;
})();
