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
for name, digest in browser["assetHashes"].items():
    assert hashlib.sha256((repository / name).read_bytes()).hexdigest() == digest
rows = []
text_decoding_incomplete = False
for record in browser["pdfs"]:
    name = f'{record["id"]}-d{record["difficulty"]}-{record["phase"]}-a4.pdf'
    with pymupdf.open(root / name) as document:
        assert len(document) == record["pages"]
        all_text = []
        for number, page in enumerate(document, 1):
            assert abs(page.rect.width - 595.28) < 1 and abs(page.rect.height - 841.89) < 1
            watermarks = set()
            for bi, block in enumerate(page.get_text("dict")["blocks"]):
                for li, line in enumerate(block.get("lines", [])):
                    if abs(line["dir"][1]) > .01:
                        text = "".join(span["text"] for span in line["spans"])
                        assert re.fullmatch(r"[LETEON\-\u00b7\s]+", text), text
                        watermarks.add((bi, li))
            words = [w for w in page.get_text("words") if (w[5], w[6]) not in watermarks]
            text_decoding_incomplete |= any("\ufffd" in w[4] for w in words)
            assert words, f"Empty page: {name}/{number}"
            unsafe = [w for w in words if w[0] < 12 or w[1] < 12 or w[2] > page.rect.width - 12 or w[3] > page.rect.height - 12]
            assert not unsafe, f"Unsafe page text: {name}/{number}: {unsafe}"
            all_text.extend(w[4] for w in words)
            rows.append({"pdf": name, "page": number, "wordCount": len(words)})
report = {"pdfCount": len(browser["pdfs"]), "pages": rows, "minimumTextInsetPoints": 12, "watermarksExcluded": True, "textDecodingIncomplete": text_decoding_incomplete, "semanticProof": "Browser DOM checks and raster visual inspection; PDF text extraction only checks bounds."}
(root / "pdf-bounds-result.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print(f'PDF bounds passed: {report["pdfCount"]} PDFs and {len(rows)} A4 pages.')
