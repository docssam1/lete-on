# 6-2 5단원 개념탐구 2 원문 구조 문항 독립 감사 (표준 라이브러리만 사용)
import json, math
from fractions import Fraction as F

def dec(x):
    x = F(x)
    assert x >= 0
    i, r = divmod(x.numerator, x.denominator)
    t = ''
    for _ in range(10):
        if not r: break
        r *= 10; t += str(r // x.denominator); r %= x.denominator
    assert r == 0, 'non-terminating'
    return str(i) + ('.' + t if t else '')

def mixed(x):
    x = F(x)
    if x.denominator == 1: return str(x.numerator)
    w, r = divmod(x.numerator, x.denominator)
    return (f'{w} ' if w else '') + f'{r}/{x.denominator}'

OUT = {}
P314, P31, P3, P227 = F(314, 100), F(31, 10), F(3), F(22, 7)

# 개념탐구(1): 정십이각형(삼각형 12개, 꼭지각 30°) < 원 < 정사각형
ans = []
for r in (1, 2, 3):
    # 꼭지각 30°인 삼각형의 높이 = r/2 (정삼각형 절반) : 수치로도 확인
    h = F(r, 2)
    assert abs(r * math.sin(math.pi / 6) - float(h)) < 1e-12
    dod = 12 * (F(r) * h / 2)
    assert abs(float(dod) - 6 * r * r * math.sin(math.pi / 6)) < 1e-9
    sq = (2 * r) ** 2
    assert dod < math.pi * r * r < sq and dod == 3 * r * r
    ans.append(f'원 안의 정십이각형 넓이({dod} cm²)보다 크고 원 밖의 정사각형 넓이({sq} cm²)보다 작기 때문')
OUT['6-2-u5-e2-exploration-1'] = ans

# 개념탐구(2): 16조각 중 8개의 호 = 원주의 절반, 옆변 = 반지름
OUT['6-2-u5-e2-exploration-2'] = [f'㉠ {dec(2 * r * P314 / 2)} cm, ㉡ {r} cm' for r in (8, 6, 10)]

# 예제1 / Mission1: 정육각형 = 삼각형 6개
OUT['6-2-u5-e2-example-1'] = [f'{6*a} cm² 초과 {6*b} cm² 미만' for a, b in ((24, 32), (18, 24), (27, 36))]
for a, b in ((24, 32), (18, 24), (27, 36)):
    assert F(b, a) == F(4, 3)   # 원 안·밖 정육각형 넓이 비 3:4 와 일치
ans = []
for tout, tin in ((40, 30), (48, 36), (20, 15)):
    assert F(tout, tin) == F(4, 3)   # 원 밖:원 안 정육각형 넓이 비 4:3
    ans.append(f'{6*tin} cm² 초과 {6*tout} cm² 미만')
OUT['6-2-u5-e2-mission-1'] = ans

# 예제2: 자연수 반지름 전수 탐색
ans = []
for A0, B0 in ((15, 10), (11, 7), (12, 9)):
    circ = (A0 - B0) * 2 * P314
    area = (A0 * A0 - B0 * B0) * P314
    sols = [(a, b) for a in range(1, 400) for b in range(1, a) if (a - b) * 2 * P314 == circ and (a * a - b * b) * P314 == area]
    assert sols == [(A0, B0)], sols
    ans.append(str(sols[0][0] * sols[0][1]))
OUT['6-2-u5-e2-example-2'] = ans

# 예제3: 각 꼭짓점에서 원 밖으로 나온 240° 부채꼴 (격자 몬테카를로 대신 기하 조건 + 공식)
ans = []
for s, a, b in ((3, 1, 2), (4, 1, 3), (5, 2, 3)):
    assert a + b == s            # 이웃한 원이 변 위에서 맞닿음
    assert 2 * b < s * math.sqrt(3) and 2 * a < s * math.sqrt(3)  # 하나 건너 원끼리 겹치지 않음
    assert b <= s               # 안쪽 120° 부채꼴이 정육각형 안에 들어감
    total = 3 * a * a * P314 * F(240, 360) + 3 * b * b * P314 * F(240, 360)
    k = total / P314
    assert k.denominator == 1
    ans.append(str(k.numerator))
OUT['6-2-u5-e2-example-3'] = ans

# 예제4: 긴바늘 1바퀴 동안 짧은바늘 30°
ans = []
for sh, lo in ((21, 35), (21, 28), (42, 49)):
    v = lo * lo * P227 - sh * sh * P227 * F(30, 360)
    ans.append(f'{dec(v)} cm²')
OUT['6-2-u5-e2-example-4'] = ans

# Mission2: 120° 띠 모양
OUT['6-2-u5-e2-mission-2'] = [f'{dec((o*o - i*i) * P314 * F(120, 360))} cm²' for o, i in ((6, 3), (9, 6), (12, 3))]

# Mission3: 120°+90°
OUT['6-2-u5-e2-mission-3'] = [f'{mixed(r*r*P227*F(120+90, 360))} cm²' for r in (6, 12, 18)]

# Mission4: (1 − 원주율/4)×100 % 의 10배, 정사각형 한 변과 무관함을 여러 변으로 확인
ans = []
for pi in (P314, P31, P3):
    vals = set()
    for side in range(1, 30):
        sq = F(side * side); circ = F(side, 2) ** 2 * pi
        vals.add((sq - circ) / sq * 100 * 10)
    assert len(vals) == 1
    v = vals.pop(); assert v.denominator == 1
    ans.append(str(v.numerator))
OUT['6-2-u5-e2-mission-4'] = ans

# Mission5: 정육각형 바깥각 60°, 반지름 s, 2s, 3s (좌표로 이어짐 확인)
ans = []
for s in (6, 9, 12):
    c = lambda d: (math.cos(math.radians(d)), math.sin(math.radians(d)))
    T = (0, s); UR = (s * c(30)[0], s * c(30)[1]); LR = (s * c(-30)[0], s * c(-30)[1]); B = (0, -s)
    end_small = (LR[0], LR[1] - s)
    end_mid_a = (UR[0], UR[1] - 2 * s)
    assert math.dist(end_small, end_mid_a) < 1e-9 and abs(math.dist(LR, B) - s) < 1e-9
    end_mid_b = (UR[0] + 2 * s * c(-30)[0], UR[1] + 2 * s * c(-30)[1])
    end_big = (T[0] + 3 * s * c(-30)[0], T[1] + 3 * s * c(-30)[1])
    assert math.dist(end_mid_b, end_big) < 1e-9
    v = sum((k * s) ** 2 * P31 * F(60, 360) for k in (1, 2, 3))
    ans.append(f'{dec(v)} cm²')
OUT['6-2-u5-e2-mission-5'] = ans

# Mission6: 시침·분침 사이 작은 각
ans = []
for d, h, m in ((20, 7, 20), (12, 4, 10), (16, 2, 50)):
    hr = F(30 * h) + F(m, 2); mn = F(6 * m)
    g = abs(hr - mn); g = min(g, 360 - g)
    v = F(d, 2) ** 2 * P3 * g / 360
    ans.append(f'{mixed(v)} cm²')
OUT['6-2-u5-e2-mission-6'] = ans

print('AUDIT ' + json.dumps(OUT, ensure_ascii=False))
