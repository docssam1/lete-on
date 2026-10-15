"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),contracts=require("./source-6-2-border-mission3-contracts.js");
const id="6-2-u3-e2-mission-3",out=process.env.HSE_SCREENSHOT_DIR,base=new URL(process.env.HSE_BASE_URL);
assert(out&&/^E:[/\\]/i.test(out));assert(["127.0.0.1","localhost"].includes(base.hostname));fs.mkdirSync(out,{recursive:true});
async function main(){
  const {chromium}=require("playwright"),browser=await chromium.launch({headless:true,executablePath:process.env.HSE_CHROMIUM_EXECUTABLE}),report={status:"running",states:[],negative:[],actualInventoryTested:true};
  try{
    const page=await browser.newPage(),errors=[];page.on("pageerror",e=>errors.push(e.message));await page.route("**/*",r=>new URL(r.request().url()).origin===base.origin?r.continue():r.abort());
    for(const width of [1280,390,320]){
      await page.setViewportSize({width,height:1000});await page.goto(new URL(`?type=${id}&review=1&difficulty=1`,base).href);await page.locator("#worksheet:not([hidden])").waitFor();await page.locator("#solutionTab").click();
      for(let v=0;v<3;v++){
        const q=contracts.generate(id,v,2),button=page.locator('#solutionView .solution-item').nth(v).locator('.source62-border-answer button').nth(1);await button.click();await page.locator('.source62-m3-figure-dialog[open]:not([aria-busy=true])').waitFor();
        const actual=await page.locator('.source62-m3-figure-dialog img').evaluate(image=>{
          const svg=new DOMParser().parseFromString(decodeURIComponent(image.getAttribute("src").slice(image.getAttribute("src").indexOf(",")+1)),"image/svg+xml").documentElement;
          const canvas=document.createElement("canvas");canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;const ctx=canvas.getContext("2d");ctx.drawImage(image,0,0);const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;let ink=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i]<100&&pixels[i+1]<100&&pixels[i+2]<100&&pixels[i+3]>200)ink++;
          return {role:svg.dataset.gridRole,cells:[...svg.querySelectorAll('g[data-x]')].map(g=>({x:Number(g.dataset.x),z:Number(g.dataset.z),value:Number(g.dataset.value),text:g.querySelector("text").textContent})),ink,width:image.clientWidth};
        });
        assert.equal(actual.role,"answer-filled");assert.equal(actual.cells.length,q.filledModel.side*q.filledModel.side);assert(actual.ink>1000&&actual.width>=640);
        const keys=new Set();for(const cell of actual.cells){assert.equal(cell.value,1);assert.equal(cell.text,"1");assert.equal(q.filledModel.H[cell.z]?.[cell.x],1);keys.add(`${cell.x},${cell.z}`);}assert.equal(keys.size,actual.cells.length);
        await page.keyboard.press("Escape");assert(await button.evaluate(el=>el===document.activeElement));report.states.push({width,variant:v,cells:actual.cells.length,filledImageNonblank:true,focusRestored:true});
        for(const [field,value]of [["sourceDifficultyLevel","1"],["sourceGridRole","unknown"],["m3Figure","3"]]){
          const old=await button.getAttribute(`data-${field.replace(/[A-Z]/g,c=>`-${c.toLowerCase()}`)}`);await button.evaluate((el,{field,value})=>el.dataset[field]=value,{field,value});await button.click();await page.waitForTimeout(40);assert.equal(await page.locator('.source62-m3-figure-dialog[open]').count(),0);await button.evaluate((el,{field,old})=>el.dataset[field]=old,{field,old});report.negative.push({width,variant:v,field});
        }
      }
    }
    assert.deepEqual(errors,[]);report.status="passed";
  }catch(error){report.status="failed";report.error=error.stack;throw error;}
  finally{fs.writeFileSync(path.join(out,"zoom-result.json"),JSON.stringify(report,null,2)+"\n");await browser.close();}
  console.log(JSON.stringify({status:report.status,filledZoomStates:report.states.length,invalidPhaseRejections:report.negative.length}));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
