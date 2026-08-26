#!/usr/bin/env python3
"""Build a private printable exam from reviewed PDF item crops.

The manifest and generated PDFs are private artifacts. This script is generic:
it stores no source paths, question text, answers, or academy-specific item data.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

import pymupdf


A4 = pymupdf.paper_rect("a4")
PAGE_WIDTH = A4.width
PAGE_HEIGHT = A4.height
MARGIN_X = 30.0
HEADER_HEIGHT = 62.0
FOOTER_HEIGHT = 25.0
COLUMN_GAP = 18.0
COLUMN_WIDTH = (PAGE_WIDTH - (2 * MARGIN_X) - COLUMN_GAP) / 2
CONTENT_TOP = 78.0
CONTENT_BOTTOM = PAGE_HEIGHT - FOOTER_HEIGHT - 10.0


@dataclass(frozen=True)
class Anchor:
    item_number: int
    page_number: int
    column: int
    rect: pymupdf.Rect


@dataclass(frozen=True)
class Crop:
    source_path: Path
    source_fingerprint: str
    source_item_number: int
    page_number: int
    rect: pymupdf.Rect
    anchor_rect: pymupdf.Rect


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def parse_item_number(text: str) -> int | None:
    stripped = text.strip()
    if not stripped.isdigit():
        return None
    number = int(stripped)
    return number if number > 0 else None


def discover_anchors(
    document: pymupdf.Document,
    pages: Iterable[int],
    maximum_item_number: int,
) -> list[Anchor]:
    anchors: list[Anchor] = []
    for page_number in pages:
        page = document[page_number - 1]
        for word in page.get_text("words"):
            item_number = parse_item_number(word[4])
            if item_number is None or item_number > maximum_item_number:
                continue
            rect = pymupdf.Rect(word[:4])
            if rect.height < 15:
                continue
            if 20 <= rect.x0 <= 80:
                column = 0
            elif 300 <= rect.x0 <= 370:
                column = 1
            else:
                continue
            if not 70 <= rect.y0 <= 740:
                continue
            anchors.append(Anchor(item_number, page_number, column, rect))
    deduped: dict[tuple[int, int], Anchor] = {}
    for anchor in anchors:
        deduped[(anchor.page_number, anchor.item_number)] = anchor
    return sorted(deduped.values(), key=lambda row: (row.page_number, row.column, row.rect.y0))


def make_crop(
    source_path: Path,
    fingerprint: str,
    anchors: list[Anchor],
    item_number: int,
    top_padding: float,
    bottom_padding: float,
) -> Crop:
    matches = [anchor for anchor in anchors if anchor.item_number == item_number]
    if len(matches) != 1:
        raise ValueError(f"Expected one anchor for item {item_number}, found {len(matches)}")
    anchor = matches[0]
    same_column = [
        candidate
        for candidate in anchors
        if candidate.page_number == anchor.page_number
        and candidate.column == anchor.column
        and candidate.rect.y0 > anchor.rect.y0
    ]
    next_y = min((candidate.rect.y0 for candidate in same_column), default=785.0)
    x0 = 20.0 if anchor.column == 0 else 302.0
    x1 = 293.0 if anchor.column == 0 else 577.0
    # Keep only the item itself.  The source books place publisher/type and
    # answer-rate metadata immediately above the item number; those labels do
    # not belong in the unified mock-exam design.
    y0 = max(72.0, anchor.rect.y0 - top_padding)
    y1 = min(790.0, next_y - bottom_padding)
    if y1 - y0 < 45:
        raise ValueError(f"Crop for item {item_number} is too short")
    return Crop(
        source_path=source_path,
        source_fingerprint=fingerprint,
        source_item_number=item_number,
        page_number=anchor.page_number,
        rect=pymupdf.Rect(x0, y0, x1, y1),
        anchor_rect=anchor.rect,
    )


def resolve_crops(manifest: dict, crop_kind: str) -> tuple[list[dict], dict[str, pymupdf.Document]]:
    books = {book["id"]: book for book in manifest["books"]}
    open_documents: dict[str, pymupdf.Document] = {}
    book_state: dict[str, tuple[Path, str, list[Anchor]]] = {}
    for book_id, book in books.items():
        source_path = Path(book["path"])
        if not source_path.is_file():
            raise FileNotFoundError(source_path)
        fingerprint = sha256(source_path)
        expected = str(book["sha256"]).lower()
        if fingerprint != expected:
            raise ValueError(f"Fingerprint mismatch for {book_id}")
        document = pymupdf.open(source_path)
        open_documents[book_id] = document
        page_key = "questionPages" if crop_kind == "question" else "solutionPages"
        page_range = range(int(book[page_key][0]), int(book[page_key][1]) + 1)
        anchors = discover_anchors(document, page_range, int(book["itemCount"]))
        book_state[book_id] = (source_path, fingerprint, anchors)

    resolved: list[dict] = []
    for entry in manifest["items"]:
        book_id = entry["bookId"]
        source_path, fingerprint, anchors = book_state[book_id]
        top_padding = 2.0 if crop_kind == "question" else 6.0
        bottom_padding = 32.0 if crop_kind == "question" else 7.0
        crop = make_crop(
            source_path,
            fingerprint,
            anchors,
            int(entry["sourceItemNumber"]),
            top_padding,
            bottom_padding,
        )
        resolved.append({**entry, "crop": crop})
    return resolved, open_documents


def load_font(page: pymupdf.Page, font_path: Path | None) -> str:
    if font_path and font_path.is_file():
        page.insert_font(fontname="Korean", fontfile=str(font_path))
        return "Korean"
    return "helv"


def insert_text(page: pymupdf.Page, point: tuple[float, float], text: str, size: float, font: str, color=(0, 0, 0)) -> None:
    page.insert_text(point, text, fontsize=size, fontname=font, color=color)


def draw_page_header(page: pymupdf.Page, title: str, subtitle: str, font: str) -> None:
    page.draw_rect(pymupdf.Rect(0, 0, PAGE_WIDTH, HEADER_HEIGHT), color=None, fill=(0.14, 0.08, 0.30))
    insert_text(page, (MARGIN_X, 27), title, 16, font, (1, 1, 1))
    insert_text(page, (MARGIN_X, 48), subtitle, 9.5, font, (0.88, 0.84, 1))
    page.draw_line(
        pymupdf.Point(PAGE_WIDTH / 2, CONTENT_TOP - 5),
        pymupdf.Point(PAGE_WIDTH / 2, CONTENT_BOTTOM),
        color=(0.84, 0.84, 0.88),
        width=0.6,
    )


def draw_footer(page: pymupdf.Page, footer: str, page_number: int, font: str) -> None:
    y = PAGE_HEIGHT - 13
    insert_text(page, (MARGIN_X, y), footer, 7.5, font, (0.34, 0.34, 0.38))
    insert_text(page, (PAGE_WIDTH - MARGIN_X - 12, y), str(page_number), 8, font, (0.34, 0.34, 0.38))


def add_cover(document: pymupdf.Document, manifest: dict, font_path: Path | None, solution: bool) -> None:
    page = document.new_page(width=PAGE_WIDTH, height=PAGE_HEIGHT)
    font = load_font(page, font_path)
    accent = (0.24, 0.09, 0.48)
    page.draw_rect(page.rect, color=None, fill=(0.975, 0.97, 0.985))
    page.draw_rect(pymupdf.Rect(0, 0, 18, PAGE_HEIGHT), color=None, fill=accent)
    heading = manifest["title"] + (" 문항별 해설" if solution else "")
    insert_text(page, (52, 128), heading, 26, font, accent)
    insert_text(page, (52, 160), manifest["roundLabel"], 13, font, (0.28, 0.28, 0.32))
    page.draw_line(pymupdf.Point(52, 184), pymupdf.Point(540, 184), color=accent, width=1.5)
    if solution:
        lines = [
            "교사용·검수용 비공개 자료",
            "원문 해설 대조 후 독립 검산을 완료한 문항만 확정합니다.",
            "현재 문서는 사용자 최종 승인 전 검수용 초안입니다.",
        ]
    else:
        lines = [
            "대수 20문항 · 50분",
            "기하 20문항 · 50분 (통계 제외)",
            "총 40문항 · 두 영역을 순서대로 풉니다.",
            "풀이 과정은 별도 연습지에 정리하세요.",
        ]
    for index, line in enumerate(lines):
        insert_text(page, (54, 238 + index * 28), line, 12, font, (0.18, 0.18, 0.21))
    page.draw_rect(pymupdf.Rect(52, 420, 540, 510), color=(0.75, 0.72, 0.82), fill=(1, 1, 1), width=0.8)
    insert_text(page, (70, 454), "이름", 11, font, accent)
    page.draw_line(pymupdf.Point(118, 458), pymupdf.Point(300, 458), color=(0.45, 0.45, 0.5), width=0.8)
    insert_text(page, (330, 454), "응시일", 11, font, accent)
    page.draw_line(pymupdf.Point(392, 458), pymupdf.Point(520, 458), color=(0.45, 0.45, 0.5), width=0.8)
    insert_text(page, (54, 775), "검수용 초안 · 외부 배포 금지", 8.5, font, (0.45, 0.42, 0.5))


def add_answer_sheet(document: pymupdf.Document, manifest: dict, font_path: Path | None) -> None:
    page = document.new_page(width=PAGE_WIDTH, height=PAGE_HEIGHT)
    font = load_font(page, font_path)
    draw_page_header(page, manifest["title"], "답안 작성표", font)
    cell_width = 127.0
    cell_height = 33.0
    for index in range(40):
        column = 0 if index < 20 else 1
        row = index if index < 20 else index - 20
        x = MARGIN_X + column * (cell_width + 26 + cell_width)
        if column == 1:
            x = PAGE_WIDTH / 2 + 12
        y = 92 + row * cell_height
        number_rect = pymupdf.Rect(x, y, x + 34, y + cell_height)
        answer_rect = pymupdf.Rect(x + 34, y, x + 245, y + cell_height)
        page.draw_rect(number_rect, color=(0.68, 0.64, 0.76), fill=(0.96, 0.94, 0.98), width=0.5)
        page.draw_rect(answer_rect, color=(0.68, 0.64, 0.76), fill=(1, 1, 1), width=0.5)
        insert_text(page, (x + 9, y + 22), str(index + 1), 9, font, (0.22, 0.12, 0.38))
    draw_footer(page, "답안은 쉼표와 단위를 구분해 정확히 적으세요.", 1, font)


def render_crop(
    target_page: pymupdf.Page,
    source_document: pymupdf.Document,
    crop: Crop,
    target_rect: pymupdf.Rect,
    exam_number: int,
    font: str,
) -> None:
    target_page.show_pdf_page(target_rect, source_document, crop.page_number - 1, clip=crop.rect)
    scale_x = target_rect.width / crop.rect.width
    scale_y = target_rect.height / crop.rect.height
    local_x0 = (crop.anchor_rect.x0 - crop.rect.x0) * scale_x
    local_y0 = (crop.anchor_rect.y0 - crop.rect.y0) * scale_y
    local_x1 = (crop.anchor_rect.x1 - crop.rect.x0) * scale_x
    local_y1 = (crop.anchor_rect.y1 - crop.rect.y0) * scale_y
    mask = pymupdf.Rect(
        target_rect.x0 + local_x0 - 3,
        target_rect.y0 + local_y0 - 2,
        target_rect.x0 + local_x1 + 5,
        target_rect.y0 + local_y1 + 2,
    )
    target_page.draw_rect(mask, color=None, fill=(1, 1, 1), overlay=True)
    insert_text(
        target_page,
        (mask.x0 + 1, mask.y1 - 3),
        f"{exam_number:02d}",
        10.5,
        font,
        (0.24, 0.09, 0.48),
    )


def add_crop_pages(
    document: pymupdf.Document,
    manifest: dict,
    items: list[dict],
    source_documents: dict[str, pymupdf.Document],
    font_path: Path | None,
    solution: bool,
) -> None:
    section_order = [section["id"] for section in manifest["sections"]]
    page_counter = 0
    for section_id in section_order:
        section = next(section for section in manifest["sections"] if section["id"] == section_id)
        section_items = [item for item in items if item["sectionId"] == section_id]
        page: pymupdf.Page | None = None
        font = "helv"
        column = 0
        cursor_y = CONTENT_TOP
        for entry in section_items:
            crop: Crop = entry["crop"]
            height = crop.rect.height * (COLUMN_WIDTH / crop.rect.width)
            if height > CONTENT_BOTTOM - CONTENT_TOP:
                height = CONTENT_BOTTOM - CONTENT_TOP
            if page is None or cursor_y + height > CONTENT_BOTTOM:
                if page is not None and column == 0:
                    column = 1
                    cursor_y = CONTENT_TOP
                else:
                    page = document.new_page(width=PAGE_WIDTH, height=PAGE_HEIGHT)
                    font = load_font(page, font_path)
                    page_counter += 1
                    subtitle = f"{section['label']} · {section['minutes']}분" + (" · 해설" if solution else "")
                    draw_page_header(page, manifest["title"], subtitle, font)
                    draw_footer(page, manifest["footer"], page_counter, font)
                    column = 0
                    cursor_y = CONTENT_TOP
            x0 = MARGIN_X if column == 0 else MARGIN_X + COLUMN_WIDTH + COLUMN_GAP
            target = pymupdf.Rect(x0, cursor_y, x0 + COLUMN_WIDTH, cursor_y + height)
            render_crop(page, source_documents[entry["bookId"]], crop, target, int(entry["examNumber"]), font)
            cursor_y += height + 7


def write_audit(
    path: Path,
    manifest: dict,
    question_items: list[dict],
    solution_items: list[dict],
    answer_data: dict | None = None,
) -> None:
    solution_by_number = {int(item["examNumber"]): item for item in solution_items}
    answers_by_number = {
        int(item["examNumber"]): item
        for item in (answer_data or {}).get("answers", [])
    }
    records = []
    for item in question_items:
        solution = solution_by_number[int(item["examNumber"])]
        question_crop: Crop = item["crop"]
        solution_crop: Crop = solution["crop"]
        answer = answers_by_number.get(int(item["examNumber"]))
        record = {
            "examNumber": int(item["examNumber"]),
            "sectionId": item["sectionId"],
            "sourceAssetId": item["bookId"],
            "sourceFingerprint": question_crop.source_fingerprint,
            "sourceItemNumber": question_crop.source_item_number,
            "question": {
                "page": question_crop.page_number,
                "bbox": [round(value, 3) for value in question_crop.rect],
            },
            "solution": {
                "page": solution_crop.page_number,
                "bbox": [round(value, 3) for value in solution_crop.rect],
            },
            "majorUnit": item["majorUnit"],
            "minorUnit": item["minorUnit"],
            "typeId": item["typeId"],
            "difficultyBand": item["difficultyBand"],
            "answerStatus": (
                "source-solution-and-independent-verification-passed"
                if answer
                else item.get("answerStatus", "source-solution-present-review-pending")
            ),
            "reviewStatus": "reviewed-private-draft" if answer else item.get("reviewStatus", "locked"),
        }
        if answer:
            record["answer"] = {
                "canonical": answer["canonical"],
                "accepted": answer.get("accepted", [answer["canonical"]]),
                "verificationMethod": answer["method"],
            }
        records.append(record)
    audit = {
        "schemaVersion": 1,
        "examId": manifest["examId"],
        "releaseStatus": manifest.get("releaseStatus", "blocked"),
        "sourceSolutionPairing": (answer_data or {}).get("sourceSolutionPairing", "pending"),
        "independentVerification": (answer_data or {}).get("independentVerification", "pending"),
        "records": records,
    }
    path.write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", required=True, type=Path)
    parser.add_argument("--exam-output", required=True, type=Path)
    parser.add_argument("--solution-output", required=True, type=Path)
    parser.add_argument("--audit-output", required=True, type=Path)
    parser.add_argument("--answers", type=Path)
    parser.add_argument("--font", type=Path, default=Path("C:/Windows/Fonts/malgun.ttf"))
    args = parser.parse_args()

    manifest = read_json(args.manifest)
    answer_data = read_json(args.answers) if args.answers else None
    question_items, question_documents = resolve_crops(manifest, "question")
    solution_items, solution_documents = resolve_crops(manifest, "solution")
    try:
        exam = pymupdf.open()
        add_cover(exam, manifest, args.font, solution=False)
        add_crop_pages(exam, manifest, question_items, question_documents, args.font, solution=False)
        add_answer_sheet(exam, manifest, args.font)
        args.exam_output.parent.mkdir(parents=True, exist_ok=True)
        exam.save(args.exam_output, garbage=4, deflate=True)
        exam.close()

        solution = pymupdf.open()
        add_cover(solution, manifest, args.font, solution=True)
        add_crop_pages(solution, manifest, solution_items, solution_documents, args.font, solution=True)
        args.solution_output.parent.mkdir(parents=True, exist_ok=True)
        solution.save(args.solution_output, garbage=4, deflate=True)
        solution.close()

        args.audit_output.parent.mkdir(parents=True, exist_ok=True)
        write_audit(args.audit_output, manifest, question_items, solution_items, answer_data)
    finally:
        for document in {*question_documents.values(), *solution_documents.values()}:
            document.close()


if __name__ == "__main__":
    main()
