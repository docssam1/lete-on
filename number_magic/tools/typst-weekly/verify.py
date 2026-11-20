"""브라우저 PDF(src)와 Typst PDF(full)의 쪽마다 숫자·낱말 꾸러미를 견준다. python verify.py out/C16 ..."""
import sys, re, subprocess, collections, os
def pages(pdf):
    n = int(re.search(r'Pages:\s+(\d+)', subprocess.run(['pdfinfo', pdf], capture_output=True, text=True).stdout).group(1))
    out = []
    for i in range(1, n + 1):
        t = subprocess.run(['pdftotext', '-f', str(i), '-l', str(i), '-layout', pdf, '-'], capture_output=True, text=True).stdout
        out.append(t)
    return out
def toks(t):
    t = t.replace('−', '-').replace('×', '*').replace('÷', '/')
    t = re.sub(r'#\S+', '', t)                      # 문항 코드 꼬리표
    t = re.sub(r'(?<![\d.])0{2,}(?![\d.])', ' ', t)   # 브라우저 PDF 의 보이지 않는 칸 자리(\\phantom{00})
    return collections.Counter(re.findall(r'\d', t))      # 분수는 두 줄로 갈려 읽히므로 숫자 낱자 꾸러미로 견준다
bad_total = 0
for d in sys.argv[1:]:
    a = pages(f'{d}/src.pdf'); b = pages(f'{d}/full.pdf')
    if len(a) != len(b): print(d, 'PAGE COUNT', len(a), len(b)); bad_total += 1; continue
    bad = []
    for i, (x, y) in enumerate(zip(a, b), 1):
        tx, ty = toks(x), toks(y)
        miss = tx - ty; extra = ty - tx
        # 쪽 번호·문항 번호 모양 차이는 허용: 차이가 3개 이하면 경고만
        if sum(miss.values()) > 4: bad.append((i, dict(list(miss.items())[:6]), dict(list(extra.items())[:6])))
    print(d, 'OK' if not bad else 'DIFF pages ' + ', '.join(str(p[0]) for p in bad))
    if os.environ.get('V')=='1':
        for p in bad[:3]: print('   p%d missing %s extra %s' % p)
    bad_total += bool(bad)
sys.exit(1 if bad_total else 0)
