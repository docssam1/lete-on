#!/usr/bin/env python3
"""Brute force the source's face constraints without importing the generator."""
from collections import Counter
from itertools import permutations

# Tuple order: right, left, front, back, top, bottom.
# Source does not say that the six dice have identical handedness, so retain
# every assignment consistent with distinct 1..6 and opposite-face sums.
states = [p for p in permutations(range(1, 7))
          if p[0]+p[1] == p[2]+p[3] == p[4]+p[5] == 7]
assert len(states) == 48
by_face = [{v: [p for p in states if p[i] == v] for v in range(1, 7)} for i in range(6)]
counts = Counter()
elbow_front = Counter()
for end in by_face[0][2]:               # printed outer right = 2
    for row2 in by_face[0][8-end[1]]:
        for row1 in by_face[0][8-row2[1]]:
            for elbow in by_face[0][8-row1[1]]:
                if elbow[4] != 4:       # printed top = 4
                    continue
                required = 8-elbow[2]
                for branch in by_face[3].get(required, []):
                    for blank in by_face[3].get(8-branch[2], []):
                        counts[blank[2]] += 1
                        elbow_front[elbow[2]] += 1
assert counts == {4: 32768}, counts
assert set(elbow_front) == {6}, elbow_front
print(f"PASS: {len(states)} valid face assignments per die; {sum(counts.values())} source-consistent six-die assignments; answer distribution {dict(counts)}; elbow front {dict(elbow_front)}")

# Also test identical physical dice of either handedness. Generate the 24
# orientations by proper quarter-turns, then count the six-die arrangements.
def quarter_x(p):
    right, left, front, back, top, bottom = p
    return right, left, bottom, top, front, back
def quarter_y(p):
    right, left, front, back, top, bottom = p
    return bottom, top, front, back, right, left
def orientations(first):
    result, pending = {first}, [first]
    while pending:
        item = pending.pop()
        for new in (quarter_x(item), quarter_y(item)):
            if new not in result:
                result.add(new)
                pending.append(new)
    return result
family = orientations(states[0])
other = orientations(next(s for s in states if s not in family))
assert len(family) == len(other) == 24 and family.isdisjoint(other)
family_tallies = []
for family_set in (family, other):
    indexes = [{v: [p for p in family_set if p[i] == v] for v in range(1, 7)} for i in range(6)]
    tally = Counter()
    for end in indexes[0][2]:
        for row2 in indexes[0][8-end[1]]:
            for row1 in indexes[0][8-row2[1]]:
                for elbow in indexes[0][8-row1[1]]:
                    if elbow[4] != 4:
                        continue
                    for branch in indexes[3].get(8-elbow[2], []):
                        for blank in indexes[3].get(8-branch[2], []):
                            tally[blank[2]] += 1
    assert not tally or set(tally) == {4}, tally
    family_tallies.append(tally[4])
    print("PASS: identical-dice handedness family, 24 orientations, answer distribution", dict(tally))
assert sorted(family_tallies) == [0, 1024]
print("LIMIT: assumes the printed numbers and adjacency were transcribed correctly; publisher answer key is unverified.")
