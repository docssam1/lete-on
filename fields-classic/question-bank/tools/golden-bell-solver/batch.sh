#!/usr/bin/env bash
# 골든벨 독립 풀이 배치. WSL 터미널에서 setsid로 띄운다(README 참고).
#   GBS=~/gb-solver ENGINE=codex JOBS=3 bash batch.sh            # prompts/ 전부
#   GBS=~/gb-solver ENGINE=codex bash batch.sh book-06__19__08    # 지정한 것만
# 이미 out/<이름>.json이 있는 문항은 건너뛰므로, 끊겨도 다시 띄우면 남은 것부터 한다.
set -u
: "${GBS:?GBS=<작업 폴더>}" "${ENGINE:=codex}" "${JOBS:=3}"
TOOL=$(cd "$(dirname "$0")" && pwd)
export GBS ENGINE TOOL MODEL="${MODEL:-}"
mkdir -p "$GBS/out" "$GBS/logs"
ts() { date '+%F %T'; }
echo "[$(ts)] start engine=$ENGINE jobs=$JOBS"
if (( $# )); then printf '%s\n' "$@"; else ls "$GBS/prompts" | sed 's/\.md$//'; fi \
  | xargs -P "$JOBS" -n 1 bash "$TOOL/solve-one.sh"
done_n=$(ls "$GBS/out" | grep -c '\.json$'); all_n=$(ls "$GBS/prompts" | wc -l)
echo "[$(ts)] batch done: $done_n / $all_n answered, unanswered $((all_n - done_n))"
