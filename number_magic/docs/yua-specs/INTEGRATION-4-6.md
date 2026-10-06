# G1-4·5·6호 구현 — 통합 메모 (N-04 · N-05 · N-06)

구현 파일: `engine/threads/g1-4-6.js`(생성기 10) · `app/g1/4-6.widgets.js`(위젯 19) · `app/g1/4-6.print.js`(인쇄 19) · `app/g1/4-6.css` · `app/g1/4-6.art.js`(소품 11 + 고대 숫자 글리프) · `data/g1/4-6-threads.js`(스레드 10) · 유닛 lab 3개 수정 · `data/drill-topics.js`(ADDITIONAL_THREADS 한 줄).

## ① 새 스레드 / 레벨 / 선수
기존 NL1~NL16 은 건드리지 않았다(생성기가 스레드 하나에 묶여 기존 스레드에 다른 생성기의 레벨을 덧붙일 수 없다). 전부 새 스레드.

| 스레드 | 이름 | 생성기 | 레벨(id) | prereq |
|---|---|---|---|---|
| NL27 | 홀짝과 조건에 맞는 수 | g46_numset | 1~2 홀짝 이름 · 3~4 조건 모두 찾기 · 5~6 개수 · 7 단서 비밀수 · 8 자물쇠 | NL4 |
| NL28 | 도형수 | g46_cellcode | 1~2 읽기 · 3 만들기 · 4 두 가지 방법 · 5 세로 섞기 · 6 가장 큰 수 | NL2 |
| NL29 | 고대의 숫자 | g46_ancient | 1·3 잇기 · 2 읽기/쌓기 섞기 · 4 읽기 · 5 쌓기 · 6~7 1과 5만 보고 | NL14 |
| NL30 | 수 채우기 | g46_seq | 1~2 하나 건너 · 3~4 규칙 빈칸 · 5 달팽이·뱀 길 | NL4 |
| NL31 | 양의 수와 순서수 | g46_ordinal | 1~3 qtyOrd · 4~5 틀린 말 고치기 | NL8 |
| NL32 | 자리와 줄 | g46_seat | 1~3 자리 · 4~5 앞뒤 수 · 6~7 뒤에 그리기 · 8~9 뒤↔앞 | NL9 |
| NL33 | 순위·그림그래프·규칙 | g46_rank | 1~3 순위 · 4~8 그래프 · 9~10 번호표 규칙 | NL10 |
| NL34 | 수 기계 연쇄와 주고받기 | g46_machine | 1~5 chain(quiz·age·birds·stairs) · 6~9 trade | NL11 |
| NL35 | 서로 다르게 가르기 | g46_split | 1~2 접시 · 3 케이크 · 4~5 색칠 · 6 막대 · 7~8 동그라미 | NL2 |
| NL36 | 가르기 모형·남기기·덧셈식 | g46_addsub | 1~5 모형 · 6~8 남기기 · 9~11 덧셈식 · 12~16 같은 값·짝·잇기 · 17~18 토끼 합 칸 | NL2 |

## ② N 유닛 세션 드릴 제안 (courses.js 편성용)
- **N-04 기수법·수의 여러 모습**: NL27 L1~L4(홀짝·조건), NL28 L1~L3(도형수), NL29 L1·L2·L3(고대 숫자). 단원 제목/소개를 "수의 여러 모습"으로 넓히는 것을 권장. lab 은 이미 `g46_ancient`/match 로 바꿔 두었다.
- **N-05 생활 서수 문장제**: NL31 L1~L5, NL32 L1~L9, NL33 L1~L3(순위)·L9~L10(규칙). 그래프(L4~L8)는 N-10 세션에, NL34(chain·trade)는 N-08/N-13 세션에 넣어도 된다. lab → `g46_ordinal` qtyOrd.
- **N-06 모으기와 가르기**: NL35 L1~L8(서로 다르게 가르기), NL36 L1~L5(모형), L6~L11(남기기·덧셈식). L12~L16(같은 값·짝·잇기)은 확인학습 세션, L17~L18(토끼 합 칸)은 N-09 세션. lab → `g46_split` plate.
- 과정 세션은 레벨별 `count` 를 그대로 쓰면 된다. NL36 레벨이 18개로 많아 세션별로 나눠 편성하는 것을 권장.

## ③ 새 소품 토큰 + 실사 PNG 파일명 제안 (data/real-art.js 표)
`podium`(시상대) → `podium.png` · `ticket-booth` → `ticket-booth.png` · `blackboard` → `blackboard.png` · `ticket`(번호표) → `ticket.png` · `desk` → `desk.png` · `plate`(접시, 위에서 본) → `plate.png` · `cake`(접시 위 케이크) → `cake.png` · `candle` → `candle.png` · `padlock` → `padlock.png` · `pouch` → `pouch.png` · `gem` → `gem.png`.
`pouch`·`gem` 은 bagClue(미구현, ④)용으로 등록만 해 두었다. 고대 숫자 기호는 PNG 가 아니라 `NM_ANCIENT.glyph(sys,n)` 벡터 글리프(원본 도형만, 6체계).

## ④ 알려진 한계 / 구현하지 못한 것
- **미구현(P3)**: `bagClue`(p6 주머니 추론), `cardFill`(p9 숫자 이야기), `paritySort`(확인학습2 줄 잇기 → 바구니), p6 ① 종류 수 세기(기존 `tapCount` 재사용이라 건드리지 않음), 확인학습 4번 줄칸 8·4(`framePaint cells`). 이유: 금지 파일(widgets.js·exam.js)을 못 고치고, 우선순위가 낮다.
- **기존 위젯 확장은 못 했다**(금지 파일): matchLine·seqFill·storyCard·numberMachine·tapMake·sortBasket·selectPairs 의 `B` 확장 명세는 전부 **새 위젯으로 대체**했다 — `g46Match`(잇기: 기호·식·그림·합 규칙), `g46Seq`(chain·길), `g46Line`/`g46LineDraw`(매표소), `chainMachine`, `g46Sum`. `seqFill` 의 blank=0 버그는 건드리지 않았다(새 위젯은 0 을 지원).
- 위젯 이름 충돌 회피: G1-13 이 `gridSum` 을 쓰므로 G1-6 의 토끼 합 칸은 **`rabbitGrid`** 로 이름을 바꿨다. 나머지 스펙 이름(`pickCard` `tilePick` `cellCode` `glyphBuild` `qtyOrd` `seatGrid` `barRead` `rankClue` `tradeScene` `splitDraw` `bondNum` `crossLeave`)은 그대로이고, 새로 만든 것은 `g46` 접두.
- 인쇄 지면: 카드는 높이 고정(약 66mm)이라 넘치면 잘린다 — 실제 `NM_EXAM.renderPrint` 로 전 레벨(85)을 12문항씩 찍어 **넘침 0** 확인. `barRead` 는 지면을 아끼려 **가로로 눕힌** 그림그래프로 인쇄(화면은 세로). `splitDraw` 접시·케이크는 줄이 3개 이상이면 2열.
- **풀 크기(정직한 질문 수)**: 고유 key 는 전 레벨 ≥24(시드 400개). 그러나 겉모습(토큰·동물 배치·보기 순서)을 key 에 넣어 늘린 레벨이 있다 — 실제 서로 다른 질문이 24 미만: NL32 L6(내 뒤에 그리기 쉬움 ≈10), NL34 L8(똑같아지게 쉬움 6×토큰·이름), NL35 L7(동그라미 쉬움 2×토큰), NL28 L5, NL29 L2 일부. 학습지 한 회차(20+예시+따라풀기 24)를 연달아 뽑으면 같은 질문이 겉모습만 바뀌어 나올 수 있다.
- 열린 활동(`tilePick multi`, `cellCode make/make2`, `splitDraw`, `glyphBuild`)은 위젯이 안에서 판정해 맞으면 `answer`, 틀리면 -1 을 보낸다. 학습지 정답지는 `label()` 이 가능한 정답 목록을 적는다.
- `main.js:349 location.reload()` 가 도는 환경에서 Playwright 장시간 평가가 끊길 수 있다(우리 검사와 무관) — 검사 스크립트는 시드를 나눠 돌렸다.

## ⑤ 통합 때 주의
- `data/drill-topics.js`: 새 스레드는 카테고리가 없으면 페이지 에러(`choose a category for NLxx`)가 난다 → `ADDITIONAL_THREADS.preschool` 에 NL27~NL36 을 한 줄 추가해 두었다. 다른 묶음도 같은 줄을 건드리면 병합 충돌 — 한 배열로 합칠 것. 레벨별 소분류(subs)는 만들지 않았다.
- `data/print-head.js` 는 이 스레드들 항목이 없다(통합 단계에서 `scripts/build-print-head.js`).
- 스레드 번호는 NL27~NL36 만 썼다. 다른 묶음 파일이 같은 번호를 쓰지 않는지 병합 시 확인.
- 이모지 동물(`animal:*`)은 인쇄 페이지에 `animal-art.js` 가 없어 이모지 글자로 찍힌다(drill/ws 가 animal-art 를 안 불러서). 필요하면 두 페이지에 `app/animal-art.js` 를 추가.
