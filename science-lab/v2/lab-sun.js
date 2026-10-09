// 태양계와 별 실험실 — 넣을 물의 양을 골라 「물 넣기」 → 붉은 식용유 덩어리가 뜬 눈금을 표에 적는다. 「흔들기」로 성운설 모형도 본다.
// 원본 5-D 「떠오르는 태양」. 눈금은 원본 결과의 순서(물이 많을수록 높이 뜸)를 따르는 모형 값이다.
import { WATERS, sunModel } from '../scenes/rising-sun-model.js';
export { WATERS, sunModel };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const DUR = 4, SHAKE = 4.5;   // 물 넣기 · 흔들기 연출 시간(초)

export async function mountSun(el, opts = {}) {
  let engine, rig, stage;
  try { const [E, M] = await Promise.all([import('../engine.js'), import('../scenes/rising-sun.js')]); engine = E; rig = M; if (opts.force2D || !E.Stage.canWebGL()) rig = null; } catch { rig = null; }
  if (!el.isConnected) return {};
  const rows = (opts.rows || []).slice();
  let ml = 20, running = null, completed = false, t = 0, dead = false, timer = null;
  el.innerHTML = `<div class="modes" role="group" aria-label="넣을 물"><span class="lab-lbl">넣을 물</span>${WATERS.map((v) => `<button type="button" data-ml="${v}">${v} mL</button>`).join('')}</div>
    <div class="lab3d">${rig ? '<canvas aria-label="떠오르는 태양 3D 실험. 에탄올 속 붉은 식용유에 물을 떨어뜨려 덩어리가 떠오르는 높이를 관찰해요."></canvas>'
      : '<div class="sun-2d" role="img" aria-label="떠오르는 태양 2D 관찰"><div class="sn-jar"><i class="sn-liq"></i><b class="sn-oil"></b><span class="sn-scale"></span></div></div>'}
      <p class="lab3d-tip" data-tip aria-live="polite">넣을 물의 양을 고르고 「물 넣기」를 눌러요.</p>
      <div class="lab3d-btns"><button type="button" class="btn primary" data-run>물 넣기</button><button type="button" class="btn" data-shake disabled title="뚜껑을 닫고 흔들어요">흔들기</button><button type="button" class="btn" data-record disabled>표에 적기</button></div></div>
    <p class="sn-model-note">에탄올 20 mL에 붉은 식용유를 넣고 시작해요. 눈금은 액체 바닥 0칸부터 수면 10칸까지예요. 칸 수는 원본 실험의 결과 순서를 따르는 모형 값이에요.</p>
    <table class="lab-table"><thead><tr><th>넣은 물</th><th>눈금</th><th>덩어리 모양</th></tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), tip = (s) => { $('[data-tip]').textContent = s; }, record = $('[data-record]'), run = $('[data-run]'), shakeBtn = $('[data-shake]');
  let model;
  if (rig) {
    try { stage = new engine.Stage($('canvas')); model = rig.buildRisingSun(); stage.root.add(model); stage.setView({ theta: 0.35, phi: 1.22, frame: [[-1.9, 0, -1.1], [1.6, 4.7, 1.1]] }); }
    catch { el.querySelector('canvas')?.remove(); stage?.dispose(); return mountSun(el, { ...opts, force2D: true }); }
  }
  const drawRows = () => { $('tbody').innerHTML = rows.map((r) => `<tr><td>${esc(r.ml)} mL</td><td>${esc(r.height)}칸</td><td>${esc(r.shape)}</td></tr>`).join(''); };
  // p: 물 넣기 진행(0~1) · sh: 흔들기 진행(0~1)
  const show = (p, tt = 0, sh = 0) => {
    if (model) model.userData.set({ from: 0, ml, p, t: tt, oilIn: 1, dropper: sh <= 0, lid: sh > 0, shake: sh });
    else {
      const k = Math.min(1, p * 1.4), cur = ml * k, f = sunModel(ml).f * Math.min(1, Math.max(0, (p - 0.25) / 0.75)), box = $('.sun-2d');
      box.style.setProperty('--lv', String((20 + cur) / 60)); box.style.setProperty('--f', String(f)); box.dataset.flat = f < 0.06 || f > 0.94 ? '1' : '0'; box.dataset.shake = sh > 0 && sh < 1 ? '1' : '0';
    }
  };
  const press = () => el.querySelectorAll('[data-ml]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.ml) === ml)));
  function choose() { clearInterval(timer); t = 0; running = null; completed = false; record.disabled = true; shakeBtn.disabled = true; run.disabled = false; show(0); press(); tip(`물 ${ml} mL. 「물 넣기」를 눌러 식용유 덩어리를 지켜봐요.`); }
  function done() {
    running = null; completed = true; run.disabled = false; record.disabled = false; shakeBtn.disabled = false; show(1, t);
    const m = sunModel(ml);
    tip(ml === 0 ? '물을 넣지 않으면 덩어리는 바닥에 그대로예요. 표에 적고 물의 양을 바꿔 비교해요.' : `${m.result}. 표에 적고 물의 양을 바꿔 비교해요.`);
  }
  function shaken() { running = null; shakeBtn.disabled = false; run.disabled = false; show(1, t, 1); tip('여러 방울로 갈라져 함께 돌다가 다시 하나로 모였어요. 돌던 가스와 먼지가 모여 태양과 행성이 생겼다는 생각(성운설)과 닮았어요.'); }
  const animate = (kind) => {
    const dur = kind === 'drop' ? DUR : SHAKE, end = kind === 'drop' ? done : shaken;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { end(); return; }
    if (!stage) timer = setInterval(() => { if (dead) { clearInterval(timer); return; } if (opts.isActive && !opts.isActive()) return; t += 0.1; kind === 'drop' ? show(Math.min(1, t / dur), t) : show(1, t, Math.min(1, t / dur)); if (t >= dur) { clearInterval(timer); end(); } }, 100);
  };
  run.onclick = () => { if (running || dead) return; completed = false; record.disabled = true; shakeBtn.disabled = true; run.disabled = true; running = 'drop'; t = 0; tip(ml ? '물을 한 방울씩 떨어뜨리는 중이에요. 덩어리를 지켜봐요.' : '물 없이 지켜보는 중이에요.'); animate('drop'); };
  shakeBtn.onclick = () => { if (running || dead || !completed) return; run.disabled = true; shakeBtn.disabled = true; running = 'shake'; t = 0; tip('뚜껑을 닫고 빙글빙글 흔드는 중이에요.'); animate('shake'); };
  record.onclick = () => { if (!completed || running || dead) return; rows.push({ ml, ...sunModel(ml) }); drawRows(); opts.onRecord?.(rows.slice()); };
  el.querySelectorAll('[data-ml]').forEach((b) => { b.onclick = () => { ml = Number(b.dataset.ml); choose(); }; });
  if (stage) stage.update = (dt) => {
    if (dead || (opts.isActive && !opts.isActive())) return;
    if (running === 'drop') { t += dt; show(Math.min(1, t / DUR), t); if (t >= DUR) done(); }
    else if (running === 'shake') { t += dt; show(1, t, Math.min(1, t / SHAKE)); if (t >= SHAKE) shaken(); }
  };
  const dispose = () => { if (dead) return; dead = true; clearInterval(timer); stage?.dispose(); };
  if (engine) engine.watchDetached(el, dispose);
  else { const ob = new MutationObserver(() => { if (!el.isConnected) { ob.disconnect(); dispose(); } }); ob.observe(document.body, { childList: true, subtree: true }); }
  choose(); drawRows(); return { rows, dispose };
}
export async function mountSun2D(el, opts = {}) { return mountSun(el, { ...opts, force2D: true }); }
