#!/bin/bash
# ============================================================
#  자연관찰대회 공원 지도 실사풍 — 맥(애플 칩) 전용, 비용 0
#
#  원장 지시(2026-10-26): 「FLUX.2 Klein 으로 진행해」
#   → Blender 디오라마 렌더를 참조 그림으로 FLUX.2 [klein] 4B(Apache 2.0)가 실사풍으로 다시 그린다.
#     애플 칩 전용 실행기 mflux(MLX, MIT)로 4비트 실행. 9B 는 비상업 라이선스라 쓰지 않는다.
#
#  하는 일
#   1) 처음 한 번: uv 와 mflux(0.23 이상 — FLUX.2 지원)를 설치한다
#   2) 넓은 화면·세로 화면마다 후보 3장(처음에는 모델 약 15 GB 를 받느라 오래 걸림)
#   3) park-flux/고르기.html 을 열고, 후보를 GitHub 수신 브랜치 inbox/park-flux 로 올린다
#      — 이 맥의 원래 작업 폴더와 main 은 건드리지 않는다
#  다 끝나면 Claude 에게 "지도 올렸어" 라고만 말해 주세요. 중간에 끊겨도 다시 실행하면 이어서 합니다.
#  이미 4비트로 저장해 둔 FLUX.2 Klein 폴더가 있으면:  PARK_FLUX_MODEL_PATH=<폴더> bash scripts/local/park-flux.command --quantize 0
# ============================================================
cd "$(dirname "$0")/../.." || exit 1
export PATH="$HOME/.local/bin:$PATH"

SRC=claude/jolly-allen-w57yqh
echo "  [준비] 최신 지도 렌더 받는 중..."
if git symbolic-ref -q HEAD >/dev/null 2>&1; then
  git pull --ff-only >/dev/null 2>&1 || echo "   (받지 못했습니다 - 지금 폴더에 있는 것으로 진행합니다)"
else
  { git fetch origin "$SRC" && git checkout --detach FETCH_HEAD; } >/dev/null 2>&1 || echo "   (받지 못했습니다 - 지금 폴더에 있는 것으로 진행합니다)"
fi

if ! command -v uv >/dev/null 2>&1; then
  echo "  [준비] uv 설치 중... (처음 한 번)"
  curl -LsSf https://astral.sh/uv/install.sh | sh || { echo "  [!] uv 설치 실패 - 위 메시지를 Claude 에게 주세요."; read -r; exit 1; }
  export PATH="$HOME/.local/bin:$PATH"
fi
if ! command -v mflux-generate-flux2-edit >/dev/null 2>&1; then
  echo "  [준비] mflux 설치·업데이트 중... (FLUX.2 는 0.23 이상, 몇 분)"
  uv tool install --python 3.12 --upgrade "mflux>=0.23" || { echo "  [!] mflux 설치 실패 - 위 메시지를 Claude 에게 주세요."; read -r; exit 1; }
fi

echo
echo "  [실행] 지도 그리는 중... (처음에는 모델을 받느라 오래 걸려요)"
if ! uv run --python 3.12 --with pillow python scripts/park-flux.py "$@"; then
  echo
  echo "  [!] 실패했습니다. 위 메시지를 그대로 복사해 Claude 에게 주세요."
  read -r; exit 1
fi
open "park-flux/고르기.html"
echo
echo "  완료. Claude 에게 \"지도 올렸어\" 라고 말해 주세요. (엔터를 누르면 창이 닫혀요)"
read -r
