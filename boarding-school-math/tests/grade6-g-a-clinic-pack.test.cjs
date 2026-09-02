const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
require(path.resolve(root, "..", "geometry", "worksheet", "render.js"));
const source = require(path.join(root, "learning", "grade6-g-a-clinic-pack.js"));
const registry = require(path.join(root, "learning", "grade6-clinic-packs.js"));

test("6.G.A public clinic has 12 workbook and four independent recheck items", function () {
  assert.equal(source.validatePack(), true);
  assert.equal(source.pack.clusterId, "6.G.A");
  assert.equal(source.pack.standardRange, "6.G.A.1-4");
  assert.equal(source.pack.learnerStage, "US Grade 6 ages 11-12");
  assert.equal(source.pack.workbookItems.length, 12);
  assert.equal(source.pack.recheckItems.length, 4);
  assert.equal(new Set(source.pack.recheckItems.map(function (item) { return item.strand; })).size, 4);
  assert.equal(registry.forCluster("6.G.A"), source);
});

test("all sixteen exact answers are independently recomputed", function () {
  const expected = {
    "ga-w01":"40", "ga-w02":"27", "ga-w03":"50", "ga-w04":"60",
    "ga-w05":"10", "ga-w06":"35/4", "ga-w07":"8", "ga-w08":"9",
    "ga-w09":"24", "ga-w10":"52", "ga-w11":"62", "ga-w12":"108",
    "ga-r01":"58", "ga-r02":"21/2", "ga-r03":"35", "ga-r04":"108"
  };
  source.pack.workbookItems.concat(source.pack.recheckItems).forEach(function (item) {
    assert.equal(source.formatResult(item), expected[item.id], item.id);
    assert.equal(source.evaluateResponse(item, expected[item.id]), true, item.id);
    assert.equal(source.evaluateResponse(item, String(Number(expected[item.id].split("/")[0]) + 1)), false, item.id);
  });
});

test("polygon answers agree with an independent shoelace implementation", function () {
  source.pack.workbookItems.concat(source.pack.recheckItems).filter(function (item) { return item.data.points; }).forEach(function (item) {
    let twice = 0;
    item.data.points.forEach(function (point, index) {
      const next = item.data.points[(index + 1) % item.data.points.length];
      twice += point[0] * next[1] - next[0] * point[1];
    });
    assert.equal(Number(source.formatResult(item)), Math.abs(twice) / 2, item.id);
  });
});

test("fractional volumes agree with scaled integer unit-cube enumeration", function () {
  const prisms = source.pack.workbookItems.concat(source.pack.recheckItems).filter(function (item) { return item.kind === "prism-volume"; });
  prisms.forEach(function (item) {
    const edges = [item.data.length, item.data.width, item.data.height];
    const common = edges.reduce(function (value, edge) { return value * edge.denominator; }, 1);
    const scaled = edges.map(function (edge) { return edge.numerator * common / edge.denominator; });
    const count = scaled[0] * scaled[1] * scaled[2];
    const reconstructed = count / (common * common * common);
    const answer = source.solveItem(item);
    assert.equal(reconstructed, answer.numerator / answer.denominator, item.id);
  });
});

test("student prompts remain answer-free while teacher solutions are localized", function () {
  const first = source.pack.workbookItems[0];
  ["ko", "en", "zh-Hans"].forEach(function (locale) {
    assert.ok(first.prompt[locale].length > 20);
    assert.ok(source.hintFor(first, locale).length > 20);
    assert.ok(source.solutionFor(first, locale).includes("40"));
  });
  assert.doesNotMatch(first.prompt.ko, /정답은\s*40|넓이는\s*40/);
  assert.doesNotMatch(first.prompt.en, /answer is 40|area is 40/i);
});

test("every item renders a semantic original SVG without an embedded answer", function () {
  source.pack.workbookItems.concat(source.pack.recheckItems).forEach(function (item) {
    const markup = source.renderVisual(item, "en");
    assert.match(markup, /<svg/);
    assert.match(markup, /role="img"/);
    assert.match(markup, /aria-label=/);
    assert.doesNotMatch(markup, /NaN|undefined/);
    assert.doesNotMatch(markup, /answer|solution|정답|答案/i);
  });
});

test("release metadata preserves public-private and cross-program reuse boundaries", function () {
  assert.deepEqual(source.pack.rights, { publication:"public", assetRights:"original", containsThirdPartyAssets:false });
  assert.match(source.pack.contentOrigin, /original-authored-public-clinic/);
  assert.deepEqual(Object.keys(source.pack.sourceReuse).sort(), ["fieldsClassic", "geometry", "hwangso", "numberMagic"]);
  const serialized = JSON.stringify(source.pack);
  ["private-sources", "G:\\", "studentId", "answerKey", "SASMO 2019"].forEach(function (token) { assert.equal(serialized.includes(token), false); });
});
