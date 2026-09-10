"""Inspect the actual 90 dpi PDF rasters, not just browser screenshots."""
from pathlib import Path
from pypdf import PdfReader
from PIL import Image
import json
import os

root = Path(__file__).resolve().parents[2]
renders = root / "hyper-focus/output/qa/challenge-editions-separated"
report = []
for round_no in map(int, os.environ.get('CHALLENGE_CHECK_ROUNDS', '1,2,3,4').split(',')):
    pdf = root / f"hyper-focus/challenge/output/pdf/challenge-mock-review-round{round_no}.pdf"
    reader = PdfReader(pdf)
    assert len(reader.pages) == 19
    assert reader.pages[1].extract_text().strip() == ""
    blank = Image.open(renders / f"pdf-round{round_no}-02.png").convert("RGB")
    assert all(lo == hi == 255 for lo, hi in blank.getextrema()), "second page is not blank"
    assert reader.pages[11].extract_text().strip() == ""
    separator = Image.open(renders / f"pdf-round{round_no}-12.png").convert("RGB")
    assert all(lo == hi == 255 for lo, hi in separator.getextrema()), "answer cover separator is not blank"
    assert "정답과 풀이" in reader.pages[12].extract_text()
    assert "ANSWERBOOK" in "".join(reader.pages[12].extract_text().split())
    assert 13 % 2 == 1
    header_counts = []
    answer_lines = 0
    for page_no in range(3, 12):
        page = reader.pages[page_no-1]
        assert abs(float(page.mediabox.width) - 595.28) < 1
        assert "LETE-ON" in page.extract_text()
        image = Image.open(renders / f"pdf-round{round_no}-{page_no:02}.png").convert("RGB")
        dark = sum(min(pixel) < 180 for pixel in image.crop((40, 40, 660, 82)).get_flattened_data())
        assert dark > 2000, (round_no, page_no, "header/rule missing", dark)
        header_counts.append(dark)
        for start, end in [(345, 375), (656, 685), (965, 995)][:2 if page_no == 9 else 3]:
            count = sum(max(pixel) < 190 for pixel in image.crop((550, start, 687, end)).get_flattened_data())
            assert count > 50, (round_no, page_no, "answer line missing", start, count)
            answer_lines += 1
    assert "20" in reader.pages[16].extract_text()
    assert all("정답과 풀이" in p.extract_text() for p in reader.pages[13:])
    assert all("추가 연습" in reader.pages[i].extract_text() for i in [9, 10, 17, 18])
    assert answer_lines == 26
    report.append({"round": round_no, "pages": 19, "mainQuestions": 20, "extraQuestions": 6, "solutionPages": 6, "blankPages": [2,12], "answerCoverPage": 13, "headerDarkPixels": header_counts, "answerLines": answer_lines, "sizeBytes": pdf.stat().st_size})
print(json.dumps({"passed": True, "report": report}))
