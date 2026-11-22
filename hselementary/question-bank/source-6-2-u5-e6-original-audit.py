# 독립 감사: 황소 6-2 5단원 개념탐구 6 (여러 가지 문제: 원 위의 각, 겹친 넓이) 원문 구조 유형
# python3 -I 로 실행. 표준 라이브러리만 사용. 각도 문항은 좌표 기하로 직접 재고, 넓이 문항은 분수로 다시 푼다.
# 마지막 줄에 AUDIT {...} 를 출력한다.
import json, math
from fractions import Fraction as Fr

def s(x):
    x = Fr(x)
    if x.denominator == 1:
        return str(x.numerator)
    t = ('%.6f' % (x.numerator / x.denominator)).rstrip('0').rstrip('.')
    assert Fr(t) == x, (x, t)
    return t

def P(t):  # 단위원 위의 점, t: 맨 위에서 시계 반대 방향 각(도)
    r = math.radians(t)
    return (-math.sin(r), math.cos(r))

def inter(a, b, c, d):
    den = (b[0]-a[0])*(d[1]-c[1]) - (b[1]-a[1])*(d[0]-c[0])
    t = ((c[0]-a[0])*(d[1]-c[1]) - (c[1]-a[1])*(d[0]-c[0])) / den
    u = ((c[0]-a[0])*(b[1]-a[1]) - (c[1]-a[1])*(b[0]-a[0])) / den
    assert -1e-9 < t < 1 + 1e-9 and -1e-9 < u < 1 + 1e-9, '선분이 서로 만나지 않음'
    return (a[0]+t*(b[0]-a[0]), a[1]+t*(b[1]-a[1]))

def angle(V, A, B):
    v1 = (A[0]-V[0], A[1]-V[1]); v2 = (B[0]-V[0], B[1]-V[1])
    c = (v1[0]*v2[0]+v1[1]*v2[1]) / (math.hypot(*v1)*math.hypot(*v2))
    return math.degrees(math.acos(max(-1, min(1, c))))

def deg(x):
    r = round(x * 2) / 2
    assert abs(x - r) < 1e-7, x
    return s(Fr(r).limit_denominator(2))

OUT = {}

# ---- 개념탐구: N등분 점 q[0..3]로 만든 사각형, 대각선의 작은 각(표시한 각) ----
def explore(n, q):
    V = [P(360*k/n) for k in q]
    X = inter(V[0], V[2], V[1], V[3])
    a1 = angle(X, V[2], V[3]); a2 = 180 - a1
    small = min(a1, a2)
    assert abs(angle(X, V[2], V[3]) - small) < 1e-9  # 그림에 표시한 각이 작은 각
    assert abs(a1 - a2) > 1e-6
    return deg(small) + '°'
OUT['6-2-u5-e6-exploration'] = [explore(12, [1, 2, 3, 6]), explore(12, [1, 2, 4, 8]), explore(10, [1, 2, 3, 6])]

# ---- 예제 1: 반지름 ㅇ→(m각형 k번째 꼭짓점) 과 n각형 j~j+1 변이 만나는 점에서 ㅇ쪽과 아래 끝쪽 사이 각 ----
def ex1(n, m, k, j):
    O = (0.0, 0.0); H = P(360*k/m); V1 = P(360*j/n); V2 = P(360*(j+1)/n)
    X = inter(O, H, V1, V2)
    return deg(angle(X, O, V2)) + '°'
OUT['6-2-u5-e6-example-1'] = [ex1(5, 6, 2, 1), ex1(4, 5, 2, 1), ex1(6, 5, 2, 2)]

# ---- 예제 2: 중심각 c, 호 위 여러 위치의 ㄴ에서 각 ㄱㄴㄷ 이 같은지 확인 ----
def ex2(c):
    G = P(0); D = P(c)
    vals = set()
    for f in range(1, 20):
        L = P(c * f / 20)
        vals.add(deg(angle(L, G, D)))
    assert len(vals) == 1, vals
    return vals.pop() + '°'
OUT['6-2-u5-e6-example-2'] = [ex2(86), ex2(74), ex2(98)]

# ---- 예제 3: 지름 dia, 원주율 3.1, ㉮=㉯ 이면 직사각형 = 사분원 2개 ----
def ex3(dia):
    r = Fr(dia, 2); pi = Fr('3.1')
    # 직사각형 넓이 r*d 는 d 에 대해 증가, (직사각형) - (사분원 2개) = ㉯ - ㉮ 이므로 0 이 되는 d 는 하나
    d = 2 * (r * r * pi / 4) / r
    assert r < d < 2 * r
    # 실제 원주율로 넓이를 수치 적분해 같은 식(직사각형 = 사분원 2개 - ㉮ + ㉯)이 성립하는지 확인
    R = float(r); dd = float(d); N = 4000; lens = 0.0; gap = 0.0
    for i in range(N):
        x = (i + 0.5) * dd / N
        y1 = math.sqrt(max(0, R*R - x*x)); y2 = math.sqrt(max(0, R*R - (dd - x)**2))
        lens += min(y1, y2) * dd / N; gap += (R - max(y1, y2)) * dd / N
    assert abs(R*dd - (2*math.pi*R*R/4 - lens + gap)) < 1e-3
    return s(d) + ' cm'
OUT['6-2-u5-e6-example-3'] = [ex3(10), ex3(12), ex3(20)]

# ---- 예제 4: 겹친 부분 = 삼각형의 1/a = 원의 b/c ----
def ex4(a, b, c):
    ov = Fr(1); T = ov * a; C = ov * Fr(c, b)
    q = T / C
    return f'{q.numerator} : {q.denominator}'
OUT['6-2-u5-e6-example-4'] = [ex4(6, 3, 11), ex4(4, 2, 9), ex4(5, 3, 7)]

# ---- Mission 1: 12등분 점 q 로 만든 사각형 ㄱㄴㄷㄹ 의 각 ㄱ, 각 ㄴ ----
def m1(q):
    V = [P(30*k) for k in q]
    aG = angle(V[0], V[3], V[1]); aN = angle(V[1], V[0], V[2])
    return f'각 ㄱ {deg(aG)}°, 각 ㄴ {deg(aN)}°'
OUT['6-2-u5-e6-mission-1'] = [m1([2, 5, 7, 9]), m1([1, 5, 7, 10]), m1([2, 4, 7, 10])]

# ---- Mission 2: 선분 T-A, L-R, L-A. ㉮ = A 에서 T,L 사이 각, ㉯ = TA 와 LR 이 만나는 점에서 T,L 사이 각 ----
def m2(n, T, L, R, A):
    pT, pL, pR, pA = (P(360*k/n) for k in (T, L, R, A))
    X = inter(pT, pA, pL, pR)
    return f'㉮ {deg(angle(pA, pT, pL))}°, ㉯ {deg(angle(X, pT, pL))}°'
OUT['6-2-u5-e6-mission-2'] = [m2(6, 0, 1, 5, 4), m2(10, 0, 2, 8, 7), m2(12, 0, 3, 9, 8)]

# ---- Mission 3: m각형의 변 (0번째-1번째) 와 n각형의 변 (1번째-2번째) 이 만나는 점에서 ㄱ쪽과 n각형 2번째 꼭짓점 쪽 사이 각 ----
def m3(m, n):
    A0 = P(0); A1 = P(360/m); B1 = P(360/n); B2 = P(720/n)
    X = inter(A0, A1, B1, B2)
    a = angle(X, A0, B2)
    assert a > 90  # 그림의 ㉠ 은 둔각 쪽
    return deg(a) + '°'
OUT['6-2-u5-e6-mission-3'] = [m3(4, 5), m3(5, 6), m3(3, 4)]

# ---- Mission 4: 반지름 r 반원, 가로 2r 직사각형, (가)=(나) → 직사각형 = 반원 ----
def m4(r):
    pi = Fr('3.14'); h = (r * r * pi / 2) / (2 * r)
    assert 0 < h < r
    return s(h) + ' cm'
OUT['6-2-u5-e6-mission-4'] = [m4(2), m4(4), m4(6)]

# ---- Mission 5: 사분원 반지름 r, 원주율 3, ㉮=㉯ ⇔ 직각삼각형 = 부채꼴(90-㉠). 1~89 전수 조사 ----
def m5(r):
    pi = Fr(3); tri = Fr(r * r, 2)
    sol = [t for t in range(1, 90) if r * r * pi * Fr(90 - t, 360) == tri]
    assert len(sol) == 1, sol
    return f'{sol[0]}°'
OUT['6-2-u5-e6-mission-5'] = [m5(20), m5(10), m5(30)]

# ---- Mission 6: 겹친 = ㉠의 a/b = ㉡의 c/d, ㉠ = S ----
def m6(a, b, c, d, S):
    ov = Fr(S) * Fr(a, b); T = ov / Fr(c, d)
    assert ov <= T and T < S
    return s(T) + ' cm²'
OUT['6-2-u5-e6-mission-6'] = [m6(3, 8, 2, 3, 64), m6(5, 12, 2, 3, 72), m6(2, 9, 3, 5, 81)]

print('AUDIT ' + json.dumps(OUT, ensure_ascii=False))
