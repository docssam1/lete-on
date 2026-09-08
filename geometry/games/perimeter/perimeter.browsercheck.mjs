import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { domains, problemsFor } from "./core.js";

const base=process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765";
const out=fileURLToPath(new URL("./qa-artifacts/",import.meta.url));
await mkdir(out,{recursive:true});
const browser=await chromium.launch();
const context=await browser.newContext({viewport:{width:1280,height:900},serviceWorkers:"block",reducedMotion:"reduce"});
const page=await context.newPage(),errors=[];
page.on("pageerror",error=>errors.push(error.message));
page.on("console",message=>{if(message.type()==="error")errors.push(message.text());});
const perimeter=cells=>{
  const set=new Set(cells.map(c=>`${c.x},${c.y}`));
  let joined=0;
  cells.forEach(({x,y})=>{joined+=Number(set.has(`${x+1},${y}`))+Number(set.has(`${x},${y+1}`));});
  return 4*set.size-2*joined;
};
const expected=p=>p.domain==="compare"?(perimeter(p.cells)<perimeter(p.other)?"less":perimeter(p.cells)>perimeter(p.other)?"greater":"equal"):perimeter(p.cells);
let flows=0,layouts=0,pixels=0;
async function layout(){
  const result=await page.evaluate(()=>{
    const svg=document.querySelector("#board svg"),bounds=svg.getBoundingClientRect();
    return {overflow:document.documentElement.scrollWidth>innerWidth,text:[...document.querySelectorAll("h1,h2,button,summary,.domain-tabs a,.comparison-choices label")].filter(el=>el.clientWidth&&el.scrollWidth>el.clientWidth+1).map(el=>el.textContent),labels:[...svg.querySelectorAll("text")].filter(el=>{const b=el.getBoundingClientRect();return b.left<bounds.left-1||b.right>bounds.right+1||b.top<bounds.top-1||b.bottom>bounds.bottom+1;}).map(el=>el.textContent),width:bounds.width};
  });
  assert.equal(result.overflow,false,JSON.stringify(result));assert.deepEqual(result.text,[],JSON.stringify(result));assert.deepEqual(result.labels,[],JSON.stringify(result));assert.ok(result.width>=250);layouts++;
}
async function nonblank(){
  const colored=await page.evaluate(async()=>{
    const svg=document.querySelector("#board svg"),blob=new Blob([new XMLSerializer().serializeToString(svg)],{type:"image/svg+xml"}),url=URL.createObjectURL(blob),image=new Image();
    await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=url;});
    const canvas=document.createElement("canvas");canvas.width=324;canvas.height=svg.viewBox.baseVal.height;
    const ctx=canvas.getContext("2d");ctx.drawImage(image,0,0,canvas.width,canvas.height);URL.revokeObjectURL(url);
    const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;let count=0;
    for(let i=0;i<data.length;i+=4)if(data[i+3]>0&&Math.max(data[i],data[i+1],data[i+2])-Math.min(data[i],data[i+1],data[i+2])>15)count++;
    return count;
  });
  assert.ok(colored>800,`Blank diagram ${colored}`);pixels++;
}
async function hidden(){assert.equal(await page.locator("#review").isVisible(),false);}
try{
  await page.goto(base+"/geometry/games/perimeter/");
  await page.evaluate(()=>localStorage.setItem("gfield-profile",JSON.stringify({name:"Existing learner",progress:{unitArea:{preserved:true}}})));
  for(const width of [1280,390]){
    await page.setViewportSize({width,height:900});
    for(const domain of domains)for(let round=0;round<4;round++){
      await page.evaluate(({level,round})=>localStorage.setItem(`gfield-pool-perimeter-${level}`,round),{level:domain.level,round});
      await page.goto(`${base}/geometry/games/perimeter/?domain=${domain.id}&lang=ko`);
      await page.waitForSelector("#board svg");
      for(let index=0;index<5;index++){
        const p=problemsFor(domain.id)[round*5+index];
        assert.equal(await page.locator("#board").getAttribute("data-problem-id"),p.id);
        assert.equal(await page.locator("#check").isDisabled(),true);await hidden();await layout();
        if(!index&&!round){await nonblank();await page.screenshot({path:`${out}/${domain.id}-${width}-student.png`,fullPage:true});}
        if(domain.id==="build"){
          await page.locator('[data-cell="0,0"]').click();await page.locator('[data-cell="5,5"]').click();await page.locator("#check").click();await hidden();assert.match(await page.locator("#feedback").textContent(),/변끼리/);
          await page.locator("#undo").click();await page.locator("#undo").click();
          // A translated/reflected valid alternative must remain accepted.
          const alternate=p.example.map(c=>[p.size-1-c.x,c.y]);
          for(const cell of alternate)await page.locator(`[data-cell="${cell.join(",")}"]`).click();
          assert.equal(perimeter(p.example),perimeter(p.cells));
        }else if(domain.id==="compare"){
          await page.locator(`input[value=${expected(p)==="less"?"greater":"less"}]`).check();await page.locator("#check").click();await hidden();
          await page.locator("#aligned").check();assert.equal(await page.locator("[data-unit-segment]").count(),perimeter(p.cells)+perimeter(p.other));await layout();
          await page.locator(`input[value=${expected(p)}]`).check();
        }else{
          const edge=page.locator('[data-edge-kind="boundary"]').first();await edge.focus();await page.keyboard.press("Enter");assert.equal(await page.locator('[data-edge-kind="boundary"][aria-pressed="true"]').count(),1);
          await page.locator("#undo").click();assert.equal(await page.locator('[data-edge-kind="boundary"][aria-pressed="true"]').count(),0);
          if(domain.id==="joined"){await page.locator('[data-edge-kind="shared"]').first().click();assert.match(await page.locator("#feedback").textContent(),/안쪽/);assert.equal(await page.locator('[data-edge-kind="boundary"][aria-pressed="true"]').count(),0);}
          await page.locator("#answer").fill(String(expected(p)+2));await page.locator("#check").click();await hidden();
          await page.locator("#answer").fill(String(expected(p)));
        }
        await page.locator("#check").click();assert.equal(await page.locator("#review").isVisible(),true);assert.equal(await page.locator("#check").isDisabled(),true);await layout();flows++;
        if(!index&&!round)await page.screenshot({path:`${out}/${domain.id}-${width}-answer.png`,fullPage:true});
        await page.locator("#next").click();
      }
      assert.equal(await page.locator("#completion").isVisible(),true);await page.locator("#close").click();
    }
  }
  for(const width of [320,768])for(const lang of ["ko","en","zh","ja"])for(const domain of domains){
    await page.setViewportSize({width,height:900});await page.goto(`${base}/geometry/games/perimeter/?domain=${domain.id}&lang=${lang}`);await page.waitForSelector("#board svg");await layout();
    assert.equal(await page.locator("html").getAttribute("lang"),lang);
  }
  await page.goto(`${base}/geometry/games/perimeter/?domain=build&lang=ko`);await page.waitForSelector("[data-cell]");
  await page.locator('[data-cell="0,0"]').focus();await page.keyboard.press("ArrowRight");await page.keyboard.press(" ");assert.equal(await page.locator('[data-cell="1,0"]').getAttribute("aria-pressed"),"true");
  await page.selectOption("#language","ja");assert.equal(await page.locator('[data-cell="1,0"]').getAttribute("aria-pressed"),"true");
  const profile=await page.evaluate(()=>JSON.parse(localStorage.getItem("gfield-profile")));assert.equal(profile.name,"Existing learner");assert.equal(profile.progress.unitArea.preserved,true);
  const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,serviceWorkers:"block"}),tp=await touch.newPage();
  await tp.goto(base+"/geometry/games/perimeter/?domain=build");const target=await tp.locator('[data-cell="2,2"]').boundingBox();assert.ok(target.width>=24&&target.height>=24);await tp.locator('[data-cell="2,2"]').tap();assert.equal(await tp.locator('[data-cell="2,2"]').getAttribute("aria-pressed"),"true");await touch.close();
  await page.goto(base+"/geometry/games/perimeter/?domain=boundary&level=1&lang=ko");const current=await page.locator("#board").getAttribute("data-problem-id");await page.goto(base+"/geometry/games/perimeter/?domain=boundary&level=1&practice=1&lang=ko");await page.waitForSelector("#board svg");assert.notEqual(await page.locator("#board").getAttribute("data-problem-id"),current);
  assert.deepEqual(errors,[]);
  const report={flows,layouts,nonblank: pixels,touch:true,keyboard:true,profilePreserved:true,errors,learner_stage:"초등 기초 도형 · 단위길이와 둘레","learner-fit":{language:"pass",representations:"pass",prerequisites:"unit counting and addition", "reasoning-load":"separate boundary/join/compare/build domains", "response-mode":"numeric, comparison, direct construction"}};
  await writeFile(`${out}/game-report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
