"""Build the small Pages advanced-mode alias; never copy member data or keys."""
from pathlib import Path
import hashlib
import json
import zipfile

source = Path(__file__).resolve().parent
output = source.parents[1] / 'output' / 'roadmap-domain'
output.mkdir(parents=True, exist_ok=True)
files = {
    '_worker.js': (source / 'worker.mjs').read_bytes(),
    'index.html': ('<!doctype html><html lang="ko"><meta charset="utf-8">'
                   '<meta name="viewport" content="width=device-width,initial-scale=1">'
                   '<title>GFIELD 학습 로드맵</title><p>로드맵 연결을 확인해 주세요.</p>'
                   '<a href="https://lete-on.gfieldacademy.net/roadmap/demo2/account.html">'
                   '기존 로드맵 주소로 열기</a></html>').encode('utf-8'),
}
for name, content in files.items():
    (output / name).write_bytes(content)
archive = output.parent / 'roadmap-domain.zip'
with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED) as bundle:
    for name, content in files.items():
        bundle.writestr(name, content)
print(json.dumps({'archive': str(archive), 'files': [
    {'name': name, 'sha256': hashlib.sha256(content).hexdigest()}
    for name, content in files.items()
]}, ensure_ascii=False))
