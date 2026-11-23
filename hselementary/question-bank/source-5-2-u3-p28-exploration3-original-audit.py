"""Independent audit for 5-2-u3-e3-exploration (printed p28, pdf p24).

Source: 삼각형 ㄱㄴㄷ과 삼각형 ㄹㅁㄷ은 합동인 이등변삼각형. Figure marks
∠ㄱㄴㄷ = 65° and ∠ㅁㅂㄷ = 70° (ㅂ = intersection of ㄱㄷ and ㄹㅁ). Find ∠ㄷㄱㄹ.
The text does not say which sides are equal. Clarification shown in prompt:
변 ㄱㄴ = 변 ㄱㄷ, 변 ㄹㅁ = 변 ㄹㄷ (the printed figure's proportions).
Run: python3 -I source-5-2-u3-p28-exploration3-original-audit.py
"""
import math
from fractions import Fraction as F

# printed figure vertices measured on the 1415px-wide preview of p24 (y down)
FIG = {'ㄱ': (1130, 265), 'ㄹ': (1205, 245), 'ㅁ': (1050, 405), 'ㄴ': (1040, 470), 'ㄷ': (1230, 470)}


def dist(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])


fig = {k: dist(FIG[a], FIG[b]) for k, a, b in [('ㄱㄴ', 'ㄱ', 'ㄴ'), ('ㄱㄷ', 'ㄱ', 'ㄷ'), ('ㄴㄷ', 'ㄴ', 'ㄷ'),
                                               ('ㄹㅁ', 'ㄹ', 'ㅁ'), ('ㄹㄷ', 'ㄹ', 'ㄷ'), ('ㅁㄷ', 'ㅁ', 'ㄷ')]}
print('figure side lengths', {k: round(v) for k, v in fig.items()})

# Angle chase for every isosceles reading (∠ㄴ = 65 fixed), correspondence ㄱ↔ㄹ, ㄴ↔ㅁ, ㄷ↔ㄷ.
# Triangle ㄹㅂㄷ: exterior angle ∠ㅁㅂㄷ = ∠ㄷㄹㅁ(=∠ㄷㄱㄴ) + ∠ㄹㄷㄱ(=θ); ∠ㄷㄱㄹ = (180-θ)/2
cases = {
    'ㄱㄴ=ㄱㄷ': F(50),          # apex ㄱ: ∠ㄱ = 180-65-65
    'ㄴㄱ=ㄴㄷ': F(115, 2),      # apex ㄴ: ∠ㄱ = (180-65)/2
    'ㄷㄱ=ㄷㄴ': F(65),          # apex ㄷ: ∠ㄱ = 65
}
results = {}
for name, angle_g in cases.items():
    theta = 70 - angle_g
    assert theta > 0
    results[name] = (180 - theta) / 2
print('angle by reading', {k: str(v) for k, v in results.items()})
assert results['ㄱㄴ=ㄱㄷ'] == 80
# the figure singles out ㄱㄴ=ㄱㄷ: |ㄱㄴ-ㄱㄷ| small, the other pairs differ by >15%
assert abs(fig['ㄱㄴ'] - fig['ㄱㄷ']) / fig['ㄱㄷ'] < 0.03
assert abs(fig['ㄹㅁ'] - fig['ㄹㄷ']) / fig['ㄹㄷ'] < 0.03
assert abs(fig['ㄴㄷ'] - fig['ㄱㄴ']) / fig['ㄱㄴ'] > 0.15
assert abs(fig['ㅁㄷ'] - fig['ㄹㄷ']) / fig['ㄹㄷ'] > 0.15

# With the clarification, is the correspondence forced? ㄹ is the apex (50°) of ㄹㅁㄷ,
# so ∠ㄷㄹㅁ = 50 and ∠ㄹㄷㅁ = 65 whichever base vertex ㅁ matches; ㄷㄹ = ㄷㄱ (legs).

# Coordinate reconstruction (y up): rotate triangle ㄱㄴㄷ about ㄷ clockwise by 20°.
t65 = math.radians(65)
N = (0.0, 0.0); D = (1.0, 0.0); G = (0.5, 0.5 * math.tan(t65))


def rot(p, deg):
    a = math.radians(-deg); x, y = p[0] - D[0], p[1] - D[1]
    return (D[0] + x * math.cos(a) - y * math.sin(a), D[1] + x * math.sin(a) + y * math.cos(a))


R = rot(G, 20); M = rot(N, 20)


def inter(p1, p2, p3, p4):
    d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0])
    t = ((p1[0] - p3[0]) * (p3[1] - p4[1]) - (p1[1] - p3[1]) * (p3[0] - p4[0])) / d
    return (p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1]))


def ang(o, a, b):
    v1 = (a[0] - o[0], a[1] - o[1]); v2 = (b[0] - o[0], b[1] - o[1])
    return math.degrees(math.acos((v1[0] * v2[0] + v1[1] * v2[1]) / (math.hypot(*v1) * math.hypot(*v2))))


B = inter(G, D, R, M)
# ㅂ lies inside both segments
assert min(G[1], D[1]) < B[1] < max(G[1], D[1]) and min(M[0], R[0]) < B[0] < max(M[0], R[0])
assert abs(ang(N, G, D) - 65) < 1e-9
assert abs(ang(B, M, D) - 70) < 1e-9
assert abs(ang(G, D, R) - 80) < 1e-9
assert abs(dist(G, N) - dist(G, D)) < 1e-12 and abs(dist(R, M) - dist(R, D)) < 1e-9

# SVG coordinates used in the generator (scale 300, origin (80,380), y down)
S, OX, OY = 300, 80, 380
svg = {k: (round(OX + S * p[0], 1), round(OY - S * p[1], 1)) for k, p in
       {'ㄱ': G, 'ㄴ': N, 'ㄷ': D, 'ㄹ': R, 'ㅁ': M, 'ㅂ': B}.items()}
print('svg points', svg)
print('answer: 80°')
print('PASS')
