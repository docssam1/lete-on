"""Independent audit for 5-2-u2-e1-mission-4 (printed p15, pdf p11).

Source: ㉠×3 5/8×12 = ㉡×6 4/5×6 = ㉢×3 4/10×9 ; order ㉠, ㉡, ㉢ from smallest.
Clarification shown in prompt: ㉠, ㉡, ㉢은 0보다 큰 수입니다.
Run: python3 -I source-5-2-u2-p15-mission4-original-audit.py
"""
from fractions import Fraction as F
from itertools import permutations

coef = {
    '㉠': (3 + F(5, 8)) * 12,
    '㉡': (6 + F(4, 5)) * 6,
    '㉢': (3 + F(4, 10)) * 9,
}
assert coef['㉠'] == F(87, 2) and coef['㉡'] == F(204, 5) and coef['㉢'] == F(153, 5)


def order_for(product):
    vals = {k: product / c for k, c in coef.items()}
    for k in vals:
        assert vals[k] * coef[k] == product
    orders = [p for p in permutations(vals) if vals[p[0]] < vals[p[1]] < vals[p[2]]]
    return orders


# brute force over many positive common products (fractions and naturals)
positive = set()
for num in range(1, 400):
    for den in (1, 2, 3, 5, 7, 10, 12):
        o = order_for(F(num, den))
        assert len(o) == 1
        positive.add(o[0])
assert positive == {('㉠', '㉡', '㉢')}, positive

# without the clarification: product 0 gives no strict order, negative reverses it
assert order_for(F(0)) == []
assert order_for(F(-1)) == [('㉢', '㉡', '㉠')]

# example with natural-number values (common product = lcm-friendly)
P = F(612)
print('example values', {k: str(P / c) for k, c in coef.items()})
print('coefficients', {k: str(c) for k, c in coef.items()})
print('answer: ㉠, ㉡, ㉢ (unique for every positive common product)')
print('PASS')
