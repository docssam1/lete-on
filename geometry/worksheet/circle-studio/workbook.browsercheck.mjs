import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import * as api from "../../games/circle-studio/core.js?v=circle-1";
import { DOMAIN_ORDER, LANGUAGES, COVER_ID, SVG_WIDTH_MM } from "./workbook-core.js";
import { COPY } from "./i18n.js";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright"), { PDFDocument } = require("pdf-lib"), sharp = require("sharp");
const base = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765").replace(/\/$/, "");
const output = fileURLToPath(new URL("./qa-artifacts/", import.meta.url));
await mkdir(output, { recursive:true });
const browser = await chromium.launch({ headless:true });
const context = await browser.newContext({ viewport:{ width:1280, height:900 }, serviceWorkers:"block" });
const page = await context.newPage();
page.setDefaultTimeout(15000);
const errors = [], pdfs = [], screenshots = [], seen = new Set();
let layoutChecks = 0, contentChecks = 0, pixels = 0;
const bank = new Map(api.domains.flatMap((d) => api.problemsFor(d.id)).map((p) => [p.id,p]));
async function digests() {
  const hashes = {};
  for (const path of ["../../games/circle-studio/core.js","../../games/circle-studio/render.js","../../games/circle-studio/i18n.js","./app.js","./styles.css","./workbook-core.js","./i18n.js"]) hashes[path] = createHash("sha256").update(await readFile(new URL(path, import.meta.url))).digest("hex");
  return hashes;
}
const sources = await digests();
page.on("pageerror", (error) => errors.push(error.message));
const snapshot = () => page.locator(".problem").evaluateAll((nodes) => nodes.map((p) => p.dataset.problemId));
const toggle = (id, value) => page.locator(id).evaluate((node, checked) => { node.checked=checked; node.dispatchEvent(new Event("change", {bubbles:true})); },value);
async function open(query = "?seed=719") {
  await page.goto(`${base}/geometry/worksheet/circle-studio/${query}`, { waitUntil:"networkidle" });
  await page.waitForFunction(() => document.body.dataset.ready);
  assert.equal(await page.locator("body").getAttribute("data-ready"), "true", await page.locator("#loadMessage").textContent());
}
async function layout() {
  const result = await page.evaluate(() => {
    const SVG_WIDTH_MM=400/56*10;
    const issues=[], rect=(n)=>n.getBoundingClientRect(), visible=(n)=>n.getClientRects().length>0;
    const inside=(a,b)=>a.left>=b.left-1 && a.right<=b.right+1 && a.top>=b.top-1 && a.bottom<=b.bottom+1;
    const scales=[];
    for(const p of document.querySelectorAll(".problem")) {
      const box=rect(p), heading=rect(p.querySelector(".problem-heading")), body=rect(p.querySelector(".problem-body"));
      if(heading.bottom>body.top+1) issues.push(`Heading overlap: ${p.id}`);
      for(const n of p.querySelectorAll(".problem-heading,.diagram,.response,.diagram svg,.response p,.selection-option,.write-line")) if(visible(n)&&!inside(rect(n),box)) issues.push(`Problem overflow: ${p.id} ${n.className?.baseVal??n.className}`);
      const svg=p.querySelector("svg"), matrix=svg.getScreenCTM();
      if(Math.abs(matrix.a-matrix.d)>.0001) issues.push(`Stretched SVG: ${p.id}`);
      scales.push(matrix.a);
      for(const n of svg.querySelectorAll("text,path,line,polygon,polyline,circle")) if(!inside(rect(n),rect(svg))) issues.push(`SVG overflow: ${p.id} ${n.tagName}`);
      if(matchMedia("print").matches && Math.abs(rect(svg).width * 25.4 / 96 - SVG_WIDTH_MM) > .03) issues.push(`Wrong physical width: ${p.id}`);
      const d=rect(p.querySelector(".diagram")),r=rect(p.querySelector(".response"));
      if(d.left<r.right-1&&d.right>r.left+1&&d.top<r.bottom-1&&d.bottom>r.top+1) issues.push(`Diagram response overlap: ${p.id}`);
    }
    if(matchMedia("print").matches && Math.max(...scales)-Math.min(...scales)>.001) issues.push("Unequal diagram scale");
    for(const sheet of document.querySelectorAll(".sheet")) {
      const ps=[...sheet.querySelectorAll(".problem")];
      if(ps.length>2||new Set(ps.map((p)=>p.dataset.domain)).size!==1) issues.push("Mixed page");
      if(rect(ps.at(-1)).bottom>rect(sheet.querySelector("footer")).top+1) issues.push("Footer overlap");
      if(rect(sheet.querySelector(".sheet-head")).bottom>rect(ps[0]).top+1) issues.push("Page heading overlap");
    }
    for(const paper of document.querySelectorAll(".sheet,.book-cover:not([hidden])")) {
      if(paper.scrollWidth>paper.clientWidth+1||paper.scrollHeight>paper.clientHeight+1) issues.push(`Page overflow: ${paper.className}`);
      for(const n of paper.querySelectorAll(":scope > header,:scope > footer,.cover-copy,.cover-concept,.cover-contents,.learner-fit,.cover-meta")) if(!inside(rect(n),rect(paper))) issues.push(`Paper child overflow: ${n.className}`);
    }
    for(const n of document.querySelectorAll("button,select,.maker-settings label")) if(visible(n)&&n.scrollWidth>n.clientWidth+1) issues.push(`Control overflow: ${n.id||n.className}`);
    if(!matchMedia("print").matches&&document.documentElement.scrollWidth>innerWidth+1) issues.push("Horizontal overflow");
    return {issues,problems:document.querySelectorAll(".problem").length};
  });
  if(result.issues.length) await page.screenshot({path:`${output}/layout-failure.png`,fullPage:true});
  assert.deepEqual(result.issues,[],JSON.stringify(result));
  layoutChecks+=result.problems;
}
async function content(lang,reveal) {
  const items=await page.locator(".problem").evaluateAll(nodes=>nodes.map(p=>({
    id:p.dataset.problemId,prompt:p.querySelector(".problem-prompt").textContent,response:p.querySelector(".response").textContent,
    checked:[...p.querySelectorAll(".selection-option:has(input:checked)")].map(n=>n.dataset.optionId),
    options:[...p.querySelectorAll(".selection-option")].map(n=>n.dataset.optionId),
    values:[...p.querySelectorAll(".answer-value")].map(n=>n.textContent),
    controls:p.querySelectorAll("svg [tabindex],svg [role=button],svg [role=checkbox]").length,
    grid:p.querySelectorAll("[data-grid-dot]").length,
    centers:p.querySelectorAll("[data-selected-center],[data-center-label]").length,
    givenCenter:p.querySelectorAll("[data-given-center]").length,
    trace:p.querySelectorAll("[data-trace]").length,arm:p.querySelectorAll("[data-compass-arm]").length,
    parts:p.querySelectorAll("[data-part]").length, answerLength:p.querySelectorAll("[data-answer-length]").length,
    circles:[...p.querySelectorAll("circle[data-circle],circle[data-trace]")].map(n=>({cx:+n.getAttribute("cx"),cy:+n.getAttribute("cy"),r:+n.getAttribute("r")})),
    givenLength:p.querySelector("[data-given-length]")?.textContent,
    segments:[...p.querySelectorAll("[data-segment]")].map(n=>({id:n.dataset.segment,start:[+n.getAttribute("x1"),+n.getAttribute("y1")],end:[+n.getAttribute("x2"),+n.getAttribute("y2")]}))
  })));
  for(const item of items) {
    const p=bank.get(item.id);assert.ok(p);seen.add(p.id);
    assert.equal(item.prompt,api.promptPartsFor(p,lang).question);assert.equal(item.controls,0);
    if(!reveal) {assert.deepEqual(item.checked,[]);assert.deepEqual(item.values,[]);assert.equal(item.answerLength,0);assert.equal(item.centers,0);}
    else assert.ok(item.response.includes(api.solutionFor(p,lang)));
    if(p.domain==="center") {
      assert.equal(item.grid,49);
      assert.deepEqual(item.circles,[{cx:32+56*p.center[0],cy:32+56*p.center[1],r:56*p.radius}]);
      assert.equal(item.centers,reveal?2:0);
    } else if(p.domain==="draw") {
      assert.equal(item.grid,49);assert.equal(item.givenCenter,1);
      assert.equal(item.trace,+reveal);assert.equal(item.arm,+reveal);
      assert.deepEqual(item.circles,reveal?[{cx:32+56*p.center[0],cy:32+56*p.center[1],r:56*p.radius}]:[]);
      assert.equal(item.options.length,0);
    } else if(p.domain==="parts") {
      assert.equal(item.parts,4);assert.equal(item.circles.length,4);
      assert.deepEqual(item.options,["A","B","C","D"]);
      assert.deepEqual(item.checked,reveal?api.answerFor(p):[]);
      p.segments.forEach((segment,i)=>{
        const cx=100+(i%2)*200,cy=112+Math.floor(i/2)*200;
        assert.deepEqual(item.circles[i],{cx,cy,r:65});
        assert.deepEqual(item.segments[i],{id:segment.id,start:[cx+segment.start[0]*13,cy-segment.start[1]*13],end:[cx+segment.end[0]*13,cy-segment.end[1]*13]});
      });
    } else {
      assert.equal(item.grid,0);assert.equal(item.options.length,0);
      assert.equal(item.givenLength,(p.given==="radius"?p.radius:2*p.radius)+" cm");
      assert.deepEqual(item.values,reveal?[String(api.answerFor(p))]:[]);
      assert.equal(item.answerLength,+reveal);
    }
    contentChecks++;
  }
  for(const sheet of await page.locator(".sheet").all()) {
    const ids=await sheet.locator(".problem").evaluateAll(ns=>ns.map(n=>n.dataset.problemId));
    assert.deepEqual(await sheet.locator(".convention").allTextContents(),[...new Set(ids.flatMap(id=>api.promptPartsFor(bank.get(id),lang).conditions))]);
  }
  assert.equal(await page.locator("[data-cover-sample]").getAttribute("data-cover-sample"),COVER_ID);
  assert.equal(await page.locator("#worksheet").getAttribute("data-answer-mode"),String(reveal));
}
async function pixelCheck(locator) {
  const png=await locator.screenshot();
  const {data,info}=await sharp(png).removeAlpha().raw().toBuffer({resolveWithObject:true});
  let dark=0;
  for(let i=0;i<data.length;i+=info.channels) if(Math.min(...data.subarray(i,i+3))<200) dark++;
  assert.ok(dark>100 && dark<info.width*info.height*.6,`Nonblank image: ${dark}`);
  pixels++;
}
async function pdf(name,lang,query,expected,cover) {
  await page.emulateMedia({media:"print"});
  await open(`?seed=719&lang=${lang}&${query}`);
  await layout();
  const problems=await snapshot();
  const bytes=await page.pdf({path:`${output}/${name}.pdf`,preferCSSPageSize:true,printBackground:true});
  const document=await PDFDocument.load(bytes);
  assert.equal(document.getPageCount(),expected,name);
  for(const p of document.getPages()) { assert.ok(Math.abs(p.getWidth()-595.28)<1); assert.ok(Math.abs(p.getHeight()-841.89)<1); }
  const diagramBoxes = await page.locator(".problem").evaluateAll((nodes) => nodes.map((n) => {
    const sheet=n.closest(".sheet"), origin=sheet.getBoundingClientRect(), r=n.querySelector("svg").getBoundingClientRect();
    return {id:n.dataset.problemId,page:Number(sheet.dataset.page),left:r.left-origin.left,top:r.top-origin.top,right:r.right-origin.left,bottom:r.bottom-origin.top};
  }));
  pdfs.push({name,pages:expected,cover,problems,diagramBoxes});
  await page.emulateMedia({media:"screen"});
}
try {
  await open();
  assert.equal(await page.locator("#coverToggle").isChecked(),true);
  assert.equal(await page.locator("#countInput").inputValue(),"20");
  assert.equal(await page.locator(".sheet").count(),12);
  const initial=await snapshot();
  for(const lang of LANGUAGES) { await page.selectOption("#languageSelect",lang); assert.deepEqual(await snapshot(),initial); }
  for(const id of ["#coverToggle","#answerToggle"]) for(const value of [true,false]) {await toggle(id,value);assert.deepEqual(await snapshot(),initial);}
  const roundIDs=new Set(initial);
  for(let r=1;r<4;r++) {await page.click("#refreshButton");for(const id of await snapshot()) {assert.ok(!roundIDs.has(id));roundIDs.add(id);}}
  assert.equal(roundIDs.size,80);
  const savedUrl=page.url(),saved=await snapshot();await page.reload();await page.waitForFunction(()=>document.body.dataset.ready==="true");assert.deepEqual(await snapshot(),saved);assert.equal(page.url(),savedUrl);
  for(const width of [1280,768,390]) {
    console.log(`Checking viewport ${width}`);
    await page.setViewportSize({width,height:900});
    for(const lang of LANGUAGES) {
      for(const domain of DOMAIN_ORDER) for(const reveal of [false,true]) {
        await open(`?seed=719&lang=${lang}&domain=${domain}&count=20&cover=0&answers=${+reveal}`);
        await layout();await content(lang,reveal);await pixelCheck(page.locator(".diagram").first());
        if (width !== 768 && ["parts","draw"].includes(domain)) {
          const name=`${lang}-${domain}-${reveal?"answer":"student"}-${width}.png`;
          await page.locator(".sheet").first().screenshot({path:`${output}/${name}`});screenshots.push(name);
        }
      }
      await open(`?seed=719&lang=${lang}`);await layout();
      const name=`${lang}-${width}.png`;await page.screenshot({path:`${output}/${name}`});screenshots.push(name);
    }
  }
  assert.equal(seen.size,80);
  await page.setViewportSize({width:1280,height:900});
  for(const lang of LANGUAGES) {
    for(const domain of DOMAIN_ORDER) await pdf(`${lang}-${domain}-20-student`,lang,`domain=${domain}&count=20&cover=0`,10,false);
    await pdf(`${lang}-all20-cover`,lang,"count=20&cover=1",13,true);
    await pdf(`${lang}-all20-nocover`,lang,"count=20&cover=0",12,false);
    await pdf(`${lang}-all20-answers`,lang,"count=20&cover=1&answers=1",13,true);
    await pdf(`${lang}-single-cover`,lang,"domain=draw&count=1&cover=1",2,true);
    await pdf(`${lang}-single-nocover`,lang,"domain=draw&count=1&cover=0&answers=1",1,false);
  }
  for(const count of ["0","21","abc"]) {await open(`?count=${count}`);assert.equal((await snapshot()).length,count==="0"?1:20);}
  await page.goto(`${base}/geometry/worksheet/circle-studio/?domain=unknown`);
  await page.waitForFunction(()=>document.body.dataset.ready==="error");
  assert.equal(await page.locator("#worksheet").isHidden(),true);
  assert.equal(await page.locator("#printButton").isDisabled(),true);
  assert.deepEqual(errors,[]);
  assert.deepEqual(await digests(),sources,"Sources changed during QA; rerun required");
  const result={passed:true,layoutChecks,contentChecks,pixelChecks:pixels,bankIDs:seen.size,screenshots,pdfs,sources};
  await writeFile(`${output}/results.json`,JSON.stringify(result,null,2));
  console.log(JSON.stringify({...result,pdfs:pdfs.map(({name,pages})=>({name,pages})),sources:undefined},null,2));
} finally {await browser.close();}
