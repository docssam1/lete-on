# G1-10·11·12 통합 메모 (구현 담당 → 통합 담당)

## 1. 새 스레드·레벨 (NL47~NL56, `data/g1/10-12-threads.js`) — 선수는 전부 기존 NL1~NL16 또는 이 묶음 안의 스레드
스레드 하나 = 생성기 하나(`params.mode`/`kind`로 갈림). 난이도 키는 `params.lv`(유닛이 넘기는 `level:'practice'|'main'` 문자열과 일부러 분리).

| 스레드 | 이름 | 생성기 | 선수 | 레벨 |
|---|---|---|---|---|
| NL47 | 이야기 읽고 풀기 | nlg10_text | NL2 | 1 빈칸(쉬움) · 2 빈칸(3종+방해수) · 3 정보카드 · 4 정보카드(함정) |
| NL48 | 틀린 곳 찾기와 식 고르기 | nlg10_check | NL47 | 1·2 틀린곳 · 3 그림→식 · 4 식→이야기 |
| NL49 | 조사하기와 분류하기 | nlg10_survey | NL15 | 1 3종표 · 2 4~5종표 · 3 표 읽고 합/차 · 4 날씨표 세기 · 5 날씨표 합/차 |
| NL50 | 같게 나누기와 이야기 셈 | nlg10_stories | NL47 | 1 옮기기 · 2 똑같이 나누기 · 3 따로 두고 나누기 · 4 더 많다→합 · 5 두 줄 비교 · 6 묶음 세기 |
| NL51 | 크고 작은 수와 숫자 카드 | nlg11_numpick | NL2 | 1·2 식값 비교 · 3·4 카드합(만들 수 있는) · 5 (만들 수 없는) · 6 범위 · 7 합이 맞는 세 장(G1-12 7쪽 겸용) |
| NL52 | 식 빈칸과 세로셈 | nlg11_eqvert | NL51 | 1·2 □의 값 · 3·4 세로셈 결과칸 · 5·6 세로셈 빈칸 어디든 |
| NL53 | 식 만들기와 동전 합·차 | nlg11_make | NL52 | 1·2 목표수 · 3 카드4장 · 4·5 세 수 · 6~8 동전(1원) 세기/합/합·차 |
| NL54 | 여러 수로 가르고 모으기 | nlg12_parts | NL2 | 1 세 수(한 칸 제시) · 2 세 수 · 3 세 칸 모으기 · 4 네 수 · 5 같은 수 · 6 삼각형 · 7 마름모 · 8 여러 가지 방법 |
| NL55 | 수 묶기 | nlg12_gridgroup | NL54 | 1 4×4 · 2 5×5 세 수 · 3 5×5 네 수 |
| NL56 | 양팔저울 식 | nlg12_eqscale | NL10, NL54 | 1 한쪽 빈칸 · 2 양쪽 빈칸 |

기존 NL1~NL16 레벨 id는 건드리지 않았다. **`data/drill-topics.js` ADDITIONAL_THREADS 에 `preschool:['NL47'..'NL56']` 한 줄을 추가했다**(없으면 drill.html 이 "choose a category" 로 죽고 check-answerable 이 실패한다). 다른 묶음도 같은 줄을 건드리면 병합 때 한 줄로 합칠 것.

## 2. 유닛(`data/units/N-10~12.js`) — 수정함
- N-10 = 이야기와 자료 정리: practice `nlg10_text{storyfill,lv1}` / lab `nlg10_survey{tally3}`.
- N-11 = 식과 숫자 카드(새 모드로 교체. 이어 세기·수-점 매칭은 NL7에 그대로): practice `nlg11_eqvert{eq,lv1}` / lab `nlg11_make{cardeq,target,lv1}`. discover 문구 새로 씀(등호 유래).
- N-12 = 세 수 가르기와 양팔저울 식: practice `nlg12_parts{ladybug/plane,3칸,w4~6,given1}` / lab `nlg12_eqscale{both:false}`.
- 새 문구가 많으니 `scripts/generate-nm-audio.js` / `data/tts-map.js` 재생성 필요(유아 단계는 음성이 본체). 지금은 기기 음성 폴백.

## 3. 세션 드릴 제안 (courses.js C0 편성용, 형식 `스레드@레벨`)
- N-10 세션: `NL47@1`, `NL47@3`, `NL49@1`, (복습) `NL48@1`; 확장 `NL47@2`·`NL49@3`·`NL50@3`
- N-11 세션: `NL51@1`, `NL52@1`, `NL52@3`, `NL53@1`; 확장 `NL51@3`·`NL52@4`·`NL53@4`·`NL53@6`
- N-12 세션: `NL54@1`, `NL54@3`, `NL56@1`, (기존 `NL3@2`, `NL10@2` 유지 가능); 확장 `NL54@5`·`NL55@1`·`NL56@2`
- about 개수·print-head 높이는 통합 단계에서 새 레벨 수(53개)를 반영해 달라질 수 있다.

## 4. 새 소품 (`app/g1/10-12.art.js`, 임시 SVG) — 실사 PNG 파일명 제안(`data/real-art.js`)
`'melon':'melon.png'`(참외) · `'watermelon':'watermelon.png'`(수박) · `'grapes':'grapes.png'`(포도) · `'weather-sun':'weather-sun.png'` · `'weather-cloud':'weather-cloud.png'` · `'weather-rain':'weather-rain.png'`. 선택 소품(화분·원숭이·꿀단지)은 만들지 않았다(기존 토큰으로 대체).

## 5. 위젯 이름(충돌 방지로 접두를 붙였다) — 명세 이름과 대응
g10_slotFill(slotFill) · g10_factsCard(storyCard facts) · g10_errorFind · g10_choiceCards · g10_surveyGrid · g10_moveEqual · g10_storyRows(storyCard rows/groups) · g11_numPick · g11_eqFill · g11_vertFill · g11_cardEq · g11_purse · g12_partsFill · g12_gridGroup · g12_eqScale. `storyCard`는 widgets.js 수정 금지라 새 위젯으로 분리했다.

## 6. 알려진 한계
- 위젯 답은 숫자 하나 규칙 때문에 "정답(answer)"은 정규화 값이다: slotFill=첫 빈칸 수, surveyGrid tally=첫 종류 개수, numPick=정답 칩 수, cardEq/gridGroup=필요 개수 K, partsFill=전체 수 또는 K, eqScale=연산 비트(1=＋). 실제 정답 내용은 정답지 label 이 보여 준다. 학습지 온라인 입력(숫자 한 칸)으로는 이 정규화 값만 확인된다.
- 틀린 곳 찾기는 문장의 세 수 중 어느 것이 틀렸는지가 하나로 정해지도록 **그림(진실)** 을 함께 싣는다(그림 없이는 모호). `more`(더 많다/적다) 유형은 명세 권고대로 생략.
- 4쪽 □의 값 `sub-top`(□−b=□)은 별 수 = 첫 칸 값이라고 해석했고 별을 항상 표시한다.
- 교재 7쪽 과녁·13쪽 겹사각형은 명세대로 넣지 않았다. 3쪽 윷놀이 문항 삭제, 12쪽 날씨표 7~9칸 축소(명세 결정).
- `nl9_chain coins unit:1`(nl.js 수정 필요)은 하지 않고 NL53 purse 레벨 6(한 닢 1원 세기)으로 대신했다.
- 5×5 수 묶기는 이웃(8방향) 선택을 순서대로 눌러야 한다(떨어진 칸을 먼저 누르면 흔들림).
- 같은 수 모으기·양팔저울처럼 가능한 문항 수가 적은 레벨은 틀 색(skin 0~5)을 키에 넣어 서로 다른 문항 ≥24를 맞췄다(수학적으로는 같은 문제의 색만 다름).
- 인쇄 카드 높이: 대부분 30~55mm. NL55 L2·NL56 은 시트에서 한 칸이 91~96mm(2열×2줄)로 높다 — check-weekly-sheets 로 과정 편성 후 확인 필요.
