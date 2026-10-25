// 3D 표본을 흰 바탕에 크게 렌더한다 — 예시 보고서 연필 스케치의 원본(tools/sketch/build.py가 이어받음).
// 사용: (저장소 뿌리에서 python3 -m http.server 8765) node science-lab/tools/sketch/render.mjs science-lab/tools/sketch/jobs.json <출력 폴더> [이름…]
// 일감: { name, set, spec, place?(날짜·장소 단추 번호), theta, phi, hide?(무대 뿌리 자식 번호), keep?(이것만 남김), margin? }
import { createRequire } from 'module';
import fs from 'fs';
// playwright는 전역 설치본을 쓴다(NODE_PATH=/opt/node22/lib/node_modules)
const { chromium } = createRequire(import.meta.url)('playwright');
const [, , jobFile, OUT, ...only] = process.argv;
const jobs = JSON.parse(fs.readFileSync(jobFile, 'utf8')).filter((j) => !only.length || only.includes(j.name));
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await (await b.newContext({ viewport: { width: 1400, height: 1100 }, deviceScaleFactor: 2 })).newPage();
const errs = []; p.on('pageerror', (e) => errs.push(e.message));
let lastSet = '';
for (const j of jobs) {
  if (j.set !== lastSet) {
    await p.goto(`http://127.0.0.1:8765/science-lab/?r=${Math.random()}#/observe/${j.set}`); await p.waitForTimeout(2200); lastSet = j.set;
    await p.addStyleTag({ content: '.ob-stage{width:1200px!important;height:900px!important;max-width:none!important;aspect-ratio:auto!important} .ob-grid{display:block!important} .ob-viewer{width:1240px!important;max-width:none!important}' });
    await p.waitForTimeout(300);
  }
  await p.click(`[data-spec="${j.spec}"]`); await p.waitForTimeout(700);
  if (j.place != null) { await p.locator('[data-place]').nth(j.place).click(); await p.waitForTimeout(600); }
  await p.evaluate((j) => {
    const st = window.__obStage; st.renderer.setPixelRatio(2); st._resize();
    st.scene.background = null; st.renderer.setClearColor(0xffffff, 1);
    st.scene.children.forEach((c) => { if (c.isMesh && c.renderOrder < 0) c.visible = false; });
    const base = st.root.children[0];
    st.root.traverse((o) => { if (o.isSprite) o.visible = false; });
    (j.hide || []).forEach((i) => { if (base.children[i]) base.children[i].visible = false; });
    if (j.keep) base.children.forEach((c, i) => { if (!j.keep.includes(i)) c.visible = false; });
    st.fitMargin = j.margin ?? 0.92; st.setView({ theta: j.theta, phi: j.phi, dist: 8, target: [0, 0.6, 0] }); st._userZoom = false; st._needFit = true;
  }, j);
  await p.waitForTimeout(1800);
  await p.locator('.ob-stage canvas').screenshot({ path: `${OUT}/${j.name}.png` });
  console.log('ok', j.name);
}
if (errs.length) console.log('errs', errs);
await b.close();
