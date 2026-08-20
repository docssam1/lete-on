#!/usr/bin/env python3
"""Extract private Vocabulary Workshop word packs from local OCR JSON.

The generated JSON contains licensed definitions and is intentionally written
under reading-world/private/, which is ignored by Git. No network is used.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


PURPLE_STARTS = [9, 17, 31, 39, 53, 61, 79, 87, 101, 109, 123, 131, 145, 153]
RED_STARTS = [6, 14, 24, 32, 42, 50, 60, 68, 78, 86, 96, 104]
RED_CORRECTIONS = {"ealous": "jealous"}
RED_NOISE = {"horus", "practice", "tuesday", "sale"}
PURPLE_TERM_OVERRIDES = {
    2: ["bench", "bridge", "cross", "crowd", "deep", "fresh", "frown", "signal", "travel", "worry"],
    6: ["agree", "bare", "famous", "feast", "gentle", "hero", "leader", "notice", "search", "weak"],
    8: ["dive", "enemy", "frighten", "herd", "pack", "prove", "seal", "smooth", "soar", "steady"],
    10: ["board", "curious", "dangerous", "doubt", "eager", "fear", "leap", "screech", "squeeze", "village"],
    11: ["beam", "carve", "den", "lean", "odd", "proper", "scrape", "steer", "tender", "tense"],
}
DEFINITION_FALLBACKS = {
    "snowstorm": "A snowstorm happens when a lot of snow falls.",
    "passenger": "A passenger is someone who travels in a vehicle but is not the driver.",
    "plead": "To beg or ask for something strongly.",
    "drowsy": "Feeling sleepy and ready to rest.",
}
INSTRUCTION_WORDS = {
    "completing the sentence", "match the meaning", "word meanings",
    "introducing the words", "listen", "practice unit words with",
}


def line_x(line: dict) -> float:
    return float(line["box"][0][0])


def line_y(line: dict) -> float:
    return float(line["box"][0][1])


def clean(value: str) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def simple_word(value: str) -> str | None:
    value = clean(value).lower()
    value = re.sub(r"^(?:[0-9]+|[il])\s*[.,]\s*", "", value)
    if not re.fullmatch(r"[a-z][a-z -]{1,24}", value):
        return None
    if value in INSTRUCTION_WORDS or "  " in value:
        return None
    return value


def ordered_unique(values: list[str]) -> list[str]:
    return list(dict.fromkeys(values))


def usable_definition(term: str, value: str | None) -> str | None:
    if value and len(value) >= 8:
        return value
    return DEFINITION_FALLBACKS.get(term)


def purple_terms(pages: list[dict], start: int) -> list[str]:
    candidates: list[str] = []
    # The Completing the Sentence word box is the cleanest ten-word source.
    for page_no, low, high in ((start + 3, 330, 850), (start + 2, 350, 2150)):
        for line in sorted(pages[page_no - 1]["lines"], key=lambda row: (line_y(row), line_x(row))):
            if not (low <= line_y(line) <= high and line_x(line) >= 250):
                continue
            word = simple_word(line["text"])
            if word:
                candidates.append(word)
        if len(ordered_unique(candidates)) >= 10:
            break
    return ordered_unique(candidates)[:10]


def page_sentences(page: dict) -> list[str]:
    lines = [
        clean(line["text"])
        for line in sorted(page["lines"], key=lambda row: (line_y(row), line_x(row)))
        if line_x(line) >= 350 and 200 <= line_y(line) <= 3260
    ]
    sentences: list[str] = []
    buffer: list[str] = []
    for value in lines:
        if not value or "vocabularyworkshop" in value.lower():
            continue
        buffer.append(value)
        if re.search(r"[.!?][\"']?$", value):
            sentences.append(clean(" ".join(buffer)))
            buffer = []
    if buffer:
        sentences.append(clean(" ".join(buffer)))
    return sentences


def purple_definition(term: str, pages: list[dict]) -> str | None:
    term_re = re.compile(rf"\b{re.escape(term)}\b", re.I)
    candidates: list[tuple[int, int, str]] = []
    cues = (
        " means ", " is ", " are ", "when you ", "if you ",
        "if something ", "if someone ", "to " + term + " ",
    )
    for page in pages:
        for sentence in page_sentences(page):
            if not term_re.search(sentence) or len(sentence) > 240:
                continue
            lower = " " + sentence.lower() + " "
            cue_score = sum(cue in lower for cue in cues)
            start_score = int(bool(re.match(rf"^(?:a|an|the|when|if|to)?\s*{re.escape(term)}\b", sentence, re.I)))
            candidates.append((cue_score + start_score, -len(sentence), sentence))
    if not candidates:
        return None
    return max(candidates)[2]


def extract_purple(book: dict) -> dict:
    pages = book["pages"]
    units = []
    for unit_no, start in enumerate(PURPLE_STARTS, 1):
        terms = PURPLE_TERM_OVERRIDES.get(unit_no, purple_terms(pages, start))
        definition_pages = [pages[start - 1], pages[start]]
        words = [[term, usable_definition(term, purple_definition(term, definition_pages))] for term in terms]
        units.append({"unit": unit_no, "lessonId": f"vwp{unit_no:02d}", "words": words})
    return {"bookId": "vocabulary-workshop-purple", "level": "Purple", "units": units}


def red_terms(page: dict) -> list[str]:
    values = []
    for line in sorted(page["lines"], key=lambda row: (line_y(row), line_x(row))):
        raw = clean(line["text"])
        word = simple_word(raw)
        if not word or word in RED_NOISE:
            continue
        if re.search(r"\s{2,}", raw) or len(word.split()) > 1:
            continue
        values.append(RED_CORRECTIONS.get(word, word))
    return ordered_unique(values)[-10:]


def red_glossary(book: dict, all_terms: set[str]) -> dict[str, str]:
    definitions: dict[str, str] = {}
    for page_no in range(115, 128):
        page = book["pages"][page_no - 1]
        for col_min, col_max in ((0, 700), (700, 2400)):
            lines = [
                line for line in page["lines"]
                if col_min <= line_x(line) < col_max and 100 <= line_y(line) <= 3260
            ]
            lines.sort(key=line_y)
            current: str | None = None
            parts: list[str] = []

            def finish() -> None:
                nonlocal current, parts
                if current and parts:
                    value = clean(" ".join(parts)).rstrip(" .") + "."
                    definitions[current] = value
                current, parts = None, []

            for line in lines:
                value = clean(line["text"])
                candidate = simple_word(value)
                if candidate in all_terms:
                    finish()
                    current = candidate
                elif current and not re.search(r"Glossary|^[0-9]+$", value, re.I):
                    parts.append(value)
            finish()
    return definitions


def extract_red(book: dict) -> dict:
    pages = book["pages"]
    term_sets = [red_terms(pages[start - 1]) for start in RED_STARTS]
    definitions = red_glossary(book, {word for unit in term_sets for word in unit})
    units = []
    for unit_no, terms in enumerate(term_sets, 1):
        words = [[term, usable_definition(term, definitions.get(term))] for term in terms]
        units.append({"unit": unit_no, "lessonId": f"vwr{unit_no:02d}", "words": words})
    return {"bookId": "vocabulary-workshop-red", "level": "Red", "units": units}


def validate(pack: dict) -> list[str]:
    errors: list[str] = []
    seen: set[str] = set()
    for unit in pack["units"]:
        words = unit["words"]
        if len(words) != 10:
            errors.append(f"{pack['level']} Unit {unit['unit']}: expected 10 words, found {len(words)}")
        for term, definition in words:
            if term in seen:
                errors.append(f"{pack['level']} Unit {unit['unit']}: duplicate {term}")
            seen.add(term)
            if not definition or len(definition) < 8:
                errors.append(f"{pack['level']} Unit {unit['unit']}: missing definition for {term}")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path, help="output_vocab_purple_red directory")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("reading-world/private/vocabulary-workshop-purple-red.json"),
    )
    args = parser.parse_args()
    json_dir = args.source / "json"
    purple = json.loads((json_dir / "Vocabulary_Workshop-Level_Purple.json").read_text(encoding="utf-8-sig"))
    red = json.loads((json_dir / "Vocabulary_Workshop-Level_Red.json").read_text(encoding="utf-8-sig"))
    packs = [extract_purple(purple), extract_red(red)]
    errors = [error for pack in packs for error in validate(pack)]
    report = {
        "books": packs,
        "validation": {
            "ok": not errors,
            "errors": errors,
            "units": sum(len(pack["units"]) for pack in packs),
            "words": sum(len(unit["words"]) for pack in packs for unit in pack["units"]),
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report["validation"], ensure_ascii=False, indent=2))
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
