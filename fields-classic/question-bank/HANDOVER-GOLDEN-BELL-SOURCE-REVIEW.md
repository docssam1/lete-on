# FC 골든벨 원본 대조 작업 — 인수인계 (2026-10-09, Claude → GPT)

이 문서 하나로 이어받을 수 있게 썼다. **정답 값은 이 문서에 하나도 없다** — 공개 저장소이기 때문이다.
정답이 필요하면 학생용 원본을 직접 풀고, 비공개 답안 DB(아래 2절)에서 확인한다.

---

## 1. 절대 규칙 (어기면 사고)

1. **정답은 비공개 답안 DB에만 둔다.** 공개 파일(`golden-bell-data.js` 등)에는 `answerRef` 문자열만.
   공개 데이터의 메모 칸(`sourceLocator`·`sourceDiscrepancy`·`sourceHold.reason`·`note`)과
   **커밋 메시지·PR 본문·이런 문서**에도 정답 숫자·글자를 쓰지 않는다.
   금지 꼴 예: "교사용 답(□=N)", "공개 답은 N", "=N으로 검산", "(a/b)".
   → 그냥 "교사용 답안과 대조해 바로잡음"처럼 쓴다. 상세 규칙은 저장소 루트 `CLAUDE.md`의
   "보안 제약" 절(FC 골든벨 부분).
2. **원본 PDF·원본 그림 이미지를 커밋하지 않는다.** 그림은 SVG/CSS로 새로 그린다.
3. **학생용 원본의 글과 그림을 따른다.** 교사용 자료는 답 대조·물음 확인용 참고일 뿐이다.
   교사용 답이 틀린 경우가 실제로 있었다(4절 참고).
4. 데이터를 고친 뒤에는 반드시
   `node fields-classic/question-bank/golden-bell-protection-audit.mjs` (메모 칸 정답 문구도 잡는다).
5. **DB(Supabase) 변경은 원장 승인 후에만.** 새 키 추가도 마찬가지. 기존 값 변경은 백업부터.
6. `fields-classic/prescription/`, `problem-bank/prescription/`은 건드리지 않는다.
7. 분수는 반드시 위아래로 쌓은 분수 표기로 쓴다(`1/32` 같은 빗금 표기 금지).
8. 글자는 검정, 그림은 한 가지 색(파랑)으로 몰지 않는다. 원본에 없는 접기 화살표 등은 넣지 않는다.
   **그림은 풀컬러**(2026-10-13 원장 지시 "우리는 풀컬러 사용하자"): 모양·배치는 원본 그대로, 색은 우리 앱 색으로.
   4권 기준 색 — ●빨강 `#e8503a` · ▲초록 `#2f9e5f` · ■파랑 `#2f6fe0` · ◆보라 `#8e5bd8`, 쌓기나무 노랑 `#ffd45c`,
   관계식 상자 주황 테두리 `#f39a1e`, 저울 대 주황 · 받침 노랑, 보기 ①~⑧은 무지개. 옛 청록 `#2f7f96`은 쓰지 않는다.
   인쇄에도 색이 나오도록 `print-color-adjust:exact`.
   **그림을 그리거나 색·문구를 고칠 때는 스킬 `.claude/skills/golden-bell-figure-style/SKILL.md`부터 읽는다**(색표·아이 말·실수 목록·검사기).
9. 원장 PC의 C 드라이브에는 저장하지 않는다("C드라이브 저장 안돼").
10. 커밋 메시지에 모델 이름을 쓰지 않는다.
11. **회사 느낌을 내지 않는다**(2026-10-13): 화면·인쇄에 「FC」「필즈」「FIELDS CLASSIC」 같은 회사 이름을 쓰지 않는다.
    책 제목 줄은 「1과정」·「골든벨」, 페이지 제목은 「골든벨 학습」. 원본 문장에 학원 이름이 나오면 「학원」으로 바꾸고
    `sourceDiscrepancy`에 적는다(3권 14-(1-1)·(1-3) 선례). 내부 데이터 `learnerStage`의 FC 글자는 화면에 안 나오므로 그대로 둔다.
12. **아이 말로 쓴다**(2026-10-13): 「90°·180°·270°·360°」「¼·½·¾·전체」 같은 각도·분수 말을 쓰지 않는다.
    「시계 방향으로 반의 반 바퀴」「반 바퀴」「반의 반 바퀴씩 세 번」「한 바퀴」「오른쪽으로 뒤집기」로 쓴다.
    원본 문장에 각도가 있으면 바꾸고 `sourceDiscrepancy`에 적는다(4권 8쪽 ⑥ 952 카드 선례). 도우미: `book04-renderers.js` `turnWords()`.

## 2. 저장 위치 (정확한 경로)

| 무엇 | 어디 |
|---|---|
| 작업 폴더 | `fields-classic/question-bank/` |
| 배포 | `main` 푸시 → GitHub Actions "Deploy Lete-on apps to GitHub Pages" 자동 배포 |
| 골든벨 화면 | `golden-bell.html` → `golden-bell.js` |
| **공개 문항 데이터** | `golden-bell-data.js` — `export const GOLDEN_BELL_BOOKS = Object.freeze(<한 줄 JSON>);` 한 줄. 손으로 고치지 말고 스크립트로 JSON을 읽어 고친 뒤 그 줄만 다시 쓴다(5절 패치 예시) |
| **비공개 답안 DB** | Supabase 프로젝트 `fgahqumaldheqettmvqg` · 테이블 `golden_bell_answer_books` (`book_id`, `payload` jsonb, `payload_sha256`). `payload`의 키 = `answerRef` 문자열 |
| 답 불러오기 | `golden-bell-protected.js:67` `hydrateProtectedAnswers` — `answer`·`solution`·`explanation`만 복사. `sourceNote`나 `/history/` 키는 무시(그래서 교정 기록을 거기 둔다) |
| 권별 그림 | `book0N-renderers.js` (`book04Markup` 등의 `switch(visual.subtype)`) |
| 권별 CSS | `golden-bell-book03.css`, `golden-bell-book04.css` (`golden-bell.html`에서 링크) |
| 개념 설명(안내형 가족) | 4권: `golden-bell-book04-guided.js`(`SUPPORTED_FAMILIES`, `renderBook04Guided`) + `golden-bell-guided-experiences.js:12` `BOOK_FOUR_GUIDED_FAMILIES` + 검사기 `golden-bell-book04-guided-audit.mjs`의 `FAMILIES`·`EXPECTED_ANSWER` (셋 다 같이 고쳐야 함). 다른 권 가족도 재사용 가능(9권 `book09-cube`, 1권 `relative-order`를 4권에서 재사용 중) |
| 숨은 쌓기나무 풀이 애니메이션 | `golden-bell-cube-animation.js` (`subtype: "source-hidden-cube"`면 자동) |
| **캐시 꼬리표** | 현재 `?v=20261014b`. 바꿀 파일 5개: `golden-bell.js`, `golden-bell.html`, `app.js`, `golden-bell-guided-experiences.js`, `golden-bell-library.js` (`sed -i 's/20261014b/20261014c/g' …`). `golden-bell-book04-guided.js`를 고쳤으면 `golden-bell-guided-experiences.js` 안의 그 import 꼬리표도 따로 올린다 |
| 4권 작업 도구 | `tools/golden-bell-book04/` — 패치 스크립트 2개(예시), 화면 캡처·인쇄 스크립트, DB SQL 틀(`answers-sql-template.md`) |
| 4권 유형 대조표 | `BOOK04-SOURCE-AUDIT.md` |
| **원본 PDF** | Google Drive `필즈더클래식 문제은행 원본/1과정(N30)/4권` 폴더 — 학생용(무답) PDF와 교사용 PDF. 5~10권은 같은 `1과정(N30)` 아래 권별 폴더. 내려받은 PDF·페이지 이미지는 **저장소 밖 임시 폴더**에만 둔다 |

### answerRef 규칙
- 꼴: `/books/book-04/lessons/<번호>/original/items/<번호>` (칸이 있으면 `…/parts/<번호>`),
  `/books/book-04/lessons/<번호>/experience/check`, `/books/book-04/lessons/<번호>/extension`.
- **문자열로만 연결된다.** 단원 순서를 바꿔도 번호는 그대로 둔다. 새 단원은 **아직 안 쓴 번호**를 쓴다.
- 4권에서 지금 쓰는 단원 번호: 0~18. **다음 새 단원은 19부터.**
- 공개 데이터의 `answerRef` 하나하나에 DB 기록이 있어야 한다. 하나라도 빠지면 그 권 답 불러오기가 깨진다.

### 4권 단원 ↔ answerRef 번호 (화면 순서)
| 화면 순서 | 단원 id | 제목 | 번호 | 원본 쪽 |
|---|---|---|---|---|
| 1 | polyomino-family-count | 붙인 정사각형의 모양을 세어요 | 0 | 3 |
| 2 | flip-rotate-source | 숫자를 돌리고 뒤집어요 | **15** | 5~7 |
| 3 | digital-flip-source | 디지털 숫자를 뒤집고 돌려요 | **16** | 4·8 |
| 4 | cube-min-count | 쌓기나무의 개수를 세어요 | **11** | 16~17 |
| 5 | hidden-cube-count | 보이지 않는 쌓기나무를 찾아요 | 1 | 18 |
| 6 | fold-position-source | 접은 색종이는 어디일까요 | **17** | 10 |
| 7 | fold-cut-source | 접어 자르고 펼쳐요 | **18** | 11~14 |
| 8 | fold-hole-count | 접은 종이의 구멍 수를 세어요 | 2 | 15 |
| 9 | cube-box-fill | 상자의 빈칸을 채워요 | 3 | 19 |
| 10 | multiplication-matrix | 가로와 세로의 곱을 맞춰요 | 4 | 20 |
| 11 | compare-order-source | 크기를 비교해 순서를 정해요 | **12** | 22~24 |
| 12 | compare-difference-source | 수의 크기 차이를 구해요 | **13** | 25~27 |
| 13 | balance-equality-source | 양쪽에서 같은 것을 지워요 | **14** | 28~30 |
| 14 | balance-substitution | 도형을 바꾸어 넣어요 | 5 | 31~33 |
| 15 | order-logic-source | 조건으로 순서를 정해요 | **10** | 36·37·40·41 |
| 16 | table-logic-source | 가능한 선택을 표로 지워요 | 6 | 38·39 |
| 17 | cardinal-placement | 동서남북으로 자리를 찾아요 | 7 | 36·42 |
| 18 | circle-logic-source | 원탁의 이웃 자리를 찾아요 | 8 | 37·43·44 |
| 19 | row-logic-source | 앞뒤 순서로 인원을 세어요 | 9 | 45·46 |

DB `book-04` 현재: **키 323개**, sha 앞 8자리 `402a2b92`. 작업 전 반드시 다시 조회해 확인한다.

## 3. 지금까지 한 일 (전부 main 반영·배포 완료, 마지막은 4권 묶음 6 · 2026-10-13)

- **2권**: 교사용·학생용과 눈으로 대조해 그림·문장 정리, 분수 세로 표기, 빠졌던 물음 되살림, 34쪽 활동 04 2문항 추가.
- **3권**: 화면을 원본 그림·문장대로, 28-(2) 답 교정, 보류였던 8-(8)·29-(1)·20쪽 (2)(3) 되살림.
- **공개 정답 유출 정리**(2·3·6권): 메모 칸의 정답 문구를 지우고 교정 이력은 DB `sourceNote`로 옮김.
  `golden-bell-protection-audit.mjs`에 메모 칸 검사 추가. git 이력은 다시 쓰지 않기로 결정(2026-10-08).
- **4권 화면 정리**: 기존 문항을 학생용 원본 문장·그림대로. 15-(6)·42-(1)은 원본 그림대로(42-(1)은 DB 답도 원본 그림 기준으로 교체).
- **4권 묶음 1**(36·37·39·40·41·44쪽 논리 추리 17문항): 새 단원 `order-logic-source`(번호 10) +
  동서남북·원탁·표 단원에 문항 추가.
- **4권 묶음 2**(16~18쪽 쌓기나무 10문항): 새 단원 `cube-min-count`(번호 11) + `hidden-cube-count`에 18쪽 아래 그림 3문항.
  쌓기나무 그림을 원본과 같은 빗각 그림(`book04-renderers.js`의 `obliqueCubes`)으로 바꿈.
- **4권 묶음 3**(22~27쪽 비교하기 26문항): 새 단원 `compare-order-source`(번호 12)·`compare-difference-source`(번호 13).
  그림 `source-relations`(관계식 상자, `tint`=25쪽 파랑 바탕)·`source-number-cards`·`source-clue-box`.
  개념 설명은 4권 안내형 가족 `book4-compare-order`·`book4-compare-difference`(기준에 수를 대입, 검사기 가족 8개).
  23쪽 그리기 8문항은 순서 보기 고르기형(`answerMode:"choice"`) — 화면은 `golden-bell.js` `choiceButtons`가
  `shape-order-choices` 클래스를 붙여 크게, 인쇄는 20자 이하 보기를 줄바꿈 없이 묶는다.
  **24쪽 추가 Q는 교사용 답이 틀려 관계식대로 넣고 DB `sourceNote`에 기록**. 27쪽 '민이'→'경민이', '한나'→'하나'는
  `sourceDiscrepancy`에 기록. `sourceHold`는 28~30쪽만 남겼고 `sourceCoverage`의 16~17·22~27·36~37·40~41·44쪽을 바로잡음.
- **4권 묶음 4**(28~33쪽 양팔저울 13문항): 새 단원 `balance-equality-source`(번호 14, 28~29쪽 8문항)와
  `balance-substitution`(번호 5)에 31(3)·32·33쪽 5문항. 저울 단원은 한 문항씩 넘기는 `mode:"paged"`로 바꿈.
  저울 그림(`golden-bell.js` `book04SourceBalanceMarkup`)에 마름모 토큰, `targetText`(원본처럼 「● 1개 = ▲ ?개」 줄),
  `targetBalance`(물음 저울을 꼭 그림) 추가. 30쪽 개념은 안내형 가족 `book4-balance-equality`(양쪽에서 같은 것 지우기, 가족 9개).
  **31-(3)은 예전에 `golden-bell-recovery-data.js`(보충 문항)로 이미 들어가 있었다** — 같은 문항이 두 번 보이지 않게
  그 파일에서 4권 항목을 지웠다(답은 같음을 DB에서 확인). DB의 옛 `/recovery/…balance-empty-dish-ga…` 키는 쓰이지 않고 남아 있다.
  `sourceHold`는 34쪽(△n 빈칸)만 남김.
- **4권 묶음 5**(4~8쪽 63문항, 단원 2개로 나눠 커밋):
  - `flip-rotate-source`(번호 15, 5~7쪽 34문항): 5쪽 「1」 뒤집기·돌리기 12, 6쪽 두 번 뒤집기·차례로 움직이기·한 번에 바꾸기 10
    (그리기 → 후보 고르기), 7쪽 숫자판 12(답이 여럿인 판은 `resultContract:{type:"set"}`). 개념 설명은 1권 `mirror-direction` 재사용.
    그림: `source-one-flip`(점선 축·돌리기 기호 + 보기 ①~⑧), `source-digit-flip`, `source-upright-board`(셀마다 `{value, t}`).
    변환은 화면 좌표 행렬 `SCREEN_TRANSFORM`(I·LR·UD·R180·CW·CCW·T·AT). **돌리기 기호 읽는 법: 12시에서 시작해 돌린 만큼 색칠, 화살표가 방향.**
    7쪽 「6」 모양 셀은 9를 반 바퀴 돌린 것이다(교사용과 같음). 8은 반 바퀴 돌려도 같은 모양이라 답에 넣는다.
  - `digital-flip-source`(번호 16, 4쪽 연산 8 + 8쪽 21문항): 7세그먼트 그림 `source-seven-seg`, 8쪽 ⑤는 칸 2개(바뀐 수·계산값).
    개념 설명은 1권 `digital-transform` 재사용. 오른쪽으로 뒤집기 b↔f·c↔e, 반 바퀴 a↔d·b↔e·c↔f, 자리 순서 반대.
  - 63문항 모두 교사용 답과 일치. `sourceHold`의 5~8쪽 항목 삭제.
- **풀컬러·아이 말·회사 이름 빼기**(2026-10-13, 1절 8·11·12번 규칙): 4권 새 그림(쌓기나무·관계식·숫자카드·「1」 보기·
  돌리기 기호·숫자판·7세그먼트·저울)과 4권 안내형 저울 개념 그림을 풀컬러로. 돌리기 기호의 읽어주기 문구(aria)를 각도 → 「반 바퀴」 말로.
  화면 제목·표지·인쇄 대화상자에서 FC 글자 삭제(`golden-bell.js`·`golden-bell.html`), `golden-bell-selected-print-audit.mjs` 기대값도 맞춤.
  3권 14-(1-1)·(1-3)의 학원 이름 → 「학원」, 4권 8쪽 ⑥ 「180°만큼」 → 「반 바퀴」. 캐시 꼬리표 `20261013a`.
- **4권 묶음 6**(10~14쪽 색종이 접어 자르기 18문항, 2026-10-13): 새 단원 `fold-position-source`(번호 17, 10쪽 7문항, 알파벳 고르기)·
  `fold-cut-source`(번호 18, 11쪽 반대쪽 칸 3 · 12~13쪽 펼친 모양 4 · 14쪽 합 4). 그림은 범용 렌더러 `source-fold-panels`
  (`book04-renderers.js`: 패널마다 종이 다각형·접는 선·접힌 가장자리·빨간 굽은 화살표·동그라미·칸 번호, 펼친 후보 ①~④).
  **화살표 읽는 법: 접기 그림은 화살촉 = 종이가 넘어가는 쪽(반대쪽이 그 자리에 남는다). 11쪽·14쪽 04는 원본처럼 펼치는 방향.**
  12~13쪽 그리기는 고르기형 — 자른 모양을 네 사분면에 놓고 펼친 그림(겹치면 가로세로 바꾼 것)으로 후보를 계산해 그렸다.
  개념 설명은 15쪽 `book4-fold-hole-count` 가족을 그대로 재사용(검사기에 「재사용은 첫 사본과 같아야 함」 규칙 추가, 가족 수 9 그대로).
  18문항 모두 독립 접기 모델 계산 = 교사용. `sourceHold`의 10~14쪽 항목 삭제, coverage 갱신.
  ⚠ 이 묶음의 패치 스크립트는 12~13쪽 정답 보기 자리를 담고 있어 **저장소 `tools/`에 넣지 않았다**(작업자 임시 폴더에만).
  캐시 꼬리표 `20261013f`.
- **2·3권과 4권 예전 단원 그림 풀컬러**(2026-10-13, 원장 「색바꿔」): 2권 모양 색표·저울·세는 점·스도쿠·숫자 약속, 3권 넓이·분수 색칠 주황·복면산 카드·마법카드,
  4권 테트로미노·저울 토큰·숨은 쌓기나무 개념·상자 쌓기나무·안내형 「주어진 것」 파랑. 색이 문제 내용인 곳은 그대로 뒀다(스킬 2절 목록).
  공용이라 함께 바뀐 곳: 2·3과정 course-pattern·문제은행의 2권 모양 색, 1권 relative-order 칸 선, 9권 안내형 「주어진 것」 색.
  `golden-bell-style-audit.mjs`가 이제 2·3·4권 그림 규칙의 청록 계열을 색상각으로 잡는다. 캐시 꼬리표 `20261013e`.

## 4. 남은 일 — 이 순서대로

원장이 승인한 계획: 원본에는 있는데 앱에 없는 4권 활동을 **묶음 단위로** 넣는다. 묶음마다 커밋 → main → 보고.

| 묶음 | 원본 쪽 | 내용 | 비고 |
|---|---|---|---|
| ~~3~~ | 22~27 | 비교하기 26문항 | **완료**(3절) |
| ~~4~~ | 28~33 | 양팔저울 등식 8 + 저울 바꾸어 넣기 5 | **완료**(3절) |
| ~~5~~ | 4~8 | 연산 8, 숫자 1 뒤집기·돌리기 ①~⑧, 숫자판 3, 디지털 숫자 20 + 952 반 바퀴 | **완료**(3절) |
| ~~6~~ | 10~14 | 색종이 접어 위치(알파벳) 7·반대쪽 번호 3, 두 번 접어 자른 모양 4, 자른 수의 합 4 | **완료**(3절) |
| 보류 유지 | 2, 3 확장, 34·47 | 정삼각형 등분 그리기, 3쪽 다섯 칸 확장(교사용 전용), 47쪽 □n(원본도 빈칸뿐) | 넣지 않는다 |

**4권 묶음은 모두 끝났다.** 다음: **5~10권 원본 대조**

### 4-2. 5권 (2026-10-13 착수)
- **원본 사정이 4권과 다르다.** 학생용 골든벨(`더클래식_1과정_5N30권_골든벨_220815.pdf`)은 활동 제목만 있는 10쪽이고,
  문제는 **교사용 PPTX 60장**(`…골든벨_221111(E2용).pptx`)에만 있다. 슬라이드에 문제(검정)와 답(빨강 `FF0000`)·풀이(파랑 `0070C0`)가 함께 있다.
- **답 없는 문제지 만들기**: `tools/golden-bell-book05/clean-teacher-pptx.py` → LibreOffice로 PDF → 쪽 그림. 표 안·그림 속 빨간 표시는 남을 수 있어 눈으로 확인.
  원본·결과물은 저장소 밖에만 둔다.
- **대조 결과**: 앱 공개 16문항 + 보류 53장(약 280문항). 쪽별 대조표 초안은 Sonnet 보조가 만들고 검토했다(대조표는 저장소 밖).
- **기존 16문항 바로잡음(2026-10-13)**: 슬라이드 2(수 배열표 — 원본엔 길·화살표 없음, (2) 주어진 수 11·10 누락, (3) 배치 자체가 달랐음),
  29 (3)(「4장 중 3장」 조건 누락), 40 활동 06 (1)(색칠 칸·A·B·C 위치), 59 활동 05~07(파란 풀이식이 문제처럼 나오고 그림에 개수 표시·(1) 답 노출).
  원본 그림은 `book05-renderers.js`의 새 `source-*` 그림(`source-number-table`·`source-digit-cards`·`source-product-grid`·`source-square-pyramid`·
  `source-triangle-rows`·`source-cube-stair`) + `golden-bell-book05.css`. 기존 그림 함수는 문제은행(`app.js`)과 같이 쓰므로 건드리지 않았다.
  답 값은 그대로, DB 풀이 문장 8개만 원본 그림에 맞게 고침(고치기 전 값은 작업자 임시 폴더에 백업). DB `book-05` 50키, sha 앞 8자리 `a7f2d4fd`.
- **5권 묶음 1(슬라이드 3~10 수 배열·수열 32문항, 2026-10-14)**: 패치 `tools/golden-bell-book05/patch-book05-batch1.mjs`(정답 없음).
  - 3~5쪽 6문항은 기존 단원 `path-number-grid`(번호 0) items 3~8에 덧붙임. A·B·C 칸은 `parts`, A+B는 숫자 하나.
  - 새 단원 `number-sequence-source`(번호 4, 6·7·10쪽 9문항)·`radial-rows-source`(번호 5, 8·9쪽 17문항), `mode:"paged"`.
    개념 설명은 7권 `arithmetic-sequence` 안내형 가족을 재사용(check 문장만 단원에 맞게, 렌더러가 문장에서 모델을 계산).
  - 새 그림 `source-sequence`(앞 수 + 상자, 물을 상자 노랑, 쉼표는 앞 수에 붙음) · `source-radial-rows`(가운데 삼각형/사각형 +
    3·4갈래, viewBox 자동) · `source-triangle-numbers`. `source-number-table`은 칸 크기가 화면 폭에 맞춰 줄어든다(7칸 이상 `is-wide`).
  - **조건 문장은 문제 글(`prompt`)에 넣는다** — 한 문제씩 넘기는 화면은 `conditions`를 그리지 않는다.
  - **인쇄 쪽 나눔은 `printGroup`이 아니라 `golden-bell-print-layout.js`가 높이를 재서 자동으로 채운다.** 그림이 크면 쪽당 2문항이 된다(갈래 그림 인쇄 40mm로 6쪽).
  - 원본 오류(앱은 바로잡은 쪽을 보여 줌): 4쪽 03 표의 한 칸 오타(`sourceDiscrepancy`)·답 칸이 앞 문항 답 복사, 7쪽 도전 (2) 교사용 답이 (1) 복사,
    8쪽 그림의 ②·③ 표시가 문제 글과 반대(문제 글을 따름), 9쪽 (4)의 번호 오타·(5) 앞 뜻 없는 「1」, 9쪽 (9) 교사용 답 오류. 답 쪽 내역은 DB `sourceNote`.
  - 32문항 독립 검산(저장소 밖, 표는 길을 다시 만들어 공개 단서 숫자까지 대조) = 교사용 답(위 오류 3건 제외). `sourceHold` S03~S10 8건 삭제,
    coverage public 48 · hold 45. DB `book-05` 50키 → 125키, sha 앞 8자리 `dfc355cd`. 캐시 꼬리표 `20261014a`.
  - ⚠ 검산 스크립트는 문제 글에서 물음을 읽을 때 **조건 문장 뒤의 「(n) …」 부분만** 읽어야 한다(조건 속 「①번 줄의 4번째」를 먼저 잡는 실수를 했다).
- **5권 묶음 2(슬라이드 11~15 달력 연산·요일 29문항, 2026-10-14)**: 패치 `tools/golden-bell-book05/patch-book05-batch2.mjs`(정답 없음).
  - 새 단원 `calendar-arithmetic-source`(번호 6, 11쪽 18문항: 합과 차 5 + 달력 칸 13)·`calendar-weekday-source`(번호 7, 12~15쪽 11문항).
  - 개념 설명: 단원 6은 `progressive-concept`에 단계별 그림(`beats[i].visual`), 단원 7은 7권 `calendar-weekday` 안내형 가족 재사용.
  - 새 그림 `source-sum-pair`(동그라미·덧붙은 수·괄호·합) · `source-calendar-cells`(위아래/두 주/대각선 칸) · `source-month-grid`(일~토, 「일」 빨강) ·
    `source-year-calendar`(Date로 계산한 한 해 달력, 마지막 날 노랑). 원본 사진 달력은 쓰지 않았다.
  - 인쇄: 한 문항 그림 칸은 `max-height:74mm`로 잘린다. 큰 그림(한 해 달력)은 `:has(.b5-src-year)`로 그 제한을 풀었다.
  - **원본 문장이 성립하지 않는 두 곳을 바로잡음(원장 지시 「성립 안 하는 건 수정해」)**:
    14쪽 03 (3)은 같은 요일 두 날짜의 합이 될 수 없는 수(늘 홀수여야 함)라 교사용 풀이와 맞는 수로, 15쪽 05는 「첫 번째 목요일과 두 번째 일요일」이
    어떤 달에서도 성립하지 않아 원본 그림(차 10)·교사용 풀이대로 「두 번째 목요일과 세 번째 일요일」로. 둘 다 `sourceDiscrepancy` + DB `sourceNote`.
    ⚠ 처음엔 14쪽을 다른 수로 고칠 뻔했다 — **고친 조건도 「첫째 금요일 ≤ 7일」처럼 실제 달력에 놓이는지 검산기로 확인할 것.**
  - 요일 답은 DB에 `["화요일","화"]`로 둘 다 받는다. 토요일 모두는 `resultContract:{type:"set"}`.
  - 29문항 독립 검산(달의 1일 요일을 7가지 다 시험해 하나로 정해지는지 확인) = 교사용 답. 12쪽 아래 「10월 · 11 둘레 ±1 ±7」은 교사 발문 그림이라 넣지 않음.
  - `sourceHold` S11~S15 5건 삭제, coverage public 77 · hold 40. DB `book-05` 125키 → 206키, sha 앞 8자리 `51c6b051`. 캐시 꼬리표 `20261014b`.
- **다음**: 보류를 주제 묶음으로 슬라이드 순서대로 — ~~수 배열·수열 3~10~~ / ~~연산·달력 11~15~~ / 최단거리 18~24 / 숫자 카드 26~32 /
  곱셈구구·매트릭스 35~40 / 선분·도형식·분수 41~49 / 삼각수·둘레·사각수 51~58 / 가르기 60. 보류 사유 메모 중 「교사용 나열 누락(29쪽 (4))」,
  「둘째 표 조건 불성립(40쪽)」은 묶음 작업 때 원본으로 다시 확인할 것.

(같은 방식: 학생용 무답 PDF 전 쪽 vs 앱 화면 캡처 → 표로 정리 → 원장 보고 → 화면 수정 → 빠진 활동 묶음 추가).

### 4-1. 묶음 3에서 쓴 방식 (다음 묶음에서 그대로 쓸 것)
- 패치 스크립트: `tools/golden-bell-book04/patch-book04-batch3.mjs`·`patch-book04-batch4.mjs`(단원 추가 + 기존 단원에 문항 덧붙이기 + `sourceHold`·`sourceCoverage` 갱신 예시).
- **새 문항을 넣기 전에 `golden-bell-recovery-data.js`에 같은 문항이 보충 문항으로 이미 있는지 확인할 것**(묶음 4에서 31-(3)이 겹쳤다).
- 답은 학생용으로 직접 풀고, **식에서 거꾸로 다시 계산하는 별도 스크립트**로 26문항 전부 맞춰 본 뒤 DB에 넣었다
  (22쪽 숫자카드는 가능한 짝을 모두 찾아 해가 하나뿐인지도 확인). 이 검산 스크립트에는 답이 들어가므로 저장소에 넣지 않는다.
- 고르기형 문항: `answerMode: "choice"`, `options: [...]`(보기 문자열은 공개 가능), DB `answer`는 보기 문자열 그대로.
  채점은 공백을 지우고 비교한다(`normalizeAnswer`). 정답 보기 위치는 문항마다 섞는다.

## 5. 한 묶음 작업 절차 (묶음 1·2에서 쓴 그대로)

1. **원본 보기**: 학생용·교사용 해당 쪽을 이미지로 크게 본다(PyMuPDF `page.get_pixmap(dpi=200~500, clip=…)`).
   쌓기나무처럼 모양이 중요한 그림은 확대해 칸 높이까지 확인한다.
2. **답 구하기**: 학생용으로 직접 풀고 교사용과 대조. 다르면 식으로 다시 확인하고 원장에게 보고.
3. **데이터 패치**: `tools/golden-bell-book04/patch-book04-batch2.mjs`를 본떠 새 스크립트를 저장소 밖 임시 폴더에 만든다.
   `node patch.mjs $PWD/golden-bell-data.js`. 스크립트는 JSON을 복사해 고친 뒤 `export const GOLDEN_BELL_BOOKS` 줄만 다시 쓴다.
   - 이미 패치됐으면 멈추도록 첫 줄에 확인(`if (lesson("…")) throw`).
   - 원본 문장 그대로. `sourceLocator`에는 "학생용 NN쪽 활동 NN ①"처럼 쪽·활동만.
   - 단원마다 `experience`·`extension` 필수(`similarPractice`는 선택). 칸 답은 `parts`.
   - 인쇄 쪽 나눔은 `printGroup`(같은 번호끼리 한 쪽).
4. **그림**: `book04-renderers.js`에 subtype 추가 + `book04Markup` switch 등록, CSS는 `golden-bell-book04.css`(인쇄용 `@media print` 크기도).
5. **DB**: `tools/golden-bell-book04/answers-sql-template.md` 절차 그대로(현재 sha 조건 · 새 키 비었는지 · sha 재계산 · 키 수 확인).
   답 JSON은 저장소 밖에서만 만든다.
6. **캐시 꼬리표** 올리기(2절의 5개 파일).
7. **확인**(6절) → 커밋(메시지에 정답 금지) → 작업 브랜치 푸시 → 원장 허락 후 main 반영 → Actions 배포 성공 확인 → 보고.

## 6. 확인 명령과 통과 기준

```bash
# 저장소 루트에서 정적 서버
python3 -m http.server 8797 --directory <저장소 루트>   # 백그라운드로

cd fields-classic/question-bank
node golden-bell-protection-audit.mjs        # GOLDEN_BELL_PROTECTION_OK
node book04-audit.mjs                         # BOOK04_AUDIT_OK
node golden-bell-book04-guided-audit.mjs      # BOOK04_GUIDED_AUDIT_OK families=9 (가족 추가 시 수 증가)
node course1-review-audit.mjs                 # 누락·중복 0건
node golden-bell-cube-animation-audit.mjs     # CUBE_SOURCE_ANIMATION_OK
node golden-bell-style-audit.mjs             # GOLDEN_BELL_STYLE_OK (색·회사 이름·각도 말, 2026-10-13)
```
- 브라우저 검사들은 `CODEX_NODE_MODULES`(playwright·pdf-lib가 있는 node_modules 경로)가 필요하다.
- **이미 실패하던 브라우저 검사 3개**(기본 포트 8794, `FIELDS_BASE_URL=http://127.0.0.1:<포트>`로 바꿀 수 있음).
  변경 전 main을 `git worktree`로 따로 띄워 같은 지점에서 실패함을 확인했다(2026-10-11).
  **같은 지점에서 실패하면 정상**, 다른 곳에서 실패하면 이번 변경 탓이다.
  - `golden-bell-book04-hidden-cube-browser-audit.mjs`: 개념 단계의 「4개」 선택 버튼이 disabled라 클릭에서 멈춤.
  - `golden-bell-book02-browser-audit.mjs`: "number-splitting: source questions must begin locked".
  - `golden-bell-book03-browser-audit.mjs`: "unit-area-shapes: source opened before concept completion".
  - 2026-10-13 변경 전후 비교에서 같은 지점에서 실패한 것도 더 있다: `golden-bell-book03-guided-audit.mjs`("unit-area-shapes: concept check missing"),
    `golden-bell-cover-picker-audit.mjs`, `golden-bell-progress-label-browser-audit.mjs`("book-01/digital-turn-flip/1440"),
    `golden-bell-book01-source-browser-audit.mjs`. 비공개 답안 파일이 필요한 검사(balance·grading·selected-print 등)는 여기서 못 돌린다.
- 화면: `tools/golden-bell-book04/capture-lessons.mjs`(사용법은 파일 첫 줄). `playwright-core`가 설치된 폴더에 복사해 실행.
  콘솔 오류 0건이어야 하고, 찍은 그림을 원본 쪽 이미지와 나란히 놓고 눈으로 비교한다.
- 인쇄: `tools/golden-bell-book04/print-lessons.mjs` → PDF를 이미지로 바꿔 확인.
- 채점: 답안 서버 응답을 가짜로 넣어(`**/functions/v1/golden-bell-answers`를 route로 가로채 `{answers:{…}}`) 정답·오답이
  각각 맞게 채점되는지 문항 몇 개씩 본다. 이 시험 스크립트에는 정답이 들어가므로 **저장소에 넣지 않는다.**

## 7. 실제로 했던 실수 (반복 금지)

- 메모 칸(`sourceLocator` 등)에 "교사용 답(…)"처럼 정답을 적어 공개 파일로 나간 일 → 검사기에 걸리게 했다.
- CLAUDE.md 예시 문장에 실제 정답을 넣었던 일 → 자리표시로 바꿈. **문서 예시에도 실제 값 금지.**
- 새 `answerRef`를 만들고 DB 기록을 빠뜨리면 권 전체가 깨진다 → 추가 전 목록 일치 확인.
- 구멍 그림 SVG에 폭을 안 줘서 화면·인쇄에서 폭 0으로 사라졌다 → CSS에 `width` 명시.
- `pkill -f "http.server …"`은 종료 코드 144를 돌려준다 → `&&`로 뒤 명령을 잇지 말 것(뒤가 안 돈다). 같은 이유로 서버까지 죽을 수 있으니 다시 띄울 것.
- 정답 처리된 입력칸은 잠긴다 → 같은 문항에 오답 재입력 시험을 하면 입력 대기로 멈춘다(문항을 다시 열거나 순서를 바꿀 것).
- 원탁의 왼쪽·오른쪽은 **가운데를 보고 앉은 사람 기준**(교사용 37쪽 확인).
- 교사용 그림의 오기를 따라 앱 그림을 바꿨던 일(42-(1) ㉮ 위치) → 원장 지시: **원본 학생용 그림이 기준**, 답을 그림에 맞춘다.
- 원본에 없는 숫자(층수·전체 개수)를 그림에 적어 답이 드러난 일(18쪽) → 원본에 없는 정보는 그리지 않는다.
- `git stash`를 반복문 안에서 잘못 써서 작업이 사라질 뻔함 → 기준선 비교는 `git worktree`로 따로 체크아웃해서 한다.

## 8. 작업 지시가 있는 곳 (우선순위 순)

1. 원장의 최신 지시(대화).
2. 저장소 루트 `CLAUDE.md` — "보안 제약"의 FC 골든벨 절(정답 보호 규칙).
3. **이 문서** — 진행 상황·남은 묶음·절차.
4. `BOOK04-SOURCE-AUDIT.md` — 4권 유형·원본 위치 대조표.
5. `HANDOVER-GPT.md`, `HANDOVER.md` — 문제은행(골든벨 이전) 전반 인수인계. 골든벨 원본 대조 작업에는 이 문서가 우선한다.
