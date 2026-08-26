from __future__ import annotations

import copy
import importlib.util
import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "highschool-selection" / "scripts" / "build-wm-middle21-analysis-sheets.py"
FIXTURE = Path(__file__).resolve().parent / "fixtures" / "wm-middle21-analysis-result.sample.json"

SPEC = importlib.util.spec_from_file_location("wm_middle21_analysis", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(MODULE)


def fixture_payload() -> dict:
    return json.loads(FIXTURE.read_text(encoding="utf-8"))


class ResultInputValidationTest(unittest.TestCase):
    def test_accepts_mark_only_result(self) -> None:
        normalized = MODULE.normalize_result(fixture_payload())
        self.assertEqual(normalized["examId"], "wm-middle21-basic-entry-r01")
        self.assertEqual(len(normalized["states"]), 40)
        self.assertEqual(normalized["states"][5], "review")
        self.assertEqual(len(normalized["retests"]), 2)

    def test_rejects_answer_or_other_unknown_field(self) -> None:
        payload = fixture_payload()
        payload["marks"][0]["answer"] = "7"
        with self.assertRaisesRegex(ValueError, "keys are invalid"):
            MODULE.normalize_result(payload)

    def test_rejects_duplicate_and_missing_question_number(self) -> None:
        payload = fixture_payload()
        payload["marks"][39]["number"] = 39
        with self.assertRaisesRegex(ValueError, "duplicate number"):
            MODULE.normalize_result(payload)

    def test_rejects_unsafe_student_name(self) -> None:
        payload = fixture_payload()
        payload["student"]["displayName"] = "../학생"
        with self.assertRaisesRegex(ValueError, "unsafe character"):
            MODULE.normalize_result(payload)

    def test_rejects_invalid_date(self) -> None:
        payload = fixture_payload()
        payload["student"]["attemptedAt"] = "2026-02-30"
        with self.assertRaises(ValueError):
            MODULE.normalize_result(payload)

    def test_rejects_more_than_three_retests(self) -> None:
        payload = fixture_payload()
        payload["retests"] = [copy.deepcopy(payload["retests"][0]) for _ in range(4)]
        with self.assertRaisesRegex(ValueError, "at most 3"):
            MODULE.normalize_result(payload)

    def test_detailed_example_metrics_match_visible_scores(self) -> None:
        result = MODULE.detailed_example_result()
        self.assertEqual(sum(state == "correct" for state in result["states"].values()), 28)
        self.assertEqual(sum(result["states"][number] == "correct" for number in range(1, 21)), 16)
        self.assertEqual(sum(result["states"][number] == "correct" for number in range(21, 41)), 12)


if __name__ == "__main__":
    unittest.main()
