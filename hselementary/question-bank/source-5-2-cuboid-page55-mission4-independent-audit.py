#!/usr/bin/env python3
"""Check the nine visible source faces against physically realizable dice."""
from itertools import permutations, product

# (top, front, right) read from the enlarged clean source image.
views = ((1,3,5),(1,2,3),(6,2,4))
# +x,-x,+y,-y,+z,-z. Opposite pairs have sum seven.
states = [p for p in permutations(range(1,7))
          if p[0]+p[1] == p[2]+p[3] == p[4]+p[5] == 7]
assert len(states) == 48
def turn_y(s): return (s[4],s[5],s[2],s[3],s[1],s[0])
def turn_z(s): return (s[3],s[2],s[0],s[1],s[4],s[5])
def orbit(start):
    seen, queue = {start}, [start]
    for s in queue:
        for t in (turn_y(s),turn_z(s)):
            if t not in seen:
                seen.add(t)
                queue.append(t)
    return seen
family = orbit(states[0])
other = orbit(next(s for s in states if s not in family))
assert len(family) == len(other) == 24 and family.isdisjoint(other)
matches = [[s for s in states if (s[4],s[3],s[0]) == view] for view in views]
assert all(len(group) == 1 for group in matches)
assert sorted(sum(any(s in family_set for s in group) for group in matches)
              for family_set in (family,other)) == [0,3]
hidden_sums = set()
for a,b,c in product(*matches):
    # The fourth die is wholly concealed and contributes all of its 21 pips.
    hidden_sums.add(sum(s[1]+s[2]+s[5] for s in (a,b,c)) + 21)
assert hidden_sums == {57}
assert sum(sum(view) for view in views) == 27
print("PASS: visible triples",views,"; each is a realizable die; same-die rotations are possible; hidden sum",hidden_sums)
print("LIMIT: visibility and source pip reading are inputs; publisher key and physical arrangement not independently verified.")
