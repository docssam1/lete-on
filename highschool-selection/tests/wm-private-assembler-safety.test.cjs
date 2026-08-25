const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(
  path.join(__dirname, "..", "scripts", "assemble-private-wm-m21-rounds.py"),
  "utf8"
);

test("WM assembler loads detailed solution notes only from an ignored private input", () => {
  assert.match(source, /--solution-supplements/);
  assert.match(source, /read_json\(args\.solution_supplements\)/);
  assert.doesNotMatch(source, /SOLUTION_SUPPLEMENTS\s*=/);
  assert.doesNotMatch(source, /정답은\s*\d+/);
});

test("WM assembler keeps all generated rounds blocked", () => {
  assert.match(source, /normalized_round1\["releaseStatus"\]\s*=\s*"blocked"/);
  assert.match(source, /manifest\["releaseStatus"\]\s*=\s*"blocked"/);
});
