const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..", "..");

function load(relativePath) {
  const filename = path.join(root, relativePath);
  vm.runInThisContext(fs.readFileSync(filename, "utf8"), { filename });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function count(text, pattern) {
  return (String(text).match(pattern) || []).length;
}

function assertCleanHtml(label, html) {
  assert(typeof html === "string" && html.length > 100, `${label}: empty render`);
  assert(!/(\bNaN\b|\bundefined\b|\bnull\b|\[object Object\])/i.test(html), `${label}: bad token in render`);
  assert(count(html, /<svg\b/g) >= 1, `${label}: no SVG`);
  assert(count(html, /viewBox=/g) === count(html, /<svg\b/g), `${label}: SVG without viewBox`);
}

function assertInnerQ04Tunnel(payload, tunnel) {
  if (tunnel.axis === "y") {
    assert(tunnel.a > 0 && tunnel.a < payload.width - 1, "q04: y tunnel touches x border");
    assert(tunnel.b > 0 && tunnel.b < payload.depth - 1, "q04: y tunnel touches z border");
    return;
  }
  if (tunnel.axis === "x") {
    assert(tunnel.a > 0 && tunnel.a < payload.boxH - 1, "q04: x tunnel touches y border");
    assert(tunnel.b > 0 && tunnel.b < payload.depth - 1, "q04: x tunnel touches z border");
    return;
  }
  assert(tunnel.a > 0 && tunnel.a < payload.width - 1, "q04: z tunnel touches x border");
  assert(tunnel.b > 0 && tunnel.b < payload.boxH - 1, "q04: z tunnel touches y border");
}

function span(values) {
  return { min: Math.min(...values), max: Math.max(...values) };
}

load("hyper-focus/generator/stacking.js");
load("hyper-focus/generator/spatial.js");
load("hyper-focus/mock/mock-core.js");

const q04 = { easy: [], same: [], hard: [] };
const q05 = {
  open: { easy: [], same: [], hard: [] },
  walled: { easy: [], same: [], hard: [] }
};
const renderChecks = { q04: 0, q05: 0, q06: 0, q07: 0, q08: 0, q09: 0 };

for (const difficulty of ["easy", "same", "hard"]) {
  for (let seed = 1; seed <= 1500; seed += 1) {
    const p = globalThis.HFQ04.generateQ04(difficulty, seed);
    const label = `q04 ${difficulty} seed ${seed}`;
    assert(p.seed !== "fallback", `${label}: fallback`);
    assert(globalThis.HFQ04.validateQ04(p), `${label}: validate failed`);
    assert(globalThis.HFQ04.enumerateQ04AnswerCandidates(p).length === 1, `${label}: not single answer`);
    p.tunnels.forEach((tunnel) => assertInnerQ04Tunnel(p, tunnel));
    assertCleanHtml(`${label} problem`, globalThis.HFQ04.renderQ04Problem(p));
    const solution = globalThis.HFQ04.renderQ04Solution(p);
    assertCleanHtml(`${label} solution`, solution);
    assert(count(solution, /class="hf-hole-layer"/g) === p.boxH, `${label}: layer count mismatch`);
    if (difficulty === "easy") {
      assert(p.axisCount === 1 && p.tunnels.length === 1 && p.intersectionCells === 0, `${label}: easy contract`);
    } else if (difficulty === "same") {
      assert(p.axisCount === 2 && p.tunnels.length >= 4 && p.intersectionCells >= 2 && p.tripleIntersectionCells === 0, `${label}: same contract`);
    } else {
      assert(p.axisCount === 3 && p.tunnels.length >= 6 && p.tripleIntersectionCells >= 1, `${label}: hard contract`);
    }
    q04[difficulty].push(p.complexityScore);
    renderChecks.q04 += 2;
  }
}

assert(span(q04.easy).max < span(q04.same).min, "q04: easy/same complexity overlap");
assert(span(q04.same).max < span(q04.hard).min, "q04: same/hard complexity overlap");

for (const typeId of [5, 6, 7, 8, 9]) {
  for (const difficulty of ["easy", "same", "hard"]) {
    for (let seed = 1; seed <= 500; seed += 1) {
      const question = globalThis.HFMock.generateQuestion(typeId, difficulty, seed + typeId * 100000, 1);
      const label = `q${String(typeId).padStart(2, "0")} ${difficulty} seed ${seed}`;
      assert(question.payload.seed !== "fallback", `${label}: fallback`);
      assert(question.prompt.length >= 20 && question.prompt.length <= 180, `${label}: prompt length out of range`);
      assertCleanHtml(`${label} problem`, question.problemHtml);
      assert(!/<script\b/i.test(question.problemHtml), `${label}: script tag in problem render`);
      renderChecks[`q${String(typeId).padStart(2, "0")}`] += 1;

      if (typeId === 5) {
        const expected = question.payload.walled ? "위·앞·오른쪽" : "위·앞·뒤·왼쪽·오른쪽";
        assert(question.prompt.includes(expected), `${label}: missing viewing directions`);
        assert(question.problemHtml.includes("hf-numgrid"), `${label}: missing height grid`);
        q05[question.payload.walled ? "walled" : "open"][difficulty].push(question.payload.hidden);
      } else if (typeId === 6) {
        assert(question.prompt.includes("거울처럼 뒤집지는"), `${label}: mirror rule missing`);
        assert(question.problemHtml.includes("hf-color-solid") && question.problemHtml.includes("hf-option-grid"), `${label}: option render missing`);
      } else if (typeId === 7) {
        assert(question.problemHtml.includes("hf-net") && question.problemHtml.includes("hf-marked-cube"), `${label}: net/cube render missing`);
      } else if (typeId === 8) {
        assert(question.problemHtml.includes("hf-die") && question.problemHtml.includes("hf-dice-path"), `${label}: die/path render missing`);
      } else if (typeId === 9) {
        assert(question.problemHtml.includes("hf-three-views"), `${label}: three-view render missing`);
        const maps = globalThis.HFQ09.enumerateQ09Maps(question.payload);
        const minimum = Math.min(...maps.maps.map((map) => map.flat().reduce((sum, value) => sum + value, 0)));
        assert(maps.maps.filter((map) => map.flat().reduce((sum, value) => sum + value, 0) === minimum).length === 1, `${label}: non-unique minimum`);
      }
    }
  }
}

for (const mode of ["open", "walled"]) {
  assert(q05[mode].easy.length && q05[mode].same.length && q05[mode].hard.length, `q05 ${mode}: missing samples`);
  assert(span(q05[mode].easy).max < span(q05[mode].same).min, `q05 ${mode}: easy/same overlap`);
  assert(span(q05[mode].same).max < span(q05[mode].hard).min, `q05 ${mode}: same/hard overlap`);
}
const q05All = Object.fromEntries(["easy", "same", "hard"].map((difficulty) => [
  difficulty,
  [...q05.open[difficulty], ...q05.walled[difficulty]]
]));
assert(span(q05All.easy).max < span(q05All.same).min, "q05 all modes: easy/same overlap");
assert(span(q05All.same).max < span(q05All.hard).min, "q05 all modes: same/hard overlap");

console.log("PASS");
console.log(`- q04 visual/solution contract checks: ${renderChecks.q04}`);
console.log(`- q04 complexity easy ${span(q04.easy).min}-${span(q04.easy).max}, same ${span(q04.same).min}-${span(q04.same).max}, hard ${span(q04.hard).min}-${span(q04.hard).max}`);
console.log(`- q05-q09 problem render checks: ${renderChecks.q05 + renderChecks.q06 + renderChecks.q07 + renderChecks.q08 + renderChecks.q09}`);
console.log(`- q05 open hidden ranges easy ${span(q05.open.easy).min}-${span(q05.open.easy).max}, same ${span(q05.open.same).min}-${span(q05.open.same).max}, hard ${span(q05.open.hard).min}-${span(q05.open.hard).max}`);
console.log(`- q05 walled hidden ranges easy ${span(q05.walled.easy).min}-${span(q05.walled.easy).max}, same ${span(q05.walled.same).min}-${span(q05.walled.same).max}, hard ${span(q05.walled.hard).min}-${span(q05.walled.hard).max}`);
