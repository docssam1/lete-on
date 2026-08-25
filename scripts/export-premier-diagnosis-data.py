#!/usr/bin/env python3
"""Export public, answer-free Premier diagnosis metadata from private memory.

The source catalog contains private audit notes.  This exporter intentionally
keeps only the exam key, question number, area, short type label, and whether
the original PDF image is safe to include in O/X scoring.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


AREA_BY_TAG = {
    "arithmetic": "수와 연산",
    "spatial": "공간과 도형",
    "logic": "논리와 관계",
    "pattern": "규칙과 관계",
    "combinatorics": "경우의 수",
    "measurement": "측정과 시간",
}

UNSAFE_SOURCE_TAGS = {
    "excluded-original",
    "single-answer-replacement",
    "clarified-condition",
    "source-contamination",
    "source-error",
    "visual-redraw",
    "source-edit",
    "ambiguous-condition",
    "multiple-answers",
    "ambiguous-view",
}

# These records describe replacement questions, so the original-image item is
# always locked.  The overrides provide a stable Korean label for diagnosis.
OVERRIDES = {
    "premier-util-06.q02": ("수와 연산", "수 가르기 조건 확인"),
    "premier-util-06.q08": ("경우의 수", "연산 기호 넣기"),
    "premier-util-06.q09": ("수와 연산", "숫자 카드로 뺄셈식 만들기"),
    "premier-util-06.q18": ("수와 연산", "세로셈 빈칸 채우기"),
    "premier-util-06.q20": ("규칙과 관계", "이웃한 수의 합 규칙"),
    "premier-util-07.q04": ("공간과 도형", "같은 모양으로 영역 나누기"),
    "premier-util-07.q06": ("수와 연산", "숫자 카드 식 만들기"),
    "premier-util-07.q08": ("수와 연산", "서로 다른 수의 식 완성"),
    "premier-util-07.q12": ("공간과 도형", "도형 속 삼각형 세기"),
    "premier-util-07.q13": ("공간과 도형", "상자 안 쌓기나무 채우기"),
    "premier-util-07.q19": ("규칙과 관계", "수 삼각형의 같은 합"),
    "premier-util-07.q20": ("규칙과 관계", "이웃한 수의 합 규칙"),
    "premier-final-02.q11": ("공간과 도형", "지도 색칠에 필요한 색 수"),
}

EXAM_PATTERN = re.compile(r"^premier-(util|final|last)-(\d{2})\.q(\d{2})$")
SERIES = {
    "util": ("utilization", "활용 모의고사"),
    "final": ("final", "파이널 모의고사"),
    "last": ("last", "최종 모의고사"),
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--catalog", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    catalog = json.loads(args.catalog.read_text(encoding="utf-8"))
    exams: dict[str, dict] = {}

    for record in catalog.get("records", []):
        match = EXAM_PATTERN.match(record.get("id", ""))
        if not match:
            continue
        series_code, round_text, question_text = match.groups()
        series_key, series_label = SERIES[series_code]
        round_number = int(round_text)
        question_number = int(question_text)
        exam_key = f"premier-{series_key}-{round_number}"
        exam = exams.setdefault(
            exam_key,
            {
                "key": exam_key,
                "title": f"{series_label} {round_number}회",
                "totalQuestions": 20,
                "questions": [],
            },
        )

        tags = set(record.get("tags", []))
        override = OVERRIDES.get(record["id"])
        category_tags = [tag for tag in AREA_BY_TAG if tag in tags]
        if override:
            area, type_label = override
        else:
            if len(category_tags) != 1:
                raise ValueError(f"{record['id']}: expected one category tag, got {category_tags}")
            area = AREA_BY_TAG[category_tags[0]]
            type_label = str(record.get("title", "")).strip()
        if not type_label:
            raise ValueError(f"{record['id']}: empty type label")

        scoring_eligible = record.get("status") == "verified" and not (tags & UNSAFE_SOURCE_TAGS)
        exam["questions"].append(
            {
                "number": question_number,
                "area": area,
                "type": type_label,
                "scoringEligible": scoring_eligible,
                "reviewStatus": "verified" if scoring_eligible else "locked",
            }
        )

    order = {"utilization": 0, "final": 1, "last": 2}
    exam_list = sorted(
        exams.values(),
        key=lambda exam: (
            order[exam["key"].split("-")[1]],
            int(exam["key"].rsplit("-", 1)[1]),
        ),
    )
    expected_rounds = {"utilization": 8, "final": 3, "last": 4}
    for series_key, expected_count in expected_rounds.items():
        actual = sum(1 for exam in exam_list if exam["key"].startswith(f"premier-{series_key}-"))
        if actual != expected_count:
            raise ValueError(f"{series_key}: expected {expected_count} exams, got {actual}")
    for exam in exam_list:
        exam["questions"].sort(key=lambda question: question["number"])
        numbers = [question["number"] for question in exam["questions"]]
        if numbers != list(range(1, 21)):
            raise ValueError(f"{exam['key']}: expected questions 1..20, got {numbers}")
        exam["eligibleCount"] = sum(question["scoringEligible"] for question in exam["questions"])
        exam["lockedCount"] = 20 - exam["eligibleCount"]

    public_data = {
        "version": catalog.get("updated", catalog.get("version", "unknown")),
        "policy": "original-image-single-answer-only",
        "exams": exam_list,
    }
    serialized = json.dumps(public_data, ensure_ascii=False, indent=2)
    output = (
        "/* Generated from private audit memory. Contains no questions or answers. */\n"
        "(function (root) {\n"
        "  \"use strict\";\n"
        f"  root.PREMIER_DIAGNOSIS_DATA = {serialized};\n"
        "})(window);\n"
    )
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(output, encoding="utf-8", newline="\n")
    eligible = sum(exam["eligibleCount"] for exam in exam_list)
    print(f"exported {len(exam_list)} exams, {eligible} eligible, {300 - eligible} locked -> {args.output}")


if __name__ == "__main__":
    main()
