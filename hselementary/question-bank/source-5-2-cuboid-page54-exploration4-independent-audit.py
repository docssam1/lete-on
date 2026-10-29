#!/usr/bin/env python3
"""Independently fold the printed net and roll the resulting oriented cube."""
import itertools
from collections import deque

net = {(0, 0): 2, (1, 0): 5, (1, 1): 4, (2, 1): 3, (2, 2): 1, (3, 2): 6}
neg = lambda a: tuple(-v for v in a)
frames = {(1, 1): ((0, 0, 1), (1, 0, 0), (0, 1, 0))}
q = deque(frames)
while q:
    x, y = q.popleft()
    n, u, v = frames[x, y]
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        p = x+dx, y+dy
        if p not in net:
            continue
        basis = ((u, neg(n), v) if dx == 1 else
                 (neg(u), n, v) if dx == -1 else
                 (v, u, neg(n)) if dy == 1 else (neg(v), u, n))
        if p in frames:
            assert frames[p] == basis
        else:
            frames[p] = basis
            q.append(p)
# The right/down cross product points into the folded cube when the printed
# side remains on the outside; reverse normals before testing handedness.
faces = {neg(frame[0]): net[cell] for cell, frame in frames.items()}
assert len(faces) == 6
assert {tuple(sorted((value, faces[neg(axis)]))) for axis, value in faces.items()} == {(1, 5), (2, 3), (4, 6)}

# Enumerate proper rotations, retaining the single orientation with top 4,
# front 1 and right 3 shown by the source illustration.
def determinant(cols):
    a, b, c = cols
    return a[0]*(b[1]*c[2]-b[2]*c[1])-b[0]*(a[1]*c[2]-a[2]*c[1])+c[0]*(a[1]*b[2]-a[2]*b[1])
axes = ((1,0,0), (-1,0,0), (0,1,0), (0,-1,0), (0,0,1), (0,0,-1))
states = []
for cols in itertools.permutations(axes, 3):
    if determinant(cols) != 1:
        continue
    rotate = lambda v: tuple(sum(v[i]*cols[i][j] for i in range(3)) for j in range(3))
    state = {rotate(axis): value for axis, value in faces.items()}
    if state[(0,0,1)] == 4 and state[(0,-1,0)] == 1 and state[(1,0,0)] == 3:
        states.append(state)
assert len(states) == 1
state = states[0]
# Rotate each outward face normal geometrically on each tip; no generator
# roll mapping or precomputed answer is imported.
rotations = {
    "R": lambda p: (p[2], p[1], -p[0]),
    "L": lambda p: (-p[2], p[1], p[0]),
    "F": lambda p: (p[0], -p[2], p[1]),
}
bottoms = []
for move in "RRRFLFR":
    state = {rotations[move](axis): value for axis, value in state.items()}
    bottoms.append(state[(0,0,-1)])
assert bottoms == [3,4,2,1,4,3,1] and sum(bottoms) == 18
print("PASS: independent net fold, unique proper starting orientation, seven geometric rolls:", bottoms, "sum", sum(bottoms))
print("LIMIT: source transcription and initial view are inputs; publisher answer key not verified.")
