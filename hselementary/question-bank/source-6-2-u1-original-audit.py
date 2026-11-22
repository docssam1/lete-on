"""6-2 1단원 (분수의 나눗셈) 개념탐구 1·3·5·6 원문 구조 유형 독립 감사 (표준 라이브러리만 사용).

각 변형의 매개변수로 정답을 다시 계산하고, 가능한 곳은 전수 탐색으로 정답이 하나뿐인지 확인한다.
"""
import json
from fractions import Fraction as F
from itertools import permutations
from math import floor, gcd


def fm(x):
    """분수를 자연수 / 진분수 a/b / 대분수 'w a/b' 글자로."""
    x = F(x)
    assert x >= 0
    if x.denominator == 1:
        return str(x.numerator)
    w, r = divmod(x.numerator, x.denominator)
    return ("%d %d/%d" % (w, r, x.denominator)) if w else ("%d/%d" % (r, x.denominator))


def mx(w, n, d):
    return w + F(n, d)


def dec(s):
    return F(s)


OUT = {}

# ---------- 개념탐구 1 ----------
def e1(a, b, c, d, p, q, r, s, t):
    A, C = F(a, b), F(c, d)
    R = A / C
    assert R == A * F(d, c) == A / c * d
    x = p - q
    y = r / s / t
    ans = x / y
    fa, fc = "%d/%d" % (a, b), "%d/%d" % (c, d)
    Rs = str(R.numerator) if R.denominator == 1 else "%d/%d" % (R.numerator, R.denominator)
    return ("(1) 페인트 %s L로 벽 %s m²를 칠한다고 하면, 페인트 1/%d L로는 %s ÷ %d (m²)를 칠하고, 페인트 1 L로는 그 %d배를 칠합니다. "
            "따라서 %s ÷ %s = %s × 1/%d × %d = %s × %d/%d입니다. "
            "(2) 예: 페인트 %s L로 벽 %s m²를 칠할 수 있을 때, 페인트 1 L로 칠할 수 있는 벽의 넓이는 %s ÷ %s = %s (m²)입니다. (3) %s"
            % (fc, fa, d, fa, c, d, fa, fc, fa, c, d, fa, d, c, fc, fa, fa, fc, Rs, fm(ans)))


OUT["6-2-u1-e1-exploration"] = [
    e1(5, 8, 4, 7, F(3, 4), F(5, 8), F(1, 63), F(3, 7), F(4, 81)),
    e1(3, 5, 2, 9, F(5, 6), F(3, 4), F(1, 45), F(2, 9), F(3, 50)),
    e1(4, 9, 5, 7, F(2, 3), F(4, 7), F(1, 56), F(3, 8), F(5, 42)),
]
assert OUT["6-2-u1-e1-exploration"][0].endswith("(3) 1/6")


# ---------- 개념탐구 3 ----------
def cards_max(cards):
    """(대분수)÷(대분수) 전수 탐색: 분수 부분은 진분수. 기약 조건이 있든 없든 최댓값이 같고 하나뿐인지 확인."""
    res = {}
    for reduced in (False, True):
        best, who = None, []
        for a, b, c, d, e, f in permutations(cards):
            if b >= c or e >= f or a == 0 or d == 0:
                continue
            if reduced and (gcd(b, c) > 1 or gcd(e, f) > 1):
                continue
            v = (a + F(b, c)) / (d + F(e, f))
            if best is None or v > best:
                best, who = v, [(a, b, c, d, e, f)]
            elif v == best:
                who.append((a, b, c, d, e, f))
        assert len(who) == 1, who
        res[reduced] = (best, who[0])
    assert res[False] == res[True]
    return res[False][0]


def e3(p, q, r, s, cards):
    fr = F(r, s)
    v1 = (2 - p / (q + fr)) / (2 + p / (q - fr))
    return "(1) %s (2) %s" % (fm(v1), fm(cards_max(cards)))


OUT["6-2-u1-e3-exploration"] = [e3(6, 3, 4, 5, [1, 3, 4, 7, 8, 9]), e3(4, 3, 1, 2, [1, 3, 5, 6, 7, 9]), e3(6, 4, 2, 3, [1, 2, 4, 5, 7, 8])]
assert OUT["6-2-u1-e3-exploration"][0] == "(1) 22/247 (2) 6 74/77"


# ---------- 개념탐구 5 Mission ----------
def m52(a, b, avg):
    sols = []
    for m in range(0, 101):
        k = m * a
        s = k * b
        if k.denominator == 1 and s.denominator == 1 and s <= 100 and m + k + s == 3 * avg:
            sols.append(m)
    assert len(sols) == 1, sols
    return "%d점" % sols[0]


OUT["6-2-u1-e5-mission-2"] = [m52(F(3, 4), mx(1, 1, 6), 84), m52(F(5, 6), mx(1, 1, 4), 69), m52(F(4, 5), mx(1, 1, 8), 90)]


def m53(r, s1, w, s2, T):
    sols = []
    for C in range(1, 2001):
        R = C * r
        sold_c = C * s1
        wilt = (C - sold_c) * w
        sold_r = R * s2
        if any(x.denominator != 1 for x in (R, sold_c, wilt, sold_r)):
            continue
        if C - sold_c - wilt + R - sold_r == T:
            sols.append(C + R)
    assert len(sols) == 1, sols
    return "%s송이" % fm(sols[0])


OUT["6-2-u1-e5-mission-3"] = [m53(mx(1, 2, 3), F(1, 3), F(3, 4), F(3, 5), 45), m53(mx(1, 1, 2), F(1, 5), F(3, 4), F(2, 3), 56),
                              m53(mx(1, 3, 4), F(1, 3), F(1, 2), F(5, 7), 60)]


def m54(a, b, A, c, d):
    orig = F(A) / (a * b)
    assert a < 1 < b and c < 1 < d
    return "%s m²" % fm(orig * c * d)


OUT["6-2-u1-e5-mission-4"] = [m54(F(4, 5), F(6, 5), 120, F(3, 5), F(7, 5)), m54(F(5, 7), F(7, 6), 100, F(1, 2), F(3, 2)),
                              m54(F(2, 3), F(9, 8), 180, F(3, 4), F(7, 6))]


def m55(h, m, dist, late, total):
    v = dist / (h + F(m, 60))
    # 거리 d를 반의 빠르기로 가면 늦어지는 시간: d/(v/2) - d/v = d/v
    d = v * F(late, 60)
    assert 0 < d < total
    t_actual = (total - d) / v + d / (v / 2)
    assert t_actual - total / v == F(late, 60)
    return "%s km" % fm(d)


OUT["6-2-u1-e5-mission-5"] = [m55(1, 25, mx(70, 5, 6), 30, 75), m55(1, 10, mx(52, 1, 2), 40, 80), m55(1, 20, mx(74, 2, 3), 15, 70)]


def m56(p, q, g):
    H = g / (p * p - q * q)
    assert H * p * p - H * q * q == g
    return "%s m" % fm(H)


OUT["6-2-u1-e5-mission-6"] = [m56(F(1, 2), F(1, 5), mx(1, 2, 5)), m56(F(2, 3), F(1, 4), mx(2, 4, 9)), m56(F(3, 4), F(1, 3), mx(2, 1, 6))]


# ---------- 개념탐구 6 ----------
def e6x(n, T, w, W):
    bags = dec(W) / w
    assert bags.denominator == 1
    return "%s시간" % fm(T / n * bags)


OUT["6-2-u1-e6-exploration"] = [e6x(4, mx(6, 2, 3), mx(9, 2, 5), "1156.2"), e6x(3, mx(4, 1, 2), mx(12, 4, 5), "1100.8"),
                                e6x(5, mx(8, 3, 4), mx(7, 3, 5), "1124.8")]


def e6e1(a, b):
    # ㉡ = 1로 두고 ㉠, ㉢을 정해 확인 (몫은 ㉡의 크기와 관계없음)
    vals = set()
    for nb in (1, 2, 7):
        A = dec(a) * nb
        Cc = A / b
        vals.add(Cc / nb)
    assert len(vals) == 1
    return fm(vals.pop())


OUT["6-2-u1-e6-example-1"] = [e6e1("3.2", F(4, 5)), e6e1("4.5", F(3, 4)), e6e1("5.6", F(4, 5))]


def e6e2(a, b, c, e):
    sols = []
    for tenth in range(1, 20001):  # 들이를 0.1 L 단위로 전수 탐색
        cap = F(tenth, 10)
        water = cap * a
        water += (cap - water) * b
        water += dec(c)
        if cap - water == cap * e:
            sols.append(cap)
    assert len(sols) == 1, sols
    return "%s L" % fm(sols[0])


OUT["6-2-u1-e6-example-2"] = [e6e2(F(2, 5), F(3, 4), "3.5", F(1, 10)), e6e2(F(1, 3), F(1, 2), "2.5", F(1, 4)), e6e2(F(1, 4), F(2, 3), "4.5", F(1, 8))]


def e6e3(k, pb, pg, N):
    sols = []
    for G in range(1, 1001):
        B = G * k
        Bn = B * F(100 + pb, 100)
        Gn = G * F(100 + pg, 100)
        if B.denominator == 1 and Bn.denominator == 1 and Gn.denominator == 1 and Bn + Gn == N:
            sols.append(Bn)
    assert len(sols) == 1, sols
    return "%s명" % fm(sols[0])


OUT["6-2-u1-e6-example-3"] = [e6e3(F(3, 4), 4, 3, 362), e6e3(F(4, 5), 5, 2, 279), e6e3(F(2, 3), 5, 4, 261)]


def e6e4(exprs):
    sym = ["㉠", "㉡", "㉢", "㉣"]
    nums = []
    for ops in exprs:
        k = F(1)
        for o, v in ops:
            k = k * v if o == "*" else k / v
        nums.append(1 / k)  # 계산 결과를 1로 둘 때의 수
    assert len(set(nums)) == 4
    order = sorted(range(4), key=lambda i: -nums[i])
    return ", ".join(sym[i] for i in order)


OUT["6-2-u1-e6-example-4"] = [
    e6e4([[("*", F(3, 5)), ("/", dec("1.6"))], [("/", dec("0.3")), ("*", mx(1, 7, 8))], [("*", dec("0.25")), ("*", mx(2, 2, 3))], [("/", F(4, 5)), ("/", dec("1.2"))]]),
    e6e4([[("*", F(2, 3)), ("/", dec("0.8"))], [("/", dec("0.4")), ("*", mx(1, 1, 5))], [("*", dec("0.75")), ("*", mx(1, 1, 2))], [("/", F(5, 6)), ("/", dec("1.5"))]]),
    e6e4([[("*", F(5, 8)), ("/", dec("0.5"))], [("/", dec("0.6")), ("*", mx(1, 1, 2))], [("*", dec("0.4")), ("*", mx(1, 3, 4))], [("/", F(3, 4)), ("/", dec("2.4"))]]),
]
assert OUT["6-2-u1-e6-example-4"][0] == "㉠, ㉢, ㉣, ㉡"


def e6m1(A, B, C):
    a, b, c, d, e = A
    r1 = dec(a) / (b + dec(c)) * d - e
    f, g, h, i, j = B
    r2 = (1 - (f + g) * (dec(h) + dec(i))) / j
    k, m, n, o, p, q, t = C
    r3 = dec(k) / (m * (n / (o * p) - dec(q)) - t)
    assert min(r1, r2, r3) > 0
    return "(1) %s (2) %s (3) %s" % (fm(r1), fm(r2), fm(r3))


OUT["6-2-u1-e6-mission-1"] = [
    e6m1(["0.75", F(1, 2), "0.125", mx(6, 1, 4), mx(3, 1, 2)], [F(1, 2), F(1, 3), "0.25", "0.2", F(1, 6)], ["0.64", mx(2, 8, 21), mx(4, 1, 3), mx(1, 6, 7), mx(3, 1, 3), "0.6", F(3, 14)]),
    e6m1(["0.6", F(1, 4), "0.15", mx(3, 1, 3), mx(2, 1, 2)], [F(1, 3), F(1, 4), "0.4", "0.2", F(1, 5)], ["1.35", mx(1, 7, 8), mx(4, 1, 5), mx(1, 2, 5), mx(2, 1, 2), "0.8", F(2, 3)]),
    e6m1(["0.9", F(1, 5), "0.25", mx(4, 1, 2), mx(5, 1, 3)], [F(1, 4), F(1, 6), "0.5", "0.1", F(1, 3)], ["0.36", mx(2, 2, 5), mx(5, 1, 4), mx(2, 1, 4), mx(1, 1, 3), "1.5", F(4, 7)]),
]
assert OUT["6-2-u1-e6-mission-1"][0] == "(1) 4 (2) 3 3/4 (3) 26 22/25"


def e6m2(a, mi, se, dist, fuel, h):
    km_per_hour = dec(a) / F(mi * 60 + se, 3600)
    go = km_per_hour * h
    return "%s L" % fm(go * dec(fuel) / dist)


OUT["6-2-u1-e6-mission-2"] = [e6m2("3.5", 2, 20, mx(47, 1, 4), "5.4", F(2, 3)), e6m2("4.2", 3, 30, mx(36, 2, 5), "4.2", F(3, 4)),
                              e6m2("2.8", 2, 40, mx(50, 2, 5), "4.5", F(5, 6))]


def e6m3(a, b, c, d, e):
    x = dec(a) * b
    y = c / d
    return fm(abs(x - y) + e)


OUT["6-2-u1-e6-mission-3"] = [e6m3("1.25", mx(1, 3, 5), mx(3, 4, 5), mx(1, 9, 10), mx(6, 4, 5)), e6m3("1.75", mx(1, 1, 7), mx(4, 1, 2), mx(1, 4, 5), mx(3, 2, 3)),
                              e6m3("2.25", mx(1, 1, 3), mx(5, 3, 5), mx(2, 1, 3), mx(2, 3, 4))]


def e6m4(p, q, drop, d1):
    k = dec(p) * q
    assert k < 1
    area = dec(drop) / (1 - k)
    d2 = area * 2 / d1
    assert d1 * d2 / 2 - (d1 * dec(p)) * (d2 * q) / 2 == dec(drop)
    return "%s cm" % fm(d2)


OUT["6-2-u1-e6-mission-4"] = [e6m4("0.8", mx(1, 1, 5), "5.3", mx(10, 3, 5)), e6m4("0.75", mx(1, 1, 4), "6.25", mx(12, 1, 2)),
                              e6m4("0.6", mx(1, 1, 2), "6.3", mx(8, 2, 5))]


def e6m5(W1, k, W2):
    drink = (dec(W1) - W2) * k
    bottle = dec(W1) - drink
    assert bottle > 0 and bottle + drink * (1 - F(1, k)) == W2
    return "%s배" % fm(drink / bottle)


OUT["6-2-u1-e6-mission-5"] = [e6m5("1.6", 8, mx(1, 37, 80)), e6m5("2.1", 6, mx(1, 17, 20)), e6m5("1.8", 5, mx(1, 27, 50))]


def e6m6(W, H, s):
    nw = floor(W / s)
    nh = floor(dec(H) / s)
    assert nw * s <= W < (nw + 1) * s and nh * s <= dec(H) < (nh + 1) * s
    assert nw * nh <= (W * dec(H)) / (s * s)
    return "%d개" % (nw * nh)


OUT["6-2-u1-e6-mission-6"] = [e6m6(mx(48, 3, 5), "31.9", mx(5, 9, 10)), e6m6(mx(35, 1, 5), "22.6", mx(3, 7, 10)), e6m6(mx(52, 1, 2), "30.8", mx(6, 1, 4))]
assert OUT["6-2-u1-e6-mission-6"][0] == "40개"

# 원문 수(변형 0)의 정답 확인
EXPECT0 = {"6-2-u1-e5-mission-2": "96점", "6-2-u1-e5-mission-3": "144송이", "6-2-u1-e5-mission-4": "105 m²", "6-2-u1-e5-mission-5": "25 km",
           "6-2-u1-e5-mission-6": "6 2/3 m", "6-2-u1-e6-exploration": "205시간", "6-2-u1-e6-example-1": "4", "6-2-u1-e6-example-2": "70 L",
           "6-2-u1-e6-example-3": "156명", "6-2-u1-e6-mission-2": "6 6/7 L", "6-2-u1-e6-mission-3": "6 4/5", "6-2-u1-e6-mission-4": "25 cm",
           "6-2-u1-e6-mission-5": "2 1/5배"}
for k, v in EXPECT0.items():
    assert OUT[k][0] == v, (k, OUT[k][0], v)
for k, v in OUT.items():
    assert len(v) == 3 and len(set(v)) == 3, k

print("AUDIT " + json.dumps(OUT, ensure_ascii=False))
