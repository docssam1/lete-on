# 작업 지시서 — 맥에서 스스로 공부 덱 대사 207줄 만들기 (2026-10-28)

PC(윈도우)는 손글씨 판서(`fcb-`)를 계속 만든다. **맥은 스스로 공부 덱 대사(`fcs-`) 207줄만** 만든다.
같은 줄을 두 컴퓨터가 겹쳐 만들지 않게 줄 이름 앞머리로 나눈다(생성기 `--prefix fcs-`).
환경·주의점은 `WORK-ORDER-docssam-voice-20261025.md`·`-20261026.md`와 같다. 여기에는 맥에서 다른 것만 적는다.

## 지금 상태
- `python3 scripts/check-docssam-voice.py` 마지막 줄 `빠진 독쌤 음성: 1133줄` = 판서 926 + 덱 대사 207(2026-10-28 오전).
- 덱 대사 목록: `fields-classic/question-bank/data/voice/study-deck.voice.json`(줄 id `fcs-…`).
- **맥에서 끝까지 돌려 본 적이 아직 없다.** 첫 실행이 곧 설치다(uv · 파이썬 3.12 · torch · OmniVoice 모델 몇 GB).

## 순서
1. 저장소를 최신으로: `git pull`
2. 녹음 파일 확인: 다운로드 폴더에 **「녹음 2026-09-24 045754.mp4」**(PC와 같은 독쌤 원본 녹음). 이름이 다르면 실행할 때 창에 끌어다 놓는다.
   **이 녹음과 `.docssam-work` 폴더는 절대 커밋하지 않는다.**
3. 실행: Finder에서 `scripts/local/omnivoice-docssam-deck.command` 더블클릭
   (터미널이면 `bash scripts/local/omnivoice-docssam-deck.command`).
   - 안에서 `python scripts/omnivoice-docssam.py --ref <녹음> --device auto --speed 0.8 --prefix fcs-`를 부른다.
   - 첫 줄에 `이번에 만들 것 207줄`이 찍혀야 한다(판서가 섞여 나오면 멈추고 보고).
   - MPS(애플 칩)에서 오류가 나면 `--device cpu`로 다시 돌리고 오류 글을 그대로 보고한다.
4. **처음 몇 줄이 나오면 먼저 듣는다**: `.docssam-work/듣기.html`에서 원본 녹음, 그리고 이미 올라간 판서 음성(`science-lab/audio/docssam/fcb-…mp3` 아무거나)과 번갈아 들어 **같은 사람·같은 빠르기**인지. 다르면 멈추고 보고한다.
5. 끝나면 `python3 scripts/check-docssam-voice.py` → `fcs-` 줄이 남아 있으면 CER(받아 적기) 검사에서 빠진 것 — 그 id만 보고한다.
6. 올리기(PC와 목록 파일 충돌을 피하는 순서):
   ```
   git pull
   python3 scripts/omnivoice-docssam.py --manifest-only     # 두 컴퓨터의 mp3를 합쳐 목록을 다시 만든다
   git add science-lab/audio/docssam/fcs-*.mp3 science-lab/audio/docssam/manifest.json
   git commit -m "독쌤 음성: 스스로 공부 덱 대사 N줄 (맥)"
   git push
   ```
   push가 거절되면 다시 `git pull` → `manifest.json`이 충돌하면 아무 쪽이나 고른 뒤 `--manifest-only`를 다시 돌리고 커밋한다(목록은 폴더의 mp3로 다시 만들어지므로 내용을 손으로 맞추지 않는다).

## PC 쪽에 알릴 것
- PC는 대사를 파일 순서대로 만든다(판서 `boards` → 덱 `study-deck`). 판서 926줄을 다 만들기 전에 맥이 덱 대사를 올리면 겹치지 않는다.
- PC가 판서를 다 끝냈을 때 **`git pull`부터** 한다 — 맥이 올린 `fcs-` 파일이 있으면 생성기가 건너뛴다.
- 겹치지 않게 확실히 하려면 PC도 `--prefix fcb-`를 붙여 돌린다.

## 보고할 것
1. 맥 기종·칩·메모리, 쓴 장치(mps/cpu)
2. 207줄을 만드는 데 걸린 시간(로그의 RTF가 있으면 그것도)
3. 듣기 확인 결과(같은 목소리인지)
4. CER 검사에서 빠진 줄 id
