# 6-1 4·5·6단원 잠금 원문 유형(6-1-u456) 독립 검산. 표준 라이브러리만 씁니다.
import json
from fractions import Fraction as F
from itertools import product

OUT = {}

def dec(x):
    x = F(x)
    if x.denominator == 1:
        return str(x.numerator)
    s = "%.6f" % float(x)
    return s.rstrip("0").rstrip(".")

def fr(x):
    x = F(x)
    return "%d/%d" % (x.numerator, x.denominator)

# ---------- 4단원 개념탐구 1-(1): 제기차기 횟수 비교 ----------
ans = []
for a, b in [(16, 10), (18, 12), (15, 12)]:
    d, t = a - b, F(a, b)
    assert d > 0 and t > 1 and F(a) / b == t
    ans.append("뺄셈: 형규가 %d − %d = %d(번) 더 많이 찼습니다. 나눗셈: 형규는 동빈이의 %d ÷ %d = %s(배)만큼 찼습니다. 비: 형규와 동빈이의 횟수의 비는 %d : %d입니다." % (a, b, d, a, b, dec(t), a, b))
OUT["6-1-u4-e1-exploration-1-1"] = ans

# ---------- 4단원 개념탐구 1-(2): 소금물 진하기 ----------
ans = []
for w1, s1, w2, s2 in [(350, 20, 416, 24), (300, 25, 380, 30), (240, 18, 330, 26)]:
    r1, r2 = F(s1, w1), F(s2, w2)
    assert r1 != r2
    # 소금물 전체 기준으로 비교해도 같은 결론인지 확인
    assert (r1 > r2) == (F(s1, s1 + w1) > F(s2, s2 + w2))
    who = "동수" if r1 > r2 else "철수"
    big, small = (r1, r2) if r1 > r2 else (r2, r1)
    ans.append("물의 양에 대한 소금의 양의 비율로 비교합니다. 동수는 %d/%d = %s, 철수는 %d/%d = %s이고, 통분하여 비교하면 %s의 비율이 더 크므로 %s가 만든 소금물이 더 짭니다."
               % (s1, w1, fr(r1), s2, w2, fr(r2), who, who))
OUT["6-1-u4-e1-exploration-1-2"] = ans

# ---------- 5단원 개념탐구 1-(1),(2): 권역별 야구 동호회 그림그래프 ----------
REG = ["서울·인천·경기", "대전·세종·충청", "광주·전라", "강원", "대구·부산·울산·경상", "제주"]
CLUB = [[3130, 481, 594, 289, 776, 75], [2240, 615, 532, 307, 1048, 92], [2530, 356, 712, 248, 663, 41]]
# 원문 그림그래프에서 센 그림 수(큰 그림 1000개, 작은 그림 100개): 서울 3+2, 충청 0+5, 전라 0+6, 강원 0+3, 경상 0+8, 제주 0+1
SRC_ICONS = [(3, 2), (0, 5), (0, 6), (0, 3), (0, 8), (0, 1)]
def ceil100(n): return -(-n // 100) * 100
def round100(n): return (n + 50) // 100 * 100
def floor100(n): return n // 100 * 100
rules = {"올림": ceil100, "반올림": round100, "버림": floor100}
shown0 = [b * 1000 + s * 100 for b, s in SRC_ICONS]
fit = [k for k, g in rules.items() if [g(n) for n in CLUB[0]] == shown0]
assert fit == ["올림"], fit            # 원문 그림과 맞는 방법은 올림 하나뿐
ans1, ans2 = [], []
for v in CLUB:
    shown = [ceil100(n) for n in v]
    assert [k for k, g in rules.items() if [g(n) for n in v] == shown] == ["올림"]  # 변형도 올림만 맞음
    k = next(i for i, n in enumerate(v) if ceil100(n) != round100(n))
    ans1.append("백의 자리 아래 수를 올림하여 백의 자리까지 나타냈습니다. 예를 들어 %s의 %d개를 %d개로 나타냈습니다." % (REG[k], v[k], shown[k]))
    ans2.append("표는 %d개처럼 정확한 수를 알 수 있고, 그림그래프는 그림의 크기와 개수로 권역별 많고 적음을 한눈에 비교할 수 있지만 %d개처럼 어림한 수만 알 수 있습니다." % (v[0], shown[0]))
OUT["6-1-u5-e1-exploration-1-1"] = ans1
OUT["6-1-u5-e1-exploration-1-2"] = ans2

# ---------- 5단원 개념탐구 1-(2): 관객 수 반올림 그림그래프 (조건 보충: 만의 자리까지) ----------
AGES = ["10대", "20대", "30대", "40대", "50대"]
ans = []
for v in [[178540, 429158, 582175, 216530, 15068], [263480, 357920, 491305, 128640, 46215], [145730, 512860, 384120, 297450, 23980]]:
    r = [(n + 5000) // 10000 * 10000 for n in v]
    for n, x in zip(v, r):
        assert abs(n - x) <= 5000 and x % 10000 == 0
        assert x // 100000 <= 9 and (x % 100000) // 10000 <= 9   # 큰 그림·작은 그림 수가 한 자리
    ans.append(", ".join("%s %d명" % (a, x) for a, x in zip(AGES, r)))
OUT["6-1-u5-e1-exploration-2"] = ans

# ---------- 5단원 개념탐구 4 예제 3 / Mission 3: 눈금 띠그래프 + 원그래프 선거 ----------
def election(names, n, left, pct, known2, known3, known_side):
    """n: 띠 칸 수, left: 왼쪽 칸 수, pct: 원그래프 비율(왼쪽 집단 기준), known2/3: 후보2·3이 오른쪽/왼쪽 집단에서 얻은 표.
    known_side='left' 이면 주어진 표는 왼쪽 칸(남학생), 'right' 이면 오른쪽 칸(㉯ 모둠). 원그래프는 반대쪽 집단 기준."""
    # 전수 탐색: 원그래프 집단 전체 표 G를 1부터 찾아 모든 조건이 맞는 경우를 셈
    sols = []
    for G in range(1, 20001):
        g2 = F(G * pct[1], 100)
        g3 = F(G * pct[2], 100)
        g1 = F(G * pct[0], 100)
        if any(x.denominator != 1 for x in (g1, g2, g3)):
            continue
        tot = []
        ok = True
        for i, g in enumerate((g1, g2, g3)):
            pie_parts = (n[i] - left[i]) if known_side == "left" else left[i]
            unit = g / pie_parts
            if unit.denominator != 1:
                ok = False; break
            tot.append(unit * n[i])
        if not ok:
            continue
        k2 = tot[1] / n[1] * (left[1] if known_side == "left" else n[1] - left[1])
        k3 = tot[2] / n[2] * (left[2] if known_side == "left" else n[2] - left[2])
        if k2 == known2 and k3 == known3:
            sols.append(tot)
    assert len(sols) == 1, sols
    tot = sols[0]
    m = max(tot)
    assert tot.count(m) == 1
    w = tot.index(m)
    return "%s, %d표" % (names[w], m)

ans = []
for n, mleft, p, B2, B3 in [([13, 8, 11], [7, 5, 3], [22, 30, 48], 600, 216),
                            ([9, 7, 12], [4, 4, 5], [40, 25, 35], 500, 375),
                            ([10, 12, 7], [3, 7, 2], [35, 20, 45], 560, 360)]:
    assert sum(p) == 100
    ans.append(election(["정호", "은경", "경민"], n, mleft, p, B2, B3, "left"))
OUT["6-1-u5-e4-example-3"] = ans

ans = []
for n, aleft, p, B2, B3 in [([13, 8, 11], [6, 3, 7], [40, 25, 35], 200, 96),
                            ([11, 9, 10], [5, 4, 7], [45, 20, 35], 250, 150),
                            ([12, 8, 13], [5, 3, 8], [30, 30, 40], 400, 200)]:
    assert sum(p) == 100
    ans.append(election(["영수", "지혜", "동민"], n, aleft, p, B2, B3, "right"))
OUT["6-1-u5-e4-mission-3"] = ans

# ---------- 6단원 공통: 단위 정육면체 칸으로 겉넓이 세기 ----------
DIRS = [(1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)]
def faces(cells):
    return sum(1 for (x, y, z) in cells for dx, dy, dz in DIRS if (x + dx, y + dy, z + dz) not in cells)

# Mission 4: 정육면체 a에서 앞면 세로 홈(가로 w, 깊이 d, 위아래 관통)과 뒤쪽 아래 모서리 홈(깊이 p, 높이 q, 좌우 관통)을 1 cm 칸으로 제거
ans = []
for a, s0, w, d, p, q in [(12, 4, 4, 4, 4, 4), (10, 3, 4, 3, 3, 4), (15, 5, 5, 5, 5, 5)]:
    cells = set()
    for x, y, z in product(range(a), repeat=3):
        slot = s0 <= x < s0 + w and y < d
        notch = y >= a - p and z < q
        if not (slot or notch):
            cells.add((x, y, z))
    removed = a ** 3 - len(cells)
    assert removed == w * d * a + p * q * a          # 두 조각이 겹치지 않음
    ans.append("%d cm²" % faces(cells))
OUT["6-1-u6-e1-mission-4"] = ans

# Mission 5: 4×4×4 쌓기나무에서 원문 그림의 8칸 제거
R = {(0, 0, 2), (0, 0, 3), (1, 0, 3), (1, 1, 3), (1, 2, 3), (2, 0, 1), (2, 0, 2), (2, 0, 3)}
cells = {c for c in product(range(4), repeat=3)} - R
assert len(R) == 8
nf = faces(cells)
ans = ["%d cm²" % (nf * e * e) for e in (2, 3, 4)]
OUT["6-1-u6-e1-mission-5"] = ans

# e3 Mission 1: 앞면 단면을 칸으로 만들어 겉넓이가 주어진 값과 같은지 확인하고, 둘레 공식으로 구한 부피와 칸으로 센 부피를 대조
ans = []
for W, D, H, dd, xs, hs in [(42, 32, 28, 14, [0, 8, 18, 30, 42], [28, 6, 20, 14]),
                            (40, 30, 24, 12, [0, 8, 18, 30, 40], [24, 5, 17, 10]),
                            (36, 25, 30, 15, [0, 7, 15, 26, 36], [30, 6, 21, 12])]:
    assert max(hs) == H == hs[0] and hs[2] - hs[1] == dd and xs[-1] == W
    prof = {(x, z) for i in range(4) for x in range(xs[i], xs[i + 1]) for z in range(hs[i])}
    A = len(prof)
    perim = sum(1 for (x, z) in prof for dx, dz in [(1, 0), (-1, 0), (0, 1), (0, -1)] if (x + dx, z + dz) not in prof)
    S = 2 * A + perim * D                        # 문제에 주는 겉넓이(그림과 일치)
    # 학생 풀이: 둘레 = 2W + 2H + 2dd, 앞면 넓이 = (S - 둘레×D) ÷ 2
    P2 = 2 * W + 2 * H + 2 * dd
    assert P2 == perim
    A2 = F(S - P2 * D, 2)
    assert A2 == A
    ans.append("%d cm³" % (A2 * D))
OUT["6-1-u6-e3-mission-1"] = ans

print("AUDIT " + json.dumps(OUT, ensure_ascii=False))
