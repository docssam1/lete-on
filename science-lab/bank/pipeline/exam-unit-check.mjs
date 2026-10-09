// 로컬 서버를 먼저 띄운다: (저장소 뿌리에서) python3 -m http.server 8765 · node science-lab/bank/pipeline/exam-unit-check.mjs <단원id>
// Playwright 경로는 이 작업 환경 기준이다. 다른 환경이면 import 줄을 'playwright'로 바꾼다.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const B = 'http://localhost:8765/science-lab/v2/', u = process.argv[2];
const br = await chromium.launch({ args: ['--use-gl=swiftshader'] });
for (const vp of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
  const pg = await br.newPage({ viewport: vp }), errs = [];
  pg.on('console', (m) => m.type() === 'error' && !/CERT_AUTHORITY/.test(m.text()) && errs.push(m.text())); pg.on('pageerror', (e) => errs.push(String(e)));
  await pg.goto(B + '#/bank'); await pg.waitForTimeout(900);
  const row = pg.locator('.bank-units li.exam'); console.log(vp.width, 'exam rows', await row.count(), (await row.first().innerText().catch(() => '')).replace(/\n/g, ' '));
  await pg.goto(B + `#/${u}/exam/2`); await pg.waitForTimeout(900); console.log(vp.width, 'exam dots', await pg.locator('.dt-dots li').count());
  await pg.goto(B + `#/${u}/sub/E2`); await pg.waitForTimeout(900); console.log(vp.width, 'sub items', await pg.locator('.card.item').count(), 'overflow', await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth));
  console.log('errors', errs); await pg.close();
}
await br.close();
