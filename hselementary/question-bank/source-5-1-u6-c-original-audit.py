# 5-1 6단원(개념탐구 5 Mission 2~6, 개념탐구 6) 원문 유형 독립 감사기. 표준 라이브러리만 사용합니다.
# 각 변형의 매개변수로 넓이를 좌표·격자·전수 탐색으로 다시 계산하고, 답이 하나뿐인지 확인합니다.
import json
from fractions import Fraction as Fr

def shoelace(P):
    s = 0
    for i in range(len(P)):
        x1, y1 = P[i]; x2, y2 = P[(i + 1) % len(P)]
        s += x1 * y2 - x2 * y1
    return abs(Fr(s)) / 2 if not isinstance(s, float) else abs(s) / 2

def inter(p1, p2, p3, p4):
    (x1, y1), (x2, y2), (x3, y3), (x4, y4) = p1, p2, p3, p4
    d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    num = (x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)
    t = num / d if isinstance(d, float) or isinstance(num, float) else Fr(num) / Fr(d)
    return (x1 + t * (x2 - x1), y1 + t * (y2 - y1))

def fmt(v):
    v = Fr(v)
    assert v.denominator == 1, v
    return str(v.numerator)

OUT = {}

# 1) 네 정사각형과 대각선: 칸마다 (정사각형 높이 - 선 높이)를 적분
def stairs(s):
    S = sum(s); tot = Fr(0); x = Fr(0)
    line = lambda X: Fr(s[0]) - Fr(s[0], S) * X
    for v in s:
        assert line(x) <= v and line(x + v) <= v  # 선이 각 정사각형 윗변 아래를 지남
        tot += v * v - (line(x) + line(x + v)) / 2 * v
        x += v
    assert all(s[i] > s[i + 1] for i in range(3))
    return tot
OUT['5-1-u6-t5-7'] = [fmt(stairs(s)) + ' cm²' for s in ([4, 3, 2, 1], [5, 4, 3, 2], [6, 5, 4, 3])]

# 2,3) 정사각형 종이 위 색종이: (u,v) 좌표에서 나, 다 다각형 넓이
def m3(O, I):
    T, L, Pp, Q, L2, R = (I, I), (0, I), (O, O), (O, 0), (0, O), (I, 0)
    X = (I, O - I)  # 라: R에서 직각, RQ = RX (이등변)
    assert O - I <= I
    na = shoelace([L, L2, Pp, T]); da = shoelace([T, Pp, Q, X]); ra = shoelace([R, Q, X])
    assert na + da + ra + I * I == O * O  # 네 조각이 종이 전체를 채움
    return na, da
V3 = [(30, 24), (26, 20), (32, 24)]
OUT['5-1-u6-t5-8'] = [fmt(m3(*p)[0]) + ' cm²' for p in V3]
OUT['5-1-u6-t5-9'] = [fmt(m3(*p)[1]) + ' cm²' for p in V3]

# 4) 평행사변형 + 마름모: 마름모 넓이와 반대각선으로 높이를 찾고 오각형 좌표 넓이 계산
def m4(a, h, R):
    sols = []
    for H2 in range(1, 200):  # 대각선 ㄹㅁ의 길이(정수) 전수 탐색
        if Fr(H2 * 2 * h, 2) == R: sols.append(H2)
    assert len(sols) == 1
    H = Fr(sols[0], 2)
    di, ni, ri, gi, bi, mi = (0, 0), (-a, 0), (h, H), (h - a, H), (2 * h, 0), (h, -H)
    side = lambda p, q: (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2
    assert side(ri, di) == side(di, mi) == side(mi, bi) == side(bi, ri)  # 마름모
    assert shoelace([ri, di, mi, bi]) == R
    return shoelace([gi, ni, mi, bi, ri])
OUT['5-1-u6-t5-10'] = [fmt(m4(*p)) + ' cm²' for p in [(12, 3, 36), (10, 4, 64), (16, 4, 48)]]

# 5) 같은 간격 점과 두 선: 여러 가로·세로 비율에서 사다리꼴 넓이가 같은지 확인
def m5(A):
    vals = set()
    for W in (Fr(8), Fr(12), Fr(20), Fr(30), Fr(48)):
        H = Fr(A) / W; c = W / 4
        yr = lambda x: H * x / (3 * c); ym = lambda x: H * x / (4 * c)
        quad = [(2 * c, yr(2 * c)), (3 * c, yr(3 * c)), (3 * c, ym(3 * c)), (2 * c, ym(2 * c))]
        vals.add(shoelace(quad))
    assert len(vals) == 1
    return vals.pop()
OUT['5-1-u6-t5-11'] = [fmt(m5(A)) + ' cm²' for A in (480, 384, 672)]

# 6) 정사각형의 연장선: 정사각형 한 변을 바꿔도 넓이 합이 같은지 확인
def m6s(a):
    vals = set()
    for s in [Fr(k, 3) for k in range(3, 3 * a)]:
        n0, r0, S0, O0 = (0, 0), (s, s), (0, a), (s + a, s)
        J = inter(n0, r0, S0, O0)
        assert J[0] > s  # ㄹ이 ㄴ과 ㅈ 사이
        vals.add(shoelace([n0, S0, J]) + shoelace([O0, J, r0]))
    assert len(vals) == 1
    return vals.pop()
OUT['5-1-u6-t5-12'] = [fmt(m6s(a)) + ' cm²' for a in (24, 20, 18)]

# 7) 개념탐구 6: 1 cm 격자에서 잘라 낸 칸을 세고, 가로 길이를 전수 탐색
def cut_area(W, H, p, c, m, q, w=3, t=4):
    pieces = set()
    for x in range(W):
        for y in range(H):
            X, Y = x + 0.5, y + 0.5
            inA = X < p and Y < t
            inB = (p + w < X < W and Y < t) or (c + w < X < W and t < Y < m)
            inC = (X < c and t + w < Y) or (c < X < q and m + w < Y)
            inD = q + w < X and m + w < Y
            if inA or inB or inC or inD: pieces.add((x, y))
    return W * H - len(pieces)
def e6x(H, A, p, c, m, q):
    sols = [W for W in range(q + 4, 120) if cut_area(W, H, p, c, m, q) == A]
    assert len(sols) == 1
    W = sols[0]
    return W * H - A
OUT['5-1-u6-t6'] = [fmt(e6x(*v)) + ' cm²' for v in [(35, 216, 10, 17, 17, 29), (30, 189, 9, 15, 14, 26), (40, 246, 11, 19, 19, 33)]]

# 8) 예제 6-1: 두 색칠 부분 넓이가 같아지는 가로 길이 전수 탐색
def e61(a, u, d):
    H = u + d; sols = []
    for W in range(a + 1, 300):
        n0, d0, g0, Pp, Q = (0, 0), (W, 0), (0, H), (0, d), (a, H)
        X = inter(Pp, d0, n0, Q)
        if shoelace([g0, Q, X, Pp]) == shoelace([n0, X, d0]): sols.append(W)
    assert len(sols) == 1
    return sols[0]
OUT['5-1-u6-t6-2'] = [fmt(e61(*v)) + ' cm' for v in [(20, 12, 15), (18, 10, 12), (24, 14, 16)]]

# 9) 예제 6-2: 큰 정사각형의 크기를 바꿔도 가운데 정사각형 넓이가 같은지 확인
def e62(a):
    vals = set()
    for S in [2 * a + k for k in range(1, 3 * a)]:
        T, L, B, R = (S - a, S), (0, S - a), (a, 0), (S, a)
        dT, dL, dB, dR = (T[0] - 1, T[1] - 1), (L[0] + 1, L[1] - 1), (B[0] + 1, B[1] + 1), (R[0] - 1, R[1] + 1)  # 45° 방향
        VL = inter(T, dT, L, dL); VB = inter(L, dL, B, dB); VR = inter(B, dB, R, dR); VT = inter(R, dR, T, dT)
        vals.add(shoelace([VT, VR, VB, VL]))
    assert len(vals) == 1
    return vals.pop()
OUT['5-1-u6-t6-3'] = [fmt(e62(a)) + ' cm²' for a in (12, 10, 14)]

# 10) 예제 6-3: 꼭짓점과 이등분점을 이은 선의 교점으로 가운데 정사각형 넓이
def e63(n):
    n = Fr(n); h = n / 2
    L1 = ((0, n), (n, h)); L2 = ((0, h), (n, 0)); L3 = ((0, 0), (h, n)); L4 = ((h, 0), (n, n))
    c = [inter(*L1, *L3), inter(*L1, *L4), inter(*L2, *L4), inter(*L2, *L3)]
    return shoelace(c)
OUT['5-1-u6-t6-4'] = [fmt(e63(n)) + ' cm²' for n in (10, 15, 20)]

# 11) 예제 6-4: 그림 좌표에서 세 넓이가 맞는지, 겹친 사각형 넓이가 얼마인지 확인
def e64(tl, top, left, W, H, e, f):
    n0, d0, r0, g0, E, F = (0, 0), (W, 0), (W, H), (0, H), (0, e), (f, H)
    m0 = inter(E, r0, n0, F); b0 = inter(E, d0, n0, F); s0 = inter(E, r0, F, d0)
    got = (shoelace([g0, F, m0, E]), shoelace([F, r0, s0]), shoelace([E, b0, n0]))
    assert all(abs(g - v) < 2e-3 for g, v in zip(got, (tl, top, left))), got
    mid = shoelace([m0, b0, d0, s0])
    ans = round(mid); assert abs(mid - ans) < 5e-3 and ans == tl + top + left
    return ans
OUT['5-1-u6-t6-5'] = [fmt(e64(*v)) + ' cm²' for v in [(38, 8, 26, 24.6568, 11.7413, 7.7354, 14.0283), (30, 6, 20, 21.6422, 10.3058, 6.7391, 12.5070), (45, 10, 28, 26.3792, 12.5615, 8.0510, 14.7387)]]

# 12) Mission 1 공원: 0.25 m 격자 표본으로 잔디 넓이를 세어 정확한 넓이와 대조
def n1(P, w, m):
    c1 = Fr(P - w, 2); c2 = Fr(P + w, 2); k = c1 - m
    def white(X, Y):
        if c1 < X < c2 or c1 < Y < c2: return True
        # 흰 삼각형 4개(작은 정사각형의 바깥쪽 반)
        if m < X < m + k and c2 < Y < c2 + k and (Y - c2) > (X - m): return True
        if c2 < X < c2 + k and c2 < Y < c2 + k and (Y - c2) > (c2 + k - X): return True
        if m < X < m + k and m < Y < m + k and (Y - m) < (m + k - X): return True
        if c2 < X < c2 + k and m < Y < m + k and (Y - m) < (X - c2): return True
        return False
    exact = P * P - (2 * w * P - w * w) - 4 * k * k / 2
    st = Fr(1, 4); N = int(P / st); cnt = 0
    for i in range(N):
        for j in range(N):
            if not white((i + Fr(1, 2)) * st, (j + Fr(1, 2)) * st): cnt += 1
    assert abs(cnt * st * st - exact) <= Fr(N, 16) * 4 * st  # 대각선 위 칸만 차이
    return exact
OUT['5-1-u6-t6-6'] = [fmt(n1(*v)) + ' m²' for v in [(23, 3, 5), (26, 2, 6), (19, 3, 4)]]

# 13) Mission 2 정원: 1 m 격자에서 길의 칸을 세고, 정원 가로를 전수 탐색
def path_area(W, H, s, L, t, a, c, tau, g, w=2):
    cnt = 0
    for x in range(W):
        for y in range(H):
            X, Y = x + 0.5, y + 0.5
            p1 = X < a and Y < t
            p2 = (a + w < X < g and Y < t) or (c + w < X < g and t < Y < s) or (c + w < X < c + w + tau and s < Y < s + L)
            p3 = g + w < X and Y < s
            p4 = (X < c and t + w < Y) or (X < c + w + tau and s + L + w < Y)
            p5 = c + 2 * w + tau < X and s + w < Y
            if not (p1 or p2 or p3 or p4 or p5): cnt += 1
    return cnt
def n2(H, A, s, L, t, a, c, tau, g):
    sols = [W for W in range(g + 3, 120) if path_area(W, H, s, L, t, a, c, tau, g) == A]
    assert len(sols) == 1
    return sols[0] * H - A
OUT['5-1-u6-t6-7'] = [fmt(n2(*v)) + ' m²' for v in [(20, 126, 5, 4, 2, 3, 10, 2, 26), (18, 106, 4, 3, 2, 3, 8, 2, 21), (24, 144, 6, 4, 2, 4, 11, 2, 29)]]

# 14) Mission 3: 45° 사선으로 잘라 낸 정사각형의 둘레 좌표 넓이
def n3(k):
    k = Fr(k); n = 4 * k; d = k / 2
    pts = [(0, 0), (k, 0), (Fr(3, 2) * k, d), (Fr(5, 2) * k, d), (3 * k, 0), (n, 0), (n, k), (n - d, Fr(3, 2) * k), (n - d, Fr(5, 2) * k), (n, 3 * k), (n, n),
           (3 * k, n), (Fr(5, 2) * k, n - d), (Fr(3, 2) * k, n - d), (k, n), (0, n), (0, 3 * k), (d, Fr(5, 2) * k), (d, Fr(3, 2) * k), (0, k)]
    assert (Fr(3, 2) * k - k) == d  # 45°: 가로로 간 길이 = 깊이
    return shoelace(pts)
OUT['5-1-u6-t6-8'] = [fmt(n3(k)) + ' cm²' for k in (3, 4, 5)]

# 15) Mission 4: 정사각형에서 직각이등변삼각형 4개를 뺌
def n4(n, m):
    n = Fr(n); h = n - 2 * m
    tris = [[(m, 0), (n - m, 0), (n / 2, h / 2)], [(n, m), (n, n - m), (n - h / 2, n / 2)], [(n - m, n), (m, n), (n / 2, n - h / 2)], [(0, n - m), (0, m), (h / 2, n / 2)]]
    for t in tris:
        a, b, c = t
        assert (a[0] - c[0]) * (b[0] - c[0]) + (a[1] - c[1]) * (b[1] - c[1]) == 0  # 꼭짓점이 직각
    return n * n - sum(shoelace(t) for t in tris)
OUT['5-1-u6-t6-9'] = [fmt(n4(*v)) + ' cm²' for v in [(17, 4), (20, 5), (16, 3)]]

# 16) Mission 5: ㄱㄴ² = 한 변² + (두 변)² = 5 × 한 변²
def n5(L):
    u2 = Fr(L * L, 5)
    assert u2 + 4 * u2 == L * L
    return 5 * u2
OUT['5-1-u6-t6-10'] = [fmt(n5(L)) + ' cm²' for L in (7, 9, 10)]

# 17) Mission 6: 그림 좌표에서 세 넓이 확인, 겹친 사각형 넓이
def n6(a15, a34, a47, W, H, f, e):
    B, C, D, A, F, E = (0, 0), (W, 0), (W, H), (0, H), (0, f), (e, H)
    X = inter(B, E, F, D); Y = inter(E, C, F, D); Z = inter(B, E, F, C)
    got = (shoelace([A, E, X, F]), shoelace([E, D, Y]), shoelace([F, B, Z]))
    assert all(abs(g - v) < 2e-3 for g, v in zip(got, (a47, a34, a15))), got
    mid = shoelace([X, Y, C, Z]); ans = round(mid)
    assert abs(mid - ans) < 5e-3 and ans == a15 + a34 + a47
    return ans
OUT['5-1-u6-t6-11'] = [fmt(n6(*v)) + ' cm²' for v in [(15, 34, 47, 29.3577, 13.9798, 7.1000, 9.7186), (12, 30, 40, 27.0887, 12.8994, 6.3963, 8.7836), (18, 36, 52, 30.9256, 14.7265, 7.7127, 10.4964)]]

print('AUDIT ' + json.dumps(OUT, ensure_ascii=False))
