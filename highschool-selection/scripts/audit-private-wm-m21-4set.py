#!/usr/bin/env python3
"""Audit a private four-round M2-1 mock-exam PDF package."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
from collections import Counter
from pathlib import Path

import pymupdf


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def validate_fraction(value: str) -> None:
    match = re.fullmatch(r"-?(\d+)\s*/\s*(\d+)(?:\D.*)?", value.strip())
    if not match:
        return
    numerator, denominator = map(int, match.groups())
    if denominator == 0:
        raise ValueError(f"Zero denominator: {value}")
    if math.gcd(numerator, denominator) != 1:
        raise ValueError(f"Non-reduced canonical fraction: {value}")


def audit_pdf(path: Path, expected_kind: str) -> dict:
    document = pymupdf.open(path)
    if document.needs_pass:
        raise ValueError(f"Password-protected output: {path}")
    page_sizes = {(round(page.rect.width, 1), round(page.rect.height, 1)) for page in document}
    if page_sizes != {(595.0, 842.0)}:
        raise ValueError(f"Non-A4 page in {path}: {page_sizes}")
    empty_pages = [index + 1 for index, page in enumerate(document) if not page.get_text().strip()]
    if empty_pages:
        raise ValueError(f"Textless pages in {path}: {empty_pages}")
    full_text = "\n".join(page.get_text() for page in document)
    internal_labels = ["비공개", "검수본", "검수용", "외부 배포 금지", "최종 승인 전", "초안"]
    leaked_labels = [label for label in internal_labels if label in full_text]
    if leaked_labels:
        raise ValueError(f"Internal production label leaked into user PDF {path}: {leaked_labels}")
    required = ["원수학 중2-1 기본반 대비 모의고사"]
    if expected_kind == "exam":
        required.append("답안 작성표")
    else:
        required.extend(["정답표", "점수 확인과 공부 방법"])
    missing = [text for text in required if text not in full_text]
    if missing:
        raise ValueError(f"Missing expected text in {path}: {missing}")
    if "검수 대기" in full_text:
        raise ValueError(f"Locked answer leaked into output: {path}")
    four_item_layout_pages = []
    if expected_kind == "exam":
        # Cover + ten four-item question pages + answer sheet.
        if len(document) != 12:
            raise ValueError(f"Exam must contain 12 pages for the fixed four-item layout: {path}")
        for body_index, page in enumerate(document[1:11]):
            labels = []
            for word in page.get_text("words"):
                value = str(word[4])
                if (
                    re.fullmatch(r"\d{2}", value)
                    and 30 <= float(word[0]) <= 340
                    and 80 <= float(word[1]) <= 500
                ):
                    labels.append((float(word[0]), float(word[1]), int(value)))
            labels.sort(key=lambda row: (0 if row[0] < 200 else 1, row[1]))
            actual = [row[2] for row in labels]
            first = body_index * 4 + 1
            expected = [first, first + 1, first + 2, first + 3]
            if actual != expected:
                raise ValueError(
                    f"Four-item page layout mismatch in {path}, page {body_index + 2}: "
                    f"expected {expected}, found {actual}"
                )
            four_item_layout_pages.append(actual)
    return {
        "path": str(path),
        "kind": expected_kind,
        "pages": len(document),
        "bytes": path.stat().st_size,
        "sha256": sha256(path),
        "pageSizes": sorted(page_sizes),
        "emptyTextPages": empty_pages,
        "fourItemLayoutPages": four_item_layout_pages,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--deliverable-dir", type=Path, required=True)
    parser.add_argument("--report", type=Path, required=True)
    args = parser.parse_args()

    audit_dir = args.deliverable_dir / "검수자료"
    all_source_keys: list[tuple[str, int]] = []
    round_reports = []
    for round_number in range(1, 5):
        round_id = f"r{round_number:02d}"
        manifest = read_json(audit_dir / f"{round_id}-manifest-private.json")
        answers = read_json(audit_dir / f"{round_id}-answers-private.json")
        audit = read_json(audit_dir / f"{round_id}-audit.json")
        if len(manifest.get("items", [])) != 40 or len(answers.get("answers", [])) != 40:
            raise ValueError(f"{round_id}: manifest/answer count is not 40")
        records = audit.get("records", [])
        if len(records) != 40:
            raise ValueError(f"{round_id}: audit count is not 40")
        if sorted(int(row["examNumber"]) for row in records) != list(range(1, 41)):
            raise ValueError(f"{round_id}: exam numbers are not 1..40")
        if audit.get("sourceSolutionPairing") != "passed-40-of-40":
            raise ValueError(f"{round_id}: source-solution pairing not passed")
        if audit.get("independentVerification") != "passed-40-of-40":
            raise ValueError(f"{round_id}: independent verification not passed")
        for row in records:
            if row.get("reviewStatus") != "reviewed-private-draft":
                raise ValueError(f"{round_id} item {row['examNumber']}: not reviewed")
            key = (row["sourceAssetId"], int(row["sourceItemNumber"]))
            all_source_keys.append(key)
            if row["sectionId"] == "GEO" and int(row["sourceItemNumber"]) in range(92, 99):
                raise ValueError(f"{round_id}: statistics item included: {key}")
            validate_fraction(str(row["answer"]["canonical"]))
        distribution = Counter(item["difficultyBand"] for item in manifest["items"])
        round_reports.append(
            {
                "round": round_number,
                "itemCount": 40,
                "algebraCount": sum(item["sectionId"] == "ALG" for item in manifest["items"]),
                "geometryCount": sum(item["sectionId"] == "GEO" for item in manifest["items"]),
                "difficultyDistribution": dict(sorted(distribution.items())),
                "lockedCount": 0,
            }
        )

    duplicates = [key for key, count in Counter(all_source_keys).items() if count > 1]
    if duplicates:
        raise ValueError(f"Source item reuse across rounds: {duplicates}")

    exam_pdfs = sorted((args.deliverable_dir / "시험지").glob("*.pdf"))
    solution_pdfs = sorted((args.deliverable_dir / "정답해설").glob("*.pdf"))
    if len(exam_pdfs) != 4 or len(solution_pdfs) != 4:
        raise ValueError(f"Expected 4 exam and 4 solution PDFs, found {len(exam_pdfs)} and {len(solution_pdfs)}")
    pdf_reports = [audit_pdf(path, "exam") for path in exam_pdfs]
    pdf_reports.extend(audit_pdf(path, "solution") for path in solution_pdfs)

    report = {
        "schemaVersion": 1,
        "status": "passed-private-review-package",
        "roundCount": 4,
        "itemCount": 160,
        "sourceItemReuseCount": 0,
        "statisticsItemCount": 0,
        "lockedItemCount": 0,
        "rounds": round_reports,
        "pdfs": pdf_reports,
    }
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
