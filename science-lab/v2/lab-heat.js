// 온도와 열 실험실 — 띠의 재료와 물의 온도를 골라 「담그기」 → 2분 뒤 물 위 시온 스티커 몇 칸이 변했는지 표에 적는다.
// 원본 4-D 「눈에 보이는 열」. 칸 수는 원본 결과의 순서(구리 > 알루미늄 > OHP 필름)를 따르는 모형 값이다.
import { MATERIALS, WATERS, CELLS, heatModel } from '../scenes/heat-model.js';
export { MATERIALS, WATERS, CELLS, heatModel };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const group = (label, key, list) => `<div class="modes" role="group" aria-label="${label}"><span class="lab-lbl">${label}</span>${list.map((v) => `<button type="button" data-${key}="${v}">${v}</button>`).join('')}</div>`;
const DUR = 4;   // 「2분」을 줄인 연출 시간(초)

export async function mountHeat(el, opts = {}) {
  let engine, rig, stage;
  try { const [E, M] = await Promise.all([import('../engine.js'), import('../scenes/heat-strips.js')]); engine = E; rig = M; if (opts.force2D || !E.Stage.canWebGL()) rig = null; } catch { rig = null; }
  if (!el.isConnected) return {};
  const rows = (opts.rows || []).slice();
  let material = MATERIALS[0], water = WATERS[1], running = false, completed = false, t = 0, dead = false, timer = null;
  el.innerHTML = `${group('띠', 'material', MATERIALS)}${group('물', 'water', WATERS)}
    <div class="lab3d">${rig ? '<canvas aria-label="온도와 열 3D 실험. 시온 스티커를 붙인 띠를 물에 담그고 색이 변하는 칸을 관찰해요."></canvas>'
      : `<div class="heat-2d" role="img" aria-label="시온 스티커 2D 관찰"><div class="ht-strip">${Array.from({ length: CELLS + 2 }, () => '<i></i>').join('')}</div><span class="ht-water"></span></div>`}
      <p class="lab3d-tip" data-tip aria-live="polite">띠와 물을 고르고 「담그기」를 눌러요.</p>
      <div class="lab3d-btns"><button type="button" class="btn primary" data-run>담그기(2분)</button><button type="button" class="btn" data-record disabled>표에 적기</button></div></div>
    <p class="ht-model-note">시온 스티커는 40 ℃보다 낮으면 파랑, 40~60 ℃ 주황, 60 ℃ 이상 노랑이에요. 물 위 6칸 중 색이 변한 칸을 세요. 칸 수는 원본 실험의 결과 순서를 따르는 모형 값이에요.</p>
    <table class="lab-table"><thead><tr><th>띠</th><th>물</th><th>2분 뒤 모습</th></tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), tip = (s) => { $('[data-tip]').textContent = s; }, record = $('[data-record]'), run = $('[data-run]');
  let model;
  if (rig) {
    try { stage = new engine.Stage($('canvas')); model = rig.buildHeat(); stage.root.add(model); stage.setView({ theta: 0.3, phi: 1.22, frame: [[-2.3, 0, -0.9], [-0.3, 3.6, 0.9]] }); }
    catch { el.querySelector('canvas')?.remove(); stage?.dispose(); return mountHeat(el, { ...opts, force2D: true }); }
  }
  const drawRows = () => { $('tbody').innerHTML = rows.map((r) => `<tr><td>${esc(r.material)}</td><td>${esc(r.water)}</td><td>${esc(r.result)}</td></tr>`).join(''); };
  const show = (p, tt = 0) => {
    if (model) model.userData.set({ water, p, t: tt, only: material, conv: false });
    else {
      const m = heatModel(material, water), box = $('.heat-2d'); box.dataset.hot = water === WATERS[1] ? '1' : '0';
      [...el.querySelectorAll('.ht-strip i')].forEach((c, k) => { c.dataset.c = k < 2 ? (p > 0 ? (water === WATERS[1] ? 2 : 1) : 0) : (k - 2 < m.yellow * (p >= 1 ? 1 : 0) ? 2 : k - 2 < m.changed * (p >= 1 ? 1 : 0) ? 1 : 0); });
    }
  };
  const press = () => { for (const [k, v] of [['material', material], ['water', water]]) el.querySelectorAll(`[data-${k}]`).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset[k] === v))); };
  function choose() { clearInterval(timer); t = 0; running = false; completed = false; record.disabled = true; run.disabled = false; show(0); press(); tip(`${material} · ${water}. 「담그기」를 눌러 2분 동안 관찰해요.`); }
  function done() {
    running = false; completed = true; run.disabled = false; record.disabled = false; show(1, t);
    const m = heatModel(material, water);
    tip(m.changed ? `${m.result}. 표에 적고 띠나 물을 바꿔 비교해요.` : 'OHP 필름은 물에 잠긴 칸만 변하고 물 위는 그대로예요. 표에 적어요.');
  }
  run.onclick = () => {
    if (running || dead) return; completed = false; record.disabled = true; run.disabled = true; running = true; t = 0; tip('담그는 중이에요. 물 위 칸을 지켜봐요.');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) done();
    else if (!stage) { timer = setInterval(() => { if (dead) { clearInterval(timer); return; } if (opts.isActive && !opts.isActive()) return; t += 0.1; show(Math.min(1, t / DUR), t); if (t >= DUR) { clearInterval(timer); done(); } }, 100); }
  };
  record.onclick = () => { if (!completed || running || dead) return; rows.push({ material, water, ...heatModel(material, water) }); drawRows(); opts.onRecord?.(rows.slice()); };
  for (const [k, set] of [['material', (v) => { material = v; }], ['water', (v) => { water = v; }]]) el.querySelectorAll(`[data-${k}]`).forEach((b) => { b.onclick = () => { set(b.dataset[k]); choose(); }; });
  if (stage) stage.update = (dt) => {
    if (dead || (opts.isActive && !opts.isActive())) return;
    if (running) { t += dt; show(Math.min(1, t / DUR), t); if (t >= DUR) done(); }
    else if (completed && water === WATERS[1]) { t += dt; show(1, t); }   // 김은 계속 오른다
  };
  const dispose = () => { if (dead) return; dead = true; clearInterval(timer); stage?.dispose(); };
  if (engine) engine.watchDetached(el, dispose);
  else { const ob = new MutationObserver(() => { if (!el.isConnected) { ob.disconnect(); dispose(); } }); ob.observe(document.body, { childList: true, subtree: true }); }
  choose(); drawRows(); return { rows, dispose };
}
export async function mountHeat2D(el, opts = {}) { return mountHeat(el, { ...opts, force2D: true }); }
