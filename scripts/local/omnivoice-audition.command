#!/bin/bash
# OmniVoice 목소리 설계 시청 — 맥판(윈도우판: omnivoice-audition.cmd). 결과는 저장소 루트 audition/ 에.
# shellcheck disable=SC1091
source "$(dirname "$0")/_setup-omnivoice.sh" || { echo "  [!] 준비 단계 실패"; read -r; exit 1; }
echo
echo "  [실행] 목소리 4종으로 대사를 읽히는 중..."
if ! python scripts/omnivoice-audition.py --out audition --device auto "$@"; then
  echo; echo "  [!] 실패했습니다. 위 메시지를 그대로 복사해 Claude 에게 주세요."; read -r; exit 1
fi
open audition
read -r
