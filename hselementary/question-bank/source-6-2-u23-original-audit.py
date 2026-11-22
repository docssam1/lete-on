# 6-2 2단원(소수의 나눗셈)·3단원(공간과 입체) 잠금 원문 유형 독립 검산 (표준 라이브러리만 사용)
# 각 변형의 조건에서 답을 다시 계산하고, 가능한 후보를 전수 탐색하여 답이 하나뿐임을 확인합니다.
import json
from fractions import Fraction as F

D = lambda s: F(s)


def dec(v):
    """유한소수 Fraction -> 문자열 (끝의 0 제거)"""
    v = F(v)
    for k in range(0, 9):
        if (v * 10 ** k).denominator == 1:
            n = v * 10 ** k
            s = str(abs(n.numerator)).rjust(k + 1, '0')
            out = s[:-k] + '.' + s[-k:] if k else s
            return out
    raise AssertionError(v)


def fixed(v, places):
    n = v * 10 ** places
    assert n.denominator == 1
    s = str(n.numerator).rjust(places + 1, '0')
    return s[:-places] + '.' + s[-places:]


def round_half_up(v, places):
    n = v * 10 ** places
    q = n.numerator // n.denominator
    if n - q >= F(1, 2):
        q += 1
    return F(q, 10 ** places)


def ceil_to(v, places):
    n = v * 10 ** places
    q = -((-n.numerator) // n.denominator)
    return F(q, 10 ** places)


OUT = {}

# ---------- 6-2-u2-e2-example-4: 직각사다리꼴, ㅁ은 ㄴㄹ의 가운데 점, 삼각형 ㄱㅁㄷ의 넓이 ----------
def trap(a, b, S):
    a, b, S = D(a), D(b), D(S)
    h = 2 * S / (a + b)
    # 좌표로 직접 넓이 계산: ㄴ(0,0) ㄷ(b,0) ㄱ(0,h) ㄹ(a,h)
    G, N, Dd, R = (F(0), h), (F(0), F(0)), (b, F(0)), (a, h)
    M = ((N[0] + R[0]) / 2, (N[1] + R[1]) / 2)
    area = abs((M[0] - G[0]) * (Dd[1] - G[1]) - (M[1] - G[1]) * (Dd[0] - G[0])) / 2
    # ㅁ이 ㄱㄷ의 오른쪽(사다리꼴 안쪽)에 있어 색칠한 삼각형이 그림과 같은 모양인지 확인
    assert M[0] > b * (1 - M[1] / h)
    assert a > b and h > 0
    # 풀이 경로(ㄱㄴㅁ + ㅁㄴㄷ - ㄱㄴㄷ)와 일치
    assert a * h / 4 + b * h / 4 - b * h / 2 == area
    return dec(area) + ' cm²'

OUT['6-2-u2-e2-example-4'] = [trap('13.2', '9.6', '131.1'), trap('12.6', '8.2', '109.2'), trap('14.4', '10.2', '152.52')]

# ---------- 6-2-u2-e2-mission-3: 직사각형 안의 두 삼각형 ----------
def tri(h, r, S):
    h, r, S = D(h), D(r), D(S)
    base = 2 * S / h
    sols = []
    for k in range(1, int(base * 100)):  # ㄴㅁ 을 0.01 cm 단위로 전수 탐색
        x = F(k, 100)
        if (base - x) * h / 2 * r == S:
            sols.append(x)
    assert len(sols) == 1, sols
    return dec(sols[0]) + ' cm'

OUT['6-2-u2-e2-mission-3'] = [tri('3.9', '1.25', '9.36'), tri('4.2', '1.25', '11.76'), tri('3.4', '1.6', '8.84')]

# ---------- 6-2-u2-e3-exploration-3: 1보다 작은 몫을 소수 둘째 자리까지 반올림 ----------
def rnd2(a, b):
    q = D(a) / D(b)
    assert q < 1
    r = round_half_up(q, 2)
    # 반올림 구간 전수 확인: 0.00~0.99 중 q가 [c-0.005, c+0.005) 에 드는 c는 하나
    cand = [c for c in range(100) if F(c, 100) - F(1, 200) <= q < F(c, 100) + F(1, 200)]
    assert cand == [int(r * 100)]
    return fixed(r, 2)

OUT['6-2-u2-e3-exploration-3'] = [rnd2('27.72', '30.7'), rnd2('18.43', '24.6'), rnd2('31.25', '37.4')]

# ---------- 6-2-u2-e3-example-3: 같은 수(0이 아님)를 세 수로 나눈 몫의 배 ----------
def times(ds):
    ds = [D(x) for x in ds]
    vals = set()
    for c in [F(1), F(7, 3), F(9856, 1000), F(123, 10)]:  # 0이 아닌 여러 수로 확인
        qs = [c / d for d in ds]
        vals.add(round_half_up(max(qs) / min(qs), 2))
    assert len(vals) == 1
    return fixed(vals.pop(), 2) + '배'

OUT['6-2-u2-e3-example-3'] = [times(['3.2', '5.6', '1.76']), times(['2.8', '6.3', '1.32']), times(['4.5', '7.4', '2.6'])]

# ---------- 6-2-u2-e3-mission-5: 올림한 몫이 t가 되는 소수 두 자리 수 ㉠의 개수 (끝자리 0 제외) ----------
def ceilcount(a, t):
    a, t = D(a), D(t)
    ok = []
    for k in range(1, 100000):  # 0.01 ~ 999.99
        x = F(k, 100)
        if k % 10 == 0:
            continue  # 소수 둘째 자리 숫자가 0인 수는 소수 두 자리 수로 보지 않음
        if ceil_to(a / x, 1) == t:
            ok.append(x)
    # 끝자리 0 포함 시 개수와 비교(차이가 정확히 하나인지 확인)
    with0 = [F(k, 100) for k in range(1, 100000) if ceil_to(a / F(k, 100), 1) == t]
    assert len(with0) == len(ok) + 1
    return f'{len(ok)}개'

OUT['6-2-u2-e3-mission-5'] = [ceilcount('48.21', '6.4'), ceilcount('37.45', '5.2'), ceilcount('52.68', '8.3')]

# ---------- 6-2-u2-e4-example-4: 몫을 한 자리 더 구했을 때의 나머지 ----------
def newrem(d, q, r):
    d, q, r = D(d), D(q), D(r)
    assert 0 < r < d / 10
    n = d * q + r
    q2 = F(int(n / d * 100), 100)
    rem = n - d * q2
    assert 0 <= rem < d / 100 and q2 > q
    return dec(rem)

OUT['6-2-u2-e4-example-4'] = [newrem('2.93', '3.7', '0.16'), newrem('3.84', '2.6', '0.27'), newrem('1.67', '4.2', '0.11')]

# ---------- 6-2-u3-e2-mission-3: 테두리 1, 안쪽 교대(안쪽 귀퉁이 0) 한 층 도형 ----------
def grid_k(k):
    n = 2 * k + 1
    g = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if i in (0, n - 1) or j in (0, n - 1):
                g[i][j] = 1
            else:
                g[i][j] = 1 if (i + j) % 2 == 1 else 0
    return g

# 원문 세 그림과 규칙이 같은지 확인
assert grid_k(1) == [[1, 1, 1], [1, 0, 1], [1, 1, 1]]
assert grid_k(2) == [[1, 1, 1, 1, 1], [1, 0, 1, 0, 1], [1, 1, 0, 1, 1], [1, 0, 1, 0, 1], [1, 1, 1, 1, 1]]
assert [sum(r) for r in grid_k(3)] == [7, 4, 5, 4, 5, 4, 7]

def border(k):
    g = grid_k(k)
    n = len(g)
    cubes = sum(map(sum, g))
    sides = 0
    for i in range(n):
        for j in range(n):
            if g[i][j]:
                for di, dj in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    a, b = i + di, j + dj
                    if not (0 <= a < n and 0 <= b < n and g[a][b]):
                        sides += 1  # 바깥쪽 면과 빈 칸(구멍) 쪽 면 모두 보임
    visible = cubes + sides  # 윗면 + 옆면 (밑면 제외)
    return str(visible - cubes)

OUT['6-2-u3-e2-mission-3'] = [border(10), border(8), border(12)]
assert border(10) == '808'

# ---------- 칠한 면 수 세기 (바닥면 포함 모든 겉면) ----------
def cubes_of(hm):
    S = set()
    for r, row in enumerate(hm):
        for c, h in enumerate(row):
            for z in range(h):
                S.add((r, c, z))
    return S

def hist(hm):
    S = cubes_of(hm)
    hcount = [0] * 7
    for (r, c, z) in S:
        k = 0
        for d in ((1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)):
            if (r + d[0], c + d[1], z + d[2]) not in S:
                k += 1  # z-1 < 0 이면 바닥면이며, 바닥면도 칠함
        hcount[k] += 1
    assert hcount[6] == 0  # 표가 0~5면까지이므로 6면 쌓기나무가 없어야 함
    assert sum(hcount) == len(S)
    return ', '.join(f'{i}면 {hcount[i]}개' for i in range(6))

# 개념탐구 3: 앞줄 -> 뒷줄, 왼쪽 -> 오른쪽
EXP = [
    [[4, 3, 0, 0], [4, 3, 2, 1], [4, 3, 2, 2], [4, 4, 4, 4]],
    [[4, 3, 0, 0], [4, 3, 2, 1], [4, 3, 3, 2], [4, 4, 4, 4]],
    [[4, 2, 0, 0], [4, 3, 2, 1], [4, 3, 2, 2], [4, 4, 4, 3]],
]

def tops_visible(hm):
    # 비스듬한 그림(깊이가 오른쪽 위로 물러남)에서 각 기둥 윗면이 바로 앞 칸과 오른쪽 앞 칸에 가리지 않는지 확인
    for d in range(1, len(hm)):
        for x in range(len(hm[0])):
            H = hm[d][x]
            if H == 0:
                continue
            if hm[d - 1][x] > H:
                return False
            if x + 1 < len(hm[0]) and hm[d - 1][x + 1] > H:
                return False
    return True

for hm in EXP:
    assert tops_visible(hm)
assert hist(EXP[0]) == '0면 2개, 1면 11개, 2면 15개, 3면 13개, 4면 3개, 5면 0개'
OUT['6-2-u3-e3-exploration'] = [hist(h) for h in EXP]

EX1 = [
    [[0, 5, 0, 0], [0, 3, 0, 0], [3, 3, 3, 3], [0, 2, 2, 2], [0, 2, 0, 2]],
    [[0, 4, 0, 0], [0, 3, 0, 0], [3, 2, 3, 2], [0, 2, 2, 2], [0, 2, 0, 2]],
    [[0, 5, 0, 0], [0, 4, 0, 0], [2, 3, 3, 3], [0, 2, 2, 2], [0, 3, 0, 2]],
]
assert hist(EX1[0]) == '0면 1개, 1면 2개, 2면 10개, 3면 7개, 4면 9개, 5면 1개'
OUT['6-2-u3-e3-example-1'] = [hist(h) for h in EX1]

# Mission 1: n×n×n 정육면체, 바닥 포함 모든 겉면 칠함 -> 칠해지지 않은 쌓기나무
def unpainted(n):
    hm = [[n] * n for _ in range(n)]
    S = cubes_of(hm)
    cnt = 0
    for (r, c, z) in S:
        if all((r + d[0], c + d[1], z + d[2]) in S for d in ((1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1))):
            cnt += 1
    assert len(S) == n ** 3
    return f'{cnt}개'

OUT['6-2-u3-e3-mission-1'] = [unpainted(4), unpainted(5), unpainted(6)]

M2 = [
    [[0, 2, 3], [1, 2, 1], [2, 0, 2]],
    [[0, 3, 2], [1, 2, 1], [2, 0, 3]],
    [[0, 2, 3], [2, 1, 2], [3, 0, 1]],
]
assert hist(M2[0]) == '0면 0개, 1면 0개, 2면 1개, 3면 5개, 4면 4개, 5면 3개'
OUT['6-2-u3-e3-mission-2'] = [hist(h) for h in M2]

# Mission 4: 칠한 모든 면(바닥 포함)의 넓이
def area(hm, e):
    S = cubes_of(hm)
    faces = 0
    for (r, c, z) in S:
        for d in ((1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)):
            if (r + d[0], c + d[1], z + d[2]) not in S:
                faces += 1
    return f'{faces * e * e} cm²'

M4 = [([[3, 2, 0], [2, 1, 0], [3, 2, 1]], 3), ([[2, 3, 0], [1, 2, 0], [3, 2, 2]], 2), ([[3, 3, 0], [2, 1, 0], [2, 2, 1]], 4)]
assert area(*M4[0]) == '414 cm²'
OUT['6-2-u3-e3-mission-4'] = [area(*m) for m in M4]

for k, v in OUT.items():
    assert len(v) == 3 and len(set(v)) == 3, (k, v)

print('AUDIT ' + json.dumps(OUT, ensure_ascii=False))
