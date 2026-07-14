# Numbers of Magic — 학습모드(로드맵) 전면 재설계 문서

> 작성: 2026-07-14 (브랜치 `claude/patch-number-magic-map-4ow1mr`)
> 목적: "지금은 시험 같다 → **배우는 앱**으로" 사용자 지시의 구현 설계.
> 이 문서만 읽으면 다른 세션/모델이 그대로 구현할 수 있도록 작성함.

---

## 0. 사용자 요구 (원문 요지)

1. **개념 설명을 더 쉽고 친절하게** — "2×3+2×4는 사과 2개들이 봉지 3개와 4개를
   더하면 봉지 7개" 같은 **문장(이야기) 설명** 또는 **넓이 그림**으로. 게임처럼 친절하게.
2. **창의수연 난이도가 널뛴다 → 정교하게 조정**. 초급/중급/고급 자유선택은 유지하되,
   **"학습모드" 로드맵**을 신설: 처음엔 수 범위가 작고 → 연산이 확장되고 → 높은 단계로
   자연스럽게 이어지는 하나의 길. 초급·중급 개념이 과정에 따라 **섞여도 좋음**.
3. 배우도록 만들 것 — 문제만 나오는 시험이 아니라, 학습이 되게.

---

## 1. 이번 세션까지 완료된 것 (커밋됨)

- `data/curriculum.js` — ADVANCE 티어 재설계: 구구 A~H(B-01~B-23 유지) + 창의수연
  중급 A~F(C-01~C-25). 총 14레벨.
- `engine/threads/ml.js` — 신규 생성기 17종 추가·검증(200시드 퍼즈 테스트 통과):
  `ml_pair10, ml_gauss, ml_x9, ml_overmul, ml_digit_pred, ml_x11, ml_placeshift,
  ml_x5, ml_x25, ml_div_decomp, ml_div_simplify, ml_div_expand, ml_frac_same,
  ml_frac_diff, ml_veda, ml_diff2sq, ml_decimal_mul`
  + KaTeX 한글은 `\text{}`로 감쌈 + `ml_decimal_mul` 부동소수점 오차 수정(a/div, a*mul).
- `data/units/C-01.js ~ C-25.js` — 25개 유닛(3개 언어, discover 3스테이지, check,
  lab, arena, stamp, voice). 구조 검증 완료(25/25 등록, 생성기 참조 유효).
- `index.html` — C-01~C-25 script 태그 추가.

---

## 2. 발견된 치명적 결함 (구현 시 최우선 수정)

### 2-1. NM_TGEN ↔ 앱 브리지 부재 (버그, ADVANCE 티어 전체가 앱에서 작동 불가)
- `app/main.js:12` → `const GEN=window.NM_GEN` 인데, B/C 유닛의 generator
  (`ml1_double`, `ml_gauss` 등)는 **`window.NM_TGEN`에만** 등록됨(engine/threads/*).
- main.js의 6개 호출부(`786, 812, 953, 981, 1036, 1075`)가 `GEN[cfg.generator]({level})`
  로 직접 호출 → ADVANCE 유닛 진입 시 `undefined is not a function` (origin/main도 동일).
- **또한 유닛의 `params`(mode:'div', target:100, easy:false…)가 전혀 전달되지 않음.**

**수정 설계** — main.js에 헬퍼 하나 추가, 6개 호출부를 교체:
```js
function genProblem(cfg, level){
  const g = GEN[cfg.generator];
  if (g) return g({ level });                       // 레거시 NM_GEN
  const tg = (window.NM_TGEN||{})[cfg.generator];   // 스레드 생성기
  if (tg){
    const rng = NM_RNG.mulberry32((Math.random()*2**31)|0);
    return tg(Object.assign({ level }, cfg.params||{}), rng);
  }
  return null; // + 화면에 "생성기 없음" 안내
}
// 호출부: GEN[cfg.generator]({level:'practice'}) → genProblem(cfg,'practice')
//        GEN[u.lab.generator]({level:'main'})    → genProblem(u.lab,'main')
//        arena 동일. (u.practice/u.lab/u.arena 객체를 그대로 넘긴다)
```
- index.html에서 rng.js가 generators.js보다 늦게 로드되므로 main.js 시점엔 NM_RNG 존재. OK.

### 2-2. 소수점 입력 불가
- `buildNumpad`(main.js & widgets.js 두 곳)에 `.` 키 없음. steps 위젯은
  `parseInt(inp,10)===s.blank` (widgets.js:401) → 소수 blank는 영원히 오답.
- 영향: `ml_decimal_mul`(C-25) mul 모드(답 4.3 등), C-25 check fill(3.8).

**수정 설계**:
1. `buildNumpad(pad, cb, opts)` 에 `opts.decimal` 추가 → 키 배열을
   `['1'..'9','.','0','del','ok']` 아님 — 12칸 유지가 어려우므로 **13키**:
   `['1','2','3','4','5','6','7','8','9','.','0','del','ok']` + CSS에서
   `.nm-numpad.dec{grid-template-columns:repeat(4,1fr)}` 로 4열 전환(13키 → 4×3+1,
   마지막 ok를 `grid-column:span 2`). 두 파일(main.js, widgets.js) 동일 적용.
2. 비교는 `parseFloat(inp)===Number(blank)` 로 통일(정수는 기존과 동일 동작).
3. decimal 필요 여부 판정: `!Number.isInteger(cur.answer)` 또는
   `cur.steps?.some(s=>!Number.isInteger(s.blank))` 또는 `cur.answerType==='decimal'`.
4. C-25의 check fill은 이미 소수 답(3.8) — 넘패드 수정 후 그대로 사용 가능.
   (수정 전 임시 회피가 필요하면 fill을 `3.8÷0.1=38`류 정수 답으로 교체)

### 2-3. `nextStepKey`/unitFlow 는 문제 없음 — flow는 CUR.unitFlow 고정 6단계.

---

## 3. 학습모드(로드맵) 설계 — 핵심 신기능

### 3-1. 철학
- 기존 티어(BASIC/PRIME/ADVANCE/CHALLENGE) 자유선택은 **그대로 유지**.
- 학습모드는 **추천 순서로 꿴 하나의 길**: 잠금 없음(자유선택 원칙),
  대신 "다음 걸음" 하이라이트 + 이어서 학습 배너.
- 난이도 축 3개를 순서대로 올린다: ①수 범위(한 자리→두 자리→세 자리)
  ②연산 종류(덧→뺄→곱→나눗→분수/소수) ③전략 수준(직접계산→분해/조합→창의 전략).

### 3-2. 데이터 — `data/roadmap.js` (신규)
```js
window.NM_ROADMAP = {
  id:'main-road',
  title:{ko:'마법 학습 여행',en:'Magic Learning Journey',zh:'魔法学习之旅'},
  chapters:[ // 챕터 = 지도 위 한 "지역". 유닛은 기존 유닛 재사용(중복 데이터 없음)
    { id:'R1', icon:'🌱', theme:'작은 수와 친해지기',
      units:['A-01','A-02','A-03','A-04'] },                  // 10만들기·가르기 (수범위 ~10)
    { id:'R2', icon:'➕', theme:'덧셈 마법 배우기',
      units:['A-05','A-06','A-07','A-08','A-09'] },           // 받아올림 전략 (~두자리)
    { id:'R3', icon:'➖', theme:'뺄셈 마법 배우기',
      units:['A-10','A-11','A-13','A-14'] },                  // 뺄셈 기초+심화 핵심만
    { id:'R4', icon:'🔢', theme:'큰 수로 넓히기',
      units:['A-17','A-22','A-30','A-31'] },                  // 두~세자리 덧뺄셈·자릿값
    { id:'R5', icon:'✖️', theme:'곱셈의 시작 — 배와 묶음',
      units:['B-01','B-02','B-03','B-04','B-05','B-06'] },    // 배/반, 2·5단
    { id:'R6', icon:'🎲', theme:'구구단 완성',
      units:['B-07','B-10','B-13','B-16','B-17'] },           // 3·6/4·8/7·9단+총정리
    { id:'R7', icon:'💫', theme:'곱셈 넓히기 — 몇십·몇백',
      units:['B-18','B-19','B-20','B-21','B-22','B-23'] },
    { id:'R8', icon:'🔺', theme:'쌍과 거듭제곱의 마법',
      units:['C-01','C-02','C-03','C-04'] },                  // 창의수연 A
    { id:'R9', icon:'🧠', theme:'수를 요리하는 전략',
      units:['C-05','C-06','C-07','C-08'] },                  // 가우스·×9·분배·올림빼기
    { id:'R10', icon:'🌸', theme:'창의 곱셈 6검법',
      units:['C-09','C-10','C-11','C-12','C-13','C-14'] },
    { id:'R11', icon:'✋', theme:'5·25·자리이동의 지름길',
      units:['C-15','C-16','C-17'] },
    { id:'R12', icon:'🪓', theme:'나눗셈 3형제',
      units:['C-18','C-19','C-20'] },
    { id:'R13', icon:'🍕', theme:'분수와 소수의 세계',
      units:['C-21','C-22','C-25'] },
    { id:'R14', icon:'🏆', theme:'마스터의 길',
      units:['C-23','C-24','A-35'] }                          // VEDA·차이곱(+로마숫자 보너스)
  ]
};
```
- **초급·중급이 섞이는 지점**: R4(초급 자릿값)→R5(중급 구구)→R8부터 창의 전략,
  R13에서 초급 I단계 소수(A-36~38 활용 가능)와 중급 분수·소수 합류.
- 유닛 중복 배치 허용(티어 화면과 로드맵 양쪽에서 접근) — 진도는 기존
  `S.stamps`/`stepDone` 공유이므로 어느 쪽에서 완료해도 동기화.

### 3-3. UI — main.js
1. **마을 화면에 "학습모드" 건물/버튼 추가** (`screenTown` 내). 기존 등급 카드 위에
   크게 "🗺️ 학습 여행 — 이어서 하기: {다음 유닛 제목}" 배너.
2. **`screenRoadmap()` 신규**: 세로 스크롤 "징검다리 길" —
   챕터 헤더(테마+아이콘) 아래 유닛 돌들이 지그재그(`nm-road-stone`).
   - 완료 돌: ⭐ + 금색. 다음 추천 돌: 펄스 애니메이션 + "여기부터!".
   - 이후 돌: 흐리게(잠금 아님 — 탭하면 "먼저 앞 걸음을 추천해요, 그래도 할래?" 확인 후 진입).
3. **진입**: 돌 탭 → 기존 `S.view='unit'` 플로우 그대로 재사용(`S.unit=unitId`).
   유닛 완료(도장) 시 로드맵 복귀면 다음 돌로 카메라 스크롤 + confetti.
4. **상태**: `S.roadmap={lastUnit:'C-05'}` 정도만 저장. 다음 추천 = chapters 순서상
   첫 미완료 유닛.
5. CSS: `.nm-road-*` 클래스 신규 (styles.css). 지그재그는 flex + nth-child margin.

### 3-4. 난이도 그라데이션 — 생성기 level 지원
새 생성기 17종은 현재 `params.level`을 무시함. 다음 표대로 반영
(`const lv=params.level||'main'`, practice = 작은 수):

| 생성기 | practice | main |
|---|---|---|
| ml_pair10 | b=2~5 | b=2~9(현행) |
| ml_gauss | n=6~10(짝수) | n=6~20(짝수, 현행) |
| ml_x9 | n=2~12 | n=13~99 |
| ml_overmul | round=10만, a=2~9 | round∈{10,100}(현행) |
| ml_digit_pred | a,b=11~31 | 11~49(현행) |
| ml_x11 | 올림 없는 a(합<10) 우선 | 전체(현행) |
| ml_placeshift | a=11~29 | 11~49(현행) |
| ml_x5/x25 | 몫/인수 절반 범위 | 현행 |
| ml_div_decomp | b=2~5, 몫 2자리 | 현행 |
| ml_div_simplify | 쉬운 쌍 부분집합 | 현행 |
| ml_div_expand | x2만 | x2/x4(현행) |
| ml_frac_same/diff | 분모 3~6 | 현행 |
| ml_veda | a,b=11~31 | 11~49(현행) |
| ml_diff2sq | n=5~10 | 5~20(현행) |
| ml_decimal_mul | shift=1만 | 1~2(현행) |

- 기존 ml1~ml11도 `params.max` 등을 받으므로 브리지(2-1)로 params가 흐르면
  유닛별 조정 가능(예: B-21 practice에 `params:{max:39}`).

---

## 4. 디스커버(개념 설명) 친절화 — 이야기+넓이 우선

### 원칙 (모든 신규/수정 콘텐츠에 적용)
1. **스테이지 ①은 반드시 구체물 이야기로 시작** — 사과 봉지, 사탕, 피자, 동전, 타일.
   수식은 이야기 뒤에. (예: 분배법칙 = "사과 2개들이 봉지가 아침에 3봉지, 점심에
   4봉지 왔어요. 봉지는 모두 7개 → 사과는 2×7=14개! 이게 2×3+2×4=2×(3+4)의 비밀")
2. **스테이지 ②는 그림(넓이/배열)** — mathSteps에 그림 묘사 한 줄 포함,
   가능하면 widget 'array' 활용 유닛과 연결.
3. **스테이지 ③에서 수식 일반화 + 즉시 해보기.**
4. 말투: 시험 아님. "~해요/~해봐!" + 누미의 응원. 실패해도 힌트 먼저.

### 우선 수정 대상 (이미 만든 C 유닛 중 추상 시작인 것)
- C-07(분배) — 위 사과 봉지 이야기로 ① 교체 《사용자 예시 그대로》
- C-02/C-04(쌍곱) — "2명씩 5줄 = 10명" 교실 줄서기 이야기
- C-06(×9) — 달걀판(10구멍)에서 1개 빠진 이야기
- C-08(올림빼기) — 마트 990원 계산 이야기(1000원 내고 거스름)
- C-16(×5) — 반 나누기: 사탕 절반 이야기
- C-18(분해 나눗셈) — 사탕 300+12개를 3명이 나누기
- 나머지(C-05 가우스 일화, C-10 넓이, C-14 격자, C-21 피자, C-24 타일)는 이미 구체적 — 유지.

---

## 5. 구현 순서 (다음 세션 체크리스트)

1. [ ] **브리지 수정** (2-1) — main.js `genProblem` + 6개 호출부. ★최우선, 이것 없이는 B/C 유닛 전부 깨짐
2. [ ] **소수점 입력** (2-2) — buildNumpad×2 + parseFloat 비교 + CSS
3. [ ] **생성기 level 그라데이션** (3-4) — ml.js 17종에 practice 분기
4. [ ] **roadmap.js 신규** (3-2) + index.html script 추가
5. [ ] **screenRoadmap UI** (3-3) — main.js + styles.css `.nm-road-*`
6. [ ] **디스커버 친절화** (4) — C-07, C-02, C-04, C-06, C-08, C-16, C-18 우선
7. [ ] 검증: node 퍼즈(이미 스크립트 있음, 3-4 후 재실행) + Playwright로
   학습모드 진입→R5 유닛 1개 완주→다음 돌 추천 확인
8. [ ] main 병합은 사용자 허가 후

## 6. 검증 스니펫 (재사용)

```bash
cd number_magic
# 생성기 퍼즈: 이 문서 커밋 기준 세션에서 사용한 것과 동일
node -e "global.window={};require('./engine/rng.js');global.NM_RNG=window.NM_RNG;global.NM_TGEN=window.NM_TGEN;require('./engine/threads/ml.js'); /* … 200시드 루프 … */"
# 유닛 등록: 25/25 + 생성기 참조 검사 (세션 로그 참고)
```
