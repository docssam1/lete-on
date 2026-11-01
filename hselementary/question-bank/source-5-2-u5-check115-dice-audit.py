"""Check source page 115 cube nets and independently trace each roll."""
from itertools import permutations
from pathlib import Path
import runpy

fold = runpy.run_path(str(Path(__file__).with_name('source-5-2-u5-check110-net-audit.py')))['fold']


def opposites(net):
    frames = fold(set(net.values()))
    assert frames is not None
    normals = {value: frames[position][2] for value, position in net.items()}
    return {a: b for a, b in permutations(net, 2)
            if sum(x*y for x, y in zip(normals[a], normals[b])) == -1}


net58 = {1: (0, 2), 2: (1, 2), 3: (1, 1), 4: (2, 1), 5: (2, 0), 6: (3, 0)}
net59 = {5: (0, 0), 8: (0, 1), 6: (1, 1), 4: (2, 1), 7: (2, 2), 3: (3, 2)}
net60 = {7: (1, 0), 4: (0, 1), 1: (1, 1), 9: (2, 1), 5: (2, 2), 8: (3, 2)}
o58, o59, o60 = map(opposites, (net58, net59, net60))
assert 25 - sum(o58[n] for n in (1, 3, 5, 5, 3)) == o58[2]
tops59 = (3, 5, 8, 4, 4, 3, 6, 3, 7, 3, 5, 7, 3, 6, 8, 4)
assert sum(o59[n] for n in tops59) == 92
assert 36 - sum(o60[n] for n in (1, 5, 4, 9, 5)) == o60[8]
assert 2*(21-11) == 20


def trace(top, front, right, path):
    bottom, back, left = 7-top, 7-front, 7-right
    states = [(top, bottom)]
    for move in path:
        if move == 'R':
            top, bottom, right, left = left, right, top, bottom
        elif move == 'L':
            top, bottom, right, left = right, left, bottom, top
        elif move == 'F':
            top, bottom, front, back = back, front, top, bottom
        else:
            raise ValueError(move)
        states.append((top, bottom))
    return states


assert trace(2, 1, 3, 'RRFRF')[-1][0] == 2
net62 = {2: (0, 0), 3: (0, 1), 1: (1, 1), 4: (2, 1), 6: (3, 1), 5: (2, 2)}
assert opposites(net62) == {1: 6, 6: 1, 2: 5, 5: 2, 3: 4, 4: 3}
assert [b for _, b in trace(2, 3, 1, 'RRFRRFR')[1:]] == [1, 2, 3, 6, 4, 5, 1]
assert trace(2, 3, 1, 'RRFLLFF')[-1][0] == 4
assert [b for _, b in trace(6, 5, 3, 'RRRFFLL')] == [1, 3, 6, 4, 5, 3, 6, 4]
assert sum(b for _, b in trace(6, 5, 3, 'RRRFFLL')) == 32
print('PASS: page 115 cube nets, source paths and individual roll states')
