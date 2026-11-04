"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const angle = Math.PI / 6;
const roots = [7 * Math.cos(angle) - Math.sqrt(16 - (7 * Math.sin(angle)) ** 2), 7 * Math.cos(angle) + Math.sqrt(16 - (7 * Math.sin(angle)) ** 2)];
assert(roots[0] > 0 && roots[1] > roots[0]);
for (const distance of roots) assert(Math.abs(Math.hypot(7 - distance * Math.cos(angle), distance * Math.sin(angle)) - 4) < 1e-10);
// Independent coordinate counterexamples with the exact source dimensions.
const { shape } = require("./source-5-2-u3-page25-mission6-synthetic.js");
const exact = { L:4, a:3.5, b:2.5 }, cosine=Math.cos(80*Math.PI/180), sine=Math.sin(80*Math.PI/180);
const pair = [0.45,8*cosine-0.45].map(t=>shape(exact,t));
assert(Math.abs(pair[0].diagonalNR-pair[1].diagonalNR)<1e-9);
const N={x:0,y:0}, D={x:4,y:0}, theta=65*Math.PI/180, G={x:3.5*Math.cos(theta),y:3.5*Math.sin(theta)};
const wx=4-G.x, wy=-G.y, proj=-cosine*wx+sine*wy, disc=proj**2-(wx**2+wy**2-2.5**2);
assert(disc>0);
const lengths=[-proj-Math.sqrt(disc),-proj+Math.sqrt(disc)];
for(const t of lengths){
  const R={x:4-t*cosine,y:t*sine}, points=[N,D,R,G];
  assert(Math.abs(Math.hypot(R.x-G.x,R.y-G.y)-2.5)<1e-9);
  assert(points.every((p,i)=>{const q=points[(i+1)%4],r=points[(i+2)%4];return (q.x-p.x)*(r.y-q.y)-(q.y-p.y)*(r.x-q.x)>0;}));
}
assert(lengths[1]-lengths[0]>3);
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:45756";
const ids = ["5-2-u3-e1-mission-1-original", "5-2-u3-e1-mission-4-original", "5-2-u3-e1-mission-6-original", "5-2-u3-e1-mission-5-original"];
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [1280, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: "block" });
      await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
      await context.addInitScript(() => { window.print = () => {}; });
      const page = await context.newPage(), errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`${origin}/hselementary/question-bank/`);
      await page.waitForFunction(() => window.HSE_GENERATORS && window.HSE_SOURCE52_U3_P25_MISSION_ORIGINALS);
      await page.locator("#gradeFilter [data-grade='5']").click();
      await page.locator("#termFilter [data-term='2']").click();
      await page.locator("#unitFilter").selectOption("5-2-u3");
      for (const id of ids) await page.locator(`#typeList input[data-type-id='${id}']`).check();
      await page.locator("#questionCountInput").fill("4");
      await page.locator("#difficultyFilter [data-difficulty='0']").click();
      await page.locator("#generateButton").click();
      await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
      const data = await page.evaluate(ids => {
        const types = window.HSE_CURRICULUM.semesters.flatMap(s => s.units.flatMap(u => u.subunits.flatMap(g => g.types)));
        const problems = [...document.querySelectorAll("#problemView .question-item")].map(item => {
          const marker = item.querySelector("[data-source-item-id][data-pool-index]");
          const id = marker?.dataset.sourceItemId, variant = Number(marker?.dataset.poolIndex);
          return { id, variant, answer: window.HSE_GENERATORS.generate(types.find(t => t.id === id), 0, 0, 0, variant).answer, automaticGrading: window.HSE_GENERATORS.generate(types.find(t => t.id === id), 0, 0, 0, variant).automaticGrading, figures: item.querySelectorAll("svg").length };
        });
        return { problems, solutions: [...document.querySelectorAll("#solutionView .solution-item")].map(e => ({ text: e.innerText, figures: e.querySelectorAll("svg").length })) };
      }, ids);
      assert.equal(data.problems.length, 4);
      assert.equal(data.solutions.length, 4);
      assert.deepEqual(await page.locator('#problemView .print-page').evaluateAll(pages => pages.map(page => page.querySelectorAll('.question-item').length)), [4], 'four questions per page, except the final remainder');
      assert.equal(await page.locator('#problemView [data-source-answer]').count(), 0, 'answers stay out of problems');
      assert.doesNotMatch(await page.locator('#problemView').innerText(), /도움말|힌트|풀이할 때/);
      const compact = s => s.normalize("NFKC").replace(/[\s/]/g, "");
      data.problems.forEach((p, i) => {
        assert(p.answer && compact(data.solutions[i].text).includes(compact(p.answer)), `answer ${i + 1} matches ${p.id}`);
      });
      assert.equal(await page.locator("#problemView .p25steps-figure").count(),1);
      assert.equal(await page.locator("#solutionView .p25steps-figure").count(),1);
      assert.equal(await page.locator("#solutionView .p25rhombus-answer").count(),1);
      const m5=data.problems.find(p=>p.id.endsWith("mission-5-original"));
      assert.equal(m5.answer,"①, ②, ④");
      assert.equal(await page.locator("#problemView .p25m5-figure").count(),1);
      const m6=data.problems.find(p=>p.id.endsWith("mission-6-original"));
      assert.equal(m6.answer,"①, ④");
      assert.equal(await page.locator("#problemView .p25m6-figure").count(),1);
      await page.emulateMedia({ media: "print" });
      for (const id of ids.slice(0, 1)) {
        const family = await page.locator(`[data-source-item-id="${id}"]`).first().evaluate(el => getComputedStyle(el).fontFamily);
        assert.match(family, /Noto Serif KR/);
      }
      const layout = await page.locator('#problemView .question-item').evaluateAll(items=>items.map(item=>{const p=item.querySelector('.question-prompt').getBoundingClientRect(),a=item.querySelector('.answer-line').getBoundingClientRect();return {p:p.bottom,a:a.top}}));
      assert(layout.every(r=>r.p<=r.a+1),"question content must not overlap answer lines");
      await page.emulateMedia({ media: null });
      await page.locator("#solutionTab").click();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      if (width === 1280 && process.env.MAC_CHECK_OUTPUT) {
        for (const mode of ["problem", "solution"]) {
          await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
          await page.locator("#printMenuButton").click();
          await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
          await page.waitForFunction(mode => document.body.dataset.printMode === mode, mode);
          if (mode === "solution") {
            await page.emulateMedia({media:"print"});
            const side = await page.locator("#solutionView .p25rhombus-answer").evaluate(svg => svg.getBoundingClientRect().width * 100 / svg.viewBox.baseVal.width);
            assert(Math.abs(side - 25 * 96 / 25.4) < 0.5, "rhombus side prints at 2.5cm");
            await page.emulateMedia({media:null});
          }
          const pdf = await page.pdf({ path: path.join(process.env.MAC_CHECK_OUTPUT, `mixed-${mode}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
          if (mode === "problem") assert.equal((pdf.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length, 1, "four selected problems must fit one physical A4 page");
          await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
        }
      }
      assert.deepEqual(errors, []);
      await context.close();
    }
  } finally { await browser.close(); }
  console.log("PASS: page 25 missions 5 and 6 and mixed A4 layout on desktop and mobile");
})().catch(error => { console.error(error); process.exitCode = 1; });
