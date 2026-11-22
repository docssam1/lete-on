# 황소 5-1 6단원 잠금 원문 유형(5-1-u6-a) 독립 검산기. python3 -I, 표준 라이브러리만 사용.
# 각 변형의 매개변수에서 도형 좌표·넓이·둘레를 다시 계산하고, 가능한 곳은 전수 탐색으로 답의 유일성을 확인한다.
import json, math
from fractions import Fraction as F

out = {}


def fmt(x):
    x = F(x)
    if x.denominator == 1:
        return str(x.numerator)
    s = '%.6f' % (x.numerator / x.denominator)
    return s.rstrip('0').rstrip('.')


def shoelace(pts):
    s = F(0)
    for i in range(len(pts)):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % len(pts)]
        s += F(x1) * F(y2) - F(x2) * F(y1)
    return abs(s) / 2


def fsqrt(x):
    x = F(x)
    n, d = math.isqrt(x.numerator), math.isqrt(x.denominator)
    assert n * n == x.numerator and d * d == x.denominator, x
    return F(n, d)


def perim(pts):
    return sum(math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]) for i in range(len(pts)))


# ── t1-11: 다섯 조각 둘레 (가·마는 다가 한 귀퉁이를 차지한 꺾인 모양) 전수 탐색
r = []
for G, N, R, M in [(32, 22, 16, 34), (36, 26, 18, 40), (30, 24, 20, 38)]:
    found = set()
    for a in range(1, 40):
        for b in range(1, a):
            for p in range(1, 40):
                for q in range(1, p):
                    W = F(N, 2) + a - q
                    H = F(R, 2) + p - b
                    if W <= a or H <= p:
                        continue
                    ga = [(0, 0), (a, 0), (a, q), (b, q), (b, p), (0, p)]
                    na = [(a, 0), (W, 0), (W, q), (a, q)]
                    da = [(b, q), (a, q), (a, p), (b, p)]
                    ra = [(0, p), (b, p), (b, H), (0, H)]
                    ma = [(a, q), (W, q), (W, H), (b, H), (b, p), (a, p)]
                    if abs(perim(ga) - G) > 1e-9 or abs(perim(na) - N) > 1e-9 or abs(perim(ra) - R) > 1e-9 or abs(perim(ma) - M) > 1e-9:
                        continue
                    found.add(round(perim(da), 9))
    assert len(found) == 1, found
    r.append(fmt(F(round(found.pop()))))
out['5-1-u6-t1-11'] = r

# ── 개념탐구 2 탐구: 12열 점판에서 넓이 N인 정사각형은 모두 합동(같은 변 벡터 종류)인지 전수 확인
def lattice_squares(cols, rows, N):
    kinds = set()
    cnt = 0
    for x in range(cols):
        for y in range(rows):
            for dx in range(-rows - cols, rows + cols):
                for dy in range(-rows - cols, rows + cols):
                    if dx * dx + dy * dy != N or not (dx > 0 and dy >= 0):
                        continue
                    pts = [(x, y), (x + dx, y + dy), (x + dx - dy, y + dy + dx), (x - dy, y + dx)]
                    if all(0 <= px < cols and 0 <= py < rows for px, py in pts):
                        cnt += 1
                        kinds.add(tuple(sorted((abs(dx), abs(dy)), reverse=True)))
    return cnt, kinds


for tid, vs in [('5-1-u6-t2', [(1, 0), (2, 0), (3, 0)]), ('5-1-u6-t2-2', [(1, 1), (3, 3), (4, 4)]),
                ('5-1-u6-t2-3', [(2, 1), (3, 2), (4, 1)]), ('5-1-u6-t2-4', [(2, 2), (4, 2), (5, 1)]),
                ('5-1-u6-t2-5', [(3, 1), (5, 2), (5, 3)])]:
    r = []
    srcN = {'5-1-u6-t2': 1, '5-1-u6-t2-2': 2, '5-1-u6-t2-3': 5, '5-1-u6-t2-4': 8, '5-1-u6-t2-5': 10}[tid]
    for i, (a, b) in enumerate(vs):
        N = a * a + b * b
        if i == 0:
            assert N == srcN
        rows = max(6, a + b + 1)
        cnt, kinds = lattice_squares(12, rows, N)
        assert cnt >= 1 and kinds == {(a, b)}, (tid, N, kinds)
        x0, y0 = (11 - (a + b)) // 2, (rows - 1 - (a + b)) // 2
        sq = [(x0 + b, y0), (x0 + a + b, y0 + b), (x0 + a, y0 + a + b), (x0, y0 + a)]
        assert shoelace(sq) == N and all(0 <= px < 12 and 0 <= py < rows for px, py in sq)
        r.append(f'한 변이 {a} cm인 정사각형 (그림은 한 예)' if b == 0 else f'한 변이 가로 {a}칸, 세로 {b}칸을 비스듬히 잇는 정사각형 (그림은 한 예)')
    out[tid] = r


# ── 예제 2-2: 다각형 자르기(Sutherland–Hodgman, 볼록 다각형)로 ㉠, ㉡을 직접 계산
def clip(subject, clipper):
    def inside(p, a, b):
        return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) >= 0

    def inter(p1, p2, a, b):
        x1, y1 = p1; x2, y2 = p2; x3, y3 = a; x4, y4 = b
        den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
        t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den
        return (x1 + t * (x2 - x1), y1 + t * (y2 - y1))
    o = subject
    for i in range(len(clipper)):
        a, b = clipper[i - 1], clipper[i]
        inp, o = o, []
        if not inp:
            break
        s = inp[-1]
        for e in inp:
            if inside(e, a, b):
                if not inside(s, a, b):
                    o.append(inter(s, e, a, b))
                o.append(e)
            elif inside(s, a, b):
                o.append(inter(s, e, a, b))
            s = e
    return o


def ccw(pts):
    s = sum(F(pts[i - 1][0]) * pts[i][1] - F(pts[i][0]) * pts[i - 1][1] for i in range(len(pts)))
    return pts if s > 0 else pts[::-1]


def sqr(x, y, s):
    return ccw([(F(x), F(y)), (F(x) + s, F(y)), (F(x) + s, F(y) + s), (F(x), F(y) + s)])


r = []
for B, s_, m in [(10, 4, 8), (9, 3, 7), (11, 5, 8)]:
    diffs = set()
    for shift in [F(0), F(1, 5), F(-1, 3)]:
        big = sqr(0, 0, B)
        sx, sy = F(3, 10) * B, F(2, 5) * B
        small = sqr(sx, sy, s_)
        P0 = (sx + F(s_, 2) + shift, sy + F(s_, 2) + shift)
        u = (F(24, 25) * m, F(-7, 25) * m)
        v = (F(7, 25) * m, F(24, 25) * m)
        med = ccw([P0, (P0[0] + u[0], P0[1] + u[1]), (P0[0] + u[0] + v[0], P0[1] + u[1] + v[1]), (P0[0] + v[0], P0[1] + v[1])])
        assert shoelace(clip(small, big)) == s_ * s_  # 작은 색종이는 큰 색종이 안
        mb = shoelace(clip(med, big))
        ms = shoelace(clip(med, small))
        assert 0 < ms < s_ * s_ and 0 < mb < m * m
        g = B * B - (s_ * s_ + mb - ms)  # 큰 색종이에서 (작은 ∪ 중간)이 덮지 않은 부분
        h = ms + (m * m - mb)
        diffs.add(abs(g - h))
    assert len(diffs) == 1
    r.append(fmt(diffs.pop()))
out['5-1-u6-t2-7'] = r

# ── 예제 2-3: 직사각형을 늘여 만든 평행사변형의 넓이(여러 가로·세로 쌍으로 확인)
r = []
for A, k in [(8, F(3, 2)), (12, F(3, 2)), (9, F(2))]:
    vals = set()
    for a in [F(1), F(2), F(3), F(A, 5)]:
        b = F(A) / a
        m = k - 1
        para = [(0, -m * b), (k * a, 0), (a, k * b), (-m * a, b)]
        vals.add(shoelace(para))
    assert len(vals) == 1
    r.append(fmt(vals.pop()) + ' cm²')
out['5-1-u6-t2-8'] = r

# ── 예제 2-4: 가로·세로 길이 전수 탐색으로 ㉠ 유일성 확인
r = []
for TL, TR, BR in [(8, 20, 45), (6, 15, 40), (12, 20, 35)]:
    vals = set()
    for w1n in range(1, 41):
        w1 = F(w1n, 4)
        h1 = F(TL) / w1
        w2 = F(TR) / h1
        h2 = F(BR) / w2
        vals.add(w1 * h2)
    assert len(vals) == 1
    r.append(fmt(vals.pop()) + ' cm²')
out['5-1-u6-t2-9'] = r

# ── Mission 1: 정사각형 한 변 s, 직사각형 (s+d)×(s-d)
r = []
for d, den in [(5, 20), (4, 25), (6, 30)]:
    # 늘어난 넓이 = s² - (s+d)(s-d) = d² (어떤 s에도 성립) → 처음 넓이 = d²×den
    for s in [F(20), F(31, 2), F(50)]:
        assert s * s - (s + d) * (s - d) == d * d
    rect = d * d * den
    sq = rect + d * d
    assert F(sq - rect) == F(rect, den) == d * d  # 늘어난 넓이 = 처음 넓이의 1/den
    r.append(fmt(sq) + ' cm²')
out['5-1-u6-t2-10'] = r

# ── Mission 2: 블록 대각선이 지갑의 긴 변, 맞은편 변이 블록 꼭짓점을 지남
r = []
for bw, bh in [(20, 15), (24, 18), (16, 12)]:
    dg = fsqrt(bw * bw + bh * bh)
    wd = F(bw * bh) / dg
    n = (F(bh) / dg, F(bw) / dg)
    P = (F(5, 2) * bw, F(2 * bh)); Q = (F(7, 2) * bw, F(bh)); C = (F(7, 2) * bw, F(2 * bh))
    R_ = (Q[0] + wd * n[0], Q[1] + wd * n[1]); S = (P[0] + wd * n[0], P[1] + wd * n[1])
    assert (R_[0] - S[0]) * (C[1] - S[1]) - (R_[1] - S[1]) * (C[0] - S[0]) == 0  # C가 맞은편 변 위
    assert min(S[0], R_[0]) <= C[0] <= max(S[0], R_[0])
    r.append(fmt(shoelace([P, Q, R_, S])) + ' cm²')
out['5-1-u6-t2-11'] = r


# ── Mission 3: 모눈 좌표 신발끈 공식
def inside_convex(pt, poly):
    sg = set()
    for i in range(len(poly)):
        a, b = poly[i - 1], poly[i]
        cr = (b[0] - a[0]) * (pt[1] - a[1]) - (b[1] - a[1]) * (pt[0] - a[0])
        sg.add(cr > 0)
        if cr == 0:
            return False
    return len(sg) == 1


r = []
for N, a, b, c, d in [(5, 4, 1, 1, 2), (6, 5, 1, 1, 3), (7, 5, 2, 1, 2)]:
    outer = [(F(b), F(0)), (F(N), F(b)), (F(N - b), F(N)), (F(0), F(N - b))]
    C = F(N, 2); x = F(d - c, 2); y = F(-(c + d), 2)
    inner = [(C + x, C + y), (C - y, C + x), (C - x, C - y), (C + y, C - x)]
    assert all(inside_convex(p, outer) for p in inner)
    r.append(fmt(shoelace(outer) - shoelace(inner)) + ' cm²')
out['5-1-u6-t2-12'] = r

# ── Mission 4: 직사각형 배치(분수 좌표)를 만들고 각 영역 넓이를 직접 계산, 연립식 유일성 확인
r = []


def rect_area(rc):
    return max(F(0), rc[2] - rc[0]) * max(F(0), rc[3] - rc[1])


def isect(p, q):
    return (max(p[0], q[0]), max(p[1], q[1]), min(p[2], q[2]), min(p[3], q[3]))


for S, pa, pb, pc, T, w1, h3, t in [(320, 189, 200, 181, 48, 8, 3, 6), (300, 170, 186, 160, 40, 8, 3, 6), (360, 210, 220, 200, 54, 9, 3, 6)]:
    # 미지수 x=㉠(A∩B만), y=㉡(A∩C만), z=㉢(B∩C만): x+y=S-pa-T, x+z=S-pb-T, y+z=S-pc-T (계수 행렬식 -2 ≠ 0 → 유일)
    e1, e2, e3 = S - pa - T, S - pb - T, S - pc - T
    sols = [(x, e1 - x, e2 - x) for x in range(0, S + 1) if (e1 - x) + (e2 - x) == e3]
    assert len(sols) == 1
    g1, g2, g3 = sols[0]
    # 같은 값을 실제 좌표 배치에서 확인
    w1 = F(w1); h2 = F(T) / w1; h1 = F(g1) / w1; w2 = F(g3) / h2; w0 = F(g2 + T) / (h2 + h3) - w1
    Ah = h1 + h2 + h3; B_h = t + h1 + h2; Cw = w0 + w1 + w2
    A = (w1 - F(S) / Ah, F(0), w1, Ah); B = (F(0), F(-t), F(S) / B_h, h1 + h2); Cc = (-w0, h1, w1 + w2, h1 + F(S) / Cw)
    assert A[0] < Cc[0] < B[0] < A[2] < Cc[2] < B[2] and B[1] < A[1] < Cc[1] < B[3] < A[3] < Cc[3]
    AB, AC, BC = isect(A, B), isect(A, Cc), isect(B, Cc)
    ABC = isect(AB, Cc)
    ar = rect_area
    assert ar(A) == ar(B) == ar(Cc) == S and ar(ABC) == T
    assert ar(A) - ar(AB) - ar(AC) + ar(ABC) == pa and ar(B) - ar(AB) - ar(BC) + ar(ABC) == pb and ar(Cc) - ar(AC) - ar(BC) + ar(ABC) == pc
    assert (ar(AB) - ar(ABC), ar(AC) - ar(ABC), ar(BC) - ar(ABC)) == (g1, g2, g3)
    r.append(f'㉠ {g1} cm², ㉡ {g2} cm², ㉢ {g3} cm²')
out['5-1-u6-t2-13'] = r

# ── Mission 5: 3×3 배열, 가로·세로 길이 전수 탐색으로 ⑥ 유일성 확인
r = []
for c, rr in [((25, 20, 10), (10, 20, 30)), ((21, 18, 6), (10, 20, 40)), ((20, 15, 5), (10, 20, 40))]:
    c1, c2, c3 = c; r1, r2, r3 = rr
    a1, a2, a3, a4, a5 = c3 * r1, c2 * r1, c3 * r3, c2 * r2, c1 * r2
    vals = set()
    for c3n in range(1, 61):
        C3 = F(c3n, 2); R1 = F(a1) / C3; C2 = F(a2) / R1; R2 = F(a4) / C2; C1 = F(a5) / R2; R3 = F(a3) / C3
        vals.add(C1 * R3)
    assert len(vals) == 1
    r.append(fmt(vals.pop()) + ' cm²')
out['5-1-u6-t2-14'] = r

# ── Mission 6: 밭의 가로·세로 정수 쌍 전수 탐색(논은 같은 가로·세로), 길 넓이 m²
r = []
for Lx, Ly in [(720, 360), (600, 400), (500, 400)]:
    tot = Lx * Ly
    rem = tot - (50 * Lx + 50 * Ly - 2500)
    vals = set()
    for L in range(51, tot // 51 + 1):
        if tot % L:
            continue
        W = tot // L
        if W <= 50:
            continue
        if (L - 50) * (W - 50) != rem:  # 가: 가로·세로 길 1개씩 → 남은 밭
            continue
        road = tot - (L - 150) * (W - 150)  # 나: 가로·세로 길 3개씩
        vals.add(F(road, 10000))
    assert len(vals) == 1, vals
    r.append(fmt(vals.pop()) + ' m²')
out['5-1-u6-t2-15'] = r

# ── 개념탐구 3 탐구 (1)(2): 모눈 평행사변형 신발끈 공식
for tid, vs, src in [('5-1-u6-t3', [(4, 5, 1), (3, 6, 1), (5, 5, 2)], 20), ('5-1-u6-t3-2', [(3, 7, 4), (2, 6, 3), (3, 5, 4)], 21)]:
    r = []
    for i, (b, h, s) in enumerate(vs):
        pts = [(1, h + 1), (1 + b, h + 1), (1 + b + s, 1), (1 + s, 1)]
        A = shoelace(pts)
        if i == 0:
            assert A == src
        r.append(fmt(A) + ' cm²')
    out[tid] = r

# ── 예제 3-2: 좌표로 두 평행사변형을 만들고 둘레를 직접 계산
r = []
for p, q, c, mb, area in [(6, 8, 10, F(25, 2), 108), (9, 12, 15, F(45, 2), 270), (8, 15, 17, F(51, 2), 300)]:
    p, q, c = F(p), F(q), F(c)
    k = mb / c
    G = (F(0), F(0)); Rr = (c, F(0)); S = (p * p / c, p * q / c)
    assert (S[0] - G[0]) * (S[0] - Rr[0]) + (S[1] - G[1]) * (S[1] - Rr[1]) == 0  # ㄱㅅ ⟂ ㄹㅅ
    Bp = (S[0] * (1 + k), S[1] * (1 + k)); Mp = (c + (S[0] - c) * (1 + k), S[1] * (1 + k)); Np = (Mp[0] - c, Mp[1]); Dp = (Bp[0] + c, Bp[1])
    assert Bp[0] - Mp[0] == mb
    assert shoelace([G, Np, Mp, Rr]) == area  # 원문 넓이 조건과 일치

    def dist(P1, P2):
        return fsqrt((P1[0] - P2[0]) ** 2 + (P1[1] - P2[1]) ** 2)
    assert dist(G, S) == p and dist(S, Rr) == q
    P_big = dist(G, Np) + dist(Np, Dp) + dist(Dp, Rr) + dist(Rr, G)
    P_tri = dist(S, Mp) + dist(Mp, Bp) + dist(Bp, S)
    r.append(fmt(P_big - P_tri) + ' cm')
out['5-1-u6-t3-6'] = r

# ── 예제 3-3: 넓이로 ㄱㄴ, 둘레로 ㄱㄷ (변형 1·2는 좌표로 일관성 확인)
r = []
notes = []
for b, h, dm, per, n1 in [(54, 32, 36, F(1393, 10), None), (75, 56, 60, 210, 42), (25, 24, 20, 80, 18)]:
    area = F(b * h, 2)
    AB = area * 2 / dm
    AC = per - b - AB
    if n1 is not None:
        Nn, Dd, Aa = (F(0), F(h)), (F(b), F(h)), (F(n1), F(0))
        assert fsqrt((Aa[0]) ** 2 + h * h) == AB
        assert fsqrt((b - n1) ** 2 + h * h) == AC
        assert n1 * (b - n1) < h * h  # ㄱ의 각이 예각 → ㅁ이 변 ㄱㄴ 위
        assert shoelace([Nn, Dd, Aa]) * 2 / AB == dm
    else:
        geo = math.hypot(b - math.sqrt(float(AB) ** 2 - h * h), h)
        notes.append('예제 3-3 원문 수치: 넓이 방법 답 %s cm, 같은 밑변·높이·ㄱㄴ으로 그린 삼각형의 실제 ㄱㄷ ≈ %.2f cm (원문 수치가 약간 어긋남)' % (fmt(AC), geo))
    r.append(fmt(AC) + ' cm')
out['5-1-u6-t3-7'] = r

for n_ in notes:
    print('NOTE', n_)
for kk, v in out.items():
    assert len(v) == 3 and len(set(v)) == 3, (kk, v)
print('AUDIT ' + json.dumps(out, ensure_ascii=False))
