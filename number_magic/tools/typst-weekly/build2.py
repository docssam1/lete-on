"""extract2.js 결과(out/<과정>/data.json + src.pdf) → Typst 전체판.
   python build2.py out/C16   → out/C16/full.typ, full.pdf"""
import json, re, sys, os, shutil
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import tex2typ as _old_tex2typ, esc
import subprocess
_CACHE = {}
def preconvert(data_path):
    raw = open(data_path, encoding='utf8').read()
    found = set()
    def walk(o):
        if isinstance(o, str):
            for m in re.findall(r'⟦(.*?)⟧', o): found.add(m)
        elif isinstance(o, list):
            for v in o: walk(v)
        elif isinstance(o, dict):
            for v in o.values(): walk(v)
    walk(json.loads(raw))
    xs = sorted(found)
    d = os.path.dirname(data_path)
    open(os.path.join(d, 'tex-in.json'), 'w').write(json.dumps(xs))
    r = subprocess.run(['node', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'conv.js'), os.path.join(d, 'tex-in.json'), os.path.join(d, 'tex-out.json')], capture_output=True, text=True)
    if r.returncode: print('conv.js fail', r.stderr[:300]); return
    outs = json.load(open(os.path.join(d, 'tex-out.json')))
    miss = 0
    for a, b in zip(xs, outs):
        if b: _CACHE[a] = b
        else: miss += 1
    print('tex', len(xs), 'new', len(xs) - miss, 'fallback', miss)
def tex2typ(t):
    return _CACHE.get(t) or _old_tex2typ(t)

def _esc_top(e):
    """display(...) 안에서 맨 윗단의 , : ; 는 인자 구분으로 읽힌다 — 글자 그대로 찍히게 \\ 를 붙인다."""
    out = []; depth = 0; inq = False; i = 0
    while i < len(e):
        c = e[i]
        if inq:
            out.append(c)
            if c == '\\' and i + 1 < len(e): out.append(e[i+1]); i += 1
            elif c == '"': inq = False
        elif c == '"': inq = True; out.append(c)
        elif c == '\\' and i + 1 < len(e): out.append(c); out.append(e[i+1]); i += 1
        elif c in '([{': depth += 1; out.append(c)
        elif c in ')]}': depth -= 1; out.append(c)
        elif depth == 0 and c in ',:;': out.append('\\' + c)
        else: out.append(c)
        i += 1
    return ''.join(out)
def dm(tex):
    return '$display(' + _esc_top(tex2typ(tex)) + ')$'

HERE = os.path.dirname(os.path.abspath(__file__))
NM = os.path.join(HERE, '..', '..') + os.sep
FONTS = [os.environ.get('NM_TYPST_FONTS') or os.path.join(HERE, 'fonts')]   # Pretendard 정적 OTF 폴더 (README)

def rich(text):
    parts = re.split(r'⟦(.*?)⟧', text); out = []
    for k, p in enumerate(parts):
        if k % 2: out.append(dm(p))
        else:
            t = esc(p)
            if k and k < len(parts) - 1 and not t.strip(): t = '#h(1.4em);'
            t = t.replace('→', '#h(0.5em);→#h(0.5em);').replace('⇒', '#h(0.5em);⇒#h(0.5em);')
            out.append(t)
    return ''.join(out)

def S(x): return '"' + str(x).replace('\\', '\\\\').replace('"', '\\"') + '"'
def num(x): return f'{x:.2f}'

def snip(pg, r):
    x, y, w, h = r
    return f'snip({pg}, {num(x)}, {num(y)}, {num(w)}, {num(h)})'

def head_typ(p):
    h = p.get('head') or {}
    day = re.sub(r'\D', '', h.get('day', '')) or ''
    code = h.get('code', '')
    return f'#pagehead({S(h.get("title",""))}, {S(h.get("no",""))}, {S(day)}, {S(code)}, {"true" if h.get("first") else "false"}, {S(h.get("total",""))}, {S((p.get("foot") or {}).get("code",""))})'

def train_cell(it):
    t = it.get('text', '')
    note = None
    if '⟦' in t and not t.startswith('⟦'):
        note, t = t.split('⟦', 1); t = '⟦' + t; note = note.strip()
    maths = re.findall(r'⟦(.*?)⟧', t)
    if not maths: return None
    expr = dm(maths[0])
    steps = ['[' + dm(x) + ']' for x in maths[1:]]
    nt = f'[{esc(note)}]' if note else 'none'
    return f'tcard({S(it["no"])}, {nt}, [{expr}], ({", ".join(steps)}{"," if len(steps) == 1 else ""}), {"true" if len(maths) == 1 else "false"})'

def word_cell(it):
    m = re.match(r'(.*?)풀이식:\s*답:\s*(.*)$', it.get('text', ''))
    if not m: return None
    return f'wcard({S(it["no"])}, [{rich(m.group(1).strip())}], [{esc(m.group(2).strip())}])'

def grid_typ(g, pg):
    cells = []
    for it in g['items']:
        if it.get('clip'):
            body = f'ccard({S(it["no"])}, {"true" if it["challenge"] else "false"}, {snip(pg, it["clip"])})'
        elif g['kind'] == 'train':
            body = train_cell(it) or f'pcard({S(it["no"])}, false)[{rich(it.get("text",""))}]'
        elif g['kind'] == 'word':
            body = word_cell(it) or f'pcard({S(it["no"])}, false)[{rich(it.get("text",""))}]'
        else:
            body = f'pcard({S(it["no"])}, {"true" if it["challenge"] else "false"})[{rich(it.get("text",""))}]'
        cells.append(f'grid.cell(x: {max(it["col"],0)}, y: {max(it["row"],0)}, {body})')
    gap = '3mm' if g['kind'] in ('word', 'train') else '4mm'
    return f'#pgrid({g["cols"]}, {g["rows"]}, {gap}, ' + ', '.join(cells) + ')'

def learn_page(p, pg):
    L = [head_typ(p)]
    for x in p['parts']:
        t = x['t']
        if t == 'concept':
            kk = x.get("kicker","").replace("개념 · ","").replace("개념","")
            rp = ('\n#ramp[' + esc(x["ramp"]) + ']') if x.get('ramp') else ''
            L.append(f'#concept({S(kk)})[{rich(x["text"])}]' + rp)
        elif t == 'example':
            ex = re.sub(r"^예시\s*", "", x["text"])
            L.append(f'#example[{rich(ex)}]')
        elif t == 'guide':
            cells = [f'gcard({S(g["lab"])})[{rich(g["text"])}]' for g in x['items']]
            L.append('#guide(' + ', '.join(cells) + ')')
        elif t == 'instr':
            L.append(f'#instr[{esc(x["text"])}]')
        elif t == 'banner':
            L.append('#tbanner')
        elif t == 'retry':
            qa = S("svg-%d.svg" % x["qr"]) if x.get("qr") is not None else "none"
            L.append(f'#retry({qa})')
        elif t == 'grid':
            L.append(grid_typ(x, pg))
        elif t == 'clip':
            if x.get('fit'): L.append('#' + snip(pg, x['r']).replace('snip(', 'snipfit(', 1))
            else: L.append(f'#block(above: 3mm, below: 3mm, {snip(pg, x["r"])})')
    return '\n'.join(L)

def answer_page(p, pg):
    L = [f'#akpagehead({S((p.get("foot") or {}).get("code",""))})']
    for sec in p['parts']:
        m = re.match(r'(.*?)\s+((?:#|MAGIC-)\S+)$', sec.get('title', ''))
        title, code = (m.group(1), m.group(2)) if m else (sec.get('title', ''), '')
        L.append(f'#akhead[{esc(title)}][{esc(code)}]')
        if sec.get('clip'):
            L.append(f'#{snip(pg, sec["clip"])}'); continue
        for tp in sec.get('tips') or []:
            L.append(f'#aktip[{rich(tp)}]')
        for rw in sec.get('raw') or []:
            L.append(f'#block(above: 1.5mm, text(9.5pt)[{rich(rw)}])')
        if sec['guide']:
            L.append('#akguide(' + ', '.join(f'[{rich(g)}]' for g in sec['guide']) + ')')
        run = []; wide = any(i.get('clip') or len(i.get('text','')) > 14 for i in sec['items'] if not i.get('chain') and not i.get('pgLabel'))
        fn = 'akwide' if wide else 'akitems'
        def flush():
            if run: L.append(f'#{fn}(' + ', '.join(run) + ')'); run.clear()
        for it in sec['items']:
            if it.get('pgLabel'):
                flush(); L.append(f'#akpg({S(it["pgLabel"])})'); continue
            if it.get('clip'):
                run.append(snip(pg, it['clip']))
            elif it.get('chain') or '⟦' in it['text'] and len(it['text']) > 30:
                flush()
                mm = re.match(r'\((\d+)\)\s*(\S+)\s*(.*)$', it['text'])
                if mm: L.append(f'#akchain({S(mm.group(1))}, {S(mm.group(2))}, [{rich(mm.group(3))}])')
                else: L.append(f'#block[{rich(it["text"])}]')
            else:
                run.append(f'[{rich(it["text"])}]')
        flush()
    return '\n'.join(L)

def contents_page(c):
    rows = []
    for r in c['rows']:
        r = (r + [''] * 6)[:6]
        day, no, name, cnt, pages, chk = r
        if not no:
            rows.append(f'[], [], text(fill: sub)[{esc(name)}], [], text(fill: sub)[{esc(pages)}], []')
        else:
            rows.append(f'pill(fill: rgb("#EEF3FA"), color: ink)[{esc(day)}], text(weight: 800, fill: ink)[{esc(no)}], [{esc(name)}], [{esc(cnt)}], [{esc(pages)}], box(width: 3.2mm, height: 3.2mm, stroke: 0.8pt + ink, radius: 1pt)')
    b = c.get('bottom', [])
    total = next((x for x in b if re.match(r'^/\s*\d+', x)), '')
    sumline = next((x for x in b if '총' in x and '쪽' in x), '')
    url = next((x for x in b if 'github.io' in x or 'docssam1' in x), '')
    head = next((x for x in b if '추가 학습' in x), '')
    sub2 = next((x for x in b if x.startswith('QR')), '')
    code = next((x for x in b if re.match(r'^S-C\d+', x)), '')
    mentor = 'mentor.png' if c.get('mentorImg') else None
    tbl = ',\n    '.join(rows)
    TOTAL = esc(total).replace('/', '\\/')
    return f'''#page(footer: none)[
#grid(columns: (1fr, auto), align: (left + horizon, right + horizon), image("gfield-logo.png", height: 8mm),
  text(8.5pt, weight: 700, fill: ink, tracking: 0.14em)[NUMBERS #text(fill: gold)[of] MAGIC])
#v(9mm)
#text(9pt, weight: 700, fill: gold, tracking: 0.08em)[{esc(c["kicker"])}]
#v(1mm)
#text(25pt, weight: 800, fill: ink, tracking: -0.02em)[{esc(c["title"])}]
#v(1mm)
#text(11pt, fill: sub)[{esc(c["tagline"])}]
#v(3mm)
#text(11pt, weight: 700)[{esc(c["course"])}]
#v(5mm)
#block(width: 100%, fill: paper, radius: 8pt, inset: (x: 12pt, y: 8pt),
  grid(columns: ({"16mm, " if mentor else ""}1fr), column-gutter: 10pt, align: horizon,
    {f'image("{mentor}", height: 18mm),' if mentor else ''}
    [#text(11.5pt, weight: 800, fill: ink)[{esc(c["mentorTitle"])}] \\ #text(9.5pt, fill: sub)[{esc(c["mentorText"])}]]))
#v(5mm)
#align(center, pill(fill: gold)[{esc(c["daily"])}])
#v(3mm)
#set text(10pt)
#table(columns: (24mm, 9mm, 1fr, 17mm, 19mm, 11mm), stroke: (x, y) => (bottom: if y == 0 {{ 1.2pt + ink }} else {{ 0.5pt + line-c }}),
  inset: (x: 4pt, y: 6.2pt), align: (left + horizon, center + horizon, left + horizon, right + horizon, right + horizon, center + horizon),
  table.header(..("하루", "", "유형", "문항", "쪽", "완료").map(h => text(8.5pt, weight: 700, fill: sub, h))),
    {tbl})
#v(1fr)
#grid(columns: (auto, 1fr, 8mm, auto, 1fr, auto, 8mm, auto, 1fr), column-gutter: 2mm, align: bottom,
  text(9.5pt, weight: 700, fill: sub)[푼 날짜], block(width: 100%, stroke: (bottom: 0.6pt + luma(120)), v(5mm)), [],
  text(9.5pt, weight: 700, fill: sub)[점수], block(width: 100%, stroke: (bottom: 0.6pt + luma(120)), v(5mm)), text(10pt, weight: 800, fill: gold)[{TOTAL}], [],
  text(9.5pt, weight: 700, fill: sub)[확인], block(width: 100%, stroke: (bottom: 0.6pt + luma(120)), v(5mm)))
#v(7mm)
#block(width: 100%, radius: 8pt, stroke: 1pt + line-c, inset: 10pt,
  grid(columns: (24mm, 1fr, auto), column-gutter: 10pt, align: (left + horizon, left + horizon, right + horizon),
    {f'image("svg-{c["qr"]}.svg", width: 24mm)' if c.get("qr") is not None else '[]'},
    [#text(10.5pt, weight: 800, fill: ink)[{esc(head)}] \\
     #text(8.5pt, fill: sub)[{esc(sub2)}] \\
     #text(8pt, fill: ink)[{esc(url)}]],
    align(right, [#text(9.5pt, weight: 800, fill: ink)[{esc(sumline)}] \\ #text(8pt, fill: sub)[GFIELD · Numbers of Magic] \\ #text(7.5pt, fill: luma(150), features: (calt: 0))[{esc(code)}]])))
]'''

def main():
    out = sys.argv[1]
    d = json.load(open(os.path.join(out, 'data.json')))
    preconvert(os.path.join(out, 'data.json'))
    for f, src in (('gfield-logo.png', 'assets/gfield-logo.png'), ('docssam.png', 'assets/characters/docssam.png'), ('momo-8-happy.png', 'assets/characters/momo-8-happy.png')):
        shutil.copy(os.path.join(NM, src), os.path.join(out, f))
    if d.get('cvw') and d['cvw'].get('mentorImg'):
        shutil.copy(os.path.join(NM, d['cvw']['mentorImg']), os.path.join(out, 'mentor.png'))
    T = open(os.path.join(HERE, 'tpl2.typ')).read()
    body = []
    for i, top in enumerate(d['tops']):
        pg = i + 1
        if top['kind'] == 'cover': body.append(f'#embed({pg})'); continue
        if top['kind'] == 'cvw': body.append(contents_page(d['cvw'])); continue
        p = d['pages'][top['pi']]
        if p['kind'] == 'embed': body.append(f'#embed({pg})')
        elif p['kind'] == 'answer': body.append(answer_page(p, pg) + '\n#pagebreak(weak: true)')
        else: body.append(learn_page(p, pg) + '\n#pagebreak(weak: true)')
    open(os.path.join(out, 'full.typ'), 'w').write(T + '\n' + '\n'.join(body))
    import typst
    try:
        typst.compile(os.path.join(out, 'full.typ'), output=os.path.join(out, 'full.pdf'), font_paths=FONTS)
    except Exception as e:
        print('TYPST ERROR', getattr(e, 'diagnostic', e)); sys.exit(1)
    print('ok', out)

if __name__ == '__main__':
    main()
