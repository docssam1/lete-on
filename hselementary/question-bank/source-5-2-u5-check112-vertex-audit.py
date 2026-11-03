"""Fold the source net and identify coincident vertices for page 112, no. 33."""
from collections import deque


def negative(v):
    return tuple(-i for i in v)


def add(a, b):
    return tuple(x + y for x, y in zip(a, b))


faces = {(0, 1), (1, 1), (2, 1), (3, 1), (1, 0), (1, 2)}
# Each frame stores the origin, right vector, down vector and outward normal.
frames = {(1, 1): ((0, 0, 0), (1, 0, 0), (0, 1, 0), (0, 0, 1))}
queue = deque(frames)
while queue:
    x, y = queue.popleft()
    origin, u, v, normal = frames[x, y]
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        position = (x + dx, y + dy)
        if position not in faces or position in frames:
            continue
        if dx == 1:
            new_u, new_v, new_normal = negative(normal), v, u
            new_origin = add(origin, u)
        elif dx == -1:
            new_u, new_v, new_normal = normal, v, negative(u)
            new_origin = add(origin, negative(new_u))
        elif dy == 1:
            new_u, new_v, new_normal = u, negative(normal), v
            new_origin = add(origin, v)
        else:
            new_u, new_v, new_normal = u, normal, negative(v)
            new_origin = add(origin, negative(new_v))
        frames[position] = (new_origin, new_u, new_v, new_normal)
        queue.append(position)


def vertex(face, dx, dy):
    origin, u, v, _ = frames[face]
    return add(add(origin, tuple(dx*i for i in u)), tuple(dy*i for i in v))


assert len(frames) == 6
# Eight boxes in the source: top pair, left pair, right pair, bottom pair.
boxes = [((1, 0), 0, 0), ((1, 0), 1, 0), ((0, 1), 0, 0), ((0, 1), 0, 1),
         ((3, 1), 1, 0), ((3, 1), 1, 1), ((1, 2), 0, 1), ((1, 2), 1, 1)]
source_labels = {(0, 0, -1): 'giyeok', (1, 0, -1): 'rieul',
                 (0, 1, -1): 'mieum', (1, 1, -1): 'ieung'}
result = [source_labels[vertex(face, dx, dy)] for face, dx, dy in boxes]
assert result == ['giyeok', 'rieul', 'giyeok', 'mieum',
                  'giyeok', 'mieum', 'mieum', 'ieung']
print('PASS: page 112 net vertices', result)
