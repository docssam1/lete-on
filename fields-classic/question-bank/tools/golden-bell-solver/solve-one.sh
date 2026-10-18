#!/usr/bin/env bash
# 문항 하나를 일회성·읽기 전용 모델 호출로 푼다. batch.sh가 부른다.
# 결과: out/<이름>.json (형식 검사를 통과한 답), 실패 시 logs/<이름>.err 에 원본 응답과 이유.
set -u
name=$1
: "${GBS:?}" "${TOOL:?}" "${ENGINE:=codex}"
prompt="$GBS/prompts/$name.md" out="$GBS/out/$name.json" tmp="$GBS/out/$name.raw"
[[ -s "$out" ]] && { echo "SKIP $name"; exit 0; }

call() {
  case "$ENGINE" in
    codex) (cd /tmp && timeout 900 codex exec --skip-git-repo-check --sandbox read-only --ephemeral --color never \
              ${MODEL:+--model "$MODEL"} --output-last-message "$tmp" <"$prompt" >/dev/null 2>>"$GBS/logs/$name.err") ;;
    claude) (cd /tmp && timeout 900 claude -p --tools "" ${MODEL:+--model "$MODEL"} <"$prompt" >"$tmp" 2>>"$GBS/logs/$name.err") ;;
    *) echo "unknown ENGINE $ENGINE" >&2; return 1 ;;
  esac
}

for try in 1 2 3; do
  rm -f "$tmp"
  if call && [[ -s "$tmp" ]] && node "$TOOL/check-answer.mjs" "$tmp" "$out" 2>>"$GBS/logs/$name.err"; then
    rm -f "$tmp"; echo "PASS $name (try $try)"; exit 0
  fi
  [[ -s "$tmp" ]] && { echo "--- try $try raw:"; cat "$tmp"; } >>"$GBS/logs/$name.err"
done
rm -f "$tmp"; echo "FAIL $name"; exit 1
