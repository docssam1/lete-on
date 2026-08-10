# Gfield Reading Town — Project Memory

> 이 파일은 Claude의 세션 간 기억 대체용입니다. 세션 시작 시 반드시 읽으세요.
> Last updated: 2026-08-10

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
    cars-d-layouts.js         — Level D 레이아웃(본문 배치·삽화·다이어그램 모양)
    cars-visual-layouts.js    — Level B·C 다이어그램 모양만 (문구는 Supabase)
    avatar.js                 — 아바타 파츠 데이터
    decorations.js            — 타운 장식 아이템 목록
    decor-art.js              — 장식 아트 SVG/data-URI
    video-plan.js             — Screen Quest 영상 플레이리스트
  assets/images/
    cars-level-b/             — Level B 레슨 커버 이미지
    cars-level-c/             — Level C 레슨 커버 이미지 (현재 placeholder PNG)
  scripts/                    — (저장소 루트) 창작 지문 검증·보정 도구 3종
  shared/
    cars-components.js        — 앱 쪽 CARS 데코레이터(본문 배치·다이어그램 주입)
    cars-layout.css           — 위 데코레이터용 CSS (.cars-*)
    cars-source-bridge.js     — Supabase 원본의 meta를 CARS_SOURCE_META로 중계
  print.html                  — 학습지 인쇄 콘솔 (앱과 별개로 자체 로딩·렌더)
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
- 어휘 12개 = 실제 원문에서 추출 · 레슨 커버 = `assets/images/cars-level-c/N.png` (lcN→N.png)
  ※ 옛 `illustrations/lcN.jpg` 경로는 2026-07-08에 삭제됨 — 아래 '알려진 버그' 표 참조

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

## 창작 지문 사양 + 검증 도구 (2026-08-10)

**지문을 새로 쓰거나 고칠 때는 반드시 검사기를 돌릴 것.** 사양 전문은
`scripts/check-practice-sets.js` 상단 주석에 있다.

```bash
node scripts/check-practice-sets.js              # 전체 70세트
node scripts/check-practice-sets.js cd3 lesson7  # 지정 레슨만 (실패 시 exit 1)
node scripts/rebalance-answers.js cd6            # 3/3/3/3 자동 보정
```

| 도구 | 하는 일 |
|---|---|
| `check-practice-sets.js` | 길이·어휘·문항수·전략순서·보기형식·분포 검사 + 키 중복 보고 |
| `check-question-quality.js` | 기계 규칙이 못 잡는 것: Q7/Q11이 **지문에 실제로 있는** 낱말·비유를 인용하는지, Q6/Q8 정답이 지문 문장 되풀이가 아닌지, 오답이 전부 부정형인지, **정답이 늘 최장 보기인지**, D 스캐폴드 상투구 오답이 남았는지. 결과는 **판정이 아니라 후보** |
| `rebalance-answers.js` | 보기 **위치만** 바꿔 3/3/3/3로 맞춤(문장 불변) |
| `patch-level-d-lesson.js` | D 레슨 파일 기록 + **전략명 자동 주입**(표기 드리프트 차단) |

### 규칙 6가지 (요약)
1. **길이** 원문의 85~125%. 짧으면 12전략을 지탱 못 함.
2. **어휘** 유사 지문은 12개 전부, **가르치는 형태 그대로**. `reply`를 가르치는데
   본문에 `replied`만 있으면 실패 — 이 유형만 실제로 5번 걸렸다.
   추가 학습은 원문의 주제·형식을 잇는 게 역할이라 어휘 의무 없음(경고만).
3. **형식** 원문이 시면 시, 대본이면 대본, 번호목록이면 번호목록.
4. **문항** 12개, 책별 고정 전략 순서. B·C는 `Recognizing`/`Understanding Author's
   Purpose`/`Distinguishing Between Real and Make-believe`, **D는** `Recognising`/
   `Identifying Author's Purpose`/`Summarising`.
5. **분포** 3A/3B/3C/3D. 편중되면 한 글자만 찍어도 통과된다(lesson1이 A만 찍어 58%였음).
6. **키 중복** 레슨 간 12자 키 중복 금지(경미, 별도 보고).

### 보기 길이 — 가장 컸던 구멍 (2026-08-10 발견·해소)
전 840문항 중 **67%에서 정답이 유일한 최장 보기**였다(우연=25%). **지문을 안 읽고 제일 긴
보기만 눌러도 67점.** 세 책 전부에 걸쳐 있었고, 이번에 손대지 않았던 Level C도 64%였다 —
한 번의 작업이 만든 게 아니라 **문항을 쓰는 방식 자체**가 그랬다는 뜻이다.

원인은 정답에만 한정어구가 붙기 때문이다("still choose to be kind, **just as she was to
Spider**") — 오답은 짧게 끝난다("leave the jungle"). **해법은 오답 늘리기(padding)가 아니라
오답에 정답과 같은 수준의 구체성을 주는 것**이다. 짧은 오답은 읽지 않아도 버려지므로, 지문에
근거한 구체적 오답이라야 진짜 경쟁자가 되고 길이 신호는 부수적으로 사라진다.

Q12 요약(D)처럼 **정답이 본래 길 수밖에 없는 문항**은 반대로 정답을 줄이고 오답을 제대로 된
요약문으로 만든다. 현재 전 책 **0%**(771문항 중 1건, lesson1 Q9 — 아래 참조).

**검사에서 제외하는 두 유형**(패딩이 부자연스러워지는 경우, 검사기가 자동 skip):
- 보기가 전부 25자 미만(이름 4개, 두 낱말 정의 4개 등) — 길이 전략이 성립하지 않음
- 사실/의견 문항의 사실 보기는 **지문에 실제로 있는 문장**이어야 한다. 더 긴 사실 문장이
  지문에 있으면 교체하고, 없으면 지어내지 말고 그대로 둔다.

### 주의
- **정답 letter는 쓰기 전에 배분할 것.** 자연스럽게 쓰면 거의 항상 편중된다.
  사후 보정은 `rebalance-answers.js`가 하지만, 오답 설계가 letter 위치에 얽히면 곤란.
- **원문(Supabase)은 절대 수정 금지.** 정답·보기 모두. 창작 콘텐츠(git)만 다룬다.
- 실존 인물 전기가 원문일 땐 **인물을 가상으로** 바꾸고 형식만 유지(cd2·cd7 선례).

---

## 다이어그램 문항 (순서도·인과·분류도) ✅ B/C 이관 완료 (2026-08-10)

일부 문항은 **그림 자체가 문제**다. 상자 3개 중 하나가 비어 있고 보기가 그 빈칸을 채우는
식이라, 문항 텍스트만 찍으면 답할 수가 없다. `type`은 `sequence`(순서 상자) ·
`cause-effect`(원인→결과) · `branch-map`(분류도) 3종.

### 모양(공개)과 문구(라이선스)를 분리 — 절대 섞지 말 것
| | 어디에 | 무엇이 |
|---|---|---|
| **모양** | `data/cars-d-layouts.js` (Level D)<br>`data/cars-visual-layouts.js` (Level B·C) | `{type, boxCount, blankIndex, showStepNumbers}` — 상자 수·빈칸 위치뿐이라 git 공개 OK |
| **문구** | Supabase `original_questions.meta.visualQuestions[문항번호]` | `{before, after, boxes[]}` — 교재 원문이므로 **git 금지** |

`blankIndex` 자리의 `boxes` 원소는 빈 문자열 `""`로 둔다(렌더러가 빈칸으로 그림).
`showStepNumbers: true`는 문항이 "box 2" 식으로 번호를 지목할 때만.

### 렌더링 — stem은 대체된다
다이어그램이 있으면 두 렌더러 모두 문항 stem(`item[1]`)을 **버리고** `before → 그림 →
after`로 갈아끼운다. 그래서 Supabase stem에는 ASCII 그림을 넣지 않는다(폴백용 문장만).
- **인쇄**: `print.html`의 `visualLayout()` → `visualFor()` → `visualHtml()`, CSS `.vis-*`
- **앱**: `shared/cars-components.js`의 `applyQuestionVisual()`이 `.qcard`에 주입,
  CSS `.cars-*` (`shared/cars-layout.css`, **책 스코프 없음** — D 전용 타이포그래피만
  `html[data-cars-book="cars-level-d"]`로 한정)
- 문구 전달: `shared/cars-source-bridge.js`가 `window.CARS_SOURCE_META[lessonId]`에 적재

### 주의점
- `original_questions`는 **평문 배열**과 **`{meta, items}` 봉투** 두 포맷이 공존한다.
  `meta`가 필요한 레슨만 봉투. 읽는 쪽(`normOriginal`·source-bridge)은 둘 다 처리하니
  새 코드도 반드시 양쪽 대응할 것.
- 레슨 id는 책을 넘어 겹치지 않으므로 레이아웃 조회는 id 하나로 두 맵을 순회한다.
- **`lesson1`은 `window.LESSONS`에 없다**(레거시 플랫 전역 `window.LESSON1`). 앱이 제목으로
  레슨을 찾기 때문에, 레이아웃 항목에 `title: 'My Backyard Zoo'`를 실어 매칭한다.
- 현재 다이어그램 문항: **B** lesson1·3·5·10 Q3 / **C** lc3·lc6 Q3 / **D** 다수.

### 검증 상태 (중요)
- **Level D는 PDF 스캔과 대조 완료.** 이 대조로 cd13 Q3의 상자 밀림 오류를 찾아 고쳤다
  (`["","","Tom opens…"]` → `["","Tom opens…","Everyone goes outside…"]`).
  `cars-d-layouts.js`의 `pdfPrintedOffset`은 **4**다(PDF 51쪽 = 인쇄 47쪽). 한동안 3으로
  잘못 적혀 있었으니, 옛 메모에 3이 보이면 그쪽이 틀린 것이다.
- **Level B도 대조 완료(2026-08-10).** lesson1·3·5·10 Q3를 교재 사진과 대조 → **밀림 없음**.
  대신 **전사 누락 2건**을 찾아 복원했다: lesson1은 도입문 "The boxes tell some things about
  robins."가 통째로 빠져 있었고, lesson10은 보기 D의 안쪽 따옴표가 빠져 있었다
  (`Owl said, No one tells me…` → `Owl said, "No one tells me what to do!"`). 정답 letter는
  둘 다 원래 맞았고 손대지 않았다. 같은 사진으로 lesson7·8·9의 Q3가 다이어그램이 **아님**도
  확인 — 레이아웃 맵의 분류가 옳았다.
- **Level C도 대조 완료(2026-08-10).** Drive의 교재 스캔(`CARS_C_pNNN_corrected.png`, lc3=p009,
  lc6=p019)과 대조 → **밀림 없음**. 전사 누락 3건을 복원했다: lc3·lc6 모두 도입문이 통째로
  빠져 있었고, **lc6은 3번 상자에 본문 문장("we do not eat with our coats on")이 들어가 있었다**
  — 실제 상자 문구는 "Turtle told Spider that it was bad manners to eat with his coat on."이다.
  lc6의 유실된 질문 문장을 시리즈 표준 문구로 임시 보충했던 것도 **틀렸음이 확인**됐다
  (실제는 "What belongs in the empty box?"). 정답 letter는 6개 전부 원래 맞았고 손대지 않았다.
- **결론: 다이어그램 문항 6개 전부 대조 완료.** 구조적 밀림은 D의 cd13 하나뿐이었고, B·C에서
  나온 것은 전부 **전사 시 문구 유실**(도입문 4건·따옴표 1건·상자 문구 1건)이었다.
- **lc6은 문항 문장이 통째로 유실**돼 있어(그림만 있고 질문 없음) 시리즈 표준 문구
  "Which of these belongs in the empty box?"로 채움 — 교재 대조 필요.

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
| ~~Level B 다이어그램 미대조~~ | ✅ 대조 완료 (2026-08-10) | lesson1·3·5·10 Q3를 교재 사진과 전수 대조. **상자 밀림 없음** — 내용·순서·빈칸 위치·정답 전부 일치. 전사 누락 2건 복원(아래) |
| ~~Level C 다이어그램 미대조~~ | ✅ 대조 완료 (2026-08-10) | lc3·lc6 Q3를 교재 스캔(Drive)과 대조. **상자 밀림 없음**. 전사 누락 3건 복원(아래) |
| ~~lc6 Q3 문구 임의 보충~~ | ✅ 교체됨 (2026-08-10) | 임시로 채웠던 "Which of these belongs in the empty box?"는 **틀렸다**. 실제 교재는 "What belongs in the empty box?"이고 도입문도 따로 있었다. 3번 상자 문구도 본문 문장이 잘못 들어가 있어 교체 |
| ~~`pdfPrintedOffset: 3`~~ | ✅ 수정됨 (2026-08-10) | 실제 +4로 정정. cd13 인쇄 47~49쪽 → PDF 51~53쪽으로 검산 완료 |
| 정답 키 중복 6쌍 | 하 | 서로 다른 레슨이 같은 12자 키를 공유(lc4·lc6 `ABCDABCDABCD` 등). 6~7세 대상이라 실질 영향 없다는 사용자 판단으로 미수정 |
| ~~rp·ws·sl 유사 지문 어휘 미사용~~ | ✅ 해결됨 (2026-08-10) | 19세트의 newPassage가 어휘 12개를 다 안 쓰던 것 → **140세트 전부 통과**. 대부분 문장 한두 개를 기존 문단에 엮어 넣었고, 어휘가 10~11개 빠져 있던 ws3·ws6·sl16은 과학/논증 문단을 새로 써 넣었다. 작업 중 **교체하는 문장에 들어 있던 다른 어휘를 지우는 실수를 3번**(sl6·sl1·sl9) 해서, 편집 도구가 '나가는 문장의 어휘가 들어오는 문장에 없으면 쓰기 거부'하도록 가드를 넣었다 |
| **rp·ws·sl 보기 길이 미보정** | 상 | **미착수 — 사용자 지시로 나중에 진행.** CARS 3책에서 해소한 "정답=최장 보기"가 이 세 책엔 그대로 남아 있다: **rp 122/151(81%) · ws 185/284(65%) · sl 262/379(69%) = 합계 569/814(70%)**. rp의 81%는 지금까지 나온 최악 수치. 해법은 CARS와 동일(오답에 같은 수준의 구체성 부여, 위 '보기 길이' 절 참조).<br>⚠️ **검사기가 이 책들을 아예 안 본다** — `check-practice-sets.js`의 `ORIGINAL_WORDS`에 CARS 레슨 id만 있어서 목록에 없는 책은 조용히 건너뛴다. "70세트 전부 통과"는 **검사 대상이 70세트뿐**이라는 뜻. 착수할 때 검사기부터 확장할 것 |

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
  1992 Random House) — `book_id: 'library-mth1'`. 원문 PDF(57p, calibre 변환본, 텍스트 레이어
  포함 — OCR 아님)를 `pdftotext -layout`으로 전량 추출(6,518 단어). **페이지는 원본 그대로**:
  처음엔 페이지당 ~115단어로 임의 재페이지네이션(48p)했으나, "원본을 그대로 올려라"는 사용자
  피드백에 따라 실제 인쇄본의 진짜 페이지 경계(10~45쪽, 삽화 전용 빈 페이지 2장 포함 36페이지)로
  재구성 — 챕터가 반드시 새 페이지에서 시작하지 않고 이전 챕터 끝과 같은 페이지에 이어지는 실제
  조판까지 그대로 반영(`chapterTitleAt`으로 챕터 제목을 페이지 내 정확한 문단 앞에 삽입). 총
  단어수 4,728 vs 출판사 공식 W/C 4,737(±9, 카운팅 방식 차이 수준) — 추출 정확도 검증됨.
  AR 2.6 / R/G 2C(출판사 공식 시리즈 #1~28 AR표, 사용자 제공 이미지 기준) — 웹 검색으로도
  AR 2.6/Lexile 510L 교차 확인됨. **삽화(Sal Murdocca, 라이선스)는 git에 넣지 않음** — 리더는
  오리지널 이모지/타이포 커버만 사용, 삽화 전용 페이지는 "(원본 삽화 페이지)" 자리표시.
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
  Supabase `library_books`의 페이지마다 `{bookId}/page{N}.mp3` 생성(36개, type `libpage`로
  **항상 재생성** — 페이지네이션이 한 번 교정된 전례가 있어 CARS 원본처럼 skip-if-exists로 캐싱하면
  스토리지 경로는 그대로인데 텍스트만 바뀐 상황을 못 잡아냄). **웹상의 기존 오디오북을 자동으로 찾아 링크하는 기능은 구현하지 않음**
  (공식 오디오북은 대부분 유료·비공개 스트림이라 저작권상 위험 — 항상 자체 TTS 우선, 추후 정말
  라이선스 확보된 링크가 있으면 `library.js`에 `audioUrl` 필드로 수동 등록 가능하도록 설계).
- **확장 설계**: `LIBRARY_CATALOG.books`에 항목을 추가하고 Supabase에 페이지 텍스트만 넣으면
  시리즈 #2~28도 동일 파이프라인으로 추가 가능(사용자 제공 AR표 기준 메타데이터 이미 확보).
- **배경지식 · 중요어휘 · AR퀴즈** ✅ 구현됨 (2026-07-08). 사용자 지시("ar퀴즈,배경 지식 공부,중요
  어휘 어따냐고")로 순수 리더에 학습 3요소 추가. 전부 창작 콘텐츠(`library.js`의 책 항목에 `background`/
  `vocab`/`quiz` 필드로 저장, git 허용) — 실제 원문(Supabase)에서 뽑은 사실에 기반해 저작했지만 원문
  문장을 그대로 쓰지 않음: `background`는 책 배경(시대·인물·설정) 소개 3개 언어, `vocab`은 원문에
  실제 등장하는 어려운 단어 10개 + 직접 쓴 정의(CARS `words`와 달리 zh도 4번째 배열 요소에 직접
  포함 — CARS의 `L._zh` 별도 사전과 무관해 `libVocabMeaning()`으로 별도 처리), `quiz`는 실제 줄거리
  기반 8문항 객관식(AR 퀴즈 자체는 저작권 있는 비공개 콘텐츠라 그대로 베낄 수 없어 자체 제작,
  CARS처럼 3A/3B/3C/3D 균형 유지). 흐름: 책 최초 오픈 시 배경지식→어휘→리더 순서 강제(`lib.stage`),
  이후 재방문은 `profile.library[bookId].introSeen` 확인 후 리더로 바로 진입. 리더 상단에 탭
  4개(배경지식/어휘/읽기/AR퀴즈, `libStageHead()`)를 항상 노출해 언제든 자유 이동 가능(자유 선택
  원칙 유지). 퀴즈는 CARS 문항 카드 CSS(`.qcard/.choices/.qtop` 등)를 그대로 재사용하되 `L`(CARS
  레슨 전역) 의존 없는 독립 상태(`lib.quizIndex/quizAnswers`)로 구현 — CARS 상태와 절대 안 섞임.
  60% 이상 정답 시 최초 1회만 코인 지급(`correct*5`, `profile.library[bookId].quizBest`로 재통과
  시 중복 지급 방지), 서가 책카드에 `📝 best/total` 배지 표시. Playwright 헤드리스 브라우저로 로그인
  →마을→도서관→배경지식→어휘→리더(실제 36페이지 확인)→퀴즈 전 문항→8/8 통과(+40P)→서가 배지 갱신
  →재입장 시 리더 직행까지 전 구간 콘솔 에러 0건으로 검증 완료.

---

## 최근 주요 작업 이력

- **2026-08-10 (창작 지문 50편 전면 재작성 — B 10레슨 + D 15레슨)** — 착수 전 진단:
  **50편 중 44편이 원문 길이의 70% 미만**(B 26~49%, D 장문 레슨 23~30%). 그 외
  ①lesson1이 7A/4B/1C/**0D** — D가 정답인 적이 없고 A만 찍으면 58% ②B lesson4~10의
  14세트가 **동일한 정답 키** `ABCDCDABDABC` ③lesson3 창작 지문이 축구·피아노라 야구
  어휘 12개를 하나도 안 씀 ④**원문 형식 무시**(원문이 시/대본/번호목록인데 전부 산문)
  ⑤**Level D 30세트는 창작이 아니라 `cars-d-engine.js` 템플릿 생성물** — 문두·해설이
  15개 레슨 동일, 오답 부족 시 `"The passage does not support this idea."`로 채움.
  → 50편 전부 재작성. 원문 길이 85~125%, 유사 지문은 어휘 12개 전부 사용, **원문 형식
  준수**(cd5 시→시, cd8 번호목록→번호목록, lesson7 대본→대본, lesson10 유래담→
  `to this day`로 끝). D는 `questions` 배열을 직접 작성해 스캐폴드에서 이탈.
  **Level C는 검사 결과 손댈 필요 없음**(길이 94~109%, 분포·형식 정상).
  cd2·cd7은 원문이 실존 인물(Beverly Cleary·Edison) 전기라 **없는 이력을 지어내지 않도록
  형식만 유지하고 인물은 가상**으로 씀.
- **2026-08-10 (검증 도구 3종 추가)** — `scripts/` 참조. 작업 중 검사기가 **12건**을
  잡음(어휘 활용형 5·분포 5·길이 2). 전부 "맞다"고 판단한 뒤 나온 것이라 자기보고는
  근거가 못 됨.
- **2026-08-10 (다이어그램 문항 B·C 이관)** — B·C의 순서도 문항 6개(lesson1·3·5·10,
  lc3·lc6의 Q3)가 `→ [ ___ ] →` ASCII로 stem에 박혀 있어 런온 문장으로 읽히고 인쇄도
  그대로 나가던 문제. Level D가 이미 쓰던 방식(모양=공개 맵, 문구=Supabase `meta`)으로
  통일 → 상세는 위 "다이어그램 문항" 섹션 참조. 신규 `data/cars-visual-layouts.js`.
  두 번째 책이 통과하도록 3군데를 열었다: ①레이아웃 조회가 D 맵+공용 맵을 순회
  (`visualLayout()` / `lessonCfgFor()`) ②source-bridge가 D 외 책의 `meta`도 announce
  ③`data-cars-book`을 하드코딩 대신 레슨에서 도출 — 안 고쳤으면 B·C 레슨에 D 전용
  본문 타이포그래피가 딸려갔을 것. **D 경로는 무변동**(cd13 매칭·렌더 재확인).
  검증: 인쇄 6개 전부 렌더(빈칸 1개·번호 정확), 앱 주입 구조/스타일, 레슨 해석 7건,
  콘솔·페이지 에러 0건, 전 교재 구조 무결성 무변동.
- **2026-08-10 (cd13 원본 대조 수정)** — Level D 특수 문항을 PDF 스캔과 전수 대조.
  cd13 Q3의 `boxes`가 한 칸 밀리고 3번 상자 내용이 유실돼 있던 것을 원본대로 복구.
  정답 B는 원래부터 맞았고 유지. 이 과정에서 `pdfPrintedOffset`이 3이 아니라 **4**임을
  확인(설정값은 아직 3). cd14는 오류가 아니었음(`blankIndex:2`와 데이터 일치).
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

---

## 인쇄 콘솔 브랜딩 — Gfield + 학원 프리셋 (2026-08-10)

**콘솔은 Gfield(영어 학원 지원 센터)의 것이고, 학원은 프리셋으로 등록해서 쓴다.**
이전엔 기본값이 통째로 한 학원(UEP) 것이라 새 브라우저로 열면 무관한 학원 이름·색·로고로
학습지가 인쇄됐다.

- 아무것도 설정 안 하면 **Gfield**. 첫 방문 시 브랜드 모달이 자동으로 열린다(기존 동작).
- `print.html`의 `BRAND_PRESETS` 배열 = 등록된 학원 목록. 모달의 "등록된 학원" 칩을 누르면
  이름·부제·색 2개·로고가 한 번에 들어가고 localStorage에 저장된다.
- **학원 추가 = 배열에 한 줄 추가.** `{key, label, name, sub, color, color2, logo}`
- 로고는 선택. `assets/images/brand/<key>.png` 에서 불러오고, **파일이 없으면 이름만 인쇄**되어
  깨져 보이지 않는다. 학원이 직접 업로드하면 data URI로 브라우저에 저장됨(파일 불필요).
- 현재 등록: `gfield`(기본) · `uep` · `lisakeem`.
  ⚠️ **`lisa-keem.png` 파일 미제공** — `assets/images/brand/`에 넣으면 바로 적용된다.
- UEP 로고는 `assets/images/ueplogo.png` → `assets/images/brand/uep.png`로 이동.
  더 이상 전역 자동 적용이 아니라 UEP 프리셋에서만 불러온다.
- `uep.html`(대문)·`manual-academy.html`도 같은 기본값을 따른다. 파일명 `uep.html`은
  북마크 유지를 위해 그대로 뒀다(내용은 중립).

## 새 책 3종 (rp·ws·sl) 삽화 (2026-08-10)

`reading-prime-1`(rp1~7) · `wonderskills-adv3`(ws1~12) · `subject-link-4`(sl1~16) 35개 레슨이
전부 **책표지 SVG 하나**를 공유하고 있었다. 게다가 표지는 320×400 세로인데 앱의 그림 자리는
가로형(`.story-art`, `object-fit:cover`)이라 책등만 잘려 보였다.

- 레슨마다 `assets/images/<book>/<lessonId>.svg` (800×520, CARS 그림과 같은 규격) 생성.
- **원본 도형만 사용** — 베끼거나 트레이스한 그림 없음, 라이선스 문제 없음. 책별 팔레트 유지.
- 렌더링해서 눈으로 확인 후 4개 재작업(rp3 개가 보라색 뿔 괴물처럼 보임 · rp7 숫자 판독 불가 ·
  ws12 착시가 아닌 그냥 삼각형 → 뮐러-라이어로 교체 · sl13 변기로 안 보임).

---

## 알파 프렙 대비 모의고사 — 사양 (2026-08-11, 사용자 제공)

**미착수.** 다음 세션에서 이 절부터 읽고 시작할 것.

### 왜 하는가
CARS는 이 시장에서 **알파 프렙 등 상위 프렙 학원이 쓰면서 알려진 교재**다. 학원이 교재를
새로 설득할 필요가 없고, 우리가 파는 것은 **그 위에 얹는 진단·분석·계획**이다(매뉴얼 1장).
그런데 정작 **실전 시험 대비는 하나도 없다.**

### 알파 시험 구조 (작년 기준, 사용자 제공)
| 섹션 | 시간 | 내용 |
|---|---|---|
| 리딩 | 15분 | **픽션 2문제** |
| 리딩 | 15분 | **논픽션 1문제** |
| 라이팅 | 20분 | 주제 1개 |
- 섹션마다 **종이 울린다**(시간 엄수).
- **"시간이 부족했다"는 평이 대부분** → 난이도가 아니라 **속도**가 관건.
- 라이팅 주제는 **좋아하는 것 / 싫어하는 것** 계열이 주로 나온다.
  작년 출제: `favorite subject` · `what do you usually do on weekend?` ·
  `what is the worst thing at your school?`
- 그래머는 기본 문항 위주.
- **6세와 7세 시험이 비슷하다.** 난이도 기준 = **브릭스 리스닝 300 정도.**

### 우리 자산 대조
| 알파 | 보유 | 빈 곳 |
|---|---|---|
| 픽션·논픽션 구분 | CARS 지문에 있음 | **섹션 편성·시간 제한 없음** |
| 라이팅 | `data/writing.js`(앱) — 인쇄용 미확인 | **인쇄용 라이팅지·주제 뱅크 없음** |
| 그래머 | **없음** | 문항 신규 집필 필요(별도 규모) |
| 시간 훈련 | **없음** | 섹션별 시간 박스 |

### 구현 제안 (print.html 「모의고사 세트」)
1. 섹션 구조 그대로 15분/15분/20분 — 각 섹션 첫 장에 큰 시간 박스 + 시작·종료 시각 기입란
2. 픽션 2 + 논픽션 1 자동 편성 (CARS 지문을 유형별로 골라 한 세트)
3. 라이팅지 — 좋아하는 것/싫어하는 것 주제 뱅크에서 1개 + 20분용 원고 칸 + 3문단 가이드
4. 답안지 분리 → 채점 결과를 기존 분석지에 그대로 입력
- 그래머는 문항이 없으므로 이번 범위에서 제외 권장.

### 미확정 (사용자 확인 필요)
- 매뉴얼에 **알파 프렙 실명**을 그대로 쓸지 (현재 실명으로 기재됨)
- 라이팅 주제 추가 제공 여부
