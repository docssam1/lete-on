# 6-2 4단원 개념탐구 4(연비) 원문 구조 유형 독립 검산: 각 변형의 조건을 직접 대입하는 완전 탐색으로 답과 유일성을 확인합니다.
import json
from fractions import Fraction as F
from math import gcd
from functools import reduce

def lcm(a, b): return a // gcd(a, b) * b
def lcmA(xs): return reduce(lcm, xs)
def prim(t): k = reduce(gcd, t); return tuple(x // k for x in t)
def rstr(t): return ' : '.join(map(str, t))
def mixed(w, n, d): return F(w) + F(n, d)

def ratio_family(sols):
    # 모든 해가 하나의 가장 간단한 비의 배수인지 확인하고 그 비를 돌려줌
    assert sols, 'no solution'
    ps = {prim(t) for t in sols}
    assert len(ps) == 1, ps
    return ps.pop()

OUT = {}

# 개념탐구: ㉮:㉯ = a : b, ㉰:㉮ = c : e, lcm(㉮,㉯,㉰) = L → 합
def expl(a, b, c, e, L):
    sols = []
    for ga in range(1, L + 1):
        na = F(ga) * b / a
        da = F(ga) * c / e
        if na.denominator != 1 or da.denominator != 1: continue
        t = (ga, int(na), int(da))
        if lcmA(t) == L: sols.append(t)
    assert len(sols) == 1, sols
    return str(sum(sols[0]))
OUT['6-2-u4-e4-exploration'] = [expl(F(7), F(3, 5), F('0.9'), F(1, 2), 1260),
                                expl(F(5), F(2, 3), F('0.6'), F(1, 4), 540),
                                expl(F(3), F(4, 5), F('0.7'), F(1, 2), 1680)]

# 예제 4-1: 1/㉠ : 1/㉢ = a : b, ㉠/c : ㉡ = u : v
def ex1(a, b, c, u, v):
    sols = [(x, y, z) for x in range(1, 61) for y in range(1, 61) if F(x, c) / y == u / v
            for z in range(1, 61) if F(1, x) / F(1, z) == F(a, b)]
    return rstr(ratio_family(sols))
OUT['6-2-u4-e4-example-1'] = [ex1(2, 3, 3, mixed(3, 1, 5), mixed(7, 1, 5)),
                              ex1(3, 5, 4, mixed(2, 1, 3), mixed(4, 2, 3)),
                              ex1(4, 5, 3, mixed(1, 2, 7), mixed(2, 4, 7))]

# 예제 4-2: 들이 A, B, C. 물 = A*f1, B*f2, 비 w1:w2, 합 = C*f3
def ex2(f1, f2, w1, w2, f3):
    sols = [(x, y, z) for x in range(1, 80) for y in range(1, 80) if (x * f1) / (y * f2) == F(w1, w2)
            for z in range(1, 80) if x * f1 + y * f2 == z * f3]
    return rstr(ratio_family(sols))
OUT['6-2-u4-e4-example-2'] = [ex2(F(1, 2), F(3, 5), 5, 4, F(3, 4)),
                              ex2(F(2, 3), F(3, 4), 4, 3, F(5, 6)),
                              ex2(F(1, 4), F(3, 5), 3, 4, F(7, 10))]

# 예제 4-3: 톱니 수 t1:t2 = a, t2:t3 = b. 페달 1회전에 체인이 N톱니 이동 → 뒷바퀴 N/t 회전, 거리 ∝ 1/t
def ex3(a, b, D):
    ans = set()
    for t1 in range(1, 100):
        for t2 in range(1, 100):
            if F(t1, t2) != a: continue
            for t3 in range(1, 100):
                if F(t2, t3) == b:
                    N = lcmA([t1, t3]) * 7  # 임의의 체인 이동 톱니 수
                    per_turn_1 = F(N, t1); per_turn_3 = F(N, t3)
                    ans.add(D * per_turn_3 / per_turn_1)
    assert len(ans) == 1, ans
    v = ans.pop(); assert v.denominator == 1
    return f'{v} m'
OUT['6-2-u4-e4-example-3'] = [ex3(F(3, 2), F(5, 4), 200), ex3(F(5, 4), F(6, 5), 240), ex3(F(4, 3), F(6, 5), 250)]

# 예제 4-4: 가:나 = 1/p : 1/q, 가:다 = 1/r : 1/s, 라 = 다 + d, 합 T
def ex4(T, p, q, r, s, d):
    sols = []
    for ga in range(1, T + 1):
        for na in range(1, T + 1 - ga):
            if F(ga, na) != F(1, p) / F(1, q): continue
            for da in range(1, T + 1 - ga - na):
                if F(ga, da) != F(1, r) / F(1, s): continue
                ra = da + d
                if ga + na + da + ra == T: sols.append(ra)
    assert len(sols) == 1, sols
    return f'{sols[0]}명'
OUT['6-2-u4-e4-example-4'] = [ex4(313, 3, 4, 2, 5, 7), ex4(196, 2, 3, 3, 4, 6), ex4(201, 4, 5, 3, 2, 9)]

# Mission 1: 가÷a = 나÷b, 가÷c = 다÷d
def m1(a, b, c, d):
    sols = [(x, y, z) for x in range(1, 121) for y in range(1, 121) if F(x) / a == F(y) / b
            for z in range(1, 121) if F(x) / c == F(z) / d]
    return rstr(ratio_family(sols))
OUT['6-2-u4-e4-mission-1'] = [m1(F(3), mixed(2, 1, 4), F(6), F('2.5')),
                              m1(F(4), mixed(1, 1, 3), F(5), F('1.5')),
                              m1(F(2), mixed(3, 1, 2), F(8), F('3.6'))]

# Mission 2: 재:태 = a, 태:지 = b, 재 - 지 = n → 합
def m2(a, b, n):
    sols = []
    for z in range(1, 400):
        for t in range(1, 400):
            if F(t, z) != b: continue
            j = F(t) * a
            if j.denominator == 1 and j - z == n: sols.append(int(j) + t + z)
    assert len(sols) == 1, sols
    return f'{sols[0]}개'
OUT['6-2-u4-e4-mission-2'] = [m2(F(3, 5), F(2, 1), 6), m2(F(4, 3), F(5, 2), 28), m2(F(2, 3), F(4, 1), 20)]

# Mission 3: 공통 부분 = A*f1 = B*f2 = C*f3
def m3(f1, f2, f3):
    sols = []
    for x in range(1, 401):
        c = x * f1
        y = c / f2; z = c / f3
        if y.denominator == 1 and z.denominator == 1: sols.append((x, int(y), int(z)))
    return rstr(ratio_family(sols))
OUT['6-2-u4-e4-mission-3'] = [m3(F(3, 10), F(5, 8), F(4, 5)), m3(F(2, 7), F(4, 9), F(2, 3)), m3(F(3, 8), F(3, 5), F(6, 7))]

# Mission 4: 둘레 가:다 = a, 나:다 = b; 맞닿아 돌면 (둘레)×(회전수)가 같음 → 회전수 비
def m4(a, b):
    circ = [(x, y, z) for z in range(1, 201) for x in range(1, 201) if F(x, z) == a
            for y in range(1, 201) if F(y, z) == b]
    c = ratio_family(circ)
    rot = []
    for p in range(1, 2001):
        s = p * c[0]
        if s % c[1] == 0 and s % c[2] == 0: rot.append((p, s // c[1], s // c[2]))
    return rstr(ratio_family(rot))
OUT['6-2-u4-e4-mission-4'] = [m4(F(15, 16), F(25, 18)), m4(F(4, 5), F(3, 2)), m4(F(9, 10), F(6, 5))]

# Mission 5: ㉮:㉯ = 1/p : 1/q, ㉯:㉰ = 1 : e, (㉮+㉰) - (㉮+㉯) = n
def m5(p, q, e, n):
    sols = []
    for x in range(1, 400):
        for y in range(1, 400):
            if F(x, y) != F(1, p) / F(1, q): continue
            z = y * e
            if z.denominator == 1 and (x + z) - (x + y) == n: sols.append((x, y, int(z)))
    assert len(sols) == 1, sols
    x, y, z = sols[0]
    return f'㉮ {x} mL, ㉯ {y} mL, ㉰ {z} mL'
OUT['6-2-u4-e4-mission-5'] = [m5(3, 4, F('2.5'), 45), m5(2, 5, F('3.5'), 40), m5(4, 6, F('2.5'), 36)]

# Mission 6: 배 = 사과×pct%, 감 = 배×k, 포도 = 감 - d, 합 T
def m6(T, pct, k, d):
    sols = []
    for s in range(1, T + 1):
        b = F(s * pct, 100)
        g = b * k
        if b.denominator != 1 or g.denominator != 1: continue
        p = g - d
        if p >= 1 and s + b + g + p == T: sols.append(s)
    assert len(sols) == 1, sols
    return f'{sols[0]}그루'
OUT['6-2-u4-e4-mission-6'] = [m6(520, 50, mixed(4, 1, 2), 56), m6(300, 75, mixed(2, 2, 3), 45), m6(360, 40, mixed(3, 1, 2), 60)]

print('AUDIT ' + json.dumps(OUT, ensure_ascii=False))
