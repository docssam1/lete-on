// 임시 공원 그림 렌더: (저장소 뿌리에서 python3 -m http.server 8765) NODE_PATH=/opt/node22/lib/node_modules node science-lab/tools/park/render.mjs
// → science-lab/assets/park/park-wide-placeholder.jpg · park-tall-placeholder.jpg(지금 쓰는 그림은 GPT 조감도 .webp) + 지점 좌표(콘솔). GPT 그림이 오면 이 파일들을 바꾸고 data/park-map.js 좌표를 다시 잡는다.
import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)('playwright');
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const only = process.argv[2];
for (const [tag, W, H] of [['wide', 2560, 1440], ['tall', 1440, 2560]].filter(([t]) => !only || t === only)) {
  const p = await (await b.newContext({ viewport: { width: W, height: H } })).newPage();
  await p.goto(`http://127.0.0.1:8765/science-lab/tools/park/render.html?r=${Math.random()}${tag === 'tall' ? '#tall' : ''}`, { timeout: 120000 }); await p.waitForTimeout(6000);
  await p.locator('#c').screenshot({ path: `science-lab/assets/park/park-${tag}-placeholder.jpg`, type: 'jpeg', quality: 86, timeout: 180000 });
  console.log(tag, JSON.stringify(await p.evaluate(() => window.spots()))); await p.close();
}
await b.close();
