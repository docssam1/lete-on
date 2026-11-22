"""Audit for 5-2-u1-e3-example-3 (printed p8, 예제 3-3).
Source: 사과 4296개; 한 상자에 20개씩 담아서 30000원에 팔고 남은 사과는
5개씩 묶어서 8000원에 모두 팔았다; 단, 낱개로는 판매하지 않았다.
Reading: boxes = as many as possible; bundles = as many as possible from the rest;
the leftover single apple(s) are not sold ("낱개로는 판매하지 않았다").
Run: python3 -I source-5-2-u1-p8-example33-original-audit.py
"""
total, box, bundle, box_price, bundle_price = 4296, 20, 5, 30000, 8000

boxes, rest = divmod(total, box)
bundles, single = divmod(rest, bundle)
revenue = boxes * box_price + bundles * bundle_price
print("boxes", boxes, "rest", rest, "bundles", bundles, "unsold singles", single, "revenue", revenue)
assert (boxes, rest, bundles, single) == (214, 16, 3, 1)
assert revenue == 6444000

# The prior lock said "모두 판매" contradicts the totals. Check: no split of 4296 into
# 20-boxes and 5-bundles uses every apple, so at least one apple is necessarily unsold;
# that is exactly what the source's "단, 낱개로는 판매하지 않았다" covers.
assert all((total - 20 * b) % 5 != 0 for b in range(total // 20 + 1))
assert total % 5 == 1
# Uniqueness under the sequential reading (fill boxes first, then bundles): single value.
print("OK: 6444000원 (낱개 1개는 판매하지 않음)")
