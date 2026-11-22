# 4-2-a 원문 유형(삼각형·꺾은선그래프·다각형) 독립 검산. 표준 라이브러리만 사용합니다.
# 각 변형의 매개변수에서 답을 다시 계산하고(전수 탐색·좌표 계산), 마지막 줄에 AUDIT JSON을 출력합니다.
import json, math
from fractions import Fraction as F
from itertools import combinations
OUT = {}
def ok(c, msg):
    if not c: raise SystemExit('FAIL: ' + msg)

# ---------------- 공통: 선분 그래프 삼각형 전수 ----------------
def seg_inter(s, t):
    (x1, y1), (x2, y2) = s; (x3, y3), (x4, y4) = t
    d = (x2-x1)*(y4-y3)-(y2-y1)*(x4-x3)
    if d == 0: return None
    u = ((x3-x1)*(y4-y3)-(y3-y1)*(x4-x3))/d; v = ((x3-x1)*(y2-y1)-(y3-y1)*(x2-x1))/d
    if 0 <= u <= 1 and 0 <= v <= 1: return (x1+u*(x2-x1), y1+u*(y2-y1))
def on_seg(p, s):
    (x1, y1), (x2, y2) = s; x, y = p
    return (x2-x1)*(y-y1)-(y2-y1)*(x-x1) == 0 and min(x1, x2) <= x <= max(x1, x2) and min(y1, y2) <= y <= max(y1, y2)
def triangles(segs):
    segs = [tuple((F(a), F(b)) for a, b in s) for s in segs]
    pts = set(p for s in segs for p in s)
    for s, t in combinations(segs, 2):
        p = seg_inter(s, t)
        if p: pts.add(p)
    pts = list(pts)
    conn = lambda p, q: any(on_seg(p, s) and on_seg(q, s) for s in segs)
    out = []
    for a, b, c in combinations(pts, 3):
        if (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]) == 0: continue
        if conn(a, b) and conn(b, c) and conn(a, c): out.append((a, b, c))
    return out

# 1. 4-2-u2-t1-11 예제 1-4
r = []
for ba, ac in [([3, 6], [F(1, 4), F(1, 2)]), ([3, 5, 7], [F(1, 4), F(1, 2)]), ([3, 6], [F(1, 5), F(2, 5), F(3, 5)])]:
    A, B, C = (3, 10), (0, 0), (10, 0)
    segs = [(A, B), (B, C), (C, A)] + [(A, (x, 0)) for x in ba] + [(B, (3+7*t, 10-10*t)) for t in ac]
    n = len(triangles(segs)); a, b = len(ba), len(ac)
    ok(n == (a+2)*(a+1)//2*(b+1)+(b+2)*(b+1)//2*(a+1)-(a+1)*(b+1), 'ex14 formula')
    r.append(f'{n}개')
OUT['4-2-u2-t1-11'] = r

# 2. 4-2-u2-t2 Mission 2-1 : 사각형을 n개의 삼각형으로 → 둔각삼각형 수
def obtuse_count(tris):
    c = 0
    for t in tris:
        for i in range(3):
            p, q, s = t[i], t[(i+1) % 3], t[(i+2) % 3]
            if (q[0]-p[0])*(s[0]-p[0])+(q[1]-p[1])*(s[1]-p[1]) < 0: c += 1; break
    return c
def tarea(t):
    a, b, c = t; return abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))/2
def bound(n):
    k = (180*n-360)//180   # 새 점에 모이는 각 = 180°×k
    return 3*(k//2)+k % 2
A, B, C, D, O = (0, 0), (4, 0), (4, 4), (0, 4), (2, 2)
E1, E2, P1 = (1, 3), (3, 1), (1, 1)
sq4 = {0: [(A, B, O), (B, C, O), (C, D, O), (D, A, O)], 1: [(A, B, O), (A, O, D), (C, B, E2), (C, E2, D)],
       2: [(A, B, E1), (A, E1, D), (C, B, E2), (C, E2, D)], 3: [(P1, A, B), (P1, B, D), (P1, D, A), (B, C, D)]}
M2, Mp, Fp = (2, 0), (1, 0), (1, 0)
sq5 = {0: [(A, M2, O), (M2, B, O), (B, C, O), (C, D, O), (D, A, O)],
       1: [(A, Mp, O), (Mp, B, O), (B, C, O), (C, D, O), (D, A, O)],
       2: [(A, Fp, E1), (Fp, B, E1), (A, E1, D), (C, B, E2), (C, E2, D)],
       3: [(P1, A, B), (P1, B, D), (P1, D, A), (B, C, O), (C, D, O)],
       4: [(P1, A, B), (P1, B, D), (P1, D, A), (C, B, E2), (C, E2, D)]}
RA, RB, RC, RD = (F(0), F(0)), (F(6), F(0)), (F(6), F(4)), (F(0), F(4))
H = (F(24, 13), F(36, 13)); RE = (F(9, 2), F(1)); REp = (F(3, 2), F(3)); RP = (F(3, 2), F(1)); RM, RN = (F(3), F(4)), (F(3), F(0))
rc4 = {0: [(RA, RD, RM), (RB, RC, RM), (RA, RN, RM), (RN, RB, RM)], 1: [(RA, RB, H), (RA, H, RD), (RC, RB, RE), (RC, RE, RD)],
       2: [(RA, RB, REp), (RA, REp, RD), (RC, RB, RE), (RC, RE, RD)], 3: [(RP, RA, RB), (RP, RB, RD), (RP, RD, RA), (RB, RC, RD)]}
CIRC = '①②③④⑤⑥⑦'
r = []
for cons, n, tot in [(sq4, 4, 16), (sq5, 5, 16), (rc4, 4, 24)]:
    ok(bound(n) < n, 'm21 bound')
    for k in range(n):
        ok(len(cons[k]) == n and sum(tarea(t) for t in cons[k]) == tot and obtuse_count(cons[k]) == k, f'm21 cons {n} {k}')
    r.append(f'{CIRC[n]} {n}개')
OUT['4-2-u2-t2'] = r

# 3. 4-2-u2-t2-6 Mission 2-6 : 5×5 점판, 선분 ㄱㄴ을 한 변으로 하는 직각삼각형
r = []
for a, b in [((2, 4), (4, 3)), ((1, 4), (4, 3)), ((1, 4), (3, 3))]:
    c = 0
    for x in range(5):
        for y in range(5):
            p = (x, y)
            if p in (a, b): continue
            u, v, w = (a[0]-x, a[1]-y), (b[0]-x, b[1]-y), (b[0]-a[0], b[1]-a[1])
            if u[0]*v[1]-u[1]*v[0] == 0: continue
            d = lambda s, t: s[0]*t[0]+s[1]*t[1]
            if d(u, v) == 0 or d(u, w) == 0 or d(v, w) == 0: c += 1
    r.append(f'{c}개')
OUT['4-2-u2-t2-6'] = r

# 4. 4-2-u2-t2-8 예제 2-1 : 정답 예시 구성의 둔각삼각형 수 확인(실수 좌표)
R3 = math.sqrt(3); EA, EB, EC = (3, 3*R3), (0, 0), (6, 0)
def foot(p, a, b):
    dx, dy = b[0]-a[0], b[1]-a[1]; t = ((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy); return (a[0]+t*dx, a[1]+t*dy)
def ons(a, b, t): return (a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t)
def inc(a, b, c):
    la, lb, lc = math.dist(b, c), math.dist(a, c), math.dist(a, b); s = la+lb+lc
    return ((la*a[0]+lb*b[0]+lc*c[0])/s, (la*a[1]+lb*b[1]+lc*c[1])/s)
def cons21(kind):
    A_, B_, C_ = EA, EB, EC
    if kind == '3-0': D_ = (4, 0); E_ = foot(D_, A_, C_); return [(A_, B_, D_), (A_, D_, E_), (D_, E_, C_)]
    if kind == '3-1': D_ = (2, 0); E_ = foot(D_, A_, C_); return [(A_, B_, D_), (A_, D_, E_), (D_, E_, C_)]
    if kind == '3-2': D_ = (2, 0); E_ = ons(A_, C_, .75); return [(A_, B_, D_), (A_, D_, E_), (D_, E_, C_)]
    if kind == '3-3': P_ = (3, R3); return [(A_, B_, P_), (B_, C_, P_), (C_, A_, P_)]
    if kind == '4-0': m1, m2, m3 = ons(A_, B_, .5), ons(B_, C_, .5), ons(C_, A_, .5); return [(A_, m1, m3), (m1, B_, m2), (m3, m2, C_), (m1, m2, m3)]
    if kind == '4-1': D_ = (3, 0); E_ = foot(D_, A_, B_); G_ = ons(A_, C_, .5); return [(A_, E_, D_), (E_, B_, D_), (A_, D_, G_), (G_, D_, C_)]
    if kind == '4-2': D_ = (3, 0); E_ = ons(A_, B_, .5); G_ = ons(A_, C_, .5); return [(A_, E_, D_), (E_, B_, D_), (A_, D_, G_), (G_, D_, C_)]
    if kind in ('4-3', '4-4'):
        E_ = (2, 0) if kind == '4-3' else (4, 0); I_ = inc(A_, B_, E_); return [(A_, B_, I_), (B_, E_, I_), (E_, A_, I_), (A_, E_, C_)]
def obt_f(tris):
    c = 0
    for t in tris:
        if any((t[(i+1) % 3][0]-t[i][0])*(t[(i+2) % 3][0]-t[i][0])+(t[(i+1) % 3][1]-t[i][1])*(t[(i+2) % 3][1]-t[i][1]) < -1e-9 for i in range(3)): c += 1
    return c
full = 9*R3
r = []
for n, want in [(3, [1, 2, 3]), (4, [1, 2, 3]), (4, [2, 3, 4])]:
    ok(obt_f(cons21(f'{n}-0')) == 0, 'ex21 base')
    for w in want:
        t = cons21(f'{n}-{w}')
        ok(len(t) == n and abs(sum(tarea(x) for x in t)-full) < 1e-9 and obt_f(t) == w, f'ex21 {n}-{w}')
    r.append('정답 예시 그림 참고(둔각삼각형 수가 '+', '.join(f'{w}개' for w in want)+'가 되면 정답)')
OUT['4-2-u2-t2-8'] = r

# 5. 4-2-u2-t2-10 예제 2-3 : 직각삼각형(직각 표시 위치만 직각인지 함께 확인)
r = []
for hs, ps, qs in [([8, 4], [9], [8, 4]), ([8, 4], [7, 10], [8, 4]), ([9, 6, 3], [9], [9, 6, 3])]:
    Ap, Lp, Rp, Hp = (F(4), F(12)), (F(0), F(0)), (F(12), F(0)), (F(4), F(0))
    side = lambda P, Q, y: (P[0]+(Q[0]-P[0])*(F(y)-P[1])/(Q[1]-P[1]), F(y))
    segs = [(Ap, Lp), (Lp, Rp), (Rp, Ap), (Ap, Hp)]; ends = {}
    for y in hs: segs.append((side(Ap, Lp, y), side(Ap, Rp, y))); ends[y] = side(Ap, Rp, y)
    segs += [(Ap, (F(x), F(0))) for x in ps] + [(Hp, ends[y]) for y in qs]
    marks = {(F(4), F(y)) for y in hs} | {Hp}
    tot = 0
    for t in triangles(segs):
        for i in range(3):
            p, q, s = t[i], t[(i+1) % 3], t[(i+2) % 3]
            if (q[0]-p[0])*(s[0]-p[0])+(q[1]-p[1])*(s[1]-p[1]) == 0:
                ok(p in marks, 'ex23 unmarked right angle'); tot += 1
    r.append(f'{tot}개')
OUT['4-2-u2-t2-10'] = r

# 각도 도구
def ang(P, V, Q):
    a = math.atan2(P[1]-V[1], P[0]-V[0]); b = math.atan2(Q[1]-V[1], Q[0]-V[0]); d = abs(math.degrees(a-b)) % 360
    return min(d, 360-d)
def rotp(p, deg):
    a = math.radians(deg); return (p[0]*math.cos(a)-p[1]*math.sin(a), p[0]*math.sin(a)+p[1]*math.cos(a))
def xline(p1, p2, p3, p4):
    x1, y1 = p1; x2, y2 = p2; x3, y3 = p3; x4, y4 = p4
    d = (x2-x1)*(y4-y3)-(y2-y1)*(x4-x3); u = ((x3-x1)*(y4-y3)-(y3-y1)*(x4-x3))/d
    return (x1+u*(x2-x1), y1+u*(y2-y1))
def degstr(v):
    ok(abs(v-round(v)) < 1e-6, 'non-integer angle'); return f'{round(v)}°'

# 6. 4-2-u2-t3-2 Mission 3-2 : 좌표로 만든 뒤 각 ㄱㄴㄷ 측정
r = []
for c in [20, 16, 24]:
    Bp = (0, 0); Dp = (1, 0); Mp_ = (-1, 0)
    # ㄱ: ㅂㄱ=1, 각 ㄱㄷㅂ=c 가 되도록 원 위의 점을 탐색
    best = None
    for k in range(1, 180000):
        t = k/1000.0; G = (math.cos(math.radians(t)), math.sin(math.radians(t)))
        e = abs(ang(G, Dp, Bp)-c)
        if best is None or e < best[0]: best = (e, G)
    G = best[1]; N = (Mp_[0]-math.dist(Mp_, G), 0)
    r.append(degstr(round(ang(G, N, Dp), 2)))
OUT['4-2-u2-t3-2'] = r

# 7. 4-2-u2-t3-4 Mission 3-4 : 밑각을 탐색해 회전한 ㄱ이 변 ㄱㄷ 위에 오는 경우를 찾고 ㉠ 측정
r = []
for rr in [40, 20, 44]:
    best = None
    for k in range(1, 9000):
        be = k/100.0
        G = (math.cos(math.radians(be)), math.sin(math.radians(be))); D = (2*math.cos(math.radians(be)), 0)
        R = rotp(G, -rr)
        e = abs(math.dist(G, R)+math.dist(R, D)-math.dist(G, D))
        if best is None or e < best[0]: best = (e, be, G, D, R)
    _, be, G, D, R = best; Bb = rotp(D, -rr); M = xline(R, Bb, (0, 0), D)
    r.append(degstr(round(ang((0, 0), M, Bb), 1)))
OUT['4-2-u2-t3-4'] = r

# 8. 4-2-u2-t3-5 Mission 3-5 : 밑각 C를 탐색해 접은 그림의 두 각(a, b)이 나오는 경우를 찾고, ㄱ을 ㅁ으로 접은 각 측정
r = []
for a, b in [(60, 70), (80, 75), (64, 70)]:
    found = None
    for k in range(200, 8900):
        C = k/100.0; W = 10.0; N = (0, 0); D = (W, 0); G = (W/2, W/2*math.tan(math.radians(C)))
        for o10 in range(1, 100):
            o = W/2 + (W/2)*o10/100.0; O = (o, 0)
            # 접는 선 ㅇㅈ : ∠ㅈㅇㄷ = θ ; ㄷ의 대칭점 ㅅ
            th = (180-a)/2.0
            J = xline(O, (o+math.cos(math.radians(th)), math.sin(math.radians(th))), D, G)
            if not (min(G[0], D[0]) <= J[0] <= max(G[0], D[0])): continue
            ux, uy = J[0]-o, J[1]; t = ((D[0]-o)*ux+D[1]*uy)/(ux*ux+uy*uy); Fp = (o+t*ux, t*uy); S = (2*Fp[0]-D[0], 2*Fp[1]-D[1])
            if abs(ang(S, O, N)-a) < 1e-6 and abs(ang(S, J, O)-b) < 0.01:
                found = C; break
        if found: break
    ok(found is not None, 'm35 search')
    C = found; G = (5, 5*math.tan(math.radians(C))); Rr = (G[0]/2, G[1]/2); Bp = ((G[0]+10)/2, G[1]/2); M = (5, 0)
    r.append(degstr(round(ang(Rr, M, Bp), 1)))
OUT['4-2-u2-t3-5'] = r

# 9. 4-2-u2-t3-8 예제 3-1 : 점판의 서로 다른 이등변삼각형(세 변의 길이로 합동 판정)
r = []
for w, h in [(4, 4), (4, 3), (5, 3)]:
    pts = [(x, y) for x in range(w) for y in range(h)]; S = set()
    for p, q, s in combinations(pts, 3):
        if (q[0]-p[0])*(s[1]-p[1])-(q[1]-p[1])*(s[0]-p[0]) == 0: continue
        d = sorted([(p[0]-q[0])**2+(p[1]-q[1])**2, (q[0]-s[0])**2+(q[1]-s[1])**2, (p[0]-s[0])**2+(p[1]-s[1])**2])
        if d[0] == d[1] or d[1] == d[2]: S.add(tuple(d))
    r.append(f'{len(S)}개')
OUT['4-2-u2-t3-8'] = r

# 10. 4-2-u2-t3-10 예제 3-3 : ㅂ의 각 x를 탐색해 같은 길이 다섯 선분으로 만든 그림의 ∠ㄱ이 g가 되는 x
r = []
for g in [40, 50, 36]:
    best = None
    for k in range(100, 2999):
        x = k/100.0; u = (-math.cos(math.radians(x)), math.sin(math.radians(x)))
        Rr = (-2*math.cos(math.radians(x)), 0)
        uR = u[0]*Rr[0]; disc = uR*uR-(Rr[0]**2-1)
        if disc < 0: continue
        t = uR+math.sqrt(disc); Dd = (u[0]*t, u[1]*t)
        if Dd[1] >= 1: continue
        N = (Dd[0]-math.sqrt(1-Dd[1]**2), 0); G = (u[0]*(t+1), u[1]*(t+1))
        e = abs(ang(Dd, G, N)-g)
        if best is None or e < best[0]: best = (e, x)
    ok(best[0] < 1e-6, 'ex33'); r.append(degstr(best[1]))
OUT['4-2-u2-t3-10'] = r

# 11. 4-2-u2-t3-11 예제 3-4 : 밑각 탐색 → 접은 뒤 ∠ㅂㄱㄷ=g 이고 ㄱㄹ=ㄹㅂ 인 경우의 ∠ㄱㄹㅂ
r = []
for g in [40, 20, 48]:
    best = None
    for k in range(100, 4499):
        x = k/100.0; W = 10.0; N = (0, 0); D = (W, 0); G = (W/2, W/2*math.tan(math.radians(x)))
        d = (math.dist(N, G)/2)/math.cos(math.radians(x)); R = (d, 0)   # ㄹㄱ=ㄹㄴ (접은 뒤 ㄹㅂ=ㄹㄴ=ㄱㄹ)
        vx, vy = R[0]-G[0], R[1]-G[1]; t = ((N[0]-G[0])*vx+(N[1]-G[1])*vy)/(vx*vx+vy*vy); Fp = (G[0]+t*vx, G[1]+t*vy)
        Bb = (2*Fp[0]-N[0], 2*Fp[1]-N[1])
        e = abs(ang(Bb, G, D)-g)
        if best is None or e < best[0]: best = (e, G, R, Bb)
    ok(best[0] < 1e-6, 'ex34'); _, G, R, Bb = best
    ok(abs(math.dist(G, R)-math.dist(R, Bb)) < 1e-9, 'ex34 len')
    r.append(degstr(round(ang(G, R, Bb), 4)))
OUT['4-2-u2-t3-11'] = r

# 12. 4-2-u5-t2 : 학년별 키(매달 같은 만큼 자람)
def dec(v):
    v = F(v)
    if v.denominator == 1: return str(v.numerator)
    s = ('%.4f' % float(v)).rstrip('0'); ok(F(s) == v, 'dec'); return s
r = []
for vals, asks in [([124, 127, 131, 133, 137, 138], [(1, 4), (5, 9)]), ([123, 126, 129, 133, 136, 139], [(2, 6), (4, 9)]), ([122, 126, 129, 133, 135, 138], [(3, 6), (5, 6)])]:
    hs = []
    for gr, mo in asks:
        month = [F(vals[gr-1]) + F(vals[gr]-vals[gr-1])*m/12 for m in range(13)]
        hs.append(month[mo-3])
    r.append(f'약 {dec(hs[0])} cm, 약 {dec(hs[1])} cm')
OUT['4-2-u5-t2'] = r

# 13. 4-2-u5-t2-5 : 두 물통(분 단위로 차례로 검사)
r = []
for T, Hh, d, h0 in [(60, 90, 30, 75), (40, 80, 20, 70), (60, 150, 30, 120)]:
    ga = lambda t: F(Hh, T)*t
    na = lambda t: F(h0) if t <= d else F(h0)+F(Hh-h0, T-d)*(t-d)
    ans = next(t for t in range(0, 100000) if ga(t) == 2*na(t))
    r.append(f'{ans}분 후')
OUT['4-2-u5-t2-5'] = r

# ---------------- 모눈 자르기 공통 ----------------
def norm(cells):
    mx = min(x for x, y in cells); my = min(y for x, y in cells); return frozenset((x-mx, y-my) for x, y in cells)
def orients(cells):
    out = set()
    for k in range(8):
        pts = []
        for x, y in cells:
            for _ in range(k % 4): x, y = -y, x
            if k >= 4: x = -x
            pts.append((x, y))
        out.add(norm(pts))
    return out
def can_square(A, B, S):
    sq = {(x, y) for x in range(S) for y in range(S)}; Bo = orients(B)
    for o in orients(A):
        w = max(x for x, y in o)+1; h = max(y for x, y in o)+1
        for dx in range(S-w+1):
            for dy in range(S-h+1):
                pl = {(x+dx, y+dy) for x, y in o}
                if pl <= sq and norm(sq-pl) in Bo: return True
    return False
def comps(cells, cut):
    cells = set(cells); seen = set(); res = []
    for c in cells:
        if c in seen: continue
        st = [c]; comp = {c}; seen.add(c)
        while st:
            x, y = st.pop()
            for nb in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
                if nb in cells and nb not in seen and frozenset(((x, y), nb)) not in cut:
                    seen.add(nb); comp.add(nb); st.append(nb)
        res.append(comp)
    return res
def edge_cells(v, w):
    (x1, y1), (x2, y2) = v, w
    if y1 == y2: x = min(x1, x2); return ((x, y1-1), (x, y1))
    y = min(y1, y2); return ((x1-1, y), (x1, y))
def all_cuts(cells, S, congruent):
    cells = set(cells); verts = set()
    for x, y in cells: verts |= {(x, y), (x+1, y), (x, y+1), (x+1, y+1)}
    inner = lambda v, w: all(c in cells for c in edge_cells(v, w))
    bnd = lambda v: any(c not in cells for c in [(v[0]-1, v[1]-1), (v[0], v[1]-1), (v[0]-1, v[1]), v])
    sols = []
    def check(path):
        cut = {frozenset(edge_cells(v, w)) for v, w in zip(path, path[1:])}
        cs = comps(cells, cut)
        if len(cs) != 2: return
        A_, B_ = cs
        if congruent and (len(A_) != len(B_) or norm(B_) not in orients(A_)): return
        if can_square(A_, B_, S): sols.append(path)
    for s in verts:
        if not bnd(s): continue
        def dfs(v, path, used):
            for w in ((v[0]+1, v[1]), (v[0]-1, v[1]), (v[0], v[1]+1), (v[0], v[1]-1)):
                if w in used or w not in verts or not inner(v, w): continue
                if bnd(w):
                    if w > s: check(path+[w])
                    continue
                used.add(w); dfs(w, path+[w], used); used.discard(w)
        dfs(s, [s], {s})
    return sols
def stair_ok(m, a, b, rot):
    W, H = (m+1)*a, m*b; S = m*a; cells = [(x, y) for x in range(W) for y in range(H)]
    path = [(a, H)]; x, y = a, H
    for i in range(m):
        for _ in range(b): y -= 1; path.append((x, y))
        if i < m-1:
            for _ in range(a): x += 1; path.append((x, y))
    if rot: cells = [(q, p) for p, q in cells]; path = [(q, p) for p, q in path]
    cut = {frozenset(edge_cells(v, w)) for v, w in zip(path, path[1:])}
    cs = comps(cells, cut)
    return len(cs) == 2 and len(cs[0]) == len(cs[1]) and norm(cs[1]) in orients(cs[0]) and can_square(cs[0], cs[1], S), cells, S

# 14. 4-2-u6-t4 개념탐구 4 : 9×4(전수: 계단과 그 대칭 2가지), 4×9(같음), 18×8(계단 자르기 확인)
r = []
for (m, a, b, rot), enum in [((2, 3, 2, False), True), ((2, 3, 2, True), True), ((2, 6, 4, False), False)]:
    good, cells, S = stair_ok(m, a, b, rot); ok(good, 'stair')
    if enum: ok(len(all_cuts(cells, S, True)) == 2, 'explore enum')
    r.append('정답 예시 그림 참고(계단 모양으로 잘라 붙임)')
OUT['4-2-u6-t4'] = r

# 15. 4-2-u6-t4-11 Mission 6 : 16×9, 9×16, 25×16 계단 자르기 확인
r = []
for m, a, b, rot in [(3, 4, 3, False), (3, 4, 3, True), (4, 5, 4, False)]:
    good, cells, S = stair_ok(m, a, b, rot); ok(good and len(cells) == S*S, 'm6 stair')
    r.append('정답 예시 그림 참고(계단 모양으로 잘라 붙임)')
OUT['4-2-u6-t4-11'] = r

# 16. 4-2-u6-t4-10 Mission 5 : 모눈 선을 따라 자르는 모든 방법 중 정사각형이 되는 것은 하나
r = []
for segs in [[(0, 5), (0, 6), (1, 5)], [(0, 4), (0, 6), (0, 6)], [(0, 3), (0, 5), (0, 5), (2, 3)]]:
    cells = [(x, y) for y, (st, ln) in enumerate(segs) for x in range(st, st+ln)]
    S = int(round(math.sqrt(len(cells)))); ok(S*S == len(cells), 'm5 area')
    ok(len(all_cuts(cells, S, False)) == 1, 'm5 unique')
    r.append('정답 예시 그림 참고(자르는 선 한 가지)')
OUT['4-2-u6-t4-10'] = r

# 17. 4-2-u6-t4-4 예제 4-3 : 모눈 꼭짓점을 잇는 나누는 선(6점 이하, 한 번에 가로·세로 2칸 이내) 전수 → 1가지
RS = 8
def inside(poly, x, y):
    c = False
    for i in range(len(poly)):
        (x1, y1), (x2, y2) = poly[i], poly[(i+1) % len(poly)]
        if (y1 > y) != (y2 > y):
            if x < x1+(y-y1)*(x2-x1)/(y2-y1): c = not c
    return c
def raster(poly):
    xs = [p[0] for p in poly]; ys = [p[1] for p in poly]
    return {(i, j) for i in range(int(min(xs))*RS, int(max(xs))*RS) for j in range(int(min(ys))*RS, int(max(ys))*RS) if inside(poly, F(2*i+1, 2*RS), F(2*j+1, 2*RS))}
def rnorm(S_):
    mi = min(i for i, j in S_); mj = min(j for i, j in S_); return frozenset((i-mi, j-mj) for i, j in S_)
def rorients(S_):
    out = set()
    for k in range(4):
        for fl in (0, 1):
            pts = []
            for i, j in S_:
                x, y = i, j
                if fl: x = -x-1
                for _ in range(k): x, y = -y-1, x
                pts.append((x, y))
            out.add(rnorm(pts))
    return out
def rsquare(A_, B_, side):
    N_ = side*RS; Bo = rorients(B_); sq = {(i, j) for i in range(N_) for j in range(N_)}
    for o in rorients(A_):
        w = max(i for i, j in o)+1; h = max(j for i, j in o)+1
        for dx in range(N_-w+1):
            for dy in range(N_-h+1):
                pl = {(i+dx, j+dy) for i, j in o}
                if pl <= sq and rnorm(sq-pl) in Bo: return True
    return False
def parea(p): return abs(sum(p[i][0]*p[(i+1) % len(p)][1]-p[(i+1) % len(p)][0]*p[i][1] for i in range(len(p))))/2
def e43_solutions(shape, side):
    def onb(pt):
        for i in range(len(shape)):
            a_, b_ = shape[i], shape[(i+1) % len(shape)]
            if (b_[0]-a_[0])*(pt[1]-a_[1])-(b_[1]-a_[1])*(pt[0]-a_[0]) == 0 and min(a_[0], b_[0]) <= pt[0] <= max(a_[0], b_[0]) and min(a_[1], b_[1]) <= pt[1] <= max(a_[1], b_[1]): return True
        return False
    X = max(p[0] for p in shape); Y = max(p[1] for p in shape)
    pts = [(x, y) for x in range(X+1) for y in range(Y+1) if onb((x, y)) or inside(shape, F(x), F(y))]
    bnd = [p for p in pts if onb(p)]
    per = []
    for i in range(len(shape)):
        a_, b_ = shape[i], shape[(i+1) % len(shape)]
        seg = [p for p in bnd if (b_[0]-a_[0])*(p[1]-a_[1])-(b_[1]-a_[1])*(p[0]-a_[0]) == 0 and min(a_[0], b_[0]) <= p[0] <= max(a_[0], b_[0]) and min(a_[1], b_[1]) <= p[1] <= max(a_[1], b_[1]) and p != b_]
        per += sorted(seg, key=lambda p: (p[0]-a_[0])**2+(p[1]-a_[1])**2)
    def cross(p, q, r_, s):
        o = lambda a_, b_, c_: (lambda v: (v > 0)-(v < 0))((b_[0]-a_[0])*(c_[1]-a_[1])-(b_[1]-a_[1])*(c_[0]-a_[0]))
        return o(p, q, r_)*o(p, q, s) < 0 and o(r_, s, p)*o(r_, s, q) < 0
    half = parea(shape)/2; found = set()
    def walk(path):
        if len(path) > 1 and path[-1] in bnd:
            P_, Q_ = path[0], path[-1]; i, j = per.index(P_), per.index(Q_)
            b1 = []; k = j
            while True:
                k = (k+1) % len(per)
                if per[k] == P_: break
                b1.append(per[k])
            b2 = []; k = i
            while True:
                k = (k+1) % len(per)
                if per[k] == Q_: break
                b2.append(per[k])
            p1 = path+b1; p2 = path[::-1]+b2
            if parea(p1) == half and parea(p2) == half:
                A_ = raster(p1); B_ = raster(p2)
                if rnorm(B_) in rorients(A_) and rsquare(A_, B_, side): found.add(frozenset([tuple(path), tuple(path[::-1])]))
            return
        if len(path) > 5: return
        for q in pts:
            if q in path: continue
            p = path[-1]; dx, dy = q[0]-p[0], q[1]-p[1]
            if abs(dx) > 2 or abs(dy) > 2 or math.gcd(abs(dx), abs(dy)) != 1: continue
            if len(path) == 1 and q in bnd: continue
            if any(cross(path[k], path[k+1], p, q) for k in range(len(path)-2)): continue
            walk(path+[q])
    for s in bnd: walk([s])
    return found
base = [(0, 0), (4, 0), (6, 1), (6, 3), (2, 3), (0, 2)]
sols = e43_solutions(base, 4)
ok(len(sols) == 1 and frozenset([((2, 3), (2, 2), (2, 1), (4, 2), (4, 1), (4, 0)), ((4, 0), (4, 1), (4, 2), (2, 1), (2, 2), (2, 3))]) in sols, 'ex43 unique')
# 변형 1(90° 돌림), 2(좌우 뒤집기)는 같은 도형을 옮긴 것: 합동임을 확인하면 나누는 선도 그대로 옮겨 한 가지
rot1 = [(3-y, x) for x, y in base]; mir = [(6-x, y) for x, y in base][::-1]
ok(rnorm(raster(rot1)) in rorients(raster(base)) and rnorm(raster(mir)) in rorients(raster(base)), 'ex43 variants')
OUT['4-2-u6-t4-4'] = ['정답 예시 그림 참고(나누는 선 한 가지)']*3

# ---------------- 패턴 블록(삼각 격자) ----------------
SQ3 = math.sqrt(3)
def L(i, j): return (i+j/2, j*SQ3/2)
def area_f(p): return abs(sum(p[i][0]*p[(i+1) % len(p)][1]-p[(i+1) % len(p)][0]*p[i][1] for i in range(len(p))))/2
TRI = SQ3/4
def tri_units(lat_polys): return round(sum(area_f([L(*q) for q in p]) for p in lat_polys)/TRI)
# 18. 4-2-u6-t4-2 예제 4-1 : 정사각형 부분 1개 + 삼각형 부분 넓이로 2번 쓴 조각 결정
pieces41 = {'가': 6, '나': 3, '다': 1, '마': 2}
hexa = [(0, 0), (1, 0), (2, -1), (2, -2), (1, -2), (0, -1)]; T1 = [(-1, 1), (1, 1), (1, 0), (0, 0)]
tg41 = [[hexa, T1, [(-2, 2), (0, 2), (0, 1), (-1, 1)], [(0, 2), (1, 1), (0, 1)]],
        [hexa, T1, [(-1, 1), (0, 1), (0, 2), (-1, 2)], [(0, 1), (1, 1), (0, 2)]],
        [hexa, T1, [(-1, 1), (0, 1), (-1, 2)], [(0, 1), (1, 1), (0, 2)]]]
r = []
for body in tg41:
    t = tri_units(body)+2   # 정사각형 옆에 붙은 마름모(작은 삼각형 2개)
    extra = t-sum(pieces41.values()); c = [k for k, v in pieces41.items() if v == extra]
    ok(len(c) == 1, 'ex41'); r.append(c[0])
OUT['4-2-u6-t4-2'] = r
# 19. 4-2-u6-t4-6 Mission 1 : 사용하지 않은 조각
pieces1 = {'가': 1, '나': 3, '다': 2, '바': 6}
hx = [(1, 0), (2, 0), (3, -1), (3, -2), (2, -2), (1, -1)]; tp = [(0, -1), (1, -1), (1, 0), (0, 1)]; rh = [(0, -1), (1, -1), (2, -2), (1, -2)]
tr = [(0, -1), (1, -1), (1, -2)]; ex = [(0, 0), (0, 1), (-1, 1)]
r = []
for body, has_sq in [([hx, tp, rh], True), ([hx, tp, tr], True), ([hx, tp, rh, ex], False)]:
    t = tri_units(body)
    if has_sq:
        miss = sum(pieces1.values())-t; c = [k for k, v in pieces1.items() if v == miss]; ok(len(c) == 1, 'm1'); r.append(c[0])
    else:
        ok(t == sum(pieces1.values()), 'm1 v2'); r.append('마')
OUT['4-2-u6-t4-6'] = r

# ---------------- 칠교(도형판) ----------------
KO = '가나다라마바사'
B1 = [('L', [(0, 0), (2, 2), (0, 4)]), ('L', [(0, 0), (4, 0), (2, 2)]), ('S', [(2, 2), (3, 1), (3, 3)]), ('P', [(3, 1), (4, 0), (4, 2), (3, 3)]), ('Q', [(2, 2), (3, 3), (2, 4), (1, 3)]), ('S', [(0, 4), (1, 3), (2, 4)]), ('M', [(2, 4), (4, 2), (4, 4)])]
B2 = [('M', [(0, 0), (2, 0), (0, 2)]), ('S', [(2, 0), (4, 0), (3, 1)]), ('Q', [(2, 0), (3, 1), (2, 2), (1, 1)]), ('S', [(1, 1), (2, 2), (1, 3)]), ('P', [(0, 2), (1, 1), (1, 3), (0, 4)]), ('L', [(4, 0), (4, 4), (2, 2)]), ('L', [(0, 4), (4, 4), (2, 2)])]
def board(bd, kind):
    tf = {0: lambda p: p, 1: lambda p: (4-p[1], p[0]), 2: lambda p: (4-p[0], p[1]), 3: lambda p: (p[0], 4-p[1])}[kind]
    b = [(t, [tf(p) for p in pl]) for t, pl in bd]
    if kind == 0: return [(KO[i], t, pl) for i, (t, pl) in enumerate(b)]
    cen = lambda pl: (sum(p[1] for p in pl)/len(pl), sum(p[0] for p in pl)/len(pl))
    order = sorted(range(len(b)), key=lambda i: (round(cen(b[i][1])[0]*2), cen(b[i][1])[1]))
    lab = {i: KO[k] for k, i in enumerate(order)}
    return [(lab[i], t, pl) for i, (t, pl) in enumerate(b)]
for bd in (B1, B2):
    ok(sum(area_f(pl) for _, pl in bd) == 16, 'board area')
    ok([round(area_f(pl)) for t, pl in bd if t == 'S'] == [1, 1], 'small')
AR = {'L': 4, 'M': 2, 'Q': 2, 'P': 2, 'S': 1}
# 20. 4-2-u6-t4-3 예제 4-2 : 5조각 정사각형
def sq_areas(limit):  # 짧은 변(√2)·긴 변(2)을 이어 만든 정사각형 넓이
    return {2*n*n for n in range(1, 5)} | {4*n*n for n in range(1, 5)}
r = []
for kind in (0, 1, 3):
    bd = board(B1, kind); types = [t for _, t, _ in bd]
    good = []
    for i, j in combinations(range(7), 2):
        rest = 16-AR[types[i]]-AR[types[j]]
        if rest in sq_areas(16): good.append((i, j))
    ok(len(good) == 1 and {types[good[0][0]], types[good[0][1]]} == {'L'}, 'ex42 unique removal')
    # 실제 배치 확인(작은 삼각형 다리 1 기준): 중간삼각형·평행사변형·작은삼각형 2·정사각형 → 2×2 정사각형
    slots = [[(0, 0), (2, 0), (1, 1)], [(0, 0), (1, 1), (1, 2), (0, 1)], [(0, 1), (1, 2), (0, 2)], [(1, 1), (2, 1), (2, 2), (1, 2)], [(1, 1), (2, 0), (2, 1)]]
    rs = [raster([(F(x), F(y)) for x, y in s]) for s in slots]
    ok(sum(len(x) for x in rs) == 4*RS*RS and len(set().union(*rs)) == 4*RS*RS, 'ex42 tiling')
    labs = sorted(bd[k][0] for k in range(7) if k not in good[0])
    r.append(', '.join(labs)+'로 만든 정사각형(정답 예시 그림 참고)')
OUT['4-2-u6-t4-3'] = r
# 21. 4-2-u6-t4-7 Mission 2 : 작은 삼각형 2 + 정사각형으로 정사각형을 만들 수 없음(반 칸 격자 전수), 나머지 도형은 구성 확인
def tri_cells(poly, h=F(1, 2)):
    # h 격자 칸을 대각선으로 4등분한 작은 삼각형 중심이 poly 안에 있는 것
    xs = [p[0] for p in poly]; ys = [p[1] for p in poly]; out = set()
    i0, i1 = int(min(xs)/h), int(max(xs)/h); j0, j1 = int(min(ys)/h), int(max(ys)/h)
    for i in range(i0, i1):
        for j in range(j0, j1):
            cx, cy = (i+F(1, 2))*h, (j+F(1, 2))*h
            for q, (dx, dy) in enumerate([(0, -1), (1, 0), (0, 1), (-1, 0)]):
                px, py = cx+dx*h/3, cy+dy*h/3
                if inside(poly, px, py): out.add((i, j, q))
    return out
def placements(poly, target, h=F(1, 2)):
    res = set()
    for k in range(4):
        pl = poly
        for _ in range(k): pl = [(-y, x) for x, y in pl]
        mx = min(x for x, y in pl); my = min(y for x, y in pl); pl = [(x-mx, y-my) for x, y in pl]
        for dx in range(0, 9):
            for dy in range(0, 9):
                q = [(x+dx*h, y+dy*h) for x, y in pl]
                if max(x for x, y in q) > 2 or max(y for x, y in q) > 2: continue
                c = frozenset(tri_cells(q))
                if c <= target: res.add(c)
    return res
SQUARE2 = frozenset(tri_cells([(0, 0), (2, 0), (2, 2), (0, 2)]))
S_ = [(F(0), F(0)), (F(2), F(0)), (F(1), F(1))]; Q_ = [(F(1), F(0)), (F(2), F(1)), (F(1), F(2)), (F(0), F(1))]
pS = placements(S_, SQUARE2); pQ = placements(Q_, SQUARE2)
cover = any(a | b | c == SQUARE2 and not (a & b) and not (a & c) and not (b & c) for a in pS for b in pS for c in pQ)
ok(not cover, 'm2 square impossible')
Mm = [(F(0), F(0)), (F(2), F(0)), (F(0), F(2))]; pM = placements(Mm, SQUARE2)
ok(pS and pQ and any(a | b | c == SQUARE2 and not (a & b) and not (a & c) and not (b & c) for a in pS for b in pS for c in pM), 'm2 sanity: S,S,M make the square')
# 정사각형 조각을 목표 정사각형(한 변 2)의 변과 나란히 놓으면 남는 ㄱ자 띠의 폭은 2-√2 이고,
# 작은 삼각형(다리 √2)의 내접원 지름 2(√2-1)가 그보다 커서 작은 삼각형이 띠에 들어가지 못함
ok(2*(math.sqrt(2)-1) > 2-math.sqrt(2), 'm2 strip')
# 다른 다섯 도형은 실제 구성 확인(작은 삼각형 다리 1, 정사각형 한 변 1)
def tri_area_sum(ps): return sum(area_f(p) for p in ps)
cons = {'직각삼각형': [[(0, 0), (1, 0), (1, 1), (0, 1)], [(1, 0), (2, 0), (1, 1)], [(0, 1), (1, 1), (0, 2)]],
        '직사각형': [[(0, 0), (1, 0), (1, 1), (0, 1)], [(1, 0), (2, 0), (2, 1)], [(1, 0), (2, 1), (1, 1)]],
        '평행사변형': [[(0, 0), (1, 0), (1, 1), (0, 1)], [(0, 0), (0, 1), (-1, 1)], [(1, 0), (2, 0), (1, 1)]],
        '사다리꼴': [[(0, 0), (1, 0), (1, 1), (0, 1)], [(0, 0), (0, 1), (-1, 1)], [(1, 0), (1, 1), (2, 1)]]}
for k, ps in cons.items(): ok(tri_area_sum(ps) == 2, 'm2 cons '+k)
SH = ['직각삼각형', '이등변삼각형', '정사각형', '직사각형', '평행사변형', '사다리꼴']; SYM = '㉠㉡㉢㉣㉤㉥'
r = []
for v, order in enumerate([[0, 1, 2, 3, 4, 5], [3, 0, 4, 2, 5, 1], [1, 4, 3, 5, 2, 0]]):
    opts = [SH[i] for i in order]; k = opts.index('정사각형'); r.append(f'{SYM[k]} 정사각형')
OUT['4-2-u6-t4-7'] = r
# 22. 4-2-u6-t4-8 Mission 3 : 예시 배치(3조각: 작은2+중간, 4조각: 큰1+중간+작은2) 확인
r = []
for kind in (0, 1, 3):
    bd = board(B1, kind)
    s3 = sorted(lb for lb, t, _ in bd if t in ('S', 'M'))
    ok(sum(AR[t] for _, t, _ in bd if t in ('S', 'M')) == 4, 'm3 area3')
    Ls = sorted(lb for lb, t, _ in bd if t == 'L')
    s4 = sorted([Ls[0]]+s3)
    ok(AR['L']+4 == 8, 'm3 area4')
    sl3 = [[(0, 0), (2, 0), (0, 2)], [(2, 0), (2, 2), (1, 1)], [(0, 2), (2, 2), (1, 1)]]
    sl4 = [[(0, 0), (2, 0), (0, 2)], [(2, 0), (2, 2), (1, 1)], [(0, 2), (1, 2), (1, 1)], [(1, 2), (2, 2), (1, 1)]]
    for sl in (sl3, sl4):
        rs = [raster([(F(x), F(y)) for x, y in s]) for s in sl]
        ok(sum(len(x) for x in rs) == 4*RS*RS and len(set().union(*rs)) == 4*RS*RS, 'm3 tiling')
    r.append(f"예: 3조각 {', '.join(s3)} / 4조각 {', '.join(s4)}(정답 예시 그림 참고)")
OUT['4-2-u6-t4-8'] = r

print('AUDIT ' + json.dumps(OUT, ensure_ascii=False))
