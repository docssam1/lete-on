// 자연관찰 연습 — #/observe/<세트>. 원장 2026-10-23: 「자연관찰 대회는 이런 과정을 공부할 수 있어야 하고, 실사 이미지와 3D를 가지고 관찰하고 그릴 수 있게」.
// 세트(data/observe-sets.js)마다 대회 과제 유형이 다르다: 곤충 두 장소 비교(초등) · 잎차례(초등) · 물에 사는 식물(중등).
// 왼쪽: 표본(3D 모형 · 실사 사진)을 돌리고, 위/옆에서 보고, 도구(단면·자·마디 표시)를 켜고, 손으로 확인(물 떨어뜨리기·뒤집기·날개 펴기·흙 쥐기…).
// 오른쪽: 대회 과제 순서의 보고서. 그리기판에는 지금 보는 화면이 참고로 뜬다(옆에만 — 본뜨기 금지).
// 정답(이름·기능)은 바로 주지 않는다 — 이름은 「이름 확인」을 눌러야 보이고, 손 확인은 현상만 보여 주고 무엇을 봤는지는 아이가 쓴다.
import { Stage } from './engine.js';
import { OBSERVE_SETS, observeSet } from './data/observe-sets.js';
import { renderReport } from './report.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const CIRCLED = '①②③④⑤⑥⑦⑧⑨⑩';
const PHOTO = (id, n) => `./assets/observe/${id}-${n}.jpg`;

export function renderObserve($app, { topbar, footer }, setId) {
  const S = observeSet(setId), M = S.mod;
  let stage = null, cur = null, mode = '3d', reveal = false, view = 'angle', idx = 0; const on = {};
  $app.innerHTML = `${topbar('#/')}
  <main class="opened observe-page" style="--tab:#3f8f3a">
    <div class="wrap unit-head folder-label"><span class="label-tab">OBSERVE</span>
      <div class="crumb"><span class="tag" style="background:#3f8f3a;color:#fff;border-radius:999px;padding:2px 8px;font-size:11px;font-weight:700">자연관찰대회</span><span class="lv">${S.level === 'mid' ? '중등' : '초등'}</span><span>연습</span></div>
      <nav class="ob-sets" aria-label="연습 세트">${OBSERVE_SETS.map((x) => `<a href="#/observe/${x.id}" aria-current="${x.id === S.id}">${esc(x.short)}<small>${x.level === 'mid' ? '중등' : '초등'}</small></a>`).join('')}</nav>
      <h1>${esc(S.title)}</h1>
      <p class="sub">${esc(S.lead)}</p>
      <ol class="ob-steps">${S.steps.map((t, i) => `<li><b>${i + 1}</b>${esc(t)}</li>`).join('')}</ol>
    </div>
    <div class="wrap ob-grid">
      <section class="ob-viewer" aria-label="표본 보기">
        <div class="ob-tabs" role="tablist">${M.SPECIMENS.map((_, i) => `<button type="button" role="tab" data-spec="${i}">${CIRCLED[i]}</button>`).join('')}</div>
        <div class="ob-row"><span class="ob-mode" role="group" aria-label="보기 방법"><button type="button" data-mode="3d">3D 모형</button><button type="button" data-mode="photo">실사 사진</button></span><span class="sp"></span><span class="ob-place" role="group" aria-label="장소"></span></div>
        <div class="ob-stage"><canvas aria-label="표본 3D 모형 — 끌어서 돌리기, Ctrl+휠·두 손가락으로 확대"></canvas><div class="ob-photo" hidden></div></div>
        <div class="ob-row ob-views">${Object.entries(M.VIEWS).map(([k, v]) => `<button type="button" data-view="${k}">${esc(v.name)}</button>`).join('')}<span class="sp"></span>${(M.TOOLS || []).map((t) => `<button type="button" data-tg="${t.id}">${esc(t.name)}</button>`).join('')}</div>
        <div class="ob-acts-wrap"><div class="ob-row ob-acts" data-group="hand"></div><div class="ob-row ob-acts env" data-group="env"></div></div>
        <p class="ob-note" aria-live="polite"></p>
        <details class="ob-think"><summary>생각할 거리</summary><ul></ul></details>
        <div class="ob-row"><button type="button" class="ob-reveal" data-reveal>이름 확인하기</button><span class="ob-name"></span></div>
      </section>
      <section class="ob-report" id="ob-report" aria-label="관찰 보고서"></section>
    </div>
  </main>${footer()}`;
  const $c = $app.querySelector('.ob-stage canvas'), $photo = $app.querySelector('.ob-photo'), $note = $app.querySelector('.ob-note');
  if (Stage.canWebGL()) stage = new Stage($c); else { mode = 'photo'; $c.hidden = true; }
  if (typeof window !== 'undefined') window.__obStage = stage;   // 검사 스크립트용

  const draw = () => {
    const s = cur?.spec;
    $app.querySelectorAll('[data-spec]').forEach((b) => b.setAttribute('aria-selected', String(+b.dataset.spec === idx)));
    $app.querySelectorAll('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    $app.querySelectorAll('[data-view]').forEach((b) => { b.setAttribute('aria-pressed', String(b.dataset.view === view)); b.disabled = mode !== '3d'; });
    $app.querySelectorAll('[data-tg]').forEach((b) => { b.setAttribute('aria-pressed', String(!!on[b.dataset.tg])); b.disabled = mode !== '3d'; });
    $c.hidden = mode !== '3d' || !stage; $photo.hidden = mode !== 'photo';
    const acts = cur?.actions ? cur.actions() : [];
    for (const grp of ['hand', 'env']) $app.querySelector(`.ob-acts[data-group="${grp}"]`).innerHTML = (grp === 'env' && acts.some((a) => a.env) ? '<span class="ob-grp">환경 확인</span>' : '') + acts.filter((a) => !!a.env === (grp === 'env')).map((a) => `<button type="button" data-act="${a.id}" ${mode !== '3d' ? 'disabled' : ''}>${esc(a.name)}</button>`).join('');
    const $pl = $app.querySelector('.ob-place'); $pl.innerHTML = cur?.places ? cur.places.map((p) => `<button type="button" data-place="${p.id}" aria-pressed="${cur.place() === p.id}">${esc(p.name)}</button>`).join('') : '';
    $pl.querySelectorAll('[data-place]').forEach((b) => { b.onclick = () => { cur.setPlace(b.dataset.place); $note.textContent = `${b.textContent}로 바꿨어요. 같은 방법으로 환경을 확인해 비교해요.`; draw(); }; });
    $app.querySelector('.ob-think ul').innerHTML = (s?.think || []).map((t) => `<li>${esc(t)}</li>`).join('');
    $app.querySelector('.ob-name').textContent = reveal && s ? `${s.no} ${s.name} — ${s.hint}` : s ? `${s.no} ${s.hint}` : '';
    $app.querySelector('[data-reveal]').textContent = reveal ? '이름 숨기기' : '이름 확인하기';
    $app.querySelectorAll('[data-act]').forEach((b) => { b.onclick = () => { const note = cur.run(b.dataset.act); $note.textContent = (note || '') + ' 본 것을 보고서에 써요.'; }; });
    if (mode === 'photo') {
      $photo.innerHTML = `<img alt="${esc(`${CIRCLED[idx]} 실사 사진`)}" src="${PHOTO(s?.id || idx, 1)}"><p class="ob-photo-none" hidden>이 표본의 실사 사진은 준비 중이에요. 3D 모형으로 관찰해요.</p>`;
      const img = $photo.querySelector('img'); img.onerror = () => { img.hidden = true; $photo.querySelector('.ob-photo-none').hidden = false; };
    }
  };
  const load = (i) => {
    idx = i; view = 'angle'; for (const k in on) on[k] = false;
    if (stage) cur = M.mountSpecimen(stage, M.SPECIMENS[i]); else cur = { spec: M.SPECIMENS[i](), run() { return null; }, setView() {}, toggle() {}, actions: () => [] };
    $note.textContent = ''; draw();
  };
  $app.querySelectorAll('[data-spec]').forEach((b) => { b.onclick = () => load(+b.dataset.spec); });
  $app.querySelectorAll('[data-mode]').forEach((b) => { b.onclick = () => { if (b.dataset.mode === '3d' && !stage) return; mode = b.dataset.mode; draw(); }; });
  $app.querySelectorAll('[data-view]').forEach((b) => { b.onclick = () => { view = b.dataset.view; cur.setView(view); draw(); }; });
  $app.querySelectorAll('[data-tg]').forEach((b) => { b.onclick = () => { const k = b.dataset.tg; on[k] = !on[k]; cur.toggle(k, on[k]); draw(); }; });
  $app.querySelector('[data-reveal]').onclick = () => { reveal = !reveal; draw(); };
  load(0);

  // 그리기판 참고 그림 = 지금 보이는 3D 화면(또는 실사 사진). 렌더 직후 같은 작업 안에서 읽어야 빈 그림이 아니다.
  const reference = () => {
    if (mode === 'photo') { const img = $photo.querySelector('img'); return img && !img.hidden && img.complete && img.naturalWidth ? img.src : null; }
    if (!stage) return null; stage.renderer.render(stage.scene, stage.camera); return $c.toDataURL('image/jpeg', 0.82);
  };
  const rep = renderReport(S.unit, $app.querySelector('#ob-report'), { embedded: true, reference });
  return { destroy() { rep.destroy(); stage?.dispose(); stage = null; } };
}
