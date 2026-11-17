#!/usr/bin/env python3
"""Fetch public contest concept metadata from LIVE; never store question/solution text."""

import csv
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1] / "competition"
CATALOG = ROOT / "amc-original-source-catalog.csv"
OUTPUT = ROOT / "amc-item-concept-source-inventory.csv"
TAXONOMY_OUTPUT = ROOT / "amc-live-concept-taxonomy.csv"
SOURCE_LABEL = "LIVE by Po-Shen Loh · MAA authorized source material"
CONCEPTS_PAGE = "https://live.poshenloh.com/past-contests/concepts"


def get_text(url):
    request = Request(url, headers={"User-Agent": "GFIELD-source-metadata-research/1.0"})
    with urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8", "replace")


class TaxonomyParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.category = ""
        self.in_heading = False
        self.heading = []
        self.href = ""
        self.anchor_text = []
        self.skip_depth = 0
        self.rows = {}

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ("style", "script"):
            self.skip_depth += 1
        if self.skip_depth:
            return
        if tag == "h2":
            self.in_heading, self.heading = True, []
        elif tag == "a":
            self.href, self.anchor_text = attrs.get("href", ""), []

    def handle_endtag(self, tag):
        if tag in ("style", "script") and self.skip_depth:
            self.skip_depth -= 1
        if self.skip_depth:
            return
        if tag == "h2":
            self.category = " ".join(" ".join(self.heading).split()).lower()
            self.in_heading = False
        elif tag == "a":
            prefix = "/past-contests/concepts/"
            if self.href.startswith(prefix):
                slug = self.href[len(prefix):].strip("/")
                title = next((" ".join(text.split()) for text in self.anchor_text if text.strip()), "")
                if slug and title and slug not in self.rows:
                    self.rows[slug] = {"source_concept": slug, "source_display_name": title,
                                       "source_category": self.category,
                                       "source_index_url": CONCEPTS_PAGE}
            self.href, self.anchor_text = "", []

    def handle_data(self, data):
        if self.skip_depth:
            return
        if self.in_heading:
            self.heading.append(data)
        if self.href.startswith("/past-contests/concepts/") and data.strip():
            self.anchor_text.append(data)


def fetch_taxonomy():
    parser = TaxonomyParser()
    parser.feed(get_text(CONCEPTS_PAGE))
    with TAXONOMY_OUTPUT.open("w", encoding="utf-8", newline="") as stream:
        fields = ["source_concept", "source_display_name", "source_category", "source_index_url"]
        writer = csv.DictWriter(stream, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(parser.rows[key] for key in sorted(parser.rows))
    return len(parser.rows)


def page_items(row):
    url = row["professional_solutions_url"]
    html = get_text(url)
    markers = list(re.finditer(r"Concepts:</span>", html))
    items = []
    for index, marker in enumerate(markers):
        end = markers[index + 1].start() if index + 1 < len(markers) else len(html)
        chunk = html[marker.end():end]
        tag_links = re.findall(r'href="/past-contests/concepts/([^"?#]+)"', chunk)
        # Restrict links to the concept chips preceding the difficulty and hint fields.
        tag_links = tag_links[:12]
        if not tag_links:
            continue
        rating_match = re.search(r"Difficulty rating:\s*(\d+)", chunk)
        qno = len(items) + 1
        route = row["online_exam_url"].rstrip("/")
        question_url = f"{route}/problem/{qno}"
        items.append({
            "program": row["program"], "year": row["year"], "form": row["form"],
            "question": qno, "source_concepts": ";".join(tag_links),
            "source_difficulty_rating": rating_match.group(1) if rating_match else "",
            "source_url": question_url, "source_solutions_url": url,
            "metadata_source": SOURCE_LABEL,
        })
    return row, items


def main():
    taxonomy_count = fetch_taxonomy()
    print(f"Saved {taxonomy_count} source taxonomy terms from {CONCEPTS_PAGE}.", flush=True)
    with CATALOG.open(encoding="utf-8-sig", newline="") as stream:
        catalog = list(csv.DictReader(stream))
    existing = []
    if OUTPUT.exists():
        with OUTPUT.open(encoding="utf-8", newline="") as stream:
            existing = list(csv.DictReader(stream))
    amc8_path = ROOT / "historical-amc-grade/amc8-item-concept-source-inventory.csv"
    with amc8_path.open(encoding="utf-8", newline="") as stream:
        amc8_rows = list(csv.DictReader(stream))
    # AMC 8 was inventoried separately; retain those source rows and incrementally fetch only missing forms.
    result = amc8_rows + [row for row in existing if row["program"] != "amc8"]
    present = {(row["program"], str(row["year"]), row["form"]) for row in result}
    targets = [row for row in catalog if (row["program"], str(row["year"]), row["form"]) not in present]
    errors = []
    print(f"Fetching {len(targets)} LIVE solution pages; original exam text is not stored.", flush=True)
    with ThreadPoolExecutor(max_workers=5) as pool:
        futures = {pool.submit(page_items, row): row for row in targets}
        for i, future in enumerate(as_completed(futures), 1):
            row = futures[future]
            try:
                _, items = future.result()
                if not items:
                    errors.append((row["program"], row["year"], row["form"], "no concept-tagged items"))
                result.extend(items)
            except (HTTPError, URLError, TimeoutError, ValueError) as exc:
                errors.append((row["program"], row["year"], row["form"], str(exc)))
            if i % 25 == 0 or i == len(targets):
                print(f"{i}/{len(targets)} pages; {len(result)} item rows; {len(errors)} page issues", flush=True)
    result.sort(key=lambda r: (r["program"], int(r["year"]), r["form"], int(r["question"])))
    for row in result:
        row.setdefault("metadata_source", SOURCE_LABEL)
        row.setdefault("gfield_mapping_status", "")
    fields = ["program", "year", "form", "question", "source_concepts", "source_difficulty_rating", "source_url", "source_solutions_url", "metadata_source", "gfield_mapping_status"]
    with OUTPUT.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=fields, lineterminator="\n")
        writer.writeheader(); writer.writerows(result)
    if errors:
        error_path = ROOT / "amc-item-concept-fetch-issues.csv"
        with error_path.open("w", encoding="utf-8", newline="") as stream:
            writer = csv.writer(stream, lineterminator="\n")
            writer.writerow(["program", "year", "form", "issue"]); writer.writerows(errors)
        print(f"Issues saved: {error_path}", flush=True)
    print(f"Wrote {len(result)} item metadata rows to {OUTPUT}")


if __name__ == "__main__":
    main()
