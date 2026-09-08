import assert from "node:assert/strict";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { domains, problemsFor, properties, answerFor } from "./core.js";
import { renderProblem } from "./render.js";

const browser = await chromium.launch();
const page = await browser.newPage();
const stats = { staticCases: 0, exampleCases: 0, interactiveCases: 0, labelBounds: 0, failures: 0 };
async function parsed(svg) {
  return page.evaluate(value => {
    const xml = new DOMParser().parseFromString(value, "image/svg+xml");
    const root = xml.documentElement;
    if (xml.querySelector("parsererror")) return { error: xml.querySelector("parsererror").textContent };
    document.body.replaceChildren(document.importNode(root, true));
    const node = document.querySelector("svg"), bounds = node.viewBox.baseVal;
    const labels = [...node.querySelectorAll("text[data-label]")].map(n => {
      const box = n.getBBox();
      return { text: n.textContent, bounded: box.x >= 0 && box.y >= 0 && box.x + box.width <= bounds.width && box.y + box.height <= bounds.height };
    });
    return {
      error: null, labels, ratio: bounds.width / bounds.height,
      vertices: [...node.querySelectorAll("[data-vertex-dot]")].map(n => n.getAttribute("data-vertex-dot")),
      complete: node.querySelectorAll('[data-shape="complete"]').length,
      open: node.querySelectorAll('[data-shape="open"]').length,
      points: node.querySelectorAll('[data-point]').length,
      controls: node.querySelectorAll('[tabindex],[role="button"],[role="checkbox"]').length,
      parallel: node.querySelectorAll('[data-mark="parallel"]').length,
      right: node.querySelectorAll('[data-mark="right"]').length,
      equal: node.querySelectorAll('[data-mark="equal"]').length,
      poly: node.querySelector('[data-shape]')?.getAttribute('points')
    };
  }, svg);
}
try {
  for (const domain of domains) for (const p of problemsFor(domain.id)) for (const lang of ["ko", "en", "zh", "ja"]) for (const reveal of [false, true]) {
    const got = await parsed(renderProblem(p, { lang, reveal, interactive: false }));
    assert.equal(got.error, null, `${p.id}/${lang}`);
    assert.equal(got.controls, 0, `${p.id}: static controls`);
    assert.ok(got.ratio > .8 && got.ratio < 1.2);
    for (const label of got.labels) { assert.ok(label.bounded, `${p.id}/${label.text}`); stats.labelBounds++; }
    const build = p.domain === "build", solvedPoints = build ? [...p.vertices, p.example] : p.vertices;
    if (build && !reveal) {
      assert.equal(got.complete, 0, p.id);
      assert.equal(got.open, 1, p.id);
      assert.deepEqual(got.vertices, ["A", "B", "C"], p.id);
      assert.equal(got.parallel + got.right + got.equal, 0, p.id);
    } else {
      assert.equal(got.complete, 1, p.id);
      assert.deepEqual(got.vertices, ["A", "B", "C", "D"], p.id);
      const props = properties(solvedPoints);
      if (p.domain === "classify" || reveal) {
        if (["classify", "parallel", "build"].includes(p.domain)) {
          const count = props.parallelPairs.reduce((n, id) => n + (id === "ab-cd" ? 2 : 4), 0);
          assert.equal(got.parallel, count, p.id);
        }
        if (["classify", "right", "build"].includes(p.domain)) assert.equal(got.right, props.rightVertices.length, p.id);
        if (["classify", "build"].includes(p.domain)) assert.equal(got.equal, props.equalSideGroups.reduce((n, g, i) => n + g.length * (i + 1), 0), p.id);
      } else assert.equal(got.parallel + got.right + got.equal, 0, p.id);
    }
    stats.staticCases++;
  }
  for (const p of problemsFor("build")) {
    const initial = await parsed(renderProblem(p, { interactive: true }));
    assert.equal(initial.points, 49, p.id);
    assert.equal(initial.complete, 0, p.id);
    for (const point of answerFor(p)) {
      const got = await parsed(renderProblem(p, { reveal: true, selectedPoint: point }));
      assert.equal(got.complete, 1, p.id);
      const expected = [...p.vertices, point].map(([x, y]) => `${32 + 56 * x},${32 + 56 * y}`).join(" ");
      assert.equal(got.poly, expected, `${p.id}: accepted D preserved`);
      stats.exampleCases++;
    }
    stats.interactiveCases++;
  }
  console.log(JSON.stringify(stats));
} finally { await browser.close(); }
