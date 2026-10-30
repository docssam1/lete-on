from collections import deque
from fractions import Fraction as F

neg = lambda v: tuple(-x for x in v)
add = lambda a, b: tuple(x+y for x, y in zip(a, b))
sub = lambda a, b: tuple(x-y for x, y in zip(a, b))
cells = {(0, 0), (1, 0), (2, 0), (2, 1), (3, 1), (4, 1)}
faces = {(2, 1): ((0, 0, 0), (1, 0, 0), (0, 1, 0), (0, 0, 1))}
queue = deque(faces)
while queue:
    x, y = queue.popleft()
    o, r, d, n = faces[x, y]
    neighbors = [(1, 0, (add(o, r), neg(n), d, r)), (-1, 0, (sub(o, n), n, d, neg(r))),
                 (0, 1, (add(o, d), r, neg(n), d)), (0, -1, (sub(o, n), r, n, neg(d)))]
    for dx, dy, transform in neighbors:
        cell = (x+dx, y+dy)
        if cell in cells and cell not in faces:
            faces[cell] = transform
            queue.append(cell)
assert len(faces) == 6 and len({face[3] for face in faces.values()}) == 6
expected = {(0, 0): [((F(1, 2), 0), (F(1, 2), 1))],
            (1, 0): [((F(1, 2), 0), (F(1, 2), 1))],
            (2, 0): [((F(1, 2), 0), (F(1, 2), 1))],
            (2, 1): [((0, F(1, 2)), (F(1, 2), 1)), ((F(1, 2), 0), (1, F(1, 2)))],
            (3, 1): [((0, F(1, 2)), (1, F(1, 2)))],
            (4, 1): [((0, F(1, 2)), (F(1, 2), 0)), ((F(1, 2), 1), (1, F(1, 2)))]}
for cell, (o, r, d, _) in faces.items():
    segments = []
    for target in (F(-1, 2), F(1, 2)):
        points = set()
        for u in (F(0), F(1)):
            coefficient = d[0]-d[1]
            if coefficient:
                v = (target-(o[0]-o[1])-(r[0]-r[1])*u)/coefficient
                if 0 <= v <= 1: points.add((u, v))
        for v in (F(0), F(1)):
            coefficient = r[0]-r[1]
            if coefficient:
                u = (target-(o[0]-o[1])-(d[0]-d[1])*v)/coefficient
                if 0 <= u <= 1: points.add((u, v))
        if len(points) == 2:
            segments.append(tuple(sorted(points)))
    assert sorted(segments) == sorted(tuple(sorted(pair)) for pair in expected[cell]), cell
print('Page 53 Mission 6: two given midpoint lines propagate over the folded net; official key unverified.')
