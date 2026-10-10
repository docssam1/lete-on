import hashlib
import json
from pathlib import Path
import re
import sys

import pymupdf

root = Path(sys.argv[1])
assert re.match(r"^[EG]:[\\/]", str(root)), "Evidence must stay on E: or G:."
repository = Path(__file__).parent
browser = json.loads((root / "browser-result.json").read_text(encoding="utf-8"))
assert browser["states"] == 18 and len(browser["records"]) == 18
assert len(browser["pdfs"]) == 18
for name, digest in browser["assetHashes"].items():
    assert hashlib.sha256((repository / name).read_bytes()).hexdigest() == digest
rows = []
for record in browser["pdfs"]:
    name = f'{record["id"]}-d{record["difficulty"]}-{record["phase"]}-a4.pdf'
    with pymupdf.open(root / name) as document:
        assert len(document) == record["pages"] == 1
        page = document[0]
        assert abs(page.rect.width - 595.28) < 1 and abs(page.rect.height - 841.89) < 1
        watermarks = set()
        for bi, block in enumerate(page.get_text("dict")["blocks"]):
            for li, line in enumerate(block.get("lines", [])):
                if abs(line["dir"][1]) > .01:
                    text = "".join(span["text"] for span in line["spans"])
                    assert re.fullmatch(r"[LETEON\-\u00b7\s]+", text), text
                    watermarks.add((bi, li))
        words = [w for w in page.get_text("words") if (w[5], w[6]) not in watermarks]
        assert words, f"Empty page: {name}"
        unsafe = [w for w in words if w[0] < 12 or w[1] < 12 or w[2] > page.rect.width - 12 or w[3] > page.rect.height - 12]
        assert not unsafe, f"Unsafe text: {name}: {unsafe}"
        images = page.get_image_info(xrefs=True)
        assert len(images) == (0 if record["phase"] == "problem" else 3), name
        for variant, image in enumerate(images):
            box = pymupdf.Rect(image["bbox"])
            assert box.x0 >= 12 and box.y0 >= 12 and box.x1 <= page.rect.width - 12 and box.y1 <= page.rect.height - 12
            assert box.width * 28 / 640 >= 9, f"Direction label below 9pt: {name}"
            original = pymupdf.Pixmap(str(repository / "assets" / "source-6-2-stacks" / f'{record["id"]}-v{variant}.png'))
            embedded = pymupdf.Pixmap(document, image["xref"])
            assert (embedded.width, embedded.height) == (1280, 1040)
            if original.alpha:
                original = pymupdf.Pixmap(original, 0)
            if embedded.alpha:
                embedded = pymupdf.Pixmap(embedded, 0)
            assert original.samples == embedded.samples, f"PDF answer pixels differ: {name}/{variant}"
        page.get_pixmap(matrix=pymupdf.Matrix(1.5, 1.5)).save(root / name.replace(".pdf", ".png"))
        rows.append({"pdf": name, "pageCount": 1, "words": len(words), "answerImages": len(images)})
mixed = []
expected_pixel_hashes = set()
for image_file in (repository / "assets" / "source-6-2-stacks").glob("*.png"):
    pixmap = pymupdf.Pixmap(str(image_file))
    if pixmap.alpha:
        pixmap = pymupdf.Pixmap(pixmap, 0)
    expected_pixel_hashes.add(hashlib.sha256(pixmap.samples).hexdigest())
for record in browser["mixed"]["pdfs"]:
    name = f'mixed-{record["phase"]}-a4.pdf'
    with pymupdf.open(root / name) as document:
        assert len(document) == 2
        image_count = 0
        pixel_hashes = set()
        for number, page in enumerate(document, 1):
            assert len(page.get_text("words")) > 15, f"Blank mixed page: {name}/{number}"
            for image in page.get_image_info(xrefs=True):
                box = pymupdf.Rect(image["bbox"])
                assert box.x0 >= 12 and box.y0 >= 12 and box.x1 <= page.rect.width - 12 and box.y1 <= page.rect.height - 12
                assert box.width * 28 / 640 >= 9
                embedded = pymupdf.Pixmap(document, image["xref"])
                if embedded.alpha:
                    embedded = pymupdf.Pixmap(embedded, 0)
                pixel_hashes.add(hashlib.sha256(embedded.samples).hexdigest())
                image_count += 1
            page.get_pixmap(matrix=pymupdf.Matrix(1.5, 1.5)).save(root / f'mixed-{record["phase"]}-a4-{number}.png')
        assert image_count == (0 if record["phase"] == "problem" else 6)
        assert pixel_hashes == (set() if record["phase"] == "problem" else expected_pixel_hashes)
        mixed.append({"pdf": name, "pages": len(document), "answerImages": image_count})
report = {"pdfCount": len(rows) + len(mixed), "pages": rows, "mixed": mixed, "minimumInsetPoints": 12, "minimumAnswerLabelPoints": 9, "exactAnswerPixels": True,
          "semanticProof": "Learner-visible DOM reconstruction and raster visual inspection; PDF text extraction only checks bounds."}
(root / "pdf-result.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print(f'Stack bank PDF bounds and exact answer pixels passed: {len(rows)} single-page A4 files and {len(mixed)} two-page mixed papers.')
