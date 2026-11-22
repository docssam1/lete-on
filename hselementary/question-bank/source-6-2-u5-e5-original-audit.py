# 독립 감사: 황소 6-2 5단원 개념탐구 5 (자취의 길이와 넓이) 원문 구조 유형
# python3 -I 로 실행. 표준 라이브러리만 사용. 마지막 줄에 AUDIT {...} 를 출력한다.
import json, math
from fractions import Fraction as Fr

def s(x):
    x = Fr(x)
    if x.denominator == 1:
        return str(x.numerator)
    v = x.numerator / x.denominator
    t = ('%.6f' % v).rstrip('0').rstrip('.')
    assert Fr(t) == x, (x, t)
    return t

def mixed(x):
    x = Fr(x); w = x.numerator // x.denominator; r = x - w
    return f"{w} {r.numerator}/{r.denominator}" if r else str(w)

OUT = {}

# ---- 공통: 직교 꺾은선(원이 한쪽에서 굴러감) 중심 경로 길이 ----
# segs: [(길이, 다음 꺾임)] 꺾임 'convex' = 원에서 멀어지는 모서리(중심이 1/4 원), 'concave' = 원 쪽 구석(양 변에서 r씩 줄어듦)
def rolled_length(segs, r, pi):
    total = Fr(0)
    for i, (L, _) in enumerate(segs):
        eff = Fr(L)
        if i > 0 and segs[i - 1][1] == 'concave': eff -= r
        if segs[i][1] == 'concave': eff -= r
        assert eff >= 0
        total += eff
    nconv = sum(1 for _, k in segs if k == 'convex')
    return total + nconv * 2 * Fr(r) * Fr(pi) / 4

# ---- 개념탐구: 닫힌 ㄱ자 도형(바깥) ----
def explore(r, a, b, c, d):
    w, h = a - c, b - d
    assert w == 2 * r and h == 2 * r  # 원문과 같은 구조: 들어간 부분이 지름과 같은 정사각형
    # 꼭짓점 순서 (0,0)->(a,0)->(a,b)->(w,b)->(w,d)->(0,d)->(0,0), 바깥에서 돌 때 각 꼭짓점의 볼록/오목
    pts = [(0, 0), (a, 0), (a, b), (w, b), (w, d), (0, d)]
    kinds = []
    for i in range(6):
        p0, p1, p2 = pts[i - 1], pts[i], pts[(i + 1) % 6]
        cr = (p1[0] - p0[0]) * (p2[1] - p1[1]) - (p1[1] - p0[1]) * (p2[0] - p1[0])
        kinds.append('convex' if cr > 0 else 'concave')  # 반시계 다각형: 왼쪽으로 꺾이면 볼록
    assert kinds.count('convex') == 5 and kinds.count('concave') == 1
    edges = [math.dist(pts[i], pts[(i + 1) % 6]) for i in range(6)]
    per = Fr(int(sum(edges)))
    pi = Fr(3)
    length = per - 2 * r * kinds.count('concave') + kinds.count('convex') * 2 * r * pi / 4
    # 넓이: 변마다 폭 2r 띠 + 볼록 꼭짓점의 1/4 원(반지름 2r) - 오목 꼭짓점에서 겹친 (2r)^2 - 닿지 못하는 구석
    D = 2 * r
    area = per * D + kinds.count('convex') * D * D * pi / 4 - kinds.count('concave') * D * D
    pocket = Fr(r * r) - Fr(r * r) * pi / 4
    area -= kinds.count('concave') * pocket
    # 수치 확인(실제 원주율, 격자): 들어간 정사각형 안에서 원이 닿는 넓이 = 4r^2 - (r^2 - πr^2/4)
    n = 200; cnt = 0
    for i in range(n):
        for j in range(n):
            x = w * (i + .5) / n; y = d + h * (j + .5) / n
            # 원 중심 경로(구석 부분): y=d+r, 0<=cx<=w-r 와 x=w-r, d+r<=cy<=b 의 선분 + 왼쪽 위쪽 이어지는 부분
            ok = False
            for (x1, y1, x2, y2) in [(-r, d + r, w - r, d + r), (w - r, d + r, w - r, b + r)]:
                tx = min(max(x, min(x1, x2)), max(x1, x2)); ty = min(max(y, min(y1, y2)), max(y1, y2))
                if (x - tx) ** 2 + (y - ty) ** 2 <= r * r + 1e-9: ok = True
            cnt += ok
    num = cnt / n / n * w * h
    assert abs(num - (4 * r * r - (r * r - math.pi * r * r / 4))) < 0.02 * r * r, num
    return f"{s(length)} cm, {s(area)} cm²"

OUT['6-2-u5-e5-exploration'] = [explore(5, 40, 40, 30, 30), explore(4, 36, 32, 28, 24), explore(3, 30, 24, 24, 18)]

# ---- 예제 5-1: 위쪽 길 l1, 아래로 h, 바닥 m, 위로 h, 위쪽 길 l2 (원은 위에서 굴러감) ----
def ex1(r, l1, h, m, l2):
    assert h > r and m > 2 * r
    segs = [(l1, 'convex'), (h, 'concave'), (m, 'concave'), (h, 'convex'), (l2, None)]
    return s(rolled_length(segs, r, Fr('3.14'))) + ' cm'
OUT['6-2-u5-e5-example-1'] = [ex1(4, 10, 8, 20, 10), ex1(3, 12, 7, 18, 12), ex1(5, 8, 10, 25, 8)]

# ---- 예제 5-2 / Mission 5: 한 줄로 닿은 고정 원들 둘레를 같은 크기 원이 한 바퀴 ----
def chain(k, R, pi):
    # 고정 원 중심 (2R*i, 0). 움직이는 원의 중심은 어떤 고정 원 중심에서 2R인 점 중 다른 중심과 2R보다 가깝지 않은 곳.
    deg = 0
    for i in range(k):
        cx = 2 * R * i
        for t2 in range(720):  # 0.5° 간격, 구간 가운데 표본
            t = math.radians((t2 + .5) / 2)
            px, py = cx + 2 * R * math.cos(t), 2 * R * math.sin(t)
            if all(math.hypot(px - 2 * R * j, py) >= 2 * R - 1e-9 for j in range(k) if j != i):
                deg += 1
    assert deg % 2 == 0
    deg = Fr(deg, 2)
    return 2 * 2 * R * Fr(pi) * deg / 360
OUT['6-2-u5-e5-example-2'] = [mixed(chain(2, r, '3.1')) + ' cm' for r in (5, 10, 4)]
OUT['6-2-u5-e5-mission-5'] = [mixed(chain(3, R, '3.1')) + ' cm' for R in (10, 5, 7)]

# ---- 굴리기 시뮬레이션: 다각형을 직선 위에서 오른쪽으로 한 바퀴 굴리며 한 꼭짓점의 이동 거리 ----
def roll(poly, track, pi):
    # poly: 반시계 순서 꼭짓점 좌표(실수). 바닥 변은 poly[0]-poly[1] (왼쪽->오른쪽).
    P = [list(p) for p in poly]; n = len(P); dist = Fr(0)
    piv = 1
    for _ in range(n):
        # 피벗 꼭짓점을 중심으로 시계 방향으로, 다음 꼭짓점이 바닥(y=0)에 닿을 때까지 회전
        px, py = P[piv]; nxt = (piv + 1) % n
        vx, vy = P[nxt][0] - px, P[nxt][1] - py
        ang = math.degrees(math.atan2(vy, vx))  # 다음 꼭짓점이 바닥 오른쪽(각 0)까지 시계 방향 회전
        rot = round(ang)  # 회전각(도)
        assert abs(ang - rot) < 1e-6 and 0 < rot < 180
        rad = math.hypot(P[track][0] - px, P[track][1] - py)
        rr = Fr(round(rad * 1000), 1000)
        assert abs(float(rr) - rad) < 1e-9
        dist += 2 * rr * Fr(pi) * rot / 360
        th = -math.radians(rot)
        for q in P:
            dx, dy = q[0] - px, q[1] - py
            q[0], q[1] = px + dx * math.cos(th) - dy * math.sin(th), py + dx * math.sin(th) + dy * math.cos(th)
        piv = nxt
    return dist

# 예제 5-3: ㄴ(0,0), ㄷ(a,0), ㄱ(a, a√3). 직각은 ㄷ, ∠ㄴ=60°, ㄱㄴ=2a
def ex3(a):
    poly = [(0, 0), (a, 0), (a, a * math.sqrt(3))]
    assert abs(math.dist(poly[0], poly[2]) - 2 * a) < 1e-9
    return s(roll(poly, 0, 3)) + ' cm'
OUT['6-2-u5-e5-example-3'] = [ex3(3), ex3(4), ex3(5)]

# Mission 3: ㄱ(0,0), ㄹ(a,0), ㄷ(a,b), ㄴ(0,b)
def m3(a, b, c):
    assert a * a + b * b == c * c
    return s(roll([(0, 0), (a, 0), (a, b), (0, b)], 0, 3)) + ' cm'
OUT['6-2-u5-e5-mission-3'] = [m3(4, 3, 5), m3(8, 6, 10), m3(12, 5, 13)]

# ---- 끈에 묶인 동물: 꼭짓점 (0,0), 울타리 [0,w]x[0,h] ----
def tie(L, w, h, pi):
    assert w < L <= w + h and h < L
    # 공식(주어진 원주율)
    A = Fr(3, 4) * L * L * Fr(pi) + Fr(1, 4) * (L - w) ** 2 * Fr(pi) + Fr(1, 4) * (L - h) ** 2 * Fr(pi)
    # 격자 확인(실제 원주율): 울타리 밖 점 중 울타리를 돌아가는 최단 거리가 L 이하
    st = 0.04; cnt = 0; n = int(2 * L / st) + 2
    for i in range(n):
        for j in range(n):
            x = -L + (i + .5) * st; y = -L + (j + .5) * st
            if 0 < x < w and 0 < y < h: continue
            if x <= 0 or y <= 0:
                dd = math.hypot(x, y)  # 꼭짓점에서 곧게 닿음
            else:  # 울타리에 가려짐: 이웃한 꼭짓점을 돌아감 (끈이 w+h 이하라 두 번 돌 수 없음)
                opts = []
                if x >= w: opts.append(w + math.hypot(x - w, y))
                if y >= h: opts.append(h + math.hypot(x, y - h))
                dd = min(opts)
            if dd <= L: cnt += 1
    num = cnt * st * st
    exact = (Fr(3, 4) * L * L + Fr(1, 4) * (L - w) ** 2 + Fr(1, 4) * (L - h) ** 2) * math.pi
    assert abs(num - float(exact)) < 0.01 * float(exact), (num, float(exact))
    return s(A) + ' m²'
OUT['6-2-u5-e5-example-4'] = [tie(10, 8, 5, 3), tie(12, 9, 6, 3), tie(8, 7, 5, 3)]
OUT['6-2-u5-e5-mission-6'] = [tie(8, 6, 4, '3.1'), tie(12, 8, 6, '3.1'), tie(10, 8, 6, '3.1')]

# ---- Mission 1: 볼록 사각형 바깥을 도는 원 ----
def m1(r, bt, rt, tp, lf):
    th = math.radians(67); A = (0, 0); B = (bt, 0); D = (lf * math.cos(th), lf * math.sin(th))
    dd = math.dist(D, B); assert abs(tp - rt) < dd < tp + rt
    aa = (tp * tp - rt * rt + dd * dd) / (2 * dd); hh = math.sqrt(tp * tp - aa * aa)
    mx_, my = D[0] + aa * (B[0] - D[0]) / dd, D[1] + aa * (B[1] - D[1]) / dd
    C = (mx_ - hh * (B[1] - D[1]) / dd, my + hh * (B[0] - D[0]) / dd)
    Q = [A, B, C, D]
    crs = [(Q[(i + 1) % 4][0] - Q[i][0]) * (Q[(i + 2) % 4][1] - Q[(i + 1) % 4][1]) - (Q[(i + 1) % 4][1] - Q[i][1]) * (Q[(i + 2) % 4][0] - Q[(i + 1) % 4][0]) for i in range(4)]
    assert all(c > 0 for c in crs)  # 볼록
    per = sum(Fr(round(math.dist(Q[i], Q[(i + 1) % 4]) * 1000), 1000) for i in range(4))
    assert per == bt + rt + tp + lf
    return s(per + 2 * r * Fr('3.14')) + ' cm'
OUT['6-2-u5-e5-mission-1'] = [m1(1, 10, 8, 6, 4), m1(2, 12, 9, 7, 5), m1(1, 11, 9, 5, 6)]

# ---- Mission 2: 중심이 변 위를 지나는 원, 직사각형 안쪽 넓이 (격자 정확 세기) ----
def m2(d, W, H):
    r = Fr(d, 2); k = 10; cnt = 0
    for i in range(W * k):
        for j in range(H * k):
            x = Fr(2 * i + 1, 2 * k); y = Fr(2 * j + 1, 2 * k)
            if min(x, y, W - x, H - y) <= r: cnt += 1
    return s(Fr(cnt, k * k)) + ' cm²'
OUT['6-2-u5-e5-mission-2'] = [m2(4, 20, 15), m2(6, 24, 18), m2(2, 16, 10)]

# ---- Mission 4: ㄱ에서 바닥 a, 위로 h, 윗면 t, 아래로 h, 바닥 b 까지 ----
def m4(r, a, h, t, b):
    assert a >= r and b >= r and h >= r
    segs = [(a, 'concave'), (h, 'convex'), (t, 'convex'), (h, 'concave'), (b, None)]
    return s(rolled_length(segs, r, Fr('3.14'))) + ' cm'
OUT['6-2-u5-e5-mission-4'] = [m4(1, 2, 2, 4, 2), m4(2, 5, 4, 6, 4), m4(1, 3, 3, 5, 3)]

print('AUDIT ' + json.dumps(OUT, ensure_ascii=False))
