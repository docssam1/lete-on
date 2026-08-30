#!/usr/bin/env python3
"""Validate the reusable invariants in a G·MAP animated math lesson manifest."""

from __future__ import annotations

import json
import math
import sys
from pathlib import Path


class ManifestError(ValueError):
    pass


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ManifestError(message)


def load_manifest(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise ManifestError(f"cannot read valid JSON: {error}") from error


def validate_frame(frame: dict, width: float, height: float, object_id: str) -> None:
    require(isinstance(frame, dict), f"object {object_id}: frame is required")
    values = [frame.get(key) for key in ("x", "y", "width", "height")]
    require(all(isinstance(value, (int, float)) and math.isfinite(value) for value in values),
            f"object {object_id}: frame values must be finite numbers")
    x, y, object_width, object_height = values
    require(object_width >= 0 and object_height >= 0, f"object {object_id}: frame size cannot be negative")
    require(0 <= x <= width and 0 <= y <= height, f"object {object_id}: frame origin is outside the scene")
    require(x + object_width <= width and y + object_height <= height,
            f"object {object_id}: frame exceeds the scene")


def validate_math_object(obj: dict) -> None:
    data = obj.get("data", {})
    if obj.get("type") == "bar-model":
        units = data.get("units")
        expected = data.get("expectedTotal")
        require(isinstance(units, list) and units, f"object {obj['id']}: bar-model units are required")
        require(all(isinstance(unit, (int, float)) for unit in units),
                f"object {obj['id']}: bar-model units must be numeric")
        require(isinstance(expected, (int, float)) and math.isclose(sum(units), expected),
                f"object {obj['id']}: bar-model units do not equal expectedTotal")
    if obj.get("type") == "shape-count":
        groups = data.get("groups")
        expected = data.get("expectedTotal")
        require(isinstance(groups, list) and groups, f"object {obj['id']}: shape-count groups are required")
        counts = [group.get("count") for group in groups]
        require(all(isinstance(count, int) and count >= 0 for count in counts),
                f"object {obj['id']}: shape-count group counts must be non-negative integers")
        require(sum(counts) == expected, f"object {obj['id']}: shape-count groups do not equal expectedTotal")


def validate_manifest(manifest: dict) -> None:
    require(manifest.get("schemaVersion") == 1, "schemaVersion must be 1")
    required = ("lessonId", "title", "language", "audience", "rights", "problem", "scene", "objects", "beats", "modes", "mathChecks", "review")
    for key in required:
        require(key in manifest, f"missing required field: {key}")

    rights = manifest["rights"]
    require(rights.get("publication") in {"public", "private"}, "rights.publication must be public or private")
    if rights.get("publication") == "public":
        require(rights.get("assetRights") in {"original", "public-domain", "licensed"},
                "public lessons require original, public-domain, or licensed asset rights")
        if rights.get("containsThirdPartyAssets"):
            require(bool(rights.get("licenseEvidence")), "public third-party assets require licenseEvidence")

    scene = manifest["scene"]
    width, height = scene.get("width"), scene.get("height")
    require(all(isinstance(value, (int, float)) and value > 0 for value in (width, height)),
            "scene width and height must be positive numbers")

    objects = manifest["objects"]
    require(isinstance(objects, list) and objects, "objects must be a non-empty list")
    object_ids = [obj.get("id") for obj in objects]
    require(all(isinstance(object_id, str) and object_id for object_id in object_ids), "every object needs an id")
    require(len(object_ids) == len(set(object_ids)), "object ids must be unique")
    for obj in objects:
        require(obj.get("type"), f"object {obj['id']}: type is required")
        validate_frame(obj.get("frame"), width, height, obj["id"])
        validate_math_object(obj)

    beats = manifest["beats"]
    require(isinstance(beats, list) and beats, "beats must be a non-empty list")
    beat_ids = [beat.get("id") for beat in beats]
    require(all(isinstance(beat_id, str) and beat_id for beat_id in beat_ids), "every beat needs an id")
    require(len(beat_ids) == len(set(beat_ids)), "beat ids must be unique")
    for beat in beats:
        require(beat.get("phase") in {"problem", "explore", "solve", "answer", "recap"},
                f"beat {beat['id']}: invalid phase")
        require(isinstance(beat.get("narration"), str) and beat["narration"].strip(),
                f"beat {beat['id']}: narration is required")
        require(isinstance(beat.get("durationMs"), int) and beat["durationMs"] >= 400,
                f"beat {beat['id']}: durationMs must be at least 400")
        targets = beat.get("targetIds")
        require(isinstance(targets, list), f"beat {beat['id']}: targetIds must be a list")
        missing = sorted(set(targets) - set(object_ids))
        require(not missing, f"beat {beat['id']}: unknown targets {', '.join(missing)}")
        actions = beat.get("actions")
        require(isinstance(actions, list) and actions, f"beat {beat['id']}: at least one action is required")
        for action in actions:
            require(action.get("type") in {"draw", "reveal", "move", "highlight", "count", "transform", "reveal-answer", "clear-highlight"},
                    f"beat {beat['id']}: unsupported action type")
            action_targets = action.get("targetIds", [])
            require(isinstance(action_targets, list), f"beat {beat['id']}: action targetIds must be a list")
            missing = sorted(set(action_targets) - set(object_ids))
            require(not missing, f"beat {beat['id']}: action has unknown targets {', '.join(missing)}")

    answer_beat_id = manifest["problem"].get("answerRevealBeatId")
    require(answer_beat_id in beat_ids, "problem.answerRevealBeatId must identify a beat")
    answer_index = beat_ids.index(answer_beat_id)
    answer_ids = {obj["id"] for obj in objects if obj.get("role") == "answer"}
    require(answer_ids, "at least one object must have role=answer")
    for index, beat in enumerate(beats):
        targeted = set(beat.get("targetIds", []))
        targeted.update(target for action in beat["actions"] for target in action.get("targetIds", []))
        if index < answer_index:
            require(not (targeted & answer_ids), f"beat {beat['id']}: answer object appears before the answer beat")
            require(all(action.get("type") != "reveal-answer" for action in beat["actions"]),
                    f"beat {beat['id']}: reveal-answer appears before the answer beat")
    require(beats[answer_index]["phase"] == "answer", "answer reveal beat must use phase=answer")
    require(any(action.get("type") == "reveal-answer" for action in beats[answer_index]["actions"]),
            "answer reveal beat must include reveal-answer")

    full_ids = manifest["modes"].get("fullPlay", {}).get("beatIds")
    step_ids = manifest["modes"].get("stepByStep", {}).get("beatIds")
    require(full_ids == beat_ids, "fullPlay.beatIds must match the canonical beat order")
    require(step_ids == beat_ids, "stepByStep.beatIds must match the canonical beat order")
    overview_ids = manifest["modes"].get("finalOverview", {}).get("visibleObjectIds")
    require(isinstance(overview_ids, list) and not (set(overview_ids) - set(object_ids)),
            "finalOverview.visibleObjectIds must reference known objects")

    math_checks = manifest["mathChecks"]
    require(isinstance(math_checks, list) and math_checks, "mathChecks must be a non-empty list")
    require(all(check.get("passed") is True for check in math_checks), "every math check must pass")

    review = manifest["review"]
    required_checks = ("sourceChecked", "mathChecked", "uniqueAnswerChecked", "visualChecked", "mobileChecked")
    if review.get("status") == "approved":
        require(all(review.get(check) is True for check in required_checks),
                "approved review requires source, math, unique-answer, visual, and mobile checks")
    else:
        require(review.get("status") == "locked", "review.status must be approved or locked")
        require(bool(review.get("lockReason")), "locked review requires lockReason")


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_scene_manifest.py LESSON.scene.json", file=sys.stderr)
        return 2
    path = Path(argv[1])
    try:
        validate_manifest(load_manifest(path))
    except ManifestError as error:
        print(f"INVALID {path}: {error}", file=sys.stderr)
        return 1
    print(f"VALID {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
