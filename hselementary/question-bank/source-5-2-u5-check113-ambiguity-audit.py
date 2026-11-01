"""Investigate the missing orientation cue in page 113 question 44."""
from pathlib import Path
import runpy

geometry = runpy.run_path(str(Path(__file__).with_name('source-5-2-u5-check113-visual-audit.py')))
fold, rotate, rotations = (geometry[name] for name in ('fold', 'rotate', 'rotations'))

net = {(0, 1): 'triangle', (1, 1): 'diamond', (2, 1): 'square', (3, 1): 'star',
       (1, 0): 'circle', (3, 2): 'two-rectangles'}
frames = fold(set(net))
possible = set()
for basis in rotations:
    positions = {rotate(normal, basis): (net[pos], rotate(u, basis))
                 for pos, (u, v, normal) in frames.items()}
    top, front, right = positions[(0, 0, -1)], positions[(0, 1, 0)], positions[(-1, 0, 0)]
    # The central line of the top diamond is parallel to the cube's front edge.
    if top[0] == 'diamond' and abs(top[1][0]) == 1:
        possible.add((front[0], right[0]))

assert possible == {('circle', 'triangle'), ('two-rectangles', 'square')}
print('PASS: two distinct front faces remain possible for the pictured top:', sorted(possible))

# Question 43: use inward-facing normals and fold the printed surface outward.
# With this convention, right x down is the inward normal.
from collections import deque
neg = lambda vec: tuple(-x for x in vec)
arrows = {(0, 1): (-1, 1), (1, 1): (1, 1), (2, 1): (-1, -1),
          (3, 1): (0, -1), (3, 0): (1, -1), (3, 2): (-1, 0)}
frames43 = {(3, 1): ((1, 0, 0), (0, -1, 0), (0, 0, -1))}
queue = deque(frames43)
while queue:
    x, y = queue.popleft()
    u, v, normal = frames43[x, y]
    moves = [((1, 0), (normal, v, neg(u))), ((-1, 0), (neg(normal), v, u)),
             ((0, 1), (u, normal, neg(v))), ((0, -1), (u, neg(normal), v))]
    for (dx, dy), frame in moves:
        pos = (x+dx, y+dy)
        if pos not in arrows:
            continue
        if pos in frames43:
            assert frames43[pos] == frame
        else:
            frames43[pos] = frame
            queue.append(pos)
assert len(frames43) == 6 and len({frame[2] for frame in frames43.values()}) == 6
cross = geometry['cross']
assert all(cross(u, v) == normal for u, v, normal in frames43.values())
compatible = []
for basis in rotations:
    positions = {}
    for pos, (u, v, normal) in frames43.items():
        dx, dy = arrows[pos]
        arrow = tuple(dx*u[i] + dy*v[i] for i in range(3))
        positions[rotate(normal, basis)] = (pos, rotate(arrow, basis))
    if positions[(0, 0, -1)][1] == (0, 1, 0) and positions[(0, 1, 0)][1] == (-1, 0, 0):
        compatible.append((positions[(0, 0, -1)], positions[(0, 1, 0)], positions[(-1, 0, 0)]))
assert compatible == [(((3, 1), (0, 1, 0)), ((3, 2), (-1, 0, 0)), ((0, 1), (0, -1, 1)))], compatible
print('PASS: question 43 has one compatible rotation; right arrow points toward top/front')
print('LIMIT: arrow readings are from the scans; publisher answer key is unverified')
