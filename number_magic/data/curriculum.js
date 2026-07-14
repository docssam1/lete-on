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
          id:'A', available:true,
          title:{ko:'A단계 · 덧셈 기초 전략',en:'Level A · Basic Addition Strategies',zh:'A阶段 · 加法基础策略'},
          units:['A-01','A-02','A-03','A-04']
        },
        {
          id:'B', available:true,
          title:{ko:'B단계 · 덧셈 심화 전략',en:'Level B · Advanced Addition Strategies',zh:'B阶段 · 加法进阶策略'},
          units:['A-05','A-06','A-07','A-08','A-09']
        },
        {
          id:'C', available:true,
          title:{ko:'C단계 · 뺄셈 기초 전략',en:'Level C · Basic Subtraction Strategies',zh:'C阶段 · 减法基础策略'},
          units:['A-10','A-11','A-12']
        },
        {
          id:'D', available:true,
          title:{ko:'D단계 · 뺄셈 심화 전략',en:'Level D · Advanced Subtraction Strategies',zh:'D阶段 · 减法进阶策略'},
          units:['A-13','A-14','A-15','A-16']
        },
        {
          id:'E', available:true,
          title:{ko:'E단계 · 뺄셈 기초 전략',en:'Level E · Basic Subtraction Strategies',zh:'E阶段 · 减法基础策略'},
          units:['A-17','A-18','A-19','A-20','A-21']
        },
        {
          id:'F', available:true,
          title:{ko:'F단계 · 뺄셈 심화 전략',en:'Level F · Advanced Subtraction Strategies',zh:'F阶段 · 减法进阶策略'},
          units:['A-22','A-23','A-24','A-25']
        },
        {
          id:'G', available:true,
          title:{ko:'G단계 · 수열과 수 세기',en:'Level G · Sequences & Counting',zh:'G阶段 · 数列与计数'},
          units:['A-26','A-27','A-28','A-29']
        },
        {
          id:'H', available:true,
          title:{ko:'H단계 · 자릿값 계산 전략',en:'Level H · Place-Value Calculation Strategies',zh:'H阶段 · 数位计算策略'},
          units:['A-30','A-31','A-32','A-33','A-34']
        },
        {
          id:'I', available:true,
          title:{ko:'I단계 · 고대 수와 소수',en:'Level I · Ancient Numbers & Decimals',zh:'I阶段 · 古代数字与小数'},
          units:['A-35','A-36','A-37','A-38']
        }
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
      levels:[
        {
          id:'A', available:true,
          title:{ko:'A단계 · 배와 반',en:'Level A · Doubling & Halving',zh:'A阶段 · 翻倍与减半'},
          units:['B-01','B-02','B-03']
        },
        {
          id:'B', available:true,
          title:{ko:'B단계 · 2단·5단',en:'Level B · 2s & 5s Times Tables',zh:'B阶段 · 2和5的口诀'},
          units:['B-04','B-05','B-06']
        },
        {
          id:'C', available:true,
          title:{ko:'C단계 · 3단·6단',en:'Level C · 3s & 6s Times Tables',zh:'C阶段 · 3和6的口诀'},
          units:['B-07','B-08','B-09']
        },
        {
          id:'D', available:true,
          title:{ko:'D단계 · 4단·8단',en:'Level D · 4s & 8s Times Tables',zh:'D阶段 · 4和8的口诀'},
          units:['B-10','B-11','B-12']
        },
        {
          id:'E', available:true,
          title:{ko:'E단계 · 7단·9단',en:'Level E · 7s & 9s Times Tables',zh:'E阶段 · 7和9的口诀'},
          units:['B-13','B-14','B-15']
        },
        {
          id:'F', available:true,
          title:{ko:'F단계 · 구구 총정리',en:'Level F · Full Tables Review',zh:'F阶段 · 口诀大总结'},
          units:['B-16','B-17']
        },
        {
          id:'G', available:true,
          title:{ko:'G단계 · 몇십·몇백 곱',en:'Level G · Tens & Hundreds ×',zh:'G阶段 · 整十整百乘法'},
          units:['B-18','B-19','B-20']
        },
        {
          id:'H', available:true,
          title:{ko:'H단계 · 두 자리×한 자리',en:'Level H · 2-Digit × 1-Digit',zh:'H阶段 · 两位乘一位'},
          units:['B-21','B-22','B-23']
        }
      ]
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
