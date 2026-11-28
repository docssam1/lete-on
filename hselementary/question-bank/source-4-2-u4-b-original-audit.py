# Independent audit for 4-2-u4-b (4-2 4단원 사각형, 개념탐구 5~7).
# Every answer is recomputed from the variant parameters by coordinate construction
# (numeric solving of the stated conditions, then measuring), or by exhaustive counting.
import itertools, math, json
from fractions import Fraction as F

def sub(a, b): return (a[0]-b[0], a[1]-b[1])
def add(a, b): return (a[0]+b[0], a[1]+b[1])
def mul(a, k): return (a[0]*k, a[1]*k)
def dist(a, b): return math.hypot(a[0]-b[0], a[1]-b[1])
def rot(v, deg):
    r = math.radians(deg); c, s = math.cos(r), math.sin(r); return (v[0]*c-v[1]*s, v[0]*s+v[1]*c)
def pol(deg, l=1.0): return (l*math.cos(math.radians(deg)), l*math.sin(math.radians(deg)))  # y-up
def ang(v, a, b):
    u = sub(a, v); w = sub(b, v)
    c = (u[0]*w[0]+u[1]*w[1])/(math.hypot(*u)*math.hypot(*w))
    return math.degrees(math.acos(max(-1, min(1, c))))
def inter(p1, p2, p3, p4):
    d = (p2[0]-p1[0])*(p4[1]-p3[1])-(p2[1]-p1[1])*(p4[0]-p3[0])
    t = ((p3[0]-p1[0])*(p4[1]-p3[1])-(p3[1]-p1[1])*(p4[0]-p3[0]))/d
    return (p1[0]+t*(p2[0]-p1[0]), p1[1]+t*(p2[1]-p1[1]))
def reflect(p, a, b):
    d = sub(b, a); l = math.hypot(*d); d = (d[0]/l, d[1]/l); v = sub(p, a); t = v[0]*d[0]+v[1]*d[1]
    f = add(a, mul(d, t)); return sub(mul(f, 2), p)
def solve(f, lo, hi, n=4000):
    """unique root of f on (lo,hi): sample sign changes, assert exactly one, then bisect"""
    xs = [lo+(hi-lo)*i/n for i in range(1, n)]
    vals = [f(x) for x in xs]
    ch = [i for i in range(len(xs)-1) if vals[i] == 0 or vals[i]*vals[i+1] < 0]
    assert len(ch) == 1, ('roots', len(ch))
    a, b = xs[ch[0]], xs[ch[0]+1]
    for _ in range(200):
        m = (a+b)/2
        if f(a)*f(m) <= 0: b = m
        else: a = m
    return (a+b)/2
def deg(x):
    r = round(x); assert abs(x-r) < 1e-6, x; return r

R = {}

# ---- t5-7: exhaustive trapezoid count on R x C board, up to rotation/reflection ----
def count_trap(Rr, Cc):
    pts = [(x, y) for x in range(Cc) for y in range(Rr)]
    cr = lambda o, a, b: (a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0])
    seen = set()
    for q in itertools.combinations(pts, 4):
        if any(cr(*t) == 0 for t in itertools.combinations(q, 3)): continue
        for order in itertools.permutations(q[1:]):
            Pp = (q[0],)+order
            s = [cr(Pp[i], Pp[(i+1) % 4], Pp[(i+2) % 4]) for i in range(4)]
            if not (all(v > 0 for v in s) or all(v < 0 for v in s)): continue
            e = [sub(Pp[(i+1) % 4], Pp[i]) for i in range(4)]
            npar = sum(1 for i in (0, 1) if e[i][0]*e[i+2][1]-e[i][1]*e[i+2][0] == 0)
            if npar != 1: break
            # congruence class: sorted over dihedral relabelings of the 6 squared distances
            d2 = lambda a, b: (a[0]-b[0])**2+(a[1]-b[1])**2
            keys = []
            for r in range(4):
                for sgn in (1, -1):
                    Qq = [Pp[(r+sgn*k) % 4] for k in range(4)]
                    keys.append((d2(Qq[0], Qq[1]), d2(Qq[1], Qq[2]), d2(Qq[2], Qq[3]), d2(Qq[3], Qq[0]), d2(Qq[0], Qq[2]), d2(Qq[1], Qq[3])))
            seen.add(min(keys)); break
    return len(seen)
R['4-2-u4-t5-7'] = [f'{count_trap(r, c)}가지' for r, c in [(3, 4), (2, 5), (4, 4)]]

# ---- t5-8: fold a parallelogram so the top-left corner lands on the bottom line ----
def t58(al, be):
    out = []
    def config(th):  # th = angle between fold line PQ and top edge (toward TL); height 1
        Pp = (0.0, 1.0); d = 1/math.sin(math.radians(2*th)); TL = (-d, 1.0)
        Q = (-1/math.tan(math.radians(th)), 0.0)
        BL = add(TL, (1/math.tan(math.radians(al)), -1.0))  # top-left angle = al
        TLp = reflect(TL, Pp, Q); BLp = reflect(BL, Pp, Q)
        assert abs(TLp[1]) < 1e-9
        return Pp, Q, TLp, BLp
    def g(th):
        Pp, Q, V, BLp = config(th)  # folded side must hang below the bottom line, as in the figure
        return (ang(V, Q, BLp) if BLp[1] < 0 else -ang(V, Q, BLp))-be
    th = solve(g, 1, 89)
    Pp, Q, V, BLp = config(th)
    assert abs(ang(V, Pp, BLp)-al) < 1e-6
    return deg(ang(Pp, Q, V))
R['4-2-u4-t5-8'] = [f'{t58(*p)}°' for p in [(112, 34), (116, 36), (106, 30)]]

# ---- t5-9: fold a trapezoid along ㄱㅈ and ㄹㅊ ----
def t59(a, L):
    h = 1.0; k = h/math.tan(math.radians(a))
    N = (0, 0); G = (k, h); Rr = (k+L, h); Dd = (2*k+L, 0)  # isosceles, base angles a
    J = sub(Dd, sub(Rr, G))  # ㄱㅈ ∥ ㄹㄷ  -> ㄱㅈㄷㄹ parallelogram
    C = add(N, sub(Rr, G))   # ㄱㄴ ∥ ㄹㅊ
    assert abs(ang(N, Dd, G)-a) < 1e-9 and abs(ang(Dd, N, Rr)-a) < 1e-9
    O = reflect(N, G, J); B = reflect(Dd, Rr, C)
    M = inter(G, O, Rr, B)
    return ang(M, G, Rr)
res = []
for a in [70, 72, 74]:
    v1, v2 = t59(a, 4/math.tan(math.radians(a))), t59(a, 5/math.tan(math.radians(a)))
    assert abs(v1-v2) < 1e-9; res.append(f'{deg(v1)}°')
R['4-2-u4-t5-9'] = res

# ---- t5-10: 8 rhombi alternate around a point ----
res = []
for obt in [140, 144, 136]:
    A = 180-obt  # angle at the centre of the marked rhombus (adjacent angles of a rhombus)
    cand = [b for b in range(1, 180) if 4*A+4*b == 360 and b != A]
    assert len(cand) == 1; res.append(f'{cand[0]}°')
R['4-2-u4-t5-10'] = res

# ---- t5-11: quadrilaterals between non-crossing transversals of a trapezoid ----
def t511(lines):
    H = F(10); segs = [((F(x), F(0)), (F(y), H)) for x, y in lines]
    for (a, b), (c, d) in itertools.combinations(segs, 2):
        assert (a[0]-c[0])*(b[0]-d[0]) > 0  # no crossing inside the strip
    rh = rc = pg = tr = 0
    for i, j in itertools.combinations(range(len(segs)), 2):
        (t1, b1), (t2, b2) = segs[i], segs[j]
        quad = [t1, b1, b2, t2]
        e = [sub(quad[(k+1) % 4], quad[k]) for k in range(4)]
        par = [e[k][0]*e[k+2][1]-e[k][1]*e[k+2][0] == 0 for k in (0, 1)]
        assert par[1]  # top and bottom always parallel
        tr += 1
        if par[0]:
            pg += 1
            if e[0][0]*e[1][0]+e[0][1]*e[1][1] == 0: rc += 1
            if len({x[0]**2+x[1]**2 for x in e}) == 1: rh += 1
    return f'마름모 {rh}개, 직사각형 {rc}개, 평행사변형 {pg}개, 사다리꼴 {tr}개'
L0 = [(2, 0), (F(9, 2), 9), (11, 11), (F(37, 2), F(29, 2)), (21, 21), (32, 28), (36, 38)]
L1 = [(2, 0), (8, 8), (F(31, 2), F(23, 2)), (18, 18), (29, 25), (33, 35)]
L2 = [(2, 0), (7, 3), (11, 11), (F(37, 2), F(29, 2)), (21, 21), (32, 28), (36, 38)]
R['4-2-u4-t5-11'] = [t511(l) for l in (L0, L1, L2)]

# ---- t6: square + isosceles triangle + rhombus ----
def t6(m, n):
    G = (0, 1); N = (0, 0); Dd = (1, 0); Rr = (1, 1); d = math.sqrt(2)
    def Mof(x): return add(N, pol(45+x, d))           # ㄴㅁ = ㄴㄹ, angle ㅁㄴㄹ = x
    x = solve(lambda x: ang(Mof(x), N, Rr)-m*ang(N, Mof(x), Rr), 0.5, 44.5)
    M = Mof(x)
    def Bof(y): return add(G, pol(-45-y, d))          # ㄱㅂ = ㄱㄷ (rhombus side), angle ㅂㄱㄷ = y
    y = solve(lambda y: ang(Dd, G, add(Bof(y), sub(Dd, G)))-n*ang(G, Bof(y), Dd), 0.5, 44.5)
    B = Bof(y)
    X = inter(N, M, G, Dd); Y = inter(G, B, N, Rr)
    return deg(ang(X, G, N)+ang(Y, G, N))
R['4-2-u4-t6'] = [f'{t6(*p)}°' for p in [(2, 5), (4, 5), (2, 9)]]

# ---- perimeter of a union of polygons glued edge to edge ----
def glued_perimeter(polys):
    edges = []
    for p in polys:
        for i in range(len(p)): edges.append((p[i], p[(i+1) % len(p)]))
    key = lambda a, b: tuple(sorted([(round(a[0], 6), round(a[1], 6)), (round(b[0], 6), round(b[1], 6))]))
    cnt = {}
    for a, b in edges: cnt[key(a, b)] = cnt.get(key(a, b), 0)+1
    assert max(cnt.values()) <= 2
    return sum(dist(a, b) for a, b in edges if cnt[key(a, b)] == 1)

# ---- t6-2 ----
def t62(a, b, c):
    r3 = math.sqrt(3); A = (0, 0); B = (a, 0); C = (a/2, -a*r3/2); Dd = (0, -a*r3); E = (-a/2, -a*r3/2)
    Fp = (a+b, 0); Gp = add(C, (b, 0)); p = rot(sub(C, B), 90)  # square outward on F-G
    if p[0] < 0: p = mul(p, -1)
    q = rot(sub(E, A), -90)
    if q[0] > 0: q = mul(q, -1)
    q = mul(q, c/a)
    polys = [[A, add(A, q), add(E, q), E], [A, E, Dd, C], [A, B, C], [B, Fp, Gp, C], [Fp, add(Fp, p), add(Gp, p), Gp]]
    # check the stated shapes: equal sides
    assert abs(dist(A, E)-dist(E, Dd)) < 1e-9 and abs(dist(Fp, Gp)-a) < 1e-9
    return deg(glued_perimeter(polys))
R['4-2-u4-t6-2'] = [f'{t62(*p)} cm' for p in [(4, 6, 5), (3, 7, 6), (5, 8, 7)]]

# ---- t6-3 ----
def t63():
    G = (-1, 1); N = (-1, 0); Dd = (0, 0); S = (0, 1)
    # ㄹ: |ㄷㄹ| = |ㅅㄷ| = 1 (rhombus ㅅㄷㄹㅂ) and |ㅅㄹ| = |ㅅㅂ| = 1 (rhombus ㅅㄹㅁㅂ), outside the square
    th = solve(lambda t: dist(pol(t), S)-1, -89, 89)
    Rr = pol(th); B = add(S, sub(Rr, Dd)); M = add(B, sub(Rr, S))
    for u, v in [(S, Dd), (Dd, Rr), (Rr, B), (B, S), (S, Rr), (Rr, M), (M, B)]: assert abs(dist(u, v)-1) < 1e-9
    return [deg(ang(Rr, B, N)), deg(ang(Rr, S, N)), deg(ang(Rr, M, N))]
R['4-2-u4-t6-3'] = [f'{x}°' for x in t63()]

# ---- t6-4 ----
def t64(a):
    N = (0, 0); G = pol(a)
    x = solve(lambda x: dist(G, (x, 0))-x, 0.6, 20)  # |ㄱㄷ| = |ㄱㅁ| = |ㄴㄷ|
    Dd = (x, 0); M = add(G, sub(Dd, N)); Rr = add(Dd, sub(M, G))
    for u, v in [(G, Dd), (Dd, Rr), (Rr, M), (M, G)]: assert abs(dist(u, v)-x) < 1e-9
    return deg(ang(Rr, G, M))
R['4-2-u4-t6-4'] = [f'{t64(a)}°' for a in [80, 76, 72]]

# ---- t6-5 ----
def t65(mode):
    N = (0, 0); Dd = (2, 0); c = (1, 0)
    if mode != 'mirror':
        # ㄱ on the semicircle over ㄴㄷ (right angle at ㄱ); angle ㄱㄷㄴ = half of angle ㄱㄴㄷ
        Gf = lambda t: add(N, pol(t, 2*math.cos(math.radians(t))))
        t = solve(lambda t: 2*ang(Dd, Gf(t), N)-ang(N, Gf(t), Dd), 1, 89); G = Gf(t)
        assert abs(ang(G, N, Dd)-90) < 1e-9
        M = (0, -1); Rr = (2, -1)  # ㄴㄷ = 2 ㄴㅁ
        B = inter(G, M, N, Dd)
        return deg(ang(B, G, Dd)) if mode == 'base' else deg(ang(M, G, Rr))
    Gf = lambda t: add(Dd, pol(180-t, 2*math.cos(math.radians(t))))
    t = solve(lambda t: 2*ang(N, Gf(t), Dd)-ang(Dd, Gf(t), N), 1, 89); G = Gf(t)
    assert abs(ang(G, N, Dd)-90) < 1e-9
    M = (0, -1); Rr = (2, -1)  # ㄴㄷ = 2 ㄷㄹ
    B = inter(G, Rr, N, Dd)
    return deg(ang(B, G, Dd))
R['4-2-u4-t6-5'] = [f'{t65(m)}°' for m in ['base', 'mirror', 'mang']]

# ---- t6-6 ----
def t66(s, T):
    d1 = (-0.285, -0.958); l = math.hypot(*d1); d1 = (d1[0]/l, d1[1]/l)
    d2 = (0.824, -0.567); l = math.hypot(*d2); d2 = (d2[0]/l, d2[1]/l)
    def shapes(L):
        O = (0, 0); G = (-L, 0); N = add(G, mul(d1, s)); Dd = add(O, mul(d1, s)); Rr = add(Dd, mul(d2, s)); S = add(O, mul(d2, s))
        p = rot(d1, 90)
        if p[0] < 0: p = mul(p, -1)
        B = add(S, mul(p, s)); M = add(Rr, mul(p, s))
        return [[G, N, Dd, O], [O, Dd, Rr, S], [S, Rr, M, B]]
    L = solve(lambda L: glued_perimeter(shapes(L))-T, s+0.01, 100)
    pg = shapes(L)[0]
    return deg(sum(dist(pg[i], pg[(i+1) % 4]) for i in range(4)))
R['4-2-u4-t6-6'] = [f'{t66(*p)} cm' for p in [(6, 58), (5, 50), (7, 66)]]

# ---- t6-7 ----
def t67(a):
    N = (0, 0); Dd = (1, 0); M = (0, 1); G = pol(150)
    Bf = lambda t: pol(t)  # |ㄴㅂ| = |ㄴㄱ| = 1
    t = solve(lambda t: ang(G, M, Bf(t))-a, 0.5, 89.5); B = Bf(t)
    return deg(ang(B, N, Dd))
R['4-2-u4-t6-7'] = [f'{t67(a)}°' for a in [35, 30, 25]]

# ---- t6-8 ----
def t68(g, b):
    Dd = (0, 0); Rr = pol(180-g); u = Rr; p = rot(u, -90)
    if p[0] < 0: p = mul(p, -1)
    B = add(Rr, p)
    L = solve(lambda L: ang(B, Rr, (-L, 0))-b, 0.001, 30)
    N = (-L, 0); G = add(N, Rr)
    assert abs(ang(G, N, Rr)-g) < 1e-9
    return deg(ang(N, B, Dd))
R['4-2-u4-t6-8'] = [f'{t68(*p)}°' for p in [(110, 40), (105, 38), (112, 36)]]

# ---- t6-9 ----
# 책 조건(생각하는 황소 4-2 심화 51쪽 Mission 4): 변 ㄱㄹ = 변 ㄹㄷ(등변사다리꼴이 아님), 각 ㄱㅁㅂ = a, 각 ㄹㄷㄴ = c.
# 20261128: 앱이 "변 ㄱㄴ = 변 ㄹㄷ"으로 옮겨 답이 108°였던 것을 책 조건으로 되돌림(책 답 107°).
def t69(a, c):
    def build(T):  # T = 변 ㄴㄷ의 길이(변 ㄹㄷ = 1로 고정), y-up
        h = math.sin(math.radians(c)); k = math.cos(math.radians(c))
        N = (0, 0); Dd = (T, 0); Rr = (T-k, h); G = (T-k-1, h)
        mid = lambda p, q: mul(add(p, q), 0.5)
        return G, N, Dd, Rr, mid(G, Rr), mid(G, N), mid(N, Dd), mid(Rr, Dd)
    T = solve(lambda T: ang(build(T)[4], build(T)[0], build(T)[5])-a, 1.0, 50)
    G, N, Dd, Rr, M, B, S, O = build(T)
    assert abs(dist(G, Rr)-dist(Rr, Dd)) < 1e-12 and abs(ang(Dd, N, Rr)-c) < 1e-9 and G[0] > N[0]
    return deg(ang(S, B, O))
R['4-2-u4-t6-9'] = [f'{t69(*p)}°' for p in [(36, 74), (34, 72), (40, 76)]]

# ---- t6-10 ----
def t610(Ssum):
    W, H = 10.0, 11.0; V = (3.8, 2.4)  # y-up: lower corner of the tilted rectangle inside
    sols = []
    for k in range(1, 9000):
        th = k/100
        u = pol(90+th); w = pol(th)
        P = add(V, mul(u, -V[0]/u[0])); Q = add(V, mul(w, (W-V[0])/w[0]))
        ga = ang(P, (0, 0), V); na = ang(Q, (W, 0), add(Q, w))
        if abs(ga+na-Ssum) < 1e-6: sols.append(ga)
    assert len(sols) == 1
    return deg(sols[0])
R['4-2-u4-t6-10'] = [f'{t610(s)}°' for s in [164, 160, 170]]

# ---- t6-11 ----
def t611(mode):
    Dd = (0, 0)
    rel = {'eq': lambda nb, rm: nb-rm, 'nb2': lambda nb, rm: nb-2*rm, 'rm2': lambda nb, rm: rm-2*nb}[mode]
    # equilateral ㅁㅂㄷ inside the right angle at ㄷ: ㅂ at angle nb above ray ㄷㄴ, ㅁ at 60 further
    def conf(nb):
        B = pol(180-nb, 1); M = pol(120-nb, 1); rm = ang(Dd, (0, 1), M); return B, M, rm
    nb = solve(lambda nb: rel(nb, conf(nb)[2]), 0.1, 29.9)
    B, M, rm = conf(nb)
    H = 0.5; G = (-3, H); Rr = (0, H)
    O = inter(B, M, G, Rr); S = inter(Dd, M, G, Rr)
    assert abs(dist(M, B)-1) < 1e-9
    return deg(ang(O, Rr, M)+ang(S, M, Rr))
R['4-2-u4-t6-11'] = [f'{t611(m)}°' for m in ['eq', 'nb2', 'rm2']]

# ---- t7 ----
def t7(s):
    G = (0, s); N = (0, 0); Dd = (3*s, 0); Rr = (3*s, s); M = (2*s, 0)
    B = inter(G, M, (s, 0), (s, s)); S = inter(N, Rr, (s, 0), (s, s))
    bs = F(B[1]).limit_denominator(1000)-F(S[1]).limit_denominator(1000)
    assert abs(float(bs)-(B[1]-S[1])) < 1e-9 and bs.denominator == 1
    return f'(1) {bs} cm, (2) {deg(ang(M, G, N)+ang(Rr, G, N))}°'
R['4-2-u4-t7'] = [t7(s) for s in [18, 12, 24]]

# ---- t7-2 ----
def t72(m):
    Bp = (0, 1); N = (0, 0); Dd = (1, 0); Rr = (1, 1)
    M = (1/math.tan(math.radians(m)), 1)
    assert abs(ang(M, Bp, N)-m) < 1e-9
    G = reflect(Bp, M, N)
    return deg(ang(Dd, G, Rr))
R['4-2-u4-t7-2'] = [f'{t72(m)}°' for m in [68, 70, 64]]

# ---- t7-3 ----
def t73(g):
    G = (0, 1); N = (0, 0); Dd = (1, 0); Rr = (1, 1)
    S = add(Rr, pol(-30))  # equilateral ㄹㄷㅅ outside
    assert abs(dist(S, Dd)-1) < 1e-12
    # ㅁ on the ray from ㄱ making angle g with ㄱㄹ, with ㄹㅁ = ㄹㅅ (isosceles), inside the square
    t = solve(lambda t: dist(add(G, pol(-g, t)), Rr)-1, 0.2, 1.5)
    M = add(G, pol(-g, t)); assert 0 < M[0] < 1 and 0 < M[1] < 1
    B = inter(M, S, Rr, Dd)
    return deg(ang(B, S, Dd))
R['4-2-u4-t7-3'] = [f'{t73(g)}°' for g in [54, 52, 56]]

print('AUDIT ' + json.dumps(R, ensure_ascii=False))
