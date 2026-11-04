"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
require('./source-5-2-u3-page38-example82-review-audit.js');
const source=require('./source-5-2-u3-p38-example82-original.js');
const cells=Array.from({length:16},(_,i)=>[i%4,Math.floor(i/4)]),key=p=>p.map(([x,y])=>`${x},${y}`).sort().join(';');
function shape(p){const forms=[];for(const mirror of [1,-1])for(let t=0;t<4;t++){const q=p.map(([x,y])=>{x*=mirror;for(let j=0;j<t;j++)[x,y]=[-y,x];return [x,y]});const mx=Math.min(...q.map(p=>p[0])),my=Math.min(...q.map(p=>p[1]));forms.push(key(q.map(([x,y])=>[x-mx,y-my])));}return forms.sort()[0];}
function connected(p){const set=new Set(p.map(v=>v.join(','))),seen=new Set(),todo=[p[0]];while(todo.length){const [x,y]=todo.pop(),k=`${x},${y}`;if(!set.has(k)||seen.has(k))continue;seen.add(k);todo.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);}return seen.size===p.length;}
const shapes=new Set();for(const mask of source.masks){const a=cells.filter((_,i)=>mask&(1<<i)),b=cells.filter((_,i)=>!(mask&(1<<i)));assert.equal(a.length,8);assert(connected(a)&&connected(b));assert.equal(shape(a),shape(b));shapes.add(shape(a));}assert.equal(shapes.size,6);
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:45792";
const ids = ["5-2-u3-e8-example-8-2-original","5-2-u3-e6-mission-1-original","5-2-u3-e6-mission-2-original","5-2-u3-e6-mission-5-original"];
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
      await page.waitForFunction(() => window.HSE_GENERATORS && window.HSE_P38_E82_ORIGINAL);
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
        if(p.id!==ids[0]) assert(p.answer && compact(data.solutions[i].text).includes(compact(p.answer)), `answer ${i + 1} matches ${p.id}`);
      });
      assert.equal(data.problems.find(p=>p.id===ids[0]).answer,"6가지");
      assert.match(data.solutions[data.problems.findIndex(p=>p.id===ids[0])].text,/6가지/);
      assert.equal(data.problems.find(p=>p.id===ids[1]).answer,"136cm²");
      assert.equal(await page.locator(`#problemView [data-source-item-id='${ids[0]}'] svg`).count(),1);
      assert.equal(data.solutions[data.problems.findIndex(p=>p.id===ids[0])].figures,6);
      assert.equal(await page.locator(`#problemView [data-source-item-id='${ids[1]}'] svg`).count(),1);
      for(const id of [ids[2],ids[3]]) assert.equal(await page.locator(`#problemView [data-source-item-id='${id}'] svg`).count(),0);
      await page.setViewportSize({ width: 794, height: 1123 });
      await page.emulateMedia({ media: "print" });
      for (const id of ids.slice(0, 1)) {
        const family = await page.locator(`[data-source-item-id="${id}"]`).first().evaluate(el => getComputedStyle(el).fontFamily);
        assert.match(family, /Noto Serif KR/);
      }
      const layout = await page.locator('#problemView .question-item').evaluateAll(items=>items.map(item=>{const p=item.querySelector('.question-prompt').getBoundingClientRect(),a=item.querySelector('.answer-line').getBoundingClientRect();return {p:p.bottom,a:a.top}}));
      assert(layout.every(r=>r.p<=r.a+1),"question content must not overlap answer lines");
      await page.emulateMedia({ media: null });
      await page.setViewportSize({ width, height: 1000 });
      await page.locator("#solutionTab").click();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      if (width === 1280 && process.env.MAC_CHECK_OUTPUT) {
        for (const mode of ["problem", "solution"]) {
          await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
          await page.locator("#printMenuButton").click();
          await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
          await page.waitForFunction(mode => document.body.dataset.printMode === mode, mode);
          const pdf = await page.pdf({ path: path.join(process.env.MAC_CHECK_OUTPUT, `mixed-${mode}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
          if (mode === "problem") assert.equal((pdf.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length, 1, "four selected problems must fit one physical A4 page");
          await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
        }
      }
      assert.deepEqual(errors, []);
      await context.close();
    }
  } finally { await browser.close(); }
  console.log("PASS: page 38 example 8-2 original and balanced A4 layout");
})().catch(error => { console.error(error); process.exitCode = 1; });
