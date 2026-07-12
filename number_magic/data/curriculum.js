/* ============================================================
   Numbers of Magic — 커리큘럼 카탈로그
   등급: BASIC · PRIME · ADVANCE · CHALLENGE
   reading-world의 BOOK_CATALOG 패턴 미러링.
   유닛의 실제 데이터(generator·대사·개념)는 data/units/*.js 에.
   ============================================================ */
(function(){
'use strict';

// 등급(tier) → 단계(level) → 유닛(unit) 3계층.
// available:true 인 것만 지금 학습 가능. 나머지는 카드로 예고.
window.NM_CURRICULUM = {

  tiers:[
    /* ===== BASIC · 수의 나라 (G1 "9까지의 수") ===== */
    {
      id:'numberland', name:'BASIC', grade:'BASIC', order:0,
      title:'BASIC', subtitle:{ko:'수의 나라 · 9까지의 수',en:'Number Land · Numbers up to 9',zh:'数字王国 · 9以内的数'},
      ageFrom:5, ageLabel:'5~6세',
      color:'#7a8aa0', accent:'#EAC996',
      desc:{ko:'수를 알고, 세고, 나누고, 비교하고 — 수와 처음 친해지는 곳',
        en:'Know, count, share, and compare numbers — your first steps getting friendly with them',
        zh:'认识、数数、分配、比较——第一次和数字做朋友的地方'},
      levels:[
        { id:'NL-1', title:{ko:'수 세기와 개수',en:'Counting & Quantity',zh:'数数与数量'}, units:['NL-1-1'], available:false },
        { id:'NL-2', title:{ko:'순서와 뛰어세기',en:'Order & Skip-Counting',zh:'顺序与跳数'}, units:['NL-2-1'], available:false },
        { id:'NL-3', title:{ko:'순서수와 크기 비교',en:'Ordinals & Comparing Size',zh:'序数与大小比较'}, units:['NL-3-1'], available:false },
        { id:'NL-4', title:{ko:'짝수·홀수와 논리',en:'Odd, Even & Logic',zh:'奇偶数与逻辑'}, units:['NL-4-1'], available:false },
        { id:'NL-5', title:{ko:'양의 수·순서수 활용',en:'Using Cardinals & Ordinals',zh:'基数与序数的运用'}, units:['NL-5-1'], available:false }
      ]
    },

    /* ===== PRIME · 초급 (A~I) ===== */
    {
      id:'beginner', name:'PRIME', grade:'PRIME', order:1,
      title:'PRIME', subtitle:{ko:'초급 · A~I단계',en:'Beginner · Levels A–I',zh:'初级 · A~I阶段'},
      ageFrom:5, ageLabel:'만 5세+',
      color:'#16417C', accent:'#EAC996',
      desc:{ko:'수를 펼쳐 쉽게 만드는 첫 마법 — 더하기의 여러 전략',
        en:'The first magic of unfolding numbers to make them easy — many strategies for addition',
        zh:'把数字展开变简单的第一个魔法——加法的各种策略'},
      levels:[
        {
          id:'A', title:{ko:'A단계 · 덧셈의 전략',en:'Level A · Addition Strategies',zh:'A阶段 · 加法策略'}, available:true,
          units:['A-01','A-02','A-03','A-04','A-05','A-06','A-07','A-08','A-09'],
          gates:['A-review','A-sona','A-battle']   // 관문 — 유닛 미구현, screenTier()에서도 미사용(추후 작업)
        },
        { id:'B', title:{ko:'B단계',en:'Level B',zh:'B阶段'}, units:[], available:false },
        { id:'C', title:{ko:'C단계',en:'Level C',zh:'C阶段'}, units:[], available:false },
        { id:'D', title:{ko:'D단계',en:'Level D',zh:'D阶段'}, units:[], available:false },
        { id:'E', title:{ko:'E단계',en:'Level E',zh:'E阶段'}, units:[], available:false },
        { id:'F', title:{ko:'F단계',en:'Level F',zh:'F阶段'}, units:[], available:false },
        { id:'G', title:{ko:'G단계',en:'Level G',zh:'G阶段'}, units:[], available:false },
        { id:'H', title:{ko:'H단계',en:'Level H',zh:'H阶段'}, units:[], available:false },
        { id:'I', title:{ko:'I단계',en:'Level I',zh:'I阶段'}, units:[], available:false }
      ]
    },

    /* ===== ADVANCE · 중급 ===== */
    {
      id:'intermediate', name:'ADVANCE', grade:'ADVANCE', order:2,
      title:'ADVANCE', subtitle:{ko:'중급 · 분배법칙·곱셈',en:'Intermediate · Distributive Law & Multiplication',zh:'中级 · 分配律与乘法'},
      ageFrom:7, ageLabel:'7세+',
      color:'#5a4a8a', accent:'#EAC996',
      desc:{ko:'수를 나누어 곱하는 힘 — 분배법칙과 곱셈 공식으로',
        en:'The power of splitting numbers to multiply — through the distributive law and multiplication formulas',
        zh:'拆分数字来做乘法的力量——通过分配律与乘法公式'},
      levels:[{ id:'M-A', title:{ko:'준비 중',en:'Coming soon',zh:'即将推出'}, units:[], available:false }]
    },

    /* ===== CHALLENGE · 고급 ===== */
    {
      id:'advanced', name:'CHALLENGE', grade:'CHALLENGE', order:3,
      title:'CHALLENGE', subtitle:{ko:'고급 · 상관관계·경시',en:'Advanced · Relationships & Competition',zh:'高级 · 关联关系与竞赛'},
      ageFrom:8, ageLabel:'초1 말+ (영재)',
      color:'#C9A063', accent:'#16417C',
      desc:{ko:'수들의 관계로 푸는 마법 — 등차수열과 경시로 가는 길',
        en:'The magic of solving through relationships between numbers — the path to arithmetic sequences and competition math',
        zh:'通过数字间关系来解题的魔法——通向等差数列与竞赛之路'},
      levels:[{ id:'H-A', title:{ko:'준비 중',en:'Coming soon',zh:'即将推出'}, units:[], available:false }]
    }
  ],

  /* 유닛 = 하나의 학습 흐름.
     flow: 프랙티스 → 디스커버 → 핵심체크 → 매직랩 → 아레나 → 도장 */
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
      desc_ko:'타임 배틀 — 짝을 빠르게 찾아요' },
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
