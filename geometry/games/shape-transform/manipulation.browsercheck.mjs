import assert from "node:assert/strict";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { levels, expectedFor } from "./levels.js";
import { pathData } from "./render.js";
import { activityCopy } from "./activity-copy.js";

const base = process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765";
const browser = await chromium.launch({headless:true});
const failures = [], sessions = [];
try {
  for (const [width,touch,language] of [[1280,false,"ko"],[390,true,"ko"],[390,true,"en"],[390,true,"zh"],[390,true,"ja"],[320,true,"en"]]) {
    const context = await browser.newContext({viewport:{width,height:900},hasTouch:touch,isMobile:touch,serviceWorkers:"block",reducedMotion:"reduce"});
    await context.addInitScript(language => {
      localStorage.setItem("gfield-language",language);localStorage.setItem("gfield-audio-muted","true");
    },language);
    const page = await context.newPage(), cdp = touch ? await context.newCDPSession(page) : null;
    page.on("pageerror",error=>failures.push(error.message));
    async function problemAt(level) {
      const path = await page.locator("#targetBoard .shape-line").getAttribute("d");
      const problem = levels[level-1].problems.find(p=>pathData(p.target,p.closed)===path);
      assert.ok(problem);return problem;
    }
    async function gesture(problem,cancel=false) {
      const board=page.locator("#manipulationBoard");
      await board.scrollIntoViewIfNeeded();
      const box=await board.boundingBox(), op=problem.operation, start=op.kind==="translate"?[45,45]:problem.target[1];
      const screen = point=>({x:box.x+box.width*point[0]/100,y:box.y+box.height*point[1]/100});
      const first=screen(start);
      if (touch) await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{...first,id:0}]});
      else {await page.mouse.move(first.x,first.y);await page.mouse.down();}
      for (let i=1;i<=8;i++) {
        const ratio=i/8;
        const angle=(op.angle||0)*ratio*Math.PI/180;
        const point=op.kind==="translate"?[start[0]+op.dx*ratio,start[1]+op.dy*ratio]:
          [50+(start[0]-50)*Math.cos(angle)-(start[1]-50)*Math.sin(angle),50+(start[0]-50)*Math.sin(angle)+(start[1]-50)*Math.cos(angle)];
        const at=screen(point);
        if (touch) await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{...at,id:0}]});
        else await page.mouse.move(at.x,at.y);
      }
      if (touch) await cdp.send("Input.dispatchTouchEvent",{type:cancel?"touchCancel":"touchEnd",touchPoints:[]});
      else await page.mouse.up();
      assert.equal(await board.evaluate(node=>node.classList.contains("dragging")),false);
    }
    async function controlsSolution(problem) {
      const op=problem.operation;
      await page.locator("#manipulationBoard").focus();
      if (op.kind==="rotate") {
        for(let i=0;i<Math.abs(op.angle)/90;i++) await page.keyboard.press(op.angle>0?"ArrowRight":"ArrowLeft");
      } else {
        for(let i=0;i<Math.abs(op.dx)/10;i++) await page.keyboard.press(op.dx>0?"ArrowRight":"ArrowLeft");
        for(let i=0;i<Math.abs(op.dy)/10;i++) await page.keyboard.press(op.dy>0?"ArrowDown":"ArrowUp");
      }
    }
    for (const level of [2,3]) {
      await page.goto(base+"/geometry/games/shape-transform/?level="+level,{waitUntil:"networkidle"});
      const rounds=language==="ko"?2:1;
      for(let round=0;round<rounds;round++) {
        for(let index=0;index<5;index++) {
          const problem=await problemAt(level);
          if(index<3) await page.locator(".choice").nth(problem.answerIndex).click();
          else {
            assert.equal(await page.locator(".choice").count(),0);
            assert.equal(await page.locator("#reviewBoard .shape-line").count(),0);
            assert.equal(await page.locator("#manipulationBoard .ghost-shape").count(),0);
            assert.equal(await page.locator("#manipulationBoard .pivot-label").count(),level===3?1:0);
            if (level===3) assert.equal(await page.locator("#manipulationBoard .pivot-label").textContent(),"O");
            assert.equal(await page.locator("#manipulationBoard .shape-line").getAttribute("d"),pathData(problem.target,problem.closed));
            await page.locator('#manipulationControls button[data-move="'+(level===2?"right":"cw")+'"]').click();
            await page.locator("#retryButton").click();
            assert.equal(await page.locator("#manipulationBoard .shape-line").getAttribute("d"),pathData(problem.target,problem.closed));
            await gesture(problem,touch && index===3);
            assert.equal(await page.locator("#manipulationBoard .shape-line").getAttribute("d"),pathData(expectedFor(problem),problem.closed));
            await page.locator("#retryButton").click();
            await controlsSolution(problem);
            if (problem.operation.angle===-90) {
              assert.equal(await page.locator("#manipulationReadout").textContent(),activityCopy(language).counterTurn+" 90°");
            }
            const layout=await page.evaluate(()=>({
              width:innerWidth,scroll:document.documentElement.scrollWidth,
              boards:[...document.querySelectorAll(".workbench .shape-svg")].map(n=>{const b=n.getBoundingClientRect();return[b.width,b.height];}),
              overflow:[...document.querySelectorAll("#manipulationActions button,#manipulationReadout")].filter(n=>n.scrollWidth>n.clientWidth+1).map(n=>n.textContent)
            }));
            assert.equal(layout.width,layout.scroll);assert.deepEqual(layout.overflow,[]);
            assert.deepEqual(layout.boards[0],layout.boards[1]);
            if(width===390 && language==="ko" && round===0 && index===4) await page.screenshot({path:`C:/Users/user/AppData/Local/Temp/gfield-transform-v5-touch-${level}.png`,fullPage:true});
            await page.keyboard.press("Enter");
            assert.equal(await page.locator("#nextButton").isVisible(),true);
            await page.waitForFunction(expected=>document.querySelector("#movingShape .shape-line")?.getAttribute("d")===expected,pathData(expectedFor(problem),problem.closed));
            const solved=await page.locator("#manipulationBoard .shape-line").getAttribute("d");
            await page.keyboard.press("ArrowRight");assert.equal(await page.locator("#manipulationBoard .shape-line").getAttribute("d"),solved);
            sessions.push({width,touch,language,level,round,index,closed:problem.closed});
          }
          await page.locator("#nextButton").click();
        }
        assert.equal(await page.locator("#completeDialog").evaluate(node=>node.open),true);
        if(round<rounds-1) {await page.locator("#practiceButton").click();await page.waitForURL(/level=[23](?!.*practice)/);}
      }
      await page.locator("#closeComplete").click();
      await page.locator("#domainTabs button").first().click();
      assert.equal(await page.locator("#manipulationPanel").isVisible(),false);
      assert.equal(await page.locator(".choice").count(),3);
    }
    await context.close();
  }
  assert.deepEqual(failures,[]);
  console.log(JSON.stringify({passed:true,directProblems:sessions.length,pointerAndKeyboard:true,touchCancel:true,practiceHalfTurn:true,viewports:[320,390,1280],languages:4},null,2));
} finally {await browser.close();}
