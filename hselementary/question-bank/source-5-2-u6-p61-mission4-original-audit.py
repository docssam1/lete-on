"""Audit: 5-2-u6-e2-mission-4 (printed p61, pdf p57) 합격한 사람의 평균 점수.
Source: 300명 응시, 200명 합격, 합격·불합격 평균 차 10.5점, 전체 평균 72점.
Run: python3 -I source-5-2-u6-p61-mission4-original-audit.py
"""
from fractions import Fraction as F

TOTAL, PASS, DIFF, MEAN = 300, 200, F(21, 2), 72
FAIL = TOTAL - PASS
candidates = []
for sign in (1, -1):
    x = (TOTAL * MEAN + FAIL * sign * DIFF) / TOTAL
    y = x - sign * DIFF
    assert PASS * x + FAIL * y == TOTAL * MEAN and abs(x - y) == DIFF
    candidates.append((sign, x, y))
print('arithmetic candidates:', [(s, float(x), float(y)) for s, x, y in candidates])
assert {x for _, x, _ in candidates} == {F(151, 2), F(137, 2)}

# 합격 기준 점수 이상이면 합격 -> 합격자 평균 >= 불합격자 평균
selected = [(x, y) for s, x, y in candidates if x >= y]
assert len(selected) == 1
x, y = selected[0]
assert x == F(151, 2) and y == 65
scores = [F(151, 2)] * PASS + [65] * FAIL
assert sum(scores) / TOTAL == MEAN and min(scores[:PASS]) > max(scores[PASS:])
print('OK unique answer under score cutoff: 75.5점 (불합격자 평균 65점)')
