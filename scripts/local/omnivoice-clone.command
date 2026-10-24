#!/bin/bash
# ============================================================
#  OmniVoice 목소리 복제 — 맥(애플 칩)판. 처음 실행이 곧 「맥에 설치」다.
#  윈도우판: omnivoice-clone.cmd (같은 파이썬 스크립트를 쓴다)
#
#  원장 지시(2026-10-24): "이제 옴니보이스 맥에도 설치하자"
#   1) 처음 한 번: uv · 파이썬 3.12 · torch · OmniVoice 를 저장소 안 .venv-omnivoice 에 설치
#   2) 우리 MP3(공개 URL)에서 언어마다 3~10초짜리 참조 음성을 뽑는다(전사는 우리가 합성에 쓴 그 문장)
#   3) 그 참조로 앱 대사를 다시 읽혀 clone/ 에 담고, clone/듣기.html 을 연다
#      원본과 복제를 번갈아 눌러 같은 사람 목소리로 들리면 맥 설치 성공
#  구글·Supabase 키를 쓰지 않고, 아무것도 올리지 않습니다.
#  처음에는 모델(수 GB)을 받느라 오래 걸립니다. 중간에 끊겨도 다시 실행하면 이어서 합니다.
# ============================================================
# shellcheck disable=SC1091
source "$(dirname "$0")/_setup-omnivoice.sh" || { echo "  [!] 준비 단계 실패"; read -r; exit 1; }

echo
echo "  [실행] 참조 음성 뽑고 복제하는 중... 모델을 처음 받을 땐 오래 걸립니다."
if ! python scripts/omnivoice-clone.py --out clone --ref-dir clone-ref --device auto "$@"; then
  echo
  echo "  [!] 실패했습니다. 위 메시지를 그대로 복사해 Claude 에게 주세요."
  read -r; exit 1
fi
echo
echo "  완료. 듣기 페이지를 엽니다 - 원본과 복제를 번갈아 눌러 비교하세요."
echo "  (로그 끝의 RTF 가 맥 속도입니다. 1 보다 작으면 실시간보다 빠릅니다.)"
open "clone/듣기.html"
echo "  엔터를 누르면 창이 닫혀요."
read -r
