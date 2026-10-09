import hashlib
import json
from pathlib import Path
import re
import sys

import pymupdf

root = Path(sys.argv[1])
assert re.match(r"^[EG]:[\\/]", str(root)), "Evidence must stay on E:/G:."
assets = Path(__file__).parent / "assets" / "source-6-2-stacks"
manifest = json.loads((assets / "manifest.json").read_text(encoding="utf-8"))
browser = json.loads((root / "fixed-assets-browser-result.json").read_text(encoding="utf-8"))
assert manifest["releaseStatus"] == "locked"
assert len(browser["states"]) == 3 and not browser["webglRequired"]
assert all(not state["overflow"] and state["webglAttempts"] == 0 for state in browser["states"])
records = []
with pymupdf.open(root / "fixed-answers-a4.pdf") as document:
    assert len(document) == len(manifest["assets"]) == 6
    for index, asset in enumerate(manifest["assets"]):
        page = document[index]
        assert abs(page.rect.width - 595.28) < 1 and abs(page.rect.height - 841.89) < 1
        images = page.get_images(full=True)
        assert len(images) == 1
        positions = page.get_image_rects(images[0][0])
        assert len(positions) == 1
        rect = positions[0]
        assert rect.x0 >= 12 and rect.y0 >= 12 and rect.x1 <= page.rect.width - 12 and rect.y1 <= page.rect.height - 12
        original = (assets / asset["file"]).read_bytes()
        assert hashlib.sha256(original).hexdigest() == asset["sha256"]
        stored = pymupdf.Pixmap(pymupdf.Pixmap(original), 0)
        printed = pymupdf.Pixmap(pymupdf.Pixmap(document, images[0][0]), 0)
        assert (stored.width, stored.height) == (printed.width, printed.height) == (1280, 1040)
        assert stored.samples == printed.samples, "Printed answer must match the stored canonical image pixel for pixel"
        text = page.get_text("words")
        assert text and all(w[0] >= 12 and w[1] >= 12 and w[2] <= page.rect.width - 12 and w[3] <= page.rect.height - 12 for w in text)
        page.get_pixmap(dpi=100, alpha=False).save(root / f"fixed-answer-{index}-a4-eye.png")
        records.append({"asset": asset["file"], "page": index + 1, "exactPixels": True, "imageBounds": list(rect)})
(root / "fixed-assets-pdf-result.json").write_text(json.dumps({"pages": records, "scope": "Locked fixed answer assets only, not student worksheet pagination"}, indent=2), encoding="utf-8")
print("Fixed answer PDF: six A4 pages, exact stored-image pixels, one image per page and 12-point safe text/image bounds passed.")
