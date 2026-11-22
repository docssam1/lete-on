# 6-2 4단원 개념탐구 5 (비례배분) 원문 구조 유형 독립 검산.
# 생성기와 별도로 각 변형의 조건에서 답을 다시 구하고(가능한 곳은 전수 탐색), 답이 하나뿐인지 확인합니다.
import json
from fractions import Fraction as F
from math import gcd


def dec(x):
    x = F(x)
    assert x.denominator in (1, 2, 4, 5, 10, 20, 25, 50, 100), x
    s = f"{float(x):.2f}".rstrip('0').rstrip('.')
    assert F(s) == x
    return s


def only(xs):
    xs = list(xs)
    assert len(xs) == 1, xs
    return xs[0]


out = {}

# 개념탐구: (1) 을의 투자액, (2) 선분 ㄴㄷ : 선분 ㄹㅁ 의 가+나
def exploration(T, Pr, A, r1, r2):
    X = only(x for x in range(1, T) if F(Pr) * (T - x) / T == A)  # 을 투자액 전수 탐색
    s1, s2 = sum(r1), sum(r2)
    C, M = F(r1[0], s1), F(r1[0] + r1[1], s1)
    N, R = F(r2[0], s2), F(r2[0] + r2[1], s2)
    assert 0 < N < C < R < M < 1
    r = (C - N) / (M - R)
    # 가 : 나 를 자연수 쌍 전수 탐색으로 간단히
    ga, na = only((g, n) for g in range(1, 50) for n in range(1, 50) if gcd(g, n) == 1 and F(g, n) == r)
    return f"(1) {X}만 원, (2) {ga + na}"

out['6-2-u4-e5-exploration'] = [
    exploration(1200, 150, 90, [3, 2, 1], [3, 4, 5]),
    exploration(1500, 180, 108, [3, 2, 1], [4, 5, 3]),
    exploration(1600, 200, 130, [2, 2, 1], [4, 5, 6]),
]

# 예제 1
def ex1(N, a, b, m):
    sols = [(x, y, z) for x in range(N + 1) for y in range(N + 1 - x) for z in [N - x - y]
            if x * b == y * a and z == m * y]
    return f"{only(sols)[2]}개"

out['6-2-u4-e5-example-1'] = [ex1(88, 2, 3, 2), ex1(105, 3, 4, 2), ex1(120, 4, 5, 3)]

# 예제 2
def ex2(N, M, p, q, r, s):
    na, nb = N * p // (p + q), N * q // (p + q)
    assert na + nb == N and na * q == nb * p
    sols = [ap for ap in range(1, M) if (ap * s) % r == 0 and na * ap + nb * (ap * s // r) == M]
    return f"{only(sols)}원"

out['6-2-u4-e5-example-2'] = [ex2(128, 12840, 7, 9, 5, 8), ex2(96, 6880, 5, 7, 3, 4), ex2(117, 9490, 4, 5, 7, 9)]

# 예제 3
def ex3(a, b, p, q, H):
    h = a + b
    w, l = only((w, h - w) for w in range(1, h) if w * q == (h - w) * p)
    A, B = a * b, w * l
    assert A != B
    t = F(H * 60 * A, B)
    assert t.denominator == 1 and t % 60 != 0
    t = int(t)
    return f"{t // 60}시간 {t % 60}분"

out['6-2-u4-e5-example-3'] = [ex3(14, 18, 5, 3, 2), ex3(12, 16, 5, 2, 2), ex3(14, 26, 7, 3, 3)]

# 예제 4: ㄱㄹ:ㄹㄷ = a : b, ㄴㅁ:ㅁㄷ = 1/m : 1/n
def ex4(S, a, b, m, n):
    t1 = F(1, m) / (F(1, m) + F(1, n))  # ㄴㅁ / ㄴㄷ
    ga = S * t1
    rest = S - ga
    t2 = F(a) / (F(a) + F(b))  # ㄱㄹ / ㄱㄷ
    gb = rest * t2
    gc = rest - gb
    for v in (ga, gb, gc):
        assert v.denominator == 1 and v > 0
    return f"㉮ {ga} cm², ㉯ {gb} cm², ㉰ {gc} cm²"

out['6-2-u4-e5-example-4'] = [ex4(195, 2, F('2.5'), 6, 7), ex4(180, 3, F('4.5'), 5, 4), ex4(176, 4, F('1.5'), 3, 5)]

# Mission 1
def m1(S, fr):
    fr = [F(n, d) for n, d in fr]
    k = F(S) / sum(fr)
    sides = sorted(f * k for f in fr)
    assert sides[0] + sides[1] > sides[2]
    assert sides[0].denominator == 1
    return f"{sides[0]} cm"

out['6-2-u4-e5-mission-1'] = [m1(165, [(2, 5), (1, 2), (3, 4)]), m1(152, [(1, 3), (1, 2), (3, 4)]), m1(162, [(2, 3), (3, 4), (5, 6)])]

# Mission 2: 가:나=p:q, 나×c1 = 다×c2, 평균 avg → 나 (0.5 간격 전수 탐색)
def m2(p, q, c1, c2, avg):
    sols = []
    for t in range(1, 10000):
        na = F(t, 2)
        ga = na * p / q
        da = na * c1 / c2
        if (ga + na + da) / 3 == avg:
            sols.append(na)
    return dec(only(sols))

out['6-2-u4-e5-mission-2'] = [
    m2(3, 2, F(1, 4), F(3, 5), F('262.5')),
    m2(4, 3, F(1, 3), F(2, 5), F('85.5')),
    m2(5, 4, F(1, 2), F(5, 6), F('199.5')),
]

# Mission 3: 가로:세로=a:b, 가로:높이=c:d, 모서리 합 E
def m3(a, b, c, d, E):
    # 가로를 w 라 하면 세로 w*b/a, 높이 w*d/c, 4*(합)=E
    w = F(E, 4) / (1 + F(b, a) + F(d, c))
    return f"{dec(w * d / c)} cm"

out['6-2-u4-e5-mission-3'] = [m3(5, 3, 4, 3, 141), m3(3, 2, 4, 3, 203), m3(5, 4, 3, 2, 111)]

# Mission 4: 사탕 x개 값 = 초콜릿 y개 값
def m4(N, M, p, q, x, y):
    nc, nd = N * p // (p + q), N * q // (p + q)
    assert nc + nd == N and nc * q == nd * p
    sols = [c for c in range(1, M) if (c * x) % y == 0 and nc * c + nd * (c * x // y) == M]
    return f"{only(sols)}원"

out['6-2-u4-e5-mission-4'] = [m4(63, 13500, 5, 2, 5, 4), m4(56, 20400, 4, 3, 3, 2), m4(81, 13050, 7, 2, 4, 3)]

# Mission 5
def m5(td, rn, rd, S):
    tu = F(1, td)
    ro = (1 - tu) * F(rn, rd)
    whole = F(S) / (tu + ro)
    T, R = whole * tu, whole * ro
    assert T != R and T.denominator == 1 and R.denominator == 1
    return f"{'장미' if R > T else '튤립'}, {abs(R - T)} m²"

out['6-2-u4-e5-mission-5'] = [m5(4, 8, 9, 165), m5(3, 3, 4, 150), m5(2, 2, 5, 140)]

# Mission 6: 처음 수 전수 탐색
def m6(a, b, c, d, x, y, z, T):
    sols = []
    for mon in range(1, T):
        if (mon * b) % a:
            continue
        gor = mon * b // a
        if (gor * d) % c:
            continue
        chi = gor * d // c
        if mon + gor + chi + x + y + z == T:
            sols.append((mon + x, gor + y, chi + z))
    f1, f2, f3 = only(sols)
    g = gcd(gcd(f1, f2), f3)
    return f"{f1 // g}:{f2 // g}:{f3 // g}"

out['6-2-u4-e5-mission-6'] = [m6(10, 7, 2, 3, 20, 32, 30, 522), m6(3, 4, 2, 5, 12, 16, 15, 145), m6(5, 3, 4, 5, 10, 12, 30, 240)]

for k, v in out.items():
    assert len(set(v)) == 3, (k, v)
print('AUDIT ' + json.dumps(out, ensure_ascii=False))
