"""Audit: 5-2-u6-e2-example-3 (printed p60, pdf p56) 영재반 선발 시험 합격자 평균.
Source: 100명 응시, 25명 합격, 합격자 평균과 불합격자 평균의 차 40점, 전체 평균 62점.
Run: python3 -I source-5-2-u6-p60-example23-original-audit.py
"""
from fractions import Fraction as F

TOTAL, PASS, DIFF, MEAN = 100, 25, 40, 62
FAIL = TOTAL - PASS
candidates = []
for sign in (1, -1):  # sign=1: 합격자 평균이 더 높음
    # PASS*x + FAIL*(x - sign*DIFF) = TOTAL*MEAN
    x = F(TOTAL * MEAN + FAIL * sign * DIFF, TOTAL)
    y = x - sign * DIFF
    assert PASS * x + FAIL * y == TOTAL * MEAN and abs(x - y) == DIFF
    candidates.append((sign, x, y))
print('arithmetic candidates (sign, pass mean, fail mean):', [(s, str(x), str(y)) for s, x, y in candidates])
assert {x for _, x, _ in candidates} == {92, 32}

# 선발 시험: 합격자는 점수순으로 뽑히므로 모든 합격자 점수 >= 모든 불합격자 점수 -> 합격 평균 >= 불합격 평균.
selected = [(x, y) for s, x, y in candidates if x >= y]
assert len(selected) == 1, selected
x, y = selected[0]
assert (x, y) == (92, 52) and 0 <= y <= x <= 100
# 실제로 가능한 점수 배치 예: 합격자 25명 모두 92점, 불합격자 75명 모두 52점 (기준점 53~92 사이 어느 값이든 성립)
scores = [92] * PASS + [52] * FAIL
assert F(sum(scores), TOTAL) == MEAN and min(scores[:PASS]) > max(scores[PASS:])
print('OK unique answer under selection-by-score: 92점 (불합격자 평균 52점)')
