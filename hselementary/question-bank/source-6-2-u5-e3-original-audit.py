"""황소 6-2 5단원 개념탐구 3 (복잡한 도형의 넓이 ①) 원문 구조 유형 독립 감사.

각 변형의 색칠한 부분을 생성기와 따로 (1) 점 집합(격자 적분) 또는 경계 다각형(신발끈 공식)으로 정의해
실제 원주율로 넓이를 재고, (2) 교재 풀이식(넓이 더하기·빼기)의 값과 맞는지 확인한 뒤,
(3) 문제에 주어진 원주율(3, 3.1, 3.14, 22/7)로 정확한 답을 Fraction으로 계산합니다.
표준 라이브러리만 사용합니다.
"""
import json
import math
from fractions import Fraction as F

PI = {'3': F(3), '3.1': F(31, 10), '3.14': F(157, 50), '22/7': F(22, 7)}


def fmt(q):
    q = F(q)
    if q.denominator == 1:
        return str(q.numerator)
    d = q.denominator
    while d % 2 == 0:
        d //= 2
    while d % 5 == 0:
        d //= 5
    if d == 1:
        p = 0
        while (10 ** p) % q.denominator:
            p += 1
        s = str(q.numerator * (10 ** p // q.denominator)).rjust(p + 1, '0')
        return (s[:-p] + '.' + s[-p:]).rstrip('0').rstrip('.')
    w, r = divmod(q.numerator, q.denominator)
    return f"{w} {r}/{q.denominator}" if w else f"{r}/{q.denominator}"


def cm2(q):
    return fmt(q) + ' cm²'


def grid_area(inside, x0, x1, y0, y1, n=500):
    hx, hy = (x1 - x0) / n, (y1 - y0) / n
    cnt = 0
    for i in range(n):
        x = x0 + (i + 0.5) * hx
        for j in range(n):
            if inside(x, y0 + (j + 0.5) * hy):
                cnt += 1
    return cnt * hx * hy


def arc(c, r, a0, a1, n=2000):
    return [(c[0] + r * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
             c[1] + r * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]


def shoelace(pts):
    s = 0.0
    for (x1, y1), (x2, y2) in zip(pts, pts[1:] + pts[:1]):
        s += x1 * y2 - x2 * y1
    return abs(s) / 2


def close(a, b, tol):
    assert abs(a - b) <= tol * max(1.0, abs(b)), (a, b)


def inside_tri(p, a, b, c):
    def cr(o, u, v):
        return (u[0] - o[0]) * (v[1] - o[1]) - (u[1] - o[1]) * (v[0] - o[0])
    d1, d2, d3 = cr(a, b, p), cr(b, c, p), cr(c, a, p)
    return (d1 >= 0 and d2 >= 0 and d3 >= 0) or (d1 <= 0 and d2 <= 0 and d3 <= 0)


# 개념탐구: 정사각형(한 변 s) 위 반원, 점 ㅁ = 호의 가운데. 색칠 = 선분 ㄴㅁ, 곡선 ㅁㄹ, 선분 ㄹㄴ으로 둘러싸인 부분
def exploration(s):
    h = s / 2
    N, M, R, O = (0, 0), (h, s + h), (s, s), (h, s)
    ins = lambda x, y: inside_tri((x, y), N, M, R) or (x >= h and y >= s and (x - h) ** 2 + (y - s) ** 2 <= h * h)
    num = grid_area(ins, 0, s, 0, 1.5 * s)
    close(num, s * s / 4 + s * s / 8 + math.pi * h * h / 4, 0.01)
    pi = PI['3.1']
    return cm2(F(s * s, 4) + F(s * s, 8) + F(s * s, 4) * pi / 4)


# 직각삼각형(ㄱ이 직각, ㄱㄴ=a, ㄱㄷ=b, ㄴㄷ=c) 세 변의 반원
def lunes(a, b, c, pik, tri_shaded):
    assert a * a + b * b == c * c
    N, D = (0.0, 0.0), (float(c), 0.0)
    G = (a * a / c, a * b / c)
    m1, m2, O = (G[0] / 2, G[1] / 2), ((G[0] + c) / 2, G[1] / 2), (c / 2, 0.0)

    def out_semi(m, r, P, Q, away, x, y):  # 지름 PQ, 점 away 반대쪽 반원
        if (x - m[0]) ** 2 + (y - m[1]) ** 2 > r * r:
            return False
        cr = lambda u, v, w: (v[0] - u[0]) * (w[1] - u[1]) - (v[1] - u[1]) * (w[0] - u[0])
        return cr(P, Q, (x, y)) * cr(P, Q, away) < 0

    def ins(x, y):
        inbig = y >= 0 and (x - O[0]) ** 2 + (y - O[1]) ** 2 <= (c / 2) ** 2
        lune = (out_semi(m1, a / 2, N, G, D, x, y) or out_semi(m2, b / 2, G, D, N, x, y)) and not inbig
        return lune or (tri_shaded and inside_tri((x, y), N, D, G))

    num = grid_area(ins, -a / 2, c + b / 2, -1, c)
    tri = a * b / 2
    close(num, 2 * tri if tri_shaded else tri, 0.01)
    pi = PI[pik]
    semi = lambda d: F(d, 2) ** 2 * pi / 2
    assert semi(a) + semi(b) == semi(c)  # 두 작은 반원의 합 = 큰 반원
    t = F(a * b, 2)
    return cm2(2 * t if tri_shaded else t)


# 예제 2: 한 변 s인 정사각형, 격자점(반지름의 2배 간격)을 중심으로 하는 같은 반지름의 원들 바깥
def square4(s):
    r = s / 4
    cs = [(2 * r * i, 2 * r * j) for i in range(3) for j in range(3)]
    ins = lambda x, y: all((x - cx) ** 2 + (y - cy) ** 2 > r * r for cx, cy in cs)
    num = grid_area(ins, 0, s, 0, s)
    close(num, 4 * (4 * r * r - math.pi * r * r), 0.01)
    rr = F(s, 4)
    return cm2(4 * (4 * rr * rr - rr * rr * PI['22/7']))


# 예제 3: 직각삼각형(ㄴ 직각, ㄱㄴ=a, ㄴㄷ=b, ㄱㄷ=c)을 ㄷ 중심 시계 방향 th° 회전
def rotate_tri(a, b, c, th):
    assert a * a + b * b == c * c
    assert th > math.degrees(math.atan2(a, b))  # 원문처럼 돌린 삼각형이 처음 삼각형과 겹치지 않음
    D = (b, 0)
    rot = lambda p: (D[0] + (p[0] - D[0]) * math.cos(math.radians(-th)) - (p[1] - D[1]) * math.sin(math.radians(-th)),
                     D[1] + (p[0] - D[0]) * math.sin(math.radians(-th)) + (p[1] - D[1]) * math.cos(math.radians(-th)))
    G, N = (0, a), (0, 0)
    aG = math.degrees(math.atan2(a, -b))
    pts = arc(D, c, aG, aG - th) + [rot(N)] + arc(D, b, 180 - th, 180)
    close(shoelace(pts), math.pi * (c * c - b * b) * th / 360, 0.001)
    pi = PI['3']
    return cm2((c * c - b * b) * pi * F(th, 360))


# 예제 4: 직사각형 w×h, 부채꼴(중심 오른쪽 아래, 반지름 w)·(중심 왼쪽 위, 반지름 h)
def two_sectors(w, h):
    assert h > w
    in1 = lambda x, y: x <= w and y >= 0 and (x - w) ** 2 + y * y <= w * w
    in2 = lambda x, y: x >= 0 and y <= h and x * x + (y - h) ** 2 <= h * h
    rect = lambda x, y: 0 <= x <= w and 0 <= y <= h
    ins = lambda x, y: (in1(x, y) and in2(x, y)) or (in2(x, y) and not rect(x, y))
    # 직사각형 안은 두 부채꼴로 빈틈없이 덮이는지 확인
    for i in range(101):
        for j in range(101):
            x, y = w * i / 100, h * j / 100
            assert in1(x, y) or in2(x, y)
    num = grid_area(ins, 0, h, 0, h)
    close(num, math.pi * (w * w + h * h) / 4 - w * h, 0.01)
    pi = PI['3.14']
    return cm2((w * w + h * h) * pi / 4 - w * h)


# Mission 1: 사다리꼴 ㄱ(r,r) ㄴ(0,0) ㄷ(2r,0) ㄹ(2r,r), 부채꼴 중심 ㄴ(45°), ㄷ(90°), 반지름 r
def trapezoid(r):
    G, R = (r, r), (2 * r, r)
    assert abs(math.degrees(math.atan2(G[1], G[0])) - 45) < 1e-9
    pts = [G, R] + arc((2 * r, 0), r, 90, 180) + arc((0, 0), r, 0, 45)
    close(shoelace(pts), 1.5 * r * r - 3 / 8 * math.pi * r * r, 0.001)
    pi = PI['22/7']
    return cm2(F(3 * r * r, 2) - r * r * pi / 8 - r * r * pi / 4)


# Mission 3: 둘레 P인 직사각형에 같은 원 3개가 꼭 맞게
def three_circles(P):
    d = F(P, 8)
    assert 2 * (3 * d + d) == P
    r = float(d) / 2
    ins = lambda x, y: all((x - cx) ** 2 + (y - r) ** 2 > r * r for cx in (r, 3 * r, 5 * r))
    num = grid_area(ins, 0, 6 * r, 0, 2 * r)
    close(num, 12 * r * r - 3 * math.pi * r * r, 0.01)
    rr = d / 2
    return cm2(3 * d * d - 3 * rr * rr * PI['22/7'])


# Mission 4: 정사각형(한 변 s) + 오른쪽 반원, ㅁ = 호의 가운데, ㅂ = 아랫변의 가운데
def square_semi(s):
    h = s / 2
    up = [(0, s), (s, s)] + arc((s, h), h, 90, 0)
    lo = [(h, 0), (s, 0)] + arc((s, h), h, 270, 360)
    pi_ = math.pi
    close(shoelace(up) + shoelace(lo), s * h / 2 + h * h / 2 + 2 * (pi_ * h * h / 4 - h * h / 2), 0.001)
    pi = PI['3.1']
    H = F(s, 2)
    seg = H * H * pi / 4 - H * H / 2
    return cm2(s * H / 2 + H * H / 2 + 2 * seg)


# Mission 5: 직사각형(가로 a, 세로 b, 대각선 c)을 ㄷ 중심 시계 방향 90° 회전
def rotate_rect(a, b, c):
    assert a * a + b * b == c * c
    D = (a, 0)
    aG, aG2 = math.degrees(math.atan2(b, -a)), math.degrees(math.atan2(a, b))
    pts = [(0, b)] + arc(D, c, aG, aG2) + [(a + b, 0)] + arc(D, b, 0, 90)
    close(shoelace(pts), math.pi * (c * c - b * b) / 4, 0.001)
    pi = PI['3.1']
    return cm2((c * c - b * b) * pi / 4)


# Mission 6: 직각이등변삼각형(직각을 낀 변 L), 세로 변을 지름으로 하는 반원, 반지름 L·45° 부채꼴
def tri_semi_sector(L):
    h = L / 2
    semi = lambda x, y: x <= L and (x - L) ** 2 + (y - h) ** 2 <= h * h
    sector = lambda x, y: y >= 0 and y <= x and x * x + y * y <= L * L
    ins = lambda x, y: (semi(x, y) and y > x) or (semi(x, y) and sector(x, y))
    num = grid_area(ins, 0, L, 0, L)
    close(num, L * L * (math.pi / 4 - 0.5), 0.01)
    pi = PI['22/7']
    H = F(L, 2)
    return cm2(H * H * pi / 2 + L * L * pi / 8 - F(L * L, 2))


items = {
    '6-2-u5-e3-exploration': [exploration(16), exploration(12), exploration(20)],
    '6-2-u5-e3-example-1': [lunes(12, 16, 20, '3.14', False), lunes(18, 24, 30, '3.14', False), lunes(10, 24, 26, '3.14', False)],
    '6-2-u5-e3-example-2': [square4(8), square4(12), square4(16)],
    '6-2-u5-e3-example-3': [rotate_tri(20, 15, 25, 72), rotate_tri(16, 12, 20, 75), rotate_tri(24, 18, 30, 80)],
    '6-2-u5-e3-example-4': [two_sectors(14, 18), two_sectors(12, 14), two_sectors(16, 18)],
    '6-2-u5-e3-mission-1': [trapezoid(14), trapezoid(28), trapezoid(42)],
    '6-2-u5-e3-mission-2': [lunes(12, 9, 15, '3', True), lunes(16, 12, 20, '3', True), lunes(8, 6, 10, '3', True)],
    '6-2-u5-e3-mission-3': [three_circles(64), three_circles(48), three_circles(80)],
    '6-2-u5-e3-mission-4': [square_semi(16), square_semi(12), square_semi(24)],
    '6-2-u5-e3-mission-5': [rotate_rect(6, 8, 10), rotate_rect(12, 16, 20), rotate_rect(18, 24, 30)],
    '6-2-u5-e3-mission-6': [tri_semi_sector(14), tri_semi_sector(28), tri_semi_sector(42)],
}
# 원문 변형(0번)의 답은 원문 수로 직접 손계산한 값과 일치해야 함
src = {'6-2-u5-e3-exploration': '145.6 cm²', '6-2-u5-e3-example-1': '96 cm²', '6-2-u5-e3-example-2': '13 5/7 cm²',
       '6-2-u5-e3-example-3': '240 cm²', '6-2-u5-e3-example-4': '156.2 cm²', '6-2-u5-e3-mission-1': '63 cm²',
       '6-2-u5-e3-mission-2': '108 cm²', '6-2-u5-e3-mission-3': '41 1/7 cm²', '6-2-u5-e3-mission-4': '131.2 cm²',
       '6-2-u5-e3-mission-5': '27.9 cm²', '6-2-u5-e3-mission-6': '56 cm²'}
for k, v in items.items():
    assert len(set(v)) == 3, (k, v)
    assert v[0] == src[k], (k, v[0])
print('AUDIT ' + json.dumps(items, ensure_ascii=False))
