from collections import deque
from itertools import permutations, product

neg = lambda v: tuple(-x for x in v)
add = lambda a, b: tuple(x + y for x, y in zip(a, b))
sub = lambda a, b: tuple(x - y for x, y in zip(a, b))
cross = lambda a, b: (a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0])
cells = {(0, 0), (1, 0), (1, 1), (2, 1), (2, 2), (3, 2)}
faces = {(0, 0): ((0, 0, 0), (1, 0, 0), (0, 1, 0), (0, 0, 1))}
queue = deque(faces)
while queue:
    x, y = queue.popleft()
    origin, right, down, normal = faces[x, y]
    neighbors = [(1, 0, (add(origin, right), neg(normal), down, right)),
                 (-1, 0, (sub(origin, normal), normal, down, neg(right))),
                 (0, 1, (add(origin, down), right, neg(normal), down)),
                 (0, -1, (sub(origin, normal), right, normal, neg(down)))]
    for dx, dy, face in neighbors:
        cell = (x + dx, y + dy)
        if cell in cells and cell not in faces:
            faces[cell] = face
            queue.append(cell)
assert len(faces) == 6 and len({f[3] for f in faces.values()}) == 6
for a, b in [((0, 0), (2, 1)), ((1, 0), (2, 2)), ((1, 1), (3, 2))]:
    assert faces[a][3] == neg(faces[b][3])
axes = [(1, 0, 0), (0, 1, 0), (0, 0, 1)]
rotations = []
for axes_order in permutations(axes):
    for signs in product((-1, 1), repeat=3):
        basis = [tuple(sign * v for v in axis) for axis, sign in zip(axes_order, signs)]
        if cross(basis[0], basis[1]) == basis[2]:
            rotations.append(basis)
assert len(rotations) == 24
print("Page 52 Example 3-4: net folds into six faces, three opposite pairs and 24 rotations; choices unverified.")
