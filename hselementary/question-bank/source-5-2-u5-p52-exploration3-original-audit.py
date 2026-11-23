"""Audit for 5-2-u5-e3-exploration (개념탐구 3, PDF p.48 / printed p.52).

Cuboid ㄱㄴㄷㄹ-ㅁㅂㅅㅇ: top ㄱㄴㄷㄹ, ㅁ under ㄱ, ㅂ under ㄴ, ㅅ under ㄷ, ㅇ under ㄹ.
L = ㄱㄴ, D = ㄱㄹ, H = ㄱㅁ. ㅊ lies on ㄴㄷ (route over 윗면 + 오른쪽 옆면),
ㅈ lies on ㅁㅇ (route over 왼쪽 옆면 + 밑면). The source gives no lengths; the
drawn nets measure L:D:H = 148:75:91 ~ 8:4:5 in both (가) and (나).

Clarification used: each route is the shortest line over the two faces it is
shown crossing (the drawn 8:4:5 box makes another face pair shorter, so the
literal 'globally shortest' reading is not consistent with the drawing).
"""
from fractions import Fraction as F
from itertools import product
import math


def d2(p, q):
    return sum((a - b) ** 2 for a, b in zip(p, q))


def check(L, D, H):
    G = (0, 0, H); N = (L, 0, H); Dd = (L, D, H); M = (0, 0, 0); S = (L, D, 0); O = (0, D, 0)
    # Route 1: P=(L,t,H) on ㄴㄷ. Route 2: Q=(0,s,0) on ㅁㅇ.
    t = F(D * L, L + H)
    s = F(D * H, L + H)
    best = (L + H) ** 2 + D ** 2
    f1 = lambda u: math.sqrt(d2(G, (L, u, H))) + math.sqrt(d2((L, u, H), S))
    f2 = lambda u: math.sqrt(d2(G, (0, u, 0))) + math.sqrt(d2((0, u, 0), S))
    assert abs(f1(float(t)) - math.sqrt(best)) < 1e-12 and abs(f2(float(s)) - math.sqrt(best)) < 1e-12
    # uniqueness of the minimiser on each edge (strict convexity, sampled check)
    for f, opt in ((f1, float(t)), (f2, float(s))):
        grid = [D * k / 4000 for k in range(4001)]
        vals = [f(u) for u in grid]
        umin = grid[vals.index(min(vals))]
        assert abs(umin - opt) <= D / 4000 + 1e-12
        assert all(v > f(opt) - 1e-12 for v in vals)
        assert all(f(u) > f(opt) + 1e-12 for u in grid if abs(u - opt) > D / 100)
    # ratio statements used in the answer
    assert t / (D - t) == F(L, H)        # ㄴㅊ : ㅊㄷ = ㄱㄴ : ㄱㅁ
    assert s / (D - s) == F(H, L)        # ㅁㅈ : ㅈㅇ = ㄱㅁ : ㄱㄴ
    return t, s, best


for L, D, H in product(range(1, 9), repeat=3):
    check(L, D, H)

# Drawn proportions 8:4:5
L, D, H = 8, 4, 5
t, s, best = check(L, D, H)
assert (t, s) == (F(32, 13), F(20, 13))
# Other face pairs from ㄱ to ㅅ are shorter for 8:4:5 -> clarification needed
assert L ** 2 + (D + H) ** 2 == 145 < best == 185 and H ** 2 + (L + D) ** 2 == 169 < best

# Net (가), unit coordinates (x right, y down)
ga = {'ㄱ': (0, 5), 'ㄹ': (4, 5), 'ㄴ': (0, 13), 'ㄷ': (4, 13)}
ga_left = {'ㅁ': (0, 0), 'ㅇ': (4, 0)}          # 왼쪽 옆면 above ㄱㄹ
ga_right = {'ㅂ': (0, 18), 'ㅅ': (4, 18)}       # 오른쪽 옆면 below ㄴㄷ
ga_bottom = {'ㅇ': (9, 5), 'ㅅ': (9, 13), 'ㅁ': (13, 5), 'ㅂ': (13, 13)}
# Route 1 straight ㄱ->ㅅ through ㄴㄷ (y=13)
x = F(0) + (F(4) - 0) * F(13 - 5, 18 - 5)
assert x == t  # crosses ㄴㄷ at distance t from ㄴ
# Route 2: ㅈ on left-face copy of ㅁㅇ and on bottom-face copy, same distance s from ㅁ
J1 = (s, F(0)); J2 = (13 - s, F(5))
assert d2(ga['ㄱ'], J1) == H ** 2 + s ** 2
assert d2(J2, ga_bottom['ㅅ']) == L ** 2 + (D - s) ** 2

# Net (나)
na = {'ㄹ': (5, 5), 'ㄷ': (13, 5), 'ㄱ': (5, 9), 'ㄴ': (13, 9)}
na_left = {'ㅇ': (0, 5), 'ㅁ': (0, 9)}
na_right = {'ㅅ': (18, 5), 'ㅂ': (18, 9)}
na_bottom = {'ㅅ': (18, 5), 'ㅂ': (18, 9), 'ㅇ': (26, 5), 'ㅁ': (26, 9)}
y = F(9) + (F(5) - 9) * F(13 - 5, 18 - 5)
assert 9 - y == t and y == F(85, 13)
J1 = (F(0), 9 - s); J2 = (F(26), 9 - s)
assert J1[1] == F(97, 13)
assert d2(na['ㄱ'], J1) == H ** 2 + s ** 2
assert d2(J2, na_bottom['ㅅ']) == L ** 2 + (D - s) ** 2
# Seen as one wrapped strip (ㅁㅇ glued), ㄱ, ㅈ, ㅅ are collinear:
# shift the bottom face left by 26 so its ㅁㅇ edge sits on x=0.
S_shift = (F(18 - 26), F(5))
cross = (J1[0] - 5) * (S_shift[1] - 9) - (J1[1] - 9) * (S_shift[0] - 5)
assert cross == 0

print('PASS 개념탐구 3: 512 box sizes; ㄴㅊ:ㅊㄷ=ㄱㄴ:ㄱㅁ, ㅁㅈ:ㅈㅇ=ㄱㅁ:ㄱㄴ; 8:4:5 -> ㅊ at 32/13, ㅈ at 20/13 on nets (가)(나).')
