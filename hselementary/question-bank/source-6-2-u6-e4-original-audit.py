"""6-2 6단원 개념탐구 4 (원기둥과 원뿔의 겉넓이) 원문 구조 유형 독립 감사 (표준 라이브러리만 사용).

각 변형의 매개변수로 겉넓이를 생성기와 다른 방식(면을 하나씩 모으거나 전체에서 빼기)으로 다시 계산하고,
답이 개수·길이인 문항은 전수 탐색으로 정답이 하나뿐인지 확인한다.
"""
import json
import math
from fractions import Fraction as F


def dec(x):
    x = F(x)
    for k in range(0, 7):
        v = x * 10 ** k
        if v.denominator == 1:
            s = str(abs(v.numerator))
            if k:
                s = s.rjust(k + 1, "0")
                s = s[:-k] + "." + s[-k:]
            return s
    raise AssertionError("non-terminating decimal %s" % x)


PI3, PI31, PI314, PI227 = F(3), F("3.1"), F("3.14"), F(22, 7)
OUT = {}


def circle(r, pi):
    return pi * F(r) * F(r)


def cyl_lateral(r, h, pi):
    return 2 * pi * F(r) * F(h)


# 개념탐구: 구가 꼭 맞는 원기둥(반지름 r, 높이 2r)의 전개도 넓이
OUT["6-2-u6-e4-exploration-1"] = [dec(2 * circle(r, PI31) + cyl_lateral(r, 2 * r, PI31)) + " cm²" for r in (4, 5, 6)]

# 예제 1: 쌓은 원기둥 3개 = 모든 원기둥 겉넓이의 합 - 맞닿은 면(작은 원) 2개씩
ans = []
for ds, h in [((2, 4, 6), 4), ((4, 6, 10), 5), ((2, 6, 8), 3)]:
    rs = [F(d, 2) for d in ds]
    total = sum(2 * circle(r, PI31) + cyl_lateral(r, h, PI31) for r in rs)
    contacts = circle(rs[0], PI31) + circle(rs[1], PI31)
    ans.append(dec(total - 2 * contacts) + " cm²")
OUT["6-2-u6-e4-example-1"] = ans

# 예제 2: 직각삼각형(밑변 r, 높이 a, 빗변 l)을 θ° 회전
ans = []
for r, a, l, th in [(5, 12, 13, 168), (6, 8, 10, 150), (8, 15, 17, 135)]:
    assert r * r + a * a == l * l
    k = F(th, 360)
    base = circle(r, PI3) * k
    # 원뿔 옆면 = 반지름 l인 부채꼴, 호의 길이 = 2πr → 넓이 = 호 × l ÷ 2
    lateral = (2 * PI3 * r * k) * l / 2
    ans.append(dec(base + lateral + 2 * F(r * a, 2)) + " cm²")
OUT["6-2-u6-e4-example-2"] = ans

# 예제 3: 큰 원기둥 - 관통 구멍(r1) - 깊이 d 구멍(r2)
ans = []
for R, H, r1, r2, d in [(9, 25, 2, 4, 17), (10, 20, 3, 4, 12), (8, 15, 2, 3, 10)]:
    # 두 구멍이 겹치지 않고 큰 원 안에 들어가는지, 깊이가 높이보다 작은지 확인
    assert 2 * r1 + 2 * r2 < 2 * R and d < H
    top = circle(R, PI31) - circle(r1, PI31) - circle(r2, PI31)
    bottom = circle(R, PI31) - circle(r1, PI31)
    pit_floor = circle(r2, PI31)
    walls = cyl_lateral(R, H, PI31) + cyl_lateral(r1, H, PI31) + cyl_lateral(r2, d, PI31)
    ans.append(dec(top + bottom + pit_floor + walls) + " cm²")
OUT["6-2-u6-e4-example-3"] = ans

# 예제 4: 통나무(반지름 r) n번 자르기, 겉넓이 합 = 2배 → 도막 높이 (0.5 cm 단위 전수 탐색)
ans = []
for r, n in [(21, 5), (14, 3), (28, 6)]:
    hits = []
    for q in range(1, 4001):
        p = F(q, 2)
        h = p * (n + 1)
        orig = 2 * circle(r, PI227) + cyl_lateral(r, h, PI227)
        pieces = (n + 1) * (2 * circle(r, PI227) + cyl_lateral(r, p, PI227))
        if pieces == 2 * orig:
            hits.append(p)
    assert len(hits) == 1, hits
    ans.append(dec(hits[0]) + " cm")
OUT["6-2-u6-e4-example-4"] = ans

# Mission 1: 직사각형 가로 w, 세로 t를 각각 축으로 회전한 원기둥 옆면 둘레의 차
ans = []
for w, t in [(11, 13), (8, 12), (14, 17)]:
    p_w = 2 * (2 * PI3 * t + w)
    p_t = 2 * (2 * PI3 * w + t)
    ans.append(dec(abs(p_w - p_t)) + " cm")
OUT["6-2-u6-e4-mission-1"] = ans

# Mission 2: 원기둥의 1/3을 잘라 낸 나머지 겉넓이 = 전체 겉넓이 × 2/3 + 자른 면 2개
ans = []
for R, H in [(9, 14), (6, 10), (10, 8)]:
    whole = 2 * circle(R, PI3) + cyl_lateral(R, H, PI3)
    ans.append(dec(whole * F(2, 3) + 2 * R * H) + " cm²")
OUT["6-2-u6-e4-mission-2"] = ans

# Mission 3: 반원기둥(반지름 R, 길이 L)에서 지름 R/2인 반원기둥 4개 홈
ans = []
for R, L in [(16, 25), (12, 20), (20, 30)]:
    r = F(R, 4)
    assert 4 * 2 * r == 2 * R
    big = (2 * circle(R, PI3) + cyl_lateral(R, L, PI3)) / 2  # 평평한 바닥 제외한 반원기둥 겉면
    small_ends = 4 * circle(r, PI3)  # 앞뒤에서 빠지는 작은 반원 4개씩 = 원 4개
    grooves = 4 * cyl_lateral(r, L, PI3) / 2
    ans.append(dec(big - small_ends + grooves) + " cm²")
OUT["6-2-u6-e4-mission-3"] = ans

# Mission 4: 반지름 R, 높이 H인 원기둥을 중심에서 R/2 떨어진 현으로 자름 (현의 길이 c는 R×√3을 소수 첫째 자리로 나타낸 값)
ans = []
for R, H, c, h2 in [(9, 3, "15.6", "4.5"), (6, 4, "10.4", "3"), (12, 5, "20.8", "6")]:
    c, h2 = F(c), F(h2)
    assert h2 == F(R, 2)
    assert abs(float(c) - R * math.sqrt(3)) < 0.05  # 현의 길이가 그림과 맞는지(소수 첫째 자리)
    assert math.isclose(math.degrees(math.acos(float(h2) / R)), 60.0)  # 표시한 60°
    cut_off = circle(R, PI314) / 3 - c * h2 / 2  # 잘려 나간 작은 활꼴
    base = circle(R, PI314) - cut_off
    curved = cyl_lateral(R, H, PI314) * F(2, 3)
    ans.append(dec(2 * base + curved + c * H) + " cm²")
OUT["6-2-u6-e4-mission-4"] = ans

# Mission 5: 원기둥에서 원기둥 3개를 차례로 파냄
ans = []
for D, H, L in [(20, 16, [(8, 6), (4, 4), (2, 2)]), (16, 12, [(6, 5), (4, 3), (2, 2)]), (24, 18, [(10, 6), (6, 5), (2, 3)])]:
    R = F(D, 2)
    assert sum(h for _, h in L) < H and L[0][0] < D and L[0][0] > L[1][0] > L[2][0]
    top = circle(R, PI31) - circle(F(L[0][0], 2), PI31)
    steps = sum(circle(F(L[i][0], 2), PI31) - circle(F(L[i + 1][0], 2), PI31) for i in range(2)) + circle(F(L[2][0], 2), PI31)
    walls = cyl_lateral(R, H, PI31) + sum(cyl_lateral(F(d, 2), h, PI31) for d, h in L)
    ans.append(dec(top + circle(R, PI31) + steps + walls) + " cm²")
OUT["6-2-u6-e4-mission-5"] = ans

# Mission 6: 자른 횟수 전수 탐색
ans = []
for r, h in [(3, 12), (2, 10), (4, 24)]:
    hits = [k for k in range(0, 200) if cyl_lateral(r, h, PI314) == 2 * (k + 1) * circle(r, PI314)]
    assert len(hits) == 1, hits
    ans.append("%d번" % hits[0])
OUT["6-2-u6-e4-mission-6"] = ans

print("AUDIT " + json.dumps(OUT, ensure_ascii=False))
