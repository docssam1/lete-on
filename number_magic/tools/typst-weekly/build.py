"""시범: ws.html 학습지에서 뽑은 글·수식(TeX)을 Typst 조판으로 다시 짠다.
   python build.py <c16-data.json> <out.typ> <첫 쪽> <끝 쪽>"""
import json, re, sys

def parse_arg(s, i):
    """s[i]가 '{' 또는 '['일 때 짝 괄호 안 글과 다음 위치"""
    open_c = s[i]; close_c = '}' if open_c == '{' else ']'
    depth = 0; j = i
    while j < len(s):
        if s[j] == open_c: depth += 1
        elif s[j] == close_c:
            depth -= 1
            if depth == 0: return s[i+1:j], j+1
        j += 1
    return s[i+1:], len(s)

def skip_ws(s, i):
    while i < len(s) and s[i] == ' ': i += 1
    return i

def tex2typ(s):
    out = []; i = 0
    while i < len(s):
        ch = s[i]
        if ch == '\\':
            m = re.match(r'\\([a-zA-Z]+|.)', s[i:]); cmd = m.group(1); i += len(m.group(0))
            i = skip_ws(s, i)
            if cmd in ('dfrac', 'frac'):
                a, i = parse_arg(s, skip_ws(s, i)); b, i = parse_arg(s, skip_ws(s, i))
                out.append(f' frac({tex2typ(a)}, {tex2typ(b)}) ')
            elif cmd == 'boxed':
                a, i = parse_arg(s, i)
                ph = re.search(r'\\phantom\{([^}]*)\}', a)
                n = len(ph.group(1)) if ph else 1
                out.append(f' #blank({n}) ')
            elif cmd == 'color':
                col, i = parse_arg(s, i); a, i = parse_arg(s, skip_ws(s, i))
                out.append(f' #text(fill: rgb("{col}"))[${tex2typ(a)}$] ')
            elif cmd == 'text':
                a, i = parse_arg(s, i); out.append(f' "{a.strip()}" ')
            elif cmd == 'mathbf':
                a, i = parse_arg(s, i); out.append(f' bold({tex2typ(a)}) ')
            elif cmd in ('phantom', 'vphantom'):
                _, i = parse_arg(s, i)
            elif cmd == 'kern':
                if i < len(s) and s[i] == '{': _, i = parse_arg(s, i)
            elif cmd == 'rule':
                if i < len(s) and s[i] == '[': _, i = parse_arg(s, i)
                _, i = parse_arg(s, skip_ws(s, i)); _, i = parse_arg(s, skip_ws(s, i))
            elif cmd == 'displaystyle': pass
            elif cmd == 'times': out.append(' times ')
            elif cmd == 'div': out.append(' div ')
            elif cmd == 'cdots': out.append(' dots.c ')
            elif cmd in (';', ',', ' ', 'quad'): out.append(' ')
            else: out.append(f' "{cmd}" ')
        elif ch in '{}': i += 1
        elif re.match(r'[A-Za-z가-힣]', ch):
            m = re.match(r'[A-Za-z가-힣]+', s[i:]); w = m.group(0); i += len(w)
            out.append(f' "{w}" ' if len(w) > 1 or re.match('[가-힣]', w) else f' {w} ')
        elif ch == '−': out.append(' - '); i += 1
        else: out.append(ch); i += 1
    return re.sub(r' +', ' ', ''.join(out)).strip()

def esc(t):
    return re.sub(r'([#$*_@<>\[\]\\`~])', r'\\\1', t)

def rich(text, display=False):
    """⟦tex⟧ 섞인 글 → Typst 마크업"""
    parts = re.split(r'⟦(.*?)⟧', text); out = []
    for k, p in enumerate(parts):
        if k % 2: out.append('$display(' + tex2typ(p) + ')$')
        else:
            t = esc(p)
            if k and k < len(parts) - 1 and not t.strip(): t = '#h(1.4em)'
            t = t.replace('→', '#h(0.5em)→#h(0.5em)')
            out.append(t)
    return ''.join(out)

def head_info(t):
    m = re.search(r'([A-Z]+\d*-L\d+) · \d+/\d+일차 (\d+) \d+일차(.*)$', t)
    if not m: return '', '', ''
    return m.group(1), m.group(2), m.group(3).strip()

def page_typ(pg):
    parts = {p['cls'].split()[0]: p for p in pg['parts']}
    head = parts.get('nm-w2-head', {}).get('text', '')
    code, dayn, title = head_info(head)
    first = '푼 날짜' in head
    tot = re.search(r'점수: / (\d+)', head)
    L = [f'#pagehead("{esc(title)}", "{dayn}", "{code}", {"true" if first else "false"}, "{tot.group(1) if tot else ""}")']
    for p in pg['parts']:
        c = p['cls'].split()[0]
        if c == 'nm-w2-concept':
            L.append(f'#concept[{rich(p["text"].replace("개념 · ", "", 1))}]')
        elif c == 'nm-w2-example':
            L.append(f'#example[{rich(p["text"].replace("예시 ", "", 1))}]')
        elif c == 'nm-w2-guide':
            t = p['text'].replace('따라 풀어 보세요. ', '', 1)
            items = [x for x in re.split(r'(?=\([가-하]\))', t) if x.strip()]
            cells = []
            for x in items:
                m = re.match(r'\(([가-하])\)(.*)', x.strip())
                cells.append(f'gcard("{m.group(1)}")[{rich(m.group(2).strip())}]')
            L.append('#guide(' + ', '.join(cells) + ')')
        elif c == 'nm-w2-instr':
            L.append(f'#instr[{esc(p["text"])}]')
        elif c == 'nm-w2-grid':
            cells = []
            for it in p['items']:
                m = re.match(r'\((\d+)\)(여기부터 도전)?(.*)', it)
                if not m: continue
                cells.append(f'pcard("{m.group(1)}", {"true" if m.group(2) else "false"})[{rich(m.group(3))}]')
            L.append('#probs(' + ', '.join(cells) + ')')
    return '\n'.join(L)

TEMPLATE = open(__file__.replace('build.py', 'tpl.typ')).read()

def main():
    data = json.load(open(sys.argv[1]))
    a, b = int(sys.argv[3]), int(sys.argv[4])
    pages = [page_typ(data[i]) for i in range(a, b + 1)]
    open(sys.argv[2], 'w').write(TEMPLATE + '\n#pagebreak()\n'.join(pages))

if __name__ == '__main__':
    main()
