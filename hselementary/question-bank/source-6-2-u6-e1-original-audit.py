# 황소 6-2 6단원 개념탐구 1 (원기둥) 원문 구조 유형 독립 감사.
# 각 변형의 문제에 보이는 수만으로 답을 다시 계산하고, 가능한 범위를 모두 찾아 답이 하나뿐인지 확인합니다.
import json
import math
from fractions import Fraction as F

OUT = {}


def dec(x):
    x = F(x)
    assert x >= 0
    d = x.denominator
    while d % 2 == 0:
        d //= 2
    while d % 5 == 0:
        d //= 5
    assert d == 1, "끝나는 소수가 아님: %s" % x
    w = x.numerator // x.denominator
    r = x - w
    s = str(w)
    if r:
        digs = ""
        while r:
            r *= 10
            digs += str(r.numerator // r.denominator)
            r -= r.numerator // r.denominator
        s += "." + digs
    return s


GRID = [F(k, 100) for k in range(1, 20001)]  # 0.01 ~ 200 사이 후보


def unique(cands):
    assert len(cands) == 1, cands
    return cands[0]


# 개념탐구: 원 4개 + 세로 철사 8개, 원주율 3
ans = []
for H, L in [(15, 264), (12, 216), (20, 328)]:
    r = unique([r for r in GRID if 8 * H + 4 * (2 * r * 3) == L])
    assert r > 0
    ans.append(dec(r) + " cm")
OUT["6-2-u6-e1-exploration-1"] = ans

# 예제 1-1: 정사각형(한 변 s) 안의 가장 큰 원기둥 전개도. 가로 = 원주, 세로 = 지름 2개 + 높이. 원주율 3.1
ans = []
for s in [F("86.8"), F(62), F("74.4")]:
    r = unique([r for r in GRID if 2 * r * F("3.1") == s])
    h = s - 4 * r
    assert h > 0
    # 둘레: 두 원의 둘레 + 직사각형 둘레 (원은 한 점에서 맞닿음)
    per = 2 * (2 * r * F("3.1")) + 2 * (s + h)
    ans.append(dec(per) + " cm")
OUT["6-2-u6-e1-example-1"] = ans

# 예제 1-2: 롤러 길이 len, 바퀴 수 t, 칠한 넓이 A. 원주율 3.1
ans = []
for ln, t, A in [(15, 4, F(744)), (20, 5, F(1860)), (18, 3, F(837))]:
    c = unique([c for c in GRID if c * ln * t == A])
    r = c / 2 / F("3.1")
    assert r > 0
    per = 2 * c + 2 * (c + ln)
    ans.append(dec(per) + " cm")
OUT["6-2-u6-e1-example-2"] = ans


def quarter_net_perimeter(r, H, pi):
    # 꼭짓점 순서대로 둘레의 각 변(곡선 포함) 길이
    q = pi * r / 2
    edges = {
        "ㄱㄴ": H, "ㄴㄷ": r, "ㄷㄹ": r, "곡선ㄹㅁ": q, "ㅁㅂ": q,
        "ㅂㅅ": H, "ㅅㅇ": q, "곡선ㅇㅈ": q, "ㅈㅊ": r, "ㅊㄱ": r,
    }
    # 접었을 때 맞닿는 변끼리 길이가 같은지 확인 (입체가 닫히는지)
    assert edges["ㄱㄴ"] == edges["ㅂㅅ"]
    assert edges["ㅈㅊ"] == edges["ㅊㄱ"] and edges["곡선ㅇㅈ"] == edges["ㅅㅇ"]
    assert edges["ㄷㄹ"] == edges["ㄴㄷ"] and edges["곡선ㄹㅁ"] == edges["ㅁㅂ"]
    return sum(edges.values())


# 예제 1-3: 원기둥을 4등분한 입체의 전개도. ㄱㄴ = H, ㅈㅊ = ㅇㅊ = r, ㅅㅇ 주어짐. 원주율 3.14
ans = []
for H, r, so in [(3, 1, F("1.57")), (5, 2, F("3.14")), (8, 3, F("4.71"))]:
    assert F("3.14") * 2 * r / 4 == so  # 주어진 ㅅㅇ이 사분원의 호와 같음
    ans.append(dec(quarter_net_perimeter(F(r), F(H), F("3.14"))) + " cm")
OUT["6-2-u6-e1-example-3"] = ans

# 예제 1-4: 45°로 한 바퀴 → 옆면 직사각형의 대각선, 높이 = 가로(원주)
ans = []
for R in [40, 25, 15]:
    c = 2 * R * F("3.14")
    # 45°이면 (높이) : (가로) = 1 : 1 인 직각이등변삼각형
    h = unique([h for h in [F(k, 10) for k in range(1, 5001)] if h == c])
    ans.append(dec(h) + " cm")
OUT["6-2-u6-e1-example-4"] = ans

# Mission 1: 반지름 r, 정사각형 한 변 s. 원주율 3.14
ans = []
for r, s in [(5, F("31.4")), (10, F("62.8")), (15, F("94.2"))]:
    c = 2 * r * F("3.14")
    assert c == s
    h = unique([h for h in GRID if 2 * (2 * r) + h == s])
    ans.append("높이 %s cm, 밑면의 둘레 %s cm" % (dec(h), dec(c)))
OUT["6-2-u6-e1-mission-1"] = ans

# Mission 2: 롤러(원주 c, 높이 h)로 21 cm × 29.7 cm 칠하기. 넓이 하한과 실제로 칠하는 방법을 모두 확인
ans = []
A = F(21) * F("29.7")
for c, h in [(F("15.7"), 11), (F("18.84"), 15), (F("9.42"), 7)]:
    one = c * h
    lower = min(t for t in range(1, 100) if t * one >= A)
    # 폭 h인 줄 k개로 나누어 길이 l만큼씩 굴리기 (두 방향 중 좋은 쪽)
    best = None
    for w, l in [(F(21), F("29.7")), (F("29.7"), F(21))]:
        k = math.ceil(w / h)
        t = math.ceil(k * l / c)
        best = t if best is None else min(best, t)
    assert best == lower, (best, lower)
    ans.append("%d바퀴" % lower)
OUT["6-2-u6-e1-mission-2"] = ans

# Mission 3: 반지름 r, 높이 H, 원주율 3
ans = []
for r, H in [(1, 3), (2, 5), (3, 7)]:
    ans.append(dec(quarter_net_perimeter(F(r), F(H), F(3))) + " cm")
OUT["6-2-u6-e1-mission-3"] = ans


def shoelace(pts):
    s = 0
    for i in range(len(pts)):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % len(pts)]
        s += x1 * y2 - x2 * y1
    return abs(s) / 2


# Mission 4: 한 바퀴 실 = 옆면 직사각형의 대각선, 아래쪽 삼각형 넓이. 원주율 3.1
ans = []
for r, H in [(8, 30), (5, 20), (6, 25)]:
    c = 2 * r * F("3.1")
    below = shoelace([(F(0), F(0)), (c, F(0)), (c, F(H))])  # 왼쪽 아래 → 오른쪽 위 대각선 아래
    below2 = shoelace([(F(0), F(H)), (F(0), F(0)), (c, F(0))])  # 왼쪽 위 → 오른쪽 아래 대각선 아래
    assert below == below2 == c * H / 2
    ans.append(dec(below) + " cm²")
OUT["6-2-u6-e1-mission-4"] = ans

# Mission 5: 반지름 r인 원 6개를 한 줄로 맞닿게 놓고 둘러싼 띠의 길이 × 높이. 원주율 3.14
ans = []
for r, h in [(3, 8), (2, 10), (5, 7)]:
    centers = [(2 * r * i, 0) for i in range(6)]
    # 같은 반지름 원들의 볼록 껍질 둘레 = 중심들의 볼록 껍질 둘레 + 원 한 개의 둘레
    xs = [x for x, _ in centers]
    hull_centers = 2 * (max(xs) - min(xs))  # 한 줄이므로 양쪽 직선 두 번
    band = hull_centers + 2 * r * F("3.14")
    ans.append(dec(band * h) + " cm²")
OUT["6-2-u6-e1-mission-5"] = ans

# Mission 6: N바퀴 가장 짧게 → 옆면 N장을 이어 붙인 직사각형의 대각선을 한 장에 접어 넣기
ans = []
for N in [2, 3, 4]:
    C, H = F(1), F(1)  # 길이와 무관하므로 단위 길이
    # (0, H)에서 (N*C, 0)까지 곧은 선분; 한 장마다 잘라 옮긴 선분
    segs = []
    for k in range(N):
        y_start = H - H * k / N
        y_end = H - H * (k + 1) / N
        segs.append(((F(0), y_start), (C, y_end)))
    slopes = {(b[1] - a[1]) / (b[0] - a[0]) for a, b in segs}
    assert len(slopes) == 1  # 모두 평행
    assert segs[0][0] == (0, H) and segs[-1][1] == (C, 0)  # ㄱ(왼쪽 위)에서 시작, ㄴ(오른쪽 아래)에서 끝
    for a, b in zip(segs, segs[1:]):
        assert a[1][1] == b[0][1]  # 오른쪽 변에서 나간 높이로 왼쪽 변에서 다시 들어옴
    # 다른 감는 횟수의 선분은 N바퀴가 아니므로 제외, 같은 N에서 가장 짧은 길은 곧은 선분 하나뿐
    ans.append("옆면의 세로를 %d등분한 점을 차례로 잇는 평행한 선분 %d개" % (N, len(segs)))
OUT["6-2-u6-e1-mission-6"] = ans

print("AUDIT " + json.dumps(OUT, ensure_ascii=False))
