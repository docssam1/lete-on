"""교재 실사형 설명 사진 생성기 — 원장 PC(GPU)에서 scripts/local/book-photos.cmd 로 돌린다.

원장 지시(2026-10-19): 교재 그림은 실사 수준으로. 클라우드 세션(Claude)은 GPU가 없고
이미지 생성 서비스·사진 사이트가 막혀 있어서, 무료 공개 모델로 원장 PC에서 만든다.

  모델  FLUX.1-schnell(Apache 2.0, 상업 사용 가능) — GPU 메모리 10 GB 미만이면 SDXL base 1.0(OpenRAIL++)
  입력  scripts/book-photos/shots.json(장면 목록 · Claude가 쓴다)
  출력  book-photos/<단원>/<장면>-<번호>.webp(장면마다 후보 3장) + book-photos/고르기.html(한 장에 모두)
  전달  후보를 GitHub 의 별도 수신 브랜치 inbox/book-photos 로 올린다(원장 PC의 작업 폴더·main 은 건드리지 않는다).
        Claude가 그 브랜치에서 받아 가장 좋은 컷을 골라 교재에 넣는다.

키·비용 없음. 처음 한 번 모델을 받는 데 시간이 걸린다(FLUX 약 30 GB).
"""
import argparse, base64, io, json, os, subprocess, sys, tempfile, time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SHOTS = ROOT / 'scripts' / 'book-photos' / 'shots.json'
BRANCH = 'inbox/book-photos'
NEG = 'text, letters, watermark, logo, signature, cartoon, illustration, painting, 3d render, cgi, deformed hands, extra fingers, blurry, low quality'


def vram_gb():
    import torch
    if not torch.cuda.is_available():
        return 0.0
    return torch.cuda.get_device_properties(0).total_memory / 1024 ** 3


def load_pipe(model, vram):
    import torch
    if model == 'flux':
        from diffusers import FluxPipeline
        pipe = FluxPipeline.from_pretrained('black-forest-labs/FLUX.1-schnell', torch_dtype=torch.bfloat16)
        if vram >= 26:
            pipe.to('cuda')
        elif vram >= 12:
            pipe.enable_model_cpu_offload()
        else:
            pipe.enable_sequential_cpu_offload()
        return pipe
    from diffusers import StableDiffusionXLPipeline
    dtype = torch.float16 if vram else torch.float32
    pipe = StableDiffusionXLPipeline.from_pretrained('stabilityai/stable-diffusion-xl-base-1.0', torch_dtype=dtype, use_safetensors=True, **({'variant': 'fp16'} if vram else {}))
    if vram >= 10:
        pipe.to('cuda')
    elif vram:
        pipe.enable_model_cpu_offload()
    return pipe


def render(pipe, model, prompt, seed, w, h):
    import torch
    g = torch.Generator('cpu').manual_seed(seed)
    if model == 'flux':
        return pipe(prompt, guidance_scale=0.0, num_inference_steps=4, max_sequence_length=256, width=w, height=h, generator=g).images[0]
    return pipe(prompt, negative_prompt=NEG, num_inference_steps=32, guidance_scale=6.0, width=w, height=h, generator=g).images[0]


def contact_sheet(out, items):
    """고르기.html — 그림을 파일 안에 넣어 그 한 장만 옮겨도 볼 수 있게 한다."""
    from PIL import Image
    rows = []
    for unit, key, use, files in items:
        cells = []
        for f in files:
            im = Image.open(f).convert('RGB'); im.thumbnail((640, 640))
            buf = io.BytesIO(); im.save(buf, 'JPEG', quality=82)
            cells.append(f'<figure><img src="data:image/jpeg;base64,{base64.b64encode(buf.getvalue()).decode()}"><figcaption>{Path(f).name}</figcaption></figure>')
        rows.append(f'<section><h2>{unit} · {key} <small>{use}</small></h2><div>{"".join(cells)}</div></section>')
    html = ('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>교재 사진 고르기</title>'
            '<style>body{font-family:system-ui,sans-serif;margin:16px;background:#f5f5f2}h2{font-size:16px;margin:24px 0 8px}small{color:#666;font-weight:400}'
            'section>div{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px}figure{margin:0;background:#fff;padding:6px;border-radius:8px}'
            'img{width:100%;display:block;border-radius:4px}figcaption{font-size:12px;color:#555;margin-top:4px}</style>'
            '<h1>교재 실사 사진 후보</h1><p>장면마다 후보 3장입니다. Claude가 이 중에서 고릅니다. 마음에 드는 번호가 있으면 알려 주세요.</p>' + ''.join(rows))
    (out / '고르기.html').write_text(html, encoding='utf-8')


def git(*args, env=None, inp=None):
    r = subprocess.run(['git', '-C', str(ROOT), *args], capture_output=True, text=True, env=env, input=inp)
    if r.returncode:
        raise RuntimeError(f'git {" ".join(args)}: {r.stderr.strip()}')
    return r.stdout.strip()


def push_inbox(out):
    """후보 사진만 담은 커밋을 만들어 inbox/book-photos 로 올린다. 작업 폴더·현재 브랜치는 그대로 둔다."""
    files = sorted(p for p in out.rglob('*') if p.is_file() and p.suffix in ('.webp', '.json', '.html'))
    with tempfile.TemporaryDirectory() as td:
        env = {**os.environ, 'GIT_INDEX_FILE': str(Path(td) / 'index')}
        git('read-tree', '--empty', env=env)
        for f in files:
            blob = git('hash-object', '-w', str(f))
            git('update-index', '--add', '--cacheinfo', f'100644,{blob},book-photos/{f.relative_to(out).as_posix()}', env=env)
        tree = git('write-tree', env=env)
    commit = git('commit-tree', tree, '-m', f'교재 실사 사진 후보 {time.strftime("%Y-%m-%d %H:%M")} ({len(files)}개 파일)')
    git('push', '--force', 'origin', f'{commit}:refs/heads/{BRANCH}')
    return len(files)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--out', default='book-photos')
    ap.add_argument('--n', type=int, default=3, help='장면마다 후보 수')
    ap.add_argument('--only', default='', help='쉼표로 장면 key만 골라 만들기(예: setup,handwash)')
    ap.add_argument('--model', default='auto', choices=['auto', 'flux', 'sdxl'])
    ap.add_argument('--size', default='1344x768', help='가로x세로(16의 배수)')
    ap.add_argument('--no-push', action='store_true', help='GitHub 수신 브랜치로 올리지 않기')
    a = ap.parse_args()

    spec = json.loads(SHOTS.read_text(encoding='utf-8'))
    shots = [s for s in spec['shots'] if not a.only or s['key'] in a.only.split(',')]
    out = ROOT / a.out; out.mkdir(exist_ok=True)
    w, h = map(int, a.size.lower().split('x'))
    vram = vram_gb()
    model = a.model if a.model != 'auto' else ('flux' if vram >= 10 else 'sdxl')
    print(f'  GPU 메모리 {vram:.1f} GB → 모델 {model} · 장면 {len(shots)}개 × 후보 {a.n}장 · {w}x{h}', flush=True)
    pipe = None
    items, made, t0 = [], 0, time.time()
    for s in shots:
        d = out / s['unit']; d.mkdir(exist_ok=True)
        files = []
        for i in range(1, a.n + 1):
            f = d / f"{s['key']}-{i}.webp"
            if not f.exists():
                if pipe is None:
                    print('  모델 불러오는 중... 처음에는 받는 데 오래 걸려요.', flush=True)
                    pipe = load_pipe(model, vram)
                seed = 1000 * i + sum(map(ord, s['key']))
                t = time.time()
                img = render(pipe, model, f"{s['prompt']} {spec['style']}", seed, w, h)
                img.save(f, 'WEBP', quality=88)
                (d / f"{s['key']}-{i}.json").write_text(json.dumps({'unit': s['unit'], 'key': s['key'], 'seed': seed, 'model': model, 'size': [w, h], 'prompt': s['prompt']}, ensure_ascii=False, indent=1), encoding='utf-8')
                made += 1
                print(f"  [{made}] {s['unit']} {s['key']}-{i}  {time.time() - t:.1f}초", flush=True)
            files.append(f)
        items.append((s['unit'], s['key'], s['use'], files))
    contact_sheet(out, items)
    print(f'  새로 만든 사진 {made}장 · {time.time() - t0:.0f}초 · 미리보기 {out / "고르기.html"}', flush=True)
    if a.no_push:
        return
    try:
        n = push_inbox(out)
        print(f'  GitHub {BRANCH} 로 {n}개 파일을 올렸어요. Claude에게 "사진 올렸어"라고 말해 주세요.', flush=True)
    except Exception as e:  # 올리기만 실패한 경우 — 사진은 이미 PC에 있다
        print(f'  [!] GitHub로 올리지 못했어요: {e}', flush=True)
        print(f'      {out} 폴더를 구글 드라이브에 올리고 Claude에게 알려 주세요.', flush=True)


if __name__ == '__main__':
    sys.exit(main())
