"""Audit for 5-2-u5-e2-exploration (개념탐구 2, PDF p.46 / printed p.50).

Source net form: a strip of four side faces with widths p, q, p, q (left to
right) and height r; one lid (p x q) hangs below the 2nd strip face and the other
lid hangs above the 4th strip face (both lids attach along a q-long edge, so
they stick out by p). Source drawing measures p:q:r ~ 115:160:211 ~ 3:4:5.

Clarification used: the paper is the rectangle that fits the net exactly (sides
parallel to the net). The paper size changes with which of 3, 4, 5 cm is put on
p, q, r; find the largest and smallest such paper perimeter.
"""
from itertools import permutations


def net_rects(p, q, r):
    """Faces as (x0, y0, x1, y1) with y downward; strip occupies y in [p, p+r]."""
    strip = []
    x = 0
    for w in (p, q, p, q):
        strip.append((x, p, x + w, p + r))
        x += w
    lid_low = (strip[1][0], p + r, strip[1][2], p + r + p)   # under 2nd face
    lid_high = (strip[3][0], 0, strip[3][2], p)              # above 4th face
    return strip, lid_low, lid_high


def fold_ok(p, q, r):
    strip, lo, hi = net_rects(p, q, r)
    faces = strip + [lo, hi]
    dims = sorted(tuple(sorted((x1 - x0, y1 - y0))) for x0, y0, x1, y1 in faces)
    want = sorted([tuple(sorted(d)) for d in [(p, q), (p, q), (q, r), (q, r), (p, r), (p, r)]])
    # each lid shares its full long edge with the q-wide strip face
    attach = (lo[2] - lo[0] == strip[1][2] - strip[1][0] == q) and (hi[2] - hi[0] == strip[3][2] - strip[3][0] == q)
    # no overlap between lids and strip (they lie outside the strip band)
    return dims == want and attach


def bbox_perimeter(p, q, r):
    strip, lo, hi = net_rects(p, q, r)
    faces = strip + [lo, hi]
    xs = [v for f in faces for v in (f[0], f[2])]
    ys = [v for f in faces for v in (f[1], f[3])]
    return 2 * ((max(xs) - min(xs)) + (max(ys) - min(ys)))


results = {}
for p, q, r in permutations((3, 4, 5)):
    assert fold_ok(p, q, r)
    per = bbox_perimeter(p, q, r)
    assert per == 2 * ((2 * p + 2 * q) + (r + 2 * p))
    results[(p, q, r)] = per

for k, v in sorted(results.items(), key=lambda kv: kv[1]):
    print('p,q,r =', k, '-> paper', 2 * k[0] + 2 * k[1], 'x', k[2] + 2 * k[0], 'perimeter', v)

assert max(results.values()) == 62 and min(results.values()) == 50
assert [k for k, v in results.items() if v == 62] == [(5, 4, 3)]
assert [k for k, v in results.items() if v == 50] == [(3, 4, 5)]
# The drawn source net (p:q:r ~ 3:4:5) is the smallest case.
assert results[(3, 4, 5)] == 50
print('PASS 개념탐구 2: largest paper perimeter 62 cm, smallest 50 cm (6 assignments checked).')
