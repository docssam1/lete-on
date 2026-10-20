#!/bin/bash
# ============================================================
#  교재 실사 사진 만들기 — 맥(애플 칩) 전용, 비용 0
#
#  원장 지시(2026-10-19): "실사 수준으로 만들어야 하는거 알지"
#  원장 맥: M5 Pro · 메모리 24 GB · 남은 공간 350 GB
#   → FLUX.1-schnell(Apache 2.0)을 애플 칩 전용 실행기 mflux(MLX, MIT)로 8비트 실행(메모리 약 13 GB)
#
#  하는 일
#   1) 처음 한 번: uv(파이썬 관리 도구)와 mflux 를 설치한다 — 파이썬을 따로 깔 필요 없음
#   2) 장면마다 후보 3장을 만든다(처음에는 모델 약 34 GB 를 받느라 오래 걸림)
#   3) book-photos/고르기.html 을 열고, 후보를 GitHub 수신 브랜치 inbox/book-photos 로 올린다
#      — 이 맥의 원래 작업 폴더와 main 은 건드리지 않는다
#  다 끝나면 Claude 에게 "사진 올렸어" 라고만 말해 주세요. 중간에 끊겨도 다시 실행하면 이어서 합니다.
# ============================================================
cd "$(dirname "$0")/../.." || exit 1
export PATH="$HOME/.local/bin:$PATH"

# 이 도구는 작업 브랜치에 있다. 전용 폴더(lete-on-photos, git worktree)에서 돌고, 돌 때마다 최신 장면 목록을 받는다.
SRC=claude/jolly-allen-w57yqh
echo "  [준비] 최신 장면 목록 받는 중..."
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
if ! command -v mflux-generate >/dev/null 2>&1; then
  echo "  [준비] mflux 설치 중... (처음 한 번, 몇 분)"
  uv tool install --python 3.12 mflux || { echo "  [!] mflux 설치 실패 - 위 메시지를 Claude 에게 주세요."; read -r; exit 1; }
fi

echo
echo "  [실행] 사진 만드는 중... (처음에는 모델을 받느라 오래 걸려요)"
if ! uv run --python 3.12 --with pillow python scripts/book-photos.py --model mflux "$@"; then
  echo
  echo "  [!] 실패했습니다. 위 메시지를 그대로 복사해 Claude 에게 주세요."
  read -r; exit 1
fi
open "book-photos/고르기.html"
echo
echo "  완료. Claude 에게 \"사진 올렸어\" 라고 말해 주세요. (엔터를 누르면 창이 닫혀요)"
read -r
