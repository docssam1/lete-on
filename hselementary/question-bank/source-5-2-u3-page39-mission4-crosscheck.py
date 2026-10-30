from pathlib import Path
import runpy

directory = Path(__file__).parent
data = runpy.run_path(str(directory / 'source-5-2-u3-e8-mission4-triangle-cut-audit.py'))
congruent = runpy.run_path(str(directory / 'source-5-2-u3-page39-mission3-crosscheck.py'))['congruent']
paths, shapes, adj, boundary = (data[k] for k in ('paths', 'shapes', 'adj', 'boundary'))
representatives = [paths[path][0] for path in shapes.values()]
assert len(paths) == 7 and len(representatives) == 4
for i, piece in enumerate(representatives):
    assert all(not congruent(piece, other) for other in representatives[i + 1:])
for path, (first, second) in paths.items():
    assert path[0] == (0, 0) and path[-1] in boundary
    assert len(set(path)) == len(path)
    assert all(point not in boundary for point in path[1:-1])
    assert all(b in adj[a] for a, b in zip(path, path[1:]))
    assert congruent(first, second)
    assert sum(congruent(first, candidate) for candidate in representatives) == 1
print('Mission 4 rigid-motion cross-check: 7 simple cuts, 4 congruent-piece classes.')
