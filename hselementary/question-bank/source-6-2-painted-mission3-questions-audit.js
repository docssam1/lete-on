"use strict";

const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const models = require("./source-6-2-painted-mission3-models.js");
const presentation = require("./source-6-2-painted-mission3-presentation.js");

const itemId = "6-2-u3-e3-mission-3";
const key = "sourceGrade6SecondSpaceE3PaintedFourThree";
const counts = [[3, 4], [2, 6], [1, 7]];
const answers = [34, 26, 17];
const faceFives = [2, 2, 3];
const compact = value => value.replace(/\s+/g, "");
const expectedAnswer = (level, variant) => level === 2
  ? `(1)${answers[variant]};(2)${faceFives[variant]}개`
  : String(answers[variant]);

function svgFragments(markup) {
  const fragments = [];
  let from = 0;
  while (true) {
    const start = markup.indexOf("<svg", from);
    if (start < 0) return fragments;
    const end = markup.indexOf("</svg>", start);
    assert.notEqual(end, -1, "answer SVG must be closed");
    fragments.push(markup.slice(start, end + 6));
    from = end + 6;
  }
}

function readSvgGrids(fragments) {
  const script = [
    "$ErrorActionPreference = 'Stop'",
    "$payload = [Console]::In.ReadToEnd()",
    "$json = [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($payload))",
    "$items = ConvertFrom-Json -InputObject $json",
    "$result = @()",
    "foreach ($item in $items) {",
    "  $doc = [System.Xml.XmlDocument]::new()",
    "  $doc.LoadXml([string]$item)",
    "  $svg = $doc.DocumentElement",
    "  $cells = @($svg.SelectNodes(\"//*[local-name()='g' and @data-x]\") | ForEach-Object {",
    "    [pscustomobject]@{ x=[int]$_.GetAttribute('data-x'); z=[int]$_.GetAttribute('data-z'); value=[int]$_.GetAttribute('data-value'); text=$_.SelectSingleNode(\"*[local-name()='text']\").InnerText }",
    "  })",
    "  $result += [pscustomobject]@{ layer=[int]$svg.GetAttribute('data-layer'); role=$svg.GetAttribute('data-role'); cells=$cells }",
    "}",
    "$result | ConvertTo-Json -Depth 8 -Compress"
  ].join("\n");
  const parsed = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], {
    input: Buffer.from(JSON.stringify(fragments), "utf8").toString("base64"), encoding: "utf8", windowsHide: true
  });
  assert.equal(parsed.status, 0, `SVG XML parsing failed: ${parsed.stderr || parsed.stdout}`);
  return JSON.parse(parsed.stdout.trim());
}

function expectedCells(grid) {
  const cells = [];
  for (let z = 0; z < grid.length; z++) {
    for (let x = 0; x < grid[z].length; x++) {
      if (grid[z][x] !== null) cells.push({ x, z, value: grid[z][x], text: String(grid[z][x]) });
    }
  }
  return cells;
}

for (let variant = 0; variant < 3; variant++) {
  const model = models.solve(variant);
  assert.deepEqual([model.A, model.B], counts[variant]);
  assert.equal(model.answer, answers[variant]);
  assert.equal(model.histogram[5], faceFives[variant]);
  assert.equal(model.conditionPolicy.bottomFacesPainted, false);
  assert(model.colored.every(cube => !cube.faces.includes("bottom")));

  for (let level = 0; level < 3; level++) {
    const q = presentation.render(variant, level);
    assert.equal(q.sourceItemId, itemId);
    assert.equal(q.variant, variant);
    assert.equal(q.level, level);
    assert.equal(compact(q.answer), expectedAnswer(level, variant));
    assert(!/[<>]/.test(q.answer), "learner answer must be plain text, not HTML");
    assert(q.prompt.includes(`assets/source-6-2-painted-mission3/v${variant}-given.png`), "prompt must use the matching canonical variant image");
    assert(q.prompt.includes("바닥 부분은 색칠하지 않습니다") || q.prompt.includes("바닥은 색칠하지 않습니다"), "prompt must exclude bottom faces");
    assert(!q.prompt.includes("source62-painted-answer") && !q.prompt.includes("source62-painted-layers"), "learner prompt must not contain filled answer layers");
    assert(!/data-value\s*=/.test(q.prompt), "learner prompt must not expose answer cell values");
    assert.equal(Boolean(q.clue), level === 0, "only easy level may have a clue");
    if (level === 0) {
      assert.equal(q.clue.A, model.A);
      assert(q.prompt.includes(`㉮는 ${model.A}입니다`), "easy clue may disclose A only");
      assert(!q.prompt.includes(`㉯는 ${model.B}`), "easy clue must not disclose B");
    } else {
      assert(!q.prompt.includes(`㉮는 ${model.A}입니다`));
    }
    assert.equal(Boolean(q.secondary), level === 2, "hard level alone adds the five-face count");
    if (level === 2) {
      assert.equal(q.secondary.answer, faceFives[variant]);
      assert(q.prompt.includes("면 5개가 색칠된 쌓기나무"));
      assert(q.answer.includes(`(1) ${answers[variant]}`), "hard follow-up must preserve the original primary answer");
    }
    assert(q.solution.includes(`10×${model.A}+${model.B}=${answers[variant]}`), "solution must show the correct 10*A+B formula");
    assert(q.solution.includes("math-inline-expression"), "solution formula must use the existing math expression component");

    const fragments = svgFragments(q.answerVisual);
    const grids = readSvgGrids(fragments);
    assert.equal(grids.length, 3, "answer visual must contain one SVG for each model layer");
    for (let layer = 0; layer < 3; layer++) {
      assert.equal(grids[layer].role, "painted-faces");
      assert.equal(grids[layer].layer, layer + 1);
      assert.deepEqual(grids[layer].cells, expectedCells(model.layerGrids[layer]), `variant ${variant}, layer ${layer + 1} answer grid differs from model`);
    }
  }
}

const names = ["existingGenerator"];
const calls = [];
const generatorApi = {
  names,
  generatorKey(type) { return type.sourceItemId === "other-item" ? "existingGenerator" : ""; },
  generate(type, ...args) { calls.push({ type, args }); return { sentinel: true }; }
};
const window = {
  HSE_GENERATORS: generatorApi,
  HSE_SOURCE_GRADE6_PAINTED_MISSION3_PRESENTATION: presentation
};
const wrapper = require("node:fs").readFileSync(require("node:path").join(__dirname, "source-6-2-painted-mission3-questions.js"), "utf8");
require("node:vm").runInNewContext(wrapper, { window, Number, Object, RangeError });

const registered = { sourceItemId: itemId, generatorKey: key, reviewLocked: false };
assert.equal(generatorApi.generatorKey(registered), key);
for (const offset of [-1, 0, 1]) {
  const variant = offset + 1;
  const generated = generatorApi.generate(registered, 4, offset, 19, variant);
  assert.equal(generated.level, offset + 1);
  assert.equal(compact(generated.answer), expectedAnswer(generated.level, variant));
}
const nullOffset = generatorApi.generate(registered, 4, null, 19, 0);
assert.equal(nullOffset.difficultyOffset, 0, "null offset defaults to the source difficulty");
assert.equal(nullOffset.answer, String(answers[0]));
for (let variant = 0; variant < 6; variant++) {
  const generated = generatorApi.generate(registered, 4, 0, 19, variant);
  assert.equal(generated.verifiedPoolIndex, variant % 3, "finite verified pool must cycle modulo three");
}

const locked = { ...registered, reviewLocked: true };
assert.equal(generatorApi.generatorKey(locked), "");
assert.equal(generatorApi.generate(locked, 4, 0, 19, 0), null);
for (const wrong of [
  { sourceItemId: itemId, generatorKey: "wrongKey", reviewLocked: false },
  { sourceItemId: "wrong-item", generatorKey: key, reviewLocked: false }
]) {
  assert.equal(generatorApi.generatorKey(wrong), "");
  assert.equal(generatorApi.generate(wrong, 4, 0, 19, 0), null);
}
for (const offset of [-2, 2, 0.5, NaN, Infinity, "0", {}, true]) assert.throws(() => generatorApi.generate(registered, 4, offset, 19, 0));
for (const variant of [-1, NaN, 0.5, Number.MAX_SAFE_INTEGER + 1, "0", null, {}, Infinity]) assert.throws(() => generatorApi.generate(registered, 4, 0, 19, variant));
const untouched = { sourceItemId: "other-item", generatorKey: "existingGenerator" };
assert.equal(generatorApi.generatorKey(untouched), "existingGenerator");
assert.deepEqual(generatorApi.generate(untouched, 7, 2), { sentinel: true });
assert.equal(calls.length, 1, "unrelated generator must be delegated exactly once");
assert(window.HSE_SOURCE_GRADE6_PAINTED_MISSION3_QUESTIONS);

console.log(JSON.stringify({ status: "passed", contracts: 9, variants: answers, faceFiveCounts: faceFives, offsets: 3, moduloPoolCases: 6, learnerReleaseVerified: false }));
