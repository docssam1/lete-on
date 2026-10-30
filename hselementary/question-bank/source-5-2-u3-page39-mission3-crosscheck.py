from pathlib import Path
import runpy

# Independently match cyclic polygon vertices by rigid maps, including reflection.
data = runpy.run_path(str(Path(__file__).with_name('source-5-2-u3-e8-mission3-dot-cut-audit.py')))
paths, representatives = data['paths'], data['shapes']

def congruent(p, q):
    if len(p) != len(q):
        return False
    for reverse in (False, True):
        target = q[::-1] if reverse else q
        for offset in range(len(q)):
            v = target[offset:] + target[:offset]
            for mirrored in (False, True):
                z = [complex(x, -y if mirrored else y) for x, y in p]
                w = [complex(x, y) for x, y in v]
                if abs(z[1]-z[0]) == 0 or abs(abs(w[1]-w[0])-abs(z[1]-z[0])) > 1e-9:
                    continue
                factor = (w[1]-w[0])/(z[1]-z[0])
                if all(abs((t-z[0])*factor+w[0]-u)<1e-9 for t,u in zip(z,w)):
                    return True
    return False

examples = [paths[path][0] for path in representatives.values()]
assert len(examples) == 9
for i, p in enumerate(examples):
    assert all(not congruent(p, q) for q in examples[i+1:])
for p, q in paths.values():
    assert congruent(p, q)
    assert sum(congruent(p, candidate) for candidate in examples) == 1
example = data['example_path']
example_piece = paths[example][0]
assert sum(congruent(example_piece, candidate) for candidate in examples) == 1
assert len(examples)-1 == 8
print('Independent rigid-motion cross-check: 38 cuts, 9 classes, printed example excluded gives 8.')
