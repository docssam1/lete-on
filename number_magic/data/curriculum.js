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
        { id:'NL-2', title:{ko:'순서와 뛰어세기',en:'Order & Skip-Counting',zh:'顺序与跳数'}, units:['N-02','N-09','N-11'], available:true },
        { id:'NL-3', title:{ko:'순서수와 크기 비교',en:'Ordinals & Comparing Size',zh:'序数与大小比较'}, units:['N-03','N-05','N-12'], available:true },
        { id:'NL-4', title:{ko:'짝수·홀수와 논리',en:'Odd, Even & Logic',zh:'奇偶数与逻辑'}, units:['N-08','N-13','N-15'], available:true },
        { id:'NL-5', title:{ko:'양의 수·순서수 활용',en:'Using Cardinals & Ordinals',zh:'基数与序数的运用'}, units:['N-04','N-10','N-14'], available:true }
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

    /* ===== ADVANCE · 중급 (구구 기초 + 창의 전략 8단계) ===== */
    {
      id:'intermediate', name:'ADVANCE', grade:'ADVANCE', order:2,
      title:'ADVANCE', subtitle:{ko:'중급 · 구구 기초 + 창의 전략 8단계',en:'Intermediate · Times Tables + Creative Math A–F',zh:'中级 · 口诀基础 + 创意数学A~F'},
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
        /* ── 창의 전략 8단계 (난이도순 재설계 · 2026-08-23) ── */
        { id:'1', available:true,
          title:{ko:'1단계 · 곱셈의 문',en:'Stage 1 · Gateway to Multiplication',zh:'第1阶 · 乘法之门'},
          units:['C-01','C-26','C-09'] },
        { id:'2', available:true,
          title:{ko:'2단계 · 쪼개기',en:'Stage 2 · Splitting',zh:'第2阶 · 拆分'},
          units:['C-07','C-08','C-06','C-27'] },
        { id:'3', available:true,
          title:{ko:'3단계 · 짝 만들기',en:'Stage 3 · Making Pairs',zh:'第3阶 · 配对'},
          units:['C-02','C-04','C-03','C-34'] },
        { id:'4', available:true,
          title:{ko:'4단계 · 반과 배',en:'Stage 4 · Halves and Doubles',zh:'第4阶 · 折半与翻倍'},
          units:['C-16','C-17','C-28','C-29'] },
        { id:'5', available:true,
          title:{ko:'5단계 · 나눗셈 세 가지 길',en:'Stage 5 · Three Roads of Division',zh:'第5阶 · 除法三法'},
          units:['C-18','C-19','C-20'] },
        { id:'6', available:true,
          title:{ko:'6단계 · 곱셈 알고리즘 여행',en:'Stage 6 · A Tour of Multiplication',zh:'第6阶 · 乘法算法之旅'},
          units:['C-15','C-13','C-10','C-11','C-14','C-30'] },
        { id:'7', available:true,
          title:{ko:'7단계 · 수의 관계',en:'Stage 7 · Relationships Between Numbers',zh:'第7阶 · 数的关系'},
          units:['C-23','C-24','C-12','C-05'] },
        { id:'8', available:true,
          title:{ko:'8단계 · 분수와 소수',en:'Stage 8 · Fractions and Decimals',zh:'第8阶 · 分数与小数'},
          units:['C-21','C-22','C-31','C-32','C-25','C-33','C-35'] },
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
      /* 경시의 탑(과정-로드맵.md §3 CHALLENGE, 2026-08-25) — 고급-목차.md 신규 13종.
         26~28은 그 과정의 4단원 구성 그대로, 'boost'는 몰아주기/어림하기/큰 수 정복처럼
         Level 3(과정 19·24)의 드릴 보강으로도 쓰이는 3종을 모아 둔 것(고급-목차.md §2①). */
      levels:[
        { id:'26', available:true,
          title:{ko:'26 곱셈의 정점',en:'26 · Peak of Multiplication',zh:'26·乘法之巅'},
          units:['H-01','H-02'] },
        { id:'27', available:true,
          title:{ko:'27 수의 비밀',en:'27 · Secrets of Numbers',zh:'27·数的秘密'},
          units:['H-03','H-04','H-05','H-06'] },
        { id:'28', available:true,
          title:{ko:'28 제곱의 산',en:'28 · Mountain of Squares',zh:'28·平方之山'},
          units:['H-07','H-08','H-09','H-10'] },
        { id:'boost', available:true,
          title:{ko:'초·중급 보강 · 몰아주기·어림하기·큰 수',en:'Booster · Anchoring, Estimating & Big Numbers',zh:'补强·集中相乘·估算·大数'},
          units:['H-11','H-12','H-13'] }
      ]
    },

    /* ===== MIDDLE1 · 음수의 동굴 (중1 정수와 유리수, W8) =====
       근거: MASTER-ROADMAP.md §5(중1 W8) + 중등연산-목차.md(G03~G25 실측).
       이 교재는 정수·유리수 사칙연산과 거듭제곱만 다룬다 — 문자와 식·
       일차방정식·정비례반비례는 목차에 없어 다음 배치로 미룬다. */
    {
      id:'middle1', name:'MIDDLE1', grade:'중1', order:4,
      title:'MIDDLE1', subtitle:{ko:'음수의 동굴 · 정수와 유리수',en:'The Cave of Negatives · Integers & Rationals',zh:'负数洞窟·整数与有理数'},
      ageFrom:12, ageLabel:'중1',
      color:'#16417C', accent:'#C9A063',
      desc:{ko:'해발과 해저, 득점과 실점 — 0을 기준으로 반대 방향에 이름을 붙이는 것부터 시작해요',
        en:'Above and below sea level, points scored and lost — it all starts with naming the two directions from 0',
        zh:'海拔与海拔以下，得分与失分——从给0两侧的方向命名开始'},
      levels:[
        { id:'29', available:true,
          title:{ko:'29 정수의 세계',en:'29 · World of Integers',zh:'29·整数的世界'},
          units:['M-01','M-02','M-03'] },
        { id:'30', available:true,
          title:{ko:'30 부호의 규칙',en:'30 · Rules of Sign',zh:'30·符号的规则'},
          units:['M-04','M-05','M-06'] },
        { id:'31', available:true,
          title:{ko:'31 유리수 정복',en:'31 · Conquering Rationals',zh:'31·征服有理数'},
          units:['M-07','M-08','M-09'] }
      ]
    },

    /* ===== MIDDLE2 · 식의 탑 (중2 식의 계산, W9) =====
       근거: MASTER-ROADMAP.md §5(중2 W9) — 지수법칙·단항식·다항식·
       등식 변형까지, 2022 개정 교육과정 '식의 계산' 범위의 표준 유형. */
    {
      id:'middle2', name:'MIDDLE2', grade:'중2', order:5,
      title:'MIDDLE2', subtitle:{ko:'식의 탑 · 식의 계산',en:'Tower of Expressions · Expression Calculus',zh:'式之塔·式的运算'},
      ageFrom:13, ageLabel:'중2',
      color:'#5a4a8a', accent:'#C9A063',
      desc:{ko:'큰 수를 짧게 쓰려는 게으름이 만든 지수법칙부터, 문자로 이루어진 식을 다루는 법까지',
        en:'From the exponent laws born of wanting to write big numbers short, to handling expressions made of letters',
        zh:'从懒得写长数字而诞生的指数法则，到处理由字母组成的式子'},
      levels:[
        { id:'32', available:true,
          title:{ko:'32 지수와 단항식',en:'32 · Exponents & Monomials',zh:'32·指数与单项式'},
          units:['M-10','M-11','M-12'] },
        { id:'33', available:true,
          title:{ko:'33 다항식과 등식',en:'33 · Polynomials & Equations',zh:'33·多项式与等式'},
          units:['M-13','M-14'] }
      ]
    },

    /* ===== MIDDLE3 · 근호의 산맥 (중3 제곱근·실수, 다항식의 곱셈과 인수분해, W10) =====
       근거: MASTER-ROADMAP.md §5(중3 W10). */
    {
      id:'middle3', name:'MIDDLE3', grade:'중3', order:6,
      title:'MIDDLE3', subtitle:{ko:'근호의 산맥 · 제곱근과 다항식',en:'Radical Mountains · Roots & Polynomials',zh:'根号山脉·平方根与多项式'},
      ageFrom:14, ageLabel:'중3',
      color:'#16417C', accent:'#7c3aed',
      desc:{ko:'다 쓸 수 없어서 "무리수" — 제곱근을 다루는 법부터, 곱셈공식으로 완성되는 무지개 덧셈법의 마지막 걸음까지',
        en:'Numbers you can never finish writing — "irrational." From handling square roots to the final step of the rainbow-addition lineage, completed by the multiplication formulas',
        zh:'写不完的数——"无理数"。从处理平方根，到由乘法公式完成的彩虹加法法家族的最后一步'},
      levels:[
        { id:'34', available:true,
          title:{ko:'34 제곱근의 세계',en:'34 · World of Square Roots',zh:'34·平方根的世界'},
          units:['M-15','M-16','M-17'] },
        { id:'35', available:true,
          title:{ko:'35 곱셈공식과 인수분해',en:'35 · Formulas & Factoring',zh:'35·乘法公式与因式分解'},
          units:['M-18','M-19','M-20'] }
      ]
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
