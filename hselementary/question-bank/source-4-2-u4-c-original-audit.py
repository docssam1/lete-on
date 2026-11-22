# 독립 감사: 황소 4-2 4단원 사각형 개념탐구 7·8 원문 구조 유형 (source-4-2-u4-c-original.js)
# python3 -I 로 실행. 표준 라이브러리만 사용. 마지막 줄에 AUDIT {...} 를 출력한다.
import json, math
from fractions import Fraction as Fr
from itertools import combinations, permutations, product

OUT = {}

# ---------- 공통: 칸 모음의 둘레(칸 경계 중 한쪽만 칠해진 변의 수) ----------
def cells_perimeter(cells, unit):
    edges = 0
    for (x, y) in cells:
        for nb in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
            if nb not in cells: edges += 1
    return edges * unit

def square_cells(x0, y0, side):
    return {(x0+i, y0+j) for i in range(side) for j in range(side)}

# ---------- 예제 7-3: 반씩 겹친 정사각형 n장 (정사각형 축 방향 좌표, 칸 = a cm) ----------
def overlap_chain(s, a, n):
    assert s == 2*a
    cells = set(); k = s//a
    for i in range(n):
        cells |= square_cells(i, -i, k)   # 다음 장은 두 축 방향으로 a씩 이동
    # 이웃한 두 장의 겹친 부분이 한 변 a인 정사각형인지 확인
    A = square_cells(0, 0, k); B = square_cells(1, -1, k)
    assert len(A & B) == 1
    return cells_perimeter(cells, a)
OUT['4-2-u4-t7-4'] = [f'{overlap_chain(s,a,n)} cm' for s, a, n in ((2,1,18),(4,2,15),(6,3,12))]

# ---------- 예제 7-4: 정사각형 붙인 도형 — 크기를 미지수로 두고 모든 후보 탐색 ----------
def solve74(g):
    sols = []
    # 반 cm 단위 정수 탐색: 나 = n, 가장 작은 오른쪽 정사각형 = t
    G = 2*g
    for n in range(1, 20*g):
        for t in range(1, 20*g):
            big = 2*G                      # 가 두 개 높이의 정사각형
            if 2*n != big+G: continue      # 나 두 개 = 큰 정사각형 + 가
            H = n+4*G
            c = 3*t; d = 2*t
            if c+2*t+t != H: continue
            W = 2*n+c
            pieces = [(0,0,n),(n,0,n),(2*n,0,c),(0,n,big),(big,n,G),(big,n+G,G),(big,n+2*G,G),(big,n+3*G,G),(0,n+big,big),
                      (2*n,c,t),(2*n,c+t,t),(2*n+t,c,d),(2*n,c+2*t,t),(2*n+t,c+2*t,t),(2*n+2*t,c+2*t,t)]
            cov = {}
            ok = True
            for x, y, sd in pieces:
                for i in range(sd):
                    for j in range(sd):
                        if (x+i, y+j) in cov: ok = False
                        cov[(x+i, y+j)] = 1
            if ok and len(cov) == W*H and all(0 <= x < W and 0 <= y < H for x, y in cov):
                sols.append((Fr(n, 2), Fr(d, 2)))
    assert len(sols) == 1, sols
    n, d = sols[0]
    assert n.denominator == 1 and d.denominator == 1
    return f'나 {n} cm, 다 {d} cm'
OUT['4-2-u4-t7-5'] = [solve74(g) for g in (6, 12, 18)]

# ---------- Mission 1: 각 ㄱㄷㄴ + 각 ㄱㅁㄴ ----------
def m1(k):
    w = 3*k; md = k; nm = w-md
    s = math.degrees(math.atan2(k, w)) + math.degrees(math.atan2(k, nm))
    assert abs(s-round(s)) < 1e-9
    return f'{round(s)}°'
OUT['4-2-u4-t7-6'] = [m1(k) for k in (3, 4, 5)]

# ---------- Mission 2: 순서대로 만든 정사각형 — 정수 크기 전수 탐색 후 칸 덮기 확인 ----------
def m2(W, H):
    sols = []
    for a in range(1, W):
        for b in range(1, W):
            for c in range(1, W):
                for d in range(1, W):
                    if a+b != W or b+c+a != H: continue
                    s = W-2*c; sh = b+c-a
                    if s <= 0 or s != sh: continue
                    pieces = [(0,0,a,a),(a,0,b,b),(W-c,b,c,c),(W-a,b+c,a,a),(0,H-b,b,b),(0,a,c,c),(a,b,d,d),(c,b+c,d,d),(c,a,s,s)]
                    cov = set(); ok = True
                    for x, y, w, h in pieces:
                        for i in range(w):
                            for j in range(h):
                                if (x+i, y+j) in cov or not (0 <= x+i < W and 0 <= y+j < H): ok = False
                                cov.add((x+i, y+j))
                    if ok and len(cov) == W*H: sols.append(s)
    assert len(sols) == 1, sols
    return f'{4*sols[0]} cm'
OUT['4-2-u4-t7-7'] = [m2(W, H) for W, H in ((11, 15), (22, 30), (33, 45))]

# ---------- Mission 3: 좌표로 각 ㅂㅅㄹ 계산 ----------
def m3(theta):
    G, R = (0.0, 1.0), (1.0, 1.0); D = (1.0, 0.0)
    M = (0.5, 1+math.sqrt(3)/2)
    t = math.radians(theta)
    B = (1-math.sin(t), 1-math.cos(t))           # ㄹ에서 ㄹㄷ 방향으로부터 theta만큼 돌린 점 (ㄹㅂ=ㄹㄷ)
    assert 0 < B[0] < 1 and 0 < B[1] < 1
    u = (1-M[1])/(B[1]-M[1]); S = (M[0]+u*(B[0]-M[0]), 1.0)
    assert 0 < S[0] < 1
    v1 = (B[0]-S[0], B[1]-S[1]); v2 = (R[0]-S[0], R[1]-S[1])
    ang = math.degrees(math.acos((v1[0]*v2[0]+v1[1]*v2[1])/math.hypot(*v1)/math.hypot(*v2)))
    assert abs(ang-round(ang)) < 1e-7
    return f'{round(ang)}°'
OUT['4-2-u4-t7-8'] = [m3(t) for t in (60, 40, 20)]

# ---------- Mission 4: 점판 정사각형 — 네 점 조합 전수 검사 ----------
def board(rows):
    D = [(x, y) for y, r in enumerate(rows) for x, c in enumerate(r) if c == 'X']
    cnt = 0
    for q in combinations(D, 4):
        ds = sorted((a[0]-b[0])**2+(a[1]-b[1])**2 for a, b in combinations(q, 2))
        if ds[0] > 0 and ds[0] == ds[1] == ds[2] == ds[3] and ds[4] == ds[5] == 2*ds[0]: cnt += 1
    return f'{cnt}개'
OUT['4-2-u4-t7-9'] = [board(r) for r in (['.XX.','XXXX','XXXX','.XX.'], ['.XX.','XXXX','XXXX','XXXX','.XX.'], ['.XXXX.','XXXXXX','XXXXXX','.XXXX.'])]

# ---------- Mission 5: 지그재그로 이어 붙인 정사각형 (칸 = s cm) ----------
def zigper(s, n):
    cells = set(); x = y = 0
    for i in range(n):
        assert (x, y) not in cells
        cells.add((x, y))
        if i % 2 == 0: x += 1
        else: y += 1
    return f'{cells_perimeter(cells, s)} cm'
OUT['4-2-u4-t7-10'] = [zigper(s, n) for s, n in ((6, 30), (5, 24), (4, 40))]

# ---------- Mission 6: 바람개비 모양 정사각형 — 조각 크기 전수 탐색 ----------
def m6(P, q):
    S = P//4; assert S*4 == P
    sols = []
    for w in range(1, S):
        for L in range(1, S):
            rects = [(0,0,L,w),(L,0,L,w),(S-w,0,w,L),(S-w,L,w,L),(w,S-w,L,w),(w+L,S-w,L,w),(0,w,w,L),(0,w+L,w,L),(w,w,q,q)]
            cov = set(); ok = True
            for x, y, a, b in rects:
                for i in range(a):
                    for j in range(b):
                        if (x+i, y+j) in cov or not (0 <= x+i < S and 0 <= y+j < S): ok = False
                        cov.add((x+i, y+j))
            if ok and len(cov) == S*S: sols.append((w, L))
    assert len(sols) == 1, sols
    w, L = sols[0]
    return f'㉠ {w} cm, ㉡ {L} cm'
OUT['4-2-u4-t7-11'] = [m6(P, q) for P, q in ((68, 11), (80, 12), (92, 13))]

# ---------- 사각형 세기 공통: 점 4개 조합 전수 검사 ----------
def cr(o, a, b): return (a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0])
def seg_x(s, t):
    (p, q), (r, u) = s, t
    d = (q[0]-p[0])*(u[1]-r[1])-(q[1]-p[1])*(u[0]-r[0])
    if d == 0: return None
    a = Fr((r[0]-p[0])*(u[1]-r[1])-(r[1]-p[1])*(u[0]-r[0]))/d
    b = Fr((r[0]-p[0])*(q[1]-p[1])-(r[1]-p[1])*(q[0]-p[0]))/d
    if 0 <= a <= 1 and 0 <= b <= 1: return (p[0]+a*(q[0]-p[0]), p[1]+a*(q[1]-p[1]))
    return None
def on_drawn(p, q, segs):
    # 작은 선분 pq가 어떤 그린 선분 위에(같은 직선, 범위 안) 놓이는가
    for a, b in segs:
        if cr(a, b, p) == 0 and cr(a, b, q) == 0 and all(min(a[i], b[i]) <= min(p[i], q[i]) and max(p[i], q[i]) <= max(a[i], b[i]) for i in (0, 1)): return True
    return False
def count_quads(segs, test):
    segs = [((Fr(a[0]), Fr(a[1])), (Fr(b[0]), Fr(b[1]))) for a, b in segs]
    pts = set(p for s in segs for p in s)
    for s, t in combinations(segs, 2):
        x = seg_x(s, t)
        if x: pts.add(x)
    pts = list(pts)
    memo = {}
    def edge(P, Q):
        k = (P, Q) if P < Q else (Q, P)
        if k in memo: return memo[k]
        on = sorted([R for R in pts if cr(P, Q, R) == 0 and min(P[0], Q[0]) <= R[0] <= max(P[0], Q[0]) and min(P[1], Q[1]) <= R[1] <= max(P[1], Q[1])])
        ok = all(on_drawn(a, b, segs) for a, b in zip(on, on[1:]))
        memo[k] = ok; return ok
    # 같은 선 위에 이웃한 두 점끼리 연결 가능한 쌍 (가지치기용)
    n = 0
    for q4 in combinations(pts, 4):
        a = q4[0]
        for b, c, d in ((q4[1], q4[2], q4[3]), (q4[1], q4[3], q4[2]), (q4[2], q4[1], q4[3])):
            Q = (a, b, c, d)
            if any(cr(Q[i-1], Q[i], Q[(i+1) % 4]) == 0 for i in range(4)): continue
            # 단순 다각형: 마주 보는 변끼리 교차하지 않음
            def X(p1, p2, p3, p4): return cr(p3, p4, p1)*cr(p3, p4, p2) < 0 and cr(p1, p2, p3)*cr(p1, p2, p4) < 0
            if X(a, b, c, d) or X(b, c, d, a): continue
            if not all(edge(Q[i], Q[(i+1) % 4]) for i in range(4)): continue
            if test(Q): n += 1
    return n
def convex(Q):
    s = [cr(Q[i-1], Q[i], Q[(i+1) % 4]) for i in range(4)]
    return all(v > 0 for v in s) or all(v < 0 for v in s)
def par(u, v): return u[0]*v[1]-u[1]*v[0] == 0
def sides(Q): return [(Q[(i+1) % 4][0]-Q[i][0], Q[(i+1) % 4][1]-Q[i][1]) for i in range(4)]
def is_para(Q): v = sides(Q); return par(v[0], v[2]) and par(v[1], v[3])
def is_trap(Q): v = sides(Q); return convex(Q) and (par(v[0], v[2]) or par(v[1], v[3]))
def is_rect(Q): v = sides(Q); return is_para(Q) and v[0][0]*v[1][0]+v[0][1]*v[1][1] == 0
ANY = lambda Q: True

def unit_grid(cols, rows, drop=lambda *a: False):
    s = []
    for y in range(rows+1):
        for x in range(cols):
            if not drop('h', x, y): s.append(((x, y), (x+1, y)))
    for x in range(cols+1):
        for y in range(rows):
            if not drop('v', x, y): s.append(((x, y), (x, y+1)))
    return s
def cells_segs(cells):
    s = set()
    for x, y in cells:
        s |= {((x, y), (x+1, y)), ((x, y+1), (x+1, y+1)), ((x, y), (x, y+1)), ((x+1, y), (x+1, y+1))}
    return sorted(s)

# 개념탐구 8: 왼쪽 위 1칸, 위쪽 오른쪽 한 덩어리, 왼쪽 아래 한 덩어리, 오른쪽 아래 m×n 칸
def explore(m, n):
    drop = lambda t, x, y: (t == 'v' and 1 < x < m+1 and y == 0) or (t == 'h' and 1 < y < n+1 and x == 0)
    return count_quads(unit_grid(m+1, n+1, drop), is_rect)
OUT['4-2-u4-t8'] = [f'{explore(m, n)}개' for m, n in ((2, 2), (3, 2), (3, 3))]

# 예제 8-1: 작은 평행사변형 n개 + 각각 두 대각선
def strip(n):
    s = [((0, 0), (2*n, 0)), ((1, 1), (2*n+1, 1))]
    for i in range(n+1): s.append(((2*i, 0), (2*i+1, 1)))
    for i in range(n): s += [((2*i, 0), (2*i+3, 1)), ((2*i+1, 1), (2*i+2, 0))]
    return count_quads(s, is_para)
OUT['4-2-u4-t8-2'] = [f'{strip(n)}개' for n in (3, 4, 5)]

# 예제 8-2: 계단 모양 모눈 (직접 직사각형 좌표 전수)
def stair_rects(cells):
    xs = range(0, max(x for x, _ in cells)+2); ys = range(0, max(y for _, y in cells)+2)
    n = 0
    for x1, x2 in combinations(xs, 2):
        for y1, y2 in combinations(ys, 2):
            if all((x, y) in cells for x in range(x1, x2) for y in range(y1, y2)): n += 1
    return n
def e82(tc, tr, bc, br):
    cells = {(x, y) for x in range(tc) for y in range(tr)} | {(x, tr+y) for x in range(bc) for y in range(br)}
    a = stair_rects(cells)
    if tc*tr+bc*br <= 30:
        assert a == count_quads(cells_segs(cells), is_rect)
    return a
OUT['4-2-u4-t8-3'] = [f'{e82(*c)}개' for c in ((4, 2, 7, 3), (3, 2, 6, 2), (4, 3, 6, 3))]

# 예제 8-3: 모눈 + 빗금 선 두 개, 사각형 전체(오목 포함)
def e83(cols, rows, dA, dB):
    return count_quads(unit_grid(cols, rows)+[dA, dB], ANY)
OUT['4-2-u4-t8-4'] = [f'{e83(*c)}개' for c in ((3, 3, ((0, 0), (1, 1)), ((3, 1), (2, 3))), (4, 3, ((0, 0), (1, 1)), ((4, 1), (3, 3))), (3, 4, ((0, 0), (1, 1)), ((3, 2), (2, 4))))]

# 예제 8-4 / Mission 2: 표시된 칸(가로 cx번째, 세로 cy번째)을 포함하는 직사각형
def contain(cols, rows, cx, cy):
    n = 0
    for x1, x2 in combinations(range(cols+1), 2):
        for y1, y2 in combinations(range(rows+1), 2):
            if x1 <= cx-1 < x2 and y1 <= cy-1 < y2: n += 1
    return n
OUT['4-2-u4-t8-5'] = [f'{contain(*c)}개' for c in ((5, 4, 4, 2), (6, 4, 2, 3), (5, 5, 3, 2))]

# Mission 1: 오른쪽 정렬 계단 (아래 줄부터 칸 수)
def m81(rowsL):
    W = max(rowsL); H = len(rowsL)
    cells = {(x, H-1-j) for j, L in enumerate(rowsL) for x in range(W-L, W)}
    a = stair_rects(cells)
    assert a == count_quads(cells_segs(cells), is_rect)
    return a
OUT['4-2-u4-t8-6'] = [f'{m81(r)}개' for r in ((4, 3, 2), (5, 4, 3), (4, 3, 2, 1))]

OUT['4-2-u4-t8-7'] = [f'{contain(*c)}개' for c in ((6, 4, 3, 2), (5, 4, 2, 3), (7, 3, 4, 2))]

# Mission 3: 볼록한 사각형만
def m83(cols, rows, dA, dB):
    return count_quads(unit_grid(cols, rows)+[dA, dB], convex)
OUT['4-2-u4-t8-8'] = [f'{m83(*c)}개' for c in ((4, 4, ((1, 0), (4, 3)), ((0, 2), (1, 1))), (4, 3, ((1, 0), (4, 3)), ((0, 2), (1, 1))), (4, 4, ((1, 0), (3, 2)), ((0, 2), (1, 1))))]

# Mission 4: 직사각형 안 삼각형 격자, 평행사변형(직사각형 포함) — 실제 그림 비율(세로 2배)로 좌표
def m84(k):
    W = 2*k
    s = [((0, 0), (W, 0)), ((0, 4), (W, 4)), ((0, 0), (0, 4)), ((W, 0), (W, 4)), ((1, 2), (W-1, 2))]
    for i in range(k): s += [((2*i, 0), (2*i+2, 4)), ((2*i, 4), (2*i+2, 0))]
    return count_quads(s, is_para)
OUT['4-2-u4-t8-9'] = [f'{m84(k)}개' for k in (4, 3, 5)]

# Mission 5: 겹겹이 놓인 직사각형 m개 + 가운데 가로·세로선
def m85(m):
    X = 2*m+2; Y = m+1; s = []
    for i in range(m):
        a, b, c, d = 2*i, 2*X-2*i, i, 2*Y-i
        s += [((a, c), (b, c)), ((a, d), (b, d)), ((a, c), (a, d)), ((b, c), (b, d))]
    s += [((X, 0), (X, 2*Y)), ((0, Y), (2*X, Y))]
    return count_quads(s, ANY)
OUT['4-2-u4-t8-10'] = [f'{m85(m)}개' for m in (3, 2, 4)]

# Mission 6: 꼭짓점 A에서 그은 선 r개, 가로선 h개(DE~BC) — 사다리꼴
def m86(r, h):
    A = (0, 0); s = []
    top = Fr(1, 4); ts = [top+(1-top)*Fr(i, h-1) for i in range(h)]
    for t in ts: s.append(((-t, t), (t, t)))
    for i in range(r): s.append((A, (-1+Fr(2*i, r-1), 1)))
    return count_quads(s, is_trap)
OUT['4-2-u4-t8-11'] = [f'{m86(r, h)}개' for r, h in ((5, 7), (4, 6), (6, 5))]

print('AUDIT ' + json.dumps(OUT, ensure_ascii=False))
