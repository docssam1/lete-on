"""Exact free-polyiamond enumeration on the triangular lattice.

Each cell is one unit equilateral triangle. Assemblies grow only by a complete
shared side, cannot overlap, and are canonicalized under the six rotations and
six reflections of the triangular lattice.
"""
from collections import Counter
from itertools import combinations, product
from math import sqrt


def cell(i, j, orientation):
    if orientation == 0:
        return tuple(sorted(((i, j), (i + 1, j), (i, j + 1))))
    return tuple(sorted(((i + 1, j), (i, j + 1), (i + 1, j + 1))))


def transform_point(point, turns, reflected):
    i, j = point
    if reflected:
        i, j = i + j, -j
    for _ in range(turns):
        i, j = -j, i + j
    return i, j


def edges(triangle):
    return {tuple(sorted(pair)) for pair in combinations(triangle, 2)}


def boundary(triangles):
    counts = Counter(edge for triangle in triangles for edge in edges(triangle))
    return {edge for edge, count in counts.items() if count == 1}


def canonical(triangles):
    forms = []
    for reflected in (False, True):
        for turns in range(6):
            points = [transform_point(p, turns, reflected) for t in triangles for p in t]
            top = min(i for i, _ in points)
            left = min(j for _, j in points)
            forms.append(tuple(sorted(tuple(sorted((transform_point(p, turns, reflected)[0] - top,
                                                     transform_point(p, turns, reflected)[1] - left)
                                                    for p in t)) for t in triangles)))
    return min(forms)


def enumerate_free(count):
    if count < 1:
        return []
    first = cell(0, 0, 0)
    states = {canonical([first]): [first]}
    placement_checks = 0
    for size in range(2, count + 1):
        following = {}
        for assembly in states.values():
            used = set(assembly)
            exposed = boundary(used)
            for i, j, orientation in product(range(-count, count + 1),
                                              range(-count, count + 1), range(2)):
                candidate = cell(i, j, orientation)
                if candidate in used:
                    continue
                placement_checks += 1
                if not (edges(candidate) & exposed):
                    continue
                new_assembly = list(used | {candidate})
                following.setdefault(canonical(new_assembly), new_assembly)
        states = following
    answer = [list(map(list, state)) for state in sorted(states)]
    return answer, placement_checks


def gallery(assemblies):
    figures = []
    for number, triangles in enumerate(assemblies, 1):
        all_points = [p for triangle in triangles for p in triangle]
        xs = [i + j / 2 for i, j in all_points]
        ys = [j * sqrt(3) / 2 for _, j in all_points]
        min_x, min_y = min(xs), min(ys)
        width = max(xs) - min_x
        height = max(ys) - min_y
        scale = min(170 / max(width, 1), 120 / max(height, 1))
        parts = []
        for triangle in triangles:
            coords = []
            for i, j in triangle:
                x = 10 + ((i + j / 2) - min_x) * scale
                y = 10 + (max(ys) - j * sqrt(3) / 2) * scale
                coords.append(f"{x:.2f},{y:.2f}")
            parts.append(f'<polygon points="{" ".join(coords)}" fill="#eef5df" stroke="#38584f" stroke-width="1.8"/>')
        figures.append(f'<figure><figcaption>{number}</figcaption><svg viewBox="0 0 190 140" role="img" aria-label="{number}번째 정삼각형 붙이기 모양">{"".join(parts)}</svg></figure>')
    return '<div class="partition-gallery polyiamond-gallery">' + ''.join(figures) + '</div>'


def tray(count):
    triangles = []
    for k in range(count):
        x = 8 + 42 * k
        triangles.append(f'<polygon points="{x},36 {x+18},5 {x+36},36" fill="#fff" stroke="#38584f" stroke-width="2"/>')
    width = 16 + count * 42
    return f'<svg viewBox="0 0 {width} 44" role="img" aria-label="같은 크기의 정삼각형 {count}개">{"".join(triangles)}</svg>'
