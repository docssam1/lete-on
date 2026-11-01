"""Cross-check enumerated cuts with direct Euclidean isometries."""
from pathlib import Path
from runpy import run_path

original = run_path(str(Path(__file__).with_name('source-5-2-u3-e8-mission3-dot-cut-audit.py')))
all_paths = original['paths']
paths = [
    ((0,0),(4,2)), ((0,0),(1,1),(3,1),(4,2)), ((0,0),(3,1),(1,1),(4,2)),
    ((1,0),(3,2)), ((1,0),(1,1),(3,1),(3,2)), ((1,0),(3,1),(1,1),(3,2)),
    ((2,0),(2,2)), ((2,0),(1,1),(3,1),(2,2)), ((4,1),(0,1))
]

def same_shape(a, b):
    if len(a) != len(b):
        return False
    ux, uy = a[1][0]-a[0][0], a[1][1]-a[0][1]
    for direction in (b, b[::-1]):
        for shift in range(len(b)):
            q = direction[shift:] + direction[:shift]
            vx, vy = q[1][0]-q[0][0], q[1][1]-q[0][1]
            if ux*ux+uy*uy != vx*vx+vy*vy:
                continue
            for reflected in (False, True):
                uy1 = -uy if reflected else uy
                dot, cross = ux*vx+uy1*vy, ux*vy-uy1*vx
                length = ux*ux+uy1*uy1
                if all(((p[0]-a[0][0])*dot - ((-1 if reflected else 1)*(p[1]-a[0][1]))*cross == (r[0]-q[0][0])*length and
                        (p[0]-a[0][0])*cross + ((-1 if reflected else 1)*(p[1]-a[0][1]))*dot == (r[1]-q[0][1])*length)
                       for p, r in zip(a, q)):
                    return True
    return False

pieces = []
for path in paths:
    assert path in all_paths, f'not a valid cut: {path}'
    a, b = all_paths[path]
    assert same_shape(a, b), f'pieces do not match: {path}'
    assert all(not same_shape(a, old) for old in pieces), f'duplicate example shape: {path}'
    pieces.append(a)
assert len(all_paths) == 38 and len(pieces) == 9
for a, b in all_paths.values():
    assert same_shape(a, b)
    assert sum(same_shape(a, candidate) for candidate in pieces) == 1
for excluded in (1, 2, 7):
    assert len([piece for i, piece in enumerate(pieces) if i != excluded]) == 8
print('PASS: 38 cuts, 9 unique congruent shapes; 3 examples leave 8 classes')
