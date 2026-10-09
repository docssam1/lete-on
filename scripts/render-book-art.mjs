// 교재 도판 렌더: science-lab/tools/book-art.html?shot=… 을 헤드리스 크로미엄으로 열어 webp로 저장한다.
// 사용: node scripts/render-book-art.mjs [shot…]   (로컬 서버 http://localhost:8765 필요: python3 -m http.server 8765)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
const OUT = new URL('../science-lab/assets/book/', import.meta.url).pathname;
const SHOTS = process.argv.slice(2).length ? process.argv.slice(2) : ['hero', 'sizes', 'sun-start', 'sun-oil', 'sun-drop', 'sun-mid', 'sun-top', 'sun-shake', 'sun-row'];
fs.mkdirSync(OUT, { recursive: true });
const br = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const s of SHOTS) {
  const p = await br.newPage({ viewport: { width: 1900, height: 1300 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`http://localhost:8765/science-lab/tools/book-art.html?shot=${s}`); await p.waitForFunction(() => window.__done, null, { timeout: 120000 });
  const url = await p.evaluate(() => document.getElementById('out').toDataURL('image/png'));
  const unit = /^bubble/.test(s) ? 's52-u01' : /^(bread|mold)/.test(s) ? 's51-u05' : /^(snow|float)/.test(s) ? 's51-u04' : 's51-u03', png = `${OUT}${unit}-${s}.png`; fs.writeFileSync(png, Buffer.from(url.split(',')[1], 'base64'));
  execFileSync('python3', ['-c', `from PIL import Image; im=Image.open('${png}').convert('RGB'); im.save('${png.replace('.png', '.webp')}','WEBP',quality=86,method=6)`]); fs.unlinkSync(png);
  console.log(s, errs.length ? errs : 'ok'); await p.close();
}
await br.close();
