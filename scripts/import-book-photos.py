"""원장 PC에서 만든 교재 사진 후보(inbox/book-photos 브랜치) 가운데 고른 컷을 교재 그림으로 들여온다.

  git fetch origin inbox/book-photos
  git archive FETCH_HEAD book-photos | tar -x -C <작업 폴더>        # 후보 풀기(저장소 밖 임시 폴더)
  python3 scripts/import-book-photos.py <작업 폴더>/book-photos setup=2 handwash=1 ...

고른 번호를 적지 않은 장면은 들여오지 않는다(눈으로 보고 고른 것만 넣는다).
결과: science-lab/assets/book/<단원>-photo-<장면>.webp (가로 1600px · WebP 품질 82).
그다음 두 교재 생성기를 다시 돌리면 사진 자리가 채워진다:
  node scripts/gen-science-workbook-c22s42u04.mjs && node scripts/gen-science-workbook-c22s32u04.mjs
"""
import json, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SHOTS = {s['key']: s for s in json.loads((ROOT / 'scripts/book-photos/shots.json').read_text(encoding='utf-8'))['shots']}


def main(argv):
    if len(argv) < 2:
        print(__doc__); return 1
    src = Path(argv[0]); picks = dict(a.split('=') for a in argv[1:])
    for key, n in picks.items():
        if key not in SHOTS:
            raise SystemExit(f'장면 목록에 없는 key: {key}')
        unit = SHOTS[key]['unit']
        f = src / unit / f'{key}-{n}.webp'
        im = Image.open(f).convert('RGB')
        if im.width > 1600:
            im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
        out = ROOT / 'science-lab/assets/book' / f'{unit}-photo-{key}.webp'
        im.save(out, 'WEBP', quality=82, method=6)
        print(f'  {key}-{n} → {out.relative_to(ROOT)} ({out.stat().st_size // 1024} KB)')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
