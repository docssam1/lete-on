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

## 2. 화면 가득 틀 (넓은 화면 981px 이상)
- 1·2단계는 창 전체를 쓴다 — 가운데 상자·바깥 여백 없음, 페이지는 스크롤하지 않고 칸마다 따로 넘긴다(`styles.css` 「화면 가득」 블록, `body[data-bank-step]`로 켠다).
- 1단계: `.builder-body`를 `display: contents`로 풀고 `#builderPanel` 격자 영역 `head / tabs / search·side / main·side / main·dock`.
- 좁은 화면은 위아래로 쌓이고 아래 줄은 따라 내려온다(sticky). 레이아웃 검사기는 넓은 화면의 아래 줄을 static으로 받는다.
- **떠 있는 창(미리보기)은 오른쪽 설정 칸·「문제 구성 확인」을 덮지 않는다** — `positionTypePreview`가 설정 칸 왼쪽 끝을 오른쪽 한계로 쓴다(덮어서 단추를 못 누른 전례).

## 3. 문제가 어디서 왔는지 보이게
- 기준 문제 글(`reference`): 교재 `「N권 단원 · 단계(활동 01 확인 01~03) · 유형」`, 단원 테스트 `「N권 단원 테스트 7번 · 이름」`, 시험지 `「○○ 3번」`. 2단계는 `sourceOf()`로 묶음(권·단원 / 단원 테스트 / 시험지)과 원본 번호를 뽑아 **묶음이 바뀔 때마다 구분 줄**, 카드·표에 원본 번호를 단다. 그냥 1~20번만 늘어놓지 않는다.
- 같은 기준 문제의 문항은 이어서 놓는다(`references.length >= count`가 아니면 `floor(index × refs / count)`로 묶음). 「섞어서」만 섞는다.
- 교재 단원별 목록은 **단원별만**. 권 머리 설명 칸·단원 테스트 통합 목록은 뺐다(원장 「필요 없잖아」「아래 단원별로 구분한 것만」). 권별테스트 유사문제는 주소로 고른다: `?mode=curriculum&book=book-0N&set=unit-test`(시작 화면 「시험지 만들기」, 원문 풀기의 「틀린 번호만」 `&numbers=3,7`).

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
