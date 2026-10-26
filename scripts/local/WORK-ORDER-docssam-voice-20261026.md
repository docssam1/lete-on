# 작업 지시서 — 독쌤 목소리 남은 판서 1,667줄 만들기 (2026-10-26)

앞 지시서(`WORK-ORDER-docssam-voice-20261025.md`)의 이어하기다. 환경 진단·주의점은 그 문서와 같고, 여기에는 **지금 상태와 남은 일**만 적는다.
클라우드 쪽에는 GPU와 녹음이 없어서 이 일은 원장 PC(또는 맥)에서만 된다.

## 지금 상태 (2026-10-26, main 기준)
- 올라온 것: 커밋 `72159610` 「독쌤 음성: 손글씨 판서 97줄」 · `79042f2d` 「독쌤 음성: 사이언스 랩 188줄」(둘 다 2026-10-26 01:32).
  - `science-lab/audio/docssam/manifest.json`의 `files` 405개, 그중 `fcb-` 97개 = 1권 5개 차시 분량.
- **남은 것: 판서(`fcb-`) 1,667줄. 사이언스 랩은 0줄 — 다 끝났다.**
  - `python scripts/check-docssam-voice.py` 마지막 줄이 `빠진 독쌤 음성: 1667줄`, 전부 `boards.voice.json`.
  - 판서 전체는 1,764줄(126개 차시). 97 + 1,667 = 1,764.
- 97줄에서 왜 멈췄는지는 기록이 없다. **먼저 원인을 확인하고 보고한다**(중간에 창을 닫았는지, 메모리 부족인지, CER 검사에서 빠진 것인지). `.docssam-work\report.json`이 남아 있으면 거기부터 본다.

## 어디서 하나
- **윈도우 PC(엔비디아 GTX 1660 SUPER 6GB) — 우선.** 앞 97줄을 만든 곳이 여기다.
  작업 폴더 `E:\Codex\worktrees\lete-on-science-bank-review-20261010`(sparse-checkout에 `fields-classic/question-bank/data/voice`가 들어 있어야 한다. 없으면 fcb- 줄이 0으로 보인다).
- **맥(애플 칩) — 대안.** `scripts/local/omnivoice-docssam.command`(준비 단계 `_setup-omnivoice.sh`, uv · 파이썬 3.12 · MPS). **맥 실행은 아직 한 번도 끝까지 확인되지 않았다.** 첫 실행이 곧 설치다. MPS에서 오류가 나면 `--device cpu`로 돌리고 오류 글을 그대로 보고한다.
- **다른 작업본(`lete-on-nm-omnivoice-20261018`, `lete-on-nm-voice-candidates-20261023` 등)은 다른 사람이 진행 중이다. 파일을 고치지 말 것.**

## 순서
1. `git pull` (판서 줄 수가 바뀌었을 수 있다 — 받은 main의 `boards.voice.json`이 대상).
2. 환경 확인
   `python -c "import torch; print(torch.__version__, torch.cuda.is_available()); import omnivoice; print('ok')"`
   윈도우는 `True`여야 한다(맥은 `torch.backends.mps.is_available()`). 아니면 앞 지시서 1번(환경 진단)대로 고치고, 안 되면 멈추고 보고한다.
3. 빠진 줄 확인: `python scripts\check-docssam-voice.py` → 1,667줄 안팎.
4. 생성 — 앞과 **같은 녹음·같은 속도**로 한다(목소리가 섞이면 안 된다).
   `python scripts\omnivoice-docssam.py --ref "<녹음 경로>" --device auto --speed 0.8`
   - 녹음: `%USERPROFILE%\Downloads\녹음 2026-09-24 045754.mp4`(맥은 `~/Downloads/` 같은 이름). 한글 경로가 문제면 저장소 **밖**에 ASCII 이름으로 복사해서 쓴다.
   - 이미 있는 파일은 건너뛴다. 끊겨도 같은 명령으로 이어서 하면 된다. `--force`는 쓰지 말 것(만든 97줄을 다시 만든다).
   - 1,667줄은 길다. 6GB에서 메모리가 모자라거나 오래 걸리면 `--shard 0/4` … `3/4`로 나눠 돌리고, 조각이 끝날 때마다 아래 5·6을 해서 **중간중간 올린다**(이번처럼 중간에 멈춰도 만든 만큼은 남게).
   - 받아 적기 검사는 기본으로 CPU(`--asr-device cpu`). 끄지 말 것.
5. 검사
   - `.docssam-work\report.json` — CER 0.35를 넘는 줄은 생성기가 올리지 않는다. 그 id 목록을 보고한다.
   - `.docssam-work\듣기.html` — 원본 녹음과 번갈아 들어 같은 사람 목소리인지, 앞에 만든 1권 판서와 같은 목소리인지 확인.
   - `python scripts\check-docssam-voice.py` 다시 → 남은 줄이 CER 실패분뿐이어야 한다.
6. 올리기 — `science-lab\audio\docssam`만 커밋한다(fcb- mp3 + manifest.json).
   - 커밋 메시지: `독쌤 음성: 손글씨 판서 N줄`(N = 그 커밋에서 실제로 더한 수). 조각마다 나눠 올려도 된다.
   - push 전에 `git pull --rebase`. main에 바로 push.

## 하지 말 것
- **녹음 원본(.mp4·.wav)과 `.docssam-work` 폴더를 커밋하지 말 것.** 공개 저장소라 누구나 목소리를 복제할 수 있게 된다.
- 구글 음성(유료 TTS)을 켜지 말 것. 이 일은 0원이어야 한다.
- 판서 대사(`boards.voice.json`)를 고치지 말 것. 대사가 이상하면 id와 이유만 보고한다(골든벨 정답 보호 규칙 때문에 대사는 이쪽에서 고친다).
- 생성기·사이트 코드를 고쳐야 하면 음성 커밋과 섞지 말고 따로 커밋하고, 왜 고쳤는지 보고에 적는다.

## 보고할 것
1. 97줄에서 멈췄던 원인(알 수 있으면)
2. 쓴 컴퓨터·환경 경로와 GPU 확인 결과
3. 만든 줄 수, CER 0.35를 넘어 빠진 줄 id 목록
4. 속도(RTF — 로그 끝, 음성 1초를 만드는 데 걸린 초)와 전체 걸린 시간
5. 커밋 해시
6. 듣기.html로 들어 본 한 줄 소감(앞 97줄과 같은 목소리인지)
