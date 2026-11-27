#!/usr/bin/env python3
"""Exact enumeration for connected equilateral-triangle assemblies.
Each triangle has edge labels 1,2,3 in cyclic order; in-plane rotations are allowed,
reflection/turning over is not. Coordinates use the triangular lattice (axial basis).
"""
from __future__ import annotations
from collections import defaultdict
from itertools import product
import math


def build_cells(radius: int):
    cells = {}
    for i in range(-radius, radius + 1):
        for j in range(-radius, radius + 1):
            cells[f"U{i},{j}"] = frozenset(((i, j), (i + 1, j), (i, j + 1)))
            cells[f"D{i},{j}"] = frozenset(((i + 1, j), (i, j + 1), (i + 1, j + 1)))
    edge_owners = defaultdict(list)
    for name, verts in cells.items():
        v = sorted(verts)
        for a, b in ((v[0], v[1]), (v[1], v[2]), (v[2], v[0])):
            edge_owners[frozenset((a, b))].append(name)
    adjacency = {name: set() for name in cells}
    for owners in edge_owners.values():
        if len(owners) == 2:
            a, b = owners
            adjacency[a].add(b)
            adjacency[b].add(a)
    return cells, adjacency


def connected_shapes(piece_count: int):
    """Enumerate all connected placements up to translation, rooted at U0,0."""
    cells, adjacency = build_cells(piece_count + 2)
    states = {frozenset(("U0,0",))}
    for _ in range(1, piece_count):
        next_states = set()
        for state in states:
            frontier = set().union(*(adjacency[name] for name in state)) - state
            for name in frontier:
                next_states.add(state | {name})
        states = next_states
    return cells, states


def ccw_edges(vertices):
    verts = list(vertices)
    cx = sum(x for x, _ in verts) / 3
    cy = sum(y for _, y in verts) / 3
    verts.sort(key=lambda p: math.atan2((p[1] - cy) * math.sqrt(3) / 2,
                                       (p[0] - cx) + (p[1] - cy) / 2))
    return [frozenset((verts[k], verts[(k + 1) % 3])) for k in range(3)]


def solve(piece_count: int):
    cells, shapes = connected_shapes(piece_count)
    best = -1
    best_cases = []
    feasible_labelings = 0
    checked_labelings = 0
    for shape in shapes:
        names = sorted(shape)
        edges = {name: ccw_edges(cells[name]) for name in names}
        owners = defaultdict(list)
        for name in names:
            for edge in edges[name]:
                owners[edge].append(name)
        shared = [edge for edge, own in owners.items() if len(own) == 2]
        outside = [edge for edge, own in owners.items() if len(own) == 1]
        assert len(shared) >= piece_count - 1, "connected assembly needs at least piece_count - 1 joins"
        for shifts in product(range(3), repeat=piece_count):
            checked_labelings += 1
            labels = {name: {edge: ((idx + shifts[k]) % 3) + 1
                             for idx, edge in enumerate(edges[name])}
                      for k, name in enumerate(names)}
            if any(labels[owners[e][0]][e] != labels[owners[e][1]][e] for e in shared):
                continue
            feasible_labelings += 1
            internal_labels = [labels[owners[e][0]][e] for e in shared]
            perimeter_labels = [labels[owners[e][0]][e] for e in outside]
            value = sum(perimeter_labels)
            assert value == 6 * piece_count - 2 * sum(internal_labels)
            record = {
                "cells": {name: [list(v) for v in sorted(cells[name])] for name in names},
                "edgeLabels": {name: [{"edge": [list(v) for v in sorted(edge)], "label": labels[name][edge]}
                                       for edge in edges[name]] for name in names},
                "sharedEdges": [{"edge": [list(v) for v in sorted(e)],
                                 "label": labels[owners[e][0]][e]} for e in shared],
                "boundaryLabels": perimeter_labels,
                "internalLabelSum": sum(internal_labels),
                "perimeterLabelSum": value,
                "rotationOnly": True,
                "reflectionForbidden": True,
            }
            if value > best:
                best, best_cases = value, [record]
            elif value == best:
                best_cases.append(record)
    return {
        "pieceCount": piece_count,
        "rootedConnectedPlacements": len(shapes),
        "candidateLabelingsChecked": checked_labelings,
        "compatibleLabelings": feasible_labelings,
        "maximumBoundaryLabelSum": best,
        "maximizingLabeledAssemblies": len(best_cases),
        "witness": best_cases[0],
        "proofIdentity": "boundary sum = 6*n - 2*sum(shared-edge labels)",
        "orientationRule": "cyclic edge-label orders only; rotations allowed; reflections forbidden",
    }


def svg_for(record, scale=66):
    """Render essential triangle geometry only; no explanatory labels or hints."""
    cells = {name: [tuple(v) for v in verts] for name, verts in record["cells"].items()}
    allv = set(v for verts in cells.values() for v in verts)
    def xy(p):
        x, y = p
        return (x + y / 2, -y * math.sqrt(3) / 2)
    pts = [xy(v) for v in allv]
    minx = min(x for x, _ in pts); maxx = max(x for x, _ in pts)
    miny = min(y for _, y in pts); maxy = max(y for _, y in pts)
    pad = 24
    width = (maxx - minx) * scale + 2 * pad
    height = (maxy - miny) * scale + 2 * pad
    def screen(p):
        x, y = xy(p)
        return (pad + (x - minx) * scale, pad + (y - miny) * scale)
    edge_to_owners = defaultdict(list)
    polygons=[]
    for name,verts in cells.items():
        pts2=[screen(v) for v in verts]
        polygons.append((name,pts2))
        for edge in record['edgeLabels'][name]:
            key=frozenset(tuple(v) for v in edge['edge'])
            edge_to_owners[key].append((name,edge['label']))
    out=[f'<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="{len(cells)}개의 정삼각형을 붙인 모양" viewBox="0 0 {width:.1f} {height:.1f}" style="width:min(100%,620px);height:auto">']
    for _,poly in polygons:
        points=' '.join(f'{x:.1f},{y:.1f}' for x,y in poly)
        out.append(f'<polygon points="{points}" fill="#fffdf6" stroke="#203a34" stroke-width="2.4" stroke-linejoin="round"/>')
    for edge, own in edge_to_owners.items():
        if len(own)==2:
            label=own[0][1]
            a,b=map(screen,edge)
            x=(a[0]+b[0])/2; y=(a[1]+b[1])/2
            out.append(f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="middle" dominant-baseline="central" font-size="17" font-weight="700" fill="#087b6b" stroke="#fff" stroke-width="4" paint-order="stroke">{label}</text>')
    for edge, own in edge_to_owners.items():
        if len(own)==1:
            a,b=map(screen,edge)
            x=(a[0]+b[0])/2; y=(a[1]+b[1])/2
            # move label a little toward centroid of the owner triangle
            verts=cells[own[0][0]]; cx=sum(screen(v)[0] for v in verts)/3; cy=sum(screen(v)[1] for v in verts)/3
            x=.72*x+.28*cx; y=.72*y+.28*cy
            out.append(f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="middle" dominant-baseline="central" font-size="17" font-weight="700" fill="#203a34">{own[0][1]}</text>')
    out.append('</svg>')
    return ''.join(out)


def detached_svg(piece_count, scale=66):
    """Draw identical labeled pieces as the task's essential input diagram."""
    tri_w=scale; tri_h=scale*math.sqrt(3)/2; gap=18; pad=20
    width=piece_count*tri_w+(piece_count-1)*gap+2*pad; height=tri_h+2*pad
    parts=[f'<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="변에 1, 2, 3이 적힌 정삼각형 {piece_count}개" viewBox="0 0 {width:.1f} {height:.1f}" style="width:min(100%,700px);height:auto">']
    for i in range(piece_count):
        x=pad+i*(tri_w+gap); top=(pad+tri_h*.08); left=x; right=x+tri_w; bottom=pad+tri_h
        cx=(left+right)/2
        pts=f'{cx:.1f},{top:.1f} {right:.1f},{bottom:.1f} {left:.1f},{bottom:.1f}'
        parts.append(f'<polygon points="{pts}" fill="#fffdf6" stroke="#203a34" stroke-width="2.4"/>')
        # top-left side=1, right side=2, base=3, each printed near its edge
        p1=((cx+left)/2-5,(top+bottom)/2); p2=((cx+right)/2+5,(top+bottom)/2); p3=(cx,bottom-6)
        for (lx,ly),n in zip((p1,p2,p3),(1,2,3)):
            parts.append(f'<text x="{lx:.1f}" y="{ly:.1f}" text-anchor="middle" dominant-baseline="central" font-size="16" font-weight="700" fill="#203a34" stroke="#fff" stroke-width="3" paint-order="stroke">{n}</text>')
    parts.append('</svg>')
    return ''.join(parts)

if __name__ == '__main__':
    import json
    for n in (4,5): print(json.dumps(solve(n),ensure_ascii=False))
