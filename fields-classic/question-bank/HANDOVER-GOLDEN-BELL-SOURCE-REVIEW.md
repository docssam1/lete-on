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
9. 원장 PC의 C 드라이브에는 저장하지 않는다("C드라이브 저장 안돼").
10. 커밋 메시지에 모델 이름을 쓰지 않는다.

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
| **캐시 꼬리표** | 현재 `?v=20261009c`. 바꿀 파일 5개: `golden-bell.js`, `golden-bell.html`, `app.js`, `golden-bell-guided-experiences.js`, `golden-bell-library.js` (`sed -i 's/20261009c/20261009d/g' …`) |
| 4권 작업 도구 | `tools/golden-bell-book04/` — 패치 스크립트 2개(예시), 화면 캡처·인쇄 스크립트, DB SQL 틀(`answers-sql-template.md`) |
| 4권 유형 대조표 | `BOOK04-SOURCE-AUDIT.md` |
| **원본 PDF** | Google Drive `필즈더클래식 문제은행 원본/1과정(N30)/4권` 폴더 — 학생용(무답) PDF와 교사용 PDF. 5~10권은 같은 `1과정(N30)` 아래 권별 폴더. 내려받은 PDF·페이지 이미지는 **저장소 밖 임시 폴더**에만 둔다 |

### answerRef 규칙
- 꼴: `/books/book-04/lessons/<번호>/original/items/<번호>` (칸이 있으면 `…/parts/<번호>`),
  `/books/book-04/lessons/<번호>/experience/check`, `/books/book-04/lessons/<번호>/extension`.
- **문자열로만 연결된다.** 단원 순서를 바꿔도 번호는 그대로 둔다. 새 단원은 **아직 안 쓴 번호**를 쓴다.
- 4권에서 지금 쓰는 단원 번호: 0~11. **다음 새 단원은 12부터.**
- 공개 데이터의 `answerRef` 하나하나에 DB 기록이 있어야 한다. 하나라도 빠지면 그 권 답 불러오기가 깨진다.

### 4권 단원 ↔ answerRef 번호 (화면 순서)
| 화면 순서 | 단원 id | 제목 | 번호 | 원본 쪽 |
|---|---|---|---|---|
| 1 | polyomino-family-count | 붙인 정사각형의 모양을 세어요 | 0 | 3 |
| 2 | cube-min-count | 쌓기나무의 개수를 세어요 | **11** | 16~17 |
| 3 | hidden-cube-count | 보이지 않는 쌓기나무를 찾아요 | 1 | 18 |
| 4 | fold-hole-count | 접은 종이의 구멍 수를 세어요 | 2 | 15 |
| 5 | cube-box-fill | 상자의 빈칸을 채워요 | 3 | 19 |
| 6 | multiplication-matrix | 가로와 세로의 곱을 맞춰요 | 4 | 20 |
| 7 | balance-substitution | 도형을 바꾸어 넣어요 | 5 | 31 |
| 8 | order-logic-source | 조건으로 순서를 정해요 | **10** | 36·37·40·41 |
| 9 | table-logic-source | 가능한 선택을 표로 지워요 | 6 | 38·39 |
| 10 | cardinal-placement | 동서남북으로 자리를 찾아요 | 7 | 36·42 |
| 11 | circle-logic-source | 원탁의 이웃 자리를 찾아요 | 8 | 37·43·44 |
| 12 | row-logic-source | 앞뒤 순서로 인원을 세어요 | 9 | 45·46 |

DB `book-04` 현재: **키 142개**, sha 앞 8자리 `03137feb`. 작업 전 반드시 다시 조회해 확인한다.

## 3. 지금까지 한 일 (전부 main 반영·배포 완료, 마지막 커밋 `49dc836e`)

- **2권**: 교사용·학생용과 눈으로 대조해 그림·문장 정리, 분수 세로 표기, 빠졌던 물음 되살림, 34쪽 활동 04 2문항 추가.
- **3권**: 화면을 원본 그림·문장대로, 28-(2) 답 교정, 보류였던 8-(8)·29-(1)·20쪽 (2)(3) 되살림.
- **공개 정답 유출 정리**(2·3·6권): 메모 칸의 정답 문구를 지우고 교정 이력은 DB `sourceNote`로 옮김.
  `golden-bell-protection-audit.mjs`에 메모 칸 검사 추가. git 이력은 다시 쓰지 않기로 결정(2026-10-08).
- **4권 화면 정리**: 기존 문항을 학생용 원본 문장·그림대로. 15-(6)·42-(1)은 원본 그림대로(42-(1)은 DB 답도 원본 그림 기준으로 교체).
- **4권 묶음 1**(36·37·39·40·41·44쪽 논리 추리 17문항): 새 단원 `order-logic-source`(번호 10) +
  동서남북·원탁·표 단원에 문항 추가.
- **4권 묶음 2**(16~18쪽 쌓기나무 10문항): 새 단원 `cube-min-count`(번호 11) + `hidden-cube-count`에 18쪽 아래 그림 3문항.
  쌓기나무 그림을 원본과 같은 빗각 그림(`book04-renderers.js`의 `obliqueCubes`)으로 바꿈.

## 4. 남은 일 — 이 순서대로

원장이 승인한 계획: 원본에는 있는데 앱에 없는 4권 활동을 **묶음 단위로** 넣는다. 묶음마다 커밋 → main → 보고.

| 묶음 | 원본 쪽 | 내용 | 비고 |
|---|---|---|---|
| **3 (다음)** | 22~27 | 비교하기 26문항 | 아래 4-1에 사전 분석 |
| 4 | 28~30, 31(3)·32·33 | 양팔저울 등식 8 + 저울 바꾸어 넣기 5 | `balance-substitution`(번호 5)에 이어 붙이거나 새 단원 |
| 5 | 4~8 | 연산 8, 숫자 1 뒤집기·돌리기 ①~⑧, 숫자판 3, 디지털 숫자 20 + 952 반 바퀴 | **그리기 문항은 고르기형으로** |
| 6 | 10~14 | 색종이 접어 위치(알파벳) 7·반대쪽 번호 3, 두 번 접어 자른 모양 4, 자른 수의 합 4 | **그리기 문항은 고르기형으로** |
| 보류 유지 | 2, 3 확장, 34·47 | 정삼각형 등분 그리기, 3쪽 다섯 칸 확장(교사용 전용), 47쪽 □n(원본도 빈칸뿐) | 넣지 않는다 |

그다음: **5~10권 원본 대조**(같은 방식: 학생용 무답 PDF 전 쪽 vs 앱 화면 캡처 → 표로 정리 → 원장 보고 → 화면 수정 → 빠진 활동 묶음 추가).

그리고 함께 정리할 것: `book-04`의 `sourceCoverage`(쪽별 상태 표)가 묶음 1·2 반영 전 상태다
(16~17쪽, 36~37·40~41·44쪽이 아직 `held`). 묶음 3 패치 때 같이 바로잡는다.
`sourceHold`의 "교사용 슬라이드 22 ~30의 비교·저울" 항목은 묶음 3 후 "28~30 저울"로 좁히고, 묶음 4 후 지운다.

### 4-1. 묶음 3(22~27쪽) 사전 분석 — 착수 전 상태

학생용·교사용을 모두 보고 26문항을 직접 풀어 교사용과 대조해 두었다(답은 여기 적지 않는다. 직접 다시 풀 것).

| 원본 | 문항 | 형식 제안 |
|---|---|---|
| 22 활동01 ① | 사용하지 않는 숫자카드 2문항(1~7에서 5·7 사용, 1~10에서 6·7·10 사용) | 숫자 |
| 23 활동01 ② | 도형 크기 비교 8문항("작은 것부터 순서대로 그리시오") | **순서 보기 고르기형**(2도형 2지, 3·4도형 4지. 보기 꼴: 「가 < 나 < 다」처럼 작은 것부터 `<`로 잇기) |
| 24 | A·B·C 큰 순서, A~D 큰 순서, 추가 Q "A와 C의 차이는?" | 칸 3개·칸 4개(글자), 숫자 |
| 25 활동01 ③ | ○◇□△ 관계식 4상자, 물어보는 도형의 차이 | 숫자 |
| 26 | 무게 차이, 나이 차이, 제일 뒤 사람, 가장 긴 리본 | 숫자 2, 글자 2 |
| 27 | 키 차이, 몸무게 차이, 계단 수, 사탕 수, 달리기 거리 | 숫자 5 |

반드시 알아야 할 것:
- **24쪽 추가 Q는 교사용 답이 틀렸다.** 교사용은 A에 수를 넣어 B·C·D를 구했는데, 대입값 하나를
  관계식과 맞지 않게 적어서 답이 틀렸다. **식대로 직접 풀어 DB에 넣고**, 그 기록의
  `sourceNote`에 "교사용 대입값 계산 실수를 관계식으로 바로잡음" 식으로 적는다(숫자 없이).
  원장 보고에는 이 건을 꼭 포함한다.
- **25쪽**: 학생용은 오른쪽 물음 칸이 비어 있고, "어떤 두 도형의 차이인가"는 교사용 문구
  ("Q) ○, △ 의 차이" 등)에만 있다. 물음 문구이므로 문항 글에 넣는다.
- **27쪽 (1)**: 학생용 "연우와 **민이**의"는 교사용 "연우와 **경민이**의"가 맞다(등장인물에 '민이' 없음) → "경민이"로.
  `sourceDiscrepancy`에 숫자 없이 기록.
- **27쪽 (3)**: 등장인물은 '하나'인데 조건 두 곳이 '한나'(학생용·교사용 동일). 원장이 답하지 않아 기본안 =
  **'하나'로 통일하고 `sourceDiscrepancy`에 기록**. 보고 때 알린다.
- 구성안: 새 단원 2개, `balance-substitution` 바로 앞에 둔다.
  `compare-order-source`(번호 **12**, 22~24쪽 13문항) · `compare-difference-source`(번호 **13**, 25~27쪽 13문항).
- 그림: 22쪽 숫자 카드(쓴 카드는 빨간 사선) + 「□ + □ = 5」 줄 상자, 23·25쪽 도형 관계식 상자(○△□◇는 작은 SVG,
  25쪽은 연한 파랑 바탕), 24쪽 「A = B + 6」 상자, 26·27쪽 조건 글은 기존 `bulletBox`(`b4-src-clues`).
- 개념 설명: 교사용 지도 문구 "정해진 값이 없는데 수의 차이를 구하거나 크기 비교는 적당한 수를 대입해도 됨"을
  그대로 살린 4권 안내형 가족 2개(`book4-compare-order`, `book4-compare-difference`, 렌더 함수 하나 공유) 추가 제안.
  주어진 구조(파랑) → 기준 도형에 수 대입(금색) → 순서/차이 검산(초록, `data-book04-answer`·`data-book04-check`).
  검사기 `FAMILIES`·`EXPECTED_ANSWER`에도 추가(대입 없이 관계식으로 독립 계산).
- 고르기형 문항: `answerMode: "choice"`, `options: [...]`(보기 문자열은 공개 가능), DB `answer`는 보기 문자열 그대로.
  채점은 공백을 지우고 비교한다(`normalizeAnswer`).

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
node golden-bell-book04-guided-audit.mjs      # BOOK04_GUIDED_AUDIT_OK families=6 (가족 추가 시 수 증가)
node course1-review-audit.mjs                 # 누락·중복 0건
node golden-bell-cube-animation-audit.mjs     # CUBE_SOURCE_ANIMATION_OK
```
- 브라우저 검사들은 `CODEX_NODE_MODULES`(playwright·pdf-lib가 있는 node_modules 경로)가 필요하다.
- **이미 실패하던 검사 1개**: `golden-bell-book04-hidden-cube-browser-audit.mjs`(포트 8794 서버 필요)는
  개념 단계의 「4개」 선택 버튼이 disabled라 클릭에서 멈춘다. 묶음 작업 전부터 이 지점에서 실패했다(기준선 확인 완료).
  **같은 지점에서 실패하면 정상**, 다른 곳에서 실패하면 이번 변경 탓이다.
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
