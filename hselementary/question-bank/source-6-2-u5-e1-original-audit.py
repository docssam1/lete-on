"""6-2 5단원 개념탐구 1 원문 구조 유형 독립 감사 (표준 라이브러리만 사용).

각 변형의 매개변수로 정답을 다시 계산하고, 가능한 곳은 전수 탐색으로 정답이 하나뿐인지 확인한다.
"""
import json
import math
from fractions import Fraction as F


def dec(x):
    x = F(x)
    for k in range(0, 7):
        v = x * 10 ** k
        if v.denominator == 1:
            s = str(v.numerator)
            if k == 0:
                return s
            s = s.rjust(k + 1, "0")
            return s[:-k] + "." + s[-k:]
    raise AssertionError("non-terminating decimal %s" % x)


def frac_of(x, tol=1e-9):
    fr = F(x).limit_denominator(1000)
    assert abs(float(fr) - x) < tol, (fr, x)
    return fr


def hull_perimeter(points):
    pts = sorted(points)

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    lower, upper = [], []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 1e-12:
            lower.pop()
        lower.append(p)
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 1e-12:
            upper.pop()
        upper.append(p)
    h = lower[:-1] + upper[:-1]
    return sum(math.dist(h[i], h[(i + 1) % len(h)]) for i in range(len(h)))


OUT = {}
PI314, PI31, PI3 = F("3.14"), F("3.1"), F(3)

# 예제 1-1, Mission 5: 부채꼴 호의 길이 → 반지름
for sid, rows in {
    "6-2-u5-e1-example-1": [(144, "21.98"), (160, "12.56"), (120, "15.7")],
    "6-2-u5-e1-mission-5": [(108, "9.42"), (135, "9.42"), (80, "12.56")],
}.items():
    ans = []
    for th, arc in rows:
        r = F(arc) / (2 * PI314 * F(th, 360))
        # 0.01 cm 단위 전수 탐색: 호의 길이가 정확히 맞는 반지름은 하나뿐
        hits = [k for k in range(1, 5001) if 2 * F(k, 100) * PI314 * F(th, 360) == F(arc)]
        assert hits == [r * 100], (sid, th, hits, r)
        ans.append(dec(r) + " cm")
    OUT[sid] = ans

# 예제 1-2: 지름 위에 빈틈없이 놓인 구멍들 → 둘레 = 큰 원주 + 구멍 원주 합
ans = []
for D, fr in [(20, ["0.21", "0.09", "0.13", "0.33", "0.24"]), (30, ["0.18", "0.12", "0.3", "0.1", "0.3"]), (16, ["0.25", "0.15", "0.08", "0.22", "0.3"])]:
    ds = [F(q) * D for q in fr]
    assert sum(ds) == D
    per = PI3 * D + sum(PI3 * d for d in ds)
    ans.append(dec(per) + " cm")
OUT["6-2-u5-e1-example-2"] = ans

# 예제 1-3: 원 7개를 감은 끈 = 바깥 중심 육각형 둘레 + 원 하나의 원주
ans = []
for r in (1, 2, 3):
    pts = [(0.0, 0.0)] + [(2 * r * math.cos(k * math.pi / 3), 2 * r * math.sin(k * math.pi / 3)) for k in range(6)]
    straight = frac_of(hull_perimeter(pts))
    ans.append(dec(straight + 2 * r * PI314) + " cm")
OUT["6-2-u5-e1-example-3"] = ans


# 예제 1-4, Mission 6: 트랙 출발선 차이 (곡선 구간 반원 하나를 지나 도착)
def race_gap(L, D, w_out, finish_from_right):
    """안쪽 기준선의 반원 지름 D, 바깥 기준선은 w_out만큼 바깥. 두 출발선의 직선상 거리 차."""
    a_in = 200 - PI31 * F(D) / 2 - finish_from_right
    a_out = 200 - PI31 * (F(D) + 2 * w_out) / 2 - finish_from_right
    assert 0 <= a_out < a_in <= L
    # 실제 달린 거리 확인
    assert a_in + PI31 * F(D) / 2 + finish_from_right == 200
    assert a_out + PI31 * (F(D) + 2 * w_out) / 2 + finish_from_right == 200
    return a_in - a_out


OUT["6-2-u5-e1-example-4"] = [dec(race_gap(L, D, F(w), F(L, 2))) + " m" for L, D, w in [(112, 52, 4), (100, 50, 3), (110, 48, 5)]]
OUT["6-2-u5-e1-mission-6"] = [dec(race_gap(L, D, 2 * F(w), F(fb))) + " m" for L, D, w, fb in [(90, 50, "1", 72), (80, 60, "1.2", 64), (100, 40, "1.5", 80)]]

# Mission 1: 굴렁쇠 바퀴 수 (전수 탐색)
ans = []
for d1, n1, d2, m in [(50, 8, 60, "21.98"), (40, 10, 50, "25.12"), (45, 8, 60, "28.26")]:
    total = F(m) * 100
    hits = [n for n in range(1, 1000) if d1 * PI314 * n1 + d2 * PI314 * n == total]
    assert len(hits) == 1, hits
    ans.append("%d바퀴" % hits[0])
OUT["6-2-u5-e1-mission-1"] = ans

# Mission 2: 큰 원 지름 = 중간 원 2개 = 작은 원 4개
ans = []
for c in ("15.5", "18.6", "12.4"):
    d = F(c) / PI31
    mid = 2 * d
    big = mid + mid
    ans.append(dec(big * PI31) + " cm")
OUT["6-2-u5-e1-mission-2"] = ans

# Mission 3: 나이테 (n년 된 나무는 n칸, 바깥 원은 나무 둘레)
ans = []
for n1, s1, n2 in [(6, 3, 9), (4, 6, 8), (5, 4, 10)]:
    R = F(s1) * n1
    s2 = R / n2
    radii = [s2 * k for k in range(1, n2)]  # 둘레(k=n2) 제외
    assert len(radii) == n2 - 1
    ans.append(dec(sum(2 * PI314 * r for r in radii)) + " cm")
OUT["6-2-u5-e1-mission-3"] = ans

# Mission 4: 캔 5개(아래 3, 위 2)를 두 바퀴 + 매듭
ans = []
for d, knot in [(18, 20), (16, 15), (20, 25)]:
    h = d * math.sqrt(3) / 2
    pts = [(0.0, 0.0), (float(d), 0.0), (2.0 * d, 0.0), (d / 2, h), (1.5 * d, h)]
    one = frac_of(hull_perimeter(pts)) + d * PI314
    ans.append(dec(2 * one + knot) + " cm")
OUT["6-2-u5-e1-mission-4"] = ans

# 개념탐구: 원 안 정육각형 둘레(지름×3) < 원주 < 원 밖 정사각형 둘레(지름×4)
ans = []
for d in (None, 10, 8):
    dd = F(d if d else 1)
    hexagon = 6 * (dd / 2)          # 한 변 = 반지름인 정삼각형 6개
    square = 4 * dd                 # 한 변 = 지름
    assert hexagon < F("3.14") * dd < square  # 실제 원주(원주율 3.14) 위치 확인
    assert hexagon / dd == 3 and square / dd == 4
    lo = "%s cm" % dec(hexagon) if d else "지름×3"
    hi = "%s cm" % dec(square) if d else "지름×4"
    ans.append("정육각형의 둘레(%s) < 원주 < 정사각형의 둘레(%s)이므로 3 < 원주율 < 4" % (lo, hi))
OUT["6-2-u5-e1-exploration"] = ans

print("AUDIT " + json.dumps(OUT, ensure_ascii=False))
