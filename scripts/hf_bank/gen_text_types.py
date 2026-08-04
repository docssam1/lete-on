#!/usr/bin/env python3
"""
scripts/hf_bank/gen_text_types.py
HF Phase 1 — A클래스 17유형 텍스트 유사문제 생성기
실행: python scripts/hf_bank/gen_text_types.py
산출물: hyper-focus/problem-bank/text/qNN.json × 17개
"""

import json
import math
import random
from pathlib import Path

OUT_DIR = Path(__file__).parent.parent.parent / "hyper-focus" / "problem-bank" / "text"
OUT_DIR.mkdir(parents=True, exist_ok=True)


# ─── 조사 처리 ────────────────────────────────────────────────────────────────
def josa(n, pair):
    """숫자 끝자리 발음 받침: 0,1,3,6,7,8 받침有 / 2,4,5,9 받침無"""
    has = str(n)[-1] in '013678'
    return pair[0] if has else pair[1]


# ─── 유형 23: 뛰어세기 ──────────────────────────────────────────────────────
def make_q23():
    def solve_easy(p):
        return str(p['start'] + 3 * p['step'])

    def solve_hard(p):
        return str(p['start'] - 3 * p['step'])

    def gen_easy():
        combos = [(s, st) for s in range(1, 11) for st in [1, 2]]
        random.shuffle(combos)
        items = []
        for start, step in combos[:3]:
            seq = [str(start + i * step) for i in range(3)]
            p = {'start': start, 'step': step}
            items.append({
                "text": f"{', '.join(seq)}, ___ 순서로 뛰어 세고 있습니다. 빈칸에 알맞은 수는 얼마인가요?",
                "answer": solve_easy(p),
                "params": p,
            })
        return items

    def gen_hard():
        combos = [(s, st) for s in range(50, 101, 5) for st in [5, 10] if s - 3 * st >= 0]
        random.shuffle(combos)
        items = []
        for start, step in combos[:3]:
            seq = [str(start - i * step) for i in range(3)]
            p = {'start': start, 'step': step}
            items.append({
                "text": f"{', '.join(seq)}, ___ 순서로 뛰어 세고 있습니다. 빈칸에 알맞은 수는 얼마인가요?",
                "answer": solve_hard(p),
                "params": p,
            })
        return items

    return {"typeId": 23, "title": "뛰어세기",
            "easy": gen_easy(), "hard": gen_hard(),
            "_solvers": {"easy": solve_easy, "hard": solve_hard}}


# ─── 유형 25: 수의 순서 ─────────────────────────────────────────────────────
def make_q25():
    def solve_easy(p):
        return str(list(range(p['start'], p['start'] + 4))[p['pos']])

    def solve_hard(p):
        return str(p['n'] + (1 if p['direction'] == 'after' else -1))

    def gen_easy():
        starts = random.sample(range(1, 25), 3)
        items = []
        for start in starts:
            pos = random.randint(0, 3)
            seq = list(range(start, start + 4))
            display = [str(x) if i != pos else "___" for i, x in enumerate(seq)]
            p = {'start': start, 'pos': pos}
            items.append({
                "text": f"{', '.join(display)} 에서 빈칸에 알맞은 수는 얼마인가요?",
                "answer": solve_easy(p),
                "params": p,
            })
        return items

    def gen_hard():
        directions = ['before', 'after', 'before']
        ns = random.sample(range(21, 99), 3)
        items = []
        for n, direction in zip(ns, directions):
            word = "바로 앞" if direction == 'before' else "바로 뒤"
            p = {'n': n, 'direction': direction}
            items.append({
                "text": f"{n}보다 {word}의 수는 얼마인가요?",
                "answer": solve_hard(p),
                "params": p,
            })
        return items

    return {"typeId": 25, "title": "수의 순서",
            "easy": gen_easy(), "hard": gen_hard(),
            "_solvers": {"easy": solve_easy, "hard": solve_hard}}


# ─── 유형 26: 크기 비교 ─────────────────────────────────────────────────────
def make_q26():
    def solve(p):
        return str(max(p['a'], p['b']))

    def gen_easy():
        pairs = [(a, b) for a in range(1, 10) for b in range(1, 10) if a != b]
        selected = random.sample(pairs, 3)
        return [{"text": f"{a}{josa(a, ('과', '와'))} {b} 중 더 큰 수는 얼마인가요?",
                 "answer": solve({'a': a, 'b': b}),
                 "params": {'a': a, 'b': b}} for a, b in selected]

    def gen_hard():
        pairs = [(a, b)
                 for t in range(1, 10) for u in range(0, 10)
                 if t != u
                 for a, b in [(t * 10 + u, u * 10 + t)]
                 if b >= 10]
        selected = random.sample(pairs, 3)
        return [{"text": f"{a}{josa(a, ('과', '와'))} {b} 중 더 큰 수는 얼마인가요?",
                 "answer": solve({'a': a, 'b': b}),
                 "params": {'a': a, 'b': b}} for a, b in selected]

    return {"typeId": 26, "title": "크기 비교",
            "easy": gen_easy(), "hard": gen_hard(),
            "_solvers": {"easy": solve, "hard": solve}}


# ─── 유형 27: 덧셈 ──────────────────────────────────────────────────────────
def make_q27():
    def solve(p):
        return str(p['a'] + p['b'])

    def gen_easy():
        pairs = [(a, b) for a in range(1, 9) for b in range(1, 9) if a + b <= 9]
        selected = random.sample(pairs, 3)
        return [{"text": f"{a} + {b} = 얼마인가요?",
                 "answer": solve({'a': a, 'b': b}),
                 "params": {'a': a, 'b': b}} for a, b in selected]

    def gen_hard():
        pairs = [(a, b) for a in range(2, 10) for b in range(2, 10) if 10 <= a + b <= 20]
        selected = random.sample(pairs, 3)
        return [{"text": f"{a} + {b} = 얼마인가요?",
                 "answer": solve({'a': a, 'b': b}),
                 "params": {'a': a, 'b': b}} for a, b in selected]

    return {"typeId": 27, "title": "덧셈",
            "easy": gen_easy(), "hard": gen_hard(),
            "_solvers": {"easy": solve, "hard": solve}}


# ─── 유형 28: 뺄셈 ──────────────────────────────────────────────────────────
def make_q28():
    def solve(p):
        return str(p['a'] - p['b'])

    def gen_easy():
        pairs = [(a, b) for a in range(2, 10) for b in range(1, a)]
        selected = random.sample(pairs, 3)
        return [{"text": f"{a} - {b} = 얼마인가요?",
                 "answer": solve({'a': a, 'b': b}),
                 "params": {'a': a, 'b': b}} for a, b in selected]

    def gen_hard():
        pairs = [(a, b) for a in range(11, 21) for b in range(a % 10 + 1, a) if b <= 9]
        selected = random.sample(pairs, 3)
        return [{"text": f"{a} - {b} = 얼마인가요?",
                 "answer": solve({'a': a, 'b': b}),
                 "params": {'a': a, 'b': b}} for a, b in selected]

    return {"typeId": 28, "title": "뺄셈",
            "easy": gen_easy(), "hard": gen_hard(),
            "_solvers": {"easy": solve, "hard": solve}}


# ─── 유형 29: 묶어세기 ──────────────────────────────────────────────────────
def make_q29():
    OBJS = ["사탕", "연필", "공", "구슬", "딸기", "초콜릿", "사과", "달걀", "카드", "꽃"]

    def solve(p):
        return str(p['per'] * p['groups'])

    def gen_easy():
        combos = [(p, g) for p in [2, 3] for g in [2, 3]]
        selected = random.sample(combos, 3)
        return [{"text": f"{random.choice(OBJS)} {per}개씩 {groups}묶음이 있습니다. 모두 몇 개인가요?",
                 "answer": solve({'per': per, 'groups': groups}),
                 "params": {'per': per, 'groups': groups}} for per, groups in selected]

    def gen_hard():
        combos = [(p, g) for p in [5, 10] for g in range(3, 7)]
        selected = random.sample(combos, 3)
        return [{"text": f"{random.choice(OBJS)} {per}개씩 {groups}묶음이 있습니다. 모두 몇 개인가요?",
                 "answer": solve({'per': per, 'groups': groups}),
                 "params": {'per': per, 'groups': groups}} for per, groups in selected]

    return {"typeId": 29, "title": "묶어세기",
            "easy": gen_easy(), "hard": gen_hard(),
            "_solvers": {"easy": solve, "hard": solve}}


# ─── 유형 30: 가르기/모으기 ─────────────────────────────────────────────────
def make_q30():
    def solve_easy(p):
        return str(p['a'] + p['b'])

    def solve_hard(p):
        return str(p['total'] // 2)

    def gen_easy():
        pairs = [(a, b) for a in range(1, 6) for b in range(1, 6)]
        selected = random.sample(pairs, 3)
        return [{"text": f"{a}{josa(a, ('과', '와'))} {b}{josa(b, ('을', '를'))} 모으면 얼마가 되나요?",
                 "answer": solve_easy({'a': a, 'b': b}),
                 "params": {'a': a, 'b': b}} for a, b in selected]

    def gen_hard():
        totals = random.sample(range(6, 19, 2), 3)
        return [{"text": f"{total}{josa(total, ('을', '를'))} 똑같이 둘로 가르면 한 쪽은 얼마인가요?",
                 "answer": solve_hard({'total': total}),
                 "params": {'total': total}} for total in totals]

    return {"typeId": 30, "title": "가르기/모으기",
            "easy": gen_easy(), "hard": gen_hard(),
            "_solvers": {"easy": solve_easy, "hard": solve_hard}}


# ─── 유형 31: 홀짝 ──────────────────────────────────────────────────────────
def make_q31():
    def solve(p):
        return "홀수" if p['n'] % 2 == 1 else "짝수"

    def gen_with_mix(pool):
        odds = [n for n in pool if n % 2 == 1]
        evens = [n for n in pool if n % 2 == 0]
        chosen = [random.choice(odds), random.choice(evens), random.choice(pool)]
        random.shuffle(chosen)
        return [{"text": f"{n}{josa(n, ('은', '는'))} 홀수인가요, 짝수인가요?",
                 "answer": solve({'n': n}),
                 "params": {'n': n}} for n in chosen]

    return {"typeId": 31, "title": "홀짝",
            "easy": gen_with_mix(list(range(1, 10))),
            "hard": gen_with_mix(list(range(10, 100))),
            "_solvers": {"easy": solve, "hard": solve}}


# ─── 유형 32: 반으로 ────────────────────────────────────────────────────────
def make_q32():
    # 받침 없는 소재만 사용 → "를" 고정
    OBJS = ["피자", "케이크", "사과", "두부", "종이"]

    def solve_easy(p):
        return str(p['n'] // 2)

    def solve_hard(p):
        return f"1/{p['pieces']}"

    def gen_easy():
        evens = random.sample(range(4, 21, 2), 3)
        return [{"text": f"{n}{josa(n, ('을', '를'))} 반으로 나누면 얼마인가요?",
                 "answer": solve_easy({'n': n}),
                 "params": {'n': n}} for n in evens]

    def gen_hard():
        pieces_list = [2, 3, 4]
        return [{"text": f"{random.choice(OBJS)}를 {pieces}조각으로 똑같이 나누면 한 조각은 전체의 얼마인가요?",
                 "answer": solve_hard({'pieces': pieces}),
                 "params": {'pieces': pieces}} for pieces in pieces_list]

    return {"typeId": 32, "title": "반으로",
            "easy": gen_easy(), "hard": gen_hard(),
            "_solvers": {"easy": solve_easy, "hard": solve_hard}}


# ─── 유형 43: 시계 ──────────────────────────────────────────────────────────
def make_q43():
    MINUTE_MAP = {3: 15, 6: 30, 9: 45}

    def solve_easy(p):
        return str(p['hour'])

    def solve_hard(p):
        return f"{p['hour']}시 {p['minute']}분"

    def gen_easy():
        hours = random.sample(range(1, 13), 3)
        return [{"text": f"긴 바늘이 12를 가리키고, 짧은 바늘이 {h}{josa(h, ('을', '를'))} 가리킵니다. 몇 시인가요?",
                 "answer": solve_easy({'hour': h}),
                 "params": {'hour': h}} for h in hours]

    def gen_hard():
        combos = [(h, m) for h in range(1, 12) for m in [3, 6, 9]]
        selected = random.sample(combos, 3)
        return [{"text": f"짧은 바늘이 {h}{josa(h, ('과', '와'))} {h + 1} 사이, 긴 바늘이 {m}{josa(m, ('을', '를'))} 가리킵니다. 몇 시 몇 분인가요?",
                 "answer": solve_hard({'hour': h, 'minute': MINUTE_MAP[m]}),
                 "params": {'hour': h, 'minute': MINUTE_MAP[m], 'needle_pos': m}}
                for h, m in selected]

    return {"typeId": 43, "title": "시계",
            "easy": gen_easy(), "hard": gen_hard(),
            "_solvers": {"easy": solve_easy, "hard": solve_hard}}


# ─── 유형 44: 달력 ──────────────────────────────────────────────────────────
def make_q44():
    def solve_easy(p):
        return str(p['d'] + p['k'])

    def solve_hard(p):
        return str(p['d'] + 7 * p['weeks'])

    def gen_easy():
        items, seen = [], set()
        while len(items) < 3:
            d, k = random.randint(1, 20), random.randint(1, 7)
            if d + k <= 28 and (d, k) not in seen:
                seen.add((d, k))
                items.append({"text": f"오늘은 {d}일입니다. {k}일 뒤는 며칠인가요?",
                               "answer": solve_easy({'d': d, 'k': k}),
                               "params": {'d': d, 'k': k}})
        return items

    def gen_hard():
        items, seen = [], set()
        while len(items) < 3:
            weeks = random.choice([2, 3])
            d = random.randint(1, 31 - 7 * weeks)
            if (d, weeks) not in seen:
                seen.add((d, weeks))
                items.append({"text": f"오늘은 {d}일입니다. {weeks}주 뒤는 며칠인가요?",
                               "answer": solve_hard({'d': d, 'weeks': weeks}),
                               "params": {'d': d, 'weeks': weeks}})
        return items

    return {"typeId": 44, "title": "달력",
            "easy": gen_easy(), "hard": gen_hard(),
            "_solvers": {"easy": solve_easy, "hard": solve_hard}}


# ─── 유형 45: 경우의 수 ─────────────────────────────────────────────────────
def make_q45():
    # source별 (경우의 수, 텍스트 동사 형태)
    SOURCES = [
        {"source": "동전 1개", "outcomes": 2, "verb_text": "를 던질 때"},
        {"source": "주사위 1개", "outcomes": 6, "verb_text": "를 던질 때"},
        {"source": "가위바위보 1번", "outcomes": 3, "verb_text": "을 낼 때"},
    ]
    OUTCOMES = {s['source']: s['outcomes'] for s in SOURCES}

    def solve_easy(p):
        return str(OUTCOMES[p['source']])

    def solve_hard(p):
        return str(math.factorial(p['n']))

    def gen_easy():
        specs = list(SOURCES)
        random.shuffle(specs)
        return [{"text": f"{s['source']}{s['verb_text']} 나올 수 있는 경우는 몇 가지인가요?",
                 "answer": solve_easy({'source': s['source']}),
                 "params": {'source': s['source']}} for s in specs]

    def gen_hard():
        # n∈{3,4,5} → 6, 24, 120 (다양성 ✓, params 유일 ✓)
        ns = [3, 4, 5]
        random.shuffle(ns)
        return [{"text": f"{n}명이 한 줄로 서는 방법은 모두 몇 가지인가요?",
                 "answer": solve_hard({'n': n}),
                 "params": {'n': n}} for n in ns]

    return {"typeId": 45, "title": "경우의 수",
            "easy": gen_easy(), "hard": gen_hard(),
            "_solvers": {"easy": solve_easy, "hard": solve_hard}}


# ─── 유형 47: 입체 특징 ─────────────────────────────────────────────────────
def make_q47():
    VERTEX = {"원뿔": 1, "원기둥": 0, "구": 0}

    def solve_easy(p):
        return str(VERTEX[p['shape']])

    def solve_hard(p):
        return str(3 * p['n'])

    def gen_easy():
        shapes = ["원뿔", "원기둥", "구"]
        random.shuffle(shapes)
        return [{"text": f"{shape}의 꼭짓점은 몇 개인가요?",
                 "answer": solve_easy({'shape': shape}),
                 "params": {'shape': shape}} for shape in shapes]

    def gen_hard():
        ns = [3, 4, 5]
        random.shuffle(ns)
        return [{"text": f"{n}각기둥의 모서리는 몇 개인가요?",
                 "answer": solve_hard({'n': n}),
                 "params": {'n': n}} for n in ns]

    return {"typeId": 47, "title": "입체 특징",
            "easy": gen_easy(), "hard": gen_hard(),
            "_solvers": {"easy": solve_easy, "hard": solve_hard}}


# ─── 유형 50: 자료 해결 ─────────────────────────────────────────────────────
def make_q50():
    def solve_easy(p):
        return str(p['a'] + p['b'])

    def solve_hard(p):
        return str(p['a'] + p['b'] if p['direction'] == 'more' else p['a'] - p['b'])

    def gen_easy():
        pairs = random.sample([(a, b) for a in range(3, 15) for b in range(3, 15)], 3)
        return [{"text": f"남학생이 {a}명, 여학생이 {b}명 있습니다. 학생은 모두 몇 명인가요?",
                 "answer": solve_easy({'a': a, 'b': b}),
                 "params": {'a': a, 'b': b}} for a, b in pairs]

    def gen_hard():
        directions = ['more', 'less', 'more']
        items = []
        for direction in directions:
            a = random.randint(10, 30)
            b = random.randint(1, min(a - 1, 10))
            word = "더 많이" if direction == 'more' else "더 적게"
            items.append({"text": f"어제는 책을 {a}권 읽었고, 오늘은 어제보다 {b}권 {word} 읽었습니다. 오늘 읽은 책은 몇 권인가요?",
                          "answer": solve_hard({'a': a, 'b': b, 'direction': direction}),
                          "params": {'a': a, 'b': b, 'direction': direction}})
        return items

    return {"typeId": 50, "title": "자료 해결",
            "easy": gen_easy(), "hard": gen_hard(),
            "_solvers": {"easy": solve_easy, "hard": solve_hard}}


# ─── 유형 52: 전략 ──────────────────────────────────────────────────────────
def make_q52():
    def solve_easy(p):
        n = p['n']
        return str(n * (n + 1) // 2)

    def solve_hard(p):
        return str(p['c'] // p['b'] + p['a'])

    def gen_easy():
        # n∈{4,5,10} → 10, 15, 55 (다양성 ✓, params 유일 ✓)
        ns = [4, 5, 10]
        random.shuffle(ns)
        return [{"text": f"1부터 {n}까지 모두 더하면 얼마인가요?",
                 "answer": solve_easy({'n': n}),
                 "params": {'n': n}} for n in ns]

    def gen_hard():
        items, seen = [], set()
        while len(items) < 3:
            b = random.randint(2, 5)
            x = random.randint(5, 20)
            a = random.randint(1, x - 1)
            c = (x - a) * b
            if (a, b, c) not in seen:
                seen.add((a, b, c))
                items.append({
                    "text": (f"어떤 수에서 {a}{josa(a, ('을', '를'))} 빼고 "
                             f"{b}{josa(b, ('을', '를'))} 곱하면 "
                             f"{c}{josa(c, ('이', '가'))} 됩니다. 어떤 수는 얼마인가요?"),
                    "answer": solve_hard({'a': a, 'b': b, 'c': c}),
                    "params": {'a': a, 'b': b, 'c': c},
                })
        return items

    return {"typeId": 52, "title": "전략",
            "easy": gen_easy(), "hard": gen_hard(),
            "_solvers": {"easy": solve_easy, "hard": solve_hard}}


# ─── 유형 53: 조건 수 ───────────────────────────────────────────────────────
def make_q53():
    def solve_easy(p):
        s = p['s']
        tens = min(9, s)
        ones = s - tens
        return str(tens * 10 + ones)

    def solve_hard(p):
        s = p['s']
        hundreds = min(9, s)
        rem = s - hundreds
        tens = min(9, rem)
        ones = rem - tens
        return str(hundreds * 100 + tens * 10 + ones)

    def gen_easy():
        ss = random.sample(range(3, 10), 3)
        return [{"text": f"각 자리 숫자의 합이 {s}인 두 자리 수 중 가장 큰 수는 얼마인가요?",
                 "answer": solve_easy({'s': s}),
                 "params": {'s': s}} for s in ss]

    def gen_hard():
        ss = random.sample(range(5, 20), 3)
        return [{"text": f"각 자리 숫자의 합이 {s}인 세 자리 수 중 가장 큰 수는 얼마인가요?",
                 "answer": solve_hard({'s': s}),
                 "params": {'s': s}} for s in ss]

    return {"typeId": 53, "title": "조건 수",
            "easy": gen_easy(), "hard": gen_hard(),
            "_solvers": {"easy": solve_easy, "hard": solve_hard}}


# ─── 유형 54: 동전 ──────────────────────────────────────────────────────────
def make_q54():
    EASY_SPECS = [
        {'from_amount': 500,  'to_unit': 100},
        {'from_amount': 1000, 'to_unit': 100},
        {'from_amount': 200,  'to_unit': 100},
    ]

    def solve_easy(p):
        return str(p['from_amount'] // p['to_unit'])

    def solve_hard(p):
        return str((p['a'] * 100 + p['b'] * 50) // 10)

    def gen_easy():
        specs = list(EASY_SPECS)
        random.shuffle(specs)
        return [{"text": f"{s['from_amount']}원{josa(s['from_amount'], ('은', '는'))} 100원짜리 몇 개와 같은가요?",
                 "answer": solve_easy({'from_amount': s['from_amount'], 'to_unit': s['to_unit']}),
                 "params": {'from_amount': s['from_amount'], 'to_unit': s['to_unit']}}
                for s in specs]

    def gen_hard():
        items, seen = [], set()
        while len(items) < 3:
            a, b = random.randint(1, 5), random.randint(1, 5)
            if (a, b) not in seen:
                seen.add((a, b))
                items.append({"text": f"100원짜리 {a}개와 50원짜리 {b}개를 모두 10원짜리로 바꾸면 몇 개인가요?",
                               "answer": solve_hard({'a': a, 'b': b}),
                               "params": {'a': a, 'b': b}})
        return items

    return {"typeId": 54, "title": "동전",
            "easy": gen_easy(), "hard": gen_hard(),
            "_solvers": {"easy": solve_easy, "hard": solve_hard}}


# ─── 생성 목록 ────────────────────────────────────────────────────────────────
MAKERS = [
    make_q23, make_q25, make_q26, make_q27, make_q28,
    make_q29, make_q30, make_q31, make_q32,
    make_q43, make_q44, make_q45, make_q47,
    make_q50, make_q52, make_q53, make_q54,
]


# ─── 검증 및 저장 ─────────────────────────────────────────────────────────────
def validate_and_save(data):
    tid = data['typeId']
    solvers = data.pop('_solvers')
    report = []

    for lv in ('easy', 'hard'):
        problems = data[lv]
        assert len(problems) == 3, f"q{tid} {lv}: 문제 수 {len(problems)} ≠ 3"

        answers = [p['answer'] for p in problems]
        assert len(set(answers)) >= 2, f"q{tid} {lv} 다양성 실패: {answers}"

        assert len({json.dumps(p['params'], sort_keys=True) for p in problems}) == 3, \
            f"q{tid} {lv} params 중복: {[p['params'] for p in problems]}"

        solver = solvers[lv]
        for i, prob in enumerate(problems):
            expected = solver(prob['params'])
            assert prob['answer'] == expected, (
                f"q{tid} {lv}[{i}] solver 불일치: stored={prob['answer']} computed={expected}"
                f"\n  params={prob['params']}"
            )
            assert 'params' in prob, f"q{tid} {lv}[{i}] params 누락"
            assert '그림과 같이' not in prob['text'], f"q{tid} {lv}[{i}] 그림 참조 금지"
            assert '몇 일' not in prob['text'], f"q{tid} {lv}[{i}] '몇 일' 금지 → '며칠' 사용"

        report.append(answers)

    out = {k: v for k, v in data.items()}
    path = OUT_DIR / f"q{tid}.json"
    path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding='utf-8')
    return tid, data['title'], report


def main():
    random.seed(42)

    print(f"산출 경로: {OUT_DIR}\n")
    all_results = []

    for maker in MAKERS:
        data = maker()
        tid, title, report = validate_and_save(data)
        all_results.append((tid, title, report))
        print(f"✓ q{tid} {title}")

    print("\n전 유형 다양성·solver·params유일성 검증 통과\n")
    print("=" * 60)
    print(f"{'유형':>4}  {'제목':<12}  {'레벨':<5}  정답 목록")
    print("-" * 60)
    for tid, title, report in all_results:
        for lv, answers in zip(('easy', 'hard'), report):
            print(f"  {tid:>2}  {title:<12}  {lv:<5}  {answers}")
    print("=" * 60)


if __name__ == '__main__':
    main()
