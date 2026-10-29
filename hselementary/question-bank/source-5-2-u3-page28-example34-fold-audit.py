"""Independent geometry audit of the illustrated fold interpretation; no publisher key."""
import math


def reflect(p, a, b):
    vx, vy = b[0] - a[0], b[1] - a[1]
    t = ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / (vx * vx + vy * vy)
    return (2 * (a[0] + t * vx) - p[0], 2 * (a[1] + t * vy) - p[1])


def cross(a, b):
    return a[0] * b[1] - a[1] * b[0]


def sub(a, b):
    return (a[0] - b[0], a[1] - b[1])


def intersect(a, b, c, d):
    u, v = sub(b, a), sub(d, c)
    t = cross(sub(c, a), v) / cross(u, v)
    q = cross(sub(c, a), u) / cross(u, v)
    return (a[0] + t * u[0], a[1] + t * u[1]), t, q


def angle(a, vertex, b):
    u, v = sub(a, vertex), sub(b, vertex)
    return math.degrees(math.acos(max(-1, min(1, (u[0]*v[0] + u[1]*v[1]) / math.hypot(*u) / math.hypot(*v)))))


width = 1 / math.tan(math.radians(24))
g, n, d, l = (0., 1.), (0., 0.), (width, 0.), (width, 1.)
m = reflect(l, g, d)
b = reflect(m, n, d)
s, t1, t2 = intersect(g, m, n, d)
o, t3, t4 = intersect(g, d, s, b)
assert all(0 < t < 1 for t in (t1, t2, t3, t4))
assert math.dist(reflect(m, g, d), l) < 1e-9
assert math.dist(reflect(b, n, d), m) < 1e-9
assert math.dist(reflect(g, g, d), g) < 1e-9
assert math.dist(reflect(d, g, d), d) < 1e-9
assert math.dist(reflect(d, n, d), d) < 1e-9
assert abs(angle(b, o, d) - 72) < 1e-9
assert abs(angle(l, g, d) - 24) < 1e-9
assert abs(angle(n, s, g) - 48) < 1e-9
print('Fold interpretation: fixed crease endpoints and 72-degree target verified; publisher key not checked.')
