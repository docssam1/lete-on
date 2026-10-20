// 소리의 성질 실험실 — 책상 끝 자 튕기기. 내민 길이와 튕기는 세기를 고르고 「튕기기」 → 떨림을 보고 소리를 들은 뒤 표에 적는다.
// 들리는 소리는 높낮이·세기 차이를 귀로 느끼게 만든 모형 소리다(scenes/ruler-model.js). 실제 자의 소리와 진동수가 같지 않다.
import { LENGTHS, STRENGTHS, rulerRow, rulerModel } from '../scenes/ruler-model.js';
export { LENGTHS, STRENGTHS, rulerRow };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const DUR = 2.6;
let AC = null;
function tone(hz, amp) {   // 튕긴 소리: 금방 커졌다가 서서히 줄어드는 소리
  try {
    AC ||= new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === 'suspended') AC.resume();
    const o = AC.createOscillator(), g = AC.createGain(), now = AC.currentTime;
    o.type = 'triangle'; o.frequency.value = hz; g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(0.06 + 0.22 * amp, now + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
    o.connect(g).connect(AC.destination); o.start(now); o.stop(now + 1.7); return { stop: () => { try { g.gain.cancelScheduledValues(AC.currentTime); g.gain.setTargetAtTime(0.0001, AC.currentTime, 0.02); o.stop(AC.currentTime + 0.1); } catch { /* 이미 끝남 */ } } };
  } catch { return { stop() {} }; }
}

export async function mountRuler(el, opts = {}) {
  let engine, rig, stage;
  try { const [E, M] = await Promise.all([import('../engine.js'), import('../scenes/ruler-desk.js')]); engine = E; rig = M; if (opts.force2D || !E.Stage.canWebGL()) rig = null; } catch { rig = null; }
  if (!el.isConnected) return {};
  const rows = (opts.rows || []).slice();
  let len = 10, strength = '세게', running = false, t = 0, hold = 0, dead = false, timer = null, ran = false, written = false, sound = opts.mode !== 'battle', snd = null;
  el.innerHTML = `<div class="modes" role="group" aria-label="내민 길이"><span class="lab-lbl">내민 길이</span>${LENGTHS.map((v) => `<button type="button" data-len="${v}">${v} cm</button>`).join('')}</div>
    <div class="modes" role="group" aria-label="튕기는 세기"><span class="lab-lbl">세기</span>${STRENGTHS.map((v) => `<button type="button" data-str="${v}">${v}</button>`).join('')}
      <label class="rl-sound"><input type="checkbox" data-sound ${sound ? 'checked' : ''}> 소리 듣기</label></div>
    <div class="lab3d">${rig ? '<canvas aria-label="책상 끝 자 튕기기 3D. 자를 책상 밖으로 내밀고 끝을 튕기면 떨리며 소리가 나요."></canvas>'
      : '<div class="rl-2d" role="img" aria-label="자 튕기기 2D 모형"><span class="rl-desk"></span><span class="rl-bar"></span></div>'}
      <p class="lab3d-tip" data-tip aria-live="polite"></p>
      <ul class="rl-read"><li><b>높낮이</b> <span data-r="pitch">?</span></li><li><b>세기</b> <span data-r="loud">?</span></li><li><b>떨림</b> <span data-r="swing">?</span></li></ul>
      <div class="lab3d-btns"><button type="button" class="btn primary" data-run>튕기기</button><button type="button" class="btn" data-hold disabled>손으로 잡기</button><button type="button" class="btn" data-record disabled>표에 적기</button><button type="button" class="btn ghost" data-reset>처음으로</button></div></div>
    <p class="rl-note">같은 자·같은 책·같은 자리에서 내민 길이와 튕기는 세기만 바꿔요. 들리는 소리는 높낮이와 세기를 느끼게 만든 모형 소리이고, 화면의 떨림은 눈에 보이게 느리게 그렸어요.</p>
    <table class="lab-table"><thead><tr><th>내민 길이</th><th>세기</th><th>높낮이</th><th>소리의 세기</th><th>떨림</th></tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), tip = (s) => { $('[data-tip]').textContent = s; }, record = $('[data-record]'), run = $('[data-run]'), holdBtn = $('[data-hold]');
  let model;
  if (rig) {
    try { stage = new engine.Stage($('canvas')); model = rig.buildRulerDesk(); stage.root.add(model); stage.setView({ theta: 0.35, phi: 1.0, frame: [[-0.5, -0.2, -0.45], [1.8, 0.55, 0.45]] }); }
    catch { el.querySelector('canvas')?.remove(); stage?.dispose(); return mountRuler(el, { ...opts, force2D: true }); }
  }
  const drawRows = () => { $('tbody').innerHTML = rows.map((r) => `<tr><th scope="row">${r.len} cm</th><td>${esc(r.strength)}</td><td>${esc(r.pitch)}</td><td>${esc(r.loud)}</td><td>${esc(r.swing)}</td></tr>`).join(''); };
  const read = (known) => { const r = rulerRow(len, strength); for (const k of ['pitch', 'loud', 'swing']) $(`[data-r="${k}"]`).textContent = known ? r[k] : '?'; };
  const show = (on) => { if (model) model.userData.set({ len, strength, on, p: t, hold }); else { const b = $('.rl-bar'); if (b) { b.style.width = `${len * 6}px`; b.classList.toggle('on', on && hold < 1); } } };
  const press = () => { el.querySelectorAll('[data-len]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.len) === len))); el.querySelectorAll('[data-str]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.str === strength))); };
  const btn = () => { run.disabled = running; holdBtn.disabled = !running; record.disabled = running || !ran || written; };
  function pick() { clearInterval(timer); snd?.stop(); running = false; t = 0; hold = 0; ran = false; written = false; show(false); read(false); press(); btn();
    tip(`자를 책상 밖으로 ${len} cm 내밀었어요. ${strength} 튕겨 볼까요? 「튕기기」를 눌러요.`); }
  function done() { running = false; ran = true; snd = null; show(false); read(true); btn(); tip('떨림과 소리를 비교해 「표에 적기」를 눌러요. 길이나 세기를 하나만 바꿔 다시 튕겨 봐요.'); }
  const step = (dt) => { t += dt; if (hold > 0) hold = Math.min(1, hold + dt * 6); show(true); if (t >= DUR || hold >= 1) done(); };
  run.onclick = () => {
    if (running || dead) return; running = true; t = 0; hold = 0; ran = false; written = false; btn(); read(false);
    const m = rulerModel(len, strength); if (sound) snd = tone(m.hz, m.amp);
    tip('자가 위아래로 떨려요. 떨림을 멈추고 싶으면 「손으로 잡기」를 눌러요.');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { t = DUR; done(); return; }
    if (!stage) timer = setInterval(() => { if (dead) { clearInterval(timer); return; } if (opts.isActive && !opts.isActive()) return; step(0.1); if (!running) clearInterval(timer); }, 100);
  };
  holdBtn.onclick = () => { if (!running) return; hold = 0.01; snd?.stop(); snd = null; tip('손으로 잡아 떨림을 멈췄더니 소리도 멈췄어요.'); };
  record.onclick = () => {
    if (running || dead || !ran) return;
    const row = rulerRow(len, strength), i = rows.findIndex((r) => r.len === len && r.strength === strength);   // 같은 조건을 다시 적으면 그 줄만 바꾼다
    if (i >= 0) rows[i] = row; else rows.push(row);
    rows.sort((a, b) => (a.len - b.len) || STRENGTHS.indexOf(a.strength) - STRENGTHS.indexOf(b.strength)); written = true; drawRows(); btn(); opts.onRecord?.(rows.slice());
  };
  $('[data-reset]').onclick = () => pick();
  $('[data-sound]').onchange = (e) => { sound = e.target.checked; if (!sound) snd?.stop(); };
  el.querySelectorAll('[data-len]').forEach((b) => { b.onclick = () => { len = Number(b.dataset.len); pick(); }; });
  el.querySelectorAll('[data-str]').forEach((b) => { b.onclick = () => { strength = b.dataset.str; pick(); }; });
  if (stage) stage.update = (dt) => { if (dead || (opts.isActive && !opts.isActive())) return; if (running) step(dt); };
  const dispose = () => { if (dead) return; dead = true; clearInterval(timer); snd?.stop(); stage?.dispose(); };
  if (engine) engine.watchDetached(el, dispose);
  else { const ob = new MutationObserver(() => { if (!el.isConnected) { ob.disconnect(); dispose(); } }); ob.observe(document.body, { childList: true, subtree: true }); }
  pick(); drawRows(); return { rows, dispose };
}
export async function mountRuler2D(el, opts = {}) { return mountRuler(el, { ...opts, force2D: true }); }
