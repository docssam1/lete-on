"""Audit: 5-2-u6-e4-example-3 (printed p64, pdf p60) ㄹ 지점을 지나갈 가능성.
Figure roads (printed lines only, counted on 2x crop):
 ㄱ-ㄴ 3, ㄱ-ㄹ 2, ㄴ-ㄹ 2, ㄴ-ㄷ 1, ㄹ-ㄷ 4.  Source: 한 번 지나간 지점은 다시 지나가지 않는다.
Run: python3 -I source-5-2-u6-p64-example43-original-audit.py
"""
from fractions import Fraction as F

MULT = {('ㄱ', 'ㄴ'): 3, ('ㄱ', 'ㄹ'): 2, ('ㄴ', 'ㄹ'): 2, ('ㄴ', 'ㄷ'): 1, ('ㄹ', 'ㄷ'): 4}
EDGES = [(a, b, i) for (a, b), m in MULT.items() for i in range(m)]
assert len(EDGES) == 12

def nbrs(v):
    for a, b, i in EDGES:
        if a == v: yield b, (a, b, i)
        elif b == v: yield a, (a, b, i)

routes = []
def go(v, seen, path):
    if v == 'ㄷ':
        routes.append(tuple(path)); return
    for w, e in nbrs(v):
        if w not in seen:
            go(w, seen | {w}, path + [(w, e)])
go('ㄱ', {'ㄱ'}, [])
total = len(routes)
via = sum(1 for r in routes if any(w == 'ㄹ' for w, _ in r))
print('routes total', total, 'via ㄹ', via)
assert (total, via) == (3 * 1 + 3 * 2 * 4 + 2 * 4 + 2 * 2 * 1, 24 + 8 + 4) == (39, 36)
p = F(via, total)
assert p == F(12, 13)
print('equally likely complete routes:', p)

# Alternative (NOT used): at each point choose uniformly among usable roads.
def junction(v, seen):
    if v == 'ㄷ': return F(0), True
    opts = [(w, e) for w, e in nbrs(v) if w not in seen]
    # every branch here reaches ㄷ (no dead ends in this figure)
    pr = F(0)
    for w, _ in opts:
        if w == 'ㄹ':
            pr += F(1, len(opts))
        else:
            sub, _ = junction(w, seen | {w})
            pr += F(1, len(opts)) * sub
    return pr, True
alt, _ = junction('ㄱ', {'ㄱ'})
print('junction-by-junction model (not the chapter model):', alt)
assert alt == F(4, 5)
print('OK 12/13 under the chapter model (모든 길 중 하나를 같은 가능성으로 택함)')
