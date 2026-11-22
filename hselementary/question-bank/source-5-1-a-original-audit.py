# 5-1-a 독립 감사: 각 변형의 답을 변형 수치에서 전수 탐색·직접 계산으로 다시 구하고 유일성을 확인합니다.
import json
from fractions import Fraction as F
from itertools import combinations
from math import gcd

def lcm(a, b): return a // gcd(a, b) * b
OUT = {}

# 1단원 Mission 3: 처음 돈 X (반으로 산 물건 + 음료수 + 남은 돈 = X/2)
def a_u1(sk, nb, nc, dr, left):
    sols = [X for X in range(2, 100001, 2) if X // 2 - sk - nb * nc - dr == left]
    assert len(sols) == 1
    X = sols[0]
    return f"식: ({left} + {dr} + {sk} + {nb} × {nc}) × 2 = {X}, 답: {X}원"
OUT['5-1-u1-t2-8'] = [a_u1(1000, 500, 4, 600, 3400), a_u1(1200, 400, 5, 700, 2100), a_u1(1500, 600, 3, 800, 2400)]

# 2단원 예제 5-4: 가능한 최소공배수 중 최솟값 (전수 탐색)
def a_e54(pq, qr, pr):
    N = 1200
    As = [a for a in range(1, N) if a % pq == 0 and a % pr == 0]
    Bs = [b for b in range(1, N) if b % pq == 0 and b % qr == 0]
    Cs = [c for c in range(1, N) if c % qr == 0 and c % pr == 0]
    best = None
    for a in As:
        for b in Bs:
            if gcd(a, b) != pq: continue
            for c in Cs:
                if gcd(b, c) == qr and gcd(a, c) == pr:
                    L = lcm(lcm(a, b), c)
                    best = L if best is None else min(best, L)
    return str(best)
OUT['5-1-u2-t5-6'] = [a_e54(18, 12, 30), a_e54(10, 15, 35), a_e54(20, 12, 28)]

# 2단원 Mission 6: 세 수 q*k, 최소공배수 = k*k
def a_m6(q):
    ks = [k for k in range(1, 5000) if lcm(lcm(q[0] * k, q[1] * k), q[2] * k) == k * k]
    assert len(ks) == 1
    return ', '.join(str(x * ks[0]) for x in q)
OUT['5-1-u2-t5-14'] = [a_m6([2, 3, 5]), a_m6([2, 3, 7]), a_m6([3, 4, 5])]

# 2단원 예제 7-1: 남는 개수 조건을 만족하는 학생 수 전부
def a_e71(it):
    ns = [n for n in range(1, 300) if all(N % n == r for N, r in it)]
    assert len(ns) >= 1
    return ', '.join(f"{n}명" for n in ns)
OUT['5-1-u2-t7-2'] = [a_e71([(60, 4), (131, 5), (100, 2)]), a_e71([(51, 3), (86, 6), (113, 1)]), a_e71([(58, 4), (97, 7), (128, 2)])]

# 2단원 Mission 3: 남음/부족 (개수 < 학생 수)
def a_m3(it):
    def ok(n):
        for N, kind, r in it:
            if r >= n: return False
            if kind == '남음' and N % n != r: return False
            if kind == '부족' and (N + r) % n != 0: return False
        return True
    ns = [n for n in range(1, 500) if ok(n)]
    assert len(ns) == 1
    return f"{ns[0]}명"
OUT['5-1-u2-t7-8'] = [a_m3([(28, '부족', 2), (48, '남음', 3), (69, '부족', 6)]),
                      a_m3([(37, '부족', 5), (58, '남음', 2), (76, '부족', 8)]),
                      a_m3([(38, '부족', 4), (68, '남음', 5), (75, '부족', 9)])]

# 2단원 개념탐구 8 Mission 6
def a_e8(P, g, L):
    sols = []
    for B in range(1, L + 1):
        for C in range(1, L + 1):
            if gcd(B, C) == g and lcm(B, C) == L and P % B == 0:
                sols.append((P // B, B, C))
    sols.sort()
    return "(㉮, ㉯, ㉰) = " + ', '.join(f"({a}, {b}, {c})" for a, b, c in sols)
OUT['5-1-u2-t8-11'] = [a_e8(210, 10, 150), a_e8(60, 4, 84), a_e8(126, 6, 210)]

# 3단원 기호 암호: 약속 그림의 칸 테두리 모양이 서로 다른지 확인하고 식을 계산
def evaluate(expr):
    toks = list(expr.replace(' ', ''))
    pos = [0]
    def peek(): return toks[pos[0]] if pos[0] < len(toks) else None
    def eat(): pos[0] += 1; return toks[pos[0] - 1]
    def factor():
        t = eat()
        if t == '(':
            v = addsub(); assert eat() == ')'; return v
        return F(int(t))
    def muldiv():
        v = factor()
        while peek() in ('×', '÷'):
            op = eat(); w = factor(); v = v * w if op == '×' else v / w
        return v
    def addsub():
        v = muldiv()
        while peek() in ('+', '−'):
            op = eat(); w = muldiv(); v = v + w if op == '+' else v - w
        return v
    v = addsub(); assert pos[0] == len(toks) and v.denominator == 1
    return str(v.numerator)
# 기호 모양 구분: 숫자 칸 9개는 열린 변의 방향·삼각형 여부로 서로 다르고, 계산 기호는 두 반직선의 방향으로 서로 다름
def check_distinct():
    A_digits = {1: 'RB+D', 2: 'LRB', 3: 'LB+D', 4: 'TRB', 5: 'LRTB', 6: 'LTB', 7: 'TR+D', 8: 'LRT', 9: 'LT+D'}
    A_ops = {'+': (180, 120), '(': (0, 60), ')': (60, 120), '×': (240, 300), '−': (180, 240), '÷': (0, 300)}
    assert len(set(A_digits.values())) == 9 and len(set(A_ops.values())) == 6
    B_digits = {1: 'RB', 2: 'LRB', 3: 'LB', 4: 'TRB', 5: 'LRTB', 6: 'LTB', 7: 'TR', 8: 'LRT', 9: 'LT'}
    B_ops = {'+': 'RB+D', '−': 'LB+D', '×': 'TR+D', '÷': 'LT+D'}
    assert len(set(B_digits.values()) | set(B_ops.values())) == 13
check_distinct()
OUT['5-1-u3-t1-4'] = [evaluate('1+(7+2)×3−(6+4)÷5'), evaluate('9+(4+3)×8−(1+7)÷2'), evaluate('2+(5+1)×6−(8+7)÷3')]
OUT['5-1-u3-t1-8'] = [evaluate('3+4+5−8'), evaluate('9−2+6×3'), evaluate('7×8÷4−1')]

# 3단원 예제 1-4: 모스부호 (소리 문자열을 만들고 다시 읽어 숫자로)
MORSE = {0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.'}
def sound(d): return ''.join('뚜' if c == '.' else '뚜~~' for c in MORSE[d])
def decode(s):
    code = ''; i = 0
    while i < len(s):
        assert s[i] == '뚜'
        if s[i + 1:i + 3] == '~~': code += '-'; i += 3
        else: code += '.'; i += 1
    assert len(code) % 5 == 0
    inv = {v: k for k, v in MORSE.items()}
    return int(''.join(str(inv[code[j:j + 5]]) for j in range(0, len(code), 5)))
OUT['5-1-u3-t1-5'] = [f"{decode(sound(m))}월 {decode(sound(d))}일" for m, d in [(3, 5), (7, 8), (4, 9)]]

# 3단원 Mission 6: 예시에서 세로줄 한 칸의 값을 전수 탐색
EX6 = [(1, [1, 0, 0, 0]), (2, [2, 0, 0, 0]), (5, [0, 1, 0, 0]), (10, [0, 2, 0, 0]), (31, [1, 1, 1, 0]), (51, [1, 0, 2, 0])]
def a_grid(h):
    sols = [(a, b, c) for a in range(1, 60) for b in range(1, 60) for c in range(1, 60)
            if all(x[0] * a + x[1] * b + x[2] * c == n for n, x in EX6)]
    assert len(sols) == 1 and h[3] == 0
    a, b, c = sols[0]
    return str(h[0] * a + h[1] * b + h[2] * c)
OUT['5-1-u3-t1-11'] = [a_grid([3, 1, 3, 0]), a_grid([2, 3, 1, 0]), a_grid([1, 4, 2, 0])]

# 3단원 개념탐구 2: 그림의 연결(1~4) → 계차가 1씩 커지는 규칙으로 연장
def a_x2(c, ask):
    data = [k * (k + 1) // 2 + c for k in range(1, 5)]  # 그림에 그린 연결
    d1 = [data[i + 1] - data[i] for i in range(3)]; d2 = [d1[i + 1] - d1[i] for i in range(2)]
    assert d2 == [1, 1]
    seq = data[:]; step = d1[-1]
    while len(seq) < max(7, ask): step += 1; seq.append(seq[-1] + step)
    for k in range(1, len(seq) + 1): assert seq[k - 1] == k * (k + 1) // 2 + c
    return f"(1) {', '.join(map(str, seq[:7]))} (2) △ = □ × (□ + 1) ÷ 2 + {c} (3) {seq[ask - 1]}"
OUT['5-1-u3-t2'] = [a_x2(1, 12), a_x2(3, 10), a_x2(2, 14)]

# 3단원 개념탐구 2 Mission 5
def a_rope(s, d):
    v = [s]
    for _ in range(4): v.append(v[-1] + d)
    c0 = v[0] - d
    assert all(v[k - 1] == k * d + c0 for k in range(1, 6))
    return f"(1) {', '.join(map(str, v[1:]))} (2) △ = □ × {d} + {c0}"
OUT['5-1-u3-t2-9'] = [a_rope(200, 10), a_rope(150, 15), a_rope(120, 20)]

# 삼각형 전수 세기 (선분 위 점 세 개가 서로 그려진 선분으로 이어지면 삼각형)
def onseg(p, s):
    (x1, y1), (x2, y2) = s; x, y = p
    if (x2 - x1) * (y - y1) - (y2 - y1) * (x - x1) != 0: return False
    return min(x1, x2) <= x <= max(x1, x2) and min(y1, y2) <= y <= max(y1, y2)
def inter(s, t):
    (x1, y1), (x2, y2) = s; (x3, y3), (x4, y4) = t
    d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if d == 0: return None
    a = x1 * y2 - y1 * x2; b = x3 * y4 - y3 * x4
    p = (F(a * (x3 - x4) - (x1 - x2) * b, d), F(a * (y3 - y4) - (y1 - y2) * b, d))
    return p if onseg(p, s) and onseg(p, t) else None
def count_tri(segs):
    segs = [((F(a), F(b)), (F(c), F(d))) for (a, b), (c, d) in segs]
    pts = set()
    for s in segs: pts.add(s[0]); pts.add(s[1])
    for s, t in combinations(segs, 2):
        p = inter(s, t)
        if p: pts.add(p)
    pts = list(pts)
    conn = lambda p, q: any(onseg(p, s) and onseg(q, s) for s in segs)
    n = 0
    for a, b, c in combinations(pts, 3):
        if (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) == 0: continue
        if conn(a, b) and conn(b, c) and conn(a, c): n += 1
    return n
def nest(n):
    s = [((0, 0), (16, 0)), ((16, 0), (16, 16)), ((16, 16), (0, 16)), ((0, 16), (0, 0))]
    sq = [(F(0), F(0)), (F(16), F(0)), (F(16), F(16)), (F(0), F(16))]
    for _ in range(n):
        sq = [((sq[i][0] + sq[(i + 1) % 4][0]) / 2, (sq[i][1] + sq[(i + 1) % 4][1]) / 2) for i in range(4)]
        s += [(sq[i], sq[(i + 1) % 4]) for i in range(4)]
    return s
NEST = [count_tri(nest(n)) for n in range(1, 5)]
assert NEST == [4 * n for n in range(1, 5)]
OUT['5-1-u3-t3-2'] = [f"△ = □ × 4, {4 * a}" for a in (6, 9, 13)]

def zig(n):
    s = [((0, 0), (n, 0)), ((0, 1), (n, 1)), ((0, 2), (n, 2))] + [((i, 0), (i, 2)) for i in range(n + 1)]
    for i in range(n):
        s.append(((i, 2 if i % 2 == 0 else 0), (i + 1, 0 if i % 2 == 0 else 2)))
    return s
ZIG = [count_tri(zig(n)) for n in range(1, 6)]
assert ZIG == [6 * n - 2 for n in range(1, 6)]
OUT['5-1-u3-t3-9'] = [f"△ = □ × 6 − 2, {6 * a - 2}개" for a in (8, 11, 15)]

# 3단원 예제 3-2: 바둑돌 배열을 만들어 세기
def stones(n):
    N = n + 2; b = w = 0
    for r in range(N):
        for q in range(N):
            if (r == 0 and q == 0) or (r > 0 and q in (r - 1, r)): b += 1
            else: w += 1
    return b, w
for n in range(2, 20):
    b, w = stones(n); assert w > b and w - b == n * n - 2
assert stones(1)[1] < stones(1)[0]
OUT['5-1-u3-t3-3'] = [f"△ = □ × □ − 2, {stones(a)[1] - stones(a)[0]}개" for a in (10, 12, 15)]

# 3단원 예제 3-3: 그림 순서대로 붙이며 누름못(종이 모서리 점)을 센다
def pins_for(prod):
    r, c = 1, 1; found = []
    for _ in range(80):
        corners = set()
        for i in range(r):
            for j in range(c):
                corners |= {(i, j), (i + 1, j), (i, j + 1), (i + 1, j + 1)}
        assert len(corners) == (r + 1) * (c + 1)
        if r * c == prod: found.append(len(corners))
        if r == c: c += 1
        else: r += 1
    assert len(found) == 1
    return found[0]
OUT['5-1-u3-t3-4'] = [f"△ = (□ + 1) × (○ + 1), {pins_for(p)}개" for p in (90, 56, 132)]

# 3단원 Mission 6: 타일 배열을 만들어 흰색·검은색 세기
def tiles(s, per):
    assert per % (4 * s) == 0
    n = per // (4 * s); W = B = 0
    for r in range(n):
        for q in range(n):
            k = n - min(r, q)
            if k % 2: W += 1
            else: B += 1
    return f"{abs(W - B)}개"
OUT['5-1-u3-t3-10'] = [tiles(3, 204), tiles(3, 240), tiles(4, 368)]

# 4단원 Mission 6: 전수 탐색
def a_u4(a, b, c, d):
    best = None
    for k in range(1, 300):
        for x in range(10, 100):
            num, den = a * k - x, b * k - x
            if num > 0 and den > 0 and F(num, den) == F(c, d):
                best = x if best is None else min(best, x)
    return str(best)
OUT['5-1-u4-t1-11'] = [a_u4(4, 7, 1, 4), a_u4(9, 11, 1, 3), a_u4(8, 9, 1, 2)]

# 5단원: 서로 다른 세 단위분수 표현 전수 열거, 가장 큰 분모가 가장 작은 것 (유일)
def reps(q):
    out = []; a = 1
    while F(3, a) >= q:
        if F(1, a) < q:
            r1 = q - F(1, a); b = a + 1
            while F(2, b) >= r1:
                if F(1, b) < r1:
                    r2 = r1 - F(1, b)
                    if r2.numerator == 1 and r2.denominator > b: out.append((a, b, r2.denominator))
                b += 1
        a += 1
    return out
def a_uf(n, d):
    R = reps(F(n, d)); m = min(r[2] for r in R); best = [r for r in R if r[2] == m]
    assert len(best) == 1
    return ' + '.join(f"1/{x}" for x in best[0])
OUT['5-1-u5-t4'] = [a_uf(3, 7), a_uf(4, 7), a_uf(5, 11)]
OUT['5-1-u5-t4-11'] = [a_uf(7, 9), a_uf(7, 11), a_uf(11, 15)]

print('AUDIT ' + json.dumps(OUT, ensure_ascii=False))
