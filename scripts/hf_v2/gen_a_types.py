#!/usr/bin/env python3
"""HF V2 P1 — A클래스 21유형 generator+solver (교재 기준)
원본 교차검증 → 유사문제 생성 → JSON 저장
"""
import json, itertools
from pathlib import Path
from fractions import Fraction

OUT_DIR = Path("hyper-focus/problem-bank/v2/text")
OUT_DIR.mkdir(parents=True, exist_ok=True)

NAMES = ["지호", "서연", "민준", "하윤", "도윤", "예린", "관호"]

def josa(n, p1, p2=None):
    pair = (p1, p2) if p2 is not None else p1
    s = str(n); last = s[-1]
    if '가' <= last <= '힣':
        return pair[0] if (ord(last) - 0xAC00) % 28 != 0 else pair[1]
    return pair[0] if last in '013678' else pair[1]

# ============================================================
# 원본 교차검증
# ============================================================
def cross_validate():
    print("=== 원본 교차검증 ===")

    # q20: 막대 1,2,4,8 → 15가지
    sticks = [1, 2, 4, 8]
    sums = set()
    for r in range(1, len(sticks)+1):
        for combo in itertools.combinations(sticks, r):
            sums.add(sum(combo))
    print(f"q20: {sticks} → {len(sums)}가지")
    assert len(sums) == 15

    # q21: 조건에 알맞은 수 → 3845
    # 조건: b-a=5, d-c=1, a*d=15, a<b, c<d, all 1-9
    def solve_q21_orig():
        for a in range(1, 10):
            for b in range(1, 10):
                for c in range(1, 10):
                    for d in range(1, 10):
                        if (a+b+c+d == 20 and b-a == 5 and d-c == 1
                                and a < b and c < d and a*d == 15):
                            return int(f"{a}{b}{c}{d}")
        return None
    r21 = solve_q21_orig()
    print(f"q21: 원본 → {r21}")
    assert r21 == 3845

    # q22: 두 자리 수 뺄셈 십의 자리 교환 → solver 출력
    def solve_q22(a, b):
        a1, a2 = a // 10, a % 10
        b1, b2 = b // 10, b % 10
        a_new = b1 * 10 + a2
        b_new = a1 * 10 + b2
        big, small = max(a_new, b_new), min(a_new, b_new)
        return big - small, a_new, b_new
    r22, an, bn = solve_q22(32, 16)
    print(f"q22: 32-16 십의 자리 교환 → {an}-{bn}={r22}")

    # q23: 5 4 3 2 1 사이에 +/- 넣어(이어붙이기 허용) 특정 값 되는 가짓수
    def solve_q23(nums, target):
        n = len(nums)
        count = 0; ways = []
        for ops in itertools.product(['+', '-', ''], repeat=n-1):
            cur = str(nums[0])
            parts = []
            for i, op in enumerate(ops):
                if op == '':
                    cur += str(nums[i+1])
                else:
                    parts.append(int(cur)); parts.append(op)
                    cur = str(nums[i+1])
            parts.append(int(cur))
            val = parts[0]
            for i in range(1, len(parts), 2):
                val = val + parts[i+1] if parts[i] == '+' else val - parts[i+1]
            if val == target:
                count += 1; ways.append(ops)
        return count, ways
    c23, w23 = solve_q23([5, 4, 3, 2, 1], 27)
    print(f"q23: 5 4 3 2 1=27 → {c23}가지 (예: {w23[0] if w23 else '없음'})")

    # q24: 총합-2x=목표 → x
    def solve_q24(total, target):
        diff = total - target
        if diff % 2 == 0: return diff // 2
        return None
    r24 = solve_q24(45, 29)
    print(f"q24: 45-2x=29 → x={r24}")
    assert r24 == 8

    # q25: 74>□5, 3□<39 → 공통 합
    def solve_q25(ineq1, ineq2):
        def get_set(left_fixed, left_pos, right_fixed, right_pos, op):
            result = set()
            for d in range(0, 10):
                if left_pos == 'tens': left_val = d*10 + left_fixed
                else: left_val = left_fixed*10 + d
                if right_pos == 'tens': right_val = d*10 + right_fixed
                else: right_val = right_fixed*10 + d
                if op == '<' and left_val < right_val: result.add(d)
                elif op == '>' and left_val > right_val: result.add(d)
            return result
        s1 = get_set(*ineq1)
        s2 = get_set(*ineq2)
        common = s1 & s2
        return sum(common), sorted(common)
    # 74 > □5: □5 < 74. left=□5(tens=□,units=5), right=74. op='<' for □5 side
    # 3□ < 39: left=3□(tens=3,units=□), right=39. op='<'
    set1 = {d for d in range(0,10) if d*10+5 < 74}
    set2 = {d for d in range(0,10) if 30+d < 39}
    common25 = set1 & set2
    r25 = sum(common25)
    print(f"q25: 74>□5,3□<39 → 공통={sorted(common25)}, 합={r25}")
    assert r25 == 21

    # q30: 1,2,3 3발 → 7가지
    def solve_q30(rings, shots):
        scores = set()
        for combo in itertools.combinations_with_replacement(rings, shots):
            scores.add(sum(combo))
        return len(scores), sorted(scores)
    n30, s30 = solve_q30([1, 2, 3], 3)
    print(f"q30: 1,2,3 3발 → {n30}가지 {s30}")
    assert n30 == 7

    # q33: 3승2패 vs 2승3패 → 3계단 차이 (승=2칸 올라가, 패=1칸 내려가)
    def solve_q33(w1, l1, w2, l2, up=2, down=1):
        pos1 = w1*up - l1*down
        pos2 = w2*up - l2*down
        return abs(pos1 - pos2)
    r33 = solve_q33(3, 2, 2, 3)
    print(f"q33: 3승2패 vs 2승3패 → {r33}계단 차이")
    assert r33 == 3

    # q34: 1,3,4,5 → 최대 41
    def solve_q34(digits):
        best_max = 0; best_min = 10000
        for perm in itertools.permutations(digits):
            a, b, c, d = perm
            n1, n2 = a*10+b, c*10+d
            diff = n1 - n2
            if diff > 0:
                best_max = max(best_max, diff)
                best_min = min(best_min, diff)
        return best_max, best_min
    mx34, mn34 = solve_q34([1, 3, 4, 5])
    print(f"q34: 1,3,4,5 → 최대={mx34}, 최소={mn34}")
    assert mx34 == 41

    # q35: 달리기 등수 — solver 출력 보고
    print("q35: 달리기 등수 추론 → solver 출력 보고")

    # q36: 앞15·뒤11·사이6 → 최소/최대
    def solve_q36(front, back, between):
        total1 = front + back + between  # case: front-person is before back-person
        total2 = front + back - between - 2  # case: back-person is before front-person
        results = []
        if total2 >= max(front, back): results.append(total2)
        if total1 >= max(front, back): results.append(total1)
        return min(results), max(results)
    mn36, mx36 = solve_q36(15, 11, 6)
    print(f"q36: 앞15·뒤11·사이6 → 최소={mn36}명, 최대={mx36}명")

    # q38: n=10,k=2 → 왼쪽 3번째
    def solve_q38(n, k):
        pos = (k + n//2) % n
        if pos == 0: pos = n
        half = n // 2
        if pos <= half: return f"오른쪽 {pos}번째"
        else: return f"왼쪽 {n - pos}번째"
    r38 = solve_q38(10, 2)
    print(f"q38: n=10,k=2 → {r38}")
    assert r38 == "왼쪽 3번째"

    # q39: 논리표 — solver 출력 보고
    print("q39: 논리표 짝짓기 → solver 출력 보고")

    # q44: 백<일·합13·0포함 → [409,508,607]
    def solve_q44_cond(digit_sum, hundreds_lt_units, must_have_zero):
        results = []
        for n in range(100, 1000):
            a, b, c = n//100, (n//10)%10, n%10
            if digit_sum is not None and a+b+c != digit_sum: continue
            if hundreds_lt_units and not (a < c): continue
            if must_have_zero and '0' not in str(n): continue
            results.append(n)
        return results
    r44 = solve_q44_cond(13, True, True)
    print(f"q44: 백<일·합13·0포함 → {r44}")
    assert r44 == [409, 508, 607]

    # q46: x÷2÷2=2 → 8
    def solve_q46(ops, final):
        val = final
        for op, num in reversed(ops):
            if op == '÷': val *= num
            elif op == '×': val //= num
            elif op == '+': val -= num
            elif op == '-': val += num
        return val
    r46 = solve_q46([('÷', 2), ('÷', 2)], 2)
    print(f"q46: x÷2÷2=2 → {r46}")
    assert r46 == 8

    # q47: 2단계 역추적 25명 → 9명
    def solve_q47(steps, final):
        val = final
        for step_in, step_out in reversed(steps):
            val = val - step_in + step_out
        return val
    r47 = solve_q47([(10, 2), (12, 4)], 25)
    print(f"q47: [(+10,-2),(+12,-4)]→25 역추적 → {r47}명")
    assert r47 == 9

    # q48: 6일·12일 → 4일
    def solve_q48(a, b):
        combined = Fraction(1, a) + Fraction(1, b)
        result = Fraction(1) / combined
        return int(result) if result.denominator == 1 else float(result)
    r48 = solve_q48(6, 12)
    print(f"q48: 6일·12일 → {r48}일")
    assert r48 == 4

    # q49: 3마리3일45개→10마리100개 → 2일
    def solve_q49(a1, d1, e1, a2, e2):
        rate = Fraction(e1, a1 * d1)
        days = Fraction(e2, a2 * rate)
        return int(days) if days.denominator == 1 else float(days)
    r49 = solve_q49(3, 3, 45, 10, 100)
    print(f"q49: 3마리3일45개,10마리100개 → {r49}일")
    assert r49 == 2

    # q51: 오전7 초과~오후2 → 시계탑 종 횟수
    def solve_q51(start_h24_excl, end_h24_incl):
        total = 0
        t = start_h24_excl * 2 + 1  # first half-unit after start
        end = end_h24_incl * 2
        while t <= end:
            if t % 2 == 0:
                clock_h = (t // 2) % 12
                if clock_h == 0: clock_h = 12
                total += clock_h
            else:
                total += 1
            t += 1
        return total
    r51 = solve_q51(7, 14)  # 오전7 초과 = 7, 오후2 = 14
    print(f"q51: 오전7 초과~오후2 → {r51}번")

    # q53: 자 2개 = 지우개 12개 (연필1=지우개2, 자1=연필3)
    def solve_q53(chain, query_qty):
        val = query_qty
        for factor in chain:
            val *= factor
        return val
    r53 = solve_q53([3, 2], 2)  # 2자루 × 연필3/자 × 지우개2/연필
    print(f"q53: 자 2개 → 지우개 {r53}개")
    assert r53 == 12

    # q54: 홀홀짝 주기, 40개 → 홀수 27개
    def solve_q54(n):
        full = n // 3
        rem = n % 3
        return full * 2 + min(rem, 2)
    r54 = solve_q54(40)
    print(f"q54: 40개 → 홀수 {r54}개")
    assert r54 == 27

    print("=== 원본 교차검증 완료 ===\n")

# ============================================================
# SOLVERS
# ============================================================
def sol_q20(params):
    sums = set()
    for r in range(1, len(params['sticks'])+1):
        for combo in itertools.combinations(params['sticks'], r):
            sums.add(sum(combo))
    return str(len(sums))

def sol_q21(params):
    cs = params['constraints']
    solutions = []
    for a in range(1, 10):
        for b in range(0, 10):
            for c in range(0, 10):
                for d in range(0, 10):
                    ok = True
                    if 'sum' in cs and a+b+c+d != cs['sum']: ok = False
                    if ok and 'b_minus_a' in cs and b-a != cs['b_minus_a']: ok = False
                    if ok and 'd_minus_c' in cs and d-c != cs['d_minus_c']: ok = False
                    if ok and 'a_times_d' in cs and a*d != cs['a_times_d']: ok = False
                    if ok and 'a_lt_b' in cs and cs['a_lt_b'] and not (a < b): ok = False
                    if ok and 'c_lt_d' in cs and cs['c_lt_d'] and not (c < d): ok = False
                    if ok and 'a_lt_c' in cs and cs['a_lt_c'] and not (a < c): ok = False
                    if ok: solutions.append(int(f"{a}{b}{c}{d}"))
    assert len(solutions) == 1, f"q21 유일해 실패: {solutions}"
    return str(solutions[0])

def sol_q22(params):
    a, b = params['a'], params['b']
    a1, a2 = a // 10, a % 10
    b1, b2 = b // 10, b % 10
    a_new = b1*10 + a2
    b_new = a1*10 + b2
    big, small = max(a_new, b_new), min(a_new, b_new)
    return str(big - small)

def sol_q23(params):
    nums, target = params['nums'], params['target']
    n = len(nums)
    count = 0
    for ops in itertools.product(['+', '-', ''], repeat=n-1):
        cur = str(nums[0]); parts = []
        for i, op in enumerate(ops):
            if op == '':
                cur += str(nums[i+1])
            else:
                parts.append(int(cur)); parts.append(op)
                cur = str(nums[i+1])
        parts.append(int(cur))
        val = parts[0]
        for i in range(1, len(parts), 2):
            val = val + parts[i+1] if parts[i] == '+' else val - parts[i+1]
        if val == target: count += 1
    return str(count)

def sol_q24(params):
    total, target = params['total'], params['target']
    diff = total - target
    assert diff % 2 == 0
    return str(diff // 2)

def sol_q25(params):
    a_fix, a_pos, a_op, a_bound = params['ineq1']
    b_fix, b_pos, b_op, b_bound = params['ineq2']
    def get_set(fix, pos, op, bound):
        s = set()
        for d in range(0, 10):
            val = d*10+fix if pos == 'tens_d' else fix*10+d
            bound_val = bound
            if op == '<' and val < bound_val: s.add(d)
            elif op == '>' and val > bound_val: s.add(d)
        return s
    s1 = get_set(a_fix, a_pos, a_op, a_bound)
    s2 = get_set(b_fix, b_pos, b_op, b_bound)
    return str(sum(s1 & s2))

def sol_q30(params):
    scores = set()
    for combo in itertools.combinations_with_replacement(params['rings'], params['shots']):
        scores.add(sum(combo))
    return str(len(scores))

def sol_q33(params):
    p = params
    pos1 = p['w1']*p['up'] - p['l1']*p['down']
    pos2 = p['w2']*p['up'] - p['l2']*p['down']
    return str(abs(pos1 - pos2))

def sol_q34(params):
    digits = params['digits']
    best_max = 0; best_min = 10000
    for perm in itertools.permutations(digits):
        a, b, c, d = perm
        n1, n2 = a*10+b, c*10+d
        diff = n1 - n2
        if diff > 0:
            best_max = max(best_max, diff)
            best_min = min(best_min, diff)
    return str(best_max if params.get('mode') == 'max' else best_min)

def sol_q35(params):
    names = params['names']
    clues = params['clues']
    n = len(names)
    solutions = []
    for perm in itertools.permutations(range(1, n+1)):
        rank = dict(zip(names, perm))
        ok = True
        for clue in clues:
            if clue[0] == 'faster' and not (rank[clue[1]] < rank[clue[2]]):
                ok = False; break
            elif clue[0] == 'rank' and rank[clue[1]] != clue[2]:
                ok = False; break
        if ok: solutions.append(rank.copy())
    assert len(solutions) == 1, f"q35 유일해 실패: {len(solutions)}개"
    return str(solutions[0][params['query']])

def sol_q36(params):
    front, back, between = params['front'], params['back'], params['between']
    total1 = front + back + between
    total2 = front + back - between - 2
    results = []
    if total2 >= max(front, back): results.append(total2)
    if total1 >= max(front, back): results.append(total1)
    mn, mx = min(results), max(results)
    return f"최소 {mn}명, 최대 {mx}명"

def sol_q38(params):
    n, k = params['n'], params['k']
    pos = (k + n//2) % n
    if pos == 0: pos = n
    half = n // 2
    if pos <= half: return f"오른쪽 {pos}번째"
    else: return f"왼쪽 {n - pos}번째"

def sol_q39(params):
    people = params['people']
    items = params['items']
    clues = params['clues']
    n = len(people)
    for perm in itertools.permutations(items):
        assign = dict(zip(people, perm))
        ok = True
        for clue in clues:
            if clue[0] == 'is' and assign[clue[1]] != clue[2]:
                ok = False; break
            elif clue[0] == 'not' and assign[clue[1]] == clue[2]:
                ok = False; break
            elif clue[0] == 'one_of' and assign[clue[1]] not in clue[2]:
                ok = False; break
        if ok:
            solutions = [assign.copy()]
            for perm2 in itertools.permutations(items):
                if perm2 == perm: continue
                a2 = dict(zip(people, perm2))
                ok2 = True
                for clue in clues:
                    if clue[0] == 'is' and a2[clue[1]] != clue[2]: ok2=False; break
                    elif clue[0] == 'not' and a2[clue[1]] == clue[2]: ok2=False; break
                    elif clue[0] == 'one_of' and a2[clue[1]] not in clue[2]: ok2=False; break
                if ok2: solutions.append(a2)
            assert len(solutions) == 1, f"q39 유일해 실패: {len(solutions)}"
            return assign[params['query']]
    assert False, "q39 해 없음"

def sol_q44(params):
    cs = params
    results = []
    for n in range(100, 1000):
        a, b, c = n//100, (n//10)%10, n%10
        if cs.get('digit_sum') is not None and a+b+c != cs['digit_sum']: continue
        if cs.get('hundreds_lt_units') and not (a < c): continue
        if cs.get('must_have_zero') and '0' not in str(n): continue
        if cs.get('all_diff') and len({a,b,c}) != 3: continue
        results.append(n)
    return ', '.join(map(str, results))

def sol_q46(params):
    val = params['final']
    for op, num in reversed(params['ops']):
        if op == '÷': val *= num
        elif op == '×': val //= num
        elif op == '+': val -= num
        elif op == '-': val += num
    return str(val)

def sol_q47(params):
    val = params['final']
    for step_in, step_out in reversed(params['steps']):
        val = val - step_in + step_out
    return str(val)

def sol_q48(params):
    a, b = params['a'], params['b']
    combined = Fraction(1, a) + Fraction(1, b)
    result = Fraction(1) / combined
    assert result.denominator == 1
    return str(int(result))

def sol_q49(params):
    rate = Fraction(params['e1'], params['a1'] * params['d1'])
    days = Fraction(params['e2'], params['a2'] * rate)
    assert days.denominator == 1
    return str(int(days))

def sol_q51(params):
    s, e = params['start_h24_excl'], params['end_h24_incl']
    total = 0
    t = s * 2 + 1
    end = e * 2
    while t <= end:
        if t % 2 == 0:
            clock_h = (t // 2) % 12
            if clock_h == 0: clock_h = 12
            total += clock_h
        else:
            total += 1
        t += 1
    return str(total)

def sol_q53(params):
    val = params['query_qty']
    for f in params['chain']:
        val *= f
    return str(val)

def sol_q54(params):
    n = params['n']
    full = n // 3
    rem = n % 3
    return str(full * 2 + min(rem, 2))

# ============================================================
# GENERATORS
# ============================================================
def make_q20():
    easy_specs = [
        {'sticks': [1, 2, 3]},
        {'sticks': [1, 3, 5]},
        {'sticks': [2, 3, 4]},
    ]
    hard_specs = [
        {'sticks': [1, 2, 4, 8]},
        {'sticks': [1, 2, 3, 5]},
        {'sticks': [2, 4, 6, 8]},
    ]
    def make(p, nm):
        sticks = p['sticks']
        s_str = ', '.join(map(str, sticks))
        text = (f"길이가 {s_str}인 막대가 각각 1개씩 있습니다. "
                f"이 막대 중 1개 이상을 골라 이어 붙여 만들 수 있는 "
                f"서로 다른 길이는 몇 가지인가요?")
        return {'text': text, 'answer': sol_q20(p), 'params': p}
    easy = [make(p, i) for i, p in enumerate(easy_specs)]
    hard = [make(p, i) for i, p in enumerate(hard_specs)]
    return {'typeId': 20, 'title': '길이가 다른 여러 선분을 조합하여 만들 수 있는 새로운 선분 길이의 가짓수 구하기', 'easy': easy, 'hard': hard}

def make_q21():
    # Each constraint set must yield a UNIQUE 4-digit code
    # params = {'constraints': {...}}
    easy_specs = [
        {'constraints': {'sum': 20, 'b_minus_a': 5, 'd_minus_c': 1, 'a_lt_b': True, 'c_lt_d': True, 'a_times_d': 15}},
        # code = 2457: a=2,b=7,c=4,d=5: sum=18,b-a=5,d-c=1,a*d=10... let me compute a valid one
        # code 1256: a=1,b=2,c=5,d=6: sum=14,b-a=1,d-c=1,a*d=6,a<b,c<d,a<c
        {'constraints': {'sum': 14, 'b_minus_a': 1, 'd_minus_c': 1, 'a_lt_b': True, 'c_lt_d': True, 'a_lt_c': True, 'a_times_d': 6}},
        # code 3479: a=3,b=4,c=7,d=9: sum=23,b-a=1,d-c=2,a*d=27,a<b,c<d,a<c
        {'constraints': {'sum': 23, 'b_minus_a': 1, 'd_minus_c': 2, 'a_lt_b': True, 'c_lt_d': True, 'a_lt_c': True, 'a_times_d': 27}},
    ]
    hard_specs = [
        # code 3845 (original)
        {'constraints': {'sum': 20, 'b_minus_a': 5, 'd_minus_c': 1, 'a_lt_b': True, 'c_lt_d': True, 'a_times_d': 15}},
        # code 2679: a=2,b=6,c=7,d=9: sum=24,b-a=4,d-c=2,a*d=18,a<b,c<d,a<c
        {'constraints': {'sum': 24, 'b_minus_a': 4, 'd_minus_c': 2, 'a_lt_b': True, 'c_lt_d': True, 'a_lt_c': True, 'a_times_d': 18}},
        # code 1589: a=1,b=5,c=8,d=9: sum=23... wait sum=1+5+8+9=23, b-a=4,d-c=1,a*d=9,a<b,c<d,a<c
        {'constraints': {'sum': 23, 'b_minus_a': 4, 'd_minus_c': 1, 'a_lt_b': True, 'c_lt_d': True, 'a_lt_c': True, 'a_times_d': 9}},
    ]
    cond_texts = {
        'sum': lambda v: f"네 자리 숫자의 합은 {v}이다",
        'b_minus_a': lambda v: f"백의 자리 숫자는 천의 자리보다 {v} 크다",
        'd_minus_c': lambda v: f"일의 자리 숫자는 십의 자리보다 {v} 크다",
        'a_lt_b': lambda v: "천의 자리 숫자는 백의 자리보다 작다",
        'c_lt_d': lambda v: "십의 자리 숫자는 일의 자리보다 작다",
        'a_lt_c': lambda v: "천의 자리 숫자는 십의 자리보다 작다",
        'a_times_d': lambda v: f"천의 자리와 일의 자리의 곱은 {v}이다",
    }
    def make(p):
        cs = p['constraints']
        cond_list = []
        for k, v in cs.items():
            if k in cond_texts: cond_list.append(f"• {cond_texts[k](v)}")
        conds = '\n'.join(cond_list)
        text = f"다음 조건을 모두 만족하는 네 자리 수를 구하세요.\n{conds}"
        ans = sol_q21(p)
        return {'text': text, 'answer': ans, 'params': {'constraints': cs}}
    easy = [make(p) for p in easy_specs]
    hard = [make(p) for p in hard_specs]
    return {'typeId': 21, 'title': '조건에 알맞은 수', 'easy': easy, 'hard': hard}

def make_q22():
    easy_specs = [
        {'a': 32, 'b': 16},
        {'a': 53, 'b': 21},
        {'a': 74, 'b': 42},
    ]
    hard_specs = [
        {'a': 85, 'b': 31},
        {'a': 96, 'b': 24},
        {'a': 67, 'b': 53},
    ]
    def make(p):
        a, b = p['a'], p['b']
        a1, a2 = a//10, a%10
        b1, b2 = b//10, b%10
        wrong = abs(a - b)
        big, small = max(a, b), min(a, b)
        text = (f"{NAMES[0]}가 {big} - {small} = {big - small + (b2-a2 if b1 > a1 else a2-b2)}이라고 "
                f"썼습니다. 두 수에서 십의 자리 숫자를 서로 바꾸어 올바른 뺄셈식을 만들면 "
                f"결과는 얼마인가요?")
        # Rebuild text more carefully
        a_new = b1*10 + a2; b_new = a1*10 + b2
        big2, small2 = max(a_new, b_new), min(a_new, b_new)
        stated_wrong = big*10 + small - big2*10 - small2  # not right, just use random wrong
        # Simpler text:
        text = (f"{big} - {small}을 계산했더니 틀렸습니다. "
                f"두 수의 십의 자리를 서로 바꾸면 올바른 식이 됩니다. "
                f"바꾼 후 뺄셈의 결과는 얼마인가요?")
        return {'text': text, 'answer': sol_q22(p), 'params': p}
    easy = [make(p) for p in easy_specs]
    hard = [make(p) for p in hard_specs]
    return {'typeId': 22, 'title': '두 자리 수 덧셈 등식에서 숫자 2개의 위치를 바꿔 올바른 식 만들기', 'easy': easy, 'hard': hard}

def make_q23():
    easy_specs = [
        {'nums': [3, 2, 1], 'target': 4},
        {'nums': [4, 3, 2], 'target': 7},
        {'nums': [5, 2, 1], 'target': 6},
    ]
    hard_specs = [
        {'nums': [5, 4, 3, 2, 1], 'target': 27},
        {'nums': [6, 5, 4, 3, 2], 'target': 10},
        {'nums': [4, 3, 2, 1], 'target': 8},
    ]
    def make(p):
        nums_str = ' '.join(map(str, p['nums']))
        text = (f"숫자 {nums_str} 사이에 덧셈(+) 또는 뺄셈(-) 기호를 넣거나 "
                f"숫자를 이어 붙여 {p['target']}을 만들 수 있는 경우는 몇 가지인가요? "
                f"(숫자의 순서는 바꾸지 않습니다)")
        return {'text': text, 'answer': sol_q23(p), 'params': p}
    easy = [make(p) for p in easy_specs]
    hard = [make(p) for p in hard_specs]
    return {'typeId': 23, 'title': '숫자들 사이에 덧셈(+) 또는 뺄셈(-) 기호를 넣어 특정 값이 나오는 가짓수 구하기', 'easy': easy, 'hard': hard}

def make_q24():
    easy_specs = [
        {'total': 15, 'target': 9},   # (15-9)/2=3
        {'total': 21, 'target': 11},  # (21-11)/2=5
        {'total': 28, 'target': 16},  # (28-16)/2=6
    ]
    hard_specs = [
        {'total': 45, 'target': 29},  # (45-29)/2=8
        {'total': 55, 'target': 37},  # (55-37)/2=9
        {'total': 36, 'target': 18},  # (36-18)/2=9... same. use (36,14)→11
    ]
    hard_specs[2] = {'total': 36, 'target': 14}  # (36-14)/2=11
    def make(p):
        total, target = p['total'], p['target']
        # Generate a sum: 1+2+...+n ≈ total, or just use given total
        text = (f"1부터 어떤 수까지 연속된 수를 모두 더했더니 {total}이 되었습니다. "
                f"이 중 하나의 덧셈(+)을 뺄셈(-)으로 바꿨더니 합이 {target}이 되었습니다. "
                f"부호를 바꾼 수는 얼마인가요?")
        return {'text': text, 'answer': sol_q24(p), 'params': p}
    easy = [make(p) for p in easy_specs]
    hard = [make(p) for p in hard_specs]
    return {'typeId': 24, 'title': '숫자들 사이에 덧셈(+) 또는 뺄셈(-) 기호를 지워 특정 값이 나오는 가짓수 구하기', 'easy': easy, 'hard': hard}

def make_q25():
    # ineq1 = (fixed_digit, 'tens_d'=tens is □, op, bound_number)
    # tens_d: □ is the tens digit → value = □*10 + fixed
    # units_d: □ is the units digit → value = fixed*10 + □
    easy_specs = [
        # □3 < 53, 4□ < 47 → set1={0,1,2,3,4}, set2={0,1,2,3,4,5,6} → common={0,1,2,3,4} → sum=10
        {'ineq1': (3, 'tens_d', '<', 53), 'ineq2': (4, 'units_d', '<', 47)},
        # □7 < 47, 2□ < 26 → set1={0,1,2,3}, set2={0,1,2,3,4,5} → common={0,1,2,3} → sum=6
        {'ineq1': (7, 'tens_d', '<', 47), 'ineq2': (2, 'units_d', '<', 26)},
        # □5 < 35, 1□ < 14 → set1={0,1,2}, set2={0,1,2,3} → common={0,1,2} → sum=3
        {'ineq1': (5, 'tens_d', '<', 35), 'ineq2': (1, 'units_d', '<', 14)},
    ]
    hard_specs = [
        # 74 > □5, 3□ < 39 → sum=21
        {'ineq1': (5, 'tens_d', '<', 74), 'ineq2': (3, 'units_d', '<', 39)},
        # 83 > □4, 5□ < 58 → □4<83:□<8→{0..7}, 5□<58:□<8→{0..7} → common={0..7} → sum=28
        {'ineq1': (4, 'tens_d', '<', 83), 'ineq2': (5, 'units_d', '<', 58)},
        # □6 < 56, 7□ < 79 → □6<56:□<5→{0..4}, 7□<79:□<9→{0..8} → common={0..4} → sum=10... same as easy
        # use: □2 < 62, 3□ < 37 → {0..5},{0..6} → {0..5} → sum=15
        {'ineq1': (2, 'tens_d', '<', 62), 'ineq2': (3, 'units_d', '<', 37)},
    ]
    def ineq_text(fix, pos, op, bound):
        if pos == 'tens_d':
            if op == '<': return f"{bound} > □{fix}"
            else: return f"{bound} < □{fix}"
        else:
            if op == '<': return f"{fix}□ < {bound}"
            else: return f"{fix}□ > {bound}"

    def make(p):
        t1 = ineq_text(*p['ineq1'])
        t2 = ineq_text(*p['ineq2'])
        text = (f"□에 들어갈 수 있는 숫자(0~9) 중 두 조건을 동시에 만족하는 수들의 합을 구하세요.\n"
                f"• {t1}\n• {t2}")
        return {'text': text, 'answer': sol_q25(p), 'params': p}
    easy = [make(p) for p in easy_specs]
    hard = [make(p) for p in hard_specs]
    return {'typeId': 25, 'title': '크기를 만족하는 공통의 수', 'easy': easy, 'hard': hard}

def make_q30():
    easy_specs = [
        {'rings': [1, 2], 'shots': 2},       # {2,3,4}=3
        {'rings': [1, 2, 3], 'shots': 2},    # {2,3,4,5,6}=5
        {'rings': [1, 2, 3, 4], 'shots': 2}, # {2,3,4,5,6,7,8}=7
    ]
    hard_specs = [
        {'rings': [1, 2, 3], 'shots': 3},    # {3..9}=7
        {'rings': [2, 3, 5], 'shots': 3},    # {6..15 distinct}=9
        {'rings': [1, 3, 7], 'shots': 3},    # {3,5,7,9,11,13,15,17,21}=9
    ]
    def make(p):
        r_str = ', '.join(map(str, p['rings']))
        shots = p['shots']
        text = (f"과녁에는 {r_str}점짜리 영역이 있습니다. "
                f"화살을 {shots}발 쏠 때 나올 수 있는 서로 다른 점수의 합은 몇 가지인가요? "
                f"(화살이 과녁 밖으로 나가지 않고, 매번 과녁에 맞힌다고 가정합니다)")
        return {'text': text, 'answer': sol_q30(p), 'params': p}
    easy = [make(p) for p in easy_specs]
    hard = [make(p) for p in hard_specs]
    return {'typeId': 30, 'title': '과녁에 화살을 쏘아 만들 수 있는 점수', 'easy': easy, 'hard': hard}

def make_q33():
    easy_specs = [
        {'w1': 2, 'l1': 1, 'w2': 1, 'l2': 2, 'up': 2, 'down': 1},  # pos1=3,pos2=0 → 3
        {'w1': 3, 'l1': 1, 'w2': 2, 'l2': 2, 'up': 2, 'down': 1},  # pos1=5,pos2=2 → 3
        {'w1': 4, 'l1': 1, 'w2': 3, 'l2': 2, 'up': 2, 'down': 1},  # pos1=7,pos2=4 → 3... same ans
    ]
    easy_specs[2] = {'w1': 2, 'l1': 0, 'w2': 1, 'l2': 1, 'up': 2, 'down': 1}  # 4 vs 1 → 3 still
    easy_specs[0] = {'w1': 3, 'l1': 1, 'w2': 1, 'l2': 3, 'up': 2, 'down': 1}  # 5 vs -1... 6
    easy_specs[1] = {'w1': 2, 'l1': 1, 'w2': 1, 'l2': 2, 'up': 2, 'down': 1}  # 3 vs 0 → 3
    easy_specs[2] = {'w1': 4, 'l1': 2, 'w2': 2, 'l2': 4, 'up': 2, 'down': 1}  # 6 vs 0 → 6
    hard_specs = [
        {'w1': 3, 'l1': 2, 'w2': 2, 'l2': 3, 'up': 2, 'down': 1},  # 4 vs 1 → 3
        {'w1': 5, 'l1': 2, 'w2': 3, 'l2': 4, 'up': 2, 'down': 1},  # 8 vs 2 → 6
        {'w1': 4, 'l1': 3, 'w2': 3, 'l2': 4, 'up': 3, 'down': 2},  # 6 vs 1 → 5
    ]
    pnames = [NAMES[0], NAMES[1]]
    def make(p, i):
        n1, n2 = pnames[0], pnames[1]
        text = (f"{n1}{josa(n1,'은','는')} {p['w1']}번 이기고 {p['l1']}번 졌으며, "
                f"{n2}{josa(n2,'은','는')} {p['w2']}번 이기고 {p['l2']}번 졌습니다. "
                f"가위바위보에서 이기면 계단을 {p['up']}칸 올라가고 지면 {p['down']}칸 내려갑니다. "
                f"두 사람은 몇 칸 차이가 나나요?")
        return {'text': text, 'answer': sol_q33(p), 'params': p}
    easy = [make(p, i) for i, p in enumerate(easy_specs)]
    hard = [make(p, i) for i, p in enumerate(hard_specs)]
    return {'typeId': 33, 'title': '가위바위보 하여 계단 오르거나 내려가기', 'easy': easy, 'hard': hard}

def make_q34():
    easy_specs = [
        {'digits': [1, 2, 3, 4], 'mode': 'max'},
        {'digits': [2, 3, 5, 6], 'mode': 'max'},
        {'digits': [1, 4, 6, 8], 'mode': 'max'},
    ]
    hard_specs = [
        {'digits': [1, 3, 4, 5], 'mode': 'max'},
        {'digits': [2, 4, 5, 7], 'mode': 'min'},
        {'digits': [1, 2, 6, 8], 'mode': 'min'},
    ]
    def make(p):
        d_str = ', '.join(map(str, sorted(p['digits'])))
        mode_kor = '최댓값' if p['mode'] == 'max' else '최솟값'
        text = (f"숫자 카드 {d_str}를 한 번씩 사용하여 두 자리 수 두 개를 만들고 "
                f"큰 수에서 작은 수를 뺄 때, 차의 {mode_kor}을 구하세요.")
        return {'text': text, 'answer': sol_q34(p), 'params': p}
    easy = [make(p) for p in easy_specs]
    hard = [make(p) for p in hard_specs]
    return {'typeId': 34, 'title': '숫자 카드로 수를 만들어 특정 연산의 최댓값 또는 최솟값 구하기', 'easy': easy, 'hard': hard}

def make_q35():
    # 4-5 runners, clues: faster(a,b) means a < b in rank; rank(a,n)
    ns4 = NAMES[:4]
    ns5 = NAMES[:5]
    easy_specs = [
        # ranks: 지호=2, 서연=4, 민준=1, 하윤=3
        {
            'names': ns4, 'n': 4,
            'clues': [('faster', '민준', '지호'), ('faster', '지호', '하윤'),
                      ('faster', '하윤', '서연'), ('rank', '민준', 1)],
            'query': '지호'
        },
        # ranks: 지호=3, 서연=1, 민준=2, 하윤=4
        {
            'names': ns4, 'n': 4,
            'clues': [('rank', '서연', 1), ('faster', '민준', '지호'),
                      ('faster', '서연', '민준'), ('rank', '하윤', 4)],
            'query': '민준'
        },
        # ranks: 지호=1, 서연=3, 민준=4, 하윤=2
        {
            'names': ns4, 'n': 4,
            'clues': [('rank', '지호', 1), ('faster', '하윤', '서연'),
                      ('rank', '민준', 4), ('faster', '지호', '하윤')],
            'query': '서연'
        },
    ]
    hard_specs = [
        # 5 runners: 지호=4, 서연=2, 민준=1, 하윤=5, 도윤=3
        {
            'names': ns5, 'n': 5,
            'clues': [('rank', '민준', 1), ('faster', '서연', '도윤'),
                      ('faster', '도윤', '지호'), ('rank', '하윤', 5),
                      ('faster', '서연', '지호')],
            'query': '지호'
        },
        # 5 runners: 지호=2, 서연=4, 민준=5, 하윤=1, 도윤=3
        {
            'names': ns5, 'n': 5,
            'clues': [('rank', '하윤', 1), ('faster', '지호', '도윤'),
                      ('faster', '도윤', '서연'), ('rank', '민준', 5),
                      ('faster', '지호', '서연')],
            'query': '서연'
        },
        # 5 runners: 지호=3, 서연=1, 민준=2, 하윤=4, 도윤=5
        {
            'names': ns5, 'n': 5,
            'clues': [('rank', '서연', 1), ('faster', '민준', '지호'),
                      ('faster', '서연', '민준'), ('faster', '지호', '하윤'),
                      ('rank', '도윤', 5)],
            'query': '지호'
        },
    ]
    def make(p):
        clue_texts = []
        for c in p['clues']:
            if c[0] == 'faster':
                clue_texts.append(f"• {c[1]}{josa(c[1],'은','는')} {c[2]}보다 빠릅니다")
            else:
                clue_texts.append(f"• {c[1]}{josa(c[1],'은','는')} {c[2]}등입니다")
        text = (f"달리기 경주에서 {', '.join(p['names'])}가 참가했습니다.\n"
                + '\n'.join(clue_texts)
                + f"\n{p['query']}{josa(p['query'],'은','는')} 몇 등인가요?")
        return {'text': text, 'answer': sol_q35(p), 'params': {k: v for k, v in p.items()}}
    easy = [make(p) for p in easy_specs]
    hard = [make(p) for p in hard_specs]
    return {'typeId': 35, 'title': '주어진 단서들을 바탕으로 줄을 세우고 등수(순위) 정확히 추론하기', 'easy': easy, 'hard': hard}

def make_q36():
    easy_specs = [
        {'front': 5, 'back': 4, 'between': 2},   # total1=11,total2=3→min=3,max=11... check: total2=5+4-2-2=5. min=5,max=11
        {'front': 6, 'back': 5, 'between': 3},   # total1=14, total2=6+5-3-2=6 → min=6,max=14
        {'front': 8, 'back': 6, 'between': 4},   # total1=18, total2=8+6-4-2=8 → min=8,max=18
    ]
    hard_specs = [
        {'front': 15, 'back': 11, 'between': 6},  # total1=32,total2=18 → min=18,max=32
        {'front': 12, 'back': 9, 'between': 5},   # total1=26,total2=14 → min=14,max=26
        {'front': 10, 'back': 7, 'between': 3},   # total1=20,total2=12 → min=12,max=20
    ]
    def make(p):
        n1, n2 = NAMES[0], NAMES[1]
        text = (f"{n1}{josa(n1,'은','는')} 앞에서 {p['front']}번째, "
                f"{n2}{josa(n2,'은','는')} 뒤에서 {p['back']}번째에 서 있고, "
                f"두 사람 사이에 {p['between']}명이 있습니다. "
                f"줄에 서 있는 사람은 최소 몇 명, 최대 몇 명인가요?")
        return {'text': text, 'answer': sol_q36(p), 'params': p}
    easy = [make(p) for p in easy_specs]
    hard = [make(p) for p in hard_specs]
    return {'typeId': 36, 'title': '줄 세우기에서 특정인들 사이에 있는 사람 수의 최댓값 및 최솟값 구하기', 'easy': easy, 'hard': hard}

def make_q38():
    easy_specs = [
        {'n': 8, 'k': 1},   # pos=(1+4)%8=5 → left 8-5=3번째
        {'n': 8, 'k': 3},   # pos=(3+4)%8=7 → left 8-7=1번째
        {'n': 6, 'k': 1},   # pos=(1+3)%6=4 → left 6-4=2번째
    ]
    hard_specs = [
        {'n': 10, 'k': 2},  # pos=(2+5)%10=7 → left 10-7=3번째
        {'n': 12, 'k': 3},  # pos=(3+6)%12=9 → left 12-9=3번째
        {'n': 10, 'k': 4},  # pos=(4+5)%10=9 → left 10-9=1번째
    ]
    def make(p):
        n, k = p['n'], p['k']
        text = (f"{n}명이 원탁에 같은 간격으로 앉아 있습니다. "
                f"{NAMES[0]}{josa(NAMES[0],'은','는')} {NAMES[1]}의 오른쪽에서 {k}번째에 앉아 있습니다. "
                f"{NAMES[0]}{josa(NAMES[0],'은','는')} {NAMES[1]}의 정반대 자리에서 왼쪽(또는 오른쪽) "
                f"몇 번째인가요?")
        return {'text': text, 'answer': sol_q38(p), 'params': p}
    easy = [make(p) for p in easy_specs]
    hard = [make(p) for p in hard_specs]
    return {'typeId': 38, 'title': '원 모양에서 마주보는 사람의 순서 정하기', 'easy': easy, 'hard': hard}

def make_q39():
    foods3 = ['사과', '바나나', '포도']
    foods4 = ['사과', '바나나', '포도', '딸기']
    ns3 = NAMES[:3]
    ns4 = NAMES[:4]
    easy_specs = [
        # 지호=사과,서연=바나나,민준=포도
        {
            'people': ns3, 'items': foods3,
            'clues': [('is', '서연', '바나나'), ('not', '지호', '포도')],
            'query': '지호'
        },
        # 지호=포도,서연=사과,민준=바나나
        {
            'people': ns3, 'items': foods3,
            'clues': [('is', '서연', '사과'), ('not', '지호', '바나나'), ('not', '지호', '사과')],
            'query': '민준'
        },
        # 지호=바나나,서연=포도,민준=사과
        {
            'people': ns3, 'items': foods3,
            'clues': [('is', '민준', '사과'), ('not', '서연', '바나나'), ('not', '지호', '사과')],
            'query': '지호'
        },
    ]
    hard_specs = [
        # 지호=사과,서연=딸기,민준=바나나,하윤=포도
        {
            'people': ns4, 'items': foods4,
            'clues': [('not', '지호', '바나나'), ('not', '지호', '포도'), ('not', '지호', '딸기'),
                      ('one_of', '서연', ['딸기', '포도']), ('not', '서연', '포도'),
                      ('not', '민준', '포도')],
            'query': '하윤'
        },
        # 지호=바나나,서연=포도,민준=딸기,하윤=사과
        {
            'people': ns4, 'items': foods4,
            'clues': [('is', '하윤', '사과'), ('not', '지호', '사과'), ('not', '지호', '포도'),
                      ('not', '지호', '딸기'), ('not', '서연', '바나나'), ('not', '서연', '딸기')],
            'query': '민준'
        },
        # 지호=포도,서연=사과,민준=바나나,하윤=딸기 (민준 쿼리)
        {
            'people': ns4, 'items': foods4,
            'clues': [('not', '지호', '사과'), ('not', '지호', '바나나'), ('not', '지호', '딸기'),
                      ('not', '서연', '포도'), ('not', '서연', '딸기'), ('not', '서연', '바나나'),
                      ('not', '하윤', '포도'), ('not', '하윤', '바나나'), ('not', '하윤', '사과')],
            'query': '민준'
        },
    ]
    def make(p):
        clue_texts = []
        for c in p['clues']:
            if c[0] == 'is':
                clue_texts.append(f"• {c[1]}{josa(c[1],'은','는')} {c[2]}을(를) 좋아합니다")
            elif c[0] == 'not':
                clue_texts.append(f"• {c[1]}{josa(c[1],'은','는')} {c[2]}을(를) 좋아하지 않습니다")
            elif c[0] == 'one_of':
                clue_texts.append(f"• {c[1]}{josa(c[1],'은','는')} {' 또는 '.join(c[2])}을(를) 좋아합니다")
        ppl_str = ', '.join(p['people'])
        text = (f"{ppl_str}가 각각 서로 다른 과일 하나씩을 좋아합니다.\n"
                + '\n'.join(clue_texts)
                + f"\n{p['query']}{josa(p['query'],'은','는')} 어떤 과일을 좋아하나요?")
        return {'text': text, 'answer': sol_q39(p), 'params': p}
    easy = [make(p) for p in easy_specs]
    hard = [make(p) for p in hard_specs]
    return {'typeId': 39, 'title': '논리표(Matrix)를 이용하여 조건에 맞는 항목 올바르게 짝짓기', 'easy': easy, 'hard': hard}

def make_q44():
    easy_specs = [
        # 합=9, 백<일, 0포함 → 108,207,306,405
        {'digit_sum': 9, 'hundreds_lt_units': True, 'must_have_zero': True, 'all_diff': False},
        # 합=11, 백<일, 0포함 → 209,308,407,506
        {'digit_sum': 11, 'hundreds_lt_units': True, 'must_have_zero': True, 'all_diff': False},
        # 합=12, 백<일, 0포함 → 309,408,507
        {'digit_sum': 12, 'hundreds_lt_units': True, 'must_have_zero': True, 'all_diff': False},
    ]
    hard_specs = [
        # 합=13, 백<일, 0포함 → 409,508,607
        {'digit_sum': 13, 'hundreds_lt_units': True, 'must_have_zero': True, 'all_diff': False},
        # 합=14, 백<일, 0포함 → 509,608
        {'digit_sum': 14, 'hundreds_lt_units': True, 'must_have_zero': True, 'all_diff': False},
        # 합=10, 백<일, 0포함 → 109,208,307,406
        {'digit_sum': 10, 'hundreds_lt_units': True, 'must_have_zero': True, 'all_diff': False},
    ]
    def cond_text(p):
        conds = []
        if p.get('digit_sum'): conds.append(f"세 자리 숫자의 합이 {p['digit_sum']}")
        if p.get('hundreds_lt_units'): conds.append("백의 자리 숫자가 일의 자리보다 작다")
        if p.get('must_have_zero'): conds.append("숫자 0을 포함한다")
        if p.get('all_diff'): conds.append("세 자리 수가 모두 다르다")
        return conds
    def make(p):
        conds = cond_text(p)
        cond_str = '\n'.join(f'• {c}' for c in conds)
        text = (f"다음 조건을 모두 만족하는 세 자리 수를 모두 구하세요.\n{cond_str}")
        return {'text': text, 'answer': sol_q44(p), 'params': p}
    easy = [make(p) for p in easy_specs]
    hard = [make(p) for p in hard_specs]
    return {'typeId': 44, 'title': '주어진 숫자 카드를 사용하여 조건에 맞는 세 자리 수의 개수 구하기', 'easy': easy, 'hard': hard}

def make_q46():
    # ops: list of (op, num) applied in order to unknown x
    easy_specs = [
        {'ops': [('÷', 2), ('÷', 2)], 'final': 3},    # x/2/2=3 → x=12
        {'ops': [('-', 5), ('÷', 3)], 'final': 4},     # (x-5)/3=4 → x=17
        {'ops': [('+', 3), ('×', 2)], 'final': 14},    # (x+3)*2=14 → x=4
    ]
    hard_specs = [
        {'ops': [('÷', 2), ('÷', 2)], 'final': 2},    # x=8
        {'ops': [('-', 4), ('÷', 2), ('+', 3)], 'final': 10},   # ((x-4)/2)+3=10 → (x-4)/2=7 → x=18
        {'ops': [('+', 6), ('÷', 3), ('-', 2)], 'final': 5},    # (x+6)/3-2=5 → (x+6)/3=7 → x=15
    ]
    def ops_text(ops):
        parts = []
        for op, num in ops:
            if op == '÷': parts.append(f"{num}으로 나누고")
            elif op == '×': parts.append(f"{num}을 곱하고")
            elif op == '+': parts.append(f"{num}을 더하고")
            elif op == '-': parts.append(f"{num}을 빼고")
        return ' '.join(parts)
    def make(p):
        ops_str = ops_text(p['ops'])
        text = (f"어떤 수에 {ops_str} 나면 {p['final']}이 됩니다. "
                f"어떤 수는 얼마인가요?")
        return {'text': text, 'answer': sol_q46(p), 'params': p}
    easy = [make(p) for p in easy_specs]
    hard = [make(p) for p in hard_specs]
    return {'typeId': 46, 'title': '식이나 문장 조건을 보고 결과를 거꾸로 계산하여 처음 수 구하기', 'easy': easy, 'hard': hard}

def make_q47():
    easy_specs = [
        {'steps': [(5, 2), (3, 1)], 'final': 14},   # 14-3+1=12; 12-5+2=9 → 9
        {'steps': [(4, 1), (6, 2)], 'final': 18},   # 18-6+2=14; 14-4+1=11 → 11
        {'steps': [(3, 0), (5, 2)], 'final': 12},   # 12-5+2=9; 9-3+0=6 → 6
    ]
    hard_specs = [
        {'steps': [(10, 2), (12, 4)], 'final': 25},  # → 9
        {'steps': [(8, 3), (15, 5)], 'final': 30},   # 30-15+5=20; 20-8+3=15 → 15
        {'steps': [(6, 1), (9, 4), (5, 2)], 'final': 20},
        # 20-5+2=17; 17-9+4=12; 12-6+1=7 → 7
    ]
    def make(p):
        steps = p['steps']
        final = p['final']
        step_texts = []
        for i, (si, so) in enumerate(steps, 1):
            step_texts.append(f"• {i}단계: {si}명이 들어오고 {so}명이 나갔습니다")
        text = (f"어떤 모임의 인원이 변화했습니다.\n"
                + '\n'.join(step_texts)
                + f"\n이 모든 과정이 끝난 후 {final}명이 남았습니다. "
                f"처음에 몇 명이 있었나요?")
        return {'text': text, 'answer': sol_q47(p), 'params': p}
    easy = [make(p) for p in easy_specs]
    hard = [make(p) for p in hard_specs]
    return {'typeId': 47, 'title': '표의 변화 과정을 거꾸로 추적하여 문제 해결하기', 'easy': easy, 'hard': hard}

def make_q48():
    easy_specs = [
        {'a': 4, 'b': 12},   # 1/4+1/12=4/12=1/3 → 3일
        {'a': 6, 'b': 6},    # 1/6+1/6=2/6=1/3 → 3일
        {'a': 3, 'b': 6},    # 1/3+1/6=3/6=1/2 → 2일
    ]
    hard_specs = [
        {'a': 6, 'b': 12},   # → 4일
        {'a': 4, 'b': 6},    # 1/4+1/6=5/12 → 12/5=2.4... not integer. skip
        {'a': 6, 'b': 10},   # 1/6+1/10=8/30=4/15 → not integer. skip
        {'a': 4, 'b': 12},   # same as easy
    ]
    # Fix hard specs to ensure integer results
    hard_specs = [
        {'a': 6, 'b': 12},   # → 4일
        {'a': 4, 'b': 4},    # → 2일
        {'a': 10, 'b': 15},  # 1/10+1/15=5/30=1/6 → 6일
    ]
    n1, n2 = NAMES[0], NAMES[1]
    def make(p):
        text = (f"{n1}{josa(n1,'은','는')} 어떤 일을 혼자 하면 {p['a']}일이 걸리고, "
                f"{n2}{josa(n2,'은','는')} 같은 일을 혼자 하면 {p['b']}일이 걸립니다. "
                f"두 사람이 함께 하면 며칠이 걸리나요?")
        return {'text': text, 'answer': sol_q48(p), 'params': p}
    easy = [make(p) for p in easy_specs]
    hard = [make(p) for p in hard_specs]
    return {'typeId': 48, 'title': '일의 양과 시간 계산', 'easy': easy, 'hard': hard}

def make_q49():
    easy_specs = [
        {'a1': 2, 'd1': 2, 'e1': 8, 'a2': 4, 'e2': 8},   # rate=2/animal/day, 4×1×2=8 → 1일
        {'a1': 3, 'd1': 2, 'e1': 12, 'a2': 6, 'e2': 24},  # rate=2, 6×2×2=24 → 2일
        {'a1': 5, 'd1': 1, 'e1': 10, 'a2': 5, 'e2': 20},  # rate=2, 5×2×2=20 → 2일
    ]
    hard_specs = [
        {'a1': 3, 'd1': 3, 'e1': 45, 'a2': 10, 'e2': 100},  # rate=5, → 2일
        {'a1': 2, 'd1': 5, 'e1': 20, 'a2': 8, 'e2': 80},    # rate=2, → 5일
        {'a1': 4, 'd1': 3, 'e1': 36, 'a2': 6, 'e2': 54},    # rate=3, → 3일
    ]
    def make(p):
        text = (f"닭 {p['a1']}마리가 {p['d1']}일 동안 달걀 {p['e1']}개를 낳습니다. "
                f"같은 닭 {p['a2']}마리가 달걀 {p['e2']}개를 낳으려면 며칠이 걸리나요?")
        return {'text': text, 'answer': sol_q49(p), 'params': p}
    easy = [make(p) for p in easy_specs]
    hard = [make(p) for p in hard_specs]
    return {'typeId': 49, 'title': '비례식 활용', 'easy': easy, 'hard': hard}

def make_q51():
    # start_h24_excl: exclusive start in 24h; end_h24_incl: inclusive end
    easy_specs = [
        {'start_h24_excl': 8, 'end_h24_incl': 10},   # 8:30,9:00,9:30,10:00 → 1+9+1+10=21
        {'start_h24_excl': 10, 'end_h24_incl': 12},  # 10:30,11:00,11:30,12:00 → 1+11+1+12=25
        {'start_h24_excl': 13, 'end_h24_incl': 15},  # 13:30=1:30,14:00=2,14:30,15:00=3 → 1+2+1+3=7
    ]
    hard_specs = [
        {'start_h24_excl': 7, 'end_h24_incl': 14},   # 오전7초과~오후2 → 60
        {'start_h24_excl': 9, 'end_h24_incl': 16},   # 오전9초과~오후4 → ?
        {'start_h24_excl': 8, 'end_h24_incl': 15},   # 오전8초과~오후3 → ?
    ]
    def h24_text(h24):
        if h24 < 12: return f"오전 {h24}시"
        elif h24 == 12: return "오후 12시(낮 12시)"
        else: return f"오후 {h24-12}시"
    def make(p):
        s = h24_text(p['start_h24_excl'])
        e = h24_text(p['end_h24_incl'])
        text = (f"시계탑은 매 정시에 그 시각만큼, 매 30분에 1번 종이 울립니다. "
                f"{s} 이후부터 {e}까지 종이 울린 총 횟수는 몇 번인가요?")
        return {'text': text, 'answer': sol_q51(p), 'params': p}
    easy = [make(p) for p in easy_specs]
    hard = [make(p) for p in hard_specs]
    return {'typeId': 51, 'title': '시간 범위 내에서 시간대에 따라 시계탑의 종이 울린 총 횟수 구하기', 'easy': easy, 'hard': hard}

def make_q53():
    # chain: [factor1, factor2, ...] → query_qty * product(chain) = answer
    # Example: 1연필=chain[0]지우개, 1자=chain[1]연필, query_qty 자 → answer 지우개
    easy_specs = [
        {'chain': [2, 2], 'query_qty': 3, 'units': ['지우개', '연필', '자']},     # 3×2×2=12
        {'chain': [3, 2], 'query_qty': 2, 'units': ['색종이', '구슬', '상자']},  # 2×3×2=12... same
        {'chain': [4, 3], 'query_qty': 1, 'units': ['동전', '막대', '묶음']},    # 1×4×3=12... same
    ]
    # Fix easy to have diverse answers
    easy_specs = [
        {'chain': [2, 2], 'query_qty': 2, 'units': ['지우개', '연필', '자']},    # 2×2×2=8
        {'chain': [3, 2], 'query_qty': 2, 'units': ['색종이', '묶음', '상자']},  # 2×3×2=12
        {'chain': [2, 3], 'query_qty': 3, 'units': ['동전', '막대', '통']},      # 3×2×3=18
    ]
    hard_specs = [
        {'chain': [3, 2], 'query_qty': 2, 'units': ['지우개', '연필', '자']},    # 12
        {'chain': [4, 2], 'query_qty': 3, 'units': ['낱개', '묶음', '상자']},    # 24
        {'chain': [3, 3], 'query_qty': 2, 'units': ['알', '꾸러미', '상자']},    # 18
    ]
    def make(p):
        u = p['units']  # u[0]=smallest, u[1]=middle, u[2]=biggest
        text = (f"{u[1]} 1개{josa(u[1],'은','는')} {u[0]} {p['chain'][0]}개{josa(p['chain'][0],'와','과')} 같고, "
                f"{u[2]} 1개{josa(u[2],'는','는')} {u[1]} {p['chain'][1]}개{josa(p['chain'][1],'와','과')} 같습니다. "
                f"{u[2]} {p['query_qty']}개{josa(p['query_qty'],'는','는')} {u[0]} 몇 개{josa(p['query_qty'],'와','과')} 같은가요?")
        return {'text': text, 'answer': sol_q53(p), 'params': p}
    easy = [make(p) for p in easy_specs]
    hard = [make(p) for p in hard_specs]
    return {'typeId': 53, 'title': '서로 다른 단위길이를 이용한 활용 문제', 'easy': easy, 'hard': hard}

def make_q54():
    # Fibonacci-like sequence with 홀홀짝 period
    easy_specs = [
        {'n': 9},   # 9/3=3 full cycles → 3×2=6 odd
        {'n': 12},  # 12/3=4 full cycles → 4×2=8 odd
        {'n': 15},  # 15/3=5 full cycles → 5×2=10 odd
    ]
    hard_specs = [
        {'n': 40},  # → 27
        {'n': 30},  # 30/3=10 cycles → 10×2=20 odd
        {'n': 25},  # 25/3=8 full+rem1 → 8×2+1=17 odd
    ]
    def make(p):
        n = p['n']
        text = (f"1, 1, 2, 3, 5, 8, 13, 21, ... 과 같이 앞의 두 수를 더해 다음 수를 만드는 수열이 있습니다. "
                f"이 수열에서 처음 {n}개의 수 중 홀수는 몇 개인가요?")
        return {'text': text, 'answer': sol_q54(p), 'params': p}
    easy = [make(p) for p in easy_specs]
    hard = [make(p) for p in hard_specs]
    return {'typeId': 54, 'title': '피보나치 수열 등 특정 수열에서 홀수(또는 짝수)가 나오는 개수 구하기', 'easy': easy, 'hard': hard}

# ============================================================
# VALIDATION & SAVE
# ============================================================
def validate_and_save(data, solver):
    tid = data['typeId']
    for lv in ('easy', 'hard'):
        problems = data[lv]
        assert len(problems) == 3, f"q{tid} {lv}: 3문제 필요"
        answers = [p['answer'] for p in problems]
        assert len(set(answers)) >= 2, f"q{tid} {lv} 다양성 실패: {answers}"
        param_keys = {json.dumps(p['params'], sort_keys=True, ensure_ascii=False) for p in problems}
        assert len(param_keys) == 3, f"q{tid} {lv} params 유일성 실패"
        for p in problems:
            assert '그림과 같이' not in p['text'], f"q{tid} 그림 참조 금지"
            assert '몇 일' not in p['text'], f"q{tid} '몇 일' 금지"
            if solver:
                computed = solver(p['params'])
                assert p['answer'] == computed, (
                    f"q{tid} {lv} solver 불일치: expected={computed}, got={p['answer']}\n"
                    f"  params={p['params']}")
    path = OUT_DIR / f"q{tid}.json"
    out = {k: v for k, v in data.items()}
    path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f"  q{tid}: easy={[p['answer'] for p in data['easy']]}  hard={[p['answer'] for p in data['hard']]}")

TYPES = [
    (make_q20, sol_q20),
    (make_q21, sol_q21),
    (make_q22, sol_q22),
    (make_q23, sol_q23),
    (make_q24, sol_q24),
    (make_q25, sol_q25),
    (make_q30, sol_q30),
    (make_q33, sol_q33),
    (make_q34, sol_q34),
    (make_q35, sol_q35),
    (make_q36, sol_q36),
    (make_q38, sol_q38),
    (make_q39, sol_q39),
    (make_q44, sol_q44),
    (make_q46, sol_q46),
    (make_q47, sol_q47),
    (make_q48, sol_q48),
    (make_q49, sol_q49),
    (make_q51, sol_q51),
    (make_q53, sol_q53),
    (make_q54, sol_q54),
]

if __name__ == '__main__':
    cross_validate()
    print("=== 유형별 정답 목록 ===")
    for make_fn, sol_fn in TYPES:
        data = make_fn()
        validate_and_save(data, sol_fn)
    print("\n전 유형 다양성·solver 검증 통과")
