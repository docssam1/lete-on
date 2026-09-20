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

   ── 발달 단계 재편 (2026-09-08, 원장 "무조건 덧셈 뺄셈 곱셈 나눗셈 종합 관련으로만
      묶여 있어 … 사이사이에 필산 후 창의 연산도 같이 … 배수판별법은 약수와 배수 다음에") ──
   창의(창의수연) 유닛이 그 주 필산과 어긋난 자리가 여럿이었다 — 분수 첫걸음(13)에 ×5 전략,
   약수와 배수(19)에 곱셈 전략 셋, 소수 곱셈(18)은 정작 '소수를 곱하기'(C-25)가 여섯 과정
   뒤(24)에 있었다. 원본 권 순서(초급=덧뺄, 중급=곱나눗…)를 그대로 얹은 흔적이다.
   그 주 필산과 같은 계열이 되도록 옮겼다:
     10→16 C-09(자릿수 예측, 혼합계산 앞의 어림) · 13 C-16→C-21(같은 분모 분수) ·
     14 ×5·×25·창살·격자(전부 3d×2d·곱셈) · 15 나눗셈 마법 넷 · 17 ×11 빼고 소수만 ·
     18 C-25 소수를 곱하기·H-11 몰아주기 합류 · 19 인수 짝(C-04·C-34)·분해곱셈법(C-03) ·
     20 C-22 · 21 C-31 · 22 C-32 · 23 C-33 소수를 나누기 · 24 어림·큰 수만.
   배수판별법 DV6은 과정 16 → **19(약수·배수 바로 뒤)**로 내리고 7·11 판별은 27로 올렸다.
   과정 16은 '혼합계산과 역연산'이 된다(EL1이 다시 나와 레벨 2가 처음으로 열린다).
   소수 나눗셈 필산 DC3은 어느 과정에도 없었다 — 과정 23(분수↔소수)에 편성했고,
   약분·통분 FR5도 마찬가지라 과정 20에 넣었다.

   ── creative: 창의 연산 회차 (2026-09-08) ──
   그 과정의 마법(창의수연 전략)을 **손으로 푸는** 드릴 목록. 학습지에서 필산 회차 뒤,
   문장제 앞에 온다. 필산 레벨 사다리와 섞지 않는다(아래 규칙 5). 초급 A유닛(38개)은
   대응 스레드가 없어 가장 가까운 기존 스레드로 대신했다(AD9 10 보정·AD4 몇십 덧뺄·
   AD8 짝 묶기·AD10 연이은 계산·SB2 100−수). 과정 1·17·25는 아직 비어 있다.

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
   5. **고정 레벨 `'DV6@3'`**: 그 과정에서 그 스레드를 레벨 3으로 쓴다. 레벨이
      "첫 등장 1, 재등장 +1"로만 오르다 보니 한두 과정에만 나오는 스레드는 상위
      레벨에 영영 닿지 못했다(DV6 4레벨 중 1, ML11 5레벨 중 2, ML18 4레벨 중 1).
      고정 레벨은 homeLevel 도 끌어올려 이후 복습 풀에 같은 레벨로 실린다.
   6. **창의 회차**: spec.creative 를 세션 index 로 순환해 세션마다 1종(4문항).
      homeLevel·priorPool 에는 넣지 않는다 — 넣으면 창의 회차가 필산 레벨을
      밀어 올려 버린다.
   ============================================================ */
(function(){
'use strict';

const COURSE_SPEC = [
 /* 과정 0 — 레벨 0(2026-09-19, 원장 "G드라이브 창의수연 폴더의 연산드릴(유아) = 우리 게임에서
    레벨 0", "수와 문장제와 친해지는 단계야", "의미 있는 것을 넣어").
    원본 유아 연산드릴 G1-1~G1-15(15권, Drive `창의수연/연산드릴(유아)`)는 N-01~N-15로 이미
    1:1 옮겨져 있었지만 과정이 없어 학습지 로드맵에 안 실렸다("과정 번호 없는 프롤로그").
    한 주 = 원본 한 권(magic) + 그 권을 손으로 다지는 드릴 둘(perSessionDrills — 순환 배정이
    아니라 권마다 지정) + 문장제 한 벌(creative: 줄서기 이야기·이야기 셈·분류하고 세기 순환).
    시간을 재지 않는 단계라 시험 회차가 없고(noTest), 여기서 쓴 드릴은 뒤 과정의 복습 풀에
    섞이지 않는다(buildCourses 참조). 뒤에 다시 나오는 스레드는 @2 로 한 단계 올린다. */
 {id:0, tier:'level0', title:{ko:'수와 문장제와 친해지기',en:'Befriending Numbers & Word Problems',zh:'与数和应用题交朋友'},
   drills:['NL1','NL2','NL3','NL4','NL5','NL6','NL7','NL8','NL10','NL11','NL12','NL14','NL16'],
   magic:[['N-01'],['N-02'],['N-03'],['N-04'],['N-05'],['N-06'],['N-07'],['N-08'],['N-09'],['N-10'],['N-11'],['N-12'],['N-13'],['N-14'],['N-15']],
   perSessionDrills:[
     ['NL1','NL7'],        // N-01 수 세기        — 수 세기와 개수 · 이어 세기와 점 매칭
     ['NL4','NL7'],        // N-02 수의 순서       — 수의 순서 · 이어 세기
     ['NL8','NL10'],       // N-03 몇째와 크기 비교  — 몇째와 칸 세기 · 양팔저울 비교
     ['NL14','NL16'],      // N-04 기수법 놀이     — 탤리로 수 만들기 · 탤리 읽기와 규칙
     ['NL8','NL1@2'],      // N-05 생활 서수 문장제 — 몇째와 칸 세기 · 수 세기(한 단계 위)
     ['NL2','NL3'],        // N-06 모으기와 가르기   — 모으기와 가르기 · 무당벌레 가르기
     ['NL6','NL5'],        // N-07 수 이웃과 10 짝꿍 — 10까지의 수 관계 · 이웃 수 더하기
     ['NL11','NL12'],      // N-08 수 기계와 매직 퍼즐 — 수 기계 규칙 · 길 잇기와 십자 퍼즐
     ['NL5','NL2@2'],      // N-09 수 피라미드와 동전 — 이웃 수 더하기 · 모으기와 가르기(위)
     ['NL16','NL4@2'],     // N-10 자료 분류와 표    — 탤리 읽기와 규칙 · 수의 순서(위)
     ['NL7@2','NL1@3'],    // N-11 수 배열·이어 세기 — 이어 세기(위) · 수 세기(위)
     ['NL3@2','NL10@2'],   // N-12 무당벌레와 저울   — 무당벌레 가르기(위) · 양팔저울(위)
     ['NL12@2','NL11@2'],  // N-13 수 퍼즐과 추론    — 길 잇기와 십자 퍼즐(위) · 수 기계(위)
     ['NL14@2','NL16@2'],  // N-14 산가지와 규칙     — 탤리로 수 만들기(위) · 탤리 읽기(위)
     ['NL6@2','NL8@2']     // N-15 문장제와 논리     — 10까지의 수 관계(위) · 몇째(위)
   ],
   creative:['NL9@1','NL13@1','NL15@1'], maxSessions:15, noTest:true},
 /* 과정 1~12 사다리 정리(2026-09-19) — 스레드의 prereq 순서와 과정 순서를 맞춘 것.
    SB1(한 자리 뺄셈)은 어느 과정에도 없었다. 덧셈은 AD1(과정 1)로 시작하는데 뺄셈은
    SB3(두 자리−한 자리, 과정 3)에서 시작해, 한 자리 뺄셈과 몇십−한 자리(SB2)를
    건너뛰고 있었다. AD10·WP1이 SB1을 선수로 요구하는데 그 선수가 로드맵에 없었다. */
 {id:1, tier:'level1', title:{ko:'자릿값과 첫 덧셈·뺄셈',en:'Place Value, First Addition & Subtraction',zh:'位值与加减法入门'},
   drills:['NS1','NS2','NS3','AD1','SB1'], magic:[['N-06','N-07']], creative:['NL11@1','NL12@2','NL5@1']},
 {id:2, tier:'level1', title:{ko:'받아올림과 두 배 수',en:'Carrying & Doubles',zh:'进位与翻倍数'},
   /* 창의 AD9(10 이용 덧셈)는 선수 AD3가 과정 3이라 한 과정 앞서 있었다 → 과정 3으로.
      대신 문장제 사슬(WP1→WP3→WP4→WP5)의 첫 칸을 여기서 연다 — 선수 AD1·SB1이 과정 1. */
   drills:['AD2','NS5','NS4'], magic:[['A-01'],['A-02']], creative:['WP1@1']},
 {id:3, tier:'level1', title:{ko:'두 자리 덧뺄셈 시작',en:'Two-digit ± Begins',zh:'两位数加减开始'},
   drills:['AD3','SB2','SB3'], magic:[['A-03'],['A-04']], creative:['AD4','AD9@1']},
 {id:4, tier:'level1', title:{ko:'두 자리 올림 덧뺄셈',en:'Two-digit ± with Carrying',zh:'两位数进位加减'},
   drills:['AD5','SB4','AD6'], magic:[['A-05'],['A-06'],['A-07'],['A-08'],['A-09']], creative:['AD8']},
 {id:5, tier:'level1', title:{ko:'뺄셈 마법과 구구단 첫걸음',en:'Subtraction Magic & Times Tables Begin',zh:'减法魔法与乘法口诀入门'},
   drills:['SB5','ML1','ML25','ML2','ML25','ML2'], magic:[['A-10'],['A-11'],['A-12'],['B-01','B-02','B-03'],['B-04','B-05','B-06']], creative:['WP3@1']},
 {id:6, tier:'level1', title:{ko:'세 자리 뺄셈과 구구단 완성',en:'3-digit Subtraction & Full Times Tables',zh:'三位数减法与完整口诀'},
   drills:['SB6','SB7','ML3','SB6'], magic:[['A-13'],['A-14'],['A-15'],['A-16','A-17'],['B-07','B-08','B-09'],['B-10','B-11','B-12']], creative:['AD10'], maxSessions:6},
 {id:7, tier:'level1', title:{ko:'구구단 종합과 네 자리 연산',en:'Times Tables Mix & 4-digit ±',zh:'乘法口诀综合与四位数运算'},
   drills:['ML4','AD7'], magic:[['B-13','B-14','B-15'],['A-18','A-19'],['A-20','A-21'],['A-22','A-23'],['A-24','A-25'],['C-01']], creative:['EL3@1'], maxSessions:6},
 {id:8, tier:'level1', title:{ko:'몇십 곱과 나눗셈의 시작',en:'Multiplying Tens & Division Begins',zh:'整十乘法与除法开始'},
   /* 나눗셈의 뜻 셋(DV12 등분·DV13 포함·DV14 반복 뺄셈)을 ÷2·2d÷1d 앞에 둔다(2026-09-17,
      원장 "직접 나누기·같은 수 빼기·묶어서 나누기 … 좀 제대로 생각을 할 수 있도록").
      마법 B-24(나눗셈의 세 얼굴)가 첫 세션, 창의 회차에 반복 뺄셈(나머지) 한 벌. */
   drills:['DV12','DV13','DV14','DV17','ML5','DV1','DV2','DV17@2','DV17@3','ML5@2'],
   magic:[['B-24'],['B-16','B-17'],['B-18','B-19','B-20'],['A-30','A-31','A-32'],['A-33','A-34'],['C-02']],
   creative:['ML12@1','DV14@2'], maxSessions:6},
 {id:9, tier:'level1', title:{ko:'두 자리 곱셈 암산과 나머지',en:'2-digit Mental Multiplication & Remainders',zh:'两位数心算乘法与余数'},
   drills:['ML6','ML22','DV18','DV19','DV3','ML6'], magic:[['B-21','B-22','B-23'],['A-26'],['A-27'],['A-29'],['C-07','C-08']], creative:['ML13@1','WP4@1']},
 {id:10, tier:'level1', title:{ko:'세 자리 곱셈과 검산',en:'3-digit Multiplication & Checking',zh:'三位数乘法与验算'},
   drills:['ML7','EL2','EL2@2'], magic:[['A-28'],['A-35'],['C-06']], creative:['ML14@1','ML24@1']},

 /* 원본 중급 C-7 묶음(몇 자리 수·풀풀·폭포수·엑스맨 기초·×11·창살·격자)을 진도 자리에
    붙인다(2026-09-19, 원장 "원본의 필요 내용을 우리 로드맵 과정에 붙여야지"). C-12 엑스맨은
    중급 유닛(연습·랩·아레나가 전부 두 자리×두 자리)인데 과정 26(125주)에만 있어 짝인
    풀풀(C-10)과 67주 떨어져 있었다 — 유닛 안의 "풀풀 4조각 → 엑스맨 3조각" 비교가 그만큼
    늦게 나왔다. 원본 순서 풀풀 → 폭포수 → 엑스맨 → ×11 로 끼운다. ML21 몇 자리 수(어림)도
    원본은 이 묶음 맨 앞이라 창의 회차에 넣는다. 창살(C-14)·격자(C-30)는 세 자리×두 자리
    (과정 14)에 그대로 둔다 — 그쪽이 그 방법이 빛나는 자리다. 회차 +1(maxSessions 7). */
 {id:11, tier:'level2', title:{ko:'두 자리×두 자리 곱셈',en:'2-digit × 2-digit Multiplication',zh:'两位数乘两位数'},
   drills:['ML8'], magic:[['C-26'],['C-15'],['C-10'],['C-11'],['C-12'],['C-13'],['C-23']],
   creative:['ML21@1','ML23@1','ML15@1'], maxSessions:7},
 {id:12, tier:'level2', title:{ko:'나눗셈과 역연산',en:'Division & Inverse Operations',zh:'除法与逆运算'},
   drills:['DV3','DV15','DV4','EL1','DV15@2','EL1@2'], magic:[['C-18']], creative:['DV9@1','WP5@1']},
 {id:13, tier:'level2', title:{ko:'분수의 첫걸음',en:'Fractions Begin',zh:'分数入门'},
   drills:['FR1','FR2'], magic:[['C-21']], creative:['FR9@1']},
 {id:14, tier:'level2', title:{ko:'대분수와 세 자리×두 자리',en:'Mixed Numbers & 3d×2d',zh:'带分数与三位乘两位'},
   drills:['FR3','ML9'], magic:[['C-14'],['C-30'],['C-16'],['C-17']], creative:['ML16@1','ML17@1']},
 {id:15, tier:'level2', title:{ko:'두 자리로 나누기와 분수',en:'Dividing by 2 Digits & Fractions',zh:'除以两位数与分数'},
   drills:['DV5'], magic:[['C-19'],['C-20'],['C-28'],['C-29']], creative:['DV10@1','DV11@1']},
 {id:16, tier:'level2', title:{ko:'혼합계산과 역연산',en:'Mixed Operations & Inverse',zh:'混合运算与逆运算'},
   drills:['MX1','EL1'], magic:[['C-09']], creative:['ML21@1']},

 {id:17, tier:'level3', title:{ko:'소수의 시작',en:'Decimals Begin',zh:'小数入门'},
   /* 창의 회차 — 이 과정의 마법(A-36~38)은 세로셈 절차라 필산 DC1과 같은 것이어서 짝이
      없었다. 보수를 소수로 이은 DC6(0.3의 1 짝꿍은 0.7)을 쓴다(2026-09-09). */
   drills:['DC1'], magic:[['A-36'],['A-37'],['A-38']], creative:['DC6@1','DC6@2','DC6@3']},
 {id:18, tier:'level3', title:{ko:'소수 곱셈과 제곱수',en:'Decimal Multiplication & Squares',zh:'小数乘法与平方数'},
   drills:['DC2','ML11'], magic:[['C-25'],['C-24'],['C-27'],['ML10'],['H-11']],
   creative:['DC4@1','ML20@3','CH11@1']},
 {id:19, tier:'level3', title:{ko:'약수와 배수, 그리고 배수 판별법',en:'Factors, Multiples & Divisibility Rules',zh:'因数、倍数与整除判别'},
   drills:['DV20','DV7','DV6@1','DV6@2','DV20@2','DV7@2'], magic:[['C-04'],['C-34'],['C-03']], creative:['ML12@2','ML12@3']},
 {id:20, tier:'level3', title:{ko:'분모가 다른 분수와 제곱근',en:'Unlike Denominators & Square Roots',zh:'异分母分数与平方根'},
   drills:['FR4','FR5','MX4','FR5@2'], magic:[['C-22']], creative:['FR10@1']},
 {id:21, tier:'level3', title:{ko:'분수 곱셈과 거듭제곱',en:'Fraction Multiplication & Powers',zh:'分数乘法与乘方'},
   drills:['FR6'], magic:[['C-31']], creative:['FR11@1']},
 {id:22, tier:'level3', title:{ko:'분수 나눗셈',en:'Fraction Division',zh:'分数除法'},
   drills:['FR7'], magic:[['C-32']], creative:['FR12@1']},
 {id:23, tier:'level3', title:{ko:'수열과 분수·소수 변환',en:'Sequences & Fraction↔Decimal',zh:'数列与分数小数互换'},
   drills:['MX2','FR8','DC3'], magic:[['C-05'],['C-35'],['C-33']], creative:['MX6@1','DC5@1']},
 {id:24, tier:'level3', title:{ko:'백분율과 비와 비율',en:'Percent, Ratio & Proportion',zh:'百分率与比例'},
   drills:['MX3','MX3@4','MX3@5','DV8','EL4','MX3@2'], magic:[['H-12'],['H-13']], creative:['CH12@1','CH13@1','EL5@1']},
 {id:25, tier:'level3', title:{ko:'레벨 3 총정리',en:'Level 3 Final Review',zh:'第三级总复习'},
   drills:['MX5'], magic:[], /* 레벨 보스는 세션이 3개로 고정이라 창의도 3종만 실린다(4개를 적으면 마지막이 안 나온다).
      레벨 3을 대표하는 셋 — 분수 · 소수 · 수열(가우스). */
   creative:['FR11@1','DC5@1','MX6@1'], boss:true},

 /* 26~28 실배치(2026-08-25 Phase 2, 고급-목차.md §2②): 로드맵 §3의 4단원 구성 그대로.
    각 과정 4단원 중 신규 유닛(H-01·02, H-03~06, H-07~10)이 magic, 1단계에서 이미
    확장해 둔 기존 유닛(C-12 엑스맨 세 자리, C-15 피라미드 곱셈, C-01 제곱수 점화식)은
    "1단계 확장 레벨들도 드릴 재료로"(작업지시)에 따라 drills로 재사용한다 — 새 id를
    지어내지 않고 threads.js에 이미 있는 스레드만 쓴다는 기존 규칙을 그대로 지켰다. */
 {id:26, tier:'challenge', title:{ko:'곱셈의 정점',en:'Peak of Multiplication',zh:'乘法之巅'},
   drills:['ML8','ML18','ML19','ML8@6','ML18@3'], magic:[['H-01'],['H-02'],['C-12'],['C-15']],
   creative:['CH1@1','CH2@1']},
 {id:27, tier:'challenge', title:{ko:'수의 비밀',en:'Secrets of Numbers',zh:'数的秘密'},
   drills:['DV7','DV8','MX2','DV6@3','DV6@4','DV8@3'], magic:[['H-03'],['H-04'],['H-05'],['H-06']],
   creative:['CH3@1','CH4@1','CH5@1','CH6@1']},
 {id:28, tier:'challenge', title:{ko:'제곱의 산',en:'Mountain of Squares',zh:'平方之山'},
   drills:['ML11','ML20','MX4','ML11@4','ML11@5'], magic:[['H-07'],['H-08'],['H-09'],['H-10']],
   creative:['CH7@1','CH8@1','CH9@1','CH10@1']},

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
 /* 중·고의 네 번째 회차(2026-09-19) — 초등의 '창의 연산' 자리에 대응하지만 이름이 다르다.
    중·고에는 창의연산이라는 범주가 없다(암산법·풀풀·엑스맨은 초등 연산 교재의 갈래다).
    그렇다고 그 자리를 비워 두면 학습지 모양이 중등부터 달라져 한 진도로 안 읽힌다 —
    원장 "중등·고등은 문장제보다는 적용이지"를 그대로 따라 **그 과정의 마무리 개념을
    최고 레벨로 한 벌 더**(적용 회차) 싣는다. 재료는 그 과정이 이미 쓰는 스레드뿐이고
    새 id 를 지어내지 않는다. 회차마다 돌도록 2~3개씩 적어 둔다(한 개면 매주 같은 것이
    나온다). 라벨은 exam.js 가 단계에 따라 '창의 연산 ·' / '적용 ·' 으로 붙인다. */
 {id:29, tier:'middle1', title:{ko:'정수의 세계',en:'World of Integers',zh:'整数的世界'},
   drills:['MD1','MD2','MD3','CH5','MD47','MD48','MD2@2','MD3@2','MD2@3','MD47@2'], magic:[['M-01'],['M-02'],['M-03'],['M-47'],['M-48']], creative:['MD3@3','MD2@4','MD48@3']},
 {id:30, tier:'middle1', title:{ko:'부호의 규칙',en:'Rules of Sign',zh:'符号的规则'},
   drills:['MD4','MD5','MD6','MD49','MD50','MD4@2','MD4@3','MD5@2','MD5@3','MD6@2'], magic:[['M-04'],['M-05'],['M-06'],['M-49'],['M-50']], creative:['MD50@3','MD6@3','MD4@4']},
 {id:31, tier:'middle1', title:{ko:'유리수 정복',en:'Conquering Rationals',zh:'征服有理数'},
   drills:['MD7','MD8','MD9','MD51','MD7@2','MD51@2'], magic:[['M-07'],['M-08'],['M-09'],['M-51']], creative:['MD51@3','MD9@4','MD7@3']},

 /* 32~35 실배치(2026-08-25, 중등 W9·W10): MASTER-ROADMAP.md §8 Phase 4.
    drills는 그 과정의 자기 재료 + "누적 혼합에 W8 재료 포함"(작업 지시)
    — course32는 W8 마지막 재료 MD9를, course34(중3 진입부)는 중2 재료
    MD14를 복습 풀에 얹는다(다른 과정들처럼 spec.drills에 얹으면 자기
    재료로도 잡히고 이후 과정의 priorPool 순환에도 자동으로 실린다). */
 {id:32, tier:'middle2', title:{ko:'지수와 단항식',en:'Exponents & Monomials',zh:'指数与单项式'},
   drills:['MD10','MD11','MD12','MD9','MD10@2','MD11@2'], magic:[['M-10'],['M-11'],['M-12']], creative:['MD12@3','MD10@4','MD11@3']},
 {id:33, tier:'middle2', title:{ko:'다항식과 등식',en:'Polynomials & Equations',zh:'多项式与等式'},
   drills:['MD13','MD14','MD13@2'], magic:[['M-13'],['M-14']], creative:['MD14@3','MD13@3']},
 {id:34, tier:'middle3', title:{ko:'제곱근의 세계',en:'World of Square Roots',zh:'平方根的世界'},
   drills:['MD15','MD16','MD17','MD14','MD15@2','MD16@2'], magic:[['M-15'],['M-16'],['M-17']], creative:['MD17@3','MD16@3','MD15@3']},
 {id:35, tier:'middle3', title:{ko:'곱셈공식과 인수분해',en:'Formulas & Factoring',zh:'乘法公式与因式分解'},
   drills:['MD18','MD19','MD20','MD19@2'], magic:[['M-18'],['M-19'],['M-20']], creative:['MD20@2','MD19@3','MD18@3']},

 /* 36~39 실배치(2026-08-25, 고등 W11·W12): MASTER-ROADMAP.md §6.
    course36은 W10 마지막 재료 MD20을, course38(공통수학2 진입부)은
    W11 마지막 재료 MD30을 복습 풀에 얹는다(32~35와 같은 관례 —
    spec.drills에 얹으면 자기 재료로도 잡히고 이후 과정의 priorPool
    순환에도 자동으로 실린다). 2022 개정 과목명 준수 — "고1" 표기
    없음(전부 "공통수학1"·"공통수학2"). */
 {id:36, tier:'highmath1', title:{ko:'다항식과 나머지정리',en:'Polynomials & the Remainder Theorem',zh:'多项式与余数定理'},
   drills:['MD21','MD22','MD23','MD24','MD25','MD20','MD21@2','MD22@2','MD21@3','MD22@3'], magic:[['M-21'],['M-22'],['M-23'],['M-24'],['M-25']], creative:['MD25@3','MD24@3','MD23@3']},
 {id:37, tier:'highmath1', title:{ko:'이차방정식과 행렬',en:'Quadratics & Matrices',zh:'二次方程与矩阵'},
   drills:['MD26','MD27','MD28','MD29','MD30','MD26@2','MD26@3','MD27@2','MD28@2','MD29@2'], magic:[['M-26'],['M-27'],['M-28'],['M-29'],['M-30']], creative:['MD30@3','MD29@3','MD27@3']},
 {id:38, tier:'highmath2', title:{ko:'점과 직선',en:'Points & Lines',zh:'点与直线'},
   drills:['MD31','MD32','MD33','MD30','MD31@2','MD32@2'], magic:[['M-31'],['M-32'],['M-33']], creative:['MD33@3','MD32@3','MD31@3']},
 {id:39, tier:'highmath2', title:{ko:'직선의 관계와 원',en:'Relations Between Lines & Circles',zh:'直线的关系与圆'},
   drills:['MD34','MD35','MD34@2'], magic:[['M-34'],['M-35']], creative:['MD35@3','MD34@3']},

 /* 40~43 실배치(2026-08-25, 고등 W13·W14): MASTER-ROADMAP.md §6.
    course40(대수 진입부)은 W12 마지막 재료 MD35를, course42(미적분Ⅰ
    진입부)는 W13 마지막 재료 MD42를 복습 풀에 얹는다(36·38과 같은
    관례). 2022 개정 과목명 준수 — "고3" 표기 없음(전부 "대수"·
    "미적분Ⅰ"). */
 {id:40, tier:'algebra', title:{ko:'지수와 로그',en:'Exponents & Logarithms',zh:'指数与对数'},
   drills:['MD36','MD37','MD38','MD35','MD36@2','MD37@2'], magic:[['M-36'],['M-37'],['M-38']], creative:['MD38@3','MD37@3','MD36@3']},
 {id:41, tier:'algebra', title:{ko:'삼각함수와 수열',en:'Trigonometry & Sequences',zh:'三角函数与数列'},
   drills:['MD39','MD40','MD41','MD42','MD39@2','MD40@2','MD40@3','MD41@2'], magic:[['M-39'],['M-40'],['M-41'],['M-42']], creative:['MD42@3','MD41@3','MD39@3']},
 {id:42, tier:'calculus1', title:{ko:'극한과 미분',en:'Limits & Derivatives',zh:'极限与导数'},
   drills:['MD43','MD44','MD42'], magic:[['M-43'],['M-44']], creative:['MD44@3','MD43@3']},
 {id:43, tier:'calculus1', title:{ko:'접선과 적분',en:'Tangent Lines & Integration',zh:'切线与积分'},
   drills:['MD45','MD46'], magic:[['M-45'],['M-46']], creative:['MD46@3','MD45@3']},

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
   drills:['MD52','MD53','MD54','MD55','MD56','MD57','MD42','MD52@2','MD52@3','MD53@2'],
   magic:[['M-52'],['M-53'],['M-54'],['M-55','M-56'],['M-57']], creative:['MD57@3','MD54@3','MD56@3']},
 {id:45, tier:'calculus1', title:{ko:'극한·미분·적분 심화',en:'Advanced Limits, Derivatives & Integrals',zh:'极限·导数·积分进阶'},
   drills:['MD58','MD59','MD60','MD61','MD62','MD46','MD58@2','MD59@2','MD58@3','MD59@3'],
   magic:[['M-58'],['M-59'],['M-60'],['M-61'],['M-62']], creative:['MD62@3','MD61@3','MD60@3']},
];

function buildCourses(NM_THREADS){
  NM_THREADS = NM_THREADS || {};
  const maxLevel = t => {
    const th = NM_THREADS[t];
    if(!th || !th.levels || !th.levels.length) return 1;
    return Math.max.apply(null, th.levels.map(l=>l.id));
  };
  /* 'DV6@3' = 그 과정에서 DV6을 레벨 3으로 쓴다(고정). 2026-09-08 신설.
     왜 필요했나 — 레벨은 "처음 등장 1, 다시 자기 재료로 나오면 +1"로만 올라가서,
     한두 과정에만 나오는 스레드는 레벨 3 이상에 영영 도달하지 못했다. 실제로
     DV6 배수판별법은 4레벨(2·5·10 / 3·6·9 / 7 / 11) 중 1까지, ML20 차가2는
     9레벨 중 1까지만 쓰이고 있었다 — 고급 확장 레벨을 만들어 두고 편성이
     그 레벨에 닿지 못한 것이다. 고정 레벨은 homeLevel 도 함께 끌어올려
     복습 풀(priorPool)에도 같은 레벨로 실린다. */
  const parsePin = raw => {
    const at = String(raw).indexOf('@');
    if(at < 0) return { t:String(raw), pin:null };
    return { t:String(raw).slice(0,at), pin:parseInt(String(raw).slice(at+1),10) || null };
  };
  /* 레벨을 한 칸 올려도 되는가 — 다음 레벨이 **같은 갈래**여야 한다.
     params.mode 가 바뀌면 난이도 계단이 아니라 다른 주제이므로 올리지 않는다
     (MD4 mul2→div2, DV20 factors→multiples, MX3 toPct→hpl). */
  function sameBranch(t, lv){
    const L = (NM_THREADS[t] && NM_THREADS[t].levels) || [];
    const a = L.filter(x => x.id === lv)[0], b = L.filter(x => x.id === lv + 1)[0];
    if(!a || !b) return false;
    return (a.params || {}).mode === (b.params || {}).mode;
  }
  function climbLevel(t, base, steps){
    let lv = base, cap = maxLevel(t);
    for(let i = 0; i < steps; i++){
      if(lv >= cap || !sameBranch(t, lv)) break;
      lv++;
    }
    return lv;
  }
  const homeLevel = {};   // thread -> level assigned when it's OWN material (escalates on reuse, capped)
  const priorPool = [];   // ordered list of distinct threads introduced as OWN material by earlier courses
  const seenPool = {};
  let globalSessionIdx = 0;
  const OUT = {};

  COURSE_SPEC.forEach(spec => {
    const ownDrills = spec.drills.map(parsePin);
    /* 레벨을 여기서 확정한다. 고정 레벨('MX3@4')은 **그 항목만** 그 레벨이고, 같은 과정의
       맨 항목('MX3')을 밀어 올리지 않는다 — 안 그러면 과정 24 처럼 1·4·5 를 같이 내려던
       것이 전부 5 가 되어 버린다(2026-09-08 발견). 복습 풀(priorPool)에는 그 과정에서 쓴
       가장 높은 레벨을 남긴다. */
    /* 한 과정 안에서 같은 스레드를 여러 항목으로 실어도 **여기서는 한 번만** 올린다
       (2026-09-20). 항목마다 올리면 아래 회차별 climbLevel 과 이중으로 더해져
       `AD5L3 AD5L3` 처럼 같은 주에 같은 레벨이 두 번 찍혔다. 과정 안의 계단은
       회차별 climbLevel 이 맡고, 여기는 **과정 사이**의 계단만 맡는다. */
    const bumped = {};
    ownDrills.forEach(d => {
      if(d.pin != null){ d.lv = Math.min(d.pin, maxLevel(d.t)); return; }
      if(bumped[d.t] != null){ d.lv = bumped[d.t]; return; }
      if(homeLevel[d.t] == null) homeLevel[d.t] = 1;
      else homeLevel[d.t] = Math.min(homeLevel[d.t] + 1, maxLevel(d.t));
      d.lv = bumped[d.t] = homeLevel[d.t];
    });
    /* 고정 레벨을 homeLevel 에 반영하는 일은 **실제로 회차에 실린 뒤** 아래에서 한다
       (2026-09-20). 항목만 있고 회차에 안 뽑힌 레벨까지 올려 두면, 시험이 한 번도
       가르치지 않은 레벨을 냈다(C37 시험에 MD28L3 이 그렇게 들어갔다). */
    /* 창의 연산 회차(2026-09-08, 원장 "사이사이에 필산 후 창의 연산도 같이").
       그 과정의 마법(창의수연 전략)을 손으로 푸는 드릴이다. 필산 레벨 사다리
       (homeLevel·priorPool)와 섞지 않는다 — 계열이 다르고, 섞으면 창의 회차가
       필산 레벨을 밀어 올려 버린다. */
    const creative = (spec.creative || []).map(parsePin)
      .filter(d => NM_THREADS[d.t])
      .map(d => ({ t:d.t, lv:Math.min(d.pin || 1, maxLevel(d.t)), n:4 }));

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

    /* perSessionDrills(과정 0, 2026-09-19) — 회차마다 드릴을 지정한다. 순환 배정은 "그 주의
       유닛"과 무관한 드릴을 붙이는데, 유아 단계는 한 주 한 권이라 권과 드릴이 맞아야 의미가
       있다. '@n' 은 그 회차만의 고정 레벨(maxLevel 로 자른다). */
    const perSession = Array.isArray(spec.perSessionDrills) ? spec.perSessionDrills : null;
    const emitted = {};   /* 이 과정에서 그 스레드를 이미 몇 회차에 실었나 — 레벨을 올리는 근거 */
    const sessions = segments.map((seg, i) => {
      let drills;
      if(perSession && perSession[i]){
        drills = perSession[i].map(parsePin).filter(d => NM_THREADS[d.t])
          .map(d => ({t:d.t, lv:Math.min(d.pin || 1, maxLevel(d.t)), n:6}));
      } else {
        const ownA = ownDrills[(i*2) % ownDrills.length];
        /* 짝이 되는 둘째 항목은 **다른 스레드**여야 한다 — 같은 스레드가 한 주에 두 번
           나오면 같은 학습지에 같은 유형이 두 벌 찍힌다. 한 칸씩 밀며 찾는다. */
        let ownB = null;
        for(let k = 1; k < ownDrills.length; k++){
          const cand = ownDrills[(i*2 + k) % ownDrills.length];
          if(cand !== ownA && cand.t !== ownA.t){ ownB = cand; break; }
        }
        const picked = ownB ? [ownA, ownB] : [ownA];
        /* 회차마다 한 칸씩(2026-09-20, 원장 "계단형 자동 + 갈래형 수동").
           전에는 한 과정에 한 번 실린 스레드가 그 과정 내내 레벨 1에 머물렀다 — 그래서
           **190개 중 127개가 만들어 둔 상위 레벨에 학습지로는 영영 안 닿았다**
           (AD5 두 자리 덧셈은 7레벨 중 '올림 없음'만, DV19 세로 나눗셈은 5레벨 중 1만).
           같은 과정 안에서 그 스레드가 다시 나오는 회차마다 한 칸 올린다. 단, 레벨이
           난이도 계단이 아니라 **갈래**인 스레드(params.mode 로 갈리는 것 — MD4 곱셈↔나눗셈,
           DV20 약수↔배수↔공배수)는 올리지 않는다. 주마다 주제가 바뀌어 그 주 개념과
           어긋나기 때문이다. 갈래형은 과정별로 '@n' 을 손으로 박아 싣는다.
           고정 레벨('AD5@3')은 지은이가 정한 값이므로 그대로 둔다. */
        drills = picked.map(d => {
          const lv = d.pin != null ? d.lv : climbLevel(d.t, d.lv, emitted[d.t] || 0);
          emitted[d.t] = (emitted[d.t] || 0) + 1;
          return {t:d.t, lv, n:6};
        });
      }
      if(spec.id > 1 && priorPool.length){
        /* 복습 한 벌 — 그 주 드릴에 이미 있는 스레드면 건너뛴다(2026-09-20).
           안 그러면 같은 학습지에 같은 유형이 두 벌 찍힌다(C27 DV6 · C28 MX4). */
        let pt = null;
        for(let k = 0; k < priorPool.length; k++){
          const cand = priorPool[(globalSessionIdx + k) % priorPool.length];
          if(!drills.some(d => d.t === cand)){ pt = cand; break; }
        }
        if(pt) drills.push({t:pt, lv:homeLevel[pt], n:4});
      }
      globalSessionIdx++;
      /* 창의 회차는 세션마다 하나씩 순환 — 한 주 학습지에 필산 뒤 창의 한 벌. */
      const cre = creative.length ? [creative[i % creative.length]] : [];
      return { magic: seg, drills, creative: cre };
    });

    /* 회차마다 올라간 레벨을 homeLevel 에 반영한다 — 그래야 이 과정의 시험(pool)과
       뒤 과정의 복습(priorPool)이 **실제로 배운 마지막 레벨**로 나온다. */
    sessions.forEach(ss => (ss.drills || []).forEach(d => {
      if(ownDrills.some(o => o.t === d.t)) homeLevel[d.t] = Math.max(homeLevel[d.t] || 0, d.lv);
    }));

    let poolThreads = ownDrills.map(d => d.t).filter((t,i,a)=>a.indexOf(t)===i);
    if(spec.boss){
      const tierOwned = [];
      COURSE_SPEC.filter(s => s.id>=17 && s.id<=24).forEach(s => s.drills.forEach(raw => {
        const t = parsePin(raw).t;
        if(tierOwned.indexOf(t)<0) tierOwned.push(t);
      }));
      poolThreads = tierOwned.concat(poolThreads).filter((t,i,a)=>a.indexOf(t)===i);
    }
    const pool = poolThreads.map(t => ({t, lv:homeLevel[t], n: spec.boss ? 6 : 8}));
    /* noTest — 수의 나라(과정 0)는 "시간을 재지 않는" 단계(stages.js)라 시험 회차가 없다. */
    if(!spec.noTest) sessions.push({ test:true, pool, passRate:0.8 });

    OUT['C'+spec.id] = {
      tier: spec.tier, order: spec.id,
      title: spec.title,
      comingSoon: !!spec.comingSoon,
      boss: !!spec.boss,
      sessions
    };

    /* 유아 드릴(level0)은 복습 풀에 넣지 않는다 — 풀은 끝까지 순환하므로 넣으면 중등 과정
       학습지에도 '수 세기'가 복습으로 따라붙는다. */
    if(spec.tier !== 'level0')
      ownDrills.forEach(d => { if(!seenPool[d.t]){ seenPool[d.t]=true; priorPool.push(d.t); } });
  });

  return OUT;
}

window.NM_COURSE_SPEC = COURSE_SPEC;   // 검증 하네스·향후 편집용 원본 노출
window.NM_COURSES = buildCourses(window.NM_THREADS);

if(typeof module!=='undefined'&&module.exports)module.exports={COURSE_SPEC,buildCourses,NM_COURSES:window.NM_COURSES};
})();
