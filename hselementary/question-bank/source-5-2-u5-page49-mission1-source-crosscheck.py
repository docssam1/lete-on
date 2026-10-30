from itertools import combinations, product

intervals = [list(combinations(range(length + 1), 2)) for length in (5, 3, 3)]
boxes = list(product(*intervals))
unit_boxes = [box for box in boxes if all(end-start == 1 for start, end in box)]
whole = ((0, 5), (0, 3), (0, 3))
assert len(boxes) == 540 and whole in boxes and len(boxes)-1 == 539
assert len(unit_boxes) == 45 and len(set(boxes)) == len(boxes)
print('5×3×3 grid: 540 including whole, 539 excluding whole, 45 elementary pieces; interpretation unverified.')
