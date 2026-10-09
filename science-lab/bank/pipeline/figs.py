# 원문 그림 잘라 내기: python3 -I figs.py <작업 폴더> [건너뛸 키 ...]
# set{N}.json의 figure.bbox(PDF 포인트)를 set{N}/q.pdf에서 200dpi로 잘라 figs/<이름>.webp, figmap.json, 검토용 sheet.png를 만든다.
# 같은 쪽·같은 상자를 쓰는 문항은 한 장을 같이 쓴다. 다른 쪽에 같은 상자가 적힌 경우(앞 문항 그림을 가리키는 공통 지문)는 앞 문항 그림을 쓴다.
import sys, json, os, fitz
from PIL import Image, ImageDraw
D = sys.argv[1]; skip = set(sys.argv[2:])
os.makedirs(f'{D}/figs', exist_ok=True)
seen, out, prev = {}, {}, {}
for s in range(1, 5):
    if not os.path.exists(f'{D}/set{s}.json'): continue
    doc = fitz.open(f'{D}/set{s}/q.pdf')
    for x in json.load(open(f'{D}/set{s}.json')):
        f = x.get('figure'); k = f'{s}-{x["no"]}'
        if not f or k in skip or not f.get('bbox'): continue
        pg = f.get('page') or x['page']; b = tuple(f['bbox']); sig = (s, pg, b)
        if sig in seen: out[k] = seen[sig]; continue
        p = doc[pg - 1]; r = fitz.Rect(b[0] - 2, b[1] + 1, b[2] + 2, b[3] + 2) & p.rect
        pix = p.get_pixmap(clip=r, dpi=200)
        # 빈 그림(다른 쪽을 가리키는 bbox)이면 같은 상자를 쓴 앞 문항 그림으로
        im = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
        if im.convert('L').getextrema()[0] > 235 and (s, b) in prev: out[k] = prev[(s, b)]; continue
        # figure.extra(같은 문항의 그림이 둘 이상) → 위아래로 이어 붙인다
        for e in f.get('extra') or []:
            ep = doc[(e.get('page') or pg) - 1]; eb = e['bbox']
            px = ep.get_pixmap(clip=fitz.Rect(eb[0] - 2, eb[1] + 1, eb[2] + 2, eb[3] + 2) & ep.rect, dpi=200)
            e_im = Image.frombytes('RGB', (px.width, px.height), px.samples)
            W2 = max(im.width, e_im.width); both = Image.new('RGB', (W2, im.height + e_im.height + 16), 'white')
            both.paste(e_im, (0, 0)); both.paste(im, (0, e_im.height + 16)); im = both
        name = f's{s}-q{x["no"]:02d}'
        im.thumbnail((900, 900)); im.save(f'{D}/figs/{name}.webp', quality=82)
        seen[sig] = name; prev[(s, b)] = name; out[k] = name
json.dump(out, open(f'{D}/figmap.json', 'w'), ensure_ascii=False)
names = sorted(set(out.values())); ims = [Image.open(f'{D}/figs/{n}.webp') for n in names]
W, x0, y0, rowh, pos = 1400, 0, 0, 0, []
for im in ims:
    im = im.copy(); im.thumbnail((330, 330))
    if x0 + im.width > W: x0 = 0; y0 += rowh + 14; rowh = 0
    pos.append((im, x0, y0)); x0 += im.width + 12; rowh = max(rowh, im.height)
C = Image.new('RGB', (W, y0 + rowh + 4), 'white'); d = ImageDraw.Draw(C)
for (im, a, b), n in zip(pos, names): C.paste(im, (a, b)); d.text((a + 2, b + 2), n, fill='red')
C.save(f'{D}/sheet.png')
print(len(out), 'items →', len(names), 'images', out)
