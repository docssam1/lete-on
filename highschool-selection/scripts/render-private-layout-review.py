#!/usr/bin/env python3
"""Render bounded contact sheets for private layout review queues.

The output is a private visual-review aid. It contains rendered source pages and
must stay outside the public repository.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Iterable

import pymupdf
from PIL import Image, ImageDraw, ImageFont


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8-sig"))


QUEUE_FIELDS = {
    "excluded": "excludedPageCandidates",
    "unresolved": "unresolvedPages",
}


def fit_thumbnail(page: pymupdf.Page, width: int) -> Image.Image:
    scale = width / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale), colorspace=pymupdf.csRGB, alpha=False)
    image = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    return image


def select_queue(
    index: dict,
    queue_name: str,
    reasons: Iterable[str] = (),
    source_ids: Iterable[str] = (),
    offset: int = 0,
    limit: int | None = None,
) -> tuple[list[dict], int]:
    """Return a deterministic, bounded review queue and its pre-window size."""
    if queue_name not in QUEUE_FIELDS:
        raise ValueError(f"Unsupported queue: {queue_name}")
    if offset < 0:
        raise ValueError("offset must be zero or greater")
    if limit is not None and limit < 1:
        raise ValueError("limit must be one or greater")

    reason_filter = set(reasons)
    source_filter = set(source_ids)
    queue = [dict(entry) for entry in index.get(QUEUE_FIELDS[queue_name], [])]
    if reason_filter:
        queue = [entry for entry in queue if entry.get("reason") in reason_filter]
    if source_filter:
        queue = [entry for entry in queue if entry.get("privateSourceMemoryId") in source_filter]
    queue.sort(key=lambda entry: (entry.get("privateSourceMemoryId", ""), int(entry.get("page", 0))))

    total = len(queue)
    stop = None if limit is None else offset + limit
    return queue[offset:stop], total


def page_items(index: dict) -> dict[tuple[str, int], list[dict]]:
    grouped: dict[tuple[str, int], list[dict]] = {}
    source_refs = {
        source.get("sourceRef"): source.get("privateSourceMemoryId")
        for source in index.get("sources", [])
    }
    for item in index.get("items", []):
        source_id = source_refs.get(item.get("sourceRef"))
        page = item.get("locator", {}).get("page")
        if not source_id or not isinstance(page, int):
            continue
        grouped.setdefault((source_id, page), []).append(item)
    for items in grouped.values():
        items.sort(key=lambda item: int(item.get("locator", {}).get("slot", 0)))
    return grouped


def draw_item_overlays(image: Image.Image, items: list[dict]) -> None:
    draw = ImageDraw.Draw(image)
    font = ImageFont.load_default(size=20)
    colors = {
        "visual_verified": "#008a45",
        "layout_candidate": "#e15200",
        "ocr_candidate": "#6d37c9",
    }
    for item in items:
        locator = item.get("locator", {})
        box = locator.get("box")
        if not isinstance(box, dict):
            continue
        try:
            x0 = round(float(box["x"]) * image.width)
            y0 = round(float(box["y"]) * image.height)
            x1 = round((float(box["x"]) + float(box["width"])) * image.width)
            y1 = round((float(box["y"]) + float(box["height"])) * image.height)
        except (KeyError, TypeError, ValueError):
            continue
        color = colors.get(item.get("discoveryStatus"), "#0057b8")
        draw.rectangle((x0, y0, x1, y1), outline=color, width=4)
        slot = locator.get("slot", "?")
        label = f"slot {slot}"
        label_box = draw.textbbox((x0 + 4, y0 + 3), label, font=font)
        draw.rectangle(label_box, fill="white")
        draw.text((x0 + 4, y0 + 3), label, fill=color, font=font)


def make_sheet(
    entries: list[dict],
    source_files: dict[str, Path],
    indexed_items: dict[tuple[str, int], list[dict]],
    output: Path,
    tile_width: int,
) -> None:
    margin = 28
    label_height = 52
    gap = 28
    rendered: list[tuple[dict, Image.Image]] = []
    for entry in entries:
        pdf_path = source_files[entry["privateSourceMemoryId"]]
        with pymupdf.open(pdf_path) as document:
            image = fit_thumbnail(document[int(entry["page"]) - 1], tile_width)
        items = indexed_items.get((entry["privateSourceMemoryId"], int(entry["page"])), [])
        draw_item_overlays(image, items)
        entry["indexedItemCount"] = len(items)
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
        label = (
            f'{entry["privateSourceMemoryId"]}  PDF {entry["page"]}  '
            f'{entry["reason"]}  indexed={entry["indexedItemCount"]}'
        )
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
    parser.add_argument("--queue", choices=sorted(QUEUE_FIELDS), default="excluded")
    parser.add_argument("--reason", action="append", default=[])
    parser.add_argument("--source-id", action="append", default=[])
    parser.add_argument("--offset", type=int, default=0)
    parser.add_argument("--limit", type=int)
    parser.add_argument("--batch-size", type=int, default=4)
    parser.add_argument("--tile-width", type=int, default=720)
    args = parser.parse_args()

    index = load_json(args.index)
    discovery = load_json(args.discovery)
    source_files = {
        book["sourceMemoryId"]: args.source_dir / book["fileName"]
        for book in discovery.get("books", [])
    }
    limit = args.limit
    if args.queue == "unresolved" and limit is None:
        limit = 40
    queue, filtered_total = select_queue(
        index,
        args.queue,
        reasons=args.reason,
        source_ids=args.source_id,
        offset=args.offset,
        limit=limit,
    )
    if not queue:
        raise SystemExit("No review pages matched the requested queue")
    missing = sorted({entry["privateSourceMemoryId"] for entry in queue} - set(source_files))
    if missing:
        raise SystemExit(f"Missing discovery sources: {', '.join(missing)}")
    for source_path in source_files.values():
        if source_path.exists():
            continue
        if any(source_files[entry["privateSourceMemoryId"]] == source_path for entry in queue):
            raise SystemExit(f"Source PDF missing: {source_path.name}")

    args.output_dir.mkdir(parents=True, exist_ok=True)
    indexed_items = page_items(index)
    manifest_entries = []
    for start in range(0, len(queue), args.batch_size):
        batch = queue[start : start + args.batch_size]
        reason_label = "mixed" if len({entry.get("reason") for entry in batch}) > 1 else batch[0].get("reason", "unknown")
        safe_reason = "".join(character if character.isalnum() or character in "-_" else "-" for character in reason_label)
        output = args.output_dir / f"{args.queue}-{safe_reason}-review-{start // args.batch_size + 1:02d}.jpg"
        make_sheet(batch, source_files, indexed_items, output, args.tile_width)
        for entry in batch:
            manifest_entries.append(
                {
                    "privateSourceMemoryId": entry["privateSourceMemoryId"],
                    "page": int(entry["page"]),
                    "reason": entry.get("reason"),
                    "indexedItemCount": int(entry.get("indexedItemCount", 0)),
                    "sheet": output.name,
                }
            )
        print(output)

    manifest = {
        "schemaVersion": 1,
        "queue": args.queue,
        "filters": {
            "reasons": sorted(set(args.reason)),
            "sourceIds": sorted(set(args.source_id)),
            "offset": args.offset,
            "limit": limit,
        },
        "filteredTotal": filtered_total,
        "renderedCount": len(manifest_entries),
        "entries": manifest_entries,
    }
    manifest_path = args.output_dir / "review-manifest.json"
    manifest_path.write_text(f"{json.dumps(manifest, ensure_ascii=False, indent=2)}\n", encoding="utf-8")
    print(manifest_path)


if __name__ == "__main__":
    main()
