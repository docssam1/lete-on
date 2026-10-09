import hashlib
import json
from pathlib import Path
import re
import sys

import pymupdf

root = Path(sys.argv[1])
assert re.match(r"^[EG]:[\\/]", str(root)), "Evidence must stay on E:/G:."
repository = Path(__file__).parent
browser = json.loads((root / "stack-browser-result.json").read_text(encoding="utf-8"))
assert browser["states"] == 18
for name, digest in browser["assetHashes"].items():
    assert hashlib.sha256((repository / name).read_bytes()).hexdigest() == digest
records = []
for source in range(2):
    for pool in range(3):
        filename = f"stack-{source}-v{pool}-1440-a4.pdf"
        with pymupdf.open(root / filename) as document:
            assert len(document) == 1
            page = document[0]
            assert abs(page.rect.width - 595.28) < 1 and abs(page.rect.height - 841.89) < 1
            images = page.get_images(full=True)
            assert len(images) == 1, "Use the decoded canonical PNG, not duplicated canvas plus PNG"
            image_rects = page.get_image_rects(images[0][0])
            assert len(image_rects) == 1
            for rect in image_rects:
                assert rect.x0 >= 12 and rect.y0 >= 12 and rect.x1 <= page.rect.width - 12 and rect.y1 <= page.rect.height - 12
            words = page.get_text("words")
            assert words
            assert all(w[0] >= 12 and w[1] >= 12 and w[2] <= page.rect.width - 12 and w[3] <= page.rect.height - 12 for w in words)
            image = document.extract_image(images[0][0])
            assert image["width"] == 1280 and image["height"] == 1040
            raster = root / f"stack-{source}-v{pool}-a4-eye.png"
            page.get_pixmap(dpi=110, alpha=False).save(raster)
            records.append({"file": filename, "canonicalImage": [image["width"], image["height"]], "imageBounds": list(image_rects[0]), "raster": raster.name})
report = {"pdfs": records, "pages": 6, "minimumInsetPoints": 12, "scope": "Locked model-review PDFs, not learner question-bank layout or difficulty approval"}
(root / "stack-pdf-result.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print("3D PDF review: six single-page A4s, one canonical image each, image/text safe bounds, six eye rasters passed.")
