// 화면 캡처: OUT=<폴더> BOOK=book-04 ONLY=<단원id,단원id> node capture-lessons.mjs  (정적 서버를 저장소 루트에서 PORT(기본 8797)로 먼저 띄울 것. 답안 서버는 401로 막아 공개 화면만 찍는다.)
import { chromium } from 'playwright-core';
const out = process.env.OUT, book = process.env.BOOK || 'book-02';
const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await b.newPage({ viewport: { width: 1180, height: 900 } });
const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.route('**/functions/v1/**', r => r.fulfill({ status: 401, contentType: 'application/json', body: '{"error":"login_required"}' }));
// 캡처 전용: 모듈 안의 상태와 render를 밖에서 부를 수 있게 한다(저장소 코드는 바꾸지 않음).
await page.route('**/golden-bell.js*', async (r) => { const res = await r.fetch(); const body = await res.text(); await r.fulfill({ response: res, body: body + '\nwindow.__gb = { state, render };' }); });
await page.goto(`http://127.0.0.1:${process.env.PORT || 8797}/fields-classic/question-bank/golden-bell.html?student=CAP&book=${book}`, { waitUntil: 'networkidle' });
await page.addStyleTag({ content: 'header,.gold-header,.app-header{position:static!important}' });
const lessons = (await page.locator('.lesson-button[data-lesson]').evaluateAll(els => els.map(e => e.dataset.lesson))).filter(id => !process.env.ONLY || process.env.ONLY.split(',').includes(id));
let shots = 0;
for (const [i, id] of lessons.entries()) {
  await page.locator(`.lesson-button[data-lesson="${id}"]`).click();
  await page.locator('[data-next-phase="original"]').first().click().catch(() => {});
  await page.waitForTimeout(200);
  const count = await page.evaluate(() => (window.__gb.state.lessonId, document.querySelectorAll('.source-question-progress span').length));
  for (let q = 0; q < Math.max(1, count); q++) {
    await page.evaluate((q) => { window.__gb.state.originalIndex = q; window.__gb.render(); }, q);
    await page.waitForTimeout(100);
    await page.locator('.lesson-content').screenshot({ path: `${out}/L${String(i).padStart(2, '0')}-${id}-q${String(q + 1).padStart(2, '0')}.png` });
    shots++;
  }
}
console.log('lessons', lessons.length, 'shots', shots, 'errors', errors);
await b.close();
