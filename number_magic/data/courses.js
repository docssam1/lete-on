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
     ['NL6@2','NL8@2'],    // N-15 문장제와 논리     — 10까지의 수 관계(위) · 몇째(위)
     /* 16~19주(2026-09-20) — 원본 15권을 한 권씩 따라간 뒤, **레벨 3만 남은 갈래**를 모아
        네 주로 다진다. 이 주들엔 마법(원본 권)이 없다 — 새 개념을 얹는 자리가 아니라
        이미 편 개념의 마지막 갈래(가르기·거꾸로 세기·동전 뛰어세기·수-점 매칭 …)를
        손으로 해 보는 자리다. 15권 1:1 대응은 앞 15주에서 그대로 지킨다. */
     ['NL2@3','NL4@3'],    // 가르기(0 포함) · 수열 빈칸(거꾸로·뛰어세기)
     ['NL5@3','NL7@3'],    // 동전 뛰어세기 · 수-점 매칭
     ['NL8@3','NL11@3'],   // 몇째 찾기(어려움) · 숨은 규칙 추리
     ['NL14@3','NL16@3']   // 수-탤리 매칭 · 탤리 읽기(어려움)
   ],
   /* 적용(문장제 놀이)도 레벨 3까지 — 줄서기는 계단 몇째, 이야기 셈은 분류하기,
      분류하고 세기는 더 많은 쪽 비교로 갈래가 바뀐다(2026-09-20). */
   creative:['NL9@1','NL13@1','NL15@1','NL9@2','NL13@2','NL15@2','NL9@3','NL13@3','NL15@3'],
   minSessions:19, maxSessions:19, noTest:true},
 /* 과정 1~12 사다리 정리(2026-09-19) — 스레드의 prereq 순서와 과정 순서를 맞춘 것.
    SB1(한 자리 뺄셈)은 어느 과정에도 없었다. 덧셈은 AD1(과정 1)로 시작하는데 뺄셈은
    SB3(두 자리−한 자리, 과정 3)에서 시작해, 한 자리 뺄셈과 몇십−한 자리(SB2)를
    건너뛰고 있었다. AD10·WP1이 SB1을 선수로 요구하는데 그 선수가 로드맵에 없었다. */
 {id:1, tier:'level1', title:{ko:'자릿값과 첫 덧셈·뺄셈',en:'Place Value, First Addition & Subtraction',zh:'位值与加减法入门'},
   drills:['NS1','NS2','NS3','AD1','SB1','NS1','NS2','NS3','NS1','NS1@4'], minSessions:5, magic:[['N-06','N-07']], creative:['NL11@1','NL12@2','NL5@1']},
 {id:2, tier:'level1', title:{ko:'받아올림과 두 배 수',en:'Carrying & Doubles',zh:'进位与翻倍数'},
   /* 창의 AD9(10 이용 덧셈)는 선수 AD3가 과정 3이라 한 과정 앞서 있었다 → 과정 3으로.
      대신 문장제 사슬(WP1→WP3→WP4→WP5)의 첫 칸을 여기서 연다 — 선수 AD1·SB1이 과정 1. */
   drills:['AD2','NS5','NS4','AD2','NS5','NS4','NS4'], minSessions:4, magic:[['A-01'],['A-02']], creative:['WP1@1','WP1@2']},
 {id:3, tier:'level1', title:{ko:'두 자리 덧뺄셈 시작',en:'Two-digit ± Begins',zh:'两位数加减开始'},
   drills:['AD3','SB2','SB3','AD3','SB2@2','SB3','AD3','SB3','AD3@4','SB3','AD3@5','AD3'], minSessions:7, magic:[['A-03'],['A-04']], creative:['AD4@1','AD9@1','AD4@2','AD9@2','AD4@3','AD4@4','AD4@5']},
 {id:4, tier:'level1', title:{ko:'두 자리 올림 덧뺄셈',en:'Two-digit ± with Carrying',zh:'两位数进位加减'},
   drills:['AD5','SB4','AD6','AD5','SB4','AD6','AD5','SB4','AD6','AD5','SB4','AD6','AD5','AD6','AD5','AD6','AD5','AD6'], minSessions:9, magic:[['A-05'],['A-06'],['A-07'],['A-08'],['A-09']], creative:['AD8']},
 {id:5, tier:'level1', title:{ko:'뺄셈 마법과 구구단 첫걸음',en:'Subtraction Magic & Times Tables Begin',zh:'减法魔法与乘法口诀入门'},
   drills:['SB5','ML1','ML25','ML2','SB5','ML1','ML25','ML2','ML1','ML25','ML2','ML25','ML2','ML2'], minSessions:7, magic:[['A-10'],['A-11'],['A-12'],['B-01','B-02','B-03'],['B-04','B-05','B-06']], creative:['WP3@1']},
 {id:6, tier:'level1', title:{ko:'세 자리 뺄셈과 구구단 완성',en:'3-digit Subtraction & Full Times Tables',zh:'三位数减法与完整口诀'},
   drills:['SB6','SB7','ML3','SB6','SB7@2','ML3','SB6','ML3','SB6','ML3','SB6','ML3','SB6','SB6'], minSessions:7, magic:[['A-13'],['A-14'],['A-15'],['A-16','A-17'],['B-07','B-08','B-09'],['B-10','B-11','B-12']], creative:['AD10'], maxSessions:6},
 {id:7, tier:'level1', title:{ko:'구구단 종합과 네 자리 연산',en:'Times Tables Mix & 4-digit ±',zh:'乘法口诀综合与四位数运算'},
   drills:['ML4','AD7','ML4','AD7','AD7'], magic:[['B-13','B-14','B-15'],['A-18','A-19'],['A-20','A-21'],['A-22','A-23'],['A-24','A-25'],['C-01']], creative:['EL3@1','EL3@2','EL3@3'], maxSessions:6},
 {id:8, tier:'level1', title:{ko:'몇십 곱과 나눗셈의 시작',en:'Multiplying Tens & Division Begins',zh:'整十乘法与除法开始'},
   /* 나눗셈의 뜻 셋(DV12 등분·DV13 포함·DV14 반복 뺄셈)을 ÷2·2d÷1d 앞에 둔다(2026-09-17,
      원장 "직접 나누기·같은 수 빼기·묶어서 나누기 … 좀 제대로 생각을 할 수 있도록").
      마법 B-24(나눗셈의 세 얼굴)가 첫 세션, 창의 회차에 반복 뺄셈(나머지) 한 벌. */
   drills:['DV12','DV13','DV14','DV17','ML5','DV1','DV2','DV12','DV13','DV14','DV17@2','ML5@2','DV1','DV12','DV13','DV17@3'], minSessions:8,
   magic:[['B-24'],['B-16','B-17'],['B-18','B-19','B-20'],['A-30','A-31','A-32'],['A-33','A-34'],['C-02']],
   creative:['ML12@1','DV14@2'], maxSessions:6},
 {id:9, tier:'level1', title:{ko:'두 자리 곱셈 암산과 나머지',en:'2-digit Mental Multiplication & Remainders',zh:'两位数心算乘法与余数'},
   drills:['ML6','ML22','DV18','DV19','DV3','ML6','ML22','DV18','DV19','ML6','DV18','DV19','ML6','DV18','DV19','ML6','DV18','DV19','ML6','ML6'], minSessions:10, magic:[['B-21','B-22','B-23'],['A-26'],['A-27'],['A-29'],['C-07','C-08']], creative:['ML13@1','WP4@1']},
 {id:10, tier:'level1', title:{ko:'세 자리 곱셈과 검산',en:'3-digit Multiplication & Checking',zh:'三位数乘法与验算'},
   drills:['ML7','EL2','ML7','EL2@2','ML7','EL2@3','ML7','ML7','ML7@5'], minSessions:5, magic:[['A-28'],['A-35'],['C-06']], creative:['ML14@1','ML24@1']},

 /* 원본 중급 C-7 묶음(몇 자리 수·풀풀·폭포수·엑스맨 기초·×11·창살·격자)을 진도 자리에
    붙인다(2026-09-19, 원장 "원본의 필요 내용을 우리 로드맵 과정에 붙여야지"). C-12 엑스맨은
    중급 유닛(연습·랩·아레나가 전부 두 자리×두 자리)인데 과정 26(125주)에만 있어 짝인
    풀풀(C-10)과 67주 떨어져 있었다 — 유닛 안의 "풀풀 4조각 → 엑스맨 3조각" 비교가 그만큼
    늦게 나왔다. 원본 순서 풀풀 → 폭포수 → 엑스맨 → ×11 로 끼운다. ML21 몇 자리 수(어림)도
    원본은 이 묶음 맨 앞이라 창의 회차에 넣는다. 창살(C-14)·격자(C-30)는 세 자리×두 자리
    (과정 14)에 그대로 둔다 — 그쪽이 그 방법이 빛나는 자리다. 회차 +1(maxSessions 7). */
 {id:11, tier:'level2', title:{ko:'두 자리×두 자리 곱셈',en:'2-digit × 2-digit Multiplication',zh:'两位数乘两位数'},
   drills:['ML8','ML8','ML8','ML8','ML8','ML8','ML8'], magic:[['C-26'],['C-15'],['C-10'],['C-11'],['C-12'],['C-13'],['C-23']],
   creative:['ML21@1','ML23@1','ML15@1','ML10@1','ML10@2','ML10@3'], maxSessions:7},
 {id:12, tier:'level2', title:{ko:'나눗셈과 역연산',en:'Division & Inverse Operations',zh:'除法与逆运算'},
   drills:['DV3','DV15','DV4','EL1','DV15@2','DV4','EL1@2','DV15@3','EL1@3'], minSessions:5, magic:[['C-18']], creative:['DV9@1','WP5@1']},
 {id:13, tier:'level2', title:{ko:'분수의 첫걸음',en:'Fractions Begin',zh:'分数入门'},
   drills:['FR1','FR2'], magic:[['C-21']], creative:['FR9@1']},
 {id:14, tier:'level2', title:{ko:'대분수와 세 자리×두 자리',en:'Mixed Numbers & 3d×2d',zh:'带分数与三位乘两位'},
   drills:['FR3','ML9','FR3','ML9','ML9','ML9','ML9'], magic:[['C-14'],['C-30'],['C-16'],['C-17']], creative:['ML16@1','ML17@1','ML16@2','ML17@2']},
 {id:15, tier:'level2', title:{ko:'두 자리로 나누기와 분수',en:'Dividing by 2 Digits & Fractions',zh:'除以两位数与分数'},
   drills:['DV5','DV5','DV5','DV5'], magic:[['C-19'],['C-20'],['C-28'],['C-29']], creative:['DV10@1','DV11@1','WP3@2']},
 {id:16, tier:'level2', title:{ko:'혼합계산과 역연산',en:'Mixed Operations & Inverse',zh:'混合运算与逆运算'},
   drills:['MX1','EL1','MX1','MX1'], magic:[['C-09']], creative:['ML21@1','WP4@2']},

 {id:17, tier:'level3', title:{ko:'소수의 시작',en:'Decimals Begin',zh:'小数入门'},
   /* 창의 회차 — 이 과정의 마법(A-36~38)은 세로셈 절차라 필산 DC1과 같은 것이어서 짝이
      없었다. 보수를 소수로 이은 DC6(0.3의 1 짝꿍은 0.7)을 쓴다(2026-09-09). */
   drills:['DC1','DC1'], minSessions:4, magic:[['A-36'],['A-37'],['A-38']], creative:['DC6@1','WP5@2','DC6@2','DC6@3']},
 {id:18, tier:'level3', title:{ko:'소수 곱셈과 제곱수',en:'Decimal Multiplication & Squares',zh:'小数乘法与平方数'},
   drills:['DC2','ML11','ML11','ML11','ML11@4','ML11@5'], minSessions:7, magic:[['C-25'],['C-24'],['C-27'],['ML10'],['H-11']],
   creative:['DC4@1','ML20@3','CH11@1','DC4@2','CH11@2','CH11@3','CH11@4']},
 {id:19, tier:'level3', title:{ko:'약수와 배수, 그리고 배수 판별법',en:'Factors, Multiples & Divisibility Rules',zh:'因数、倍数与整除判别'},
   drills:['DV20','DV7','DV6','DV20@2','DV7@2','DV6','DV20@3','DV7@3','DV6@3','DV20@4','DV6@4','DV20@5','DV20@6'], minSessions:7, magic:[['C-04'],['C-34'],['C-03']], creative:['ML12@2','ML12@3']},
 {id:20, tier:'level3', title:{ko:'분모가 다른 분수와 제곱근',en:'Unlike Denominators & Square Roots',zh:'异分母分数与平方根'},
   drills:['FR4','FR5','MX4','FR4','FR5@2','MX4'], magic:[['C-22']], creative:['FR10@1','WP1@3']},
 {id:21, tier:'level3', title:{ko:'분수 곱셈과 거듭제곱',en:'Fraction Multiplication & Powers',zh:'分数乘法与乘方'},
   drills:['FR6','FR6@2','FR6@3'], magic:[['C-31']], creative:['FR11@1','WP3@3']},
 {id:22, tier:'level3', title:{ko:'분수 나눗셈',en:'Fraction Division',zh:'分数除法'},
   drills:['FR7'], magic:[['C-32']], creative:['FR12@1','WP5@3']},
 {id:23, tier:'level3', title:{ko:'수열과 분수·소수 변환',en:'Sequences & Fraction↔Decimal',zh:'数列与分数小数互换'},
   drills:['MX2','FR8','DC3','MX2@2','DC3@2'], minSessions:7, magic:[['C-05'],['C-35'],['C-33']], creative:['MX6@1','DC5@1','WP4@3','MX6@2','DC5@2','MX6@3','MX6@4']},
 {id:24, tier:'level3', title:{ko:'백분율과 비와 비율',en:'Percent, Ratio & Proportion',zh:'百分率与比例'},
   drills:['MX3','DV8','EL4','MX3@2','DV8@2','EL4','MX3@3','DV8@3','EL4@3','MX3@4','MX3@5'], minSessions:6, magic:[['H-12'],['H-13']], creative:['CH12@1','CH13@1','EL5@1','CH12@2','EL5@2','EL5@3']},
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
   drills:['ML8','ML18','ML19','ML18','ML19','ML18@3','ML18','CH1@1','CH2@1','CH1@2','CH2@2','CH2@3','CH2@4'], minSessions:7, magic:[['H-01'],['H-02'],['C-12'],['C-15']],
   creative:['CH1@1','CH2@1']},
 {id:27, tier:'challenge', title:{ko:'수의 비밀',en:'Secrets of Numbers',zh:'数的秘密'},
   drills:['DV7','DV8','MX2','DV6','CH3@1','CH4@1','CH5@1','CH6@1','CH3@2','CH4@2','CH5@2','CH6@2','CH3@3','CH4@3','CH5@3','CH6@3','CH3@4','CH4@4','CH5@4','CH6@4','CH3@5'], minSessions:11, magic:[['H-03'],['H-04'],['H-05'],['H-06']],
   creative:['CH3@1','CH4@1','CH5@1','CH6@1']},
 {id:28, tier:'challenge', title:{ko:'제곱의 산',en:'Mountain of Squares',zh:'平方之山'},
   drills:['ML11','ML20','MX4','ML11@5','ML20@2','ML20@3','ML20@4','ML20@5','ML20@6','ML20@7','ML20@8','ML20@9','CH7@1','CH8@1','CH9@1','CH10@1','CH7@2','CH8@2','CH9@2','CH10@2','CH7@3','CH9@3'], minSessions:11, magic:[['H-07'],['H-08'],['H-09'],['H-10']],
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
 /* 29 — 수직선 위의 위치(MD82)를 MD1 바로 뒤에 붙인다(2026-09-21, 원장 "정수 또는 유리수도
    위치 찾기 연습도 있어야 하고 절댓값도 위치 찾기가 되어야지"). MD1 은 절댓값을 계산만
    시켰고 수직선 위 어디인지를 묻는 자리가 없었다. */
 {id:29, tier:'middle1', title:{ko:'정수의 세계',en:'World of Integers',zh:'整数的世界'},
   drills:['MD1','MD82','MD2','MD3','CH5','MD47','MD48','MD1@2','MD82@2','MD2@2','MD3@2','CH5@2','MD47@2','MD48@2','MD1@3','MD82@3','MD2@3','MD3@3','CH5','MD47@3','MD48@3','MD1@4','MD2@4','CH5@4'], minSessions:12, magic:[['M-01'],['M-82'],['M-02'],['M-03'],['M-47'],['M-48']], creative:['MD3@3','MD82@3','MD48@3']},
 /* 30 — 일차방정식은 **푸는 법 다음에 쓰는 법**이 와야 한다(2026-09-21, 원장 "일차방정식의
    활용도 거리·속력·시간, 원가·정가 등 놓치지 마"). MD70 을 MD50 바로 뒤에 붙인다. */
 {id:30, tier:'middle1', title:{ko:'부호의 규칙과 방정식',en:'Rules of Sign & Equations',zh:'符号的规则与方程'},
   drills:['MD4','MD5','MD6','MD49','MD50','MD70','MD4@2','MD5@2','MD6@2','MD49@2','MD50@2','MD70@2','MD4@3','MD5@3','MD6@3','MD49@3','MD50@3','MD70@3','MD4@4'], minSessions:10, magic:[['M-04'],['M-05'],['M-06'],['M-49'],['M-50'],['M-70']], creative:['MD70@3','MD50@3','MD6@3']},
 /* 31 — 좌표평면(MD68)과 정비례·반비례 그래프(MD69)를 여기서 연다. 원장 "정비례 반비례는".
    MD51 은 값만 다뤘고 그래프가 없었다 — 이 둘이 뒤의 일차함수·이차함수 그래프의 바닥이다. */
  {id:31, tier:'middle1', title:{ko:'유리수·좌표와 대표값',en:'Rationals, Coordinates & Measures of Center',zh:'有理数·坐标与代表值'},
   /* MD9의 5단계와 중1-2 비기하 통계 MD84를 함께 실제 회차에 싣는다.
      MD84는 확인된 p.224~230의 대표값만 포함하며 도수표 이후는 넣지 않는다. */
   drills:['MD7','MD8','MD9','MD51','MD68','MD69','MD84','MD7@2','MD8','MD9@2','MD51@2','MD68@2','MD69@2','MD84@2','MD7@3','MD9@3','MD51@3','MD68@3','MD69@3','MD9@4','MD9@5','MD84@3','MD84@4','MD84@5','MD84@6'], minSessions:13, magic:[['M-07'],['M-08'],['M-09'],['M-51'],['M-68'],['M-69'],['M-84']], creative:['MD84@6','MD84@4','MD69@3']},

 /* 32~37 중등 재편(2026-09-21) — 원장 "한 단원씩이 아니잖아". 한 과정에 한 단원씩 서도록
    7과정 → 9과정으로 늘렸다. 중2 일차함수(34)와 중3 이차함수(37)가 새로 선 과정이고,
    부등식·연립의 활용(33)과 이차방정식의 활용(36)은 각 풀이 과정 뒤에 붙였다.
    이 두 과정을 끼우느라 고등 36~45 가 38~47 로 밀렸다(stages.js 범위도 함께 고침). */
 {id:32, tier:'middle2', title:{ko:'지수와 식의 계산',en:'Exponents & Algebraic Expressions',zh:'指数与式的运算'},
   /* 2026-09-24 — 디딤돌 개념연산 중2-1A p.98~99 대조로 MD13에 다항식÷단항식
      기본·분수 계수·세 항 집중 3레벨을 더했다. 20항목, minSessions 10. */
   drills:['MD10','MD11','MD12','MD13','MD9','MD10@2','MD11@2','MD12@2','MD13@2','MD10@3','MD11@3','MD12@3','MD13@3','MD10@4','MD10@5','MD12@4','MD12@5','MD13@4','MD13@5','MD13@6'], minSessions:10, magic:[['M-10'],['M-11'],['M-12'],['M-13']], creative:['MD13@6','MD12@5','MD10@5']},
 {id:33, tier:'middle2', title:{ko:'부등식과 연립방정식',en:'Inequalities & Systems',zh:'不等式与方程组'},
   drills:['MD14','MD64','MD71','MD63','MD72','MD14@2','MD64@2','MD71@2','MD63@2','MD72@2','MD14@3','MD64@3','MD71@3','MD63@3','MD72@3'], minSessions:9, magic:[['M-14'],['M-64'],['M-71'],['M-63'],['M-72']], creative:['MD72@3','MD71@3','MD63@3']},
 {id:34, tier:'middle2', title:{ko:'일차함수와 경우의 수',en:'Linear Functions & Counting',zh:'一次函数与情况数'},
   /* 2026-09-21 — MD74 가 5레벨(두 점 대입·절편·기울기로 둘째 점·그래프 읽기·평행이동)이 됐다.
      2026-09-24 — 중2-2 인쇄 p.216~230에서 확인한 경우의 수 5단계를 뒤에 붙인다.
      24드릴=12회차라 주2회 기준 8주, 한 학기 두 달 목표에 맞는다. */
   drills:['MD73','MD74','MD65','MD75','MD76','MD73@2','MD74@2','MD65@2','MD75@2','MD76@2','MD73@3','MD74@3','MD65@3','MD75@3','MD76@3','MD74@4','MD65@4','MD74@5','MD65@5','MD88','MD88@2','MD88@3','MD88@4','MD88@5'], minSessions:12, magic:[['M-73'],['M-74'],['M-65'],['M-75'],['M-76'],['M-88']], creative:['MD88@5','MD88@4','MD76@3']},
 {id:35, tier:'middle3', title:{ko:'제곱근의 세계',en:'World of Square Roots',zh:'平方根的世界'},
   /* 2026-09-21 — 디딤돌 개념연산 중3-1A 대조로 찾은 가장 큰 구멍을 여기에 채운다:
      MD15~17이 "정리하는 법"만 가르치고 "더하거나 빼는 법"이 아예 없었다. MD83(제곱근의
      덧셈과 뺄셈, 6레벨) 신설·편입. 16항목, minSessions 8. */
   drills:['MD15','MD16','MD17','MD83','MD14','MD15@2','MD16@2','MD17@2','MD83@2','MD15@3','MD16@3','MD17@3','MD83@3','MD83@4','MD83@5','MD83@6'], minSessions:8, magic:[['M-15'],['M-16'],['M-17'],['M-83']], creative:['MD83@6','MD83@5','MD17@3']},
 {id:36, tier:'middle3', title:{ko:'인수분해와 이차방정식',en:'Factoring & Quadratic Equations',zh:'因式分解与二次方程'},
   /* 2026-09-21 — MD20 이 4레벨(완전제곱·합차·공통인수·십자곱셈), MD66 이 1레벨(근의 공식)
      늘었다. 드릴 슬롯은 회차마다 2개뿐이라 9회차(18슬롯)로는 19개 항목이 안 들어간다 →
      minSessions 11. 늘어난 두 주는 마법 없이 이 두 스레드의 새 계단만 밟는다.
      같은 날 두 번째 편입 — 디딤돌 개념연산 중3-1A·3-1B 대조로 MD19 가 5레벨(곱셈공식의
      활용), MD66 이 3레벨(중근·근의 개수·이차방정식 구하기) 더 늘었다. 27항목,
      minSessions 14. */
   drills:['MD18','MD19','MD20','MD66','MD77','MD18@2','MD19@2','MD20@2','MD66@2','MD77@2','MD19@3','MD20@3','MD66@3','MD77@3','MD18@3','MD20@4','MD66@4','MD20@5','MD20@6','MD19@4','MD19@5','MD19@6','MD19@7','MD19@8','MD66@5','MD66@6','MD66@7'], minSessions:14, magic:[['M-18'],['M-19'],['M-20'],['M-66'],['M-77']], creative:['MD19@8','MD66@7','MD77@3']},
 {id:37, tier:'middle3', title:{ko:'이차함수와 자료 분석',en:'Quadratic Functions & Data Analysis',zh:'二次函数与数据分析'},
   /* 중3-2 비도형 자료 분석 MD85~87을 마지막 중등 과정에 연결한다. 전체 32항목이라
      주 2회 기준 8주인 16회차로 편성한다. 쉬운 갈래12, 핵심·그리기 갈래24문항. */
   drills:['MD78','MD79','MD67','MD80','MD81','MD78@2','MD79@2','MD67@2','MD80@2','MD81@2','MD78@3','MD79@3','MD78@4','MD79@4','MD67@3','MD80@3','MD81@3','MD67@4','MD85','MD85@2','MD85@3','MD85@4','MD86','MD86@2','MD86@3','MD86@4','MD86@5','MD86@6','MD87','MD87@2','MD87@3','MD87@4'], minSessions:16, magic:[['M-78'],['M-79'],['M-67'],['M-80'],['M-81'],['M-85'],['M-86'],['M-87']], creative:['MD86@6','MD87@4','MD85@4']},

 /* 38~41 실배치(2026-08-25, 고등 W11·W12; 2026-09-21 중등 두 과정을 끼우며 36~39 → 38~41): MASTER-ROADMAP.md §6.
    course38은 W10 마지막 재료 MD20을, course40(공통수학2 진입부)은
    W11 마지막 재료 MD30을 복습 풀에 얹는다(32~35와 같은 관례 —
    spec.drills에 얹으면 자기 재료로도 잡히고 이후 과정의 priorPool
    순환에도 자동으로 실린다). 2022 개정 과목명 준수 — "고1" 표기
    없음(전부 "공통수학1"·"공통수학2"). */
 {id:38, tier:'highmath1', title:{ko:'다항식과 나머지정리',en:'Polynomials & the Remainder Theorem',zh:'多项式与余数定理'},
   drills:['MD21','MD22','MD23','MD24','MD25','MD20','MD21@2','MD22@2','MD23@2','MD24@2','MD25@2','MD21@3','MD22@3','MD23@3','MD24@3','MD25@3'], minSessions:8, magic:[['M-21'],['M-22'],['M-23'],['M-24'],['M-25']], creative:['MD25@3','MD24@3','MD23@3']},
 {id:39, tier:'highmath1', title:{ko:'이차방정식과 행렬',en:'Quadratics & Matrices',zh:'二次方程与矩阵'},
   drills:['MD26','MD27','MD28','MD29','MD30','MD26@2','MD27@2','MD28@2','MD29@2','MD30@2','MD26@3','MD27@3','MD28@3','MD29@3','MD30@3'], minSessions:8, magic:[['M-26'],['M-27'],['M-28'],['M-29'],['M-30']], creative:['MD30@3','MD29@3','MD27@3']},
 {id:40, tier:'highmath2', title:{ko:'점과 직선',en:'Points & Lines',zh:'点与直线'},
   drills:['MD31','MD32','MD33','MD30','MD31@2','MD32@2','MD33@2','MD31@3','MD32@3','MD33@3'], minSessions:5, magic:[['M-31'],['M-32'],['M-33']], creative:['MD33@3','MD32@3','MD31@3']},
 {id:41, tier:'highmath2', title:{ko:'직선의 관계와 원',en:'Relations Between Lines & Circles',zh:'直线的关系与圆'},
   drills:['MD34','MD35','MD34@2','MD35@2','MD34@3','MD35@3'], magic:[['M-34'],['M-35']], creative:['MD35@3','MD34@3']},

 /* 42~45 실배치(2026-08-25, 고등 W13·W14; 2026-09-21 재번호): MASTER-ROADMAP.md §6.
    course42(대수 진입부)은 W12 마지막 재료 MD35를, course44(미적분Ⅰ
    진입부)는 W13 마지막 재료 MD42를 복습 풀에 얹는다(38·40과 같은
    관례). 2022 개정 과목명 준수 — "고3" 표기 없음(전부 "대수"·
    "미적분Ⅰ"). */
 {id:42, tier:'algebra', title:{ko:'지수와 로그',en:'Exponents & Logarithms',zh:'指数与对数'},
   drills:['MD36','MD37','MD38','MD35','MD36@2','MD37@2','MD38@2','MD36@3','MD37@3','MD38@3'], minSessions:5, magic:[['M-36'],['M-37'],['M-38']], creative:['MD38@3','MD37@3','MD36@3']},
 {id:43, tier:'algebra', title:{ko:'삼각함수와 수열',en:'Trigonometry & Sequences',zh:'三角函数与数列'},
   drills:['MD39','MD40','MD41','MD42','MD39@2','MD40@2','MD41@2','MD42@2','MD39@3','MD40@3','MD41@3','MD42@3'], minSessions:6, magic:[['M-39'],['M-40'],['M-41'],['M-42']], creative:['MD42@3','MD41@3','MD39@3']},
 {id:44, tier:'calculus1', title:{ko:'극한과 미분',en:'Limits & Derivatives',zh:'极限与导数'},
   drills:['MD43','MD44','MD42','MD43@2','MD44','MD43','MD44@3'], minSessions:4, magic:[['M-43'],['M-44']], creative:['MD44@3','MD43@3']},
 {id:45, tier:'calculus1', title:{ko:'접선과 적분',en:'Tangent Lines & Integration',zh:'切线与积分'},
   drills:['MD45','MD46','MD45@2','MD46','MD45','MD46@3'], magic:[['M-45'],['M-46']], creative:['MD46@3','MD45@3']},

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
 {id:46, tier:'algebra', title:{ko:'지수·로그방정식과 삼각법',en:'Exponential/Log Equations & Trigonometry',zh:'指数·对数方程与三角法'},
   drills:['MD52','MD53','MD54','MD55','MD56','MD57','MD42','MD52@2','MD53@2','MD54@2','MD55@2','MD56@2','MD57@2','MD52@3','MD53@3','MD54@3','MD55@3','MD56@3','MD57@3'], minSessions:10,
   magic:[['M-52'],['M-53'],['M-54'],['M-55','M-56'],['M-57']], creative:['MD57@3','MD54@3','MD56@3']},
 {id:47, tier:'calculus1', title:{ko:'극한·미분·적분 심화',en:'Advanced Limits, Derivatives & Integrals',zh:'极限·导数·积分进阶'},
   drills:['MD58','MD59','MD60','MD61','MD62','MD46','MD58@2','MD59@2','MD60@2','MD61@2','MD62@2','MD58@3','MD59@3','MD60@3','MD61@3','MD62@3'], minSessions:8,
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
      .map(d => ({ t:d.t, pin:d.pin, lv:Math.min(d.pin || 1, maxLevel(d.t)), n:4 }));
    const creEmitted = {};   /* 창의 스레드를 이미 몇 회차에 실었나 */

    let segments = spec.magic.slice();
    /* maxSessions: 과정 6·7처럼 구구 B-유닛 묶음을 얹어 5를 넘는 과정만 6까지 허용(2026-09-03) */
    /* minSessions(2026-09-20, 원장 "회차 늘려도 되지") — 그 과정의 레벨 계단을 다 밟으려면
       주가 모자란 곳이 있다. 드릴 슬롯은 회차마다 2개뿐이라 회차를 늘리는 수밖에 없다.
       늘어난 주는 마법(개념 유닛) 없이 드릴·적용만 싣는다 — 그 단원의 개념은 앞 주에서
       이미 폈고, 이 주들은 **같은 개념을 한 단계 위에서 손으로 다지는** 자리다. */
    const minSess = spec.minSessions || 0;
    const capSess = Math.max(spec.maxSessions || 5, minSess);
    const targetCount = (spec.boss || spec.comingSoon) ? 3
      : Math.min(Math.max(segments.length, 3, minSess), capSess);
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
    let queue = [];       /* 아직 안 쓴 드릴 항목 대기줄 — 비면 배열을 다시 채운다 */
    const sessions = segments.map((seg, i) => {
      let drills;
      if(perSession && perSession[i]){
        drills = perSession[i].map(parsePin).filter(d => NM_THREADS[d.t])
          .map(d => ({t:d.t, lv:Math.min(d.pin || 1, maxLevel(d.t)), n:6}));
      } else {
        /* 배열을 **줄 세워 꺼낸다**(2026-09-20). 처음엔 커서 한 개로 훑었는데, 짝이 될
           다른 스레드를 찾다가 배열 끝을 넘어 되감기면 커서가 **뒤로 밀려** 뒷쪽 항목이
           영영 안 나왔다 — 과정 28 에서 ML20@5·@7·@8·@9 가 그렇게 묻혔다.
           이제 남은 항목을 대기줄로 들고, 앞에서부터 하나(A)를 꺼낸 뒤 그 뒤에서 짝(B)을
           꺼낸다. 둘 다 줄에서 빠지므로 **배열에 실은 항목이 모두 한 번씩** 나온다.
           짝은 다른 스레드를 먼저 찾고, 없으면 같은 스레드라도 **레벨이 다른** 항목을 쓴다 —
           한 과정이 한 스레드의 긴 계단으로 이뤄지면(과정 28 의 ML20 은 9레벨) 다른 스레드가
           모자라 주마다 드릴이 하나로 줄었다. 막아야 하는 것은 "같은 유형이 같은 레벨로 두 벌"
           찍히는 것이지, 한 주에 한 단계씩 오르는 것이 아니다. */
        if(!queue.length) queue = ownDrills.slice();
        const ownA = queue.shift();
        let ownB = null;
        for(let k = 0; k < queue.length; k++){
          if(queue[k].t !== ownA.t){ ownB = queue.splice(k, 1)[0]; break; }
        }
        if(!ownB){
          for(let k = 0; k < queue.length; k++){
            if(queue[k].lv !== ownA.lv){ ownB = queue.splice(k, 1)[0]; break; }
          }
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
      /* 창의 회차는 세션마다 하나씩 순환 — 한 주 학습지에 필산 뒤 창의 한 벌.
         레벨은 드릴과 같은 규칙으로 회차마다 한 칸씩 오른다(2026-09-20, 원장 "창의연산도
         개념 명확해야돼"). 전에는 늘 레벨 1이라, 그 스레드가 가진 다른 레벨의 기술
         (ML20 차가 2·4·6…, CH3 진법 변환·이진 곱셈)은 학습지에 한 번도 안 나왔고
         개념 설명만 그 기술을 말하고 있었다 — 설명과 문항이 어긋났다.
         창의 레벨은 여전히 필산 사다리(homeLevel·priorPool)와 섞지 않는다. */
      let cre = [];
      if(creative.length){
        /* 그 주 드릴과 **같은 유형·같은 레벨**이면 다음 적용 항목으로 넘어간다(2026-09-20).
           중·고 과정은 적용을 그 과정의 마지막 레벨로 박아 두는데, 드릴 계단도 끝에서
           같은 레벨에 닿으므로 한 학습지에 같은 것이 두 벌 실렸다. */
        for(let k = 0; k < creative.length; k++){
          const cand = creative[(i + k) % creative.length];
          const lv = cand.pin != null ? cand.lv
            : climbLevel(cand.t, cand.lv, creEmitted[cand.t] || 0);
          let useLv = lv;
          if(drills.some(d => d.t === cand.t && d.lv === useLv)){
            if(k < creative.length - 1) continue;
            /* 적용 항목이 하나뿐이라 넘어갈 데가 없으면, 그 유형의 **다른 레벨**로 바꾼다.
               그것도 없으면 이 주는 적용 회차를 비운다 — 같은 것을 두 벌 내는 것보다 낫다. */
            const alt = (NM_THREADS[cand.t].levels || []).map(l => l.id)
              .filter(id => !drills.some(d => d.t === cand.t && d.lv === id)).pop();
            if(alt == null) break;
            useLv = alt;
          }
          creEmitted[cand.t] = (creEmitted[cand.t] || 0) + 1;
          cre = [{ t:cand.t, lv:useLv, n:cand.n }];
          break;
        }
      }
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
