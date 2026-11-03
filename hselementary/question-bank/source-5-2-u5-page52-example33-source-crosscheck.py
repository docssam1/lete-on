"""Independently map the six midpoint segments onto the original net.

The diagram coordinates below are read from the source, not from a generator.
The publisher's answer and an approved public problem/answer figure remain unverified.
"""
from collections import Counter, defaultdict

# Cube: A-B-C-D across the top; E-F-G-H directly below.
vertices = {'A': (0,0,1), 'B': (1,0,1), 'C': (1,1,1), 'D': (0,1,1),
            'E': (0,0,0), 'F': (1,0,0), 'G': (1,1,0), 'H': (0,1,0)}
# Net cells and their corners in top-left, top-right, bottom-right, bottom-left order.
faces = {'top': ((1,0), 'ADCB'), 'center': ((1,1), 'BCGF'),
         'left': ((0,1), 'ABFE'), 'right': ((2,1), 'CDHG'),
         'far_right': ((3,1), 'DAEH'), 'bottom': ((1,2), 'FGHE')}
midpoints = {'ㄱ': 'AD', 'ㄴ': 'DC', 'ㄷ': 'CG', 'ㄹ': 'GF', 'ㅁ': 'FE', 'ㅂ': 'EA'}
segments = {'top': 'ㄱㄴ', 'center': 'ㄷㄹ', 'left': 'ㅁㅂ',
            'right': 'ㄴㄷ', 'far_right': 'ㅂㄱ', 'bottom': 'ㄹㅁ'}
# Use half-cell integer coordinates so no rounding enters the comparison.
corner_offsets = ((0,0), (2,0), (2,2), (0,2))
projected = {}
physical_edges = defaultdict(list)
for name, ((x,y), corners) in faces.items():
    assert len(set(corners)) == 4
    projected[name] = {v: (2*x+dx,2*y+dy) for v,(dx,dy) in zip(corners,corner_offsets)}
    for i in range(4):
        a,b = corners[i], corners[(i+1)%4]
        physical_edges[frozenset((a,b))].append((name, frozenset((projected[name][a],projected[name][b]))))
assert len(physical_edges) == 12 and all(len(v) == 2 for v in physical_edges.values())
assert len({frozenset(corners) for _,corners in faces.values()}) == 6
# All five shared paper edges must represent the same actual cube edge.
shared = [edge for edges in physical_edges.values() for edge in [edges]
          if edge[0][1] == edge[1][1]]
assert len(shared) == 5

def midpoint(a,b):
    assert all((x+y)%2 == 0 for x,y in zip(a,b))
    return tuple((x+y)//2 for x,y in zip(a,b))

projected_segments = {}
for face, labels in segments.items():
    corners = faces[face][1]
    edge_set = {frozenset((corners[i],corners[(i+1)%4])) for i in range(4)}
    points = []
    for label in labels:
        a,b = midpoints[label]
        assert frozenset((a,b)) in edge_set
        points.append(midpoint(projected[face][a],projected[face][b]))
    projected_segments[face] = tuple(points)
expected = {'top': ((3,0),(4,1)), 'center': ((4,3),(3,4)),
            'left': ((1,4),(0,3)), 'right': ((5,2),(4,3)),
            'far_right': ((8,3),(7,2)), 'bottom': ((3,4),(2,5))}
assert projected_segments == expected
assert Counter(''.join(segments.values())) == Counter({p:2 for p in midpoints})
# Independently confirm six distinct edge midpoints and a single closed line on the cube.
mid3d = {p: tuple(vertices[a][i]+vertices[b][i] for i in range(3))
         for p,(a,b) in midpoints.items()}
assert len(set(mid3d.values())) == 6
links = {frozenset(pair) for pair in segments.values()}
assert links == {frozenset(pair) for pair in ('ㄱㄴ','ㄴㄷ','ㄷㄹ','ㄹㅁ','ㅁㅂ','ㅂㄱ')}
print('PASS: source cube and net have the same 12 edges; all six segments and duplicated cut-edge midpoints form one closed 3-D path. Publisher answer and public figures remain unverified.')
