#!/usr/bin/env python3
"""Build the browser reference for publicly sourced AMC/AIME answer keys."""

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "competition"
SOURCE = ROOT / "amc-item-answer-key-reference.csv"
ERRATA_SOURCE = ROOT / "amc-answer-key-errata.csv"
OUTPUT = ROOT / "amc-original-answer-key-reference.js"


def main():
    with SOURCE.open(encoding="utf-8", newline="") as stream:
        rows = list(csv.DictReader(stream))
    forms = {}
    answer_count = 0
    for row in rows:
        key = (row["program"], int(row["year"]), row["form"])
        form = forms.setdefault(key, {
            "program": key[0], "year": key[1], "form": key[2],
            "sourceUrl": row["answer_key_url"], "answerFormat": row["answer_format"],
            "answers": [],
        })
        question = int(row["question"])
        if question != len(form["answers"]) + 1:
            raise ValueError(f"duplicate or out-of-order answer reference: {key} question {question}")
        if form["sourceUrl"] != row["answer_key_url"] or form["answerFormat"] != row["answer_format"]:
            raise ValueError(f"inconsistent form metadata: {key}")
        form["answers"].append(row["correct_answer"])
        answer_count += 1
    form_rows = []
    for form in forms.values():
        separator = "." if form["answerFormat"] == "integer" else ""
        encoded = separator.join(form["answers"])
        form_rows.append([form["program"], form["year"], form["form"], form["sourceUrl"], form["answerFormat"], encoded])
    payload = json.dumps(form_rows, ensure_ascii=False, separators=(",", ":"))
    with ERRATA_SOURCE.open(encoding="utf-8", newline="") as stream:
        errata_rows = list(csv.DictReader(stream))
    errata = {}
    for row in errata_rows:
        key = (row["program"], int(row["year"]), row["form"], int(row["question"]))
        if key in errata:
            raise ValueError(f"duplicate answer-key erratum: {key}")
        expected = next((entry for entry in rows if (entry["program"], int(entry["year"]), entry["form"], int(entry["question"])) == key), None)
        if not expected or expected["correct_answer"] != row["canonical_answer"]:
            raise ValueError(f"erratum canonical answer differs from public key: {key}")
        errata["|".join(map(str, key))] = {
            "acceptedAnswers": [row["canonical_answer"]] + [answer.strip().upper() for answer in row["additionally_accepted_answers"].split("|") if answer.strip()],
            "reason": row["reason"], "sourceUrl": row["source_url"], "sourceLabel": row["source_label"],
        }
    errata_payload = json.dumps(errata, ensure_ascii=False, separators=(",", ":"))
    content = """(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMCOriginalAnswerKeyReference = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  // Answers are compact metadata transcribed from public LIVE answer pages.
  // Original question and solution content remains at its source host.
  const sourceLabel = "LIVE by Po-Shen Loh · 공개 답안 페이지";
  const errata = Object.freeze(__ERRATA__);
  const forms = Object.freeze(__PAYLOAD__.map(function (row) {
    const separator = row[4] === "integer" ? "." : "";
    const answers = Object.freeze(row[5].split(separator));
    return Object.freeze({ program: row[0], year: row[1], form: row[2], sourceUrl: row[3], answerFormat: row[4], answers: answers });
  }));
  const index = new Map(forms.map(function (form) { return [`${form.program}|${form.year}|${form.form}`, form]; }));
  function formReference(program, year, form) {
    return index.get(`${String(program || "").toLowerCase()}|${Number(year)}|${String(form || "")}`) || null;
  }
  function answerFor(program, year, form, question) {
    const source = formReference(program, year, form);
    const number = Number(question);
    const correctAnswer = source && Number.isInteger(number) && number > 0 ? source.answers[number - 1] : null;
    const correction = correctAnswer === undefined || correctAnswer === null ? null : errata[`${source.program}|${source.year}|${source.form}|${number}`] || null;
    return correctAnswer === undefined || correctAnswer === null ? null : Object.freeze({
      program: source.program, year: source.year, form: source.form, question: number,
      correctAnswer: correctAnswer, acceptedAnswers: Object.freeze(correction ? correction.acceptedAnswers : [correctAnswer]),
      erratum: correction, answerFormat: source.answerFormat, sourceUrl: source.sourceUrl, sourceLabel: sourceLabel,
    });
  }
  function accepts(reference, response) {
    if (!reference || response == null || String(response).trim() === "") return false;
    if (reference.answerFormat === "integer") {
      const given = String(response).trim();
      return /^\\d{1,3}$/.test(given) && Number(given) === Number(reference.correctAnswer);
    }
    return (reference.acceptedAnswers || [reference.correctAnswer]).includes(String(response).trim().toUpperCase());
  }
  function formFor(program, year, form) {
    const source = formReference(program, year, form);
    return source ? Object.freeze({ program: source.program, year: source.year, form: source.form, itemCount: source.answers.length, sourceUrl: source.sourceUrl, sourceLabel: sourceLabel }) : null;
  }
  return Object.freeze({ formCount: forms.length, answerCount: __ANSWER_COUNT__, answerFor: answerFor, accepts: accepts, formFor: formFor });
});
""".replace("__PAYLOAD__", payload).replace("__ERRATA__", errata_payload).replace("__ANSWER_COUNT__", str(answer_count))
    OUTPUT.write_text(content, encoding="utf-8")
    forms = {(row["program"], row["year"], row["form"]) for row in rows}
    print(f"Built {answer_count} answer references across {len(forms)} forms at {OUTPUT}.")


if __name__ == "__main__":
    main()
