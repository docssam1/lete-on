# 끝난 문제은행 단원 마무리: 테스트 목록 등록 · units-index 등록 · 검사. python3 -I finish.py <단원id>...
import sys, re, subprocess, json
import os
S = os.path.dirname(os.path.abspath(__file__)); R = os.path.abspath(os.path.join(S, '..', '..', '..'))   # 저장소 뿌리
for u in sys.argv[1:]:
    info = json.loads(subprocess.run(['node', '-e', f"Promise.all([import('{R}/science-lab/data/units/{u}.js'),import('{R}/science-lab/data/units/{u}.source.js'),import('{R}/science-lab/data/units/{u}.similar.js')]).then(([a,b,c])=>console.log(JSON.stringify({{t:a.unit.title,i:a.items.length,s:b.source.length,v:c.similar.length}})))"], capture_output=True, text=True).stdout)
    p = f'{R}/science-lab/bank/judge.test.mjs'; s = open(p).read()
    if f"'{u}'" not in s.split('const U = [')[1].split(']')[0]:
        s = s.replace("const U = [", f"const U = ['{u}', ", 1); open(p, 'w').write(s)
    p = f'{R}/science-lab/bank/audit.test.mjs'; s = open(p).read()
    lines = [f"{u} {info['t']}: {info['i']}문항", f"{u} 유사문항: {info['v']}개", f"{u} 원문: {info['s']}개"]
    s = re.sub(rf"  '{re.escape(u)} 유사문항: (?!{info['v']}개)\d+개',\n", '', s)   # 레슨 단원의 옛 유사문항 수(20개 등)
    for ln in lines:
        if f"'{ln}'" not in s: s = s.replace(" for(const expected of [\n", f" for(const expected of [\n  '{ln}',\n", 1)
    open(p, 'w').write(s)
    import os
    has_lesson = os.path.exists(f'{R}/science-lab/data/units/{u}.lesson.js')
    subprocess.run(['python3', '-I', f'{S}/register.py', R, u] + (['nolesson-stop'] if u.endswith(('-mid', '-fin')) or has_lesson else []), check=True)
    if has_lesson:   # 레슨 단원 로더에 원문(source.js)을 붙인다
        p = f'{R}/science-lab/v2/v2.js'; s = open(p).read()
        imp = f"...(await import('../data/units/{u}.source.js')), "
        sim = f"...(await import('../data/units/{u}.similar.js')), "
        if imp not in s:
            assert sim in s, f'{u} 로더 없음'
            s = s.replace(sim, sim + imp, 1); open(p, 'w').write(s)
    print(u, info)
subprocess.run(['node', 'bank/taxonomy/build.mjs'], cwd=f'{R}/science-lab', capture_output=True)
for cmd in (['node', 'bank/audit.mjs'], ['node', 'bank/misc-audit.mjs'], ['node', 'bank/written-audit.mjs']):
    r = subprocess.run(cmd, cwd=f'{R}/science-lab', capture_output=True, text=True)
    bad = [l for l in r.stdout.splitlines() if '✗' in l]
    print(cmd[1], 'OK' if not bad and r.returncode == 0 else bad[:8])
r = subprocess.run('node --test bank/*.test.mjs v2/*.test.mjs 2>&1 | grep -E "^# (pass|fail)|^not ok"', shell=True, cwd=f'{R}/science-lab', capture_output=True, text=True)
print(r.stdout)
