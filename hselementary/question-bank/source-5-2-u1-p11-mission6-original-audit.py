"""Audit for 5-2-u1-e4-mission-6 (printed p11, Mission 6).
Source: 어떤 자연수를 반올림하여 나타내었더니 7200이 되었다. 될 수 있는 자연수는
적어도 (㉠)개이고 가장 많으면 (㉡)개가 된다.
Clarification: 반올림은 일의 자리 또는 그보다 높은 자리에서 한다
(= 십의 자리까지, 백의 자리까지, ... 나타내기; 자연수를 일의 자리까지 '그대로' 쓰는 경우 제외).
Run: python3 -I source-5-2-u1-p11-mission6-original-audit.py
"""
def round_to(n, unit):
    q, r = divmod(n, unit)
    return (q + (1 if 2 * r >= unit else 0)) * unit

counts = {}
for unit in (1, 10, 100, 1000, 10000, 100000):
    hits = [n for n in range(1, 200000) if round_to(n, unit) == 7200]
    if hits:
        counts[unit] = (len(hits), hits[0], hits[-1])
print(counts)
assert counts == {1: (1, 7200, 7200), 10: (10, 7195, 7204), 100: (100, 7150, 7249)}
clarified = {u: c for u, c in counts.items() if u >= 10}
a = min(c[0] for c in clarified.values())
b = max(c[0] for c in clarified.values())
print("with clarification: ㉠ =", a, ", ㉡ =", b)
assert (a, b) == (10, 100)
print("without clarification ㉠ would be 1 (일의 자리까지) -> clarification needed")
