const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

test("private source and visual-review artifacts are ignored by Git", () => {
  const root = path.resolve(__dirname, "..", "..");
  const candidates = [
    "tmp/unresolved-layout-review-01.jpg",
    "highschool-selection/private/original.pdf",
    "highschool-selection/question-bank/hwangso-question-index-v2.json",
    "highschool-selection/review/review-manifest.json",
    "highschool-selection/review/unresolved-review-01.png"
  ];
  const ignored = execFileSync("git", ["check-ignore", "--no-index", ...candidates], {
    cwd: root,
    encoding: "utf8"
  }).trim().split(/\r?\n/).map(value => value.replaceAll("\\", "/"));
  assert.deepEqual(ignored.sort(), candidates.sort());
});
