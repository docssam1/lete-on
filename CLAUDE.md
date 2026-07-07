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

### Level C 레슨 목록 (제목 / extraLearning / newPassage)
| # | 제목 | extraLearning | newPassage |
|---|------|---------------|------------|
| lc1 | The Great Migration | The Caribou Journey | Salmon's Long Way Home |
| lc2 | Inside a Volcano | Kilauea: Earth's Most Active Volcano | The Day Mount St. Helens Woke Up |
| lc3 | A World Without Bees | The Waggle Dance | A Beekeeper's Year |
| lc4 | Layers of the Rainforest | Life on the Forest Floor | Meet the Harpy Eagle |
| lc5 | Our Solar System | Journey to the Outer Planets | Mars: Our Neighbor in Space |
| lc6 | Ancient Egypt | The Rosetta Stone | Building the Great Pyramid |
| lc7 | The Water Cycle | Freshwater: Earth's Rarest Resource | A Raindrop's Remarkable Journey |
| lc8 | The Monarch's Journey | The Super Generation | Milkweed Matters |
| lc9 | Ocean Zones | Life at Hydrothermal Vents | Dive to the Deep |
| lc10 | Community Gardens | Rooftop Farms in the City | The Seed Library |

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
- 2026-07-07 기준 모든 Level C 문항 재생성 완료 (이전 버전은 B 82.5%, D 0%로 폐기)

### Level C extraLearning 정답 패턴 (각 레슨별)
| 레슨 | extraLearning 정답 순서 | newPassage 정답 순서 |
|------|------------------------|---------------------|
| lc1  | B,C,A,D,B,C,A,D,B,C,A,D | A,D,C,B,A,D,C,B,A,D,C,B |
| lc2  | C,B,D,A,C,B,D,A,C,B,D,A | D,A,B,C,D,A,B,C,D,A,B,C |
| lc3  | B,D,A,C,B,D,A,C,B,D,A,C | C,A,D,B,C,A,D,B,C,A,D,B |
| lc4  | A,C,B,D,A,C,B,D,A,C,B,D | D,B,C,A,D,B,C,A,D,B,C,A |
| lc5  | C,D,A,B,C,D,A,B,C,D,A,B | B,A,D,C,B,A,D,C,B,A,D,C |
| lc6  | A,B,C,D,A,B,C,D,A,B,C,D | D,C,B,A,D,C,B,A,D,C,B,A |
| lc7  | B,A,C,D,B,A,C,D,B,A,C,D | C,D,B,A,C,D,B,A,C,D,B,A |
| lc8  | A,D,B,C,A,D,B,C,A,D,B,C | D,B,A,C,D,B,A,C,D,B,A,C |
| lc9  | C,A,D,B,C,A,D,B,C,A,D,B | B,C,A,D,B,C,A,D,B,C,A,D |
| lc10 | D,B,C,A,D,B,C,A,D,B,C,A | A,C,D,B,A,C,D,B,A,C,D,B |

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

- `data/avatar.js` — 아바타 파츠 (얼굴형, 눈, 입, 헤어, 의상 등)
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
| `store.js` remoteUpsert 하드코딩 | 낮음 | `book_id: 'cars-level-b'`, `lesson_id: 'lesson1'` 고정 → analytics만 영향 |
| Level C 커버 이미지 | 낮음 | `assets/images/cars-level-c/` 전부 placeholder PNG (실제 아트워크 미제작) |
| 적응형 학습 기능 | 미구현 | 아래 계획 참조 |

---

## 다음 구현 예정 기능: 적응형 학습

```
학생이 원본문항 풀기
  ↓
틀린 전략 확인 (예: Sequence / Inference 약함)
  ↓
유사문제 3문제 자동 제공
  ↓
그래도 틀리면 → 해당 전략 해설 + 단어 퀴즈
  ↓
유사지문 1개 제공
  ↓
점수·오답·전략별 결과 저장 → 학습 리포트 반영
```

---

## 최근 주요 작업 이력

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
