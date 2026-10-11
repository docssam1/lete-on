"""Convert the pinned upstream font; never overwrite a cover/original font.

Usage: python scripts/build-lesson-font.py <downloaded NanumPenScript-Regular.ttf>
Requires fonttools[woff]. The OFL reserved family names are replaced for this
format-converted derivative; copyright and license records remain intact.
"""
import hashlib
import sys
from pathlib import Path
from fontTools.ttLib import TTFont

source = Path(sys.argv[1]).resolve()
expected = "6f0d1ab29c7894010dc88831fb7a0a51edb79136e450344183de5b1a8b52bd43"
if hashlib.sha256(source.read_bytes()).hexdigest() != expected:
    raise SystemExit("Upstream font hash mismatch; do not build an unknown font")
target = Path(__file__).resolve().parents[1] / "assets/fonts/nm-lesson-hand.woff2"
font = TTFont(source)
names = {1: "NM Lesson Hand", 2: "Regular", 3: "NM-Lesson-Hand-Regular-20261010",
         4: "NM Lesson Hand Regular", 6: "NM-Lesson-Hand-Regular",
         16: "NM Lesson Hand", 17: "Regular", 18: "NM Lesson Hand Regular",
         21: "NM Lesson Hand", 22: "Regular"}
for record in font["name"].names:
    if record.nameID in names:
        record.string = names[record.nameID].encode(record.getEncoding())
font.flavor = "woff2"
font.save(target)
print(f"Built {target.name}: {target.stat().st_size} bytes; {len(font.getBestCmap())} characters")
