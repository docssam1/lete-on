"""PPTX(답 없는 문제지) 슬라이드마다 글자를 그대로 뽑고, OCR 결과와 다른 곳을 표로 낸다.
글상자·표 칸 글자는 PPTX에서 정확하게 나온다. OCR에만 있는 글자 = 수식 대체 그림·그림 속 글자일 가능성이 높다.

사용: python3 -I pptx-text.py <답 없는.pptx> <결과 폴더> [OCR 결과 폴더]
  → <결과>/sNN.pptx.txt (슬라이드 NN의 글자, 글상자 순서)
  OCR 폴더를 주면 쪽 pNN.txt와 비교해 <결과>/diff.md (수·낱말 단위 차이)
쪽 번호 pNN = 슬라이드 번호 NN(PDF 쪽 = 슬라이드 순서). 원본 글자가 들어 있으므로 결과는 저장소 밖에만 둔다.
"""
import html, os, re, sys, zipfile
from collections import Counter

src, out = sys.argv[1], sys.argv[2]
ocr = sys.argv[3] if len(sys.argv) > 3 else None
os.makedirs(out, exist_ok=True)
z = zipfile.ZipFile(src)
slides = sorted((n for n in z.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", n)), key=lambda n: int(re.search(r"(\d+)", n).group(1)))

def paragraphs(xml):
    for p in re.findall(r"<a:p>(.*?)</a:p>", xml, re.S):
        t = "".join(re.findall(r"<a:t>(.*?)</a:t>", p, re.S))
        t = html.unescape(t).strip()
        if t:
            yield t

TOKEN = re.compile(r"\d+|[가-힣]+|[A-Za-z]+|[□○△☆㉠-㉻①-⑳+\-−×÷=]")
def tokens(text):
    return Counter(t.replace("−", "-") for t in TOKEN.findall(text))

report = []
for n in slides:
    no = int(re.search(r"(\d+)", n).group(1))
    text = "\n".join(paragraphs(z.read(n).decode("utf-8")))
    open(os.path.join(out, f"s{no:02d}.pptx.txt"), "w", encoding="utf-8").write(text + "\n")
    if not ocr:
        continue
    f = os.path.join(ocr, f"p{no:02d}.txt")
    if not os.path.exists(f):
        continue
    a, b = tokens(text), tokens(open(f, encoding="utf-8").read())
    only_ocr = sorted((b - a).elements())
    only_pptx = sorted((a - b).elements())
    report.append(f"## 슬라이드 {no}\n- OCR에만(그림·수식일 수 있음): {' '.join(only_ocr) or '-'}\n- PPTX에만(OCR이 놓침): {' '.join(only_pptx) or '-'}\n")
print(f"slides {len(slides)} → {out}")
if ocr:
    open(os.path.join(out, "diff.md"), "w", encoding="utf-8").write("\n".join(report))
    print(f"diff {len(report)} slides → {os.path.join(out, 'diff.md')}")
