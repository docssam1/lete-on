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
        { id:'NL-1', title:{ko:'수 세기와 개수',en:'Counting & Quantity',zh:'数数与数量'}, units:['N-01','N-06','N-07'], available:true },
        { id:'NL-2', title:{ko:'순서와 뛰어세기',en:'Order & Skip-Counting',zh:'顺序与跳数'}, units:['N-02','N-09'], available:true },
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

    /* ===== ADVANCE · 중급 (창의수연 A~F) ===== */
    {
      id:'intermediate', name:'ADVANCE', grade:'ADVANCE', order:2,
      title:'ADVANCE', subtitle:{ko:'중급 · 구구 기초 + 창의수연 A~F',en:'Intermediate · Times Tables + Creative Math A–F',zh:'中级 · 口诀基础 + 创意数学A~F'},
      ageFrom:7, ageLabel:'7세+',
      color:'#5a4a8a', accent:'#EAC996',
      desc:{ko:'곱셈의 기초 구구부터 창의 전략까지 — 분해·조합·패턴으로 수를 정복해요',
        en:'From times-table foundations to creative strategies — conquer numbers through decomposition, combination, and patterns',
        zh:'从口诀基础到创意策略——通过分解、组合和规律征服数字'},
      levels:[
        /* ── 구구 기초 (B-01~B-23) — 중급 진입 전 구구단 탄탄하게 ── */
        { id:'구구A', available:true,
          title:{ko:'구구 A · 배와 반',en:'Times A · Doubling & Halving',zh:'口诀A · 翻倍与减半'},
          units:['B-01','B-02','B-03'] },
        { id:'구구B', available:true,
          title:{ko:'구구 B · 2단·5단',en:'Times B · 2s & 5s',zh:'口诀B · 2和5的口诀'},
          units:['B-04','B-05','B-06'] },
        { id:'구구C', available:true,
          title:{ko:'구구 C · 3단·6단',en:'Times C · 3s & 6s',zh:'口诀C · 3和6的口诀'},
          units:['B-07','B-08','B-09'] },
        { id:'구구D', available:true,
          title:{ko:'구구 D · 4단·8단',en:'Times D · 4s & 8s',zh:'口诀D · 4和8的口诀'},
          units:['B-10','B-11','B-12'] },
        { id:'구구E', available:true,
          title:{ko:'구구 E · 7단·9단',en:'Times E · 7s & 9s',zh:'口诀E · 7和9的口诀'},
          units:['B-13','B-14','B-15'] },
        { id:'구구F', available:true,
          title:{ko:'구구 F · 구구 총정리',en:'Times F · Full Tables Review',zh:'口诀F · 口诀大总结'},
          units:['B-16','B-17'] },
        { id:'구구G', available:true,
          title:{ko:'구구 G · 몇십·몇백 곱',en:'Times G · Tens & Hundreds ×',zh:'口诀G · 整十整百乘法'},
          units:['B-18','B-19','B-20'] },
        { id:'구구H', available:true,
          title:{ko:'구구 H · 두 자리×한 자리',en:'Times H · 2-Digit × 1-Digit',zh:'口诀H · 两位乘一位'},
          units:['B-21','B-22','B-23'] },
        /* ── 창의수연 중급 A · 거듭제곱과 쌍 곱 ── */
        { id:'A', available:true,
          title:{ko:'A단계 · 거듭제곱과 쌍 곱',en:'Level A · Powers & Pair Products',zh:'A阶段 · 幂运算与对乘'},
          units:['C-01','C-02','C-03','C-04'] },
        /* ── 창의수연 중급 B · 가우스·×9·분배·올림빼기 ── */
        { id:'B', available:true,
          title:{ko:'B단계 · 가우스·×9·분배·올림빼기',en:'Level B · Gauss · ×9 · Distribute · Over-subtract',zh:'B阶段 · 高斯·×9·分配·过乘减'},
          units:['C-05','C-06','C-07','C-08'] },
        /* ── 창의수연 중급 C · 창의 곱셈법 6가지 ── */
        { id:'C', available:true,
          title:{ko:'C단계 · 창의 곱셈법 6가지',en:'Level C · 6 Creative Multiplication Methods',zh:'C阶段 · 六种创意乘法'},
          units:['C-09','C-10','C-11','C-12','C-13','C-14'] },
        /* ── 창의수연 중급 D · 자리이동·×5·×25 ── */
        { id:'D', available:true,
          title:{ko:'D단계 · 자리이동·×5·×25',en:'Level D · Place-Shift · ×5 · ×25',zh:'D阶段 · 位移·×5·×25'},
          units:['C-15','C-16','C-17'] },
        /* ── 창의수연 중급 E · 나눗셈 3법과 분수 덧뺄셈 ── */
        { id:'E', available:true,
          title:{ko:'E단계 · 나눗셈 3법·분수 덧뺄셈',en:'Level E · 3 Division Methods · Fraction ±',zh:'E阶段 · 三种除法·分数加减'},
          units:['C-18','C-19','C-20','C-21','C-22'] },
        /* ── 창의수연 중급 F · VEDA·차이곱·소수 ── */
        { id:'F', available:true,
          title:{ko:'F단계 · VEDA·차이곱·소수',en:'Level F · VEDA · Difference Products · Decimals',zh:'F阶段 · VEDA·差乘·小数'},
          units:['C-23','C-24','C-25'] }
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
