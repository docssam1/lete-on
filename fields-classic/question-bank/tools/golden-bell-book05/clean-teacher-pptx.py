"""교사용 골든벨 PPTX에서 답(빨강 FF0000)·풀이(파랑 0070C0) 글자와 선을 지워 '답 없는 문제지'를 만든다.
5권처럼 학생용 원본이 없고 교사용 슬라이드에 답이 함께 적힌 권에 쓴다. 원본·결과물은 저장소 밖 임시 폴더에만 둔다.

사용: python3 clean-teacher-pptx.py <교사용.pptx> <결과.pptx>
      soffice --headless --convert-to pdf --outdir <폴더> <결과.pptx>   # 그다음 PyMuPDF로 쪽 그림
주의: 표 안이나 그림(이미지)으로 박힌 빨간 표시는 남을 수 있다 — 결과를 눈으로 확인할 것.
      파란 글자가 문제 본문인 슬라이드가 있으면 그 쪽은 교사용 원본과 나란히 보고 판단한다.
"""
import re, sys, zipfile

TEACHER = ("FF0000", "0070C0")
COLOR = r'srgbClr val="(?:' + "|".join(TEACHER) + r')"'

def kind(shape):
    runs = re.findall(r"<a:r>(.*?)</a:r>", shape, re.S)
    if runs:
        cols = []
        for run in runs:
            if not re.sub(r"<[^>]+>", "", run).strip():
                continue
            m = re.search(r'<a:srgbClr val="([0-9A-Fa-f]{6})"', run)
            cols.append(m.group(1).upper() if m else "NONE")
        if cols and all(c in TEACHER for c in cols):
            return "drop"
        if any(c in TEACHER for c in cols):
            return "mixed"
        return "keep"
    line = re.search(r"<a:ln[^>]*>.*?</a:ln>", shape, re.S)
    return "drop" if line and re.search(COLOR, line.group(0)) else "keep"

def clean_slide(xml):
    def repl(m):
        k = kind(m.group(0))
        if k == "drop":
            return ""
        if k == "mixed":
            return re.sub(r"<a:r>((?:(?!</a:r>).)*?" + COLOR + r"(?:(?!</a:r>).)*?)</a:r>", "", m.group(0), flags=re.S)
        return m.group(0)
    xml = re.sub(r"<p:(?:sp|cxnSp)>.*?</p:(?:sp|cxnSp)>", repl, xml, flags=re.S)
    return re.sub(r"<a:r>((?:(?!</a:r>).)*?" + COLOR + r"(?:(?!</a:r>).)*?)</a:r>", "", xml, flags=re.S)

def main(src, dst):
    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as zout:
        for info in zin.infolist():
            data = zin.read(info.filename)
            if re.match(r"ppt/slides/slide\d+\.xml$", info.filename):
                data = clean_slide(data.decode("utf8")).encode("utf8")
            zout.writestr(info, data)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
