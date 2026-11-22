#!/usr/bin/env python3
"""황소 6-2 4단원 개념탐구 3 원문 구조 유형 독립 감사.
생성기 코드를 읽지 않고 각 변형의 조건만으로 답을 다시 구하며, 넓은 범위의 완전 탐색으로 정답이 하나뿐인지 확인합니다."""
import json
from fractions import Fraction as F

OUT = {}
fails = []


def check(cond, msg):
    if not cond:
        fails.append(msg)


def unique(cands, msg):
    check(len(cands) == 1, f"{msg}: candidates={cands[:5]}")
    return cands[0] if cands else None


def clock(m):
    return f"{m // 60}시 {m % 60}분"


# 개념탐구: 늦는 시계/빠른 시계 (r초/시간, 늦는 시계가 처음으로 가리킨 시각 shown분)
res = []
for r, shown in [(90, 390), (120, 290), (150, 345)]:
    # 실제 경과 t초(1초 단위 탐색): 늦는 시계 표시 = t*(3600-r)/3600, 12시간 이내 처음 도달
    cands = [t for t in range(0, 12 * 3600 + 1) if F(t * (3600 - r), 3600) == shown * 60]
    t = unique(cands, f"exploration {r}")
    fast = F(t * (3600 + r), 3600)
    check(fast.denominator == 1 and fast % 60 == 0, "exploration fast minute")
    fm = int(fast) // 60
    check(fm < 12 * 60, "exploration within 12h")
    res.append(clock(fm))
OUT["6-2-u4-e3-exploration"] = res

# 예제 1: 처음 a:b, 각각 d mL 마신 뒤 c:e, 처음 양의 차
res = []
for a, b, d, c, e in [(3, 2, 200, 2, 1), (7, 4, 100, 5, 2), (5, 4, 120, 3, 2)]:
    cands = [(x, y) for k in range(1, 5001) for x, y in [(a * k, b * k)]
             if x > d and y > d and (x - d) * e == (y - d) * c]
    x, y = unique(cands, f"example1 {a}:{b}")
    res.append(f"{x - y} mL")
OUT["6-2-u4-e3-example-1"] = res

# 예제 2: 처음 a:b, 철호 +P, 병식 -M, 이후 c:e, 현재 병식 금액
res = []
for a, b, P, M, c, e in [(3, 2, 900, 500, 5, 3), (4, 3, 600, 400, 2, 1), (5, 4, 1000, 800, 3, 2)]:
    cands = [(a * k, b * k) for k in range(1, 100001) if b * k > M and (a * k + P) * e == (b * k - M) * c]
    x, y = unique(cands, f"example2 {a}:{b}")
    res.append(f"{y - M}원")
OUT["6-2-u4-e3-example-2"] = res

# 예제 3: 사과:배=a:b, 배 n개를 사과 n개로 바꾸어 c:e, 처음 사과 수
res = []
for a, b, n, c, e in [(3, 4, 5, 4, 3), (2, 3, 6, 3, 2), (4, 5, 7, 5, 4)]:
    cands = [(ap, pe) for ap in range(1, 1001) for pe in range(n + 1, 1001)
             if ap * b == pe * a and (ap + n) * e == (pe - n) * c]
    ap, pe = unique(cands, f"example3 {a}:{b}")
    res.append(f"{ap}개")
OUT["6-2-u4-e3-example-3"] = res

# 예제 4: 500원:100원 금액비 a:b, 500원 n개 추가, 100원 p% 사용, 이후 c:e, 지금 동전 수
res = []
for a, b, n, p, c, e in [(2, 3, 3, 20, 13, 12), (3, 2, 4, 25, 8, 3), (1, 2, 2, 10, 20, 27)]:
    cands = []
    for c5 in range(1, 401):          # 처음 500원 개수
        for c1 in range(1, 2001):     # 처음 100원 개수
            if 500 * c5 * b != 100 * c1 * a:
                continue
            used = F(c1 * p, 100)
            if used.denominator != 1:
                continue
            rest = c1 - int(used)
            if (500 * (c5 + n)) * e == (100 * rest) * c:
                cands.append((c5 + n, rest))
    x, y = unique(cands, f"example4 {a}:{b}")
    res.append(f"{x + y}개")
OUT["6-2-u4-e3-example-4"] = res

# Mission 1: 1시간에 r분 빨리 가는 시계, 오후 ㉮시 ㉯분(실제)에 shown을 가리킴, 오후 H시에 정확
res = []
for r, shown, H in [(3, 90, 5), (2, 143, 6), (4, 244, 7)]:
    cands = []
    for t in range(0, H * 60):  # 실제 시각(분, 오후 12시 기준)
        # 실제 시각 t에서 시계 표시 = H*60 - (H*60 - t)*(60+r)/60
        disp = F(H * 60) - F((H * 60 - t) * (60 + r), 60)
        if disp == shown:
            cands.append(t)
    t = unique(cands, f"mission1 {r}")
    h, m = divmod(t, 60)
    check(1 <= h <= 11, "mission1 pm hour")
    res.append(str(h + m))
OUT["6-2-u4-e3-mission-1"] = res

# Mission 2: 처음 a:b, 두 묘목 g cm씩 자라 c:e
res = []
for a, b, g, c, e in [(13, 9, 20, 9, 7), (5, 3, 12, 3, 2), (7, 4, 10, 3, 2)]:
    cands = [(x, y) for x in range(1, 1001) for y in range(1, 1001)
             if x * b == y * a and (x + g) * e == (y + g) * c]
    x, y = unique(cands, f"mission2 {a}:{b}")
    res.append(f"{x} cm, {y} cm")
OUT["6-2-u4-e3-mission-2"] = res

# Mission 3: 어제 a:b, 언니 W 찾음, 동생 D 저금, 이후 c:e, 현재 언니 금액
res = []
for a, b, W, D, c, e in [(5, 3, 75000, 10000, 3, 4), (5, 4, 40000, 10000, 2, 3), (3, 2, 50000, 25000, 2, 3)]:
    cands = [(a * k, b * k) for k in range(1, 200001) if a * k > W and (a * k - W) * e == (b * k + D) * c]
    x, y = unique(cands, f"mission3 {a}:{b}")
    res.append(f"{x - W}원")
OUT["6-2-u4-e3-mission-3"] = res

# Mission 4: 연속 n개 홀수, 최소:최대=1:r, m의 배수 개수
res = []
for n, r, m in [(29, 9, 15), (31, 5, 9), (25, 17, 7)]:
    cands = [s for s in range(1, 2001, 2) if (s + 2 * (n - 1)) == r * s]
    s = unique(cands, f"mission4 {n}")
    nums = [s + 2 * i for i in range(n)]
    res.append(f"{sum(1 for x in nums if x % m == 0)}개")
OUT["6-2-u4-e3-mission-4"] = res

# Mission 5: 다연:동생=a:b, 동생 +g개, 이후 c:e, 다연의 떡 수
res = []
for a, b, g, c, e in [(3, 2, 12, 1, 2), (4, 3, 14, 4, 5), (5, 4, 18, 5, 7)]:
    cands = [(x, y) for x in range(1, 1001) for y in range(1, 1001)
             if x * b == y * a and x * e == (y + g) * c]
    x, y = unique(cands, f"mission5 {a}:{b}")
    res.append(f"{x}개")
OUT["6-2-u4-e3-mission-5"] = res

# Mission 6: 사다리꼴 ㄱㄴㄷㄹ(ㄱㄹ∥ㄴㄷ), ㄹㅁ:ㅁㄷ=p:q, ㉮(ㄱㄴㅁㄹ):㉯(ㄴㄷㅁ)=m:n
# 좌표로 넓이를 계산해 ㄱㄹ:ㄴㄷ 후보(1..60 정수비, 기약)를 모두 시험하고 여러 높이/기울기에서 같은지 확인
def shoelace(pts):
    s = F(0)
    for i in range(len(pts)):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % len(pts)]
        s += x1 * y2 - x2 * y1
    return abs(s) / 2


def gcd(a, b):
    while b:
        a, b = b, a % b
    return a


res = []
for p, q, m, n in [(5, 4, 8, 3), (3, 2, 5, 2), (4, 3, 3, 1)]:
    cands = []
    for A in range(1, 61):
        for B in range(1, 61):
            if gcd(A, B) != 1:
                continue
            ok = True
            for h, shift in [(F(7), F(3)), (F(5), F(-2)), (F(11), F(1, 2))]:
                N, D = (F(0), F(0)), (F(B), F(0))
                R = (F(B) + shift, h)
                G = (R[0] - A, h)
                Mp = (R[0] + (D[0] - R[0]) * F(p, p + q), R[1] + (D[1] - R[1]) * F(p, p + q))
                ga = shoelace([G, N, Mp, R])
                na = shoelace([N, D, Mp])
                if ga * n != na * m:
                    ok = False
                    break
            if ok:
                cands.append((A, B))
    A, B = unique(cands, f"mission6 {p}:{q}")
    res.append(f"{A}:{B}")
OUT["6-2-u4-e3-mission-6"] = res

if fails:
    print("AUDIT-FAIL", fails)
    raise SystemExit(1)
print("AUDIT " + json.dumps(OUT, ensure_ascii=False))
