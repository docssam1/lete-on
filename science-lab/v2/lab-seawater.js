// 지구와 바다 실험실 — 증발 접시 두 개(바닷물·수돗물). 물의 양을 고르고 「가열하기」 → 물이 다 날아간 뒤 남은 것을 읽고 표에 적는다.
// 남는 양은 모형 값이다(scenes/seawater-model.js — 바닷물 약 3.5 %). 실제 바닷물은 장소에 따라 조금씩 다르다.
import { WATERS, AMOUNTS, evapRow } from '../scenes/seawater-model.js';
export { WATERS, AMOUNTS, evapRow };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const DUR = 4.2;

export async function mountSeawater(el, opts = {}) {
  let engine, rig, stage;
  try { const [E, M] = await Promise.all([import('../engine.js'), import('../scenes/evap-dishes.js')]); engine = E; rig = M; if (opts.force2D || !E.Stage.canWebGL()) rig = null; } catch { rig = null; }
  if (!el.isConnected) return {};
  const rows = (opts.rows || []).slice();
  let ml = 20, running = false, t = 0, dead = false, timer = null, ran = false, written = false;
  el.innerHTML = `<div class="modes" role="group" aria-label="물의 양"><span class="lab-lbl">물의 양</span>${AMOUNTS.map((v) => `<button type="button" data-ml="${v}">${v} mL</button>`).join('')}</div>
    <div class="lab3d">${rig ? '<canvas aria-label="증발 접시 두 개 3D. 왼쪽 바닷물, 오른쪽 수돗물을 같은 양 담아 가열해요."></canvas>'
      : `<div class="sw-2d" role="img" aria-label="증발 접시 두 개 2D 모형">${WATERS.map((w) => `<span class="sw-dish" data-w="${w}"><b>${w}</b><i data-d></i></span>`).join('')}</div>`}
      <p class="lab3d-tip" data-tip aria-live="polite"></p>
      <ul class="sw-read">${WATERS.map((w) => `<li><b>${w}</b> <span data-res="${w}">?</span></li>`).join('')}</ul>
      <div class="lab3d-btns"><button type="button" class="btn primary" data-run>가열하기</button><button type="button" class="btn" data-record disabled>표에 적기</button><button type="button" class="btn ghost" data-reset>처음으로</button></div></div>
    <p class="sw-note">두 접시에 같은 양을 담고 같은 전열기로 가열해요. 남는 양은 모형 값이에요(바닷물에 소금 같은 물질이 약 3.5 % 녹아 있다고 보고 계산). 실제로는 선생님이 가열하고, 뜨거운 접시는 식은 뒤에 살펴봐요.</p>
    <table class="lab-table"><thead><tr><th>물의 양</th>${WATERS.map((w) => `<th>${w} 접시에 남은 것</th>`).join('')}</tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), tip = (s) => { $('[data-tip]').textContent = s; }, record = $('[data-record]'), run = $('[data-run]');
  let model;
  if (rig) {
    try { stage = new engine.Stage($('canvas')); model = rig.buildEvapBench(); stage.root.add(model); stage.setView({ theta: 0, phi: 1.0, frame: [[-1.7, 0, -0.6], [1.7, 1.2, 0.6]] }); }
    catch { el.querySelector('canvas')?.remove(); stage?.dispose(); return mountSeawater(el, { ...opts, force2D: true }); }
  }
  const drawRows = () => { $('tbody').innerHTML = rows.map((r) => `<tr><th scope="row">${r.ml} mL</th>${WATERS.map((w) => `<td>${esc(r[w])}</td>`).join('')}</tr>`).join(''); };
  const read = (known) => { const r = evapRow(ml); WATERS.forEach((w) => { $(`[data-res="${w}"]`).textContent = known ? r[w] : '?'; const d = el.querySelector(`.sw-dish[data-w="${w}"] [data-d]`); if (d) d.textContent = known ? r[w] : `${ml} mL`; }); };
  const show = (p, heat) => { if (model) model.userData.set({ ml, p, heat }); };
  const press = () => el.querySelectorAll('[data-ml]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.ml) === ml)));
  const btn = () => { run.disabled = running || ran; record.disabled = running || !ran || written; };
  function pick(v) { clearInterval(timer); running = false; ml = v; t = 0; ran = false; written = false; show(0, 0); read(false); press(); btn();
    tip(`두 접시에 물을 ${ml} mL씩 담았어요. 「가열하기」를 눌러 물을 모두 날려 보내요.`); }
  function done() { running = false; ran = true; show(1, 0); read(true); btn(); tip('물이 모두 날아갔어요. 두 접시에 남은 것을 비교하고 「표에 적기」를 눌러요. 물의 양을 바꿔서도 해 봐요.'); }
  const step = (dt) => { t += dt; const p = Math.min(1, t / DUR); show(p, p < 0.9 ? 1 : 0); if (t >= DUR) done(); };
  run.onclick = () => {
    if (running || dead || ran) return; running = true; t = 0; btn(); read(false); tip('전열기로 가열하고 있어요. 김이 나며 물이 점점 줄어요…');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { t = DUR; done(); return; }
    if (!stage) timer = setInterval(() => { if (dead) { clearInterval(timer); return; } if (opts.isActive && !opts.isActive()) return; step(0.1); if (!running) clearInterval(timer); }, 100);
  };
  record.onclick = () => {
    if (running || dead || !ran) return;
    const row = evapRow(ml), i = rows.findIndex((r) => r.ml === ml);   // 같은 양을 다시 적으면 그 줄만 바꾼다
    if (i >= 0) rows[i] = row; else rows.push(row);
    rows.sort((a, b) => a.ml - b.ml); written = true; drawRows(); btn(); opts.onRecord?.(rows.slice());
  };
  $('[data-reset]').onclick = () => pick(ml);
  el.querySelectorAll('[data-ml]').forEach((b) => { b.onclick = () => pick(Number(b.dataset.ml)); });
  if (stage) stage.update = (dt) => {
    if (dead || (opts.isActive && !opts.isActive())) return;
    if (running) step(dt); else if (model) model.userData.set({ t: (model.userData.state.t || 0) + dt });
  };
  const dispose = () => { if (dead) return; dead = true; clearInterval(timer); stage?.dispose(); };
  if (engine) engine.watchDetached(el, dispose);
  else { const ob = new MutationObserver(() => { if (!el.isConnected) { ob.disconnect(); dispose(); } }); ob.observe(document.body, { childList: true, subtree: true }); }
  pick(opts.ml ?? 20); drawRows(); return { rows, dispose };
}
export async function mountSeawater2D(el, opts = {}) { return mountSeawater(el, { ...opts, force2D: true }); }
