// 물의 여행 실험실 — 전등(햇빛) 세기와 뚜껑 위 얼음을 골라 「전등 켜기」 → 증발 · 응결 · 비를 관찰하고 표에 적는다.
// 원본 6-B 「컵 속에 내리는 비」(따뜻한 물 + 차가운 뚜껑)를 뚜껑 덮은 수조 속 작은 지구로. 수치가 아니라 비가 내리는 단계로 비교한다.
import { SUNS, LIDS, RAIN, cycleModel } from '../scenes/water-cycle-model.js';
export { SUNS, LIDS, RAIN, cycleModel };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const group = (label, key, list) => `<div class="modes" role="group" aria-label="${label}">${list.map((v) => `<button type="button" data-${key}="${v}">${v}</button>`).join('')}</div>`;
const DUR = 6;   // 전등을 켜 두는 연출 시간(초)

export async function mountCycle(el, opts = {}) {
  let engine, rig, stage;
  try { const [E, M] = await Promise.all([import('../engine.js'), import('../scenes/water-cycle.js')]); engine = E; rig = M; if (opts.force2D || !E.Stage.canWebGL()) rig = null; } catch { rig = null; }
  if (!el.isConnected) return {};
  const rows = (opts.rows || []).slice();
  let sun = SUNS[1], lid = LIDS[1], running = false, completed = false, t = 0, dead = false, timer = null;
  el.innerHTML = `${group('전등(햇빛) 세기', 'sun', SUNS)}${group('뚜껑 위', 'lid', LIDS)}
    <div class="lab3d">${rig ? '<canvas aria-label="물의 여행 3D 실험. 뚜껑 덮은 수조 속 바다를 전등으로 데우고 뚜껑 아래를 관찰해요."></canvas>'
      : '<div class="cycle-2d" role="img" aria-label="물의 순환 2D 관찰"><span class="cy-sun">💡</span><span class="cy-ice">🧊</span><i class="cy-lid"></i><span class="cy-rain"></span><i class="cy-sea"></i><i class="cy-land"></i></div>'}
    <p class="lab3d-tip" data-tip aria-live="polite">전등 세기와 뚜껑 위 얼음을 고르고 「전등 켜기」를 눌러요.</p>
    <div class="lab3d-btns"><button type="button" class="btn primary" data-run>전등 켜기</button><button type="button" class="btn" data-record disabled>표에 적기</button></div></div>
    <p class="cy-model-note">수조 속 물은 밖으로 나갈 수 없어요. 실제로는 몇 시간이 걸리는 변화를 몇 초로 줄여 보여 주는 모형이에요. 수증기는 눈에 보이지 않아 화살표로 나타냈어요.</p>
    <table class="lab-table"><thead><tr><th>전등</th><th>뚜껑 위</th><th>관찰한 모습</th></tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), tip = (s) => { $('[data-tip]').textContent = s; }, record = $('[data-record]'), run = $('[data-run]');
  let model;
  if (rig) {
    try { stage = new engine.Stage($('canvas')); model = rig.buildWaterCycle(); stage.root.add(model); stage.setView({ theta: 0.22, phi: 1.28, frame: [[-3.4, 0, -0.9], [2.6, 4.2, 0.9]] }); }
    catch { el.querySelector('canvas')?.remove(); stage?.dispose(); return mountCycle(el, { ...opts, force2D: true }); }
  }
  const drawRows = () => { $('tbody').innerHTML = rows.map((r) => `<tr><td>${esc(r.sun)}</td><td>${esc(r.lid)}</td><td>${esc(r.result)}</td></tr>`).join(''); };
  // p: 0(꺼짐)~1(끝) 진행에 맞춘 모습. tt: 비·강물 움직임용 시간
  const show = (p, tt = 0) => {
    const m = cycleModel(sun, lid);
    if (model) model.userData.set({ sun, lid, run: p, t: tt, trace: -1 });
    else {
      const box = $('.cycle-2d'); box.dataset.on = p > 0 ? '1' : '0'; box.dataset.ice = lid === LIDS[1] ? '1' : '0'; box.dataset.sun = sun === SUNS[1] ? '1' : '0';
      box.dataset.stage = p >= 1 ? m.stage : 0; $('.cy-rain').textContent = p >= 1 ? ['', '💧', '💧💧💧'][m.stage] : '';
    }
  };
  const press = () => { for (const [k, v] of [['sun', sun], ['lid', lid]]) el.querySelectorAll(`[data-${k}]`).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset[k] === v))); };
  function choose() { clearInterval(timer); t = 0; running = false; completed = false; record.disabled = true; run.disabled = false; show(0); press(); tip(`전등 ${sun} · 뚜껑 위 ${lid}. 「전등 켜기」를 눌러 관찰해요.`); }
  function done() {
    running = false; completed = true; run.disabled = false; record.disabled = false; show(1, t);
    const m = cycleModel(sun, lid);
    tip(m.stage === 0 ? '뚜껑 아래에 작은 물방울만 맺혔어요. 비는 내리지 않았어요. 표에 적고 조건을 바꿔 비교해요.' : `${RAIN[m.stage]}. 표에 적고 한 조건만 바꿔 비교해요.`);
  }
  run.onclick = () => {
    if (running || dead) return; completed = false; record.disabled = true; run.disabled = true; running = true; t = 0; tip('전등이 바닷물을 데우는 중이에요. 뚜껑 아래를 지켜봐요.');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) done();
    else if (!stage) { timer = setInterval(() => { if (dead) { clearInterval(timer); return; } if (opts.isActive && !opts.isActive()) return; t += 0.1; show(Math.min(1, t / DUR), t); if (t >= DUR) { clearInterval(timer); done(); } }, 100); }
  };
  record.onclick = () => { if (!completed || running || dead) return; rows.push({ sun, lid, ...cycleModel(sun, lid) }); drawRows(); opts.onRecord?.(rows.slice()); };
  for (const [k, set] of [['sun', (v) => { sun = v; }], ['lid', (v) => { lid = v; }]]) el.querySelectorAll(`[data-${k}]`).forEach((b) => { b.onclick = () => { set(b.dataset[k]); choose(); }; });
  // 실험이 끝난 뒤에도 비와 강물은 계속 움직인다(멈춘 그림처럼 보이지 않게). 버튼 전에는 아무것도 움직이지 않는다
  if (stage) stage.update = (dt) => {
    if (dead || (opts.isActive && !opts.isActive())) return;
    if (running) { t += dt; show(Math.min(1, t / DUR), t); if (t >= DUR) done(); }
    else if (completed && !matchMedia('(prefers-reduced-motion: reduce)').matches) { t += dt; show(1, t); }
  };
  const dispose = () => { if (dead) return; dead = true; clearInterval(timer); stage?.dispose(); };
  if (engine) engine.watchDetached(el, dispose);
  else { const ob = new MutationObserver(() => { if (!el.isConnected) { ob.disconnect(); dispose(); } }); ob.observe(document.body, { childList: true, subtree: true }); }
  choose(); drawRows(); return { rows, dispose };
}
export async function mountCycle2D(el, opts = {}) { return mountCycle(el, { ...opts, force2D: true }); }
