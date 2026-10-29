#!/usr/bin/env python3
"""Construct a consistent 3x2x2 assignment using all printed visible pips."""
from collections import deque
from itertools import permutations, product

# Faces ordered x+, x-, y+, y-, z+, z-. y=0 is the front.
orientations = [p for p in permutations(range(1, 7))
                if p[0]+p[1] == p[2]+p[3] == p[4]+p[5] == 7]
assert len(orientations) == 48
cells = list(product(range(3), range(2), range(2)))
front = ((1, 6, 1), (5, 2, 5))  # rows top, bottom
side = ((5, 1), (2, 6))          # front, rear; top, bottom
domains = {}
for x, y, z in cells:
    domains[x,y,z] = [p for p in orientations
                      if (z != 1 or p[4] == 4)
                      and (y != 0 or p[3] == front[1-z][x])
                      and (x != 2 or p[0] == side[y][1-z])]

neighbors = {p: [] for p in cells}
for x,y,z in cells:
    for step, face, reverse in (((1,0,0),0,1), ((0,1,0),2,3), ((0,0,1),4,5)):
        q = (x+step[0],y+step[1],z+step[2])
        p = (x,y,z)
        if q in neighbors:
            neighbors[p].append((q,face,reverse))
            neighbors[q].append((p,reverse,face))

def propagate(d):
    queue = deque((p,q,i,j) for p in cells for q,i,j in neighbors[p])
    while queue:
        p,q,i,j = queue.popleft()
        supported = {state[j] for state in d[q]}
        filtered = [state for state in d[p] if state[i] in supported]
        if len(filtered) == len(d[p]):
            continue
        if not filtered:
            return None
        d[p] = filtered
        queue.extend((r,p,k,l) for r,k,l in neighbors[p] if r != q)
    return d

def find_witness(d):
    d = propagate(d)
    if d is None:
        return None
    unresolved = [p for p in cells if len(d[p]) > 1]
    if not unresolved:
        return {p: d[p][0] for p in cells}
    p = min(unresolved, key=lambda cell: len(d[cell]))
    for state in d[p]:
        candidate = dict(d)
        candidate[p] = [state]
        witness = find_witness(candidate)
        if witness is not None:
            return witness
    return None

witness = find_witness(domains)
assert witness is not None, "no arrangement matches all visible pips and contacts"
internal = sum(witness[p][i] for p in cells for q,i,j in neighbors[p] if p < q)
exterior = sum(state[face] for p,state in witness.items() for face,step in enumerate(
    ((1,0,0),(-1,0,0),(0,1,0),(0,-1,0),(0,0,1),(0,0,-1)))
    if tuple(p[k]+step[k] for k in range(3)) not in witness)
assert 12*21 - 2*internal == exterior == 116, (internal, exterior)
assert all(witness[p][i] == witness[q][j] for p in cells for q,i,j in neighbors[p])
print("PASS: all 16 visible faces and 20 equal-pip contacts coexist; one witness has internal contact sum", internal, "and exterior sum", exterior)
print("LIMIT: constructive existence check, not an exhaustive uniqueness proof; source-image interpretation and publisher answer remain unverified.")
