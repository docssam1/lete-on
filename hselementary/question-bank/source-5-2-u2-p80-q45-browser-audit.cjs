"use strict";
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";
const output = process.env.HSE_AUDIT_OUTPUT || "/tmp/gfield-u2-q45";
fs.mkdirSync(output, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [1280, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: "block" });
      await context.addInitScript(() => { window.print = () => {}; });
      const page = await context.newPage(), errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`${origin}/hselementary/question-bank/`, { waitUntil: "load" });
      const pool = await page.evaluate(() => {
        const types = HSE_CURRICULUM.semesters.flatMap(s => s.units.flatMap(u => u.subunits.flatMap(g => g.types)));
        const type = types.find(t => t.id === "5-2-u2-t3-3");
        return { type, questions: Array.from({length: 9}, (_, i) => HSE_GENERATORS.generate(type, 0, 0, 1, i)), invalid: HSE_GENERATORS.generate(type, 0, 0, 1, 9) };
      });
      assert.equal(pool.type.reviewLocked, false);
      assert.equal(pool.type.sourceParentItemId, "5-2-u2-practice-45-original");
      assert.equal(pool.type.verifiedVariantCount, 9);
      assert.equal(pool.invalid, null);
      const independent = [[3,5,12,24],[5,8,18,27],[7,12,14,35],[4,7,21,63],[5,9,10,40],[7,10,20,15],[9,16,14,49],[8,13,30,50],[11,18,20,35]];
      for (const [i, [n,d,difference,expected]] of independent.entries()) {
        const q = pool.questions[i];
        assert(q.prompt.includes(`${n}/${d}`) && q.prompt.includes(`${difference}명`) && q.prompt.includes("여학생 수를 구하여라"));
        assert.equal(difference * (d-n) / (2*n-d), expected);
        assert.equal(q.answer, `${expected}명`);
        assert(q.solution.includes(`<strong>${expected}명</strong>`));
        assert.equal(q.sourceStructurePreserved, true);
        assert.equal(q.publisherAnswerVerified, false);
      }
      assert.equal(new Set(pool.questions.map(q => q.prompt)).size, 9);
      await page.locator('#gradeFilter [data-grade="5"]').click();
      await page.locator('#termFilter [data-term="2"]').click();
      await page.locator('#unitFilter').selectOption('5-2-u2');
      const checkbox = page.locator('#typeList input[data-type-id="5-2-u2-t3-3"]');
      assert.equal(await checkbox.isDisabled(), false);
      await checkbox.check();
      await page.locator('#questionCountInput').fill('4');
      await page.locator('#difficultyFilter [data-difficulty="0"]').click();
      await page.locator('#generateButton').click();
      await page.waitForFunction(() => !document.querySelector('#worksheet').hidden);
      assert.deepEqual(await page.locator('#problemView .print-page').evaluateAll(es => es.map(e => e.querySelectorAll('.question-item').length)), [4]);
      for (const answer of ['24명','27명','35명','63명']) assert((await page.locator('#solutionView').innerText()).replace(/\s/g,'').includes(answer));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      if (width === 1280) for (const mode of ['problem','solution']) {
        await page.locator(mode === 'problem' ? '#problemTab' : '#solutionTab').click();
        await page.locator('#printMenuButton').click();
        await page.locator(`#printMenuList [data-print-mode="${mode}"]`).click();
        const pdf = await page.pdf({ path: path.join(output, `${mode}.pdf`), format: 'A4', printBackground: true, preferCSSPageSize: true });
        if (mode === 'problem') assert.equal((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length, 1);
        await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
      }
      assert.deepEqual(errors, []);
      await context.close();
    }
  } finally { await browser.close(); }
  console.log('PASS: p80 q45 nine independent answers; desktop/mobile and A4 four-up');
})().catch(error => { console.error(error); process.exitCode = 1; });
