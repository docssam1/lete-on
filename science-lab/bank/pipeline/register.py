# 문제은행 단원을 units-index.js에 등록: python3 -I register.py <저장소> <단원id> [lesson]
import sys, re, subprocess, json
root, u = sys.argv[1], sys.argv[2]; lesson = len(sys.argv) > 3
out = subprocess.run(['node', '-e', f"import('{root}/science-lab/data/units/{u}.source.js').then(m=>console.log(JSON.stringify({{n:m.source.length,sets:[...new Set(m.source.map(x=>x.sourceRef.set))]}})))"], capture_output=True, text=True).stdout
d = json.loads(out)
p = f'{root}/science-lab/v2/units-index.js'; s = open(p).read()
var = 'tx' + u.replace('s', '').replace('-u', 'u').replace('-', '')
if f"'{u}': {{ sets" in s: s = re.sub(rf"  '{u}': \{{ sets: .*?\}},\n", '', s)
s = s.replace("export const BANK = {\n", f"export const BANK = {{\n  '{u}': {{ sets: {json.dumps(d['sets']).replace(',', ', ')}, n: {d['n']} }},\n")
if not lesson and f"'{u}': {{ subs" not in s:
    if f"as {var} " not in s:
        s = s.replace("\n// 탐구 지도의 정거장", f"import {{ taxonomy as {var} }} from '../data/units/{u}.taxonomy.js';\n\n// 탐구 지도의 정거장", 1)
    s = s.replace("export const READY = {\n", f"export const READY = {{\n  '{u}': {{ subs: subsOf({var}), bankOnly: true }},\n")
open(p, 'w').write(s); print(u, d)
