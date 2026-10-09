// 로컬 서버를 먼저 띄운다: (저장소 뿌리에서) python3 -m http.server 8765 · node science-lab/bank/pipeline/lesson-routes.mjs <단원id>
// Playwright 경로는 이 작업 환경 기준이다. 다른 환경이면 import 줄을 'playwright'로 바꾼다.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const B = 'http://localhost:8765/science-lab/v2/', u = process.argv[2];
const br = await chromium.launch({ args: ['--use-gl=swiftshader'] });
const pg = await br.newPage({ viewport: { width: 1280, height: 900 } }), errs = [];
pg.on('pageerror', (e) => errs.push(e.message)); pg.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
for (const r of ['start', 'book', 'self', 'diagnose', 'drill', 'exam/1']) {
  await pg.goto(`${B}#/${u}/${r}`); await pg.waitForTimeout(1800);
  const txt = (await pg.locator('main, body').first().innerText()).replace(/\s+/g, ' ').slice(0, 70);
  console.log(r, '|', txt);
}
console.log('errors', errs.slice(0, 5)); await br.close();
