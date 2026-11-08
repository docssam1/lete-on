#!/bin/bash
# ============================================================
#  독쌤 목소리 비교 듣기 — 지금(OmniVoice) 옆에 Qwen3-TTS 복제 음성을 나란히 (맥판, 윈도우판: qwen3tts-audition.cmd)
#  결과: .docssam-work/qwen3/듣기.html · 사이트 음성은 바꾸지 않고 녹음 원본도 올리지 않는다.
#  처음 한 번은 설치와 모델 받기(약 5GB)로 오래 걸린다.
# ============================================================
cd "$(dirname "$0")/../.." || exit 1
export PATH="$HOME/.local/bin:$PATH"
export PYTORCH_ENABLE_MPS_FALLBACK=1
if git symbolic-ref -q HEAD >/dev/null 2>&1; then
  echo "  [준비] 최신 코드 받는 중..."
  git pull --ff-only >/dev/null 2>&1 || echo "   (받지 못했습니다 - 지금 폴더에 있는 것으로 진행합니다)"
fi
if ! command -v uv >/dev/null 2>&1; then
  echo "  [준비] uv 설치 중... (처음 한 번)"
  curl -LsSf https://astral.sh/uv/install.sh | sh || { echo "  [!] uv 설치 실패"; read -r; exit 1; }
  export PATH="$HOME/.local/bin:$PATH"
fi
VENV=.venv-qwen3tts   # OmniVoice 와 필요한 판이 달라 따로 둔다
[ -x "$VENV/bin/python" ] || uv venv --python 3.12 "$VENV" >/dev/null || { echo "  [!] 가상환경 실패"; read -r; exit 1; }
# shellcheck disable=SC1091
source "$VENV/bin/activate"
if [ ! -f "$VENV/.installed" ]; then
  echo "  [준비] torch 와 Qwen3-TTS 설치 중... 처음 한 번만, 몇 분 걸립니다."
  uv pip install torch torchaudio qwen-tts soundfile numpy imageio-ffmpeg || { echo "  [!] 설치 실패 - 위 메시지를 Claude 에게 주세요."; read -r; exit 1; }
  date > "$VENV/.installed"
fi
REF="${1:-$HOME/Downloads/녹음 2026-09-24 045754.mp4}"
if [ ! -f "$REF" ]; then
  printf "  독쌤 녹음 파일을 이 창에 끌어다 놓고 엔터를 누르세요: "
  read -r REF; REF="${REF%\"}"; REF="${REF#\"}"; REF="${REF//\\ / }"; REF="${REF%% }"
  [ -f "$REF" ] || { echo "  [!] 그 파일이 없습니다: $REF"; read -r; exit 1; }
fi
shift 1 2>/dev/null || true
echo; echo "  [실행] 같은 대사 8줄을 Qwen3-TTS 로 만드는 중..."
if ! python scripts/qwen3tts-audition.py --ref "$REF" "$@"; then
  echo; echo "  [!] 실패했습니다. 메모리가 모자라면 끝에 --model Qwen/Qwen3-TTS-12Hz-0.6B-Base 를 붙여 다시. 그 밖에는 위 메시지를 Claude 에게."; read -r; exit 1
fi
echo; echo "  완료. 듣기 페이지를 엽니다. 어느 쪽이 녹음과 더 같은 사람 같은지 Claude 에게 알려 주세요."
open ".docssam-work/qwen3/듣기.html"
read -r
