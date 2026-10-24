#!/bin/bash
# ============================================================
#  넘버스 오브 매직 앱 음성 — OmniVoice 복제 목소리로 전부 만들기 (맥판, 윈도우판: omnivoice-nm.cmd)
#  결과: number_magic/audio/omni/*.mp3 + number_magic/data/tts-map-omni.js
#        .omni-nm-work/듣기.html  (참조와 만든 음성을 한 장에서 비교)
#  한 번 만든 줄은 다음 실행에서 건너뛴다 - 중간에 꺼도 이어서 된다.
#  처음엔 몇 줄만 들어 보려면 터미널에서:  scripts/local/omnivoice-nm.command --limit 12
# ============================================================
# shellcheck disable=SC1091
source "$(dirname "$0")/_setup-omnivoice.sh" || { echo "  [!] 준비 단계 실패"; read -r; exit 1; }

echo
echo "  [실행] 앱 대사를 복제 목소리로 만드는 중... 처음엔 모델을 받느라 오래 걸립니다."
if ! python scripts/omnivoice-nm.py --device auto "$@"; then
  echo; echo "  [!] 실패했습니다. 위 메시지를 그대로 복사해 Claude 에게 주세요."; read -r; exit 1
fi
echo
echo "  완료. 괜찮으면 아래 두 곳을 GitHub 에 올려 주세요:"
echo "    number_magic/audio/omni/"
echo "    number_magic/data/tts-map-omni.js"
echo "  (그다음 Claude 에게 \"넘버스 음성 올렸어\" 라고만 말하면 됩니다.)"
[ -f ".omni-nm-work/듣기.html" ] && open ".omni-nm-work/듣기.html"
read -r
