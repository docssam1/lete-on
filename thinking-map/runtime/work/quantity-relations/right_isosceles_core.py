"""Exact assembly enumeration for congruent right-isosceles triangle pieces.

Triangles have integer-lattice vertices and legs of length one. Assemblies
must be edge-connected, use each piece once, and have disjoint interiors.
The displayed/countable shape is the union outline: internal seams do not
make two otherwise identical outlines different. Whole-shape rotations and
reflections are identified.
"""
from collections import Counter
from itertools import combinations, product
from math import hypot


def triangle(x, y, sx, sy):
    """Unit right-isosceles triangle with right-angle vertex (x,y)."""
    return tuple(sorted(((x, y), (x + sx, y), (x, y + sy))))


def edges(shape):
    return {tuple(sorted(pair)) for pair in combinations(shape, 2)}


def _projection_overlap(a, b, axis):
    pa = [x * axis[0] + y * axis[1] for x, y in a]
    pb = [x * axis[0] + y * axis[1] for x, y in b]
    return min(max(pa), max(pb)) - max(min(pa), min(pb))


def interiors_overlap(a, b):
    """SAT for exact convex triangles; touching at edges/points is allowed."""
    for shape in (a, b):
        ordered = list(shape)
        for i in range(3):
            x1, y1 = ordered[i]
            x2, y2 = ordered[(i + 1) % 3]
            normal = (y2 - y1, x1 - x2)
            if _projection_overlap(a, b, normal) <= 0:
                return False
    return True


def _transform_point(point, turns, reflected):
    x, y = point
    if reflected:
        x = -x
    for _ in range(turns):
        x, y = -y, x
    return x, y


def _normalize_edges(edge_set, turns, reflected):
    moved = [tuple(_transform_point(p, turns, reflected) for p in edge)
             for edge in edge_set]
    points = [p for edge in moved for p in edge]
    min_x = min(x for x, _ in points)
    min_y = min(y for _, y in points)
    return tuple(sorted(tuple(sorted((x - min_x, y - min_y) for x, y in edge))
                        for edge in moved))


def boundary(assembly):
    counts = Counter(edge for part in assembly for edge in edges(part))
    return {edge for edge, count in counts.items() if count == 1}


def canonical_outline(assembly):
    outline = boundary(assembly)
    return min(_normalize_edges(outline, turns, reflected)
               for reflected in (False, True) for turns in range(4))


def _canonical_partition(assembly):
    forms = []
    for reflected in (False, True):
        for turns in range(4):
            moved = [tuple(sorted(_transform_point(p, turns, reflected) for p in part))
                     for part in assembly]
            points = [p for part in moved for p in part]
            min_x = min(x for x, _ in points)
            min_y = min(y for _, y in points)
            forms.append(tuple(sorted(tuple((x - min_x, y - min_y) for x, y in part)
                                      for part in moved)))
    return min(forms)


def enumerate_shapes(piece_count):
    """Return unique union outlines and deterministic search counters."""
    if piece_count < 1:
        return [], {"candidatePlacementsChecked": 0, "partitions": 0}

    bound = piece_count + 1
    candidates = {triangle(x, y, sx, sy)
                  for x in range(-bound, bound + 1)
                  for y in range(-bound, bound + 1)
                  for sx, sy in product((-1, 1), repeat=2)}
    first = triangle(0, 0, 1, 1)
    states = {_canonical_partition((first,)): (first,)}
    checks = 0

    for _size in range(2, piece_count + 1):
        following = {}
        for assembly in states.values():
            used = set(assembly)
            exposed = boundary(assembly)
            for candidate in candidates:
                if candidate in used:
                    continue
                checks += 1
                if not (edges(candidate) & exposed):
                    continue
                if any(interiors_overlap(candidate, part) for part in assembly):
                    continue
                grown = tuple(sorted((*assembly, candidate)))
                following.setdefault(_canonical_partition(grown), grown)
        states = following

    outlines = {}
    for assembly in states.values():
        outlines.setdefault(canonical_outline(assembly), assembly)
    ordered = [(outline, outlines[outline]) for outline in sorted(outlines)]
    return ordered, {"candidatePlacementsChecked": checks,
                     "validEdgeConnectedPartitions": len(states),
                     "uniqueOutlines": len(ordered)}


def tray(piece_count):
    parts = []
    for index in range(piece_count):
        x = 8 + index * 42
        parts.append(f'<polygon points="{x},36 {x+28},36 {x},8" '
                     'fill="#eef5df" stroke="#38584f" stroke-width="2"/>')
    width = 16 + piece_count * 42
    return (f'<svg viewBox="0 0 {width} 44" role="img" '
            f'aria-label="같은 크기의 직각이등변삼각형 {piece_count}개">'
            + ''.join(parts) + '</svg>')


def gallery(outlines):
    figures = []
    for number, (outline, _assembly) in enumerate(outlines, 1):
        points = [p for edge in outline for p in edge]
        min_x = min(x for x, _ in points)
        min_y = min(y for _, y in points)
        max_x = max(x for x, _ in points)
        max_y = max(y for _, y in points)
        width = max_x - min_x
        height = max_y - min_y
        scale = min(170 / max(width, 1), 115 / max(height, 1))
        segments = []
        for edge in outline:
            (x1, y1), (x2, y2) = edge
            sx1 = 10 + (x1 - min_x) * scale
            sy1 = 10 + (max_y - y1) * scale
            sx2 = 10 + (x2 - min_x) * scale
            sy2 = 10 + (max_y - y2) * scale
            segments.append(f'<line x1="{sx1:.2f}" y1="{sy1:.2f}" '
                            f'x2="{sx2:.2f}" y2="{sy2:.2f}"/>')
        svg = (f'<svg viewBox="0 0 190 135" role="img" '
               f'aria-label="{number}번째 직각이등변삼각형 붙이기 모양">'
               '<g fill="none" stroke="#38584f" stroke-width="2.5" '
               'stroke-linecap="round" stroke-linejoin="round">'
               + ''.join(segments) + '</g></svg>')
        figures.append(f'<figure><figcaption>{number}</figcaption>{svg}</figure>')
    return '<div class="partition-gallery polyiamond-gallery">' + ''.join(figures) + '</div>'

