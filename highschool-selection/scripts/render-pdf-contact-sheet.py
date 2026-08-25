#!/usr/bin/env python3
"""Render every PDF page into a compact contact sheet for visual QA."""

from __future__ import annotations

import argparse
import math
from pathlib import Path

import pymupdf
from PIL import Image, ImageDraw


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--columns", type=int, default=3)
    parser.add_argument("--tile-width", type=int, default=420)
    parser.add_argument("--pages", help="Optional comma-separated 1-based page numbers")
    args = parser.parse_args()

    document = pymupdf.open(args.input)
    tiles: list[Image.Image] = []
    label_height = 30
    page_numbers = (
        [int(value) for value in args.pages.split(",")]
        if args.pages
        else list(range(1, len(document) + 1))
    )
    for page_number in page_numbers:
        if not 1 <= page_number <= len(document):
            raise ValueError(f"Page {page_number} is outside 1..{len(document)}")
        page = document[page_number - 1]
        scale = args.tile_width / page.rect.width
        pixmap = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale), alpha=False)
        page_image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
        tile = Image.new("RGB", (args.tile_width, page_image.height + label_height), "white")
        tile.paste(page_image, (0, label_height))
        ImageDraw.Draw(tile).text((10, 8), f"PDF {page_number}", fill="black")
        tiles.append(tile)
    document.close()

    tile_height = max(tile.height for tile in tiles)
    rows = math.ceil(len(tiles) / args.columns)
    sheet = Image.new("RGB", (args.columns * args.tile_width, rows * tile_height), (225, 225, 225))
    for index, tile in enumerate(tiles):
        x = (index % args.columns) * args.tile_width
        y = (index // args.columns) * tile_height
        sheet.paste(tile, (x, y))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(args.output, optimize=True)


if __name__ == "__main__":
    main()
