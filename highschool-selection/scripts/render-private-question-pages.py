"""Render selected PDF pages to private PNG assets without modifying the source PDF."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image


def sha256_file(file_path: Path) -> str:
    digest = hashlib.sha256()
    with file_path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def atomic_json(file_path: Path, value: dict) -> None:
    temporary = file_path.with_name(f"{file_path.name}.tmp-{os.getpid()}")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(temporary, file_path)


def render_pages(input_pdf: Path, output_dir: Path, source_id: str, first_page: int, last_page: int, scale: float) -> dict:
    if not input_pdf.is_file():
        raise FileNotFoundError(input_pdf)
    if first_page < 1 or last_page < first_page:
        raise ValueError("쪽 범위를 확인해 주세요.")
    output_dir.mkdir(parents=True, exist_ok=True)
    document = pdfium.PdfDocument(str(input_pdf))
    if last_page > len(document):
        raise ValueError(f"PDF는 {len(document)}쪽인데 {last_page}쪽을 요청했습니다.")

    assets = []
    for page_number in range(first_page, last_page + 1):
        page = document[page_number - 1]
        bitmap = page.render(scale=scale)
        image = bitmap.to_pil().convert("RGB")
        file_name = f"page-{page_number:03d}.png"
        output_path = output_dir / file_name
        temporary = output_dir / f".{file_name}.tmp-{os.getpid()}"
        image.save(temporary, format="PNG", optimize=True)
        os.replace(temporary, output_path)
        with Image.open(output_path) as checked:
            checked.verify()
        assets.append({
            "assetId": f"{source_id}:page:{page_number:03d}",
            "pageNumber": page_number,
            "fileName": file_name,
            "sha256": sha256_file(output_path),
            "width": image.width,
            "height": image.height,
        })

    manifest = {
        "schemaVersion": "highselect-private-question-page-assets/v1",
        "sourceId": source_id,
        "inputSha256": sha256_file(input_pdf),
        "firstPage": first_page,
        "lastPage": last_page,
        "pageCount": len(assets),
        "assets": assets,
    }
    atomic_json(output_dir / "manifest.json", manifest)
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input_pdf", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("source_id")
    parser.add_argument("first_page", type=int)
    parser.add_argument("last_page", type=int)
    parser.add_argument("--scale", type=float, default=2.5)
    args = parser.parse_args()
    manifest = render_pages(args.input_pdf.resolve(), args.output_dir.resolve(), args.source_id, args.first_page, args.last_page, args.scale)
    print(json.dumps({"sourceId": manifest["sourceId"], "pageCount": manifest["pageCount"], "inputSha256": manifest["inputSha256"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
