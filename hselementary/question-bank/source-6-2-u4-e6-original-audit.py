# 6-2 4단원 개념탐구 6 원문 구조 유형 독립 검산 (표준 라이브러리만 사용)
import json
from fractions import Fraction as F
from math import gcd

def m_text(cm):
    v = F(cm, 100)
    s = f"{float(v):.2f}".rstrip('0').rstrip('.')
    assert F(s) == v
    return s

def water_height(above, total_cm):
    # 물 높이 h(cm, 유리수까지 허용)를 0.01 cm 단위로 전수 탐색하여 유일성 확인
    subs = [1 - F(n, d) for n, d in above]
    sols = []
    for h100 in range(1, total_cm * 100 + 1):
        h = F(h100, 100)
        if sum(h / s for s in subs) == total_cm:
            sols.append(h)
    assert len(sols) == 1, sols
    h = sols[0]
    rods = [h / s for s in subs]
    assert len(set(rods)) == len(rods)  # 길이가 서로 다른 막대
    assert all(r > h for r in rods)
    return h

def snack(P, r1, r2):
    # 은정 E, 지연 J를 원 단위로 전수 탐색
    sols = []
    for E in range(P + 1, 20001):
        # (E-P):J = r1  ->  J = (E-P)*r1[1]/r1[0]
        if ((E - P) * r1[1]) % r1[0]:
            continue
        J = (E - P) * r1[1] // r1[0]
        if J > P and E * r2[1] == (J - P) * r2[0]:
            sols.append((E, J))
    assert len(sols) == 1, sols
    E, J = sols[0]
    return E - P

def exploration(above, total_cm, P, r1, r2):
    h = water_height(above, total_cm)
    assert h.denominator == 1
    return f"(1) {h} cm, (2) {snack(P, r1, r2)}원"

def ex1(A, w, n, d, bret):
    B = F(A) * (w + F(n, d))
    sols = [x for x in range(1, 100001) if F(x) * B == F(bret) * A]
    assert len(sols) == 1
    return f"{sols[0]}만 원"

def ex2(r1, r2, T):
    sols = []
    for boys in range(1, T):
        girls = T - boys
        if boys * r2[1] != girls * r2[0]:
            continue
        for left in range(1, 1000):
            if boys * r1[1] == (girls + left) * r1[0]:
                sols.append(left)
    assert len(sols) == 1
    return f"{sols[0]}명"

def ex3(T, a, b, p1, p2):
    sols = [S for S in range(1, T) if F(S * p1, 100) * b == F((T - S) * p2, 100) * a]
    assert len(sols) == 1
    return f"{sols[0]}원"

def ex4(g, A, B, D):
    sols = []
    for X in range(1, 20001):
        if (X * g[1]) % g[0]:
            continue
        Y = X * g[1] // g[0]
        if X % (A[0] + A[1]) or Y % (B[0] + B[1]):
            continue
        aw = X * A[0] // (A[0] + A[1]); bw = Y * B[0] // (B[0] + B[1])
        if (aw + bw) - (X + Y - aw - bw) == D:
            sols.append(X)
    assert len(sols) == 1
    return f"{sols[0]}개"

def mi1(a, b, pr, t):
    bp = F(pr * b, a + b)
    rate = bp / b
    assert F(pr * a, a + b) / a == rate
    sols = [x for x in range(1, 100001) if rate * x == t]
    assert len(sols) == 1
    return f"{sols[0]}만 원"

def mi2(above, total_cm):
    h = water_height(above, total_cm)
    return f"{m_text(h)} m"

def mi3(r1, r2, gain):
    sols = []
    for N in range(1, 5001):
        if N % sum(r1) or N % sum(r2):
            continue
        before = [N * x // sum(r1) for x in r1]
        after = [N * x // sum(r2) for x in r2]
        if after[0] - before[0] == gain:
            sols.append(N)
    assert len(sols) == 1
    return f"{sols[0]}개"

def mi4(r1, r2):
    ratios = set()
    for A in range(1, 301):
        for B in range(1, 301):
            if (B * r1[0]) % r1[1]:
                continue
            P = A - B * r1[0] // r1[1]  # 갑이 산 뒤 남은 돈에서 물건값 결정
            if 0 < P < B:
                if (A - P) * r1[1] == B * r1[0] and A * r2[1] == (B - P) * r2[0]:
                    g = gcd(A, B)
                    ratios.add((A // g, B // g))
    assert len(ratios) == 1, ratios
    A, B = ratios.pop()
    return f"{A}:{B}"

def mi5(fa, fb, w, fc, cd, T):
    sols = []
    for wa100 in range(1, T * 100):  # ㉮ 컵 물의 양(0.01 mL 단위)
        wa = F(wa100, 100)
        wb = wa * w[1] / w[0]
        ca = wa / F(*fa); cb = wb / F(*fb)
        cc = (wa + wb) / F(*fc)
        cdd = cc / F(cd, 10)
        if ca + cb + cc + cdd == T:
            sols.append(cdd)
    assert len(sols) == 1
    assert sols[0].denominator == 1
    return f"{sols[0]} mL"

def mi6(r1, r2, T):
    sols = []
    for k in range(1, T):
        R, Bl, Y = (k * x for x in r1)
        for addB in range(0, T):
            addY = T - R - Bl - Y - addB
            if addY >= 0:
                nb, ny = Bl + addB, Y + addY
                if R * r2[1] == nb * r2[0] and R * r2[2] == ny * r2[0]:
                    sols.append(addB)
    assert len(sols) == 1, sols
    return f"{sols[0]}개"

items = {
 '6-2-u4-e6-exploration': [exploration([(1,4),(1,10),(2,5)],222,680,(2,3),(9,5)),
                           exploration([(1,3),(1,6),(2,5)],262,900,(3,5),(7,5)),
                           exploration([(1,5),(1,4),(1,2)],165,750,(1,2),(4,3))],
 '6-2-u4-e6-example-1': [ex1(3500,1,1,5,4800), ex1(2400,1,1,4,3500), ex1(3600,1,1,3,5600)],
 '6-2-u4-e6-example-2': [ex2((10,7),(5,3),192), ex2((9,8),(3,2),180), ex2((8,7),(4,3),210)],
 '6-2-u4-e6-example-3': [ex3(22800,5,3,15,10), ex3(25000,3,4,10,20), ex3(28000,3,2,25,10)],
 '6-2-u4-e6-example-4': [ex4((15,9),(8,7),(3,2),700), ex4((4,5),(5,3),(3,2),400), ex4((7,5),(4,3),(3,2),600)],
 '6-2-u4-e6-mission-1': [mi1(180,120,80,160), mi1(200,150,70,90), mi1(250,150,120,210)],
 '6-2-u4-e6-mission-2': [mi2([(1,3),(1,4)],340), mi2([(1,2),(1,3)],280), mi2([(1,4),(2,5)],450)],
 '6-2-u4-e6-mission-3': [mi3((4,7,5),(6,7,8),12), mi3((3,5,4),(5,4,6),15), mi3((2,5,3),(3,4,5),12)],
 '6-2-u4-e6-mission-4': [mi4((3,5),(4,3)), mi4((1,2),(5,4)), mi4((2,5),(3,2))],
 '6-2-u4-e6-mission-5': [mi5((1,2),(1,5),(3,4),(1,2),28,360), mi5((1,3),(1,4),(2,3),(1,2),25,480), mi5((1,4),(2,5),(1,2),(1,3),15,600)],
 '6-2-u4-e6-mission-6': [mi6((3,4,6),(6,9,14),145), mi6((2,3,4),(4,7,9),200), mi6((1,2,3),(3,7,10),160)],
}
for k, v in items.items():
    assert len(set(v)) == 3, (k, v)  # 변형끼리 답이 모두 다름
print('AUDIT ' + json.dumps(items, ensure_ascii=False))
