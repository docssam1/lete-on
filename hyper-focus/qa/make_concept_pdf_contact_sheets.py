from pathlib import Path
import json
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
qa = root / 'output' / 'qa' / 'concept-pdf-final-20260909'
thumb_w, thumb_h = 280, 396
tile_w, tile_h = 288, 424
columns, rows = 4, 4
report = {'passed': True, 'rounds': []}

for round_number in (1, 2):
    source = qa / f'round{round_number}'
    pages = sorted(source.glob('page-*.png'))
    assert len(pages) == 103, (round_number, len(pages))
    sheets = []
    for start in range(0, len(pages), columns * rows):
        group = pages[start:start + columns * rows]
        sheet = Image.new('RGB', (tile_w * columns, tile_h * rows), '#dce4e8')
        draw = ImageDraw.Draw(sheet)
        for offset, page_path in enumerate(group):
            page_number = start + offset + 1
            with Image.open(page_path) as image:
                rendered = image.convert('RGB')
                rendered.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
                x = (offset % columns) * tile_w + (tile_w - rendered.width) // 2
                y = (offset // columns) * tile_h + 22
                sheet.paste(rendered, (x, y))
                draw.rectangle((x - 1, y - 1, x + rendered.width, y + rendered.height), outline='#8498a5', width=1)
                draw.text((x + 5, 5 + (offset // columns) * tile_h), f'P{page_number:03d}', fill='#15334f')
        destination = qa / f'round{round_number}-contact-{start + 1:03d}-{start + len(group):03d}.png'
        sheet.save(destination, optimize=True)
        sheets.append(str(destination))
    report['rounds'].append({'round': round_number, 'pages': len(pages), 'contact_sheets': sheets})

(qa / 'contact-sheet-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(report, ensure_ascii=False, indent=2))
