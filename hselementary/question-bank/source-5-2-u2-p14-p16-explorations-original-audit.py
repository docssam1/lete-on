"""Independent audit for the ledger rows 5-2-u2-e1-exploration (printed p14) and
5-2-u2-e2-exploration (printed p16). Both are already served by existing split
originals (5-2-u2-e1-exploration-{1,2}-original in source-5-2-u2-page14-exploration-originals.js,
5-2-u2-e2-exploration-{1,2}-original in source-5-2-u2-page16-originals.js); this script
re-solves the printed numbers and checks the answers those generators show.
Run: python3 -I source-5-2-u2-p14-p16-explorations-original-audit.py
"""
import os
from fractions import Fraction as F

here = os.path.dirname(os.path.abspath(__file__))

# p14 (1): 4/7 added 91 times vs 91 의 4/7
rep = sum([F(4, 7)] * 91)
assert rep == 91 * F(4, 7) == 52
# p14 (2): ㉠ 의 1/4 = 5/6, ㉡ 의 1/6 = 2 3/8
a = F(5, 6) / F(1, 4); b = (2 + F(3, 8)) / F(1, 6)
assert (a, b) == (F(10, 3), F(57, 4))
s = a + b
assert s == F(211, 12) and s - 17 == F(7, 12)
# uniqueness: x*(1/4)=5/6 and y*(1/6)=19/8 are linear with nonzero coefficient -> single solution
# p16 (1): 4/7 L 의 5/6
assert F(4, 7) * F(5, 6) == F(10, 21)
# p16 (2)
v = F(5, 8) * F(7, 9) * F(6, 28) + (1 + F(4, 7)) * F(13, 33) * (2 + F(5, 8))
assert F(5, 8) * F(7, 9) * F(6, 28) == F(5, 48) and v == F(83, 48) and v - 1 == F(35, 48)

p14 = open(os.path.join(here, 'source-5-2-u2-page14-exploration-originals.js'), encoding='utf-8').read()
p16 = open(os.path.join(here, 'source-5-2-u2-page16-originals.js'), encoding='utf-8').read()
assert "answer:'두 값이 같고 각각 52'" in p14 and "answer:'17과 7/12'" in p14
assert "${frac(4,7)}를 91번 더한 값과 91의 ${frac(4,7)}" in p14
assert "㉠의 ${frac(1,4)}이 ${frac(5,6)}이고 ㉡의 ${frac(1,6)}이 2${frac(3,8)}" in p14
assert "answer:'10/21L'" in p16 and "answer:'1과 35/48'" in p16
assert "${frac(5,8)}×${frac(7,9)}×${frac(6,28)} + 1${frac(4,7)}×${frac(13,33)}×2${frac(5,8)}" in p16
print('p14: 52 (equal), 17 7/12 ; p16: 10/21 L, 1 35/48')
print('PASS')
