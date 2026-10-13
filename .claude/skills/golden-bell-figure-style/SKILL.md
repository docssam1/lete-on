---
name: golden-bell-figure-style
description: 골든벨(fields-classic/question-bank) 문항 그림·개념 그림·인쇄 그림을 새로 그리거나 색·문구를 고칠 때 먼저 읽는다. 풀컬러 색표, 아이 말(반 바퀴·반의 반 바퀴), 회사 이름 금지, 원본 모양 그대로, 캡처·인쇄 확인과 검사기, 실제로 했던 실수.
---

# 골든벨 그림 — 색·말·모양 기준

원장 지시(2026-10-13): **"우리는 풀컬러 사용하자"**, **각도·분수 말 대신 아이 말**, **필즈더클래식 회사 느낌이 나오면 안 된다.**
정답·DB·원본 대조 절차는 이 스킬이 아니라 `fields-classic/question-bank/HANDOVER-GOLDEN-BELL-SOURCE-REVIEW.md`가 기준이다.
**끝나면 `node fields-classic/question-bank/golden-bell-style-audit.mjs`가 `GOLDEN_BELL_STYLE_OK`인지 확인한 뒤 main에 올린다.**

## 1. 모양은 원본, 색은 우리 것
- 개수·배치·방향·빈칸 위치는 **학생용 원본 그대로**. 교사용은 답 대조용일 뿐.
- 원본에 없는 화살표·말풍선·장식은 넣지 않는다(접기 화살표를 넣었다가 뺀 적 있음).
- **글자는 검정**(`#222`). 색은 그림에만.
- 분수는 위아래로 쌓은 표기. `1/32` 같은 빗금 표기 금지.
- 원본 그림 이미지·PDF는 커밋하지 않는다. SVG/CSS로 새로 그린다.

## 2. 풀컬러 색표 (`golden-bell-book04.css`의 실제 값)
| 무엇 | 색 |
|---|---|
| ● 동그라미 | 빨강 선 `#e8503a` · 바탕 `#ffe1dc` (저울 토큰은 꽉 찬 `#e8503a`) |
| ▲ 세모 | 초록 `#2f9e5f` · 바탕 `#dcf5e5` |
| ■ 네모 | 파랑 `#2f6fe0` · 바탕 `#dde9ff` |
| ◆ 마름모 | 보라 `#8e5bd8` · 바탕 `#ece0fb` |
| ★ 별 | 노랑 `#f0b23a` |
| 쌓기나무 | 윗면 `#ffeaa6` · 앞면 `#ffd45c` · 옆면 `#f0b23a` · 선 `#a8741a` |
| 관계식 상자 | 주황 테두리 `#f39a1e` (25쪽처럼 바탕을 칠하는 판은 `#fff4c2`) |
| 숫자카드 | 노랑 `#fff3c4` · 테두리 `#f0a500`, 쓴 카드는 회색 + 빨간 빗금 |
| 양팔저울 | 대 주황 `#f39a1e` · 받침 노랑 `#ffd45c` |
| 「1」 모양·7세그먼트 숫자 | 빨강 `#e8503a` |
| 보기 ①~⑧ | 무지개 `#e8503a` `#f39a1e` `#d9a400` `#2f9e5f` `#1aa3c9` `#2f6fe0` `#8e5bd8` `#e0559a` |
| 돌리기 기호 | 색칠 `#ffd84d`(선 `#d79a00`) · 화살표 빨강 · 뒤집기 축은 회색 점선 + 주황 화살 |
| 숫자판·빈 상자 | 보라 테두리 `#8e5bd8`, 판 칸은 파스텔 4색 |

- **금지**: 옛 청록 `#2f7f96`(예전에 모든 그림을 이 한 색으로 몰았다), 그림 전체를 한 색으로 칠하기.
- **같은 모양은 어디서나 같은 색.** 문항 그림, 개념(안내형) 그림, 인쇄가 모두 같아야 한다. `golden-bell-book04-guided.js` `BALANCE_GLYPH`가 문항 저울과 같은 값을 쓰는 것이 기준이다.
- 인쇄에도 색이 나오게 `print-color-adjust:exact; -webkit-print-color-adjust:exact`.
- 새 책(5~10권)도 이 표를 그대로 쓴다. 새 모양이 필요하면 표에 한 줄 추가하고 쓴다.

## 3. 아이 말 — 각도·분수 말 금지
| 쓰지 않는 말 | 쓰는 말 |
|---|---|
| 90° · ¼ | 시계 방향으로 **반의 반 바퀴** |
| 180° · ½ | **반 바퀴** |
| 270° · ¾ | **반의 반 바퀴씩 세 번** |
| 360° · 전체 | **한 바퀴** |
| 좌우 대칭 이동 | **오른쪽(왼쪽)으로 뒤집기** |
| 상하 대칭 이동 | **아래(위)로 뒤집기** |

- 화면 글자뿐 아니라 **읽어주기 문구(aria-label)와 DB 풀이**도 같은 말로 쓴다. 도우미: `book04-renderers.js` `turnWords(deg, dir)`.
- 원본 문장에 각도가 있으면 바꾸고 그 문항의 `sourceDiscrepancy`에 숫자 없이 적는다. 예: "원본의 「180°만큼」을 아이에게 쓰는 말 「반 바퀴」로 바꿈"(4권 8쪽 ⑥).

## 4. 회사 이름 금지
- 화면·표지·인쇄·대화상자에 `FC`·`필즈`·`FIELDS CLASSIC`을 쓰지 않는다. 페이지 제목은 「골든벨 학습」, 과정 표시는 「N과정」 또는 「골든벨」.
- 원본 문장에 학원 이름이 나오면 「학원」으로 바꾸고 `sourceDiscrepancy`에 적는다(3권 14-(1-1)·(1-3)).
- 화면에 나오지 않는 내부 값(`learnerStage`, `route-fields-station` 같은 id)은 그대로 둔다.
- 교사용 문제은행(`index.html`·`app.js`의 「FC 문제은행」)은 원장 결정 전까지 손대지 않는다.

## 5. 어디서 그리나
- 4권 원본 그림: `fields-classic/question-bank/book04-renderers.js` + `golden-bell-book04.css`. `visual.type`으로 갈라진다(`source-relations`·`source-one-flip`·`source-seven-seg`…).
- 원본 저울: `golden-bell.js` `book04SourceBalanceMarkup` (`targetText`·`targetBalance`).
- 개념(안내형) 그림: `golden-bell-book04-guided.js` 가족별 frame 함수.
- 돌리기·뒤집기는 화면 좌표 행렬 `SCREEN_TRANSFORM`(I·LR·UD·R180·CW·CCW·T·AT)로 그린다. 보기 순서는 `ONE_OPTION_TRANSFORMS`.
- 돌리기 기호는 **SVG 한 장**: 12시에서 시작해 돌린 만큼 색칠하고, 화살촉은 원의 접선 방향으로 단다.
- 고친 뒤 캐시 꼬리표를 올린다(파일 5개, 인수인계 문서 2절 표).

## 6. 확인 — 눈으로, 원본과 나란히
1. `python3 -m http.server 8797 --directory <저장소 루트>` (백그라운드)
2. 화면: `OUT=<임시폴더> BOOK=book-04 ONLY=<단원id> node capture-lessons.mjs` — `tools/golden-bell-book04/capture-lessons.mjs`를 `playwright-core`가 설치된 폴더에 복사해 실행(사용법은 파일 첫 줄)
3. 인쇄: `OUT=<임시폴더> BOOK=book-04 LESSONS=<단원id> node …/print-lessons.mjs` → PDF를 그림으로 바꿔 확인
4. **원본 쪽과 나란히** 놓고 개수·방향·빈칸을 비교한다. 색이 원본과 다른 것은 정상이다(우리 색표).
5. 검사기: `golden-bell-style-audit.mjs`(색·회사 이름·각도 말) + `golden-bell-protection-audit.mjs` + `book04-audit.mjs` + `golden-bell-book04-guided-audit.mjs`
- 캡처한 그림과 임시 폴더는 커밋하지 않는다. 원장 PC의 C 드라이브에 저장하지 않는다.

## 7. 실제로 했던 실수 (반복 금지)
- 그림을 전부 청록 한 색으로 그렸다 → "그림이 다 파랑" 지적. 모양마다 색을 다르게.
- 문항 저울은 ■파랑으로 바꾸고 개념 그림은 ■초록으로 남겼다 → 같은 모양 다른 색. 색을 바꾸면 안내형 파일도 같이 고친다.
- 돌리기 아이콘을 작게, 가운데에서 벗어나게 그렸다 → 기호와 「1」을 SVG 하나로 다시 그림.
- 보기 ⑥·⑧의 변환 순서(T·AT)를 바꿔 그렸다 → 원본 보기 순서는 행렬로 계산해 대조한다.
- 화면 글자는 고쳤는데 aria-label에 「90°」가 남았다 → `turnWords()`로 통일.
- 그리기 문항에 원본에 없는 접기 화살표를 넣었다.
- CSS를 sed로 지우다가 같은 문자열인 원래 규칙까지 지웠다(별 색) → 지운 뒤 `git diff`로 확인.

## 8. 정답은 그림에도 넣지 않는다
그림 데이터(`visual`)·메모 칸·커밋 메시지에 정답 값을 쓰지 않는다. 정답이 드러나는 그림(채워진 빈칸 등)은 공개 데이터에 넣지 않는다. 상세 규칙은 저장소 `CLAUDE.md` 「보안 제약」과 인수인계 문서 1절.
