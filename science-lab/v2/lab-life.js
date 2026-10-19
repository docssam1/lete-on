import { emptyLife, emptyDrawing, loadLife, saveLife, normalizeLife, newLifeExperiment, selectLifeExperiment, lifeExperiments, addObservation, experimentError, lifeRows, drawingSvg, lifeReportHtml, escapeLife as esc } from './life-records.js';
import { performance } from '../data/activities/s31-u04.performance.js';
import { growthExperiments } from '../data/activities/s31-u04.growth.js';
let instance = 0;
const clone = (s) => JSON.parse(JSON.stringify(s));
const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const tabs = [['observe', '관찰 기록'], ['experiment', '비교 실험'], ['draw', '사육장 그리기'], ['intro', '소개·공유']];
export function mountLife(host, options = {}) {
  const personal = options.personal !== false, prefix = `life-${++instance}`;
  let initial;
  try { initial = personal ? loadLife(localStorage) : { state: emptyLife(), error: '' }; }
  catch { initial = { state: emptyLife(), error: '기기 저장소를 사용할 수 없어요. 파일로 기록을 보관해 주세요.' }; }
  let state = initial.state, canSave = !initial.error, tab = tabs.some(([key]) => key === options.tab) ? options.tab : 'observe', editId = null, disposed = false;
  let stroke = null, strokeKey = null, penDown = false, cursor = [320, 180], undo = null;
  let rowDraft = state.experimentDraft;
  host.classList.add('life-notebook', 'gfield-ui');
  const $ = (s) => host.querySelector(s);
  const announce = (s, error = false) => { const el = $('[data-life-message]'); if (!el) return; el.textContent = s; el.classList.toggle('life-error', error); };
  function persist() {
    if (disposed) return;
    let okay = false;
    try { okay = personal && canSave && saveLife(localStorage, state); } catch { /* 파일 다운로드는 계속 제공한다. */ }
    const text = !personal ? '수업용 임시 기록 · 개인 기록을 읽거나 저장하지 않아요.' : okay ? '이 기기에 저장했어요.' : initial.error || '기기에 저장하지 못했어요. 기록 파일을 내려받아 보관해 주세요.';
    const el = $('[data-life-save]'); if (el && el.textContent !== text) el.textContent = text;
  }
  const field = (label, key, value, { multiline = true, type = 'text', hint = '' } = {}) => {
    const id = prefix + '-' + key.replace(/\./g, '-');
    return `<div class="life-field"><label for="${id}">${esc(label)}</label>${hint ? `<p class="life-hint" id="${id}-hint">${esc(hint)}</p>` : ''}${multiline
      ? `<textarea id="${id}" data-life-field="${key}" maxlength="10000"${hint ? ` aria-describedby="${id}-hint"` : ''}>${esc(value)}</textarea>`
      : `<input id="${id}" data-life-field="${key}" type="${type}" value="${esc(value)}" maxlength="200"${hint ? ` aria-describedby="${id}-hint"` : ''}>`}</div>`;
  };
  const button = (text, action, attrs = '') => `<button type="button" data-life-action="${action}" ${attrs}>${text}</button>`;
  const getDrawing = (key) => key === 'observation' ? state.draft.drawing : state.drawings[key];
  function drawing(key, label) {
    const d = getDrawing(key);
    return `<section class="life-draw" data-life-drawing="${key}"><h4>${esc(label)}</h4><p class="life-hint" id="${prefix}-${key}-help">손가락·마우스로 그려요. 키보드에서는 방향키로 이동하고 Space로 펜을 내리거나 올려요. Enter·Escape는 선을 끝내요. 아래 방향 단추로도 그릴 수 있어요.</p>
      <div class="life-board" tabindex="0" role="group" aria-label="${esc(label)} 그리는 곳" aria-describedby="${prefix}-${key}-help">${drawingSvg(d, false)}<span class="life-cursor" aria-hidden="true"></span></div>
      <div class="life-controls">${button('펜 내리기', 'pen', `aria-pressed="false" data-draw-key="${key}"`)}${[['← 왼쪽', '-1,0'], ['위쪽 ↑', '0,-1'], ['오른쪽 →', '1,0'], ['↓ 아래쪽', '0,1']].map(([t, dir]) => button(t, 'move', `data-direction="${dir}" data-draw-key="${key}"`)).join('')}${button('마지막 선 되돌리기', 'undo-line', `data-draw-key="${key}"`)}${button('그림 비우기', 'clear-drawing', `data-draw-key="${key}"`)}</div>
      ${field('그림 설명', key === 'observation' ? 'draft.drawing.description' : `drawings.${key}.description`, d.description, { hint: '어느 부분을 그렸는지 글로도 설명해 주세요.' })}</section>`;
  }
  function observe() {
    const d = state.draft;
    return `<h3>같은 생물의 변화를 글과 그림으로 남겨요</h3><p>날짜·같은 개체의 표시·겉모습·행동을 살펴요. 모르는 단계 이름은 비워 두고, 직접 본 사실과 내 생각을 나누어 적어요.</p>
      <form data-life-form="observe">${field('관찰한 날짜', 'draft.date', d.date, { multiline: false, type: 'date' })}${field('생물 이름·개체 표시', 'draft.species', d.species, { multiline: false, hint: '예: 화분 가의 강낭콩. 실제로 관찰한 대상을 적어요.' })}${field('관찰한 단계나 시기', 'draft.stage', d.stage, { multiline: false })}${field('직접 본 모습·행동', 'draft.facts', d.facts, { hint: '크기를 쟀다면 수치와 단위도 함께 적어요. 보지 않은 변화는 만들지 않아요.' })}${drawing('observation', '관찰한 모습 그리기')}${field('내 생각·더 궁금한 점', 'draft.thought', d.thought)}
      <button class="life-primary" type="submit">${editId ? '고친 기록 저장' : '관찰 기록 추가'}</button>${editId ? button('고치기 취소', 'cancel-edit') : ''}</form>
      <h3>내 관찰 일지 · ${state.observations.length}개</h3><div class="life-records">${state.observations.length ? state.observations.map((r) => `<article><h4>${esc(r.date)} · ${esc(r.species)}</h4><p>${esc(r.stage)}</p><p>${esc(r.facts)}</p><div class="life-thumb">${drawingSvg(r.drawing)}</div><p>${esc(r.drawing.description)}</p><p><b>내 생각</b> ${esc(r.thought || '미기록')}</p>${button('이 기록 고치기', 'edit-observation', `data-record-id="${esc(r.id)}"`)}${button('이 기록 지우기', 'remove-observation', `data-record-id="${esc(r.id)}"`)}</article>`).join('') : '<p>아직 기록이 없어요. 기록이 없다는 것은 변화가 없었다는 뜻이 아니에요.</p>'}</div>`;
  }
  function experiment() {
    const e = state.experiment;
    return `<h3>조건 하나만 바꾸어 비교해요</h3><p>강낭콩의 싹트기에서는 물이나 온도, 자람에서는 물이나 햇빛의 영향을 알아볼 수 있어요. 알아볼 조건 한 가지만 다르게 하고 다른 조건은 같게 준비해요. 결과는 며칠 동안 돌보며 직접 확인해요.</p>
      <div class="life-field"><label for="${prefix}-experiments">보관한 실험 · ${lifeExperiments(state).length}개</label><select id="${prefix}-experiments" data-life-experiment>${lifeExperiments(state).map((a) => `<option value="${esc(a.id)}"${a.id === state.experimentId ? ' selected' : ''}>${esc(a.experiment.question || '아직 제목을 적지 않은 실험')} · 결과 ${a.experiment.rows.length}개</option>`).join('')}</select></div>
      <p data-life-active>현재 실험: ${esc(e.question || '아직 제목을 적지 않은 실험')}</p>
      <div class="life-controls">${button('빈 실험 새로 만들기', 'new-experiment')}${growthExperiments.map((g) => button(`${esc(g.title)} 계획으로 새로 시작`, 'new-experiment', `data-growth="${g.key}"`)).join('')}</div><p class="life-hint">새 실험을 열어도 이전 계획·결과·작성 중인 내용은 보관해요. 아래 계획 예시는 실제로 정한 방법에 맞게 고쳐요. 예상과 실제 결과는 직접 적어요.</p>
      ${growthExperiments.map((g) => `<details><summary>${esc(g.title)} · 준비와 실행 방법</summary><p>${esc(g.materials)}</p><ol>${g.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol><p>${esc(g.care)}</p></details>`).join('')}
      ${field('알아볼 문제', 'experiment.question', e.question, { hint: '어떤 생물의 어떤 조건을 비교할지 정해요.' })}${field('실험하기 전 예상', 'experiment.hypothesis', e.hypothesis)}${field('가와 나에서 다르게 할 조건', 'experiment.change', e.change)}${field('같게 할 조건', 'experiment.same', e.same)}${field('언제·어떻게 관찰하거나 잴지', 'experiment.measure', e.measure, { hint: '같은 날짜에 비교하고, 수를 세거나 길이를 재면 단위도 정해요.' })}
      <form data-life-form="experiment"><h4>실제로 실험한 결과 추가</h4>${field('실험 날짜', 'row.date', rowDraft.date, { multiline: false, type: 'date' })}${field('가에서 직접 본 결과', 'row.a', rowDraft.a)}${field('나에서 직접 본 결과', 'row.b', rowDraft.b)}${field('두 결과를 비교해 알 수 있는 사실', 'row.fact', rowDraft.fact)}<button class="life-primary" type="submit">실험 결과 추가</button></form>
      <div class="life-records">${e.rows.length ? e.rows.map((r) => `<article><h4>${esc(r.date)}</h4>${r.question !== undefined && r.question !== e.question ? `<p>기록 당시 문제: ${esc(r.question)}</p>` : ''}<p><b>가</b> ${esc(r.a)}</p><p><b>나</b> ${esc(r.b)}</p><p><b>비교</b> ${esc(r.fact)}</p>${button('이 결과 지우기', 'remove-experiment', `data-record-id="${esc(r.id)}"`)}</article>`).join('') : '<p>실험 결과는 아직 미기록이에요. 예상은 결과와 따로 보관해요.</p>'}</div>
      ${field('기록을 근거로 쓴 결론', 'experiment.conclusion', e.conclusion, { hint: '실제 결과가 예상과 달라도 그대로 설명해요. 기록이 부족하면 더 관찰할 점을 적어요.' })}`;
  }
  function draw() {
    return `<h3>살아갈 환경을 그림으로 설계해요</h3>${performance.map((a) => `<section data-performance-id="${a.id}"><h4>${esc(a.label)}</h4>${a.context ? `<p>${esc(a.context)}</p>` : ''}${a.figure ? `<img class="life-source-photo" src="${a.figure}" alt="${esc(a.figureAlt)}" width="370" height="265">` : ''}<p>${esc(a.prompt)}</p>${a.sourceCaption ? `<p class="life-hint">출처: ${esc(a.sourceCaption)}</p>` : ''}${drawing(a.key, a.key === 'original' ? '사육장 모습' : '새 관찰 상자 설계')}</section>`).join('')}<p>그림의 완성도나 선의 개수로 자동 채점하지 않아요. 알맞은 먹이·환경이 마련되었는지 선생님과 함께 확인해요.</p>`;
  }
  function intro() {
    const i = state.intro;
    return `<h3>내 관찰을 한살이 소개 자료로 만들어요</h3><p>위의 관찰 기록과 그림도 내려받는 자료에 함께 들어가요. 관찰하지 않은 단계는 참고한 자료와 쪽수를 구분해 적어요.</p>
      ${field('소개 자료 제목', 'intro.title', i.title, { multiline: false })}${field('소개할 생물', 'intro.species', i.species, { multiline: false })}${field('한살이 순서와 각 단계의 특징', 'intro.sequence', i.sequence)}${field('내 기록에서 찾은 근거·참고 자료', 'intro.evidence', i.evidence, { hint: '관찰 날짜나 그림을 가리켜 설명해요. 다른 자료를 썼다면 제목과 쪽수를 밝혀요.' })}
      <h4>발표하고 질문을 나눠요</h4><p>자료를 내려받거나 이 화면을 보여 주며 발표할 수 있어요. 실제로 공유한 뒤에 아래 기록을 적어요.</p>
      ${field('누구와 나누었나요?', 'intro.audience', i.audience, { multiline: false })}${field('어떤 방법으로 나누었나요?', 'intro.method', i.method, { multiline: false })}${field('실제로 공유한 날짜', 'intro.sharedDate', i.sharedDate, { multiline: false, type: 'date' })}${field('친구나 선생님에게 들은 질문', 'intro.question', i.question)}${field('질문을 듣고 고치거나 더 관찰할 점', 'intro.revision', i.revision)}
      <p class="life-hint">공유 기록은 내가 적은 활동 기록이에요. 파일을 내려받은 것만으로 발표 완료나 공식 성적을 기록하지 않아요.</p>`;
  }
  function render(focusTab = false) {
    finish();
    rowDraft = state.experimentDraft; editId = state.draft.editingId || null;
    host.innerHTML = `<header class="life-heading"><h2>생물의 한살이 · 내 탐구 기록</h2><p data-life-save role="status"></p><div class="life-controls">${button('소개 자료 내려받기', 'download-html')}${button('기록 파일 보관', 'download-json')}<label class="life-file">기록 파일 불러오기<input type="file" accept="application/json,.json" data-life-import></label></div></header>
      <nav class="life-tabs" aria-label="탐구 기록 활동">${tabs.map(([k, label]) => button(label, 'tab', `data-tab="${k}" aria-pressed="${tab === k}"`)).join('')}</nav>
      <p data-life-message role="alert"></p><main class="life-pane">${({ observe, experiment, draw, intro }[tab])()}</main><div class="life-controls">${button('마지막 기록 변경 되돌리기', 'undo-record', undo ? '' : 'disabled')}</div>`;
    host.querySelectorAll('[data-life-drawing]').forEach(wireDrawing);
    persist(); if (focusTab) $(`[data-tab="${tab}"]`).focus({ preventScroll: true });
  }
  function finish() { if (stroke) { stroke = null; strokeKey = null; persist(); } penDown = false; }
  function wireDrawing(section) {
    const key = section.dataset.lifeDrawing, board = section.querySelector('.life-board'), svg = board.querySelector('svg');
    const paint = () => { svg.innerHTML = new DOMParser().parseFromString(drawingSvg(getDrawing(key), false), 'image/svg+xml').documentElement.innerHTML; const c = section.querySelector('.life-cursor'); c.style.left = (cursor[0] / 640 * 100) + '%'; c.style.top = (cursor[1] / 360 * 100) + '%'; const down = penDown && strokeKey === key; section.querySelector('[data-life-action="pen"]').setAttribute('aria-pressed', String(down)); section.querySelector('[data-life-action="pen"]').textContent = down ? '펜 올리기' : '펜 내리기'; };
    section._paint = paint;
    const point = (ev) => { const b = board.getBoundingClientRect(); return [Math.round(Math.max(0, Math.min(640, (ev.clientX - b.left) / b.width * 640))), Math.round(Math.max(0, Math.min(360, (ev.clientY - b.top) / b.height * 360)))]; };
    const start = () => { finish(); if (getDrawing(key).strokes.length >= 500) { announce('선이 500개예요. 마지막 선을 되돌리거나 그림을 비운 뒤 이어 그려요.', true); return false; } stroke = []; strokeKey = key; getDrawing(key).strokes.push(stroke); return true; };
    const addPoint = () => {
      if (!stroke) return;
      if (getDrawing(key).strokes.reduce((n, s) => n + s.length, 0) >= 20000) { if (!stroke.length) getDrawing(key).strokes.pop(); finish(); announce('그림의 점이 많아요. 기록 파일을 보관하고 선을 정리해 주세요.', true); return; }
      if (!stroke.length || stroke.at(-1).some((v, n) => Math.abs(v - cursor[n]) >= 2)) stroke.push([...cursor]); paint();
    };
    board.addEventListener('pointerdown', (ev) => { if (ev.button !== 0 || !ev.isPrimary) return; if (start()) { board.setPointerCapture(ev.pointerId); cursor = point(ev); addPoint(); board.focus({ preventScroll: true }); ev.preventDefault(); } });
    board.addEventListener('pointermove', (ev) => { if (board.hasPointerCapture(ev.pointerId) && strokeKey === key) { cursor = point(ev); addPoint(); } });
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) board.addEventListener(name, () => { if (strokeKey === key) finish(); paint(); });
    const move = (dx, dy, step = 8) => { cursor = [Math.max(0, Math.min(640, cursor[0] + dx * step)), Math.max(0, Math.min(360, cursor[1] + dy * step))]; if (penDown && strokeKey === key) addPoint(); paint(); };
    section._move = move;
    section._pen = () => { if (penDown && strokeKey === key) finish(); else if (start()) { penDown = true; addPoint(); } host.querySelectorAll('[data-life-drawing]').forEach((s) => s._paint?.()); };
    board.addEventListener('keydown', (ev) => { const moves = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }; if (moves[ev.key]) { ev.preventDefault(); move(...moves[ev.key], ev.shiftKey ? 2 : 8); } else if (ev.code === 'Space') { ev.preventDefault(); section._pen(); } else if (['Enter', 'Escape'].includes(ev.key)) { ev.preventDefault(); finish(); paint(); } });
    paint();
  }
  function download(name, body, mime) {
    finish(); const url = URL.createObjectURL(new Blob([body], { type: mime })), a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce('기록 파일을 내려받았어요. 실제 발표·전송 여부는 따로 기록해 주세요.');
  }
  function input(ev) {
    const key = ev.target.dataset.lifeField; if (!key) return;
    if (key === 'experiment.question') state.experiment.rows.forEach((r) => { r.question ??= state.experiment.question; });
    const names = key.split('.'); let target = names[0] === 'row' ? rowDraft : state;
    for (const name of names.slice(names[0] === 'row' ? 1 : 0, -1)) target = target[name];
    target[names.at(-1)] = ev.target.value;
    if (key === 'experiment.question') {
      $('[data-life-active]').textContent = `현재 실험: ${state.experiment.question || '아직 제목을 적지 않은 실험'}`;
      const selected = $('[data-life-experiment] option:checked'); if (selected) selected.textContent = `${state.experiment.question || '아직 제목을 적지 않은 실험'} · 결과 ${state.experiment.rows.length}개`;
    }
    persist();
  }
  function click(ev) {
    const b = ev.target.closest('[data-life-action]'); if (!b || !host.contains(b)) return;
    const a = b.dataset.lifeAction, key = b.dataset.drawKey;
    if (a === 'tab') { tab = b.dataset.tab; render(true); }
    else if (a === 'new-experiment') {
      finish(); const g = growthExperiments.find((g) => g.key === b.dataset.growth);
      const plan = g ? Object.fromEntries(['question', 'change', 'same', 'measure'].map((k) => [k, g[k]])) : {};
      const result = newLifeExperiment(state, uid(), plan);
      if (result.error) { announce(result.error, true); return; }
      undo = clone(state); state = result.state; render(); $('[data-life-field="experiment.question"]').focus(); announce('새 실험을 열었어요. 이전 실험은 위 목록에서 다시 열 수 있어요.');
    }
    else if (a === 'pen') b.closest('[data-life-drawing]')._pen();
    else if (a === 'move') { const [x, y] = b.dataset.direction.split(',').map(Number); b.closest('[data-life-drawing]')._move(x, y); }
    else if (a === 'undo-line' || a === 'clear-drawing') { finish(); undo = clone(state); if (a === 'undo-line') getDrawing(key).strokes.pop(); else getDrawing(key).strokes = []; render(); announce('그림을 바꿨어요. 아래 되돌리기로 복구할 수 있어요.'); }
    else if (a === 'undo-record') { finish(); if (!undo) return; const back = state; state = undo; undo = back; render(); options.onRecord?.(lifeRows(state)); announce('직전 기록 상태로 되돌렸어요.'); }
    else if (a === 'edit-observation') { const r = state.observations.find((r) => r.id === b.dataset.recordId); if (!r) return; finish(); undo = clone(state); state.draft = clone(r); delete state.draft.id; state.draft.editingId = r.id; render(); $('[data-life-field="draft.date"]').focus(); }
    else if (a === 'cancel-edit') { editId = null; state.draft = emptyLife().draft; render(); }
    else if (a === 'remove-observation' || a === 'remove-experiment') { finish(); undo = clone(state); if (a === 'remove-observation') state.observations = state.observations.filter((r) => r.id !== b.dataset.recordId); else state.experiment.rows = state.experiment.rows.filter((r) => r.id !== b.dataset.recordId); render(); options.onRecord?.(lifeRows(state)); announce('기록을 지웠어요. 아래 되돌리기로 복구할 수 있어요.'); }
    else if (a === 'download-html') {
      finish(); const snapshot = clone(state); b.disabled = true;
      (async () => {
        const response = await fetch(new URL(performance[0].figure, location.href)); if (!response.ok) throw Error();
        const blob = await response.blob();
        const data = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(blob); });
        if (!disposed) download('생물의-한살이-내-탐구기록.html', lifeReportHtml(snapshot, { figureData: { original: data } }), 'text/html;charset=utf-8');
      })().catch(() => { if (!disposed) announce('자료의 사진을 준비하지 못했어요. 입력 내용은 유지했어요. 잠시 뒤 다시 내려받거나 기록 파일로 보관해 주세요.', true); }).finally(() => { if (!disposed) b.disabled = false; });
    }
    else if (a === 'download-json') download('생물의-한살이-기록.json', JSON.stringify(state, null, 2), 'application/json');
  }
  function submit(ev) {
    ev.preventDefault(); finish();
    if (ev.target.dataset.lifeForm === 'observe') {
      const result = addObservation(state, editId || uid()); if (result.error) { announce(result.error, true); return; }
      undo = clone(state); state = result.state; editId = null; render(); options.onRecord?.(lifeRows(state)); announce('직접 쓴 글과 그림을 관찰 일지에 추가했어요.');
    } else {
      const error = experimentError(state.experiment, rowDraft); if (error) { announce(error, true); return; }
      undo = clone(state); state.experiment.rows.push({ ...rowDraft, id: uid(), question: state.experiment.question }); state.experimentDraft = { date: '', a: '', b: '', fact: '' }; render(); options.onRecord?.(lifeRows(state)); announce('실제 실험 결과를 추가했어요.');
    }
  }
  async function change(ev) {
    if (ev.target.matches('[data-life-experiment]')) {
      finish(); undo = clone(state); state = selectLifeExperiment(state, ev.target.value); render(); $('[data-life-experiment]').focus(); announce('선택한 실험의 계획과 결과를 열었어요.'); return;
    }
    if (!ev.target.matches('[data-life-import]') || !ev.target.files?.[0]) return;
    try {
      const file = ev.target.files[0]; if (file.size > 8 * 1024 * 1024) throw Error();
      const next = normalizeLife(JSON.parse(await file.text())); if (disposed) return;
      finish(); undo = clone(state); state = next; canSave = true; initial.error = ''; editId = null; render(); options.onRecord?.(lifeRows(state)); announce('선택한 기록 파일을 불러왔어요. 이전 내용은 되돌리기로 복구할 수 있어요.');
    } catch { announce('이 파일의 기록을 읽지 못했어요. 현재 내용은 유지했어요.', true); }
  }
  host.addEventListener('input', input); host.addEventListener('click', click); host.addEventListener('submit', submit); host.addEventListener('change', change);
  render();
  return { dispose() { finish(); disposed = true; host.removeEventListener('input', input); host.removeEventListener('click', click); host.removeEventListener('submit', submit); host.removeEventListener('change', change); }, getState: () => clone(state) };
}
