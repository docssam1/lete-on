"""Render the approved Premier mock-exam PDF page ranges as WebP images.

The source PDFs remain on private storage. Only student-facing problem pages are
rendered; solution pages, blank pages, and duplicate combined PDFs are excluded.
"""

from __future__ import annotations

import argparse
import hashlib
import shutil
from dataclasses import dataclass
from pathlib import Path

import pymupdf
from PIL import Image


@dataclass(frozen=True)
class Document:
    key: str
    relative_path: str
    pages: tuple[int, ...]


DOCUMENTS = (
    Document("utilization-1", "프리미어 활용 모의고사/프리미어 모의고사 특강１회.pdf", (1, 2, 3, 4)),
    Document("utilization-2", "프리미어 활용 모의고사/프리미어 모의고사 특강 2회.pdf", (1, 2, 3, 4)),
    Document("utilization-3", "프리미어 활용 모의고사/프리미어 모의고사 특강 3회.pdf", (1, 2, 3, 4)),
    Document("utilization-4", "프리미어 활용 모의고사/프리미어 모의고사 특강 4회.pdf", (1, 2, 3, 4)),
    Document("utilization-5", "프리미어 활용 모의고사/프리미어 모의고사 특강 5회.pdf", (3, 4, 5, 6, 7)),
    Document("utilization-6", "프리미어 활용 모의고사/프리미어 모의고사 특강 6회.pdf", (1, 2, 3, 4)),
    Document("utilization-7", "프리미어 활용 모의고사/프리미어 모의고사 특강 7회.pdf", (2, 3, 4, 5, 6, 7, 8, 9)),
    Document("utilization-8", "프리미어 활용 모의고사/프리미어 모의고사 특강 8회.pdf", (1, 2, 3, 4)),
    Document("final-1", "프리미어 파이널 모의고사/프리미어대비 모의고사 파이널1회.pdf", (1, 2, 3, 4)),
    Document("final-2", "프리미어 파이널 모의고사/프리미어대비 모의고사 파이널2회.pdf", (1, 2, 3, 4)),
    Document("final-3", "프리미어 파이널 모의고사/프리미어대비 모의고사 파이널3회.pdf", (1, 2, 3, 4, 5)),
    Document("last-1", "프리미어 최종 모의고사/프리미어 최종 모의고사 1회.pdf", (1, 2, 3, 4, 5)),
    Document("last-2", "프리미어 최종 모의고사/프리미어 최종 모의고사 2회.pdf", (1, 2, 3, 4)),
    Document("last-3", "프리미어 최종 모의고사/프리미어 최종 모의고사 3회.pdf", (1, 2, 3, 4)),
    Document("last-4", "프리미어 최종 모의고사/프리미어 최종 모의고사 4회.pdf", (1, 2, 3, 4)),
)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def render(document: Document, source_root: Path, output_root: Path, dpi: int, quality: int) -> None:
    source = source_root / document.relative_path
    if not source.is_file():
        raise FileNotFoundError(f"Missing source PDF: {source}")

    pdf = pymupdf.open(source)
    if max(document.pages) > len(pdf):
        raise ValueError(f"{document.key}: page range exceeds {len(pdf)} source pages")

    destination = output_root / document.key
    staging = output_root / f".{document.key}.staging"
    if staging.exists():
        shutil.rmtree(staging)
    staging.mkdir(parents=True)

    scale = dpi / 72
    dimensions: set[tuple[int, int]] = set()
    for output_number, source_number in enumerate(document.pages, start=1):
        page = pdf[source_number - 1]
        pixmap = page.get_pixmap(
            matrix=pymupdf.Matrix(scale, scale),
            colorspace=pymupdf.csRGB,
            alpha=False,
        )
        image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
        dimensions.add(image.size)
        image.save(
            staging / f"page_{output_number:03d}.webp",
            "WEBP",
            quality=quality,
            method=6,
        )

    if len(dimensions) != 1:
        raise ValueError(f"{document.key}: inconsistent page dimensions {sorted(dimensions)}")
    width, height = next(iter(dimensions))
    if not 1.40 < height / width < 1.43:
        raise ValueError(f"{document.key}: unexpected page aspect ratio {width}x{height}")

    if destination.exists():
        shutil.rmtree(destination)
    staging.replace(destination)
    byte_count = sum(path.stat().st_size for path in destination.glob("page_*.webp"))
    print(
        f"{document.key}: {len(document.pages)} pages, {width}x{height}, "
        f"{byte_count} bytes, source sha256 {sha256(source)}"
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-root", required=True, type=Path)
    parser.add_argument("--output-root", required=True, type=Path)
    parser.add_argument("--only", action="append", default=[])
    parser.add_argument("--dpi", type=int, default=180)
    parser.add_argument("--quality", type=int, default=88)
    args = parser.parse_args()

    selected = [document for document in DOCUMENTS if not args.only or document.key in args.only]
    unknown = set(args.only) - {document.key for document in DOCUMENTS}
    if unknown:
        raise ValueError(f"Unknown document keys: {sorted(unknown)}")
    if not 120 <= args.dpi <= 240:
        raise ValueError("DPI must be between 120 and 240")
    if not 70 <= args.quality <= 95:
        raise ValueError("WebP quality must be between 70 and 95")

    args.output_root.mkdir(parents=True, exist_ok=True)
    for document in selected:
        render(document, args.source_root, args.output_root, args.dpi, args.quality)


if __name__ == "__main__":
    main()
