"""Finite exact-rule assembly search for unit squares and unit triangles.

Assemblies use complete equal-length edges, are connected, and cannot overlap
in their interiors. Regular-tile placements use floating coordinates rounded
to 1e-7 to collapse equivalent vertices from repeated fixed-angle rotations.
Shape identity is the union outline, not internal seams; rigid rotation and
reflection of the whole outline are equivalent. Counts are exhaustive within
this finite coordinate model and should be reconciled with source keys before
being treated as source answers.
"""
from collections import Counter
from itertools import combinations
from math import cos, hypot, pi, sin

EPS = 1e-8
ROOT3 = 3 ** 0.5

TILES = {
    "square": ((0.0, 0.0), (1.0, 0.0), (1.0, 1.0), (0.0, 1.0)),
    "right-isosceles": ((0.0, 0.0), (1.0, 0.0), (0.0, 1.0)),
    "equilateral": ((0.0, 0.0), (1.0, 0.0), (0.5, ROOT3 / 2)),
}


def _point(p):
    # Rotating a regular polygon through several 30/45/60-degree placements
    # can produce equivalent coordinates that differ by a few 1e-8.  Seven
    # decimal places keeps contact geometry precise while collapsing that
    # accumulated floating-point noise during outline canonicalization.
    return tuple(round(v, 7) for v in p)


def _edge(a, b):
    a, b = _point(a), _point(b)
    return tuple(sorted((a, b)))


def _poly_edges(poly):
    return {_edge(poly[i], poly[(i + 1) % len(poly)]) for i in range(len(poly))}


def _transform(p, origin, ux, uy, reflect):
    dx, dy = p[0] - origin[0], p[1] - origin[1]
    x = dx * ux[0] + dy * ux[1]
    y = dx * uy[0] + dy * uy[1]
    if reflect:
        y = -y
    return _point((x, y))


def _canonical_polygons(polygons):
    anchors = [edge for poly in polygons for edge in _poly_edges(poly)]
    forms = []
    for edge in anchors:
        for start, end in (edge, edge[::-1]):
            dx, dy = end[0] - start[0], end[1] - start[1]
            length = hypot(dx, dy)
            if length < EPS:
                continue
            ux = (dx / length, dy / length)
            uy = (-ux[1], ux[0])
            for reflect in (False, True):
                transformed = []
                for poly in polygons:
                    transformed.append(tuple(sorted(_transform(p, start, ux, uy, reflect)
                                                    for p in poly)))
                forms.append(tuple(sorted(transformed)))
    return min(forms)


def _canonical_outline(polygons):
    counts = Counter(e for poly in polygons for e in _poly_edges(poly))
    boundary = [e for e, n in counts.items() if n == 1]
    anchors = boundary or [e for poly in polygons for e in _poly_edges(poly)]
    forms = []
    for edge in anchors:
        for start, end in (edge, edge[::-1]):
            dx, dy = end[0] - start[0], end[1] - start[1]
            length = hypot(dx, dy)
            ux = (dx / length, dy / length)
            uy = (-ux[1], ux[0])
            for reflect in (False, True):
                forms.append(tuple(sorted(tuple(sorted(_transform(p, start, ux, uy, reflect)
                                                        for p in e)) for e in boundary)))
    return min(forms)


def _projection(poly, axis):
    values = [x * axis[0] + y * axis[1] for x, y in poly]
    return min(values), max(values)


def _interiors_overlap(a, b):
    for poly in (a, b):
        for e in _poly_edges(poly):
            (x1, y1), (x2, y2) = e
            axis = (y2 - y1, x1 - x2)
            alo, ahi = _projection(a, axis)
            blo, bhi = _projection(b, axis)
            if min(ahi, bhi) - max(alo, blo) <= EPS:
                return False
    return True


def _place_tile(tile_type, source_edge, target_edge):
    source, target = TILES[tile_type], target_edge
    a, b = source_edge
    u, v = target
    sx, sy = b[0] - a[0], b[1] - a[1]
    tx, ty = v[0] - u[0], v[1] - u[1]
    slen, tlen = hypot(sx, sy), hypot(tx, ty)
    if abs(slen - tlen) > EPS:
        return None
    angle = __import__('math').atan2(ty, tx) - __import__('math').atan2(sy, sx)
    c, s = cos(angle), sin(angle)
    moved = []
    for x, y in source:
        dx, dy = x - a[0], y - a[1]
        moved.append(_point((u[0] + c * dx - s * dy, u[1] + s * dx + c * dy)))
    return tuple(moved)


def _assembly_candidates(polygons, tile_type):
    exposed_counts = Counter(e for poly in polygons for e in _poly_edges(poly))
    exposed = [e for e, n in exposed_counts.items() if n == 1]
    tile = TILES[tile_type]
    tile_edges = list(_poly_edges(tile))
    candidates = {}
    for target in exposed:
        for source_edge in tile_edges:
            if abs(hypot(target[1][0] - target[0][0], target[1][1] - target[0][1]) -
                   hypot(source_edge[1][0] - source_edge[0][0], source_edge[1][1] - source_edge[0][1])) > EPS:
                continue
            for source_order in (source_edge, source_edge[::-1]):
                for target_order in (target, target[::-1]):
                    candidate = _place_tile(tile_type, source_order, target_order)
                    if candidate is None:
                        continue
                    candidate = tuple(_point(p) for p in candidate)
                    if any(_interiors_overlap(candidate, old) for old in polygons):
                        continue
                    candidates.setdefault(tuple(sorted(candidate)), candidate)
    return list(candidates.values())


def enumerate_outlines(counts):
    """Enumerate unique union outlines for a small multiset of tile types."""
    counts = {k: int(v) for k, v in counts.items() if int(v) > 0}
    if not counts or any(k not in TILES for k in counts):
        return [], {"partitions": 0, "uniqueOutlines": 0, "placementChecks": 0}
    start_type = sorted(counts)[0]
    remaining = tuple(sorted((k, v - (1 if k == start_type else 0)) for k, v in counts.items()))
    initial = (TILES[start_type],)
    states = {_canonical_polygons(initial): (initial, remaining)}
    checks = 0
    total = sum(counts.values())
    for _ in range(1, total):
        next_states = {}
        for polygons, rem in states.values():
            for tile_type, left in rem:
                if left <= 0:
                    continue
                for candidate in _assembly_candidates(polygons, tile_type):
                    checks += 1
                    new_polys = tuple(sorted((*polygons, candidate), key=lambda p: tuple(sorted(p))))
                    new_rem = tuple((k, n - (1 if k == tile_type else 0)) for k, n in rem)
                    key = _canonical_polygons(new_polys)
                    next_states.setdefault(key, (new_polys, new_rem))
        states = next_states
    outlines = {}
    for polygons, _ in states.values():
        outlines.setdefault(_canonical_outline(polygons), polygons)
    ordered = [(outline, outlines[outline]) for outline in sorted(outlines)]
    return ordered, {"validEdgeConnectedPartitions": len(states),
                     "uniqueOutlines": len(ordered), "placementChecks": checks}


def tray(counts):
    parts = []
    i = 0
    for kind, count in sorted(counts.items()):
        for _ in range(count):
            x = 10 + i * 48
            if kind == 'square':
                shape = f'<polygon points="{x},10 {x+32},10 {x+32},42 {x},42"'
            elif kind == 'right-isosceles':
                shape = f'<polygon points="{x},42 {x+32},42 {x},10"'
            else:
                shape = f'<polygon points="{x},42 {x+32},42 {x+16},14"'
            parts.append(shape + ' fill="#fff" stroke="#38584f" stroke-width="2"/>')
            i += 1
    width = max(50, 16 + i * 48)
    return (f'<svg viewBox="0 0 {width} 52" role="img" aria-label="주어진 도형 조각들">'
            + ''.join(parts) + '</svg>')


def gallery(outlines):
    figures = []
    for n, (outline, _polygons) in enumerate(outlines, 1):
        pts = [p for edge in outline for p in edge]
        minx, maxx = min(x for x, _ in pts), max(x for x, _ in pts)
        miny, maxy = min(y for _, y in pts), max(y for _, y in pts)
        width, height = maxx - minx, maxy - miny
        scale = min(170 / max(width, 1), 118 / max(height, 1))
        lines = []
        for edge in outline:
            (x1, y1), (x2, y2) = edge
            ax, ay = 10 + (x1 - minx) * scale, 10 + (maxy - y1) * scale
            bx, by = 10 + (x2 - minx) * scale, 10 + (maxy - y2) * scale
            lines.append(f'<line x1="{ax:.2f}" y1="{ay:.2f}" x2="{bx:.2f}" y2="{by:.2f}"/>')
        svg = (f'<svg viewBox="0 0 190 138" role="img" aria-label="{n}번째 붙인 모양">'
               '<g fill="none" stroke="#38584f" stroke-width="2.4" stroke-linejoin="round">'
               + ''.join(lines) + '</g></svg>')
        figures.append(f'<figure><figcaption>{n}</figcaption>{svg}</figure>')
    return '<div class="partition-gallery polyiamond-gallery">' + ''.join(figures) + '</div>'

