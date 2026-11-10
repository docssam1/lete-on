# 독쌤 음성 — 빠진 24줄 (2026-11-07, 2026-11-10에 4줄 더함)

원장 2026-11-07 「필즈더클래식 하위 링크 중 하나가 기계음으로 나온다」 → 스스로 공부 덱 82개를 브라우저로 끝까지 넘겨 보며 기기 음성(기계음)으로 나온 말을 모두 모았다. 나온 것은 **녹음이 없는 20줄뿐**이었고, `python scripts/check-docssam-voice.py`의 목록과 똑같다.

| 어디 | 줄 | id 앞머리 |
|---|---|---|
| 9권 1단원 1차시 판서(모양과 크기가 같게 나눠요, 2026-11-04 새로 만듦) | 13 | `fcb-book-09-partition-congruent-` |
| 9권 1단원 1차시 개념 장 안내 | 1 | `fcs-concept-` |
| 차시 표지 안내 — 5권 3단원 2차시 · 7권 3단원 1·2차시 · 7권 4단원 1차시 · 9권 1단원 2차시 · 10권 1단원 3차시 | 6 | `fcs-cover-` |
| 게임 이름을 「공방」에서 「게임」으로 바꿈(원장 2026-11-10 「연습 공방이라는 이름 낯설다」): 「연습 게임이에요 …」 2줄 · 「디지털 숫자 게임이에요 …」 · 「뒤집고 돌리기 게임이에요 …」 | 4 | `fcs-game-` |

## 할 일(PC든 맥이든 한 대에서)

1. `git pull` — `fields-classic/question-bank/data/voice/boards.voice.json`·`study-deck.voice.json`이 새 줄을 담고 있다.
2. `python scripts/check-docssam-voice.py` → **24줄**이 나와야 한다.
3. 늘 하던 명령으로 만든다(이미 있는 파일은 건너뛰므로 이 24줄만 만들어진다).
   - PC: `scripts\local\omnivoice-docssam.cmd`
   - 맥: `scripts/local/omnivoice-docssam.command`
4. 다시 `python scripts/check-docssam-voice.py` → **0줄**.
5. `science-lab/audio/docssam/`만 커밋한다(새 mp3 + manifest.json). 참조 녹음·중간 WAV는 올리지 않는다.

녹음이 들어가기 전까지 이 24줄은 기기 음성으로 나온다. 덱 대사를 또 고치면 `node fields-classic/question-bank/tools/export-study-voice.mjs`와 `export-board-voice.mjs`로 목록을 다시 만든 뒤 2번부터 한다.
