import { strict as assert } from "node:assert";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const baseUrl=(process.env.GFIELD_BASE_URL||"http://127.0.0.1:8765").replace(/\/$/,"");
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1048,height:901},deviceScaleFactor:1});
const errors=[];
page.on("console",(message)=>{if(message.type()==="error")errors.push(message.text());});
page.on("pageerror",(error)=>errors.push(error.message));
await page.addInitScript(()=>localStorage.setItem("gfield-net-observatory-tutorial-v1","done"));
await page.goto(`${baseUrl}/geometry/games/net-observatory/?level=2`,{waitUntil:"networkidle"});

assert.equal(await page.locator(".viewer-host canvas").count(),1);
assert.equal(await page.locator(".viewer-host").getAttribute("data-material"),"satin-enamel");
assert.equal(await page.locator(".choice-cube-host canvas").count(),0);
assert.equal(await page.locator(".face-choice").count(),3);
assert.equal(await page.locator(".cube-view").count(),0);
assert.match(await page.locator("#missionTitle").textContent(),/그림 면 마주보기/);
const frame=await page.evaluate(()=>{
  const top=document.querySelector(".topbar").getBoundingClientRect();
  const stage=document.querySelector(".stage-panel").getBoundingClientRect();
  const dock=document.querySelector(".answer-dock").getBoundingClientRect();
  return{height:innerHeight,top:top.toJSON(),stage:stage.toJSON(),dock:dock.toJSON(),scrollHeight:document.documentElement.scrollHeight};
});
assert.ok(frame.top.top>=0&&frame.top.bottom<=frame.height,JSON.stringify(frame));
assert.ok(frame.stage.top>=frame.top.bottom&&frame.stage.bottom<=frame.dock.top+1,JSON.stringify(frame));
assert.ok(frame.dock.bottom<=frame.height+1,JSON.stringify(frame));

const alphaBounds=await page.locator(".viewer-host canvas").evaluate((canvas)=>{
  const gl=canvas.getContext("webgl2")||canvas.getContext("webgl");
  const width=gl.drawingBufferWidth,height=gl.drawingBufferHeight,pixels=new Uint8Array(width*height*4);gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
  let minX=width,minY=height,maxX=-1,maxY=-1,count=0;
  for(let y=0;y<height;y+=1)for(let x=0;x<width;x+=1){if(pixels[(y*width+x)*4+3]>20){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);count+=1;}}
  return{width,height,minX,minY,maxX,maxY,count,margin:Math.min(minX,minY,width-1-maxX,height-1-maxY)};
});
assert.ok(alphaBounds.count>5000,JSON.stringify(alphaBounds));
assert.ok(alphaBounds.margin>=12,JSON.stringify(alphaBounds));
await page.screenshot({path:"C:/Users/user/AppData/Local/Temp/gfield-net-observatory-flat.png",fullPage:true});

await page.locator("#foldButton").click();
await page.waitForFunction(()=>Number(document.querySelector(".viewer-host")?.dataset.foldProgress)>.99);
await page.screenshot({path:"C:/Users/user/AppData/Local/Temp/gfield-net-observatory-3d.png",fullPage:true});
const problemBefore=await page.locator("#problemLabel").textContent();
for(const button of await page.locator(".answer-choice").all()){await button.click();if(await button.evaluate((node)=>node.classList.contains("correct")))break;}
await page.waitForFunction((before)=>document.querySelector("#problemLabel")?.textContent!==before,problemBefore);
const problemAfter=await page.locator("#problemLabel").textContent();

await page.setViewportSize({width:844,height:390});
await page.goto(`${baseUrl}/geometry/games/net-observatory/?level=4`,{waitUntil:"networkidle"});
const mobile=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,canvases:document.querySelectorAll("canvas").length,dock:document.querySelector(".answer-dock").getBoundingClientRect().toJSON()}));
assert.ok(mobile.scrollWidth<=mobile.width+1,JSON.stringify(mobile));
assert.ok(mobile.scrollHeight<=mobile.height+1,JSON.stringify(mobile));
assert.equal(mobile.canvases,4);
assert.ok(mobile.dock.bottom<=mobile.height+1,JSON.stringify(mobile));
await page.screenshot({path:"C:/Users/user/AppData/Local/Temp/gfield-net-observatory-mobile.png",fullPage:true});
assert.equal(errors.length,0,errors.join("\n"));
console.log(JSON.stringify({baseUrl,frame,alphaBounds,pictureChoices:3,autoAdvance:{before:problemBefore,after:problemAfter},mobile},null,2));
await browser.close();
