#!/usr/bin/env python3
"""Derive opposite faces directly from the printed views' adjacency graph."""
from itertools import combinations

# Printed views, read as sets: a cube's three visible faces meet at a vertex.
views = ("DAC", "DCB", "CFB")
labels = set("ABCDEF")
adjacent = {frozenset(pair) for view in views for pair in combinations(view, 2)}
def partnerings(remaining):
    if not remaining:
        yield ()
        return
    first = min(remaining)
    for second in sorted(remaining-{first}):
        if frozenset((first, second)) not in adjacent:
            for tail in partnerings(remaining-{first, second}):
                yield ((first, second),) + tail

pairs = list(partnerings(labels))
assert pairs == [(("A", "B"), ("C", "E"), ("D", "F"))], pairs
assert {next(iter(pair-{"C"})) for pair in adjacent if "C" in pair} == set("ADBF")
lookup = {a: b for pair in pairs[0] for a, b in (pair, pair[::-1])}
answers = tuple(lookup[x] for x in "ADE")
assert answers == ("B", "F", "C")
print("PASS: printed adjacency graph forces opposite pairs", pairs[0], "; requested A,D,E:", answers)
print("LIMIT: checks opposite pairing only; does not independently prove the ordered views have a consistent handed rotation or verify source labels.")
