#!/bin/bash
# 맥(애플 칩)용 OmniVoice 준비 단계 — omnivoice-*.command 가 `source` 로 부른다. 윈도우판은 _setup-omnivoice.cmd.
# 원장 지시(2026-10-24): "이제 옴니보이스 맥에도 설치하자"
#  - 파이썬은 uv 가 알아서 받는다(book-photos.command 와 같은 방식). 따로 깔 필요 없음.
#  - 가상환경은 저장소 루트 .venv-omnivoice 하나. 처음 한 번만 설치하고 다음부터는 바로 돈다.
#  - 맥의 GPU 는 MPS. torch 의 기본 맥 빌드에 들어 있다. MPS 에 없는 연산은 CPU 로 물러서게 한다.
cd "$(dirname "${BASH_SOURCE[0]}")/../.." || return 1
export PATH="$HOME/.local/bin:$PATH"
export PYTORCH_ENABLE_MPS_FALLBACK=1

# 최신 코드로 맞춘다. --ff-only 라 이 맥에서 손댄 게 있으면 덮지 않고 지금 것으로 진행한다.
if git symbolic-ref -q HEAD >/dev/null 2>&1; then
  echo "  [준비] 최신 코드 받는 중..."
  git pull --ff-only >/dev/null 2>&1 || echo "   (받지 못했습니다 - 지금 폴더에 있는 것으로 진행합니다)"
fi

if ! command -v uv >/dev/null 2>&1; then
  echo "  [준비] uv 설치 중... (처음 한 번)"
  curl -LsSf https://astral.sh/uv/install.sh | sh || { echo "  [!] uv 설치 실패 - 위 메시지를 Claude 에게 주세요."; return 1; }
  export PATH="$HOME/.local/bin:$PATH"
fi

VENV=.venv-omnivoice
if [ ! -x "$VENV/bin/python" ]; then
  echo "  [준비] 가상환경 만드는 중... (파이썬 3.12)"
  uv venv --python 3.12 "$VENV" >/dev/null || { echo "  [!] 가상환경을 만들지 못했습니다."; return 1; }
fi
# shellcheck disable=SC1091
source "$VENV/bin/activate"

if [ ! -f "$VENV/.installed" ]; then
  echo "  [준비] torch 와 OmniVoice 설치 중... 처음 한 번만, 몇 분 걸립니다."
  # librosa: ffmpeg 없이 우리 MP3 에서 참조 음성을 뽑는다 · imageio-ffmpeg: 녹음(mp4·m4a)을 읽는다
  uv pip install torch torchaudio omnivoice soundfile librosa imageio-ffmpeg || { echo "  [!] 설치 실패 - 위 메시지를 Claude 에게 주세요."; return 1; }
  date > "$VENV/.installed"
fi

python -c "import torch;print('  장치:', 'cuda' if torch.cuda.is_available() else ('애플 칩 GPU(MPS)' if torch.backends.mps.is_available() else '없음 - CPU 로 돕니다'))"
return 0
