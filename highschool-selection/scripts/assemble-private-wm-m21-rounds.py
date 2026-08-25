#!/usr/bin/env python3
"""Assemble private Won Math M2-1 round manifests from verified candidates.

The repository keeps only assembly logic. Source questions, answers, detailed
solutions and local asset paths must be supplied from ignored private files.
"""

from __future__ import annotations

import argparse
import json
from collections import Counter, defaultdict
from copy import deepcopy
from pathlib import Path


ROUND_META = {
    1: {
        "label": "1회",
        "footer": "중2-1 기본반 대비 · 1회 · 대수 20문항 · 기하 20문항",
        "summary": "전 범위를 고르게 풀어 보며 대수와 기하 중 어디가 부족한지 확인하는 회차입니다.",
    },
    2: {
        "label": "2회",
        "footer": "중2-1 기본반 대비 · 2회 · 대수 20문항 · 기하 20문항",
        "summary": "계산 과정과 활용 문제의 식 세우기를 강화한 회차입니다.",
    },
    3: {
        "label": "3회",
        "footer": "중2-1 기본반 대비 · 3회 · 대수 20문항 · 기하 20문항",
        "summary": "도형의 조건을 빠뜨리지 않고 풀이 까닭을 쓰는 연습을 하는 회차입니다.",
    },
    4: {
        "label": "4회",
        "footer": "중2-1 기본반 대비 · 4회 · 대수 20문항 · 기하 20문항",
        "summary": "낯선 조건에도 당황하지 않고 정해진 시간 안에 푸는 연습을 하는 회차입니다.",
    },
}

SCORE_BANDS = [
    {
        "label": "36~40점",
        "comment": "전 범위의 개념과 적용이 안정적입니다. 틀린 문제는 조건 누락이나 계산 실수인지 확인하세요.",
    },
    {
        "label": "32~35점",
        "comment": "중요한 내용은 대체로 알고 있습니다. 틀린 문제를 비슷한 풀이끼리 묶어 다시 풀어 보세요.",
    },
    {
        "label": "28~31점",
        "comment": "시험 안내에 나온 합격 점수와 가까운 구간입니다. 대수와 기하 점수, 풀이 과정을 함께 살펴보세요.",
    },
    {
        "label": "25~27점",
        "comment": "맞힌 문제도 식과 계산이 맞는지 다시 확인하세요. 답만 맞힌 문제는 한 번 더 풀어 보세요.",
    },
    {
        "label": "0~24점",
        "comment": "모의고사를 더 풀기보다 기본 내용을 먼저 다시 공부하세요. 대수는 계산과 방정식, 기하는 각과 기본 도형부터 시작하세요.",
    },
]

SECTION_COMMENTS = [
    "대수 13점 미만이면 분수 계산, 문자의 식, 일차방정식을 차례로 다시 공부하세요.",
    "기하 12점 미만이면 점·선·각, 합동, 다각형부터 다시 공부한 뒤 원과 입체도형을 공부하세요.",
    "총점이 높아도 대수나 기하 한쪽 점수가 낮으면, 잘하는 쪽의 어려운 문제보다 부족한 쪽의 기본 문제를 먼저 풀어 보세요.",
]

COMMENTARY_LEAD = [
    "대수 20문제와 기하 20문제를 차례로 풉니다.",
    "각 영역은 50분이며 기하에서는 통계를 빼고 출제했습니다.",
]


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def candidate_records(payload: dict) -> list[dict]:
    records = payload.get("records", payload.get("items"))
    if not isinstance(records, list):
        raise ValueError("Candidate file must contain records or items")
    return records


def solution_lines(payload: dict, round_number: int, exam_number: int) -> list[str] | None:
    """Read optional private solution notes without embedding them in source."""
    rounds = payload.get("rounds", payload)
    round_payload = rounds.get(str(round_number), {})
    items = round_payload.get("items", round_payload)
    lines = items.get(str(exam_number))
    if lines is None:
        return None
    if not isinstance(lines, list) or not lines or not all(isinstance(line, str) and line.strip() for line in lines):
        raise ValueError(f"Invalid private solution supplement: round {round_number}, item {exam_number}")
    return lines


def add_solution_supplements(manifest: dict, round_number: int, payload: dict) -> None:
    for item in manifest["items"]:
        lines = solution_lines(payload, round_number, int(item["examNumber"]))
        if lines:
            item["solutionSupplementLines"] = lines


def validate_candidates(records: list[dict], section_id: str) -> None:
    expected_numbers = range(1, 21) if section_id == "ALG" else range(21, 41)
    for round_number in (2, 3, 4):
        rows = [row for row in records if int(row["round"]) == round_number]
        if len(rows) != 20:
            raise ValueError(f"Round {round_number} {section_id}: expected 20 records, found {len(rows)}")
        actual = sorted(int(row["examNumber"]) for row in rows)
        if actual != list(expected_numbers):
            raise ValueError(f"Round {round_number} {section_id}: invalid exam numbers {actual}")
        for row in rows:
            if row.get("reviewStatus") != "reviewed-private-draft":
                raise ValueError(f"Round {round_number} item {row['examNumber']} is not reviewed")
            if not row.get("canonical") or not row.get("verificationMethod"):
                raise ValueError(f"Round {round_number} item {row['examNumber']} lacks answer verification")

    source_numbers = [int(row["sourceItemNumber"]) for row in records]
    duplicates = [number for number, count in Counter(source_numbers).items() if count > 1]
    if duplicates:
        raise ValueError(f"Duplicate source items in {section_id}: {duplicates}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--round1-manifest", type=Path, required=True)
    parser.add_argument("--round1-answers", type=Path, required=True)
    parser.add_argument("--algebra", type=Path, required=True)
    parser.add_argument("--geometry", type=Path, required=True)
    parser.add_argument("--solution-supplements", type=Path)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()

    round1 = read_json(args.round1_manifest)
    round1_answers = read_json(args.round1_answers)
    algebra = candidate_records(read_json(args.algebra))
    geometry = candidate_records(read_json(args.geometry))
    supplements = read_json(args.solution_supplements) if args.solution_supplements else {}
    validate_candidates(algebra, "ALG")
    validate_candidates(geometry, "GEO")

    round1_sources: dict[str, set[int]] = defaultdict(set)
    for item in round1["items"]:
        round1_sources[item["bookId"]].add(int(item["sourceItemNumber"]))

    books = {book["id"]: book for book in round1["books"]}
    alg_book_id = next(book_id for book_id in books if "ALG" in book_id)
    geo_book_id = next(book_id for book_id in books if "GEO" in book_id)
    for book_id, records in ((alg_book_id, algebra), (geo_book_id, geometry)):
        overlap = round1_sources[book_id] & {int(row["sourceItemNumber"]) for row in records}
        if overlap:
            raise ValueError(f"Round-1 overlap for {book_id}: {sorted(overlap)}")

    if len(round1_answers.get("answers", [])) != 40:
        raise ValueError("Round 1 answer file must contain 40 verified answers")

    summary = {"schemaVersion": 1, "rounds": []}
    normalized_round1 = deepcopy(round1)
    normalized_round1["roundLabel"] = ROUND_META[1]["label"]
    normalized_round1["footer"] = ROUND_META[1]["footer"]
    normalized_round1["releaseStatus"] = "blocked"
    normalized_round1["commentaryIntro"] = COMMENTARY_LEAD + [ROUND_META[1]["summary"]]
    normalized_round1["scoreBands"] = SCORE_BANDS
    normalized_round1["sectionComments"] = SECTION_COMMENTS
    add_solution_supplements(normalized_round1, 1, supplements)
    r1_manifest_path = args.output_dir / "r01-manifest-private.json"
    r1_answers_path = args.output_dir / "r01-answers-private.json"
    write_json(r1_manifest_path, normalized_round1)
    write_json(r1_answers_path, round1_answers)
    r1_distribution = Counter(item["difficultyBand"] for item in normalized_round1["items"])
    summary["rounds"].append(
        {
            "round": 1,
            "examId": normalized_round1["examId"],
            "itemCount": len(normalized_round1["items"]),
            "difficultyDistribution": dict(sorted(r1_distribution.items())),
            "manifest": str(r1_manifest_path),
            "answers": str(r1_answers_path),
        }
    )

    for round_number in (2, 3, 4):
        meta = ROUND_META[round_number]
        rows = [row for row in algebra + geometry if int(row["round"]) == round_number]
        rows.sort(key=lambda row: int(row["examNumber"]))
        manifest = deepcopy(round1)
        manifest["examId"] = f"wm-middle21-basic-entry-r0{round_number}"
        manifest["roundLabel"] = meta["label"]
        manifest["footer"] = meta["footer"]
        manifest["releaseStatus"] = "blocked"
        manifest["commentaryIntro"] = COMMENTARY_LEAD + [meta["summary"]]
        manifest["scoreBands"] = SCORE_BANDS
        manifest["sectionComments"] = SECTION_COMMENTS
        manifest["items"] = []
        answers = {
            "schemaVersion": 1,
            "examId": manifest["examId"],
            "sourceSolutionPairing": "passed-40-of-40",
            "independentVerification": "passed-40-of-40",
            "answers": [],
        }
        for row in rows:
            section_id = "ALG" if int(row["examNumber"]) <= 20 else "GEO"
            manifest["items"].append(
                {
                    "examNumber": int(row["examNumber"]),
                    "sectionId": section_id,
                    "bookId": alg_book_id if section_id == "ALG" else geo_book_id,
                    "sourceItemNumber": int(row["sourceItemNumber"]),
                    "majorUnit": row["majorUnit"],
                    "minorUnit": row["minorUnit"],
                    "typeId": row["typeId"],
                    "difficultyBand": row["difficultyBand"],
                    "answerStatus": "source-solution-and-independent-verification-passed",
                    "reviewStatus": "reviewed-private-draft",
                }
            )
            answers["answers"].append(
                {
                    "examNumber": int(row["examNumber"]),
                    "canonical": str(row["canonical"]),
                    "accepted": [str(value) for value in row.get("accepted", [row["canonical"]])],
                    "method": row["verificationMethod"],
                }
            )

        add_solution_supplements(manifest, round_number, supplements)
        distribution = Counter(item["difficultyBand"] for item in manifest["items"])
        manifest_path = args.output_dir / f"r0{round_number}-manifest-private.json"
        answers_path = args.output_dir / f"r0{round_number}-answers-private.json"
        write_json(manifest_path, manifest)
        write_json(answers_path, answers)
        summary["rounds"].append(
            {
                "round": round_number,
                "examId": manifest["examId"],
                "itemCount": len(rows),
                "difficultyDistribution": dict(sorted(distribution.items())),
                "manifest": str(manifest_path),
                "answers": str(answers_path),
            }
        )

    write_json(args.output_dir / "r02-r04-assembly-summary.json", summary)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
