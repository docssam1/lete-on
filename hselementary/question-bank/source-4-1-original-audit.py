# 4-1 실력 잠금 원문 유형 독립 검산 (표준 라이브러리만 사용). 실행: python3 -I source-4-1-original-audit.py
import json, math, os, re, sys
from itertools import permutations

HERE = os.path.dirname(os.path.abspath(__file__))
PLUGIN = open(os.path.join(HERE, 'source-4-1-original.js'), encoding='utf-8').read()
OUT = {}
FAIL = []


def need(cond, msg):
    if not cond:
        FAIL.append(msg)


def uniq(cands, msg):
    need(len(cands) == 1, f'{msg}: 후보 {cands}')
    return cands[0]

# 1. 겹친 삼각자: 실제 좌표로 교점의 각을 잰다.
def setsquare(a):
    BR = (1.0, 0.0); T = (0.0, math.sqrt(3))
    L = (1 - 1.21 * math.cos(math.radians(a)), 1.21 * math.sin(math.radians(a)))
    R = (1 + 1.21 * math.cos(math.radians(90 - a)), 1.21 * math.sin(math.radians(90 - a)))
    # 45° 삼각자 확인
    need(abs(math.dist(BR, L) - math.dist(BR, R)) < 1e-9, '45 삼각자 다리')
    x1, y1 = T; x2, y2 = BR; x3, y3 = L; x4, y4 = R
    d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d
    s = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / d
    need(0 < t < 1 and 0 < s < 1, '빗변 교점이 두 선분 위에 있음')
    P = (x1 + t * (x2 - x1), y1 + t * (y2 - y1))
    v1 = (R[0] - P[0], R[1] - P[1]); v2 = (BR[0] - P[0], BR[1] - P[1])
    g = math.degrees(math.acos((v1[0] * v2[0] + v1[1] * v2[1]) / math.hypot(*v1) / math.hypot(*v2)))
    need(abs(g - round(g)) < 1e-6, '각이 자연수')
    return round(g)


OUT['4-1-u2-t5-2'] = [f'{setsquare(a)}°' for a in (30, 20, 40)]

# 2. 시계: 30분인 모든 시각을 조사
def clock(lo, hi, angle):
    c = []
    for h in range(1, 13):
        m = 30
        hour = (h % 12) * 30 + m * 0.5; minute = m * 6
        d = abs(hour - minute); d = min(d, 360 - d)
        pos = (hour / 30) or 12  # 짧은바늘이 가리키는 위치(숫자 단위)
        between = (lo < pos < hi) if lo < hi else False
        if between and d == angle:
            c.append(f'{h}시 30분')
    return uniq(c, f'시계 {lo}-{hi} {angle}')


OUT['4-1-u2-t6-5'] = [clock(1, 6, 105), clock(1, 6, 75), clock(7, 12, 105)]

# 3. 몫과 나머지의 합이 가장 큰 세 자리 수
def qr(d):
    best = max((n // d + n % d) for n in range(100, 1000))
    return uniq([str(n) for n in range(100, 1000) if n // d + n % d == best], f'몫+나머지 {d}')


OUT['4-1-u3-t5-3'] = [qr(24), qr(32), qr(27)]

# 4. 뒤집기 전 도형을 돌리기: 꼭짓점 좌표 변환을 다시 계산하고 플러그인 정답 그림과 대조
n = 5
ud = lambda p: (p[0], n - p[1]); lr = lambda p: (n - p[0], p[1])
def rot_cw(p, times):
    for _ in range(times % 4):
        p = (n - p[1], p[0])
    return p
shapes = [
    [(1, 0), (3, 0), (3, 2), (5, 2), (4, 5), (3, 5), (3, 4), (0, 4), (0, 3), (1, 3)],
    [(0, 0), (2, 0), (2, 1), (4, 1), (4, 3), (5, 5), (3, 5), (3, 3), (1, 3), (1, 2), (0, 2)],
    [(2, 0), (4, 0), (4, 1), (5, 1), (5, 3), (3, 3), (3, 5), (2, 5), (2, 4), (0, 4), (1, 2), (2, 2)],
]
plan = [(ud, 3, '시계 방향으로 90°'),  # 시계 반대 방향 270° = 시계 방향 90° 1번 = 시계 반대 방향 90° 3번
        (lr, 1, '시계 방향으로 90°'),
        (ud, 3, '시계 반대 방향으로 90°')]
# plan의 정수: 시계 반대 방향 90°를 몇 번 하는지
def rot_ccw(p, times):
    for _ in range(times % 4):
        p = (p[1], n - p[0])
    return p
ccw_times = [3, 3, 1]  # 270° 반대 = 3번, 시계 90° = 반대 3번, 반대 90° = 1번
polys = re.findall(r'data-answer-poly=\\"([^"\\]+)\\" data-variant=\\"(\d)\\"', PLUGIN)
need(len(polys) == 3, '정답 그림 3개')
ans4 = []
for i, (fl, _, name) in enumerate(plan):
    orig = [fl(p) for p in shapes[i]]
    exp = [rot_ccw(p, ccw_times[i]) for p in orig]
    got = [tuple(map(int, s.split(','))) for s in polys[i][0].split(';')]
    need(got == exp, f'그림 정답 {i}')
    # 시계 방향 90° 한 번과 같은지 문장 확인
    need(([rot_cw(p, 1) for p in orig] == exp) == (name == '시계 방향으로 90°'), f'회전 이름 {i}')
    ans4.append(f'처음 도형을 {name}만큼 돌린 모양(답 그림)')
OUT['4-1-u4-t1-6'] = ans4

# 5. 물 → 180° → 위아래 → 180° → 위아래 … 를 실제로 차례대로 적용
# 상태를 (좌우반전 여부, 상하반전 여부)로 나타낸다. 180° 돌리기 = 좌우·상하 모두 바꿈.
names = {(0, 0): '첫째 칸과 같은 모양(처음 물 모양)', (1, 1): '둘째 칸과 같은 모양(물을 180° 돌린 모양)',
         (1, 0): '셋째 칸과 같은 모양(물을 오른쪽으로 뒤집은 모양)', (0, 1): '넷째 칸과 같은 모양(물을 아래쪽으로 뒤집은 모양)'}
def glyph(k):
    st = (0, 0)
    for i in range(1, k):
        st = (1 - st[0], 1 - st[1]) if i % 2 == 1 else (st[0], 1 - st[1])
    return st
seen = [glyph(k) for k in range(1, 7)]
need(seen == [(0, 0), (1, 1), (1, 0), (0, 1), (0, 0), (1, 1)], '원문 여섯 칸 모양')
OUT['4-1-u4-t2-3'] = [names[glyph(k)] for k in (63, 82, 100)]

# 6. 돌린 모양 세기: 칸을 직접 돌려 비교
G0 = ['DDCUUCLDDDDR', 'CWDDDDCDWCDC', 'CUUCDCDRCRUC', 'DDDDDRDCDDDD',
      'DDLDDRLDWCCD', 'WCCDDCCDDDLD', 'CUUCDCWCUCUC', 'DDDDDRDDDDDD']
def put(g, ch):
    g = [list(r) for r in g]
    for r, c, v in ch:
        g[r][c] = v
    return [''.join(r) for r in g]
G1 = put(G0, [(2, 8, 'D'), (2, 9, 'C'), (3, 8, 'D'), (3, 9, 'R')])
G2 = put(G0, [(1, 8, 'C'), (1, 9, 'W')])
turn = {'U': 'R', 'R': 'W', 'W': 'L', 'L': 'U', 'C': 'C', 'D': 'D'}  # 시계 방향 90°
def cw(block):  # block [[tl,tr],[bl,br]]
    (a, b), (c, d) = block
    return [[turn[c], turn[a]], [turn[d], turn[b]]]
base = [['C', 'U'], ['D', 'D']]
rots = []; b = base
for _ in range(4):
    rots.append(b); b = cw(b)
need(len({str(x) for x in rots}) == 4, '네 방향이 서로 다름')
def count(g):
    k = 0
    for br in range(4):
        for bc in range(6):
            blk = [[g[2 * br][2 * bc], g[2 * br][2 * bc + 1]], [g[2 * br + 1][2 * bc], g[2 * br + 1][2 * bc + 1]]]
            k += blk in rots
    return k
grids = re.findall(r'data-grid=\\"([A-Z/]+)\\"', PLUGIN)
need(grids == ['/'.join(G0), '/'.join(G1), '/'.join(G2)], '무늬 자료 대조')
OUT['4-1-u4-t2-7'] = [f'{count(g)}개' for g in (G0, G1, G2)]

# 7. 수 카드 180° 돌리기: 일곱 조각 숫자를 실제로 돌려서 읽음
SEG = {'0': 'abcdef', '1': 'bc', '2': 'abdeg', '3': 'abcdg', '4': 'bcfg', '5': 'acdfg', '6': 'acdefg', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg'}
R180 = {'a': 'd', 'b': 'e', 'c': 'f', 'd': 'a', 'e': 'b', 'f': 'c', 'g': 'g'}
def turn_digit(dg):
    segs = {R180[s] for s in SEG[dg]}
    if segs == {'e', 'f'}:
        return '1'  # 숫자 1은 돌려도 1로 읽는다
    m = [k for k, v in SEG.items() if set(v) == segs]
    return m[0] if m else None
def turned(num):
    t = [turn_digit(d) for d in reversed(num)]
    return None if None in t else ''.join(t)
def cardmin(cards):
    diffs = []
    for p in permutations(cards, 3):
        if p[0] == '0':
            continue
        a = ''.join(p); b = turned(a)
        if b and int(a) > int(b):
            diffs.append(int(a) - int(b))
    return str(min(diffs))
OUT['4-1-u4-t4'] = [cardmin(c) for c in ('05689', '02568', '02589')]

def cardsub(num, wrong):
    x = int(turned(num)) - wrong
    need(x > 0, '어떤 수 양수')
    return str(int(num) - x)
OUT['4-1-u4-t4-3'] = [cardsub('618', 480), cardsub('685', 300), cardsub('569', 420)]

# 9. 한글 자모: 획을 선분으로 정의하고 대칭 이동 후 같은지 비교 (가로 0~4, 세로 0~4)
def segs(*s):
    return {tuple(sorted(x)) for x in s}
J = {
    'ㄱ': segs(((0, 0), (4, 0)), ((4, 0), (4, 4))),
    'ㄴ': segs(((0, 0), (0, 4)), ((0, 4), (4, 4))),
    'ㄷ': segs(((0, 0), (4, 0)), ((0, 0), (0, 4)), ((0, 4), (4, 4))),
    'ㄹ': segs(((0, 0), (4, 0)), ((4, 0), (4, 2)), ((0, 2), (4, 2)), ((0, 2), (0, 4)), ((0, 4), (4, 4))),
    'ㅁ': segs(((0, 0), (4, 0)), ((0, 0), (0, 4)), ((4, 0), (4, 4)), ((0, 4), (4, 4))),
    'ㅂ': segs(((0, 0), (0, 4)), ((4, 0), (4, 4)), ((0, 2), (4, 2)), ((0, 4), (4, 4))),
    'ㅅ': segs(((2, 0), (0, 4)), ((2, 0), (4, 4))),
    'ㅇ': {('circle',)},
    'ㅈ': segs(((0, 0), (4, 0)), ((2, 0), (0, 4)), ((2, 0), (4, 4))),
    'ㅊ': segs(((2, -1), (2, 0)), ((0, 0), (4, 0)), ((2, 0), (0, 4)), ((2, 0), (4, 4))),
    'ㅋ': segs(((0, 0), (4, 0)), ((4, 0), (4, 4)), ((0, 2), (4, 2))),
    'ㅌ': segs(((0, 0), (4, 0)), ((0, 0), (0, 4)), ((0, 2), (4, 2)), ((0, 4), (4, 4))),
    'ㅍ': segs(((0, 0), (4, 0)), ((1, 0), (1, 4)), ((3, 0), (3, 4)), ((0, 4), (4, 4))),
    'ㅎ': segs(((1, -1), (3, -1)), ((0, 0), (4, 0)), ('o', 'ring')),
    'ㅏ': segs(((2, 0), (2, 4)), ((2, 2), (3, 2))),
    'ㅐ': segs(((1, 0), (1, 4)), ((3, 0), (3, 4)), ((1, 2), (2, 2))),
    'ㅑ': segs(((2, 0), (2, 4)), ((2, 1), (3, 1)), ((2, 3), (3, 3))),
    'ㅓ': segs(((2, 0), (2, 4)), ((1, 2), (2, 2))),
    'ㅔ': segs(((1, 0), (1, 4)), ((3, 0), (3, 4)), ((0, 2), (1, 2))),
    'ㅕ': segs(((2, 0), (2, 4)), ((1, 1), (2, 1)), ((1, 3), (2, 3))),
    'ㅗ': segs(((2, 1), (2, 2)), ((0, 2), (4, 2))),
    'ㅛ': segs(((1, 1), (1, 2)), ((3, 1), (3, 2)), ((0, 2), (4, 2))),
    'ㅜ': segs(((0, 2), (4, 2)), ((2, 2), (2, 3))),
    'ㅠ': segs(((0, 2), (4, 2)), ((1, 2), (1, 3)), ((3, 2), (3, 3))),
    'ㅡ': segs(((0, 2), (4, 2))),
    'ㅣ': segs(((2, 0), (2, 4))),
}
def mirror(shape, axis):
    out = set()
    for s in shape:
        if not isinstance(s[0], tuple):
            out.add(s); continue  # 원(ㅇ, ㅎ의 동그라미)은 가운데에 있어 어느 쪽으로 뒤집어도 같다
        if axis == 'v':
            out.add(tuple(sorted((4 - x, y) for x, y in s)))
        else:
            out.add(tuple(sorted((x, 4 - y) for x, y in s)))
    return out
def hangul(letters, axis):
    return f'{sum(1 for ch in letters if mirror(J[ch], axis) == J[ch])}개'
lists = re.findall(r'data-letters=\\"([^"\\]+)\\" data-direction=\\"([^"\\]+)\\"', PLUGIN)
need([x[0] for x in lists] == ['ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ', 'ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ', 'ㅏㅐㅑㅓㅔㅕㅗㅛㅜㅠㅡㅣ'], '자모 목록 대조')
# ㅎ의 위 짧은 획은 가로로 가운데에 놓인다: 좌우 대칭이지만 위아래 대칭은 아님(목록 v2에는 자음 없음)
OUT['4-1-u4-t4-5'] = [hangul(lists[0][0], 'v'), hangul(lists[1][0], 'v'), hangul(lists[2][0], 'h')]

# 10. 찢어진 막대그래프
def snow(jan_not, more):
    dec_days = 31
    c = [s for s in range(0, 32) if dec_days - s == jan_not + more]
    return f'{uniq(c, "눈")}일'
vals = re.findall(r'data-values=\\"([^"\\]+)\\"', PLUGIN)
need(len(vals) == 3, '그래프 자료 3개')
for v, (jn, mo) in zip(vals, ((15, 4), (17, 3), (13, 5))):
    d = {k: tuple(map(int, x.split(','))) for k, x in (p.split(':') for p in v.split(';'))}
    need(d['1월'][1] == jn and sum(d['1월']) == 31 and sum(d['2월']) == 28 and sum(d['12월']) == 31, '그래프 날수 합')
OUT['4-1-u5-t2-5'] = [snow(15, 4), snow(17, 3), snow(13, 5)]

# 11. 바둑돌 배열을 실제로 만들어 센다
def stones(k):
    pts = set()
    for r in range(2 * k - 1):
        cnt = k if r % 2 == 0 else k - 1
        for j in range(cnt):
            pts.add((2 * j + (r % 2), r))
    return len(pts)
need([stones(k) for k in (1, 2, 3, 4)] == [1, 5, 13, 25], '원문 첫째~넷째')
OUT['4-1-u6-t5-3'] = [f'{stones(k)}개' for k in (10, 12, 15)]

# 12·13. 나선 배열 시뮬레이션
def spiral(N):
    pts = [(0, 0)]; x = y = 0; dirs = [(0, -1), (1, 0), (0, 1), (-1, 0)]; k = 0; L = 1
    while len(pts) < N:
        for _ in range(2):
            dx, dy = dirs[k % 4]
            for _ in range(L):
                if len(pts) >= N:
                    break
                x += dx; y += dy; pts.append((x, y))
            k += 1
        L += 1
    return pts
def squares(N):
    S = set(spiral(N))
    return sum(1 for (x, y) in S if {(x + 1, y), (x, y + 1), (x + 1, y + 1)} <= S)
need(squares(11) == 5, '원문 그림 2의 정사각형 5개')
OUT['4-1-u6-t5-5'] = [f'{squares(N)}개' for N in (105, 69, 150)]
def inverse(t):
    return f'{uniq([N for N in range(1, 400) if squares(N) == t], f"정사각형 {t}")}개'
OUT['4-1-u6-t5-8'] = [inverse(t) for t in (57, 40, 75)]

if FAIL:
    print('FAIL', FAIL)
    sys.exit(1)
print('AUDIT ' + json.dumps(OUT, ensure_ascii=False))
