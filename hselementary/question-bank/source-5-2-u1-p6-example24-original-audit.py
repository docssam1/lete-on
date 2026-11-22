"""Audit for 5-2-u1-e2-example-4 (printed p6, 예제 2-4).
Source: 소수 세 자리 수 2.㉠㉡㉢; 반올림하여 소수 첫째 자리까지 -> 2.5;
㉠+㉡+㉢=8, ㉠>㉡>㉢; ㉡=?
Clarification: 소수 세 자리 수이므로 끝자리 ㉢은 0이 아니다 (2.530은 2.53, 소수 두 자리 수).
Run: python3 -I source-5-2-u1-p6-example24-original-audit.py
"""
from fractions import Fraction

def rounds_to_25(a, b, c):
    x = Fraction(2000 + 100 * a + 10 * b + c, 1000)
    return Fraction(245, 100) <= x < Fraction(255, 100)

def solve(allow_zero_last):
    out = []
    for a in range(10):
        for b in range(10):
            for c in range(10):
                if not allow_zero_last and c == 0:
                    continue
                if a + b + c == 8 and a > b > c and rounds_to_25(a, b, c):
                    out.append((a, b, c))
    return out

raw = solve(True)
clarified = solve(False)
print("without clarification:", raw, "-> second digits", sorted({b for _, b, _ in raw}))
print("with c != 0:", clarified)
assert raw == [(5, 2, 1), (5, 3, 0)]
assert clarified == [(5, 2, 1)]
print("OK unique: 2.521, answer ㉡ = 2")
