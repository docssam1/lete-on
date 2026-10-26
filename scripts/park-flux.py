"""자연관찰대회 공원 지도를 실사풍으로 — 원장 맥(애플 칩)에서 scripts/local/park-flux.command 로 돌린다.

원장 2026-10-26: 「FLUX.2 Klein 으로 진행해」. 클라우드 세션(Claude)은 GPU가 없어 Blender 디오라마만 렌더하고,
그 렌더를 참조 그림으로 넣어 맥에서 FLUX.2 Klein 이 실사풍으로 다시 그린다(이미지 편집 모드 — 배치를 그대로 둔다).

  모델  FLUX.2 [klein] 4B(Apache 2.0, 상업 사용 가능) — mflux(MLX, MIT)로 4비트 실행.
        9B 는 비상업 라이선스라 쓰지 않는다.
  입력  science-lab/assets/park/park-{wide,tall}.webp(Blender 렌더) + science-lab/tools/blender/park-mask-{wide,tall}.png(섬 모양)
  출력  park-flux/<wide|tall>-<번호>.webp(후보, 섬 모양 밖은 원래 바탕으로 덮음 — 지도 위 표 자리가 그대로 맞는다)
        + park-flux/고르기.html(한 장에 모두, 원래 렌더와 나란히)
  전달  후보를 GitHub 수신 브랜치 inbox/park-flux 로 올린다(맥의 작업 폴더·main 은 건드리지 않는다).

키·비용 없음. 처음 한 번 모델(약 15 GB)을 받는다.
"""
import argparse, base64, io, os, subprocess, sys, tempfile, time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PARK = ROOT / 'science-lab' / 'assets' / 'park'
MASK = ROOT / 'science-lab' / 'tools' / 'blender'
BRANCH = 'inbox/park-flux'
BG = (232, 235, 230)
# 생성 크기(16의 배수). 다 만든 뒤 2560 쪽으로 늘린다.
SIZE = {'wide': (1792, 1008), 'tall': (1008, 1792)}
FULL = {'wide': (2560, 1440), 'tall': (1440, 2560)}
PROMPT = ('Turn this 3D render into a photorealistic tilt-shift aerial photograph of a miniature park diorama on a thick soil base. '
          'Keep exactly the same layout, outlines, shapes and positions of everything: the island outline and soil edge, the pond with lily pads, '
          'duckweed, water hyacinth and reeds, the pavilion with a dark roof, the stream and wooden bridge, the paved paths, the brick plaza with two white tents, '
          'the flower beds, the tall grass meadow, the rocky hill, the reed marsh with a wooden boardwalk, the entrance gate and the forest with some autumn trees. '
          'Make trees look like real trees with natural dense foliage, real grass texture, clear pond water with reflections, natural stone, soft afternoon sunlight, '
          'gentle shadows. Plain light background around the diorama. No people, no text, no labels.')


def run_flux(src, out_png, seed, w, h, model, model_path, quant):
    cmd = ['mflux-generate-flux2-edit', '--model', model, '--image-paths', str(src), '--prompt', PROMPT,
           '--steps', '4', '--seed', str(seed), '--width', str(w), '--height', str(h), '--output', str(out_png)]
    if model_path: cmd += ['--model-path', model_path]
    if quant: cmd += ['--quantize', str(quant)]
    subprocess.run(cmd, check=True)


def finish(gen_png, mask_png, kind, out_webp):
    """섬 모양 밖은 바탕색으로 — 렌더와 같은 윤곽이라 지도 표·걷는 길 좌표가 그대로 맞는다."""
    from PIL import Image, ImageFilter
    W, H = FULL[kind]
    im = Image.open(gen_png).convert('RGB').resize((W, H), Image.LANCZOS)
    m = Image.open(mask_png).convert('L').resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))
    bg = Image.new('RGB', (W, H), BG)
    Image.composite(im, bg, m).save(out_webp, 'WEBP', quality=84, method=6)


def contact_sheet(out, rows):
    from PIL import Image
    def thumb(f):
        im = Image.open(f).convert('RGB'); im.thumbnail((900, 900)); buf = io.BytesIO(); im.save(buf, 'JPEG', quality=82)
        return base64.b64encode(buf.getvalue()).decode()
    sec = []
    for kind, files in rows:
        cells = [f'<figure><img src="data:image/jpeg;base64,{thumb(f)}"><figcaption>{Path(f).name}</figcaption></figure>' for f in files]
        sec.append(f'<section><h2>{"넓은 화면" if kind == "wide" else "세로 화면(폰)"}</h2><div>{"".join(cells)}</div></section>')
    html = ('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>공원 지도 고르기</title>'
            '<style>body{font-family:system-ui,sans-serif;margin:16px;background:#f5f5f2}h2{font-size:16px;margin:24px 0 8px}'
            'section>div{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:10px}figure{margin:0;background:#fff;padding:6px;border-radius:8px}'
            'img{width:100%;display:block;border-radius:4px}figcaption{font-size:12px;color:#555;margin-top:4px}</style>'
            '<h1>공원 지도 실사풍 후보</h1><p>맨 앞(render)이 지금 지도(Blender)입니다. 나머지는 FLUX.2 Klein 후보. Claude가 고르지만, 마음에 드는 번호가 있으면 알려 주세요.</p>' + ''.join(sec))
    (out / '고르기.html').write_text(html, encoding='utf-8')


def git(*args, env=None):
    r = subprocess.run(['git', '-C', str(ROOT), *args], capture_output=True, text=True, env=env)
    if r.returncode: raise RuntimeError(f'git {" ".join(args)}: {r.stderr.strip()}')
    return r.stdout.strip()


def push_inbox(out):
    """후보만 담은 커밋을 inbox/park-flux 로 올린다. 작업 폴더·현재 브랜치는 그대로 둔다."""
    files = sorted(p for p in out.rglob('*') if p.is_file() and p.suffix in ('.webp', '.html'))
    with tempfile.TemporaryDirectory() as td:
        env = {**os.environ, 'GIT_INDEX_FILE': str(Path(td) / 'index')}
        git('read-tree', '--empty', env=env)
        for f in files:
            blob = git('hash-object', '-w', str(f))
            git('update-index', '--add', '--cacheinfo', f'100644,{blob},park-flux/{f.relative_to(out).as_posix()}', env=env)
        tree = git('write-tree', env=env)
    commit = git('commit-tree', tree, '-m', f'공원 지도 실사풍 후보 {time.strftime("%Y-%m-%d %H:%M")} ({len(files)}개 파일)')
    git('push', '--force', 'origin', f'{commit}:refs/heads/{BRANCH}')
    return len(files)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--out', default='park-flux')
    ap.add_argument('--n', type=int, default=3, help='화면마다 후보 수')
    ap.add_argument('--only', choices=['wide', 'tall'], default=None)
    ap.add_argument('--model', default='flux2-klein-4b', help='mflux 모델 이름(기본 flux2-klein-4b · Apache 2.0)')
    ap.add_argument('--model-path', default=os.environ.get('PARK_FLUX_MODEL_PATH'), help='이미 받아 둔(4비트로 저장한) 모델 폴더가 있으면 그 경로')
    ap.add_argument('--quantize', type=int, default=4, help='4 또는 8. --model-path 로 이미 4비트 저장본을 주면 0')
    ap.add_argument('--no-push', action='store_true')
    a = ap.parse_args()
    out = ROOT / a.out; out.mkdir(exist_ok=True)
    rows = []
    for kind in ([a.only] if a.only else ['wide', 'tall']):
        src, mask = PARK / f'park-{kind}.webp', MASK / f'park-mask-{kind}.png'
        if not src.exists() or not mask.exists(): sys.exit(f'  [!] 렌더나 섬 모양 파일이 없어요: {src.name}, {mask.name}')
        files = [src]
        for i in range(1, a.n + 1):
            dst = out / f'{kind}-{i}.webp'
            if not dst.exists():
                w, h = SIZE[kind]; png = out / f'{kind}-{i}.raw.png'
                print(f'  {kind} 후보 {i}/{a.n} 그리는 중... ({w}x{h})', flush=True)
                run_flux(src, png, 1000 + i * 17, w, h, a.model, a.model_path, a.quantize or None)
                finish(png, mask, kind, dst); png.unlink()
            files.append(dst)
        rows.append((kind, files))
    contact_sheet(out, rows)
    print(f'  후보 → {out}', flush=True)
    if not a.no_push:
        try: print(f'  GitHub {BRANCH} 로 올림: {push_inbox(out)}개 파일', flush=True)
        except Exception as e: print(f'  [!] 올리기 실패: {e}\n      park-flux 폴더를 구글 드라이브에 올리고 알려 주세요.', flush=True)


if __name__ == '__main__':
    main()
