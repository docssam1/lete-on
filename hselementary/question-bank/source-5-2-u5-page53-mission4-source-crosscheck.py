from collections import deque

neg = lambda v: tuple(-x for x in v)
add = lambda a, b: tuple(x+y for x, y in zip(a, b))
sub = lambda a, b: tuple(x-y for x, y in zip(a, b))
cells = {(1, 0), (1, 1), (2, 1), (3, 1), (0, 2), (1, 2)}
# Origin, right, down and outward normal on each folded unit square.
faces = {(0, 2): ((0, 0, 0), (1, 0, 0), (0, 1, 0), (0, 0, 1))}
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
def point(cell, u, v):
    origin, right, down, _ = faces[cell]
    return tuple(origin[i] + u*right[i] + v*down[i] for i in range(3))
front = (point((0, 2), 0, 0), point((0, 2), 1, 1))
side = (point((1, 2), 0, 1), point((1, 2), 1, 0))
top = (point((1, 1), 1, 1), point((1, 1), 0, 0))
assert front[1] == side[0] and side[1] == top[0] and top[1] == front[0]
assert len(set(front + side + top)) == 3
print('Page 53 Mission 4: three face diagonals form one closed triangle; publisher key unverified.')
