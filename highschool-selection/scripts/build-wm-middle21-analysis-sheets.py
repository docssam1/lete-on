#!/usr/bin/env python3
"""Build printable Won Math M2-1 analysis sheets from verified metadata."""

from __future__ import annotations

import argparse
import json
import subprocess
from collections import Counter, defaultdict
from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


PAGE_W, PAGE_H = A4
MARGIN = 34
NAVY = HexColor("#14213D")
INK = HexColor("#202536")
MUTED = HexColor("#667085")
VIOLET = HexColor("#6B4EFF")
VIOLET_SOFT = HexColor("#EEEAFE")
CORAL = HexColor("#FF6B5F")
GOLD = HexColor("#F2B84B")
MINT = HexColor("#38BFA7")
PAPER = HexColor("#FAFAFC")
LINE = HexColor("#D9DCE5")
SOFT = HexColor("#F1F3F7")

DIFFICULTY_LABELS = {"lowered": "기초", "standard": "기준", "raised": "심화"}
ROUND_IDS = [f"wm-middle21-basic-entry-r{index:02d}" for index in range(1, 5)]


def register_fonts() -> tuple[str, str]:
    candidates = [
        (Path("C:/Windows/Fonts/malgun.ttf"), Path("C:/Windows/Fonts/malgunbd.ttf")),
        (Path("C:/Windows/Fonts/NotoSansKR-Regular.ttf"), Path("C:/Windows/Fonts/NotoSansKR-Bold.ttf")),
    ]
    for regular, bold in candidates:
        if regular.exists() and bold.exists():
            pdfmetrics.registerFont(TTFont("Korean", str(regular)))
            pdfmetrics.registerFont(TTFont("KoreanBold", str(bold)))
            return "Korean", "KoreanBold"
    raise FileNotFoundError("Korean font not found in C:/Windows/Fonts")


def load_metadata(repo_root: Path, node_path: Path) -> dict:
    script = r"""
const diagnostic = require('./highschool-selection/data/wm-middle21-diagnostic-metadata.js');
const payload = Object.fromEntries(Object.entries(diagnostic.rounds).map(([id, round]) => [id, {
  items: round.items.map(item => ({
    number: item.number,
    domain: item.domain,
    semester: item.semester,
    majorUnit: item.majorUnit,
    minorUnit: item.minorUnit,
    detailType: item.detailType,
    difficulty: item.difficulty
  }))
}]));
process.stdout.write(JSON.stringify(payload));
"""
    result = subprocess.run(
        [str(node_path), "-e", script],
        cwd=repo_root,
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    payload = json.loads(result.stdout)
    missing = [round_id for round_id in ROUND_IDS if round_id not in payload]
    if missing:
        raise ValueError(f"Missing rounds: {missing}")
    return payload


def set_font(pdf: canvas.Canvas, bold: bool, size: float) -> None:
    pdf.setFont("KoreanBold" if bold else "Korean", size)


def draw_text(pdf: canvas.Canvas, x: float, y: float, text: str, size: float = 8,
              color=INK, bold: bool = False) -> None:
    set_font(pdf, bold, size)
    pdf.setFillColor(color)
    pdf.drawString(x, y, text)


def fit_text(pdf: canvas.Canvas, x: float, y: float, text: str, width: float,
             size: float = 7, color=INK, bold: bool = False, min_size: float = 5.2) -> None:
    font = "KoreanBold" if bold else "Korean"
    current = size
    while current > min_size and pdfmetrics.stringWidth(text, font, current) > width:
        current -= 0.2
    set_font(pdf, bold, current)
    pdf.setFillColor(color)
    pdf.drawString(x, y, text)


def rounded_box(pdf: canvas.Canvas, x: float, y: float, w: float, h: float,
                fill=white, stroke=LINE, radius: float = 9, line_width: float = 0.7) -> None:
    pdf.setFillColor(fill)
    pdf.setStrokeColor(stroke)
    pdf.setLineWidth(line_width)
    pdf.roundRect(x, y, w, h, radius, stroke=1, fill=1)


def header(pdf: canvas.Canvas, round_number: int, page_number: int, sample: bool) -> None:
    pdf.setFillColor(NAVY)
    pdf.rect(0, PAGE_H - 78, PAGE_W, 78, fill=1, stroke=0)
    draw_text(pdf, MARGIN, PAGE_H - 35, "원수학 중2-1 기본반 대비", 10, VIOLET_SOFT, True)
    draw_text(pdf, MARGIN, PAGE_H - 58, f"{round_number}회 학습 분석지", 21, white, True)
    label = "작성 예시 · 실제 학생 결과 아님" if sample else "학생용 · 채점 뒤 작성"
    label_w = 158 if sample else 116
    pdf.setFillColor(CORAL if sample else VIOLET)
    pdf.roundRect(PAGE_W - MARGIN - label_w, PAGE_H - 55, label_w, 25, 12, fill=1, stroke=0)
    set_font(pdf, True, 7.3)
    pdf.setFillColor(white)
    pdf.drawCentredString(PAGE_W - MARGIN - label_w / 2, PAGE_H - 46, label)
    draw_text(pdf, PAGE_W - MARGIN - 20, PAGE_H - 69, f"0{page_number}", 7.5, VIOLET_SOFT, True)


def footer(pdf: canvas.Canvas, round_number: int) -> None:
    y = 19
    pdf.setStrokeColor(LINE)
    pdf.setLineWidth(0.5)
    pdf.line(MARGIN, y + 10, PAGE_W - MARGIN, y + 10)
    draw_text(pdf, MARGIN, y, "GFIELD · 원수학 중2-1 대비", 6.2, MUTED, True)
    draw_text(pdf, PAGE_W - 185, y, f"{round_number}회 · 대수 20문항 · 기하 20문항", 6.2, MUTED)


def draw_identity(pdf: canvas.Canvas, sample: bool) -> None:
    y = PAGE_H - 108
    draw_text(pdf, MARGIN, y, "이름", 7, MUTED, True)
    draw_text(pdf, MARGIN + 30, y, "김지필" if sample else "", 8.5, INK, True)
    pdf.setStrokeColor(LINE)
    pdf.line(MARGIN + 28, y - 3, MARGIN + 138, y - 3)
    draw_text(pdf, MARGIN + 164, y, "응시일", 7, MUTED, True)
    draw_text(pdf, MARGIN + 208, y, "2026. 08. 26" if sample else "", 8.2, INK)
    pdf.line(MARGIN + 205, y - 3, MARGIN + 312, y - 3)
    draw_text(pdf, MARGIN + 338, y, "재점검일", 7, MUTED, True)
    pdf.line(MARGIN + 392, y - 3, PAGE_W - MARGIN, y - 3)


def score_box(pdf: canvas.Canvas, x: float, y: float, w: float, h: float,
              label: str, value: str, denominator: str, accent) -> None:
    rounded_box(pdf, x, y, w, h, white, LINE, 10)
    pdf.setFillColor(accent)
    pdf.roundRect(x + 11, y + h - 25, 54, 15, 7, fill=1, stroke=0)
    set_font(pdf, True, 6.5)
    pdf.setFillColor(white)
    pdf.drawCentredString(x + 38, y + h - 20, label)
    draw_text(pdf, x + 14, y + 17, value, 24, INK, True)
    draw_text(pdf, x + 58, y + 20, f"/ {denominator}", 8, MUTED, True)


def draw_score_summary(pdf: canvas.Canvas, sample: bool) -> None:
    y = PAGE_H - 210
    score_box(pdf, MARGIN, y, 116, 74, "총점", "30" if sample else "__", "40", VIOLET)
    score_box(pdf, MARGIN + 126, y, 116, 74, "대수", "15" if sample else "__", "20", MINT)
    score_box(pdf, MARGIN + 252, y, 116, 74, "기하", "15" if sample else "__", "20", CORAL)
    rounded_box(pdf, MARGIN + 378, y, PAGE_W - 2 * MARGIN - 378, 74, VIOLET_SOFT, VIOLET_SOFT, 10)
    draw_text(pdf, MARGIN + 392, y + 50, "공개 참고 기준", 7, VIOLET, True)
    draw_text(pdf, MARGIN + 392, y + 33, "28 / 40", 15, NAVY, True)
    draw_text(pdf, MARGIN + 392, y + 18, "대수 13 · 기하 12", 6.6, MUTED, True)


def result_cells(sample: bool) -> dict[int, str]:
    if not sample:
        return {}
    return {number: ("×" if number % 4 == 0 else "○") for number in range(1, 41)}


def draw_item_grid(pdf: canvas.Canvas, sample: bool) -> None:
    x, y, w, h = MARGIN, PAGE_H - 400, PAGE_W - 2 * MARGIN, 160
    rounded_box(pdf, x, y, w, h, white, LINE, 10)
    draw_text(pdf, x + 14, y + h - 22, "문항별 결과", 10, NAVY, True)
    draw_text(pdf, x + 91, y + h - 21, "○ 정답  ·  × 오답  ·  △ 다시 확인", 6.6, MUTED)
    results = result_cells(sample)
    cell_w = (w - 28) / 10
    cell_h = 28
    for row in range(4):
        section_color = MINT if row < 2 else CORAL
        row_y = y + h - 54 - row * 29
        section = "대수" if row < 2 else "기하"
        draw_text(pdf, x + 14, row_y + 7, section, 6.2, section_color, True)
        for col in range(10):
            number = row * 10 + col + 1
            cell_x = x + 48 + col * cell_w
            pdf.setStrokeColor(LINE)
            pdf.setFillColor(SOFT if col % 2 else PAPER)
            pdf.roundRect(cell_x, row_y, cell_w - 4, cell_h - 4, 4, fill=1, stroke=1)
            draw_text(pdf, cell_x + 5, row_y + 9, f"{number:02d}", 6.2, MUTED, True)
            mark = results.get(number, "")
            if mark:
                color = CORAL if mark == "×" else MINT
                draw_text(pdf, cell_x + cell_w - 20, row_y + 7, mark, 10, color, True)


def sample_diagnostics(items: list[dict]) -> tuple[list[dict], list[str]]:
    results = result_cells(True)
    grouped = defaultdict(lambda: {"total": 0, "correct": 0, "wrong": []})
    for item in items:
        row = grouped[item["detailType"]]
        row["total"] += 1
        if results[item["number"]] == "○":
            row["correct"] += 1
        else:
            row["wrong"].append(item["number"])
    ranked = sorted(
        (dict(label=label, **row) for label, row in grouped.items() if row["wrong"]),
        key=lambda row: (row["correct"] / row["total"], -len(row["wrong"]), row["label"]),
    )[:3]
    notes = [
        "오답 번호의 조건을 한 줄로 다시 적기",
        "대수와 기하를 나누어 각 50분으로 재시험",
        "같은 세부유형을 기초 → 기준 → 심화 순서로 다시 풀기",
    ]
    return ranked, notes


def draw_diagnosis(pdf: canvas.Canvas, items: list[dict], sample: bool) -> None:
    y = 221
    gap = 10
    left_w = 322
    right_x = MARGIN + left_w + gap
    right_w = PAGE_W - MARGIN - right_x
    rounded_box(pdf, MARGIN, y, left_w, 190, white, LINE, 10)
    draw_text(pdf, MARGIN + 14, y + 165, "취약 유형 우선순위", 10, NAVY, True)
    if sample:
        ranked, _ = sample_diagnostics(items)
        for index in range(3):
            row_y = y + 125 - index * 47
            pdf.setFillColor([CORAL, GOLD, VIOLET][index])
            pdf.circle(MARGIN + 27, row_y + 10, 11, fill=1, stroke=0)
            set_font(pdf, True, 7)
            pdf.setFillColor(white)
            pdf.drawCentredString(MARGIN + 27, row_y + 7.2, str(index + 1))
            if index < len(ranked):
                row = ranked[index]
                fit_text(pdf, MARGIN + 46, row_y + 15, row["label"], 245, 7.3, INK, True)
                draw_text(pdf, MARGIN + 46, row_y, "오답 " + ", ".join(map(str, row["wrong"])), 6.4, MUTED)
            else:
                draw_text(pdf, MARGIN + 46, row_y + 6, "추가 취약 유형 없음", 6.8, MUTED)
    else:
        for index in range(3):
            row_y = y + 128 - index * 48
            draw_text(pdf, MARGIN + 15, row_y + 8, f"0{index + 1}", 7, VIOLET, True)
            pdf.setStrokeColor(LINE)
            pdf.line(MARGIN + 42, row_y + 6, MARGIN + left_w - 15, row_y + 6)
            draw_text(pdf, MARGIN + 42, row_y - 8, "관련 오답 번호", 5.8, MUTED)
    rounded_box(pdf, right_x, y, right_w, 190, NAVY, NAVY, 10)
    draw_text(pdf, right_x + 14, y + 165, "다음 공부 순서", 10, white, True)
    notes = sample_diagnostics(items)[1] if sample else [
        "가장 낮은 유형부터 다시 풀기",
        "틀린 이유를 조건·개념·계산으로 나누기",
        "토요일에 오답만 모아 다시 시험 보기",
    ]
    for index, note in enumerate(notes):
        row_y = y + 126 - index * 48
        pdf.setFillColor(VIOLET if index == 0 else HexColor("#2A3654"))
        pdf.roundRect(right_x + 14, row_y, 23, 23, 6, fill=1, stroke=0)
        set_font(pdf, True, 7)
        pdf.setFillColor(white)
        pdf.drawCentredString(right_x + 25.5, row_y + 8, str(index + 1))
        fit_text(pdf, right_x + 46, row_y + 8, note, right_w - 60, 6.6, white, index == 0, 5.4)


def draw_reference_note(pdf: canvas.Canvas) -> None:
    x, y, w, h = MARGIN, 60, PAGE_W - 2 * MARGIN, 138
    rounded_box(pdf, x, y, w, h, PAPER, LINE, 10)
    draw_text(pdf, x + 14, y + h - 24, "점수 해석", 9.5, NAVY, True)
    bullets = [
        ("28점 이상", "공개 안내의 참고선입니다. 대수·기하 기준도 함께 확인합니다."),
        ("25~27점", "풀이 과정을 살펴보는 구간입니다. 맞힌 문제도 근거를 다시 적어 봅니다."),
        ("24점 이하", "기본 개념과 대표 유형을 먼저 묶어 다시 공부합니다."),
    ]
    for index, (label, body) in enumerate(bullets):
        row_y = y + h - 52 - index * 27
        pdf.setFillColor([VIOLET, GOLD, CORAL][index])
        pdf.circle(x + 19, row_y + 2, 3.5, fill=1, stroke=0)
        draw_text(pdf, x + 31, row_y - 1, label, 6.7, INK, True)
        fit_text(pdf, x + 95, row_y - 1, body, w - 112, 6.3, MUTED)
    draw_text(pdf, x + 14, y + 13, "※ 2026년 7월 공개 안내를 참고한 연습 점검선입니다. 실제 합격 여부는 학원 공식 결과로 확인합니다.", 5.9, MUTED)


def draw_detail_half(pdf: canvas.Canvas, items: list[dict], x: float, y: float, w: float,
                     sample: bool) -> None:
    row_h = 27.5
    header_h = 25
    columns = [24, 37, 61, w - 24 - 37 - 61 - 42 - 38, 42, 38]
    labels = ["번호", "영역", "단원", "세부유형", "난도", "결과"]
    pdf.setFillColor(NAVY)
    pdf.roundRect(x, y + len(items) * row_h, w, header_h, 6, fill=1, stroke=0)
    cursor = x
    for width, label in zip(columns, labels):
        set_font(pdf, True, 5.9)
        pdf.setFillColor(white)
        pdf.drawCentredString(cursor + width / 2, y + len(items) * row_h + 9, label)
        cursor += width
    results = result_cells(sample)
    for index, item in enumerate(items):
        row_y = y + (len(items) - index - 1) * row_h
        pdf.setFillColor(white if index % 2 == 0 else PAPER)
        pdf.setStrokeColor(LINE)
        pdf.rect(x, row_y, w, row_h, fill=1, stroke=1)
        values = [
            f"{item['number']:02d}", item["domain"], item["minorUnit"], item["detailType"],
            DIFFICULTY_LABELS[item["difficulty"]], results.get(item["number"], "○  ×  △")
        ]
        cursor = x
        for col_index, (width, value) in enumerate(zip(columns, values)):
            if col_index:
                pdf.setStrokeColor(LINE)
                pdf.line(cursor, row_y, cursor, row_y + row_h)
            if col_index in (2, 3):
                fit_text(pdf, cursor + 3, row_y + 9.5, value, width - 6, 5.5, INK, False, 4.4)
            else:
                font = "KoreanBold" if col_index in (0, 5) else "Korean"
                set_font(pdf, col_index in (0, 5), 5.5 if col_index != 5 else 7)
                pdf.setFillColor(CORAL if value == "×" else MINT if value == "○" else INK)
                pdf.drawCentredString(cursor + width / 2, row_y + 9.5, value)
            cursor += width


def draw_retest_boxes(pdf: canvas.Canvas, sample: bool) -> None:
    x, y, w, h = MARGIN, 47, PAGE_W - 2 * MARGIN, 116
    rounded_box(pdf, x, y, w, h, PAPER, LINE, 10)
    draw_text(pdf, x + 14, y + h - 23, "오답 재시험 기록", 9.5, NAVY, True)
    labels = ["1차 재시험", "2차 재시험", "최종 확인"]
    values = ["8 / 10", "10 / 10", "완료"] if sample else ["__ / __", "__ / __", ""]
    box_w = (w - 42) / 3
    for index, (label, value) in enumerate(zip(labels, values)):
        bx = x + 14 + index * (box_w + 7)
        rounded_box(pdf, bx, y + 20, box_w, 54, white, LINE, 7)
        draw_text(pdf, bx + 10, y + 57, label, 6.3, MUTED, True)
        draw_text(pdf, bx + 10, y + 34, value, 11, INK, True)
        pdf.setStrokeColor(LINE)
        pdf.line(bx + box_w - 58, y + 33, bx + box_w - 9, y + 33)
    draw_text(pdf, x + 14, y + 8, "정답을 외우기보다 틀린 이유와 다시 쓴 풀이를 함께 확인합니다.", 5.9, MUTED)


def build_pdf(path: Path, round_number: int, items: list[dict], sample: bool) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(path), pagesize=A4, pageCompression=1)
    pdf.setTitle(f"원수학 중2-1 기본반 대비 {round_number}회 학습 분석지")
    pdf.setAuthor("GFIELD")
    pdf.setSubject("원수학 중2-1 기본반 대비 학습 분석")

    pdf.setFillColor(PAPER)
    pdf.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    header(pdf, round_number, 1, sample)
    draw_identity(pdf, sample)
    draw_score_summary(pdf, sample)
    draw_item_grid(pdf, sample)
    draw_diagnosis(pdf, items, sample)
    draw_reference_note(pdf)
    footer(pdf, round_number)
    pdf.showPage()

    pdf.setFillColor(PAPER)
    pdf.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    header(pdf, round_number, 2, sample)
    draw_text(pdf, MARGIN, PAGE_H - 106, "문항별 진단 · 오답 관리", 13, NAVY, True)
    draw_text(pdf, MARGIN, PAGE_H - 123, "채점 결과를 표시하고, 오답은 1차·2차 재풀이 기록까지 이어갑니다.", 6.7, MUTED)
    table_y = 181
    gap = 9
    half_w = (PAGE_W - 2 * MARGIN - gap) / 2
    draw_detail_half(pdf, items[:20], MARGIN, table_y, half_w, sample)
    draw_detail_half(pdf, items[20:], MARGIN + half_w + gap, table_y, half_w, sample)
    draw_retest_boxes(pdf, sample)
    footer(pdf, round_number)
    pdf.save()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--node", type=Path, required=True)
    args = parser.parse_args()

    register_fonts()
    metadata = load_metadata(args.repo_root.resolve(), args.node.resolve())
    outputs = []
    for index, round_id in enumerate(ROUND_IDS, start=1):
        name = f"원수학 중2-1 기본반 대비 모의고사 {index}회_학습분석지.pdf"
        target = args.output_dir / name
        build_pdf(target, index, metadata[round_id]["items"], sample=False)
        outputs.append(target)
    sample_target = args.output_dir / "원수학 중2-1 기본반 대비 모의고사 1회_학습분석지_작성예시.pdf"
    build_pdf(sample_target, 1, metadata[ROUND_IDS[0]]["items"], sample=True)
    outputs.append(sample_target)
    for output in outputs:
        print(output)


if __name__ == "__main__":
    main()
