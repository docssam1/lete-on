#!/usr/bin/env python3
"""Extract private Bricks Reading 250 source text for the generation pipeline.

The output contains licensed source material and must be written under
``reading-world/private`` (already ignored by Git).  This script intentionally
does not OCR student-book scans: the publisher's word lists, unit tests, teacher
guide, and dictation script provide cleaner text for Levels 2 and 3.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import pdfplumber


def pdf_pages(path: Path) -> list[str]:
    with pdfplumber.open(path) as pdf:
        return [(page.extract_text() or "").strip() for page in pdf.pages]


def find_one(root: Path, pattern: str) -> Path:
    matches = sorted(root.rglob(pattern), key=lambda path: (len(path.parts), len(str(path))))
    if not matches:
        raise FileNotFoundError(f"No {pattern!r} below {root}")
    return matches[0]


def unit_tests(root: Path, level: int) -> dict[str, list[str]]:
    matcher = re.compile(rf"Reading250\s*{level}\s*Unit Test\s*(\d+)\.pdf$", re.I)
    matches: dict[int, list[Path]] = {}
    for path in root.rglob("*.pdf"):
        match = matcher.search(path.name)
        if match:
            matches.setdefault(int(match.group(1)), []).append(path)

    result: dict[str, list[str]] = {}
    for unit in range(1, 21):
        candidates = matches.get(unit, [])
        if not candidates:
            raise FileNotFoundError(f"Level {level} Unit Test {unit} not found below {root}")
        path = sorted(candidates, key=lambda item: (len(item.parts), len(str(item))))[0]
        result[str(unit)] = pdf_pages(path)
    return result


def extract_level(root: Path, level: int, script_text: Path | None = None) -> dict:
    word_list = find_one(root, f"250-{level}_Word List.pdf")
    data = {
        "level": level,
        "word_list_pages": pdf_pages(word_list),
        "unit_tests": unit_tests(root, level),
    }

    if level == 2:
        guide = find_one(root, "250_2*TG*.pdf")
        data["teacher_guide_pages"] = pdf_pages(guide)

    if script_text:
        data["script_text"] = script_text.read_text(encoding="utf-8")

    return data


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--level2-root", required=True, type=Path)
    parser.add_argument("--level3-root", required=True, type=Path)
    parser.add_argument("--level3-script-text", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    payload = {
        "levels": {
            "2": extract_level(args.level2_root, 2),
            "3": extract_level(args.level3_root, 3, args.level3_script_text),
        }
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote private source: {args.output}")
    for level, data in payload["levels"].items():
        print(
            f"Level {level}: {len(data['word_list_pages'])} word-list pages, "
            f"{len(data['unit_tests'])} unit tests"
        )


if __name__ == "__main__":
    main()
