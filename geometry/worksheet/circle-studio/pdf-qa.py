"""Check local browser QA PDFs, including every rasterized page and board."""
import json
import hashlib
import os
from pathlib import Path
import re
import subprocess

import pdfplumber
from pypdf import PdfReader
from PIL import Image

root = Path(__file__).resolve().parent / "qa-artifacts"
manifest = json.loads((root / "results.json").read_text(encoding="utf-8"))
assert manifest["passed"] is True
for source, expected in manifest["sources"].items():
    actual = hashlib.sha256((root.parent / source).read_bytes()).hexdigest()
    assert actual == expected, ("Source changed since browser QA", source)
render_dir = root / "pdf-render"
render_dir.mkdir(exist_ok=True)
pdfs = []
total_pages = total_questions = total_characters = board_pixels = 0
grid_measurements = []
for item in manifest["pdfs"]:
    name = item["name"]
    path = root / f"{name}.pdf"
    reader = PdfReader(path)
    groups = []
    for number, problem_id in enumerate(item["problems"], start=1):
        domain = problem_id.rsplit("-", 1)[0]
        if not groups or groups[-1][0] != domain or len(groups[-1][1]) == 2:
            groups.append((domain, [number]))
        else:
            groups[-1][1].append(number)
    cover = item["cover"]
    assert len(reader.pages) == item["pages"] == len(groups) + int(cover), name
    found = []
    with pdfplumber.open(path) as document:
        for index, (page, measured) in enumerate(zip(reader.pages, document.pages)):
            text = page.extract_text() or ""
            assert "GFIELD" in text, (name, index, "brand")
            assert re.search(rf"\b{index+1}\s*/\s*{len(reader.pages)}\b", text), (name, index, "folio")
            assert abs(float(page.mediabox.width) - 595.28) < 1
            assert abs(float(page.mediabox.height) - 841.89) < 1
            numbers = [int(word["text"][:-1]) for word in measured.extract_words()
                       if re.fullmatch(r"\d+\.", word["text"])
                       and abs(word["x0"] - 12 * 72 / 25.4) < 2]
            expected = [] if cover and index == 0 else groups[index-int(cover)][1]
            assert numbers == expected, (name, index, numbers, expected)
            found.extend(numbers)
            # Measure vector coordinates in the actual PDF, never CSS pixels.
            for box in item["diagramBoxes"]:
                if box["page"] != index + 1 or not any(box["id"].startswith("circle-" + d + "-") for d in ("center", "draw")):
                    continue
                x0, y0, x1, y1 = [box[k] * .75 for k in ("left", "top", "right", "bottom")]
                candidates = [line for line in measured.lines if line["x0"] >= x0 - 1 and line["x1"] <= x1 + 1
                              and line["top"] >= y0 - 1 and line["bottom"] <= y1 + 1]
                vertical = [line for line in candidates if abs(line["x1"] - line["x0"]) < .1
                            and 165 < line["bottom"] - line["top"] < 175]
                horizontal = [line for line in candidates if abs(line["bottom"] - line["top"]) < .1
                              and 165 < line["x1"] - line["x0"] < 175]
                xs = sorted(set(round(line["x0"], 4) for line in vertical))
                ys = sorted(set(round(line["top"], 4) for line in horizontal))
                assert len(xs) == len(ys) == 7, (name, box["id"], "missing PDF grid", xs, ys)
                steps = [(axis[n+1]-axis[n])*25.4/72 for axis in (xs,ys) for n in range(6)]
                spans = [(axis[-1]-axis[0])*25.4/72 for axis in (xs,ys)]
                assert all(abs(step - 10) < .025 for step in steps), (name, box["id"], steps)
                assert all(abs(span - 60) < .04 for span in spans), (name, box["id"], spans)
                grid_measurements.append({"pdf":name,"id":box["id"],"spacing_min_mm":min(steps),
                                          "spacing_max_mm":max(steps),"spans_mm":spans})
            for char in measured.chars:
                assert char["x0"] >= -1 and char["x1"] <= measured.width + 1, (name, index, "horizontal clipping")
                assert char["top"] >= -1 and char["bottom"] <= measured.height + 1, (name, index, "vertical clipping")
                total_characters += 1
            total_pages += 1
    assert found == list(range(1, len(item["problems"])+1)), name
    total_questions += len(found)
    subprocess.run([os.environ.get("PDFTOPPM", "pdftoppm"), "-r", "90", "-png", str(path), str(render_dir / name)], check=True, capture_output=True)
    images = sorted(render_dir.glob(f"{name}-[0-9]*.png"))
    assert len(images) == len(reader.pages), (name, "raster count")
    for image_path in images:
        with Image.open(image_path) as im:
            im = im.convert("RGB")
            assert abs(im.width / im.height - 210 / 297) < .003
            dark = sum(min(pixel) < 140 for pixel in im.getdata())
            assert 1000 < dark < im.width * im.height * .3, (name, image_path.name, "blank or saturated page", dark)
    for box in item["diagramBoxes"]:
        image_path = next(p for p in images if int(p.stem.rsplit("-", 1)[1]) == box["page"])
        with Image.open(image_path) as im:
            scale = 90 / 96
            crop = im.convert("RGB").crop(tuple(round(box[k] * scale) for k in ["left", "top", "right", "bottom"]))
            dark = sum(min(pixel) < 200 for pixel in crop.getdata())
            assert dark > 100, (name, box["id"], "blank board", dark)
            board_pixels += 1
    pdfs.append({"name": name, "pages": len(reader.pages), "questions": len(found), "rasterized_pages": len(images)})
result = {"passed": True, "pdfs": pdfs, "total_pages": total_pages, "total_numbered_questions": total_questions, "bounded_characters": total_characters, "board_pixel_checks": board_pixels, "grid_measurements": grid_measurements, "grid_spacing_min_mm": min(m["spacing_min_mm"] for m in grid_measurements), "grid_spacing_max_mm": max(m["spacing_max_mm"] for m in grid_measurements)}
(root / "pdf-validation.json").write_text(json.dumps(result, ensure_ascii=True, indent=2), encoding="utf-8")
print(json.dumps({**result, "grid_measurements": len(grid_measurements)}, ensure_ascii=True, indent=2))
