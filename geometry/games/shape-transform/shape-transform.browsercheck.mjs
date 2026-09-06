import assert from "node:assert/strict";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { levels, expectedFor } from "./levels.js";
import { pathData } from "./render.js";
import { translation } from "./i18n.js";
import { rotationArc } from "./rotation-cue.js";
import { usesManipulation } from "./manipulation.js";
import { choiceFeedback } from "./choice-feedback.js";

const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765").replace(/\/$/, "");
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width:1280, height:900 }, serviceWorkers:"block", reducedMotion:"reduce" });
const page = await context.newPage();
const errors = [];
page.on("pageerror", error => errors.push(error.message));
page.on("console", message => { if (message.type()==="error") errors.push(message.text()); });
await context.addInitScript(() => {
  localStorage.setItem("gfield-language","ko");
  localStorage.setItem("gfield-audio-muted","true");
});
const checked = [];
const url = level => baseUrl+"/geometry/games/shape-transform/?level="+level;
async function layout() {
  const result = await page.evaluate(() => ({
    width:innerWidth, scrollWidth:document.documentElement.scrollWidth,
    boards:[...document.querySelectorAll(".workbench .shape-svg")].filter(svg=>svg.getBoundingClientRect().width).map(svg => {
      const box=svg.getBoundingClientRect(); return {width:box.width,height:box.height};
    }),
    textOverflow:[...document.querySelectorAll("button span,#missionTitle,#prompt,#operationLabel")].filter(node => node.clientWidth && node.scrollWidth > node.clientWidth+1).map(node=>node.textContent)
  }));
  assert.equal(result.width,result.scrollWidth,JSON.stringify(result));
  assert.equal(result.boards.length,await page.locator("#manipulationPanel").isVisible() ? 2 : 4);
  assert.deepEqual(result.textOverflow,[]);
  result.boards.forEach(board => {
    assert.ok(Math.abs(board.width-board.height)<1,JSON.stringify(board));
    assert.ok(Math.abs(board.width-result.boards[0].width)<1,JSON.stringify(result));
    assert.ok(board.width>=145,JSON.stringify(result));
  });
  return result;
}
async function dragSolution(problem) {
  const board = page.locator("#manipulationBoard");
  await board.scrollIntoViewIfNeeded();
  const box = await board.boundingBox(), op = problem.operation;
  const start = op.kind === "translate" ? [45,45] : problem.target[1];
  const finish = op.kind === "translate" ? [45+op.dx,45+op.dy] : expectedFor(problem)[1];
  await page.mouse.move(box.x+box.width*start[0]/100,box.y+box.height*start[1]/100);
  await page.mouse.down();
  await page.mouse.move(box.x+box.width*finish[0]/100,box.y+box.height*finish[1]/100,{steps:8});
  await page.mouse.up();
}
try {
  for (const width of [1280,390]) {
    await page.setViewportSize({width,height:900});
    for (let level=1;level<=5;level++) {
      await page.goto(url(level),{waitUntil:"networkidle"});
      assert.equal(await page.locator("#domainTabs button").count(),5);
      assert.equal(await page.locator("#missionTitle").textContent(),translation("ko").domains[level-1].title);
      assert.equal(await page.locator("#worksheetLink").getAttribute("href"),"../../worksheet/shape-transform/?level="+level);
      assert.match(await page.locator("#bandLabel").textContent(),level===1?/초등팩토 1/:level<4?/1031 입문 · 입문/:/1031 초급/);
      const geometry=await layout();
      if (width===1280 && level===1) await page.screenshot({path:"C:/Users/user/AppData/Local/Temp/gfield-transform-v3-desktop.png",fullPage:true});
      for (let index=0;index<5;index++) {
        const problem=levels[level-1].problems[index];
        assert.equal(await page.locator("#targetBoard .shape-line").getAttribute("d"),pathData(problem.target,problem.closed));
        assert.equal(await page.locator("#problemLabel").textContent(),(index+1)+" / 5");
        if (level===3) {
          const cue=page.locator("#operationLabel .rotation-cue");
          assert.equal(await cue.getAttribute("data-angle"),String(problem.operation.angle));
          assert.equal(await cue.locator(".rotation-arc").getAttribute("d"),rotationArc(problem.operation.angle).path);
          assert.equal(await cue.locator("text").textContent(),Math.abs(problem.operation.angle)+"°");
        }
        if (index===0) {
          await page.locator("#lessonSummary").click();
          assert.equal(await page.locator("#lessonContent .shape-svg").count(),2);
          await page.locator("#lessonSummary").click();
          await page.locator("#hintButton").click();
          assert.equal(await page.locator("#hintText").isVisible(),true);
          assert.equal(await page.locator(".choice.correct").count(),0);
          if (level===3) {
            const point=await page.locator("#targetBoard .reference-point").evaluate(node=>[+node.getAttribute("cx"),+node.getAttribute("cy")]);
            assert.deepEqual(point,problem.target[1]);
            assert.notEqual(await page.locator("#targetBoard .motion-guide").getAttribute("d"),"M50 50L50 50");
          }
          await page.locator(".choice").nth((problem.answerIndex+1)%3).click();
          assert.equal(await page.locator("#statusLabel").textContent(),choiceFeedback(problem,(problem.answerIndex+1)%3,"ko"));
          assert.equal(await page.locator("#nextButton").isVisible(),false);
          assert.equal(await page.locator("#reviewPanel").isVisible(),false);
        }
        if (usesManipulation(problem,index)) {
          await layout();
          assert.equal(await page.locator(".choice").count(),0);
          assert.equal(await page.locator("#manipulationBoard .ghost-shape").count(),0);
          await page.keyboard.press(String(problem.answerIndex+1));
          assert.equal(await page.locator("#nextButton").isVisible(),false);
          await page.locator("#checkShape").click();
          assert.equal(await page.locator("#reviewPanel").isVisible(),false);
          assert.equal(await page.locator("#statusLabel").getAttribute("class"),"needs-thought");
          await dragSolution(problem);
          assert.equal(await page.locator("#manipulationBoard .shape-line").getAttribute("d"),pathData(expectedFor(problem),problem.closed));
          await page.screenshot({path:`C:/Users/user/AppData/Local/Temp/gfield-transform-v5-direct-${level}-${width}.png`,fullPage:true});
          await page.locator("#checkShape").click();
          assert.equal(await page.locator("#checkShape").isDisabled(),true);
          assert.equal(await page.locator("#manipulationBoard").getAttribute("aria-disabled"),"true");
        } else {
          await page.keyboard.press(String(problem.answerIndex+1));
          assert.equal(await page.locator(".choice.correct").count(),1);
        }
        await page.waitForFunction(expected => document.querySelector("#movingShape .shape-line")?.getAttribute("d")===expected,pathData(expectedFor(problem),problem.closed));
        assert.equal(await page.locator("#reviewPanel").isVisible(),true);
        assert.equal(await page.locator("#compareButton").isVisible(),level===1);
        if (index===0 && level===1) {
          await page.locator("#compareButton").click();
          assert.equal(await page.locator("#reviewBoard .difference-ring").count(),2);
          await page.locator("#replayButton").click();
        }
        if (index===0 && width===390 && level===3) await page.screenshot({path:"C:/Users/user/AppData/Local/Temp/gfield-transform-v3-mobile.png",fullPage:true});
        if (index===0 && width===1280 && level===2) await page.screenshot({path:"C:/Users/user/AppData/Local/Temp/gfield-transform-v3-translation.png",fullPage:true});
        if (index===0) {
          await page.locator("#retryButton").click();
          assert.equal(await page.locator("#progressDots .done").count(),0);
          await page.locator(".choice").nth(problem.answerIndex).click();
        }
        await page.locator("#nextButton").click();
      }
      assert.equal(await page.locator("#completeDialog").evaluate(node=>node.open),true);
      assert.match(await page.locator("#completeText").textContent(),/5문제 완료/);
      assert.equal(await page.locator("#nextLevelButton").isVisible(),level<5);
      checked.push({width,level,geometry});
    }
  }
  // Practice advances only this area's pool and survives a reload.
  await page.goto(url(1),{waitUntil:"networkidle"});
  for (let i=0;i<5;i++) {
    await page.locator(".choice").nth(levels[0].problems[i].answerIndex).click();
    await page.locator("#nextButton").click();
  }
  await page.locator("#practiceButton").click();
  await page.waitForURL(/level=1(?!.*practice)/);
  assert.equal(await page.locator("#targetBoard .shape-line").getAttribute("d"),pathData(levels[0].problems[5].target,false));
  await page.reload({waitUntil:"networkidle"});
  assert.equal(await page.locator("#targetBoard .shape-line").getAttribute("d"),pathData(levels[0].problems[5].target,false));
  await page.locator("#domainTabs button").nth(1).click();
  assert.equal(await page.locator("#missionTitle").textContent(),"평행이동");
  assert.equal(await page.locator("#targetBoard .shape-line").getAttribute("d"),pathData(levels[1].problems[0].target,true));
  // Observe actual interpolation with motion enabled, then exact final coordinates.
  await page.emulateMedia({reducedMotion:"no-preference"});
  await page.goto(url(3),{waitUntil:"networkidle"});
  await page.locator(".choice").nth(levels[2].problems[0].answerIndex).click();
  const early=await page.locator("#movingShape .shape-line").getAttribute("d");
  await page.waitForTimeout(200);
  const during=await page.locator("#movingShape .shape-line").getAttribute("d");
  assert.notEqual(early,during);
  await page.waitForFunction(expected=>document.querySelector("#movingShape .shape-line")?.getAttribute("d")===expected,pathData(expectedFor(levels[2].problems[0]),true));
  const locales=[];
  for (const language of ["ko","en","zh","ja"]) {
    const locale=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:"block"});
    const localized=await locale.newPage();
    await locale.addInitScript(language=>{localStorage.setItem("gfield-language",language);localStorage.setItem("gfield-audio-muted","true");},language);
    for (let level=1;level<=5;level++) {
      await localized.goto(url(level),{waitUntil:"networkidle"});
      const result=await localized.evaluate(()=>({
        lang:document.documentElement.lang,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
        title:document.querySelector("#missionTitle").textContent,
        overflow:[...document.querySelectorAll("#domainTabs button,#domainTabs button span")].filter(n=>n.scrollWidth>n.clientWidth+1).map(n=>n.textContent)
      }));
      assert.equal(result.lang,language);assert.equal(result.width,result.scrollWidth);assert.deepEqual(result.overflow,[]);
      assert.equal(result.title,translation(language).domains[level-1].title);
      locales.push(result);
    }
    await locale.close();
  }
  await page.setViewportSize({width:1280,height:900});
  await page.goto(baseUrl+"/geometry/shape-garden/",{waitUntil:"networkidle"});
  assert.equal(await page.locator("#transformLevels .level-card").count(),5);
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({passed:true,sessions:checked.length,answered:50,practiceNonoverlap:true,animation:true,locales:locales.length,desktop:checked[0].geometry,mobile:checked[5].geometry,screenshots:["gfield-transform-v3-desktop.png","gfield-transform-v3-mobile.png","gfield-transform-v3-translation.png"]},null,2));
} finally { await browser.close(); }
