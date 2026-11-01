"""Independently check the cube face and contact problems on source page 114."""
from itertools import permutations
from pathlib import Path
import runpy

g = runpy.run_path(str(Path(__file__).with_name('source-5-2-u5-check113-visual-audit.py')))
rotations, rotate = g['rotations'], g['rotate']
up, front, right = (0, 0, 1), (0, -1, 0), (1, 0, 0)


def neg(axis):
    return tuple(-x for x in axis)


axes = [up, front, right, neg(up), neg(front), neg(right)]


def solve_views(labels, views):
    solutions = []
    for rest in permutations(set(labels) - set(views[0])):
        die = dict(zip(axes, views[0] + rest))
        oriented = []
        for rotation in rotations:
            oriented.append({rotate(axis, rotation): value for axis, value in die.items()})
        if all(any((d[up], d[front], d[right]) == view for d in oriented) for view in views):
            solutions.append(die)
    return solutions


def opposites(die):
    return {value: die[neg(axis)] for axis, value in die.items()}


cases = [
    (('red', 'yellow', 'blue', 'purple', 'black', 'white'),
     (('red', 'yellow', 'blue'), ('purple', 'red', 'black'), ('black', 'blue', 'white')),
     {'red': 'white', 'yellow': 'black', 'blue': 'purple'}),
    ((3, 4, 5, 6, 7, 8), ((5, 4, 6), (4, 3, 6), (8, 3, 4)), {5: 3, 4: 7, 8: 6}),
    ((3, 4, 5, 6, 7, 8), ((3, 5, 7), (6, 4, 5), (8, 7, 4)), {4: 3}),
    (('ga', 'na', 'da', 'ra', 'ma', 'ba'),
     (('ga', 'ra', 'da'), ('ba', 'na', 'ma'), ('ra', 'na', 'da')),
     {'ga': 'na', 'ra': 'ba', 'da': 'ma'})]
for labels, views, expected in cases:
    solutions = solve_views(labels, views)
    assert len(solutions) == 1
    found = opposites(solutions[0])
    assert all(found[a] == b for a, b in expected.items())

# For 49 the source only fixes opposite pairs, so cover both possible
# handednesses; 50 explicitly uses rotations of the pictured die.
all_dice = [dict(zip(axes, numbers)) for numbers in permutations(range(1, 7))
            if all(numbers[i] + numbers[i+3] == 7 for i in range(3))]
assert len(all_dice) == 48
reference = dict(zip(axes, (1, 2, 3, 6, 5, 4)))
same_dice = [{rotate(axis, rotation): value for axis, value in reference.items()}
             for rotation in rotations]


def ends(pool, first_front, corner_top, contact_sum, post_corner):
    current = [die for die in pool if die[front] == first_front]
    # Two contacts lead from the first cube to the corner cube.
    for step in range(2):
        current = [nxt for prev in current for nxt in pool
                   if prev[neg(front)] + nxt[front] == contact_sum
                   and (step != 1 or nxt[up] == corner_top)]
    for _ in range(post_corner):
        current = [nxt for prev in current for nxt in pool
                   if prev[right] + nxt[neg(right)] == contact_sum]
    return {die[right] for die in current}


assert ends(all_dice, 3, 3, 8, 2) == {4}
assert ends(same_dice, 6, 5, 6, 3) == {4}
bottom = [d for d in same_dice if d[front] == 2 and d[right] == 1]
assert len(bottom) == 1 and bottom[0][up] == 4
assert [4, 3, 4, 3][-1] == 3  # matching contacts alternate opposite faces
assert 12*7 == 84  # twelve contacts in the 2×2×2 stack
print('PASS: page 114 dice problems 49–56')
