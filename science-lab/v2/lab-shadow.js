// 그림자 살펴보기 실험실 — 빛(손전등·햇빛) · 물체(불투명·투명) · 물체 위치를 골라 불을 켜고, 스크린의 그림자를 표에 적는다.
// 그림자 크기는 장면과 같은 기하식(shadowCm)으로 계산한다: 손전등 = 6 cm × 60/(빛~물체 거리), 햇빛 = 6 cm 그대로.
import { PLACES, EYE_Y, shadowCm } from '../scenes/shadow-box-model.js';
export const LIGHTS = ['손전등', '햇빛'], OBJECTS = ['종이 인형', '투명 필름 인형'], PLACE_NAMES = Object.keys(PLACES);
export function shadowModel(light, object, place) {
  if (!LIGHTS.includes(light) || !OBJECTS.includes(object) || !PLACE_NAMES.includes(place)) throw new RangeError('unknown condition');
  if (object === '투명 필름 인형') return { size: 0, edge: '없음', result: '그림자가 거의 생기지 않음' };
  const size = shadowCm(light, PLACES[place]);
  const edge = light === '햇빛' ? '선명함' : place === '빛 가까이' ? '흐릿함' : place === '가운데' ? '보통' : '선명함';
  return { size, edge, result: `그림자 ${size} cm · 가장자리 ${edge}` };
}
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const group = (label, key, list, fmt = (x) => x) => `<div class="modes" role="group" aria-label="${label}">${list.map((v) => `<button type="button" data-${key}="${v}">${fmt(v)}</button>`).join('')}</div>`;

export async function mountShadow(el, opts = {}) {
  let engine, rig, stage;
  try { const [E, M] = await Promise.all([import('../engine.js'), import('../scenes/shadow-box.js')]); engine = E; rig = M; if (opts.force2D || !E.Stage.canWebGL()) rig = null; } catch { rig = null; }
  if (!el.isConnected) return {};
  const rows = (opts.rows || []).slice();
  let light = LIGHTS[0], object = OBJECTS[0], place = '가운데', lit = false, dead = false, dragging = false;
  el.innerHTML = `${group('빛', 'light', LIGHTS)}${group('물체', 'object', OBJECTS)}${group('물체 위치', 'place', PLACE_NAMES)}
    <div class="lab3d">${rig ? '<canvas aria-label="그림자 3D 실험. 손전등과 스크린 사이에 물체를 놓고 그림자를 관찰해요."></canvas>'
      : '<div class="shadow-2d" role="img" aria-label="그림자 2D 관찰"><span class="sd-light">🔦</span><span class="sd-obj">🧍</span><span class="sd-screen"><i class="sd-shadow"></i></span></div>'}
    <p class="lab3d-tip" data-tip aria-live="polite">빛·물체·위치를 고르고 「불 켜기」를 눌러요.</p>
    <div class="lab3d-btns"><button type="button" class="btn primary" data-run>불 켜기</button><button type="button" class="btn" data-record disabled>표에 적기</button></div></div>
    <p class="sd-model-note">손전등과 스크린 사이는 60 cm, 인형 키는 6 cm인 모형이에요. 그림자 길이는 빛이 곧게 나아간다는 원리로 계산한 값이에요.</p>
    <table class="lab-table"><thead><tr><th>빛</th><th>물체</th><th>위치</th><th>그림자</th></tr></thead><tbody></tbody></table>`;
  const $ = (q) => el.querySelector(q), tip = (s) => { $('[data-tip]').textContent = s; }, record = $('[data-record]'), run = $('[data-run]');
  let box;
  if (rig) {
    try { stage = new engine.Stage($('canvas')); box = rig.buildShadowBox(); stage.root.add(box); stage.setView({ theta: -0.6, phi: 1.3, frame: [[-4, 0, -1.4], [3.4, 2.6, 1.4]] }); }
    catch { el.querySelector('canvas')?.remove(); stage?.dispose(); return mountShadow(el, { ...opts, force2D: true }); }
  }
  const drawRows = () => { $('tbody').innerHTML = rows.map((r) => `<tr><td>${esc(r.light)}</td><td>${esc(r.object)}</td><td>${esc(r.place)}</td><td>${esc(r.result)}</td></tr>`).join(''); };
  const show = (lit, x = PLACES[place]) => {
    if (box) box.userData.set({ light, x, clear: object === '투명 필름 인형', lit });
    else {
      const sh = $('.sd-shadow'), m = shadowModel(light, object, place);
      $('.sd-light').textContent = light === '햇빛' ? '☀️' : '🔦';
      $('.sd-obj').style.left = `${30 + (PLACES[place] + 1.5) / 3 * 34}%`;
      sh.style.height = lit ? `${Math.max(4, m.size * 4)}px` : '0'; sh.style.opacity = lit ? (m.size ? '0.85' : '0.12') : '0';
    }
  };
  const press = () => { for (const [k, v] of [['light', light], ['object', object], ['place', place]]) el.querySelectorAll(`[data-${k}]`).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset[k] === v))); };
  // 불은 「불 끄기」를 누를 때까지 켜져 있다 — 켠 채로 빛·물체·위치를 바꾸면 그림자가 바로 바뀐다(원장 2026-10-06)
  const result = () => { const m = shadowModel(light, object, place); return m.size ? `${m.result}. 표에 적고 위치나 빛을 바꿔 비교해요.` : '투명한 물체는 빛이 지나가서 그림자가 거의 생기지 않아요. 표에 적어요.'; };
  function choose() {
    show(lit); press(); record.disabled = !lit; run.textContent = lit ? '불 끄기' : '불 켜기'; run.setAttribute('aria-pressed', String(lit));
    tip((lit ? `${light} · ${object} · ${place} — ${result()}` : `${light} · ${object} · ${place}. 「불 켜기」를 눌러 그림자를 관찰해요.`) + (box ? ' 인형은 끌어서 옮길 수 있어요.' : ''));
  }
  run.onclick = () => { if (dead) return; lit = !lit; choose(); };
  record.onclick = () => { if (!lit || dead) return; rows.push({ light, object, place, ...shadowModel(light, object, place) }); drawRows(); opts.onRecord?.(rows.slice()); };
  for (const [k, set] of [['light', (v) => { light = v; }], ['object', (v) => { object = v; }], ['place', (v) => { place = v; }]]) el.querySelectorAll(`[data-${k}]`).forEach((b) => { b.onclick = () => { set(b.dataset[k]); choose(); }; });
  // 인형 끌기: 인형을 누르면 화면 돌리기 대신 인형이 손전등~스크린 사이를 따라 움직이고, 놓으면 가장 가까운 자리(빛 가까이·가운데·스크린 가까이)로 맞춘다.
  // 표·대결 기록은 세 자리로 비교하므로 자리를 맞춘다. 끄는 동안의 그림자는 같은 기하식으로 바로 그린다.
  const offs = [];
  if (box) {
    const canvas = $('canvas'), THREE = await import('../../world-explorer/vendor/three.module.js');
    const fig = box.userData.fig, ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), hitP = new THREE.Vector3();
    const grab = new THREE.Mesh(new THREE.BoxGeometry(0.7, EYE_Y + 0.5, 0.7), new THREE.MeshBasicMaterial()); grab.position.y = (EYE_Y + 0.5) / 2; grab.visible = false; fig.add(grab);   // 잡기 쉬운 넓은 손잡이(보이지 않음)
    const xs = Object.values(PLACES), X0 = Math.min(...xs) - 0.3, X1 = Math.max(...xs) + 0.3;
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const aim = (e) => { const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, stage.camera); };
    const onFig = (e) => { aim(e); box.updateMatrixWorld(true); return ray.intersectObject(grab, false).length > 0; };
    let curX = PLACES[place];
    const on = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); offs.push(() => t.removeEventListener(ev, fn, o)); };
    on(window, 'pointerdown', (e) => {
      if (dead || e.target !== canvas || !e.isPrimary || !onFig(e)) return;
      e.stopPropagation(); e.preventDefault(); dragging = true; canvas.style.cursor = 'grabbing'; curX = PLACES[place];
    }, true);
    on(window, 'pointermove', (e) => {
      if (!dragging) { if (e.target === canvas && e.pointerType === 'mouse') canvas.style.cursor = onFig(e) ? 'grab' : ''; return; }
      e.stopPropagation(); aim(e); if (!ray.ray.intersectPlane(plane, hitP)) return;
      curX = Math.max(X0, Math.min(X1, hitP.x)); show(lit, curX);
      if (lit) tip(object === '투명 필름 인형' ? '투명한 인형은 어디에 두어도 그림자가 거의 생기지 않아요.' : `그림자 약 ${shadowCm(light, curX)} cm — 놓으면 가장 가까운 자리에 맞춰요.`);
    }, true);
    const drop = (e) => {
      if (!dragging) return; e.stopPropagation(); dragging = false; canvas.style.cursor = '';
      place = Object.entries(PLACES).reduce((a, b) => (Math.abs(b[1] - curX) < Math.abs(a[1] - curX) ? b : a))[0]; choose();
    };
    on(window, 'pointerup', drop, true); on(window, 'pointercancel', drop, true);
  }
  const dispose = () => { if (dead) return; dead = true; offs.forEach((f) => f()); stage?.dispose(); };
  if (engine) engine.watchDetached(el, dispose);
  else { const ob = new MutationObserver(() => { if (!el.isConnected) { ob.disconnect(); dispose(); } }); ob.observe(document.body, { childList: true, subtree: true }); }
  choose(); drawRows(); return { rows, dispose };
}
export async function mountShadow2D(el, opts = {}) { return mountShadow(el, { ...opts, force2D: true }); }
