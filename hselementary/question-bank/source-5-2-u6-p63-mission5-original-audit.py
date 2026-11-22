"""Audit: 5-2-u6-e3-mission-5 (printed p63, pdf p59) 편의점을 한 번만 지나는 왕복.
Figure (printed lines only): 집-편의점 3갈래, 편의점-공원 4갈래, 집-공원(편의점을 거치지 않음) 2갈래.
Run: python3 -I source-5-2-u6-p63-mission5-original-audit.py
"""
from itertools import product

EDGES = [('H', 'S', i) for i in range(3)] + [('S', 'P', i) for i in range(4)] + [('H', 'P', i) for i in range(2)]

def nbrs(v):
    for a, b, i in EDGES:
        if a == v: yield b, (a, b, i)
        elif b == v: yield a, (a, b, i)

def simple_paths(src, dst):
    out = []
    def go(v, seen, path, edges):
        if v == dst:
            out.append((tuple(path), tuple(edges))); return
        for w, e in nbrs(v):
            if w not in seen:
                go(w, seen | {w}, path + [w], edges + [e])
    go(src, {src}, [src], [])
    return out

go_legs, back_legs = simple_paths('H', 'P'), simple_paths('P', 'H')
assert len(go_legs) == 3 * 4 + 2 == len(back_legs) == 14
count = 0
for g, b in product(go_legs, back_legs):
    visits = g[0][1:-1].count('S') + b[0][1:-1].count('S')
    if visits == 1:
        count += 1
print('clarified model (갈 때·올 때 각각 되돌아가지 않는 한 번의 이동):', count)
assert count == 3 * 4 * 2 + 2 * 4 * 3 == 48

# Why a clarification is shown: unrestricted walks H->...->P->...->H with S exactly once
# grow without bound as the allowed number of roads grows (e.g. extra H-P-H back-and-forth).
def walks_with_one_S(max_len):
    total = 0
    def go(v, length, reached_p, s_count):
        nonlocal total
        if s_count > 1: return
        if v == 'H' and reached_p and s_count == 1 and length > 0:
            total += 1
        if length == max_len: return
        for w, _ in nbrs(v):
            go(w, length + 1, reached_p or w == 'P', s_count + (w == 'S'))
    go('H', 0, False, 0)
    return total
growth = [walks_with_one_S(n) for n in (3, 5, 7)]
print('unrestricted walk counts (len<=3,5,7):', growth)
assert growth[0] == 48 and growth[0] < growth[1] < growth[2]
print('OK unique answer 48 under one-pass-each-way reading')
