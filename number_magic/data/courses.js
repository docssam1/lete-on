/* ============================================================
   Numbers of Magic — 과정(Course) 편성 데이터 (Phase 2 재편, 2026-08-25)
   과정-로드맵.md §3 "새 과정표 — Level 1~3, 과정 1~25" + "CHALLENGE · 경시의 탑
   26~28"이 명세다. 옛 과정(BASIC B1~5·PRIME P1~10·ADVANCE M1~6·CHALLENGE
   H1~9·창의 8단계 A1~8)은 전면 폐기·재편 — grep 확인 결과 NM_COURSES를
   읽는 코드가 앱 어디에도 없어(스토리모드는 data/roadmap.js의 NM_ROADMAP을
   따로 씀) 안전하게 교체할 수 있었다.

   구조: tier → course(C1~C28) → session.
   세션 = { magic:[유닛/스레드id...]|null, drills:[{t,lv,n}...] } 또는
         { test:true, pool:[{t,lv,n}...], passRate }.

   이 파일은 표를 그대로 박아넣지 않고 **COURSE_SPEC(표 원문의 ID만 그대로 옮긴
   것) + buildCourses()(세션 편성 규칙)**로 나눴다 — 표가 바뀌면 SPEC만 고치면
   되고, 편성 규칙(레벨 배정·드릴 순환·세션 수)은 한 곳에서만 관리된다.

   ── COURSE_SPEC 파싱 규칙 (§3 표 원문 그대로) ──
   - drills: 그 과정의 "드릴 재료" 열에 적힌 스레드 id 그대로(★역연산=EL1,
     ★검산=EL2, ★평균=EL4 — 과정-로드맵.md §3 각주 그대로).
   - magic: 그 과정의 "마법 슬롯" 열에서 뽑은 유닛/스레드 id. "·"로 붙어
     있는 id(공백 없음, 예 A-20·21, N-06·N-07)는 **한 세션에 같이 들어가는
     묶음**, " · "로 띄어 붙은 항목은 **서로 다른 세션**. 과정 2~10(PRIME
     재배치 38유닛)은 §3의 "초급(PRIME) 38유닛 재배치" 표를 썼다 — 메인
     표의 축약 표기(예: 과정4 "A-05~07")보다 그 표가 전량(폐기 0개)을
     명시한 1차 자료이기 때문. ML10처럼 유닛이 아니라 스레드 자체가 마법인
     경우도 있다(threads.js에 있으면 그대로 인정).
   - 과정 25(레벨 보스)·26~28(경시의 탑)은 표에 마법 슬롯 id가 없다(25=
     "총정리", 26~28=고급 유닛 미제작). **새 id를 지어내지 않고** magic:[]로
     비워 buildCourses()가 magic:null 세션만 만들게 하고, comingSoon(26~28)·
     boss(25) 플래그로 표시한다. 26~28의 드릴 재료도 표에 없으므로 지어내는
     대신 그 경시 주제와 맞닿은, 이미 threads.js에 존재하는 스레드를 재사용
     했다(새 id 없음 — 곱셈의 정점→ML19/20/23, 수의 비밀→DV7/8·MX2,
     제곱의 산→ML11/20·MX4).

   ── 구구 B-01~B-23 (2026-09-03, 원장 "교과와 창의 연산이 자연스럽게 연결되도록") ──
   ADVANCE 건물의 구구 A~H 묶음을 그대로 연산 로드맵 과정 5~9에 얹었다. 같은 구구단
   드릴(ML1·ML2·ML3·ML4·ML5·ML6)이 있는 과정에 그 단의 마법 묶음을 세션 하나로 넣는다:
   과정5 배와반·2/5단 · 과정6 3/6단·4/8단 · 과정7 7/9단 · 과정8 총정리·몇십몇백 ·
   과정9 두자리×한자리. 세션 수가 5를 넘는 6·7은 maxSessions:6.

   ── buildCourses() 편성 규칙 ──
   1. **레벨**: 과정의 드릴 재료가 그 과정에서 처음 등장하면 레벨1. 같은
      스레드가 나중 과정에서 다시 "드릴 재료"(자기 과정 것)로 나오면
      레벨을 1단 올린다(threads.js 최대 레벨에서 캡) — 예: DV3는 과정9
      레벨1, 과정12에서 다시 나오지만 DV3는 레벨이 1개뿐이라 그대로 캡.
      모든 레벨은 threads.js에 실존하는 id만 배정되므로(캡 로직) 무효
      레벨이 나올 수 없다.
   2. **세션 수**: 마법 세그먼트 수를 3~5개로 clamp(레벨보스·경시의 탑은
      고정 3) — 세그먼트가 모자라면 magic:null 드릴 세션으로 채우고,
      넘치면 뒤에서부터 합쳐 5개로 줄인다.
   3. **세션별 드릴**: 그 과정 자기 재료에서 2종을 세션 index 기반으로
      결정적으로 순환 선택(Math.random 없음 — `drills[(i*2)%len]` 식이라
      같은 입력엔 항상 같은 출력) + **과정 1을 제외하고** 이전 모든 과정이
      자기 재료로 등록했던 스레드 풀(priorPool)에서 전역 세션 카운터
      기반으로 1종을 순환 추가(§2 "과정 번호가 클수록 이전 풀에서 순환
      샘플"). 두 원칙 다 시드가 아니라 인덱스 기반이라 같은 스펙에서
      항상 같은 결과가 나온다(harness가 2회 빌드 동일성으로 검증).
   4. **Test pool**: 그 과정 자기 드릴 재료 전체(레벨보스는 레벨3 과정
      17~24가 등록한 전 스레드 + 자기 재료 = "전 유형 풀").
   ============================================================ */
(function(){
'use strict';

const COURSE_SPEC = [
 {id:1, tier:'level1', title:{ko:'자릿값과 첫 덧셈',en:'Place Value & First Addition',zh:'位值与加法入门'},
   drills:['NS1','NS2','NS3','AD1'], magic:[['N-06','N-07']]},
 {id:2, tier:'level1', title:{ko:'받아올림과 두 배 수',en:'Carrying & Doubles',zh:'进位与翻倍数'},
   drills:['AD2','NS5','NS4'], magic:[['A-01'],['A-02']]},
 {id:3, tier:'level1', title:{ko:'두 자리 덧뺄셈 시작',en:'Two-digit ± Begins',zh:'两位数加减开始'},
   drills:['AD3','SB3'], magic:[['A-03'],['A-04']]},
 {id:4, tier:'level1', title:{ko:'두 자리 올림 덧뺄셈',en:'Two-digit ± with Carrying',zh:'两位数进位加减'},
   drills:['AD5','SB4','AD6'], magic:[['A-05'],['A-06'],['A-07'],['A-08'],['A-09']]},
 {id:5, tier:'level1', title:{ko:'뺄셈 마법과 구구단 첫걸음',en:'Subtraction Magic & Times Tables Begin',zh:'减法魔法与乘法口诀入门'},
   drills:['SB5','ML1','ML2'], magic:[['A-10'],['A-11'],['A-12'],['B-01','B-02','B-03'],['B-04','B-05','B-06']]},
 {id:6, tier:'level1', title:{ko:'세 자리 뺄셈과 구구단 완성',en:'3-digit Subtraction & Full Times Tables',zh:'三位数减法与完整口诀'},
   drills:['SB6','SB7','ML3'], magic:[['A-13'],['A-14'],['A-15'],['A-16','A-17'],['B-07','B-08','B-09'],['B-10','B-11','B-12']], maxSessions:6},
 {id:7, tier:'level1', title:{ko:'구구단 종합과 네 자리 연산',en:'Times Tables Mix & 4-digit ±',zh:'乘法口诀综合与四位数运算'},
   drills:['ML4','AD7'], magic:[['B-13','B-14','B-15'],['A-18','A-19'],['A-20','A-21'],['A-22','A-23'],['A-24','A-25'],['C-01']], maxSessions:6},
 {id:8, tier:'level1', title:{ko:'몇십 곱과 나눗셈의 시작',en:'Multiplying Tens & Division Begins',zh:'整十乘法与除法开始'},
   drills:['ML5','DV1','DV2'], magic:[['B-16','B-17'],['B-18','B-19','B-20'],['A-30','A-31','A-32'],['A-33','A-34'],['C-02']]},
 {id:9, tier:'level1', title:{ko:'두 자리 곱셈 암산과 나머지',en:'2-digit Mental Multiplication & Remainders',zh:'两位数心算乘法与余数'},
   drills:['ML6','ML22','DV3'], magic:[['B-21','B-22','B-23'],['A-26'],['A-27'],['A-29'],['C-07','C-08']]},
 {id:10, tier:'level1', title:{ko:'세 자리 곱셈과 검산',en:'3-digit Multiplication & Checking',zh:'三位数乘法与验算'},
   drills:['ML7','EL2'], magic:[['A-28'],['A-35'],['C-06'],['C-09']]},

 {id:11, tier:'level2', title:{ko:'두 자리×두 자리 곱셈',en:'2-digit × 2-digit Multiplication',zh:'两位数乘两位数'},
   drills:['ML8'], magic:[['C-26'],['C-15'],['C-10'],['C-11']]},
 {id:12, tier:'level2', title:{ko:'나눗셈과 역연산',en:'Division & Inverse Operations',zh:'除法与逆运算'},
   drills:['DV3','DV4','EL1'], magic:[['C-18']]},
 {id:13, tier:'level2', title:{ko:'분수의 첫걸음',en:'Fractions Begin',zh:'分数入门'},
   drills:['FR1','FR2'], magic:[['C-16']]},
 {id:14, tier:'level2', title:{ko:'대분수와 세 자리×두 자리',en:'Mixed Numbers & 3d×2d',zh:'带分数与三位乘两位'},
   drills:['FR3','ML9'], magic:[['C-17'],['C-28'],['C-29'],['C-14']]},
 {id:15, tier:'level2', title:{ko:'두 자리로 나누기와 분수',en:'Dividing by 2 Digits & Fractions',zh:'除以两位数与分数'},
   drills:['DV5'], magic:[['C-19'],['C-20']]},
 {id:16, tier:'level2', title:{ko:'배수 판별과 혼합계산',en:'Divisibility & Mixed Operations',zh:'整除判别与混合运算'},
   drills:['DV6','MX1'], magic:[['C-30']]},

 {id:17, tier:'level3', title:{ko:'소수의 시작',en:'Decimals Begin',zh:'小数入门'},
   drills:['DC1'], magic:[['C-13'],['A-36'],['A-37'],['A-38']]},
 {id:18, tier:'level3', title:{ko:'소수 곱셈과 제곱수',en:'Decimal Multiplication & Squares',zh:'小数乘法与平方数'},
   drills:['DC2','DC4','ML11'], magic:[['C-24'],['ML10'],['C-27']]},
 {id:19, tier:'level3', title:{ko:'약수와 배수',en:'Factors & Multiples',zh:'因数与倍数'},
   drills:['DV7'], magic:[['C-04'],['H-11'],['C-34']]},
 {id:20, tier:'level3', title:{ko:'이분모 분수와 제곱근',en:'Unlike Denominators & Square Roots',zh:'异分母分数与平方根'},
   drills:['FR4','FR10','MX4'], magic:[['C-21'],['C-22']]},
 {id:21, tier:'level3', title:{ko:'분수 곱셈과 거듭제곱',en:'Fraction Multiplication & Powers',zh:'分数乘法与乘方'},
   drills:['FR6','FR11'], magic:[['C-23']]},
 {id:22, tier:'level3', title:{ko:'분수 나눗셈',en:'Fraction Division',zh:'分数除法'},
   drills:['FR7'], magic:[['C-03'],['C-31']]},
 {id:23, tier:'level3', title:{ko:'수열과 분수·소수 변환',en:'Sequences & Fraction↔Decimal',zh:'数列与分数小数互换'},
   drills:['MX2','FR8'], magic:[['C-05'],['C-32'],['C-35']]},
 {id:24, tier:'level3', title:{ko:'백분율과 비와 비율',en:'Percent, Ratio & Proportion',zh:'百分率与比例'},
   drills:['MX3','DV8','EL4'], magic:[['C-25'],['C-33'],['H-12'],['H-13']]},
 {id:25, tier:'level3', title:{ko:'레벨 3 총정리',en:'Level 3 Final Review',zh:'第三级总复习'},
   drills:['MX5'], magic:[], boss:true},

 /* 26~28 실배치(2026-08-25 Phase 2, 고급-목차.md §2②): 로드맵 §3의 4단원 구성 그대로.
    각 과정 4단원 중 신규 유닛(H-01·02, H-03~06, H-07~10)이 magic, 1단계에서 이미
    확장해 둔 기존 유닛(C-12 엑스맨 세 자리, C-15 피라미드 곱셈, C-01 제곱수 점화식)은
    "1단계 확장 레벨들도 드릴 재료로"(작업지시)에 따라 drills로 재사용한다 — 새 id를
    지어내지 않고 threads.js에 이미 있는 스레드만 쓴다는 기존 규칙을 그대로 지켰다. */
 {id:26, tier:'challenge', title:{ko:'곱셈의 정점',en:'Peak of Multiplication',zh:'乘法之巅'},
   drills:['ML8','ML18'], magic:[['H-01'],['H-02'],['C-12'],['C-15']]},
 {id:27, tier:'challenge', title:{ko:'수의 비밀',en:'Secrets of Numbers',zh:'数的秘密'},
   drills:['DV7','DV8','MX2'], magic:[['H-03'],['H-04'],['H-05'],['H-06']]},
 {id:28, tier:'challenge', title:{ko:'제곱의 산',en:'Mountain of Squares',zh:'平方之山'},
   drills:['ML11','ML20','MX4'], magic:[['H-07'],['H-08'],['H-09'],['H-10']]},

 /* 29~31 실배치(2026-08-25, 중등 W8 · 중1 정수와 유리수): MASTER-ROADMAP.md
    §8 Phase 3. drills는 그 과정에서 처음 등장하는 MD 스레드 + 경시의 탑
    (CH-시리즈) 재료 일부(작업 지시 "이전 과정 복습 풀에는 경시의 탑 재료
    일부 포함") — CH5(순환소수 나눗셈)는 course29의 자기 재료로 등록해
    이후 과정(30·31)의 priorPool 복습 순환에도 자동으로 실린다. */
 /* 29~31 보강(2026-08-27, 심화 유형 2차 작업지시 "중1 문자식은 과정
    29~31 구간 보강") — 중1 문자와 식(MD47~51)을 새 과정을 만들지
    않고 기존 세 과정에 나눠 얹는다. 세션 수는 클램프(3~5) 안에
    그대로 들어가(3+2=5, 3+2=5, 3+1=4) 자동 병합 없이 깔끔하게
    늘어난다. */
 {id:29, tier:'middle1', title:{ko:'정수의 세계',en:'World of Integers',zh:'整数的世界'},
   drills:['MD1','MD2','MD3','CH5','MD47','MD48'], magic:[['M-01'],['M-02'],['M-03'],['M-47'],['M-48']]},
 {id:30, tier:'middle1', title:{ko:'부호의 규칙',en:'Rules of Sign',zh:'符号的规则'},
   drills:['MD4','MD5','MD6','MD49','MD50'], magic:[['M-04'],['M-05'],['M-06'],['M-49'],['M-50']]},
 {id:31, tier:'middle1', title:{ko:'유리수 정복',en:'Conquering Rationals',zh:'征服有理数'},
   drills:['MD7','MD8','MD9','MD51'], magic:[['M-07'],['M-08'],['M-09'],['M-51']]},

 /* 32~35 실배치(2026-08-25, 중등 W9·W10): MASTER-ROADMAP.md §8 Phase 4.
    drills는 그 과정의 자기 재료 + "누적 혼합에 W8 재료 포함"(작업 지시)
    — course32는 W8 마지막 재료 MD9를, course34(중3 진입부)는 중2 재료
    MD14를 복습 풀에 얹는다(다른 과정들처럼 spec.drills에 얹으면 자기
    재료로도 잡히고 이후 과정의 priorPool 순환에도 자동으로 실린다). */
 {id:32, tier:'middle2', title:{ko:'지수와 단항식',en:'Exponents & Monomials',zh:'指数与单项式'},
   drills:['MD10','MD11','MD12','MD9'], magic:[['M-10'],['M-11'],['M-12']]},
 {id:33, tier:'middle2', title:{ko:'다항식과 등식',en:'Polynomials & Equations',zh:'多项式与等式'},
   drills:['MD13','MD14'], magic:[['M-13'],['M-14']]},
 {id:34, tier:'middle3', title:{ko:'제곱근의 세계',en:'World of Square Roots',zh:'平方根的世界'},
   drills:['MD15','MD16','MD17','MD14'], magic:[['M-15'],['M-16'],['M-17']]},
 {id:35, tier:'middle3', title:{ko:'곱셈공식과 인수분해',en:'Formulas & Factoring',zh:'乘法公式与因式分解'},
   drills:['MD18','MD19','MD20'], magic:[['M-18'],['M-19'],['M-20']]},

 /* 36~39 실배치(2026-08-25, 고등 W11·W12): MASTER-ROADMAP.md §6.
    course36은 W10 마지막 재료 MD20을, course38(공통수학2 진입부)은
    W11 마지막 재료 MD30을 복습 풀에 얹는다(32~35와 같은 관례 —
    spec.drills에 얹으면 자기 재료로도 잡히고 이후 과정의 priorPool
    순환에도 자동으로 실린다). 2022 개정 과목명 준수 — "고1" 표기
    없음(전부 "공통수학1"·"공통수학2"). */
 {id:36, tier:'highmath1', title:{ko:'다항식과 나머지정리',en:'Polynomials & the Remainder Theorem',zh:'多项式与余数定理'},
   drills:['MD21','MD22','MD23','MD24','MD25','MD20'], magic:[['M-21'],['M-22'],['M-23'],['M-24'],['M-25']]},
 {id:37, tier:'highmath1', title:{ko:'이차방정식과 행렬',en:'Quadratics & Matrices',zh:'二次方程与矩阵'},
   drills:['MD26','MD27','MD28','MD29','MD30'], magic:[['M-26'],['M-27'],['M-28'],['M-29'],['M-30']]},
 {id:38, tier:'highmath2', title:{ko:'점과 직선',en:'Points & Lines',zh:'点与直线'},
   drills:['MD31','MD32','MD33','MD30'], magic:[['M-31'],['M-32'],['M-33']]},
 {id:39, tier:'highmath2', title:{ko:'직선의 관계와 원',en:'Relations Between Lines & Circles',zh:'直线的关系与圆'},
   drills:['MD34','MD35'], magic:[['M-34'],['M-35']]},

 /* 40~43 실배치(2026-08-25, 고등 W13·W14): MASTER-ROADMAP.md §6.
    course40(대수 진입부)은 W12 마지막 재료 MD35를, course42(미적분Ⅰ
    진입부)는 W13 마지막 재료 MD42를 복습 풀에 얹는다(36·38과 같은
    관례). 2022 개정 과목명 준수 — "고3" 표기 없음(전부 "대수"·
    "미적분Ⅰ"). */
 {id:40, tier:'algebra', title:{ko:'지수와 로그',en:'Exponents & Logarithms',zh:'指数与对数'},
   drills:['MD36','MD37','MD38','MD35'], magic:[['M-36'],['M-37'],['M-38']]},
 {id:41, tier:'algebra', title:{ko:'삼각함수와 수열',en:'Trigonometry & Sequences',zh:'三角函数与数列'},
   drills:['MD39','MD40','MD41','MD42'], magic:[['M-39'],['M-40'],['M-41'],['M-42']]},
 {id:42, tier:'calculus1', title:{ko:'극한과 미분',en:'Limits & Derivatives',zh:'极限与导数'},
   drills:['MD43','MD44','MD42'], magic:[['M-43'],['M-44']]},
 {id:43, tier:'calculus1', title:{ko:'접선과 적분',en:'Tangent Lines & Integration',zh:'切线与积分'},
   drills:['MD45','MD46'], magic:[['M-45'],['M-46']]},

 /* 44~45 신설(2026-08-27, 심화 유형 2차 작업지시 "대수·미적분Ⅰ 심화는
    과정 40~43 세션 추가 또는 44~45 신설 — 판단해서 보고"). 40~43은
    이미 3~4개 마법 슬롯이 차 있어 5개씩(지수·로그방정식/부등식 3종 +
    사인·코사인법칙 2종 + 최대최소주기 1종 = 6종, 극한 심화 5종)을
    더 얹으면 세션이 8~9개까지 불어나 자동 병합(§편성 규칙 2)이 여러
    유닛을 한 세션에 뭉쳐버린다 — 새 과정을 만드는 쪽이 세션 수를
    클램프(3~5) 안에 깔끔히 유지한다(44는 6→5, 사인·코사인법칙만
    한 세션에 의도적으로 묶음. 45는 5→5, 병합 없음). course44
    drills에 직전 재료 MD42(Σ)를, course45엔 MD46(적분)을 복습 풀에
    얹는다(40·42가 앞 과정 마지막 재료를 얹던 것과 같은 관례). */
 {id:44, tier:'algebra', title:{ko:'지수·로그방정식과 삼각법',en:'Exponential/Log Equations & Trigonometry',zh:'指数·对数方程与三角法'},
   drills:['MD52','MD53','MD54','MD55','MD56','MD57','MD42'],
   magic:[['M-52'],['M-53'],['M-54'],['M-55','M-56'],['M-57']]},
 {id:45, tier:'calculus1', title:{ko:'극한·미분·적분 심화',en:'Advanced Limits, Derivatives & Integrals',zh:'极限·导数·积分进阶'},
   drills:['MD58','MD59','MD60','MD61','MD62','MD46'],
   magic:[['M-58'],['M-59'],['M-60'],['M-61'],['M-62']]},
];

function buildCourses(NM_THREADS){
  NM_THREADS = NM_THREADS || {};
  const maxLevel = t => {
    const th = NM_THREADS[t];
    if(!th || !th.levels || !th.levels.length) return 1;
    return Math.max.apply(null, th.levels.map(l=>l.id));
  };
  const homeLevel = {};   // thread -> level assigned when it's OWN material (escalates on reuse, capped)
  const priorPool = [];   // ordered list of distinct threads introduced as OWN material by earlier courses
  const seenPool = {};
  let globalSessionIdx = 0;
  const OUT = {};

  COURSE_SPEC.forEach(spec => {
    spec.drills.forEach(t => {
      if(homeLevel[t] == null) homeLevel[t] = 1;
      else homeLevel[t] = Math.min(homeLevel[t] + 1, maxLevel(t));
    });

    let segments = spec.magic.slice();
    /* maxSessions: 과정 6·7처럼 구구 B-유닛 묶음을 얹어 5를 넘는 과정만 6까지 허용(2026-09-03) */
    const targetCount = (spec.boss || spec.comingSoon) ? 3 : Math.min(Math.max(segments.length, 3), spec.maxSessions || 5);
    if(segments.length === 0){
      segments = new Array(targetCount).fill(null);
    } else {
      while(segments.length < targetCount) segments.push(null);
      while(segments.length > targetCount){
        const last = segments.pop();
        segments[segments.length-1] = segments[segments.length-1].concat(last);
      }
    }

    const sessions = segments.map((seg, i) => {
      const ownA = spec.drills[(i*2) % spec.drills.length];
      const ownB = spec.drills.length > 1 ? spec.drills[(i*2+1) % spec.drills.length] : null;
      const ownIds = (ownB && ownB !== ownA) ? [ownA, ownB] : [ownA];
      const drills = ownIds.map(t => ({t, lv:homeLevel[t], n:6}));
      if(spec.id > 1 && priorPool.length){
        const pt = priorPool[globalSessionIdx % priorPool.length];
        drills.push({t:pt, lv:homeLevel[pt], n:4});
      }
      globalSessionIdx++;
      return { magic: seg, drills };
    });

    let poolThreads = spec.drills.slice();
    if(spec.boss){
      const tierOwned = [];
      COURSE_SPEC.filter(s => s.id>=17 && s.id<=24).forEach(s => s.drills.forEach(t => {
        if(tierOwned.indexOf(t)<0) tierOwned.push(t);
      }));
      poolThreads = tierOwned.concat(spec.drills).filter((t,i,a)=>a.indexOf(t)===i);
    }
    const pool = poolThreads.map(t => ({t, lv:homeLevel[t], n: spec.boss ? 6 : 8}));
    sessions.push({ test:true, pool, passRate:0.8 });

    OUT['C'+spec.id] = {
      tier: spec.tier, order: spec.id,
      title: spec.title,
      comingSoon: !!spec.comingSoon,
      boss: !!spec.boss,
      sessions
    };

    spec.drills.forEach(t => { if(!seenPool[t]){ seenPool[t]=true; priorPool.push(t); } });
  });

  return OUT;
}

window.NM_COURSE_SPEC = COURSE_SPEC;   // 검증 하네스·향후 편집용 원본 노출
window.NM_COURSES = buildCourses(window.NM_THREADS);

if(typeof module!=='undefined'&&module.exports)module.exports={COURSE_SPEC,buildCourses,NM_COURSES:window.NM_COURSES};
})();
