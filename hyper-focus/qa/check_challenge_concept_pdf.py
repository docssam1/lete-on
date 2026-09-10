from pathlib import Path
from pypdf import PdfReader
from PIL import Image
import json
root=Path(__file__).resolve().parents[2]
out=root/"hyper-focus/output/qa/challenge-concepts"
pdf=root/"hyper-focus/challenge/output/pdf/challenge-concepts-complete.pdf"
reader=PdfReader(pdf)
assert len(reader.pages)==104
assert "연습 정답과 풀이" in reader.pages[78].extract_text()
for number,page in enumerate(reader.pages,1):
    assert abs(float(page.mediabox.width)-595.28)<1
    assert page.extract_text().strip()
    raster=Image.open(out/f"pdf-{number:03}.png").convert("RGB")
    assert raster.width>600 and raster.height>850
    assert min(raster.getextrema()[0])<100
for unit in range(1,75):
    assert f"개념 {unit}" in reader.pages[unit+3].extract_text()
report={"passed":True,"pages":104,"units":74,"answerCoverPage":79,"rasterPages":104,"bytes":pdf.stat().st_size}
(out/"pdf-report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps(report))
