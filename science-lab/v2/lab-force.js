// 예상한 뒤 관찰하고, 그때의 설정과 결과를 함께 적는 수평 모형 실험.
import { FORCE_OBJECTS, FORCE_PAIRS, FORCE_PREDICTIONS, forceBalance, forceRecord, validForceRow } from './force-model.js';
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let serial = 0;
export async function mountForce(el, opts = {}) {
  const prefix = `force-${++serial}`, rows = (opts.rows || []).filter(validForceRow).map((r) => ({ ...r }));
  let setup = { pair: 'ab', left: 3, right: 3 }, prediction = '', observed = false, disposed = false, stage = null, model = null;
  const abort = new AbortController(), on = (node, name, fn) => node.addEventListener(name, fn, { signal: abort.signal });
  el.classList.add('force-lab');
  el.innerHTML = `<p class="force-notice">수평 모형 실험 · 물체의 무게와 움직임은 설명을 위해 정한 모형 값이에요. 실제로 물체를 밀고 당기거나 저울을 사용하는 활동은 교재에서 따로 해요.</p>
    <div class="force-layout"><section class="force-model-view"><div class="lab3d force-stage"><canvas aria-label="수평대와 두 물체의 3D 모형. 관찰 전에는 잠금 받침이 수평대를 받쳐요."></canvas><div class="force-fallback" hidden></div></div>
    <p data-force-result role="status">아직 관찰하지 않았어요. 잠금 받침이 수평대를 받치고 있어요.</p></section><div class="force-controls">
    <div class="force-setup"><label for="${prefix}-pair">비교할 물체</label><select id="${prefix}-pair" data-force="pair">${Object.entries(FORCE_PAIRS).map(([key, pair]) => `<option value="${key}">왼쪽 ${FORCE_OBJECTS[pair[0]].name} · 오른쪽 ${FORCE_OBJECTS[pair[1]].name}</option>`).join('')}</select>
    ${['left', 'right'].map((key) => `<label for="${prefix}-${key}">${key === 'left' ? '왼쪽' : '오른쪽'} 물체 위치 · 받침점에서 떨어진 칸</label><select id="${prefix}-${key}" data-force="${key}">${[1, 2, 3, 4, 5].map((n) => `<option value="${n}"${n === 3 ? ' selected' : ''}>${n}칸</option>`).join('')}</select>`).join('')}</div>
    <fieldset class="force-predictions"><legend>잠금 받침을 빼면 어떻게 될까요?</legend>${Object.entries(FORCE_PREDICTIONS).map(([key, text]) => `<label><input type="radio" name="${prefix}-prediction" value="${key}">${text}</label>`).join('')}</fieldset>
    <div class="lab3d-btns"><button type="button" data-force-act="observe" disabled>잠금 받침 빼고 관찰</button><button type="button" data-force-act="record" disabled>모형 결과 표에 적기</button></div></div></div>
    <p class="force-hint">무게를 비교할 때는 두 물체를 받침점에서 같은 거리에 놓아요. 위치가 다르면 기울어진 쪽만 보고 더 무겁다고 정할 수 없어요.</p>
    <div class="force-table-wrap"><table class="lab-table"><caption>내가 관찰한 수평 모형 결과</caption><thead><tr><th>왼쪽</th><th>오른쪽</th><th>관찰 전 예상</th><th>관찰 결과</th></tr></thead><tbody></tbody></table></div>`;
  const $ = (s) => el.querySelector(s), canvas = $('canvas'), fallback = $('.force-fallback');
  const initialMessage = '아직 관찰하지 않았어요. 잠금 받침이 수평대를 받치고 있어요.';
  const renderRows = () => { $('tbody').innerHTML = rows.length ? rows.map((r) => `<tr>${[`${r.leftName} · ${r.left}칸`, `${r.rightName} · ${r.right}칸`, FORCE_PREDICTIONS[r.prediction], r.observation].map((v) => `<td>${esc(v)}</td>`).join('')}</tr>`).join('') : '<tr><td colspan="4">아직 관찰해 적은 모형 결과가 없어요.</td></tr>'; };
  function render2D() {
    const m = forceBalance(setup), angle = observed ? m.angle : 0, degree = -angle * 180 / Math.PI;
    const [a, b] = FORCE_PAIRS[setup.pair].map((k) => FORCE_OBJECTS[k].name);
    fallback.innerHTML = `<svg viewBox="0 0 640 360" role="img" aria-label="수평대의 옆모습 모형"><path d="M285 305L320 150L355 305Z" fill="#d8dee8" stroke="#566274" stroke-width="3"/><g transform="rotate(${degree} 320 150)"><path d="M65 150H575" stroke="#ad8e68" stroke-width="15"/>${[[-1, setup.left, a], [1, setup.right, b]].map(([sign, distance, name]) => { const x = 320 + sign * distance * 44; return `<path d="M${x} 150v40" stroke="#566274" stroke-width="3"/><rect x="${x - 20}" y="190" width="40" height="40" fill="#2456c4"/><text x="${x}" y="120" text-anchor="middle" fill="#182230" font-size="19">${esc(name)}</text>`; }).join('')}</g>${observed ? '' : '<path d="M80 250V157M560 250V157" stroke="#8794a7" stroke-width="12"/>'}<text x="320" y="337" text-anchor="middle" fill="#182230" font-size="19">${observed ? '관찰한 모형' : '잠금 받침으로 지지 중'}</text></svg>`;
  }
  function paint() {
    if (disposed) return;
    const m = forceBalance(setup);
    model?.update(setup, observed);
    if (model?.labels) {
      // 라벨을 새로 만들지 않고 공용 키트로 문구만 바꾼다.
      const names = [m.leftName, m.rightName]; model.labels.forEach((l, i) => model.relabel(l, names[i], { size: 0.25 }));
    }
    if (!stage) render2D();
    $('[data-force-act="observe"]').disabled = !prediction || observed;
    $('[data-force-act="record"]').disabled = !observed || rows.length >= 200;
    $('[data-force-result]').textContent = observed ? `관찰 결과: ${m.text}. ${setup.left === setup.right ? '두 물체를 같은 거리에 놓은 결과예요.' : '두 위치가 달라 이 기울기만으로 무게를 비교하지 않아요.'}` : initialMessage;
  }
  on(el, 'change', (event) => {
    const k = event.target.dataset.force;
    if (k) { setup = { ...setup, [k]: k === 'pair' ? event.target.value : Number(event.target.value) }; prediction = ''; observed = false; el.querySelectorAll('input[type="radio"]').forEach((r) => { r.checked = false; }); paint(); }
    else if (event.target.name === `${prefix}-prediction`) { prediction = event.target.value; paint(); }
  });
  on(el, 'click', (event) => {
    const action = event.target.closest('[data-force-act]')?.dataset.forceAct;
    if (action === 'observe' && prediction && !observed) {
      observed = true; paint();
      const view = $('.force-model-view'), rect = view.getBoundingClientRect();
      if (!el.classList.contains('full-land') && (rect.bottom < 100 || rect.top > innerHeight - 120)) view.scrollIntoView({ block: 'start' });
    }
    if (action === 'record' && observed && rows.length < 200) {
      const row = forceRecord(setup, prediction);
      if (!rows.some((r) => JSON.stringify(r) === JSON.stringify(row))) rows.push(row);
      renderRows(); paint(); opts.onRecord?.(rows.map((r) => ({ ...r })));
      $('[data-force-result]').textContent = `모형 결과를 표에 적었어요. ${forceBalance(setup).text}. 다른 위치를 고르면 다시 예상하고 관찰해요.`;
    }
  });
  renderRows(); paint();
  let cleanup = () => {};
  try {
    const [{ Stage, watchDetached }, scene, kit] = await Promise.all([import('../engine.js'), import('../scenes/force-balance.js'), import('../scenes/_kit.js')]);
    if (!el.isConnected || disposed) return { rows, dispose };
    if (!Stage.canWebGL() || opts.force2D) throw Error('대체 모형');
    stage = new Stage(canvas); model = scene.buildForceBalance(); model.relabel = kit.relabel; stage.root.add(model.group);
    stage.setView(scene.BALANCE_VIEW); stage.setContactShadow({ x: 0, z: 0, w: 5.4, d: 2.2 });
    cleanup = watchDetached(el, () => { stage?.dispose(); abort.abort(); disposed = true; });
    paint();
  } catch { cleanup(); stage?.dispose(); stage = null; model = null; canvas.hidden = true; fallback.hidden = false; paint(); }
  function dispose() { if (disposed) return; disposed = true; abort.abort(); cleanup(); stage?.dispose(); }
  return { rows, dispose, getState: () => ({ setup: { ...setup }, prediction, observed, rows: rows.map((r) => ({ ...r })) }) };
}
