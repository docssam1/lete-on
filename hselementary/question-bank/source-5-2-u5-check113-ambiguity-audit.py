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

# Question 43: test the provisional reading of the top arrow as pointing
# straight toward the back, and the front arrow as pointing left. The drawing
# may be schematic, so a failure flags the reading rather than the source.
arrows = {(0, 1): (-1, 1), (1, 1): (1, 1), (2, 1): (-1, -1),
          (3, 1): (0, -1), (3, 0): (1, -1), (3, 2): (-1, 0)}
arrow_frames = fold(set(arrows))
compatible = []
for basis in rotations:
    positions = {}
    for pos, (u, v, normal) in arrow_frames.items():
        dx, dy = arrows[pos]
        arrow = tuple(dx*u[i] + dy*v[i] for i in range(3))
        positions[rotate(normal, basis)] = rotate(arrow, basis)
    if positions[(0, 0, -1)] == (0, 1, 0) and positions[(0, 1, 0)] == (-1, 0, 0):
        compatible.append(basis)
assert not compatible
print('PASS: question 43 requires review of the provisional top-arrow interpretation')
