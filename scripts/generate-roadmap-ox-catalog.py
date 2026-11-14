"""Build the public O/X item index from the private Didimdol set CSV collection."""

import argparse
import csv
import json
import re
from collections import Counter
from pathlib import Path
from unicodedata import normalize


SETS = {"중": "m", "상": "h", "최상": "x"}
SEMESTERS = [f"{grade}-{term}" for grade in range(1, 7) for term in (1, 2)]
DESTINATION = Path(__file__).resolve().parents[1] / "roadmap/demo2/planner-ox-catalog.json"


def unit_titles(folder, semester):
    # The set filenames omit spaces and punctuation. This index retains the
    # titles printed on the actual worksheets. Read only the unit label.
    titles = {}
    with (folder / f"{semester}_단원별_정답표.csv").open(encoding="utf-8-sig", newline="") as stream:
        for row in csv.DictReader(stream):
            number, title = row["단원"].strip().split(maxsplit=1)
            number = int(number)
            if not title or titles.setdefault(number, title) != title:
                raise ValueError(f"{semester} unit {number}: inconsistent title")
    return titles


def build_unit(path, semester, number, title):
    file_stem = normalize("NFC", path.name).removesuffix("_세트_정답표.csv")
    for label in SETS:
        paper = path.parent / f"{file_stem}_{label}세트_25문항_문제지.pdf"
        if not paper.is_file():
            raise ValueError(f"{semester} unit {number}: missing {label} worksheet")
    type_ids = {}
    sets = {key: [] for key in SETS.values()}
    originals = Counter()
    with path.open(encoding="utf-8-sig", newline="") as stream:
        for row in csv.DictReader(stream):
            set_key = SETS[row["세트"]]
            index = int(row["번호"])
            reference = int(row["참고원본번호"])
            kind = row["구분"]
            difficulty = row["난이도"]
            name = row["유형"].strip()
            if not name or kind not in ("원본", "유사") or difficulty not in SETS:
                raise ValueError(f"{semester} unit {number} {set_key} #{index}: invalid metadata")
            if index not in range(1, 26) or reference not in range(1, 21):
                raise ValueError(f"{semester} unit {number} {set_key} #{index}: invalid number")
            if kind == "원본":
                originals[reference] += 1
            # Preserve type IDs exported by the original 1-1 teacher pilot.
            if name not in type_ids:
                type_ids[name] = f"t{len(type_ids) + 1:02d}"
            # Explicit allow-list. Never serialize a CSV row or its answer.
            sets[set_key].append({
                "number": index, "typeId": type_ids[name], "ref": reference,
                "variant": kind == "유사", "difficulty": difficulty,
            })
    for name, items in sets.items():
        items.sort(key=lambda item: item["number"])
        if [item["number"] for item in items] != list(range(1, 26)):
            raise ValueError(f"{semester} unit {number} {name}: need 25 distinct items")
    if originals != Counter(range(1, 21)):
        raise ValueError(f"{semester} unit {number}: need 20 distinct source items")
    return {
        "id": f"didimdol22-{semester}-u{number}", "semester": semester, "number": number,
        "title": title, "fileStem": file_stem, "types": {key: name for name, key in type_ids.items()}, "sets": sets,
    }


def build_catalog(root):
    units = []
    for semester in SEMESTERS:
        folder = root / f"매쓰플랫_단원테스트_디딤돌{semester}"
        titles = unit_titles(folder, semester)
        paths = {}
        for path in (folder / "난이도별_25문항").glob("*.csv"):
            name = normalize("NFC", path.name)
            match = re.fullmatch(rf"{semester}_(\d+)단원_.+_세트_정답표\.csv", name)
            if match:
                number = int(match[1])
                if number in paths:
                    raise ValueError(f"{semester} unit {number}: duplicate set key")
                paths[number] = path
        count = 5 if semester == "1-1" else 6
        if set(paths) != set(range(1, count + 1)) or set(paths) != set(titles):
            raise ValueError(f"{semester}: expected {count} units with titles and set keys")
        for number, path in sorted(paths.items()):
            units.append(build_unit(path, semester, number, titles[number]))
    return {"version": 1, "units": units}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("drive", type=Path, help="Root containing the 12 private semester folders")
    parser.add_argument("--output", type=Path, default=DESTINATION)
    args = parser.parse_args()
    catalog = build_catalog(args.drive)
    # One complete unit per line keeps the deployed file small and localized
    # changes inspectable without embedding the private files or paths.
    encoded = [json.dumps(unit, ensure_ascii=False, separators=(",", ":")) for unit in catalog["units"]]
    args.output.write_text('{"version":1,"units":[\n' + ",\n".join(encoded) + "\n]}\n", encoding="utf-8")
    print(f"Created {len(encoded)} units with {len(encoded) * 75} items.")
