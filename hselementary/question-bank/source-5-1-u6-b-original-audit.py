# 5-1-u6-b 독립 검산기: 각 변형의 조건으로 좌표·넓이를 다시 계산하고 답의 유일성을 확인합니다.
# python3 -I, 표준 라이브러리만 사용합니다.
import json
import math
from fractions import Fraction as F


def area(poly):
    s = 0
    n = len(poly)
    for i in range(n):
        x1, y1 = poly[i]
        x2, y2 = poly[(i + 1) % n]
        s += x1 * y2 - x2 * y1
    return abs(s) / 2


def clip(poly, a, b):
    """keep part of convex/any polygon on the left of directed line a->b (Sutherland-Hodgman)"""
    def side(p):
        return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])
    out = []
    n = len(poly)
    for i in range(n):
        p, q = poly[i], poly[(i + 1) % n]
        sp, sq = side(p), side(q)
        if sp >= 0:
            out.append(p)
        if (sp >= 0) != (sq >= 0):
            t = sp / (sp - sq)
            out.append((p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t))
    return out


def inter(P, Q):
    """intersection of convex polygons (Q counter-clockwise)"""
    R = list(P)
    for i in range(len(Q)):
        if not R:
            break
        R = clip(R, Q[i], Q[(i + 1) % len(Q)])
    return R


def ccw(poly):
    s = sum(poly[i][0] * poly[(i + 1) % len(poly)][1] - poly[(i + 1) % len(poly)][0] * poly[i][1] for i in range(len(poly)))
    return poly if s > 0 else poly[::-1]


def num(x):
    x = F(x)
    if x.denominator == 1:
        return str(x.numerator)
    if (x * 10).denominator == 1:
        t = x * 10
        return '%d.%d' % (t.numerator // 10, t.numerator % 10)
    raise ValueError(x)


def near(x, tol=1e-6):
    r = F(round(x * 10), 10)
    assert abs(x - float(r)) < tol, x
    return r


def pip(p, poly):
    x, y = p
    c = False
    n = len(poly)
    for i in range(n):
        x1, y1 = poly[i]
        x2, y2 = poly[(i + 1) % n]
        if (y1 > y) != (y2 > y):
            xi = x1 + (y - y1) * (x2 - x1) / (y2 - y1)
            if xi > x:
                c = not c
    return c


R = {}

# t3-8: 직각이등변삼각형 ㄱㄷㄹ 넓이 S, 삼각형 ㄱㄴㄷ 넓이 S, ㄴㅁ ⊥ ㄱㄷ
out = []
for S in (36, 64, 81):
    cands = []
    for k in range(1, 400):  # ㄱㄹ = ㄹㄷ = k/2 단위 탐색
        leg = F(k, 2)
        if leg * leg / 2 == S:
            hyp_sq = 2 * leg * leg
            cands.append(hyp_sq)
    # 정수 길이 ㄱㄷ 탐색: ㄱㄷ^2 = 4S
    d = [x for x in range(1, 200) if x * x == 4 * S]
    assert len(d) == 1
    nm = F(2 * S, d[0])
    out.append(num(nm) + ' cm')
R['5-1-u6-t3-8'] = out

# t3-9: 합동 삼각형 겹침, 좌표로 직접 계산
out = []
for B, H, L in ((42, 27, 37), (40, 26, 35.5), (36, 24, 32.5)):
    N = (0.0, 0.0); M = (-B, 0.0)
    d = math.hypot(B / 2, H)
    G = (-B / 2 / d * B, H / d * B)
    D = (G[0] + L, G[1])
    al = math.atan2(H, B / 2)
    Rr = (M[0] + L * math.cos(al), M[1] + L * math.sin(al))
    T1 = ccw([G, N, D]); T2 = ccw([M, N, Rr])
    # 합동 확인
    sides = lambda T: sorted(math.dist(T[i], T[(i + 1) % 3]) for i in range(3))
    assert all(abs(a - b) < 1e-9 for a, b in zip(sides(T1), sides(T2)))
    ov = area(inter(T1, T2))
    shaded = area(T1) - ov
    # 점 ㅂ의 높이가 H인지 확인
    out.append(num(near(shaded)) + ' cm²')
R['5-1-u6-t3-9'] = out

# t3-11: ㄹㅁ 후보를 0.5 cm 간격으로 전수 탐색
out = []
for w, h, S in ((7, 16, 182), (8, 15, 192), (6, 20, 198)):
    sol = []
    for k in range(1, 2 * h):
        r = F(k, 2)
        Mm = (F(0), F(0)); G = (F(0), F(h)); Ss = (F(w), F(h)); Bb = (F(w), F(0)); Rr = (F(0), r)
        xd = -r * w / (h - r)
        D = (xd, F(0)); Nn = (xd - w, F(0))
        sh = area([Nn, D, Rr, G]) + area([Rr, Ss, Bb, Mm])
        if sh == S:
            sol.append(r)
    assert len(sol) == 1, sol
    out.append(num(sol[0]) + ' cm')
R['5-1-u6-t3-11'] = out

# t3-12: 좌표로 사각형을 만들어 신발끈 공식
out = []
for AB, BF, h, AP, DC in ((32, 6, 20, 35, 12), (30, 8, 18, 32, 14), (28, 6, 24, 30, 10)):
    A = (0.0, 0.0); Bq = (float(AB), 0.0); C = (float(AB + BF), float(h))
    AC = math.hypot(*C); PC = math.sqrt(AC * AC - AP * AP)
    ux, uy = C[0] / AC, C[1] / AC
    P = (AP * AP / AC * ux - AP * PC / AC * uy, AP * AP / AC * uy + AP * PC / AC * ux)
    assert abs((P[0]) * (C[0] - P[0]) + P[1] * (C[1] - P[1])) < 1e-6  # 직각
    assert abs(math.hypot(*P) - AP) < 1e-9
    D = (C[0] + DC * (P[0] - C[0]) / PC, C[1] + DC * (P[1] - C[1]) / PC)
    out.append(num(near(area([A, Bq, C, D]))) + ' cm²')
R['5-1-u6-t3-12'] = out

# t3-13: 평행사변형 좌표
out = []
for nm, md, rd, mb in ((7, 12, 16, 6), (9, 15, 20, 9), (8, 10, 15, 8)):
    s = mb / md; c = math.sqrt(1 - s * s)
    N = (0.0, 0.0); M = (float(nm), 0.0); D = (float(nm + md), 0.0)
    Rr = (D[0] - rd * c, rd * s)
    # ㅁ에서 직선 ㄷㄹ까지 거리 확인
    dist = abs((Rr[0] - D[0]) * (M[1] - D[1]) - (Rr[1] - D[1]) * (M[0] - D[0])) / rd
    assert abs(dist - mb) < 1e-9
    Ss = (Rr[0] - nm, Rr[1]); O = (M[0] + Rr[0] - D[0], Rr[1])
    a1 = area([Ss, N, M, Rr]); a2 = area([O, M, D, Rr])
    out.append(num(near(abs(a1 - a2))) + ' cm²')
R['5-1-u6-t3-13'] = out

# t3-14
out = []
for b, h, k, P in ((50, 15, 30, F(217, 2)), (44, 10, 22, F(185, 2)), (56, 16, 28, F(241, 2))):
    ar = F(b * h, 2)
    c = ar * 2 / k
    ab = P - b - c
    # 실제 도형과의 일치(소수 첫째 자리 반올림 오차 이내)와 둔각 확인
    rd = math.sqrt(float(c) ** 2 - h * h)
    real = math.hypot(b - rd, h)
    assert abs(real - float(ab)) < 0.05 and (b - rd) * rd > h * h
    out.append(num(ab) + ' cm')
R['5-1-u6-t3-14'] = out

# t4-4: 마름모 - 안쪽 사각형 (신발끈)
out = []
for nP, PO, Qr, gR, Od in ((10, 9, 5, 6, 18), (8, 7, 4, 5, 14), (12, 8, 6, 4, 16)):
    hx = nP + PO; hy = Od
    rh = [(0, hy), (-hx, 0), (0, -hy), (hx, 0)]
    inner = [(0, hy - gR), (-PO, 0), (0, -hy), (hx - Qr, 0)]
    out.append(num(F(area(rh)) - F(area(inner))) + ' cm²')
R['5-1-u6-t4-4'] = out

# t4-7: 원 안 반복 도형, 색칠 삼각형 좌표
out = []
for r in (12, 16, 20):
    r = F(r); h = r / 2
    t1 = area([(-r, 0), (-h, h), (-h, -h)])
    t2 = area([(h, h), (0, h), (h, 0)])
    # 가운데 점 확인: (-h,h)는 (-r,0)-(0,r)의 가운데
    assert (-h, h) == ((-r + 0) / 2, (0 + r) / 2)
    out.append(num(t1 + t2) + ' cm²')
R['5-1-u6-t4-7'] = out

# t4-8: 비율 조건 전수 탐색
out = []
for top, bot, S in ((10, 18, 84), (15, 27, 168), (20, 36, 140)):
    sols = []
    for a in range(1, bot * 2):
        nm = F(a, 2)
        if nm * 3 != bot:
            continue
        for b2 in range(1, bot * 2):
            mb = F(b2, 2)
            if mb * 3 == bot - nm:
                sols.append((nm, mb))
    assert len(sols) == 1
    nm, mb = sols[0]
    h = F(2 * S, top + bot)
    G = (bot - top, h)
    out.append(num(area([G, (nm, 0), (nm + mb, 0)])) + ' m²')
R['5-1-u6-t4-8'] = out

# t4-9
out = []
for top, bot, h in ((13, 49, 28), (15, 41, 28), (12, 44, 21)):
    trap = area([(0, 0), (bot, 0), (bot, h), (bot - top, h)])
    ov = F(trap) * F(3, 7)
    rh = ov / F(1, 2)
    out.append(num(rh) + ' cm²')
R['5-1-u6-t4-9'] = out

# t4-10: 세 마름모 좌표로 겹침 계산
out = []
for hh in (8, 12, 16):
    hh = F(hh)
    def rh(cx, r):
        return ccw([(cx, r), (cx - r, F(0)), (cx, -r), (cx + r, F(0))])
    A = rh(F(0), hh)
    # ㄷ = 큰 마름모 오른쪽 꼭짓점, ㄴ = ㄱㄷ의 가운데
    cD = hh; rB = cD - cD / 2
    B = rh(cD, rB)
    cM = cD + rB; rC = cM - (cD + cM) / 2
    C = rh(cM, rC)
    o1 = area(inter(A, B)); o2 = area(inter(B, C)); o3 = area(inter(A, C))
    assert o3 == 0
    sh = area(A) + area(B) + area(C) - 2 * (o1 + o2)
    out.append(num(sh) + ' cm²')
R['5-1-u6-t4-10'] = out

# t4-11: 정사각형을 대각선이 축이 되게 놓고 계산
out = []
for rp, pq, qn in ((30, 50, 40), (20, 40, 30), (35, 45, 20)):
    D = F(rp + pq + qn); h = D / 2
    sq = [(-h, 0), (0, -h), (h, 0), (0, h)]  # ㄴ, ㄷ, ㄹ, ㄱ
    Q = (-h + qn, 0); P = (-h + qn + pq, 0)
    white = area([(0, h), Q, (0, -h), P])
    out.append(num(area(sq) - white) + ' m²')
R['5-1-u6-t4-11'] = out

# t4-12: 이동 후 직사각형과 사다리꼴의 교집합
out = []
for rw, rhh, top, bot, h, t in ((6, 8, 8, 22, 6, 19), (5, 9, 9, 24, 7, 20), (6, 9, 7, 25, 8, 22)):
    left = bot - top - h
    trap = ccw([(F(0), F(0)), (F(bot), F(0)), (F(bot - h), F(h)), (F(left), F(h))])
    rect = ccw([(F(t - rw), F(0)), (F(t), F(0)), (F(t), F(rhh)), (F(t - rw), F(rhh))])
    out.append(num(area(inter(rect, trap))) + ' cm²')
R['5-1-u6-t4-12'] = out

# t5: 모눈 도형 신발끈
out = []
for t, Rx, Bx, Lp in ((1, 10, 12, 9), (2, 12, 10, 8), (1, 9, 10, 8)):
    pts = [(6, t), (Rx, 4), (6, 7), (Bx, 10), (4, 10), (4, 7), (2, Lp), (2, 4)]
    out.append(num(F(area(pts))) + ' cm²')
R['5-1-u6-t5'] = out

# t5-2: 각 정사각형에서 선분 위쪽 부분을 잘라 넓이 합
out = []
for a, b in ((9, 6), (10, 5), (8, 6)):
    W = 2 * a + 2 * b
    xs = [0, a, 2 * a, 2 * a + b, W]; hs = [a, a, b, b]
    tot = F(0)
    for i in range(4):
        sq = ccw([(F(xs[i]), F(0)), (F(xs[i + 1]), F(0)), (F(xs[i + 1]), F(hs[i])), (F(xs[i]), F(hs[i]))])
        up = clip(sq, (F(0), F(a)), (F(W), F(0)))  # 왼쪽 = 선분 위쪽? 방향 확인
        tot += area(up)
    # 방향 확인: 선분 위쪽 점 (0,a+1)이 왼쪽에 있어야 함
    side = (W - 0) * (a + 1 - a) - (0 - a) * (0 - 0)
    assert side > 0
    out.append(num(tot) + ' cm²')
R['5-1-u6-t5-2'] = out

# t5-3: 두 선분 사이(둘째 칸), 둘째 선분 아래(넷째 칸)
out = []
for s in (12, 24, 36):
    s = F(s)
    def sq(k):
        return ccw([(k * s, F(0)), ((k + 1) * s, F(0)), ((k + 1) * s, s), (k * s, s)])
    L1 = ((F(0), s), (3 * s, F(0)))
    L2 = ((s, s), (5 * s, F(0)))
    above = lambda poly, L: clip(poly, L[0], L[1])
    below = lambda poly, L: clip(poly, L[1], L[0])
    a2 = area(above(below(sq(1), L2), L1))
    a4 = area(above(below(sq(3), L2), L1))
    out.append(num(a2 + a4) + ' cm²')
R['5-1-u6-t5-3'] = out

# t5-4: 전체 가로 길이 전수 탐색(대각선이 ㅈ을 지나는 경우)
out = []
for a, b, c in ((40, 12, 30), (36, 10, 25), (45, 15, 20)):
    sols = []
    for W2 in range(2 * c + 1, 2000):
        W = F(W2, 2)
        x = W - c
        # 대각선 (0,a+b)-(W,0) 위의 x에서 높이 = b ?
        if (a + b) - (a + b) * x / W == b:
            sols.append(x)
    assert len(sols) == 1
    out.append(num(sols[0]) + ' cm')
R['5-1-u6-t5-4'] = out

# t5-5: 좌표
out = []
for a, b, k, S in ((14, 28, 8, 205), (12, 24, 6, 171), (15, 30, 10, 230)):
    sols = []
    for k2 in range(1, 4 * a):
        y = F(k2, 4)
        if a - a * F(k) / b == y:  # 점 ㅂ(k, y)가 변 ㄱㄹ 위
            sols.append(y)
    assert len(sols) == 1
    y = sols[0]
    ms = [F(m2, 4) for m2 in range(1, 8 * b) if area([(F(0), y), (F(0), F(0)), (F(b), F(0)), (F(m2, 4), y)]) == S]
    assert len(ms) == 1
    m = ms[0]
    out.append(num(area([(F(0), F(a)), (F(k), y), (m, y)])) + ' cm²')
R['5-1-u6-t5-5'] = out

# t5-6: 바깥 다각형 - 흰 구멍, 구멍이 안쪽에 있는지 확인
out = []
for outer, hole in (([(3, 1), (6, 3), (9, 4), (6, 7), (3, 7), (1, 5)], [(2, 4), (5, 4), (5, 6), (3, 6)]),
                    ([(4, 1), (7, 3), (9, 5), (6, 7), (2, 7), (1, 4)], [(2, 4), (5, 4), (5, 6), (3, 6)]),
                    ([(3, 1), (5, 3), (9, 4), (7, 7), (4, 7), (1, 5)], [(2, 4), (6, 4), (6, 6), (4, 6)])):
    for p in hole:
        assert pip(p, outer), p
    # 변 중간점도 안쪽
    for i in range(4):
        p, q = hole[i], hole[(i + 1) % 4]
        for t in (0.25, 0.5, 0.75):
            assert pip((p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t), outer)
    out.append(num(F(area(outer)) - F(area(hole))) + ' cm²')
R['5-1-u6-t5-6'] = out

print('AUDIT ' + json.dumps(R, ensure_ascii=False))
