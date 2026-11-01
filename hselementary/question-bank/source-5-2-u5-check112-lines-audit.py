"""Check face and edge positions after folding page 112 source diagrams."""
from collections import deque


def neg(v):
    return tuple(-x for x in v)


def add(a, b):
    return tuple(x+y for x, y in zip(a, b))


def fold(cells, root):
    frames = {root: ((0, 0, 0), (1, 0, 0), (0, 1, 0), (0, 0, 1))}
    queue = deque(frames)
    while queue:
        x, y = queue.popleft()
        origin, u, v, normal = frames[x, y]
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            pos = (x+dx, y+dy)
            if pos not in cells or pos in frames:
                continue
            if dx == 1:
                a, b, c, new_origin = neg(normal), v, u, add(origin, u)
            elif dx == -1:
                a, b, c = normal, v, neg(u)
                new_origin = add(origin, neg(a))
            elif dy == 1:
                a, b, c, new_origin = u, neg(normal), v, add(origin, v)
            else:
                a, b, c = u, normal, neg(v)
                new_origin = add(origin, neg(b))
            frames[pos] = (new_origin, a, b, c)
            queue.append(pos)
    assert len(frames) == 6 and len({frame[3] for frame in frames.values()}) == 6
    return frames


def point(frame, x, y):
    origin, u, v, _ = frame
    return tuple(origin[i] + x*u[i] + y*v[i] for i in range(3))


f35 = fold({(0, 0), (1, 0), (2, 0), (2, 1), (3, 1), (4, 1)}, (2, 0))
assert point(f35[2, 0], 1, .5) == point(f35[3, 1], .5, 0)
assert point(f35[3, 1], 1, .5) == point(f35[4, 1], 0, .5)
assert point(f35[4, 1], .5, 0) == point(f35[2, 0], .5, 0)

f38 = fold({(0, 0), (1, 0), (1, 1), (2, 1), (3, 1), (2, 2)}, (1, 0))
assert point(f38[1, 0], 0, 1) == point(f38[1, 1], 0, 0)
assert point(f38[1, 1], 1, 1) == point(f38[2, 1], 0, 1)
assert point(f38[2, 1], 1, 0) == point(f38[1, 0], 1, 0)

f40 = fold({(0, 0), (0, 1), (1, 1), (2, 1), (3, 1), (2, 2)}, (1, 1))
assert point(f40[1, 1], .5, 1) == point(f40[2, 2], 0, .5)
assert point(f40[1, 1], 1, .5) == point(f40[2, 1], 0, .5)
assert f40[1, 1][3] == (0, 0, 1) and f40[2, 1][3] == (1, 0, 0)
assert f40[2, 2][3] == (0, 1, 0)
print('PASS: page 112 source line junctions and visible faces')
