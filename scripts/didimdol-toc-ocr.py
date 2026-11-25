#!/usr/bin/env python3
"""디딤돌 개념연산 PDF(스캔본) 차례 쪽만 맥 내장 OCR(Vision)로 읽는다 — 2026-11-25
원장 「그러면 맥 ocr 돌려」: 드라이브 PDF가 스캔본이라 클라우드 세션은 글을 못 읽는다.
수의 마법 유형 세분화(중1-1A 44유형 대조와 같은 방법)를 다른 권으로 넓히려면 권마다 차례(소단원·유형 이름)가 필요하다.

- 맥에 이미 있는 Vision 글자 인식을 쓴다. 돈·인터넷·API 없음.
- 앞쪽 몇 쪽 가운데 「차례처럼 보이는 쪽」(쪽 번호 10p·12p … 가 여러 줄)만 글로 남긴다. 본문 문제는 읽지 않는다.
- 결과는 PDF 폴더 안 「차례-OCR」 폴더에 권마다 .txt — 구글 드라이브가 올리면 Claude가 드라이브에서 읽는다.
  교재 글이므로 저장소(git)에는 넣지 않는다.
쓰는 법: scripts/local/didimdol-toc-ocr.command 더블클릭 (또는 python3 이 파일 [PDF 폴더])
"""
import os, re, sys, glob

def find_folder():
    if len(sys.argv) > 1 and os.path.isdir(sys.argv[1]):
        return sys.argv[1]
    home = os.path.expanduser('~')
    pats = [os.path.join(home, 'Library/CloudStorage/GoogleDrive-*/*/디딤돌 교재/00_PDF_ONLY 디딤돌 개념연산'),
            os.path.join(home, 'Library/CloudStorage/GoogleDrive-*/*/*/00_PDF_ONLY 디딤돌 개념연산'),
            os.path.join(home, 'Google Drive*/*/디딤돌 교재/00_PDF_ONLY 디딤돌 개념연산')]
    for p in pats:
        hit = sorted(glob.glob(p))
        if hit:
            return hit[0]
    return None

def ocr_page(page, Quartz, Vision, scale=3.0):
    box = Quartz.kPDFDisplayBoxMediaBox
    b = page.boundsForBox_(box)
    w, h = int(b.size.width * scale), int(b.size.height * scale)
    cs = Quartz.CGColorSpaceCreateDeviceRGB()
    ctx = Quartz.CGBitmapContextCreate(None, w, h, 8, 0, cs, Quartz.kCGImageAlphaPremultipliedLast)
    Quartz.CGContextSetRGBFillColor(ctx, 1, 1, 1, 1)
    Quartz.CGContextFillRect(ctx, Quartz.CGRectMake(0, 0, w, h))
    Quartz.CGContextScaleCTM(ctx, scale, scale)
    page.drawWithBox_toContext_(box, ctx)
    img = Quartz.CGBitmapContextCreateImage(ctx)
    req = Vision.VNRecognizeTextRequest.alloc().init()
    req.setRecognitionLevel_(Vision.VNRequestTextRecognitionLevelAccurate)
    req.setRecognitionLanguages_(['ko-KR', 'en-US'])
    req.setUsesLanguageCorrection_(True)
    handler = Vision.VNImageRequestHandler.alloc().initWithCGImage_options_(img, None)
    handler.performRequests_error_([req], None)
    boxes = []
    for o in (req.results() or []):
        c = o.topCandidates_(1)
        if not c:
            continue
        r = o.boundingBox()
        boxes.append((r.origin.x, r.origin.y + r.size.height / 2, r.size.height, str(c[0].string())))
    # 같은 높이의 글자 조각을 한 줄로 — 왼쪽에서 오른쪽, 위에서 아래
    boxes.sort(key=lambda t: -t[1])
    lines, cur = [], []
    for bx in boxes:
        if cur and abs(cur[-1][1] - bx[1]) > max(bx[2], cur[-1][2]) * 0.6:
            lines.append(cur); cur = []
        cur.append(bx)
    if cur:
        lines.append(cur)
    out = []
    for ln in lines:
        ln.sort(key=lambda t: t[0])
        parts, last = [], None
        for x, y, hh, s in ln:
            if last is not None and x - last > 0.06:
                parts.append('  |  ')
            elif parts:
                parts.append(' ')
            parts.append(s)
            last = x + 0.01 * len(s)
        out.append(''.join(parts))
    return out

def looks_like_toc(lines):
    n = sum(1 for l in lines if re.search(r'\b\d{1,3}\s*[pP쪽]\b|\d{1,3}\s*p$', l))
    m = sum(1 for l in lines if re.match(r'^\s*0\d\b', l))
    return n >= 5 or (n >= 3 and m >= 3)

def main():
    try:
        import Quartz, Vision
        from Foundation import NSURL
    except Exception as e:
        print('  [!] 맥 Vision 을 불러오지 못했습니다:', e); return 1
    folder = find_folder()
    if not folder:
        print('  [!] PDF 폴더를 찾지 못했습니다. 「00_PDF_ONLY 디딤돌 개념연산」 폴더를 이 창에 끌어다 놓고 엔터를 누르세요.')
        folder = input('  폴더: ').strip().strip("'\"").replace('\\ ', ' ')
        if not os.path.isdir(folder):
            print('  [!] 폴더가 아닙니다:', folder); return 1
    pdfs = sorted(p for p in glob.glob(os.path.join(folder, '**', '*.pdf'), recursive=True)
                  if '개념연산' in os.path.basename(p) and '정답' not in os.path.basename(p))
    seen, todo = set(), []
    for p in pdfs:
        k = re.sub(r'\s*\(\d+\)|-복사', '', os.path.basename(p))
        if k not in seen:
            seen.add(k); todo.append(p)
    outdir = os.path.join(folder, '차례-OCR')
    os.makedirs(outdir, exist_ok=True)
    print(f'  폴더: {folder}\n  책 {len(todo)}권 — 앞쪽 14쪽 가운데 차례 쪽만 읽습니다.')
    summary = []
    for p in todo:
        name = os.path.splitext(os.path.basename(p))[0]
        doc = Quartz.PDFDocument.alloc().initWithURL_(NSURL.fileURLWithPath_(p))
        if doc is None:
            print(f'   - {name}: 열지 못함'); continue
        got = []
        for i in range(min(14, doc.pageCount())):
            lines = ocr_page(doc.pageAtIndex_(i), Quartz, Vision)
            if looks_like_toc(lines):
                got.append((i + 1, lines))
        with open(os.path.join(outdir, name + ' 차례.txt'), 'w', encoding='utf-8') as f:
            f.write(f'# {name} — 차례 쪽 OCR (PDF {doc.pageCount()}쪽 중 {", ".join(str(g[0]) for g in got) or "찾지 못함"}쪽)\n')
            f.write('# 맥 Vision 글자 인식 결과 — 틀린 글자가 있을 수 있음. 교재 글이라 git에 넣지 않는다.\n\n')
            for no, lines in got:
                f.write(f'## PDF {no}쪽\n' + '\n'.join(lines) + '\n\n')
        print(f'   - {name}: 차례 쪽 {len(got)}개')
        summary.append((name, len(got)))
    print(f'\n  끝. 결과: {outdir}\n  구글 드라이브 동기화가 끝나면 Claude 에게 「OCR 끝났어」라고 알려 주세요.')
    return 0

if __name__ == '__main__':
    sys.exit(main())
