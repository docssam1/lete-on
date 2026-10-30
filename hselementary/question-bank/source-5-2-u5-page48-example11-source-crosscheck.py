from itertools import combinations, product

intervals = [list(combinations(range(length + 1), 2)) for length in (4, 3, 3)]
boxes = list(product(*intervals))
unit_boxes = [box for box in boxes if all(end-start == 1 for start, end in box)]
assert len(boxes) == 360 and len(unit_boxes) == 36
assert len(set(boxes)) == len(boxes)
print('4×3×3 grid: 360 sub-cuboids or 36 elementary pieces, depending on interpretation; publisher key unverified.')
