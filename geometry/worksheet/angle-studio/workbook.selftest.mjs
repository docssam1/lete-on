import assert from "node:assert/strict";
import { normalizeCount, initialSelection, validateBank, chooseEntries, groupPages, entryHeight, PAGE_CAPACITY, answerText, answerUnit } from "./workbook-core.js";

const ids = ["estimate", "right-angle", "polygon", "parallel"];
const domains = ids.map((id, i) => ({ id, level: i + 1, names: { ko: id } }));
const pools = Object.fromEntries(ids.map((domain) => [domain, Array.from({ length: 20 }, (_, i) => ({ id: `${domain}-${i}`, domain, unit: domain === "right-angle" ? "point" : "degree" }))]));
const fixture = {
  domains, problemsFor: (id) => pools[id], promptFor: () => "Question", hintFor: () => "Hint", solutionFor: () => "Solution",
  answerFor: (p) => p.unit === "point" ? [[0, 1], [1, 0]] : 60, grade: () => ({ valid: true, correct: true })
};
assert.equal(validateBank(fixture), true);
assert.equal(normalizeCount(""), 10);
assert.equal(normalizeCount(null, 20, 20), 20);
assert.equal(normalizeCount("invalid"), 10);
assert.equal(normalizeCount(0), 1);
assert.equal(normalizeCount(-10), 1);
assert.equal(normalizeCount(21), 20);
assert.equal(normalizeCount(2.6), 3);
assert.equal(normalizeCount(20, 8), 8);
assert.equal(normalizeCount(20, 0), 0);
assert.equal(initialSelection(new URLSearchParams(), domains), "all");
assert.equal(initialSelection(new URLSearchParams("level=all"), domains), "all");
assert.equal(initialSelection(new URLSearchParams("level=2"), domains), "right-angle");
assert.equal(initialSelection(new URLSearchParams("level=99"), domains), null);
assert.equal(initialSelection(new URLSearchParams("domain=polygon&level=2"), domains), "polygon");
assert.equal(initialSelection(new URLSearchParams("domain=unknown"), domains), null);
assert.equal(answerText({ unit: "count" }, 4), "4개");
assert.equal(answerText({ unit: "count", responseKind: "angle-label" }, 4), "4번");
assert.equal(answerUnit({ unit: "count", responseKind: "angle-label" }), "번");
assert.equal(answerUnit({ unit: "count" }), "개");
assert.equal(answerUnit({ unit: "degree" }), "°");
assert.equal(answerUnit({ unit: "point" }), "");
assert.equal(answerText({ unit: "degree" }, 60), "60°");
assert.equal(answerText({ unit: "point" }, [[0, 1]]), "예시 답안");
assert.throws(() => validateBank({ ...fixture, problemsFor: () => [] }));
assert.throws(() => validateBank({ ...fixture, answerFor: () => NaN }));
assert.throws(() => validateBank({ ...fixture, domains: [...domains, domains[0]] }));
assert.throws(() => chooseEntries(fixture, "missing", 10));

let selections = 0;
function selectionAudit(api) {
  const original = JSON.stringify(api.domains.map((d) => api.problemsFor(d.id)));
  for (let seed = 1; seed <= 20; seed += 1) {
    for (const selection of ["all", ...api.domains.map((d) => d.id)]) {
      for (let count = 1; count <= 20; count += 1) {
        const entries = chooseEntries(api, selection, count, { seed, round: 0 });
        assert.equal(entries.length, count);
        assert.equal(new Set(entries.map((e) => e.problem.id)).size, count);
        assert.deepEqual(chooseEntries(api, selection, count, { seed, round: 0 }), entries);
        const polygonOrder = { triangles: 0, sum: 1, missing: 2, regular: 3 };
        const kinds = entries.filter((e) => e.domain.id === "polygon").map((e) => polygonOrder[e.problem.kind] ?? 4);
        assert.deepEqual(kinds, [...kinds].sort((a, b) => a - b), "Polygon teaching sequence");
        if (selection !== "all") assert.ok(entries.every((e) => e.domain.id === selection));
        const pages = groupPages(entries);
        assert.deepEqual(pages.flat(), entries);
        for (const page of pages) {
          assert.equal(new Set(page.map((e) => e.domain.id)).size, 1);
          assert.ok(page.reduce((sum, e) => sum + entryHeight(e), 0) <= PAGE_CAPACITY);
          if (page[0].problem.unit === "point") assert.ok(page.length <= 2);
        }
        const next = chooseEntries(api, selection, count, { seed, round: 1 });
        const nextKinds = next.filter((e) => e.domain.id === "polygon").map((e) => polygonOrder[e.problem.kind] ?? 4);
        assert.deepEqual(nextKinds, [...nextKinds].sort((a, b) => a - b), "New set keeps teaching sequence");
        assert.notDeepEqual(next.map((e) => e.problem.id), entries.map((e) => e.problem.id));
        for (const domain of api.domains) {
          const previousIds = new Set(entries.filter((e) => e.domain.id === domain.id).map((e) => e.problem.id));
          const nextIds = next.filter((e) => e.domain.id === domain.id).map((e) => e.problem.id);
          if (previousIds.size <= 10) assert.ok(nextIds.every((id) => !previousIds.has(id)));
        }
        selections += 1;
      }
    }
  }
  assert.equal(JSON.stringify(api.domains.map((d) => api.problemsFor(d.id))), original);
}
selectionAudit(fixture);
assert.deepEqual(groupPages(chooseEntries(fixture, "all", 20)).map((p) => p.length), [3, 2, 2, 2, 1, 3, 2, 3, 2]);
const unavailable = { ...fixture, domains: domains.slice(0, 3) };
assert.equal(chooseEntries(unavailable, "all", 20).length, 20);
assert.equal(initialSelection(new URLSearchParams("domain=parallel"), unavailable.domains), null);

let integration = "not requested", verifiedProblems = 0, validDrawingPoints = 0, parallelChecks = 0;
if (!process.argv.includes("--model-only")) {
  const api = await import("../../games/angle-studio/core.js");
  const renderer = await import("../../games/angle-studio/render.js");
  validateBank(api);
  selectionAudit(api);
  for (let seed = 1; seed <= 20; seed += 1) {
    const polygon = chooseEntries(api, "all", 20, { seed }).filter((e) => e.domain.id === "polygon");
    if (polygon.length >= 5) assert.equal(new Set(polygon.map((e) => e.problem.kind)).size, 4);
  }
  for (const domain of api.domains) for (const p of api.problemsFor(domain.id)) {
    const student = renderer.renderProblem(p, { reveal: false, lang: "ko", interactive: false });
    const answer = renderer.renderProblem(p, { reveal: true, lang: "ko", point: p.unit === "point" ? api.answerFor(p)[0] : null, interactive: false });
    assert.match(student, /<svg[\s>]/);
    assert.match(answer, /<svg[\s>]/);
    if (p.domain === "estimate") {
      assert.equal(api.answerFor(p), p.angle);
      assert.doesNotMatch(student, new RegExp(`>${p.angle}°<`));
    }
    if (p.domain === "parallel") {
      assert.match(api.promptFor(p, "ko"), p.parallel ? /평행합니다/ : /평행하지 않습니다/);
      if (p.responseKind === "angle-label") {
        const target = p.kind === "corresponding-position" ? (p.source + 4) % 8 : p.source ^ 6;
        assert.equal(api.answerFor(p), p.labels[target]);
        assert.equal(answerText(p, api.answerFor(p)), `${p.labels[target]}번`);
        for (let label = 1; label <= 8; label += 1) assert.equal(api.grade(p, label).correct, label === p.labels[target]);
      } else {
        assert.equal(p.parallel, true, "Angle calculation states parallel lines");
        assert.equal(api.answerFor(p), p.target % 2 === 0 ? p.tilt : 180 - p.tilt);
      }
      parallelChecks += 1;
    }
    if (p.unit === "point") {
      const expected = [];
      for (let y = 0; y < p.size; y += 1) for (let x = 0; x < p.size; x += 1) {
        if (x === p.origin[0] && y === p.origin[1]) continue;
        const dot = (p.arm[0] - p.origin[0]) * (x - p.origin[0]) + (p.arm[1] - p.origin[1]) * (y - p.origin[1]);
        if (dot === 0) expected.push([x, y]);
        assert.equal(api.grade(p, [x, y]).correct, dot === 0);
      }
      assert.deepEqual(api.answerFor(p), expected);
      assert.ok(expected.length > 1, "Drawing activity must preserve multiple valid answers");
      assert.doesNotMatch(student, />B<|role="button"/);
      assert.equal((answer.match(/>B<|>B<\/text>/g) || []).length, 1);
      validDrawingPoints += expected.length;
    }
    verifiedProblems += 1;
  }
  integration = "passed";
}
console.log(JSON.stringify({ passed: true, selections, integration, verifiedProblems, validDrawingPoints, parallelChecks, fixtureFourDomainBodyPages: 9 }, null, 2));
