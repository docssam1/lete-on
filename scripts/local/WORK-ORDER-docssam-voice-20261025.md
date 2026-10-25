# 작업 지시서 — 독쌤 목소리(OmniVoice 복제) 만들기 (2026-10-25)

윈도우 PC(엔비디아 GTX 1660 SUPER 6GB)에서 한다. 클라우드 쪽에는 GPU와 녹음이 없어서 이 일은 PC에서만 된다.

## 목표
빠진 독쌤 음성을 만들어 `science-lab/audio/docssam/`에 넣고 main에 push 한다.
- 손글씨 판서 **1,764줄**(2026-10-27 기준 — 1~10권 학습 차시 126개 판서 완료, 고치면 줄 수가 조금 바뀔 수 있다) — 줄 id가 `fcb-`로 시작(`fields-classic/question-bank/data/voice/boards.voice.json`)
- 사이언스 랩 **188줄** — `science-lab/data/voice/*.voice.json`
push 되면 학생 화면이 그 줄을 독쌤 목소리로 틀고, 없는 줄은 지금처럼 기기 음성으로 읽는다. 사이트 코드는 손댈 필요 없다.

## 작업 폴더
`E:\Codex\worktrees\lete-on-science-bank-review-20261010` (독립 클론, main)
- sparse-checkout이다. `science-lab`, `scripts`, `.source-memory`에 더해 `fields-classic/question-bank/data/voice`를 목록에 넣어 두었다(없으면 fcb- 줄이 0으로 보인다).
- 시작 전에 `git pull` — 판서 줄은 계속 늘어난다. 받은 main의 `boards.voice.json` 줄 수만큼이 대상이다.
- **다른 작업본(`lete-on-nm-omnivoice-20261018`, `lete-on-nm-voice-candidates-20261023` 등)은 다른 사람이 진행 중이다. 파일을 고치지 말 것.** 그쪽 가상환경을 *읽어서 실행*하는 것은 괜찮다.

## 지금 상태(인계 시점)
- 만들어진 mp3: **0개**.
- 이 폴더의 `.venv-omnivoice`: torch 설치가 중간에 끊겨 깨졌고(`caffe2_nvrtc.dll` 로드 실패), 다시 설치하다가 `pip install omnivoice ...`가 약 30분 동안 거의 CPU를 안 쓰고 멈춰 있다가 사라졌다. 지금 `import omnivoice`가 실패한다.
- 다른 환경 `E:\Codex\.chatgpt-projects\g-p-6a33de2990d481918518a9a957dbb24e\lete-on-nm-omnivoice-20261018\.venv-omnivoice`도 `import omnivoice`가 실패한다(오류 글은 아직 안 봤다).
- 녹음(참조 음성): `%USERPROFILE%\Downloads\녹음 2026-09-24 045754.mp4`. 한글 경로가 문제면 저장소 **밖**에 ASCII 이름으로 복사해서 쓴다.

## 순서
1. **환경 진단** — 두 환경에서 오류 글을 본다.
   `<venv>\Scripts\python.exe -c "import torch; print(torch.__version__, torch.cuda.is_available()); import omnivoice; print('ok')"`
   - torch는 되고 omnivoice만 없으면: `pip install --timeout 30 --retries 5 omnivoice soundfile librosa imageio-ffmpeg`
   - torch부터 깨졌으면: 이 폴더의 `.venv-omnivoice`를 지우고 `scripts\local\_setup-omnivoice.cmd`(CUDA 12.8 torch)로 새로 만든다. pip에 `--timeout 30 --retries 5`를 붙여 멈춤을 막는다.
   - `torch.cuda.is_available()`가 `True`여야 한다. False면 진행하지 말고 보고한다.
2. **빠진 줄 확인**: `python scripts\check-docssam-voice.py` → 판서(fcb-) 1,764줄 + 사이언스 랩 188줄 안팎이 나와야 한다.
3. **생성**:
   `python scripts\omnivoice-docssam.py --ref "<녹음 경로>" --device auto --speed 0.8`
   - `--speed 0.8` = 공부용 느린 목소리(`docssam-clone-v2-slow`). 판서·사이언스 랩 둘 다 공부 대사라 이 값으로 한다.
   - 이미 있는 파일은 건너뛰므로 끊겨도 같은 명령으로 이어서 하면 된다.
   - 판서부터 따로 하고 싶으면 `--only`에 fcb- id를 쉼표로 넣는다(목록은 `boards.voice.json`).
   - 6GB라 메모리가 모자라면 `--shard 0/4`…`3/4`로 나눠 돌린다. 받아 적기 검사는 기본으로 CPU에서 돈다(`--asr-device cpu`).
4. **검사**:
   - `.docssam-work\report.json` — 줄마다 CER(받아 적은 글과 원문의 차이). 0.35를 넘는 줄은 생성기가 올리지 않는다. 그 줄 목록을 보고한다.
   - `.docssam-work\듣기.html` — 원본 녹음과 만든 음성을 번갈아 들어 같은 사람 목소리인지 확인한다.
   - `python scripts\check-docssam-voice.py`를 다시 돌려 남은 줄이 CER 실패분뿐인지 본다.
   - `science-lab\audio\docssam\manifest.json`의 `files`에 `fcb-`로 시작하는 파일이 몇 개인지 센다.
5. **올리기** — `science-lab\audio\docssam`만 커밋한다. 커밋 두 개로 나눈다.
   - `독쌤 음성: 손글씨 판서 N줄`(N = 실제로 만든 수)  (fcb- 파일 + manifest.json)
   - `독쌤 음성: 사이언스 랩 N줄`
   - push 전에 `git pull --rebase`. main에 바로 push.

## 하지 말 것
- **녹음 원본(.mp4·.wav)과 `.docssam-work` 폴더를 커밋하지 말 것.** 공개 저장소라 누구나 목소리를 복제할 수 있게 된다.
- 구글 음성(유료 TTS)을 켜지 말 것. 이 일은 0원이어야 한다.
- 생성기·사이트 코드를 고쳐야 하면 음성 커밋과 섞지 말고 따로 커밋하고, 왜 고쳤는지 보고에 적는다.
- 다른 작업본의 파일을 고치지 말 것.

## 보고할 것
1. 쓴 환경(경로)과 `torch.cuda.is_available()` 결과
2. 만든 줄 수(판서 / 사이언스 랩), CER 0.35를 넘어 빠진 줄 id 목록
3. 속도(RTF — 로그 끝, 음성 1초를 만드는 데 걸린 초)
4. 커밋 해시 두 개
5. 듣기.html로 들어 봤을 때 목소리가 같은지 한 줄 소감
