// 다양한 생물과 우리 생활 실험실 — 반죽에 넣을 물의 온도를 골라 「발효시키기」(40분) → 부푼 부피를 표에 적는다.
// 원본 5-C 「효모빵 만들기」(찬물 vs 따뜻한 물 약 40 ℃). 뜨거운 물(70 ℃)은 확장 조건. 부피는 원본 결과의 순서를 따르는 모형 값.
import { WATERS, TEMPS, START, MINUTES, breadModel, volAt } from '../scenes/bread-model.js';
export { WATERS, TEMPS, breadModel };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const SHORT = ['찬물 10 ℃', '따뜻한 물 40 ℃', '뜨거운 물 70 ℃'];
const DUR = 5;   // 40분을 5초에(빨리 감기)

export async function mountBread(el, opts = {}) {
  let engine, rig, stage;
  try { const [E, M] = await Promise.all([import('../engine.js'), import('../scenes/bread-dough.js')]); engine = E; rig = M; if (opts.force2D || !E.Stage.canWebGL()) rig = null; } catch { rig = null; }
  if (!el.isConnected) return {};
  const rows = (opts.rows || []).slice();
  let ci = 1, running = false, completed = false, t = 0, dead = false, timer = null;
  el.innerHTML = `<div class="modes" role="group" aria-label="반죽에 넣을 물"><span class="lab-lbl">물</span>${SHORT.map((v, i) => `<button type="button" data-water="${i}" title="${esc(WATERS[i])}">${esc(v)}</button>`).join('')}</div>
    <div class="lab3d">${rig ? '<canvas aria-label="부푸는 효모빵 반죽 3D 실험. 물의 온도를 바꾸어 반죽이 부푸는 정도를 비교해요."></canvas>'
      : '<div class="bread-2d" role="img" aria-label="부푸는 반죽 2D 관찰"><div class="bd-cup"><i class="bd-dough"></i><b class="bd-mark" style="--ml:200">200</b><b class="bd-mark" style="--ml:400">400</b></div><em class="bd-clock">0분</em></div>'}
      <p class="lab3d-tip" data-tip aria-live="polite">물의 온도를 고르고 「발효시키기」를 눌러요.</p>
      <div class="lab3d-btns"><button type="button" class="btn primary" data-run>발효시키기</button><button type="button" class="btn" data-record disabled>표에 적기</button></div></div>
    <p class="bd-model-note">밀가루·설탕·효모의 양은 늘 같고, 반죽에 넣는 물의 온도만 달라요. 처음 반죽은 200 mL, 따뜻한 곳에 40분 둬요. 부피는 원본 실험의 결과 순서(따뜻한 물 &gt; 찬물)를 따르는 모형 값이고, 뜨거운 물(70 ℃)은 「효모가 너무 뜨거우면 죽는다」를 보여 주는 덧붙인 조건이에요.</p>
    <table class="lab-table"><thead><tr><th>반죽에 넣은 물</th><th>40분 뒤 부피</th><th>반죽 모습</th></tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), tip = (s) => { $('[data-tip]').textContent = s; }, record = $('[data-record]'), run = $('[data-run]');
  let model;
  if (rig) {
    try { stage = new engine.Stage($('canvas')); model = rig.buildBreadRig({ cups: [ci] }); stage.root.add(model); stage.setView({ theta: 0.22, phi: 1.2, frame: [[-0.9, 0, -0.8], [1.1, 2.3, 1.0]] }); }
    catch { el.querySelector('canvas')?.remove(); stage?.dispose(); return mountBread(el, { ...opts, force2D: true }); }
  }
  const drawRows = () => { $('tbody').innerHTML = rows.map((r) => `<tr><td>${esc(r.water)}</td><td>${esc(r.vol)} mL (${r.ratio === 1 ? '처음과 같음' : `처음의 ${esc(r.ratio)}배`})</td><td>${esc(r.shape)}</td></tr>`).join(''); };
  const show = (min, tt = 0) => {
    if (model) model.userData.set({ waters: [ci], min, t: tt });
    else { const box = $('.bread-2d'); box.style.setProperty('--ml', String(volAt(WATERS[ci], min))); $('.bd-clock').textContent = `${Math.round(min)}분`; }
  };
  const press = () => el.querySelectorAll('[data-water]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.water) === ci)));
  function choose() { clearInterval(timer); t = 0; running = false; completed = false; record.disabled = true; run.disabled = false; show(0); press(); tip(`${WATERS[ci]}로 만든 반죽 200 mL. 「발효시키기」를 눌러 40분 지켜봐요.`); }
  function done() {
    running = false; completed = true; run.disabled = false; record.disabled = false; show(MINUTES, t);
    const m = breadModel(WATERS[ci]);
    tip(ci === 2 ? '40분이 지나도 그대로예요. 물이 너무 뜨거워 효모가 죽었어요. 표에 적어요.' : `40분 뒤 ${m.vol} mL — 처음의 ${m.ratio}배예요. 표에 적고 다른 물과 비교해요.`);
  }
  const step = (dt) => { t += dt; const min = Math.min(MINUTES, t / DUR * MINUTES); show(min, t); if (Math.round(min) % 10 === 0 && min < MINUTES) tip(`발효 중 · ${Math.round(min)}분 지남`); if (t >= DUR) done(); };
  run.onclick = () => {
    if (running || dead) return; completed = false; record.disabled = true; run.disabled = true; running = true; t = 0; tip('발효 중 · 따뜻한 곳에 두었어요.');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { t = DUR; done(); return; }
    if (!stage) timer = setInterval(() => { if (dead) { clearInterval(timer); return; } if (opts.isActive && !opts.isActive()) return; step(0.1); if (!running) clearInterval(timer); }, 100);
  };
  record.onclick = () => { if (!completed || running || dead) return; rows.push({ water: WATERS[ci], ...breadModel(WATERS[ci]) }); drawRows(); opts.onRecord?.(rows.slice()); };
  el.querySelectorAll('[data-water]').forEach((b) => { b.onclick = () => { ci = Number(b.dataset.water); choose(); }; });
  if (stage) stage.update = (dt) => {
    if (dead || (opts.isActive && !opts.isActive())) return;
    if (running) step(dt); else if (completed) { t += dt; show(MINUTES, t); }
  };
  const dispose = () => { if (dead) return; dead = true; clearInterval(timer); stage?.dispose(); };
  if (engine) engine.watchDetached(el, dispose);
  else { const ob = new MutationObserver(() => { if (!el.isConnected) { ob.disconnect(); dispose(); } }); ob.observe(document.body, { childList: true, subtree: true }); }
  choose(); drawRows(); return { rows, dispose };
}
export async function mountBread2D(el, opts = {}) { return mountBread(el, { ...opts, force2D: true }); }
