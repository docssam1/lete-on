# 황소 4-2 4단원 사각형 잠금 원문 유형(4-2-u4-a) 독립 검산기.
# 각 변형의 수치에서 답을 다시 계산하고(좌표·벡터 계산, 전수 탐색), 답이 하나인지 확인한다. 표준 라이브러리만 사용.
import itertools, json, math
from fractions import Fraction as F

OUT = {}
def V(deg):
    r = math.radians(deg); return (math.cos(r), math.sin(r))
def sub(p, q): return (p[0] - q[0], p[1] - q[1])
def addv(p, v, k=1.0): return (p[0] + k * v[0], p[1] + k * v[1])
def meet(p, dp, q, dq):
    det = dp[0] * (-dq[1]) - dp[1] * (-dq[0])
    s = ((q[0] - p[0]) * (-dq[1]) - (q[1] - p[1]) * (-dq[0])) / det
    return (p[0] + s * dp[0], p[1] + s * dp[1])
def angle(v, w):
    c = (v[0] * w[0] + v[1] * w[1]) / math.hypot(*v) / math.hypot(*w)
    return math.degrees(math.acos(max(-1, min(1, c))))
def rint(x):
    assert abs(x - round(x)) < 1e-6, x
    return round(x)
def mirror(p, a, b):
    v = sub(b, a); n = math.hypot(*v); v = (v[0] / n, v[1] / n); w = sub(p, a); t = w[0] * v[0] + w[1] * v[1]
    f = addv(a, v, t); return (2 * f[0] - p[0], 2 * f[1] - p[1])

# ---- 개념탐구 1 본문: 일곱 직선 ----
def e1(a, b, c, d, f, lab):
    th = math.degrees(math.acos((a + b) / (c + d)))
    D1 = (a, 0); D2 = addv((0, 0), V(th), c); N = (a + b, 0)
    dd = math.degrees(math.atan2(D2[1] - D1[1], D2[0] - D1[0]))
    P = meet(D1, V(dd), N, (0, 1)); Q = meet(P, V(dd - 90), (0, 0), V(th)); T = addv(Q, V(th), f)
    dirs = {'가': th + 90, '나': 90, '다': dd, '라': th + 90, '마': th, '바': dd - 90, '사': 0}
    perp = par = 0
    for x, y in itertools.combinations(dirs, 2):
        g = (dirs[x] - dirs[y]) % 180
        if abs(g - 90) < 1e-7: perp += 1
        if g < 1e-7 or abs(g - 180) < 1e-7: par += 1
    # 점 ㄱ에서 직선 나까지(그림), 가·라 사이(그림) 거리와 표시값 비교
    assert abs((a + b) - N[0]) < 1e-9
    gap = math.hypot(*T)
    s4 = lab['c'] + lab['d'] + lab['e'] + lab['f']
    assert abs(gap - s4) < 1.0, (gap, s4)
    return f"(1) {perp}쌍 (2) {lab['a'] + lab['b']} cm (3) {par}쌍 (4) {s4} cm"
OUT['4-2-u4-t1'] = [
    e1(8, 5, 10, 4, 5, dict(a=8, b=5, c=10, d=4, e=13, f=5)),
    e1(8, 6, 10, 5, 6, dict(a=8, b=6, c=10, d=5, e=15, f=6)),
    e1(7, 4, 9, 3, 6, dict(a=7, b=4, c=9, d=3, e=9, f=6))]

# ---- 예제 2-1: 표시각(70,114,72,110,108)에서 직선 방향을 되살린다 ----
def e21(L70, L114, L72, L110, L108):
    # 직선 가를 기준(0°)으로 각 직선의 '위쪽/오른쪽' 방향
    ma = 180 - L70               # 마의 위쪽 방향
    ba = 180 - L114              # 바의 위쪽 방향
    na = ba - L72                # 나의 오른쪽 방향
    da = ma - L110               # 다의 오른쪽 방향
    ra = ba + 180 + L108 - 360   # 라의 오른쪽 방향(바 아래쪽에서 반시계로 108° 돌면 라 오른쪽)
    ra = ra % 360
    if ra > 180: ra -= 360
    lines = {'가': 0, '나': na, '다': da, '라': ra, '마': ma, '바': ba}
    pairs = [f'{x}와 {y}' for x, y in itertools.combinations(lines, 2) if (lines[x] - lines[y]) % 180 == 0]
    g = ba - da                 # ㉠: 다 오른쪽 ↔ 바 위쪽
    h = ma - ra                 # ㉡: 라 오른쪽 ↔ 마 위쪽
    # (3) 직선 바를 따라 가·나·라에서 ㉠과 같은 위치(바 위쪽 ↔ 그 직선 오른쪽)
    s3 = sum(ba - lines[k] for k in '가나라')
    # (4) 직선 마를 따라 가·나·다에서 ㉡의 엇각(그 직선 왼쪽 ↔ 마 아래쪽) = 마 위쪽 ↔ 그 직선 오른쪽
    s4 = sum(ma - lines[k] for k in '가나다')
    return f"(1) {', '.join(pairs)} (2) ㉠ {g}°, ㉡ {h}° (3) {s3}° (4) {s4}°"
OUT['4-2-u4-t2-2'] = [e21(70, 114, 72, 110, 108), e21(65, 118, 70, 115, 110), e21(75, 110, 74, 105, 106)]

# ---- 예제 2-2: 모든 교점의 각을 전부 세기 ----
def e22(nh, npar, sl=-76, other=-67):
    lines = [0] * nh + [sl] * npar + [other]
    # ㉠: 가로선 오른쪽과 빗금선 아래쪽 사이 각 = 76°
    tgt = (-sl) % 180
    cnt = 0
    for i, j in itertools.combinations(range(len(lines)), 2):
        g = (lines[i] - lines[j]) % 180
        if g == 0: continue
        cnt += sum(1 for x in (g, 180 - g, g, 180 - g) if x == tgt)
    return f'{cnt - 1}개'
OUT['4-2-u4-t2-3'] = [e22(3, 3, other=-67), e22(3, 4, other=-66), e22(4, 2, other=-66)]

# ---- 개념탐구 4 본문: 방향을 ㄷㄹ 쪽에서부터 되짚는다 ----
def e4(N, B, G, Fv, E, H, I):
    d6 = I - 90                 # ㄷ 쪽 선의 방향(오른쪽 아래)
    d5 = d6 + 180 - H           # 120° 점을 지나는 직선
    d4 = d5 + 180 - E           # 위아래 선분(위쪽 방향)
    dh = d4 - Fv                # 오른쪽으로 그은 선분
    d3 = dh + 180 - G           # 왼쪽 아래로 뻗은 직선(오른쪽 위 방향)
    d2 = d3 - B                 # ㉮ 쪽 선분(오른쪽 아래 방향)
    d1 = N - 90                 # 점 ㄴ에서 내려오는 선분
    ans = (d1 + 180 - d2) % 360
    # 벡터로 다시 확인
    assert abs(angle(V(d2), V(d1 + 180)) - (ans if ans <= 180 else 360 - ans)) < 1e-6
    return f'{ans}°'
OUT['4-2-u4-t4'] = [e4(40, 50, 150, 80, 120, 130, 60), e4(35, 50, 145, 75, 120, 130, 55), e4(45, 53, 152, 82, 123, 127, 62)]

# ---- 예제 4-1, Mission 1: 꺾은선의 회전량(시계 방향 합 = 반시계 방향 합) ----
def ex41(a, p1, p2, p3, p4):
    cw = (180 - a) + (180 - p2) + (180 - p4); ccw = (180 - p1) + (180 - p3)
    return f'{180 - (cw - ccw)}°'
OUT['4-2-u4-t4-2'] = [ex41(155, 65, 70, 80, 95), ex41(150, 65, 80, 85, 90), ex41(160, 68, 63, 80, 97)]
def m1(a, p1, p2, p3):
    cw = (180 - a) + (180 - p2); ccw = (180 - p1) + (180 - p3)
    return f'{180 - (ccw - cw)}°'
OUT['4-2-u4-t4-6'] = [m1(160, 55, 60, 85), m1(155, 55, 70, 95), m1(165, 57, 52, 75)]

# ---- 레이저: 반사를 모의해 교점 각을 다시 구하고 ㉠을 찾는다(1°~89° 전수) ----
def laser42(s, X):
    sols = [k for k in range(1, 90) if k != s and ((180 + s) - (180 - k)) % 360 == X]   # 각호: 가파른 선(왼쪽 위)에서 반시계로 완만한 선(왼쪽 아래)까지
    assert len(sols) == 1, sols
    return f'{sols[0]}°'
OUT['4-2-u4-t4-3'] = [laser42(55, 120), laser42(57, 130), laser42(60, 128)]
def laser46(s, X):
    sols = [k for k in range(1, 90) if k != s and ((180 - k) - (-s)) % 360 == X]   # 각호: 완만한 선(오른쪽 아래)에서 반시계로 가파른 선(왼쪽 위)까지
    assert len(sols) == 1, sols
    return f'{sols[0]}°'
OUT['4-2-u4-t4-11'] = [laser46(55, 155), laser46(50, 152), laser46(58, 157)]

# ---- 예제 4-3 ----
def ex43(p, q, r):
    u = p - 90; rs = u + r          # 변 ㄱㄴ, 선분(95°)의 방향
    g = angle(V(-q), V(rs - 180))
    return f'{rint(g)}°'
OUT['4-2-u4-t4-4'] = [ex43(110, 80, 95), ex43(115, 82, 90), ex43(105, 84, 100)]

# ---- 예제 4-4: 팔각형의 안쪽 각의 합 ----
def ex44(Vang):
    return f'{7 * 180 + Vang - 180 * 6}°'
OUT['4-2-u4-t4-5'] = [ex44(75), ex44(80), ex44(70)]

# ---- Mission 2: 좌표로 다시 그려 각 ㄱㅁㄹ ----
def m2(a, b, c):
    N = (0, 0); Dd = (3.6, 0); M = meet(N, V(b), (0, 4.8), (1, 0))
    R = meet(Dd, V(a + b), M, V(a + b - c))
    G = meet(N, V(a + b), (0, 4.8), (1, 0))
    assert abs(angle(sub(M, R), sub(Dd, R)) - c) < 1e-6
    return f'{rint(angle(sub(G, M), sub(R, M)))}°'
OUT['4-2-u4-t4-7'] = [m2(20, 80, 40), m2(25, 75, 45), m2(15, 80, 30)]

# ---- Mission 4: 접기를 좌표로 ----
def m4(a):
    h = 5.0; w = h * math.tan(math.radians(a / 2)); G = (0, h); N = (-w, 0); C = (w, 0)
    R = (-w / 2, h / 2); M = (w / 2, h / 2)
    B = meet(R, sub(C, G), N, (1, 0))           # ㄹㅂ ∥ ㄱㄷ
    S = mirror(N, R, B)
    assert abs((S[0] - G[0]) * (C[1] - G[1]) - (S[1] - G[1]) * (C[0] - G[0])) < 1e-9   # ㅅ은 ㄱㄷ 위
    x = angle(sub(M, R), sub(S, R)); y = angle(sub(S, B), sub(C, B))
    return f'{rint(x + y)}°'
OUT['4-2-u4-t4-9'] = [m4(40), m4(30), m4(50)]

# ---- Mission 5 ----
def m5(psi, ln, lc):
    R = (0, 0); B = addv(R, V(-psi), 4.6); dn = 225 - psi / 2; dc = 315 - psi / 2
    N = addv(R, V(dn), ln); C = addv(B, V(dc), lc)
    M = meet(R, (0, 1), N, sub(C, N)); S = meet(B, (0, 1), N, sub(C, N))
    O = addv(R, V(180 - psi), 1); J = addv(B, V(-psi), 1)
    assert abs(angle(sub(O, R), sub(N, R)) - angle(sub(M, R), sub(N, R))) < 1e-9
    assert abs(angle(sub(J, B), sub(C, B)) - angle(sub(S, B), sub(C, B))) < 1e-9
    return f'{rint(angle(sub(R, N), sub(M, N)) + angle(sub(B, C), sub(S, C)))}°'
OUT['4-2-u4-t4-10'] = [m5(8, 3.2, 2.5), m5(-6, 2.6, 3.4), m5(14, 3.6, 2.2)]

# ---- 점판 세기(전수 탐색) ----
def lattice_classes(R, C, want):
    pts = [(x, y) for x in range(C) for y in range(R)]
    def convex(P):
        s = [(P[(i + 1) % 4][0] - P[i][0]) * (P[(i + 2) % 4][1] - P[i][1]) - (P[(i + 1) % 4][1] - P[i][1]) * (P[(i + 2) % 4][0] - P[i][0]) for i in range(4)]
        return all(v > 0 for v in s) or all(v < 0 for v in s)
    def sig(P):
        d = lambda p, q: (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2
        best = None
        for k in range(4):
            for Q in (P[k:] + P[:k], tuple(reversed(P[k:] + P[:k]))):
                t = tuple(d(Q[i], Q[(i + 1) % 4]) for i in range(4)) + (d(Q[0], Q[2]), d(Q[1], Q[3]))
                best = t if best is None or t < best else best
        return best
    found = set()
    for S in itertools.combinations(pts, 4):
        for perm in itertools.permutations(S):
            if perm[0] != S[0]: continue
            if convex(perm) and want(perm): found.add(sig(perm))
    return len(found)
anyq = lambda P: True
def para_not_rect(P):
    v = [(P[(i + 1) % 4][0] - P[i][0], P[(i + 1) % 4][1] - P[i][1]) for i in range(4)]
    return v[0] == (-v[2][0], -v[2][1]) and v[0][0] * v[1][0] + v[0][1] * v[1][1] != 0
OUT['4-2-u4-t5'] = [f'{lattice_classes(3, 3, anyq)}가지', f'{lattice_classes(2, 4, anyq)}가지', f'{lattice_classes(2, 5, anyq)}가지']
OUT['4-2-u4-t5-6'] = [f'{lattice_classes(3, 4, para_not_rect)}가지', f'{lattice_classes(2, 5, para_not_rect)}가지', f'{lattice_classes(4, 4, para_not_rect)}가지']

# ---- 예제 5-1 ----
def ex51(a):
    N = (0, 0); G = addv(N, V(a), 5.8); Rr = (G[0] + 7.8, G[1])
    t1 = 180 + a / 3; M = meet(G, V(t1 + 90), N, (1, 0))
    return f'{rint(angle(sub(G, M), sub(N, M)))}°'
OUT['4-2-u4-t5-2'] = [ex51(72), ex51(60), ex51(75)]

# ---- 예제 5-2: 직사각형 가로·세로 후보 전수 ----
def ex52(S, Dd):
    sols = [(x, y) for x in range(1, S) for y in range(1, S) if x + y == S and x - y == Dd]
    assert len(sols) == 1
    p, q = sols[0]; a, b = F(p, 2), F(q, 2); area = 2 * a * b
    sides = {i * a + j * b for i in range(5) for j in range(5) if i + j > 0}
    per = [2 * (s + area / s) for s in sides if area / s in sides]
    return f'{min(per)} cm'
OUT['4-2-u4-t5-3'] = [ex52(20, 4), ex52(22, 6), ex52(26, 6)]

# ---- 예제 5-3: 접기를 좌표로 ----
def ex53(b):
    B = 10.6; h = 4.85; o = h / math.tan(math.radians(b))
    N = (0, 0); C = (B, 0); G = (o, h); Rr = (B - o, h)
    J = meet(G, sub(Rr, C), N, (1, 0)); Ch = meet(Rr, sub(G, N), N, (1, 0))   # ㄱㅈ∥ㄹㄷ, ㄹㅊ∥ㄱㄴ
    O = mirror(N, G, J); Bp = mirror(C, Rr, Ch)
    M = meet(G, sub(O, G), Rr, sub(Bp, Rr)); S = meet(J, sub(O, J), Ch, sub(Bp, Ch))
    g = angle(sub(G, M), sub(Rr, M)); hh = angle(sub(O, S), sub(Bp, S))
    return f'{rint(g - hh)}°'
OUT['4-2-u4-t5-4'] = [ex53(64), ex53(66), ex53(68)]

# ---- 예제 5-4: 밑각을 1°~89° 전수로 바꾸며 마름모가 되는 경우 찾기 ----
def ex54(q):
    sols = []
    for b in range(1, 90):
        w = 3.0; h = w * math.tan(math.radians(b)); G = (0, h); N = (-w, 0); C = (w, 0)
        axis = (0, -1); ga = math.atan2(N[1] - h, N[0]); aa = math.atan2(-1, 0)
        bis = V(math.degrees((ga + aa) / 2))             # ㄱㄴ과 대칭축 사이를 반으로 나눈 접는 선
        Rr = meet(G, bis, N, (1, 0)); M = mirror(N, G, Rr)
        Bp = (-Rr[0], 0)
        if abs(M[0]) > 1e-9: continue
        if abs(math.hypot(*sub(Rr, G)) - math.hypot(*sub(M, Rr))) < 1e-7 and -w < Rr[0] < 0:
            sols.append((b, angle(sub(N, G), sub(C, G)), angle(sub(Rr, M), sub(Bp, M))))
    assert len(sols) == 1, sols
    b, top, rm = sols[0]
    return f"{rint({'B': b, 'A': top, 'M': rm}[q])}°"
OUT['4-2-u4-t5-5'] = [ex54('B'), ex54('A'), ex54('M')]

print('AUDIT ' + json.dumps(OUT, ensure_ascii=False))
