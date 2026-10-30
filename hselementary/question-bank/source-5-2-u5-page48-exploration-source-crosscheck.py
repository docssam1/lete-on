from itertools import combinations

# x: left/right, y: front/back, z: bottom/top, following the printed figure.
v = {'ㄱ': (0, 0, 1), 'ㄴ': (1, 0, 1), 'ㄷ': (1, 1, 1), 'ㄹ': (0, 1, 1),
     'ㅁ': (0, 0, 0), 'ㅂ': (1, 0, 0), 'ㅅ': (1, 1, 0), 'ㅇ': (0, 1, 0)}
edges = {frozenset((a, b)) for a, b in combinations(v, 2)
         if sum(abs(x-y) for x, y in zip(v[a], v[b])) == 1}
faces = {frozenset(name for name, p in v.items() if p[axis] == value)
         for axis in range(3) for value in (0, 1)}
face = lambda s: frozenset(s)
assert len(v) == 8 and len(edges) == 12 and len(faces) == 6
assert {face(s) for s in ('ㄱㄹㅇㅁ', 'ㄹㄷㅅㅇ', 'ㅁㅂㅅㅇ')} <= faces
assert {face(s) for s in ('ㄹㅇ', 'ㅇㅅ', 'ㅇㅁ')} <= edges
assert face('ㄴㅂㅅㄷ') in faces and face('ㄱㅁㅇㄹ') in faces
assert face('ㄴㅂㅅㄷ').isdisjoint(face('ㄱㅁㅇㄹ'))
assert faces - {face('ㄱㅁㅂㄴ'), face('ㄹㄷㅅㅇ')} == {face(s) for s in ('ㄱㄴㄷㄹ', 'ㄴㅂㅅㄷ', 'ㅁㅂㅅㅇ', 'ㄱㅁㅇㄹ')}
assert len(edges) - (len(faces)-1) == 7
print('Page 48: cuboid vertex incidence, hidden edges, side faces and seven cuts checked; publisher key unverified.')
