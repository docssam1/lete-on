#!/bin/bash
# 디딤돌 개념연산 PDF 차례 OCR(맥 내장 Vision) — 더블클릭. 2026-11-25 원장 「그러면 맥 ocr 돌려」
# 결과는 구글 드라이브의 PDF 폴더 안 「차례-OCR」 에 저장된다(저장소에는 넣지 않음).
cd "$(dirname "$0")/../.." || exit 1
export PATH="$HOME/.local/bin:$PATH"
echo ""
echo "  디딤돌 개념연산 차례 OCR"
echo "  -----------------------"
if git symbolic-ref -q HEAD >/dev/null 2>&1; then git pull --ff-only >/dev/null 2>&1; fi
if ! command -v uv >/dev/null 2>&1; then
  echo "  [준비] uv 설치 중... (처음 한 번)"
  curl -LsSf https://astral.sh/uv/install.sh | sh || { echo "  [!] uv 설치 실패 - 이 창 내용을 Claude 에게 주세요."; read -r -p "  엔터를 누르면 닫힙니다"; exit 1; }
  export PATH="$HOME/.local/bin:$PATH"
fi
uv run --python 3.12 --with pyobjc-framework-Vision --with pyobjc-framework-Quartz python scripts/didimdol-toc-ocr.py "$@"
echo ""
read -r -p "  엔터를 누르면 창이 닫힙니다"
