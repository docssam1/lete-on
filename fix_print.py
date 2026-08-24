#!/usr/bin/env python3
p = 'fields-classic/program/index.html'
c = open(p, encoding='utf-8').read()
old = 'onclick="window.print()"'
new = """onclick="if(_pdfBase)window.open(_pdfBase,'_blank');else window.print()""""
if old in c:
    open(p, 'w', encoding='utf-8').write(c.replace(old, new))
    print("OK: 인쇄 버튼 → PDF 새탭으로 수정됨")
elif new in c:
    print("SKIP: 이미 적용됨")
else:
    print("NOT FOUND: 수동 확인 필요")
