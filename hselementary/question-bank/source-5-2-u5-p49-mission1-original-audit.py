"""Audit for 5-2-u5-e1-mission-1 (Mission 1, PDF p.45 / printed p.49).

Source figure: a cuboid with drawn lines giving 5 columns (unequal widths) x
3 rows x 3 depth layers. Same wording as 예제 1-1. Clarification used: count
every cuboid bounded by the drawn lines and count the undivided whole once.
Unequal column widths do not change the count: any choice of two planes in each
direction bounds a cuboid.
"""
from itertools import combinations, product
from math import comb

X, Y, Z = 5, 3, 3
# Column widths measured from the source drawing (relative px); only the number
# of planes matters, but check that unequal widths keep every box a cuboid.
widths = [123, 87, 120, 143, 110]
assert len(widths) == X
xs = [0]
for w in widths:
    xs.append(xs[-1] + w)

boxes = list(product(*(list(combinations(range(n + 1), 2)) for n in (X, Y, Z))))
assert len(set(boxes)) == len(boxes)
# every chosen pair gives positive extents -> a genuine cuboid
assert all(xs[e] - xs[s] > 0 for (s, e), _, _ in boxes)

by_size = sum((X - w + 1) * (Y - h + 1) * (Z - d + 1)
              for w in range(1, X + 1) for h in range(1, Y + 1) for d in range(1, Z + 1))
cells = list(product(range(X), range(Y), range(Z)))
spans = {(a, b) for a in cells for b in cells if all(a[i] <= b[i] for i in range(3))}

assert len(boxes) == by_size == len(spans) == comb(6, 2) * comb(4, 2) * comb(4, 2) == 540
assert sum(1 for bx in boxes if all(e - s == 1 for s, e in bx)) == 45   # literal smallest pieces
assert len(boxes) - 1 == 539                                            # whole excluded

print('PASS Mission 1: 5x3x3 grid -> 540 cuboids (incl. whole); alternatives 45 / 539 excluded by clarification.')
