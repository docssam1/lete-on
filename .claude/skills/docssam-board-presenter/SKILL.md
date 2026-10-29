---
name: docssam-board-presenter
description: 지필드 사고력 수학 스스로 공부 덱의 「판서 + 오른쪽 독쌤」 — 줄 없는 종이·초록 점선 틀 판서 옆에서 수학 독쌤이 모음 따라 입을 움직이고, 말 첫머리에 몸짓(가리킴·갸웃·깡충·끄덕)을 하고, 가만히 있으면 숨쉬고 깜빡이는 발표자. 판서(개념 칠판) 장을 고치거나, 다른 판서·학습 화면에 같은 발표자를 붙일 때 먼저 읽는다.
---

# 판서 + 오른쪽 독쌤 — 말하며 살아 움직이는 발표자

기준 코드는 `fields-classic/question-bank/study.js`(「판서 오른쪽 독쌤」 절 · `makePresenter`)와 `study.css`(`.sd-presenter*`·`.look-sketch`)다. 문서와 코드가 다르면 **코드가 맞다**. 움직이는 원리는 사이언스 랩 독쌤(스킬 `docssam-talking-guide`)에서 왔다 — 그쪽은 말풍선 안내, 이쪽은 판서 옆 발표자다.

원장 결정(2026-10-29): 「필기 개념 이런 식으로 · 오른쪽에 독쌤을」 → 「입이 더 움직이고 표정과 행동도 바뀌고 살아 있는 것처럼」 → 「전체 판서에 기본으로 켜줘」.

## 1. 어디에 켜지나

- 덱의 우리 게임 장 중 **판서(`game.board`)가 있는 장 전부에 기본**. `study.html?…&look=plain`이면 예전 모양(독쌤·점선 없음).
- 구조: `.sd-native.has-presenter` = 2칸 격자(왼쪽 판서 `.sd-board-host` · 오른쪽 `aside.sd-presenter`, 폭 `clamp(170px, 21vw, 290px)`).
- **화면 폭 900px 이하면 독쌤을 숨긴다**(판서가 먼저). 그때는 원래 안내 그림(`.sd-guide-img`)이 다시 보인다.
- 장을 떠나면 `presenter.dispose()` — 타이머 4개를 지우고 말 감시자에서 빠진다. 안 하면 다음 장에서 옛 독쌤이 입을 움직인다.

## 2. 그림 — 10장, 같은 틀로 자른다

`fields-classic/question-bank/assets/docssam-math/*.webp` (475×720, 장당 약 30KB)

| 키 | 파일 | 쓰임 |
|---|---|---|
| closed / half / open / o | A1~A4 | 입 다묾 · 반 · 벌림 · 오 |
| blink | A5-eyes-closed | 깜빡임 |
| point | B1-surprised | 가리킴·놀람 |
| think | B2-puzzled-thinking | 갸웃(물음) |
| smile | B3-praise | 칭찬 뒤 쉬는 얼굴 |
| cheer | B4-encourage | 격려·끄덕 |
| thumbs | B5-happy-thumbs-up | 정답·잘했어요 |

- **10장 모두 같은 자르기 상자(합집합 상자)로 자른다.** 그림마다 따로 여백을 자르면 폭이 달라져 얼굴을 바꿀 때마다 몸이 들썩인다(실제로 겪음).
- 10장을 처음에 다 깔아 두고 `opacity`만 바꾼다(`img.on`). 그때그때 `src`를 바꾸면 깜빡인다.

## 3. 입 — 소리가 나는 동안에만, 지금 글자의 모음으로

- `say()`가 말을 시작하면 `setTalking({text, audio})`(녹음) 또는 `setTalking({text, start, charIndex})`(기기 음성)로 알린다. 발표자는 `talkWatchers`로 받는다.
- 지금 글자: 녹음이면 `currentTime / duration × 글자 수`, 기기 음성이면 `onboundary`의 `charIndex`부터 1초에 약 7글자.
- `mouthFor(글자)`: 한글 중성으로 ㅏ·ㅑ·ㅓ·ㅕ·ㅘ·ㅝ류 → 벌림(open), ㅗ·ㅛ·ㅜ·ㅠ류 → 오(o), 나머지 → 반(half). 한글이 아니면 다묾.
- 1초에 12번 고르고 **세 번에 한 번은 다문다**(안 그러면 입이 벌어진 채 떨리기만 한다). 녹음이 멈췄거나 끝났으면 다묾.

## 4. 몸짓·움직임

- **말 첫머리 몸짓** `gestureFor(text, mood)` → `[얼굴, 움직임, ms]`:
  - 칭찬(`mood=praise` 또는 「맞았·잘했·훌륭·해냈·멋져」) → thumbs + hop
  - 물음(`mood=think` 또는 「?·볼까요·일까요·생각해」) → think + lean
  - 「해 봐요·할 수 있·천천히·다시」 → cheer + nod
  - 「봐요·보세요·여기·이제·먼저·짜잔」 → point + present
  - 몸짓이 끝나면 말하는 입으로 돌아간다. 같은 말이 다시 오면 몸짓을 되풀이하지 않는다(`lastText`).
- **말이 끝나면** 기분에 맞는 얼굴(praise → smile, think → think)로 2.6초 쉬었다가 다묾.
- **가만히 있을 때**: CSS 숨쉬기(`sd-pres-idle` 3.6초) · 2.6~5.2초마다 깜빡임 · 7~12초마다 끄덕(cheer+nod) 또는 갸웃(think+lean).
- **말하는 동안** 몸이 살짝 좌우로 흔들린다(`.talking` → `sd-pres-talk`).
- 움직임은 `.sd-pres-act[data-motion]`에 걸고 `animationend`에서 지운다. 같은 움직임을 다시 걸 때는 `offsetWidth`를 읽어 애니메이션을 처음부터 다시 돌린다.
- **움직임 줄이기 설정**(`prefers-reduced-motion`)이면 몸은 가만히, 얼굴만 바뀐다(깜빡임도 끈다).

## 5. 판서 틀 — 참고 그림의 「느낌」만

- `.look-sketch .cb-paper`: 줄 없는 따뜻한 종이(#fbfaf6) + 안쪽 12px **초록 점선 틀**(2px dashed #3f8f61, 둥근 모서리 14px).
- 제목줄은 원래 판서 그대로 둔다. 원장이 보낸 참고 그림의 알약 모양 제목까지 베꼈다가 「그런 거 왜 넘어, 참고하라는 거지」로 되돌렸다 — **참고 그림은 분위기만 가져오고 요소를 복사하지 않는다.**
- 색은 지필드 초록 계열만(파랑 금지 — 스킬 `gfield-textbook-design`).

## 6. 음성 — 겹치지 않게

- 말할 때마다 `speakSeq`를 올리고, 녹음을 찾는 사이(비동기)에 다른 말이 시작됐으면 자기 말을 버린다. 이 경주 조건 때문에 「음성이 겹치고 난리」가 났었다.
- 판서의 첫 말은 **장 안내 말(intro)이 끝난 뒤에** 한다(`say: async … await intro`).
- 판서·게임 대사는 `voiceLine(kind, text)` → `fcs-<kind>-<fnv>` id로 독쌤 복제 음성(manifest)을 찾고, 없으면 기기 음성. 새 대사를 넣으면 `node fields-classic/question-bank/tools/export-study-voice.mjs`로 목록을 다시 만들고 `--check`, 녹음은 맥 지시서(`scripts/local/WORK-ORDER-docssam-voice-mac-20261028.md`)로. **구글 유료 음성은 켜지 않는다.**
- 숫자가 바뀌는 말은 경우마다 펼쳐 목록에 넣어야 녹음이 생긴다(안 펼치면 그 말만 기기 음성).

## 7. 확인

1. 판서 장 3개 이상을 PC 폭(1280)과 900px 이하에서 캡처 — 독쌤이 오른쪽에 있고, 좁은 폭에서는 숨는지.
2. 말하는 동안 얼굴이 A2~A4 사이를 오가고 1/3은 다무는지(이미지 `on` 기록으로 확인).
3. 「봐요」로 시작하는 말에 point, 물음에 think가 먼저 나오는지.
4. 장을 빠르게 넘겨도 두 목소리가 겹치지 않는지.
5. `&look=plain`이 예전 모양인지.

## 했던 실수

| 실수 | 결과 | 지금 |
|---|---|---|
| 그림마다 따로 여백 자르기 | 얼굴 바뀔 때마다 몸이 들썩 | 10장 합집합 상자 |
| 녹음 찾기 비동기 경주 | 두 목소리 동시 재생 | `speakSeq` 확인 + intro 기다림 |
| 참고 그림의 알약 제목 복사 | 원장이 거름 | 점선·종이만 |
| 입을 소리와 상관없이 일정 박자로 | 「입이 더 움직여야지」 | 모음 따라 · 1/3 다묾 |
