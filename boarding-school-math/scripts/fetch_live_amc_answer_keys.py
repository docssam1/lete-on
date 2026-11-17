#!/usr/bin/env python3
"""Fetch answer-letter/integer metadata from public LIVE answer pages."""

import csv
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1] / "competition"
CATALOG = ROOT / "amc-original-source-catalog.csv"
INVENTORY = ROOT / "amc-item-concept-source-inventory.csv"
OUTPUT = ROOT / "amc-item-answer-key-reference.csv"
SOURCE_LABEL = "LIVE by Po-Shen Loh · 공개 답안 페이지"


def get_html(url):
    request = Request(url, headers={"User-Agent": "GFIELD-answer-key-metadata-research/1.0"})
    with urlopen(request, timeout=35) as response:
        return response.read().decode("utf-8", "replace")


class AnswerAnchorParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.href = ""
        self.anchor_text = []
        self.items = []

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            self.href = dict(attrs).get("href", "")
            self.anchor_text = []

    def handle_data(self, data):
        if self.href:
            self.anchor_text.append(data)

    def handle_endtag(self, tag):
        if tag != "a" or not self.href:
            return
        match = re.search(r"/problem/(\d+)$", self.href)
        if match:
            self.items.append((int(match.group(1)), "".join(self.anchor_text).strip()))
        self.href = ""
        self.anchor_text = []


def expected_counts():
    counts = {}
    with INVENTORY.open(encoding="utf-8", newline="") as stream:
        for row in csv.DictReader(stream):
            key = (row["program"], row["year"], row["form"])
            counts[key] = counts.get(key, 0) + 1
    return counts


def fetch_form(row, expected):
    parser = AnswerAnchorParser()
    parser.feed(get_html(row["answer_key_url"]))
    key = (row["program"], row["year"], row["form"])
    wanted = expected.get(key)
    errors = []
    result = []
    for question, label in parser.items:
        match = re.fullmatch(rf"{question}\s*(.*?)\s*", label)
        answer = match.group(1) if match else ""
        if row["program"] == "aime":
            valid = bool(re.fullmatch(r"\d{1,3}", answer)) and int(answer) <= 999
            answer_format = "integer"
        else:
            valid = answer in {"A", "B", "C", "D", "E"}
            answer_format = "choice"
        if not valid:
            errors.append(f"Q{question}: invalid answer label {label!r}")
        result.append({
            "program": row["program"], "year": row["year"], "form": row["form"],
            "question": question, "correct_answer": answer, "answer_format": answer_format,
            "answer_key_url": row["answer_key_url"], "source_label": SOURCE_LABEL,
        })
    question_numbers = [item["question"] for item in result]
    if wanted is None or question_numbers != list(range(1, wanted + 1)):
        errors.append(f"expected questions 1–{wanted}; found {question_numbers[:3]}…{question_numbers[-3:]}")
    if errors:
        raise ValueError(f"{key}: " + "; ".join(errors))
    return result


def main():
    with CATALOG.open(encoding="utf-8-sig", newline="") as stream:
        catalog = list(csv.DictReader(stream))
    expected = expected_counts()
    if len(catalog) != len(expected):
        raise ValueError(f"catalog/inventory form count mismatch: {len(catalog)} vs {len(expected)}")
    results = []
    errors = []
    print(f"Fetching answer keys for {len(catalog)} year/form pages.", flush=True)
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(fetch_form, row, expected): row for row in catalog}
        for index, future in enumerate(as_completed(futures), 1):
            try:
                results.extend(future.result())
            except Exception as exc:  # fail the corpus if any form is incomplete
                row = futures[future]
                errors.append((row["program"], row["year"], row["form"], str(exc)))
            if index % 50 == 0 or index == len(futures):
                print(f"{index}/{len(futures)} pages checked; {len(results)} answers; {len(errors)} issues", flush=True)
    if errors:
        for error in errors:
            print("ERROR", *error, sep="\t")
        raise SystemExit("Answer-key inventory incomplete; existing output left untouched.")
    results.sort(key=lambda row: (row["program"], int(row["year"]), row["form"], int(row["question"])))
    fields = ["program", "year", "form", "question", "correct_answer", "answer_format", "answer_key_url", "source_label"]
    temporary = OUTPUT.with_suffix(".csv.tmp")
    with temporary.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(results)
    temporary.replace(OUTPUT)
    print(f"Wrote {len(results)} answer references across {len(catalog)} forms to {OUTPUT}.")


if __name__ == "__main__":
    main()
