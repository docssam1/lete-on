"""Independently fold the numbered cube nets on source page 113."""
from itertools import combinations, product
from pathlib import Path
import runpy

fold = runpy.run_path(str(Path(__file__).with_name('source-5-2-u5-check110-net-audit.py')))['fold']


def opposite_pairs(net):
    frames = fold(set(net.values()))
    assert frames is not None
    normals = {label: frames[pos][2] for label, pos in net.items()}
    return {frozenset((a, b)) for a, b in combinations(net, 2)
            if sum(x*y for x, y in zip(normals[a], normals[b])) == -1}


source41 = {1: (0, 0), 2: (1, 0), 3: (1, 1), 4: (2, 1), 5: (2, 2), 6: (3, 2)}
second41 = {5: (0, 1), 'g': (1, 1), 'n': (2, 1), 'd': (3, 1), 1: (1, 0), 'r': (2, 2)}
assert opposite_pairs(source41) == {frozenset(pair) for pair in ((1, 4), (2, 5), (3, 6))}
assert opposite_pairs(second41) == {frozenset(pair) for pair in ((5, 'n'), ('g', 'd'), (1, 'r'))}
# The opposite pairs force n=2 and r=4. The remaining g and d are 3 and 6.
assert 2*3*6 == 36

source42 = {6: (0, 1), 3: (1, 1), 2: (2, 1), 1: (2, 0), 5: (2, 2), 4: (3, 2)}
pairs42 = opposite_pairs(source42)
assert pairs42 == {frozenset(pair) for pair in ((6, 2), (3, 4), (1, 5))}
assert max(map(sum, product(*[tuple(pair) for pair in pairs42]))) == 15

source46 = {4: (0, 1), 2: (1, 1), 5: (2, 1), 6: (3, 1), 1: (1, 0), 3: (1, 2)}
pairs46 = opposite_pairs(source46)
assert pairs46 == {frozenset(pair) for pair in ((4, 5), (2, 6), (1, 3))}
assert max(a*b*c for a, b, c in product(*[tuple(pair) for pair in pairs46])) == 90
print('PASS: page 113 numbered nets 41=36, 42=15, 46=90')
