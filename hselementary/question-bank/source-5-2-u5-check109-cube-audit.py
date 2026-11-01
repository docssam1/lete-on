"""Independent aligned-cube packing audit for printed page 109, question 13.

The target is 5×5×4. For a face-parallel tiling with integer side lengths,
a generic line from the box boundary to any cube face passes only through
integer-length cubes, so every cube face has an integer coordinate. Enumerating
the integer positions therefore covers every such tiling. Rotated non-aligned
arrangements and the publisher's answer are outside this audit.
"""
from itertools import product


def cells(x, y, z, side):
    return sum(1 << ((x + dx) * 20 + (y + dy) * 4 + z + dz)
               for dx, dy, dz in product(range(side), repeat=3))


def placements(side):
    return [(x, y, z, cells(x, y, z, side))
            for x, y, z in product(range(6 - side), range(6 - side), range(5 - side))]


def maximum_disjoint(cubes):
    compatible = [sum(1 << j for j, other in enumerate(cubes)
                      if i != j and not (cube[3] & other[3]))
                  for i, cube in enumerate(cubes)]
    best = 0

    def search(remaining, count):
        nonlocal best
        if count + bin(remaining).count('1') <= best:
            return
        while remaining:
            if count + bin(remaining).count('1') <= best:
                return
            bit = remaining & -remaining
            index = bit.bit_length() - 1
            remaining ^= bit
            search(remaining & compatible[index], count + 1)
        best = max(best, count)

    search((1 << len(cubes)) - 1, 0)
    return best


twos, threes = placements(2), placements(3)
assert len(twos) == 48 and len(threes) == 18
# Two 3-cubes must overlap: the box is shorter than 6 on every axis.
assert all(a[3] & b[3] for i, a in enumerate(threes) for b in threes[i + 1:])
without_three = maximum_disjoint(twos)
with_three = max(maximum_disjoint([two for two in twos if not two[3] & three[3]])
                 for three in threes)
assert (without_three, with_three) == (8, 6)
# An explicit optimal arrangement, given by lower corner and side length.
example = [(0, 2, 1, 3), (0, 0, 2, 2), (1, 0, 0, 2), (2, 0, 2, 2),
           (3, 1, 0, 2), (3, 3, 0, 2), (3, 3, 2, 2)]
occupied = 0
for x, y, z, side in example:
    assert 0 <= x <= 5-side and 0 <= y <= 5-side and 0 <= z <= 4-side
    cube = cells(x, y, z, side)
    assert not occupied & cube
    occupied |= cube
assert bin(occupied).count('1') == 75
assert min(100-8*without_three, 100-27-8*with_three) == 25
print('PASS: aligned tilings need at least 25 unit cubes; explicit packing attains 25')
