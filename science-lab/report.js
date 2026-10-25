// 탐구보고서 화면 — #/u/<실험>/report, #/observe(자연관찰 연습, embedded). 학생 쓰기(미리 채움 → 자기 말로 다듬기 → 표·그림·사진 → 인쇄)와 선생님 첨삭.
// 양식 = 대회(과학탐구·자연관찰·발명) × 수준(초등·중등). 자연관찰은 대상마다 「관찰그림 | 설명」 한 줄 · 분류 나무 · 벤 다이어그램(대회 과제 유형).
// 첨삭(원장 2026-10-23): 글을 드래그해 형광펜 · 고치기(글 위에 바른 말, 손글씨) · 말풍선. 칸마다 [가이드 넣기]·[질문 넣기] 버튼(미리 준비한 문구 + 직접 쓰기).
// 표시는 글자 위치가 아니라 덮은 글(t)을 닻으로 잡아, 아이가 위를 고쳐도 같은 낱말에 남는다(report-model.js segments). 저장은 이 기기(localStorage)에만.
import { levelOf, domainOf, LEVELS, CONTESTS } from './data/curriculum.js';
import { reportCfg, primaryContest, REPORTS } from './data/reports.js';
import {
  formTemplate, prefill, emptyTable, tableTouched, chartData, withMean, segments, newId, STORE, emptyReport, validReport, obsKey, textKeys, VENN,
  treeNode, syncTree, splitTree, unsplitTree, treeAt, treeIssues,
} from './report-model.js';
import { openSketch } from './sketch.js';
import { TECHNIQUES, SCENES, WORKS, JUDGING } from './data/invent-gallery.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const MODE_KEY = 'sciLab.reportMode';
const save = (r) => { r.updatedAt = Date.now(); try { localStorage.setItem(STORE(r.unit), JSON.stringify(r)); return true; } catch { return false; } };
const VENN_ASK = { a: '이것만의 특징', both: '둘 다 그런 점', b: '이것만의 특징' };
const CIRCLED = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫';

export function renderReport(u, $app, { topbar, footer, embedded = false, reference = null } = {}) {
  const d = domainOf(u) || { color: '#2f7d6d', title: '자연관찰' };
  const lv0 = levelOf(u)?.id || REPORTS[u.id]?.level || 'elem', ct0 = primaryContest(u.id);
  let R = null;
  try { const r = JSON.parse(localStorage.getItem(STORE(u.id)) || 'null'); if (validReport(r) && r.unit === u.id) R = r; } catch { /* */ }
  if (!R) R = emptyReport(u, reportCfg(u.id, lv0, ct0), lv0, ct0);
  R.contest ||= 'inquiry';   // 대회 구분 전에 쓴 보고서는 과학탐구 양식이었다
  R.trees ||= {};
  let cfg, T;
  const setForm = () => {
    cfg = reportCfg(u.id, R.level, R.contest); T = formTemplate(R.contest, R.level);
    if (u.reportSkip?.length) T = { ...T, cells: T.cells.filter((c) => !u.reportSkip.includes(c.key)) };   // 연습 세트에 맞지 않는 칸(예: 잎차례엔 두 장소 비교) 빼기
    if (u.reportPatch) T = { ...T, cells: T.cells.map((c) => (u.reportPatch[c.key] ? { ...c, ...u.reportPatch[c.key] } : c)) };
    if (u.reportOrder) { const at = (c) => { const i = u.reportOrder.indexOf(c.key); return i < 0 ? 99 : i; }; T = { ...T, cells: T.cells.slice().sort((x, y) => at(x) - at(y)) }; }
    if (T.cells.some((c) => c.kind === 'obs') && !R.cells.__obs) Object.assign(R.cells, Object.fromEntries(Object.entries(prefill(u, cfg, R.level, R.contest)).filter(([k]) => k === '__obs' || k.endsWith('.label'))));
  };
  setForm();
  let teach = sessionStorage.getItem(MODE_KEY) === 'teach';
  const editing = new Set();   // 지금 타자 중인 글 칸(학생)
  const resetEditing = () => { editing.clear(); for (const k of textKeys(T, R.cells)) if (!(R.cells[k] || '').trim()) editing.add(k); };
  resetEditing();
  const contestOf = (id) => CONTESTS.find((c) => c.id === id) || CONTESTS[0];
  // 분류 나무에 쓰는 대상 이름 = 관찰그림 칸의 이름표(없으면 ①②③). 관찰그림 칸이 없는 양식은 ①~⑥.
  const objLabels = () => {
    const obs = T.cells.find((c) => c.kind === 'obs'); const n = obs ? R.cells.__obs || obs.obs || 4 : 6;
    return Array.from({ length: n }, (_, i) => (obs && String(R.cells[obsKey(obs.key, i, 'label')] || '').trim()) || CIRCLED[i] || String(i + 1));
  };

  const shell = () => {
    const y = scrollY, nMarks = R.marks.length, nNotes = R.notes.length, open = R.notes.filter((n) => !n.done).length, ct = contestOf(R.contest);
    const head = embedded ? '' : `<div class="wrap unit-head folder-label"><span class="label-tab">REPORT</span>
        <div class="crumb"><span class="tag" style="background:${d.color};color:#fff;border-radius:999px;padding:2px 8px;font-size:11px;font-weight:700">${esc(d.title)}</span><span class="lv">${esc(T.title)}</span><span>·</span><a href="#/u/${u.id}">${esc(u.title)}</a></div>
        <h1>${R.contest === 'invent' ? '발명 보고서' : R.contest === 'nature' ? '자연관찰 보고서' : '탐구보고서'}</h1><p class="sub">${esc(u.activity?.title || u.title)} — ${esc(T.note)}</p>
      </div>`;
    const body = `
      <div class="${embedded ? '' : 'wrap'}">
        <div class="rp-bar no-print">
          <span class="seg contest" role="group" aria-label="대회">${CONTESTS.map((c) => `<button type="button" data-contest="${c.id}" aria-pressed="${R.contest === c.id}" title="${esc(c.sub)}">${esc(c.short)}</button>`).join('')}</span>
          <span class="seg" role="group" aria-label="수준">${LEVELS.map((l) => `<button type="button" data-level="${l.id}" aria-pressed="${R.level === l.id}">${esc(l.title)}</button>`).join('')}</span>
          <span class="seg teach" role="group" aria-label="모드"><button type="button" data-mode="study" aria-pressed="${!teach}">✏️ 학생 쓰기</button><button type="button" data-mode="teach" aria-pressed="${teach}">🖍 선생님 첨삭</button></span>
          <span class="sp"></span>
          <span class="count">${nMarks ? `표시 ${nMarks}` : ''}${nNotes ? ` · 메모 ${nNotes}(남은 것 ${open})` : ''}</span>
          <button type="button" class="btn" data-print="marks">A4로 인쇄</button>
          ${nMarks || nNotes ? '<button type="button" class="btn" data-print="clean">첨삭 없이 인쇄</button>' : ''}
          ${teach ? '<button type="button" class="btn" data-clear-marks>첨삭 전부 지우기</button>' : '<button type="button" class="btn" data-reset>처음부터</button>'}
        </div>
        <p class="rp-tip">${teach
          ? '<b>첨삭 방법</b> 글을 드래그하면 <b>형광펜 · 고치기 · 말풍선</b> 막대가 떠요. 고치기는 틀린 말 위에 바른 말을 빨간 손글씨로 올려요. 표시를 누르면 지워져요. 칸 아래 <b>가이드 넣기 · 질문 넣기</b>로 포스트잇을 붙여요.'
          : `미리 채워진 글은 <b>자기 말로 고쳐</b> 써요. ${T.cells.some((c) => c.kind === 'obs' || c.photos) ? '<b>✎ 그리기</b>로 화면에 직접 그리거나, 종이에 그려 <b>📷 사진</b>으로 붙여요. ' : ''}선생님 메모를 반영했으면 <b>고쳤어요</b>에 표시해요.`}</p>
        <article class="rp-sheet form-${R.contest}" id="rp-sheet">
          <header class="rp-head"><div><div class="kind">${esc(ct.title)} · ${esc(T.title)}</div><h1>${esc(u.title)}</h1></div>
            <div class="rp-who"><span>이름</span><input data-who="name" value="${esc(R.cells.__name || '')}" placeholder="이름"><span>학년·반</span><input data-who="grade" value="${esc(R.cells.__grade || '')}" placeholder="${R.level === 'mid' ? '중1' : '4학년 2반'}"><span>날짜</span><input data-who="date" value="${esc(R.cells.__date || '')}" placeholder="2026-10-23"></div></header>
          ${T.cells.map((c, i) => cellHtml(c, i)).join('')}
          <div class="rp-checks"><h3>스스로 점검</h3>${T.checks.map((t, i) => `<label><input type="checkbox" data-check="${i}" ${R.cells.__checks?.includes(i) ? 'checked' : ''}> ${esc(t)}</label>`).join('')}</div>
          <div class="rp-foot"><span>GFIELD · ${esc(ct.title)} · ${esc(T.title)}</span><span>${R.updatedAt ? '저장 ' + new Date(R.updatedAt).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</span></div>
        </article>
      </div>`;
    $app.innerHTML = embedded ? `<div class="report-page embedded ${teach ? 'teach' : ''}">${body}</div>`
      : `${topbar(`#/u/${u.id}`)}<main class="opened report-page ${teach ? 'teach' : ''}" style="--tab:${d.color}">${head}${body}</main>${footer()}`;
    bind(); bindSheet();
    if (!embedded) scrollTo(0, y);
  };

  // ── 칸 그리기 ──
  const subText = (key, ask, rows) => `<div class="rp-text ${editing.has(key) && !teach ? 'editing' : ''}" data-text="${key}">
      <div class="rp-view" data-view="${key}"></div>
      <textarea class="rp-edit" data-cell="${key}" rows="${rows || 3}" placeholder="${esc(ask || '')}">${esc(R.cells[key] || '')}</textarea>
      <p class="rp-lost" data-lost="${key}" hidden></p>
      ${teach ? '' : `<div class="rp-ctl mini no-print"><button type="button" data-edit="${key}">✏ 고쳐 쓰기</button><button type="button" class="primary" data-done="${key}">✓ 다 썼어요</button></div>`}</div>`;
  const cellHtml = (c, i) => {
    const notes = R.notes.filter((n) => n.cell === c.key);
    const pageBreak = R.level === 'mid' && c.brk ? '<div class="rp-break"></div>' : '';
    const photos = c.photos ? `<div class="rp-photos" data-photos="${c.key}">${photosHtml(c.key, 3)}</div>` : '';
    const body = c.kind === 'table' ? tableHtml(c) : c.kind === 'obs' ? obsHtml(c) : c.kind === 'venn' ? vennHtml(c)
      : c.kind === 'tree' ? `<div class="rp-tree-wrap" data-tree="${c.key}">${treeHtml(c.key)}</div>${subText(c.key, '분류 기준마다 왜 그 기준을 골랐는지', c.lines)}`
      : subText(c.key, c.ask, c.lines) + photos + (c.gallery ? galleryBtn(c.key) : '');
    const ctl = teach ? `<div class="rp-ctl no-print"><details class="rp-add"><summary class="g">✎ 가이드 넣기</summary>${menuHtml(c.key, 'guide')}</details><details class="rp-add"><summary class="q">? 질문 넣기</summary>${menuHtml(c.key, 'question')}</details></div>` : '';
    return `${pageBreak}<section class="rp-cell kind-${c.kind || 'text'}" data-key="${c.key}"><h3>${i + 1}. ${esc(c.title)}${c.ask ? `<small>${esc(c.ask)}</small>` : ''}</h3>
      <div class="rp-body">${body}${ctl}<div class="rp-notes" data-notes="${c.key}">${notes.map(noteHtml).join('')}</div></div></section>`;
  };
  const photoIdx = (key) => R.photos.map((p, i) => ({ p, i })).filter(({ p }) => (p.cell || 'result') === key);
  const photosHtml = (key, max) => {
    const list = photoIdx(key);
    return `${list.map(({ p, i }) => `<figure class="rp-photo"><img src="${p.src}" alt="${esc(p.cap || '그림')}">${teach ? `<figcaption>${esc(p.cap || '')}</figcaption>` : `<input data-cap="${i}" value="${esc(p.cap || '')}" placeholder="설명(무엇·어디서 본 모습)"><button type="button" class="x" data-del-photo="${i}" aria-label="지우기">×</button>${p.drawn ? `<button type="button" class="redraw no-print" data-redraw="${i}">✎ 고쳐 그리기</button>` : ''}`}</figure>`).join('')}
      ${!teach && list.length < max ? `<span class="rp-add-media no-print"><button type="button" class="rp-photo-add" data-draw-new="${key}">✎ 그리기</button><label class="rp-photo-add">📷 사진 붙이기<input type="file" accept="image/*" data-photo="${key}"></label></span>` : ''}`;
  };
  const obsHtml = (c) => {
    const n = R.cells.__obs || c.obs || 4;
    const rows = Array.from({ length: n }, (_, i) => {
      const k = obsKey(c.key, i), lk = obsKey(c.key, i, 'label'), ph = photoIdx(k)[0];
      return `<div class="rp-obs-row" data-obs="${i}">
        <div class="rp-obs-fig"><input class="rp-obs-label" data-label="${lk}" value="${esc(R.cells[lk] ?? '')}" placeholder="${CIRCLED[i] || i + 1} 이름(모르면 번호)" ${teach ? 'readonly' : ''} aria-label="대상 번호·이름">
          ${ph ? `<img src="${ph.p.src}" alt="관찰그림 ${i + 1}">` : '<div class="rp-obs-blank">관찰그림</div>'}
          ${teach ? '' : `<div class="rp-obs-tools no-print"><button type="button" data-draw-obs="${k}">✎ ${ph ? '고쳐 그리기' : '그리기'}</button><label>📷 사진<input type="file" accept="image/*" data-photo="${k}" data-one></label>${ph ? `<button type="button" data-del-photo="${ph.i}">지우기</button>` : ''}</div>`}</div>
        <div class="rp-obs-text">${subText(k, '색 · 모양 · 크기(cm) · 만져 본 느낌 · 확인한 것 → 추정', c.lines)}</div></div>`;
    }).join('');
    return `<div class="rp-obs"><div class="rp-obs-head"><span>관찰그림</span><span>설명</span></div>${rows}</div>
      ${teach ? '' : `<div class="rp-ctl no-print"><button type="button" data-obs-add="${c.key}">+ 대상 더하기</button>${n > 1 ? `<button type="button" data-obs-del="${c.key}">− 마지막 대상 빼기</button>` : ''}</div>`}`;
  };
  const vennHtml = (c) => {
    const la = `${c.key}.la`, lb = `${c.key}.lb`;
    return `<div class="rp-venn"><div class="ring a" aria-hidden="true"></div><div class="ring b" aria-hidden="true"></div>
      <input class="rp-venn-name a" data-label="${la}" value="${esc(R.cells[la] || '')}" placeholder="ㄱ 이름·번호" ${teach ? 'readonly' : ''} aria-label="왼쪽 대상">
      <input class="rp-venn-name b" data-label="${lb}" value="${esc(R.cells[lb] || '')}" placeholder="ㄴ 이름·번호" ${teach ? 'readonly' : ''} aria-label="오른쪽 대상">
      ${VENN.map((v) => `<div class="rp-venn-zone ${v}"><b>${v === 'both' ? '같은 점' : v === 'a' ? 'ㄱ만' : 'ㄴ만'}</b>${subText(`${c.key}.${v}`, VENN_ASK[v], c.lines)}</div>`).join('')}</div>`;
  };
  // 분류 나무 — 갈래마다 기준 질문 + 대상 칩(누르면 그렇다 ↔ 그렇지 않다). 끝까지 하나씩 남으면 완성.
  const getTree = (key) => { const items = objLabels(); R.trees[key] = R.trees[key] ? syncTree(R.trees[key], items) : treeNode(items); return R.trees[key]; };
  const treeHtml = (key) => {
    const root = getTree(key), issues = treeIssues(root);
    const nodeHtml = (n, path, side) => {
      const chips = n.items.map((it) => `<button type="button" class="chip ${n.yes ? (n.yes.items.includes(it) ? 'y' : 'n') : ''}" data-tree-chip="${path}" data-item="${esc(it)}" ${teach || !n.yes ? 'disabled' : ''} title="${n.yes ? '눌러서 그렇다 ↔ 그렇지 않다' : ''}">${esc(it)}</button>`).join('');
      const leaf = n.items.length <= 1;
      return `<li class="tn ${leaf ? 'leaf' : ''}">${side ? `<span class="side ${side}">${side === 'y' ? '그렇다' : '그렇지 않다'}</span>` : ''}
        <div class="box"><div class="chips">${chips || '<span class="none">(비어 있음)</span>'}</div>
          ${leaf ? '' : `<div class="q">${teach ? `<span class="qtext">${esc(n.q) || '<i>기준 없음</i>'}</span>` : `<input data-tree-q="${path}" value="${esc(n.q)}" placeholder="분류 기준: 그렇다/그렇지 않다로 답하는 질문">`}
            ${teach ? '' : n.yes ? `<button type="button" class="mini" data-tree-unsplit="${path}">갈래 지우기</button>` : `<button type="button" class="mini primary" data-tree-split="${path}">두 갈래로 나누기</button>`}</div>`}</div>
        ${n.yes ? `<ul>${nodeHtml(n.yes, path + '.y', 'y')}${nodeHtml(n.no, path + '.n', 'n')}</ul>` : ''}</li>`;
    };
    const msg = issues.length ? issues.map((x) => x.kind === 'noq' ? `${x.depth}단계: 기준 질문 없이 나눴어요` : x.kind === 'empty' ? `${x.depth}단계: 한쪽 갈래가 비었어요 — 칩을 눌러 옮겨요` : `${x.items.join('·')}: 아직 더 나눌 수 있어요`).join(' · ') : '끝까지 하나씩 나뉘었어요 ✓';
    return `<ul class="rp-tree">${nodeHtml(root, 'r', '')}</ul><p class="rp-tree-msg no-print ${issues.length ? '' : 'ok'}">${esc(msg)}</p>`;
  };
  // 수상작 아이디어 갤러리 — 내 아이디어(gate 칸)를 먼저 써야 열린다
  const gateKey = () => T.cells.find((c) => c.gate)?.key;
  const gateOpen = () => !gateKey() || String(R.cells[gateKey()] || '').trim().length >= 15;
  const galleryBtn = (key) => teach ? '' : `<div class="rp-gallery-open no-print"><button type="button" class="rp-photo-add" data-gallery="${key}" ${gateOpen() ? '' : 'disabled'}>💡 수상작에서 아이디어 얻기</button><small data-gate-msg>${gateOpen() ? '어떤 기법으로 풀었는지 보고, 빌린 것과 바꾼 것을 써요.' : `먼저 「${esc(T.cells.find((c) => c.gate)?.title || '')}」 칸에 내 생각을 써야 열려요.`}</small></div>`;
  const openGallery = (key) => {
    let tech = '', scene = '';
    const $g = document.createElement('div'); $g.className = 'sk-modal rp-gallery'; $g.setAttribute('role', 'dialog'); $g.setAttribute('aria-label', '수상작 아이디어');
    const list = () => WORKS.filter((w) => (!tech || w.tech.includes(tech)) && (!scene || w.scene === scene)).sort((a, b) => (a.level === R.level ? -1 : 0) - (b.level === R.level ? -1 : 0));
    const techName = (id) => TECHNIQUES.find((t) => t.id === id)?.name || id;
    const draw = () => {
      const ws = list();
      $g.innerHTML = `<div class="sk-box"><header class="sk-head"><b>💡 수상작에서 아이디어 얻기</b><span class="sk-sp"></span><button type="button" class="sk-btn" data-close>닫기</button></header>
        <p class="rp-g-lead">발명은 따라 하기에서 시작해요. 무엇을 만들었는지보다 <b>어떤 방법으로 불편을 풀었는지</b>를 빌려 와, 내 불편에 맞게 바꿔요. 수상작 대부분은 <b>가족이나 주변 사람이 실제로 겪은 불편</b>에서 출발했어요.</p>
        <p class="rp-g-judge">${JUDGING.map((j) => `<span><b>${esc(j.contest)}</b> ${j.items.map(esc).join(' · ')}</span>`).join('')}</p>
        <div class="rp-g-filter"><span>기법</span>${[{ id: '', name: '전체' }, ...TECHNIQUES].map((t) => `<button type="button" data-tech="${t.id}" aria-pressed="${tech === t.id}" title="${esc(t.ask || '')}">${esc(t.name)}</button>`).join('')}</div>
        <div class="rp-g-filter"><span>장면</span>${[{ id: '', name: '전체' }, ...SCENES].map((t) => `<button type="button" data-scene="${t.id}" aria-pressed="${scene === t.id}">${esc(t.name)}</button>`).join('')}</div>
        ${tech ? `<p class="rp-g-ask">「${esc(techName(tech))}」 — ${esc(TECHNIQUES.find((t) => t.id === tech).ask)}</p>` : ''}
        <div class="rp-g-list">${ws.length ? ws.map((w, i) => `<article class="rp-g-card"><div class="tags">${w.tech.map((t) => `<em>${esc(techName(t))}</em>`).join('')}<span>${w.level === 'mid' ? '중등' : '초등'}</span></div>
          <h4>${esc(w.name)}</h4><p><b>불편</b> ${esc(w.problem)}</p><p><b>아이디어</b> ${esc(w.idea)}</p>${w.principle ? `<p><b>원리</b> ${esc(w.principle)}</p>` : ''}
          <small>${esc(w.award)}${w.src ? ` · <a href="${esc(w.src)}" target="_blank" rel="noopener">출처</a>` : ''}</small><button type="button" data-borrow="${WORKS.indexOf(w)}">이 방법 빌리기 →</button></article>`).join('') : '<p class="rp-g-none">아직 이 조건의 수상작이 없어요. 다른 기법을 눌러 보세요.</p>'}</div></div>`;
      $g.querySelector('[data-close]').onclick = close;
      $g.querySelectorAll('[data-tech]').forEach((b) => { b.onclick = () => { tech = b.dataset.tech; draw(); }; });
      $g.querySelectorAll('[data-scene]').forEach((b) => { b.onclick = () => { scene = b.dataset.scene; draw(); }; });
      $g.querySelectorAll('[data-borrow]').forEach((b) => { b.onclick = () => {
        const w = WORKS[+b.dataset.borrow], line = `· 빌린 기법: ${w.tech.map(techName).join('·')} — 「${w.name}」(${w.award})은 ${w.idea}\n  → 내 발명에서는: `;
        R.cells[key] = (String(R.cells[key] || '').trim() ? R.cells[key].replace(/\s*$/, '') + '\n' : '') + line; editing.add(key); save(R); close(); shell();
        const ta = $app.querySelector(`textarea[data-cell="${key}"]`); if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
      }; });
    };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    const close = () => { document.removeEventListener('keydown', onKey); $g.remove(); document.body.classList.remove('sk-open'); };
    document.addEventListener('keydown', onKey); document.body.appendChild($g); document.body.classList.add('sk-open'); draw();
  };
  const menuHtml = (key, kind) => { const list = (kind === 'guide' ? cfg.guide : cfg.asks)[key] || []; return `<div class="menu">${list.map((t) => `<button type="button" data-preset="${kind}" data-key="${key}">${esc(t)}</button>`).join('')}<form data-custom="${kind}" data-key="${key}"><input placeholder="직접 쓰기…" aria-label="직접 쓰기"><button type="submit">넣기</button></form></div>`; };
  const noteHtml = (n) => `<div class="rp-sticky ${n.kind} ${n.done ? 'done' : ''}" data-note="${n.id}">${esc(n.text)}${teach ? '<button type="button" class="x" data-del-note="' + n.id + '" aria-label="메모 지우기">×</button>' : `<label class="ok"><input type="checkbox" data-done-note="${n.id}" ${n.done ? 'checked' : ''}> 고쳤어요</label>`}</div>`;
  const tableHtml = (c) => {
    const t = R.level === 'mid' ? withMean(R.table) : R.table, isMean = (j) => t.columns[j] === '평균' && R.level === 'mid';
    const rows = t.rows.map((r, i) => `<tr>${r.map((v, j) => isMean(j) ? `<td class="mean">${esc(v)}</td>` : `<td contenteditable="${teach ? 'false' : 'true'}" data-r="${i}" data-c="${j}">${esc(v)}</td>`).join('')}</tr>`).join('');
    const chart = c?.chart === false ? null : chartData(t);
    return `<div class="rp-table-wrap"><table class="rp-table"><thead><tr>${t.columns.map((h, j) => isMean(j) ? `<th>${esc(h)}</th>` : `<th contenteditable="${teach ? 'false' : 'true'}" data-h="${j}">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>
      ${teach ? '' : '<div class="rp-ctl no-print"><button type="button" data-row="+">+ 줄</button><button type="button" data-row="-">− 줄</button><button type="button" data-col="+">+ 열</button><button type="button" data-col="-">− 열</button></div>'}
      <div class="rp-chart">${chart ? chartSvg(chart) : ''}</div>
      <div class="rp-photos" data-photos="result">${photosHtml('result', 4)}</div>`;
  };

  // ── 글 조각 그리기(첨삭 표시 포함) ──
  const drawView = (key) => {
    const $v = $app.querySelector(`[data-view="${key}"]`), $lost = $app.querySelector(`[data-lost="${key}"]`); if (!$v) return;
    const marks = R.marks.filter((m) => m.cell === key), { parts, lost } = segments(R.cells[key] || '', marks);
    let n = 0; const noteNo = new Map(marks.filter((m) => m.kind === 'note').map((m) => [m.id, ++n]));
    $v.innerHTML = parts.map((p) => {
      const cls = ['p', ...p.marks.map((m) => m.kind)].join(' '), fix = p.marks.find((m) => m.kind === 'fix'), note = p.marks.find((m) => m.kind === 'note');
      const ids = p.marks.map((m) => m.id).join(' ');
      const last = note && parts.filter((q) => q.marks.includes(note)).at(-1) === p;
      return `<span class="${cls}" data-s="${p.s}" data-ids="${ids}" ${fix ? `data-fix="${esc(fix.text)}"` : ''}>${esc(p.text)}${last ? `<i class="no" data-bubble="${note.id}">${noteNo.get(note.id)}</i></span><span class="rp-bubble ${teach ? '' : 'hidden'}" data-bubble-of="${note.id}" contenteditable="false">${esc(note.text)}</span>` : '</span>'}`;
    }).join('');
    if ($lost) { $lost.hidden = !lost.length; $lost.innerHTML = lost.length ? '글이 바뀌어 자리를 잃은 표시: ' + lost.map((m) => `<b>${esc(m.t)}</b>${m.kind === 'fix' ? ` → ${esc(m.text)}` : m.kind === 'note' ? ` 💬 ${esc(m.text)}` : ''}`).join(', ') : ''; }
  };
  const drawAll = () => textKeys(T, R.cells).forEach(drawView);

  // ── 선택 → 도구 막대(선생님) ──
  let $tools = null;
  const killTools = () => { $tools?.remove(); $tools = null; };
  const selectionIn = () => {
    const sel = getSelection(); if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
    const r = sel.getRangeAt(0), $v = r.commonAncestorContainer.nodeType === 1 ? r.commonAncestorContainer.closest?.('.rp-view') : r.commonAncestorContainer.parentElement?.closest('.rp-view');
    if (!$v) return null;
    const off = (node, o) => { const span = (node.nodeType === 1 ? node : node.parentElement)?.closest('.p'); if (!span || !$v.contains(span)) return null; if (node.nodeType !== 3) return +span.dataset.s + (o ? span.firstChild?.textContent.length || 0 : 0); return +span.dataset.s + o; };
    const s = off(r.startContainer, r.startOffset), e = off(r.endContainer, r.endOffset); if (s == null || e == null || e <= s) return null;
    const key = $v.dataset.view, t = (R.cells[key] || '').slice(s, e); if (!t.trim()) return null;
    return { key, s, e, t, rect: r.getBoundingClientRect() };
  };
  const showTools = (sel) => {
    killTools(); $tools = document.createElement('div'); $tools.className = 'rp-tools no-print';
    $tools.innerHTML = '<button data-k="hl">🖍 형광펜</button><button data-k="fix">✍ 고치기</button><button data-k="note">💬 말풍선</button><button data-k="del">🗑</button>';
    document.body.appendChild($tools);
    const place = () => { const w = $tools.offsetWidth, x = Math.max(8, Math.min(innerWidth - w - 8, sel.rect.left + scrollX)), y = sel.rect.top + scrollY - $tools.offsetHeight - 10; $tools.style.left = x + 'px'; $tools.style.top = Math.max(scrollY + 8, y) + 'px'; };
    place();
    $tools.onmousedown = (e) => e.preventDefault();   // 선택이 풀리지 않게
    $tools.onclick = (e) => {
      const b = e.target.closest('button'); if (!b || !b.dataset.k || b.dataset.k === 'cancel') return; const k = b.dataset.k;   // 넣기 단추(data-ok)는 제 처리기가 맡는다
      if (k === 'del') { R.marks = R.marks.filter((m) => m.cell !== sel.key || !(m.s < sel.e && m.e > sel.s)); commit(sel.key); killTools(); return; }
      if (k === 'hl') { addMark({ kind: 'hl', ...sel }); killTools(); return; }
      $tools.innerHTML = `<input placeholder="${k === 'fix' ? '바른 말' : '한마디'}" aria-label="${k === 'fix' ? '바른 말' : '말풍선'}"><button data-ok="${k}">넣기</button><button data-k="cancel">취소</button>`; place();
      const $in = $tools.querySelector('input'); $in.focus(); $tools.onmousedown = null;
      const ok = () => { const text = $in.value.trim(); if (!text) return; addMark({ kind: k, text, ...sel }); killTools(); };
      $tools.querySelector('[data-ok]').onclick = ok; $in.onkeydown = (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); ok(); } if (ev.key === 'Escape') killTools(); };
      $tools.querySelector('[data-k="cancel"]').onclick = killTools;
    };
  };
  const addMark = ({ kind, key, s, e, t, text }) => { R.marks.push({ id: newId(), cell: key, s, e, t, kind, text: text || '' }); commit(key); getSelection()?.removeAllRanges(); };
  const commit = (key) => { if (!save(R)) alert('저장 공간이 부족해요. 사진이나 그림을 줄여 보세요.'); if (key) drawView(key); refreshCount(); };
  const refreshCount = () => { const $c = $app.querySelector('.rp-bar .count'); if ($c) { const open = R.notes.filter((n) => !n.done).length; $c.textContent = `${R.marks.length ? `표시 ${R.marks.length}` : ''}${R.notes.length ? ` · 메모 ${R.notes.length}(남은 것 ${open})` : ''}`; } };

  // ── 사진·그림 ──
  const shrink = (file) => new Promise((res) => {
    const img = new Image(); img.onload = () => { const k = Math.min(1, 900 / Math.max(img.width, img.height)), c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(img.src); res(c.toDataURL('image/jpeg', 0.8)); }; img.onerror = () => res(null); img.src = URL.createObjectURL(file);
  });
  const putPhoto = (key, src, { one = false, drawn = false, at = -1 } = {}) => {
    const backup = R.photos.slice();
    if (at >= 0) R.photos[at] = { ...R.photos[at], src, drawn };
    else if (one) { const old = R.photos.findIndex((p) => p.cell === key); if (old >= 0) R.photos[old] = { ...R.photos[old], src, drawn }; else R.photos.push({ src, cap: '', cell: key, drawn }); }
    else R.photos.push({ src, cap: '', cell: key, drawn });
    if (!save(R)) { R.photos = backup; alert('그림이 너무 커서 저장하지 못했어요. 다른 그림이나 사진을 하나 지워 보세요.'); return; }
    shell();
  };
  const sketchTitle = (key) => { const m = key.match(/^(.+)\.(\d+)$/); return m ? `관찰그림 ${R.cells[obsKey(m[1], +m[2], 'label')] || CIRCLED[+m[2]] || +m[2] + 1}` : (T.cells.find((c) => c.key === key)?.title || '그림'); };
  const draw = async (key, opts) => { const src = await openSketch({ title: sketchTitle(key), src: opts.src || null, reference, guideLine: R.contest === 'nature' }); if (src) putPhoto(key, src, { ...opts, drawn: true }); };

  // 시트 전체에 한 번만 거는 것(다시 그릴 때 겹쳐 걸리지 않게 shell에서만 부른다)
  function bindSheet() {
    const $sheet = $app.querySelector('#rp-sheet');
    $sheet.addEventListener('click', (e) => {
      const no = e.target.closest('.no'); if (no) { const b = $sheet.querySelector(`[data-bubble-of="${no.dataset.bubble}"]`); b?.classList.toggle('hidden'); e.stopPropagation(); return; }
      if (!teach) return;
      const p = e.target.closest('.rp-view .p'); if (p && p.dataset.ids && getSelection()?.isCollapsed) { const ids = p.dataset.ids.split(' '); R.marks = R.marks.filter((m) => !ids.includes(m.id)); commit(p.closest('.rp-view').dataset.view); }
    });
    if (teach) { const onUp = () => setTimeout(() => { const sel = selectionIn(); if (sel) showTools(sel); else if (!$tools?.contains(document.activeElement)) killTools(); }, 10); $sheet.addEventListener('mouseup', onUp); $sheet.addEventListener('touchend', onUp); $sheet.addEventListener('keyup', (e) => { if (e.shiftKey) onUp(); }); }
  }
  const switchForm = (ct, lv) => {
    const T2 = formTemplate(ct, lv); if (ct === R.contest && lv === R.level) return;
    if (!confirm(`${contestOf(ct).title} · ${T2.title}으로 바꿀까요? 쓴 글은 같은 이름의 칸에 남고, 새 칸은 자료로 미리 채워져요.`)) return;
    R.contest = ct; R.level = lv; setForm();
    for (const [k, v] of Object.entries(prefill(u, cfg, lv, ct))) if (!String(R.cells[k] ?? '').trim()) R.cells[k] = v;
    if (!tableTouched(R.table)) R.table = emptyTable(cfg);
    resetEditing(); commit(); shell();
  };
  const bindTree = ($w) => {
    const key = $w.dataset.tree, root = () => getTree(key), redraw = () => { save(R); $w.innerHTML = treeHtml(key); bindTree($w); };
    $w.querySelectorAll('[data-tree-q]').forEach((i) => { i.oninput = () => { const n = treeAt(root(), i.dataset.treeQ); if (n) { n.q = i.value; save(R); } }; i.onchange = redraw; });
    $w.querySelectorAll('[data-tree-split]').forEach((b) => { b.onclick = () => { const n = treeAt(root(), b.dataset.treeSplit); if (n) { splitTree(n, n.items.slice(0, Math.ceil(n.items.length / 2))); redraw(); } }; });
    $w.querySelectorAll('[data-tree-unsplit]').forEach((b) => { b.onclick = () => { const n = treeAt(root(), b.dataset.treeUnsplit); if (n && (!n.yes?.yes && !n.no?.yes || confirm('아래 갈래도 함께 지워져요. 지울까요?'))) { unsplitTree(n); redraw(); } }; });
    $w.querySelectorAll('[data-tree-chip]').forEach((b) => { b.onclick = () => { const n = treeAt(root(), b.dataset.treeChip); if (!n?.yes) return; const it = b.dataset.item, y = n.yes.items.includes(it) ? n.yes.items.filter((x) => x !== it) : [...n.yes.items, it]; splitTree(n, y); redraw(); }; });
  };
  function bind() {
    const $sheet = $app.querySelector('#rp-sheet');
    drawAll();
    $app.querySelectorAll('[data-mode]').forEach((b) => { b.onclick = () => { teach = b.dataset.mode === 'teach'; sessionStorage.setItem(MODE_KEY, teach ? 'teach' : 'study'); killTools(); shell(); }; });
    $app.querySelectorAll('[data-level]').forEach((b) => { b.onclick = () => switchForm(R.contest, b.dataset.level); });
    $app.querySelectorAll('[data-contest]').forEach((b) => { b.onclick = () => switchForm(b.dataset.contest, R.level); });
    $app.querySelector('[data-reset]')?.addEventListener('click', () => { if (!confirm('이 보고서를 지우고 처음부터 쓸까요? 그림·사진과 선생님 첨삭도 함께 지워져요.')) return; R = emptyReport(u, cfg, R.level, R.contest); R.trees = {}; resetEditing(); commit(); shell(); });
    $app.querySelector('[data-clear-marks]')?.addEventListener('click', () => { if (!confirm('첨삭 표시와 메모를 모두 지울까요?')) return; R.marks = []; R.notes = []; commit(); shell(); });
    $app.querySelectorAll('[data-print]').forEach((b) => { b.onclick = () => { const clean = b.dataset.print === 'clean'; $sheet.classList.toggle('hide-marks', clean); $app.querySelectorAll('.rp-text.editing').forEach((c) => c.classList.remove('editing')); drawAll(); print(); setTimeout(() => { $sheet.classList.remove('hide-marks'); }, 500); }; });
    // 이름·날짜·점검·이름표
    $app.querySelectorAll('[data-who]').forEach((i) => { i.oninput = () => { R.cells['__' + i.dataset.who] = i.value; save(R); }; });
    $app.querySelectorAll('[data-label]').forEach((i) => { i.oninput = () => { R.cells[i.dataset.label] = i.value; save(R); }; i.onchange = () => { $app.querySelectorAll('[data-tree]').forEach(($w) => { $w.innerHTML = treeHtml($w.dataset.tree); bindTree($w); }); }; });
    $app.querySelectorAll('[data-check]').forEach((i) => { i.onchange = () => { const set = new Set(R.cells.__checks || []); i.checked ? set.add(+i.dataset.check) : set.delete(+i.dataset.check); R.cells.__checks = [...set]; save(R); }; });
    // 글 칸(학생)
    $app.querySelectorAll('textarea[data-cell]').forEach((ta) => {
      const grow = () => { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 2 + 'px'; }; grow();
      let t = 0; ta.oninput = () => {
        R.cells[ta.dataset.cell] = ta.value; grow(); clearTimeout(t); t = setTimeout(() => { save(R); drawView(ta.dataset.cell); }, 250);
        if (ta.dataset.cell === gateKey()) $app.querySelectorAll('.rp-gallery-open').forEach(($o) => { const ok = gateOpen(); $o.querySelector('button').disabled = !ok; $o.querySelector('[data-gate-msg]').textContent = ok ? '어떤 기법으로 풀었는지 보고, 빌린 것과 바꾼 것을 써요.' : `먼저 「${T.cells.find((c) => c.gate)?.title || ''}」 칸에 내 생각을 써야 열려요.`; });
      };
    });
    $app.querySelectorAll('[data-edit]').forEach((b) => { b.onclick = () => { const $t = b.closest('.rp-text'); $t.classList.add('editing'); editing.add(b.dataset.edit); const ta = $t.querySelector('textarea'); ta.focus(); ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 2 + 'px'; }; });
    $app.querySelectorAll('[data-done]').forEach((b) => { b.onclick = () => { const $t = b.closest('.rp-text'); $t.classList.remove('editing'); editing.delete(b.dataset.done); save(R); drawView(b.dataset.done); }; });
    // 관찰그림 대상 더하기·빼기
    $app.querySelectorAll('[data-obs-add]').forEach((b) => { b.onclick = () => { const c = T.cells.find((x) => x.key === b.dataset.obsAdd); const n = R.cells.__obs || c.obs || 4; if (n >= 12) return; R.cells.__obs = n + 1; editing.add(obsKey(c.key, n)); commit(); shell(); }; });
    $app.querySelectorAll('[data-obs-del]').forEach((b) => { b.onclick = () => { const c = T.cells.find((x) => x.key === b.dataset.obsDel); const n = R.cells.__obs || c.obs || 4, k = obsKey(c.key, n - 1); if ((R.cells[k] || '').trim() || R.photos.some((p) => p.cell === k)) { if (!confirm('마지막 대상의 글과 그림을 지울까요?')) return; } delete R.cells[k]; delete R.cells[obsKey(c.key, n - 1, 'label')]; R.photos = R.photos.filter((p) => p.cell !== k); R.marks = R.marks.filter((m) => m.cell !== k); R.cells.__obs = n - 1; commit(); shell(); }; });
    // 분류 나무 · 수상작 갤러리
    $app.querySelectorAll('[data-tree]').forEach(bindTree);
    $app.querySelectorAll('[data-gallery]').forEach((b) => { b.onclick = () => { if (gateOpen()) openGallery(b.dataset.gallery); }; });
    // 표
    $app.querySelectorAll('.rp-table [contenteditable="true"]').forEach((td) => {
      td.onblur = () => { if (td.dataset.h != null) R.table.columns[+td.dataset.h] = td.textContent.trim(); else R.table.rows[+td.dataset.r][+td.dataset.c] = td.textContent.trim(); const cols = R.table.columns.filter((c) => c !== '평균'); R.table = { columns: cols, rows: R.table.rows.map((r) => r.slice(0, cols.length)) }; save(R); redrawTable(); };
      td.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); td.blur(); } };
    });
    $app.querySelectorAll('[data-row]').forEach((b) => { b.onclick = () => { const n = R.table.columns.filter((c) => c !== '평균').length; if (b.dataset.row === '+') R.table.rows.push(Array(n).fill('')); else if (R.table.rows.length > 1) R.table.rows.pop(); save(R); redrawTable(); }; });
    $app.querySelectorAll('[data-col]').forEach((b) => { b.onclick = () => { const cols = R.table.columns.filter((c) => c !== '평균'); if (b.dataset.col === '+') { cols.push(`${cols.length}회`); R.table.rows.forEach((r) => r.push('')); } else if (cols.length > 2) { cols.pop(); R.table.rows.forEach((r) => r.splice(cols.length)); } R.table.columns = cols; save(R); redrawTable(); }; });
    // 사진·그림
    $app.querySelectorAll('input[data-photo]').forEach(($ph) => { $ph.onchange = async () => { const f = $ph.files?.[0]; if (!f) return; const src = await shrink(f); if (src) putPhoto($ph.dataset.photo, src, { one: $ph.hasAttribute('data-one') }); }; });
    $app.querySelectorAll('[data-draw-obs]').forEach((b) => { b.onclick = () => { const k = b.dataset.drawObs, ph = R.photos.find((p) => p.cell === k); draw(k, { one: true, src: ph?.src }); }; });
    $app.querySelectorAll('[data-draw-new]').forEach((b) => { b.onclick = () => draw(b.dataset.drawNew, {}); });
    $app.querySelectorAll('[data-redraw]').forEach((b) => { b.onclick = () => { const i = +b.dataset.redraw; draw(R.photos[i].cell || 'result', { at: i, src: R.photos[i].src }); }; });
    $app.querySelectorAll('[data-del-photo]').forEach((b) => { b.onclick = () => { R.photos.splice(+b.dataset.delPhoto, 1); save(R); shell(); }; });
    $app.querySelectorAll('[data-cap]').forEach((i) => { i.oninput = () => { R.photos[+i.dataset.cap].cap = i.value; save(R); }; });
    // 메모(가이드·질문)
    $app.querySelectorAll('[data-preset]').forEach((b) => { b.onclick = () => { addNote(b.dataset.key, b.dataset.preset, b.textContent); b.closest('details').open = false; }; });
    $app.querySelectorAll('form[data-custom]').forEach((f) => { f.onsubmit = (e) => { e.preventDefault(); const t = f.querySelector('input').value.trim(); if (!t) return; addNote(f.dataset.key, f.dataset.custom, t); f.closest('details').open = false; f.reset(); }; });
    $app.querySelectorAll('.rp-notes').forEach(bindNotes);
  }
  const addNote = (key, kind, text) => { R.notes.push({ id: newId(), cell: key, kind, text, done: false }); commit(); redrawNotes(key); };
  const redrawNotes = (key) => { const $n = $app.querySelector(`[data-notes="${key}"]`); if ($n) { $n.innerHTML = R.notes.filter((n) => n.cell === key).map(noteHtml).join(''); bindNotes($n); } };
  function bindNotes($n) {
    $n.querySelectorAll('[data-del-note]').forEach((b) => { b.onclick = () => { R.notes = R.notes.filter((n) => n.id !== b.dataset.delNote); commit(); redrawNotes(b.closest('.rp-cell').dataset.key); }; });
    $n.querySelectorAll('[data-done-note]').forEach((i) => { i.onchange = () => { const n = R.notes.find((x) => x.id === i.dataset.doneNote); if (n) { n.done = i.checked; commit(); i.closest('.rp-sticky').classList.toggle('done', i.checked); } }; });
  }
  const redrawTable = () => {
    const $c = $app.querySelector('.rp-cell[data-key="result"] .rp-body'); if (!$c) return;
    const keep = [...$c.children].filter((el) => el.matches('.rp-notes') || (el.matches('.rp-ctl') && el.querySelector('details')));
    $c.innerHTML = tableHtml(T.cells.find((x) => x.key === 'result')); keep.forEach((el) => $c.appendChild(el)); bind();
  };

  shell();
  return { destroy() { killTools(); } };
}

// 표 → SVG 그래프(꺾은선·막대). 축 이름은 열 머리글, 단위는 아이가 머리글에 적는다.
export function chartSvg(c) {
  const W = 560, H = 240, L = 46, R = 16, Tp = 18, B = 40, w = W - L - R, h = H - Tp - B;
  const max = Math.max(1, c.max), min = Math.min(0, c.min), span = max - min || 1, y = (v) => Tp + h - ((v - min) / span) * h;
  const colors = ['#2f7d6d', '#d9a441', '#5a7fb5', '#c94f4f', '#8e6bbf', '#6c7a89'];
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((k) => { const v = min + span * k; return `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="#eee"/><text x="${L - 6}" y="${y(v) + 4}" font-size="11" text-anchor="end" fill="#666">${Math.round(v * 10) / 10}</text>`; }).join('');
  let body = '';
  if (c.type === 'line') {
    const n = c.x.length, x = (j) => L + (n === 1 ? w / 2 : (j / (n - 1)) * w);
    body = c.series.map((s, i) => { const pts = s.values.map((v, j) => (v == null ? null : `${x(j)},${y(v)}`)).filter(Boolean); return `<polyline points="${pts.join(' ')}" fill="none" stroke="${colors[i % 6]}" stroke-width="2.5"/>${s.values.map((v, j) => (v == null ? '' : `<circle cx="${x(j)}" cy="${y(v)}" r="4" fill="${colors[i % 6]}"/>`)).join('')}`; }).join('')
      + c.x.map((t, j) => `<text x="${x(j)}" y="${H - B + 16}" font-size="12" text-anchor="middle" fill="#333">${esc(t)}</text>`).join('')
      + c.series.map((s, i) => `<rect x="${L + i * 110}" y="${H - 14}" width="12" height="12" fill="${colors[i % 6]}"/><text x="${L + i * 110 + 16}" y="${H - 4}" font-size="12" fill="#333">${esc(s.name)}</text>`).join('');
  } else {
    const n = c.series.length, bw = Math.min(60, (w / n) * 0.6), x = (i) => L + ((i + 0.5) / n) * w;
    body = c.series.map((s, i) => { const v = s.values[0]; return v == null ? '' : `<rect x="${x(i) - bw / 2}" y="${y(Math.max(v, 0))}" width="${bw}" height="${Math.abs(y(v) - y(0))}" fill="${colors[i % 6]}" rx="3"/><text x="${x(i)}" y="${y(v) - 6}" font-size="12" text-anchor="middle" fill="#333">${v}</text><text x="${x(i)}" y="${H - B + 16}" font-size="12" text-anchor="middle" fill="#333">${esc(s.name)}</text>`; }).join('');
  }
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="결과 그래프(${c.type === 'line' ? '꺾은선' : '막대'})">${ticks}<line x1="${L}" x2="${L}" y1="${Tp}" y2="${Tp + h}" stroke="#999"/><line x1="${L}" x2="${W - R}" y1="${y(0)}" y2="${y(0)}" stroke="#999"/>${body}</svg>`;
}
