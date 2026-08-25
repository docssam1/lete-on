#!/usr/bin/env python3
"""Build public WM M2-1 diagnostic metadata from reviewed private manifests.

Only curriculum classification fields are exported. Source-book identifiers,
source item numbers, answers, solutions, file locations, and hashes never enter
the generated JavaScript module.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path


TYPE_LABELS = {
    "M1-NUM-PF": "소인수분해와 약수 구조",
    "M1-NUM-RAT": "절댓값·대소관계·혼합계산",
    "M1-ALG-EXP": "식의 값과 일차식의 계산",
    "M1-ALG-EQ": "일차방정식과 해의 조건",
    "M1-ALG-EQAPP": "거리·비율·수량 관계의 방정식",
    "M1-FUN-GRAPH": "좌표·그래프·관계식 해석",
    "M1-GEO-BASIC": "위치 관계와 각의 계산",
    "M1-GEO-CONG": "작도 조건과 삼각형의 합동",
    "M1-GEO-POLY": "다각형의 각과 대각선",
    "M1-GEO-CIRCLE": "부채꼴의 호·넓이와 복합 도형",
    "M1-GEO-SOLID": "다면체·회전체의 구성과 단면",
    "M1-GEO-MEASURE": "겉넓이·부피와 복합 조건",
}

EXPECTED_DIFFICULTIES = {
    1: {"lowered": 4, "standard": 24, "raised": 12},
    2: {"lowered": 22, "standard": 16, "raised": 2},
    3: {"lowered": 7, "standard": 24, "raised": 9},
    4: {"lowered": 4, "standard": 13, "raised": 23},
}


def fail(message: str) -> None:
    raise SystemExit(message)


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"cannot read {path.name}: {exc}")


def validate_audit(audit: dict) -> None:
    if audit.get("status") != "passed-private-review-package":
        fail("private review package has not passed")
    if audit.get("roundCount") != 4 or audit.get("itemCount") != 160:
        fail("private review package count mismatch")
    if audit.get("sourceItemReuseCount") or audit.get("statisticsItemCount") or audit.get("lockedItemCount"):
        fail("private review package contains a blocked condition")
    for record in audit.get("rounds", []):
        round_number = record.get("round")
        if round_number not in EXPECTED_DIFFICULTIES:
            fail("private review package contains an unknown round")
        if record.get("itemCount") != 40 or record.get("algebraCount") != 20 or record.get("geometryCount") != 20:
            fail(f"round {round_number} section count mismatch")
        if record.get("difficultyDistribution") != EXPECTED_DIFFICULTIES[round_number]:
            fail(f"round {round_number} difficulty distribution mismatch")


def public_rows(manifest_dir: Path) -> list[list[object]]:
    rows: list[list[object]] = []
    for round_number in range(1, 5):
        manifest = load_json(manifest_dir / f"r{round_number:02d}-manifest-private.json")
        exam_id = f"wm-middle21-basic-entry-r{round_number:02d}"
        if manifest.get("examId") != exam_id:
            fail(f"round {round_number} exam id mismatch")
        items = manifest.get("items")
        if not isinstance(items, list) or len(items) != 40:
            fail(f"round {round_number} item count mismatch")
        for expected_number, item in enumerate(items, 1):
            if item.get("examNumber") != expected_number:
                fail(f"round {round_number} item numbering mismatch")
            section_id = item.get("sectionId")
            if section_id not in {"ALG", "GEO"}:
                fail(f"round {round_number} item {expected_number} section mismatch")
            if expected_number <= 20 and section_id != "ALG":
                fail(f"round {round_number} algebra order mismatch")
            if expected_number > 20 and section_id != "GEO":
                fail(f"round {round_number} geometry order mismatch")
            type_id = item.get("typeId")
            if type_id not in TYPE_LABELS:
                fail(f"round {round_number} item {expected_number} unknown type")
            difficulty = item.get("difficultyBand")
            if difficulty not in {"lowered", "standard", "raised"}:
                fail(f"round {round_number} item {expected_number} difficulty mismatch")
            if item.get("answerStatus") != "source-solution-and-independent-verification-passed":
                fail(f"round {round_number} item {expected_number} answer review is incomplete")
            if item.get("reviewStatus") != "reviewed-private-draft":
                fail(f"round {round_number} item {expected_number} classification review is incomplete")
            rows.append([
                exam_id,
                f"WM-M21-R{round_number:02d}",
                expected_number,
                section_id,
                item.get("majorUnit"),
                item.get("minorUnit"),
                type_id,
                TYPE_LABELS[type_id],
                difficulty,
            ])
    return rows


def render_module(rows: list[list[object]]) -> str:
    rows_json = json.dumps(rows, ensure_ascii=False, indent=4)
    return rf'''(function (root, factory) {{
  "use strict";
  const core = typeof module !== "undefined" && module.exports
    ? require("./question-bank-core.js")
    : root.HIGHSELECT_QUESTION_BANK_CORE;
  const api = factory(core);
  root.HIGHSELECT_WM_MIDDLE21_DIAGNOSTIC_METADATA = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}})(typeof window !== "undefined" ? window : globalThis, function (core) {{
  "use strict";

  if (!core) throw new Error("HIGHSELECT_QUESTION_BANK_CORE is required");

  const MODE = "WM";
  const DIFFICULTY_BANDS = Object.freeze(["lowered", "standard", "raised"]);
  const DIFFICULTY_LABELS = Object.freeze({{ lowered: "기본", standard: "심화", raised: "최상" }});
  const SECTION_LABELS = Object.freeze({{ ALG: "대수", GEO: "기하" }});
  const POINT_POLICY = Object.freeze({{
    id: core.createNeutralId("policy", MODE, "diagnostic:wm-middle21:equal-weight:v1"),
    version: "1.0.0",
    pointsPerItem: 1,
    totalPoints: 40,
    officialWeight: false,
    note: "문항별 1점의 진단용 동일 배점입니다."
  }});

  /* Generated classification rows only. Protected source and response data are excluded. */
  const ROWS = Object.freeze({rows_json});

  const FORBIDDEN_DATA_KEYS = Object.freeze([
    "answer", "answers", "answerSpec", "answerKey", "correctAnswer", "solution", "explanation",
    "questionText", "prompt", "bookId", "sourceItemNumber", "sourcePath", "filePath", "pdfUrl",
    "downloadUrl", "storageUrl", "sourcePage", "sourceLocator", "fingerprint", "hash", "url", "uri"
  ]);
  const PRIVATE_LOCATION_PATTERN = /(?:^[A-Za-z]:[\\/]|file:\/\/|\\\\|\\.pdf(?:$|[?#])|\\.hwp(?:$|[?#]))/i;

  function freezeItem(row) {{
    const examId = row[0], roundCode = row[1], number = row[2], sectionId = row[3];
    const majorUnit = row[4], minorUnit = row[5], typeId = row[6], detailType = row[7], difficulty = row[8];
    const suffix = String(number).padStart(2, "0");
    const semester = sectionId === "ALG" ? "1학기" : "2학기";
    return Object.freeze({{
      id: core.createNeutralId("question", MODE, `diagnostic:${{roundCode.toLowerCase()}}:item:${{suffix}}`),
      examId,
      roundCode,
      number,
      points: 1,
      domainId: core.createNeutralId("type", MODE, `diagnostic:domain:${{sectionId}}`),
      domain: SECTION_LABELS[sectionId],
      gradeBand: "중1",
      semester,
      majorUnit,
      minorUnit,
      gradeSemesterUnit: ["중1", semester, majorUnit, minorUnit].join(" · "),
      detailTypeId: core.createNeutralId("type", MODE, `diagnostic:type:${{typeId}}`),
      detailType,
      difficulty,
      difficultyLabel: DIFFICULTY_LABELS[difficulty],
      cutlineSectionId: sectionId,
      reviewStatus: "verified",
      classificationStatus: "verified",
      difficultyStatus: "verified",
      classificationEvidence: Object.freeze([
        core.createNeutralId("policy", MODE, `diagnostic:${{roundCode.toLowerCase()}}:item:${{suffix}}:curriculum-evidence`),
        core.createNeutralId("policy", MODE, `diagnostic:${{roundCode.toLowerCase()}}:item:${{suffix}}:difficulty-evidence`)
      ])
    }});
  }}

  const allItems = Object.freeze(ROWS.map(freezeItem));
  const rounds = Object.freeze(Object.fromEntries(Array.from({{ length: 4 }}, function (_, index) {{
    const examId = `wm-middle21-basic-entry-r${{String(index + 1).padStart(2, "0")}}`;
    const items = Object.freeze(allItems.filter(function (item) {{ return item.examId === examId; }}));
    return [examId, Object.freeze({{
      id: core.createNeutralId("policy", MODE, `diagnostic:${{examId}}:metadata:v1`),
      examId,
      roundCode: `WM-M21-R${{String(index + 1).padStart(2, "0")}}`,
      version: "1.0.0",
      pointPolicy: POINT_POLICY,
      items
    }})];
  }})));

  function inspectPublicData(value, location, issues) {{
    if (typeof value === "string") {{
      if (PRIVATE_LOCATION_PATTERN.test(value)) issues.push(`${{location}}.private_location`);
      return;
    }}
    if (!value || typeof value !== "object") return;
    Object.keys(value).forEach(function (key) {{
      if (FORBIDDEN_DATA_KEYS.includes(key)) issues.push(`${{location}}.${{key}}.forbidden`);
      inspectPublicData(value[key], `${{location}}.${{key}}`, issues);
    }});
  }}

  function validate() {{
    const issues = [];
    if (allItems.length !== 160) issues.push("metadata.item_count");
    Object.values(rounds).forEach(function (round) {{
      if (round.items.length !== 40) issues.push(`${{round.examId}}.item_count`);
      const ids = new Set();
      round.items.forEach(function (item, index) {{
        const prefix = `${{round.examId}}.item.${{index + 1}}`;
        if (item.number !== index + 1) issues.push(`${{prefix}}.number`);
        if (!core.isNeutralId(item.id, "question", MODE) || ids.has(item.id)) issues.push(`${{prefix}}.id`);
        ids.add(item.id);
        if (!SECTION_LABELS[item.cutlineSectionId] || item.domain !== SECTION_LABELS[item.cutlineSectionId]) issues.push(`${{prefix}}.section`);
        if (item.number <= 20 && item.cutlineSectionId !== "ALG") issues.push(`${{prefix}}.algebra_order`);
        if (item.number > 20 && item.cutlineSectionId !== "GEO") issues.push(`${{prefix}}.geometry_order`);
        if (!DIFFICULTY_BANDS.includes(item.difficulty)) issues.push(`${{prefix}}.difficulty`);
        if (item.points !== 1 || item.reviewStatus !== "verified" || item.classificationStatus !== "verified") issues.push(`${{prefix}}.verification`);
        if (!Array.isArray(item.classificationEvidence) || item.classificationEvidence.length !== 2) issues.push(`${{prefix}}.evidence`);
      }});
    }});
    inspectPublicData({{ mode: MODE, pointPolicy: POINT_POLICY, rounds }}, "metadata", issues);
    return Object.freeze(Array.from(new Set(issues)).sort());
  }}

  function reportMetadataFor(examId, number) {{
    const round = rounds[examId];
    if (!round) throw new RangeError("exam id is out of range");
    if (!Number.isSafeInteger(number) || number < 1 || number > round.items.length) throw new RangeError("question number is out of range");
    const item = round.items[number - 1];
    return Object.freeze({{
      number: item.number,
      points: item.points,
      domain: item.domain,
      gradeBand: item.gradeBand,
      semester: item.semester,
      majorUnit: item.majorUnit,
      minorUnit: item.minorUnit,
      gradeSemesterUnit: item.gradeSemesterUnit,
      detailType: item.detailType,
      difficulty: item.difficulty,
      cutlineSectionId: item.cutlineSectionId,
      reviewStatus: item.reviewStatus,
      classificationStatus: item.classificationStatus,
      classificationEvidence: item.classificationEvidence
    }});
  }}

  return Object.freeze({{
    MODE,
    DIFFICULTY_BANDS,
    DIFFICULTY_LABELS,
    SECTION_LABELS,
    POINT_POLICY,
    FORBIDDEN_DATA_KEYS,
    allItems,
    rounds,
    reportMetadataFor,
    validate
  }});
}});
'''


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest-dir", required=True, type=Path)
    parser.add_argument("--audit-report", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    validate_audit(load_json(args.audit_report))
    rows = public_rows(args.manifest_dir)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(render_module(rows), encoding="utf-8", newline="\n")
    print(json.dumps({"output": str(args.output), "rounds": 4, "items": len(rows)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
