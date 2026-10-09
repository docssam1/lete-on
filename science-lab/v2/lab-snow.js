// 용해와 용액 실험실 — 식히는 방법을 골라 「식히기」 → 병 속에 내린 흰 결정(눈)의 양을 표에 적는다. 「다시 데우기」로 결정이 다시 녹는 것도 본다.
// 원본 5-A 「흰 눈이 펄펄」. 결정의 양은 원본에 실린 염화암모늄 용해도로 계산한 값(물 10 g, 60 ℃ 포화 용액 기준)이다.
import { COOLS, TEMPS, snowModel } from '../scenes/snow-model.js';
export { COOLS, TEMPS, snowModel };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const SHORT = ['그대로 60 ℃', '실온 20 ℃', '얼음물 0 ℃'];
const DUR = 4.5, HEAT = 4;   // 식히기 · 데우기 연출 시간(초)

export async function mountSnow(el, opts = {}) {
  let engine, rig, stage;
  try { const [E, M] = await Promise.all([import('../engine.js'), import('../scenes/snow-jar.js')]); engine = E; rig = M; if (opts.force2D || !E.Stage.canWebGL()) rig = null; } catch { rig = null; }
  if (!el.isConnected) return {};
  const rows = (opts.rows || []).slice();
  let ci = 1, running = null, completed = false, hot = false, t = 0, dead = false, timer = null;   // hot: 다시 데운 뒤(결정이 녹아 있음)
  el.innerHTML = `<div class="modes" role="group" aria-label="식히는 방법"><span class="lab-lbl">식히기</span>${SHORT.map((v, i) => `<button type="button" data-cool="${i}" title="${esc(COOLS[i])}">${esc(v)}</button>`).join('')}</div>
    <div class="lab3d">${rig ? '<canvas aria-label="병 속에 내리는 눈 3D 실험. 염화암모늄 포화 용액을 식히면 흰 결정이 눈처럼 내리는 것을 관찰해요."></canvas>'
      : '<div class="snow-2d" role="img" aria-label="병 속에 내리는 눈 2D 관찰"><div class="sw-jar"><i class="sw-liq"></i><b class="sw-pile"></b><span class="sw-flakes"></span></div><em class="sw-bath"></em></div>'}
      <p class="lab3d-tip" data-tip aria-live="polite">식히는 방법을 고르고 「식히기」를 눌러요.</p>
      <div class="lab3d-btns"><button type="button" class="btn primary" data-run>식히기</button><button type="button" class="btn" data-heat disabled>다시 데우기</button><button type="button" class="btn" data-record disabled>표에 적기</button></div></div>
    <p class="sw-model-note">60 ℃의 물 10 g에 염화암모늄을 더 녹지 않을 때까지(약 5.5 g) 녹인 포화 용액이에요. 결정의 양은 원본 교재에 실린 용해도(0 ℃ 약 30 g · 20 ℃ 약 37 g · 60 ℃ 55.2 g, 물 100 g 기준)로 계산한 값이에요.</p>
    <table class="lab-table"><thead><tr><th>식히는 방법</th><th>결정(눈)의 양</th><th>병 속 모습</th></tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), tip = (s) => { $('[data-tip]').textContent = s; }, record = $('[data-record]'), run = $('[data-run]'), heatBtn = $('[data-heat]');
  let model;
  if (rig) {
    try { stage = new engine.Stage($('canvas')); model = rig.buildSnowJar(); stage.root.add(model); stage.setView({ theta: 0.32, phi: 1.2, frame: [[-1.7, 0, -1.2], [1.8, 3.4, 1.2]] }); }
    catch { el.querySelector('canvas')?.remove(); stage?.dispose(); return mountSnow(el, { ...opts, force2D: true }); }
  }
  const drawRows = () => { $('tbody').innerHTML = rows.map((r) => `<tr><td>${esc(r.cool)}</td><td>약 ${esc(r.snow)} g</td><td>${esc(r.shape)}</td></tr>`).join(''); };
  // p: 식는 진행(0~1) · h: 다시 데우기(0~1)
  const show = (p, tt = 0, h = 0) => {
    if (model) model.userData.set({ cool: ci, p, t: tt, reheat: h });
    else {
      const m = snowModel(COOLS[ci]), k = Math.min(1, p) * (1 - h), box = $('.snow-2d');
      box.style.setProperty('--pile', String(m.snow / 2.5 * k)); box.dataset.snow = k > 0.1 && m.snow > 0 && p < 1 ? '1' : '0'; box.dataset.bath = h > 0 ? 'hot' : ci === 2 && p > 0 ? 'ice' : '';
    }
  };
  const press = () => el.querySelectorAll('[data-cool]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.cool) === ci)));
  function choose() { clearInterval(timer); t = 0; running = null; completed = false; hot = false; record.disabled = true; heatBtn.disabled = true; run.disabled = false; show(0); press(); tip(`${COOLS[ci]}. 「식히기」를 눌러 병 속을 지켜봐요.`); }
  function done() {
    running = null; completed = true; run.disabled = false; record.disabled = false; heatBtn.disabled = ci === 0; show(1, t);
    const m = snowModel(COOLS[ci]);
    tip(m.snow ? `${m.result}. 표에 적고 다른 방법과 비교해요.` : '60 ℃ 그대로 두면 녹을 수 있는 양이 그대로라 결정이 생기지 않아요. 표에 적어요.');
  }
  function heated() { running = null; hot = true; heatBtn.disabled = true; run.disabled = false; show(1, t, 1); tip('뜨거운 물에 넣자 결정이 다시 녹아 맑아졌어요. 온도가 높으면 더 많이 녹을 수 있어요. 다시 「식히기」를 누르면 또 눈이 내려요.'); }
  const animate = (kind) => {
    const dur = kind === 'cool' ? DUR : HEAT, end = kind === 'cool' ? done : heated;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { end(); return; }
    if (!stage) timer = setInterval(() => { if (dead) { clearInterval(timer); return; } if (opts.isActive && !opts.isActive()) return; t += 0.1; kind === 'cool' ? show(Math.min(1, t / dur), t) : show(1, t, Math.min(1, t / dur)); if (t >= dur) { clearInterval(timer); end(); } }, 100);
  };
  run.onclick = () => { if (running || dead) return; completed = false; hot = false; record.disabled = true; heatBtn.disabled = true; run.disabled = true; running = 'cool'; t = 0; tip(ci ? '식히는 중이에요. 병 속을 지켜봐요.' : '60 ℃ 그대로 지켜보는 중이에요.'); animate('cool'); };
  heatBtn.onclick = () => { if (running || dead || !completed) return; run.disabled = true; heatBtn.disabled = true; running = 'heat'; t = 0; tip('뜨거운 물에 다시 넣는 중이에요.'); animate('heat'); };
  record.onclick = () => { if (!completed || running || dead) return; rows.push({ cool: COOLS[ci], ...snowModel(COOLS[ci]) }); drawRows(); opts.onRecord?.(rows.slice()); };
  el.querySelectorAll('[data-cool]').forEach((b) => { b.onclick = () => { ci = Number(b.dataset.cool); choose(); }; });
  if (stage) stage.update = (dt) => {
    if (dead || (opts.isActive && !opts.isActive())) return;
    if (running === 'cool') { t += dt; show(Math.min(1, t / DUR), t); if (t >= DUR) done(); }
    else if (running === 'heat') { t += dt; show(1, t, Math.min(1, t / HEAT)); if (t >= HEAT) heated(); }
    else if (completed) { t += dt; show(1, t, hot ? 1 : 0); }   // 다 식은 뒤에도 남은 눈송이가 천천히 내려앉는다(데운 뒤에는 녹은 그대로)
  };
  const dispose = () => { if (dead) return; dead = true; clearInterval(timer); stage?.dispose(); };
  if (engine) engine.watchDetached(el, dispose);
  else { const ob = new MutationObserver(() => { if (!el.isConnected) { ob.disconnect(); dispose(); } }); ob.observe(document.body, { childList: true, subtree: true }); }
  choose(); drawRows(); return { rows, dispose };
}
export async function mountSnow2D(el, opts = {}) { return mountSnow(el, { ...opts, force2D: true }); }
