from collections import deque

neg = lambda a: tuple(-x for x in a)
add = lambda a, b: tuple(x + y for x, y in zip(a, b))
sub = lambda a, b: tuple(x - y for x, y in zip(a, b))

# The rightmost square is the top face, with ㄱ·ㄴ·ㄷ given in the source net.
cells = {(0, 0), (1, 0), (2, 0), (3, 0), (3, -1), (0, 1)}
faces = {(3, 0): ((0, 0, 0), (1, 0, 0), (0, 1, 0), (0, 0, 1))}
queue = deque(faces)
while queue:
    x, y = queue.popleft()
    origin, right, down, normal = faces[x, y]
    neighbors = [
        (1, 0, (add(origin, right), neg(normal), down, right)),
        (-1, 0, (sub(origin, normal), normal, down, neg(right))),
        (0, 1, (add(origin, down), right, neg(normal), down)),
        (0, -1, (sub(origin, normal), right, normal, neg(down))),
    ]
    for dx, dy, face in neighbors:
        cell = (x + dx, y + dy)
        if cell in cells and cell not in faces:
            faces[cell] = face
            queue.append(cell)

assert len(faces) == 6 and len({face[3] for face in faces.values()}) == 6
vertices = {(0, 0, 0): "ㄱ", (0, 1, 0): "ㄴ", (1, 1, 0): "ㄷ", (1, 0, 0): "ㄹ",
            (0, 0, -1): "ㅁ", (0, 1, -1): "ㅂ", (1, 1, -1): "ㅅ", (1, 0, -1): "ㅇ"}
face_corners = {}
for cell, (origin, right, down, _) in faces.items():
    face_corners[cell] = [vertices[p] for p in (origin, add(origin, right),
                                                add(add(origin, right), down), add(origin, down))]
assert face_corners[(3, 0)] == ["ㄱ", "ㄹ", "ㄷ", "ㄴ"]
assert face_corners[(0, 0)] == ["ㄹ", "ㅇ", "ㅅ", "ㄷ"]
assert face_corners[(0, 1)] == ["ㄷ", "ㅅ", "ㅂ", "ㄴ"]
for segment, expected in [(set("ㄹㄴ"), (3, 0)), (set("ㄹㅅ"), (0, 0)), (set("ㄴㅅ"), (0, 1))]:
    containing_faces = [cell for cell, corners in face_corners.items() if segment <= set(corners)]
    assert containing_faces == [expected]
print("Page 52 Example 3-1: three face diagonals mapped to folded net; source key unverified.")
