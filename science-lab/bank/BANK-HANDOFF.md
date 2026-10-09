# 과학 문제은행 — 인수인계 (2026-10-09)

> **다음 작업자(Claude·GPT·Codex 누구든) 이 파일부터 끝까지 읽고 시작할 것.**
> 이 문서에 적힌 위치·순서·규칙 밖에서 파일을 만들거나 고치지 않는다.

---

## 0. 원장 결정 (바꾸지 말 것)

| 결정 | 원장 말 |
|---|---|
| 단원평가 **원문을 그대로** 문제은행에 넣고, 원문 1문항마다 **유사문항 1개**를 더한다 | 「원문 그대로 써도 되 원문에 추가해서 문제은행 만들라는 거야」 |
| 원문은 **git 정적 파일**에 둔다. **Supabase에 올리지 않는다** | 「아니 왜 supabase에 올려」「db가 문제가 아니라 사용자가 많아지면 비용이 발생하는 구조잖아」 |
| 저장소는 나중에 유료로 바꿔 **비공개**로 돌린다 | 「나중에 깃허브 유료로 비공개 한다고 했잖아」 |
| **교과 순서대로** 3-1 → 6-2, 학기마다 중간·기말평가까지 | 「교과 순서대로 3-1부터」「전체 문제은행도 만들꺼야」 |
| 음성은 맨 마지막. 지금은 기기 음성. 구글 TTS를 켜지 않고, OmniVoice 파일·도구를 지우지 않는다 | 「음성은 모두 완성 한다음에 하자」 |

- ⚠ 이 결정은 **과학 단원평가에만** 해당한다. CARS 원본 지문(Supabase에만)과 FC 골든벨 정답(공개 금지)의 규칙은 그대로다. → 저장소 뿌리 `CLAUDE.md` 「보안 제약」.
- 커밋 메시지·코드·문서에 모델 이름을 쓰지 않는다.

---

## 1. 무엇이 어디에 있나 (저장 위치)

`<u>` = 단원 id(`s42-u03`, `s41-mid`), `<us>` = 짧은 id(`s42u03`, `s41mid`).

### 1-1. 앱이 읽는 결과물 (커밋된 것)

| 무엇 | 위치 |
|---|---|
| **원문** (시험지 받아쓰기 + 정답·풀이) | `science-lab/data/units/<u>.source.js` |
| **유사문항** (원문 1:1, 창작) | `science-lab/data/units/<u>.similar.js` |
| 분류 (내용 요소·유형, 원문→유형) | `science-lab/data/units/<u>.taxonomy.js` |
| 오개념표 (보기별 오개념·처방) | `science-lab/data/units/<u>.misc.js` |
| 서술형 판정표 | `science-lab/data/units/<u>.judge.js` |
| 단원 머리 + 레슨 문항(`-b01…`) | `science-lab/data/units/<u>.js` |
| 원문 그림 (시험지에서 잘라 냄) | `science-lab/assets/bank/<u>/s<세트>-q<번호>.webp` |
| 분류 JSON (자동 생성) | `science-lab/bank/taxonomy/<u>.json` ← `node bank/taxonomy/build.mjs` |
| 교재 확인·형성평가 문제 키 (레슨 단원) | `science-lab/data/book/<u>.book.js`의 `check`·`formative.items` |

### 1-2. 만드는 데 쓰는 것

| 무엇 | 위치 |
|---|---|
| **작업 지시서** (에이전트에게 그대로 준다) | `science-lab/bank/pipeline/*.md` → §3 |
| 도구 (그림 자르기·등록·검사·커밋) | `science-lab/bank/pipeline/*.py · *.sh · *.mjs` → §3 |
| **Drive 폴더 id** (학기·단원별 시험지 위치) | `science-lab/bank/pipeline/folders.txt` |
| **받아쓰기 작업 자료** | `science-lab/bank/work/<us>/` → 아래 표 |
| 단원 가져오기 설정 (1단원 1파일) | `scripts/bank-science-<us>.mjs` |
| 가져오기 공용 함수 | `scripts/bank-science-lib.mjs` — `importUnit`(새로/전부) · `importSourceOnly`(원문만 더하기) |

`science-lab/bank/work/<us>/`에 들어 있는 것:
- `set1.json`~`set4.json`: 시험지를 그대로 받아쓴 원문이다. **고치지 않는다**(인쇄 오타도 그대로 두고 `uncertain`에 적는다).
- `figmap.json`: 원문 키(`세트-번호`) → 그림 파일 이름.
- `figs/*.webp`: 잘라 낸 그림. **아직 가져오지 않은 단원에만** 있다. 끝난 단원의 그림은 `assets/bank/<u>/`에 있다.
- `map.json`: 분류(유형·오개념) 원고.
- `sim/a.json`(세트1·2), `sim/b.json`(세트3·4): 유사문항 원고.
- 시험지 PDF는 저장소에 넣지 않았다. Drive에서 다시 받는다(`folders.txt`).

### 1-3. 앱 연결

| 무엇 | 위치 |
|---|---|
| 문제은행 목록 (단원 → 세트·문항 수) | `science-lab/v2/units-index.js`의 `BANK` |
| 레슨 없는 단원(문제은행만)의 지도 정거장 | `science-lab/v2/units-index.js`의 `READY` (`bankOnly: true`) |
| 레슨 단원 로더 (원문 연결) | `science-lab/v2/v2.js`의 `UNITS['<u>']`. 원문을 읽으려면 `...(await import('../data/units/<u>.source.js'))`가 들어 있어야 한다 |
| 화면 | `#/bank`(목록) · `#/<u>/exam/<세트>`(단원평가, 틀리면 짝 유사문항) · `#/<u>/exam/<세트>/teacher`(정답표) · `#/<u>/sub/E1`(소단원: 원문 → 유사) |
| 판정 엔진 | `science-lab/v2/judge.js` (`norm`·`judgeShort`·`judgeText`) |
| 검사 | `science-lab/bank/audit.mjs` · `misc-audit.mjs` · `written-audit.mjs` · `audit.test.mjs` · `judge.test.mjs` |

---

## 2. 진행 현황 (2026-10-09 끝)

### ✅ 끝남 — 원문 + 유사 + 앱 연결 + 검사 + main 반영

| 학기 | 단원 | 원문 수 |
|---|---|---|
| 3-1 | Ⅰ 힘과 우리 생활 `s31-u01` · Ⅱ 동물의 생활 `s31-u02` · Ⅲ 식물의 생활 `s31-u03` · Ⅳ 중간평가 `s31-mid` | 80 · 80 · 80 · 50 |
| 3-2 | Ⅰ 재미있는 나의 탐구 `s32-u01`(한 벌) · Ⅱ `s32-u02` · Ⅲ `s32-u03` · Ⅳ `s32-u04` · Ⅴ `s32-u05` · 중간 `s32-mid` · 기말 `s32-fin` | 15 · 70 · 70 · 70 · 70 · 40 · 40 |
| 4-1 | 중간평가 `s41-mid` (Drive 4-1 폴더에는 **기말평가가 없다**) | 50 |
| 4-2 | Ⅱ 물의 상태 변화 `s42-u02` · Ⅲ 그림자와 거울 `s42-u03` · Ⅳ 화산과 지진 `s42-u04` · Ⅴ 물의 여행 `s42-u05`(**세트3까지뿐**) | 70 · 70 · 70 · 45 |
| 5-1 | Ⅰ 과학자는 어떻게 탐구할까요 `s51-u01`(한 벌) | 15 |

`node --test science-lab/bank/*.test.mjs science-lab/v2/*.test.mjs`는 236개 모두 통과한다.

### 🟡 받아쓰기는 끝남 — 다음 단계부터 (`science-lab/bank/work/<us>/`에 자료 있음)

| 단원 | 있는 것 | 다음 할 일 | 지시서 |
|---|---|---|---|
| 4-1 Ⅰ `s41-u01` · Ⅱ `s41-u02` · Ⅲ `s41-u03` | set1~4 · figs | **원문만 더하기**(유사문항·분류·레슨은 이미 있음). 옛 받아쓰기가 Supabase `science_bank_source`에 있으니 정답·유형을 대조한다(읽기만). | `source-only-prompt.md` |
| 4-2 Ⅰ `s42-u01` | set1~4 · figs | 위와 같음 | `source-only-prompt.md` |
| 4-2 중간 `s42-mid` (Ⅰ·Ⅱ·Ⅲ) | set1·2 · figs · **map.json 완성(40키)** | 시험 빌드 | `builder-prompt.md` + §4-D |
| 4-2 기말 `s42-fin` (Ⅲ·Ⅳ·Ⅴ) | set1·2 · figs | 시험 빌드. **set1 Q10 채점 기준 오타**(「더 큰」 → 문항·모범답은 「더 작은」 현무암): 문항과 모범답 기준으로 판정 | `builder-prompt.md` + §4-D |
| 5-1 Ⅱ 온도와 열 `s51-u02` | set1~4(10·20·20·25) · figs · **map.json 완성(75키)** | 레슨 단원 빌드(유사문항 sim부터) | `builder-prompt.md` + `lesson-addendum.md` |
| 5-1 Ⅲ 태양계와 별 `s51-u03` | set1~4(10·20·20·25) · figs | 레슨 단원 빌드. 행성 크기·거리는 원문 표 값만 쓴다 | 위와 같음 |
| 5-1 Ⅳ 용해와 용액 `s51-u04` | set1~4(10·20·20·25) · figs | 레슨 단원 빌드 | 위와 같음 |

### ⬜ 아직 시작 안 함 (교과 순서)

1. 5-1 Ⅴ 다양한 생물과 우리 생활 `s51-u05`(레슨 단원) → 5-1 중간 `s51-mid` → 5-1 기말 `s51-fin`
2. 5-2 Ⅰ `s52-u01`(레슨 단원, 탐구 → 한 벌일 수 있음) → Ⅱ~Ⅴ(문제은행만) → 중간 → 기말
3. 6-1 전 단원 + 중간·기말 → 6-2 전 단원 + 중간·기말

Drive 폴더 id는 `pipeline/folders.txt`에 있다. 5-2·6-1·6-2는 학기 폴더 id만 있으니 하위 폴더를 먼저 나열해 줄을 더한다.

---

## 3. 작업 지시서와 도구 (`science-lab/bank/pipeline/`)

| 파일 | 언제 | 하는 일 |
|---|---|---|
| `transcribe-prompt.md` | 세트마다 1번(병렬) | Drive에서 시험지·정답 PDF를 받아 쪽 그림으로 만든다 → **그대로** 받아써 `work/<us>/set<N>.json`을 만든다. 그림 bbox도 적는다 |
| `figs.py` | 받아쓰기가 다 끝난 뒤 | `python3 -I science-lab/bank/pipeline/figs.py science-lab/bank/work/<us>`를 돌리면 `figs/*.webp`·`figmap.json`·검토용 `sheet.png`가 생긴다. **sheet.png를 눈으로 본다** |
| `builder-prompt.md` | 단원마다 1번 | 분류(`map.json`) → 유사문항(`sim/*.json`) → 설정(`scripts/bank-science-<us>.mjs`) → `importUnit` 실행 → 감사 |
| `lesson-addendum.md` | **레슨이 이미 있는 단원**이면 builder와 함께 | 레슨 문항 b01~b12 유형 지정(`lessonTypes`), 기존 오개념 M코드 유지(`mElement`), 교재 `book.check`·`formative` |
| `source-only-prompt.md` | **유사문항·분류가 이미 있는 단원**(s41-u01~03, s42-u01) | Supabase 옛 받아쓰기와 대조 → `importSourceOnly`로 원문·그림만 더한다 |
| `finish.py` | 빌드 성공 뒤 | `python3 -I science-lab/bank/pipeline/finish.py <u>`: 시험 목록(`audit.test`·`judge.test`) 등록, `BANK`/`READY` 등록, 레슨 단원이면 `v2.js` 로더에 원문 연결, 감사 + 전체 테스트까지 |
| `exam-unit-check.mjs` · `lesson-routes.mjs` | 커밋 전 | 브라우저(Playwright) 점검: 문제은행 목록, 단원평가 세트, 소단원, 레슨 화면, 콘솔 오류 |
| `commit-unit.sh` | 마지막 | `bash science-lab/bank/pipeline/commit-unit.sh <u> <us> "<제목>" "<본문>"`: 그 단원 파일만 커밋한 뒤 브랜치와 main에 올린다 |

지시서 안의 `{UNIT}` 같은 자리표시는 직접 채워서 준다. 실제로 쓴 값의 예는 `scripts/bank-science-s42u05.mjs`(레슨 단원), `s41mid.mjs`(시험), `s32u01.mjs`(한 벌짜리 탐구 단원)이다.

---

## 4. 단원 종류별 순서

### A. 문제은행만 있는 단원 (레슨 없음, 예: 5-2 Ⅱ~Ⅴ)
1. `transcribe-prompt.md` × 세트 수 → 2. `figs.py`, sheet.png 확인 → 3. `builder-prompt.md`(그대로) → 4. `finish.py <u>` → 5. `exam-unit-check.mjs <u>` → 6. `commit-unit.sh`

### B. 레슨이 이미 있는 단원 (예: 5-1 Ⅱ~Ⅴ, 5-2 Ⅰ)
A와 같다. 단 3단계에서 `builder-prompt.md`와 **`lesson-addendum.md`를 함께** 준다(「No lessonTypes…」 줄은 무시하라고 적는다).
- 옛 창작 연습 20문항(`<u>-v001…`)이 새 유사문항으로 **바뀐다**. 그 키를 쓰는 `v2/*.test.mjs`가 있으면 살아 있는 키로 바꾼다(예: `lab-cycle.test.mjs` → `deck:concl0`).
- 5단계에서 `lesson-routes.mjs <u>`도 돌린다.
- `commit-unit.sh`가 교재 파일(`data/book/<u>.book.js`)과 `v2/v2.js`도 함께 넣는다. 판정 엔진(`v2/judge.js`)이나 시험 파일을 고쳤다면 그것도 `git add` 해 둔다.

### C. 유사문항이 이미 있는 단원 (s41-u01·u02·u03, s42-u01)
`source-only-prompt.md` → `scripts/bank-science-<us>.mjs`(importSourceOnly) → `finish.py <u>` → 커밋.
- `misc.js`·`judge.js` 끝에 `// ── 단원평가 원문(source.js) ──` 블록이 붙는다. 정상이다. 손으로 쓴 나머지 부분은 건드리지 않는다.
- `<u>.js` 머리의 `sources.bank` 설명이 아직 「Supabase」라고 되어 있으면 source.js로 고친다.

### D. 중간·기말평가 (`-mid`, `-fin`)
- 받아쓰기 지시서에 **"모든 문항에 `unit` 필드(Ⅰ·Ⅱ… 로마 숫자)"** 줄을 더한다.
- builder 지시: 단원 하나 = 내용 요소 하나. 이미 끝난 단원의 유형 이름과 오개념 문구를 재사용한다. 설정은 `unitTitle: '중간평가'|'기말평가'`, `uKey: 'mid'|'fin'`, `edition: '시매쓰DMC 중간평가'|'… 기말평가'`, `sourceId: 'sci-<학년학기>-mid'`, `no`는 Drive 폴더 번호(Ⅵ=6, Ⅶ=7, 4-1 중간은 Ⅳ=4). 예시는 `scripts/bank-science-s41mid.mjs`.
- 시험의 유형을 재사용하려면 **해당 단원들을 먼저 끝내고** 시험을 만든다.

---

## 5. 실수 방지 — 실제로 틀렸던 것들

**받아쓰기**
- 원문 JSON은 **절대 고치지 않는다**. 인쇄 오타·해설 불일치는 그대로 두고 `uncertain`에 적는다. 예: 3-1 Ⅱ set3 Q5, 3-2 Ⅱ set1 Q10, 4-1 Ⅱ set4 Q10 「①②④⑤⑤」, 4-2 Ⅲ set1 Q15, 4-2 기말 set1 Q10.
- **탐구 단원은 세트가 한 벌**(번호 없는 「최다빈출 단원평가.pdf」)이다. set1로 받아쓰고 설정에 `single: true`를 넣는다(3-2 Ⅰ, 5-1 Ⅰ).
- 세트 수가 단원마다 다르다. 4-2 Ⅴ는 세트3까지다. 없는 세트를 만들어 내지 않는다.
- 그림 규칙
  - 다른 쪽에 있는 공통 그림은 `figure.page`에 쪽 번호를 적는다.
  - 그림이 둘이면 `figure.extra: [{bbox, page}]`에 넣는다. **다른 키 이름은 쓰지 않는다.** `alsoSee`를 썼다가 그림이 빠졌다.
- ○·×는 그 글자 그대로 쓴다. 판정은 ◯·⭕·✕·✖도 같은 기호로 읽는다.
- ㈎~㈑는 판정에서 가~라로 읽는다.

**유사문항**
- 원문 문장을 베끼지 않는다. 같은 유형·난이도로 상황·물체·수치를 바꾼다.
- 선택지 규칙
  - 정답 위치는 ①~⑤가 고르게 나오게 한다(최대−최소 ≤ 2).
  - **정답이 혼자 3자 이상 긴 보기**가 되지 않게 한다.
- 원문이 그림 보기(그림자 모양, 화살표, 거울 글자)라도 유사문항은 **글로 풀 수 있게** 쓴다.
- 금지어(학년 밖 용어): 자기장, 자기력선, 전자석, 전류, 코일, 자화, 원자, 분자, 에너지 전환. 4-2 Ⅲ에서는 굴절도 쓰지 않는다.
- 숫자는 원문 표 값을 쓰거나 「모형 값」·「가상의 기록」이라고 밝힌다. 실제 지진 기록 같은 것을 지어내지 않는다.

**서술형 판정 — 공식 채점 기준보다 엄하게 만들지 않는다** (가장 많이 틀린 곳)
- 기준이 **한 줄**이면 → need **하나**. 모범답에 들어 있는 다른 내용을 요소로 쪼개지 않는다.
  - 4-2 Ⅳ 4-17: 「승강기에서 빨리 내린다」만 본다. 「모든 층 누르기」는 요소가 아니다.
  - 4-2 Ⅴ 2-8: 「농작물」과 「필요」를 한 정규식으로 본다.
- 「둘 중 어느 것이든 정답」이면 → need 하나에 `any`로 둘 다 넣는다.
- 「세 가지 중 **두 가지**」면 → `ideas: [[…],[…],[…]]` + `count`로 쓴다.
  - 정답·부분 정답 행이 있으면 `{ideas, count:1}`과 `{ideas, count:2}` 두 need로 만든다(4-2 Ⅴ 1-3).
- 정답 + 부분 정답 행이 있으면 need 두 개로 만든다.
- 정규식은 정규화된 글에 건다(띄어쓰기·문장부호 없음, ㄱ~ㅇ → ㉠~㉧). 활용형(다릅니다·달라요)을 빠뜨리지 않는다.
- 모범답과 `ex.ok`는 ok, `ex.part`는 part, `ex.no`는 두 번째 시도에서도 ok가 아니어야 한다. builder 지시서대로 단원별 점검 스크립트를 돌린다.

**레슨 단원**
- 기존 오개념 코드(M01~Mk)는 **이름을 바꾸거나 지우지 않는다.** 새 코드는 Mk+1부터 붙인다.
- `lessonTypes`에 b01~b12를 **모두** 넣는다. 하나라도 빠지면 importUnit이 멈춘다.
- `lesson.js`·`interact.js`·3D 장면은 건드리지 않는다.

**검사·커밋**
- `audit.test.mjs`는 단원마다 「원문 N개 / 유사문항 N개」 줄을 기대한다. `finish.py`가 옛 숫자(20개)를 지우고 새 줄을 넣는다.
- 커밋 전에 `node --test science-lab/bank/*.test.mjs science-lab/v2/*.test.mjs`가 실패 0이어야 한다.
- 브랜치 `claude/jolly-allen-w57yqh`에 커밋한 다음 같은 커밋을 main으로 fast-forward 한다(`commit-unit.sh`가 한다). force push는 하지 않는다.
- 반쯤 만든 단원은 커밋하지 않는다. 검사를 통과한 단원만 올린다.

**하지 않는 것**
- Supabase에 쓰지 않는다. 대조할 때 읽기만 한다.
- 음성 생성 워크플로(Generate Audio)를 돌리지 않는다.
- 다른 단원의 파일은 건드리지 않는다. 병렬로 돌리는 에이전트끼리 같은 파일을 만지면 안 된다.

---

## 6. 남은 확인 거리 (급하지 않음)

- 4-2 Ⅲ 레슨 b12의 오답 보기에 「빛의 굴절」이 있고, 교재 칩 「반사」에도 굴절이 있다. 단원 밖 용어다.
- 4-2 Ⅳ의 기존 M04 문구와 레슨에 「진도·습곡·지진대」가 남아 있다.
- 4-2 Ⅲ 형성평가 3번째 기준(전등빛·햇빛)에 맞는 원문이 없어 4-13으로 대신했다.
- 5-1 Ⅰ의 T04·T08은 원문이 하나뿐이다. 시험지에 그만큼만 나왔다.
- 4-1 Ⅰ~Ⅲ·4-2 Ⅰ의 옛 원문 310문항은 아직 Supabase `science_bank_source`에도 있다. 앱은 읽지 않는다. 이 단원들의 source.js를 넣은 뒤 지울지는 원장이 정한다.
