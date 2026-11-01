"""Check physical A4 pages of the 15-question mixed page 61 audit PDF."""
import logging
import sys

import pdfplumber

logging.disable(logging.CRITICAL)
expected = [{1, 2, 3, 4}, {5, 6, 7, 8}, {9, 10, 11, 12}, {13, 14, 15}]
with pdfplumber.open(sys.argv[1]) as pdf:
    assert len(pdf.pages) == len(expected), f"Expected 4 physical pages, got {len(pdf.pages)}"
    for number, (page, wanted) in enumerate(zip(pdf.pages, expected), 1):
        assert abs(page.width - 595.3) < 2 and abs(page.height - 841.9) < 2, f"Page {number} is not A4"
        words = page.extract_words()
        found = {int(w['text']) for w in words if w['text'].isdigit() and 1 <= int(w['text']) <= 15
                 and (40 <= w['x0'] <= 50 or 310 <= w['x0'] <= 324) and 75 <= w['top'] <= 750}
        assert found == wanted, f"Page {number}: expected {sorted(wanted)}, got {sorted(found)}"
print('PASS: A4 physical pages contain problems 1–4, 5–8, 9–12 and 13–15')
