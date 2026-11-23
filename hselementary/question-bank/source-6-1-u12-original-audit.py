# 황소 6-1 1·2단원 잠금 원문 구조 유형(source-6-1-u12-original.js) 독립 감사기.
# 표준 라이브러리만 사용합니다. 전개도는 면 연결(쌍대 그래프)의 모든 생성나무를 만들어 실제로 펼치고,
# 면끼리 겹치는 것은 버린 뒤 둘레·가짓수·선의 위치를 다시 계산합니다.
import json, math, sys, itertools
from fractions import Fraction as Fr

DEBUG = len(sys.argv) > 1
OUT = {}
def frac_txt(q):
    q = Fr(q)
    if q.denominator == 1: return str(q.numerator)
    w, r = divmod(q.numerator, q.denominator)
    return ("%d %d/%d" % (w, r, q.denominator)) if w else ("%d/%d" % (r, q.denominator))

# ---------------- 3D·2D 기하 ----------------
def sub(a, b): return [x - y for x, y in zip(a, b)]
def add(a, b): return [x + y for x, y in zip(a, b)]
def mul(a, k): return [x * k for x in a]
def dot(a, b): return sum(x * y for x, y in zip(a, b))
def cross(a, b): return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]
def norm(a): return math.sqrt(dot(a, a))
def unit(a): return mul(a, 1 / norm(a))
def mean(ps): return [sum(c) / len(ps) for c in zip(*ps)]
def lerp(a, b, t): return add(a, mul(sub(b, a), t))

def regular(n, s, a0):
    R = s / (2 * math.sin(math.pi / n))
    return [[R * math.cos(math.radians(a0 - 360 * k / n)), R * math.sin(math.radians(a0 - 360 * k / n))] for k in range(n)]
def prism(base, h):
    n = len(base)
    P = [[x, y, h] for x, y in base] + [[x, y, 0.0] for x, y in base]
    F = [list(range(n)), [n + i for i in range(n)]] + [[i, (i+1) % n, n + (i+1) % n, n + i] for i in range(n)]
    return P, F
def pyramid(base, apex):
    n = len(base)
    P = [[x, y, 0.0] for x, y in base] + [apex]
    return P, [list(range(n))] + [[i, (i+1) % n, n] for i in range(n)]

def out_normal(P, f, C):
    n = unit(cross(sub(P[f[1]], P[f[0]]), sub(P[f[2]], P[f[0]])))
    return n if dot(n, sub(mean([P[i] for i in f]), C)) > 0 else mul(n, -1)

def dual_edges(F):
    E = []
    for a in range(len(F)):
        for b in range(a + 1, len(F)):
            sh = set(F[a]) & set(F[b])
            if len(sh) == 2: E.append((a, b, tuple(sorted(sh))))
    return E

def unfold(P, F, root, tree):
    """tree: [(부모, 자식)] 순서. 겉면이 보이도록 펼친 2D 좌표 pos[면][꼭짓점]."""
    C = mean(P); f0 = F[root]; n = out_normal(P, f0, C); a = P[f0[0]]
    u = unit(sub(P[f0[1]], a)); v = cross(n, u)
    pos = {root: {i: [dot(sub(P[i], a), u), -dot(sub(P[i], a), v)] for i in f0}}
    for p, c in tree:
        i, j = [k for k in F[c] if k in F[p]]
        A, B = pos[p][i], pos[p][j]
        gp = mean([pos[p][k] for k in F[p]])
        ab = sub(B, A); L = norm(ab); w = [-ab[1] / L, ab[0] / L]
        if dot(w, sub(gp, A)) > 0: w = mul(w, -1)
        e = sub(P[j], P[i]); E2 = dot(e, e)
        pos[c] = {}
        for k in F[c]:
            d = sub(P[k], P[i]); t = dot(d, e) / E2; h = norm(sub(d, mul(e, t)))
            pos[c][k] = add(add(A, mul(ab, t)), mul(w, h))
    return pos

def order_tree(nf, edges, root=0):
    adj = {k: [] for k in range(nf)}
    for a, b in edges: adj[a].append(b); adj[b].append(a)
    seen = {root}; q = [root]; out = []
    while q:
        x = q.pop(0)
        for y in adj[x]:
            if y not in seen: seen.add(y); out.append((x, y)); q.append(y)
    return out if len(seen) == nf else None

def poly_overlap(A, B, eps=1e-7):
    # 볼록다각형 내부가 겹치는지(분리축 검사). 변이 맞닿는 것은 겹침이 아님.
    for poly in (A, B):
        m = len(poly)
        for i in range(m):
            p, q = poly[i], poly[(i+1) % m]
            ax = [-(q[1]-p[1]), q[0]-p[0]]; L = norm(ax); ax = [ax[0]/L, ax[1]/L]
            pa = [dot(ax, x) for x in A]; pb = [dot(ax, x) for x in B]
            if max(pa) <= min(pb) + eps or max(pb) <= min(pa) + eps: return False
    return True

def valid_net(F, pos):
    ks = list(pos)
    polys = {k: [pos[k][i] for i in F[k]] for k in ks}
    for a, b in itertools.combinations(ks, 2):
        if poly_overlap(polys[a], polys[b]): return False
    return True

def all_nets(P, F):
    """겹치지 않는 모든 전개도: (붙인 변 목록, pos)"""
    E = dual_edges(F); nf = len(F); res = []
    for comb in itertools.combinations(range(len(E)), nf - 1):
        tr = order_tree(nf, [(E[k][0], E[k][1]) for k in comb])
        if tr is None: continue
        pos = unfold(P, F, 0, tr)
        if valid_net(F, pos): res.append(([E[k] for k in comb], pos))
    return res

def perimeter_of(P, F, glued):
    tot = sum(norm(sub(P[f[i]], P[f[(i+1) % len(f)]])) for f in F for i in range(len(f)))
    return tot - 2 * sum(norm(sub(P[e[2][0]], P[e[2][1]])) for e in glued)

def canon(F, pos):
    """돌리기·뒤집기로 같은 전개도를 같게 만드는 표준형"""
    pts = []   # 꼭짓점과 각 면의 중심(면의 변 수를 함께 기록)을 모두 넣어 모양을 구별
    for k in pos:
        for i in F[k]: pts.append((pos[k][i][0], pos[k][i][1], 0))
        c = mean([pos[k][i] for i in F[k]]); pts.append((c[0], c[1], len(F[k])))
    segs = set()
    for k in pos:
        f = F[k]
        for i in range(len(f)):
            a_, b_ = tuple(pos[k][f[i]]), tuple(pos[k][f[(i+1) % len(f)]])
            segs.add((a_, b_)); segs.add((b_, a_))
    best = None
    for (a, b) in segs:
        for mir in (1, -1):
            d = sub(b, a); L = norm(d); c, s = d[0]/L, d[1]/L
            def tf(p):
                x, y = p[0]-a[0], p[1]-a[1]
                return (round((c*x + s*y)/L, 3) + 0.0, round(mir*(-s*x + c*y)/L, 3) + 0.0, p[2])
            key = tuple(sorted(set(tf(p) for p in pts)))
            if best is None or key < best: best = key
    return best

def to2(P, F, pos, c, p):
    f = F[c]; a = P[f[0]]; e1 = sub(P[f[1]], a); e2 = sub(P[f[2]], a); d = sub(p, a)
    g11, g12, g22 = dot(e1, e1), dot(e1, e2), dot(e2, e2); r1, r2 = dot(d, e1), dot(d, e2)
    det = g11*g22 - g12*g12; s = (r1*g22 - r2*g12)/det; t = (r2*g11 - r1*g12)/det
    A, B, Cc = pos[c][f[0]], pos[c][f[1]], pos[c][f[2]]
    return add(add(A, mul(sub(B, A), s)), mul(sub(Cc, A), t))

def seg_cross(p, q, a, b):
    """선분 pq와 ab의 교점 매개변수 (t on pq, u on ab)"""
    d = sub(q, p); e = sub(b, a); den = d[0]*e[1] - d[1]*e[0]
    if abs(den) < 1e-12: return None
    t = ((a[0]-p[0])*e[1] - (a[1]-p[1])*e[0]) / den
    u = ((a[0]-p[0])*d[1] - (a[1]-p[1])*d[0]) / den
    return t, u

def point_in_poly(pt, poly, eps=1e-7):
    s = None
    for i in range(len(poly)):
        p, q = poly[i], poly[(i+1) % len(poly)]
        c = (q[0]-p[0])*(pt[1]-p[1]) - (q[1]-p[1])*(pt[0]-p[0])
        if abs(c) < eps: continue
        if s is None: s = c > 0
        elif s != (c > 0): return False
    return True

KO = 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ'
def near_int(x):
    r = round(x); assert abs(x - r) < 1e-6, x; return r

# ================= 1단원 개념탐구 1 =================
ans = []
for a, b in ((3, 7), (2, 5), (5, 8)):
    q = Fr(a, b)
    assert q * b == a and Fr(1, b) * a == q and q.numerator == a  # 기약분수, 1/b의 a배
    ans.append("%d/%d: 1 ÷ %d = 1/%d이고, %d ÷ %d의 몫은 1/%d이 %d개이므로 %d/%d입니다." % (a, b, b, b, a, b, b, a, a, b))
OUT["6-1-u1-e1-exploration-1-1"] = ans

def eul_f(n): return '을' if str(n)[-1] in '013678' else '를'
def ro(n): return '으로' if str(n)[-1] in '036' else '로'
ans = []
for n, d, k in ((2, 7, 3), (3, 5, 4), (4, 9, 5)):
    q = Fr(n, d) / k
    assert q == Fr(n, d) * Fr(1, k) and q.denominator == d * k and q.numerator == n
    ans.append("%d/%d%s 똑같이 %d%s 나눈 것 중 하나는 %d/%d의 1/%d이므로 %d/%d ÷ %d = %d/%d × 1/%d = %d/%d입니다."
               % (n, d, eul_f(n), k, ro(k), n, d, k, n, d, k, n, d, k, q.numerator, q.denominator))
OUT["6-1-u1-e1-exploration-1-2"] = ans

# ================= 2단원 예제 1-2: 사각기둥 자르기 =================
def vef(m): return (m + 2, 3 * m, 2 * m)   # m각기둥의 면·모서리·꼭짓점
ans = []
for dk, lt in (([0.5], []), ([1/3, 2/3], []), ([1/3, 2/3], [0.5])):
    # 윗면 사각형을 대각선으로 나누면 삼각형 2개 → 삼각기둥 2개, 가로로 자르면 같은 삼각기둥이 늘어남
    pieces = (1 + len(dk)) + (1 + len(lt))
    f, e, v = vef(3); assert v - e + f == 2
    ans.append("%d개" % (pieces * (f + e + v)))
OUT["6-1-u2-e1-example-1-2"] = ans

# ================= 전개도 둘레 최대·최소 (전수 검사) =================
def perim_diff(P, F):
    nets = all_nets(P, F)
    per = [perimeter_of(P, F, g) for g, pos in nets]
    return near_int(max(per) - min(per)), len(nets)

ans = []
for a, h in ((4, 11), (5, 13), (3, 12)):
    P, F = prism(regular(5, a, 90), h); d, cnt = perim_diff(P, F)
    assert d == 8 * (h - a)
    ans.append("%d cm" % d)
OUT["6-1-u2-e1-example-1-3"] = ans
if DEBUG: print('pent prism nets', cnt)

ans = []
for a, h in ((4, 7), (3, 8), (5, 9)):
    P, F = prism(regular(6, a, 90), h); d, cnt = perim_diff(P, F)
    ans.append("%d cm" % d)
OUT["6-1-u2-e1-mission-3"] = ans

# ================= Mission 4: 꼭짓점 두 개를 잇는 면으로 자르기 =================
ans = []
for n, i, j in ((6, 0, 2), (5, 0, 2), (8, 0, 3)):
    poly1 = list(range(i, j + 1)); poly2 = list(range(j, n)) + list(range(0, i + 1))
    tot = 0
    for poly in (poly1, poly2):
        f, e, v = vef(len(poly)); assert v - e + f == 2; tot += f + e + v
    ans.append("%d개" % tot)
OUT["6-1-u2-e1-mission-4"] = ans

# ================= 개념탐구 2: 육각기둥의 선을 전개도로 =================
HP, HF = prism(regular(6, 1, 120), 2.6)
H = 2.6
def on_face(P, F, k, p):
    f = F[k]; n = out_normal(P, f, mean(P))
    return abs(dot(n, sub(p, P[f[0]]))) < 1e-9
X1 = [HP[1][0], HP[1][1], H * 2 / 3]; X2 = [HP[0][0], HP[0][1], H / 3]
hpath = [(0, HP[0], HP[2]), (3, HP[2], X1), (2, X1, X2), (7, X2, HP[11]), (1, HP[11], HP[9]), (5, HP[9], HP[4]), (0, HP[4], HP[1])]
for k, a, b in hpath: assert on_face(HP, HF, k, a) and on_face(HP, HF, k, b)
for s1, s2 in zip(hpath, hpath[1:]): assert norm(sub(s1[2], s2[1])) < 1e-12
assert norm(sub(hpath[0][1], HP[0])) < 1e-12 and norm(sub(hpath[-1][2], HP[1])) < 1e-12   # ㄱ에서 시작, ㄴ에서 끝
# 뒤쪽 세 옆면(3→2→7)을 이어 펼치면 곧은 선
pos = unfold(HP, HF, 3, [(3, 2), (2, 7)])
pts = [to2(HP, HF, pos, 3, HP[2]), to2(HP, HF, pos, 3, X1), to2(HP, HF, pos, 2, X2), to2(HP, HF, pos, 7, HP[11])]
for p in pts[1:3]:
    t = seg_cross(pts[0], pts[3], p, add(p, [0, 1]))
    assert abs((pts[0][0] + (pts[3][0]-pts[0][0]) * t[0]) - p[0]) < 1e-9 and abs((pts[0][1] + (pts[3][1]-pts[0][1]) * t[0]) - p[1]) < 1e-9
ans = []
for order, top, bot in (([4, 3, 2, 1, 0, 5], 3, 1), ([1, 0, 5, 4, 3, 2], 0, 3), ([0, 5, 4, 3, 2, 1], 4, 2)):
    tree = [(2 + order[k-1], 2 + order[k]) for k in range(1, 6)] + [(2 + top, 0), (2 + bot, 1)]
    pos = unfold(HP, HF, 2 + order[0], tree); assert valid_net(HF, pos)
    # 윗면은 ㄱ·ㄴ 쪽 변과 마주 보는 앞 옆면(face 5)에 붙어야 원문과 같은 배치 v0
    cnt = {'top': 0, 'front': 0, 'back': 0, 'bottom': 0}
    for k, a, b in hpath:
        cnt['top' if k == 0 else 'bottom' if k == 1 else 'front' if k == 5 else 'back'] += 1
    assert cnt == {'top': 2, 'front': 1, 'back': 3, 'bottom': 1}
    ans.append("전개도의 윗면에 선분 2개, 앞 옆면에 선분 1개, 뒤쪽 옆면 3개에 걸친 곧은 선, 아랫면에 선분 1개")
OUT["6-1-u2-e2-exploration-1"] = ans

# ================= Mission 3(개념탐구 2): 사다리꼴 밑면 사각기둥 =================
ans = []
for t, b, h, L, sl in ((3, 9, 8, 12, 10), (2, 8, 8, 11, 10), (4, 9, 12, 10, 13)):
    assert (b - t) ** 2 + h ** 2 == sl ** 2      # 기운 변의 길이
    P = [[0, 0, h], [t, 0, h], [b, 0, 0], [0, 0, 0], [0, L, h], [t, L, h], [b, L, 0], [0, L, 0]]
    F = [[0, 1, 5, 4], [0, 1, 2, 3], [4, 5, 6, 7], [1, 2, 6, 5], [0, 3, 7, 4], [3, 2, 6, 7]]
    tree = [(0, 2), (0, 3), (2, 4), (4, 5), (5, 1)]
    pos = unfold(P, F, 0, tree); assert valid_net(F, pos)
    # 선: ㄴ(0)→ㄹ(5) 윗면, ㄹ→ㄱ 아래 꼭짓점(7) 뒤 밑면, 7→ㄴ 왼쪽 옆면
    for k, a, c in ((0, 0, 5), (2, 5, 7), (4, 7, 0)): assert a in F[k] and c in F[k]
    # 뒤 밑면은 윗면의 변 ㄱㄹ에, 왼쪽 옆면은 뒤 밑면의 ㄱ·7 변에 붙음
    assert set(F[2]) & set(F[0]) == {4, 5} and set(F[4]) & set(F[2]) == {4, 7}
    ans.append("뒤쪽 밑면에 ㄹ에서 ㄱ 아래 꼭짓점까지의 선분, 왼쪽 옆면에 그 꼭짓점에서 ㄴ까지의 선분")
OUT["6-1-u2-e2-mission-3"] = ans

# ================= 개념탐구 3: 모든 모서리가 같은 각뿔의 전개도 가짓수 =================
def eqpyr(n):
    base = regular(n, 1, 90 + 180 / n); R = 1 / (2 * math.sin(math.pi / n)); return pyramid(base, [0, 0, math.sqrt(1 - R * R)])
ans = []
for n, expect_cls in ((4, {4: 1, 3: 1, 2: 4, 1: 2}), (3, None), (5, {5: 1, 4: 1, 3: 5, 2: 5, 1: 3})):
    P, F = eqpyr(n); nets = all_nets(P, F); cl = {}
    for g, pos in nets:
        cl.setdefault(canon(F, pos), sum(1 for e in g if e[0] == 0))
    if expect_cls:
        got = {}
        for v in cl.values(): got[v] = got.get(v, 0) + 1
        assert got == expect_cls, got
    ans.append("%d가지" % len(cl))
OUT["6-1-u2-e3-exploration-1"] = ans

# ================= 예제 3-2: 각뿔 전개도에 삼각형 하나 붙이기 =================
def partpyr(n, L):
    base = regular(n, 1, 90); R = 1 / (2 * math.sin(math.pi / n)); return pyramid(base, [0, 0, math.sqrt(L * L - R * R)])
def boundary_labels(F, tree, pos, sf, sv):
    glued = set()
    for p, c in tree:
        sh = tuple(sorted(k for k in F[c] if k in F[p])); glued.add((p, sh)); glued.add((c, sh))
    Rr = lambda q: (round(q[0], 6), round(q[1], 6))
    nbr = {}; rep = {}
    for k in pos:
        f = F[k]
        for v in f: rep.setdefault(Rr(pos[k][v]), (k, v))
        for i in range(len(f)):
            a, b = f[i], f[(i+1) % len(f)]
            if (k, tuple(sorted((a, b)))) in glued: continue
            pa, pb = Rr(pos[k][a]), Rr(pos[k][b]); nbr.setdefault(pa, []).append(pb); nbr.setdefault(pb, []).append(pa)
    s = Rr(pos[sf][sv]); seq = [s]; cur, nx = s, nbr[s][0]
    while nx != s:
        seq.append(nx); nn = [q for q in nbr[nx] if q != cur]; assert len(nn) == 1; cur, nx = nx, nn[0]
    area = sum(seq[i][0]*seq[(i+1) % len(seq)][1] - seq[(i+1) % len(seq)][0]*seq[i][1] for i in range(len(seq)))
    if area > 0: seq = [seq[0]] + seq[1:][::-1]     # 화면에서 시계 반대 방향으로 이름 붙임
    return seq, rep, Rr
PART = [  # (n, 붙인 면, 빠진 옆면, 생성기 이름표, 생성기 밑변 이름)
    (5, [(0, 1), (0, 4), (4, 5), (4, 3)], 2, [(1,5,'ㄱ'),(0,1,'ㄴ'),(0,2,'ㄷ'),(0,3,'ㄹ'),(3,2,'ㅁ'),(4,5,'ㅂ'),(5,0,'ㅅ'),(0,4,'ㅇ'),(0,0,'ㅈ')], 'ㄴㄷ'),
    (4, [(0, 1), (0, 3), (3, 4)], 2, [(1,4,'ㄱ'),(0,1,'ㄴ'),(0,2,'ㄷ'),(3,4,'ㄹ'),(4,0,'ㅁ'),(0,3,'ㅂ'),(0,0,'ㅅ')], 'ㄴㄷ'),
    (6, [(0, 2), (0, 5), (5, 4), (4, 3), (5, 6)], 1, [(2,6,'ㄱ'),(0,2,'ㄴ'),(0,3,'ㄷ'),(0,4,'ㄹ'),(4,3,'ㅁ'),(3,2,'ㅂ'),(5,6,'ㅅ'),(6,0,'ㅇ'),(0,5,'ㅈ'),(0,0,'ㅊ'),(0,1,'ㅋ')], 'ㅊㅋ')]
ans = []
for n, tree, miss, glab, gbase in PART:
    P, F = partpyr(n, 1.6); pos = unfold(P, F, 0, tree); assert valid_net(F, pos)
    seq, rep, Rr = boundary_labels(F, tree, pos, tree[0][1], n)
    lab = {q: KO[i] for i, q in enumerate(seq)}
    assert [(rep[q][0], rep[q][1], lab[q]) for q in seq] == glab   # 그림의 이름표와 같은지
    got = []
    for i in range(len(seq)):
        a, b = seq[i], seq[(i+1) % len(seq)]
        for k in pos:
            vs = [v for v in F[k] if Rr(pos[k][v]) in (a, b)]
            if len(vs) != 2: continue
            other = [m for m in range(len(F)) if m != k and set(vs) <= set(F[m])][0]
            if other == miss and valid_net(F, unfold(P, F, 0, tree + [(k, miss)])):
                got.append(''.join(sorted((lab[a], lab[b]), key=KO.index)))
            if other == miss and k == 0: assert ''.join(sorted((lab[a], lab[b]), key=KO.index)) == gbase
    got.sort(key=lambda x: (KO.index(x[0]), KO.index(x[1])))
    assert len(got) == 3
    ans.append(', '.join('선분 ' + x for x in got))
OUT["6-1-u2-e3-example-3-2"] = ans

# ================= 예제 3-3: 직사각형 밑면 사각뿔 =================
ans = []
for a, b, L in ((8, 10, 12), (6, 9, 10), (7, 10, 13)):
    hh = math.sqrt(L * L - (a * a + b * b) / 4)
    P, F = pyramid([[-b/2, a/2], [b/2, a/2], [b/2, -a/2], [-b/2, -a/2]], [0, 0, hh])
    d, cnt = perim_diff(P, F); ans.append("%d cm" % d)
OUT["6-1-u2-e3-example-3-3"] = ans

# ================= 예제 3-4: 각뿔 모서리 합 → 각기둥 높이 =================
ans = []
for L, b, tot in ((8, 3, 187), (9, 2, 165), (10, 4, 182)):
    sols = [n for n in range(3, 200) if n * (L + b) == tot]; assert len(sols) == 1; n = sols[0]
    h = Fr(tot - 2 * n * b, n); assert h > 0
    ans.append("%s cm" % frac_txt(h))
OUT["6-1-u2-e3-example-3-4"] = ans

# ================= Mission 2(개념탐구 3): 육각뿔 =================
ans = []
for a, L in ((9, 15), (8, 12), (6, 11)):
    P, F = pyramid(regular(6, a, 0), [0, 0, math.sqrt(L * L - a * a)])
    d, cnt = perim_diff(P, F); ans.append("%d cm" % d)
OUT["6-1-u2-e3-mission-2"] = ans

# ================= Mission 4(개념탐구 3): 두 전개도 =================
ans = []
for n in (5, 6, 4):
    # 가: n각형 2개 + 직사각형 n개 → n각기둥, 나: n각형 1개 + 삼각형 n개 → n각뿔 (실제로 접히는지 확인)
    P1, F1 = prism(regular(n, 1, 90), 1.5 if n == 4 else 1)
    tr1 = [(0, 2 + i) for i in range(n)] + [(2 + n // 2, 1)]; assert valid_net(F1, unfold(P1, F1, 0, tr1))
    R = 1 / (2 * math.sin(math.pi / n)); P2, F2 = pyramid(regular(n, 1, 90), [0, 0, math.sqrt(1.6**2 - R*R)])
    tr2 = [(i, i + 1) for i in range(1, n)] + [(1 + (n - 1) // 2, 0)]; assert valid_net(F2, unfold(P2, F2, 1, tr2))
    V1, Fa1 = len(P1), len(F1); E1 = len(dual_edges(F1)); V2, Fa2 = len(P2), len(F2); E2 = len(dual_edges(F2))
    assert V1 - E1 + Fa1 == 2 and V2 - E2 + Fa2 == 2
    ans.append(frac_txt(Fr(Fa1 + E1, V1) + Fr(Fa2 + E2, V2)))
OUT["6-1-u2-e3-mission-4"] = ans

# ================= 개념탐구 4: 정팔면체 색칠 부분 =================
OP = [[0, 0, 1], [0, -1, 0], [1, 0, 0], [0, 1, 0], [-1, 0, 0], [0, 0, -1]]
OF = [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1], [5, 2, 1], [5, 3, 2], [5, 4, 3], [5, 1, 4]]
ans = []
for tree in ([(0,4),(4,5),(5,6),(6,2),(2,3),(0,1),(3,7)], [(0,1),(1,2),(2,3),(0,4),(1,5),(5,6),(3,7)], [(0,4),(4,5),(5,1),(1,2),(2,6),(6,7),(7,3)]):
    assert order_tree(8, tree, 0) is not None
    pos = unfold(OP, OF, 0, tree); assert valid_net(OF, pos)
    spots = set(); faces = 0
    for k in pos:
        if 1 in OF[k]:
            faces += 1; spots.add((round(pos[k][1][0], 6), round(pos[k][1][1], 6)))
    assert faces == 4
    # 원문 v0: ㄴ이 되는 점이 두 곳(ㄴ 표시 꼭짓점과 오른쪽 끝)
    ans.append("전개도에서 점 ㄴ이 되는 꼭짓점 %d곳에서, 그 점에 모인 정삼각형마다 ㄴ과 두 모서리의 가운데 점을 이은 작은 삼각형 4개를 색칠" % len(spots))
OUT["6-1-u2-e4-exploration-1"] = ans

# ================= Mission 2(개념탐구 4): 삼각뿔 =================
def tetra(L, s, base):
    yb = -math.sqrt(s * s - base * base / 4); cy = (yb * yb - base * base / 4) / (2 * yb)
    hh = math.sqrt(L * L - (base * base / 4 + cy * cy))
    return [[0, cy, hh], [-base/2, 0, 0], [0, yb, 0], [base/2, 0, 0]], [[1, 2, 3], [0, 2, 3], [0, 1, 2], [0, 1, 3]]
ans = []
for L, s, base in ((5, 3, 4), (7, 4, 6), (8, 5, 6)):
    P, F = tetra(L, s, base)
    for i, j, want in ((0, 1, L), (0, 2, L), (0, 3, L), (1, 2, s), (2, 3, s), (1, 3, base)): assert abs(norm(sub(P[i], P[j])) - want) < 1e-9
    pos = unfold(P, F, 0, [(0, 1), (0, 2), (2, 3)]); assert valid_net(F, pos)
    # 겉면이 보이도록 펼쳤을 때, 4 cm 변(ㄴㄹ)의 왼쪽 끝이 ㄹ이고 ㄱㄷ 변이 있는 삼각형이 ㄹ 쪽에 붙음
    M1 = lerp(P[0], P[2], 0.5); M2 = lerp(P[0], P[3], 0.5)
    for k, a, b in ((1, P[3], M1), (1, M1, M2), (3, M2, P[1])):
        n_ = out_normal(P, F[k], mean(P)); assert abs(dot(n_, sub(a, P[F[k][0]]))) < 1e-9 and abs(dot(n_, sub(b, P[F[k][0]]))) < 1e-9
    # 밑면 ㄴㄷㄹ을 바깥(아래)에서 볼 때 ㄹ→ㄴ을 오른쪽으로 두면 ㄷ은 아래, ㄱㄷㄹ 면은 왼쪽에 놓임
    A_, B_, C_ = pos[0][3], pos[0][1], pos[0][2]
    d = sub(B_, A_); c = sub(C_, A_); assert d[0] * c[1] - d[1] * c[0] > 0     # 화면(y 아래)에서 ㄷ이 ㄹㄴ의 아래쪽
    gl = mean([pos[1][v] for v in F[1]]); assert dot(sub(gl, mean([A_, B_, C_])), d) < 0   # ㄱㄷㄹ 면은 ㄹ 쪽(왼쪽)
    ans.append("옆면 ㄱㄷㄹ에 선분 2개(ㄹ에서 ㄱㄷ의 가운뎃점, 그 점에서 ㄱㄹ의 가운뎃점), 옆면 ㄱㄴㄹ에 선분 1개(ㄱㄹ의 가운뎃점에서 ㄴ)")
OUT["6-1-u2-e4-mission-2"] = ans

# ================= Mission 3(개념탐구 4): 사각뿔 가장 짧은 선 =================
SP, SF = pyramid([[-2, -2], [2, -2], [2, 2], [-2, 2]], [0, 0, math.sqrt(36 - 8)])
Bp = lerp(SP[4], SP[0], 0.5); Sp = lerp(SP[0], SP[3], 0.5)
def chain_len(seq, start, end, cross_edges):
    tree = [(seq[i], seq[i+1]) for i in range(len(seq) - 1)]
    pos = unfold(SP, SF, seq[0], tree)
    p = to2(SP, SF, pos, seq[0], start); q = to2(SP, SF, pos, seq[-1], end)
    for k, (i, j) in zip(seq, cross_edges):
        r = seg_cross(p, q, pos[k][i], pos[k][j])
        if r is None or not (-1e-9 <= r[0] <= 1 + 1e-9 and -1e-9 <= r[1] <= 1 + 1e-9): return None
    return norm(sub(q, p))
best = chain_len([1, 2, 0], Bp, Sp, [(4, 1), (1, 2)])           # ㄱㄴㄷ → ㄱㄷㄹ → 밑면
other = chain_len([4, 3, 2, 0], Bp, Sp, [(4, 3), (4, 2), (1, 2)])  # ㄱㅁㄴ → ㄱㄹㅁ → ㄱㄷㄹ → 밑면
assert best is not None and (other is None or other > best)
ans = []
for tree in ([(0,2),(2,1),(0,4),(0,3)], [(0,2),(2,1),(0,3),(3,4)], [(0,2),(2,1),(1,4),(0,3)]):
    pos = unfold(SP, SF, 0, tree); assert valid_net(SF, pos)
    assert (0, 2) in tree and (2, 1) in tree        # 세 면이 차례로 붙어 있어 곧은 선 하나로 그려짐
    ans.append("옆면 ㄱㄴㄷ의 ㅂ(ㄱㄴ의 가운데 점)에서 옆면 ㄱㄷㄹ을 지나 밑면의 ㅅ(ㄴㅁ의 가운데 점)까지 곧게 이은 선")
OUT["6-1-u2-e4-mission-3"] = ans

# ================= Mission 6(개념탐구 4): 정사면체 네 면을 지나는 가장 짧은 닫힌 선 =================
ans = []
for a, u in ((3, 1), (4, 1), (5, 2)):
    R = a / math.sqrt(3); hh = math.sqrt(a * a - R * R)
    P = [[0, 0, hh]] + [[R * math.cos(math.radians(d)), R * math.sin(math.radians(d)), 0] for d in (-150, -30, 90)]
    F = [[0, 1, 2], [0, 2, 3], [1, 2, 3], [0, 1, 3]]
    G = lerp(P[0], P[1], u / a)
    best = None
    for first in (0, 3):                      # ㄱ이 있는 모서리 0-1을 가진 두 면에서 출발
        last = 3 if first == 0 else 0
        for mid in itertools.permutations([1, 2]):
            seq = [first, *mid, last]
            if any(len(set(F[seq[i]]) & set(F[seq[i+1]])) != 2 for i in range(3)): continue
            tree = [(seq[i], seq[i+1]) for i in range(3)]
            pos = unfold(P, F, seq[0], tree)
            p = to2(P, F, pos, seq[0], G); q = to2(P, F, pos, seq[-1], G)
            ok = True
            for i in range(3):
                e = sorted(set(F[seq[i]]) & set(F[seq[i+1]]))
                r = seg_cross(p, q, pos[seq[i]][e[0]], pos[seq[i]][e[1]])
                if r is None or not (1e-9 < r[0] < 1 - 1e-9 and -1e-9 <= r[1] <= 1 + 1e-9): ok = False
            if ok:
                Ls = norm(sub(q, p)); best = Ls if best is None else min(best, Ls)
    assert best is not None
    ans.append("%d cm" % near_int(best))
OUT["6-1-u2-e4-mission-6"] = ans

# ================= 원본에 없는 조건 문장 점검 (2026-11-23 원본 복원) =================
# 예제 1-2, 개념탐구 2, Mission 2·6(개념탐구 4)의 해석 문장은 문제에서 빼고 풀이 앞 "풀이 기준"으로만 둡니다.
import os, re
_src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "source-6-1-u12-original.js"), encoding="utf-8").read()
assert "조건 보충" not in _src and "NOTE(" not in _src, "문제에 원본에 없는 '※ 조건 보충' 문장이 남아 있습니다."
for fn in ("ex12", "e2exp", "e4m2", "e4m6"):
    body = re.search(r"function %s\(.*?\n\n" % fn, _src, re.S).group(0)
    prompt_part, solution_part = body.split("solution:", 1)
    assert "BASIS(" not in prompt_part and solution_part.lstrip().startswith("BASIS("), fn + ": 풀이 기준이 풀이 앞에 있지 않습니다."

print("AUDIT " + json.dumps(OUT, ensure_ascii=False))
