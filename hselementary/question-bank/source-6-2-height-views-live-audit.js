"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { chromium } = require("playwright");
const output = process.env.HSE_SCREENSHOT_DIR;
assert(output && /^[EG]:[/\\]/i.test(output), "Evidence must stay on E: or G:.");
fs.mkdirSync(output, { recursive: true });
const ids = ["6-2-u3-e1-exploration", "6-2-u3-e1-example-3"];
const assets = ["index.html", "app.js", "source-inventory-grade6.js", "source-6-2-height-views.js", "source-6-2-height-views.css"];
const hashes = () => Object.fromEntries(assets.map(n => [n, crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname,n))).digest("hex")]));
const initialHashes = hashes();
async function inspect(page,id,phase) {
  const result = await page.evaluate(({ id,phase }) => {
    const root = document.querySelector(phase === "problem" ? "#problemView" : "#solutionView");
    const svgs = [...root.querySelectorAll('svg[data-renderer="source62-height-views"]')], errors = [];
    const overlap = (a,b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
    for (const svg of svgs) {
      const frame = svg.getBoundingClientRect(), transform = svg.getScreenCTM();
      if (svg.dataset.sourceItem !== id || svg.dataset.phase !== (phase === "solution" ? "answer" : "problem")) errors.push("Figure phase/source mismatch");
      const labels = [...svg.querySelectorAll("text")].map(el => ({el,box:el.getBoundingClientRect()}));
      for (const [i,{el,box}] of labels.entries()) {
        const style = getComputedStyle(el);
        if (style.fill !== "rgb(0, 0, 0)" || +style.fontWeight !== 400) errors.push(`Typography: ${el.textContent}`);
        if (box.height < 10) errors.push(`Small text: ${el.textContent}/${box.height}`);
        if (box.left < frame.left - .5 || box.right > frame.right + .5 || box.top < frame.top - .5 || box.bottom > frame.bottom + .5) errors.push(`Clipped text: ${el.textContent}`);
        for (const other of labels.slice(i+1)) if (overlap(box,other.box)) errors.push("Text/text collision");
        for (const line of svg.querySelectorAll("line")) {
          const a = new DOMPoint(+line.getAttribute("x1"), +line.getAttribute("y1")).matrixTransform(transform);
          const b = new DOMPoint(+line.getAttribute("x2"), +line.getAttribute("y2")).matrixTransform(transform);
          const n = Math.ceil(Math.hypot(a.x-b.x,a.y-b.y));
          for (let k=0;k<=n;k++) {
            const x=a.x+(b.x-a.x)*k/n, y=a.y+(b.y-a.y)*k/n;
            if (x > box.left-1 && x < box.right+1 && y > box.top-1 && y < box.bottom+1) { errors.push(`Text/line collision: ${el.textContent}`); break; }
          }
        }
      }
      for (const line of svg.querySelectorAll("line")) {
        const style = getComputedStyle(line);
        if (style.stroke !== "rgb(0, 0, 0)" || Math.abs(parseFloat(style.strokeWidth) - .8) > .001) errors.push("Grid stroke must be thin black");
      }
    }
    for (const panel of root.querySelectorAll(".source62-height-panels,.source62-face-account")) {
      const parent = panel.getBoundingClientRect();
      for (const svg of panel.querySelectorAll("svg")) { const r=svg.getBoundingClientRect(); if (r.left < parent.left-.5 || r.right > parent.right+.5) errors.push("Panel overflow"); }
    }
    for (const el of root.querySelectorAll(".math-inline-expression, header strong, header strong .math-unit, header strong .math-unit sup")) {
      const style = getComputedStyle(el);
      if (+style.fontWeight !== 400) errors.push(`Number/unit weight: ${el.textContent}`);
      if (el.matches(".math-inline-expression") && el.getClientRects().length !== 1) errors.push(`Broken number/unit: ${el.textContent}`);
    }
    return { errors, questions: root.querySelectorAll(phase === "problem" ? ".question-item" : ".solution-item").length, figures: svgs.length,
      answerBlocks: root.querySelectorAll("[data-answer-source]").length,
      leak: phase === "problem" && !!root.querySelector('[data-phase="answer"], [data-answer-source], [data-model], [data-stack-heights]'),
      overflow: document.documentElement.scrollWidth > innerWidth+1 };
  },{id,phase});
  assert.deepEqual(result.errors,[],`${id}/${phase}`);
  assert.equal(result.questions,3);
  assert.equal(result.figures,phase === "problem" ? id.endsWith("exploration") ? 15 : 3 : id.endsWith("exploration") ? 12 : 15);
  assert.equal(result.answerBlocks,phase === "problem" ? 0 : 3);
  assert(!result.leak && !result.overflow, JSON.stringify(result));
}
(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.HSE_CHROMIUM_EXECUTABLE});
  const base = process.env.HSE_BASE_URL || "http://127.0.0.1:8897/hselementary/question-bank/";
  const pdfs=[];
  let checked=0;
  try {
    for (const id of ids) for (const difficulty of [-1,0,1]) for (const width of [1280,390,320]) {
      const page = await browser.newPage({viewport:{width,height:900}}), errors=[];
      page.setDefaultNavigationTimeout(60000);
      page.on("pageerror",e=>errors.push(e.message));
      await page.goto(`${base}?type=${id}&review=1&difficulty=${difficulty}`,{waitUntil:"domcontentloaded"});
      await page.locator("#worksheet:not([hidden])").waitFor({state:"visible"});
      await page.evaluate(()=>document.fonts.ready);
      for (const phase of ["problem","solution"]) {
        if (phase === "solution") await page.locator("#solutionTab").click();
        await inspect(page,id,phase);
        if (width !== 320) {
          const prefix = `${id}-d${difficulty}-${width}-${phase}`;
          await page.screenshot({path:path.join(output,`${prefix}.png`),fullPage:true});
          await page.locator(phase === "problem" ? "#problemView .question-item" : "#solutionView .solution-item").first().screenshot({path:path.join(output,`${prefix}-first-item.png`)});
        }
        if (width === 1280) {
          await page.emulateMedia({media:"print"});
          await inspect(page,id,phase);
          const file = path.join(output,`${id}-d${difficulty}-${phase}-a4.pdf`);
          await page.pdf({path:file,format:"A4",printBackground:true,preferCSSPageSize:true});
          const pages=+execFileSync(process.env.HSE_PDFINFO_EXECUTABLE,[file],{encoding:"utf8"}).match(/^Pages:\s+(\d+)/m)[1];
          assert(pages>=1 && pages<=3,`${id}/${phase} ${pages} PDF pages`);
          pdfs.push({id,difficulty,phase,pages});
          await page.emulateMedia({media:"screen"});
        }
      }
      assert.deepEqual(errors,[]);
      await page.close(); checked++;
      console.log(`Height views ${checked}/18: ${id}/${difficulty}/${width}`);
    }
  } finally { await browser.close(); }
  assert.deepEqual(hashes(),initialHashes,"Files changed during render; repeat verification.");
  fs.writeFileSync(path.join(output,"browser-result.json"),JSON.stringify({checked,pdfs,assetHashes:initialHashes},null,2));
  console.log(`Height views passed ${checked} states and ${pdfs.length} A4 files.`);
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
