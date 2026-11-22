"""Independent audit for 5-2-u2-e2-mission-6 (printed p17, pdf p13).

Source: 10 equal circles drawn overlapping at equal spacing inside a rectangle of
height 2 4/5 cm; find the rectangle area. The text gives no spacing, so the audit
measures the printed figure (2x render) and tests every simple spacing d/m.

Measured on pdfpages/p13.png (2384x3370), black pixels (<110) of the printed lines:
  rectangle left/right x = 1297 / 2030, top/bottom y = 2300 / 2527
  row y=2395 (midline) crossing x positions listed in MIDLINE below.
Optional: pass the page PNG path to re-measure.
Run: python3 -I source-5-2-u2-p17-mission6-original-audit.py [p13.png]
"""
import struct
import sys
import zlib
from fractions import Fraction as F

LEFT, RIGHT, TOP, BOTTOM = 1297, 2030, 2300, 2527
MIDLINE = [1297, 1355, 1411, 1468, 1522, 1579, 1637, 1692, 1748, 1804, 1860, 1916, 1972, 2030]


def load_gray(path):
    d = open(path, 'rb').read(); i = 8; idat = b''
    while i < len(d):
        n = struct.unpack('>I', d[i:i + 4])[0]; t = d[i + 4:i + 8]; c = d[i + 8:i + 8 + n]
        if t == b'IHDR':
            w, h, bd, ct = struct.unpack('>IIBB', c[:10])
        if t == b'IDAT':
            idat += c
        i += 12 + n
    raw = zlib.decompress(idat); bpp = {0: 1, 2: 3, 4: 2, 6: 4}[ct]; stride = w * bpp
    rows = []; prev = bytearray(stride); p = 0
    for _ in range(h):
        f = raw[p]; p += 1; line = bytearray(raw[p:p + stride]); p += stride
        for x in range(stride):
            a = line[x - bpp] if x >= bpp else 0; b = prev[x]; c = prev[x - bpp] if x >= bpp else 0
            if f == 1: line[x] = (line[x] + a) & 255
            elif f == 2: line[x] = (line[x] + b) & 255
            elif f == 3: line[x] = (line[x] + ((a + b) >> 1)) & 255
            elif f == 4:
                pp = a + b - c; pa, pb, pc = abs(pp - a), abs(pp - b), abs(pp - c)
                line[x] = (line[x] + (a if pa <= pb and pa <= pc else (b if pb <= pc else c))) & 255
        rows.append(line); prev = line
    return lambda x, y: sum(rows[y][x * bpp:x * bpp + min(3, bpp)]) // min(3, bpp)


if len(sys.argv) > 1:
    g = load_gray(sys.argv[1])
    xs = [x for x in range(1280, 2050) if g(x, 2395) < 110]
    groups = []
    for x in xs:
        if groups and x - groups[-1][-1] <= 2: groups[-1].append(x)
        else: groups.append([x])
    measured = [(a[0] + a[-1]) // 2 for a in groups]
    assert set(MIDLINE) <= set(measured), measured
    # x=1329 is the student's red pencil stroke over circle 1 (handwriting, ignored)
    print('re-measured midline crossings match; extra marks (handwriting):', sorted(set(measured) - set(MIDLINE)))

width_px, height_px = RIGHT - LEFT, BOTTOM - TOP
ratio = width_px / height_px
# width = d + 9*s with s = d/m  ->  width/d = 1 + 9/m
fits = {m: 1 + 9 / m for m in range(1, 13)}
errors = {m: abs(v - ratio) / ratio for m, v in fits.items()}
best = min(errors, key=errors.get)
assert best == 4 and errors[4] < 0.01, errors
assert all(e > 0.05 for m, e in errors.items() if m != 4)
# midline: 14 marks (2 rectangle sides + 12 circle edges, circle-1 right and circle-5 left coincide)
gaps = [b - a for a, b in zip(MIDLINE, MIDLINE[1:])]
assert len(gaps) == 13 and max(gaps) - min(gaps) <= 4, gaps
assert abs(sum(gaps) / 13 - height_px / 4) < 1.5
# circle 1 spans LEFT..LEFT+d; its right edge meets circle 5's left edge (1522)
assert abs((LEFT + height_px) - MIDLINE[4]) <= 3

d = 2 + F(4, 5)
s = d / 4
width = d + 9 * s
area = d * width
assert width == F(91, 10) and area == F(637, 25)
print(f'pixel ratio {ratio:.4f} vs 13/4 = 3.25; spacing d/{best}')
print('width', width, 'area', area, '= 25 12/25 cm^2')
print('PASS')
