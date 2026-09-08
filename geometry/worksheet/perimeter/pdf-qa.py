"""Inspect and rasterize browser-generated QA PDFs, not production deliverables."""
import json
import os
from pathlib import Path
import re
import subprocess

import pdfplumber
from pypdf import PdfReader

root = Path(__file__).resolve().parent / "qa-artifacts"
manifest = json.loads((root / "results.json").read_text(encoding="utf-8"))
assert manifest["passed"] is True
render_dir = root / "pdf-render"
render_dir.mkdir(exist_ok=True)
pdfs = []
total_pages = total_questions = total_characters = 0

for item in manifest["pdfs"]:
    name = item["name"]
    path = root / f"{name}.pdf"
    reader = PdfReader(path)
    assert len(reader.pages) == item["pages"], name
    expected_groups = []
    for number, problem_id in enumerate(item["problems"], start=1):
        domain = problem_id.rsplit("-", 1)[0]
        if not expected_groups or expected_groups[-1][0] != domain or len(expected_groups[-1][1]) == 2:
            expected_groups.append((domain, [number]))
        else:
            expected_groups[-1][1].append(number)
    has_cover = item["cover"]
    assert len(reader.pages) == len(expected_groups) + int(has_cover), name
    found_numbers = []
    with pdfplumber.open(path) as document:
        for index, (page, measured) in enumerate(zip(reader.pages, document.pages)):
            text = page.extract_text() or ""
            assert "GFIELD" in text, (name, index, "brand")
            assert re.search(rf"\b{index + 1}\s*/\s*{len(reader.pages)}\b", text), (name, index, "folio")
            assert abs(float(page.mediabox.width) - 595.28) < 1
            assert abs(float(page.mediabox.height) - 841.89) < 1
            # Question numbers occupy the 12mm left margin; solution decimals do not.
            numbers = [int(word["text"][:-1]) for word in measured.extract_words()
                       if re.fullmatch(r"\d+\.", word["text"])
                       and abs(word["x0"] - 12 * 72 / 25.4) < 2]
            if has_cover and index == 0:
                assert numbers == [], (name, "numbered problem on cover")
            else:
                expected = expected_groups[index - int(has_cover)][1]
                assert numbers == expected, (name, index + 1, numbers, expected)
                found_numbers.extend(numbers)
            for char in measured.chars:
                assert char["x0"] >= -1 and char["x1"] <= measured.width + 1, (name, index, "horizontal clipping")
                assert char["top"] >= -1 and char["bottom"] <= measured.height + 1, (name, index, "vertical clipping")
                total_characters += 1
            total_pages += 1
    assert found_numbers == list(range(1, len(item["problems"]) + 1)), name
    total_questions += len(found_numbers)
    subprocess.run([os.environ.get("PDFTOPPM", "pdftoppm"), "-r", "90", "-png", str(path), str(render_dir / name)], check=True, capture_output=True)
    images = sorted(render_dir.glob(f"{name}-[0-9]*.png"))
    assert len(images) == len(reader.pages), (name, "raster page count")
    pdfs.append({"name": name, "pages": len(reader.pages), "numbered_questions": len(found_numbers), "rasterized_pages": len(images)})

result = {"passed": True, "pdfs": pdfs, "total_pages": total_pages, "total_numbered_questions": total_questions, "bounded_characters": total_characters}
(root / "pdf-validation.json").write_text(json.dumps(result, ensure_ascii=True, indent=2), encoding="utf-8")
print(json.dumps(result, ensure_ascii=True, indent=2))
