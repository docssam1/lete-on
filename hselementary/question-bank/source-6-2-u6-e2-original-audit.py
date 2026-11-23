# 독립 감사: 황소 6-2 6단원 개념탐구 2 (원뿔) 원문 구조 유형
# python3 -I 로 실행. 표준 라이브러리만 사용. 마지막 줄에 AUDIT {...} 를 출력한다.
import json, math
from fractions import Fraction as Fr
from itertools import permutations

def s(x):
    x = Fr(x)
    if x.denominator == 1:
        return str(x.numerator)
    v = x.numerator / x.denominator
    t = ('%.6f' % v).rstrip('0').rstrip('.')
    assert Fr(t) == x, (x, t)
    return t

PI314 = Fr('3.14')
OUT = {}

def cone_ok(r, l):
    # 모선이 밑면의 반지름보다 길어야 원뿔이 된다
    assert Fr(l) > Fr(r) > 0, (r, l)

# ---- 개념탐구: 밑면 원 + 모선 5개 철사 → 모선 ----
def explore(r, l):
    cone_ok(r, l)
    wire = Fr(r) * 2 * PI314 + 5 * Fr(l)
    # 철사 길이에서 거꾸로 모선을 구하고, 1/100 cm 단위로 다른 답이 없는지 확인
    sols = [Fr(k, 100) for k in range(1, 10000) if Fr(r) * 2 * PI314 + 5 * Fr(k, 100) == wire]
    assert sols == [Fr(l)]
    return s(sols[0]) + ' cm'
# 변형 0은 원본 책 수치(철사 90.24 cm, 반지름 8 cm) 그대로 철사 길이에서 거꾸로 푼다.
# 이 수치로는 모선(8 cm)이 반지름과 같아 실제 원뿔이 되지 않지만, 원본대로 두고 계산만 검산한다.
def explore_book(r, wire_text):
    wire = Fr(wire_text)
    sols = [Fr(k, 100) for k in range(1, 10000) if Fr(r) * 2 * PI314 + 5 * Fr(k, 100) == wire]
    assert len(sols) == 1
    assert sols[0] == Fr(r)   # 원본 수치의 한계: 모선 = 반지름
    return s(sols[0]) + ' cm'
OUT['6-2-u6-e2-exploration-1'] = [explore_book(8, '90.24'), explore(5, 13), explore(9, 15)]

# ---- 예제 2-1 / Mission 3: 전개도 중심각 ----
def angle(l, r):
    cone_ok(r, l)
    a = Fr(360) * (2 * Fr(r) * PI314) / (2 * Fr(l) * PI314)
    # 부채꼴 넓이 관계로도 확인: 옆면 넓이 = π r l = π l² × a/360
    assert PI314 * Fr(r) * Fr(l) == PI314 * Fr(l) ** 2 * a / 360
    assert a.denominator == 1
    return s(a) + '°'
OUT['6-2-u6-e2-example-1'] = [angle(10, Fr('2.5')), angle(12, 4), angle(15, Fr('2.5'))]
OUT['6-2-u6-e2-mission-3'] = [angle(8, 2), angle(9, 3), angle(10, 4)]

# ---- 예제 2-2: 꼭짓점 중심으로 n바퀴 굴린 원뿔 옆면이 지나간 넓이 ----
def roll(r, l, n):
    cone_ok(r, l)
    assert n * Fr(r) < Fr(l)  # 한 바퀴(꼭짓점 둘레)를 넘지 않아 겹치지 않음
    lateral = PI314 * Fr(r) * Fr(l)  # 원뿔 옆면 넓이
    return s(lateral * n) + ' cm²'
OUT['6-2-u6-e2-example-2'] = [roll(3, 10, 3), roll(2, 7, 3), roll(4, 13, 3)]

# ---- 예제 2-3: B→D(모선 AC 위)→B 최단 경로, AD ----
def shortest(l, d):
    r = Fr(d, 2); cone_ok(r, l)
    theta = 2 * math.pi * float(r) / l  # 전개도 중심각(라디안)
    # 전개도: A=원점, B=(l,0), B'=(l cosθ, l sinθ), AC는 θ/2 방향
    Bx, By = l, 0.0
    Cx, Cy = l * math.cos(theta), l * math.sin(theta)
    # 선분 BB'와 θ/2 방향 반직선의 교점까지 거리 (수치)
    u = (math.cos(theta / 2), math.sin(theta / 2))
    # 매개변수 풀이
    best = None
    steps = 200000
    for i in range(steps + 1):
        t = i / steps
        x = Bx + (Cx - Bx) * t; y = By + (Cy - By) * t
        ang = math.atan2(y, x)
        if abs(ang - theta / 2) < 1e-4:
            dist = math.hypot(x, y)
            best = dist if best is None else best
    ad = Fr(round(best * 1000), 1000)
    assert abs(float(Fr(l, 2)) - best) < 1e-3
    return s(Fr(l, 2)) + ' cm'
OUT['6-2-u6-e2-example-3'] = [shortest(6, 4), shortest(9, 6), shortest(12, 8)]

# ---- 예제 2-4: 고깔 3개 포개기 (격자 탐색으로 독립 계산) ----
def feasible(t, c, placed):
    h, r = c
    for (T, H, R) in placed:
        if T + H > t + h: return False
        lo = max(t, T); hi = T + H
        for k in range(0, 41):
            z = lo + (hi - lo) * Fr(k, 40)
            if r * (1 - (z - t) / h) < R * (1 - (z - T) / H): return False
    return True

def stack(order):
    placed = []
    for c in order:
        h, r = map(Fr, c)
        # 1/4 cm 간격으로 가장 낮은 자리 찾기 (답이 모두 정수 cm 이므로 충분)
        t = Fr(0)
        while not feasible(t, (h, r), placed):
            t += Fr(1, 4)
            assert t < 1000
        placed.append((t, h, r))
    return max(T + H for T, H, R in placed)

HN = ['㉮', '㉯', '㉰']
def hats(hs, which):
    res = {p: stack([hs[i] for i in p]) for p in permutations(range(3))}
    target = min(res.values()) if which == 'lo' else max(res.values())
    win = [p for p, v in res.items() if v == target]
    assert len(win) == 1, res
    print('hats', which, {''.join(HN[i] for i in p): s(v) for p, v in res.items()})
    return ', '.join(HN[i] for i in win[0])
HATS = [[(60, 20), (40, 40), (60, 30)], [(32, 32), (48, 16), (48, 24)], [(54, 27), (54, 18), (36, 36)]]
OUT['6-2-u6-e2-example-4-1'] = [hats(h, 'lo') for h in HATS]
OUT['6-2-u6-e2-example-4-2'] = [hats(h, 'hi') for h in HATS]

# ---- Mission 1: n바퀴 돌아 제자리 → 모선 ----
def paint(c, n):
    c = Fr(str(c)); r = c / (2 * PI314); l = c * n / (2 * PI314)
    cone_ok(r, l)
    # 꼭짓점 둘레 원의 둘레 = 밑면 둘레 × n
    assert 2 * PI314 * l == n * c
    return s(l) + ' cm'
OUT['6-2-u6-e2-mission-1'] = [paint('62.8', 3), paint('31.4', 4), paint('37.68', 3)]

# ---- Mission 2: 철사 원뿔(모선 5개, 원주율 3) → 밑면 반지름 ----
def wire2(r, l):
    cone_ok(r, l)
    W = 2 * 3 * r + 5 * l
    sols = [k for k in range(1, 1000) if 2 * 3 * k + 5 * l == W]
    assert sols == [r]
    return f'{r} cm'
# 변형 0은 원본 책 수치(철사 111 cm, 모선 9 cm, 모선 5개) 그대로 철사 길이에서 거꾸로 푼다.
# 이 수치로는 반지름(11 cm)이 모선보다 길어 실제 원뿔이 되지 않지만, 원본대로 두고 계산만 검산한다.
def wire2_book(W, l):
    sols = [k for k in range(1, 1000) if 2 * 3 * k + 5 * l == W]
    assert len(sols) == 1 and sols[0] > l   # 원본 수치의 한계: 반지름 > 모선
    return f'{sols[0]} cm'
OUT['6-2-u6-e2-mission-2'] = [wire2_book(111, 9), wire2(8, 10), wire2(5, 13)]

# ---- Mission 4: 원을 4조각 → 밑면 둘레 합 = 원의 둘레 ----
def cut(R):
    angles = [90, 60, 60, 150]
    total = sum(2 * Fr(R) * PI314 * Fr(a, 360) for a in angles)  # 각 원뿔 밑면 둘레 = 부채꼴 호
    assert total == 2 * Fr(R) * PI314
    return s(total) + ' cm'
OUT['6-2-u6-e2-mission-4'] = [cut(8), cut(6), cut(10)]

# ---- Mission 5: 최단 실 아래 옆면 넓이 (원주율 3.1) ----
def thread(l, r):
    cone_ok(r, l)
    pi = Fr('3.1')
    ang = Fr(360) * r / l
    assert ang == 90
    sector = pi * l * l * ang / 360
    tri = Fr(l * l, 2)  # 중심각 90°: 두 반지름이 직각
    # 수치 확인: 실제 활꼴 넓이(원주율 3.1을 쓰는 부채꼴 대신 기하 확인은 직각삼각형 넓이로)
    th = math.pi / 2
    assert abs(0.5 * l * l * math.sin(th) - float(tri)) < 1e-9
    return s(sector - tri) + ' cm²'
OUT['6-2-u6-e2-mission-5'] = [thread(12, 3), thread(8, 2), thread(16, 4)]

# ---- Mission 6: 높이가 같은 두 모자, 가 위에 나 ----
def caps(H, R, r):
    assert r < R
    # 나의 밑면 높이 t: 가의 반지름이 r 이 되는 높이 (격자 탐색)
    t = Fr(0)
    while not feasible(t, (Fr(H), Fr(r)), [(Fr(0), Fr(H), Fr(R))]):
        t += Fr(1, 8)
    assert t == Fr(H) * (R - r) / R
    return s(t + H) + ' cm'
OUT['6-2-u6-e2-mission-6'] = [caps(15, 5, 3), caps(12, 6, 4), caps(20, 5, 3)]

print('AUDIT ' + json.dumps(OUT, ensure_ascii=False))
