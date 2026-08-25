#!/usr/bin/env python3
"""Build a private printable exam from reviewed PDF item crops.

The manifest and generated PDFs are private artifacts. This script is generic:
it stores no source paths, question text, answers, or academy-specific item data.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from dataclasses import dataclass
from functools import lru_cache
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
ITEM_ROW_GAP = 12.0
ITEM_ROW_HEIGHT = (CONTENT_BOTTOM - CONTENT_TOP - ITEM_ROW_GAP) / 2


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
    # Keep the product title intact and place the longer solution label on its
    # own line.  A single-line concatenation clips on A4 for Korean titles.
    insert_text(page, (52, 128), manifest["title"], 26, font, accent)
    if solution:
        insert_text(page, (52, 158), "문제별 풀이", 17, font, accent)
        insert_text(page, (52, 184), manifest["roundLabel"], 13, font, (0.28, 0.28, 0.32))
        divider_y = 206
    else:
        insert_text(page, (52, 160), manifest["roundLabel"], 13, font, (0.28, 0.28, 0.32))
        divider_y = 184
    page.draw_line(pymupdf.Point(52, divider_y), pymupdf.Point(540, divider_y), color=accent, width=1.5)
    if solution:
        lines = [
            "정답을 확인한 뒤 틀린 문항의 풀이 과정을 다시 작성하세요.",
            "답만 외우지 말고 식을 세운 근거와 계산 과정을 확인하세요.",
            "같은 유형은 조건을 바꾸어 한 번 더 풀어보세요.",
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
    insert_text(page, (54, 775), manifest["footer"], 8.5, font, (0.45, 0.42, 0.5))


def add_answer_sheet(
    document: pymupdf.Document,
    manifest: dict,
    font_path: Path | None,
    page_number: int,
) -> None:
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
    draw_footer(page, "답안은 쉼표와 단위를 구분해 정확히 적으세요.", page_number, font)


def draw_answer_value(
    page: pymupdf.Page,
    rect: pymupdf.Rect,
    value: str,
    font: str,
) -> None:
    """Draw canonical answers, preserving stacked fractions when possible."""
    text = str(value).strip()
    match = re.fullmatch(r"(-?)(\d+)\s*/\s*(\d+)(.*)", text)
    color = (0.12, 0.12, 0.15)
    if not match:
        page.insert_textbox(rect, text, fontsize=9.5, fontname=font, color=color, align=1)
        return

    sign, numerator, denominator, suffix = match.groups()
    center_x = rect.x0 + rect.width / 2
    fraction_width = max(20.0, 7.0 * max(len(numerator), len(denominator)))
    if sign:
        # Place a leading minus immediately beside the fraction bar so the
        # visual grouping remains unambiguous in print.
        insert_text(page, (center_x - fraction_width / 2 - 5.5, rect.y0 + 20), sign, 10, font, color)
    page.insert_textbox(
        pymupdf.Rect(center_x - fraction_width / 2, rect.y0 + 2, center_x + fraction_width / 2, rect.y0 + 16),
        numerator,
        fontsize=8.5,
        fontname=font,
        color=color,
        align=1,
    )
    page.draw_line(
        pymupdf.Point(center_x - fraction_width / 2, rect.y0 + 17),
        pymupdf.Point(center_x + fraction_width / 2, rect.y0 + 17),
        color=color,
        width=0.7,
    )
    page.insert_textbox(
        pymupdf.Rect(center_x - fraction_width / 2, rect.y0 + 18, center_x + fraction_width / 2, rect.y0 + 32),
        denominator,
        fontsize=8.5,
        fontname=font,
        color=color,
        align=1,
    )
    if suffix.strip():
        insert_text(page, (center_x + fraction_width / 2 + 4, rect.y0 + 22), suffix.strip(), 8, font, color)


def add_answer_key_sheet(
    document: pymupdf.Document,
    manifest: dict,
    answer_data: dict,
    font_path: Path | None,
    page_number: int,
) -> None:
    page = document.new_page(width=PAGE_WIDTH, height=PAGE_HEIGHT)
    font = load_font(page, font_path)
    draw_page_header(page, manifest["title"], "정답표", font)
    answers = {int(item["examNumber"]): item for item in answer_data.get("answers", [])}
    cell_height = 31.0
    for index in range(40):
        number = index + 1
        column = 0 if index < 20 else 1
        row = index if index < 20 else index - 20
        x = MARGIN_X if column == 0 else PAGE_WIDTH / 2 + 12
        y = 90 + row * cell_height
        number_rect = pymupdf.Rect(x, y, x + 34, y + cell_height)
        answer_rect = pymupdf.Rect(x + 34, y, x + 245, y + cell_height)
        page.draw_rect(number_rect, color=(0.68, 0.64, 0.76), fill=(0.96, 0.94, 0.98), width=0.5)
        page.draw_rect(answer_rect, color=(0.68, 0.64, 0.76), fill=(1, 1, 1), width=0.5)
        insert_text(page, (x + 9, y + 20), str(number), 9, font, (0.22, 0.12, 0.38))
        answer = answers.get(number)
        draw_answer_value(page, pymupdf.Rect(x + 40, y, x + 239, y + cell_height), answer["canonical"] if answer else "검수 대기", font)
    draw_footer(
        page,
        "분수는 약분된 값으로 표시했습니다. 단위·순서 조건은 문항 지시를 따릅니다.",
        page_number,
        font,
    )


def add_commentary_sheet(
    document: pymupdf.Document,
    manifest: dict,
    font_path: Path | None,
    page_number: int,
) -> None:
    page = document.new_page(width=PAGE_WIDTH, height=PAGE_HEIGHT)
    font = load_font(page, font_path)
    draw_page_header(page, manifest["title"], "점수 확인과 공부 방법", font)
    accent = (0.24, 0.09, 0.48)

    reference = manifest.get("referenceCutline", {})
    info_lines = manifest.get(
        "commentaryIntro",
        [
            "대수 20문제와 기하 20문제를 차례로 풉니다.",
            "각 영역은 50분이며 기하에서는 통계를 빼고 출제했습니다.",
            "총점과 대수·기하 점수, 풀이 과정을 함께 살펴보세요.",
        ],
    )
    insert_text(page, (42, 102), "이렇게 풀어 보세요", 14, font, accent)
    for index, line in enumerate(info_lines):
        insert_text(page, (48, 130 + index * 22), "• " + line, 9.5, font, (0.18, 0.18, 0.21))

    if reference:
        box = pymupdf.Rect(42, 205, 553, 283)
        page.draw_rect(box, color=(0.73, 0.68, 0.82), fill=(0.975, 0.965, 0.99), width=0.8)
        insert_text(page, (54, 229), "시험 안내에 나온 점수", 11, font, accent)
        total = reference.get("minimum", "-")
        denominator = reference.get("denominator", 40)
        algebra = reference.get("algebraMinimum", "-")
        geometry = reference.get("geometryMinimum", "-")
        review = reference.get("reviewFrom", "-")
        insert_text(
            page,
            (54, 255),
            f"총 {total}/{denominator} · 대수 {algebra}/20 · 기하 {geometry}/20 · {review}점부터 풀이 과정 확인",
            10,
            font,
            (0.18, 0.18, 0.21),
        )
        insert_text(
            page,
            (54, 274),
            "연습 결과를 살펴보는 기준입니다. 실제 합격 여부와는 다를 수 있습니다.",
            8.5,
            font,
            (0.48, 0.18, 0.18),
        )

    insert_text(page, (42, 321), "점수에 따라 이렇게 공부하세요", 14, font, accent)
    score_bands = manifest.get("scoreBands", [])
    y = 347.0
    for band in score_bands:
        page.draw_rect(pymupdf.Rect(42, y, 553, y + 45), color=(0.82, 0.80, 0.86), fill=(1, 1, 1), width=0.6)
        insert_text(page, (54, y + 18), band["label"], 10.0, font, accent)
        page.insert_textbox(
            pymupdf.Rect(145, y + 6, 540, y + 40),
            band["comment"],
            fontsize=8.3,
            fontname=font,
            color=(0.18, 0.18, 0.21),
            lineheight=1.18,
        )
        y += 52

    section_heading_y = y + 4
    insert_text(page, (42, section_heading_y), "대수와 기하 점수 확인", 14, font, accent)
    section_comments = manifest.get("sectionComments", [])
    y = section_heading_y + 24
    for line in section_comments:
        page.insert_textbox(
            pymupdf.Rect(48, y, 548, y + 34),
            "• " + line,
            fontsize=8.8,
            fontname=font,
            color=(0.18, 0.18, 0.21),
            lineheight=1.2,
        )
        y += 37
    draw_footer(
        page,
        "정답만 확인하지 말고 틀린 이유와 다시 풀 수 있는지를 기록하세요.",
        page_number,
        font,
    )


def render_crop(
    target_page: pymupdf.Page,
    source_document: pymupdf.Document,
    crop: Crop,
    target_rect: pymupdf.Rect,
    exam_number: int,
    font: str,
) -> None:
    # Flatten the imported source crop before placing it.  Some source PDFs
    # contain several subset Korean fonts; although they are embedded, a few
    # browser and mobile viewers substitute those subsets incorrectly.  A
    # 3x lossless render keeps equations and diagrams print-sharp while making
    # the visible question / solution text independent of the viewer's font
    # engine.  Our own header, footer, numbering, and answer sheets remain
    # searchable text.
    source_page = source_document[crop.page_number - 1]
    source_pixmap = source_page.get_pixmap(
        matrix=pymupdf.Matrix(3.0, 3.0),
        clip=crop.rect,
        alpha=False,
        annots=False,
    )
    target_page.insert_image(
        target_rect,
        stream=source_pixmap.tobytes("png"),
        keep_proportion=False,
        overlay=True,
    )
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


def solution_supplement_height(entry: dict) -> float:
    lines = entry.get("solutionSupplementLines", [])
    if not lines:
        return 0.0
    return 27.0 + len(lines) * 14.0


def solution_entry_height(entry: dict) -> float:
    crop: Crop = entry["crop"]
    crop_height = min(
        crop.rect.height * (COLUMN_WIDTH / crop.rect.width),
        CONTENT_BOTTOM - CONTENT_TOP,
    )
    supplement = solution_supplement_height(entry)
    return crop_height + (5.0 if supplement else 0.0) + supplement


def draw_solution_supplement(
    page: pymupdf.Page,
    entry: dict,
    rect: pymupdf.Rect,
    font: str,
) -> None:
    lines = entry.get("solutionSupplementLines", [])
    if not lines:
        return
    page.draw_rect(
        rect,
        color=(0.72, 0.66, 0.82),
        fill=(0.975, 0.965, 0.99),
        width=0.7,
    )
    insert_text(page, (rect.x0 + 8, rect.y0 + 16), "풀이를 더 자세히", 8.4, font, (0.24, 0.09, 0.48))
    for index, line in enumerate(lines):
        insert_text(
            page,
            (rect.x0 + 8, rect.y0 + 34 + index * 14),
            line,
            7.5,
            font,
            (0.16, 0.16, 0.19),
        )


def plan_balanced_solution_pages(entries: list[dict]) -> list[tuple[list[dict], list[dict]]]:
    """Partition ordered solution crops into balanced two-column pages.

    The old renderer filled the left column greedily and then the right.  That
    could strand one short explanation on a final page.  This planner examines
    every valid ordered split, minimizes page count first, and then minimizes
    column-height imbalance without shrinking the source explanations.
    """

    capacity = CONTENT_BOTTOM - CONTENT_TOP
    gap = 7.0
    heights = [solution_entry_height(entry) for entry in entries]
    prefix = [0.0]
    for height in heights:
        prefix.append(prefix[-1] + height)

    def stack_height(start: int, end: int) -> float:
        count = end - start
        if count <= 0:
            return 0.0
        return prefix[end] - prefix[start] + gap * (count - 1)

    @lru_cache(maxsize=None)
    def solve(start: int) -> tuple[int, float, tuple[tuple[int, int], ...]]:
        if start == len(entries):
            return 0, 0.0, ()
        best: tuple[int, float, tuple[tuple[int, int], ...]] | None = None
        for split in range(start + 1, len(entries) + 1):
            left_height = stack_height(start, split)
            if left_height > capacity + 0.01:
                break
            for end in range(split, len(entries) + 1):
                if end == split and end != len(entries):
                    continue
                right_height = stack_height(split, end)
                if right_height > capacity + 0.01:
                    break
                remaining_pages, remaining_penalty, remaining_plan = solve(end)
                empty_penalty = capacity * 3 if end == split else 0.0
                short_column_penalty = max(0.0, capacity * 0.16 - min(left_height, right_height))
                penalty = (
                    abs(left_height - right_height)
                    + empty_penalty
                    + short_column_penalty * 2
                    + remaining_penalty
                )
                candidate = (
                    1 + remaining_pages,
                    penalty,
                    ((split, end),) + remaining_plan,
                )
                if best is None or candidate[:2] < best[:2]:
                    best = candidate
        if best is None:
            raise ValueError(f"Unable to place solution item {start + 1}")
        return best

    _, _, encoded = solve(0)
    pages: list[tuple[list[dict], list[dict]]] = []
    start = 0
    for split, end in encoded:
        pages.append((entries[start:split], entries[split:end]))
        start = end
    return pages


def add_crop_pages(
    document: pymupdf.Document,
    manifest: dict,
    items: list[dict],
    source_documents: dict[str, pymupdf.Document],
    font_path: Path | None,
    solution: bool,
    page_number_start: int = 0,
) -> None:
    section_order = [section["id"] for section in manifest["sections"]]
    page_counter = page_number_start
    for section_id in section_order:
        section = next(section for section in manifest["sections"] if section["id"] == section_id)
        section_items = [item for item in items if item["sectionId"] == section_id]
        if not solution:
            # The student exam always uses a fixed four-item page: the first
            # two items in the left column and the next two in the right
            # column.  Earlier height-driven packing could leave one item by
            # itself on the left while three items accumulated on the right.
            # Fixed slots preserve reading order and make every printed page
            # predictable.
            slots = ((0, 0), (0, 1), (1, 0), (1, 1))
            for chunk_start in range(0, len(section_items), 4):
                chunk = section_items[chunk_start : chunk_start + 4]
                page = document.new_page(width=PAGE_WIDTH, height=PAGE_HEIGHT)
                font = load_font(page, font_path)
                page_counter += 1
                subtitle = f"{section['label']} · {section['minutes']}분"
                draw_page_header(page, manifest["title"], subtitle, font)
                draw_footer(page, manifest["footer"], page_counter, font)
                divider_y = CONTENT_TOP + ITEM_ROW_HEIGHT + ITEM_ROW_GAP / 2
                for column in (0, 1):
                    x0 = MARGIN_X if column == 0 else MARGIN_X + COLUMN_WIDTH + COLUMN_GAP
                    page.draw_line(
                        pymupdf.Point(x0, divider_y),
                        pymupdf.Point(x0 + COLUMN_WIDTH, divider_y),
                        color=(0.88, 0.86, 0.91),
                        width=0.45,
                    )
                for entry, (column, row) in zip(chunk, slots):
                    crop: Crop = entry["crop"]
                    slot_x0 = MARGIN_X if column == 0 else MARGIN_X + COLUMN_WIDTH + COLUMN_GAP
                    slot_y0 = CONTENT_TOP + row * (ITEM_ROW_HEIGHT + ITEM_ROW_GAP)
                    available_width = COLUMN_WIDTH
                    available_height = ITEM_ROW_HEIGHT - 5.0
                    scale = min(
                        available_width / crop.rect.width,
                        available_height / crop.rect.height,
                    )
                    target_width = crop.rect.width * scale
                    target_height = crop.rect.height * scale
                    target = pymupdf.Rect(
                        slot_x0,
                        slot_y0,
                        slot_x0 + target_width,
                        slot_y0 + target_height,
                    )
                    render_crop(
                        page,
                        source_documents[entry["bookId"]],
                        crop,
                        target,
                        int(entry["examNumber"]),
                        font,
                    )
            continue

        for left_entries, right_entries in plan_balanced_solution_pages(section_items):
            page = document.new_page(width=PAGE_WIDTH, height=PAGE_HEIGHT)
            font = load_font(page, font_path)
            page_counter += 1
            subtitle = f"{section['label']} · {section['minutes']}분 · 해설"
            draw_page_header(page, manifest["title"], subtitle, font)
            draw_footer(page, manifest["footer"], page_counter, font)
            for column, column_entries in enumerate((left_entries, right_entries)):
                x0 = MARGIN_X if column == 0 else MARGIN_X + COLUMN_WIDTH + COLUMN_GAP
                cursor_y = CONTENT_TOP
                for entry in column_entries:
                    crop: Crop = entry["crop"]
                    crop_height = min(
                        crop.rect.height * (COLUMN_WIDTH / crop.rect.width),
                        CONTENT_BOTTOM - CONTENT_TOP,
                    )
                    target = pymupdf.Rect(x0, cursor_y, x0 + COLUMN_WIDTH, cursor_y + crop_height)
                    render_crop(
                        page,
                        source_documents[entry["bookId"]],
                        crop,
                        target,
                        int(entry["examNumber"]),
                        font,
                    )
                    supplement_height = solution_supplement_height(entry)
                    if supplement_height:
                        supplement_rect = pymupdf.Rect(
                            x0,
                            target.y1 + 5,
                            x0 + COLUMN_WIDTH,
                            target.y1 + 5 + supplement_height,
                        )
                        draw_solution_supplement(page, entry, supplement_rect, font)
                    cursor_y += crop_height + (5 if supplement_height else 0) + supplement_height + 7


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
        add_answer_sheet(exam, manifest, args.font, page_number=len(exam))
        args.exam_output.parent.mkdir(parents=True, exist_ok=True)
        exam.save(args.exam_output, garbage=4, deflate=True)
        exam.close()

        solution = pymupdf.open()
        add_cover(solution, manifest, args.font, solution=True)
        if answer_data:
            add_answer_key_sheet(solution, manifest, answer_data, args.font, page_number=2)
        add_commentary_sheet(solution, manifest, args.font, page_number=len(solution) + 1)
        add_crop_pages(
            solution,
            manifest,
            solution_items,
            solution_documents,
            args.font,
            solution=True,
            page_number_start=len(solution),
        )
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
