"""Check text coordinates and rasterized answer strokes in the delivered PDFs."""
from pathlib import Path
import json
import pymupdf as fitz

root = Path(__file__).resolve().parents[1]
results = []
for round_no in range(1, 5):
    doc = fitz.open(root / 'challenge/output/pdf' / f'challenge-mock-review-round{round_no}.pdf')
    assert len(doc) == 21, (round_no, len(doc))
    assert '정답과 풀이' in doc[14].get_text()
    first = doc[0].get_text()
    assert all(s in first for s in ['2026년 9월', '챌린지 대비', '유치원', '주의사항'])
    expected = [2] * 13
    counts = []
    for i, count in enumerate(expected):
        page = doc[i]
        answers = [w for w in page.get_text('words') if w[4] == '답:']
        assert len(answers) == count, (round_no, i+1, len(answers), count)
        for w in answers:
            assert w[3] < page.rect.height-30, (round_no, i+1, 'answer at footer')
            raster = page.get_pixmap(matrix=fitz.Matrix(2, 2), clip=fitz.Rect(w[2]+5, w[1]-4, page.rect.width-35, w[3]+12), alpha=False)
            pixels = raster.samples
            dark = sum(max(pixels[j:j+3]) < 190 for j in range(0, len(pixels), 3))
            assert dark > 40, (round_no, i+1, 'answer line missing', dark)
        counts.append(count)
    assert not doc[13].get_text().strip(), (round_no, 'separator has content')
    px = doc[13].get_pixmap(alpha=False)
    assert min(px.samples) == 255
    for i, page in enumerate(doc):
        if i == 13:
            continue
        assert 'GFIELD' in page.get_text(), (round_no, i+1, 'watermark missing')
    assert sum(counts) == 26
    results.append(dict(round=round_no,pages=21,answerCover=15,responseFields=26,passed=True))
report = dict(passed=True,results=results)
(root / 'output/qa/challenge-editions-separated/pdf-current-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
