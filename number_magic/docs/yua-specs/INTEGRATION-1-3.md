# G1-1~3호(N-01~N-03) 통합 메모

구현 파일: `engine/threads/g1-1-3.js`(생성기) · `app/g1/1-3.{art,widgets,print}.js` · `app/g1/1-3.css` · `data/g1/1-3-threads.js` · `data/units/N-0{1,2,3}.js`.
위젯 이름은 전부 **`g13` 접두**(다른 묶음의 `numPick` 등과 `NM_WIDGET_EXT` 이름이 겹치지 않게 — G1-11 명세가 같은 이름 `numPick`을 다른 계약으로 쓴다).
생성기: `g13_n1`(N-01) · `g13_n2`(N-02) · `g13_n3`(N-03), params `{modes:[…], level:'practice'|'main'}`. 원본 `nl1_count`·`nl2_seq`·`nl3_ordinal`은 한 겹 감싸서(`params.g13`가 있을 때만 새 쪽으로) nl.js 불변.

## ① 새 스레드/레벨 id와 선수
| 스레드 | 이름 | gen | prereq | 레벨 |
|---|---|---|---|---|
| NL1 (덧붙임) | 수 세기와 개수 | nl1_count(감쌈) | – | 4 같은 종류 안에서 세기 · 5 네모 칸 세기·칠하기 |
| NL4 (덧붙임) | 수의 순서 | nl2_seq(감쌈) | – | 4 큰 수부터 점 잇기(+미리 그린 선) · 5 규칙 찾기(반복·교차) · 6 두 수 사이 |
| NL8 (덧붙임) | 몇째와 칸 세기 | nl3_ordinal(감쌈) | – | 4 개수·순서 칠하기 · 5 오른쪽에서 몇째(flip·find·word) · 6 양쪽에서 세어 모두 몇 칸(build) |
| NL17 | 여러 가지로 나타낸 수 | g13_n1 | NL1 | 1 잇기(5) · 2 잇기(9) · 3 표 빈칸 |
| NL18 | 그림 속 도형·블록·길이 | g13_n1 | NL1 | 1 도형 세기 · 2 날씨 표 · 3 동그라미 나누기 · 4 점판 길이 · 5 쌓기나무 · 6 칸 수 다른 모양 · 7 한 줄 칠하기 · 8 거꾸로 뒤집기 |
| NL19 | 화살표 길 채우기 | g13_n2 | NL4 | 1 줄·굽이(쉬움) · 2 굽이·꺾인 길(2씩·큰 수부터) · 3 화살표 규칙 · 4 되풀이 칸 |
| NL20 | 가까운 수와 표시 | g13_n2 | NL4 | 1 뛰어 센 수·가까운 수 표시 · 2 세어서 가장 가까운 수 · 3 가까운 순서 · 4 핀볼 |
| NL21 | 크기 비교와 정렬 | g13_n3 | NL8 | 1 >< · 2 □ 안에 들어갈 수 · 3 작은/큰 순서 · 4 화살표 삼각형 · 5 최대·최소 · 6 쌓기나무 비교 |
| NL22 | 하나 더와 묶고 남은 수 | g13_n3 | NL8 | 1 묶고 남은 수 · 2 하나 더·하나 적게 |

`data/drill-topics.js` 의 `ADDITIONAL_THREADS` 맨 앞에 `preschool:['NL17'…'NL22']` 한 줄을 **내가 넣었다**(새 스레드는 갈래 지정이 없으면 drill.html 이 로드 중 throw 한다 — 다른 묶음도 같은 줄이 필요하므로 병합 때 `preschool` 배열을 합칠 것).

## ② 유닛 세션 드릴 제안 (courses.js 과정 0, 레벨 순서는 쉬운 것 → 어려운 것)
- N-01: `NL1@4`, `NL17@2`, `NL18@1`, (복습 풀) `NL1@5`, `NL17@3`, `NL18@2`·`@3`·`@4`·`@5`·`@6`·`@7`
- N-02: `NL4@4`, `NL19@1`, `NL19@2`, `NL20@1`, (복습) `NL4@5`, `NL4@6`, `NL19@3`, `NL19@4`, `NL20@2`, `NL20@3`, `NL20@4`
- N-03: `NL8@4`, `NL8@5`, `NL21@1`, `NL21@3`, (복습) `NL8@6`, `NL21@2`, `NL21@4`, `NL21@5`, `NL21@6`, `NL22@1`, `NL22@2`
- 가장 어려운 것: NL20@4(핀볼), NL21@6(쌓기나무 비교), NL18@5(쌓기나무), NL19@4.
- 유닛 체험 자체는 이미 바꿔 두었다: N-01 practice `modes:[count,family,rep,shapes]` / lab `[make,grid,rowpaint,repFill]`, N-02 practice `[gap,repeat,between,nearest]` / lab `[dots,pathRow,skipPaint]`, N-03 practice `[position,ord,cmp]` / lab `[paint,order,range,arrowTri]`. N-03 discover 에 ">, <" 약속 단계(5쪽 안내) 추가.

## ③ 새 소품 토큰 + 실사 PNG 파일명 제안 (`data/real-art.js` 표에 한 줄씩)
`rugby-ball`→`rugby-ball.png` · `baseball`→`baseball.png` · `grapes`→`grapes.png` · `watermelon`→`watermelon.png` · `pear`→`pear.png` · `moon`→`moon.png` · `sun`→`sun.png` · `cloud`→`cloud.png` · `rain`→`rain.png` · `kite`→`kite.png` · `pencil`→`pencil.png` · `eraser`→`eraser.png` · `paper-clip`→`paper-clip.png` · `marble`→`marble.png`.
도형 `shape:circle|square|triangle`은 기하 도형이라 실사 대상이 아니다(SVG 유지). 손가락·쌓기나무는 `NM_G13.handSvg`·`isoSvg`(벡터)로 그렸다 — 실사로 바꾸려면 위젯 쪽 수정이 필요하다. 연필·지우개·클립·구슬은 현재 어느 문항에서도 쓰이지 않는다(G1-2 6쪽 `nearest`가 기존 물건 풀 THINGS 를 쓰기 때문) — 필요하면 `N2.nearest`의 풀에 추가.

## ④ 알려진 한계 / 명세와 다른 점
- **틀리면 `onAnswer(-1)`**: 잇기·점 잇기·순서 누르기 등은 틀린 시도마다 -1 이 나간다(호스트는 "다시 해볼까?" 토스트만 띄움).
- `blockCount bmode:'cmp'`의 `withCounts`(개수 먼저 쓰기)는 만들지 않았다(명세상 유닛 미사용 상위 단계). 기본(부등호만)만 구현.
- `turnDigit`: 교재 문항 불명확·"1이 돌려도 같다"는 사실이 글꼴에 따라 틀려서 **0·8·6↔9 만** 쓰는 "거꾸로 보면 어떤 숫자?"로 바꿨다.
- `oddShape` 정답은 명세의 0~3 이 아니라 **1~4**(인쇄 ①~④와 맞추기 위해, 0 답을 피함).
- `g13Rep`(= matchLine 확장)의 `answer` 는 짝 수(3 또는 4)라 `check-print.js` 가 "정답 100%가 3 하나" 경고를 낸다(matchLine 은 이름으로 제외돼 있음). 인쇄 정답지는 `3→②` 식이라 찍기 불가 — 무시해도 되고, check-print.js 의 제외 목록에 `g13Rep`을 넣으면 사라진다.
- 기수/서수 `word` 문항의 정답은 `n*10+(서수?1:0)` 코드(예 51 = 다섯째). 인쇄 정답지는 `② 다섯째`로 말로 찍는다.
- 한자어 수(일·이·삼)는 한국어에만 있다 — en·zh 에서는 고유어 글자로 갈음하고 표 문항(`g13RepFill`)은 빈칸 종류를 고유어로 바꾼다.
- 기존 위젯(`tapCount`·`matchLine`·`dotToDot`·`gridPaint`·`seqFill`·`tapMake`)은 수정 금지라 **확장 대신 같은 결의 새 위젯**(`g13Count`·`g13Rep`·`g13Dots`·`g13OrdPaint`·`g13Seq`·`g13Make`)을 만들었다. 기존 위젯의 힌트 한국어 고정(`renderDotToDot`)은 그대로 남아 있다(새 위젯은 3언어).
- `exam.js`의 `nlVisualHtml` 은 전역 함수가 아니다(모듈 내부) — 인쇄 확인은 `NM_EXAM.renderPrint({thread, level, count, seed})` 로 했다(drill.html).
- `level-test.html` 은 `app/g1/*.art.js`·`print.js` 를 싣지 않는다(위젯·인쇄 없이 생성기만) — 진단 시험에 새 스레드를 넣을 때 확인.
- 인쇄 한 칸 높이: 12문항 조밀 배치(칸 약 60mm)에서 안 넘치도록 그림 크기를 줄였다. 검사: 새 레벨 전부 4개 시드로 `scrollHeight` 비교(클립 0).
