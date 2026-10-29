#!/bin/bash
# ============================================================
#  독쌤 목소리 만들기 — 사이언스 랩 독쌤 대사 전부 (맥판, 윈도우판: omnivoice-docssam.cmd)
#  쓰는 법: 더블클릭하면 다운로드 폴더에서 「녹음 2026-09-24 045754.mp4」를 찾고,
#          없으면 녹음 파일을 이 창에 끌어다 놓고 엔터를 누르라고 묻습니다.
#  결과:   science-lab/audio/docssam/*.mp3 + manifest.json
#          .docssam-work/듣기.html  (원본 녹음과 만든 음성을 한 장에서 비교)
#  키를 하나도 쓰지 않고, 녹음 원본은 어디에도 올리지 않습니다.
# ============================================================
# shellcheck disable=SC1091
source "$(dirname "$0")/_setup-omnivoice.sh" || { echo "  [!] 준비 단계 실패"; read -r; exit 1; }

REF="${1:-$HOME/Downloads/녹음 2026-09-24 045754.mp4}"
if [ ! -f "$REF" ]; then
  echo
  echo "  녹음 파일을 찾지 못했습니다: $REF"
  printf "  녹음 파일을 이 창에 끌어다 놓고 엔터를 누르세요: "
  read -r REF
  REF="${REF%\"}"; REF="${REF#\"}"; REF="${REF//\\ / }"; REF="${REF%% }"
  [ -f "$REF" ] || { echo "  [!] 그 파일이 없습니다: $REF"; read -r; exit 1; }
fi

mkdir -p .docssam-work
echo
echo "  [확인] 아직 음성이 없는 대사 목록: .docssam-work/만들-대사.txt"
python scripts/check-docssam-voice.py > .docssam-work/만들-대사.txt

echo
echo "  [실행] 독쌤 목소리로 대사를 만드는 중... 처음엔 모델을 받느라 오래 걸립니다."
shift 1 2>/dev/null || true
if ! python scripts/omnivoice-docssam.py --ref "$REF" --device auto --speed 0.8 "$@"; then
  echo; echo "  [!] 실패했습니다. 위 메시지를 그대로 복사해 Claude 에게 주세요."; read -r; exit 1
fi
echo
echo "  완료. 같은 사람 목소리로 들리면 science-lab/audio/docssam/ 을 GitHub 에 올려 주세요."
echo "  (그다음 Claude 에게 \"독쌤 음성 올렸어\" 라고만 말하면 됩니다.)"
open ".docssam-work/듣기.html"
read -r
