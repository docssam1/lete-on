# 6-last 묶음 독립 검산 (표준 라이브러리만 사용, python3 -I)
import json
from fractions import Fraction as F
from math import gcd

out = {}

# 6-2-u2-e5-mission-5: 양초 [처음 길이, 10분마다 타는 길이, 남은 길이]
res = []
for L, r, R in [("21.7", "0.24", "9.7"), ("25.3", "0.18", "7.3"), ("19.6", "0.32", "6.8")]:
    L, r, R = F(L), F(r), F(R)
    # 10분 단위로 하나씩 늘려 가며 남은 길이가 정확히 R이 되는 때를 찾는다 (유일성 확인)
    hits = [t for t in range(0, 2000) if L - r * t == R]
    assert len(hits) == 1, hits
    k = hits[0]
    assert (L - R) / r == k
    m = 10 * k
    res.append(f"{m // 60}시간 {m % 60}분")
out["6-2-u2-e5-mission-5"] = res

# 6-2-u3-e4-mission-3-2: n×n×n 정육면체, A(뒤 위 오른쪽), B(앞 위 왼쪽), C(앞 아래 오른쪽)를 지나는 평면
def cut_count(n):
    A, B, C = (n, n, n), (0, 0, n), (n, 0, 0)  # (x 왼→오, y 앞→뒤, z 아래→위)
    u = [A[i] - B[i] for i in range(3)]
    v = [C[i] - B[i] for i in range(3)]
    nv = (u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0])
    k0 = sum(nv[i] * B[i] for i in range(3))
    for P in (A, B, C):
        assert sum(nv[i] * P[i] for i in range(3)) == k0
    total = 0
    layers = {}
    touch = 0
    for x in range(n):
        for y in range(n):
            for z in range(n):
                vals = [sum(nv[i] * p[i] for i in range(3)) - k0
                        for p in [(x + a, y + b, z + c) for a in (0, 1) for b in (0, 1) for c in (0, 1)]]
                if min(vals) < 0 < max(vals):
                    total += 1
                    layers[z + 1] = layers.get(z + 1, 0) + 1
                elif min(vals) <= 0 <= max(vals):
                    touch += 1
    # 층별 개수: 위에서 k번째 층 = (n-k+1)+(n-k)
    for k in range(1, n + 1):
        assert layers.get(n - k + 1, 0) == (n - k + 1) + (n - k)
    assert total == n * n
    return total

out["6-2-u3-e4-mission-3-2"] = [f"{cut_count(n)}개" for n in (4, 5, 6)]

# 6-1-u4-e1-example-1-1: ㉮/㉯ = r1, ㉯/㉰ = r2 → ㉰에 대한 ㉮의 비율 = r1 × r2
res = []
for r1, r2 in [("2.5", "0.88"), ("1.6", "0.45"), ("3.5", "0.36")]:
    a = F(r1) * F(r2)
    # 작은 자연수 ㉮, ㉯, ㉰를 모두 찾아 비율이 하나뿐인지 확인
    vals = set()
    for b in range(1, 101):
        ga, gc = F(r1) * b, b / F(r2)
        if ga.denominator == 1 and gc.denominator == 1:
            vals.add(ga / gc)
    assert vals == {a}, vals
    # 최소공배수로 이어 붙이는 풀이와 일치
    f1, f2 = F(r1), F(r2)
    L = f1.denominator * f2.numerator // gcd(f1.denominator, f2.numerator)
    p, r = f1.numerator * L // f1.denominator, f2.denominator * L // f2.numerator
    assert F(p, r) == a
    res.append(f"{a.numerator}/{a.denominator}")
out["6-1-u4-e1-example-1-1"] = res

print("AUDIT " + json.dumps(out, ensure_ascii=False))
