"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { spawnSync } = require("node:child_process");
const models = require("./source-6-2-painted-mission5-models.js");
const presentation = require("./source-6-2-painted-mission5-presentation.js");

const ids = ["6-2-u3-e3-mission-5-1", "6-2-u3-e3-mission-5-2"];
const keys = ["sourceGrade6SecondSpaceE3PaintedVolumeInverse", "sourceGrade6SecondSpaceE3PaintedSurfaceInverse"];
const edges = [6, 3, 9];
const volumes = [7560, 945, 25515];
const surfaces = [3096, 774, 6966];
const paintedAreas = [2340, 585, 5265];
const compact = value => value.replace(/\s+/g, "");

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
    "    $textNode = $_.SelectSingleNode(\"*[local-name()='text']\")",
    "    if ($null -eq $textNode) { throw 'answer cell is missing text' }",
    "    [pscustomobject]@{ x=[int]$_.GetAttribute('data-x'); z=[int]$_.GetAttribute('data-z'); value=[int]$_.GetAttribute('data-value'); text=$textNode.InnerText }",
    "  })",
    "  $result += [pscustomobject]@{ layer=[int]$svg.GetAttribute('data-layer'); role=$svg.GetAttribute('data-role'); cells=$cells }",
    "}",
    "$result | ConvertTo-Json -Depth 8 -Compress"
  ].join("\n");
  const parsed = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], {
    input: Buffer.from(JSON.stringify(fragments), "utf8").toString("base64"), encoding: "utf8", windowsHide: true
  });
  assert.equal(parsed.status, 0, `SVG XML parsing failed: ${parsed.stderr || parsed.stdout}`);
  const grids = JSON.parse(parsed.stdout.trim());
  return Array.isArray(grids) ? grids : [grids];
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

let renderCases = 0;
for (let variant = 0; variant < 3; variant++) {
  const model = models.solve(variant);
  assert.equal(model.cells.length, 35);
  assert.equal(model.histogram[2], 8);
  assert.equal(model.paintedFaces, 65);
  assert.equal(model.externalFaceCount, 86);
  assert.equal(model.faceCounts.bottom, 21);
  assert.equal(model.edge, edges[variant]);
  assert.equal(model.volume, volumes[variant]);
  assert.equal(model.surfaceArea, surfaces[variant]);
  assert.equal(model.paintedArea, paintedAreas[variant]);
  assert.equal(model.areaOfExactlyTwoPaintedFaces, 16 * edges[variant] ** 2);
  assert.equal(model.conditionPolicy.bottomFacesPainted, false);
  assert.equal(model.conditionPolicy.surfaceAreaIncludesBottom, true);

  for (const id of ids) {
    const isVolume = id === ids[0];
    for (let level = 0; level < 3; level++) {
      const q = presentation.render(id, variant, level);
      const expected = isVolume ? volumes[variant] : surfaces[variant];
      const unit = isVolume ? "cm³" : "cm²";
      assert.equal(q.sourceItemId, id);
      assert.equal(q.variant, variant);
      assert.equal(q.level, level);
      assert.equal(compact(q.answer), level === 2
        ? `(1)${expected}${unit};(2)${paintedAreas[variant]}cm²`
        : `${expected}${unit}`);
      assert(!/[<>]/.test(q.answer), "student answer must be plain text");
      assert.equal(q.answerKeyVisual, true);
      assert.equal(Boolean(q.clue), level === 0);
      assert.equal(Boolean(q.secondary), level === 2);
      assert.equal(q.secondary?.answer, level === 2 ? paintedAreas[variant] : undefined);
      assert.equal(q.secondary?.unit, level === 2 ? "cm²" : undefined);
      assert.equal(q.difficultyDesign.mode, ["easy", "source", "hard"][level]);
      assert(q.prompt.includes("assets/source-6-2-painted-mission5/source-given.png"));
      assert(q.prompt.includes(`data-variant=\"${variant}\"`));
      assert(!q.prompt.includes("<svg") && !q.prompt.includes("<table"));
      assert(!q.prompt.includes("source62-painted-answer") && !q.prompt.includes("source62-painted-layers"));
      assert(!/data-value\s*=/.test(q.prompt));
      assert(!q.prompt.includes(`${volumes[variant]} cm³`) && !q.prompt.includes(`${surfaces[variant]} cm²`));
      assert(q.solution.includes(`${expected} ${unit}`));
      if (!isVolume) assert(q.solution.includes("바닥"), "surface solution should include the unpainted floor");

      const grids = readSvgGrids(svgFragments(q.answerVisual));
      assert.equal(grids.length, 3, "teacher key must contain exactly three layer grids");
      for (let layer = 0; layer < 3; layer++) {
        assert.equal(grids[layer].role, "painted-faces");
        assert.equal(grids[layer].layer, layer + 1);
        assert.deepEqual(grids[layer].cells, expectedCells(model.layerGrids[layer]), `id ${id}, variant ${variant}, layer ${layer + 1}`);
      }
      renderCases++;
    }
  }
}

const calls = [];
const generatorApi = {
  names: ["existingGenerator"],
  generatorKey(type) { return type?.sourceItemId === "other-item" ? "existingGenerator" : ""; },
  generate(type, ...args) { calls.push({ type, args }); return { sentinel: true }; }
};
const window = { HSE_GENERATORS: generatorApi, HSE_SOURCE_GRADE6_PAINTED_MISSION5_PRESENTATION: presentation };
const wrapper = fs.readFileSync(path.join(__dirname, "source-6-2-painted-mission5-questions.js"), "utf8");
vm.runInNewContext(wrapper, { window, Number, Object, RangeError });

for (let item = 0; item < ids.length; item++) {
  const registered = { sourceItemId: ids[item], generatorKey: keys[item], reviewLocked: false };
  assert.equal(generatorApi.generatorKey(registered), keys[item]);
  for (const offset of [-1, 0, 1]) {
    const generated = generatorApi.generate(registered, 12, offset, 77, 2);
    assert.equal(generated.level, offset + 1);
    assert.equal(generated.difficultyOffset, offset);
    assert.equal(generated.levelRank, 12);
    assert.equal(generated.difficultyRank, offset + 1);
    assert.equal(generated.sourceDifficultyRank, 1);
    assert.equal(generated.answerPageLayout, "two-column");
    assert.equal(generated.verifiedPoolIndex, 2);
  }
  for (const variant of [3, 5, 8]) {
    assert.equal(generatorApi.generate(registered, 1, 0, 2, variant).verifiedPoolIndex, variant % 3);
  }
  for (const offset of [undefined, null]) {
    const generated = generatorApi.generate(registered, 4, offset, 19, 0);
    assert.equal(generated.difficultyOffset, 0);
    assert.equal(generated.level, 1);
  }
  const locked = { ...registered, reviewLocked: true };
  assert.equal(generatorApi.generatorKey(locked), "");
  assert.equal(generatorApi.generate(locked, 4, 0, 19, 0), null);
}

for (const wrong of [
  { sourceItemId: ids[0], generatorKey: keys[1] },
  { sourceItemId: ids[1], generatorKey: keys[0] },
  { sourceItemId: "unowned-item", generatorKey: keys[0] },
  { sourceItemId: ids[0], generatorKey: "unowned-key" }
]) {
  assert.equal(generatorApi.generatorKey(wrong), "");
  assert.equal(generatorApi.generate(wrong, 4, 0, 19, 0), null);
}
for (const offset of [-2, 2, 0.5, NaN, Infinity, "0", {}, true]) {
  assert.throws(() => generatorApi.generate({ sourceItemId: ids[0] }, 4, offset, 19, 0));
}
for (const variant of [-1, 0.5, Number.MAX_SAFE_INTEGER + 1, "0", {}, true, Infinity]) {
  assert.throws(() => generatorApi.generate({ sourceItemId: ids[0] }, 4, 0, 19, variant));
}
const unowned = { sourceItemId: "other-item", generatorKey: "existingGenerator" };
assert.equal(generatorApi.generatorKey(unowned), "existingGenerator");
assert.deepEqual(generatorApi.generate(unowned, 7, 2), { sentinel: true });
assert.equal(calls.length, 1, "unowned generator must be delegated once without rewriting arguments");

console.log(JSON.stringify({ status: "passed", renderCases, ownedIds: ids, variants: 3, levels: 3, xmlTeacherLayers: renderCases * 3, routingCases: 2, learnerReleaseVerified: false }));
