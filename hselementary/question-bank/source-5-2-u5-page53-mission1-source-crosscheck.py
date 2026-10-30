from collections import deque

neg = lambda v: tuple(-x for x in v)
add = lambda a, b: tuple(x+y for x, y in zip(a, b))
sub = lambda a, b: tuple(x-y for x, y in zip(a, b))
cells = {(0, 0), (1, 0), (1, 1), (2, 1), (3, 1), (3, 2)}
faces = {(0, 0): ((0, 0, 0), (1, 0, 0), (0, 1, 0), (0, 0, 1))}
queue = deque(faces)
while queue:
    x, y = queue.popleft()
    origin, right, down, normal = faces[x, y]
    neighbors = [(1, 0, (add(origin, right), neg(normal), down, right)),
                 (-1, 0, (sub(origin, normal), normal, down, neg(right))),
                 (0, 1, (add(origin, down), right, neg(normal), down)),
                 (0, -1, (sub(origin, normal), right, normal, neg(down)))]
    for dx, dy, transform in neighbors:
        cell = (x+dx, y+dy)
        if cell in cells and cell not in faces:
            faces[cell] = transform
            queue.append(cell)
assert len(faces) == 6 and len({face[3] for face in faces.values()}) == 6
# Intersect each folded face with x = 1/2, the plane fixed by the given line.
intersections = {}
for cell, (origin, right, down, _) in faces.items():
    corners = [origin[0], origin[0]+right[0], origin[0]+right[0]+down[0], origin[0]+down[0]]
    if min(corners) < 0.5 < max(corners):
        intersections[cell] = 'vertical' if right[0] else 'horizontal'
assert intersections == {(0, 0): 'vertical', (1, 1): 'horizontal',
                         (2, 1): 'horizontal', (3, 1): 'horizontal'}
print('Page 53 Mission 1: given line and three other face midlines checked; official key unverified.')
