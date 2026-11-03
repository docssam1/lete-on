"""Check the oriented visible faces for page 113 questions 47 and 48."""
from itertools import product
from pathlib import Path
import runpy

fold = runpy.run_path(str(Path(__file__).with_name('source-5-2-u5-check110-net-audit.py')))['fold']
axes = [(1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)]


def dot(a, b):
    return sum(x*y for x, y in zip(a, b))


def cross(a, b):
    return (a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0])


rotations = [(x, y, cross(x, y)) for x, y in product(axes, repeat=2) if dot(x, y) == 0]
assert len(rotations) == 24


def rotate(vector, basis):
    return tuple(sum(vector[i]*basis[i][j] for i in range(3)) for j in range(3))


def views(net):
    frames = fold(set(net))
    assert frames is not None
    for basis in rotations:
        faces = {}
        for position, (u, v, normal) in frames.items():
            kind = net[position]
            stripe = rotate(u if kind == 'H' else v, basis)
            faces[rotate(normal, basis)] = (kind, stripe)
        # fold() uses the normal from right × down, which points into the
        # physical cube. Match visible faces to inward normals, preserving
        # handedness rather than reflecting the cube at the viewing step.
        yield faces[(0, 0, -1)], faces[(0, 1, 0)], faces[(-1, 0, 0)]


options47 = [
    {(0, 1): 'H', (1, 1): 'cross', (2, 1): 'H', (3, 1): 'H', (1, 0): 'diamond', (1, 2): 'empty'},
    {(0, 1): 'V', (1, 1): 'diamond', (2, 1): 'V', (2, 0): 'V', (3, 0): 'cross', (4, 0): 'V'},
    {(0, 1): 'H', (1, 1): 'H', (2, 1): 'cross', (3, 1): 'H', (2, 0): 'V', (2, 2): 'diamond'},
    {(0, 0): 'cross', (1, 0): 'H', (1, 1): 'H', (2, 1): 'diamond', (2, 2): 'H', (3, 2): 'H'},
    {(0, 0): 'V', (0, 1): 'H', (1, 1): 'diamond', (2, 1): 'H', (2, 2): 'V', (3, 2): 'cross'}]
matches47 = []
for number, net in enumerate(options47, 1):
    for top, front, right in views(net):
        if (top[0] == 'diamond' and front[0] in ('H', 'V') and right[0] in ('H', 'V')
                and abs(front[1][2]) == 1 and abs(right[1][2]) == 1):
            matches47.append(number)
assert matches47 == [4]

net48 = {(0, 1): 'H', (1, 1): 'X', (2, 1): 'empty',
         (3, 1): 'grid', (1, 0): 'circle', (2, 2): 'V'}
matches48 = set()
for top, front, right in views(net48):
    kinds = (top[0], front[0], right[0])
    if kinds == ('circle', 'X', 'grid'):
        matches48.add(1)
    if kinds == ('empty', 'X', 'circle'):
        matches48.add(2)
    if (top[0] in ('H', 'V') and front[0] in ('H', 'V') and right[0] == 'grid'
            and abs(top[1][1]) == 1 and abs(front[1][0]) == 1):
        matches48.add(3)
    if top[0] == 'grid' and front[0] in ('H', 'V') and right[0] == 'X' and abs(front[1][2]) == 1:
        matches48.add(4)
    if top[0] in ('H', 'V') and front[0] == 'circle' and right[0] == 'empty' and abs(top[1][0]) == 1:
        matches48.add(5)
assert matches48 == {3}
print('PASS: page 113 visual choices 47=4, 48=3; 24 proper cube rotations')
