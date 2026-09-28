# 교재 QR SVG 생성: python3 science-lab/bank/tools/make-qr.py s41-u01 [s41-u02 …]
# 단원마다 scene(① 궁금 3D 장면)·lab(② 실험실)·kit(준비물) 세 장. 기존 assets/qr-*.svg와 같은 모양(흰 바탕, 검정 사각 모듈, 여백 2).
# 필요: pip install qrcode
import sys, pathlib, qrcode
BASE = 'https://lete-on.gfieldacademy.net/science-lab/v2/#/'
OUT = pathlib.Path(__file__).resolve().parents[2] / 'assets'
KINDS = {'scene': '/2/scene', 'lab': '/2/lab', 'kit': '/kit'}
def svg(url):
    q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=2); q.add_data(url); q.make(fit=True)
    m = q.get_matrix(); n = len(m); d = []
    for y, row in enumerate(m):
        x = 0
        while x < n:
            if row[x]:
                s = x
                while x < n and row[x]: x += 1
                d.append(f'M{s} {y}h{x - s}v1h-{x - s}z')
            else: x += 1
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n} {n}" shape-rendering="crispEdges" role="img" aria-label="QR"><rect width="{n}" height="{n}" fill="#fff"/><path d="{"".join(d)}" fill="#000"/></svg>'
for u in sys.argv[1:]:
    for k, tail in KINDS.items():
        p = OUT / f'qr-{u}-{k}.svg'
        if p.exists(): print('있음', p.name); continue
        p.write_text(svg(BASE + u + tail)); print('만듦', p.name, '→', BASE + u + tail)
