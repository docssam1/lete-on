import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { domains, problemsFor, answerFor } from './core.js';
const base=process.env.GFIELD_BASE_URL || 'http://127.0.0.1:8765';
const browser=await chromium.launch();
try {
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`${base}/geometry/shape-garden/`);await page.waitForSelector('#circleLevels a');
  await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  await context.setOffline(true);
  for(const lang of ['ko','en','zh','ja'])for(const domain of domains) {
    await page.goto(`${base}/geometry/games/circle-studio/?domain=${domain.id}&level=${domain.level}&practice=1&lang=${lang}`);
    await page.waitForSelector('#board svg');assert.equal(await page.locator('#title').textContent(),domain.names[lang]);
    const id=await page.locator('#board').getAttribute('data-problem-id'),p=problemsFor(domain.id).find(p=>p.id===id),a=answerFor(p);
    if(domain.id==='center')await page.locator(`[data-point="${a}"]`).click();
    if(domain.id==='parts')for(const id of a)await page.locator(`#choice-${id}`).check();
    if(domain.id==='measure')await page.locator('#length').fill(String(a));
    if(domain.id==='draw') {
      await page.locator(`[data-point="${a.center}"]`).click();for(let i=1;i<a.radius;i++)await page.locator('#increase').click();
      await page.locator('#trace').click();assert.equal(await page.locator('[data-trace="complete"]').count(),1);
    }
    await page.locator('#check').click();assert.equal(await page.locator('#review').isVisible(),true);
  }
  assert.deepEqual(errors,[]);
  const report={passed:true,offlineDomains:4,languages:4,correctSubmissions:16,freshGardenInstallFirstGameEntry:true,scope:'Fresh context visits garden only before going offline; no game dependency warming',errors};
  await mkdir(new URL('./qa-artifacts/',import.meta.url),{recursive:true});await writeFile(new URL('./qa-artifacts/offline-report.json',import.meta.url),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
} finally {await browser.close();}
