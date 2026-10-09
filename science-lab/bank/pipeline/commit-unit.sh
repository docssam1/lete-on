#!/bin/bash
# commit-unit.sh <단원id> <단원짧은id(s32u01)> "<커밋 제목>" "<본문>" — 그 단원 파일만 강제 추가해 커밋하고 브랜치·main에 올린다
set -e
cd "$(dirname "$0")/../../.."   # 저장소 뿌리
u=$1; us=$2
git add -f science-lab/data/units/$u.* science-lab/bank/taxonomy/$u.json scripts/bank-science-$us.mjs
[ -d science-lab/assets/bank/$u ] && git add -f science-lab/assets/bank/$u
[ -d science-lab/bank/work/$us ] && git add -f science-lab/bank/work/$us
[ -f science-lab/data/book/$u.book.js ] && git add science-lab/data/book/$u.book.js
git add science-lab/v2/v2.js science-lab/bank/taxonomy/*.json
git add science-lab/bank/judge.test.mjs science-lab/bank/audit.test.mjs science-lab/v2/units-index.js science-lab/v2/index.html
git commit -q -F - <<MSG
$3

$4

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01QaWvZ4cDmAshpYaqknmU9s
MSG
for i in 1 2 3; do git push -q origin claude/jolly-allen-w57yqh && break || sleep $((i*2)); done
git fetch -q origin main && git merge-base --is-ancestor origin/main HEAD && git push -q origin claude/jolly-allen-w57yqh:main
git log --oneline -1 | cut -c1-70; git ls-remote origin main | cut -c1-8
