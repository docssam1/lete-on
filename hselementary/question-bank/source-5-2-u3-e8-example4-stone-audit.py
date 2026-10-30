"""Three stones move left without jumping; independent minimax and gap invariant."""
from functools import lru_cache

@lru_cache(None)
def winning(state):
    return any(not winning(new) for _, _, new in moves(state))

def moves(state):
    for index, position in enumerate(state):
        minimum = state[index - 1] + 1 if index else 0
        for destination in range(minimum, position):
            new = list(state)
            new[index] = destination
            yield index, position - destination, tuple(new)

initial = (3, 9, 17)  # zero-based board positions, read from source grid
first_moves = [(i, distance) for i, distance, new in moves(initial) if not winning(new)]
assert first_moves == [(2, 4)]
checked = set()
def verify_strategy(state):
    if state in checked:
        return
    checked.add(state)
    a, b, c = state
    assert a == c - b - 1
    for i, distance, new in moves(state):
        # Restore equal gaps by pairing the opponent's move.
        j = 2 if i in (0, 1) else 0
        reply = next((s for k, d, s in moves(new) if k == j and d == distance), None)
        assert reply is not None
        verify_strategy(reply)

verify_strategy((3, 9, 13))
print('first player: third stone 4 cells left; verified symmetric strategy in',len(checked),'positions')
