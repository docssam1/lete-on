import importlib.util
import unittest
from pathlib import Path


SCRIPT = Path(__file__).parents[1] / "scripts" / "render-private-layout-review.py"
SPEC = importlib.util.spec_from_file_location("render_private_layout_review", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)


class ReviewQueueTests(unittest.TestCase):
    def setUp(self):
        self.index = {
            "unresolvedPages": [
                {"privateSourceMemoryId": "source-b", "page": 8, "reason": "partial-layout-coverage"},
                {"privateSourceMemoryId": "source-a", "page": 7, "reason": "layout-anchor-not-found"},
                {"privateSourceMemoryId": "source-a", "page": 2, "reason": "partial-layout-coverage"},
            ],
            "excludedPageCandidates": [
                {"privateSourceMemoryId": "source-a", "page": 9, "reason": "non-question-layout"}
            ],
        }

    def test_selects_and_sorts_requested_reason(self):
        queue, total = MODULE.select_queue(
            self.index,
            "unresolved",
            reasons=["partial-layout-coverage"],
        )
        self.assertEqual(total, 2)
        self.assertEqual(
            [(entry["privateSourceMemoryId"], entry["page"]) for entry in queue],
            [("source-a", 2), ("source-b", 8)],
        )

    def test_applies_source_offset_and_limit_after_sorting(self):
        queue, total = MODULE.select_queue(
            self.index,
            "unresolved",
            source_ids=["source-a"],
            offset=1,
            limit=1,
        )
        self.assertEqual(total, 2)
        self.assertEqual(queue[0]["page"], 7)

    def test_rejects_unbounded_invalid_window(self):
        with self.assertRaisesRegex(ValueError, "offset"):
            MODULE.select_queue(self.index, "unresolved", offset=-1)
        with self.assertRaisesRegex(ValueError, "limit"):
            MODULE.select_queue(self.index, "unresolved", limit=0)


if __name__ == "__main__":
    unittest.main()
