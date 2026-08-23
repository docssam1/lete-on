#!/usr/bin/env python3
"""Render bounded contact sheets for private layout review queues."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import pymupdf
from PIL import Image, ImageDraw, ImageFont


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def fit_thumbnail(page: pymupdf.Page, width: int) -> Image.Image:
    scale = width / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale), colorspace=pymupdf.csRGB, alpha=False)
    image = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    return image


def make_sheet(entries: list[dict], source_files: dict[str, Path], output: Path, tile_width: int) -> None:
    margin = 28
    label_height = 52
    gap = 28
    rendered: list[tuple[dict, Image.Image]] = []
    for entry in entries:
        pdf_path = source_files[entry["privateSourceMemoryId"]]
        with pymupdf.open(pdf_path) as document:
            image = fit_thumbnail(document[int(entry["page"]) - 1], tile_width)
        rendered.append((entry, image))

    columns = 2
    rows = (len(rendered) + columns - 1) // columns
    tile_height = max(image.height for _, image in rendered) + label_height
    sheet = Image.new(
        "RGB",
        (margin * 2 + columns * tile_width + gap, margin * 2 + rows * tile_height + max(0, rows - 1) * gap),
        "#d9dde3",
    )
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default(size=22)
    for index, (entry, image) in enumerate(rendered):
        row, column = divmod(index, columns)
        x = margin + column * (tile_width + gap)
        y = margin + row * (tile_height + gap)
        label = f'{entry["privateSourceMemoryId"]}  PDF {entry["page"]}  {entry["reason"]}'
        draw.rectangle((x, y, x + tile_width, y + label_height), fill="white")
        draw.text((x + 10, y + 13), label, fill="black", font=font)
        sheet.paste(image, (x, y + label_height))
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, quality=92)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--index", required=True, type=Path)
    parser.add_argument("--discovery", required=True, type=Path)
    parser.add_argument("--source-dir", required=True, type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    parser.add_argument("--batch-size", type=int, default=4)
    parser.add_argument("--tile-width", type=int, default=720)
    args = parser.parse_args()

    index = load_json(args.index)
    discovery = load_json(args.discovery)
    source_files = {
        book["sourceMemoryId"]: args.source_dir / book["fileName"]
        for book in discovery.get("books", [])
    }
    queue = list(index.get("excludedPageCandidates", []))
    if not queue:
        raise SystemExit("No excludedPageCandidates found")
    missing = sorted({entry["privateSourceMemoryId"] for entry in queue} - set(source_files))
    if missing:
        raise SystemExit(f"Missing discovery sources: {', '.join(missing)}")
    for source_path in source_files.values():
        if source_path.exists():
            continue
        if any(source_files[entry["privateSourceMemoryId"]] == source_path for entry in queue):
            raise SystemExit(f"Source PDF missing: {source_path.name}")

    args.output_dir.mkdir(parents=True, exist_ok=True)
    for start in range(0, len(queue), args.batch_size):
        batch = queue[start : start + args.batch_size]
        output = args.output_dir / f"excluded-review-{start // args.batch_size + 1:02d}.jpg"
        make_sheet(batch, source_files, output, args.tile_width)
        print(output)


if __name__ == "__main__":
    main()
