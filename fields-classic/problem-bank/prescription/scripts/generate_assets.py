"""Generate the fixed q16-q24 prescription diagrams.

The browser never randomizes these questions. This script only rebuilds the
reviewed PNG assets when a problem definition changes.

Q25 is rendered separately with q25_renderer.html so it can reuse the
Geometry World Three.js materials, lighting, tray, and rounded cubes.
"""

from __future__ import annotations

import math
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties
from matplotlib.patches import Circle, FancyArrowPatch, Polygon, Rectangle


ROOT = Path(__file__).resolve().parents[1]
INK = "#243142"
BLUE = "#17477f"
GOLD = "#d6aa5e"
PALE = "#f4f7fa"
KOREAN_FONT = Path(r"C:\Windows\Fonts\malgun.ttf")
FP = FontProperties(fname=str(KOREAN_FONT)) if KOREAN_FONT.exists() else None


def finish(fig, path: Path, pad: float = 0.08) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(path, dpi=180, bbox_inches="tight", pad_inches=pad, facecolor="white")
    plt.close(fig)


def draw_pyramid(ax, rows: int, values: dict[tuple[int, int], str], target=None) -> None:
    size = 1.0
    for row in range(rows):
        y = rows - row - 1
        x0 = (rows - row - 1) * size / 2
        for col in range(row + 1):
            x = x0 + col * size
            ax.add_patch(Rectangle((x, y), size, size, fc="white", ec=INK, lw=1.8))
            value = values.get((row, col))
            if value is not None:
                ax.text(x + 0.5, y + 0.5, value, ha="center", va="center", fontsize=18, color=INK)
            if target == (row, col):
                ax.text(
                    x + 0.5,
                    y + 0.5,
                    "㉠",
                    ha="center",
                    va="center",
                    fontsize=18,
                    color=BLUE,
                    fontproperties=FP,
                )
    ax.set_xlim(-0.2, rows + 0.2)
    ax.set_ylim(-0.2, rows + 0.2)
    ax.set_aspect("equal")
    ax.axis("off")


def q16() -> None:
    cases = [
        ([1, 2, 5], 9),
        ([2, 4, 7], 17),
        ([3, 6, 8], 25),
    ]
    for idx, (numbers, total) in enumerate(cases, 1):
        number_text = ", ".join(map(str, numbers))
        fig = plt.figure(figsize=(8.6, 4.5), facecolor="white")
        fig.text(0.055, 0.91, "16", fontsize=17, color=BLUE, weight="bold")
        fig.text(
            0.115,
            0.91,
            f"첫째 줄에 {number_text}을 알맞게 써넣어 두 번 모으기 한 값이",
            fontsize=13,
            color=INK,
            fontproperties=FP,
        )
        fig.text(
            0.115,
            0.83,
            f"{total}이 되도록 할 때, ㉠에 들어갈 수를 구하세요.",
            fontsize=13,
            color=INK,
            fontproperties=FP,
        )
        ax = fig.add_axes([0.31, 0.08, 0.38, 0.66])
        for col in range(3):
            ax.add_patch(Rectangle((col, 2), 1, 1, fc="white", ec=INK, lw=1.8))
        for col in range(2):
            ax.add_patch(Rectangle((col + 0.5, 1), 1, 1, fc="white", ec=INK, lw=1.8))
        ax.add_patch(Rectangle((1, 0), 1, 1, fc="white", ec=INK, lw=1.8))
        ax.text(1.5, 0.5, str(total), ha="center", va="center", fontsize=18, color=INK)
        ax.text(1.5, 2.5, "㉠", ha="center", va="center", fontsize=19, color=BLUE, fontproperties=FP)
        ax.set_xlim(-0.2, 3.2)
        ax.set_ylim(-0.2, 3.2)
        ax.set_aspect("equal")
        ax.axis("off")
        finish(fig, ROOT / "q16" / f"q16_{idx:02d}.png", pad=0.12)


def q17() -> None:
    cases = [
        ({(0, 0): "1", (1, 0): "2"}, (3, 2)),
        ({(0, 0): "2", (1, 0): "3"}, (3, 2)),
        ({(0, 0): "3", (1, 0): "1"}, (3, 2)),
    ]
    for idx, (values, target) in enumerate(cases, 1):
        fig = plt.figure(figsize=(8.6, 5.0), facecolor="white")
        fig.text(0.055, 0.91, "17", fontsize=17, color=BLUE, weight="bold")
        fig.text(
            0.115,
            0.91,
            "도형 안에 1, 2, 3을 같은 숫자끼리 서로 이웃하지 않도록",
            fontsize=13,
            color=INK,
            fontproperties=FP,
        )
        fig.text(
            0.115,
            0.83,
            "써넣을 때, ㉠에 들어갈 수를 구하세요.",
            fontsize=13,
            color=INK,
            fontproperties=FP,
        )
        ax = fig.add_axes([0.25, 0.04, 0.5, 0.7])
        draw_pyramid(ax, 4, values, target=target)
        finish(fig, ROOT / "q17" / f"q17_{idx:02d}.png", pad=0.12)


def q18() -> None:
    cases = [(13, 5), (11, 3), (12, 6)]
    for idx, (digit_sum, difference) in enumerate(cases, 1):
        fig = plt.figure(figsize=(8.6, 3.8), facecolor="white")
        fig.text(0.055, 0.88, "18", fontsize=17, color=BLUE, weight="bold")
        fig.text(
            0.115,
            0.88,
            "다음 조건을 만족하는 두 자리 수를 구하세요.",
            fontsize=13,
            color=INK,
            fontproperties=FP,
        )
        ax = fig.add_axes([0.08, 0.16, 0.84, 0.56])
        ax.add_patch(Rectangle((0.02, 0.16), 0.96, 0.72, fc="white", ec=INK, lw=1.4))
        ax.text(
            0.07,
            0.64,
            f"• 십의 자리 숫자와 일의 자리 숫자의 합은 {digit_sum}입니다.",
            fontsize=13,
            color=INK,
            va="center",
            fontproperties=FP,
        )
        ax.text(
            0.07,
            0.39,
            f"• 십의 자리 숫자는 일의 자리 숫자보다 {difference} 큽니다.",
            fontsize=13,
            color=INK,
            va="center",
            fontproperties=FP,
        )
        ax.text(0.78, -0.02, "(              )", fontsize=14, color=INK, fontproperties=FP)
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        ax.axis("off")
        finish(fig, ROOT / "q18" / f"q18_{idx:02d}.png", pad=0.12)


SHAPES = {
    "star": lambda x, y: star_patch(x, y),
    "square": lambda x, y: Rectangle((x - 0.16, y - 0.16), 0.32, 0.32, fc="white", ec=INK, lw=1.5),
    "triangle": lambda x, y: Polygon(
        [(x, y + 0.19), (x - 0.19, y - 0.16), (x + 0.19, y - 0.16)],
        closed=True,
        fc="white",
        ec=INK,
        lw=1.5,
    ),
    "circle": lambda x, y: Circle((x, y), 0.18, fc="white", ec=INK, lw=1.5),
}


def star_patch(x: float, y: float, radius: float = 0.2) -> Polygon:
    points = []
    for i in range(10):
        angle = math.pi / 2 + i * math.pi / 5
        r = radius if i % 2 == 0 else radius * 0.42
        points.append((x + r * math.cos(angle), y + r * math.sin(angle)))
    return Polygon(points, closed=True, fc="white", ec=INK, lw=1.5)


def add_shape(ax, name: str, x: float, y: float) -> None:
    ax.add_patch(SHAPES[name](x, y))


def q19() -> None:
    matrices = [
        [
            ["square", "square", "square"],
            ["triangle", "square", "triangle"],
            ["circle", "triangle", "square"],
        ],
        [
            ["star", "star", "star", "star"],
            ["square", "square", "star", "star"],
            ["triangle", "square", "triangle", "star"],
            ["circle", "triangle", "square", "star"],
        ],
        [
            ["circle", "circle", "circle", "circle"],
            ["triangle", "triangle", "circle", "circle"],
            ["square", "triangle", "square", "circle"],
            ["star", "square", "triangle", "circle"],
        ],
    ]
    values = [
        {"square": 6, "triangle": 8, "circle": 9},
        {"star": 5, "square": 6, "triangle": 8, "circle": 9},
        {"circle": 7, "triangle": 9, "square": 6, "star": 8},
    ]
    target_columns = [2, 2, 1]
    for idx, (matrix, value_map, target_col) in enumerate(zip(matrices, values, target_columns), 1):
        grid_size = len(matrix)
        fig = plt.figure(figsize=(8.6, 5.4), facecolor="white")
        fig.text(0.055, 0.92, "19", fontsize=17, color=BLUE, weight="bold")
        fig.text(
            0.115,
            0.92,
            "같은 도형은 같은 수를 나타내고, 오른쪽과 아래의 수는",
            fontsize=13,
            color=INK,
            fontproperties=FP,
        )
        fig.text(
            0.115,
            0.84,
            "각 줄의 합을 나타냅니다. ㉠에 알맞은 수를 구하세요.",
            fontsize=13,
            color=INK,
            fontproperties=FP,
        )
        fig.text(
            0.115,
            0.76,
            "같은 도형의 값을 차례로 찾아 계산하세요.",
            fontsize=11,
            color=BLUE,
            fontproperties=FP,
        )
        width = 0.38 if grid_size == 3 else 0.5
        left = (1 - width) / 2
        ax = fig.add_axes([left, 0.04, width, 0.67])
        for r in range(grid_size):
            for c in range(grid_size):
                y = grid_size - 1 - r
                ax.add_patch(Rectangle((c, y), 1, 1, fc="white", ec=INK, lw=1.5))
                add_shape(ax, matrix[r][c], c + 0.5, y + 0.5)
        row_sums = [sum(value_map[s] for s in row) for row in matrix]
        col_sums = [
            sum(value_map[matrix[r][c]] for r in range(grid_size))
            for c in range(grid_size)
        ]
        for r, value in enumerate(row_sums):
            y = grid_size - 1 - r
            ax.add_patch(Rectangle((grid_size, y), 0.85, 1, fc=PALE, ec=INK, lw=1.5))
            ax.text(grid_size + 0.425, y + 0.5, str(value), ha="center", va="center", fontsize=15, color=INK)
        for c, value in enumerate(col_sums):
            ax.add_patch(Rectangle((c, -0.85), 1, 0.85, fc=PALE, ec=INK, lw=1.5))
            if c == target_col:
                ax.text(
                    c + 0.5,
                    -0.425,
                    "㉠",
                    ha="center",
                    va="center",
                    fontsize=17,
                    color=BLUE,
                    fontproperties=FP,
                )
            else:
                ax.text(c + 0.5, -0.425, str(value), ha="center", va="center", fontsize=15, color=INK)
        ax.set_xlim(-0.1, grid_size + 0.95)
        ax.set_ylim(-0.95, grid_size + 0.1)
        ax.set_aspect("equal")
        ax.axis("off")
        finish(fig, ROOT / "q19" / f"q19_{idx:02d}.png", pad=0.12)


def q20() -> None:
    cases = [
        (["square", "4"], ["1", "square"], ["circle", "circle", "3"]),
        (["circle", "2"], ["3", "circle"], ["square", "5"]),
        (["circle", "3"], ["3", "circle"], ["square", "8"]),
    ]

    def draw_token(ax, token: str, x: float, y: float) -> None:
        if token in {"square", "circle"}:
            add_shape(ax, token, x, y)
        else:
            ax.text(x, y, token, ha="center", va="center", fontsize=22, color=INK)

    for idx, (top, bottom, result) in enumerate(cases, 1):
        fig = plt.figure(figsize=(8.6, 5.0), facecolor="white")
        fig.text(0.055, 0.91, "20", fontsize=17, color=BLUE, weight="bold")
        fig.text(
            0.115,
            0.91,
            "같은 모양은 같은 숫자, 다른 모양은 다른 숫자를 나타냅니다.",
            fontsize=13,
            color=INK,
            fontproperties=FP,
        )
        fig.text(
            0.115,
            0.83,
            "세로 계산식이 맞도록 □와 ○가 나타내는 숫자를 각각 구하세요.",
            fontsize=13,
            color=INK,
            fontproperties=FP,
        )
        ax = fig.add_axes([0.31, 0.08, 0.38, 0.66])
        ax.add_patch(Rectangle((0.0, 0.0), 3.4, 3.6, fc="#f1f3f5", ec="none"))
        rows = [(top, 2.8), (bottom, 1.85), (result, 0.65)]
        for tokens, y in rows:
            start = 2.8 - (len(tokens) - 1) * 0.72
            for col, token in enumerate(tokens):
                draw_token(ax, token, start + col * 0.72, y)
        ax.text(0.28, 1.85, "+", ha="center", va="center", fontsize=23, color=INK)
        ax.plot([0.32, 3.08], [1.3, 1.3], color=INK, lw=1.8)
        ax.set_xlim(0, 3.4)
        ax.set_ylim(0, 3.6)
        ax.set_aspect("equal")
        ax.axis("off")

        fig.text(
            0.5,
            0.035,
            "□ = (        )      ○ = (        )",
            ha="center",
            fontsize=14,
            color=INK,
            fontproperties=FP,
        )
        finish(fig, ROOT / "q20" / f"q20_{idx:02d}.png", pad=0.12)


def arrow(ax, start, end) -> None:
    dx = end[0] - start[0]
    dy = end[1] - start[1]
    distance = math.hypot(dx, dy)
    if distance == 0:
        return
    ux, uy = dx / distance, dy / distance
    padding = min(0.36, distance * 0.28)
    visible_start = (start[0] + ux * padding, start[1] + uy * padding)
    visible_end = (end[0] - ux * padding, end[1] - uy * padding)
    ax.add_patch(
        FancyArrowPatch(
            visible_start,
            visible_end,
            arrowstyle="-|>",
            mutation_scale=16,
            lw=1.8,
            color=BLUE,
            zorder=2,
        )
    )


def q21() -> None:
    cases = [
        (57, [(1, 0), (0, 1), (1, 0), (1, 0), (0, 1), (-1, 0), (-1, 0), (0, 1)]),
        (43, [(0, 1), (1, 0), (1, 0), (0, -1), (1, 0), (0, 1)]),
        (68, [(-1, 0), (0, 1), (0, 1), (1, 0), (0, -1), (1, 0), (0, 1)]),
    ]
    for idx, (start_value, moves) in enumerate(cases, 1):
        points = [(0, 0)]
        for dx, dy in moves:
            x, y = points[-1]
            points.append((x + dx, y + dy))
        min_x = min(x for x, _ in points)
        min_y = min(y for _, y in points)
        points = [(x - min_x + 0.7, y - min_y + 0.7) for x, y in points]
        fig = plt.figure(figsize=(9.4, 5.0), facecolor="white")
        fig.text(0.045, 0.91, "21", fontsize=17, color=BLUE, weight="bold")
        fig.text(
            0.095,
            0.91,
            "[보기]의 화살표가 나타내는 규칙을 찾아 오른쪽 그림의",
            fontsize=13,
            color=INK,
            fontproperties=FP,
        )
        fig.text(
            0.095,
            0.83,
            "㉠에 알맞은 수를 써넣으세요.",
            fontsize=13,
            color=INK,
            fontproperties=FP,
        )

        ref = fig.add_axes([0.05, 0.12, 0.3, 0.62])
        ref.add_patch(Rectangle((0.15, 0.15), 3.7, 3.7, fc="white", ec=INK, lw=1.2))
        ref.text(2.0, 3.62, "[보기]", ha="center", va="center", fontsize=12, color=BLUE, fontproperties=FP)
        reference_nodes = {
            (2.0, 2.0): "15",
            (0.8, 2.0): "14",
            (3.2, 2.0): "16",
            (2.0, 3.1): "5",
            (2.0, 0.9): "25",
        }
        for (x, y), value in reference_nodes.items():
            ref.add_patch(Rectangle((x - 0.32, y - 0.28), 0.64, 0.56, fc=PALE, ec=INK, lw=1.2, zorder=3))
            ref.text(x, y, value, ha="center", va="center", fontsize=13, color=INK, zorder=4)
        for end in [(0.8, 2.0), (3.2, 2.0), (2.0, 3.1), (2.0, 0.9)]:
            arrow(ref, (2.0, 2.0), end)
        ref.set_xlim(0, 4)
        ref.set_ylim(0, 4)
        ref.set_aspect("equal")
        ref.axis("off")

        ax = fig.add_axes([0.39, 0.08, 0.57, 0.67])
        ax.add_patch(Rectangle((points[0][0] - 0.36, points[0][1] - 0.31), 0.72, 0.62, fc=PALE, ec=INK, lw=1.5, zorder=4))
        ax.text(*points[0], str(start_value), ha="center", va="center", fontsize=16, color=INK, weight="bold", zorder=5)
        for p1, p2 in zip(points, points[1:]):
            arrow(ax, p1, p2)
        for i, point in enumerate(points[1:], 1):
            if i == len(points) - 1:
                ax.add_patch(Rectangle((point[0] - 0.34, point[1] - 0.3), 0.68, 0.6, fc=PALE, ec=INK, lw=1.5, zorder=4))
                ax.text(*point, "㉠", ha="center", va="center", fontsize=16, color=BLUE, fontproperties=FP, zorder=5)
            else:
                ax.add_patch(Circle(point, 0.29, fc="white", ec=INK, lw=1.5, zorder=3))
        ax.set_xlim(0, max(x for x, _ in points) + 0.8)
        ax.set_ylim(0, max(y for _, y in points) + 0.8)
        ax.set_aspect("equal")
        ax.axis("off")
        finish(fig, ROOT / "q21" / f"q21_{idx:02d}.png", pad=0.12)


def triangle_grid(ax, n: int, origin_x: float, origin_y: float, scale: float) -> int:
    height = math.sqrt(3) / 2 * scale
    count = 0
    for row in range(n):
        y = origin_y + row * height
        cells = n - row
        for col in range(cells):
            x = origin_x + row * scale * 0.5 + col * scale
            ax.add_patch(
                Polygon(
                    [(x, y), (x + scale, y), (x + scale * 0.5, y + height)],
                    closed=True,
                    fc="white",
                    ec=INK,
                    lw=1.05,
                )
            )
            count += 1
        for col in range(cells - 1):
            x = origin_x + row * scale * 0.5 + col * scale
            ax.add_patch(
                Polygon(
                    [
                        (x + scale, y),
                        (x + scale * 1.5, y + height),
                        (x + scale * 0.5, y + height),
                    ],
                    closed=True,
                    fc="white",
                    ec=INK,
                    lw=1.05,
                )
            )
            count += 1
    return count


def square_grid(ax, n: int, origin_x: float, origin_y: float, scale: float) -> int:
    count = 0
    for row in range(n):
        for col in range(n):
            ax.add_patch(
                Rectangle(
                    (origin_x + col * scale, origin_y + row * scale),
                    scale,
                    scale,
                    fc="white",
                    ec=INK,
                    lw=1.05,
                )
            )
            count += 1
    return count


def q22() -> None:
    targets = [5, 6, 7]
    labels = ["첫 번째", "두 번째", "세 번째", "네 번째"]
    for idx, target in enumerate(targets, 1):
        is_square = idx == 3
        shape_name = "정사각형" if is_square else "정삼각형"
        fig = plt.figure(figsize=(9.4, 4.8), facecolor="white")
        fig.text(0.045, 0.91, "22", fontsize=17, color=BLUE, weight="bold")
        fig.text(
            0.095,
            0.91,
            f"작은 {shape_name} 색종이를 이어 붙여 다음 모양을 만들어 나갈 때,",
            fontsize=13,
            color=INK,
            fontproperties=FP,
        )
        fig.text(
            0.095,
            0.83,
            f"{target}번째 모양에는 작은 {shape_name} 색종이가 몇 장 필요합니까?",
            fontsize=13,
            color=INK,
            fontproperties=FP,
        )
        ax = fig.add_axes([0.06, 0.12, 0.88, 0.62])
        scale = 0.7 if is_square else 0.82
        origins = [0.2, 2.0, 4.6, 8.1]
        for n, (x, label) in enumerate(zip(origins, labels), 1):
            count = (
                square_grid(ax, n, x, 0.45, scale)
                if is_square
                else triangle_grid(ax, n, x, 0.45, scale)
            )
            if count != n * n:
                raise ValueError(f"q22 stage {n}: expected {n*n} shapes, got {count}")
            ax.text(
                x + n * scale / 2,
                0.02,
                label,
                ha="center",
                va="top",
                fontsize=10,
                color=BLUE,
                fontproperties=FP,
            )
        ax.text(12.2, 1.45, "...", fontsize=25, color=INK)
        ax.text(11.1, -0.45, "(              )장", fontsize=12, color=INK, fontproperties=FP)
        ax.set_xlim(-0.1, 13.4)
        ax.set_ylim(-0.7, 3.65)
        ax.set_aspect("equal")
        ax.axis("off")
        finish(fig, ROOT / "q22" / f"q22_{idx:02d}.png", pad=0.12)


def stone_triangle(ax, n: int, origin_x: float) -> None:
    radius = 0.11
    for row in range(1, n + 1):
        y = n - row
        x0 = origin_x - (row - 1) * 0.25
        color = "#111827" if row % 2 else "#f0f2f4"
        for col in range(row):
            ax.add_patch(Circle((x0 + col * 0.5, y * 0.48), radius, fc=color, ec="#c7cdd4" if row % 2 == 0 else "#111827", lw=0.8))


def q23() -> None:
    cases = [("black", 8), ("white", 12), ("black", 17)]
    labels = ["첫 번째", "두 번째", "세 번째", "네 번째", "다섯 번째"]
    for idx, (more_color, difference) in enumerate(cases, 1):
        solutions = []
        for n in range(1, 100):
            black = sum(row for row in range(1, n + 1) if row % 2 == 1)
            white = sum(row for row in range(1, n + 1) if row % 2 == 0)
            actual_difference = black - white if more_color == "black" else white - black
            if actual_difference == difference:
                solutions.append(n)
        if len(solutions) != 1:
            raise ValueError(f"q23 difference {difference}: expected one solution, got {solutions}")

        first_color = "검은 돌이 흰 돌보다" if more_color == "black" else "흰 돌이 검은 돌보다"
        fig = plt.figure(figsize=(9.4, 4.7), facecolor="white")
        fig.text(0.045, 0.91, "23", fontsize=17, color=BLUE, weight="bold")
        fig.text(
            0.095,
            0.91,
            f"다음과 같은 규칙으로 바둑돌을 놓았습니다. {first_color}",
            fontsize=13,
            color=INK,
            fontproperties=FP,
        )
        fig.text(
            0.095,
            0.83,
            f"{difference}개 더 많다면 몇 번째 놓인 바둑돌입니까?",
            fontsize=13,
            color=INK,
            fontproperties=FP,
        )
        ax = fig.add_axes([0.06, 0.12, 0.88, 0.62])
        x = 0.2
        for n, label in enumerate(labels, 1):
            stone_triangle(ax, n, x + n * 0.3)
            ax.text(
                x + n * 0.3,
                -0.45,
                label,
                ha="center",
                fontsize=9.5,
                color=BLUE,
                fontproperties=FP,
            )
            x += n * 0.65 + 0.5
        ax.text(x + 0.2, 0.7, "...", fontsize=24, color=INK)
        ax.text(x - 0.1, -0.48, "(              )번째", fontsize=11, color=INK, fontproperties=FP)
        ax.set_xlim(-0.1, x + 1.1)
        ax.set_ylim(-0.7, 2.7)
        ax.set_aspect("equal")
        ax.axis("off")
        finish(fig, ROOT / "q23" / f"q23_{idx:02d}.png", pad=0.12)


def draw_symbol(ax, symbol: str, x: float, y: float) -> None:
    add_shape(ax, symbol, x, y)


def draw_equation(ax, symbols: list[str], rhs: list[str], y: float) -> None:
    x = 0.4
    for i, symbol in enumerate(symbols):
        draw_symbol(ax, symbol, x, y)
        x += 0.5
        if i < len(symbols) - 1:
            ax.text(x, y, "+", ha="center", va="center", fontsize=18, color=INK)
            x += 0.5
    ax.text(x, y, "=", ha="center", va="center", fontsize=18, color=INK)
    x += 0.55
    for i, symbol in enumerate(rhs):
        draw_symbol(ax, symbol, x, y)
        x += 0.5
        if i < len(rhs) - 1:
            ax.text(x, y, "+", ha="center", va="center", fontsize=18, color=INK)
            x += 0.5


def q24() -> None:
    cases = [
        (["star"] * 3, ["circle"] * 2, ["star", "circle"], ["triangle"], ["star", "triangle"]),
        (["star"] * 3, ["circle"] * 4, ["star", "circle"], ["triangle"] * 2, ["star", "triangle"]),
        (["star"] * 4, ["circle"] * 5, ["star", "circle"], ["triangle"] * 3, ["star", "triangle"]),
    ]
    for idx, (left1, right1, left2, right2, target) in enumerate(cases, 1):
        def side_value(side, values):
            return sum(values[symbol] for symbol in side)

        solutions = []
        for star in range(1, 10):
            for circle in range(1, 10):
                for triangle in range(1, 10):
                    if len({star, circle, triangle}) != 3:
                        continue
                    values = {"star": star, "circle": circle, "triangle": triangle}
                    if side_value(left1, values) != side_value(right1, values):
                        continue
                    if side_value(left2, values) != side_value(right2, values):
                        continue
                    solutions.append((star, circle, triangle, side_value(target, values)))
        if len(solutions) != 1:
            raise ValueError(f"q24 candidate {idx}: expected one solution, got {solutions}")

        fig = plt.figure(figsize=(8.6, 5.0), facecolor="white")
        fig.text(0.055, 0.91, "24", fontsize=17, color=BLUE, weight="bold")
        fig.text(
            0.115,
            0.91,
            "아래 식에서 ☆, ○, △는 서로 다른 한 자리 수입니다.",
            fontsize=13,
            color=INK,
            fontproperties=FP,
        )
        fig.text(
            0.115,
            0.83,
            "□가 나타내는 수를 구하세요.",
            fontsize=13,
            color=INK,
            fontproperties=FP,
        )
        ax = fig.add_axes([0.08, 0.1, 0.84, 0.63])
        draw_equation(ax, left1, right1, 2.4)
        draw_equation(ax, left2, right2, 1.45)
        x = 0.4
        for i, symbol in enumerate(target):
            draw_symbol(ax, symbol, x, 0.5)
            x += 0.55
            if i < len(target) - 1:
                ax.text(x, 0.5, "+", ha="center", va="center", fontsize=18, color=INK)
                x += 0.55
        ax.text(x + 0.05, 0.5, "=", ha="center", va="center", fontsize=18, color=INK)
        ax.add_patch(Rectangle((x + 0.42, 0.25), 0.5, 0.5, fc="white", ec=INK, lw=1.6))
        ax.set_xlim(0, 9.4)
        ax.set_ylim(0.05, 2.75)
        ax.set_aspect("equal")
        ax.axis("off")
        fig.text(0.5, 0.035, "□ = (              )", ha="center", fontsize=14, color=INK, fontproperties=FP)
        finish(fig, ROOT / "q24" / f"q24_{idx:02d}.png", pad=0.12)


def main() -> None:
    q16()
    q17()
    q18()
    q19()
    q20()
    q21()
    q22()
    q23()
    q24()
    print("Generated 27 fixed prescription diagrams.")


if __name__ == "__main__":
    main()
