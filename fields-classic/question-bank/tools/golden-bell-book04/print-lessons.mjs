// 인쇄 PDF: OUT=<폴더> BOOK=book-04 LESSONS=<단원id,단원id> node print-lessons.mjs  (학습지 모드 인쇄. 답안 없이 문제지만 나온다.)
import { chromium } from 'playwright-core';
const out = process.env.OUT;
const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await b.newPage({ viewport: { width: 1180, height: 900 } });
const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.route('**/functions/v1/**', r => r.fulfill({ status: 401, contentType: 'application/json', body: '{"error":"login_required"}' }));
await page.goto(`http://127.0.0.1:${process.env.PORT || 8797}/fields-classic/question-bank/golden-bell.html?student=CAP&book=${process.env.BOOK || 'book-04'}`, { waitUntil: 'networkidle' });
await page.evaluate(() => { window.print = () => {}; });
for (const id of (process.env.LESSONS || 'balance-order').split(',')) {
  await page.locator(`.lesson-button[data-lesson="${id}"]`).click();
  await page.locator('#printLessonButton').click();
  await page.waitForFunction(() => (document.querySelector('#printStatus')?.textContent || '').startsWith('A4 '), null, { timeout: 120000 }).catch(() => {});
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: `${out}/${id}.pdf`, format: 'A4', printBackground: true });
  await page.emulateMedia({ media: 'screen' });
}
console.log('errors', errors);
await b.close();
