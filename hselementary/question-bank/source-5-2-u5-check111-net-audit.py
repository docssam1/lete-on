"""Enumerate cube nets extending the four source squares on printed page 111."""
from pathlib import Path
import runpy

fold = runpy.run_path(str(Path(__file__).with_name('source-5-2-u5-check110-net-audit.py')))['fold']
base = {(1, 0), (2, 0), (0, 1), (1, 1)}


def grow(shape):
    return {frozenset(shape | {(x + dx, y + dy)})
            for x, y in shape for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))
            if (x + dx, y + dy) not in shape}


def canonical(shape):
    variants = []
    for reflected in (False, True):
        for turns in range(4):
            points = []
            for original_x, original_y in shape:
                x, y = (-original_x if reflected else original_x), original_y
                for _ in range(turns):
                    x, y = -y, x
                points.append((x, y))
            min_x = min(x for x, y in points)
            min_y = min(y for x, y in points)
            variants.append(tuple(sorted((x-min_x, y-min_y) for x, y in points)))
    return min(variants)


expanded = set()
for first in grow(base):
    expanded.update(grow(set(first)))
valid = [shape for shape in expanded if fold(shape)]
assert len(expanded) == 46
assert len(valid) == 15
assert len({canonical(shape) for shape in valid}) == 7
print('PASS: 46 placements, 15 valid placements, 7 distinct cube nets')
