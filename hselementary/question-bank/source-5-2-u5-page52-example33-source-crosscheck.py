from collections import Counter

# Each listed net square uses the original cube's four corner labels.
faces = {'top': 'ABCD', 'center': 'BCGF', 'left': 'ABFE',
         'right': 'CDHG', 'far_right': 'DAEH', 'bottom': 'FGHE'}
midpoints = {'ㄱ': 'AD', 'ㄴ': 'DC', 'ㄷ': 'CG', 'ㄹ': 'GF', 'ㅁ': 'FE', 'ㅂ': 'EA'}
segments = {'top': 'ㄱㄴ', 'center': 'ㄷㄹ', 'left': 'ㅁㅂ',
            'right': 'ㄴㄷ', 'far_right': 'ㅂㄱ', 'bottom': 'ㄹㅁ'}
for name, pair in segments.items():
    face = faces[name]
    edges = {frozenset(face[i] + face[(i+1) % 4]) for i in range(4)}
    assert all(frozenset(midpoints[p]) in edges for p in pair)
assert Counter(''.join(segments.values())) == Counter({p: 2 for p in midpoints})
assert set(faces) == set(segments) and len(set(map(frozenset, faces.values()))) == 6
print('Page 52 Example 3-3: midpoint-to-face incidence checked; official answer and public figure unverified.')
