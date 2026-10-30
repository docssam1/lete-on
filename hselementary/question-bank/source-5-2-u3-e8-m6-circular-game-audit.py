"""Verify the 13-petal circular take-away game by minimax and reflection."""
from functools import lru_cache

N = 13
FULL = (1 << N) - 1

def moves(mask):
    for i in range(N):
        one = 1 << i
        if mask & one:
            yield one
            two = one | (1 << ((i + 1) % N))
            if mask & two == two:
                yield two

@lru_cache(None)
def winning(mask):
    return any(not winning(mask ^ take) for take in moves(mask))

def mirror(mask, axis_twice):
    return sum(1 << ((axis_twice - i) % N) for i in range(N) if mask & (1 << i))

# No first move can force victory, including the two adjacent-petal option.
assert not winning(FULL)
for first in moves(FULL):
    assert winning(FULL ^ first)
# If the first player takes one, copying that count immediately never
# leaves a losing position for them. Equal-count mirroring starts later.
for axis in range(N):
    after_one = FULL ^ (1 << axis)
    single_replies = [take for take in moves(after_one) if bin(take).count('1') == 1]
    assert len(single_replies) == 12
    assert all(winning(after_one ^ take) for take in single_replies)
# For every first choice of one petal the second player removes the opposite pair;
# then all possible legal first-player moves have legal mirrored replies.
checked = set()
def check_mirroring(mask, axis):
    key = (mask, axis)
    if key in checked:
        return
    checked.add(key)
    assert mask == mirror(mask, axis)
    for take in moves(mask):
        reply = mirror(take, axis)
        assert reply != take and not (reply & take)
        remaining = mask ^ take
        assert reply in moves(remaining)
        check_mirroring(remaining ^ reply, axis)

for axis in range(N):
    first = 1 << axis
    opposite = (1 << ((axis + 6) % N)) | (1 << ((axis + 7) % N))
    assert opposite in moves(FULL ^ first)
    check_mirroring(FULL ^ first ^ opposite, 2 * axis)
    # If the first player removes a neighboring pair, remove the single
    # opposite petal before beginning equal-count mirrored replies.
    first_pair = (1 << axis) | (1 << ((axis + 1) % N))
    opposite_one = 1 << ((axis + 7) % N)
    assert opposite_one in moves(FULL ^ first_pair)
    check_mirroring(FULL ^ first_pair ^ opposite_one, 2 * axis + 1)
print(f'13-petal ring: second player wins; verified {len(checked)} symmetric states')
