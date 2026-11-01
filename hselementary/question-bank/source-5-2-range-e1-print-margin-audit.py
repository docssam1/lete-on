"""Check A4 solution content margins in PDFs from the browser print audit."""
import logging
import sys
from pathlib import Path

logging.getLogger("pdfminer").setLevel(logging.ERROR)
import pdfplumber

directory = Path(sys.argv[1])
for count in (1, 12):
    path = directory / f"range-{count}-solution.pdf"
    with pdfplumber.open(path) as pdf:
        assert len(pdf.pages) == 1 if count == 1 else len(pdf.pages) > 1
        for number, page in enumerate(pdf.pages, 1):
            assert abs(page.width - 595.28) < 2 and abs(page.height - 841.89) < 2
            # The pale diagonal watermark is decorative and may extend to the edge.
            text = [c for c in page.chars if abs(c["matrix"][1]) < .1 and abs(c["matrix"][2]) < .1]
            assert text, f"{path.name} page {number}: no horizontal text"
            top = min(c["top"] for c in text)
            bottom = page.height - max(c["bottom"] for c in text)
            assert top >= 20 and bottom >= 20, f"{path.name} page {number}: margins {top:.1f}, {bottom:.1f} pt"
            print(f"{path.name} page {number}: text margins {top:.1f}, {bottom:.1f} pt")
