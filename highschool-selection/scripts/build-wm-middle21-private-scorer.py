#!/usr/bin/env python3
"""Assemble the four reviewed WM M2-1 answer files into a private scorer.

The output contains protected answers and must stay outside the public Git tree.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def fail(message: str) -> None:
    raise SystemExit(message)


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"cannot read {path.name}: {exc}")


def normalized_answers(values: object, round_number: int, item_number: int) -> list[str]:
    if not isinstance(values, list) or not values:
        fail(f"round {round_number} item {item_number} accepted answers are missing")
    result: list[str] = []
    for value in values:
        answer = str(value).strip()
        if not answer or len(answer) > 240:
            fail(f"round {round_number} item {item_number} accepted answer is invalid")
        if answer not in result:
            result.append(answer)
    return result


def build(source_dir: Path, audit: dict) -> dict:
    if audit.get("status") != "passed-private-review-package" or audit.get("roundCount") != 4 or audit.get("itemCount") != 160:
        fail("the private review package has not passed")
    if audit.get("lockedItemCount") or audit.get("sourceItemReuseCount") or audit.get("statisticsItemCount"):
        fail("the private review package contains a blocked condition")

    exams: dict[str, dict] = {}
    for round_number in range(1, 5):
        exam_id = f"wm-middle21-basic-entry-r{round_number:02d}"
        manifest = load_json(source_dir / f"r{round_number:02d}-manifest-private.json")
        answers = load_json(source_dir / f"r{round_number:02d}-answers-private.json")
        if manifest.get("examId") != exam_id or answers.get("examId") != exam_id:
            fail(f"round {round_number} exam id mismatch")
        manifest_items = manifest.get("items")
        answer_items = answers.get("answers")
        if not isinstance(manifest_items, list) or len(manifest_items) != 40:
            fail(f"round {round_number} manifest item count mismatch")
        if not isinstance(answer_items, list) or len(answer_items) != 40:
            fail(f"round {round_number} answer item count mismatch")

        scorer_items = []
        for item_number, (manifest_item, answer_item) in enumerate(zip(manifest_items, answer_items), 1):
            if manifest_item.get("examNumber") != item_number or answer_item.get("examNumber") != item_number:
                fail(f"round {round_number} item order mismatch")
            if manifest_item.get("answerStatus") != "source-solution-and-independent-verification-passed":
                fail(f"round {round_number} item {item_number} has not passed answer review")
            scorer_items.append({
                "number": item_number,
                "responseType": "input",
                "answerSpec": {
                    "type": "input",
                    "answers": normalized_answers(answer_item.get("accepted"), round_number, item_number),
                    "normalization": {
                        "trimWhitespace": True,
                        "normalizePunctuation": True,
                        "ignoreUnitSpacing": True,
                    },
                },
            })
        exams[exam_id] = {
            "gradingVersion": f"wm-middle21-r{round_number:02d}-v1",
            "classificationStatus": "verified",
            "items": scorer_items,
        }
    return {"schemaVersion": "highselect-private-scorer/v1", "exams": exams}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", required=True, type=Path)
    parser.add_argument("--audit-report", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    result = build(args.source_dir, load_json(args.audit_report))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps({"output": str(args.output), "examCount": len(result["exams"]), "itemCount": 160}, ensure_ascii=False))


if __name__ == "__main__":
    main()
