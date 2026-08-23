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
            "visualReviewPages": [
                {
                    "privateSourceMemoryId": "source-a",
                    "page": 11,
                    "resolution": "verified_mission_variable_cell",
                }
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

    def test_exact_page_selector_keeps_only_requested_source_page_pairs(self):
        queue, total = MODULE.select_queue(
            self.index,
            "unresolved",
            page_keys=["source-a:7", "source-b:8"],
        )
        self.assertEqual(total, 2)
        self.assertEqual(
            [(entry["privateSourceMemoryId"], entry["page"]) for entry in queue],
            [("source-a", 7), ("source-b", 8)],
        )

    def test_reviewed_queue_uses_resolution_as_its_reason(self):
        queue, total = MODULE.select_queue(
            self.index,
            "reviewed",
            reasons=["verified_mission_variable_cell"],
        )
        self.assertEqual(total, 1)
        self.assertEqual(MODULE.entry_reason(queue[0]), "verified_mission_variable_cell")

    def test_page_items_omits_quarantined_rejected_candidates(self):
        index = {
            "sources": [{"sourceRef": "source-ref-a", "privateSourceMemoryId": "source-a"}],
            "items": [
                {"id": "old", "sourceRef": "source-ref-a", "locator": {"page": 4, "slot": 1}},
                {"id": "active", "sourceRef": "source-ref-a", "locator": {"page": 4, "slot": 2}},
            ],
            "rejectedCandidates": [{"id": "old"}],
        }

        grouped = MODULE.page_items(index)

        self.assertEqual([item["id"] for item in grouped[("source-a", 4)]], ["active"])


if __name__ == "__main__":
    unittest.main()
