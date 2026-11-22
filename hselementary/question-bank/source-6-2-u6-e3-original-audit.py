"""6-2 6단원 개념탐구 3 (여러 가지 회전체) 원문 구조 유형 독립 감사 (표준 라이브러리만 사용).

각 변형의 매개변수로 정답을 다시 계산하고, 가능한 곳은 전수 탐색으로 정답이 하나뿐인지 확인한다.
"""
import json
import math
from fractions import Fraction as F

OUT = {}


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
    raise AssertionError("non-terminating %s" % x)


PI = F(314, 100)

# ---------- 개념탐구: 다섯 회전체 ----------
EXD = [None, {"cyl": (2, 5), "cone": (3, 4), "sph": 2}, {"cyl": (3, 5), "cone": (2, 5), "sph": F(5, 2)}]
BOTTLE = [(F(19, 10), 0), (F(19, 10), 3), (F(7, 10), F(41, 10)), (F(7, 10), F(53, 10))]
# 병 반쪽 도형: 회전축 위 두 점 + 바깥 선 꼭짓점 → 꼭짓점 수
half = [(0, 0)] + BOTTLE + [(0, BOTTLE[-1][1])]
assert len(half) == 6  # 육각형
ex1, ex2, ex3, ex4 = [], [], [], []
for d in EXD:
    if d is None:
        ex1.append("㉮ 직사각형, ㉯ 병 모양의 반쪽(육각형), ㉰ 직각삼각형, ㉱ 반원, ㉲ 꽃병 모양의 반쪽")
        ex2.append("㉮ 직사각형, ㉯ 병 모양, ㉰ 이등변삼각형, ㉱ 원, ㉲ 꽃병 모양")
        ex3.append("모두 원")
        ex4.append("회전축을 품은 평면으로 자른 단면은 돌리기 전의 평면도형을 회전축을 대칭축으로 하여 붙인 선대칭도형이라 회전체마다 모양이 다르고, 회전축에 수직인 평면으로 자른 단면은 항상 원이다.")
        continue
    cr, ch = d["cyl"]
    kr, kh = d["cone"]
    sr = d["sph"]
    # 축을 품은 단면: 반쪽 도형과 대칭 도형을 붙임 → 가로 = 2 × 반지름
    w_cyl, w_cone = 2 * cr, 2 * kr
    # 수직 단면: 원뿔은 높이 y에서 반지름 kr*(1-y/kh) < kr (0<y), 구는 sqrt(sr^2 - t^2) <= sr
    assert all(kr * (1 - F(y, 10) / kh) < kr for y in range(1, int(kh * 10)))
    ex1.append("㉮ 가로 %s cm, 세로 %s cm인 직사각형, ㉯ 병 모양의 반쪽(육각형), ㉰ 밑변 %s cm, 높이 %s cm인 직각삼각형, ㉱ 반지름 %s cm인 반원, ㉲ 꽃병 모양의 반쪽" % (dec(cr), dec(ch), dec(kr), dec(kh), dec(sr)))
    ex2.append("㉮ 가로 %s cm, 세로 %s cm인 직사각형, ㉯ 병 모양, ㉰ 밑변 %s cm, 높이 %s cm인 이등변삼각형, ㉱ 반지름 %s cm인 원, ㉲ 꽃병 모양" % (dec(w_cyl), dec(ch), dec(w_cone), dec(kh), dec(sr)))
    ex3.append("모두 원 (㉮는 반지름 %s cm인 원, ㉰는 반지름이 %s cm보다 작은 원, ㉱는 반지름이 %s cm보다 크지 않은 원)" % (dec(cr), dec(kr), dec(sr)))
    ex4.append("회전축을 품은 평면으로 자른 단면은 돌리기 전의 평면도형을 회전축을 대칭축으로 하여 붙인 선대칭도형이라 회전체마다 모양이 다르고, 회전축에 수직인 평면으로 자른 단면은 항상 원이다. (예: ㉮는 가로 %s cm, 세로 %s cm인 직사각형과 반지름 %s cm인 원)" % (dec(w_cyl), dec(ch), dec(cr)))
OUT["6-2-u6-e3-exploration-1"] = ex1
OUT["6-2-u6-e3-exploration-2"] = ex2
OUT["6-2-u6-e3-exploration-3"] = ex3
OUT["6-2-u6-e3-exploration-4"] = ex4


# ---------- 예제 3-1: 평행사변형 → 각 높이의 바깥 반지름 = 두 삼각형 중 먼 쪽 ----------
def hour(a, h):
    a, h = F(a), F(h)
    rad = [max(a * (1 - F(i, 100)), a * F(i, 100)) for i in range(101)]  # y = h*i/100
    m = min(rad)
    assert rad.index(m) == 50 and rad[0] == a and rad[100] == a and m == a / 2
    return a, m


res = []
for a, h, lab in [(3, F(53, 10), False), (3, 6, True), (4, 5, True)]:
    top, mid = hour(a, h)
    res.append("위와 아래 밑면이 반지름 %s cm인 원이고, 높이 %s cm의 한가운데가 반지름 %s cm인 원으로 가장 잘록한 모래시계 모양" % (dec(top), dec(h), dec(mid)) if lab else
               "위와 아래 밑면이 같은 크기의 원이고 한가운데가 가장 잘록한 모래시계 모양")
OUT["6-2-u6-e3-example-1"] = res

# ---------- 예제 3-2: 컵 모양 ----------
res = []
for c in [dict(R=4, q=F(23, 10), p=F(24, 10), H3=F(35, 10), H2=F(28, 10), H1=F(32, 10), lab=False),
          dict(R=4, q=2, p=F(5, 2), H3=3, H2=F(5, 2), H1=3, lab=True),
          dict(R=5, q=3, p=3, H3=F(7, 2), H2=2, H1=3, lab=True)]:
    # 위쪽 띠(축에서 q~R)는 축에 닿지 않음 → 구멍 반지름 q, 아래쪽은 축까지 꽉 참
    assert 0 < c["q"] < c["R"] and 0 < c["p"] < c["R"]
    res.append("바깥 반지름이 %s cm이고 아래쪽이 비스듬히 좁아져 아랫면이 반지름 %s cm인 원이며, 위쪽 가운데에 반지름 %s cm인 원기둥 모양 구멍이 파인 컵 모양" % (dec(c["R"]), dec(c["p"]), dec(c["q"])) if c["lab"] else
               "아래쪽이 비스듬히 좁아지고, 위쪽 가운데에 원기둥 모양 구멍이 파인 컵 모양")
OUT["6-2-u6-e3-example-2"] = res

# ---------- 예제 3-3 ----------
res = []
for a, h, small in [(9, 4, "28.26"), (10, 5, "50.24"), (8, 3, "12.56")]:
    rs = [r for r in range(1, 50) if PI * r * r == F(small)]
    assert len(rs) == 1 and rs[0] < a
    r = rs[0]
    fig = 2 * F(a + r, 2) * h
    res.append("%s cm²" % dec(2 * fig))
OUT["6-2-u6-e3-example-3"] = res

# ---------- 예제 3-4 ----------
res = []
for l1, l2, h in [(8, F(13, 2), F(11, 2)), (10, F(15, 2), 6), (F(17, 2), 5, 4)]:
    l1, l2, h = F(l1), F(l2), F(h)
    assert h < l1 and h < l2  # 높이의 발이 변 ㄴㄷ 안쪽
    per = 2 * l1 + 2 * l2 + 2 * (2 * h * PI)
    res.append("%s cm" % dec(per))
OUT["6-2-u6-e3-example-4"] = res

# ---------- Mission 1 ----------
res = []
for a, b, H, lab in [(4, 2, F(49, 10), False), (6, 3, 7, True), (4, 3, F(24, 5), True)]:
    assert 0 < b < a
    res.append("윗면은 반지름 %s cm인 원, 아래 가장자리는 반지름 %s cm인 원이고, 아래쪽에서 윗면의 중심까지 원뿔 모양으로 파인 입체" % (dec(a), dec(b)) if lab else
               "윗면은 큰 원, 아래 가장자리는 작은 원이고, 아래쪽에서 윗면의 중심까지 원뿔 모양으로 파인 입체")
OUT["6-2-u6-e3-mission-1"] = res

# ---------- Mission 2: □를 0.1 단위로 전수 탐색 ----------
res = []
for t, L, big, ax in [(3, 8, "78.5", 48), (4, 12, "113.04", 84), (2, 7, "50.24", 32)]:
    ds = [d for d in range(1, 50) if PI * d * d == F(big)]
    assert len(ds) == 1
    d = ds[0]
    w = d - t
    sols = []
    for k in range(1, 1000):
        hh = F(k, 10)
        area = t * 2 * hh + (2 * hh + L) * w / 2
        if area * 2 == ax and 2 * hh < L:
            sols.append(hh)
    assert len(sols) == 1, sols
    res.append("%s cm" % dec(sols[0]))
OUT["6-2-u6-e3-mission-2"] = res


# ---------- Mission 3: 폴리오미노 전수 탐색 ----------
def norm(cells):
    mx = min(x for x, y in cells)
    my = min(y for x, y in cells)
    return frozenset((x - mx, y - my) for x, y in cells)


def polys(n):
    cur = {frozenset([(0, 0)])}
    for _ in range(n - 1):
        nxt = set()
        for p in cur:
            for x, y in p:
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    c = (x + dx, y + dy)
                    if c not in p:
                        nxt.add(norm(p | {c}))
        cur = nxt
    return cur


def solids(p):
    out = set()
    for cells in (p, frozenset((y, x) for x, y in p)):
        for a in range(min(x for x, y in cells), max(x for x, y in cells) + 2):
            if not any(x == a or x + 1 == a for x, y in cells):
                continue  # 회전축은 어떤 정사각형의 한 변을 포함해야 함
            ys = [y for x, y in cells]
            prof = []
            for y in range(min(ys), max(ys) + 1):
                iv = sorted({(min(abs(x - a), abs(x + 1 - a)), max(abs(x - a), abs(x + 1 - a))) for x, yy in cells if yy == y})
                m = []
                for s, e in iv:
                    if m and s <= m[-1][1]:
                        m[-1] = (m[-1][0], max(m[-1][1], e))
                    else:
                        m.append((s, e))
                prof.append(tuple(m))
            prof = tuple(prof)
            out.add(min(prof, prof[::-1]))  # 뒤집어 같은 입체는 하나
    return out


def count(n):
    s = set()
    for p in polys(n):
        s |= solids(p)
    return len(s)


assert count(2) == 3  # 문제에 주어진 예시와 일치
OUT["6-2-u6-e3-mission-3"] = ["%d가지" % count(n) for n in (3, 4, 3)]

# ---------- Mission 4: ㉠, ㉡을 0.5 단위로 전수 탐색 ----------
res = []
for R, p, q, A in [(7, 3, 5, 112), (6, 2, 3, 120), (8, 1, 2, 144)]:
    sols = []
    for i in range(1, 200):
        for j in range(1, 200):
            a, b = F(i, 2), F(j, 2)
            if a * q == b * p and 2 * (a + b) * R / 2 == A:
                sols.append((a, b))
    assert len(sols) == 1
    a, b = sols[0]
    res.append("㉠ %s cm, ㉡ %s cm" % (dec(a), dec(b)))
OUT["6-2-u6-e3-mission-4"] = res

# ---------- Mission 5 ----------
res = []
for full, t in [(32, 24), (36, 24), (45, 15)]:
    th = F(360 * t, full)
    assert th.denominator == 1 and 0 < th < 360
    res.append("중심각이 %s°인 부채꼴" % dec(th))
OUT["6-2-u6-e3-mission-5"] = res

# ---------- Mission 6: 두 정육각형 회전체 ----------
R3 = math.sqrt(3)


def hexagon(cx):
    h = R3 / 2
    return [(cx, 1), (cx + h, 0.5), (cx + h, -0.5), (cx, -1), (cx - h, -0.5), (cx - h, 0.5)]


HEX = [hexagon(-R3 / 2), hexagon(R3 / 2)]


def chord(poly, p0, d, n, t):
    """축 위 위치 t에서 축에 수직인 직선이 다각형을 자르는 구간(축으로부터의 부호 있는 거리)."""
    vals = []
    k = len(poly)
    for i in range(k):
        (x1, y1), (x2, y2) = poly[i], poly[(i + 1) % k]
        s1 = (x1 - p0[0]) * d[0] + (y1 - p0[1]) * d[1] - t
        s2 = (x2 - p0[0]) * d[0] + (y2 - p0[1]) * d[1] - t
        if (s1 <= 0 <= s2 or s2 <= 0 <= s1) and s1 != s2:
            u = s1 / (s1 - s2)
            x, y = x1 + u * (x2 - x1), y1 + u * (y2 - y1)
            vals.append((x - p0[0]) * n[0] + (y - p0[1]) * n[1])
    return (min(vals), max(vals)) if vals else None


def profile(p0, d, samples):
    n = (-d[1], d[0])
    proj = [(x - p0[0]) * d[0] + (y - p0[1]) * d[1] for poly in HEX for x, y in poly]
    lo, hi = min(proj), max(proj)
    out = []
    for i in range(samples + 1):
        t = lo + (hi - lo) * (i + 0.5 * (i == 0) - 0.5 * (i == samples)) / samples
        rs = []
        for poly in HEX:
            c = chord(poly, p0, d, n, t)
            if c:
                a, b = c
                rs.append((0.0, max(abs(a), abs(b))) if a <= 0 <= b else (min(abs(a), abs(b)), max(abs(a), abs(b))))
        rs.sort()
        m = []
        for s, e in rs:
            if m and s <= m[-1][1] + 1e-9:
                m[-1] = (m[-1][0], max(m[-1][1], e))
            else:
                m.append((s, e))
        out.append((m[0][0], m[-1][1]))  # (가장 안쪽, 가장 바깥) 반지름
    return hi - lo, out


def pl(pts, y):
    for (r1, y1), (r2, y2) in zip(pts, pts[1:]):
        if y1 - 1e-12 <= y <= y2 + 1e-12:
            return r1 + (r2 - r1) * (y - y1) / (y2 - y1)
    raise AssertionError


# 보기 입체(겨냥도 자료와 같은 값): 길이, 바깥 반지름, 안쪽(구멍) 반지름
OPT = {
    "A": (2 * R3, [(0.5, 0), (1, R3 / 2), (0.5, R3), (1, 1.5 * R3), (0.5, 2 * R3)], None),
    "B": (2 * R3, [(1.5, 0), (2, R3 / 2), (1.5, R3), (2, 1.5 * R3), (1.5, 2 * R3)], [(0.5, 0), (0, R3 / 2), (0.5, R3), (0, 1.5 * R3), (0.5, 2 * R3)]),
    "F": (R3, [(1.5, 0), (2, R3 / 2), (1.5, R3)], [(0.5, 0), (0, R3 / 2), (0.5, R3)]),
    "C": (2, [(R3 / 2, 0), (R3, 0.5), (R3, 1.5), (R3 / 2, 2)], [(R3 / 2, 0), (0, 0.5), (0, 1.5), (R3 / 2, 2)]),
    "D": (2, [(R3, 0), (1.5 * R3, 0.5), (1.5 * R3, 1.5), (R3, 2)], [(0, 0), (0, 2)]),
}
AXES = {"A": ((0, 0), (1, 0)), "B": ((0, 1), (1, 0)), "C": ((0, 0), (0, 1)), "D": ((-R3 / 2, 0), (0, 1))}
N = 400
for k, (p0, d) in AXES.items():
    L, prof = profile(p0, d, N)
    length, outer, inner = OPT[k]
    assert abs(L - length) < 1e-9, k
    for i, (ri, ro) in enumerate(prof):
        y = length * (i + 0.5 * (i == 0) - 0.5 * (i == N)) / N
        assert abs(ro - pl(outer, y)) < 1e-6, (k, y)
        if inner is not None:
            assert abs(ri - pl(inner, y)) < 1e-6, (k, y, ri)
        else:
            assert ri < 1e-9
# F는 길이가 정육각형 1개(√3)인데, 어느 방향의 직선을 회전축으로 해도 도형의 축 방향 길이는 √3보다 길다
widths = []
for deg in range(0, 1800):
    th = math.radians(deg / 10)
    d = (math.cos(th), math.sin(th))
    pr = [x * d[0] + y * d[1] for poly in HEX for x, y in poly]
    widths.append(max(pr) - min(pr))
assert min(widths) > R3 + 0.2
NUM = ["①", "②", "③", "④", "⑤"]
OUT["6-2-u6-e3-mission-6"] = [NUM[o.index("F")] for o in (["A", "F", "B", "C", "D"], ["C", "A", "B", "F", "D"], ["F", "B", "D", "A", "C"])]

print("AUDIT " + json.dumps(OUT, ensure_ascii=False))
