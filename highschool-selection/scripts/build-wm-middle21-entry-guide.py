#!/usr/bin/env python3
"""Build premium one-page guides for the Won Math M2-1 entry program."""

from __future__ import annotations

import argparse
from pathlib import Path

import pymupdf


A4 = pymupdf.paper_rect("a4")
PAPER = (0.975, 0.968, 0.945)
INK = (0.075, 0.090, 0.130)
INK_2 = (0.135, 0.150, 0.195)
MUTED = (0.28, 0.29, 0.33)
VIOLET = (0.34, 0.13, 0.55)
VIOLET_DARK = (0.18, 0.06, 0.31)
VIOLET_PALE = (0.92, 0.89, 0.95)
CORAL = (0.93, 0.29, 0.25)
GOLD = (0.95, 0.72, 0.19)
RULE = (0.78, 0.76, 0.72)
WHITE = (1, 1, 1)


def add_fonts(page: pymupdf.Page, body_path: Path) -> dict[str, str]:
    paths = {
        "body": body_path,
        "bold": Path(r"C:\Windows\Fonts\malgunbd.ttf"),
        "display": Path(r"C:\Windows\Fonts\NotoSerifKR-VF.ttf"),
    }
    for key, path in paths.items():
        if not path.is_file():
            raise FileNotFoundError(path)
        page.insert_font(fontname=key, fontfile=str(path))
    return {key: key for key in paths}


def text(
    page: pymupdf.Page,
    rect: pymupdf.Rect,
    value: str,
    *,
    font: str,
    size: float,
    color=INK,
    align: int = 0,
    lineheight: float = 1.15,
) -> None:
    remaining = page.insert_textbox(
        rect,
        value,
        fontname=font,
        fontsize=size,
        color=color,
        align=align,
        lineheight=lineheight,
    )
    if remaining < -0.5:
        raise RuntimeError(f"Text overflow ({remaining:.1f}) in {rect}: {value[:60]}")


def rule(page: pymupdf.Page, x1: float, y: float, x2: float, *, color=RULE, width: float = 0.7) -> None:
    page.draw_line(pymupdf.Point(x1, y), pymupdf.Point(x2, y), color=color, width=width)


def section_label(page: pymupdf.Page, y: float, number: str, title: str, fonts: dict[str, str]) -> None:
    text(page, pymupdf.Rect(39, y, 66, y + 16), number, font=fonts["bold"], size=8.2, color=CORAL)
    text(page, pymupdf.Rect(72, y - 1, 370, y + 18), title, font=fonts["bold"], size=10.6, color=INK)
    rule(page, 39, y + 22, 556, color=INK, width=0.7)


def small_label(page: pymupdf.Page, x: float, y: float, value: str, fonts: dict[str, str], *, color=VIOLET) -> None:
    page.draw_rect(pymupdf.Rect(x, y, x + 6, y + 6), color=color, fill=color)
    text(page, pymupdf.Rect(x + 12, y - 4, x + 150, y + 12), value, font=fonts["bold"], size=7.7, color=color)


def setup_page(doc: pymupdf.Document, body_path: Path) -> tuple[pymupdf.Page, dict[str, str]]:
    page = doc.new_page(width=A4.width, height=A4.height)
    page.draw_rect(page.rect, color=PAPER, fill=PAPER)
    return page, add_fonts(page, body_path)


def build(output: Path, font_path: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    doc = pymupdf.open()
    page, fonts = setup_page(doc, font_path)

    text(page, pymupdf.Rect(40, 27, 310, 43), "중2-1 기본반 · 입학 준비", font=fonts["bold"], size=7.8, color=VIOLET)
    text(page, pymupdf.Rect(39, 58, 345, 137), "붙는 공부를\n정확하게", font=fonts["display"], size=30, color=INK, lineheight=0.96)
    text(
        page,
        pymupdf.Rect(42, 145, 340, 180),
        "문제 수부터 공부 순서, 시험 보는 법까지\n한 장에 담았습니다.",
        font=fonts["body"],
        size=9.3,
        color=MUTED,
        lineheight=1.24,
    )
    page.draw_rect(pymupdf.Rect(379, 28, 557, 184), color=VIOLET_DARK, fill=VIOLET_DARK)
    text(page, pymupdf.Rect(397, 42, 536, 64), "지금 시험", font=fonts["bold"], size=8.0, color=(0.80, 0.72, 0.88))
    text(page, pymupdf.Rect(394, 62, 541, 132), "40", font=fonts["display"], size=42, color=WHITE, align=2)
    text(page, pymupdf.Rect(399, 129, 538, 151), "전체 문제", font=fonts["body"], size=8.5, color=WHITE, align=2)
    rule(page, 398, 157, 538, color=(0.50, 0.38, 0.60), width=0.6)
    text(page, pymupdf.Rect(399, 164, 538, 180), "대수 20 · 기하 20 · 각 50분", font=fonts["bold"], size=7.3, color=GOLD, align=2)
    page.draw_rect(pymupdf.Rect(39, 193, 557, 198), color=CORAL, fill=CORAL)

    section_label(page, 220, "01", "시험 구조와 합격선", fonts)
    text(page, pymupdf.Rect(40, 255, 158, 320), "28", font=fonts["display"], size=42, color=VIOLET)
    text(page, pymupdf.Rect(137, 268, 290, 291), "40문제 중", font=fonts["body"], size=8.2, color=MUTED)
    text(page, pymupdf.Rect(137, 291, 290, 316), "28문제 이상", font=fonts["bold"], size=13.2, color=INK)
    page.draw_line(pymupdf.Point(310, 255), pymupdf.Point(310, 333), color=RULE, width=0.7)
    small_label(page, 334, 259, "꼭 확인", fonts, color=CORAL)
    text(
        page,
        pymupdf.Rect(334, 281, 548, 323),
        "대수 13개 미만 또는\n기하 12개 미만이면 탈락",
        font=fonts["bold"],
        size=11.0,
        color=INK,
        lineheight=1.18,
    )
    text(
        page,
        pymupdf.Rect(40, 326, 548, 349),
        "25문제 이상 맞히면 풀이 과정도 살펴봅니다. 연습할 때는 32개 이상, 대수와 기하 각각 15개 이상을 목표로 하세요.",
        font=fonts["body"],
        size=7.9,
        color=MUTED,
    )

    section_label(page, 368, "02", "무엇을 준비할까요?", fonts)
    small_label(page, 40, 408, "중1에서 배우는 모든 내용", fonts)
    text(
        page,
        pymupdf.Rect(40, 430, 278, 492),
        "대수  소인수분해 · 정수와 유리수 · 문자와 식\n       일차방정식 · 좌표와 그래프 · 정비례/반비례\n\n기하  기본도형 · 작도와 합동 · 평면도형\n       입체도형 · 겉넓이와 부피  (통계 제외)",
        font=fonts["body"],
        size=8.3,
        color=INK_2,
        lineheight=1.18,
    )
    page.draw_line(pymupdf.Point(298, 407), pymupdf.Point(298, 506), color=RULE, width=0.7)
    small_label(page, 320, 408, "문제집은 이 순서로", fonts)
    books = [
        ("1", "기본서 · RPM", "빠진 개념과 계산 실수 줄이기"),
        ("2", "에이급 B스텝", "꼭 알아야 할 어려운 문제"),
        ("3", "블랙라벨 2스텝 · 최상위", "낯선 조건의 문제"),
        ("4", "에이급 A스텝 · 최상단", "약한 부분만 골라 풀기"),
    ]
    for idx, (num, head, body) in enumerate(books):
        y = 432 + idx * 18
        text(page, pymupdf.Rect(320, y, 338, y + 14), num, font=fonts["bold"], size=7.5, color=CORAL)
        text(page, pymupdf.Rect(342, y, 456, y + 14), head, font=fonts["bold"], size=7.8, color=INK)
        text(page, pymupdf.Rect(456, y, 552, y + 15), body, font=fonts["body"], size=6.7, color=MUTED, align=2)
        if idx < 3:
            rule(page, 320, y + 16, 552, color=(0.87, 0.85, 0.81), width=0.4)
    text(page, pymupdf.Rect(320, 505, 552, 520), "문제가 그대로 나온다는 뜻은 아닙니다.", font=fonts["body"], size=6.7, color=MUTED, align=2)

    section_label(page, 540, "03", "네 번의 연습", fonts)
    timeline_y = 601
    rule(page, 55, timeline_y, 540, color=VIOLET, width=1.1)
    steps = [
        ("01", "시험 보기", "40문제 한 번"),
        ("02", "약한 곳 찾기", "틀린 단원 표시"),
        ("03", "다시 공부", "개념 뒤 어려운 문제"),
        ("04", "시간 연습", "각 50분 · 32개 목표"),
    ]
    for idx, (num, head, body) in enumerate(steps):
        x = 55 + idx * 161.5
        page.draw_circle(pymupdf.Point(x, timeline_y), 5.5, color=VIOLET, fill=PAPER, width=1.2)
        if idx < 3:
            number_rect = pymupdf.Rect(x - 9, 574, x + 20, 590)
            head_rect = pymupdf.Rect(x - 2, 614, x + 130, 633)
            body_rect = pymupdf.Rect(x - 2, 636, x + 130, 653)
            align = 0
        else:
            number_rect = pymupdf.Rect(x - 28, 574, x + 1, 590)
            head_rect = pymupdf.Rect(x - 132, 614, x + 2, 633)
            body_rect = pymupdf.Rect(x - 132, 636, x + 2, 653)
            align = 2
        text(page, number_rect, num, font=fonts["bold"], size=7.2, color=CORAL, align=align)
        text(page, head_rect, head, font=fonts["bold"], size=9.2, color=INK, align=align)
        text(page, body_rect, body, font=fonts["body"], size=7.2, color=MUTED, align=align)

    page.draw_rect(pymupdf.Rect(0, 674, A4.width, 789), color=VIOLET_DARK, fill=VIOLET_DARK)
    text(page, pymupdf.Rect(40, 692, 182, 713), "과목별 · 50분", font=fonts["bold"], size=11.3, color=WHITE)
    test_steps = [
        ("0-35", "확실한 문제부터", "막히면 표시하고 이동"),
        ("35-45", "어려운 문제 다시", "조건을 천천히 읽기"),
        ("45-50", "마지막 확인", "부호 · 분수 · 단위"),
    ]
    for idx, (minutes, head, body) in enumerate(test_steps):
        x = 207 + idx * 116
        text(page, pymupdf.Rect(x, 692, x + 100, 713), minutes, font=fonts["bold"], size=12.8, color=GOLD)
        text(page, pymupdf.Rect(x, 726, x + 100, 743), head, font=fonts["bold"], size=8.0, color=WHITE)
        text(page, pymupdf.Rect(x, 751, x + 103, 769), body, font=fonts["body"], size=6.9, color=(0.93, 0.90, 0.95))
        if idx < 2:
            page.draw_line(pymupdf.Point(x + 105, 695), pymupdf.Point(x + 105, 768), color=(0.43, 0.34, 0.50), width=0.5)

    page.draw_rect(pymupdf.Rect(0, 789, A4.width, 842), color=CORAL, fill=CORAL)
    text(page, pymupdf.Rect(40, 803, 315, 825), "합격에서 끝나지 않습니다", font=fonts["bold"], size=12.2, color=WHITE)
    text(page, pymupdf.Rect(318, 802, 551, 828), "합격 뒤 첫 4주 동안\n수업과 숙제가 자리 잡도록 이어서 봅니다.", font=fonts["body"], size=7.6, color=WHITE, align=2, lineheight=1.12)

    doc.set_metadata({
        "title": "원수학 중2-1 기본반 입학테스트 준비 안내",
        "subject": "시험 구조, 합격선, 공부 순서, 시험 보는 법",
        "author": "지필드",
    })
    doc.save(output, garbage=4, deflate=True, clean=True)
    doc.close()


def build_aftercare(output: Path, font_path: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    doc = pymupdf.open()
    page, fonts = setup_page(doc, font_path)

    page.draw_rect(pymupdf.Rect(0, 0, A4.width, 188), color=INK, fill=INK)
    text(page, pymupdf.Rect(40, 27, 320, 44), "합격 뒤 공부 안내", font=fonts["bold"], size=7.9, color=GOLD)
    text(page, pymupdf.Rect(39, 62, 364, 139), "잘 붙고,\n오래 잘 다니기", font=fonts["display"], size=27.5, color=WHITE, lineheight=0.98)
    text(page, pymupdf.Rect(392, 24, 552, 132), "04", font=fonts["display"], size=72, color=VIOLET_PALE, align=2)
    text(page, pymupdf.Rect(405, 137, 551, 158), "첫 4주", font=fonts["bold"], size=11.0, color=CORAL, align=2)
    text(page, pymupdf.Rect(41, 153, 360, 174), "합격은 시작입니다. 공부가 자리 잡을 때까지 이어서 봅니다.", font=fonts["body"], size=8.2, color=(0.84, 0.84, 0.87))
    page.draw_rect(pymupdf.Rect(39, 187, 557, 193), color=CORAL, fill=CORAL)

    text(page, pymupdf.Rect(40, 221, 276, 250), "합격에서 끝나지 않습니다", font=fonts["bold"], size=13.8, color=VIOLET_DARK)
    text(page, pymupdf.Rect(310, 218, 553, 256), "틀린 문제와 약한 부분을 살펴보고\n첫 수업 뒤 해야 할 공부까지 이어서 안내합니다.", font=fonts["body"], size=8.0, color=MUTED, align=2, lineheight=1.18)
    rule(page, 39, 271, 557, color=INK, width=0.8)

    text(page, pymupdf.Rect(40, 292, 282, 314), "첫 4주, 이렇게 자리 잡습니다", font=fonts["bold"], size=10.8, color=INK)
    page.draw_line(pymupdf.Point(62, 340), pymupdf.Point(62, 570), color=VIOLET, width=1.2)
    weeks = [
        ("1", "숙제 시간 정하기", "한꺼번에 몰지 않고 날짜별로 나눕니다."),
        ("2", "틀린 까닭 나누기", "계산, 개념, 문제 읽기로 나눠 봅니다."),
        ("3", "시간을 재고 풀기", "느린 부분과 자주 막히는 곳을 찾습니다."),
        ("4", "40문제로 다시 확인", "같은 실수가 실제로 줄었는지 봅니다."),
    ]
    for idx, (num, head, body) in enumerate(weeks):
        y = 340 + idx * 61
        page.draw_circle(pymupdf.Point(62, y), 11, color=VIOLET, fill=PAPER, width=1.2)
        text(page, pymupdf.Rect(51, y - 7, 73, y + 8), num, font=fonts["bold"], size=7.5, color=CORAL, align=1)
        text(page, pymupdf.Rect(89, y - 11, 280, y + 8), head, font=fonts["bold"], size=9.3, color=INK)
        text(page, pymupdf.Rect(89, y + 13, 287, y + 35), body, font=fonts["body"], size=7.2, color=MUTED)

    page.draw_rect(pymupdf.Rect(319, 292, 557, 581), color=VIOLET_DARK, fill=VIOLET_DARK)
    text(page, pymupdf.Rect(340, 313, 535, 334), "수업이 있는 날", font=fonts["bold"], size=11.0, color=WHITE)
    flows = [
        ("BEFORE", "수업 전", "지난 숙제에서\n모르는 문제 표시"),
        ("CLASS", "수업 중", "막힌 까닭과\n선생님 설명 적기"),
        ("AFTER", "수업 뒤", "그날 틀린 문제를\n답 없이 다시 풀기"),
        ("NEXT", "다음 수업 전", "질문할 곳과\n다시 볼 문제 정리"),
    ]
    for idx, (tag, head, body) in enumerate(flows):
        y = 357 + idx * 52
        text(page, pymupdf.Rect(340, y, 392, y + 13), tag, font=fonts["bold"], size=5.6, color=GOLD)
        text(page, pymupdf.Rect(403, y - 2, 475, y + 16), head, font=fonts["bold"], size=8.2, color=WHITE)
        text(page, pymupdf.Rect(475, y - 4, 535, y + 29), body, font=fonts["body"], size=6.5, color=(0.94, 0.91, 0.96), align=2, lineheight=1.08)
        if idx < 3:
            rule(page, 340, y + 37, 535, color=(0.43, 0.34, 0.50), width=0.45)

    section_label(page, 620, "01", "이 네 가지는 꼭 지켜 주세요", fonts)
    checks = [
        ("A", "해설을 베끼기 전에 먼저 다시 풀었나요?"),
        ("B", "틀린 까닭을 계산, 개념, 문제 읽기로 나눴나요?"),
        ("C", "같은 실수가 두 번 나오면 약한 문제로 표시했나요?"),
        ("D", "모르는 문제를 다음 수업까지 미루지 않았나요?"),
    ]
    for idx, (letter, body) in enumerate(checks):
        x = 40 + (idx % 2) * 258
        y = 666 + (idx // 2) * 49
        page.draw_rect(pymupdf.Rect(x, y, x + 30, y + 30), color=VIOLET, fill=VIOLET)
        text(page, pymupdf.Rect(x, y + 7, x + 30, y + 22), letter, font=fonts["bold"], size=7.5, color=WHITE, align=1)
        text(page, pymupdf.Rect(x + 43, y + 3, x + 245, y + 31), body, font=fonts["body"], size=7.7, color=INK, lineheight=1.13)

    page.draw_rect(pymupdf.Rect(0, 780, A4.width, 842), color=CORAL, fill=CORAL)
    text(page, pymupdf.Rect(40, 797, 233, 821), "점수만 보고 끝내지 않습니다", font=fonts["bold"], size=10.8, color=WHITE)
    text(page, pymupdf.Rect(257, 794, 552, 828), "약한 문제를 다시 고르고, 다음 시험에서\n같은 실수가 줄었는지 함께 확인합니다.", font=fonts["body"], size=7.5, color=WHITE, align=2, lineheight=1.12)

    doc.set_metadata({
        "title": "원수학 중2-1 기본반 합격 뒤 첫 4주 공부 안내",
        "subject": "첫 4주 수업, 숙제, 틀린 문제 관리",
        "author": "지필드",
    })
    doc.save(output, garbage=4, deflate=True, clean=True)
    doc.close()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--aftercare-output", type=Path)
    parser.add_argument("--font", type=Path, default=Path(r"C:\Windows\Fonts\NotoSansKR-VF.ttf"))
    args = parser.parse_args()
    build(args.output, args.font)
    if args.aftercare_output:
        build_aftercare(args.aftercare_output, args.font)


if __name__ == "__main__":
    main()
