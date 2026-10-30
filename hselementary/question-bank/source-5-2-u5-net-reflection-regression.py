"""Check that four geometry-only source constructions survive reflection.

This does not verify glyph orientation, handedness, or a publisher answer key.
The marked-side choice must be explicit when those distinctions matter.
"""
from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path

directory = Path(__file__).resolve().parent
scripts = (
    "source-5-2-u5-page52-example31-source-crosscheck.py",
    "source-5-2-u5-page53-mission1-source-crosscheck.py",
    "source-5-2-u5-page53-mission4-source-crosscheck.py",
    "source-5-2-u5-page53-mission6-source-crosscheck.py",
)
seed = "(0, 0, 1))}"
mirrored_seed = "(0, 0, -1))}"
bottom_labels = '(0, 0, -1): "ㅁ", (0, 1, -1): "ㅂ", (1, 1, -1): "ㅅ", (1, 0, -1): "ㅇ"'
mirrored_labels = '(0, 0, 1): "ㅁ", (0, 1, 1): "ㅂ", (1, 1, 1): "ㅅ", (1, 0, 1): "ㅇ"'
for name in scripts:
    source = (directory / name).read_text(encoding="utf-8")
    assert source.count(seed) == 1, f"fold seed changed: {name}"
    mirrored = source.replace(seed, mirrored_seed, 1)
    if "example31" in name:
        assert mirrored.count(bottom_labels) == 1, "vertex model changed"
        mirrored = mirrored.replace(bottom_labels, mirrored_labels, 1)
    for version in (source, mirrored):
        with redirect_stdout(StringIO()):
            exec(compile(version, str(directory / name), "exec"), {})
print("Four source net constructions agree under reflected folds; lettering and official keys not checked.")
