// 밤하늘과 우리 실험실 — 같은 시각 달 관찰. 음력 날짜를 고르고 「관찰하기」 → 그날 정한 시각(저녁 7시쯤·새벽 6시쯤)의 달 모양과 방향을 읽고 표에 적는다.
// 적어 둔 날의 달은 같은 시각 하늘에 작게 남아 위치가 서쪽에서 동쪽으로 옮겨 가는 것을 비교할 수 있다. 값은 대표적인 모형 값(scenes/moon-model.js)이다.
import { DAYS, moonRow, moonModel } from '../scenes/moon-model.js';
export { DAYS, moonRow };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const DUR = 2.2;

export async function mountMoon(el, opts = {}) {
  let engine, rig, stage;
  try { const [E, M] = await Promise.all([import('../engine.js'), import('../scenes/moon-sky.js')]); engine = E; rig = M; if (opts.force2D || !E.Stage.canWebGL()) rig = null; } catch { rig = null; }
  if (!el.isConnected) return {};
  const rows = (opts.rows || []).slice();
  let day = 3, running = false, t = 0, dead = false, timer = null, seen = false, written = false;
  el.innerHTML = `<div class="modes" role="group" aria-label="관찰할 날(음력)"><span class="lab-lbl">음력</span>${DAYS.map((d) => `<button type="button" data-day="${d}" title="${esc(moonModel(d).time)}">${d}일</button>`).join('')}</div>
    <div class="lab3d">${rig ? '<canvas aria-label="같은 시각 달 관찰 3D. 남쪽을 바라보고 동쪽(왼쪽)에서 서쪽(오른쪽)까지 펼친 하늘에 그날 정한 시각의 달이 떠요."></canvas>'
      : `<div class="mo-2d" role="img" aria-label="달 모양 2D 모형"><span class="mo-moon" data-moon></span><span class="mo-dirs"><b>동</b><b>남</b><b>서</b></span></div>`}
      <p class="lab3d-tip" data-tip aria-live="polite"></p>
      <ul class="mo-read"><li><b>관찰 시각</b> <span data-r="time">?</span></li><li><b>달의 이름</b> <span data-r="name">?</span></li><li><b>모양</b> <span data-r="side">?</span></li><li><b>보이는 방향</b> <span data-r="dir">?</span></li></ul>
      <div class="lab3d-btns"><button type="button" class="btn primary" data-run>관찰하기</button><button type="button" class="btn" data-record disabled>표에 적기</button><button type="button" class="btn ghost" data-reset>처음으로</button></div></div>
    <p class="mo-note">같은 곳에서 남쪽 하늘을 바라봐요(왼쪽이 동쪽, 오른쪽이 서쪽). 초승달~보름달은 해가 진 뒤 저녁 7시쯤, 하현달·그믐달은 해 뜨기 전 새벽 6시쯤에 잘 보여요. 날짜·방향은 대표적인 값이고 실제는 날마다·계절마다 조금씩 달라요. 적어 둔 날의 달은 하늘에 작게 남아요.</p>
    <table class="lab-table"><thead><tr><th>음력</th><th>관찰 시각</th><th>달의 이름</th><th>모양</th><th>보이는 방향</th></tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), tip = (s) => { $('[data-tip]').textContent = s; }, record = $('[data-record]'), run = $('[data-run]');
  let model;
  if (rig) {
    try { stage = new engine.Stage($('canvas')); model = rig.buildMoonSky(); stage.root.add(model); stage.setView({ theta: 0, phi: Math.PI / 2, frame: [[-3.4, -0.35, -0.2], [3.4, 2.5, 0.2]] }); }
    catch { el.querySelector('canvas')?.remove(); stage?.dispose(); return mountMoon(el, { ...opts, force2D: true }); }
  }
  const drawRows = () => { $('tbody').innerHTML = rows.map((r) => `<tr><th scope="row">${r.day}일</th><td>${esc(r.time)}</td><td>${esc(r.name)}</td><td>${esc(r.side)}</td><td>${esc(r.dir)}</td></tr>`).join(''); };
  const read = (known) => { const r = moonRow(day); $('[data-r="time"]').textContent = r.time; for (const k of ['name', 'side', 'dir']) $(`[data-r="${k}"]`).textContent = known ? r[k] : '?'; };
  const show = (p, shown) => {
    if (model) model.userData.set({ day, p, shown, marks: rows.map((r) => r.day) });
    else { const m = $('[data-moon]'); if (m) { const mm = moonModel(day); m.style.setProperty('--lit', String(mm.lit / 100)); m.dataset.side = mm.waxing ? 'r' : 'l'; m.style.left = `${92 - mm.fromWest / 180 * 84}%`; m.style.opacity = shown ? String(p) : '0'; } }
  };
  const press = () => el.querySelectorAll('[data-day]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.day) === day)));
  const btn = () => { run.disabled = running || seen; record.disabled = running || !seen || written; };
  function pick(d) { clearInterval(timer); running = false; day = d; t = 0; seen = false; written = false; show(0, false); read(false); press(); btn();
    tip(`음력 ${day}일, ${moonModel(day).time}에 남쪽 하늘을 바라봐요. 「관찰하기」를 눌러요.`); }
  function done() { running = false; seen = true; show(1, true); read(true); btn(); tip('달의 모양과 방향을 읽고 「표에 적기」를 눌러요. 다른 날도 같은 시각에 관찰해 비교해 봐요.'); }
  const step = (dt) => { t += dt; show(Math.min(1, t / DUR), true); if (t >= DUR) done(); };
  run.onclick = () => {
    if (running || dead || seen) return; running = true; t = 0; btn(); read(false); tip('하늘이 어두워지며 달이 보이기 시작해요…');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { t = DUR; done(); return; }
    if (!stage) timer = setInterval(() => { if (dead) { clearInterval(timer); return; } if (opts.isActive && !opts.isActive()) return; step(0.1); if (!running) clearInterval(timer); }, 100);
  };
  record.onclick = () => {
    if (running || dead || !seen) return;
    const row = moonRow(day), i = rows.findIndex((r) => r.day === day);   // 같은 날을 다시 적으면 그 줄만 바꾼다
    if (i >= 0) rows[i] = row; else rows.push(row);
    rows.sort((a, b) => a.day - b.day); written = true; drawRows(); btn(); show(1, true); opts.onRecord?.(rows.slice());
  };
  $('[data-reset]').onclick = () => { rows.length = 0; drawRows(); pick(day); };
  el.querySelectorAll('[data-day]').forEach((b) => { b.onclick = () => pick(Number(b.dataset.day)); });
  if (stage) stage.update = (dt) => { if (dead || (opts.isActive && !opts.isActive())) return; if (running) step(dt); };
  const dispose = () => { if (dead) return; dead = true; clearInterval(timer); stage?.dispose(); };
  if (engine) engine.watchDetached(el, dispose);
  else { const ob = new MutationObserver(() => { if (!el.isConnected) { ob.disconnect(); dispose(); } }); ob.observe(document.body, { childList: true, subtree: true }); }
  pick(opts.day ?? 3); drawRows(); return { rows, dispose };
}
export async function mountMoon2D(el, opts = {}) { return mountMoon(el, { ...opts, force2D: true }); }
