---
name: gfield-question-bank-build
description: 지필드 사고력 문제은행(fields-classic/question-bank) 화면·문항·수식·그림을 만들거나 고칠 때의 제작 기법 — 3단계 흐름(범위 선택 → 학습지 상세 편집 → 인쇄 설정), 화면 가득 틀, 출처 구분, 미리보기는 문제만, 수식은 MathML 공통 모듈, 칠판(SVG) 분수, 그림 채움, 색·글꼴, 캐시 꼬리표, 검사기. 문제은행 화면·학습지·미리보기·분수/거듭제곱 표기를 손대기 전에 먼저 읽는다.
---

# 지필드 문제은행 제작 기법

원장 확인(2026-10-27)으로 정한 것들이다. 디자인 규칙(색표·글꼴·표지·내지)은 `gfield-textbook-design`, 골든벨 그림 색표는 `golden-bell-figure-style`,
정답 보호는 CLAUDE.md 「보안 제약」이 먼저다. 이 문서는 **문제은행을 어떻게 만드는지**(구조와 기법)만 적는다.

## 1. 3단계 흐름 (`index.html` · `app.js`)
| 단계 | 화면 | 하는 일 |
|---|---|---|
| 1 범위 선택 | `#builderPanel` | 시험지별 · 교재 단원별 · 유형별 탭, 왼쪽 목록 / 오른쪽 문제 수·단계·배열·답안, 오른쪽 아래 「문제 구성 확인」 |
| 2 학습지 상세 편집 | `#editorSection` (`renderEditor`) | 왼쪽 탭 「단원 요약 · 새 문제 추가 · 쌍둥이 · 유사」, 오른쪽 먹색 판 「선택한 문제 목록」, 아래 줄 「이전 · 단계별 개수 · 문제 수 · 다음 단계」 |
| 3 인쇄 설정 | `#worksheetSection` | 인쇄 양식(표지·내지·본문 꼴·단 수) · 답안 · 인쇄. 「← 상세 편집」으로 2단계로 |
- 단계 바꾸기는 `setStepView(n)` 하나로 한다(`body[data-bank-step]`도 여기서). 문항을 고친 뒤 다시 그리기는 `refreshQuestions()` — 보이는 단계(편집/인쇄)를 알아서 고른다. `renderWorksheet()`를 직접 부르지 않는다.
- 문항 만들기는 `makeQuestions()`(화면 전환 없음). 선생님은 `buildQuestions()` → 2단계, 학생(`as=student`, 유사문제 바로 풀기)은 2단계를 거치지 않고 바로 3단계. 3단계의 「새 문제」는 `regenerateQuestions()`(그 자리에서).
- 2단계를 떠나면 편집 칸(`#edList`·`#edPane`)을 비운다 — 숨은 그림이 인쇄 화면의 그림과 겹쳐 세어진 전례(검사기 40 ≠ 20).
- 쌍둥이·추가는 같은 유형 생성기로 만들고 `problemSignature`로 목록에 이미 있는 문제를 거른다. 원문 문항(`generationCase.mode === "source"`)은 쌍둥이를 만들지 않는다. 최대 50문제.

## 1-1. 스스로 공부 = 한 주(한 단원) 흐름 (원장 2026-10-27)
- 덱(`study.html?book=&unit=`)은 **단원 하나 = 한 주**: 개념 → 게임 → 워밍업(화면 이름, 코드는 `bell`) → 공부하기 → 과제 → 단원 평가(semi test) → (그 권의 마지막 단원이면) 권별 테스트 → 도착. 차시로 나누지 않는다(`&part=`는 무시, `&at=game`처럼 장 종류로 연다).
- 공부하기·과제·단원 평가는 **문제가 장 안에 나온다** — 문제은행 학생 화면을 `iframe#workFrame`으로: `index.html?mode=curriculum&book=&build=1&as=student&embed=1&picks=…`. 「🖨 인쇄해서 풀기」는 같은 주소에 `print=1`(새 창). 문제마다 「유사 문제 풀기」, 위 「모두 유사 문제로」.
- `&picks=유형~단계~본책 번호~단원|…`: 본책 번호마다 한 문제(순서 그대로, 단계마다 난이도·단계 꼬리표 `applyStudyStage`). 그 단계를 못 만들면 가까운 단계로(`NEAR`). 단원에 없는 유형(권별테스트에만 있는 것)은 연습 난이도로.
- 과제 = 단원 유형마다 연습 1문제, 단원 평가 = 유형마다 심화 1문제 + `&test=1&testId=<권>-u<단원>`.
- `&test=1`: 문제마다 채점하지 않고 끝의 「채점하기」 → 화면에 쓴 답은 자동 ○✕, 그림 답·인쇄해서 푼 것은 ○✕를 눌러 → 유형별 진단 → 「약점 유형 공부하기」(틀린 유형 × 2문제, picks). 결과는 `localStorage fields-classic-test:<학생>:<testId>`와 덱에 `postMessage(test-result)`.
- 권별 테스트(`unit-test-viewer.html`)도 ○✕ 뒤 **유형별 진단**과 약점 유형 학습지(picks)를 낸다.
- 시작 화면 대단원 → 「이번 주 공부 시작하기」 하나 + 그 주 순서 목록, 단원 카드 끝에 권별 테스트 카드.
- 덱의 장 만들기와 독쌤 말은 `study-deck.js` 하나(`buildWeekSlides` · `slideLine` · `FIXED_LINES`). 말 id = `fcs-<종류>-<글 해시>` → 독쌤 복제 음성. **덱 말을 고치면 `node fields-classic/question-bank/tools/export-study-voice.mjs`**(목록 `data/voice/study-deck.voice.json`, `--check`로 확인). 점수가 들어가는 말은 기기 음성.
- **학습 기록·내 학습 상황**(원장 「학생이 직접 학습 상황을 · 수행률 진도」): `study-progress.js`(`saveRecord`·`readRecord`·`loadRecords`·`weekRate`) 하나로만 저장한다 — 종류 `week`(덱에서 본 장, 수행률 = 본 장 ÷ 모든 장, 단원 평가는 채점까지) · `test`(단원 평가) · `book-test`(권별 테스트). 화면 `my-study.html`(권마다 수행률 · 진도 · 단원 평가 평균 · 권별 테스트 · 주차별 막대 · 약점 유형 다시 공부). 시작 화면 단원 카드에 수행률 막대.
- **지금은 데모**(원장 「우선은 데모로 두고 나중에 승인 페이지 만들자」): 기록은 이 기기(localStorage `fields-classic-rec:<학생>:<종류>:<열쇠>`). 학생 세션(`sessionStorage gfield_fields_session`, fields-auth)이 있으면 서버 함수 `fields-progress`(save · mine · class · student — class·student는 DOCSSAM 관리자만)가 표 `fields_study_records`에도 저장한다. 문제 글·정답은 넣지 않는다(점수·장 열쇠·유형 id만).
- **승인(로그인) `login.html`**: 승인번호 + 이름 → `fields-auth` login(12시간 세션, `sessionStorage gfield_fields_session · gf_n · gf_t`). 학생 → `start.html?student=<이름>`, DOCSSAM → `teacher.html`. 「로그인 없이 둘러보기」= 데모(이 기기에만). 서버에는 **로그인한 학생 자신의 이름으로 연 공부만** 저장한다(선생님이 둘러본 것·다른 이름은 저장 안 함).
- **지금은 다 접속된다**(원장 「지금은 다 접속되는 걸로」): 로그인 없이도 모든 화면이 열린다. 로그인 페이지 아래 큰 「체험하기」(= DEMO). 선생님 보기를 로그인 없이 열면 **이 기기에 저장된 학생 기록**만 보인다(서버의 승인 학생 기록은 학생 이름·진도라 관리자 로그인 뒤에만).
- **선생님 보기 `teacher.html`**(관리자로 로그인하면 서버 기록): 권마다 학생별 1~4주 수행률·단원 평가·권별 테스트·약점 유형 수·최근, 이름 → 그 학생의 `my-study.html`(서버 기록), 반 전체 약점 유형 → 그 유형으로 학습지(문제은행 2단계).
- 이 클라우드에서는 Supabase 연결이 막혀 있다 — 화면 흐름은 Playwright `page.route`로 fields-auth·fields-progress 응답을 흉내 내 확인한다.

## 2. 화면 가득 틀 (넓은 화면 981px 이상)
- 1·2단계는 창 전체를 쓴다 — 가운데 상자·바깥 여백 없음, 페이지는 스크롤하지 않고 칸마다 따로 넘긴다(`styles.css` 「화면 가득」 블록, `body[data-bank-step]`로 켠다).
- 1단계: `.builder-body`를 `display: contents`로 풀고 `#builderPanel` 격자 영역 `head / tabs / search·side / main·side / main·dock`.
- 좁은 화면은 위아래로 쌓이고 아래 줄은 따라 내려온다(sticky). 레이아웃 검사기는 넓은 화면의 아래 줄을 static으로 받는다.
- **떠 있는 창(미리보기)은 오른쪽 설정 칸·「문제 구성 확인」을 덮지 않는다** — `positionTypePreview`가 설정 칸 왼쪽 끝을 오른쪽 한계로 쓴다(덮어서 단추를 못 누른 전례).

## 3. 문제가 어디서 왔는지 보이게
- 기준 문제 글(`reference`): 교재 `「N권 단원 · 단계(활동 01 확인 01~03) · 유형」`, 단원 테스트 `「N권 단원 테스트 7번 · 이름」`, 시험지 `「○○ 3번」`. 2단계는 `sourceOf()`로 묶음(권·단원 / 단원 테스트 / 시험지)과 원본 번호를 뽑아 **묶음이 바뀔 때마다 구분 줄**, 카드·표에 원본 번호를 단다. 그냥 1~20번만 늘어놓지 않는다.
- 같은 기준 문제의 문항은 이어서 놓는다(`references.length >= count`가 아니면 `floor(index × refs / count)`로 묶음). 「섞어서」만 섞는다.
- 교재 단원별 목록은 **단원별만**. 권 머리 설명 칸·단원 목록에 섞인 단원 테스트 목록은 뺐다(원장 「필요 없잖아」「아래 단원별로 구분한 것만」).
- **권별평가는 심화 옆 다섯째 칸**(원장 「심화 배너 옆에 권별평가 동일 문제」): 단계 줄과 설정 칸 「교재 학습 단계」에 「권별평가」, 누르면 단원 목록 대신 그 권의 25문항 번호 목록(`state.curriculumView = "unit-test"`, `setCurriculumView`). 고른 것은 단계를 바꿔도 남는다. 권별평가만 고르면 문제 수 = 고른 번호 수(`syncUnitTestCount` — 원본 구조라 같은 번호를 되풀이하면 같은 문제가 된다). 단계 꼬리표는 `UNIT_TEST_STAGE`(「권별평가」). 주소 `?mode=curriculum&book=book-0N&set=unit-test`도 이 칸을 연다(시작 화면 「시험지 만들기」, 원문 풀기의 「틀린 번호만」 `&numbers=3,7`).

## 4. 미리보기는 문제만
- 「보기」 미리보기 = 이름 한 줄 + 문제 글 + 그림. 단계 띠·대표 개념·개념 발판·학습 지도 상자를 넣지 않는다(원장 「너무 복잡해」).
- 틀: 종이 바탕 `#fdfbf5`, 머리는 `#f7f2e7` + 초록 밑줄 2px, 글씨 Pretendard — 이름 16px/700, 문제 15px/600.

## 5. 색 · 글꼴 (화면)
- 화면 글꼴은 Pretendard(`'FC Sans'`, `assets/fonts/pretendard-var.woff2`, 100~700). 문제은행 머리줄·1단계·미리보기·2단계에 쓴다. 인쇄 본문은 `print-templates.css` 규칙(명조·흑백)을 그대로 둔다.
- 파랑 금지 — 선택·주 단추·체크는 깊은 초록 `#2f6b4a`(진 `#1e4631`, 옅은 `#e9f0e7`), 선 `#e2d9c6`·`#c9bda2`, 보조 글자 `#7a6f5c`. 학습 단계 색: 개념 `#8fb89c` · 유형 `#2f6b4a` · 연습 `#a87c22` · 심화 `#b4512e`(띠·막대 모두 같게).
- 예전 파란 규칙은 지우지 않고 맨 끝 「따뜻한 종이 + 깊은 초록」 블록에서 덮는다(`#builderPanel`·`.type-preview` 범위 + 변수 `--blue*`를 초록으로).

## 6. 수식은 MathML 공통 모듈 하나 (`math-markup.js` · `math-markup.css`)
- 브라우저에 들어 있는 MathML만 쓴다. KaTeX·MathJax 같은 외부 라이브러리·CDN을 쓰지 않는다.
- 함수: `frac(분자, 분모)` · `mixed(자연수, 분자, 분모)` · `part()`(다른 수식 안의 분수, 연분수) · `box("가")`(빈칸 상자, `null`·`"□"`도 빈칸) · `pow` · `sqrt` · `root` · `sub` · `expr(…)`(한 줄 수식) · `rowPart(…)` · `mathText(html)`(글 속 `3/5`·`(1×2)/(3×2)`·`2^3`·`n²`를 수식으로, 날짜처럼 빗금이 이어지면 그대로).
- **빗금 분수(3/5)를 화면·인쇄에 쓰지 않는다.** 새로 분수를 그리는 곳은 이 모듈만 부른다 — 권마다 따로 `<span class="frac">…` 를 만들지 않는다(예전에 9가지가 따로 있었다).
- 모양: 숫자는 둘레 글꼴, 분수 안의 분수도 크기를 줄이지 않는다(`math-style: normal; math-depth: 0`), 빈칸 상자는 보라 테두리 `#8e5bd8`(그림 색표), 근호만 수식 글꼴. 예전 분수 칸(`.fraction`·`.frac`·`.tx-fracs span`)에 수식이 들어오면 `:has()`로 틀을 푼다.
- 수식을 쓰는 화면(html)마다 `math-markup.css`를 싣는다.

## 7. 칠판(손글씨 판서, SVG) 속 분수
- SVG 안에는 MathML을 넣을 수 없다 → `concept-board.js` `splitFractions` + `stackedText`가 조각마다 글자를 따로 놓고 가로줄을 긋는다(분자·분모 0.9배 크기). 손글씨 글꼴이 늦게 오면 `document.fonts.ready` 뒤 다시 잰다.
- 칠판 확인 문제의 질문·보기·정답 말, 아래 자막은 HTML이라 `mathText`.
- **7권(달력) 칠판은 바꾸지 않는다** — 「3/5」가 날짜(3월 5일)다(`boardId`가 `book-07/`로 시작하면 끈다). 대본에 날짜를 쓸 때 다른 권에서도 같은 일이 생기면 이 예외를 넓힌다.

## 8. 그림
- **문제 글을 상자에 다시 쓰지 않는다**(원장 「박스 안에 문제 설명하는 거 안 하기로 했잖아」). 조건이 글에 다 있는 문장제(귤 나누기·구슬 주고받기·3대1 나누기·홀짝 합의 차)는 `visual`을 두지 않는다. 숫자 카드처럼 원본에 그림이 있으면 그림(카드)만 그리고 기준 수·조건 줄은 글에만. 「다음 조건」「그림과 같이」처럼 그림 칸에만 정보가 있는 문항은 그대로 둔다.
- **그림의 채움은 그림 안에 적는다**(`fill="none"`·`fill="#fff"` 속성). CSS에만 두면 그 CSS가 없는 화면(문제은행 `styles.css`)에서 SVG 기본값(검정)으로 칠해진다 — 수직선 호·빈칸이 검은 덩어리로 나온 전례.
- 색은 그림 색표(`golden-bell-figure-style`): 옛 청록(`#4f7487` 등) 금지 — 고친 뒤 `node fields-classic/question-bank/golden-bell-style-audit.mjs`.

## 9. 캐시 꼬리표
- 파일을 고치면 그 파일을 부르는 곳의 `?v=`를 바꾸고, 그 부르는 파일도 바뀌었으니 다시 그 위로 — html까지 올라간다. 손으로 하지 말고 「바뀐 파일 이름 → 부르는 곳 바꾸기 → 바뀐 js를 다시 목록에」 반복하는 작은 스크립트로 한다(이번 세션의 방식). 하나라도 빠지면 학생 화면에 옛 모듈이 섞인다.

## 10. 검사 (고친 뒤 반드시)
- 정답 보호 `golden-bell-protection-audit.mjs` · 그림 색 `golden-bell-style-audit.mjs` · 권별 `bookNN-audit.mjs` · 과정 레슨 `golden-bell-course*-audit.mjs`.
- 브라우저: `question-bank-layout-browser-audit.mjs`(85항목) · `question-bank-compact-visual-audit.mjs`(그림 칸 넘침) · `question-bank-answer-print-audit.mjs` · 골든벨 흐름 `FLOWS=frac golden-bell-3d-game-browser-audit.mjs`.
  - 이 클라우드에서는 `CODEX_NODE_MODULES`(playwright + pdf-lib가 든 node_modules)·`FIELDS_BASE_URL`·`USERPROFILE`을 준다. 정적 서버는 **Range 요청과 폴더 index.html**을 받아야 한다(`python3 -m http.server`는 Range를 못 받아 영상 검사가 멈춘다).
  - 1단계 흐름이 바뀌면 검사기도 같이 고친다(「문제 구성 확인」 뒤 `#edNext`를 눌러 3단계로).
- 이미 실패하던 검사(1·2권 권별테스트 인쇄 쪽수 15≠13, 교재 개념 인쇄 PDF 제목, 옛 소개 페이지 검사)는 바뀌기 전 결과와 비교해 「원래 실패」인지 확인하고 보고한다.

## 11. 하지 말 것
- 골든벨 원본 정답을 공개 파일·화면 녹화·커밋 메시지에 쓰지 않는다(숏릴의 골든벨 장면도 답을 쓰지 않는다).
- 참고 서비스(매쓰플랫 등)는 배치만 본다 — 이름·로고·파랑을 가져오지 않는다.
- 토스 UX 라이팅 스킬로 문구를 고치지 않는다(원장이 껐다). 「학습 순환」 같은 AI 같은 말을 쓰지 않는다.
