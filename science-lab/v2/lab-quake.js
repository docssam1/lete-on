// 지진 실험실 — 미는 힘(약하게·세게·아주 세게)과 집(보통·내진 설계)을 골라 「밀기」 → 지층이 휘거나 끊어지는 모습과 집의 피해를 표에 적는다.
// 원본 4-2-2 이론 24–25쪽 「지층의 휘어짐·끊어짐 모형 실험」을 3D로. 수치가 아니라 변화 단계로 비교한다.
import { FORCES, HOUSES, quakeModel } from '../scenes/quake-model.js';
export { FORCES, HOUSES, quakeModel };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const group = (label, key, list) => `<div class="modes" role="group" aria-label="${label}">${list.map((v) => `<button type="button" data-${key}="${v}">${v}</button>`).join('')}</div>`;
const DUR = 2.6;   // 밀기 연출 시간(초)

export async function mountQuake(el, opts = {}) {
  let engine, rig, stage;
  try { const [E, M] = await Promise.all([import('../engine.js'), import('../scenes/quake-layers.js')]); engine = E; rig = M; if (opts.force2D || !E.Stage.canWebGL()) rig = null; } catch { rig = null; }
  if (!el.isConnected) return {};
  const rows = (opts.rows || []).slice();
  let force = FORCES[0], house = HOUSES[0], running = false, completed = false, t = 0, dead = false, timer = null;
  el.innerHTML = `${group('미는 힘', 'force', FORCES)}${group('집', 'house', HOUSES)}
    <div class="lab3d">${rig ? '<canvas aria-label="지진 3D 실험. 겹친 우드락을 양쪽에서 밀어 지층의 변화를 관찰해요."></canvas>'
      : '<div class="quake-2d" role="img" aria-label="지층 모형 2D 관찰"><div class="qk-layers"><i></i><i></i><i></i><i></i></div><span class="qk-house">🏠</span></div>'}
    <p class="lab3d-tip" data-tip aria-live="polite">미는 힘과 집을 고르고 「밀기」를 눌러요.</p>
    <div class="lab3d-btns"><button type="button" class="btn primary" data-run>밀기</button><button type="button" class="btn" data-record disabled>표에 적기</button></div></div>
    <p class="qk-model-note">우드락은 짧은 시간에 손으로 밀지만, 실제 지층은 지구 내부의 아주 큰 힘을 오랜 시간 받아요. 화면은 변화 단계를 보여 주는 모형이에요.</p>
    <table class="lab-table"><thead><tr><th>미는 힘</th><th>집</th><th>관찰한 모습</th></tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), tip = (s) => { $('[data-tip]').textContent = s; }, record = $('[data-record]'), run = $('[data-run]');
  let model;
  if (rig) {
    try { stage = new engine.Stage($('canvas')); model = rig.buildQuakeLayers(); stage.root.add(model); stage.setView({ theta: 0.32, phi: 1.22, frame: [[-3.0, 0, -1.0], [3.4, 1.9, 1.0]] }); }
    catch { el.querySelector('canvas')?.remove(); stage?.dispose(); return mountQuake(el, { ...opts, force2D: true }); }
  }
  const drawRows = () => { $('tbody').innerHTML = rows.map((r) => `<tr><td>${esc(r.force)}</td><td>${esc(r.house)}</td><td>${esc(r.result)}</td></tr>`).join(''); };
  // p: 0(시작)~1(끝) 진행에 맞춘 모습
  const show = (p) => {
    const m = quakeModel(force, house), broke = m.change === 3;
    if (model) {
      const u = model.userData, tg = u.target(force);
      if (!broke) u.set({ house, bend: tg.bend * p, squeeze: tg.squeeze * p, broke: 0, shake: 0, tilt: 0, t: p * DUR });
      else {
        const pre = Math.min(1, p / 0.55), s = p < 0.55 ? 0 : Math.min(1, (p - 0.55) / 0.08);
        const shake = p < 0.55 ? 0 : Math.max(0, 1 - (p - 0.55) / 0.4);
        u.set({ house, bend: 0.42 * pre - 0.18 * s, squeeze: 0.07 * pre + 0.01 * s, broke: s, shake: p >= 1 ? 0 : shake, tilt: house === '보통 집' ? 0.42 * s : 0, t: p * DUR });
      }
      u.push(p > 0 && p < 1);
    } else {
      const ls = $('.qk-layers'); ls.style.transform = p ? `scaleX(${1 - 0.05 * m.change * p})` : ''; ls.dataset.change = p >= 1 ? m.change : 0;
      $('.qk-house').style.transform = p >= 1 && m.damage === 2 ? 'rotate(-22deg)' : '';
    }
  };
  const press = () => { for (const [k, v] of [['force', force], ['house', house]]) el.querySelectorAll(`[data-${k}]`).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset[k] === v))); };
  function choose() { clearInterval(timer); t = 0; running = false; completed = false; record.disabled = true; run.disabled = false; show(0); press(); tip(`미는 힘 ${force} · ${house}. 「밀기」를 눌러 관찰해요.`); }
  function done() {
    running = false; completed = true; run.disabled = false; record.disabled = false; show(1);
    const m = quakeModel(force, house);
    tip(m.change === 3 ? `지층이 끊어지며 떨렸어요(지진). ${house}은(는) ${m.damage === 2 ? '기울어졌어요' : '흔들렸다가 제자리로 돌아왔어요'}. 표에 적어요.` : `${m.shape}. 표에 적고 미는 힘을 바꿔 비교해요.`);
  }
  run.onclick = () => {
    if (running || dead) return; completed = false; record.disabled = true; run.disabled = true; running = true; t = 0; tip('양쪽에서 천천히 미는 중이에요. 지층의 가운데를 지켜봐요.');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) done();
    else if (!stage) { timer = setInterval(() => { if (dead) { clearInterval(timer); return; } if (opts.isActive && !opts.isActive()) return; t += 0.1; show(Math.min(1, t / DUR)); if (t >= DUR) { clearInterval(timer); done(); } }, 100); }
  };
  record.onclick = () => { if (!completed || running || dead) return; rows.push({ force, house, ...quakeModel(force, house) }); drawRows(); opts.onRecord?.(rows.slice()); };
  for (const [k, set] of [['force', (v) => { force = v; }], ['house', (v) => { house = v; }]]) el.querySelectorAll(`[data-${k}]`).forEach((b) => { b.onclick = () => { set(b.dataset[k]); choose(); }; });
  if (stage) stage.update = (dt) => { if (dead || (opts.isActive && !opts.isActive()) || !running) return; t += dt; show(Math.min(1, t / DUR)); if (t >= DUR) done(); };
  const dispose = () => { if (dead) return; dead = true; clearInterval(timer); stage?.dispose(); };
  if (engine) engine.watchDetached(el, dispose);
  else { const ob = new MutationObserver(() => { if (!el.isConnected) { ob.disconnect(); dispose(); } }); ob.observe(document.body, { childList: true, subtree: true }); }
  choose(); drawRows(); return { rows, dispose };
}
export async function mountQuake2D(el, opts = {}) { return mountQuake(el, { ...opts, force2D: true }); }
