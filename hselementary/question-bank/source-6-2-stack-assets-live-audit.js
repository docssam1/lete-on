"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {chromium} = require("playwright");
const {directory, sha, verify} = require("./source-6-2-stack-assets-audit.js");
const out = process.env.HSE_SCREENSHOT_DIR;
assert(out && /^[EG]:[/\\]/i.test(out), "Evidence must stay on E:/G:");
const manifest = JSON.parse(fs.readFileSync(path.join(directory,"manifest.json"),"utf8"));
verify(manifest);
const base = new URL("./", process.env.HSE_STACK_REVIEW_URL || "http://127.0.0.1:8897/hselementary/question-bank/source-6-2-stack-review.html");
const assetUrl = file => new URL(`assets/source-6-2-stacks/${file}`, base).href;
async function main() {
  fs.mkdirSync(out,{recursive:true});
  const browser = await chromium.launch({headless:true, executablePath:process.env.HSE_CHROMIUM_EXECUTABLE, args:["--disable-3d-apis"]});
  const errors = [], states = [];
  try {
    for (const width of [1440,390,320]) {
      const page = await browser.newPage({viewport:{width,height:900}});
      page.on("pageerror", error => errors.push(error.message));
      await page.addInitScript(() => {
        window.webglAttempts = 0;
        const context = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type,...args) {
          if (/webgl/i.test(type)) { window.webglAttempts++; throw new Error("WebGL must not be needed for fixed answers"); }
          return context.call(this,type,...args);
        };
      });
      // This isolated fixture checks stored images, not the unfinished student-bank layout.
      const fixtureUrl = new URL("__stack-fixed-asset-proof__",base).href;
      await page.route(fixtureUrl, route => route.fulfill({contentType:"text/html",body:`<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0;background:white;color:black;font:15px Arial,sans-serif}figure{margin:0;padding:16px;break-after:page}img{display:block;width:min(100%,640px);height:auto;margin:0 auto}figcaption{text-align:center}@media print{@page{size:A4;margin:12mm}figure{padding:0;height:260mm}img{width:100%;height:210mm;object-fit:contain}figure:last-child{break-after:auto}}</style>${manifest.assets.map(a=>`<figure><figcaption>${a.sourceItemId} / ${a.variant}</figcaption><img src="${assetUrl(a.file)}" alt="앞쪽과 오른쪽을 표시한 정답 입체"></figure>`).join("")}</html>`}));
      await page.goto(fixtureUrl);
      await page.evaluate(() => Promise.all(Array.from(document.images, image => image.decode())));
      const result = await page.evaluate(settings => ({webglAttempts:window.webglAttempts,
        overflow:document.documentElement.scrollWidth > innerWidth,
        images:Array.from(document.images,image => {
          const rect=image.getBoundingClientRect(),canvas=document.createElement("canvas");
          canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
          const ctx=canvas.getContext("2d",{willReadFrequently:true});ctx.drawImage(image,0,0);
          const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;
          let nonwhite=0; for(let i=0;i<pixels.length;i+=4) if(pixels[i]<245||pixels[i+1]<245||pixels[i+2]<245)nonwhite++;
          return {size:[image.naturalWidth,image.naturalHeight],left:rect.left,right:rect.right,nonwhite,directionFontSize:settings.directionFontSize*rect.width/settings.width};
        })}), manifest.exportSettings);
      assert.equal(result.webglAttempts,0); assert.equal(result.overflow,false); assert.equal(result.images.length,6);
      result.images.forEach(image => {assert.deepEqual(image.size,[1280,1040]);assert(image.left>=0&&image.right<=width);assert(image.nonwhite>10000);assert(image.directionFontSize>=12,"Direction labels must remain readable at the fixture width");});
      for (const asset of manifest.assets) {
        const response=await page.request.get(assetUrl(asset.file));assert(response.ok());assert.equal(sha(await response.body()),asset.sha256);
      }
      await page.locator("figure").first().screenshot({path:path.join(out,`fixed-answer-${width}.png`)});
      if(width===1440) await page.pdf({path:path.join(out,"fixed-answers-a4.pdf"),format:"A4",printBackground:true,preferCSSPageSize:true});
      states.push({width,...result}); await page.close();
    }
    assert.deepEqual(errors,[]); verify(manifest);
    fs.writeFileSync(path.join(out,"fixed-assets-browser-result.json"),JSON.stringify({states,assetCount:6,webglRequired:false,scope:"Stored answer assets only; no learner bank release or difficulty approval"},null,2));
    console.log("Fixed answer images: six decoded model-linked PNGs at 1440/390/320px, no WebGL, no overflow, nonblank pixels and HTTP hashes passed.");
  } finally { await browser.close(); }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
