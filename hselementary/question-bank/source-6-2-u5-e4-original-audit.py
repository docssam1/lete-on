#!/usr/bin/env python3
"""황소 6-2 5단원 개념탐구 4(복잡한 도형의 넓이 ②) 원문 구조 유형 독립 감사.
생성기 코드를 읽지 않고 각 변형의 조건만으로 색칠한 넓이를 다시 구합니다.
1) 색칠 규칙(원 안/밖, 대각선 위/아래 등)을 그대로 쓴 격자 적분 또는 경계선 다각형 근사로 실제 원주율에서의 넓이를 수치로 구하고,
2) 분해식으로 얻은 정확한 넓이 a + b×(원주율)이 수치와 맞는지 확인한 뒤,
3) 문제에 주어진 원주율(3.14, 3.1, 3)을 넣어 답을 분수로 정확히 계산합니다."""
import json
import math
from fractions import Fraction as F

OUT = {}
fails = []


def check(cond, msg):
    if not cond:
        fails.append(msg)


def dec(x):
    x = F(x)
    check(x > 0, f"positive {x}")
    d = x.denominator
    while d % 2 == 0:
        d //= 2
    while d % 5 == 0:
        d //= 5
    check(d == 1, f"terminating decimal {x}")
    s = f"{float(x):.6f}".rstrip("0").rstrip(".")
    check(F(s) == x, f"decimal text {s} vs {x}")
    return s


def grid(pred, x0, x1, y0, y1, n=700):
    hx, hy = (x1 - x0) / n, (y1 - y0) / n
    c = 0
    for i in range(n):
        x = x0 + (i + 0.5) * hx
        for j in range(n):
            if pred(x, y0 + (j + 0.5) * hy):
                c += 1
    return c * hx * hy


def shoelace(pts):
    s = 0.0
    for (x1, y1), (x2, y2) in zip(pts, pts[1:] + pts[:1]):
        s += x1 * y2 - x2 * y1
    return abs(s) / 2


def arcpts(cx, cy, r, t1, t2, m=4000):
    return [(cx + r * math.cos(math.radians(t1 + (t2 - t1) * k / m)), cy + r * math.sin(math.radians(t1 + (t2 - t1) * k / m))) for k in range(m + 1)]


def close(num, a, b, tol, msg):
    exact = float(a) + float(b) * math.pi
    check(abs(num - exact) <= tol * max(1.0, exact), f"{msg}: numeric {num:.4f} vs exact {exact:.4f}")


def ans(a, b, p):
    return dec(F(a) + F(b) * F(p)) + " cm²"


def inside(x, y, cx, cy, r):
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r


# 개념탐구: 한 변 s인 정사각형, 오른쪽 아래 꼭짓점 중심 부채꼴(반지름 s), 오른쪽 변을 지름으로 하는 반원, 왼쪽 위-오른쪽 아래 대각선 (원주율 3.14)
res = []
for s in [12, 10, 16]:
    def pr(x, y, s=s):
        below = x + y < s
        q = inside(x, y, s, 0, s)
        d = inside(x, y, s, s / 2, s / 2)
        return (below and not q) or ((not below) and q and not d) or (below and d)
    num = grid(pr, 0, s, 0, s)
    a, b = F(s * s, 4), 0  # 분해: (s²/2 − s²π/8) + 2(s²π/16 − s²/8)
    close(num, a, b, 0.01, f"exploration {s}")
    res.append(ans(a, b, F(314, 100)))
OUT["6-2-u5-e4-exploration"] = res

# 예제 1: 반지름 r인 원의 1/4인 호 4개로 둘러싸인 별 모양 + 호 ㄴㄷ의 원 (원주율 3.1)
res = []
for r in [10, 8, 12]:
    c = r * math.sqrt(2)
    cen = [(c, 0), (-c, 0), (0, c), (0, -c)]
    def pr(x, y, r=r, c=c, cen=cen):
        star = abs(x) + abs(y) <= c and not any(inside(x, y, a, b, r) for a, b in cen)
        return star or inside(x, y, c, 0, r)
    num = grid(pr, -c, c + r, -c, c)
    a, b = 4 * r * r, 0  # (2r)² − πr² + πr²
    close(num, a, b, 0.01, f"example1 {r}")
    res.append(ans(a, b, F(31, 10)))
OUT["6-2-u5-e4-example-1"] = res

# 예제 2: 반지름 r인 세 원, 각 중심이 다른 두 원 위 — 정확히 두 원에만 들어가는 부분 (원주율 3.1)
res = []
for r in [8, 6, 10]:
    cs = [(0, r * math.sqrt(3) / 2), (-r / 2, 0), (r / 2, 0)]
    pr = lambda x, y, r=r, cs=cs: sum(inside(x, y, a, b, r) for a, b in cs) == 2
    num = grid(pr, -1.5 * r, 1.5 * r, -r, r + r * math.sqrt(3) / 2)
    a, b = 0, F(r * r, 2)  # 꽃잎 하나 = 60° 부채꼴
    close(num, a, b, 0.01, f"example2 {r}")
    res.append(ans(a, b, F(31, 10)))
OUT["6-2-u5-e4-example-2"] = res

# 예제 3: ㄷ 중심 60° 회전, ㄷㄴ=R, ㄷㄱ=r, 각 ㄴㄷㄱ=30° (원주율 3.1)
res = []
for R, r in [(10, 8), (14, 10), (11, 7)]:
    pol = lambda d, f: (-d * math.cos(math.radians(f)), d * math.sin(math.radians(f)))
    # 경계: ㄴ → 반지름 R 호(0°→60°) → ㄴ' → ㄱ' → 반지름 r 호(90°→30°) → ㄱ → ㄴ
    pts = [pol(R, f) for f in [60 * k / 4000 for k in range(4001)]] + [pol(r, 90 - 60 * k / 4000) for k in range(4001)]
    num = shoelace(pts)
    # 반지름 r 호가 선분 ㄴ'ㄱ' 안쪽, 선분 ㄱㄴ이 반지름 R 원 안쪽인지 확인
    G, N = pol(r, 30), pol(R, 0)
    check(all(math.hypot(*(G[0] + (N[0] - G[0]) * t / 100, G[1] + (N[1] - G[1]) * t / 100)) >= r - 1e-9 for t in range(101)), f"example3 segment {R},{r}")
    a, b = 0, F(R * R - r * r, 6)
    close(num, a, b, 0.001, f"example3 {R},{r}")
    res.append(ans(a, b, F(31, 10)))
OUT["6-2-u5-e4-example-3"] = res

# 예제 4: ㅂ 중심 반지름 r, ∠ㄴㅂㄷ=α, ∠ㄱㅂㄴ=β, ㄴㄹ⊥ㄷㅂ, ㄱㅁ⊥ㄷㅂ (원주율 3)
res = []
for r, al, be in [(12, 35, 20), (10, 30, 30), (6, 25, 40)]:
    check(2 * al + be == 90, f"example4 congruence {al},{be}")
    pol = lambda f: (-r * math.cos(math.radians(f)), r * math.sin(math.radians(f)))
    N, G = pol(al), pol(al + be)
    pts = [pol(al + be * k / 4000) for k in range(4001)] + [(G[0], 0), (N[0], 0)]
    num = shoelace(pts)
    a, b = 0, F(r * r * be, 360)
    close(num, a, b, 0.001, f"example4 {r}")
    res.append(ans(a, b, 3))
OUT["6-2-u5-e4-example-4"] = res

# Mission 1: 한 변 s, 위·아래 변을 지름으로 하는 반원 2개와 각 변의 가운데 점을 이은 마름모 — 둘 중 정확히 하나에만 속한 부분 (원주율 3.1)
res = []
for s in [10, 12, 8]:
    h = s / 2
    def pr(x, y, s=s, h=h):
        semi = inside(x, y, h, s, h) or inside(x, y, h, 0, h)
        dia = abs(x - h) + abs(y - h) <= h
        return semi != dia
    num = grid(pr, 0, s, 0, s)
    a, b = F(s * s, 2), 0
    close(num, a, b, 0.01, f"mission1 {s}")
    res.append(ans(a, b, F(31, 10)))
OUT["6-2-u5-e4-mission-1"] = res

# Mission 2: 한 변 s, 내접원, 마름모와 두 대각선 — 왼쪽 위·오른쪽 아래 삼각형 + 오른쪽 위·왼쪽 아래 활꼴 (원주율 3.1)
res = []
for s in [10, 12, 8]:
    h = s / 2
    def pr(x, y, h=h):
        dia = abs(x - h) + abs(y - h) <= h
        circ = inside(x, y, h, h, h)
        tl, br = x < h and y > h, x > h and y < h
        tr, bl = x > h and y > h, x < h and y < h
        return ((tl or br) and dia) or ((tr or bl) and circ and not dia)
    num = grid(pr, 0, s, 0, s)
    a, b = 0, F(s * s, 8)  # 반원 넓이와 같음
    close(num, a, b, 0.01, f"mission2 {s}")
    res.append(ans(a, b, F(31, 10)))
OUT["6-2-u5-e4-mission-2"] = res

# Mission 3: 한 변 s, 왼쪽 아래 꼭짓점 중심 부채꼴(반지름 s), 왼쪽 변을 지름으로 하는 반원, 왼쪽 아래-오른쪽 위 대각선 (원주율 3.1)
res = []
for s in [10, 12, 8]:
    def pr(x, y, s=s):
        above = y > x
        q = inside(x, y, 0, 0, s)
        d = inside(x, y, 0, s / 2, s / 2)
        white = (above and q and not d) or ((not above) and d) or ((not above) and not q)
        return not white
    num = grid(pr, 0, s, 0, s)
    a, b = F(3 * s * s, 4), 0
    close(num, a, b, 0.01, f"mission3 {s}")
    res.append(ans(a, b, F(31, 10)))
OUT["6-2-u5-e4-mission-3"] = res

# Mission 4: 가로 3R, 세로 2R 직사각형, 가운데 가로선 위 큰 반원(반지름 R)·작은 반원(반지름 R/2) (원주율 3.1)
res = []
for R in [10, 8, 12]:
    def pr(x, y, R=R):
        up = y >= R and inside(x, y, R, R, R) and not inside(x, y, R / 2, R, R / 2)
        dn = y <= R and inside(x, y, 2 * R, R, R) and not inside(x, y, 2.5 * R, R, R / 2)
        return up or dn
    num = grid(pr, 0, 3 * R, 0, 2 * R)
    a, b = 0, F(3 * R * R, 4)
    close(num, a, b, 0.01, f"mission4 {R}")
    res.append(ans(a, b, F(31, 10)))
OUT["6-2-u5-e4-mission-4"] = res

# Mission 5: 반지름 R인 큰 원 안 반지름 R/2인 작은 원 4개 — 작은 원 0개 또는 2개에 속한 부분 (원주율 3.1)
res = []
for R in [6, 10, 8]:
    h = R / 2
    cs = [(0, h), (0, -h), (h, 0), (-h, 0)]
    def pr(x, y, R=R, h=h, cs=cs):
        if not inside(x, y, 0, 0, R):
            return False
        k = sum(inside(x, y, a, b, h) for a, b in cs)
        return k in (0, 2)
    num = grid(pr, -R, R, -R, R)
    a, b = -2 * R * R, R * R  # 겹친 부분 8개 = 8×(πh²/2 − h²)
    close(num, a, b, 0.01, f"mission5 {R}")
    res.append(ans(a, b, F(31, 10)))
OUT["6-2-u5-e4-mission-5"] = res

# Mission 6: ㄴ 중심 반지름 r, ∠ㄱㄴㄹ=β, ∠ㄴㄹㅂ=γ, ㄱㅁ⊥ㄴㄷ, ㄹㅂ⊥ㄴㄷ (원주율 3.1)
res = []
for r, be, ga in [(10, 18, 54), (12, 20, 55), (10, 36, 63)]:
    t_r, t_g = 90 - ga, 90 - ga + be
    check(t_g == ga, f"mission6 congruence {be},{ga}")
    pol = lambda f: (r * math.cos(math.radians(f)), r * math.sin(math.radians(f)))
    Rr, G = pol(t_r), pol(t_g)
    pts = [pol(t_g - be * k / 4000) for k in range(4001)] + [(Rr[0], 0), (G[0], 0)]
    num = shoelace(pts)
    a, b = 0, F(r * r * be, 360)
    close(num, a, b, 0.001, f"mission6 {r}")
    res.append(ans(a, b, F(31, 10)))
OUT["6-2-u5-e4-mission-6"] = res

if fails:
    print("FAILS", len(fails))
    for f in fails:
        print(" ", f)
    raise SystemExit(1)
print("all checks ok")
print("AUDIT " + json.dumps(OUT, ensure_ascii=False))
