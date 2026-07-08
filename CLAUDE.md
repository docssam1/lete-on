# Gfield Reading Town — Project Memory

> 이 파일은 Claude의 세션 간 기억 대체용입니다. 세션 시작 시 반드시 읽으세요.
> Last updated: 2026-07-07

---

## 프로젝트 개요

**Gfield Reading Town** — 초등학생 대상 영어 독해 학습 웹앱.  
GitHub Pages 배포: `docssam1/lete-on` 저장소 → `/reading-world/` 경로.  
현재 v41. 단일 HTML 파일 앱 (SPA, no build tool, vanilla JS).

운영 URL: `https://docssam1.github.io/lete-on/reading-world/`

---

## 보안 제약 (절대 위반 금지)

**라이선스 원본 지문(licensed passages)은 절대 공개 git 저장소에 올리면 안 됩니다.**

- CARS 교재 원본 지문 → **Supabase `lesson_content` 테이블에만** 저장
- git에는 창작(extra learning) 지문만 허용
- `.gitignore`에 원본 관련 파일 등록됨

---

## 디렉토리 구조

```
/reading-world/
  index.html          — 단일 진입점, 모든 JS를 순서대로 로드
  app/
    main.js           — 앱 전체 렌더링 + 상태 관리 (가장 큰 파일)
    store.js          — localStorage + Supabase 동기화 어댑터
    styles.css        — 전체 스타일
    town-game.js      — Phaser 3 타운 게임 엔진
    game-store.js     — 코인/장식/레벨 상태 관리
  data/
    lesson1.js~lesson10.js    — CARS Level B (원본문항은 Supabase에만)
    lesson1.original.js       — Level B lesson1 원본 백업 (로컬용)
    lc1.js~lc10.js            — CARS Level C (창작 지문만 포함)
    avatar.js                 — 아바타 파츠 데이터
    decorations.js            — 타운 장식 아이템 목록
    decor-art.js              — 장식 아트 SVG/data-URI
    video-plan.js             — Screen Quest 영상 플레이리스트
  assets/images/
    cars-level-b/             — Level B 레슨 커버 이미지
    cars-level-c/             — Level C 레슨 커버 이미지 (현재 placeholder PNG)
  vendor/
    phaser.min.js             — Phaser 3 (타운 게임)
```

---

## 두 가지 책 시리즈

### CARS Level B (`bookId: 'cars-level-b'`)
- `lesson1` ~ `lesson10` (파일: `lesson1.js` ~ `lesson10.js`)
- 원본 지문: Supabase `lesson_content` 테이블 (`book_id='cars-level-b'`, `lesson_id='lesson1'`~`'lesson10'`)
- 창작 콘텐츠: extraLearning(STEP 4) + newPassage(STEP 5)

### CARS Level C (`bookId: 'cars-level-c'`)
- `lc1` ~ `lc10` (파일: `lc1.js` ~ `lc10.js`)
- 원본 지문: Supabase `lesson_content` 테이블 (`book_id='cars-level-c'`, `lesson_id='lc1'`~`'lc10'`)
- 창작 콘텐츠: extraLearning + newPassage (모두 js 파일에 포함)

### Level C 레슨 목록 — 실제 원본 지문 (2026-07-08 재정렬 완료)
> ⚠️ 레슨 제목 = **실제 교재 원본 제목**. 창작 콘텐츠(extraLearning/newPassage)는
> 원문의 주제·인물·형식을 이어가고 **원문 길이에 맞춰** 재작성됨. 이전의
> "The Great Migration / Inside a Volcano …" 테마 표는 **폐기**(원문과 무관했음).

| # | 원본 제목(교재, Supabase) | 형식·주제 | 원문 길이 |
|---|---------------------------|-----------|-----------|
| lc1 | Family Barbecue | 이메일 · 가족 바비큐 | ~269w |
| lc2 | A Fable About Friendship | 우화 · 새와 애벌레의 우정 | ~279w |
| lc3 | Owls | 논픽션 · 올빼미의 사냥 | ~348w |
| lc4 | Harry's Holiday Journal | 일기 · 휴가지 선택 | ~373w |
| lc5 | To the Skies! | 논픽션 · 비행의 역사 | ~305w |
| lc6 | The Hungry Spider | 민담 · 욕심 많은 거미 | ~570w |
| lc7 | The Truth About Science | 생활문 · Grace의 과학 발견 | ~517w |
| lc8 | 51 Oak Street | 편지 · 삼촌의 낙농장 | ~614w |
| lc9 | Kate's Cat Corner | 조언 칼럼(Q&A) · 고양이 돌봄 | ~787w |
| lc10 | The Helpless Helper | 생활문 · Robin과 숙제 | ~550w |

- **extraLearning** = 원문의 같은 주제/인물/형식을 이어가는 창작 지문 + 12문항 (git)
- **newPassage** = 원문 핵심 어휘 12개를 쓰는 같은 레벨의 새 이야기 + 12문항 (git)
- 어휘 12개 = 실제 원문에서 추출 · 레슨 커버 = 실제 교재 삽화(`assets/images/cars-level-c/illustrations/lcN.jpg`)

---

## 학습 흐름 (STEP 1~7)

```
STEP 1 — 단어 학습 (Vocab, 12개)
STEP 2 — 원본 지문 읽기 (originalRead) — Supabase에서 pull
STEP 3 — 원본 문항 풀기 (questions, 'original' mode) — Supabase에서 pull
STEP 4 — 추가 학습 지문 (originalExtra / extraLearning)
STEP 5 — 추가 문항 (questionOriginalExtra)
STEP 6 — 유사 지문 (similar / newPassage)
STEP 7 — 유사 문항 (questionSimilar)
→ Report (오답·전략별 결과)
```

---

## 12가지 CARS 전략 (문항 Q1~Q12 고정 순서)

1. Finding Main Idea
2. Recalling Facts and Details
3. Understanding Sequence
4. Recognizing Cause and Effect
5. Comparing and Contrasting
6. Making Predictions
7. Finding Word Meaning in Context
8. Drawing Conclusions and Making Inferences
9. Distinguishing Between Fact and Opinion
10. Understanding Author's Purpose
11. Interpreting Figurative Language
12. Distinguishing Between Real and Make-believe

---

## 문항 데이터 형식

```js
// JS 파일 내 questions 배열 형식:
['strategyName', 'questionText',
  ['choiceA', 'choiceB', 'choiceC', 'choiceD'],
  'correctLetter',   // 'A' | 'B' | 'C' | 'D'
  'explanation']
```

### 정답 분포 요건 (중요!)
- 각 12문항 세트: 정확히 **3A / 3B / 3C / 3D**
- lc1~lc10 전체 240문항: 60A / 60B / 60C / 60D
- **2026-07-08 Level C 전면 재작성**: 실제 원문에 정렬 + 원문 길이로 재생성.
  각 세트는 여전히 3A/3B/3C/3D를 만족하지만 **고정 순서 패턴은 폐기** —
  이제 레슨마다 정답 순서가 자유롭게 섞여 있고 분포만 3/3/3/3으로 유지됨.
  (이전의 레슨별 고정 순서 표는 옛 콘텐츠용이라 삭제함.)

---

## Supabase 설정

- **URL**: `https://fgahqumaldheqettmvqg.supabase.co`
- **Anon key**: `eyJhbGci...RAqs` (store.js에 있음, 공개 가능)
- **테이블 1: `readers`** — 학생 진행상황 저장 (student_id, name, book_id, lesson_id, data)
  - ⚠️ `remoteUpsert()`에 `book_id: 'cars-level-b'`, `lesson_id: 'lesson1'` 하드코딩 버그 있음 (낮은 우선순위)
- **테이블 2: `lesson_content`** — 라이선스 원본 지문/문항 (절대 git에 올리면 안 됨)
  - 컬럼: `book_id`, `lesson_id`, `original_passage` (text[]), `original_questions` (jsonb)
  - `Store.pullOriginal(bookId, lessonId)` 로 조회

---

## 앱 상태 구조 (main.js)

```js
let st = {};           // 현재 레슨 상태 (view, lang, known, original, ...)
let profile = null;    // 학생 전체: { lessons:{lessonId:st}, points, lang, town, ... }
let currentStudent;    // { id, name }
let currentBookId;     // 'cars-level-b' | 'cars-level-c'
let currentLessonId;   // 'lesson1'~'lesson10' | 'lc1'~'lc10'
let townView = 'map';  // 'map' | 'closet' | 'game' | 'pick' | 'screen'
```

### st.view 값들
`home`, `words`, `originalRead`, `questions`, `questionOriginalExtra`, `questionSimilar`, `review`, `originalExtra`, `similar`, `report`

---

## 포인트/보상 시스템

- `awardPoints(n, msg)` — 코인 추가 + toast 알림
- `GameStore.coins(profile)` — 현재 코인
- `GameStore.spendCoins(profile, cost)` — 장식 구매
- `rewardPoints: { lessonComplete: 40 }` — 각 레슨 완료 시 40P
- 상단 바에 `★ XP` 표시

---

## 타운 게임 (Phaser 3)

- `town-game.js` — Phaser 3 기반 2D 타운 맵
- `game-store.js` — 코인/언락/장식 배치 상태
- D-pad 이동 (모바일: 맵 아래에 위치)
- 건물 클릭 → 학습 진입
- Screen Theater 건물 → Screen Quest
- 장식 슬롯 구매/배치 (closet 화면)

---

## Screen Quest (영상 극장)

- `data/video-plan.js` — 영상 플레이리스트 정의
- Amazing Animals / Wonder List 플레이리스트
- 영상 시청 후 퀴즈 → 통과 시 코인 획득
- `profile.screenQuest.passed` 에 통과 기록

---

## 아바타 / 커스터마이즈

- `data/avatar.js` — 아바타 파츠. 카테고리(`AVATAR.categories`): 피부·머리모양·머리색·
  **얼굴(표정)**·상의·**하의**·모자·안경·펫·배경. `closet()`가 카테고리 배열을 그대로
  순회해 탭·상점을 그리므로 새 카테고리 추가 시 UI 코드 수정 불필요(데이터만 추가).
- **얼굴(표정) 카테고리** ✅ 추가됨 (2026-07-08). `main.js`의 `FACE_DEFS`(웃음·활짝웃음·
  윙크·놀람·파이팅·시크·졸림·메롱·반짝반짝 9종)를 `renderAvatar()`가 `eq.face`로 조회해
  눈·눈썹·입·블러시를 조합. 전부 원본 기하 도형(SVG path/circle)만 사용 — 어떤 라이선스
  데칼·로고도 베끼지 않아 상표권 문제 없음. 기본값 `happy`는 기존 고정 얼굴과 픽셀 단위
  동일(검증됨) → 기존 프로필 시각적 회귀 없음.
- **하의 카테고리** ✅ 추가됨 (2026-07-08). 기존엔 바지 색이 `renderAvatar()`에 하드코딩
  (`PANTS='#3f4d66'`)돼 있어 선택 불가였음. `AVATAR.categories`에 `bottom`(네이비·회색·
  검정·카키·데님·와인) 추가, 렌더러가 `eq.bottom`으로 조회. `clothes` 카테고리 표시명을
  "옷"→"상의"(Top)로 변경(하의와 짝 맞춤, `key`는 하위호환 위해 `clothes` 그대로 유지).
- `data/decorations.js` + `decor-art.js` — 타운 장식 아이템
- `townCloset()` — 아바타/타운 커스터마이즈 화면 (탭으로 전환)

---

## 부모 대시보드

- `parentDashboard()` — 전략별 약점, 레슨별 점수 표시
- `townView === 'parent'` 로 진입
- 비밀번호 없이 접근 가능 (내부 도구)

---

## 다국어 지원

- 한국어 / English / 中文 (3개 언어)
- `st.lang` — 현재 선택 언어
- 모든 UI 텍스트에 3개 언어 분기 존재

---

## 개발 브랜치

```
main: main (GitHub Pages 자동 배포, 직접 작업)
```

- 작업은 `main` 브랜치에 직접 커밋·푸시
- PR 없이 즉시 GitHub Pages 반영

---

## 알려진 버그 / 미완성 항목

| 항목 | 심각도 | 설명 |
|------|--------|------|
| ~~`store.js` remoteUpsert 하드코딩~~ | ✅ 수정됨 (2026-07-08) | `remoteMeta(data)`가 프로필의 `currentBookId`·최근 학습 레슨(updatedAt 최대)에서 `book_id`/`lesson_id`를 도출 → analytics 컬럼이 실제 학습 반영 |
| ~~Level C 커버 이미지~~ | ✅ 해결됨 (2026-07-08) | 실사 삽화 `cars-level-c/1.png`~`10.png` 적용(lcN→N.png). 옛 placeholder·illustrations/jpg 삭제 |

---

## 적응형 학습 — 스킬 코치 (Skill Coach) ✅ 구현됨 (2026-07-08)

Raz-Plus "Level Up!" 참고 + 로드맵 스펙 구현. 자체 모듈(`main.js`,
`coachScreen/handleCoach/startCoach/finishCoach`, 상태 `st.coach`, `st.view==='coach'`).
CSS `.cch-*`, 진입 버튼 `data-act="coach-start"`(midReport·리포트홀).

```
원본문항 채점 → st.original.missed(약한 전략) 확인
  ↓  (dispatch: bind()에서 act.slice(0,6)==='coach-' → handleCoach)
전략 큐 = 틀린 전략들(전략명 dedup). 각 전략마다:
  intro  — 전략 해설(stratInfo.m 왜 틀렸나 / .t 이렇게) 
  q1     — 같은 전략 유사문제 = L.originalExtraQuestions[i] (추가학습 지문+문항)
           정답 → mastered / 2회 오답 → 정답·해설 공개
  q2     — 그래도 틀리면 새 지문 같은 전략 문제 = L.extraQuestions[i]
           정답 → partial / 오답 → struggled(단어 복습 권유)
  ↓
done   — struggled=0 이면 "레벨 업! 🏆", 아니면 "한 걸음 성장! 💪"
         코인 = mastered*8 + partial*5, st.coachCleared/st.coachStars 저장
```
- 핵심: 문항 index i = 전략 i 고정순서라, 원본 오답 index로 추가/새지문의
  **같은 전략 문항**을 지문째 자동 소환(Supabase 불필요, 전부 git 데이터).

### 크로스-레슨 진도 + Level Up (2026-07-08, 격려용 · 잠금 없음)
> ⚠️ 사용자 지시: **책은 난이도와 무관하게 자유 선택**. 레벨업은 보상일 뿐
> 절대 다음 레벨을 잠그지 않음. Study House 사다리도 난이도 안내일 뿐 게이트 아님.
- `lessonMastery(id)`→{stars 0~3,done}: similar.score/coachCleared/coachStars로 별점.
- `bookMastery(bookId)`→{done,total,pct,complete,stars}: 레슨 진도 집계.
- 표시: 레슨 스톱·Study House 레슨픽커에 별점(`starDots`), Study House 책카드에
  진도바(`_bookProgressHtml`) + "완주 ⭐" 리본. 사다리 서브노트=자유선택 안내.
- **Level Up 오버레이**(`maybeLevelUp`/`flushLevelUp`, `profile.pendingLevelUp`):
  한 책의 전 레슨 done→최초 1회 축하(+50코인, `profile.levelUps[bookId]`).
  다음 레벨을 **추천만** 하고 "아무 레벨이나 골라도 좋아요" 명시. 트리거:
  `grade('similar')`·`finishCoach`·로그인(`enterStudent`)·`boot`. CSS `.lu-*`.
- **누적 전략별 약점 랭킹** ✅ 구현됨 (2026-07-08). `cumulativeStrategyStats()`가
  `profile.lessons`의 모든 레슨 × 모든 책 × 3단계(original/originalExtra/similar =
  STEP3/5/7)를 합산. 문항 index는 항상 고정 전략 순서(`CANON_STRATS`)이므로 레슨별
  문항 재로딩 없이 저장된 `{score,missed}`만으로 계산 — Supabase 원본을 다시 안 불러도
  됨. 부수 효과로 기존 버그도 고침: 옛 `parentStats().strat`는 `buildRuntimeLesson(id)
  .originalQuestions`(레슨1만 정적 보유, 나머지는 Supabase 전용이라 항상 빈 배열)에
  의존해 **lesson1 외 모든 레슨의 STEP3 약점이 조용히 누락**되고 있었음. 부모 대시보드
  "누적 전략별 약점 랭킹" 섹션에 순위 배지(`.pd-rank`)로 표시, 완전히 익힌 전략은 태그로.
  자기 낭독 녹음(fluency)은 사용자 지시로 진행 안 함(불편함).

### 리딩 진단 테스트 (Placement) ✅ 구현됨 (2026-07-08)
CARS & STARS Plus Placement Book 구조 참고(라이선스 원문은 git 금지 → **창작 진단
콘텐츠** `data/diagnostic.js` = `window.DIAGNOSTIC`). **전체 사다리 P·AA·A·B·C·D·E·F·G·H
10레벨**(`DIAG_ORDER`): P·AA=6문항(3지선다·2/2/2), A=8문항(4지선다·2/2/2/2),
B~H=12문항(4지선다·3/3/3/3). 문항수·난이도 상승(47w→582w). 배치 임계값
`diagThresholds`: 12문항 `<6↓/11+↑`, 8문항 `<4↓/7+↑`, 6문항 `만점(N)↑/<3↓`.
학습 책 있는 레벨=B(cars-level-b)·C(cars-level-c)뿐(`LEVEL_BOOK`), 나머지는 진단·추천만
되고 "학습 시작"=Study House 안내(콘텐츠 준비 중). 레벨 선택기에 ●=콘텐츠 준비 표시.
- 흐름: 첫 로그인(아바타 픽 직후, `profile.diagnostic` 없으면) → `townView='diagnostic'`
  intro(레벨 선택 or 건너뛰기) → 12문항 test → result. 수동 진입=빌리지 툴바 🧭
  (`data-act="diag-open"`). 모듈: `main.js` `diagnosticScreen/handleDiag/startDiagnostic/
  finishDiagnostic/diagPlacement`, 상태 `let diag`(transient)+`profile.diagnostic`(영구).
- 결과: 점수·추천레벨(추천책 `bookForLevel`)·강점/약점(전략별)·추천 로드맵(약점 top3
  =스킬 코치 안내). verdict가 up/down이고 인접 레벨 콘텐츠 있으면 "추천 레벨로 다시 진단"
  버튼. "레벨은 언제든 자유롭게 바꿀 수 있어요" 명시(자유 선택 원칙 유지). CSS `.dg-*`.
- 저작 참고 강화: STARS "Understanding the strategies"(PIDE 등)로 전략 코칭 문구 보강.
- **진단→학습 연결(2026-07-08)**: ①진단 결과의 약점 전략을 B/C 레슨 스킬 코치로 바로
  태움(`diagToCoach`/`coachStrategyIndex`, 결과화면 "약점 전략 바로 연습" 버튼,
  Supabase 원본 불필요·전략 index 매핑). ②부모 대시보드에 진단 결과 섹션(응시·추천
  레벨·강약점·재진단, `parentDashboard` 상단, CSS `.pd-diag*`). D~H 실제 레슨은
  미제작(사용자 지시: 보유 책 B·C 중심).

---

## 도서관(Library) — 페이지 넘김 전자책 리더 ✅ 구현됨 (2026-07-08)

CARS의 12전략 문항 엔진과 별개인 **순수 독서 경험**. 마을 Library 건물(예약 상태였음)이
이제 시리즈별 서가 → 책 카드(AR/R-G 표시) → 표지+2페이지 스프레드 리더로 연결됨.

- **데이터 분리**: `data/library.js`의 `window.LIBRARY_CATALOG`는 시리즈·책 메타데이터만
  (제목·AR·R-G·삽화가·총 페이지수) — **라이선스 원문은 절대 git에 없음**. 실제 페이지 텍스트는
  Supabase `library_books` 테이블(`book_id`, `pages` jsonb, RLS anon-select-only, `lesson_content`와
  동일 패턴)에만 저장, `Store.pullLibraryPages(bookId)`로 조회.
- **1호 도서**: Magic Tree House #1 *Dinosaurs Before Dark* (Mary Pope Osborne/Sal Murdocca,
  1992 Random House) — `book_id: 'library-mth1'`. 원문 PDF(57p, calibre 변환본)를 `pdftotext -layout`
  으로 전량 추출(6,518 단어) 후 10챕터로 정확히 분할, 문단을 페이지당 ~115단어로 재페이지네이션
  (48페이지, 챕터는 항상 새 페이지에서 시작). AR 2.6 / R/G 2C / W/C 4,737(출판사 공식 시리즈
  #1~28 AR표 기준, 사용자 제공) — 웹 검색으로도 AR 2.6/Lexile 510L 교차 확인됨.
  **삽화(Sal Murdocca, 라이선스)는 git에 넣지 않음** — 리더는 오리지널 이모지/타이포 커버만 사용.
- **리더 UI** (`libraryScreen`/`libShelfScreen`/`libReaderScreen`, `main.js`): 표지 단독 표시 →
  이후 좌우 2페이지 스프레드(모바일은 세로 스택), 클릭 시 CSS 3D 플립 애니메이션(`.flip-next`/
  `.flip-prev`). 진행 위치는 `profile.library[bookId]={spread,updatedAt}`로 자동 저장(이어 읽기),
  서가 카드에 진행률 바 표시.
- **인쇄 방지**: `installGuards()`에 Ctrl/Cmd+P 키다운 차단 + `beforeprint` 이벤트 훅 추가(라이브러리
  열람 중일 때 토스트), `@media print{.lib-town{display:none}}`로 인쇄 시 콘텐츠 숨김. 저장(진행 위치)은
  그대로 가능 — "인쇄는 안 되지만 저장은 가능" 요구사항.
- **오디오·읽어주기**: 페이지별 문장 하이라이트(`libPageBody`가 `.sentence-line[data-libpage]`로
  래핑) + MP3 재생 시 `currentTime/duration` 기반 하이라이트(기존 `speakPassage` 패턴 재사용),
  MP3 없으면 Web Speech 폴백. `scripts/generate-audio.js`에 `fetchLibraryBooks()` 추가 —
  Supabase `library_books`의 페이지마다 `{bookId}/page{N}.mp3` 생성(48개, 원본과 동일한
  skip-if-exists 캐싱). **웹상의 기존 오디오북을 자동으로 찾아 링크하는 기능은 구현하지 않음**
  (공식 오디오북은 대부분 유료·비공개 스트림이라 저작권상 위험 — 항상 자체 TTS 우선, 추후 정말
  라이선스 확보된 링크가 있으면 `library.js`에 `audioUrl` 필드로 수동 등록 가능하도록 설계).
- **확장 설계**: `LIBRARY_CATALOG.books`에 항목을 추가하고 Supabase에 페이지 텍스트만 넣으면
  시리즈 #2~28도 동일 파이프라인으로 추가 가능(사용자 제공 AR표 기준 메타데이터 이미 확보).

---

## 최근 주요 작업 이력

- **2026-07-08 (마을 조작 재설계: 탭/클릭 이동)** — 가장자리 D-pad 4버튼(같은 날 오전
  추가분)이 실사용 스크린샷에서 Library·Study House·Screen Theater 간판을 가리는
  문제 확인 → **완전 제거**하고 지도를 탭/클릭하면 그 자리로 걸어가는 방식으로 교체.
  `town-game.js`: `create()`에서 `this.input.on('pointerdown', ...)` 등록 →
  `hitTestPointer()`로 건물/장식 히트존 위 탭이면 무시(그 오브젝트의 기존 pointerdown이
  처리), 빈 땅 탭이면 `moveTarget` 설정. `update()`에서 키보드 입력이 없고 `moveTarget`이
  있으면 그 방향으로 이동, 도착(거리<6px)하면 해제. 두 손가락 핀치줌의 보조 포인터는
  `pointer.event.isPrimary===false`로 걸러 이동 타깃이 안 잡히게 함. 키보드(방향키/WASD)는
  그대로 병존. `main.js`에서 `.town-dpad` 버튼 마크업·바인딩·CSS 전부 삭제, 안내 문구를
  "지도를 탭하면 그 자리로 이동해요 · 건물을 탭하면 바로 열려요"로 교체(기존엔 모바일에
  안 맞는 "스페이스" 키 안내가 섞여 있었음). ＋/− 확대 버튼·핀치줌은 그대로 유지.
- **2026-07-08 (CARS C 창작 문항 품질 재검토)** — 240문항(lc1~lc10 × extraLearning/
  newPassage × 12문항) 전수를 3개 병렬 리뷰로 점검(정답 분포·오답 설계·전략 적합성).
  분포는 전 세트 3A/3B/3C/3D로 이상 없음. 소프트 결함 15건 발견 후 지문 근거를 살려
  재작성(정답 letter는 전부 그대로 유지, 재검증 완료):
  - **Q6 Making Predictions(8건)** — 지문에 이미 명시된 문장을 그대로 반복하던 문항을
    "다음에 비슷한 상황이 오면"류의 진짜 추론 요구 문항으로 교체
    (lc1×2, lc2, lc4×2, lc5는 별개로 Q8, lc7, lc8×2).
  - **Q12 Real vs Make-believe(5건)** — '동물/식물이 말한다'는 유치한 오답을 그럴듯하지만
    불가능한 물리적 사건으로 교체 (lc2×2, lc9×2, lc10).
  - **기타 2건** — lc5 extraLearning Q8(추론이 아닌 문장 반복), lc4 extraLearning Q10
    (저자 목적이 아닌 텍스트 구조를 묻던 문항 → 진짜 저자 목적으로 교체).
- **2026-07-08 (마을 UI)** — 이동 버튼을 맵 4방향 가장자리 중앙으로 재배치(건물 오탭
  방지, `pointer-events:none` 컨테이너 + 버튼만 클릭 활성). 지도 ＋/− 확대 버튼 추가
  (`TownGame.setZoom/getZoom`, 카메라 아바타 추적, 1x~2.6x). 단어 학습 탭(`.segmented`)
  스타일 신규 추가(브라우저 기본 회색 버튼 → 크림 트랙 세그먼트 컨트롤).
- **2026-07-08 (오디오 파리티)** — **CARS B lesson1 실음성 MP3 추가**. lesson1은
  레거시 플랫 구조(`window.LESSON1`의 `originalExtraPassage`/`extraPassage`, `window.LESSONS`
  미등록)라 `scripts/generate-audio.js`가 통째로 건너뛰어 STEP4/6이 윈도우 TTS 폴백이었음.
  스크립트에 lesson1.js 로드 + 태스크 2개 생성(`originalExtraPassage→lesson1-extra.mp3`,
  `extraPassage→lesson1-new.mp3`, 앱 `audioFileFor` 매핑과 일치) 추가 → Actions
  `Generate Audio` 수동 디스패치(스크립트 변경은 워크플로 path 트리거 대상 아님)로
  Neural2 MP3 생성·업로드. 이제 레슨2~10과 음성 일관성 확보.
- **2026-07-08 (야간 세션, 다수 커밋)**
  - **CARS C 전면 재작업**: 창작 콘텐츠(제목/어휘/extraLearning/newPassage)를
    실제 원본 지문에 정렬 + 원문 길이(276~797단어)로 재작성. 실제 교재 삽화 10개
    추가(`assets/images/cars-level-c/illustrations/`).
  - **Reading Prime Level 1** 신규 리딩북 (`bookId:'reading-prime-1'`, `rp1`~`rp7`).
    OCR→앱 레슨. 원본은 Supabase, 창작은 git. books.js `available:true`. 엔진에
    비-CARS 북 라벨링 추가(availableBooks가 BOOK_CATALOG 사용).
  - **디자인 리프레시**: 파스텔 그라데이션·Inter·무지개색·이모지칩 제거 →
    따뜻한 크림 지면 + 그린/어씨 팔레트 + 세리프 헤딩 ("Storybook Reading Town").
  - **레고 빌리지**: 로그인 후 랜딩 = Phaser 레고 마을 이미지맵 + "이어서 학습"
    배너. 맵 배경 `assets/images/lego-town-map.png`, 효과(분수/구름/연기/비 토글),
    레고 미니피겨 아바타(renderAvatar). 건물 키: library(예약)·practice='Study
    House'(책 레벨 사다리)·theater(Screen Quest)·wordshop(단어)·report(리포트).
  - **공지 게시판**: Supabase `notices` 테이블(공개읽기+anon쓰기) + 앱 게시판
    (리치 마크다운 ##/불릿/**볼드**) + 주간 자동공지 Routine.
  - **Screen Quest 주별 아카이브**: `data/video-archive.js`(과거 주 보관).
  - **우상단 신원 칩(userChip)**: 로그인하면 우상단에 학생 본인의 레고 아바타 +
    이름 표시(빌리지 툴바·타운 홈·레슨 상단바). 클릭=학생 전환. 인증은 아직
    없음(회원제는 추후). `main.js` `userChip()`, CSS `.user-chip/.uc-ava/.uc-name`.
  - **음성 MP3 처리(중요)**: CARS C extra/new 지문을 이번에 재작성 → 07-07 녹음
    MP3가 옛 내용. ①앱: `main.js`의 `AUDIO_STALE={'cars-level-c':{extra,new}}`
    가드가 해당 파일을 건너뛰고 온디바이스 TTS로 실제 지문을 읽음(정확). 원본
    (-original.mp3)·CARS B는 그대로 MP3 재생. ②파이프라인: `scripts/generate-audio.js`
    (Google Neural2 TTS→Supabase Storage 업로드, GitHub Actions `Generate Audio`가
    main 푸시 시 데이터 변경 감지해 실행). 스킵 로직을 "원본만 스킵, extra/new는
    항상 재생성(upsert)"으로 고쳐 바뀐 지문이 새 음성으로 갱신됨.
    **재생성 확인 후** `AUDIO_STALE`의 cars-level-c 항목을 지우면 실음성으로 전환.
  - **통합관리 콘솔(admin)**: main에 있던 `admin.html`·`gfield-on-admin.html`·
    `config.js`·`GFIELD-ON-통합설계.md`. 병합 시 보존(앱 코드는 dev 우선).
  - **병합**: dev(`claude/cars-reading-world-dev-35728z`) → `main` 병합·푸시 완료
    (GitHub Pages 라이브). 이 세션 작업 브랜치는 dev, 사용자 허가로 main 병합함.
- **2026-07-07** — Level C 240문항 전체 재생성 (정답 분포 60A/60B/60C/60D)
  - 이전 버전 문제: B 82.5%, D 0% (GPT 리뷰 46/100점)
  - Q11 실제 인용구 사용, Q12 현실적 wrong choices, Q3 실제 사건순서 강화
- **이전** — CARS Level C 10개 레슨 data 파일 생성 + 앱 연동
- **이전** — 다중 레슨/북 엔진 구축, 학생 선택기, Supabase 연동
- **이전** — 타운 게임 2차 (Phaser, 아트, 코인 장식), Screen Quest, 리포트 개편
- **이전** — 라이선스 원본 지문 git 분리 (Supabase 이관)

---

## GPT 문항 품질 리뷰 기준 (목표)

GPT 1차 리뷰 점수: **46/100** (2026-07 이전 버전)
재생성 후 재검토 필요.

| 항목 | 이전 점수 | 목표 |
|------|-----------|------|
| 주제·지문 흥미도 | 82 | 유지 |
| 지문 문장력 | 75 | 유지 |
| 문항-지문 근거 연결 | 68 | 80+ |
| CARS 전략 적합성 | 48 | 75+ |
| 보기 설계 | 35 | 70+ |
| 정답 분포·시험 신뢰도 | 0 | 100 ✓ |

### 전략별 작성 주의사항
- **Q3 Sequence**: 지문 문장 순서가 아닌 **실제 사건 발생 순서** 물어야 함
- **Q6 Predictions**: 지문에 직접 명시된 내용 반복 금지, 진짜 추론 필요
- **Q8 Inference**: 지문 요약이 아닌 **실제 추론** 필요
- **Q11 Figurative Language**: 반드시 지문에서 **실제 비유적 표현** 인용
- **Q12 Real vs Make-believe**: 오답은 유치한 '동물이 말하는' 수준 금지, 그럴 듯하지만 불가능한 시나리오로

---

## 파일 로딩 순서 (index.html)

```
lesson1.js ~ lesson10.js (Level B)
lesson1.original.js
lc1.js ~ lc10.js (Level C)
avatar.js, decorations.js, decor-art.js, video-plan.js
vendor/phaser.min.js
app/town-game.js → game-store.js → store.js → main.js
```

`window.LESSONS` 객체에 모든 레슨 데이터 누적됨.
