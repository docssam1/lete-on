"""Independent surface-coordinate check for the source net, not a publisher key."""
from fractions import Fraction as F

# Cube vertices: the top net cell is marked with four source letters.  The
# second coordinate runs from its near edge to its far edge; the third is height.
vertices = {
    "g": (0, 0, 1), "r": (0, 1, 1), "n": (1, 0, 1), "d": (1, 1, 1),
    "m": (0, 0, 0), "ng": (0, 1, 0), "b": (1, 0, 0), "s": (1, 1, 0),
}
# Corners are top-left, top-right, bottom-right, bottom-left in the flat net.
cells = {
    (0, 0): ("b", "m", "g", "n"),
    (1, 0): ("m", "ng", "r", "g"),
    (1, 1): ("g", "r", "d", "n"),
    (2, 1): ("r", "ng", "s", "d"),
    (2, 2): ("d", "s", "b", "n"),
    (3, 2): ("s", "ng", "m", "b"),
}
for (x, y), corners in cells.items():
    assert len(set(corners)) == 4
    if (x + 1, y) in cells:
        other = cells[x + 1, y]
        assert (corners[1], corners[2]) == (other[0], other[3])
    if (x, y + 1) in cells:
        other = cells[x, y + 1]
        assert (corners[3], corners[2]) == (other[0], other[1])
assert len({tuple(sorted(c)) for c in cells.values()}) == 6

# Source boundary joins g to the midpoint of r--ng, then to the midpoint
# of d--s, and finally n. Its plane is height = 1 - depth/2.
def level(point):
    _, depth, height = point
    return F(height) + F(depth, 2) - 1

def crossing(a, b):
    pa, va = a
    pb, vb = b
    t = va / (va - vb)
    return (tuple(x + t * (y - x) for x, y in zip(pa, pb)), F(0))

def shade_polygon(names):
    uv = [(F(0), F(0)), (F(1), F(0)), (F(1), F(1)), (F(0), F(1))]
    polygon = [(p, level(vertices[name])) for p, name in zip(uv, names)]
    out = []
    for a, b in zip(polygon, polygon[1:] + polygon[:1]):
        if a[1] <= 0:
            out.append(a)
        if (a[1] < 0 < b[1]) or (b[1] < 0 < a[1]):
            out.append(crossing(a, b))
    return {p for p, _ in out}

h = F(1, 2)
expected = {
    (0, 0): {(0, 0), (1, 0), (1, 1), (0, 1)},
    (1, 0): {(0, 0), (1, 0), (1, h), (0, 1)},
    (1, 1): {(0, 0), (0, 1)},  # boundary only: no filled area
    (2, 1): {(h, 0), (1, 0), (1, 1), (h, 1)},
    (2, 2): {(h, 0), (1, 0), (1, 1), (0, 1)},
    (3, 2): {(0, 0), (1, 0), (1, 1), (0, 1)},
}
for cell, corners in cells.items():
    assert shade_polygon(corners) == expected[cell], (cell, shade_polygon(corners))
print("PASS: six-face edge matching and midpoint shading propagation; publisher key not checked")
