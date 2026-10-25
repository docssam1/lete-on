# 예시 보고서 관찰그림 = 연필 스케치. 원장 2026-10-25: 「이거 안돼 스케치 느낌이 나야지」(도형 SVG 그림을 거절).
# 1) node tools/sketch/render.mjs tools/sketch/jobs.json <렌더폴더>   — 3D 표본을 흰 바탕에 크게 렌더(로컬 서버 8765)
# 2) python3 tools/sketch/build.py <렌더폴더>                          — 선·명암 webp(assets/observe/sketch/) + 손이 그려 갈 길(data/sketch-strokes.js)
# 3) 이름표·확대 원 자리는 data/observe-samples.js에서 원본 그림 픽셀 좌표(dr.at)로 정한다. 그림을 다시 만들면 자리도 다시 확인할 것.
# 필요: opencv-python, numpy, pillow, scikit-image
import cv2, numpy as np, json, sys, os
from PIL import Image
from skimage.morphology import skeletonize
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pencil import pencil

HERE = os.path.dirname(os.path.abspath(__file__)); LAB = os.path.dirname(os.path.dirname(HERE))
OUT_IMG = os.path.join(LAB, 'assets', 'observe', 'sketch'); OUT_JS = os.path.join(LAB, 'data', 'sketch-strokes.js')

def strokes(line_a, n_main=14, n_chunks=6):
    h, w = line_a.shape
    sk = skeletonize(line_a > 40).astype(np.uint8) * 255
    sk = cv2.dilate(sk, np.ones((2, 2), np.uint8))
    cs, _ = cv2.findContours(sk, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
    loops = sorted(((cv2.arcLength(c, True), cv2.approxPolyDP(c, 1.2, True).reshape(-1, 2)) for c in cs if cv2.arcLength(c, True) >= 10), key=lambda t: -t[0])
    main = [a for _, a in loops[:n_main]]
    rest = sorted((a for _, a in loops[n_main:]), key=lambda a: (int(a[:, 1].mean() // max(1, h / n_chunks)), a[:, 0].mean()))
    chunks = [[] for _ in range(n_chunks)]
    for i, a in enumerate(rest): chunks[min(n_chunks - 1, i * n_chunks // max(1, len(rest)))].append(a)
    return main, [c for c in chunks if c]

def shading(tone_a, step=34, bands=3):
    ys, xs = np.nonzero(tone_a > 25)
    if not len(xs): return []
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max(), ys.max(); bh = (y1 - y0 + 1) / bands; out = []
    for b in range(bands):
        yA, yB = y0 + b * bh, y0 + (b + 1) * bh; pts = []; x = x0; up = True
        while x <= x1 + step: pts.append([int(x), int(yA if up else yB)]); x += step; up = not up
        out.append(np.array(pts))
    return out

def build(job, src_dir):
    img = cv2.imread(os.path.join(src_dir, job['name'] + '.png'))
    opt = job.get('pencil', {}); line, tone, mask = pencil(img, sigma=opt.pop('sigma', 1.7), **opt)
    ys, xs = np.nonzero(mask); pad = 40
    x0, y0, x1, y1 = max(0, xs.min() - pad), max(0, ys.min() - pad), min(img.shape[1], xs.max() + pad), min(img.shape[0], ys.max() + pad)
    line, tone = line[y0:y1, x0:x1], tone[y0:y1, x0:x1]
    s = min(1.0, job.get('maxw', 900) / line.shape[1]); w, h = round(line.shape[1] * s), round(line.shape[0] * s)
    line = cv2.resize(line, (w, h), interpolation=cv2.INTER_AREA); tone = cv2.resize(tone, (w, h), interpolation=cv2.INTER_AREA)
    ink = (66, 56, 46)
    for a, nm in ((line, 'line'), (tone, 'tone')):
        rgba = np.zeros((h, w, 4), np.uint8); rgba[..., :3] = ink; rgba[..., 3] = np.clip(a * 255, 0, 255).astype(np.uint8)
        Image.fromarray(rgba).save(os.path.join(OUT_IMG, f"{job['name']}-{nm}.webp"), quality=80, method=6)
    la = (line * 255).astype(np.uint8); main, more = strokes(la); sh = shading((tone * 255).astype(np.uint8))
    enc = lambda a: [int(v) for v in a.reshape(-1)]
    return {'w': w, 'h': h, 'lw': 9, 'sw': 70, 'main': [enc(a) for a in main], 'more': [[enc(a) for a in c] for c in more], 'shade': [enc(a) for a in sh]}, {'x0': int(x0), 'y0': int(y0), 's': s}

if __name__ == '__main__':
    src = sys.argv[1]; jobs = json.load(open(os.path.join(HERE, 'jobs.json'))); only = set(sys.argv[2:])
    os.makedirs(OUT_IMG, exist_ok=True)
    data = {}
    if os.path.exists(OUT_JS):
        t = open(OUT_JS).read(); data = json.loads(t[t.index('{'):t.rindex('}') + 1] or '{}')
    crops = {}
    for j in jobs:
        if j.get('ref') or (only and j['name'] not in only): continue
        data[j['name']], crops[j['name']] = build(j, src); print('ok', j['name'], data[j['name']]['w'], data[j['name']]['h'])
    with open(OUT_JS, 'w') as f:
        f.write('// 예시 보고서 연필 스케치의 「손이 그려 가는 길」 — tools/sketch/build.py가 만든다(손으로 고치지 말 것).\n')
        f.write('// main = 선 뼈대를 따라 도는 큰 고리(하나씩 그림), more = 작은 고리 묶음, shade = 명암을 칠하는 지그재그. 좌표는 webp 픽셀.\n')
        f.write('export const STROKES = ' + json.dumps(data, separators=(',', ':')) + ';\n')
    json.dump(crops, open(os.path.join(src, 'crops.json'), 'w'))
