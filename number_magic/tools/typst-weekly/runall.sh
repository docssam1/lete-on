#!/bin/bash
# 74개 과정(C0~C73) 1주차를 모두 만들고 쪽마다 견준다. 쓰는 법은 README.md.
cd "$(dirname "$0")"
PY=${NM_TYPST_PY:-python3}
: > runall.log
for i in $(seq 0 73); do
  c=C$i
  node extract2.js $c 1 out/$c >> runall.log 2>&1 || echo "EXTRACT-FAIL $c" >> runall.log
  r=$($PY build2.py out/$c 2>&1 | grep -vE "Suspects")
  if echo "$r" | grep -q "^ok"; then echo "BUILD-OK $c $(pdfinfo out/$c/full.pdf 2>/dev/null | grep Pages | awk '{print $2}') / src $(pdfinfo out/$c/src.pdf 2>/dev/null | grep Pages | awk '{print $2}')" >> runall.log
  else echo "BUILD-FAIL $c: $(echo "$r" | grep -m1 -E 'error' | cut -c1-200)" >> runall.log; fi
done
echo ALLDONE >> runall.log
$PY verify.py out/C* | grep -v " OK$" || echo "전 과정 일치"
