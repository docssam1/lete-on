"""Check that every page of the mixed Mission answer PDF has printable margins."""

import logging
import sys

import pdfplumber

logging.disable(logging.CRITICAL)
with pdfplumber.open(sys.argv[1]) as pdf:
    assert len(pdf.pages) >= 2, "The mixed answer sheet must span multiple pages"
    for number, page in enumerate(pdf.pages, 1):
        assert abs(page.width - 595.3) < 2 and abs(page.height - 841.9) < 2, "Expected A4"
        # Exclude the rotated background watermark from the content measurement.
        text = [c for c in page.chars if abs(c["matrix"][1]) < .1 and abs(c["matrix"][2]) < .1]
        assert text, f"Page {number} has no horizontal text"
        top = min(c["top"] for c in text)
        bottom = page.height - max(c["bottom"] for c in text)
        assert top >= 20 and bottom >= 20, f"Page {number} has insufficient margin: {top:.1f}/{bottom:.1f} pt"
        print(f"page {number}: top {top:.1f} pt, bottom {bottom:.1f} pt")
