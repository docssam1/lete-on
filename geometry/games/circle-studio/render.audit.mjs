import assert from 'node:assert/strict';
import { chromium } from 'file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { domains, problemsFor } from './core.js';
import { renderProblem } from './render.js';

const browser = await chromium.launch(), page = await browser.newPage();
const stats = { staticStates: 0, constructionBeats: 0, labelBounds: 0, candidateControls: 0, negativeControls: 0 };
const xy = ([x, y]) => [32 + 56 * x, 32 + 56 * y];
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-6, `${a} != ${b}`);
async function inspect(svg) {
  return page.evaluate(source => {
    const xml = new DOMParser().parseFromString(source, 'image/svg+xml');
    if (xml.querySelector('parsererror')) return { error: xml.querySelector('parsererror').textContent };
    document.body.innerHTML = new XMLSerializer().serializeToString(xml.documentElement);
    const s = document.querySelector('svg');
    const num = (n, name) => Number(n.getAttribute(name));
    const line = n => n && ['x1', 'y1', 'x2', 'y2'].map(k => num(n, k));
    return {
      error: null, viewBox: s.getAttribute('viewBox'),
      controls: s.querySelectorAll('[tabindex]').length,
      givenCenter: s.querySelectorAll('[data-given-center]').length,
      selectedCenter: s.querySelectorAll('[data-selected-center]').length,
      centerLabel: s.querySelectorAll('[data-center-label]').length,
      circleTags: [...s.querySelectorAll('[data-circle],circle[data-trace]')].map(n => n.tagName.toLowerCase()),
      circles: [...s.querySelectorAll('[data-circle]')].map(n => ({ kind: n.dataset.circle, cx: num(n, 'cx'), cy: num(n, 'cy'), r: num(n, 'r') })),
      segments: [...s.querySelectorAll('[data-segment]')].map(n => ({ id: n.dataset.segment, line: line(n) })),
      length: s.querySelector('[data-given-length]')?.textContent,
      answerLength: s.querySelector('[data-answer-length]')?.textContent,
      trace: s.querySelector('[data-trace]')?.getAttribute('data-trace') || null,
      traceCircle: s.querySelector('circle[data-trace]') && ['cx', 'cy', 'r'].map(k => num(s.querySelector('circle[data-trace]'), k)),
      arm: line(s.querySelector('[data-compass-arm]')),
      labels: [...s.querySelectorAll('text')].map(n => { const b = n.getBBox(); return { text: n.textContent, bounded: b.x >= 0 && b.y >= 0 && b.x + b.width <= 400 && b.y + b.height <= 400 }; })
    };
  }, svg);
}
function bounded(got, id) {
  assert.equal(got.error, null, id); assert.equal(got.viewBox, '0 0 400 400');
  assert.ok(got.circleTags.every(tag => tag === 'circle'), `${id}: noncircular primitive`);
  for (const l of got.labels) { assert.ok(l.bounded, `${id}: ${l.text}`); stats.labelBounds++; }
}
try {
  for (const d of domains) for (const p of problemsFor(d.id)) for (const lang of ['ko', 'en', 'zh', 'ja']) for (const reveal of [false, true]) {
    const got = await inspect(renderProblem(p, { lang, reveal })); bounded(got, `${p.id}/${lang}`);
    assert.equal(got.controls, 0);
    if (p.domain === 'center') {
      assert.deepEqual(got.circles, [{ kind: 'given', cx: xy(p.center)[0], cy: xy(p.center)[1], r: p.radius * 56 }]);
      assert.equal(got.centerLabel, +reveal); assert.equal(got.selectedCenter, +reveal);
    } else if (p.domain === 'parts') {
      assert.equal(got.circles.length, 4); assert.equal(got.segments.length, 4);
      for (let i = 0; i < 4; i++) {
        const cx = 100 + i % 2 * 200, cy = 112 + Math.floor(i / 2) * 200;
        const map = ([x, y]) => [cx + (x - p.center[0]) * 13, cy - (y - p.center[1]) * 13];
        assert.deepEqual(got.circles[i], { kind: 'part', cx, cy, r: p.radius * 13 });
        assert.equal(got.segments[i].id, p.segments[i].id);
        assert.deepEqual(got.segments[i].line, [...map(p.segments[i].start), ...map(p.segments[i].end)]);
      }
    } else if (p.domain === 'measure') {
      assert.equal(got.length, `${p.given === 'radius' ? p.radius : p.radius * 2} cm`);
      assert.equal(Boolean(got.answerLength), reveal);
      assert.equal(got.circles[0].r, 128);
    } else {
      assert.equal(got.givenCenter, 1);
      assert.equal(got.trace, reveal ? 'complete' : null);
      assert.equal(Boolean(got.arm), reveal);
      if (reveal) assert.deepEqual(got.traceCircle, [...xy(p.center), p.radius * 56]);
    }
    stats.staticStates++;
  }
  for (const p of problemsFor('draw')) for (let r = 1; r <= 3; r++) for (let x = r; x <= 6 - r; x++) for (let y = r; y <= 6 - r; y++) {
    for (const progress of [0, .125, .25, .75, 1]) {
      const got = await inspect(renderProblem(p, { construction: { center: [x, y], radius: r }, traceProgress: progress })); bounded(got, p.id);
      const [cx, cy] = xy([x, y]);
      assert.equal(got.trace, progress === 0 ? null : progress === 1 ? 'complete' : 'partial');
      near(got.arm[0], cx); near(got.arm[1], cy);
      near(Math.hypot(got.arm[2] - cx, got.arm[3] - cy), r * 56);
      near(got.arm[2], cx + r * 56 * Math.cos(progress * 2 * Math.PI));
      near(got.arm[3], cy + r * 56 * Math.sin(progress * 2 * Math.PI));
      if (progress === 1) assert.deepEqual(got.traceCircle, [cx, cy, r * 56]);
      stats.constructionBeats++;
    }
  }
  for (const domain of ['center', 'draw']) for (const p of problemsFor(domain)) {
    const got = await inspect(renderProblem(p, { interactive: true })); assert.equal(got.controls, 49); stats.candidateControls += got.controls;
  }
  const sample = problemsFor('center')[0];
  const wrongPrimitive = await inspect(renderProblem(sample).replace(/<circle(?=[^>]*data-circle="given")/, '<ellipse'));
  assert.throws(() => bounded(wrongPrimitive, 'negative-ellipse')); stats.negativeControls++;
  const leak = await inspect(renderProblem(sample).replace('</svg>', '<circle cx="200" cy="200" r="5" data-selected-center="3,3"/></svg>'));
  assert.throws(() => assert.equal(leak.selectedCenter, 0)); stats.negativeControls++;
  const attempt = { center: [3, 3], radius: 2 };
  const changingArm = renderProblem(problemsFor('draw')[0], { construction: attempt, traceProgress: 0 })
    .replace(/(<line x1="200" y1="200" x2=")312("[^>]*data-compass-arm)/, '$1313$2');
  const wrongArm = await inspect(changingArm);
  assert.throws(() => near(Math.hypot(wrongArm.arm[2] - 200, wrongArm.arm[3] - 200), 112)); stats.negativeControls++;
  console.log(JSON.stringify({ passed: true, ...stats }));
} finally { await browser.close(); }
