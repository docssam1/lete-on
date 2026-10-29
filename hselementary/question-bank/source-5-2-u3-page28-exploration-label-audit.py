"""Coordinate check of one source-label interpretation, not a publisher answer."""
import math

rad = math.radians
D, N = (0., 0.), (-1., 0.)
length = 1 / (2 * math.cos(rad(65)))
G = (N[0] + length * math.cos(rad(65)), length * math.sin(rad(65)))


def rotate(p, degrees):
    c, s = math.cos(rad(degrees)), math.sin(rad(degrees))
    return (p[0] * c - p[1] * s, p[0] * s + p[1] * c)


def sub(a, b):
    return (a[0] - b[0], a[1] - b[1])


def cross(a, b):
    return a[0] * b[1] - a[1] * b[0]


def angle(a, vertex, b):
    u, v = sub(a, vertex), sub(b, vertex)
    cosine = (u[0]*v[0] + u[1]*v[1]) / (math.hypot(*u) * math.hypot(*v))
    return math.degrees(math.acos(max(-1., min(1., cosine))))


def intersect(a, b, c, d):
    u, v = sub(b, a), sub(d, c)
    t = cross(sub(c, a), v) / cross(u, v)
    k = cross(sub(c, a), u) / cross(u, v)
    return (a[0]+t*u[0], a[1]+t*u[1]), t, k


R, M = rotate(G, -20), rotate(N, -20)
B, t, k = intersect(G, D, R, M)
assert 0 < t < 1 and 0 < k < 1
for a,b in ((math.dist(G,N),math.dist(R,M)), (math.dist(N,D),math.dist(M,D)),
            (math.dist(D,G),math.dist(D,R)), (math.dist(G,N),math.dist(G,D)),
            (math.dist(R,M),math.dist(R,D))):
    assert abs(a-b) < 1e-10
assert abs(angle(G,N,D)-65) < 1e-9
assert abs(angle(M,B,D)-70) < 1e-9
assert abs(angle(D,G,R)-80) < 1e-9
assert N[0] < G[0] < D[0] and R[1] > G[1] and M[1] > N[1]
print('The label interpretation produces congruent isosceles triangles, the printed angles and an 80-degree target; publisher key not checked.')
