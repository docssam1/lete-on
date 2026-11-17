#!/usr/bin/env python3
"""Build a local, source-linked AMC/AIME concept index without copying exam text."""

import csv
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "competition"
INVENTORY = ROOT / "amc-item-concept-source-inventory.csv"
TAXONOMY = ROOT / "amc-live-concept-taxonomy.csv"
AMC8_CROSSWALK = ROOT / "historical-amc-grade/amc8-gfield-concept-crosswalk.csv"
AMC8_OVERRIDES = ROOT / "historical-amc-grade/amc8-2010-item-concepts.csv"
CROSSWALK_OUT = ROOT / "amc-gfield-concept-crosswalk-all.csv"
REFERENCE_OUT = ROOT / "amc-original-item-concept-reference.js"

DOMAIN_LABELS = {
    "algebra": "식과 대수 관계",
    "number": "수와 정수의 성질",
    "geometry": "기하 도형과 측정",
    "counting": "경우의 수와 확률",
    "data": "자료와 통계",
    "functions": "함수와 그래프",
}
DATA_TERMS = ("mean", "average", "median", "mode", "range", "data", "graph-interpretation",
              "least-squares", "sample-size", "sampling", "statistic", "weighted")
FUNCTION_TERMS = ("function", "logarithm", "logarithmic", "trigonometry", "trigonometric",
                  "complex-number", "complex-plane", "de-moivre", "roots-of-unity", "matrix")
GEOMETRY_TERMS = ("geometry", "triangle", "angle", "circle", "chord", "tangent", "polygon", "square",
                  "rectangle", "parallelogram", "trapezoid", "sphere", "cone", "cylinder", "cube", "area",
                  "volume", "perimeter", "circumference", "radius", "diameter", "coordinate", "locus",
                  "altitude", "centroid", "bisector", "diagonal", "distance-from-point", "polyhedron", "solid",
                  "ellipse", "parabola", "hyperbola", "vector", "plane", "folding", "dissection", "shoelace")
COUNTING_TERMS = ("count", "combinator", "arrangement", "permutation", "combination", "probability", "case",
                  "logic", "liar", "truth-teller", "invariant", "pigeonhole", "inclusion-exclusion", "game",
                  "graph-theory", "listing", "extremal", "subset", "set-partition", "derangement", "covering",
                  "shortest-path", "tournament", "bijection", "binomial-coefficient", "burnside", "parking-function")
ALGEBRA_TERMS = ("algebra", "equation", "expression", "polynomial", "inequalit", "factor", "root", "coefficient",
                 "identity", "sequence", "series", "recurrence", "recursion", "summation", "telescop", "exponent",
                 "radical", "quadratic", "linear", "system-of", "function", "logarithm", "trigonometry", "complex-number")


def read_csv(path):
    with path.open(encoding="utf-8-sig", newline="") as stream:
        return list(csv.DictReader(stream))


def tag_domain(tag, category=""):
    s = tag.lower()
    tokens = set(s.split("-"))
    if category == "geometry":
        return "functions" if s.startswith(("trigonometric", "trigonometry")) else "geometry"
    if category == "algebra":
        return "functions" if any(term in s for term in FUNCTION_TERMS) else "algebra"
    if category == "number theory":
        return "number"
    if category == "arithmetic":
        if "factorial" in s:
            return "counting"
        return "algebra" if s in ("distributive-property", "exponent", "order-of-operations") else "number"
    if category == "combinatorics":
        if s == "counting-shapes-in-figures" or s == "tiling":
            return "geometry"
        return "algebra" if s == "generating-functions" else "counting"
    if category == "probability and statistics":
        return "data" if any(word in tokens for word in ("mean", "median", "mode", "range", "data", "sample", "sampling", "statistic")) else "counting"
    if category == "logic":
        return "number" if s == "magic-square" else "counting"
    if category == "problem-solving techniques":
        if s == "symmetry": return "geometry"
        if s == "optimization": return "algebra"
        return "counting"
    # The current LIVE index does not list every historical tag. Use exact slug tokens
    # for a transparent fallback; avoid substring collisions such as "derangement"/"range".
    if "median-geometry" == s or "counting-shapes-in-figures" == s:
        return "geometry"
    if s in ("completing-the-square", "square-root", "square-roots", "sum-of-first-n-cubes", "sum-of-first-n-squares", "sum-of-first-n-odd-numbers", "sum-and-difference-of-cubes"):
        return "algebra"
    if any(term == s or term in tokens for term in DATA_TERMS):
        return "data"
    if any(term in s for term in FUNCTION_TERMS):
        return "functions"
    if any(term in tokens for term in GEOMETRY_TERMS):
        return "geometry"
    if any(term in s for term in COUNTING_TERMS):
        return "counting"
    if any(term in s for term in ALGEBRA_TERMS):
        return "algebra"
    return "number"


def read_existing_entries():
    source = (ROOT / "amc-original-item-concept-reference.js").read_text(encoding="utf-8")
    start = source.index("const entries = Object.freeze(") + len("const entries = Object.freeze(")
    end = source.index(".map(function (entry)", start)
    return json.loads(source[start:end])


def main():
    inventory = read_csv(INVENTORY)
    taxonomy = {row["source_concept"]: row for row in read_csv(TAXONOMY)}
    prior_crosswalk = {row["source_concept"]: row for row in read_csv(AMC8_CROSSWALK)}
    overrides = {int(row["question"]): row for row in read_csv(AMC8_OVERRIDES)}
    tags = sorted({tag for row in inventory for tag in row["source_concepts"].split(";") if tag})
    crosswalk = {}
    for tag in tags:
        prior = prior_crosswalk.get(tag)
        official = taxonomy.get(tag, {})
        domain = tag_domain(tag, official.get("source_category", ""))
        label = prior["korean_learning_label"] if prior else DOMAIN_LABELS[domain]
        if official:
            basis = f"LIVE 개념 분류({official['source_category']})를 GFIELD 영역에 대응한 편집 가능 제안"
        else:
            basis = "LIVE 원본 태그 이름을 바탕으로 한 자동 영역 제안 · 교사 검토 필요"
        crosswalk[tag] = {
            "source_concept": tag,
            "source_display_name": official.get("source_display_name", tag.replace("-", " ")),
            "source_category": official.get("source_category", "not-listed-on-current-index"),
            "gfield_domain": domain,
            "korean_learning_label": label,
            "mapping_basis": basis,
        }

    with CROSSWALK_OUT.open("w", encoding="utf-8", newline="") as stream:
        fields = ["source_concept", "source_display_name", "source_category", "gfield_domain", "korean_learning_label", "mapping_basis"]
        writer = csv.DictWriter(stream, fieldnames=fields, lineterminator="\n")
        writer.writeheader(); writer.writerows(crosswalk[tag] for tag in tags)

    amc8_tags = {tag for row in inventory if row["program"] == "amc8" for tag in row["source_concepts"].split(";") if tag}
    amc8_crosswalk_path = ROOT / "historical-amc-grade/amc8-gfield-concept-crosswalk.csv"
    with amc8_crosswalk_path.open("w", encoding="utf-8", newline="") as stream:
        fields = ["source_concept", "gfield_domain", "korean_learning_label", "mapping_basis"]
        writer = csv.DictWriter(stream, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        for tag in sorted(amc8_tags):
            entry = crosswalk[tag]
            writer.writerow({"source_concept": tag, "gfield_domain": entry["gfield_domain"],
                             "korean_learning_label": entry["korean_learning_label"],
                             "mapping_basis": entry["mapping_basis"]})

    entries = []
    for row in inventory:
        program, year, form, question = row["program"], int(row["year"]), row["form"], int(row["question"])
        source_tags = row["source_concepts"].split(";")
        per_domain = Counter(crosswalk[tag]["gfield_domain"] for tag in source_tags)
        domain = next((crosswalk[tag]["gfield_domain"] for tag in source_tags if per_domain[crosswalk[tag]["gfield_domain"]] == max(per_domain.values())), "number")
        topic = " · ".join(dict.fromkeys(crosswalk[tag]["korean_learning_label"] for tag in source_tags))
        if program == "amc8" and year == 2010 and question in overrides:
            override = overrides[question]
            domain, topic, mapping_status = override["gfield_domain"], override["gfield_topic_label"], "teacher-review-override"
        else:
            fully_crosswalked = all(tag in taxonomy for tag in source_tags)
            mapping_status = "source-tag-crosswalk-suggestion" if fully_crosswalked else "editable-source-tag-domain-suggestion"
        entries.append({
            "program": program, "year": year, "form": form, "question": question,
            "sourceConcepts": source_tags, "domain": domain, "topicLabel": topic,
            "sourceDifficultyRating": int(row["source_difficulty_rating"]) if row["source_difficulty_rating"] else None,
            "sourceUrl": row["source_url"], "sourceLabel": "LIVE by Po-Shen Loh · MAA authorized source material",
            "mappingStatus": mapping_status,
        })
    entries.sort(key=lambda entry: (entry["program"], int(entry["year"]), entry["form"], int(entry["question"])))
    serialized = json.dumps(entries, ensure_ascii=False, separators=(",", ":"))
    module = f'''(function (root, factory) {{
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMCOriginalItemConceptReference = api;
}})(typeof globalThis !== "undefined" ? globalThis : this, function () {{
  "use strict";
  // LIVE source concepts/difficulty are metadata; GFIELD domains are editable diagnostic suggestions.
  const entries = Object.freeze({serialized}.map(function (entry) {{ return Object.freeze(Object.assign({{}}, entry, {{ sourceConcepts: Object.freeze(entry.sourceConcepts) }})); }}));
  function referenceFor(program, year, form, question) {{
    const selectedProgram = String(program || "").toLowerCase();
    const selectedYear = Number(year);
    if (selectedProgram === "amc8" && String(form || "").trim() !== "") return null;
    const selectedForm = selectedProgram === "amc8" ? "" : String(form || "").toUpperCase();
    const selectedQuestion = Number(question);
    if (!Number.isInteger(selectedYear) || !Number.isInteger(selectedQuestion)) return null;
    return entries.find(function (entry) {{ return entry.program === selectedProgram && entry.year === selectedYear && entry.form === selectedForm && entry.question === selectedQuestion; }}) || null;
  }}
  return Object.freeze({{ entries: entries, referenceFor: referenceFor }});
}});
'''
    REFERENCE_OUT.write_text(module, encoding="utf-8")
    print(f"Built {len(entries)} item references; {len(tags)} unique tags; {len(taxonomy)} current LIVE taxonomy entries.")
    print("Program coverage:", dict(Counter(entry["program"] for entry in entries)))
    print("Unlisted tags requiring domain review:", sum(1 for tag in tags if tag not in taxonomy and tag not in prior_crosswalk))


if __name__ == "__main__":
    main()
