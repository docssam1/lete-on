# 1과정 N권 — 교재 번호 꼴에 맞춘 새 생성기 만들기 (공통 지시)

## 무엇을, 왜
지필드 사고력 문제은행(fields-classic/question-bank, vanilla JS ES modules, 빌드 없음).
1과정 1~10권 교재(수업용 원본 N30 PDF)의 문제 번호마다 「그 문제의 꼴을 그대로 내는 생성기」가 이어져 있어야 한다
(원장: 「1:1 매칭이 안되어 있어」 — 예: 2권 1단원 덧셈 매트릭스 19번호가 모두 2×2 표 하나에 이어져 있었다).
이미 번호마다 원본과 견주는 대조를 했고(결과 = 아래 「권 대조 결과」 파일), 이미 있는 유형으로 옮길 수 있는 번호는 옮겼다
(`textbook-remaps.js`). 이제 남은 일: **꼴이 다른 번호마다 그 꼴의 새 생성기를 만들고, 그 번호를 새 유형으로 옮긴다.**

## 먼저 읽을 것
- 저장소 `CLAUDE.md`(길다 — 「1과정 교재 번호 = 그 문제 꼴 생성기 1:1」 절, 「보안 제약」 첫 부분, 색종이 그림 기준·길이 표시(호) 기준 줄).
- 스킬 `.claude/skills/gfield-question-bank-build/SKILL.md` (분수는 빗금 금지 → `math-markup.js`, 그림·캐시 꼬리표).
- 길이를 그림에 쓰면 스킬 `.claude/skills/gfield-textbook-design/SKILL.md` 4-3절(바깥 곡선 점선 호 — `length-dim.js`).
- 본보기 모듈: `fields-classic/question-bank/book02-matrix-generators.js` (꼴 스펙 → 무작위 생성 → 아이 생각으로 풀리는지 풀이기로 확인 → 답 하나만 → 풀이는 아이 말 식).
- 맡은 권의 `textbook-remaps.js` 행과, 맡은 권 단원 정의(`source-data.js`에서 `book-0N` 단원, `typeStudyRefs`).
- 그 권의 기존 렌더러/생성기(`bookNN-renderers.js`, `generators.js`에서 그 권 생성기) — 그림 꼴·색을 맞추고, 쓸 수 있으면 함수를 가져다 쓴다(import).

## 모듈 계약 — 이 파일 하나에 만든다
`fields-classic/question-bank/bookNN-structure-generators.js` (빈 꼴이 이미 있고, source-data.js·generators.js에 연결돼 있다):
- `BOOKNN_STRUCTURE_GENERATORS = { 생성기이름(options) {...} }` — options `{ difficulty(1~3), max, sourceCase }`. 돌려주는 값
  `{ prompt, answer, solution, visual, meta }` — 기존 생성기와 같은 꼴(`generators.js`에서 그 권 생성기 몇 개를 열어 보고 맞춘다;
  답 고르기면 choices 꼴도 거기 따른다). 그림은 `visual: { kind: "fig", html: "<svg …>…</svg>" }` (여러 개면 html 안에 나란히) —
  `app.js`가 `<div class="visual fig-visual">`에 그대로 넣는다. 기존 visual kind를 그대로 쓸 수 있으면 그래도 된다.
  SVG에는 `style="width:Npx;max-width:100%;height:auto"`처럼 폭을 박는다(인쇄 칸에서 늘어나지 않게).
- `BOOKNN_STRUCTURE_TYPE_ROWS = [{ id, domain, middle, label, generator, catalogGroup, catalogStrategy, searchAliases }]`
  — domain/middle은 같은 단원 기존 유형의 값을 따른다. id는 kebab-case, 다른 유형과 겹치지 않게(끝에 `-bN` 붙이기 권장).
- `BOOKNN_STRUCTURE_GUIDES = { 유형id: "핵심 방법 한 줄(아이 말)" }` — 모든 새 유형에 하나씩(검사기가 본다).
- `BOOKNN_STRUCTURE_REMAPS = [["book-0N", 단원(1~4), "activity"|"check"|"practice"|"advanced", 묶음번호, [번호...], 새유형id]]`
  — `textbook-remaps.js`와 같은 꼴. 이미 TEXTBOOK_REMAPS로 옮긴 번호도 다시 옮길 수 있다(뒤에 적용됨). 번호를 못 찾으면 로드 때 오류.

## 지킬 것
- **교재 문장·수·그림 배치를 옮기지 않는다.** 원본은 꼴(칸 수·빈칸 수·조건 종류·묻는 것·그리기/고르기)만 본다. 수와 배치는 새로 뽑는다.
- 답은 늘 하나(또는 문제가 「모두」를 묻는 꼴이면 그 목록 전부). 생성할 때 완전 탐색·풀이기로 확인하고, 안 되면 다시 뽑는다.
- 그림에 답을 보이지 않는다(검사기 「정답값이 시각 자료에 직접 노출됨」). 고르기 문제의 오답은 읽지 않으면 못 고르게(한 칸만 바꾼 오답, 늘 같은 자리 정답 ✕).
- 같은 문제만 내는 생성기 ✕ — 200번 돌려 서로 다른 문제가 충분히 나오는지 본다.
- 한국어: 수 뒤 조사는 받침 따라(`koreanParticle(n,"을","를")`가 generators.js에 있음 — 없으면 본보기 `eul()`처럼), 아이 말(「반 바퀴」), 회사 이름(FC·필즈·클래식) 금지, 「본책」 대신 「교재」, 화면에 빗금 분수 금지.
- **이미 있는 생성기는 고치지 않는다**(다른 번호·권별 테스트가 쓴다). 「partial」 항목도 새 변형 유형으로 이 모듈에 만들고 번호를 옮긴다.
  예외: 대조 결과의 「버그」(글자 오류·답이 늘 같은 자리 등)는 그 생성기에서 최소로 고쳐도 된다 — 고쳤으면 보고.
- 이 권 모듈 밖에서 고쳐도 되는 것: `concept-data.js`(옮긴 번호 때문에 개념 수업의 근거 번호가 틀어지면 맞춤 — 아래), 그 권 검사기
  `bookNN-audit.mjs`(그 권 유형 수 등), 위 「버그」. **고치지 말 것**: 공용 검사기의 기대 숫자(`concept-quality-audit.mjs`,
  `curriculum-stage-audit.mjs`, `type-precision-audit.mjs`의 합계·권별 수) — 바뀌는 값만 보고한다. `source-data.js`·`generators.js`·`app.js`도
  건드리지 않는다(연결은 이미 돼 있다). 꼭 필요하면 이유와 함께 보고만.
- 승인번호·정답(골든벨·권별 테스트)·개인정보는 이 일과 무관 — 건드리지 않는다.

## 확인 (끝났다고 하기 전에 전부)
1. `node -e 'import("./source-data.js")'`가 오류 없이 로드(번호를 못 찾으면 TEXTBOOK_REMAP_FAILED).
2. 새 생성기마다 300번: 던지지 않음, null 비율 낮음, 답 하나(풀이기 재확인), 서로 다른 문제 수, 조사·빗금 확인.
3. 검사기: `node concept-quality-audit.mjs`, `curriculum-stage-audit.mjs`, `type-precision-audit.mjs`, `source-question-db-audit.mjs`,
   `bookNN-audit.mjs`(맡은 권), `course1-review-audit.mjs`, `book01-02-unit-test-links-audit.mjs`, `node golden-bell-style-audit.mjs`.
   공용 검사기가 **숫자만** 달라 실패하면 그 숫자를 보고(고치지 않음). 다른 실패는 고친다.
   개념 수업 근거 불일치(「evidence」)가 나오면 `concept-data.js`의 그 수업 evidence 번호를 그 유형의 개념 단계(activity) 번호와 같게 맞춘다;
   유형이 개념 번호를 모두 잃어 수업이 남으면, 그 번호가 간 새 유형으로 수업 열쇠를 옮기거나(근거·설명이 맞을 때) 수업을 지운다 — 보고.
   `book04-audit`(fold-number-grid-two-orthogonal)·`taxonomy-search-audit`(라벨 중복)은 원래 실패 — 무시.
4. 화면: 이 worktree를 정적 서버로 띄워(포트는 아래 배정, 예 `npx http-server -p PORT -s` 또는 간단한 node 서버) Playwright로
   `index.html?mode=curriculum&book=book-0N&build=1&as=student&hand=1&week=1&session=<단원>~<차시>~book&student=DEMO`를 열어
   pageerror 0, 새 그림이 칸 밖으로 넘치지 않음을 본다. 새 유형 몇 개는 스크린샷을 찍어 직접 본다(deviceScaleFactor 1).
   Playwright: `NODE_PATH=/opt/node22/lib/node_modules`, `require('playwright')`, `chromium.launch()`. supabase 요청은 `route(/supabase\.co/, r=>r.abort())`.
   참고 스크립트(경로는 /home/user/lete-on 기준이라 worktree 경로·포트로 고쳐 복사해 쓴다):
   `<세션 임시 폴더>/remap/sheets.cjs`,
   `…/scratchpad/audit1/sample.mjs`(유형 샘플), `…/scratchpad/audit1/refs.mjs <book-id>`(번호→유형 표). 임시 파일은 자기 폴더
   `…/scratchpad/wNN/`에.
5. 캐시 꼬리표: 이 모듈을 고쳤으면 source-data.js·generators.js의 이 모듈 import 꼬리표는 **건드리지 않는다**(합칠 때 내가 올린다).

## 끝내기
- worktree 안에서 커밋(메시지 한국어, 정답 값·교재 문장 쓰지 않음, 끝에 두 줄:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` / `Claude-Session: https://claude.ai/code/session_01MVRqTcsXyDi3oQjF49sLzi`). 푸시하지 않는다.
- 보고(짧게, 표): 새 유형 id → 생성기 → 옮긴 번호 · 옮기지 못한 번호와 까닭 · 모듈 밖에서 고친 파일과 까닭 · 공용 검사기 숫자 변화(예상 값) ·
  검사기 결과 · 직접 본 스크린샷에서 걸린 것. 커밋 해시.
- 범위가 크다. 대조 결과 파일의 「새 생성기」「partial 변형」을 번호가 많은 것부터 하고, 시간이 모자라면 한 것까지 확실히 끝내고(검사기 통과) 못 한 목록을 보고한다. 엉성하게 전부보다 확실하게 일부.
