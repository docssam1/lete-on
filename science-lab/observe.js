// 자연관찰 연습 — #/observe. 원장 2026-10-23: 「자연관찰 대회는 이런 과정을 공부할 수 있어야 하고, 실사 이미지와 3D를 가지고 관찰하고 그릴 수 있게」.
// 왼쪽: 표본(3D 모형 · 실사 사진)을 돌리고, 위/옆에서 보고, 단면·자를 대고, 손으로 확인(물 떨어뜨리기·눌러 보기·꺼내 보기).
// 오른쪽: 대회 과제 순서의 보고서(관찰그림·설명 → 분류 나무 → 벤 다이어그램 → 구조와 기능 → 유리한 점 → 더 탐구). 그리기판에는 지금 보는 화면이 참고로 뜬다.
// 정답(이름·기능)은 바로 주지 않는다 — 이름은 「이름 확인」을 눌러야 보이고, 손 확인은 현상만 보여 주고 무엇을 봤는지는 아이가 쓴다.
import { Stage } from './engine.js';
import { SPECIMENS, VIEWS, mountSpecimen } from './scenes/specimens-water.js';
import { renderReport } from './report.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const UNIT = {
  id: 'observe-water', title: '물에 사는 식물 관찰',
  activity: {
    title: '물에 사는 식물 4종을 돌려 보고, 그리고, 나누고, 비교하기',
    materials: ['돋보기(루페)', '자', '핀셋', '흰 접시', '분무기', '칼(선생님과 함께)'],
    steps: ['표본을 전체·위·옆에서 보고 번호를 붙인다.', '부분(잎·잎자루·줄기·뿌리)마다 그리고 이름을 적는다.', '자로 재고, 눌러 보기·물 떨어뜨리기·잘라 보기로 확인한다.', '관찰한 사실과 추정을 나눠 설명을 쓴다.'],
  },
};
const STEPS = ['돌려 보며 관찰', '그리고 설명하기', '분류 나무', '두 종 비교(벤)', '구조와 기능 → 유리한 점', '더 탐구하고 싶은 것'];
const PHOTO = (id, n) => `./assets/observe/${id}-${n}.jpg`;

export function renderObserve($app, { topbar, footer }) {
  let stage = null, cur = null, mode = '3d', reveal = false, view = 'angle', sec = false, rul = false, idx = 0;
  $app.innerHTML = `${topbar('#/')}
  <main class="opened observe-page" style="--tab:#3f8f3a">
    <div class="wrap unit-head folder-label"><span class="label-tab">OBSERVE</span>
      <div class="crumb"><span class="tag" style="background:#3f8f3a;color:#fff;border-radius:999px;padding:2px 8px;font-size:11px;font-weight:700">자연관찰대회</span><span>연습</span></div>
      <h1>물에 사는 식물 관찰하기</h1>
      <p class="sub">대회처럼 이름 대신 번호로 부르고, 생김새를 그림과 글로 남겨요. 돌려 보고 · 위와 옆에서 보고 · 단면을 보고 · 자를 대고 · 손으로 확인한 것을 보고서에 써요.</p>
      <ol class="ob-steps">${STEPS.map((t, i) => `<li><b>${i + 1}</b>${esc(t)}</li>`).join('')}</ol>
    </div>
    <div class="wrap ob-grid">
      <section class="ob-viewer" aria-label="표본 보기">
        <div class="ob-tabs" role="tablist">${SPECIMENS.map((_, i) => `<button type="button" role="tab" data-spec="${i}">${'①②③④'[i]}</button>`).join('')}</div>
        <div class="ob-mode" role="group" aria-label="보기 방법"><button type="button" data-mode="3d">3D 모형</button><button type="button" data-mode="photo">실사 사진</button></div>
        <div class="ob-stage"><canvas aria-label="표본 3D 모형 — 끌어서 돌리기, Ctrl+휠·두 손가락으로 확대"></canvas><div class="ob-photo" hidden></div></div>
        <div class="ob-row ob-views">${Object.entries(VIEWS).map(([k, v]) => `<button type="button" data-view="${k}">${esc(v.name)}</button>`).join('')}<span class="sp"></span><button type="button" data-tg="section">✂ 단면 보기</button><button type="button" data-tg="ruler">📏 자 대기</button></div>
        <div class="ob-row ob-acts"></div>
        <p class="ob-note" aria-live="polite"></p>
        <details class="ob-think"><summary>생각할 거리</summary><ul></ul></details>
        <div class="ob-row"><button type="button" class="ob-reveal" data-reveal>이름 확인하기</button><span class="ob-name"></span></div>
      </section>
      <section class="ob-report" id="ob-report" aria-label="관찰 보고서"></section>
    </div>
  </main>${footer()}`;
  const $c = $app.querySelector('.ob-stage canvas'), $photo = $app.querySelector('.ob-photo');
  if (Stage.canWebGL()) stage = new Stage($c); else { mode = 'photo'; $c.hidden = true; }

  const draw = () => {
    const sp = SPECIMENS[idx];
    $app.querySelectorAll('[data-spec]').forEach((b) => b.setAttribute('aria-selected', String(+b.dataset.spec === idx)));
    $app.querySelectorAll('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    $app.querySelectorAll('[data-view]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
    $app.querySelector('[data-tg="section"]').setAttribute('aria-pressed', String(sec)); $app.querySelector('[data-tg="ruler"]').setAttribute('aria-pressed', String(rul));
    $c.hidden = mode !== '3d' || !stage; $photo.hidden = mode !== 'photo';
    $app.querySelectorAll('.ob-views button').forEach((b) => { b.disabled = mode !== '3d'; });
    const s = cur?.spec;
    $app.querySelector('.ob-acts').innerHTML = s ? Object.entries(s.actions).map(([k, a]) => `<button type="button" data-act="${k}" ${mode !== '3d' ? 'disabled' : ''}>${esc(a.name)}</button>`).join('') : '';
    $app.querySelector('.ob-think ul').innerHTML = (s?.think || []).map((t) => `<li>${esc(t)}</li>`).join('');
    $app.querySelector('.ob-name').textContent = reveal && s ? `${s.no} ${s.name} — ${s.hint}` : s ? `${s.no} ${s.hint}` : '';
    $app.querySelector('[data-reveal]').textContent = reveal ? '이름 숨기기' : '이름 확인하기';
    $app.querySelectorAll('[data-act]').forEach((b) => { b.onclick = () => { cur.run(b.dataset.act); $app.querySelector('.ob-note').textContent = cur.spec.actions[b.dataset.act].note + ' 본 것을 보고서 설명 칸에 써요.'; }; });
    if (mode === 'photo') {
      const id = s?.id || ['lily', 'duckweed', 'hyacinth', 'hydrilla'][idx];
      $photo.innerHTML = `<img alt="${esc(`${'①②③④'[idx]} 실사 사진`)}" src="${PHOTO(id, 1)}"><p class="ob-photo-none" hidden>이 표본의 실사 사진은 준비 중이에요. 3D 모형으로 관찰해요.</p>`;
      const img = $photo.querySelector('img'); img.onerror = () => { img.hidden = true; $photo.querySelector('.ob-photo-none').hidden = false; };
    }
  };
  const load = (i) => {
    idx = i; sec = false; rul = false; view = 'angle';
    if (stage) cur = mountSpecimen(stage, SPECIMENS[i]); else cur = { spec: SPECIMENS[i](), run() {}, setView() {}, toggle() {} };
    $app.querySelector('.ob-note').textContent = ''; draw();
  };
  $app.querySelectorAll('[data-spec]').forEach((b) => { b.onclick = () => load(+b.dataset.spec); });
  $app.querySelectorAll('[data-mode]').forEach((b) => { b.onclick = () => { if (b.dataset.mode === '3d' && !stage) return; mode = b.dataset.mode; draw(); }; });
  $app.querySelectorAll('[data-view]').forEach((b) => { b.onclick = () => { view = b.dataset.view; cur.setView(view); draw(); }; });
  $app.querySelectorAll('[data-tg]').forEach((b) => { b.onclick = () => { if (b.dataset.tg === 'section') { sec = !sec; cur.toggle('section', sec); } else { rul = !rul; cur.toggle('ruler', rul); } draw(); }; });
  $app.querySelector('[data-reveal]').onclick = () => { reveal = !reveal; draw(); };
  load(0);

  // 그리기판 참고 그림 = 지금 보이는 3D 화면(또는 실사 사진). 렌더 직후 같은 작업 안에서 읽어야 빈 그림이 아니다.
  const reference = () => {
    if (mode === 'photo') { const img = $photo.querySelector('img'); return img && !img.hidden && img.complete && img.naturalWidth ? img.src : null; }
    if (!stage) return null; stage.renderer.render(stage.scene, stage.camera); return $c.toDataURL('image/jpeg', 0.82);
  };
  const rep = renderReport(UNIT, $app.querySelector('#ob-report'), { embedded: true, reference });
  return { destroy() { rep.destroy(); stage?.dispose(); stage = null; } };
}
