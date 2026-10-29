#!/usr/bin/env python3
"""Cross-check opposite pairs by adjacency and construct actual rotations."""
from collections import deque
from itertools import combinations

views = (("라","나","바"), ("다","라","마"), ("가","나","다"))
labels = set("가나다라마바")
adjacent = {frozenset(pair) for view in views for pair in combinations(view,2)}
def matchings(remaining):
    if not remaining:
        yield ()
        return
    first = min(remaining)
    for second in remaining-{first}:
        if frozenset((first,second)) not in adjacent:
            for tail in matchings(remaining-{first,second}):
                yield ((first,second),)+tail
pairs = list(matchings(labels))
assert len(pairs) == 1, pairs
lookup = {a:b for pair in pairs[0] for a,b in (pair,pair[::-1])}
assert tuple(lookup[x] for x in ("가","나","다")) == ("라","마","바")
assert {next(iter(pair-{"나"})) for pair in adjacent if "나" in pair} == {"라","바","가","다"}
assert {next(iter(pair-{"라"})) for pair in adjacent if "라" in pair} == {"나","바","다","마"}

# Construct a concrete labelled cube from first view and pairing, then
# generate its rotation group with two quarter-turns.
# Tuple positions: +x,-x,+y,-y,+z,-z; top +z, front -y, right +x.
initial = ("바","다","마","나","라","가")
def turn_y(s): return (s[4],s[5],s[2],s[3],s[1],s[0])
def turn_z(s): return (s[3],s[2],s[0],s[1],s[4],s[5])
rotations, queue = {initial}, deque([initial])
while queue:
    current = queue.popleft()
    for result in (turn_y(current),turn_z(current)):
        if result not in rotations:
            rotations.add(result)
            queue.append(result)
assert len(rotations) == 24
for view in views:
    assert sum((s[4],s[3],s[0]) == view for s in rotations) == 1, view
print("PASS: adjacency forces",pairs[0],"; one explicitly constructed cube realizes all three views in 24 proper rotations")
print("LIMIT: the nine glyph readings are inputs; publisher key is not verified.")
