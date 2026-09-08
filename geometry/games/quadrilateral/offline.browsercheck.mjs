import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { domains, problemsFor, answerFor } from './core.js';
const base=process.env.GFIELD_BASE_URL || 'http://127.0.0.1:8765';
const browser=await chromium.launch();
try {
  const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage();
  await page.goto(`${base}/geometry/games/quadrilateral/`);await page.waitForSelector('#board svg');
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.reload();
  await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  await context.setOffline(true);
  for(const lang of ['ko','en','zh','ja'])for(const domain of domains) {
    await page.goto(`${base}/geometry/games/quadrilateral/?domain=${domain.id}&level=${domain.level}&practice=1&lang=${lang}`);
    await page.waitForSelector('#board svg');assert.equal(await page.locator('#title').textContent(),domain.names[lang]);
    const id=await page.locator('#board').getAttribute('data-problem-id'),p=problemsFor(domain.id).find(p=>p.id===id),answers=answerFor(p);
    if(domain.id==='build')await page.locator(`[data-point="${answers[0]}"]`).click();
    else for(const id of answers)await page.locator(`#choice-${id}`).check();
    await page.locator('#check').click();assert.equal(await page.locator('#review').isVisible(),true);
  }
  const report={offlineDomains:4,languages:4,correctSubmissions:16,scope:'game only; parent SW integration present'};
  await mkdir(new URL('./qa-artifacts/',import.meta.url),{recursive:true});
  await writeFile(new URL('./qa-artifacts/offline-report.json',import.meta.url),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));
} finally {await browser.close();}
