"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const areaModel = require("./source-5-2-u3-page28-example31-synthetic.js");
const lengthModel = require("./source-5-2-u3-page28-example32-synthetic.js");
for(const rotation of [0,12,30,44,60,89]) assert(Math.abs(areaModel.model(rotation,6).area-9)<1e-4);
const figure=lengthModel.model(12);assert(Math.abs(figure.targetLength-12)<1e-5);assert.equal(figure.markedAngle,60);
const rotationModel=require("./source-5-2-u3-page28-example33-synthetic.js");
const foldModel=require("./source-5-2-u3-page28-example34-synthetic.js");
function angle(a,o,b){const u={x:a.x-o.x,y:a.y-o.y},v={x:b.x-o.x,y:b.y-o.y};return Math.acos(Math.max(-1,Math.min(1,(u.x*v.x+u.y*v.y)/Math.hypot(u.x,u.y)/Math.hypot(v.x,v.y))))*180/Math.PI;}
const rp=rotationModel.points,fp=foldModel.points(24);
assert(Math.abs(angle(rp.D,rp.M,rp.R)-30)<1e-6);
assert(Math.abs(angle(fp.D,fp.G,fp.M)-24)<1e-8);
assert(Math.abs(angle(fp.B,fp.O,fp.D)-72)<1e-8);
// Source-only hypotheses: all retain the illustrated vertex correspondence,
// intersection order, 65° and 70°, but choose each possible isosceles apex.
function witness(dAngle){
 const rad=Math.PI/180,gAngle=115-dAngle,t=70-gAngle,r=Math.sin(65*rad)/Math.sin(gAngle*rad);
 const D={x:0,y:0},N={x:-1,y:0},G={x:r*Math.cos((180-dAngle)*rad),y:r*Math.sin((180-dAngle)*rad)};
 const rotate=p=>({x:p.x*Math.cos(t*rad)+p.y*Math.sin(t*rad),y:-p.x*Math.sin(t*rad)+p.y*Math.cos(t*rad)}),R=rotate(G),M=rotate(N);
 const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y}),cross=(a,b)=>a.x*b.y-a.y*b.x,u=sub(D,G),v=sub(M,R),q=cross(sub(R,G),v)/cross(u,v),z=cross(sub(G,R),u)/cross(v,u),B={x:G.x+q*u.x,y:G.y+q*u.y};
 assert(q>0&&q<1&&z>0&&z<1);assert(Math.abs(angle(G,N,D)-65)<1e-8);assert(Math.abs(angle(M,B,D)-70)<1e-8);
 const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),sides=[dist(G,N),dist(N,D),dist(D,G)];assert(sides.some((x,i)=>sides.some((y,j)=>i!==j&&Math.abs(x-y)<1e-8)));
 assert(Math.abs(dist(G,N)-dist(R,M))<1e-8&&Math.abs(dist(G,D)-dist(R,D))<1e-8);
 return angle(D,G,R);
}
[65,57.5,50].forEach((d,i)=>assert(Math.abs(witness(d)-[80,83.75,87.5][i])<1e-8));
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:45763";
const ids = ["5-2-u3-e3-exploration-scope",...[1,2,3].map(n=>`5-2-u3-e3-example-${n}-original`)];
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
      await page.waitForFunction(() => window.HSE_GENERATORS && window.HSE_SOURCE52_U3_P28_EXPLORATION_SCOPE);
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
      assert.equal(data.problems.find(p=>p.id===ids[0]).answer,"80°");
      assert.match(await page.locator(`#problemView [data-source-item-id='${ids[0]}']`).innerText(),/ㄱㄴ = ㄱㄷ/);
      for (const id of ids) assert.equal(await page.locator(`#problemView [data-source-item-id='${id}'] svg`).count(),1);
      assert.equal(await page.locator('#solutionView .p28exp-scope-solution').count(),1);
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
          const pdf = await page.pdf({ path: path.join(process.env.MAC_CHECK_OUTPUT, `mixed-${mode}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
          if (mode === "problem") assert.equal((pdf.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length, 1, "four selected problems must fit one physical A4 page");
          await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
        }
      }
      assert.deepEqual(errors, []);
      await context.close();
    }
  } finally { await browser.close(); }
  console.log("PASS: page 28 clarified exploration, source counterexamples and A4 layout on desktop and mobile");
})().catch(error => { console.error(error); process.exitCode = 1; });
