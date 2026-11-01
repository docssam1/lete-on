"""Independently check both opening cases and all mirrored replies."""
from functools import lru_cache

for n in (9, 11, 15):
    full = (1 << n) - 1
    def moves(mask):
        for i in range(n):
            one = 1 << i
            if mask & one:
                yield one
                pair = one | (1 << ((i + 1) % n))
                if mask & pair == pair:
                    yield pair
    @lru_cache(None)
    def winning(mask):
        return any(not winning(mask ^ take) for take in moves(mask))
    def mirror(mask, axis_twice):
        return sum(1 << ((axis_twice - i) % n) for i in range(n) if mask & (1 << i))
    assert not winning(full), f'{n}: first player has a winning opening'
    seen = set()
    def check_replies(mask, axis):
        if (mask, axis) in seen:
            return
        seen.add((mask, axis))
        assert mask == mirror(mask, axis)
        assert not winning(mask)
        for take in moves(mask):
            reply = mirror(take, axis)
            remaining = mask ^ take
            assert reply != take and not reply & take and reply in moves(remaining)
            check_replies(remaining ^ reply, axis)
    for i in range(n):
        first_one = 1 << i
        after_one = full ^ first_one
        second_pair = (1 << ((i + (n - 1) // 2) % n)) | (1 << ((i + (n + 1) // 2) % n))
        assert second_pair in moves(after_one)
        check_replies(after_one ^ second_pair, 2 * i)
        first_pair = (1 << i) | (1 << ((i + 1) % n))
        after_pair = full ^ first_pair
        second_one = 1 << ((i + (n + 1) // 2) % n)
        assert second_one in moves(after_pair)
        check_replies(after_pair ^ second_one, 2 * i + 1)
    print(f'{n} petals: second wins; {len(seen)} symmetric states checked')
