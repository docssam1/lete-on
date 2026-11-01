"""Fold the three source net diagrams on printed page 110 independently."""
from collections import deque


def neg(vector):
    return tuple(-value for value in vector)


def fold(shape):
    root = next(iter(shape))
    orientation = {root: ((1, 0, 0), (0, 1, 0), (0, 0, 1))}
    queue = deque([root])
    while queue:
        x, y = queue.popleft()
        u, v, normal = orientation[x, y]
        rotations = [((1, 0), (neg(normal), v, u)),
                     ((-1, 0), (normal, v, neg(u))),
                     ((0, 1), (u, neg(normal), v)),
                     ((0, -1), (u, normal, neg(v)))]
        for (dx, dy), frame in rotations:
            position = (x + dx, y + dy)
            if position not in shape:
                continue
            if position in orientation and orientation[position] != frame:
                return None
            if position not in orientation:
                orientation[position] = frame
                queue.append(position)
    if len(orientation) != len(shape) or len({frame[2] for frame in orientation.values()}) != len(shape):
        return None
    return orientation


base17 = {(2, 1), (3, 1), (1, 2), (2, 2), (1, 3)}
choices17 = {1: (1, 1), 2: (0, 2), 3: (0, 3), 4: (1, 4), 5: (2, 3),
             6: (3, 2), 7: (4, 1), 8: (3, 0), 9: (2, 0)}
assert [number for number, pos in choices17.items() if fold(base17 | {pos})] == [2, 3, 8, 9]

faces22 = {(-1, 0): 'ga', (0, 0): 'na', (1, 0): 'da', (0, 1): 'ra', (0, 2): 'ma'}
possible = set()
for x, y in faces22:
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        new = (x + dx, y + dy)
        if new not in faces22 and fold(set(faces22) | {new}):
            possible.add(faces22[x, y])
assert possible == {'ga', 'na', 'da', 'ma'}

faces24 = {1: (0, 1), 2: (1, 1), 3: (1, 2), 4: (2, 0), 5: (3, 0), 6: (2, 1)}
result24 = fold(set(faces24.values()))
shaded_normal = result24[faces24[2]][2]
perpendicular = [number for number, position in faces24.items()
                 if sum(a*b for a, b in zip(shaded_normal, result24[position][2])) == 0]
assert sorted(perpendicular) == [1, 3, 4, 6] and sum(perpendicular) == 14
print('PASS: page 110 nets 17, 22 and 24')
