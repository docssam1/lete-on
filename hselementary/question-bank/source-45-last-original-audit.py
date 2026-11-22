# Independent audit for source-45-last-original.js (python3 -I, standard library only).
# Recomputes every variant answer from the variant parameters by simulation / exhaustive search and checks uniqueness.
import itertools, json, math
from fractions import Fraction as F

OUT = {}


def check(cond, msg):
    if not cond:
        raise SystemExit('FAIL ' + msg)


# 1. 4-1-u2-t5-9: fold a triangle along a segment, measure the two angles numerically
def fold_sum(Bdeg, extC):
    C = 180 - extC
    B = (0.0, 0.0); Cp = (10.0, 0.0)
    tb, tc = math.tan(math.radians(Bdeg)), math.tan(math.radians(C))
    x = 10 * tc / (tb + tc); A = (x, x * tb)
    D = (A[0] + .36 * (B[0] - A[0]), A[1] + .36 * (B[1] - A[1]))
    E = (A[0] + .42 * (Cp[0] - A[0]), A[1] + .42 * (Cp[1] - A[1]))
    dx, dy = E[0] - D[0], E[1] - D[1]
    t = ((A[0] - D[0]) * dx + (A[1] - D[1]) * dy) / (dx * dx + dy * dy)
    P = (D[0] + t * dx, D[1] + t * dy); A2 = (2 * P[0] - A[0], 2 * P[1] - A[1])
    check(A2[1] > 0, 'folded vertex inside')

    def angle(v, p, q):
        a1 = math.atan2(p[1] - v[1], p[0] - v[0]); a2 = math.atan2(q[1] - v[1], q[0] - v[0])
        d = abs(math.degrees(a1 - a2)) % 360
        return min(d, 360 - d)
    s = angle(D, B, A2) + angle(E, Cp, A2)
    check(abs(s - round(s)) < 1e-6, 'integer sum')
    check(round(s) == 2 * (extC - Bdeg), 'sum formula')
    return round(s)


OUT['4-1-u2-t5-9'] = [f'{fold_sum(b, c)}°' for b, c in ((65, 115), (70, 130), (55, 100))]


# 2. 4-1-u2-t6-5: hour hand between h and h+1, minute hand exactly on a numeral
def clock(h, A):
    sols = []
    for k in range(1, 12):  # minute hand on numeral k -> 5k minutes (k=0 would put the hour hand on h)
        m = 5 * k
        hour = F(30 * h) + F(m, 2); minute = F(6 * m)
        d = abs(hour - minute) % 360
        d = min(d, 360 - d)
        if d == A:
            sols.append(m)
    check(len(sols) == 1, f'clock unique {h} {A} {sols}')
    return f'{h}시 {sols[0]}분'


OUT['4-1-u2-t6-5'] = [clock(3, 75), clock(5, 70), clock(8, 130)]

# 3. 4-1-u4-t2-4: square cut into 8 triangles, track the star with coordinates
LAB = {(-1, 3): '나', (1, 3): '다', (3, 1): '라', (3, -1): '마', (1, -3): '바', (-1, -3): '사', (-3, -1): '아', (-3, 1): '가'}
INV = {v: k for k, v in LAB.items()}
OPS = {'R': lambda p: (-p[0], p[1]), 'L': lambda p: (-p[0], p[1]), 'U': lambda p: (p[0], -p[1]), 'D': lambda p: (p[0], -p[1]),
       'CW': lambda p: (p[1], -p[0]), 'CCW': lambda p: (-p[1], p[0])}


def run(p, moves, inverse=False):
    seq = []
    for kind, n, *deg in moves:
        reps = n * (deg[0] // 90 if deg else 1)
        seq += [kind] * reps
    if inverse:
        seq = [{'CW': 'CCW', 'CCW': 'CW'}.get(k, k) for k in reversed(seq)]
    for k in seq:
        p = OPS[k](p)
    return p


def moves_answer(C, W, wrong):
    p = run(INV[wrong], W, inverse=True)
    # check: the original position is the only one that W maps to `wrong`
    origs = [q for q in LAB if run(q, W) == INV[wrong]]
    check(origs == [p], 'unique start')
    res = LAB[run(p, C)]
    check(res != wrong, 'correction changes the place')
    return res


OUT['4-1-u4-t2-4'] = [
    moves_answer([('R', 1), ('CW', 1, 90)], [('CW', 1, 90), ('R', 1)], '다'),
    moves_answer([('U', 3), ('CCW', 5, 90)], [('CCW', 5, 90), ('U', 3)], '라'),
    moves_answer([('L', 5), ('CW', 3, 90)], [('CW', 3, 90), ('L', 5)], '바'),
]


# 4. 4-1-u4-t3-3: 2x2 bitmap of the shaded corner, alternate right-flip / down-flip
def strip(start, n):
    g = [[0, 0], [0, 0]]
    r, c = {'TL': (0, 0), 'TR': (0, 1), 'BL': (1, 0), 'BR': (1, 1)}[start]
    g[r][c] = 1
    for i in range(1, n):
        g = [row[::-1] for row in g] if i % 2 == 1 else g[::-1]
    pos = [(i, j) for i in range(2) for j in range(2) if g[i][j]][0]
    opts = [(0, 0), (0, 1), (1, 0), (1, 1)]  # ① TL ② TR ③ BL ④ BR
    return '①②③④'[opts.index(pos)]


OUT['4-1-u4-t3-3'] = [strip('TL', 23), strip('BL', 41), strip('TR', 34)]


# 5. 4-1-u4-t3-9: tile features on edges; count complete circles in a strip of n tiles
def circles(n):
    tiles = []
    for i in range(n):
        t = {'inner': 1, 'right': True, 'left': False, 'top': True}
        if i % 2 == 1:  # flipped to the right: left/right edges swap
            t = dict(t, right=t['left'], left=t['right'])
        tiles.append(t)
    cnt = sum(t['inner'] for t in tiles)
    cnt += sum(1 for a, b in zip(tiles, tiles[1:]) if a['right'] and b['left'])
    return f'{cnt}개'


OUT['4-1-u4-t3-9'] = [circles(15), circles(20), circles(13)]

# 6. 4-1-u5-t2-2: days of months
DAYS = {3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 9: 30, 10: 31, 11: 30, 12: 31}


def rain(months, known, dry):
    total = sum(DAYS[m] for m in months)
    cands = [x for x in range(0, DAYS[months[-1]] + 1) if sum(known) + x + dry == total]
    check(len(cands) == 1, 'rain unique')
    return f'{cands[0]}일'


OUT['4-1-u5-t2-2'] = [rain((4, 5, 6, 7), (8, 6, 11), 122 - 34), rain((9, 10, 11, 12), (7, 4, 6), 122 - 27), rain((3, 4, 5, 6), (6, 10, 8), 122 - 29)]


# 7. 4-1-u5-t2-3: fill two bars then compare differences
def classes(boys, girls, tot2, d3):
    boys = list(boys); girls = list(girls)
    boys[1] = tot2 - girls[1]
    girls[2] = girls[0] + d3
    diffs = [abs(a - b) for a, b in zip(boys, girls)]
    m = max(diffs)
    check(diffs.count(m) == 1, 'unique max class')
    return f'{diffs.index(m) + 1}반, {m}명'


OUT['4-1-u5-t2-3'] = [classes([14, 0, 16, 10], [12, 15, 0, 14], 28, -3), classes([13, 0, 12, 16], [15, 10, 0, 11], 27, -1),
                      classes([15, 0, 9, 13], [11, 14, 0, 16], 26, 6)]


# 8. 4-1-u5-t2-11: exhaustive search of the three missing bars
def mountains(ji, so, gap):
    best = None
    for hal in range(1, 60):
        for seol in range(1, 60):
            for buk in range(1, 60):
                v = [hal, seol, ji, buk, so]
                if all(v[i] > v[i + 1] for i in range(4)) and hal == seol + gap:
                    s = sum(v)
                    best = s if best is None or s < best else best
    return f'{best}명'


OUT['4-1-u5-t2-11'] = [mountains(7, 3, 3), mountains(9, 4, 2), mountains(6, 2, 4)]


# 9. 4-2-u2-t3-7: all ways to draw 3 lines through boundary lattice points; count isosceles triangles
def iso_max(W, H, fixed=None):
    pts = [(x, 0) for x in range(W + 1)] + [(x, H) for x in range(W + 1)] + [(0, y) for y in range(1, H)] + [(W, y) for y in range(1, H)]

    def sides(p):
        return {s for s, ok in (('b', p[1] == 0), ('t', p[1] == H), ('l', p[0] == 0), ('r', p[0] == W)) if ok}
    chords = [(p, q) for p, q in itertools.combinations(pts, 2) if not (sides(p) & sides(q))]
    segs = [((0, 0), (W, 0)), ((W, 0), (W, H)), ((W, H), (0, H)), ((0, H), (0, 0))] + chords
    cache = {}

    def meet(i, j):
        key = (min(i, j), max(i, j))
        if key not in cache:
            (x1, y1), (x2, y2) = segs[i]; (x3, y3), (x4, y4) = segs[j]
            d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
            r = None
            if d:
                t = F((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4), d)
                u = F((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2), d)
                if 0 <= t <= 1 and 0 <= u <= 1:
                    r = (x1 + t * (x2 - x1), y1 + t * (y2 - y1))
            cache[key] = r
        return cache[key]
    d2 = lambda p, q: (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2
    best = 0
    combos = [tuple(segs.index(c) for c in fixed)] if fixed else itertools.combinations(range(4, len(segs)), 3)
    for combo in combos:
        ids = [0, 1, 2, 3] + list(combo); c = 0
        for a, b, e in itertools.combinations(ids, 3):
            p, q, r = meet(a, b), meet(b, e), meet(a, e)
            if p is None or q is None or r is None:
                continue
            if (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]) == 0:
                continue
            x, y, z = d2(p, q), d2(q, r), d2(p, r)
            if x == y or y == z or x == z:
                c += 1
        best = max(best, c)
    return best


for W, H in ((4, 2), (6, 3), (5, 2)):  # the source's starting picture (two diagonals) gives 4
    check(iso_max(W, H, [((0, 0), (W, H)), ((W, 0), (0, H))]) == 4, 'two diagonals give four')


OUT['4-2-u2-t3-7'] = [f'{iso_max(4, 2)}개', f'{iso_max(6, 3)}개', f'{iso_max(5, 2)}개']


# 10. 5-2-u1-e2-example-2-4: digits nonzero, a>b>c, sum S, rounding to tenths gives w.r
def digits(w, r, S, allow_zero=False):
    lo = 0 if allow_zero else 1
    sols = []
    for a, b, c in itertools.product(range(lo, 10), repeat=3):
        if a > b > c and a + b + c == S:
            x = F(w) + F(100 * a + 10 * b + c, 1000)
            rounded = math.floor(x * 10 + F(1, 2)) / F(10)
            if rounded == F(10 * w + r, 10):
                sols.append((a, b, c))
    return sols


R10 = []
for w, r, S in ((2, 5, 8), (3, 6, 10), (4, 7, 11)):
    s = digits(w, r, S)
    check(len({b for _, b, _ in s}) == 1, 'unique second digit')
    check(len({b for _, b, _ in digits(w, r, S, True)}) > 1, 'zero allowed is ambiguous (as in the source)')
    R10.append(str(s[0][1]))
OUT['5-2-u1-e2-example-2-4'] = R10

print('AUDIT ' + json.dumps(OUT, ensure_ascii=False))
