from collections import deque
from itertools import product
from math import gcd

# Read left-to-right, top-to-bottom from the printed net.
cells = {(0, 0): 2, (1, 0): 6, (1, 1): 8, (2, 1): 12, (2, 2): 10, (3, 2): 4}
neg = lambda vector: tuple(-x for x in vector)
orientations = {(1, 1): ((1, 0, 0), (0, 1, 0), (0, 0, 1))}
queue = deque(orientations)
while queue:
    x, y = queue.popleft()
    right, down, normal = orientations[x, y]
    for dx, dy, new in ((1, 0, (neg(normal), down, right)), (-1, 0, (normal, down, neg(right))),
                        (0, 1, (right, neg(normal), down)), (0, -1, (right, normal, neg(down)))):
        neighbor = (x + dx, y + dy)
        if neighbor in cells and neighbor not in orientations:
            orientations[neighbor] = new
            queue.append(neighbor)
lookup = {orientation[2]: cells[cell] for cell, orientation in orientations.items()}
assert len(lookup) == 6
products = sorted(lookup[x, 0, 0]*lookup[0, y, 0]*lookup[0, 0, z]
                  for x, y, z in product((-1, 1), repeat=3))
assert products == [48, 80, 96, 160, 288, 480, 576, 960]
assert gcd(products[1], products[-4]) == 16
print('Page 53 Mission 3: folded net, eight vertex products and gcd 16; official key unverified.')
