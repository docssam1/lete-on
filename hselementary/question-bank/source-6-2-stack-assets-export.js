"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {chromium} = require("playwright");
const models = require("./source-6-2-stack-models.js");
const {directory, runtimeFiles, sha, textSha, contractSha, pngSize, verify} = require("./source-6-2-stack-assets-audit.js");
const evidence = process.env.HSE_SCREENSHOT_DIR;
assert(evidence && /^[EG]:[/\\]/i.test(evidence), "Evidence must stay on E:/G:");
assert(/^[EG]:[/\\]/i.test(__dirname), "Export only from the E:/G: worktree");
const proof = JSON.parse(fs.readFileSync(path.join(evidence, "stack-browser-result.json"), "utf8"));
const pdf = JSON.parse(fs.readFileSync(path.join(evidence, "stack-pdf-result.json"), "utf8"));
assert.equal(proof.states, 18); assert.equal(proof.regression.length, 7);
assert(proof.rows.every(row => row.errors.length === 0 && row.labelErrors.length === 0 && row.rotated && !row.overflow));
assert(proof.regression.every(row => row.errors.length === 0));
assert.equal(pdf.pages, 6); assert.equal(pdf.pdfs.length, 6);
const proofHashes = Object.fromEntries(runtimeFiles.map(name => [name, sha(fs.readFileSync(path.join(__dirname, name)))]));
assert.deepEqual(proofHashes, proof.assetHashes, "Re-run the complete live audit after any runtime change");
const runtimeHashes = Object.fromEntries(runtimeFiles.map(name => [name, textSha(fs.readFileSync(path.join(__dirname, name)))]));
const exportSettings = {width:640,height:520,pixelRatio:2,directionFontSize:28};
function writeVerified(filename, bytes) {
  if (fs.existsSync(filename)) assert(fs.readFileSync(filename).equals(bytes), `Do not overwrite a different existing asset: ${filename}`);
  else fs.writeFileSync(filename, bytes, {flag:"wx"});
}
async function main() {
  const browser = await chromium.launch({headless:true, executablePath:process.env.HSE_CHROMIUM_EXECUTABLE,
    args:["--use-angle=swiftshader", "--enable-unsafe-swiftshader"]});
  const collected = [], errors = [];
  try {
    const page = await browser.newPage({viewport:{width:1440,height:900}, deviceScaleFactor:1});
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(process.env.HSE_STACK_REVIEW_URL || "http://127.0.0.1:8897/hselementary/question-bank/source-6-2-stack-review.html");
    await page.waitForFunction(() => window.stackReview?.ready);
    assert(await page.evaluate(() => [0,11,33,-1,NaN,Infinity,null].every(directionFontSize => {
      try { window.stackReview.stack.snapshot({directionFontSize}); return false; }
      catch (error) { return error.message === "Invalid direction font size"; }
    })), "Invalid direction font sizes must be rejected before rendering");
    assert(await page.evaluate(() => {
      const before=window.stackReview.stack.inspect(), measure=CanvasRenderingContext2D.prototype.measureText;
      let rejected=false;
      try {
        CanvasRenderingContext2D.prototype.measureText=()=>({actualBoundingBoxLeft:1e6,actualBoundingBoxRight:1e6,actualBoundingBoxAscent:1e6,actualBoundingBoxDescent:1e6});
        window.stackReview.stack.snapshot();
      } catch(error) { rejected=error.message === "Direction label outside snapshot"; }
      finally { CanvasRenderingContext2D.prototype.measureText=measure; }
      const after=window.stackReview.stack.inspect();
      return rejected && before.width===after.width && before.height===after.height;
    }), "Rejected label bounds must restore the live canvas size");
    for (const [source, definition] of models.definitions.entries()) for (const [variant, pool] of definition.pools.entries()) {
      await page.selectOption("#source", String(source));
      await page.selectOption("#pool", String(variant));
      await page.waitForFunction(() => document.querySelector("#scene").dataset.printReady === "true");
      const canonical = await page.evaluate(settings => {
        const image = document.querySelector(".source62-stack-print"), {definition,pool} = window.stackReview;
        return {sourceItemId:definition.sourceItemId, pool, size:[image.naturalWidth,image.naturalHeight], data:window.stackReview.stack.snapshot(settings)};
      }, exportSettings);
      assert.equal(canonical.sourceItemId, definition.sourceItemId); assert.deepEqual(canonical.pool, pool);
      assert.deepEqual(canonical.size, [1280,1040]);
      assert(canonical.data.startsWith("data:image/png;base64,"));
      const bytes = Buffer.from(canonical.data.slice("data:image/png;base64,".length), "base64");
      assert.deepEqual(pngSize(bytes), canonical.size);
      collected.push({bytes, asset:{file:`${definition.sourceItemId}-v${variant}.png`, sourceItemId:definition.sourceItemId, variant,
        contractSha256:contractSha(definition,pool), sha256:sha(bytes), byteLength:bytes.length, size:canonical.size}});
    }
    assert.deepEqual(errors, []);
    for (const name of runtimeFiles) assert.equal(sha(fs.readFileSync(path.join(__dirname,name))), proofHashes[name]);
    const manifest = {schemaVersion:1, releaseStatus:"locked", usage:"answer-only-canonical-source-model", camera:["right","above","front"],
      runtimeHashEncoding:"utf8-lf", runtimeHashes, exportSettings, assets:collected.map(({asset}) => asset)};
    const bytesByFile = new Map(collected.map(({asset,bytes}) => [asset.file,bytes]));
    verify(manifest, file => bytesByFile.get(file));
    fs.mkdirSync(directory, {recursive:true});
    // Generated artifacts are immutable: fail on a different existing file instead of replacing it.
    for (const {asset,bytes} of collected) if (fs.existsSync(path.join(directory,asset.file))) assert(fs.readFileSync(path.join(directory,asset.file)).equals(bytes));
    const manifestBytes = Buffer.from(JSON.stringify(manifest,null,2) + "\n");
    if (fs.existsSync(path.join(directory,"manifest.json"))) assert(fs.readFileSync(path.join(directory,"manifest.json")).equals(manifestBytes));
    for (const {asset,bytes} of collected) writeVerified(path.join(directory,asset.file),bytes);
    writeVerified(path.join(directory,"manifest.json"),manifestBytes);
    console.log(`Exported ${collected.length} canonical answer PNGs, ${collected.reduce((n,item)=>n+item.bytes.length,0)} bytes. Source types remain locked.`);
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode=1; });
