"""Audit for 5-2-u5-e1-example-1 (예제 1-1, PDF p.44 / printed p.48).

Source figure: a cuboid divided by drawn lines into 4 (가로) x 3 (높이) x 3 (깊이)
equal cubes. Question: 그어진 선을 따라 나눌 때 몇 개의 크고 작은 직육면체로 나눌 수
있는가? Clarification used: count every cuboid bounded by the drawn lines
(cubes included) and count the undivided whole once.
"""
from itertools import combinations, product
from math import comb

X, Y, Z = 4, 3, 3

# 1) Plane-pair enumeration.
boxes = list(product(*(list(combinations(range(n + 1), 2)) for n in (X, Y, Z))))
assert len(set(boxes)) == len(boxes)
whole = ((0, X), (0, Y), (0, Z))
assert whole in boxes

# 2) Independent count by box size: sum over (w,h,d) of placements.
by_size = sum((X - w + 1) * (Y - h + 1) * (Z - d + 1)
              for w in range(1, X + 1) for h in range(1, Y + 1) for d in range(1, Z + 1))

# 3) Independent count via unions of unit cells: a set of unit cells is a
#    cuboid iff it equals the full box spanned by its min/max cells.
cells = list(product(range(X), range(Y), range(Z)))
spans = set()
for a in cells:
    for b in cells:
        if all(a[i] <= b[i] for i in range(3)):
            spans.add((a, b))

assert len(boxes) == by_size == len(spans) == comb(X + 1, 2) * comb(Y + 1, 2) * comb(Z + 1, 2) == 360

# Alternatives the clarification rules out (recorded, not answers):
unit_pieces = sum(1 for bx in boxes if all(e - s == 1 for s, e in bx))
assert unit_pieces == 36            # literal partition into smallest pieces
assert len(boxes) - 1 == 359        # if the undivided whole were excluded

print('PASS 예제 1-1: 4x3x3 grid -> 360 cuboids (incl. whole); alternatives 36 / 359 excluded by clarification.')
