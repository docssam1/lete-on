# 황소 4-2 3단원(소수의 덧셈과 뺄셈) 잠금 원문 유형 독립 검산. python3 -I, 표준 라이브러리만 사용.
# 생성기 코드를 읽지 않고 변형 매개변수에서 답을 다시 구하며, 가능한 곳은 완전 탐색으로 답이 하나뿐인지 확인한다.
import json
from fractions import Fraction as F
from itertools import permutations

def dec(x):
    x = F(x)
    assert x >= 0
    s = str(x.numerator // x.denominator)
    r = x - x.numerator // x.denominator
    if r == 0:
        return s
    digs = ''
    for _ in range(6):
        r *= 10
        digs += str(r.numerator // r.denominator)
        r -= r.numerator // r.denominator
        if r == 0:
            break
    assert r == 0, x
    return s + '.' + digs

D = lambda s: F(s)  # 소수 문자열 -> 분수
out = {}

# t1-8: 복명수 -> 소수
r = []
for kg, g, km, m, h, mi in [(5, 640, 4, 78, 4, 45), (8, 260, 6, 35, 2, 15), (2, 790, 9, 47, 5, 30)]:
    a1 = kg + F(g, 1000); a2 = km + F(m, 1000); a3 = h + F(mi, 60)
    r.append(f'(1) {dec(a1)} (2) {dec(a2)} (3) {dec(a3)}')
out['4-2-u3-t1-8'] = r

# t1-9: 두 수 사이 n등분 눈금 중 가장 작은/큰 수 (두 수 제외)
r = []
for a, b, n in [('32.5', '32.7', 100), ('5.3', '5.7', 100), ('7.4', '7.9', 100)]:
    a, b = D(a), D(b)
    ticks = [a + (b - a) * k / n for k in range(1, n)]
    assert all(a < t < b for t in ticks)
    r.append(f'{dec(min(ticks))}, {dec(max(ticks))}')
out['4-2-u3-t1-9'] = r

# t1-10: 정사각형 굴리기를 좌표로 직접 시뮬레이션 (시계 방향 = 오른쪽으로 구름)
def roll(side, quarter_turns):
    # 꼭짓점 좌표: A(0,0) B(s,0) C(s,s)=㉠ D(0,s)
    pts = {'A': (F(0), F(0)), 'B': (side, F(0)), 'C': (side, side), 'D': (F(0), side)}
    for _ in range(quarter_turns):
        # 회전 중심: 바닥에 닿은 꼭짓점 중 가장 오른쪽
        px = max(x for x, y in pts.values() if y == 0)
        # 시계 방향 90도 회전: (x,y) -> (px + y, -(x - px))
        pts = {k: (px + y, -(x - px)) for k, (x, y) in pts.items()}
        assert all(y >= 0 for x, y in pts.values())
    x, y = pts['C']
    assert y == 0  # ㉠이 수직선 위에 놓인다
    return x
r = []
for u, sideT in [('0.03', 4), ('0.02', 4), ('0.05', 3)]:
    side = D(u) * sideT
    r.append(dec(roll(side, 10)))  # 두 바퀴 반 = 4*2+2
out['4-2-u3-t1-10'] = r

# t1-11: 양초가 다 타는 시간 (분 단위로 한 단계씩 더해 보기)
r = []
for L, t, R in [('24.2', 20, '19.8'), ('18.6', 15, '15.5'), ('30.4', 20, '26.6')]:
    L, R = D(L), D(R)
    per_min = (L - R) / t
    mins = 0; burnt = F(0)
    while burnt < L:
        mins += 1; burnt += per_min
    assert burnt == L
    h, mm = divmod(mins, 60)
    r.append(f'{h}시간 {mm}분' if mm else f'{h}시간')
out['4-2-u3-t1-11'] = r

# t2-7: 200 m 달리기 시간 차
r = []
for a, b in [('16.08', '8.48'), ('15.37', '8.12'), ('17.25', '9.14')]:
    k = D(a) * 200 / 100; y = D(b) * 200 / 50
    assert y > k
    r.append(f'{dec(y - k)}초')
out['4-2-u3-t2-7'] = r

# t2-8: ㉠보다 크고 ㉡보다 작은 소수 한 자리 수(일의 자리 정수 제외) 세기
r = []
for a1, a2, a3, b1, b2, b3 in [('7', '5.6', '1.73', '1.8', '4.75', '2.79'), ('8', '4.7', '0.96', '2.4', '3.85', '1.48'), ('10', '7.2', '2.35', '3.6', '4.92', '2.64')]:
    A = D(a1) - D(a2) + D(a3); B = D(b1) + D(b2) - D(b3)
    cnt = sum(1 for k in range(0, 1000) if k % 10 and A < F(k, 10) < B)
    r.append(f'{cnt}개')
out['4-2-u3-t2-8'] = r

# t2-9: a+b > c-□ 인 가장 작은 소수 두 자리 수 □ (끝자리 0 아닌 수, 완전 탐색)
r = []
for a, b, c in [('9.43', '5.19', '17.66'), ('8.27', '4.56', '15.4'), ('6.38', '7.85', '19.01')]:
    a, b, c = D(a), D(b), D(c)
    best = None
    for k in range(1, 100000):
        x = F(k, 100)
        if k % 10 == 0:
            continue
        if x <= c and a + b > c - x:
            best = x; break
    r.append(dec(best))
out['4-2-u3-t2-9'] = r

# t2-10: 직선 위 위치(민성 기준, m 단위 정수, 뒤쪽은 큰 기준점에서 계산)
r = []
for tm, ma, hm in [(523, 312, 270), (648, 405, 360), (735, 287, 190)]:
    base = 10000  # 민성 위치를 10000 m로 두어 음수를 피함
    pos = {'민성': base, '태준': base + tm, '혜주': base - hm}
    pos['민아'] = pos['혜주'] + ma
    r.append(f"{dec(F(abs(pos['태준'] - pos['민아']), 1000))} km")
out['4-2-u3-t2-10'] = r

# t2-11: 규칙(첫째 수의 배수)으로 늘어놓은 9개의 합
r = []
for f, shown in [('1.11', ['1.11', '2.22', '3.33', '4.44']), ('0.12', ['0.12', '0.24', '0.36', '0.48']), ('2.03', ['2.03', '4.06', '6.09', '8.12'])]:
    f = D(f)
    seq = [f]
    while len(seq) < 9:
        seq.append(seq[-1] + f)
    assert [dec(x) for x in seq[:4]] == shown
    r.append(dec(sum(seq)))
out['4-2-u3-t2-11'] = r

# t3-7: 한 번에 뛰는 수를 완전 탐색(0.001 단위)으로 찾고 100번째 수
r = []
for diff in ['0.669', '0.426', '0.957']:
    diff = D(diff)
    cands = [F(k, 1000) for k in range(1, 2000) if 3 * F(k, 1000) == diff]  # 첫째와 넷째 수의 차
    assert len(cands) == 1
    d = cands[0]
    seq = [F(0)]
    while len(seq) < 100:
        seq.append(seq[-1] + d)
    r.append(dec(seq[99]))
out['4-2-u3-t3-7'] = r

# t3-8: 세 사람 몸무게를 0.1 kg 단위로 완전 탐색 → 최대-최소
r = []
for s1, s2, s3 in [('74.2', '78.6', '71.4'), ('70.1', '73.7', '66.8'), ('64.1', '69.6', '62.3')]:
    s1, s2, s3 = D(s1), D(s2), D(s3)
    sols = []
    for jk in range(1, 1000):
        j = F(jk, 10); s = s1 - j; u = s3 - j
        if s > 0 and u > 0 and s + u == s2:
            sols.append((j, s, u))
    assert len(sols) == 1
    w = sols[0]
    r.append(f'{dec(max(w) - min(w))} kg')
out['4-2-u3-t3-8'] = r

# t3-9: 책상 높이 + 책 20권
r = []
for h, b in [('78.6', '2.68'), ('72.5', '3.14'), ('80.4', '2.45')]:
    r.append(f'{dec(D(h) + sum([D(b)] * 20))} cm')
out['4-2-u3-t3-9'] = r

# t3-10: 순서 ㉮㉯㉰㉱㉲ 좌표로 놓고 표 조건 확인 (0.01 km 단위 완전 탐색)
r = []
for ab, bc, ac, cm in [('0.85', '0.74', '2.03', '1.07'), ('0.92', '0.68', '2.11', '1.24'), ('0.76', '0.89', '2.24', '1.35')]:
    ab, bc, ac, cm = map(D, (ab, bc, ac, cm))
    sols = set()
    for cdk in range(1, 1000):
        cd = F(cdk, 100)
        for dek in range(1, 1000):
            de = F(dek, 100)
            P = [F(0), ab, ab + bc, ab + bc + cd, ab + bc + cd + de]
            if P[3] - P[0] == ac and P[4] - P[2] == cm:
                sols.add(de)
    assert len(sols) == 1
    r.append(f'{dec(sols.pop())} km')
out['4-2-u3-t3-10'] = r

# t3-11: 세 막대(0.1 m 단위, 서로 다름) 완전 탐색, ㉰가 가장 긺
r = []
for S, pp, q in [('1.3', '0.6', '0.7'), ('1.7', '0.5', '0.9'), ('2.1', '0.8', '1.1')]:
    S, pp, q = D(S), D(pp), D(q)
    res = set()
    for ak in range(1, 100):
        for ck in range(1, 100):
            a = F(ak, 10); b = S - a; c = F(ck, 10)
            if b <= 0 or len({a, b, c}) < 3:
                continue
            if abs(b - c) == pp and abs(b - a) == q and c > a and c > b:
                res.add(c - min(a, b, c))
    assert len(res) == 1
    r.append(f'{dec(res.pop())} m')
out['4-2-u3-t3-11'] = r

# t4-8: 네 자리 자연수 완전 탐색
r = []
for diff in ['48.789', '33.858', '70.506']:
    sols = [n for n in range(1000, 10000) if F(n, 100) - F(n, 1000) == D(diff)]
    assert len(sols) == 1
    r.append(str(sols[0]))
out['4-2-u3-t4-8'] = r

# t4-9: 1~6 서로 다른 숫자 배치 완전 탐색
r = []
for T in ['4.71', '5.61', '7.41']:
    T = D(T)
    best = max(F(p[0] * 100 + p[1] * 10 + p[2], 100) for p in permutations(range(1, 7), 6)
               if T - F(p[0] * 100 + p[1] * 10 + p[2], 100) == F(p[3] * 100 + p[4] * 10 + p[5], 100))
    r.append(dec(best))
out['4-2-u3-t4-9'] = r

# t4-10: 카드 4장 소수 세 자리 수(셋째 자리 0 제외, 일의 자리 0 허용)
r = []
for cards in [(0, 6, 4, 5, 3), (0, 7, 2, 8, 5), (0, 8, 1, 5, 4)]:
    vals = sorted({F(p[0] * 1000 + p[1] * 100 + p[2] * 10 + p[3], 1000) for p in permutations(cards, 4) if p[3] != 0})
    r.append(dec(vals[-4] - vals[3]))
out['4-2-u3-t4-10'] = r

# t4-11: ㉠ 후보 1~9(나머지 카드와 다름), 다섯 장 모두 사용한 수 완전 탐색
r = []
for digs, T in [((8, 2, 5), '17.028'), ((7, 3, 4), '27.027'), ((7, 2, 6), '18.018')]:
    ok = []
    for g in range(1, 10):
        if g in digs:
            continue
        ds = digs + (g,)
        two = [F(p[0] * 1000 + p[1] * 100 + p[2] * 10 + p[3], 100) for p in permutations(ds)]
        three = [F(p[0] * 1000 + p[1] * 100 + p[2] * 10 + p[3], 1000) for p in permutations(ds)]
        if min(two) - max(three) == D(T):
            ok.append(g)
    assert len(ok) >= 1
    r.append(', '.join(map(str, ok)))
out['4-2-u3-t4-11'] = r

for k, v in out.items():
    assert len(v) == 3 and len(set(v)) >= 2, (k, v)
print('AUDIT ' + json.dumps(out, ensure_ascii=False))
